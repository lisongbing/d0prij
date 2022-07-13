
cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad: function () {
        this.passwordNode = this.node.getChildByName('password');
        this.password = [];
        this.resetPassword();

        // 显示房号的 Label
        this.pwLabel = [];
        for (let i = 0; i < this.passwordNode.children.length; i++) {
            const e = this.passwordNode.children[i];

            let L = e.getComponent(cc.Label);
            if (!L) {
                L = e.getChildByName('num').getComponent(cc.Label);
            }
            
            L.string = ''
            this.pwLabel.push(L);
        }

        // 标题
        this.title = cc.find('Label_tt', this.node).getComponent(cc.Label);
        this.title.string = this.isTea ? '加入亲友圈' : '加入房间';
    },
    

    setIsTea: function (istea) {
        this.isTea = istea;
        this.title.string = this.isTea ? '加入亲友圈' : '加入房间';
    },

    //点击虚拟键盘事件
    onClickKeyBorad: function (event, customEventData) {
        if (customEventData == 'del') {
            this.delPassword();
        }
        else if (customEventData == 'reset') {
            this.resetPassword();
        }
        else {
            this.inputPassword(customEventData);
        }
    },

    //重置密码
    resetPassword: function () {
        for (let i = 0; i < this.password.length; i++) {
            this.pwLabel[i].string = '';
        }
        this.password = [];
    },

    //删除密码
    delPassword: function () {
        if (this.password.length > 0) {
            this.pwLabel[this.password.length - 1].string = '';
            this.password.pop();
        }
    },

    //输入密码
    inputPassword: function (value) {
        if (this.password.length < this.passwordNode.childrenCount) {
            this.pwLabel[this.password.length].string = value;
            this.password.push(parseInt(value));
            this.joined = false;
        }

        if(!this.joined && (this.password.length === this.passwordNode.childrenCount)) {
            this.joined = true;
            this.tryJoinRoom(parseInt(this.password.join('')));
        }
    },

    //确认按钮事件
    onClickConfirm: function () {
        if (this.password.length < this.passwordNode.childrenCount) {
            return;
        }

        this.tryJoinRoom(parseInt(this.password.join('')));
    },

    // 尝试加入房间
    tryJoinRoom: function (id) {
        if (this.isTea) {
            this.tryJoinTea(id);
            return;
        }

        cc.log('tryJoinRoom');

        {/*
            //@api:1034,@type:req
            message GetRoomInfoReq{
                int32 roomId  = 1;
            }

            //@api:1034,@type:resp
            message GetRoomInfoResp{
                repeated int32 rules = 1;
            }
        */}

        cc.g.hallMgr.joinRoom(-1, id);
    },


    // 尝试加入亲友圈
    tryJoinTea: function (id) {
        cc.log('tryJoinTea 尝试加入亲友圈');

        cc.log(id);

        if(id === '') {
            cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '茶馆ID不能为空');
            return;
        }

        if (cc.g.hallMgr.clubList) {
            let list = cc.g.hallMgr.clubList;
            for (let i = 0; i < list.length; ++i) {
                if (list[i].id == id){
                    cc.g.global.showTipBox('不能重复加入相同茶馆');
                    return;
                }
            }
        }
        
        cc.g.hallMgr.joinClub(id, (resp)=>{
            if(resp.err == PB.ERROR.OK) {
                cc.g.global.showMsgBox(MsgBoxType.Normal, '提示', '申请成功', ()=>{
                    this.onClickBack();
                });
            }
        });
    },

    //退出按钮事件
    onClickBack: function () {
        this.resetPassword();
        if (this.isTea) {
            this.node.active = false;
        } else {
            this.node.destroy();
        }
    },
});
