
let GameBase = require('GameBase');

let DEF = require('ddz5Def');
let ctrls = require('ddz5Ctrls');

cc.Class({
    extends: GameBase,

    properties: {
        // 普通图集
        pageAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        // 卡牌图集
        cardAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        // 卡牌预制
        PfCard: {
            default: null,
            type: cc.Prefab,
        },

        // 卡牌类型预制
        PfCardsType: {
            default: null,
            type: cc.Prefab,
        },

        // 游戏结算预制
        settlementPf: {
            default: null,
            type: cc.Prefab,
        },

        // 游戏结算 玩家预制
        SIPlayerPf: {
            default: null,
            type: cc.Prefab,
        },

        // 总结算预制
        settleFinalPf: {
            default: null,
            type: cc.Prefab,
        },
        // 总结算玩家预制
        settleFPPf: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '跑得快页面';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(this.dbgstr('onLoad'));

        this.gameMgr = cc.g.ddz5Mgr;

        this._super();

        this.pGame = cc.g.ddz5Mgr;
        this.pGame.gameScript = this;
        this.pGame.DMode.isDrive = false;
        this.pGame.audio.bgmGame();

        this.isbpm = this.pGame.isBackPlayMode();

        // 初始化界面
        this.initView();

        // 界面加载完成
        this.pGame.gameScriptLoaded();

        // 更新页面
        this.upPage();

        this.pGame.DMode.isDrive = true;

        if (this.isbpm) {
            if (this.pGame.backPlay) {
                this.pGame.backPlay.gameLoaded();
            }

            this.pGame.backPlay.begin();
            return;
        }

        //if (this.pGame.roomInfo.clubId && this.pGame.players.length>=this.pGame.roomInfo.total) {
        if (this.pGame.roomInfo.curGameNum <= 0) {
            if (this.pGame.players.length>=this.pGame.roomInfo.total) {
                if (!this.playerView[0].player.isReady) {
                    this.scheduleOnce(()=>{
                        this.onButtonReady();
                    }, 0.25);
                }
            }
        }
    },

    start () {
        this.pGame.gameScript = this;
    },

    // update (dt) {},
    
    /* =====初始化界面============================================================================================================ */

    // 初始化界面
    initView: function (info) {
        cc.log(this.dbgstr('initView'));

        let r = this.node;

        this.deskbg = cc.find("deskbg", r).getComponent(cc.Sprite);

        // 调试按钮
        this.DBG_Button = cc.find("DBG_Button", r);
        this.DBG_Button.zIndex = 1000;
        this.DBG_Button.active = false;

        // 阻挡层
        this.Node_BIE = cc.find("Node_BIE", r);
        this.Node_BIE.active = false;

        // 全屏点击穿透
        this.clcSwallow = cc.find("ClickSwallow", r).getComponent('ClickSwallow');
        this.clcSwallow.node.active = false;
        this.clcSwallow.endCall = function(){
            this.onClickSwallow();
        }.bind(this);

        // 桌子上的规则文字
        this.Label_deskrule = cc.find("Label_deskrule", r);
        if (this.Label_deskrule) {
            this.Label_deskrule = this.Label_deskrule.getComponent(cc.Label);
            this.Label_deskrule.node.active = false;
        }

        // 低分 局数
        let Sprite_df_js = cc.find("Sprite_df_js", r);
        this.Label_turn = cc.find("Label_turn", Sprite_df_js).getComponent(cc.Label);
        this.Label_difen = cc.find("Label_difen", Sprite_df_js).getComponent(cc.Label);
        // 低分增加表现
        this.Node_dfadd = cc.find("Node_dfadd", r);
        this.Node_dfadd.oy = this.Node_dfadd.y;
        this.Node_dfadd.sco = cc.find("Node_dfadd/Label_sco", r).getComponent(cc.Label);
        this.Node_dfadd.active = false;
        
        // 准备按钮
        this.ButtonReady = cc.find("Node_gmfreeBtns/Button_ready", r);
        // 亲友圈邀请
        this.Button_qyqyq = cc.find("Node_gmfreeBtns/Button_2", r);
        // 邀请好友
        this.Button_yqhy = cc.find("Node_gmfreeBtns/New Node", r);

        // 第一次空闲的提示
        this.Node_gmfreetip = cc.find("Node_gmfreetip", r);

        // 第一次空闲的一些按钮
        this.Node_gmfreeBtns = cc.find("Node_gmfreeBtns", r);

        // 出牌选择
        this.Node_outChoose = cc.find("Node_outChoose", r);
        this.Node_outChoose.active = false;

        // 记牌器
        this.Button_jpqActive = cc.find("Button_jpqActive", r);
        this.Button_jpqActive.active = false;
        let Sprite_jipaiqi = cc.find("Sprite_jipaiqi", r);
        this.jiPaiqi = new ctrls.JipaiqiView();
        this.jiPaiqi.init(Sprite_jipaiqi);

        // 托管提示
        this.Node_tgts = cc.find("Node_tgts", r);
        this.Node_tgts.desc = cc.find("text", this.Node_tgts).getComponent(cc.Label);
        this.Node_tgts.active = false;

        // 初始化发牌
        this.initSendCard();

        // 初始地主牌
        this.initDizhuCard();

        // 初始化操作按钮
        this.initOperate();

        // 玩家视图
        this.initPlayerView();

        // 初始化动画层
        this.initAnimationView();

        // 回放相关
        this.initBackPlay();
    },
    onClickSwallow: function () {
        cc.log(this.dbgstr('onClickSwallow'));

        let ri = this.pGame.roomInfo;
        
        if (this.interactView) {
            this.interactView.node.active = false;
            this.interactView = null;
            this.clcSwallow.node.active = false;
        }

        if (this.Node_outChoose) {
            this.Node_outChoose.active = false;
            this.clcSwallow.node.active = false;
        }
    },

    // 初始化发牌
    initSendCard: function () {
        cc.log(this.dbgstr('initSendCard'));

        let o = {};

        o.r = cc.find("Node_sendCard", this.node);

        o.StarPos = cc.find("Sprite_starPos", o.r).getPosition();
        cc.find("Sprite_starPos", o.r).removeFromParent();

        o.toPos = [];
        while (true) {
            let i = o.toPos.length + 0;
            let node = cc.find("p"+i, o.r);

            if (!node) {
                break;
            }
        
            o.toPos.push(node.getPosition());
            node.removeFromParent();
        }

        o.Node_ddp = cc.find("Node_ddp", o.r);
        o.Node_ddp.active = false;
        o.dizhupai = [];
        [0,1,2,3,4].forEach(e => {
            let com = cc.find("Sprite_"+e, o.Node_ddp).getComponent(cc.Sprite);
            com.node.oPos = com.node.getPosition();
            o.dizhupai.push(com);
        });


        o.adzPos = cc.find("padz", o.r).getPosition();
        cc.find("padz", o.r).removeFromParent();

        //o.r.removeAllChildren();
        o.r.active = false;

        this.sendCardHelp = o;
    },

    // 初始地主牌
    initDizhuCard: function () {
        cc.log(this.dbgstr('initDizhuCard'));

        // 地主牌
        let o = {};
        o.r = cc.find("Sprite_dzp", this.node);
        o.r.active = false;
        o.dizhupai = [];
        [0,1,2,3,4].forEach(e => o.dizhupai.push(cc.find("Sprite_"+e, o.r).getComponent(cc.Sprite)));
        this.dizhuCardNode = o;

        // 暗地主牌
        o = {};
        o.r = cc.find("Sprite_andzp", this.node);
        o.r.active = false;
        o.card = cc.find("Sprite_0", o.r).getComponent(cc.Sprite);
        this.adzCardNode = o;
    },

    // 初始化操作按钮
    initOperate: function () {
        cc.log(this.dbgstr('initOperate'));

        let r = cc.find("Node_operate", this.node);

        //'jiao','jiaono','la','lano','dao','daono','geng','han','xuanpai','pass', 'rexuan','tishi','chupai',
        this.optBtns = {};
        for (const k in DEF.OBK) {
            this.optBtns[k] = cc.find("Button_"+DEF.OBK[k], r) ;
        }

        this.Node_ottp = cc.find("Node_ottp", r);
        this.Node_ottp.active = false;

        r.active = false;
        this.Node_opt = r;
    },

    // 初始化玩家视图
    initPlayerView: function () {
        cc.log(this.dbgstr('initPlayerView'));

        let pv = this.playerView = [];

        let Node_player = cc.find("Node_player", this.node);

        while (true) {
            let i = pv.length + 1;
            let node = cc.find("Node_p"+i, Node_player);

            if (!node) {
                break;
            }

            cc.log('    ' + 'Node_player' + i);
         
            let view = new ctrls.PlayerView();
            view.init(node, i-1, this);

            pv.push(view);
        }
    },
    
    // 初始化动画层
    initAnimationView: function () {
        cc.log(this.dbgstr('initAnimationView'));

        this.anmView = {};

        let r = cc.find("Node_animation", this.node);
        r.active = false;
        this.anmView.r = r;

        // 测试动画0
        let Node_t0 = cc.find("Node_t0", r);
        this.anmView.t0 = this.crtAnmObj(Node_t0);

        // 牌型全屏动画
        let Node_t1 = cc.find("Node_t1", r);
        this.anmView.comPubAnm = this.crtAnmObj(Node_t1);

        // 定地主
        let Node_dingdz = cc.find("Node_dingdz", r);
        this.anmView.ddzAnm = this.crtAnmObj(Node_dingdz);
        // 暗地主
        let Node_andz = cc.find("Node_andz", r);
        this.anmView.adzAnm = this.crtAnmObj(Node_andz);

        // 王炸
        let Node_wz = cc.find("Node_wz", r);
        this.anmView.wzAnm = this.crtAnmObj(Node_wz);
        // 8头炸
        let Node_8tz = cc.find("Node_8tz", r);
        this.anmView._8tzAnm = this.crtAnmObj(Node_8tz);
        // 天王炸
        let Node_twz = cc.find("Node_twz", r);
        this.anmView.twzAnm = this.crtAnmObj(Node_twz);
    },

    // 玩家操作动画
    comPubAnm:function (name, fun) {
        this.anmView.r.active = true;

        if (name=='wangzha') {
            this.anmView.wzAnm.onec('wangzha', ()=>fun&&fun());
        } else if (name=='8touzha') {
            this.anmView._8tzAnm.onec('touzha', ()=>fun&&fun());
        } else if (name=='tianwangzha') {
            this.anmView.twzAnm.onec('touzha', ()=>fun&&fun());
        } else {
            this.anmView.comPubAnm.stop();
            this.anmView.comPubAnm.onec(name, ()=>fun&&fun());
        }
        

        if (name == 'feij') {
            this.pGame.audio.feiji();
        } else if (name == 'zhadan') {
            this.pGame.audio.boom();
        } else if (name == 'wangzha') {
            this.pGame.audio.wangzha();
        } else if (name == '8touzha') {
            this.pGame.audio.tw8tou();
        } else if (name == 'tianwangzha') {
            this.pGame.audio.tw8tou();
        } else if (name == 'shunzi') {
            //this.pGame.audio.boom();
        } else if (name == 'liandui') {
            this.pGame.audio.liandui();
        }
    },
    /* =================================================================================================================== */


    // 更新视图 23
    upPage: function () {
        cc.log(this.dbgstr('upPage'));

        cc.g.hallMgr.inGameMenu.upteagold();

        this.upGamesCom();
        
        let ri = this.pGame.roomInfo;

        // 准备按钮
        this.Node_gmfreeBtns.active = true
        this.ButtonReady.active = (ri.status == DEF.RMSTA.Free.v) && (! this.pGame.uidPlayers[this.pGame.selfUID].isReady);

        this.Button_qyqyq.active = ri.clubId > 0;

        // 第一次空闲的一些按钮
        if ((ri.curGameNum<1) && (ri.status == DEF.RMSTA.Free.v)) {
            this.Button_yqhy.active = true;
        } else {
            this.Button_qyqyq.active = this.Button_yqhy.active = false;
        }

        // 俱乐部的返回大厅
        cc.g.hallMgr.inGameMenu.upBtnShow();

        // 出牌选择
        this.Node_outChoose.active = false;

        this.upTuoguanTishi();
        
        // 更新局数
        this.upTurn();
        this.upDifen();

        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            e.upView();
        }

        // 操作按钮
        this.upOperate();

        // 地主 暗地主 牌 显示
        this.upDizhuPai();

        // 记牌器
        this.jiPaiqi.up();

        // 判断解散
        this.jiesanView && this.jiesanView.clear();
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            if (e.player && e.player.voteSta) {
                e.player.askJiesan();
                break;
            }
        }

        // 回放的相关处理
        this.upBackPlay();
    },

    // 更新局数
    upTurn: function () {
        let ri = this.pGame.roomInfo;

        if (ri.status == DEF.RMSTA.Free.v) {
            //this.Label_turn.node.active = false;
            //return;
        }

        //this.Label_turn.node.active = true;

        if ((ri.type == 2) || (ri.GameNum > ri.curGameNum)) {
            this.Label_turn.string = ri.curGameNum + '/' + ri.GameNum;
        } else {
            this.Label_turn.string = ri.curGameNum;
        }
    },

    // 更新底分
    upDifen: function () {
        let ri = this.pGame.roomInfo;

        if (!this.pGame.diFenadd) {
            this.Label_difen.string = this.pGame.diFen;
            return;
        }

        let add = parseFloat((this.pGame.diFen - parseFloat(this.Label_difen.string)).toFixed(2));

        this.Label_difen.string = this.pGame.diFen;

        // 加底分动画
        this.Node_dfadd.active = true;
        this.Node_dfadd.sco.string = '+'+add;
        this.Node_dfadd.y = this.Node_dfadd.oy;
        this.Node_dfadd.runAction(cc.sequence(
            cc.moveTo(0.6, cc.Vec2(this.Node_dfadd.x, this.Node_dfadd.oy+100)),
            cc.callFunc(
                function (params) {
                    this.Node_dfadd.active = false;
                },
                this,null
            )
        ));
    },
    

    // 显示操作按钮
    upOperate: function () {
        cc.log('upOperate', this.pGame.roomInfo);
        cc.log('DEF.RMSTA', DEF.RMSTA);

        if(this.pGame.isBackPlayMode()){
            this.Node_opt.active = false;
            return;
        }

        let ri = this.pGame.roomInfo;
        if (ri.status < DEF.RMSTA.Jiao.v) {
            this.Node_opt.active = false;
            return;
        }

        let p = this.playerView[0].player;
        this.Node_opt.active = p.isCurPlayer();
        if (!this.Node_opt.active) return;

        let btns = this.optBtns;
        for (const k in btns) {
            btns[k].active = false;
        }

        // 目前有个小概率出现 游戏中途房间状态变为叫地主状态的情况 
        // 目前找不到原因 暂时用这个办法规避
        if (ri.status == DEF.RMSTA.Jiao.v) {
            this.playerView.forEach(e => {
                if (e.player && e.player.shenfen==DEF.SFCZ.DZ) {
                    ri.status = DEF.RMSTA.Play.v;
                }
            });
        }

        let k = DEF.OBK;

        if (ri.status == DEF.RMSTA.Jiao.v) {
            btns[k.jiao].active = btns[k.jiaono].active = true;

        } else if (ri.status == DEF.RMSTA.Dao.v) {
            btns[k.dao].active = btns[k.daono].active = true;

        } else if (ri.status == DEF.RMSTA.La.v) {
            btns[k.la].active = btns[k.lano].active = true;

        } else if (ri.status == DEF.RMSTA.Geng.v) {
            btns[k.geng].active = btns[k.han].active = true;

        } else if (ri.status == DEF.RMSTA.Han.v) {
            btns[k.xuanpai].active = true;

        } else if (ri.status == DEF.RMSTA.Play.v) {
            btns[k.pass].active = btns[k.rexuan].active = btns[k.tishi].active = btns[k.chupai].active = true;

        } else {
            
        }

        btns[k.pass].active = (ri.status>=DEF.RMSTA.Play.v && !p._1stOut);
    },

    // 操作动画
    onOptAnm: function (view, opt) {
        let sch = this.sendCardHelp;
        sch.r.active = true;

        let frm = null;
        let wp = null;

        if (opt == DEF.PlayerOpt.DingDizhu.v) {
            // 地主标签
            frm = this.pageAtlas.getSpriteFrame('ddz5_img_dz');
            wp = view.Sprite_dizhu.node.convertToWorldSpaceAR(cc.v2(0, 0));
        } else if (opt == DEF.PlayerOpt.AnDizhu.v) {
            // 暗地主标签
            frm = this.pageAtlas.getSpriteFrame('ddz5_img_adz');
            wp = view.Sprite_dizhu.node.convertToWorldSpaceAR(cc.v2(0, 0));
        } else if (opt == DEF.PlayerOpt.Dao.v) {
            // 倒标签
            frm = this.pageAtlas.getSpriteFrame('ddz5_img_dao');
            wp = view.Sprite_daogeng.node.convertToWorldSpaceAR(cc.v2(0, 0));
        } else if (opt == DEF.PlayerOpt.La.v) {
            // 拉标签
            frm = this.pageAtlas.getSpriteFrame('ddz5_img_la');
            wp = view.Sprite_la.node.convertToWorldSpaceAR(cc.v2(0, 0));
        } else if (opt == DEF.PlayerOpt.Geng.v) {
            // 梗标签
            frm = this.pageAtlas.getSpriteFrame('ddz5_img_geng');
            wp = view.Sprite_daogeng.node.convertToWorldSpaceAR(cc.v2(0, 0));
        } else {
            cc.warn('没有可以执行的操作动画');
            return ;
        }

        let topos = sch.r.convertToNodeSpaceAR(wp);

        let c = new cc.Node("New Sprite");
        c.addComponent(cc.Sprite).spriteFrame = frm;
        c.parent = sch.r;
        c.y = 100;
        if (opt==DEF.PlayerOpt.DingDizhu.v || opt==DEF.PlayerOpt.AnDizhu.v) {
            c.x = 0;
            c.y = 31.5;
        }

        let t1 = 1 * 0.5;
        let t2 = 0.6 * 0.5;
        c.runAction(cc.sequence(
            cc.delayTime(t1),
            cc.moveTo(t2, topos),
            cc.callFunc(
                function (params) {
                    cc.log('c end');

                    if (opt==DEF.PlayerOpt.DingDizhu.v || opt==DEF.PlayerOpt.AnDizhu.v) {
                        view.upIdentity();
                    } else if (opt == DEF.PlayerOpt.Dao.v) {
                        view.upDaogeng();
                    } else if (opt == DEF.PlayerOpt.La.v) {
                        view.upDaogeng();
                    } else if (opt == DEF.PlayerOpt.Geng.v) {
                        view.upDaogeng();
                    }
                    
                    sch.r.active = false;
                },
                this,null
            )
        ));

        this.scheduleOnce(()=>{
            cc.log('c remove');
            c.removeFromParent();
        }, t1 + t2 + 0.1);
    },
    // 地主牌动画
    onDizhuPaiAnm: function (view) {
        let sch = this.sendCardHelp;
        let ri = this.pGame.roomInfo;
        if (ri.status < DEF.RMSTA.Jiao.v) {
            sch.r.active = false;
            return;
        }

        if (!this.pGame.dizhuCard || this.pGame.dizhuCard.length<=0 || this.pGame.dizhuCard[0]<=-2) return;

        sch.r.active = true;
        sch.Node_ddp.active = true;

        // 5张背面的地主牌
        for (let i = 0; i < sch.dizhupai.length; ++i) {
            let n = sch.dizhupai[i];
            n.node.position = n.node.oPos;
            n.node.scaleX = n.node.scaleY = 0.66;
            n.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.spawn(
                    cc.moveTo(0.5, sch.toPos[view.index]),
                    cc.scaleTo(0.5*0.8, 0.1)
                ),
                cc.callFunc(
                    function (params) {
                        if (i == sch.dizhupai.length-1) {
                            //sch.r.active = false;
                            sch.Node_ddp.active = false;
                            this.upDizhuPai(true);
                        }
                    },
                    this,null
                )
            ));
        }
    },
    // 暗地主牌动画
    onAnDizhuPaiAnm: function () {
        let sch = this.sendCardHelp;
        let ri = this.pGame.roomInfo;
        if (ri.status < DEF.RMSTA.Play.v) {
            sch.r.active = false;
            return;
        }

        sch.r.active = true;

        let c = new cc.Node("New Sprite");
        c.addComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
        c.parent = sch.r;
        c.position = sch.adzPos;
        
        c.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(
                function (params) {
                    c.removeFromParent();
                    sch.r.active = false;
                    this.upDizhuPai(true);
                },
                this,null
            ),
        ));
    },
    // 地主 暗地主 牌 显示
    upDizhuPai: function (byAct) {
        if (!byAct) {
            //this.sendCardHelp.r.stopAllActions();
        }

        let dzcn = this.dizhuCardNode;
        dzcn.r.active = false;
        
        this.adzCardNode.r.active = false;

        let ri = this.pGame.roomInfo;
        if (ri.status < DEF.RMSTA.Dao.v) {
            
            return;
        }

        dzcn.r.active = true;

        if (!this.pGame.dizhuCard || this.pGame.dizhuCard[0]<=-2) {
            cc.error('没有地主牌数据  请检查问题');
            return;
        }
        
        for (let i = 0; i < this.pGame.dizhuCard.length; ++i) {
            if (this.pGame.dizhuCard[i] >= 0) {
                dzcn.dizhupai[i].spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + this.pGame.dizhuCard[i]);
            } else if (this.pGame.dizhuCard[i] == -1) {
                dzcn.dizhupai[i].spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
            }
        }

        // -------------------------------------------------------

        if (ri.status < DEF.RMSTA.Play.v) {
            return;
        }

        if (this.pGame.anDizhuCard < 0) {
            return;
        }

        this.adzCardNode.r.active = true;

        this.adzCardNode.card.spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + this.pGame.anDizhuCard);
    },

    getPlayerNode: function (player) {
        return this.pGame.uidPlayers[player.uid].view;
    },
    getPlayerTalkPos: function (player) {
        let idx = this.gameMgr.uidPlayers[player.uid].view.index;
        if (idx == 0) {
            return cc.Vec2(-50, 0);
        }
        if (idx == 1) {
            return cc.Vec2(0, -20);
        }
        if (idx == 2) {
            return cc.Vec2(0, -20);
        }
        if (idx == 3) {
            return cc.Vec2(50, 0);
        }
        if (idx == 4) {
            return cc.Vec2(-50, 0);
        }
        if (idx == 5) {
            return cc.Vec2(30, -20);
        }
        if (idx == 6) {
            return cc.Vec2(0, -20);
        }

        return null;
    },

    // 显示动画表情
    showAnmEmoji: function (player, id) {
        this.pGame.uidPlayers[player.uid].view.onAnmEmoji(id);
    },

    // 开始游戏
    starGame: function () {
        cc.log(this.dbgstr('starGame'));

        this.Node_gmfreeBtns.active = false;
        this.ButtonReady.active = false;

        this.tgdjsObj = {};
        this.pGame.roomInfo.autoCountDown = [];
        this.upTuoguanTishi();

        // 隐藏已经准备
        for (let i = 0; i < this.playerView.length; i++) {
            this.playerView[i].onStarGame();
        }
    },

    // 发牌
    sendCard: function () {
        cc.log(this.dbgstr('sendCard'));

        // 先显示为0
        this.playerView.forEach(e => {
            if (e.Label_cardNum) {
                e.Label_cardNum.string = 0;
            }
        });

        let sch = this.sendCardHelp;
        sch.r.active = true;

        this.Node_BIE.active = true;

        let p = this.playerView[0].player;
        let c0 = p.d.cards;
        let c1 = [];
        let sidx = 1000;

        let newsc = (idx, toact, endfun) => {
            let c = new cc.Node("New Sprite");
            c.addComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_back');
            c.parent = sch.r;
            c.position = sch.StarPos;
            c.zIndex = sidx--;
            
            c.runAction(cc.sequence(
                cc.delayTime(0.075*idx),
                cc.callFunc(
                    function (params) {
                    },
                    this,null
                ),
                toact,
                cc.callFunc(
                    function (params) {
                        if (endfun) {
                            endfun(idx);
                        }
                    },
                    null,null
                )
            ));

            return c;
        }

        for (let i = 0; i < c0.length; ++i) {
            this.scheduleOnce(()=>{
                this.pGame.audio.faPai();
            }, 0.075*i);

            //自己的
            if (!this.playerView[0].player.d.isView) {
                let selfsc = newsc(
                    i,
                    cc.moveTo(0.1, sch.toPos[0]),
                    (idx)=>{
                        //cc.log('idx', idx);
                        selfsc.removeFromParent();
    
                        this.playerView[0].Label_cardNum.string = i+1;
                        c1.push(-1);
                        p.setHandCode(c1);
    
                        if (idx === c0.length-1) {
                            cc.log('发完牌了');
    
                            for (let k = 0; k < c0.length; ++k) {
                                this.scheduleOnce(()=>{
                                    c1[c0.length-k-1] = c0[c0.length-k-1];
                                    p.setHandCode(c1);
    
                                    if (k===c0.length-1) {
                                        sch.r.active = false;
                                        this.Node_BIE.active = false;
                                        this.pGame.onSendCardEnd();
                                        this.playerView[0].handCardView.upCanTouch();
                                        this.upBackPlay();
                                    }
                                }, 0.05*k);
                            }
                        }
                    }
                );
            }
            
            // 其他人的
            for (let j = 1; j < this.pGame.roomInfo.total; ++j) {
                let othersc = newsc(
                    i,
                    cc.spawn(
                        cc.moveTo(0.1, sch.toPos[j]),
                        cc.scaleTo(0.1, 0.1)
                    ),
                    (idx)=>{
                        othersc.removeFromParent();
                        this.playerView[j].Label_cardNum.string = i+1;
                    }
                );
            }
        }

        return;
    },

    
    // 显示互动表情
    getInteractEmoPos:function (from, to,) {
        let pos = {};

        let F = 0;
        let T = 0;

        if (from.uid) {
            F = this.pGame.uidPlayers[from.uid].view;
            T = this.pGame.uidPlayers[to.uid].view;
        } else {
            F = this.playerView[from];
            T = this.playerView[to];
        }

        let fp = F.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
        let tp = T.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));

        pos.from = this.node.convertToNodeSpaceAR(fp);
        pos.to = this.node.convertToNodeSpaceAR(tp)

        return pos;
    },

    /* =================================================================================================================== */
    // 记牌器开关
    onButtonJpqKg: function (event, customEventData) {
        cc.log(this.dbgstr('记牌器开关 onButtonJpqKg'));

        this.pGame.jpqKg = (this.pGame.jpqKg==1) ? 2 : 1;
        this.jiPaiqi.root.active = (this.pGame.jpqKg==1);
    },
    // 准备
    onButtonReady: function (event, customEventData) {
        cc.log(this.dbgstr('准备 onButtonReady'));

        this.pGame.ready();

        this.ButtonReady.active = false;
    },
    // 开始游戏
    onStarGame: function (event, customEventData) {
        cc.log(this.dbgstr('开始游戏 onStarGame'));

        this.pGame.onWaitReadyEnd();

        this.pGame.sendOp(DEF.PlayerOpt.Start.v);
    },
    // 复制房间号
    onButtonCopyRoom: function (event, customEventData) {
        cc.log(this.dbgstr('复制房间号 onButtonCopyRoom'));

        /*
        1、点击【复制房间号】，复制房间的基础信息，并给予提示文字“复制成功”，见示意图
        2、发送的文字内容格式：
            房间类型（普通房\茶馆房）-房号-已有人数
            游戏名称,局数,房费类型,人数,加底类型,自摸类型,放炮类型,封顶类型
            注意：只有普通房才带有最后括号里的描述信息
        例如：
            普通房-869023-有2人
            江安大贰,8局,3人,均摊房费,不加底,自摸翻倍,放炮包赔,可查叫,加底,无封顶
        */
       let ri = this.pGame.roomInfo;
       let des = '普通房';
       if (ri.clubId) {
           des = '茶馆房'+'('+ri.clubName+' '+'ID:'+ri.clubId+')';
       }
       
        des += '-'+ri.roomId;
        des += '-有'+ Object.keys(this.pGame.uidPlayers).length +'人'+'\n';
        //des += cc.g.areaInfo[ri.origin].name + '跑得快,';
        des += '五人斗地主,';
        des += ri.GameNum + '局,';
        des += ri.total + '人';
        
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    des += ',' + rules[e];
                } else {
                    cc.error('跑得快错误规则ID', e);
                }
            });
        }

        cc.g.utils.setPasteboard(des);
        cc.g.global.hint('复制成功');

        cc.log('复制成功',des);
    },
    // 邀请好友 目前发送的下载地址
    onButtonInvite: function (event, customEventData) {
        cc.log(this.dbgstr('邀请好友 onButtonInvite'));

        let ri = this.pGame.roomInfo;

        let gameTypes = cc.g.utils.getJson('GameType');
        let name = gameTypes[ri.gameType] ? gameTypes[ri.gameType].NAME : '五人斗地主';
        let title = GameConfig.appName + '<' + name + '>'+ '\n';
        title += '房号:' + ri.roomId + ' ' + (ri.clubId ? '茶馆房' : '普通房');
        
        let desc = [];
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    desc.push(rules[e]);
                } else {
                    cc.error('跑得快错误规则ID', e);
                }
            });
        }

        //cc.g.utils.shareURLToWX(title, desc.join(','), '', GameConfig.shareUrl + '?user_id=' + cc.g.userMgr.userId.toString() + '&room_id=' + ri.roomId, 0);
        cc.g.utils.shareURLToWX(title, desc.join(','), '', GameConfig.downloadUrl, 0);
    },
    // 离开房间
    onButtonLeave: function (event, customEventData) {
        cc.log(this.dbgstr('离开房间 onButtonLeave'));
        
        cc.g.hallMgr.exitGame();
    },

    // '提示', '出牌', '过',
    onButtonOperate: function (event, customEventData) {
        let o = customEventData;
        
        cc.log(this.dbgstr('onButtonOperate ') + o);

        this.Node_opt.active = false;

        if (o == DEF.OBK.jiao) {
            this.pGame.sendOp(DEF.PlayerOpt.Jiao.v, [1]);

        } else if (o == DEF.OBK.jiaono) {
            this.pGame.sendOp(DEF.PlayerOpt.Jiao.v, [0]);

        } else if (o == DEF.OBK.dao) {
            this.pGame.sendOp(DEF.PlayerOpt.Dao.v, [1]);

        } else if (o == DEF.OBK.daono) {
            this.pGame.sendOp(DEF.PlayerOpt.Dao.v, [0]);

        } else if (o == DEF.OBK.la) {
            this.pGame.sendOp(DEF.PlayerOpt.La.v, [1]);

        } else if (o == DEF.OBK.lano) {
            this.pGame.sendOp(DEF.PlayerOpt.La.v, [0]);

        } else if (o == DEF.OBK.geng) {
            this.pGame.sendOp(DEF.PlayerOpt.Geng.v, [1]);

        } else if (o == DEF.OBK.han) {
            this.pGame.sendOp(DEF.PlayerOpt.Geng.v, [0]);

        } else if (o == DEF.OBK.xuanpai) {
            let codes = this.playerView[0].handCardView.getChoosedCode();
            if (codes.length == 1) {
                this.pGame.sendOp(DEF.PlayerOpt.Han.v, codes);
            } else {
                cc.g.global.hint('只能选一张');
                this.Node_opt.active = true;
            }
        }

        // 重选
        if (o == DEF.OBK.rexuan) {
            this.Node_opt.active = true;
            this.playerView[0].handCardView.reSetPos();
            return;
        }
        // 提示
        if (o == DEF.OBK.tishi) {
            this.Node_opt.active = true;
            this.playerView[0].tryTip();
            return;
        }
        // 出牌
        if (o == DEF.OBK.chupai) {
            this.playerView[0].player.outCard();
            return;
        }
        // 过
        if (o == DEF.OBK.pass) {
            this.pGame.sendOp(DEF.PlayerOpt.Pass.v);
            this.playerView[0].handCardView.reSetPos();
            return;
        }
    },
    showTypeTip: function (fun) {
        this.Node_ottp.active = true;
        this.TypeTipfun = fun;
    },
    onTestType: function (event, customEventData) {
        this.Node_ottp.active = false;
        this.ottp = parseInt(customEventData);
        this.TypeTipfun && this.TypeTipfun(this.ottp);
        this.TypeTipfun = null;
    },
    showOutChoose: function (grps, fun) {
        this.Node_outChoose.active = true;
        this.clcSwallow.node.active = true;

        this.outChoosefun = fun;

        let ctt = this.Node_outChoose;
        ctt.removeAllChildren();

        for (let i = 0; i < grps.length; ++i) {
            let g = grps[i];

            let n = cc.instantiate(this.PfCardsType);
            let bg = cc.find('Sprite_bg', n);
            let desc = cc.find('Sprite_bg/Label_desc', n).getComponent(cc.Label);
            let hbox = cc.find('hbox_cards', n);

            desc.string = g.desc;

            hbox.removeAllChildren();
            let info = this.pGame.logic.getCodesInfo(g.change ? g.change : g.codes);
            let codes = info.codes;
            for (let i = 0; i < codes.length; ++i) {            
                let spr = new cc.Node();
                if (codes[i] < 100) {
                    spr.addComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_' + codes[i]);
                } else {
                    spr.addComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('pdk_card_a_' + (info.val[i]-1));
                }
                
                hbox.addChild(spr);
            }

            bg.width += (codes.length>4 ? (codes.length-4)*24: 0);

            cc.g.utils.addClickEvent(bg, this.node, 'ddz5', 'onClickCardsType', i);

            ctt.addChild(n);
        }
    },
    onClickCardsType: function(event, idx) {
        this.Node_outChoose.active = false;
        this.outChoosefun && this.outChoosefun(idx);
        this.outChoosefun = null;
    },
    /* =================================================================================================================== */

    // 游戏结算
    onGameSettlement: function () {
        // 显示结算
        let showSettleView = ()=>{
            if (! this.settleView) {
                this.settleView = new ctrls.SettleView();
                this.settleView.init(this);
                this.node.parent.addChild(this.settleView.root);
            }
    
            this.settleView.show();
        }

        showSettleView();
    },
    onGameSettlementEnd: function () {
        this.upPage();
    },

    // 总结算
    onGameSettleFinal: function () {
        if (! this.settleFinalView) {
            this.settleFinalView = new ctrls.SettleFinalView();
            this.settleFinalView.init(this);
            this.node.parent.addChild(this.settleFinalView.root);
        }

        if (this.jiesanView) {
            this.jiesanView.clear();
        }
        
        this.settleFinalView.upView();
    },

    // 重置游戏
    resetGame: function () {
        this._super();

        this.upPage();
    },

    
    // 解散
    playerAskJiesan: function (uid, statu) {
        if (! this.jiesanView) {
            let jsv = cc.g.hallMgr.inGameMenu.getJiesanView();

            let view = jsv.getComponent('jiesanRoom');
            view.init();

            view.registeYes(()=>{
                this.pGame.sendOp(DEF.PlayerOpt.JiesanVote.v, 1);
            });

            view.registeNo(()=>{
                this.pGame.sendOp(DEF.PlayerOpt.JiesanVote.v, 0);
            });

            this.jiesanView = view;
        }

        if (! this.jiesanView.vote) {

            let data = [];
            let name = '';
            let icon = '';
            let votetime = null;
            this.playerView.forEach(v => {
                let p = v.player;
                if (!p) {
                    return;
                }
                if (p.d.isView) {
                    return;
                }

                let puid = p.d.uid.toNumber ? p.d.uid.toNumber() : p.d.uid;
                
                if (puid == uid) {
                    name = p.d.name;
                    icon = p.d.icon,
                    votetime = p.votetime;
                    return;
                }

                let o = {
                    uid: puid,
                    name: p.d.name,
                    icon: p.d.icon,
                    sta: p.voteSta ? p.voteSta : 0,
                };

                data.push(o);
            });

            data.unshift({
                uid: uid,
                name: name,
                icon: icon,
                sta: statu,
                time: votetime,
            });

            this.jiesanView.starVote(data);
        }

        let res = this.jiesanView.upPlayer(uid, statu);
        if (res) {
            this.playerView.forEach(v => {
                if (v.player){
                    v.player.voteSta = null;
                    v.player.votetime = null;
                }
            });

            this.scheduleOnce((dt)=>{
                this.jiesanView.clear();
            }, 0.5);
        }
    },

    /* =================================================================================================================== */


    /* ======回放============================================================================================================ */
    // 回放相关
    initBackPlay:function () {
        if (!this.isbpm) {
            return;
        }

        cc.find("phoneInf", this.node).destroy();
        cc.find("Sprite_df_js", this.node).active = false;
    },

    upBackPlay:function () {
        if (!this.isbpm) {
            return;
        }

        this.jiPaiqi && this.jiPaiqi.hide();

        this.ButtonReady.active = false;

        let ri = this.pGame.roomInfo;

        if (ri.status <= DEF.RMSTA.Free.v) {
            return;
        }

        this.playerView.forEach(e => {
            e.player && e.bp_handCardView && (e.bp_handCardView.root.active = true);
        });
    },
    /* ======回放+ */



    /* =================================================================================================================== */
    
    // 调试按钮
    onDbgBtn: function (event, customEventData) {
        this.___dbg = true;

        //[1,2,3,3,6,6,6,8,8,11,12,12,13,15,16,16,18,19,20,20] 华阳一姐
        let a = Date.now();
        let b = new Date().getTime()
        let c = new Date().valueOf();
        let d = +new Date();
        console.log(a);

        let ComType = DEF.ComType;

        let readyPlayer = ()=>{
            for (let i = 0; i < this.playerView.length; i++) {
                this.playerView[i].root.active = true;
                if (! this.playerView[i].player){
                    this.playerView[i].player = {};
                    let p = this.playerView[i].player;

                    p.view = this.playerView[i];
                    p.outCodes = [];

                    p.d={};
                    p.d.name = '测试名'+i;
                    p.d.uid = i;
                    p.d.sex = 1;
                    p.d.icon = '1';

                    this.pGame.uidPlayers[p.d.uid] = p;
                }
            }
        }

        // 地主牌动画
        if (! true) {
            this.ButtonReady.active = false;

            this.pGame.onWaitReadyEnd();

            this.pGame.roomInfo.status = DEF.RMSTA.Jiao.v;

            this.anmView.r.active = true;

            if (! this.dbg9) {
                this.dbg9 = 4;
            }

            if (this.dbg9==1) {
                this.anmView.ddzAnm.onec('', ()=> {
                    this.anmView.r.active = false;
                    this.onOptAnm(this.playerView[0], DEF.PlayerOpt.DingDizhu.v);
                }, 1);

                ++this.dbg9;
            } else if (this.dbg9==2) {
                this.anmView.adzAnm.onec('', ()=> {
                    this.anmView.r.active = false;
                    this.onOptAnm(this.playerView[0], DEF.PlayerOpt.AnDizhu.v);
                }, 1);

                ++this.dbg9;
            } else if (this.dbg9==3) {
                this.anmView.wzAnm.onec('', ()=> {
                    this.anmView.r.active = false;
                }, 1);

                ++this.dbg9;
            } else if (this.dbg9==4) {
                this.anmView._8tzAnm.onec('', ()=> {
                    this.anmView.r.active = false;
                }, 1);

                ++this.dbg9;
            } else if (this.dbg9==5) {
                this.anmView.twzAnm.onec('', ()=> {
                    this.anmView.r.active = false;
                }, 1);

                this.dbg9=5;
            }
            
            
            
            
            //this.onDizhuPaiAnm(this.playerView[0]);

            return;
        }

        // 互动表情 8
        if (! true) {
            if (! this.dbg8) {
                readyPlayer();
                this.dbg8 = 8;
            }
        }

        // 出牌 7
        if (! true) {
            if (! this.dbg7) {
                readyPlayer();
                this.dbg7 = 1;
            }

            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;
            this.Node_gmfreeBtns.active = false;
            this.ButtonReady.active = false;
            this.Node_outChoose.active = false;

            if (this.dbg7==1) {
                //let hc = [2,3,4,5,6];
                let hc = [13,13,13,8,3];
                let hc2=[];
                hc.forEach(e => {
                    (e>=52) ? hc2.push(e) : hc2.push(e*4-1);
                });

                let p = this.playerView[1].player;
                p.outCodes = hc2;
                p.outType = ComType.SAN2;
                this.playerView[1].upOutCards();
                this.pGame.lastOuter = p.d.uid;
                this.pGame.lastOType = p.outType;

                if (1)
                {
                    //let hc = [1, 13,12,11,10,9,9,52,53];
                    let hc = [3,4,9,11,11,1,1,2,53,];
                    let hc2=[];
                    hc.forEach(e => {
                        (e>=52) ? hc2.push(e) :  hc2.push(e*4-1);
                    });

                    let p = this.playerView[0].player;
                    p.setHandCode(hc2);
                    p.onCanOutCard();
                }
            }

            return;
        }

        // 牌型选择 6
        if (! true) {
            if (! this.dbg6) {
                this.dbg6 = 1;
            }

            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;
            this.Node_gmfreeBtns.active = false;
            this.ButtonReady.active = false;
            this.Node_opt.active = true;

            if (this.dbg6==1) {
                let comb = [];

                comb.push({
                    codes: [1,1,1,1,1,2,2],
                    desc:'顺子',
                });
                comb.push({
                    codes: [1,1,1,1,1,2,2],
                    desc:'连对',
                });
                //*
                comb.push({
                    codes: [1,1,1,1,1,2,2],
                    desc:'飞机',
                });
                //*/

                this.showOutChoose(comb, (idx)=>{
                    cc.log('idx', idx);
                    cc.g.global.hint(comb[idx].desc);
                });
            }
        }

        // 牌型判断 5
        if (! true) {
            if (! this.dbg5) {
                this.dbg5 = 1;
            }

            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;
            this.Node_gmfreeBtns.active = false;
            this.ButtonReady.active = false;
            this.Node_outChoose.active = false;

            if (this.dbg5==1) {
                //let hc = [1,2,3,4,5,6,7,52,53];
                //let hc = [1,2,3,3,5,5,5,6,6,6,11,11,12,12,12,52,53];
                let hc = [13,13,12,12,11,11,,10,10,9,9,52,53];
                let hc2=[];
                hc.forEach(e => {
                    (e>=52) ? hc2.push(e) :  hc2.push(e*4-1);
                });

                let p = this.playerView[0].player;
                p.setHandCode(hc2);
                p.onCanOutCard();
                this.dbg5;
            }
        }

        // 出牌效果 4
        if (! true) {
            /*
            1    单牌 
            2    对子 
            3    顺子
            4    连对 
            5    三同 
            6    三带二        
            7    三带一对 
            8    飞机 
            9    飞机带四散
            10   飞机带两对     
            11   炸弹
            */
           
            if (! this.dbg4) {
                readyPlayer();
                this.dbg4 = 1;
                this.playerView.forEach(e => {
                    e.root.active = true;
                    e.player.outCodes = [2,2];
                });
                
                this.dbg4_tp = [3,4,5,8,11];
                this.dbg4_tpidx = 0;
            }

            if (this.dbg4==1) {
                this.playerView.forEach(e => {
                    e.player.outType = this.dbg4_tp[this.dbg4_tpidx];
                    e.upOutCards();
                });

                if (++this.dbg4_tpidx >= this.dbg4_tp.length) {
                    this.dbg4_tpidx = 0;
                }
            }

            return;
        }

        // 发牌
        if (! true) {
            this.ButtonReady.active = false;

            this.pGame.onWaitReadyEnd();

            let p = this.playerView[0].player;
            p.sendCard([]);

            return;
        }

        // 动画表情
        if (! true) {
            readyPlayer();

            this.pGame.roomInfo.dealer = 2;
            this.playerView[3].posToDealer();

            for (let i = 0; i < this.playerView.length; i++) {
                this.showAnmEmoji(this.playerView[i].player.d, 15+i);
            }
        }
        
        // 文字表情
        if (! true) {
            readyPlayer();

            for (let i = 0; i < this.playerView.length; i++) {
                this.showDialog(this.playerView[i].player.d, 15+i);
            }
        }

        // 音乐 2
        if (! true){
            if (! this.dbg2) {
                this.dbg2 = 6;
                this.dbg2_sex = 0;
                this.dbg2_idx = 0;
            }

            if (this.dbg2 == 1) {
                this.pGame.audio.bgmGame();
                ++this.dbg2;
            } else if (this.dbg2 == 2) {
                this.pGame.audio.bgmBao();
                ++this.dbg2;
            } else if (this.dbg2 == 3) {
                this.pGame.audio.faPai();
                ++this.dbg2;
            } else if (this.dbg2 == 4) {
                this.pGame.audio.baiPai();
                ++this.dbg2;
            } else if (this.dbg2 == 5) {
                let opt = ['long','zhao','peng','chi','hu',];
                if (this.dbg2_idx >= opt.length) {
                    this.dbg2_idx = 0;
                    this.dbg2_sex = ++this.dbg2_sex%2;
                }
                this.schedule(()=>{
                    this.pGame.audio.opt(opt[this.dbg2_idx++], this.dbg2_sex);
                }, 1, opt.length-1, 0);
                //++this.dbg2;
            } else if (this.dbg2 == 6) {
                if (this.dbg2_idx >= 20) {
                    this.dbg2_idx = 0;
                    this.dbg2_sex = ++this.dbg2_sex%2;
                }
                this.schedule(()=>{
                    this.pGame.audio.pai(++this.dbg2_idx, this.dbg2_sex);
                }, 1, 20-1, 0);
                //++this.dbg2;
            }
        }

        // 动画 0
        if (! true) {
            let av = this.anmView;
            av.r.active = true;
            //av.dbg.active = true;

            if (! this.dbg0) {
                this.dbg0 = 2;
            }

            if (this.dbg0 == 1) {
                cc.log('av.comPubAnm.names', av.comPubAnm.names);
                av.comPubAnm.loopAll();
            } else if (this.dbg0 == 2) {
                cc.log('av.t0.names', av.t0.names);
                av.t0.loopAll();
            }

            return;
        }

        // 按钮
        if (! true) {
            this.Node_gmfreeBtns.active = false;
            this.optBtns['chupai'].active = true;
            this.Node_opt.active = true;
        }

        // 结算
        if (! true) {
            let d = {};
            d.dbgdata = true;

            d.winType = 1;
            d.base = 0;
            d.baseScore = 1;
            d.round = 2;
            d.time = Date.now() / 1000;

            d.list = [];
            d.players = {};

            for (let i = 0; i < 5; ++i) {
                let id = 200+i;

                d.list.push({
                    uid: id,
                    winlose: 0,
                    totalscore: 0,
                    identity: (i==1) ? 1 : ((i==3) ? 3 : 2),
                    scoreRate: (i==1) ? 2 : 2,
                    gengValue: (i==1) ? 1 : 0,
                    isZhuang: (i==0),
                    handcards: [2, 7, 10],
                    deskcards:[12, 17, 20, 53],
                });

                d.players[id] = {
                    icon: ''+ (i%4 + 1),
                    name: '游客' + id,
                    view: this.playerView[i],
                };
            }

            this.pGame.roomInfo.total = 5;
            this.pGame.roomInfo.dealer = 200+0;

            this.pGame.onGameSettle(d);
        }

        // 总结算
        if (! true) {
            this.onGameSettleFinal();
        }
    },
});
10