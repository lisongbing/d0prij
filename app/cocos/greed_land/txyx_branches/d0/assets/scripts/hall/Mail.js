//const e = require("express");

cc.Class({
    extends: cc.Component,

    properties: {
        item: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '邮件';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        let r = this.node;

        this.Node_nomail = cc.find('Node_nomail', r);
        this.Node_ctt = cc.find('Node_ctt', r);

        this.mail_list = cc.find('mail_list', this.Node_ctt);
        this.mail_detail = cc.find('mail_detail', this.Node_ctt);

        cc.g.utils.addClickEvent(this.mail_detail.getChildByName('btn_back'), this.node, 'Mail', 'onBtnDelete');
    },

    init: function () {
        cc.log('mail init');

        this.node.active = true;
        this.mail_detail.active = false;
        this.Node_nomail.active = this.Node_ctt.active = false;

        let req = pbHelper.newReq(PB.PROTO.NOTICE);
        this.mailList = [];
        cc.g.networkMgr.send(PB.PROTO.NOTICE, req, (resp) => {
            cc.g.hallMgr.mailList = resp.list;
            this.updateMailList();
        });
    },

    updateMailList: function () {
        cc.log('mail updateMailList');

        this.Node_nomail.active = this.Node_ctt.active = false;

        if (cc.g.hallMgr.mailList.length < 1) {
            this.Node_nomail.active = true;
            return;
        }

        this.Node_ctt.active = true;

        if (false) {
            cc.g.hallMgr.mailList.push(cc.g.hallMgr.mailList[0]);
            cc.g.hallMgr.mailList.push(cc.g.hallMgr.mailList[0]);
            cc.g.hallMgr.mailList.push(cc.g.hallMgr.mailList[0]);
            cc.g.hallMgr.mailList.push(cc.g.hallMgr.mailList[0]);
        }

        let scrollView = this.mail_list.getComponent(cc.ScrollView);
        let ctt = scrollView.content;
        ctt.destroyAllChildren();

        this.mitems = [];
        let list = cc.g.hallMgr.mailList;
        for (let i = 0; i < list.length; ++i) {
            let e = list[i];

            let pfb = cc.instantiate(this.item);
            pfb.idx = i;
            pfb.ud = e;
            
            //邮件标题
            let title = pfb.getChildByName('title').getComponent(cc.Label);
            let titleStr = e.title + ':';
            if(titleStr.length > 16) {
                titleStr = titleStr.substr(0, 16) + '......';
            }
            title.string = titleStr;

            //邮件日期
            let datetime = pfb.getChildByName('date_time').getComponent(cc.Label);
            datetime.string = cc.g.utils.getFormatTimeXXX(e.datetime.toNumber() * 1000, 'M|-|D| |h|:|m|:|s');

            //flag
            let flag = pfb.getChildByName('flag');
            flag.active = false;
            let flag_guan = pfb.getChildByName('flag_guan');
            flag_guan.active = true;
            pfb.flag = flag;
            pfb.flag_guan = flag_guan;


            //
            let tog = pfb.getComponent(cc.Toggle);
            if (false) {
                tog.check();
            } else {
                tog.uncheck();
            }
            pfb.tog = tog;

            this.mitems.push(pfb);

            //
            cc.g.utils.addCheckEvent(tog.node, this.node, 'Mail', 'onClickViewDetails', pfb);

            ctt.addChild(pfb);
        }

        this.mitems[0] && this.mitems[0].tog.check();
    },

    onClickViewDetails: function (event, pfb) {
        this.curMail = pfb;
        let mailInfo = pfb.ud;
        this.mail_detail.active = true;

        this.mail_detail.getChildByName('title').getComponent(cc.Label).string = mailInfo.title;
        this.mail_detail.getChildByName('content').getComponent(cc.RichText).string = mailInfo.content.replace(/\\n/g, '\n');
        //this.mail_detail.getChildByName('date_time').getComponent(cc.Label).string = cc.g.utils.getFormatTime(mailInfo.datetime.toNumber() * 1000, 'M月d日');

        pfb.flag.active = true;
        pfb.flag_guan.active = false;
    },

    onBtnDelete: function (event) {
        cc.g.utils.btnShake();
        
        let idx = this.curMail.idx;

        this.curMail.destroy();

        if (this.mitems[idx+1]) {
            this.mitems[idx+1].tog.check();
        } else if (this.mitems[idx-1]) {
            this.mitems[idx-1].tog.check();
        } else {
            this.Node_nomail.active = true;
            this.Node_ctt.active = false;
        }

        let a = [];
        for (let i = 0, j = 0; i < this.mitems.length; ++i) {
            if(i != idx) {
                this.mitems[i].idx = j++;
                a.push(this.mitems[i]);
            }
        }
        
        this.mitems = a;

        // var tar = event.currentTarget;
        // this.scheduleOnce(
        //     function() {
        //         this.mailDetailNode.active = false;
        //         this.mail_list.active = true;
        //     }, 
        //     tar.getComponent(cc.Button).duration + 0.1
        // );
    },


    onClickBack: function () {
        cc.g.utils.btnShake();
        this.node.destroy();
    },
});


