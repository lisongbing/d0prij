const OPT_Online = 993;
const OPT_JiesanTP = 996;//解散投票
const OPT_Jiesan = 997;//申请解散
const OPT_Tuoguan = (1<<30)-1;

cc.Class({
    extends: cc.Component,
    properties: {
        roomInfo: null,
        players: null,
        selfDeskId: 0,
        timeDelta: 0,
        pause: false,
    },

    //初始化房间、玩家信息
    init: function (roomInfo, player, otherPlayers) {
        cc.log('GameBaseMgr init');

        // 刷新游戏
        this.lastCurGameNum = roomInfo.curGameNum;

        if (roomInfo.opTimeStamp && roomInfo.opTimeStamp!='') {
            this.timeStamp = roomInfo.opTimeStamp;
        } else {
            this.timeStamp = this.timeStamp || '';
        }

        roomInfo.base = cc.g.utils.realNum1(roomInfo.base);

        this.isNojoinRoom = false;
        for (let i = 0; i < roomInfo.NewRlue.length; ++i) {
            if (roomInfo.NewRlue[i] == 97) {
                cc.log('房间是禁止加入的');
                this.isNojoinRoom = true;
                break;
            }
        }

        this.selfUID = cc.g.userMgr.userId;
        if (roomInfo.backPlayData) {
            this.selfUID = player.uid;
        }

        //test
        this.pause = false;
        this.timeDelta = this.isBackPlayMode() ? 0 : roomInfo.now.toNumber() - Date.now();
        this.roomInfo = roomInfo;
        this.players = [];
        this.players[0] = player;
        this.selfDeskId = player.deskId;

        this.isTguoguan = this.players[0].isAuto;

        if (!this.roomInfo.autoCountDown) {
            this.roomInfo.autoCountDown = [];
        }

        if (otherPlayers != null && otherPlayers.length > 0) {
            this.players = this.players.concat(otherPlayers); 
        }
        
        this.setNetworkMessageCallback();
    },

    JoinVoiceRoom: function () {
        if (this.gameScript) return;
        if (this.roomInfo.backPlayData) return;
        
        cc.g.voiceMgr.joinChatRoom(`${this.roomInfo.roomId}`);
    },
    QuiteVoiceRoom: function () {
        if (this.roomInfo.backPlayData) return;

        cc.g.voiceMgr.leaveAllChatRooms();
    },
    onVoiceState: function (uid, sta, dur) {
        this.gameScript && this.gameScript.updateGVoiceStatus(uid, sta, dur);
    },

    getCurServerTime: function () {
        return Math.floor((Date.now() + this.timeDelta) / 1000);
    },

    getCurServerMSTime: function () {
        return Date.now() + this.timeDelta;
    },

    getPlayer: function (uid) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].uid.eq(uid)) {
                return this.players[i];
            }
        }
        return null;
    },

    getSelfPlayer: function () {
        return this.players[0];
        //return this.getPlayer(cc.g.userMgr.userId);
    },

    getDealer: function () {
        return this.getPlayer(this.roomInfo.dealer);
    },

    getPlayerByGVoiceId: function (id) {
        // for(let i = 0; i < this.players.length; i++) {
        //     if(this.players[i].gVoiceId === id) {
        //         return this.players[i];
        //     }
        // }
        for(let i = 0; i < this.players.length; i++) {
            if(eq64(this.players[i].uid, id)) {
                return this.players[i];
            }
        }

        return null;
    },
    playerQuited: function (player) {
        if (eq64(this.selfUID, player.uid)) {//如果是自己
            cc.log("删除自己")
            
            if (!this.isBackPlayMode()) {
                cc.g.hallMgr.inGameMenu.onBTnQxtg();
            }
            
            this.registered = false;
            this.pause = false;
        }
    },

    setPause: function (pause) {
        this.pause = pause;
    },

    //设置网络回调
    setNetworkMessageCallback: function () {
        if (this.registered) {
            return;
        }
        this.registered = true;
        //玩家语音成员ID

        cc.g.networkMgr.addHandler(PB.PROTO.BIND_PLAYER_GVOICE_ID, (resp) => {
            if (this.pause) {
                return;
            }
            let player = this.getPlayer(resp.uid);
            if (player != null) {
                player.gVoiceId = resp.gVoiceId;
            }
        });
        //玩家金币更新
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GAME_MONEY_UPDATE, (resp) => {
            if (this.pause) {
                return;
            }
            cc.log('玩家金币更新');
            let player = this.getPlayer(resp.uid);
            if (player != null) {
                cc.log('玩家', resp.uid);
                player.money = resp.value;
                //this.playerMoneyUpdated(player);
            }
            this.playerMoneyUpdated(player, resp.value);
        });

        //新玩家加入房间
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_JOIN_ROOM, (resp) => {
            {
                /*  
                    // 有人加入房间
                    //@api:1013,@type:resp
                    message JoinRoomNtf {
                        Player other = 1;
                    }
                */
            }

            if (this.pause) {
                return;
            }
            cc.log('玩家[' + resp.other.name + ',' + resp.other.uid.toString() + ']加入了房间');
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].uid.eq(resp.other.uid)) {
                    this.players[i] = resp.other;
                    this.playerInfoUpdated(resp.other);
                    return;
                }
            }
            this.players.push(resp.other);
            this.newPlayerJoined(resp.other);
            if(cc.g.hallMgr.inGameMenu.locationNode && cc.g.hallMgr.inGameMenu.Button_location.active == true){
                cc.g.hallMgr.inGameMenu.locationNode.getComponent('dlgLocation').init();
            }
        });

        //玩家离开房间
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_QUIT_ROOM, (resp) => {
            cc.log("玩家离开房间");

            if (resp.error == PB.ERROR.GOLD_NOT_ENOUGH_DISBAND) {
                let p = this.getPlayer(resp.uid);
                let ctt = `玩家${p ? p.name : '不知道谁'}积分不足，根据比赛规则房间已自动解散！`;

                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', ctt, () => {
                });

                return;
            }

            if (resp.error == PB.ERROR.PLAYER_TG_DISBAND) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', cc.g.utils.getError(resp.error), () => {
                    if (! this.isGameEndFinal) {
                        this.playerQuited(this.getSelfPlayer());
                        cc.g.hallMgr.backToHall();
                    }
                });

                return;
            }

            if (this.pause) {
                cc.log("游戏暂停");
                return;
            }
            
            //删除玩家
            if (eq64(this.selfUID, resp.uid)) {
                if((resp.error == PB.ERROR.GAME_OWNER_QUIT && this.roomInfo.owner.neq(this.selfUID))
                    || (resp.error != PB.ERROR.PLAYER_QUIT && resp.error != PB.ERROR.GAME_OWNER_QUIT)) 
                {
                    if (resp.error == 1032) { // 积分房间房主退出,房间解散
                        if (! this.isGameEndFinal) {
                            this.playerQuited(this.getSelfPlayer());
                            cc.g.hallMgr.backToHall();
                        }
                    } else {
                        cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', cc.g.utils.getError(resp.error), () => {
                            if (! this.isGameEndFinal) {
                                this.playerQuited(this.getSelfPlayer());
                                cc.g.hallMgr.backToHall();
                            }
                        });
                    }
                } else {
                    if (! this.isGameEndFinal) {
                        this.playerQuited(this.getSelfPlayer());
                        cc.g.hallMgr.backToHall();
                    }
                }
                
                return;
            }

            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].uid.eq(resp.uid)) {
                    cc.log('玩家[' + this.players[i].name + ',' + this.players[i].uid.toString() + ']离开了房间');
                    this.playerQuited(this.players[i]);
                    this.players.splice(i, 1);
                    if(cc.g.hallMgr.inGameMenu.locationNode && cc.g.hallMgr.inGameMenu.Button_location.active == true){
                        cc.g.hallMgr.inGameMenu.locationNode.getComponent('dlgLocation').init();
                    }
                    break;
                }
            }
        });

        //游戏状态更新
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GAME_STATUS, (resp) => {
            {
                /*
                    // 游戏当前状态
                    //@api:1010,@type:resp
                    message GameStatusNtf{
                        GAME gameType = 1;
                        int32 status = 2;
                        int64 end = 3;
                        int64 start = 4;
                        int64 oper  = 5;
                    }
                */
            }

            cc.log('游戏状态更新');

            if (this.pause) {
                return;
            }
            if (resp.gameType != this.roomInfo.gameType) {
                cc.log('NOTIFY_GAME_STATUS gameType error!');
                return;
            }
            cc.log('进入游戏状态' + resp.status);
            
            this.roomInfo.status = resp.status;
            this.roomInfo.start = resp.start;
            this.roomInfo.end = resp.end;
            this.roomStatusUpdated(resp);
        });

        //玩家状态更新
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_USER_STATUS, (resp) => {
            cc.log('玩家状态更新');
            if (this.pause) {
                return;
            }
            if (resp.gameType != this.roomInfo.gameType) {
                cc.log('NOTIFY_USER_STATUS gameType error!');
                return;
            }
            cc.log('玩家' + resp.id.toString() + '进入状态' + resp.status);
            //cc.log(this.players)
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].uid.eq(resp.id)) {
                    this.players[i].status = resp.status;
                    this.players[i].start = resp.start;
                    this.players[i].end = resp.end;
                    this.playerStatusUpdated(this.players[i]);
                    break;
                }
            }
        });

        //玩家操作回复
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_USER_OP, (resp) => {
            if (eq64(this.selfUID, resp.id)) {
                cc.log('玩家自己操作回复');

                if (this.pause) {
                    return;
                }
                if (resp.gameType != this.roomInfo.gameType) {
                    cc.log('USER_OP_RESP gameType error!');
                    return;
                }
                this.mgrOp(this.selfUID, resp, true);

                return;
            }

            cc.log('其他玩家操作推送 this.pause ', this.pause);

            if (this.pause) {
                return;
            }
            if (resp.gameType != this.roomInfo.gameType) {
                cc.log('USER_OP_RESP gameType error!');
                return;
            }
            this.mgrOp(resp.id, resp);
        });
        cc.g.networkMgr.addHandler(PB.PROTO.USER_OP, (resp) => {
            cc.log('玩家自己操作回复');

            if (this.pause) {
                return;
            }
            if (resp.gameType != this.roomInfo.gameType) {
                cc.log('USER_OP_RESP gameType error!');
                return;
            }
            this.mgrOp(this.selfUID, resp, true);
        });

        //骂街
        cc.g.networkMgr.addHandler(PB.PROTO.TALK_TO_ALL, (resp) => {
            if (this.pause) {
                return;
            }
            let player = this.getPlayer(resp.uid);
            if (this.gameScript != null && player != null) {
                if (resp.type == 1) {
                    this.gameScript.showDialog(player, resp.id);
                } else if (resp.type == 2) {
                    this.gameScript.showAnmEmoji(player, resp.id);
                } else if (resp.type == 3) {
                    this.gameScript.showInteractEmo(player, this.getPlayer(resp.target), resp.id);
                } else {
                    cc.log('骂街', resp);
                }
            }
        });

    },

    roomStatusUpdated: function (resp) {

        let status = resp.status;

        cc.log('roomStatusUpdated status', status);

        if (this.roomInfo.curGameNum > 0) {
            return;
        }

        if (status == -100) {
            let plrs = this.uidPlayers;
            if (plrs) {
                for (const key in plrs) {
                    let p = plrs[key];
                    
                    p.d.outLineTime = 0;
                    if (p.view && p.view.upOnline) {
                        p.view.upOnline();
                    }
                }
            }
        }

        if (status == 0) {//等待状态
            //this.resetPlayers();
            // 刷新游戏
            if (this.gameScript != null) {
                this.gameScript.upPage();
            }
        }
    },

    mgrOp: function (uid, resp, isself) {
        // Online:{
        //     v: 993,
        //     s: '在线离线',
        // },
        
        //cc.log('mgrOp', uid, resp, isself);

        if (resp.op.timeStamp && resp.op.timeStamp != ''){
            this.timeStamp = resp.op.timeStamp;
        }

        if (resp.op.k == OPT_Jiesan) {
            cc.log('解散次数检查 mgrOp OPT_Jiesan uid', uid);
            this.askJiesanUid = uid;
            if (resp.op.v[0] > 0) {
                cc.g.global.hint(`每局游戏最多解散${resp.op.v[0]}次`);
                return;
            } else if (resp.op.v[0] >= 0) {
                cc.g.global.hint(`解散次数不足`);
                return;
            }
        } else if (resp.op.k == OPT_JiesanTP) {
            cc.log('解散投票');

            let v = resp.op.v[0];
            if (v.toNumber) {
                v = v.toNumber();
            }

            if (v == 0){
                this.askJiesanUid = null;
            }
        }
        
        if (resp.op.k == OPT_Jiesan || resp.op.k == OPT_JiesanTP) {
            if (this.uidPlayers) {
                if (this.uidPlayers[uid] && this.uidPlayers[uid].opt) {
                    this.uidPlayers[uid].opt(resp.op);
                } else {
                    cc.error('mgrOp uid', uid);
                }
            } else {
                cc.error('mgrOp uidPlayers', uidPlayers);
            }
            
            return;
        }

        if (resp.op.k == OPT_Online) {
            cc.log('处理在线离线');

            if (resp.op.v[0]==2) {
                if (GameConfig.isJietu && !isself) {
                    let p = this.getPlayer(uid);
                    cc.g.global.showTipBox(`${p ? p.name : ('不知道谁'+i64v(uid))}正在截图，请注意！`, ()=>{
                    });
                }
            } else {
                this.upOnline(uid, resp.op.v);
            }

            return;
        }


        // 托管 (1<<30) -1
        if (resp.op.k == OPT_Tuoguan) {
            cc.log('处理托管');

            let isself = eq64(this.selfUID, resp.id);
            let ri = this.roomInfo;

            if (resp.op.v.length > 1) {// 超过次数
                if (isself) {
                    cc.g.hallMgr.inGameMenu.showTuoguan(true);
                    this.isTguoguan = true;
                    cc.g.global.hint(`取消托管最多${resp.op.v[1]}次`);
                }

                ri.autoCountDown = [resp.id, -1];
                if (this.gameScript && this.gameScript.upTuoguanTishi) {
                    this.gameScript.upTuoguanTishi();
                }
            } else if (resp.op.v[0] == 2) {// 进入托管
                if (isself) {
                    cc.g.hallMgr.inGameMenu.showTuoguan(true);
                    this.isTguoguan = true;
                }

                if (this.uidPlayers[resp.id] && this.uidPlayers[resp.id].tuoguan) {
                    this.uidPlayers[resp.id].tuoguan(true);
                }

                if (this.gameScript && this.gameScript.clearTgTishi) {
                    this.gameScript.clearTgTishi(resp.id);
                }
            } else if (resp.op.v[0] == 0) {// 取消托管
                if (isself) {
                    cc.g.hallMgr.inGameMenu.showTuoguan(false);
                    this.isTguoguan = false;
                }

                if (this.uidPlayers[resp.id] && this.uidPlayers[resp.id].tuoguan) {
                    this.uidPlayers[resp.id].tuoguan(false);
                }
            } else if (resp.op.v[0] == 3) {// 将要托管
                //ri.autoCountDown = [resp.id, 15];
                ri.autoCountDown = ri.autoCountDown.concat([resp.id, 15]);
                if (this.gameScript && this.gameScript.upTuoguanTishi) {
                    this.gameScript.upTuoguanTishi();
                }
            }

            return;
        }

        if (resp.op.k == 1) {    //if (this.isTguoguan && resp.op.k == 1) {
            if (eq64(this.selfUID, resp.id)) {
                cc.log('托管的情况下自己准备');
                if (this.gameScript && this.gameScript.settleView && this.gameScript.settleView.root.active) {
                    this.gameScript.settleView.goOnGame();
                }
            }
        }

        // 所有游戏托管倒计时操作后没有清除
        if (resp.op.k != OPT_Online && resp.op.k != OPT_Jiesan) {
            if (this.gameScript && this.gameScript.clearTgTishi) {
                this.gameScript.clearTgTishi(resp.id);
            }
        }

        this.updateOp(uid, resp);
    },
    upOnline: function (uid, v) {
        if (this.uidPlayers && this.uidPlayers[uid]) {
            this.uidPlayers[uid].upOnline(v);
            return;
        } else {
            cc.warn('not do upOnline uid', uid);
        }
    },
    ChangeOnline: function (ison) {
        //0 离线， 1 在线
        if (!this.isBackPlayMode || !this.isBackPlayMode()) {
            this.sendOp(OPT_Online, [(ison ? 1 : 0)]);
        }
    },
    onScreenshot: function () {
        if (!this.isBackPlayMode || !this.isBackPlayMode()) {
            this.sendOp(OPT_Online, [2]);
        }
    },

    sendOp: function (k, v, timeStamp=null) {
        {
            /*
            // 玩家操作
            //@api:1011,@type:req
            message UserOpReq{
                GAME gameType = 1;
                OP  op = 2;
            }
            message OP {
                int32 k = 1;
                repeated int64 v = 2;
            }
            */
        }
        if (cc.g.utils.judgeObjectEmpty(this.roomInfo.gameType)) {
            return
        }

        let req = pbHelper.newReq(PB.PROTO.USER_OP);
        req.gameType = this.roomInfo.gameType;
        let op = new PB.OP();
        op.k = k;
        if (v != null) {
            op.v = v;
        }
        if (timeStamp != null) {
            op.timeStamp = timeStamp;
        } else {
            op.timeStamp = this.timeStamp;
        }
        req.op = op;
        cc.g.networkMgr.send(PB.PROTO.USER_OP, req);
    },

    // 定位更新
    onLocationUp: function (loc) {
        if (eq64(this.selfUID, loc.uid)) {
            //cc.g.global.hint('定位更新');
            cc.log('定位更新');
        }
        
        let p = this.getPlayer(loc.uid);
        if(!p) {
            cc.error('定位更新玩家找不到 uid', loc.uid);
            return;
        }

        p.gps.longitude = loc.longitude;
        p.gps.latitude = loc.latitude;

        if(cc.g.hallMgr.inGameMenu.locationNode && cc.g.hallMgr.inGameMenu.Button_location.active == true){
            cc.g.hallMgr.inGameMenu.locationNode.getComponent('dlgLocation').upGps(this.players);
        }
    },

    sendTalkToAllReq: function (id, type, content, target) {
        {/*
            // 骂街
            //@api:1018,@type:req
            message TalkToAllReq{
                int32 id = 1;
                int32 type = 2;
                string content = 3;
                int64 target = 4;//给谁发表情
            }
        */}
        let req = pbHelper.newReq(PB.PROTO.TALK_TO_ALL);
        req.id = id ? id : 0;
        req.type = type ? type : 0;
        req.content = content ? content : '';
        if (target) {
            req.target = target;
        }
        
        cc.g.networkMgr.send(PB.PROTO.TALK_TO_ALL, req);
    },

    bindGVoiceMemberId: function (memberId) {
        //cc.log('闪退测试 bindGVoiceMemberId 1', memberId);
        this.getSelfPlayer().gVoiceId = memberId;
        //cc.log('闪退测试 bindGVoiceMemberId 2');
        let req = pbHelper.newReq(PB.PROTO.BIND_PLAYER_GVOICE_ID);
        //cc.log('闪退测试 bindGVoiceMemberId 3');
        req.gVoiceId = memberId;
        //cc.log('闪退测试 bindGVoiceMemberId 4', req);
        cc.g.networkMgr.send(PB.PROTO.BIND_PLAYER_GVOICE_ID, req);
        //cc.log('闪退测试 bindGVoiceMemberId 5');
    },

    checkRoomRule: function (rule) {
        return (this.roomInfo.rule & (1 << rule)) != 0;
    },

    checkAllPlayersReady: function () {
        if(this.players.length <= 1){
            return false;
        }
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].status !== 1) {
                return false;
            }
        }
        return true;
    },

    isBackPlayMode: function () {
        return false;    
    },

    isCardRoomType: function () {
        return this.roomInfo.type === 2;
    },

    isGoldRoomType: function () {
        return this.roomInfo.type === 1;
    },

    isCardRoomUnstarted:function () {
        return this.isCardRoomType() && this.roomInfo.curGameNum === 0;
    },

    isCardRoomFirstGame: function () {
        return this.isCardRoomType() && this.roomInfo.curGameNum === 1;
    },

    isCardRoomGameOver:function () {
        return this.isCardRoomType() && this.roomInfo.curGameNum === this.roomInfo.GameNum;
    },
});
