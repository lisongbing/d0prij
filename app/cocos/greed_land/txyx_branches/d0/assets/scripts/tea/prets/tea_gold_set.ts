// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    EditBox_bmfei:cc.EditBox = null;//报名费

    r2:Object = {};//2档倍率
    r3:Object = {};//3档倍率

    sv_rate:cc.Node = null;//倍率下拉菜单
    rateItems:Object = {};//倍率下拉选项

    tog_shenhe:cc.Toggle = null;//审核
    tog_shenno:cc.Toggle = null;//

    Button_zanting:cc.Node = null;//暂停赛场
    Button_huifu:cc.Node = null;//恢复赛场
    Button_baocun:cc.Node = null;//


    ClickSwallow:cc.Node = null;

    curRate:string = '';//当前正在选址的倍率档位

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let r = this.node;
        
        // 报名费
        this.EditBox_bmfei = cc.find('Vlist_ctt/Node_bmf/EditBox_bmfei', r).getComponent(cc.EditBox);

        // 2档倍率
        let r2r = cc.find('Vlist_ctt/Node_rate2', r);
        this.r2['r'] = r2r;
        this.r2['tog'] = cc.find('Toggle', r2r).getComponent(cc.Toggle);
        this.r2['labrate'] = cc.find('com_bar4/New Label', r2r).getComponent(cc.Label);
        this.r2['labcost'] = cc.find('Label_cost', r2r).getComponent(cc.Label);
        // 3档倍率
        let r3r = cc.find('Vlist_ctt/Node_rate3', r);
        this.r3['r'] = r3r;
        this.r3['tog'] = cc.find('Toggle', r3r).getComponent(cc.Toggle);
        this.r3['labrate'] = cc.find('com_bar4/New Label', r3r).getComponent(cc.Label);
        this.r3['labcost'] = cc.find('Label_cost', r3r).getComponent(cc.Label);


        // 倍率下拉菜单
        this.sv_rate = cc.find('ScrollView_rate', r);
        let ctt = cc.find('view/content', this.sv_rate);
        for (let i = 2; i <= 10; ++i) {
            this.rateItems[i] = cc.find('r'+i, ctt);
            cc['g'].utils.addClickEvent(this.rateItems[i], this.node, 'tea_gold_set', 'onBtnRateItem', i);
        }
        
        // 审核
        this.tog_shenhe = cc.find('Vlist_ctt/ToggleContainer_sh/toggle1', r).getComponent(cc.Toggle);
        this.tog_shenno = cc.find('Vlist_ctt/ToggleContainer_sh/toggle2', r).getComponent(cc.Toggle);

        this.Button_zanting = cc.find('Button_zanting', r);
        this.Button_huifu = cc.find('Button_huifu', r);
        this.Button_baocun = cc.find('Button_baocun', r);

        // endCall beganCall
        this.ClickSwallow = cc.find('ClickSwallow', r);
        this.ClickSwallow.getComponent('ClickSwallow').endCall = function(){
            this.sv_rate.active = false;
            this.ClickSwallow.active = false;
        }.bind(this);


        // close btn
        let closeOne = cc.find('Button_close', this.node)
        let closeTwo = cc.find('Button_close_min', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }
    }

    start () {

    }

    // update (dt) {}

    // ---------------------------------------------------------------------------------------------------

    //
    up() {
        cc.dlog('up');
        
        cc.find('Vlist_ctt', this.node).active = false;
        this.sv_rate.active = false;
        this.Button_zanting.active = this.Button_huifu.active = this.Button_baocun.active = false;

        {/*
            //获得金币场设置
            //@api:2283,@type:req
            message GetGoldMatchSettingReq{
                int32    teaHouseId = 1;//茶馆Id
            }
            //@api:2283,@type:resp
            message GetGoldMatchSettingResp{
                int32    teaHouseId = 1;//茶馆Id
                int32    matchFee = 2;//报名费
                bool     feeOpen1 = 3;//是否允许报名费倍率1(true允许,false不允许)
                bool     feeOpen2 = 4;//是否允许报名费倍率2(true允许,false不允许)
                int32    feeRate1 = 5;//报名费倍率1
                int32    feeRate2 = 6;//报名费倍率2
                bool     reviewOpen = 7;//是否开启审核(true审核,false不审核)
                bool     matchPause = 8;//比赛是否暂停(true暂停,false不暂停)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GET_GOLD_MATCH_SETTING);
        req.teaHouseId = TeaClass.instance.teaHouseId;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GET_GOLD_MATCH_SETTING, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog('GET_GOLD_MATCH_SETTING 成功');

                if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                    cc.dlog('GET_GOLD_MATCH_SETTING 失败1');
                    return;
                }

                let d = TeaClass.instance.goldSetData;
                d['matchFee']=resp.matchFee;
                d['feeOpen1']=resp.feeOpen1;
                d['feeOpen2']=resp.feeOpen2;
                d['feeRate1']=resp.feeRate1;
                d['feeRate2']=resp.feeRate2;
                d['reviewOpen']=resp.reviewOpen;
                d['matchPause']=resp.matchPause;

                this.upView();

            } else {
                cc.dlog('GET_GOLD_MATCH_SETTING 失败2');
            }
        });
    }

    upView() {
        cc.dlog('upView');

        cc.find('Vlist_ctt', this.node).active = true;

        let d = TeaClass.instance.goldSetData;

        // @ts-ignore //d['matchFee']>0 ? ''+cc.g.utils.realNum1(d['matchFee']): '';
        this.EditBox_bmfei.string = cc.g.utils.realNum1(d['matchFee']);

        this.r2['tog'].uncheck();
        this.r3['tog'].uncheck();
        d['feeOpen1'] ? this.r2['tog'].check() : this.r2['tog'].uncheck();
        d['feeOpen2'] ? this.r3['tog'].check() : this.r3['tog'].uncheck();

        this.r2['rate'] = ''+d['feeRate1'];
        this.r3['rate'] = ''+d['feeRate2'];
        this.onEditbmf(0,0);

        d['reviewOpen'] ? this.tog_shenhe.check() : this.tog_shenno.check();

        this.sv_rate.active = false;

        this.Button_zanting.active = !d['matchPause'];
        this.Button_huifu.active = d['matchPause'];
        this.Button_baocun.active = true;
    }

    // 编辑报名费
    onEditbmf(evt, data) {
        cc.dlog('onEditbmf');

        let cost = (this.EditBox_bmfei.string == '' ? 0 : parseInt(this.EditBox_bmfei.string));
        if (cost<=0) {
            this.EditBox_bmfei.string == '';
            this.r2['r'].active = this.r3['r'].active = false;
            return;
        }

        this.EditBox_bmfei.string = ''+cost;

        this.r2['r'].active = this.r3['r'].active = true;

        this.r2['labrate'].string = `${this.r2['rate']}倍报名`;
        this.r2['labcost'].string = `报名费${parseInt(this.r2['rate'])*parseInt(this.EditBox_bmfei.string)}积分`;

        this.r3['labrate'].string = `${this.r3['rate']}倍报名`;
        this.r3['labcost'].string = `报名费${parseInt(this.r3['rate'])*parseInt(this.EditBox_bmfei.string)}积分`;
    }

    // 倍率复选
    onTogRate(evt, data) {
        cc.dlog('onTogRate', data);
    }

    // 倍率下拉菜单
    onBtnRate(evt, data) {
        cc.dlog('onBtnRate', data);

        this.curRate = data;//点的哪个下拉

        let r = {2:this.r2, 3:this.r3};
        let rate = 0;
        if (data=='2') {
            rate = parseInt(this.r3['rate']);
        } else if (data=='3') {
            rate = parseInt(this.r2['rate']);
        } else {
            return;
        }

        for (let i = 2; i <= 10; ++i) {
            this.rateItems[i].active = (data=='2' ? i<rate : i>rate);
        }

        this.sv_rate.active = true;
        this.sv_rate.y = (data== '2' ? 32.088 : -42.3);
        this.ClickSwallow.active = true;
    }
    // 倍率选项
    onBtnRateItem(evt, data) {
        cc.dlog('onBtnRateItem', data);

        this.sv_rate.active = false;

        let cr = this.curRate;
        this.curRate = '';

        let r = {2:this.r2, 3:this.r3};
        if(!r[cr]) return;

        r[cr].rate = data;
        r[cr].labrate.string = `${data}倍报名`;
        r[cr].labcost.string = `报名费${parseInt(data)*parseInt(this.EditBox_bmfei.string)}金币`;
    }


    // 审核单选
    onTogShenhe(evt, data) {
        cc.dlog('onTogShenhe', data);
    }

    // 保存
    onBtnSave(evt, data) {
        cc.dlog('onBtnSave');

        // @ts-ignore
        cc.g.utils.btnShake();

        {/*
            //修改金币场设置
            //@api:2284,@type:req
            message ModifyGoldMatchSettingReq{
                int32    teaHouseId = 1;//茶馆Id
                int32    matchFee = 2;//报名费
                bool     feeOpen1 = 3;//是否允许报名费倍率1(true允许,false不允许)
                bool     feeOpen2 = 4;//是否允许报名费倍率2(true允许,false不允许)
                int32    feeRate1 = 5;//报名费倍率1
                int32    feeRate2 = 6;//报名费倍率2
                bool     reviewOpen = 7;//是否开启审核(true审核,false不审核)
            }
            //@api:2284,@type:resp
            message ModifyGoldMatchSettingResp{
                int32    teaHouseId = 1;//茶馆Id
                int32    matchFee = 2;//报名费
                bool     feeOpen1 = 3;//是否允许报名费倍率1(true允许,false不允许)
                bool     feeOpen2 = 4;//是否允许报名费倍率2(true允许,false不允许)
                int32    feeRate1 = 5;//报名费倍率1
                int32    feeRate2 = 6;//报名费倍率2
                bool     reviewOpen = 7;//是否开启审核(true审核,false不审核)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.MODIFY_GOLD_MATCH_SETTING);
        req.teaHouseId = TeaClass.instance.teaHouseId;
        req.matchFee = (this.EditBox_bmfei.string == '' ? 0 : parseInt(this.EditBox_bmfei.string));
        req.feeOpen1 = this.r2['tog'].isChecked;
        req.feeOpen2 = this.r3['tog'].isChecked;
        req.feeRate1 = parseInt(this.r2['rate']);
        req.feeRate2 = parseInt(this.r3['rate']);
        req.reviewOpen = this.tog_shenhe.isChecked;

        // @ts-ignore
        req.matchFee = cc.g.utils.fixNum1(req.matchFee);
        // @ts-ignore
        //req.feeRate1 = cc.g.utils.fixNum1(req.feeRate1);
        // @ts-ignore
        //req.feeRate2 = cc.g.utils.fixNum1(req.feeRate2);

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.MODIFY_GOLD_MATCH_SETTING, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog('MODIFY_GOLD_MATCH_SETTING 成功');
                if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                    cc.dlog('MODIFY_GOLD_MATCH_SETTING 失败1');
                    return;
                }

                let d = TeaClass.instance.goldSetData;
                d['matchFee']=resp.matchFee;
                d['feeOpen1']=resp.feeOpen1;
                d['feeOpen2']=resp.feeOpen2;
                d['feeRate1']=resp.feeRate1;
                d['feeRate2']=resp.feeRate2;
                d['reviewOpen']=resp.reviewOpen;

            } else {
                cc.dlog('MODIFY_GOLD_MATCH_SETTING 失败2');
            }
        });

        this.onBtnClose(0,0);
    }
    // 暂停 恢复
    onBtnZanting(evt, data) {
        cc.dlog('onBtnZanting', data);

        // @ts-ignore
        cc.g.utils.btnShake();

        {/*
            //暂停或者恢复金币场
            //@api:2285,@type:req
            message PauseGoldMatchReq{
                int32    teaHouseId = 1;//茶馆Id
                bool     matchPause = 2;//比赛是否暂停(true 暂停,false 不暂停)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.PAUSE_GOLD_MATCH);
        req.teaHouseId = TeaClass.instance.teaHouseId;
        req.matchPause = data=='1';

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.PAUSE_GOLD_MATCH, req, (resp) => {
            // @ts-ignore
            if (resp.err == PB.ERROR.OK) {
                cc.dlog('PAUSE_GOLD_MATCH 成功');
            } else {
                cc.dlog('PAUSE_GOLD_MATCH 失败');
            }
        });

        this.onBtnClose(0,0);
    }

    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        this.node.destroy();
    }
}
