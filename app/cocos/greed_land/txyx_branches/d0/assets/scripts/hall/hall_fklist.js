
cc.Class({
    extends: cc.Component,

    properties: {
        //
        item: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bg = cc.find('Sprite_bg', this.node);
        this.list = cc.find('Sprite_bg/Node_list', this.node);
    },

    start () {

    },

    // update (dt) {},

    /* ======================================================================================================================== */

    up:function () {
        this.list.removeAllChildren();

        let fkdatas = cc.g.areaInfo.oped;
        let num = 0;
        for (const key in fkdatas) {
            let e = fkdatas[key];
            
            let itm = cc.instantiate(this.item);
            cc.find('Sprite_fk', itm).getComponent(cc.Sprite).spriteFrame = cc.g.atlas.com0.getSpriteFrame('com_img_fk_'+e.id);
            cc.find('Label_num', itm).getComponent(cc.Label).string = cc.g.userMgr.roomCard[e.id-1].toString();

            cc.g.utils.addClickEvent(cc.find('Sprite_clc', itm), this.node, 'hall_fklist', 'onClickItem', e.id);   

            this.list.addChild(itm);
            ++num;
        }

        let line = Math.ceil(num/2); 

        this.bg.height =  line*50 + (line-1)*10 + 10*2;
    },

    onClickItem:function (event, customEventData) {
        cc.g.hallMgr.hall.clcSwallow.beganCall();
        cc.g.hallMgr.hall.changShowRoomCard(customEventData);
    },
});
