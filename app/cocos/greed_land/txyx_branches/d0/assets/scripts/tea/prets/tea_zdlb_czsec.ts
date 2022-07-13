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
export default class TeaZhanDuiCaoZuoSec extends cc.Component {

    private contentNode: cc.Node;
    private contentNodeArr: any[] = [];
    public cellItem: any;
    private createPosition: number = 0;

    onLoad () {
        this.initViews();
    }
    initViews() {
        // 滑动content
        this.contentNode = cc.find("Node_Content/Node_Menus", this.node)
        for (let i = 0; i < 7; i++) {
            let contNode = this.contentNode.getChildByName("Button_Setting" + (i + 1))
            contNode.active = false
            this.contentNodeArr.push(contNode)
        }
    }

    popInitParams(cellItem, curPosition) {
        this.cellItem = cellItem;
        // 登录人权限
        // curPosition = TeaClass.instance.position;

        // if (curPosition >= cellItem.position) {
        //
        // }

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)

        this.contentNodeArr[6].active = false;
        if (TeaClass.instance.cordonAuth) {
            let pos = TeaClass.instance.position
            if (! TeaClass.instance.SettingData['isGoldOpen']) {
                if ((pos==71||pos==61) && cellItem.teamId==0) {
                    this.contentNodeArr[6].active = true;
                }
                if (pos==41||pos==31||pos==21||pos==11) {
                    this.contentNodeArr[6].active = (TeaClass.instance.teamId == cellItem.teamId);
                }
            }
        }

        // 反比设置
        // 圈主/超管 登录，只显示 添加战队
        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let isGoldOpen = TeaClass.instance.SettingData['isGoldOpen']
        if (isGoldOpen) {
            this.contentNodeArr[3].active = true;
        } else {
            this.contentNodeArr[3].active = false;
        }


        if (cellItem.teamNo > 0) {
            this.contentNodeArr[0].active = true;
            this.contentNodeArr[1].active = true;
            this.contentNodeArr[2].active = true;
            this.contentNodeArr[3].active = true;
            this.contentNodeArr[4].active = false;
            this.contentNodeArr[5].active = false;
        } else {
            this.contentNodeArr[0].active = false;
            this.contentNodeArr[1].active = false;
            this.contentNodeArr[2].active = false;
            this.contentNodeArr[3].active = false;
            this.contentNodeArr[4].active = false;
            this.contentNodeArr[5].active = false;

            // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)

            let label = cc.find("Background/Label", this.contentNodeArr[4])

            if (this.cellItem.position == 41) {
                label.getComponent(cc.Label).string="转让队长"
                this.contentNodeArr[4].active = true;
                this.contentNodeArr[5].active = false;
            } else if (this.cellItem.position == 31) {
                label.getComponent(cc.Label).string="转让组长"
                this.contentNodeArr[4].active = true;
                this.contentNodeArr[5].active = false;
            } else if (this.cellItem.position == 21) {
                label.getComponent(cc.Label).string="转让小组长"
                this.contentNodeArr[4].active = true;
                this.contentNodeArr[5].active = false;
            } else if (this.cellItem.position == 11) {
                label.getComponent(cc.Label).string="转让推荐人"
                this.contentNodeArr[4].active = true;
                this.contentNodeArr[5].active = false;
            } else if (this.cellItem.position == 1) {
                let labelTwo = cc.find("Background/Label", this.contentNodeArr[5])
                if (this.cellItem.level == 2) {
                    this.contentNodeArr[4].active = false;
                    this.contentNodeArr[5].active = true;
                    labelTwo.getComponent(cc.Label).string="升为组长"
                } else if (this.cellItem.level == 3) {
                    this.contentNodeArr[4].active = false;
                    this.contentNodeArr[5].active = true;
                    labelTwo.getComponent(cc.Label).string="升为小组长"
                } else if (this.cellItem.level == 4) {
                    this.contentNodeArr[4].active = false;
                    this.contentNodeArr[5].active = true;
                    labelTwo.getComponent(cc.Label).string="升为推荐人"
                }
            }
        }

