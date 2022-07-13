cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        this.wxLabel = this.node.getChildByName('wxLabel');
        this.websiteLabel = this.node.getChildByName('websiteLabel');
    },

    init: function () {
        this.wxLabel.getComponent(cc.Label).string = GameConfig.complainWX;
        this.websiteLabel.getComponent(cc.Label).string = GameConfig.officialWebsite;
    },

    onClickClose: function () {
        this.node.active = false;
    },

    onClickCopyWX: function() {
        if (cc.g.utils.setPasteboard(GameConfig.complainWX)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制成功。');
        }
    },

    onClickCopyWebsite: function() {
        if (cc.g.utils.setPasteboard(GameConfig.officialWebsite)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制成功。');
        }
    }
});
