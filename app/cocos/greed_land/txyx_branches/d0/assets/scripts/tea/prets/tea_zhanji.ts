// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";
import ZjZongFen from "./tea_zj_zf";
import ZjFanJianStatue from "./tea_zj_fjzt";
import ZjieSuanDetail from "./tea_zj_jsxq";
import TeaCaiPanDetail from "./tea_caipandetail";
import ListView, {AbsAdapter} from "../../components/ListView";
import TeaZjWode from "./tea_zj_wode";
import TeaZjCyComp from "./tea_zj_cy_cell";
import TeaZjShuJu from "./tea_zj_sj_cell";
import TeaChenYuan from "./tea_chengyuan";
import TeaZJXQ from "./tea_zj_cyxq";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaZhanJi extends cc.Component {
    private searchId: string;
    nameEditBox: cc.EditBox = null;

    static instance: TeaZhanJi = null;
    private contentNode: cc.Node;
    public position: number = 0;
    private headerTabNode: cc.Node;
    private headerTabNodeArr: any[] = [];
    private contentNodeArr: any[] = [];
    private scollerNodeArr: any[] = [];
    private nodePopArr: any[] = [];
    private nodeSeachArr: any[] = [];
    private curWeekNode: cc.Node;

    private selectList: any[] = [];

    private sortTypeOne: number = 0;
    private sortTypeTwo: number = 0;
    private sortTypeThree: number = 0;
    private sortType: number = 0;

    private sortTypeOne2: number = 0;
    private sortTypeTwo2: number = 0;
    private sortTypeThree2: number = 0;
    private sortType2: number = 0;


    private pageOneNum: number = 1;
    private totalOnePage: number = 1;
    private pageTwoNum: number = 1;
    private totalTwoPage: number = 1;
    private pageThreeNum: number = 1;
    private totalThreePage: number = 1;
    private pageFourNum: number = 1;
    private totalFourPage: number = 1;
    private pageFiveNum: number = 0;
    private totalFivePage: number = 1;
    private pageSize: number = 20;

    private curTabIndex: number = 1;
    private timeType: number = 0;
    private gameType: number = 0;
    private selectUserId: string = '';
    private teamGroup: string = '';
    private recordType: number = 2;
    private teamId: number = 0;
    private searchUp: boolean = false;
    private searchIndex: number = 0;
    private originType: number = 0;

    @property(cc.Prefab)
    zjWoDeItemListPre: cc.Prefab = null;
    @property(cc.Prefab)
    zjWoDeCellPre: cc.Prefab = null;

    @property(cc.Prefab)
    zjWeekCellPre: cc.Prefab = null;

    @property(cc.Prefab)
    zjCyCellPre: cc.Prefab = null;

    @property(cc.Prefab)
    zjGameCellPre: cc.Prefab = null;

    @property(cc.Prefab)
    zjCyCellShuJuPre: cc.Prefab = null;

    @property(cc.Prefab)
    zjZongFenPre: cc.Prefab = null;
    zjZongFenNode: cc.Node = null;
    zjZongFen: ZjZongFen = null;

    @property(cc.Prefab)
    zjXiangxiPre: cc.Prefab = null;
    zjXiangxiPreNode: cc.Node = null;
    zjXiangxi: TeaZJXQ = null;

    @property(cc.Prefab)
    zjFanJianStatuePre: cc.Prefab = null;
    zjFanJianStatueNode: cc.Node = null;
    zjFanJianStatue: ZjFanJianStatue = null;

    @property(cc.Prefab)
    zjJieSuanDetailPre: cc.Prefab = null;
    zjJieSuanDetailNode: cc.Node = null;
    jieSuanDetail: ZjieSuanDetail = null;

    // 裁判详情
    @property(cc.Prefab)
    zjCPDetailPre: cc.Prefab = null;
    zjCPDetailNode: cc.Node = null;
    zjCPDetail: TeaCaiPanDetail = null;
    
    @property(cc.Prefab)
    roomStaPre: cc.Prefab = null;

    leftScrollView: cc.ScrollView = null;

    private totalGamblingNum: number = 0;
    private totalIntegralNum: number = 0;
    private totalNum: number = 0;
    private totalPage: number = 0;
    private totalWinCount: number = 0;

    // private perIndex: number = 0;

    nodeSeachNode: cc.Node = null;
    nodePopNode: cc.Node = null;
    headerNodePopView: cc.Node = null;
    headerScrollView: cc.ScrollView = null;
    bottomNodeAllView: cc.Node = null;
    headerFilterLabel: cc.Label = null;

    Node_PopView_DuiWu: cc.Node = null;
    Node_PopView_DuiWu_Label: cc.Label = null;


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

    @property(ListView)
    listFiveView: ListView = null;
    public listFiveAdapter: ListFiveAdapter = null;
    public listFiveArr: any[] = [];

    // getTeaZjPre() {
    //     // 成员
    //     if (this.zjXiangxiPreNode == null) {
    //         this.zjXiangxiPreNode = cc.instantiate(this.zjXiangxiPre);
    //         // this.teaChenYuan = this.teaChenYuanNode.getComponent('tea_chengyuan')
    //         this.node.addChild(this.zjXiangxiPreNode);
    //         this.zjXiangxiPreNode.active = false;
    //     }
    //
    //     return this.zjXiangxiPreNode;
    // }
    //
    // getZjPrexq() {
    //     if (this.zjXiangxi == null) {
    //         this.zjXiangxi = this.getTeaZjPre().getComponent('tea_zj_cyxq');
    //     }
    //     return this.zjXiangxi;
    // }

    onEnable () {

        // this.doResetPageNum();
        // this.doGetListDatas();
        //
        // if (this.recordType == 2) {
        //     this.headerTabNodeArr[4].active = false
        // } else {
        //     this.headerTabNodeArr[4].active = true
        // }
        //
        // if (TeaClass.instance.position == 1) {
        //     this.headerTabNodeArr[1].active = false
        //     this.headerTabNodeArr[2].active = false
        //     this.headerTabNodeArr[3].active = false
        //     this.headerTabNodeArr[4].active = false
        // }
    }

    doRequestUrl() {
        this.doResetPageNum();

        if (this.recordType == 2) {
            this.headerTabNodeArr[4].active = false
        } else {
            this.headerTabNodeArr[4].active = true
        }

        if (TeaClass.instance.position == 1) {
            this.headerTabNodeArr[1].active = false
            this.headerTabNodeArr[2].active = false
            this.headerTabNodeArr[3].active = false
            this.headerTabNodeArr[4].active = false
        }

       let canRequest = true

        let navTabIndex = cc.sys.localStorage.getItem("NavTabKey");
        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(navTabIndex)) {
            this.curTabIndex = parseInt(navTabIndex);
            canRequest = false
           this.doNavTabClicked(null, this.curTabIndex)
        }

        let saveWeekIndex = cc.sys.localStorage.getItem("WeekIndex");
        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(saveWeekIndex)) {
            this.timeType = parseInt(saveWeekIndex);
            canRequest = false
            this.doClickWeek(null, this.timeType)
        }

        if (canRequest) {
            this.doGetListDatas();
        }

        // show pop

        let videoxy = cc.sys.localStorage.getItem("ClickedZjVideoDatasxy");

        let videoDatas = cc.sys.localStorage.getItem("ClickedZjVideoDatas");
        // @ts-ignore
        if (!cc.g.utils.judgeObjectEmpty(videoDatas)) {
            this.zjDetailClicked(null, JSON.parse(videoDatas))
        }
        // @ts-ignore
        else if (!cc.g.utils.judgeObjectEmpty(videoxy)) {
            let videoDataszjxq = cc.sys.localStorage.getItem("ClickedzjChakanzjxq");
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(videoDataszjxq)) {
                this.zjChakanzjxq(null, JSON.parse(videoDataszjxq))
            }
        }
    }

    initParams(recordType) {
        // let isGoldOpen = TeaClass.instance.SettingData['isGoldOpen']
        cc.dlog('recordType...', recordType)
        this.recordType = recordType

        // team id
        this.teamId = TeaClass.instance.teamId;

        this.doShowGameTypeHeaderView();

        this.doRequestUrl()
    }

    clearCache() {
        cc.sys.localStorage.removeItem("NavTabKey")
        cc.sys.localStorage.removeItem("WeekIndex")
        cc.sys.localStorage.removeItem("ClickedZjVideo")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatasxy")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatas")
    }


    doClosePop() {
        // @ts-ignore
        cc.g.utils.btnShake();
        cc.log('doClosePop....')
        this.clearCache();
        if (this.curTabIndex == 4) {
            if (this.searchIndex > 0) {
                this.pageFourNum = 1;
                this.doRealSearchZhanDuiZjListPre();
            } else {
                this.node.active = false;
            }
        } else {
            this.node.active = false;
        }
    }

    start () {

    }

    onLoad () {
        TeaZhanJi.instance = this;
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

        this.nodeSeachNode = cc.find("Node_Header/Node_Seach", this.node)
        this.nodePopNode = cc.find("Node_Header/NodePop_Node", this.node)

        // @ts-ignore
        this.nodeSeachNode.active = !cc.g.utils.getWeChatOs()
        // @ts-ignore
        this.nodePopNode.active = false//!cc.g.utils.getWeChatOs()

        let Node_Search = cc.find("Node_Search", this.nodePopNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(Node_Search);
        // @ts-ignore
        cc.g.utils.addClickEvent(Node_Search, this, 'tea_zhanji', 'doShowPopSeachView', '');

        this.headerNodePopView = cc.find("Node_PopView", this.nodePopNode);
        this.headerNodePopView.active = false;
        this.headerScrollView = cc.find("Node_PopView/GameTwoScrollView", this.nodePopNode).getComponent(cc.ScrollView);
        this.headerFilterLabel= cc.find("Node_Search/Seach_Label", this.nodePopNode).getComponent(cc.Label);


        // 俱乐部名字输Node_Seach入框
        this.nameEditBox = cc.find("Node_Header/Node_Seach/Seach_EditBox", this.node).getComponent(cc.EditBox);

        this.leftScrollView = cc.find("Node_Left/ListScrollView", this.node).getComponent(cc.ScrollView);

        this.initViews();

        this.initPres()

        this.createLeftWeekDatas();

        this.doInitGameTypeHeaderView();
    }

    // funformat (curDay, fmt) {
    //     var o = {
    //         "M+": this.getMonth() + 1, //月份
    //         "d+": this.getDate(), //日
    //         "h+": this.getHours(), //小时
    //         "m+": this.getMinutes(), //分
    //         "s+": this.getSeconds(), //秒
    //         "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    //         "S": this.getMilliseconds() //毫秒
    //     };
    //     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    //     for (var k in o)
    //         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    //     return fmt;
    // }

    createLeftWeekDatas() {
        this.leftScrollView.content.removeAllChildren(true);

        // var now = new Date();
        // 3         var year = now.getFullYear(); //得到年份
        // 4         var month = now.getMonth();//得到月份
        // 5         var date = now.getDate();//得到日期
        // 6         var day = now.getDay();//得到周几


        let weekData = ['今天', '昨天', '前天']

        for (let i = 3; i < 7; i++) {
            let curDay = new Date();
            // let month =  curDay.getMonth();
            // let date =  curDay.getDate();
            curDay.setDate(curDay.getDate() - i);
            // let nowDay = curDay.format("yyyy-MM-dd");
            // @ts-ignore
            let nowDay = cc.g.utils.getFormatTime(curDay, "MM-dd")
            // cc.dlog('nowDay==>', nowDay)
            weekData.push(nowDay)
        }
        let saveWeekIndex = cc.sys.localStorage.getItem("WeekIndex");
        // 显示数据
        let weekIndex = 0;
        weekData.forEach((item) => {
            let cardNode = cc.instantiate(this.zjWeekCellPre);
            let nameLabel = cc.find("Button_Cell_Item/Label_Name", cardNode).getComponent(cc.Label);
            nameLabel.string = item;

            // @ts-ignore
            if (cc.g.utils.judgeObjectEmpty(saveWeekIndex)) {
                if (weekIndex == 0) {
                    nameLabel.node.color = new cc.Color(0xff,0xf8,0xd7);

                    let normalSprite = cc.find("Button_Cell_Item/Sprite_Noraml", cardNode)
                    normalSprite.active = false;

                    let selectSprite = cc.find("Button_Cell_Item/Sprite_Select", cardNode)
                    selectSprite.active = true;

                    this.curWeekNode = cardNode
                }
            }

            // let normalSprite = cc.find("Button_Cell_Item/Sprite_Noraml", cardNode)
            // // normalSprite.active = true;
            //
            // let selectSprite = cc.find("Button_Cell_Item/Sprite_Select", cardNode)
            // selectSprite.active = false;

            let jrBtn = cc.find("Button_Cell_Item", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(jrBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(jrBtn, this, 'tea_zhanji', 'doClickWeek', weekIndex);

            this.leftScrollView.content.addChild(cardNode, 0, "leftweek" + weekIndex);

            weekIndex++;
        })
    }

    doResetPageNum() {
        this.pageOneNum = 1;
        this.pageTwoNum = 1;
        this.pageThreeNum = 1;
        this.pageFourNum = 1;
        this.pageFiveNum = 1;
        // this.perIndex = 0
    }

    doClickWeek (event, weekIndex) {
        cc.dlog('doClickWeek....'+weekIndex)

        if ((weekIndex == this.timeType) && (event != null)) {
            cc.dlog("重复点击日期按钮==>")
            return
        }

        if (this.curWeekNode) {
            let curNameLabel = cc.find("Button_Cell_Item/Label_Name",  this.curWeekNode).getComponent(cc.Label)
            curNameLabel.node.color = new cc.Color(0x29,0x1b,0x17);//0xff,0xf8,0xd7  0x29,0x1b,0x17

            let curNormalSprite = cc.find("Button_Cell_Item/Sprite_Noraml", this.curWeekNode)
            curNormalSprite.active = true;

            let curSelectSprite = cc.find("Button_Cell_Item/Sprite_Select", this.curWeekNode)
            curSelectSprite.active = false;
        }

        // 修改茶馆
        let cardNode = this.leftScrollView.content.getChildByName("leftweek" + weekIndex)
        let nameLabel = cc.find("Button_Cell_Item/Label_Name", cardNode).getComponent(cc.Label)
        nameLabel.node.color = new cc.Color(0xff,0xf8,0xd7);

        let normalSprite = cc.find("Button_Cell_Item/Sprite_Noraml", cardNode)
        normalSprite.active = false;

        let selectSprite = cc.find("Button_Cell_Item/Sprite_Select", cardNode)
        selectSprite.active = true;

        this.curWeekNode = cardNode

        // this.perIndex = 0

        if (this.curTabIndex == 1) {
            this.pageOneNum = 1;
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1;
        } else if (this.curTabIndex == 3) {
            this.pageThreeNum = 1;
        } else if (this.curTabIndex == 4) {
            this.pageFourNum = 1;
        } else if (this.curTabIndex == 5) {
            this.pageFiveNum = 1;
        }

        this.timeType = weekIndex;

        cc.sys.localStorage.setItem("WeekIndex", weekIndex+"");

        this.doGetListDatas();
    }

    initPres() {
        if (this.zjZongFenNode == null) {
            this.zjZongFenNode = cc.instantiate(this.zjZongFenPre);
            this.zjZongFenNode.active = true;
            this.node.addChild(this.zjZongFenNode);
            this.zjZongFen = this.zjZongFenNode.getComponent('tea_zj_zf');
            this.zjZongFenNode.active = false;
        }

        // 房间状态
        if (this.zjFanJianStatueNode == null) {
            this.zjFanJianStatueNode = cc.instantiate(this.zjFanJianStatuePre);
            this.zjFanJianStatueNode.active = true;
            this.node.addChild(this.zjFanJianStatueNode);
            this.zjFanJianStatue = this.zjFanJianStatueNode.getComponent('tea_zj_fjzt');
            this.zjFanJianStatueNode.active = false;
        }

        // 结算详情
        if (this.zjJieSuanDetailNode == null) {
            this.zjJieSuanDetailNode = cc.instantiate(this.zjJieSuanDetailPre);
            this.zjJieSuanDetailNode.active = true;
            this.node.addChild(this.zjJieSuanDetailNode);
            this.jieSuanDetail = this.zjJieSuanDetailNode.getComponent('tea_zj_jsxq');
            this.zjJieSuanDetailNode.active = false;
        }

        // 裁判详情
        if (this.zjCPDetailNode == null) {
            this.zjCPDetailNode = cc.instantiate(this.zjCPDetailPre);
            this.zjCPDetailNode.active = true;
            this.node.addChild(this.zjCPDetailNode);
            this.zjCPDetail = this.zjCPDetailNode.getComponent('tea_caipandetail');
            this.zjCPDetailNode.active = false;
        }
    }

    onScrollBottomOneEvent() {
        cc.dlog('我的战绩滑动到底。。。。')
        // @ts-ignore
        if (cc.g.global.isWatiting()) {
            cc.error("正在获取数据....")
        } else {
            if (this.pageOneNum < this.totalOnePage) {
                this.pageOneNum++;
                this.doRealSearchWoDeList();
            }
        }
    }

    onScrollBottomTwoEvent() {
        cc.dlog('成员战绩滑动到底。。。。')
        // @ts-ignore
        if (cc.g.global.isWatiting()) {
            cc.error("正在获取数据....")
        } else {
            if (this.pageTwoNum < this.totalTwoPage) {
                this.pageTwoNum++;
                this.doRealSearchCyZjList();
            }
        }
    }

    onScrollBottomThreeEvent() {
        cc.dlog('圈子战绩滑动到底。。。。')
        // @ts-ignore
        if (cc.g.global.isWatiting()) {
            cc.error("正在获取数据....")
        } else {
            if (this.pageThreeNum < this.totalThreePage) {
                this.pageThreeNum++;
                this.doRealSearchCircleZjList();
            }
        }
    }

    onScrollBottomFourEvent() {
        cc.dlog('战队战绩滑动到底。。。。')
        // @ts-ignore
        if (cc.g.global.isWatiting()) {
            cc.error("正在获取数据....")
        } else {
            if (this.pageFourNum < this.totalFourPage) {
                this.pageFourNum++;
                this.doRealSearchZhanDuiZjList();
            }
        }
    }

    onScrollBottomFiveEvent() {
        cc.dlog('收到我的战绩滑动到底。。。。')
        // @ts-ignore
        if (cc.g.global.isWatiting()) {
            cc.error("正在获取数据....")
        } else {
            if (this.pageFiveNum < this.totalFivePage) {
                this.pageFiveNum++;
                this.doRealSearchShuJuList();
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
            this.onScrollBottomTwoEvent()
        }, this);

        this.listThreeAdapter = new ListThreeAdapter()
        this.listThreeAdapter.setDataSet(this.listThreeArr);
        this.listThreeView.setAdapter(this.listThreeAdapter);

        // this.listThreeView.pullDown(() => {
        //     cc.dlog("你已经上拉到最顶端了.");
        // }, this);
        this.listThreeView.pullUp(() => {
            cc.dlog("你已经下拉到最底端了.")
            this.onScrollBottomThreeEvent()
        }, this);

        this.listFourAdapter = new ListFourAdapter()
        this.listFourAdapter.setDataSet(this.listFourArr);
        this.listFourView.setAdapter(this.listFourAdapter);

        // this.listFourView.pullDown(() => {
        //     cc.dlog("你已经上拉到最顶端了.");
        // }, this);
        this.listFourView.pullUp(() => {
            cc.dlog("你已经下拉到最底端了.")
            this.onScrollBottomFourEvent()
        }, this);

        this.listFiveAdapter = new ListFiveAdapter()
        this.listFiveAdapter.setDataSet(this.listFiveArr);
        this.listFiveView.setAdapter(this.listFiveAdapter);

        // this.listFiveView.pullDown(() => {
        //     cc.dlog("你已经上拉到最顶端了.");
        // }, this);
        this.listFiveView.pullUp(() => {
            cc.dlog("你已经下拉到最底端了.")
            this.onScrollBottomFiveEvent()
        }, this);
    }

    initViews () {
        // 滑动content
        this.contentNode = cc.find("Node_Content", this.node)
        let navTabIndex = cc.sys.localStorage.getItem("NavTabKey");
        // let scrollViewEventArr = [this.onScrollBottomOneEvent, this.onScrollBottomTwoEvent, this.onScrollBottomThreeEvent, this.onScrollBottomFourEvent, this.onScrollBottomFiveEvent]
        for (let i = 0; i < 5; i++) {
            let contNode = this.contentNode.getChildByName("Node_View" + (i + 1))
            // @ts-ignore
            if (cc.g.utils.judgeObjectEmpty(navTabIndex)) {
                if (i == 0) {
                    contNode.active = true;
                } else {
                    contNode.active = false;
                }
            }

            this.contentNodeArr.push(contNode)

            // let scrollView = cc.find("ScrollView_Content", contNode).getComponent(cc.ScrollView);


            if (i == 4) {
                this.bottomNodeAllView = cc.find("tea_cylb_bt_bootom", contNode)
            }

            // // scroll-to-right 注意：此事件是从
            // scrollView.node.on('scroll-to-bottom', scrollViewEventArr[i], this);
            // this.scollerNodeArr.push(scrollView)
        }

        this.headerTabNode = cc.find("Node_Header/Node_Center", this.node)

        for (let i = 0; i < 5; i++) {
            let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item" + (i + 1))
            cardNode.active = true;
            this.headerTabNodeArr.push(cardNode)
        }

        this.initListView()


        // if (this.recordType == 2) {
        //     this.headerTabNodeArr[4].active = false
        // } else {
        //     this.headerTabNodeArr[4].active = true
        // }
        //
        // if (TeaClass.instance.position == 1) {
        //     this.headerTabNodeArr[1].active = false
        //     this.headerTabNodeArr[2].active = false
        //     this.headerTabNodeArr[3].active = false
        //     this.headerTabNodeArr[4].active = false
        // }
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

    doCheckHeaderTabByIndex(clickIndex) {
        let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item" + clickIndex)
        let checkmark = cc.find("New Toggle/checkmark", cardNode)
        checkmark.active = true
    }

    doNavTabClicked(event, clickIndex: number) {
        cc.dlog("导航点击按钮==>", clickIndex)

        if ((clickIndex == this.curTabIndex) && (event != null)) {
            cc.dlog("重复点击导航点击按钮==>")
            // let node = event.node
            // let checkmark = cc.find("checkmark", node)
            // checkmark.active = true
            this.doCheckHeaderTabByIndex(clickIndex)
            return
        }


        this.doResetHeaderTabCheck()
        // let node = event.node
        // let checkmark = cc.find("checkmark", node)
        // checkmark.active = true
        this.doCheckHeaderTabByIndex(clickIndex)

        this.curTabIndex = clickIndex;

        cc.sys.localStorage.setItem("NavTabKey", clickIndex+"");

        let contNode = this.contentNodeArr[this.curTabIndex - 1]
        contNode.active = true;

        this.selectUserId = ''
        this.nameEditBox.string = ''
        this.teamId = 0;

        this.gameType = 0
        this.originType = 0;
        if (this.curTabIndex < 4) {
            let nodePop = this.nodePopArr[this.curTabIndex-1]
            nodePop.active = false;
        }

        // this.perIndex = 0

        if (this.curTabIndex == 1) {
            this.pageOneNum = 1;
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1;
        } else if (this.curTabIndex == 3) {
            this.pageThreeNum = 1;
        } else if (this.curTabIndex == 4) {
            this.pageFourNum = 1;
        } else if (this.curTabIndex == 5) {
            this.pageFiveNum = 1;
        }

        // @ts-ignore
        if (!cc.g.utils.getWeChatOs()) {
            if (this.curTabIndex == 5) {
                this.nodeSeachNode.active = false
                this.nodePopNode.active = true
            } else {
                this.nodeSeachNode.active = true
                this.nodePopNode.active = false
            }
        }

        this.doGetListDatas();
    }

    doCreateHeaderView(resp) {
        if (this.curTabIndex == 1 || this.curTabIndex == 2) {
            let headerView = cc.find("Node_Content/Node_View"+this.curTabIndex+"/tea_cylb_bt", this.node)

            let JueLabel = cc.find("Node_Header/JueLabel", headerView).getComponent(cc.Label);
            JueLabel.string = resp.totalGamblingNum

            let DyjLabel = cc.find("Node_Header/DyjLabel", headerView).getComponent(cc.Label);
            DyjLabel.string = resp.totalWinCount

            let JfLabel = cc.find("Node_Header/JfLabel", headerView).getComponent(cc.Label);

            // @ts-ignore
            let totalIntegralNum = cc.g.utils.realNum1(resp.totalIntegralNum);
            JfLabel.string = totalIntegralNum
        } else if (this.curTabIndex == 3) {
            let headerView = cc.find("Node_Content/Node_View"+this.curTabIndex+"/tea_cylb_bt", this.node)

            let JueLabel = cc.find("Node_Header/JueLabel", headerView).getComponent(cc.Label);
            JueLabel.string = resp.todayCount

            let DyjLabel = cc.find("Node_Header/DyjLabel", headerView).getComponent(cc.Label);
            DyjLabel.string = resp.disbandNum

            let JfLabel = cc.find("Node_Header/JfLabel", headerView).getComponent(cc.Label);
            JfLabel.string = (resp.todayCount - resp.disbandNum) + ''
        }
    }

    doInitGameTypeHeaderView() {
        for (let i = 0; i < 3; i++) {
            let nodeView = cc.find("Node_Content/Node_View"+(i + 1), this.node)
            let headerView = cc.find("tea_cylb_bt", nodeView)

            let Node_Search = cc.find("Node_Search", headerView).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(Node_Search);
            // @ts-ignore
            cc.g.utils.addClickEvent(Node_Search, this, 'tea_zhanji', 'doSeachViewOne', i);

            let nodePopView = cc.find("Node_PopView", headerView);
            nodePopView.active = false;
            this.nodePopArr.push(nodePopView)

            let seach_Label = cc.find("Node_Search/Seach_Label", headerView).getComponent(cc.Label);
            this.nodeSeachArr.push(seach_Label)

            // 新加的筛选功能
            if (i == 1) {
                let Node_Search_DuiWu = cc.find("Node_Search_DuiWu", headerView).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(Node_Search_DuiWu);
                // @ts-ignore
                cc.g.utils.addClickEvent(Node_Search_DuiWu, this, 'tea_zhanji', 'doSeachViewDuiWu', i);

                this.Node_PopView_DuiWu = cc.find("Node_PopView_DuiWu", headerView);
                this.Node_PopView_DuiWu.active = false;
                this.Node_PopView_DuiWu_Label = cc.find("Node_Search_DuiWu/Seach_Label", headerView).getComponent(cc.Label);
            }
        }
    }

    doShowGameTypeHeaderView() {
        for (let i = 0; i < 3; i++) {
            let nodeView = cc.find("Node_Content/Node_View"+(i + 1), this.node)
            let headerView = cc.find("tea_cylb_bt", nodeView)

            let scrollView = cc.find("Node_PopView/GameScrollView", headerView).getComponent(cc.ScrollView);
            scrollView.content.removeAllChildren(true);

            let itemParm = {
                deskName: "全部",
                gameType: 1000,
                origin: 0,
            }

            this.showUiDatas(itemParm, scrollView)

            // @ts-ignore
            let arr = cc.g.clone(TeaClass.instance.teaRoomDatas)
            for(let i=0; i<arr.length; i++){
                for(let j=i+1; j<arr.length; j++){
                    if((arr[i].origin==arr[j].origin) && (arr[i].gameType==arr[j].gameType)){ //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }
            }

            // 显示数据
            arr.forEach((item) => {
                cc.dlog(item)
                this.showUiDatas(item, scrollView)
            })
        }
    }

    doShowGameTypeHeaderViewDuiWu() {
        let nodeView = cc.find("Node_Content/Node_View2", this.node)
        let headerView = cc.find("tea_cylb_bt", nodeView)
        cc.dlog('DuiWuScrollView...')
        let scrollViewDuiWu = cc.find("Node_PopView_DuiWu/DuiWuScrollView", headerView).getComponent(cc.ScrollView);
        scrollViewDuiWu.content.removeAllChildren(true);

        let itemParmInit = {
            deskName: "全部",
            teamGroup: '',
        }

        this.showUiTwpDatas(itemParmInit, scrollViewDuiWu)

        let itemParmInitZS = {
            deskName: "直属",
            teamGroup: '直属',
        }

        this.showUiTwpDatas(itemParmInitZS, scrollViewDuiWu)

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.selectList)) {
            this.selectList.forEach((item) => {

                // 队-组-小组-推荐
                let groupName = item.selectValue
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

                let itemParm = {
                    deskName: relGroupName,
                    teamGroup: groupName,
                }
                this.showUiTwpDatas(itemParm, scrollViewDuiWu)
            })
        }
    }

    showUiTwpDatas(item: any, scrollView) {
        let cardNode = cc.instantiate(this.zjGameCellPre);

        // 局数
        let nameLabel = cc.find("Label", cardNode).getComponent(cc.Label);
        nameLabel.string = item.deskName


        let tyBtn = cc.find("Button_Cell_Item", cardNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, this, 'tea_zhanji', 'doCellGameZhanJiTwo', item);

        scrollView.content.addChild(cardNode, 0);
    }

    showUiDatas(item: any, scrollView) {
        let cardNode = cc.instantiate(this.zjGameCellPre);

        // 局数
        let nameLabel = cc.find("Label", cardNode).getComponent(cc.Label);
        nameLabel.string = item.deskName


        let tyBtn = cc.find("Button_Cell_Item", cardNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, this, 'tea_zhanji', 'doCellGameZhanJi', item);

        scrollView.content.addChild(cardNode, 0);
    }

    doInitGameTwoTypeHeaderView(listArr) {
        this.headerScrollView.content.removeAllChildren(true);

        let itemParm = {
            teamIdStr: "全部",
            teamId: 0
        }

        listArr.splice(0, 0, itemParm);

        // 显示数据
        listArr.forEach((item) => {
            let cardNode = cc.instantiate(this.zjGameCellPre);

            // 局数
            let nameLabel = cc.find("Label", cardNode).getComponent(cc.Label);
            nameLabel.string = item.teamIdStr

            let tyBtn = cc.find("Button_Cell_Item", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(tyBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, this, 'tea_zhanji', 'doCellGameTwoZhanJi', item);

            this.headerScrollView.content.addChild(cardNode, 0);
        })
    }

    doCellGameTwoZhanJi(event, item) {
        cc.dlog('doCellGameTwoZhanJi....', item);

        this.teamId = item.teamId
        this.headerNodePopView.active = false
        this.pageFiveNum = 1;
        this.headerFilterLabel.string = item.teamIdStr
        this.doRealSearchShuJuList();
    }

    doShowPopSeachView(event, index) {
        cc.dlog('doShowPopSeachView....', index);
        this.headerNodePopView.active = !this.headerNodePopView.active;
    }

    doSeachViewOne(event, index) {
        cc.dlog('doSeachViewOne....', index);
        let nodePop = this.nodePopArr[index]
        nodePop.active = !nodePop.active;
    }

    doSeachViewDuiWu(event, index) {
        cc.dlog('doSeachViewDuiWu....', index);
        this.Node_PopView_DuiWu.active = !this.Node_PopView_DuiWu.active;
    }

    doCellGameZhanJiTwo(event, item) {

        cc.dlog('item-->' + JSON.stringify(item))

        this.teamGroup = item.teamGroup;

        if (this.curTabIndex == 1) {
            this.pageOneNum = 1;
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1;
        } else if (this.curTabIndex == 3) {
            this.pageThreeNum = 1;
        }

        // this.perIndex = 0

        this.doGetListDatas();

        this.Node_PopView_DuiWu.active = false;
        this.Node_PopView_DuiWu_Label.string = item.deskName
    }

    doCellGameZhanJi(event, item) {
        if (item.gameType == 1000) {
            this.gameType = 0;
        }
        this.gameType = item.gameType;
        this.originType = item.origin

        if (this.curTabIndex == 1) {
            this.pageOneNum = 1;
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1;
        } else if (this.curTabIndex == 3) {
            this.pageThreeNum = 1;
        }


        // this.perIndex = 0

        this.doGetListDatas();

        let nodePop = this.nodePopArr[this.curTabIndex-1]
        nodePop.active = false;

        let nodeSeachLabel = this.nodeSeachArr[this.curTabIndex-1]
        nodeSeachLabel.string = item.deskName
    }
    createWoDeListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zjWoDeItemListPre);

                // let deskName = cc.g.utils.getGameName(pItem.gameNum, pItem.origin);
                // @ts-ignore
                let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);

                let Game_Label = cc.find("Node_Content/top_Layout/NameLayout/Game_Label", cardNode).getComponent(cc.Label);

                // @ts-ignore
                if (cc.g.utils.judgeStringEmpty(Game_Label)) {
                    Game_Label.string = deskName
                } else {
                    Game_Label.string = deskName
                }

                let Room_Num_Label = cc.find("Node_Content/top_Layout/Room_Num_Label", cardNode).getComponent(cc.Label);
                Room_Num_Label.string = "房号:"+pItem.roomId

                let Jue_Num_Label = cc.find("Node_Content/top_Layout/Jue_Num_Label", cardNode).getComponent(cc.Label);
                Jue_Num_Label.string = "局数:"+pItem.gameNum

                let Timer_Label = cc.find("Node_Content/top_Layout/Timer_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.start*1000));

                // 比赛
                let Sai_Label = cc.find("Node_Content/top_Layout/Sai_Label", cardNode)
                Sai_Label.active = false;

                // 中途解散
                let JieSan_Sprite = cc.find("Node_Content/JieSan_Sprite", cardNode)
                if (pItem.isDisband) {
                    JieSan_Sprite.active = false;
                } else {
                    JieSan_Sprite.active = true;
                }

                // 赢label
                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                if (pItem.bigWin == 0) {
                    Win_Label.node.active = false;
                } else if (pItem.bigWin == 1) {
                    Win_Label.string = '大赢家'
                    Win_Label.node.active = true;
                } else if (pItem.bigWin == 2) {
                    Win_Label.string = '并列'
                    Win_Label.node.active = true;
                }

                let contentScrollView = cc.find("Node_Content/UserScrollView", cardNode).getComponent(cc.ScrollView);
                pItem.totalFight.forEach((titem) => {
                    let cardCellNode = cc.instantiate(this.zjWoDeCellPre);
                    let nameLabel = cc.find("Name_Label", cardCellNode).getComponent(cc.Label);
                    // @ts-ignore
                    nameLabel.string = cc.g.utils.getFormatName(titem.name, 5*2);

                    let Vaule_Label = cc.find("Vaule_Label", cardCellNode).getComponent(cc.Label);
                    let fight = titem.fight[0];
                    if (fight > 0) {
                        // @ts-ignore
                        let hfight = cc.g.utils.realNum1(fight);
                        Vaule_Label.string = "+"+ hfight
                        // @ts-ignore
                        Vaule_Label.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
                    } else {
                        // @ts-ignore
                        let hfight = cc.g.utils.realNum1(fight);
                        Vaule_Label.string = hfight;
                        // @ts-ignore
                        Vaule_Label.node.color = new cc.color(0x74, 0xff, 0x3d,255)
                    }
                    
                    contentScrollView.content.addChild(cardCellNode, 0);
                })

                let DetailButton = cc.find("Node_Content/DetailButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(DetailButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(DetailButton, this, 'tea_zhanji', 'zjDetailClicked', pItem);

                let Share_Button = cc.find("Node_Content/Share_Button", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(Share_Button);
                // @ts-ignore
                cc.g.utils.addClickEvent(Share_Button, this, 'tea_zhanji', 'zjShareClicked', pItem);

                let ZfButton = cc.find("Node_Content/ZfButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(ZfButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(ZfButton, this, 'tea_zhanji', 'zjZongFenClicked', pItem);

                // add
                scrollView.content.addChild(cardNode, 0);
            })
        }
    }

    createZjCyListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // let rowIndex = 0;
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zjCyCellPre);

                // // let deskName = cc.g.utils.getGameName(pItem.gameNum, pItem.origin);
                // // @ts-ignore
                // let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);
                //
                // let Game_Label = cc.find("Node_Content/Game_Sprite_Bg/Game_Label", cardNode).getComponent(cc.Label);
                // Game_Label.string = deskName

                let Room_Num_Label = cc.find("Node_Content/Label_Num", cardNode).getComponent(cc.Label);
                // Room_Num_Label.string = (this.perIndex + 1) + ''

                // 头像
                let headerImage = cc.find("Node_Content/HeaderSprite", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                let Name_Label = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

                let ID_Label = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                ID_Label.string = pItem.uid


                let Group_Label = cc.find("Node_Content/Group_Label", cardNode).getComponent(cc.Label);
                // Group_Label.string = pItem.teamGroup
                // 队-组-小组-推荐
                let groupName = pItem.teamGroup
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

                Group_Label.string = relGroupName

                let Dyj_Label = cc.find("Node_Content/Dyj_Label", cardNode).getComponent(cc.Label);
                Dyj_Label.string = pItem.winCount


                // 中途解散
                let JieSan_Sprite = cc.find("Node_Content/JieSan_Sprite", cardNode)
                if (pItem.disbandCount > 0) {
                    JieSan_Sprite.active = true;
                    let SNum_Label = cc.find("Node_Content/JieSan_Sprite/SNum_Label", cardNode).getComponent(cc.Label);
                    SNum_Label.string = pItem.disbandCount
                } else {
                    JieSan_Sprite.active = false;
                }

                let JfLabel = cc.find("Node_Content/JfLabel", cardNode).getComponent(cc.Label);
                // @ts-ignore
                JfLabel.string = cc.g.utils.realNum1(pItem.integralNum);

                let pjLabel = cc.find("Node_Content/pjLabel", cardNode).getComponent(cc.Label);
                pjLabel.string = pItem.gameNumCount

                // @ts-ignore 
                cc.g.utils.addClickEvent(cc.find("Node_Content/btn_ckzj", cardNode), this, 'tea_zhanji', 'zjChakanzjxq', pItem);

                // add
                scrollView.content.addChild(cardNode, 0);
                // this.perIndex++;
            })
        }
    }

    createCircleListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zjWoDeItemListPre);

                // let deskName = cc.g.utils.getGameName(pItem.gameNum, pItem.origin);
                // @ts-ignore
                let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);

                let Game_Label = cc.find("Node_Content/top_Layout/NameLayout/Game_Label", cardNode).getComponent(cc.Label);
                // Game_Label.string = deskName
                // @ts-ignore
                if (cc.g.utils.judgeStringEmpty(Game_Label)) {
                    Game_Label.string = '暂无'
                } else {
                    Game_Label.string = deskName
                }

                let Room_Num_Label = cc.find("Node_Content/top_Layout/Room_Num_Label", cardNode).getComponent(cc.Label);
                Room_Num_Label.string = "房号:"+pItem.roomId

                let Jue_Num_Label = cc.find("Node_Content/top_Layout/Jue_Num_Label", cardNode).getComponent(cc.Label);
                Jue_Num_Label.string = "局数:"+pItem.gameNum

                let Timer_Label = cc.find("Node_Content/top_Layout/Timer_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.start*1000));

                // 比赛
                let Sai_Label = cc.find("Node_Content/top_Layout/Sai_Label", cardNode)
                Sai_Label.active = false;

                // 中途解散
                let JieSan_Sprite = cc.find("Node_Content/JieSan_Sprite", cardNode)
                if (pItem.isDisband) {
                    JieSan_Sprite.active = false;
                } else {
                    JieSan_Sprite.active = true;
                }

                // 赢label
                let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
                if (pItem.bigWin == 0) {
                    Win_Label.node.active = false;
                } else if (pItem.bigWin == 1) {
                    Win_Label.string = '大赢家'
                    Win_Label.node.active = true;
                } else if (pItem.bigWin == 2) {
                    Win_Label.string = '并列'
                    Win_Label.node.active = true;
                }

                let contentScrollView = cc.find("Node_Content/UserScrollView", cardNode).getComponent(cc.ScrollView);
                pItem.totalFight.forEach((titem) => {
                    let cardCellNode = cc.instantiate(this.zjWoDeCellPre);
                    let nameLabel = cc.find("Name_Label", cardCellNode).getComponent(cc.Label);
                    // @ts-ignore
                    nameLabel.string = cc.g.utils.getFormatName(titem.name, 5*2);

                    let Vaule_Label = cc.find("Vaule_Label", cardCellNode).getComponent(cc.Label);
                    let fight = titem.fight[0];
                    if (fight > 0) {
                        // @ts-ignore
                        let rfight = cc.g.utils.realNum1(fight);
                        Vaule_Label.string = "+"+rfight
                        // @ts-ignore
                        Vaule_Label.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
                    } else {
                        // @ts-ignore
                        let rfight = cc.g.utils.realNum1(fight);
                        Vaule_Label.string = rfight;
                        // @ts-ignore
                        Vaule_Label.node.color = new cc.color(0x74, 0xff, 0x3d,255)
                    }

                    contentScrollView.content.addChild(cardCellNode, 0);
                })

                let DetailButton = cc.find("Node_Content/DetailButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(DetailButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(DetailButton, this, 'tea_zhanji', 'zjDetailClicked', pItem);

                let Share_Button = cc.find("Node_Content/Share_Button", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(Share_Button);
                // @ts-ignore
                cc.g.utils.addClickEvent(Share_Button, this, 'tea_zhanji', 'zjShareClicked', pItem);

                let ZfButton = cc.find("Node_Content/ZfButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(ZfButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(ZfButton, this, 'tea_zhanji', 'zjZongFenClicked', pItem);

                // add
                scrollView.content.addChild(cardNode, 0);
            })
        }
    }

    createZhanDuiZjCyListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // let rowIndex = 0;
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zjCyCellPre);

                let Room_Num_Label = cc.find("Node_Content/Label_Num", cardNode).getComponent(cc.Label);
                Room_Num_Label.string = pItem.teamNo

                // 头像
                let headerImage = cc.find("Node_Content/HeaderSprite", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                let Name_Label = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

                let ID_Label = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                ID_Label.string = pItem.uid


                let Group_Label = cc.find("Node_Content/Group_Label", cardNode).getComponent(cc.Label);
                // Group_Label.string = pItem.teamGroup
                // 队-组-小组-推荐
                let groupName = pItem.teamGroup
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

                Group_Label.string = relGroupName



                let Dyj_Label = cc.find("Node_Content/Dyj_Label", cardNode).getComponent(cc.Label);
                Dyj_Label.string = pItem.winCount


                // 中途解散
                let JieSan_Sprite = cc.find("Node_Content/JieSan_Sprite", cardNode)
                if (pItem.disbandCount > 0) {
                    JieSan_Sprite.active = true;
                    let SNum_Label = cc.find("Node_Content/JieSan_Sprite/SNum_Label", cardNode).getComponent(cc.Label);
                    SNum_Label.string = pItem.disbandCount
                } else {
                    JieSan_Sprite.active = false;
                }

                let JfLabel = cc.find("Node_Content/JfLabel", cardNode).getComponent(cc.Label);
                // @ts-ignore
                JfLabel.string = cc.g.utils.realNum1(pItem.integralNum);

                let pjLabel = cc.find("Node_Content/pjLabel", cardNode).getComponent(cc.Label);
                pjLabel.string = pItem.gameNumCount


                let cellButton = cc.find("cellButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellButton, this, 'tea_zhanji', 'zjZhanDuiClicked', pItem);

                cc.find("Node_Content/btn_ckzj", cardNode).active = false;

                // add
                scrollView.content.addChild(cardNode, 0);
                // rowIndex++;
            })
        }
    }

    createZhanDuiZShujuListDatas(dataArr, scrollView, isRemoveAll) {
        if (isRemoveAll) {
            scrollView.content.removeAllChildren(true);
        }

        // let rowIndex = 0;
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zjCyCellShuJuPre);

                // let Room_Num_Label = cc.find("Node_Content/Label_Num", cardNode).getComponent(cc.Label);
                // Room_Num_Label.string = pItem.teamNo//(rowIndex + 1) + ''

                // 头像
                let headerImage = cc.find("Node_Content/HeaderSprite", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);


                // TeamId   int  `bson:"teamId"`         //战队Id
                // SignUpGold  int `bson:"signUpGold"`   //报名金币
                // LotteryGold  int `bson:"lotteryGold"` //抽奖金币
                // BreakGold  int `bson:"breakGold"`     //退赛金币
                // MakeUpGold  int `bson:"makeUpGold"`   //补偿金币
                // PunishGold  int `bson:"punishGold"`   //处罚金币
                // LotteryNum  int `bson:"lotteryNum"`   //报名人数
                // BigWinNum  int `bson:"bigWinNum"`     //大赢家
                let Name_Label = cc.find("Node_Content/Name_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

                let ID_Label = cc.find("Node_Content/ID_Label", cardNode).getComponent(cc.Label);
                ID_Label.string = pItem.uid


                let bm_Label = cc.find("Node_Content/bm_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                bm_Label.string = cc.g.utils.realNum1(pItem.signUpGold);

                let cj_Label = cc.find("Node_Content/cj_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                cj_Label.string = cc.g.utils.realNum1(pItem.lotteryGold);

                let ts_Label = cc.find("Node_Content/ts_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                ts_Label.string = cc.g.utils.realNum1(pItem.breakGold);

                let cp_Label = cc.find("Node_Content/cp_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                cp_Label.string = cc.g.utils.realNum1((pItem.makeUpGold - pItem.punishGold)) + ''

                let cellButton = cc.find("Node_Content/cellButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(cellButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(cellButton, this, 'tea_zhanji', 'zjCaiPanDetail', pItem);

                let bc_Label = cc.find("Node_Content/bc_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                bc_Label.string = cc.g.utils.realNum1(pItem.contribute);//cc.g.utils.realNum1(pItem.makeUpGold);

                let cf_Label = cc.find("Node_Content/cf_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                cf_Label.string = cc.g.utils.realNum1(pItem.backContribute);//cc.g.utils.realNum1(pItem.punishGold);

                let bmr_Label = cc.find("Node_Content/bmr_Label", cardNode).getComponent(cc.Label);
                bmr_Label.string = pItem.lotteryNum

                // let dyj_Label = cc.find("Node_Content/dyj_Label", cardNode).getComponent(cc.Label);
                // dyj_Label.string = pItem.bigWinNum

                let dqjb_Label = cc.find("Node_Content/dqjb_Label", cardNode).getComponent(cc.Label);
                // @ts-ignore
                dqjb_Label.string = cc.g.utils.realNum1(pItem.currentGold);

                // position
                let posinImg = cc.find("Node_Content/PosSprite", cardNode).getComponent(cc.Sprite);
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                if (pItem.position == 71) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qzz');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 61) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mgg');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 51) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mag');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 41) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dzz');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 31) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzzz');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 21) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzz');
                    posinImg.spriteFrame = spriteFrame;
                } else if (pItem.position == 11) {
                    let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_remm');
                    posinImg.spriteFrame = spriteFrame;
                }
                // add
                scrollView.content.addChild(cardNode, 0);
                // rowIndex++;
            })
        }
    }

    zjCaiPanDetail(event, item) {
        cc.dlog('zjZhanDuiClicked....', item)
        this.zjCPDetailNode.active = true;
        this.zjCPDetail.showUiDatas(item)
    }

    RoomIDClicked(event, item) {
        cc.dlog('RoomIDClicked....', item);

        if (!TeaClass.instance.SettingData['isGoldOpen']) {
            return;
        }

        // @ts-ignore
        let dlg = cc.instantiate(this.roomStaPre);
        // @ts-ignore
        this.node.addChild(dlg);

        dlg.getComponent('tea_zj_fjzt').up(item);
    }

    zjZhanDuiClicked(event, item) {
        cc.dlog('zjZhanDuiClicked....', item)

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)

        if ((TeaClass.instance.position == 71) ||
            (TeaClass.instance.position == 61) ||
            (TeaClass.instance.position == 41) ||
            (TeaClass.instance.position == 31) ||
            (TeaClass.instance.position == 21)) {
            this.pageFourNum = 1
            this.teamId = item.teamId
            this.doRealSearchZhanDuiZjListNext();
        } else {
            cc.dlog('没有权限查看...')
        }
    }

    zjDetailClicked(event, item) {
        cc.dlog('zjDetailClicked....', JSON.stringify(item))

        if (event != null) {
            cc.sys.localStorage.removeItem("ClickedZjVideoDatasxy")
            cc.sys.localStorage.setItem("ClickedZjVideoDatas", JSON.stringify(item));
        }

        // @ts-ignore
        cc.g.utils.btnShake();

        this.jieSuanDetail.showUiDatas(item);
        this.doShowZjJieSuanDetailDialog();
    }

    zjShareClicked(event, item) {
        cc.dlog('zjShareClicked....', item)

        // @ts-ignore
        cc.g.utils.btnShake();
    }

    zjZongFenClicked(event, item) {
        cc.dlog('zjZongFenClicked....', item)

        // @ts-ignore
        cc.g.utils.btnShake();

        this.zjZongFen.showUiDatas(item);
        this.doShowZjZongFenDialog();
    }
    zjChakanzjxq(event, item) {
        cc.dlog('zjChakanzjxq....', JSON.stringify(item))

        if (event != null) {
            cc.sys.localStorage.setItem("ClickedzjChakanzjxq", JSON.stringify(item));
        }

        // @ts-ignore
        cc.g.utils.btnShake();

        let dlg = cc.instantiate(this.zjXiangxiPre);
        this.node.addChild(dlg);
        // if (event == null) {
        //     dlg.active = false
        // }

        let com = dlg.getComponent('tea_zj_cyxq');
        com.upData(item);
        // this.getTeaZjPre().active = true;
        // this.getZjPrexq().upData(item, 0);

        if (event == null) {
            this.scheduleOnce(()=>{
                let videoxy = cc.sys.localStorage.getItem("ClickedZjVideoDatasxy");
                com.zjDetailClicked(null, JSON.parse(videoxy))
            }, 0.6);

        }
    }

    doRenderListView(resp) {
        // this.doShowViewContent()
        // let scrollView = this.scollerNodeArr[this.curTabIndex -1]
        this.doCreateHeaderView(resp);
        // let cardNode = this.headerTabNode.getChildByName("tea_cy_top_item" + (i + 1))
        let items = resp.list
        if (this.curTabIndex == 1) {
            // let isRemoveAll = true;
            if (this.pageOneNum == 1) {
                // // @ts-ignore
                // cc.g.global.destoryWaiting();
                // isRemoveAll = true;
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listOneArr = []
                } else {
                    this.listOneArr = items
                }
                this.listOneAdapter.setDataSet(this.listOneArr);
                this.listOneView.notifyUpdate();
                this.listOneView.scrollToLitte()
            } else {
                // isRemoveAll = false;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listOneArr.concat(items)
                    this.listOneArr = concatArr
                    this.listOneAdapter.setDataSet(this.listOneArr);
                    this.listOneView.notifyUpdate();
                }
            }
            // this.createWoDeListDatas(resp.list, scrollView, isRemoveAll)
        } else if (this.curTabIndex == 2) {
            // let items = resp.list
            // let isRemoveAll = true;
            if (this.pageTwoNum == 1) {
                // // @ts-ignore
                // cc.g.global.destoryWaiting();
                // isRemoveAll = true;
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
                // isRemoveAll = false;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listTwoArr.concat(items)
                    this.listTwoArr = concatArr
                    this.listTwoAdapter.setDataSet(this.listTwoArr);
                    this.listTwoView.notifyUpdate();
                }
            }
            // this.createZjCyListDatas(resp.list, scrollView, isRemoveAll)
        } else if (this.curTabIndex == 3) {
            // let items = resp.list
            // let isRemoveAll = true;
            if (this.pageThreeNum == 1) {
                // // @ts-ignore
                // cc.g.global.destoryWaiting();
                // isRemoveAll = true;
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listThreeArr = []
                } else {
                    this.listThreeArr = items
                }
                this.listThreeAdapter.setDataSet(this.listThreeArr);
                this.listThreeView.notifyUpdate();
                this.listThreeView.scrollToLitte()
            } else {
                // isRemoveAll = false;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listThreeArr.concat(items)
                    this.listThreeArr = concatArr
                    this.listThreeAdapter.setDataSet(this.listThreeArr);
                    this.listThreeView.notifyUpdate();
                }
            }
            // this.createCircleListDatas(resp.list, scrollView, isRemoveAll)
        } else if (this.curTabIndex == 4) {
            // let items = resp.list
            // let isRemoveAll = true;
            if (this.pageFourNum == 1) {
                // // @ts-ignore
                // cc.g.global.destoryWaiting();
                // isRemoveAll = true;
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listFourArr = []
                } else {
                    this.listFourArr = items
                }
                this.listFourAdapter.setDataSet(this.listFourArr);
                this.listFourView.notifyUpdate();
                this.listFourView.scrollToLitte()
            } else {
                // isRemoveAll = false;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listFourArr.concat(items)
                    this.listFourArr = concatArr
                    this.listFourAdapter.setDataSet(this.listFourArr);
                    this.listFourView.notifyUpdate();
                }
            }
            // this.createZhanDuiZjCyListDatas(resp.list, scrollView, isRemoveAll)
        } else if (this.curTabIndex == 5) {
            // let items = resp.list
            // let isRemoveAll = true;
            if (this.pageFiveNum == 1) {
                // // @ts-ignore
                // cc.g.global.destoryWaiting();
                // isRemoveAll = true;
                // @ts-ignore
                if (cc.g.utils.judgeArrayEmpty(items)) {
                    this.listFiveArr = []
                } else {
                    this.listFiveArr = items
                }
                this.listFiveAdapter.setDataSet(this.listFiveArr);
                this.listFiveView.notifyUpdate();
                this.listFiveView.scrollToLitte()
            } else {
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(items)) {
                    let concatArr = this.listFiveArr.concat(items)
                    this.listFiveArr = concatArr
                    this.listFiveAdapter.setDataSet(this.listFiveArr);
                    this.listFiveView.notifyUpdate();
                }
            }
            // this.createZhanDuiZShujuListDatas(resp.list, scrollView, isRemoveAll)
        }
    }

    doGetListDatas() {
        if (this.curTabIndex == 1) {
            this.doRealSearchWoDeList();
        } else if (this.curTabIndex == 2) {
            this.doRealSearchCyZjList();
        } else if (this.curTabIndex == 3) {
            this.doRealSearchCircleZjList();
        } else if (this.curTabIndex == 4) {
            this.searchUp = false;
            this.doRealSearchZhanDuiZjList();
        } else if (this.curTabIndex == 5) {
            this.doRealSearchShuJuList();
        }
    }

    // update (dt) {}

    doRealSearchWoDeList() {
        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int32   pageSize =2;
        // int64   selectUserId =3;//搜索id
        // int32  teaHouseId =4; //茶馆id
        // int32  roomId =5;//房间Id
        // int32  gameType =6;//游戏类型
        // int32   pageNum =7;
        // int32   recordType =8;//1普通场 2金币场
        // searchTeaZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {

        // @ts-ignore
        cc.g.global.showWaiting('');

        // @ts-ignore
        cc.g.hallMgr.searchTeaZhanJiList(this.originType, this.timeType, TeaClass.instance.teaHouseId, this.gameType, this.selectUserId, this.recordType, this.pageOneNum, this.pageSize,  (resp)=>{
            cc.dlog('收到我的战绩数据', resp)
            this.pageOneNum = resp.pageNum;
            this.totalOnePage = resp.totalPage

            this.doRenderListView(resp)

            // if (this.pageOneNum == 1) {
            //     // @ts-ignore
            //     cc.g.global.destoryWaiting();
            // }

            // @ts-ignore
            cc.g.global.destoryWaiting();
        });
    }

    doRealSearchCyZjList() {
        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int32   pageSize =2;
        // int64   selectUserId =3;//搜索id
        // int32  teaHouseId =4; //茶馆id
        // int32  roomId =5;//房间Id
        // int32  gameType =6;//游戏类型
        // int32   pageNum =7;
        // int32   recordType =8;//1普通场 2金币场
        // searchTeaZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {

        // @ts-ignore
        cc.g.global.showWaiting('');

        // @ts-ignore
        cc.g.hallMgr.searchTeaMemberZhanJiList(this.originType, this.timeType, TeaClass.instance.teaHouseId, this.gameType, this.selectUserId, this.recordType, this.teamGroup, this.sortType, this.pageTwoNum, this.pageSize,  (resp)=>{
            cc.dlog('收到我的战绩数据', resp)
            this.pageTwoNum = resp.pageNum;
            this.totalTwoPage = resp.totalPage

            this.selectList = resp.selectList
            this.doShowGameTypeHeaderViewDuiWu()
            this.doRenderListView(resp)

            // @ts-ignore
            cc.g.global.destoryWaiting();
        });
    }


    doRealSearchCircleZjList() {
        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int32   pageSize =2;
        // int64   selectUserId =3;//搜索id
        // int32  teaHouseId =4; //茶馆id
        // int32  roomId =5;//房间Id
        // int32  gameType =6;//游戏类型
        // int32   pageNum =7;
        // int32   recordType =8;//1普通场 2金币场
        // searchTeaZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {

        // @ts-ignore
        cc.g.global.showWaiting('');

        // @ts-ignore
        cc.g.hallMgr.searchTeaCircleZhanJiList(this.originType, this.timeType, TeaClass.instance.teaHouseId, this.gameType, this.selectUserId, this.recordType, this.pageThreeNum, this.pageSize,  (resp)=>{
            cc.dlog('收到我的战绩数据', resp)
            this.pageThreeNum = resp.pageNum;
            this.totalThreePage = resp.totalPage
            this.doRenderListView(resp)
            // @ts-ignore
            cc.g.global.destoryWaiting();
        });
    }

    doRealSearchZhanDuiZjList() {
        cc.dlog("this.searchIndex==>", this.searchIndex)
        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int32   pageSize =2;
        // int64   selectUserId =3;//搜索id
        // int32  teaHouseId =4; //茶馆id
        // int32  roomId =5;//房间Id
        // int32  gameType =6;//游戏类型
        // int32   pageNum =7;
        // int32   recordType =8;//1普通场 2金币场

        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int64  selectUserId =2;//搜索id
        // int32  teaHouseId =3; //茶馆id
        // int32  teamId=4;//战队Id
        // bool   searchUp=5;//是否向上查
    // private teamId: number = 0;
    // private searchUp: boolean = false;
        // searchTeaZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {
        // @ts-ignore
        cc.g.global.showWaiting('');

        // @ts-ignore
        cc.g.hallMgr.searchTeaZhanDuiZhanJiList(this.timeType, TeaClass.instance.teaHouseId, this.gameType, this.selectUserId, this.recordType, this.teamId, this.searchUp, this.sortType2, this.pageFourNum, this.pageSize,  (resp)=>{
            cc.dlog('收到我的战绩数据', resp)
            this.pageFourNum = resp.pageNum;
            this.totalFourPage = resp.totalPage
            this.teamId = resp.teamId
            this.doRenderListView(resp)
            // @ts-ignore
            cc.g.global.destoryWaiting();
        });
    }

    doSetZhanJiBootom(pItem) {

        // int32 signUpGold=1;   //报名金币
        // int32 lotteryGold=2;   //报名金币
        // int32 breakGold=3;   //退赛金币
        // int32 makeUpGold=4;   //补偿金币
        // int32 punishGold=5;   //处罚金币
        // int32 lotteryNum=6;   //报名人数
        // int32 bigWinNum=7;   //报名金币
        // int32 currentGold=8; //当前金币

        let Name_Label = cc.find("Node_Header/Label_BMJB", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        Name_Label.string = cc.g.utils.realNum1(pItem.signUpGold);

        // let ID_Label = cc.find("Node_Header/Label_CJ", this.bottomNodeAllView).getComponent(cc.Label);
        // // @ts-ignore
        // ID_Label.string = cc.g.utils.realNum1(pItem.lotteryGold);


        let bm_Label = cc.find("Node_Header/Label_TS", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        bm_Label.string = cc.g.utils.realNum1(pItem.breakGold);

        let cj_Label = cc.find("Node_Header/Label_CP", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        let reNum = cc.g.utils.realNum1(pItem.makeUpGold - pItem.punishGold)
        cj_Label.string = reNum + ''

        let ts_Label = cc.find("Node_Header/Label_BC", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        ts_Label.string = cc.g.utils.realNum1(pItem.contribute);//cc.g.utils.realNum1(pItem.makeUpGold);

        let cp_Label = cc.find("Node_Header/Label_CF", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        cp_Label.string = cc.g.utils.realNum1(pItem.backContribute);//cc.g.utils.realNum1(pItem.punishGold);

        let bc_Label = cc.find("Node_Header/Label_BM", this.bottomNodeAllView).getComponent(cc.Label);
        bc_Label.string = pItem.lotteryNum

        // let cf_Label = cc.find("Node_Header/Label_DYJ", this.bottomNodeAllView).getComponent(cc.Label);
        // cf_Label.string = pItem.bigWinNum

        let bmr_Label = cc.find("Node_Header/Label_JB", this.bottomNodeAllView).getComponent(cc.Label);
        // @ts-ignore
        bmr_Label.string = cc.g.utils.realNum1(pItem.currentGold);
    }

    doRealSearchShuJuList() {
        cc.dlog("this.searchIndex==>", this.searchIndex)
        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int32   pageSize =2;
        // int64   selectUserId =3;//搜索id
        // int32  teaHouseId =4; //茶馆id
        // int32  roomId =5;//房间Id
        // int32  gameType =6;//游戏类型
        // int32   pageNum =7;
        // int32   recordType =8;//1普通场 2金币场

        // 获取我的战绩
        // int64  timeType =1;  //时间类型
        // int64  selectUserId =2;//搜索id
        // int32  teaHouseId =3; //茶馆id
        // int32  teamId=4;//战队Id
        // bool   searchUp=5;//是否向上查
        // private teamId: number = 0;
        // private searchUp: boolean = false;
        // searchTeaZhanJiList: function (timeType, teaHouseId, gameType, selectUserId, recordType, pageNum, pageSize, callback) {
        // @ts-ignore
        cc.g.global.showWaiting('');
        // @ts-ignore
        cc.g.hallMgr.searchTeaZhanShuJuList(this.timeType, TeaClass.instance.teaHouseId, this.teamId, this.pageFiveNum, this.pageSize,  (resp)=>{
            cc.dlog('收到我的战绩数据', resp)
            this.pageFiveNum = resp.pageNum;
            this.totalFivePage = resp.totalPage
            this.doRenderListView(resp)
            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(resp.teamList)) {
                this.doInitGameTwoTypeHeaderView(resp.teamList);
            }

            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp.sumResp)) {
                this.doSetZhanJiBootom(resp.sumResp)
            }

            // @ts-ignore
            cc.g.global.destoryWaiting();
        });
    }

    doRealSearchZhanDuiZjListPre() {
        this.searchIndex--;
        // if (this.searchIndex == 0) {
        //     this.searchUp = false;
        //     this.teamId = 0;
        // } else {
        //     this.searchUp = true;
        // }

        this.searchUp = true;
        this.doRealSearchZhanDuiZjList();
    }

    doRealSearchZhanDuiZjListNext() {
        this.searchUp = false;
        this.searchIndex++;
        this.doRealSearchZhanDuiZjList();
    }

    doHiddenZjZongFenDialog() {
        this.zjZongFenNode.active = false;
    }

    doShowZjZongFenDialog() {
        cc.dlog('doShowZjZongFenDialog==')
        this.zjZongFenNode.active = true;
    }

    doHiddenZjFanJianStatueDialog() {
        this.zjFanJianStatueNode.active = false;
    }

    doShowZjFanJianStatueDialog() {
        cc.dlog('doShowZjFanJianStatueDialog==')
        this.zjFanJianStatueNode.active = true;
    }

    doHiddenJieSuanDetailDialog() {
        this.zjJieSuanDetailNode.active = false;
    }

    doShowZjJieSuanDetailDialog() {
        cc.dlog('doShowZjJieSuanDetailDialog==')
        this.zjJieSuanDetailNode.active = true;
    }

    doSeachListDatas() {
        cc.dlog('点击搜索');
        let name = this.nameEditBox.string;

        // this.perIndex = 0
        if (this.curTabIndex == 1) { // 成员列表
            this.pageOneNum = 1
        } else if (this.curTabIndex == 2) {
            this.pageTwoNum = 1
        } else if (this.curTabIndex == 3) {
            this.pageThreeNum = 1
        } else if (this.curTabIndex == 4) {
            this.pageFourNum = 1
        } else if (this.curTabIndex == 5) {
            this.pageFiveNum = 1
        }

        this.selectUserId = name;
        this.doGetListDatas();
    }

    doClickDYj() {
        cc.dlog('doClickDYj...')
        if (this.sortTypeOne > 0) {
            this.sortType = -1
        } else {
            this.sortType = 1
        }

        this.sortTypeOne = this.sortType

        this.pageTwoNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }

    doClickJFS() {
        cc.dlog('doClickJFS...')
        if (this.sortTypeTwo > 0) {
            this.sortType = -2
        } else {
            this.sortType = 2
        }

        this.sortTypeTwo = this.sortType

        this.pageTwoNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }

    doClickPJS() {
        cc.dlog('doClickPJS...')
        if (this.sortTypeThree > 0) {
            this.sortType = -3
        } else {
            this.sortType = 3
        }

        this.sortTypeThree = this.sortType

        this.pageTwoNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }



    doClickZDDYj() {
        cc.dlog('doClickZDDYj...')
        if (this.sortTypeOne2 > 0) {
            this.sortType2 = -1
        } else {
            this.sortType2 = 1
        }

        this.sortTypeOne2 = this.sortType2

        this.pageFourNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }

    doClickZDJFS() {
        cc.dlog('doClickZDJFS...')
        if (this.sortTypeTwo2 > 0) {
            this.sortType2 = -2
        } else {
            this.sortType2 = 2
        }

        this.sortTypeTwo2 = this.sortType2

        this.pageFourNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }

    doClickZDPJS() {
        cc.dlog('doClickZDPJS...')
        if (this.sortTypeThree2 > 0) {
            this.sortType2 = -3
        } else {
            this.sortType2 = 3
        }

        this.sortTypeThree2 = this.sortType2

        this.pageFourNum = 1;
        // this.perIndex = 0
        this.doGetListDatas();
    }
}


class ListOneAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZjWode);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListTwoAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZjCyComp);
        if (comp) {
            comp.setData(this.getItem(posIndex), posIndex, false);
        }
    }
}

class ListThreeAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZjWode);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListFourAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZjCyComp);
        if (comp) {
            comp.setData(this.getItem(posIndex), posIndex, true);
        }
    }
}

class ListFiveAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaZjShuJu);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}