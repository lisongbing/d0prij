// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";
import TeaMoreClass from "./tea_geng_duo";
import ListView, {AbsAdapter} from "../../components/ListView";

import TeaGoldBmspItem from "./tea_gold_bmsp_item1";
import TeaGoldBscrzItem from "./tea_gold_bmsp_item2";
import TeaGoldSsbdItem from "./tea_gold_bmsp_item3";
import TeaGoldZdjfItem from "./tea_gold_bmsp_item4";


const {ccclass, property} = cc._decorator;

let tea = null;
const PGNUM = 20;

@ccclass
export default class TeaBmsp extends cc.Component {
    static instance: TeaBmsp = null;
    // @property(cc.Prefab)
    // ItemBmsp: cc.Prefab = null;
    // @property(cc.Prefab)
    // ItemJbcrz: cc.Prefab = null;
    // @property(cc.Prefab)
    // ItemSsbd: cc.Prefab = null;
    // @property(cc.Prefab)
    // Itemzdxy: cc.Prefab = null;
    @property(cc.Prefab)
    YqcsDlg: cc.Prefab = null;
    @property(cc.Prefab)
    teaFbDialogPre: cc.Prefab = null;

    togZdxy:cc.Node = null;
    EditBox_search:cc.EditBox = null;
    private searchId: string = null

    ctt:Object = {};
    curTag:string = '';

    noticeSprite: cc.Node = null;

    private pageOneNum: number = 0;
    private totalOnePage: number = 1;

    private pageTwoNum: number = 1;
    private totalTwoPage: number = 1;
    private checkedSeeMeTwo: boolean = false;

    private pageThreeNum: number = 0;
    private totalThreePage: number = 1;
    private checkedSeeMeThree: boolean = false;

    private pageFourNum: number = 0;
    private totalFourPage: number = 1;

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

    // LIFE-CYCLE CALLBACKS:

    initListView() {
        this.listOneAdapter = new ListOneAdapter()
        this.listOneAdapter.setDataSet(this.listOneArr);
        this.listOneView.setAdapter(this.listOneAdapter);

        // this.listOneView.pullDown(() => {
        //     cc.dlog("??????????????????????????????.");
        //
        // }, this);
        this.listOneView.pullUp(() => {
            cc.dlog("??????????????????????????????.")
            this.bmsp_scroll_to_bottom(null)
        }, this);

        this.listTwoAdapter = new ListTwoAdapter()
        this.listTwoAdapter.setDataSet(this.listTwoArr);
        this.listTwoView.setAdapter(this.listTwoAdapter);

        // this.listTwoView.pullDown(() => {
        //     cc.dlog("??????????????????????????????.");
        // }, this);
        this.listTwoView.pullUp(() => {
            cc.dlog("??????????????????????????????.")
            this.jbcrz_scroll_to_bottom(null)
        }, this);

        this.listThreeAdapter = new ListThreeAdapter()
        this.listThreeAdapter.setDataSet(this.listThreeArr);
        this.listThreeView.setAdapter(this.listThreeAdapter);
        this.listThreeView.pullUp(() => {
            cc.dlog("??????????????????????????????.")
            this.ssbd_scroll_to_bottom(null)
        }, this);

        this.listFourAdapter = new ListFourAdapter()
        this.listFourAdapter.setDataSet(this.listFourArr);
        this.listFourView.setAdapter(this.listFourAdapter);
        this.listFourView.pullUp(() => {
            cc.dlog("??????????????????????????????.")
            this.zdxy_scroll_to_bottom(null)
        }, this);
    }

    onLoad () {
        tea = TeaClass.instance;
        tea.goldChangCB['bmsp_gc'] = this.onBmspGC.bind(this);

        TeaBmsp.instance = this;

        let r = this.node;

        // @ts-ignore
        cc.find('Btn_yqcs', r).active = XUQIU_OC.yqcs;

        this.togZdxy = cc.find('New ToggleContainer/toggle4', r);
        
        //?????????
        this.EditBox_search = cc.find('EditBox_search', r).getComponent(cc.EditBox);
        this.EditBox_search.string = '';

        let nn = ['bmsp', 'jbcrz', 'ssbd', 'zdxy', ];
        for (let i = 0; i < nn.length; ++i) {
            this.ctt[nn[i]] = cc.find(nn[i], r);
            this.ctt[nn[i]]._up = (idx, id)=>{
                let fn = 'up'+nn[i];
                this[fn](idx, id);
            }
            // this.ctt[nn[i]].ud={};
            this.ctt[nn[i]].active = false;
        }

        this.load_bmsp();
        this.load_jbcrz();
        this.load_ssbd();
        this.load_zdxy();

        this.initListView();

        //????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
        if (tea.position==51 || tea.position==1) {
            this.togZdxy.active = false
        } else {
            this.togZdxy.active = true
        }
        // this.togZdxy.active = (tea.position==51 || tea.position==61 || tea.position==1);

        this.noticeSprite = cc.find("New ToggleContainer/toggle4/Sprite_Notice", r)
        this.noticeSprite.active = false

        if (TeaClass.instance.applyGoldMathCount > 0) {
            TeaClass.instance.doShowNoticeMore(true)
            // TeaMoreClass.instance.doShowNotice(true)
            this.showNoticeSprite(true)
        } else {
            TeaClass.instance.doShowNoticeMore(false)
            // TeaMoreClass.instance.doShowNotice(false)
            this.showNoticeSprite(false)
        }
    }

    load_bmsp () {
        let r = this.ctt['bmsp'];

        r.Label_bmrs = cc.find('Label_bmrs', r).getComponent(cc.Label);
        r.Label_bmrs.string = `???????????????${0}???`;

        // r.sv_list = cc.find('New ScrollView', r).getComponent(cc.ScrollView);
        // r.sv_list.content.destroyAllChildren();
        //
        // r.sv_list.node.on('scroll-to-bottom', this.bmsp_scroll_to_bottom, this);
    }

    load_jbcrz () {
        let r = this.ctt['jbcrz'];

        r.togSeeMe = cc.find('Toggle_seeme', r).getComponent(cc.Toggle);

        // r.sv_list = cc.find('New ScrollView', r).getComponent(cc.ScrollView);
        // r.sv_list.content.destroyAllChildren();
        //
        // r.sv_list.node.on('scroll-to-bottom', this.jbcrz_scroll_to_bottom, this);
    }

    load_ssbd () {
        let r = this.ctt['ssbd'];

        r.Label_renshu = cc.find('Label_renshu', r).getComponent(cc.Label);
        r.Label_renshu.string = `????????????${0}???`;

        r.togSeeMe = cc.find('Toggle_seeme', r).getComponent(cc.Toggle);

        // r.sv_list = cc.find('New ScrollView', r).getComponent(cc.ScrollView);
        // r.sv_list.content.destroyAllChildren();
        //
        // r.sv_list.node.on('scroll-to-bottom', this.ssbd_scroll_to_bottom, this);

        r.dlgCaipan = cc.find('caipan', r);
        r.dlgCaipan.active = false;

        r.eboxbc1 = cc.find('caipan/bucang/EditBox_gold', r).getComponent(cc.EditBox);
        r.eboxbc2 = cc.find('caipan/chufa/EditBox_gold', r).getComponent(cc.EditBox);

        // ??????
        r.Label_tjrs = cc.find('c9_16/tjrs', r).getComponent(cc.Label);
        r.Label_tjjs = cc.find('c9_16/tjjs', r).getComponent(cc.Label);
        r.Label_tjjf = cc.find('c9_16/tjjf', r).getComponent(cc.Label);
    }

    load_zdxy () {
        let r = this.ctt['zdxy'];
        r._1act = false;

        r.closed = cc.find('closed', r);
        r.togclose = cc.find('closed/toggle', r).getComponent(cc.Toggle);

        r.opened = cc.find('opened', r);
        r.togopen = cc.find('opened/toggle', r).getComponent(cc.Toggle);

        // r.sv_list = cc.find('New ScrollView', r.opened).getComponent(cc.ScrollView);
        // r.sv_list.content.destroyAllChildren();
        //
        // r.sv_list.node.on('scroll-to-bottom', this.zdxy_scroll_to_bottom, this);

        // ?????????
        r.dlgJJX = cc.find('jjx', r.opened);
        r.dlgJJX.Button_bc = cc.find('jjx/Button_bc', r.opened);
        r.tzxy_ebjjx = cc.find('jjx/EditBox_jjx', r.opened).getComponent(cc.EditBox);

        // ??????
        r.dlgTZ = cc.find('tzxy', r.opened);
        r.tzxy_ebxinyu = cc.find('tzxy/EditBox_xinyu', r.opened).getComponent(cc.EditBox);
        
        // ??????
        r.dlgJL = cc.find('ckjl', r.opened);
        
        let sv = cc.find('New ScrollView', r.dlgJL).getComponent(cc.ScrollView);
        sv.content.destroyAllChildren();
        sv.node.on('scroll-to-bottom', ()=>{
            let r = this.ctt['zdxy'];
            this.zdxyUpCkjl(r.ckjl_cruItm, 1);
        }, this);

        r.dlgJJX.active = r.dlgJL.active = r.dlgTZ.active = false;
        r.jlud = {};

        if (tea.position!=71) {
            r.togclose.node.active = r.togopen.node.active = false;
        }
    }


