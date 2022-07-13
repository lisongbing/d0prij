//const e = require("express");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '信息登记';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        let r = this.node;

        this.Node_ctt = cc.find('Sprite_ctt', r);

        this.EditBox_name = cc.find('EditBox_name', this.Node_ctt).getComponent(cc.EditBox);
        this.EditBox_sfz = cc.find('EditBox_sfz', this.Node_ctt).getComponent(cc.EditBox);

        this.Sprite_nodj = cc.find('Sprite_nodj', this.Node_ctt);
        this.Button_dengji = cc.find('Button_dengji', this.Node_ctt);

        this.EditBox_name.string = '';
        this.EditBox_sfz.string = '';
        this.Button_dengji.active = false;
        this.Sprite_nodj.active = !this.Button_dengji.active;
    },

    init: function () {
    },

    onEditEnd: function (event, tag) {
        cc.log('onEditEnd');

        let s1 = this.EditBox_name.string;
        let s2 = this.EditBox_sfz.string;
        cc.log('this.EditBox_name.string', );
        cc.log('this.EditBox_sfz.string', this.EditBox_sfz.string);

        this.Button_dengji.active = (s1!='' && s2.length==18);
        this.Sprite_nodj.active = !this.Button_dengji.active;
    },

    onBtnReg: function (event, tag) {
        cc.log('onEditEnd');

        /*
            //实名认证消息
            //@api:2403,@type:req
            message ShiMingReq{
                string name = 1;//姓名
                string idName = 2;//身份证号码
            }
        */

        let req = pbHelper.newReq(PB.PROTO.SHI_MING_REN_ZHENG);
        req.name = this.EditBox_name.string;
        req.idName = this.EditBox_sfz.string;

        cc.g.networkMgr.send(PB.PROTO.SHI_MING_REN_ZHENG, req, (resp) => {
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('实名认证消息 成功');
                cc.g.global.hint('登记成功');
                cc.g.userMgr.bindSFZ = 1;
                cc.g.userMgr.isNeedBingSFZ = 1;
                cc.g.isShenfenReg = true;
                this.node.destroy();

                if (this.dlgUserIfo) {
                    this.dlgUserIfo.up();
                }
            } else {
                cc.log('实名认证消息 失败');
            }
        });
    },

    onClickBack: function () {
        //cc.g.utils.btnShake();

        // 在个人信息界面打开的本界面
        if (this.dlgUserIfo) {
            this.node.destroy();
            return;
        }

        if (!cc.sys.needShenfenReg) {
            this.node.destroy();
            cc.g.hallMgr.hall.popGuangGao();
            return;
        }

        cc.g.audioMgr.stopBGM();
        cc.g.userMgr.logout();
        cc.g.voiceMgr.logout();
    },
});
