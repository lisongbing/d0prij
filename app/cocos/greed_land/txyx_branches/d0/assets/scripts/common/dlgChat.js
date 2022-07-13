

cc.Class({
    extends: cc.Component,

    properties: {
        // 图集
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        // 文字表情预制
        txtEmoItmPf: {
            default: null,
            type: cc.Prefab,
        },

        // 动画表情预制
        anmEmoItmPf: {
            default: null,
            type: cc.Prefab,
        },

        // 动画表情预制
        anmEmoPf: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '聊天';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();
    },

    start () {
    },

    // update (dt) {},


    initView: function () {
        let r = this.node;

        this.initAnmEmoji();
        this.initTxtEmoji();

        this.initChatBtn();

        cc.find("New EditBox", r).active = false;
        cc.find("Button_send", r).active = false;
        cc.find("diban_sige/New Sprite2", r).active = false;
        cc.find("toggleContainer/toggle3", r).active = false;

        this.ScrollView_anmemo.active = true;

        return;

        // 发起者
        this.faqizhe = cc.find("New Node/Label_name", r).getComponent(cc.Label);

        // 玩家滑动容器
        this.svPlayer = cc.find("ScrollView_player", r).getComponent(cc.ScrollView);
        this.svPlayer.scrollToTop();

        // 玩家容器
        //this.gboxPlayer = cc.find("ScrollView_player/view/content", r).getComponent(cc.Layout);
        this.gboxPlayer = this.svPlayer.content.getComponent(cc.Layout);
        this.gboxPlayer.node.removeAllChildren();
        this.gboxPlayer.updateLayout();

        // 倒计时
        this.Label_timeTip = cc.find("Label_timeTip", r).getComponent(cc.Label);

        // 同意 不同意按钮
        this.Button_yes = cc.find("Button_yes", r);
        this.Button_no = cc.find("Button_no", r);

        // 关闭按钮
        this.Button_close = cc.find("Button_close", r);
        this.Button_close.active = false;
    },

    // 动画表情
    initAnmEmoji: function () {
        let r = this.node;

        this.ScrollView_anmemo = cc.find("ScrollView_anmemo", r);
        let content = cc.find("ScrollView_anmemo/view/content", r);
        content.removeAllChildren();

        for (let i = 0; true; ++i) {
            let frm = this.atlas.getSpriteFrame('chat_anmemo_' + (i+1));
            if (!frm) break;

            let item = cc.instantiate(this.anmEmoItmPf);
            cc.find("Sprite_emo", item).getComponent(cc.Sprite).spriteFrame = frm;
            content.addChild(item);
            cc.g.utils.addClickEvent(item, this.node, 'dlgChat', 'onClickAnmEmoji', i+1);
        }

        this.ScrollView_anmemo.active = false;
    },
    // 点击动画表情
    onClickAnmEmoji: function (event, customData) {
        cc.log(this.dbgstr('onClickAnmEmoji 点击表情'));

        let t = Date.now();
        
        cc.log('圆脸表情 ', t - cc.g.Tylbq);

        if (t - cc.g.Tylbq > 1000*10) {
            cc.g.Tylbq = t;
        } else {
            //cc.g.global.hint('操作频率过快');
            //return;
        }

        this.node.active = false;

        cc.log('customData', customData);

        if(cc.g.hallMgr.curGameMgr != null) {
            let player = cc.g.hallMgr.curGameMgr.getSelfPlayer();
            if(cc.g.hallMgr.curGameMgr.gameScript != null) {
                //cc.g.hallMgr.curGameMgr.gameScript.showAnmEmoji(player, customData);
                cc.g.hallMgr.curGameMgr.sendTalkToAllReq(parseInt(customData), 2);
            }
        }
    },

    // 文字表情
    initTxtEmoji: function () {
        cc.log('initTxtEmoji');
        
        let r = this.node;

        this.ScrollView_txtemo = cc.find("ScrollView_txtemo", r);
        let content = cc.find("ScrollView_txtemo/view/content", r);
        content.removeAllChildren();

        let talkGameConfig = cc.g.utils.getJson('TalkGame')[cc.g.hallMgr.curGameType];
        if(talkGameConfig == null) {
            cc.error('游戏 '+cc.g.hallMgr.curGameType+' 没有配置文字表情数据')
            return;
        }

        let curGameConfig = talkGameConfig.Talk;
        let chatConfig = cc.g.utils.getJson('Talk');
        let len = curGameConfig.length;
        for (let i = 0; i < len; i++) {
            let chat = chatConfig[curGameConfig[i]];
            let chatText = cc.instantiate(this.txtEmoItmPf);
            chatText.getChildByName('chat_text').getComponent(cc.Label).string = chat.Desc;
            content.addChild(chatText);
            cc.g.utils.addClickEvent(chatText, this.node, 'dlgChat', 'onClickTxtEmoji', chat);
        }

        this.ScrollView_txtemo.active = false;
    },
    // 点击文字表情
    onClickTxtEmoji: function (event, customData) {
        this.node.active = false;
        if(cc.g.hallMgr.curGameMgr != null) {
            let player = cc.g.hallMgr.curGameMgr.getSelfPlayer();
            if(cc.g.hallMgr.curGameMgr.gameScript != null) {
                //cc.g.hallMgr.curGameMgr.gameScript.showDialog(player, customData.ID);
                cc.g.hallMgr.curGameMgr.sendTalkToAllReq(parseInt(customData.ID), 1);
            }
        }
    },


    // 聊天相关按钮
    initChatBtn: function () {
        let r = this.node;

        let toggle1 = cc.find("toggleContainer/toggle1", r);
        let toggle2 = cc.find("toggleContainer/toggle2", r);
        let toggle3 = cc.find("toggleContainer/toggle3", r);

        cc.g.utils.addCheckEvent(toggle1, this.node, 'dlgChat', 'onCheckTxtEmoji', 1);
        cc.g.utils.addCheckEvent(toggle2, this.node, 'dlgChat', 'onCheckTxtEmoji', 2);
        cc.g.utils.addCheckEvent(toggle3, this.node, 'dlgChat', 'onCheckTxtEmoji', 3);

        this.toggle = [];
        this.toggle.push(toggle1);
        this.toggle.push(toggle2);
        this.toggle.push(toggle3);
    },

    onCheckTxtEmoji: function (event, customEventData) {
        this.ScrollView_txtemo.active = false;
        this.ScrollView_anmemo.active = false;

        if (!event.isChecked) {
            return;
        }

        
        if (customEventData == 1) {
            // 动画表情
            this.ScrollView_anmemo.active = true;
        } else if (customEventData == 2) {
            // 文字表情
            this.ScrollView_txtemo.active = true;   
        }
    },
});
