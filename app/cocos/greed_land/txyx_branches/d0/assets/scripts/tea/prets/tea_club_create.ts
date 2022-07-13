// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaQuanClass from "../tea_quan";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaClubCreate extends cc.Component {

    nameEditBox: cc.EditBox = null;

    doCloseDialog() {
        this.node.active = false;
    }
    onLoad () {
        // 俱乐部名字输入框
        this.nameEditBox = cc.find("name", this.node).getComponent(cc.EditBox);
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
        cc.g.hallMgr.createClub(name, null, null, ()=>{
            this.node.active = false;
            TeaQuanClass.instance.doUpdateDatas();
        });
    }

    start () {

    }

    // update (dt) {}
}
