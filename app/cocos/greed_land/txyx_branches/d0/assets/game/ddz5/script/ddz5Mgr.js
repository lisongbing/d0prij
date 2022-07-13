
let BaseMgr = require('GameBaseMgr');

let DEF = require('ddz5Def');
let ddz5Logic = require('ddz5Logic');
let ddz5Audio = require('ddz5Audio');
let ddz5Player = require('ddz5Player');
let ddz5MsgQueue = require('ddz5MsgQueue');
let ddz5BackPlay = require('ddz5BackPlay');

cc.Class({
    extends: BaseMgr,

    properties: {
    },

    dbgstr: function (info) {
        let s = '斗地主5人';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    /* =================================================================================================================== */
    // 初始化房间、玩家信息
    init: function (roomInfo, player, otherPlayers) {
        cc.log(this.dbgstr('init'));

        if (this.isGameEndFinal) {
            cc.log(this.dbgstr('已经处于最终总结算 不在处理断线重连'));
            return;
        }

        if (roomInfo.backPlayData) {
            cc.log(this.dbgstr('回放')); 

            roomInfo.status = DEF.RMSTA.Free.v;

            this.backPlay = new ddz5BackPlay();
        } else {
            this.backPlay = null;

            if (roomInfo.clubId) {
                let o = {}
                o.clubId = roomInfo.clubId;
                o.bjID = roomInfo.clubdesk.roomUid;
                o.deskIndex = roomInfo.clubdesk.deskIndex;

                cc.g.hallMgr.backToClubIfo = o;
            }
        }

        // 数据模式 true驱动 false刷新
        if (!this.DMode) {
            this.DMode = {};
        }
        this.DMode.isDrive = true;

        this.isGameEndFinal = null;
        this.isGameEnding = null;

        //消息队列
        if (! this.msgQue) {
            this.msgQue = new ddz5MsgQueue();
            this.msgQue.init();
        }
        this.msgQue.begin();
        this.msgQue.pause();

        this._super(roomInfo, player, otherPlayers);

        if (this.backPlay) {
            this.backPlay.init(this);
        }

        cc.log("    " + "游戏状态 " + this.roomInfo.status + ' ' + DEF.RMSTAStr[this.roomInfo.status]);
        cc.log("    " + "自己椅子号", this.selfDeskId);

        // 逻辑模块
        if (! this.logic) {
            this.logic = new ddz5Logic();
            this.logic.init(this);
        }

        // 音乐模块
        if (! this.audio) {
            this.audio = new ddz5Audio();
            this.audio.init(this);
        }
        this.audio.curBGM = '';
        
        //UID玩家 位置玩家
        if (! this.uidPlayers) {
            this.uidPlayers = {};   
            this.posPlayers = {};
        }

        
        if (!this.isBackPlayMode()) {
            this.upExpand();
        }

        // 更新玩家
        this.DMode.isDrive = false;

        this.upPlayers();

        for (const key in this.uidPlayers) {
            this.uidPlayers[key].d.bigtwoInfo_last = this.uidPlayers[key].d.bigtwoInfo; //缓存以供日志查看
            this.uidPlayers[key].d.bigtwoInfo = null;
        }

        // 刷新游戏
        if (this.gameScript != null) {
            this.gameScript.resetGame();
            this.msgQue.resume();
        }

        this.DMode.isDrive = true;
    },

    // 扩展数据 短线重连使用
    upExpand: function () {
        // 上次出牌
        this.lastOuter = null;
        this.lastOType = null;
        if (this.roomInfo.opcard) {
            this.lastOuter = eq64(this.roomInfo.opcard.uid, 0) ? null : this.roomInfo.opcard.uid;
            this.lastOuter && (this.lastOType = this.roomInfo.opcard.value);
        }

        
        cc.log('this.roomInfo.expand', this.roomInfo.expand);

        let d = this.roomInfo.expand;

        //地主牌 0-4
        this.dizhuCard = [-2,-2,-2,-2,-2,];
        if (this.roomInfo.status >= DEF.RMSTA.Dao.v) {
            for (let i = 0; i < 5; ++i) {
                this.dizhuCard[i] = i64v(d[i]);
            }
        }

        //暗地主牌 5
        this.anDizhuCard = -1;
        if (this.roomInfo.status >= DEF.RMSTA.Play.v) {
            this.anDizhuCard = i64v(d[5]);
        }

        //底分 6
        this.diFenadd = null;
        this.diFen = i64v(d[6]) || 100;
        this.diFen = cc.g.utils.realNum1(this.diFen);
    },

    
    isBackPlayMode: function () {
        return this.backPlay ? true : false;    
    },

    // 注册消息监听
    setNetworkMessageCallback: function () {
        this._super();

        // 结算结果通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_FIVE_DDZ_PLAYER_RESULT_LIST, (resp) => {
            this.onGameSettle(resp);
        });

        // 总结算
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_FIVE_DDZ_PLAYER_END_RESULT_LIST, (resp) => {
            this.onGameSettleFinal(resp);
        });
    },

    // 界面加载完成
    gameScriptLoaded: function () {
        cc.log(this.dbgstr(' gameScriptLoaded 界面加载完成'));

        this.DMode.isDrive = false;
        for (const key in this.uidPlayers) {
            this.uidPlayers[key].linkView();
        }
        this.DMode.isDrive = true;
        
        this.msgQue.resume();
    },



    // 更新玩家情况
    upPlayers: function () {
        cc.log(this.dbgstr('upPlayer'));

        // 去除已经不再的玩家
        let qt = [];
        for (const key in this.uidPlayers) {
            let p = this.uidPlayers[key];

            let isIn = false;
            for (let j = 0; j < this.players.length; ++j) {
                if (key == this.players[j].uid) {
                    isIn = true;
                    break;
                }
            }

            if (! isIn) {
                cc.log('    玩家不在已经退出 ' + key)
                p.quite();
                qt.push(key);
            }
        }
        qt.forEach(k => {
            delete this.posPlayers[this.uidPlayers[k].deskId];
            delete this.uidPlayers[k];
        });


        // 更新现有玩家和添加新的玩家
        for (let i = 0; i < this.players.length; ++i) {
            this.upOrAddPlayer(this.players[i]);
        }
    },
    // 更新现有玩家和添加新的玩家
    upOrAddPlayer: function (player) {
        cc.log(this.dbgstr('addPlayer'));

        let p = player;
        
        if (this.uidPlayers[p.uid]) {
            this.uidPlayers[p.uid].upCore(p);
            return;
        }

        cc.log('    uid ' + p.uid);

        let np = this.posPlayers[p.deskId] = this.uidPlayers[p.uid] = new ddz5Player();
        np.init(p, this);
    },

    /* =================================================================================================================== */



    /* =================================================================================================================== */
    // 根据玩家位置获取视图位置 以0开始的视图编号
    getViewPos: function (deskId) {
        let playNum = this.roomInfo.total; //玩法人数

        let vp = deskId - this.selfDeskId;

        if (vp < 0) {
            vp += playNum;
        }

        return vp;
    },
    // 根据视图位置获取玩家位置 以0开始的位置编号
    getPlayerPos: function (viewPos) {
        let playNum = this.roomInfo.total; //玩法人数
        
        let pos = viewPos + this.selfDeskId;

        if (pos >= playNum) {
            pos = pos % playNum;
        }

        return pos;
    },
    /* =================================================================================================================== */


    // 新玩家加入
    newPlayerJoined: function (player) {
        cc.log(this.dbgstr('newPlayerJoined'));
        
        // this.msgQue.createMsg(
        //     'newPlayerJoined',
        //     (player)=>{
        //         this.upOrAddPlayer(player);
        //         this.uidPlayers[player.uid].up();
        //         this.msgQue.finishMsg();
        //     },
        //     player,
        //     player.name,
        // );

        this.upOrAddPlayer(player);
        this.uidPlayers[player.uid].up();
    },

    // 更新玩家
    playerInfoUpdated: function (player) {
        this.uidPlayers[player.uid].up();
    },

    //
    playerMoneyUpdated:function (player, coin) {
        this.uidPlayers[player.uid].view.upCoin(coin);
    },

    // 准备
    ready: function () {
        this.sendOp(DEF.C2S.READY, [DEF.PlayerSta.Ready.v]);
    },

    // 更新玩家操作
    updateOp: function (uid, resp) {
        {
            /*
            // 通知玩家操作
            //@api:1016,@type:resp
            message UserOPNtf{
                int64 id = 1;
                GAME gameType = 2;
                OP op = 3;
            }

            // 玩家操作
            //@api:1011,@type:req
            message UserOpReq{
                GAME gameType = 1;
                OP  op = 2;
            }
            */    
        }

        let data = {};
        data.uid = uid;
        data.resp = resp;

        let p = this.uidPlayers[uid];
        let tag = p.d.name + '_' + uid 
        if (DEF.PlayerOptStr[resp.op.k]) {
            tag += '_' + DEF.PlayerOptStr[resp.op.k].s + ' ' + resp.op.v.join(',');
        } else {
            tag += '_' + resp.op.k.toString(2) + ' ' + resp.op.v.join(',');
        }

        this.msgQue.createMsg(
            'updateOp',
            (data)=>{
                let uid = data.uid;
                let resp = data.resp;

                let t = this.uidPlayers[uid].opt(resp.op);

                for (const key in this.uidPlayers) {
                    const e = this.uidPlayers[key];

                    if (key != uid) {
                        e.otherOpt(uid, resp.op);
                    }
                }

                if (!t || t<=0) {
                    this.msgQue.finishMsg();
                    return;
                }

                this.scheduleOnce(() => this.msgQue.finishMsg(), t);
            },
            data,
            tag
        );
    },


    // 玩家准备了
    onPlayerReady: function () {
        cc.log(this.dbgstr('onPlayerReady'));

        let rdNum = 0;
        for (const k in this.uidPlayers) {
            const e = this.uidPlayers[k];

            if (e.isReady) {
                ++rdNum;
            }
        }

        cc.log('    已经准备的玩家数量 '+ rdNum);

        //if (!this.isBackPlayMode()) {
            if (rdNum === this.roomInfo.total) {
                cc.g.hallMgr.inGameMenu.upBtnShow();
                this.gameScript.Node_gmfreeBtns.active = false;
                this.onWaitReadyEnd();
            }
        //}
    },

    // 准备阶段完毕
    onWaitReadyEnd: function () {
        cc.log('onWaitReadyEnd 所有玩家都准备了 进入游戏阶段');
        this.roomInfo.status = DEF.RMSTA.SendCard.v;
        this.roomInfo.cardNum = DEF.ToltalCardNum;
        this.gameScript.starGame();
    },

    // 发牌完毕
    onSendCardEnd: function () {
        cc.log(this.dbgstr('onSendCardEnd 发牌完毕 进入叫地主阶段'));
        this.roomInfo.status = DEF.RMSTA.Jiao.v;
    },

    //
    onPerdoEnd: function () {
        cc.log(this.dbgstr('onPerdoEnd 进入玩牌阶段'));

        this.roomInfo.status = DEF.RMSTA.Play.v;

        for (const k in this.uidPlayers) {
            this.uidPlayers[k].d.status = DEF.PlayerSta.Play.v;
        }

        this.upJipaiqi(null, true);
    },

    // 跟新记牌器
    upJipaiqi: function (codes, isreset, cardRecord) {
         //数组长度19
        //空缺,A,2,3,4,5,6,7,8,9,10,J,Q,K,空缺,空缺,小王,大王,听用
        //array := []int32{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0}

        if (this.isBackPlayMode()) {
            return;
        }
        
        if (!this.nocheckjpq) {
            this.nocheckjpq = true;

            this.useJpq = false;
            for (let i = 0; i < this.roomInfo.NewRlue.length; ++i) {
                let e = this.roomInfo.NewRlue[i];
                if (e == 21) {
                    this.useJpq = true;
                }
            }
        }

        if (!this.useJpq) {
            return;
        }

        if (!this.jpqData) {
            this.jpqData = {};
            isreset = true;
        }

        if (isreset) {
            for (let i = 1; i <= 15; ++i) {
                this.jpqData[i] = 8;
            }
            this.jpqData[0] = 10;
        }

        if (cardRecord) {
            for (let i = 0; i <= 13; ++i) {
                this.jpqData[i] = cardRecord[i];
            }
        }

        codes && codes.forEach(e => {
            let v = e;
            if (v==54 || v>=100) {
                v = 0;
            } else if (v==52 || v==53) {
                v = 14 + v-52;
            } else {
                v = Math.floor(v/4)+1;
            }

            --this.jpqData[v];
        });

        this.gameScript && this.gameScript.jiPaiqi && this.gameScript.jiPaiqi.up();
    },

    


    // 游戏结算
    onGameSettle: function (resp) {
        cc.log(this.dbgstr('结算结果通知'));

        this.prepareSettleData(resp);

        this.msgQue.createMsg(
            'onGameSettle',
            (data)=>{
                cc.log('    游戏结算 状态空闲 进入结算显示阶段');

                this.isGameEnding = true;
                this.roomInfo.status = DEF.RMSTA.Free.v;
        
                for (const k in this.uidPlayers) {
                    this.uidPlayers[k].resetPlay();
                }

                this.gameScript.onGameSettlement();
            },
            {},
            '游戏结算'
        );
    },
    onGameSettleEnd: function () {
        cc.log('    结算显示阶段结束 开始空闲准备');

        this.msgQue.finishMsg();

        this.lastOuter = null;
        this.lastOType = null;
        this._1st = null;
        this.diFen = this.roomInfo.base;
        this.isGameEnding = false;
        this.anDizhuCard = -1;
        this.diFenadd = null;

        this.gameScript.onGameSettlementEnd();

        // cc.sys.garbageCollect();
    },
    prepareSettleData: function (resp) {
        {/*
            //@api:1035,@type:resp
            message FiveDdzPlayerResultListNtf{
                int32   winType = 1;//0 流局 1 地主胜利 2农民胜利
                int32   base    = 2;//客户端选择的底分(暂时无用)
                int32   baseScore   = 3;//底分
                int32   round    = 4;//当前局数
                int64   time    = 5;//时间戳
                repeated DdzResultInfo list = 6;  //玩家牌的信息及输赢
            }
            //五人斗地主的结算结果
            message DdzResultInfo{
                int64   uid = 1;//玩家ID
                int32   winlose = 2;//胜利失败(1 胜利 0 失败)
                int32   totalscore = 3;//积分
                int32   identity = 4;//身份(0 初始化  1 地主 2 农民 3 暗地主)
                int32   scoreRate= 5;//倒拉操作值(0 初始化  1 不倒/不拉   2 倒/拉)
                int32   gengValue=6;//梗(0 初始化  1 梗   2 喊)
                int32   banker = 7;//庄家(1 庄家 0 非庄家)
                repeated int32 deskcards = 8;//已打出的牌ID
                repeated int32 handcards = 9;//手牌ID
            }
        */}

        let d = {};

        d.winType = resp.winType;
        d.isWin = false;
        d.base = resp.base;
        d.baseScore = resp.baseScore;
        d.round = resp.round;
        d.time = resp.time;
        
        //玩家牌及输赢
        let playerSD = {};
        let uids = [];
        resp.list.forEach(e => {
            let sd = {};
            
            sd.uid = i64v(e.uid);
            sd.winlose = e.winlose;
            sd.totalscore = e.totalscore;
            sd.identity = e.identity;
            sd.daoLa = e.scoreRate;
            sd.gengHan = e.gengValue;
            sd.isZhuang = (e.banker==1);

            sd.totalscore = (sd.totalscore/100).toFixed(2);
            sd.totalscore = parseFloat(sd.totalscore);

            // 自己的胜利情况
            if (eq64(sd.uid, this.selfUID)) {
                if (d.winType == 1) {
                    d.isWin = (sd.identity==1 || sd.identity==3);
                } else if (d.winType == 2) {
                    d.isWin = (sd.identity==2);
                }
            }

            //玩家的手牌
            sd.hand = [];
            e.handcards.forEach(elm => sd.hand.push(elm));

            //玩家放下去的牌
            sd.putout = [];
            e.deskcards.forEach(elm => sd.putout.push(elm));

            //玩家的id
            playerSD[sd.uid] = sd;
            uids.push(sd.uid);
        });

        // 结算用到的玩家数据
        d.player = [];
        if (resp.dbgdata) {
            uids.forEach(k => {
                const e = resp.players[k];
    
                let p = {};
                p.uid = k;
                p.icon = e.icon;
                p.name = e.name;
                p.settle = playerSD[k];
                //p.view = e.view;
    
                d.player.push(p);
            });
        } else {
            uids.forEach(k => {
                const e = this.uidPlayers[k];
    
                let p = {};
                p.uid = k;
                p.icon = e.d.icon;
                p.name = e.d.name;
                p.settle = playerSD[k];
                //p.view = this.uidPlayers[k].view;
    
                d.player.push(p);
            });
        }
                
        this.SettleData = d;
    },

    // 总结算
    onGameSettleFinal: function (resp) {
        cc.log(this.dbgstr('总结算'));

        this.isGameEndFinal = true;

        this.prepareSettleFinalData(resp);

        this.msgQue.createMsg(
            'onGameSettleFinal',
            (data)=>{
                this.roomInfo.status = DEF.RMSTA.Free.v;
                
                this.gameScript.onGameSettleFinal();
            },
            {},
            '总结算'
        );
    },
    prepareSettleFinalData: function (resp) {
        {/*
            //@api:1025,@type:resp
            message BigTwoPlayerEndResultListNtf{
                int32 num = 1;//局数
                repeated BigTwoEndResultInfo list = 2;  //玩家具体输赢及房卡信息
            }

            //大贰的结算结果
            message BigTwoEndResultInfo{
                int32   winlose = 1;//输赢
                int32   totalRoomCard    = 2;//总房卡
                int32 	consumeRoomCard = 3;//消耗的房卡
                int64   uid = 4;//
            }
        */}

        let d = {};

        d.num = resp.num;//局数
        d.maxsco = -1;//大赢家分数

        //玩家具体输赢及房卡信息
        let player = [];
        resp.list.forEach(e => {
            let sd = {};
            sd.winlose = e.totalScore; //输赢
            sd.winlose = (sd.winlose/100).toFixed(2);
            sd.winlose = parseFloat(sd.winlose);
            
            if (sd.winlose>0 && sd.winlose>d.maxsco){
                d.maxsco = sd.winlose;
            }

            sd.totalRoomCard = e.totalRoomCard; //总房卡
            sd.consumeRoomCard = e.consumeRoomCard; //消耗的房卡
            sd.uid = (e.uid.toNumber) ? e.uid.toNumber(): e.uid;

            if (resp.dbgdata) {
                const p = resp.players[sd.uid];
                sd.icon = p.icon;
                sd.name = p.name;
            }else{
                const p = this.uidPlayers[sd.uid];
                sd.icon = p.d.icon;
                sd.name = p.d.name;
            }

            sd.isFangzhu = (sd.uid==this.roomInfo.owner.toNumber());

            player.push(sd);
        });
        d.player = player;

        this.SettleFinalData = d;
    },


    // BMG开关
    onBGMSwitch: function (swi) {
        if (!swi) {
            this.audio.stop();
            return;
        }

        this.audio.bgmGame();
    },

    // 玩家退出 重写
    playerQuited: function (player) {
        this._super(player);//不能删除

        if (eq64(this.selfUID, player.uid)) {//如果是自己
            this.clearPlaydata();

            return;
        }

        if (! this.isGameEndFinal) {
            let p = player;

            this.uidPlayers[p.uid].quite();
            delete this.uidPlayers[p.uid];
            delete this.posPlayers[p.deskId];
        }
    },
    //清除游戏数据
    clearPlaydata:function () {
        this.gameScript = null;

        this.isGameEndFinal = null;
        this.isGameEnding = null;

        for (const key in this.uidPlayers) {
            this.uidPlayers[key].view.unscheduleAllCallbacks();
            this.uidPlayers[key].quite();
        }

        this.uidPlayers = {};
        this.posPlayers = {};

        this.msgQue.end();
        this.audio.stop();

        this.backPlay && this.backPlay.end();
        this.backPlay = null;
    },


    // 回到大厅
    backHall: function () {
        if (cc.g.hallMgr.backToClubIfo) {
            cc.g.hallMgr.backToClubIfo.inGame = true;
            cc.g.hallMgr.backToClubIfo.inGameRoomId = this.roomInfo.roomId;
            cc.g.hallMgr.backToClubIfo.roomUid = this.roomInfo.clubdesk.roomUid;
            cc.g.hallMgr.backToClubIfo.deskIndex = this.roomInfo.clubdesk.deskIndex;
        }

        this.sendOp(DEF.PlayerOpt.BackHall.v);

        this.playerQuited(this.players[0]);
        // cc.g.hallMgr.backToHall();
        cc.g.hallMgr.backToTeaHall();
    },
    
    /* ================回放回退记录和还原============================================================================== */
    bpfCurHisStep: function () {
        if (!this.isBackPlayMode()) return;

        if (!this.backPlay.hisStepData) {
            this.backPlay.hisStepData = [];
        }


        // 记录房间
        let ri = this.roomInfo;
        let rm = {};
        rm.status = ri.status;

        rm.isPassTurn = this.isPassTurn;
        rm.lastOuter = this.lastOuter;
        rm.lastOType = this.lastOType;
        rm.lastOCodes = cc.g.clone(this.lastOCodes);

        // 记录玩家
        let player = {};
        for (const key in this.uidPlayers) {
            let p = this.uidPlayers[key];
            let o = {};

            o.status = p.d.status;
            o.money = cc.g.clone(p.d.money);
            o.isZhuang = p.isZhuang;
            o.isReady = p.isReady;

            o.cards = cc.g.clone(p.d.cards);
            o.handCodes = cc.g.clone(p.handCodes);
            o.cardNum = p.d.cardNum;
            o.outCodes = cc.g.clone(p.outCodes);
            o.outType = p.outType;

            o.isPass = p.isPass;

            o._1stOut = p._1stOut;

            player[p.d.uid] = o;
        }

        this.backPlay.hisStepData[this.backPlay.step] = {
            rm: rm,
            player: player,
        }
    },

    bpfToHisStep: function () {
        if (!this.isBackPlayMode()) return;

        if (!this.backPlay.hisStepData) {
            cc.log(this.dbgstr('没有回放历史步骤数据'));
            return;
        }

        let sd = this.backPlay.hisStepData[this.backPlay.step];
        if (!sd) {
            cc.log(this.dbgstr('回放历史步骤数据获取出错 请检测BUG'));
            return;
        }

        let player = sd.player;
        let rm = sd.rm;

        // 房间
        let ri = this.roomInfo;
        ri.status = rm.status;

        this.isPassTurn = rm.isPassTurn;
        this.lastOuter = rm.lastOuter;
        this.lastOType = rm.lastOType;
        this.lastOCodes = cc.g.clone(rm.lastOCodes);

        // 玩家
        for (const key in player) {
            let o = player[key];

            let p = this.uidPlayers[key];

            p.d.status = o.status;
            p.d.money = cc.g.clone(o.money);
            p.isZhuang = o.isZhuang;
            p.isReady = o.isReady;

            p.d.cards = cc.g.clone(o.cards);
            p.handCodes = cc.g.clone(o.handCodes);
            p.d.cardNum = o.cardNum;
            p.outCodes = cc.g.clone(o.outCodes);
            p.outType = o.outType;

            p.isPass = o.isPass;

            p._1stOut = o._1stOut;
        }

        this.gameScript.upPage();

        if (this.gameScript.settleView && this.gameScript.settleView.root.active) {
            this.gameScript.settleView.hide();
            this.msgQue.finishMsg();
        }
    },
    /* ================回放回退记录和还原============================================================================== */
});
