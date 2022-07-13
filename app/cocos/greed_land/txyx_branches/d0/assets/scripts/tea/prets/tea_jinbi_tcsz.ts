// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

let tea = null;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    open() {
        // @ts-ignore
        // let req = pbHelper.newReq(PB.PROTO.MODIFY_GOLD_MATCH_OPEN);
        // req.teaHouseId = tea.teaHouseId;
        // req.goldMatchOpen = true;

        // // @ts-ignore
        // cc.g.networkMgr.send(PB.PROTO.MODIFY_GOLD_MATCH_OPEN, req, (resp) => {
        //     // @ts-ignore
        //     if (!resp.err || resp.err==PB.ERROR.OK) {
        //         //cc.dlog('MODIFY_GOLD_MATCH_OPEN 成功');
        //     } else {
        //         cc.dlog('MODIFY_GOLD_MATCH_OPEN 失败2');
        //     }
        // });

        // @ts-ignore
        cc.g.utils.btnShake();

        this.onBtnClose(0,0);
        TeaClass.instance.showDlgSetting('bisai');
    }

    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');

        // @ts-ignore
        cc.g.utils.btnShake();

        this.node.destroy();
    }
}
