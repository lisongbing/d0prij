//const e = require("express");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '手机登录';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        this.initView();
    },
    initView: function () {
        cc.log('手机登录 initView');

        let r = this.node;

        // 手机登录
        let login = cc.find('Node_login', r);
        this.eb_phone1 = cc.find('EditBox_phone', login).getComponent(cc.EditBox);
        this.eb_pw1 = cc.find('EditBox_pw', login).getComponent(cc.EditBox);
        this.Node_login = login;

        // 忘记密码
        let repw = cc.find('Node_repw', r);
        this.eb_phone2 = cc.find('EditBox_phone', repw).getComponent(cc.EditBox);
        this.eb_pw2 = cc.find('EditBox_pw', repw).getComponent(cc.EditBox);
        this.eb_yzm = cc.find('EditBox_yzm', repw).getComponent(cc.EditBox);

        // 验证码CD
        this.yzmCD = cc.find('yzmCD', repw);
        this.yzmCD.time_ = cc.find('Label_time', this.yzmCD).getComponent(cc.Label);
        this.yzmCD.active = false;

        this.Node_repw = repw;

        this.Node_login.active = true;
        this.Node_repw.active = false;

        let NO = cc.sys.localStorage.getItem('lastLoginPhoneNo');
        this.eb_phone1.string = NO ? NO : '';
        let PW = cc.sys.localStorage.getItem('lastLoginPhonePW');
        this.eb_pw1.string = PW ? PW : '';
        
        this.upyzmcd();
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

    // 忘记密码
    onBtnWjmm: function () {
        cc.log('onBtnWjmm');

        this.eb_phone2.string = '';
        this.eb_pw2.string = '';
        this.eb_yzm.string = '';

        this.Node_login.active = false;
        this.Node_repw.active = true;
    },
    

    // 验证码
    onBtnYanzm: function () {
        cc.log('验证码 onBtnYanzm');

        let p2 = this.eb_phone2.string;

        if (p2=='' || p2.length!=11) {
            cc.g.global.hint('手机号错误');
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
        req.type = 2;
        req.phoneNo = this.eb_phone2.string;

        cc.g.networkMgr.send(PB.PROTO.GET_PHONE_VALIDCODE, req, (resp) => {
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('手机登录请求验证码 成功  等待验证码发送到手机');
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

        let p1 = this.eb_phone1.string;
        let pw1 = this.eb_pw1.string;

        let p2 = this.eb_phone2.string;
        let pw2 = this.eb_pw2.string;
        let yzm = this.eb_yzm.string;

        cc.log('ifo', {
            'p1':p1,
            'pw1':pw1,
            'p2':p2,
            'pw2':pw2,
            'yzm':yzm,
        });

        if (this.Node_login.active) {
            cc.log('登录');
            if (p1=='' || p1.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            } else if (pw1=='') {
                cc.g.global.hint('请输入密码');
                return;
            }
        } else if (this.Node_repw.active) {
            cc.log('忘记密码');
            if (p2=='' || p2.length!=11) {
                cc.g.global.hint('手机号错误');
                return;
            } else if (pw2=='') {
                cc.g.global.hint('请输入密码');
                return;
            }

            if (yzm=='') {
                cc.g.global.hint('请输入验证码');
                return;
            }
        } else {
            cc.log('点了个寂寞');
            return;
        }

        if (this.Node_login.active) {
            // 手动登录
            cc.g.sdLogin = true;
            
            cc.g.userMgr.loginWithPhone(
                p1, pw1,
                () => {
                    cc.log('手机登录成功');
                    cc.sys.localStorage.setItem('lastLoginPhoneNo', p1);
                    cc.sys.localStorage.setItem('lastLoginPhonePW', pw1);
                    cc.director.loadScene('loading', (err, scene) => {
                        cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                    });
                }
            );
        } else {
            /*
                //修改手机登录密码
                //@api:2503,@type:req
                message ModifyPhoneLoginSecretReq{
                    string phoneNo = 1;//手机号
                    string secret  = 2;//密码
                    string validCode = 3;//手机校验码
                }
            */

            let req = pbHelper.newReq(PB.PROTO.MODIFY_PHONE_SECRET);
            req.phoneNo = p2;
            req.secret = pw2;
            req.validCode = yzm;
    
            cc.g.networkMgr.send(PB.PROTO.MODIFY_PHONE_SECRET, req, (resp) => {
                if (!resp.err || resp.err == PB.ERROR.OK) {
                    cc.log('修改密码 成功');
                    cc.g.global.hint('操作成功');
                    this.Node_login.active = true;
                    this.Node_repw.active = false;
                } else {
                    cc.log('修改密码 失败');
                }
            });
        }
    },


    onClickBack: function () {
        //cc.g.utils.btnShake();

        if (this.Node_login.active) {
            this.node.destroy();
            return;   
        }

        this.Node_login.active = true;
        this.Node_repw.active = false;
    },
});