    start () {

    }

    // update (dt) {}


    // ---------------------------------------------------------------------------------------------------

    //
    up() {
        cc.dlog('up');

        this.onTogTag(0, 'ssbd');//bmsp

        //????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
        if (tea.position==51 || tea.position==1) {
            return;
        }

        // this.upzdxy(null, null);
    }

    // ????????????
    onTogTag(evt, data) {
        cc.dlog('onTogTag', data);

        this.EditBox_search.string = '';
        this.searchId = ''

        for (const key in this.ctt) {
            this.ctt[key].active = false;
        }

        // this.ctt[data] && this.ctt[data]._up();

        this.curTag = data;

        if (this.curTag=='bmsp') {
            this.upbmsp(0)
        } else if (this.curTag=='jbcrz') {
            this.pageTwoNum = 1
            this.upjbcrz();
        } else if (this.curTag=='ssbd') {
            this.upssbd(0)
        } else if (this.curTag=='zdxy') {
            this.upzdxy(0)
        }
    }

    // 
    onBtnSearch(evt, data) {
        cc.dlog('onBtnSearch ', this.EditBox_search.string);

        let id = this.EditBox_search.string;
        this.searchId = id

        // this.ctt[this.curTag] && this.ctt[this.curTag]._up(0, id);
        //
        // return;

        // if (this.curTag=='bmsp') {
        //     let r = this.ctt['bmsp'];
        //     r.items.forEach(e => {
        //         e.active = (id=='' || (e['id'].string == id));
        //     });
        //
        //     return;
        // }


        // this.load_bmsp();
        // this.load_jbcrz();
        // this.load_ssbd();
        // this.load_zdxy();

        if (this.curTag=='bmsp') {
            this.upbmsp(0)
        } else if (this.curTag=='jbcrz') {
            this.pageTwoNum = 1
            this.upjbcrz();
        } else if (this.curTag=='ssbd') {
            this.upssbd(0)
        } else if (this.curTag=='zdxy') {
            this.upzdxy(0)
        }

        // if (this.curTag=='ssbd') {
        //     //this.onSsbdTogSeeMe();
        //     let r = this.ctt['ssbd'];
        //     let id = this.EditBox_search.string;
        //     r.items.forEach(e => {
        //         // ????????? ????????????ID??????
        //         e.active = (id=='' || (e['id'].string == id));
        //     });
        //
        //     this.onSsbdUptj();
        //     return;
        // }
        //
        // if (this.curTag=='zdxy') {
        //     this.onZdxySearch();
        //     return;
        // }
        
        //this.EditBox_search.string = '';
    }

    showNoticeSprite(show) {
        if (this.noticeSprite != null) {
            this.noticeSprite.active = show
        }
    }

    onBmspGC(gold) {
        cc.dlog('onBmspGC');

        if (this.curTag == 'ssbd') {
            let r = this.ctt['ssbd'];

            if (r.selfitem) {
                // @ts-ignore
                r.selfitem.ud.gold = gold;
                // @ts-ignore
                r.selfitem['syjb'].string = cc.g.utils.realNum1(gold);
            }
        }
    }

    // ------------????????????---------------------------------------------------------------------------------------

