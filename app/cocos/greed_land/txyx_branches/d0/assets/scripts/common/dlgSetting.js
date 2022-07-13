
let AskJiesan = {
    v: 997,
    s: '申请解散',
};

let uping = false;

cc.Class({
    extends: cc.Component,
    properties: {},

    dbgstr: function (info) {
        let s = '设置';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        uping = true;

        let r = this.node;

        this.music = cc.find("Toggle_music", this.node).getComponent(cc.Toggle);
        this.sfx = cc.find("Toggle_sfx", this.node).getComponent(cc.Toggle);
        this.teayq = cc.find("Toggle_teayq", this.node).getComponent(cc.Toggle);
        this.zhendong = cc.find("Toggle_zhendong", this.node).getComponent(cc.Toggle);
        //this.gVoiceNode = this.node.getChildByName('gvoice');

        cc.g.audioMgr.isBGMOn ? this.music.check() : this.music.uncheck();
        cc.g.audioMgr.isSFXOn ? this.sfx.check() : this.sfx.uncheck();
        GameConfig.isTeaYaoqing ? this.teayq.check() : this.teayq.uncheck();
        
        // 按钮
        let btns = cc.find("Node_btns", this.node);
        this.btn_outRoom = cc.find("btn_outRoom", btns);
        this.btn_jsRoom = cc.find("btn_jsRoom", btns);
        this.btn_logout = cc.find("btn_logout", btns);
        this.btn_logreplace = cc.find("btn_logreplace", btns);
        this.Layout_btns = btns.getComponent(cc.Layout);

        // // 音效滑动条
        // this.Slider_sfx = cc.find("Slider_sfx", this.node).getComponent(cc.Slider);
        // this.sfx_curpro = cc.find("Slider_sfx/Sprite_curpro", this.node);
        // this.sfx_curpro.oW = this.sfx_curpro.width;

        // // BGM滑动条
        // this.Slider_mus = cc.find("Slider_music", this.node).getComponent(cc.Slider);
        // this.mus_curpro = cc.find("Slider_music/Sprite_curpro", this.node);
        // this.mus_curpro.oW = this.mus_curpro.width;

        {/*
            let versionStr = cc.sys.localStorage.getItem('currentVersion');
            if(versionStr == null) {
                versionStr = GameConfig.gameVersion;
            }
            this.node.getChildByName('version').getComponent(cc.Label).string = '版本号:' + versionStr;
        */}

        uping = false;
    },

    init: function () {
    },

    // 更新界面
    upSetting: function () {
        //30

        uping = true;

        cc.g.audioMgr.isBGMOn ? this.music.check() : this.music.uncheck();
        cc.g.audioMgr.isSFXOn ? this.sfx.check() : this.sfx.uncheck();

        GameConfig.isZhendong ? this.zhendong.check() : this.zhendong.uncheck();

        // // 音效滑动条
        // this.sfx_curpro.width = this.sfx_curpro.oW * this.Slider_sfx.progress;
        // // BGM滑动条
        // this.mus_curpro.width = this.mus_curpro.oW * this.Slider_mus.progress;


        this.btn_outRoom.active = this.btn_jsRoom.active = this.btn_logout.active = this.btn_logreplace.active = false;

        if (cc.g.hallMgr.curGameType > 0) {
            //在游戏中,不能退出登录
            //this.btn_logout..getComponent(cc.Button).interactable = false; //灰色

            this.Layout_btns.spacingX = 180;

            // 房间状态
            let ri = cc.g.hallMgr.curGameMgr.roomInfo;
            if (ri.type == 2) {
                if (ri.status<=0 && ri.curGameNum<=0) {
                    this.btn_outRoom.active = true;
                } else {
                    this.btn_jsRoom.active = true;
                }
            } else {
                this.btn_outRoom.active = true;
            }
        } else {
            this.Layout_btns.spacingX = 180;
            this.btn_logout.active = this.btn_logreplace.active = true;
        }

        this.Layout_btns.updateLayout();

        uping = false;
    },

    onClickMusicBtn: function (event, d) {
        if (uping) return;

        let ison = event.isChecked;

        cc.g.audioMgr.setBGMOn(ison);

        if (cc.g.hallMgr.curGameType > 0) {
            if (cc.g.hallMgr.curGameMgr) {
                if (cc.g.hallMgr.curGameMgr.onBGMSwitch) {
                    cc.g.hallMgr.curGameMgr.onBGMSwitch(cc.g.audioMgr.isBGMOn);
                }
            }
        } else {
            if (cc.g.audioMgr.isBGMOn){
                cc.g.audioMgr.playBGM('public/bg_game.mp3');
            }
        }
    },

    onClickSfxBtn: function (event, d) {
        if (uping) return;

        let ison = event.isChecked;

        cc.g.audioMgr.setSFXOn(ison);
    },

    onZhendong (event, d) {
        let ison = event.isChecked;
        // @ts-ignore
        cc.sys.localStorage.setItem('isZhendong', ison ? 1 : 0);
        // @ts-ignore
        GameConfig.isZhendong = ison;
    },

    onClickGVoiceBtn: function (event, d) {
        if (uping) return;
        
        // cc.g.audioMgr.setGVoiceOn(!cc.g.audioMgr.isGVoiceOn);
        // this.gVoiceNode.getChildByName('on').active = cc.g.audioMgr.isGVoiceOn;
        // this.gVoiceNode.getChildByName('off').active = !cc.g.audioMgr.isGVoiceOn;

        // if (cc.g.hallMgr.inGameMenu) {
        //     cc.g.hallMgr.inGameMenu.onGVoiceSwitch();
        // }
    },


    // 音效音量（0
    onSlide: function(slider, customEventData) {
        //cc.log('progress', slider.progress);

        // if (customEventData == '1') {
        //     this.sfx_curpro.width = this.sfx_curpro.oW * slider.progress;
        //     cc.g.audioMgr.setSFXVolume(slider.progress);
        //     cc.g.audioMgr.setSFXOn((slider.progress <= 0));
        // } else if (customEventData == '2') {
        //     this.mus_curpro.width = this.mus_curpro.oW * slider.progress;
        //     cc.g.audioMgr.setBGMVolume(slider.progress);
        //     //cc.g.audioMgr.setBGMOn((slider.progress <= 0));
        // }
    },


    // 登出 切换账号
    onCheckYaoqing: function (event, customEventData) {
        cc.log('onCheckYaoqing ', event.isChecked);

        cc.g.utils.btnShake();

        GameConfig.isTeaYaoqing = event.isChecked;
        
        cc.sys.localStorage.setItem('isTeaYaoqing', event.isChecked ? 'true' : 'false');
    },


    // 登出 切换账号
    onClickLogout: function () {
        cc.log('click logout!');
        cc.g.utils.btnShake();
        cc.g.audioMgr.stopBGM();
        //cc.g.userMgr.logout();
        cc.g.voiceMgr.logout();

        cc.g.networkMgr.close();
        cc.g.userMgr.logoutCallback();

        this.onClickClose();
    },

    // 退出游戏
    onQuite: function () {
        cc.log('click onQuite!');
        cc.g.utils.btnShake();

        cc.g.global.showTipBox('确定退出吗？', ()=>{
            this.onClickClose();
            cc.g.audioMgr.setBGMOn(false);
            cc.g.voiceMgr.logout();
            cc.game.end();
            //cc.director.end();
        });
    },

    // 帮助
    onBtnHelp: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnHelp'));
        cc.g.utils.btnShake();
    },

    // 退出房间
    onBtnOutRoom: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnOutRoom'));
        cc.g.utils.btnShake();
        cc.g.hallMgr.exitGame();
        this.onClickClose();
    },

    // 申请解散房间
    onBtnJiesanRoom: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnOutRoom'));

        cc.g.utils.btnShake();
        
        if (cc.g.hallMgr.curGameType > 0) {
            cc.g.hallMgr.curGameMgr.sendOp(AskJiesan.v);
        }

        this.onClickClose();
    },

    // 关闭
    onClickClose: function () {
        cc.g.utils.btnShake();
        
        this.node.removeFromParent();
        this.node.destroy();

        cc.g.hallMgr.inGameMenu.settingNode = null;
    },
});
