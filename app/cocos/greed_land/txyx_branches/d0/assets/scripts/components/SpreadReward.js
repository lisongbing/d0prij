cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        this.rewardNumLabel = this.node.getChildByName('reward_num').getComponent(cc.Label);
        this.btnReceive = this.node.getChildByName('btn_receive').getComponent(cc.Button);
    },

    init: function () {
        this.rewardNumLabel.string = 0;
        this.btnReceive.interactable = false;
        cc.g.hallMgr.getTeamData();

    },

    updateReward: function () {
        let rewardNum = cc.g.hallMgr.teamData.employ.available;
        this.rewardNumLabel.string = rewardNum.toString();
        if (rewardNum > 0) {
            this.btnReceive.interactable = true;
        }
    },

    onClickReceive: function () {
        cc.g.hallMgr.getTeamSpreadReward();
        this.node.active = false;
    },

    onClickClose: function () {
        this.node.active = false;
    },
});
