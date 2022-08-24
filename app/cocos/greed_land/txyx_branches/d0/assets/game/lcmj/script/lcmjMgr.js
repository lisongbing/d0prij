
var BaseMgr = require('GameBaseMgr');
var MajhPlayer = require('lcmjPlayer');
var majhMsgQueue = require('lcmjMsgQueue');
var mjBackPlay = require('lcmjBackPlay');
let mjAudio = require('lcmjAudio');
var DEF = require('lcmjDef');
cc.Class({
    extends: BaseMgr,

    properties: {
    },

    dbgstr: function (info) {
        let s = '隆昌';  //隆昌麻将
        if (info) {
            return s + ' :: ' + info;    
        }
        return s + ' ';
    },


    // onLoad () {},

    start () {

    },

    // isBackPlayMode: function () {
    //     return this.backPlay ? true : false;
    // },

    // 注册消息监听
    setNetworkMessageCallback: function () {
        this._super();

        // 结算结果通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GAME_PLAYER_RESULT_LIST, (resp) => {
            this.onGameSettle(resp);
        });

        // 总结算
        cc.g.networkMgr.addHandler(PB.PROTO.PROTO_NOTIFY_GAME_PLAYER_END_RESULT_LIST, (resp) => {
            this.onGameSettleFinal(resp);
        });
    },

    // update (dt) {},

    // 初始化房间、玩家信息
    init: function (roomInfo, player, otherPlayers) {
        // cc.dlog('断线重连......\n\n\n\n\n\n\n\n')
        // cc.dlog('majhMgr-roomInfo->', JSON.stringify(roomInfo))
        // cc.dlog('majhMgr-player->', JSON.stringify(player))
        // cc.dlog('majhMgr-otherPlayers->', JSON.stringify(otherPlayers))
        // cc.dlog('断线重连结束......\n\n\n\n\n\n\n\n')
        // 初始化为false
        this.isGameEndFinal = false;

        if (roomInfo.backPlayData) {
            // cc.dlog(this.dbgstr('回放'));

            roomInfo.status = DEF.RMSTA.Free.v;

            this.backPlay = new mjBackPlay();
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

        //消息队列
        if (! this.msgQue) {
            this.msgQue = new majhMsgQueue();
            this.msgQue.init();
        }
        this.msgQue.begin();
        this.msgQue.pause();

        this._super(roomInfo, player, otherPlayers);
        if (this.backPlay) {
            this.backPlay.init(this);
        }

        //UID玩家 位置玩家
        if (! this.uidPlayers) {
            this.uidPlayers = {};   
            this.posPlayers = {};
        }

        this.xiaojjs = false;

        // 更新玩家
        this.upPlayers();

        // 刷新游戏
        if (this.gameScript != null) {
            this.msgQue.resume();
            // this.DMode.isDrive = false;
            this.gameScript.resetGame();
            // this.DMode.isDrive = true;
            
        }

        // 音乐模块
        if (! this.audio) {
            this.audio = new mjAudio();
            this.audio.init(this);
        }
    },

    isBackPlayMode: function () {
        return this.backPlay ? true : false;    
    },

    // 更新玩家情况
    upPlayers: function () {
      // 去除已经不再的玩家
      let qt = [];
        for (const key in this.uidPlayers) {
            let p = this.uidPlayers[key];
            let isIn = false;
            for (let j = 0; j < this.players.length; ++j) {
                let uuid = this.players[j].uid
                let eqUid = eq64(key, uuid)
                if (eqUid) {
                    isIn = true;
                    break;
                }
            }
            if (!isIn) {
                cc.error("upPlayers 没找到玩家，自动退出.....")
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
        let p = player;

        if (this.uidPlayers[p.uid]) {
            this.uidPlayers[p.uid].upCore(p);
            return;
        }

        // 初始化玩家数据
        let np = this.posPlayers[p.deskId] = this.uidPlayers[p.uid] = new MajhPlayer();
        // 初始化玩家
        np.init(p, this);
    },

    // 根据玩家位置获取视图位置 以0开始的视图编号
    getViewPos: function (deskId) {
        let playNum = this.roomInfo.total; //玩法人数
        // base 通过服务器告知的
        let vp = deskId - this.selfDeskId;

        if (vp < 0) {
            vp += playNum;
        }
        // 2人局
        if (playNum === 2 && deskId!= this.selfDeskId) {
            vp = 2;
        } else if (playNum === 3 && deskId!= this.selfDeskId) {
            if (vp == 2) {
                vp = 3
            }
        }
        return vp;
    },

    // 新玩家加入
    newPlayerJoined: function (player) {
        // cc.log(this.dbgstr('newPlayerJoined'));
        
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
    
    // 界面加载完成
    gameScriptLoaded: function () {
        for (const key in this.uidPlayers) {
            this.uidPlayers[key].linkView();
        }

        this.msgQue.resume();
    },

    // 玩家退出 重写
    playerQuited: function (player) {
        this._super(player);

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

    // 更新玩家操作
    updateOp: function (uid, resp) {
        let data = {};
        data.uid = uid;
        data.resp = resp;
        //cc.log(uid, resp)

        if (uid == 0) { // 通知所有玩家操作
            //cc.log("通知所有玩家操作")
            for (const key in this.uidPlayers) {
                const p = this.uidPlayers[key];
                p.opt(resp.op);
                // resp.id.low = key
                // data.resp = resp;
                // data.uid = key;
                //
                // cc.dlog('resp->', JSON.stringify(resp))
                // cc.dlog('data->', JSON.stringify(data))
                //
                // this.doRealUpOp(key, resp, p, data)
            }
        } else {
            let p = this.uidPlayers[uid];
            this.doRealUpOp(uid, resp, p, data)
        }
    },
    doRealUpOp: function(uid, resp, p, data) {
        // let p = this.uidPlayers[uid];
        const self = this
        let tag =  p.d.name + '_' + uid;
        if (DEF.PlayerOptStr[resp.op.k]) {
            tag += '_' + DEF.PlayerOptStr[resp.op.k].s + ' ' + resp.op.v.join(',');
        } else {
            tag += '_' + resp.op.k.toString(2) + ' ' + resp.op.v.join(',');
        }
        //cc.log("doRealUpOp-------->")
        this.msgQue.createMsg(
            "updateOp",
            (data)=>{
                let uid = data.uid;
                let resp = data.resp;
                // 解析玩家的OP操作
                let t = self.uidPlayers[uid].opt(resp.op);

                for (const key in self.uidPlayers) {
                    const e = self.uidPlayers[key];
                    if (key != uid) {
                        e.otherOpt(e.d.deskId, uid, resp.op);
                    }
                }

                if (!t || t<=0) {
                    self.msgQue.finishMsg();
                    return;
                }

                self.scheduleOnce(() => self.msgQue.finishMsg(), t);
            },
            data,
            tag
        )
    },
    // 玩家状态更新
    playerStatusUpdated: function(palyer) {
        // 选牌结束 更新其他玩家状态
        // if (palyer.status == 3) { // 3-换三张1
        //     this.gameScript.doShowOtherHuanSanZhangView(palyer);
        // }
    },
    // 玩家准备了
    onPlayerReady: function (p) {
        let rdNum = 0;
        for (const k in this.uidPlayers) {
            const e = this.uidPlayers[k];
        
            if (e.isReady) {
                ++rdNum;
            }
        }
        
        if (rdNum === this.roomInfo.total) {
            this.gameScript.Node_gmfreeBtns.active = false;
            cc.g.hallMgr.inGameMenu.upBtnShow();
            this.onWaitReadyEnd();
        }
    },
    //准备阶段完毕
    onWaitReadyEnd: function () {
        //cc.log("准备阶段")

        this.xiaojjs = false;
    },
    turnBegin: function () {
        // cc.log('开局 turnBegin');

        // this.roomInfo.status = DEF.RMSTA.SendCard.v;
        this.roomInfo.status = DEF.RMSTA.Piao2.v;
        this.roomInfo.cardNum = DEF.ToltalCardNum;
        //this.gameScript.starGame();
    },
    //清除游戏数据
    clearPlaydata:function () {
        //cc.log("清除游戏数据clearPlaydata")
        this.gameScript = null;

        for (const key in this.uidPlayers) {
            this.uidPlayers[key].view.unscheduleAllCallbacks();
            this.uidPlayers[key].quite();
        }
        
        this.uidPlayers = {};
        this.posPlayers = {};

        this.msgQue.end();
        this.audio.stop();
    },

    // BMG开关
    onBGMSwitch: function (swi) {
        if (!swi) {
            this.audio.stop();
            return;
        }

        this.audio.bgmGame();
    },

    //
    playerMoneyUpdated:function (player, coin) {
        this.uidPlayers[player.uid].view.upCoin(coin);
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
    // 准备
    ready: function () {
        this.sendOp(DEF.C2S.READY, [DEF.PlayerSta.Ready.v]);
    },

    // 更新玩家
    playerInfoUpdated: function (player) {
        // 更新玩家player数据
        this.uidPlayers[player.uid].upCore(player);
        this.uidPlayers[player.uid].up();
    },

    // //
    // playerMoneyUpdated:function (player, coin) {
    //     this.uidPlayers[player.uid].view.upCoin(coin);
    // },

    // 游戏结算
    onGameSettle: function (resp) {

        // cc.dlog('结算页面 prepareSettleData-->', JSON.stringify(resp))
        if (this.gameScript) {
            this.gameScript.hidderStartTimer()
        }
        this.prepareSettleData(resp);
        this.msgQue.createMsg(
            'onGameSettle',
            (data)=>{
                // cc.dlog('    游戏结算 状态空闲 进入结算显示阶段');

                this.isGameEnding = true;
                this.roomInfo.status = DEF.RMSTA.Free.v;

                for (const k in this.uidPlayers) {
                    this.uidPlayers[k].resetPlay();
                }

                this.xiaojjs = true;

                this.gameScript.onGameSettlement();
            },
            {},
            '游戏结算'
        );
    },
    onGameSettleEnd: function () {
        this.isGameEnding = false;
        this.gameScript.onGameSettlementEnd();

        this.msgQue.finishMsg();
    },
    prepareSettleData: function (resp) {
        const self = this
        let data = {}
        // 剩下的牌
        data.remaincards = resp.result.remaincards
        // 局数
        data.gameNum = resp.result.gameNum
        // 所有玩家信息
        let allPerResult = resp.result.allPerResult
        // 数据不为空
        if (!cc.g.utils.judgeArrayEmpty(allPerResult)) {
            allPerResult.forEach((item) => {
                let uid = item.uid
                let player = self.uidPlayers[uid]
                item.isZhuang = player.isZhuang
                item.icon = player.d.icon
                item.name = player.d.name

                item.win = (item.win/100).toFixed(2);
                item.win = parseFloat(item.win);
            })
        }

        data.allPerResult = allPerResult
        this.SettleData = data;
    },

    // 总结算
    onGameSettleFinal: function (resp) {
        // cc.dlog('总结算页面 onGameSettleFinal-->', JSON.stringify(resp))

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
        const self = this
        let data = {};
        data.num = resp.num;//局数
        // data.roomId = this.roomInfo.roomId;//大赢家分数
        let list = resp.list
        if (!cc.g.utils.judgeArrayEmpty(list)) {
            let maxArr = []
            list.forEach((itemOne)=>{
                itemOne.bigWin = false;
                itemOne.winlose = (itemOne.winlose/100).toFixed(2);
                itemOne.winlose = parseFloat(itemOne.winlose);
                maxArr.push(itemOne.winlose)
            })

            // 先找最大值
            let max = maxArr[0];
            for (let i = 0; i < maxArr.length - 1; i++) {
                max = max < maxArr[i+1] ? maxArr[i+1]: max
            }

            // 设置最大值
            list.forEach((itemTwo)=>{
                if (itemTwo.winlose == max) {
                    itemTwo.bigWin = true;
                }
            })

            list.forEach((item) => {
                let uid = item.uid
                let player = self.uidPlayers[uid]
                item.isZhuang = player.isZhuang
                item.icon = player.d.icon
                item.name = player.d.name

                //麻将总结算记录
                //         message MahjongEndRecord{
                //             int32 zimoCn  = 1;//自摸次数
                //             int32 jiepaoCn = 2; //接炮次数
                //             int32 dianpaoCn = 3; //点炮次数
                //             int32 angangCn = 4; //暗杠次数
                //             int32 minggangCn = 5; //明杠次数
                //             int32 chajiaoCn = 6; //查叫次数
                //             int32 wujiaoCn = 7;  //被查叫次数
                //             int32 huazuCn = 8;  //花猪次数
                //             int32 chahuazuCn = 9; //查花猪次数
                //         }

                let reacordList = []
                let mahjongEndRecord = item.mahjongEndRecord
                let zimoCnObj = {}
                zimoCnObj.name = '自摸:'
                zimoCnObj.count = mahjongEndRecord.zimoCn
                reacordList.push(zimoCnObj)

                let jiepaoCnObj = {}
                jiepaoCnObj.name = '接炮:'
                jiepaoCnObj.count = mahjongEndRecord.jiepaoCn
                reacordList.push(jiepaoCnObj)

                let dianpaoCnObj = {}
                dianpaoCnObj.name = '点炮:'
                dianpaoCnObj.count = mahjongEndRecord.dianpaoCn
                reacordList.push(dianpaoCnObj)

                let angangCnObj = {}
                angangCnObj.name = '暗杠:'
                angangCnObj.count = mahjongEndRecord.angangCn
                reacordList.push(angangCnObj)

                let minggangCnObj = {}
                minggangCnObj.name = '明杠:'
                minggangCnObj.count = mahjongEndRecord.minggangCn
                reacordList.push(minggangCnObj)

                let chajiaoCnObj = {}
                chajiaoCnObj.name = '查叫:'
                chajiaoCnObj.count = mahjongEndRecord.chajiaoCn
                reacordList.push(chajiaoCnObj)

                let wujiaoCnObj = {}
                wujiaoCnObj.name = '被查叫:'
                wujiaoCnObj.count = mahjongEndRecord.wujiaoCn
                reacordList.push(wujiaoCnObj)

                let huazuCnObj = {}
                huazuCnObj.name = '花猪:'
                huazuCnObj.count = mahjongEndRecord.huazuCn
                reacordList.push(huazuCnObj)

                let chahuazuCnObj = {}
                chahuazuCnObj.name = '查花猪:'
                chahuazuCnObj.count = mahjongEndRecord.chahuazuCn
                reacordList.push(chahuazuCnObj)

                item.reacordList = reacordList
            })
        }

        data.list = list;
        this.SettleFinalData = data;
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

            let cards = []
            let handlePaiArray = p.view.handCardView.hcGroups;
            // 隐藏红中
            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    cards.push(org.code)
                }
            }

            o.status = p.d.status;
            o.money = cc.g.clone(p.d.money);
            o.cards = cards;
            o.isZhuang = p.isZhuang;
            o.isReady = p.isReady;
            o.isSelf = p.isSelf;
            o.qiCards = cc.g.clone(p.qiCards);
            o.pongCards = cc.g.clone(p.pongCards);
            o.queIndex = p.queIndex;
            o.queIndex = p.queIndex;
            o.piao = p.piao;
            o.waitCode = p.waitCode;
            o.hu = cc.g.clone(p.d.hu);
            o.huType = cc.g.clone(p.d.huType);
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
            //cc.log(this.dbgstr('没有回放历史步骤数据'));
            return;
        }

        let sd = this.backPlay.hisStepData[this.backPlay.step];
        if (!sd) {
            //cc.log(this.dbgstr('回放历史步骤数据获取出错 请检测BUG'));
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
            p.isSelf = o.isSelf;

            p.d.cards = cc.g.clone(o.cards);
            p.d.cardNum = p.d.cards.length;

            p.qiCards = cc.g.clone(o.qiCards);
            p.pongCards = cc.g.clone(o.pongCards);

            p.queIndex = o.queIndex;

            p.piao = o.piao;
            p.waitCode = o.waitCode;

            p.d.hu = p.hu;
            p.d.huType = p.huType;

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
