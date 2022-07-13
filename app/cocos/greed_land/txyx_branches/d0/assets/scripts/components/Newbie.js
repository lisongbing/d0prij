cc.Class({
    extends: cc.Component,
    properties: {
    },

    onLoad: function () {

    },

    onClickClose: function () {
        //cc.g.hallMgr.hall.showMenu('notice').getComponent('Notice').init(3);
        this.node.active = false;
    },

});
