import TeaClass from "../tea/tea";

cc.Class({
    extends: cc.Component,
    properties: {
        //account: null,
        userId: 0,
        uid: '',
        userName: null,
        gsId: 0,
        roomId: 0,
        level: 0,
        exp: 0,
        gold: 0,
        diamond: 0,
        roomCard: 0,
        bankGold: 0,
        icon: '',
        signature: '',
        shareCnt: 0,
        isNew: false,
        isLogined: false,
        inviteJoinRoomId: 0,
        shareTotal: 0,
        shareAchieve: 0,
        receivedShareNtf: false,
        timeDelta: 0,
        ip: '127.0.0.1',
    },

    init: function () {

        // cc.g.global.init();

        //登出通知
        cc.g.networkMgr.addHandler(PB.PROTO.LOGOUT, (resp) => {
            this.logoutCallback();
        });
        //货币更新通知
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_MONEY_UPDATE, (resp) => {
            cc.log('通知某个玩家货币更新', resp);

            for (let i = 0; i < resp.list.length; i++) {
                if (resp.list[i].type == 1) {//金币
                    let val = resp.list[i].value;
                    this.gold = val;
                } else if (resp.list[i].type == 2) {//房卡
                    let val = resp.list[i].value;
                    this.roomCard[resp.list[i].origin - 1] = val;
                } else if (resp.list[i].type == 3) {//钻石
                    this.diamond = val;
                } else if (resp.list[i].type == 4) {//转账
                    this.bankGold = val;
                }

                if (cc.g.hallMgr != null) {
                    cc.g.hallMgr.updateMoney(resp.list[i].type);
                }
            }
        });

        cc.g.networkMgr.addHandler(PB.PROTO.PROTO_NOTIFY_SHARE_NUM, (resp) => {
            this.shareTotal = resp.total;
            this.shareAchieve = resp.achieve;
            this.canOpenRedPkg = resp.canOpen;

            if (cc.g.hallMgr.hall != null && cc.g.hallMgr.hall.menuNode['notice'] != null && cc.g.hallMgr.hall.menuNode['notice'].active) {
                cc.g.hallMgr.hall.menuNode['notice'].getComponent('Notice').setInviteRewardContent();
            }
            if (cc.g.hallMgr.hall != null && cc.g.hallMgr.hall.menuNode['redPack'] != null && cc.g.hallMgr.hall.menuNode['redPack'].active) {
                cc.g.hallMgr.hall.menuNode['redPack'].getComponent('RedPack').updateData();
            }

            if(cc.g.hallMgr.hall != null) {
                cc.g.hallMgr.hall.checkRedDot();
            }
            if(cc.g.hallMgr.curGameMgr == null) {
                if( cc.g.hallMgr.hall != null) {
                    cc.g.hallMgr.shareRewardNtf();
                }
            }
            else {
                this.receivedShareNtf = true;
            }
        });

        cc.g.networkMgr.addHandler(PB.PROTO.GET_SHARE_REDPKG, resp => {
            if (!resp.err) {
                let gold =  (resp.achieveRedPkg - cc.g.userMgr.achieveRedPkg).toFixed(2);
                cc.g.userMgr.achieveRedPkg = resp.achieveRedPkg;
                cc.g.userMgr.canOpenRedPkg = cc.g.userMgr.canOpenRedPkg - 1;
                if(cc.g.hallMgr.hall.menuNode['redPack'] != null) {
                    cc.g.hallMgr.hall.menuNode['redPack'].getComponent('RedPack').receiveRedpackSuccess(gold);
                }
            }
        });
    },

    startLogin: function (loginReq, callback, auto) {
        loginReq.inviter = 0;
        if (!auto) {
            cc.g.global.showWaiting('正在登录');
            this.connectAndLogin(loginReq, callback);
        } else {
            loginReq.inviter = 0;
            this.connectAndLogin(loginReq, callback);
        }
    },

    connectAndLogin: function (loginReq, callback) {
        if (!cc.g.networkMgr.socket) {
            cc.log('登录 需要初始化网络');

            cc.g.networkMgr.init();
            cc.g.networkMgr.addOnceHandler('connected', () => {
                this.init();
                cc.g.global.init();
                this.sendLoginReq(loginReq, callback);
            });
        } else {
            cc.log('登录 已经初始化网络');

            this.init();
            cc.g.global.init();
            this.sendLoginReq(loginReq, callback);
        }
    },

    //自动登录
    autoLogin: function (callback, reconnect) {
        let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
        let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
        loginReq.inviter = 0;
        if (reconnect) {//uuid存在重新登录
            loginReq.uuid = this.uid;//userData.uuid;
            loginReq.isNew = false;
            loginReq.platform = lastPlatform;
        }
        else {
            let userData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('userData'))
            let guestData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('guestData'))
            let wxData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxData'))
            let wxMinData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxMinData'))
            let phoneData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('phoneData'));

            if (lastPlatform == PB.PLATFORM.ACCOUNT) {//uuid存在,账号登录
                loginReq.uuid = userData.uuid;//'';
                loginReq.isNew = false;
                loginReq.platform = PB.PLATFORM.ACCOUNT;
            } else if (lastPlatform == PB.PLATFORM.GUEST) {//uuid存在,游客登录
                loginReq.uuid = guestData.uuid;
                loginReq.isNew = false;
                loginReq.platform = PB.PLATFORM.GUEST;
            } else if (lastPlatform == PB.PLATFORM.WECHAT) {
                loginReq.uuid = wxData.uuid;
                loginReq.isNew = false;
                loginReq.platform = PB.PLATFORM.WECHAT;
            } else if (lastPlatform == PB.PLATFORM.WECHAT_GAME) {
                loginReq.uuid = wxMinData.uuid;
                loginReq.isNew = false;
                loginReq.platform = PB.PLATFORM.WECHAT_GAME;
            } else if (lastPlatform == PB.PLATFORM.PHONE) {
                loginReq.uuid = phoneData.uuid;
                loginReq.isNew = false;
                loginReq.platform = PB.PLATFORM.PHONE;
            } else {//特细情况直接按新游客登录
                loginReq.uuid = '';
                loginReq.isNew = true;
                loginReq.platform = PB.PLATFORM.GUEST;
            }
        }

        loginReq.account = '';
        loginReq.pwd = '';

        //var self = this;
        //this.sendLoginReq(loginReq, callback);
        this.connectAndLogin(loginReq, callback);
    },

    guestLogin: function (callback) {
        let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
        let guestData = JSON.parse(cc.sys.localStorage.getItem('guestData'))
        loginReq.uuid = (guestData != null && guestData.uuid !== '') ? guestData.uuid : '';
        loginReq.isNew = !(guestData != null && guestData.uuid !== '');
        loginReq.platform = PB.PLATFORM.GUEST;
        loginReq.account = '';
        loginReq.pwd = '';

        //this.sendLoginReq(loginReq, callback);
        this.startLogin(loginReq, callback, false);
    },

    loginWithPhone: function (pNum, pw, callback) {
        cc.log('pNum, pw', pNum, pw);

        let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
        
        let phoneData = JSON.parse(cc.sys.localStorage.getItem('phoneData'));

        loginReq.uuid = '';
        loginReq.isNew = !phoneData;
        loginReq.platform = PB.PLATFORM.PHONE;
        loginReq.account = pNum;
        loginReq.pwd = pw;

        //this.sendLoginReq(loginReq, callback);
        this.startLogin(loginReq, callback, false);
    },

    //调用原生平台wx登陆
    loginWithWX: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loginWithWX", "(I)V", 1);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AppController', 'sendAuthRequest');
            }
        }
    },

    

    /*
    * @account @Type：String
    * @password 密码 @Type：String
    * */
    accountLogin: function (account, password, callback) {
        let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
        loginReq.uuid = '';
        loginReq.isNew = false;
        loginReq.account = account;
        loginReq.pwd = password;
        loginReq.platform = PB.PLATFORM.ACCOUNT;

        //var self = this;
        //this.sendLoginReq(loginReq, callback);
        this.startLogin(loginReq, callback, false);
    },

    WXLogin: function (code) {
        cc.log('WXLogin code, isLogined', code, this.isLogined);
        
        let codeArray = code.split('|');
        if (codeArray[1] != 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '微信登陆失败');
            return;
        }

        //如果isLogined为true说明已经登陆，是绑定
        // if (fathis.isLogined) {
        //     let bindReq = pbHelper.newReq(PB.PROTO.BIND);
        //     bindReq.platform = PB.PLATFORM.WECHAT;
        //     bindReq.code = codeArray[2];
        //     bindReq.account = '';
        //     bindReq.pwd = '';
        //     bindReq.token = '';
        //     bindReq.refreshToken = '';

        //     this.sendWXBind(bindReq);
        // } 
        // else 

        {
            let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
            loginReq.uuid = '';
            loginReq.isNew = true;
            loginReq.account = '';
            loginReq.pwd = '';
            loginReq.platform = PB.PLATFORM.WECHAT;
            loginReq.code = codeArray[2];
            loginReq.inviter = this.inviter;

            let callback = function () {
                cc.director.loadScene('loading', (err, scene) => {
                    cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                });
            };
            //this.sendLoginReq(loginReq, callback);
            this.startLogin(loginReq, callback, false);
        }
    },

    wxMinProLogin: function (code, userEncodeData, iv) {
        cc.log('wxMinProLoginWXLogin code, isLogined', code, this.isLogined);
        cc.log('wxMinProLoginWXLogin userEncodeData', userEncodeData);
        //如果isLogined为true说明已经登陆，是绑定
        if (this.isLogined) {
            let bindReq = pbHelper.newReq(PB.PROTO.BIND);
            bindReq.platform = PB.PLATFORM.WECHAT_GAME;
            bindReq.code = code
            bindReq.account = '';
            bindReq.pwd = '';
            bindReq.token = '';
            bindReq.refreshToken = '';
            if (cc.g.utils.judgeStringEmpty(userEncodeData)) {
                loginReq.wxMinGameEncryptedData = '';
            } else {
                loginReq.wxMinGameEncryptedData = userEncodeData;
            }
            if (cc.g.utils.judgeStringEmpty(iv)) {
                loginReq.wxMinGameIv = '';
            } else {
                loginReq.wxMinGameIv = iv;
            }
            this.sendWXMinProBind(bindReq);
        } else {
            let loginReq = pbHelper.newReq(PB.PROTO.LOGIN);
            loginReq.uuid = '';
            loginReq.isNew = true;
            loginReq.account = '';
            if (cc.g.utils.judgeStringEmpty(userEncodeData)) {
                loginReq.wxMinGameEncryptedData = '';
            } else {
                loginReq.wxMinGameEncryptedData = userEncodeData;
            }
            if (cc.g.utils.judgeStringEmpty(iv)) {
                loginReq.wxMinGameIv = '';
            } else {
                loginReq.wxMinGameIv = iv;
            }
            loginReq.platform = PB.PLATFORM.WECHAT_GAME;
            loginReq.code = code
            // loginReq.inviter = this.inviter;

            let callback = function () {
                cc.director.loadScene('loading', (err, scene) => {
                    cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                });
            };
            //this.sendLoginReq(loginReq, callback);
            this.startLogin(loginReq, callback, false);
        }
    },

    register: function (registerReq, callback) {
        //var self = this;
        //this.sendLoginReq(registerReq, callback);
        this.startLogin(registerReq, callback, false);
    },

    sendLoginReq: function (loginReq, callback) {
        var self = this;

        loginReq.os = 'unknown';
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            loginReq.os = 'android';
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            loginReq.os = 'ios';
        } else if (cc.sys.os === cc.sys.OS_WINDOWS) {
            loginReq.os = 'win';
        }

        loginReq.clientVersion = cc.sys.localStorage.getItem('currentVersion') || '0.0.0';
        if (cc.sys.useTestVer) {
            loginReq.clientVersion = 'T_' + loginReq.clientVersion;
        }

        loginReq.isReconnect = true;
        if (cc.g.sdLogin) {
            loginReq.isReconnect = false;
            cc.g.sdLogin = null;
        }
        
        cc.g.networkMgr.send(PB.PROTO.LOGIN, loginReq, (loginResp) => {
            cc.g.global.destoryWaiting();
            if (loginResp.err != null) {
                //cc.g.networkMgr.close(false);
                cc.log('登陆失败，错误ID：' + loginResp.err);
                if (loginResp.err == PB.ERROR.UUID_NOT_EXIST) {
                    let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
                    if (lastPlatform == PB.PLATFORM.GUEST) {
                        cc.sys.localStorage.setItem('lastPlatform', '');
                        cc.sys.localStorage.setItem('guestData', JSON.stringify({uuid: ''}));
                    }
                }

                //
                if (loginResp.err == PB.ERROR.HAVE_NEW_HOT_UPDATE) {
                    cc.log('检查到有热更新 此时应该会有热更新弹窗提示 不跳转场景');
                } else {
                    if (cc.director.getScene().name != 'login') {
                        cc.director.loadScene('login', (err, scene) => {
                        });
                    }
                }

                return;
            }


            cc.log('登陆成功========================>' + loginResp);

            cc.g.voiceMgr.login(`${i64v(loginResp.id)}`);

            // cc.g.networkMgr.setHeartEnable();
            self.isLogined = true;
            self.userName = loginResp.name;
            self.uid = loginResp.uuid;
            self.userId = loginResp.id;
            self.gold = loginResp.gold;
            self.diamond = loginResp.diamond;
            self.roomCard = loginResp.roomcard;
            self.gsId = loginResp.gsId;
            self.roomId = loginResp.roomId;
            self.bankGold = loginResp.bankGold;
            self.icon = loginResp.icon;
            self.signature = loginResp.signature;
            self.shareCnt = loginResp.shareCnt;
            self.isNew = loginResp.isNew;
            self.shareTotal = loginResp.shareTotal;
            self.shareAchieve = loginResp.shareAchieve;
            self.achieveRedPkg = loginResp.achieveRedPkg;
            self.canOpenRedPkg = loginResp.canOpenRedPkg;
            self.ip = loginResp.ip;
            self.timeDelta = loginResp.serverTime.toNumber() - Date.now()/1000;
            self.sex = loginResp.sex;
            self.gps = loginResp.gps;
            self.createClubPerm = loginResp.createClubPerm;
            self.bindSFZ = loginResp.bindSFZ;
            self.isNeedBingSFZ = loginResp.isNeedBingSFZ;
            self.phoneNo = loginResp.phoneNo;

            //cc.sys.localStorage.setItem('userData', JSON.stringify({uuid: self.uid}));
            if (loginReq.platform == PB.PLATFORM.GUEST) {
                cc.sys.localStorage.setItem('guestData', JSON.stringify({uuid: self.uid}));
            } else if (loginReq.platform == PB.PLATFORM.ACCOUNT) {
                cc.sys.localStorage.setItem('userData', JSON.stringify({uuid: self.uid}));
            } else if (loginReq.platform == PB.PLATFORM.WECHAT) {
                cc.sys.localStorage.setItem('wxData', JSON.stringify({uuid: self.uid}));
            } else if (loginReq.platform == PB.PLATFORM.WECHAT_GAME) {
                cc.sys.localStorage.setItem('wxMinData', JSON.stringify({uuid: self.uid}));
            } else if (loginReq.platform == PB.PLATFORM.PHONE) {
                cc.sys.localStorage.setItem('phoneData', JSON.stringify({uuid: self.uid}));
            }
            cc.sys.localStorage.setItem('lastPlatform', ''+loginReq.platform);

            // add by panbin for tea
            if (!cc.g.utils.judgeObjectEmpty(TeaClass.instance)) {
                TeaClass.instance.doReconnectData();
            }

            if (callback != null) {
                callback();
            }
        });
    },

    relogin: function () {
        if (!this.isLogined) {
            return;
        }
        this.autoLogin(function () {
            if (cc.g.hallMgr != null && cc.g.hallMgr.inited) {
                if (cc.g.userMgr.roomId != 0) {
                    cc.g.hallMgr.joinRoom(-1, cc.g.userMgr.roomId, true);
                } else if (cc.g.hallMgr.curGameType != -1 && cc.g.hallMgr.curGameMgr != null) {
                    if (cc.g.hallMgr.curGameMgr.backPlay) {
                        cc.log('玩家回放游戏 不是真的玩游戏');
                        if (cc.g.hallMgr.backPlay.quit) {
                            cc.g.hallMgr.backPlay.quit();
                        } else {
                            cc.warn('游戏回放没有退出方法 ID ', cc.g.hallMgr.curGameType);
                        }
                    } else {
                        cc.g.hallMgr.curGameMgr.playerQuited(cc.g.hallMgr.curGameMgr.getSelfPlayer());
                        cc.g.hallMgr.backToHall();
                    }
                } else if (cc.g.isinLogin) {
                    cc.log('重新登录 在登录界面 直接进入大厅');

                    cc.director.loadScene('loading', (err, scene) => {
                        cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                    });
                } else {
                    cc.log('重新登录 不去任何地方 保持现在位置');
                }

                //拉取活动列表
                cc.g.hallMgr.getActivityList();
            }
        }, true);
    },
    

    logout: function () {
        cc.log('logout');

        let logoutReq = pbHelper.newReq(PB.PROTO.LOGOUT);
        cc.g.networkMgr.send(PB.PROTO.LOGOUT, logoutReq, (logoutResp) => {
            this.isLogined = false;
            //登出成功
        });
    },

    logoutCallback: function () {
        cc.log('logoutCallback');

        this.isLogined = false;
        cc.sys.localStorage.setItem('lastPlatform', '');
        cc.sys.localStorage.setItem('userData', JSON.stringify({uuid: ''}));
        cc.sys.localStorage.setItem('wxData', JSON.stringify({uuid: ''}));
        cc.sys.localStorage.setItem('wxMinData', JSON.stringify({uuid: ''}));

        cc.g.networkMgr.close(false);
        cc.g.hallMgr.inited = false;

        cc.director.loadScene('login', (err, scene) => {
            cc.log('加载登录场景成功.')
        });
    },

    //修改玩家信息
    modifyUserInfo: function (name, signature, cb) {
        let req = pbHelper.newReq(PB.PROTO.MODIFY_USER_INFO);
        req.name = name;
        req.signature = signature;
        cc.g.networkMgr.send(PB.PROTO.MODIFY_USER_INFO, req, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                this.userName = name;
                this.signature = signature;
                if (cb != null) {
                    cb();
                }
            }
        });
    },

    wxShareCallback: function (platform, errorCode) {
        if (errorCode === 0) {
            if(this.shareCnt >=3){
                return;
            }
            if (cc.g.hallMgr.curGameType === -1 && cc.g.hallMgr.hall != null) {
                let req = pbHelper.newReq(PB.PROTO.SHARE);
                cc.g.networkMgr.send(PB.PROTO.SHARE, req, (resp) => {
                    if (resp.err == PB.ERROR.OK) {
                        if (this.shareCnt < 3) {
                            cc.g.global.showMsgBox(MsgBoxType.Normal, '奖励', '分享成功，获得' + GameConfig.shareGet + '房卡和300金币');
                            this.shareCnt++;
                            if (cc.g.hallMgr.hall.dlgshare) {
                                cc.g.hallMgr.hall.dlgshare.updateShareCnt();
                            }
                        }
                    }
                });
            }
        }
    },

    wxBind: function () {
        this.loginWithWX();
    },

    sendWXBind: function (bindReq) {
        cc.log('sendWXBind');
        cc.g.networkMgr.send(PB.PROTO.BIND, bindReq, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                cc.sys.localStorage.setItem('wxData', JSON.stringify({uuid: this.uid}));
                cc.sys.localStorage.setItem('lastPlatform', ''+PB.PLATFORM.WECHAT);
                cc.sys.localStorage.setItem('guestData', JSON.stringify({uuid: ''}));
                cc.g.networkMgr.close(false);
                cc.director.loadScene('start');
            } else {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '绑定失败');
            }
        });
    },
    sendWXMinProBind: function (bindReq) {
        cc.g.networkMgr.send(PB.PROTO.BIND, bindReq, (resp) => {
            if (resp.err == PB.ERROR.OK) {
                cc.sys.localStorage.setItem('wxMinData', JSON.stringify({uuid: this.uid}));
                cc.sys.localStorage.setItem('lastPlatform', ''+PB.PLATFORM.WECHAT_GAME);
                cc.sys.localStorage.setItem('guestData', JSON.stringify({uuid: ''}));
                cc.g.networkMgr.close(false);
                cc.director.loadScene('start');
            } else {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '绑定失败');
            }
        });
    },
    checkShareReward: function () {
        return !(cc.g.userMgr.shareTotal === cc.g.userMgr.shareAchieve);
    },
});
