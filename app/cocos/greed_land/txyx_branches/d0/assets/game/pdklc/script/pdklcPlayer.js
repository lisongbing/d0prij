let DEF = require('pdklcDef');

let LG_Sta = DEF.PlayerSta;

let LG_opt = DEF.PlayerOpt;
let LG_optStr = DEF.PlayerOptStr;

// 客户端先出牌开关
let iscltout = false;

cc.Class({
    /* =============================================================================================== */

    dbgstr: function (info) {
        let s = '玩家'; //d2Player

        if (this.d) {
            s += ' ' + this.d.name + '('+this.d.uid+')';

            if (eq64(this.gm.selfUID, this.d.uid)) {
                s += ' 自己';
            }
        }

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化玩家
    init: function (data, game) {
        cc.log(this.dbgstr('初始化 ' + data.uid));

        this.gm = game;  // 游戏主模块（Mgr）

        // 初始化操作函数
        this.initOptFun();

        // 核心数据
        this.upCore(data);
        
        // 关联视图
        this.linkView();
    },

    // 初始化操作函数
    initOptFun: function () {
        cc.log(this.dbgstr('initOptFun'));

        let kf = {};
        
        //准备 庄家 发牌
        kf[LG_opt.Ready.v]      = this.ready.bind(this);
        kf[LG_opt.Zhuang.v]     = this.zhuang.bind(this);
        kf[LG_opt.SendCard.v]   = this.sendCard.bind(this);

        //定头家
        kf[LG_opt.Frist.v]   = this.FristOutPlayer.bind(this);

        //天关
        kf[LG_opt.CanTianguan.v] = this.canTianguan.bind(this);
        kf[LG_opt.Tianguan.v]    = this.tianGuan.bind(this);
        
        //打牌
        kf[LG_opt.CanOutCard.v]    = this.onCanOutCard.bind(this);
        kf[LG_opt.OutCard.v]    = this.onOutCard.bind(this);

        //过　当前局数
        kf[LG_opt.Pass.v]       = this.pass.bind(this);
        kf[LG_opt.CurJushu.v]   = this.curJushu.bind(this);

        //输赢
        kf[LG_opt.WinLose.v]   = this.winLose.bind(this);

        //申请解散
        kf[LG_opt.AskJiesan.v]  = this.askJiesan.bind(this);
        kf[LG_opt.JiesanVote.v] = this.jiesanVote.bind(this);

        //房主变更
        kf[LG_opt.RoomOwner.v] = this.roomOwner.bind(this);

        this.optFun = kf;
    },

    // 更新内核
    upCore: function (data) {
        if (! data) {
            return;
        }
        if (this.d) {
            let str = '';
            
            if (this.gm.isBackPlayMode()) {
                str = (this.d.uid == data.uid) ? '更新数据' : ('替换数据 ' + this.d.uid + ' => ' + data.uid);
            } else {
                str = (this.d.uid.toNumber() == data.uid.toNumber()) ? '更新数据' : ('替换数据 ' + this.d.uid + ' => ' + data.uid);
            }
            
            cc.log(this.dbgstr('upCore ' + str));
        } else {
            cc.log(this.dbgstr('upCore 新数据 ' + data.uid));
        }

        this.d = data;

        if (this.curDeskID >=0 ) {
            if (this.curDeskID != this.d.deskId) {
                cc.log(`位置发生变化 ${this.d.deskId}->${this.curDeskID}`);
                this.curDeskID = this.d.deskId;
                this.linkView();
            }
        } else {
            this.curDeskID = this.d.deskId;
        }

        this.dataPrepare();
    },

    // 数据准备
    dataPrepare: function () {
        if (! this.d) {
            return;
        }

        let expand = this.gm.isBackPlayMode() ? [] : this.d.expand;

        // 是否自己
        this.isSelf = eq64(this.gm.selfUID, this.d.uid);
        
        // 庄
        if (this.gm.isBackPlayMode()) {
            this.isZhuang = (this.gm.roomInfo.dealer == this.d.uid);
        } else {
            this.isZhuang = (this.gm.roomInfo.dealer.toNumber() == this.d.uid.toNumber());
        }
        
        // 准备
        this.isReady = this.d.status > LG_Sta.Free.v;

        // 手牌
        this.d.cards = [];
        this.handCodes = [];
        // 出牌
        this.outCodes = [];

        // 牌
        let bti = this.d.bigtwoInfo;
        if (bti) {
            if (this.isSelf) {
                bti.hand.forEach(code => {
                    this.d.cards.push(code);
                });
                this.d.cards = this.gm.logic.sort(this.d.cards);
                this.d.cardNum = this.d.cards.length;
                this.handCodes = this.d.cards;
            }

            if (bti.putout.length > 0) {
                bti.putout[0].cards.forEach(code => {
                    this.outCodes.push(code);
                });
            }
        } else {
            this.d.cardNum = 0;
        }

        if (this.gm.lastOuter && eq64(this.gm.lastOuter, this.d.uid) ) {
            this.gm.lastOCodes = this.outCodes;
        }

        // 房间信息 空闲 (ri.status == DEF.RMSTA.Free.v)
        let ri = this.gm.roomInfo;

        // 可以打牌 时间
        this.time = -1;
        this.canOutCard = false;
        if (ri.status == DEF.RMSTA.Tianguan.v) {
            this.canTg = (expand[0] == 0); // -1 不可以 0 选择天关  1 天关过 2 天关
        } else {
            if (this.d.uid.eq && this.d.uid.eq(ri.CurPlayer)) {
                this.onCanOutCard();
            }
        }

        // 判断解散
        if(ri.applyStatus && ri.applyStatus.length > 0) {
            for (let i = 1; i < ri.applyStatus.length; i++) {
                if (ri.applyStatus[i].eq(this.d.uid)) {
                    this.voteSta = 1;

                    if (i==1) {
                        this.votetime = ri.applyStatus[0];
                        this.gm.askJiesanUid = this.d.uid;
                    }
                    
                    break;
                }
            }
        } else {
            this.voteSta = null;
            this.votetime = null;
        }
    },

    // 关联视图
    linkView: function () {
        // 游戏主page
        this.pg = this.gm.gameScript;

        if (! this.d) {
            cc.log(this.dbgstr('linkView 没有玩家数据 无法关联视图'));
            return;
        }

        if (! this.pg) {
            cc.log(this.dbgstr('linkView 没有主视图 无法关联视图'));
            return;
        }

        // 玩家对应的视图
        //let v = this.pg.playerView[this.gm.getViewPos(this.d.deskId)];
        let v = this.pg.playerView[this.gm.getViewPos(this.curDeskID)];
        //v = this.pg.playerView[6];

        if (!this.view) {
            // 玩家进入
            this.view = v;
            v.playerJoin(this);
        } else if (this.view.index != v.index) {
            if (eq64(this.d.uid, this.view.player.d.uid)) {
                cc.log('移除在其他位置上的自己');
                this.view.quite();
            }
            
            // 玩家进入
            this.view = v;
            v.playerJoin(this);

            if (this.gm.DMode.isDrive) {
                this.up();
            }
        }
    },


    // 退出
    quite: function () {
        if (! this.view) {
            return;
        }

        cc.log(this.dbgstr('quite'));

        this.d = null;
        this.resetPlay();
        this.view.quite();
        this.view = null;
    },

    // 更新
    up: function () {
        if (! this.view) {
            return;
        }

        cc.log(this.dbgstr('up'));

        this.view.upView();
    },

    // 重置游戏
    resetPlay: function () { 
        // 时间
        this.time = -1;

        // 手牌
        if (this.d) {
            this.d.cards = [];
            this.handCodes = [];
            this.d.cardNum = 0;
        }

        // 出牌
        this.outCodes = [];

        this.isReady = false;

        // 庄
        this.isZhuang = false;

        this.canTg = false;
        // 头家
        this._1stOut = false;

        this.isPass = false;

        //this.votetime = this.voteSta = null;
    },

    /* =====操作========================================================================================== */

    // 操作
    opt: function (opt) {
        {
            /*
            message OP {
                int32 k = 1;
                repeated int64 v = 2;
            }
            */
        }

        let k = opt.k;
        let v = opt.v;

        let ds = this.dbgstr();
        
        if (k == LG_opt.AskJiesan.v){
            ds += LG_opt.AskJiesan.s + '-' + LG_opt.AskJiesan.v + ' ' + v.join(',');
        } else if (k == LG_opt.JiesanVote.v){
            ds += LG_opt.JiesanVote.s + '-' + LG_opt.JiesanVote.v + ' ' + v.join(',');
        } else if (k == LG_opt.BackHall.v){
            ds += LG_opt.BackHall.s + '-' + LG_opt.BackHall.v + ' ' + v.join(',');
        } else if (k == LG_opt.RoomOwner.v){
            ds += LG_opt.RoomOwner.s + '-' + LG_opt.RoomOwner.v + ' ' + v.join(',');
        } else {
            ds += '操作位';

            let ol = [];
            for (let i = 0; i < 32; i++) {
                let o = (1 << i);
                if ((k & o) != 0) {
                    ds += ' ' + (i+1) + '-' +LG_optStr[o].s;
                    ol.push(o);
                }
            }
    
            ds += ' ' + v.join(',');
        }


        // 然后是单一操作
        if (! LG_optStr[k]) {
            ds += ' 没有被分析的操作 ' + k;
        }

        cc.log(ds);

        if (this.optFun[k]) {
            this.optFun[k](v);
        } else {
            cc.error('没有被分配的操作', k)
            return 0;
        }
        

        return (LG_optStr[k] && LG_optStr[k].t) ? LG_optStr[k].t : 0;
    },

    // 准备
    ready: function (v) {
        this.d.status = i64v(v[0]);
        this.isReady = (this.d.status == LG_Sta.Ready.v);
        this.view.upReady();
        this.gm.onPlayerReady(this);
    },
    // 庄家
    zhuang: function (v) {
        this.isZhuang = true;
        this.gm.roomInfo.dealer = this.d.uid;
        this.view.upZhuang();
    },
    // 发牌
    sendCard: function (va) {
        if (!this.isSelf) {
            cc.log('不是自己发牌跳过 这样的情况一般是在回放出现');
            return;
        }

        if (this.gm.isBackPlayMode()) {
            for (const k in this.gm.uidPlayers) {
                let e = this.gm.uidPlayers[k];
                e.d.cards = this.gm.logic.sort(cc.g.clone(e.d.hand_cards));

                if (e.isSelf) {
                    e.handCodes = [];
                    e.d.cardNum = e.handCodes.length;
                } else {
                    e.handCodes = cc.g.clone(e.d.cards);
                    e.d.cardNum = e.handCodes.length;
                    e.view.upHandCard();
                }
            }

            this.pg.sendCard();

            return;
        }

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        //v = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

        this.d.cards = this.gm.logic.sort(v);

        this.handCodes = [];
        this.d.cardNum = this.handCodes.length;

        this.pg.sendCard();
    },
    setHandCode: function (codes) {
        this.handCodes = this.gm.logic.sort(codes);
        this.d.cardNum = this.handCodes.length;
        this.view.upHandCard();
    },

    // 定头家
    FristOutPlayer: function (va) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        this.gm._1st = this.d.uid;
        this._1stOut = true;
    },

    // 天关
    canTianguan: function (va) {
        cc.log(this.dbgstr('canTianguan 可以天关'));

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        this.gm.roomInfo.status = DEF.RMSTA.Tianguan.v;

        if (this.isSelf) {
            this.canTg = true;
            this.pg.upOperate();
        }
    },
    tianGuan: function (va) {
        cc.log(this.dbgstr('tianGuan 天关'));

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        //1过 2天关
        v[0];

        if (v[0]==2) {
            this.gm.audio.tianguan(this.d.sex);
            if (this.isSelf) {
                cc.g.utils.backPlayScaleBtnEffct(this.pg.Button_tianguan, ()=>this.pg.Node_opt.active=false);
            }
        } else {
            if (this.isSelf) {
                cc.g.utils.backPlayScaleBtnEffct(this.pg.Button_pass, ()=>this.pg.Node_opt.active=false);
            }
        }

        this.canTg = false;
    },

    // 打牌
    onCanOutCard: function (v) {
        this.gm.roomInfo.status = DEF.RMSTA.Play.v;

        this.canTg = false;

        this.time = DEF.OptTime;
        this.canOutCard = true;
        this.outCodes = [];

        this._1stOut = (!this.gm.lastOuter || eq64(this.gm.lastOuter, this.d.uid));
        if (this._1stOut) {
            this.gm.lastOuter = null;
            this.gm.lastOType = null;
            this.gm.lastOCodes = null;
        }

        if (this.view) {
            this.view.upDaojishi();
            this.view.upOutCards();
            this.view.onPlayOpt(-1);
        }

        if (this.isSelf) {
            if (this.pg) this.pg.upOperate();
        }
    },
    outCard: function () {
        cc.log(this.dbgstr('outCard 玩家出牌'));

        let codes = this.view.handCardView.getChoosedCode();
        let info = this.gm.logic.getCodesInfo(codes);
        if (info.codes.length < 1) {
            cc.log('没选的有牌');
            this.canOutCard = true;
            this.pg.upOperate();
            return;
        }

        cc.log(info.str);
        cc.log(info.val);
        cc.log(info.codes);

        let Comb = this.gm.logic.getCanOutCombination(codes, this.gm.lastOCodes, this.gm.lastOType, this.handCodes);

        if (Comb.length == 1) {
            this.canOutCard = false;
            this.time = -1;
            this.view.upDaojishi();
    
            cc.log(Comb[0].desc);//cc.g.global.hint(Comb[0].desc);

            info.codes = Comb[0].codes;
            info.codes.push(Comb[0].type);

            if (iscltout) {
                this._lastHandCodes = cc.g.clone(this.handCodes);
                this._lastOType = this.gm.lastOType;
                this._lastOCodes = cc.g.clone(this.gm.lastOCodes);
                this.onOutCard(info.codes, true);
            }

            this.gm.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
        } else if (Comb.length > 1) {
            this.pg.showOutChoose(Comb, (idx)=>{
                this.canOutCard = false;
                this.time = -1;
                this.view.upDaojishi();

                info.codes = Comb[idx].codes;
                info.codes.push(Comb[idx].type);

                if (iscltout) {
                    this._lastHandCodes = cc.g.clone(this.handCodes);
                    this._lastOType = this.gm.lastOType;
                    this._lastOCodes = cc.g.clone(this.gm.lastOCodes);
                    this.onOutCard(info.codes, true);
                }

                this.gm.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
            });
        } else {
            cc.g.global.hint('出牌类型不明确');
            
            // this.pg.showTypeTip((type)=>{
            //     this.canOutCard = false;
            //     this.time = -1;
            //     this.view.upDaojishi();
    
            //     info.codes.push(type);
            //     this.gm.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
            // });
        }

        this.pg.upOperate();
    },
    onOutCard: function (va, isClt) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber(): e);
        });
        
        if (v[0] < 0) {
            v[0]==-1 && cc.g.global.hint('头牌不在出的牌中');
            v[0]==-2 && cc.g.global.hint('打牌人错误');
            v[0]==-3 && cc.g.global.hint('不在手牌中');
            v[0]==-4 && cc.g.global.hint('没有这样的牌型');
            v[0]==-5 && cc.g.global.hint('下家报单必须打最大牌');
            v[0]==-6 && cc.g.global.hint('要不起上家牌');
            v[0]==-7 && cc.g.global.hint('必须出牌');
            v[0]==-8 && cc.g.global.hint('不允许三A炸');
            v[0]==-12 && cc.g.global.hint('不允许四带二');
            v[0]==-13 && cc.g.global.hint('不允许四带三');
            
            (v[0]==-9 || v[0]==-10 || v[0]<-13 ) && cc.g.global.hint('未知错误');

            if (iscltout) {
                //cc.g.global.hint('出牌错误 还原手牌 ', v[0]);
                this.setHandCode(this._lastHandCodes);
                this.gm.lastOType = this._lastOType;
                this.gm.lastOCodes = this._lastOCodes;
                this._lastHandCodes = null;
                this._lastOType = null;
                this._lastOCodes = null;

                this.outCodes = [];
                this.view.upOutCards();
            }

            this.canOutCard = true;
            this.pg.upOperate();
            
            return;
        }

        if (iscltout && this.isSelf) {
            if (!this.gm.isBackPlayMode()) {
                if (isClt) {
                    cc.log('PDK 客户端先出牌');
                } else {
                    if (v.length-1 < this.handCodes.length) {
                        cc.log('PDK 服务器通知出牌 跳过');
                        return;
                    } else {
                        cc.log('PDK 服务器通知出牌 最后一手 只能服务器通知');
                    }
                }
            }
        }

        if (this.isSelf) {
            cc.g.utils.backPlayScaleBtnEffct(this.pg.Button_chupai, ()=>this.pg.Node_opt.active=false);
        }

        this.gm.isPassTurn = false;

        this.outCodes = v; //this.gm.logic.sort(v);
        this.outType = this.outCodes.pop();

        this.gm.lastOuter = this.d.uid;
        this.gm.lastOType = this.outType;
        this.gm.lastOCodes = this.outCodes;
        this._1stOut = false;

        this.gm.upJipaiqi(this.outCodes);

        this.time = -1;
        this.view.upDaojishi();

        if (this.isSelf || this.gm.isBackPlayMode()) {
            this.setHandCode(this.gm.logic.removeCardsFromHand(this.outCodes, this.handCodes));
        } else {
            this.d.cardNum -= this.outCodes.length;
        }

        this.view.upOutCards();
    },

    // 过
    pass: function (va) {
        if (this.pg.Node_opt.active && this.pg.Button_pass.active) {
            //this.gm.isBackPlayMode() && this.isSelf && this.pg.Button_pass.active
            cc.g.utils.backPlayScaleBtnEffct(this.pg.Button_pass, ()=>this.pg.Node_opt.active=false);
        }

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber(): e);
        });

        this.canOutCard = false;
        
        this.time = -1;
        this.view.upDaojishi();

        this.view.onPlayOpt(DEF.PlayerOpt.Pass.v);

        // 跳过的人
        if (v.length > 0) {
            cc.log('跳过的人', v);

            v.forEach(e => {
                this.gm.uidPlayers[e].view.onPlayOpt(DEF.PlayerOpt.Pass.v);
            });

            //强制女性
            this.gm.audio.play('ybq', 2);
        } else {
            this.gm.audio.play('ybq', this.d.sex);
        }
    },

    // 托管
    tuoguan: function (istg) {
        this.d.isAuto = istg;
        this.view.upTuoguan();
    },
 
    curJushu: function (v) {
        this.gm.turnBegin();

        this.gm.roomInfo.curGameNum = v[0].toNumber();
        this.pg.upTurn();

        if (this.gm.roomInfo.curGameNum == 1) {
            this.d.outLineTime = 0;
            this.view.upOnline();
        }
    },

    // 输赢
    winLose: function (v) {
        //cc.error('还没有实现输赢');
    },

    // 申请解散
    askJiesan: function (v) {
        this.voteSta = 1;
        this.pg.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
    },
    // 解散投票
    jiesanVote: function (va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }
            
            v.push(e);
        });

        if (v[0] > 0) {
            this.voteSta = 1;
        } else if (v[0] == 0){
            this.voteSta = -1;
        }
        
        this.pg.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
    },

    //
    roomOwner: function (v) {
        this.gm.roomInfo.owner = this.d.uid;
        this.pg.upFangzhu();
    },

    // 在线情况
    upOnline: function (va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }
            
            v.push(e);
        });

        this.d.online = v[0]==1;
        this.d.outLineTime = 0;
        this.view.upOnline();
    },
    /* =====操作========================================================================================== */


    /* =====其他人操作========================================================================================== */
    otherOpt: function (uid, opt) {
        let k = opt.k;
        let v = opt.v;

        let DO = DEF.PlayerOpt;
        let O = {};

        // 发牌
        {
            O[DO.SendCard.v]=1;

            if (O[k]) {
                this.d.cardNum = DEF.StartCardNum;
                return;
            }
        }
        
        // 时间归零 打
        {
            O[DO.OutCard.v]=1;

            if (O[k] && v[0] && v[0]>=0) {
                this.time = -1;
                this.view.upDaojishi();

                this.outCodes=[];
                this.view.upOutCards();

                if (this.pg.isbpm) {
                    if (eq64(uid, this.gm.lastOuter)) {
                        this.view.onPlayOpt(-1);
                    }
                }

                return;
            }
        }

        // 别人的回合
        {
            O[DO.CanOutCard.v]=1;
            
            if (O[k]) {
                this._1stOut = false;
                this.canTg = false;

                if (this.gm.uidPlayers[uid]._1stOut) {
                    this.view.onPlayOpt(-1);
                }
            }
        }
    },
});


