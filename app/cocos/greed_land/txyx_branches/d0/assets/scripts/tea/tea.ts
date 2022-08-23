// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaQingClass from "./prets/tea_qing";
import TeaWfPop from "./prets/tea_wf_pop";
import TeaAreaModes from "./models/TeaAreaModes"
import TeaAreaModesItem from "./models/TeaAreaModesItem"
import TeaWfSetName from "./prets/tea_tjwf_shurukang"
import TeaChenYuan from "./prets/tea_chengyuan"
import TeaZhanJi from "./prets/tea_zhanji";
import TeaJrcj from "./prets/tea_jrcj";
import TeaMoreClass from "./prets/tea_geng_duo";
import TeaBmsp from "./prets/tea_gold_bmsp";
import ScrollViewPlus from "../components/ScrollViewPlus";
const {ccclass, property} = cc._decorator;

//所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)

@ccclass
export default class TeaClass extends cc.Component {
    static instance: TeaClass = null;

    @property([cc.SpriteFrame])
    teabg: cc.SpriteFrame[] = [];

    // 桌子 1 套
    @property(cc.Prefab)
    mjDeskPre: cc.Prefab[] = [];
    @property(cc.Prefab)
    pdkDeskPre: cc.Prefab[] = [];
    @property(cc.Prefab)
    drDeskPre: cc.Prefab[] = [];
    @property(cc.Prefab)
    eqsDeskPre: cc.Prefab[] = [];

    // 桌子 2 套
    @property(cc.Prefab)
    mjDesk2Pre: cc.Prefab[] = [];
    @property(cc.Prefab)
    pdkDesk2Pre: cc.Prefab[] = [];
    @property(cc.Prefab)
    drDesk2Pre: cc.Prefab[] = [];
    @property(cc.Prefab)
    eqsDesk2Pre: cc.Prefab[] = [];

    @property(cc.Prefab)
    dlgSetting: cc.Prefab = null;
    @property(cc.Prefab)
    dlgJbcbm: cc.Prefab = null;
    @property(cc.Prefab)
    dlgJbcSet: cc.Prefab = null;
    @property(cc.Prefab)
    dlgJbcbmsp: cc.Prefab = null;
    @property(cc.Prefab)
    dlg1stJbcOpen: cc.Prefab = null;
    @property(cc.Prefab)
    dlgJbcYindao: cc.Prefab = null;

    @property(cc.Prefab)
    teaWfSetNamePre: cc.Prefab = null;
    teaWfSetNameNode: cc.Node = null;
    teaWfSetName: TeaWfSetName = null;

    @property(cc.Prefab)
    teaChenYuanPre: cc.Prefab = null;
    teaChenYuanNode: cc.Node = null;
    teaChenYuan: TeaChenYuan = null;

    @property(cc.Prefab)
    teaZhanJiPre: cc.Prefab = null;
    teaZhanJiNode: cc.Node = null;
    teaZhanJi: TeaZhanJi = null;

    @property(cc.SpriteAtlas)
    teaAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    teaAtlas1: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    teaDeskAtlas0: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    commnetAtlas0: cc.SpriteAtlas = null;
    //
    // @property(cc.SpriteAtlas)
    // commnetAtlas2: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    teaWfPopPre: cc.Prefab = null;
    teaWfPopPreNode: cc.Node = null;
    teaWfPop: TeaWfPop = null;

    @property(cc.Prefab)
    teaQingPre: cc.Prefab = null;
    teaQingPreNode: cc.Node = null;
    teaQingClass: TeaQingClass = null;

    @property(cc.Prefab)
    teaJrcjPopPre: cc.Prefab = null;
    teaJrcjPopPreNode: cc.Node = null;
    teaJrcj: TeaJrcj = null;

    @property(cc.Prefab)
    teaMorePre: cc.Prefab = null;
    teaMorePreNode: cc.Node = null;
    teaMoreView: TeaMoreClass = null;

    @property(cc.Prefab)
    teaBxxPre: cc.Prefab = null;

    curBtnSpriteNode: cc.Node = null;

    // noticeJf: cc.Node = null;
    noticeCy: cc.Node = null;
    noticeMore: cc.Node = null;

    @property(cc.Prefab)
    teaBottomBtnPre: cc.Prefab = null;

    @property(cc.Prefab)
    teaAearPopPre: cc.Prefab = null;
    teaAearPopPreNode: cc.Node = null;

    @property(cc.Prefab)
    teaAearItemPopPre: cc.Prefab = null;

    @property(cc.Prefab)
    teaHeaderQieHuanPre: cc.Prefab = null;

    @property(cc.Prefab)
    teaQuickStar: cc.Prefab = null;

    // 头像上的标签
    node_Account: cc.Node = null;
    owner_Label: cc.Label = null;
    id_Label: cc.Label = null;
    node_zhuoshu: cc.Node = null;
    // headerImage: cc.Sprite = null;
    // name_Label: cc.Label = null;
    // ka_num_Label: cc.Label = null;
    // Node_FanKa: cc.Node = null;
    bi_num_Label: cc.Label = null;
    Node_jin: cc.Node = null;
    node_QingYou: cc.Node = null;
    owner_Label_two: cc.Label = null;
    id_Label_two: cc.Label = null;


    // @property(ListView)
    // listView: ListView = null;

    private useSecdDesk: Boolean = false;

    private teaAreaDatas: Map<string, TeaAreaModes> = new Map(); //  区域列表
    private teaYaoListDatas: any[] = []; //  邀请列表
    public teaRoomDatas: any[] = [];
    private teaDeskDatas: any[] = [];

    mainScrollView: ScrollViewPlus = null;
    bottomPopScrollView: cc.ScrollView = null;
    bottomScrollView: cc.ScrollView = null;
    bottomView: cc.Node = null;
    btnFanHuiGame: cc.Node = null;
    
    // 切换亲友圈使用
    navScrollView: cc.ScrollView = null;

    // 是否在茶馆大厅
    private curStepTeaHall: boolean = true;
    private curFloor: number = 0;
    private scollerOffsetNum: number = 1;

    // 进入桌子ID
    private inGameRoomId: number = 0;

    public cordonAuth: any = true;

    // 茶馆id
    public teaHouseId: string = null;
    public position: number = 0;
    public teamId: number = 0;
    // 当前圈主ID
    public curOwnerId: number = 0;

    public totalDeskCount: number = 0;

    public applyExitCount: number = 0;
    public applyJoinCount: number = 0;
    public applyGoldMathCount: number = 0;

    goldSetData:Object = {};

    SettingData:Object = {
        //isGoldOpen:Boolean = true; //金币场设置数据

        // string name=2;//茶馆名称
        // string introduce=3;//茶馆简介
        
        // int32  quanzzjOpen=4;//圈子战绩(1 公示战绩 0不公示战绩)
        // int32  cyzjOpen=5;//成员战绩(1 公示战绩 0不公示战绩)
        // int32  cyshOpen=6;//成员审核(1 开 0关)
        // int32  cylbOpen=7;//成员列表(1 全部可见 0不可见)
        // int32  deskFrontOpen=8;//空桌前置(1 开 0关)
        // int32  patternOpen=9;//分配模式(1 AA 2 大赢家)
        // int32  purview=10;//管理权限(1 禁赛 2 踢出 4 审批 8 成员战绩 16 成员积分 32 预创权限)
        // int32  blurred=11;//模糊显示(1 开启 0 关闭)
        // int32  autoExit=12;//自动退出(1 开 0关)

        // int32  forbidKick=13;//禁止踢人(1 开 0关)
        // int32  rankMatch=14;//排名赛(1 开启 0关闭)
        // string  complainForbid=15;//举报禁玩
        // int32  autoClean=16;//自动清人(单位时间:天)
        // string forbidIntegral=17;//禁玩积分
        
        //isDayang:Boolean = false;// 打烊

        //ds_openTime;//定时开始时间(小时:分钟)
        //ds_closeTime//定时关闭时间(小时:分钟)
        //ds_timerOpen//定时开启开关(1 开 0 关闭)
        //ds_timerClosed//定时关闭开关(1 开 0 关闭)
    };

    public goldChangCB: Object={};

    public doResetDeskType(needReload) {
        // @ts-ignore
        let deskType = cc.g.utils.getDeskTypeIndex()
        let nodeLayout = this.mainScrollView.content.getComponent(cc.Layout)
        if (deskType == 2) {
            this.useSecdDesk = true
            nodeLayout.spacingY = 100
            nodeLayout.paddingTop = 60
        } else {
            this.useSecdDesk = false
            nodeLayout.spacingY = 60
            nodeLayout.paddingTop = 50
        }
        nodeLayout.updateLayout();
        if (needReload) {
            this.getTeaHouseDatas()
        }
    }

    onLoad () {
        TeaClass.instance = this;

        // @ts-ignore
        cc.g._tea_ = this;
        // @ts-ignore
        cc.g.audioMgr.playBGM('public/bg_game.mp3');
        
        // @ts-ignore
        this.teaHouseId = cc.g.utils.getLocalStorage('teaHouseId');

        this.initView()

        this.doResetDeskType(false)

        // this.initPres()
        this.getTeaHouseDatas()

        // @ts-ignore
        cc.g.utils.stopScreenshotListen();



        // this.scheduleOnce(()=>{
        //     this.initListView();
        //
        // }, 1.2);
    }

    // initListView() {
    //     // 可以是其他的复杂对象数据.这里为了演示,仅使用数字数据.
    //     let data: number[] = [];
    //     for (let i = 0; i < 100; i++) {
    //         data.push(i+1);
    //     }
    //
    //     const adapter = new ListAdapter()
    //     adapter.setDataSet(data);
    //     this.listView.setAdapter(adapter);
    //
    //     // // 可选功能.
    //     // this.listView.pullDown(() => {
    //     //     console.log("你已经上拉到最顶端了.");
    //     //     // this.tipLabel.string = "你已经上拉到最顶端了.";
    //     // }, this);
    //     // this.listView.pullUp(() => {
    //     //     console.log("你已经下拉到最底端了.");
    //     //     // this.tipLabel.string = "你已经下拉到最底端了";
    //     // }, this);
    // }

    doReconnectData() {
        if (this.mainScrollView == null) {
            cc.error('没有茶馆场景...')
            return;
        }
        this.getTeaHouseDatas()
    }

    start () {
        this.registNOTIFY();
    }

    tryPopGoldTipDlg () {
        cc.dlog('tryPopGoldTipDlg 需求强制跳过');

        return

        if (this.position!=71) return;

        if (!this.goldSetData['goldMatchAuth']) return;

        // @ts-ignore
        let hadpop = cc.sys.localStorage.getItem('hadpop');
        if (hadpop=='1') return;

        // @ts-ignore
        let dlg = cc.instantiate(this.dlg1stJbcOpen);
        // @ts-ignore
        this.node.addChild(dlg);

        // @ts-ignore
        cc.sys.localStorage.setItem('hadpop', 1);
    }


    doShowNoticeCy(show) {
        this.noticeCy.active = show
    }

    doShowNoticeMore(show) {
        // this.noticeJf.active = show
    }

