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
export default class ChenYuanZhanDui extends cc.Component {

    private contentNode: cc.Node;
    private contentNodeArr: any[] = [];
    private isNext: boolean = false;
    // @property(cc.Label)
    // label: cc.Label = null;
    //
    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initViews();
    }

    doClosePop() {
        cc.dlog('ChenYuanZhanDui...')
        //
        this.node.active = false;
    }

    initViews () {
        // 滑动content
        this.contentNode = cc.find("Node_Content/Node_Menus", this.node)
        for (let i = 0; i < 4; i++) {
            let contNode = this.contentNode.getChildByName("Button_Setting" + (i + 1))
            contNode.active = false;
            this.contentNodeArr.push(contNode)
        }
    }

    start () {

    }

    showBtnsByPostion(position, isNext) {
        this.isNext = isNext
        // 反比设置
        // 圈主/超管 登录，只显示 添加战队
        // 圈主、超管、队长、组长、小组长、推荐人

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (position == 71 || position==61) {
            if (isNext) {
                this.contentNodeArr[0].active = false;
                this.contentNodeArr[1].active = true;
                this.contentNodeArr[2].active = true;
                this.contentNodeArr[3].active = false;
                // this.isUseNextTeamId = true
            } else {
                this.contentNodeArr[0].active = true;
                this.contentNodeArr[1].active = false;
                this.contentNodeArr[2].active = false;
                this.contentNodeArr[3].active = true;
                // this.isUseNextTeamId = false
            }

        } else if (position == 51 || position==41|| position==31|| position==21|| position==11) {
            if (isNext) {
                this.contentNodeArr[0].active = false;
                this.contentNodeArr[1].active = true;
                this.contentNodeArr[2].active = true;
                this.contentNodeArr[3].active = false;
                // this.isUseNextTeamId = true

            } else {
                this.contentNodeArr[0].active = false;
                this.contentNodeArr[1].active = true;
                this.contentNodeArr[2].active = false;
                // this.isUseNextTeamId = false
                if (position == 51) {
                    this.contentNodeArr[3].active = false;
                } else {
                    this.contentNodeArr[3].active = true;
                }
            }
        }

        // // 反比设置
        // // 圈主/超管 登录，只显示 添加战队
        // //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        // let isGoldOpen = TeaClass.instance.SettingData['isGoldOpen']
        // if (isGoldOpen) {
        //     if (position == 71 || position==61 || position==41|| position==31|| position==21) {
        //         this.contentNodeArr[3].active = true;
        //     } else {
        //         this.contentNodeArr[3].active = false;
        //     }
        // } else {
        //     this.contentNodeArr[3].active = false;
        // }
    }

    doBtnClicked(event, clickIndex) {
        cc.dlog('战队添加按钮点击', clickIndex)

        // @ts-ignore
        cc.g.utils.btnShake();

        if (clickIndex == 1) {
            this.doClosePop()
            cc.dlog('添加战队....')
            // // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
            TeaChenYuan.instance.zdSearchType = 1
            TeaChenYuan.instance.doShowChengYuanZdAddDialogTwo()
        } else if (clickIndex == 2) { // 次数清零
            cc.dlog('次数清零....')
            this.doClosePop()
            TeaChenYuan.instance.doShowZhanDuiCsqlDialog()
        } else if (clickIndex == 3) { // 分配成员
            cc.dlog('分配成员....')
            this.doClosePop()
            TeaChenYuan.instance.zdSearchType = 3
            // // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
            TeaChenYuan.instance.doShowChengYuanZdAddDialogTwo()
        } else if (clickIndex == 4) { // 清除直属
            cc.dlog('清除直属....')
            this.doClosePop()
            // @ts-ignore
            cc.g.hallMgr.searchQinChuZhiShu(TeaClass.instance.teaHouseId, TeaChenYuan.instance.teamNextId, (resp)=>{
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    if (resp.err == 1000) {
                        // @ts-ignore
                        cc.g.global.hint('操作成功');
                        // 重新获取数据
                        TeaChenYuan.instance.doRealSearchZhanDuiList()
                    }
                } else {
                    // // @ts-ignore
                    // cc.g.global.hint('操作失败');
                }
            });
        }
    }

    // update (dt) {}
}
