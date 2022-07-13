cc.Class({
    extends: cc.Component,

    properties: {
        hintPf: {
            default: null,
            type: cc.Prefab,
        },
        xieyiPf: {
            default: null,
            type: cc.Prefab,
        },
        sjLoginPf: {
            default: null,
            type: cc.Prefab,
        },
    },


    onLoad () {
        cc.g.pf.hint = this.hintPf;

        cc.g.isinLogin = true;

        let localVersion = cc.sys.localStorage.getItem('currentVersion');
        if(localVersion != null ) {
            let localBuildVersion = localVersion.substr(0, localVersion.lastIndexOf("."));
            if(localBuildVersion !=  cc.sys.curBuildVersion) {
                localVersion = GameConfig.gameVersion;
            }
        } else {
            localVersion = GameConfig.gameVersion;
        }
        this.node.getChildByName('login').getChildByName('version').getComponent(cc.Label).string = '版本号 ' + localVersion;

        cc.g.utils.setCanvasFit();


        this.xieyiTog = this.node.getChildByName('Toggle_xieyi').getComponent(cc.Toggle);


        let loginBtns = this.node.getChildByName('login').getChildByName('layout'); 
        if((GameConfig.loginMode & (1 << PB.PLATFORM.GUEST)) == 0) {
            loginBtns.getChildByName('guest').active = false;
        }

        if((GameConfig.loginMode & (1 << PB.PLATFORM.WECHAT)) == 0) {
            loginBtns.getChildByName('wxLogin').active = false;
        }

        if((cc.sys.os === cc.sys.OS_ANDROID) || (cc.sys.os === cc.sys.OS_IOS)) {
            loginBtns.getChildByName('wxLogin').active = true;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS) {
            loginBtns.getChildByName('guest').active = false;
        }

        if (cc.sys.os === cc.sys.OS_WINDOWS) {
            loginBtns.getChildByName('guest').active = true;
        }

        // if((GameConfig.loginMode & (1 << PB.PLATFORM.ACCOUNT)) == 0) {
        //     loginBtns.getChildByName('phoneLogin').active = false;
        // }
        loginBtns.getChildByName('sjLogin').active = true;

        if (!cc.g.networkMgr.socket) {
            cc.log('登录界面 初始化网络');
            cc.g.networkMgr.init();
            cc.g.networkMgr.addOnceHandler('connected', () => {
                cc.log('登录界面 初始化网络连接成功');
            });
        } else {
            cc.log('登录界面 网络连接中...');
            cc.g.global.showWaiting('登录界面网络连接中...');
            cc.g.networkMgr.reConnetcted()
            cc.g.networkMgr.addOnceHandler('connected', () => {
                cc.log('登录界面 连接成功');
                cc.g.global.destoryWaiting();
            });
        }
    },

    start () {
        // if (cc.sys.os === cc.sys.OS_IOS) {
        //     if (!cc.g._1st_checkLocationPermission) {
        //         cc.g._1st_checkLocationPermission = true;
        //         cc.g.utils.checkLocationPermission()
        //     }
        // }

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.wechatGameLogin();
        }
    },

    update (dt) {},

    onClickLoginWithGuest: function() {
        cc.log('点击了游客登录');

        if (!this.xieyiTog.isChecked) {
            cc.g.global.hint('请您同意勾选协议');
            return;
        }

        cc.g.utils.btnShake();

        // 手动登录
        cc.g.sdLogin = true;

        cc.g.userMgr.guestLogin(() => {
            cc.director.loadScene('loading', (err, scene) => {
                cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
            });
        });
    },

    onClickLoginWithWX: function() {
        cc.log('点击了微信登陆');

        if (!this.xieyiTog.isChecked) {
            cc.g.global.hint('请您同意勾选协议');
            return;
        }
        
        cc.g.utils.btnShake();

        // 手动登录
        cc.g.sdLogin = true;
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.wechatGameLogin();
        } else {
            cc.g.userMgr.loginWithWX();
        }
    },

    onClickLoginWithPhone: function() {
        cc.log('点击了手机登陆');

        if (!this.xieyiTog.isChecked) {
            cc.g.global.hint('请您同意勾选协议');
            return;
        }
        
        cc.g.utils.btnShake();

        let pfb = cc.instantiate(this.sjLoginPf);
        this.node.addChild(pfb);
    },

    // 点击用户协议
    onBtnUserXieyi: function() {
        cc.log('onBtnUserXieyi');

        let pfb = cc.instantiate(this.xieyiPf);
        this.node.addChild(pfb);
    },

    /**
     * 微信登录
     */
    wechatGameLogin: function() {
        let self = this;
        wx.login({
            success(res) {
                if (res.code) {
                    self.createWXUserInfoButton(res.code);
                }
                else {
                    wx.showModal({
                        title: '提示',
                        content: '微信登录失败!',
                        showCancel: false
                    });
                    cc.log('登录失败!' + res.errMsg);
                }
            },
        });
    },

    /**
     * 创建微信获取用户信息按钮
     */
    createWXUserInfoButton(code) {
        let sysInfo = wx.getSystemInfoSync();
        let winSize = cc.view.getVisibleSize();
        /**
         * 这个说来话长
         * 锚点设置后，y属性永远是默认设定的不会修改，所以不同分辨率会导致定位不准确
         * 260 = 200锚点+图片的高度/2
         */
        let nodeY = -winSize.height / 2 + 260

        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            lang: 'zh_CN',
            style: {
                left: sysInfo.screenWidth / 2 - (this.node.width / 2) * sysInfo.screenWidth / winSize.width,
                top: sysInfo.screenHeight - (winSize.height / 2 + nodeY + this.node.height / 2) * (sysInfo.screenHeight / winSize.height),
                width: this.node.width * sysInfo.screenWidth / winSize.width,
                height: this.node.height * sysInfo.screenHeight / winSize.height,
                //backgroundColor: '#ff0000',
                //color: '#ffffff'
            }
        });
        button.onTap((res) => {
            // console.log('res-->' + JSON.stringify(res))
            if (!cc.g.utils.judgeStringEmpty(res.encryptedData) && !cc.g.utils.judgeStringEmpty(res.iv)) {
                button.destroy();
                cc.g.userMgr.wxMinProLogin(code, res.encryptedData, res.iv);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '授权失败!',
                    showCancel: false
                });
            }
        });
    },

    // getUserInfo:function(code) {
    //     wx.getSetting({
    //         success(res) {
    //             if (res.authSetting['scope.userInfo']) {
    //                 wx.getUserInfo({
    //                     success: userInfo => {
    //                         cc.g.userMgr.wxMinProLogin(code, userInfo.encryptedData, userInfo.iv);
    //                     },
    //                     fail: err => {
    //                         wx.showModal({
    //                             title: '提示',
    //                             content: '获取用户信息失败!',
    //                             showCancel: false
    //                         });
    //                     }
    //                 })
    //             } else {
    //                 wx.authorize({
    //                     scope: 'scope.userInfo',
    //                     success () {
    //                         wx.getUserInfo({
    //                             success: userInfo => {
    //                                 cc.g.userMgr.wxMinProLogin(code, userInfo.encryptedData, userInfo.iv);
    //                             },
    //                             fail: err => {
    //                                 wx.showModal({
    //                                     title: '提示',
    //                                     content: '获取用户信息失败!',
    //                                     showCancel: false
    //                                 });
    //                             }
    //                         })
    //                     },
    //                     fail: err => {
    //                         wx.showModal({
    //                             title: '提示',
    //                             content: '授权失败!',
    //                             showCancel: false
    //                         });
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // },

    /* =============================================================================================== */
    onClickCheckGPSPerm: function(evt, custm) {
        cc.g.utils.checkLocationPermission();
    },
    onClickCheckGPS: function(evt, custm) {
        cc.g.utils.checkLocationSvr(custm);
        cc.g.utils.locationDistence(30.61595, 104.06628, 30.61595, 104.06628);
        cc.g.utils.locationDistence(30.61595, 104.06628, 30.71595, 104.16628);
    },
    onClickOpenGPS: function() {
        cc.g.utils.openLocation();
    },
});
