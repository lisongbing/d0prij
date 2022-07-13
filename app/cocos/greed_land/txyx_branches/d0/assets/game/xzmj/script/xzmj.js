var GameBase = require('GameBase');
var HuPaiUtils = require("xzmjHuPaiUtils");
var majhCtrls = require('xzmjCtrls');
var DEF = require('xzmjDef');


let LG_Sta = DEF.PlayerSta;

var cardPrefab = cc.Class({
    name: 'xzcardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});
var qiCardPrefab = cc.Class({
    name: 'xzqiCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var pongCardPrefab = cc.Class({
    name: 'xzpongCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var gangCardPrefab = cc.Class({
    name: 'xzgangCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});

var angangCardPrefab = cc.Class({
    name: 'xzangangCardPrefab',
    properties: {
        prefab: cc.Prefab,
        menuId: '',
    },
});


var huCardPrefab = cc.Class({
    name: 'xzhuCardPrefab',
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

        this.timeStamp = null
        // 是否报叫
        this.isBaoJiao = false;

        this.needCallBack = false;
        //
        // // 是否自动胡牌
        // this.isAutoHu = false;
        // if (this.Sprite_Light != null) {
        //     this.Sprite_Light.active = false
        // }

        this.saveCurrentPalyerViewItem = null;
    },
    onLoad () {
        // 获取消息处理mgr
        this.gameMgr = cc.g.xzmjMgr;

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

        // 房间信息
        // let roomInfo = cc.find("game_top_layout", r);
        // 局数
        // this.labelJueShu = cc.find("game_top_jeshu_layout/jueshu_label", roomInfo).getComponent(cc.Label);
        //  房间号
        // /*this.label_room = cc.find("game_top_r*/oom_layout/room_label", roomInfo).getComponent(cc.Label);
        // 显示时间
        // this.label_timer = cc.find("game_top_timer_layout/timer_bg_img/timer_label", roomInfo).getComponent(cc.Label);

        // 准备按钮
        // this.buttonReady = cc.find("buttonReady", r);

        // // 复制、邀请好友
        this.Node_gmfreeBtns = cc.find("Node_gmfreeBtns", r);

        // 准备按钮
        this.buttonReady = cc.find("Node_gmfreeBtns/buttonReady", r);
        // 亲友圈邀请
        this.Button_qyqyq = cc.find("Node_gmfreeBtns/Button_2", r);
        // 邀请好友
        this.Button_yqhy = cc.find("Node_gmfreeBtns/New Node", r);

        // 换牌界面
        this.node_Huanpai = cc.find("Node_Huanpai", r)
        this.node_Huanpai.active = false
        // 换牌按钮
        this.huanPaiBtn = cc.find("Layout_HuanPai/Button_HuanPai", this.node_Huanpai).getComponent(cc.Button)
        // 设置位灰色按钮
        this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_08');
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

        // 杠按钮
        this.Button_Gang = cc.find("Button_Gang", this.Node_HuTiGangView);
        this.Button_Gang.active = false;
        // 杠动画
        // let Node_Gang = cc.find("Button_Gang/Node_Gang", this.Node_HuTiGangView);
        // this.Ami_Node_Gang = this.crtAnmObj(Node_Gang);

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

        // // 复制、邀请好友
        // this.Node_gmfreeBtns = cc.find("Node_gmfreeBtns", r);
        // // // 离开房间
        // this.Sprite_leavebtn = cc.find("Node_gmfreeBtns/Button_leaveroom/Sprite_leavebtn", r).getComponent(cc.Sprite);

        // 换牌界面
        this.node_HuaiPai_all_View = cc.find("Node_HanPai_All_View", r);
        this.node_HuaiPai_all_View.active = false

        // 骰子位置
        this.Node_SaiZi_View = cc.find("Node_SaiZi_View", r);
        this.Node_SaiZi_View.active = false;
        this.Sprite_SaiZi_1 = cc.find("Node_SaiZi_View/Sprite_SaiZi_1", r).getComponent(cc.Sprite);
        this.Sprite_SaiZi_2 = cc.find("Node_SaiZi_View/Sprite_SaiZi_2", r).getComponent(cc.Sprite);

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

        this.Sprite_dong = cc.find("Sprite_Bg_Node/Sprite_dong", r);
        this.Sprite_dong.active = false;

        this.Sprite_bei = cc.find("Sprite_Bg_Node/Sprite_bei", r);
        this.Sprite_bei.active = false;

        this.Sprite_xi = cc.find("Sprite_Bg_Node/Sprite_xi", r);
        this.Sprite_xi.active = false;

        this.Sprite_nan = cc.find("Sprite_Bg_Node/Sprite_nan", r);
        this.Sprite_nan.active = false;

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


        // 胡牌提示
        this.HuNodeTips = cc.find("HuNodeTips", r);
        this.HuNodeTips.active = false;
        this.Sprite_Light = cc.find("HuNodeTips/AutoHuButton/Sprite_Light", r);//.getComponent(cc.Sprite);
        this.Sprite_Light.active = false;
        // 是否自动胡牌
        this.isAutoHu = false;

        // 托管提示
        this.Node_tgts = cc.find("Node_tgts", r);
        this.Node_tgts.desc = cc.find("text", this.Node_tgts).getComponent(cc.Label);
        this.Node_tgts.active = false;

        this.initAreaDatas();
        // 玩家视图
        this.initPlayerView();
        // 初始化动画层
        this.initAnimationView();
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
    },
    initAreaDatas: function() {
        let ri = this.gameMgr.roomInfo;
        this.initPaiCount();
    },
    initPaiCount: function() {
        // 几个玩家
        let palerCount = parseInt(this.gameMgr.roomInfo.total)

       // let hongZhongCount = this.getHongZhongCount();

        let allCount = 108;
        // 是2方麻将
        if (this.getTwoQueRule()) {
            allCount = allCount - 36
        }

        let showCount = allCount - 14 - (palerCount - 1) * 13;
        // 红中个数
        this.Label_Left_Num.string = showCount

        // this.gameMgr.roomInfo.cardNum = showCount + '';
    },
    initPaiCountStart: function() {
        // 几个玩家
        let palerCount = parseInt(this.gameMgr.roomInfo.total)

        // let hongZhongCount = this.getHongZhongCount();

        let allCount = 108;
        // 是2方麻将
        if (this.getTwoQueRule()) {
            allCount = allCount - 36
        }

        let showCount = allCount// - 14 - (palerCount - 1) * 13;
        // 红中个数
        this.Label_Left_Num.string = showCount
        this.hidderStartTimer()
        this.Num_Down_Label.string = '00';

        // this.gameMgr.roomInfo.cardNum = showCount + '';
    },
    getHongZhongCount: function() {
        // 找红中个数  12 无红中 13 4个 14 8个 15 11个 16 12个
        let newRlue = this.gameMgr.roomInfo.NewRlue
        let hongZhongCount = 0;

        //  找红中个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 13) {
                hongZhongCount = 4;
                break;
            } else if (num == 14) {
                hongZhongCount = 8;
                break;
            } else if (num == 15) {
                hongZhongCount = 11;
                break;
            } else if (num == 16) {
                hongZhongCount = 12;
                break;
            }
        }

        return hongZhongCount
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
            if (num == 20) {
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
            if (num == 21) {
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
        this.resetDatas();

        cc.g.hallMgr.inGameMenu.upteagold();

        this.upGamesCom();

        this.initPaiCountStart();
        
        let ri = this.gameMgr.roomInfo;
        // 更新局数
        this.upTurn();
        // 房间号
        // this.label_room.string = ri.roomId;

        // 房间号
        // this.label_room.string = ri.roomId;

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

        // 重置右侧功能菜单按钮位置(聊天，设置，麦克风)
        // cc.g.hallMgr.inGameMenu.micNode.active = true;
        // 如果是房主,'解散房间'；不是房主,'离开房间'
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

        this.upTuoguanTishi();

        // 操作按钮
        this.upOperate();

        this.HuNodeTips.active = false;
        // this.Sprite_Light.active = false

        // 判断解散
        this.jiesanView && this.jiesanView.clear();
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            if (e.player && e.player.voteSta) {
                e.player.askJiesan();
                break;
            }
        }

        // 断线后，检测
        this.doCheckHuAlert();
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
    starGame: function () {
        this.buttonReady.active = false;

        // 亲友圈邀请
        this.Button_qyqyq.active = false;
        // 邀请好友
        this.Button_yqhy.active = false;

        this.tgdjsObj = {};
        this.gameMgr.roomInfo.autoCountDown = [];
        this.upTuoguanTishi();

        // 隐藏已经准备
        for (let i = 0; i < this.playerView.length; i++) {
            this.playerView[i].onStarGame();
        }

        this.beginSendCard();
    },
    // 重置游戏
    resetGame: function () {
        this._super();

        this.upPage();
    },
    //
    beginSendCard: function () {
        // 播放开局动画
        let self = this
        self.anmView.nodeAninamtion.active = true;
        // self.anmView.anmKaiJu.onec(self.anmView.anmKaiJu.names[0], ()=>{
        //
        //
        // }, false);
        // self.anmView.anmKaiJu.active = false

        // 播放骰子动画
        this.Node_SaiZi_View.active = false;
        this.Sprite_SaiZi_1.node.active = false;
        this.Sprite_SaiZi_2.node.active = false;

        let num1 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        if (num1 < 0) {
            num1 = 0;
        }
        if (num1 > 6) {
            num1 = 6;
        }
        let num2 = Math.floor(Math.random()*6) + 1;  //可均衡获取0到6的随机整数。
        if (num2 < 0) {
            num2 = 0;
        }
        if (num2 > 6) {
            num2 = 6;
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
                }, parseInt(this.sendCardTimer));
            }, 0.4);
        }, false);

        this.scheduleOnce(()=>{
            this.Node_SaiZi_View.active = true;
            this.Sprite_SaiZi_2.node.active = true;
            this.Sprite_SaiZi_2.spriteFrame = this.majhAtlas0.getSpriteFrame('majh_touzi_' + num2);
        }, 0.68);
    },
    // 发牌
    sendCard: function() {
        // 发牌后，再次计算牌的张数
        this.initPaiCount();

        // 胡的次数
        this.ziHuCount = 0

        // 胡牌提示数组
        this.huPaiAlertArr = []

        this.huCodeArr = []

        // 当前可以胡牌的
        this.huPaiCurrentItem = null

        // 隐藏换牌界面
        this.node_HuaiPai_all_View.active = false

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
            e.startSendCard();
        }

        // 自动题拍显示在选派后
        this.doAutoSelectThreePai(this.playerView[0])
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
        // des += cc.g.areaInfo[ri.origin].name + '血战麻将,';
        des += '血战麻将,';
        des += ri.GameNum + '局,';
        des += ri.total + '人';
        
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    des += ',' + rules[e];
                } else {
                    cc.error('血战麻将错误规则ID', e);
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
        let name = gameTypes[ri.gameType] ? gameTypes[ri.gameType].NAME : '血战麻将';
        let title = GameConfig.appName + '<' + name + '>'+ '\n';
        title += '房号:' + ri.roomId + ' ' + (ri.clubId ? '茶馆房' : '普通房');
        
        let desc = [];
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    desc.push(rules[e]);
                } else {
                    cc.error('血战麻将错误规则ID', e);
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

        this.clearReapet();
    },

    clearReapet:function() {

        this.node_HuaiPai_all_View.active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai0", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai1", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai2", this.node).active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai3", this.node).active = false;

        let palyerViewItemp = this.playerView[0]
        palyerViewItemp.handCardView.Node_Place.active = false

        // 是否自动胡牌
        this.isAutoHu = false;
        if (this.Sprite_Light != null) {
            this.Sprite_Light.active = false
        }

        // 修改样式
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]
            palyerViewItem.hiddenHuAnimation()
        }

        // //  隐藏胡牌提示
        // this.playerView[0].paiAnima.nodeHuAnima.stop()
        // this.playerView[0].paiAnima.nodeHuAnima.active = false;
        // //  隐藏胡牌提示
        // this.playerView[1].paiAnima.nodeHuAnima.stop()
        // this.playerView[1].paiAnima.nodeHuAnima.active = false;
        // //  隐藏胡牌提示
        // this.playerView[2].paiAnima.nodeHuAnima.stop()
        // this.playerView[2].paiAnima.nodeHuAnima.active = false;
        //
        // //  隐藏胡牌提示
        // this.playerView[3].paiAnima.nodeHuAnima.stop()
        // this.playerView[3].paiAnima.nodeHuAnima.active = false;

        // 胡的次数
        this.ziHuCount = 0

        this.codeLight = -100;

    },

    // 收到服务器发牌消息
    doReciveSendCard: function() {
        // this.Node_gmfreeBtns.active = false;
        //this.gameMgr.roomInfo.status = DEF.RMSTA.SendCard.v;
        // this.roomInfo.cardNum = DEF.ToltalCardNum;
        this.starGame();
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
                    icon = p.d.icon;
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
            if (qiPaiItem.code == 50) {
                return
            }
            if (qiPaiItem.isSelected) {
                qiPaiItem.setPosition(qiPaiItem.x, qiPaiItem.endPosY);
                qiPaiItem.isSelected = false;
            } else {
                if (qiPaiItem.y > 0) {
                    qiPaiItem.isSelected = false;
                    qiPaiItem.setPosition(qiPaiItem.x, 0);
                } else {
                    // 判断是否选了3张
                    this.selectThreePai(handlePaiArray);
                    // 选中棋牌
                    qiPaiItem.setPosition(qiPaiItem.x, qiPaiItem.y + 30);
                    qiPaiItem.isSelected = true;
                }
            }

            // 改变选牌按钮颜色
            this.changeXuanPaiColor(handlePaiArray)
        } else if (player.d.status == LG_Sta.Play.v) { // 可以打牌了,
            let qiPaiItemTwo = customData

            // // 红中，则返回 或者 显示操作按钮时候 返回
            // if (qiPaiItemTwo.code == 50 || this.Node_HuTiGangView.active || qiPaiItemTwo.zezao) {
            //     return
            // }
            // 红中，则返回 或者 显示操作按钮时候 返回
            if (qiPaiItemTwo.code == 50 || qiPaiItemTwo.zezao) {
                return
            }
            if (qiPaiItemTwo.isSelected || qiPaiItemTwo.y > 0) {

                if (this.doCheckCanPlayDaPai()) {
                    // 先出牌
                    this.doPlayMj(palyerViewItem, qiPaiItemTwo.code);

                    // 打牌
                    let chicode = [];
                    chicode.push(qiPaiItemTwo.code)
                    this.gameMgr.sendOp(DEF.PlayerOpt.DaPai.v, chicode, this.timeStamp);

                    // 检测是否有同样的牌
                    this.doCheckSamePai(-1000);
                } else {
                    qiPaiItemTwo.setPosition(qiPaiItemTwo.x, 0);
                }


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
            if (qiPaiItemTwo.code == 50 || this.Node_HuTiGangView.active || qiPaiItemTwo.zezao) {
                return
            }
            if (qiPaiItemTwo.isSelected || qiPaiItemTwo.y > 0) {
                // 重置回来
                qiPaiItemTwo.setPosition(qiPaiItemTwo.x, qiPaiItemTwo.endPosY);
                qiPaiItemTwo.isSelected = false;

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
            this.huPaiCurrentItem = this.huPaiAlertArr[0];
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
        if (curSelectIndexArr.length == 3) {
            curSelectIndexArr.forEach(item => {
                item.setPosition(item.x, item.endPosY);
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
            if (code >= 1  && code <= 9) {
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
        let curNum = []
        handlePaiArray.forEach(item => {
            if (item.isSelected) {
                curNum.push(item.code)
                allSelectNum++
            }
        });

        if (allSelectNum == 3) {
            // 相同花色
            let isSameHuase = this.checkIsSameMj(curNum)
            if (isSameHuase) {
                this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_01');
                this.huanPaiBtn.enabled = true
            } else {
                this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_08');
                this.huanPaiBtn.enabled = false
            }
        } else {
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_08');
            this.huanPaiBtn.enabled = false
        }
    },
    // 显示可以换三张
    showCanHuanSanZhang: function (palyerViewItem) {
        this.node_Huanpai.active = true
        //  显示选牌动画
        for (let i = 0; i < this.playerView.length; i++) {
            let player = this.playerView[i]
            if (i != 0) {
                player.showXuanPai();
            }
        }

        // this.scheduleOnce(()=>{
        //     // 自动提起3张
        //     this.doAutoSelectThreePai(palyerViewItem);
        // }, 1.5);
    },
    // 自动选3张
    doAutoSelectThreePai: function (palyerViewItem) {
        // 可以换三张
        let canHuan = this.getHuanSanZhangRule();
        if (palyerViewItem.index == 0 && canHuan) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            let tiaoCount = 0;
            let tongCount = 0;
            let wanCount = 0;
            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    if (org.code >= 1 && org.code<=9) {
                        tiaoCount++;
                    } else if (org.code >= 11 && org.code<=19) {
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

            let selectCodeArr = []
            if (x > 0 && y > 0 && c > 0) {
                let min = x < y ? (x < c ? x : c)  : (y < c ? y : c);
                if (min == tiaoCount) {
                    for (let i = 0; i < handlePaiArray.length; i++) {
                        let org = handlePaiArray[i]
                        if (org.active) {
                            if (org.code >= 1 && org.code<=9) {
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
                            if (org.code >= 11 && org.code<=19) {
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
                            if (org.code >= 11 && org.code<=19) {
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
                            if (org.code >= 1 && org.code<=9) {
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
                            if (org.code >= 1 && org.code<=9) {
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
                            if (org.code >= 11 && org.code<=19) {
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
                        if (org.code >= 1 && org.code<=9) {
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
                        if (org.code >= 11 && org.code<=19) {
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
    // 自动提示定缺
    doAutoDingQueAlert: function (palyerViewItem) {
        if (palyerViewItem.index == 0) {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            let x = 0;
            let y = 0;
            let c = 0;
            for (let i = 0; i < handlePaiArray.length; i++) {
                let org = handlePaiArray[i]
                if (org.active) {
                    if (org.code >= 1 && org.code<=9) {
                        x++;
                    } else if (org.code >= 11 && org.code<=19) {
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
        if (getRelDeskId == 0) {
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

        // 显示换牌页面
        this.node_HuaiPai_all_View.active = true;
        cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = true;
    },
    doChangeReConnectUi: function(palyerViewItem) {
      //  this.node_HuaiPai_all_View.active = false;
        let getRelDeskId = palyerViewItem.index
        
        cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = false;

        // 显示换牌节点
        if (getRelDeskId == 0) {
            this.node_Huanpai.active = true
            this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_08');
            this.huanPaiBtn.enabled = false
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
        //     this.doAutoSelectThreePai(palyerViewItem);
        // }, 0.4);

        // 自动提起3张
        this.doAutoSelectThreePai(palyerViewItem);

    },
    doChangeReConnectHuanSanUi: function(palyerViewItem) {

        let getRelDeskId = palyerViewItem.index

        // 隐藏节点Node_XuanPai
        if (getRelDeskId == 0) {
            this.node_Huanpai.active = false
        }

        // 已经换三张了
        palyerViewItem.hiddenXuanPai();

        // 显示换牌页面
        this.node_HuaiPai_all_View.active = true;
        cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = true;
    },
    //  收到通知消息, 更新对应玩家消息
    doShowOtherHuanSanZhangView: function(palyer) {
        let palyerViewItem = this.gameMgr.uidPlayers[palyer.uid]
        if (palyerViewItem && palyerViewItem.view) {
            palyerViewItem.view.hiddenXuanPai();
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
        // 隐藏换牌页面
        // this.anmView.nodeAninamtion.active = false;

        if (!this.isbpm) {
            // 隐藏换牌页面
            this.anmView.nodeAninamtion.active = false;
        }

        this.node_HuaiPai_all_View.active = false;
        cc.find("Node_HanPai_All_View/mjhuanpai"+getRelDeskId, this.node).active = false;

        //  换牌的code
        let newPaiCodeArr = [];

        handlePaiArray.forEach(org => {
            if (org.active) {
                newPaiCodeArr.push(org.code)
            }
        });

        // // 判断是否是断线重连回来
        // if (newPaiCodeArr.length >= 13) {
        //     return;
        // }

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

        if (getRelDeskId == 0 || this.isbpm) {
            // 重新排序
            handlePaiArray.sort(this.compareArrayTwo);
        }

        // 更新位置
        palyerViewItem.handCardView.updateAllHandleCardPosition();

        // if (getRelDeskId == 0) {
        //     palyerViewItem.handCardView.runInsertAction(huanPaiArr)
        // }
        if (!this.isbpm) {
            if (getRelDeskId == 0) {
                palyerViewItem.handCardView.runInsertAction(huanPaiArr)
            }
        }
    },
    // 显示定缺按钮
    doShowDingQue: function (palyerViewItem) {

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
                
                if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1))) {
                    playerViewItem.showDingQueing();
                } else {
                    if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1)) {
                        playerViewItem.showDingQue(queName);
                    }
                }
            }
        }, timerLen);
    },
    doShowDingReConnectQue: function (palyerViewItem) {
        // 隐藏换牌界面
        this.node_HuaiPai_all_View.active = false;

        // 换三张
        this.node_Huanpai.active = false

        const self = this

        let timerLen = 2.5;
        if (this.isbpm) {
            timerLen = 0.5;
        }

        // this.scheduleOnce(()=>{
        //     //  获取定缺名字
        //     let queName = this.doAutoDingQueAlert(palyerViewItem);
        //     //  显示定缺中动画
        //     // 选牌状态
        //     for (let i = 0; i < self.playerView.length; i++) {
        //         let playerViewItem = self.playerView[i]
        //
        //         // 可以换三张
        //         if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1))) {
        //             playerViewItem.showDingQueing();
        //         } else {
        //             if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1)) {
        //                 playerViewItem.showDingQue(queName);
        //             }
        //         }
        //     }
        // }, timerLen);

        //  获取定缺名字
        let queName = this.doAutoDingQueAlert(palyerViewItem);
        //  显示定缺中动画
        // 选牌状态
        for (let i = 0; i < self.playerView.length; i++) {
            let playerViewItem = self.playerView[i]

            // 可以换三张
            if (i != 0 && (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1))) {
                playerViewItem.showDingQueing();
            } else {
                if (playerViewItem.player && playerViewItem.player.d && (playerViewItem.player.d.status < 5) && (playerViewItem.player.queIndex == -1)) {
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

        let getRelDeskId = palyerViewItem.index;

        // this.hidderStartTimer();

        // 播放音频
        this.gameMgr.audio.pai(v, palyerViewItem.player.d.sex);

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
            if (v == parseInt(lastOne.code)) {
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
            if (!isPlayLastOne && lastOne.needAnim) {
                // 做动画
                palyerViewItem.handCardView.animatInsertOneCard(lastOne);
                lastOne.needAnim = false;
            }

            // 隐藏胡提杠按钮
            this.Node_HuTiGangView.active = false
            this.Node_HuTiGangViewCancle.active = false

            // // 胡牌提示数组, 保存胡牌提示
            // this.showHuPaiAlertBtn(v);
            //

            // 每次摸牌都判断胡牌提示
            this.doCheckHuPaiByCode(v, false);

        } else {
            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            // for (let i = 0; i < handlePaiArray.length; i++) {
            //     let hanldeItem = handlePaiArray[i]
            //     if (hanldeItem.active) {
            //         hanldeItem.active = false;
            //         break;
            //     }
            // }
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
        let btn = [this.Button_Hu, this.Button_Gang, this.Button_Peng, this.Button_Guo];
        btn.forEach(e => {
            e.active = false;
        });

        this.Node_PengGang.active = false;
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
            cc.g.utils.addClickEvent(cardNode, this.node, 'xzmj', 'onClickTiClicked', cardNode);
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
    // 提牌按钮点击
    doClickTi: function () {
        let canOptVal = this.playerView[0].player.canOptVal;
        // 首先遍历手牌数据, 必须遍历手牌数据，
        let palyerViewItem = this.playerView[0]
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        let pongPaiArray = palyerViewItem.pongCardView.pongPaiArr;

        //  提牌 code
        let feiCode = []
        for (let i = 0; i < pongPaiArray.length; i++) {
            let pong = pongPaiArray[i]
            if (pong.type == 'fei') { //找到飞牌
                for (let j = 0; j < handlePaiArray.length; j++) { // 手牌中找对应的飞牌
                    let handleItem = handlePaiArray[j]
                    if ((handleItem.code == pong.code) && (handleItem.active)) {
                        feiCode.push(handleItem.code)
                        break;
                    }
                }
            }
        }

        if (!cc.g.utils.judgeArrayEmpty(feiCode)) {
            if (feiCode.length > 1) {
                // 选牌
                this.showSelectTiView(feiCode)
            } else {
                // 发提牌指令
                this.gameMgr.sendOp(DEF.PlayerOpt.Ti.v, feiCode, this.timeStamp);
                // this.Node_HuTiGangView.active = false
                this.doHiddenHutiGang();
            }
        }
    },
    doReciveTi: function(palyerViewItem, v) {
        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        // this.doPlayHuTiGangAnim(2);
        palyerViewItem.doPlayHuTiGangAnim(2);

        // 播放音频
        this.gameMgr.audio.pai('ti', palyerViewItem.player.d.sex);

        let handlePaiArray = palyerViewItem.handCardView.hcGroups;

        if (palyerViewItem.index == 0 || this.isbpm) {
            // 改变手牌的位置 先修改ui
            palyerViewItem.handCardView.changeHandleCardZhong(v, palyerViewItem.index)
        }

        // 手牌排序
        handlePaiArray.sort(this.compareArrayTwo);

        // 显示碰或者杠的UI
        palyerViewItem.pongCardView.doChangeZhongPai(v);
        palyerViewItem.pongCardView.updateAllPongCardPosition();

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
    // 显示杠牌操作
    showSelectGangView: function(arr) {
        this.Node_PengGang.active = true;
        this.Node_HuTiGangView.active = false;
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
            cc.g.utils.addClickEvent(cardNode, this.node, 'xzmj', 'onClickGangClicked', cardNode);
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
    // 杠牌按钮点击
    doClickGang: function () {
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
                    if ((pong.type == 'peng') && (pong.code == hNode.code)) {
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
                if (cardObj.code != 50) { // 排除红中
                    repeatArr.push(cardObj)
                }
            } else if (recountNum == 3) {
                let cardObj = resArr[i][0]
                if (cardObj.code != 50) { // 排除红中
                    if (cardObj.code == this.codeLight) { // 3个的
                        isAnCanGang = false
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
                // 杠牌
                this.showSelectGangView(allGangArr)
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
            gang.type = 'akang'
            gang.code = canOptVal
            gang.gtype = 1
            pongPaiCards.push(gang)

            if (deskId == 0 || this.isbpm) {
                // 碰牌后，删除数组中碰的数据
                handlePaiArray.forEach(org => {
                    if (org.code == gang.code && org.active) {
                        org.active = false
                    }
                });
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
            for (let i = 0; i < pongPaiCards.length; i++) {
                let pongItem = pongPaiCards[i]
                if (pongItem.type == 'peng' && pongItem.code == canOptVal) { // 找到杠牌了
                    // 修改状态为杠
                    pongItem.gtype = 2
                    pongItem.type = 'mkang'
                    // pongPaiCards.splice(i, 1);
                    findDatas = true;
                    break;
                }
            }

            let findIndex = -1;
            for (let i = 0; i < pongPaiArray.length; i++) {
                let pongItem = pongPaiArray[i]
                if (pongItem.code == canOptVal) { // 找到杠牌了
                    // 删除node
                    // pongPaiArray.splice(i, 1);
                    findItem = true;
                    findIndex = i;
                    break;
                }
            }

            // 插入对象
            if (findDatas && findItem) {
                if (deskId == 0 || this.isbpm) {
                    handlePaiArray.forEach(org => {
                        if (org.code == canOptVal && org.active) {
                            org.active = false
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

                // 显示碰或者杠的UI
                palyerViewItem.pongCardView.doAddGangPai(canOptVal, findIndex);
                palyerViewItem.pongCardView.updateAllPongCardPosition();

                // 改变手牌的位置
                palyerViewItem.handCardView.updateAllHandleCardPosition();
            }
        } else if (canOptType == 3) {  // 1:暗杠，2:明杠,3:点杠
            // 输入存入玩家
            let gang = {}
            // 自己摸的牌、或者手里本来有的,则是暗杠
            gang.type = 'mkang'
            gang.code = canOptVal
            gang.gtype = 3
            pongPaiCards.push(gang)

            if (deskId == 0 || this.isbpm) {
                // 碰牌后，删除数组中碰的数据
                handlePaiArray.forEach(org => {
                    if (org.code == gang.code && org.active) {
                        org.active = false
                    }
                });
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
        let canOptVal = this.playerView[0].player.canOptVal;
        // 飞 按钮
        this.gameMgr.sendOp(DEF.PlayerOpt.Fei.v, canOptVal, this.timeStamp);
        this.doHiddenHutiGang();
    },
    doRealFeiShow: function(palyerViewItem, canOptVal, deskId) {
        let canOptValCode = parseInt(canOptVal)
        let handlePaiArray = palyerViewItem.handCardView.hcGroups;
        // 输入存入玩家
        let peng = {}
        peng.type = 'fei'
        peng.code = canOptValCode
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
                if (org.code == 50 && org.active) {
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
    // 碰牌按钮点击
    doClickPeng: function () {
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
    // 隐藏胡提纲
    doHiddenHutiGang: function() {
        // 是否需要显示按钮
        this.Node_HuTiGangView.active = false

        this.Node_PengGang.active = false;

        // 修改玩家状态
        let player = this.playerView[0].player
        // 可以操作牌
        player.obks = null;
    },
    // 摸牌动作
    getServerMoPai: function (v, palyerViewItem) {
        // cc.dlog('\n\n\n\n')
        // cc.dlog('收到摸牌消息', v)
        // cc.dlog('\n\n\n\n')

        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)

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
        this.doRealQiPaiRemove(palyerViewItem, v)
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
    doReciveFei: function (palyerViewItem, v, uid) {
        let getRelDeskId = palyerViewItem.index//this.gameMgr.getViewPos(deskId)
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        /*this.doPlayHuTiGangAnim(palyerViewItem, 0);*/
        palyerViewItem.doPlayHuTiGangAnim(0);

        this.gameMgr.audio.pai('fei', palyerViewItem.player.d.sex);

        // 显示UI
        this.doRealFeiShow(palyerViewItem, v, getRelDeskId)

        // 隐藏胡提杠
        this.doHiddenHutiGang();

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

        // 隐藏胡提杠
        this.doHiddenHutiGang();

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
        //
        // let act = this.anmView.nodeAninamtion.active;
        //
        // // 1:暗杠，2:明杠,3:点杠
        // this.anmView.nodeAninamtion.active = true;
        // const self = this
        // if (canOptType == 2) {
        //     self.anmView.nodeFenBao.onec('newAnimation', ()=>{
        //         this.anmView.nodeAninamtion.active = false;
        //     }, false);
        // } else {
        //     self.anmView.nodeYue.onec('newAnimation', ()=>{
        //         this.anmView.nodeAninamtion.active = false;
        //     }, false);
        // }
    },
    doReciveGang: function (palyerViewItem, v) {
        let getRelDeskId = palyerViewItem.index;//this.gameMgr.getViewPos(deskId)
        // let palyerViewItem = this.playerView[getRelDeskId]
        //  显示定时器
        this.startTimer(getRelDeskId)

        // 播放动画
        // this.doPlayHuTiGangAnim(palyerViewItem, 3);
        palyerViewItem.doPlayHuTiGangAnim(3);

        this.doPlayGangAnim(v);

        this.gameMgr.audio.pai('gang', palyerViewItem.player.d.sex);

        // 显示杠UI
        this.doRealMoPaiGang(palyerViewItem, v, getRelDeskId)

        // 隐藏胡提杠
        this.doHiddenHutiGang();

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
        this.upPage();
        this.clearWaitCard();
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
    // 移除当前桌面供玩家操作的牌
    clearWaitCard: function () {
        // 换牌按钮为灰色
        this.node_Huanpai.active = false
        this.huanPaiBtn.getComponent(cc.Sprite).spriteFrame = this.comtxtAtlas1.getSpriteFrame('combtn_08');
        this.huanPaiBtn.enabled = false

        this.node_HuaiPai_all_View.active = false;

        // 隐藏胡提杠
        // this.Node_HuTiGangView.active = false
        this.doHiddenHutiGang();

        // 是否自动胡牌
        this.isAutoHu = false;
        if (this.Sprite_Light != null) {
            this.Sprite_Light.active = false
        }

        this.doShowAllHiddenZeZhaoView();


        let palyerViewItemp = this.playerView[0]
        palyerViewItemp.handCardView.Node_Place.active = false

        this.HuNodeTips.active = false;

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
        // this.Num_Down_Label.node.active = false;
        this.Sprite_dong.active = false;
        this.Sprite_bei.active = false;
        this.Sprite_xi.active = false;
        this.Sprite_nan.active = false;

        // 修改样式
        for (let i = 0; i < this.playerView.length; i++) {
            let palyerViewItem = this.playerView[i]

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

            // //  隐藏胡牌提示
            // palyerViewItem.paiAnima.nodeHuAnima.stop()
            // palyerViewItem.paiAnima.nodeHuAnima.active = false;
        }

        this.huPaiAlertArr = []
        this.huPaiCurrentItem = null
        this.HuNodeTips.active = false;
        this.Node_hupaiTip.active = false;
    },
    doShowAllHiddenZeZhaoView:function() {
        let palyerViewItem = this.playerView[0]
        palyerViewItem.handCardView.Node_Place.active = this.isAutoHu
    },

    doShowMyQueImg: function(palyerViewItem) {
        let getRelDeskId = palyerViewItem.index
        this.Node_Que_Anima.active = true


        // 换三张
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
            })

            let haveQuePai = false;
            handlePaiArrayActive.forEach(org => {
                let Sprite_Que = cc.find("Sprite_Que", org)
                // 条 同 万 0  1 2
                if (queIndex == 0) {
                    if (org.code >= 1 && org.code<=9) {
                        // 显示缺
                        // Sprite_Que.active = true;
                        org.isQue = true;
                        haveQuePai = true;
                    }
                }
                if (queIndex == 1) {
                    if (org.code >= 11 && org.code<=19) {
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
                    if (!org.isQue) {
                        Sprite_ZeZao.active = true;
                        org.zezao = true;
                    }
                });
            }
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
                }
            }
        }        
    },
    // doReSortPai: function(palyerViewItemOne) {
    //     if (palyerViewItemOne.index == 0 || this.isbpm) {
    //         // 重新排序
    //         let handlePaiArray = palyerViewItemOne.handCardView.hcGroups;
    //
    //         // 手牌排序
    //         handlePaiArray.sort(this.compareArrayTwo);
    //
    //         let isFindQue = false
    //         // 发现缺的，就+100
    //         handlePaiArray.forEach((node)=>{
    //             if (node.isQue && node.active) {
    //                 node.code += 100;
    //                 isFindQue = true
    //             }
    //         })
    //
    //         if (isFindQue) {
    //             // 在排序
    //             handlePaiArray.sort(this.compareArrayTwo);
    //
    //             // 发现缺的，就-100
    //             handlePaiArray.forEach((node)=>{
    //                 if (node.isQue && node.active) {
    //                     node.code -= 100;
    //                 }
    //             })
    //         }
    //
    //         // 移动要更新位置
    //         palyerViewItemOne.handCardView.updateAllHandleCardPosition();
    //     }
    // },
    doReSortPai: function(palyerViewItemOne, isReconnct) {
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
                if (node.isQue && node.active) {
                    node.code += 100;
                    isFindQue = true
                }
            })

            if (isFindQue) {
                // 在排序
                handlePaiArray.sort(this.compareArrayTwo);

                // 发现缺的，就-100
                handlePaiArray.forEach((node)=>{
                    if (node.isQue && node.active) {
                        node.code -= 100;
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
        this.startTimer(getRelDeskId)
    },
    doReciveHu: function (palyerViewItem, v) {
        // 播放动画
        // this.doPlayHuTiGangAnim(palyerViewItem, 4);
        // palyerViewItem.doPlayHuTiGangAnim(4);



        if (palyerViewItem.index == 0) {

            this.doHiddenHutiGang();

            let handlePaiArray = palyerViewItem.handCardView.hcGroups;
            handlePaiArray.forEach((node)=>{
                cc.find("Sprite_Alert", node).active = false;
            })
        }

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
            // pongItem.type = 'peng'
            for (let i = 0; i < pongPaiCards.length; i++) {
                let pongItem = pongPaiCards[i]
                if (pongItem.code == parseInt(v[1])) { // 找到杠牌了
                    pongPaiCards.splice(i, 1);
                    break;
                }
            }

            for (let i = 0; i < pongPaiArray.length; i++) {
                let pongItem = pongPaiArray[i]
                if (pongItem.code == parseInt(v[1])) { // 找到杠牌了
                    pongPaiArray.splice(i, 1);
                    break;
                }
            }

            // 碰牌
            let peng = {}
            peng.type = 'peng'
            peng.gtype = 'nouse'
            peng.code = parseInt(v[1])
            pongPaiCards.push(peng)
            palyerViewItemUid.pongCardView.doRemoveOnePongPai(peng);
            palyerViewItemUid.pongCardView.doAddOnePongPai(peng);
            palyerViewItemUid.pongCardView.updateAllPongCardPosition();
            // 改变手牌的位置
            palyerViewItemUid.handCardView.updateAllHandleCardPosition();
        }


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
            newHanldeArr.forEach((code)=>{
                if (code == 50) {
                    hzArr.push(code)
                    // 删除红中
                    newHanldeArr.splice(hzIndex, 1)
                }
                hzIndex++;
            })

            // // 删除红中后的数组
            // cc.dlog('红中后的数组-->' + JSON.stringify(hzArr))

            // // 删除红中后的数组
            // cc.dlog('删除红中后的数组-->' + JSON.stringify(newHanldeArr))

            // 去掉重复的数据
            if (!cc.g.utils.judgeArrayEmpty(newHanldeArr)) {
                let newDelReArr = []
                for(let i=0; i < newHanldeArr.length; i++){
                    if(newDelReArr.indexOf(newHanldeArr[i]) == -1){
                        newDelReArr.push(newHanldeArr[i]);
                    }
                }
                // 删除红中后的数组
                // cc.dlog('去重复后的数组-->' + JSON.stringify(newDelReArr))

                // 合并后的数组
                // if (cc.g.utils.judgeArrayEmpty(hzArr)) {
                //     passArr = newDelReArr
                // } else {
                //     passArr = newDelReArr.concat(hzArr);
                // }
                
                // 红中不可以打
                passArr = newDelReArr
            }
        }

        // cc.dlog('给胡牌提示处理的手牌数组-->' + JSON.stringify(passArr))

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
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                } else if (node.gtype == 2 || node.type == 'mkang') { // 明杠
                    pongNode.push(0)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                } else if (node.gtype == 3 || node.type == 'mkang') { // 暗杠
                    pongNode.push(0)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                } else if (node.type == 'fei') {
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(50)
                } else if (node.type == 'peng') {
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                    pongNode.push(node.code)
                }
                rePassPongArr.push(pongNode)
            })
        }

        // cc.dlog('传递的碰组装数据'+ JSON.stringify(rePassPongArr));

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

        // cc.dlog('删除index后数组'+JSON.stringify(cloneArr))

        return cloneArr;
    },
    compareArrayMore:function (val1, val2) {
        return val1.huCount-val2.huCount;
    },
    compareArrayBig:function (val1, val2) {
        return val1.fanCount-val2.fanCount;
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

        // cc.dlog('handleActiveArr1111-->' + JSON.stringify(handleActiveArr))

        // copy array
        let newHanldeArr = cc.g.clone(handleActiveArr)

        // 首先进行数组排序
        newHanldeArr.sort(this.compareArrayTwo);

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
                        // cc.dlog('可能的合集-->' + JSON.stringify(huMap))
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
                    // cc.dlog('可能的合集-->' + JSON.stringify(huMap))
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
        // cc.dlog('总结果-->' + JSON.stringify(resultArr))

        // 2、找到胡牌可能后，显示UI操作 结果不为空, 总结果不为空, 则继续执行
        if (!cc.g.utils.judgeArrayEmpty(resultArr)) {
            // 桌面上的摆牌
            let baiPaiArr = []
            let hzCount = 0;
            // 自己的手牌, 找到红中个数，和找到非红中数组
            handleActiveArr.forEach((code)=>{
                if (code == 50) {
                    hzCount++
                } else {
                    baiPaiArr.push(code)
                }
            })

            // 胡牌数组
            let huCodeArr = this.huCodeArr
            if (!cc.g.utils.judgeArrayEmpty(huCodeArr)) {
                huCodeArr.forEach((code)=>{
                    if (code == 50) {
                        hzCount++
                    } else {
                        baiPaiArr.push(code)
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
                            // if (qi.code == 50) {
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
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'mkang') { // 明杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'akang') { // 暗杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'fei') { // 飞
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                hzCount++
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
                    })

                    // 如果是红中，则再加上剩下的红中个数
                    if (huCode == 50) {
                        huDefaultCount = allHongZhong
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
            let resultArrBig = cc.g.clone(resultArr)
            let maxFanCount = resultArrBig[0].fanCount;
            for (let i = 0; i < resultArrBig.length - 1; i++) {
                maxFanCount = maxFanCount < resultArrBig[i+1].fanCount ? resultArrBig[i+1].fanCount : maxFanCount
            }

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
                    if (node.active && (huAler.outCode == node.code) && (node.code != 50)) {
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

        // cc.dlog('doCheckHuPaiByCode handleActiveArr===>', JSON.stringify(handleActiveArr))
        // 1、找胡牌可能
        // if (!cc.g.utils.judgeArrayEmpty(handArr)) {
        //
        // }

        // copy array
        let newHanldeArr = cc.g.clone(handleActiveArr)

        // 首先进行数组排序
        newHanldeArr.sort(this.compareArrayTwo);
        // 断线重连走这里
        // 从手牌中任意打一张牌,得到得数组
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
        // cc.dlog('可能的合集-->' + JSON.stringify(huMap))
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

        // 2、找到胡牌可能后，显示UI操作 结果不为空, 总结果不为空, 则继续执行
        if (!cc.g.utils.judgeArrayEmpty(resultArr)) {
            // 桌面上的摆牌
            let baiPaiArr = []
            let hzCount = 0;
            // 自己的手牌, 找到红中个数，和找到非红中数组
            handleActiveArr.forEach((code)=>{
                if (code == 50) {
                    hzCount++
                } else {
                    baiPaiArr.push(code)
                }
            })

            // 胡牌数组
            let huCodeArr = this.huCodeArr
            if (!cc.g.utils.judgeArrayEmpty(huCodeArr)) {
                huCodeArr.forEach((code)=>{
                    if (code == 50) {
                        hzCount++
                    } else {
                        baiPaiArr.push(code)
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
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'mkang') { // 明杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'akang') { // 暗杠
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                            } else if (pong.type == 'fei') { // 飞
                                baiPaiArr.push(pong.code)
                                baiPaiArr.push(pong.code)
                                hzCount++
                            }
                        })
                    }
                }
            }

            // cc.dlog('红中个数-->' + hzCount)
            // cc.dlog('所有的摆牌-->' + JSON.stringify(baiPaiArr))
            // cc.dlog('总红中个数-->' + this.getHongZhongCount())

            // 红中总个数
            let allHongZhong = this.getHongZhongCount() - hzCount;

            if (allHongZhong < 0) {
                allHongZhong = 0
            }

            // cc.dlog('剩下红中个数-->' + allHongZhong)

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
                    if (huCode == 50) {
                        huDefaultCount = allHongZhong
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

            // cc.dlog('可以胡牌张数->'+JSON.stringify(resultArr))

            // // 胡的最多排序
            // resultArr.sort(this.compareArrayMore);
            // // 胡最多
            // let huMoreObj = resultArr[0]
            // if (huMoreObj.id != 0) {
            //     huMoreObj.noraml = 2;
            // }
            //
            // // 番数排序
            // resultArr.sort(this.compareArrayBig);
            // // 胡最多
            // let huBigObj = resultArr[0]
            // if (huBigObj.id != 0) {
            //     huBigObj.noraml = 3;
            // }
            //
            // // cc.dlog('找到最大、最多张数->'+JSON.stringify(resultArr))
            //
            // // 先重置
            // // handlePaiArray.forEach((node)=>{
            // //     cc.find("Sprite_Alert", node).active = false;
            // // })
            //
            // // 遍历手牌，显示提示
            // resultArr.forEach((huAler)=>{
            //     handlePaiArray.forEach((node)=>{
            //         if (node.active && (huAler.outCode == node.code) && (node.code != 50)) {
            //             cc.find("Sprite_Alert", node).active = true;
            //             if (huAler.noraml == 1) {
            //                 cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_hupai_tips');
            //             } else if (huAler.noraml == 2) {
            //                 cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_duo');
            //             } else if (huAler.noraml == 3) {
            //                 cc.find("Sprite_Alert", node).getComponent(cc.Sprite).spriteFrame = this.majhCardAtlas0.getSpriteFrame('mj_da')
            //             }
            //         }
            //     })
            // })

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
            //
            // handlePaiArray.forEach((node)=>{
            //     cc.find("Sprite_Alert", node).active = false;
            // })
            //
            // cc.g.hallMgr.inGameMenu.Button_tip.active = false;
            //
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
            let hma = this.huPaiCurrentItem.huMapArr;
            const self = this;

            // 去红中
            let huMapArr = [];
            hma.forEach((item) => {
                if (item.code != 50) {
                    huMapArr.push(item);
                }
            });
            
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
                    this.Sprite_Hu_bg.width = 720//750
                    this.Sprite_Hu_bg.height = 270//280
                    this.Sprite_hu_Gbox.width = 540//540
                    this.Sprite_Hu_bg.y = 4.8
                    this.Sprite_hu_Gbox.y = 4
                } else {
                    let baseWidth = 140
                    let mjWidth = 78 * paiLength
                    let mjSpawidth = 20 * (paiLength) //+ 6
                    this.Sprite_Hu_bg.width = baseWidth + mjWidth + mjSpawidth
                    this.Sprite_Hu_bg.height = 180//200
                    this.Sprite_hu_Gbox.width = mjWidth + mjSpawidth - 20
                    //4.8
                    this.Sprite_Hu_bg.y = -40
                    this.Sprite_hu_Gbox.y = -40
                }
            } else {
                this.scheduleOnce(()=>{
                    this.sv_huifo.scrollToTop(0, false);
                }, 0.1)
                this.sv_huifo.node.active = true;
                this.Sprite_Hu_bg.y = 4.8
                this.Sprite_hu_Gbox.y = 7
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

    doRealReciveAutoHu: function(palyerViewItem, code, showAnima) {
        if (code == 1) {
            this.Sprite_Light.active = true
            this.isAutoHu = true
        } else {
            this.Sprite_Light.active = false
            this.isAutoHu = false
        }
        this.doShowAllHiddenZeZhaoView();
    },

    /* =================================================================================================================== */
    
    // 调试按钮
    onDbgBtn: function (event, customEventData) {
        // cc.dlog(this.dbgstr('调试按钮'));
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
        //             this.pGame.uidPlayers[p.d.uid] = p;
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
