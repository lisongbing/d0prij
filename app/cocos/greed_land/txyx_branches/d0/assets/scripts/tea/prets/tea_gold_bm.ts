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

    @property(cc.SpriteFrame)
    bg1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bg2: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bg3: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    shenhezhong: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    youxizhong: cc.SpriteFrame = null;


    Label_bmsta: cc.Label = null;

    Node_bm: cc.Node = null;// 报名
    Node_yibm: cc.Node = null;// 已经报名

    curid: string = '1';

    bm: Object = {};

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let r = this.node;

        this.Label_bmsta = cc.find('Label_bmsta', r).getComponent(cc.Label);

        this.Node_bm = cc.find('Node_bm', r);
        this.Node_yibm = cc.find('Node_yibm', r);
    }

    start () {

    }

    // update (dt) {}


    // ---------------------------------------------------------------------------------------------------

    // 
    up() {
        cc.dlog('up');

        this.Node_bm.active = this.Node_yibm.active = false;
        
        {/*
            int32    signMatchStatus=15;//金币场报名状态(0未申请  1 已申请 2 已报名)
            int32    mineMatchFee = 16;//自己的金币场报名费
            int32    mineFeeIndex = 17;//自己的金币场报名费索引
            int32    matchTime=18;//金币场时间戳(申请时间或者加入金币场时间)
            int32    matchFee = 19;//金币场当前报名费
            int32    feeRate1 = 20;//金币场当前报名费倍率1
            int32    feeRate2 = 21;//金币场当前报名费倍率2
        */}

        let tea = TeaClass.instance;

        this.bm['teaHouseId'] = tea.teaHouseId;

        let gsd = tea.goldSetData;

        // 没有报名 没有审核
        if (gsd['signMatchStatus']==0) {
            this.Node_yibm.destroy();
            this.Node_bm.active = true;
            this.Label_bmsta.string = '报名动态：'+'暂无动态';

            // @ts-ignore
            let gold = cc.g.utils.realNum1(gsd['matchFee']);
            let rate = [1, gsd['feeOpen1'] ? gsd['feeRate1'] : 0, gsd['feeOpen2'] ? gsd['feeRate2'] : 0];

            // @ts-ignore
            this.bm['gold'] = gold;
            this.bm['rate'] = rate;

            for (let i = 0; i < 3; ++i) {
                let n = cc.find('Node_bmHList/Toggle' + (i+1), this.Node_bm);
                if (rate[i] <= 0) {
                    n.destroy();
                    continue;
                }

                let Label_gold = cc.find('checkmark/Label_gold', n).getComponent(cc.Label);
                let Label_gold2 = cc.find('Background/Label_gold', n).getComponent(cc.Label);
                Label_gold2.string = Label_gold.string = '' + gold*rate[i];
            }
        } else {
            this.Node_bm.destroy();
            this.Node_yibm.active = true;

            let id = 1;

            let o={};
            o['bg'] = cc.find('bg', this.Node_yibm).getComponent(cc.Sprite);
            o['Label_gold'] = cc.find('bg/Label_gold', this.Node_yibm).getComponent(cc.Label);
            //o['Label_xunzhang'] = cc.find('bg/Label_xunzhang', this.Node_yibm).getComponent(cc.Label);
            o['Button_yibm'] = cc.find('Button_yibm', this.Node_yibm).getComponent(cc.Button);
            o['Label_bmsta'] = cc.find('Button_yibm/Label_bmsta', this.Node_yibm).getComponent(cc.Label);

            if (gsd['mineFeeIndex']==0) o['bg'].spriteFrame = this.bg1;
            else if (gsd['mineFeeIndex']==1) o['bg'].spriteFrame = this.bg2;
            else if (gsd['mineFeeIndex']==2) o['bg'].spriteFrame = this.bg3;

            // @ts-ignore
            o['Label_gold'].string = cc.g.utils.realNum1(gsd['mineMatchFee']);
            //this.ybm['Label_xunzhang'].string = `x${cfg[id].xz}倍勋章`;

            if (gsd['signMatchStatus']==1) {
                this.Label_bmsta.string = '报名动态：'+'审核中';
                o['Label_bmsta'].string = '审核中';
                // @ts-ignore
                o['Label_bmsta'].node.color = new cc.Color(0xea, 0xff, 0xf8);
                o['Button_yibm'].interactable = true;
            } else {
                // @ts-ignore
                let tmstr = cc['g'].utils.getFormatTimeXXX(gsd['matchTime'] * 1000, 'Y|.|M|.|D| |h|:|m');
                // @ts-ignore
                this.Label_bmsta.string = '报名动态：'+ tmstr + `消耗${cc.g.utils.realNum1(gsd['mineMatchFee'])}积分加入比赛场`;
                o['Label_bmsta'].string = '游戏中';
                // @ts-ignore
                o['Label_bmsta'].node.color = new cc.Color(0xe4, 0xe4, 0xe4);
                o['Button_yibm'].interactable = false;
            }
        }
    }

    // 点击选项
    onTogCheck(evt, data) {
        cc.dlog('onTogCheck', data);

        // @ts-ignore
        cc.g.utils.btnShake();

        this.curid = data;
    }

    // 报名
    onBtnBaoming(evt, data) {
        cc.dlog('onBtnBaoming ', this.curid);

        // @ts-ignore
        cc.g.utils.btnShake();

        {/*
            //申请报名金币场
            //@api:2286,@type:req
            message ApplyGoldMatchReq{
                int32    teaHouseId = 1;//茶馆Id
                int32    gold=2;//金币
                int32    rate=3;//倍率
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.APPLY_GOLD_MATCH);
        req.teaHouseId = this.bm['teaHouseId'];
        // @ts-ignore
        req.gold = cc.g.utils.fixNum1(this.bm['gold']);
        req.rate = this.bm['rate'][parseInt(this.curid)-1];

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.APPLY_GOLD_MATCH, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog('创建俱乐部包间 成功');
                this.onBtnClose(0,0);
            } else {
                //cc.dlog('创建俱乐部包间 失败');
            }
        });
    }


    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        this.node.destroy();
    }
}
