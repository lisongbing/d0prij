// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import TeaClass from "../tea";
import TeaChenYuanSetting from "./tea_cylb_cz";
import ChenYuanZhanDui from "./tea_zd_cz";
import TeaZhanDuiAdd from "./tea_zdly_cz_tjdz";
import TeaZhanDuiCaoZuo from "./tea_zdlb_cz";
import TeaZhanDuiCsql from "./tea_csql";
import TeaZhanDuiCaoZuoSec from "./tea_zdlb_czsec";
import TeaFenPeiCy from "./tea_fenpeixiaozu";
import TeaChangeRemark from "./tea_xiugaibeizhu";
import TeaBaoXianZhi from "./tea_bxxz";
import TeaAlertDialog from "./tea_tongyongtanchuang";
import TeaCyDaoRu from "./tea_qyqdr";
import TeaHeader from "./tea_head";
import TeaFanBiChange from "./tea_fanbichang";
import ListView, {AbsAdapter} from "../../components/ListView";
import TeaZdLbShuJu from "./tea_cylb_shuju";
import TeaZdLbNextShuJu from "./tea_zdlb_next_shuju";
import TeaZdLbChuRu from "./tea_cy_cr_item";
import TeaZdLbShenPi from "./tea_cy_sp_item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaChenYuan extends cc.Component {
    static instance: TeaChenYuan = null;
    public position: number = 0;
    private headerTabNode: cc.Node;

    private sprite_Notice3: cc.Node;
    private sprite_Notice4: cc.Node;

    private headerTabNodeArr: any[] = [];
    private curTabIndex: number = 1;
    private contentNode: cc.Node;
    private contentNodeArr: any[] = [];
    private scollerNodeArr: any[] = [];
    private searchId: string;
    nameEditBox: cc.EditBox = null;
    // public teaHouseId: string = null;
    private pageOneNum: number = 1;
    private totalOnePage: number = 1;
    private p1_olnum: any = null;

    private pageTwoNum: number = 1;
    private totalTwoPage: number = 1;

    private pageThreeNum: number = 1;
    private totalThreePage: number = 1;

    private pageFourNum: number = 1;
    private totalFourPage: number = 1;

    // private pageFiveNum: number = 0;
    // private totalFivePage: number = 1;

    private pageSize: number = 20;
    // private teamId: number = 0;
    public teamNextId: number = 0;
    private searchUp: boolean = false;
    private zdStepNum: number = 0;
    public createPosition: number = 0;
    public curPosition: number = 0;
    public icon: string = '';
    public name: string = '';
    public curUserId: number = 0;

    public sortKey: number = 0;
    public sortKeyOne: number = 0;
    public sortKeyTwo: number = 0;
    public sortKeyThree: number = 0;

    public teamNolist: any[] = [];
    public groupName: string = null;

    public ownerName: string = null;
    public doShowCyCaoBtn: boolean = false;
    //  战队添加人的类型
    // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
    public zdSearchType: number = 0;
    public zdCsqlItem: any;
    // 点击操作时候
    public teamIdCaoZuo: number = 0;

    public jjx: any = {};

    @property(cc.Prefab)
    chengYanListPre: cc.Prefab = null;

    @property(cc.Prefab)
    chengZhanDuiListPre: cc.Prefab = null;

    @property(cc.Prefab)
    chengSpListPre: cc.Prefab = null;

    @property(cc.Prefab)
    chengCrListPre: cc.Prefab = null;

    @property(cc.Prefab)
    chengZhanDuiNextListPre: cc.Prefab = null;

    @property(cc.Prefab)
    chengYuanGlPre: cc.Prefab = null;
    chengYuanGlPreNode: cc.Node = null;
    teaChenYuanSetting: TeaChenYuanSetting = null;

    @property(cc.Prefab)
    chengYuanZdPre: cc.Prefab = null;
    chengYuanZdPreNode: cc.Node = null;
    chenYuanZhanDui: ChenYuanZhanDui = null;

    @property(cc.Prefab)
    chengYuanZdAddPre: cc.Prefab = null;
    chengYuanZdAddPreNode: cc.Node = null;
    teaZhanDuiAdd: TeaZhanDuiAdd = null;

    @property(cc.Prefab)
    chengYuanZdCzPre: cc.Prefab = null;
    chengYuanZdCzPreNode: cc.Node = null;
    teaZhanDuiCaoZuo: TeaZhanDuiCaoZuo = null;


    @property(cc.Prefab)
    chengYuanZdCzSecPre: cc.Prefab = null;
    chengYuanZdCzSecPreNode: cc.Node = null;
    teaZhanDuiCaoZuoSec: TeaZhanDuiCaoZuoSec = null;


    @property(cc.Prefab)
    zhanDuiCsqlPre: cc.Prefab = null;
    zhanDuiCsqlPreNode: cc.Node = null;
    teaZhanDuiCsql: TeaZhanDuiCsql = null;

    // 选中小对
    @property(cc.Prefab)
    teaFenPeiCyPre: cc.Prefab = null;
    teaFenPeiCyPreNode: cc.Node = null;
    teaFenPeiCy: TeaFenPeiCy = null;

    // 修改备注
    @property(cc.Prefab)
    teaChangeRemarkPre: cc.Prefab = null;
    teaChangeRemarkPreNode: cc.Node = null;
    teaChangeRemark: TeaChangeRemark = null;

    // 包厢限制
    @property(cc.Prefab)
    teaBaoXianZhiPre: cc.Prefab = null;
    teaBaoXianZhiPreNode: cc.Node = null;
    teaBaoXianZhi: TeaBaoXianZhi = null;


    // 操作对话
    @property(cc.Prefab)
    teaAlertDialogPre: cc.Prefab = null;
    teaAlertDialogPreNode: cc.Node = null;
    teaAlertDialog: TeaAlertDialog = null;

    // 成员导入
    @property(cc.Prefab)
    teaCyDaoRuPre: cc.Prefab = null;
    teaCyDaoRuPreNode: cc.Node = null;
    teaCyDaoRu: TeaCyDaoRu = null;

    // 关联ID
    @property(cc.Prefab)
    teaGuanlianIDPre: cc.Prefab = null;
    dlgGlid: any = null;

    // 个人信息
    @property(cc.Prefab)
    teaHeaderPre: cc.Prefab = null;
    teaHeaderPreNode: cc.Node = null;
    teaHeader: TeaHeader = null;

    // 反比对话
    @property(cc.Prefab)
    teaFbDialogPre: cc.Prefab = null;
    teaFbDialogPreNode: cc.Node = null;
    teaFbDialog: TeaFanBiChange = null;

    @property(ListView)
    listOneView: ListView = null;
    public listOneAdapter: ListOneAdapter = null;
    public listOneArr: any[] = [];

    @property(ListView)
    listTwoView: ListView = null;
    public listTwoAdapter: ListTwoAdapter = null;
    public listTwoArr: any[] = [];

    @property(ListView)
    listThreeView: ListView = null;
    public listThreeAdapter: ListThreeAdapter = null;
    public listThreeArr: any[] = [];

    @property(ListView)
    listFourView: ListView = null;
    public listFourAdapter: ListFourAdapter = null;
    public listFourArr: any[] = [];

    // @property(ListView)
    // listFiveView: ListView = null;
    // public listFiveAdapter: ListFiveAdapter = null;
    // public listFiveArr: any[] = [];

    onLoad () {
        TeaChenYuan.instance = this;
        // int32   teamId=2;//战队Id
        // position: 71
        // 圈主/超管	全部显示 0
        // 管理员	成员列表、申请审批 没有队员界面
        // 队长	成员列表、我的战队  从大厅获取 teamId
        // 组长	成员列表、我的小组 从大厅获取 teamId
        // 小组长	成员列表、我的小组 从大厅获取 teamId
        // 推荐人	成员列表、我的小组 从大厅获取 teamId
        // 普通成员	成员列表  没有队员界面
        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        // 俱乐部名字输入框
        this.nameEditBox = cc.find("Node_Header/Node_Seach/Seach_EditBox", this.node).getComponent(cc.EditBox);

        this.initViews();

        this.initPres()

        let searchNode = cc.find("Node_Header/Node_Seach", this.node)
        // @ts-ignore
        searchNode.active = !cc.g.utils.getWeChatOs()

        if (TeaClass.instance.applyJoinCount > 0) {
            this.doShowNoticeThree(true)
        } else {
            this.doShowNoticeThree(false)
        }

        if (TeaClass.instance.applyExitCount > 0) {
            this.doShowNoticeFour(true)
        } else {
            this.doShowNoticeFour(false)
        }
    }

    onEnable () {
        this.doGetListDatas();
    }

    initPres() {

        if (this.chengYuanGlPreNode == null) {
            this.chengYuanGlPreNode = cc.instantiate(this.chengYuanGlPre);
            this.chengYuanGlPreNode.active = true;
            this.node.addChild(this.chengYuanGlPreNode);
            this.teaChenYuanSetting = this.chengYuanGlPreNode.getComponent('tea_cylb_cz');
            this.chengYuanGlPreNode.active = false;
        }

        // 战队添加按钮
        if (this.chengYuanZdPreNode == null) {
            this.chengYuanZdPreNode = cc.instantiate(this.chengYuanZdPre);
            this.chengYuanZdPreNode.active = true;
            this.node.addChild(this.chengYuanZdPreNode);
            this.chenYuanZhanDui = this.chengYuanZdPreNode.getComponent('tea_zd_cz');
            this.chengYuanZdPreNode.active = false;
        }

        // 战队添加队员
        if (this.chengYuanZdAddPreNode == null) {
            this.chengYuanZdAddPreNode = cc.instantiate(this.chengYuanZdAddPre);
            this.chengYuanZdAddPreNode.active = true;
            this.node.addChild(this.chengYuanZdAddPreNode);
            this.teaZhanDuiAdd = this.chengYuanZdAddPreNode.getComponent('tea_zdly_cz_tjdz');
            this.chengYuanZdAddPreNode.active = false;
        }

        // 战队按钮操作
        if (this.chengYuanZdCzPreNode == null) {
            this.chengYuanZdCzPreNode = cc.instantiate(this.chengYuanZdCzPre);
            this.chengYuanZdCzPreNode.active = true;
            this.node.addChild(this.chengYuanZdCzPreNode);
            this.teaZhanDuiCaoZuo = this.chengYuanZdCzPreNode.getComponent('tea_zdlb_cz');
            this.chengYuanZdCzPreNode.active = false;
        }


        // 战队按钮操作二级
        if (this.chengYuanZdCzSecPreNode == null) {
            this.chengYuanZdCzSecPreNode = cc.instantiate(this.chengYuanZdCzSecPre);
            this.chengYuanZdCzSecPreNode.active = true;
            this.node.addChild(this.chengYuanZdCzSecPreNode);
            this.teaZhanDuiCaoZuoSec = this.chengYuanZdCzSecPreNode.getComponent('tea_zdlb_czsec');
            this.chengYuanZdCzSecPreNode.active = false;
        }

        // 战队按钮操作
        if (this.zhanDuiCsqlPreNode == null) {
            this.zhanDuiCsqlPreNode = cc.instantiate(this.zhanDuiCsqlPre);
            this.zhanDuiCsqlPreNode.active = true;
            this.node.addChild(this.zhanDuiCsqlPreNode);
            this.teaZhanDuiCsql = this.zhanDuiCsqlPreNode.getComponent('tea_csql');
            this.zhanDuiCsqlPreNode.active = false;
        }

        // 选中小对
        if (this.teaFenPeiCyPreNode == null) {
            this.teaFenPeiCyPreNode = cc.instantiate(this.teaFenPeiCyPre);
            this.teaFenPeiCyPreNode.active = true;
            this.node.addChild(this.teaFenPeiCyPreNode);
            this.teaFenPeiCy = this.teaFenPeiCyPreNode.getComponent('tea_fenpeixiaozu');
            this.teaFenPeiCyPreNode.active = false;
        }

        // 修改备注
        if (this.teaChangeRemarkPreNode == null) {
            this.teaChangeRemarkPreNode = cc.instantiate(this.teaChangeRemarkPre);
            this.teaChangeRemarkPreNode.active = true;
            this.node.addChild(this.teaChangeRemarkPreNode);
            this.teaChangeRemark = this.teaChangeRemarkPreNode.getComponent('tea_xiugaibeizhu');
            this.teaChangeRemarkPreNode.active = false;
        }

        // 包厢限制
        if (this.teaBaoXianZhiPreNode == null) {
            this.teaBaoXianZhiPreNode = cc.instantiate(this.teaBaoXianZhiPre);
            this.teaBaoXianZhiPreNode.active = true;
            this.node.addChild(this.teaBaoXianZhiPreNode);
            this.teaBaoXianZhi = this.teaBaoXianZhiPreNode.getComponent('tea_bxxz');
            this.teaBaoXianZhiPreNode.active = false;
        }

        // 包厢限制
        if (this.teaAlertDialogPreNode == null) {
            this.teaAlertDialogPreNode = cc.instantiate(this.teaAlertDialogPre);
            this.teaAlertDialogPreNode.active = true;
            this.node.addChild(this.teaAlertDialogPreNode);
            this.teaAlertDialog = this.teaAlertDialogPreNode.getComponent('tea_tongyongtanchuang');
            this.teaAlertDialogPreNode.active = false;
        }

        // 成员导入
        if (this.teaCyDaoRuPreNode == null) {
            this.teaCyDaoRuPreNode = cc.instantiate(this.teaCyDaoRuPre);
            this.teaCyDaoRuPreNode.active = true;
            this.node.addChild(this.teaCyDaoRuPreNode);
            this.teaCyDaoRu = this.teaCyDaoRuPreNode.getComponent('tea_qyqdr');
            this.teaCyDaoRuPreNode.active = false;
        }

        // 关联ID
        if (this.dlgGlid == null) {
            this.dlgGlid = cc.instantiate(this.teaGuanlianIDPre).getComponent('tea_glid');
            this.node.addChild(this.dlgGlid.node);
            this.dlgGlid.node.active = false;
        }

        // 个人信息
        if (this.teaHeaderPreNode == null) {
            this.teaHeaderPreNode = cc.instantiate(this.teaHeaderPre);
            this.teaHeaderPreNode.active = true;
            this.node.addChild(this.teaHeaderPreNode);
            this.teaHeader = this.teaHeaderPreNode.getComponent('tea_head');
            this.teaHeaderPreNode.active = false;
        }

        // 反比对话
        if (this.teaFbDialogPreNode == null) {
            this.teaFbDialogPreNode = cc.instantiate(this.teaFbDialogPre);
            this.teaFbDialogPreNode.active = true;
            this.node.addChild(this.teaFbDialogPreNode);
            this.teaFbDialog = this.teaFbDialogPreNode.getComponent('tea_fanbichang');
            this.teaFbDialogPreNode.active = false;
        }
    }

    initHeaderTwoAndFive(isTwo, pItem) {
        let cardNode = cc.find("Node_View2/tea_zdlb_bt/Node_Content", this.contentNode)
        // if (isTwo) {
        //     cardNode = cc.find("Node_View2/tea_zdlb_bt/Node_Content", this.contentNode)
        //     // cardNode = cc.find("Node_View2/tea_zdlb_bt/Node_Content", this.contentNode)
        // } else {
        //     cardNode = cc.find("Node_View5/tea_zdlb_bt/Node_Content", this.contentNode)
        // }

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let headerImage = cc.find("Sprite_QZ", cardNode).getComponent(cc.Sprite);
        if (pItem.position == 71) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qz');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 61) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 51) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mg');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 41) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dz');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 31) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzz');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 21) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zz');
            headerImage.spriteFrame = spriteFrame;
        } else if (pItem.position == 11) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_rem');
            headerImage.spriteFrame = spriteFrame;
        }

        let Label_Name = cc.find("Label_Name", cardNode).getComponent(cc.Label);
        Label_Name.string = pItem.name

        let Label_ID = cc.find("Label_ID", cardNode).getComponent(cc.Label);
        Label_ID.string = pItem.userId

        let Label_Gxl = cc.find("Label_Gxl", cardNode).getComponent(cc.Label);
        Label_Gxl.string = pItem.score

        // 反比
        let New_Label_FB = cc.find("New_Label_FB", cardNode).getComponent(cc.Label);
        // 反比
        let Label_wdfb = cc.find("Label_wdfb", cardNode).getComponent(cc.Label);
        
        if (this.zdStepNum == 0) {
            if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
                New_Label_FB.node.active = false
                Label_wdfb.node.active = false
            } else {
                New_Label_FB.node.active = true
                Label_wdfb.node.active = true
                // @ts-ignore
                Label_wdfb.string = cc.g.utils.fixNum1(pItem.contributeRate) + '%'
            }
        } else {
            New_Label_FB.node.active = true
            Label_wdfb.node.active = true
            // @ts-ignore
            Label_wdfb.string = cc.g.utils.fixNum1(pItem.contributeRate) + '%'
        }

        let isGoldOpen = TeaClass.instance.SettingData['isGoldOpen']
        if (!isGoldOpen) {
            New_Label_FB.node.active = false
            Label_wdfb.node.active = false
        }

        let Label_YXpj = cc.find("Label_YXpj", cardNode).getComponent(cc.Label);

        let effectCount = pItem.effectCount
        Label_YXpj.string = effectCount.toFixed(2);

        let Label_Dyj = cc.find("Label_Dyj", cardNode).getComponent(cc.Label);
        let windCount = pItem.winCount
        Label_Dyj.string = windCount.toFixed(2);

        let Label_Zjs = cc.find("Label_Zjs", cardNode).getComponent(cc.Label);
        let totalGameCount = pItem.totalGameCount
        Label_Zjs.string = totalGameCount.toFixed(2);
    }

    onScrollBottomOneEvent() {
        cc.dlog('成员滑动到底。。。。')
        // 当前页码小于总页码，才请求
        if (this.pageOneNum < this.totalOnePage) {
            this.pageOneNum++;
            this.doRealSearchChenYuanList();
        }
    }

    onScrollBottomTwoPlusEvent() {
        if (this.zdStepNum == 0) {
            this.onScrollBottomTwoEvent()
        } else {
            this.onScrollBottomFiveEvent()
        }
    }

    onScrollBottomTwoEvent() {
        cc.dlog('战队滑动到底。。。。')
        // 当前页码小于总页码，才请求
        if (this.pageTwoNum < this.totalTwoPage) {
            this.pageTwoNum++;
            this.doRealSearchZhanDuiList();
        }
    }

    onScrollBottomThreeEvent() {
        cc.dlog('审批滑动到底。。。。')
    }

    onScrollBottomFourEvent() {
        cc.dlog('出入滑动到底。。。。')
    }

    onScrollBottomFiveEvent() {
        cc.dlog('圈子滑动到底。。。。')
        // 当前页码小于总页码，才请求
        if (this.pageTwoNum < this.totalTwoPage) {
            if (this.searchUp) {
                this.doRealGetZhanDuiPreList();
            } else {
                this.doRealGetZhanDuiSecList();
            }
        }
    }

    initListView() {
        this.listOneAdapter = new ListOneAdapter()
        this.listOneAdapter.setDataSet(this.listOneArr);
        this.listOneView.setAdapter(this.listOneAdapter);

        // this.listOneView.pullDown(() => {
        //     cc.dlog("你已经上拉到最顶端了.");
        //
        // }, this);
        this.listOneView.pullUp(() => {
            cc.dlog("你已经下拉到最底端了.")
            this.onScrollBottomOneEvent()
        }, this);

        this.listTwoAdapter = new ListTwoAdapter()
        this.listTwoAdapter.setDataSet(this.listTwoArr);
        this.listTwoView.setAdapter(this.listTwoAdapter);

        // this.listTwoView.pullDown(() => {
        //     cc.dlog("你已经上拉到最顶端了.");
        // }, this);
        this.listTwoView.pullUp(() => {
            cc.dlog("你已经下拉到最底端了.")
            this.onScrollBottomTwoPlusEvent()
        }, this);

        this.listThreeAdapter = new ListThreeAdapter()
        this.listThreeAdapter.setDataSet(this.listThreeArr);
        this.listThreeView.setAdapter(this.listThreeAdapter);

        this.listFourAdapter = new ListFourAdapter()
        this.listFourAdapter.setDataSet(this.listFourArr);
        this.listFourView.setAdapter(this.listFourAdapter);

        // this.listFiveAdapter = new ListFiveAdapter()
        // this.listFiveAdapter.setDataSet(this.listFiveArr);
        // this.listFiveView.setAdapter(this.listFiveAdapter);
        //
        // // this.listFiveView.pullDown(() => {
        // //     cc.dlog("你已经上拉到最顶端了.");
        // // }, this);
        // this.listFiveView.pullUp(() => {
        //     cc.dlog("你已经下拉到最底端了.")
        //     this.onScrollBottomFiveEvent()
        // }, this);
    }

    initViews () {
        // 滑动content
        this.contentNode = cc.find("Node_Content", this.node)
        // let scrollViewEventArr = [this.onScrollBottomOneEvent, this.onScrollBottomTwoEvent, this.onScrollBottomThreeEvent, this.onScrollBottomFourEvent, this.onScrollBottomFiveEvent]
        for (let i = 0; i < 5; i++) {
            let contNode = this.contentNode.getChildByName("Node_View" + (i + 1))
            if (i == 0) {
                contNode.active = true;
            } else {
                contNode.active = false;
            }

            this.contentNodeArr.push(contNode)

            // let scrollView = cc.find("ScrollView_Content", contNode).getComponent(cc.ScrollView);
            //
            // // scroll-to-right 注意：此事件是从
            // scrollView.node.on('scroll-to-bottom', scrollViewEventArr[i], this);
            // this.scollerNodeArr.push(scrollView)

            if (i==0) {
                let p = TeaClass.instance.position;
                if (p==1) {
                    cc.find("tea_cylb_bt/Node_Header/Node_olrenshu", contNode).active = false;
                }

                this.p1_olnum = cc.find("tea_cylb_bt/Node_Header/Node_olrenshu/num", contNode).getComponent(cc.Label);
            }
        }

        this.initListView()

        this.headerTabNode = cc.find("Node_Header/Node_Center", this.node)

        // notice
        this.sprite_Notice3 = cc.find("Node_Header/Node_Center/tea_cy_top_item3/Sprite_Notice", this.node)
        this.sprite_Notice3.active = false
        this.sprite_Notice4 = cc.find("Node_Header/Node_Center/tea_cy_top_item4/Sprite_Notice", this.node)
        this.sprite_Notice4.active = false

        for (let i = 0; i < 5; i++) {
            let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item" + (i + 1))
            cardNode.active = true;
            this.headerTabNodeArr.push(cardNode)
        }

        if (TeaClass.instance.position == 51) { //成员列表、申请审批
            this.headerTabNodeArr[1].active = false
            this.headerTabNodeArr[3].active = false
            this.headerTabNodeArr[4].active = false

            // this.contentNodeArr[1].active = false
            // this.contentNodeArr[3].active = false
            // this.contentNodeArr[4].active = false
        } else if ((TeaClass.instance.position == 41) || (TeaClass.instance.position == 31) || (TeaClass.instance.position == 21) || (TeaClass.instance.position == 11)) { //成员列表、我的战队
            this.headerTabNodeArr[2].active = false
            this.headerTabNodeArr[3].active = false
            this.headerTabNodeArr[4].active = false

            // this.contentNodeArr[2].active = false
            // this.contentNodeArr[3].active = false
            // this.contentNodeArr[4].active = false
        } else if (TeaClass.instance.position == 1) { //成员列表
            this.headerTabNodeArr[1].active = false
            this.headerTabNodeArr[2].active = false
            this.headerTabNodeArr[3].active = false
            this.headerTabNodeArr[4].active = false

            // this.contentNodeArr[1].active = false
            // this.contentNodeArr[2].active = false
            // this.contentNodeArr[3].active = false
            // this.contentNodeArr[4].active = false
        }

        // 警戒线
        this.jjx.node = cc.find("jjx", this.node);
        this.jjx.Button_bc = cc.find('jjx/Button_bc', this.node);
        this.jjx.eb = cc.find('jjx/EditBox_jjx', this.node).getComponent(cc.EditBox);
        this.jjx.zf = cc.find('jjx/zf/Label_zf', this.node).getComponent(cc.Label);
        this.jjx.node.active = false;
    }

    doResetHeaderTabCheck() {
        for (let i = 0; i < 5; i++) {
            let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item" + (i + 1))
            let checkmark = cc.find("New Toggle/checkmark", cardNode)
            checkmark.active = false
        }

        for (let i = 0; i < this.contentNodeArr.length; i++) {
            let contNode = this.contentNodeArr[i]
            contNode.active = false;
        }
    }

    doShowNoticeThree(show) {
        if (this.sprite_Notice3 != null) {
            this.sprite_Notice3.active = show
        }
    }

    doShowNoticeFour(show) {
        if (this.sprite_Notice4 != null) {
            this.sprite_Notice4.active = show
        }
    }

    doResetConteNode() {
        for (let i = 0; i < this.contentNodeArr.length; i++) {
            let contNode = this.contentNodeArr[i]
            contNode.active = false;
        }
    }

    doResetHeaderFiveTabCheck() {
        let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item5")
        let checkmark = cc.find("New Toggle/checkmark", cardNode)
        checkmark.active = false
    }

    createChenYuanListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.chengYanListPre);

                // 头像
                let headerImage = cc.find("Node_Cell/Sprite_Header", cardNode).getComponent(cc.Sprite);
                // if (pItem.icon.length > 4) {
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                let headerButton = cc.find("Node_Cell/HeaderButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(headerButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(headerButton, this, 'tea_chengyuan', 'doHeaderClicked', pItem);

                let te_cy_header_er = cc.find("Node_Cell/te_cy_header_er", cardNode)
                if (pItem.onlyTwoPeople) {
                    te_cy_header_er.active = true
                } else {
                    te_cy_header_er.active = false
                }

                let te_cy_header_jing = cc.find("Node_Cell/te_cy_header_jing", cardNode)
                if (pItem.forbidGame) {
                    te_cy_header_jing.active = true
                } else {
                    te_cy_header_jing.active = false
                }

                // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                let te_cy_header_qz = cc.find("Node_Cell/te_cy_header_qz", cardNode).getComponent(cc.Sprite)
                te_cy_header_qz.node.active = true
                if (pItem.position == 71) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qz');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 61) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 51) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mg');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 41) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dz');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 31) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzz');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 21) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zz');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 11) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_rem');
                    te_cy_header_qz.spriteFrame = spriteFrame;
                } else if (pItem.position == 1) {
                    te_cy_header_qz.node.active = false
                    // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
                    // te_cy_header_qz.spriteFrame = spriteFrame;
                } else {
                    te_cy_header_qz.node.active = false
                }


                let name = cc.find("Node_Cell/Label_Name", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("Node_Cell/Label_ID", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let nameGroup = cc.find("Node_Cell/Label_Group", cardNode).getComponent(cc.Label);
                // 队-组-小组-推荐
                let groupName = pItem.groupName
                let relGroupName = ''
                // @ts-ignore
                if (!cc.g.utils.judgeStringEmpty(groupName)) {
                    let groupTxtArr = ["队/", "组/", "小组/", "推荐"]
                    let groupNameArr = groupName.split("_")
                    for (let i = 0; i < groupNameArr.length; i++) {
                        relGroupName += groupNameArr[i]
                        relGroupName += groupTxtArr[i]
                    }
                } else {
                    relGroupName = '';
                }

                nameGroup.string = relGroupName

                // offlineTime
                // int32     status=10;//状态(0 空闲 1 游戏中 2比赛中)
                let nameStatus = cc.find("Node_Cell/Label_Status", cardNode).getComponent(cc.Label);
                if (pItem.online) {
                    if (pItem.status == 0) {
                        nameStatus.string = "空闲"
                    } else if (pItem.status == 1) {
                        nameStatus.string = "游戏中"
                    } else if (pItem.status == 2) {
                        nameStatus.string = "比赛中"
                    }
                } else {
                    let minu = 60;
                    let hour = 60 * 60
                    let day = 60 * 60 * 24
                    let offlineTime = pItem.offlineTime
                    if (offlineTime > 0) {
                        if ((offlineTime > minu) && (offlineTime < hour)) {
                            let relMinu = offlineTime/minu;
                            let relTimer = Math.ceil(relMinu)
                            nameStatus.string = "离线" + relTimer + "分钟"
                        } else if ((offlineTime > hour) && (offlineTime < day)) {
                            let relMinu = offlineTime/hour;
                            let relTimer = Math.ceil(relMinu)
                            nameStatus.string = "离线" + relTimer + "小时"
                        } else if ((offlineTime >= day)) {
                            let relMinu = offlineTime/day;
                            let relTimer = Math.ceil(relMinu)
                            nameStatus.string = "离线" + relTimer + "天"
                        }
                    } else {
                        nameStatus.string = "离线" + 1 + "分钟"
                    }
                }

                let nameSh = cc.find("Node_Cell/Label_Shei", cardNode).getComponent(cc.Label);
                nameSh.string = pItem.reviewerName

                pItem.showExit = false;
                let tyBtn = cc.find("Node_Cell/Button_Guli", cardNode).getComponent(cc.Button);
                tyBtn.node.active = true;
                // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                if (pItem.position == 71) {
                    if (TeaClass.instance.position == pItem.position) {
                        tyBtn.node.active = false;
                    } else {
                        tyBtn.node.active = true;
                    }
                } else if ((pItem.position == 61) || (pItem.position == 51) ||
                    (pItem.position == 41) || (pItem.position == 31) ||
                    (pItem.position == 21) || (pItem.position == 11) || (pItem.position == 1)) {
                    // @ts-ignore
                    if (eq64(cc.g.userMgr.userId, pItem.userId)) {
                        // let btnSprt = cc.find("te_cy_header_mag", tyBtn.node).getComponent(cc.Sprite)
                        // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('tea_logout_de');
                        // btnSprt.spriteFrame = spriteFrame;
                        pItem.showExit = true;
                        let backgroundNode = tyBtn.node.getChildByName("Background")
                        backgroundNode.getChildByName("New Label").getComponent(cc.Label).string = "退出";
                    }
                }

                if (!pItem.showExit) {
                    if (TeaClass.instance.position <= pItem.position) {
                        tyBtn.node.active = false;
                    }
                }

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_chengyuan', 'chengYuanSetting', pItem);
                // add
                scrollView.content.addChild(cardNode, 0);
            })
        }
    }
    doHeaderClicked(event, item) {
        cc.dlog(item)
        this.teaHeader.initDatas(item);
        this.teaHeaderPreNode.active = true
    }

    createZhanDuiListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.chengZhanDuiListPre);
                // 头像
                let headerImage = cc.find("Node_Content/Sprite_Header", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                // if (pItem.icon.length > 4) {
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                let number = cc.find("Node_Content/Tea_Number", cardNode).getComponent(cc.Label);
                if (pItem.teamNo <= 0) {
                    number.string = ''
                } else {
                    number.string = pItem.teamNo
                }

                let name = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let Zong_Label = cc.find("Node_Content/Zong_Label", cardNode).getComponent(cc.Label);
                let totalGameCount = pItem.totalGameCount
                Zong_Label.string = totalGameCount.toFixed(2);

                let Eff_Label = cc.find("Node_Content/Eff_Label", cardNode).getComponent(cc.Label);

                let effectCount = pItem.effectCount
                Eff_Label.string = effectCount.toFixed(2);


                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                let windCount = pItem.winCount;
                Win_Label.string = windCount.toFixed(2);

                let Gongxi_Label = cc.find("Node_Content/Gongxi_Label", cardNode).getComponent(cc.Label);
                Gongxi_Label.string = pItem.contribute

                let Ceaate_Timer_Label = cc.find("Node_Content/Ceaate_Timer_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Ceaate_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.createTime*1000));

                let Clear_Timer_Label = cc.find("Node_Content/Clear_Timer_Label", cardNode).getComponent(cc.Label);
                if (pItem.zeroTime == 0) {
                    Clear_Timer_Label.string = '暂无'
                } else {
                    // @ts-ignore
                    Clear_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.zeroTime*1000));
                }


                let cellBtn = cc.find("Cell_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellBtn, this, 'tea_chengyuan', 'zhanDuiCellBtn', pItem);


                let tyBtn = cc.find("Node_Content/Cao_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_chengyuan', 'zhanDuiCaoZuo', pItem);
                // add
                scrollView.content.addChild(cardNode, 0);
            })
        }
    }

    createCySpDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            this.doShowNoticeThree(true)
            TeaClass.instance.doShowNoticeCy(true)
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.chengSpListPre);
                // 头像
                let headerImage = cc.find("Node_Content/Sprite_Header", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                // if (pItem.icon.length > 4) {
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                let name = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let Zong_Label = cc.find("Node_Content/Zong_Label", cardNode).getComponent(cc.Label);
                Zong_Label.string = '亲友圈ID搜索'

                let Eff_Label = cc.find("Node_Content/Eff_Label", cardNode).getComponent(cc.Label);
                Eff_Label.string = this.ownerName//pItem.effectCount


                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Win_Label.string = cc.g.utils.getFormatTimeNYR(['.','.','\n',':',':',], new Date(pItem.time*1000));

                let Gongxi_Label = cc.find("Node_Content/Gongxi_Label", cardNode).getComponent(cc.Label);
                Gongxi_Label.string = pItem.complainCount

                // let Ceaate_Timer_Label = cc.find("Node_Content/Ceaate_Timer_Label", cardNode).getComponent(cc.Label);
                // // @ts-ignore
                // Ceaate_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.createTime*1000));
                //
                // let Clear_Timer_Label = cc.find("Node_Content/Clear_Timer_Label", cardNode).getComponent(cc.Label);
                // if (pItem.zeroTime == 0) {
                //     Clear_Timer_Label.string = '暂无'
                // } else {
                //     // @ts-ignore
                //     Clear_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.zeroTime*1000));
                // }


                let cellBtn = cc.find("Node_Content/Cancel_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellBtn, this, 'tea_chengyuan', 'cyShenPiCancle', pItem);


                let tyBtn = cc.find("Node_Content/Ok_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_chengyuan', 'cyShenPiOk', pItem);
                // add
                scrollView.content.addChild(cardNode, 0);
            })
        } else {
            this.doShowNoticeThree(false)
            TeaClass.instance.doShowNoticeCy(false)
        }
    }

    cyShenPiCancle(event, item) {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.addQuanJuJue(item.userId, TeaClass.instance.teaHouseId, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                // cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作成功');
                this.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    cyShenPiOk(event, item) {
        // @ts-ignore
        cc.g.utils.btnShake();
        
        // @ts-ignore
        cc.g.hallMgr.addQuanTongYi(item.userId, TeaClass.instance.teaHouseId, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                // cc.g.global.showTipBox(MsgBoxType.Normal, '提示', '加入成功');
                this.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.showTipBox(MsgBoxType.Normal, '提示', '加入失败');
            }
        });
    }

    createCyCrDatas(dataArr, scrollView, isRemoveAll) {

        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            let showRedDot = false
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.chengCrListPre);
                // 头像
                let headerImage = cc.find("Node_Content/Sprite_Header", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);
                // if (pItem.icon.length > 4) {
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }

                let name = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let Zong_Label = cc.find("Node_Content/Zong_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                let timerStr = cc.g.utils.getFormatTimeNYR(['.','.','&',':',':',], new Date(pItem.time*1000));

                let stringArr = timerStr.split('&')

                Zong_Label.string = stringArr[1]

                let Zong_LabelOne = cc.find("Node_Content/Zong_LabeOne", cardNode).getComponent(cc.Label);
                // @ts-ignore
                // Zong_LabelOne.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.time*1000));
                Zong_LabelOne.string = stringArr[0]
                let Eff_Label = cc.find("Node_Content/Eff_Label", cardNode).getComponent(cc.Label);
                if (pItem.online) {
                    Eff_Label.string = '在线'
                    Eff_Label.node.color = new cc.Color(81, 185, 4);
                } else {
                    Eff_Label.string = '离线'
                    Eff_Label.node.color = new cc.Color(57, 56, 61);
                }

                // int32     outInType=6;//退出方式(1 主动退出 2管理员踢出)
                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                if (pItem.outInType == 1) {
                    Win_Label.string = '主动退出'
                } else if (pItem.outInType == 2) {
                    Win_Label.string = '管理员踢出'
                } else {
                    Win_Label.string = '未知'
                }


                let SpName_Label = cc.find("Node_Content/SpName_Label", cardNode).getComponent(cc.Label);
                SpName_Label.string = pItem.reviewerName

                let SpId_Label = cc.find("Node_Content/SpId_Label", cardNode).getComponent(cc.Label);
                SpId_Label.string = pItem.reviewerId

                let Gongxi_Label = cc.find("Node_Content/Gongxi_Label", cardNode).getComponent(cc.Label);
                if (pItem.operateType == 0) {
                    Gongxi_Label.node.active = true;
                } else if (pItem.operateType == 1) {
                    Gongxi_Label.string = '已同意'
                } else if (pItem.operateType == 2) {
                    Gongxi_Label.string = ''
                }

                let cellBtn = cc.find("Node_Content/Cancel_Button", cardNode).getComponent(cc.Button);


                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellBtn, this, 'tea_chengyuan', 'cyCrCancle', pItem);


                let tyBtn = cc.find("Node_Content/Ok_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_chengyuan', 'cyCrOk', pItem);

                if (pItem.operateType == 0) {
                    cellBtn.node.active = true;
                    tyBtn.node.active = true;
                    showRedDot = true
                } else if (pItem.operateType == 1) {
                    cellBtn.node.active = false;
                    tyBtn.node.active = false;
                } else if (pItem.operateType == 2) {
                    cellBtn.node.active = false;
                    tyBtn.node.active = false;
                }

                Gongxi_Label.node.active = !cellBtn.node.active;

                // add
                scrollView.content.addChild(cardNode, 0);
            })

            this.doShowNoticeFour(showRedDot)
            TeaClass.instance.doShowNoticeCy(showRedDot)
        } else {
            this.doShowNoticeFour(false)
            TeaClass.instance.doShowNoticeCy(false)
        }
    }

    cyCrCancle (event, item) {
        cc.dlog('cyCrCancle..'+item);

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.addCyCrJuJue( item.userId, TeaClass.instance.teaHouseId,(resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                // cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作成功');
                this.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    cyCrOk(event, item) {
        cc.dlog('cyCrOk..'+item);

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.addCyCrOk(item.userId, TeaClass.instance.teaHouseId, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                // cc.g.global.showTipBox(MsgBoxType.Normal, '提示', '加入成功');
                this.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.showTipBox(MsgBoxType.Normal, '提示', '加入失败');
            }
        });
    }

    createZhanDuiSecListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.chengZhanDuiNextListPre);
                // 头像
                let headerImage = cc.find("Node_Content/Sprite_Header", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);
                // if (pItem.icon.length > 4) {
                //     // @ts-ignore
                //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
                // } else {
                //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
                //     // headerImage.spriteFrame = spriteFrame;
                // }
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                let Sprite_Role = cc.find("Node_Content/Sprite_Role", cardNode).getComponent(cc.Sprite);
                Sprite_Role.node.active = true
                if (pItem.position == 71) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qzz');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 61) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cgg');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 51) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mag');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 41) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dzz');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 31) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzzz');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 21) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzz');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 11) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_remm');
                    Sprite_Role.spriteFrame = spriteFrame;
                } else if (pItem.position == 1) {
                    Sprite_Role.node.active = false
                    // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
                    // te_cy_header_qz.spriteFrame = spriteFrame;
                } else {
                    Sprite_Role.node.active = false
                }


                let number = cc.find("Node_Content/Tea_Number", cardNode).getComponent(cc.Label);
                if (pItem.teamNo <= 0) {
                    number.string = ''
                } else {
                    number.string = pItem.teamNo
                }

                let name = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let Zong_Label = cc.find("Node_Content/Zong_Label", cardNode).getComponent(cc.Label);
                let num = pItem.totalGameCount
                Zong_Label.string = num.toFixed(2);

                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                let winCount = pItem.winCount
                Win_Label.string = winCount.toFixed(2);


                let Win_CountTwo = cc.find("Node_Content/Win_Count", cardNode).getComponent(cc.Label);
                let score = pItem.score
                Win_CountTwo.string = score.toFixed(2);


                let Clear_Timer_Label = cc.find("Node_Content/Timer_Label", cardNode).getComponent(cc.Label);
                let Clear_Timer_Sec_Label = cc.find("Node_Content/Timer_Sec_Label", cardNode).getComponent(cc.Label);
                if (pItem.createTime == 0) {
                    Clear_Timer_Label.string = '暂无'
                } else {
                    // @ts-ignore
                    let timeStr = cc.g.utils.getFormatTimeNYR(['.','.','&',':',':',], new Date(pItem.createTime*1000));
                    let timeArr = timeStr.split('&')

                    Clear_Timer_Label.string = timeArr[0]//cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.createTime*1000));
                    Clear_Timer_Sec_Label.string = timeArr[1]
                }

                let cellBtn = cc.find("Cell_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellBtn, this, 'tea_chengyuan', 'zhanDuiNextCellBtn', pItem);

                let tyBtn = cc.find("Node_Content/Cao_Button", cardNode).getComponent(cc.Button);

                if((TeaClass.instance.position <= pItem.position) || (pItem.position == 51) || (pItem.position == 61) || pItem.level == 5) {
                    tyBtn.node.active = false;
                } else {
                    // @ts-ignore
                    cc.g.utils.removeClickAllEvent(tyBtn);
                    // @ts-ignore
                    cc.g.utils.addClickEvent(tyBtn, this, 'tea_chengyuan', 'zhanDuiNextCaoZuo', pItem);

                    tyBtn.node.active = true;
                }

                // add
                scrollView.content.addChild(cardNode, 0);
            })
        }
    }

    // 战队行点击
    zhanDuiCellBtn(event, pItem) {
        cc.dlog('点击战队按钮', pItem.teamNo)
        this.zdCsqlItem = pItem;
        // 点击操作时候
        this.teamIdCaoZuo = pItem.teamId;

        if (pItem.teamNo > 0) {
            let contNode = this.contentNodeArr[1]
            if (contNode.active) {
                contNode.active = false;
            }

            let contNodeNext = this.contentNodeArr[4]
            if (!contNodeNext.active) {
                contNodeNext.active = true;
            }

            this.zdStepNum++
            this.teamNextId = pItem.teamId

            this.doGetZhanDuiSecList();
        }
    }
    // 战队更多按钮点击
    zhanDuiCaoZuo(event, pItem) {
        cc.dlog('点击战队更多按钮', pItem)

        // @ts-ignore
        cc.g.utils.btnShake();

        this.zdCsqlItem = pItem;
        // 点击操作时候
        this.teamIdCaoZuo = pItem.teamId;

        this.doShowCyCaoBtn = false;

        cc.dlog('点击战队更多按钮--this.teamIdCaoZuo', this.teamIdCaoZuo)

        this.chengYuanZdCzPreNode.active = true;
    }
    zhanDuiNextCellBtn(event, pItem) {
        cc.dlog('点击战队下一级按钮', pItem.teamNo)
        // this.doShowCyCaoBtn = false;
        if (pItem.teamNo > 0) {
            this.zdStepNum++
            this.teamNextId = pItem.teamId
            this.doGetZhanDuiSecList();
        }
    }
    zhanDuiNextCaoZuo(event, pItem) {
        cc.dlog('点击战队二级更多按钮', pItem)

        // @ts-ignore
        cc.g.utils.btnShake();

        this.doShowCyCaoBtn = false;
        this.zdCsqlItem = pItem;
        this.teamIdCaoZuo = pItem.teamId;
        this.teaZhanDuiCaoZuoSec.popInitParams(pItem, this.curPosition);
        this.doShowChengYuanZdCaoZuoSecDialog();
    }
    chengYuanSetting(event, pItem) {
        cc.dlog('点击设置按钮', pItem);

        // @ts-ignore
        cc.g.utils.btnShake();

        this.zdCsqlItem = pItem

        if (pItem.showExit) {
            cc.dlog('显示退出....')
            if (this.curTabIndex == 1) { // 成员列表
                // @ts-ignore
                cc.g.hallMgr.doPersonSettingLogOut(TeaClass.instance.teaHouseId, (resp)=>{
                    cc.dlog('收到成员列表数据', resp)
                    // @ts-ignore
                    cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '申请已发出');
                });
            }
        } else {
            let roleNum = 0;
            if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
                roleNum = 1;
            } else if ((TeaClass.instance.position == 51) ||
                (TeaClass.instance.position == 41) ||
                (TeaClass.instance.position == 31) ||
                (TeaClass.instance.position == 21) ||
                (TeaClass.instance.position == 11)) {
                roleNum = 2;
            } else if (TeaClass.instance.position == 1) {
                roleNum = 3;
            }
            this.teaChenYuanSetting.popInitParams(pItem, roleNum)

            this.doShowChengYuanGlDialog()
        }
    }

    // doRenderListView(dataArr, isRemoveAll) {
    //     // this.doShowViewContent()
    //     let scrollView = this.scollerNodeArr[this.curTabIndex -1]
    //     if (this.curTabIndex == 1) {
    //         this.createChenYuanListDatas(dataArr, scrollView, isRemoveAll)
    //     } else if (this.curTabIndex == 2) {
    //         if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
    //             if (this.zdStepNum > 0) {
    //                 let scrollViewTwo = this.scollerNodeArr[4]
    //                 this.createZhanDuiSecListDatas(dataArr, scrollViewTwo, isRemoveAll)
    //             } else {
    //                 let scrollViewTwo = this.scollerNodeArr[4]
    //                 // this.createZhanDuiListDatas(dataArr, scrollView, isRemoveAll)
    //                 this.createZhanDuiSecListDatas(dataArr, scrollViewTwo, isRemoveAll)
    //             }
    //         } else if ((TeaClass.instance.position == 41) ||
    //             (TeaClass.instance.position == 31) ||
    //             (TeaClass.instance.position == 21) ||
    //             (TeaClass.instance.position == 11)) {
    //             let scrollView = this.scollerNodeArr[4]
    //             this.createZhanDuiSecListDatas(dataArr, scrollView, isRemoveAll)
    //         }
    //     } else if (this.curTabIndex == 3) {
    //         this.createCySpDatas(dataArr, scrollView, isRemoveAll)
    //     } else if (this.curTabIndex == 4) {
    //         this.createCyCrDatas(dataArr, scrollView, isRemoveAll)
    //     }
    //
    //
    //     // let contNode = this.contentNodeArr[this.curTabIndex - 1]
    //     //
    //     // cc.dlog('this.curTabIndex==>', this.curTabIndex)
    //     // if (this.curTabIndex == 2) {
    //     //     // 进来就是下一级界面，更多里面 次数清零
    //     //     if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
    //     //         contNode = this.contentNodeArr[this.curTabIndex - 1]
    //     //     } else if ((TeaClass.instance.position == 51)|| (TeaClass.instance.position == 41) || (TeaClass.instance.position == 31) || (TeaClass.instance.position == 21) || (TeaClass.instance.position == 11)) { //成员列表、我的战队
    //     //         contNode = this.contentNodeArr[4]
    //     //     }
    //     // }
    // }

    onBtnJinsai(event, ce) {
        cc.dlog('onBtnJinsai')

        // @ts-ignore
        //cc.g.utils.btnShake();

        if (!this['Jinsai']) {
            //  int32    sortKey=5;//排序 0默认排序 升序(1 禁赛) 降序(-1 禁赛)
            this['Jinsai'] = 1;
        } else {
            this['Jinsai'] = 0;
        }

        this.doRealSearchChenYuanList();
    }
    doRealSearchChenYuanList() {
        let sortKey = this['Jinsai'] || 0;

        if (this.pageOneNum == 1) {
            // @ts-ignore
            cc.g.global.showWaiting('');
        }
        // @ts-ignore
        cc.g.hallMgr.searchChengYuanList(TeaClass.instance.teaHouseId, this.searchId, this.pageOneNum, this.pageSize, sortKey, (resp)=>{
            cc.dlog('收到成员列表数据', resp)
            this.doResetSearchQurey();
            this.totalOnePage = resp.totalPage
            this.pageOneNum = resp.pageNum;
            this.groupName = resp.groupName;
            this.teamNolist = resp.teamNolist

            this.p1_olnum.string = `${resp.totalOnline}/${resp.totalCount}`;

            let items = resp.list
            // let isRemoveAll = true;
            if (this.pageOneNum == 1) {
                // @ts-ignore
                cc.g.global.destoryWaiting();
                // isRemoveAll = true;
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listOneArr = []
                } else {
                    this.listOneArr = items
                }
                this.checkShowUserId(items)
                this.listOneAdapter.setDataSet(this.listOneArr);
                this.listOneView.notifyUpdate();
                this.listOneView.scrollToLitte()
            } else {
                // isRemoveAll = false;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listOneArr.concat(items)
                    this.listOneArr = concatArr
                    this.checkShowUserId(items)
                    this.listOneAdapter.setDataSet(this.listOneArr);
                    this.listOneView.notifyUpdate();
                    // this.listOneView.scrollToLitte()
                }
            }
            // this.doRenderListView(resp.list, isRemoveAll)
        });
    }

    checkShowUserId(items) {
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.listOneArr)) {
            let groupPer = this.listOneArr[0]
            let groupName = groupPer.groupName
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(groupName)) {
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    items.forEach(item => {
                        let groupNameLabel = item.groupName
                        if(groupNameLabel.indexOf(groupName) == 0) {
                            item.showUserId = true
                        } else {
                            item.showUserId = false
                        }
                    })
                }
            }

            groupPer.showUserId = true
        }
    }

    doRealSearchZhanDuiList() {
        // int32 teaHouseId = 1;//茶馆Id
        // int32  teamId =2 ;  //战队Id
        // string   searchId=3;//搜索Id
        // bool    searchUp=4;//true 查询上级 false 查询下级
        if (this.pageTwoNum == 1) {
            // @ts-ignore
            cc.g.global.showWaiting('');
        }
        // @ts-ignore
        cc.g.hallMgr.searchZhanDuiList(TeaClass.instance.teaHouseId, TeaClass.instance.teamId, this.searchId, this.searchUp, this.sortKey, this.pageTwoNum, this.pageSize,  (resp)=>{
            cc.dlog('收到战队表数据', resp)
            this.doResetSearchQurey();
            this.totalTwoPage = resp.totalPage
            this.pageTwoNum = resp.pageNum;
            this.teamNextId = resp.teamId
            this.createPosition = resp.createPosition;
            this.curPosition = resp.position
            this.icon = resp.icon
            this.name = resp.name
            this.curUserId = resp.userId
            let isTwo = true;
            if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
                isTwo = true;
            } else if ((TeaClass.instance.position == 41) ||
                (TeaClass.instance.position == 31) ||
                (TeaClass.instance.position == 21) ||
                (TeaClass.instance.position == 11)) {
                isTwo = false;
            }

            // this.initHeaderTwoAndFive(isTwo, resp);
            this.initHeaderTwoAndFive(isTwo, resp);

            // let isRemoveAll = true;
            let items = resp.list
            // if (this.pageTwoNum == 1) {
            //     // isRemoveAll = true;
            //     // @ts-ignore
            //     if (cc.g.utils.judgeArrayEmpty(items)) {
            //         this.listTwoArr = []
            //     } else {
            //         this.listTwoArr = items
            //     }
            //     this.listTwoAdapter.setDataSet(this.listTwoArr);
            //     this.listTwoView.notifyUpdate();
            // } else {
            //     // isRemoveAll = false;
            //     // @ts-ignore
            //     if (!cc.g.utils.judgeArrayEmpty(items)) {
            //         let concatArr = this.listTwoArr.concat(items)
            //         this.listTwoArr = concatArr
            //         this.listTwoAdapter.setDataSet(this.listTwoArr);
            //         this.listTwoView.notifyUpdate();
            //     }
            // }
            // this.doRenderListView(resp.list, isRemoveAll);


            // if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
            //     if (this.zdStepNum > 0) {
            //         this.doCreateListTwo(items)
            //     } else {
            //         this.doCreateListTwo(items)
            //     }
            // } else if ((TeaClass.instance.position == 41) ||
            //     (TeaClass.instance.position == 31) ||
            //     (TeaClass.instance.position == 21) ||
            //     (TeaClass.instance.position == 11)) {
            //     this.doCreateListTwo(items)
            // }

            this.doCreateListTwo(items)
        });
    }
    doCreateListTwo(items) {
        // if (this.pageTwoNum == 1) {
        //     // @ts-ignore
        //     if (cc.g.utils.judgeArrayEmpty(items)) {
        //         this.listTwoArr = []
        //     } else {
        //         this.listTwoArr = items
        //     }
        //     this.listTwoAdapter.setDataSet(this.listTwoArr);
        //     this.listTwoView.notifyUpdate();
        // } else {
        //     // @ts-ignore
        //     if (!cc.g.utils.judgeArrayEmpty(items)) {
        //         let concatArr = this.listTwoArr.concat(items)
        //         this.listTwoArr = concatArr
        //         this.listTwoAdapter.setDataSet(this.listTwoArr);
        //         this.listTwoView.notifyUpdate();
        //     }
        // }
        if (this.pageTwoNum == 1) {
            // @ts-ignore
            cc.g.global.destoryWaiting();
            // @ts-ignore
            if (cc.g.utils.judgeArrayEmpty(items)) {
                this.listTwoArr = []
            } else {
                this.listTwoArr = items
            }
            this.listTwoAdapter.setDataSet(this.listTwoArr);
            this.listTwoView.notifyUpdate();
            this.listTwoView.scrollToLitte()
        } else {
            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(items)) {
                let concatArr = this.listTwoArr.concat(items)
                this.listTwoArr = concatArr
                this.listTwoAdapter.setDataSet(this.listTwoArr);
                this.listTwoView.notifyUpdate();
                // this.listTwoView.scrollToLitte()
            }
        }
    }
    doGetListDatas() {
        this.zdStepNum = 0;
        this.searchUp = false;
        if (this.curTabIndex == 1) { // 成员列表
            this.doRealSearchChenYuanList();
        } else if (this.curTabIndex == 2) {
            this.doRealSearchZhanDuiList();
        } else if (this.curTabIndex == 3) {
            // int32 teaHouseId = 1;//茶馆Id
            // int32  teamId =2 ;  //战队Id
            // string   searchId=3;//搜索Id
            // bool    searchUp=4;//true 查询上级 false 查询下级
            // this.pageTwoNum++;

            // @ts-ignore
            cc.g.global.showWaiting('');

            // @ts-ignore
            cc.g.hallMgr.searchMyCySp(TeaClass.instance.teaHouseId, this.searchId, (resp)=>{
                cc.dlog('收到战队表数据', resp)
                // this.teamNextId = resp.teamId
                // this.createPosition = resp.createPosition;
                // this.curPosition = resp.position
                // this.curUserId = resp.userId
                // this.initHeaderTwoAndFive(true, resp);
                // this.pageNum = resp.pageNum;

                // @ts-ignore
                cc.g.global.destoryWaiting();

                this.doResetSearchQurey();
                this.ownerName = resp.ownerName
                // this.doRenderListView(resp.list, true)
                let items = resp.list
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listThreeArr = []
                } else {
                    this.listThreeArr = items
                }
                this.listThreeAdapter.setDataSet(this.listThreeArr);
                this.listThreeView.notifyUpdate();
                this.listThreeView.scrollToLitte()

                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(this.listThreeArr)) {
                    this.doShowNoticeThree(true)
                    TeaClass.instance.doShowNoticeCy(true)
                } else {
                    this.doShowNoticeThree(false)
                    TeaClass.instance.doShowNoticeCy(false)
                }
            });
        } else if (this.curTabIndex == 4) {
            // int32 teaHouseId = 1;//茶馆Id
            // int32  teamId =2 ;  //战队Id
            // string   searchId=3;//搜索Id
            // bool    searchUp=4;//true 查询上级 false 查询下级

            // @ts-ignore
            cc.g.global.showWaiting('');
            // @ts-ignore
            cc.g.hallMgr.searchMyCRSp(TeaClass.instance.teaHouseId, this.searchId, (resp)=>{
                cc.dlog('收到战队表数据', resp)
                // this.teamNextId = resp.teamId
                // this.createPosition = resp.createPosition;
                // this.curPosition = resp.position
                // this.curUserId = resp.userId
                // this.initHeaderTwoAndFive(true, resp);
                // this.ownerName = resp.ownerName
                // this.pageNum = resp.pageNum;
                this.doResetSearchQurey();
                // this.doRenderListView(resp.list, true)

                // @ts-ignore
                cc.g.global.destoryWaiting();

                let items = resp.list
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listFourArr = []
                } else {
                    this.listFourArr = items
                }
                this.listFourAdapter.setDataSet(this.listFourArr);
                this.listFourView.notifyUpdate();
                this.listFourView.scrollToLitte()

                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(this.listFourArr)) {
                    // let showRedDot = false
                    // this.doShowNoticeFour(showRedDot)
                    // TeaClass.instance.doShowNoticeCy(showRedDot)
                } else {
                    this.doShowNoticeFour(false)
                    TeaClass.instance.doShowNoticeCy(false)
                }
            });
        }
    }

    doGetZhanDuiSecList() {
        // int32 teaHouseId = 1;//茶馆Id
        // int32  teamId =2 ;  //战队Id
        // string   searchId=3;//搜索Id
        // bool    searchUp=4;//true 查询上级 false 查询下级
        // // 保存上一级teamid
        this.pageTwoNum = 0;
        cc.dlog('获取下一级数据 pageTwoNum 设置为0')
        cc.dlog('teamNextId-->', this.teamNextId)
        cc.dlog('zdStepNum-->', this.zdStepNum)
        // this.pageTwoNum++;
        this.searchUp = false;
        this.doRealGetZhanDuiSecList();
    }

    doRealGetZhanDuiSecList() {
        this.pageTwoNum++;

        if (this.pageTwoNum == 1) {
            // @ts-ignore
            cc.g.global.showWaiting('');
        }

        // @ts-ignore
        cc.g.hallMgr.searchZhanDuiList(TeaClass.instance.teaHouseId, this.teamNextId, this.searchId, this.searchUp, this.sortKey, this.pageTwoNum, this.pageSize,  (resp)=>{
            cc.dlog('收到战队表数据', resp)
            this.pageTwoNum = resp.pageNum;
            this.totalTwoPage = resp.totalPage
            this.teamNextId = resp.teamId
            this.createPosition = resp.createPosition;
            this.curPosition = resp.position
            this.icon = resp.icon
            this.name = resp.name
            this.curUserId = resp.userId
            this.initHeaderTwoAndFive(false, resp);
            // let isRemoveAll = true;
            // if (this.pageTwoNum == 1) {
            //     isRemoveAll = true;
            // } else {
            //     isRemoveAll = false;
            // }
            // this.doRenderListView(resp.list, isRemoveAll)

            let items = resp.list
            if (this.pageTwoNum == 1) {

                // @ts-ignore
                cc.g.global.destoryWaiting();

                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listTwoArr = []
                } else {
                    this.listTwoArr = items
                }
                this.listTwoAdapter.setDataSet(this.listTwoArr);
                this.listTwoView.notifyUpdate();
                this.listTwoView.scrollToLitte()
            } else {
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listTwoArr.concat(items)
                    this.listTwoArr = concatArr
                    this.listTwoAdapter.setDataSet(this.listTwoArr);
                    this.listTwoView.notifyUpdate();
                    // this.listFiveView.scrollToLitte()
                }
            }
        });
    }

    doGetRefreshList() {
        if (this.zdStepNum == 0) {
            if (this.curTabIndex == 1) { // 成员列表
                this.pageOneNum = 1
            } else if (this.curTabIndex == 2) {
                this.pageTwoNum = 1
            }
            this.doGetListDatas();
        } else {
            this.doGetZhanDuiSecList();
        }
    }
    // 点击返回获取上一级数据
    doGetZhanDuiPreList() {
        // int32 teaHouseId = 1;//茶馆Id
        // int32  teamId =2 ;  //战队Id
        // string   searchId=3;//搜索Id
        // bool    searchUp=4;//true 查询上级 false 查询下级
        this.pageTwoNum = 0;
        cc.dlog('返回上一级数据 pageTwoNum 设置为0')
        // 保存上一级teamid
        this.searchUp = true;
        cc.dlog('zdStepNum-->', this.zdStepNum)
        this.doRealGetZhanDuiPreList();
    }

    doRealGetZhanDuiPreList() {
        this.pageTwoNum++;

        if (this.pageTwoNum == 1) {
            // @ts-ignore
            cc.g.global.showWaiting('');
        }

        // @ts-ignore
        cc.g.hallMgr.searchZhanDuiList(TeaClass.instance.teaHouseId, this.teamNextId, this.searchId, this.searchUp, this.sortKey, this.pageTwoNum, this.pageSize,  (resp)=>{
            cc.dlog('收到战队表数据', resp)
            this.pageTwoNum = resp.pageNum;
            this.totalTwoPage = resp.totalPage
            this.teamNextId = resp.teamId
            this.createPosition = resp.createPosition;
            this.curPosition = resp.position
            this.icon = resp.icon
            this.name = resp.name
            this.curUserId = resp.userId
            if (this.zdStepNum == 0) {
                this.initHeaderTwoAndFive(true, resp);
            } else {
                this.initHeaderTwoAndFive(false, resp);
            }
            // let isRemoveAll = true;
            // if (this.pageTwoNum == 1) {
            //     isRemoveAll = true;
            // } else {
            //     isRemoveAll = false;
            // }
            // this.doRenderListView(resp.list, isRemoveAll)

            let items = resp.list
            if (this.pageTwoNum == 1) {
                // @ts-ignore
                cc.g.global.destoryWaiting();

                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listTwoArr = []
                } else {
                    this.listTwoArr = items
                }
                this.listTwoAdapter.setDataSet(this.listTwoArr);
                this.listTwoView.notifyUpdate();
                this.listTwoView.scrollToLitte()
            } else {
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listTwoArr.concat(items)
                    this.listTwoArr = concatArr
                    this.listTwoAdapter.setDataSet(this.listTwoArr);
                    this.listTwoView.notifyUpdate();
                    // this.listFiveView.scrollToLitte()
                }
            }
        });
    }

    doSeachListDatas() {
        cc.dlog('点击搜索');
        let name = this.nameEditBox.string;
        if(name === '') {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', 'ID不能为空');
            return;
        }

        if (this.curTabIndex == 1) { // 成员列表
            this.pageOneNum = 1
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1
        }

        this.searchId = name;
        this.doGetListDatas();
    }

    doResetSearchQurey() {
        this.nameEditBox.string = '';
        this.searchId = null;
    }

    doCloseDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();
        cc.dlog('doCloseDialog');
        if (this.curTabIndex == 2) {
            if (this.zdStepNum > 0) {
                // 获取数据
                this.zdStepNum--
                cc.dlog('this.doCloseDialog...', this.zdStepNum);
                if (this.zdStepNum == 0) {
                    // if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
                    //     let contNode = this.contentNodeArr[1]
                    //     contNode.active = true;
                    //     let contNodeNext = this.contentNodeArr[4]
                    //     contNodeNext.active = false;
                    // } else if ((TeaClass.instance.position == 51)|| (TeaClass.instance.position == 41) || (TeaClass.instance.position == 31) || (TeaClass.instance.position == 21) || (TeaClass.instance.position == 11)) { //成员列表、我的战队
                    //     let contNode = this.contentNodeArr[1]
                    //     contNode.active = false;
                    //     let contNodeNext = this.contentNodeArr[4]
                    //     contNodeNext.active = true;
                    // }

                    this.doGetListDatas();
                } else {
                    this.doGetZhanDuiPreList();
                }
            } else {
                this.node.active = false;
            }
        } else {
            this.node.active = false;
        }
    }
    //
    // doShowViewContent() {
    //     let contNode = this.contentNodeArr[this.curTabIndex - 1]
    //     if (this.curTabIndex == 2) {
    //         // 进来就是下一级界面，更多里面 次数清零
    //         if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
    //             contNode = this.contentNodeArr[this.curTabIndex - 1]
    //         } else if ((TeaClass.instance.position == 51)|| (TeaClass.instance.position == 41) || (TeaClass.instance.position == 31) || (TeaClass.instance.position == 21) || (TeaClass.instance.position == 11)) { //成员列表、我的战队
    //             contNode = this.contentNodeArr[4]
    //         }
    //     }
    //
    //     contNode.active = true;
    //     cc.dlog('this.curTabIndex==>', this.curTabIndex)
    // }

    doNavTabClicked(event, clickIndex: number) {
        cc.dlog("导航点击按钮==>", clickIndex);

        if (clickIndex == 5) {
            this.doResetHeaderFiveTabCheck();
            this.doShowCyDrDialog();
        } else {
            if (clickIndex == this.curTabIndex) {
                cc.dlog("重复点击导航点击按钮==>")
                return
            }

            this.doResetHeaderTabCheck()
            let node = event.node
            let checkmark = cc.find("checkmark", node)
            checkmark.active = true
            this.curTabIndex = clickIndex;
            let contNode = this.contentNodeArr[this.curTabIndex - 1]

            cc.dlog('this.curTabIndex==>', this.curTabIndex)
            // if (this.curTabIndex == 2) {
            //     // // 进来就是下一级界面，更多里面 次数清零
            //     // if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
            //     //     contNode = this.contentNodeArr[4]//this.contentNodeArr[this.curTabIndex - 1]
            //     // } else if ((TeaClass.instance.position == 51)|| (TeaClass.instance.position == 41) || (TeaClass.instance.position == 31) || (TeaClass.instance.position == 21) || (TeaClass.instance.position == 11)) { //成员列表、我的战队
            //     //     contNode = this.contentNodeArr[4]
            //     // }
            //     contNode = this.contentNodeArr[4]
            // }

            contNode.active = true;

            this.teamNextId = 0
            this.searchUp = false
            this.zdStepNum = 0

            if (this.curTabIndex == 1) { // 成员列表
                this.pageOneNum = 1
            } else if (this.curTabIndex == 2) {
                this.pageTwoNum = 1
            }

            this.doGetListDatas();
        }
    }

    start () {

    }

    doShowChengYuanGlDialog() {
        this.chengYuanGlPreNode.active = true;
    }
    doHiddenChengYuanGlDialog() {
        this.chengYuanGlPreNode.active = false;
    }

    doShowChengYuanZdDialog() {
        cc.dlog('显示成员操作按钮...')

        // @ts-ignore
        cc.g.utils.btnShake();

        let csqlItem = {
            position: this.curPosition,
            icon: this.icon,
            name: this.name,
            userId: this.curUserId,
        }

        this.teamIdCaoZuo = this.teamNextId;
        this.zdCsqlItem = csqlItem
        this.doShowCyCaoBtn = true;
        this.chenYuanZhanDui.showBtnsByPostion(TeaClass.instance.position, ((this.zdStepNum>0) ? true : false))
        this.chengYuanZdPreNode.active = true;
    }
    doHiddenChengYuanZdDialog() {
        this.chengYuanZdPreNode.active = false;
    }

    doShowChengYuanZdAddDialog() {
        cc.dlog('doShowChengYuanZdAddDialog==', TeaChenYuan.instance.zdSearchType)
        this.teaZhanDuiAdd.initParms(this.teamNextId, ((this.zdStepNum>0) ? true : false))

        this.teaZhanDuiAdd.doGetList();

        this.chengYuanZdAddPreNode.active = true;
    }

    doShowChengYuanZdAddDialogTwo() {
        cc.dlog('doShowChengYuanZdAddDialog==', TeaChenYuan.instance.zdSearchType)
        if (this.doShowCyCaoBtn) {
            this.teaZhanDuiAdd.initParms(this.teamNextId, ((this.zdStepNum>0) ? true : false))
        } else {
            // 添加战队
            if (TeaChenYuan.instance.zdSearchType == 1) {
                this.teaZhanDuiAdd.initParms(this.teamNextId, ((this.zdStepNum>0) ? true : false))
            } else if (TeaChenYuan.instance.zdSearchType == 2) { // 转让战队
                this.teaZhanDuiAdd.initParms(this.teamIdCaoZuo, ((this.zdStepNum>0) ? true : false))
            } else if (TeaChenYuan.instance.zdSearchType == 3) { //分配成员
                this.teaZhanDuiAdd.initParms(this.teamIdCaoZuo, ((this.zdStepNum>0) ? true : false))
            }
        }

        this.teaZhanDuiAdd.doGetList();

        this.chengYuanZdAddPreNode.active = true;
    }

    doHiddenChengYuanZdAddDialog() {
        this.chengYuanZdAddPreNode.active = false;
    }

    doShowChengYuanZdCaoZuoDialog() {
        cc.dlog('doShowChengYuanZdCaoZuoDialog...')
        this.chengYuanZdCzPreNode.active = true;
    }
    doHiddenChengYuanZdCaoZuoDialog() {
        this.chengYuanZdCzPreNode.active = false;
    }
    // 显示二级按钮
    doShowChengYuanZdCaoZuoSecDialog() {
        this.chengYuanZdCzSecPreNode.active = true;
    }
    doHiddenChengYuanZdCaoZuoSecDialog() {
        this.chengYuanZdCzSecPreNode.active = false;
    }

    doShowXiaoDuiDialog() {
        this.teaFenPeiCyPreNode.active = true;
    }
    doHiddenXiaoDuiDialog() {
        this.teaFenPeiCyPreNode.active = false;
    }

    doShowFanBiDialog(canClickOk) {
        cc.dlog('doShowFanBiDialog...', canClickOk)
        cc.dlog('zdCsqlItem...', this.zdCsqlItem)
        this.teaFbDialog.showUiDatas(canClickOk, this.zdCsqlItem)
        this.teaFbDialogPreNode.active = true;
    }
    doHiddenFanBiDialog() {
        this.teaFbDialogPreNode.active = false;
    }

    doShowZhanDuiCsqlDialog() {
        cc.dlog('doShowZhanDuiCsqlDialog...', this.teamIdCaoZuo)
        cc.dlog('zdCsqlItem...', this.zdCsqlItem)
        this.teaZhanDuiCsql.initParms(this.teamIdCaoZuo, this.zdCsqlItem)
        this.teaZhanDuiCsql.doGetList();
        this.zhanDuiCsqlPreNode.active = true;
    }
    doHiddenZhanDuiCsqlDialog() {
        this.zhanDuiCsqlPreNode.active = false;
    }
    doShowChangeReamrkDialog() {
        this.teaChangeRemarkPreNode.active = true;
    }
    doHiddenChangeReamrkDialog() {
        this.teaChangeRemarkPreNode.active = false;
    }
    doShowBaoXianZhiDialog() {
        this.teaBaoXianZhiPreNode.active = true;
    }
    doHiddenBaoXianZhiDialog() {
        this.teaBaoXianZhiPreNode.active = false;
    }

    doShowAlertDialog() {
        this.teaAlertDialogPreNode.active = true;
    }
    doHiddenAlertDialog() {
        this.teaAlertDialogPreNode.active = false;
    }

    doShowCyDrDialog() {
        this.teaCyDaoRuPreNode.active = true;
    }
    doHiddenCyDrDialog() {
        this.teaCyDaoRuPreNode.active = false;
    }

    doShowGuanlianIDDialog() {
        this.dlgGlid.node.active = true;
    }
    doHiddenGuanlianIDDialog() {
        this.dlgGlid.node.active = false;
    }

    doShowJJXDialog(cellItem) {
        this.jjx.node.active = true;

        let itm = cellItem;
        cc.log('doShowJJXDialog itm', itm);
        this['JJXitm'] = itm;

        // @ts-ignore
        let Cordon = cc.g.utils.realNum1(itm.memberCordon);
        // @ts-ignore
        let Integral = cc.g.utils.realNum1(itm.todayIntegral);
        
        this.jjx.eb.string = Cordon;
        this.jjx.zf.string = Integral;
    }
    doHiddenJJXDialog() {
        this.jjx.node.active = false;
    }
    onBtnChangeJJX() {
        let itm = this['JJXitm'];
        cc.log('onBtnChangeJJX itm', itm);

        // @ts-ignore
        let Cordon = this.jjx.eb.string;
        Cordon = parseFloat(Cordon)*100;
        Cordon = parseInt(Cordon);

        cc.log('Cordon ', Cordon);

        {/*
            //亲友圈设置成员警戒线
            //@api:2343,@type:req
            message  TeaHouseMemberSetCordonReq{
                int32   teaHouseId = 1;//茶馆Id
                int64   memberId =2 ;//成员Id
                int64   cordon =3 ;//警戒线
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_MEMBER_SET_CORDON);
        req.teaHouseId = TeaClass.instance.teaHouseId;
        req.memberId = itm.userId;
        req.cordon = Cordon;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_MEMBER_SET_CORDON, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                cc.dlog('TEA_HOUSE_MEMBER_SET_CORDON 成功');
                // @ts-ignore
                cc.g.global.hint('设置成功');
                itm.memberCordon = Cordon;
            } else {
                cc.dlog('TEA_HOUSE_MEMBER_SET_CORDON 失败');
            }
        });
    }
    

    // int32    sortKey=7;//排序 0默认排序 升序(1局数	2大赢家次数 3积分) 降序(-1局数 -2大赢家次数 -3积分)
    // 局数排序
    doSortByJuShu() {
        cc.dlog('局数排序....')
        if (this.sortKeyOne > 0) {
            this.sortKey = -1
        } else {
            this.sortKey = 1
        }

        this.sortKeyOne = this.sortKey

        this.pageTwoNum = 1
        this.doRealSearchZhanDuiList();
    }
    // 大赢家排序
    doSortByDYj() {
        cc.dlog('大赢家排序....')

        if (this.sortKeyTwo > 0) {
            this.sortKey = -2
        } else {
            this.sortKey = 2
        }

        this.sortKeyTwo = this.sortKey

        this.pageTwoNum = 1
        this.doRealSearchZhanDuiList();
    }
    // 积分排序
    doSortByJiFen() {
        cc.dlog('积分排序....')

        if (this.sortKeyThree > 0) {
            this.sortKey = -3
        } else {
            this.sortKey = 3
        }

        this.sortKeyThree = this.sortKey

        this.pageTwoNum = 1
        this.doRealSearchZhanDuiList();
    }
}

class ListOneAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZdLbShuJu);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListTwoAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZdLbNextShuJu);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListThreeAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZdLbShenPi);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListFourAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZdLbChuRu);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListFiveAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZdLbNextShuJu);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}