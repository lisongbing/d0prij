let DEF = require('eqsDef');

let LG_Sta = DEF.PlayerSta;

let LG_opt = DEF.PlayerOpt;
let LG_optStr = DEF.PlayerOptStr;

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

    //初始化玩家k
    init: function (data, game) {
        cc.log(this.dbgstr('初始化 ' + data.uid));

        this.gm = game;  // 游戏主模块（Mgr）

        // PLAY OPT KEY
        this.POK = {
            bao: 0,
            kai: 1,
            dui: 2,
            chi: 3,
            hu: 4,
            yu:9,
            pass: 10,
        };

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

        // 圈牌
        kf[LG_opt.QuanPai.v]   = this.quanPai.bind(this);

        //爆牌
        //kf[LG_opt.CanBao.v]     = this.canBao.bind(this);
        //kf[LG_opt.Bao.v]        = this.bao.bind(this);

        //摸牌 堂出 打牌
        kf[LG_opt.MoCard.v]     = this.getSelfCard.bind(this);
        kf[LG_opt.PubCard.v]    = this.pubCard.bind(this);
        //打牌
        kf[LG_opt.CanOutCard.v] = this.onCanOutCard.bind(this);
        kf[LG_opt.OutCard.v]    = this.onOutCard.bind(this);
        //吃牌
        //kf[LG_opt.CanChi.v]    = this.canChi.bind(this);
        kf[LG_opt.Chi.v]       = this.chi.bind(this);
        //对
        //kf[LG_opt.CanPeng.v]    = this.canPeng.bind(this);
        kf[LG_opt.Peng.v]       = this.peng.bind(this);
        //开
        //kf[LG_opt.CanZhao.v]    = this.canZhao.bind(this);
        kf[LG_opt.Zhao.v]       = this.zhao.bind(this);

        //雨
        kf[LG_opt.Yu.v]         = this.yu.bind(this);

        //胡
        //kf[LG_opt.CanHu.v]      = this.canHu.bind(this);
        kf[LG_opt.Hu.v]         = this.hu.bind(this);
        
        //过　当前局数
        kf[LG_opt.Pass.v]       = this.pass.bind(this);
        kf[LG_opt.CurJushu.v]   = this.curJushu.bind(this);

        // 有玩家可以操作
        kf[LG_opt.SomeCanop.v]   = this.someCanop.bind(this);

        //申请解散
        kf[LG_opt.AskJiesan.v]  = this.askJiesan.bind(this);
        kf[LG_opt.JiesanVote.v]  = this.jiesanVote.bind(this);

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

        // 是否自己
        this.isSelf = eq64(this.gm.selfUID, this.d.uid);
        
        // 庄
        if (this.gm.isBackPlayMode()) {
            this.isZhuang = (this.gm.roomInfo.dealer == this.d.uid);
        } else {
            this.isZhuang = (this.gm.roomInfo.dealer.toNumber() == this.d.uid.toNumber());
        }
        this.gm.starZhuang = null;
        
        // 准备
        this.isReady = this.d.status > LG_Sta.Free.v;

        // 手牌
        this.d.cards = [];
        // 手牌牌组
        this.hcGroups = []; //this.gm.logic.handcard2Grops(this.d.cards);
        // 摆牌
        this.showGroups = [];
        // 出牌
        this.outCodes = [];

        this.moCards = null;

        // 新增加的摆牌数量
        this.newShowNum = 0;

        // 可以出牌
        this.canOutCard = false;

        // 牌
        let bti = this.d.big2Info;
        if (bti) {
            if (this.isSelf) {
                bti.hand.forEach(code => {
                    this.d.cards.push(code);
                });
                this.d.cardNum = this.d.cards.length;

                this.hcGroups = this.gm.logic.handcard2Grops(this.d.cards);
            }

            bti.putout.forEach(elm => {
                let grp = [];
                elm.cards.forEach(code => {
                    grp.push(code);
                    
                });
                this.showGroups.push(grp);
            });

            bti.nouse.forEach(code => {
                this.outCodes.push(code);
            });

        } else {
            this.d.cardNum = 0;
        }

        this.upBaiHuxi();

        // 房间信息 空闲 (ri.status == DEF.RMSTA.Free.v)
        let ri = this.gm.roomInfo;

        // 堂出或者打出的牌
        this.waitCode = null;
        if ((ri.opcard) && (ri.opcard.value>0) && (ri.opcard.uid.toNumber() == this.d.uid.toNumber())) {
            this.waitCode = ri.opcard.value;
            this.istang = !ri.opcard.play;
            this.gm.cardPlayer = this;
        }

        // 时间
        this.time = eq64(this.d.uid, ri.CurPlayer) ? DEF.OptTime : -1; 

        // 可以的操作
        this.obks = null;
        if (this.isSelf && bti && bti.op > 0) {
            let opt = {};
            opt.k = bti.op;
            opt.v = [];
            if ((ri.opcard) && (ri.opcard.value>0)) {
                opt.v.push(ri.opcard.value);
            }

            this.opt(opt);
        }

        // 上图下泄或者吃摆进度
        this.chiStep = null;
        this.stxx = {};
        if (this.d.expand) {
            if (this.obks && this.obks.length==1 && this.obks[0]=='chi') {
                if (this.d.expand[0] && this.d.expand[0]>0) {
                    this.chiStep = this.d.expand[0];
                }
            } else {
                this.d.expand.forEach(e => this.stxx[e]=true);
            }
        }

        this.bustCode = this.canhuCode = null;

        // 爆的可胡牌
        if (bti) {
            let v = [];
            bti.bustCards.forEach(e => {
                v.push(e);
            });

            if (v.length > 0){
                this.gm.isGameBao = this.isGameBao = true;
                
                if (this.isSelf) {
                    this.bustCode = cc.g.clone(v);
                    this.canhuCode = cc.g.clone(v);
                }
            }
        }

        // 胡牌提示 
        if (!this.chiStep || this.chiStep<0) {
            this.upCanHu();
        }
        

        // 判断解散 0-解散时间 后续是已经同意的玩家ID 第一个是发起者
        // 因为只要有一个不同意就取消解散  所以发过来的都是同意解散的 没发过来的就是还没决定的
        this.votetime = this.voteSta = null;
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

    // 设置卡组数据
    setDataGrops:function (grops) {
        this.hcGroups = grops;
        this.d.cards = this.gm.logic.grops2cards(this.hcGroups);
        this.d.cardNum = this.d.cards.length;
    },

    // 提牌
    reLayCards: function () {
        if (!(this.isSelf)) {
            return;
        }

        let cards = this.gm.logic.grops2cards(this.hcGroups);
        this.hcGroups = this.gm.logic.handcard2Grops(cards);

        this.view.upHandCard();

        this.view.upJiaoCardTip();
    },

    // 重置游戏
    resetPlay: function () { 
        // 时间
        this.time = -1;

        // 手牌
        if (this.d) {
            this.d.cards = [];
            this.d.cardNum = 0;
        }

        this.moCards = null;

        // 手牌组
        this.hcGroups = [];
        // 摆牌
        this.showGroups = [];
        // 出牌
        this.outCodes = [];

        this.baiHuxi = 0;

        // 胡牌提示
        this.chiStep = null;
        this.bustCode = this.canhuCode = null;
        this.curchcInfo = null;
        this.jiaokv = null;
        this.isGameBao = false;

        // 新增加的摆牌数量
        this.newShowNum = 0;

        // 堂出或者打出的牌
        this.waitCode = null;
        this.gm.cardPlayer = null;

        // 庄
        this.isZhuang = false;

        // 准备
        this.isReady = false;

        this.obks = null;

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
                    ds += ' ' + (i+1) + '-' + (LG_optStr[o] ? LG_optStr[o].s : '');
                    ol.push(o);
                }
            }
    
            ds += ' ' + v.join(',');
    
            // 优先处理 待处理操作
            this.obks = null;
            let t = this.doCan(ol, ds, v);
            if (t >= 0) {
                return t;
            }
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

    // 可以的操作
    doCan: function (opts, ds, va) {
        let v = [];
        va.forEach(e => {
            if (e.toNumber) {
                v.push(e.toNumber());
                return;
            }
            
            v.push(e);
        });

        let canOpt = {};

        //canOpt[LG_opt.CanBao.v] = DEF.OBK.bao;
        canOpt[LG_opt.CanPeng.v] = DEF.OBK.dui;
        canOpt[LG_opt.CanChi.v] = DEF.OBK.chi;
        canOpt[LG_opt.CanZhao.v] = DEF.OBK.kai;
        canOpt[LG_opt.CanHu.v] = DEF.OBK.hu;

        let allcan = true;
        let obks = [];
        let optkv = {};
        for (let i = 0; i < opts.length; i++) {
            const e = opts[i];

            if (canOpt[e]==null || canOpt[e]==undefined) {
                allcan = false;
                break;
            } else {
                obks.push(canOpt[e]);
                optkv[e] = true;
            }
        }

        if (! allcan) {
            return -1;
        }

        cc.log(ds);

        if (optkv[LG_opt.CanHu.v]) {
            if (v[0]==31) {
                if (this.pg) this.pg.textHint('加番或者改变手上牌型，才能胡牌');
                return 1.3;
            }
        } else {
            if (optkv[LG_opt.CanChi.v]) {
                if (v[0]==32) {
                    //if (this.pg) this.pg.textHint('该牌不能比牌，无法吃牌');
                    //return 1.3;
                    return 0;
                }
                if (v[0]==31) {
                    //if (this.pg) this.pg.textHint('该牌为过张牌，无法吃牌');
                    //return 1.3;
                    return 0;
                }
            }
        }

        if (!this.isSelf) {
            return 0;
        }

        // if (optkv[LG_opt.CanBao.v]) {
        //     let chc = this.getCurCanHuInfo();
        //     if (chc && chc.length > 0) {
        //         let a=[];
        //         chc.forEach(e => {
        //             a.push(e.code);
        //         });
        //         this.canhuCode = a;
        //         this.curchcInfo = chc;
        //     }
        // }

        //this.time = DEF.OptTime;
        this.canOptVal = v;
        
        this.obks = obks;

        if (this.gm.isIniting) {
            cc.log(this.dbgstr('doCan') + '可能遇到重新登录的重连情况');
            return 0;
        }

        // 有吃牌界面非正常关闭 会导致 lg_cbgrops 缓存数据存在
        if (this.pg.chiView) {
            this.pg.chiView.clear();
        }

        this.pg.upOperate();
        this.view.upHuTip();

        return 0;
    },

    // 准备
    ready: function (v) {
        this.d.status = i64v(v[0]);
        this.isReady = (this.d.status == LG_Sta.Ready.v);

        if (!this.pg) {
            return;
        }
        
        this.pg.clearTgTishi(this.d.uid);
        this.view.upReady();
        this.gm.onPlayerReady(this);
    },
    // 庄家
    zhuang: function (v) {
        if (this.gm.isBackPlayMode()) {
            this.gm.roomInfo.status = DEF.RMSTA.SendCard.v;
            this.gm.roomInfo.cardNum = DEF.ToltalCardNum;
            this.gm.gameScript.starGame();
        }

        this.gm.starZhuang = this;

        this.isZhuang = true;
        this.gm.roomInfo.dealer = this.d.uid;
        this.view.upZhuang();
        this.gm.upXiaojia();
    },
    // 发牌
    sendCard: function (va) {
        if (this.gm.isBackPlayMode()) {
            for (const k in this.gm.uidPlayers) {
                let e = this.gm.uidPlayers[k];
                e.d.cards = cc.g.clone(e.d.hand_cards);
                e.d.cardNum = e.d.cards.length;
                e.hcGroups = this.gm.logic.handcard2Grops(e.d.cards);
                e.view.upHandCard();
            }

            this.pg.sendCard();

            return;
        }

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        //v = [1,2,3,3,6,6,6,6,8,8,11,12,13,15,16,16,18,19,20,20];

        this.d.cards = v;
        this.d.cardNum = this.d.cards.length;

        cc.log('this.d.cards', this.d.cards);
        this.hcGroups = this.gm.logic.handcard2Grops(this.d.cards);//
        cc.log('this.hcGroups', this.hcGroups);

        this.view.upHandCard();

        this.pg.sendCard();
    },

    // 圈牌
    quanPai: function (va) {
        cc.log(this.dbgstr('quanPai 圈牌 '));

        let v = [];
        va.forEach(e => v.push(i64v(e)));

        this.gm.curQuan = v[0];
        this.pg.upTurn();

        this.view.upQuan();
    },
    

    // 爆牌
    bao: function (va) {
        if (this.isSelf) {
            let v = [];
            va.forEach(e => {
                if (e.toNumber) {
                    v.push(e.toNumber());
                    return;
                }
                
                v.push(e);
            });

            this.bustCode = v;
            this.canhuCode = v;

            this.curchcInfo=this.getCurCanHuInfo();

            this.pg.Node_opt.active = false;
        }

        this.gm.isGameBao = this.isGameBao = true;

        this.time = -1;
        this.obks = null;

        this.view.onPlayOpt(this.POK.bao);
    },
    getCurCanHuInfo: function () {
        let hcodes=[];
        if (this.d.cards.length>20) {
            if (!this.lastOutCode) {
                cc.error('错误的爆牌手牌数量！');
                return;
            }

            let skip = true;
            this.d.cards.forEach(e => {
                if (e==this.lastOutCode && skip) {
                    skip = false;
                    return;
                }
                hcodes.push(e);
            });
            
        } else {
            hcodes = this.d.cards;
        }

        let info=[];
        let chckv = this.gm.logic.getCanHuCards(hcodes, this.gm.roomInfo.NewRlue, this.baiHuxi, this.showGroups, this.hcGroups);
        for (const k in chckv) {
            let v = chckv[k];
            let o = {};
            o.code = k;
            o.fan = v[0];
            o.hx = v[1];
            info.push(o);
        }

        return (info.length > 0) ? info : null;
    },
    upCanHu: function () {
        if (this.canOutCard || this.d.cards.length <= 0) return;

        // 起手数量庄家牌数 不算胡牌
        if (this.d.cards.length == (DEF.StartCardNum+1)) return;
        
        if (this.yuing) cc.log('雨 检查胡牌提示1');

        let chc = this.getCurCanHuInfo();

        if (chc && chc.length > 0) {
            let a=[];
            chc.forEach(e => {
                a.push(e.code);
            });
            this.canhuCode = a;
            this.curchcInfo = chc;
        } else {
            this.curchcInfo = this.canhuCode = null;
        }

        if (this.yuing) cc.log('雨 检查胡牌提示2');
    },

    // 摸牌
    getSelfCard: function (va) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        if (this.isSelf || this.gm.isBackPlayMode()) {
            for (let i = 0; i < v.length; i++) {
                const c = v[i];  
                this.d.cards.push(c);
            }

            this.d.cardNum = this.d.cards.length;
            this.d.cards.sort(function(a, b) {return a - b;});
        
            this.hcGroups = this.gm.logic.handcard2Grops(this.d.cards);
        } else {
            this.d.cardNum += v.length;
        }
        
        this.moCards = cc.g.clone(v);

        this.view.moCard();
    },
    
    // 堂出
    pubCard: function (va) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        this.gm.cardPlayer = this;

        this.istang = true;

        this.waitCode = v[0];

        this.view.onTangCard();
    },

    // 有玩家可以操作
    someCanop: function (va) {
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        cc.log('有玩家可以操作');

        if (this.gm.cardPlayer) {
            if (this.gm.cardPlayer.view) {
                this.gm.cardPlayer.time = DEF.OptTime;
                this.gm.cardPlayer.view.upDaojishi();
            }
        } else if (this.gm.starZhuang) {
            cc.log('开局庄家打牌操作');

            this.gm.starZhuang.time = DEF.OptTime;
            this.gm.starZhuang.view.upDaojishi();
        }
    },

    // 打牌
    onCanOutCard: function (v) {
        this.chiStep = null;

        if (this.gm.roomInfo.status != DEF.RMSTA.Play.v) {
            this.gm.onPerdoEnd();
        }

        this.time = DEF.OptTime;
        this.canOutCard = true;

        this.gm.cardPlayer = this;

        if (this.isSelf) {
            this.pg && (this.pg.Node_opt.active = false);
            this.jiaokv = this.gm.logic.getJiaoCodes(this.d.cards, this.gm.roomInfo.NewRlue, this.baiHuxi, this.showGroups, this.hcGroups);
        }

        this.curchcInfo = this.canhuCode = null;

        if (this.view) {
            this.view.upDaojishi();
            this.view.upOutCardTip();
            this.view.upHuTip();

            if (this.isSelf) {
                this.view.upJiaoCardTip();
            }
        } else {
            cc.log(this.dbgstr('onCanOutCard') + '可能遇到重新登录的重连情况');
        }
    },
    outCard: function (code) {
        cc.log(this.dbgstr('outCard 玩家出牌 ' + code));

        this.canOutCard = false;

        this.time = -1;
        this.view.upDaojishi();

        this.view.upJiaoCardTip();

        this.onOutCard([code], true);
        this.gm.sendOp(DEF.PlayerOpt.OutCard.v, code);

        this.lastOutCode = code;
    },
    onOutCard: function (va, isCltOut) {
        this.chiStep = null;

        this.pg.clearTgTishi(this.d.uid);
        
        if (this.isSelf) {
            if (!this.gm.isBackPlayMode() && !this.gm.isTguoguan) {
                if (!isCltOut) {
                    cc.log('D2 服务器通知出牌 跳过');
                    return;
                }
        
                cc.log('D2 客户端先出牌');
            }
        }
        
        this.gm.cardPlayer = this;

        this.stxx = {};

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber(): e);
        });

        //cc.log(this.dbgstr('onOutCard 打出的牌 '+ v[0]));

        this.canOutCard = false;
        
        if (this.isSelf) {
            this.pg && (this.pg.Node_opt.active = false);
        }

        this.istang = false;

        --this.d.cardNum;

        this.waitCode = v[0];
        
        this.curchcInfo = this.canhuCode = null;
        if (this.jiaokv) {
            let chc = this.jiaokv[v[0]];
            if (chc) {
                let a=[];
                chc.forEach(e => {
                    a.push(e.code);
                });
                this.canhuCode = a;
            }
            
            this.curchcInfo = chc;
            
            this.jiaokv = null;
        }

        this.view.onOutCard();
        this.view.upOutCardTip();
    },


    // 吃牌
    chi: function (va) {
        cc.g.utils.backPlayScaleBtnEffct(this.pg.ButtonChi, ()=>this.pg.Node_opt.active=false);

        this.pg.clearTgTishi(this.d.uid);

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        // cc.log('吃牌', v);

        // 分离吃牌和上吐下泻 0-分割
        let v0 = [];
        let stxx = [];
        let endchi = false;
        for (let i = 0, _0 = -1; i < v.length; ++i) {
            if (v[i]==0) {
                _0 = i;
                endchi = true;
            } else {
                if (_0 == -1) {
                    v0.push(v[i]);
                } else {
                    stxx.push(v[i]);
                }
            }
        }

        cc.log('chi', v0);
        cc.log('tu', stxx);

        this.stxx = {};
        stxx.forEach(e => this.stxx[e]=true);

        v = v0;

        this.waitCode = null;
        this.istang = false;

        this.obks = null;

        let code = v[0];
        this.newShowNum = v.length / 3;

        // 添加吃牌到展示牌
        let cg = [];
        for (let i = 0; i < v.length; i+=3) {
            cg = [v[i+0], v[i+1], v[i+2]];

            cg.sort((a, b) => {
                if (a==code) return -1;
                if (b==code) return 1;
                return (a-b);
            });

            this.showGroups.push(cg);
        }
        this.upBaiHuxi();

        // 不是自己没有手牌 直接跳过 this.chibaiStep
        if (this.isSelf || this.gm.isBackPlayMode()) {
            if (!this.chiStep) {
                cc.log('移除第一张吃摆的牌');
                v.shift();
            } else {+-
                cc.log('后续阶段摆牌 不移除第一张');
            }
            
            this.hcGroups = this.gm.logic.removeCardsFromGroups(v, this.hcGroups);
            this.d.cards = this.gm.logic.grops2cards(this.hcGroups);
            this.d.cardNum = this.d.cards.length;
        } else {
            this.d.cardNum -= ((!this.chiStep) ? v.length-1 : v.length);
        }

        this.time = DEF.OptTime;
        this.view.onPlayOpt(this.POK.chi);

        if (this.isSelf || this.gm.isBackPlayMode()) {
            if (endchi) {
                this.chiStep = null;

                if (this.isSelf) {
                    // 主要是针对托管
                    if (this.gm.isTguoguan && this.pg.chiView) {
                        this.pg.chiView.clear();
                    }
                }
            } else {
                if (!this.chiStep) {
                    this.chiStep = 1;

                    if (this.isSelf) {
                        this.canOptVal = [code];
                        this.obks = ['chi'];
            
                        // 可能有摆牌选择
                        if (this.pg.chiView && this.pg.chiView.baiView) {
                            this.pg.chiView.baiView.r.active = true;
                        } else {
                            this.pg.chiPai(this.chiStep, false);
                        }
                    }
                } else {
                    ++this.chiStep;
                }
            }
        }
    },

    // 对
    peng: function (va) {
        cc.g.utils.backPlayScaleBtnEffct(this.pg.Buttondui, ()=>this.pg.Node_opt.active=false);

        this.pg.clearTgTishi(this.d.uid);

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        cc.log('碰', v);

        this.newShowNum = 1;

        this.waitCode = null;
        this.istang = false;

        const c = v[0];
        
        // 摆牌里增加牌
        this.showGroups.push([c,c,c]);
        this.upBaiHuxi(); 

        // 不是自己没有手牌 直接跳过
        if (this.isSelf || this.gm.isBackPlayMode()) {
            // 从手牌中移除牌
            this.hcGroups = this.gm.logic.removeCardsFromGroups([c,c], this.hcGroups);
            this.d.cards = this.gm.logic.grops2cards(this.hcGroups);
            this.d.cardNum = this.d.cards.length;
        } else {
            this.d.cardNum -= 2;
        }

        this.time = DEF.OptTime;
        this.view.onPlayOpt(this.POK.dui);
    },

    // 开
    zhao: function (va) {
        cc.g.utils.backPlayScaleBtnEffct(this.pg.Buttonkai, ()=>this.pg.Node_opt.active=false);

        this.pg.clearTgTishi(this.d.uid);

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        this.newShowNum = 1;

        const c = v[0];
        
        this.waitCode = null;
        this.istang = false;

        // 摆牌里增加牌
        this.showGroups.push([1,c,c,c,c]);
        this.upBaiHuxi();

        // 不是自己没有手牌 直接跳过
        if (this.isSelf || this.gm.isBackPlayMode()) {
            // 从手牌中移除牌
            this.hcGroups = this.gm.logic.removeCardsFromGroups([c,c,c], this.hcGroups);
            this.d.cards = this.gm.logic.grops2cards(this.hcGroups);
            this.d.cardNum = this.d.cards.length;
        } else {
            this.d.cardNum -= 3;
        }

        this.kuaiNum = this.gm.logic.getKuaiNum(this.hcGroups, this.showGroups);

        if (this.kuaiNum < 2) {
            this.time = DEF.OptTime;
        } else {
            this.time = -1;

            cc.g.global.hint(this.kuaiNum*4 + '块');
        }

        this.waitCode = null;
        
        this.view.onPlayOpt(this.POK.kai);
    },

    // 雨
    yu: function (va) {
        cc.log(this.dbgstr('yu 雨'));

        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        const c = v[0];

        this.waitCode = v[0];
        
        cc.log('this.showGroups1', this.showGroups);

        let idx = -1;
        for (let i = 0; i < this.showGroups.length; i++) {
            let a = this.showGroups[i];
            if (a[0]==a[1] && a[1]==a[2] && a[2]==c) {
                idx = i;
                break;
            }
        }
        this.showGroups[idx] = [0,c,c,c,c];

        cc.log('this.showGroups2', this.showGroups);

        this.upBaiHuxi();

        this.kuaiNum = this.gm.logic.getKuaiNum(this.hcGroups, this.showGroups);

        if (this.kuaiNum < 2) {
            this.time = DEF.OptTime;
        } else {
            this.time = -1;
        }

        cc.log('this.kuaiNum', this.kuaiNum);

        this.yuing = true;
        this.upCanHu();
        this.yuing = false;

        this.view.onPlayOpt(this.POK.yu);
    },


    // 更新摆牌胡息
    upBaiHuxi: function () {
        this.baiHuxi = 0;

        let grps = this.showGroups;
        if (grps.length < 1) {
            return;
        }

        for (let i = 0; i < grps.length; ++i) {
            let e = grps[i];

            let v0 = -1;
            if (e.length == 5) {
                e = cc.g.clone(grps[i]);
                v0 = e.shift();
            }

            let hu = this.gm.logic.getHuInfo(e);
            if (hu) {
                this.baiHuxi += (v0 == 1) ? hu.t : hu.t; // '拢'算手牌
            }
        }
    },

    // 胡
    hu: function (va) {
        cc.g.utils.backPlayScaleBtnEffct(this.pg.ButtonHu, ()=>this.pg.Node_opt.active=false);

        this.pg.clearTgTishi(this.d.uid);
        
        let v = [];
        va.forEach(e => {
            v.push(e.toNumber ? e.toNumber() : e);
        });

        this.waitCode = null;
        this.istang = false
        
        this.obks = null;

        this.time = -1;

        this.view.onPlayOpt(this.POK.hu);
    },

    // 过
    pass: function (v) {
        let fpas = ()=>{
            this.pg.clearTgTishi(this.d.uid);

            this.obks = null;
    
            this.time = -1;
            this.view.upDaojishi();
    
            if (this.isSelf) {
                this.pg && (this.pg.Node_opt.active = false);
            }
        };

        if (!this.isSelf || !this.gm.isBackPlayMode()) {
            fpas();
            return;
        }

        this.gm.msgQue.pause();

        cc.g.utils.backPlayScaleBtnEffct(this.pg.ButtonPass, ()=>{
            if (this.pg.ButtonHu.active) {
                this.pg.Sprite_dianguohu.active = true;

                setTimeout(() => {
                    let Button_shi = cc.find('Button_shi', this.pg.Sprite_dianguohu);
                    cc.g.utils.backPlayScaleBtnEffct(Button_shi, ()=>{
                        fpas();
                        this.pg.Sprite_dianguohu.active = false;
                        this.gm.msgQue.resume();
                    });
                }, 500);
            } else {
                fpas();
                this.gm.msgQue.resume();
            }
        });
    },

    // 托管
    tuoguan: function (istg) {
        this.d.isAuto = istg;
        this.view.upTuoguan();
    },

    // 当前局数
    curJushu: function (v) {
        {
            this.gm.roomInfo.status = DEF.RMSTA.SendCard.v;
            this.gm.roomInfo.cardNum = DEF.ToltalCardNum;
            this.gm.gameScript.starGame();
        }
        
        this.gm.roomInfo.curGameNum = v[0].toNumber();
        this.pg.upTurn();

        if (this.gm.roomInfo.curGameNum == 1) {
            this.d.outLineTime = 0;
            this.view.upOnline();
        }
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

        let DO = LG_opt
        let O = {};

        // 发牌
        {
            O[DO.AskJiesan.v]=1;

            if (!O[k]) {
                //this.chiStep = null; 
            }
        }
        
        // 发牌
        {
            O[DO.SendCard.v]=1;

            if (O[k]) {
                if (this.isXJ) {
                    this.d.cardNum = this.isZhuang ? 3 : 2;
                } else {
                    this.d.cardNum = this.isZhuang ? DEF.StartCardNum+1 : DEF.StartCardNum;
                }
                
                return;
            }
        }

        // 增加打出牌 堂
        {
            O[DO.PubCard.v]=1;
            O[DO.MoCard.v]=1;

            if (O[k]) {
                if (this.waitCode) {
                    this.outCodes.push(this.waitCode);
                    this.view.upOutCards();
                }
            }
        }
        
        // 时间归零 堂 吃 碰 招 胡
        {
            O[DO.PubCard.v]=1;
            O[DO.OutCard.v]=1;
            O[DO.Chi.v]=1;
            O[DO.Peng.v]=1;
            O[DO.Zhao.v]=1;
            O[DO.Hu.v]=1;

            if (O[k]) {
                this.waitCode = null;
                this.istang = false;

                this.time = -1;
                this.view.upDaojishi();

                this.view.curPok = null;

                if (this.pg) {
                    this.pg.clearTgTishi(this.d.uid);

                    if (this.isSelf) {
                        this.pg.Node_opt.active = false;
                        if (this.pg.chiView) {
                            this.pg.chiView.clear();
                        }
                    }
                }
            }
        }

    },
});


