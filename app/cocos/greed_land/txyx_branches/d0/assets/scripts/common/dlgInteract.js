
cc.Class({
    extends: cc.Component,

    properties: {
        // 预制
        emoPf: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '玩家互动';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // update (dt) {},


    /* ================================================================================================================= */
    
    init: function (player) {
        this.player = player;
        this.initView();
        this.upView();
    },

    initView: function () {
        let r = cc.find("Node_ctt", this.node);

        // 头像
        this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", r).getComponent(cc.Sprite);
        // 性别
        this.Sprite_sex = cc.find("Sprite_sex", r).getComponent(cc.Sprite);
        // 名字
        this.Label_name = cc.find("Label_name", r).getComponent(cc.Label);
        // 货币
        this.Sprite_coin = cc.find("Sprite_1/Sprite_coin", r).getComponent(cc.Sprite);
        this.Label_coin = cc.find("Sprite_1/Label_coin", r).getComponent(cc.Label);

        // 表情列表
        this.hbox_emoji = cc.find("hbox_emoji", r);
    },

    upView: function() {
        let player = this.player;

        if (player) {
            // 头像
            cc.g.utils.setHead(this.Sprite_head, player.icon);
            // 性别
            this.Sprite_sex = cc.g.atlas.com0.getSpriteFrame('com_img_sex'+player.sex);
            // 名字
            this.Label_name.string = player.name;
        }
        
        // 货币
        //this.Sprite_coin = cc.find("Sprite_1/Sprite_coin", itm).getComponent(cc.Sprite);
        //this.Label_coin = cc.find("Sprite_1/Label_coin", itm).getComponent(cc.Sprite);


        // -------------------------------------------------------


        let cfg = cc.g.interactEmoji;

        let ctt = this.hbox_emoji;
        ctt.removeAllChildren();

        for (const k in cfg) {
            let e = cfg[k];

            let itm = cc.instantiate(this.emoPf);

            // 表情
            let Sprite_emoji = cc.find("Sprite_emoji", itm).getComponent(cc.Sprite);
            Sprite_emoji.spriteFrame = cc.g.atlas.interact.getSpriteFrame('hd_img_bq' + e.Idx);

            // 限免
            let Sprite_free = cc.find("Sprite_free", itm);
            Sprite_free.active = false;

            //点击条目
            cc.g.utils.addClickEvent(itm, this.node, 'dlgInteract', 'onBtnEmoji', e);

            ctt.addChild(itm);
        }

        ctt.getComponent(cc.Layout).updateLayout();
    },

    /* ================================================================================================================= */


    /* ================================================================================================================= */

    onClickEmoji: function (fun) {
        this.clickEmojifun = fun;
    },

    onRemoved: function (fun) {
        this.Removedfun = fun;
    },

    /* ================================================================================================================= */


    // 表情
    onBtnEmoji: function (event, emo) {
        cc.log(this.dbgstr('onBtnEmoji 点击表情'));

        let t = Date.now();
        
        cc.log('互动表情 ', t - cc.g.Tylbq);

        if (t - cc.g.Thdbq > 1000*10) {
            cc.g.Thdbq = t;
        } else {
            //cc.g.global.hint('操作频率过快');
            //return;
        }

        if (this.clickEmojifun) {
            this.clickEmojifun(emo);
        }

        this.onBtnClose();
    },

    // 关闭
    onBtnClose: function (event, customEventData) {
       //c.log(this.dbgstr('onBtnClose 关闭'));

        this.node.removeFromParent();

        if (this.Removedfun) {
            this.Removedfun();
        }
    },
});
