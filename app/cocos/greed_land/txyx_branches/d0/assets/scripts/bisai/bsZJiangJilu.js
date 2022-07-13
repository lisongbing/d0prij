
cc.Class({
    extends: cc.Component,

    properties: {
        // 记录
        pfJiluItm: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();
    },

    start () {

    },

    // update (dt) {},

    initView () {
        cc.log('initView');

        let r = this.node;

        // 列表
        this.sv_list = cc.find('ScrollView_list', r).getComponent(cc.ScrollView);
        this.sv_list.content.destroyAllChildren();

        this.up();
    },

    up () {
        cc.log('up');

        let ctt = this.sv_list.content;
        ctt.destroyAllChildren();

        for (let i = 0; i < 10; ++i) {
            let itm = cc.instantiate(this.pfJiluItm);

            // 标题
            let Label_idx = cc.find('Label_idx', itm).getComponent(cc.Label);
            Label_idx.string = i+1;

            // 日期
            let Label_date = cc.find('Label_date', itm).getComponent(cc.Label);
            
            // 描述
            let RichText_desc = cc.find('RichText_desc', itm).getComponent(cc.RichText);

            // 奖品图片
            let bg = cc.find('jpdi/Sprite_jp', itm).getComponent(cc.Sprite);
            

            // 领取 已经领取 联系客服
            let Button_lq = cc.find('Button_lq', itm);
            let Button_ylq = cc.find('Button_ylq', itm);
            let Button_lxkf = cc.find('Button_lxkf', itm);

            ctt.addChild(itm);
        }
    },


    onBtnClose: function (event, customEventData) {
        cc.log('onBtnClose');

        cc.g.utils.btnShake();

        this.node.destroy();
    },
});