    initView() {
        cc.log('initView');

        // 茶馆背景
        {
            // @ts-ignore
            let BGIdx = cc.sys.localStorage.getItem('teaBGIdx');

            BGIdx = parseInt(BGIdx)-1;

            if (this.teabg[BGIdx]) {
                // @ts-ignore
                let bg = cc.find("New Sprite", this.node).getComponent(cc.Sprite);
                bg.spriteFrame = this.teabg[BGIdx];
            }
        }
        

        this.mainScrollView = cc.find("Node_Center/ScrollView_Content", this.node).getComponent(ScrollViewPlus);

        this.btnFanHuiGame = cc.find("Node_Top/Node_Buttons/Button_Fhzz", this.node)

        this.noticeMore = cc.find("Node_Top/Node_Buttons/Button_More/Sprite_Notice", this.node)
        this.noticeMore.active = false

        this.noticeCy = cc.find("Node_Top/Node_Buttons/Button_Cy/Sprite_Notice", this.node)
        this.noticeCy.active = false
        this.noticeMore = cc.find("Node_Top/Node_Buttons/Button_More/Sprite_Notice", this.node)
        this.noticeMore.active = false
        
        // minpro
        let emptyButton = cc.find("Node_Top/Node_Buttons/EmptyButton", this.node)
        // @ts-ignore
        emptyButton.active = cc.g.utils.getWeChatOs()

        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(cc.g.hallMgr.backToClubIfo)) {
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(cc.g.hallMgr.backToClubIfo.inGameRoomId)) {
                this.btnFanHuiGame.active = true;
            } else {
                this.btnFanHuiGame.active = false;
            }
        } else {
            this.btnFanHuiGame.active = false;
        }

        // 监听滑动
        // this.mainScrollView.node.on('scrolling', this.onScrollingEvent, this);
        // this.mainScrollView.node.on('scroll-began', this.onScrollBeganEvent, this);
        // this.mainScrollView.node.on('scroll-to-top', this.onScrollTopEvent, this);
        // scroll-to-right 注意：此事件是从
        // this.mainScrollView.node.on('scroll-to-bottom', this.onScrollBottomEvent, this);
        this.mainScrollView.node.on('scroll-to-right', this.onScrollBottomEvent, this);
        this.bottomView = cc.find("Node_btmbtns/Node_Bottom", this.node)
        this.bottomScrollView = cc.find("Node_btmbtns/Node_Bottom/ScrollView_Area", this.node).getComponent(cc.ScrollView);

        this.node_Account = cc.find("Node_Top/Node_Account", this.node);
        this.node_Account.active = true;
        this.owner_Label = cc.find("Name_Label", this.node_Account).getComponent(cc.Label);
        this.id_Label = cc.find("ID_Label",this. node_Account).getComponent(cc.Label);
        this.node_zhuoshu = cc.find("Sprite_zhuoshu", this.node_Account);
        this.node_zhuoshu['num'] = cc.find("Sprite_zhuoshu/num",this. node_Account).getComponent(cc.Label);
        this.node_zhuoshu.active = false;

        // let node_Header = cc.find("Node_Top/Node_Header", this.node)
        // // 头像
        // this.headerImage = cc.find("Sprite_Header_Image", node_Header).getComponent(cc.Sprite);
        // this.name_Label = cc.find("Name_Header_Label", node_Header).getComponent(cc.Label)

        // let node_Fang = cc.find("Node_Top/NumMony_Layout/Node_Fang", this.node)
        // this.ka_num_Label = cc.find("Fang_KaLabel", node_Fang).getComponent(cc.Label)
        // this.Node_FanKa = node_Fang

        let node_Bi = cc.find("Node_Top/NumMony_Layout/Node_jin", this.node)
        this.bi_num_Label = cc.find("jin_Label", node_Bi).getComponent(cc.Label)
        this.Node_jin = node_Bi;

        this.node_QingYou = cc.find("Node_Top/Node_QingYou", this.node)
        this.node_QingYou.active = false;
        this.owner_Label_two = cc.find("Node_Account/Name_Label", this.node_QingYou).getComponent(cc.Label);
        this.id_Label_two = cc.find("Node_Account/ID_Label",this.node_QingYou).getComponent(cc.Label);
        this.navScrollView = cc.find("ScrollView_List", this.node_QingYou).getComponent(cc.ScrollView);
    }
    checkCallBackHf() {

        // 显示战绩
        let clickedZj = cc.sys.localStorage.getItem("ClickedZjVideo");

        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(clickedZj)) {
            this.doShowTeaZhanJiDialog();
        }
    }
    getTeaChenYuanNode() {
        // 成员
        if (this.teaChenYuanNode == null) {
            this.teaChenYuanNode = cc.instantiate(this.teaChenYuanPre);
            // this.teaChenYuanNode.active = false;
            // this.teaChenYuan = this.teaChenYuanNode.getComponent('tea_chengyuan')
            this.node.addChild(this.teaChenYuanNode);
        }

        return this.teaChenYuanNode;
    }

    getTeaChenYuan() {
        // 成员
        if (this.teaChenYuan == null) {
            this.teaChenYuan = this.getTeaChenYuanNode().getComponent('tea_chengyuan');
        }

        return this.teaChenYuan;
    }

    getTeaZhanJiNode() {
        if (this.teaZhanJiNode == null) {
            this.teaZhanJiNode = cc.instantiate(this.teaZhanJiPre);
            this.node.addChild(this.teaZhanJiNode);
        }
        return this.teaZhanJiNode;
    }

    getTeaZhanJi() {
        if (this.teaZhanJi == null) {
            this.teaZhanJi = this.getTeaZhanJiNode().getComponent('tea_zhanji');
        }
        return this.teaZhanJi;
    }

    getTeaJrcjPopPreNode() {
        if (this.teaJrcjPopPreNode == null) {
            this.teaJrcjPopPreNode = cc.instantiate(this.teaJrcjPopPre);
            this.node.addChild(this.teaJrcjPopPreNode);
        }
        return this.teaJrcjPopPreNode;
    }

    getTeaJrcj() {
        if (this.teaJrcj == null) {
            this.teaJrcj = this.getTeaJrcjPopPreNode().getComponent('tea_jrcj');
        }
        return this.teaJrcj;
    }

    getTeaWfPopPreNode() {
        if (this.teaWfPopPreNode == null) {
            this.teaWfPopPreNode = cc.instantiate(this.teaWfPopPre);
            this.node.addChild(this.teaWfPopPreNode);
        }
        return this.teaWfPopPreNode;
    }

    getTeaWfPop() {
        if (this.teaWfPop == null) {
            this.teaWfPop = this.getTeaWfPopPreNode().getComponent('tea_wf_pop');
            this.teaWfPop.initViews();
            // 设置数据
            this.teaWfPop.setWanFaObj({
                floor:0,
                clubId:this.teaHouseId,//茶馆ID
                openGold:this.SettingData['isGoldOpen'],//是否开放金币场
                teaHouseId:this.teaHouseId,
                origin:2,//地区
            });
        }
        return this.teaWfPop;
    }

    getTeaQingPreNode() {
        if (this.teaQingPreNode == null) {
            this.teaQingPreNode = cc.instantiate(this.teaQingPre);
            this.node.addChild(this.teaQingPreNode);
        }
        return this.teaQingPreNode;
    }

    getTeaMorePreNode() {
        if (this.teaMorePreNode == null) {
            this.teaMorePreNode = cc.instantiate(this.teaMorePre);
            this.node.addChild(this.teaMorePreNode);
        }
        return this.teaMorePreNode;
    }

    getTeaMoreView() {
        if (this.teaMoreView == null) {
            this.teaMoreView = this.getTeaMorePreNode().getComponent('tea_geng_duo');
        }
        return this.teaMoreView;
    }

    getTeaAearPopPreNode() {
        if (this.teaAearPopPreNode == null) {
            this.teaAearPopPreNode = cc.instantiate(this.teaAearPopPre);
            this.node.addChild(this.teaAearPopPreNode);
            // add event
            let tyBtn = cc.find("bg_btn", this.teaAearPopPreNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, this, 'tea', 'hiddenAreaPop', "");
        }
        return this.teaAearPopPreNode;
    }

    getBottomPopScrollView() {
        if (this.bottomPopScrollView == null) {
            this.bottomPopScrollView = cc.find("Node_Area_List/ScrollView_Area_List", this.getTeaAearPopPreNode()).getComponent(cc.ScrollView);
        }
        return this.bottomPopScrollView;
    }


    getTeaWfSetNameNode() {
        if (this.teaWfSetNameNode == null) {
            this.teaWfSetNameNode = cc.instantiate(this.teaWfSetNamePre);
            this.node.addChild(this.teaWfSetNameNode);
        }
        return this.teaWfSetNameNode;
    }

    getTeaWfSetName() {
        if (this.teaWfSetName == null) {
            this.teaWfSetName = this.getTeaWfSetNameNode().getComponent('tea_tjwf_shurukang')
        }
        return this.teaWfSetName;
    }

    initPres() {
        // // 创建亲友圈
        // if (this.teaWfPopPreNode == null) {
        //     this.teaWfPopPreNode = cc.instantiate(this.teaWfPopPre);
        //     this.teaWfPopPreNode.active = false;
        //     this.node.addChild(this.teaWfPopPreNode);
        //     this.teaWfPop = this.teaWfPopPreNode.getComponent('tea_wf_pop');
        //     this.teaWfPop.initViews();
        //     // 设置数据
        //     this.teaWfPop.setWanFaObj({
        //         floor:0,
        //         clubId:this.teaHouseId,//茶馆ID
        //         openGold:this.SettingData['isGoldOpen'],//是否开放金币场
        //         teaHouseId:this.teaHouseId,
        //         origin:2,//地区
        //     });
        // }

        // // 创建邀请
        // if (this.teaQingPreNode == null) {
        //     this.teaQingPreNode = cc.instantiate(this.teaQingPre);
        //     this.teaQingPreNode.active = false;
        //     this.node.addChild(this.teaQingPreNode);
        //     // this.teaQingClass = this.teaQingPreNode.getComponent('tea_qing')
        //     // //  设置数据
        //     // this.teaWfPop.setWanFaObj({
        //     //     floor:0,
        //     //     teaHouseId:this.teaHouseId
        //     // });
        // }

        // // 创建更多
        // if (this.teaMorePreNode == null) {
        //     this.teaMorePreNode = cc.instantiate(this.teaMorePre);
        //     this.teaMorePreNode.active = false;
        //     this.teaMoreView = this.teaMorePreNode.getComponent('tea_geng_duo')
        //     this.node.addChild(this.teaMorePreNode);
        //
        //     // this.teaQingClass = this.teaQingPreNode.getComponent('tea_qing')
        //     // //  设置数据
        //     // this.teaWfPop.setWanFaObj({
        //     //     floor:0,
        //     //     teaHouseId:this.teaHouseId
        //     // });
        // }

        // // 创建更多
        // if (this.teaAearPopPreNode == null) {
        //     this.teaAearPopPreNode = cc.instantiate(this.teaAearPopPre);
        //     this.teaAearPopPreNode.active = false;
        //     this.node.addChild(this.teaAearPopPreNode);
        //
        //     let tyBtn = cc.find("bg_btn", this.teaAearPopPreNode).getComponent(cc.Button);
        //     // @ts-ignore
        //     cc.g.utils.addClickEvent(tyBtn, this, 'tea', 'hiddenAreaPop', "");
        //
        //     this.bottomPopScrollView = cc.find("Node_Area_List/ScrollView_Area_List", this.teaAearPopPreNode).getComponent(cc.ScrollView);
        // }

        // // 修改名字
        // if (this.teaWfSetNameNode == null) {
        //     this.teaWfSetNameNode = cc.instantiate(this.teaWfSetNamePre);
        //     this.teaWfSetNameNode.active = false;
        //     this.teaWfSetName = this.teaWfSetNameNode.getComponent('tea_tjwf_shurukang')
        //     this.node.addChild(this.teaWfSetNameNode);
        // }

        // // 成员
        // if (this.teaChenYuanNode == null) {
        //     this.teaChenYuanNode = cc.instantiate(this.teaChenYuanPre);
        //     this.teaChenYuanNode.active = false;
        //     this.teaChenYuan = this.teaChenYuanNode.getComponent('tea_chengyuan')
        //     // this.teaChenYuan.initParams(this.teaHouseId)
        //     this.node.addChild(this.teaChenYuanNode);
        // }

        // // 成员
        // if (this.teaZhanJiNode == null) {
        //     this.teaZhanJiNode = cc.instantiate(this.teaZhanJiPre);
        //     this.teaZhanJiNode.active = false;
        //     this.teaZhanJi = this.teaZhanJiNode.getComponent('tea_zhanji')
        //     this.node.addChild(this.teaZhanJiNode);
        //     // this.teaZhanJiNode.active = false;
        // }

        // if (this.teaJrcjPopPreNode == null) {
        //     this.teaJrcjPopPreNode = cc.instantiate(this.teaJrcjPopPre);
        //     this.teaJrcjPopPreNode.active = true;
        //     this.teaJrcj = this.teaJrcjPopPreNode.getComponent('tea_jrcj')
        //     this.node.addChild(this.teaJrcjPopPreNode);
        //     this.teaJrcjPopPreNode.active = false;
        // }
    }

    hiddenAreaPop() {
        this.getTeaAearPopPreNode().active = false;
        if (this.curBtnSpriteNode != null) {

            let btnSprt = cc.find("Sprite_Bg", this.curBtnSpriteNode)
            btnSprt.active = false

            let label = cc.find("Background/Label", this.curBtnSpriteNode)
            label.color = new cc.Color(255, 255, 255);

            this.curBtnSpriteNode = null
        }
    }

    // onScrollingEvent(event) {
    //     let self = this;
    //     let offsetX = self.mainScrollView.getComponent(cc.ScrollView).getScrollOffset().x;
    //     let offsetY = self.mainScrollView.getComponent(cc.ScrollView).getContentPosition().x;
    //     let offsetMaxY = self.mainScrollView.getComponent(cc.ScrollView).getMaxScrollOffset().x;
    //     cc.dlog('offsetX--->', offsetX)
    //     cc.dlog('offsetY--->', offsetY)
    //     cc.dlog('offsetMaxY--->', offsetMaxY)
    // }

    onScrollBottomEvent(event) {
        let self = this;
        // let offsetX = self.mainScrollView.getComponent(cc.ScrollView).getScrollOffset().x;
        // let offsetY = self.mainScrollView.getComponent(cc.ScrollView).getScrollOffset().y;
        // cc.dlog('活动到底部--->', offsetX)
        // cc.dlog('活动到底部--->', offsetY)
        cc.dlog('获取下一页数据....')
        if (this.curStepTeaHall) {
            // 获取桌子
            self.getTeaHouseDeskDatas();
        } else {
            self.getTeaHouseDeskDatasSec(self.curFloor)
        }
    }

    showOrHidenAreaBar() {
        this.bottomView.active = !this.bottomView.active
    }

    packageAreaDatas(deskName: string, item: any) {
        // 封装地区数据
        let mteaAreaDatas = this.teaAreaDatas.get(deskName);

        let mTeaAreaModesItem = new TeaAreaModesItem();
        mTeaAreaModesItem.floor = item.floor
        mTeaAreaModesItem.name = item.name
        mTeaAreaModesItem.gameType = item.gameType
        mTeaAreaModesItem.playNum = item.playNum
        mTeaAreaModesItem.origin = item.origin

        // @ts-ignore
        if (cc.g.utils.judgeObjectEmpty(mteaAreaDatas)) {
            let teaAreaModes = new TeaAreaModes();
            teaAreaModes.nameList.push(mTeaAreaModesItem)
            this.teaAreaDatas.set(deskName, teaAreaModes)
        } else {
            mteaAreaDatas.nameList.push(mTeaAreaModesItem)
        }
    }

    changeAreaDatas(deskName: string, item: any) {
        // 封装地区数据
        let mteaAreaDatas = this.teaAreaDatas.get(deskName);

        let mTeaAreaModesItem = new TeaAreaModesItem();
        mTeaAreaModesItem.floor = item.floor
        mTeaAreaModesItem.name = item.name
        mTeaAreaModesItem.gameType = item.gameType
        mTeaAreaModesItem.playNum = item.playNum
        mTeaAreaModesItem.origin = item.origin

        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(mteaAreaDatas)) {
            // @ts-ignore
            let nameList = mteaAreaDatas.nameList
            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(nameList)) {
                for (let i = 0; i < nameList.length; i++) {
                    let mTeaAreaModesItem = nameList[i];
                    if (mTeaAreaModesItem.floor == item.floor) {
                        mTeaAreaModesItem.name = item.name
                        break
                    }
                }
            }
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaAreaDatas)) {
            this.createTeaBottomPopDatas();
        }
    }

    createTeaBottomPopDatas() {
        this.bottomScrollView.content.removeAllChildren(true);
        // 显示数据
        this.teaAreaDatas.forEach((teaAreaModes, key) => {
            let cardNode = cc.instantiate(this.teaBottomBtnPre);

            let tyBtn = cc.find("Button_Area", cardNode).getComponent(cc.Button);
            let label = cc.find("Background/Label", tyBtn.node)
            label.getComponent(cc.Label).string=key

            let btnSprt = cc.find("Sprite_Bg", tyBtn.node)
            btnSprt.active = false;

            // tyBtn.node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string=key
            //.getComponent(cc.Sprite);
            // let btnSprt = cc.find("Sprite_Bg", cardNode)
            // btnSprt.active = false;

            // @ts-ignore
            cc.g.utils.removeClickAllEvent(tyBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, this, 'tea', 'bottomPopBtnClicked', teaAreaModes);
            // add
            this.bottomScrollView.content.addChild(cardNode, 0);
        })
    }

    bottomPopBtnClicked(event, teaAreaModes:TeaAreaModes) {
        cc.dlog('bottomPopBtnClicked.....')
        if (this.getTeaAearPopPreNode().active) {
            this.getTeaAearPopPreNode().active = false;
            if (this.curBtnSpriteNode != null) {
                let btnSprt = cc.find("Sprite_Bg", this.curBtnSpriteNode)
                btnSprt.active = false

                let label = cc.find("Background/Label", this.curBtnSpriteNode)
                label.color = new cc.Color(255, 255, 255);

                this.curBtnSpriteNode = null
            }
        } else {
            this.getBottomPopScrollView().content.removeAllChildren(true);
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(teaAreaModes.nameList)) {
                let tyBtn = event.getCurrentTarget()
                this.curBtnSpriteNode = tyBtn;
                this.getTeaAearPopPreNode().active = true;
                let btnSprt = cc.find("Sprite_Bg", tyBtn)
                btnSprt.active = true

                let label = cc.find("Background/Label", tyBtn)
                label.color = new cc.Color(132, 68, 17);

                teaAreaModes.nameList.forEach((item) => {

                    let cardNode = cc.instantiate(this.teaAearItemPopPre);

                    let tyBtn = cc.find("Button_Cell_Item", cardNode).getComponent(cc.Button);
                    tyBtn.node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = item.name

                    // @ts-ignore
                    cc.g.utils.addClickEvent(tyBtn, this, 'tea', 'clickPopItem', item);
                    // add
                    this.getBottomPopScrollView().content.addChild(cardNode, 0);
                })

                // 转化坐标显示
                let tg = event.getCurrentTarget();
                let wp = tg.convertToWorldSpaceAR(cc.v2(0, 0));
                let uNp = this.getTeaAearPopPreNode().parent.convertToNodeSpaceAR(wp);
                cc.dlog('uNp=x=>', uNp.x)
                cc.dlog('uNp=y=>', uNp.y)
                this.getTeaAearPopPreNode().setPosition(uNp.x, uNp.y);
            }
        }
    }

    clickPopItem(event, item: TeaAreaModesItem) {
        cc.dlog('clickPopItem...', JSON.stringify(item))
        cc.dlog('clickPopItem...', item.floor)

        this.hiddenAreaPop();

        this.curStepTeaHall = false;
        this.curFloor = item.floor

        let parms = {
            curStepTeaHall:this.curStepTeaHall,
            curFloor:this.curFloor
        }

        // @ts-ignore
        cc.g.utils.setLocalStorage('TEA_SEC', parms)

        // // 显示桌子
        // this.doPackageDestDatas(item.gameType, item.playNum, item.floor, item.gameNum, item.origin, item.name);
        //
        // // 获取数据
        // this.getTeaHouseDeskByFloorDatas(item.floor)

        this.doRealGoNextBaoJian(item.floor);
    }

    doRealGoNextBaoJian(floor: number) {
        this.teaDeskDatas = []
        this.mainScrollView.content.removeAllChildren(true);
        this.getTeaHouseDeskDatasSec(floor)
    }

    getTeaHouseDeskDatasSec(floor: number) {
        const self = this;

        let realSearchIndex;
        // @ts-ignore
        if (cc.g.utils.judgeArrayEmpty(this.teaDeskDatas)) {
            realSearchIndex = 0;
        } else {
            realSearchIndex = this.teaDeskDatas.length
        }

        cc.dlog('获取桌子数据..realSearchIndex..', realSearchIndex)

        // @ts-ignore
        cc.g.hallMgr.searchTeaHouseSecDesk(this.teaHouseId, floor, realSearchIndex, (resp)=>{
            cc.dlog('searchTeaHouseSecDesk', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                let teaDatas = resp.deskList;
                let rule = resp.rule
                // @ts-ignore
                if ((realSearchIndex == 0) && (!cc.g.utils.judgeObjectEmpty(rule))) {
                    self.teaDeskDatas.push(rule)
                    self.renderTeaRoomViewSec(rule, true)
                }
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    // 合并数据
                    self.teaDeskDatas = self.teaDeskDatas.concat(teaDatas)
                }

                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    self.doCreateDeskWithArr(teaDatas);
                    // self.mainScrollView.optDc();
                    // self.mainScrollView.scrollTo(cc.v2(self.autoScollerPreLitte(), 0), 0.1, true);
                }
            }
        });
    }

    renderTeaRoomView(item: any, refreshDesk: boolean) {
        let gameType = item.gameType
        let cardNode = null;
        let playNum = item.playNum
        // @ts-ignore
        if ((gameType == GMID.XZMJ) || (gameType == GMID.XZMJER) ||(gameType == GMID.YJMJ) || (gameType == GMID.HZMJ) || (gameType == GMID.YBMJ) || (gameType == GMID.NYMJ) || (gameType == GMID.LZMJ) || (gameType == GMID.NJMJ|| (gameType == GMID.LCMJ) || (gameType == GMID.GXMJ)) {
            // deskName = '血战麻将';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.mjDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.mjDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if ((gameType == GMID.PDKNJ) || (gameType == GMID.PDKLS) || (gameType == GMID.PDKTY) || (gameType == GMID.PDK) || (gameType == GMID.PDKGX) || (gameType == GMID.PDKGAOX) || (gameType == GMID.PDKLC)) {
            // deskName = '内江跑得快';
            // 跑得快 人数范围
            // 37   2~4
            // 38   2~4
            // 39   2~7
            // 40   2~7
            // 41   2
            // 42   2~3
            // 43   2~4
            if (playNum > 20) {
                if (playNum == 37 || playNum == 38 || playNum == 43) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                } else if (playNum == 39 || playNum == 40) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[5]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[5]);
                    }
                } else if (playNum == 41) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[0]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[0]);
                    }
                } else if (playNum == 42) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }
                } else if (playNum == 44) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }
                } else if (playNum == 45) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                }
            } else {
                let preIndex = playNum - 2;
                if (this.useSecdDesk) {
                    cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
                } else {
                    cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
                }
            }
            // @ts-ignore
        } else if (gameType == GMID.DDZ5) {
            // deskName = '斗地主';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if (gameType == GMID.D2) {
            // deskName = '大贰';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.drDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.drDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if (gameType == GMID.EQS) {
            // deskName = '270';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.eqsDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.eqsDeskPre[preIndex]);
            }
        }

        // @ts-ignore
        let deskName = cc.g.utils.getGameName(gameType, item.origin);
        item.deskName = deskName;

        // // 人数
        // let playNum = item.playNum
        //
        // // 桌子
        // let spriteDsk = cc.find("Sprite_dsk", cardNode).getComponent(cc.Sprite);
        // if (cardType == 1) { // 麻将
        //     if ((playNum >= 2 && playNum <= 4)) {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('mj' + playNum);
        //     } else {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('mj4');
        //     }
        // } else if (cardType == 2) { // 跑得快
        //
        //     // 跑得快 人数范围
        //     // 37    2~4
        //     // 38    2~4
        //     // 39    2~7
        //     // 40    2~7
        //     // 41    2
        //     // 42    2~3
        //     // 43    2~4
        //     if (playNum > 20) {
        //         if (playNum == 37 || playNum == 38 || playNum == 43) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk4');
        //         } else if (playNum == 39 || playNum == 40) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk7');
        //         } else if (playNum == 41) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk2');
        //         } else if (playNum == 42) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk3');
        //         } else if (playNum == 44) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk3');
        //         } else if (playNum == 45) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk4');
        //         }
        //     } else {
        //         if ((playNum >= 2 && playNum <= 7)) {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk' + playNum);
        //         } else {
        //             spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk7');
        //         }
        //     }
        //
        // } else if (cardType == 3) { // 斗地主
        //     if ((playNum >= 2 && playNum <= 5)) {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk' + playNum);
        //     } else {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('pdk5');
        //     }
        // } else if (cardType == 4) { // 大贰
        //     if ((playNum >= 2 && playNum <= 4)) {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('daer' + playNum);
        //     } else {
        //         spriteDsk.spriteFrame = this.teaDeskAtlas0.getSpriteFrame('daer4');
        //     }
        // }

        // 封装地区数据
        this.packageAreaDatas(deskName, item);

        // 显示玩法UI
        // this.teaWfPop.showUiDatas(item);
        // 桌子
        //let spriteDsk = cc.find("Sprite_dsk", cardNode).getComponent(cc.Sprite);
        // 桌子名字
        let deskNameLabel = cc.find("Label_Name", cardNode).getComponent(cc.Label);
        deskNameLabel.string = deskName
        // 局数
        let jueNum = cc.find("Sprite_nmbg/Label_bjname", cardNode).getComponent(cc.Label);
        // @ts-ignore
        if (gameType == GMID.EQS) {
            jueNum.string =  '圈' + item.gameNum
        } else {
            jueNum.string = item.gameNum + '局'
        }

        // 气泡
        // let qiPaoNode = cc.find("Sprite_Pop_Bg", cardNode)
        // 气泡名字
        let qiPaoName = cc.find("Sprite_Pop_Bg/Sprite_Pop_Name", cardNode).getComponent(cc.Label);
        // @ts-ignore
        qiPaoName.string = cc.g.utils.getFormatName(item.name, 7*2);

        // 用户名字Node
        let personNode = cc.find("Node_desk", cardNode)
        personNode.active = false;

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cardNode);
        // @ts-ignore
        cc.g.utils.addClickEvent(cardNode, this, 'tea', 'enterTeaHall', item);
        // add
        this.mainScrollView.content.addChild(cardNode, 0, "tearoom" + item.floor);

        if (refreshDesk) {
            // 在创建好子节点之后，先手动调用一次DC优化，触发当前在可视区域内的节点的进入逻辑
            // 后续的ScrollView滚动时，内部自动回调
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }
    }

    renderTeaRoomViewSec(item: any, refreshDesk:boolean) {
        let gameType = item.gameType
        let cardNode = null;
        let playNum = item.playNum
        // @ts-ignore
        if ((gameType == GMID.XZMJ) || (gameType == GMID.YJMJ) || (gameType == GMID.XZMJER) || (gameType == GMID.HZMJ) || (gameType == GMID.YBMJ) || (gameType == GMID.NYMJ) || (gameType == GMID.LZMJ) || (gameType == GMID.NJMJ) || (gameType == GMID.LCMJ) || (gameType == GMID.GXMJ)) {
            // deskName = '血战麻将';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.mjDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.mjDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if ((gameType == GMID.PDKNJ) || (gameType == GMID.PDKLS) || (gameType == GMID.PDKTY) || (gameType == GMID.PDK) || (gameType == GMID.PDKGX) || (gameType == GMID.PDKGAOX) || (gameType == GMID.PDKLC)) {
            // deskName = '内江跑得快';
            // 跑得快 人数范围
            // 37   2~4
            // 38   2~4
            // 39   2~7
            // 40   2~7
            // 41   2
            // 42   2~3
            // 43   2~4
            if (playNum > 20) {
                if (playNum == 37 || playNum == 38 || playNum == 43) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                } else if (playNum == 39 || playNum == 40) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[5]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[5]);
                    }
                } else if (playNum == 41) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[0]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[0]);
                    }
                } else if (playNum == 42) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }
                } else if (playNum == 44) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }
                } else if (playNum == 45) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                }
            } else {
                let preIndex = playNum - 2;
                if (this.useSecdDesk) {
                    cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
                } else {
                    cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
                }
            }
            // @ts-ignore
        } else if (gameType == GMID.DDZ5) {
            // deskName = '斗地主';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if (gameType == GMID.D2) {
            // deskName = '大贰';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.drDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.drDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if (gameType == GMID.EQS) {
            // deskName = '270';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.eqsDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.eqsDeskPre[preIndex]);
            }
        }

        // @ts-ignore
        let deskName = cc.g.utils.getGameName(gameType, item.origin);
        item.deskName = deskName;


        // // 封装地区数据
        // this.packageAreaDatas(deskName, item);

        // 显示玩法UI
        // this.teaWfPop.showUiDatas(item);
        // 桌子
        //let spriteDsk = cc.find("Sprite_dsk", cardNode).getComponent(cc.Sprite);
        // 桌子名字
        let deskNameLabel = cc.find("Label_Name", cardNode).getComponent(cc.Label);
        deskNameLabel.string = deskName
        // 局数
        let jueNum = cc.find("Sprite_nmbg/Label_bjname", cardNode).getComponent(cc.Label);
        // @ts-ignore
        if (gameType == GMID.EQS) {
            jueNum.string =  '圈' + item.gameNum
        } else {
            jueNum.string = item.gameNum + '局'
        }

        // 气泡
        // let qiPaoNode = cc.find("Sprite_Pop_Bg", cardNode)
        // 气泡名字
        let qiPaoName = cc.find("Sprite_Pop_Bg/Sprite_Pop_Name", cardNode).getComponent(cc.Label);
        // @ts-ignore
        qiPaoName.string = cc.g.utils.getFormatName(item.name, 7*2);

        // 用户名字Node
        let personNode = cc.find("Node_desk", cardNode)
        personNode.active = false;

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cardNode);
        // @ts-ignore
        cc.g.utils.addClickEvent(cardNode, this, 'tea', 'enterTeaHall', item);
        // add
        this.mainScrollView.content.addChild(cardNode, 0, "tearoom" + item.floor);

        if (refreshDesk) {
            // 在创建好子节点之后，先手动调用一次DC优化，触发当前在可视区域内的节点的进入逻辑
            // 后续的ScrollView滚动时，内部自动回调
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }
    }

    doClearDeskViews() {
        this.teaRoomDatas = []
        this.teaDeskDatas = []
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaAreaDatas)) {
            this.teaAreaDatas.clear();
        }

        this.mainScrollView.content.removeAllChildren(true);
        this.navScrollView.content.removeAllChildren(true);
        this.bottomScrollView.content.removeAllChildren(true);

        this.applyExitCount = 0;
        this.applyJoinCount = 0;
        this.applyGoldMathCount = 0;

        this.doShowNoticeCy(false)
        // this.doShowNoticeMore(false)

        // this.getTeaChenYuan().doShowNoticeThree(false)
        // this.getTeaChenYuan().doShowNoticeFour(false)

        // TeaClass.instance.doShowNoticeMore(false)
        // if (TeaMoreClass.instance != null) {
        //     TeaMoreClass.instance.doShowNotice(false)
        // }
        // if (TeaBmsp.instance != null) {
        //     TeaBmsp.instance.showNoticeSprite(false)
        // }
    }

    autoScollerPreLitte() {
        let offsetX = this.mainScrollView.getScrollOffset().x;
        // cc.dlog('offsetX-->' + offsetX)
        let offsetMaxY = this.mainScrollView.getMaxScrollOffset().x;
        // cc.dlog('offsetMaxY-->' + offsetMaxY)
        if (offsetMaxY <= 0) {
            return 0
        }

        offsetX += 2
        if (offsetX >= 0) {
            offsetX = -1
        }

        let per = Math.abs(offsetX/offsetMaxY)

        // cc.dlog('per-->' + per)

        return per
    }

    createTeaViewWithDatas() {
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaRoomDatas)) {
            // 显示数据
            this.teaRoomDatas.forEach((item) => {
                this.renderTeaRoomView(item, false)
            })
            // 在创建好子节点之后，先手动调用一次DC优化，触发当前在可视区域内的节点的进入逻辑
            // 后续的ScrollView滚动时，内部自动回调
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaAreaDatas)) {
           this.createTeaBottomPopDatas();
        }
    }

    addTeaNoticeDatas(item: any) {
        this.renderTeaRoomView(item, true)
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaAreaDatas)) {
            this.createTeaBottomPopDatas();
        }
    }


    updateTeaNameDatas(item) {
        if (item.teaHouseId == this.teaHouseId) {
            let curTeaRoom = null;
            for (let i = 0; i < this.teaRoomDatas.length; i++) {
                let saveRoom = this.teaRoomDatas[i]
                if (saveRoom.floor == item.floor) {
                    saveRoom.name = item.name
                    curTeaRoom = saveRoom
                    this.changeAreaDatas(curTeaRoom.deskName, item)
                    break
                }
            }

            // 修改茶馆
            let cardNode = this.mainScrollView.content.getChildByName("tearoom" + curTeaRoom.floor)
            let qiPaoName = cc.find("Sprite_Pop_Bg/Sprite_Pop_Name", cardNode).getComponent(cc.Label);
            // @ts-ignore
            qiPaoName.string = cc.g.utils.getFormatName(item.name, 7*2);
            //  修改列表
            //this.teaWfPop.doChangeNameWithDatas(item)
        }
    }

    doPackageDestDatas(gameType: number, playNum: number, floor: number, gameNum: number, origin: number, name:string) {
        this.teaDeskDatas = []
        for (let i = 0; i < 20; i++) {
            let deskObj = {
                deskNo: (i + 1),
                gameType: gameType,
                playNum: playNum,
                floor: floor,
                totalNum: gameNum,
                name: name,
                origin: origin,
            }
            this.teaDeskDatas.push(deskObj)
        }

        this.createDeskViewWithDatas(true);

        // cc.dlog('this.teaDeskDatas...', this.teaDeskDatas.length)
        // let ss = this.mainScrollView.content;
    }

    createDeskViewWithDatas(removeAll: boolean) {

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaDeskDatas)) {
            if (removeAll) {
                this.mainScrollView.content.removeAllChildren(true);
                this.curStepTeaHall = false;
            }
            // // 显示数据
            // this.teaDeskDatas.forEach((item) => {
            //     this.createPlayerDeskByItem(item)
            // })

            this.doCreateDeskWithArr(this.teaDeskDatas);
            // 显示UI
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }
    }

    doCreateDeskWithArr(teaDeskDatas) {
        // 显示数据
        teaDeskDatas.forEach((item) => {
            this.createPlayerDeskByItem(item, false)
        })
    }

    getPlayerNum(playNum) {
        let num = playNum
        if (playNum > 20) {
            // 跑得快 人数范围
            // 37   2~4
            // 38   2~4
            // 39   2~7
            // 40   2~7
            // 41   2
            // 42   2~3
            // 43   2~4
            if (playNum == 37 || playNum == 38 || playNum == 43) {
                num = 4;
            } else if (playNum == 39 || playNum == 40) {
                num = 7;
            } else if (playNum == 41) {
                num = 2;
            } else if (playNum == 42) {
                num = 3;
            } else if (playNum == 44) {
                num = 3;
            } else if (playNum == 45) {
                num = 4;
            }
        }

        return num;
    }
    createPlayerDeskByItem(item:any, refreshDesk:boolean) {
        let gameType = item.gameType
        let cardNode = null;
        // let cardType = 0;
        let playNum = item.playNum
        // let deskName = '';
        // @ts-ignore
        if ((gameType == GMID.XZMJ) || (gameType == GMID.YJMJ) || (gameType == GMID.XZMJER) || (gameType == GMID.HZMJ) || (gameType == GMID.YBMJ) || (gameType == GMID.NYMJ) || (gameType == GMID.LZMJ) || (gameType == GMID.LCMJ) || (gameType == GMID.NJMJ) || (gameType == GMID.GXMJ)) {
            // deskName = '血战麻将';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.mjDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.mjDeskPre[preIndex]);
            }
            // @ts-ignore
        } else if ((gameType == GMID.PDKNJ)  || (gameType == GMID.PDKLS) || (gameType == GMID.PDKTY) || (gameType == GMID.PDK) || (gameType == GMID.PDKGX) || (gameType == GMID.PDKGAOX) || (gameType == GMID.PDKLC)) {
            // deskName = '内江跑得快';
            // 跑得快 人数范围
            // 37   2~4
            // 38   2~4
            // 39   2~7
            // 40   2~7
            // 41   2
            // 42   2~3
            // 43   2~4
            if (playNum > 20) {
                if (playNum == 37 || playNum == 38 || playNum == 43) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                } else if (playNum == 39 || playNum == 40) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[5]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[5]);
                    }
                } else if (playNum == 41) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[0]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[0]);
                    }
                } else if (playNum == 42) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }

                } else if (playNum == 44) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[1]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[1]);
                    }

                } else if (playNum == 45) {
                    if (this.useSecdDesk) {
                        cardNode = cc.instantiate(this.pdkDesk2Pre[2]);
                    } else {
                        cardNode = cc.instantiate(this.pdkDeskPre[2]);
                    }
                }
            } else {
                let preIndex = playNum - 2;
                if (this.useSecdDesk) {
                    cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
                } else {
                    cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
                }

            }
            // @ts-ignore
        } else if (gameType == GMID.DDZ5) {
            // deskName = '斗地主';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.pdkDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.pdkDeskPre[preIndex]);
            }

            // @ts-ignore
        } else if (gameType == GMID.D2) {
            // deskName = '大贰';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.drDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.drDeskPre[preIndex]);
            }

            // @ts-ignore
        } else if (gameType == GMID.EQS) {
            // deskName = '大贰';
            let preIndex = playNum - 2;
            if (this.useSecdDesk) {
                cardNode = cc.instantiate(this.eqsDesk2Pre[preIndex]);
            } else {
                cardNode = cc.instantiate(this.eqsDeskPre[preIndex]);
            }

        }

        // @ts-ignore
        let deskName = cc.g.utils.getGameName(gameType, item.origin);

        // 桌子名字
        let deskNameLabel = cc.find("Label_Name", cardNode).getComponent(cc.Label);
        deskNameLabel.string = deskName
        // 局数
        let jueNum = cc.find("Sprite_nmbg/Label_bjname", cardNode).getComponent(cc.Label);

        // @ts-ignore
        if (gameType == GMID.EQS) {
            jueNum.string = '圈' + item.gameNum
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                jueNum.string = "圈" + item.curNum + '/' + "圈" + item.totalNum
            } else {
                jueNum.string = "圈" + item.totalNum
            }
        } else {
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                jueNum.string = item.curNum + '/' + item.totalNum
            } else {
                jueNum.string = item.totalNum + "局"
            }
        }

        // add by panbin
        if (this.curStepTeaHall) {
            // // 气泡名字
            let qiPaoName = cc.find("Sprite_Pop_Bg/Sprite_Pop_Name", cardNode).getComponent(cc.Label);
            // @ts-ignore
            qiPaoName.string = cc.g.utils.getFormatName(item.name, 7*2);
        } else {
            // 气泡
            let qiPaoNode = cc.find("Sprite_Pop_Bg", cardNode)
            qiPaoNode.active = false
        }

        // 用户名字Node
        let personNode = cc.find("Node_desk", cardNode)
        personNode.active = true;

        // 显示数据
        let relNum = this.getPlayerNum(item.playNum)
        for (let i = 0; i < relNum; i++) {
            let perItemNode = cc.find("Node_p"+i, personNode)
            perItemNode.active = false;
        }

        // 玩家
        let playerList = item.playerList;
        let headerIndex = 0;
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(playerList)) {
            // 显示数据
            playerList.forEach((pItem) => {
                let perItemNode = cc.find("Node_p"+headerIndex, personNode)
                perItemNode.active = true;

                let name = cc.find("Node_p"+headerIndex+"/Sprite_nmbg/Label_name", personNode).getComponent(cc.Label);
                name.string = pItem.name

                // 头像
                let headerEmptyImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_emp", personNode).getComponent(cc.Sprite);
                let headerImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_head", personNode).getComponent(cc.Sprite);
                // if (pItem.icon.length > 4) {
                //     headerImage.node.active = true
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     headerImage.node.active = false
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                if (headerImage.node.active) {
                    headerEmptyImage.node.active = false
                } else {
                    headerEmptyImage.node.active = true
                }

                let headerStatusImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_status", personNode).getComponent(cc.Sprite);
                let statusLabel = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/StatusLabel", personNode).getComponent(cc.Label);
                if (pItem.online) {
                    if (pItem.isReady) {
                        let spriteFrame = this.teaAtlas.getSpriteFrame('tea_ready');
                        headerStatusImage.spriteFrame = spriteFrame;
                        statusLabel.string = '准备'
                        statusLabel.node.color = new cc.Color(129,188,35);
                    } else {
                        let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_ready');
                        headerStatusImage.spriteFrame = spriteFrame;
                        statusLabel.string = '未准备'
                        statusLabel.node.color = new cc.Color(237,119,118);
                    }
                } else {
                    let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_lixian');
                    headerStatusImage.spriteFrame = spriteFrame;
                    statusLabel.string = '离线';
                    statusLabel.node.color = new cc.Color(255,255,255);
                }

                headerIndex++
            })
        } else {
            personNode.active = false;
        }

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cardNode);
        // @ts-ignore
        cc.g.utils.addClickEvent(cardNode, this, 'tea', 'enterGameHall', item);
        // add
        // this.mainScrollView.content.addChild(cardNode, 0);
        // deskNo
        this.mainScrollView.content.addChild(cardNode, 0, "playerDesk" + item.deskNo + item.floor);

        if (refreshDesk) {
            // 显示UI
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }
    }

    changePlayerDeskByItem(item) {
        // 修改茶馆
        let findDesk = false
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        let personNode = cc.find("Node_desk", cardNode)
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            if ((desk.deskNo == item.deskNo) && (desk.floor == item.floor)) {
                desk.playerList = item.playerList
                findDesk = true
                break
            }
        }

        if (findDesk) {
            // 局数
            let jueNum = cc.find("Sprite_nmbg/Label_bjname", cardNode).getComponent(cc.Label);
            let gameType = item.gameType
            // @ts-ignore
            if (gameType == GMID.EQS) {
                jueNum.string = '圈' + item.gameNum
                // @ts-ignore
                if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                    jueNum.string = "圈" + item.curNum + '/' + "圈" + item.totalNum
                } else {
                    jueNum.string = "圈" + item.totalNum
                }
            } else {
                // @ts-ignore
                if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                    jueNum.string = item.curNum + '/' + item.totalNum
                } else {
                    jueNum.string = item.totalNum + "局"
                }
            }

            let playerList = item.playerList;
            let headerIndex = 0;
            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(playerList)) {
                personNode.active = true
                // 显示数据
                let relNum = this.getPlayerNum(item.playNum)
                for (let i = 0; i < relNum; i++) {
                    let perItemNode = cc.find("Node_p"+i, personNode)
                    perItemNode.active = false;
                }

                // 显示数据
                playerList.forEach((pItem) => {
                    let nodeDesk = cc.find("Node_p"+headerIndex, personNode)
                    nodeDesk.active = true;
                    let name = cc.find("Node_p"+headerIndex+"/Sprite_nmbg/Label_name", personNode).getComponent(cc.Label);
                    name.string = pItem.name

                    // 头像
                    let headerEmptyImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_emp", personNode).getComponent(cc.Sprite);
                    let headerImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_head", personNode).getComponent(cc.Sprite);
                    // @ts-ignore
                    cc.g.utils.setHead(headerImage, pItem.icon);
                    // if (pItem.icon.length > 4) {
                    //     headerImage.node.active = true
                    //     // @ts-ignore
                    //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                    // } else {
                    //     headerImage.node.active = false
                    //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                    //     // headerImage.spriteFrame = spriteFrame;
                    // }

                    if (headerImage.node.active) {
                        headerEmptyImage.node.active = false
                    } else {
                        headerEmptyImage.node.active = true
                    }

                    let headerStatusImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_status", personNode).getComponent(cc.Sprite);
                    let statusLabel = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/StatusLabel", personNode).getComponent(cc.Label);
                    if (pItem.online) {
                        if (pItem.isReady) {
                            let spriteFrame = this.teaAtlas.getSpriteFrame('tea_ready');
                            headerStatusImage.spriteFrame = spriteFrame;
                            statusLabel.string = '准备'
                            statusLabel.node.color = new cc.Color(129,188,35);
                        } else {
                            let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_ready');
                            headerStatusImage.spriteFrame = spriteFrame;
                            statusLabel.string = '未准备'
                            statusLabel.node.color = new cc.Color(237,119,118);
                        }
                    } else {
                        let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_lixian');
                        headerStatusImage.spriteFrame = spriteFrame;
                        statusLabel.string = '离线';
                        statusLabel.node.color = new cc.Color(255,255,255);
                    }

                    headerIndex++
                })
            } else {
                personNode.active = false;
            }
        } else {
            cc.error('NOTIFY_CHANGE_TEA_HOUSE_DESK--没有找到桌子')
        }

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    changePlayerSecDeskByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        let personNode = cc.find("Node_desk", cardNode)
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            // if (desk.deskNo == item.deskNo) {
            if ((desk.deskNo == item.deskNo) && (desk.floor == item.floor)) {
                desk.playerList = item.playerList
                break
            }
        }

        let playerList = item.playerList;
        let headerIndex = 0;
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(playerList)) {
            personNode.active = true;


            // 跑得快 人数范围
            // 37   2~4
            // 38   2~4
            // 39   2~7
            // 40   2~7
            // 41   2
            // 42   2~3
            // 43   2~4

            let relNum = this.getPlayerNum(item.playNum)
            // 显示数据
            for (let i = 0; i < relNum; i++) {
                let perItemNode = cc.find("Node_p"+i, personNode)
                perItemNode.active = false;
            }
            // 显示数据
            playerList.forEach((pItem) => {
                let perItemNode = cc.find("Node_p"+headerIndex, personNode)
                perItemNode.active = true;
                let name = cc.find("Node_p"+headerIndex+"/Sprite_nmbg/Label_name", personNode).getComponent(cc.Label);
                name.string = pItem.name

                // 头像
                let headerEmptyImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_emp", personNode).getComponent(cc.Sprite);
                let headerImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_head", personNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);
                // if (pItem.icon.length > 4) {
                //     headerImage.node.active = true
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     headerImage.node.active = false
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                if (headerImage.node.active) {
                    headerEmptyImage.node.active = false
                } else {
                    headerEmptyImage.node.active = true
                }

                let headerStatusImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_status", personNode).getComponent(cc.Sprite);
                let statusLabel = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/StatusLabel", personNode).getComponent(cc.Label);
                if (pItem.online) {
                    if (pItem.isReady) {
                        let spriteFrame = this.teaAtlas.getSpriteFrame('tea_ready');
                        headerStatusImage.spriteFrame = spriteFrame;
                        statusLabel.string = '准备'
                        statusLabel.node.color = new cc.Color(129,188,35);
                    } else {
                        let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_ready');
                        headerStatusImage.spriteFrame = spriteFrame;
                        statusLabel.string = '未准备'
                        statusLabel.node.color = new cc.Color(237,119,118);
                    }
                } else {
                    let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_lixian');
                    headerStatusImage.spriteFrame = spriteFrame;
                    statusLabel.string = '离线';
                    statusLabel.node.color = new cc.Color(255,255,255);
                }

                headerIndex++
            })
        } else {
            personNode.active = false;
        }

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    removePlayerDeskByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        if (cardNode != null) {
            this.mainScrollView.content.removeChild(cardNode);
            // this.mainScrollView.optDc();
            // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
        }
    }

    changePlayerDeskStatusByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        let personNode = cc.find("Node_desk", cardNode)
        let deskItem = null;
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            // if (desk.deskNo == item.deskNo) {
            if ((desk.deskNo == item.deskNo) && (desk.floor == item.floor)) {
                deskItem = desk
                break
            }
        }

        let headerIndex = 0;
        let playerList = deskItem.playerList
        for (let j = 0; j < playerList.length; j++) {
            let person = playerList[j]
            // @ts-ignore
            if (eq64(person.pid, item.pid)) {
                headerIndex = j;
                break
            }
        }

        let headerStatusImage = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/Sprite_status", personNode).getComponent(cc.Sprite);
        let statusLabel = cc.find("Node_p"+headerIndex+"/Sprite_headbg/Node_headMask/StatusLabel", personNode).getComponent(cc.Label);
        if (item.isReady) {
            let spriteFrame = this.teaAtlas.getSpriteFrame('tea_ready');
            headerStatusImage.spriteFrame = spriteFrame;
            statusLabel.string = '准备'
            statusLabel.node.color = new cc.Color(129,188,35);
        } else {
            let spriteFrame = this.teaAtlas.getSpriteFrame('tea_no_ready');
            headerStatusImage.spriteFrame = spriteFrame;
            statusLabel.string = '未准备'
            statusLabel.node.color = new cc.Color(237,119,118);
        }

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    changePlayerDeskJueStatusByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)

        // 局数
        let jueNum = cc.find("Sprite_nmbg/Label_bjname", cardNode).getComponent(cc.Label);

        let jueStr = jueNum.string
        if(jueStr.indexOf("圈") == 0) {
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                jueNum.string = "圈" + item.curNum + '/' + "圈" + item.totalNum
            } else {
                jueNum.string = item.totalNum + "圈"
            }
        } else {
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(item.curNum)) {
                jueNum.string = item.curNum + '/' + item.totalNum
            } else {
                jueNum.string = item.totalNum + "局"
            }
        }

        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let deskItem = this.teaDeskDatas[i];
            if ((deskItem.floor == item.floor) && (deskItem.deskNo == item.deskNo)) {
                deskItem.isStart = item.isStart;
                break
            }
        }

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    changePlayerStatusByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        let personNode = cc.find("Node_desk", cardNode)
        personNode.active = true;
        let deskItem = null;
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            if ((desk.deskNo == item.deskNo) && (desk.floor == item.floor)) {
            // if (desk.deskNo == item.deskNo) {
                deskItem = desk
                break
            }
        }

        let headerIndex = 0;
        let playerList = deskItem.playerList
        for (let j = 0; j < playerList.length; j++) {
            let person = playerList[j]
            // @ts-ignore
            if (eq64(person.pid, item.pid)) {
                headerIndex = j;
                // move one desk
                playerList.splice(j,1);
                break
            }
        }

        let headerNode = cc.find("Node_p"+headerIndex, personNode);
        headerNode.active = false;

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    changePlayerDeskSecStatusByItem(item) {
        // 修改茶馆
        let cardNode = this.mainScrollView.content.getChildByName("playerDesk" + item.deskNo + item.floor)
        let personNode = cc.find("Node_desk", cardNode)
        personNode.active = false;
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            if ((desk.deskNo == item.deskNo) && (desk.floor == item.floor)) {
            // if (desk.deskNo == item.deskNo) {
                desk.playerList = []
                break
            }
        }

        // this.mainScrollView.optDc();
        // this.mainScrollView.scrollTo(cc.v2(this.autoScollerPreLitte(), 0), 0.1, true);
    }

    //  进入茶馆
    enterTeaHall(event, item: any) {
        cc.dlog('enterTeaHall....', item)
        let currentItem = null;
        for (let i = 0; i < this.teaRoomDatas.length; i++) {
            let desk = this.teaRoomDatas[i]
            if (item.floor == desk.floor) {
                currentItem = desk;
                break
            }
        }

        cc.dlog('currentItem....', JSON.stringify(currentItem))

        if (currentItem != null) {
            // let map = {
            //     deskNo:currentItem.deskNo,
            //     floor:currentItem.floor
            // }
            // // @ts-ignore
            // cc.g.utils.setLocalStorage('curGame', map)

            cc.dlog('enterTeaHall currentItem....', currentItem);

            this.getTeaJrcjPopPreNode().active = true;
            this.getTeaJrcj().showDataView(currentItem, 1);
        }
    }
    doRealEnterTeaHall(item: any, type: any) {
        // @ts-ignore
        cc.dlog('doRealEnterTeaHall');

        type = type||0 // 0-加入新桌子 -1-加入有空位的桌子

        // this.getTeaJrcjPopPreNode().active = false;
        // 暂时屏蔽
        // // @ts-ignore
        // if (cc.g.utils.judgeStringEmpty(cc.g.hallMgr.backToClubIfo) || cc.g.utils.judgeStringEmpty(cc.g.hallMgr.backToClubIfo.inGameRoomId)) {
        //     this.onBtnBacktodesk(null)
        // }

        let isSkipLoc = true;
        for (let i = 0; i < item.rule.length; ++i) {
            if (item.rule[i] == 36) {
                isSkipLoc = false;
                break;
            }
        }

        if (isSkipLoc) {
            cc.dlog('加入茶馆房间 不需要定位 >>>>>');

            // @ts-ignore
            cc.g.hallMgr.joinTeaHouse(this.teaHouseId, item.floor, type, true,  (resp)=>{
                cc.dlog('joinTeaHouse', resp)
                // // @ts-ignore
                // if (!cc.g.utils.judgeObjectEmpty(resp)) {
                //
                // }
            });
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
    
                cc.log('加入茶馆房间 需要定位 >>>>>');

                // @ts-ignore
                cc.g.hallMgr.joinTeaHouse(this.teaHouseId, item.floor, type, true,  (resp)=>{
                    cc.log('joinTeaHouse', resp);
                });
            });
        }
    }
    // 进入游戏
    enterGameHall(event, item: any) {
        cc.log('enterGameHall....', item)

        let currentItem = null;
        for (let i = 0; i < this.teaDeskDatas.length; i++) {
            let desk = this.teaDeskDatas[i]
            if ((item.floor == desk.floor) && ((desk.deskNo == item.deskNo))) {
                currentItem = desk;
                break
            }
        }

        if (currentItem != null) {
            // let map = {
            //     deskNo:currentItem.deskNo,
            //     floor:currentItem.floor
            // }
            // // @ts-ignore
            // cc.g.utils.setLocalStorage('curGame', map)

            // for (let i = 0; i < this.teaDeskDatas.length; i++) {
            //     let deskItem = this.teaDeskDatas[i];
            //     if ((deskItem.floor == item.floor) && (deskItem.deskNo == item.deskNo)) {
            //         item = deskItem;
            //         break
            //     }
            // }

            for (let i = 0; i < this.teaRoomDatas.length; i++) {
                let roomItem = this.teaRoomDatas[i];
                // if ((roomItem.deskNo == currentItem.deskNo) && (roomItem.floor == currentItem.floor)) {
                // 找玩法,只跟居楼层
                if (roomItem.floor == currentItem.floor) {
                    currentItem.deskName = roomItem.deskName
                    currentItem.rule = roomItem.rule
                    currentItem.gameNum = roomItem.gameNum
                    currentItem.base = roomItem.base
                    currentItem.winnerScore = roomItem.winnerScore
                    currentItem.goldMatchRule = roomItem.goldMatchRule
                    currentItem.expendSpeciThing = roomItem.expendSpeciThing
                    break
                }
            }

            cc.dlog('enterGameHall currentItem....', currentItem)

            let nojoin = false;
            for (let i = 0; i < currentItem.rule.length; ++i) {
                if (currentItem.rule[i] == 97) {
                    nojoin = true;
                    break;
                }
            }

            if (nojoin) {
                this.onBtnQuickStar();
            } else {
                this.getTeaJrcjPopPreNode().active = true;
                this.getTeaJrcj().showDataView(currentItem, 2);
            }
        }
    }

    doRealEnterGameHall(item: any) {
        cc.dlog('doRealEnterGameHall-->' + JSON.stringify(item))
        // this.getTeaJrcjPopPreNode().active = false;
        // 暂时屏蔽
        // // @ts-ignore
        // if (!cc.g.utils.judgeObjectEmpty(cc.g.hallMgr.backToClubIfo)) {
        //     // @ts-ignore
        //     if (!cc.g.utils.judgeStringEmpty(cc.g.hallMgr.backToClubIfo.inGameRoomId)) {
        //         this.onBtnBacktodesk(null)
        //     } else {
        //         this.goToGame(item);
        //     }
        // } else {
        //     this.goToGame(item);
        // }
        this.goToGame(item);
    }

    goToGame(item: any) {
        cc.dlog('goToGame');

        let isSkipLoc = true;
        for (let i = 0; i < item.rule.length; ++i) {
            if (item.rule[i] == 36) {
                isSkipLoc = false;
                break;
            }
        }

        if (isSkipLoc) {
            cc.dlog('加入茶馆房间 不需要定位 >>>>>');

            // @ts-ignore
            cc.g.hallMgr.joinTeaHouse(this.teaHouseId, item.floor, item.deskNo, true,  (resp)=>{
                // @ts-ignore
                cc.dlog('joinTeaHouse', resp)
            });
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
    
                cc.log('加入茶馆房间 需要定位 >>>>>');

                // @ts-ignore
                cc.g.hallMgr.joinTeaHouse(this.teaHouseId, item.floor, item.deskNo, true,  (resp)=>{
                    // @ts-ignore
                    cc.log('joinTeaHouse', resp)
                });
            });
        }
    }

    doClickedQieHan(event) {
        cc.log('点击了切换按钮....')
        // @ts-ignore
        cc.g.utils.btnShake();
        this.node_QingYou.active = true;
        this.node_Account.active = false;
    }

    doClickedQieHanTwo(event) {
        cc.log('关闭弹窗....')
        // @ts-ignore
        cc.g.utils.btnShake();
        this.node_QingYou.active = false;
        this.node_Account.active = true;
    }

    initNavHeaderData(pItem) {
        if (this.node_QingYou.active) {
            this.node_Account.active = false;
        } else {
            this.node_Account.active = true;
        }

        this.owner_Label.string = pItem.name
        this.id_Label.string = "ID:"+pItem.teaHouseId

        //(p==71 || p==41 || p==31 || p==21 || p==11);
        this.node_zhuoshu.active = false;
        if (this.position==71 || this.position==61) {
            this.node_zhuoshu.active = true;
            this.node_zhuoshu['num'].string = ''+this.totalDeskCount+'';
        }

        // this.name_Label.string = pItem.ownerName
        // if (pItem.icon.length > 4) {
        //     this.headerImage.node.active = true
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(this.headerImage, pItem.icon);
        // } else {
        //     this.headerImage.node.active = false
        // }

        // @ts-ignore
        this.bi_num_Label.string = cc.g.utils.realNum1(pItem.gold);
        // this.ka_num_Label.string = pItem.roomCard
        this.owner_Label_two.string = pItem.name
        this.id_Label_two.string = "ID:"+pItem.teaHouseId
    }

    doQieCellItem(event, item) {
        cc.dlog('点击切换按钮.....')
        this.node_QingYou.active = false

        let teaHouseId = item.teaHouseId
        // @ts-ignore
        cc.g.utils.setLocalStorage('teaHouseId', teaHouseId)
        this.teaHouseId = teaHouseId;

        // clear datas
        this.mainScrollView.content.removeAllChildren(true);
        this.curStepTeaHall = false;

        // 重新获取数据
        this.getTeaHouseDatas();
    }

    createQuanDatas(listArr) {
        this.navScrollView.content.removeAllChildren(true);
        // 显示数据
        listArr.forEach((item) => {
            if (this.curOwnerId != item.ownerId) {
                let cardNode = cc.instantiate(this.teaHeaderQieHuanPre);
                let name = cc.find("Label_Name", cardNode).getComponent(cc.Label);
                name.string = item.name

                let quan_num = cc.find("Label_ID", cardNode).getComponent(cc.Label);
                quan_num.string = item.teaHouseId

                let cellBtn = cc.find("CellButton", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellBtn, this, 'tea', 'doQieCellItem', item);

                // add
                this.navScrollView.content.addChild(cardNode);
            }
        })
    }

    // 更新数据
    doQuanListDatas() {
        // @ts-ignore
        cc.g.hallMgr.searchMyQuan((resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(resp.list)) {
                    this.createQuanDatas(resp.list);
                }
            }
        });
    }

    showBtnName() {
        let Button_Bxx = cc.find("Node_Top/Node_Buttons/Button_Bxx", this.node);
        //let p = this.position;
        //Button_Bxx.active = (p==71 || p==41 || p==31 || p==21 || p==11);
        Button_Bxx && (Button_Bxx.active = false);

        // =======================================================

        let button_BM = cc.find("Node_Top/Node_Buttons/Button_bm", this.node)
        let button_Jf = cc.find("Node_Top/Node_Buttons/Button_Jf", this.node)
        let labZjName = cc.find("Node_Top/Node_Buttons/Button_Zj/Background/Label", this.node).getComponent(cc.Label)
        let isGoldOpen = this.SettingData['isGoldOpen']
        if (isGoldOpen) {
            labZjName.string = '数据'
            if (this.position > 1) {
                button_Jf.active = true
            } else {
                button_Jf.active = false
            }
            // button_BM.active = true
            button_BM.active = false
        } else {
            labZjName.string = '战绩'
            button_Jf.active = false
            button_BM.active = false
            Button_Bxx && (Button_Bxx.active = false);
        }
    }

    // 更新数据
    getTeaHouseDatas() {
        const self = this;
        this.doClearDeskViews();
        // @ts-ignore
        cc.g.hallMgr.searchTeaHouse(this.teaHouseId, (resp)=>{
            cc.dlog('searchTeaHouse', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.utils.setLocalStorage('teaname', resp.name);

                this.SettingData['isGoldOpen'] = resp.matchOpen;
                this.SettingData['isDayang'] = resp.dyOpen;
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                this.position = resp.position;
                this.teamId = resp.teamId;
                this.curOwnerId = resp.ownerId;
                this.totalDeskCount = resp.totalDeskCount;
                this.cordonAuth = resp.cordonAuth;
                

                // if ((this.position == 71) || (this.position == 61)) {
                //     this.Node_FanKa.active = true
                // } else {
                //     this.Node_FanKa.active = false
                // }

                this.applyExitCount = resp.applyExitCount;
                this.applyJoinCount = resp.applyJoinCount;
                this.applyGoldMathCount = resp.applyGoldMathCount;

                if (this.applyExitCount > 0 ) {
                    this.doShowNoticeCy(true)
                    // this.getTeaChenYuan().doShowNoticeFour(true)
                } else if (this.applyJoinCount > 0) {
                    this.doShowNoticeCy(true)
                    // this.getTeaChenYuan().doShowNoticeThree(true)
                } else {
                    this.doShowNoticeCy(false)
                }

                // if (this.applyGoldMathCount > 0) {
                //     this.doShowNoticeMore(true)
                //     if (TeaMoreClass.instance != null) {
                //         TeaMoreClass.instance.doShowNotice(true)
                //     }
                //     if (TeaBmsp.instance != null) {
                //         TeaBmsp.instance.showNoticeSprite(true)
                //     }
                // } else {
                //     this.doShowNoticeMore(false)
                //     if (TeaMoreClass.instance != null) {
                //         TeaMoreClass.instance.doShowNotice(false)
                //     }
                //     if (TeaBmsp.instance != null) {
                //         TeaBmsp.instance.showNoticeSprite(false)
                //     }
                // }

                this.goldSetData['goldMatchAuth'] = resp.goldMatchAuth;//金币场授权
                this.goldSetData['signMatchStatus'] = resp.signMatchStatus;
                this.goldSetData['mineMatchFee'] = resp.mineMatchFee;
                this.goldSetData['mineFeeIndex'] = resp.mineFeeIndex;
                this.goldSetData['matchTime'] = resp.matchTime;
                this.goldSetData['matchFee'] = resp.matchFee;
                this.goldSetData['feeRate1'] = resp.feeRate1;
                this.goldSetData['feeRate2'] = resp.feeRate2;
                this.goldSetData['feeOpen1'] = resp.feeRate1>0;
                this.goldSetData['feeOpen2'] = resp.feeRate2>0;

                this.initNavHeaderData(resp);
                let teaDatas = resp.list;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    self.teaRoomDatas = teaDatas
                    // cc.dlog('self.teaRoomDatas--tea->'+JSON.stringify(self.teaRoomDatas))
                    // 渲染页面
                    self.createTeaViewWithDatas()
                }

                self.showBtnName()
            }

            self.upGoldValShow();

            self.doQuanListDatas();

            self.tryPopGoldTipDlg();

            // @ts-ignore
            let parms = cc.g.utils.getLocalStorage('TEA_SEC')
            // @ts-ignore
            if (cc.g.utils.judgeObjectEmpty(parms)) {
                // 获取桌子
                self.getTeaHouseDeskDatas()
            } else {
                let curStepTeaHall = parms.curStepTeaHall
                let curFloor = parms.curFloor
                this.curStepTeaHall = curStepTeaHall
                this.curFloor = curFloor
                this.doRealGoNextBaoJian(this.curFloor);
            }

            self.checkCallBackHf()
        });
    }

    getTeaHouseDeskDatas() {
        const self = this;

        let realSearchIndex;
        // @ts-ignore
        if (cc.g.utils.judgeArrayEmpty(this.teaDeskDatas)) {
            realSearchIndex = 0;
        } else {
            realSearchIndex = this.teaDeskDatas.length
        }

        cc.dlog('获取桌子数据..realSearchIndex..', realSearchIndex)

        // @ts-ignore
        cc.g.hallMgr.searchTeaHouseDesk(this.teaHouseId, realSearchIndex, (resp)=>{
            cc.dlog('getTeaHouseDeskDatas', resp)

            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                let teaDatas = resp.deskList;
                let rule = resp.rule
                // @ts-ignore
                if ((realSearchIndex == 0) && (!cc.g.utils.judgeObjectEmpty(rule))) {
                    self.teaDeskDatas.push(rule)
                    self.renderTeaRoomViewSec(rule, true)
                }
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    // 合并数据
                    self.teaDeskDatas = self.teaDeskDatas.concat(teaDatas)
                }

                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    self.doCreateDeskWithArr(teaDatas);
                    // self.mainScrollView.optDc();
                    // self.mainScrollView.scrollTo(cc.v2(self.autoScollerPreLitte(), 0), 0.1, true);
                }
            }

            // // @ts-ignore
            // if (!cc.g.utils.judgeObjectEmpty(resp)) {
            //     let teaDatas = resp.deskList;
            //
            //     // @ts-ignore
            //     if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
            //         // 合并数据
            //         self.teaDeskDatas = self.teaDeskDatas.concat(teaDatas)
            //     }
            //
            //     if (realSearchIndex == 0) {
            //         self.createDeskViewWithDatas(false);
            //     } else {
            //         // @ts-ignore
            //         if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
            //             // 刷新数据
            //             self.doCreateDeskWithArr(teaDatas);
            //         }
            //     }
            // }
        });
    }

    getTeaHouseDeskByFloorDatas(floor: number) {
        const self = this;
        // @ts-ignore
        cc.g.hallMgr.searchTeaHouseDeskByFloor(this.teaHouseId, floor, (resp)=>{
            cc.dlog('getTeaHouseDeskByFloorDatas', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                let teaDatas = resp.deskList;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(teaDatas)) {
                    for (let i = 0; i < self.teaDeskDatas.length; i++) {
                        let item = self.teaDeskDatas[i]
                        for (let j = 0; j < teaDatas.length; j++) {
                            let itemSec = teaDatas[j]
                            if ((item.deskNo == itemSec.deskNo) && (item.floor == itemSec.floor)) {
                            // if (item.deskNo == itemSec.deskNo) {
                                // item = itemSec
                                self.teaDeskDatas.splice(i, 1)
                                self.teaDeskDatas.splice(i, 0, itemSec)
                                break
                            }
                        }
                    }

                    self.createDeskViewWithDatas(true);
                }
            }
        })
    }

    // 保险箱
    doShowBaoxxDialog() {
        // @ts-ignore 
        cc.log('doShowBaoxxDialog');

        return;

        // @ts-ignore
        cc.g.utils.btnShake();

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let p = this.position;
        if (p==71 || p==41 || p==31 || p==21 || p==11) {

            let dlg = cc.instantiate(this.teaBxxPre);
            this.node.addChild(dlg);

            return;
        }

        // @ts-ignore 
        cc.g.global.hint('没有操作权限');
    }

    // 显示创建房间弹窗
    doShowTeaWfPopDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if ((this.position == 71) || (this.position == 61)) {
            this.getTeaWfPop()
            this.getTeaWfPopPreNode().active = true;
        } else {
            // @ts-ignore
            cc.g.global.hint('没有操作权限');
        }
    }
    doHiddenTeaWfPopDialog() {
        this.getTeaWfPopPreNode().active = false;
    }

    // 显示创建房间弹窗
    doShowTeaQingDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if ((this.position == 71) || (this.position == 61) || (this.position == 41) || (this.position == 31) || (this.position == 21) || (this.position == 11)) {
            this.getTeaQingPreNode().active = true;
        } else {
            // @ts-ignore
            cc.g.global.hint('没有操作权限');
        }
    }
    doHiddenTeaQingDialog() {
        this.getTeaQingPreNode().active = false;
    }

    // 显示更多
    doShowTeaMoreDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();
        
        this.getTeaMorePreNode().active = true;

        if (this.applyGoldMathCount > 0) {
            this.doShowNoticeMore(true)
            // this.noticeJf.active = true
            if (TeaBmsp.instance != null) {
                TeaBmsp.instance.showNoticeSprite(true)
            }
        } else {
            this.doShowNoticeMore(false)
            // this.noticeJf.active = false
            if (TeaBmsp.instance != null) {
                TeaBmsp.instance.showNoticeSprite(false)
            }
        }

        this.getTeaMorePreNode().getComponent('tea_geng_duo').up();
    }
    doHiddenTeaMoreDialog() {
        this.getTeaMorePreNode().active = false;
    }

    // 显示成员
    doShowTeaChengYuanDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        // this.teaChenYuanNode.active = true;

        this.getTeaChenYuanNode().active = true;

        // 每次显示的时候，执行
        if (this.applyJoinCount > 0) {
            this.getTeaChenYuan().doShowNoticeThree(true)
        } else {
            this.getTeaChenYuan().doShowNoticeThree(false)
        }

        if ((this.applyExitCount > 0) || (this.applyGoldMathCount > 0)) {
            this.getTeaChenYuan().doShowNoticeFour(true)
        } else {
            this.getTeaChenYuan().doShowNoticeFour(false)
        }
    }
    doHiddenTeaChengYuanDialog() {
        // this.teaChenYuanNode.active = false;

        this.getTeaChenYuanNode().active = false;
    }

    // 显示战绩
    doShowTeaJinbiDialog() {
        cc.log('doShowTeaJinbiDialog.......')
        this.getTeaZhanJi().initParams(1)
        this.getTeaZhanJiNode().active = true;
    }
    doShowTeaZhanJiDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        let isGoldOpen = this.SettingData['isGoldOpen']
        if (isGoldOpen) {
            this.doShowTeaJinbiDialog()
        } else {
            this.getTeaZhanJi().initParams(2)
            this.getTeaZhanJiNode().active = true;
        }
    }
    doHiddenTeaZhanJiDialog() {
        this.getTeaZhanJiNode().active = false;
    }

    doShowTeaSetNameDialog(floor: number) {
        this.getTeaWfSetName().initParams(this.teaHouseId, floor)
        this.getTeaWfSetNameNode().active = true;
    }
    doHiddenTeaSetNameDialog() {
        this.getTeaWfSetNameNode().active = false;
    }

    // 显示茶馆设置对话框
    showDlgSetting(tag) {
        let dlg = cc.instantiate(this.dlgSetting);
        this.node.addChild(dlg);
 
        dlg.getComponent('tea_setting').up(tag);
    }

    // 显示金币场设置对话框
    showDlgGoldSet() {
       let dlg = cc.instantiate(this.dlgJbcSet);
       this.node.addChild(dlg);

       dlg.getComponent('tea_gold_set').up();
    }

    // 显示金币场报名对话框
    showDlgGoldBm() {
         {/*
            message  GetMineGoldMatchResp{
                int32    teaHouseId=1;//茶馆Id
                int32    signMatchStatus=2;//金币场报名状态(0未申请  1 已申请 2 已报名)
                int32    mineMatchFee = 3;//自己的金币场报名费
                int32    mineFeeIndex = 4;//自己的金币场报名费索引
                int32    matchTime=5;//金币场时间戳(申请时间或者加入金币场时间)
                int32    matchFee = 6;//金币场当前报名费
                int32    feeRate1 = 7;//金币场当前报名费倍率1
                int32    feeRate2 = 8;//金币场当前报名费倍率2
            }
        */}
        
        let dlg = cc.instantiate(this.dlgJbcbm);
        this.node.addChild(dlg);

        dlg.getComponent('tea_gold_bm').up();
    }

    // 显示金币场报名审批对话框
    showDlgBmsp() {
       let dlg = cc.instantiate(this.dlgJbcbmsp);
       this.node.addChild(dlg);

       dlg.getComponent('tea_gold_bmsp').up();
    }

    // 快速开始
    onBtnQuickStar() {
        cc.log('onBtnQuickStar');
        let dlg = cc.instantiate(this.teaQuickStar);
        this.node.addChild(dlg);
    }

    // 返回茶管大厅
    backTopTeaHall() {
        if (this.curStepTeaHall) {
            cc.dlog('在茶馆大厅...')
        } else {
            cc.dlog('返回茶馆大厅...')
            // @ts-ignore
            cc.g.utils.clearLocalStorage('TEA_SEC')
            this.curStepTeaHall = true
            this.teaDeskDatas = [];
            this.getTeaHouseDatas();
        }
    }

    // 返回桌子
    onBtnBacktodesk(event) {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(cc.g.hallMgr.backToClubIfo)) {
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(cc.g.hallMgr.backToClubIfo.inGameRoomId)) {
                // @ts-ignore
                cc.g.hallMgr.joinRoom(-1, cc.g.hallMgr.backToClubIfo.inGameRoomId, true);
            }
        }
    }

    // update (dt) {}
    
    doSendExitTea() {
        const self = this;
        // @ts-ignore
        cc.g.hallMgr.doExtTeaHouse(this.teaHouseId, (resp)=>{
            cc.dlog('doExtTeaHouse', resp)
        });
    }

    backToHall() {
        if (this.btnFanHuiGame.active) {
            this.onBtnBacktodesk(null)
        } else {
            // @ts-ignore
            cc.g.utils.btnShake();

            // @ts-ignore
            cc.g.utils.clearLocalStorage('TEA_SEC')

            // // @ts-ignore
            // cc.g.utils.clearLocalStorage('curGame')

            this.doSendExitTea();

            cc.dlog('click back backToHall');
            
            cc.director.loadScene('tea_quan', (err, scene) => {
                cc.dlog('进入包间.')
            });
        }
    }

    updateTeaWfDatas(item) {
        this.getTeaHouseDatas();
        // if (item.teaHouseId == this.teaHouseId) {
        //
        //     // let curTeaRoom = null;
        //     // for (let i = 0; i < this.teaRoomDatas.length; i++) {
        //     //     let saveRoom = this.teaRoomDatas[i]
        //     //     if (saveRoom.floor == item.floor) {
        //     //         saveRoom.name = item.name
        //     //         curTeaRoom = saveRoom
        //     //         this.changeAreaDatas(curTeaRoom.deskName, item)
        //     //         break
        //     //     }
        //     // }
        //
        //     // // 修改茶馆
        //     // let cardNode = this.mainScrollView.content.getChildByName("tearoom" + curTeaRoom.floor)
        //     // let qiPaoName = cc.find("Sprite_Pop_Bg/Sprite_Pop_Name", cardNode).getComponent(cc.Label);
        //     // qiPaoName.string = item.name
        //     //  修改列表
        //     //this.teaWfPop.doChangeNameWithDatas(item)
        // }
    }

    upGoldValShow() {
        cc.dlog('upGoldValShow');
        //SettingData goldSetData
        this.Node_jin.active = (this.SettingData['isGoldOpen']) && (this.goldSetData['signMatchStatus']==2);
    }

    // =========== 推送相关 ===================================================================================

    registNOTIFY() {

        // @ts-ignore 修改玩法
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_MODIFY_TEA_HOUSE_ROOM, (resp) => this.on_NOTIFY_MODIFY_TEA_HOUSE_ROOM(resp) );

        // @ts-ignore 有人离开游戏
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_QUIT_ROOM, (resp) => this.on_NOTIFY_QUIT_ROOM(resp) );

        // @ts-ignore 主推桌子数量
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_DESK_COUNT, (resp) => this.on_NOTIFY_TEA_HOUSE_DESK_COUNT(resp) );

        

        // @ts-ignore  踢出亲友圈
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_EXIT_TEA_HOUSE, (resp) => this.on_NOTIFY_EXIT_TEA_HOUSE(resp) );
        // @ts-ignore  主推增加桌子
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_ADD_DESK, (resp) => this.on_NOTIFY_TEA_HOUSE_ADD_DESK(resp) );
        // @ts-ignore  主推加入桌子
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_CHANGE_TEA_HOUSE_DESK, (resp) => this.on_NOTIFY_CHANGE_TEA_HOUSE_DESK(resp) );
        // @ts-ignore  主推移除桌子
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_REMOVE_DESK, (resp) => this.on_NOTIFY_TEA_HOUSE_REMOVE_DESK(resp) );
        // @ts-ignore  主推退出桌子 人
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_EXIT_TEA_HOUSE_DESK, (resp) => this.on_NOTIFY_EXIT_TEA_HOUSE_DESK(resp) );
        // @ts-ignore  主推玩家准备
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_READY, (resp) => this.on_NOTIFY_TEA_HOUSE_READY(resp) );
        // @ts-ignore  主推游戏开始和局数
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_GAME_NUM, (resp) => this.on_NOTIFY_TEA_HOUSE_GAME_NUM(resp) );
        // @ts-ignore 修改玩法主推
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_ROOM_NAME, (resp) => this.on_NOTIFY_TEA_HOUSE_ROOM_NAME(resp) );
        // @ts-ignore 删除玩法
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_DELETE_TEA_HOUSE_ROOM, (resp) => this.on_NOTIFY_DELETE_TEA_HOUSE_ROOM(resp) );
        // @ts-ignore 添加玩法主推
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_ADD_TEA_HOUSE_ROOM, (resp) => this.on_NOTIFY_ADD_TEA_HOUSE_ROOM(resp) );
        // @ts-ignore 修改职位主推
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_ID, (resp) => this.on_NOTIFY_TEA_HOUSE_ID(resp) );

        // @ts-ignore 主推打烊设置
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_DY_SETTING, (resp) => this.on_NOTIFY_DY_SETTING(resp) );
        
        // @ts-ignore 主推金币场开关
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GOLD_MATCH_OPEN, (resp) => this.on_NOTIFY_GOLD_MATCH_OPEN(resp) );

        // @ts-ignore 主推我的金币场报名
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_MINE_GOLD_MATCH, (resp) => this.on_NOTIFY_MINE_GOLD_MATCH(resp) );

        // @ts-ignore 主推茶馆货币变化
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_MONEY, (resp) => this.on_NOTIFY_TEA_HOUSE_MONEY(resp) );

        // @ts-ignore 主推金币场暂停或者恢复
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GOLD_MATCH_PAUSE, (resp) => this.on_NOTIFY_GOLD_MATCH_PAUSE(resp) );

        // @ts-ignore 主推金币场暂停或者恢复
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GOLD_MATCH_CREDIT_OPEN, (resp) => this.on_NOTIFY_GOLD_MATCH_CREDIT_OPEN(resp) );

        // @ts-ignore 主推金币场费用变化
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GOLD_MATCH_FEE, (resp) => this.on_NOTIFY_GOLD_MATCH_FEE(resp) );

        // @ts-ignore 进入游戏监听
        cc.g.networkMgr.addHandler(PB.PROTO.JOIN_CLUB_DESK, (resp) => this.on_JOIN_CLUB_DESK(resp) );

        // @ts-ignore 主推解散茶馆
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_DISBAND_TEA_HOUSE, (resp) => this.on_NOTIFY_DISBAND_TEA_HOUSE(resp) );

        // @ts-ignore 主推解散茶馆
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_GOLD_COMPENSATE_TIPS, (resp) => this.on_NOTIFY_GOLD_COMPENSATE_TIPS(resp) );

        // @ts-ignore
        // cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_APPLY_TEA_HOUSE, (resp) => this.on_NOTIFY_APPLY_TEA_HOUSE(resp) ); //  主推增加桌子

        // @ts-ignore
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_TEA_HOUSE_APPLY_COUNT, (resp) => this.on_NOTIFY_TEA_HOUSE_APPLY_COUNT(resp) ); //  主推增加桌子
    }

    on_NOTIFY_QUIT_ROOM(resp) {
        cc.dlog("有人离开游戏...", resp)
        // @ts-ignore
        if (eq64(resp.uid, cc.g.userMgr.userId)) {
            // 隐藏按钮
            this.btnFanHuiGame.active = false
        }
    }

    on_NOTIFY_TEA_HOUSE_DESK_COUNT(resp) {
        cc.dlog("主推桌子数量...", resp)

        //主推茶馆桌子数量变化
        //@api:2344,@type:resp
        // message  NotifyTeaHouseDeskCountResp{
        //     int32    teaHouseId=1;//茶馆Id
        //     int32    totalDeskCount = 2;//总桌子数
        // }

            
        if (this.teaHouseId != resp.teaHouseId) {
            return;
        }

        this.totalDeskCount = resp.totalDeskCount;
        this.node_zhuoshu.active = false;
        if (this.position==71 || this.position==61) {
            this.node_zhuoshu.active = true;
            this.node_zhuoshu['num'].string = ''+this.totalDeskCount+'';
        }
    }

    on_NOTIFY_MODIFY_TEA_HOUSE_ROOM(resp) {
        cc.dlog("修改玩法变化", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            this.updateTeaWfDatas(resp.roomRule)
        }
    }

    on_NOTIFY_EXIT_TEA_HOUSE(resp) {
        cc.dlog("踢出亲友圈", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            this.doExitTea(resp)
        }
    }

    on_NOTIFY_TEA_HOUSE_ADD_DESK(resp) {
        cc.dlog("收到增加桌子", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // if (this.curStepTeaHall) {
            //     let desk = resp.desk;
            //     this.teaDeskDatas.push(desk)
            //     // 创建桌子
            //     this.createPlayerDeskByItem(desk);
            // } else {
            //     if (resp.teaHouseId == this.teaHouseId) {
            //         let desk = resp.desk;
            //         // 创建桌子
            //         this.changePlayerSecDeskByItem(desk);
            //     }
            // }

            let deskNo = resp.deskNo
            let floor = resp.floor
            let findReaptDesk = false;
            for (let i = 0; i < this.teaDeskDatas.length; i++) {
                let teaDesk = this.teaDeskDatas[i]
                let getDeskNo = teaDesk.deskNo
                let getFloor = teaDesk.floor

                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(getDeskNo) && !cc.g.utils.judgeObjectEmpty(getFloor)) {
                    if ((deskNo == getDeskNo) && (floor == getFloor)) {
                        findReaptDesk = true;
                        break
                    }
                }
            }

            if (!findReaptDesk) {
                if (this.curStepTeaHall) {
                    let desk = resp.desk;
                    this.teaDeskDatas.push(desk)
                    // 创建桌子
                    this.createPlayerDeskByItem(desk, true);
                } else {
                    let desk = resp.desk;
                    if (desk.floor == this.curFloor) {
                        this.teaDeskDatas.push(desk)
                        // 创建桌子
                        this.createPlayerDeskByItem(desk, true);
                    }
                }
            }
        }
    }

    on_NOTIFY_CHANGE_TEA_HOUSE_DESK(resp) {
        cc.dlog("收到主推加入桌子", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // if (this.curStepTeaHall) {
            //     let desk = resp.desk;
            //     // 创建桌子
            //     this.changePlayerDeskByItem(desk);
            // } else {
            //     if (resp.teaHouseId == this.teaHouseId) {
            //         let desk = resp.desk;
            //         // 创建桌子
            //         this.changePlayerSecDeskByItem(desk);
            //     }
            // }

            if (this.curStepTeaHall) {
                let desk = resp.desk;
                // 创建桌子
                this.changePlayerDeskByItem(desk);
            } else {
                if (resp.teaHouseId == this.teaHouseId) {
                    let desk = resp.desk;
                    if (desk.floor == this.curFloor) {
                        this.changePlayerDeskByItem(desk);
                    }
                }
            }

            // let desk = resp.desk;
            // // 创建桌子
            // this.changePlayerDeskByItem(desk);
        }
    }

    on_NOTIFY_TEA_HOUSE_REMOVE_DESK(resp) {
        cc.dlog("收到主推移除桌子", JSON.stringify(resp))
        if (resp.teaHouseId == this.teaHouseId) {
            // if (this.curStepTeaHall) {
            //     for (let i = 0; i < this.teaDeskDatas.length; i++) {
            //         let desk = this.teaDeskDatas[i]
            //         if (desk.deskNo == resp.deskNo) {
            //             this.teaDeskDatas.splice(i, 1);
            //             break
            //         }
            //     }
            //     // 创建桌子
            //     this.removePlayerDeskByItem(resp);
            //
            //     // @ts-ignore
            //     let gameItem = cc.g.utils.getLocalStorage('curGame')
            //     if ((gameItem.floor + gameItem.deskNo) == (resp.floor + resp.deskNo)) {
            //         // 隐藏按钮
            //         this.btnFanHuiGame.active = false
            //     }
            // } else {
            //     this.changePlayerDeskSecStatusByItem(resp);
            // }


            for (let i = 0; i < this.teaDeskDatas.length; i++) {
                let desk = this.teaDeskDatas[i]
                if ((desk.deskNo == resp.deskNo) && (desk.floor == resp.floor)) {
                    this.teaDeskDatas.splice(i, 1);
                    break
                }
            }
            // 创建桌子
            this.removePlayerDeskByItem(resp);

            // // @ts-ignore
            // let gameItem = cc.g.utils.getLocalStorage('curGame')
            // // @ts-ignore
            // if (!cc.g.utils.judgeObjectEmpty(gameItem)) {
            //     cc.dlog("gameItem-->", JSON.stringify(gameItem))
            //     if ((gameItem.floor + gameItem.deskNo) == (resp.floor + resp.deskNo)) {
            //         // 隐藏按钮
            //         this.btnFanHuiGame.active = false
            //     }
            // }
        }
    }

    on_NOTIFY_EXIT_TEA_HOUSE_DESK(resp) {
        cc.dlog("收到主推退出桌子 人", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // if (this.curStepTeaHall) {
            //     // 创建桌子
            //     this.changePlayerStatusByItem(resp);
            // } else {
            //     // 创建桌子
            //     this.changePlayerStatusByItem(resp);
            // }
            // 创建桌子
            this.changePlayerStatusByItem(resp);
        }
    }

    on_NOTIFY_TEA_HOUSE_READY(resp) {
        cc.dlog("收到主推玩家准备", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // 创建桌子
            this.changePlayerDeskStatusByItem(resp);
        }
    }
    on_NOTIFY_TEA_HOUSE_GAME_NUM(resp) {
        cc.dlog("收到主推游戏开始和局数", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // 创建桌子
            this.changePlayerDeskJueStatusByItem(resp);
        }
    }

    on_NOTIFY_MINE_GOLD_MATCH(resp) {
        cc.dlog("主推我的金币场报名");

        {/*
            //主推我的金币场信息
            //@api:2304,@type:resp
            message  NotifyMineGoldMatchResp{
                int32    teaHouseId=1;//茶馆Id
                int32    signMatchStatus=2;//金币场报名状态(0未申请  1 已申请 2 已报名)
                int32    mineMatchFee = 3;//自己的金币场报名费
                int32    mineFeeIndex = 4;//自己的金币场报名费索引
                int32    matchTime=5;//金币场时间戳(申请时间或者加入金币场时间)
                int32    matchFee = 6;//金币场当前报名费
                int32    feeRate1 = 7;//金币场当前报名费倍率1
                int32    feeRate2 = 8;//金币场当前报名费倍率2
            }
        */}

        this.goldSetData['signMatchStatus'] = resp.signMatchStatus;
        this.goldSetData['mineMatchFee'] = resp.mineMatchFee;
        this.goldSetData['mineFeeIndex'] = resp.mineFeeIndex;
        this.goldSetData['matchTime'] = resp.matchTime;
        this.goldSetData['matchFee'] = resp.matchFee;
        this.goldSetData['feeRate1'] = resp.feeRate1;
        this.goldSetData['feeRate2'] = resp.feeRate2;

        this.upGoldValShow();
    }

    on_NOTIFY_TEA_HOUSE_MONEY(resp) {
        cc.dlog("主推茶馆货币变化");

        {/*
            //主推茶馆货币变化
            //@api:2318,@type:resp
            message  NotifyTeaHouseMoneyResp{
                int32    teaHouseId=1;//茶馆Id
                int32    type = 2; // 1-金币场金币 2-房卡
                int32    value = 3; //剩余值
            }
        */}

        cc.dlog("房卡变化", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // 1-金币场金币 2-房卡
            let value = resp.value //剩余值
            if (resp.type == 1) {
                // @ts-ignore
                this.bi_num_Label.string = cc.g.utils.realNum1(value);
                //this.goldSetData['signMatchStatus'] = resp.type;
                //this.goldSetData['mineMatchFee'] = resp.value;

                if (this.goldChangCB) {
                    for (const key in this.goldChangCB) {
                        const f = this.goldChangCB[key];
                        f && f(value);
                    }
                }
            } else {
                // this.ka_num_Label.string = value
            }
        }

        

        this.upGoldValShow();
    }
    

    on_NOTIFY_TEA_HOUSE_ID(resp) {
        cc.dlog("收到修改职位主推", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // @ts-ignore
            if (eq64(resp.userId, cc.g.userMgr.userId)) {
                this.position = resp.position;
                this.teamId = resp.teamId;
            }
        }
    }

    on_NOTIFY_TEA_HOUSE_ROOM_NAME(resp) {
        cc.dlog("收到修改玩法回调", resp)
        this.updateTeaNameDatas(resp)
    }

    on_NOTIFY_DELETE_TEA_HOUSE_ROOM(resp) {
        cc.dlog("收到删除玩法回调", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            // 重新获取数据
            this.getTeaHouseDatas();
        }
    }

    // 添加玩法主推
    on_NOTIFY_ADD_TEA_HOUSE_ROOM(resp) {
        cc.dlog("收到添加玩法回调", resp)

        let curTeaHouseId = resp.teaHouseId
        let roomRule = resp.roomRule
        let curFloor = roomRule.floor - 1
        if (curFloor <= 0) {
            curFloor = 0
        }


        if (curTeaHouseId == this.teaHouseId) {
            let roomRule = resp.roomRule
            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(this.teaRoomDatas)) {
                for (let i = 0; i < this.teaRoomDatas.length; i++) {
                    let saveRoom = this.teaRoomDatas[i]
                    if (saveRoom.floor == curFloor) {
                        this.teaRoomDatas.splice(i+1, 0, roomRule);
                        this.addTeaNoticeDatas(roomRule)
                        break
                    }
                }
            } else {
                this.teaRoomDatas.push(roomRule);
                this.addTeaNoticeDatas(roomRule)
            }
        }


        cc.dlog('on_NOTIFY_ADD_TEA_HOUSE_ROOM'+JSON.stringify(this.teaRoomDatas))
    }

    on_NOTIFY_GOLD_MATCH_CREDIT_OPEN(resp) {
        cc.dlog("主推金币场战队荣誉开关");
    }


    on_NOTIFY_GOLD_MATCH_FEE(resp) {
        if (resp.teaHouseId != this.teaHouseId) {
            return;
        }

        cc.dlog('主推金币场费用变化');

        {/*
            //主推金币场费用变化
            //@api:2319,@type:resp
            message  NotifyGoldMatchFeeResp{
                int32    teaHouseId=1;//茶馆Id
                int32    matchFee = 2;//报名费
                bool     feeOpen1 = 3;//是否允许报名费倍率1(true允许,false不允许)
                bool     feeOpen2 = 4;//是否允许报名费倍率2(true允许,false不允许)
                int32    feeRate1 = 5;//报名费倍率1
                int32    feeRate2 = 6;//报名费倍率2
            }
        */}

        this.goldSetData['matchFee'] = resp.matchFee;
        this.goldSetData['feeRate1'] = resp.feeRate1;
        this.goldSetData['feeRate2'] = resp.feeRate2;
        this.goldSetData['feeOpen1'] = resp.feeOpen1;
        this.goldSetData['feeOpen2'] = resp.feeOpen2;
    }

    on_JOIN_CLUB_DESK(resp) {
        // @ts-ignore
        cc.dlog('加入俱乐部包间的桌子 成功');
        cc.dlog('resp-->' + JSON.stringify(resp));
        cc.dlog('resp' + resp);
        let ri = (resp.msg=='create') ? resp.create : resp.join;

        cc.dlog('ri.room, ri.one, ri.others', ri.room, ri.one, ri.others);
        // @ts-ignore
        cc.g.hallMgr.enterGame(ri.room.gameType, ri.room, ri.one, ri.others||[]);
    }

    on_NOTIFY_DY_SETTING(resp) {
        {/*
            //主推打烊设置
            //@api:2232,@type:resp
            message  NotifyDySettingResp{
                    int32    teaHouseId = 1;//茶馆Id
                    int32    dyOpen = 2;//打烊开关(1 开 0 关闭)
            }
        */}

        // @ts-ignore
        if (!resp.err || resp.err == PB.ERROR.OK) {
            cc.dlog('NOTIFY_DY_SETTING');
            if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                cc.dlog('NOTIFY_DY_SETTING 失败1');
                return;
            }

            TeaClass.instance.SettingData['isDayang'] = resp.dyOpen;
        } else {
            cc.dlog('NOTIFY_DY_SETTING 失败');
        }
    }

    on_NOTIFY_GOLD_MATCH_OPEN(resp) {
        {/*
            //主推金币场开关
            //@api:2297,@type:resp
            message  NotifyGoldMatchOpenResp{
                int32    teaHouseId=1;//茶馆Id
                bool     goldMatchOpen=2;//是否开启金币场(true 开,false关闭)
            }
        */}

        if (resp.teaHouseId == this.teaHouseId) {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.dlog('NOTIFY_GOLD_MATCH_OPEN');
                if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                    cc.dlog('NOTIFY_GOLD_MATCH_OPEN 失败1');
                    return;
                }

                TeaClass.instance.SettingData['isGoldOpen'] = resp.goldMatchOpen;

                this.goldSetData['signMatchStatus'] = 0;
                this.goldSetData['mineMatchFee'] = 0;
                this.goldSetData['mineFeeIndex'] = 0;
                this.goldSetData['matchTime'] = 0;
                this.goldSetData['matchFee'] = 0;
                this.goldSetData['feeRate1'] = 0;
                this.goldSetData['feeRate2'] = 0;

                this.upGoldValShow();

                // 重新获取数据
                this.getTeaHouseDatas();
            } else {
                cc.dlog('NOTIFY_GOLD_MATCH_OPEN 失败');
            }
        }
    }

    //主推金币场暂停或者恢复
    on_NOTIFY_GOLD_MATCH_PAUSE(resp) {
        {/*
            //主推金币场暂停或者恢复
            //@api:2298,@type:resp
            message  NotifyGoldMatchPauseResp{
                int32    teaHouseId=1;//茶馆Id
                bool     matchPause=2;//金币场是否暂停(true 暂停,false恢复)
                    
            }
        */}


        // @ts-ignore
        if (!resp.err || resp.err == PB.ERROR.OK) {
            cc.dlog('NOTIFY_GOLD_MATCH_PAUSE');
            if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                cc.dlog('NOTIFY_GOLD_MATCH_PAUSE 失败1');
                return;
            }

            let d = TeaClass.instance.goldSetData;
            d['matchPause']=resp.matchPause;

        } else {
            cc.dlog('NOTIFY_GOLD_MATCH_PAUSE 失败');
        }
    }


    //主推解散茶馆
    on_NOTIFY_DISBAND_TEA_HOUSE(resp) {
        {/*
            //主推解散茶馆
            //@api:2233,@type:resp
            message  NotifyDisbandTeaHouseResp{
                    int32    teaHouseId = 1;//茶馆Id
            }
        */}

        cc.dlog("踢出亲友圈", resp)
        if (resp.teaHouseId == this.teaHouseId) {
            this.doExitTea(resp)
        }
    }

    doExitTea(resp) {
        // @ts-ignore
        if (!resp.err || resp.err == PB.ERROR.OK) {
            cc.dlog('NOTIFY_DISBAND_TEA_HOUSE');
            if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                cc.dlog('NOTIFY_DISBAND_TEA_HOUSE 失败1');
                return;
            }

            // @ts-ignore
            cc.g.hallMgr.backFromTeaToHall();
            // @ts-ignore
            cc.g.ggjiesan = true;
        } else {
            cc.dlog('NOTIFY_DISBAND_TEA_HOUSE 失败2');
        }
    }

    //主推金币补偿提示
    on_NOTIFY_GOLD_COMPENSATE_TIPS(resp) {
        {/*
            //金币场补偿提示
            //@api:2320,@type:resp
            message NotifyGoldCompensateTipsResp{
                int32 teaHouseId=1;//茶馆Id
                int64 leaderId=2;//操作人Id
                string leaderName=3;//操作人昵称
                bool  add=4;//true 补偿 false 扣除
                int32 gold=5;//金币
            }
        */}

        cc.dlog("金币场补偿提示", resp)
        if (resp.teaHouseId != this.teaHouseId) {
            return
        }

        // @ts-ignore
        let str = resp.add ? `${resp.leaderName}补偿你${cc.g.utils.realNum1(resp.gold)}积分!`:`${resp.leaderName}处罚你${cc.g.utils.realNum1(resp.gold)}积分!`;
        
        // @ts-ignore
        cc.g.global.showTipBox(str, ()=>{
        });
    }

    // on_NOTIFY_APPLY_TEA_HOUSE(resp) {
    //     cc.dlog("收到增加桌子", resp)
    //     // 1 加入 2 退出
    //     let applyType = resp.applyType
    //     if (applyType == 1) {
    //         this.teaChenYuan.doShowNoticeThree(true)
    //     } else if (applyType == 2) {
    //         this.teaChenYuan.doShowNoticeFour(true)
    //     }
    //
    //     this.doShowNoticeCy(true)
    //
    //
    //     // this.applyExitCount = 0;
    //     // this.applyJoinCount = 0;
    //     // this.applyGoldMathCount = 0;
    //     //
    //     //
    //     // this.doShowNoticeMore(false)
    // }

    on_NOTIFY_TEA_HOUSE_APPLY_COUNT(resp) {
        cc.dlog("收到增加桌子", resp)
        // 1 加入 2 退出 3 进彼此
        let applyType = resp.applyType
        let applyCount = resp.applyCount
        if (applyType == 1) {
            this.applyJoinCount = applyCount;
            // if (applyCount > 0) {
            //     this.getTeaChenYuan().doShowNoticeThree(true)
            //     this.doShowNoticeCy(true)
            // } else {
            //     this.getTeaChenYuan().doShowNoticeThree(false)
            //     this.doShowNoticeCy(false)
            // }
        } else if (applyType == 2) {
            this.applyExitCount = applyCount;
            // if (applyCount > 0) {
            //     this.getTeaChenYuan().doShowNoticeFour(true)
            //     this.doShowNoticeCy(true)
            // } else {
            //     this.getTeaChenYuan().doShowNoticeFour(false)
            //     this.doShowNoticeCy(false)
            // }

        } else if (applyType == 3) {
            this.applyGoldMathCount = applyCount;
            // if (applyCount > 0) {
            //     this.getTeaChenYuan().doShowNoticeFour(true)
            //     this.doShowNoticeMore(true)
            // } else {
            //     this.getTeaChenYuan().doShowNoticeFour(false)
            //     this.doShowNoticeMore(false)
            // }
        }
    }

    // =========== 推送相关 ===================================================================================
}



// class ListAdapter extends AbsAdapter {
//     updateView(item: cc.Node, posIndex: number) {
//         let comp = item.getComponent(ListItemComp);
//         cc.dlog('posIndex-->' + posIndex)
//         if (comp) {
//             comp.setData(this.getItem(posIndex));
//         }
//     }
// }
//
