// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaQingClass extends cc.Component {

    @property(cc.SpriteAtlas)
    comAtlas: cc.SpriteAtlas = null;

    nameEditBox: cc.EditBox = null;
    seachNode: cc.Node = null;
    userId: string = null;

    onLoad () {
        this.initView();
    }
    initView() {
        this.nameEditBox = cc.find("EditBox_ID_Search", this.node).getComponent(cc.EditBox);
        this.seachNode = cc.find("Node_Seach", this.node)
        this.seachNode.active = false;
    }

    showSeachDatas(userInfo: any) {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.seachNode.active = true;

        let headerImage = cc.find("Node_headMask/Sprite_head", this.seachNode).getComponent(cc.Sprite);
        // @ts-ignore
        cc.g.utils.setHead(headerImage, userInfo.icon);
        // if (userInfo.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(headerImage, userInfo.icon);
        // } else {
        //     let spriteFrame = this.comAtlas.getSpriteFrame('com_img_hdbqdi');
        //     headerImage.spriteFrame = spriteFrame;
        // }

        let userName = cc.find("User_Name_Label", this.seachNode).getComponent(cc.Label);
        userName.string = userInfo.name

        let userId = cc.find("User_ID_Label", this.seachNode).getComponent(cc.Label);
        userId.string = 'ID:' + userInfo.userId
        this.userId = userInfo.userId
    }

    doGetDatas(name: string) {
        // @ts-ignore
        cc.g.hallMgr.searchUserById(name, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                let found = resp.found
                if (found) {
                    this.showSeachDatas(resp)
                } else {
                    this.seachNode.active = false;
                    // @ts-ignore
                    cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '没有搜索到用户');
                }
                // this.teaDatas = resp.list;
                // // @ts-ignore
                // if (!cc.g.utils.judgeArrayEmpty(this.teaDatas)) {
                //     this.createViewWithDatas();
                // } else {
                //     this.mainScrollView.content.removeAllChildren(true);
                // }
            }
        });
    }

    start () {

    }

    // update (dt) {}

    doSeachBtn() {
        let name = this.nameEditBox.string;
        if(name === '') {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', 'ID不能为空');
            return;
        }

        this.doGetDatas(name);
    }

    doCancleBtn() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.seachNode.active = false
        this.nameEditBox.string = ''
        this.node.active = false;
    }

    doYaoQingBtn() {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        if(cc.g.utils.judgeStringEmpty(this.userId)) {
            // @ts-ignore
            cc.g.global.hint('请先搜索用户');
            return;
        }

        // @ts-ignore
        cc.g.hallMgr.addYaoQingPerson(TeaClass.instance.teaHouseId, this.userId, (resp)=>{
            this.doCancleBtn();
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.hint('邀请成功');
            } else {
                // @ts-ignore
                cc.g.global.hint('邀请失败');
            }
        });
    }
}
