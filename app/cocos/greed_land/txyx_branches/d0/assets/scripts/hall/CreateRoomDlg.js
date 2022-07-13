let crTeshuguize = require('crTeshugz');

const DefTag = 'crtrm_imgtxt_diqu';

const maxdf = 20;
const mindf = 0.1;

// 游戏分组
//'mahjong':[GMID.HZMJ,GMID.XZMJ,GMID.YBMJ,GMID.NYMJ,GMID.LZMJ,GMID.NJMJ],
//'poker':[GMID.PDK, GMID.PDKNJ, GMID.DDZ5],
//'zipai':[GMID.D2]
const DefgmGrp = 'mahjong';
let lc_gmGrp = {};

const TAG = {
    // area: "crtrm_imgtxt_diqu",
    // costMode: "crtrm_imgtxt_fangfei",
    // playerNum: "crtrm_imgtxt_renshu",
    // turnNum: "crtrm_imgtxt_jushu",
    // tingYong: "crtrm_hzmj_ty",
    // diFen: "crtrm_imgtxt_difen",
    area: "地区",
    costMode: "房费",
    playerNum: "人数",
    turnNum: "局数",
    tingYong: "听用",
    diFen: "低分",
};

const GMTAG = {
    9:{
        1:'加底',//'crtrm_imgtxt_jiadi',//加底
        2:'封顶',//'crtrm_imgtxt_fengding',//封顶
        3:'自摸',//'crtrm_imgtxt_zimo',//自摸
        4:'放炮',//'crtrm_imgtxt_fangpao',//放炮
        5:'颗数',//'crtrm_imgtxt_keshu',//颗数
        8:'定庄',//'crtrm_imgtxt_dingzhuang',//定庄
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check: '名堂',//'crtrm_imgtxt_mingtang',
    },
    10:{
        1:'定飘',//'crtrm_hzmj_dp',//定飘
        2:'封顶',//'crtrm_imgtxt_fengding',//封顶
        3:'胡牌',//'crtrm_hzmj_hp',//胡牌
        4:'红中',//'crtrm_hzmj_hz',//红中
        5:'规则',//'crtrm_hzmj_gz',//规则
        8:'底分',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    11:{
        1:'底分',//'crtrm_imgtxt_difen',//
        2:'鬼牌',//'crtrm_imgtxt_guipai',//
        3:'炸弹算分',//'crtrm_imgtxt_zdsf',//
        4:'加入',//'crtrm_imgtxt_jiaru',//
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    4:{
        1:'封顶',//'crtrm_imgtxt_fengding',//
        2:'胡牌',//'crtrm_hzmj_hp',//
        3:'规则',//'crtrm_hzmj_gz',//
        4:'点杠',//'crtrm_imgtxt_dgang',//
        5:'自摸',//'crtrm_imgtxt_zimo',//
        8:'底分',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    12:{
        1:'定飘',//'crtrm_hzmj_dp',//
        2:'封顶',//'crtrm_imgtxt_fengding',//
        3:'胡牌',//'crtrm_hzmj_hp',//
        4:'听用',//'crtrm_hzmj_ty',//
        7:'起胡',//'crtrm_imgtxt_difen',
        8:'底分',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    13:{
        1:'炸弹',//'crtrm_imgtxt_zhadan',//
        2:'王炸',//'crtrm_imgtxt_wangzha',//
        3:'梗',//crtrm_imgtxt_geng',//
        4:'流局',//'crtrm_imgtxt_liuju',//
        5:'洗牌',//'crtrm_imgtxt_xipai',
        6:'暗地主',//'crtrm_imgtxt_adz',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    14:{
        1: '红10',
        2: '牌数',
        3: '玩法',
        4: '打鸟',
        5: '飘分',
        11: '超时托管',
        12: '托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    15:{
        1:'奖马',//'crtrm_nymj_jm',//
        2:'底分',//'crtrm_imgtxt_difen',//
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    16:{
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu',
    },
    17:{
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu',
    },
    19:{
        1:'定飘',//'crtrm_hzmj_dp',//定飘
        2:'封顶',//'crtrm_imgtxt_fengding',//封顶
        3:'胡牌',//'crtrm_hzmj_hp',//胡牌
        4:'红中',//'crtrm_hzmj_hz',//红中
        5:'规则',//'crtrm_hzmj_gz',//规则
        8:'底分',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    18:{
        1:'自摸',//'crtrm_imgtxt_zimo',//自摸
        2:'封顶',//'crtrm_imgtxt_fengding',//封顶        
        3:'定飘',//'crtrm_hzmj_dp',//定飘
        8:'底分',//'crtrm_imgtxt_difen',//底分
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    20:{
        1:'定飘',//'crtrm_hzmj_dp',//定飘
        2:'房数',//'crtrm_imgtxt_fengding',//封顶
        3:'封顶',//'crtrm_imgtxt_fengding',//封顶
        4:'起胡',//'crtrm_hzmj_hp',//胡牌
        5:'点杠',//'crtrm_hzmj_hz',//红中
        8:'换张',//'crtrm_imgtxt_difen',
        9:'地胡',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        13:'幺鸡',
        18:'张数',//'crtrm_imgtxt_difen',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    21:{
        1:'圈数',
        2:'封顶',
        3:'小家',
        4:'牌数',
        5:'抬炮封顶',
        6:'特殊',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    22:{
        1:'先出',
        2:'炸弹',
        3:'炸弹分数',
        4:'炸弹分数',
        5:'飞机',
        8:'牌型',
        9:'玩法',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        13:'名堂分',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    23:{
        1:'规则',
        2:'3A带2',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    24:{
        1:'游戏规则',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    25:{
        1:'定飘',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
    26:{ //1.封顶2. 点杠花 .3.牌数 4.换三张 5.清一色
        1:'封顶',//'crtrm_imgtxt_fengding',//
        2:'点杠花',//'crtrm_hzmj_hp',//
        3:'牌数',//'crtrm_hzmj_gz',//
        4:'换三张',//'crtrm_imgtxt_dgang',//
        5:'清一色',//'crtrm_imgtxt_zimo',//
        8:'自摸',//'crtrm_imgtxt_difen',
        // 1:'封顶',//'crtrm_imgtxt_fengding',//
        // 2:'胡牌',//'crtrm_hzmj_hp',//
        // 3:'规则',//'crtrm_hzmj_gz',//
        // 4:'点杠',//'crtrm_imgtxt_dgang',//
        // 5:'自摸',//'crtrm_imgtxt_zimo',//
        // 8:'底分',//'crtrm_imgtxt_difen',

        // 8:'底分',//'crtrm_imgtxt_difen',
        10:'距离',
        11:'超时托管',
        12:'托管局数',
        20:'托管次数',
        check:'特殊',//'crtrm_imgtxt_teshu'
    },
};

cc.Class({
    extends: cc.Component,

    properties: {
        // 创建房间相关的图集
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        
        // 游戏列表预制
        gameListItem: {
            default: null,
            type: cc.Prefab,
        },

        // 游戏列表预制
        RadioGBItem: {
            default: null,
            type: cc.Prefab,
        },

        // 游戏列表预制
        RadioGBox: {
            default: null,
            type: cc.Prefab,
        },

        // 下拉菜单项
        pullDownItem: {
            default: null,
            type: cc.Prefab,
        },

        // 下拉菜单列表项
        pdMenuListItem: {
            default: null,
            type: cc.Prefab,
        },

        // 复选项
        checkItem: {
            default: null,
            type: cc.Prefab,
        },

        // 金币抽水
        dlgJbcs: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '创建房间';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.log('CreateRoomDlg' + ' ' + 'onLoad');

        this.gmtag = GMTAG;
        this.teshuGuize = new crTeshuguize();
        this.teshuGuize.init(this);

        lc_gmGrp = GMGrp;

        this.clubInfo = null;//俱乐部信息
        this.curGameId = 0;//当前选择的游戏ID
        this.curArea = -1;
        this.curGrp = '';//当前选择的游戏分组

        this.NormalHis = {};// 普通创建的历史记录

        this.initView();

        //this.test0();
    },

    start () {

    },

    // update (dt) {},


    // ===============================================================================================

    test0 () {
        let r = this.node.getChildByName('Sprite_dlgRoot');
    },

    //全屏点击穿透
    onClickSwallow: function (arg) {
        cc.log("onClickSwallow", arg);

        if (this.node_PDItemDesc) {
            this.node_PDItemDesc.active = false;
        }
    },


    /* =================================================================================================================== */
    // 普通情况的更新
    upWithNormal:function (type) {
        type = type || (this.curGrp.length>0 ? this.curGrp : DefgmGrp);
        
        cc.log(this.dbgstr('普通情况的更新 ' + type));

        for (const t in this.ggToggle) {
            this.ggToggle[t].node.active = true;
        }

        this.Sprite_crttxt.spriteFrame = this.atlas.getSpriteFrame('crtrm_txt_cj');

        this.curPDTag = null;
        this.isBySR = false;

        // 上次是俱乐部进入
        if (this.clubInfo || this.bjifo) {
            this.curGrp = '';
        }

        if (type == this.curGrp) {

            if (this.op_ifo) {
                for (const key in this.gmListItems) {
                    let e = this.gmListItems[key];
                    let name = e.name.split('_');
                    
                    if (name[0]==this.op_ifo.id && name[1]==this.op_ifo.ori) {
                        this.curGMItem = e;
                        this.curGMItem.toggle.check();
                        break;
                    }
                }
            }

            return;
        }

        this.clubInfo = null;
        this.bjifo = null;
        this.curGrp = type;
        this.curGameId = 0;
        this.initGameList();

        if (!this.curGMItem) {
            cc.error('创建房间 找不到对应游戏');
            return;
        }

        this.curGMItem.toggle.check();
    },
    // 俱乐部包间创建
    upWithClubBjCreate:function (club, type) {
        cc.log('upWithClubBjCreate', club);

        if (!club){
            return;
        }

        this.Sprite_crttxt.spriteFrame = this.atlas.getSpriteFrame('crtrm_txt_cj');

        this.curPDTag = null;
        this.isBySR = false;

        if (this.clubInfo && this.clubInfo.clubId == club.clubId && this.curGrp == type) {
            return;
        } 

        cc.log(this.dbgstr('俱乐部的更新 ' + club.clubId));

        this.clubInfo = club;
        this.bjifo = null;
        this.curGrp = type;
        this.curGameId = 0;

        this.initGameList();

        if (this.curGMItem) {
            this.curGMItem.toggle.check();
        }
    },
    // 俱乐部包间设置
    upWithClubBjSetting:function (bjifo) {
        bjifo.maxWinSco = bjifo.winnerScore;

        //let gmr = bjifo.goldMatchRule;

        this.bjifo = bjifo;
        this.clubInfo = null;
        this.isBySR = false;
        
        this.Sprite_crttxt.spriteFrame = this.atlas.getSpriteFrame('crtrm_txt_bc');

        this.curGrp = '';
        this.curGameId = 0;

        cc.log(this.dbgstr('俱乐部包间设置 ' + this.bjifo));

        this.initGameList();
        
        if (this.curGMItem) {
            this.curGMItem.toggle.check();
        }
    },
    // 俱乐部包间查看玩法
    upWithClubBjRule:function (bjifo) {
        this.bjifo = bjifo;
        this.clubInfo = null;
        this.isBySR = true;

        this.curGrp = '';
        this.curGameId = 0;

        this.initGameList();

        if (this.curGMItem) {
            this.curGMItem.toggle.check();
        }
    },
    /* =================================================================================================================== */



    /* =================================================================================================================== */

    // 更新对话框界面
    initView: function (info) {
        cc.log('CreateRoomDlg' + ' ' + 'initView');

        let r = this.node.getChildByName('Sprite_dlgRoot');

        // 全屏点击穿透
        cc.find("ClickSwallow", r).getComponent('ClickSwallow').beganCall = function(){
            this.onClickSwallow(1);
        }.bind(this);
        cc.find("ScrollView_option/view/ClickSwallow", r).getComponent('ClickSwallow').beganCall = function(){
            this.onClickSwallow(2);
        }.bind(this);
        
        // 游戏分组 麻将 扑克 字牌
        this.ggToggle = {};
        for (const k in lc_gmGrp) {
            this.ggToggle[k] = cc.find("Node_gameGrps/Toggle_" + k, r).getComponent(cc.Toggle);
            cc.g.utils.addCheckEvent(this.ggToggle[k].node, this.node, 'CreateRoomDlg', 'onCheckGMGrp', k);
        }

        //  箭头
        this.arrowImg = r.getChildByName('Sprite_Arrow');

        // 游戏列表滚动视图
        this.svGameList = r.getChildByName('ScrollView_gameList').getComponent(cc.ScrollView);

        // ---------------------------------------------------------------------------------------------------
        // 创建选项滚动视图
        this.svOption = r.getChildByName('ScrollView_option').getComponent(cc.ScrollView);

        // 包间名字
        this.Node_bjName = cc.find("Node_bjName", this.svOption.content);
        this.EditBox_bjName = cc.find("EditBox", this.Node_bjName).getComponent(cc.EditBox);
        this.Button_del = cc.find("Button_del", this.Node_bjName);
        this.Node_bjName.active = false;

        // 大赢家分数
        this.Node_maxWinSco = cc.find("Node_maxWinSco", this.svOption.content);
        this.EditBox_mws = cc.find("EditBox", this.Node_maxWinSco).getComponent(cc.EditBox);
        this.EditBox_mws.string = 0;

        // 底分
        this.Node_baseSco = cc.find("Node_baseSco", this.svOption.content);
        this.LABEL_baseSco = cc.find("TEXT_LABEL", this.Node_baseSco).getComponent(cc.Label);
        this.LABEL_baseSco.string = 0;
        this.Node_baseSco.active = true;

        // 金币场 Node_dqjb当前金币  Node_syjb剩余金币
        this.Node_jbc = cc.find("Node_jbc", this.svOption.content);
        this.EditBox_jbc1 = cc.find("Node_dqjb/EditBox", this.Node_jbc).getComponent(cc.EditBox);
        this.EditBox_jbc2 = cc.find("Node_syjb/EditBox", this.Node_jbc).getComponent(cc.EditBox);
        this.toggle_zdjs = cc.find("Node_syjb/Node_togctn/toggle_zdjs", this.Node_jbc).getComponent(cc.Toggle);
        this.toggle_jxyx = cc.find("Node_syjb/Node_togctn/toggle_jxyx", this.Node_jbc).getComponent(cc.Toggle);
        // this.Node_jbc.active = false;

        // 单选组列表
        this.VB_radio = cc.find("VB_radio", this.svOption.content).getComponent(cc.Layout);
        // 复选区域
        this.LayoutCheck = cc.find("Layout_p2/Layout_Check", this.svOption.content).getComponent(cc.Layout);
        // 复选区域标签
        this.LayoutCheck.Label_tag = cc.find("Layout_p2/Node_checkDes/Label_tag", this.svOption.content).getComponent(cc.Label);


        // add by panbin start 宁远麻将特殊选项
        this.Node_Ny_TeSu = cc.find("Node_Ny_TeSu", this.svOption.content);
        this.Node_Ny_TeSu.active = false
        this.ts_toggle_one = cc.find("Node_One/crtrmRGItem1/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);
        this.ts_toggle_two = cc.find("Node_One/crtrmRGItem2/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);
        cc.g.utils.addCheckEvent(this.ts_toggle_one, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 1);
        cc.g.utils.addCheckEvent(this.ts_toggle_two, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 2);

        // 添加按钮
        this.Node_Plush_Num = cc.find("Node_One/Node_Plush_Num", this.Node_Ny_TeSu)
        this.Node_Plush_Num.active = false;
        this.Node_Plush_Num_Edit = cc.find("Sprite_ebbg/Label_Box", this.Node_Plush_Num).getComponent(cc.Label);

        // 第二个
        this.Node_Two = cc.find("Node_Two", this.Node_Ny_TeSu)
        this.Node_Two.active = false
        this.ts_two_toggle_one = cc.find("Node_Two/crtrmRGItem1/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);
        this.ts_two_toggle_two = cc.find("Node_Two/crtrmRGItem2/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);
        this.ts_two_toggle_three = cc.find("Node_Two/crtrmRGItem3/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);

        cc.g.utils.addCheckEvent(this.ts_two_toggle_one, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 3);
        cc.g.utils.addCheckEvent(this.ts_two_toggle_two, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 4);
        cc.g.utils.addCheckEvent(this.ts_two_toggle_three, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 5);

        // 第三个
        this.ts_three_toggle_one = cc.find("Node_Three/crtrmRGItem/toggle", this.Node_Ny_TeSu).getComponent(cc.Toggle);
        cc.g.utils.addCheckEvent(this.ts_three_toggle_one, this.node, 'CreateRoomDlg', 'onCheckNyRadioItem', 6);

        this.Node_Plush_Num1 = cc.find("Node_Three/Node_Plush_Num1", this.Node_Ny_TeSu)
        this.Node_three_Plush_Num_Jia1 = cc.find("Button_jia", this.Node_Plush_Num1).getComponent(cc.Button);
        this.Node_three_Plush_Num_Jian1 = cc.find("Button_jian", this.Node_Plush_Num1).getComponent(cc.Button);
        this.Node_three_Plush_Num_Jia1.interactable = false;
        this.Node_three_Plush_Num_Jian1.interactable = false;
        this.Node_three_Plush_Num_Edit1 = cc.find("Sprite_ebbg/Label_Box", this.Node_Plush_Num1).getComponent(cc.Label);

        this.Node_Plush_Num2 = cc.find("Node_Three/Node_Plush_Num2", this.Node_Ny_TeSu)
        this.Node_three_Plush_Num_Jia2 = cc.find("Button_jia", this.Node_Plush_Num2).getComponent(cc.Button);
        this.Node_three_Plush_Num_Jian2 = cc.find("Button_jian", this.Node_Plush_Num2).getComponent(cc.Button);
        this.Node_three_Plush_Num_Jia2.interactable = false;
        this.Node_three_Plush_Num_Jian2.interactable = false;
        this.Node_three_Plush_Num_Edit2 = cc.find("Sprite_ebbg/Label_Box", this.Node_Plush_Num2).getComponent(cc.Label);

        // ---------------------------------------------------------------------------------------------------


        // add by panbin end

        // 下拉菜单项的提示说明
        this.node_PDItemDesc = cc.find("Node_pdMenuBP/node_PDItemDesc", this.node);
        this.node_PDItemDesc.active = false;
        this.node_PDItemDesc.Label_pdifo = cc.find("Label_pdifo", this.node_PDItemDesc).getComponent(cc.Label);

        // 创建按钮
        this.Button_crt = cc.find("Button_create", r);
        this.Sprite_crttxt = cc.find("Button_create/Sprite_crttxt", r).getComponent(cc.Sprite);

        // 房卡消耗
        this.Sprite_fk = cc.find("Button_create", r).getComponent(cc.Sprite);
        this.LabelFkNum = cc.find("Button_create/Label_fkNum", r).getComponent(cc.Label);

        // 监听滑动
        this.svOption.node.on('scrolling', this.onScrollingEvent, this);
        this.svOption.node.on('scroll-began', this.onScrollBeganEvent, this);
        // this.svOption.node.on('scroll-to-top', this.onScrollTopEvent, this);
        // this.svOption.node.on('scroll-to-bottom', this.onScrollBottomEvent, this);

        this.originPoY = this.arrowImg.y;
        this.showArrowAnimation();
    },
    showArrowAnimation: function() {
        if (this.arrowImg) {
            let positionX = this.arrowImg.x;
            let positionY = this.originPoY;
            this.arrowImg.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveTo(0.8, positionX, positionY + 20),
                    cc.moveTo(0.8, positionX, positionY),
                )))
        }
    },
    /**
     * 滑动开始监听
     * @param {any} event
     */
    onScrollBeganEvent(event){
        let self = this;
        self.lastoffsetY = self.svOption.getComponent(cc.ScrollView).getScrollOffset().y;
    },

    /**
     * 滑动中监听
     * @param {any} event
     */
    onScrollingEvent(event){
        let self = this;
        let offsetY = self.svOption.getComponent(cc.ScrollView).getScrollOffset().y;

        if (parseInt(offsetY) <= 0) {
            if (!this.arrowImg.active) {
                this.arrowImg.active = true
                this.showArrowAnimation()
            }
        } else if (parseInt(offsetY) > 0) {
            if (this.arrowImg.active) {
                this.arrowImg.stopAllActions()
                this.arrowImg.active = false
            }
        }
    },
    doReStartAnimaiton() {
        if (this.arrowImg.active) {
            this.arrowImg.stopAllActions()
            this.arrowImg.active = false
        }

        this.arrowImg.active = true
        this.showArrowAnimation()
    },
    //初始化游戏列表
    initGameList: function () {
        cc.log('CreateRoomDlg' + ' ' + 'initGameList');

        // 开放游戏
        let open = {};
        GameConfig.gamesSeq.forEach(e => open[e] = true);

        // 要显示的游戏列表
        let gmlist = [];

        // 初始普通创建的游戏列表
        if (!this.norGmList) {
            this.norGmList = {};
            for (const t in lc_gmGrp) {
                let list = [];
                const idseq = lc_gmGrp[t];
                idseq.forEach(id => {
                    if (!open[id]) return;

                    cc.g.hallMgr.upCreateInfo(id);
                    let crtInfo = cc.g.hallMgr.crtRoomInfo[id];
                    if (!crtInfo) {
                        cc.log('initGameList'+' 没有游戏配置 '+t+' '+id);
                        return;
                    }

                    // 该游戏的所有地区
                    for (const a in crtInfo.comArea.v) {
                        // 普通创建 血战只有成都地区 
                        let add = true;
                        if (id==GMID.XZMJ) {
                            add = (a==6);
                        } else if (id==GMID.XZMJER) {
                            add = (a==6);
                        } else if (id==GMID.YBMJ) {
                            add = (a==5);
                        }

                        if (add) {
                            list.push({ID:id, origin:a});
                        }
                    }
                });

                (list.length>0) && (this.norGmList[t] = list);
            }
        }

        // 初始俱乐部创建的游戏列表 通过地区记录
        if (this.clubInfo) {
            if (!this.clubGmList) {
                this.clubGmList = {};
            }

            let origin = this.clubInfo.origin;
            if (!this.clubGmList[origin]) {
                //该地区的所有游戏
                let coid = {};
                let list = cc.g.areaInfo[origin].game;
                list.forEach(e => coid[e] = true);

                // 确定分组
                let cogrps = {};
                for (const t in lc_gmGrp) {
                    cogrps[t] = [];

                    const idseq = lc_gmGrp[t];
                    idseq.forEach(id => {
                        if (!open[id] || !coid[id]) return; // 不在开放游戏或俱乐部地区游戏里
                        cogrps[t].push({ID:id, origin:origin});
                    });
                }

                this.clubGmList[origin] = cogrps;
            }
        }

        
        if (this.clubInfo) {
            let cogrps = this.clubGmList[this.clubInfo.origin];

            if (!this.curGrp || this.curGrp=='') {
                let _1st = null;
                for (const k in cogrps) {
                    if (cogrps[k].length>0) {
                        this.ggToggle[k].node.active = true;
                        (!_1st) && (_1st = k);
                    } else {
                        this.ggToggle[k].node.active = false;
                    }
                }

                if (_1st && !this.ggToggle[_1st].isChecked) {
                    this.ggToggle[_1st].check();
                    return;
                } else {
                    this.curGrp = _1st;
                }
            } else {
                if (!this.ggToggle[this.curGrp].isChecked) {
                    this.ggToggle[this.curGrp].check();
                    return;
                }
            }
            
            gmlist = cogrps[this.curGrp];
            
            gmlist = this.norGmList[this.curGrp];//现在俱乐部游戏列表和大厅创建列表一样了 2020.12.02--09.54
        } else if (this.bjifo) {
            if (!this.curGrp || this.curGrp=='') {
                for (const t in lc_gmGrp) {
                    this.ggToggle[t].node.active = false;

                    lc_gmGrp[t].forEach(id => {
                        if (id == this.bjifo.gameType) {
                            this.ggToggle[t].node.active = true;
                            this.curGrp = t;
                        }
                    });
                }

                if (!this.ggToggle[this.curGrp].isChecked) {
                    this.ggToggle[this.curGrp].check();
                }
            }

            // 俱乐部包间设置和玩法 只锁定一个游戏
            gmlist = [{ID:this.bjifo.gameType, origin:this.bjifo.origin}];
        } else {
            gmlist = this.norGmList[this.curGrp];
        }

        
        // 更新游戏标签
        let _1st = null;
        this.curGMItem = null;
        this.gmListItems = {};
        let ctt = this.svGameList.content;
        ctt.removeAllChildren();
        for (let i = 0, L = gmlist.length; i < L; i++) {
            let item = cc.instantiate(this.gameListItem);
            item.uD = gmlist[i];
            item.name = ''+ item.uD.ID + '_' + item.uD.origin;
            item.toggle = item.getComponent(cc.Toggle);
            item.toggle.uncheck();
            
            let nm = cc.g.utils.getGameName(item.uD.ID, item.uD.origin);
            let n0 = cc.find("diban_sige01/New Label", item).getComponent(cc.Label);
            n0.string = nm;
            let n1 = cc.find("check_mark/New Label", item).getComponent(cc.Label);
            n1.string = nm;

            cc.g.utils.addCheckEvent(item, this.node, 'CreateRoomDlg', 'onClickGameItem', item);

            if (!_1st) {
                _1st = item;
            }

            if (!this.curGMItem) {
                if (this.op_ifo) {
                    if (item.uD.ID==this.op_ifo.id && item.uD.origin==this.op_ifo.ori) {
                        this.curGMItem=item;
                    }
                } else {
                    this.curGMItem=item;
                }
            }

            this.gmListItems[item.name] = item;
            ctt.addChild(item);
        }
        ctt.getComponent(cc.Layout).updateLayout();
        this.svGameList.scrollToTop();

        if (!this.curGMItem) {
            this.curGMItem = _1st;
        }
    },
    
    openwith: function (group) {
        let gn = null;// group name 
        this.op_ifo = null;

        if (group && group.id) {
            this.op_ifo = group;

            for (const key in GMGrp) {
                let ids = GMGrp[key];

                for (let i = 0; i < ids.length; ++i) {
                    if (group.id == ids[i]) {
                        gn = key;
                        break;
                    }
                }

                if (gn) break;
            }
        }

        gn = gn || group;
        
        if (gn && !this.ggToggle[gn].isChecked) {
            this.ggToggle[gn].check();
        } else {
            this.upWithNormal(gn);
        }
    },

    // 游戏分组标签点击事件
    onCheckGMGrp: function (event, group) {
        if (!event.isChecked) {
            return;
        }

        // 切换标签，隐藏
        this.Node_Ny_TeSu.active = false

        if (this.clubInfo) {
            this.upWithClubBjCreate(this.clubInfo, group);
        } else if (this.bjifo){

        } else {
            this.upWithNormal(group);
        }
    },

    // 游戏列表点击事件
    onClickGameItem: function (event, customEventData) {
        if (!this.gmListItems || Object.keys(this.gmListItems).length < 1) {
            return;
        }

        cc.g.utils.btnShake();

        let itm = customEventData;

        cc.log('CreateRoomDlg' + ' ' + 'onClickGameItem', itm.uD);

        if (!event.isChecked) {
            return;
        }

        if (itm.uD.ID==this.curGMItem.uD.ID && itm.uD.origin==this.curGMItem.uD.origin) {
            if (this.curGameId > 0) {
                return;
            }
        }

        this.curGMItem = itm;

        this.curArea = this.curGMItem.uD.origin;
        this.curGameId = this.curGMItem.uD.ID;

        // 放在更新房间之前
        if (this.curGameId==GMID.NYMJ) {
            // 清除特殊选项
            this.clearNyMjTeSu();
        }

        this.scheduleOnce(()=>{
            // 游戏切换后 处理相关数据更新
            //this.curPDTag = null;
            this.updateRoomInfo();
        }, 0.1);
        

        // 隐藏宁远麻将特殊选项
        if (this.curGameId==GMID.NYMJ) {
            if (cc.g.utils.judgeMapEmpty(this.exData)) {
                this.Node_Ny_TeSu.active = false
            } else {
                if (this.exData.playerNum==2) {
                    this.Node_Ny_TeSu.active = true
                } else {
                    this.Node_Ny_TeSu.active = false
                }
            }
        } else {
            this.Node_Ny_TeSu.active = false
        }

        // 开启动画
        this.doReStartAnimaiton();
    },


    //更新房间信息
    updateRoomInfo: function () {
        this.svOption.scrollToTop();

        let vb_radioGrp = this.VB_radio.node;    //单选区  
        let layCheck = this.LayoutCheck.node;    //复选区

        vb_radioGrp.removeAllChildren(true);
        layCheck.removeAllChildren(true);

        this.radioGrps = [];
        this.pdItems = [];
        this.checkItems = [];
        this.exData = {}; //扩展数据 处理一些额外或者特别的情况

        this.LayoutCheck.Label_tag.node.active = false; //复选标签

        // 读取当前选择游戏的配置数据
        let crtInfo = cc.g.hallMgr.crtRoomInfo[this.curGameId];
        if (!crtInfo) {
            return;
        }


        let clubInfo = this.clubInfo || this.bjifo;
        if (clubInfo) {
            let o={};
            o.v={};
            o.v[clubInfo.origin]=cc.g.areaInfo[clubInfo.origin].name;
            o.def = ''+clubInfo.origin;
            crtInfo.area = o;

            let cm={};
            let cmo={};
            cmo.v={};

            // "32,冠军房费","33,均摊房费","34,房主房费","35,俱乐部房费"
            cmo.v['32'] = '冠军房费';//'冠军房费';
            cmo.v['33'] = '均摊房费';//'冠军房费';
            cmo.v['35'] = '圈主房费';//'冠军房费';
            cmo.def = '35';
            if (this.bjifo) {
                let defRules = this.bjifo.rule
                if (!cc.g.utils.judgeArrayEmpty(defRules)) {
                    defRules.forEach((item)=>{
                        if (item == 32) {
                            cmo.def = '32';
                        } else if (item == 33) {
                            cmo.def = '33';
                        } else if (item == 35) {
                            cmo.def = '35';
                        }
                    })
                }
            }

            cm[clubInfo.origin] = cmo;
            cm['0'] = cmo;
            crtInfo.costMode = cm;
        } else {
            crtInfo.area = crtInfo.comArea;
            crtInfo.costMode = crtInfo.comCostMode;
        }

        
        // 添加一个单选组
        let radidx = 0;
        let upRadio = (d) => {
            let grp = cc.instantiate(this.RadioGBox);

            grp.uIdx = radidx++;
            grp.name = d.tag;
            grp.utag  = d.val.tag;
            grp.uV   = d.val.v;
            grp.uDef = d.val.def;
            grp.uDescIfo = d.val.desc;

            if (this.bjifo) {
                let vk = d.val.v;

                if (d.tag == TAG.playerNum) {
                    if (vk[this.bjifo.playNum]) {
                        grp.uK = this.bjifo.playNum;
                    }
                } else if (d.tag == TAG.turnNum) {
                    if (vk[this.bjifo.gameNum]) {
                        grp.uK = this.bjifo.gameNum;
                    }
                } else if (d.tag == TAG.diFen) {
                    // 宜宾麻将
                    if (this.bjifo.gameType == 12 || this.bjifo.gameType == 4 || this.bjifo.gameType == 10) {
                        if (this.bjifo.base === 2) {
                            grp.uK = 52
                        } else if (this.bjifo.base === 1) {
                            grp.uK = 51
                        }
                    } else  {
                        let rules = this.bjifo.rule;
                        for (let i = 0; i < rules.length; ++i) {
                            if (vk[rules[i]]) {
                                grp.uK = rules[i];
                                break;
                            }
                        }
                    }
                } else if (d.tag != TAG.area) {
                // } else if (d.tag != TAG.area && d.tag != TAG.costMode) {
                    let rules = this.bjifo.rule;
                    for (let i = 0; i < rules.length; ++i) {
                        if (vk[rules[i]]) {
                            grp.uK = rules[i];
                            break;
                        }
                    }
                }
            }

            if(!grp.uK) {
                grp.uK = d.val.k ? d.val.k : d.val.def;
            }
            
            // 标签
            let Label_tag = cc.find("Node_tag/Label_tag", grp).getComponent(cc.Label);
            Label_tag.string = grp.name+':';


            // 添加单选项
            let box = cc.find("box", grp);
            box.destroyAllChildren(true);
            grp.items = {};
            for (const k in d.val.v) {
                let item = cc.instantiate(this.RadioGBItem);
                item.uK = k;

                // 描述
                item.uDesc = cc.find("Label_desc", item).getComponent(cc.Label);
                item.uDesc.string = d.val.v[k];

                //cc.log('item.uDesc.string', item.uDesc.string);
                //cc.log('item.uDesc.string.leng', item.uDesc.string.length);
                if (item.uDesc.string.length>=18) {
                    item.width = 760;
                } else if (item.uDesc.string.length>=11) {
                    item.width = 760*0.5;
                } else if (item.uDesc.string.length>=7) {
                    item.width = 760*0.3;
                }

                // 描述的提示按钮 大部分需要隐藏
                item.btn_Ifo = cc.find("Label_desc/Button_desc", item);
                item.btn_Ifo.active = grp.uDescIfo && grp.uDescIfo[item.uK];
                if (item.btn_Ifo.active) {
                    cc.g.utils.addClickEvent(item.btn_Ifo, this.node, 'CreateRoomDlg', 'onClickPDIIfo', {grp:grp, item:item});
                }

                // 选中状态
                item.toggle = cc.find("toggle", item).getComponent(cc.Toggle);
                //item.toggle.node.width = item.uDesc.string.length*item.uDesc.fontSize + 50;
                if (grp.uK == k) {
                    item.toggle.check();
                } else {
                    item.toggle.uncheck();
                }

                item.toggle.interactable = !this.isBySR;
                cc.g.utils.addCheckEvent(item.toggle.node, this.node, 'CreateRoomDlg', 'onCheckRadioItem', item);


                item.grp = grp;
                grp.items[k] = item;
                
                box.addChild(item);
            }

            // D2 4人强制加低
            if (this.curGameId==GMID.D2) {
                if (d.tag == TAG.playerNum) {
                    this.exData.playerNum = grp.uK;
                } else if (d.tag == GMTAG[9][1]) {
                    this.exData.JiabeiItem = grp.items['1'];
                }
            }

            // 血战麻将 4人才有换三张选项
            if (this.curGameId==GMID.XZMJ) {
                if (d.tag == TAG.playerNum) {
                    this.exData.playerNum = grp.uK;
                }
            }

            // 血战麻将 4人才有换三张选项
            if (this.curGameId==GMID.XZMJER) {
                if (d.tag == TAG.playerNum) {
                    this.exData.playerNum = grp.uK;
                }
            }

            // 宜宾麻将麻将
            if (this.curGameId==GMID.YBMJ) {
                if (d.tag == TAG.tingYong) {
                    let vk = cc.g.clone(grp.uV);
                    // 删除12
                    delete vk["12"];
                    grp.uV1 = grp.uV;
                    grp.uV2 = vk;
                    this.exData.JiabeiItem = grp;
                } else if (d.tag == TAG.playerNum) {
                    this.exData.playerNum = grp.uK;
                }
            }

            // 宁远麻将
            if (this.curGameId==GMID.NYMJ) {
                if (d.tag == TAG.playerNum) {
                    // let playerNum = grp.uK;
                    this.exData.playerNum = grp.uK;
                    // console.log('playerNum--', playerNum)
                }
            }

            // 内江麻将
            if (this.curGameId==GMID.NJMJ) {
                if (d.tag == TAG.playerNum) {
                    this.exData.playerNum = grp.uK;
                }
            }

            // 添加单选组到列表
            this.radioGrps.push(grp);
            vb_radioGrp.addChild(grp);

            return grp;
        };

        // 通用下拉项对应的数据
        let comdata = [
            //{val:crtInfo.area,      tag:TAG.area,},
            {val:crtInfo.costMode,  tag:TAG.costMode,},
            {val:crtInfo.playerNum, tag:TAG.playerNum,},
            {val:crtInfo.turnNum,   tag:TAG.turnNum,},
        ];

        // 添加通用下拉项
        for (let i = 0; i < comdata.length; i++) {
            const e = comdata[i];

            if (e.tag === TAG.area) {
                //有地区 并且当前游戏支持该地区
                if (this.curArea && e.val.v[this.curArea]) {
                    e.val.k = this.curArea;
                } else {
                    this.curArea = e.val.def;
                }
            } else {
                // 其他选项 要根据地区来获取
                e.val = e.val[this.curArea] ? e.val[this.curArea] : e.val["0"];
            }

            let grp = upRadio(e);

            if (this.curGameId==GMID.EQS && e.tag === TAG.turnNum) {
                grp.active = false;
            }
        }

        // 游戏单选项
        let rad = crtInfo.OptionRadio;
        let radio = rad[this.curArea] ? rad[this.curArea]:rad["0"];
        for (let i = 0; i < radio.length; i++) {
            const e = radio[i];
            upRadio({val:e, tag:GMTAG[this.curGameId][e.tag]});
        }

        // 游戏复选标签
        this.LayoutCheck.Label_tag.string = GMTAG[this.curGameId]['check']+':';
        // 游戏复选框
        let oc = crtInfo.OptionCheck;
        let checks = oc[this.curArea] ? oc[this.curArea]:oc["0"];
        this.LayoutCheck.Label_tag.node.active = checks && checks.length > 0;
        this.h3z_item = null;
        let loccheck = false;
        let locjlitms = [];
        for (let i = 0; i<checks.length; i++) {
            const e = checks[i];

            let item = cc.instantiate(this.checkItem);
            item.uK = e.k;
            item.name = e.v;
            item.getComponent(cc.Toggle).uncheck();
            cc.find("Label_desc", item).getComponent(cc.Label).string = e.v;

            if (this.bjifo) {
                let rules = this.bjifo.rule;
                for (let i = 0; i < rules.length; i++) {
                    if (rules[i] == item.uK){
                        item.getComponent(cc.Toggle).check();
                        break;
                    }
                }
            } else {
                if (e.check) {
                    item.getComponent(cc.Toggle).check();
                }
            }

            item.getComponent(cc.Toggle).interactable = !this.isBySR;
            cc.g.utils.addCheckEvent(item, this.node, 'CreateRoomDlg', 'onClickCheckItem', item);
            
            // 内江跑得快 有压必压 不能改变
            if (this.curGameId==GMID.PDKNJ && item.uK == '1') {
                item.getComponent(cc.Toggle).interactable = false;
            }

            layCheck.addChild(item);

            if (this.curGameId==GMID.XZMJ && e.k==GMID.XZMJ) {
                this.h3z_item = item;
            }

            if (this.curGameId==GMID.XZMJER && e.k==GMID.XZMJER) {
                this.h3z_item = item;
            }

            // 宜宾麻将麻将
            if (this.curGameId==GMID.YBMJ) {
                if (this.exData.playerNum == '14') {
                    if (item.uK == '15' || item.uK == '16') {
                        item.active = true
                    }
                } else {
                    if (item.uK == '15' || item.uK == '16') {
                        item.active = false
                    }
                }
            }

            // 内江麻将
            if (this.curGameId==GMID.NJMJ) {
                if (this.exData.playerNum == '3' || this.exData.playerNum == '4') {
                    if (item.uK == '10') {
                        item.active = true
                    }
                }
            }

            this.checkItems.push(item);

            // 定位要打开距离设置 60 61 62
            if (item.uK == 36) {
                loccheck = e.check;
            }

            if (item.uK=='60' || item.uK=='61' || item.uK=='62') {
                //item.active = loccheck;
                locjlitms.push(item);
            }
        }
        this.scheduleOnce(()=>locjlitms.forEach(e=>{
            if (this.bjifo) {
                e.active = e.getComponent(cc.Toggle).isChecked;
            } else {
                e.active = loccheck;
            }
        }), 0.1);
        

        // 更新选项关联内容
        this.upOptionChange(vb_radioGrp.getChildByName(TAG.turnNum));

        let layout = this.svOption.content.getComponent(cc.Layout);
        layout.updateLayout();

        if (this.clubInfo && this.clubInfo.openGold) {
            this.Node_jbc.active = true;
        } else if (this.bjifo && this.bjifo.openGold) {
            this.Node_jbc.active = true;
            
            let gmr = this.bjifo.goldMatchRule;
            this.EditBox_jbc1.string = cc.g.utils.realNum1(gmr.joinGold);
            this.EditBox_jbc2.string = cc.g.utils.realNum1(gmr.disbandGold);
            (gmr.exitType==1) ? this.toggle_zdjs.check() : this.toggle_jxyx.check();

        } else {
            this.Node_jbc.active = false;
        }
        
        this.Node_bjName.active = (this.clubInfo || this.bjifo);
        this.Button_del.active = (this.bjifo && !this.isBySR);
        this.Node_maxWinSco.active = (this.clubInfo || this.bjifo);
        this.EditBox_mws.string = this.bjifo ? cc.g.utils.realNum1(this.bjifo.maxWinSco): 0;
        this.LABEL_baseSco.string = this.bjifo ? cc.g.utils.realNum1(this.bjifo.base) : 1;
        if (this.bjifo) {
            this.EditBox_bjName.string = this.bjifo.name;
        }

        this.doExData();
        this.onClickCheckItem(0,0);

        if (!this.clubInfo) {
            for (let i = 0; i < this.radioGrps.length; ++i) {
                const e = this.radioGrps[i];

                if (e.name == TAG.tingYong) {
                    if (this.curGameId==GMID.YBMJ) {
                        if (!cc.g.utils.judgeObjectEmpty(e)) {
                            let uk = '0';
                            if (this.bjifo) {
                                let rules = this.bjifo.rule;
                                for (let i = 0; i < rules.length; i++) {
                                    let rule = rules[i]
                                    if (rule == 12) {
                                        uk = 12//'12';
                                        break
                                    } else if (rule == 13) {
                                        uk = 13//'13';
                                        break
                                    }  else if (rule == 14) {
                                        uk = 14//'14';
                                        break
                                    }
                                }
                            }

                            if (e.items[uk]) {
                                e.items[uk].toggle.check();
                            }
                        }
                    } else {
                        let uk = '0';
                        if (this.exData.playerNum == '4') {
                            e.uV = e.uV2;
                            uk = '13';
                        } else {
                            e.uV = e.uV1;
                            uk = '12';
                        }

                        for (const k in e.items) {
                            e.items[k].active = false;
                        }
                        for (const k in e.uV) {
                            e.items[k].active = true;
                        }
                        e.items[uk].toggle.check();
                    }
                }
            }
        }
    },
    // 处理扩展数据
    doExData: function () {
        // D2 4人强制加低
        // cc.log('.222222222222...')
        cc.log(this.exData);
        // cc.log(this.checkItems)
        // cc.log('..333333333333..')

        this.Node_baseSco.active = true;

        
        //270 人数 手牌数
        if (this.curGameId==GMID.EQS) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        // 有些地区没有加倍选项
        if (this.curGameId==GMID.D2) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        // pdk 铁2线
        if (this.curGameId==GMID.PDK) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        // pdknj 2 3人 规则
        if (this.curGameId==GMID.PDKNJ) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        //
        if (this.curGameId==GMID.PDKLS) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        //
        if (this.curGameId==GMID.PDKTY) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        //
        if (this.curGameId==GMID.PDKGX) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        //
        if (this.curGameId==GMID.PDKGAOX) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
        if (this.curGameId==GMID.DDZ5) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }


        // 妖精麻将
        if (this.curGameId==GMID.YJMJ) {
            let grps = this.radioGrps;
            let huan = grps[7]
            if (huan.uK == 16 || huan.uK == 17 || huan.uK == 18) {
                grps[8].active = true
            } else {
                grps[8].active = false
            }
        }

        // 血战麻将
        if (false && this.curGameId==GMID.XZMJ) {
            // 4人才有换三张选项
            for(let i=0; i<this.checkItems.length; i++){
                if (this.checkItems[i].uK != '21') {
                    continue;
                }

                this.checkItems[i].active = (this.exData.playerNum=='4');

                break;
            }
        }

        // 血战麻将
        if (false && this.curGameId==GMID.XZMJER) {
            // 4人才有换三张选项
            for(let i=0; i<this.checkItems.length; i++){
                if (this.checkItems[i].uK != '21') {
                    continue;
                }

                this.checkItems[i].active = (this.exData.playerNum=='4');

                break;
            }
        }

        // 宜宾麻将
        if (this.curGameId==GMID.YBMJ) {
            if (this.exData.tagName == TAG.tingYong) {
                // 4人才有换三张选项
                for(let i=0; i<this.checkItems.length; i++){
                    let item = this.checkItems[i]
                    if (this.exData.playerNum == '14') {
                        if (item.uK == '15' || item.uK == '16') {
                            item.active = true
                        }
                    } else {
                        if (item.uK == '15' || item.uK == '16') {
                            item.active = false
                        }
                    }
                }
            } else { // renshu
                // 4人才有换三张选项
                for(let i=0; i<this.checkItems.length; i++){
                    let item = this.checkItems[i]
                    if (this.exData.playerNum == '14') {
                        if (item.uK == '15' || item.uK == '16') {
                            item.active = true
                        }
                    } else {
                        if (item.uK == '15' || item.uK == '16') {
                            item.active = false
                        }
                    }
                }

                let e = this.exData.JiabeiItem;
                if (!cc.g.utils.judgeObjectEmpty(e)) {
                    let uk = '0';
                    if (this.exData.playerNum==4) {
                        e.uV = e.uV2;
                        uk = '13';
                    } else {
                        e.uV = e.uV1;
                        uk = '12';
                    }

                    for (const k in e.items) {
                        e.items[k].active = false;
                    }
                    for (const k in e.uV) {
                        e.items[k].active = true;
                    }
                    e.items[uk].toggle.check();
                }
            }
        }

        // pdk 颗数决定炸弹分数
        if (this.curGameId==GMID.PDK) {
            let grps = this.radioGrps;
            let ks = null;
        
            if (false) {
                for (let i = 0; i < grps.length; ++i) {
                    let e = grps[i];
                    if (e.name == GMTAG[GMID.PDK][1]) {
                        let arr = e.items[e.uK].uDesc.string.split('/');
                        ks = arr[2];
                        if (ks) break;
                    }
                }

                if (ks) {
                    for (let i = 0; i < grps.length; ++i) {
                        let e = grps[i];
                        if (e.name == GMTAG[GMID.PDK][3]) {
                            let ka = Object.keys(e.items);
                            ka.forEach(k => {
                                e.items[k].active = (e.items[k].uDesc.string == '算分');
                            });
    
                            //e.items[ka[0]].active = true;
                            //e.items[ka[0]].uDesc.string = ks+'分';
                            break;
                        }
                    }  
                }
            }
        }
      
        // 麻将 2人没有4局
        if (this.curGameId==GMID.HZMJ ||
            this.curGameId==GMID.XZMJ ||
            this.curGameId==GMID.XZMJER ||
            this.curGameId==GMID.YBMJ ||
            this.curGameId==GMID.NYMJ ||
            this.curGameId==GMID.LZMJ ||
            this.curGameId==GMID.NJMJ ||
            this.curGameId==GMID.GXMJ) {
            let grp = null;
            for (let i = 0; i < this.radioGrps.length; ++i) {
                let e = this.radioGrps[i];
                if (e.name == TAG.turnNum) {
                    grp = e;
                    break;
                }
            }

            let renshu = this.radioGrps[1].uK;

            if (grp) {
                let keys = Object.keys(grp.items);
                if (renshu == 2) {
                    grp.items[keys[0]].active = false;
                    grp.items[keys[1]].toggle.check();
                } else {
                    grp.items[keys[0]].active = true;
                }
            }
        }


        // 麻将 2人没有4局
        if (this.curGameId==GMID.YJMJ) {
            let grpFan = null;
            let grpHu = null;
            for (let i = 0; i < this.radioGrps.length; ++i) {
                let e = this.radioGrps[i];
                if (e.uIdx == 3) {
                    grpFan = e;
                } else if (e.uIdx == 5) {
                    grpHu = e;
                }
            }

            if (grpFan) {
                let keys = Object.keys(grpFan.items);
                if (this.radioGrps[1].uK == 2) {
                    grpFan.items[keys[0]].active = true;
                    grpFan.items[keys[1]].active = true;

                    if (!grpFan.items[keys[0]].toggle.isChecked &&
                        !grpFan.items[keys[1]].toggle.isChecked) {
                        grpFan.items[keys[0]].toggle.check();
                    }
                } else {
                    grpFan.items[keys[0]].active = true;
                    grpFan.items[keys[1]].active = false;
                    grpFan.items[keys[0]].toggle.check();
                }
            }
            //
            // if (grpHu) {
            //     let keys = Object.keys(grpHu.items);
            //     if (this.exData.playerNum == 2) {
            //         grpHu.items[keys[0]].active = false;
            //         grpHu.items[keys[1]].active = true;
            //         grpHu.items[keys[2]].active = true;
            //         grpHu.items[keys[1]].toggle.check();
            //     } else if (this.exData.playerNum == 3) {
            //         grpHu.items[keys[0]].active = true;
            //         grpHu.items[keys[1]].active = true;
            //         grpHu.items[keys[2]].active = false;
            //         grpHu.items[keys[0]].toggle.check();
            //     } else {
            //         grpHu.items[keys[0]].active = true;
            //         grpHu.items[keys[1]].active = false;
            //         grpHu.items[keys[2]].active = false;
            //         grpHu.items[keys[0]].toggle.check();
            //     }
            // }
        }

        // 处理2人特殊选项
        if (this.curGameId==GMID.NYMJ) {
            if (this.exData.playerNum==2) {
                this.Node_Ny_TeSu.active = true
                if (this.bjifo) {
                    //  清除选项
                    this.clearNyMjTeSu();
                    // 宁远麻将
                    // 5,不加倍|
                    // 6,加倍|
                    // 7,翻2倍|
                    // 8,翻3倍|
                    // 9,翻4倍|
                    // 15,低于|
                    let rules = this.bjifo.rule;
                    for (let i = 0; i < rules.length; i++) {
                        let rule = rules[i]
                        if (rule == 5) {
                            this.ts_toggle_one.check();
                        } else if (rule == 6) {
                            this.ts_toggle_two.check();
                            this.Node_Two.active = true;
                            this.Node_Plush_Num.active = true;
                        }  else if (rule == 7) {
                            this.ts_two_toggle_one.check();
                        }  else if (rule == 8) {
                            this.ts_two_toggle_two.check();
                        }  else if (rule == 9) {
                            this.ts_two_toggle_three.check();
                        } else if (rule == 15) {
                            this.ts_three_toggle_one.check();
                        }
                    }

                    let expendSpeciThing = this.bjifo.expendSpeciThing;
                    if (!cc.g.utils.judgeObjectEmpty(expendSpeciThing)) {
                        // expendSpeciThing.ningYuanSpeciRule.addBeiStrip//
                        let addBeiStrip = cc.g.utils.realNum1(expendSpeciThing.ningYuanSpeciRule.addBeiStrip)
                        let addFenStrip = cc.g.utils.realNum1(expendSpeciThing.ningYuanSpeciRule.addFenStrip)
                        let addFen = cc.g.utils.realNum1(expendSpeciThing.ningYuanSpeciRule.addFen)

                        if (addBeiStrip > 0) {
                            this.Node_Plush_Num.active = true;
                            this.Node_Plush_Num_Edit.string = "小于" + addBeiStrip + "分";
                        }

                        if (addFenStrip > 0) {
                            this.Node_three_Plush_Num_Jia1.interactable = true;
                            this.Node_three_Plush_Num_Jian1.interactable = true;
                            this.Node_three_Plush_Num_Edit1.string = addFenStrip + "分";
                        }

                        if (addFen > 0) {
                            this.Node_three_Plush_Num_Jia2.interactable = true;
                            this.Node_three_Plush_Num_Jian2.interactable = true;
                            this.Node_three_Plush_Num_Edit2.string = addFen + "分";
                        }

                    }
                }

            } else {
                this.Node_Ny_TeSu.active = false
            }
        }

        // 内江麻将 2人没有“一牌多用(10)”
        if(this.curGameId==GMID.NJMJ){
            let ks = 10;
            for(let i=0; i<this.checkItems.length; i++){
                let item = this.checkItems[i];
                if (ks == item.uK) {
                    item.active = (this.exData.playerNum == 3 || this.exData.playerNum == 4);
                    break;
                }
            }
        }

        if ((this.curGameId==GMID.HZMJ) || (this.curGameId==GMID.XZMJ) || (this.curGameId==GMID.XZMJER) ||
            (this.curGameId==GMID.YBMJ) || (this.curGameId==GMID.NYMJ) ||
            (this.curGameId==GMID.LZMJ) || (this.curGameId==GMID.NJMJ) ||
            (this.curGameId==GMID.YJMJ) || (this.curGameId==GMID.GXMJ)) {
            this.teshuGuize.up(this.curGameId, true);
            return;
        }
    },
    clearNyMjTeSu: function() {
        this.Node_Plush_Num.active = false;
        this.Node_Two.active = false;
        this.ts_toggle_one.check();
        this.ts_toggle_two.uncheck();
        this.ts_two_toggle_one.uncheck();
        this.ts_two_toggle_two.uncheck();
        this.ts_two_toggle_three.uncheck();
        this.ts_three_toggle_one.uncheck();
    },
    // 游戏单选项点击事件
    onCheckRadioItem: function (event, customEventData) {
        let itm = customEventData;

        cc.log('onCheckRadioItem'+' '+itm.parent.name+' '+itm.uK+' '+event.isChecked);

        if (!event.isChecked) {
            if (itm.grp.uK == itm.uK) {
                cc.log('不允许取消当前选项 再选一次');
                itm.skip = true;
                itm.toggle.check();
            }
            return;
        }

        if (itm.skip) {
            delete itm.skip;
            return;
        }

        this.node_PDItemDesc.active = false;

        let lastItem = itm.grp.items[itm.grp.uK];
        if (!lastItem) {
            cc.log('onCheckRadioItem lastItem null');
            return;
        }

        itm.grp.uK = itm.uK;
        lastItem.toggle.uncheck();

        this.upOptionChange(itm.grp);
        //this.doExData();

        if (event.isChecked) {
            // 宁远麻将
            if (this.curGameId==GMID.NYMJ) {
                if (this.exData.playerNum==2) {
                    this.Node_Ny_TeSu.active = true
                } else {
                    this.Node_Ny_TeSu.active = false
                }
            }
            let layout = this.svOption.content.getComponent(cc.Layout);
            layout.updateLayout();
        }
    },


    // 提示说明
    onClickPDIIfo: function(event, d) {
        let grp = d.grp;
        let item = d.item;
        let desc = this.node_PDItemDesc;
        if (this.curPDTag==grp.name && desc.active) {
            //return;
        }

        desc.active = false;
        this.curPDTag = grp.name;

        cc.log("uDescIfo", grp.uDescIfo);

        desc.Label_pdifo.string = grp.uDescIfo[item.uK];

        this.scheduleOnce(()=>{
            desc.active = true;

            desc.height = desc.Label_pdifo.node.height+10;

            let wp = item.convertToWorldSpaceAR(cc.v2(0 + 160, 0));
            let topos = desc.parent.convertToNodeSpaceAR(wp);
    
            desc.x = topos.x;
            desc.y = topos.y;
        }, 0.05);
    },

    // 更新下拉菜单更换后的相关表现
    upOptionChange: function (item) {
        if (!item) {
            return;
        }

        // 托管相关
        if (item.name === GMTAG[this.curGameId][11]) {
            this.doExData();
            return;
        }

        //
        if (item.name === GMTAG[GMID.PDKLS][2]) {
            this.doExData();
            return;
        }

        // 270张数
        if (this.curGameId==GMID.EQS && item.name === GMTAG[GMID.EQS][4]) {
            this.doExData();
            return;
        }

        // yaoji
        if (item.name === GMTAG[GMID.YJMJ][8]) {
            this.doExData();
            return;
        }

        if (this.curGameId==GMID.PDKTY) {
            if ( (item.name == GMTAG[GMID.PDKTY][4]) ||
                 (item.name == GMTAG[GMID.PDKTY][5]) ||
                 (item.name == GMTAG[GMID.PDKTY][2])
               )
            {
                this.doExData();
                return;
            }
        }

        // 更换消费模式
        if (item.name === TAG.costMode) {    
            this.upFangkaNum();
            return;
        }
        // 更换人数
        if (item.name === TAG.playerNum) {    
            this.upFangkaNum();

            if ( this.curGameId==GMID.D2 || this.curGameId==GMID.EQS || this.curGameId==GMID.XZMJ || this.curGameId==GMID.XZMJER ||
                 this.curGameId==GMID.YBMJ || this.curGameId==GMID.HZMJ || this.curGameId==GMID.LZMJ || this.curGameId==GMID.YJMJ ||
                 this.curGameId==GMID.NYMJ || this.curGameId==GMID.PDKNJ|| this.curGameId==GMID.PDKLS|| this.curGameId==GMID.PDKTY ||
                 this.curGameId==GMID.NJMJ || this.curGameId==GMID.GXMJ) {
                this.exData.playerNum = item.uK;
                this.exData.tagName = TAG.playerNum;
                this.doExData();
            }
            return;
        }
        // 更换的是局数 需要更新房卡消耗数量
        if (item.name === TAG.turnNum) {
            this.upFangkaNum();
            return;
        }
        if (this.curGameId==GMID.EQS && item.name == GMTAG[GMID.EQS][1]) {
            this.upFangkaNum();
            return;
        }

        // 宜宾麻将
        if (item.name === TAG.tingYong) {
            this.upFangkaNum();
            if (this.curGameId==GMID.YBMJ) {
                this.exData.tagName = TAG.tingYong;
                this.doExData();
            }

            return;
        }

        // 
        if (item.name === GMTAG[GMID.PDK][1]) {
            if (this.curGameId==GMID.PDK) {
                this.doExData();
            }
        }

        // 
        if (item.name === GMTAG[GMID.PDK][2]) {
            if (this.curGameId==GMID.PDK) {
                this.doExData();
            }
        }
    },

    // 更新房卡消耗数量
    upFangkaNum: function () {
        let crtInfo = cc.g.hallMgr.crtRoomInfo;
        let tagNode = this.VB_radio.node;

        // 消费模式
        let cm = tagNode.getChildByName(TAG.costMode).uK;
        let multiple = 1;
        let playerNum = 1;

        // "32,冠军房费","33,均摊房费","34,房主房费","35,俱乐部房费"
        // cmo.v['32'] = '冠军房费';//'冠军房费';
        // cmo.v['33'] = '均摊房费';//'冠军房费';
        // cmo.v['35'] = '茶馆房费';//'冠军房费';

        if (this.curGameId != GMID.PDK) {
            playerNum = parseInt(tagNode.getChildByName(TAG.playerNum).uK);
        } else {
             //人数下限 人数上限
            let PlayerNumData = {
                37:{xx:2,sx:4,},
                38:{xx:2,sx:4,},
                39:{xx:2,sx:7,},
                40:{xx:2,sx:7,},
                41:{xx:2,sx:2,},
                42:{xx:2,sx:3,},
                43:{xx:2,sx:4,},
                44:{xx:3,sx:3,},
                45:{xx:4,sx:4,},
            };

            let n = PlayerNumData[parseInt(tagNode.getChildByName(TAG.playerNum).uK)];
            playerNum = n ? n.sx : 1;
        }

        if ((cm==='32') || (cm==='35') || (cm==='3')){
            // 冠军和房主 要乘以人数
            //multiple *= playerNum;
        }

        // 局数
        let idx = 0;
        if (this.curGameId != GMID.EQS) {
            let tk = tagNode.getChildByName(TAG.turnNum).uK;
            let tn = crtInfo[this.curGameId].turnNum;
            let to = tn[this.curArea] ? tn[this.curArea] : tn["0"];

            for (const k in to.v) {
                if (tk == k) {
                    break
                }
                ++idx;
            }
        } else {
            let grps = this.radioGrps;
            let quan = null;
            for (let i = 0; i < grps.length; ++i) {
                if (grps[i].name == GMTAG[GMID.EQS][1]) {
                    quan = grps[i];
                    break;
                }
            }

            if (quan) {
                for (const k in quan.uV) {
                    if (k == quan.uK) {
                        break;
                    }
                    ++idx;
                }
            }
        }

        // 大厅创建
        let roomCardNum = crtInfo[this.curGameId].roomCardNum;
        let cardConsume = crtInfo[this.curGameId].cardConsume;

        if (this.clubInfo || this.bjifo) {
            let gold = (this.clubInfo && this.clubInfo.openGold) || (this.bjifo && this.bjifo.openGold)

            if (gold) {
                roomCardNum = crtInfo[this.curGameId].roomCardNum2; // 茶馆金币
                cardConsume = crtInfo[this.curGameId].cardConsume2;
            } else {
                roomCardNum = crtInfo[this.curGameId].roomCardNum1; // 茶馆普通
                cardConsume = crtInfo[this.curGameId].cardConsume1;
            }
        }

        // 均摊扣除房卡的计算方式不一样
        let rcn = roomCardNum;
        if (cm =='33') {
            rcn = cardConsume;
        }

        let cardCost = rcn[this.curArea] ? rcn[this.curArea] : rcn["0"];
        let cost = cardCost[idx];

        let n = 1;
        for (const key in cost) {
            let pn = parseInt(key);
            if (playerNum>=pn) {
                n = cost[key];
            }
        }

        this.LabelFkNum.string = 'x' + n*multiple;

        {/*
            // 房卡
            let rcn = crtInfo[this.curGameId].roomCardNum;
            let cardCost = rcn[this.curArea] ? rcn[this.curArea] : rcn["0"];
            this.LabelFkNum.string = 'x' + cardCost[idx]*multiple;
        */}
    },

    onClickCheckItem: function (evt, item, args) {
        this.node_PDItemDesc.active = false;
        
        this.curCheckArg = {
            evt:evt,
            item:item,
        }

        this.teshuGuize.up(this.curGameId, false);
    },

    /* =================================================================================================================== */


    /* =================================================================================================================== */
    //
    onGoldEdtEnd: function (event, customEventData) {
        let eb = (customEventData == 1) ? this.EditBox_jbc1 : this.EditBox_jbc2;

        let n = (eb.string=='' ? 0 : parseInt(eb.string));
        eb.string = (n<1 ? 1 : n);
    },
    //
    onGoldJiaJian: function (event, customEventData) {
        let arg = customEventData.split(',');

        let jia = (arg[0] == 1);
        let eb = (arg[1] == 1) ? this.EditBox_jbc1 : this.EditBox_jbc2;

        let n = parseInt(eb.string);
        if (jia) {
            eb.string = ++n;
        } else {
            eb.string = (n<=1 ? 1 : --n);
        }
    },


    // 大赢家分数 减
    onBtnJian: function (event, ced) {
        cc.log('onBtnJian');

        cc.g.utils.btnShake();

        if (ced == 'base') {
            let sco = (this.LABEL_baseSco.string=='' ? 0 : parseFloat(this.LABEL_baseSco.string));
            if (sco <= mindf){
                sco=maxdf;
            } else if (sco <= 1) {
                sco -= 0.1;
            } else {
                --sco;
            }

            this.LABEL_baseSco.string = (sco>=1 ? sco : sco.toFixed(1));
            return;
        }

        let sco = (this.EditBox_mws.string=='' ? 0 : parseInt(this.EditBox_mws.string));
        (sco <= 0) ? sco=0 : --sco;
        this.EditBox_mws.string = sco;
    },
    // 大赢家分数 加
    onBtnJia: function (event, ced) {
        cc.g.utils.btnShake();
        
        if (ced == 'base') {
            let sco = (this.LABEL_baseSco.string=='' ? 0 : parseFloat(this.LABEL_baseSco.string));
            if (sco < 1){
                sco+=0.1;
            } else if (sco >= maxdf) {
                sco = mindf;
            } else {
                ++sco;
            }

            this.LABEL_baseSco.string = (sco>=1 ? sco : sco.toFixed(1));

            return;
        }

        this.EditBox_mws.string = (this.EditBox_mws.string=='' ? 0 : parseInt(this.EditBox_mws.string)) + 1;
    },

    //
    onDyjEdtEnd: function (event, customEventData) {
        let sco = (this.EditBox_mws.string=='' ? 0 : parseInt(this.EditBox_mws.string));
        (sco < 0) && (this.EditBox_mws.string = 0);
    },

    // 宁远麻将 减
    onNyBtnJian: function (event, customEventData) {
        console.log(customEventData)
        if (customEventData == 1) {
            let num = this.getXiaoYuFen();
            if (num <= 5) {
                num = 5;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            } else if (num == 10) {
                num -= 5;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            } else {
                num -= 10;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            }
        } else if (customEventData == 2) {
            let num = this.getMultFen(this.Node_three_Plush_Num_Edit1.string)
            if (num <= 1) {
                num = 1;
                this.Node_three_Plush_Num_Edit1.string = num + "分";
            } else {
                num -= 1;
                this.Node_three_Plush_Num_Edit1.string = num + "分";
            }
        } else if (customEventData == 3) {
            let num = this.getMultFen(this.Node_three_Plush_Num_Edit2.string)
            if (num <= 1) {
                num = 1;
                this.Node_three_Plush_Num_Edit2.string = num + "分";
            } else {
                num -= 1;
                this.Node_three_Plush_Num_Edit2.string = num + "分";
            }
        }
    },
    // 宁远麻将 加
    onNyBtnJia: function (event, customEventData) {
        console.log(customEventData)
        if (customEventData == 1) {
            let num = this.getXiaoYuFen();
            if (num <= 5) {
                num += 5;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            } else if (num >= 30) {
                num = 30;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            } else {
                num += 10;
                this.Node_Plush_Num_Edit.string = "小于" + num + "分";
            }
        } else if (customEventData == 2) {
            let num = this.getMultFen(this.Node_three_Plush_Num_Edit1.string)
            num += 1;
            this.Node_three_Plush_Num_Edit1.string = num + "分";
        } else if (customEventData == 3) {
            let num = this.getMultFen(this.Node_three_Plush_Num_Edit2.string)
            num += 1;
            this.Node_three_Plush_Num_Edit2.string = num + "分";
        }
    },
    getXiaoYuFen: function() {
        let numStr = this.Node_Plush_Num_Edit.string
        let numArrStr = numStr.split("小于"); //字符分割
        let numOne = numArrStr[1]
        let numOneStr =  numOne.split("分"); //字符分割
        return parseInt(numOneStr[0])
    },
    getMultFen: function(numStr) {
        let numArrStr = numStr.split("分"); //字符分割
        return parseInt(numArrStr[0])
    },
    //  宁远麻将 cehck box
    onCheckNyRadioItem: function(event, customEventData) {
        console.log(customEventData)
        if (customEventData == 1) {
            if (event.isChecked) {
                this.ts_toggle_two.uncheck();
                this.Node_Plush_Num.active = false
                this.Node_Two.active = false
            }
        } else if (customEventData == 2) {
            if (event.isChecked) {
                this.ts_toggle_one.uncheck();
                this.Node_Plush_Num.active = true
                this.Node_Two.active = true
            }
        } else if (customEventData == 3) {
            if (event.isChecked) {
                // this.ts_two_toggle_one.uncheck();
                this.ts_two_toggle_two.uncheck();
                this.ts_two_toggle_three.uncheck();
            }
        } else if (customEventData == 4) {
            if (event.isChecked) {
                this.ts_two_toggle_one.uncheck();
                // this.ts_two_toggle_two.uncheck();
                this.ts_two_toggle_three.uncheck();
            }
        } else if (customEventData == 5) {
            if (event.isChecked) {
                this.ts_two_toggle_one.uncheck();
                this.ts_two_toggle_two.uncheck();
                // this.ts_two_toggle_three.uncheck();
            }
        } else if (customEventData == 6) {
            if (event.isChecked) {
                // this.Node_three_Plush_Num_Jia1.interactable = true;
                this.Node_three_Plush_Num_Jia1.interactable = true;
                this.Node_three_Plush_Num_Jian1.interactable = true;
                this.Node_three_Plush_Num_Jia2.interactable = true;
                this.Node_three_Plush_Num_Jian2.interactable = true;
            } else {
                this.Node_three_Plush_Num_Jia1.interactable = false;
                this.Node_three_Plush_Num_Jian1.interactable = false;
                this.Node_three_Plush_Num_Jia2.interactable = false;
                this.Node_three_Plush_Num_Jian2.interactable = false;
            }
        }
    },

    //创建游戏处理
    onClickCreateRoom: function (event) {
        cc.log('onClickCreateRoom');
        
        {/* 子游戏加载-旧版代码记录

            // 创建俱乐部玩法
            if (this.clubInfo || this.bjifo) {
                this.doCreateRoom_(event);
                return;
            }

            cc.g.subgmMgr.loadGame(this.curGameId, (ok, ifo)=>{
                cc.log('loadGame', ifo);
                if (ok) {
                    this.doCreateRoom_(event);
                } else {
                    cc.g.global.showTipBox(ifo);
                }
            });

        */}

        this.doCreateRoom_(event);
    },
    doCreateRoom_: function (event) {
        cc.g.utils.btnShake();

        if (this.bjifo && !this.isBySR) {
            this.onClickSaveBjSetting();
            return;
        }

        {
            /*
                // 创建房间
                //@api:1005,@type:req
                message CreateRoomReq {
                    bool  isView = 1; 	// 所有人可见
                    GAME gameType = 2; 
                    int32 type = 3;  	// 创建房间类型 1-金币场; 2-积分场
                    int32 base = 4;  	// 底分
                    int32 gameNum = 5;  // 游戏局数
                    int32 rule = 6;     // 规则
                    int32 clubId = 7;   // 俱乐部
                    ORIGIN origin = 8;  // 地区
                    int32 tickectMode = 9;  // 消费模式
                    int32 startNum = 10;    // 人数
                    repeated int32 bigTwoRlue = 11; // 规则
                    bool openGps = 12;
	                int32 maxWinSco = 10;    // 人数
                }
            */
        }

        let bs = (this.LABEL_baseSco.string=='' ? 0 : parseFloat(this.LABEL_baseSco.string));
        let bs1 = (bs>=1 ? bs : bs.toFixed(1));

        let info = {};

        info.isView   = false; // 所有人可见
        info.gameType = this.curGameId;   //游戏ID
        info.origin = parseInt(this.curArea);
        info.type     = 2;  	// 创建房间类型 1-金币场; 2-积分场
        info.base     = cc.g.utils.fixNum1(bs1);  	// 底分
        info.rule     = 0;   // 规则
        info.clubId   = 0;   // 俱乐部
        info.floor    = 0;   // 俱乐部
        info.maxWinSco = (this.EditBox_mws.string=='' ? 0 : parseInt(this.EditBox_mws.string));
        info.maxWinSco = cc.g.utils.fixNum1(info.maxWinSco);

        info.bigTwoRlue=[];

        // 通用单选项
        for (let i = 0; i < this.radioGrps.length; ++i) {
            const e = this.radioGrps[i];

            if (!e.active) continue;

            const name = e.name;
            const K = parseInt(e.uK);

            if (name == TAG.area) {
                //info.origin = K;
            } else if (name == TAG.costMode) {
                info.tickectMode = K;
            } else if (name == TAG.playerNum) {
                info.startNum = K;
            } else if (name == TAG.turnNum) {
                info.gameNum = K;
            } else if (name == TAG.diFen) {
                if (K == 51) {
                    info.base = 1;
                } else if (K == 52) {
                    info.base = 2;
                } else {
                    info.bigTwoRlue.push(K);
                }
            } else {
                info.bigTwoRlue.push(K);
            }
        }

        if (info.gameType == GMID.EQS) {
            // 1:'圈2', 2:'圈5', 3:'圈10', 4:'圈3',
            let q={ 1:2, 2:5, 3:10, 4:3,};

            info.bigTwoRlue.forEach(e => {
                if (e>=1 && e<=4) {
                    info.gameNum = q[e] || 8;
                }
            });
        }

        // 私有单选项
        let needLocation = false;
        for (let i = 0; i < this.checkItems.length; ++i) {
            const e = this.checkItems[i];
        
            if (e.active && e.getComponent(cc.Toggle).isChecked) {
                info.bigTwoRlue.push(parseInt(e.uK));
                
                if (e.uK == '36') {
                    needLocation = true;
                }
            }
        }

        info.bigTwoRlue.push(info.tickectMode);
        
        info.openGps = false;

        // 包间名字
        info.bjname = this.EditBox_bjName.string;

        // 金币场包间规则
        let o={};
        o.joinGold = parseInt(this.EditBox_jbc1.string);//加入牌桌金币
        o.disbandGold = parseInt(this.EditBox_jbc2.string);//解散牌桌金币
        o.exitType = this.toggle_zdjs.isChecked ? 1 : 2;//剩余金币不足类型 1自动解散 2继续游戏

        o.joinGold = cc.g.utils.fixNum1(o.joinGold);
        o.disbandGold = cc.g.utils.fixNum1(o.disbandGold);

        if (!this.djgJinbicj) {
            o.lotteryType = 1;//抽奖类型 1不抽奖 2所有人抽奖 3大赢家抽奖
            o.consumeGold = 0;//所有人抽奖消耗金币
            o.winnerRuleList = [];//大赢家抽奖规则
            o.ticket = 0;
        } else {
            let d = this.djgJinbicj.cjData[`${this.curGameId},${this.curArea}`];
            o.lotteryType = d.cur;
            o.consumeGold = cc.g.utils.fixNum1(d.d2);
            o.winnerRuleList = [];

            let di = (d.cur=='3' ? d.d3:d.d4);
            di.forEach(e => {
                if (e.max > 0) {
                    o.winnerRuleList.push({
                        minScore:cc.g.utils.fixNum1(e.min),
                        maxScore:cc.g.utils.fixNum1(e.max),
                        consumeGold:cc.g.utils.fixNum1(e.jinbi),
                        bottomGold:cc.g.utils.fixNum1(e.choudi),
                    });   
                }
            });

            o.ticket = cc.g.utils.fixNum1(d.ticket);
        }
        
        info.goldMatchRule = o;


        // 宁远麻将
        // 5,不加倍|
        // 6,加倍|
        // 7,翻2倍|
        // 8,翻3倍|
        // 9,翻4倍|
        // 15,低于|
        if ((info.startNum == 2) && (info.gameType == GMID.NYMJ)) {
            let expendSpeciThing = {};
            let ningYuanSpeciRule = {}
            expendSpeciThing.ningYuanSpeciRule = ningYuanSpeciRule
            if (this.ts_toggle_one.isChecked) {
                info.bigTwoRlue.push(5);
            } else if (this.ts_toggle_two.isChecked) {
                info.bigTwoRlue.push(6);
                // 倍数
                if (this.ts_two_toggle_one.isChecked) {
                    info.bigTwoRlue.push(7);
                } else if (this.ts_two_toggle_two.isChecked) {
                    info.bigTwoRlue.push(8);
                } else if (this.ts_two_toggle_three.isChecked) {
                    info.bigTwoRlue.push(9);
                }

                // 选择加倍
                if (this.ts_toggle_two.isChecked) {
                    ningYuanSpeciRule.addBeiStrip = cc.g.utils.fixNum1(this.getXiaoYuFen()) //this.getXiaoYuFen()//
                }
            }

            if (this.ts_three_toggle_one.isChecked) {
                info.bigTwoRlue.push(15);

                // 选择低于
                if (this.ts_three_toggle_one.isChecked) {
                    let num1 = this.getMultFen(this.Node_three_Plush_Num_Edit1.string)
                    let num2 = this.getMultFen(this.Node_three_Plush_Num_Edit2.string)
                    ningYuanSpeciRule.addFenStrip = cc.g.utils.fixNum1(num1)
                    ningYuanSpeciRule.addFen = cc.g.utils.fixNum1(num2)
                }
            }

            // 放入数据
            info.expendSpeciThing = expendSpeciThing
        }
        
        if (this.clubInfo) {
            cc.log('创建俱乐部包间 >>>>>', info);
            this.node.active = false;
            info.clubId = this.clubInfo.clubId;
            cc.g.hallMgr.createClubRoom(info);
        } else if (!needLocation) {
            cc.log('创建房间 >>>>>', info)
            this.node.active = false;
            cc.g.hallMgr.createRoom(info);
        } else {
            cc.log('创建房间 >>>>> 检测定位', info);

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

                this.node.active = false;

                info.openGps = true;
                info.longitude = cc.g.userMgr.gps.longitude || '0';
                info.latitude = cc.g.userMgr.gps.latitude || '0';

                cc.log('创建房间 >>>>>', info);
                cc.g.hallMgr.createRoom(info);
            });
        }
    },

    // 删除俱乐部包间
    onClickDelBaojian: function (event, customEventData) {
        cc.log(this.dbgstr('删除俱乐部包间'));

        cc.g.utils.btnShake();

        cc.g.hallMgr.delClubBaojian(this.bjifo, ()=>{
            this.node.active = false;
        });
    },
    // 保存俱乐部包间设置
    onClickSaveBjSetting: function (event, customEventData) {
        cc.log(this.dbgstr('保存俱乐部包间设置'));

        cc.g.utils.btnShake();

        let bs = (this.LABEL_baseSco.string=='' ? 0 : parseFloat(this.LABEL_baseSco.string));
        let bs1 = (bs>=1 ? bs : bs.toFixed(1));

        let info = {};
        info.bigTwoRlue=[];
        info.maxWinSco = (this.EditBox_mws.string=='' ? 0 : parseInt(this.EditBox_mws.string));
        info.maxWinSco = cc.g.utils.fixNum1(info.maxWinSco);
        info.base = cc.g.utils.fixNum1(bs1);
        
        //下拉项
        for (let i = 0; i < this.radioGrps.length; ++i) {
            const e = this.radioGrps[i];

            if (!e.active) continue;

            const name = e.name;
            const K = parseInt(e.uK);

            if (name == TAG.playerNum) {
                info.startNum = K;
            } else if (name == TAG.turnNum) {
                info.gameNum = K;
            } else if (name == TAG.diFen) {
                if (K == 51) {
                    info.base = 1;
                } else if (K == 52) {
                    info.base = 2;
                } else {
                    info.bigTwoRlue.push(K);
                }
            // } else if (name != TAG.area && name != TAG.costMode){
            } else if (name != TAG.area){
                info.bigTwoRlue.push(K);
            }
        }

        if (this.curGameId == GMID.EQS) {
            // 1:'圈2', 2:'圈5', 3:'圈10', 4:'圈3',
            let q={ 1:2, 2:5, 3:10, 4:3,};

            info.bigTwoRlue.forEach(e => {
                if (e>=1 && e<=4) {
                    info.gameNum = q[e] || 8;
                }
            });
        }

        //单选项
        for (let i = 0; i < this.checkItems.length; ++i) {
            const e = this.checkItems[i];
        
            if (e.active && e.getComponent(cc.Toggle).isChecked) {
                info.bigTwoRlue.push(parseInt(e.uK));
            }
        }


        // 包间名字
        info.bjname = this.EditBox_bjName.string;

        // 金币场包间规则
        if (this.Node_jbc.active) {
            let o={};
            o.joinGold = parseInt(this.EditBox_jbc1.string);//加入牌桌金币
            o.disbandGold = parseInt(this.EditBox_jbc2.string);//解散牌桌金币
            o.exitType = this.toggle_zdjs.isChecked ? 1 : 2;//剩余金币不足类型 1自动解散 2继续游戏
    
            o.joinGold = cc.g.utils.fixNum1(o.joinGold);
            o.disbandGold = cc.g.utils.fixNum1(o.disbandGold);

            let gmr = this.bjifo && this.bjifo.goldMatchRule;
            gmr.joinGold = o.joinGold;
            gmr.disbandGold = o.disbandGold;
            gmr.exitType = o.exitType;

            if (!this.djgJinbicj && !gmr) {
                o.lotteryType = 1;//抽奖类型 1不抽奖 2所有人抽奖 3大赢家抽奖
                o.consumeGold = 0;//所有人抽奖消耗金币
                o.winnerRuleList = [];//大赢家抽奖规则
                o.ticket = 0;
                // if (this.bjifo.goldMatchRule) {
                //     o = this.bjifo.goldMatchRule;
                // }
            } else {
                if (this.djgJinbicj) {
                    let d = this.djgJinbicj.cjData[`${this.curGameId},${this.curArea}`];

                    o.lotteryType = d.cur;
                    o.consumeGold = cc.g.utils.fixNum1(d.d2);
                    o.winnerRuleList = [];
                    
                    let di = (d.cur=='3' ? d.d3:d.d4);
                    di.forEach(e => {
                        if (e.max > 0) {
                            o.winnerRuleList.push({
                                minScore:cc.g.utils.fixNum1(e.min),
                                maxScore:cc.g.utils.fixNum1(e.max),
                                consumeGold:cc.g.utils.fixNum1(e.jinbi),
                                bottomGold:cc.g.utils.fixNum1(e.choudi),
                            });
                        }
                    });

                    o.ticket = cc.g.utils.fixNum1(d.ticket);
                } else {
                    o = cc.g.clone(gmr);
                }
            }
            
            info.goldMatchRule = o;
        }


        // 宁远麻将
        // 5,不加倍|
        // 6,加倍|
        // 7,翻2倍|
        // 8,翻3倍|
        // 9,翻4倍|
        // 15,低于|
        if ((this.bjifo.playNum == 2) && (this.bjifo.gameType == GMID.NYMJ)) {
            let expendSpeciThing = {};
            let ningYuanSpeciRule = {}
            expendSpeciThing.ningYuanSpeciRule = ningYuanSpeciRule
            if (this.ts_toggle_one.isChecked) {
                info.bigTwoRlue.push(5);
            } else if (this.ts_toggle_two.isChecked) {
                info.bigTwoRlue.push(6);
                // 倍数
                if (this.ts_two_toggle_one.isChecked) {
                    info.bigTwoRlue.push(7);
                } else if (this.ts_two_toggle_two.isChecked) {
                    info.bigTwoRlue.push(8);
                } else if (this.ts_two_toggle_three.isChecked) {
                    info.bigTwoRlue.push(9);
                }

                // 选择加倍
                if (this.ts_toggle_two.isChecked) {
                    ningYuanSpeciRule.addBeiStrip = cc.g.utils.fixNum1(this.getXiaoYuFen()) //this.getXiaoYuFen()
                }
            }

            if (this.ts_three_toggle_one.isChecked) {
                info.bigTwoRlue.push(15);

                // 选择低于
                if (this.ts_three_toggle_one.isChecked) {
                    let num1 = this.getMultFen(this.Node_three_Plush_Num_Edit1.string)
                    let num2 = this.getMultFen(this.Node_three_Plush_Num_Edit2.string)
                    ningYuanSpeciRule.addFenStrip = cc.g.utils.fixNum1(num1)
                    ningYuanSpeciRule.addFen = cc.g.utils.fixNum1(num2)
                }
            }

            // 放入数据
            info.expendSpeciThing = expendSpeciThing
        }

        cc.g.hallMgr.editClubBaojian(this.bjifo, info, ()=>{
            this.node.active = false;
        });
    },
    /* =================================================================================================================== */


    // 金币抽奖
    onBtnJinbicj: function (event, customEventData) {
        cc.g.utils.btnShake();

        if (this.djgJinbicj) {
            this.djgJinbicj.up();
            return;
        }

        let dlg = cc.instantiate(this.dlgJbcs).getComponent('CRJinbicj');
        dlg.init(this);

        this.node.addChild(dlg.node);

        this.djgJinbicj = dlg;
    },


    //关闭按钮事件
    onClickClose: function () {
        cc.g.utils.btnShake();
        
        if (this.clubInfo || this.bjifo) {
            this.node.destroy();
            return;
        }

        this.node.active = false;
    },
    

    dbggm: function (gt) {
        cc.log(this.dbgstr('保存俱乐部包间设置'));

        let room={
            CurPlayer: 0,
            GameNum: 4,
            NewRlue: [],
            applyStatus: [],
            base: 1,
            bet: 0,
            cardNum: 0,
            clubId: 0,
            clubdesk: {roomUid: 0, deskIndex: 0},
            cnt: 1,
            curGameNum: 0,
            dealer: 0,
            end: 0,
            gameType: gt,
            gsId: 1,
            id: 0,
            limit: 0,
            now: 0,
            opcard: null,
            origin: 2,
            owner: cc.g.userMgr.userId,
            power: 0,
            roomId: 135730,
            round: 0,
            rule: 0,
            start: 0,
            status: 0,
            total: 2,
            type: 2,
        };

        let one = {
            bet: 0,
            bigtwoInfo: null,
            cardNum: 0,
            cards: [],
            clubList: [],
            deskId: 0,
            end: 0,
            exclude: 0,
            fold: [],
            gVoiceId: 0,
            gps: {longitude: "104.06628", latitude: "30.61595"},
            hu: 0,
            huType: 0,
            icon: "4",
            ip: "110.191.218.171",
            isAuto: false,
            isView: false,
            mjResult: null,
            money: 0,
            name: "游客10becc",
            op: 0,
            power: 0,
            result: 0,
            reward: 0,
            roomCard: [],
            sex: 1,
            show: [],
            start: 0,
            status: 0,
            uid: cc.g.userMgr.userId,
        };

        cc.g.hallMgr.enterGame(gt, room, one, null);
    },
});
