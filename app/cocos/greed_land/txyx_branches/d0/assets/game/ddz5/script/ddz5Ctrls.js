let DEF = require('ddz5Def');

let GM=null;
let PG=null;

let nocolor = !false;

let sethead = (spr, icon)=>{
    if (icon === '') {
        cc.resources.load('textures/head/head_animal_0', cc.SpriteFrame, function (err, asset) {
            spr.spriteFrame = asset;
        });
    } else {
        cc.resources.load('textures/head/head_animal_' + icon, cc.SpriteFrame, function (err, asset) {
            spr.spriteFrame = asset;
        });
    }
};

/* =================================================================================================================== */

// 记牌器
let LocJipaiqiView = cc.Class({

    // dbgstr
    dbgstr: function (info) {
        let s = '记牌器';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    f: function () {  
    },

    //
    init: function (root) {
        this.root = root;

        this.initView();
    },

    //
    initView: function () {
        let r = this.root;

        if (!this.jpqLab) {
            this.jpqLab = {};

            for (let i = 0; i <= 13; ++i) {
                this.jpqLab[i] = cc.find("Label_"+i, r).getComponent(cc.Label);
                this.jpqLab[i].string = 0;
            }
        }
    },


    /* ------------------------------------------------------------------------------------------------------------ */
    // 
    up: function () {
        if (!GM.useJpq || GM.roomInfo.status < DEF.RMSTA.Play.v) {
            PG.Button_jpqActive.active = false;
            this.root.active = false;
            return;
        } else {
            PG.Button_jpqActive.active = true;
            this.root.active = (GM.jpqKg==1);
        }

        for (const key in GM.jpqData) {
            let num = GM.jpqData[key];
            this.jpqLab[key] && (this.jpqLab[key].string = num);
        }
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    //
    hide: function () {
        this.root.active = false;
    },
});

/* =================================================================================================================== */


/* =================================================================================================================== */

// 结算视图
let LocSettleView = cc.Class({

    // dbgstr
    dbgstr: function (info) {
        let s = '结算视图';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    f: function () {  
    },

    //
    init: function (pPage) {
        this.pg = pPage;
        
        this.root = cc.instantiate(this.pg.settlementPf);

        this.initView();
    },

    //
    initView: function () {
        let r = this.root;

        // 地区
        this.Label_diqu = cc.find("Node_ctt/New Node/Label_diqu", r).getComponent(cc.Label);
        // 房间号
        this.Label_room = cc.find("Node_ctt/New Node/Label_room", r).getComponent(cc.Label);
        // 局数
        this.Label_jushu = cc.find("Node_ctt/New Node/Label_jushu", r).getComponent(cc.Label);
        // 时间
        this.Label_time = cc.find("Node_ctt/Label_time", r).getComponent(cc.Label);

        // 基础分
        //this.Label_jichufen = cc.find("Label_jichufen", r).getComponent(cc.Label);

        // 分享一下
        this.Button_share = cc.find("Button_share", r);
        this.Button_share.on('touchend', this.share, this);
        // 继续游戏
        this.Button_gogame = cc.find("Button_gogame", r);
        this.Button_gogame.on('touchend', this.goOnGame, this);
        // 总分结算
        this.Button_final = cc.find("Button_final", r);
        this.Button_final.on('touchend', this.onfinal, this);
    },


    /* ------------------------------------------------------------------------------------------------------------ */
    // 玩家条目 
    upPlayers: function () {
        if (! this.vbPlayer) {
            this.svPlayer = cc.find("Node_ctt/ScrollView_player", this.root);
            this.vbPlayer = cc.find("view/content", this.svPlayer);
        }
        
        let vbp = this.vbPlayer;
        vbp.removeAllChildren();

        let sd = PG.pGame.SettleData;
        for (let i = 0; i < sd.player.length; ++i) {
            vbp.addChild(this.crtPlayerItem(i));
        }

        vbp.getComponent(cc.Layout).updateLayout();
    },

    // 玩家
    crtPlayerItem: function (idx) {
        let pageAtlas = PG.pageAtlas;
        let cardAtlas = PG.cardAtlas;

        let sd = GM.SettleData;
        let pla = sd.player[idx];

        let r = cc.instantiate(PG.SIPlayerPf);
        let ud = {};

        // 自己的背景
        let Sprite_self = cc.find("Sprite_self", r);
        Sprite_self.active = eq64(pla.uid, cc.g.userMgr.userId);

        // 头像 名字 ID
        ud.Lab_name = cc.find("Node_head/Label_name", r).getComponent(cc.Label);
        ud.Lab_name.string = cc.g.utils.getFormatName(pla.name);
        ud.Spr_head = cc.find("Node_head/Sprite_hdbg/Node_mask/Sprite_head", r).getComponent(cc.Sprite);
        if (pla.icon.length > 4) {
            cc.g.utils.setUrlTexture(ud.Spr_head, pla.icon);
        } else {
            let spriteFrame = null;

            if (pla.icon === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            } else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + pla.icon, cc.SpriteFrame);
            }

            ud.Spr_head.spriteFrame = spriteFrame;
        }

        ud.Lab_ID = cc.find("Node_head/Label_id", r);
        if (ud.Lab_ID) {
            ud.Lab_ID.getComponent(cc.Label).string = "" + pla.uid;
        }

        //庄家
        ud.Spr_zhuang = cc.find("Sprite_zhuang", r);
        ud.Spr_zhuang.active = pla.settle.isZhuang;

        //地主
        ud.Sprite_dz = cc.find("Sprite_dz", r).getComponent(cc.Sprite);
        ud.Sprite_dz.node.active = true;
        if (pla.settle.identity==1) {
            ud.Sprite_dz.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_dz');
        } else if (pla.settle.identity==3) {
            ud.Sprite_dz.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_adz');
        } else {
            ud.Sprite_dz.node.active = false;
        }

        //倒梗
        ud.Sprite_dao = cc.find("Sprite_dao", r).getComponent(cc.Sprite);
        ud.Sprite_dao.node.active = true;
        if (pla.settle.identity==1 && pla.settle.gengHan==1) {
            ud.Sprite_dao.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_geng');
        } else if (pla.settle.identity==2 && pla.settle.daoLa==2) {
            ud.Sprite_dao.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_dao');
        } else {
            ud.Sprite_dao.node.active = false;
        }

        //拉
        ud.Sprite_la = cc.find("Sprite_la", r).getComponent(cc.Sprite);
        ud.Sprite_la.node.active = (pla.settle.identity==1 && pla.settle.daoLa==2);


        // 分数
        ud.Lab_win = cc.find("Label_coin_win", r).getComponent(cc.Label);
        ud.Lab_lose = cc.find("Label_coin_lose", r).getComponent(cc.Label);
        ud.Lab_win.node.active = ud.Lab_lose.node.active = false;
        if (pla.settle.totalscore > 0) {
            ud.Lab_win.node.active = true;
            ud.Lab_win.string = '+' + pla.settle.totalscore;
        } else {
            ud.Lab_lose.node.active = true;
            ud.Lab_lose.string = pla.settle.totalscore;
        }

        // 出牌
        ud.chifo = [];
        ud.hbOutCards = cc.find("hdCard", r);
        ud.hbOutCards.removeAllChildren();
        let codes = pla.settle.putout;
        for (let i = 0; i < codes.length; ++i) {
            let item = new LocHandCard();
            item.init(i, codes[i]);
            ud.hbOutCards.addChild(item.root);
            ud.chifo.push(item);
        }
        ud.hbOutCards.getComponent(cc.Layout).updateLayout();

        // 手牌
        ud.coifo = [];
        ud.hbHandCards = cc.find("outCard", r);
        ud.hbHandCards.removeAllChildren();
        codes = pla.settle.hand;
        for (let i = 0; i < codes.length; ++i) {
            let item = new LocHandCard();
            item.init(i, codes[i]);
            ud.hbHandCards.addChild(item.root);
            ud.coifo.push(item);
        }
        ud.hbHandCards.getComponent(cc.Layout).updateLayout();

        r.ud = ud;

        return r;
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    // 
    show: function () {
        let ri = GM.roomInfo;
        let sd = GM.SettleData;

        //this.Button_share.getComponent(cc.Button).interactable = false;

        if (sd.winType == 0) {
        } else {
            GM.audio.winlose(sd.isWin);
        }
        
        // 地区
        //cc.g.areaInfo[ri.origin].name + '五人斗地主';
        this.Label_diqu.string = '五人斗地主';
        // 房间号
        this.Label_room.string = '房间号:' + ri.roomId;
        // 局数
        this.Label_jushu.string = '第' + ri.curGameNum + '局';

        // 时间
        let pt = ri.pbTime ? ri.pbTime : i64v(GM.SettleData.time)*1000;
        this.Label_time.string = cc.g.utils.getFormatTimeXXX(pt, 'Y|.|M|.|D| |h|:|m|:|s|');
        
        // 基础分
        //this.Label_jichufen.string = sd.baseScore;

        this.Button_share.active = this.Button_final.active = this.Button_gogame.active = false;

        if (this.pg.pGame.isBackPlayMode()) {
            this.pg.pGame.backPlay.end();
        } else {
            this.Button_share.active = true;

            if (this.pg.pGame.isGameEndFinal) {
                this.Button_final.active = true;
            } else {
                this.Button_gogame.active = true;
            }
        }

        this.upPlayers();

        this.root.active = true;
    },

    //
    hide: function () {
        this.root.active = false;
    },

    // 分享截图
    share: function (event) {
        cc.log(this.dbgstr('分享截图 onButtonShareCapture'));

        cc.g.utils.shareCaptureScreenToWX(0);
    },

    // 继续游戏
    goOnGame: function (event) {

        this.hide();

        this.pg.pGame.onGameSettleEnd();

        this.pg.onButtonReady();
    },

    // 总分结算
    onfinal: function (event) {
        
        this.hide();
        this.pg.pGame.onGameSettleEnd();
    },
});

/* =================================================================================================================== */


// 总结算视图
let LocSettleFinalView = cc.Class({

    // dbgstr
    dbgstr: function (info) {
        let s = '总结算';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    f: function () {  
    },

    //
    init: function () {
        this.root = cc.instantiate(PG.settleFinalPf);

        this.initView();
    },

    //
    initView: function () {
        let r = this.root;
        
        // // 地区
        // this.Label_area = cc.find("Label_area", r).getComponent(cc.Label);

        // // 房间号
        // this.Label_roomID = cc.find("Label_roomID", r).getComponent(cc.Label);

        // // 总局数
        // this.Label_rouds = cc.find("Node_rouds/Label_rouds", r).getComponent(cc.Label);
        
        // 分享一下
        this.Button_share = cc.find("Button_share", r);
        this.Button_share.on('touchend', this.share, this);
        // 返回大厅
        this.Button_backhall = cc.find("Button_backhall", r);
        this.Button_backhall.on('touchend', this.backhall, this);

        //左右提示
        //this.Sprite_fxtip1 = cc.find("Sprite_fxtip1", r);
        //this.Sprite_fxtip2 = cc.find("Sprite_fxtip2", r);

        // 玩家
        //this.initPlayers();

        this.ScrollView_player = cc.find("ScrollView_player", r).getComponent(cc.ScrollView);
    },

    // 玩家
    initPlayers: function () {
        this.sv_players = cc.find("Node_ctt/ScrollView_players", this.root).getComponent(cc.ScrollView);
        this.sv_players.ox = this.sv_players.node.x;
        this.hboxPlayer = this.sv_players.content;
        this.players = [];

        for (let i = 0; ; ++i) {
            let r = cc.find("Sprite_p"+i, this.hboxPlayer);
            if (!r) {
                break;
            }

            let p={};
            p.r = r;

            // 大赢家
            p.Sprite_bigwin = cc.find("Sprite_bigwin", r);
            // 头像
            p.Sprite_head = cc.find("Sprite_hdbg/Node_mask/Sprite_head", r).getComponent(cc.Sprite);
            // 头像框
            p.Sprite_hdkuang = cc.find("Sprite_hdkuang", r);
            // 房主
            p.Sprite_fangzhu = cc.find("Sprite_fangzhu", r);
            // 名字
            p.Label_name = cc.find("Label_name", r).getComponent(cc.Label);
            // ID
            p.Label_ID = cc.find("Label_ID", r).getComponent(cc.Label);

            // 分数
            p.Label_win = cc.find("Sprite_wlbg/Label_win", r).getComponent(cc.Label);
            p.Label_lose = cc.find("Sprite_wlbg/Label_lose", r).getComponent(cc.Label);

            // 房卡
            p.Sprite_syfk = cc.find("Sprite_fk/Sprite_fk", r).getComponent(cc.Sprite);
            p.Label_kcfk = cc.find("Sprite_fk/Label_kcfk", r).getComponent(cc.Label);
            p.Label_syfk = cc.find("Sprite_fk/Label_syfk", r).getComponent(cc.Label);

            this.players.push(p);
        }
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    //
    upView: function () {
        let ri = GM.roomInfo;
        let sd = GM.SettleFinalData;

        cc.log("sd---------------->>>>>>",sd)

        // this.Sprite_fxtip1.active = this.Sprite_fxtip2.active = true;
        // if (sd.player.length < 4) {
        //     this.sv_players.node.x = this.sv_players.ox + (4-sd.player.length)*(234+12)*0.5;
        //     this.Sprite_fxtip1.active = this.Sprite_fxtip2.active = false;
        // }

        //this.Button_share.getComponent(cc.Button).interactable = false;
        
        // // 地区
        // this.Label_area.string = cc.g.areaInfo[ri.origin].name + '跑得快';
        // // 房间号
        // this.Label_roomID.string = '房间号：' + ri.roomId;
        // // 总局数
        // this.Label_rouds.string = sd.num;


        // 调整滑动区域大小
        let pnum = sd.player.length;
        if (pnum<=3) {
            this.ScrollView_player.node.width = pnum*446 + (pnum-1)*160 + 80*2;
        } else {
            let vs = cc.view.getVisibleSize();
            this.ScrollView_player.node.width = vs.width - 50*2;
        }

        this.upPlyaers();
    },

    //
    upPlyaers: function () {
        cc.log(this.dbgstr('upPlyaers'));

        let sd = GM.SettleFinalData;
        let ctt = this.ScrollView_player.content;
        ctt.destroyAllChildren();
        for (let i = 0; i < sd.player.length; ++i) {
            let d = sd.player[i];
           
            let r = cc.instantiate(PG.settleFPPf);

            //
            cc.find("light", r).active = eq64(d.uid, cc.g.userMgr.userId);
            // 大赢家
            cc.find("dyj", r).active = (d.winlose == sd.maxsco);

            // 头像
            let Sprite_head = cc.find("head", r).getComponent(cc.Sprite);
            if (d.icon.length > 4) {
                cc.g.utils.setUrlTexture(Sprite_head, d.icon);
            } else {
                sethead(Sprite_head, d.icon);
            }

            // 名字
            cc.find("name", r).getComponent(cc.Label).string = d.name;
            // ID
            cc.find("id", r).getComponent(cc.Label).string = i64v(d.uid);

            // 分数
            let win = cc.find("win", r).getComponent(cc.Label);
            let lose = cc.find("lose", r).getComponent(cc.Label);
            win.node.active = lose.node.active = false;
            let sco = d.winlose;
            if (sco > 0) {
                win.node.active = true;
                win.string = '+' + sco;
            } else {
                lose.node.active = true;
                lose.string = sco;
            }

            // 房卡
            cc.find("fk", r).getComponent(cc.Label).string = d.consumeRoomCard;

            ctt.addChild(r);
        }
    },

    /* ------------------------------------------------------------------------------------------------------------ */


    // 分享截图
    share: function (event) {
        cc.log(this.dbgstr('分享截图 onButtonShareCapture'));
        cc.g.utils.shareCaptureScreenToWX(0);
    },

    // 返回大厅
    backhall: function (event) {
        if (PG.jiesanView) {
            GM.playerQuited(GM.getSelfPlayer());
            cc.g.hallMgr.backToHall();
        } else {
            GM.isGameEndFinal = false;
            cc.g.hallMgr.exitGame();
        }
    },
});

/* =================================================================================================================== */



/* =================================================================================================================== */

// 玩家手牌
let LocHandCard = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '手牌';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化
    init: function (idx, code, hcView) {
        //cc.log(this.dbgstr('init'));

        this.idx  = idx;
        this.code = code;
        this.isUp = false;

        this.hcView = hcView;  // 自己的视图

        // 初始化视图
        this.initView();

        this.setCode(this.code);
    },

    // 初始化视图
    initView: function () {
        let c = cc.instantiate(PG.PfCard);
        
        c.oy = c.y;
        this.sprVal = cc.find("Sprite_val", c).getComponent(cc.Sprite);
        this.nsprShadow = cc.find("Sprite_shadow", c);
        this.nsprShadow.active = false;

        this.Sprite_adztag = cc.find("Sprite_val/Sprite_adztag", c);
        this.Sprite_adztag.active = false;
        
        this.root = c;
    },

    // 设置编码
    setCode: function (code) {
        this.code = code;

        if (code < 0) {
            this.sprVal.spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_back');
            return;
        }

        if (code >= 152) {
            this.sprVal.spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_a_' + (code-100));
        } else if (code < 100) {
            this.sprVal.spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_' + code);
        } else {
            let v = Math.floor((code%100)/4);
            this.sprVal.spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_a_' + v);
        }
    },

    // 添加阴影
    shadow: function (isshow) {
        if (this.islock) return;

        this.nsprShadow.active = isshow;
    },

    // 起
    up: function (noAct) {
        if (this.islock) return;

        if (this.isUp) {
            return;
        }

        this.root.stopAllActions();
        this.isUp = true;

        if (noAct) {
            this.root.y = this.root.oy+30;
            return;
        }

        this.hcView.actCardsNum = true;
        this.hcView.upCanTouch();

        this.root.runAction(cc.sequence(
            cc.moveTo(0.1, cc.Vec2(this.root.x, this.root.oy+30)),
            cc.callFunc(
                ()=>{
                    //--this.hcView.actCardsNum;
                    //this.hcView.upCanTouch();
                },
                null,null
            )
        ));


        GM.__actSch && GM.unschedule(GM.__actSch); 
        GM.__actSch = ()=>{
            this.hcView.actCardsNum = false;
            this.hcView.upCanTouch();
            GM.__actSch = null;
        };
        GM.scheduleOnce(GM.__actSch, 0.1);
    },

    // 落
    donw: function (noAct) {
        if (this.islock) return;

        if (!this.isUp) {
            return;
        }

        this.root.stopAllActions();
        this.isUp = false;

        if (noAct) {
            this.root.y = this.root.oy;
            return;
        }

        this.hcView.actCardsNum = true;
        this.hcView.upCanTouch();

        this.root.runAction(cc.sequence(
            cc.moveTo(0.1, cc.Vec2(this.root.x, this.root.oy)),
            cc.callFunc(
                ()=>{
                    //--this.hcView.actCardsNum;
                    //this.hcView.upCanTouch();
                },
                null,null
            )
        ));

        GM.__actSch && GM.unschedule(GM.__actSch); 
        GM.__actSch = ()=>{
            this.hcView.actCardsNum = false;
            this.hcView.upCanTouch();
            GM.__actSch = null;
        };
        GM.scheduleOnce(GM.__actSch, 0.1);
    },


    // 反位置
    unPos: function () {
        this.isUp ? this.donw() : this.up();  
    },



    // 点在卡牌内
    isIn: function (pt) {
        let lp = this.root.convertToNodeSpaceAR(pt);
        
        //let str = '' + this.idx + ': lp' + '(' +lp.x.toFixed(0)+ ',' +lp.y.toFixed(0)+ ')';
        //cc.log(str);

        let x = false;
        let y = false;
        if (lp.x>=0 && lp.x<=this.root.width) {
            x = true;
        }
        if (lp.y>=0 && lp.y<=this.root.height) {
            y = true;
        }

        if (x&&y) {
            return 1;
        }
        if (x) {
            return 2;
        }
        if (y) {
            return 3;
        }
    },
});

// 玩家手牌视图
let HandCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '手牌视图 ';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, selfView) {
        cc.log(this.dbgstr('init'));

        if (!node) {
            cc.error("node null");
            return;
        }
        
        this.root = node; // 根节点 Node_hcLay
        this.selfView = selfView;  // 自己的视图

        this.cardItms = [];
        this.choosedItms = [];

        this.bIdx = 0;
        this.eIdx = 0;

        // 初始化视图
        this.initView();

        this.root.active = false;
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        // 触按挡板
        this.Node_noTouch = cc.find("Node_noTouch", r);
        this.upCanTouch();

        // 实际卡牌区域
        this.Node_handCard = cc.find("Node_handCard", r);
        let pdkCard0 = cc.find("pdkCard0", this.Node_handCard);
        let pdkCard = cc.find("pdkCard", this.Node_handCard);
        this.spaX = pdkCard.x - pdkCard0.x;
        this.spaW = pdkCard.width;
        this.spaX = this.spaX*1.15;

        //this.root.scaleX = 1.1;
        //this.root.scaleY = 1.1;

        pdkCard0.destroy();
        pdkCard.destroy();

        // 调试颜色
        let FillColor = cc.find("FillColor", this.Node_handCard);
        if (nocolor && FillColor) {
            FillColor.removeFromParent();
        }

        this.Node_handCard.on('touchstart',  this.onTouchstart, this);
        this.Node_handCard.on('touchmove',   this.onTouchmove, this);
        this.Node_handCard.on('touchend',    this.onTouchend, this);
        this.Node_handCard.on('touchcancel', this.onTouchcancel, this);
    },

    // 更新卡组
    upCards: function () {
        this.clear();

        let codes = this.selfView.player.handCodes;
        for (let i = 0; i < codes.length; ++i) {
            let item = new LocHandCard();
            item.init(i, codes[i], this);

            this.Node_handCard.addChild(item.root, 100-i);

            this.cardItms.push(item);

            item.Sprite_adztag.active = (this.selfView.player.shenfen!=DEF.SFCZ.DZ && codes[i]>=0 && GM.anDizhuCard==codes[i]);
        }

        this.root.active = true;

        this.rePos();
        
        this.upCanTouch();
    },

    // 重新调整卡牌位置
    rePos: function (isAct) {
        let num = this.cardItms.length;
        if (num < 1) {
            return;
        }

        let addx = (DEF.StartCardNum+5 - num) / 10;
        addx = addx > 1 ? 1 : addx;

        let spaX = this.spaX + addx*18;
        let cw = this.cardItms[0].root.width;

        this.root.width = (num-1)*spaX + cw;

        for (let i = 0; i < num; ++i) {
            this.cardItms[num-i-1].root.x = i*spaX;
            this.cardItms[num-i-1].root.y = this.cardItms[num-i-1].root.oy;
        }

        this.choosedItms = [];
    },

    // 重置卡牌位置
    reSetPos: function () {
        if (!this.cardItms) {
            return;
        }
        this.cardItms.forEach(e => {
            e.donw();
        });
    },

    // 触按控制
    upCanTouch: function () {
        // 游戏或者空闲
        if (GM.roomInfo.status <= DEF.RMSTA.SendCard.v) {
            this.Node_noTouch.active = true;
            return;
        }

        // 有卡牌动画正在进行
        if (this.actCardsNum) {
            this.Node_noTouch.active = true;
            return;
        }

        // 选牌中
        if (this.touching) {
            this.Node_noTouch.active = true;
            return;
        }

        this.Node_noTouch.active = false;
    },

    // 清空
    clear: function () {
        this.cardItms.forEach(e => {
            e.root.removeFromParent();
        });

        this.cardItms = [];
        this.choosedItms = [];

        this.root.active = false;
    },

    /* ================================================================================== */
    // 选按地主牌
    beginHanAdzCard: function () {
        this.reSetPos();

        // 4-10 的牌
        let _4_10 = {};

        // 找出要暗掉的牌 地主随意选择一张自己手里的牌（4-10）并展示到桌面，如果手里没有4-10，则在JQKA中选择一张
        this.shadowItms = [];
        this.cardItms.forEach(e => {
            let val = Math.floor(e.code/4) + 1;
            //let clr = elm%4;

            (val==1) && (val=14);
            (val==2) && (val=15);

            if (val > 10) {
                this.shadowItms.push(e);
            } else {
                if (!_4_10[e.code]) {
                    _4_10[e.code] = [];
                }
                _4_10[e.code].push(e);
            }
        });

        // 过滤掉相同（数字+花色）的牌
        for (const c in _4_10) {
            if (_4_10[c].length > 1) {
                _4_10[c].forEach(e => this.shadowItms.push(e));
            }
        }

        if (this.shadowItms.length < 1) {
            cc.g.global.hint('低概率出现了无牌可选的情况 应该直接进入梗');
            this.endHanAdzCard();
            return;
        }

        this.shadowItms.forEach(e => {
            e.shadow(true)
            e.islock = true;
        });
    },

    endHanAdzCard: function () {
        if (!this.shadowItms) return;

        this.shadowItms.forEach(e => {
            e.islock = false;
            e.shadow(false);
        });

        this.reSetPos();
    },
    /* ================================================================================== */


    /* ================================================================================== */
    // 选完牌
    endChoose: function () {
        cc.log(this.dbgstr('endChoose 选取范围 ' + (this.bIdx+1) + ' - ' + (this.eIdx+1)));

        let i0 = (this.bIdx < this.eIdx) ? this.bIdx : this.eIdx;
        let i1 = (this.bIdx < this.eIdx) ? this.eIdx : this.bIdx;
        for (let i = i0; i <= i1; ++i) {
            this.cardItms[i] && this.cardItms[i].unPos();
        }

        let upnum = 0;
        this.cardItms.forEach(e => {
            if (e.isUp) ++upnum;
        });

        this.selfView.clcSwallow.node.active = (upnum > 0);
    },

    // 获取选择的牌的编码
    getChoosedCode: function () {
        cc.log(this.dbgstr('getChoosedCode 获取选择的牌的编码'));

        // 找出选择的牌
        this.choosedItms = [];
        this.cardItms.forEach(e => {
            if (e.isUp) {
                this.choosedItms.push(e);
            }
        });

        // 找出选择的牌
        let codes = [];
        this.choosedItms.forEach(e => {
            codes.push(e.code);
        });

        return codes;
    },

    // 设置选择的牌的编码
    setChoosedCode: function (codes) {
        cc.log(this.dbgstr('setChoosedCode 设置选择的牌的编码'));

        // 找出选择的牌
        codes.forEach(e => {
            for (let i = 0; i < this.cardItms.length; ++i) {
                let elm = this.cardItms[i]
                if (!elm._needup && elm.code == e) {
                    elm._needup = true;
                    break;
                }
            }
        });

        this.choosedItms = [];
        this.cardItms.forEach(e => {
            if (e._needup) {
                e.up();
                this.choosedItms.push(e);
            } else {
                e.donw();
            }

            delete e._needup;
        });
    },
    /* ================================================================================== */ 


    // ====点击事件区==============================================================================
    // 点击信息
    touchInfo: function (event, tp) {
        let tg = event.getCurrentTarget();

        tg.uTID = event.touch.__instanceId; //event.touch.getID(); //event.getID();
        tg.uWp  = event.getLocation();
        tg.uPre = event.getPreviousLocation();
        tg.uStart = event.getStartLocation();
        tg.uDelta = event.getDelta();
        
        tg.uNp = tg.convertToNodeSpaceAR(tg.uWp);

        // 初始点击点到现在的位置偏移
        tg.uOff = cc.v2(tg.uWp.x - tg.uStart.x, tg.uWp.y - tg.uStart.y);

        // 调试字符串
        let p = [tg.uWp, tg.uNp, tg.uOff];
        let tpStr = ['点击','移动','结束','取消',];
        let dstr = tpStr[tp] + tg.uTID;

        dstr += ' wp' + '(' +tg.uWp.x.toFixed(0)+ ',' +tg.uWp.y.toFixed(0)+ ')';
        dstr += ' np' + '(' +tg.uNp.x.toFixed(0)+ ',' +tg.uNp.y.toFixed(0)+ ')';        
        dstr += ' off' + '(' +tg.uOff.x.toFixed(0)+ ',' +tg.uOff.y.toFixed(0)+ ')';

        if (tp != 1) {
            cc.log(dstr);
        } else {
            tg.uDstr = dstr;
        }

        return tg;
    },

    // 点击
    onTouchstart: function (event) {
        let tg = this.touchInfo(event, 0);
        
        this.touching = true;
        this.upCanTouch();

        this.bIdx = -1;
        for (let i = 0; i < this.cardItms.length; ++i) {
            let e = this.cardItms[i];
            if (e.isIn(tg.uWp)==1) {
                this.bIdx = i;
                break;
            }
        }

        if (this.bIdx < 0) {
            return false;
        }
        
        this.eIdx = this.bIdx;

        this.cardItms[this.bIdx].shadow(true);
    },

    // 移动
    onTouchmove: function (event) {
        let tg = this.touchInfo(event, 1);

        if (this.eIdx < 0) {
            return;
        }

        let idx = -1;
        for (let i = 0; i < this.cardItms.length; ++i) {
            let e = this.cardItms[i];
            let inv = e.isIn(tg.uWp);
            if (inv===1 || inv===2) {
                idx = i;
                break;
            }
        }

        if ((idx < 0) || (idx === this.eIdx)) {
            return;
        }

        this.eIdx = idx;

        this.cardItms.forEach(e => {
            e.shadow(false);
        });

        let i0 = (this.bIdx < this.eIdx) ? this.bIdx : this.eIdx;
        let i1 = (this.bIdx < this.eIdx) ? this.eIdx : this.bIdx;
        for (let i = i0; i <= i1; ++i) {
            this.cardItms[i].shadow(true);
        }

        cc.log(this.dbgstr('onTouchmove 选取范围 ' + (i0+1) + ' - ' + (i1+1)));
    },

    // 结束 节点区域内离开
    onTouchend: function (event) {
        let tg = this.touchInfo(event, 2);

        if (this.eIdx >= 0) {
            this.endChoose();
        }

        this.touching = false;
        this.eIdx = this.bIdx = -1;
        this.upCanTouch();
        this.cardItms.forEach(e => {
            e.shadow(false);
        });
    },

    // 取消 节点区域外离开
    onTouchcancel: function (event) {
        let tg = this.touchInfo(event, 3);

        if (this.eIdx >= 0) {
            this.endChoose();
        }

        this.touching = false;
        this.eIdx = this.bIdx = -1;
        this.upCanTouch();
        this.cardItms.forEach(e => {
            e.shadow(false);
        });
    },
    // ====点击事件区==============================================================================
});

