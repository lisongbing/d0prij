if (cc.sys.os === cc.sys.OS_WINDOWS) {
    cc.sys.curBuildVersion = '1.101';
    cc.sys.curDevMode = 'debug';
    var localBuildVersion = cc.sys.localStorage.getItem('currentVersion');
    if(localBuildVersion != null) {
        localBuildVersion = localBuildVersion.substr(0,localBuildVersion.lastIndexOf('.'));
        if(localBuildVersion == cc.sys.curBuildVersion) {
            var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');
            if (hotUpdateSearchPaths) {
                jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
            }
        }
    }
    else {
        cc.sys.localStorage.clear();
    }
}


cc.dlog = cc.log;
cc.log = console.log;

if (CC_DEBUG) {
    cc.log('CC_DEBUG');
}
if (CC_BUILD) {
    cc.log('CC_BUILD');
}

cc.log('cc.sys.curDevMode', cc.sys.curDevMode);

if (cc.sys.curDevMode && cc.sys.curDevMode == 'relese') {
    cc.log = cc.dlog;
}


/* ====================================================================================================   */

cc.urlraw = function (url) {
    url = 'resources/' + url;

    let s10 = url.substr(10);
    let ext = cc.path.changeExtname(s10)
    return cc.assetManager._transform({'path': ext, bundle: cc.AssetManager.BuiltinBundleName.RESOURCES, __isNative__: true, ext: cc.path.extname(url)});
}


cc.isMobile = function () {
    if(cc.sys.isNative) {
        if (cc.sys.os !== cc.sys.OS_WINDOWS) {
            return true;
        }
    }
    return false;
};

window.no_ios_andriod = function (obj) {
    return (cc.sys.os !== cc.sys.OS_IOS) && (cc.sys.os !== cc.sys.OS_ANDROID);
};
window.i64v=(v)=>(v ? (v.toNumber ? v.toNumber() : v) : v);
window.eq64=(v1, v2)=>{
    if (v1&&v2) {
        if (v1.eq) return v1.eq(v2);
        if (v2.eq) return v2.eq(v1);
    }
    return v1===v2;
}
window.DQID = {
    JiangAn:2
}
window.GMID = {
    XZMJ: 4,
    D2: 9,
    HZMJ: 10,
    PDK: 11,
    DDZ5: 13,
    YBMJ: 12,
    NYMJ: 15,
    PDKNJ: 16,
    LZMJ: 19,
    NJMJ: 18,
    YJMJ: 20,
    GXMJ: 25,
    LCMJ: 28,
    EQS:21,
    PDKLS:22,
    PDKTY:14,
    PDKGX:23,
    PDKGAOX:24,
    PDKLC:27,
    XZMJER:26,
}
window.GMGrp = {
    'mahjong':[GMID.HZMJ,GMID.XZMJ,GMID.YBMJ,GMID.NYMJ,GMID.LZMJ,GMID.NJMJ,GMID.YJMJ,GMID.GXMJ,GMID.XZMJER,GMID.LCMJ],
    'poker':[GMID.PDK, GMID.PDKTY, GMID.PDKNJ, GMID.PDKLS, GMID.PDKGX, GMID.DDZ5, GMID.PDKGAOX, GMID.PDKLC],
    'zipai':[GMID.D2, GMID.EQS]
};
window.XUQIU_OC = {
    'jjx': true,
    'yqcs': true,
};
/* ====================================================================================================   */


