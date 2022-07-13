// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaJrcj extends cc.Component {

    @property(cc.Prefab)
    jrcjCellItem: cc.Prefab = null;

    mainScrollView: cc.ScrollView = null;

    titleLabel: cc.Label = null;
    guiLabel: cc.Label = null;

    jieSanButton: cc.Button = null;
    addButton: cc.Button = null;
    // 点击类型 1 玩法 2 桌子
    clickType: number = 1;

    saveItem: any;

    onLoad () {
        this.initViews();
    }

    initViews () {
        this.mainScrollView = cc.find("GridScrollView", this.node).getComponent(cc.ScrollView);

        this.titleLabel = cc.find("TitleLabel", this.node).getComponent(cc.Label);
        // this.guiLabel = cc.find("GuiLabel", this.node).getComponent(cc.Label);
        this.guiLabel = cc.find("TextScrollView/view/content/GuiLabel", this.node).getComponent(cc.Label);

        this.jieSanButton = cc.find("JieSanButton", this.node).getComponent(cc.Button);
        this.jieSanButton.node.active = false;
        this.addButton = cc.find("AddButton", this.node).getComponent(cc.Button);
    }

    onEnable () {
        // this.doRemoveAllItems();
        // // 显示数据
        // TeaClass.instance.teaRoomDatas.forEach((item) => {
        //     this.showUiDatas(item)
        // })
    }

    doClosePop() {
        this.node.active = false;
    }

    doRemoveAllItems() {
        this.mainScrollView.content.removeAllChildren(true);
    }

    showDataView(item, clickType) {
        cc.dlog('showDataView item-->' + JSON.stringify(item))

        this.saveItem = item
        this.titleLabel.string = item.deskName + ' - ' + item.name

        item.clubId = TeaClass.instance.teaHouseId;
        // @ts-ignore
        let arr = cc.g.utils.convertRuleToString(item);
        let allStr = ''
        let len = arr.length;
        let cuIndex = 0;
        arr.forEach((str)=>{
            // if (cuIndex < (len -1)) {
            //     allStr+=str
            //     allStr+=","
            // }
            // cuIndex++
            allStr+=str
            allStr+=","
        })
        this.guiLabel.string = allStr

        // this.guiLabel.string = item.rule
        this.clickType = clickType;
        this.doRemoveAllItems();
        let dataArr = item.playerList

        if (item.isStart) {
            this.jieSanButton.node.active = true;

            // @ts-ignore
            if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
                // 圈住 管理 有人
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                if ((TeaClass.instance.position == 71) ||
                    (TeaClass.instance.position == 51) ||
                    (TeaClass.instance.position == 41) ||
                    (TeaClass.instance.position == 31) ||
                    (TeaClass.instance.position == 21) ||
                    (TeaClass.instance.position == 11)) {
                    this.jieSanButton.node.active = true
                } else {
                    this.jieSanButton.node.active = false
                }
            }

        } else {
            this.jieSanButton.node.active = false;
        }

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 圈住 管理 有人
            let dIndex = 0;
            // 显示数据
            dataArr.forEach((item) => {
                this.showUiDatas(item, dIndex)
                dIndex++;
            })
        }
    }

    showUiDatas(item: any, dIndex) {
        let cardNode = cc.instantiate(this.jrcjCellItem);

        let headerImage = cc.find("Node_Content/ImgSprite", cardNode).getComponent(cc.Sprite);
        // @ts-ignore
        cc.g.utils.setHead(headerImage, item.icon);
        // if (item.icon.length > 4) {
        //     headerImage.node.active = true
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(headerImage, item.icon);
        // } else {
        //     // headerImage.node.active = false
        //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     // headerImage.spriteFrame = spriteFrame;
        // }
        let TagSprite = cc.find("Node_Content/TagSprite", cardNode)
        if (dIndex == 0) {
            TagSprite.active = true
        } else {
            TagSprite.active = false
        }

        // 局数
        let nameLabel = cc.find("Node_Content/NameLabel", cardNode).getComponent(cc.Label);
        // @ts-ignore
        nameLabel.string = cc.g.utils.getFormatName(item.name, 3*2);

        let IdLabel = cc.find("Node_Content/IdLabel", cardNode).getComponent(cc.Label);
        if ((TeaClass.instance.position == 71) ||
            (TeaClass.instance.position == 61)) {
            IdLabel.string = item.pid
        } else {
            IdLabel.string = ''
        }

        // // 气泡名字
        // let jueName = cc.find("Node_Content/JuLabel", cardNode).getComponent(cc.Label);
        // jueName.string = item.gameNum + "局"

        let jrBtn = cc.find("Node_Content/OutButton", cardNode).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(jrBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(jrBtn, this, 'tea_jrcj', 'doGoOut', item);

        this.mainScrollView.content.addChild(cardNode, 0);
    }

    doGoOut(event, item) {
        cc.dlog('doGoOut...')
        this.goOutBaoJian(item.pid);
    }

    start () {

    }

    doAddGame() {
        cc.dlog('加入游戏...')
        this.doClosePop()
        // @ts-ignore
        cc.g.utils.btnShake();
        if (this.clickType == 1) {
            TeaClass.instance.doRealEnterTeaHall(this.saveItem, 0);
        } else if (this.clickType == 2) {
            TeaClass.instance.doRealEnterGameHall(this.saveItem);
        }
    }

    doJieSanGame() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.goJieSanDesk();
    }

    goOutBaoJian(userId) {
//     //请出茶馆桌子
// //@api:2321,@type:req
//     message KickTeaHouseDeskReq{
//     int32 teaHouseId = 1;//茶馆Id
//     int32 floor = 2;//楼层号(1-50)
//     int32 deskNo = 3;//桌子序号(1-20)
//     int64 userId   = 4;  //被请出者的UId
// }
        const self = this
        // @ts-ignore
        cc.g.hallMgr.doOutBaoJian(TeaClass.instance.teaHouseId, this.saveItem.floor, this.saveItem.deskNo, userId,  (resp)=>{
            cc.dlog('请出茶馆桌子', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                self.doClosePop();
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    goJieSanDesk() {
//     //解散桌子
// //@api:2246,@type:req
//     message DisbandTeaHouseDeskReq{
//     int32 teaHouseId = 1;//茶馆Id
//     int32 floor = 2;//楼层号(1-50)
//     int32 deskNo = 3;//桌子序号(1-20)
//
// }
        const self = this
        // @ts-ignore
        cc.g.hallMgr.doJieSanDesk(TeaClass.instance.teaHouseId, this.saveItem.floor, this.saveItem.deskNo,  (resp)=>{
            cc.dlog('解散桌子', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                self.doClosePop();
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }
}
