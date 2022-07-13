// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZjZongFen extends cc.Component {

    @property(cc.Prefab)
    cellItemPre: cc.Prefab = null;

    // pItem: any = null;
    listScrollView: cc.ScrollView = null;
    GameLabel: cc.Sprite = null;
    Gmae_IdLabel: cc.Label = null;
    GmaeTimeLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    doClosePop() {
        this.node.active = false;
    }

    onLoad () {
        this.initViews()
    }

    initViews() {
        this.listScrollView = cc.find("Data_ScrollView", this.node).getComponent(cc.ScrollView);

        this.GameLabel = cc.find("GameLabel", this.node).getComponent(cc.Sprite);
        this.Gmae_IdLabel = cc.find("Gmae_IdLabel", this.node).getComponent(cc.Label);
        this.GmaeTimeLabel = cc.find("GmaeTimeLabel", this.node).getComponent(cc.Label);
    }

    showUiDatas(pItem) {
        // this.pItem = pItem;

        // @ts-ignore
        let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);

        let a = TeaClass.instance.teaAtlas1;
        this.GameLabel.spriteFrame = a.getSpriteFrame('tea1_gn_'+pItem.gameType+'_'+pItem.origin);
        this.Gmae_IdLabel.string = '牌局ID:' + pItem.roomId;
        // @ts-ignore
        this.GmaeTimeLabel.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.start*1000));

        this.doRenderLeftListView(pItem.totalFight);
    }

    findMax(dataArr) {
        // @ts-ignore
        let max = i64v(dataArr[0].fight[0]);

        if(dataArr.length < 2) return max;

        for (let i = 0; i < dataArr.length; i++) {
            // @ts-ignore
            let num = i64v(dataArr[i].fight[0])
            if (num > max) {
                max = num;
            }
        }
        return max;
    }

    doRenderLeftListView(dataArr) {
        this.listScrollView.content.removeAllChildren(true);

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            let max = this.findMax(dataArr);

            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.cellItemPre);

                // 头像
                let headerImage = cc.find("Node_Content/HeaderSprite", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                let Label_Name = cc.find("Node_Content/NameLabel", cardNode).getComponent(cc.Label);
                Label_Name.string = pItem.name

                let IDLabel = cc.find("Node_Content/IDLabel", cardNode).getComponent(cc.Label);
                IDLabel.string = pItem.uid

                // @ts-ignore
                let fight = i64v(pItem.fight[0]);
                
                let ScoreLabel = cc.find("Node_Content/ScoreLabel", cardNode).getComponent(cc.Label);
                // ScoreLabel.string = score
                if (fight > 0) {
                    // @ts-ignore
                    let rfight = cc.g.utils.realNum1(fight);
                    ScoreLabel.string = "+"+rfight
                    // @ts-ignore
                    ScoreLabel.node.color = new cc.color(0xfd,0xff,0x2c,255)
                } else {
                    // @ts-ignore
                    let rfight = cc.g.utils.realNum1(fight);
                    ScoreLabel.string = rfight
                    // @ts-ignore
                    ScoreLabel.node.color = new cc.color(0x74,0xff,0x3d,255)
                }

                let WinLabel = cc.find("Node_Content/WinLabel", cardNode)
                if (fight == max) {
                    WinLabel.active = true;
                } else {
                    WinLabel.active = false;
                }

                // add
                this.listScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    doShareBtnClicked() {
        cc.dlog('doShareBtnClicked...')

        // @ts-ignore
        cc.g.utils.btnShake();
    }

    doCopyBtnClicked() {
        cc.dlog('doCopyBtnClicked...')

        // @ts-ignore
        cc.g.utils.btnShake();
    }

    // update (dt) {}
}
