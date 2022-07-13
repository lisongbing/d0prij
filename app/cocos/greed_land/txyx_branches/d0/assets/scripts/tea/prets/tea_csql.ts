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
export default class TeaZhanDuiCsql extends cc.Component {

    @property(cc.Prefab)
    csqlItemPre: cc.Prefab = null;

    mainScrollView: cc.ScrollView = null;
    teamId: number = 0;
    zdCsqlItem: any;
    headerImage:cc.Sprite;
    Name_Label:cc.Label;
    ID_Label:cc.Label;
    Zjs_Label:cc.Label;
    Yxjs_Label:cc.Label;
    Dyj_Label:cc.Label;

    clearButtonNode:cc.Node;

    onLoad () {
        this.initViews();
    }

    doClosePop() {
        this.node.active = false;
    }

    initViews () {
        this.clearButtonNode = cc.find("ClearButton", this.node);
        this.clearButtonNode.active = false;
        this.mainScrollView = cc.find("ScrollView_List", this.node).getComponent(cc.ScrollView);
        // 头像
        this.headerImage = cc.find("com_mask_head0", this.node).getComponent(cc.Sprite);
        this.Name_Label = cc.find("Name_Label", this.node).getComponent(cc.Label);
        this.ID_Label = cc.find("ID_Label", this.node).getComponent(cc.Label);
        this.Zjs_Label = cc.find("Zjs_Label", this.node).getComponent(cc.Label);
        this.Yxjs_Label = cc.find("Yxjs_Label", this.node).getComponent(cc.Label);
        this.Dyj_Label = cc.find("Dyj_Label", this.node).getComponent(cc.Label);

        // close btn
        let closeOne = cc.find('CloseButton', this.node)
        let closeTwo = cc.find('CloseButtonMin', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }
    }

    // onEnable () {
    //     this.doGetList();
    // }

    initParms(teamId, pItem) {
        this.teamId = teamId
        this.zdCsqlItem = pItem;

        // //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
            if (pItem.position == 41) {
                this.clearButtonNode.active = true
            } else {
                this.clearButtonNode.active = false
            }
        } else if ((TeaClass.instance.position == 41)) { //成员列表、我的战队
            if (pItem.position == 31) {
                this.clearButtonNode.active = true
            } else {
                this.clearButtonNode.active = false
            }
        } else if (TeaClass.instance.position == 31) {
            if (pItem.position == 21) {
                this.clearButtonNode.active = true
            } else {
                this.clearButtonNode.active = false
            }
        } else if (TeaClass.instance.position == 21) {
            if (pItem.position == 11) {
                this.clearButtonNode.active = true
            } else {
                this.clearButtonNode.active = false
            }
        } else {
            this.clearButtonNode.active = false
        }
    }
    initHeaderView(pItem) {
        cc.dlog('initHeaderView....', pItem)
        // if (pItem.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(this.headerImage, pItem.icon);
        // } else {
        //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     // headerImage.spriteFrame = spriteFrame;
        // }

        // @ts-ignore
        cc.g.utils.setHead(this.headerImage, pItem.icon);

        this.Name_Label.string = pItem.name
        this.ID_Label.string = pItem.userId
    }

    doGetList() {
        // @ts-ignore
        cc.g.hallMgr.searchShuJuQLList(TeaClass.instance.teaHouseId, this.teamId, (resp)=>{
            cc.dlog('收到成员列表数据', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.Zjs_Label.string = resp.totalCount
                this.Yxjs_Label.string = resp.effectCount
                this.Dyj_Label.string = resp.winCount

                this.doRenderListView(resp.list)
            }
        });

        this.initHeaderView(this.zdCsqlItem);
    }

    doRenderListView(dataArr) {
        this.mainScrollView.content.removeAllChildren(true);
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.csqlItemPre);

                let Label_Timer = cc.find("Node_Content/Label_Timer", cardNode).getComponent(cc.Label);
                if (pItem.zeroTime == 0) {
                    Label_Timer.string = '暂无'
                } else {
                    // @ts-ignore
                    Label_Timer.string = cc.g.utils.getFormatTimeNYR(['-','-',' ',':',':',], new Date(pItem.time*1000));
                }

                let Label_JuShu = cc.find("Node_Content/Label_JuShu", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Label_JuShu.string = cc.g.utils.floatFiexed(pItem.totalCount)

                let Label_Eff = cc.find("Node_Content/Label_Eff", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Label_Eff.string = cc.g.utils.floatFiexed(pItem.effectCount)

                let Label_Win = cc.find("Node_Content/Label_Win", cardNode).getComponent(cc.Label);
                // @ts-ignore
                Label_Win.string = cc.g.utils.floatFiexed(pItem.winCount)

                let Label_Name = cc.find("Node_Content/Label_Name", cardNode).getComponent(cc.Label);
                Label_Name.string = pItem.name

                // add
                this.mainScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    start () {

    }

    doClickClearNum(event) {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.doZeroShuJuQL(TeaClass.instance.teaHouseId, this.teamId, (resp)=>{
            cc.dlog('收到成员列表数据', resp)
            this.doClosePop();
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
    }

    // update (dt) {}
}
