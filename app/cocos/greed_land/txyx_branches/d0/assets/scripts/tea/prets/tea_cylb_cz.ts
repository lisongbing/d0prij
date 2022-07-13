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
export default class TeaChenYuanSetting extends cc.Component {
    private contentNode: cc.Node;
    private contentNodeArr: any[] = [];
    public cellItem: any;
    private curPosition: number = 0;

    onLoad () {
        this.initViews();
    }
    initViews() {
        // 滑动content
        this.contentNode = cc.find("Node_Content/Node_Menus", this.node)
        for (let i = 0; i < 14; i++) {
            let contNode = this.contentNode.getChildByName("Button_Setting" + (i + 1))
            this.contentNodeArr.push(contNode)
        }
    }

    doResetNodeArr() {
        for (let i = 0; i < this.contentNodeArr.length; i++) {
            let contNode = this.contentNodeArr[i];
            contNode.active = false;
        }

        for (let i = 0; i < this.contentNodeArr.length; i++) {
            let contNode = this.contentNodeArr[i];
            contNode.active = true;
        }
    }

    popInitParams(cellItem, roleNum) {
        // cc.log('popInitParams-->' + roleNum)
        this.doResetNodeArr();
        this.cellItem = cellItem;

        this.contentNodeArr[13].active = false;
        if (TeaClass.instance.cordonAuth) {
            let pos = TeaClass.instance.position
            if (! TeaClass.instance.SettingData['isGoldOpen']) {
                if ((pos==71||pos==61) && cellItem.teamId==0) {
                    this.contentNodeArr[13].active = true;
                }
                if (pos==41||pos==31||pos==21||pos==11) {
                    this.contentNodeArr[13].active = (TeaClass.instance.teamId == cellItem.teamId);
                }
            }
        }
        

        // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        // 登陆人
        if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
            this.contentNodeArr[10].active = true;
        } else {
            this.contentNodeArr[10].active = false;
        }

        
        if (TeaClass.instance.position > 1) {
            if (this.cellItem.position > 1) {
                this.contentNodeArr[11].active = false;
            } else {
                // 设置按钮
                // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                let label = cc.find("Background/Label", this.contentNodeArr[11])
                this.contentNodeArr[11].active = true;
                let groupName = this.cellItem.groupName
                // @ts-ignore
                if (cc.g.utils.judgeStringEmpty(groupName)) {
                    label.getComponent(cc.Label).string="设置队长"
                    this.curPosition = 41
                } else {
                    let groupArr = groupName.split('_')
                    let len = groupArr.length
                    if (len == 1) {
                        label.getComponent(cc.Label).string="设置组长"
                        this.curPosition = 31
                    } else if (len == 2) {
                        label.getComponent(cc.Label).string="设置小组长"
                        this.curPosition = 21
                    } else if (len == 3) {
                        label.getComponent(cc.Label).string = "设置推荐人"
                        this.curPosition = 11
                    }
                }
            }
        } else {
            this.contentNodeArr[11].active = false;
        }

        if (roleNum == 1) { // 圈住/超管
            if (this.cellItem.position == 61) {
                this.contentNodeArr[5].active = false;
                this.contentNodeArr[8].active = false;
                this.contentNodeArr[9].active = false;
                if (this.cellItem.teamId > 0) {
                    this.contentNodeArr[0].active = false;
                }
            } else if ((this.cellItem.position == 41) || (this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
                this.contentNodeArr[0].active = false;
                this.contentNodeArr[2].active = false;
                // this.contentNodeArr[10].active = false;
            } else if ((this.cellItem.position == 1)  || (this.cellItem.position == 51)) {
                // @ts-ignore
                if (this.cellItem.teamId == 0) {
                    this.contentNodeArr[5].active = false;
                    this.contentNodeArr[8].active = false;
                    this.contentNodeArr[9].active = false;
                } else {
                    this.contentNodeArr[0].active = false;
                    this.contentNodeArr[5].active = false;
                    this.contentNodeArr[8].active = false;
                    this.contentNodeArr[9].active = false;
                }
                // this.contentNodeArr[10].active = false;
            }
        } else if (roleNum == 2) {
            // this.contentNodeArr[10].active = false;
            if ((this.cellItem.position == 41) || (this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
                this.contentNodeArr[0].active = false;
                this.contentNodeArr[2].active = false;
                this.contentNodeArr[6].active = false;
                this.contentNodeArr[7].active = false;
                this.contentNodeArr[8].active = false;
                this.contentNodeArr[9].active = false;
            } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
                // this.contentNodeArr[10].active = false;
                // @ts-ignore
                // 对直属普通玩家
                if (this.cellItem.teamId == 0) {
                    this.contentNodeArr[0].active = false;
                    this.contentNodeArr[2].active = false;
                    this.contentNodeArr[5].active = false;
                    this.contentNodeArr[6].active = false;
                    this.contentNodeArr[7].active = false;
                    this.contentNodeArr[8].active = false;
                    this.contentNodeArr[9].active = false;
                } else {
                    // 登录teamid和当前选中teamid 一样，
                    // @ts-ignore
                    if (!cc.g.utils.judgeStringEmpty(TeaChenYuan.instance.groupName) && !cc.g.utils.judgeStringEmpty(cellItem.groupName)) {
                        if (cellItem.groupName.indexOf(TeaChenYuan.instance.groupName) == 0) {
                            this.contentNodeArr[0].active = false;
                            this.contentNodeArr[2].active = false;
                            this.contentNodeArr[5].active = false;
                            this.contentNodeArr[6].active = false;
                            this.contentNodeArr[7].active = false;
                            this.contentNodeArr[8].active = false;
                            this.contentNodeArr[9].active = false;
                        }
                    } else {
                      // 隐藏所有操作
                        this.contentNodeArr.forEach((item)=>{
                            item.active = false
                        })
                    }
                }
            }
        }

        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(cellItem.groupName)) {
            this.contentNodeArr[2].active = false;
        }