let clone = function (obj) {
    // Handle the 3 simple types, and null or undefined
    if (obj == null || typeof obj != "object"  ) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

/**
 * json 输出日志
 * @param msg
 */
let log = function (tags, msg) {
    try {
        let date = new Date()
        console.log(date)
        console.log(tags)
        console.log(msg)
    } catch (e) {}
}

function initLocalStorage() {
    cc.log('initLocalStorage');

    let ison = cc.sys.localStorage.getItem('isBGMOn');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isBGMOn', 1);
    }
    ison = cc.sys.localStorage.getItem('isSFXOn');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isSFXOn', 1);
    }
    ison = cc.sys.localStorage.getItem('isGVoiceOn');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isGVoiceOn', 1);
    }

    ison = cc.sys.localStorage.getItem('isJietu');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isJietu', 0);
        GameConfig.isJietu = !true;
    } else {
        GameConfig.isJietu = ison==1;
    }

    ison = cc.sys.localStorage.getItem('isZhendong');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isZhendong', 1);
        GameConfig.isZhendong = true;
    } else {
        GameConfig.isZhendong = ison==1;
    }

    ison = cc.sys.localStorage.getItem('isDaoju');
    if (ison==undefined) {
        cc.sys.localStorage.setItem('isDaoju', 1);
        GameConfig.isDaoju = true;
    } else {
        GameConfig.isDaoju = ison==1;
    }


    ison = cc.sys.localStorage.getItem('mjIGS');
    if (true || ison==undefined) {
        ison = {};
        GMGrp.mahjong.forEach(e => {
            ison[e] = 0;
        });
        ison = JSON.stringify(ison);
        cc.sys.localStorage.setItem('mjIGS', ison);
    }
    cc.log('mjIGS', ison);
}

function initMgr( app ) {
    cc.g = {};
    // add by panbin
    cc.g.log = log;
    cc.g.clone = clone;
    // 定时器id
    cc.g.timeoutId = null;

    window.GameConfig = require('GameConfig');

    initLocalStorage();

    let Utils = require('Utils');
    cc.g.utils = new Utils();
    window.FIXNUM = cc.g.utils.fixNum;
    window.REALNUM = cc.g.utils.realNum;

    let LoadingMgr = require('LoadingMgr');
    cc.g.loadingMgr = new LoadingMgr();

    let HotUpdateMgr = require('HotUpdateMgr');
    cc.g.hotUpdateMgr = new HotUpdateMgr();

    let PBHelper = require('PBHelper');
    window.pbHelper = new PBHelper();

    window.PHI = require('ProtoHelpInfo');

    let Global = require('Global');
    cc.g.global = new Global();

    let UserMgr = require('UserMgr');
    cc.g.userMgr = new UserMgr();

    cc.g.http = require("HTTP");

    let NetworkMgr = require('NetworkMgr');
    cc.g.networkMgr = new NetworkMgr();
    //cc.g.networkMgr.init();

    let VoiceMgr = require('VoiceMgr');
    cc.g.voiceMgr = new VoiceMgr();
    cc.g.voiceMgr.init();

    let AudioMgr = require('AudioMgr');
    cc.g.audioMgr = new AudioMgr();
    cc.g.audioMgr.init();

    let HallMgr = require('HallMgr');
    cc.g.hallMgr = new HallMgr();

    cc.g.pf={};
    cc.g.atlas={};
}

