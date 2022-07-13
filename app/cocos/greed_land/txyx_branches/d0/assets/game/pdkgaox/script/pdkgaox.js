
let GameBase = require('GameBase');

let DEF = require('pdkgaoxDef');
let ctrls = require('pdkgaoxCtrls');

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
        let s = '跑得快高县页面';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log(this.dbgstr('onLoad'));

        this.gameMgr = cc.g.pdkgaoxMgr;

        this._super();

        this.pGame = cc.g.pdkgaoxMgr;
        this.pGame.gameScript = this;
        this.pGame.DMode.isDrive = false;
        this.pGame.audio.bgmGame();

        this.isbpm = this.pGame.isBackPlayMode();

        // 初始化界面
        this.initView();

        this.upDeskbg();

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
        }
    },

    start () {
        if (this.pv2) {
            let node = this.pv2;
            this.scheduleOnce(()=>{
                if (! node.ox) {
                    node.ox = node.x;
                    node.oy = node.y;
                }
        
                node.x = node.ox - (1130 - 731);
                node.y = node.oy + (561 - 456);
            }, 0.02);
        }
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

        // 房间号 局数
        let fjh_js = cc.find("Sprite_fjh_js", r);
        this.Label_turn = cc.find("Label_turn", fjh_js).getComponent(cc.Label);
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

        if (this.Node_outChoose.active) {
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
        
        let a1 = [0,1,2,3,];
        let a2 = [0,1,3,];

        o.toPos = [];
        ((this.pGame.roomInfo.total <= 3) ? a2 : a1).forEach(e => {
            let node = cc.find("p"+e, o.r);
            o.toPos.push(node.getPosition());
            node.removeFromParent();
        });

        o.r.removeAllChildren();
        o.r.active = false;

        this.sendCardHelp = o;
    },

    // 初始化操作按钮
    initOperate: function () {
        cc.log(this.dbgstr('initOperate'));

        let r = cc.find("Node_operate", this.node);

        // 提示
        this.Button_tishi = cc.find("Button_tishi", r);
        // 出牌
        this.Button_chupai = cc.find("Button_chupai", r);
        // 过
        this.Button_pass = cc.find("Button_pass", r);

        this.Node_ottp = cc.find("Node_ottp", r);
        this.Node_ottp.active = false;

        r.active = false;
        this.Node_opt = r;
    },

    // 初始化玩家视图
    initPlayerView: function () {
        cc.log(this.dbgstr('initPlayerView'));

        let pn = [];
        let Node_player = cc.find("Node_player", this.node);

        while (true) {
            let i = pn.length + 1;
            let node = cc.find("Node_p"+i, Node_player);

            if (!node) {
                break;
            }

            cc.log(i);

            cc.log('    ' + 'Node_player' + i);
         
            pn.push(node);
        }

        if (this.pGame.roomInfo.total == 3) {
            pn[2].active = false;
            pn = [pn[0],pn[1],pn[3]];
        } else if (this.pGame.roomInfo.total == 2) {
            pn[1].active = false;
            pn[3].active = false;
            pn = [pn[0],pn[2]];
        }


        let pv = this.playerView = [];

        for (let i = 0; i < pn.length; i++) {
            let view = new ctrls.PlayerView();
            view.init(pn[i], i, this);

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

        return;

        // 玩家播放位置
        this.anmView.ppos = [];
        for (let i = 0; i < 3; ++i) {
            let p = cc.find("Node_p" + (i+1), r);
            this.anmView.ppos.push(p.position);
            p.removeFromParent();
        }
    },

    // 玩家操作动画
    comPubAnm:function (name, fun) {
        this.anmView.r.active = true;

        this.anmView.comPubAnm.stop();
        this.anmView.comPubAnm.onec(name, ()=>fun&&fun());

        if (name == 'feij') {
            this.pGame.audio.feiji();
        } else if (name == 'zhadan') {
            this.pGame.audio.boom();
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

        // 玩家视图
        for (let i = 0; i < this.playerView.length; i++) {
            const e = this.playerView[i];
            e.upView();
        }

        // 跟新房主
        this.upFangzhu();

        // 操作按钮
        this.upOperate();

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

        if ((ri.type == 2) || (ri.type == 5) || (ri.GameNum >= ri.curGameNum)) {
            this.Label_turn.string = ri.curGameNum + '/' + ri.GameNum;
        } else {
            this.Label_turn.string = ri.curGameNum;
        }
    },

    // 跟新房主
    upFangzhu: function () {
        let ri = this.pGame.roomInfo;
    },

    // 显示操作按钮
    upOperate: function () {
        if(this.pGame.isBackPlayMode()){
            this.Node_opt.active = false;
            return;
        }
        
        let ri = this.pGame.roomInfo;

        let p = this.playerView[0].player;

        this.Node_opt.active = p.canOutCard;

        this.Button_tishi.active = this.Button_chupai.active = true;
        this.Button_pass.active = this.pGame.isMustOut ? false : !p._1stOut;
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

        this.tgdjsObj = {};
        this.pGame.roomInfo.autoCountDown = [];
        this.upTuoguanTishi();

        //this.Node_gmfreeBtns.active = false;
        this.ButtonReady.active = false;

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
                if (!this.playerView[j].player || 
                     this.playerView[j].player.d.status <= DEF.PlayerSta.Free.v ||
                     this.playerView[j].player.d.isView) {
                    continue;
                }

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
        //des += cc.g.areaInfo[ri.origin].name + '内江跑得快,';
        des += '跑得快,'; //'内江跑得快,';
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
        let name = gameTypes[ri.gameType] ? gameTypes[ri.gameType].NAME : '跑得快'; //'内江跑得快';
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
        let os = ['提示', '出牌', '过', ];
        let o = parseInt(customEventData);
        
        cc.log(this.dbgstr('onButtonOperate ') + os[o]);

        // 提示
        if (o == DEF.OBK.tip) {
            this.playerView[0].tryTip();
            return;
        }
        // 出牌
        if (o == DEF.OBK.out) {
            this.playerView[0].player.outCard();
            return;
        }
        // 过
        if (o == DEF.OBK.pass) {
            this.pGame.sendOp(DEF.PlayerOpt.Pass.v);
            this.Node_opt.active = false;
            this.clearTgTishi(this.pGame.selfUID);
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

            cc.g.utils.addClickEvent(bg, this.node, 'pdkls', 'onClickCardsType', i);

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

        return;

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

        //cc.find("phoneInf", this.node).destroy();
        //cc.find("Sprite_fjh_js", this.node).active = false;
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
        if ( true) {
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
                //let hc = [13,13,12,12,11,11,,10,10,9,9,52,53];
                let hc = [6,8,9,10,1,2,52,53];
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

        // 观战3
        if (! true) {
            if (! this.dbg3) {
                this.dbg3 = 1;
                this.playerView.forEach(e => {
                    e.root.active = true;
                });
            }

            if (this.dbg3==1) {
                this.playerView.forEach(e => {
                    e.onPlayOpt(DEF.PlayerOpt.Pass.v);
                });

                ++this.dbg3;
            } else if (this.dbg3==2) {
                this.playerView.forEach(e => {
                    e.onPlayOpt(DEF.PlayerOpt.GuanZhan.v);
                });

                this.dbg3=1;
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
                this.dbg0 = 1;
            }

            if (this.dbg0 == 1) {
                cc.log('av.comPubAnm.names', av.comPubAnm.names);
                av.comPubAnm.loopAll();
            } else if (this.dbg0 == 1) {
                cc.log('av.t0.names', av.t0.names);
                av.t0.loopAll();
            }

            return;
        }

        // 按钮
        if (! true) {
            this.Node_gmfreeBtns.active = false;
            this.Button_chupai.active = true;
            this.Node_opt.active = true;
        }

        // 结算
        if (! true) {
            let d = {};
            d.dbgdata = true;

            d.list = [];
            d.players = {};

            for (let i = 0; i < 7; ++i) {
                let id = 200+i;

                d.list.push({
                    winlose: 3,
                    uid: id,
                    bombnum: 0,
                    totalscore: 0,
                    handcards: [2, 7, 10],
                    deskcards:[12, 17, 20,147],
                });

                d.players[id] = {
                    icon: ''+ (i%4 + 1),
                    name: '游客' + id,
                    view: this.playerView[i],
                };
            }

            this.pGame.roomInfo.total = 7;
            this.pGame.roomInfo.dealer = 200+3;

            this.pGame.onGameSettle(d);
        }

        // 总结算
        if (! true) {
            this.onGameSettleFinal();
        }
    },
});
