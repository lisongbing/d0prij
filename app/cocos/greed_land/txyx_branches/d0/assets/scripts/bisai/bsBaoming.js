
cc.Class({
    extends: cc.Component,

    properties: {
        // 奖励
        pfJiangliItm: {
            default: null,
            type: cc.Prefab,
        },
        // 规则
        pfRuleItm: {
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

        // 排名 1 2 3
        this.Sprite_pm1 = cc.find('Sprite_pm1', r).getComponent(cc.Sprite);
        this.Sprite_pm1.jpname = cc.find('Sprite_pm1/Label_name', r).getComponent(cc.Sprite);
        this.Sprite_pm2 = cc.find('Sprite_pm2', r).getComponent(cc.Sprite);
        this.Sprite_pm2.jpname = cc.find('Sprite_pm2/Label_name', r).getComponent(cc.Sprite);
        this.Sprite_pm3 = cc.find('Sprite_pm3', r).getComponent(cc.Sprite);
        this.Sprite_pm3.jpname = cc.find('Sprite_pm3/Label_name', r).getComponent(cc.Sprite);

        // 名次奖励
        this.sv_paimin = cc.find('ScrollView_paimin', r).getComponent(cc.ScrollView);
        this.sv_paimin.content.destroyAllChildren();

        // 比赛时间
        this.Label_time = cc.find('Label_time', r).getComponent(cc.Label);
        // 比赛费用
        this.Label_cost = cc.find('Label_cost', r).getComponent(cc.Label);
        // 报名人数
        this.Label_renshu = cc.find('Label_renshu', r).getComponent(cc.Label);

        // 比赛规则
        this.sv_rule = cc.find('ScrollView_rule', r).getComponent(cc.ScrollView);
        this.sv_rule.content.destroyAllChildren();
        
        // 免费报名 退赛
        this.Button_mfbm = cc.find('Button_mfbm', r);
        this.Button_tx = cc.find('Button_tx', r);
        

        //this.up();
    },

    up () {
        cc.log('up');

        let ctt = this.sv_paimin.content;
        ctt.destroyAllChildren();

        for (let i = 0; i < 10; ++i) {
            continue;

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
