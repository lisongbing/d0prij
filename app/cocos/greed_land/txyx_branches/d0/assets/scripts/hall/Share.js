cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
    },

    init: function () {
        this.updateShareCnt();
    },

    updateShareCnt: function () {
        //this.node.getChildByName('share_cnt').getComponent(cc.Label).string = '已领取' + cc.g.userMgr.shareCnt + '/3次';
        //this.node.getChildByName('Label_desc').getComponent(cc.Label).string = '成功邀请好友注册可额外获得' + GameConfig.shareGet + '张房卡';

        //cc.find("chat/lab_num", this.node).getComponent(cc.Label).getComponent(cc.Label).string = 'X ' + GameConfig.shareGet;
        //cc.find("quan/lab_num", this.node).getComponent(cc.Label).getComponent(cc.Label).string = 'X ' + GameConfig.shareGet;

        cc.find("share_cnt", this.node).getComponent(cc.Label).string = `已领取${cc.g.userMgr.shareCnt}/${3}次`;
    },

    onClickShareWXSceneSession: function () {
        cc.g.utils.btnShake();
        cc.g.utils.shareURLToWX(GameConfig.shareTitle, GameConfig.shareDesc, '', GameConfig.downloadUrl, 0);
    },

    onClickShareWXTimeline: function () {
        cc.g.utils.btnShake();
        cc.g.utils.shareURLToWX(GameConfig.shareTitle, GameConfig.shareDesc, '', GameConfig.downloadUrl, 1);
    },

    onClickClose: function () {
        cc.g.utils.btnShake();
        //this.node.active = false;
        cc.g.hallMgr.hall.dlgshare = null;
        this.node.destroy();
    },
});