cc.Class({
    extends: cc.Component,
    properties: {
        // 普通图集
        comAtlas0: {
            default: null,
            type: cc.SpriteAtlas,
        },
        comAtlas1: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    onLoad: function () {
        cc.dlog = cc.log;
        cc.log = console.log;

        // cc.director.setDisplayStats(true);

        //初始化管理器
        initMgr(this);

        this.initMsgStrCfg();
        
        cc.g.voiceMgr.setVoiceStateCB((uid, sta, dur)=>{
            cc.log(`on voiceMgr VoiceStateCB, uid: ${uid}, sta: ${sta}`);
            let a = cc.g.hallMgr.curGameMgr;
            a && a.onVoiceState && a.onVoiceState(uid, sta, dur);
        });

        let manifest = cc.urlraw('project.manifest');
        cc.log('project.manifest: ', manifest);

        cc.g.atlas.com0 = this.comAtlas0;
        cc.g.atlas.com0.addRef();
        cc.g.atlas.com1 = this.comAtlas1;
        cc.g.atlas.com1.addRef();

        cc.g.utils.setCanvasFit();

        // //原生平台, 设置游戏不休眠
        // if(cc.isMobile()) {
        //     cc.Device.setKeepScreenOn(true);
        // }

        //设置JS环境初始化完成
        cc.g.utils.setJSEnvInited();

        //初始化微信
        cc.g.utils.registerWXApp('wxf576910b3d15e355', 'https://recharge.newenerg.cn/txcg/');//wx386635bc43b66196 wxf576910b3d15e355
        cc.g.utils.initLocation();

        this.curStep = 0;
        this.curStepEnd = true;
        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);
        this.Node_loginanm = this.node.getChildByName('Node_loginanm');
        this.Node_loginanm.active = false;

        // ios定位服务关闭状态的次数
        cc.g.iosLocSvrClosedTms = cc.sys.localStorage.getItem('iosLocSvrClosedTms');
        cc.g.iosLocSvrClosedTms = cc.g.iosLocSvrClosedTms || 0;

        let localVersion = cc.sys.localStorage.getItem('currentVersion');
        if(localVersion != null ) {
            let localBuildVersion = localVersion.substr(0, localVersion.lastIndexOf("."));
            if(localBuildVersion !=  cc.sys.curBuildVersion) {
                cc.log('本地构建版本 和 安装包构建版本 不一致 应该是安装了新包');
                cc.log('localVersion', localVersion);
                cc.log('cc.sys.curBuildVersion', cc.sys.curBuildVersion);

                cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
                localVersion = GameConfig.gameVersion;

                cc.sys.localStorage.removeItem('HotUpdateSearchPaths');
                if (window.jsb) {
                    jsb.fileUtils.removeDirectory(this.storagePath);
                }

                // this.textLabel.string = '检测到覆盖安装 立即重启游戏';
                // this.scheduleOnce(()=>{
                //     cc.game.restart();
                // }, 0.5);
            }
        } else {
            cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
            localVersion = GameConfig.gameVersion;
        }

        //
        if (window.jsb) {
            let searchPaths = jsb.fileUtils.getSearchPaths();
            cc.log('每次启动检测 资源检索路径 searchPaths', searchPaths);
        }

        this.node.getChildByName('version').getComponent(cc.Label).string = '版本号 ' + localVersion;

        let isttq = cc.sys.localStorage.getItem('isTeaYaoqing');
        GameConfig.isTeaYaoqing = (isttq == 'true');
    },

    start: function () {
        //cc.director.loadScene('loading', (err, scene) => {
        //cc.g.loadingMgr.startLoading(LoadingMgr.Type.Start);
        //});
    },


    // 初始化 消息号 错误码信息 配置
    initMsgStrCfg: function () {
        cc.log('initMsgStrCfg');

        if (cc.g.msgCodeIfo){
            return;
        }

        cc.resources.load("config/enum", function (err, jsonf) {
            cc.g.jsonData = {};
            cc.g.jsonData[jsonf._name] = jsonf;

            cc.g.msgCodeIfo = {};
            cc.g.msgCodeIfo.com = {};
            cc.g.msgCodeIfo.err = {};
    
            // "9":{"id":9,"type":0,"num":1010,"tip":"帐号名已经存在"},
            let mci = cc.g.utils.getJson('enum');
            for (let k in mci) {
                let e = mci[k];
    
                if (e.type == 1) {
                    cc.g.msgCodeIfo.com[e.num] = e.tip;
                } else {
                    cc.g.msgCodeIfo.err[e.num] = e.tip;
                }
            }
        });
    },

    updateStep: function () {
        switch (this.curStep) {
            case 0:
                cc.log('load message box.');
                cc.resources.load('prefabs/message_box', (err, prefab_load) => {
                    if (err) {
                        cc.log("load message_box error.");
                        this.textLabel.string = '加载控件错误';
                        return false;
                    }
                    this.curStepEnd = true;
                    cc.g.global.messageBoxPrefab = prefab_load;
                    cc.g.hallMgr.initEvent();
                    this.textLabel.string = '加载控件完成';
                });
                this.textLabel.string = '正在加载控件';
                this.textLabel.node.active = true;
                this.Node_loginanm.active = false;
                break;
            case 1:
                this.textLabel.string = '准备加载配置';
                this.checkConfig();
                this.textLabel.string = '正在加载配置';
                break;
            case 2:
                cc.log('load waiting connection.');
                cc.resources.load('prefabs/waiting_connection', (err, prefab_load) => {
                    if (err) {
                        cc.log("load waiting_connection error.");
                        return false;
                    }
                    this.curStepEnd = true;
                    cc.g.global.waitingConnectionPrefab = prefab_load;
                });
                this.textLabel.string = '准备网络连接';
                break;
            case 3:
                //cc.sys.localStorage.clear();
                cc.log('load proto.');
                // pbHelper.loadFile('resources/proto', 'protocol');
                pbHelper.loadFile('proto', 'protocol', ()=>{
                    this.curStepEnd = true;
                });
                this.textLabel.string = '正在加载协议';
                break;
            case 4:
                if (this.checkLogin()) {
                    //this.textLabel.string = '正在登录';
                    this.textLabel.node.active = false;
                    this.Node_loginanm.active = true;

                    //this.curStepEnd = true;
                }
                break;
        }
    },


    //检查配置文件
    checkConfig: function () {
        if ((cc.sys.platform === cc.sys.WECHAT_GAME) ||(cc.sys.isNative && GameConfig.checkRemoteConfig)) {
            let self = this;

            // let devModeStr = cc.sys.localStorage.getItem('devMode');
            // let isDevMode = false;
            // if (devModeStr != null) {
            //     isDevMode = (parseInt(devModeStr) === 1 ? true : false);
            // }

            let platform = '';
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                platform = 'android';
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                platform = 'ios';
            } else if (cc.sys.os === cc.sys.OS_WINDOWS) {
                platform = 'android';
            }

            let dm = 2;
            if (cc.sys.curDevMode === 'debug') {
                cc.log('内部包');
            } else {
                cc.log('外部包');
                dm = 1;
            }

            //从服务器获取网关地址 1正式2测试 http://120.77.173.104:10100/getGiveClientInfo?userid=10&platform=ios&ty=1

            let uuid = null;
            let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
            if (lastPlatform != null && lastPlatform !== '') {
                if (lastPlatform == '1') {
                    let guestData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('guestData'))//JSON.parse(cc.sys.localStorage.getItem('guestData'));
                    uuid = guestData.uuid;
                } else if (lastPlatform == '2') {
                    let userData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('userData'))//JSON.parse(cc.sys.localStorage.getItem('userData'));
                    uuid = userData.uuid;
                } else if (lastPlatform == '3') {
                    let wxData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxData'))//JSON.parse(cc.sys.localStorage.getItem('wxData'));
                    uuid = wxData.uuid;
                } else if (lastPlatform == '4') {
                    let wxMinData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxMinData'))//JSON.parse(cc.sys.localStorage.getItem('wxMinData'));
                    uuid = wxMinData.uuid;
                } else if (lastPlatform == '5') {
                    let phoneData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('phoneData'))//JSON.parse(cc.sys.localStorage.getItem('wxMinData'));
                    uuid = phoneData.uuid;
                }
            }

            cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + '/getGiveClientInfo', {userid: uuid?uuid:11, platform: platform, ty: dm}, function (config) {
                cc.log('RemoteConfig1', config);
                self.setGameConfig(config);
            }, function () {
                self.textLabel.string = '加载配置失败，正在重新加载';

                cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + '/getGiveClientInfo', {userid: uuid?uuid:11, platform: platform, ty: dm}, function (config) {
                    cc.log('RemoteConfig2', config);
                    self.setGameConfig(config);
                }, function () {
                    self.textLabel.string = '重新加载配置失败，即将以本地配置进入游戏';

                    self.scheduleOnce(()=>{
                        let localVersion = cc.sys.localStorage.getItem('currentVersion');
                        if (localVersion == null) {
                            cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
                        }
                        self.curStepEnd = true;
                    }, 1);
                });
            });
        } else {
            let localVersion = cc.sys.localStorage.getItem('currentVersion');
            if (localVersion == null) {
                cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
            }
            this.curStepEnd = true;
        }
    },


    setGameConfig: function (config) {
        if(config.maintenance === 1) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', config.maintenanceNotice);
            return;
        }

        //如果本地版本大于远程版本自动打开调试模式
        let remoteBuildVersion = config.version.substr(0, config.version.lastIndexOf("."));
        let rbv = remoteBuildVersion.split('.');
        let cbv = cc.sys.curBuildVersion ? cc.sys.curBuildVersion.split('.') : rbv;
        if (parseInt(rbv[0]) < parseInt(cbv[0]) || (parseInt(rbv[0]) == parseInt(cbv[0]) && parseInt(rbv[1]) < parseInt(cbv[1]))) {
            //this.setDevMode(true);
            //this.checkConfig();
            //return;
        }

        //////////////////////////////////////
        GameConfig.hotUpdateEnable = (config.hotUpdateEnable === 1) ? true : false;
        GameConfig.hotUpdateUrl = config.hotUpdateUrl;
        GameConfig.subGameUrl = config.subGameUrl || GameConfig.subGameUrl;
        GameConfig.miniGameUrl = config.miniGameUrl || GameConfig.miniGameUrl;
        //(cc.sys.curDevMode !== 'debug') && (GameConfig.wsAddress = config.wsAddress.split(';'));
        GameConfig.wsAddress = config.wsAddress.split(';');
        GameConfig.loginMode = config.loginMode;
        GameConfig.gamesSeq = config.gamesSeq;
        GameConfig.rechargeMode = config.rechargeMode;
        GameConfig.downloadUrl = config.downloadUrl;
        GameConfig.shareUrl = config.shareUrl;
        GameConfig.shareTitle = config.shareTitle;
        GameConfig.shareDesc = config.shareDesc;
        GameConfig.applyUrl = config.applyUrl;
        GameConfig.officialWebsite = config.officialWebsite;
        let wxh = config.complainWX.split('|');
        GameConfig.complainWX = wxh[0] || GameConfig.complainWX;
        GameConfig.storeWX = wxh[1] || GameConfig.storeWX;

        if (config.hallGames) {
            GameConfig.hallGames = [];
            let grps = config.hallGames.split('|');
            grps.forEach(e => {
                GameConfig.hallGames.push(e.split(';'));
            });
        }
        

        // 白名单数据
        if (!cc.g.isTester) {
            if (config.whiteList) {
                GameConfig.whiteList = config.whiteList.split(',');
            } else {
                cc.log('没有远程白名单数据，使用本地白名单数据');
            }
        }

        let remoteVer = config.version;
        if (cc.sys.useTestVer) {
            remoteVer = config.testVersion || '0.0.0';
        }
        
        if (cc.sys.curBuildVersion && GameConfig.hotUpdateEnable) {
            cc.g.hotUpdateMgr.hotUpdateCb = this.hotUpcb.bind(this);
            cc.g.hotUpdateMgr.checkVersion(remoteVer, () => {
                this.curStepEnd = true;
            });
        } else {
            let localVersion = cc.sys.localStorage.getItem('currentVersion');
            if (localVersion == null) {
                cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
            }

            this.curStepEnd = true;
        }
    },
    hotUpcb: function (info, data) {
        if (info == 'UPDATE_PROGRESSION') {
            let bfb = data.cur / data.total;
            let cur = Math.floor(data.cur / 1024);
            let total = Math.floor(data.total / 1024);
            this.textLabel.string = `正在下载 (${cur}KB/${total}KB) (${(bfb*100).toFixed(2)}%)`;
        } else if (info == 'UPDATE_FINISHED') {
            this.textLabel.string = '已经更新完毕, 即将重启游戏.';
            this.scheduleOnce(()=>{
                cc.game.restart();
            }, 1.0);
        }
    },

    checkLogin: function () {
        cc.log('user login.');

        let isAutoLogin = false;
        let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
        if (lastPlatform != null && lastPlatform !== '') {
            let userData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('userData'))//JSON.parse(cc.sys.localStorage.getItem('userData'));
            let guestData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('guestData'))//JSON.parse(cc.sys.localStorage.getItem('guestData'));
            let wxData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxData'))//JSON.parse(cc.sys.localStorage.getItem('wxData'));
            let wxMinData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('wxMinData'))//JSON.parse(cc.sys.localStorage.getItem('wxMinData'));
            let phoneData = cc.g.utils.parseJsonStr(cc.sys.localStorage.getItem('phoneData'));

            if ((lastPlatform == PB.PLATFORM.GUEST && guestData != null)
                || (lastPlatform == PB.PLATFORM.ACCOUNT && userData != null)
                || (lastPlatform == PB.PLATFORM.WECHAT && wxData != null)
                || (lastPlatform == PB.PLATFORM.WECHAT_GAME && wxMinData != null)
                || (lastPlatform == PB.PLATFORM.PHONE && phoneData != null)) {
                isAutoLogin = true;
            }
        }

        if (isAutoLogin) {
            cc.g.userMgr.autoLogin(() => {
                cc.director.loadScene('loading', (err, scene) => {
                    cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                });
            }, false);
        } else {
            cc.director.loadScene('login', (err, scene) => {
                cc.log('进入登录场景.')
            });
        }
        return isAutoLogin;
    },

    update(dt) {
        if (this.curStepEnd) {
            this.curStepEnd = false;
            this.updateStep();
            this.curStep++;
        }
    },


    //开启调试模式
    // checkDevMode: function () {
    //     let devModeStr = cc.sys.localStorage.getItem('devMode');
    //     this.isDevMode = false;
    //     if (devModeStr != null) {
    //         this.isDevMode = (parseInt(devModeStr) == 1 ? true : false);
    //     }
    //     let devModeNode = this.node.getChildByName('dev_mode');
    //     devModeNode.getComponent(cc.Label).string = this.isDevMode ? '调试模式' : '          ';
    // },

    // setDevMode: function (b) {
    //     let devModeNode = this.node.getChildByName('dev_mode');
    //     devModeNode.getComponent(cc.Label).string = b ? '调试模式' : '          ';
    //     cc.sys.localStorage.setItem('devMode', b ? '1' : '0');
    //     this.isDevMode = b;
    // },

    // onClickDevMode: function () {
    //     if (this.isDevMode) {
    //         this.setDevMode(false);
    //         return;
    //     }
    //     if (this.devModeClickCnt == null) {
    //         this.devModeClickCnt = 0;
    //         this.devModeClickPreClickTime = 0;
    //     }
    //     if (Date.now() - this.devModeClickPreClickTime >= 5000) {
    //         this.devModeClickCnt = 0;
    //     }
    //     if (this.devModeClickCnt > 1 && this.devModeClickCnt % 3 === 1) {
    //         if (Date.now() - this.devModeClickPreClickTime >= 2000) {
    //             this.devModeClickCnt++;
    //             this.devModeClickPreClickTime = Date.now();
    //         }
    //         else {
    //             this.devModeClickCnt = 0;
    //             this.devModeClickPreClickTime = 0;
    //         }
    //     }
    //     else {
    //         if (this.devModeClickCnt === 0 || Date.now() - this.devModeClickPreClickTime <= 1000) {
    //             this.devModeClickCnt++;
    //             this.devModeClickPreClickTime = Date.now();
    //         }
    //         else {
    //             this.devModeClickCnt = 0;
    //             this.devModeClickPreClickTime = 0;
    //         }

    //     }
    //     if (this.devModeClickCnt > 10) {
    //         this.devModeClickCnt = 0;
    //         this.devModeClickPreClickTime = 0;
    //         this.setDevMode(true);
    //     }
    // },

    /* =============================================================================================== */

    bf: function () {
        {/*
            self.checkDevMode();
                //self.textLabel.string = '加载配置失败，正在重新加载';
                cc.g.http.sendRequest('GET', GameConfig.gameConfigBakUrl + 'config.json', {n: (new Date()).valueOf()}, function (config) {
                    if(config.useBakConfig) {
                        GameConfig.useGameConfigBak = true;
                        let configUrl = GameConfig.gameConfigBakUrl;
                        configUrl += (platform + '/');
                        configUrl += (isDevMode? 'config_dev.json' : 'config_pro.json');
                        cc.g.http.sendRequest('GET', configUrl, {n: (new Date()).valueOf()}, function (config) {
                            self.setGameConfig(config);
                        }, function () {
                            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '连接服务器失败。');
                        });
                    }
                    else {
                        GameConfig.gameConfigUrl = config.gameConfigUrl;
                        cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + 'service-admin/agentDetail/getGameConfig', {environment:isDevMode?'dev':'pro', platform: platform},function (config) {
                            self.setGameConfig(config.data[0]);
                        }, function () {
                            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '连接服务器失败。');
                        });
                    }
                }, function () {
                    cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '连接服务器失败。');
                });
        */}
    },
});
