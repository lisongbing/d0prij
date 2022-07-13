window.MsgBoxType = {
    'Normal': 1,
    'Determine': 2,
    'NewRelease' : 3,
    'YesOrNo': 4,
    'Prompt': 5,
};
cc.Class({
    extends: cc.Component,
    properties: {},

    init: function () {
        cc.g.networkMgr.addHandler(PB.PROTO.COMMON, (commonResp) => {
            cc.log('addHandler......===>.', commonResp.err)
            let errcb = null; //()=>{}
            let hideXX = false;
            let zhedang = false;
            let delayT = 0;
            
            if(commonResp.err == PB.ERROR.CLUB_NOT_EXIST_PLAYER) {
                let errorString = null;
                if(cc.sys.isNative) {
                    errorString = cc.g.utils.getError(commonResp.err);
                }
                this.showMsgBox(MsgBoxType.Normal, '提示', errorString != null?errorString:('api:' + commonResp.api + ', error code:' + commonResp.err), ()=>{
                    if(cc.g.hallMgr.hall != null) {
                        cc.g.hallMgr.hall.closeClubMenu();
                        cc.g.hallMgr.getClubList();
                    }
                });

                return;
            }
            
            if (commonResp.err == PB.ERROR.USER_NOT_IN_ROOM && cc.g.hallMgr.curGameMgr) {
                cc.g.hallMgr.curGameMgr.playerQuited(cc.g.hallMgr.curGameMgr.getSelfPlayer());
                cc.g.hallMgr.backToHall();
                return;
            }

            // 房间不存在
            if (commonResp.err == PB.ERROR.ROOM_NOT_FOUND && cc.g.hallMgr.curGameMgr) {
                cc.g.hallMgr.curGameMgr.playerQuited(cc.g.hallMgr.curGameMgr.getSelfPlayer());
                cc.g.hallMgr.backToHall();
                return;
            }

            // 创建俱乐部权限不足
            if (commonResp.err == PB.ERROR.CREAT_CLUB_PERM) {
                cc.g.hallMgr.hall.showMenu('daili').getComponent('daili').up();
                return;
            }
            
            // 加入的房间已经不存在
            if (commonResp.err == PB.ERROR.USER_IN_ROOM) {
                if (cc.g.hallMgr.hall != null && cc.g.hallMgr.hall.menuNode['club'] != null) {
                    let club = cc.g.hallMgr.hall.menuNode['club'];
                    if (this.inGame) {
                        club.onLeavedesk();
                        club.onClickClose();
                        return;
                    }
                }
            }

            // 金币场未暂停无法关闭金币场
            if (commonResp.err == PB.ERROR.GOLD_MATCH_NOT_PAUSE_CANT_CLOSE) {
                errcb = ()=>cc.g._tea_&& cc.g._tea_.showDlgGoldSet();
            }
            
            // 客户端版本过低 请重新下载新包
            if (commonResp.err == PB.ERROR.CLIENT_VERSION_TIMEOUT) {
                errcb = ()=>cc.sys.openURL(GameConfig.downloadUrl);
                delayT = 0.3;
            }
            // 有相同ip
            if (commonResp.err == PB.ERROR.HAVE_SAME_IP || 
                commonResp.err == PB.ERROR.DISTANCE_NOT_OK) {
                hideXX = true;
                errcb = ()=>{
                    if (cc.g.hallMgr.curGameMgr) {
                        cc.g.hallMgr.curGameMgr.playerQuited(cc.g.hallMgr.curGameMgr.getSelfPlayer());
                        cc.g.hallMgr.backToHall();
                    }
                }
            }

            // 有热更新
            if (commonResp.err == PB.ERROR.HAVE_NEW_HOT_UPDATE) {
                cc.log('检查到有热更新需要重启客户端');
                zhedang = true;
                hideXX = true;
                errcb = ()=>{
                    //this.scheduleOnce(()=>{
                        cc.g.networkMgr.close(true);
                        cc.game.restart();
                    //}, 1.0);
                }
            }
            
            let popf = ()=>{
                if (commonResp.err != PB.ERROR.OK //返回成功
                    && commonResp.err != PB.ERROR.TOKEN_INVAILD //玩家登陆token失效
                    && commonResp.err != PB.ERROR.UUID_NOT_EXIST) { //玩家uuid不存在 

                    zhedang = zhedang || (commonResp.err == PB.ERROR.CLIENT_VERSION_TIMEOUT);
                    
                    let errorString = cc.g.utils.getError(commonResp.err);
                    if (errorString) {
                        if(cc.sys.isNative) {
                            if (errcb) {
                                this.showMsgBox(MsgBoxType.Normal, '提示', errorString, ()=>errcb(), zhedang, hideXX);
                            } else {
                                this.hint(errorString);
                            }
                        } else {
                            this.showMsgBox(MsgBoxType.Normal, '提示', errorString + '('+ commonResp.api + ',' + commonResp.err +')', ()=>errcb&&errcb(), zhedang, hideXX);
                        }
                    } else {
                        this.showMsgBox(MsgBoxType.Normal, '提示', 'api:' + commonResp.api + ', error code:' + commonResp.err, ()=>errcb&&errcb(), zhedang, hideXX);
                    }
                }
            }

            if (delayT <= 0) {
                popf();
            } else {
                this.scheduleOnce(()=>popf(), delayT);
            }
        });
    },

    showWaiting: function (msg) {
        if (this.waitingConnectionPrefab == null || this.waitingNode != null) {
            return;
        }
        this.waitingNode = cc.instantiate(this.waitingConnectionPrefab);
        let lab = this.waitingNode.getChildByName('text').getComponent(cc.Label);
        lab.string = msg ? msg : '正在连接中';
        let rotateCircle = this.waitingNode.getChildByName('rotate_circle');
        //rotateCircle.runAction(cc.repeatForever(cc.rotateBy(0.5, 360)));
        cc.director.getScene().getChildByName('Canvas').addChild(this.waitingNode);
    },
    isWatiting: function() {
        return this.waitingNode ? true : false;
    },

    destoryWaiting: function () {
        if (this.waitingNode == null) {
            return;
        }
        this.waitingNode.destroy();
        this.waitingNode = null;
    },

    showMsgBox: function (msgType, title, content, callback, bgzd, hideXX) {
        cc.log('showMsgBox');

        if (this.messageBoxPrefab == null) {
            return;
        }

        if(msgType === MsgBoxType.Prompt) {
            this.hint(content, callback);
        } else {
            this.callback = callback;
            let messageBox = cc.instantiate(this.messageBoxPrefab);
            if (title == '提示') {
                //messageBox.getChildByName('title').active = false;
            } else {
                messageBox.getChildByName('title').getComponent(cc.Label).string = title;
            }
            
            messageBox.getChildByName('content').getComponent(cc.Label).string = content;

            let btnOk = messageBox.getChildByName('Button_close');
            btnOk.active = false;
            if (!hideXX) {
                btnOk.active = true;
                btnOk.on('click', this.onClickBtnCancel, this); 
            }
            
            let btnBgClose = messageBox.getChildByName('btn_bgclose');
            if (!(hideXX || bgzd)) {
                //btnBgClose.on('click', this.onClickBtnCancel, this);
            }
            
            let btnConfirm = messageBox.getChildByName('btns').getChildByName('btn_confirm');
            let btnCancel = messageBox.getChildByName('btns').getChildByName('btn_cancel');

            if (msgType === MsgBoxType.Normal) {
                btnCancel.active = false;
                btnConfirm.on('click', this.onClickBtnOK, this);
            } else if (msgType === MsgBoxType.Determine || msgType === MsgBoxType.YesOrNo) {
                if(msgType === MsgBoxType.YesOrNo) {
                    //btnConfirm.children[0].getComponent(cc.Label).string = '是';
                    //btnCancel.children[0].getComponent(cc.Label).string = '否';
                }
                btnCancel.on('click', this.onClickBtnCancel, this);
                btnConfirm.on('click', this.onClickBtnConfirm, this);
            } else if(msgType === MsgBoxType.NewRelease) {
                btnCancel.active = false;
                btnConfirm.on('click', this.onClickNewReleaseBtnOK, this);
            }
            messageBox.zIndex = 1000;
            cc.director.getScene().getChildByName('Canvas').parent.addChild(messageBox);
            //cc.director.getScene().addChild(messageBox);
            let vs = cc.view.getVisibleSize();
            messageBox.x = vs.width/2;
            messageBox.y = vs.height/2;

            let box = this.msgbox;
            this.msgbox = messageBox;

            if (box) {
                cc.log('有已经弹出的 MSGBOX 先移除');
                box.destroy();
            }
        }
    },

    showTipBox: function (content, cb, bgzd) {
        //bgzd 背景阻挡
        this.showMsgBox(MsgBoxType.Normal, '提示', content, cb, bgzd);
    },

    onClickBtnOK: function (event) {
        if (this.callback != null) {
            this.callback();
        }
        this.msgbox.destroy();
        this.msgbox = null;
    },

    onClickNewReleaseBtnOK: function (event) {
        if (this.callback != null) {
            this.callback();
        }
    },

    onClickBtnConfirm: function (event) {
        if (this.callback != null) {
            this.callback();
        }
        this.msgbox.destroy();
        this.msgbox = null;
    },

    onClickBtnCancel: function (event) {
        this.msgbox.destroy();
        this.msgbox = null;
    },

    hint: function (content, cb) {
        if (!cc.g.pf.hint){
            cc.log('还没有hint控件');
            //this.showTipBox('还没有hint控件');
            return;
        }

        let pf = cc.instantiate(cc.g.pf.hint);
        cc.director.getScene().getChildByName('Canvas').addChild(pf);
        
        pf.getChildByName('text').getComponent(cc.Label).string = content;

        pf.position = cc.Vec2(0,-100);

        let seq = cc.sequence(
            cc.delayTime(0.1), 
            cc.moveTo(0.5, cc.Vec2(0, 25)), 
            cc.delayTime(0.5), 
            cc.callFunc(function (target) {
                pf.removeFromParent();
            })
        );

        pf.runAction(seq);
    },

    hideSubGameProDlg: function () {
        cc.log('hideSubGameProDlg');

        if (this.SubGameProDlg) {
            this.SubGameProDlg.destroy();
            this.SubGameProDlg = null;
        }
    },
});