    upbmsp(reqIndex) {
        // @ts-ignore
        if (cc.g.utils.judgeObjectEmpty(reqIndex)) {
            reqIndex = 0
        }
        // idx = idx || 0;
        // id  = id || '';
        //
        // let r = this.ctt['bmsp'];
        // let ud = r.ud;
        //
        // if (idx==0) {
        //     ud.list = [];
        //     ud.searchList = [];
        //     r.items = [];
        // }
        //
        // ud.isSearch = (id!='');

        {/*
            //??????????????????
            //@api:2287,@type:req
            message GoldMatchApplyListReq{
                int32    teaHouseId=1;//??????Id
                string   searchId=2;//??????Id????????????
                int32    index=3;//??????
                int32    pageSize=4;//?????????????????? 
            }
            //@api:2287,@type:resp
            message  GoldMatchApplyListResp{
                int32    teaHouseId=1;//??????Id
                int32    index=2;//??????    
                int32    pageSize=3;//?????????????????? 
                int32    totalCount=4;//?????????
                int32    applyCount=5;//????????????
                repeated GoldMatchApplyUser list=6;//??????????????????
            }
            //????????????????????????
            message GoldMatchApplyUser {
                int64     userId=1;//??????Id
                string    name=2;//????????????
                string    icon=3;//????????????
                int32     time=4;//???????????????(??????:???)
                int32     gold=5;//??????
                string    teamName=6;//?????????
            }
        */}
        
        // let reqIndex = this.listOneArr.length

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_APPLY_LIST);
        req.teaHouseId = tea.teaHouseId;
        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(this.searchId)) {
            req.searchId = this.searchId
        }
        req.index = reqIndex;
        req.pageSize = PGNUM;

        if (reqIndex == 0) {
            // @ts-ignore
            cc.g.global.showWaiting('');
            let r = this.ctt['bmsp'];
            r.active = true;
        }

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_APPLY_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_APPLY_LIST ??????');
                // @ts-ignore

                // this.pageOneNum = resp.index;
                // ud.pageSize = resp.pageSize;
                // ud.totalCount = resp.totalCount;
                // ud.applyCount = resp.applyCount;
                // ud.list = ud.list || [];
                // ud.searchList = ud.searchList || [];
                let r = this.ctt['bmsp'];
                r.Label_bmrs.string = `???????????????${resp.applyCount}???`;

                let items = resp.list
                // let isRemoveAll = true;
                if (reqIndex == 0) {
                    // @ts-ignore
                    cc.g.global.destoryWaiting();
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
                        // this.listOneView.scrollToLitte()
                    }
                }

                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(this.listOneArr)) {
                    TeaClass.instance.doShowNoticeMore(true)
                    // TeaMoreClass.instance.doShowNotice(true)
                    this.showNoticeSprite(true)
                } else {
                    TeaClass.instance.doShowNoticeMore(false)
                    // TeaMoreClass.instance.doShowNotice(false)
                    this.showNoticeSprite(false)
                }

                // cc.dlog(`ud.list.length ${ud.list.length}   resp.index ${resp.index}`);

                // resp.list.forEach(e => {
                //     let d = {
                //         userId:e.userId,//??????Id
                //         name:e.name,//????????????
                //         icon:e.icon,//????????????
                //         time:e.time,//???????????????(??????:???)
                //         gold:e.gold,//??????
                //         teamName:e.teamName,//?????????
                //     }
                //
                //     if (ud.isSearch) {
                //         ud.searchList.push(d);
                //     } else {
                //         ud.list.push(d);
                //     }
                // });
                //
                // if (false && ud.list.length < 1) {
                //     ud.list.push({
                //         userId:1,//??????Id
                //         name:'????????????',//????????????
                //         icon:'1',//????????????
                //         time:Date.now()/1000,//???????????????(??????:???)
                //         gold:1000,//??????
                //         teamName:'?????????',//?????????
                //     });
                //
                //     for (let i = 0; i < 20; ++i) {
                //         // @ts-ignore
                //         let d = cc.g.clone(ud.list[0]);
                //
                //         d.userId = 1000+i;
                //
                //         ud.list.push(d);
                //     }
                // }
                //
                // (idx == 0) ? this.upBmspView(): this.addBmspitms();
                //
                // // @ts-ignore
                // if (!cc.g.utils.judgeArrayEmpty(ud.list)) {
                //     TeaClass.instance.doShowNoticeMore(true)
                //     // TeaMoreClass.instance.doShowNotice(true)
                //     this.showNoticeSprite(true)
                // } else {
                //     TeaClass.instance.doShowNoticeMore(false)
                //     // TeaMoreClass.instance.doShowNotice(false)
                //     this.showNoticeSprite(false)
                // }
            } else {
                cc.dlog('GOLD_MATCH_APPLY_LIST ??????');
            }
        });
    }
    // upBmspView() {
    //     cc.dlog('upBmspView');
    //
    //     let r = this.ctt['bmsp'];
    //     r.active = true;
    //
    //     r.items = [];
    //
    //     let ctt = r.sv_list.content;
    //     ctt.destroyAllChildren();
    //
    //     this.addBmspitms();
    // }
    // addBmspitms() {
    //     cc.dlog('addBmspitms');
    //
    //     let r = this.ctt['bmsp'];
    //
    //     let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
    //     let items = r.items;
    //     let bidx = items.length;
    //
    //     let ctt = r.sv_list.content;
    //     for (let i = bidx; i < bidx+PGNUM; ++i) {
    //         if (!list[i]) {
    //             break;
    //         }
    //
    //         let d = list[i];
    //
    //         let itm = cc.instantiate(this.ItemBmsp);
    //         itm['idx'] = i+1;
    //         itm['ud'] = d;
    //
    //         // ??????
    //         itm['xh'] = cc.find('xh', itm).getComponent(cc.Label);
    //         itm['xh'].string = ''+itm['idx'];
    //
    //         // @ts-ignore ??????
    //         cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', itm), d.icon);
    //
    //         // ??????
    //         cc.find('name', itm).getComponent(cc.Label).string = d.name;
    //
    //         // ID
    //         itm['id']  = cc.find('id', itm).getComponent(cc.Label);
    //         // @ts-ignore
    //         itm['id'].string = ''+i64v(d.userId);
    //
    //         // @ts-ignore ??????
    //         cc.find('time', itm).getComponent(cc.Label).string = cc.g.utils.getFormatTimeXXX(d.time * 1000, '|h|:|m|\n|Y|:|M|:|D|');
    //         // @ts-ignore ????????????
    //         cc.find('zd', itm).getComponent(cc.Label).string = cc.g.utils.getFormatName(d.teamName, 3*2);
    //         // @ts-ignore ??????
    //         cc.find('cyss', itm).getComponent(cc.Label).string = `${cc.g.utils.realNum1(d.gold)}??????????????????`;
    //
    //         // @ts-ignore ????????????
    //         cc.g.utils.addClickEvent(cc.find('no', itm), this.node, 'tea_gold_bmsp', 'onBtnBmspAgree', {agree:false, itm:itm});
    //         // @ts-ignore
    //         cc.g.utils.addClickEvent(cc.find('yes', itm), this.node, 'tea_gold_bmsp', 'onBtnBmspAgree', {agree:true, itm:itm});
    //
    //
    //         ctt.addChild(itm);
    //
    //         items.push(itm);
    //     }
    //
    //     r.Label_bmrs.string = `???????????????${r.ud.applyCount}???`;
    // }
    onBtnBmspAgree(evt, arg) {
        // cc.dlog('onBtnBmspAgree', arg.agree, arg.itm.idx);

        // @ts-ignore
        cc.g.utils.btnShake();

        // let idx = arg.itm.idx;
        //
        // let r = this.ctt['bmsp'];
        //
        // let list = r.ud.list;
        // let items = r.items;
        //
        // list.splice(idx-1, 1);
        // items.splice(idx-1, 1);
        // for (let i = 0; i < items.length; i++) {
        //     items[i]['idx'] = i+1;
        //     items[i]['xh'].string = ''+(i+1);
        // }
        //
        //
        //
        //
        // r.Label_bmrs.string = `???????????????${--r.ud.applyCount}???`;
        //
        // arg.itm.destroy();


        {/*
            //?????????????????????
            //@api:2288,@type:req
            message AgreeGoldMatchReq{
                int32 teaHouseId=1;//??????Id
                int64 applyId=2;//????????????Id
            }
            //@api:2288,@type:resp
            message AgreeGoldMatchResp{
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(arg.agree ? PB.PROTO.AGREE_GOLD_MATCH : PB.PROTO.REFUSE_GOLD_MATCH);
        req.teaHouseId = tea.teaHouseId;
        req.applyId = arg.itm.userId;

        // @ts-ignore
        cc.g.networkMgr.send(arg.agree ? PB.PROTO.AGREE_GOLD_MATCH : PB.PROTO.REFUSE_GOLD_MATCH, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('AGREE_GOLD_MATCH ??????');
                // @ts-ignore
                this.upbmsp(0)
            } else {
                //cc.dlog('AGREE_GOLD_MATCH ??????');
            }
        });
    }
    bmsp_scroll_to_bottom(scrollView) {
        // ?????????????????? ScrollView ??????
        // do whatever you want with scrollview

        // let r = this.ctt['bmsp'];
        //
        // if (r.ud.isSearch) return;

        //let bidx = r.items.length;
        let bidx = this.listOneArr.length;
        
        this.upbmsp(bidx);
    }

    // ------------????????????---------------------------------------------------------------------------------------



    // ------------???????????????---------------------------------------------------------------------------------------

    upjbcrz() {
        // cc.dlog('upjbcrz idx', idx);
        // // @ts-ignore
        // if (cc.g.utils.judgeObjectEmpty(reqIndex)) {
        //     reqIndex = 0
        // }
        //
        // idx = idx || 0;
        // id  = id || '';
        //
        // let r = this.ctt['jbcrz'];
        // let ud = r.ud;
        //
        // if (idx==0) {
        //     ud.list = [];
        //     ud.searchList = [];
        //     r.items = [];
        //     ud.pageNum = 0;
        // }
        //
        // ud.isSearch = (id!='');

        {/*
            //?????????????????????
            //@api:2293,@type:req
            message GoldMatchGoldListReq{
                int32    teaHouseId=1;//??????Id
                bool     mineApprove=2;//??????????????????
                string   searchId=3;//??????Id????????????
                int32    pageNum=4;//???????????????
                int32    pageSize=5;//?????????????????? 
            }
            //@api:2293,@type:resp
            message  GoldMatchGoldListResp{
                int32    teaHouseId=1;//??????Id
                int32    pageNum=2;//???????????????    
                int32    pageSize=3;//?????????????????? 
                int32    totalCount=4;//?????????
                int32    totalPage=5;//?????????
                repeated GoldMatchGoldLogInfo list=6;//?????????????????????
            }
            //???????????????
            message GoldMatchGoldLogInfo{
                int64   userId=1;//??????Id
                int32   position=2;//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                string  name=3;//??????
                string  icon=4;//??????
                int32   gold=5;//??????
                int32   teamId=6;//??????Id
                string  teamName=7;//?????????
                string  event=8;//??????
                int64   reviewerId=9;//?????????Id
                string  reviewerName=10;//???????????????
                string  reviewerIcon=11;//???????????????
                int32   time=12;//????????????
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_GOLD_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.mineApprove = this.checkedSeeMeTwo;
        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(this.searchId)) {
            req.searchId = this.searchId
        }
        // req.pageNum = ud.pageNum ? (ud.pageNum+1) : 1;
        // req.pageSize = 50;

        req.pageNum = this.pageTwoNum;
        req.pageSize = PGNUM;

        if (this.pageTwoNum == 1) {
            // @ts-ignore
            cc.g.global.showWaiting('');
            let r = this.ctt['jbcrz'];
            r.active = true;
        }

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_GOLD_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_APPLY_LIST ??????');
                // @ts-ignore

                this.pageTwoNum = resp.pageNum;
                this.totalTwoPage = resp.totalPage;
                // ud.totalCount = resp.totalCount;
                // ud.totalPage = resp.totalPage;

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
                        // this.listTwoView.scrollToLitte()
                    }
                }

                // resp.list.forEach(e => {
                //     let d = {
                //         userId:e.userId,//??????Id
                //         position:e.position,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:e.name,//??????
                //         icon:e.icon,//??????
                //         gold:e.gold,//??????
                //         teamId:e.teamId,//??????Id
                //         teamName:e.teamName,//?????????
                //         event:e.event,//??????
                //         reviewerId:e.reviewerId,//?????????Id
                //         reviewerName:e.reviewerName,//???????????????
                //         reviewerIcon:e.reviewerIcon,//???????????????
                //         time:e.time,//????????????
                //     }
                //
                //     if (ud.isSearch) {
                //         ud.searchList.push(d);
                //     } else {
                //         ud.list.push(d);
                //     }
                // });
                //
                // if (false && ud.list.length < 1) {
                //     ud.list.push({
                //         userId:1,//??????Id
                //         position:1,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:'??????',//??????
                //         icon:'1',//??????
                //         gold:1000,//??????
                //         teamId:1,//??????Id
                //         teamName:'?????????',//?????????
                //         event:'??????',//??????
                //         reviewerId:111,//?????????Id
                //         reviewerName:'???????????????',//???????????????
                //         reviewerIcon:'1',//???????????????
                //         time:Date.now()/1000,//????????????
                //     });
                //
                //     for (let i = 0; i < 20; ++i) {
                //         // @ts-ignore
                //         let d = cc.g.clone(ud.list[0]);
                //         d.userId = 1000+i;
                //         // @ts-ignore
                //         d.reviewerId = (i%2 ? 1000+i : cc.g.userMgr.userId);
                //         ud.list.push(d);
                //     }
                // }
                //
                // (idx == 0) ? this.upJbcrzView(): this.addJbcrzitms();
            } else {
                cc.dlog('GOLD_MATCH_APPLY_LIST ??????');
            }
        });
    }
    // upJbcrzView() {
    //     cc.dlog('upJbcrzView');
    //
    //     let r = this.ctt['jbcrz'];
    //     r.active = true;
    //
    //     r.items = [];
    //
    //     let ctt = r.sv_list.content;
    //     ctt.destroyAllChildren();
    //
    //     this.addJbcrzitms();
    // }
    // addJbcrzitms() {
    //     cc.dlog('addJbcrzitms');
    //
    //     let r = this.ctt['jbcrz'];
    //
    //     let seeme = r.togSeeMe.isChecked;
    //
    //     let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
    //     let items = r.items;
    //     let bidx = items.length;
    //
    //     let ctt = r.sv_list.content;
    //     for (let i = bidx; i < bidx+10; ++i) {
    //         if (!list[i]) {
    //             break;
    //         }
    //
    //         let d = list[i];
    //
    //         let itm = cc.instantiate(this.ItemJbcrz);
    //         itm['reviewerId'] = d.reviewerId;
    //
    //         // @ts-ignore ??????
    //         cc.find('sj', itm).getComponent(cc.Label).string = cc.g.utils.getFormatTimeXXX(d.time * 1000, '|h|:|m|\n|Y|:|M|:|D|');
    //
    //         // @ts-ignore ??????
    //         cc.g.utils.setHead(cc.find('Node_headMask1/Sprite_head', itm), d.icon);
    //
    //         // ??????
    //         cc.find('name', itm).getComponent(cc.Label).string = d.name;
    //         // @ts-ignore ID
    //         itm['id'] = cc.find('ID', itm).getComponent(cc.Label);
    //         // @ts-ignore
    //         itm['id'].string = ''+i64v(d.userId);
    //
    //
    //         // @ts-ignore ????????????
    //         cc.find('zd', itm).getComponent(cc.Label).string = cc.g.utils.getFormatName(d.teamName, 3*2);
    //         // ??????
    //         cc.find('sj2', itm).getComponent(cc.Label).string = d.event;
    //
    //         // @ts-ignore ??????
    //         cc.g.utils.setHead(cc.find('Node_headMask2/Sprite_head', itm), d.reviewerIcon);
    //         // @ts-ignore ???????????????
    //         cc.find('name2', itm).getComponent(cc.Label).string = cc.g.utils.getFormatName(d.reviewerName, 3*2);
    //         // @ts-ignore ?????????ID
    //         cc.find('ID2', itm).getComponent(cc.Label).string = ''+i64v(d.reviewerId);
    //
    //         ctt.addChild(itm);
    //
    //         // @ts-ignore
    //         if (seeme && !eq64(d.reviewerId, cc.g.userMgr.userId)) {
    //             itm.active = false;
    //         }
    //
    //         items.push(itm);
    //     }
    // }
    onJbcrzTogSeeMe() {
        cc.dlog('onTogSeeMe');
        let r = this.ctt['jbcrz'];
        this.checkedSeeMeTwo = r.togSeeMe.isChecked;
        cc.log('seeme--->' + this.checkedSeeMeTwo)
        this.pageTwoNum = 1;
        this.upjbcrz();

       //
       //
       //
       // if (this.curTag=='jbcrz') {
       //     this.checkedSeeMeTwo = r.togSeeMe.isChecked;
       //     cc.log('seeme--->' + this.checkedSeeMeTwo)
       //     this.pageTwoNum = 1;
       //     this.upjbcrz();
       //  } else if (this.curTag=='ssbd') {
       //     this.checkedSeeMeThree = r.togSeeMe.isChecked;
       //     cc.log('seeme--->' + this.checkedSeeMeThree)
       //     this.upssbd(0)
       //  }

        // let id = this.EditBox_search.string;

        // r.items.forEach(e => {
        //     e.active = false;
        //
        //     // ????????? ????????????ID??????
        //     if (id=='' || (e['id'].string == id)) {
        //         // @ts-ignore ????????????????????? ????????????????????????
        //         if (!seeme || eq64(e.reviewerId, cc.g.userMgr.userId)) {
        //             e.active = true;
        //         }
        //     }
        // });
    }
    jbcrz_scroll_to_bottom(scrollView) {
        // ?????????????????? ScrollView ??????
        // do whatever you want with scrollview

        // let r = this.ctt['jbcrz'];
        //
        // if (r.ud.isSearch) return;

        //let bidx = r.items.length;

        // ???????????????????????????????????????
        if (this.pageTwoNum < this.totalTwoPage) {
            this.pageTwoNum++;
            this.upjbcrz();
        }
    }

    // ------------???????????????---------------------------------------------------------------------------------------

    // ------------????????????---------------------------------------------------------------------------------------

    upssbd(reqIndex) {
        // @ts-ignore
        if (cc.g.utils.judgeObjectEmpty(reqIndex)) {
            reqIndex = 0
        }
        //
        // idx = idx || 0;
        // id  = id || '';
        //
        // let r = this.ctt['ssbd'];
        // let ud = r.ud;
        //
        // if (idx==0) {
        //     ud.list = [];
        //     ud.searchList = [];
        //     r.items = [];
        // }
        //
        // ud.isSearch = (id!='');

        {/*
            //?????????????????????
            //@api:2294,@type:req
            message GoldMatchRankListReq{
                int32    teaHouseId=1;//??????Id
                bool     mineApprove=2;//??????????????????
                string   searchId=3;//??????Id????????????
                int32    index=4;//??????    
                int32    pageSize=5;//?????????????????? 
                int32    totalCount=6;//?????????
            }
            //@api:2294,@type:resp
            message  GoldMatchRankListResp{
                int32    teaHouseId=1;//??????Id
                int32    index=2;//??????    
                int32    pageSize=3;//?????????????????? 
                int32    totalCount=4;//?????????
                int32    totalMatchCount=5;//?????????
                int64    totalGold=6;//?????????
                int32    totalPeopleCount=7;//?????????
                repeated GoldMatchRankInfo list=8;//?????????????????????
            }
            //???????????????
            message GoldMatchRankInfo{
                int32   rank=1;//??????
                int64   userId=2;//??????Id
                int32   position=3;//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                string  name=4;//??????
                string  icon=5;//??????
                int32   gold=6;//??????????????????
                int32   matchCount=7;//??????
                bool    power=8;//??????????????????
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_RANK_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.mineApprove = this.checkedSeeMeThree;//r.togSeeMe.isChecked;
        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(this.searchId)) {
            req.searchId = this.searchId
        }
        req.index = reqIndex
        req.pageSize = PGNUM;

        if (reqIndex == 0) {
            // @ts-ignore
            cc.g.global.showWaiting('');
            let r = this.ctt['ssbd'];
            r.active = true;
        }

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_RANK_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_RANK_LIST ??????');
                // @ts-ignore

                // this.pageThreeNum = resp.index;
                // ud.pageSize = resp.pageSize;
                // ud.totalCount = resp.totalCount;
                // ud.totalMatchCount = resp.totalMatchCount;
                // ud.totalGold = resp.totalGold;
                // ud.totalPeopleCount = resp.totalPeopleCount;

                // cc.dlog('resp-->' + JSON.stringify(resp))

                let r = this.ctt['ssbd'];
                r.Label_renshu.string = `????????????${resp.totalPeopleCount}???`;

                let totalPeopleCount = resp.totalPeopleCount
                let totalMatchCount = resp.totalMatchCount
                let totalGold = resp.totalGold

                let items = resp.list

                if (reqIndex == 0) {
                    // @ts-ignore
                    cc.g.global.destoryWaiting();
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
                    // @ts-ignore
                    if (!cc.g.utils.judgeArrayEmpty(items)) {
                        let concatArr = this.listThreeArr.concat(items)
                        this.listThreeArr = concatArr
                        this.listThreeAdapter.setDataSet(this.listThreeArr);
                        this.listThreeView.notifyUpdate();
                        // this.listTwoView.scrollToLitte()
                    }
                }


                this.onSsbdUptj(totalPeopleCount, totalMatchCount, totalGold)
                // resp.list.forEach(e => {
                //     let d = {
                //         rank:e.rank,//??????
                //         userId:e.userId,//??????Id
                //         position:e.position,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:e.name,//??????
                //         icon:e.icon,//??????
                //         gold:e.gold,//??????
                //         matchCount:e.matchCount,//??????
                //         power:e.power,//??????
                //     }
                //
                //     if (ud.isSearch) {
                //         ud.searchList.push(d);
                //     } else {
                //         ud.list.push(d);
                //     }
                // });
                //
                // if (false && ud.list.length < 1) {
                //     ud.list.push({
                //         rank:1,//??????
                //         userId:1,//??????Id
                //         position:1,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:'??????',//??????
                //         icon:'1',//??????
                //         gold:1000,//??????
                //         matchCount:7,//??????
                //         power:true,//????????????
                //     });
                //
                //     for (let i = 0; i < 20; ++i) {
                //         // @ts-ignore
                //         let d = cc.g.clone(ud.list[0]);
                //         d.rank = 2+i;
                //         d.userId = 1000+i;
                //         d.power = (i%2 == 1);
                //         ud.list.push(d);
                //     }
                // }
                //
                // (idx == 0) ? this.upSsbdView(): this.addSsbditms();
            } else {
                cc.dlog('GOLD_MATCH_RANK_LIST ??????');
            }
        });
    }
    // upSsbdView() {
    //     cc.dlog('upSsbdView');
    //
    //     let r = this.ctt['ssbd'];
    //     r.active = true;
    //
    //     r.Label_renshu.string = `????????????${r.ud.totalPeopleCount}???`;
    //
    //     //
    //     // r.items = [];
    //     // r.selfitem = null;
    //     //
    //     // let ctt = r.sv_list.content;
    //     // ctt.destroyAllChildren();
    //     //
    //     // this.addSsbditms();
    // }
    // addSsbditms() {
    //     cc.dlog('addSsbditms');
    //
    //     let r = this.ctt['ssbd'];
    //
    //     //let seeme = r.togSeeMe.isChecked;
    //
    //     let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
    //     let items = r.items;
    //     let bidx = items.length;
    //
    //     let ctt = r.sv_list.content;
    //     for (let i = bidx; i < bidx+10; ++i) {
    //         if (!list[i]) {
    //             break;
    //         }
    //
    //         let d = list[i];
    //
    //         let itm = cc.instantiate(this.ItemSsbd);
    //         itm['idx'] = i+1;
    //         itm['ud'] = d;
    //
    //         // ??????
    //         itm['rank'] = cc.find('rank', itm).getComponent(cc.Label)
    //         // ??????123
    //         itm['rankspr'] = cc.find('rankspr', itm).getComponent(cc.Sprite)
    //
    //         if (d.rank > 3) {
    //             itm['rank'].string = d.rank;
    //             itm['rankspr'].node.active = false;
    //         } else {
    //             let a = TeaClass.instance.teaAtlas1;
    //             itm['rankspr'].spriteFrame = a.getSpriteFrame('tea1_pm'+d.rank);
    //             itm['rank'].node.active = false;
    //         }
    //
    //         // @ts-ignore ??????
    //         cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', itm), d.icon);
    //
    //         // ??????
    //         cc.find('name', itm).getComponent(cc.Label).string = d.name;
    //         // @ts-ignore ID
    //         itm['id'] = cc.find('ID', itm).getComponent(cc.Label);
    //         // @ts-ignore
    //         itm['id'].string = ''+i64v(d.userId);
    //
    //         // ??????
    //         cc.find('js', itm).getComponent(cc.Label).string = d.matchCount;
    //         // ??????????????????
    //         itm['syjb'] = cc.find('syjb', itm).getComponent(cc.Label);
    //         // @ts-ignore
    //         itm['syjb'].string = cc.g.utils.realNum1(d.gold);
    //
    //         // --
    //         cc.find('cz', itm).active = !d.power;
    //
    //         // ?????? ????????????
    //         let cp = cc.find('caipan', itm);
    //         let tichu = cc.find('tichu', itm);
    //
    //         if (!d.power) {
    //             cp.active = tichu.active = false;
    //         } else {
    //             // @ts-ignore ????????????
    //             cc.g.utils.addClickEvent(cp, this.node, 'tea_gold_bmsp', 'onBtnSsbdCaipan', {caipan:true, itm:itm});
    //
    //             if (d.position!=71) {
    //                 // @ts-ignore
    //                 cc.g.utils.addClickEvent(tichu, this.node, 'tea_gold_bmsp', 'onBtnSsbdCaipan', {caipan:false, itm:itm});
    //             } else {
    //                 tichu.active = false;
    //             }
    //         }
    //
    //         // @ts-ignore
    //         if (eq64(d.userId, cc.g.userMgr.userId)) {
    //             r.selfitem = itm;
    //         }
    //
    //         ctt.addChild(itm);
    //
    //         // @ts-ignore
    //         //if (seeme && !d.power) {
    //         //    itm.active = false;
    //         //}
    //
    //         items.push(itm);
    //     }
    //
    //     //
    //     r.Label_renshu.string = `????????????${r.ud.totalPeopleCount}???`;
    //
    //     this.onSsbdUptj();
    // }
    onBtnSsbdCaipan(evt, arg) {
        cc.dlog('onBtnSsbdCaipan', arg.caipan, arg.itm.rank);

        // @ts-ignore
        cc.g.utils.btnShake();

        // let idx = arg.itm.idx;

        let r = this.ctt['ssbd'];

        // let list = r.ud.list;
        // let items = r.items;

        if (!arg.caipan) {

            {/*
                //?????????????????????
                //@api:2290,@type:req
                message KickGoldMatchReq{
                    int32 teaHouseId=1;//??????Id
                    int64 memberId=2;//??????Id
                }
            */}
            // @ts-ignore
            cc.g.global.showTipBox('????????????????????????', ()=>{

                // @ts-ignore
                let req = pbHelper.newReq(PB.PROTO.KICK_GOLD_MATCH);
                req.teaHouseId = tea.teaHouseId;
                req.memberId = arg.itm.userId;

                // @ts-ignore
                cc.g.networkMgr.send(PB.PROTO.KICK_GOLD_MATCH, req, (resp) => {
                    // @ts-ignore
                    if (!resp.err || resp.err==PB.ERROR.OK) {
                        //cc.dlog('KICK_GOLD_MATCH ??????');
                        this.upssbd(0)
                    } else {
                        cc.dlog('KICK_GOLD_MATCH ??????2');
                    }
                });

                // list.splice(idx-1, 1);
                // items.splice(idx-1, 1);
                // for (let i = 0; i < items.length; i++) {
                //     items[i]['idx'] = i+1;
                //     items[i]['rank'].string = ''+(i+1);
                // }

                // r.ud.totalPeopleCount = r.ud.totalPeopleCount <= 0 ? 0 : --r.ud.totalPeopleCount;
                // r.Label_renshu.string = `????????????${r.ud.totalPeopleCount}???`;
                //
                // arg.itm.destroy();
            });

            return;
        }

        r.dlgCaipan.active = true;
        r.eboxbc1.string = r.eboxbc2.string = '';
        r.curItem = arg.itm;
    }
    onSsbdTogSeeMe() {
        cc.dlog('onSsbdTogSeeMe');
        //
        // this.upssbd(null, null);
        // return;
        //
        let r = this.ctt['ssbd'];
        // let seeme = r.togSeeMe.isChecked;

        this.checkedSeeMeThree = r.togSeeMe.isChecked;
        // cc.log('seeme--->' + this.checkedSeeMeThree)
        this.upssbd(0)
        //
        // let id = this.EditBox_search.string;
        //
        // r.items.forEach(e => {
        //     e.active = false;
        //
        //     // ????????? ????????????ID??????
        //     if (id=='' || (e['id'].string == id)) {
        //         // @ts-ignore ????????????????????? ????????????????????????
        //         if (!seeme || e.ud.power) {
        //             e.active = true;
        //         }
        //     }
        // });
        //
        // this.onSsbdUptj();
    }
    onSsbdUptj(totalPeopleCount, totalMatchCount, totalGold) {
        let r = this.ctt['ssbd'];
        let items = this.listThreeArr;

        let rs = totalPeopleCount
        let js = totalMatchCount;
        let jf = totalGold;
        // items.forEach(e => {
        //     // if (!e.active) return;
        //     ++rs;
        //     js += e.matchCount;
        //     // @ts-ignore
        //     jf += cc.g.utils.realNum1(e.gold);
        // });

        r.Label_tjrs.string = `${rs}???`;
        r.Label_tjjs.string = js;
        // @ts-ignore
        r.Label_tjjf.string = cc.g.utils.realNum1(i64v(jf));//parseFloat(jf.toFixed(2));
    }
    ssbd_scroll_to_bottom(scrollView) {
        // ?????????????????? ScrollView ??????
        // do whatever you want with scrollview

        // let r = this.ctt['ssbd'];
        //
        // if (r.ud.isSearch) return;

        let bidx = this.listThreeArr.length;//;r.items.length;

        this.upssbd(bidx);
    }
    onBtnCloseCpgn() {
        this.ctt['ssbd'].dlgCaipan.active = false;
    }
    onBtnSsbdBuchang(evt, arg) {
        cc.dlog('onBtnSsbdBuchang', arg);
        
        let add = arg=='1';

        {/*
            //???????????????
            //@api:2291,@type:req
            message CompensateGoldMatchReq{
                int32 teaHouseId=1;//??????Id
                int64 memberId=2;//??????Id
                bool  add=3;//true ?????? false ??????
                int32 gold=4;//??????
            }
            //@api:2291,@type:resp
            message CompensateGoldMatchResp{
                int32 teaHouseId=1;//??????Id
                int64 memberId=2;//??????Id
                int32 gold=3;//???????????????
            }
        */}

        let r = this.ctt['ssbd'];

        let gold = (add ? r.eboxbc1.string : r.eboxbc2.string);
        if (gold == '' || gold == '0') {
            return;
        }

        // @ts-ignore
        gold = cc.g.utils.strToNumber(gold);
        if (gold == '') {
            add ? r.eboxbc1.string='' : r.eboxbc2.string='';
            return;
        }

        let str = add ? `??????????????????${gold}??????!`:`??????????????????${gold}??????!`;
        
        // @ts-ignore
        cc.g.global.showTipBox(str, ()=>{
            // @ts-ignore
            let req = pbHelper.newReq(PB.PROTO.COMPENSATE_GOLD_MATCH);
            req.teaHouseId = tea.teaHouseId;
            req.memberId = r.curItem.userId;
            req.add = add;
            // @ts-ignore
            req.gold = cc.g.utils.fixNum1(gold);

            // @ts-ignore
            cc.g.networkMgr.send(PB.PROTO.COMPENSATE_GOLD_MATCH, req, (resp) => {
                // @ts-ignore
                if (!resp.err || resp.err==PB.ERROR.OK) {
                    // @ts-ignore cc.dlog('COMPENSATE_GOLD_MATCH ??????');
                    this.upssbd(0)
                    r.curItem.gold = resp.gold;
                    // @ts-ignore 
                    r.curItem['syjb'].string = cc.g.utils.realNum1(resp.gold);
                    // @ts-ignore
                    cc.g.global.hint(add ? '????????????':'????????????');
                } else {
                    cc.dlog('COMPENSATE_GOLD_MATCH ??????2');
                }
            });

            r.dlgCaipan.active = false;
        });
    }
    
    // ------------????????????---------------------------------------------------------------------------------------

    // ------------????????????---------------------------------------------------------------------------------------
    upzdxy(reqIndex) {
        // cc.dlog('zdxy idx', idx);

        // @ts-ignore
        if (cc.g.utils.judgeObjectEmpty(reqIndex)) {
            reqIndex = 0
        }

        // idx = idx || 0;
        // id  = id || '';
        //
        // let r = this.ctt['zdxy'];
        // let ud = r.ud;
        //
        // if (idx==0) {
        //     r.closed.active = r.opened.active = false;
        //
        //     ud.list = [];
        //     ud.searchList = [];
        //     r.items = [];
        // }
        //
        // ud.isSearch = (id!='');

        {/*
            //?????????????????????
            //@api:2295,@type:req
            message  GoldMatchTeamListReq{
                int32    teaHouseId=1;//??????Id
                string   searchId=2;//??????Id????????????
                int32    index=3;//??????    
                int32    pageSize=4;//?????????????????? 
            }
            //@api:2295,@type:resp
            message  GoldMatchTeamListResp{
                int32    teaHouseId=1;//??????Id
                int32    index=2;//??????    
                int32    pageSize=3;//?????????????????? 
                int32    totalCount=4;//?????????
                bool     creditOpen=5;//???????????????????????????(true ???,false ???)
                repeated GoldMatchTeamInfo list=6;//??????????????????
            }
            //????????????
            message GoldMatchTeamInfo{
                int32   teamId=1;//??????Id
                int64   userId=2;//??????Id
                int32   position=3;//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                string  name=4;//??????
                string  icon=5;//??????
                int32   credit=6;//?????????
                bool    power=7;//??????????????????
                int64   cordon=8;//?????????
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_TEAM_LIST);
        req.teaHouseId = tea.teaHouseId;
        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(this.searchId)) {
            req.searchId = this.searchId
        }
        req.index = reqIndex
        req.pageSize = PGNUM;

        if (reqIndex == 0) {
            // @ts-ignore
            cc.g.global.showWaiting('');
            let r = this.ctt['zdxy'];
            r.active = true //r._1act;
        }

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_TEAM_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_TEAM_LIST ??????');
                // @ts-ignore

                // this.pageFourNum = resp.index;
                // ud.pageSize = resp.pageSize;
                // ud.totalCount = resp.totalCount;
                // ud.creditOpen = resp.creditOpen;

                // cc.dlog('resp-->' + JSON.stringify(resp))

                let items = resp.list
                // let isRemoveAll = true;
                if (reqIndex == 0) {
                    // @ts-ignore
                    cc.g.global.destoryWaiting();
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
                        // this.listOneView.scrollToLitte()
                    }
                }

                // cc.dlog(`ud.list.length ${ud.list.length}   resp.index ${resp.index}`);
                //
                // resp.list.forEach(e => {
                //     let d = {
                //         teamId:e.teamId,//??????Id
                //         userId:e.userId,//??????Id
                //         position:e.position,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:e.name,//??????
                //         icon:e.icon,//??????
                //         credit:e.credit,//
                //         power:e.power,//??????
                //         cordon:e.cordon,//
                //     }
                //
                //     if (ud.isSearch) {
                //         ud.searchList.push(d);
                //     } else {
                //         ud.list.push(d);
                //     }
                // });
                //
                // if (false && ud.list.length < 1) {
                //     ud.list.push({
                //         teamId:1,//??????
                //         userId:1,//??????Id
                //         position:1,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                //         name:'??????',//??????
                //         icon:'1',//??????
                //         gold:1000,//??????
                //         credit:10000,//
                //         power:true,//????????????
                //     });
                //
                //     for (let i = 0; i < 20; ++i) {
                //         // @ts-ignore
                //         let d = cc.g.clone(ud.list[0]);
                //         d.teamId = 2+i;
                //         d.userId = 1000+i;
                //         d.power = (i%2 == 1);
                //         ud.list.push(d);
                //     }
                // }
                //
                // (idx == 0) ? this.upZdxyView(): this.addZdxyitms();
            } else {
                cc.dlog('GOLD_MATCH_TEAM_LIST ??????');
            }
        });
    }
    // upZdxyView() {
    //     cc.dlog('upZdxyView');
    //
    //     let r = this.ctt['zdxy'];
    //     r.active = r._1act;
    //
    //     if (!r.ud.creditOpen) {
    //         this.togZdxy.active = (tea.position==71);
    //
    //         r.closed.active = true;
    //         r.togclose.uncheck();
    //     } else {
    //         this.togZdxy.active = (tea.position!=1);
    //
    //         r.opened.active = true;
    //         r.togopen.check();
    //     }
    //
    //     //if (tea.position!=71) {
    //         r.togclose.node.active = r.togopen.node.active = false;
    //     //}
    //
    //     if (!r._1act) {
    //         r._1act = true;
    //         return;
    //     }
    //
    //     r.items = [];
    //     r.selfItm = null;
    //
    //     let ctt = r.sv_list.content;
    //     ctt.destroyAllChildren();
    //
    //     this.addZdxyitms();
    // }
    // addZdxyitms() {
    //     cc.dlog('addZdxyitms');
    //
    //     let r = this.ctt['zdxy'];
    //
    //     let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
    //     let items = r.items;
    //     let bidx = items.length;
    //
    //     let ctt = r.sv_list.content;
    //     for (let i = bidx; i < bidx+50; ++i) {
    //         if (!list[i]) {
    //             break;
    //         }
    //
    //         /*
    //             int32   teamId=1;//??????Id
    //             int64   userId=2;//??????Id
    //             int32   position=3;//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
    //             string  name=4;//??????
    //             string  icon=5;//??????
    //             int32   credit=6;//?????????
    //             bool    power=7;//??????????????????
    //         */
    //
    //         let d = list[i];
    //
    //         let itm = cc.instantiate(this.Itemzdxy);
    //         itm['idx'] = i+1;
    //         itm['ud'] = d;
    //
    //         // ??????
    //         cc.find('index', itm).getComponent(cc.Label).string = itm['idx'];
    //
    //         // @ts-ignore ??????
    //         cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', itm), d.icon);
    //
    //         // ??????
    //         cc.find('name', itm).getComponent(cc.Label).string = d.name;
    //         itm['id'] = cc.find('id', itm).getComponent(cc.Label);
    //         // @ts-ignore ID
    //         itm['id'].string = ''+i64v(d.userId);
    //
    //         // ?????????
    //         itm['xinyu'] = cc.find('xinyu', itm).getComponent(cc.Label);
    //         // @ts-ignore
    //         itm['xinyu'].string = cc.g.utils.realNum1(d.credit);
    //
    //         // ????????? ?????? ????????????
    //         let jjx = cc.find('Node_btns/jjx', itm);
    //         let xinyu = cc.find('Node_btns/xinyu', itm);
    //         let jilu = cc.find('Node_btns/jilu', itm);
    //
    //         // ?????? ??????==>>??????
    //         jjx.active = false;
    //         // @ts-ignore
    //         if (XUQIU_OC.jjx && (tea.position==71 || tea.position==61) && d.position==41) {
    //             jjx.active = true;
    //             // @ts-ignore ????????????
    //             cc.g.utils.addClickEvent(jjx, this.node, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {jjx:true, itm:itm});
    //         }
    //
    //
    //         if (!d.power) {
    //             xinyu.active = false;
    //         } else {
    //             // @ts-ignore ????????????
    //             cc.g.utils.addClickEvent(xinyu, this.node, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {xinyu:true, itm:itm});
    //         }
    //
    //         // @ts-ignore
    //         cc.g.utils.addClickEvent(jilu, this.node, 'tea_gold_bmsp', 'onBtnZdxyXinyujilu', {xinyu:false, itm:itm});
    //
    //         ctt.addChild(itm);
    //
    //         items.push(itm);
    //
    //         // @ts-ignore
    //         if (eq64(d.userId, cc.g.userMgr.userId)) {
    //             r.selfItm = itm;
    //         }
    //     }
    // }
    zdxy_scroll_to_bottom(scrollView) {
        // ?????????????????? ScrollView ??????
        // do whatever you want with scrollview

        // let r = this.ctt['zdxy'];
        //
        // if (r.ud.isSearch) return;

        //let bidx = r.items.length;
        let bidx = this.listFourArr.length;
        
        this.upzdxy(bidx);//
    }
    onZdxySearch() {
        cc.dlog('onZdxySearch');

        // let r = this.ctt['zdxy'];

        let id = this.EditBox_search.string;

        this.searchId = id;

        this.upssbd(0)

        // r.items.forEach(e => {
        //     e.active = false;
        //
        //     // ????????? ????????????ID??????
        //     if (id=='' || (e['id'].string == id)) {
        //         e.active = true;
        //     }
        // });
        //
        // this.onSsbdUptj();
    }
    // ???????????? ????????????
    onBtnZdxyXinyujilu(evt, arg) {
        if (!arg.fanbi) {
            cc.dlog('arg--->' + JSON.stringify(arg))
        }
        // cc.dlog('onBtnZdxyXinyujilu', arg.xinyu, arg.itm.idx, arg.itm.ud);

        // @ts-ignore
        cc.g.utils.btnShake();

        if (arg.jjx) {
            this.zdxyUpjjx(arg.itm);
        } else if (arg.fanbi) {
            this.zdxySetFanbi(arg.itm);
        } else if (arg.xinyu) {
            this.zdxyUpTzyx(arg.itm);
        } else {
            this.zdxyUpCkjl(arg.itm, null);
        }
    }
    //????????????
    onZdxyTogKaiguan(evt, arg) {
        cc.dlog('onZdxyTogKaiguan', arg);

        let r = this.ctt['zdxy'];
        let creditOpen = false;

        if (arg=='closed') {
            // ???????????????????????????
            if (!evt.isChecked) {
                return;
            }

            r.closed.active = false;
            r.opened.active = true;
            r.togopen.check();

            creditOpen = true;
        } else {
            // ???????????????????????????
            if (evt.isChecked) {
                return;
            }

            r.opened.active = false;
            r.closed.active = true;
            r.togclose.uncheck();
        }

        {/*
            //?????????????????????????????????
            //@api:2301,@type:req
            message  ModifyCreditOpenReq{
                int32  teaHouseId=1;//??????Id
                bool   creditOpen=2;//???????????????????????????(true ???,false ???)
            }
        */}


        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.MODIFY_GOLD_MATCH_CREDIT_OPEN);
        req.teaHouseId = tea.teaHouseId;
        req.creditOpen = creditOpen;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.MODIFY_GOLD_MATCH_CREDIT_OPEN, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('MODIFY_GOLD_MATCH_CREDIT_OPEN ??????');
            } else {
                cc.dlog('MODIFY_GOLD_MATCH_CREDIT_OPEN ??????2');
            }
        });
    }
    //?????????
    zdxyUpjjx(item) {
        let r = this.ctt['zdxy'];
        r.dlgJJX.active = true;
        r.dlgJJX.Button_bc.active = true;
        r.tzxy_jjxItm = item;

        if (tea.position == item.position) {
            r.dlgJJX.Button_bc.active = false;
        }

        // let d = item.ud;

        // @ts-ignore ??????
        cc.find('Label_zf', r.dlgJJX).getComponent(cc.Label).string = cc.g.utils.realNum1(item.credit);
        // @ts-ignore
        r.tzxy_ebjjx.string = cc.g.utils.realNum1(item.cordon);
    }
    //????????????
    zdxySetFanbi(item) {
        cc.log('????????????');
        let ud = item['ud'];

        let dlg = cc.instantiate(this.teaFbDialogPre);
        this.node.addChild(dlg);
        let com = dlg.getComponent('tea_fanbichang');
        com.showUiDatas(true, ud);

        com.fanbiOKFun = (val)=>{
            ud.contributeRate = val;
            // @ts-ignore
            item.fanbi.string = cc.g.utils.fixNum1(val) + '%';
        };
    }
    onBtnZdxyjjx(evt, arg) {
        let r = this.ctt['zdxy'];
        let str = r.tzxy_ebjjx.string;
        
        // @ts-ignore
        let num = cc.g.utils.try2Number(str);

        // @ts-ignore
        cc.dlog('onBtnjjx', str, num);

        if (isNaN(num)) {
            r.tzxy_ebjjx.string = '';
            return;
        }

        let itm = r.tzxy_jjxItm;

        {/*
            //???????????????????????????
            //@api:2268,@type:req
            message  TeaHouseTeamSetCordonReq{
                int32   teaHouseId = 1;//??????Id
                int32   teamId =2 ;//??????Id
                int64   cordon =3 ;//?????????
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_TEAM_SET_CORDON);
        req.teaHouseId = tea.teaHouseId;
        req.teamId = itm.teamId;
        // @ts-ignore
        req.cordon = cc.g.utils.fixNum1(num);

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_TEAM_SET_CORDON, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                this.upzdxy(0)
                // @ts-ignore 
                cc.dlog('??????????????????????????? ??????');
                r.tzxy_jjxItm.ud.cordon = req.cordon;
                // @ts-ignore
                cc.g.global.hint('????????????');
            } else {
                cc.dlog('??????????????????????????? ??????');
            }
        });

        this.onBtnZdxyClose(0,0);
    }
    //????????????
    zdxyUpTzyx(item) {
        let r = this.ctt['zdxy'];
        r.dlgTZ.active = true;
        r.tzxy_cruItm = item;

        // let d = item.ud;

        // @ts-ignore ??????
        cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', r.dlgTZ), item.icon);
        // @ts-ignore ??????
        cc.find('name', r.dlgTZ).getComponent(cc.Label).string = item.name;
        // @ts-ignore ID
        cc.find('ID', r.dlgTZ).getComponent(cc.Label).string = ''+i64v(item.userId);
        // @ts-ignore ?????????
        cc.find('Label_xinyu', r.dlgTZ).getComponent(cc.Label).string = cc.g.utils.realNum1(item.credit);
        // @ts-ignore
        cc.find('Label_fanwei', r.dlgTZ).getComponent(cc.Label).string = `????????????????????????: ${item.credit>0 ? -cc.g.utils.realNum1(item.credit) : 0}~99999`;
    }
    onBtnZdxyTzxy(evt, arg) {
        let r = this.ctt['zdxy'];
        let str = r.tzxy_ebxinyu.string;
        
        // @ts-ignore
        let num = cc.g.utils.try2Number(str);

        // @ts-ignore
        cc.dlog('onBtnZdxyTzxy', str, num);

        if (isNaN(num)) {
            r.tzxy_ebxinyu.string = '';
            return;
        }

        let itm = r.tzxy_cruItm;

        {/*
            //????????????????????????
            //@api:2292,@type:req
            message AdjustCreditGoldMatchReq{
                int32 teaHouseId=1;//??????Id
                int32 teamId=2;//??????Id
                int32 credit=3;//?????????
            }
            //@api:2292,@type:resp
            message AdjustCreditGoldMatchResp{
                int32 teaHouseId=1;//??????Id
                int32 teamId=2;//??????Id
                int32 credit=3;//???????????????
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.ADJUST_CREDIT_GOLD_MATCH);
        req.teaHouseId = tea.teaHouseId;
        req.teamId = itm.teamId;
        // @ts-ignore
        req.credit = cc.g.utils.fixNum1(num);

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.ADJUST_CREDIT_GOLD_MATCH, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                // @ts-ignore cc.dlog('ADJUST_CREDIT_GOLD_MATCH ??????');
                this.upzdxy(0)
                // @ts-ignore
                let add = resp.credit - itm.credit;

                itm.credit = resp.credit;
                // @ts-ignore
                itm.xinyu.string = cc.g.utils.realNum1(itm.credit);

                if (r.selfItm) {
                    // @ts-ignore
                    r.selfItm.credit -= add;
                    // @ts-ignore
                    r.selfItm.xinyu.string = cc.g.utils.realNum1(r.selfItm.credit);
                }
            } else {
                cc.dlog('ADJUST_CREDIT_GOLD_MATCH ??????2');
            }
        });

        this.onBtnZdxyClose(0,0);
    }
    //????????????
    zdxyUpCkjl(item, idx) {
        cc.dlog('zdxyUpCkjl idx', idx);

        let r = this.ctt['zdxy'];

        idx = idx || 0;
        if (idx==0 || !r.jlud.list) {
            r.jlud.list = [];
            r.jlud.items = [];
            r.jlud.pageNum = 0;

            r.dlgJL.active = true;
            r.ckjl_cruItm = item;

            cc.find('Label_xinyu', r.dlgJL).getComponent(cc.Label).string = '';
            cc.find('New ScrollView', r.dlgJL).getComponent(cc.ScrollView).content.destroyAllChildren();
        }

        let upView = ()=>{
            let d = r.jlud;

            // 
            let xy = cc.find('Label_xinyu', r.dlgJL);
            // @ts-ignore
            xy.getComponent(cc.Label).string = `???????????????????????????${cc.g.utils.realNum1(d.credit)}`;

            //
            let list = d.list;
            let items = d.items;
            let bidx = items.length;
            let ctt = cc.find('New ScrollView', r.dlgJL).getComponent(cc.ScrollView).content;
            for (let i = bidx; i < bidx+100; ++i) {
                if (!list[i]) {
                    break;
                }

                let e = list[i];

                let n = new cc.Node;
                n.anchorX = 0;
                n.x = -415;
                let c = n.addComponent(cc.RichText);
                c.fontSize = 22;
                c.lineHeight = 26;

                let s = '';
                // @ts-ignore
                //s += `<color=#DECFC9>${cc.g.utils.getFormatTimeXXX(e.time * 1000, '|Y|:|M|:|D|  |h|:|m| ')}</c> `;
                s += `<color=#DECFC9>${cc.g.utils.getFormatTimeXXX(e.time * 1000, '|M|-|D|  |h|:|m| ')}</c> `;
                //s += '<color=#C8BC8E>?????????:</color>';
                // @ts-ignore
                s += `<color=#DECFC9>${e.name}(${i64v(e.userId)}) ?????????</c> `;
                // @ts-ignore
                s += `<color=#C8BC8E>${e.credit>=0 ? '+' : ''}${cc.g.utils.realNum1(e.credit)}???</color>`;
                // @ts-ignore
                s += `<color=#DECFC9>???${cc.g.utils.realNum1(e.beforeCredit)}</c> `;
                s += '<color=#C8BC8E>?????????</color>';
                // @ts-ignore
                s += `<color=#DECFC9>${cc.g.utils.realNum1(e.afterCredit)}</c>`;
                c.string = s;
                
                ctt.addChild(n);

                items.push(n);
            }
        };

        {/*
            //?????????????????????
            //@api:2296,@type:req
            message  GoldMatchCreditListReq {
                int32    teaHouseId=1;//??????Id
                int32    teamId=2;//??????Id
                int32    pageNum=3;//???????????????
                int32    pageSize=4;//?????????????????? 
            }
            //@api:2296,@type:resp
            message  GoldMatchCreditListResp {
                int32    teaHouseId=1;//??????Id
                int32    teamId=2;//??????Id
                int32    credit=3;//???????????????
                int32    pageNum=4;//???????????????    
                int32    pageSize=5;//?????????????????? 
                int32    totalCount=6;//?????????
                int32    totalPage=7;//?????????
                repeated CreditLogInfo list=8;//??????????????????
            }
            //????????????
            message CreditLogInfo {
                int32   teamId=1;//??????Id
                int64   userId=2;//?????????Id
                int32   position=3;//???????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                string  name=4;///???????????????
                int32   credit=5;//?????????
                int32   beforeCredit=6;//????????????????????????
                int32   afterCredit=7;//????????????????????????
                int32   time=8;//??????(?????????)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_CREDIT_LOG_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.teamId = item.teamId;
        req.pageNum = r.jlud.pageNum ? (r.jlud.pageNum+1) : 1;
        req.pageSize = 100;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_CREDIT_LOG_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_CREDIT_LOG_LIST ??????');
                this.upzdxy(0)
                r.jlud.teamId = resp.teamId;
                r.jlud.credit = resp.credit;
                r.jlud.pageNum = resp.pageNum;
                r.jlud.pageSize = resp.pageSize;
                r.jlud.totalCount = resp.totalCount;
                r.jlud.totalPage = resp.totalPage;

                cc.dlog(`r.jlud.pageNum ${r.jlud.pageNum}  r.jlud.totalPage ${r.jlud.totalPage}`);

                resp.list.forEach(e => {
                    r.jlud.list.push({
                        teamId:e.teamId,//??????Id
                        userId:e.userId,//?????????Id
                        position:e.position,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                        name:e.name,//??????
                        credit:e.credit,//?????????
                        beforeCredit:e.beforeCredit,//????????????????????????
                        afterCredit:e.afterCredit,//????????????????????????
                        time:e.time,//??????
                    });
                });

                if (false && r.jlud.list.length < 1) {
                    r.jlud.list.push({
                        teamId:1,//??????Id
                        userId:1,//?????????Id
                        position:1,//????????????(??????=71,????????????=61,?????????=51,??????=41,??????=31,?????????=21,?????????=11,????????????=1)
                        name:'???????????????',//???????????????
                        credit:1,//?????????
                        beforeCredit:1,//????????????????????????
                        afterCredit:2,//????????????????????????
                        time:Date.now()/1000,//??????
                    });

                    for (let i = 0; i < 20; ++i) {
                        // @ts-ignore
                        let d = cc.g.clone(r.jlud.list[0]);
                        d.userId = 1000+i;
                        d.credit = 100+i;
                        d.beforeCredit = 10+i;
                        d.afterCredit = 10+i+10;   
                        r.jlud.list.push(d);
                    }
                }
                
                upView();
            } else {
                cc.dlog('GOLD_MATCH_CREDIT_LOG_LIST ??????2');
            }
        });
    }
    //????????????
    onBtnZdxyClose(evt, arg) {
        let r = this.ctt['zdxy'];
        r.dlgJJX.active = r.dlgTZ.active = r.dlgJL.active = false;
    }

    // ?????????
    doShowBaoxxDialog() {
        // @ts-ignore 
        cc.log('doShowBaoxxDialog');

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        let dlg = cc.instantiate(tea.teaBxxPre);
        // @ts-ignore
        this.node.addChild(dlg);
    }
    // ------------????????????---------------------------------------------------------------------------------------
    


    _3() {}

    // ------------????????????---------------------------------------------------------------------------------------
    //
    onBtn_yqcs(evt, arg) {
        // @ts-ignore
        cc.log('????????????');

        // @ts-ignore
        let dlg = cc.instantiate(this.YqcsDlg);
        // @ts-ignore
        this.node.addChild(dlg);
    }
    // ------------????????????---------------------------------------------------------------------------------------



    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        delete tea.goldChangCB['bmsp_gc'];
        this.node.destroy();
    }
}

class ListOneAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaGoldBmspItem);
        if (comp) {
            comp.setData(this.getItem(posIndex), posIndex);
        }
    }
}

class ListTwoAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaGoldBscrzItem);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListThreeAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaGoldSsbdItem);
        if (comp) {
            comp.setData(this.getItem(posIndex));
        }
    }
}

class ListFourAdapter extends AbsAdapter {
    updateView(item: cc.Node, posIndex: number) {
        let comp = item.getComponent(TeaGoldZdjfItem);
        if (comp) {
            comp.setData(this.getItem(posIndex), posIndex);
        }
    }
}