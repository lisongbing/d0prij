let MenuPrefab = cc.Class({
    name: 'MenuPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

let devStr = '正在装修，择日开放！';

cc.Class({
    extends: cc.Component,

    properties: {
        // 普通图集
        interactAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        // 
        dlgShenfenReg: {
            default: null,
            type: cc.Prefab,
        },


        //
        hintPf: {
            default: null,
            type: cc.Prefab,
        },
        loadingPre: {
            default: null,
            type: cc.Prefab,
        },

        // 大厅游戏
        hallGmitem: {
            default: null,
            type: cc.Prefab,
        },

        // game base 里所以子游戏通用的属性
        dialogPrefab: {
            default: null,
            type: cc.Prefab,
        },
        hintPrefab: {
            default: null,
            type: cc.Prefab,
        },
        // 解散房间
        jieSanPf: {
            default: null,
            type: cc.Prefab,
        },
        // 聊天动画表情
        chatAnmEmojiPf: {
            default: null,
            type: cc.Prefab,
        },
        // 互动表情
        interactPf: {
            default: null,
            type: cc.Prefab,
        },
        // 互动表情动画
        interactAnmPf: {
            default: null,
            type: cc.Prefab,
        },
        // 亲友圈邀请
        qyqyqPf: {
            default: null,
            type: cc.Prefab,
        },
        // 回放
        PfBackPlay: {
            default: null,
            type: cc.Prefab,
        },
        // 登录广告
        PfNotice: {
            default: null,
            type: cc.Prefab,
        },

        // 个人信息
        PfUserIfo: {
            default: null,
            type: cc.Prefab,
        },
        
        
        // game base 里所以子游戏通用的属性

        dlgPrefabs: {
            default: [],
            type: [MenuPrefab],
        },

        inGameMenuPrefabs: {
            default: null,
            type: cc.Prefab,
        },

        menuRoot: cc.Node,
    },

    dbgstr: function (info) {
        let s = '大厅'; //d2Page

        if (info) {
            return s + ' :: ' + info;
        }

        return s + ' ';
    },


    onLoad: function () {
        cc.g.isinLogin = false;

        cc.g._tea_ = null;

        cc.director.getScheduler().setTimeScale(1);

        cc.g.utils.setCanvasFit();

        cc.g.audioMgr.playBGM('public/bg_game.mp3');

        cc.g.hallMgr.hall = this;
        this.firstEnterHall = !cc.g.hallMgr.inited;
        cc.g.hallMgr.init();
        this.mainNode = this.node.getChildByName('main');
        this.menuNode = {};
        //this.btnActivity = this.mainNode.getChildByName('btn_activity');
        this.noticeText = this.mainNode.getChildByName('notice').getChildByName('text');
        this.curNoticeIndex = -1;
        this.hallPreventView = this.node.getChildByName('hall_preventView');

        // ----------------------------------------------------------
        cc.g.pf.hint = this.hintPf;
        cc.g.pf.loadingPre = this.loadingPre;
        cc.g.pf.dialogPrefab = this.dialogPrefab;
        cc.g.pf.hintPrefab = this.hintPrefab;
        cc.g.pf.jieSanPf = this.jieSanPf;
        cc.g.pf.chatAnmEmojiPf = this.chatAnmEmojiPf;
        cc.g.pf.interactPf = this.interactPf;
        cc.g.pf.interactAnmPf = this.interactAnmPf;
        cc.g.pf.qyqyqPf = this.qyqyqPf;
        cc.g.pf.PfBackPlay = this.PfBackPlay;
        

        cc.g.atlas.interact = this.interactAtlas;
        // ----------------------------------------------------------

        this.curAreaID = 2;

        if (!cc.g.check_Permission) {
            cc.g.check_Permission = true;

            if (cc.g.utils.checkExternalStorage()) {
                cc.g.utils.checkLocationPermission();
            }
            
            // cc.g.utils.startLocation((loc)=>{
            //     cc.log('启动后 第一次刷新GPS', loc);
            // }, true);
        }

        this.loadView();

        // 初始化通用配置 718 639 229
        this.initComCfg();
        // 初始化大厅游戏配置
        this.initHallGameCfg();

        //
        //this.changShowRoomCard(cc.g.areaInfo.defoped.id);

        this.setPlayerInfo();

        if (this.firstEnterHall) {
            if (cc.g.userMgr.roomId != 0) {
                cc.log("第一次进入大厅 有游戏ID %d, 应该是断线重连", cc.g.userMgr.roomId);
                cc.g.hallMgr.joinRoom(-1, cc.g.userMgr.roomId, true);
            } else if(cc.g.userMgr.inviteJoinRoomId != 0) {
                cc.g.hallMgr.joinRoom(-1, cc.g.userMgr.inviteJoinRoomId);
            }
        }
        
        //创建inGameMenu
        if (cc.g.hallMgr.inGameMenu == null) {
            cc.g.hallMgr.inGameMenu = cc.instantiate(this.inGameMenuPrefabs).getComponent('InGameMenu');
            cc.g.hallMgr.inGameMenu.node.active = false;
            cc.game.addPersistRootNode(cc.g.hallMgr.inGameMenu.node);

            cc.g.hallMgr._inGameMenuPrefabs = this.inGameMenuPrefabs;
        }

        //this.checkDevMode();

        this.upListGame();

        //设置招商信息
        //this.setRecruitment();

        //显示新手、公告
        if (this.firstEnterHall) {
            if (cc.g.userMgr.isNew && GameConfig.loginMode !== (1 << PB.PLATFORM.WECHAT)) {
                //this.showMenu('newbie');
            } else {
                let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
                if (lastPlatform == PB.PLATFORM.GUEST) {
                    //this.showMenu('newbie');
                } else {
                    //this.showMenu('notice').getComponent('Notice').init(3);
                }
            }
        } else {
            if(cc.g.userMgr.receivedShareNtf) {
                cc.g.userMgr.receivedShareNtf = false;
                cc.g.hallMgr.shareRewardNtf();
            }
        }

        cc.g.hallMgr.getHallNotice();
        
        this.checkRedDot();
        this.updateActivity();

        cc.g.utils.isLocing = false;

        // // 处理进入大厅的跳转
        if (!this.tryJumpTo()) {
            //this.showMenu('newbie');
        }

        // 白名单检测
        if (!cc.g.isTester) {
            // this.scheduleOnce(()=>{
            //     this.checkDbgForTester();
            // }, 1.0);
        }

        if (cc.g.ggjiesan) {
            cc.g.global.hint('解散茶馆');
        }

        this.shenfenReg();

        cc.g.utils.stopScreenshotListen();

        // if (!cc.g.isLoadTea) {
        //     cc.director.preloadScene('tea_quan', null, null);
        //     cc.director.preloadScene('tea', null, null);
        //     cc.g.isLoadTea = true;
        // }

        // app 版本更新
        cc.g.utils.checkNativeAppHaveNewVersion(GameConfig.gameConfigUrl + '/getPackageConfig');
    },
    checkDbgForTester () {
        cc.log('GameConfig.whitelist', GameConfig.whiteList);

        if (!GameConfig.whiteList || GameConfig.whiteList.length <= 0) return;

        let isTester = false;
        for (let i = 0; i < GameConfig.whiteList.length; i++) {
            if (eq64(GameConfig.whiteList[i], cc.g.userMgr.userId)) {
                isTester = true;
                break;
            }
        }

        if (!isTester) return;

        cc.sys.localStorage.setItem('isTester', 'true');

        cc.g.global.hint('检测到白名单，重启切换测试环境，2秒后自动重启');

        this.scheduleOnce(()=>{
            // cc.game.restart();
        }, 2.0);
    },

    start () {
    },
    loadView: function () {
        let r = this.node;

        // 菜单按钮
        // this.bottom_ui_menu = cc.find("main/bottom_ui/menu", r);
        // this.bottom_ui_menu.on('touchstart', ()=>{
        //     this.skpClcSwa = true;
        //     this.scheduleOnce(()=>{
        //         this.skpClcSwa = false;
        //     }, 0.1);
        // });

        // 按钮菜单
        // this.mbssta = false;

        // 房卡列表
        this.Node_fklist = cc.find("Node_fklist", r);
        this.Node_fklist.active = false;
        //this.Node_fkspr = cc.find("main/card_icon/hall_card", r);

        this.Label_qyqname = cc.find("main/Sprite_bg0/btn_club/bg/Label_qyqname", this.node).getComponent(cc.Label);
        let teaname = cc.g.utils.getLocalStorage('teaname');
        this.Label_qyqname.string = (!teaname||teaname=='' ? '亲友圈' : teaname);

        // 商城按钮
        if (false) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                let btn_store = cc.find("main/bottom_ui/store", r);
                btn_store.active = false;
            }
        }

        // ad btn
        let emptyNode = cc.find("main/BtnLayout/EmptyButton", this.node);
        emptyNode.active = cc.g.utils.getWeChatOs()

        // 全屏点击穿透 beganCall endCall
        this.clcSwallow = cc.find("ClickSwallow", r).getComponent('ClickSwallow');
        this.clcSwallow.node.active = false;
        this.clcSwallow.beganCall = function(){
            //cc.log('clcSwallow');
            if (this.skpClcSwa) {
                return;
            }

            this.upListGame(true);

            //this.Node_fklist.active = false;
            this.clcSwallow.node.active = false;
        }.bind(this);
    },


    /* ======================================================================================================================== */
    /* ======================================================================================================================== */
    /* ======================================================================================================================== */

    // 初始化通用配置
    initComCfg: function () {
        // 初始化地区信息
        this.initAreaInfo();

        // 初始化互动表情
        this.initInteractEmoji();

        // 初始游戏规则信息
        this.initGameRuleInfo();
    },
    // 初始化地区信息
    initAreaInfo: function () {
        if (cc.g.areaInfo){
            return;
        }

        cc.g.areaInfo = {};
        cc.g.areaInfo.oped = {};

        // "1":{"id":1,"origin":"长宁","game":[9,10,11],"open":1,"show":0},
        let Origin = cc.g.utils.getJson('BigTwoOrigin');
        let _1 = null;
        for (let k in Origin) {
            let e = Origin[k];
            let a = {};
            a.id = e.id;
            a.name = e.origin;
            a.game = e.game;
            a.isOpen = e.open;
            a.isDef = e.show;
            cc.g.areaInfo[a.id] = a;

            if (a.isOpen) {
                cc.g.areaInfo.oped[a.id] = a;

                (!_1) && (_1=a);
                (a.isDef) && (cc.g.areaInfo.defoped = a);
            }
        }
    },
    // 初始化互动表情
    initInteractEmoji: function () {
        if (cc.g.interactEmoji){
            return;
        }

        cc.g.interactEmoji = {};

        // "2":{"ID":2,"ShopID":2},
        let cfg = cc.g.utils.getJson('InteractEmoji');
        for (let k in cfg) {
            cfg[k].ID = parseInt(k);
            cc.g.interactEmoji[k] = cfg[k];
        }
    },
    // 初始游戏规则信息
    initGameRuleInfo: function () {
        if (cc.g.gmRuleInfo){
            return;
        }

        cc.g.gmRuleInfo = {};

        // 9: {ID: 9, ruleInfo: Array(34)}
        // ruleInfo: (34) ["1,加底", "2,不加底", "3,无封顶", ... "33,均摊房费", ""]
        let rulefile = cc.g.utils.getJson('BigTwoRule');

        for (const t in GMGrp) {
            const idseq = GMGrp[t];
            idseq.forEach(id => {
                if (!rulefile[id]) {
                    return;
                }

                let r = rulefile[id];
                let info = {}
                for (let i = 0; i < r.ruleInfo.length; ++i) {
                    const e = r.ruleInfo[i];
                    const kv = e.split(',');

                    if (kv[0] && kv[0]!='') {
                        info[kv[0]] = kv[1];
                    }
                }

                cc.g.gmRuleInfo[id] = info;
            });
        }
    },
    // 初始化大厅游戏配置
    initHallGameCfg: function () {
        // 开放游戏
        let open = {};
        GameConfig.gamesSeq.forEach(e => open[e] = true);

        // 服务器后台游戏
        let hg = [];
        GameConfig.hallGames.forEach(elm => {
            let hge = [];
            elm.forEach(e => {
                let d = e.split(',');
                if (open[d[0]] || (d.length==1 && hge.length>0)) hge.push(e);
            });

            if (hge.length>0) hg.push(hge);
        });
        GameConfig.hallGames = hg;

        let svr = {};
        let hgms = GameConfig.hallGames;
        hgms.forEach(elm => {
            elm.forEach(e => {
                let d = e.split(',');
                if (d.length < 4) return;
                if (d[3]!='1') svr[`${d[0]},${d[1]}`] = true;
            });
        });

        cc.log('hallGames', GameConfig.hallGames);

        // 可添加的游戏
        let add = [];
        for (const t in GMGrp) {
            const idseq = GMGrp[t];
            idseq.forEach(id => {
                if (!open[id]) return;

                cc.g.hallMgr.upCreateInfo(id);
                let crtInfo = cc.g.hallMgr.crtRoomInfo[id];
                if (!crtInfo) {
                    cc.log('initHallGameCfg 没有游戏配置 '+t+' '+id);
                    return;
                }

                let tp = 0;
                if (t=='mahjong') {
                    tp = 1;
                } else if (t=='poker') {
                    tp = 2;
                }

                // 该游戏的所有地区
                for (const ori in crtInfo.comArea.v) {
                    if (svr[`${id},${ori}`]) continue;

                    let nm = cc.g.utils.getGameName(id, ori);

                    if (nm && nm!='') {
                        add.push(`${id},${ori},${tp}|${nm}`); 
                    }
                }
            });
        }

        GameConfig.addGames = add;
        cc.log('addGames', GameConfig.addGames);

        // 用户添加的游戏
        let user = cc.sys.localStorage.getItem('userAddGames');
        if (!user) return;

        let ugms = [];
        let list = user.split('|');
        list.forEach(e => {
            let d = e.split(',');

            if (!open[d[0]]) return;

            if (svr[`${d[0]},${d[1]}`]) return;
            ugms.push(e);
        });

        cc.sys.localStorage.setItem('userAddGames', ugms.join('|'));

        GameConfig.userGames = ugms;
        cc.log('userGames', GameConfig.userGames);
    },

    /* ======================================================================================================================== */
    /* ======================================================================================================================== */
    /* ======================================================================================================================== */

    updateHallNotice: function () {
        if(cc.g.hallMgr.notices != null && cc.g.hallMgr.notices.length > 0 && this.curNoticeIndex === -1) {
            if (this.noticeCallFunc == null) {
                this.curNoticeIndex = Math.floor(Math.random() * cc.g.hallMgr.notices.length);
                this.noticeText.getComponent(cc.Label).string = cc.g.hallMgr.notices[this.curNoticeIndex].content;
                this.noticeText.x = this.noticeText.parent.width + 100;

                this.noticeCallFunc = function () {
                    this.noticeText.x -= 1;
                    if (this.noticeText.x < -this.noticeText.width - 10) {
                        if(cc.g.hallMgr.notices != null && cc.g.hallMgr.notices.length > 0) {
                            this.noticeText.x = this.noticeText.parent.width + 100;
                            this.curNoticeIndex++;
                            if (this.curNoticeIndex >= cc.g.hallMgr.notices.length) {
                                this.curNoticeIndex = 0;
                            }
                            this.noticeText.getComponent(cc.Label).string = cc.g.hallMgr.notices[this.curNoticeIndex].content;
                        } else {
                            this.curNoticeIndex = -1;
                            this.unschedule(this.noticeCallFunc);
                        }
                    }
                }
            }

            this.schedule(this.noticeCallFunc, 1 / 60);
        }
    },

    updateActivity: function () {
        //this.btnActivity.active = (cc.g.hallMgr.activityList.length > 0);
    },

    // 身份登记
    shenfenReg: function () {
        cc.log('shenfenReg 身份登记');

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.log('WECHAT_GAME 跳过');
            this.popGuangGao();
            return;
        }

        if (!cc.g._sfdjtms) {
            cc.g._sfdjtms = 0;
        }

        if (!cc.sys.needShenfenReg) {
            if (cc.g._sfdjtms > 0) {
                cc.log('_sfdjtms', cc.g._sfdjtms);
                cc.log('needShenfenReg');
                return;
            }
        }
        
        cc.g.isShenfenReg = (cc.g.userMgr.bindSFZ || !cc.g.userMgr.isNeedBingSFZ);

        if (cc.g.isShenfenReg) {
            this.popGuangGao();
            return;
        }

        let pfb = cc.instantiate(this.dlgShenfenReg);
        this.node.addChild(pfb);

        ++cc.g._sfdjtms;

        return;
    },

    // 弹出广告
    popGuangGao: function () {
        cc.log('popGuangGao 弹出广告');

        if (!cc.g.ggList) {
            cc.g.ggList = [
                //{name:'wgxs', pop:0}, //外挂悬赏
            ];
        }

        let pfb = cc.instantiate(this.PfNotice);
        this.node.addChild(pfb);
    },

    // 处理进入大厅的跳转
    tryJumpTo: function () {
        // // 俱乐部跳转
        // if (cc.g.hallMgr.backToClubIfo) {
        //     cc.log(this.hallPreventView)
        //     this.hallPreventView.active = true;
        //     this.showMenu('club').getComponent('Club').up();
        //     cc.g.hallMgr.backToClubIfo = null;
        //     return true;
        // }

        // 战绩跳转
        if (cc.g.hallMgr.backToPlayHistory) {
            this.onBtnZhanji();

            cc.g.hallMgr.backToPlayHistory = null;
            return true;
        }

        return false;
    },

    // 更新大厅展示的游戏列表
    upListGame: function (justshow) {
        if (!this.svGames) {
            this.svGames = this.mainNode.getChildByName('games').getComponent(cc.ScrollView);
            this.svGrpGames = this.node.getChildByName('grpGames').getComponent(cc.ScrollView);
        }

        this.svGames.node.active = true;
        this.svGrpGames.node.active = false;

        if (justshow) {
            return;
        }

        let sv = this.svGames;
        let ctt = sv.content;
        ctt.destroyAllChildren();

        // 比赛入口
        if (false) {
            let gi = cc.instantiate(this.hallGmitem);
            gi.getComponent('hallGmitem').set({isBisai:true});
            ctt.addChild(gi);
        }

        // 配置好的固定的游戏
        GameConfig.hallGames.forEach(e => {
            let gi = cc.instantiate(this.hallGmitem);
            gi.getComponent('hallGmitem').set(e);
            ctt.addChild(gi);
        });

        // 用户自己选的游戏
        if (GameConfig.userGames) {
            GameConfig.userGames.forEach(e => {
                let gi = cc.instantiate(this.hallGmitem);
                gi.getComponent('hallGmitem').set([e]);
                ctt.addChild(gi);
            });
        }

        // 添加游戏
        let gi = cc.instantiate(this.hallGmitem);
        gi.getComponent('hallGmitem').set();
        ctt.addChild(gi);

        //sv.scrollToLeft();
    },
    // 更新大厅合集游戏
    upGroupGame: function (groupGames) {
        this.svGames.node.active = false;
        this.svGrpGames.node.active = true;
        this.clcSwallow.node.active = true;
        
        let sv = this.svGrpGames;
        let ctt = sv.content;
        ctt.destroyAllChildren();

        groupGames.forEach(e => {
            let gi = cc.instantiate(this.hallGmitem);
            gi.getComponent('hallGmitem').set([e]);
            ctt.addChild(gi);
        });

        sv.scrollToTop();

        return;
    },

    /* ======================================================================================================================== */
    /* ======================================================================================================================== */

    // 显示比赛界面
    upShowBisaiPage: function () {
        cc.log('upGroupGame 显示比赛界面');

        return;
    },

    /* ======================================================================================================================== */
    /* ======================================================================================================================== */

    // deprecated
    setGamesSeqAndShow: function () {
        // let gamesScrollView = this.mainNode.getChildByName('games').getComponent(cc.ScrollView);
        // let gamesNode = gamesScrollView.content;
        // let children = gamesNode.children;
        // let len = children.length;
        // let configGameLen = GameConfig.gamesSeq.length;
        // for (let i = 0; i < len; i++) {
        //     let gameId = parseInt(children[i].name);
        //     let j = 0;
        //     for (; j < configGameLen; j++) {
        //         if (gameId === GameConfig.gamesSeq[j]) {
        //             children[i].active = true;
        //             children[i].zIndex = j; //setLocalZOrder(j);
        //             break;
        //         }
        //     }
        //     if (j === configGameLen) {
        //         children[i].active = false;
        //     }
        // }

        // let bShowArrow = configGameLen  > 6;
        // let btnArrow = this.mainNode.getChildByName('btn_arrow');
        // btnArrow.active = bShowArrow;
        // if(bShowArrow) {
        //     gamesScrollView.node.on('scrolling', ()=>{
        //         if(gamesScrollView.content.x - 5 <= -gamesScrollView.node.width/2 + (gamesScrollView.node.width - gamesScrollView.content.width)) {
        //             btnArrow.active = false;
        //         }
        //         else {
        //             btnArrow.active = true;
        //         }
        //     }, this);
        // }

        // for (let i = 0; i < 4; i++) {
        //     children[i].active = true;
        // }
    },

    updatePlayerInfo: function () {
        let playerInfo = this.node.getChildByName('main').getChildByName('player_info');
        playerInfo.getChildByName('name').getComponent(cc.Label).string = cc.g.utils.getFormatName(cc.g.userMgr.userName, 7*2);//cc.g.utils.getFormatName(cc.g.userMgr.userName);
    },

    setPlayerInfo: function () {
        let nmain = this.node.getChildByName('main');
        nmain.getChildByName('gold_icon').getChildByName('gold_num').getComponent(cc.Label).string = cc.g.utils.realNum1(cc.g.userMgr.gold);
        nmain.getChildByName('card_icon').getChildByName('card_num').getComponent(cc.Label).string = cc.g.userMgr.roomCard[this.curAreaID-1].toString();
        
        let playerInfo = cc.find("main/player_info", this.node);
        playerInfo.getChildByName('name').getComponent(cc.Label).string = cc.g.utils.getFormatName(cc.g.userMgr.userName, 7*2);//cc.g.utils.getFormatName(cc.g.userMgr.userName);
        playerInfo.getChildByName('id').getComponent(cc.Label).string = cc.g.userMgr.userId.toString();
        //playerInfo.getChildByName('diamond_icon').getChildByName('diamond_num').getComponent(cc.Label).string = cc.g.utils.getFormatNumString(REALNUM(cc.g.userMgr.diamond));

        let headSprite = cc.find("Node_headMask/head", playerInfo);

        if (cc.g.userMgr.icon.length > 4) {
            cc.g.utils.setUrlTexture(headSprite.getComponent(cc.Sprite), cc.g.userMgr.icon);
        } else {
            let spriteFrame = null;
            if (cc.g.userMgr.icon === '') {
                cc.resources.load('textures/head/head_animal_0', cc.SpriteFrame, function (err, asset) {
                    spriteFrame = asset;
                    headSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
                //spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            } else {
                cc.resources.load('textures/head/head_animal_' + cc.g.userMgr.icon, cc.SpriteFrame, function (err, asset) {
                    spriteFrame = asset;
                    headSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
                //spriteFrame = cc.loader.getRes('textures/head/head_animal_' + cc.g.userMgr.icon, cc.SpriteFrame);
            }
        }
    },

    updateMoney: function (type) {
        let nmain = this.node.getChildByName('main');
        let playerInfo = this.node.getChildByName('main').getChildByName('player_info');
        if (type == 1) {
            nmain.getChildByName('gold_icon').getChildByName('gold_num').getComponent(cc.Label).string = cc.g.utils.realNum1(cc.g.userMgr.gold);
        }
        if (type == 2) {
            nmain.getChildByName('card_icon').getChildByName('card_num').getComponent(cc.Label).string = cc.g.userMgr.roomCard[this.curAreaID-1].toString();
        }
        if (type == 3) {
            //playerInfo.getChildByName('diamond_icon').getChildByName('diamond_num').getComponent(cc.Label).string = cc.g.utils.getFormatNumString(REALNUM(cc.g.userMgr.diamond));
        }
    },

    onClickArrow: function () {
        let gamesScrollView = this.mainNode.getChildByName('games').getComponent(cc.ScrollView);
        gamesScrollView.scrollToRight(0.3);
    },

    //点击某个游戏
    onGameBtnClicked: function (event, customEventData) {
        let gn = customEventData;
        if (gn && gn.length > 0) {
            this.onClickCreateRoom(event, gn);
            return;
        }

        //cc.g.global.showTipBox(devStr);
        this.onClickCreateRoom(null, null);
        return;
    },

    //点击创建房间
    onClickCreateRoom: function (evt, grpName) {
        cc.log('onClickCreateRoom');

        cc.g.utils.btnShake();
        
        let dlg = this.showMenu('createRoomDlg');
        dlg.getComponent('CreateRoomDlg').openwith(grpName);
    },

    //点击加入房间
    onClickJoinRoom: function (evt, istea) {
        cc.log('onClickJoinRoom');
        cc.g.utils.btnShake();
        //this.showMenu('joinRoomDlg');
        this.showDlg('joinRoomDlg').getComponent('JoinRoom').setIsTea(istea);
    },

    enterRoomList: function (selected) {
        this.showMenu('room_list').getComponent('RoomList').init(selected);
        this.mainNode.active = false;
    },

    // 点击金币
    onClickGold: function () {
        cc.log('onClickGold 点击金币');

        // cc.g.global.showTipBox(devStr);

        // cc.assetManager.loadBundle('sg_01', /*{version: 'fbc07'},*/ function (err, bundle) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log('load bundle successfully.');

        //     bundle.loadScene('sg_01', function (err, scene) {
        //         cc.director.loadScene('sg_01');
        //     });
        // });

        return;

        this.showMenu('store').getComponent('Store').init(2);
    },
    // 点击房卡
    onClickRoomCard: function () {
        cc.log('onClickRoomCard 点击房卡');

        // cc.g.global.showTipBox(devStr);
        //return;

        //this.showMenu('store').getComponent('Store').init(4);

        //this.Node_fklist.active = true;
        //this.clcSwallow.node.active = true;

        //this.Node_fklist.getComponent('hall_fklist').up();
    },
    // 更换显示的房卡
    changShowRoomCard: function (id) {
        // if (!id) {
        //     return;
        // }

        // this.curAreaID = id;

        // cc.log('changShowRoomCard id', id);
        // //this.Node_fkspr.getComponent(cc.Sprite).spriteFrame = cc.g.atlas.com0.getSpriteFrame('com_img_fk_'+id);

        // let nmain = this.node.getChildByName('main');
        // nmain.getChildByName('card_icon').getChildByName('card_num').getComponent(cc.Label).string 
        // = 
        // cc.g.userMgr.roomCard[this.curAreaID-1].toString();
    },


    // checkDevMode: function () {
    //     let devModeStr = cc.sys.localStorage.getItem('devMode');
    //     this.isDevMode = false;
    //     if (devModeStr != null) {
    //         this.isDevMode = (parseInt(devModeStr) == 1 ? true : false);
    //     }
    //     let devModeNode = this.mainNode.getChildByName('dev_mode');
    //     devModeNode.getComponent(cc.Label).string = this.isDevMode ? '调试模式' : '          ';
    // },

    // setDevMode: function (b) {
    //     let devModeNode = this.mainNode.getChildByName('dev_mode');
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

    // 邮件
    enterMail: function () {
        //this.showMenu('mail').getComponent('Mail').init();

        cc.g.utils.btnShake();
        this.showDlg('mail').getComponent('Mail').init();
    },


    // 按钮菜单
    enterMenuBtns: function () {
        // this.skpClcSwa = true;
        // this.scheduleOnce(()=>{
        //     this.skpClcSwa = false;
        // }, 0.1);
    },


    enterCreateRoom: function () {
        this.showMenu('create_room').getComponent('CreateRoom').init(1);
    },

    enterJoinRoom: function () {
        this.showMenu('join_room');
    },

    // 设置
    enterSetting: function () {
        cc.g.utils.btnShake();

        //this.showMenu('setting').getComponent('dlgSetting').upSetting();
        this.showDlg('setting').getComponent('dlgSetting').upSetting();
    },

    // 战绩
    onBtnZhanji: function (event, customEventData) {
        cc.log(this.dbgstr('战绩'));

        cc.g.utils.btnShake();

        this.showDlg('playHistoryDlg').getComponent('playHistoryDlg').init();
    },

    // 分享
    enterShare: function () {
        cc.g.utils.btnShake();

        //cc.g.utils.shareCaptureScreenToWX(0, this);
        //cc.g.utils.shareURLToWX('title', 'description', '', GameConfig.shareUrl + '?inviter='+cc.g.userMgr.userId.toString(), 0);
        this.dlgshare = this.showDlg('share').getComponent('Share');
        this.dlgshare.init();
    },

    // 个人信息
    enterPersonal: function () {
        cc.log('enterPersonal 个人信息');

        // let eb = cc.find('New EditBox', this.node).getComponent(cc.EditBox);
        // let str = eb.string;
        // let num = cc.g.utils.strToNumber(str);
        // cc.log('num', num);

        //let pfb = cc.instantiate(this.dlgShenfenReg);
        //this.node.addChild(pfb);

        let dlg = cc.instantiate(this.PfUserIfo);
        this.menuRoot.addChild(dlg);

        this.dlgUserIfo = dlg.getComponent('dlgUserIfo');
        this.dlgUserIfo.up();

        //cc.g.utils.shareCaptureScreenToWX();
        
        return;
    },

    // 商城
    enterStore: function () {
        cc.g.utils.btnShake();

        //this.showMenu('store').getComponent('Store').init();
        let m = this.showMenu('store');
        //m.getComponent('store').up();
    },

    enterTeam: function () {
        this.showMenu('team').getComponent('Team').init();
    },

    // 推广员
    enterNotice: function (event, customEventData) {
        cc.g.utils.btnShake();

        //this.showMenu('notice').getComponent('Notice').init(parseInt(customEventData)/*, true*/);
        //this.showMenu('daili').getComponent('daili').up();

        this.showDlg('daili');
    },

    // 邀请有礼
    enterYqYouli: function (event, customEventData) {
        cc.g.utils.btnShake();

        this.showDlg('yqYouli').getComponent('yqYouli').init();
    },

    enterSpreadReward: function () {
        this.showMenu('spread_reward').getComponent('SpreadReward').init();
    },

    enterCustomerService: function() {
        this.showMenu('customerService').getComponent('CustomerService').init();
        //cc.sys.openURL(GameConfig.officialWebsite + '?user_id=' + cc.g.userMgr.userId.toString());
    },

    enterComplain: function() {
        this.showMenu('complain').getComponent('Complain').init();
    },

    // 进入俱乐部
    enterClub: function(evt, data) {
        cc.g.utils.btnShake();

        //cc.g.utils.setLocalStorage('teaHouseId', 'null')
        let teaHouseId = cc.g.utils.getLocalStorage('teaHouseId');
        cc.log('teaHouseId', teaHouseId);
        
        if (data=='more' || !teaHouseId || teaHouseId=='null') {
            if (!teaHouseId || teaHouseId=='null') {
                cc.g.utils.setLocalStorage('teaHouseId', 'null');
                cc.g.utils.setLocalStorage('teaname', '亲友圈');
                this.Label_qyqname.string = '亲友圈';
            }

            cc.director.loadScene('tea_quan', (err, scene) => {
                cc.log('进入茶馆场景1');
            });
        } else {
            let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_HALL);
            req.teaHouseId = parseInt(teaHouseId);

            cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_HALL, req, (resp)=> {
                if (!resp.err || resp.err==PB.ERROR.OK) {
                    cc.director.loadScene('tea', (err, scene) => {
                        cc.log('进入茶馆场景2');
                    });
                } else {
                    cc.g.utils.setLocalStorage('teaHouseId', 'null');
                    cc.g.utils.setLocalStorage('teaname', '亲友圈');
                    this.Label_qyqname.string = '亲友圈';

                    cc.director.loadScene('tea_quan', (err, scene) => {
                        cc.log('进入茶馆场景1');
                    });
                }
            });
        }
    },

    // 红包
    enterReadPack: function() {
        cc.g.global.showTipBox(devStr);
        return;

        this.showMenu('redPack').getComponent('RedPack').init();
    },

    enterActivity: function () {
        this.showMenu('activity').getComponent('Activity').init();
    },

    // 客服
    enterKefu: function () {
        cc.g.utils.btnShake();
        
        //this.showMenu('kefu').getComponent('kefu').up();
        
        //this.showDlg('kefu');

        cc.sys.openURL('https://tb.53kf.com/code/app/10496241/1');
    },
    // 装修
    enterZhuangxiu: function () {
        this.onClickCreateRoom(null, null);
        //cc.g.global.showTipBox(devStr);
    },


    // 显示弹出子界面
    showMenu: function (menuId) {
        if (this.menuNode[menuId] == null) {
            for (let i = 0; i < this.dlgPrefabs.length; i++) {
                if (this.dlgPrefabs[i].menuId == menuId) {
                    this.menuNode[menuId] = cc.instantiate(this.dlgPrefabs[i].prefab);
                    this.menuRoot.addChild(this.menuNode[menuId]);
                    break;
                }
            }
        }
        this.menuNode[menuId].setSiblingIndex(this.menuRoot.childrenCount - 1);
        this.menuNode[menuId].active = true;
        return this.menuNode[menuId];
    },
    showDlg: function (dlgID, zIdx, name) {
        let  dlg = null;

        for (let i = 0; i < this.dlgPrefabs.length; ++i) {
            if (this.dlgPrefabs[i].menuId == dlgID) {
                dlg = cc.instantiate(this.dlgPrefabs[i].prefab);
                this.menuRoot.addChild(dlg, zIdx, name);
                break;
            }
        }

        return dlg;
    },

    // 移除弹出子界面
    removeMenu: function (menuId) {
        if (this.menuNode[menuId] == null) {
            return;
        }

        this.menuNode[menuId].removeFromParent();
        this.menuNode[menuId].destroy();

        this.menuNode[menuId] = null;
    },

    closeClubMenu: function () {
        for(let menuId in this.menuNode) {
            if(menuId.indexOf('club_') === 0) {
                if(this.menuNode[menuId].active) {
                    this.menuNode[menuId].active = false;
                }
            }
        }
        if(this.menuNode['club'] && this.menuNode['club'].active) {
            this.menuNode['club'].getComponent('Club').onBtnBackMain();
        }
        cc.g.hallMgr.backClubInfo = null;
    },

    update: function (dt) {
    },

    checkRedDot: function () {
        //检测红点
        // if(cc.g.userMgr.checkShareReward()) {
        //     this.mainNode.getChildByName('redDot').active = true
        // } else {
        //     this.mainNode.getChildByName('redDot').active = false;
        // }
    },





    onBtnLogMod: function() {
        if (!cc.g._lmd) {
            cc.g._lmd = {};
            cc.g._lmd.times = 0;
            cc.g._lmd._1sttime = 0;
            cc.g._lmd.logopen = false;
        }

        if (cc.g._lmd._1sttime <= 0) {
            cc.g._lmd._1sttime = Date.now();
        }
        
        ++cc.g._lmd.times;

        cc.log('cc.g._lmd', cc.g._lmd);

        if (cc.g._lmd.times < 10) {
            return;
        }

        cc.g._lmd.times = 0;

        let t = Date.now();
        let past = t - cc.g._lmd._1sttime;
        cc.log('past', past);

        cc.g._lmd._1sttime = t;

        if (past > 5*1000) {
            return;
        }
        
        if (cc.g._lmd.logopen) {
            cc.log = cc.dlog;
            cc.g.global.hint('日志关闭');
        } else {
            cc.log = console.log;
            cc.g.global.hint('日志打开');
        }

        cc.g._lmd.logopen = !cc.g._lmd.logopen;
    },
});
