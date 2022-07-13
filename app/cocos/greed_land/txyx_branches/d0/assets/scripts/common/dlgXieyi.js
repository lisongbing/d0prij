//const e = require("express");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '用户协议';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        let r = this.node;

        this.Node_ctt = cc.find('Node_ctt', r);

        this.sv_ctt = cc.find('sv_ctt', this.Node_ctt).getComponent(cc.ScrollView);

        this.view = {};
        this.view[1] = cc.find('sv_ctt/view/content/1', this.Node_ctt);
        this.view[2] = cc.find('sv_ctt/view/content/2', this.Node_ctt);
    },

    init: function () {
    },

    onCheckTag: function (event, tag) {
        cc.log('onCheckTag');

        for (const key in this.view) {
            this.view[key].active = false;
        }

        this.view[tag] && (this.view[tag].active = true);

        
        this.sv_ctt.stopAutoScroll();
        this.sv_ctt.scrollToTop(0, false);
    },

    onClickBack: function () {
        //cc.g.utils.btnShake();
        this.node.destroy();
    },
});
