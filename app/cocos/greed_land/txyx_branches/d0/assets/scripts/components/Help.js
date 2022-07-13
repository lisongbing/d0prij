cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        this.scrollView = this.node.getChildByName('ScrollView').getComponent(cc.ScrollView);
        this.ruleText = this.scrollView.content.getChildByName('text').getComponent(cc.RichText);
        this.defaultHeight = this.scrollView.content.height;
    },

    init: function (type) {
        let helpConfig = cc.g.utils.getJson('help');
        if(helpConfig[type] != null) {
            this.ruleText.string = helpConfig[type].RULE;
        }
        else {
            this.ruleText.string = '';
        }
        this.scrollView.content.height = Math.max(this.defaultHeight, this.ruleText.node.height + 30);
        this.scrollView.scrollToTop(0);
    },

    onClickClose: function () {
        this.node.active = false;
    },
});
