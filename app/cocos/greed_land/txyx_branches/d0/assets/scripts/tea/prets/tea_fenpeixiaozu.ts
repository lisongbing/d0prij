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
export default class TeaFenPeiCy extends cc.Component {
    @property(cc.Prefab)
    fenzuItemPre: cc.Prefab = null;
    pItem: any = null;
    mainScrollView: cc.ScrollView = null;
    private curItem: any = null;
    private curTarNode: any = null;

    onLoad () {
        this.initViews()
    }

    initViews () {
        this.mainScrollView = cc.find("List_ScrollView", this.node).getComponent(cc.ScrollView);
    }

    doRemoveAllItems() {
        this.mainScrollView.content.removeAllChildren(true);
    }
    showUiDatas(dataArr: any, pItem) {
        this.pItem = pItem;
        this.doRemoveAllItems();
        // 头像
        let headerImage = cc.find("com_mask_head0", this.node).getComponent(cc.Sprite);
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);
        // if (pItem.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
        // }
        // else {
        //     let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     headerImage.spriteFrame = spriteFrame;
        // }

        let Label_Name = cc.find("Label_Name", this.node).getComponent(cc.Label);
        Label_Name.string = pItem.name

        let Label_ID = cc.find("Label_ID", this.node).getComponent(cc.Label);
        Label_ID.string = pItem.userId

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.fenzuItemPre);

                let jrBtn = cc.find("Item_Button", cardNode).getComponent(cc.Button);

                let btnLabel = cc.find("Name_Label", jrBtn.node).getComponent(cc.Label);
                btnLabel.string = pItem.teamNo + '队'

                let sprite_Normal = cc.find("Sprite_Normal", jrBtn.node)
                sprite_Normal.active = true
                let sprite_Select = cc.find("Sprite_Select", jrBtn.node)
                sprite_Select.active = false
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(jrBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(jrBtn, this, 'tea_fenpeixiaozu', 'doClickItemBtn', pItem);

                // add
                this.mainScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    start () {

    }

    doClickItemBtn (event, item) {
        cc.dlog('点击分组按钮....');

        // @ts-ignore
        cc.g.utils.btnShake();

        let tarNode = event.target;
        if (this.curTarNode != null) {
            let sprite_Normal = cc.find("Sprite_Normal", this.curTarNode)
            sprite_Normal.active = true
            let sprite_Select = cc.find("Sprite_Select", this.curTarNode)
            sprite_Select.active = false
        }

        let sprite_Normal = cc.find("Sprite_Normal", tarNode)
        sprite_Normal.active = false
        let sprite_Select = cc.find("Sprite_Select", tarNode)
        sprite_Select.active = true
        //
        // let btnSprtTwo = tarNode.getChildByName("Background").getComponent(cc.Sprite);//cc.find("Background", tarNode).getComponent(cc.Sprite)
        // let spriteFrameTwo = TeaClass.instance.commnetAtlas0.getSpriteFrame('combtn_09');
        // btnSprtTwo.spriteFrame = spriteFrameTwo;
        this.curItem = item;
        this.curTarNode = tarNode
    }

    doClosePop() {
        this.node.active = false;
    }

    doClickOkBtn() {
        // @ts-ignore
        cc.g.utils.btnShake();

        if (this.curItem == null) {
            // @ts-ignore
            cc.g.global.hint('请选择小组');
            return
        }
        // int32   teaHouseId = 1;//茶馆Id
        // int32   teamId =2;//上级战队Id
        // int64   destUserId =3;//目标用户唯一Id
        // @ts-ignore
        cc.g.hallMgr.searchZhanDuiFpCy(TeaClass.instance.teaHouseId, this.curItem.teamId, this.pItem.userId, (resp)=>{
            this.doClosePop();
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.hint('操作成功');
                // 重新获取数据
                TeaChenYuan.instance.doGetListDatas();
            } else {
                // @ts-ignore
                cc.g.global.hint('操作失败');
            }
        });
    }

    // update (dt) {}
}
