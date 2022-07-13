cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function () {
        this.musicNoe = this.node.getChildByName('music');
        this.sfxNoe = this.node.getChildByName('sfx');
        this.gVoiceNode = this.node.getChildByName('gvoice');

        this.musicNoe.getChildByName('on').active = cc.g.audioMgr.isBGMOn;
        this.musicNoe.getChildByName('off').active = !cc.g.audioMgr.isBGMOn;
        this.sfxNoe.getChildByName('on').active = cc.g.audioMgr.isSFXOn;
        this.sfxNoe.getChildByName('off').active = !cc.g.audioMgr.isSFXOn;
        this.gVoiceNode.getChildByName('on').active = cc.g.audioMgr.isGVoiceOn;
        this.gVoiceNode.getChildByName('off').active = !cc.g.audioMgr.isGVoiceOn;
        
        this.btnLogout = this.node.getChildByName('btn_logout').getComponent(cc.Button);

        let versionStr = cc.sys.localStorage.getItem('currentVersion');
        if(versionStr == null) {
            versionStr = GameConfig.gameVersion;
        }
        this.node.getChildByName('version').getComponent(cc.Label).string = '版本号:' + versionStr;
    },

    init: function () {
        if (cc.g.hallMgr.curGameType > 0) {//在游戏中,不能退出登录
            this.btnLogout.interactable = false;
        }
        else {
            this.btnLogout.interactable = true;
        }
    },

    onClickMusicBtn: function () {
        cc.g.audioMgr.setBGMOn(!cc.g.audioMgr.isBGMOn);
        if (cc.g.audioMgr.isBGMOn) {
            cc.g.audioMgr.playBGM('public/m_bg.mp3');
        }
        this.musicNoe.getChildByName('on').active = cc.g.audioMgr.isBGMOn;
        this.musicNoe.getChildByName('off').active = !cc.g.audioMgr.isBGMOn;
    },

    onClickSfxBtn: function () {
        cc.g.audioMgr.setSFXOn(!cc.g.audioMgr.isSFXOn);
        this.sfxNoe.getChildByName('on').active = cc.g.audioMgr.isSFXOn;
        this.sfxNoe.getChildByName('off').active = !cc.g.audioMgr.isSFXOn;
    },

    onClickGVoiceBtn: function () {
        cc.g.audioMgr.setGVoiceOn(!cc.g.audioMgr.isGVoiceOn);
        this.gVoiceNode.getChildByName('on').active = cc.g.audioMgr.isGVoiceOn;
        this.gVoiceNode.getChildByName('off').active = !cc.g.audioMgr.isGVoiceOn;
    },

    onClickLogout: function () {
        cc.log('click logout!');
        cc.g.userMgr.logout();
    },

    onClickClose: function () {
        this.node.active = false;
    },
});
