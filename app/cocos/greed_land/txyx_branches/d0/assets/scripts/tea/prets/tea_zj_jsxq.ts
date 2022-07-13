// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZjieSuanDetail extends cc.Component {

    @property(cc.Prefab)
    cellPre: cc.Prefab = null;

    @property(cc.Prefab)
    cellItemPre: cc.Prefab = null;

    // pItem: any = null;
    listScrollView: cc.ScrollView = null;
    // GameLabel: cc.Label = null;
    // Gmae_IdLabel: cc.Label = null;
    // GmaeTimeLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    clearCache() {
        cc.sys.localStorage.removeItem("NavTabKey")
        cc.sys.localStorage.removeItem("WeekIndex")
        cc.sys.localStorage.removeItem("ClickedZjVideo")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatasxy")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatas")
    }

    doClosePop() {
        cc.dlog('onBtnClose');
        this.node.active = false;
        // this.clearCache()
    }

    onLoad () {
        this.initViews()
    }

    initViews() {
        this.listScrollView = cc.find("ListScrollView", this.node).getComponent(cc.ScrollView);

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

    showUiDatas(celldata) {
        this.doRenderLeftListView(celldata);
    }

    doRenderLeftListView(celldata) {
        this.listScrollView.content.removeAllChildren(true);

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(celldata.detailList)) {
            // 显示数据
            let jueIndex = 0;
            celldata.detailList.forEach((pItem, key) => {
                cc.dlog('pItem', pItem);

                let cardNode = cc.instantiate(this.cellPre);

                // @ts-ignore
                let deskName = cc.g.utils.getGameName(celldata.gameType, celldata.origin);

                let Game_Label = cc.find("Node_Content/Game_Sprite_Bg/Game_Label", cardNode).getComponent(cc.Label);
                Game_Label.string = deskName

                let JueLabel = cc.find("Node_Content/JueLabel", cardNode).getComponent(cc.Label);
                JueLabel.string = "第"+(jueIndex + 1)+"局"

                let TimerLabel = cc.find("Node_Content/TimerLabel", cardNode).getComponent(cc.Label);
                // @ts-ignore
                //TimerLabel.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(i64v(celldata.start.low)*1000));
                //TimerLabel.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(i64v(celldata.fightTime[jueIndex].endTime.low)*1000));
                if (celldata.fightTime && celldata.fightTime[jueIndex]) {
                    // @ts-ignore
                    let t = new Date(i64v(celldata.fightTime[jueIndex].endTime.low)*1000);
                    // @ts-ignore
                    TimerLabel.string = cc.g.utils.getFormatTimeXXX(t, '|M|.|D| |h|:|m|:|s|');
                } else {
                    TimerLabel.string = '???';
                }
                

                let RoomLabel = cc.find("Node_Content/RoomLabel", cardNode).getComponent(cc.Label);
                RoomLabel.string = "房号:"+celldata.roomId

                let contentScrollView = cc.find("Node_Content/ItemScrollView", cardNode).getComponent(cc.ScrollView);

                let userIndex = 0;
                celldata.usrList.forEach((titem) => {
                    let cardCellNode = cc.instantiate(this.cellItemPre);
                    let NameLabel = cc.find("Node_Content/NameLabel", cardCellNode).getComponent(cc.Label);
                    // @ts-ignore
                    NameLabel.string = cc.g.utils.getFormatName(titem.name, 3*2);

                    let IdLabel = cc.find("Node_Content/IdLabel", cardCellNode).getComponent(cc.Label);
                    IdLabel.string = titem.uid.low;

                    let ScoreLabel = cc.find("Node_Content/ScoreLabel", cardCellNode).getComponent(cc.Label);
                    // ScoreLabel.string = pItem.fight[userIndex];

                    // i64v();
                    let fight = pItem.fight[userIndex].low//pItem.fight[userIndex];
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

                    contentScrollView.content.addChild(cardCellNode, 0);

                    userIndex++;
                })

                let playButton = cc.find("Node_Content/playButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(playButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(playButton, this, 'tea_zj_jsxq', 'doPalyerBtnClicked', 
                    {
                        id:celldata.replayIds[jueIndex],
                        gm:celldata.gameType,
                        origin:celldata.origin,
                    }
                );

                let Share_Button = cc.find("Node_Content/Share_Button", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(Share_Button);
                // @ts-ignore
                cc.g.utils.addClickEvent(Share_Button, this, 'tea_zj_jsxq', 'doShareBtnClicked', pItem);

                jueIndex++;

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

    doPalyerBtnClicked(evt, itm) {
        cc.dlog('doPalyerBtnClicked...', itm);

        cc.sys.localStorage.setItem("ClickedZjVideo", "YES");

        // @ts-ignore
        cc.g.utils.btnShake();
        // @ts-ignore
        cc.g.hallMgr.tryPlaybBack({
            replayId:itm.id,
            gameType:itm.gm,
            origin:itm.origin,
            clubId: TeaClass.instance.teaHouseId,
            //idx:null,
            //clubId:this.clubInfo ? this.clubInfo.clubId : null,
            //bjID:this.clubInfo ? this.bjuid : null,
        });
    }

    // update (dt) {}
}
