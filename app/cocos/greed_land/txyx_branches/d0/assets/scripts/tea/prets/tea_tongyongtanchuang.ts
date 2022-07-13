// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaAlertDialog extends cc.Component {

    label: cc.Label = null;
    okBtn: cc.Button = null;
    cancleBtn: cc.Button = null;
    pItem: any = null;
    btnShowIndex: number = 0

    onLoad () {
        // 俱乐部名字输入框
        this.label = cc.find("Label_Tips", this.node).getComponent(cc.Label);

        this.okBtn = cc.find("Ok_Button", this.node).getComponent(cc.Button)
        this.cancleBtn = cc.find("No_Button", this.node).getComponent(cc.Button)
    }

    showUiDatas(pItem, msg, btnShowIndex) {
        this.pItem = pItem;
        this.btnShowIndex = btnShowIndex;
        if (btnShowIndex == 1) {
            // let btnokSprt = cc.find("te_cy_header_sure", this.okBtn.node).getComponent(cc.Sprite)
            // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('tea_txt_chaoguan');
            // btnokSprt.spriteFrame = spriteFrame;
            //
            // let btncnSprt = cc.find("te_cy_header_fou", this.cancleBtn.node).getComponent(cc.Sprite)
            // let spriteCanFrame = TeaClass.instance.teaAtlas.getSpriteFrame('tea_txt_guanliyuan');
            // btncnSprt.spriteFrame = spriteCanFrame;
            //
            let backgroundOkNode = this.okBtn.node.getChildByName("Background")
            backgroundOkNode.getChildByName("New Label").getComponent(cc.Label).string = "超管";

            let backgroundCancleNode = this.cancleBtn.node.getChildByName("Background")
            backgroundCancleNode.getChildByName("New Label").getComponent(cc.Label).string = "管理员";

        } else {
            // let btnokSprt = cc.find("te_cy_header_sure", this.okBtn.node).getComponent(cc.Sprite)
            // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_sure');
            // btnokSprt.spriteFrame = spriteFrame;
            //
            // let btncnSprt = cc.find("te_cy_header_fou", this.cancleBtn.node).getComponent(cc.Sprite)
            // let spriteCanFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_fou');
            // btncnSprt.spriteFrame = spriteCanFrame;

            let backgroundOkNode = this.okBtn.node.getChildByName("Background")
            backgroundOkNode.getChildByName("New Label").getComponent(cc.Label).string = "是";

            let backgroundCancleNode = this.cancleBtn.node.getChildByName("Background")
            backgroundCancleNode.getChildByName("New Label").getComponent(cc.Label).string = "否";
        }

        this.label.string = msg
    }

    doCloseDialog() {
        this.node.active = false;
    }

    start () {

    }

    doBtnClicked(event, clickIndex) {
        // @ts-ignore
        cc.g.utils.btnShake();

        if (clickIndex == 1) {
            if (this.btnShowIndex == 1) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.updateUserRoles(TeaClass.instance.teaHouseId, this.pItem.userId, 61, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 2) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.cancleUserRoles(TeaClass.instance.teaHouseId, this.pItem.userId, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 3) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.deleteFromQuan(TeaClass.instance.teaHouseId, this.pItem.userId, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
                // cc.g.hallMgr.deleteFromQuan(TeaClass.instance.teaHouseId, this.pItem.userId, null);
            } else if (this.btnShowIndex == 4) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.jinZhiPlay(TeaClass.instance.teaHouseId, this.pItem.userId, true, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 5) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.jinZhiPlay(TeaClass.instance.teaHouseId, this.pItem.userId, false, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 6) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allJinZhiPlay(TeaClass.instance.teaHouseId, this.pItem.teamId, true, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 7) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allJinZhiPlay(TeaClass.instance.teaHouseId, this.pItem.teamId, false, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 8) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.zhiTwoPlay(TeaClass.instance.teaHouseId, this.pItem.userId, true, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 9) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.zhiTwoPlay(TeaClass.instance.teaHouseId, this.pItem.userId, false, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            }
            else if (this.btnShowIndex == 10) {
                cc.dlog('TeaClass.instance.teaHouseId==>', TeaClass.instance.teaHouseId)
                cc.dlog('TeaClass.pItem.teamId==>', this.pItem.teamId)
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allTwoPlay(TeaClass.instance.teaHouseId, this.pItem.teamId, false, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            }
            else if (this.btnShowIndex == 11) {
                cc.dlog('TeaClass.instance.teaHouseId==>', TeaClass.instance.teaHouseId)
                cc.dlog('TeaClass.pItem.teamId==>', this.pItem.teamId)
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allTwoPlay(TeaClass.instance.teaHouseId, this.pItem.teamId, true, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            }
            else if (this.btnShowIndex == 12) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allTieChu(TeaClass.instance.teaHouseId, this.pItem.teamId, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            }
            else if (this.btnShowIndex == 13) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.allTieChu(TeaClass.instance.teaHouseId, this.pItem.teamId, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else if (this.btnShowIndex == 14) {
                // @ts-ignore
                cc.g.hallMgr.addCyDrList(TeaClass.instance.teaHouseId, this.pItem.teaHouseId, (resp)=>{
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('导入成功');
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('导入失败');
                    }
                });
            }
        } else if (clickIndex == 2) {
            if (this.btnShowIndex == 1) {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                // @ts-ignore
                cc.g.hallMgr.updateUserRoles(TeaClass.instance.teaHouseId, this.pItem.userId, 51, (resp)=>{
                    cc.dlog("收到修改返回", resp)
                    this.doCloseDialog();
                    // @ts-ignore
                    if (!cc.g.utils.judgeObjectEmpty(resp)) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetListDatas();
                    } else {
                        // @ts-ignore
                        cc.g.global.hint('操作失败');
                    }
                });
            } else {
                this.doCloseDialog();
            }
        }
    }

    // update (dt) {}
}
