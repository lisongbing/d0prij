// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

let PGSIZE = 100;

let tea = null;

@ccclass
export default class Baoxx extends cc.Component {

    @property(cc.Prefab)
    jiluItm: cc.Prefab = null;

    // 密码 保险箱
    dlg_mm:any = null;
    dlg_bxx:any = null;

    // 密码登录
    Node_denglu:any = null;
    EditBox_pw:any = null;

    // 密码登录
    Node_wjmm:any = null;
    EditBox_oldpw:any = null;
    EditBox_newpw:any = null;

    // 密码登录
    Node_get:any = null;
    Node_jilu:any = null;

    // 账户总额
    Label_gold:any = null;
    EditBox_gold:any = null;

    sv_jilu:any = null;
    
    

    isDenglu:any = true;

    gold:any = 0;
    secretKey:any = 0;

    jiludata:any = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        tea = TeaClass.instance;

        this.dlg_mm = cc.find('Node_mm', this.node);
        this.dlg_bxx = cc.find('Node_bxx', this.node);

        this.initDenglu();  // 密码登录
        this.initWjmima();  // 忘记密码
        this.initBaoxx();  // 保险箱

        this.isDenglu = true;
        this.Node_denglu.active = this.isDenglu;
        this.Node_wjmm.active = !this.isDenglu;

