
cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '推广';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },

    start () {

    },

    // update (dt) {},

    init: function () {
        this.initView();
    },

    initView: function () {
        let r = cc.find("Node_ctt", this.node);

        // 地区
        this.Edit_area = cc.find("area", r).getComponent(cc.EditBox);
        this.Edit_area.string = '';
        // 手机
        this.Edit_phone = cc.find("phone", r).getComponent(cc.EditBox);
        this.Edit_phone.string = '';
        // 微信
        this.Edit_wx = cc.find("wx", r).getComponent(cc.EditBox);
        this.Edit_wx.string = '';
    },

    // 关闭
    onBtnClose: function (event, customEventData) {
        cc.g.utils.btnShake();
        this.node.removeFromParent();
        this.node.destroy();
    },



    // 提交
    onTijiao: function (event, customEventData) {
        cc.log(this.dbgstr('onTijiao 提交'));

        cc.g.utils.btnShake();

        // 地区
        let area = this.Edit_area.string;
        // 手机
        let phone = this.Edit_phone.string;
        // 微信
        let wx = this.Edit_wx.string;

        if(area === '') {
            cc.g.global.hint('地区不能为空');
            return;
        }
        if(phone.length != 11) {
            cc.g.global.hint('手机号不对');
            return;
        }
        if(area == '' || wx == '') {
            cc.g.global.hint('手机和微信不能为空');
            return;
        }

        let req = pbHelper.newReq(PB.PROTO.COMMIT_AGENT);
        req.origin = area;
        req.phone = phone;
        req.wx = wx;

        cc.g.networkMgr.send(PB.PROTO.COMMIT_AGENT, req, (resp) => {
            cc.log('提交', resp);
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.g.global.hint('提交成功');
                
                this.onBtnClose();
            }
        });
    },




    // 复制微信
    NOUSE_onBtnCopyWx: function (event, customEventData) {
        // cc.log(this.dbgstr('onBtnCopyWx 复制微信'));

        // this.node.active = false;

        // let res = cc.g.utils.setPasteboard(GameConfig.complainWX);
        // if (res) {
        //     cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制成功');
        // } else {
        //     //cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '复制失败');
        // }
    },
});
