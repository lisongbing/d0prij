
let GameBase = require('GameBase');

let DEF = require('daerDef');
let d2Ctrls = require('daerCtrls');

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

        // 长牌预制
        longCardPf: {
            default: null,
            type: cc.Prefab,
        },

        // 手牌预制
        hcPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // 胡牌提示预制
        hutipPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // 摆牌预制
        showGroup: {
            default: null,
            type: cc.Prefab,
        },

        // 吃牌视图预制
        chiViewPf: {
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

        // 游戏结算 胡息番数预制
        SIHuFanPf: {
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
        let s = '大二页面'; //d2Page

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(this.dbgstr('onLoad'));

        this.handCardSpa = {x:2, y:65,};

        this.gameMgr = cc.g.daerMgr;

        this._super();

        this.pGame = cc.g.daerMgr;
        this.pGame.gameScript = this;

        this.pGame.DMode.isDrive = false;

        this.isbpm = this.pGame.isBackPlayMode();

        // 初始化界面
        this.initView();

        // 界面加载完成
        if (! cc.g.d2dbg) {
            this.pGame.gameScriptLoaded();
        }

        // 更新页面
        this.upPage();

        this.upDeskbg();

        this.pGame.DMode.isDrive = true;

        if (this.isbpm) {
            if (this.pGame.backPlay) {
                this.pGame.backPlay.gameLoaded();
            }

            //this.scheduleOnce(()=>{
                this.pGame.backPlay.begin();
            //}, 0.5);
        }
    },

    start () {

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
        //this.DBG_Button.active = 1;

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

        // 房间号 局数
        this.Label_turn = cc.find("Sprite_turn/Label_turn", r).getComponent(cc.Label);
        //this.Label_turn.node.active = false;
        
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
        this.Node_gmfreeBtns.active = true;
        // 提牌按钮
        this.ButtonTipai = cc.find("Button_tipai", r);

        // 牌库
        this.Sprite_paiku = cc.find("Sprite_paiku", r).getComponent(cc.Sprite);
        this.Label_paikuNum = cc.find("Sprite_paiku/Label_paikuNum", r).getComponent(cc.Label);     

        // 点过胡
        this.Sprite_dianguohu = cc.find("Sprite_dianguohu", r);
        this.Sprite_dianguohu.active = false;
        cc.g.utils.addClickEvent(cc.find("Sprite_dianguohu/Button_fou", r), this.node, 'daer', 'onButtonDGHfou', 0);

        // 托管提示
        this.Node_tgts = cc.find("Node_tgts", r);
        this.Node_tgts.desc = cc.find("text", this.Node_tgts).getComponent(cc.Label);
        this.Node_tgts.active = false;

        // 初始化发牌
        this.initSendCard();

        // 初始化操作按钮
        this.initOperate();

        // 玩家视图
        this.initPlayerView();

        // 初始化动画层
        this.initAnimationView();

        this.showHuTip(false);

        // 回放相关
        this.initBackPlay();
    },
    onClickSwallow: function () {
        cc.log(this.dbgstr('onClickSwallow'));

        if (this.chiView && this.chiView.r.active) {
            this.chiView.hide();
            this.Node_opt.active = true;
        }
        if (this.interactView) {
            this.interactView.node.active = false;
            this.interactView = null;
        }
        if (this.Sprite_hutip) {
            this.Sprite_hutip.active = false;
        }

        this.clcSwallow.node.active = false;
    },

    // 初始化发牌
    initSendCard: function () {
        cc.log(this.dbgstr('initSendCard'));

        let o = {};

        o.r = cc.find("Node_sendCard", this.node);

        o.StarPos = cc.find("Sprite_starPos", o.r).getPosition();
        o.posmo1 = cc.find("Node_posmo1", o.r).getPosition();
        o.tangPos = cc.find("Node_tangPos", o.r).getPosition();


        o.toPos = [];
        o.outp = [];
        while (true) {
            let i = o.toPos.length + 1;
            let node = cc.find("Node_pos"+i, o.r);

            if (!node) {
                break;
            }
        
            o.toPos.push(node.getPosition());

            node = cc.find("Sprite_out"+i, o.r);
            o.outp.push(node.getPosition());
        }

        o.r.removeAllChildren();
        o.r.active = false;

        this.sendCardHelp = o;
    },

    // 初始化操作按钮
    initOperate: function () {
        cc.log(this.dbgstr('initOperate'));

        let r = cc.find("Node_operate", this.node);

        // 三拢四坎
        this.Button3l4k = cc.find("Button_3l4k", r);
        // 黑摆
        this.ButtonHeibai = cc.find("Button_heibai", r);
        // 三招
        this.Button3Zhao = cc.find("Button_3zhao", r);
        // 爆
        this.ButtonBao = cc.find("Button_bao", r);
        // 吃
        this.ButtonChi = cc.find("Button_chi", r);
        // 胡
        this.ButtonHu = cc.find("Button_hu", r);
        // 过
        this.ButtonPass = cc.find("Button_pass", r);

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

            cc.log(i);

            cc.log('    ' + 'Node_player' + i);
         
            let view = new d2Ctrls.PlayerView();
            view.init(node, i-1, this);

            pv.push(view);
        }
    },
    
    // 初始化动画层
    initAnimationView: function () {
        cc.log(this.dbgstr('initAnimationView'));

        this.anmView = {};

        let r = cc.find("Node_animation", this.node);
        r.active = true;
        this.anmView.r = r;

        // 玩家播放位置
        this.anmView.ppos = [];
        for (let i = 0; i < 3; ++i) {
            let p = cc.find("Node_p" + (i+1), r);
            this.anmView.ppos.push(p.position);
            p.removeFromParent();
        }

        // 玩家操作动画
        let Node_opt = cc.find("Node_opt", r);
        this.anmView.opt = this.crtAnmObj(Node_opt);

        // 胡番
        let Node_hufan = cc.find("Node_hufan", r);
        this.anmView.hufan = this.crtAnmObj(Node_hufan);

        // 爆
        let Node_bao = cc.find("Node_bao", r);
        this.anmView.bao = this.crtAnmObj(Node_bao);

        // 玩家操作动画2
        let Node_opt2 = cc.find("Node_opt2", r);
        this.anmView.opt2 = this.crtAnmObj(Node_opt2);
    },

    // 玩家操作动画
    optAnm:function (view, fun) {
        // PLAY OPT KEY
        {/*
            // PLAY OPT KEY
            this.POK = {
                _34: 0,
                heibai: 1,
                long: 2,
                bao: 3,
                chi: 4,
                peng: 5,
                zhao: 6,
                hu: 7,
                pass: 10,
            };
        */};

        //fun = null;

        if (!this.anmView.opt) {
            return;
        }

        if (! this.pokname) {
            let POK = view.player.POK;

            let kn = {};
            kn[POK._34] = 'sankan';
            kn[POK.heibai] = 'heibai';
            kn[POK._3zhao] = 'hu';
            kn[POK.long] = 'long';
            kn[POK.bao] = 'bao';
            kn[POK.chi] = 'chi';
            kn[POK.peng] = 'peng';
            kn[POK.zhao] = 'zhao';
            kn[POK.hu] = 'hu';
            kn[POK.baozi] = 'baozi';

            this.pokname = kn;
        }

        let name = this.pokname[view.curPok];
        if (! name) {
            if(fun)fun();
            return;
        }

        let anm = this.anmView.opt;
        anm.r.position = this.anmView.ppos[view.index];
        anm.onec(name, ()=>{if(fun)fun();});
    },

    // 胡番动画
    hufanAnm:function (view, mt, fun) {
        //fun = null;

        if (!this.anmView.hufan) {
            return;
        }

        if (! this.hfname) {
            let kn = {};

            for (let i = 1; i <= 7; ++i) {
                kn[100+i] = i*10 + 'hu';
                
            }

            kn[1] = 'honghu';
            kn[2] = 'heihu';
            kn[3] = 'tianhu';
            kn[4] = 'dihu';
            kn[5] = 'baohu';
            kn[6] = 'shabao';
            kn[7] = 'kzfei';
            kn[8] = 'sspiao';
            kn[9] = 'hdlao';
            kn[10] = 'hdpao';
            kn[11] = 'dpao';
            //kn[15] = 'heibai';
            //kn[12] = 'gui';
            kn[13] = 'zimo';
            kn[16] = 'kunhu';
            kn[17] = 'slskan';
            kn[20] = 'wuhu';
            kn[22] = 'dbhu';

            kn.huang = 'huang';

            this.hfname = kn;
        }

        let name = this.hfname[mt];
        if (! name) {
            if(fun)fun();
            return;
        }

        let anm = this.anmView.hufan;
        anm.r.position = this.anmView.ppos[view.index];
        anm.onec(name, ()=>{if(fun)fun();});
    },

    // 爆动画
    baoAnm:function (isPlay) {
        if (!this.anmView.bao) {
            return;
        }

        if (! isPlay) {
            this.anmView.bao.stop();
            return;
        }
        
        this.anmView.bao.play();
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
        //this.Node_gmfreeBtns.active;
        

        // 俱乐部的返回大厅
        cc.g.hallMgr.inGameMenu.upBtnShow();

        this.upTuoguanTishi();

        // 更新局数
        this.upTurn();
        // 牌库
        this.upPaiku();

        this.clearWaitCard();

        this.ButtonTipai.active = false;

        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            e.upView();
        }

        if (this.pGame.isGameBao) {
            this.pGame.audio.bgmBao();
            this.baoAnm(true);
        } else {
            this.pGame.audio.bgmGame();
            this.baoAnm(false);
        }

        this.upWaitCard();

        this.Sprite_dianguohu.active = false;

        // 操作按钮
        this.upOperate();

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

        if ((ri.type == 2) || (ri.type == 5) || (ri.GameNum >= ri.curGameNum)) {
            this.Label_turn.string = ri.curGameNum + '/' + ri.GameNum;
        } else {
            this.Label_turn.string = ri.curGameNum;
        }
    },

    // 更新牌库
    upPaiku: function () {
        let ri = this.pGame.roomInfo;

        if (ri.status == DEF.RMSTA.Free.v) {
            this.Sprite_paiku.node.active = false;
            return;
        }

        this.Sprite_paiku.node.active = !this.isbpm;

        this.Label_paikuNum.string = ri.cardNum;
    },

    // 更新待处理卡牌
    upWaitCard: function () {
        let view = null;
        for (let i = 0; i < this.playerView.length; i++) {
            const v = this.playerView[i];
            if (v.player && v.player.waitCode) {
                view = v;
                break;
            }
        }

        if (!view) {
            return;
        }

        if (view.player.istang) {
            this.tangCard(view, view.player.waitCode);
        } else {
            this.outCard(view, view.player.waitCode);
        }
    },

    // 移除当前桌面供玩家操作的牌
    clearWaitCard: function () {
        let sch = this.sendCardHelp;

        if (sch.lastWC) {
            sch.lastWC.r.removeFromParent();
            sch.lastWC=null;
        }

        if (sch.waitCard) {
            sch.waitCard.r.removeFromParent();
            sch.waitCard=null;
        }
    },

    // 显示操作按钮
    upOperate: function () {
        let btn = [this.Button3l4k, this.ButtonHeibai, this.Button3Zhao, this.ButtonBao, this.ButtonChi, this.ButtonHu];
        btn.forEach(e => {
            e.active = false;
        });

        this.Node_opt.active = false;

        let obks = this.playerView[0].player.obks;
        if (!obks) {
            return;
        }
        if (obks.length<0 || obks.length>=btn.length) {
            cc.error(this.dbgstr('initOperate ') + " 错误的操作数量 ")
            return;
        }

        obks.forEach(e => {
            if (e < 0) {
                cc.error('出现尚未支持的操作');
                return;
            } 

            btn[e].active = true;
        });

        this.Node_opt.active = true;

        this.playerView[0].upDaojishi();
    },
    
    // 文字提示 父类相关
    getHitNode: function () {
        if (!this.node) return;
        return this.node.getChildByName('Node_hint');
    },
    textHint: function (text) {
        text = text ? text : '???';
        this.showGameHint(text, cc.Vec2(0,-100), cc.Vec2(0, 50), 0.5, null, 0.5);
    },

    // 文字表情
    //showDialog: function (player, emjid) {
    //    this.pGame.uidPlayers[player.uid].view.onTextEmjio(emjid);
    //},
    getPlayerNode: function (player) {
        return this.pGame.uidPlayers[player.uid].view;
    },
    // 显示动画表情
    showAnmEmoji: function (player, id) {
        this.pGame.uidPlayers[player.uid].view.onAnmEmoji(id);
    },

    // 开始游戏
    starGame: function () {
        cc.log(this.dbgstr('starGame'));

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

        this.upPaiku();

        //o.r;
        //o.StarPos;
        //o.toPos;
        //o.posmo1
        let sch = this.sendCardHelp;
        sch.r.active = true;

        this.Node_BIE.active = true;

        let newsc = (idx, toact, endfun) => {
            let node = new cc.Node("New Sprite");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_back');

            node.parent = sch.r;
            node.position = sch.StarPos;
            node.zIndex = 1000-idx;
            
            node.runAction(cc.sequence(
                cc.delayTime(0.1*idx),
                cc.callFunc(
                    function (params) {
                        this.Label_paikuNum.string = --this.pGame.roomInfo.cardNum;
                    },
                    this,null
                ),
                toact,
                //cc.delayTime(0.075),
                cc.callFunc(
                    function (params) {
                        if (endfun) {
                            endfun(idx);
                        }
                    },
                    null,null
                )
            ));

            return node;
        }

        // 准备发牌相关的信息数据
        let ssi = this.selfSendInfo();
        
        // 先显示为0
        this.playerView.forEach(e => {
            if (e.Label_cardNum) {
                e.Label_cardNum.string = 0;
            }
        });

        // 初始手牌都是一样的
        for (let i = 0; i < DEF.StartCardNum; ++i) {

            this.scheduleOnce(()=>{
                this.pGame.audio.faPai();
            }, 0.1*i);

            //自己的
            let selfsc = newsc(
                i,
                cc.moveTo(0.3, ssi[i].pos),
                (idx)=>{
                    //cc.log('idx', idx);
                    selfsc.removeFromParent();

                    ssi[i].card.active = true;
                    if (ssi[i].hu) {
                        ssi[i].hu.active = true;
                    }

                    this.playerView[0].Label_cardNum.string = i+1;

                    if (idx === DEF.StartCardNum-1) {
                        this.Node_BIE.active = false;
                        this.pGame.onSendCardEnd();
                        this.playerView[0].handCardView.upCanTouch();
                        this.upBackPlay();
                    }
                }
            );

            // 其他人的
            for (let j = 1; j < this.pGame.roomInfo.total; ++j) {
                if (j >= 3) {
                    continue;
                }

                let othersc = newsc(
                    i,
                    cc.spawn(
                        cc.moveTo(0.3, sch.toPos[j]),
                        cc.scaleTo(0.3, 0.1)
                    ),
                    (idx)=>{
                        othersc.removeFromParent();
                        this.playerView[j].Label_cardNum.string = i+1;
                    }
                );
            }
        }
    },
    //准备发牌相关的信息数据
    selfSendInfo: function () {
        // 获取手牌卡组
        let grps = this.playerView[0].handCardView.grops;
        
        // 起始卡组以及每组卡牌节点
        let gbidx = -1;
        let noEmtgrps = [];
        for (let i = 0; i < grps.length; ++i) {
            const g = grps[i];

            if (g.cards.length < 1) {
                continue;
            }

            if (gbidx < 0) {
                gbidx = i;
            }

            noEmtgrps.push(g);
        }


        // 起始目标位置
        let bgTopos = this.sendCardHelp.toPos[0];
        let w = noEmtgrps[0].cards[0].width + this.handCardSpa.x;
        
        let ssi = [];
        
        for (let i = 0; i < noEmtgrps.length; ++i) {
            const g = noEmtgrps[i];
            
            for (let j = 0; j < g.cards.length; ++j) {
                let ifo = {};

                ifo.pos = cc.v2(bgTopos.x + w*(gbidx+i), bgTopos.y);
                ifo.card = g.cards[j];
                ifo.card.active = false;
                ssi.push(ifo);
            }

            ssi[ssi.length-1].hu = g.Sprite_hubg;
            ssi[ssi.length-1].hu.active = false;
        }

        return ssi;
    },

    // 摸牌
    moCard: function (view, endFun) {
        //cc.log(this.dbgstr('moCard'));

        let sch = this.sendCardHelp;
        sch.r.active = true;

        this.Node_BIE.active = true;

        let mc  = view.player.moCards;
        let topos = (view.player.isSelf) ? sch.posmo1: sch.toPos[view.index];

        for (let i = 0; i < mc.length; ++i) {
            this.popBottomCard(); //回放时起效

            const code = mc[i];
            
            let card = new d2Ctrls.LongCard();
            card.init(this, (! view.player.isSelf || code<0) ? null : code);

            let c = card.r;
            c.parent = sch.r;
            c.position = sch.StarPos;
            c.zIndex = 1000-i;

            c.runAction(cc.sequence(
                cc.delayTime(0.1*i),
                cc.callFunc(
                    function (params) {
                        this.Label_paikuNum.string = --this.pGame.roomInfo.cardNum;
                    },
                    this,null
                ),
                cc.spawn(
                    cc.moveTo(0.5, topos),
                    cc.scaleTo(0.5, 0.1)
                ),
                cc.callFunc( 
                    function (tg) {
                        //this._function.call(this._selectorTarget, this.target, this._data);
                        c.removeFromParent();

                        if (endFun) {
                            endFun(i);
                        }

                        if (i == mc.length-1) {
                            this.Node_BIE.active = false;
                        }
                    },
                    this,
                    null
                )
            ));
        }
    },

    // 打牌
    outCard: function (view, code) {
        //let p0 = this.Sprite_cardNumBg.node.position;
        //let sz = cc.v2this.Sprite_cardNumBg.node.getContentSize();
        //let p1 = cc.v2(p0.x);

        //this.clearWaitCard();

        let sch = this.sendCardHelp;
        sch.r.active = true;

        let card = new d2Ctrls.LongCard();
        card.init(this, code);
        card.viewIdx = view.index;

        let c = card.r;
        c.parent = sch.r;

        if (!this.pGame.DMode.isDrive) {
            c.position = sch.outp[view.index];
            //card.light();
        } else {
            let bgpos = view.Sprite_cardNumBg.node.convertToWorldSpaceAR(cc.v2(0, 0));
            bgpos = sch.r.convertToNodeSpaceAR(bgpos);

            c.position = bgpos;
            c.scaleX = c.scaleY = 0.1;

            if (DEF.time.tangda <= 0) {
                this.pGame.audio.pai(code, view.player.d.sex);
            } else {
                this.scheduleOnce(()=>{
                    this.pGame.audio.pai(code, view.player.d.sex);
                }, DEF.time.tangda);
            }

            c.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.1, sch.outp[view.index]),
                    cc.scaleTo(0.25, 1)
                ),
                cc.callFunc( 
                    function (tg) {
                        //this._function.call(this._selectorTarget, this.target, this._data);
                        //card.light();
                    },
                    this,
                    null
                )
            ));
        }

        if (sch.lastWC) {
            sch.lastWC.r.removeFromParent();
        }
        sch.lastWC = sch.waitCard;
        sch.waitCard = card;
    },

    // 堂出
    tangCard: function (view, code) {
        //this.clearWaitCard();

        this.popBottomCard(); //回放时起效
        
        let sch = this.sendCardHelp;
        sch.r.active = true;

        let card = new d2Ctrls.LongCard();
        card.init(this, code);
        card.viewIdx = view.index;
        card.tag((view.index == 0) ? 'zimo' : 'tang');

        let c = card.r;
        c.parent = sch.r;

        if (!this.pGame.DMode.isDrive) {
            c.position = sch.outp[view.index];
            //card.light();
        } else {
            c.position = sch.tangPos;
            c.scaleX = c.scaleY = 0.1;

            if (DEF.time.tangda <= 0) {
                this.pGame.audio.pai(code, view.player.d.sex);
            } else {
                this.scheduleOnce(()=>{
                    this.pGame.audio.pai(code, view.player.d.sex);
                }, DEF.time.tangda);
            }

            c.runAction(cc.sequence(
                cc.callFunc( 
                    function (tg) {
                        this.Label_paikuNum.string = --this.pGame.roomInfo.cardNum;
                    },
                    this,
                    null
                ),
                cc.spawn(
                    cc.moveTo(0.25, sch.outp[view.index]),
                    cc.scaleTo(0.25, 1)
                ),
                cc.callFunc( 
                    function (tg) {
                        //this._function.call(this._selectorTarget, this.target, this._data);
                        //card.light();
                    },
                    this,
                    null
                )
            ));
        }

        if (sch.lastWC) {
            sch.lastWC.r.removeFromParent();
        }
        sch.lastWC = sch.waitCard;
        sch.waitCard = card;
    },


    // 吃牌
    chiPai: function () {
        if (! this.chiView) {
            this.Node_cpPos = cc.find("Node_cpPos", this.node);

            let view = new d2Ctrls.ChiPaiView();
            view.init(this);

            this.chiView = view;
        }
        
        this.chiView.show();
        this.scheduleOnce(()=>this.clcSwallow.node.active = true, 0.1);
    },
    endChiPai: function (chicode) {
        this.clcSwallow.node.active = false;
        this.pGame.sendOp(DEF.PlayerOpt.Chi.v, chicode);
    },

    // 胡牌提示
    showHuTip: function (huCode) {
        {/*
                let o = {};
                o.code = k;
                o.fan = v[0];
                o.hx = v[1];
        */}

        if (! this.Sprite_hutip) {
            this.Sprite_hutip = cc.find("Sprite_hutip", this.node);
            this.hboxHutip = cc.find("Sprite_hutip/Node_hb", this.node);
            this.Label_htalln = cc.find("Sprite_hutip/Label_num", this.node).getComponent(cc.Label);
        }

        this.hboxHutip.removeAllChildren();

        
        if (!huCode || huCode.length < 1) {
            this.Sprite_hutip.active = false;
            return;
        }

        this.Sprite_hutip.active = true;

        let seecodes = [];
        for (const key in this.pGame.uidPlayers) {
            const p = this.pGame.uidPlayers[key];
            
            if (p.d.cards.length > 0) {
                seecodes = seecodes.concat(p.d.cards);
            }
            if (p.outCodes && p.outCodes.length > 0) {
                seecodes = seecodes.concat(p.outCodes);
            }

            if (p.showGroups) {
                p.showGroups.forEach(grp => {
                    if (grp.length >= 5) {
                        let e = cc.g.clone(grp);
                        e.shift();
                        seecodes = seecodes.concat(e);    
                    } else {
                        seecodes = seecodes.concat(grp);
                    }
                });
            }
        }
        let nifo = this.pGame.logic.cardsNumInfo(seecodes);

        let w = 0;
        let allnum = 0;
        for (let i = 0; i < huCode.length; ++i) {
            const huc = huCode[i];

            let code = huc.code;
            let hu = cc.instantiate(this.hutipPrefab);

            w = hu.width;

            let leftnum = (4 - (nifo[code] ? nifo[code] : 0));
            allnum += leftnum;

            cc.find("Sprite_val", hu).getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_' + code);
            cc.find("Label_num", hu).getComponent(cc.Label).string = '剩' + leftnum + '张';

            this.hboxHutip.addChild(hu);
        }

        this.Label_htalln.string = allnum;

        this.Sprite_hutip.width = huCode.length*w + this.hboxHutip.getComponent(cc.Layout).spacingX * (huCode.length-1) + 158;
        if (this.Sprite_hutip.width < 307) {
            this.Sprite_hutip.width = 307;
        }
    },
    onSomeTip: function () {
        let ifo = this.playerView[0].player.curchcInfo;
        
        this.showHuTip(ifo);
        
        if (this.Sprite_hutip.active) {
            this.clcSwallow.node.active = true;
        }
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

        pos.from = this.node.convertToNodeSpaceAR(F.headPos);
        pos.to = this.node.convertToNodeSpaceAR(T.headPos)

        return pos;
    },

    /* =================================================================================================================== */
    // 准备
    onButtonReady: function (event, customEventData) {
        cc.log(this.dbgstr('准备 onButtonReady'));

        this.pGame.ready();

        this.ButtonReady.active = false;
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
            普通房-869023-有2人1
            江安大贰,8局,3人,均摊房费,不加底,自摸翻倍,放炮包赔,可查叫,加底,无封顶
        */

        let ri = this.pGame.roomInfo;
        let des = '普通房';
        if (ri.clubId) {
            des = '茶馆房'+'('+ri.clubName+' '+'ID:'+ri.clubId+')';
        }

        des += '-'+ri.roomId;
        des += '-有'+ Object.keys(this.pGame.uidPlayers).length +'人'+'\n';
        des += cc.g.areaInfo[ri.origin].name + '大贰,';
        des += ri.GameNum + '局,';
        des += ri.total + '人';

        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    des += ',' + rules[e];
                } else {
                    cc.error('大贰错误规则ID', e);
                }
            });
        }

        cc.g.utils.setPasteboard(des);
        this.textHint('复制成功');

        cc.log('复制成功',des);
    },
    // 邀请好友 目前发送的下载地址
    onButtonInvite: function (event, customEventData) {
        cc.log(this.dbgstr('邀请好友 onButtonInvite'));

        let ri = this.pGame.roomInfo;

        let gameTypes = cc.g.utils.getJson('GameType');
        let name = gameTypes[ri.gameType] ? gameTypes[ri.gameType].NAME : '大贰';
        let title = GameConfig.appName + '<' + name + '>'+ '\n';
        title += '房号:' + ri.roomId + ' ' + (ri.clubId ? '茶馆房' : '普通房');
        
        let desc = [];
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    desc.push(rules[e]);
                } else {
                    cc.error('大贰错误规则ID', e);
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

    // 点过胡 - 否
    onButtonDGHfou: function (event, customEventData) {
        this.Sprite_dianguohu.active = false;
        this.Node_opt.active = true;
    },

    // 爆 吃 胡 过
    onButtonOperate: function (event, customEventData) {
        if (this.pGame.selfXJ) {
            return;
        }

        this.Node_opt.active = false;

        let os = ['三拢四坎', '黑摆', '爆', '吃', '胡', '过', ];
        let o = parseInt(customEventData);
        
        cc.log(this.dbgstr('onButtonOperate ') + os[o]);

        // 34
        if (o == DEF.OBK._34) {
            this.pGame.sendOp(DEF.PlayerOpt.Do3l4k.v);
            return;
        }
        // 3招
        if (o == DEF.OBK._3zhao) {
            this.pGame.sendOp(DEF.PlayerOpt.SanZhao.v);
            return;
        }
        // 黑摆
        if (o == DEF.OBK.heibai) {
            this.pGame.sendOp(DEF.PlayerOpt.HeiBai.v);
            return;
        }
        // 爆
        if (o == DEF.OBK.bao) {
            this.pGame.sendOp(DEF.PlayerOpt.Bao.v);
            return;
        }
        // 吃
        if (o == DEF.OBK.chi) {
            this.chiPai();
            return;
        }
        // 胡
        if (o == DEF.OBK.hu) {
            this.pGame.sendOp(DEF.PlayerOpt.Hu.v);
            return;
        }
        // 过
        if (o == DEF.OBK.pass) {
            if (this.chiView) {
                this.chiView.clear();
            }

            // 弹出跳过提示的情况
            if (!this.Sprite_dianguohu.active) {
                if (this.Button3l4k.active || this.ButtonHu.active || this.Button3Zhao.active) {
                    this.Sprite_dianguohu.active = true;
                } else {
                    this.pGame.sendOp(DEF.PlayerOpt.Pass.v);
                }
            } else {
                // 确认跳过胡
                this.Sprite_dianguohu.active = false;

                {/*
                    let btn = [this.Button3l4k, this.ButtonHeibai, this.ButtonBao, this.ButtonChi, this.ButtonHu];
                    let btnnum = 0;
                    btn.forEach(e => {if (e.active) ++btnnum;});

                    if (btnnum > 1) {
                        this.Button3l4k.active = this.ButtonHu.active = false;
                        this.Node_opt.active = true;
                    } else {
                        this.pGame.sendOp(DEF.PlayerOpt.Pass.v);
                    }
                */}

                this.pGame.sendOp(DEF.PlayerOpt.Pass.v);
            }

            return;
        }
    },

    // 提牌
    onButtonTipai: function (event, customEventData) {
        this.playerView[0].player.reLayCards();
    },
    /* =================================================================================================================== */

    // 游戏结算
    onGameSettlement: function () {
        this.Sprite_dianguohu.active = false;

        // 显示结算
        let showSettleView = ()=>{
            if (! this.settleView) {
                this.settleView = new d2Ctrls.SettleView();
                this.settleView.init(this);
                this.node.parent.addChild(this.settleView.root);
            }
    
            this.settleView.show();
        }

        // 停止爆的动画
        this.baoAnm(false);
        this.pGame.isGameBao = false;
        this.pGame.audio.bgmGame();
        this.playerView.forEach(view => {
            if (view.anmBao) {
                view.anmBao.stop();
            }
        });

        // 明堂动画
        let huer = this.pGame.SettleData.huer;
        let p = this.pGame.SettleData.pHuer;
        if (huer>0) {
            let mt = p.settle.mtall;
            if (mt.length < 1) {
                cc.log('无明堂动画');
                showSettleView();
            } else {
                cc.log('有明堂动画', mt);

                this.settle_mtidx = 0;
                let mtanmfun = ()=>{
                    this.hufanAnm(p.view, mt[this.settle_mtidx++], ()=>{
                        if (this.settle_mtidx >= mt.length) {
                            showSettleView();
                        } else {
                            mtanmfun();
                        }
                    });
                }
                mtanmfun();
            }
        } else {
            cc.log('播放荒庄动画');
            this.hufanAnm(this.playerView[0], 'huang', showSettleView)
        }
    },
    onGameSettlementEnd: function () {
        this.upPage();

        if (this.Sprite_hutip) {
            this.Sprite_hutip.active = false;
        }

        this.clearWaitCard();
    },

    // 总结算
    onGameSettleFinal: function () {
        if (! this.settleFinalView) {
            this.settleFinalView = new d2Ctrls.SettleFinalView();
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
        cc.log('playerAskJiesan');

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

                let puid = p.d.uid.toNumber ? p.d.uid.toNumber() : p.d.uid;
                
                if (puid == uid) {
                    name = p.d.name;
                    icon = p.d.icon;
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
                    v.player.votetime = 0;
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
        let n = cc.find("Sprite_bp_dipai", this.node);
        if (!this.isbpm) {
            n.destroy();
            return;
        }

        //cc.find("Sprite_fjh_js", this.node).active = false;

        // 底牌列表
        this.bp_dp_gbox = cc.find("Node_gbox", n);
        this.bp_dp_gbox.removeAllChildren();

        this.bp_dipai = n;
        this.bp_dipai.active = false;
    },

    upBackPlay:function () {
        if (!this.isbpm) {
            return;
        }

        let ri = this.pGame.roomInfo;

        this.ButtonReady.active = false;
        this.bp_dipai.active = true;

        this.bp_dp_gbox.removeAllChildren();
        this.bcnds = [];
        let bc = ri.backPlayData.bottom_card;
        for (let i = 0; i < bc.length; ++i) {
            let n = new cc.Node("Sprite" + "Outcard" + i);
            n.addComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_s' + bc[i]);
            this.bp_dp_gbox.addChild(n);
            this.bcnds.push(n);
        }

        if (ri.status < DEF.RMSTA.PreDo.v) {
            this.bp_dipai.active = false;
            return;
        }

        this.playerView.forEach(e => {
            e.bp_handCardView && (e.bp_handCardView.root.active = true);
        });
    },
    popBottomCard:function () {
        if (!this.isbpm) {
            return;
        }

        if (this.bcnds.length < 1) {
            return;
        }

        this.bcnds[0].removeFromParent();
        this.bcnds[0].destroy();
        this.bcnds.shift();
        
        this.pGame.roomInfo.backPlayData.bottom_card.shift();
    },
    /* ======回放============================================================================================================= */



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

        let readyPlayer = ()=>{
            for (let i = 0; i < this.playerView.length; i++) {
                this.playerView[i].root.active = true;
                if (! this.playerView[i].player){
                    this.playerView[i].player = {};
                    let p = this.playerView[i].player;

                    p.view = this.playerView[i];
                    p.showGroups = [];
                    p.outCodes = [];
                    p.POK = {
                        _34: 0,
                        long: 1,
                        bao: 2,
                        chi: 3,
                        peng: 4,
                        zhao: 5,
                        hu: 6,
                        pass: 7,
                    };

                    p.d={};
                    p.d.name = '测试名'+i;
                    p.d.uid = i;
                    p.d.sex = 1;
                    p.d.icon = '1';

                    this.pGame.uidPlayers[p.d.uid] = p;
                }
                
                let p = this.playerView[i].player;
                p.showGroups = [];
            }
        }

        // 互动表情 7
        if (!true) {
            if (! this.dbg7) {
                this.dbg7 = 1;
                this.interactfrm=[];
            }

            if (this.interactView) {
                this.interactView.node.removeFromParent();
                this.interactView = null;
            }

            if (this.dbg7 == 1) {
                this.playerView[0].onTouchHead();
                this.dbg7 = 6;
            } else if (this.dbg7 == 2) {

                this.interactfrm.forEach(e => {
                    e.removeFromParent();
                });

                let pvl = [0,1,2,3];
                for (let i = 1; i <= 3; ++i) {
                    let n = new cc.Node();
                    n.addComponent(cc.Sprite).spriteFrame = cc.g.atlas.interact.getSpriteFrame('hd_img_bq1');
                    n.position = this.node.convertToNodeSpaceAR(this.playerView[pvl[0]].headPos);
                    this.node.addChild(n);

                    let topos = this.node.convertToNodeSpaceAR(this.playerView[pvl[i]].headPos)
                    let seq = cc.sequence(
                        cc.delayTime(0.25),
                        cc.moveTo(0.75, topos),
                        //cc.delayTime(endWaitTime),
                        cc.callFunc((target)=>{
                            //target.destroy();
                        })
                    );

                    n.runAction(seq);

                    this.interactfrm.push(n);
                }

                //++this.dbg7;
            } else if (this.dbg7 == 3) {
                this.showInteractEmo(0, 1, 1);
            } else if (this.dbg7 == 4) {
                let loop = !true;

                if (this.dbg7_anmidx == undefined) {
                    this.dbg7_anmidx = 0;
                } else {
                    ++this.dbg7_anmidx;
                }

                if (this.dbg7_4_anms) {
                    this.dbg7_4_anms.forEach(e => {
                        e.removeFromParent();
                    });
                }
                
                this.dbg7_4_anms=[];

                for (let i = 0; i <= 3; ++i) {
                    let topos = this.node.convertToNodeSpaceAR(this.playerView[i].headPos);

                    let pfb = cc.instantiate(cc.g.pf.interactAnmPf);
                    pfb.position = topos;
                    pfb.uidx = i;
                    this.node.addChild(pfb);
                    this.dbg7_4_anms.push(pfb);

                    let anm = this.crtAnmObj(pfb);

                    if (loop) {
                        anm.loop(anm.names[this.dbg7_anmidx%anm.names.length]);
                    } else {
                        anm.onec(
                            anm.names[this.dbg7_anmidx%anm.names.length],
                            (evt)=>{
                                let seq = cc.sequence(
                                    cc.delayTime(1),
                                    cc.callFunc(
                                        function (target) {
                                            target.removeFromParent();
                                            if (target.uidx == 3) {
                                                this.dbg7_4_anms=[];
                                            }
                                        }, 
                                        this
                                    )
                                );

                                pfb.runAction(seq);
                            }
                        );
                    }
                }

                //loop ? ++this.dbg7 : 0;
            } else if (this.dbg7 == 5) {

                if (this.dbg7_5_idx == undefined) {
                    this.dbg7_5_idx = 1;
                } else {
                    ++this.dbg7_5_idx;
                }

                let id = this.dbg7_5_idx%10 + 1;
                
                this.showInteractEmo(0, 1, id);
                this.showInteractEmo(0, 2, id);
                this.showInteractEmo(0, 3, id);
            } else if (this.dbg7 == 6) {
                this.playerView[1].onTouchHead();
                ++this.dbg7;
            } else if (this.dbg7 == 7) {
                this.playerView[2].onTouchHead();
                ++this.dbg7;
            } else if (this.dbg7 == 8) {
                this.playerView[3].onTouchHead();
                this.dbg7 = 1;
            }
        }

        // 胡牌提示逻辑 6
        if (! true) {
            let p = this.playerView[0].player;
            
            if (! this.dbg6) {
                this.dbg6 = 1;

                this.ButtonReady.active = false;
                this.pGame.roomInfo.status = DEF.RMSTA.Play.v;
                p.canOutCard = true;
                this.playerView[0].upOutCardTip();
            }

            if (this.dbg6 == 1) {
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10,10, 11,12,13,14,15,16,17,18,19,20]; //天胡
                //p.d.cards = [1,2,3,4,5,6,10,10, 11,12,13,14,15,16,19,19]; //胡2对
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,17,18,19,20]; //全10
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10,10, 11,12,13,14,15,16,17,18,19]; //胡1对
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10,10, 11,12,13,14,15,16,17,18,18]; //无叫
                //p.d.cards = [1,1,2,3];
                //p.d.cards = [1,2,3, 5,6,7, 9,9,19, 20];
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10, 11,12,13,14,15,16,19]; //无叫
                //p.d.cards = [1,2,3,4,5,6,7,8, 10,10,10, 15,15,15];
                //p.d.cards = [1,1,2,2,3,3,7,7,10,10, 13,13,13, 15,15,15];
                //p.d.cards = [2,3,4,5,6,7,8,9,10,10, 11,12,13,14,15,16,17,18,19,20];

                // --------------- 打出叫 21 18 15 12 9 6
                //p.d.cards = [1,2,3,4,5,6,7,8,8];
                //p.d.cards = [1,2,3,4,5,6,7,8,9,10,10, 11,12,13,14,15,16,17,18,19,20];
                p.d.cards = [1,2,3, 5,6,7, 11,14,14];
            }

            p.d.cardNum = p.d.cards.length;
            p.hcGroups = this.pGame.logic.handcard2Grops(p.d.cards);
            this.playerView[0].handCardView.upGroups();
            this.playerView[0].Label_huNum.string = '20';
            this.playerView[0].handCardView.Node_noTouch.active = false;

            let sch = this.sendCardHelp;
            if (sch.lastWC) {
                sch.lastWC.r.removeFromParent();
            }
            if (sch.waitCard) {
                sch.waitCard.r.removeFromParent();
            }

            p.onCanOutCard();
            //let jiaokv = this.pGame.logic.getJiaoCodes(p.d.cards, this.pGame.roomInfo.NewRlue);
            //this.pGame.logic.getCanHuCards(p.d.cards, this.pGame.roomInfo.NewRlue);
            //p.canhuCode = [1,2,14,15];
            //this.playerView[0].upHuTip();
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

        // 提示 
        if (! true) {
            this.textHint('asd');
        }

        // 胡牌提示 5
        if (! true) {
            if (! this.dbg5) {
                this.dbg5 = 1;
            }

            let view = this.playerView[0];
            let p = view.player;
            
            if (this.dbg5 == 1) {
                //p.canhuCode = [3, 7, 14,];
                p.bao([3]);
                ++this.dbg5;
            } else if (this.dbg5 == 2) {
                p.bao([3, 14,]);
                ++this.dbg5;
            } else if (this.dbg5 == 3) {
                p.bao([3, 14, 20]);
                ++this.dbg5;
            } else if (this.dbg5 == 4) {
                p.bao([3, 5, 14, 20]);
                ++this.dbg5;
            } else if (this.dbg5 == 5) {
                p.bao([3, 5, 7, 11, 14, 20]);
                ++this.dbg5;
            } else if (this.dbg5 == 6) {
                p.bao([3, 5, 7, 11, 14, 13, 15, 20]);
                ++this.dbg5;
            }
        }

        // 投票 4
        if (! true) {
            if (! this.dbg4) {
                this.dbg4 = 1;
                readyPlayer();
            }

            if (this.dbg4 == 1) {
                let view = this.playerView[0];
                let p = view.player;
                p.voteSta = 1;

                this.playerAskJiesan(p.d.uid, p.voteSta);

                ++this.dbg4;
            } else if (this.dbg4 == 2) {
                let view = this.playerView[1];
                let p = view.player;
                p.voteSta = 1;

                this.playerAskJiesan(p.d.uid, p.voteSta);

                ++this.dbg4;
            } else if (this.dbg4 == 3) {
                let view = this.playerView[2];
                let p = view.player;
                p.voteSta = -1;

                this.playerAskJiesan(p.d.uid, p.voteSta);

                ++this.dbg4;
            } else if (this.dbg4 == 4) {
                this.jiesanView.clear();
                this.dbg4 = 1;
            }
        }

        // 提牌 3
        if (! true) {
            this.ButtonReady.active = false;
            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;

            let p = this.playerView[0].player;
            //p.d.cards = [8,10,3,5,5,7,7,6,9,9,9,15,16,17,11,11,18];
            p.d.cards = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,9,10,20,20,20];
            //p.d.cards = [2,7,10,19,19,19];
            p.d.cardNum = p.d.cards.length;
            //p.hcGroups = this.pGame.logic.cards2Grops_2(p.d.cards);
            p.hcGroups = this.pGame.logic.handcard2Grops(p.d.cards);

            this.playerView[0].handCardView.upGroups();
            this.playerView[0].handCardView.Node_noTouch.active = false;
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

        // 摆牌动画 1
        if (! true){
            if (! this.dbg1) {
                this.dbg1 = 1;
            }

            if (this.dbg1 == 1) {
                readyPlayer();
                ++this.dbg1;

            } else if (this.dbg1 == 2) {
                let view = this.playerView[0];
                let p = view.player;
                let POK = p.POK;
                p.showGroups.push([1,2,2,2,2]);
                p.showGroups.push([0,3,3,3,3]);
                p.newShowNum = 2;
                view.onPlayOpt(POK.long);
                
                ++this.dbg1;

            } else if (this.dbg1 == 3) {
                let view = this.playerView[1];
                let p = view.player;
                let POK = p.POK;
                p.showGroups.push([0,3,3,3,3]);
                p.newShowNum = 1;
                view.onPlayOpt(POK.zhao);
                
                ++this.dbg1;
            } else if (this.dbg1 == 4) {
                let view = this.playerView[2];
                let p = view.player;
                let POK = p.POK;
                p.showGroups.push([3,3,3]);
                p.newShowNum = 1;
                view.onPlayOpt(POK.peng);
                
                ++this.dbg1;
            } else if (this.dbg1 == 5) {
                let view = this.playerView[0];
                let p = view.player;
                let POK = p.POK;
                p.showGroups.push([1,2,3]);
                p.showGroups.push([2,7,10]);
                p.newShowNum = 2;
                view.onPlayOpt(POK.chi);
                
                ++this.dbg1;
            } else if (this.dbg1 == 6) {
                let view = this.playerView[0];
                let p = view.player;
                let POK = p.POK;
                p.showGroups.push([0,3,3,3,3]);
                p.newShowNum = 1;
                view.onPlayOpt(POK.zhao);
                
                //++this.dbg1;
                //this.dbg1 = 1;
            }
        }

        // 10组手牌
        if (! true) {
            let cards = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,11,11,13];

            let res = this.pGame.logic.handcard2Grops(cards);
        }

        // 动画 0
        if (! true) {
            let av = this.anmView;
            av.r.active = true;
            //av.dbg.active = true;

            if (! this.dbg0) {
                this.dbg0 = 3;
            }

            if (this.dbg0 == 1) {
                //av.opt.loopAll();
                av.opt.onec('bao');
                //++this.dbg0;
            } else if (this.dbg0 == 2) {
                let pidx = 0;

                let fun = function() {
                    av.opt.onec(av.opt.names[0],
                        (evt)=>{
                            if (++pidx >= av.ppos.length) {
                                pidx = 0;
                            }
                            av.opt.r.position = av.ppos[pidx];
                            fun();
                        }    
                    );
                }

                fun();
                
                //++this.dbg0;
            } else if (this.dbg0 == 3) {
                av.opt2.loopAll();
                //++this.dbg0;
            } else if (this.dbg0 == 4) {
                let btn = [this.Button3l4k, this.ButtonHeibai, this.ButtonBao, this.ButtonChi, this.ButtonHu];
                btn.forEach(e => {
                    e.active = true;
                });

                this.Node_opt.active = true;

                av.opt.loopAll();
                //av.opt2.loopAll();
                //++this.dbg0;
            } else if (this.dbg0 == 5) {
                av.opt2.onec('zimo');
                ++this.dbg0;
            } else if (this.dbg0 == 6) {
                if (! this.dbg0_6) {
                    this.dbg0_6 = 1;
                }
                
                if (this.dbg0_6 == 1) {
                    av.opt2.play();
                    ++this.dbg0_6;
                } else if (this.dbg0_6 == 2) {
                    av.opt2.stop();
                    ++this.dbg0_6;
                } else if (this.dbg0_6 == 3) {
                    av.opt2.onec();
                    this.dbg0_6 = 1;
                }
                
                //++this.dbg0;
            }
        }
        // 按钮
        if (! true) {
            let btn = [this.Button3l4k, this.ButtonBao, this.ButtonChi, this.ButtonHu];
            btn.forEach(e => {
                e.active = true;
            });

            this.Node_opt.active = true;
        }

        // 添加出牌
        if (! true) {
            let view = this.playerView[1];
            let p = view.player;
            

            if (! this.dbgstp) {
                this.dbgstp = 1 ;

                p.d.cards = [2,3,3,4,4,6,10,10,9,9,9,12,13,15,16,17,17,18,19];
                p.hcGroups = this.pGame.logic.handcard2Grops(p.d.cards);
                view.handCardView.upGroups();

                p.outCodes = [];
                p.waitCode = 1;
            }

            if (this.dbgstp == 1) {
                this.clearWaitCard();
                view.onTangCard();

                this.dbgstp = 2;
            } else if (this.dbgstp == 2) {
                
                p.outCodes.push(p.waitCode);
                view.upOutCards();
                ++p.waitCode;

                this.dbgstp = 1;
            }
        }

        // 添加出牌
        if (! true) {
            let view = this.playerView[1];
            
            if (! this.dbgstp) {
                this.dbgstp = 1 ;
                
                view.root.active = true;

                let p = view.player = {};

                p.outCodes = [];
                p.waitCode = 1;

                p.showGroups = [
                    [1,1,1,1,1],
                    [2,7,10],
                ];
                view.upShowCards();
            }

            let p = view.player;

            if (this.dbgstp == 1) {
                this.clearWaitCard();
                view.onTangCard();

                this.dbgstp = 2;
            } else if (this.dbgstp == 2) {
                
                p.outCodes.push(p.waitCode);
                view.upOutCards();
                ++p.waitCode;

                if (p.waitCode > 20) {
                    p.waitCode = 1;
                }

                this.dbgstp = 1;
            }
        }

        // 结算
        if (! true) {
            let d = {};
            d.dbgdata = true;

            d.huer = 235;//235;0;
            d.dianpaoer = 231;

            d.remaincards = [7,10,2,20,14,4,3,1,6,4,10,6,9,15,10,20,13,14,16,1,6,19,13,18,2,11];

            d.list = [];

            d.list.push({
                winlose: 3,
                hufan:   0,
                huxi:   18,
                uid: 235,
                hucard: 3, //胡的牌
                mingtang: [23],//[1,3,5,7,12,13,14,22],
                hand: [
                    {cards:[2, 7, 10]},
                    {cards:[1, 2, 3]},
                ],
                putout:[

                    {cards:[12, 17, 20]},
                    {cards:[18, 19, 20]},
                    {cards:[5, 5, 5]},
                    {cards:[14, 15, 16]},
                    {cards:[8, 8, 8]},
                    {cards:[1, 9, 9, 9, 9]},
                ],
            });
            d.list.push({
                winlose: -3,
                hufan:   0,
                huxi:   18,
                uid: 231,
                mingtang: [1,3,5,7,12,13,14,22],
                hand: [
                    {cards:[4, 4]},
                    {cards:[19, 19]},
                    {cards:[12, 12, 12]},
                    {cards:[4, 5, 6]},
                    {cards:[14, 15, 16]},
                    {cards:[18, 19]},
                ],
                putout: [
                    {cards:[2, 7, 10]},
                    {cards:[0, 1, 1, 1, 1]},
                ],
            });
            d.list.push({
                winlose: -3,
                hufan:   0,
                huxi:   18,
                uid: 232,
                mingtang: [1,3,5,7,12,13,14,22],
                hand: [
                    {cards:[4, 4]},
                    {cards:[19, 19]},
                    {cards:[12, 12, 12]},
                    {cards:[4, 5, 6]},
                    {cards:[14, 15, 16]},
                    {cards:[18, 19]},
                ],
                putout: [
                    {cards:[2, 7, 10]},
                    {cards:[0, 1, 1, 1, 1]},
                ],
            });
            d.list.push({
                winlose: -3,
                hufan:   0,
                huxi:   18,
                uid: 111,
                mingtang: [],
                hand: [],
                putout: [],
            });


            d.players = {};
            d.players[231] = {
                icon: '1',
                name: '游客231',
                view: this.playerView[0],
            };
            d.players[235] = {
                icon: '2',
                name: '游客235',
                view: this.playerView[1],
            };
            d.players[232] = {
                icon: '3',
                name: '游客232',
                view: this.playerView[2],
            };
            d.players[111] = {
                icon: '4',
                name: '游客111',
                view: this.playerView[3],
            };

            this.pGame.roomInfo.total = 4;
            this.pGame.roomInfo.dealer = 235;

            this.pGame.onGameSettle(d);
        }

        if (! true)
        {
            this.ButtonReady.active = false;

            for (let i = 0; i < this.playerView.length; i++) {
                this.playerView[i].root.active = true;
            }
    
    
            this.starGame();
    
    
            this.playerView[0].player.sendCard();
        }

        // 打牌
        if (! true) {
            this.outCard(this.playerView[0], 12);
        }

        if (! true) {
            this.tangCard(this.playerView[0], 12);
        }

        //吃
        if (! true) {
            let zjc = false;

            if (!zjc) {
                let btn = [this.Button3l4k, this.ButtonBao, this.ButtonChi, this.ButtonHu];
                btn.forEach(e => {
                    e.active = true;
                });
                this.Node_opt.active = true;
            }

            this.ButtonReady.active = false;
            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;

            let p = this.playerView[0].player;
            p.canOptVal = [2];
            p.waitCode = 2;
            //p.d.cards = [8,10,3,5,5,7,7,6,9,9,14,15,16,17,11,11,18];
            //p.d.cards = [2,3,3,4,4,6,10,10,9,9,9,12,13,15,16,17,17,18,19];
            p.d.cards = [1,1,2,3,3,13,4,14,15,5,7,6,2,10,7,18,19];
            p.d.cardNum = p.d.cards.length;
            p.hcGroups = this.pGame.logic.handcard2Grops(p.d.cards);

            this.playerView[0].onTangCard();
            this.playerView[0].handCardView.upGroups();

            if (zjc) {
                this.chiPai();
            }
        }

        // 挪牌
        if (! true) {
            this.ButtonReady.active = false;
            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;

            let p = this.playerView[0].player;
            //p.d.cards = [8,10,3,5,5,7,7,6,9,9,9,15,16,17,11,11,18];
            p.d.cards = [2,7,10,6,6,6,19,19,19];
            p.d.cardNum = p.d.cards.length;
            p.hcGroups = this.pGame.logic.handcard2Grops(p.d.cards);
            p.canOutCard = true;
            this.playerView[0].upOutCardTip();

            this.playerView[0].handCardView.upGroups();
            this.playerView[0].handCardView.Node_noTouch.active = false;
        }

        // 去除手牌
        if (! true) {

            this.ButtonReady.active = false;
            this.pGame.roomInfo.status = DEF.RMSTA.Play.v;

            let p = this.playerView[0].player;
            p.hcGroups = [
                [2,6],
                [4,4],
                [3,3],
                [10,10],
                [9,9,9],
                [12,13,14],
                [15,16,17],
                [17,18,19],
            ];
            
            p.hcGroups = this.pGame.logic.removeCardsFromGroups([13,3,3,12,14], p.hcGroups);

            p.d.cards = this.pGame.logic.grops2cards(p.hcGroups);
            p.d.cardNum = p.d.cards.length;

            this.playerView[0].handCardView.upGroups();
        }
    },
});
