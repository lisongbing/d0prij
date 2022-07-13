// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaWfPop from "./tea_wf_pop";
import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaChangeRemark extends cc.Component {

    nameEditBox: cc.EditBox = null;
    pItem: any = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 俱乐部名字输入框
        this.nameEditBox = cc.find("Remark_EditBox", this.node).getComponent(cc.EditBox);
    }

    doCloseDialog() {
        this.node.active = false;
    }

    start () {

    }

    showUiDatas(pItem) {
        this.pItem = pItem;

        this.nameEditBox.string = ''

        // 头像

        let headerImage = cc.find("com_mask_head0", this.node).getComponent(cc.Sprite);
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        let Label_Name = cc.find("Label_Name", this.node).getComponent(cc.Label);
        Label_Name.string = pItem.name

        let Label_ID = cc.find("Label_ID", this.node).getComponent(cc.Label);
        Label_ID.string = pItem.userId

        let Label_Fs = cc.find("Label_Fs", this.node).getComponent(cc.Label);
        Label_Fs.string = pItem.reviewerId
    }

    doSaveBtn() {
        cc.dlog('点击创建房间');

        // @ts-ignore
        cc.g.utils.btnShake();

        let name = this.nameEditBox.string;
        if(name === '') {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '俱乐部名字不能为空');
            return;
        }
        // @ts-ignore
        cc.g.hallMgr.changeUserRemarkName(TeaClass.instance.teaHouseId, this.pItem.userId, name, (resp)=>{
            cc.dlog("收到修改返回", resp)
            this.doCloseDialog();
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作成功');
                // 重新获取数据
                TeaChenYuan.instance.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    doCancelBtn() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.doCloseDialog();
    }

    // update (dt) {}
}
