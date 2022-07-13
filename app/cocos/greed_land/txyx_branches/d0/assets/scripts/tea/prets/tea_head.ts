// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaHeader extends cc.Component {

    headerImage: cc.Sprite = null;
    NameLabel: cc.Label = null;
    IDLabel: cc.Label = null;
    WayLabel: cc.Label = null;
    DesLabel: cc.Label = null;

    doClosePop() {
        this.node.active = false;
    }

    onLoad () {
        this.initViews()
    }

    initViews () {
        // 头像
        this.headerImage = cc.find("com_mask_head0", this.node).getComponent(cc.Sprite);
        this.NameLabel = cc.find("NameLabel", this.node).getComponent(cc.Label);
        this.IDLabel = cc.find("IDLabel", this.node).getComponent(cc.Label);
        this.WayLabel = cc.find("WayLabel", this.node).getComponent(cc.Label);
        this.DesLabel = cc.find("DesLabel", this.node).getComponent(cc.Label);
    }

    initDatas(pItem) {
        // @ts-ignore
        cc.g.utils.setHead(this.headerImage, pItem.icon);
        // if (pItem.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(this.headerImage, pItem.icon);
        // } else {
        //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     // headerImage.spriteFrame = spriteFrame;
        // }

        this.NameLabel.string = pItem.name;
        this.IDLabel.string = pItem.userId;
        this.WayLabel.string = pItem.reviewerName;
        this.DesLabel.string = pItem.remark;
    }

    start () {

    }

    // update (dt) {}
}
