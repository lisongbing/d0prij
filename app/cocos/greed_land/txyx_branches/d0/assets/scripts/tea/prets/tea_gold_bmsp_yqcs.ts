// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

// @ts-ignore
const {ccclass, property} = cc._decorator;

const PGSIZE = 50;

let tea = null;
let bmf = [];

@ccclass
// @ts-ignore
export default class TeaBmspYqcs extends cc.Component {
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    Item: cc.Prefab = null;

    // @ts-ignore
    EditBox_search:cc.EditBox = null;
    // @ts-ignore
    sv_list:cc.ScrollView = null;
    // @ts-ignore
    sv_popjf:cc.ScrollView = null;

    ctt:Object = {};
    
    data: any = null;

    lastItm: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        tea = TeaClass.instance;

        // @ts-ignore
        let r = this.node;

        // @ts-ignore
        let closeOne = cc.find('Button_close', this.node);
        // @ts-ignore
        let closeTwo = cc.find('Button_close_min', this.node);
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false;
            closeTwo.active = true;
        } else {
            closeOne.active = true;
            closeTwo.active = false;
        }
        
        // @ts-ignore 编辑框
        this.EditBox_search = cc.find('EditBox_search', r).getComponent(cc.EditBox);
        this.EditBox_search.string = '';

        // @ts-ignore
        this.sv_list = cc.find('ScrollView_list', r).getComponent(cc.ScrollView);
        this.sv_list.node.on('scroll-to-bottom', this.scroll_to_bottom, this);
        // @ts-ignore
        this.sv_list.ctt = cc.find('ctt', this.sv_list.content)
        // @ts-ignore
        this.sv_list.ctt.destroyAllChildren();


        // @ts-ignore
        this.sv_popjf = cc.find('jifen/ScrollView_popjf', this.sv_list.content).getComponent(cc.ScrollView);
        //this.sv_popjf = cc.find('jifen/ScrollView_popjf', r).getComponent(cc.ScrollView);
        this.sv_popjf.node.active = false;

        this.initPopJifen();

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        //this.togZdxy.active = (tea.position==51 || tea.position==61 || tea.position==1);

        // @ts-ignore
        this.scheduleOnce(()=>{
            this.up(null, null);
        }, 0.1);
    }

    initPopJifen () {
        bmf = [];

        let d = TeaClass.instance.goldSetData;

        // @ts-ignore
        cc.log('initPopJifen', d);

        // @ts-ignore
        bmf[0] = i64v(d['matchFee']);

        let ra = [1];
        if (d['feeOpen1']) {
            bmf[1] = bmf[0] * d['feeRate1'];
            ra[1] = d['feeRate1'];
        }
        if (d['feeOpen2']) {
            bmf[2] = bmf[0] * d['feeRate2'];
            ra[2] = d['feeRate2'];
        }

        // @ts-ignore
        cc.log('bmf', bmf);

        this.sv_popjf.node.height = 47*bmf.length;

        let r = this.sv_popjf.content;
        for (let i = 0; i < 3; i++) {
            // @ts-ignore
            let itm = cc.find('r'+i, r);
            if (!itm) continue;
            
            if (bmf[i]) {
                // @ts-ignore
                cc.find('lab', itm).getComponent(cc.Label).string = cc.g.utils.realNum1(bmf[i])+'积分';
                // @ts-ignore
                cc.g.utils.addClickEvent(itm, this.node, 'tea_gold_bmsp_yqcs', 'onBtnBmfItem', ra[i]);
            } else {
                itm.active = false;
            }
        }
    }
    // 积分选项
    onBtnBmfItem(evt, rate) {
        // @ts-ignore
        cc.dlog('onBtnBmfItem', rate);

        this.sv_popjf.node.active = false;

        let itm = this.lastItm;
        if (itm) {
            itm['rate'] = rate;
            // @ts-ignore
            itm['lab_bmf'].string = cc.g.utils.realNum1(itm['rate']*bmf[0])+'积分';

            this.lastItm = null;
        }
    }

    start () {

    }

    // 
    onBtnSearch(evt, data) {
        // @ts-ignore
        cc.dlog('onBtnSearch ', this.EditBox_search.string);

        let id = this.EditBox_search.string;

        this.up(1, id);

        this.sv_popjf.node.active = false;
    }

    // update (dt) {}


    // ---------------------------------------------------------------------------------------------------

    //
    up(page, id) {
        // @ts-ignore
        cc.dlog('up');

        {/*
            GOLD_MATCH_INVITE_LIST=2336;//金币场邀请列表
            //金币场邀请列表(分页)
            //@api:2336,@type:req
            message GoldMatchInviteListReq{
                int32    teaHouseId=1;//茶馆Id
                int32    pageNum=2;//当前页码数
                int32    pageSize=3;//每页显示条数
                string   searchId=4;//查询条件Id或者昵称
            }
            //@api:2336,@type:resp
            message  GoldMatchInviteListResp{
                int32    teaHouseId=1;//茶馆Id
                int32    pageNum=2;//当前页码数    
                int32    pageSize=3;//每页显示条数 
                int32    totalCount=4;//总条数
                int32    totalPage=5;//总页数
                repeated GoldMatchInviteMemberInfo list=6;//待邀请成员列表
            }
            //金币场待邀请成员
            message GoldMatchInviteMemberInfo{
                int64   userId=1;//成员Id
                string  name=2;//昵称
                string  icon=3;//头像
            }
        */}

        page = page || 1;
        id  = id || '';
        
        if (page==1) {
            let o = {
                list:[],
                items:[],
            };

            this.data = o;
        }

        let ud = this.data;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_INVITE_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.pageNum = page;
        req.pageSize = PGSIZE;
        req.searchId = id;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_INVITE_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('GOLD_MATCH_TEAM_LIST 成功');
                // @ts-ignore

                ud.pageNum = resp.pageNum;
                ud.pageSize = resp.pageSize;
                ud.totalCount = resp.totalCount;
                ud.totalPage = resp.totalPage;

                // @ts-ignore
                cc.log(`ud.list.length ${ud.list.length}   resp.index ${resp.index}`);

                resp.list.forEach(e => {
                    let d = {
                        userId:e.userId,//成员Id
                        name:e.name,//昵称
                        icon:e.icon,//头像
                    }
                    ud.list.push(d);
                });

                if (false && ud.list.length < 1) {
                    ud.list.push({
                        userId:1,//成员Id
                        name:'昵称',//昵称
                        icon:'1',//头像
                    });

                    for (let i = 0; i < 20; ++i) {
                        // @ts-ignore
                        let d = cc.g.clone(ud.list[0]);
                        d.userId = 1000+i;
                        ud.list.push(d);
                    }
                }

                (page == 0) ? this.upView(): this.addItms();
            } else {
                // @ts-ignore
                cc.log('GOLD_MATCH_TEAM_LIST 失败');
            }
        });


        this.upView();
    }

    upView() {
        // @ts-ignore
        cc.log('upView');

        let ud = this.data;

        ud.items = [];

        // @ts-ignore
        let ctt = this.sv_list.ctt;
        ctt.destroyAllChildren();

        this.addItms();
    }

    addItms() {
        // @ts-ignore
        cc.dlog('addItms');

        let ud = this.data;

        let list = ud.list;
        let items = ud.items;
        let bidx = items.length;

        // @ts-ignore
        let ctt = this.sv_list.ctt;
        for (let i = bidx; i < bidx+PGSIZE; ++i) {
            if (!list[i]) {
                break;
            }

            let d = list[i];

            // @ts-ignore
            let itm = cc.instantiate(this.Item);
            itm['idx'] = i+1;
            itm['ud'] = d;
            

            // @ts-ignore
            let btn_jifen = cc.find('btn_jifen', itm);
            // @ts-ignore
            itm.jfbg = cc.find('jfbg', itm);

            // @ts-ignore
            cc.g.utils.addClickEvent(btn_jifen, this.node, 'tea_gold_bmsp_yqcs', 'onBtnJifen', itm);

            // @ts-ignore 头像
            cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', itm), d.icon);

            // @ts-ignore 报名费
            itm['lab_bmf'] = cc.find('jinbi', itm).getComponent(cc.Label);
            itm['bmf'] = bmf[0];
            itm['rate'] = 1;
            // @ts-ignore
            itm['lab_bmf'].string = cc.g.utils.realNum1(itm['rate']*bmf[0])+'积分';

            // @ts-ignore 名字
            cc.find('name', itm).getComponent(cc.Label).string = d.name;

            // @ts-ignore ID
            itm['id']  = cc.find('id', itm).getComponent(cc.Label);
            // @ts-ignore
            itm['id'].string = ''+i64v(d.userId);

            // @ts-ignore 按钮事件 
            cc.g.utils.addClickEvent(cc.find('yaoqing', itm), this.node, 'tea_gold_bmsp_yqcs', 'onBtnYaoqing', itm);

            ctt.addChild(itm);

            items.push(itm);
        }
    }

    scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview

        let ud = this.data;

        // @ts-ignore
        cc.log('scroll_to_bottom', ud)

        if (ud.pageNum >= ud.totalPage) {
            return;
        }

        this.up(ud.pageNum+1, null);
    }

    // 倍率下拉菜单
    onBtnJifen(evt, itm) {
        // @ts-ignore
        cc.dlog('onBtnJifen');

        if (this.lastItm && itm && this.lastItm._id==itm._id) {
            this.sv_popjf.node.active = false;
            this.lastItm = null;
            return;
        }

        this.lastItm = itm;

        this.sv_popjf.node.active = true;

        // @ts-ignore
        let wp = itm.jfbg.convertToWorldSpaceAR(cc.v2(0, 0));
        // @ts-ignore
        let tpos = this.sv_popjf.node.parent.convertToNodeSpaceAR(wp);
        // @ts-ignore
        this.sv_popjf.node.y = tpos.y-18;
    }

    // 邀请
    onBtnYaoqing(evt, itm) {
        // @ts-ignore
        cc.dlog('onBtnYaoqing');

        {/*
	        GOLD_MATCH_INVITE=2337;//金币场邀请
            //金币场邀请指定成员
            //@api:2337,@type:req
            message GoldMatchInviteReq{
                int32    teaHouseId=1;//茶馆Id
                int64    destUserId=2;//目标成员Id
                int64    gold=3;//金币
                int32    rate=4;//倍率
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GOLD_MATCH_INVITE);
        req.teaHouseId = tea.teaHouseId;
        req.destUserId = itm.ud.userId;
        req.gold = bmf[0];
        req.rate = itm.rate;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GOLD_MATCH_INVITE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('邀请 成功');
                // @ts-ignore
                itm.active = false;
            } else {
                // @ts-ignore
                cc.log('邀请 失败');
            }
        });
    }

    onBtnClose(evt, data) {
        // @ts-ignore
        cc.dlog('onBtnClose');

        // @ts-ignore
        this.node.destroy();
    }
}