// 回放玩家手牌视图
let BackPlayHandCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '回放手牌视图 ';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View X 45 -100  Y-70 
    init: function (node, selfView) {
        cc.log(this.dbgstr('init'));

        if (!node) {
            cc.error("node null");
            return;
        }
        
        this.root = node; // 根节点 Node_hcLay
        this.selfView = selfView;  // 自己的视图

        this.cardItms = [];

        // 初始化视图
        this.initView();

        this.root.active = false;
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        this.Node_handCard = r;
    },

    // 更新卡组
    upCards: function () {
        let lastac = this.root.active;
        this.clear();
        this.root.active = lastac;

        this.Node_handCard.removeAllChildren();

        let codes = this.selfView.player.handCodes;
        let pvidx = this.selfView.index;
        
        for (let i = 0; i < codes.length; ++i) {
            let item = new LocHandCard();
            item.init(i, codes[i], this)

            item.root.y = Math.floor(i/13)*-70;

            if (pvidx==1 || pvidx==2) {
                item.root.x = -item.root.width + (i%13)*-48;
                this.Node_handCard.addChild(item.root,  Math.floor(i/13)*1000 + 100-i);
            } else if (pvidx==3 || pvidx==4) {
                item.root.x = (i%13)*45;
                this.Node_handCard.addChild(item.root);
            }
        }
    },

    // 清空
    clear: function () {
        this.root.active = false;
    },
});

