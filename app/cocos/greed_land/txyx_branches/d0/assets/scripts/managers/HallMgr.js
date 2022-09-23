cc.Class({
    extends: cc.Component,
    properties: {},
    
    //https://forum.cocos.org/t/topic/47495

    init: function () {
        if (!this.inited) {
            this.inited = true;
            this.roomList = [];
            this.clubList = [];
            this.activityList = [];
            this.curGameType = -1;
            this.curGameMgr = null;
            this.bankPassword = -1;
            this.setNetworkMsgCallback();
            this.setGVoiceCallBack();

            let HIDE_FUN = ()=>{
                // if (cc.sys.isNative) {
                //     if (this.curGameMgr != null && cc.g.voiceSdk != null) {
                //         cc.g.voiceSdk.pause();
                //     }
                // }
                //cc.log('EVENT_HIDE');
                // cc.g.networkMgr.socket.closeSocketTwo();
                cc.g.networkMgr.close()

                // cc.g.networkMgr.socket.closeSocket(false);

                // return;

                // if (this.curGameMgr == null) {
                //     return;
                // }

                // if (this.curGameMgr.isBackPlayMode()) {
                //     return;
                // }
                
                // this.curGameMgr.ChangeOnline(false);
            };
            let SHOW_FUN = ()=>{
                
                if (this.curGameMgr) {
                    let mgr = this.curGameMgr;

                    // 如果在游戏中无条件隐藏结算界面
                    if (mgr.gameScript && mgr.gameScript.settleView) {
                        let sview = mgr.gameScript.settleView;
                        if (sview.hide) {
                            cc.log('如果在游戏中无条件隐藏结算界面');
                            sview.hide();
                        } else {
                            cc.log('游戏结算界面无隐藏方法 尝试隐藏');
                            if (sview.root) {
                                cc.log('隐藏或许成功');
                                sview.root.active = false;
                            } else {
                                cc.log('隐藏失败');
                            }
                        }
                    }
                }

                //cc.log('EVENT_SHOW');
                // cc.g.global.showWaiting('连接中...');
                cc.g.networkMgr.reConnetcted()
                // cc.g.networkMgr.addOnceHandler('connected', () => {
                //     // cc.g.global.destoryWaiting();
                //     // let req = pbHelper.newReq(PB.PROTO.GET_ROOM_DATA);
                //     // cc.g.networkMgr.send(PB.PROTO.GET_ROOM_DATA, req, (resp) => {
                //     //     if (resp.err == null) {
                //     //         cc.log('获取房间数据成功.');
                //     //     } else {
                //     //         //获取房间消息错误
                //     //         cc.log('获取房间消息错误 退回大厅');
                //     //         this.curGameMgr.playerQuited(this.curGameMgr.getSelfPlayer());
                //     //         cc.g.hallMgr.backToHall();
                //     //     }
                //     // });
                // });

                // cc.g.networkMgr.socket.closeSocket(true);

                // return;

                // if (this.curGameMgr == null) {
                //     return;
                // }

                // if (cc.sys.isNative) {
                //     if (cc.g.voiceSdk != null) {
                //         cc.g.voiceSdk.resume();
                //     }
                // }
                
                // if (this.curGameMgr.isBackPlayMode()) {
                //     return;
                // }

                // this.curGameMgr.ChangeOnline(true);
                
                // this.curGameMgr.setPause(true);
                // let req = pbHelper.newReq(PB.PROTO.GET_ROOM_DATA);
                // cc.g.networkMgr.send(PB.PROTO.GET_ROOM_DATA, req, (resp) => {
                //     this.curGameMgr.setPause(false);
                //     if (this.curGameMgr == null) {
                //         return;
                //     }

                //     if (resp.err == null) {
                //         //if(cc.sys.os === cc.sys.OS_IOS) {
                //         //    cc.g.global.hint('获取房间数据成功');
                //         //} else {
                //               cc.log('获取房间数据成功.');
                //         //}
                        
                //         //this.curGameMgr.setPause(false);
                        
                //         this.enterGame(resp.room.gameType, resp.room, resp.one, resp.others);
                //     } else {
                //         //获取房间消息错误
                //         cc.log('获取房间消息错误 退回大厅');
                //         this.curGameMgr.playerQuited(this.curGameMgr.getSelfPlayer());
                //         cc.g.hallMgr.backToHall();
                //     }
                // });

                //cc.g.networkMgr.socket.closeSocket(true);

                //*/

                // 刷新俱乐部大厅
                // if (this.hall != null && this.hall.menuNode['club'] != null) {
                //     this.hall.menuNode['club'].getComponent('Club').upCurClub();
                // }
            };
            
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                cc.g.utils.regJsBackGround( ()=>{
                    cc.log('PB_EVENT_HIDE');
                    HIDE_FUN();
                });
                cc.g.utils.regJsbToFront(  ()=>{
                    cc.log('PB_EVENT_SHOW');
                    SHOW_FUN();
                });
            } else {
                cc.game.on(cc.game.EVENT_HIDE, ()=>{
                    cc.log('COCOS_EVENT_HIDE');
                    HIDE_FUN();
                });
                cc.game.on(cc.game.EVENT_SHOW,  ()=>{
                    cc.log('COCOS_EVENT_SHOW');
                    SHOW_FUN();
                });
            }

            this.upGpsUpingTime(1*60);//1

            //拉取活动列表
            this.getActivityList();
        }
        this.shareRewardNtfActive = false;
    },

    initEvent:function(){
        if (this.isinitEvent) {
            return;
        }

        this.isinitEvent = true;

        if ((cc.sys.os === cc.sys.OS_ANDROID) || (cc.sys.os === cc.sys.OS_IOS)) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event)=>{
                switch (event.keyCode) {
                    case cc.KEY.back:
                        cc.g.global.showMsgBox(MsgBoxType.YesOrNo, '提示', '确认退出游戏?', ()=>{
                            cc.log('退出');
                            cc.game.end();
                        });
                    break;
                }
            });
        }
    },

    getCurServerTime: function () {
        return Date.now()/1000 + cc.g.userMgr.timeDelta;
    },

    setNetworkMsgCallback: function () {
        //拉取房间列表回复
        cc.g.networkMgr.addHandler(PB.PROTO.GET_ROOM_LIST, (roomListResp) => {
            if(roomListResp.err != null) {
                return;
            }
            //如果没有刷新，不做任何处理。
            if (!roomListResp.isFresh) {
                return;
            }
            if(roomListResp.clubId > 0) {
                for(let i = 0; i < this.clubList.length; i++) {
                    if (this.clubList[i].clubId === roomListResp.clubId) {
                        this.clubList[i].roomList = roomListResp.list;
                        if(this.clubList[i].roomCnt !== this.clubList[i].roomList.length) {
                            this.clubList[i].roomCnt = this.clubList[i].roomList.length;
                            if (this.hall != null && this.hall.menuNode['club'] != null) {
                                this.hall.menuNode['club'].getComponent('Club').updateClubList();
                            }
                        }
                        if (this.hall != null && this.hall.menuNode['club'] != null) {
                            this.hall.menuNode['club'].getComponent('Club').updateClubRoomList(roomListResp.clubId);
                        }
                        break;
                    }
                }
            }
            else {
                this.roomList[roomListResp.gameType] = roomListResp.list;
                if (this.hall != null && this.hall.menuNode['room_list'] != null) {
                    this.hall.menuNode['room_list'].getComponent('RoomList').updateRoomList(roomListResp.gameType);
                }
            }
        });
        //其他服的房间列表通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_ROOM_LIST, (roomListResp) => {
            if(roomListResp.clubId > 0) {
                for(let i = 0; i < this.clubList.length; i++) {
                    if(this.clubList[i].clubId === roomListResp.clubId) {
                        if(this.clubList[i].roomList == null) {
                            this.clubList[i].roomList = roomListResp.list
                        }
                        else {
                            this.clubList[i].roomList = this.clubList[i].roomList.concat(roomListResp.list);
                        }
                        if(this.clubList[i].roomCnt !== this.clubList[i].roomList.length) {
                            this.clubList[i].roomCnt = this.clubList[i].roomList.length;
                            if (this.hall != null && this.hall.menuNode['club'] != null) {
                                this.hall.menuNode['club'].getComponent('Club').updateClubList();
                            }
                        }
                        if (this.hall != null && this.hall.menuNode['club'] != null) {
                            this.hall.menuNode['club'].getComponent('Club').appendClubRoomList(roomListResp.clubId);
                        }
                        break;
                    }
                }
            }
            else {
                if (this.roomList[roomListResp.gameType] == null) {
                    this.roomList[roomListResp.gameType] = roomListResp.list;
                }
                else {
                    this.roomList[roomListResp.gameType] = this.roomList[roomListResp.gameType].concat(roomListResp.list);
                }
                if (this.hall != null && this.hall.menuNode['room_list'] != null) {
                    this.hall.menuNode['room_list'].getComponent('RoomList').appendRoomList(roomListResp.gameType);
                }
            }
        });

        //活动列表通知
        cc.g.networkMgr.addHandler(PB.PROTO.GET_ACTION_LIST, (resp) => {
            this.activityList = resp.list;
            if(this.hall != null) {
                this.hall.updateActivity();
            }
        });

        //俱乐部推送
        cc.g.networkMgr.addHandler(PB.PROTO.SEND_CLUB_CHANGES, (resp) => {
            if (this.hall != null && this.hall.menuNode['club'] != null) {
                this.hall.menuNode['club'].getComponent('Club').onChangesNtf(resp);
            }
        });

        //定位数据更新
        cc.g.networkMgr.addHandler(PB.PROTO.SET_GPS_INFO, (resp) => {
            cc.log('定位数据更新');
            let o = {};
            o.uid = resp.uid;
            o.longitude = resp.gps.longitude;
            o.latitude = resp.gps.latitude;

            if (this.curGameMgr) {
                this.curGameMgr.onLocationUp(o);
            } else {
                cc.log('定位更新 没有可以通知的对象');
            }
        });

        //服务主推公告列表
        //9648.29 8185.44
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_NOTICE, (resp) => {
            {/*
                //请求跑马灯公告列表
                //@api:1037,@type:req
                message NoticeListReq {}

                //itemType 1 请求返回 2 主推返回
                //跑马灯公告主推和请求返回
                //@api:1038,@type:resp
                message NoticeListResp {
                    int32    itemType = 1;
                    repeated NoticeItem list = 2;
                }

                //noticeType  播放地方 1 游戏外跑马灯 2 游戏里面跑马灯 3 游戏里面和外面都播放跑马灯
                //playCount  播放次数  -1循环播放
                //colorType颜色类型 1红色，2 橙色,3黄色，4绿色,5青色,6蓝色,7紫色
                //gapTime间隔时间 单位秒
                //content 播放内容
                //url 链接
                message NoticeItem{
                    int32   noticeType = 1;
                    int32   playCount = 2;
                    int32   colorType = 3;  
                    int32   gapTime = 4;
                    string  content = 5;
                    string  url = 6;
                }
            */}

            cc.log('服务主推公告列表', resp);

            if (!this.noticeData || resp.itemType == 1) {
                this.noticeData = [];
            }

            let gmntc = [];
            resp.list.forEach(e => {
                let o = {};
                o.noticeType = e.noticeType;
                o.playCount = e.longitude;
                o.colorType = e.colorType;
                o.gapTime = e.gapTime;
                o.content = e.content;
                o.url = e.url;

                if (o.noticeType == 2 || o.noticeType == 3) {
                    gmntc.push(o);
                }

                if (o.noticeType == 2) {
                    return;
                }

                this.noticeData.push(o);
            });
            
            this.notices = this.noticeData;
            if (this.hall != null) {
                this.hall.updateHallNotice();
            }

            if (gmntc.length > 0) {
                cc.g.global.showTipBox(gmntc[0].content);
            }
        });

        //主推亲友圈游戏邀请
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TH_GAME_INVITE, (resp) => {
            {/*
                //(游戏内)主推亲友圈游戏邀请
                //@api:2317,@type:resp
                message  NotifyThGameInviteResp{
                    int32    teaHouseId=1;//茶馆Id
                    string   teaHouseName=2;//茶馆名
                    int32    floor = 3;//楼层号(0-50)
                    int32    deskNo = 4;//桌子号
                    int64    userId=5;//用户Id
                    string   name=6;//用户昵称
                    int32    gameType=7;//游戏种类
                    int32    origin=8;//区域
                    bool     openGps=9;//是否开启GPS
                }
            */}

            cc.log('主推亲友圈游戏邀请', resp);

            if (GameConfig.isTeaYaoqing) {
                cc.log('已屏蔽邀请');
                return;
            }

            if (cc.g.global.SubGameProDlg) {
                cc.log('下载子游戏中 跳过邀请');
                return;
            }

            if (cc.g.global._joinTeaHouseing) {
                cc.log('申请进入茶馆桌子中');
                return;
            }

            if (this.curGameType>0 || (cc.g.hallMgr.backToClubIfo && cc.g.hallMgr.backToClubIfo.inGameRoomId)) {
                cc.log('在游戏中 跳过邀请');
                return;
            }

            let tt = `来自【${resp.teaHouseName}】亲友圈\n`;
            tt += `【${resp.name}】的玩家邀请你加入`;
            tt += `${cc.g.utils.getGameName(resp.gameType, resp.origin)}游戏`;

            cc.g.global.showTipBox(tt, ()=>{
                if (!resp.openGps) {
                    cc.log('加入茶馆房间>>>>>')
                    cc.g.hallMgr.joinTeaHouse(resp.teaHouseId, resp.floor, resp.deskNo, false);
                } else {
                    cc.log('加入茶馆房间 >>>>> 检测定位', ifo);

                    let Canvas = cc.director.getScene().getChildByName('Canvas');
                    let wait = cc.instantiate(cc.g.pf.loadingPre);
                    Canvas.addChild(wait);
                    wait.getComponent('Loading').progress.string = '正在获取GPS信息';

                    cc.g.utils.startLocation((loc)=>{
                        wait.destroy();

                        if (!loc.success) {
                            cc.g.global.hint(loc.desc);
                            return;
                        }

                        cc.log('加入茶馆房间 >>>>>', ifo);
                        cc.g.hallMgr.joinTeaHouse(resp.teaHouseId, resp.floor, resp.deskNo, true);
                    });
                }
            }, true);
        });

        // @ts-ignore 进入游戏监听
        cc.g.networkMgr.addHandler(PB.PROTO.JOIN_CLUB_DESK, (resp) => this.on_JOIN_CLUB_DESK(resp));
    },

    /* =================================================================================================================== */
    
    // GPS定时更新器
    upGpsUpingTime: function(t) {
        return;

        if (!this._upgpsfun_) {
            this._upgpstimes_ = 0;
            
            this._upgpsfun_ = ()=>{
                cc.log(`GPS定时更新器  时间${this.upgpstime}  已更次数${this._upgpstimes_}`);
                cc.g.utils.startLocation((loc)=>{
                    cc.log('刷新GPS', loc);
                    cc.log(`GPS定时更新器  时间${this.upgpstime}  当前次数${++this._upgpstimes_}`);
                }, true);
            };
        }

        this.unschedule(this._upgpsfun_);

        this.upgpstime = t;

        if (t < 1) {
            cc.log('关闭 GPS定时更新器');
            return;
        }

        this.schedule(this._upgpsfun_, this.upgpstime);
    },


    // 更新定位数据
    upPlayerGps: function(longitude, latitude) {
        {/*
            //@api:1029,@type:req
            message SetGpsInfoReq {
                Gps gps = 1;
                int64 uid = 2;
            }

            //@api:1029,@type:resp
            message SetGpsInfoResp {
                Gps gps = 1;
            }

            //gps信息
            message Gps {
                string longitude = 1; //经    度
                string latitude = 2;    //纬    度
            }
        */}

        if (!longitude || longitude=='' || !longitude || longitude==''){
            cc.error('发送定位数据出错');
            return;
        }

        let gps = new PB.Gps();
        gps.longitude = longitude;
        gps.latitude = latitude;

        let req = pbHelper.newReq(PB.PROTO.SET_GPS_INFO);
        req.gps = gps;
        req.uid = cc.g.userMgr.userId;

        cc.g.networkMgr.send(PB.PROTO.SET_GPS_INFO, req, (resp)=>{
            if (resp.err == null || resp.err == PB.ERROR.OK) {
                cc.log('发送定位数据成功');
            } else {
                cc.error('发送定位数据失败');
            }
        });
    },

    /* =================================================================================================================== */


    //获取东东列表 
    getActivityList: function () {
        cc.log('getActivityList');
        let req = pbHelper.newReq(PB.PROTO.GET_ACTION_LIST);
        cc.g.networkMgr.send(PB.PROTO.GET_ACTION_LIST, req);
    },

    //获取全服通知消息
    getHallNotice: function () {
        let req = pbHelper.newReq(PB.PROTO.NOTICE_LIST);

        cc.g.networkMgr.send(PB.PROTO.NOTICE_LIST, req, (resp) => {
            if (resp.err == PB.ERROR.OK || resp.err == null) {
                cc.log('获取全服通知消息 成功');
            } else {
                cc.log('获取全服通知消息 失败');
            }
        });
        
        {/*
            if (this.getNoticeCallFunc == null) {
            this.getHallNoticeTimeOver = true;
            this.getNoticeCallFunc = function () {
                    if (this.hall != null) {
                        if (GameConfig.useGameConfigBak) {
                            let rollNoticeUrl = GameConfig.gameConfigBakUrl;
                            if (cc.sys.os === cc.sys.OS_ANDROID) {
                                rollNoticeUrl += 'android/';
                            }
                            else if (cc.sys.os === cc.sys.OS_IOS) {
                                rollNoticeUrl += 'ios/';
                            }

                            /*
                            cc.g.http.sendRequest('GET', rollNoticeUrl + 'rollNotices.json', {n: (new Date()).valueOf()}, (notices) => {
                                this.notices = notices;
                                if (this.hall != null) {
                                    this.hall.updateHallNotice();
                                }
                            });
                            
                        } else {
                            let data;
                            if (cc.sys.os === cc.sys.OS_ANDROID) {
                                data = {state: 1, type: 1};
                            }
                            else if (cc.sys.os === cc.sys.OS_IOS) {
                                data = {state: 1, type: 2};
                            }
                            else {
                                data = {};
                            }

                            /*
                            cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + 'service-admin/agentDetail/getNotice', data, (notices) => {
                                this.notices = notices;
                                if (this.hall != null) {
                                    this.hall.updateHallNotice();
                                }
                            });
                            
                        }
                    } else {
                        this.getHallNoticeTimeOver = true;
                    }
                }

                //每 5 * 60 秒执行一次回调,  执行 cc.macro.REPEAT_FOREVER 次,  5 * 60 秒后开始计时，，。
                this.schedule(this.getNoticeCallFunc, 5 * 60, cc.macro.REPEAT_FOREVER, 5 * 60);
            }

            if (this.getHallNoticeTimeOver) {
                this.getNoticeCallFunc();
                this.getHallNoticeTimeOver = false;
            } else {
                if (this.hall != null) {
                    this.hall.updateHallNotice();
                }
            }
        */}
    },

    //领取邀请奖励
    receiveInviteReward: function () {
        let req = pbHelper.newReq(PB.PROTO.GET_SHARE_REWARD);
        cc.g.networkMgr.send(PB.PROTO.GET_SHARE_REWARD, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                this.hall.menuNode['notice'].getComponent('Notice').receiveRewardSuccess();
            }
        });
    },
    //领取红包
    receiveRedPack: function() {
        let req = pbHelper.newReq(PB.PROTO.GET_SHARE_REDPKG);
        cc.g.networkMgr.send(PB.PROTO.GET_SHARE_REDPKG, req, (resp) => {

        });
    },

    //更新货币
    updateMoney: function (type) {
        if (this.hall != null) {
            this.hall.updateMoney(type);
            if (this.hall.menuNode['bank'] != null && this.hall.menuNode['bank'].active) {
                this.hall.menuNode['bank'].getComponent('Bank').setPlayerBankInfo();
            }
        }
    },

    //验证银行密码
    verifyBankPassword: function (pwd) {
        if (this.bankPassword > 0)
            return;
        let req = pbHelper.newReq(PB.PROTO.VERIFY_BANK_PASSWD);
        req.passwd = pwd;
        cc.g.networkMgr.send(PB.PROTO.VERIFY_BANK_PASSWD, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                this.bankPassword = pwd;
                if (this.hall.menuNode['enter_bank'] != null) {
                    this.hall.menuNode['enter_bank'].destroy();
                }
                this.hall.enterBank();
            }
        });
    },

    //修改银行密码
    modifyBankPassword: function (oldPwd, newPwd) {
        let req = pbHelper.newReq(PB.PROTO.SET_BANK_PASSWD);
        req.old = oldPwd;
        req.new = newPwd;
        cc.g.networkMgr.send(PB.PROTO.SET_BANK_PASSWD, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                this.bankPassword = newPwd;
                if (this.curGameType != -1) {
                    if (this.curGameMgr != null && this.inGameMenu != null) {
                        this.inGameMenu.bankNode.getComponent('Bank').modifyPasswordSuccess();
                    }
                }
                else if (this.hall.menuNode['bank'] != null) {
                    this.hall.menuNode['bank'].getComponent('Bank').modifyPasswordSuccess();
                }
            }
        });
    },

    //从银行取钱
    withDraw: function (cnt) {
        if (cnt <= 0) {
            return;
        }
        let req = pbHelper.newReq(PB.PROTO.WITHDRAW);
        req.passwd = this.bankPassword;
        req.cnt = cnt;
        cc.g.networkMgr.send(PB.PROTO.WITHDRAW, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
            }
        });
    },

    //从银行存钱
    deposit: function (cnt) {
        if (cnt <= 0) {
            return;
        }
        let req = pbHelper.newReq(PB.PROTO.DEPOSIT);
        req.passwd = this.bankPassword;
        req.cnt = cnt;
        cc.g.networkMgr.send(PB.PROTO.DEPOSIT, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
            }
        });
    },

    //转账
    transfer: function (uid, gold, card, passwd, cb) {
        let req = pbHelper.newReq(PB.PROTO.TRANSFER);
        req.uid = uid;
        req.gold = gold;
        req.card = card;
        req.passwd = passwd;
        cc.g.networkMgr.send(PB.PROTO.TRANSFER, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                if (cb != null) {
                    cb();
                }
            }
        });
    },

    //获取排行榜列表
    getRankList: function () {
        let req = pbHelper.newReq(PB.PROTO.RANKING);
        cc.g.networkMgr.send(PB.PROTO.RANKING, req, (resp) => {
            if(resp.err == null) {
                if (this.hall.menuNode['rank'] != null) {
                    this.hall.menuNode['rank'].getComponent('Rank').updateRankList(resp);
                }
            }
        });
    },

    //获取活动排行榜列表
    getActivityRankList: function (activityId) {
        let req = pbHelper.newReq(PB.PROTO.ACTION_RANKING);
        req.actionId = activityId;
        cc.g.networkMgr.send(PB.PROTO.ACTION_RANKING, req, (resp) => {
            if(resp.err == null) {
                if (this.hall.menuNode['rank'] != null) {
                    this.hall.menuNode['rank'].getComponent('Rank').updateRankList(resp);
                }
            }
        });
    },

    getTeamData: function () {
        let req = pbHelper.newReq(PB.PROTO.DISTRIBUTION);
        cc.g.networkMgr.send(PB.PROTO.DISTRIBUTION, req, (resp) => {
            this.teamData = resp;
            /*if(this.hall.menuNode['team'] != null) {
                this.hall.menuNode['team'].getComponent('Team').updateDetailsInfo();
            }*/
            if (this.hall.menuNode['spread_reward'] != null) {
                this.hall.menuNode['spread_reward'].getComponent('SpreadReward').updateReward();
            }
        });
    },

    //兑换房卡或者金币
    //@type 兑换类型
    //@num  兑换数量
    exchange: function (type, num) {
        let req = pbHelper.newReq(PB.PROTO.EXCHANGE);
        req.type = type;
        req.amount = num;
        cc.g.networkMgr.send(PB.PROTO.EXCHANGE, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                //兑换成功
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '兑换成功。');
            }
        });
    },

    //充值
    charge: function (platform, amount, callback) {
        let req = pbHelper.newReq(PB.PROTO.CHARGE);
        req.platform = platform;
        req.amount = amount;
        cc.g.networkMgr.send(PB.PROTO.CHARGE, req, (resp) => {
                if (resp.err == null) {//成功
                if (callback != null) {
                    callback(resp.toPayUrl);
                }
            }
        });
    },


    //领取团队推广奖励
    getTeamSpreadReward: function () {
        let req = pbHelper.newReq(PB.PROTO.GET_TEAM_REWARD);
        cc.g.networkMgr.send(PB.PROTO.GET_TEAM_REWARD, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                //兑换成功
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '领取奖励成功。');
            }
        });
    },

    //获取房间列表
    getRoomList: function (gameId) {
        let roomListReq = pbHelper.newReq(PB.PROTO.GET_ROOM_LIST);
        roomListReq.gameType = gameId;
        roomListReq.clubId =  0;
        cc.g.networkMgr.send(PB.PROTO.GET_ROOM_LIST, roomListReq);
    },

    //创建房间
    createRoom: function (info) {
        {
            /*
                // 创建房间
                //@api:1005,@type:req
                message CreateRoomReq {
                    bool  isView = 1;   // 所有人可见
                    GAME gameType = 2; 
                    int32 type = 3;     // 创建房间类型 1-金币场; 2-积分场
                    int32 base = 4;     // 底分
                    int32 gameNum = 5;  // 游戏局数
                    int32 rule = 6;     // 规则
                    int32 clubId = 7;   // 俱乐部
                    ORIGIN origin = 8;  // 地区
                    int32 tickectMode = 9;  // 消费模式
                    int32 startNum = 10;    // 人数
                    repeated int32 bigTwoRlue = 11; // 规则
                }
            */
        }

        let req = pbHelper.newReq(PB.PROTO.CREATE_ROOM);
        req.isView   = info.isView; // 所有人可见
        req.gameType = info.gameType;   //游戏ID
        req.type     = info.type;   // 创建房间类型 1-金币场; 2-积分场
        req.base     = info.base;   // 底分
        req.gameNum  = info.gameNum;   // 游戏局数
        req.rule     = info.rule;   // 规则
        req.clubId   = info.clubId;   // 俱乐部 
        req.origin   = info.origin;   // 地区
        req.tickectMode = info.tickectMode;  // 消费模式
        req.startNum    = info.startNum; // 人数
        req.bigTwoRlue  = info.bigTwoRlue; // 规则
        req.openGps  = info.openGps;

        req.base = FIXNUM(req.base);

        if (!cc.g.utils.judgeObjectEmpty(info.expendSpeciThing)) {
            req.expendSpeciThing = info.expendSpeciThing
        }

        let self = this;
        cc.g.networkMgr.send(PB.PROTO.CREATE_ROOM, req, (createRoomResp) => {
            if (createRoomResp.err == null) {
                cc.log('创建房间成功');
                self.enterGame(createRoomResp.room.gameType, createRoomResp.room, createRoomResp.one, null);
            } else {
                cc.log('创建房间失败');
            }
        });
    },

    //加入房间 isRejoin-是否杀进程级别重连
    joinRoom: function (gsId, roomId, isRejoin) {
        let jm = (openGps)=>{
            let req = pbHelper.newReq(PB.PROTO.JOIN_ROOM);
            req.gsId = gsId;
            req.roomId = roomId;
            req.openGps = openGps;
    
            let self = this;
            cc.g.networkMgr.send(PB.PROTO.JOIN_ROOM, req, (resp) => {
                cc.g.userMgr.roomId = 0;
                cc.g.userMgr.inviteJoinRoomId = 0;
                if (resp.err == null) {
                    cc.log('加入房间成功');
                    self.enterGame(resp.room.gameType, resp.room, resp.one, resp.others);
                } else {
                    cc.log('加入房间失败');
                    if (this.curGameType != -1 && this.curGameMgr != null) {
                        this.curGameMgr.playerQuited(this.curGameMgr.getSelfPlayer());
                        this.backToHall();
                    } else {
                        if(resp.err === PB.ERROR.CLUB_NOT_EXIST_PLAYER) {
                        } else {
                            //if(resp.err === PB.ERROR.ROOM_NOT_FOUND) {
                            if (this.hall != null
                                && this.hall.menuNode['club_room_list'] != null
                                && this.hall.menuNode['club_room_list'].active) {
                                cc.log('this.getClubRoomList');
                                this.getClubRoomList(this.hall.menuNode['club'].getComponent('Club').clubInfo.clubId);
                            } else if(this.hall != null
                                && this.hall.menuNode['room_list'] != null
                                && this.hall.menuNode['room_list'].active) {
                                cc.log('this.getRoomList');
                                this.getRoomList(this.hall.menuNode['room_list'].getComponent('RoomList').curGameId);
                            }
                            //}
                        }
                    }
                }
            });
        }

        let trg = (gameType, isSkipLoc)=>{
            if (isSkipLoc || isRejoin) {
                cc.log('加入房间 >>>>> 不需要定位');
                jm(false);
                return;
            }
    
            cc.log('加入房间 >>>>> 检测定位');

            let Canvas = cc.director.getScene().getChildByName('Canvas');
            let wait = cc.instantiate(cc.g.pf.loadingPre);
            Canvas.addChild(wait);
            wait.getComponent('Loading').progress.string = '正在获取GPS信息';
            
            cc.g.utils.startLocation((loc)=>{
                wait.destroy();
                
                if (!loc.success) {
                    cc.g.global.hint(loc.desc);
                    return;
                }
    
                cc.log('加入房间 >>>>>');
                jm(true);
            });
        };

        let req = pbHelper.newReq(PB.PROTO.GET_ROOM_IFON);
        req.roomId = roomId;
        cc.g.networkMgr.send(PB.PROTO.GET_ROOM_IFON, req, (resp) => {
            if (resp.err) {
                // let errorString = cc.g.utils.getError(resp.err);
                // cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', errorString);
                // 获取房间信息失败，直接返回
                if (this.curGameType != -1 && this.curGameMgr != null) {
                    this.curGameMgr.playerQuited(this.curGameMgr.getSelfPlayer());
                    this.backToHall();
                }
                return;
            }

            let isSkipLoc = true;
            for (let i = 0; i < resp.rules.length; ++i) {
                if (resp.rules[i] == 36) {
                    isSkipLoc = false;
                    break;
                }
            }

            this.scheduleOnce(()=>{
                trg(resp.gameType, isSkipLoc);
            }, 0.1);
        });
    },

    // 加载远程子游戏包
    enterGame: function (gameType, roomInfo, player, otherPlayers) {
        if (gameType !== GMID.EQS) {
            if ((roomInfo.GameNum==roomInfo.curGameNum) && (roomInfo.status==0)) {
                cc.g.networkMgr.send(PB.PROTO.QUIT_ROOM, pbHelper.newReq(PB.PROTO.QUIT_ROOM));
                return;
            } 
        }

        let isPlaying = (this.curGameType == gameType);
        cc.log('this.curGameType', gameType);
        cc.log("isPlaying >>>>>> ", isPlaying);

        if (gameType == GMID.XZMJ) {//四人麻将、三人麻将、二人麻将
            if (cc.g.xzmjMgr == null) {
                let XZMJMgr = require('xzmjMgr');
                cc.g.xzmjMgr = new XZMJMgr();
            }
            cc.g.xzmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.xzmjMgr;
        } else if (gameType == GMID.XZMJER) {//四人麻将、三人麻将、二人麻将
            if (cc.g.xzmjerMgr == null) {
                let XZMJERMgr = require('xzmjerMgr');
                cc.g.xzmjerMgr = new XZMJERMgr();
            }
            cc.g.xzmjerMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.xzmjerMgr;
        } else if (gameType === GMID.D2 ) {//大二
            if (cc.g.daerMgr == null) {
                let DAERMgr = require('daerMgr');
                cc.g.daerMgr = new DAERMgr();
            }
            cc.g.daerMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.daerMgr;
        } else if (gameType === GMID.EQS) {//大二
            if (cc.g.eqsMgr == null) {
                let EQSMgr = require('eqsMgr');
                cc.g.eqsMgr = new EQSMgr();
            }
            cc.g.eqsMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.eqsMgr;
        } else if (gameType === GMID.HZMJ ) {//红中麻将
            if (cc.g.majhMgr == null) {
                let MAJHMgr = require('majhMgr');
                cc.g.majhMgr = new MAJHMgr();
            }
            cc.g.majhMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.majhMgr;
        } else if (gameType === GMID.PDK ) {//跑得快
            if (cc.g.pdkMgr == null) {
                let PDKMgr = require('pdkMgr');
                cc.g.pdkMgr = new PDKMgr();
            }
            cc.g.pdkMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdkMgr;
        } else if (gameType===GMID.PDKNJ) {//跑得快
            if (cc.g.pdknjMgr == null) {
                let PDKNJMgr = require('pdknjMgr');
                cc.g.pdknjMgr = new PDKNJMgr();
            }
            cc.g.pdknjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdknjMgr;
        } else if (gameType===GMID.PDKLC) {//隆昌跑得快
            cc.log('隆昌跑得快');
            if (cc.g.pdklcMgr == null) {
                let PDKLCMgr = require('pdklcMgr');
                cc.g.pdklcMgr = new PDKLCMgr();
            }
            cc.g.pdklcMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdklcMgr;
        } else if (gameType===GMID.PDKLS) {//跑得快乐山
            if (cc.g.pdklsMgr == null) {
                let PDKLSMgr = require('pdklsMgr');
                cc.g.pdklsMgr = new PDKLSMgr();
            }
            cc.g.pdklsMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdklsMgr;
        } else if (gameType===GMID.PDKTY) {//跑得快通用
            if (cc.g.pdktyMgr == null) {
                let PDKTYMgr = require('pdktyMgr');
                cc.g.pdktyMgr = new PDKTYMgr();
            }
            cc.g.pdktyMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdktyMgr;
        } else if (gameType===GMID.PDKGX) {//跑得快珙县
            if (cc.g.pdkgxMgr == null) {
                let PDKGXMgr = require('pdkgxMgr');
                cc.g.pdkgxMgr = new PDKGXMgr();
            }
            cc.g.pdkgxMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdkgxMgr;
        } else if (gameType===GMID.PDKGAOX) {//跑得快高
            if (cc.g.pdkgaoxMgr == null) {
                let PDKGAOXMgr = require('pdkgaoxMgr');
                cc.g.pdkgaoxMgr = new PDKGAOXMgr();
            }
            cc.g.pdkgaoxMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.pdkgaoxMgr;
        }else if (gameType === GMID.YBMJ ) {//红中麻将
            if (cc.g.ybmjMgr == null) {
                let MAJHMgr = require('ybmjMgr');
                cc.g.ybmjMgr = new MAJHMgr();
            }
            cc.g.ybmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.ybmjMgr;
        } else if (gameType === GMID.NYMJ ) {//宁远麻将
            if (cc.g.nymjMgr == null) {
                let NYMAJHMgr = require('nymjMgr');
                cc.g.nymjMgr = new NYMAJHMgr();
            }
            cc.g.nymjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.nymjMgr;
        } else if (gameType === GMID.DDZ5 ) {//5人斗地主
            if (cc.g.ddz5Mgr == null) {
                let DDZ5Mgr = require('ddz5Mgr');
                cc.g.ddz5Mgr = new DDZ5Mgr();
            }
            cc.g.ddz5Mgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.ddz5Mgr;
        } else if (gameType === GMID.LZMJ ) {//泸州麻将
            if (cc.g.lzmjMgr == null) {
                let LZMAJHMgr = require('lzmjMgr');
                cc.g.lzmjMgr = new LZMAJHMgr();
            }
            cc.g.lzmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.lzmjMgr;
        } else if (gameType === GMID.NJMJ ) {//内江麻将
            if (cc.g.njmjMgr == null) {
                let NJMJMgr = require('njmjMgr');
                cc.g.njmjMgr = new NJMJMgr();
            }
            cc.g.njmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.njmjMgr;
        } else if (gameType === GMID.LCMJ ) {//内江麻将
            if (cc.g.lcmjMgr == null) {
                let LCMJMgr = require('lcmjMgr');
                cc.g.lcmjMgr = new LCMJMgr();
            }
            cc.g.lcmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.lcmjMgr;
        } else if (gameType === GMID.YJMJ ) {//妖鸡麻将
            if (cc.g.yjmjMgr == null) {
                let YJMJMgr = require('yjmjMgr');
                cc.g.yjmjMgr = new YJMJMgr();
            }
            cc.g.yjmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.yjmjMgr;
        } else if (gameType === GMID.GXMJ ) {//高县麻将
            if (cc.g.gxmjMgr == null) {
                let GXMJMgr = require('gxmjMgr');
                cc.g.gxmjMgr = new GXMJMgr();
            }
            cc.g.gxmjMgr.init(roomInfo, player, otherPlayers);
            this.curGameMgr = cc.g.gxmjMgr;
        } else {
            cc.error("缺少游戏 无法进入 ID", gameType);
            return;
        }

        this.curGameMgr.JoinVoiceRoom();

        if (!isPlaying) {
            cc.g.enterGmScTm = Date.now();

            let Canvas = cc.director.getScene().getChildByName('Canvas');
            let loading = cc.instantiate(cc.g.pf.loadingPre);
            //Canvas.addChild(loading);
            cc.director.getScene().addChild(loading);
            let vs = cc.view.getVisibleSize();
            loading.x = vs.width/2;
            loading.y = vs.height/2;

            cc.g.loadingMgr.startLoading(gameType);
            this.hall = null;
            this.curGameType = gameType;
            cc.g.global._joinTeaHouseing = false;
        }
    },

    exitGame: function () {
        if (this.curGameType == -1) {
            return;
        }
        if (this.curGameMgr != null && this.curGameMgr.roomInfo.status > 1 && this.curGameMgr.getSelfPlayer().status > 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '正在游戏中，不能退出！');
            return;
        }
        let req = pbHelper.newReq(PB.PROTO.QUIT_ROOM);
        cc.g.networkMgr.send(PB.PROTO.QUIT_ROOM, req);

        // add by panbin
        if (!cc.g.utils.judgeObjectEmpty(cc.g.hallMgr.backToClubIfo)) {
            cc.g.hallMgr.backToClubIfo.inGame = false;
            cc.g.hallMgr.backToClubIfo.inGameRoomId = null;
        }
    },
    backToHall: function () {
        if (!cc.g.isdoExitTea) {
            if (this.curGameMgr && this.curGameMgr.roomInfo.clubId && this.curGameMgr.roomInfo.clubId>0) {
                if (cc.g.huanzData) {
                    this.huanZhuo();
                } else {
                    cc.g.hallMgr.backToTeaHall();
                }
                return;
            }
        } else {
            cc.g.isdoExitTea = false;
        }

        if (this.curGameType == -1) {
            return;
        }

        this.curGameMgr.QuiteVoiceRoom();

        cc.g.audioMgr.resumeBGM();

        this.inGameMenu.reset();
        this.inGameMenu.node.removeFromParent(false);

        cc.g.loadingMgr.releaseRes(this.curGameType);
        this.curGameType = -1;
        this.curGameMgr.askJiesanUid = null;
        this.curGameMgr.gameScript = null;
        this.curGameMgr = null;
    },
    backFromTeaToHall: function() {
        // this.inGameMenu.reset();
        // this.inGameMenu.node.removeFromParent(false);
        cc.g.loadingMgr.goToHall();
    },
    backToTeaHall: function () {
        if (!this.waithuanz && this.curGameType == -1) {
            return;
        }
        this.waithuanz = false;

        this.curGameMgr.QuiteVoiceRoom();

        cc.g.audioMgr.resumeBGM();

        this.inGameMenu.reset();
        this.inGameMenu.node.removeFromParent(false);

        cc.g.loadingMgr.releaseResTwo(this.curGameType);
        this.curGameType = -1;
        this.curGameMgr.askJiesanUid = null;
        this.curGameMgr.gameScript = null;
        this.curGameMgr = null;

        let teaHouseId = cc.g.utils.getLocalStorage('teaHouseId');
        if (cc.g.utils.judgeStringEmpty(teaHouseId)) {
            cc.log('茶馆ID为空，进入游戏大厅~');
            this.backFromTeaToHall()
        } else {
            cc.director.loadScene('tea', (err, scene) => {
                cc.log('进入茶馆场景.')
            });
        }
    },
    shareRewardNtf: function () {
        if (cc.g.userMgr.checkShareReward() && !this.shareRewardNtfActive) {
            this.shareRewardNtfActive = true;
            cc.g.global.showMsgBox(MsgBoxType.Normal, '奖励', '您有新的奖励可以领取', () => {
                this.shareRewardNtfActive = false;
                this.hall.showMenu('notice').getComponent('Notice').init(3);
            });
        }
    },
    huanZhuo: function () {
        let d = cc.g.huanzData;

        this.curGameType = -1;

        let isSkipLoc = true;
        for (let i = 0; i < d.rule.length; ++i) {
            if (d.rule[i] == 36) {
                isSkipLoc = false;
                break;
            }
        }

        let hzf = ()=>{
            this.curGameMgr.gameScript = d.page;

            cc.log('onBtnHuanzhuo');
            cc.g.hallMgr.joinTeaHouse(d.teaHouseId, d.floor, d.deskNo, true, (resp)=>{
                cc.log('onBtnHuanzhuo', resp);
            });

            cc.g.huanzData = null;
            this.waithuanz = true;
        };

        if (isSkipLoc) {
            cc.dlog('换桌茶馆房间 不需要定位 >>>>>');
            hzf();
        } else {
            let Canvas = cc.director.getScene().getChildByName('Canvas');
            // @ts-ignore
            let wait = cc.instantiate(cc.g.pf.loadingPre);
            Canvas.addChild(wait);
            wait.getComponent('Loading').progress.string = '正在获取GPS信息';
            
            // @ts-ignore
            cc.g.utils.startLocation((loc)=>{
                wait.destroy();
                
                if (!loc.success) {
                    // @ts-ignore
                    cc.g.global.hint(loc.desc);
                    return;
                }
    
                cc.dlog('换桌茶馆房间 需要定位 >>>>>');

                hzf();
            });
        }
    },


    on_JOIN_CLUB_DESK: function (resp) {
        cc.log('普通大厅 加入俱乐部包间的桌子 成功');

        if (!this.waithuanz && resp.msg=='create') {
            return;
        }

        this.waithuanz = false;

        let ri = (resp.msg=='create') ? resp.create : resp.join;

        cc.g.hallMgr.enterGame(ri.room.gameType, ri.room, ri.one, ri.others||[]);
    },
    
    /* =================================================================================================================== */
    //更新创建配置数据
    upCreateInfo: function (gmID) {
        if (!this.crtRoomInfo) {
            this.crtRoomInfo={};
        }

        if (this.crtRoomInfo[gmID]) {
            return;
        }

        this.parseID = gmID;

        if (this.crtRoomInfo[gmID]) {
            return;
        }

        cc.log('upCreateInfo');

        // 当前游戏对应的创建基本信息
        let crtifo = null;
        let roomList = cc.g.utils.getJson('CreateRoomInfo');
        for (var i in roomList) {
            if (roomList[i].gameId == gmID) {
                crtifo = roomList[i];
                break;
            }
        }
        if (!crtifo) {
            cc.error("找不到创建房间相关的信息 游戏ID ", gmID);
            return;
        }

        cc.log("ifo ", crtifo);

        // 清空
        let info={}

        // 游戏ID
        info.gameId = crtifo.gameId

        // 地区
        info.comArea = this.parseArea(crtifo.area);

        // 付费模式
        info.comCostMode = this.parseCommon(crtifo.costMode,  (Key)=>{
            return cc.g.gmRuleInfo[gmID][Key];
        });
        // 人数
        info.playerNum = this.parsePlayerNum(crtifo.playerNum);
        // 局数
        info.turnNum = this.parseCommon(crtifo.turnNum, function (Key) {
            return Key+"局";
        });

        // 房卡 大厅
        info.roomCardNum = this.parseCardNum(crtifo.roomCardNum);   
        info.cardConsume = this.parseCardNum2(crtifo.cardConsume);  //均摊房费
        // 房卡 茶馆普通
        info.roomCardNum1 = this.parseCardNum(crtifo.roomCardNum1);
        info.cardConsume1 = this.parseCardNum2(crtifo.cardConsume1);
        // 房卡 茶馆金币
        info.roomCardNum2 = this.parseCardNum(crtifo.roomCardNum2);
        info.cardConsume2 = this.parseCardNum2(crtifo.cardConsume2);
        
        // 单 复 默认选项 先解读这个值 再读取相关选项
        info.DefRadio = this.parseDefaultOption(crtifo.defaultOption);
        
        // 单选项
        info.OptionRadio = this.parseOptionRadio(crtifo.optionRadio, info.DefRadio);
        // 复选项
        info.OptionCheck = this.parseOptionCheckBox(crtifo.optionCheckBox, info.DefRadio);

        this.crtRoomInfo[gmID] = info;

        cc.log("upCreateInfo OK");
    },

    // 分析地区
    parseArea: function(data) {
        //"area":["1","2","3","4","5","2"]

        let area = {}
                    
        // 默认地区
        let L=data.length;
        area.def = data[L-1];

        // 配置的地区
        area.v={}
        for (let i = 0; i < L-1; i++) {
            let id = data[i];
            area.v[id] = cc.g.areaInfo[id].name;
        }

        // 验证默认地区
        if (!area.v[area.def]){
            if (L>1) {
                area.def = data[0]; //cc.g.areaInfo[data[0]].name;
            } else {
                cc.error("创建房间 地区没有配置");
            }
        }

        return area;
    },

    // 分析人数
    parsePlayerNum: function(data) {
        {
            //[3#4-13,4-19-4-4.1001,7-19-4-4-5-5-6-6-7-7.1002,7-19-7-7.1003#0]
            //"playerNum":["0#2,3,4#3"],
            /*
                {
                    ak1:{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                    ...
                    akn:{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                    "0":{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                }
            */
        }

        let rules = cc.g.gmRuleInfo[this.parseID];

        let common = {}

        // 解析所有地区
        // data里是["地区K#值K1, ..., 值Kn#默认K"]的数组
        // [地区K#项1K1-...项1Kn, ..., 项nK1-...项nKn#默认项序号]
        for (let i = 0, L = data.length; i < L; ++i) {
            const areaData = data[i].split('#');

            // 地区K是第一个字符串
            let d = common[areaData[0]] = {};

            d.v={};
            d.desc={};

            // 值K在第二个字符串
            let a = areaData[1].split(',');
            let defk = null;
            for (let j = 0; j < a.length; ++j) {
                if (this.parseID == GMID.PDK) {
                    let b = a[j].split('.');
            
                    const k = b[0];
                    d.v[k] = rules[b[1]];
                    d.desc[k] = (b.length>2) ? rules[b[2]] : null;

                    (j===0) && (defk=k);
                } else {
                    const k = a[j];
                    d.v[k]=k+"人";

                    (j===0) && (defk=k);
                }
            }

            // 默认K在第三个字符串
            d.def = areaData[2];
            if (!d.v[d.def]) {
                d.def = defk ? defk : a[0];
            }
        }

        return common;
    },

    // 分析通用数据
    parseCommon: function(data, getV) {
        {
            //"costMode":["0#1,2#2"]
            //"playerNum":["0#2,3,4#3"],
            //"turnNum":["0#4,8,12,16,20,24,28,32,36,40#4"],
            //"roomCardNum":["0#4,8,12,16,20,24,28,32,36,40#4"]
            /*
                {
                    ak1:{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                    ...
                    akn:{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                    "0":{
                        v:[k1-v1,...,kn-vn]
                        def:k
                    },
                }
            */
        }

        let common = {}

        // 解析所有地区
        // data里是["地区K#值K1,...,值Kn#默认K"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            const areaData = data[i].split('#');

            // 地区K是第一个字符串
            let d = common[areaData[0]] = {};

            d.v={};
            
            // 值K在第二个字符串
            let a = areaData[1].split(',');
            for (let i = 0; i < a.length; ++i) {
                const k = a[i];
                d.v[k]=getV(k);
            }

            // 默认K在第三个字符串
            d.def = areaData[2];
            if (!d.v[d.def]) {
                d.def = a[0];
            }
        }

        return common;
    },

    // 分析房卡
    parseCardNum: function(data) {
        let CardNum = {}

        // 解析所有地区
        // "roomCardNum":[
        // "2#3:8;4:8%2:11;3:11;4:11%2:15;3:15;4:15%2:20;3:20;4:20",
        // "3#3:8;4:8%2:11;3:11;4:11%2:15;3:15;4:15%2:20;3:20;4:20",
        // "4#3:8;4:8%2:11;3:11;4:11%2:15;3:15;4:15%2:20;3:20;4:20"]
        // data里是["地区K#值K1,...,值Kn"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            const areaData = data[i].split('#');

            // 地区K是第一个字符串
            let d = CardNum[areaData[0]] = [];
            
            if (true) {
                let js = areaData[1].split('%');
                for (let j = 0; j < js.length; ++j) {
                    let akv = js[j].split(';');
                    let o = {};
                    akv.forEach(e => {
                        let kv = e.split(':');
                        o[kv[0]] = parseInt(kv[1]);
                    });
                    d.push(o);
                }
            } else {
                // 值K在第二个字符串
                let a = areaData[1].split(',');
                for (let i = 0; i < a.length; ++i) {
                    d.push(parseInt(a[i]));
                } 
            }
        }

        return CardNum;
    },

    // 分析房卡2
    parseCardNum2: function(data) {
        let CardNum2 = {};

        // 解析所有地区
        // "1#2:2;3:2;4:2;5:2;6:2;7:2%2:3;3:3;4:3;5:3;6:3;7:3%2:4;3:4;4:4;5:4;6:4;7:4%2:5;3:5;4:5;5:5;6:5;7:5",
        // %分割每种局数对应的情况
        // ["地区K#人数1:房卡1;...;人数n:房卡n"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            const areaData = data[i].split('#');

            // 地区K是第一个字符串
            let d = CardNum2[areaData[0]] = [];
            
            // 值K在第二个字符串
            let js = areaData[1].split('%');
            for (let j = 0; j < js.length; ++j) {
                let akv = js[j].split(';');
                let o = {};
                akv.forEach(e => {
                    let kv = e.split(':');
                    o[kv[0]] = parseInt(kv[1]);
                });
                d.push(o);
            }
        }

        return CardNum2;
    },

    // 分析单选项
    parseOptionRadio: function(data, defaultOpt) {
        {
            /*"optionRadio":
            [
            "1#2.3,8#3.10,11#4.12,13",
            "2#1.1,2#2.3,9#3.10,11#4.13,14,15",
            "3#3.10,11#4.12,13#5.16,17,18",
            "4#1.1,2#2.4,6#3.10,11#4.12,13",
            "5#2.3,5,8#3.10,11#4.12,13",
            "0#3.10,11"
            ],
            */
            /*
                {
                    ak1:{
                        g1:{
                            tag,
                            v:[k1-v1,...,kn-vn]
                        },
                        ...
                        gn
                    },
                    ...
                    akn:{
                        g1:{
                            tag,
                            v:[k1-v1,...,kn-vn]
                        },
                        ...
                        gn
                    },
                    "0":{
                        g1:{
                            tag,
                            v:[k1-v1,...,kn-vn]
                        },
                        ...
                        gn
                    },
                }
            */
        }

        let rules = cc.g.gmRuleInfo[this.parseID];

        let optRadio = {}

        // 解析所有地区 "1#2.3,8#3.10,11#4.12,13",
        // data里是["地区K#组1标签.组1值K1,...,组1值Kn#...#组n标签.组n值K1,...,组n值Kn"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            // areaData
            const ad = data[i].split('#');

            // 地区K是第一个字符串
            let d = optRadio[ad[0]] = [];

            if (ad[1]=='') continue;

            let def = defaultOpt[ad[0]] ? defaultOpt[ad[0]] : defaultOpt['0'];

            // 后续字符串是单选组 [标签.值K1,...,值Kn]
            for (let j = 1; j < ad.length; ++j) {
                const e = ad[j].split('.');

                // 标签是是第一个字符串
                let g={};
                g.tag = e[0];
                g.v = {};
                
                // 规则K值是第二个字符串
                let a = e[1].split(',');
                for (let m = 0; m < a.length; ++m) {
                    const k = a[m];
                    g.v[k] = rules[k];

                    if (def[k]) {
                        g.def = k;
                    }
                }

                g.def = g.def ? g.def : a[0];

                d.push(g);
            }
        }

        return optRadio;
    },

    // 分析复选项
    parseOptionCheckBox: function(data, defaultOpt) {
        {
            /*"optionCheckBox":
            [
            "1#19,20,21,22,23,24,25,26,27,28,30,31",
            "2#19,20,21,22,23,24,25,26,27,28,31",
            "3#19,24,25,26,27,28,29",
            "4#20,24,27,28",
            "5#19,28,31",
            "0#28"
            ],
            */
            /*
                {
                    ak1:{
                        v:[k1-v1,...,kn-vn]
                    },
                    ...
                    akn:{
                        v:[k1-v1,...,kn-vn]
                    },
                    "0":{
                        v:[k1-v1,...,kn-vn]
                    },
                }
            */
        }


        let rules = cc.g.gmRuleInfo[this.parseID];

        let check = {}

        // 解析所有地区 "1#19,20,21,22,23,24,25,26,27,28,30,31"
        // data里是["地区K#值K1,...,值Kn"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            // areaData
            const ad = data[i].split('#');

            // 地区K是第一个字符串
            let d = check[ad[0]] = [];

            if (ad[1]=='') continue;

            let def = defaultOpt[ad[0]] ? defaultOpt[ad[0]] : defaultOpt['0'];
            
            // 值K在第二个字符串
            let a = ad[1].split(',');
            for (let i = 0; i < a.length; ++i) {
                const k = a[i];

                let c = {};
                c.k = k;
                c.v = rules[k];
                c.check = def[k] ? true : false;
                
                d.push(c);
            }
        }

        return check;
    },

    // 分析单, 复选项的默认选项
    parseDefaultOption: function(data) {
        {
            /*"defaultOption":
            [
                "1#3,12",
                "2#1,3,11,13,31",
                "3#11,12,17,19,24,25,26,27,31",
                "4#1,4,11,12,28",
                "5#3,11,12,19,30,31",
                "0#12"
            ],
            */
            /*
                {
                    ak1:{
                        v:[k1-v1,...,kn-vn]
                    },
                    ...
                    akn:{
                        v:[k1-v1,...,kn-vn]
                    },
                    "0":{
                        v:[k1-v1,...,kn-vn]
                    },
                }
            */
        }


        let rules = cc.g.gmRuleInfo[this.parseID];

        let def = {}

        // 解析所有地区 "1#3,12",
        // data里是["地区K#值K1,...,值Kn"]的数组
        for (let i = 0, L = data.length; i < L; ++i) {
            // areaData
            const ad = data[i].split('#');

            // 地区K是第一个字符串
            let d = def[ad[0]] = {};
            
            // 值K在第二个字符串
            let a = ad[1].split(',');
            for (let i = 0; i < a.length; ++i) {
                const k = a[i];
                d[k] = rules[k];
            }
        }

        return def;
    },
    /* =================================================================================================================== */


    /* 回放================================================================================================================ */
    tryPlaybBack: function (pbd) {
        {/*
        cc.g.hallMgr.tryPlaybBack({
            replayId:itm.replayId,
            gameType:itm.gameType, 
            origin:this.origin,
            idx:this.idx,
            clubId:this.clubInfo ? this.clubInfo.clubId : null,
            bjID:this.clubInfo ? this.bjuid : null,
        });
        */}

        this.replayData = pbd;

        cc.log('tryPlaybBack 回放');

        let id = pbd.replayId;
        cc.log('replay Id', id);
        // sendRequest: function (method, url, data, handler, errorHandler)
        let self = this;
        //*
        cc.g.http.sendRequest(
            'POST', 
            GameConfig.playBackIDUrl,
            {uid: id},
            function (reps) {
                cc.log('tryPlaybBack reps', reps);
                
                if (reps.Path) {
                    cc.g.http.sendRequest(
                        'GET', 
                        GameConfig.playBackDataUrl + reps.Path, //http://120.77.173.104:8090/ + 2020-02-17-20-44-46/103453a375291
                        {},
                        function (reps) {
                            self.goPlaybBack(reps);
                        }, 
                        function () {
                            //cc.error('回放数据 err');
                        }
                    );
                } else {
                    cc.g.global.showTipBox('没有此记录');
                }
            }, 
            function () {
                cc.error('回放ID err');
            }
        );
        //*/
    },
    // 前往回放
    goPlaybBack: function (pbdata) {
        cc.log('goPlaybBack 回放数据', pbdata);
        
        let gameId = this.replayData.gameType;
        let origin = this.replayData.origin;
        let idx = this.replayData.idx || 0;

        let pbd = {};
        pbd.uid = pbdata.uid;
        pbd.player_ops = pbdata.player_ops;
        pbd.result = pbdata.result;

        let room = {};
        let one = {};
        let others = [];

        room.now = Date.now();
        room.start_time = pbdata.start_time;
        room.roomId = pbdata.room_id;
        room.NewRlue = pbdata.rule;
        room.curGameNum = pbdata.cur_game_num;
        room.GameNum = pbdata.total_game_num;
        room.type = (room.GameNum > 1) ? 2 : 1;
        room.origin = pbdata.origin || 1;
        room.pbTime = pbdata.pbTime || Date.now();
        room.gameType = gameId;
        room.base = pbdata.Base || pbdata.base || (pbdata.result && pbdata.result.base) || -1;
        room.clubId = this.replayData.clubId || 0;

        let GameId = gameId;

        if (GameId == GMID.D2) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;
            
            let desk=[0,1,3,2]; //所有玩家顺序:庄家,下家,上家,数底
            let desk3=[0,1,2];
            let desk2=[0,1];
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;

                if (room.total == 3) {
                    p.deskId = desk3[i];  
                } else if (room.total == 2) {
                    p.deskId = desk2[i];
                } else {
                    p.deskId = desk[i];
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.EQS) {
            room.total = pbdata.players.length;
            //room.dealer = pbdata.banker;
            room.dealer = pbdata.players[0].uid;

            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;

                if (p.deskId == pbdata.banker) {
                    room.dealer = p.uid;
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.YJMJ || GameId == GMID.HZMJ || GameId == GMID.LZMJ ||
                   GameId == GMID.NJMJ || GameId == GMID.LCMJ || GameId == GMID.GXMJ) {
            {/*
                结构体:
                type GameReCord struct {
                    Uid          string                        `json:"uid"`            //每局的唯一Id
                    Rule         []int32                       `json:"rule"`           //房间规则
                    CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                    TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                    RoomId       int32                         `json:"room_id"`        //房间Id
                    Banker       int8                          `json:"banker"`        //庄家deskId
                    Players      []*PlayerBase                 `json:"players"`        //
                    BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                    PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                    Result       *pb.PdkPlayerResultListNtf `json:"result"`         //结算的结果
                }
            */}

            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.PDK || GameId == GMID.PDKNJ || GameId == GMID.PDKLS || GameId == GMID.PDKTY || 
                    GameId == GMID.PDKGX || GameId == GMID.PDKGAOX || GameId == GMID.PDKLC) {
            {/*
                结构体:
                type GameReCord struct {
                    Uid          string                        `json:"uid"`            //每局的唯一Id
                    Rule         []int32                       `json:"rule"`           //房间规则
                    CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                    TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                    RoomId       int32                         `json:"room_id"`        //房间Id
                    Banker       int8                          `json:"banker"`        //庄家deskId
                    Players      []*PlayerBase                 `json:"players"`        //所有玩家顺序:庄家,下家,上家,数底
                    BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                    PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                    Result       *pb.PdkPlayerResultListNtf `json:"result"`         //结算的结果
                }

                // @api:1030,@type:resp
                type PdkPlayerResultListNtf struct {
                    WinUid int64            `protobuf:"varint,1,opt,name=winUid" json:"winUid,omitempty"`
                    Base   int32            `protobuf:"varint,2,opt,name=base" json:"base,omitempty"`
                    Round  int32            `protobuf:"varint,3,opt,name=round" json:"round,omitempty"`
                    Time   int64            `protobuf:"varint,4,opt,name=time" json:"time,omitempty"`
                    List   []*PdkResultInfo `protobuf:"bytes,5,rep,name=list" json:"list,omitempty"`
                }
                // 跑的快的结算结果
                type PdkResultInfo struct {
                    Uid        int64   `protobuf:"varint,1,opt,name=uid" json:"uid,omitempty"`
                    Winlose    int32   `protobuf:"varint,2,opt,name=winlose" json:"winlose,omitempty"`
                    Bombnum    int32   `protobuf:"varint,3,opt,name=bombnum" json:"bombnum,omitempty"`
                    Totalscore int32   `protobuf:"varint,4,opt,name=totalscore" json:"totalscore,omitempty"`
                    Bombscore  int32   `protobuf:"varint,5,opt,name=bombscore" json:"bombscore,omitempty"`
                    Deskcards  []int32 `protobuf:"varint,6,rep,packed,name=deskcards" json:"deskcards,omitempty"`
                    Handcards  []int32 `protobuf:"varint,7,rep,packed,name=handcards" json:"handcards,omitempty"`
                }
            */}

            room.total = pbdata.total;
            room.dealer = pbdata.banker;

            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = p.desk_id;

                if (p.deskId == pbdata.banker) {
                    room.dealer = p.uid;
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.DDZ5) {
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

            room.total = pbdata.total;
            room.dealer = pbdata.banker;

            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = p.desk_id;

                if (p.deskId == pbdata.banker) {
                    room.dealer = p.uid;
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.XZMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.XZMJER) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;

                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.YBMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.NYMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;

                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else {
            cc.log('goPlaybBack GameId 空');
            return;
        }

        if (!one.uid) {
            cc.log('回放数据里没有玩家自己，可能是代理人查看其他人的战绩');
            one = others[0];
        }


        let o = {}
        o.gameId = gameId;
        o.origin = origin;
        o.index = idx+1;

        if (this.replayData.clubId > 0) {
            o.clubId = this.replayData.clubId;
            o.bjID = this.replayData.bjuid;
        }
        
        //cc.g.hallMgr.backToPlayHistory = o;

        cc.g.hallMgr.enterGame(GameId, room, one, others);
    },

    /* 回放================================================================================================================ */



    /* =================================================================================================================== */
    /* =================================================================================================================== */

    //俱乐部
    getClubList: function() {
        {/*
            message ClubInfo {
                int32 clubId = 1;
                int32 memberCnt = 2;
                int32 roomCnt = 3;
                int32 applyCnt = 4;
                int32 gameTypes = 5;
                int64 ownerId = 6;
                string name = 7;
                string icon = 8;
                string desc = 9;
                string ownerName = 10;
                int32 origin = 11;//地区
                int32 selfPerm = 12;//自己在俱乐部的职位
            }
        */}
        let req = pbHelper.newReq(PB.PROTO.GET_CLUB_LIST);
        cc.g.networkMgr.send(PB.PROTO.GET_CLUB_LIST, req, (resp)=>{
            this.clubList = resp.list;
            this.clubList.forEach(e => {
                e.gameTypes = 0;
                e.isadm   = (e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_OWNER || e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_ADMINISTRATOR);
                e.isowner = (e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_OWNER)
            });

            this.clubList.sort((a,b)=>{
                //selfPerm
                return cc.g.userMgr.userId.eq(a.ownerId) ? -1 : 1;
            });

            //刷新俱乐部列表
            if (this.hall != null && this.hall.menuNode['club'] != null) {
                this.hall.menuNode['club'].getComponent('Club').updateClubList();
            }
        });
    },
    //创建俱乐部
    createClub: function (name, desc, origin, cb) {
        let req = pbHelper.newReq(PB.PROTO.CREATE_TEA_HOUSE);
        req.name = name;
        // req.desc = desc;
        // req.origin = origin;
        {/*
            let configGameLen = GameConfig.gamesSeq.length;
            for (let i = 0; i < configGameLen; i++) {
                let gameId = GameConfig.gamesSeq[i];
                if(gameId === 3) {//包剪锤除外
                    continue;
                }
                req.gameTypes |= (1 << gameId);
            }
        */}
        
        cc.g.networkMgr.send(PB.PROTO.CREATE_TEA_HOUSE, req, (resp)=>{
            if(resp.err == null) {
                if (cb) {
                    cb();
                    return;
                }
                // this.clubList.push(resp.info);
                // this.clubList.forEach(e => {
                //     e.isadm   = (e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_OWNER || e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_ADMINISTRATOR);
                //     // e.isadm   = e.selfPerm === PB.CLUB_TITLE.
                //     e.isowner = (e.selfPerm === PB.CLUB_TITLE.CLUB_TITLE_OWNER)
                // });
                //
                // this.clubList.sort((a,b)=>{
                //     return cc.g.userMgr.userId.eq(a.ownerId) ? -1 : 1;
                // });
                //
                //
                // //关闭创建页面，刷新俱乐部列表
                // if (this.hall != null && this.hall.menuNode['create_club'] != null) {
                //     this.hall.menuNode['create_club'].active = false;
                // }
                // if (this.hall != null && this.hall.menuNode['club'] != null) {
                //     this.hall.menuNode['club'].getComponent('Club').updateClubList();
                // }
            }
        });
    },
    //搜索俱乐部
    searchMyQuan: function (callback) {
        let req = pbHelper.newReq(PB.PROTO.MINE_TEA_HOUSE_LIST);
        cc.g.networkMgr.send(PB.PROTO.MINE_TEA_HOUSE_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    //搜索亲友圈申请列表
    searchMyQuanSp: function (callback) {
        let req = pbHelper.newReq(PB.PROTO.MINE_APPLY_LIST_TEA_HOUSE);
        cc.g.networkMgr.send(PB.PROTO.MINE_APPLY_LIST_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    //搜索亲友圈申请列表
    searchMyCySp: function (teaHouseId, searchId, callback) {
        let req = pbHelper.newReq(PB.PROTO.APPLY_LIST_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(searchId)) {
            req.searchId = searchId;
        }
        cc.g.networkMgr.send(PB.PROTO.APPLY_LIST_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    //搜索亲友圈申请列表
    searchMyCRSp: function (teaHouseId, searchId, callback) {
        let req = pbHelper.newReq(PB.PROTO.RECENT_OUTIN_LIST_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(searchId)) {
            req.searchId = searchId;
        }
        cc.g.networkMgr.send(PB.PROTO.RECENT_OUTIN_LIST_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    joinTeaHouse: function (teaHouseId, floor, deskNo, openGps, callback) {
        let req = pbHelper.newReq(PB.PROTO.JOIN_TEA_HOUSE_DESK);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        req.deskNo = deskNo;
        req.openGps = openGps;

        cc.g._joinTeaHouseing = true;
        cc.g.networkMgr.send(PB.PROTO.JOIN_TEA_HOUSE_DESK, req, (resp)=>{
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //resp.info 显示查找的俱乐部信息
                if(callback != null) {
                    callback(resp);
                }
            } else {
                cc.log('加入茶馆桌子 失败');

                if (this.waithuanz) {
                    setTimeout(() => {
                        cc.g.hallMgr.backToTeaHall();
                    }, 500);
                } else {
                    cc.g.hallMgr.backToTeaHall();
                }
            }
        });
    },
    doExtTeaHouse: function (teaHouseId) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_QUIT_SCENE);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_QUIT_SCENE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchTeaHouse: function (teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_HALL);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_HALL, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchUserById: function (userId, callback) {
        let req = pbHelper.newReq(PB.PROTO.FIND_USER_TEA_HOUSE);
        req.userId = userId;
        cc.g.networkMgr.send(PB.PROTO.FIND_USER_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    addYaoQingPerson: function (teaHouseId, userId, callback) {
        let req = pbHelper.newReq(PB.PROTO.INVITE_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.userId = userId;
        cc.g.networkMgr.send(PB.PROTO.INVITE_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    doPersonSettingLogOut: function (teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.APPLY_EXIT_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.APPLY_EXIT_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    addQuanTongYi: function (applyId, teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.AGREE_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.applyId = applyId;
        cc.g.networkMgr.send(PB.PROTO.AGREE_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    changeWanFaName: function (teaHouseId, floor, name, callback) {
        let req = pbHelper.newReq(PB.PROTO.MODIFY_TEA_HOUSE_ROOM_NAME);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        req.name = name;
        cc.g.networkMgr.send(PB.PROTO.MODIFY_TEA_HOUSE_ROOM_NAME, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    changeUserRemarkName: function (teaHouseId, memberId, remark, callback) {
        let req = pbHelper.newReq(PB.PROTO.MODIFY_TEA_HOUSE_MEMBER_REMARK);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        req.remark = remark;
        cc.g.networkMgr.send(PB.PROTO.MODIFY_TEA_HOUSE_MEMBER_REMARK, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    updateUserRoles: function (teaHouseId, destUserId, destPosition, callback) {
        let req = pbHelper.newReq(PB.PROTO.UPGRADE_TEA_HOUSE_POSITION);
        req.teaHouseId = teaHouseId;
        req.destUserId = destUserId;
        req.destPosition = destPosition;
        cc.g.networkMgr.send(PB.PROTO.UPGRADE_TEA_HOUSE_POSITION, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    cancleUserRoles: function (teaHouseId, destUserId, callback) {
        let req = pbHelper.newReq(PB.PROTO.CANCEL_TEA_HOUSE_POSITION);
        req.teaHouseId = teaHouseId;
        req.destUserId = destUserId;
        cc.g.networkMgr.send(PB.PROTO.CANCEL_TEA_HOUSE_POSITION, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    deleteFromQuan: function (teaHouseId, memberId, callback) {
        let req = pbHelper.newReq(PB.PROTO.KICK_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        cc.g.networkMgr.send(PB.PROTO.KICK_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    jinZhiPlay: function (teaHouseId, memberId, forbidGame, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_FORBID_GAME);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        req.forbidGame = forbidGame;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_FORBID_GAME, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    getFanBiVaue: function (teaHouseId, teamId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_CONTRIBUE_RATE);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_CONTRIBUE_RATE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    changeFanBiVaule: function (teaHouseId, teamId, contributeRate, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SET_CONTRIBUE_RATE);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        req.contributeRate = contributeRate;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SET_CONTRIBUE_RATE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    allJinZhiPlay: function (teaHouseId, teamId, forbidGame, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_FORBID_GAME_ALL);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        req.forbidGame = forbidGame;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_FORBID_GAME_ALL, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    zhiTwoPlay: function (teaHouseId, memberId, onlyTwoPeople, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_TWO_PEOPLE);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        req.onlyTwoPeople = onlyTwoPeople;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_TWO_PEOPLE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    allTwoPlay: function (teaHouseId, teamId, onlyTwoPeople, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_TWO_PEOPLE_ALL);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        req.onlyTwoPeople = onlyTwoPeople;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_TWO_PEOPLE_ALL, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    allTieChu: function (teaHouseId, teamId, callback) {
        let req = pbHelper.newReq(PB.PROTO.KICK_TEAM_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        cc.g.networkMgr.send(PB.PROTO.KICK_TEAM_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    getBaoXianList: function (teaHouseId, memberId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_FLOOR_LIMIT);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_FLOOR_LIMIT, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

//     //请出茶馆桌子
// //@api:2321,@type:req
//     message KickTeaHouseDeskReq{
//     int32 teaHouseId = 1;//茶馆Id
//     int32 floor = 2;//楼层号(1-50)
//     int32 deskNo = 3;//桌子序号(1-20)
//     int64 userId   = 4;  //被请出者的UId
// }
    doOutBaoJian: function (teaHouseId, floor, deskNo, userId, callback) {
        let req = pbHelper.newReq(PB.PROTO.KICK_TEAHOUSE_DESK);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        req.deskNo = deskNo;
        req.userId = userId;
        cc.g.networkMgr.send(PB.PROTO.KICK_TEAHOUSE_DESK, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

//     //解散桌子
// //@api:2246,@type:req
//     message DisbandTeaHouseDeskReq{
//     int32 teaHouseId = 1;//茶馆Id
//     int32 floor = 2;//楼层号(1-50)
//     int32 deskNo = 3;//桌子序号(1-20)
//
// }

    doJieSanDesk: function (teaHouseId, floor, deskNo, callback) {
        let req = pbHelper.newReq(PB.PROTO.DISBAND_TEA_HOUSE_DESK);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        req.deskNo = deskNo;
        cc.g.networkMgr.send(PB.PROTO.DISBAND_TEA_HOUSE_DESK, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    modifyBaoXianList: function (teaHouseId, memberId, add, list, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SET_FLOOR_LIMIT);
        req.teaHouseId = teaHouseId;
        req.memberId = memberId;
        req.add = add;
        req.list = list;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SET_FLOOR_LIMIT, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    addQuanJuJue: function (applyId, teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.REFUSE_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.applyId = applyId;
        cc.g.networkMgr.send(PB.PROTO.REFUSE_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    addCyCrJuJue: function (applyId, teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.REFUSE_EXIT_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.applyId = applyId;
        cc.g.networkMgr.send(PB.PROTO.REFUSE_EXIT_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    addCyCrOk: function (applyId, teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.AGREE_EXIT_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.applyId = applyId;
        cc.g.networkMgr.send(PB.PROTO.AGREE_EXIT_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    searchChengYuanList: function (teaHouseId, searchId, pageNum, pageSize, sortKey, callback) {
        let req = pbHelper.newReq(PB.PROTO.MEMBER_LIST_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(searchId)) {
            req.searchId = searchId;
        }
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        req.sortKey = sortKey
        cc.g.networkMgr.send(PB.PROTO.MEMBER_LIST_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    // 获取我的战绩
    // int64  timeType =1;  //时间类型
    // int32   pageSize =2;
    // int64   selectUserId =3;//搜索id
    // int32  teaHouseId =4; //茶馆id
    // int32  roomId =5;//房间Id
    // int32  gameType =6;//游戏类型
    // int32   pageNum =7;
    // int32   recordType =8;//1普通场 2金币场
    searchTeaZhanJiList: function (originType, timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_MY_RECORD_LIST);
        req.originType = originType;
        req.timeType = timeType;
        req.teaHouseId = teaHouseId;
        // req.roomId = roomId;
        req.gameType = gameType;
        req.recordType = recordType;
        if (!cc.g.utils.judgeStringEmpty(selectUserId)) {
            req.selectUserId = selectUserId;
        }
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_MY_RECORD_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    // int64  timeType =1;  //时间类型
    // int32   pageSize =2;
    // int64   selectUserId =3;//搜索id
    // int32  teaHouseId =4; //茶馆id
    // int32  roomId =5;//房间Id
    // int32  gameType =6;//游戏类型
    // int32   pageNum =7;
    // int32   recordType =8;//1普通场 2金币场
    searchTeaMemberZhanJiList: function (originType, timeType, teaHouseId, gameType, selectUserId, recordType, teamGroup, sortType, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_MEMBER_RECORD_LIST);
        req.originType = originType;
        req.timeType = timeType;
        req.teaHouseId = teaHouseId;
        // req.roomId = roomId;
        req.gameType = gameType;
        req.recordType = recordType;
        if (!cc.g.utils.judgeStringEmpty(selectUserId)) {
            req.selectUserId = selectUserId;
        }
        req.teamGroup = teamGroup;
        req.sortType = sortType;
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_MEMBER_RECORD_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    // int64  timeType =1;  //时间类型
    // int32   pageSize =2;
    // int64   selectUserId =3;//搜索id
    // int32  teaHouseId =4; //茶馆id
    // int32  roomId =5;//房间Id
    // int32  gameType =6;//游戏类型
    // int32   pageNum =7;
    // int32   recordType =8;//1普通场 2金币场
    searchTeaCircleZhanJiList: function (originType, timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_CIRCLE_RECORD_LIST);
        req.originType = originType;
        req.timeType = timeType;
        req.teaHouseId = teaHouseId;
        // req.roomId = roomId;
        req.gameType = gameType;
        req.recordType = recordType;
        if (!cc.g.utils.judgeStringEmpty(selectUserId)) {
            req.selectUserId = selectUserId;
        }
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_CIRCLE_RECORD_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    // int64  timeType =1;  //时间类型
    // int32   pageSize =2;
    // int64   selectUserId =3;//搜索id
    // int32  teaHouseId =4; //茶馆id
    // int32  roomId =5;//房间Id
    // int32  gameType =6;//游戏类型
    // int32   pageNum =7;
    // int32   recordType =8;//1普通场 2金币场
    // int32  teamId=4;//战队Id
    // bool   searchUp=5;//是否向上查
    searchTeaZhanDuiZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, teamId, searchUp, sortType, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_TEAM_RECORD_LIST);
        req.timeType = timeType;
        req.teaHouseId = teaHouseId;
        // req.roomId = roomId;
        req.gameType = gameType;
        req.recordType = recordType;
        if (!cc.g.utils.judgeStringEmpty(selectUserId)) {
            req.selectUserId = selectUserId;
        }
        req.teamId = teamId;
        req.searchUp = searchUp;
        req.sortType = sortType;
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_TEAM_RECORD_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },


    // int32            teaHouseId       =1;   //茶馆ID
    // int32            dateNo       =2;   //期号
    // int32            teamId       =3;   //战队Id
    // string    startTime =4; //开始时间
    // string    endTime =5; //结束时间
    // int32   pageSize =6;
    // int32   pageNum =7;
    searchTeaZhanShuJuList: function (timeType, teaHouseId, teamId, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_GOLD_MATCH_DATE_LIST);
        req.timeType = timeType;
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(teamId)) {
            req.teamId = teamId;
        }
        req.pageNum = pageNum;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_GOLD_MATCH_DATE_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    // int32   teaHouseId=1;//茶馆Id
    // int32   teamId=2;//战队Id
    // string  searchId=3;//搜索Id或者昵称
    // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
    searchZhanDuiAddPerList: function (teaHouseId, teamId, searchId, searchType, callback) {
        let req = pbHelper.newReq(PB.PROTO.FILTER_TEA_HOUSE_MEMBER);
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(searchId)) {
            req.searchId = searchId;
        }
        req.teamId = teamId;
        req.searchType = searchType;
        cc.g.networkMgr.send(PB.PROTO.FILTER_TEA_HOUSE_MEMBER, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchZhanDuiAddPerOne: function (teaHouseId, parentTeamId, destUserId, destPosition, callback) {
        let req = pbHelper.newReq(PB.PROTO.CREATE_TEA_HOUSE_TEAM);
        req.teaHouseId = teaHouseId;
        req.parentTeamId = parentTeamId;
        req.destUserId = destUserId;
        req.destPosition = destPosition;
        cc.g.networkMgr.send(PB.PROTO.CREATE_TEA_HOUSE_TEAM, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchQinChuZhiShu: function (teaHouseId, teamId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_TEAM_DIRECT_CLEAN);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_TEAM_DIRECT_CLEAN, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchZhanDuiFpCy: function (teaHouseId, teamId, destUserId, callback) {
        let req = pbHelper.newReq(PB.PROTO.ASSIGN_TEA_HOUSE_TEAM);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        req.destUserId = destUserId;
        cc.g.networkMgr.send(PB.PROTO.ASSIGN_TEA_HOUSE_TEAM, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchZhanDuiZrCy: function (teaHouseId, teamId, destUserId1, destUserId2, callback) {
        let req = pbHelper.newReq(PB.PROTO.TRANSFER_TEA_HOUSE_TEAM);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        req.destUserId1 = destUserId1;
        req.destUserId2 = destUserId2;
        cc.g.networkMgr.send(PB.PROTO.TRANSFER_TEA_HOUSE_TEAM, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    // 搜索数据清零列表
    searchShuJuQLList: function (teaHouseId, teamId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_CLEAN_ZERO_LIST);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_CLEAN_ZERO_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    // 搜索数据清零列表
    doZeroShuJuQL: function (teaHouseId, teamId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SET_CLEAN_ZERO);
        req.teaHouseId = teaHouseId;
        req.teamId = teamId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SET_CLEAN_ZERO, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchZhanDuiList: function (teaHouseId, teamId, searchId, searchUp, sortKey, pageNum, pageSize, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_TEAM_LIST);
        req.teaHouseId = teaHouseId;
        if (!cc.g.utils.judgeStringEmpty(searchId)) {
            req.searchId = searchId;
        }
        req.teamId = teamId;
        req.searchUp = searchUp;
        req.pageNum = pageNum;
        req.sortKey = sortKey;
        req.pageSize = pageSize;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_TEAM_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    searchCyDrList: function (teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.IMPORTING_TEA_HOUSE_LIST);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.IMPORTING_TEA_HOUSE_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    addCyDrList: function (teaHouseId, destTeaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.IMPORTING_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        req.destTeaHouseId = destTeaHouseId;
        cc.g.networkMgr.send(PB.PROTO.IMPORTING_TEA_HOUSE, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    searchTeaHouse: function (teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_HALL);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_HALL, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    searchTeaHouseDesk: function (teaHouseId, searchIndex, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_DESK_LIST);
        req.teaHouseId = teaHouseId;
        req.searchIndex = searchIndex;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_DESK_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    // TEA_HOUSE_ROOM_DESKS
    searchTeaHouseSecDesk: function (teaHouseId, floor, searchIndex, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ROOM_DESKS);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        req.searchIndex = searchIndex;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ROOM_DESKS, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    searchTeaHouseDeskByFloor: function (teaHouseId, floor, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },

    searchDeskByTeaId: function (teaHouseId, floor, callback) {
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST);
        req.teaHouseId = teaHouseId;
        req.floor = floor;
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    //搜索俱乐部
    searchClub: function (clubId, callback) {
        let req = pbHelper.newReq(PB.PROTO.MINE_TEA_HOUSE_LIST);
        req.clubId = clubId;
        cc.g.networkMgr.send(PB.PROTO.MINE_TEA_HOUSE_LIST, req, (resp)=>{
            //resp.info 显示查找的俱乐部信息
            if(callback != null) {
                callback(resp);
            }
        });
    },
    //加入亲友圈
    joinClub: function (teaHouseId, callback) {
        let req = pbHelper.newReq(PB.PROTO.APPLY_TEA_HOUSE);
        req.teaHouseId = teaHouseId;
        cc.g.networkMgr.send(PB.PROTO.APPLY_TEA_HOUSE, req, (resp)=>{
           if(callback != null) {
               callback(resp);
           }
        });
    },
    //修改俱乐部信息
    modifyClubInfo: function(clubId, name, desc, callback) {
        let req = pbHelper.newReq(PB.PROTO.MODIFY_CLUB_INFO);
        req.clubId = clubId;
        req.name = name;
        req.desc = desc;
        cc.g.networkMgr.send(PB.PROTO.MODIFY_CLUB_INFO, req, (resp)=>{
            if(resp.err == PB.ERROR.OK) {
                for(let i = 0; i < this.clubList.length; i++) {
                    if(this.clubList[i].clubId === clubId) {
                        this.clubList[i].name = name;
                        this.clubList[i].desc = desc;
                        break;
                    }
                }
                if(callback != null) {
                    callback();
                }
            }
        });
    },
    //退出俱乐部
    quitClub: function (clubId, callback) {
        let req = pbHelper.newReq(PB.PROTO.QUIT_CLUB);
        req.clubId = clubId;
        cc.g.networkMgr.send(PB.PROTO.QUIT_CLUB, req, (resp)=>{
            if(resp.err == PB.ERROR.OK) {
                for(let i = 0; i < this.clubList.length; i++) {
                    if(this.clubList[i].clubId === clubId) {
                        this.clubList.splice(i, 1);
                        break;
                    }
                }
                //刷新俱乐部列表
                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').clubInfo = null;
                    this.hall.menuNode['club'].getComponent('Club').updateClubList();
                }
                if(callback != null) {
                    callback();
                }
            }
        });
    },
    //解散俱乐部
    disbandClub: function (clubId, callback) {
        let req = pbHelper.newReq(PB.PROTO.DISBAND_CLUB);
        req.clubId = clubId;
        cc.g.networkMgr.send(PB.PROTO.DISBAND_CLUB, req, (resp)=>{
            if (resp.err == PB.ERROR.OK) {
                for(let i = 0; i < this.clubList.length; i++) {
                    if(this.clubList[i].clubId === clubId) {
                        this.clubList.splice(i, 1);
                        break;
                    }
                }
                //刷新俱乐部列表
                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').clubInfo = null;
                    this.hall.menuNode['club'].getComponent('Club').updateClubList();
                }
                if(callback != null) {
                    callback();
                }
            }
        });
    },

    // 创建俱乐部包间
    old_createClubRoom: function (info) {
        {/*
            //创建俱乐部包间
            //@api:2050,@type:req
            message CreateClubRoomReq{
                int32 clubId = 1;//俱乐部Id
                repeated int32 rule = 2; //规则
                int32 playNum = 3;//游戏人数
                int32 gameNum = 4;//游戏局数
                GAME gameType = 5;//游戏种类
                RoomConfig roomConfig = 6;  //比赛场 特殊规则
                int32 maxWinSco = 7;    // 大赢家门槛
                int32 base = 8;   //底分
                ExpendSpeciThing expendSpeciThing = 9;
                int32 origin  = 10;//地区
            }

            //@api:2050,@type:resp
            message CreateClubRoomResp{
                int32 uid = 1;//包间的唯一id
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.CREAT_CLUB_ROOM);
        req.clubId = info.clubId;
        req.rule = info.bigTwoRlue;
        req.playNum = info.startNum;
        req.gameNum = info.gameNum;
        req.gameType = info.gameType;
        req.maxWinSco = info.maxWinSco;
        req.base     = info.base;   // 底分
        req.origin   = info.origin;   // 地区

        if (!cc.g.utils.judgeObjectEmpty(info.expendSpeciThing)) {
            req.expendSpeciThing = info.expendSpeciThing
        }

        cc.g.networkMgr.send(PB.PROTO.CREAT_CLUB_ROOM, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                cc.log('创建俱乐部包间 成功');
                let id = info.clubId;

                let rm = {};
                //rm.clubId = info.clubId;
                rm.rule = info.bigTwoRlue;
                rm.playNum = info.startNum;
                rm.gameNum = info.gameNum;
                rm.gameType = info.gameType;
                rm.deskInfo = [];
                rm.uid = resp.uid;
                rm.dec = '';

                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    //this.hall.menuNode['club'].getComponent('Club').onCreateRoom(rm);
                }
            } else {
                cc.log('创建俱乐部包间 失败');
            }
        });
    },
    createClubRoom: function (info) {
        {/*
            //特殊规则
            message ExpendSpeciThing{
                oneof expendPerGame{  //每个游戏的特殊规则
                    NingYuanSpeciRule ningYuanSpeciRule = 1;
                    Hold hold = 2;
                }
            }
            //宁远的特殊规则
            message NingYuanSpeciRule{
                int32 addBeiStrip = 1;  //少于多少加倍
                int32 addFenStrip = 2;  //少于加分的门槛
                int32 addFen = 3;//具体加多少分
            }
            //保留字段
            message Hold{

            }

            //金币场包间规则
            message GoldMatchRoomRule {
                int32  joinGold=1;//加入牌桌金币
                int32  disbandGold=2;//解散牌桌金币
                int32  exitType=4;//剩余金币不足类型 1自动解散 2继续游戏
                int32  lotteryType=5;//抽奖类型 1不抽奖 2所有人抽奖 3大赢家抽奖
                int32  consumeGold=6;//所有人抽奖消耗金币
                repeated WinnerRoomRule winnerRuleList = 7; //大赢家抽奖规则
                int64  ticket=7;//门票
            }

            //创建茶馆包间(添加玩法)
            //@api:2235,@type:req
            message CreateTeaHouseRoomReq{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor =2;//楼层
                string name =3;//名称(现在可以传空串)
                int32 base = 4; //底分
                int32 playNum = 5;//游戏人数
                int32 gameNum = 6;//游戏局数
                int32 gameType = 7;//游戏种类
                int32 winnerScore = 8;//大赢家分数
                repeated int32 rule = 9; //规则
                repeated int32 specialRule = 10; //特殊规则(k-v结构)
                ExpendSpeciThing expendSpeciThing = 11;//特定字段
                GoldMatchRoomRule goldMatchRule = 12;//金币场包间规则
                int32 origin  = 13;//地区
            }

            //金币场大赢家抽奖规则
            message WinnerRoomRule {
                int32  minScore=1;//分数1
                int32  maxScore=2;//分数2
                int32  consumeGold=3;//消耗金币
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.CREATE_TEA_HOUSE_ROOM);
        req.teaHouseId = info.clubId;
        req.floor = info.floor;
        req.name = info.bjname;
        req.base     = info.base;
        req.rule = info.bigTwoRlue;
        req.playNum = info.startNum;
        req.gameNum = info.gameNum;
        req.gameType = info.gameType;
        req.winnerScore = info.maxWinSco;
        req.origin   = info.origin;


        if (!cc.g.utils.judgeObjectEmpty(info.expendSpeciThing)) {
            req.expendSpeciThing = info.expendSpeciThing
        }

        if (!cc.g.utils.judgeObjectEmpty(info.goldMatchRule)) {
            req.goldMatchRule = info.goldMatchRule
        }

        cc.g.networkMgr.send(PB.PROTO.CREATE_TEA_HOUSE_ROOM, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                cc.log('创建俱乐部包间 成功');
                let id = info.clubId;

                let rm = {};
                //rm.clubId = info.clubId;
                rm.rule = info.bigTwoRlue;
                rm.playNum = info.startNum;
                rm.gameNum = info.gameNum;
                rm.gameType = info.gameType;
                rm.deskInfo = [];
                rm.uid = resp.uid;
                rm.dec = '';

                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    //this.hall.menuNode['club'].getComponent('Club').onCreateRoom(rm);
                }
            } else {
                cc.log('创建俱乐部包间 失败');
            }
        });
    },

    // 加入俱乐部包间的桌子
    joinClubDesk: function (info) {
        {/*
            //加入俱乐部包间的桌子
            //@api:2052,@type:req
            message JoinClubDeskReq{
                int32 clubId = 1;//俱乐部Id
                int32 roomIndex = 2;//包间的索引
                int32 deskIndex = 3;//包间中桌子的索引
                GAME gameType = 4;//游戏类型
            }

            //@api:2052,@type:resp
            message JoinClubDeskResp{
                oneof msg{
                    CreateRoomResp create = 1;
                    JoinRoomResp join = 2;
                }
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.JOIN_CLUB_DESK);
        req.clubId = info.clubId;
        req.roomUid = info.roomUid;
        req.deskIndex = info.deskIndex;
        //req.gameType = info.gameType;
        req.openGps  = info.openGps;

        let self = this;
        cc.g.networkMgr.send(PB.PROTO.JOIN_CLUB_DESK, req, (resp) => {
            if (resp.err == null || resp.err == PB.ERROR.OK) {
                cc.log('加入俱乐部包间的桌子 成功');

                let ri = (resp.msg=='create') ? resp.create : resp.join;

                self.enterGame(ri.room.gameType, ri.room, ri.one, ri.others);
            } else {
                cc.log('加入俱乐部包间的桌子 失败');

                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').upDeskDate();
                }
            }
        });
    },
    //获取俱乐部房间列表
    getClubRoomList: function (clubId) {
        let roomListReq = pbHelper.newReq(PB.PROTO.GET_ROOM_LIST);
        roomListReq.gameType = 0;
        roomListReq.clubId =  clubId;
        cc.g.networkMgr.send(PB.PROTO.GET_ROOM_LIST, roomListReq);
    },
    //获取包间
    getClubBaoJianList: function (clubId, cb) {
        {/*
            //获取俱乐部包间信息
            //@api:2051,@type:req
            message ClubRoomListReq{
                int32 clubId = 1;//俱乐部Id
            }
            //@api:2051,@type:resp
            message ClubRoomListResp{
                int32 clubId = 1;//俱乐部id
                int32 mode   = 2;//模式 0表示单包间模式，1表示多包间模式（混合模式）
                repeated ClubRoomInfo list = 3;//所有的包间信息
                int32 card  = 4;//茶馆卡的数量
            }

            //包间信息
            message ClubRoomInfo{
                repeated int32 rule = 1; //规则
                int32 playNum = 2;//游戏人数
                int32 gameNum = 3;//游戏局数
                GAME gameType = 4;//游戏种类
                repeated ClubRoomDeskInfo deskInfo = 5;//桌子信息
                string dec = 6;//包间描述
                int32 uid = 7;//包间的唯一ID
                int32 maxWinSco = 8;//大赢家分数
                int32 base = 9;   //底分
                ExpendSpeciThing expendSpeciThing = 10;
                int32 origin  = 11;//地区
            }

            //包间中桌子的信息
            message ClubRoomDeskInfo{
                bool isStart = 1;//是否已经开始
                int32 index  = 2;//桌号
                int32 curNum = 3;//当前局数
                int32 totalNum = 4;//总局数
                repeated DeskPlayer players = 5; //桌上玩家的信息
            }

            //桌上玩家的信息
            message DeskPlayer{
                int32 DeskId = 1;//玩家的桌号
                string Name  = 2;//玩家的昵称
                string Icon  = 3;//玩家的头像
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.CLUB_ROOM_LIST);
        req.clubId = clubId;
        cc.g.networkMgr.send(PB.PROTO.CLUB_ROOM_LIST, req, (resp)=>{
            if (resp.err == null || resp.err == PB.ERROR.OK) {
                if (cb) {
                    cb(resp);
                }
            }else{
                this.hall.menuNode['club'].getComponent('Club').onBtnBackMain();
                cc.g.hallMgr.getClubList();
            }
        });
    },
    //
    old_delClubBaojian: function (bjifo, cb) {
        {/*
            //删除俱乐部包间
            //@api:2056,@type:req
            message RemoveClubRoomReq{
                int32 clubId = 1;//俱乐部Id
                int32 uid = 2;//包间的唯一ID
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.REMOVE_CLUB_ROOM);
        req.clubId = bjifo.club.clubId;
        req.uid = bjifo.d.uid;

        cc.g.networkMgr.send(PB.PROTO.REMOVE_CLUB_ROOM, req, (resp)=>{
            let id = resp.clubId;
            let list = resp.list;

            if (this.hall != null && this.hall.menuNode['club'] != null) {
                //this.hall.menuNode['club'].getComponent('Club').upRoomData();
            }

            if (cb) {
                cb(id, list);
            }
        });
    },
    //删除包间
    delClubBaojian: function (bjifo, cb) {
        {/*
            //移除茶馆包间(移除玩法)
            //@api:2236,@type:req
            message RemoveTeaHouseRoomReq{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor =2;//楼层
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.REMOVE_TEA_HOUSE_ROOM);
        req.teaHouseId = bjifo.clubId;
        req.floor = bjifo.floor;

        cc.g.networkMgr.send(PB.PROTO.REMOVE_TEA_HOUSE_ROOM, req, (resp)=>{
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.g.global.hint('删除包间 成功');
                if (cb) {
                    cb(bjifo.clubId, bjifo.floor);
                }
            } else {
                cc.g.global.hint('删除包间 失败');
            }
        });
    },
    //修改包间的规则
    old_editClubBaojian: function (bjifo, info, cb) {
        {/*
            //修改包间的规则
            //@api:2053,@type:req
            message ModifyClubRoomRuleReq{
                int32 clubId = 1;//俱乐部Id
                int32 roomUid = 2;//包间的唯一ID
                repeated int32 rule = 3; //规则
                int32 playNum = 4;//游戏人数
                GAME gameType = 5;//游戏种类
                int32 gameNum = 6;//游戏局数
                int32 maxWinSco = 7;    // 大赢家门槛
                int32 base = 8;   //底分
                ExpendSpeciThing expendSpeciThing = 9;
                int32 origin  = 10;//地区
            }

            //@api:2053,@type:resp
            message ModifyClubRoomRuleResp{
                repeated ClubRoomInfo list = 1;//所有的包间信息
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.MODIFY_CLUB_ROOM_RULE);
        req.clubId = bjifo.club.clubId;
        req.roomUid = bjifo.d.uid;
        req.rule = info.bigTwoRlue;
        req.base = info.base;
        req.playNum = info.startNum;
        req.gameType = bjifo.d.gameType;
        req.gameNum = info.gameNum;
        req.maxWinSco = info.maxWinSco;
        req.base     = info.base;   // 底分
        req.origin   = bjifo.d.origin;   // 地区
        // 特殊规则
        if (!cc.g.utils.judgeObjectEmpty(info.expendSpeciThing)) {
            req.expendSpeciThing = info.expendSpeciThing;
        }

        cc.g.networkMgr.send(PB.PROTO.MODIFY_CLUB_ROOM_RULE, req, (resp)=>{
            if (resp.err == PB.ERROR.OK) {
                cc.log('修改包间的规则 成功');
                let id = bjifo.club.clubId;

                let rm = {};
                rm.clubId = bjifo.club.clubId;
                rm.rule = info.bigTwoRlue;
                rm.base = info.base;
                rm.playNum = info.startNum;
                rm.gameNum = info.gameNum;
                rm.gameType = bjifo.d.gameType;
                rm.dec = '';

                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    //this.hall.menuNode['club'].getComponent('Club').onEditRoom(rm);
                }

                if (cb) {
                    cb();
                }
            } else {
                cc.log('修改包间的规则 失败');
            }
        });
    },
    //修改包间的规则
    editClubBaojian: function (bjifo, info, cb) {
        {/*
            //修改茶馆包间规则(修改玩法规则)
            //@api:2239,@type:req
            message ModifyTeaHouseRoomRuleReq{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor =2;//楼层
                int32 base = 3; //底分
                string name =4;//名称(现在可以传空串)
                int32 playNum = 5;//游戏人数
                int32 gameNum = 6;//游戏局数
                int32 gameType = 7;//游戏种类
                int32 winnerScore = 8;//大赢家分数
                repeated int32 rule = 9; //规则
                repeated int32 specialRule = 10; //特殊规则(k-v结构)
                ExpendSpeciThing expendSpeciThing = 11;//特定字段
                GoldMatchRoomRule goldMatchRule = 12;//金币场包间规则
                int32 origin  = 13;//地区
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.MODIFY_TEA_HOUSE_ROOM_RULE);
        req.teaHouseId = bjifo.clubId;
        req.floor = bjifo.floor;
        req.base = info.base;
        req.name = info.bjname;
        req.playNum = info.startNum;
        req.gameType = bjifo.gameType;
        req.gameNum = info.gameNum;
        req.origin   = bjifo.origin;   // 地区
        req.winnerScore = info.maxWinSco;
        req.rule = info.bigTwoRlue;
        
        // 特殊规则
        if (!cc.g.utils.judgeObjectEmpty(info.expendSpeciThing)) {
            req.expendSpeciThing = info.expendSpeciThing;
        }

        if (!cc.g.utils.judgeObjectEmpty(info.goldMatchRule)) {
            req.goldMatchRule = info.goldMatchRule
        }

        cc.g.networkMgr.send(PB.PROTO.MODIFY_TEA_HOUSE_ROOM_RULE, req, (resp)=>{
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('修改包间的规则 成功');

                if (cb) {
                    cb();
                }
            } else {
                cc.log('修改包间的规则 失败');
            }
        });
    },

    //获取包间桌子
    getClubRoomDesk: function (clubId, roomIndex, cb) {
        {/*
            //获取俱乐部包间的桌子信息
            //@api:2055,@type:req
            message ClubRoomDeskInfoReq{
                int32 clubId = 1;//俱乐部Id
                int32 roomIndex = 2;//包间的索引
            }
            //@api:2055,@type:resp
            message ClubRoomDeskInfoResp{
                repeated ClubRoomDeskInfo list = 1;//包间所有桌子信息 223446
            }
        */}

        let req = pbHelper.newReq(PB.PROTO.CLUB_ROOM_DESK_INFO);
        req.clubId = clubId;
        req.roomIndex = roomIndex;
        cc.g.networkMgr.send(PB.PROTO.CLUB_ROOM_DESK_INFO, req, (resp)=>{
            let list = resp.list;
            if (cb) {
                cb(clubId, roomIndex, list);
            }
        });
    },
    
    //获取俱乐部审批列表
    getClubApplyList: function(clubInfo) {
        let req = pbHelper.newReq(PB.PROTO.GET_CLUB_APPLY_LIST);
        req.clubId = clubInfo.clubId;
        cc.g.networkMgr.send(PB.PROTO.GET_CLUB_APPLY_LIST, req, (resp)=>{
            if(resp.err == null) {
                clubInfo.applyCnt = resp.list.length;
                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').updateApplyNotify();
                }
                if (this.hall != null && this.hall.menuNode['club_apply_list'] != null) {
                    this.hall.menuNode['club_apply_list'].getComponent('clubApply').updateClubApplyList(resp.clubId, resp.list);
                }
            }
        });

    },
    //俱乐部审批
    clubApprove: function (clubInfo, agree, target, callback) {
        let req = pbHelper.newReq(PB.PROTO.CLUB_APPROVE);
        req.clubId = clubInfo.clubId;
        req.agree = agree;
        req.target = target;
        cc.g.networkMgr.send(PB.PROTO.CLUB_APPROVE, req, (resp)=>{
            if(resp.err == null || resp.err == PB.ERROR.OK) {
                if(agree) {
                    clubInfo.memberCnt += 1;
                }
                clubInfo.applyCnt -= 1;
                //clubInfo.membersList.push(resp.member);
                if (clubInfo.applyCnt <= 0 && this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').updateApplyNotify();
                }
                //刷新俱乐部列表
                if (this.hall != null && this.hall.menuNode['club'] != null) {
                    this.hall.menuNode['club'].getComponent('Club').updateClubList();
                }
                if(callback) {
                    callback();
                }
            }
            else {
                if(resp.err == PB.ERROR.CLUB_PLAYER || resp.err == PB.ERROR.CLUB_NOT_APPLY) {
                    this.getClubApplyList(clubInfo);
                }
            }
        });
    },
    //获取俱乐部成员列表
    getClubMembersList:function(clubInfo, cb){
        let req = pbHelper.newReq(PB.PROTO.GET_CLUB_MEMBERS_LIST);
        req.clubId = clubInfo.clubId;

        cc.g.networkMgr.send(PB.PROTO.GET_CLUB_MEMBERS_LIST, req, (resp)=>{
            if(resp.err == null) {
                clubInfo.membersList = resp.list;
                
                if(clubInfo.memberCnt != resp.list.length) {
                    clubInfo.memberCnt = resp.list.length;
                    if (this.hall != null && this.hall.menuNode['club'] != null) {
                        this.hall.menuNode['club'].getComponent('Club').updateClubList();
                    }
                }

                //if(this.hall != null && this.hall.menuNode['club_members_list'] != null) {
                //    this.hall.menuNode['club_members_list'].getComponent('clubMenber').updateClubMembersList(resp.clubId, resp.list);
                //}

                if (cb) {
                    cb(resp.clubId, resp.list);
                }
            }
        });
    },
    //删除俱乐部成员
    deleteClubMember:function(clubInfo, clubMemberInfo, callback){
        let req = pbHelper.newReq(PB.PROTO.DELETE_CLUB_MEMBER);
        req.clubId = clubInfo.clubId;
        req.target = clubMemberInfo.userId;
        cc.g.networkMgr.send(PB.PROTO.DELETE_CLUB_MEMBER, req, (resp)=>{
            if(resp.err === PB.ERROR.OK) {
                for(let i = 0; i < clubInfo.membersList.length; i++) {
                    if(clubInfo.membersList[i] === clubMemberInfo) {
                        clubInfo.memberCnt -= 1;
                        clubInfo.membersList.splice(i, 1);
                        break;
                    }
                }
                if(callback != null) {
                    callback();
                }
            }
            else if(resp.err == PB.ERROR.CLUB_NOT_EXIST_MEMBER) {
                this.getClubMembersList(clubInfo);
            }
        });
    },
    //设置俱乐部管理员
    setClubAdministrator:function(clubInfo, clubMemberInfo, title, callback){
        let req = pbHelper.newReq(PB.PROTO.SET_CLUB_ADMINISTRATOR);
        req.title = title;
        req.clubId= clubInfo.clubId;
        req.target = clubMemberInfo.userId;
        cc.g.networkMgr.send(PB.PROTO.SET_CLUB_ADMINISTRATOR, req, (resp)=>{
            if(resp.err == PB.ERROR.OK) {
                clubMemberInfo.title = title;
                if(callback) {
                    callback();
                }
            }
            else if(resp.err == PB.ERROR.CLUB_NOT_EXIST_MEMBER) {
                this.getClubMembersList(clubInfo);
            }
        });
    },
    //修改俱乐部游戏类型
    modifyClubGame:function(clubInfo, gameTypes, callback){
        let req = pbHelper.newReq(PB.PROTO.MODIFY_CLUB_GAME);
        req.clubId = clubInfo.clubId;
        req.gameTypes = gameTypes;
        cc.g.networkMgr.send(PB.PROTO.MODIFY_CLUB_GAME, req, (resp)=>{
            if(resp.err == PB.ERROR.OK) {
                clubInfo.gameTypes = gameTypes;
                if(callback) {
                    callback();
                }
            }
        });
    },
    //获取成员头衔
    getUserClubTitle:function (clubInfo, userId) {
        let len = 0;
        let membersList = clubInfo.membersList;
        if(membersList != null) {
            len = membersList.length;
        }
        for(let i = 0; i < len; i ++) {
            if(membersList[i].userId.eq(userId)) {
                return membersList[i].title;
            }
        }
        return PB.CLUB_TITLE.CLUB_TITLE_MEMBER;
    },


    // 获取茶馆多少天的消费记录
    getClubConsumeRecode: function(clubInfo, cb) {
        {/*
            //获取茶馆的游戏多少天的的消耗记录
            //@api:2059,@type:req
            message CLubDaysConsumeReq{
                int32 clubId = 1;//茶馆id
                int32 Day    = 2; //最近多少天
            }
            //@api:2059,@type:resp
            message CLubDaysConsumeResp{
                int32 clubId = 1;
                repeated clubDayConsumeInfo consumes = 2;
            }
            message clubDayConsumeInfo{
                string date = 1;//时间
                int32 gameNum = 2;//局数
                int32 consumeCard = 3;//消耗的卡
            }
        */}
        let req = pbHelper.newReq(PB.PROTO.GET_CLUB_DAYS_RECORD);
        req.clubId = clubInfo.clubId;
        req.Day = 30;
        if (!cc.g.utils.judgeObjectEmpty(clubInfo.payCardType)) {
            req.payCardType = clubInfo.payCardType
        }

        cc.g.networkMgr.send(PB.PROTO.GET_CLUB_DAYS_RECORD, req, (resp)=>{
            if (!resp.clubId || resp.clubId!=clubInfo.clubId) {
                cc.error('getClubDateRecode error');
                return;
            }

            let o = {};
            o.clubId = resp.clubId;
            o.consumes = resp.consumes;

            if (0) {
                for (let i = 0; i < 10; ++i) {
                    let oo = {};
                    oo.date = '2020-09-' + (i<10 ? '0'+i : i);
                    oo.gameNum = i;
                    oo.consumeCard = i*10;

                    o.consumes.push(oo);
                }
            }


            this.lastClubConsumes = o;

            cb && cb();
        });
    },

    /* =================================================================================================================== */
    /* =================================================================================================================== */



    //设置语音回调
    setGVoiceCallBack: function () {
        // let _self = this;
        // if (cc.sys.isNative && cc.g.voiceSdk != null) {
        //     cc.g.voiceSdk.setCallback((type, arg1, agr2, arg3) => {
        //         _self.scheduleOnce(()=>{
        //             if (type === 0) {//加入房间回调
        //                 //arg1: 结果码， arg2:成员ID,  arg3：房间名
        //                 if (arg1 === 1) {//加入房间成功
        //                     cc.log('加入语音房间[' + arg3 + ']成功(memberID=' + agr2 + ')');
        //                     //cc.log('闪退测试 0 this.curGameMgr', _self.curGameMgr);
        //                     if (_self.curGameMgr) {
        //                         //通知其他玩家我在语音房间的成员ID
        //                         //cc.log('闪退测试 1 arg1, agr2, arg3',arg1, agr2, arg3);
        //                         _self.curGameMgr.bindGVoiceMemberId(agr2);
        //                         //cc.log('闪退测试 2');
        //                     }
        //                     if (_self.curGameMgr && _self.curGameMgr.gameScript && cc.g.audioMgr.isGVoiceOn) {
        //                         //cc.log('闪退测试 3');
        //                         cc.g.voiceSdk.openSpeaker();
        //                         //cc.log('闪退测试 4');
        //                     } else {
        //                         //cc.log('闪退测试 5');
        //                         cc.g.voiceSdk.closeSpeaker();
        //                         //cc.log('闪退测试 6');
        //                     }
        //                     //cc.log('闪退测试 7');
        //                     cc.g.voiceSdk.closeMic();
        //                     //cc.log('闪退测试 8');
        //                 } else {
        //                     cc.log('加入语音房间[' + arg3 + ']失败(code=' + arg1 + ')');
        //                 }
        //             } else if (type === 1) {//离开房间回调
        //                 //arg1: 结果码， arg3：房间名
        //                 if (arg1 === 6) {
        //                     cc.log('退出语音房间[' + arg3 + ']成功');
        //                 }
        //                 else {
        //                     cc.log('退出语音房间[' + arg3 + ']失败(code=' + arg1 + ')');
        //                 }
        //             } else if (type == 2) {
        //                 //agr1:成员ID， agr2:0-停止说话，1-开始说话， 2-继续说话
        //                 cc.log('成员(memberID = ' + arg1 + ')' + (agr2 === 0 ? '停止说话' : (agr2 == 1 ? '开始说话' : '停止说话')));
        //                 if (_self.curGameMgr != null) {
        //                     if (_self.curGameMgr.gameScript != null) {
        //                     }
        //                 }
    
        //                 if (agr2 > 0) {
        //                     if(_self.voiceNosuond != null) {
        //                         _self.unschedule(_self.voiceNosuond);
        //                         _self.voiceNosuond = null;
        //                     }
    
        //                     cc.g.audioMgr.pauseBGM();
        //                 } else {
        //                     if(_self.voiceNosuond == null) {
        //                         _self.voiceNosuond = function () {
        //                             cc.g.audioMgr.resumeBGM();
        //                         }
        //                     }
        //                     _self.scheduleOnce(_self.voiceNosuond, 3);
        //                 }
        //             } else {
        //                 let o = {};
        //                 o.type = type;
        //                 o.arg1 = arg1;
        //                 o.arg2 = arg2;
        //                 o.arg3 = arg3;
        //                 cc.log('语音回调 ', o);
    
        //                 let str = '语音回调' + o.type + ' ' + o.arg1 + ' '+ o.arg2 + ' '+ o.arg3;
        //                 cc.g.global.showTipBox(str);
        //             }
        //         }, 1);
        //     });
        // }
    },
});


/*
    // bundle.loadDir("./", function (err, assets) {
    //     cc.log('bundle.loadDir err', err);
    //     cc.log('bundle.loadDir assets', assets);

    //     //loadScene  preloadScene
    //     //bundle.loadScene('eqs', function (err, scene) {
    //         //cc.log('bundle.loadScene err', err);
    //         //cc.log('bundle.loadScene scene', scene);

    //         cc.director.loadScene('eqs');
    //     //});
    // });

    //cc.director.loadScene('eqs');

    // this.scheduleOnce(()=>{
    //     let Canvas = cc.director.getScene().getChildByName('Canvas');
    //     cc.log('Canvas', Canvas);
    // }, 10);
*/