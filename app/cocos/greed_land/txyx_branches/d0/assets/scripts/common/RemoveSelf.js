
cc.Class({
    extends: cc.Component,

    properties: {
        isRemove: {
            default: true,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.isRemove)
        {
            this.node.removeFromParent();
        }
    },

    start () {

    },

    // update (dt) {},
});