// 玩家视图
let LocPlayerView = cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // ==============================================================================

    // dbgstr
    dbgstr: function (info) {
        let s = '玩家视图 ' + this.index;

        if (this.player) {
            s += ' ' + this.player.d.name + '('+this.player.d.uid+')';
        }

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, idx, page) {
        this.index  = idx;  // 序号

        cc.log(this.dbgstr('init'));

        if (!node) {
            cc.error("D2PlayerView init node null");
            return;
        }
        
        PG = page; // 主页面
        GM = page.pGame; // 游戏
        
        this.root   = node; // 根节点
        this.pPage  = page; // 主页面
        this.pGame  = this.pPage.pGame; // 游戏
        this.player = null; // 玩家数据

        // 初始化视图
        this.initView();

        this.root.active = (this.index < this.pGame.roomInfo.total);
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        // 语音动画
        this.talking = cc.find("tn", r);
        this.talking && (this.talking.active = false);

        // 头像区域
        let hr = cc.find("Sprite_headArea", r);
        hr.on('touchend', this.onTouchHead, this);

        // 头像背景
        this.Sprite_headbg = cc.find("Sprite_headbg", hr);
        this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
        this.scheduleOnce(()=>this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0)), 0.1);//更新
        // 头像问号
        this.Sprite_wenhao = cc.find("Sprite_headbg/Sprite_wenhao", hr);
        // 头像
        this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", hr).getComponent(cc.Sprite);
        // 庄家图片
        this.Sprite_zhuang = cc.find("Sprite_headbg/Sprite_zhuang", hr).getComponent(cc.Sprite);
        // 名字
        this.Label_name = cc.find("Label_name", hr).getComponent(cc.Label);
        // 离线图片
        this.Sprite_offline = cc.find("Sprite_offline", r);
        this.Sprite_offline.active = false;
        this.Sprite_offline.time = cc.find("Sprite_offline/bg/time", r).getComponent(cc.Label);
        this.Sprite_offline.time.string='0';
        // 托管
        this.Sprite_tuoguan = cc.find("Sprite_tuoguan", r);
        this.Sprite_tuoguan.active = false;

        // 剩余牌数背景
        this.Sprite_cardNumBg = cc.find("Sprite_cardNum", hr).getComponent(cc.Sprite);
        this.Sprite_cardNumBg.node.active = false;
        // 剩余牌数
        this.Label_cardNum = cc.find("Sprite_cardNum/Label_cardNum", hr).getComponent(cc.Label);
        // 货币图片
        //this.Sprite_coin = cc.find("Sprite_coin", hr).getComponent(cc.Sprite);
        // 货币数量
        this.Label_coin = cc.find("Label_coin", hr).getComponent(cc.Label);

        // 地主图片
        this.Sprite_dizhu = cc.find("Sprite_headbg/Sprite_dizhu", hr).getComponent(cc.Sprite);
        // 倒 梗
        this.Sprite_daogeng = cc.find("Sprite_headbg/Sprite_daogeng", hr).getComponent(cc.Sprite);
        // 拉
        this.Sprite_la = cc.find("Sprite_headbg/Sprite_la", hr).getComponent(cc.Sprite);
        // 操作图片
        this.Sprite_optShow = cc.find("Sprite_optShow", r).getComponent(cc.Sprite);
        
        // 回放头像
        if (this.pPage.isbpm) {
            hr.active = false;
            let n = cc.find("Sprite_headArea_bp", r);
            n.active = true;
            this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", n).getComponent(cc.Sprite);
            this.Sprite_zhuang = cc.find("Sprite_headbg/Sprite_zhuang", n).getComponent(cc.Sprite);
            this.Label_name = cc.find("Label_name", n).getComponent(cc.Label);

            this.Sprite_dizhu = cc.find("Sprite_headbg/Sprite_dizhu", n).getComponent(cc.Sprite);
            this.Sprite_daogeng = cc.find("Sprite_headbg/Sprite_daogeng", n).getComponent(cc.Sprite);
            this.Sprite_la = cc.find("Sprite_headbg/Sprite_la", n).getComponent(cc.Sprite);
        } else {
            hr.active = true;
            let n = cc.find("Sprite_headArea_bp", r);
            n && n.destroy();
        }

        // 已准备
        this.Sprite_readyed = cc.find("Sprite_readyed", r).getComponent(cc.Sprite);

        // 手牌区的根节点 只有玩家自己有 对其他玩家 这个节点是不存在的
        let Node_hcLay = cc.find("Node_hcLay", r);
        if (Node_hcLay) {
            this.handCardView = new HandCardView();
            this.handCardView.init(Node_hcLay, this);
        }

        // 回放手牌区的根节点
        let Node_bp_hcLay = cc.find("Sprite_bp_hc", r);
        if (Node_bp_hcLay) {
            if (!this.pPage.isbpm) {
                Node_bp_hcLay.destroy();
            } else {
                this.bp_handCardView = new BackPlayHandCardView();
                this.bp_handCardView.init(Node_bp_hcLay, this);
            }
        }
        

        // 出牌  
        this.Node_ocLay = cc.find("Node_ocLay", r);
        if (this.pPage.isbpm) {
            let pvidx = this.index;
            if (pvidx==1 || pvidx==2) {
                this.Node_ocLay.x = -357-80;
            } else if (pvidx==3 || pvidx==4) {
                this.Node_ocLay.x = 339+80;
            }
        }
        this.Node_outCards = cc.find("Node_ocLay/Node_cards", r);
        this.Node_outCards && this.Node_outCards.removeAllChildren();
        this.Node_outAnm = PG.crtAnmObj(cc.find("Node_ocLay/Node_anm", r));
        this.Node_outAnm && this.Node_outAnm.stop();
        this.Node_outAnm && (this.Node_outAnm.r.y += 40);


        // 倒计时
        this.daojishi = cc.find("playDaojishi", this.Sprite_headbg);
        this.djsTime = cc.find("playDaojishi/Label_time", this.Sprite_headbg).getComponent(cc.Label);

        // 文字表情节点
        this.Node_txtEmoji = cc.find("Node_txtEmoji", r);

        // 操作动画
        this.optAnm = PG.crtAnmObj(cc.find("Node_anmopt", r));
        this.optAnm.stop();

        // 报警动画
        let Node_anmwarn = cc.find("Node_anmwarn", r);
        if (Node_anmwarn) {
            this.warnAnm = PG.crtAnmObj(Node_anmwarn);
            this.warnAnm.stop();
        }

        // 空白区牌归位
        let ClickSwallow = cc.find("ClickSwallow", r)
        if (ClickSwallow) {
            this.clcSwallow = ClickSwallow.getComponent('ClickSwallow');
            this.clcSwallow.node.active = false;
            this.clcSwallow.endCall = function(){
                cc.log('hand card clcSwallow');

                this.handCardView.reSetPos();
                this.clcSwallow.node.active = false;
            }.bind(this);
        }
    },

    //
    onTouchHead: function (event) {
        if (! this.pPage.___dbg) {
            if (! this.player) {
                return;
            }
    
            if (eq64(GM.selfUID, this.player.d.uid)) {
                return;
            }
        }

        /*
        let seatN = {
            2:[0,3],
            3:[0,1,4],
            4:[0,1,3,6],
        };
        */
        let p = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));

        let tn = this.pGame.roomInfo.total;

        let pos = this.pPage.node.convertToNodeSpaceAR(this.headPos);
        if (this.index == 0) {
            pos.x = p.x - 350;
            pos.y += 100;
        } else if (this.index == 1) {
            pos.x = p.x - 800;
            pos.y -= 100;
        } else if (this.index == 2) {
            pos.x = p.x - 800;
        } else if (this.index == 3) {
            pos.x = p.x - 350;
            pos.y -= 100;
        } else if (this.index == 4) {
            pos.x = p.x - 350;
            pos.y -= 100;
        }

        this.pPage.showInteractDlg(this.player ? this.player.d : null, pos);
    },

    // 设置玩家
    playerJoin: function (player) {
        this.player = player; // 玩家数据
        this.root.active = this.player!=null;
    },

    // 玩家退出游戏
    quite: function () {
        this.player = null;
        // this.root.active = false;
        this.upView();
    },


    // 更新视图
    upView: function () {
        if (!this.root.active) {
            return;
        }

        cc.log(this.dbgstr('upView'));

        let d=null;

        if (this.player) {
            d = this.player.d;
        }

        //名字
        this.Label_name.string = d ? cc.g.utils.getFormatName(d.name, 6) : '';
        
        //头像
        this.Sprite_head.node.active = d!=null;
        this.Sprite_wenhao.active = !this.Sprite_head.node.active;
        if (d) {
            if (d.icon.length > 4) {
                cc.g.utils.setUrlTexture(this.Sprite_head, d.icon);
            } else {
                let spriteFrame = null;
    
                if (d.icon === '') {
                    spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                } else {
                    spriteFrame = cc.loader.getRes('textures/head/head_animal_' + d.icon, cc.SpriteFrame);
                }
    
                this.Sprite_head.spriteFrame = spriteFrame;
            }
        }

        // 货币图片
        //let coinSprFrame = this.pPage.moneyIconSpriteFrame;
        //if(coinSprFrame.length > 0) {
        //    this.Sprite_coin.spriteFrame = coinSprFrame[this.pGame.roomInfo.type - 1];
        //}

        // 货币数量
        if (d) {
            let coin = (d.money.toNumber ? d.money.toNumber() : d.money);
            coin = cc.g.utils.realNum1(coin);
            this.Label_coin.string = parseFloat(coin);
        } else {
            this.Label_coin.string = 0;

            if (this.offlineSch) {
                this.Sprite_offline.active = false;
                this.unschedule(this.offlineSch, this);
                this.offlineSch = null;
            }
        }
        
        this.upReady();
        this.upZhuang();
        this.upIdentity();
        this.upDaogeng();
        this.upOptDeskShow();
        this.upDaojishi();
        this.upHandCard();
        this.upOutCards();
        this.upOnline();
        this.upTuoguan();

        if (this.player && this.player.isSelf) {
            if (this.player.isHanAdzCard) {
                this.handCardView.beginHanAdzCard();
            } else {
                this.handCardView.endHanAdzCard();
            }
        }

        if (!d || d.canOutCard) {
            this.optAnm.stop();
        }

        if (!d || this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            this.optAnm.stop();
            this.warnAnm && this.warnAnm.stop();
            return;
        }

        if (d && this.handCardView) {
            this.handCardView.upCanTouch();
        }

        if (!this.player.d.isView) {
            this.onPlayOpt(this.player.isPass ? DEF.PlayerOpt.Pass.v : -1);
        }
    },

    // 准备
    upReady: function () {
        let p = this.player;

        if (!p) {
            this.Sprite_readyed.node.active = false;
            return;
        }

        if (this.pGame.roomInfo.status > DEF.RMSTA.Free.v) {
            this.Sprite_readyed.node.active = false;
            return;
        }

        cc.log(this.dbgstr('upReady'));
        this.Sprite_readyed.node.active = (p && p.isReady);
    },

    // 更新庄家
    upZhuang: function () {
        if (!this.player) {
            this.Sprite_zhuang.node.active = false;
            return;
        }

        if (this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            this.Sprite_zhuang.node.active = false;
            return;
        }

        cc.log(this.dbgstr('upZhuang'));

        this.Sprite_zhuang.node.active = this.player.isZhuang;
    },

    // 更新身份
    upIdentity: function () {
        this.Sprite_dizhu.node.active = false;

        if (!this.player) {
            return;
        }
        if (this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            return;
        }

        cc.log(this.dbgstr('upIdentity'));

        let sf = this.player.shenfen;
        this.Sprite_dizhu.node.active = true;
        if (sf==DEF.SFCZ.DZ) {
            this.Sprite_dizhu.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_dz');
        } else if (sf==DEF.SFCZ.ADZ) {
            this.Sprite_dizhu.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_adz');
        } else {
            this.Sprite_dizhu.node.active = false;
        }
    },
    // 更新倒梗
    upDaogeng: function () {
        this.Sprite_daogeng.node.active = false;
        this.Sprite_la.node.active = false;

        if (!this.player) {
            return;
        }

        if (this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            return;
        }

        cc.log(this.dbgstr('upDaogeng'));

        this.Sprite_daogeng.node.active = true;
        if (this.player.vDao==DEF.SFCZ.DAO || this.player.vDao==DEF.SFCZ.GENDAO) {
            this.Sprite_daogeng.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_dao');
        } else if (this.player.vGeng==DEF.SFCZ.GENG) {
            this.Sprite_daogeng.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_img_geng');
        } else {
            this.Sprite_daogeng.node.active = false;
        }

        this.Sprite_la.node.active = (this.player.vLa==DEF.SFCZ.LA);
    },
    // 更新桌面操作显示
    upOptDeskShow: function () {
        cc.log(this.dbgstr('upOptDeskShow'));

        this.Sprite_optShow.node.active = false;

        let sta = this.pGame.roomInfo.status; 
        if (sta<=DEF.RMSTA.Free.v || sta>=DEF.RMSTA.Play.v) {
            return;
        }

        let p = this.player;
        let frm = null;

        if (!p) {
            cc.log(this.dbgstr('no player'));
            return;
        }

        // 叫 不叫
        if (p.vJiao == DEF.SFCZ.JIAO) {
            frm = this.Sprite_optShow.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_dskopt_jiao');
        } else if (p.vJiao == DEF.SFCZ.JIAONO) {
            frm = this.Sprite_optShow.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_dskopt_jiaono');
        } 

        // 倒 不倒 跟倒
        if (p.vDao == DEF.SFCZ.DAO) {
            frm = this.Sprite_optShow.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_dskopt_dao');
        } else if (p.vDao == DEF.SFCZ.GENDAO) {
            frm = this.Sprite_optShow.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_dskopt_daogen');
        } else if (p.vDao == DEF.SFCZ.DAONO) {
            frm = this.Sprite_optShow.spriteFrame = PG.pageAtlas.getSpriteFrame('ddz5_dskopt_daono');
        }

        this.Sprite_optShow.node.active = (frm!=null);
    },

    upCoin: function (coin) {
        // 货币数量
        if (coin) {
            let _coin = (coin.toNumber ? coin.toNumber() : coin);
            _coin = cc.g.utils.realNum1(_coin);
            this.Label_coin.string = _coin;
            if (this.player && this.player.d) {
                this.player.d.money = coin;
            }
        } else {
            let _coin = (this.player.d ? (this.player.d.money.toNumber ? this.player.d.money.toNumber() : this.player.d.money) : 0);
            _coin = cc.g.utils.realNum1(_coin);
            if (this.player) {
                this.Label_coin.string = coin;
            }
        }

        cc.log(this.dbgstr('货币数量'), this.Label_coin.string);
    },

    // 更新倒计时
    upDaojishi: function () {
        if (!this.player) {
            this.daojishi.active = false;
            return;
        }

        if (this.pPage.isbpm) {
            this.daojishi.active = false;
            return;
        }

        cc.log(this.dbgstr('upDaojishi'));

        let p = this.player;

        if (p.time >= 0) {
            this.daojishi.active = true;
            this.djsTime.string = p.time;

            if (! this.isSchdjs) {
                this.schedule(this.timeSch, 1);
                this.isSchdjs = true;
            }
        } else {
            this.daojishi.active = false;
            this.djsTime.string = 0;

            if (this.isSchdjs) {
                this.unschedule(this.timeSch);
                this.isSchdjs = false;
            }
        }
    },
    timeSch: function (elapsed) {
        let t = parseInt(this.djsTime.string);

        if (isNaN(t)) {
            cc.warn('this.djsTime isNaN');
            this.djsTime.string = '0';
            return;
        }

        if (--t < 0) {
            return;
        }

        if (t>=0 && t<=3) {
            GM.audio.di();
        }

        this.djsTime.string = t;
    },

    // 更新手牌
    upHandCard: function () {
        if (! this.player) {
            this.Label_cardNum.string = 0;
            return;
        }

        if (this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            this.Sprite_cardNumBg.node.active = false;

            if (this.handCardView) {
                this.handCardView.clear();
            }
            if (this.bp_handCardView) {
                this.bp_handCardView.clear();
            }

            return;
        }

        if (this.handCardView) {
            cc.log(this.dbgstr('upHandCard'));
            this.handCardView.upCards();
        } else if (this.bp_handCardView) {
            cc.log(this.dbgstr('up_pb_HandCard'));
            this.bp_handCardView.upCards();
        }


        if (this.Sprite_cardNumBg) {
            if (this.index != 0) {
                this.Sprite_cardNumBg.node.active = true;
            }
            
            this.Label_cardNum.string = this.player.d.cardNum;

            if (!this.player.isSelf && this.player.d.cardNum<=2) {
                if (this.pGame.roomInfo.status >= DEF.RMSTA.Play.v) {
                    if (!GM.isBackPlayMode()) {
                        this.warnAnm && this.warnAnm.play();    
                    }
                }
            } else {
                this.warnAnm && this.warnAnm.stop();
            }
        }
    },

    // 更新出牌 
    upOutCards: function () {
        if (! this.player) {
            return;
        }

        cc.log(this.dbgstr('upOutCards'));

        this.TipRes = null;

        if (this.player.isSelf) {
            PG.Node_ottp.active = false;
            PG.Node_opt.active = false;
        }

        this.Node_outCards.removeAllChildren();

        let codes = this.player.outCodes;
        if (codes.length < 1) {
            return;
        }

        this.Label_cardNum.string = this.player.d.cardNum;
        if (!this.player.isSelf && this.player.d.cardNum<=2) {
            if (!GM.isBackPlayMode()) {
                this.warnAnm && this.warnAnm.play();    
            }
        } else {
            this.warnAnm && this.warnAnm.stop();
        }

        let spax = 40;
        this.Node_ocLay.width = (codes.length-1)*spax + 117;

        let info = GM.logic.getCodesInfo(codes);
        codes = info.codes;
        for (let i = 0; i < codes.length; ++i) {            
            let n = new cc.Node();
            if (codes[i] < 100) {
                n.addComponent(cc.Sprite).spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_' + codes[i]);
            } else if (codes[i] >= 152) {
                n.addComponent(cc.Sprite).spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_a_' + (codes[i]-100));
            } else {
                n.addComponent(cc.Sprite).spriteFrame = PG.cardAtlas.getSpriteFrame('pdk_card_a_' + (info.val[i]-1));
            }
            
            n.setAnchorPoint(0, 0);
            n.x = i*spax;
            this.Node_outCards.addChild(n);
        }

        if (!GM.DMode.isDrive) {
            return;
        }

        // 回放模式下 回退到过的回合 不播放出牌动画
        if (GM.isBackPlayMode() && GM.isPassTurn) {
            return;
        }

        // 动画
        if (!this.outAnmName) {
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
           let o={};
           o[DEF.ComType.SHUN]  = ['shunzi','shunzi',];
           o[DEF.ComType.LIAND] = ['ldui','ldui',];
           o[DEF.ComType.SAN]   = ['sdai','xzha',];
           o[DEF.ComType.SAN1]  = ['sdai','xzha',];
           o[DEF.ComType.FJ]    = ['feiji','feiji',];
           o[DEF.ComType.FJCB]  = ['feiji','feiji',];
           o[DEF.ComType.ZD]    = ['zd','zd',];
           o[DEF.ComType.ZDW]   = ['zd','zd',];
           o[DEF.ComType.ZD8]   = ['zd','zd',];
           o[DEF.ComType.ZDTW]  = ['zd','zd',];
           this.outAnmName = o;
        }
        if (this.outAnmName[this.player.outType]) {
            cc.log(this.outAnmName[this.player.outType]);
            //this.Node_outAnm.r.x = -this.Node_ocLay.anchorX*this.Node_ocLay.width + this.Node_ocLay.width*0.45;
            //this.Node_outAnm.onec(this.outAnmName[this.player.outType][GM.ori]);
        } else {
            this.Node_outAnm.stop();
        }

        GM.audio.pai(info.val, this.player.outType, this.player.d.sex);

        if (this.player.outType>=DEF.ComType.FJ && this.player.outType<=DEF.ComType.FJCB) {
            PG.comPubAnm('feij');
        } else if (this.player.outType==DEF.ComType.ZD) {
            PG.comPubAnm('zhadan');
        } else if (this.player.outType==DEF.ComType.ZDW) {
            PG.comPubAnm('wangzha');
        } else if (this.player.outType==DEF.ComType.ZD8) {
            PG.comPubAnm('8touzha');
        } else if (this.player.outType==DEF.ComType.ZDTW) {
            PG.comPubAnm('tianwangzha');
        } else if (this.player.outType==DEF.ComType.SHUN) {
            PG.comPubAnm('shunzi');
        } else if (this.player.outType==DEF.ComType.LIAND) {
            PG.comPubAnm('liandui');
        }
    },

    // 在线情况 
    upOnline: function () {
        if (! this.player) {
            this.Sprite_offline.active = false;
            return;
        }

        if (this.pPage.isbpm) {
            this.Sprite_offline.active = false;
            return;
        }

        let tstr=()=>{
            this.offlinetime = this.offlinetime||0;

            let m = this.offlinetime/60;
            let s = this.offlinetime%60;

            m = Math.floor(m);

            m = m>9 ? m : ('0'+m);
            s = s>9 ? s : ('0'+s);

            return `${m}:${s}`;
        }

        this.Sprite_offline.active = !this.player.d.online;
        this.offlinetime = this.player.d.outLineTime || 0;
        this.Sprite_offline.time.string = tstr();

        if (this.offlineSch) {
            this.unschedule(this.offlineSch, this);
            this.offlineSch = null;
        }

        if (this.Sprite_offline.active) {
            this.offlineSch = ()=>{
                ++this.offlinetime;
                ++this.player.d.outLineTime;
                this.Sprite_offline.time.string = tstr();
            };

            this.schedule(this.offlineSch, 1);
        }
    },

    upTuoguan: function () {
        if (! this.player) {
            return;
        }

        if (this.Sprite_tuoguan) {
            this.Sprite_tuoguan.active = (!this.Sprite_offline.active && this.player.d.isAuto);
        }
    },

    // 开始游戏
    onStarGame: function () {
        if (!this.root.active) {
            return;
        }

        if (! this.player) {
            return;
        }

        cc.log(this.dbgstr('onStarGame'));

        // 隐藏已经准备
        this.Sprite_readyed.node.active = false;
        
        // 手牌数
        if (this.index != 0) {
            this.Sprite_cardNumBg.node.active = true;
        }
        this.Label_cardNum.string = 0;
    },

    // 提示
    tryTip: function () {
        if (!this.TipRes) {

            let nextpos = (GM.selfDeskId + 1) % GM.players.length;

            let plr = GM.posPlayers[nextpos];

            if (plr && !plr.d.isView && plr.d.cardNum<=1) {
                GM.__tipbig = true;
            }

            if (GM.lastOuter) {
                cc.log('last codes', GM.uidPlayers[GM.lastOuter].outCodes);
                cc.log('last OType', GM.lastOType);

                this.TipRes = GM.logic.getRightCom(this.player.handCodes, GM.uidPlayers[GM.lastOuter].outCodes, GM.lastOType);
            } else {
                if (GM.roomInfo.curGameNum==1){
                    let len = this.player.handCodes.length;

                    if ((GM.ori===0 && len==13) || (GM.ori!==0 && len==19) ) {
                        GM.__shouchu = true;
                    }
                }

                this.TipRes = GM.logic.getRightCom(this.player.handCodes, null, null);
            }

            delete GM.__tipbig;
            delete GM.__shouchu;
            
            this.TipIdx = 0;
        }
        
        if (!this.TipRes || this.TipRes.length<=0) {
            //cc.g.global.hint('没有要的起的牌');
            PG.onButtonOperate(0, DEF.OBK.pass);
            return;
        }

        let codes = this.TipRes[this.TipIdx++];
        this.handCardView && this.handCardView.setChoosedCode(codes);
        this.TipIdx = this.TipIdx % this.TipRes.length;
    },


    // 游戏操作
    onPlayOpt: function (opt) {
        this.upDaojishi();

        // 叫
        if (opt == DEF.PlayerOpt.Jiao.v) {
            this.upOptDeskShow();
            return;
        }

        // 定地主
        if (opt == DEF.PlayerOpt.DingDizhu.v) {
            //this.upIdentity();

            PG.anmView.r.active = true;
            PG.anmView.ddzAnm.onec('', ()=>{
                PG.anmView.r.active = false;
                PG.onOptAnm(this, DEF.PlayerOpt.DingDizhu.v);
            }, false);

            PG.onDizhuPaiAnm(this);

            return;
        }

        // 倒
        if (opt==DEF.PlayerOpt.Dao.v) {
            //this.upDaogeng();
            this.upOptDeskShow();

            if (this.player.vDao!=DEF.SFCZ.DAONO) {
                PG.onOptAnm(this, DEF.PlayerOpt.Dao.v);
            }
            return;
        }

        // 拉
        if (opt==DEF.PlayerOpt.La.v && this.player.vLa==DEF.SFCZ.LA) {
            //this.upDaogeng();
            PG.onOptAnm(this, DEF.PlayerOpt.La.v);
            return;
        }

        // 梗
        if (opt == DEF.PlayerOpt.Geng.v  && this.player.vGeng==DEF.SFCZ.GENG) {
            //this.upDaogeng();
            this.upOptDeskShow();
            PG.onOptAnm(this, DEF.PlayerOpt.Geng.v);
            return;
        }

        // 可以喊
        if (opt == DEF.PlayerOpt.CanLa.v) {
            this.handCardView && this.handCardView.beginHanAdzCard();
            return;
        }
        
        // 喊
        if (opt == DEF.PlayerOpt.Han.v) {
            this.upOptDeskShow();
            this.handCardView && this.handCardView.endHanAdzCard();
            PG.onAnDizhuPaiAnm();

            this.scheduleOnce(()=>PG.playerView[0].handCardView.upCards(), 1);

            return;
        }

        // 暗地主
        if (opt == DEF.PlayerOpt.AnDizhu.v) {
            //this.upIdentity();

            PG.anmView.r.active = true;
            PG.anmView.adzAnm.onec('', ()=> {
                PG.anmView.r.active = false;
                PG.onOptAnm(this, DEF.PlayerOpt.AnDizhu.v);
            }, false);
            
            return;
        }

        this.player && (this.player.isPass = false);
        GM.isPassTurn = false;
        
        // 要不起 不出 不要
        if (opt == DEF.PlayerOpt.Pass.v) {
            this.optAnm.play('ybqi');
            this.player && (this.player.isPass = true);
            GM.isPassTurn = true;
            return;
        }

        if (opt < 0) {
            this.optAnm.stop();
            return;
        }
    },

    // 动画表情
    onAnmEmoji: function (id) {
        let emo = cc.instantiate(cc.g.pf.chatAnmEmojiPf);
        let anm = emo.getComponent(cc.Animation);
        anm.on('stop', (a1, a2, a3)=>{
            cc.log('stop');

            // 表情没播放完就退出房间
            if (!GM.gameScript){
                cc.log('emo.destroy() !gameScript');
                emo.destroy();
                return;
            }

            //emo.removeFromParent();
            let seq = cc.sequence(
                cc.fadeTo(0.5, 0),
                cc.callFunc(function () {
                    cc.log('emo.destroy()');
                    emo.destroy();
                }, 
                this)
            );

            emo.runAction(seq);
        });

        if (this.index == 1) {
            //emo.x -= 180;
        }

        let clips = anm.getClips();
        let sta = anm.play(clips[id-1]._name);
        sta.repeatCount = 1;

        this.Node_txtEmoji.addChild(emo);
    },
});


/* =================================================================================================================== */

let locCtrls = {
    JipaiqiView: LocJipaiqiView,
    PlayerView: LocPlayerView,
    SettleView: LocSettleView,
    SettleFinalView: LocSettleFinalView,
}

module.exports = locCtrls;
