
cc.Class({
    extends: cc.Component,

    properties: {
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

        // 姓名
        this.eb_name  = cc.find('EditBox_name', r).getComponent(cc.EditBox);
        this.eb_phone = cc.find('EditBox_phone', r).getComponent(cc.EditBox);
    },

    // 确定
    onBtnOK: function (event, customEventData) {
        cc.log('onBtnOK');

        cc.g.utils.btnShake();

        let name = this.eb_name.string;
        let phone = this.eb_phone.string;

        if (name == '') {
            cc.g.global.hint('名字不能为空');
            return;
        }

        if (phone.length != 11) {
            cc.g.global.hint('电话号码不对 请检查');
            return;
        }

        cc.log('name phone', name, phone);
    },

    onBtnClose: function (event, customEventData) {
        cc.log('onBtnClose');

        cc.g.utils.btnShake();

        this.node.destroy();
    },
});
