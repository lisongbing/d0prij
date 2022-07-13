cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        this.wxLabel = this.node.getChildByName('wxLabel');
    },

    init: function () {
        this.wxLabel.getComponent(cc.Label).string = GameConfig.complainWX;
    },

    onClickCopyWX: function() {
        if (cc.g.utils.setPasteboard(GameConfig.complainWX)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制成功。');
        }
    },

    onClickClose: function () {
        this.node.active = false;
    }
});
