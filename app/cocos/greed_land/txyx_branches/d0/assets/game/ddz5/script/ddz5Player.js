let DEF = require('ddz5Def');

let LG_Sta = DEF.PlayerSta;

let LG_opt = DEF.PlayerOpt;
let LG_optStr = DEF.PlayerOptStr;

// 客户端先出牌开关
let iscltout = false;

let GM = null;
let PG = null;

cc.Class({
    /* =============================================================================================== */

    dbgstr: function (info) {
        let s = '玩家'; //d2Player

        if (this.d) {
            s += ' ' + this.d.name + '('+this.d.uid+')';

            if (eq64(GM.selfUID, this.d.uid)) {
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

        GM = game;  // 游戏主模块（Mgr）

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
        
        // 准备 庄家 发牌
        kf[LG_opt.Ready.v]      = this.ready.bind(this);
        kf[LG_opt.Zhuang.v]     = this.zhuang.bind(this);
        kf[LG_opt.SendCard.v]   = this.sendCard.bind(this);
        
        // 叫地主
        kf[LG_opt.CanJiao.v]   = this.canJiaoDizhu.bind(this);
        kf[LG_opt.Jiao.v]   = this.jiaoDizhu.bind(this);

        // 定地主
        kf[LG_opt.DingDizhu.v] = this.dingDizhu.bind(this);

        // 倒
        kf[LG_opt.CanDao.v] = this.canDao.bind(this);
        kf[LG_opt.Dao.v] = this.dao.bind(this);

        // 拉
        kf[LG_opt.CanLa.v] = this.canLa.bind(this);
        kf[LG_opt.La.v] = this.la.bind(this);

        // 梗
        kf[LG_opt.CanGeng.v] = this.canGeng.bind(this);
        kf[LG_opt.Geng.v] = this.geng.bind(this);
    
        // 喊
        kf[LG_opt.CanHan.v] = this.canHan.bind(this);
        kf[LG_opt.Han.v] = this.han.bind(this);

        // 暗地主
        kf[LG_opt.AnDizhu.v] = this.anDizhu.bind(this);


        // 打牌
        kf[LG_opt.CanOutCard.v]    = this.onCanOutCard.bind(this);
        kf[LG_opt.OutCard.v]    = this.onOutCard.bind(this);

        // 过　当前局数
        kf[LG_opt.Pass.v]       = this.pass.bind(this);
        kf[LG_opt.CurJushu.v]   = this.curJushu.bind(this);

        // 输赢
        kf[LG_opt.WinLose.v]   = this.winLose.bind(this);

        // 底分
        kf[LG_opt.DiFen.v]   = this.diFen.bind(this);

        // 亮底牌
        kf[LG_opt.Liangdipai.v] = this.liangDipai.bind(this);

        

        // 申请解散
        kf[LG_opt.AskJiesan.v]  = this.askJiesan.bind(this);
        kf[LG_opt.JiesanVote.v] = this.jiesanVote.bind(this);

        this.optFun = kf;
    },

    // 更新内核
    upCore: function (data) {
        if (! data) {
            return;
        }
        if (this.d) {
            let str = '';
            
            if (GM.isBackPlayMode()) {
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

        // 是否自己
        this.isSelf = eq64(GM.selfUID, this.d.uid);
        
        // 庄
        if (GM.isBackPlayMode()) {
            this.isZhuang = (GM.roomInfo.dealer == this.d.uid);
        } else {
            this.isZhuang = (GM.roomInfo.dealer.toNumber() == this.d.uid.toNumber());
        }
        
        // 准备
        this.isReady = this.d.status > LG_Sta.Free.v;

        //expand[0]身份信息  0 初始化  1 地主 2 农民 3 暗地主
        //expand[1]叫地主   0 初始化  1 不叫地主 2叫地主
        //expand[2]倒拉操作值 0 初始化  1 不倒  2 倒 3跟倒
        //expand[3]梗 0 初始化  1 梗   2 喊
        //expand[4]倒拉操作值 0 初始化  1 不拉  2 拉
        let expand = GM.isBackPlayMode() ? [] : this.d.expand;
        this.shenfen = i64v(expand[0]) || 0;
        this.vJiao = i64v(expand[1]) || 0;
        this.vDao = i64v(expand[2]) || 0;
        this.vLa = i64v(expand[4]) || 0;
        this.vGeng = i64v(expand[3]) || 0;

        this.isHanAdzCard = (GM.roomInfo.status==DEF.RMSTA.Han.v && this.shenfen==DEF.SFCZ.DZ);

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
                this.d.cards = GM.logic.sort(this.d.cards);
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

        if (GM.lastOuter && eq64(GM.lastOuter, this.d.uid) ) {
            GM.lastOCodes = this.outCodes;
        }

        // 房间信息 空闲 (ri.status == DEF.RMSTA.Free.v)
        let ri = GM.roomInfo;

        // 可以打牌 时间
        this.time = -1;
        this.canOutCard = false;
        if (this.isCurPlayer()) {
            this.onCanOutCard();
        }

        // 判断解散
        if(ri.applyStatus && ri.applyStatus.length > 0) {
            for (let i = 1; i < ri.applyStatus.length; i++) {
                if (ri.applyStatus[i].eq(this.d.uid)) {
                    this.voteSta = 1;

                    if (i==1) {
                        this.votetime = ri.applyStatus[0];
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
        PG = this.pg = GM.gameScript;

        if (! this.d) {
            cc.log(this.dbgstr('linkView 没有玩家数据 无法关联视图'));
            return;
        }

        if (! PG) {
            cc.log(this.dbgstr('linkView 没有主视图 无法关联视图'));
            return;
        }

        // 玩家对应的视图
        //let v = PG.playerView[GM.getViewPos(this.d.deskId)];
        let v = PG.playerView[GM.getViewPos(this.curDeskID)];
        //v = PG.playerView[6];

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

            if (GM.DMode.isDrive) {
                this.up();
            }
        }
    },

    // 当前玩家
    isCurPlayer: function () {
        return eq64(this.d.uid, GM.roomInfo.CurPlayer);
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

        // 庄
        this.isZhuang = false;

        this.isReady = false;

        this.isHanAdzCard = false;

        // 身份
        this.shenfen = DEF.SFCZ.NO;
        this.vGeng = this.vLa = this.vDao = this.vJiao = DEF.SFCZ.NO;

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
        GM.onPlayerReady(this);
    },
    // 庄家
    zhuang: function (v) {
        this.isZhuang = true;
        GM.roomInfo.dealer = this.d.uid;
        this.view.upZhuang();
    },
    // 发牌
    sendCard: function (va) {
        if (!this.isSelf) {
            cc.log('不是自己发牌跳过 这样的情况一般是在回放出现');
            return;
        }

        if (GM.isBackPlayMode()) {
            for (const k in GM.uidPlayers) {
                let e = GM.uidPlayers[k];
                e.d.cards = GM.logic.sort(cc.g.clone(e.d.hand_cards));

                if (e.isSelf) {
                    e.handCodes = [];
                    e.d.cardNum = e.handCodes.length;
                } else {
                    e.handCodes = cc.g.clone(e.d.cards);
                    e.d.cardNum = e.handCodes.length;
                    e.view.upHandCard();
                }
            }

            PG.sendCard();

            return;
        }

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        //v = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

        this.d.cards = GM.logic.sort(v);

        this.handCodes = [];
        this.d.cardNum = this.handCodes.length;

        PG.sendCard();
    },
    setHandCode: function (codes) {
        this.handCodes = GM.logic.sort(codes);
        this.d.cardNum = this.handCodes.length;
        this.view.upHandCard();
    },

    // 可以叫地主
    canJiaoDizhu: function (va) {
        cc.log('canJiaoDizhu  可以叫地主');

        GM.roomInfo.status = DEF.RMSTA.Jiao.v;

        this.helpFun_canOp();
    },
    helpFun_canOp: function (va) {
        GM.roomInfo.CurPlayer = this.d.uid;
        this.time = DEF.OptTime;
        this.view.upDaojishi();
        PG.upOperate();
    },
    // 叫地主
    jiaoDizhu: function (va) {
        cc.log('jiaoDizhu  叫地主');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        this.vJiao = (v[0] == 1) ? DEF.SFCZ.JIAO : DEF.SFCZ.JIAONO;

        this.time = -1;
        this.view.onPlayOpt(DEF.PlayerOpt.Jiao.v);

        if (this.vJiao == DEF.SFCZ.JIAO) {
            GM.audio.play('jiao', this.d.sex);
        } else {
            GM.audio.play('bujiao', this.d.sex);
        }
    },

    // 定地主
    dingDizhu: function (va) {
        cc.log('dingDizhu  定地主');
        
        GM.roomInfo.status = DEF.RMSTA.Dao.v;

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        GM.dizhuCard = v;
        this.shenfen = DEF.SFCZ.DZ;
        this.view.onPlayOpt(DEF.PlayerOpt.DingDizhu.v);

        if (this.isSelf) {
            if (v.length>0 && v[0]>=0) {
                this.setHandCode(this.handCodes.concat(v));
            }
        } else {
            this.d.cardNum += 5;
            this.view.upHandCard();
        }
    },
    
    // 可以倒
    canDao: function (va) {
        cc.log('canDao  可以倒');
        GM.roomInfo.status = DEF.RMSTA.Dao.v;
        this.helpFun_canOp();
    },
    // 倒
    dao: function (va) {
        cc.log('dao  倒');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        if (v[0] == 0) {
            this.vDao = DEF.SFCZ.DAONO;
        } else if (v[0] == 1) {
            this.vDao = DEF.SFCZ.DAO;
        } else if (v[0] == 2) {
            this.vDao = DEF.SFCZ.GENDAO;
        }

        this.time = -1;
        this.view.onPlayOpt(DEF.PlayerOpt.Dao.v);

        if (this.vDao == DEF.SFCZ.DAONO) {
            GM.audio.play('budao', this.d.sex);
        } else {
            GM.audio.play('dao', this.d.sex);
        }
    },

    // 可拉
    canLa: function (va) {
        cc.log('canLa  可拉');
        GM.roomInfo.status = DEF.RMSTA.La.v;
        this.helpFun_canOp();
    },
    // 拉
    la: function (va) {
        cc.log('la  拉');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        this.vLa = (v[0] == 1) ? DEF.SFCZ.LA : DEF.SFCZ.LANO;

        this.time = -1;
        this.view.onPlayOpt(DEF.PlayerOpt.La.v);

        if (this.vLa == DEF.SFCZ.LA) {
            GM.audio.play('la1', this.d.sex);
        } else {
            GM.audio.play('bula', this.d.sex);
        }
    },

    // 可梗
    canGeng: function (va) {
        cc.log('canGeng  可梗');
        GM.roomInfo.status = DEF.RMSTA.Geng.v;
        this.helpFun_canOp();
    },
    // 梗
    geng: function (va) {
        cc.log('梗');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        this.vGeng = (v[0] == 1) ? DEF.SFCZ.GENG : DEF.SFCZ.HAN;

        if (this.vGeng == DEF.SFCZ.GENG) {
            GM.roomInfo.status = DEF.RMSTA.Play.v;
        }

        this.time = -1;
        this.view.onPlayOpt(DEF.PlayerOpt.Geng.v);

        if (this.vGeng == DEF.SFCZ.GENG) {
            GM.audio.play('geng', this.d.sex);
        } else {
            GM.audio.play('han', this.d.sex);
        }
    },

    // 可喊
    canHan: function (va) {
        cc.log('canHan  可喊');
        GM.roomInfo.status = DEF.RMSTA.Han.v;
        this.isHanAdzCard = true;
        this.helpFun_canOp();
        this.view.onPlayOpt(DEF.PlayerOpt.CanLa.v);
    },
    // 喊暗地主牌
    han: function (va) {
        cc.log('han  喊暗地主牌');

        GM.roomInfo.status = DEF.RMSTA.Play.v;

        //run喊操作 hanType=1 喊手牌  hanType=2 喊底牌
        let v = [];
        va.forEach(e => v.push(i64v(e)));

        GM.anDizhuCard = v[1];

        this.time = -1;
        this.view.onPlayOpt(DEF.PlayerOpt.Han.v);
    },

    // 暗地主
    anDizhu: function (va) {
        cc.log('anDizhu  暗地主');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        this.shenfen = DEF.SFCZ.ADZ;

        this.view.onPlayOpt(DEF.PlayerOpt.AnDizhu.v);
    },


    // 打牌
    onCanOutCard: function (v) {
        GM.roomInfo.CurPlayer = this.d.uid;

        this.time = DEF.OptTime;
        this.canOutCard = true;
        this.outCodes = [];

        this._1stOut = (!GM.lastOuter || eq64(GM.lastOuter, this.d.uid));
        if (this._1stOut) {
            GM.lastOuter = null;
            GM.lastOType = null;
            GM.lastOCodes = null;
        }

        if (GM.DMode.isDrive) {
            if (this.view) {
                this.view.upOutCards();
                this.view.onPlayOpt(-1);
            }

            if (this.isSelf) {
                if (PG) PG.upOperate();
            }
        }
    },
    outCard: function () {
        cc.log(this.dbgstr('outCard 玩家出牌'));

        let codes = this.view.handCardView.getChoosedCode();
        let info = GM.logic.getCodesInfo(codes);
        if (info.codes.length < 1) {
            cc.log('没选的有牌');
            PG.upOperate();
            return;
        }

        cc.log(info.str);
        cc.log(info.val);
        cc.log(info.codes);

        let Comb = GM.logic.getCanOutCombination(codes, GM.lastOCodes, GM.lastOType, this.handCodes);

        if (Comb.length == 1) {
            this.canOutCard = false;
            this.time = -1;
            this.view.upDaojishi();
    
            //cc.log(Comb[0].desc);
            cc.g.global.hint(Comb[0].desc);

            info.codes = Comb[0].codes;
            info.codes.push(Comb[0].type);

            if (iscltout) {
                this._lastHandCodes = cc.g.clone(this.handCodes);
                this._lastOType = GM.lastOType;
                this._lastOCodes = cc.g.clone(GM.lastOCodes);
                this.onOutCard(info.codes, true);
            }
            
            GM.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
        } else if (Comb.length > 1) {
            PG.showOutChoose(Comb, (idx)=>{
                this.canOutCard = false;
                this.time = -1;
                this.view.upDaojishi();

                info.codes = Comb[idx].codes;
                info.codes.push(Comb[idx].type);

                if (iscltout) {
                    this._lastHandCodes = cc.g.clone(this.handCodes);
                    this._lastOType = GM.lastOType;
                    this._lastOCodes = cc.g.clone(GM.lastOCodes);
                    this.onOutCard(info.codes, true);
                }

                GM.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
            });
        } else {
            cc.g.global.hint(GM.lastOType ? '没有大的起牌' : '出牌类型不明确');
            PG.upOperate();

            // PG.showTypeTip((type)=>{
            //     this.canOutCard = false;
            //     this.time = -1;
            //     this.view.upDaojishi();
    
            //     info.codes.push(type);
            //     GM.sendOp(DEF.PlayerOpt.OutCard.v, info.codes);
            // });
        }
    },
    onOutCard: function (va, isClt) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber(): e);
        });
        
        // -1 头牌不在出的牌中
        // -2 打牌人错误
        // -3 不在手牌中
        // -4 没有这样的牌型
        // -5 下家报单必须打最大牌
        // -6 要不起上家牌
        if (v[0] < 0) {
            v[0]==-1 && cc.g.global.hint('喊的牌不在手牌中');
            v[0]==-2 && cc.g.global.hint('喊的牌有多张');
            v[0]==-3 && cc.g.global.hint('请在4-10的牌中选择一张');
            v[0]==-4 && cc.g.global.hint('请在JQKA中选择一张');
            v[0]==-5 && cc.g.global.hint('打牌人错误');
            v[0]==-6 && cc.g.global.hint('出的牌不在手牌中');
            v[0]==-7 && cc.g.global.hint('全是听用牌');
            v[0]==-8 && cc.g.global.hint('剩余牌全是听用牌');
            v[0]==-9 && cc.g.global.hint('没有这样的牌型');
            v[0]==-10 && cc.g.global.hint('要不起上家牌');
            
            v[0]<-10 && cc.g.global.hint('出牌错误 错误码 ', v[0]);

            if (iscltout) {
                //cc.g.global.hint('出牌错误 还原手牌 ', v[0]);
                this.setHandCode(this._lastHandCodes);
                GM.lastOType = this._lastOType;
                GM.lastOCodes = this._lastOCodes;
                this._lastHandCodes = null;
                this._lastOType = null;
                this._lastOCodes = null;

                this.outCodes = [];
                this.view.upOutCards();
            }

            this.canOutCard = true;
            PG && (PG.Node_opt.active = true);
            
            return;
        }

        if (iscltout && this.isSelf) {
            if (!GM.isBackPlayMode() && !GM.isTguoguan) {
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

        GM.isPassTurn = false;

        this.outCodes = v; //GM.logic.sort(v);
        this.outType = this.outCodes.pop(); //pop() 方法用于删除并返回数组的最后一个元素。

        GM.lastOuter = this.d.uid;
        GM.lastOType = this.outType;
        GM.lastOCodes = this.outCodes;
        this._1stOut = false;

        GM.upJipaiqi(this.outCodes);

        this.time = -1;
        this.view.upDaojishi();

        if (this.isSelf || GM.isBackPlayMode()) {
            this.setHandCode(GM.logic.removeCardsFromHand(this.outCodes, this.handCodes));
        } else {
            this.d.cardNum -= this.outCodes.length;
        }

        this.view.upOutCards();
    },

    // 过
    pass: function (v) {
        this.canOutCard = false;
        
        this.time = -1;
        this.view.upDaojishi();

        this.view.onPlayOpt(DEF.PlayerOpt.Pass.v);

        GM.audio.play('ybq1', this.d.sex);
    },

    // 托管
    tuoguan: function (istg) {
        this.d.isAuto = istg;
        this.view.upTuoguan();
    },

    curJushu: function (v) {
        if (GM.roomInfo.status == DEF.RMSTA.Free.v || PG.Node_gmfreeBtns.active) {
            GM.onWaitReadyEnd();
        }

        GM.roomInfo.curGameNum = v[0].toNumber();
        PG.upTurn();

        if (GM.roomInfo.curGameNum == 1) {
            this.d.outLineTime = 0;
            this.view.upOnline();
        }
    },

    // 输赢
    winLose: function (v) {
        //cc.error('还没有实现输赢');
    },

    // 底分
    diFen: function (va) {
        cc.log('diFen 底分');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        cc.log('v', v);

        GM.diFenadd = v[0] || 0;
        GM.diFen = cc.g.utils.realNum1(v[1]) || GM.diFen;

        PG.upDifen();
    },

    // 亮底牌
    liangDipai: function (va) {
        cc.log('liangDipai  亮底牌');

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        GM.dizhuCard = v;
        PG.onDizhuPaiAnm(this.view);

        if (v.length>0 && v[0]>=0) {
            if (this.isSelf) {
                this.setHandCode(this.handCodes.concat(v));
            } else {
                this.d.cardNum += 5;
                this.view.upHandCard();
            }
        }
    },
    

    // 申请解散
    askJiesan: function (v) {
        this.voteSta = 1;
        PG.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
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
        
        PG.playerAskJiesan(this.d.uid.toNumber(), this.voteSta);
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

        let v = [];
        opt.v.forEach(e => v.push(i64v(e)));

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

        // 定地主
        {
            O[DO.CanLa.v]=1;
            if (O[k]) {
                this.shenfen = DEF.SFCZ.NM; //其他人叫了地主 自己就直接成农民
                return;
            }
        }

        // 梗 喊
        {
            O[DO.Geng.v]=1;
            O[DO.Han.v]=1;
            if (O[k]) {
                this.view.upOptDeskShow();
                return;
            }
        }
        
        // 打牌 时间归零 
        {
            O[DO.OutCard.v]=1;

            if (O[k]) {

                if(v[0] < 0) {
                    return;
                }

                this.time = -1;
                this.view.upDaojishi();

                this.outCodes=[];
                this.view.upOutCards();

                if (PG.isbpm) {
                    if (eq64(uid, GM.lastOuter)) {
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

                if (GM.uidPlayers[uid]._1stOut) {
                    this.view.onPlayOpt(-1);
                }
            }
        }
        
    },
});


