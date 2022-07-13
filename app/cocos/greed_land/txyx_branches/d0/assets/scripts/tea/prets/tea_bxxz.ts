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
export default class TeaBaoXianZhi extends cc.Component {
    @property(cc.Prefab)
    baoXianItemPre: cc.Prefab = null;
    pItem: any = null;
    leftScrollView: cc.ScrollView = null;
    rightScrollView: cc.ScrollView = null;

    // private leftItem: any = null;
    // private rightItem: any = null;

    private leftArr: any[]  = [];
    private rightArr: any[] = [];

    doClosePop() {
        this.node.active = false;
    }

    onLoad () {
        this.initViews()
    }

    initViews () {
        this.leftScrollView = cc.find("ScrollView_Left", this.node).getComponent(cc.ScrollView);
        this.rightScrollView = cc.find("ScrollView_Right", this.node).getComponent(cc.ScrollView);

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

    showUiDatas(pItem) {
        this.pItem = pItem;
        this.doGetListDatas();
    }

    doRenderLeftListView(dataArr) {
        this.leftArr = dataArr;

        this.leftScrollView.content.removeAllChildren(true);

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.baoXianItemPre);

                let Label_Name = cc.find("Node_Content/Label_Name", cardNode).getComponent(cc.Label);
                Label_Name.string = pItem.name

                let Label_Play_Name = cc.find("Node_Content/Label_Play_Name", cardNode).getComponent(cc.Label);
                let gameType = pItem.gameType
                // let deskName = ''
                // @ts-ignore
                let deskName = cc.g.utils.getGameName(gameType, pItem.origin);
                // // @ts-ignore
                // if (gameType == GMID.XZMJ) {
                //     deskName = '血战麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.HZMJ) {
                //     deskName = '红中麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.YBMJ) {
                //     deskName = '宜宾麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.NYMJ) {
                //     deskName = '宁远麻将';
                //     // @ts-ignore
                // }  else if (gameType == GMID.LZMJ) {
                //     deskName = '泸州麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.NJMJ) {
                //     deskName = '内江麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.PDKNJ) {
                //     deskName = '内江跑得快';
                //     // @ts-ignore
                // } else if (gameType == GMID.PDK) {
                //     deskName = '跑得快';
                //     // @ts-ignore
                // } else if (gameType == GMID.DDZ5) {
                //     deskName = '斗地主';
                //     // @ts-ignore
                // } else if (gameType == GMID.D2) {
                //     deskName = '大贰';
                // }
                Label_Play_Name.string = deskName

                let tyBtn = cc.find("Node_Content/Check_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_bxxz', 'doLeftCheckClicked', pItem);
                // add
                this.leftScrollView.content.addChild(cardNode, 0);
            })
        }
    }
    doLeftCheckClicked(event, item) {
        cc.dlog(item)

        let tarNode = event.target;

        let checkbtnSprt = cc.find("Checked_Sprite", tarNode)
        let unCheckbtnSprt = cc.find("UnChecked_Sprite", tarNode)
        if (item.checked) {
            checkbtnSprt.active = false
            unCheckbtnSprt.active = true
            // let spriteFrame = TeaClass.instance.commnetAtlas2.getSpriteFrame('com_check_20');
            // btnSprt.spriteFrame = spriteFrame;
            item.checked = false;
        } else {
            // let spriteFrame = TeaClass.instance.commnetAtlas2.getSpriteFrame('com_check_21');
            // btnSprt.spriteFrame = spriteFrame;
            checkbtnSprt.active = true
            unCheckbtnSprt.active = false
            item.checked = true;
        }
    }
    doRenderRightListView(dataArr) {
        this.rightArr = dataArr;
        this.rightScrollView.content.removeAllChildren(true);

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.baoXianItemPre);

                let Label_Name = cc.find("Node_Content/Label_Name", cardNode).getComponent(cc.Label);
                Label_Name.string = pItem.name

                let Label_Play_Name = cc.find("Node_Content/Label_Play_Name", cardNode).getComponent(cc.Label);
                let gameType = pItem.gameType
                // @ts-ignore
                let deskName = cc.g.utils.getGameName(gameType, pItem.origin);
                // // @ts-ignore
                // if (gameType == GMID.XZMJ) {
                //     deskName = '血战麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.HZMJ) {
                //     deskName = '红中麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.YBMJ) {
                //     deskName = '宜宾麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.NYMJ) {
                //     deskName = '宁远麻将';
                //     // @ts-ignore
                // }  else if (gameType == GMID.LZMJ) {
                //     deskName = '泸州麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.NJMJ) {
                //     deskName = '内江麻将';
                //     // @ts-ignore
                // } else if (gameType == GMID.PDKNJ) {
                //     deskName = '内江跑得快';
                //     // @ts-ignore
                // } else if (gameType == GMID.PDK) {
                //     deskName = '跑得快';
                //     // @ts-ignore
                // } else if (gameType == GMID.DDZ5) {
                //     deskName = '斗地主';
                //     // @ts-ignore
                // } else if (gameType == GMID.D2) {
                //     deskName = '大贰';
                // }
                Label_Play_Name.string = deskName

                let tyBtn = cc.find("Node_Content/Check_Button", cardNode).getComponent(cc.Button);

                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_bxxz', 'doRightCheckClicked', pItem);
                // add
                this.rightScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    doRightCheckClicked(event, item) {
        cc.dlog(item)
        let tarNode = event.target;

        let checkbtnSprt = cc.find("Checked_Sprite", tarNode)
        let unCheckbtnSprt = cc.find("UnChecked_Sprite", tarNode)
        if (item.checked) {
            checkbtnSprt.active = false
            unCheckbtnSprt.active = true
            // let spriteFrame = TeaClass.instance.commnetAtlas2.getSpriteFrame('com_check_20');
            // btnSprt.spriteFrame = spriteFrame;
            item.checked = false;
        } else {
            // let spriteFrame = TeaClass.instance.commnetAtlas2.getSpriteFrame('com_check_21');
            // btnSprt.spriteFrame = spriteFrame;
            checkbtnSprt.active = true
            unCheckbtnSprt.active = false
            item.checked = true;
        }
    }
    doGetListDatas() {
        // int32 teaHouseId = 1;//茶馆Id
        // int32  teamId =2 ;  //战队Id
        // string   searchId=3;//搜索Id
        // bool    searchUp=4;//true 查询上级 false 查询下级
        // @ts-ignore
        cc.g.hallMgr.getBaoXianList(TeaClass.instance.teaHouseId, this.pItem.userId,  (resp)=>{
            cc.dlog('收到包厢限制数据', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.doRenderLeftListView(resp.limitList)
                this.doRenderRightListView(resp.list)
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    start () {

    }

    doCancelXian() {
        // int32 teaHouseId = 1;//茶馆Id
        // int32  teamId =2 ;  //战队Id
        // string   searchId=3;//搜索Id
        // bool    searchUp=4;//true 查询上级 false 查询下级

        // @ts-ignore
        cc.g.utils.btnShake();

        let list = []
        this.leftArr.forEach((item)=>{
            if (item.checked) {
                list.push(item.floor)
            }
        })

        // @ts-ignore
        if (cc.g.utils.judgeArrayEmpty(list)) {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '请选择');
            return;
        }

        // @ts-ignore
        cc.g.hallMgr.modifyBaoXianList(TeaClass.instance.teaHouseId, this.pItem.userId, false, list, (resp)=>{
            cc.dlog('收到包厢限制数据', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.doRenderLeftListView(resp.limitList)
                this.doRenderRightListView(resp.list)
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    doOkXian() {
        // @ts-ignore
        cc.g.utils.btnShake();

        let list = []
        this.rightArr.forEach((item)=>{
            if (item.checked) {
                list.push(item.floor)
            }
        })

        // @ts-ignore
        if (cc.g.utils.judgeArrayEmpty(list)) {
            // @ts-ignore
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '请选择');
            return;
        }
        // @ts-ignore
        cc.g.hallMgr.modifyBaoXianList(TeaClass.instance.teaHouseId, this.pItem.userId, true, list, (resp)=>{
            cc.dlog('收到包厢限制数据', resp)
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.doRenderLeftListView(resp.limitList)
                this.doRenderRightListView(resp.list)
            } else {
                // @ts-ignore
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '操作失败');
            }
        });
    }

    // update (dt) {}
}
