// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaCaiPanDetail extends cc.Component {

    bcLabelVaule: cc.Label = null;
    cfLabelVaule: cc.Label = null;
    cpLabelVaule: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    doClosePop() {
        this.node.active = false;
    }

    onLoad () {
        this.initViews()
    }

    initViews() {
        this.bcLabelVaule = cc.find("bcLabelVaule", this.node).getComponent(cc.Label);
        this.cfLabelVaule = cc.find("cfLabelVaule", this.node).getComponent(cc.Label);
        this.cpLabelVaule = cc.find("cpLabelVaule", this.node).getComponent(cc.Label);
    }

    showUiDatas(pItem) {
        // cc.dlog('pItem-->' + JSON.stringify(pItem))
        // @ts-ignore
        this.bcLabelVaule.string = cc.g.utils.realNum1(pItem.makeUpGold);
        // @ts-ignore
        this.cfLabelVaule.string = cc.g.utils.realNum1(pItem.punishGold);

        // @ts-ignore
        this.cpLabelVaule.string = cc.g.utils.realNum1(pItem.makeUpGold) - cc.g.utils.realNum1(pItem.punishGold);
    }
}
