
let BaseMgr = require('GameBaseMgr');

let DEF = require('pdklsDef');
let Logic = require('pdklsLogic');
let Audio = require('pdklsAudio');
let Player = require('pdklsPlayer');
let MsgQueue = require('pdklsMsgQueue');
let BackPlay = require('pdklsBackPlay');

cc.Class({
    extends: BaseMgr,

    properties: {
    },

    dbgstr: function (info) {
        let s = '跑得快乐山';

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

        this.isPDK2 = (roomInfo.total==2);

        if (this.isGameEndFinal) {
            cc.log(this.dbgstr('已经处于最终总结算 不在处理断线重连'));
            return;
        }

        if (roomInfo.backPlayData) {
            cc.log(this.dbgstr('回放')); 

            roomInfo.status = DEF.RMSTA.Free.v;

            this.backPlay = new BackPlay();
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
            this.msgQue = new MsgQueue();
            this.msgQue.init();
        }
        this.msgQue.begin();
        this.msgQue.pause();

        this._super(roomInfo, player, otherPlayers);

        if (this.backPlay) {
            this.backPlay.init(this);
        }

        cc.log("游戏状态 " + this.roomInfo.status + ' ' + DEF.RMSTAStr[this.roomInfo.status]);
        cc.log("自己椅子号", this.selfDeskId);

        // 逻辑模块
        if (! this.logic) {
            this.logic = new Logic();
            this.logic.init(this);
        } else {
            this.logic.doSpcRule();
        }
        

        // 音乐模块
        if (! this.audio) {
            this.audio = new Audio();
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
        this.upPlayers();

        if (!this.jpqKg) {
            this.jpqKg = 1;
        }

        // 记牌器
        this.upJipaiqi(null, null, this.roomInfo.paodekuai && this.roomInfo.paodekuai.cardRecord);

        // 刷新游戏
        if (this.gameScript != null) {
            this.DMode.isDrive = false;
            this.gameScript.resetGame();
            this.DMode.isDrive = true;

            this.msgQue.resume();
        }
    },

    // 扩展数据 短线重连使用
    upExpand: function () {
        if (this.roomInfo.total <= 3) {
            DEF.ToltalCardNum = 30;
        } else {
            DEF.ToltalCardNum = 40;
        }

        // 上次出牌
        this.lastOuter = null;
        this.lastOType = null;
        if (this.roomInfo.opcard) {
            this.lastOuter = eq64(this.roomInfo.opcard.uid, 0) ? null : this.roomInfo.opcard.uid;
            this.lastOuter && (this.lastOType = this.roomInfo.opcard.value);
        }

        //22,开启追打
        this.isMustOut = true;
        // if (this.isPDK2) {
        //     for (let i = 0; i < this.roomInfo.NewRlue.length; ++i) {
        //         if (this.roomInfo.NewRlue[i]==1) {
        //             this.isMustOut = true;
        //         }
        //     }
        // } else {
        //     this.isMustOut = true;
        // }
        
        cc.log('this.roomInfo.expand', this.roomInfo.expand);
    },


    
    isBackPlayMode: function () {
        return this.backPlay ? true : false;    
    },

    // 注册消息监听
    setNetworkMessageCallback: function () {
        this._super();

        // 结算结果通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_LS_PDK_PLAYER_RESULT_LIST, (resp) => {
            this.onGameSettle(resp);
        });

        // 总结算
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_PDK_PLAYER_END_RESULT_LIST, (resp) => {
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

        let np = this.posPlayers[p.deskId] = this.uidPlayers[p.uid] = new Player();
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
        this.sendOp(DEF.PlayerSta.Ready.v, [DEF.PlayerSta.Ready.v]);
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
    onPlayerReady: function (str) {
        cc.log(this.dbgstr('onPlayerReady' + (str ? ' '+str : '')));

        if (str=='PlayerJoined' && this.roomInfo.status>DEF.RMSTA.Free.v) {
            return;
        }

        let rdNum = 0;
        let nowNum = 0;
        for (const k in this.uidPlayers) {
            const e = this.uidPlayers[k];

            (!e.d.isView && e.isReady) && ++rdNum;
            (!e.d.isView) && ++nowNum;
        }

        if (nowNum < 2) return;

        cc.log('    已经准备的玩家数量 '+ rdNum);

        if (!this.isBackPlayMode()) {
            if (rdNum === nowNum) {
                if (this.roomInfo.total==rdNum || this.roomInfo.status>DEF.RMSTA.Free.v) {
                    this.onWaitReadyEnd();
                }
            }
        }
    },



    // 准备阶段完毕
    onWaitReadyEnd: function () {
        cc.log('onWaitReadyEnd 所有玩家都准备了 进入游戏阶段');

        cc.g.hallMgr.inGameMenu.upBtnShow();
        this.gameScript.Node_gmfreeBtns.active = false;

        this.gameScript.starGame();
    },
    turnBegin: function () {
        cc.log('开局 turnBegin');

        this.roomInfo.status = DEF.RMSTA.SendCard.v;
        this.roomInfo.cardNum = DEF.ToltalCardNum;

        this.gameScript.starGame();
    },

    // 发牌完毕
    onSendCardEnd: function () {
        //cc.log(this.dbgstr('onSendCardEnd'));
        cc.log('    发牌完毕 进入预处理阶段');
        this.roomInfo.status = DEF.RMSTA.Play.v;

        for (const k in this.uidPlayers) {
            this.uidPlayers[k].d.status = DEF.PlayerSta.Play.v;
        }

        this.upJipaiqi(null, true);
    },

    // 跟新记牌器
    upJipaiqi: function (codes, isreset, cardRecord) {
        return;

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
            for (let i = 1; i <= 13; ++i) {
                this.jpqData[i] = 4;
            }
        }

        if (cardRecord) {
            for (let i = 0; i <= 13; ++i) {
                this.jpqData[i] = cardRecord[i];
            }
        }

        codes && codes.forEach(e => {
            let v = e;
            if (v==52 || v==53 || v>=100) {
                v = 0;
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
        this.isGameEnding = false;
        this.gameScript.onGameSettlementEnd();
    },
    prepareSettleData: function (resp) {
        {/*
            //@api:1042,@type:resp
            message LeShanPdkPlayerResultListNtf{
                int64   winUid = 1;//赢得的玩家
                int32   base    = 2;//底分
                int32   round    = 3;//当前局数
                int64   time    = 4;//时间戳
                repeated LeShanPdkResultInfo list = 5;  //玩家牌的信息及输赢
            }
            //跑的快的结算结果
            message LeShanPdkResultInfo{
                int64   uid = 1;//玩家ID
                int32   winlose = 2;//胜利失败
                int32   bombnum = 3;//炸弹数
                int32   totalscore = 4;//积分
                int32   bombscore = 5;//炸弹积分
                repeated int32 deskcards = 6;//已打出的牌ID
                repeated int32 handcards =7;//手牌ID
                int32   mingTangScore=8;//名堂分
                bool    isZhaNiao =9;//是否扎鸟
                repeated int32 mingTang=10;//名堂
            }
        */}

        let d = {};

        d.winUid = i64v(resp.winUid);
        d.base = resp.base;
        d.round = resp.round;
        d.time = resp.time;
        
        //玩家牌及输赢
        let playerSD = {};
        let uids = [];
        resp.list.forEach(e => {
            let sd = {};
            
            sd.uid = e.uid.toNumber ? e.uid.toNumber() : e.uid;

            sd.winlose = e.winlose;
            sd.bombnum = e.bombnum;
            sd.bombscore = e.bombscore;
            sd.totalscore = e.totalscore;
            sd.mingTangScore = e.mingTangScore;
            sd.isZhaNiao = e.isZhaNiao;
            
            sd.isZhuang = eq64(sd.uid, this.roomInfo.dealer);

            sd.totalscore = (sd.totalscore/100).toFixed(2);
            sd.totalscore = parseFloat(sd.totalscore);

            //玩家的手牌
            sd.hand = [];
            e.handcards.forEach(elm => sd.hand.push(elm));

            //玩家放下去的牌
            sd.putout = [];
            e.deskcards.forEach(elm => sd.putout.push(elm));

            sd.mtstr = [];
            let hts = { 1:'全黑', 2:'全红', 3:'全大', 4:'全小', 5:'全单',
                        6:'全双', 7:'5555', 8:'AAAA', 9:'6666', 10:'7777',
                        11:'8888', 12:'9999', 13:'四个10', 14:'JJJJ', 15:'QQQQ',
                        16:'KKKK', 17:'扎鸟', };
            e.mingTang.forEach(v => {
                sd.mtstr.push(hts[v] ? hts[v] : '鬼名堂'+v);
                return;
            });

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
            //@api:1031,@type:resp 跑的快
            message PdkPlayerEndResultListNtf{ //以后都用这个
                int32 num = 1;//局数
                repeated PdkEndResultInfo list = 2;  //玩家具体输赢及房卡信息
            }
            //跑的快游戏最终结算结果 //后面都用这个
            message PdkEndResultInfo{
                int64   uid = 1;//玩家唯一ID
                int32   totalScore = 2;//玩家输赢分数
                int32   totalRoomCard    = 3;//总房卡
                int32 	consumeRoomCard = 4;//消耗的房卡
            }
        */}

        let d = {};

        d.num = resp.num;//局数
        d.maxsco = -1;//大赢家分数

        //玩家具体输赢及房卡信息
        let player = [];
        resp.list.forEach(e => {
            let sd = {};

            sd.uid = (e.uid.toNumber) ? e.uid.toNumber(): e.uid;
            sd.totalRoomCard = e.totalRoomCard; //总房卡
            sd.consumeRoomCard = e.consumeRoomCard; //消耗的房卡
            sd.winlose = e.totalScore; //输赢
            sd.winlose = (sd.winlose/100).toFixed(2);
            sd.winlose = parseFloat(sd.winlose);
            
            if (sd.winlose>0 && sd.winlose>d.maxsco){
                d.maxsco = sd.winlose;
            }

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
        this.nocheckjpq = false;

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
