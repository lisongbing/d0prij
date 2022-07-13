// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";
import TeaBmsp from "./tea_gold_bmsp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaMoreClass extends cc.Component {

    static instance: TeaMoreClass = null;

    // @property(cc.Label)
    // label: cc.Label = null;
    //
    // noticeSprite: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        TeaMoreClass.instance = this;

        // let r = this.node;
        // this.noticeSprite = cc.find("Node_Right_View/Node_Btns/Bmsp_Button/Sprite_Notice", r)
        // this.noticeSprite.active = false

        // if (TeaClass.instance.applyGoldMathCount > 0) {
        //     this.doShowNotice(true)
        // } else {
        //     this.doShowNotice(false)
        // }
    }

    doClosePop() {
        this.node.active = false;
    }

    doBtnClicked(event: any, clickIndex: number) {
        cc.dlog('clickIndex==>', clickIndex);

        // @ts-ignore
        cc.g.utils.btnShake();
        
        let ins = TeaClass.instance;

        if (clickIndex == 1) { // 数据
           // ins.doShowTeaJinbiDialog();
        } else if (clickIndex == 2) {// 设置
            // //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            // if ((TeaClass.instance.position == 71) || (TeaClass.instance.position == 61)) {
            //     ins.showDlgSetting('');
            // } else {
            //     // @ts-ignore
            //     cc.g.global.hint('没有操作权限');
            // }

            ins.showDlgSetting('');
        } else if (clickIndex == 3) {// 报名
            ins.showDlgGoldBm();
        } else if (clickIndex == 4) {// 报名审批
            // ins.showDlgBmsp();
        } else if (clickIndex == 5) {// 设置赛场
            ins.showDlgGoldSet();
        } else if (clickIndex == 6) {// 筛选拍桌
            TeaClass.instance.showOrHidenAreaBar();
        }
        
        this.doClosePop();
    }

    start () {

    }

    // doShowNotice(show) {
    //     if (this.noticeSprite != null) {
    //         this.noticeSprite.active = show
    //     }
    // }

    // update (dt) {}

    up () {
        cc.dlog('up');

        let r = this.node;
        let btns = [];
        // btns.push(cc.find('Node_Right_View/Node_Btns/Data_Button', r));
        btns.push(cc.find('Node_Right_View/Node_Btns/Bm_Button', r));
        // btns.push(cc.find('Node_Right_View/Node_Btns/Bmsp_Button', r));
        btns.push(cc.find('Node_Right_View/Node_Btns/Szsc_Button', r));

        // this.noticeSprite = cc.find("Node_Right_View/Node_Btns/Bmsp_Button/Sprite_Notice", r)
        // this.noticeSprite.active = false

        let ins = TeaClass.instance;
        let pos = ins.position;
        let isopen = ins.SettingData['isGoldOpen'];
        let matchFee = ins.goldSetData['matchFee'];
        //btns.forEach(e => e.active = ins.goldSetData['goldMatchAuth']);
        btns.forEach(e => e.active = false);

        if (!isopen) return;

        btns[0].active = isopen;

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (pos==71) {
            btns.forEach(e => e.active = isopen); 
        } else {
            // if (pos==51 || pos==1) {
            //     // btns[0].active = btns[1].active = isopen;
            //     btns[0].active = isopen;
            // }
    
            // if (pos==61 || pos==41 || pos==31 || pos==21 || pos==11) {
            //     // btns[0].active = btns[1].active = btns[2].active = isopen;
            //     // btns[0].active = btns[1].active = isopen;
            //     btns[0].active = isopen;
            // }
        }

        // btns[1].active = matchFee>=0;
        // btns[0].active = matchFee>=0;
    }
}
