// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    Button_bd: any = null;
    Button_ybd: any = null;
    EditBox_ID: any = null;
    Label_bdID: any = null;

    Label_nfk: any = null;
    Label_yqm: any = null;
    Label_renshu: any = null;
    Label_jiangli: any = null;

    bdData: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();
    }

    initView() {
        let r = this.node;

        // 绑定按钮
        this.Button_bd = cc.find('Button_bd', r);
        this.Button_ybd = cc.find('Button_ybd', r);

        //
        this.EditBox_ID = cc.find('EditBox_ID', r).getComponent(cc.EditBox);
        this.Label_bdID = cc.find('Label_bdID', r).getComponent(cc.Label);

        // n张房卡 我的邀请码 已邀请人数 已获得奖励
        this.Label_yqm = cc.find('Label_yqm', r).getComponent(cc.Label);
        this.Label_renshu = cc.find('Label_renshu', r).getComponent(cc.Label);
        this.Label_jiangli = cc.find('Label_jiangli', r).getComponent(cc.Label);
    }

    start () {

    }

    // update (dt) {}

    init() {
        cc.log('init');

        this.Button_bd.active = this.Button_ybd.active = false;
        this.EditBox_ID.string = '';
        this.EditBox_ID.node.active = false;
        this.Label_bdID.node.active = false;

        this.Label_yqm.node.active = this.Label_renshu.node.active = this.Label_jiangli.node.active = false;

         {/*
            DIND_RECOMMENTER = 1040;//绑定推荐者
	        GET_BAND_INFO    = 1041;//绑定的信息

            // 绑定
            //@api:1040,@type:req
            message BindRecommenter {
                string code = 1;
            }

            // 绑定信息
            //@api:1041,@type:req
            message BindReommentInfo {
                string code = 1;
                string mycode = 2;
                int32  recommentNum = 3;
                int32  recommentCardNum = 4;
            }
        */}

        this.bdData = {};

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GET_BAND_INFO);

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GET_BAND_INFO, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('绑定的信息 成功');

                this.bdData = {
                    code: resp.code,
                    mycode: resp.mycode,
                    recommentNum: resp.recommentNum,
                    recommentCardNum: resp.recommentCardNum,
                }

                this.upView();
            } else {
                cc.log('绑定的信息 失败');
            }
        });
    }

    upView() {
        this.Button_bd.active = this.Button_ybd.active = false;
        this.EditBox_ID.string = '';
        this.Label_bdID.node.active = false;

        this.Label_yqm.node.active = this.Label_renshu.node.active = this.Label_jiangli.node.active = true;

        let d = this.bdData;
        if (!d.code || d.code=='') {
            this.Button_bd.active = true;
            this.EditBox_ID.node.active = true;
        } else {
            this.Button_ybd.active = true;
            this.EditBox_ID.node.active = false;
            this.Label_bdID.node.active = true;
            this.Label_bdID.string = d.code;
        }

        this.Label_yqm.string = d.mycode;
        this.Label_renshu.string = d.recommentNum;
        this.Label_jiangli.string = d.recommentCardNum;
    }

    // 绑定
    onBtnBangding(event, customEventData) {
        cc.log('绑定 onBtnBangding');

        cc.g.utils.btnShake();

        let id = this.EditBox_ID.string;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.DIND_RECOMMENTER);
        req.code = id;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.DIND_RECOMMENTER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore cc.log('绑定推荐者 成功');
                cc.g.global.hint('绑定成功');
                this.Button_bd.active = false
                this.Button_ybd.active = true;

                this.EditBox_ID.node.active = false;
                this.Label_bdID.node.active = true;
                this.Label_bdID.string = id;
            } else {
                cc.log('绑定推荐者 失败');
            }
        });
    }

    onClose(event, customEventData) {
        cc.g.utils.btnShake();
        this.node.destroy();
    }
}
