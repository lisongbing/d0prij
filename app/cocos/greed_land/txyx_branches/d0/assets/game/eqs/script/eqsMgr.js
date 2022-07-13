
let BaseMgr = require('GameBaseMgr');

let DEF = require('eqsDef');
let d2Logic = require('eqsLogic');
let d2Audio = require('eqsAudio');
let d2Player = require('eqsPlayer');
let d2MsgQueue = require('eqsMsgQueue');
let d2BackPlay = require('eqsBackPlay');

cc.Class({
    extends: BaseMgr,

    properties: {
    },

    dbgstr: function (info) {
        let s = '2710'; //d2

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

        this.isIniting = true;

        if (this.isGameEndFinal) {
            cc.log(this.dbgstr('已经处于最终总结算 不在处理断线重连'));
            return;
        }

        if (roomInfo.backPlayData) {
            cc.log(this.dbgstr('回放')); 

            roomInfo.status = DEF.RMSTA.Free.v;

            this.backPlay = new d2BackPlay();
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
            this.msgQue = new d2MsgQueue();
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
            this.logic = new d2Logic();
            this.logic.init(this);
        }

        // 音乐模块
        if (! this.audio) {
            this.audio = new d2Audio();
            this.audio.init(this);
        }
        this.audio.curBGM = '';
        
        //UID玩家 位置玩家
        if (! this.uidPlayers) {
            this.uidPlayers = {};
            this.posPlayers = {};
        }

        this.isGameBao = false;

        this.players.forEach(e => {
            e.big2Info = e.bigtwoInfo;
        });
        
        this.upExpand();

        // 刷新游戏
        if (this.gameScript != null) {
            // 玩家视图
            if (this.gameScript.needreinit) {
                this.gameScript.needreinit = false;
                this.gameScript.initPlayerView();
            }
        }

        // 更新玩家
        this.cardPlayer = null;
        this.upPlayers();
        this.upXiaojia();
        
        for (const key in this.uidPlayers) {
            this.uidPlayers[key].d.big2Info = null;
        }

        // 刷新游戏
        if (this.gameScript != null) {
            this.DMode.isDrive = false;
            this.gameScript.resetGame();
            this.DMode.isDrive = true;

            this.msgQue.resume();
        }

        this.isIniting = false;
    },


    // 扩展数据 短线重连使用
    upExpand: function () {
        let d = this.roomInfo.expand;

        // 圈
        this.curQuan = this.totQuan = 0;

        // 圈数    1,圈贰 2,圈伍 3,圈拾 4,圈叁
        for (let i = 0; i < this.roomInfo.NewRlue.length; ++i) {
            let rl = this.roomInfo.NewRlue[i];
            if (rl>=1 && rl<=4) {
                this.totQuan = rl;
            } else if (rl==15) {
                DEF.StartCardNum = 14;
                this.logic.jiaohx = 1;
            } else if (rl==16) {
                DEF.StartCardNum = 20;
            }
        }

        cc.log('this.roomInfo.expand', this.roomInfo.expand);

        if (this.isBackPlayMode()) {
            return
        }

        this.curQuan = i64v(d[0]) || 1;
    },
    
    // 小家
    upXiaojia: function () {
        for (const key in this.uidPlayers) {
            this.uidPlayers[key].isXJ = false;
        }

        if (this.roomInfo.total!=4 || (this.roomInfo.origin==18 && DEF.StartCardNum==14)) return;

        let xj = -1;
        for (const key in this.uidPlayers) {
            let e = this.uidPlayers[key];
            if (e.isZhuang) {
                if (e.d.deskId==0)
                    xj = 3;
                else
                    xj = e.d.deskId-1;
            }
        }

        cc.log('小家位置 ', xj);

        for (const key in this.uidPlayers) {
            let e = this.uidPlayers[key];
            if (e.d.deskId==xj) 
                e.isXJ = true;
            else
                e.isXJ = false;
        }
    },

    isBackPlayMode: function () {
        return this.backPlay ? true : false;    
    },

    // 注册消息监听
    setNetworkMessageCallback: function () {
        this._super();

        // 结算结果通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_BIGtWO_PLAYER_RESULT_LIST, (resp) => {
            this.onGameSettle(resp);
        });

        // 总结算
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_BIGtWO_PLAYER_END_RESULT_LIST, (resp) => {
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

        let np = this.posPlayers[p.deskId] = this.uidPlayers[p.uid] = new d2Player();
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

        //cc.log('updateOp', uid, resp);

        let data = {};
        data.uid = uid;
        data.resp = resp;

        let p = this.uidPlayers[uid];
        let tag = p.d.name + '_' + uid;
        if (DEF.PlayerOptStr[resp.op.k]) {
            tag += '_' + DEF.PlayerOptStr[resp.op.k].s + ' ' + resp.op.v.join(',');
        } else {
            tag += '_' + resp.op.k.toString(2) + ' ' + resp.op.v.join(',');
        }

        //cc.log('updateOp tag', tag);

        this.msgQue.createMsg(
            'updateOp',
            (data)=>{
                let uid = data.uid;
                let resp = data.resp;

                let t = 0;
                if (this.uidPlayers[uid]) {
                    t = this.uidPlayers[uid].opt(resp.op);

                    for (const key in this.uidPlayers) {
                        const e = this.uidPlayers[key];
    
                        if (key != uid) {
                            e.otherOpt(uid, resp.op);
                        }
                    }
                } else {
                    cc.error('updateOp uid', uid);
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
    onPlayerReady: function (p) {
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
        //this.roomInfo.status = DEF.RMSTA.SendCard.v;
        //this.roomInfo.cardNum = DEF.ToltalCardNum;
        this.gameScript.Node_quan.active = true;
        //this.gameScript.starGame();
    },

    // 发牌完毕
    onSendCardEnd: function () {
        //cc.log(this.dbgstr('onSendCardEnd'));
        cc.log('    发牌完毕 进入预处理阶段');
        this.roomInfo.status = DEF.RMSTA.PreDo.v;
    },

    // 预处理完毕
    onPerdoEnd: function () {
        //cc.log(this.dbgstr('onPerdoEnd'));
        cc.log('    预处理完毕 进入玩牌阶段');
        this.roomInfo.status = DEF.RMSTA.Play.v;

        for (const k in this.uidPlayers) {
            this.uidPlayers[k].d.status = DEF.PlayerSta.Play.v;
        }
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

        this.isGameEnding = false;
        this.gameScript.onGameSettlementEnd();

        this.msgQue.finishMsg();

        // cc.sys.garbageCollect();
    },
    prepareSettleData: function (resp) {
        {/*
            //@api:1024,@type:resp
            message BigTwoPlayerResultListNtf{
                int64 huer = 1;//胡牌的玩家
                int64 dianpaoer = 2;//点炮的人
                repeated int32 remaincards = 3;//剩下没发完的牌
                repeated BigTwoResultInfo list = 4;  //玩家牌的信息及输赢
            }

            //大贰的结算结果
            message BigTwoResultInfo{
                int32   winlose = 1;
                int32   base    = 2;//底分
                int32 	hufan = 3;//胡的番数
                int32 	huxi  = 4;//胡的胡息
                int64   uid     = 5;//玩家的id
                int32   hucard = 6;//胡的牌
                repeated int32 mingtang  = 7;   //要显示的名堂
                repeated BigTwoCards hand = 8;//玩家的手牌
                repeated BigTwoCards putout = 9;//玩家放下去的牌
                repeated HongZhongMahjongdetailWin details = 10; //玩家的输赢详情
            }

            message BigTwoCards{
                repeated int32 cards = 1;//玩家的手牌
            }

            //红中麻将输赢详情
            message HongZhongMahjongdetailWin{
                string type = 1;
                string name = 2;//谁的输赢
                int32  winValue = 3;//具体的值
            }
        */}

        let d = {};

        d.huer = resp.huer.toNumber ? resp.huer.toNumber() : resp.huer; //胡牌的玩家
        d.dianpaoer = resp.dianpaoer.toNumber ? resp.dianpaoer.toNumber() : resp.dianpaoer; //点炮的人

        //剩下没发完的牌
        d.remaincards = [];
        resp.remaincards.forEach(e => d.remaincards.push(e));

        //玩家牌及输赢
        let playerSD = {};
        let uids = [];
        resp.list.forEach(e => {
            let sd = {};
            
            sd.winlose = e.winlose; // 输赢分数
            sd.base   = e.base;   //底分
            sd.hufan  = e.hufan;  //胡的番数
            sd.huxi   = e.huxi;   //胡的胡息
            sd.hucard = e.hucard; //胡的牌
            sd.uid = e.uid.toNumber ? e.uid.toNumber() : e.uid;

            sd.winlose = (sd.winlose/100).toFixed(2);
            sd.winlose = parseFloat(sd.winlose);

            //玩家的手牌
            let hcidx = 1;
            sd.hand = [];
            e.hand.forEach(elm => {
                let gi = {}; //grop info

                let g = [];
                elm.cards.forEach(c => g.push(c));
    
                let des = null;
                if ((g.length == 3) && (g[0]===g[1] && g[0]===g[2])) {
                    des = '坎';
                } else if ((g.length == 4) && (g[0]===g[1] && g[0]===g[2] && g[0]===g[3])) {
                    des = '磙';
                }

                let hu = this.logic.getHuInfo(g);

                gi.codes = g;
                gi.des = des;
                if (hcidx++ < e.hand.length){
                    gi.hu = hu ? hu.h : 0;
                } else {
                    gi.hu = hu ? hu.h : 0;
                }

                sd.hand.push(gi);
            });

            //玩家放下去的牌
            sd.putout = [];
            e.putout.forEach(elm => {
                let gi = {}; //grop info

                let g = [];
                elm.cards.forEach(c => g.push(c));

                let v0 = -1;
                if (g.length == 5) {
                    v0 = g.shift();
                }
    
                let des = null;
                if (v0 == 0) {
                    des = '雨';
                } else if (v0 == 1) {
                    des = '开';
                } else {
                    if ((g.length == 3) && (g[0]===g[1] && g[0]===g[2])) {
                        des = '对';
                    } else {
                        des = '吃';
                    }
                }

                gi.codes = g;
                gi.des = des;

                let hu = (g.length >= 3) ? this.logic.getHuInfo(g) : null;

                if (v0 == 1) {
                    gi.hu = hu ? hu.t : 0;
                } else {
                    gi.hu = hu ? hu.t : 0;
                }

                sd.putout.push(gi);
            });


            //要显示的名堂
            sd.mtHu = [];
            sd.mtFan = [];
            sd.mtall = [];
            sd.mtstr = [];
            if (sd.huxi >= 0) {
                let hts = { 1:'天胡', 2:'地胡', 3:'抬炮', 4:'堂出', 5:'自摸', 
                            6:'昆胡', 7:'漂胡', 8:'清一色', 9:'圈胡', 10:'双圈',
                            11: '滚番', 12: '大胡', 13: '上台', };

                e.mingtang.forEach(v => {
                    sd.mtall.push(v);
                    sd.mtstr.push(hts[v] ? hts[v] : '未知名堂'+v);
                    return;
                });
            }

            sd.details = [];
            e.details.forEach(elm => {
                sd.details.push({
                    type:elm.type,
                    name:elm.name,
                    winValue:elm.winValue,
                });
            });


            //玩家的id
            playerSD[sd.uid] = sd;
            // if (this.roomInfo.total >= 4){
            //     if (sd.uid!=xid && sd.uid!=zid) {
            //         uids.push(sd.uid);
            //     }
            // } else {
                if (sd.uid != d.huer) {
                    uids.push(sd.uid);
                }
            ///}
        });

        if (d.dianpaoer > 0) {
            playerSD[d.dianpaoer].mtHu.push('ht' + 11);
        }

        // if (this.roomInfo.total >= 4){
        //     uids.push(zid);
        //     uids.push(xid);
        // } else {
            if (resp.huer > 0) {
                uids.splice(0, 0, resp.huer.toNumber ? resp.huer.toNumber() : resp.huer);
            }
        //}

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
                p.ishuer = (k == d.huer);
                p.isdianpao = (k == d.dianpaoer);
                p.view = e.view;

                p.isself = eq64(p.uid, cc.g.userMgr.userId);
    
                d.player.push(p);

                if (p.ishuer) {
                    d.pHuer = p;
                }
            });
        } else {
            uids.forEach(k => {
                const e = this.uidPlayers[k];
    
                let p = {};
                p.uid = k;
                p.icon = e.d.icon;
                p.name = e.d.name;
                p.settle = playerSD[k];
                p.ishuer = (k == d.huer);
                p.isdianpao = (k == d.dianpaoer);
                p.view = this.uidPlayers[k].view;

                p.isself = eq64(p.uid, cc.g.userMgr.userId);
    
                d.player.push(p);

                if (p.ishuer) {
                    d.pHuer = p;
                }
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
            sd.winlose = e.winlose; //输赢
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

        if (this.isGameBao) {
            this.audio.bgmBao();
        } else {
            this.audio.bgmGame();
        }
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
        this.isGameBao = false;

        for (const key in this.uidPlayers) {
            //this.uidPlayers[key].time = -1;
            //this.uidPlayers[key].view.upDaojishi();
            this.uidPlayers[key].view && this.uidPlayers[key].view.unscheduleAllCallbacks();
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
        rm.cardNum = ri.cardNum;
        rm.bottom_card = cc.g.clone(ri.backPlayData.bottom_card);

        // 记录玩家
        let player = {};
        for (const key in this.uidPlayers) {
            let p = this.uidPlayers[key];
            let o = {};

            o.status = p.d.status;
            o.money = cc.g.clone(p.d.money);
            o.cards = cc.g.clone(p.d.cards);
            o.isZhuang = p.isZhuang;
            o.isReady = p.isReady;
            o.asSelf = p.asSelf;

            o.showGroups = cc.g.clone(p.showGroups);
            o.outCodes = cc.g.clone(p.outCodes);
            o.baiHuxi = p.baiHuxi;
            o.bustCode = cc.g.clone(p.bustCode);
            o.canhuCode = cc.g.clone(p.canhuCode);
            o.curchcInfo = cc.g.clone(p.curchcInfo);
            o.jiaokv = cc.g.clone(p.jiaokv);
            o.isGameBao = p.isGameBao;
            o.waitCode = p.waitCode;
            o.obks = cc.g.clone(p.obks);

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
        ri.cardNum = rm.cardNum;
        ri.backPlayData.bottom_card = cc.g.clone(rm.bottom_card);

        // 玩家
        for (const key in player) {
            let o = player[key];

            let p = this.uidPlayers[key];

            p.d.status = o.status;
            p.d.money = cc.g.clone(o.money);
            p.isZhuang = o.isZhuang;
            p.isReady = o.isReady;
            p.asSelf = o.asSelf;

            p.d.cards = cc.g.clone(o.cards);
            p.d.cardNum = p.d.cards.length;
            p.hcGroups = this.logic.handcard2Grops(p.d.cards );

            p.showGroups = cc.g.clone(o.showGroups);
            p.outCodes = cc.g.clone(o.outCodes);
            p.baiHuxi = o.baiHuxi;
            p.bustCode = cc.g.clone(o.bustCode);

            p.canhuCode = cc.g.clone(o.canhuCode);
            p.curchcInfo = cc.g.clone(o.curchcInfo);
            p.jiaokv = cc.g.clone(o.jiaokv);
            p.isGameBao = o.isGameBao;
            p.waitCode = o.waitCode;
            p.obks = cc.g.clone(o.obks);
        }

        this.gameScript.upPage();

        if (this.gameScript.settleView && this.gameScript.settleView.root.active) {
            this.gameScript.settleView.hide();
            this.msgQue.finishMsg();
        }
    },
    /* ================回放回退记录和还原============================================================================== */
});