        this.dlg_mm.active = true;
        this.dlg_bxx.active = false;
    }

    initDenglu () {
        let r = cc.find('Node_mm/Node_denglu', this.node);

        this.EditBox_pw = cc.find('EditBox_pw', r).getComponent(cc.EditBox);

        this.Node_denglu = r;
    }
    initWjmima () {
        let r = cc.find('Node_mm/Node_wjmm', this.node);

        this.EditBox_oldpw = cc.find('EditBox_oldpw', r).getComponent(cc.EditBox);
        this.EditBox_newpw = cc.find('EditBox_newpw', r).getComponent(cc.EditBox);

        this.Node_wjmm = r;
    }
    initBaoxx () {
        let r = cc.find('Node_bxx', this.node);

        this.Node_get = cc.find('Node_get', r);
        this.Node_jilu = cc.find('Node_jilu', r);

        this.Label_gold = cc.find('Label_gold', this.Node_get).getComponent(cc.Label);
        this.EditBox_gold = cc.find('EditBox_gold', this.Node_get).getComponent(cc.EditBox);

        // @ts-ignore
        this.sv_jilu = cc.find('ScrollView_list', this.Node_jilu).getComponent(cc.ScrollView);
        this.sv_jilu.node.on('scroll-to-bottom', this.scroll_to_bottom, this);

        this.onBtnGet(0, '1');
    }

    start () {

    }

    // 忘记密码
    onBtnWangjimm(evt, data) {
        cc.dlog('onBtnWangjimm');

        this.isDenglu = false;
        this.Node_denglu.active = this.isDenglu;
        this.Node_wjmm.active = !this.isDenglu;
    }

    // OK
    onBtnOK(evt, data) {
        cc.dlog('onBtnOK this.isDenglu ', this.isDenglu);

        // @ts-ignore
        cc.g.utils.btnShake();

        if (this.isDenglu) {
            this.login();
            return;
        }

        this.resetPW();
    }
    //
    login() {
        cc.dlog('login');

        let pw = this.EditBox_pw.string;
        cc.log('pw', pw);
        if (!pw || pw=='') {
            return;
        }

        {/*
            //茶馆保险箱登陆
            //@api:2339,@type:req
            message StrongboxLoginReq{
                int32    teaHouseId=1;//茶馆Id
                string   pwd=2;//密码
            }
            //@api:2339,@type:resp
            message  StrongboxLoginResp{
                int32    teaHouseId=1;//茶馆Id
                int64    gold=2;//金币(单位:分)
                string   secretKey=3;//秘钥

            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.STRONGBOX_LOGIN);
        req.teaHouseId = tea.teaHouseId;
        req.pwd = pw;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.STRONGBOX_LOGIN, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore cc.dlog('创建俱乐部包间 成功');
                this.gold = resp.gold;
                this.secretKey = resp.secretKey;

                this.upBxxview();
            } else {
                //cc.dlog('创建俱乐部包间 失败');
            }
        });
    }
    //茶馆保险箱密码设置
    resetPW() {
        cc.dlog('resetPW');

        let oldpw = this.EditBox_oldpw.string;
        let newpw = this.EditBox_newpw.string;
        cc.log('oldpw newpw', oldpw, newpw);
        if (!oldpw || oldpw=='' || !newpw || newpw=='') {
            return;
        }

        if (oldpw == newpw) {
            // @ts-ignore
            cc.g.global.hint('新旧密码不能相同');
            return;
        }

        {/*
            //茶馆保险箱密码设置
            //@api:2338,@type:req
            message StrongboxPwdSetReq{
                int32    teaHouseId=1;//茶馆Id
                string   oldPwd=2;//旧密码
                string   pwd=3;//密码
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.STRONGBOX_PWD_SET);
        req.teaHouseId = tea.teaHouseId;
        req.oldPwd = oldpw;
        req.pwd = newpw;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.STRONGBOX_PWD_SET, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore cc.dlog('创建俱乐部包间 成功');
                cc.g.global.hint('设置成功');

                this.isDenglu = true;
                this.Node_denglu.active = this.isDenglu;
                this.Node_wjmm.active = !this.isDenglu;
            } else {
                //cc.dlog('创建俱乐部包间 失败');
            }
        });
    }


    upBxxview() {
        cc.dlog('upBxxview');

        this.dlg_mm.active = false;
        this.dlg_bxx.active = true;

        // @ts-ignore
        this.Label_gold.string = cc.g.utils.realNum1(this.gold);
        this.EditBox_gold.string = 0;
    }
    // 
    onBtnGetGold(evt, tp) {
        cc.dlog('onBtnGetGold');

        if (tp=='1') {
            // @ts-ignore
            this.EditBox_gold.string = cc.g.utils.realNum1(this.gold);
            return;
        }

        // @ts-ignore
        let cd = Date.now() - (cc.g._ggcd_ || 0);
        cc.log('cd', cd);
        if (cd < 3*1000) {
            // @ts-ignore
            cc.g.global.hint('操作太快 请稍后再试');
            return;
        }

        {/*
            //茶馆保险箱提取收益
            //@api:2341,@type:req
            message StrongboxWithdrawReq{
                int32    teaHouseId=1;//茶馆Id
                int64    outGold=2;//收益(单位:分)
                string   secretKey=3;//秘钥
            }
            //@api:2341,@type:resp
            message  StrongboxWithdrawResp{
                int32    teaHouseId=1;//茶馆Id
                int64    outGold=2;//本次提取收益(单位:分)
                int64    gold=3;//剩余收益(单位:分)
            }
        */}

        let g = parseFloat(this.EditBox_gold.string);

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.STRONGBOX_WITHDRAW);
        req.teaHouseId = tea.teaHouseId;
        // @ts-ignore
        req.outGold = cc.g.utils.fixNum1(g);
        req.secretKey = this.secretKey;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.STRONGBOX_WITHDRAW, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore cc.dlog('茶馆保险箱提取收益 成功');

                cc.g._ggcd_ = Date.now();

                // @ts-ignore
                cc.g.global.hint('设置成功');

                this.gold = resp.gold;

                this.upBxxview();
            } else {
                //cc.dlog('茶馆保险箱提取收益 失败');
            }
        });
    }

    // 
    onBtnGet(evt, tp) {
        cc.dlog('onBtnGet');

        if (tp=='1') {
            this.Node_get.active = true;
            this.Node_jilu.active = false;

            return;
        }

        this.Node_get.active = false;
        this.Node_jilu.active = true;

        this.upJilu(1);
    }


    upJilu(page) {
        {/*
            //茶馆保险箱收益记录列表
            //@api:2342,@type:req
            message StrongboxIncomeListReq{
                int32    teaHouseId=1;//茶馆Id
                int32    searchType=2;//0-全部,1-收入 2-支出
                int32    pageNum=3;//当前页码数
                int32    pageSize=4;//每页显示条数
            }
            //@api:2342,@type:resp
            message  StrongboxIncomeListResp{
                int32    teaHouseId=1;//茶馆Id
                int32    searchType=2;//0-全部,1-收入 2-支出
                int32    pageNum=3;//当前页码数    
                int32    pageSize=4;//每页显示条数 
                int32    totalCount=5;//总条数
                int32    totalPage=6;//总页数
                int64    totalIncome=7;//总收益
                repeated StrongboxIncomeLogInfo list=8;//收益记录列表
            }
             //保险箱收益记录
            message StrongboxIncomeLogInfo{
                int64   gold=1;//收益
                int64   beforeGold=2;//变化之前的收益
                int64   afterGold=3;//变化之后的收益
                int32   time=4;//时间(时间戳)
                int32   eventType=5;//事件类型1-抽奖增加 2-提取
            }
        */}

        page = page || 1;
        
        if (page==1) {
            let o = {
                list:[],
                items:[],
            };

            this.jiludata = o;
        }

        let ud = this.jiludata;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.STRONGBOX_INCOME_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.searchType = 0;
        req.pageNum = 0;
        req.pageSize = PGSIZE;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.STRONGBOX_INCOME_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore cc.dlog('茶馆保险箱提取收益 成功');
                ud.searchType = resp.searchType;
                ud.pageNum = resp.pageNum;
                ud.pageSize = resp.pageSize;
                ud.totalCount = resp.totalCount;
                ud.totalPage = resp.totalPage;
                ud.totalIncome = resp.totalIncome;

                resp.list.forEach(e => {
                    let d = {
                        gold:e.gold,//
                        beforeGold:e.beforeGold,//
                        afterGold:e.afterGold,//
                        time:e.time,//
                        eventType:e.eventType,//
                    }
                    ud.list.push(d);
                });

                // @ts-ignore
                cc.find('lab_all', this.Node_jilu).getComponent(cc.Label).string = '收益：'+cc.g.utils.realNum1(ud.totalIncome);

                (page == 1) ? this.upJiluView(): this.addJilu();
            } else {
                //cc.dlog('茶馆保险箱提取收益 失败');
            }
        });
    }
    upJiluView () {
        cc.dlog('upJiluView');

        let ud = this.jiludata;

        ud.items = [];

        let ctt = this.sv_jilu.content;
        ctt.destroyAllChildren();

        this.addJilu();
    }
    addJilu () {
        cc.dlog('addJilu');

        let ud = this.jiludata;

        let list = ud.list;
        let items = ud.items;
        let bidx = items.length;

        let ctt = this.sv_jilu.content;
        for (let i = bidx; i < bidx+PGSIZE; ++i) {
            if (!list[i]) {
                break;
            }

            let d = list[i];

            // @ts-ignore
            let itm = cc.instantiate(this.jiluItm);
            itm['idx'] = i+1;
            itm['ud'] = d;

            // @ts-ignore 2021.10.13  13:44  抽奖增加: +1000
            let str = cc.g.utils.getFormatTimeXXX(d.time*1000, 'Y|.|M|.|D|  |h|:|m|:|s|  ');
            // @ts-ignore
            str += (d.eventType==1 ? '抽奖增加: ' : '保险箱提取 ')//事件类型1-抽奖增加 2-提取
            if (d.gold>0) {
                // @ts-ignore
                str += '+' + cc.g.utils.realNum1(d.gold);
            } else {
                // @ts-ignore
                str += cc.g.utils.realNum1(d.gold);
            }

            cc.find('lab', itm).getComponent(cc.Label).string = str;
            
            ctt.addChild(itm);

            items.push(itm);
        }
    }
    scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview

        let ud = this.jiludata;

        // @ts-ignore
        cc.log('scroll_to_bottom', ud)

        if (ud.pageNum >= ud.totalPage) {
            return;
        }

        this.upJilu(ud.pageNum+1);
    }

    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        this.node.destroy();
    }
}