        // 反比设置
        // 圈主/超管 登录，只显示 添加战队
        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (!isGoldOpen) {
            this.contentNodeArr[3].active = false;
        }

        // // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        // if (curPosition == 41) {
        //     // 有组
        //     if (cellItem.teamNo > 0) {
        //         if ((this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //             this.contentNodeArr[0].active = true;
        //             this.contentNodeArr[1].active = true;
        //             this.contentNodeArr[2].active = true;
        //             this.contentNodeArr[3].active = true;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = false;
        //         } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = true;
        //             // 转让队长
        //             let label = cc.find("Background/Label", this.contentNodeArr[5])
        //             label.getComponent(cc.Label).string="升级组长"
        //             this.createPosition = 31;
        //         }
        //     } else {
        //         if (this.cellItem.position == 41) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             // this.contentNodeArr[4].active = true;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = false;
        //             // // 转让队长
        //             // let label = cc.find("Background/Label", this.contentNodeArr[4])
        //             // label.getComponent(cc.Label).string="转让队长"
        //         } else if ((this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //             // this.contentNodeArr[0].active = true;
        //             // this.contentNodeArr[1].active = true;
        //             // this.contentNodeArr[2].active = true;
        //             // this.contentNodeArr[3].active = true;
        //             // this.contentNodeArr[4].active = false;
        //             // this.contentNodeArr[5].active = false;
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = true;
        //             this.contentNodeArr[5].active = false;
        //             // 转让队长
        //
        //             let label = cc.find("Background/Label", this.contentNodeArr[4])
        //
        //             if (this.cellItem.position == 31) {
        //                 label.getComponent(cc.Label).string="转让组长"
        //             } else if (this.cellItem.position == 21) {
        //                 label.getComponent(cc.Label).string="转让小组长"
        //             } else if (this.cellItem.position == 11) {
        //                 label.getComponent(cc.Label).string="转让推荐人"
        //             }
        //         } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = true;
        //             // 转让队长
        //             let label = cc.find("Background/Label", this.contentNodeArr[5])
        //             label.getComponent(cc.Label).string="升级组长"
        //             this.createPosition = 31;
        //         }
        //     }
        //     // if (this.cellItem.position == 41) {
        //     //     this.contentNodeArr[0].active = false;
        //     //     this.contentNodeArr[1].active = false;
        //     //     this.contentNodeArr[2].active = false;
        //     //     this.contentNodeArr[3].active = false;
        //     //     this.contentNodeArr[4].active = true;
        //     //     this.contentNodeArr[5].active = false;
        //     //     // 转让队长
        //     //     let label = cc.find("Background/Label", this.contentNodeArr[4])
        //     //     label.getComponent(cc.Label).string="转让队长"
        //     // } else if ((this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //     //     this.contentNodeArr[0].active = true;
        //     //     this.contentNodeArr[1].active = true;
        //     //     this.contentNodeArr[2].active = true;
        //     //     this.contentNodeArr[3].active = true;
        //     //     this.contentNodeArr[4].active = false;
        //     //     this.contentNodeArr[5].active = false;
        //     //
        //     // } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //     //     this.contentNodeArr[0].active = false;
        //     //     this.contentNodeArr[1].active = false;
        //     //     this.contentNodeArr[2].active = false;
        //     //     this.contentNodeArr[3].active = false;
        //     //     this.contentNodeArr[4].active = false;
        //     //     this.contentNodeArr[5].active = true;
        //     //     // 转让队长
        //     //     let label = cc.find("Background/Label", this.contentNodeArr[5])
        //     //     label.getComponent(cc.Label).string="升级组长"
        //     //     this.createPosition = 31;
        //     // }
        // } else if (curPosition == 31) {
        //     // if (this.cellItem.position == 31) {
        //     //     this.contentNodeArr[0].active = false;
        //     //     this.contentNodeArr[1].active = false;
        //     //     this.contentNodeArr[2].active = false;
        //     //     this.contentNodeArr[3].active = false;
        //     //     this.contentNodeArr[4].active = true;
        //     //     this.contentNodeArr[5].active = false;
        //     //
        //     //     // 转让组长
        //     //     let label = cc.find("Background/Label", this.contentNodeArr[4])
        //     //     label.getComponent(cc.Label).string="转让组长"
        //     // } else if ((this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //     //     this.contentNodeArr[0].active = true;
        //     //     this.contentNodeArr[1].active = true;
        //     //     this.contentNodeArr[2].active = true;
        //     //     this.contentNodeArr[3].active = true;
        //     //     this.contentNodeArr[4].active = false;
        //     //     this.contentNodeArr[5].active = false;
        //     //
        //     // } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //     //     this.contentNodeArr[0].active = false;
        //     //     this.contentNodeArr[1].active = false;
        //     //     this.contentNodeArr[2].active = false;
        //     //     this.contentNodeArr[3].active = false;
        //     //     this.contentNodeArr[4].active = false;
        //     //     this.contentNodeArr[5].active = true;
        //     //     // 转让队长
        //     //     let label = cc.find("Background/Label", this.contentNodeArr[5])
        //     //     label.getComponent(cc.Label).string="升级小组长"
        //     //     this.createPosition = 21;
        //     // }
        //     // 有组
        //     if (cellItem.teamNo > 0) {
        //         if ((this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //             this.contentNodeArr[0].active = true;
        //             this.contentNodeArr[1].active = true;
        //             this.contentNodeArr[2].active = true;
        //             this.contentNodeArr[3].active = true;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = false;
        //         } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = true;
        //             // 转让队长
        //             let label = cc.find("Background/Label", this.contentNodeArr[5])
        //             label.getComponent(cc.Label).string="升级组长"
        //             this.createPosition = 31;
        //         }
        //     } else {
        //         if (this.cellItem.position == 41) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             // this.contentNodeArr[4].active = true;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = false;
        //             // // 转让队长
        //             // let label = cc.find("Background/Label", this.contentNodeArr[4])
        //             // label.getComponent(cc.Label).string="转让队长"
        //         } else if ((this.cellItem.position == 31) || (this.cellItem.position == 21) || (this.cellItem.position == 11)) {
        //             // this.contentNodeArr[0].active = true;
        //             // this.contentNodeArr[1].active = true;
        //             // this.contentNodeArr[2].active = true;
        //             // this.contentNodeArr[3].active = true;
        //             // this.contentNodeArr[4].active = false;
        //             // this.contentNodeArr[5].active = false;
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = true;
        //             this.contentNodeArr[5].active = false;
        //             // 转让队长
        //
        //             let label = cc.find("Background/Label", this.contentNodeArr[4])
        //
        //             if (this.cellItem.position == 31) {
        //                 label.getComponent(cc.Label).string="转让组长"
        //             } else if (this.cellItem.position == 21) {
        //                 label.getComponent(cc.Label).string="转让小组长"
        //             } else if (this.cellItem.position == 11) {
        //                 label.getComponent(cc.Label).string="转让推荐人"
        //             }
        //         } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //             this.contentNodeArr[0].active = false;
        //             this.contentNodeArr[1].active = false;
        //             this.contentNodeArr[2].active = false;
        //             this.contentNodeArr[3].active = false;
        //             this.contentNodeArr[4].active = false;
        //             this.contentNodeArr[5].active = true;
        //             // 转让队长
        //             let label = cc.find("Background/Label", this.contentNodeArr[5])
        //             label.getComponent(cc.Label).string="升级组长"
        //             this.createPosition = 31;
        //         }
        //     }
        // } else if (curPosition == 21) {
        //     if (this.cellItem.position == 21) {
        //         this.contentNodeArr[0].active = false;
        //         this.contentNodeArr[1].active = false;
        //         this.contentNodeArr[2].active = false;
        //         this.contentNodeArr[3].active = false;
        //         this.contentNodeArr[4].active = true;
        //         this.contentNodeArr[5].active = false;
        //
        //         // 转让小组长
        //         let label = cc.find("Background/Label", this.contentNodeArr[4])
        //         label.getComponent(cc.Label).string="转让小组长"
        //     } else if (this.cellItem.position == 11) {
        //         this.contentNodeArr[0].active = true;
        //         this.contentNodeArr[1].active = true;
        //         this.contentNodeArr[2].active = true;
        //         this.contentNodeArr[3].active = true;
        //         this.contentNodeArr[4].active = false;
        //         this.contentNodeArr[5].active = false;
        //
        //     } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //         this.contentNodeArr[0].active = false;
        //         this.contentNodeArr[1].active = false;
        //         this.contentNodeArr[2].active = false;
        //         this.contentNodeArr[3].active = false;
        //         this.contentNodeArr[4].active = false;
        //         this.contentNodeArr[5].active = true;
        //         // 转让队长
        //         let label = cc.find("Background/Label", this.contentNodeArr[5])
        //         label.getComponent(cc.Label).string="升级推荐人"
        //         this.createPosition = 11;
        //     }
        // } else if (curPosition == 11) {
        //     if (this.cellItem.position == 11) {
        //         this.contentNodeArr[0].active = false;
        //         this.contentNodeArr[1].active = false;
        //         this.contentNodeArr[2].active = false;
        //         this.contentNodeArr[3].active = false;
        //         this.contentNodeArr[4].active = true;
        //         this.contentNodeArr[5].active = false;
        //
        //         // 转让推荐人
        //         let label = cc.find("Background/Label", this.contentNodeArr[4])
        //         label.getComponent(cc.Label).string="转让推荐人"
        //     } else if ((this.cellItem.position == 51) || (this.cellItem.position == 1)) {
        //         // 没有操作了
        //     }
        // }
    }

    start () {

    }

    doClosePop() {
        this.node.active = false;
    }

    doBtnClicked(event, clickIndex) {
        cc.dlog('战队添加按钮点击', clickIndex)

        // @ts-ignore
        cc.g.utils.btnShake();

        if (clickIndex == 1) { // 统计明细
            this.doClosePop()
            // TeaChenYuan.instance.doShowChengYuanZdAddDialog()
        } else if (clickIndex == 2) { // 分配人员
            this.doClosePop()
            // // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
            TeaChenYuan.instance.zdSearchType = 3
            TeaChenYuan.instance.doShowChengYuanZdAddDialogTwo()
        } else if (clickIndex == 3) { // 次数清零
            this.doClosePop()
            TeaChenYuan.instance.doShowZhanDuiCsqlDialog()
        } else if (clickIndex == 4) { // 反比设置
            cc.dlog('反比设置....')
            this.doClosePop()
            TeaChenYuan.instance.doShowFanBiDialog(false)
        } else if (clickIndex == 5) { // 转让队长
            this.doClosePop()
            TeaChenYuan.instance.curUserId = this.cellItem.userId
            TeaChenYuan.instance.zdSearchType = 2
            TeaChenYuan.instance.doShowChengYuanZdAddDialogTwo()
        } else if (clickIndex == 6) { // 升级小组长
            this.doClosePop()
            // int32   teaHouseId = 1;//茶馆Id
            // int32   parentTeamId =2;//上级战队Id
            // int64   destUserId =3;//目标用户唯一Id
            // int32   destPosition=4;//目标用户职位(队长=41,组长=31,小组长=21,推荐人=11)
            // @ts-ignore
            cc.g.hallMgr.searchZhanDuiAddPerOne(TeaClass.instance.teaHouseId, TeaChenYuan.instance.teamNextId, this.cellItem.userId, TeaChenYuan.instance.createPosition,  (resp)=>{
                this.doClosePop()
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    if (resp.err == 1000) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doGetRefreshList();
                    }
                } else {
                    // // @ts-ignore
                    // cc.g.global.hint('操作失败');
                }
            });
        } else if (clickIndex == 7) { // 警戒线
            cc.dlog('警戒线....')
            this.doClosePop()
            TeaChenYuan.instance.doShowJJXDialog(this.cellItem)
        }
    }

    // update (dt) {}
}
