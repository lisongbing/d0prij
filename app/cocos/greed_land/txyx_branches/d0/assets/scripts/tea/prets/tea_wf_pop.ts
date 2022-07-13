// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import TeaClass from "../tea";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaWfPop extends cc.Component {
    static instance: TeaWfPop = null;
    // 添加玩法对象
    wfObj: any = {}

    @property(cc.Prefab)
    dlgCreatRoom: cc.Prefab = null;

    @property(cc.Prefab)
    wfCellItem: cc.Prefab = null;

    mainScrollView: cc.ScrollView = null;

    onLoad () {
        TeaWfPop.instance = this;
    }

    getMainScrollView() {
        if (this.mainScrollView == null) {
            this.mainScrollView = cc.find("Node_Content/Node_List/List_ScrollView", this.node).getComponent(cc.ScrollView);
        }
        return this.mainScrollView
    }

    initViews () {
        // this.getMainScrollView();
    }

    start () {

    }
    onEnable () {
        this.doRemoveAllItems();
        // 显示数据
        TeaClass.instance.teaRoomDatas.forEach((item) => {
            this.showUiDatas(item)
        })
    }


    setWanFaObj(wfObj: any) {
        this.wfObj = wfObj;
    }

    doClosePop() {
        this.node.active = false;
    }

    doRemoveAllItems() {
        this.getMainScrollView().content.removeAllChildren(true);
    }
    showUiDatas(item: any) {
        let cardNode = cc.instantiate(this.wfCellItem);

        let numLabel = cc.find("Num_Label", cardNode).getComponent(cc.Label);
        numLabel.string = item.floor

        // 局数
        let nameLabel = cc.find("Name_Label", cardNode).getComponent(cc.Label);
        nameLabel.string = item.name

        let gameLabel = cc.find("Game_Label", cardNode).getComponent(cc.Label);
        gameLabel.string = item.deskName

        // 气泡名字
        let jueName = cc.find("JuLabel", cardNode).getComponent(cc.Label);
        jueName.string = item.gameNum + "局"

        let jrBtn = cc.find("GaiMingButton", cardNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(jrBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(jrBtn, this, 'tea_wf_pop', 'doChangeName', item);

        let tyBtn = cc.find("Wf_Setting_Button", cardNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, this, 'tea_wf_pop', 'goSetting', item);

        this.getMainScrollView().content.addChild(cardNode, item.floor, "teapop"+item.floor);
    }

    goSetting(event, item) {
        // @ts-ignore
        cc.g.utils.btnShake();

        let ins = TeaClass.instance;
        item.clubId = ins.teaHouseId;
        item.openGold = ins.SettingData['isGoldOpen'];
        cc.dlog('设置玩法...', item)

        let dlg = cc.instantiate(this.dlgCreatRoom).getComponent('CreateRoomDlg');
        ins.node.addChild(dlg.node);
        dlg.upWithClubBjSetting(item);

        this.doClosePop();
    }

    doChangeName(event, item) {
        cc.dlog('修改玩法名字...', item)
        
        // @ts-ignore
        cc.g.utils.btnShake();

        TeaClass.instance.doShowTeaSetNameDialog(item.floor)
    }

    doChangeNameWithDatas(item) {
        let cardNode = this.getMainScrollView().content.getChildByName("teapop" + item.floor)
        let nameLabel = cc.find("Name_Label", cardNode).getComponent(cc.Label);
        nameLabel.string = item.name
    }

    // 添加玩法
    doCreateWf() {
        // @ts-ignore
        cc.g.utils.btnShake();

        let ins = TeaClass.instance;

        this.wfObj.openGold = ins.SettingData['isGoldOpen'];//是否开放金币场
        
        let dlg = cc.instantiate(this.dlgCreatRoom).getComponent('CreateRoomDlg');
        ins.node.addChild(dlg.node);
        dlg.upWithClubBjCreate(this.wfObj);

        this.doClosePop();
    }

    // 添加玩法
    doSettingWf() {

    }

    // update (dt) {}
}