/*
cc.Class({
    extends: cc.Component,

    properties: {
        mailDetailPrefab: {
            default: null,
            type: cc.Prefab,
        }
    },

    onLoad: function () {

    },

    init: function () {
        this.node.active = true;
        if (!this.inited) {
            this.inited = true;
        }
        if (this.mailDetailNode != null) {
            this.mailDetailNode.active = false;
        }
    },

    updateMailList: function () {
        let scrollView = this.node.getChildByName('mail_list').getComponent(cc.ScrollView);
        scrollView.content.getComponent('UIList').setItem(cc.g.hallMgr.mailList.length, (i, mailInfoNode) => {
            //邮件标题
            let mailInfo = cc.g.hallMgr.mailList[i];
            let title = mailInfoNode.getChildByName('title').getComponent(cc.Label);
            let titleStr = mailInfo.title + ':' + mailInfo.content;
            if(titleStr.length > 16) {
                titleStr = titleStr.substr(0, 16) + '......';
            }
            let breakLinePos = titleStr.indexOf('\\n');
            if(breakLinePos > 0) {
                titleStr = titleStr.substr(0, breakLinePos) + '......';
            }
            title.string = titleStr;

            //邮件日期
            let datetime = mailInfoNode.getChildByName('date_time').getComponent(cc.Label);
            datetime.string = cc.g.utils.getFormatTime(mailInfo.datetime.toNumber() * 1000, 'M月d日');

            //添加进入按钮响应事件
            let enterBtn = mailInfoNode.getChildByName('bg');
            cc.g.utils.addClickEvent(enterBtn, this.node, 'Mail', 'onClickViewDetails', mailInfo);
        });
    },

    onClickBack: function () {
        this.node.active = false;
    },

    onClickViewDetails: function (event, mailInfo) {
        if (this.mailDetailNode == null) {
            this.mailDetailNode = cc.instantiate(this.mailDetailPrefab);
            this.node.addChild(this.mailDetailNode);
            cc.g.utils.addClickEvent(this.mailDetailNode.getChildByName('btn_back'), this.node, 'Mail', 'onClickViewDetailsBack', mailInfo);
        }
        this.mailDetailNode.active = true;

        this.mailDetailNode.getChildByName('title').getComponent(cc.Label).string = mailInfo.title;


        this.mailDetailNode.getChildByName('content').getComponent(cc.RichText).string = mailInfo.content.replace(/\\n/g, '\n');
        this.mailDetailNode.getChildByName('date_time').getComponent(cc.Label).string = cc.g.utils.getFormatTime(mailInfo.datetime.toNumber() * 1000, 'M月d日');
    },

    onClickViewDetailsBack: function () {
        this.mailDetailNode.active = false;
    },
});

*/
