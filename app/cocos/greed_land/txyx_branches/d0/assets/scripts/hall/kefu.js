
cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '客服';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },

    start () {

    },

    // update (dt) {},



    init: function () {
        this.initView();
    },

    initView: function () {
        let r = cc.find("Node_ctt", this.node);

        // 微信号
        this.Label_wxh = cc.find("Node_wxh/Label_wxh", r)
        if (this.Label_wxh) {
            this.Label_wxh = this.Label_wxh.getComponent(cc.Label);
            this.Label_wxh.string = GameConfig.complainWX;
        }
    },


    up: function () {
    },


    // 关闭
    onBtnClose: function (event, customEventData) {
        //cc.g.utils.btnShake();
        this.node.removeFromParent();
        this.node.destroy();
    },

    // 复制微信
    onBtnCopyWx: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnCopyWx 复制微信'));

        cc.g.utils.btnShake();

        this.node.active = false;

        let res = cc.g.utils.setPasteboard(GameConfig.complainWX);
        if (res) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制成功');
        } else {
            //cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制失败');
        }
    },
});
