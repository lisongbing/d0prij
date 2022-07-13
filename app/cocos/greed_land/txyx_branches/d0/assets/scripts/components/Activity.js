cc.Class({
    extends: cc.Component,

    properties: {
        activityTab: {
            type: cc.Prefab,
            default: null,
        },
        activityPages: {
            type: [cc.Prefab],
            default: [],
        },
    },
    onLoad: function () {
        this.tabListNode = this.node.getChildByName('list');
        this.pagesNode = this.node.getChildByName('pages');
    },

    init: function () {
        this.updateActivityList();
    },

    updateActivityList: function () {
        this.tabListNode.destroyAllChildren();
        this.pagesNode.destroyAllChildren();
        let activityList = cc.g.hallMgr.activityList;
        for (let i = 0; i < activityList.length; i++) {
            let tab = cc.instantiate(this.activityTab);
            tab.name = activityList[i].actionId.toString();
            tab.getChildByName('title').getComponent(cc.Label).string = activityList[i].title;
            if (i === 0) {
                tab.getComponent(cc.Toggle).isChecked = true;//默认选中第一个
               this.createActivityPage(activityList[i], true);
            }
            else {
                tab.getComponent(cc.Toggle).isChecked = false;
                this.createActivityPage(activityList[i], false);
            }
            cc.g.utils.addCheckEvent(tab, this.node, 'Activity', 'onClickActivityTab', activityList[i]);
            this.tabListNode.addChild(tab);
        }
    },

    createActivityPage: function (activityInfo, show) {
        let pageNode = cc.instantiate(this.activityPages[activityInfo.type]);
        pageNode.active = show;
        pageNode.name = activityInfo.actionId.toString();
        if(activityInfo.type === 0) {//类型0 输赢排行榜
            let titleNode = pageNode.getChildByName('title');
            if(activityInfo.img === '') {
                titleNode.active = false;
            }
            else {
                cc.g.utils.setUrlTexture(titleNode.getComponent(cc.Sprite), activityInfo.img, 'png');
            }
            let content = activityInfo.content;
            if(cc.sys.os === cc.sys.OS_IOS) {//Fix文本在ios中显示错乱的问题
                if(content != null) {
                    content = content.replace(/\r\n/g, '\n');
                }
            }
            pageNode.getChildByName('content').getComponent(cc.RichText).string = content;
            cc.g.utils.addClickEvent(pageNode.getChildByName('btn_view_rank'), this.node, 'Activity', 'onClickActivityRank', activityInfo);
        }
        this.pagesNode.addChild(pageNode);
    },

    onClickActivityTab: function (toggle, activityInfo) {
        if(!toggle.isChecked) {
            return;
        }
        for(let i = 0; i < this.pagesNode.childrenCount; i++) {
            if(parseInt(this.pagesNode.children[i].name) === activityInfo.actionId) {
                this.pagesNode.children[i].active = true;
            }
            else {
                this.pagesNode.children[i].active = false;
            }
        }
    },

    onClickActivityRank: function (event, activityInfo) {
        cc.g.hallMgr.hall.showMenu('rank').getComponent('Rank').init(activityInfo.actionId);
    },

    onClickClose: function () {
        this.node.active = false;
    },

    update: function (dt) {
    },
});
