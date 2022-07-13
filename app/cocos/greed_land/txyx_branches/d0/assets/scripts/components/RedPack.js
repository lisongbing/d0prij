cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function () {
    },

    init: function () {
        this.updateData();
    },

    updateData: function() {
        if(cc.g.userMgr.canOpenRedPkg == 0) {
            this.node.getChildByName('btnopen').getComponent(cc.Button).interactable = false;
        } else {
            this.node.getChildByName('btnopen').getComponent(cc.Button).interactable = true;
        }
        let canOpenNode = this.node.getChildByName('canOpenRedPack');
        canOpenNode.getComponent(cc.Label).string = cc.g.userMgr.canOpenRedPkg;
        let txNode = this.node.getChildByName('canTX');
        txNode.getComponent(cc.Label).string = cc.g.userMgr.achieveRedPkg.toFixed(2);
        if(cc.g.userMgr.achieveRedPkg < 10) {
            this.node.getChildByName('btn_tx').getComponent(cc.Button).interactable = false;
        }
        else {
            this.node.getChildByName('btn_tx').getComponent(cc.Button).interactable = true;
        }
    },

    onClickShareWXSceneSession: function () {
        cc.g.utils.shareURLToWX(GameConfig.shareTitle, GameConfig.shareDesc, '', GameConfig.shareUrl + '?channelCode=' + cc.g.userMgr.userId.toString(), 0);
    },

    onClickClose: function () {
        this.node.active = false;
    },

    onClickOpenTX: function() {
        let txNode = this.node.getChildByName('tx');
        if(!txNode.active) {
            txNode.active = true;
            txNode.getChildByName('wxLabel').getComponent(cc.Label).string = GameConfig.complainWX;
        }
    },

    onClickCloseTX: function() {
        let txNode = this.node.getChildByName('tx');
        txNode.active = false;
    },

    onClickGotoWX: function () {
        if (cc.g.utils.setPasteboard(GameConfig.complainWX)) {
            let copySuccessNode = this.node.getChildByName('copy_success')
            copySuccessNode.active = true;
            let textLabel = copySuccessNode.getChildByName('text').getComponent(cc.Label);
            let sec = 3;
            var self = this;
            textLabel.string = '复制成功' + sec + '秒后跳转'
            this.countDownSchedule = function () {
                sec--;
                if (sec < 0) {
                    self.unschedule(self.countDownSchedule);
                    copySuccessNode.active = false;
                    cc.g.utils.openWXApp();
                }
                textLabel.string = '复制成功' + sec + '秒后跳转'
            };
            this.schedule(this.countDownSchedule, 1);
        }
    },

    onClickReciveRedPack:function() {
        cc.g.hallMgr.receiveRedPack();
        //cc.log('点击领取红包');
    },

    onClickCloseRecieve: function() {
        this.node.getChildByName('recieve').active = false;
    },

    receiveRedpackSuccess: function(gold) {
        this.updateData();
        if(this.node.active) {
            this.node.getChildByName('recieve').active = true;
            this.node.getChildByName('recieve').getChildByName('wxLabel').getComponent(cc.Label).string = gold;
        }
        //cc.log('领取成功');
    }
});