        if (TeaClass.instance.SettingData['isGoldOpen']) {
            // 有职位的玩家就显示设置反比
            if (this.cellItem.position > 1) {
                this.contentNodeArr[12].active = true;
            } else {
                this.contentNodeArr[12].active = false;
            }
        } else {
            this.contentNodeArr[12].active = false;
        }

    }

    doCloseDialog() {
        this.node.active = false;
    }

    start () {

    }

    doSettingBtnClicked(event, clickIndex) {
        cc.dlog('操作按钮点击==>', clickIndex);

        // @ts-ignore
        cc.g.utils.btnShake();

        this.doCloseDialog();
        if (clickIndex == 1) { //  选择小组
            TeaChenYuan.instance.teaFenPeiCy.showUiDatas(TeaChenYuan.instance.teamNolist, this.cellItem)
            TeaChenYuan.instance.doShowXiaoDuiDialog();
        } else if (clickIndex == 2) { //  修改备注
            TeaChenYuan.instance.teaChangeRemark.showUiDatas(this.cellItem)
            TeaChenYuan.instance.doShowChangeReamrkDialog();
        } else if (clickIndex == 3) { //  升为管理员
            //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            if (this.cellItem.position == 61 || this.cellItem.position == 51) {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消管理员?', 2)
            } else {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否升级为管理员?', 1)
            }
            TeaChenYuan.instance.doShowAlertDialog();
        } else if (clickIndex == 4) { //  踢出亲友圈
            TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否踢出亲友圈?', 3)
            TeaChenYuan.instance.doShowAlertDialog();
        } else if (clickIndex == 5) { //  禁止玩牌
            if (this.cellItem.forbidGame) {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消禁止玩牌?', 5)
            } else {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否禁止玩牌?', 4)
            }
            TeaChenYuan.instance.doShowAlertDialog();
        } else if (clickIndex == 6) { //  全部禁玩
            // 所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            if ((this.cellItem.position == 41) || (this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
                if (this.cellItem.forbidGame) {
                    TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消全部禁玩?', 7)
                } else {
                    TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否全部禁玩?', 6)
                }
                TeaChenYuan.instance.doShowAlertDialog();
            } else {
                // 普通成员
                cc.dlog('普通成员')
            }

        } else if (clickIndex == 7) { //  包厢限制
            TeaChenYuan.instance.teaBaoXianZhi.showUiDatas(this.cellItem)
            TeaChenYuan.instance.doShowBaoXianZhiDialog();
        } else if (clickIndex == 8) { //  只玩二人场
            if (this.cellItem.onlyTwoPeople) {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消只玩二人场?', 9)
            } else {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否只玩二人场?', 8)
            }

            TeaChenYuan.instance.doShowAlertDialog();
        } else if (clickIndex == 9) { //  全员二人场
            // 所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            if ((this.cellItem.position == 41) || (this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
                if (this.cellItem.onlyTwoPeople) {
                    TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消全员二人场?', 10)
                } else {
                    TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否全员二人场?', 11)
                }
                TeaChenYuan.instance.doShowAlertDialog();
            } else {
                // 普通成员
                cc.dlog('普通成员')
            }
        } else if (clickIndex == 10) { //  全部踢出
            // 所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            if ((this.cellItem.position == 41) || (this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否全部踢出?', 13)

            } else {
                TeaChenYuan.instance.teaAlertDialog.showUiDatas(this.cellItem, '是否取消全部踢出?', 12)
            }
            TeaChenYuan.instance.doShowAlertDialog();
        } else if (clickIndex == 11) { // 关联ID
            let ins = TeaChenYuan.instance;
            ins.doShowGuanlianIDDialog();
            ins.dlgGlid.up(this.cellItem);
        } else if (clickIndex == 12) { // 设置管理员
            cc.dlog('this.curPosition-->' + this.curPosition)
            cc.dlog('this.this.cellItem-->' + JSON.stringify(this.cellItem))
            // TeaChenYuan.instance.createPosition
            // @ts-ignore
            cc.g.hallMgr.searchZhanDuiAddPerOne(TeaClass.instance.teaHouseId, this.cellItem.teamId, this.cellItem.userId, this.curPosition,  (resp)=>{
                this.doCloseDialog();
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    // @ts-ignore
                    cc.g.global.hint('操作成功');
                    // 重新获取数据
                    TeaChenYuan.instance.doGetRefreshList();
                } else {
                    // @ts-ignore
                    cc.g.global.hint('操作失败');
                }
            });
        } else if (clickIndex == 13) { // 设置反比
            cc.dlog('反比设置....')
            this.doCloseDialog()
            TeaChenYuan.instance.doShowFanBiDialog(false)
        } else if (clickIndex == 14) { // 警戒线
            cc.dlog('警戒线....')
            this.doCloseDialog()
            TeaChenYuan.instance.doShowJJXDialog(this.cellItem)
        }
    }
    // update (dt) {}
}
