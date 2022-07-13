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
export default class TeaZhanDuiCaoZuo extends cc.Component {

    private contentNode: cc.Node;
    private contentNodeArr: any[] = [];
    // private isNext: boolean = false;

    onLoad () {
        this.initViews();
    }

    initViews () {
        // 滑动content
        this.contentNode = cc.find("Node_Content/Node_Menus", this.node)
        for (let i = 0; i < 4; i++) {
            let contNode = this.contentNode.getChildByName("Button_Setting" + (i + 1))
            contNode.active = true;
            this.contentNodeArr.push(contNode)
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
            // // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
            TeaChenYuan.instance.doShowFanBiDialog(true)
        }
    }

    start () {

    }

    // update (dt) {}
}
