// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaChenYuan from "./tea_chengyuan";
import TeaClass from "../tea";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaCyDaoRu extends cc.Component {

    @property(cc.Prefab)
    daoRuItemPre: cc.Prefab = null;
    pItem: any = null;

    mainScrollView: cc.ScrollView = null;

    doClosePop() {
        this.node.active = false;
    }

    onLoad () {
        this.initViews();
    }

    initViews () {
        this.mainScrollView = cc.find("ScrollView_Content", this.node).getComponent(cc.ScrollView);
    }

    onEnable () {
        this.doGetDats();
    }

    showUiDatas(arrs) {
        this.mainScrollView.content.removeAllChildren(true);
        arrs.forEach((item)=>{

            let cardNode = cc.instantiate(this.daoRuItemPre);

            let numLabel = cc.find("Node_Content/Label_Name", cardNode).getComponent(cc.Label);
            numLabel.string = item.name

            let tyBtn = cc.find("Cell_Button", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(tyBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, this, 'tea_qyqdr', 'doDaoRu', item);

            this.mainScrollView.content.addChild(cardNode, 0);
        })
    }

    doGetDats() {
        // @ts-ignore
        cc.g.hallMgr.searchCyDrList(TeaClass.instance.teaHouseId, (resp)=>{
            cc.dlog('收到列表数据', resp)
            this.showUiDatas(resp.list)
        });
    }

    doDaoRu(event, item) {
        cc.dlog('导入点击来', item)
        this.doClosePop();
        TeaChenYuan.instance.doShowAlertDialog();
        TeaChenYuan.instance.teaAlertDialog.showUiDatas(item, '是否导入亲友圈?', 14)
    }

    // update (dt) {}
}
