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
export default class TeaWfSetName extends cc.Component {

    nameEditBox: cc.EditBox = null;

    private teaHouseId: string = null;
    private floor: number = null;

    doCloseDialog() {
        this.node.active = false;
    }
    onLoad () {
        // 俱乐部名字输入框
        this.nameEditBox = cc.find("Change_Name_EditBox", this.node).getComponent(cc.EditBox);
    }
    initParams(teaHouseId: string, floor: number) {
        this.teaHouseId = teaHouseId
        this.floor = floor
    }
    doCreate() {
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
        cc.g.hallMgr.changeWanFaName(this.teaHouseId, this.floor, name, (resp)=>{
            cc.dlog("收到修改返回", resp)
            this.nameEditBox.string = ''
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.hint('操作成功');
                this.doCloseDialog();
                TeaWfPop.instance.doClosePop();
            } else {
                // @ts-ignore
                cc.g.global.hint('操作失败');
            }
            // TeaClass.instance.updateTeaNameDatas(resp);
        });
    }

    start () {

    }
}
