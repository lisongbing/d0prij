var ChargeType = {
    ALIPAY: 0,
    WECHAT: 1,
    VIP: 2,
    GOLD: 3,
    CARD: 4,
    MAX: 5,
};
cc.Class({
    extends: cc.Component,

    properties: {
        agentInfoPrefab: {
            default: null,
            type: cc.Prefab,
        },
        agentTypeSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame],
        }
    },
    onLoad() {
        this.alipayOrWechatNode = this.node.getChildByName('alipay_wechat');
        this.alipayOrWechatNode.active = false;

        this.vipNode = this.node.getChildByName('vip');
        this.vipNode.active = false;

        this.goldNode = this.node.getChildByName('gold');
        this.goldNode.active = false;

        this.cardNode = this.node.getChildByName('card');
        this.cardNode.active = false;


        let toggleContainer = this.node.getChildByName('toggleContainer');
        this.vipToggleNode = toggleContainer.getChildByName('vip');
        this.vipToggle = this.vipToggleNode.getComponent(cc.Toggle);

        this.alipayToggleNode = toggleContainer.getChildByName('alipay');
        this.wechatToggleNode = toggleContainer.getChildByName('wechat');

        this.goldToggleNode = toggleContainer.getChildByName('gold');
        this.cardToggleNode = toggleContainer.getChildByName('card');

        this.goldAndCardJson = cc.g.utils.getJson('Exchange');


        if ((GameConfig.rechargeMode & (1 << ChargeType.ALIPAY)) === 0) {
            this.alipayToggleNode.active = false;
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.WECHAT)) === 0) {
            this.wechatToggleNode.active = false;
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.VIP)) === 0) {
            this.vipToggleNode.active = false;
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.GOLD)) === 0) {
            this.goldToggleNode.active = false;
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.CARD)) === 0) {
            this.cardToggleNode.active = false;
        }
        this.bVipInited = false;
        this.bAlipayWechatInited = false;
        this.bGoldInited = false;
        this.bCardInited = false;
    },

    getVipConfig: function () {
        var self = this;
        //if(cc.sys.isNative) {
        if (GameConfig.useGameConfigBak) {
            cc.g.http.sendRequest('GET', GameConfig.gameConfigBakUrl + 'agentConfig.json', {n: (new Date()).valueOf()}, function (resp) {
                self.setAgentList(resp.data)
            });
        }
        else {
            cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + 'service-admin/agentDetail/getAgentConfig', {}, function (resp) {
                self.setAgentList(resp.data)
            });
        }

        //}
        //else {
        //    let config = cc.g.utils.getJson('agentConfig');
        //this.setAgentList(config);
        // }
    },

    setAgentList: function (config) {
        let agentListNode = this.vipNode.getChildByName('agent_list').getComponent(cc.ScrollView);
        for (var i in config) {
            let agentNode = cc.instantiate(this.agentInfoPrefab);
            agentNode.getChildByName('agent_type').getComponent(cc.Sprite).spriteFrame = this.agentTypeSpriteFrames[config[i].type];
            agentNode.getChildByName('name').getComponent(cc.Label).string = config[i].agentName;
            agentNode.getChildByName('num').getComponent(cc.Label).string = config[i].num;
            agentListNode.content.addChild(agentNode);
            cc.g.utils.addClickEvent(agentNode.getChildByName('btn_charge'), this.node, 'Store', 'onClickCharge', config[i]);
        }
    },

    init: function (showType) {
        if (typeof showType === 'undefined') {
            showType = 0;
        }
        if ((GameConfig.rechargeMode & (1 << showType)) === 0) {
            for (let i = 0; i < ChargeType.MAX; i++) {
                if ((GameConfig.rechargeMode & (1 << i)) !== 0) {
                    showType = i;
                    break;
                }
            }
        }
        this.curType = showType;
        if ((GameConfig.rechargeMode & (1 << ChargeType.ALIPAY)) !== 0) {
            if (showType === ChargeType.ALIPAY) {
                this.alipayToggleNode.getComponent(cc.Toggle).check();
                if (!this.bAlipayWechatInited) {
                    this.setChargeType(ChargeType.ALIPAY);
                }
            }
            else {
                this.alipayToggleNode.getComponent(cc.Toggle).uncheck();
            }
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.WECHAT)) !== 0) {
            if (showType === ChargeType.WECHAT) {
                this.wechatToggleNode.getComponent(cc.Toggle).check();
                if (!this.bAlipayWechatInited) {
                    this.setChargeType(ChargeType.WECHAT);
                }
            }
            else {
                this.wechatToggleNode.getComponent(cc.Toggle).uncheck();
            }
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.VIP)) !== 0) {
            if (showType === ChargeType.VIP) {
                this.vipToggle.check();
                if (!this.bVipInited) {
                    this.setChargeType(ChargeType.VIP);
                }
            }
            else {
                this.vipToggle.uncheck();
            }
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.GOLD)) !== 0) {
            if (showType === ChargeType.GOLD) {
                this.goldToggleNode.getComponent(cc.Toggle).check();
                if (!this.bGoldInited) {
                    this.setChargeType(ChargeType.GOLD);
                }
            }
            else {
                this.goldToggleNode.getComponent(cc.Toggle).uncheck();
            }
        }
        if ((GameConfig.rechargeMode & (1 << ChargeType.CARD)) !== 0) {
            if (showType === ChargeType.CARD) {
                this.cardToggleNode.getComponent(cc.Toggle).check();
                if (!this.bCardInited) {
                    this.setChargeType(ChargeType.CARD);
                }
            }
            else {
                this.cardToggleNode.getComponent(cc.Toggle).uncheck();
            }
        }
    },

    onClickToggle: function (toggle, customData) {
        if (toggle.isChecked) {
            let type = parseInt(customData);
            this.setChargeType(type);
        }
    },

    setChargeType: function (type) {
        if (type === ChargeType.ALIPAY || type === ChargeType.WECHAT) {
            this.alipayOrWechatNode.active = true;
            this.vipNode.active = false;
            this.goldNode.active = false;
            this.cardNode.active = false;
            if (!this.bAlipayWechatInited) {
                this.alipayOrWechatNode.getChildByName('user_id').getComponent(cc.Label).string = '您的账号ID:' + cc.g.userMgr.userId.toString();
                this.amountEditbox = this.alipayOrWechatNode.getChildByName('amount');
            }
            this.amountEditbox.getComponent(cc.EditBox).string = '';
        }
        else if (type === ChargeType.VIP) {
            this.vipNode.active = true;
            this.alipayOrWechatNode.active = false;
            this.goldNode.active = false;
            this.cardNode.active = false;
            if (!this.bVipInited) {
                this.getVipConfig();
                this.vipNode.getChildByName('user_id').getComponent(cc.Label).string = '我的ID:' + cc.g.userMgr.userId.toString();
                this.bVipInited = true;
            }
        }
        else if (type === ChargeType.GOLD) {
            this.goldNode.active = true;
            this.vipNode.active = false;
            this.alipayOrWechatNode.active = false;
            this.cardNode.active = false;
            if (!this.bGoldInited) {
                for (let i = 1; i < 7; i++) {
                    let jsonIndex = i.toString();
                    let btn = this.goldNode.getChildByName('diamondbtn' + i);
                    this.goldNode.getChildByName('label' + i).getComponent(cc.Label).string = 'X' + REALNUM(this.goldAndCardJson[jsonIndex].num);
                    btn.getChildByName('Label').getComponent(cc.Label).string = REALNUM(this.goldAndCardJson[jsonIndex].need);
                    cc.g.utils.addClickEvent(btn, this.node, 'Store', 'onClickExchange', this.goldAndCardJson[jsonIndex]);

                }
                this.bGoldInited = true;
            }
        }
        else if (type === ChargeType.CARD) {
            this.cardNode.active = true;
            this.vipNode.active = false;
            this.alipayOrWechatNode.active = false;
            this.goldNode.active = false;
            if (!this.bCardInited) {
                for (let i = 1; i < 7; i++) {
                    let jsonIndex = (i + 6).toString();
                    let btn = this.cardNode.getChildByName('goldbtn' + i);
                    this.cardNode.getChildByName('label' + i).getComponent(cc.Label).string = 'X' + this.goldAndCardJson[jsonIndex].num;
                    btn.getChildByName('Label').getComponent(cc.Label).string = REALNUM(this.goldAndCardJson[jsonIndex].need) + '金币';
                    cc.g.utils.addClickEvent(btn, this.node, 'Store', 'onClickExchange', this.goldAndCardJson[jsonIndex]);
                }

                this.bCardInited = true;
            }
        }
        this.curType = type;
    },

    onClickCharge: function (event, customData) {
        if (cc.g.utils.setPasteboard(customData.num)) {
            let copySuccessNode = this.vipNode.getChildByName('copy_success')
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
                    if (customData.type === 0) {
                        cc.g.utils.openWXApp();
                    }
                    else {
                        cc.g.utils.openQQApp(customData.num);
                    }
                }
                textLabel.string = '复制成功' + sec + '秒后跳转'
            };
            this.schedule(this.countDownSchedule, 1);
        }
    },


    onClickAmountBtn: function (event, customData) {
        this.amountEditbox.getComponent(cc.EditBox).string = customData;
    },

    //设置金币底分
    onEditAmountEnd: function (editBox, customEventData) {
        let str = editBox.string;
        let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if(str.length === 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '请输入充值金额。');
        }
        else if (!reg.test(str)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '充值金额必须是正整数。', () => {
                editBox.string = '';
            });
        }
        else {
            let amount = parseInt(str);
            if (amount < 1) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '充值金额不能小于1元。', () => {
                    editBox.string = '1';
                });
            }
            else if (amount > 3000) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '充值金额不能大于3000元。', () => {
                    editBox.string = '3000';
                });
            }
            else {
                editBox.string = amount.toString();
            }
        }
    },

    onClickClear: function () {
        this.amountEditbox.getComponent(cc.EditBox).string = '';
    },

    onClickPlatformCharge: function () {
        cc.g.hallMgr.charge(this.curType, parseInt(this.amountEditbox.getComponent(cc.EditBox).string), (url) => {
            if(this.webview == null) {
                this.webview = this.alipayOrWechatNode.getChildByName('webview').getComponent(cc.WebView);
                this.webview.setOnJSCallback((url)=>{
                    this.webview.node.active = false;
                    cc.g.global.destoryWaiting();
                });
            }
            this.webview.node.active = true;
            this.webview.url = url;
            cc.g.global.showWaiting('正在支付');
        });
    },

    onClickExchange: function (event, msg) {
        if (msg.type === 1) {
            if (cc.g.userMgr.diamond.toNumber() < msg.need) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '钻石不足');
                return;
            }
        } else if (msg.type === 2) {
            if (cc.g.userMgr.gold.toNumber() < msg.need) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '金币不足');
                return;
            }
        }

        cc.g.global.showMsgBox(MsgBoxType.Determine, '提示', '确定兑换？', () => {
            cc.g.hallMgr.exchange(msg.type, msg.num);
        });
    },

    onClickCopyUUID: function () {
        if (cc.g.utils.setPasteboard(cc.g.userMgr.userId.toString())) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '账号复制成功。');
        }
    },

    onClickComplain: function () {
        cc.g.hallMgr.hall.enterComplain();
    },

    onClickClose: function () {
        this.node.active = false;
    },
});
