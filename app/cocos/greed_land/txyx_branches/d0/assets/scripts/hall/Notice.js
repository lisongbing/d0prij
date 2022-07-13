cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
        let o={};

        o['wgxs'] = cc.find('zhuti_wgxs', this.node);

        for (const key in o) {
            o[key].active = false;
        }

        this.ggLayer = o;

        this.onClickClose();
    },

    init: function () {
    },

    onClickClose: function () {
        cc.log('cc.g.ggList', cc.g.ggList);

        if (!cc.g.ggList || cc.g.ggList.length<1) {
            cc.log('没有广告列表数据');
            this.node.destroy();
            return;
        }

        let d = null;
        for (let i = 0; i < cc.g.ggList.length; ++i) {
            const e = cc.g.ggList[i];
            if (e.pop <= 0) {
                d = e;
                break;
            }
        }

        if (!d) {
            cc.log('广告已经都弹过了');
            this.node.destroy();
            return;
        }
        
        if (!this.ggLayer[d.name]) {
            cc.log('找不到广告页面 ', d.name);
            this.node.destroy();
            return;
        }

        this.ggLayer[d.name].active = true;
        ++d.pop;
    },
});

/*
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
        this.noticeNode = this.node.getChildByName('notice');
        this.spreadNode = this.node.getChildByName('spread');
        this.newbieNode = this.node.getChildByName('newbie');
        this.rewardNode = this.node.getChildByName('reward');
        this.menuListNode = this.node.getChildByName('list');
        this.newbieMenuNode = this.menuListNode.getChildByName('newbie');
        this.noticeMenuNode = this.menuListNode.getChildByName('notice');
        this.spreadMenuNode = this.menuListNode.getChildByName('spread');
        this.rewardMenuNode = this.menuListNode.getChildByName('reward');
    },

    init: function (showType, forceRequestNotice) {
        if (showType === 1) {
            this.noticeNode.active = false;
            this.spreadNode.active = true;
            this.newbieNode.active = false;
            this.rewardNode.active = false;
            this.noticeMenuNode.getComponent(cc.Toggle).uncheck();
            this.spreadMenuNode.getComponent(cc.Toggle).check();
            this.newbieMenuNode.getComponent(cc.Toggle).uncheck();
            this.rewardMenuNode.getComponent(cc.Toggle).uncheck();
        }
        else if (showType === 2) {
            this.noticeNode.active = false;
            this.spreadNode.active = false;
            this.newbieNode.active = true;
            this.rewardNode.active = false;
            this.noticeMenuNode.getComponent(cc.Toggle).uncheck();
            this.spreadMenuNode.getComponent(cc.Toggle).uncheck();
            this.rewardMenuNode.getComponent(cc.Toggle).uncheck();
            this.newbieMenuNode.getComponent(cc.Toggle).check();
        }
        else if (showType === 3){
            this.noticeNode.active = false;
            this.spreadNode.active = false;
            this.newbieNode.active = false;
            this.rewardNode.active = true;
            this.noticeMenuNode.getComponent(cc.Toggle).uncheck();
            this.spreadMenuNode.getComponent(cc.Toggle).uncheck();
            this.newbieMenuNode.getComponent(cc.Toggle).uncheck();
            this.rewardMenuNode.getComponent(cc.Toggle).check();
        } else {
            this.noticeNode.active = true;
            this.spreadNode.active = false;
            this.newbieNode.active = false;
            this.rewardNode.active = false;
            this.noticeMenuNode.getComponent(cc.Toggle).check();
            this.spreadMenuNode.getComponent(cc.Toggle).uncheck();
            this.newbieMenuNode.getComponent(cc.Toggle).uncheck();
            this.rewardMenuNode.getComponent(cc.Toggle).uncheck();
        }

        this.setNoticeContent();
        let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
        if (lastPlatform == PB.PLATFORM.GUEST) {
            this.newbieMenuNode.active = true;
        }
        else {
            this.newbieMenuNode.active = false;
        }
        this.setInviteRewardContent();

        this.checkRedDot();
    },

    setNoticeContent: function () {

        if(cc.g.utils.notices == null || cc.g.utils.notices.data == null || cc.g.utils.notices.data.length === 0) {
            this.noticeNode.getChildByName('title').getComponent(cc.RichText).string = '';
            this.noticeNode.getChildByName('content').getComponent(cc.RichText).string = '';
        }
        else {
            this.noticeNode.getChildByName('title').getComponent(cc.RichText).string = cc.g.utils.notices.data[0].title;
            this.noticeNode.getChildByName('content').getComponent(cc.RichText).string = cc.g.utils.notices.data[0].content;
        }
    },

    setInviteRewardContent: function () {
        this.rewardNode.getChildByName('invitedCount').getComponent(cc.Label).string = cc.g.userMgr.shareTotal;
        this.rewardNode.getChildByName('receivedGold').getComponent(cc.Label).string = cc.g.utils.getFormatNumString(REALNUM(cc.g.userMgr.shareAchieve * 500));
        const unreceivedGold =  cc.g.utils.getFormatNumString(REALNUM((cc.g.userMgr.shareTotal - cc.g.userMgr.shareAchieve) * 500));
        this.rewardNode.getChildByName('unreceivedGold').getComponent(cc.Label).string = unreceivedGold;
    },

    receiveRewardSuccess: function () {
        cc.g.userMgr.shareAchieve = cc.g.userMgr.shareTotal;
        this.checkRedDot();
        cc.g.hallMgr.hall.checkRedDot();
        this.setInviteRewardContent();

        cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '奖励领取成功');
    },

    onClickMenu: function (event) {
        if (!event.isChecked) {
            return;
        }
        this.noticeNode.active = false;
        this.spreadNode.active = false;
        this.newbieNode.active = false;
        this.rewardNode.active = false;
        if (event.target.name == this.noticeNode.name) {
            this.noticeNode.active = true;
        }
        else if (event.target.name == this.spreadNode.name) {
            this.spreadNode.active = true;

        }
        else if (event.target.name == this.newbieNode.name) {
            this.newbieNode.active = true;
        }
        else if (event.target.name == this.rewardNode.name) {
            this.rewardNode.active = true;

        }
    },

    onClickApply: function () {
        cc.sys.openURL(GameConfig.applyUrl + '?user_id=' + cc.g.userMgr.userId.toString());
    },

    onClickReceive: function () {
        cc.g.hallMgr.hall.showMenu('spread_reward').getComponent('SpreadReward').init();
        this.node.active = false;
    },


    onClickBind: function () {
        //cc.g.hallMgr.hall.showMenu('personal').getComponent('Personal').init();
        cc.g.userMgr.wxBind();
        //this.node.active = false;
    },

    onClickClose: function () {
        this.node.active = false;
    },

    onClickReceiveGold: function () {
        cc.g.hallMgr.receiveInviteReward();
    },

    checkRedDot: function () {
        //检测红点
        //cc.log(cc.g.userMgr.shareTotal, cc.g.userMgr.shareAchieve);
        if(cc.g.userMgr.checkShareReward()) {
            this.rewardMenuNode.getChildByName('redDot').active = true;
            this.rewardNode.getChildByName('btn_receiveGold').getComponent(cc.Button).interactable = true;

        } else {
            this.rewardMenuNode.getChildByName('redDot').active = false;
            this.rewardNode.getChildByName('btn_receiveGold').getComponent(cc.Button).interactable = false;

        }
    },

    onClickShare: function () {
        cc.g.hallMgr.hall.showMenu('share').getComponent('Share').init();
    }
});

*/