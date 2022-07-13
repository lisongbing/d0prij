cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad: function () {
        this.nameEditBox = this.node.getChildByName('name').getComponent(cc.EditBox);
        this.signatureEditBox = this.node.getChildByName('signature').getComponent(cc.EditBox);
    },

    init: function () {
        this.nameEditBox.string = cc.g.userMgr.userName.length > this.nameEditBox.maxLength?cc.g.userMgr.userName.slice(0, this.nameEditBox.maxLength) :cc.g.userMgr.userName;
        let signature = (cc.g.userMgr.signature == null?'':cc.g.userMgr.signature);
        signature = signature.length > this.signatureEditBox.maxLength?signature.slice(0, this.signatureEditBox.maxLength) :signature;
        this.signatureEditBox.string = signature;
    },

    onClickSave: function () {
        let name = this.nameEditBox.string;
        let signature = this.signatureEditBox.string;

        /*var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if(regEn.test(name) || regCn.test(name)) {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '名字中不能特殊字符!');
            return;
        }*/

        cc.g.userMgr.modifyUserInfo(name, signature, ()=>{
            cc.g.hallMgr.hall.updatePlayerInfo();
            if(cc.g.hallMgr.hall.menuNode['personal'] != null && cc.g.hallMgr.hall.menuNode['personal'].active) {
                cc.g.hallMgr.hall.menuNode['personal'].getComponent('Personal').updatePersonalInfo();
            }
            this.node.active = false;
        });
    },

    onClickClose: function () {
        this.node.active = false;
    },

});
