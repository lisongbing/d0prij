
cc.Class({
    extends: cc.Component,

    properties: {
        // 预制
        playerPf: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '解散房间';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // update (dt) {},


    /* ================================================================================================================= */
    
    init: function () {
        //this.node.parent = pPage;
        this.curCD = this.CD = 60 * 3;

        this.initView();
    },

    initView: function () {
        cc.log('jiesan initView');

        let r = cc.find("Node_ctt", this.node);

        // 发起者
        this.faqizhe = cc.find("Label_name", r).getComponent(cc.Label);

        // 玩家滑动容器
        this.svPlayer = cc.find("ScrollView_player", r).getComponent(cc.ScrollView);
        this.svPlayer.scrollToTop();

        // 玩家容器
        //this.gboxPlayer = cc.find("ScrollView_player/view/content", r).getComponent(cc.Layout);
        this.gboxPlayer = this.svPlayer.content.getComponent(cc.Layout);
        this.gboxPlayer.node.removeAllChildren();
        this.gboxPlayer.updateLayout();

        // 倒计时
        this.Label_timeTip = cc.find("Label_timeTip", r).getComponent(cc.Label);

        // 同意 不同意按钮
        this.Button_yes = cc.find("Button_yes", r);
        this.Button_no = cc.find("Button_no", r);

        // 关闭按钮
        this.Button_close = cc.find("btn_close", r);
        this.Button_close.active = false;
    },

    /* ================================================================================================================= */

    // 开始投票
    starVote: function (Votedata) {
        {/*
            {
                uid: uid,
                name: name,
                sta: statu,
            }
        */}

        this.node.active = true;

        this.vote = true;

        let vd = Votedata;

        this.data = {};
        vd.forEach(e => {
            this.data[e.uid] = e;
        });

        this.svPlayer.node.width = vd.length*110 + (vd.length-1)*26;
        if (this.svPlayer.node.width > 518) {
            this.svPlayer.node.width = 518;
        }

        // 发起者
        this.faqizhe.string = `玩家[${vd[0].name}]申请解散房间, 是否同意？`;

        // 玩家容器
        this.gboxPlayer.node.destroyAllChildren();
        vd.forEach(d => {
            let r = cc.instantiate(this.playerPf);
            let ud = {};
            ud.name  = cc.find("Label_name", r).getComponent(cc.Label);
            ud.id  = cc.find("Label_id", r).getComponent(cc.Label);
            ud.head  = cc.find("mask/head", r).getComponent(cc.Sprite);
            ud.dengdai = cc.find("Label_dengdai", r);
            ud.tongyi  = cc.find("Label_tongyi", r);
            
            ud.name.string = cc.g.utils.getFormatName(d.name, 3*2);
            ud.id.string = i64v(d.uid);
            cc.g.utils.sethead(ud.head, d.icon?d.icon:'');

            d.ud = ud;

            this.upPlayer(d.uid, d.sta);

            this.gboxPlayer.node.addChild(r);
        });

        this.gboxPlayer.updateLayout();
        this.svPlayer.scrollToTop();

        // 按钮
        this.Button_yes.active = this.Button_no.active = !(vd[0].uid == cc.g.userMgr.userId);

        // 倒计时
        this.curCD = vd[0].time ? vd[0].time : this.CD;
        this.Label_timeTip.string = this.curCD + 's';
        this.schedule(this.cd, 1, this.curCD-1, 1);
    },

    // 
    cd: function (dt) {
        --this.curCD;
        if (this.curCD < 0) {
            this.curCD = 0;
        }

        this.Label_timeTip.string = this.curCD + 's';
    },

    // 更新玩家
    upPlayer: function (uid, sta) {
        let p = this.data[uid];
        if (!p) {
            cc.error(this.dbgstr('投票玩家里没有该玩家 ' + uid));
            return;
        }

        cc.g.hallMgr.curGameMgr.Voting = true;

        p.sta = sta;

        p.ud.dengdai.active = p.ud.tongyi.active = false;
        if (p.sta == 0) {
            p.ud.dengdai.active = true;
        } else if (p.sta > 0) {
            p.ud.tongyi.active = true;
        } else {
            cc.g.hallMgr.curGameMgr.Voting = false;
            p.ud.dengdai.active = true;
            p.ud.dengdai.getComponent(cc.Label).string = '( 已拒绝 )';
        }

        let agrnum = 0;
        for (const key in this.data) {
            if (this.data[key].sta > 0) {
                ++agrnum;
            }
        }
        if (agrnum >= Object.keys(this.data).length) {
            cc.g.hallMgr.curGameMgr.Voting = false;
        }

        if (sta < 0) {
            this.unschedule(this.cd);
            return -1;
        }
        
        return null;
    },

    clear: function () {
      
        this.unschedule(this.cd);

        this.faqizhe.string = '';

        this.gboxPlayer.node.removeAllChildren();
        this.gboxPlayer.updateLayout();
        this.svPlayer.scrollToTop();

        this.vote = false;

        this.node.active = false;
    },

    /* ================================================================================================================= */

    registeClose: function (fun) { 
        this.closeFun = fun;
    },
    registeYes: function (fun) { 
        this.yesFun = fun;
    },
    registeNo: function (fun) { 
        this.noFun = fun;
    },

    /* ================================================================================================================= */


    // 关闭
    onBtnClose: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose 关闭'));

        this.node.removeFromParent();

        if (this.closeFun) {
            this.closeFun();
        }
    },

    // 同意
    onBtnYes: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose 同意'));

        cc.g.utils.btnShake();

        this.Button_yes.active = this.Button_no.active = false;

        if (this.yesFun) {
            this.yesFun();
        }
    },

    // 不同意
    onBtnNo: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose 不同意'));

        cc.g.utils.btnShake();

        this.Button_yes.active = this.Button_no.active = false;

        if (this.noFun) {
            this.noFun();
        }
    },
});
