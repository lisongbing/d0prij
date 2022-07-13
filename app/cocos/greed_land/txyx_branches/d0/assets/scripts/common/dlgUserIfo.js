//const e = require("express");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '个人信息';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        this.initView();
    },
    initView: function () {
        let r = this.node;

        let ctt = cc.find('Node_ctt', r);

        // 头像
        this.headIcon = cc.find('head/mask/headIcon', ctt).getComponent(cc.Sprite);
        // 名字
        this.name = cc.find('name', ctt).getComponent(cc.Label);
        // ID
        this.ID = cc.find('ID', ctt).getComponent(cc.Label);
        // IP
        this.IP = cc.find('IP', ctt).getComponent(cc.Label);
        // gps
        this.gps = cc.find('gps', ctt).getComponent(cc.Label);

        // 房卡
        this.fkNum = cc.find('fk/num', ctt).getComponent(cc.Label);
        // 金币
        this.jbNum = cc.find('jb/num', ctt).getComponent(cc.Label);

        this.Node_ctt = ctt;

        // 实名认证
        this.btn_smrz = cc.find('btn_smrz', ctt);
        this.Sprite_smrz = cc.find('Sprite_smrz', ctt);

        // 手机绑定
        this.btn_sjbd = cc.find('btn_sjbd', ctt);
        // 手机更换
        this.btn_sjgh = cc.find('btn_sjgh', ctt);

        this.btn_sjbd.active = this.btn_sjgh.active = false;

        this.initSjbdjbView();
    },
    // 手机绑定解绑
    initSjbdjbView: function () {
        cc.log('initSjbdjbView');

        let r = cc.find('Node_sj_bdjb', this.node);

        // 手机绑定
        let bd = cc.find('Node_bd', r);
        this.eb_phone = cc.find('EditBox_phone', bd).getComponent(cc.EditBox);
        this.eb_pw = cc.find('EditBox_pw', bd).getComponent(cc.EditBox);

        // 手机更换
        let gh = cc.find('Node_gh', r);
        this.eb_gh_phone = cc.find('EditBox_phone', gh).getComponent(cc.EditBox);
        cc.find('phone/TEXT_LABEL', gh).getComponent(cc.Label).string = cc.g.userMgr.phoneNo;

        // 验证码
        this.eb_yzm = cc.find('EditBox_yzm', r).getComponent(cc.EditBox);
        // 验证码CD
        this.yzmCD = cc.find('yzmCD', r);
        this.yzmCD.time_ = cc.find('Label_time', this.yzmCD).getComponent(cc.Label);
        this.yzmCD.active = false;

        //
        this.btn_ok = cc.find('btn_ok', r);//.getComponent(cc.Button);;
        
        this.sjbd = bd;
        this.sjgh = gh;

        this.shouji = r;
        this.shouji.active = false;
    },


    up: function () {
        this.btn_sjbd.active = this.btn_sjgh.active = false;
        this.shouji.active = false;
        this.eb_yzm.active = this.yzmCD.active = false;


        // 头像
        let icon = this.headIcon;
        if (cc.g.userMgr.icon.length > 4) {
            cc.g.utils.setUrlTexture(icon, cc.g.userMgr.icon);
        } else {
            let spriteFrame = null;
            if (cc.g.userMgr.icon === '') {
                cc.resources.load('textures/head/head_animal_0', cc.SpriteFrame, function (err, asset) {
                    spriteFrame = asset;
                    icon.spriteFrame = spriteFrame;
                });
            } else {
                cc.resources.load('textures/head/head_animal_' + cc.g.userMgr.icon, cc.SpriteFrame, function (err, asset) {
                    spriteFrame = asset;
                    icon.spriteFrame = spriteFrame;
                });
            }
        }

        // 名字
        this.name.string = cc.g.userMgr.userName; //cc.g.utils.getFormatName(cc.g.userMgr.userName, 7*2);
        // ID
        this.ID.string = `ID:`+cc.g.userMgr.userId.toString();
        // IP
        this.IP.string = `IP:`+cc.g.userMgr.ip;

        // gps
        this.gps.string = cc.g.gpsAddress ? cc.g.gpsAddress : '未知';

        // 房卡
        let area = cc.g.hallMgr.hall.curAreaID || 2;
        this.fkNum.string = cc.g.userMgr.roomCard[area-1].toString();
        // 金币
        this.jbNum.string = cc.g.utils.realNum1(cc.g.userMgr.gold);

        //身份是否已经认证
        cc.log('cc.g.userMgr.bindSFZ', cc.g.userMgr.bindSFZ);
        this.btn_smrz.active = cc.g.userMgr.bindSFZ==0;
        this.Sprite_smrz.active = !this.btn_smrz.active;

        // 手机绑定
        cc.log('cc.g.userMgr.phoneNo', cc.g.userMgr.phoneNo);
        if (!cc.g.userMgr.phoneNo || cc.g.userMgr.phoneNo=='') {
            this.btn_sjbd.active = true;
        } else {
            this.btn_sjgh.active = true;
        }

        // 验证码CD
        this.upyzmcd();

        //this.onEditEnd();
    },

    // 验证码CD
    upyzmcd: function () {
        this.eb_yzm.active = (!cc.g.utils._yzmcd_ || cc.g.utils._yzmcd_<0);
        this.yzmCD.active = !this.eb_yzm.active;

        if (!this.yzmCD.active) {
            return;
        }

        if (this.yzmcdsch) {
            this.unschedule(this.yzmcdsch);
            this.yzmcdsch = null;
        }

        this.yzmCD.time_.string = cc.g.utils._yzmcd_;
        this.yzmcdsch = ()=>{
            if (cc.g.utils._yzmcd_<0) {
                this.yzmCD.active = false;
                this.eb_yzm.active = true;

                this.unschedule(this.yzmcdsch);
                this.yzmcdsch = null;
            }
            
            this.yzmCD.time_.string = cc.g.utils._yzmcd_;
        }

        this.schedule(this.yzmcdsch, 0.25);
    },



    // 实名认证
    onBtnSmrz: function () {
        cc.log('实名认证 onBtnSmrz');

        let pfb = cc.instantiate(cc.g.hallMgr.hall.dlgShenfenReg);
        let com = pfb.getComponent('dlgSfzdengji');
        com.dlgUserIfo = this;
        this.node.addChild(pfb);
    },

    // 手机绑定
    onBtnSjbd: function () {
        cc.log('手机绑定 onBtnSjbd');
        this.shouji.active = true;

        this.sjbd.active = true;
        this.sjgh.active = false;

        this.eb_phone.string = '';
        this.eb_pw.string = '';
        this.eb_yzm.string = '';

        //this.onBtnSjgh();
    },
    // 手机更换
    onBtnSjgh: function () {
        cc.log('手机更换 onBtnSjgh');
        this.shouji.active = true;

        this.sjbd.active = false;
        this.sjgh.active = true;

        this.eb_phone.string = '';
        this.eb_gh_phone.string = '';
        this.eb_yzm.string = '';
    },
    

    //
    onEditEnd: function (event, tag) {
        cc.log('onEditEnd');

        return;

        let p1 = this.eb_phone.string;
        let pw = this.eb_pw.string;
        let p2 = this.eb_gh_phone.string;
        let yzm = this.eb_yzm.string;

        if (this.sjbd.active) {
            cc.log('编辑绑定');
            cc.log('eb_phone', p1);
            cc.log('eb_pw', pw);
        } else if (this.sjgh.active) {
            cc.log('编辑更换');
            cc.log('eb_gh_phone', p2);
        } else {
            cc.log('编辑个寂寞');
            return;
        }

        cc.log('eb_yzm', yzm);

        if (this.sjbd.active) {
            this.btn_ok.active = (yzm!='' && pw!='' && p1.length==11);
        } else {
            this.btn_ok.active = (yzm!='' && p2.length==11);
        }
    },

    // 验证码
    onBtnYanzm: function () {
        cc.log('验证码 onBtnYanzm');

        let p1 = this.eb_phone.string;
        let p2 = cc.g.userMgr.phoneNo;   //cc.g.userMgr.phoneNo;
        let p = '';
        let t = 0;

        cc.log('ifo', {
            'eb_phone':p1,
            'phone':p2,
        });

        if (this.sjbd.active) {
            cc.log('绑定');
            p = p1;
            t = 1;
            if (p1=='' || p1.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            }
        } else if (this.sjgh.active) {
            cc.log('更换');
            p = p2;
            t = 3;
            if (p2=='' || p2.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            }
        } else {
            cc.log('验证个寂寞');
            return;
        }

        /*
            //获取手机校验码
            //@api:2501,@type:req
            message GetPhoneValidCodeReq{
                int32 type     = 1;//类型  1:绑定 2:修改密码 3:修改手机
                string phoneNo = 2;//手机号
            }

        */

        let req = pbHelper.newReq(PB.PROTO.GET_PHONE_VALIDCODE);
        req.type = t;
        req.phoneNo = p;

        cc.g.networkMgr.send(PB.PROTO.GET_PHONE_VALIDCODE, req, (resp) => {
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('请求验证码 成功  等待验证码发送到手机');
                cc.g.utils.refreshYZM();
                this.upyzmcd();
            } else {
                cc.log('请求验证码 失败');
            }
        });
    },

    // 确定
    onBtnOK: function () {
        cc.log('onBtnOK');

        let p1 = this.eb_phone.string;
        let pw = this.eb_pw.string;
        let p2 = this.eb_gh_phone.string;
        let yzm = this.eb_yzm.string;

        cc.log('ifo', {
            'eb_phone':p1,
            'eb_gh_phone':p2,
            'eb_pw':pw,
            'eb_yzm':yzm,
        });

        if (this.sjbd.active) {
            cc.log('绑定');
            if (p1=='' || p1.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            } else if (pw=='') {
                cc.g.global.hint('请输入密码');
                return;
            }
        } else if (this.sjgh.active) {
            cc.log('更换');
            if (p2=='' || p2.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            }
        } else {
            cc.log('确定个寂寞');
            return;
        }

        if (yzm=='') {
            cc.g.global.hint('请输入验证码');
            return;
        }

        if (this.sjbd.active) {
            /*
                //绑定手机
                //@api:2502,@type:req
                message BindPhoneReq {
                    string phoneNo = 1;//手机号
                    string secret  = 2;//密码
                    string validCode = 3;//手机校验码
                }
            */

            let req = pbHelper.newReq(PB.PROTO.BIND_PHONE);
            req.phoneNo = p1;
            req.secret = pw;
            req.validCode = yzm;
    
            cc.g.networkMgr.send(PB.PROTO.BIND_PHONE, req, (resp) => {
                if (!resp.err || resp.err == PB.ERROR.OK) {
                    cc.log('绑定手机 成功');
                    //cc.g.global.hint('绑定成功');
                    cc.g.userMgr.phoneNo = p1;

                    let gh = cc.find('Node_sj_bdjb/Node_gh/phone/TEXT_LABEL', this.node);
                    gh.getComponent(cc.Label).string = cc.g.userMgr.phoneNo;

                    this.shouji.active = false;
                    this.btn_sjbd.active = false;
                    this.btn_sjgh.active = true;
                } else {
                    cc.log('绑定手机 失败');
                }
            });
        } else {
            /*
                //修改绑定手机号码
                //@api:2504,@type:req
                message ModifyPhoneLoginReq{
                    string sourcePhoneNo = 1;//手机号
                    string targePhoneNo = 2;//手机号
                    string validCode = 3;//手机校验码
                }
            */

            let req = pbHelper.newReq(PB.PROTO.CHANGE_PHONE);
            req.sourcePhoneNo = cc.g.userMgr.phoneNo;
            req.targePhoneNo = p2;
            req.validCode = yzm;
    
            cc.g.networkMgr.send(PB.PROTO.CHANGE_PHONE, req, (resp) => {
                if (!resp.err || resp.err == PB.ERROR.OK) {
                    cc.log('更换手机 成功');

                    cc.g.global.hint('更换成功');

                    cc.g.userMgr.phoneNo = p2;

                    let gh = cc.find('Node_sj_bdjb/Node_gh/phone/TEXT_LABEL', this.node);
                    gh.getComponent(cc.Label).string = cc.g.userMgr.phoneNo;
                    
                    this.shouji.active = false;
                } else {
                    cc.log('更换手机 失败');
                }
            });
        }
    },



    onClickShoujiBack: function () {
        this.shouji.active = false;
    },
    onClickBack: function () {
        //cc.g.utils.btnShake();
        this.node.destroy();
    },
});
