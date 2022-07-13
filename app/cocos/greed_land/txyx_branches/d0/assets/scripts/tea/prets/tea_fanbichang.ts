// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaFanBiChange extends cc.Component {

    okButton: cc.Button = null;
    nameEditBox: cc.EditBox = null;
    pItem: any = null;
    private canClickOk:boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 俱乐部名字输入框
        this.okButton = cc.find("OK_Button", this.node).getComponent(cc.Button);
        this.nameEditBox = cc.find("Change_Num_EditBox", this.node).getComponent(cc.EditBox);
    }

    doCloseDialog() {
        this.node.active = false;
    }

    start () {

    }
    showOkBtn(pItem) {
        // 普通成员	成员列表  没有队员界面
        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
            this.okButton.node.active = true
        } else if (TeaClass.instance.position == 41) {
            if (pItem.position == 31) {
                this.okButton.node.active = true
            } else {
                this.okButton.node.active = false
            }
        } else if (TeaClass.instance.position == 31) {
            if (pItem.position == 21) {
                this.okButton.node.active = true
            } else {
                this.okButton.node.active = false
            }
        } else if (TeaClass.instance.position == 21) {
            if (pItem.position == 11) {
                this.okButton.node.active = true
            } else {
                this.okButton.node.active = false
            }
        }
    }
    showUiDatas(canClickOk, pItem) {
        this.canClickOk = canClickOk;
        cc.dlog('showUiDatas-->' + canClickOk)
        cc.dlog('pItem-->' + pItem)

        this.pItem = pItem;

        this.showOkBtn(pItem);

        this.nameEditBox.string = ''

        // 头像
        let headerImage = cc.find("com_mask_head0", this.node).getComponent(cc.Sprite);
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        // if (pItem.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
        // }
        // else {
        //     let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     headerImage.spriteFrame = spriteFrame;
        // }

        let Label_Name = cc.find("Label_Name", this.node).getComponent(cc.Label);
        Label_Name.string = pItem.name

        let Label_ID = cc.find("Label_ID", this.node).getComponent(cc.Label);
        Label_ID.string = pItem.userId

        // let Label_Fs = cc.find("RightNode/LabelVaule", this.node).getComponent(cc.Label);
        // Label_Fs.string = pItem.reviewerId

        this.doGetFanBiVaule()
    }

    doGetFanBiVaule() {
        const  self = this
        // @ts-ignore
        cc.g.hallMgr.getFanBiVaue(TeaClass.instance.teaHouseId, this.pItem.teamId, (resp)=>{
            cc.dlog("收到返回", resp)
            if (resp != null) {
                let Label_Fs = cc.find("RightNode/LabelVaule", self.node).getComponent(cc.Label);
                // @ts-ignore
                Label_Fs.string = cc.g.utils.fixNum1(resp.contributeRate) + '%';
            }
        });
    }

    doSaveBtn() {
        cc.dlog('点击创建房间');
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        let name = cc.g.utils.realNum1(this.nameEditBox.string)
        if(name === '') {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '反比不能为空');
            return;
        }

        // @ts-ignore
        cc.g.hallMgr.changeFanBiVaule(TeaClass.instance.teaHouseId, this.pItem.teamId, name, (resp)=>{
            cc.dlog("收到返回", resp)
            this.doCloseDialog();
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作成功');

                if (this['fanbiOKFun']) {
                    this['fanbiOKFun'](resp.contributeRate);
                }
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
