cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad() {
        let lastPlatform = cc.sys.localStorage.getItem('lastPlatform');
        if(lastPlatform != PB.PLATFORM.GUEST || (GameConfig.loginMode & (1 << PB.PLATFORM.ACCOUNT)) == 0) {
            this.node.getChildByName('account_bind').active = false;
        }
        if(lastPlatform != PB.PLATFORM.GUEST || (GameConfig.loginMode & (1 << PB.PLATFORM.WECHAT)) == 0) {
            this.node.getChildByName('wx_bind').active = false;
        }
    },

    init: function () {
        //头像
        if (cc.g.userMgr.icon.length > 4) {
            let headSprite = this.node.getChildByName('head').getComponent(cc.Sprite);
            cc.g.utils.setUrlTexture(headSprite, cc.g.userMgr.icon);
        }
        else {
            let spriteFrame = null;
            if (cc.g.userMgr.icon === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            }
            else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + cc.g.userMgr.icon, cc.SpriteFrame);
            }
            this.node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
        //名字
        this.node.getChildByName('user_name').getComponent(cc.Label).string = cc.g.userMgr.userName;
        //uid
        this.node.getChildByName('user_id').getComponent(cc.Label).string = cc.g.userMgr.userId.toString();
        //个性签名
        this.node.getChildByName('signature').getComponent(cc.Label).string = cc.g.userMgr.signature;
        //ip
        this.node.getChildByName('ip').getComponent(cc.Label).string = cc.g.userMgr.ip;
    },

    updatePersonalInfo: function () {
        //名字
        this.node.getChildByName('user_name').getComponent(cc.Label).string = cc.g.userMgr.userName;
        //个性签名
        this.node.getChildByName('signature').getComponent(cc.Label).string = cc.g.userMgr.signature;
    },

    onClickModifyUserInfo: function () {
        cc.g.hallMgr.hall.showMenu('modify_userinfo').getComponent('ModifyUserInfo').init();
    },

    onClickTransfer: function () {
        cc.g.hallMgr.hall.showMenu('transfer').getComponent('Transfer').init();
    },

    onClickWXBind: function () {
        cc.g.userMgr.wxBind();
    },

    onClickClose: function () {
        this.node.active = false;
    },

});
