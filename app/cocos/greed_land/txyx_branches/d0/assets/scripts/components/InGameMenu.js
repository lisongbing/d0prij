
let voiceCD = 0;
let palyVoice = false;

cc.Class({
    extends: cc.Component,

    properties: {
        menuPrefab: {
            default: null,
            type: cc.Prefab,
        },
        settingPrefab: {
            default: null,
            type: cc.Prefab,
        },
        HuanzhuoPrefab: {
            default: null,
            type: cc.Prefab,
        },
        
        igSettingPrefab: {
            default: null,
            type: cc.Prefab,
        },
        chatPrefab: {
            default: null,
            type: cc.Prefab,
        },
        chatTextPrefab: {
            default: null,
            type: cc.Prefab,
        },

        micPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // 定位
        dlgLocationPf: {
            default: null,
            type: cc.Prefab,
        },
        // 定位
        gmRuleInfoPf: {
            default: null,
            type: cc.Prefab,
        },
        // 流水
        gmLiushuiPf: {
            default: null,
            type: cc.Prefab,
        },
        // 托管
        tuoguanPf: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        this.subMenuNode = this.node.getChildByName('sub_menu');
        this.micNode = cc.find('Node_bts/mic', this.node);
        this.micNode.color = cc.Color.WHITE;

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.micNode.active = false;
            return;
        }

        //设置语音麦克风
        this.micNode.on(cc.Node.EventType.TOUCH_START, function (event) {
            palyVoice = false;

            let cd = Date.now() - voiceCD;
            if (cd < 3*1000) {
                let t = cd/1000;
                t = 3-t;
                if (t>=1) {
                    t = t.toFixed(0);
                } else {
                    t = t.toFixed(1);
                }

                cc.g.global.hint(`休息会，${t}s后再来！`);

                return;
            }

            palyVoice = true;

            //if (!cc.g.voiceMgr.isOpen) return;

            cc.log('touch start');
            this.micNode.color = cc.Color.GRAY;

            cc.g.voiceMgr.beginVoice();
            if(cc.g.hallMgr.curGameMgr != null && cc.g.hallMgr.curGameMgr.gameScript != null) {
                cc.g.hallMgr.curGameMgr.gameScript.updateGVoiceStatus(-1, 1);
            }

            if(this.micMenuNode == null) {
                this.micMenuNode = cc.instantiate(this.micPrefab);
                this.subMenuNode.addChild(this.micMenuNode);
            }

            this.micMenuNode.active = true;
            this.micMenuNode.setSiblingIndex(this.subMenuNode.childrenCount - 1);
        }, this);
        this.micNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (palyVoice) {
                voiceCD = Date.now();
            }

            //if (!cc.g.voiceMgr.isOpen) return;

            cc.log('touch end');
            this.micNode.color = cc.Color.WHITE;

            cc.g.voiceMgr.endVoice();
            if(cc.g.hallMgr.curGameMgr != null && cc.g.hallMgr.curGameMgr.gameScript != null) {
                cc.g.hallMgr.curGameMgr.gameScript.updateGVoiceStatus(-1, 0);
            }

            this.micMenuNode.active = false;
        }, this);
        this.micNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (palyVoice) {
                voiceCD = Date.now();
            }

            //if (!cc.g.voiceMgr.isOpen) return;

            cc.log('touch cancel');
            this.micNode.color = cc.Color.WHITE;

            cc.g.voiceMgr.endVoice();
            if(cc.g.hallMgr.curGameMgr != null && cc.g.hallMgr.curGameMgr.gameScript != null) {
                cc.g.hallMgr.curGameMgr.gameScript.updateGVoiceStatus(-1, 0);
            }

            this.micMenuNode.active = false;
        }, this);


        let btn_menu_node = cc.find('btn_menu', this.node);
        let btn_huanz_node = cc.find('btn_huanz', this.node);
        let Button_menu_node = cc.find('Node_bts/Button_menu', this.node);
        let Button_mic_node = cc.find('Node_bts/mic', this.node);

        if (cc.g.utils.getWeChatOs()) {
            btn_menu_node.active = false
            btn_huanz_node.active = false
            Button_menu_node.active = true
            Button_mic_node.active = false
        } else {
            btn_menu_node.active = true
            btn_huanz_node.active = true
            Button_menu_node.active = false
            Button_mic_node.active = true
        }

        //btn_huanz_node.active = false;
    },

    init: function () {
        cc.log('InGameMenu init');

        this.micNode.active = false;

        if (!(cc.sys.platform === cc.sys.WECHAT_GAME)) {
            let rule = cc.g.hallMgr.curGameMgr.roomInfo.NewRlue;
            for (let i=0; i<rule.length; ++i) {
                if (rule[i] == 93) {
                    this.micNode.active = true;
                    break;
                }
            }
        }

        //cc.g.hallMgr.curGameMgr.isCardRoomType();
        //this.node.getChildByName('chat').active = false;
        //this.node.getChildByName('btn_menu').active = false;
        if (this.jiesanView) {
            this.jiesanView.clear();
        }

        if(this.micMenuNode != null) {
            this.micMenuNode.active = false;
        }
        
        this.Node_bts = cc.find('Node_bts', this.node);
        if (!this.Node_bts.oy) {
            this.Node_bts.oy = this.Node_bts.y;
        }
        this.Node_bts.y = this.Node_bts.oy;

        this.Button_chat = cc.find('Node_bts/chat', this.node);

        this.Button_clubfhdt = cc.find('Node_bts/Button_clubfhdt', this.node);
        this.Button_liushui = cc.find('Node_bts/liushui', this.node);
        this.btn_huanz = cc.find('btn_huanz', this.node);
        this.Button_location = cc.find('Button_gps', this.node);
        this.Button_location.active = false;
        this.Button_gps = cc.find('Button_gps', this.node);
        this.locgps1 = cc.find('Button_gps/g1', this.node);
        this.locgps2 = cc.find('Button_gps/g2', this.node);
        this.locgps1.active = true;
        this.locgps2.active = false;

        // 全屏点击穿透
        this.clcSwallow = cc.find("ClickSwallow", this.node).getComponent('ClickSwallow');
        this.clcSwallow.node.active = false;
        this.clcSwallow.endCall = function(){
            //this.onClickSwallow();
            cc.log('clcSwallow InGameMenu');
            this.clcSwallow.node.active = false;
            this.Sprite_rule.active = false;
        }.bind(this);

        // 规则
        this.Sprite_rule = cc.find("Sprite_rule", this.node);
        this.Sprite_rule.active = false;
        this.Sprite_rule.getComponent('dlgGmruleifo').initView2();

        // 房间号
        this.LabelRoomID = cc.find("Sprite_fjh_js/Label_roomID", this.node).getComponent(cc.Label);
        this.LabelRoomID.string = '房号:'+cc.g.hallMgr.curGameMgr.roomInfo.roomId+' ';

        this.Button_tip = cc.find('Node_bts/tip', this.node);
        this.Button_tip.active = false;

        //因玩家离线暂停发牌，30s后踢出离线玩家
        this.ztfpTip = cc.find("Label_ztfpTip", this.node).getComponent(cc.Label);
        this.ztfpTip.node.active = false;

        // 茶馆金币场
        this.Sprite_teaGold = cc.find("Sprite_teaGold", this.node);
        if (!this.Sprite_teaGold.ox) {
            this.Sprite_teaGold.ox = this.Sprite_teaGold.x;
            this.Sprite_teaGold.oy = this.Sprite_teaGold.y;
        }
        this.Sprite_teaGold.x = 10;
        this.Sprite_teaGold.y = 10;
        this.Label_teaGold = cc.find("Label_gold", this.Sprite_teaGold).getComponent(cc.Label);

        if (this.dlgHuanzhuo) {
            this.dlgHuanzhuo.onBtnClose();
        }

        this.upteagold();

        this.showTuoguan(false);

        // 位置按钮
        if (!cc.g.hallMgr.curGameMgr.isBackPlayMode()) {
            for(let i=0;i<cc.g.hallMgr.curGameMgr.roomInfo.NewRlue.length; i++){
                if(cc.g.hallMgr.curGameMgr.roomInfo.NewRlue[i] == 36){
                    this.Button_location.active = true;
                }
            }
        }
        
        if (this.locationNode == null) {
            this.locationNode = cc.instantiate(this.dlgLocationPf);
            this.subMenuNode.addChild(this.locationNode);
            this.locationNode.active = false;
        }

        if (cc.g.hallMgr.curGameMgr.roomInfo.total == cc.g.hallMgr.curGameMgr.players.length && this.Button_location.active == true) {
            this.onClickLocation();
        }

        this.onClickSetting();
        this.dlgSetting.node.active = false;

        this.onGVoiceSwitch();
    },

    upteagold:function () {
        cc.log('upteagold');

        this.LabelRoomID.string = '房号:'+cc.g.hallMgr.curGameMgr.roomInfo.roomId+' ';

        let pg = cc.g.hallMgr.curGameMgr.gameScript;
        if (pg && pg.Label_deskrule) {
            let com = this.Sprite_rule.getComponent('dlgGmruleifo');
            let str = com.srtlist.join(' ');
            pg.Label_deskrule.string = str;
            pg.Label_deskrule.node.active = true;
        }

        if (cc.g.hallMgr.curGameMgr.roomInfo.type == 5) {
            this.Sprite_teaGold.active = true;
            //let p = cc.g.hallMgr.curGameMgr.getSelfPlayer();
            //this.Label_teaGold.string = cc.g.utils.realNum1(p ? p.gold : 0);
        } else {
            this.Sprite_teaGold.active = false;
        }

        let p = cc.g.hallMgr.curGameMgr.getSelfPlayer();
        this.Label_teaGold.string = cc.g.utils.realNum1(p ? p.gold : 0);

        if (this.Sprite_teaGold.active) {
            this.scheduleOnce(()=>{
                let n = cc.find("Sprite_fjh_js", this.node);

                let tp = cc.g.hallMgr.curGameMgr.roomInfo.gameType;
                if (tp == GMID.D2 || tp == GMID.DDZ5) {
                    this.Sprite_teaGold.x = this.Button_gps.x + 50;
                    this.Sprite_teaGold.y = this.Button_gps.y;
                } else {
                    this.Sprite_teaGold.x = n.x + 18;
                    this.Sprite_teaGold.y = this.Sprite_teaGold.oy;
                }
            }, 0.1);
        }
    },

    upBtnShow: function () {
        cc.log('upBtnShow');

        let ri = cc.g.hallMgr.curGameMgr.roomInfo;

        this.Button_clubfhdt.active = false;
        if (ri.gameType==GMID.D2 || ri.gameType==GMID.HZMJ) {
            this.Button_clubfhdt.active = ((ri.clubId) && (ri.curGameNum<1) && (ri.status == 0));
        }

        this.Button_liushui.active = (ri.curGameNum>0);

        if (!cc.g.utils.getWeChatOs()) {
            this.btn_huanz.active = ((ri.clubId) && (ri.curGameNum<1));
        }
        //this.btn_huanz.active = false;

        if (cc.g.hallMgr.curGameMgr.isNojoinRoom) {
            this.btn_huanz.active = false;
            let qyqyq = cc.g.hallMgr.curGameMgr.gameScript.Button_qyqyq;
            if (qyqyq) {
                qyqyq.active = false;
            }
        }

        let schbtnshow = ()=>{
            let ri = cc.g.hallMgr.curGameMgr.roomInfo;

            if (ri.curGameNum>0 && ri.status==-100) {
                ri.status=1;
            }

            this.ztfpTip.node.active = (ri.status==-100);//暂停发牌

            if (cc.g.hallMgr.curGameMgr.isNojoinRoom) {
                this.btn_huanz.active = false;
                let qyqyq = cc.g.hallMgr.curGameMgr.gameScript.Button_qyqyq;
                if (qyqyq) {
                    qyqyq.active = false;
                }
            }

            if (ri.curGameNum>0 || ri.status!=0) {
                //if (!cc.g.utils.getWeChatOs()) {
                    this.btn_huanz.active = this.Button_clubfhdt.active = false;
                //}

                this.Button_liushui.active = true;
            }

            if (ri.curGameNum>0) {
                cc.log('unschedule1');
                this.unschedule(schbtnshow);
                this.schbtnshow_ing = false;
                cc.log('unschedule2');
            }
        }
        if (!this.schbtnshow_ing) {
            this.schbtnshow_ing = true;
            this.schedule(schbtnshow, 0.1);
        }
        schbtnshow();

        let tp = cc.g.hallMgr.curGameMgr.roomInfo.gameType;
        if ( tp == GMID.HZMJ || tp == GMID.XZMJ || tp == GMID.YBMJ || tp == GMID.NYMJ ||
             tp == GMID.LZMJ || tp == GMID.NJMJ || tp == GMID.YJMJ || tp == GMID.XZMJER) {
            this.Node_bts.y = this.Node_bts.oy + 50 + 10;
        } else {
            this.Node_bts.y = this.Node_bts.oy;
        }

        //
        this.showTuoguan(cc.g.hallMgr.curGameMgr.isTguoguan);
    },

    onSomeTip: function () {
        if (!cc.g.hallMgr.curGameMgr || !cc.g.hallMgr.curGameMgr.gameScript) {
            return;
        }

        cc.g.hallMgr.curGameMgr.gameScript.onSomeTip();
    },

    showTuoguan: function (isshow) {
        cc.log('showTuoguan ', isshow);

        if (!this.subMenuNode) {
            cc.warn('InGameMenu 还未初始化 游戏场景加载后 应该会再次进入此处');
            return;
        }
        
        if (this.dlgTuoguan == null) {
            this.dlgTuoguan = cc.instantiate(this.tuoguanPf);
            this.subMenuNode.addChild(this.dlgTuoguan);

            cc.g.utils.addClickEvent(cc.find('btn_tuoguan',this.dlgTuoguan), this.node, 'InGameMenu', 'onBTnQxtg');
        }
        
        this.dlgTuoguan.active = isshow;

        let ri = cc.g.hallMgr.curGameMgr.roomInfo;
    },
    hideTuoguan: function () {
        if (this.dlgTuoguan == null) {
            return;
        }
            
        this.dlgTuoguan.active = false;
    },

    getJiesanView: function () {
        cc.log('getJiesanView');

        if (this.jiesanView) return this.jiesanView.node;

        let jsv = cc.instantiate(cc.g.pf.jieSanPf);
        this.node.addChild(jsv);
        this.jiesanView = jsv.getComponent('jiesanRoom');

        return this.jiesanView.node;
    },

    onBTnQxtg: function () {
        //if (this.dlgTuoguan) {
        //    this.dlgTuoguan.active = false; 
        //}

        cc.g.utils.btnShake();

        if (!cc.g.hallMgr.curGameMgr) {
            cc.warn('onBTnQxtg  !cc.g.hallMgr.curGameMgr');
            return;
        }

        let ri = cc.g.hallMgr.curGameMgr.roomInfo;

        const OPT_Tuoguan = (1<<30)-1;

        cc.g.hallMgr.curGameMgr && cc.g.hallMgr.curGameMgr.sendOp(OPT_Tuoguan, [0]);
    },

    onClickRule: function (evt, data) {
        this.Sprite_rule.active = (data=='1');

        if (data=='1') {
            this.clcSwallow.node.active = true;
            //this.Sprite_rule.getComponent('dlgGmruleifo').initView2();

            let sv = cc.find("ScrollView_rule", this.Sprite_rule).getComponent(cc.ScrollView);
            sv.scrollToTop();
        }
    },

    onGVoiceSwitch: function () {
        if (this.micNode) {
            this.micNode.getComponent(cc.Button).interactable = cc.g.audioMgr.isGVoiceOn; //灰色
        }
    },

    onClickMenuOnOff: function () {
        cc.g.utils.btnShake();

        if (this.dlgMenu == null) {
            this.dlgMenu = cc.instantiate(this.menuPrefab).getComponent('dlgIGmenu');
            this.subMenuNode.addChild(this.dlgMenu.node);
        }
        this.dlgMenu.node.active = true;
        this.dlgMenu.up();
    },

    onClickExitGame: function () {
        cc.g.hallMgr.exitGame();
    },

    onClickSetting: function () {
        // if (this.settingNode == null) {
        //     this.settingNode = cc.instantiate(this.settingPrefab);
        //     this.settingNode.getComponent('dlgSetting').init();
        //     this.subMenuNode.addChild(this.settingNode);
        // }
        // this.settingNode.active = true;
        // this.settingNode.setSiblingIndex(this.subMenuNode.childrenCount - 1);
        // this.settingNode.getComponent('dlgSetting').upSetting();
        // this.onClickMenuOnOff();

        if (this.dlgSetting == null) {
            this.dlgSetting = cc.instantiate(this.igSettingPrefab).getComponent('dlgIGsetting');
            this.subMenuNode.addChild(this.dlgSetting.node);
        }
        this.dlgSetting.node.active = true;
        this.dlgSetting.up();

        //this.onClickMenuOnOff();
    },

    onClickHuanzhuo: function () {
        cc.g.utils.btnShake();

        this.dlgHuanzhuo = cc.instantiate(this.HuanzhuoPrefab).getComponent('dlgHuanzhuo');
        this.subMenuNode.addChild(this.dlgHuanzhuo.node);
        this.dlgHuanzhuo.up();
    },
    
    onClickLiushui: function () {
        cc.g.utils.btnShake();

        if (this.dlgLS == null) {
            this.dlgLS = cc.instantiate(this.gmLiushuiPf).getComponent('dlgLiushui');
            this.subMenuNode.addChild(this.dlgLS.node);   
        }

        this.dlgLS.up();
    },


    onClickChat: function () {
        cc.log('onClickChat');

        cc.g.utils.btnShake();

        if (this.chatNode == null) {
            this.chatNode = cc.instantiate(this.chatPrefab);
            this.node.getChildByName('chat_box').addChild(this.chatNode);
            this.chatNode.on(cc.Node.EventType.TOUCH_END, this.onClickChat, this);
            this.chatNode._touchListener.setSwallowTouches(false);
            return;
        } else {
            let com = this.chatNode.getComponent('dlgChat');
            let act = com.ScrollView_txtemo.active;
            com.initTxtEmoji();
            com.ScrollView_txtemo.active = act;
        }

        this.chatNode.active = !this.chatNode.active;
    },

    onClickTip: function () {
        cc.g.utils.btnShake();

        if (cc.g.hallMgr.curGameMgr && cc.g.hallMgr.curGameMgr.gameScript) {
            cc.g.hallMgr.curGameMgr.gameScript.OnInGMTip && cc.g.hallMgr.curGameMgr.gameScript.OnInGMTip();
        }
    },

    onClickViewIPAddress: function () {
        if(this.viewIPAddressNode == null) {
            this.viewIPAddressNode = cc.instantiate(this.viewIPAddressPrefab);
            this.subMenuNode.addChild(this.viewIPAddressNode);
        }
        this.viewIPAddressNode.active = true;
        this.viewIPAddressNode.setSiblingIndex(this.subMenuNode.childrenCount - 1);
        this.viewIPAddressNode.getComponent('ViewIPAddress').init();

        //this.onClickMenuOnOff();
    },

    onBtnClubBackHall: function (evt, data) {
        cc.g.utils.btnShake();

        cc.g.hallMgr.curGameMgr.backHall();
    },

    onClickLocation: function() {
        cc.log("onClickLocation");
        
        cc.g.utils.btnShake();

        this.locationNode.active = true;
        this.locationNode.setSiblingIndex(this.subMenuNode.childrenCount - 1);
        this.locationNode.getComponent('dlgLocation').init();
        //this.onClickMenuOnOff();
    },
    onLocationStatu: function(sta) {
        cc.log("onLocationStatu");

        this.locgps1.active = this.locgps2.active = false;

        sta ? (this.locgps2.active = true) : (this.locgps1.active = true);
    },

    updateRank: function(list) {
        this.rankNode.getComponent('GameRank').updateRank(list);
    },

    reset: function () {
        {/*
            if (this.chatNode != null) {
                this.chatNode.getChildByName('content').destroyAllChildren();
            }
            if (this.chatNode != null) {
                this.chatNode.getChildByName('content').destroyAllChildren();
            }
        */}

        if(this.rankNode != null) {
            this.rankNode.active = false;
        }
        if(this.viewIPAddressNode != null) {
            this.viewIPAddressNode.active = false;
        }
        /*if(this.bankNode != null) {
            this.bankNode.destory();
            this.bankNode = null;
        }
        if(this.settingNode != null) {
            this.settingNode.destory();
            this.settingNode = null;
        }
        if(this.enterBankNode != null) {
            this.enterBankNode.destory();
            this.enterBankNode = null;
        }*/
    },
});
