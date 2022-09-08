var GameBase = require('GameBase');
var HuPaiUtils = require("YjMjHuPaiUtils");
var majhCtrls = require('yjmjCtrls');
var DEF = require('yjmjDef');
let LG_Sta = DEF.PlayerSta;
var WangCodeUtils = require("yjWangCodeUtils");
var CompColorCodeUtils = require("CompColorCodeUtils");
var penGangUtils = require("penggangti");
var cardPrefab = cc.Class({
    name: 'yjcardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});
var qiCardPrefab = cc.Class({
    name: 'yjqiCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var pongCardPrefab = cc.Class({
    name: 'yjpongCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var gangCardPrefab = cc.Class({
    name: 'yjgangCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var angangCardPrefab = cc.Class({
    name: 'yjangangCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});


var huCardPrefab = cc.Class({
    name: 'yjhuCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

cc.Class({
    extends: GameBase,
    
    properties: {
        // 普通图集
        comtxtAtlas0: {
            default: null,
            type: cc.SpriteAtlas,
        },
        comtxtAtlas1: {
            default: null,
            type: cc.SpriteAtlas,
        },
        comtxtAtlas2: {
            default: null,
            type: cc.SpriteAtlas,
        },
        majhAtlas0: {
            default: null,
            type: cc.SpriteAtlas,
        },
        majhCardAtlas0: {
            default: null,
            type: cc.SpriteAtlas,
        },
        cardPrefab: {
            default: [],
            type: [cardPrefab],
        },
        qiCardPrefab: {
            default: [],
            type: [qiCardPrefab],
        },
        pongCardPrefab: {
            default: [],
            type: [pongCardPrefab],
        },
        gangCardPrefab: {
            default: [],
            type: [gangCardPrefab],
        },
        angangCardPrefab: {
            default: [],
            type: [angangCardPrefab],
        },
        huCardPrefab: {
            default: [],
            type: [huCardPrefab],
        },
        // 游戏结算预制
        settlementPf: {
            default: null,
            type: cc.Prefab,
        },
        // 总结算预制
        settleFinalPf: {
            default: null,
            type: cc.Prefab,
        },
        // 游戏结算 玩家预制
        SIPlayerPf: {
            default: null,
            type: cc.Prefab,
        },
        // 游戏结算 玩家预制
        SIPlayerPf1: {
            default: null,
            type: cc.Prefab,
        },
        // 游戏结算 玩家预制
        SIPlayerPf2: {
            default: null,
            type: cc.Prefab,
        },
        SIPlayerPf3: {
            default: null,
            type: cc.Prefab,
        },
        SIPlayerPf4: {
            default: null,
            type: cc.Prefab,
        },
        SIPlayerPf5: {
            default: null,
            type: cc.Prefab,
        },
        tiPengViewPf: {
            default: null,
            type: cc.Prefab,
        },
        tiPengCardPf: {
            default: null,
            type: cc.Prefab,
        },
        anGangCardPf: {
            default: null,
            type: cc.Prefab,
        },
        mingGangCardPf: {
            default: null,
            type: cc.Prefab,
        },
        pengCardPf: {
            default: null,
            type: cc.Prefab,
        },
        JieSuanMingTang: {
            default: null,
            type: cc.Prefab,
        },
        sendCardTimer: cc.Integer,
        // 回放时，其他三个玩家的牌
        cardBackPlayPrefab: {
            default: [],
            type: [cardPrefab],
        },
    },
    dbgstr: function (info) {
        let s = '麻将页面'; //majhPage

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },
    resetDatas() {
        // 胡的次数
        this.ziHuCount = 0

        // 胡牌提示数组
        this.huPaiAlertArr = []

        // 保存胡牌的
        this.huCodeArr = [];

        // 当前可以胡牌的
        this.huPaiCurrentItem = null

        // 当前正被点亮的拍
        this.codeLight = -100;

        // zindex 计数器
        this.zIndexQiRightCount = 0;

        // zindex 计数器
        this.zIndexQiTopCount = 0;

        this.zIndexQiLeftCount = 0;

        // 是否报叫
        this.isBaoJiao = false;

        this.needCallBack = false;

        this.timeStamp = null
        // this.isAutoPlay = false;

        // // 是否自动胡牌
        // this.isAutoHu = false;
        // if (this.Sprite_Light != null) {
        //     this.Sprite_Light.active = false
        // }

        this.saveCurrentPalyerViewItem = null;
    },
    onLoad () {
        // 获取消息处理mgr
        this.gameMgr = cc.g.yjmjMgr;

        // 初始化父视图, 只能放到这里 gameMgr 赋值后，再调用
        this._super();

        // 赋值 gameScript
        this.gameMgr.gameScript = this;
        this.gameMgr.audio.bgmGame();

        this.isbpm = this.gameMgr.isBackPlayMode();

        this.resetDatas();

        // 初始化界面
        this.initView();

        this.upDeskbg();

        //
        // 界面加载完成
        if (! cc.g.majhbg) {
            this.gameMgr.gameScriptLoaded();
        }
        //
        // 更新页面
        this.upPage();

        if (this.isbpm) {
            if (this.gameMgr.backPlay) {
                this.gameMgr.backPlay.gameLoaded();
            }

            this.gameMgr.backPlay.begin();
        }

        // 进入先隐藏
        // cc.g.hallMgr.inGameMenu.Button_liushui.active = false;
        
        penGangUtils.init(this.gameMgr.roomInfo.NewRlue)
    },
    start () {
    },
    // 初始化界面
    initView: function (info) {
        let r = this.node;

        this.deskbg = cc.find("deskbg", r).getComponent(cc.Sprite);

        // 调试按钮
        this.DBG_Button = cc.find("DBG_Button", r);
        this.DBG_Button.zIndex = 1000;
        this.DBG_Button.active = GameConfig.dbgBtn;
        // this.DBG_Button.active = 1;


        // //  贴鬼碰杠
        // this.Check_Sprite = cc.find("Node_Gui_Check_Node/Check_Sprite", r);//.getComponent(cc.Sprite);
        // this.Check_Sprite.active = false;

        // 全屏点击穿透
        this.clcSwallow = cc.find("ClickSwallow", r).getComponent('ClickSwallow');
        this.clcSwallow.node.active = false;
        this.clcSwallow.endCall = function(){
            this.onClickSwallow();
        }.bind(this);

        // 桌子上的规则文字
        this.Label_deskrule = cc.find("Label_deskrule", r);
        if (this.Label_deskrule) {
            this.Label_deskrule = this.Label_deskrule.getComponent(cc.Label);
            this.Label_deskrule.node.active = false;
        }

        // // 房间信息
        // let roomInfo = cc.find("game_top_layout", r);
        // // 局数
        // this.labelJueShu = cc.find("game_top_jeshu_layout/jueshu_label", roomInfo).getComponent(cc.Label);
        // //  房间号
        // this.label_room = cc.find("game_top_room_layout/room_label", roomInfo).getComponent(cc.Label);
        // 显示时间
        // this.label_timer = cc.find("game_top_timer_layout/timer_bg_img/timer_label", roomInfo).getComponent(cc.Label);


        // 换牌界面
        this.node_Huanpai = cc.find("Node_Huanpai", r)
        this.node_Huanpai.active = false
        // 换牌按钮
        this.huanPaiBtn = cc.find("Layout_HuanPai/Button_HuanPai", this.node_Huanpai).getComponent(cc.Button)

        // 换牌
        this.huanSprite = cc.find("Layout_HuanPai/HuanSprite", this.node_Huanpai).getComponent(cc.Sprite)

        // 设置位灰色按钮
        this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_25');
        this.huanPaiBtn.enabled = false;

        // 胡 提 杠 按钮
        this.Node_HuTiGangView = cc.find("Node_HuTiGang", r)
        this.Node_HuTiGangView.active = false

        // 取消
        this.Node_HuTiGangViewCancle = cc.find("Node_HuTiGang_Cancle", r)
        this.Node_HuTiGangViewCancle.active = false


        // 胡按钮
        this.Button_Hu = cc.find("Button_Hu", this.Node_HuTiGangView);
        this.Button_Hu.active = false;
        // 胡动画
        // let Node_Hu = cc.find("Button_Hu/Node_Hu", this.Node_HuTiGangView);
        // this.Ami_Node_Hu = this.crtAnmObj(Node_Hu);
        // this.Ami_Node_Hu.play()

        // 提按钮
        this.Button_Ti = cc.find("Button_Ti", this.Node_HuTiGangView);
        this.Button_Ti.active = false;
        // 提动画
        // let Node_Ti = cc.find("Button_Ti/Node_Ti", this.Node_HuTiGangView);
        // this.Ami_Node_Ti = this.crtAnmObj(Node_Ti);

        // 杠按钮
        this.Button_Gang = cc.find("Button_Gang", this.Node_HuTiGangView);
        this.Button_Gang.active = false;
        // 杠动画
        // let Node_Gang = cc.find("Button_Gang/Node_Gang", this.Node_HuTiGangView);
        // this.Ami_Node_Gang = this.crtAnmObj(Node_Gang);

        // 飞按钮
        this.Button_Fei = cc.find("Button_Fei", this.Node_HuTiGangView);
        this.Button_Fei.active = false;
        // 飞动画
        // let Node_Fei = cc.find("Button_Fei/Node_Fei", this.Node_HuTiGangView);
        // this.Ami_Node_Fei = this.crtAnmObj(Node_Fei);

        // 碰按钮
        this.Button_Peng = cc.find("Button_Peng", this.Node_HuTiGangView);
        this.Button_Peng.active = false;
        // 碰动画
        // let Node_Peng = cc.find("Button_Peng/Node_Peng", this.Node_HuTiGangView);
        // this.Ami_Node_Peng = this.crtAnmObj(Node_Peng);

        // 过按钮
        this.Button_Guo = cc.find("Button_Guo", this.Node_HuTiGangView);
        this.Button_Guo.active = false;
        // 碰动画
        // let Node_Guo = cc.find("Button_Guo/Node_Guo", this.Node_HuTiGangView);
        // this.Ami_Node_Guo = this.crtAnmObj(Node_Guo);

        // 包叫Uiss
        this.Node_BaoJiao = cc.find("Node_BaoJiao", r);
        this.Node_BaoJiao.active = false;

        // // 复制、邀请好友
        this.Node_gmfreeBtns = cc.find("Node_gmfreeBtns", r);

        // 准备按钮
        this.buttonReady = cc.find("Node_gmfreeBtns/buttonReady", r);
        // 亲友圈邀请
        this.Button_qyqyq = cc.find("Node_gmfreeBtns/Button_2", r);
        // 邀请好友
        this.Button_yqhy = cc.find("Node_gmfreeBtns/New Node", r);




        // 提 飞 UI
        this.Node_TiFeiView = cc.find("Node_TiFeiView", r);
        this.Node_TiFeiView.active = false

        // 杠 UI
        this.Node_MultGanView = cc.find("Node_gangView", r);
        this.Node_MultGanView.active = false
        // 彭刚
        this.Sprite_Imgs_penggang = cc.find("Sprite_Imgs", this.Node_MultGanView).getComponent(cc.Sprite);

        // 换牌界面
        this.node_HuaiPai_all_View = cc.find("Node_HanPai_All_View", r);
        this.node_HuaiPai_all_View.active = false

        this.node_HuaiPai_all_View_Four = cc.find("Node_HanPai_All_Four_View", r);
        this.node_HuaiPai_all_View_Four.active = false

        // 骰子位置
        this.Node_SaiZi_View = cc.find("Node_SaiZi_View", r);
        this.Node_SaiZi_View.active = false;
        this.Sprite_SaiZi_1 = cc.find("Node_SaiZi_View/Sprite_SaiZi_1", r).getComponent(cc.Sprite);
        this.Sprite_SaiZi_2 = cc.find("Node_SaiZi_View/Sprite_SaiZi_2", r).getComponent(cc.Sprite);

        //豹子
        this.Tmp_Node_Ma = cc.find("Tmp_Node_Ma", r)
        this.Node_BaoZi = cc.find("Node_Ma", r)
        this.Node_BaoZi.active = false;
        this.Node_BaoZi.ox = this.Node_BaoZi.x
        this.Node_BaoZi.oy = this.Node_BaoZi.y

        // 缺的动画
        this.nodeQueArr = []
        this.Node_Que_Anima = cc.find("Node_Que_Anima", r);
        this.Node_Que_Anima.active = false;
        // 缺的动画
        this.Sprite_que0 = cc.find("Node_Que_Anima/Sprite_quee_0", r)//.getComponent(cc.Sprite);
        this.Sprite_que0.active = false;
        this.nodeQueArr.push(this.Sprite_que0)

        this.Sprite_que1 = cc.find("Node_Que_Anima/Sprite_quee_1", r)//.getComponent(cc.Sprite);
        this.Sprite_que1.active = false;
        this.nodeQueArr.push(this.Sprite_que1)

        this.Sprite_que2 = cc.find("Node_Que_Anima/Sprite_quee_2", r)//.getComponent(cc.Sprite);
        this.Sprite_que2.active = false;
        this.nodeQueArr.push(this.Sprite_que2)

        this.Sprite_que3 = cc.find("Node_Que_Anima/Sprite_quee_3", r)//.getComponent(cc.Sprite);
        this.Sprite_que3.active = false;
        this.nodeQueArr.push(this.Sprite_que3)

        // 提示文字
        this.Node_Bg_Tips = cc.find("Node_Bg_Tips", r);
        this.Node_Bg_Tips.active = true;

        // 显示碰杠
        this.Node_PengGang = cc.find("Node_PengGang", r);
        this.Node_PengGang.active = false;
        this.multGangTi = cc.find("Node_PengGang/multGangTi", r);
        this.huTi_Sprite_bg = cc.find("Sprite_bg", this.multGangTi);
        this.huTi_Node_Center = cc.find("Sprite_bg/Node_Center", this.multGangTi);
        this.huTi_Node_Layout = cc.find("Node_Layout", this.multGangTi);
        this.Sprite_Center_Title = cc.find("Sprite_Center_Title", this.huTi_Node_Center).getComponent(cc.Sprite);

        // 底牌
        // this.Sprite_Bg_Node = cc.find("Sprite_Bg_Node", r);
        // this.Sprite_Bg_Num = cc.find("Sprite_Bg_Node/Sprite_Bg_Num", r);
        // this.Sprite_Bg_Num.active = false;
        this.Label_Left_Num = cc.find("Sprite_Bg_Node/Label_Left_Num", r).getComponent(cc.Label);
        // this.Label_Left_Num.node.active = false;

        this.labelJueShu = cc.find("Sprite_Bg_Node/jueshu_label", r).getComponent(cc.Label);


        // 倒计时，东南西北
        this.Num_Down_Label = cc.find("Sprite_Bg_Node/Num_Down_Label", r).getComponent(cc.Label);
        // this.Num_Down_Label.node.active = false;
        this.Num_Down_Label.string = '00';

        this.Node_ts = cc.find("Sprite_Bg_Node/Node_ts", r);
        this.Node_zb = cc.find("Sprite_Bg_Node/Node_zb", r);

        // 胡牌提示
        this.HuNodeTips = cc.find("HuNodeTips", r);
        this.HuNodeTips.active = false;
        this.Sprite_Light = cc.find("HuNodeTips/AutoHuButton/Sprite_Light", r);//.getComponent(cc.Sprite);
        this.Sprite_Light.active = false
        // 是否自动胡牌
        this.isAutoHu = false;

        // this.doShowAllHiddenZeZhaoView();

        // // piao
        // this.Node_Piao = cc.find("Node_Piao", r);
        // this.Node_Piao.active = false;

        // 胡牌提示页面
        this.Node_hupaiTip = cc.find("Node_hupaiTip", r);
        this.Node_hupaiTip.active = false;
        // 胡多少张
        this.Sprite_hu_count_label = cc.find("Node_hupaiTip/Sprite_bg/Sprite_num/Label", r).getComponent(cc.Label);
        // 多少倍
        this.Sprite_hu_bei_label = cc.find("Node_hupaiTip/Sprite_bg/Sprite_maxbei/Label", r).getComponent(cc.Label);
        // gd box
        this.Sprite_hu_Gbox = cc.find("Node_hupaiTip/GBox_tips", r);
        // 背景
        this.Sprite_Hu_bg = cc.find("Node_hupaiTip/Sprite_bg", r)
        this.Sprite_Hu_bg.ow = this.Sprite_Hu_bg.width;
        this.Sprite_Hu_bg.oh = this.Sprite_Hu_bg.height;
        // 
        this.sv_huifo = cc.find("Node_hupaiTip/ScrollView_huifo", r).getComponent(cc.ScrollView);


        // 托管提示
        this.Node_tgts = cc.find("Node_tgts", r);
        this.Node_tgts.desc = cc.find("text", this.Node_tgts).getComponent(cc.Label);
        this.Node_tgts.active = false;


        this.initAreaDatas();
        // 玩家视图
        this.initPlayerView();
        // 初始化动画层
        this.initAnimationView();

        // 回放时，统计换三张次数
        this.huan3Times = 0;
    },
    initDnxb: function() {
        if (this.cardType == 1) {
            this.Node_ts.active = false
            this.Node_zb.active = true
            this.Sprite_dong = cc.find("Sprite_dong", this.Node_zb);
            this.Sprite_dong.active = false;

            this.Sprite_bei = cc.find("Sprite_bei", this.Node_zb);
            this.Sprite_bei.active = false;

            this.Sprite_xi = cc.find("Sprite_xi", this.Node_zb);
            this.Sprite_xi.active = false;

            this.Sprite_nan = cc.find("Sprite_nan", this.Node_zb);
            this.Sprite_nan.active = false;
        } else {
            this.Node_ts.active = true
            this.Node_zb.active = false
            this.Sprite_dong = cc.find("Sprite_dong", this.Node_ts);
            this.Sprite_dong.active = false;

            this.Sprite_bei = cc.find("Sprite_bei", this.Node_ts);
            this.Sprite_bei.active = false;

            this.Sprite_xi = cc.find("Sprite_xi", this.Node_ts);
            this.Sprite_xi.active = false;

            this.Sprite_nan = cc.find("Sprite_nan", this.Node_ts);
            this.Sprite_nan.active = false;
        }
    },
    onClickSwallow: function () {
        if (this.interactView) {
            this.interactView.node.active = false;
            this.interactView = null;
            this.clcSwallow.node.active = false;
        }
    },

    startTimer: function(payerIndex) {
        // 开始之前，先隐藏
        this.hidderStartTimer();

        if (payerIndex == 0) {
            this.Sprite_xi.active = true;
        } else if (payerIndex == 1) {
            this.Sprite_nan.active = true;
        } else if (payerIndex == 2) {
            this.Sprite_dong.active = true;
        } else if (payerIndex == 3) {
            this.Sprite_bei.active = true;
        }

        this.curPayerIndex = payerIndex
        // this.Num_Down_Label.node.active = true;
        this.Num_Down_Label.string = 10;           //  场景文本框为 显示20
        this.countDownNum = 10;
        if (this.countDownNum >= 0) {
            this.schedule(this.scheuleFunc, 1);
        }
    },
    scheuleFunc: function() {
        this.reduceTimer();
    },
    reduceTimer: function() {                // 倒计时算法
        if (this.countDownNum >= 1) {
            this.countDownNum = this.countDownNum - 1;
            // 最后3秒 播放一次
            if (this.countDownNum <= 3) {
                this.gameMgr.audio.daoJiShi();
            }
            this.Num_Down_Label.string = '0'+this.countDownNum;    //场景中文本框显示
        }
    },
    // 隐藏倒计时
    hidderStartTimer: function() {
        this.unschedule(this.scheuleFunc)
        // this.Num_Down_Label.node.active = false;
        this.countDownNum = 0;
        this.Sprite_dong.active = false;
        this.Sprite_bei.active = false;
        this.Sprite_xi.active = false;
        this.Sprite_nan.active = false;
        this.curPayerIndex = 0;
    },
    initAreaDatas: function() {
        let ri = this.gameMgr.roomInfo;
        this.initPaiCount();
    },
    getCanPiaoQueRule: function() {
        // 18 开局定缺 19 胡牌缺一门 20 两放麻将
        let canPiao = false;
        let newRlue = this.gameMgr.roomInfo.NewRlue
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 2 || num == 3) {
                canPiao = true;
                break;
            }
        }

        return canPiao
    },
    initPaiCount: function() {
        // 几个玩家
        let palerCount = parseInt(this.gameMgr.roomInfo.total)


        let allCount = 108;
        // 是2方麻将
        if (this.getTwoQueRule()) {
            allCount = allCount - 36
        }

        let showCount = allCount - 14 - (palerCount - 1) * 13

        //
        if (this.getYaoJiCount() == 3) {
            showCount -= 1;
        }

        // 红中个数
        this.Label_Left_Num.string = showCount


        // this.gameMgr.roomInfo.cardNum = showCount + '';
    },
    initPaiCountStart: function() {
        // 几个玩家
        let palerCount = parseInt(this.gameMgr.roomInfo.total)


        let allCount = 108;
        // 是2方麻将
        if (this.getTwoQueRule()) {
            allCount = allCount - 36
        }

        let showCount = allCount; //- 14 - (palerCount - 1) * 13

        //
        if (this.getYaoJiCount() == 3) {
            showCount -= 1;
        }

        // 红中个数
        this.Label_Left_Num.string = showCount
        this.hidderStartTimer()
        this.Num_Down_Label.string = '00';
        // this.gameMgr.roomInfo.cardNum = showCount + '';
    },
    getHongZhongCount: function() {
        // // 找红中个数  12 无红中 13 4个 14 8个 15 11个 16 12个
        // let newRlue = this.gameMgr.roomInfo.NewRlue
        // let hongZhongCount = 0;
        //
        // //  找红中个数
        // for (let i = 0; i < newRlue.length; i++) {
        //     let num = parseInt(newRlue[i])
        //     if (num == 13) {
        //         hongZhongCount = 4;
        //         break;
        //     } else if (num == 14) {
        //         hongZhongCount = 8;
        //         break;
        //     } else if (num == 15) {
        //         hongZhongCount = 11;
        //         break;
        //     } else if (num == 16) {
        //         hongZhongCount = 12;
        //         break;
        //     }
        // }
        //
        // return hongZhongCount
        // 找红中个数  12 无红中 13 4个 14 8个 15 11个 16 12个
        // let newRlue = this.gameMgr.roomInfo.NewRlue
        // let hongZhongCount = 0;
        //
        // //  找红中个数
        // for (let i = 0; i < newRlue.length; i++) {
        //     let num = parseInt(newRlue[i])
        //     if (num == 43) {
        //         hongZhongCount = 3;
        //         break;
        //     } else if (num == 44) {
        //         hongZhongCount = 4;
        //         break;
        //     }
        // }

        return 4;//hongZhongCount
    },
    getYaoJiCount: function() {
        // 找红中个数  12 无红中 13 4个 14 8个 15 11个 16 12个
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let hongZhongCount = 0;

        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 43) {
                hongZhongCount = 3;
                break;
            } else if (num == 44) {
                hongZhongCount = 4;
                break;
            }
        }

        return hongZhongCount
    },
    getHuanPaiCount: function() {
        // 找红中个数  12 无红中 13 4个 14 8个 15 11个 16 12个
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let isThree = false;
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 20) {
                isThree = true;
                break;
            } else if (num == 21) {
                isThree = false;
                break;
            }
        }

        return isThree
    },
    getYaoTongGui: function() {
        // 16 17 18
        // tong ren hun
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let ytGui = false;
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 49) {
                ytGui = true; // 同花色
                break;
            }
        }
        return ytGui
    },
    getHuanPaiType: function() {
        // 16 17 18
        // tong ren hun
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let huanType = 1;
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 16) {
                huanType = 1; // 同花色
                break;
            } else if (num == 17) {
                huanType = 2; // 任意换
                break;
            } else if (num == 18) {
                huanType = 3; // 混换
                break;
            }
        }

        return huanType
    },
    getPaiQueRule: function() {
        // 18 开局定缺 19 胡牌缺一门 20 两放麻将
        let queRule = 100;
        let newRlue = this.gameMgr.roomInfo.NewRlue
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 19 || num == 20) {
                queRule = -1;
                break;
            } else if (num == 18) {
                queRule = 100;
                break;
            }
        }

        return queRule
    },
    // 是否是2方麻将
    getTwoQueRule: function() {
        // 18 开局定缺 19 胡牌缺一门 20 两放麻将
        let queRule = false;
        let newRlue = this.gameMgr.roomInfo.NewRlue
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 5) {
                queRule = true;
                break;
            }
        }

        return queRule
    },
    getHuanSanZhangRule: function() {
        // 18 开局定缺 19 胡牌缺一门 20 两放麻将
        let canHuan = false;
        let newRlue = this.gameMgr.roomInfo.NewRlue
        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 20 || num == 21) {
                canHuan = true;
                break;
            }
        }

        return canHuan
    },
    doDelDiPaiCount: function() {
        let curCount = this.Label_Left_Num.string
        let paiCount = parseInt(curCount) - 1
        if (paiCount < 0) {
            paiCount = 0;
        }
        // 底牌
        this.Label_Left_Num.string = paiCount + ''

        // this.cardNum = paiCount;
        this.gameMgr.roomInfo.cardNum = paiCount + '';
    },
    // 初始化玩家视图
    initPlayerView: function () {
        // 存放玩家视图
        let pv = this.playerView = [];

        let Node_player = cc.find("Node_player", this.node);
        // 根据界面上数据，初始化玩家视图
        while (true) {
            let i = pv.length + 1;
            let node = cc.find("Node_p"+i, Node_player);

            if (!node) {
                break;
            }
            let view = new majhCtrls.PlayerView();
            view.init(node, i-1, this);

            pv.push(view);
        }
    },
    // 初始化动画层
    initAnimationView: function() {
        // 动画对象
        this.anmView = {};

        // 动画根节点
        let nodeAninamtion = cc.find("Node_Aninamtion", this.node);
        nodeAninamtion.active = false;
        this.anmView.nodeAninamtion = nodeAninamtion;
        //
        // // 开局动画
        // let nodeKaiJu = cc.find("Node_KaiJu", nodeAninamtion);
        // this.anmView.anmKaiJu = this.crtAnmObj(nodeKaiJu);

        // 骰子
        let nodeAninSaizi = cc.find("Node_SaiZi", nodeAninamtion);
        this.anmView.anmSaizi = this.crtAnmObj(nodeAninSaizi);

        // 换牌动画1
        let nodeAninHp = cc.find("Node_Ani_Hp", nodeAninamtion);
        this.anmView.nodeAninHp = this.crtAnmObj(nodeAninHp);

        // 换牌动画 对换
        let nodeAninHp2 = cc.find("Node_Ani_ZxHp", nodeAninamtion);
        this.anmView.nodeAninHp2 = this.crtAnmObj(nodeAninHp2);

        // // 胡提杠特效
        // let nodeHuTiGang = cc.find("Node_Hu_Ti_Gang", nodeAninamtion);
        // this.anmView.nodeHuTiGang = this.crtAnmObj(nodeHuTiGang);

        // // 风暴
        // let nodeFenBao = cc.find("Node_FenBao", nodeAninamtion);
        // this.anmView.nodeFenBao = this.crtAnmObj(nodeFenBao);
        //
        // // 雨
        // let nodeYue = cc.find("Node_Yue", nodeAninamtion);
        // this.anmView.nodeYue = this.crtAnmObj(nodeYue);
        //
        // // 留
        // let nodeLiuJue = cc.find("Node_LiuJue", nodeAninamtion);
        // this.anmView.nodeLiuJue = this.crtAnmObj(nodeLiuJue);
    },
    // 更新视图
    upPage: function () {

        let gameType = this.gameMgr.roomInfo.gameType
        this.cardType = cc.g.utils.getPaiVaule(gameType);

        this.initDnxb()
        this.resetDatas();

        cc.g.hallMgr.inGameMenu.upteagold();

        this.upGamesCom();

        this.initPaiCountStart();
        
        let ri = this.gameMgr.roomInfo;
        // 更新局数
        this.upTurn();
        // 房间号
        // this.label_room.string = ri.roomId;

        // 隐藏豹子
        // this.Node_BaoZi.active = this.isBaoZi;

        this.Node_BaoZi.active = false;
        this.Node_BaoZi.setPosition(this.Node_BaoZi.ox, this.Node_BaoZi.oy);

        // // // 对局未开始的操作按钮
        // this.Node_gmfreeBtns.active = ((ri.curGameNum<1) && (ri.status == DEF.RMSTA.Free.v));
        this.Node_gmfreeBtns.active = true
        // // 准备按钮
        this.buttonReady.active = (ri.status == DEF.RMSTA.Free.v) && (! this.gameMgr.uidPlayers[this.gameMgr.selfUID].isReady);

        this.Button_qyqyq.active = ri.clubId > 0;

        // 第一次空闲的一些按钮
        if ((ri.curGameNum<1) && (ri.status == DEF.RMSTA.Free.v)) {
            this.Button_yqhy.active = true;
        } else {
            this.Button_qyqyq.active = this.Button_yqhy.active = false;
        }

        // 隐藏俱乐部的返回大厅按钮
        cc.g.hallMgr.inGameMenu.upBtnShow();
        // cc.g.hallMgr.inGameMenu.Node_bts.y = cc.g.hallMgr.inGameMenu.Node_bts.oy + 80;
        //
        // // 重置右侧功能菜单按钮位置(聊天，设置，麦克风)
        // cc.g.hallMgr.inGameMenu.micNode.active = true;
        // // 如果是房主,'解散房间'；不是房主,'离开房间'
        let owner_sf;
        if(eq64(ri.owner, this.gameMgr.selfUID)) {
            owner_sf = this.comtxtAtlas0.getSpriteFrame('comtxt_jsfj');
        } else {
            owner_sf = this.comtxtAtlas0.getSpriteFrame('comtxt_lkfj');
        }
        // this.Sprite_leavebtn.spriteFrame = owner_sf;
        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            e.upView();
        }

        // 操作按钮
        this.upOperate();

        // 判断解散
        this.jiesanView && this.jiesanView.clear();
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            if (e.player && e.player.voteSta) {
                e.player.askJiesan();
                break;
            }
        }

        this.HuNodeTips.active = false;
        // this.Sprite_Light.active = false

        if ((ri != null) && (ri.status > DEF.RMSTA.Ding2.v)) {
            // 断线后，检测
            this.doCheckHuAlert();
        }
    },
    doCheckHuAlert: function() {
        //  断线后，检测胡牌提示
        let palyerViewItemOne = this.playerView[0]
        if (palyerViewItemOne.index == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai(true);
            this.showHuPaiAlertReconBtn()
            // // 最后打出的牌
            // let waitCode = palyerViewItemOne.player.waitCode
            // if (!cc.g.utils.judgeObjectEmpty(waitCode)) {
            //     // 胡牌提示数组, 保存胡牌提示
            //     this.showHuPaiAlertBtn(parseInt(waitCode));
            // }
        }
    },
    // doPlayHuTiGangAnim: function(palyerViewItem, plaerIndex) {
    //     // plaerIndex fei 0 peng 1 ti 2 gang 3 hu 4
    //     const self = this
    //     self.anmView.nodeAninamtion.active = true;
    //     let name = 'fei'
    //     if (plaerIndex == 0) {
    //         name = 'fei'
    //     } else if (plaerIndex == 1) {
    //         name = 'peng'
    //     } else if (plaerIndex == 2) {
    //         name = 'ti'
    //     } else if (plaerIndex == 3) {
    //         name = 'gang'
    //     } else if (plaerIndex == 4) {
    //         name = 'hu'
    //     }
    //     self.anmView.nodeHuTiGang.onec(name, ()=>{
    //         self.anmView.nodeAninamtion.active = false;
    //     }, false);
    // },
    // 更新局数
    upTurn: function () {
        let ri = this.gameMgr.roomInfo;

        // if ((ri.type == 2) || (ri.GameNum > ri.curGameNum)) {
        //     this.labelJueShu.string = ri.curGameNum + '/' + ri.GameNum;
        // } else {
        //     this.labelJueShu.string = ri.curGameNum;
        // }

        this.labelJueShu.string = ri.curGameNum + '/' + ri.GameNum;
    },

    
    // 开始游戏
    starGame: function (saiZiArr) {
        this.tgdjsObj = {};
        this.gameMgr.roomInfo.autoCountDown = [];
        this.upTuoguanTishi();

        this.buttonReady.active = false;

        // 亲友圈邀请
        this.Button_qyqyq.active = false;
        // 邀请好友
        this.Button_yqhy.active = false;


        // 隐藏已经准备
        for (let i = 0; i < this.playerView.length; i++) {
            let e = this.playerView[i]
            e.onStarGame();
        }

        this.beginSendCard(saiZiArr);
    },
    // 重置游戏
    resetGame: function () {
        this._super();

        this.upPage();
    },
    //
    // beginSendCard: function () {
    //     // 播放开局动画
    //     let self = this
    //     self.anmView.nodeAninamtion.active = true;
    //     self.anmView.anmKaiJu.onec(self.anmView.anmKaiJu.names[0], ()=>{
    //         self.anmView.anmKaiJu.active = false
    //
    //         // 播放骰子动画
    //         this.Node_SaiZi_View.active = false;
    //         this.Sprite_SaiZi_1.node.active = false;
    //         this.Sprite_SaiZi_2.node.active = false;
    //
    //         let num1 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
    //         if (num1 < 0) {
    //             num1 = 0;
    //         }
    //         if (num1 > 6) {
    //             num1 = 6;
    //         }
    //         let num2 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
    //         if (num2 < 0) {
    //             num2 = 0;
    //         }
    //         if (num2 > 6) {
    //             num2 = 6;
    //         }
    //
    //         this.gameMgr.audio.saizi();
    //         this.anmView.anmSaizi.onec(this.anmView.anmSaizi.names[0], ()=>{
    //             // 骰子
    //             this.Sprite_SaiZi_1.node.active = true;
    //             this.Sprite_SaiZi_1.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num1);
    //
    //             this.scheduleOnce(()=>{
    //                 // 隐藏提示文字
    //                 // this.Node_Bg_Tips.active = false;
    //                 this.anmView.nodeAninamtion.active = false;
    //
    //                 // 执行发牌
    //                 this.scheduleOnce(()=>{
    //                     this.Node_SaiZi_View.active = false;
    //                     this.sendCard();
    //                     this.Sprite_Bg_Num.active = true;
    //                     this.Label_Left_Num.node.active = true;
    //                 }, parseInt(this.sendCardTimer));
    //             }, 0.8);
    //         }, false);
    //
    //         this.scheduleOnce(()=>{
    //             this.Node_SaiZi_View.active = true;
    //             this.Sprite_SaiZi_2.node.active = true;
    //             this.Sprite_SaiZi_2.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num2);
    //         }, 0.68);
    //
    //     }, false);
    // },
    beginSendCard: function (saiZiArr) {
        // 播放开局动画
        let self = this
        self.anmView.nodeAninamtion.active = true;
        // self.anmView.anmKaiJu.onec(self.anmView.anmKaiJu.names[0], ()=>{
        //     self.anmView.anmKaiJu.active = false
        // }, false);

        // 播放骰子动画
        this.Node_SaiZi_View.active = false;
        this.Sprite_SaiZi_1.node.active = false;
        this.Sprite_SaiZi_2.node.active = false;

        let num1 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        let num2 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        if (cc.g.utils.judgeArrayEmpty(saiZiArr)) {
            if (num1 < 0) {
                num1 = 0;
            }
            if (num1 > 6) {
                num1 = 6;
            }
            if (num2 < 0) {
                num2 = 0;
            }
            if (num2 > 6) {
                num2 = 6;
            }
        } else {
            num1 = parseInt(saiZiArr[0]);
            num2 = parseInt(saiZiArr[1]);
        }

        this.gameMgr.audio.saizi();
        this.anmView.anmSaizi.onec(this.anmView.anmSaizi.names[0], ()=>{
            // 骰子
            this.Sprite_SaiZi_1.node.active = true;
            this.Sprite_SaiZi_1.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num1);

            this.scheduleOnce(()=>{
                // 隐藏提示文字
                // this.Node_Bg_Tips.active = false;
                this.anmView.nodeAninamtion.active = false;

                // 执行发牌
                this.scheduleOnce(()=>{
                    this.Node_SaiZi_View.active = false;
                    this.Sprite_SaiZi_1.node.active = false;
                    this.Sprite_SaiZi_2.node.active = false;
                    this.sendCard();
                    // this.Sprite_Bg_Num.active = true;
                    // this.Label_Left_Num.node.active = true;

                    if (!cc.g.utils.judgeArrayEmpty(saiZiArr)) {
                        let pos = this.calWhoMa(num1, num2, saiZiArr[2])
                        // // 出现豹子情况
                        this.runBaoZiAnimation(1, this.Node_BaoZi);
                        this.isBaoZi = true;
                    }

                }, parseInt(this.sendCardTimer));
            }, 0.4);
        }, false);

        this.scheduleOnce(()=>{
            this.Node_SaiZi_View.active = true;
            this.Sprite_SaiZi_2.node.active = true;
            this.Sprite_SaiZi_2.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num2);
        }, 0.68);
    },
    calWhoMa: function (num1, num2, uid) {
        let index = 0
        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            let player = e.player
            if (player != null) {
                let eUid = player.d.uid
                if (eq64(eUid, uid)) {
                    index = i
                    player.piao = 1
                    player.d.piao = 1
                } else {
                    player.piao = 0
                    player.d.piao = 0
                }
            }
        }

        return index
    },
    runBaoZiAnimation: function (pos, node) {
        const self = this;
        node.setPosition(this.Node_BaoZi.ox, this.Node_BaoZi.oy);
        node.setScale(1.2, 1.2)
        node.active = true;
        // let endX = -385
        // let endY = 274
        // let endX = -400
        let endX = this.Tmp_Node_Ma.x
        let endY = this.Tmp_Node_Ma.y

        cc.log('this.Node_BaoZi.ox-->' + this.Node_BaoZi.ox)
        cc.log('this.Node_BaoZi.oy-->' + this.Node_BaoZi.oy)

        cc.log('endX-->' + endX)
        cc.log('endY-->' + endY)


        // if (pos == 0) {
        //     endX = -486.379
        //     endY = -143.529
        // } else if (pos == 1) {
        //     endX = 491.819
        //     endY = 69.939
        // } else if (pos == 2) {
        //     endX = 280.697
        //     endY = 234.145
        // } else if (pos == 3) {
        //     endX = -486.379
        //     endY = 65.247
        // }
        if (pos > 0) {
           // let playerViewItem = this.playerView[pos]
            node.runAction(
                cc.sequence(
                    cc.delayTime(0.3),
                    cc.spawn(
                        cc.moveTo(0.2, endX, endY),
                        cc.scaleTo(0.2, 1.2, 1.2),
                    ),
                    cc.callFunc(
                        function (params) {
                            // node.setScale(1, 1)
                            // node.setPosition(endX, endY);
                            // node.active = false
                            // playerViewItem.Sprite_piao.active = true
                            // playerViewItem.piao = true
                        },
                        self, null
                    )
                )
            )
        } else {
            // const self = this
            // this.scheduleOnce((dt)=>{
            //     let endX = self.Tmp_Node_Ma.x
            //     let endY = self.Tmp_Node_Ma.y
            //     node.setPosition(endX, endY);
            // }, 1);

            node.setPosition(endX, endY);

            // cc.moveTo(0, endX, endY)
        }
    },
    // 发牌
    sendCard: function() {
        // 发牌后，再次计算牌的张数
        this.initPaiCount();

        // cc.g.hallMgr.inGameMenu.Button_liushui.active = true;

        // 胡的次数
        this.ziHuCount = 0

        // 胡牌提示数组
        this.huPaiAlertArr = []

        this.huCodeArr = []

        // 当前可以胡牌的
        this.huPaiCurrentItem = null

        // 隐藏换牌界面
        this.node_HuaiPai_all_View.active = false
        cc.find("Node_HanPai_All_View/mjhuanpai0", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai1", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai2", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai3", this.node).active = false;

        // 隐藏换牌界面
        this.node_HuaiPai_all_View_Four.active = false
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai0", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai1", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai2", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai3", this.node).active = false;


        // 显示提示文字
        this.Node_Bg_Tips.active = true;

        // 检测断线回来就不执行发牌动画
        // 断线使用
        let canRunAnim = true;
        let playerViewItem = this.playerView[0]
        let hcGroups = playerViewItem.handCardView.hcGroups;
        for (let j = 0; j < hcGroups.length; j++) {
            let groupItem = hcGroups[j]
            if (groupItem.active) {
                let poy = groupItem.y;
                if (poy == 0) {
                    canRunAnim = false;
                    break;
                }
            }
        }

        // 重现排序，断线重连用
        if (!canRunAnim) {
            return;
        }

        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            // 隐藏缺
            e.sprite_hque.active = false

            e.startSendCard();

            if ( i == 0) {
                this.showZeZaoImg(e)
            }
        }

        if (this.getHuanPaiCount()) {
            // 自动提起3张
            this.doAutoSelectThreePai(this.playerView[0])
        } else {
            this.doAutoSelectFourPai(this.playerView[0])
        }
    },
    // 显示动画表情
    showAnmEmoji: function (player, id) {
        this.gameMgr.uidPlayers[player.uid].view.onAnmEmoji(id);
    },
    // 显示互动表情
    getInteractEmoPos:function (from, to,) {
        let pos = {};

        let F = 0;
        let T = 0;

        if (from.uid) {
            F = this.gameMgr.uidPlayers[from.uid].view;
            T = this.gameMgr.uidPlayers[to.uid].view;
        } else {
            F = this.playerView[from];
            T = this.playerView[to];
        }

        pos.from = this.node.convertToNodeSpaceAR(F.headPos);
        pos.to = this.node.convertToNodeSpaceAR(T.headPos)

        return pos;
    },


    // 文字表情
    getPlayerNode: function (player) {
        return this.gameMgr.uidPlayers[player.uid].view;
    },
    getPlayerTalkPos: function (player) {
        let idx = this.gameMgr.uidPlayers[player.uid].view.index;
        if (idx == 0) {
            return cc.Vec2(-50, 0);
        }
        if (idx == 1) {
            return cc.Vec2(-100, 0);
        }
        if (idx == 2) {
            return cc.Vec2(-70, 0);
        }
        if (idx == 3) {
            return cc.Vec2(-20, -30);
        }

        return null;
    },
    

    //********************操作按钮***********************//
    // 复制房间号
    onButtonCopyRoom: function (event, customEventData) {
        /*
        1、点击【复制房间号】，复制房间的基础信息，并给予提示文字“复制成功”，见示意图
        2、发送的文字内容格式：
            房间类型（普通房\茶馆房）-房号-已有人数
            游戏名称,局数,房费类型,人数,加底类型,自摸类型,放炮类型,封顶类型
            注意：只有普通房才带有最后括号里的描述信息
        例如：
            普通房-869023-有2人
            江安大贰,8局,3人,均摊房费,不加底,自摸翻倍,放炮包赔,可查叫,加底,无封顶
        */
       let ri = this.gameMgr.roomInfo;
       let des = '普通房';
       if (ri.clubId) {
           des = '茶馆房'+'('+ri.clubName+' '+'ID:'+ri.clubId+')';
       }
       
        des += '-'+ri.roomId;
        des += '-有'+ Object.keys(this.gameMgr.uidPlayers).length +'人'+'\n';
        // des += cc.g.areaInfo[ri.origin].name + '红中麻将,';
        des += '红中麻将,';
        des += ri.GameNum + '局,';
        des += ri.total + '人';
        
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    des += ',' + rules[e];
                } else {
                    cc.error('红中麻将错误规则ID', e);
                }
            });
        }

        cc.g.utils.setPasteboard(des);
        this.textHint('复制成功');
    },
    // 邀请好友 目前发送的下载地址
    onButtonInvite: function (event, customEventData) {
        let ri = this.gameMgr.roomInfo;

        let gameTypes = cc.g.utils.getJson('GameType');
        let name = gameTypes[ri.gameType] ? gameTypes[ri.gameType].NAME : '红中麻将';
        let title = GameConfig.appName + '<' + name + '>'+ '\n';
        title += '房号:' + ri.roomId + ' ' + (ri.clubId ? '茶馆房' : '普通房');
        
        let desc = [];
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    desc.push(rules[e]);
                } else {
                    cc.error('红中麻将错误规则ID', e);
                }
            });
        }

        //cc.g.utils.shareURLToWX(title, desc.join(','), '', GameConfig.shareUrl + '?user_id=' + cc.g.userMgr.userId.toString() + '&room_id=' + ri.roomId, 0);
        cc.g.utils.shareURLToWX(title, desc.join(','), '', GameConfig.downloadUrl, 0);
    },

    // 离开房间
    onButtonLeave: function (event, customEventData) {
        cc.g.hallMgr.exitGame();
    },
    // 准备
    onButtonReady: function (event, customEventData) {
        this.gameMgr.ready();
        this.buttonReady.active = false;
    },

    doClickedPiao: function (event, customEventData) {
        // this.Node_Piao.active = true
        // this.gameMgr.sendOp(DEF.PlayerOpt.Piao.v, 1);
    },

    doClickedBuPiao: function (event, customEventData) {
        // this.Node_Piao.active = false
        // this.gameMgr.sendOp(DEF.PlayerOpt.Piao.v, 0);
    },
    doReciveCanPiao: function (palyerViewItem) {
        // const self = this
        // let getRelDeskId = palyerViewItem.index
        // self.scheduleOnce((dt)=>{
        //     if (getRelDeskId == 0) {
        //         self.Node_Piao.active = true
        //     }
        //     // 隐藏已经准备
        //     for (let i = 0; i < self.playerView.length; i++) {
        //         self.playerView[i].onStarGame();
        //     }
        // }, 1);
    },
    doRecivePiao: function (palyerViewItem, status) {
        // let getRelDeskId = palyerViewItem.index
        //
        // if (getRelDeskId == 0) {
        //     this.Node_Piao.active = false
        // }
        //
        // palyerViewItem.Sprite_Piao_Img.active = true;
        // palyerViewItem.piao = status
        // if (status == 1) {
        //     palyerViewItem.Sprite_Piao_Img.getComponent(cc.Sprite).spriteFrame = this.majhAtlas0.getSpriteFrame('piao');
        // } else {
        //     palyerViewItem.Sprite_Piao_Img.getComponent(cc.Sprite).spriteFrame = this.majhAtlas0.getSpriteFrame('bupiao');
        // }
    },
    doReciveReConnectPiao: function (palyerViewItem, status) {
        palyerViewItem.Sprite_Piao_Img.active = false;
        // this.Node_Piao.active = false
        this.Node_BaoZi.active = false
        if (status == 1) {
            const self = this
            this.scheduleOnce((dt)=>{
                self.Node_BaoZi.active = true
                self.runBaoZiAnimation(0, self.Node_BaoZi);
                self.isBaoZi = true;
            }, 1);
            // palyerViewItem.Sprite_piao.active = true
            // palyerViewItem.Sprite_piao.getComponent(cc.Sprite).spriteFrame = this.majhAtlas0.getSpriteFrame('yjmj_ma');
        } else {
            this.Node_BaoZi.active = false
            // palyerViewItem.Sprite_piao.active = false;
        }
    },
    doReciveAllPiao: function (palyerViewItem, arr) {
        const self = this
        this.scheduleOnce((dt)=>{
            self.doShowRecieAllHandle(palyerViewItem, arr);
        }, 1);
    },
    doShowRecieAllHandle: function(palyerViewItem, arr) {
        let getRelDeskId = palyerViewItem.index
        if (getRelDeskId == 0) {
            let viewIndex = 0;
            arr.forEach((uid)=>{
                if (viewIndex%2 == 0) { // ID
                    let palyerViewItemOne = this.gameMgr.uidPlayers[uid]
                    let palyerViewItemView = palyerViewItemOne.view
                    if (palyerViewItemOne && palyerViewItemView) {
                        palyerViewItemView.Sprite_Piao_Img.active = false;
                        let status = parseInt(arr[viewIndex+1])
                        // add by panbin
                        palyerViewItemView.piao = status
                        if (status == 1) {
                            palyerViewItemView.Sprite_piao.active = true
                            palyerViewItemView.Sprite_piao.getComponent(cc.Sprite).spriteFrame = this.majhAtlas0.getSpriteFrame('yjmj_ma');
                        } else {
                            palyerViewItemView.Sprite_piao.active = false;
                        }
                    }
                }
                viewIndex++;
            })
        }
    },
    // 收到服务器发牌消息
    doReciveSendCard: function(saiZiArr) {
        // this.Node_gmfreeBtns.active = false;
        //this.gameMgr.roomInfo.status = DEF.RMSTA.SendCard.v;
        // this.roomInfo.cardNum = DEF.ToltalCardNum;
        this.starGame(saiZiArr);
    },
    // 解散
    playerAskJiesan: function (uid, statu) {
        if (! this.jiesanView) {
            let jsv = cc.g.hallMgr.inGameMenu.getJiesanView();

            let view = jsv.getComponent('jiesanRoom');
            view.init();

            view.registeYes(()=>{
                this.gameMgr.sendOp(DEF.PlayerOpt.JiesanVote.v, 1);
            });

            view.registeNo(()=>{
                this.gameMgr.sendOp(DEF.PlayerOpt.JiesanVote.v, 0);
            });

            this.jiesanView = view;
        }

        if (! this.jiesanView.vote) {

            let data = [];
            let name = '';
            let icon = '';
            let votetime = null;
            this.playerView.forEach(v => {
                let p = v.player;
                if (!p) {
                    return;
                }

                let puid = p.d.uid.toNumber ? p.d.uid.toNumber() : p.d.uid;

                if (puid == uid) {
                    name = p.d.name;
                    icon = p.d.icon,
                    votetime = p.votetime;
                    return;
                }

                let o = {
                    uid: puid,
                    name: p.d.name,
                    icon: p.d.icon,
                    sta: p.voteSta ? p.voteSta : 0,
                };

                data.push(o);
            });

            data.unshift({
                uid: uid,
                name: name,
                icon: icon,
                sta: statu,
                time: votetime,
            });

            this.jiesanView.starVote(data);
        }

        let res = this.jiesanView.upPlayer(uid, statu);
        if (res) {
            this.playerView.forEach(v => {
                if (v.player){
                    v.player.voteSta = null;
                }
            });

            this.scheduleOnce((dt)=>{
                this.jiesanView.clear();
            }, 0.5);
        }
    },
    checkCanPlayMj: function() {
        // let canPlay = false;
        // let player = this.playerView[0].player
        // if (player.d.status == LG_Sta.Play.v) {
        //     canPlay = true;
        // }
        // return canPlay;

        let alen = 0;
        let isCanPlay = false;
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.active) {
                alen++;
            }
        }

        if (alen%3 == 2) {
            isCanPlay = true;
        }

        return isCanPlay;
    },
    checkHaveQuePlayMj: function() {
        let isCanPlay = false;
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.active && qiPaiItem.isQue) {
                isCanPlay = true;
                break
            }
        }

        return isCanPlay;
    },


    resetLoaction: function() {
          //  // 重置位置
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        handlePaiArray.forEach((card)=>{
            card.isSelected = false;
            if (card.y != 0) {
                card.setPosition(card.x, 0);
            }
        })
    },
    // 打牌 选牌 都在这里
    onClickQiPaiBtnClicked: function(customData) {
        // let curIndex = parseInt(customData);
        let palyerViewItem = this.playerView[0]
        let player = this.playerView[0].player
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        // 换3张
        // 操作
        if (player.d.status == LG_Sta.CanHuan3.v) { // 换3张操作

            let qiPaiItem = customData//handlePaiArray[curIndex];
            // 红中，则返回

            let checkTong = this.getYaoTongGui()
            if (checkTong) {
                if ((qiPaiItem.code == 1) || (qiPaiItem.code == 11)) {
                    return
                }
            } else {
                if (qiPaiItem.code == 1) {
                    return
                }
            }

            if (qiPaiItem.isSelected) {
                // qiPaiItem.setPosition(qiPaiItem.x, qiPaiItem.endPosY);
                qiPaiItem.setPosition(qiPaiItem.x, 0);
                qiPaiItem.isSelected = false;
            } else {
                // if (qiPaiItem.y > 0) {
                //     qiPaiItem.isSelected = false;
                //     qiPaiItem.setPosition(qiPaiItem.x, 0);
                // } else {
                //     // 判断是否选了3张
                //     if (this.getHuanPaiCount()) {
                //         // 自动提起3张
                //         this.selectThreePai(handlePaiArray);
                //     } else {
                //         this.selectFourPai(handlePaiArray);
                //     }
                //     // 选中棋牌
                //     qiPaiItem.setPosition(qiPaiItem.x, qiPaiItem.y + 30);
                //     qiPaiItem.isSelected = true;
                // }

                // 判断是否选了3张
                if (this.getHuanPaiCount()) {
                    // 自动提起3张
                    this.selectThreePai(handlePaiArray);
                } else {
                    this.selectFourPai(handlePaiArray);
                }
                // 选中棋牌
                qiPaiItem.setPosition(qiPaiItem.x, qiPaiItem.y + 30);
                qiPaiItem.isSelected = true;
            }

            // 改变选牌按钮颜色
            this.changeXuanPaiColor(handlePaiArray)
        } else if (player.d.status == LG_Sta.Play.v) { // 可以打牌了,
            let qiPaiItemTwo = customData

            // // 红中，则返回 或者 显示操作按钮时候 返回
            // if (qiPaiItemTwo.code == 1 || this.Node_HuTiGangView.active || qiPaiItemTwo.zezao) {
            //     return
            // }

            // 红中，则返回 或者 显示操作按钮时候 返回
            // if (qiPaiItemTwo.code == 1 || qiPaiItemTwo.zezao || qiPaiItemTwo.isAutoHu) {
            //     return
            // }
            if (qiPaiItemTwo.code == 1 || qiPaiItemTwo.isAutoHu) {
                return
            }
            if (qiPaiItemTwo.isSelected || qiPaiItemTwo.y > 0) {
                // let canPlay = this.checkCanPlayMj();
                // if (canPlay) {
                //     // 先出牌
                //     this.doPlayMj(palyerViewItem, qiPaiItemTwo.code);
                //
                //     // 打牌
                //     let chicode = [];
                //     chicode.push(qiPaiItemTwo.code)
                //     this.gameMgr.sendOp(DEF.PlayerOpt.DaPai.v, chicode);
                //
                //     // 检测是否有同样的牌
                //     this.doCheckSamePai(-1000);
                // }
                // 是否有报叫
                // if (this.isBaoJiao) {
                //     if (this.doCheckCanPlayDaPai()) {
                //         this.gameMgr.sendOp(DEF.PlayerOpt.Jiao.v, [qiPaiItemTwo.code, 1]);
                //         // this.isBaoJiao = false;
                //         this.saveCurrentPalyerViewItem = null;
                //     } else {
                //         qiPaiItemTwo.setPosition(qiPaiItemTwo.x, 0);
                //     }
                // } else {
                //     if (this.doCheckCanPlayDaPai()) {
                //         // 先出牌
                //         this.doPlayMj(palyerViewItem, qiPaiItemTwo.code);
                //
                //         // 打牌
                //         let chicode = [];
                //         chicode.push(qiPaiItemTwo.code)
                //         this.gameMgr.sendOp(DEF.PlayerOpt.DaPai.v, chicode);
                //     } else {
                //         qiPaiItemTwo.setPosition(qiPaiItemTwo.x, 0);
                //     }
                // }

                if (this.doCheckCanPlayDaPai()) {
                    // 先出牌
                    this.doPlayMj(palyerViewItem, qiPaiItemTwo.code);

                    // 打牌
                    let chicode = [];
                    chicode.push(qiPaiItemTwo.code)
                    this.gameMgr.sendOp(DEF.PlayerOpt.DaPai.v, chicode, this.timeStamp);
                } else {
                    qiPaiItemTwo.setPosition(qiPaiItemTwo.x, 0);
                }

                // 检测是否有同样的牌
                this.doCheckSamePai(-1000);
            } else {
                // 重置位置
                handlePaiArray.forEach((card)=>{
                    card.isSelected = false;
                    card.setPosition(card.x, qiPaiItemTwo.endPosY);
                })
                // 显示选中的
                qiPaiItemTwo.setPosition(qiPaiItemTwo.x, qiPaiItemTwo.y + 30);
                qiPaiItemTwo.isSelected = true;

                if (palyerViewItem.index == 0 && !this.isbpm) {
                    // 胡牌提示数组, 保存胡牌提示
                    this.doCheckHuPaiByCode(qiPaiItemTwo.code, true);

                    // 检测是否有同样的牌
                    this.doCheckSamePai(qiPaiItemTwo.code);
                }
            }
        } else if (player.d.status == LG_Sta.WaitPlay.v) {
            let qiPaiItemTwo = customData

            // 红中，则返回 或者 显示操作按钮时候 返回
            // if (qiPaiItemTwo.code == 1 || this.Node_HuTiGangView.active || qiPaiItemTwo.zezao) {
            //     return
            // }
            if (qiPaiItemTwo.code == 1 || this.Node_HuTiGangView.active) {
                return
            }
            if (qiPaiItemTwo.isSelected || qiPaiItemTwo.y > 0) {
                // 重置回来
                // qiPaiItemTwo.setPosition(qiPaiItemTwo.x, qiPaiItemTwo.endPosY);
                qiPaiItemTwo.setPosition(qiPaiItemTwo.x, 0);
                qiPaiItemTwo.isSelected = false;

                // 检测是否有同样的牌
                this.doCheckSamePai(-1000);
            } else {
                // 重置位置
                handlePaiArray.forEach((card)=>{
                    card.isSelected = false;
                    // card.setPosition(card.x, qiPaiItemTwo.endPosY);
                    card.setPosition(card.x, 0);
                })
                // 显示选中的
                qiPaiItemTwo.setPosition(qiPaiItemTwo.x, qiPaiItemTwo.y + 30);
                qiPaiItemTwo.isSelected = true;

                // 检测是否有同样的牌
                this.doCheckSamePai(qiPaiItemTwo.code);
            }
        }
    },
    getUserPlayerStatus:function() {
        let canPlay = false
        let player = this.playerView[0].player
        if (player.d.status == LG_Sta.Play.v) {
            canPlay = true
        }
        return canPlay
    },
    showHuPaiAlertBtn: function(qicode) {
        // 胡牌提示数组, 保存胡牌提示
        if (!cc.g.utils.judgeArrayEmpty(this.huPaiAlertArr)) {
            for (let i = 0; i < this.huPaiAlertArr.length; i++) {
                let hupaiItem = this.huPaiAlertArr[i]
                if (hupaiItem.outCode == qicode) {
                    this.huPaiCurrentItem = hupaiItem
                    break;
                }
            }
        }

        // 显示胡牌提示按钮
        if (this.huPaiCurrentItem) {
            this.HuNodeTips.active = true;
            // cc.g.hallMgr.inGameMenu.Button_tip.active = true;
        } else {
            this.HuNodeTips.active = false;
            this.doCancelAutoHu();
            // cc.g.hallMgr.inGameMenu.Button_tip.active = false;
        }
    },
    showHuPaiAlertReconBtn: function() {
        if (!cc.g.utils.judgeArrayEmpty(this.huPaiAlertArr)) {
            // 胡牌提示数组, 保存胡牌提示
            this.huPaiCurrentItem = this.huPaiAlertArr[0]
        }

        // 显示胡牌提示按钮
        if (this.huPaiCurrentItem) {
            this.HuNodeTips.active = true;
            // cc.g.hallMgr.inGameMenu.Button_tip.active = true;
        } else {
            this.HuNodeTips.active = false;
            this.doCancelAutoHu();
            // cc.g.hallMgr.inGameMenu.Button_tip.active = false;
        }
    },
    // 任意选3张换牌
    selectThreePai: function(handlePaiArray) {
        let curSelectIndexArr = [];
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.isSelected) {
                curSelectIndexArr.push(qiPaiItem)
            }
        }

        // 已经选了3张了, 还原之前位置
        if (curSelectIndexArr.length >= 3) {
            curSelectIndexArr.forEach(item => {
                // item.setPosition(item.x, item.endPosY);
                item.setPosition(item.x, 0);
                item.isSelected = false
            });
        }
    },
    // 任意选3张换牌
    selectFourPai: function(handlePaiArray) {
        let curSelectIndexArr = [];
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.isSelected) {
                curSelectIndexArr.push(qiPaiItem)
            }
        }

        // 已经选了3张了, 还原之前位置
        if (curSelectIndexArr.length >= 4) {
            curSelectIndexArr.forEach(item => {
                // item.setPosition(item.x, item.endPosY);
                item.setPosition(item.x, 0);
                item.isSelected = false
            });
        }
    },
    checkIsSameMj: function(curArr) {
        let isRangOne = false;
        let isRangTwo = false;
        let isRangThree = false;
        for (let i = 0; i < curArr.length; i++) {
            let code = curArr[i]
            if (code > 1  && code <= 9) {
                isRangOne = true;
            } else if (code >= 11  && code <= 19) {
                isRangTwo = true;
            } else if (code >= 21 && code <= 29) {
                isRangThree = true;
            }
        }

        // 只能有一个为true
        if ((isRangOne && !isRangTwo && !isRangThree) ||
            (!isRangOne && isRangTwo && !isRangThree) ||
            (!isRangOne && !isRangTwo && isRangThree)) {
            return true
        }

        return false;
    },
    // 改变选牌按钮颜色
    changeXuanPaiColor: function(handlePaiArray) {
        let allSelectNum = 0;
        let curSelectNum = 0;
        let curNum = []
        handlePaiArray.forEach(item => {
            if (item.isSelected) {
                curNum.push(item.code)
                allSelectNum++
            }
        });

        if (this.getHuanPaiCount()) {
            curSelectNum = 3;
        } else {
            curSelectNum = 4;
        }

        if (allSelectNum == curSelectNum) {

            // 相同花色
            if (this.getHuanPaiType() == 1) {
                let isSameHuase = this.checkIsSameMj(curNum)
                if (isSameHuase) {
                    this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
                    this.huanPaiBtn.enabled = true
                } else {
                    this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_25');
                    this.huanPaiBtn.enabled = false
                }
            } else {
                this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
                this.huanPaiBtn.enabled = true
            }
        } else {
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_25');
            this.huanPaiBtn.enabled = false
        }
    },
    showHuanPaiAlert:function() {
        let huanType = this.getHuanPaiType();

        if (this.getHuanPaiCount()) { // 换三张
            if (huanType == 1) {// 同花色
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('select_hua_se_bg');
            } else if (huanType == 2) {// 任意换
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('rysan');
            } else if (huanType == 3) {// 混换
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('rysan');
            }
        } else {
            if (huanType == 1) {// 同花色
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('tongsi');
            } else if (huanType == 2) {// 任意换
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('rensi');
            } else if (huanType == 3) {// 混换
                // 设置位灰色按钮
                this.huanSprite.spriteFrame = this.majhAtlas0.getSpriteFrame('rensi');
            }
        }
    },
    // 显示可以换三张
    showCanHuanSanZhang: function (palyerViewItem) {
        this.node_Huanpai.active = true
        this.showHuanPaiAlert();

        //  显示选牌动画
        for (let i = 0; i < this.playerView.length; i++) {
            let player = this.playerView[i]
            if (i != 0) {
                player.showXuanPai();
            }
        }
        //
        // this.scheduleOnce(()=>{
        //     if (this.getHuanPaiCount()) {
        //         // 自动提起3张
        //         this.doAutoSelectThreePai(palyerViewItem);
        //     } else {
        //         this.doAutoSelectFourPai(palyerViewItem);
        //     }
        //
        // }, 2.2);
    },
    // 自动选3张
    doAutoSelectThreePai: function (palyerViewItem) {
        // 可以换三张
        let canHuan = this.getHuanSanZhangRule();
        let checkTong = this.getYaoTongGui()
        if (palyerViewItem.index == 0 && canHuan) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            let selectCodeArr = []

            if (this.getHuanPaiType() > 1) {
                let codeArr = [];
                let tCodeIndex = 11
                if (checkTong) {
                    tCodeIndex = 12
                }
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        codeArr.push(org.code)
                    }
                }


                let allCount = 3;

                let getRemArr = CompColorCodeUtils.compColorArr(codeArr, tCodeIndex, allCount)

                for (let j = 0; j < getRemArr.length; j++) {
                    let remCode = getRemArr[j]
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active && (org.code == remCode)) {
                            // org.setPosition(org.x, org.y + 30);
                            org.setPosition(org.x, 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }
                }
                // for (let i = 0; i < handlePaiArray.length; i++) {
                //     let org = handlePaiArray[i]
                //     if (checkTong) {
                //         if (org.active && (org.code != 1) && (org.code != 11)) {
                //             org.setPosition(org.x, org.y + 30);
                //             org.isSelected = true
                //             selectCodeArr.push(org.code)
                //             if (selectCodeArr.length >= 3) {
                //                 break;
                //             }
                //         }
                //     } else {
                //         if (org.active && (org.code != 1)) {
                //             org.setPosition(org.x, org.y + 30);
                //             org.isSelected = true
                //             selectCodeArr.push(org.code)
                //             if (selectCodeArr.length >= 3) {
                //                 break;
                //             }
                //         }
                //     }
                // }

                // 改变按钮颜色
                // this.node_Huanpai.active = true
                this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
                this.huanPaiBtn.enabled = true
                return
            }

            let tiaoCount = 0;
            let tongCount = 0;
            let wanCount = 0;
            let tCodeIndex = 11
            if (checkTong) {
                tCodeIndex = 12
            }
            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    if (org.code > 1 && org.code<=9) {
                        tiaoCount++;
                    } else if (org.code >= tCodeIndex && org.code<=19) {
                        tongCount++;
                    } else if (org.code >= 21 && org.code<=29) {
                        wanCount++;
                    }
                }
            }

            let x = 0;
            let y = 0;
            let c = 0;

            if (tiaoCount >= 3) {
                x = tiaoCount;
            }

            if (tongCount >= 3) {
                y = tongCount;
            }

            if (wanCount >= 3) {
                c = wanCount;
            }


            if (x > 0 && y > 0 && c > 0) {
                let min = x < y ? (x < c ? x : c)  : (y < c ? y : c);
                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (x == 0 && y > 0 && c > 0) {
                let min = y < c ? y  : c;

                if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y == 0 && c > 0) {
                let min = x < c ? x  : c;

                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y > 0 && c == 0) {
                let min = x < y ? x  : y;
                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y ==0 && c ==0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code > 1 && org.code<=9) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 3) {
                                break;
                            }
                        }
                    }
                }

            } else if (x == 0 && y > 0 && c ==0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code >= tCodeIndex && org.code<=19) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 3) {
                                break;
                            }
                        }
                    }
                }
            } else if (x == 0 && y == 0 && c > 0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code >= 21 && org.code<=29) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 3) {
                                break;
                            }
                        }
                    }
                }
            }

            // 改变按钮颜色
            // this.node_Huanpai.active = true
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
            this.huanPaiBtn.enabled = true
        }
    },
    // 自动选3张
    doAutoSelectFourPai: function (palyerViewItem) {
        // 可以换三张
        let canHuan = this.getHuanSanZhangRule();
        let checkTong = this.getYaoTongGui()
        if (palyerViewItem.index == 0 && canHuan) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            let selectCodeArr = []
            let huanType = this.getHuanPaiType()
            if (huanType > 1) {
                let codeArr = [];
                let tCodeIndex = 11
                if (checkTong) {
                    tCodeIndex = 12
                }
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        codeArr.push(org.code)
                    }
                }

                let allCount = 4;

                let getRemArr = CompColorCodeUtils.compColorArr(codeArr, tCodeIndex, allCount)

                for (let j = 0; j < getRemArr.length; j++) {
                    let remCode = getRemArr[j]
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active && (org.code == remCode)) {
                            // org.setPosition(org.x, org.y + 30);
                            org.setPosition(org.x, 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }
                }

                // 改变按钮颜色
                // this.node_Huanpai.active = true
                this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
                this.huanPaiBtn.enabled = true
                return
            }

            let tiaoCount = 0;
            let tongCount = 0;
            let wanCount = 0;
            let tCodeIndex = 11
            if (checkTong) {
                tCodeIndex = 12
            }

            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    if (org.code > 1 && org.code<=9) {
                        tiaoCount++;
                    } else if (org.code >= tCodeIndex && org.code<=19) {
                        tongCount++;
                    } else if (org.code >= 21 && org.code<=29) {
                        wanCount++;
                    }
                }
            }

            let x = 0;
            let y = 0;
            let c = 0;

            if (tiaoCount >= 4) {
                x = tiaoCount;
            }

            if (tongCount >= 4) {
                y = tongCount;
            }

            if (wanCount >= 4) {
                c = wanCount;
            }


            if (x > 0 && y > 0 && c > 0) {
                let min = x < y ? (x < c ? x : c)  : (y < c ? y : c);
                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (x == 0 && y > 0 && c > 0) {
                let min = y < c ? y  : c;

                if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y == 0 && c > 0) {
                let min = x < c ? x  : c;

                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                }else if (min == wanCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 21 && org.code<=29) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y > 0 && c == 0) {
                let min = x < y ? x  : y;
                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code > 1 && org.code<=9) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (min == tongCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= tCodeIndex && org.code<=19) {
                                org.setPosition(org.x, org.y + 30);
                                org.isSelected = true
                                selectCodeArr.push(org.code)
                                if (selectCodeArr.length >= 4) {
                                    break;
                                }
                            }
                        }
                    }
                }

            } else if (x > 0 && y ==0 && c ==0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code > 1 && org.code<=9) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 4) {
                                break;
                            }
                        }
                    }
                }

            } else if (x == 0 && y > 0 && c ==0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code >= tCodeIndex && org.code<=19) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 4) {
                                break;
                            }
                        }
                    }
                }
            } else if (x == 0 && y == 0 && c > 0) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let org = handlePaiArray[i]
                    if (org.active) {
                        if (org.code >= 21 && org.code<=29) {
                            org.setPosition(org.x, org.y + 30);
                            org.isSelected = true
                            selectCodeArr.push(org.code)
                            if (selectCodeArr.length >= 4) {
                                break;
                            }
                        }
                    }
                }
            }

            // 改变按钮颜色
            // this.node_Huanpai.active = true
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
            this.huanPaiBtn.enabled = true
        }
    },
    // 自动提示定缺
    doAutoDingQueAlert: function (palyerViewItem) {
        if (palyerViewItem.index == 0) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            let x = 0;
            let y = 0;
            let c = 0;

            let tongPreCode = 11
            let checkTong = this.getYaoTongGui()
            if (checkTong) {
                tongPreCode = 12
            }

            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    if (org.code > 1 && org.code<=9) {
                        x++;
                    } else if (org.code >= tongPreCode && org.code<=19) {
                        y++;
                    } else if (org.code >= 21 && org.code<=29) {
                        c++;
                    }
                }
            }

            let queName = 'tiao'
            let min = x < y ? (x < c ? x : c)  : (y < c ? y : c);
            if (min == x) {
                queName = 'tiao'
            } else if (min == y) {
                queName = 'tong'
            } else if (min == c) {
                queName = 'wan'
            }

            return queName;
        }
    },
    // 点击换牌按钮
    clickHanPaiBtn: function () {
        let vaules = [];
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.isSelected) {
                vaules.push(qiPaiItem.code)
            }
        }

        // 发送换牌命令
        this.gameMgr.sendOp(DEF.PlayerOpt.Huan3.v, vaules);
    },
    // 自己换的牌收到消息
    doChangeHanPaiUi: function (curPaiArr, palyerViewItem) {
        let getRelDeskId = palyerViewItem.index
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        if (getRelDeskId == 0 ) {
            curPaiArr.forEach(paiId => {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let orgPai = handlePaiArray[i]
                    if ((parseInt(paiId) == parseInt(orgPai.code)) && orgPai.active) {
                        // 移除手牌
                        orgPai.active = false
                        break;
                    }
                }
            });
        } else {
            // 回放修改 注释掉
            // 任意隐藏3张
            // let viewIndex = 0
            // handlePaiArray.forEach((node)=> {
            //     if (node.active && viewIndex < 3) {
            //         node.active = false;
            //         viewIndex++
            //     }
            // })
            if (this.isbpm) {
                curPaiArr.forEach(paiId => {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let orgPai = handlePaiArray[i]
                        if ((parseInt(paiId) == parseInt(orgPai.code)) && orgPai.active) {
                            // 移除手牌
                            orgPai.active = false
                            break;
                        }
                    }
                });
            } else {
                // 任意隐藏3张
                let viewIndex = 0
                handlePaiArray.forEach((node)=> {
                    if (node.active && viewIndex < 3) {
                        node.active = false;
                        viewIndex++
                    }
                })
            }
        }

        // 重新变化位置
        palyerViewItem.handCardView.updateAllHandleCardPosition();

        // 隐藏节点
        if (getRelDeskId == 0) {
            this.node_Huanpai.active = false
        }

        if (this.getHuanPaiCount()) {
            // 显示换牌页面
            this.node_HuaiPai_all_View.active = true;
            cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = true;
        } else {
            this.node_HuaiPai_all_View_Four.active = true;
            cc.find("Node_HanPai_All_Four_View/yjmjhuanpai"+getRelDeskId, this.node).active = true;
        }
    },
    doChangeReConnectUi: function(palyerViewItem) {
      //  this.node_HuaiPai_all_View.active = false;
        let getRelDeskId = palyerViewItem.index

        // if (this.getHuanPaiCount()) {
        //     cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = false;
        // } else {
        //     cc.find("Node_HanPai_All_Four_View/yjmjhuanpai"+getRelDeskId, this.node).active = false;
        // }

        // this.clearHuanPaiView();

        // 显示换牌节点
        if (getRelDeskId == 0) {
            this.node_Huanpai.active = true
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_25');
            this.huanPaiBtn.enabled = false
            this.showHuanPaiAlert();
        }

        // 选牌状态
        for (let i = 0; i < this.playerView.length; i++) {
            let playerView = this.playerView[i]
            // 可以换三张
            if (i != 0 && (playerView.player && playerView.player.d && (playerView.player.d.status == 2))) {
                playerView.showXuanPai();
            }
        }

        // this.scheduleOnce(()=>{
        //     // 自动提起3张
        //     if (this.getHuanPaiCount()) {
        //         this.doAutoSelectThreePai(palyerViewItem);
        //     } else {
        //         this.doAutoSelectFourPai(palyerViewItem);
        //     }
        // }, 0.4);

        // 自动提起3张
        if (this.getHuanPaiCount()) {
            this.doAutoSelectThreePai(palyerViewItem);
        } else {
            this.doAutoSelectFourPai(palyerViewItem);
        }
    },
    doChangeReConnectHuanSanUi: function(palyerViewItem) {

        let getRelDeskId = palyerViewItem.index

        // 隐藏节点Node_XuanPai
        if (getRelDeskId == 0) {
            this.node_Huanpai.active = false
        }

        // 已经换三张了
        palyerViewItem.hiddenXuanPai();


        if (this.getHuanPaiCount()) {
            // 显示换牌页面
            this.node_HuaiPai_all_View.active = true;
            cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = true;
        } else {
            // 显示换牌页面
            this.node_HuaiPai_all_View_Four.active = true;
            cc.find("Node_HanPai_All_Four_View/yjmjhuanpai"+getRelDeskId, this.node).active = true;
        }
    },
    //  收到通知消息, 更新对应玩家消息
    doShowOtherHuanSanZhangView: function(palyer) {
        let palyerViewItem = this.gameMgr.uidPlayers[palyer.uid]
        if (palyerViewItem && palyerViewItem.view) {
            palyerViewItem.view.hiddenXuanPai();
            this.clearTgTishi(palyer.uid);
            // 移除3张牌
            this.doChangeHanPaiUi(null, palyerViewItem.view)

            this.clearTgTishi(palyer.uid);
        }
    },
    // 收到服务器回复的牌 做换三张动画操作
    doGetServerCards: function (v, palyerViewItem) {
        let handLength = 0;
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        handlePaiArray.forEach(org => {
            if (org.active) {
                handLength++;
            }
        });
        // 断线重连问题,>13 就不执行插牌动画
        if (handLength >=13) {
            return
        }

        // 1、开始播放换牌动画 1.顺时针 2 逆时针 3 对家换
        let deskId = palyerViewItem.index
        let playDir = v[0];
        let self = this
        let paiArr = []
        for (let i = 1; i < v.length; i++) {
            paiArr.push(parseInt(v[i]))
        }
        self.anmView.nodeAninamtion.active = true;
        if (playDir == 1) {
            self.anmView.nodeAninHp.onec(self.anmView.nodeAninHp.names[0], ()=>{
                // 执行换3张操作
                for (let i = 0; i < self.playerView.length; i++) {
                    let playerViewItemTwo = self.playerView[i]
                    if (playerViewItemTwo.index == 0) {
                        self.doInsertHuanCards(paiArr, playerViewItemTwo);
                    } else {
                        self.doInsertHuanCards([0, 0, 0], playerViewItemTwo);
                    }
                }
                self.clearHuanPaiView();
            }, false);
        } else if (playDir == 2) {
            self.anmView.nodeAninHp.onec(self.anmView.nodeAninHp.names[1], ()=>{
                // 执行换3张操作
                for (let i = 0; i < self.playerView.length; i++) {
                    let playerViewItemTwo = self.playerView[i]
                    if (playerViewItemTwo.index == 0) {
                        self.doInsertHuanCards(paiArr, playerViewItemTwo);
                    } else {
                        self.doInsertHuanCards([0, 0, 0], playerViewItemTwo);
                    }
                }
                self.clearHuanPaiView();
            }, false);
        } else {
            self.anmView.nodeAninHp2.onec(self.anmView.nodeAninHp2.names[0], ()=>{
                // 执行换3张操作
                for (let i = 0; i < self.playerView.length; i++) {
                    let playerViewItemTwo = self.playerView[i]
                    if (playerViewItemTwo.index == 0) {
                        self.doInsertHuanCards(paiArr, playerViewItemTwo);
                    } else {
                        self.doInsertHuanCards([0, 0, 0], playerViewItemTwo);
                    }
                }

                self.clearHuanPaiView();
            }, false);
        }
    },
    // 回放，收到服务器回复的牌 做换三张动画操作
    doGetServerCardsBmp: function (v, palyerViewItem) {
        let paiArr = []
        for (let i = 1; i < v.length; i++) {
            paiArr.push(parseInt(v[i]))
        }
        palyerViewItem.huan3Arr = paiArr;
        // 1、开始播放换牌动画 1.顺时针 2 逆时针 3 对家换
        // let playDir = v[0];
        let self = this
        self.doInsertHuanCards(palyerViewItem.huan3Arr, palyerViewItem);
        // self.anmView.nodeAninamtion.active = true;
        // if (playDir == 1) {
        //     self.anmView.nodeAninHp.onec(self.anmView.nodeAninHp.names[0], ()=>{
        //         // 执行换3张操作
        //         // for (let i = 0; i < self.playerView.length; i++) {
        //         //     let playerViewItemTwo = self.playerView[i]
        //             self.doInsertHuanCards(palyerViewItem.huan3Arr, palyerViewItem);
        //         // }
        //     }, false);
        // } else if (playDir == 2) {
        //     self.anmView.nodeAninHp.onec(self.anmView.nodeAninHp.names[1], ()=>{
        //         // 执行换3张操作
        //         // for (let i = 0; i < self.playerView.length; i++) {
        //         //     let playerViewItemTwo = self.playerView[i]
        //             self.doInsertHuanCards(palyerViewItem.huan3Arr, palyerViewItem);
        //         // }
        //     }, false);
        // } else {
        //     self.anmView.nodeAninHp2.onec(self.anmView.nodeAninHp2.names[0], ()=>{
        //         // 执行换3张操作
        //         // for (let i = 0; i < self.playerView.length; i++) {
        //         //     let playerViewItemTwo = self.playerView[i]
        //             self.doInsertHuanCards(palyerViewItem.huan3Arr, palyerViewItem);
        //         // }
        //     }, false);
        // }
    },
    compareArrayTwo:function (val1, val2) {
        return parseInt(val1.code)-parseInt(val2.code);
    },
    // 插入换牌
    doInsertHuanCards: function (huanPaiArr, palyerViewItem) {
        // 手牌数据
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        if (handlePaiArray.length <= 0) {
            return;
        }

        let getRelDeskId = palyerViewItem.index;

        if (!this.isbpm) {
            // 隐藏换牌页面
            this.anmView.nodeAninamtion.active = false;
        }


        if (this.getHuanPaiCount()) {
            this.node_HuaiPai_all_View.active = false;
            cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = false;
        } else {
            this.node_HuaiPai_all_View_Four.active = false;
            cc.find("Node_HanPai_All_Four_View/yjmjhuanpai"+getRelDeskId, this.node).active = false;
        }


        //  换牌的code
        let newPaiCodeArr = [];

        handlePaiArray.forEach(org => {
            if (org.active) {
                newPaiCodeArr.push(org.code)
            }
        });

        if (!this.isbpm) {
            // 判断是否是断线重连回来
            if (newPaiCodeArr.length >= 13) {
                return;
            }
        }


        // 放入换牌数据
        huanPaiArr.forEach(v => {
            newPaiCodeArr.push(v)
        });

        // 重新 设置 牌的面值
        palyerViewItem.handCardView.reCreateHandCard(newPaiCodeArr, getRelDeskId)

        // 回放修改
        // if (getRelDeskId == 0) {
        if (getRelDeskId == 0 || this.isbpm) {
            // 重新排序
            handlePaiArray.sort(this.compareArrayTwo);
        }


        this.doReSortPai(palyerViewItem, false)

        // 更新位置
        palyerViewItem.handCardView.updateAllHandleCardPosition();

        if (!this.isbpm) {
            if (getRelDeskId == 0) {
                palyerViewItem.handCardView.runInsertAction(huanPaiArr)
            }
        }
    },
    // 显示定缺按钮
    doShowDingQue: function (palyerViewItem) {
        // 隐藏票
        // this.Node_Piao.active = false
        // 换三张
        this.node_Huanpai.active = false

        const self = this
        let timerLen = 1;
        if (this.isbpm) {
            timerLen = 0.5;
        }
        this.scheduleOnce(()=>{
             //  获取定缺名字
            let queName = this.doAutoDingQueAlert(palyerViewItem);

            //  显示定缺中动画
            for (let i = 0; i < self.playerView.length; i++) {
                let playerViewItem = self.playerView[i]
                
                if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1))) {
                    playerViewItem.showDingQueing();
                } else {
                    if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1)) {
                        playerViewItem.showDingQue(queName);
                    }
                }
            }
        }, timerLen);
    },
    doShowDingReConnectQue: function (palyerViewItem) {
        // 隐藏换牌界面
        // this.node_HuaiPai_all_View.active = false;
        this.clearHuanPaiView();

        // 换三张
        this.node_Huanpai.active = false

        // if (this.getHuanPaiCount()) {
        //     // 显示换牌页面
        //     this.node_HuaiPai_all_View.active = true;
        //     // cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = true;
        // } else {
        //     // 显示换牌页面
        //     this.node_HuaiPai_all_View_Four.active = true;
        //     // cc.find("Node_HanPai_All_Four_View/yjmjhuanpai"+getRelDeskId, this.node).active = true;
        // }

        const self = this
        // this.scheduleOnce(()=>{
        //     //  获取定缺名字
        //     let queName = this.doAutoDingQueAlert(palyerViewItem);
        //     //  显示定缺中动画
        //     // 选牌状态
        //     for (let i = 0; i < self.playerView.length; i++) {
        //         let playerViewItem = self.playerView[i]
        //
        //         // 可以换三张
        //         if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1))) {
        //             playerViewItem.showDingQueing();
        //         } else {
        //             if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1)) {
        //                 playerViewItem.showDingQue(queName);
        //             }
        //         }
        //     }
        // }, 0.5);
        //  获取定缺名字
        let queName = this.doAutoDingQueAlert(palyerViewItem);
        //  显示定缺中动画
        // 选牌状态
        for (let i = 0; i < self.playerView.length; i++) {
            let playerViewItem = self.playerView[i]

            // 可以换三张
            if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1))) {
                playerViewItem.showDingQueing();
            } else {
                if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < DEF.RMSTA.Ding1.v) && (playerViewItem.player.queIndex == -1)) {
                    playerViewItem.showDingQue(queName);
                }
            }
        }
    },
    // 条
    doClickQueTiao:function () {
        this.gameMgr.sendOp(DEF.PlayerOpt.DingQue.v, [0]);
        let palyerViewItem = this.playerView[0]
        palyerViewItem.hiddenDingQue();
    },
    // 同
    doClickQueTong:function () {
        this.gameMgr.sendOp(DEF.PlayerOpt.DingQue.v, [1]);
        let palyerViewItem = this.playerView[0]
        palyerViewItem.hiddenDingQue();
    },
    // 万
    doClickQueWan:function () {
        this.gameMgr.sendOp(DEF.PlayerOpt.DingQue.v, [2]);
        let palyerViewItem = this.playerView[0]
        palyerViewItem.hiddenDingQue();
    },
    // 打牌操作 显示弃牌
    doPlayMj: function (palyerViewItem, v) {
        // 保存
        this.codeLight = v;
        this.timeStamp = null
        // 关闭
        this.doCloseHuPaiView();

        this.Node_TiFeiView.active = false
        this.Node_PengGang.active = false;

        let getRelDeskId = palyerViewItem.index;

        // this.hidderStartTimer();

        // 播放音频
        this.gameMgr.audio.pai(v, palyerViewItem.player.d.sex);
        this.gameMgr.audio.chupai();

        // 移除特效
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            if (palyerViewItem.player) {
                let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr;
                if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                    qiPaiArr.forEach((card)=>{
                        card.showPoint = false;
                        cc.find("Node_PointView", card).active = false
                    })
                }
            }
        }

        // 收到打牌消息, 其他人隐藏一张
        if (getRelDeskId == 0 || this.isbpm) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;

            // 找最后一个元素
            let lastOne = null;
            handlePaiArray.forEach((item)=>{
                if (item.active) {
                    lastOne = item
                }
            })

            // 是否打的最后一张
            let isPlayLastOne = false;
            // code 相同 是最后一张
            if ((lastOne!=null) && (v == parseInt(lastOne.code))) {
                isPlayLastOne = true;
            }

            // 隐藏打出去的牌
            for (let i = 0; i < handlePaiArray.length; i++) {
                let hanldeItem = handlePaiArray[i]
                if ((hanldeItem.active) && (parseInt(hanldeItem.code) == v)) {
                    hanldeItem.active = false;
                    hanldeItem.isSelected = false;
                    // 重置位置
                    hanldeItem.setPosition(hanldeItem.x, hanldeItem.endPosY);
                    break;
                }
            }

            // 手牌排序
            handlePaiArray.sort(this.compareArrayTwo);

            // 显示缺的牌
            this.showZeZaoImg(palyerViewItem)

            // 隐藏胡牌提示
            this.hiddenHuPaiImg();

            // add by panbin
            this.doReSortPai(palyerViewItem, false);

            // 打的最后一张，不做动画
            if ((lastOne!= null) && !isPlayLastOne && lastOne.needAnim) {
                // 做动画
                palyerViewItem.handCardView.animatInsertOneCard(lastOne);
                lastOne.needAnim = false;
            }

            // 隐藏胡提杠按钮
            this.Node_HuTiGangView.active = false
            this.Node_HuTiGangViewCancle.active = false

            // // // 胡牌提示数组, 保存胡牌提示
            // this.showHuPaiAlertBtn(v);

            // 每次摸牌都判断胡牌提示
            if (getRelDeskId == 0) {
                this.doCheckHuPaiByCode(v, false);
            }
        } else {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            if (this.isbpm) {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let hanldeItem = handlePaiArray[i]
                    if (hanldeItem.active && (parseInt(hanldeItem.code) == v)) {
                        hanldeItem.active = false;
                        break;
                    }
                }

                this.doReSortPai(palyerViewItem, false);
            } else {
                for (let i = 0; i < handlePaiArray.length; i++) {
                    let hanldeItem = handlePaiArray[i]
                    if (hanldeItem.active) {
                        hanldeItem.active = false;
                        break;
                    }
                }
            }

            // 更新手牌
            // 重新变化位置
            palyerViewItem.handCardView.updateAllHandleCardPosition();
        }

        palyerViewItem.qiCardView.doAddOneQiPai(v);
    },
    textHint: function (text) {
        text = text ? text : '???';
        cc.g.global.hint(text);
    },
    setTimeStampVa: function(timeStamp) {
        if (!cc.g.utils.judgeStringEmpty(timeStamp)) {
            this.timeStamp = timeStamp
        }
    },
    // 显示操作按钮
    upOperate: function () {
        let btn = [this.Button_Hu, this.Button_Ti, this.Button_Gang, this.Button_Fei, this.Button_Peng, this.Button_Guo];
        btn.forEach(e => {
            e.active = false;
        });

        this.Node_HuTiGangView.active = false
        if (!this.playerView[0].player) {
            return;
        }
        let obks = this.playerView[0].player.obks;
        if (!obks) {
            return;
        }
        if (obks.length<0) {
            cc.error(this.dbgstr('initOperate ') + " 错误的操作数量 ")
            return;
        }

        if ((obks.length == 1) && (obks[0] == 5)) {
            cc.error('不显示单个过按钮...')
            return;
        }

        let isShowBtns = false;
        obks.forEach(e => {
            if (e < 0) {
                cc.error('出现尚未支持的操作');
                return;
            }
            if (e <= (btn.length - 1)) {
                btn[e].active = true;
                isShowBtns = true;
            }
        });

        // 是否需要显示按钮
        this.Node_HuTiGangView.active = isShowBtns

        // 显示过按钮
        if (isShowBtns) {
            let lastLength = btn.length - 1;
            btn[lastLength].active = true;
            // 修改玩家状态
            let player = this.playerView[0].player
            // 不可以操作牌
            let isCanPlay = this.doCheckCanPlayDaPai()
            if (isCanPlay) {
                player.d.status = LG_Sta.Play.v
            } else {
                player.d.status = LG_Sta.BtnPaly.v
            }
        }
        // 更新倒计时
        // this.playerView[0].upDaojishi();
    },
    doCheckCanPlayDaPai: function() {
        let alen = 0;
        let isCanPlay = false;
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.active) {
                alen++;
            }
        }

        if (alen%3 == 2) {
            isCanPlay = true;
        }

        return isCanPlay;
    },
    // 更新倒计时
    upDaojishi: function () {
        if (!this.player) {
            return;
        }

        if (!this.daojishi) {
            return;
        }

        if (this.pPage.isbpm) {
            this.daojishi.active = false;
            return;
        }

        let p = this.player;

        if (p.time >= 0) {
            this.daojishi.active = true;
            this.djsTime.string = p.time;

            if (! this.isSchdjs) {
                this.schedule(this.timeSch, 1);
                this.isSchdjs = true;
            }
        } else {
            this.daojishi.active = false;
            this.djsTime.string = 0;

            if (this.isSchdjs) {
                this.unschedule(this.timeSch);
                this.isSchdjs = false;
            }
        }
    },
    // 胡牌按钮点击
    doClickHu: function () {
        // 隐藏倒计时
        this.hidderStartTimer();
        let canOptVal = this.playerView[0].player.canOptVal;
        // 胡牌
        this.gameMgr.sendOp(DEF.PlayerOpt.Hu.v, canOptVal, this.timeStamp);
        // this.Node_HuTiGangView.active = false

        this.doHiddenHutiGang();
    },
    // 显示杠牌操作
    showSelectTiView: function(arr) {
        this.Node_PengGang.active = true;
        this.Sprite_Center_Title.spriteFrame = this.majhAtlas0.getSpriteFrame('mult_ti');
        this.huTi_Node_Layout.removeAllChildren(true);

        let itemArr = []
        let viewIndex = 0
        let lastOneX = 0
        arr.forEach((code)=>{
            let hcPrefab = this.SIPlayerPf4;
            let cardNode = cc.instantiate(hcPrefab);
            // 设置
            cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
            cardNode.active = true;
            cardNode.code = code
            //
            lastOneX = viewIndex *  DEF.hcMultHuTiPos[0].moveBy.z + (viewIndex + 1) * (DEF.hcMultHuTiPos[0].moveBy.z/2)
            // 添加点击事件
            cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickTiClicked', cardNode);
            // nodejs
            this.huTi_Node_Layout.addChild(cardNode, 1, 'Node_card_Num'+viewIndex);
            // get card node
            itemArr.push(cardNode)
            viewIndex++;
        })

        if (arr.length > 2) {
            // 背景宽度
            let bgWith = lastOneX

            let positionH = this.huTi_Sprite_bg.height

            this.huTi_Sprite_bg.setContentSize(bgWith, positionH)
        }  else {
            this.huTi_Sprite_bg.setContentSize(230, 121)
        }
    },
    onClickTiClicked: function(node) {
        this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, [node.getCurrentTarget().code], this.timeStamp);
        // this.Node_HuTiGangView.active = false
        this.Node_PengGang.active = false;

        this.doHiddenHutiGang();
    },
    onClickTiMultClicked: function(event, codeStr) {
        let codeArr = codeStr.split(',')
        this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, codeArr, this.timeStamp);
        this.Node_TiFeiView.active = false
        this.Node_PengGang.active = false;
        this.doHiddenHutiGang();
    },

    initTiMultView: function(comPongArr, initIndex) {
        this.All_Node_view = cc.find("All_Node_view", this.Node_TiFeiView);
        this.All_Node_view.removeAllChildren(true);
        let index = initIndex;
        let len = comPongArr.length
        comPongArr.forEach((itemArr) => {
            let cardNode = cc.instantiate(this.tiPengViewPf);
            let node_ti = cc.find("Node_Ti", cardNode)
            let Sprite_cardVal = cc.find("majhCardP0/Sprite_cardVal", cardNode).getComponent(cc.Sprite);
            if (index == 0) {
                Sprite_cardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_1');
            } else if (index == 1) {
                Sprite_cardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_11');
            }

            let guiVaule = 1;
            if (index == 0) {
                guiVaule = 1;
            } else if (index == 1) {
                guiVaule = 11;
            }

            if (len == 2) {
                if (index == 0) {
                    node_ti.active = true;
                } else if (index == 1) {
                    node_ti.active = false;
                }
            } else {
                node_ti.active = true;
            }

            let sv_peng_info = cc.find("ScrollView_huifo", cardNode).getComponent(cc.ScrollView);
            sv_peng_info.content.removeAllChildren(true);
            itemArr.forEach((cardCode)=>{
                let cardPaiNode = cc.instantiate(this.tiPengCardPf);
                let Sprite_Code_CardVal = cc.find("Sprite_cardVal", cardPaiNode).getComponent(cc.Sprite);
                Sprite_Code_CardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardCode);
                // cc.g.utils.removeClickAllEvent(cardPaiNode);

                cc.g.utils.addClickEvent(cardPaiNode, this.node, 'yjmj', 'onClickTiMultClicked', cardCode+','+guiVaule);
                sv_peng_info.content.addChild(cardPaiNode);
            })

            this.All_Node_view.addChild(cardNode);

            index++
        })
    },
    // 提牌按钮点击
    doClickTi: function () {
        let newRlue = this.gameMgr.roomInfo.NewRlue

        let comPongArr =  penGangUtils.computeTi(this.doGetPassPongArr(), this.doGetHandleArr(), newRlue);

        if (!cc.g.utils.judgeArrayEmpty(comPongArr) && (comPongArr.length == 2)) {
            let jiArr = comPongArr[0]
            let tongArr = comPongArr[1]
            let arr = []
            let initIndex = 0
            if ((!cc.g.utils.judgeArrayEmpty(jiArr)) && (!cc.g.utils.judgeArrayEmpty(tongArr))) {
                arr.push(jiArr)
                arr.push(tongArr)

                this.Node_TiFeiView.active = true
                this.initTiMultView(arr, initIndex)
            } else if (!cc.g.utils.judgeArrayEmpty(jiArr)) {
                arr.push(jiArr)
                let lenJi = jiArr.length
                if (lenJi > 1) {
                    this.Node_TiFeiView.active = true
                    this.initTiMultView(arr, initIndex)
                } else {
                    let vaule = jiArr[0]
                    let canOptVal = [vaule+'', '1']
                    this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, canOptVal, this.timeStamp);
                    this.doHiddenHutiGang();
                }
            } else if (!cc.g.utils.judgeArrayEmpty(tongArr)) {
                arr.push(tongArr)
                initIndex = 1
                let lenTong = tongArr.length
                if (lenTong > 1) {
                    this.Node_TiFeiView.active = true
                    this.initTiMultView(arr, initIndex)
                } else {
                    let vaule = tongArr[0]
                    let canOptVal = [vaule+'', '11']
                    this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, canOptVal, this.timeStamp);
                    this.doHiddenHutiGang();
                }
            }
        }

        // let canOptVal = this.playerView[0].player.canOptVal;
        // // 首先遍历手牌数据, 必须遍历手牌数据，
        // let palyerViewItem = this.playerView[0]
        // let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        // let pongPaiArray = palyerViewItem.pongCardView.pongPaiArr;
        //
        // //  提牌 code
        // let feiCode = []
        // for (let i = 0; i < pongPaiArray.length; i++) {
        //     let pong = pongPaiArray[i]
        //     // if (pong.type == 'fei') { //找到飞牌
        //     //     for (let j = 0; j < handlePaiArray.length; j++) { // 手牌中找对应的飞牌
        //     //         let handleItem = handlePaiArray[j]
        //     //         if ((handleItem.code == pong.code) && (handleItem.active)) {
        //     //             feiCode.push(handleItem.code)
        //     //             break;
        //     //         }
        //     //     }
        //     // }
        //     for (let j = 0; j < handlePaiArray.length; j++) { // 手牌中找对应的飞牌
        //         let handleItem = handlePaiArray[j]
        //         if ((handleItem.code == pong.code) && (handleItem.active)) {
        //             feiCode.push(handleItem.code)
        //             break;
        //         }
        //     }
        // }
        //
        // if (!cc.g.utils.judgeArrayEmpty(feiCode)) {
        //     if (feiCode.length > 1) {
        //         // 选牌
        //         this.showSelectTiView(feiCode)
        //     } else {
        //         // 发提牌指令
        //         this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, feiCode);
        //         // this.Node_HuTiGangView.active = false
        //         this.doHiddenHutiGang();
        //     }
        // }
    },
    // doReciveTi: function(palyerViewItem, v, gui) {
    //     let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
    //     //  显示定时器
    //     this.startTimer(getRelDeskId)
    //
    //     // 播放动画
    //     // this.doPlayHuTiGangAnim(2);
    //     palyerViewItem.doPlayHuTiGangAnim(2);
    //
    //     // 播放音频
    //     this.gameMgr.audio.pai('ti', palyerViewItem.player.d.sex);
    //
    //     // let handlePaiArray = palyerViewItem.handCardView.hcGroups;
    //
    //     if (palyerViewItem.index == 0 || this.isbpm) {
    //         // 改变手牌的位置 先修改ui
    //         palyerViewItem.handCardView.changeHandleCardZhong(v, gui, palyerViewItem.index)
    //     }
    //
    //     // 手牌排序
    //     // handlePaiArray.sort(this.compareArrayTwo);
    //
    //     // 显示碰或者杠的UI
    //     palyerViewItem.pongCardView.doChangeZhongPai(v, gui);
    //     palyerViewItem.pongCardView.updateAllPongCardPosition();
    //
    //     if (palyerViewItem.index == 0) {
    //         // add by panbin
    //         this.doReSortPai(palyerViewItem, false);
    //     } else {
    //         palyerViewItem.handCardView.updateAllHandleCardPosition();
    //     }
    //
    //     if (getRelDeskId == 0 && !this.isbpm) {
    //         // 胡牌提示
    //         this.doCheckHuPai();
    //     }
    // },
    doReciveTi: function(palyerViewItem, v, gui) {
        cc.g.utils.backPlayScaleBtnEffct(this.Button_Ti);

        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        // this.doPlayHuTiGangAnim(2);
        palyerViewItem.doPlayHuTiGangAnim(2);

        // 播放音频
        this.gameMgr.audio.pai('ti', palyerViewItem.player.d.sex);

        // let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (palyerViewItem.index == 0 || this.isbpm) {
            // 改变手牌的位置 先修改ui
            palyerViewItem.handCardView.changeHandleCardZhong(v, gui, palyerViewItem.index)
        }

        // 手牌排序
        // handlePaiArray.sort(this.compareArrayTwo);

        // 显示碰或者杠的UI
        palyerViewItem.pongCardView.doChangeZhongPai(v, gui);
        palyerViewItem.pongCardView.updateAllPongCardPosition();

        if (palyerViewItem.index == 0) {
            // add by panbin
            this.doReSortPai(palyerViewItem, false);
        } else {
            palyerViewItem.handCardView.updateAllHandleCardPosition();
        }
        //
        // if (getRelDeskId == 0 && !this.isbpm) {
        //     // 胡牌提示
        //     this.doCheckHuPai();
        // }
    },
    doReciveTiTwo: function(palyerViewItem, gui) {
        cc.g.utils.backPlayScaleBtnEffct(this.Button_Ti);

        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        // //  显示定时器
        // this.startTimer(getRelDeskId)
        //
        // // 播放动画
        // // this.doPlayHuTiGangAnim(2);
        // palyerViewItem.doPlayHuTiGangAnim(2);
        //
        // // 播放音频
        // this.gameMgr.audio.pai('ti', palyerViewItem.player.d.sex);

        // let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (palyerViewItem.index == 0 || this.isbpm) {
            // 改变手牌的位置 先修改ui
            palyerViewItem.handCardView.changeHandleCardZhongTwo(gui, palyerViewItem.index)
        }

        // 手牌排序
        // handlePaiArray.sort(this.compareArrayTwo);

        // // 显示碰或者杠的UI
        // palyerViewItem.pongCardView.doChangeZhongPai(v, gui);
        // palyerViewItem.pongCardView.updateAllPongCardPosition();

        if (palyerViewItem.index == 0) {
            // add by panbin
            this.doReSortPai(palyerViewItem, false);
        } else {
            palyerViewItem.handCardView.updateAllHandleCardPosition();
        }

        if (getRelDeskId == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai();
        }
    },
    // // 显示杠牌操作
    // showSelectGangView: function(arr) {
    //     this.Node_PengGang.active = true;
    //     this.Sprite_Center_Title.spriteFrame = this.majhAtlas0.getSpriteFrame('mult_gang');
    //     // this.Sprite_Center_Title.spriteFrame = this.majhAtlas0.getSpriteFrame('mult_ti');
    //     this.huTi_Node_Layout.removeAllChildren(true);
    //
    //     let itemArr = []
    //     let viewIndex = 0
    //     let lastOneX = 0
    //     arr.forEach((code)=>{
    //         let hcPrefab = this.SIPlayerPf4;
    //         let cardNode = cc.instantiate(hcPrefab);
    //         // 设置
    //         cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
    //         cardNode.active = true;
    //         cardNode.code = code
    //         //
    //         lastOneX = viewIndex *  DEF.hcMultHuTiPos[0].moveBy.z + (viewIndex + 1) * (DEF.hcMultHuTiPos[0].moveBy.z/2)
    //         // 添加点击事件
    //         cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickGangClicked', cardNode);
    //         // nodejs
    //         this.huTi_Node_Layout.addChild(cardNode, 1, 'Node_card_Num'+viewIndex);
    //         // get card node
    //         itemArr.push(cardNode)
    //         viewIndex++;
    //     })
    //
    //     if (arr.length > 2) {
    //         // 背景宽度
    //         let bgWith = lastOneX
    //
    //         let positionH = this.huTi_Sprite_bg.height
    //
    //         this.huTi_Sprite_bg.setContentSize(bgWith, positionH)
    //     } else {
    //         this.huTi_Sprite_bg.setContentSize(230, 121)
    //     }
    // },
    // doCloseGangSelectView: function() {
    //     this.Node_PengGang.active = false;
    // },
    // 显示杠牌操作
    showSelectGangView: function(arr) {
        this.Node_PengGang.active = true;
        this.Sprite_Center_Title.spriteFrame = this.majhAtlas0.getSpriteFrame('mult_gang');
        // this.Sprite_Center_Title.spriteFrame = this.majhAtlas0.getSpriteFrame('mult_ti');
        this.huTi_Node_Layout.removeAllChildren(true);

        let itemArr = []
        let viewIndex = 0
        let lastOneX = 0
        arr.forEach((code)=>{
            let hcPrefab = this.SIPlayerPf4;
            let cardNode = cc.instantiate(hcPrefab);
            // 设置
            cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
            cardNode.active = true;
            cardNode.code = code
            //
            lastOneX = viewIndex *  DEF.hcMultHuTiPos[0].moveBy.z + (viewIndex + 1) * (DEF.hcMultHuTiPos[0].moveBy.z/2)
            // 添加点击事件
            cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickGangClicked', cardNode);
            // nodejs
            this.huTi_Node_Layout.addChild(cardNode, 1, 'Node_card_Num'+viewIndex);
            // get card node
            itemArr.push(cardNode)
            viewIndex++;
        })

        if (arr.length > 2) {
            // 背景宽度
            let bgWith = lastOneX

            let positionH = this.huTi_Sprite_bg.height

            this.huTi_Sprite_bg.setContentSize(bgWith, positionH)
        } else {
            this.huTi_Sprite_bg.setContentSize(230, 121)
        }
    },
    onClickGangClicked: function(node) {
        this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, [node.getCurrentTarget().code], this.timeStamp);
        this.Node_PengGang.active = false;
        this.doHiddenHutiGang();
    },
    onClickGangMultClicked: function(event, cardCodeArr) {
        this.clearTgTishi(this.gameMgr.selfUID);
        this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, cardCodeArr, this.timeStamp);
        this.Node_PengGang.active = false;
        this.Node_MultGanView.active = false
        this.doHiddenHutiGang();
    },
    initGangMultView: function(comPongArr, isFei) {
        let sv_gang_info = cc.find("ScrollView_huifo", this.Node_MultGanView).getComponent(cc.ScrollView);
        sv_gang_info.content.removeAllChildren(true);

        if (isFei) {
            this.Sprite_Imgs_penggang.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('mj_peng');
        } else {
            this.Sprite_Imgs_penggang.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('mj_gang');
        }

        comPongArr.forEach((itemArr) => {
            let cardNode = null;
            let len = itemArr.length
            if (len == 5) {
                let type = itemArr[0]
                if (type == 1) {
                    let typeCode = itemArr[1]
                    cardNode = cc.instantiate(this.anGangCardPf);
                    let Sprite_Code_CardVal = cc.find("Layout_Top/Sprite_Gang0/Sprite_Val", cardNode).getComponent(cc.Sprite);
                    Sprite_Code_CardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + typeCode);

                    let jNum = 0
                    let tNum = 0
                    for (let i = 1; i < itemArr.length; i++) {
                        let code = itemArr[i]
                        if (code == 1) {
                            jNum++
                        } else if (code == 11) {
                            tNum++
                        }
                    }

                    let zhognLabel = cc.find("Layout_Top/Sprite_Gang0/Label_Zhong", cardNode).getComponent(cc.Label);

                    if ((jNum > 0) && (tNum > 0)) {
                        zhognLabel.node.active = true;
                        zhognLabel.string = jNum + "鸡" + tNum+ "筒";
                    } else if ((jNum == 0) && (tNum > 0)) {
                        zhognLabel.node.active = true;
                        zhognLabel.string = tNum+ "筒";
                    } else if ((jNum > 0) && (tNum == 0)) {
                        zhognLabel.node.active = true;
                        zhognLabel.string = jNum + "鸡";
                    } else {
                        zhognLabel.node.active = false;
                    }

                    // cc.g.utils.removeClickAllEvent(cardNode);
                    cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickGangMultClicked', itemArr);
                    sv_gang_info.content.addChild(cardNode);
                } else if (type == 2 || type == 3) {
                    cardNode = cc.instantiate(this.mingGangCardPf);

                    let Sprite_Code_CardVal = cc.find("Layout_Top/Sprite_Gang0/Sprite_Val", cardNode).getComponent(cc.Sprite);
                    Sprite_Code_CardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[1]);

                    let Sprite_Code_CardVal1 = cc.find("Layout_Top/Sprite_Gang1/Sprite_Val", cardNode).getComponent(cc.Sprite);
                    Sprite_Code_CardVal1.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[2]);

                    let Sprite_Code_CardVal2 = cc.find("Layout_Top/Sprite_Gang2/Sprite_Val", cardNode).getComponent(cc.Sprite);
                    Sprite_Code_CardVal2.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[3]);

                    let Sprite_Code_CardVal3 = cc.find("Layout_Top/Sprite_Gang3/Sprite_Val", cardNode).getComponent(cc.Sprite);
                    Sprite_Code_CardVal3.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[4]);

                    // cc.g.utils.removeClickAllEvent(cardNode);
                    cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickGangMultClicked', itemArr);
                    sv_gang_info.content.addChild(cardNode);
                }
            } else {
                cardNode = cc.instantiate(this.pengCardPf);
                let Sprite_Code_CardVal = cc.find("Layout_Top/Sprite_Peng0/Sprite_Val", cardNode).getComponent(cc.Sprite);
                Sprite_Code_CardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[0]);

                let Sprite_Code_CardVal1 = cc.find("Layout_Top/Sprite_Peng1/Sprite_Val", cardNode).getComponent(cc.Sprite);
                Sprite_Code_CardVal1.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[1]);

                let Sprite_Code_CardVal2 = cc.find("Layout_Top/Sprite_Peng2/Sprite_Val", cardNode).getComponent(cc.Sprite);
                Sprite_Code_CardVal2.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + itemArr[2]);

                // cc.g.utils.removeClickAllEvent(cardNode);
                if (isFei) {
                    cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickFeiMultClicked', itemArr);
                } else {
                    cc.g.utils.addClickEvent(cardNode, this.node, 'yjmj', 'onClickPengMultClicked', itemArr);
                }

                sv_gang_info.content.addChild(cardNode);
            }
        })
    },
    // 杠牌按钮点击
    doClickGang: function () {
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let palyerViewItem = this.playerView[0]
        let queIndex = palyerViewItem.player.queIndex;
        let comPongArr =  penGangUtils.computeGang(this.doGetPongArr(), this.doGetHandleArr(), this.codeLight, newRlue, queIndex);
        if (!cc.g.utils.judgeArrayEmpty(comPongArr)) {
            let len = comPongArr.length
            if (len > 1) {
                this.Node_MultGanView.active = true
                this.initGangMultView(comPongArr, false)
            } else {
                this.clearTgTishi(this.gameMgr.selfUID);
                let canOptVal = comPongArr[0]
                this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, canOptVal, this.timeStamp);
                this.Node_PengGang.active = false;
                this.doHiddenHutiGang();
            }
        }
    },
    doOrginGang: function() {
        // 隐藏倒计时
        // this.hidderStartTimer();
        // 杠牌，有几种情况
        let canOptVal = this.playerView[0].player.canOptVal;
        // 检查是否有多张杠牌
        // 1、拿摸的牌去碰牌里面检测
        // 2、检测手牌是否有杠
        let pongArr = []
        let pongPaiArr = this.playerView[0].pongCardView.pongPaiArr;
        // let realCode = parseInt(canOptVal[0])
        // // 1、检测摸牌和碰牌是否相等
        // if (!cc.g.utils.judgeArrayEmpty(pongPaiArr)) {
        //     pongPaiArr.forEach((pong)=> {
        //         if ((pong.type == 'peng') && (pong.code == realCode)) {
        //             pongArr.push(pong)
        //         }
        //     })
        // }

        // 2、首先遍历手牌数据
        let handlePaiArray = this.playerView[0].handCardView.hcGroups;

        // 手牌排序
        handlePaiArray.sort(this.compareArrayTwo);

        // 去掉隐藏的
        let newHandArr = [];
        handlePaiArray.forEach(org => {
            if (org.active) {
                newHandArr.push(org)
            }
        });

        // 3、检测手牌中，是否有碰牌
        if (!cc.g.utils.judgeArrayEmpty(pongPaiArr)) {
            pongPaiArr.forEach((pong)=> {
                newHandArr.forEach(hNode=>{
                    if (((pong.type == 'peng') || (pong.type == 'fei')) && (pong.code == hNode.code)) {
                        pongArr.push(pong)
                    }
                })
            })
        }

        let resArr = []
        // 找手牌重复的个数
        for (let i = 0; i < newHandArr.length;) {
            let count = 0;
            for (var j = i; j < newHandArr.length; j++) {
                if (newHandArr[i].code == newHandArr[j].code) {
                    count++;
                }
            }
            resArr.push([newHandArr[i], count]);
            i += count;
        }

        // 重复4次为4的，则为杠牌
        let repeatArr = []
        let isAnCanGang = true

        // // let palyerViewItem = this.playerView[0]
        // let player = this.playerView[0].player

        for (let i = 0; i < resArr.length; i++) {
            // 重复次数
            let recountNum = resArr[i][1]
            // 4次
            if (recountNum == 4) {
                let cardObj = resArr[i][0]

                if (this.getYaoTongGui()) {
                    if ((cardObj.code != 1) && (cardObj.code != 11)) { // 排除红中
                        repeatArr.push(cardObj)
                    }
                } else {
                    if (cardObj.code != 1) { // 排除红中
                        repeatArr.push(cardObj)
                    }
                }
            } else if (recountNum == 3) {
                let cardObj = resArr[i][0]


                if (this.getYaoTongGui()) {
                    if ((cardObj.code != 1) && (cardObj.code != 11)) { // 排除红中
                        if (cardObj.code == this.codeLight) { // 3个的
                            isAnCanGang = false
                        }
                    }
                } else {
                    if (cardObj.code != 1) { // 排除红中
                        if (cardObj.code == this.codeLight) { // 3个的
                            isAnCanGang = false
                        }
                    }
                }
            }
        }

        // 优先处理别人打的杠牌
        if (!isAnCanGang) {
            this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, this.codeLight, this.timeStamp);
            this.doHiddenHutiGang();
        } else {
            // 有多张杠牌
            let canGangCount = repeatArr.length + pongArr.length

            // 有多张杠牌，显示选择UI
            if (canGangCount > 1) {
                let allGangArr = []
                if (!cc.g.utils.judgeArrayEmpty(repeatArr)) {
                    repeatArr.forEach((anItem)=>{
                        allGangArr.push(parseInt(anItem.code))
                    })
                }

                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    pongArr.forEach((pItem)=>{
                        allGangArr.push(parseInt(pItem.code))
                    })
                }



                // 检测花色
                let huaArr = this.doCheckHuaZhu(pongPaiArr);

                let tong = huaArr[0]
                let tiao = huaArr[1]
                let wan = huaArr[2]

                let newAllGang = []

                if (!cc.g.utils.judgeArrayEmpty(allGangArr)) {
                    allGangArr.forEach((code)=>{
                        if ((tong == 1) && (tiao == 1)) {
                            if (code > 0 && code < 10) {
                                newAllGang.push(code)
                            } else if (code > 10 && code < 20) {
                                newAllGang.push(code)
                            }
                        } else if ((tong == 1) && (wan == 1)) {
                            if (code > 0 && code < 10) {
                                newAllGang.push(code)
                            } else if (code > 20 && code < 30) {
                                newAllGang.push(code)
                            }
                        } else if ((tiao == 1) && (wan == 1)) {
                            if (code > 10 && code < 20) {
                                newAllGang.push(code)
                            } else if (code > 20 && code < 30) {
                                newAllGang.push(code)
                            }
                        }
                    })

                    if (cc.g.utils.judgeArrayEmpty(newAllGang)) {
                        newAllGang = allGangArr
                    }
                }


                if (!cc.g.utils.judgeArrayEmpty(newAllGang)) {
                    if (newAllGang.length > 1) {
                        // 杠牌
                        this.showSelectGangView(newAllGang)
                    } else {
                        // 直接发送
                        let gangCode = newAllGang[0]
                        this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, [gangCode], this.timeStamp);
                        this.doHiddenHutiGang();
                    }
                }

                // 杠牌
                // this.showSelectGangView(allGangArr)
            } else {
                if (!cc.g.utils.judgeArrayEmpty(repeatArr) && isAnCanGang) { // 暗杠 服务器不推消息，自己遍历发送消息
                    // 默认杠下牌 // 暗杠
                    let repeatObj = repeatArr[0]
                    this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, [repeatObj.code], this.timeStamp);
                    this.doHiddenHutiGang();
                } else if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let pongObj = pongArr[0]
                    this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, [pongObj.code], this.timeStamp);
                    this.doHiddenHutiGang();
                } else { // 明杠
                    this.gameMgr.sendOp(DEF.PlayerOpt.Gang.v, canOptVal, this.timeStamp);
                    this.doHiddenHutiGang();
                }
            }
        }
    },
    doCheckHuaZhu: function(pongArr) {
        // 同 条 万
        let huaArr = [0, 0, 0]
        if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
            pongArr.forEach((node)=>{
                // if ((node.type == 'mkang') || (node.type == 'akang')) {
                //     if (node.code > 0 && node.code < 10) {
                //         huaArr[0] = 1;
                //     } else if (node.code > 10 && node.code < 20) {
                //         huaArr[1] = 1;
                //     } else if (node.code > 20 && node.code < 30) {
                //         huaArr[2] = 1;
                //     }
                // }
                if (node.code > 0 && node.code < 10 ) {
                    huaArr[0] = 1;
                } else if (node.code > 10 && node.code < 20) {
                    huaArr[1] = 1;
                } else if (node.code > 20 && node.code < 30) {
                    huaArr[2] = 1;
                }
            })
        }
        return huaArr;
    },
    doRealMoPaiGang: function(palyerViewItem, val, deskId) {
        let canOptType = parseInt(val[0])
        let canOptVal = parseInt(val[1])
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        let pongPaiCards = palyerViewItem.player.pongCards;
        let pongPaiArray = palyerViewItem.pongCardView.pongPaiArr;

        // 1:暗杠，2:明杠,3:点杠
        if (canOptType == 1) {
            // 输入存入玩家
            let gang = {}
            // 自己摸的牌、或者手里本来有的,则是暗杠
            let code1 = parseInt(val[2])
            let code2 = parseInt(val[3])
            let code3 = parseInt(val[4])

            gang.type = 'akang'
            gang.code = canOptVal
            gang.code1 = code1
            gang.code2 = code2
            gang.code3 = code3
            gang.gtype = 1

            pongPaiCards.push(gang)

            if (deskId == 0 || this.isbpm) {
                // 碰牌后，删除数组中碰的数据
                // let curIndex = 0;
                for (let i = 1; i < val.length; i++) {
                    let myCode = parseInt(val[i])
                    for (let j = 0; j < handlePaiArray.length; j++) {
                        let paiItem = handlePaiArray[j];
                        if ((myCode == paiItem.code) && (paiItem.active)) {
                            paiItem.active = false
                            break
                        }
                    }
                }
            } else {
                let curIndex = 0;
                handlePaiArray.forEach(org => {
                    if (org.active && curIndex < 4) {
                        org.active = false
                        curIndex++;
                    }
                });
            }
            // 显示碰或者杠的UI
            palyerViewItem.pongCardView.doAddOnePongPai(gang);
            palyerViewItem.pongCardView.updateAllPongCardPosition();

            // 改变手牌的位置
            palyerViewItem.handCardView.updateAllHandleCardPosition();

        } else if (canOptType == 2) {  // 1:暗杠，2:明杠,3:点杠
            let findDatas = false
            let findItem = false;

            let savePongItem;
            let findIndex = -1;
            for (let i = 0; i < pongPaiArray.length; i++) {
                let pongItem = pongPaiArray[i]
                if (pongItem.code == canOptVal) { // 找到杠牌了
                    // 删除node
                    // pongPaiArray.splice(i, 1);
                    savePongItem = pongItem;
                    findItem = true;
                    findIndex = i;
                    break;
                }
            }

            let saveFindItem;
            for (let i = 0; i < pongPaiCards.length; i++) {
                let pongItem = pongPaiCards[i]
                if (((pongItem.type == 'peng') || (pongItem.type == 'fei')) && pongItem.code == canOptVal) { // 找到杠牌了
                    // 修改状态为杠
                    pongItem.gtype = 2
                    pongItem.type = 'mkang'
                    saveFindItem = pongItem;
                    // pongPaiCards.splice(i, 1);
                    findDatas = true;
                    break;
                }
            }

            // 插入对象
            if (findDatas && findItem) {

                // 自己摸的牌、或者手里本来有的,则是暗杠
                let code3 = parseInt(val[2])
                // let code2 = parseInt(val[3])


                if (deskId == 0 || this.isbpm) {
                    let mIndex = 0;
                    handlePaiArray.forEach(org => {
                        if ((org.code == canOptVal && org.active) ||
                            (org.code == code3 && org.active)) {
                            if (mIndex < 1) {
                                org.active = false
                                mIndex++;
                            }
                        }
                    });
                } else {
                    let mIndex = 0;
                    handlePaiArray.forEach(org => {
                        if (mIndex < 1 && org.active) {
                            org.active = false
                            mIndex++;
                        }
                    });
                }

                saveFindItem.code = savePongItem.code
                saveFindItem.code1 = savePongItem.code1
                saveFindItem.code2 = savePongItem.code2
                saveFindItem.code3 = code3

                // 显示碰或者杠的UI
                palyerViewItem.pongCardView.doAddGangPai([canOptVal, savePongItem.code, savePongItem.code1, savePongItem.code2, code3], findIndex);
                palyerViewItem.pongCardView.updateAllPongCardPosition();

                // 改变手牌的位置
                palyerViewItem.handCardView.updateAllHandleCardPosition();
            }
        } else if (canOptType == 3) {  // 1:暗杠，2:明杠,3:点杠
            // 输入存入玩家
            let gang = {}
            // 自己摸的牌、或者手里本来有的,则是暗杠

            // 自己摸的牌、或者手里本来有的,则是暗杠
            let code1 = parseInt(val[2])
            let code2 = parseInt(val[3])
            let uID = parseInt(val[4])
            let realCode = []
            gang.type = 'mkang'
            gang.code = canOptVal
            realCode.push(canOptVal)
            gang.code1 = canOptVal
            realCode.push(canOptVal)
            gang.code2 = code1
            realCode.push(code1)
            gang.code3 = code2
            realCode.push(code2)
            gang.gtype = 3
            pongPaiCards.push(gang)

            if (deskId == 0 || this.isbpm) {
                for (let i = 1; i < realCode.length; i++) {
                    let myCode = parseInt(realCode[i])
                    for (let j = 0; j < handlePaiArray.length; j++) {
                        let paiItem = handlePaiArray[j];
                        if ((myCode == paiItem.code) && (paiItem.active)) {
                            paiItem.active = false
                            break
                        }
                    }
                }

            } else {
                // 碰牌后，删除数组中碰的数据
                let dindex = 0;
                handlePaiArray.forEach(org => {
                    if (dindex < 3 && org.active) {
                        org.active = false
                        dindex++;
                    }
                });
            }

            // 显示碰或者杠的UI
            palyerViewItem.pongCardView.doAddOnePongPai(gang);
            palyerViewItem.pongCardView.updateAllPongCardPosition();

            // 改变手牌的位置
            palyerViewItem.handCardView.updateAllHandleCardPosition();
        }
    },
    // 飞牌按钮点击
    doClickFei: function () {
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let comPongArr =  penGangUtils.computePeng(this.codeLight, this.doGetHandleArr(), newRlue);
        
        if (!cc.g.utils.judgeArrayEmpty(comPongArr)) {
            let len = comPongArr.length
            if (len > 1) {
                this.Node_MultGanView.active = true
                this.initGangMultView(comPongArr, true)
            } else {
                this.clearTgTishi(this.gameMgr.selfUID);
                let canOptVal = comPongArr[0]
                this.gameMgr.sendOp(DEF.PlayerOpt.Fei.v, canOptVal, this.timeStamp);
                this.doHiddenHutiGang();
            }
        }
    },
    doRealFeiShow: function(palyerViewItem, canOptVal, gui, deskId) {
        let canOptValCode = parseInt(canOptVal)
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        // 输入存入玩家
        let peng = {}
        peng.type = 'fei'
        peng.code = canOptValCode
        peng.code1 = canOptValCode
        peng.code2 = gui

        palyerViewItem.player.pongCards.push(peng)

        if (deskId == 0 || this.isbpm) {
            // 飞牌后，删除数组中飞的数据
            for (let i = 0; i < handlePaiArray.length; i++) {
                let handleItem = handlePaiArray[i]
                if ((handleItem.code == peng.code) && (handleItem.active)) {
                    handleItem.active = false
                    break;
                }
            }

            // 隐藏红中
            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.code == gui && org.active) {
                    org.active = false
                    break;
                }
            }
        } else {
            // 其他玩家，隐藏2张
            let iCount = 0;
            handlePaiArray.forEach(org => {
                if (iCount < 2 && (org.active)) {
                    org.active = false
                    iCount++
                }
            });
        }

        // 显示碰或者杠的UI
        palyerViewItem.pongCardView.doAddOnePongPai(peng);
        palyerViewItem.pongCardView.updateAllPongCardPosition();

        // 改变手牌的位置
        palyerViewItem.handCardView.updateAllHandleCardPosition();
    },
    onClickPengMultClicked: function(event, cardCode) {
        this.clearTgTishi(this.gameMgr.selfUID);
        this.Node_TiFeiView.active = false
        this.Node_MultGanView.active = false
        let canOptVal = cardCode
        this.gameMgr.sendOp(DEF.PlayerOpt.Peng.v, canOptVal, this.timeStamp);
        this.doHiddenHutiGang();
    },
    onClickFeiMultClicked: function(event, cardCode) {
        this.clearTgTishi(this.gameMgr.selfUID);
        this.Node_TiFeiView.active = false
        this.Node_MultGanView.active = false
        let canOptVal = cardCode
        this.gameMgr.sendOp(DEF.PlayerOpt.Fei.v, canOptVal, this.timeStamp);
        this.doHiddenHutiGang();
    },

    // 碰牌按钮点击
    doClickPeng: function () {
        this.clearTgTishi(this.gameMgr.selfUID);
        let canOptVal = this.playerView[0].player.canOptVal;
        this.gameMgr.sendOp(DEF.PlayerOpt.Peng.v, canOptVal, this.timeStamp);
        this.doHiddenHutiGang();
    },
    // 过牌按钮点击
    doClickGuo: function () {

        if (this.checkCanPlayMj()) {
            this.Node_HuTiGangViewCancle.active = true
            this.Node_HuTiGangView.active = false
        } else {
            this.clearTgTishi(this.gameMgr.selfUID);

            this.gameMgr.sendOp(DEF.PlayerOpt.Guo.v, [0], this.timeStamp);
            // 点过后，重置
            this.codeLight = -100;
            // 提示杠
            this.Node_PengGang.active = false;

            this.doHiddenHutiGang();
        }
    },
    doClickCancle: function () {
        if (this.checkCanPlayMj()) {
            this.Node_HuTiGangViewCancle.active = false
            this.Node_HuTiGangView.active = true
        }
    },
    hiddenHiTiGangCanel: function() {
        this.Node_HuTiGangViewCancle.active = false
    },
    doClosePengGangMultView: function() {
        this.Node_PengGang.active = false;
        this.upOperate();
    },

    doHiddenHutiGangTwo: function() {
        // 是否需要显示按钮
        this.Node_HuTiGangView.active = false
    },

    clearReconnectTags: function() {
        this.Node_PengGang.active = false;
    },
    // 隐藏胡提纲
    doHiddenHutiGang: function() {
        // 是否需要显示按钮
        this.Node_HuTiGangView.active = false
        // 修改玩家状态
        let player = this.playerView[0].player
        // 可以操作牌
        player.obks = null;
    },
    // 摸牌动作
    getServerMoPai: function (v, palyerViewItem) {
        let getRelDeskId = palyerViewItem.index

        //  显示定时器
        this.startTimer(getRelDeskId)

        // 摸牌消息
        this.gameMgr.audio.moPai();

        // 显示底牌数量
        this.doDelDiPaiCount();

        // 修改样式
        palyerViewItem.handCardView.showMoPaiView(v, getRelDeskId, palyerViewItem);

        this.showZeZaoImg(palyerViewItem)

        palyerViewItem.handCardView.upReConnectPos();

        if (getRelDeskId == 0 && !this.isbpm) {

            

            // 每次摸牌都判断胡牌提示
            this.doCheckHuPai();

            // 检测是否有同样的牌
            this.doCheckSamePai(v);
        }
    },
    doCheckSamePai: function(code) {
        let pcode = parseInt(code)
        this.playerView.forEach((palyerViewItem)=>{
            //  有玩家数据
            if (palyerViewItem.player && palyerViewItem.player.d != null) {
                // 弃牌
                let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr
                if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                    qiPaiArr.forEach((qi)=>{
                        let blackNode = cc.find("Sprite_used", qi)
                        if (!cc.g.utils.judgeObjectEmpty(blackNode)) {
                            blackNode.active = false;
                        }
                    })
                }
            }
        })

        if (pcode > 0) {
            for (let i = 0; i < this.playerView.length; i++) {
                let palyerViewItem = this.playerView[i]
                //  有玩家数据
                if (palyerViewItem.player && palyerViewItem.player.d != null) {
                    // 弃牌
                    let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr
                    if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                        qiPaiArr.forEach((qi)=>{
                            if (qi.code == pcode) {
                                let blackNode = cc.find("Sprite_used", qi)
                                if (!cc.g.utils.judgeObjectEmpty(blackNode)) {
                                    blackNode.active = true;
                                }
                            }
                        })
                    }
                }
            }
        }
    },
    hiddenHuPaiImg: function() {
        let palyerViewItem = this.playerView[0]
        // 蔗渣非缺的牌
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        // 隐藏胡牌提示
        handlePaiArray.forEach((org)=>{
            // if (!cc.g.utils.judgeObjectEmpty(org.code) && org.active) {
            //     let Sprite_Alert = cc.find("Sprite_Alert", org)
            //     Sprite_Alert.active = false
            // }
            let Sprite_Alert = cc.find("Sprite_Alert", org)
            Sprite_Alert.active = false
        })
    },
    doRemoveOtherPai: function (palyerViewItem, uid, v) {
        let removeQiUser = palyerViewItem.player.d.uid
        if (eq64(removeQiUser, uid)) {
            this.doRealQiPaiRemove(palyerViewItem, v)
        }
    },
    doRealQiPaiRemove: function (palyerViewItem, code) {
        if (cc.g.utils.judgeObjectEmpty(palyerViewItem.player)) {
            return;
        }

        // 弃牌
        let qiCards = palyerViewItem.player.qiCards
        // 弃牌 node
        let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr

        if (cc.g.utils.judgeArrayEmpty(qiCards)) {
            return;
        }

        if (cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
            return;
        }

        let isFind = false
        let isFindData = false
        let qiCardLen = qiCards.length;
        // 删除元素
        for (let i = qiCardLen; i >= 0; --i) {
            let saveCode = qiCards[i]
            if (parseInt(saveCode) == parseInt(code)) {
                qiCards.splice(i, 1);
                isFindData = true
                break;
            }
        }

        // 删除元素
        let qiArrLen = qiPaiArr.length;
        for (let i = qiArrLen; i >= 0; --i) {
            let node = qiPaiArr[i]
            if (node) {
                if (parseInt(node.code) == parseInt(code)) {
                    qiPaiArr.splice(i, 1);
                    // 移除节点
                    palyerViewItem.qiCardView.qiPai_handCard.removeChild(node, true);
                    isFind = true
                    break;
                }
            }
        }

        if (isFind && isFindData) {
            // 刷新UI
            palyerViewItem.qiCardView.updateAllQiPaiCardPosition();
        }
    },
    doReciveFei: function (palyerViewItem, v, gui, uid) {
        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        /*this.doPlayHuTiGangAnim(palyerViewItem, 0);*/
        palyerViewItem.doPlayHuTiGangAnim(1);

        this.gameMgr.audio.pai('peng', palyerViewItem.player.d.sex);

        // 显示UI
        this.doRealFeiShow(palyerViewItem, v, gui, getRelDeskId)

        // 隐藏胡提杠
        cc.g.utils.backPlayScaleBtnEffct(this.Button_Fei, ()=>this.doHiddenHutiGang());

        if (getRelDeskId == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai();
        }

        // 移除弃牌
        let playerViewItemTwo = this.gameMgr.uidPlayers[uid]
        if (!cc.g.utils.judgeObjectEmpty(playerViewItemTwo)) {
            // 移除视图
            this.doRealQiPaiRemove(playerViewItemTwo.view, v)
        }
    },
    doRecivePong: function (palyerViewItem, v, uid) {
        let getRelDeskId = palyerViewItem.index; //this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        // this.doPlayHuTiGangAnim(palyerViewItem, 1);
        palyerViewItem.doPlayHuTiGangAnim(1);

        this.gameMgr.audio.pai('peng', palyerViewItem.player.d.sex);

        // 显示UI
        this.doShowRealPeng(palyerViewItem, v, getRelDeskId)

        this.doHiddenHutiGang();

        // 隐藏胡提杠
        cc.g.utils.backPlayScaleBtnEffct(this.Button_Peng, ()=>this.doHiddenHutiGang());

        if (getRelDeskId == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai();
        }

        // 移除弃牌
        let playerViewItemTwo = this.gameMgr.uidPlayers[uid]
        if (!cc.g.utils.judgeObjectEmpty(playerViewItemTwo)) {
            // 移除视图
            this.doRealQiPaiRemove(playerViewItemTwo.view, v)
        }
    },
    doReciveCanHu: function(palyerViewItem) {
        let getRelDeskId = palyerViewItem.index;

        if (getRelDeskId == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai();
        }
    },
    doPlayGangAnim: function (val) {
        // let canOptType = parseInt(val[0])
        // // 1:暗杠，2:明杠,3:点杠
        // const self = this
        // if (canOptType == 2 || canOptType == 3) {
        //     self.anmView.nodeFenBao.onec('newAnimation', ()=>{
        //     }, false);
        // } else {
        //     self.anmView.nodeYue.onec('newAnimation', ()=>{
        //     }, false);
        // }
    },
    doReciveGang: function (palyerViewItem, v) {
        let getRelDeskId = palyerViewItem.index;//this.gameMgr.getViewPos(deskId)
        // let palyerViewItem = this.playerView[getRelDeskId]
        //  显示定时器
        this.startTimer(getRelDeskId)

        this.doHiddenHutiGang();

        // 播放动画
        // this.doPlayHuTiGangAnim(palyerViewItem, 3);
        palyerViewItem.doPlayHuTiGangAnim(3);

        // this.doPlayGangAnim(v);

        this.gameMgr.audio.pai('gang', palyerViewItem.player.d.sex);

        // 显示杠UI
        this.doRealMoPaiGang(palyerViewItem, v, getRelDeskId)

        // 隐藏胡提杠
        cc.g.utils.backPlayScaleBtnEffct(this.Button_Gang, ()=>this.doHiddenHutiGang());

        if (getRelDeskId == 0 && !this.isbpm) {
            // 胡牌提示
            this.doCheckHuPai();
        }
    },
    doShowRealPeng: function(palyerViewItem, canOptVal, deskId) {
        let canOptValCode = parseInt(canOptVal)
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        // 输入存入玩家
        let peng = {}
        peng.type = 'peng'
        peng.code = canOptValCode
        peng.code1 = canOptValCode
        peng.code2 = canOptValCode
        palyerViewItem.player.pongCards.push(peng)

        // 碰牌后，删除数组中碰的数据
        if (deskId == 0 || this.isbpm) {
            let indexCount = 0;
            handlePaiArray.forEach(org => {
                if ((org.code == peng.code) && (indexCount <= 1) && (org.active)) {
                    org.active = false
                    indexCount++
                }
            });
        } else {
            let iCount = 0;
            handlePaiArray.forEach(org => {
                if (iCount <= 1 && (org.active)) {
                    org.active = false
                    iCount++
                }
            });
        }

        // 显示碰或者杠的UI
        palyerViewItem.pongCardView.doAddOnePongPai(peng);
        palyerViewItem.pongCardView.updateAllPongCardPosition();

        // 改变手牌的位置
        palyerViewItem.handCardView.updateAllHandleCardPosition();
    },
    // 游戏结算
    onGameSettlement: function () {
        if (! this.settleView) {
            this.settleView = new majhCtrls.SettleView();
            this.settleView.init(this);
            this.node.parent.addChild(this.settleView.root);
        }

        // 延时执行
        this.settleView.show();
    },
    // 结算
    onGameSettlementEnd: function () {
        this.clearWaitCard();
        this.upPage();
    },
    hiddenSettleView: function() {
        if (this.settleView != null) {
            this.settleView.hide();
        }
    },
    // 总结算
    onGameSettleFinal: function () {
        if (! this.settleFinalView) {
            this.settleFinalView = new majhCtrls.SettleFinalView();
            this.settleFinalView.init(this);
            this.node.parent.addChild(this.settleFinalView.root);
        }
        this.settleFinalView.show();
    },
    clearHuanPaiView: function() {
        this.node_HuaiPai_all_View.active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai0", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai1", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai2", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai3", this.node).active = false;

        this.node_HuaiPai_all_View_Four.active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai0", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai1", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai2", this.node).active = false;
        cc.find("Node_HanPai_All_Four_View/yjmjhuanpai3", this.node).active = false;

        // this.isAutoHu = false;
        // this.doShowAllHiddenZeZhaoView();
    },
    // 移除当前桌面供玩家操作的牌
    clearWaitCard: function () {

        this.Node_BaoZi.active = false;
        this.Node_BaoZi.setPosition(this.Node_BaoZi.ox, this.Node_BaoZi.oy)

        // 换牌按钮为灰色
        this.node_Huanpai.active = false
        this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_25');
        this.huanPaiBtn.enabled = false

        this.clearHuanPaiView();

        // 是否自动胡牌
        this.isAutoHu = false;
        if (this.Sprite_Light != null) {
            this.Sprite_Light.active = false
        }

        this.doShowAllHiddenZeZhaoView();

        let palyerViewItemp = this.playerView[0]
        palyerViewItemp.handCardView.Node_Place.active = false

        // 隐藏胡提杠
        // this.Node_HuTiGangView.active = false
        this.doHiddenHutiGang();

        this.HuNodeTips.active = false;
        // cc.g.hallMgr.inGameMenu.Button_tip.active = false;
        this.Node_hupaiTip.active = false;

        // 胡的次数
        this.ziHuCount = 0

        this.codeLight = -100;

        // zindex 计数器
        this.zIndexQiRightCount = 0;

        // zindex 计数器
        this.zIndexQiTopCount = 0;

        this.zIndexQiLeftCount = 0;

        // 胡牌提示数组
        this.huPaiAlertArr = []

        this.huCodeArr = []

        // 当前可以胡牌的
        this.huPaiCurrentItem = null

        // 隐藏东西南北
        this.Sprite_dong.active = false;
        this.Sprite_bei.active = false;
        this.Sprite_xi.active = false;
        this.Sprite_nan.active = false;

        // 修改样式
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            palyerViewItem.hiddenHuAnimation();

            if (!cc.g.utils.judgeObjectEmpty(palyerViewItem.player)) {
                palyerViewItem.player.resetPlay();
            }

            palyerViewItem.handCardView.Node_handCard.removeAllChildren(true)
            palyerViewItem.handCardView.hcGroups = [];  //手牌分组
            palyerViewItem.handCardView.aniHcGroups = [];  //动画手牌分组

            // 隐藏缺
            palyerViewItem.sprite_hque.active = false

            palyerViewItem.qiCardView.qiPai_handCard.removeAllChildren(true)
            palyerViewItem.qiCardView.qiPaiArr = [];  //弃牌分组

            palyerViewItem.pongCardView.pongPai_handCard.removeAllChildren(true)
            palyerViewItem.pongCardView.pongPaiArr = [];  //碰牌分组

            palyerViewItem.hiddenHuAnimation()
        }

        this.huPaiAlertArr = []
        this.huPaiCurrentItem = null
        this.HuNodeTips.active = false;
        this.Node_hupaiTip.active = false;
    },
    doShowMyQueImg: function(palyerViewItem) {
        let getRelDeskId = palyerViewItem.index
        this.Node_Que_Anima.active = true

        this.node_Huanpai.active = false

        // 隐藏定缺中
        palyerViewItem.hiddenXuanPai();

        let nodeQueItem = this.nodeQueArr[getRelDeskId]
        nodeQueItem.active = true
        // 显示图片
        nodeQueItem.getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('big_'+palyerViewItem.player.queIndex);
        // 断线重连也走这里
        palyerViewItem.hiddenDingQue();

        this.showZeZaoImg(palyerViewItem)
    },

    doShowLeftNumOne: function() {
        // 显示剩下牌
        // this.Sprite_Bg_Num.active = true;
        // this.Label_Left_Num.node.active = true;
        this.Label_Left_Num.string = parseInt(this.gameMgr.roomInfo.cardNum) + ''

    },

    doShowLeftNum: function(palyerViewItem) {
        // 显示剩下牌
        // this.Sprite_Bg_Num.active = true;
        // this.Label_Left_Num.node.active = true;
        // this.Label_Left_Num.string = parseInt(this.gameMgr.roomInfo.cardNum) + ''

        let payerIndex = palyerViewItem.index//this.gameMgr.getViewPos(deskId)

        if (this.checkCanPlayMjIndex(palyerViewItem)) {
            //  显示定时器
            this.startTimer(payerIndex)
        }
    },

    checkCanPlayMjIndex: function(palyerViewItem) {

        let alen = 0;
        let isCanPlay = false;
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        for (let i = 0; i < handlePaiArray.length; i++) {
            let qiPaiItem = handlePaiArray[i]
            if (qiPaiItem.active) {
                alen++;
            }
        }

        if (alen%3 == 2) {
            isCanPlay = true;
        }

        return isCanPlay;
    },
    doShowReConectQueImg: function(palyerViewItem) {
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (palyerViewItem.index == 0) {
            this.showZeZaoImg(palyerViewItem)

            // 显示剩下牌
            // this.Sprite_Bg_Num.active = true;
            // this.Label_Left_Num.node.active = true;
            this.Label_Left_Num.string = parseInt(this.gameMgr.roomInfo.cardNum) + ''

            // this.Num_Down_Label.node.active = true;
            this.Num_Down_Label.string = '00';
        }

        let handleLenght = 0
        handlePaiArray.forEach(org => {
            if (org.active) {
                handleLenght++;
            }
        });

        let payerIndex = -1
        if (handleLenght%3 == 2) {
            payerIndex = palyerViewItem.index;
        }

        if (payerIndex == 0) {
            this.Sprite_xi.active = true;
            this.Sprite_nan.active = false;
            this.Sprite_dong.active = false;
            this.Sprite_bei.active = false;
        } else if (payerIndex == 1) {
            this.Sprite_xi.active = false;
            this.Sprite_nan.active = true;
            this.Sprite_dong.active = false;
            this.Sprite_bei.active = false;
        } else if (payerIndex == 2) {
            this.Sprite_xi.active = false;
            this.Sprite_nan.active = false;
            this.Sprite_dong.active = true;
            this.Sprite_bei.active = false;
        } else if (payerIndex == 3) {
            this.Sprite_xi.active = false;
            this.Sprite_nan.active = false;
            this.Sprite_dong.active = false;
            this.Sprite_bei.active = true;
        }
    },
    showZeZaoImg: function(palyerViewItem) {
        if (palyerViewItem.index == 0) {
            let queIndex = palyerViewItem.player.queIndex;
            // 蔗渣非缺的牌
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;

            let handlePaiArrayActive = []

            handlePaiArray.forEach((node)=>{
                if (node.active) {
                    handlePaiArrayActive.push(node)
                }
            })

            // 隐藏所有遮造
            handlePaiArray.forEach((org)=>{
                let Sprite_Que = cc.find("Sprite_Que", org)
                Sprite_Que.active = false
                org.isQue = false

                let Sprite_ZeZao = cc.find("Sprite_ZeZao", org)
                Sprite_ZeZao.active = false
                org.zezao = false

                let Sprite_topMeng = cc.find("Sprite_topMeng", org)
                Sprite_topMeng.active = false
                org.yellowZe = false
            })

            let haveQuePai = false;
            let tongStartIndex = 11
            let checkTong = this.getYaoTongGui()
            if (checkTong) {
                tongStartIndex = 12
            }

            handlePaiArrayActive.forEach(org => {
                let Sprite_Que = cc.find("Sprite_Que", org)
                // 条 同 万 0  1 2
                if (queIndex == 0) {
                    if (org.code > 1 && org.code<=9) {
                        // 显示缺
                        // Sprite_Que.active = true;
                        org.isQue = true;
                        haveQuePai = true;
                    }
                }
                if (queIndex == 1) {
                    if (org.code >= tongStartIndex && org.code<=19) {
                        // 显示缺
                        // Sprite_Que.active = true;
                        org.isQue = true;
                        haveQuePai = true;
                    }
                }
                if (queIndex == 2) {
                    if (org.code >= 21 && org.code<=29) {
                        // 显示缺
                        // Sprite_Que.active = true;
                        org.isQue = true;
                        haveQuePai = true;
                    }
                }
            });

            // 有缺的牌就要显示 Sprite_ZeZao
            if (haveQuePai) {
                handlePaiArrayActive.forEach(org => {
                    let Sprite_ZeZao = cc.find("Sprite_ZeZao", org)
                    // 条 同 万 0  1 2
                    // if (!org.isQue) {
                    //     Sprite_ZeZao.active = true;
                    //     org.zezao = true;
                    // }

                    if (org.isQue) {
                        Sprite_ZeZao.active = true;
                        org.zezao = true;
                    }
                });
            }

            handlePaiArrayActive.forEach(org => {
                let Sprite_topMeng = cc.find("Sprite_topMeng", org)
                if (checkTong) {
                    if ((1 == parseInt(org.code)) || (11 == parseInt(org.code))) {
                        Sprite_topMeng.active = true;
                        org.yellowZe = true
                    }
                } else {
                    if ((1 == parseInt(org.code))) {
                        Sprite_topMeng.active = true;
                        org.yellowZe = true
                    }
                }

            });
        }
    },
    doShowQueAnimation: function (palyerViewItemOne, v) {
        this.Node_Que_Anima.active = true

        // 换三张
        this.node_Huanpai.active = false
        // 缺的动画
        const self  = this
        // 总玩家个数
        let palyerMap = {}
        // let allPlayerNum = parseInt(v[0])
        // 找到对应缺什么
        for (let i = 1; i < v.length; i+=2) {
            let uId = v[i]
            let queIndex = v[i+1]
            palyerMap[uId] = queIndex
        }
        // p.d.uid.toNumber ? p.d.uid.toNumber() : p.d.uid;
        // 修改样式
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            //  有玩家数据
            if (palyerViewItem.player) {
                palyerViewItem.hiddenDingQueing();
                let nodeQueItem = this.nodeQueArr[i]
                nodeQueItem.active = true
                let uid = palyerViewItem.player.d.uid
                let queIndex = palyerMap[uid]
                palyerViewItem.player.queIndex = parseInt(queIndex);
                nodeQueItem.getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('big_'+queIndex);
            }
        }

        this.scheduleOnce(()=>{
            // 执行动画
            for (let i = 0; i < this.playerView.length; i++) {
                let palyerViewItem = this.playerView[i]
                //  有玩家数据
                if (palyerViewItem.player) {
                    let nodeQueItem = self.nodeQueArr[i]
                    palyerViewItem.runQueAnimation(nodeQueItem, i)
                    palyerViewItem.hiddenDingQueing();
                }
            }
        }, 0.1);

        if (this.isbpm) {
            this.doReSortPai(palyerViewItemOne, false)
        } else {
            this.scheduleOnce(()=>{
                this.doReSortPai(palyerViewItemOne, false)
                // 更新最后一张牌
                palyerViewItemOne.handCardView.upReloadLastOne();
            }, 0.3);
        }
    },
    doReConHiddenQueAndAnmi: function() {
        this.clearHuanPaiView();

        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            //  有玩家数据
            if (palyerViewItem.player) {
                let nodeQueItem = this.nodeQueArr[i]
                nodeQueItem.active = false
                palyerViewItem.hiddenDingQueing();
                if (i == 0) {
                    palyerViewItem.hiddenDingQue()
                    // 显示则早
                    this.showZeZaoImg(palyerViewItem)

                    // 显示换牌节点
                    if (palyerViewItem.index == 0) {
                        this.node_Huanpai.active = false
                    }
                }
            }
        }

        // this.Label_Left_Num.string = parseInt(this.gameMgr.roomInfo.cardNum) + ''
    },
    doReSortPai: function(palyerViewItemOne, isReconnct) {
        // 回放修改
        // if (palyerViewItemOne.index == 0) {
        if (palyerViewItemOne.index == 0 || this.isbpm) {
            // 重新排序
            let handlePaiArray = palyerViewItemOne.handCardView.hcGroups;

            // 隐藏最后一张牌
            let lastOnCode = 0
            if (isReconnct) {
                let len = handlePaiArray.length - 1
                for (let i = len; i >= 0; i--) {
                    let node = handlePaiArray[i]
                    if (node.active) {
                        // node.active = false
                        lastOnCode = node.code;
                        node.code = 1200;
                        break
                    }
                }
            }

            // cc.log('lastOnCode--->' + lastOnCode)

            // 手牌排序
            handlePaiArray.sort(this.compareArrayTwo);

            let isFindQue = false
            // 发现缺的，就+100
            handlePaiArray.forEach((node)=>{
                if (node.isQue && node.active && !node.yellowZe) {
                    node.code += 100;
                    isFindQue = true
                }
            })

            let isFindGui = false
            handlePaiArray.forEach((node)=>{
                if (node.yellowZe && node.active) {
                    node.code -= 100;
                    isFindGui = true
                }
            })

            if (isFindQue || isFindGui) {
                // 在排序
                handlePaiArray.sort(this.compareArrayTwo);

                // 发现缺的，就-100
                handlePaiArray.forEach((node)=>{
                    if (node.isQue && node.active && !node.yellowZe) {
                        node.code -= 100;
                    }
                })

                // 发现缺的，就-100
                handlePaiArray.forEach((node)=>{
                    if (node.yellowZe && node.active) {
                        node.code += 100;
                    }
                })
            }

            if (lastOnCode > 0) {
                let lenn = handlePaiArray.length - 1
                for (let i = lenn; i >= 0; i--) {
                    let node = handlePaiArray[i]
                    if (node.code == 1200) {
                        // node.active = true
                        node.code = lastOnCode;
                        break;
                    }
                }
            }

            // 移动要更新位置
            palyerViewItemOne.handCardView.updateAllHandleCardPosition();
        }
    },
    doShowCountDown: function (palyerViewItem, v) {
        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId);
    },
    doReciveHu: function (palyerViewItem, v) {
        // 播放动画
        // this.doPlayHuTiGangAnim(palyerViewItem, 4);
        // palyerViewItem.doPlayHuTiGangAnim(4);

        if (palyerViewItem.index == 0) {
            // 是否需要显示按钮
            // this.Node_HuTiGangView.active = false
            this.doHiddenHutiGang();
        }

        // 修改样式
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            if (!cc.g.utils.judgeObjectEmpty(palyerViewItem.player)) {
                palyerViewItem.player.obks = null;
            }
        }

        cc.g.utils.backPlayScaleBtnEffct(this.Button_Hu, ()=>this.doHiddenHutiGang());

        if (palyerViewItem.index == 0) {


            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            handlePaiArray.forEach((node)=>{
                cc.find("Sprite_Alert", node).active = false;
            })
        }

        palyerViewItem.player.d.hu = v[1]
        palyerViewItem.player.d.huType = v[2]
        palyerViewItem.player.hu = v[1]
        palyerViewItem.player.huType = v[2]

        //胡 v[0]谁出得牌 v[1]胡得牌 v[2]胡的类型(1-天胡(自摸),2-地胡(自摸),3-自摸,4-胡, 5-胡(一炮多响)) v[3](抢杠 == 1) v[4] - v[n-1]
        let huType = parseInt(v[2])
        let animationName = ''
        if (huType === 3) { // 自摸
            this.ziHuCount++
            if (this.ziHuCount == 1) {
                animationName = 'zimo_1'
            } else if (this.ziHuCount == 2) {
                animationName = 'zimo_2'
            } else if (this.ziHuCount == 3) {
                animationName = 'zimo_3'
            }
            this.gameMgr.audio.pai('zimo', palyerViewItem.player.d.sex);
        } else if (huType === 4) { // 胡
            this.ziHuCount++

            if (this.ziHuCount == 1) {
                // animationIndex = 6
                animationName = 'hu_1'
            } else if (this.ziHuCount == 2) {
                // animationIndex = 7
                animationName = 'hu_2'
            } else if (this.ziHuCount == 3) {
                // animationIndex = 8
                animationName = 'hu_3'
            }

            this.gameMgr.audio.pai('hu', palyerViewItem.player.d.sex);
        } else if (huType === 5) { // 胡
            this.ziHuCount++

            if (this.ziHuCount == 1) {
                // animationIndex = 6
                animationName = 'hu_1'
            } else if (this.ziHuCount == 2) {
                // animationIndex = 7
                animationName = 'hu_2'
            } else if (this.ziHuCount == 3) {
                // animationIndex = 8
                animationName = 'hu_3'
            }

            this.gameMgr.audio.pai('hu', palyerViewItem.player.d.sex);
        }

        // cc.log('ziHuCount--->' + this.ziHuCount)

        let vLen = v.length - 1
        let lastV = parseInt(v[vLen])

        // 根据Ui 拿数据
        let palyerViewItemUid = null
        let playerViewItemTwo = this.gameMgr.uidPlayers[v[0]]
        if (!cc.g.utils.judgeObjectEmpty(playerViewItemTwo)) {
            palyerViewItemUid = playerViewItemTwo.view
        }
        palyerViewItem.handCardView.showHuPaiView(palyerViewItemUid, parseInt(v[1]), lastV);
        // 显示胡动画 0 1自摸 1 2自摸 2 3自摸  6 1胡 7 2胡 8 3胡
        palyerViewItem.showHuAnimation(animationName);

        // 移除杠牌
        let isQianGang = false;
        let gangType = parseInt(v[3])
        if (gangType == 1) {
            isQianGang = true;
        }

        // 是抢杠
        if (isQianGang && palyerViewItemUid != null) {
            let pongPaiCards = palyerViewItemUid.player.pongCards;
            let pongPaiArray = palyerViewItemUid.pongCardView.pongPaiArr;
            let findPaid = false;
            for (let i = 0; i < pongPaiCards.length; i++) {
                let pongItem = pongPaiCards[i]

                if (((pongItem.code == parseInt(v[1])) ||
                    (pongItem.code1 == parseInt(v[1])) ||
                    (pongItem.code2 == parseInt(v[1])) ||
                    (pongItem.code3 == parseInt(v[1]))) && (pongItem.type == 'mkang')) {
                    pongItem.type = 'peng'
                    pongPaiCards.splice(i, 1);
                    findPaid = true;
                    break;
                }
            }

            let nodeCodeArr = [];
            if (findPaid) {
                let len = pongPaiArray.length - 1
                for (let i = len ; i >= 0; i--) {
                    let pongItemTwo = pongPaiArray[i]
                    if (((pongItemTwo.code == parseInt(v[1])) ||
                        (pongItemTwo.code1 == parseInt(v[1])) ||
                        (pongItemTwo.code2 == parseInt(v[1])) ||
                        (pongItemTwo.code3 == parseInt(v[1]))) && (pongItemTwo.type == 'mkang')) {
                        pongItemTwo.type = 'peng'
                        pongPaiArray.splice(i, 1);
                        nodeCodeArr.push(pongItemTwo.code)
                        nodeCodeArr.push(pongItemTwo.code1)
                        nodeCodeArr.push(pongItemTwo.code2)
                        nodeCodeArr.push(pongItemTwo.code3)
                        break;
                    }
                }

                for (let i = 0; i < nodeCodeArr.length; i++) {
                    let code = nodeCodeArr[i]
                    if (code == parseInt(v[1])) { // 找到杠牌了
                        nodeCodeArr.splice(i, 1);
                        break;
                    }
                }
            }

            // 碰牌
            if (!cc.g.utils.judgeArrayEmpty(nodeCodeArr)) {
                let peng = {}
                peng.type = 'peng'
                peng.gtype = 'nouse'
                peng.code = nodeCodeArr[0]
                peng.code1 = nodeCodeArr[1]
                peng.code2 = nodeCodeArr[2]
                pongPaiCards.push(peng)
                palyerViewItemUid.pongCardView.doRemoveOnePongPai(peng);
                palyerViewItemUid.pongCardView.doAddOnePongPai(peng);
                palyerViewItemUid.pongCardView.updateAllPongCardPosition();
                // 改变手牌的位置
                palyerViewItemUid.handCardView.updateAllHandleCardPosition();
            }
        }
    },
    doGetHandleArr: function() {
        let palyerViewItem = this.playerView[0]

        // 传递处理的数组
        let passArr = []

        // 手牌规则，去掉相同的，除开红中，遍历的时候，不用遍历红中
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (!cc.g.utils.judgeArrayEmpty(handlePaiArray)) {
            // 获取有效数组
            let handleActiveArr = []
            handlePaiArray.forEach((node)=>{
                if (node.active) {
                    handleActiveArr.push(node.code)
                }
            })

            // copy array
            let newHanldeArr = cc.g.clone(handleActiveArr)

            // 首先进行数组排序
            newHanldeArr.sort(this.compareArrayTwo);

            passArr = newHanldeArr
        }

        return passArr;
    },
    // 组装碰牌，杠牌
    doGetPongArr: function() {
        let palyerViewItem = this.playerView[0]
        let pongArr = palyerViewItem.pongCardView.pongPaiArr
        let rePassPongArr = []
        if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
            pongArr.forEach((node)=> {
                let pongNode = []
                if (node.type == 'fei') {
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                } else if (node.type == 'peng') {
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                }

                if (!cc.g.utils.judgeArrayEmpty(pongNode)) {
                    rePassPongArr.push(pongNode)
                }
            })
        }

        return rePassPongArr
    },
    // 找到手牌单个牌，去掉红中
    doGetPassHandleArr: function() {
        let palyerViewItem = this.playerView[0]

        // 传递处理的数组
        let passArr = []

        // 手牌规则，去掉相同的，除开红中，遍历的时候，不用遍历红中
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (!cc.g.utils.judgeArrayEmpty(handlePaiArray)) {
            // 获取有效数组
            let handleActiveArr = []
            handlePaiArray.forEach((node)=>{
                if (node.active) {
                    handleActiveArr.push(node.code)
                }
            })

            // copy array
            let newHanldeArr = cc.g.clone(handleActiveArr)

            // 首先进行数组排序
            newHanldeArr.sort(this.compareArrayTwo);

            // 找红中
            let hzArr = []
            let hzIndex = 0;

            let yitong = this.getYaoTongGui()
            newHanldeArr.forEach((code)=>{
                if (yitong) {
                    if ((code == 1) || code == 11) {
                        hzArr.push(code)
                        // 删除红中
                        newHanldeArr.splice(hzIndex, 1)
                    }
                } else {
                    if (code == 1) {
                        hzArr.push(code)
                        // 删除红中
                        newHanldeArr.splice(hzIndex, 1)
                    }
                }

                hzIndex++;
            })

            // 去掉重复的数据
            if (!cc.g.utils.judgeArrayEmpty(newHanldeArr)) {
                let newDelReArr = []
                for(let i=0; i < newHanldeArr.length; i++){
                    if(newDelReArr.indexOf(newHanldeArr[i]) == -1){
                        newDelReArr.push(newHanldeArr[i]);
                    }
                }
                // 红中不可以打
                passArr = newDelReArr
            }
        }

        return passArr;
    },
    // 组装碰牌，杠牌
    doGetPassPongArr: function() {
        let palyerViewItem = this.playerView[0]
        let pongArr = palyerViewItem.pongCardView.pongPaiArr
        let rePassPongArr = []
        if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
            pongArr.forEach((node)=> {
                let pongNode = []
                // 1:暗杠，2:明杠,3:点杠
                if (node.gtype == 1 || node.type == 'akang') {
                    pongNode.push(1)
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                    pongNode.push(node.code3)
                } else if (node.gtype == 2 || node.type == 'mkang') { // 明杠
                    pongNode.push(0)
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                    pongNode.push(node.code3)
                } else if (node.gtype == 3 || node.type == 'mkang') { // 暗杠
                    pongNode.push(0)
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                    pongNode.push(node.code3)
                } else if (node.type == 'fei') {
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                } else if (node.type == 'peng') {
                    pongNode.push(node.code)
                    pongNode.push(node.code1)
                    pongNode.push(node.code2)
                }

                if (!cc.g.utils.judgeArrayEmpty(pongNode)) {
                    rePassPongArr.push(pongNode)
                }
            })
        }

        return rePassPongArr
    },
    doGetDeleteIndexArr: function(arr, code) {
        let cloneArr = cc.g.clone(arr)
        for(let i = 0; i < cloneArr.length; i++){
            if(cloneArr[i] == code) {
                cloneArr.splice(i, 1)
                break;
            }
        }
        return cloneArr;
    },
    compareArrayMore:function (val1, val2) {
        return val2.huCount-val1.huCount;
    },
    compareArrayBig:function (val1, val2) {
        return val2.fanCount-val1.fanCount;
    },
    doCheckHuPai: function(reconnect=false) {
        // 总结果
        let resultArr = []
        let palyerViewItem = this.playerView[0]
        // 手牌规则，去掉相同的，除开红中，遍历的时候，不用遍历红中
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        if (cc.g.utils.judgeArrayEmpty(handlePaiArray)) {
            return;
        }

        let handArr = this.doGetPassHandleArr()
        let pongArr = this.doGetPassPongArr()

        // 获取有效数组
        let handleActiveArr = []
        handlePaiArray.forEach((node)=>{
            cc.find("Sprite_Alert", node).active = false;
            if (node.active) {
                handleActiveArr.push(parseInt(node.code))
            }
        })

        // copy array
        let newHanldeArr = cc.g.clone(handleActiveArr)

        // 首先进行数组排序
        newHanldeArr.sort(this.compareArrayTwo);

        let yitong = this.getYaoTongGui()

        if (reconnect) {
            // 传入胡牌提示函数
            let queNum = this.getPaiQueRule();
            if (queNum == 100) {
                queNum = palyerViewItem.player.queIndex
            }

            let newHanldeArrLen = newHanldeArr.length
            if (newHanldeArrLen%3==2) { // 可以打牌
                // 1、找胡牌可能
                if (!cc.g.utils.judgeArrayEmpty(handArr)) {
                    let viewIndex = 0
                    handArr.forEach((code) => {
                        // 从手牌中任意打一张牌,得到得数组
                        let newDelArr = this.doGetDeleteIndexArr(newHanldeArr, code)
                        // 传入胡牌提示函数
                        let huMap = HuPaiUtils.showHuPaiPrompt(newDelArr, pongArr, queNum, this.gameMgr.roomInfo.NewRlue);
                        // 推送数据
                        if (!cc.g.utils.judgeMapEmpty(huMap)) {
                            // 居然不是标准map, 先转为map
                            let jsonMapStr = JSON.stringify(huMap)
                            let obj = JSON.parse(jsonMapStr)
                            let newHuMap = new Map();
                            for (let k of Object.keys(obj)) {
                                newHuMap.set(k, obj[k]);
                            }

                            let huMapArr = []
                            newHuMap.forEach((value, key) => {
                                let humapObj = {}
                                humapObj.code = key
                                humapObj.fan = value
                                huMapArr.push(humapObj)
                            })

                            let keyMap = {}
                            keyMap.id = viewIndex
                            keyMap.outCode = code
                            keyMap.huMapArr = huMapArr
                            resultArr.push(keyMap)
                            viewIndex++;
                        }
                    })
                }
            } else {
                // 断线重连走这里
                let huMap = HuPaiUtils.showHuPaiPrompt(newHanldeArr, pongArr, queNum, this.gameMgr.roomInfo.NewRlue);
                // 推送数据
                if (!cc.g.utils.judgeMapEmpty(huMap)) {
                    // 居然不是标准map, 先转为map
                    let jsonMapStr = JSON.stringify(huMap)
                    let obj = JSON.parse(jsonMapStr)
                    let newHuMap = new Map();
                    for (let k of Object.keys(obj)) {
                        newHuMap.set(k,obj[k]);
                    }

                    let huMapArr = []
                    newHuMap.forEach((value, key) => {
                        let humapObj = {}
                        humapObj.code = key
                        humapObj.fan = value
                        huMapArr.push(humapObj)
                    })

                    let waitCode = palyerViewItem.player.waitCode
                    if (cc.g.utils.judgeObjectEmpty(waitCode)) {
                        waitCode = -100
                    }

                    let keyMap = {}
                    keyMap.id = 0
                    keyMap.outCode = waitCode
                    keyMap.huMapArr = huMapArr
                    resultArr.push(keyMap)
                }
            }
        } else {
            // 1、找胡牌可能
            if (!cc.g.utils.judgeArrayEmpty(handArr)) {
                let viewIndex = 0
                handArr.forEach((code)=> {
                    // 从手牌中任意打一张牌,得到得数组
                    let newDelArr = this.doGetDeleteIndexArr(newHanldeArr, code)
                    // 传入胡牌提示函数
                    let huMap = HuPaiUtils.showHuPaiPrompt(newDelArr, pongArr, palyerViewItem.player.queIndex, this.gameMgr.roomInfo.NewRlue);
                    // 推送数据
                    if (!cc.g.utils.judgeMapEmpty(huMap)) {
                        // 居然不是标准map, 先转为map
                        let jsonMapStr = JSON.stringify(huMap)
                        let obj = JSON.parse(jsonMapStr)
                        let newHuMap = new Map();
                        for (let k of Object.keys(obj)) {
                            newHuMap.set(k,obj[k]);
                        }

                        let huMapArr = []
                        newHuMap.forEach((value, key) => {
                            let humapObj = {}
                            humapObj.code = key
                            humapObj.fan = value
                            huMapArr.push(humapObj)
                        })

                        let keyMap = {}
                        keyMap.id = viewIndex
                        keyMap.outCode = code
                        keyMap.huMapArr = huMapArr
                        resultArr.push(keyMap)
                        viewIndex++;
                    }
                })
            }
        }

        // 2、找到胡牌可能后，显示UI操作 结果不为空, 总结果不为空, 则继续执行
        if (!cc.g.utils.judgeArrayEmpty(resultArr)) {
            // 桌面上的摆牌
            let baiPaiArr = []
            let hzCount = 0;
            let ytCount = 0;
            // 自己的手牌, 找到红中个数，和找到非红中数组
            handleActiveArr.forEach((code)=>{
                if (yitong) {
                    if (code == 1) {
                        hzCount++
                    } else if (code == 11) {
                        ytCount++
                    } else {
                        baiPaiArr.push(code)
                    }
                } else {
                    if (code == 1) {
                        hzCount++
                    } else {
                        baiPaiArr.push(code)
                    }
                }
            })

            // 胡牌数组
            let huCodeArr = this.huCodeArr
            if (!cc.g.utils.judgeArrayEmpty(huCodeArr)) {
                huCodeArr.forEach((code)=>{
                    if (yitong) {
                        if (code == 1) {
                            hzCount++
                        } else if (code == 11) {
                            ytCount++
                        } else {
                            baiPaiArr.push(code)
                        }
                    } else {
                        if (code == 1) {
                            hzCount++
                        } else {
                            baiPaiArr.push(code)
                        }
                    }

                })
            }

            // 遍历所有的碰牌和摆牌
            for (let i = 0; i < this.playerView.length; i++) {
                let palyerViewItem = this.playerView[i]
                //  有玩家数据
                if (palyerViewItem.player && palyerViewItem.player.d != null) {
                    // 弃牌
                    let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr
                    if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                        qiPaiArr.forEach((qi)=>{
                            // if (qi.code == 1) {
                            //     hzCount++
                            // } else {
                            //     if (!cc.g.utils.judgeObjectEmpty(qi.code)) {
                            //         baiPaiArr.push(qi.code)
                            //     }
                            // }
                            // 弃牌没有红中，可以直接这样写
                            // if (!cc.g.utils.judgeObjectEmpty(qi.code)) {
                            //
                            // }
                            baiPaiArr.push(qi.code)
                        })
                    }

                    // 碰牌
                    let pongPaiArr = palyerViewItem.pongCardView.pongPaiArr
                    if (!cc.g.utils.judgeArrayEmpty(pongPaiArr)) {
                        pongPaiArr.forEach((pong)=>{
                            if (pong.type == 'peng') {
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                if (yitong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }

                                    if (pong.code == 11) {
                                        ytCount++
                                    }

                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }

                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }

                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'mkang') { // 明杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                baiPaiArr.push(pong.code3)
                                if (yitong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }

                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'akang') { // 暗杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                baiPaiArr.push(pong.code3)
                                if (yitong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'fei') { // 飞
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                if (yitong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                }

                            }
                        })
                    }
                }
            }

            // 红中总个数
            let allHongZhong = this.getHongZhongCount() - hzCount;

            if (allHongZhong < 0) {
                allHongZhong = 0
            }

            let ytHongZhong = this.getHongZhongCount() - ytCount;

            if (ytHongZhong < 0) {
                ytHongZhong = 0
            }

            // 找可以胡牌的张数
            let tong = this.getYaoTongGui()
            resultArr.forEach((relt)=>{
                let huCount = 0
                let fanCount = 0
                let huMapArr = relt.huMapArr
                huMapArr.forEach((item) => {
                    // 番数，找最大的
                    let tFanCount = parseInt(item.fan)
                    if (fanCount < tFanCount) {
                        fanCount = tFanCount;
                    }

                    let huCode = parseInt(item.code)
                    let huDefaultCount = 4;
                    baiPaiArr.forEach(code=>{
                        let icode = parseInt(code)
                        if (huCode == icode) {
                            huDefaultCount--
                        }
                    })

                    // 如果是红中，则再加上剩下的红中个数


                    if (tong) {
                        if (huCode == 1) {
                            huDefaultCount = allHongZhong
                        }

                        if (huCode == 11) {
                            huDefaultCount = ytHongZhong
                        }
                    } else {
                        if (huCode == 1) {
                            huDefaultCount = allHongZhong
                        }
                    }

                    // 胡的张数
                    if (huDefaultCount <= 0) {
                        huDefaultCount = 0;
                    }

                    // 可以胡的张数，都加上红中
                    item.num = huDefaultCount
                    // 总张数
                    huCount+= huDefaultCount
                })

                relt.huCount = huCount
                relt.fanCount = fanCount
                // 默认都是1
                relt.noraml = 1;
            });

            // 番数排序
            // 1、找番数最多的
            let resultArrBig = cc.g.clone(resultArr)
            let maxFanCount = resultArrBig[0].fanCount;
            for (let i = 0; i < resultArrBig.length - 1; i++) {
                maxFanCount = maxFanCount < resultArrBig[i+1].fanCount ? resultArrBig[i+1].fanCount : maxFanCount
            }

            //  存放所有番数最多的
            let fanMaxArr = [];
            let fanMineArr = [];
            let numMoreArr = [];
            for (let i = 0; i < resultArrBig.length; i++) {
                let fanItem = resultArrBig[i]
                if (fanItem.fanCount == maxFanCount) {
                    fanItem.noraml = 3;
                    // 大
                    fanMaxArr.push(fanItem)
                } else {
                    fanMineArr.push(fanItem)
                }
            }

            if (cc.g.utils.judgeArrayEmpty(fanMineArr)) {
                // 当倍数一样的时候，胡牌多的的显示出来，其余显示三角
                if (!cc.g.utils.judgeArrayEmpty(fanMaxArr)) {

                    // 胡的最多排序
                    let maxHuCount = fanMaxArr[0].huCount;
                    for (let i = 0; i < fanMaxArr.length - 1; i++) {
                        maxHuCount = maxHuCount < fanMaxArr[i+1].huCount ? fanMaxArr[i+1].huCount : maxHuCount
                    }

                    // 找到胡牌最多的显示多，其余显示三角
                    for (let i = 0; i < fanMaxArr.length; i++) {
                        let fanItem = fanMaxArr[i]
                        if (fanItem.huCount == maxHuCount) {
                            fanItem.noraml = 2;
                        } else {
                            fanItem.noraml = 1;
                        }
                    }
                }
            } else {
                // 胡的最多排序
                let maxHuCount = fanMineArr[0].huCount;
                for (let i = 0; i < fanMineArr.length - 1; i++) {
                    maxHuCount = maxHuCount < fanMineArr[i+1].huCount ? fanMineArr[i+1].huCount : maxHuCount
                }

                for (let i = 0; i < fanMineArr.length; i++) {
                    let fanItem = fanMineArr[i]
                    if (fanItem.huCount == maxHuCount) {
                        fanItem.noraml = 2;
                        numMoreArr.push(fanItem)
                    }
                }

                // 再比较大和多，如果大的胡牌张数大于多的，则多直接显示三角
                if (!cc.g.utils.judgeArrayEmpty(fanMaxArr)) {
                    fanMaxArr.forEach((mItem)=>{
                        let huCount = mItem.huCount
                        numMoreArr.forEach((nItem)=>{
                            let nhuCount = nItem.huCount
                            if (huCount >= nhuCount) {
                                nItem.noraml = 1;
                            }
                        })
                    })
                }
            }

            // 遍历手牌，显示提示
            resultArrBig.forEach((huAler)=>{
                handlePaiArray.forEach((node)=>{
                    if (node.active && (huAler.outCode == node.code) && (node.code != 1) && (node.code != 11)) {
                        cc.find("Sprite_Alert", node).active = true;
                        if (huAler.noraml == 2) {
                            cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_duo');
                        } else if (huAler.noraml == 3) {
                            cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_da')
                        } else {
                            cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_hupai_tips');
                        }
                    }
                })
            })

            // 保存胡牌提示数组
            this.huPaiAlertArr = resultArr
        } else {
            this.huPaiAlertArr = []
            this.huPaiCurrentItem = null
        }
    },
    doCheckHuPaiByCode: function(code, showAlert) {
        this.huPaiAlertArr = []
        this.huPaiCurrentItem = null

        // 总结果
        let resultArr = []
        let palyerViewItem = this.playerView[0]
        // 手牌规则，去掉相同的，除开红中，遍历的时候，不用遍历红中
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        if (cc.g.utils.judgeArrayEmpty(handlePaiArray)) {
            return;
        }

        // let handArr = this.doGetPassHandleArr()
        let pongArr = this.doGetPassPongArr()

        // 获取有效数组
        let handleActiveArr = []
        handlePaiArray.forEach((node)=>{
            if (node.active) {
                handleActiveArr.push(parseInt(node.code))
            }
        })

        // copy array
        let newHanldeArr = cc.g.clone(handleActiveArr)

        // 首先进行数组排序
        newHanldeArr.sort(this.compareArrayTwo);
        // 断线重连走这里
        // 从手牌中任意打一张牌,得到得数组
        let newDelArr = null;//this.doGetDeleteIndexArr(newHanldeArr, code)

        // 打牌
        if (showAlert) {
            newDelArr = this.doGetDeleteIndexArr(newHanldeArr, code)
        } else {
            newDelArr = newHanldeArr;
        }

        // 传入胡牌提示函数
        let huMap = HuPaiUtils.showHuPaiPrompt(newDelArr, pongArr, palyerViewItem.player.queIndex, this.gameMgr.roomInfo.NewRlue);
        // 推送数据
        if (!cc.g.utils.judgeMapEmpty(huMap)) {
            // 居然不是标准map, 先转为map
            let jsonMapStr = JSON.stringify(huMap)
            let obj = JSON.parse(jsonMapStr)
            let newHuMap = new Map();
            for (let k of Object.keys(obj)) {
                newHuMap.set(k,obj[k]);
            }

            let huMapArr = []
            newHuMap.forEach((value, key) => {
                let humapObj = {}
                humapObj.code = key
                humapObj.fan = value
                huMapArr.push(humapObj)
            })

            let keyMap = {}
            keyMap.id = 0
            keyMap.outCode = code
            keyMap.huMapArr = huMapArr
            resultArr.push(keyMap)
        }

        // 自己的手牌, 找到红中个数，和找到非红中数组
        let checkTong = this.getYaoTongGui()

        // 2、找到胡牌可能后，显示UI操作 结果不为空, 总结果不为空, 则继续执行
        if (!cc.g.utils.judgeArrayEmpty(resultArr)) {
            // 桌面上的摆牌
            let baiPaiArr = []
            let hzCount = 0;
            let ytCount = 0;

            handleActiveArr.forEach((code)=>{
                if (checkTong) {
                    if (code == 1) {
                        hzCount++
                    } else if (code == 11) {
                        ytCount++
                    } else {
                        baiPaiArr.push(code)
                    }
                } else {
                    if (code == 1) {
                        hzCount++
                    } else {
                        baiPaiArr.push(code)
                    }
                }

            })

            // 胡牌数组
            let huCodeArr = this.huCodeArr
            if (!cc.g.utils.judgeArrayEmpty(huCodeArr)) {
                huCodeArr.forEach((code)=>{
                    if (checkTong) {
                        if (code == 1) {
                            hzCount++
                        } else if (code == 11) {
                            ytCount++
                        } else {
                            baiPaiArr.push(code)
                        }
                    } else {
                        if (code == 1) {
                            hzCount++
                        } else {
                            baiPaiArr.push(code)
                        }
                    }

                })
            }

            // 遍历所有的碰牌和摆牌
            for (let i = 0; i < this.playerView.length; i++) {
                let palyerViewItem = this.playerView[i]
                //  有玩家数据
                if (palyerViewItem.player && palyerViewItem.player.d != null) {
                    // 弃牌
                    let qiPaiArr = palyerViewItem.qiCardView.qiPaiArr
                    if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                        qiPaiArr.forEach((qi)=>{
                            // 弃牌没有红中，可以直接这样写
                            // if (!cc.g.utils.judgeObjectEmpty(qi.code)) {
                            //     baiPaiArr.push(qi.code)
                            // }
                            baiPaiArr.push(qi.code)
                        })
                    }

                    // 碰牌
                    let pongPaiArr = palyerViewItem.pongCardView.pongPaiArr
                    if (!cc.g.utils.judgeArrayEmpty(pongPaiArr)) {
                        pongPaiArr.forEach((pong)=>{
                            if (pong.type == 'peng') {
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                if (checkTong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }

                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'mkang') { // 明杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                baiPaiArr.push(pong.code3)
                                if (checkTong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'akang') { // 暗杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                baiPaiArr.push(pong.code3)
                                if (checkTong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code3 == 1) {
                                        hzCount++
                                    }
                                }

                            } else if (pong.type == 'fei') { // 飞
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code1)
                                baiPaiArr.push(pong.code2)
                                if (checkTong) {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code == 11) {
                                        ytCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 11) {
                                        ytCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 11) {
                                        ytCount++
                                    }
                                } else {
                                    if (pong.code == 1) {
                                        hzCount++
                                    }
                                    if (pong.code1 == 1) {
                                        hzCount++
                                    }
                                    if (pong.code2 == 1) {
                                        hzCount++
                                    }
                                }

                            }
                        })
                    }
                }
            }

            // 红中总个数
            let allHongZhong = this.getHongZhongCount() - hzCount;

            if (allHongZhong < 0) {
                allHongZhong = 0
            }

            // 红中总个数
            let ytHongZhong = this.getHongZhongCount() - ytCount;

            if (ytHongZhong < 0) {
                ytHongZhong = 0
            }

            // 找可以胡牌的张数
            resultArr.forEach((relt)=>{
                let huCount = 0
                let fanCount = 0
                let huMapArr = relt.huMapArr
                huMapArr.forEach((item) => {
                    // 番数，找最大的
                    let tFanCount = parseInt(item.fan)
                    if (fanCount < tFanCount) {
                        fanCount = tFanCount;
                    }

                    let huCode = parseInt(item.code)
                    let huDefaultCount = 4;
                    baiPaiArr.forEach(code=>{
                        let icode = parseInt(code)
                        if (huCode == icode) {
                            huDefaultCount--
                        }
                        // if (!cc.g.utils.judgeObjectEmpty(icode)) {
                        //     if (huCode == icode) {
                        //         huDefaultCount--
                        //     }
                        // }
                    })

                    // 如果是红中，则再加上剩下的红中个数
                    if (checkTong) {
                        if (huCode == 1) {
                            huDefaultCount = allHongZhong
                        }

                        if (huCode == 11) {
                            huDefaultCount = ytHongZhong
                        }

                    } else {
                        if (huCode == 1) {
                            huDefaultCount = allHongZhong
                        }
                    }


                    // 胡的张数
                    if (huDefaultCount <= 0) {
                        huDefaultCount = 0;
                    }

                    // 可以胡的张数，都加上红中
                    item.num = huDefaultCount
                    // 总张数
                    huCount+= huDefaultCount
                })

                relt.huCount = huCount
                relt.fanCount = fanCount
                // 默认都是1
                relt.noraml = 1;
            });

            // 保存胡牌提示数组
            this.huPaiAlertArr = resultArr

            this.showHuPaiAlertReconBtn()

            if (showAlert) {
                // 显示胡牌提示按钮
                this.OnInGMTip()
            }
        } else {
            this.huPaiAlertArr = []
            this.huPaiCurrentItem = null
            
            this.HuNodeTips.active = false;
            
            this.Node_hupaiTip.active = false;
            this.doCancelAutoHu();
        }
    },
    OnInGMTip: function () {
        if (this.huPaiCurrentItem) {
            this.Node_hupaiTip.active = true;

            // 显示胡牌提示
            // this.doShowHuPaiAlertView();
            this.Sprite_hu_count_label.string = this.huPaiCurrentItem.huCount + ''
            this.Sprite_hu_bei_label.string = this.huPaiCurrentItem.fanCount + ''

            // 先移除
            this.Sprite_hu_Gbox.removeAllChildren(true);
            this.sv_huifo.content.removeAllChildren(true);
            this.sv_huifo.node.active = this.Sprite_hu_Gbox.active = false;

            // huMapArr
            let huMapArr = this.huPaiCurrentItem.huMapArr;
            const self = this;

            if (huMapArr.length <= 18) {
                this.Sprite_hu_Gbox.active = true;

                huMapArr.forEach((item) => {
                    // item.num
                    // item.fan
                    // item.code
                    let cardNode = cc.instantiate(this.SIPlayerPf5);

                    let Label_fan = cc.find("Label_fan", cardNode).getComponent(cc.Label);
                    Label_fan.string = item.fan + '番'

                    let Label_num = cc.find("Label_num", cardNode).getComponent(cc.Label);
                    Label_num.string = item.num + '张'

                    let Sprite_cardVal = cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite);
                    Sprite_cardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + item.code);

                    // add
                    self.Sprite_hu_Gbox.addChild(cardNode);
                })

                let paiLength = huMapArr.length;

                if (paiLength > 6) {
                    this.Sprite_Hu_bg.width = 950
                    this.Sprite_hu_Gbox.width = 820

                    this.Sprite_Hu_bg.height = 260
                    if (paiLength > 12) {
                        this.Sprite_Hu_bg.height = 370
                    }
                    // this.Sprite_Hu_bg.y = 4.8
                    // this.Sprite_hu_Gbox.y = 4
                } else {
                    let baseWidth = 140
                    let mjWidth = 100 * paiLength
                    let mjSpawidth = 20 * (paiLength) + 80
                    this.Sprite_Hu_bg.width = baseWidth + mjWidth + mjSpawidth
                    this.Sprite_Hu_bg.height = 180//200
                    this.Sprite_hu_Gbox.width = mjWidth + mjSpawidth
                    //4.8
                    // this.Sprite_Hu_bg.y = -40
                    // this.Sprite_hu_Gbox.y = -40
                }
            } else {
                this.scheduleOnce(()=>{
                    this.sv_huifo.scrollToTop(0, false);
                }, 0.1)
                this.sv_huifo.node.active = true;
                // this.Sprite_Hu_bg.y = 1.8
                // this.Sprite_hu_Gbox.y = 4

                // 大于18走scollerview
                huMapArr.forEach((item) => {
                    let cardNode = cc.instantiate(this.SIPlayerPf5);

                    let Label_fan = cc.find("Label_fan", cardNode).getComponent(cc.Label);
                    Label_fan.string = item.fan + '番'

                    let Label_num = cc.find("Label_num", cardNode).getComponent(cc.Label);
                    Label_num.string = item.num + '张'

                    let Sprite_cardVal = cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite);
                    Sprite_cardVal.spriteFrame =  this.majhCardAtlas0.getSpriteFrame('majh_cardval_' + item.code);

                    // add
                    this.sv_huifo.content.addChild(cardNode);
                })

                this.Sprite_Hu_bg.width = this.Sprite_Hu_bg.ow;
                this.Sprite_Hu_bg.height = this.Sprite_Hu_bg.oh;
            }
        } else {
            this.Node_hupaiTip.active = false;
        }
    },
    doCloseHuPaiView: function() {
        this.Node_hupaiTip.active = false;
        // this.sv_huifo.scrollToTop(0, true);
    },
    doShowHuPaiAlertView: function () {
    },

    doAutoHu(event) {
        if (this.Sprite_Light.active) {
            this.gameMgr.sendOp(DEF.PlayerOpt.AutoHu.v, 0, this.timeStamp);
        } else {
            this.gameMgr.sendOp(DEF.PlayerOpt.AutoHu.v, 1, this.timeStamp);
        }

        this.Sprite_Light.active = !this.Sprite_Light.active;
        // this.isAutoHu = this.Sprite_Light.active;

        if (this.checkCanPlayMj()) {
            this.needCallBack = true;
            if (!this.Sprite_Light.active) {
                this.isAutoHu = false;
            }
        } else {
            this.isAutoHu = this.Sprite_Light.active;
        }

        // let player = this.playerView[0].player
        // player.d.isAutoHu = this.isAutoHu

        this.doShowAllHiddenZeZhaoView();
    },

    doCancelAutoHu: function() {
        if (!this.isbpm) {
            if (this.Sprite_Light.active) {
                this.gameMgr.sendOp(DEF.PlayerOpt.AutoHu.v, 0, this.timeStamp);
                this.Sprite_Light.active = false
                this.isAutoHu = false;
                this.doShowAllHiddenZeZhaoView();
            }
        }
    },

    checkDaPaiStatus: function() {
        this.isAutoHu = this.Sprite_Light.active;
        this.needCallBack = false;

        this.doShowAllHiddenZeZhaoView();
    },
    doReconAutoHu(hu) {
        this.Sprite_Light.active = hu;
        this.isAutoHu = hu;

        this.doShowAllHiddenZeZhaoView();
    },

    doRealReciveAutoHu: function(palyerViewItem, code) {
        if (code == 1) {
            this.Sprite_Light.active = true
            this.isAutoHu = true
        } else {
            this.Sprite_Light.active = false
            this.isAutoHu = false
        }

        this.doShowAllHiddenZeZhaoView();
    },

    doShowAllHiddenZeZhaoView:function() {
        let palyerViewItem = this.playerView[0]
        palyerViewItem.handCardView.Node_Place.active = this.isAutoHu
    },

    doBaoJiao: function(event, customEventData) {
        this.Node_BaoJiao.active = false;
        // 报叫类型:0 表示不报，1表示报
        // 如果是庄家 报叫: op.K = OP_报叫;op.V = [打的牌,报叫类型]
        // 如果是闲家 闲家不需要打牌   报叫: op.K = OP_报叫;op.V = [0,报叫类型]
        if (customEventData == 1) { // 报较
            this.isBaoJiao = true;

            // 提前显示报叫
            if (this.saveCurrentPalyerViewItem) {
                this.saveCurrentPalyerViewItem.Bao_Jiao_Sprite.active = true;
            }

            // 是庄稼
            if (this.doCheckCanPlayDaPai()) {
                // 点击报叫后，计算胡牌提示
                this.doCheckHuAlert();
                if (!cc.g.utils.judgeArrayEmpty(this.huPaiCodeArr)) {
                    let palyerViewItem = this.playerView[0]
                    // 手牌规则，去掉相同的，除开红中，遍历的时候，不用遍历红中
                    let handlePaiArray = palyerViewItem.handCardView.hcGroups;

                    handlePaiArray.forEach((node)=>{
                        if (node.active) {
                            let findeCode = false
                            this.huPaiCodeArr.forEach((code)=>{
                                if (node.code == code) {
                                    findeCode = true
                                }
                            })

                            if (!findeCode) {
                                let Sprite_ZeZao = cc.find("Sprite_ZeZao", node)
                                Sprite_ZeZao.active = true
                                node.zezao = true
                            }
                        }
                    })
                }

                // 修改玩家状态
                let player = this.playerView[0].player
                player.d.status = LG_Sta.Play.v
            } else {
                this.gameMgr.sendOp(DEF.PlayerOpt.Jiao.v, [0, 1]);
                // this.isBaoJiao = false;
                this.saveCurrentPalyerViewItem = null;
            }
            // this.gameMgr.sendOp(DEF.PlayerOpt.TiGuiGang.v, 1);
        } else if (customEventData == 2) { // 堵自摸
            // this.gameMgr.sendOp(DEF.PlayerOpt.TiGuiGang.v, 2);
        } else if (customEventData == 3) { // 不报较
            // this.isBaoJiao = false;
            //
            this.gameMgr.sendOp(DEF.PlayerOpt.Jiao.v, [0, 0]);
        }
    },

    doCheckGangItem: function(event, customEventData) {
        WangCodeUtils.canHongPlay = !WangCodeUtils.canHongPlay;
        if (WangCodeUtils.canHongPlay) {
            // this.Check_Sprite.active = true;
            this.gameMgr.sendOp(DEF.PlayerOpt.TiGuiGang.v, 1, this.timeStamp);
        } else {
            // this.Check_Sprite.active = false;
            this.gameMgr.sendOp(DEF.PlayerOpt.TiGuiGang.v, 0, this.timeStamp);
        }
    },
    doUpdateCheckGangItem: function(palyerViewItem, playVaul) {
        let getRelDeskId = palyerViewItem.index

        if (getRelDeskId == 0) {
            WangCodeUtils.canHongPlay = playVaul;
            if (WangCodeUtils.canHongPlay) {
                // this.Check_Sprite.active = true;
            } else {
                // this.Check_Sprite.active = false;
            }
        }
    },

    doRealReciveCanBaoJiao: function(palyerViewItem, code, showAnima) {
        this.Node_BaoJiao.active = true;
        this.saveCurrentPalyerViewItem = palyerViewItem;
        // 是否是庄稼
        // if (palyerViewItem.index == 0) {
        //     this.isZhuanPlayer = true
        // } else {
        //     this.isZhuanPlayer = false
        // }
    },
    doRealReciveBaoJiao: function(palyerViewItem, code, showAnima) {
        this.Node_BaoJiao.active = false;
        if (code == 1) {
            palyerViewItem.Bao_Jiao_Sprite.active = true;
        } else {
            palyerViewItem.Bao_Jiao_Sprite.active = false;
        }
    },

    doReconnectShowBaoJiaoStatus: function (palyerViewItem, baoJiaoStatus) {

        if (baoJiaoStatus) {
            palyerViewItem.Bao_Jiao_Sprite.active = true
        } else {
            palyerViewItem.Bao_Jiao_Sprite.active = false
        }
    },

    doCloseTiFeiView: function() {
        this.Node_TiFeiView.active = false;
        // this.sv_huifo.scrollToTop(0, true);
    },

    doCloseGangMultView: function() {
        this.Node_MultGanView.active = false;
        // this.sv_huifo.scrollToTop(0, true);
    },

    /* =================================================================================================================== */
    
    // 调试按钮
    onDbgBtn: function (event, customEventData) {
        let palyerViewItem = this.playerView[1]
        palyerViewItem.showHuAnimation('3hu');


        // this.___dbg = true;
        //
        // let readyPlayer = ()=>{
        //     for (let i = 0; i < this.playerView.length; i++) {
        //         this.playerView[i].root.active = true;
        //         if (! this.playerView[i].player){
        //             this.playerView[i].player = {};
        //             let p = this.playerView[i].player;
        //
        //             p.view = this.playerView[i];
        //             p.showGroups = [];
        //             p.outCodes = [];
        //             p.POK = {
        //                 _34: 0,
        //                 long: 1,
        //                 bao: 2,
        //                 chi: 3,
        //                 peng: 4,
        //                 zhao: 5,
        //                 hu: 6,
        //                 pass: 7,
        //             };
        //
        //             p.d={};
        //             p.d.name = '测试名'+i;
        //             p.d.uid = i;
        //             p.d.sex = 1;
        //             p.d.icon = '1';
        //
        //             this.gameMgr.uidPlayers[p.d.uid] = p;
        //         }
        //
        //         let p = this.playerView[i].player;
        //         p.showGroups = [];
        //     }
        // }
        //
        // // 动画 0
        // if ( true) {
        //     let av = this.anmView;
        //     av.nodeAninamtion.active = true;
        //
        //     if (! this.dbg0) {
        //         this.dbg0 = 1;
        //     }
        //
        //     if (this.dbg0 == 1) {
        //         // 播放骰子动画
        //         this.Node_SaiZi_View.active = false;
        //         this.Sprite_SaiZi_1.node.active = false;
        //         this.Sprite_SaiZi_2.node.active = false;
        //
        //         let num1 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        //         if (num1 < 0) {
        //             num1 = 0;
        //         }
        //         if (num1 > 6) {
        //             num1 = 6;
        //         }
        //         let num2 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        //         if (num2 < 0) {
        //             num2 = 0;
        //         }
        //         if (num2 > 6) {
        //             num2 = 6;
        //         }
        //
        //         av.anmSaizi.onec(av.anmSaizi.names[0], ()=>{
        //             // 骰子
        //             this.Sprite_SaiZi_1.node.active = true;
        //             this.Sprite_SaiZi_1.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num1);
        //
        //             // 隐藏提示文字
        //             this.Node_Bg_Tips.active = false;
        //             this.anmView.nodeAninamtion.active = false
        //
        //         }, false);
        //
        //         this.scheduleOnce(()=>{
        //             this.Node_SaiZi_View.active = true;
        //             this.Sprite_SaiZi_2.node.active = true;
        //             this.Sprite_SaiZi_2.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num2);
        //         }, 0.68);
        //     }
        // }
    },
});
