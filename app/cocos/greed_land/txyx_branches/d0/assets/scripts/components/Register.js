// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.user_Name = this.node.getChildByName('user_Name');
        this.account = this.node.getChildByName('account');
        this.password = this.node.getChildByName('password');
        this.phone = this.node.getChildByName('phone');
        this.verification = this.node.getChildByName('verification');
        this.get_Btn = this.node.getChildByName('get_Btn');
    },

    start () {

    },

    update (dt) {},

    onClickRegister: function() {
        if(this.checkInput()) {
            let registerReq = pbHelper.newReq(PB.PROTO.LOGIN);
            registerReq.uuid = '';
            registerReq.account = this.account.getComponent(cc.EditBox).string;
            registerReq.pwd = this.password.getComponent(cc.EditBox).string;
            registerReq.isNew = true;
            registerReq.platform = PB.PLATFORM.ACCOUNT;

            cc.g.userMgr.register(registerReq, () => {
                cc.director.loadScene('loading', (err, scene) => {
                    cc.g.loadingMgr.startLoading(LoadingMgr.Type.Hall);
                });
            });
            //昵称和验证码
            //TODO
        }
    },

    onClickClose: function() {
        this.node.active = false;
    },

    checkInput: function() {
        let checkRegex = /^[0-9a-zA-Z]{6,10}$/;
        let phoneRegex = /^[1][3,4,5,7,8][0-9]{9}$/;
        let account = this.account.getComponent(cc.EditBox).string;
        let password = this.password.getComponent(cc.EditBox).string;
        let phone = this.phone.getComponent(cc.EditBox).string;
        let verification = this.verification.getComponent(cc.EditBox).string;
        if(account.length === 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入账号');
            return false;
        }

        if(password.length === 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入密码');
            return false;
        }

        if(phone.length === 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入手机号');
            return false;
        }

        if(verification.length === 0) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入验证码');
            return false;
        }

        if(!checkRegex.test(account)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入正确的账号');
            return false;
        }
        if(!checkRegex.test(password)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入正确的密码');
            return false;
        }

        if(!phoneRegex.test(phone)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal,'提示', '请输入正确的手机号');
            return false;
        }

        return true;
    }
});
