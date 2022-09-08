let DEF = require('daerDef');

let lg_isB2T = true;

// 长牌
let D2LongCard = cc.Class({
    //
    init: function (pg, code) {
        let prefab = pg.longCardPf;

        this.cardAtlas = pg.cardAtlas;
        this.pageAtlas = pg.pageAtlas;
        
        this.r = cc.instantiate(prefab);
        this.code = code;

        // 背景
        this.bk = this.r.getComponent(cc.Sprite);
        // 背光
        //this.sprLight = cc.find("Sprite_light", this.r);

        // 面值1
        this.v1 = cc.find("Sprite_1", this.r).getComponent(cc.Sprite);
        // 面值2
        this.v2 = cc.find("Sprite_2", this.r).getComponent(cc.Sprite);

        // 标签
        this.sprTag = cc.find("Sprite_tag", this.r).getComponent(cc.Sprite);

        this.face();
        this.light(false);
        this.tag();
    },

    // 面值
    face: function () {
        // 无效牌值直接处理为卡背
        if ((!this.code) || (this.code<0) || (this.code>20)) {
            this.back();
            return;
        }

        // 牌面值
        this.bk.spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_face0');
        this.v1.spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_' + this.code);
        this.v2.spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_' + this.code);
    },

    // 牌背
    back: function () {
        // 背景
        this.bk.spriteFrame = this.cardAtlas.getSpriteFrame('d2_card_back');
        this.v2.node.active = this.v1.node.active = false;
    },

    // 背光显示
    light: function (isshow) {
        // if (isshow == undefined) {
        //     isshow = true;
        // }

        // this.sprLight.active = isshow;
    },

    // 标签
    tag: function (tag) {
        this.sprTag.node.active = true;

        if (! tag) {
            this.sprTag.node.active = false;
        } else if (tag == 'tang') {
            this.sprTag.spriteFrame = this.pageAtlas.getSpriteFrame('d2_img_tangchu');
        } else if (tag == 'zimo') {
            this.sprTag.spriteFrame = this.pageAtlas.getSpriteFrame('d2_img_zimo');
        } else {
            this.sprTag.node.active = false;
        }
    },
});


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

// 结算视图
let D2SettleView = cc.Class({

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

        cc.find("Node_Detail", this.root).destroy();

        // 地区
        this.Label_diqu = cc.find("Node_ctt/New Node/Label_diqu", r).getComponent(cc.Label);
        // 房间号
        this.Label_room = cc.find("Node_ctt/New Node/Label_room", r).getComponent(cc.Label);
        // 局数
        this.Label_jushu = cc.find("Node_ctt/New Node/Label_jushu", r).getComponent(cc.Label);
        // 时间
        this.Label_time = cc.find("Node_ctt/Label_time", r).getComponent(cc.Label);
        // 规则
        this.Label_deskrule = cc.find("Label_deskrule", r).getComponent(cc.Label);

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
    // 剩余卡牌
    upLeftcards: function () {
        if (! this.hbLeftcards) {
            this.svLeftcards = cc.find("ScrollView_leftcards", this.root);
            this.hbLeftcards = cc.find("view/content", this.svLeftcards);
        }
        
        let hblc = this.hbLeftcards;
        hblc.removeAllChildren();

        let sd = this.pg.pGame.SettleData;
        let rc = sd.remaincards;

        let atlas = this.pg.cardAtlas;
        for (let i = 0; i < rc.length; ++i) {
            let n = new cc.Node("Sprite" + "Leftcard" + i);
            n.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + rc[i]);
            n.setAnchorPoint(0, 0.5);
            n.scaleX = n.scaleY = 0.9;
            hblc.addChild(n);
        }

        hblc.getComponent(cc.Layout).updateLayout();
    },

    // 玩家条目 
    upPlayers: function () {
        if (! this.vbPlayer) {
            this.svPlayer = cc.find("Node_ctt/ScrollView_player", this.root);
            this.vbPlayer = cc.find("view/content", this.svPlayer);
        }

        this.xjia = this.pg.pGame.roomInfo.total >= 4;
        
        let vbp = this.vbPlayer;
        vbp.removeAllChildren();

        // if (this.xjia) {
        //     vbp.getComponent(cc.Layout).spacingY=-7;
        // } else {
        //     vbp.getComponent(cc.Layout).spacingY=5;
        // }

        let sd = this.pg.pGame.SettleData;
        for (let i = 0; i < sd.player.length; ++i) {
            vbp.addChild(this.crtPlayerItem(i));
            // if (this.xjia && i==1) {
            //     let n = new cc.Node();
            //     n.height = Math.abs(vbp.getComponent(cc.Layout).spacingY) + 3;
            //     n.active = true;
            //     vbp.addChild(n);
            // }
        }

        vbp.getComponent(cc.Layout).updateLayout();
    },

    // 玩家
    crtPlayerItem: function (idx) {
        let ppf = this.pg.SIPlayerPf;

        let hfpf = this.pg.SIHuFanPf;
        let pageAtlas = this.pg.pageAtlas;
        let cardAtlas = this.pg.cardAtlas;

        let sd = this.pg.pGame.SettleData;
        let pla = sd.player[idx];

        let r = cc.instantiate(ppf);
        let ud = {};

        let Button_Detail = cc.find("Button_Detail", r);
        if (Button_Detail) {
            Button_Detail.destroy();
        }

        // 自己的背景
        let Sprite_self = cc.find("Sprite_self", r);
        Sprite_self.active = eq64(pla.uid, cc.g.userMgr.userId);

        // 头像 名字 ID
        ud.Lab_name = cc.find("Node_head/Label_name", r).getComponent(cc.Label);
        ud.Lab_ID = cc.find("Node_head/Label_id", r);
        ud.Spr_head = cc.find("Node_head/Sprite_hdbg/Node_mask/Sprite_head", r).getComponent(cc.Sprite);
        ud.Lab_name.string = pla.name;
        if (ud.Lab_ID) {
            ud.Lab_ID.getComponent(cc.Label).string = "ID:" + pla.uid;
        }
        if (pla.icon.length > 4) {
            cc.g.utils.setUrlTexture(ud.Spr_head, pla.icon);
        }
        else {
            sethead(ud.Spr_head, pla.icon);
        }


        // 分数 货币
        ud.Lab_win = cc.find("Label_win", r).getComponent(cc.Label);
        ud.Lab_lose = cc.find("Label_lose", r).getComponent(cc.Label);
        ud.Lab_win.node.active = ud.Lab_lose.node.active = false;
        let sco = pla.settle.winlose;
        if (sco > 0) {
            ud.Lab_win.node.active = true;
            ud.Lab_win.string = '+' + sco;
        } else {
            ud.Lab_lose.node.active = true;
            ud.Lab_lose.string = sco;
        }

        if (this.xjia && idx>=3) {
            cc.find("Layout_H_cards", r).active = false;
            cc.find("Sprite_hutag", r).active = false;
            cc.find("Sprite_hx", r).active = false;
            cc.find("Sprite_fs", r).active = false;
            cc.find("ScrollView_mt", r).active = false;

            r.ud = ud;
            return r;
        }

        // 牌
        ud.cifo = [];
        ud.hbCards = cc.find("Layout_H_cards", r);
        ud.Spr_hutag = cc.find("Sprite_hutag", r);
        ud.Spr_hutag.active = false;
        let grps = pla.settle.putout.concat(pla.settle.hand);
        let grphxadd = 0;
        for (let i = 0; i < 10; ++i) {
            let nc = cc.find("Node_c" + (i+1), ud.hbCards);
            
            if (!grps[i]) {
                nc.removeFromParent();
                continue;
            }

            let grp = grps[i];
            let ci = {};

            // 牌组的操作和胡数
            ci.Lab_opt = cc.find("Label_opt", nc).getComponent(cc.Label);
            ci.Lab_hu = cc.find("Label_hu", nc).getComponent(cc.Label);

            if (pla.settle.huxi>=0 && i==grps.length-1) {
                ci.Lab_hu.string = pla.settle.huxi-grphxadd;
            } else {
                ci.Lab_hu.string = grp.hu;
                grphxadd += grp.hu;
            }
            
            ci.Lab_opt.node.active = false;
            if (grp.des) {
                ci.Lab_opt.node.active = true;
                ci.Lab_opt.string = grp.des;
            }

            // 牌组
            ci.cards = [];
            let hucard = null;
            let g = cc.find("group", nc);
            let htoffy = 0;
            for (let j = 0; j < 4; ++j) {
                let sprc = cc.find("Sprite_"+j, g).getComponent(cc.Sprite);

                if (j < 4 - grp.codes.length) {
                    sprc.node.removeFromParent();
                    //g.y -= 17;//this.xjia ? 19 : 20.5;
                    htoffy += 0;//17;//this.xjia ? 19 : 20.5;
                    continue;
                }
                sprc.node.uCode = grp.codes[j - (4 - grp.codes.length)];

                sprc.spriteFrame = cardAtlas.getSpriteFrame('d2_card_s' + sprc.node.uCode);
                //sprc.spriteFrame = cardAtlas.getSpriteFrame('d2_card_s' + 2);

                if ((i == grps.length-1) && (sprc.node.uCode==pla.settle.hucard)) {
                    hucard = sprc.node;
                }

                ci.cards.push(sprc);
            }
            g.getComponent(cc.Layout).updateLayout();

            // 胡牌标记
            if (hucard) {
                ud.Spr_hutag.active = true;

                let wp = hucard.convertToWorldSpaceAR(cc.v2(0, 0));
                let topos = ud.Spr_hutag.parent.convertToNodeSpaceAR(wp);
                ud.Spr_hutag.position = topos;
                ud.Spr_hutag.x -= 0;
                ud.Spr_hutag.y -= (4 - htoffy);
            }

            ud.cifo.push(ci);
        }
        ud.hbCards.getComponent(cc.Layout).updateLayout();

        if (pla.settle.huxi > 0) {
            // 胡息
            ud.Lab_huxi = cc.find("Sprite_hx/Label_huxi", r).getComponent(cc.Label);
            ud.Lab_huxi.string = pla.settle.huxi;
        } else {
            cc.find("Sprite_hx", r).active = false;
        }
        
        if (pla.settle.hufan > 0) {
            // 番数
            ud.Lab_fanshu = cc.find("Sprite_fs/Label_fanshu", r).getComponent(cc.Label);
            ud.Lab_fanshu.string = pla.settle.hufan;
        } else {
            cc.find("Sprite_fs", r).active = false;
        }
        

        //  添加胡息番数
        let addHuFanItem = (vBox, data)=>{
            for (let i = 0; i < data.length; ++i) {
                let itm = cc.instantiate(hfpf);
                //itm.getComponent(cc.Sprite).spriteFrame = pageAtlas.getSpriteFrame(bhfrm);
                //let hf = cc.find("Sprite_hf", itm).getComponent(cc.Sprite);
                //hf.spriteFrame = pageAtlas.getSpriteFrame('d2_imgtxt_' + data[i]);
    
                cc.find("Label_mt", itm).getComponent(cc.Label).string = data[i];

                vBox.addChild(itm);
            }
            vBox.getComponent(cc.Layout).updateLayout();
        };
        
        //
        ud.vbmt = cc.find("ScrollView_mt/view/content", r);
        ud.vbmt.destroyAllChildren();
        if (pla.settle.mtstr.length > 0) {
            addHuFanItem(ud.vbmt, pla.settle.mtstr);
        }

        r.ud = ud;

        return r;
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    // 
    show: function () {
        let ri = this.pg.pGame.roomInfo;
        //let sd = this.pg.pGame.SettleFinalData;

        //this.Button_share.getComponent(cc.Button).interactable = false;

        // 地区
        this.Label_diqu.string = cc.g.areaInfo[ri.origin].name + '大贰';
        // 房间号
        this.Label_room.string = '房间号:' + ri.roomId;
        // 局数
        this.Label_jushu.string = '第' + ri.curGameNum + '局';
        //
        let com = cc.g.hallMgr.inGameMenu.Sprite_rule.getComponent('dlgGmruleifo');
        if (com) {
            let str = com.srtlist.join(' ');
            this.Label_deskrule.string = str;
        } else {
            this.Label_deskrule.string = '???';
        }
        

        // 时间
        let pt = ri.pbTime ? ri.pbTime : i64v(this.pg.pGame.SettleData.time)*1000;
        this.Label_time.string = cc.g.utils.getFormatTimeXXX(pt, 'Y|.|M|.|D| |h|:|m|:|s|');
        
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

        this.upLeftcards();
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
let D2SettleFinalView = cc.Class({

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
    init: function (pPage) {
        this.pg = pPage;
        
        this.root = cc.instantiate(this.pg.settleFinalPf);

        this.initView();
    },

    //
    initView: function () {
        let r = this.root;
        
        // 地区
        //this.Label_area = cc.find("Label_area", r).getComponent(cc.Label);

        // 房间号
        //this.Label_roomID = cc.find("Label_roomID", r).getComponent(cc.Label);

        // 总局数
        //this.Label_rouds = cc.find("Node_rouds/Label_rouds", r).getComponent(cc.Label);
        
        // 分享一下
        this.Button_share = cc.find("Button_share", r);
        this.Button_share.on('touchend', this.share, this);
        // 返回大厅
        this.Button_backhall = cc.find("Button_backhall", r);
        this.Button_backhall.on('touchend', this.backhall, this);

        // 玩家
        //this.initPlayers();

        this.ScrollView_player = cc.find("ScrollView_player", r).getComponent(cc.ScrollView);
    },

    // 玩家
    initPlayers: function () {
        this.hboxPlayer = cc.find("Node_ctt/Node_players", this.root);
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
            // 名字
            p.Label_name = cc.find("Label_name", r).getComponent(cc.Label);
            // ID
            p.Label_ID = cc.find("Label_ID", r).getComponent(cc.Label);
            // 房主
            p.Sprite_fangzhu = cc.find("Sprite_fangzhu", r);
            // 剩余房卡
            p.Label_syfk = cc.find("Node_fk1/Label_syfk", r).getComponent(cc.Label);
            p.Sprite_syfk = cc.find("Node_fk1/Sprite_fk", r).getComponent(cc.Sprite);
            // 扣除房卡
            p.Label_kcfk = cc.find("Node_fk2/Label_kcfk", r).getComponent(cc.Label);
            p.Sprite_kcfk = cc.find("Node_fk2/Sprite_fk", r).getComponent(cc.Sprite);
            // 分数
            p.Label_win = cc.find("Label_win", r).getComponent(cc.Label);
            p.Label_lose = cc.find("Label_lose", r).getComponent(cc.Label);

            this.players.push(p);
        }
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    //
    upView: function () {
        let ri = this.pg.pGame.roomInfo;
        let sd = this.pg.pGame.SettleFinalData;

        cc.log("sd---------------->>>>>>",sd)

        this.upInfo();

        // 调整滑动区域大小
        let Lay = this.ScrollView_player.content.getComponent(cc.Layout);
        let pnum = sd.player.length;
        if (pnum<=3) {
            this.ScrollView_player.node.width = pnum*446 + (pnum-1)*160 + 80*2;
            Lay.spacingX = 160;
            Lay.paddingLeft = Lay.paddingRight = 80;
        } else {
            let vs = cc.view.getVisibleSize();
            this.ScrollView_player.node.width = vs.width - 10*2;
            Lay.spacingX = 25;
            Lay.paddingLeft = Lay.paddingRight = 20;
        }

        this.upPlyaers();
    },

    upInfo: function () {
        cc.log("upInfo")

        let ri = this.pg.pGame.roomInfo;

        let r = this.root;
        
        // 地区
        let Node_ri = cc.find("Node_ri", r);
        if (!Node_ri) {
            return;
        }

        let Label_diqu = cc.find("Label_diqu", Node_ri).getComponent(cc.Label);
        Label_diqu.string = cc.g.areaInfo[ri.origin].name + '跑得快';

        let Label_room = cc.find("Label_room", Node_ri).getComponent(cc.Label);
        Label_room.string = `房间号:  ${ri.roomId}  局数: ${ri.curGameNum}/${ri.GameNum}`;

        let Label_time = cc.find("Label_time", Node_ri).getComponent(cc.Label);
        Label_time.string = cc.g.utils.getFormatTimeXXX(null, 'Y|.|M|.|D| |h|:|m|:|s|');
    },

    //
    upPlyaers: function () {
        cc.log(this.dbgstr('upPlyaers'));

        let sd = this.pg.pGame.SettleFinalData;
        let ctt = this.ScrollView_player.content;
        ctt.destroyAllChildren();
        for (let i = 0; i < sd.player.length; ++i) {
            let d = sd.player[i];
           
            let r = cc.instantiate(this.pg.settleFPPf);

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
        if (this.pg.jiesanView) {
            this.pg.pGame.playerQuited(this.pg.pGame.getSelfPlayer());
            cc.g.hallMgr.backToHall();
        } else {
            this.pg.pGame.isGameEndFinal = false;
            cc.g.hallMgr.exitGame();
        }
    },
});

/* =================================================================================================================== */


// 吃牌视图
let lg_cbgrops = null;
let D2ChiPaiView = cc.Class({
    //
    init: function (pPage, lvView) {
        
        let prefab = pPage.chiViewPf;
        
        this.pg = pPage;
        this.lvView = lvView;
        this.lv = lvView ? (lvView.lv + 1) : 0;

        this.r = cc.instantiate(prefab);
        let r = this.r;
        
        this.pg.Node_cpPos.addChild(r);
        if (this.lvView) {
            r.x = this.lvView.r.x - (this.lvView.bg.width+20)*1.5;    //-130;
        }


        // 背景
        this.bg = cc.find("Sprite_bg", r);
        // 标题
        this.Sprite_title = cc.find("Sprite_bg/Sprite_guang/Sprite_title", r).getComponent(cc.Sprite);
        if (this.lv > 0) {
            let pgAtlas = this.pg.pageAtlas;
            this.Sprite_title.spriteFrame = pgAtlas.getSpriteFrame('d2_imgtxt_bipai');
        }
        
        // 吃牌HBOX
        this.Layout_chi = cc.find("Layout_chi", r);
        this.Layout_chi.removeAllChildren();
    },

    // 创建吃摆组
    createGroups: function () {
        if (this.lvView) {
            this.grops = this.lvView.tg.uCB.bai;
        } else {
            let code = this.pg.playerView[0].player.canOptVal[0];
            let hcodes = this.pg.playerView[0].player.d.cards;

            if (lg_cbgrops && lg_cbgrops.length>0) {
                this.grops = lg_cbgrops;
            } else {
                lg_cbgrops = this.grops = this.pg.pGame.logic.getChiBai(hcodes, code);
            }
        }
    },

    // 显示吃牌列表
    show: function () {
        //let code = 

        this.r.active = true;

        let pf = this.pg.showGroup;
        let atlas = this.pg.cardAtlas;

        this.createGroups();

        this.Layout_chi.removeAllChildren();
        for (let i = 0; i < this.grops.length; ++i) {
            const g = this.grops[i];
            
            let pfb = cc.instantiate(pf);
            let sg = cc.find("Node_hbox", pfb);
            let Node_click = cc.find("Node_click", pfb);

            sg.anchorY = 0.5;
            Node_click.anchorY = 0.5;

            Node_click.uIdx = i;
            Node_click.uCB = g;

            let c3 = cc.find("Sprite_3", sg);
            sg.height = c3.height * 3;
            c3.removeFromParent();

            for (let j = 0; j < g.chi.length; ++j) {
                if (lg_isB2T) {
                    cc.find("Sprite_"+j, sg).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + g.chi[g.chi.length-1 -j]);
                } else {
                    cc.find("Sprite_"+j, sg).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + g.chi[j]);
                }
            }

            Node_click.on('touchend', this.onTouchend, this);
            
            this.Layout_chi.addChild(pfb);
        }

        // 调用更新后不会立即更新
        //let sz = this.Layout_chi.getContentSize();
        this.Layout_chi.getComponent(cc.Layout).updateLayout();
        //sz = this.Layout_chi.getContentSize();
        //this.r.setContentSize(sz);

        let num = this.grops.length;
        this.r.width = num*58 + (num-1)*30;

        this.bg.width  = this.r.width + 20*2;
        this.bg.height = this.r.height + 12*2;

        this.r.active = true;
    },

    // 隐藏
    hide: function () {
        this.r.active = false;
        this.tg = null;
        if (this.baiView) {
            this.baiView.hide();
        }
    },


    // 点击吃牌
    onTouchend: function (event) {
        let tg = event.getCurrentTarget();

        if (this.tg && this.tg.uIdx==tg.uIdx) {
            return;
        }

        this.tg = tg;
        if (this.tg.uCB.bai.length < 1) {
            cc.log('无牌可摆 进行吃牌');
            this.endChi();
            return;
        }

        if (! this.baiView) {
            cc.log('显示摆牌');
            let view = new D2ChiPaiView();
            view.init(this.pg, this);
            this.baiView = view;
        } else {
            cc.log('刷新摆拍');
        }

        this.baiView.show();
    },

    // 完成吃牌
    endChi: function (chiArr) {
        let chi = this.tg.uCB.chi;

        if (! chiArr) {
            chiArr = [chi];
        } else {
            chiArr.unshift(chi);
        }

        if (this.lvView) {
            this.lvView.endChi(chiArr);
            return;    
        }

        let code = this.pg.playerView[0].player.canOptVal[0];
        let chicode = [];

        chiArr.forEach(g => {
            let pc = true;

            g.forEach(c => {
                if (pc && c==code) {
                    pc = false;
                    return;
                }

                chicode.push(c);
            });
        });

        cc.log('吃摆牌', chiArr, chicode);
        this.pg.endChiPai(chicode);

        this.clear();
    },

    // 清除
    clear: function () {
        lg_cbgrops = null;

        this.tg = null;
        this.r.active = false;
        this.Layout_chi.removeAllChildren();

        if (this.baiView) {
            this.baiView.clear();
        }
    },
});



/* =================================================================================================================== */

// 玩家手牌
let lc_creatHandCard = function (grp, idx, code) {
    let hcPrefab = grp.hcView.PG.hcPrefab;
    let atlas = grp.hcView.PG.cardAtlas;
    let spaY = grp.hcView.PG.handCardSpa.y;

    let c = cc.instantiate(hcPrefab);
    c.uGrp  = grp;
    c.uCode = code;
    c.uIdx  = idx;
    c.isCard = true;

    c.y = c.uIdx*spaY;
    c.uOy = c.y;
            
    cc.find("Sprite_val", c).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_' + c.uCode);
    c.uSprite_jiao = cc.find("Sprite_jiao", c);
    c.uSprite_jiao.active = false; 
    
    // --------------------------------------------------------------------
    // 添加阴影
    c.uShadow = function () {
        if (this.uShadowSpr) {
            return;
        }

        let n = new cc.Node("Sprite" + "G" + this.uGrp.inedx + "Idx"+this.uIdx);
        n.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_shander1');
        n.setAnchorPoint(0, 0);
        n.x = n.y = 5;

        this.addChild(n);
    };

    // 叫牌提示
    c.uJiao = function (isshow) {
        this.uSprite_jiao.active = isshow;
        this.uHuCode = isshow ? isshow : null;
    };

    return c;
};

let nocolor = true;

// 玩家手牌分组
let D2HCGroup = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '牌组'+this.inedx;

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, idx, hcView) {
        this.inedx = idx;
        this._1sti = this.inedx;

        //cc.log(this.dbgstr('init'));

        if (!node) {
            cc.error("node null");
            return;
        }
        
        this.root = node; // 根节点
        this.hcView = hcView;  // 手牌视图

        this.huNum = 0;

        // 初始化视图
        this.initView();

        this.root.active = true;
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        // 卡牌节点
        this.Node_cards = cc.find("Node_cards", r);

        // 牌组胡数
        this.Sprite_hubg = cc.find("Sprite_hubg", r);
        this.Label_huNum = cc.find("Sprite_hubg/Label_huNum", r).getComponent(cc.Label);
        this.Label_huNum.string = '胡数:' + this.huNum;

        // 调试颜色
        let FillColor = cc.find("FillColor", r);
        if (nocolor && FillColor) {
            FillColor.removeFromParent();
        }

        this.clear();
    },

    // 设置数据
    setData: function (g) {
        if (!g || g.length < 1 || g.length > 4) {
            cc.error(this.dbgstr('setData 数据错误'))
        }

        this.clear();

        // 分析牌组
        this.gInfo = this.hcView.GM.logic.analyseGrop(g); 

        // 添加牌
        for (let i = 0; i < g.length; ++i) {
            const code = g[i];

            let c = lc_creatHandCard(this, g.length-1 - i, code);

            // 不是坎或者拢的类型就可以点击卡牌
            if (this.gInfo.kan || this.gInfo.long) {
                c.uShadow();

                this.root.uGrp = this;

                if (!this.hcView.PG.isbpm) {
                    this.root.on('touchstart',  this.onTouchstart, this);
                    this.root.on('touchmove',   this.onTouchmove, this);
                    this.root.on('touchend',    this.onTouchend, this);
                    this.root.on('touchcancel', this.onTouchcancel, this);
                }
            } else {
                if (!this.hcView.PG.isbpm) {
                    c.on('touchstart',  this.onTouchstart, this);
                    c.on('touchmove',   this.onTouchmove, this);
                    c.on('touchend',    this.onTouchend, this);
                    c.on('touchcancel', this.onTouchcancel, this);
                }
            }

            this.cards[c.uIdx] = c;
            this.Node_cards.addChild(c);
        }

        this.upHuNum();
    },

    // 更新胡数
    upHuNum: function () {
        if (this.hcView.PG.isbpm && this.hcView.selfView.index!=0) {
            this.Sprite_hubg.active = false;
            return;
        }

        let num = this.cards.length;

        if (num < 1) {
            this.Sprite_hubg.active = false;
            return;
        }

        this.Sprite_hubg.active = true;

        this.huNum = 0;

        if (num >= 3)
        {
            let codes = this.getCodes();
            let ifo = this.hcView.GM.logic.getHuInfo(codes);
            this.huNum = ifo ? ifo.h : 0;
        }

        this.Label_huNum.string = '胡数:' + this.huNum;
    },

    // 获取卡组编码
    getCodes:function () {
        let codes = [];

        this.cards.forEach(e => {
            codes.push(e.uCode);
        });

        return codes.reverse();
    },

    // 移除
    remove: function (idx) {
        let rmvcard = this.cards[idx];

        if (! rmvcard) {
            cc.error('找不到牌 无法移除');
            return;
        }

        let nc = [];
        for (let i = 0; i < this.cards.length; ++i) {
            const e = this.cards[i];

            if (i < idx) {
                nc.push(e);
            } else if (i > idx) {
                --e.uIdx;
                nc.push(e);
            }
        }
        this.cards = nc;

        rmvcard.removeFromParent();

        this.upHuNum();

        if (this.cards.length <= 0) {
            this.Sprite_hubg.active = false;
            return;
        }

        this.rePosCard();
    },

    // 添加
    add: function (tg) {
        let gp = this.root.convertToNodeSpaceAR(tg.uWp);
        let sp = tg.convertToNodeSpaceAR(tg.uStart);

        let c = lc_creatHandCard(this, -1, tg.uCode);
        c.x = gp.x - sp.x;
        c.y = gp.y - sp.y;

        let spaY = this.hcView.PG.handCardSpa.y;
        let idx = (gp.y - c.height) / spaY;
        idx = Math.ceil(idx);
        
        if (idx > this.cards.length) {
            idx = this.cards.length;
        }
        if (idx <= 0) {
            idx=0;
        }

        c.uIdx = idx;

        for (let i = idx; i < this.cards.length; ++i) {
            ++this.cards[i].uIdx;
        }

        {
            c.on('touchstart',  this.onTouchstart, this);
            c.on('touchmove',   this.onTouchmove, this);
            c.on('touchend',    this.onTouchend, this);
            c.on('touchcancel', this.onTouchcancel, this);
        }

        this.cards.push(c);
        this.Node_cards.addChild(c);

        this.upHuNum();

        this.rePosCard();
    },



    // 清空
    clear: function () {
        this.cards = [];
        this.gInfo = {};

        this.huNum = 0;

        this.Sprite_hubg.active = false;
        this.Node_cards.removeAllChildren();

        if (this.mvCard) {
            this.mvCard.removeFromParent();
            this.mvCard = null;
        }

        this.root.uGrp = null;
        this.root.uMoved = null;

        this.root.off('touchstart',  this.onTouchstart, this);
        this.root.off('touchmove',   this.onTouchmove, this);
        this.root.off('touchend',    this.onTouchend, this);
        this.root.off('touchcancel', this.onTouchcancel, this);
    },


    // 内部移动后调整顺序
    rePosAfterMove: function (tg) {
        let spaY = this.hcView.PG.handCardSpa.y;
        let idx = (tg.uGp.y - tg.height) / spaY;
        idx = Math.ceil(idx);

        if (idx > this.cards.length-1) {
            idx = this.cards.length-1;
        }
        if (idx <= 0) {
            idx=0;
        }

        if (tg.uIdx == idx) {
            return;
        }

        if (idx < tg.uIdx) {
            cc.log("往下移动", idx);
            for (let i = idx; i < tg.uIdx; ++i) {
                ++this.cards[i].uIdx;
            }
        } else if (idx > tg.uIdx) {
            cc.log("往上移动", idx);
            for (let i = idx; i > tg.uIdx; --i) {
                --this.cards[i].uIdx;
            }
        }

        tg.uIdx = idx;

        this.rePosCard();
    },
    // 重新调整卡牌位置
    rePosCard: function (isAct) {
        let spaY = this.hcView.PG.handCardSpa.y;

        let tmp = [];
        for (let i = 0; i < this.cards.length; ++i) {
            const e = this.cards[i];
            tmp[e.uIdx] = e;
        }
        for (let i = 0; i < tmp.length; ++i) {
            const e = tmp[i];
            e.x = 0;
            e.y = e.uIdx*spaY;
            e.uOy = e.y;
            e.zIndex = 10-i;
        }

        this.cards = tmp;
    },


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

        // 卡牌有相对卡组的位置
        //if (tg.isCard) {
            tg.uGp = tg.uGrp.root.convertToNodeSpaceAR(tg.uWp);
        //}

        // 初始点击点到现在的位置偏移
        tg.uOff = cc.v2(tg.uWp.x - tg.uStart.x, tg.uWp.y - tg.uStart.y);

        // 调试字符串
        let p = [tg.uWp, tg.uNp,];
        if (tg.uGp) {
            p.push(tg.uGp);
        }
        p.push(tg.uOff);

        let tpStr = ['点击','移动','结束','取消',];
        let dstr = tpStr[tp] + tg.uTID;

        if (tg.isCard) {
            dstr += ' 组' + (tg.uGrp.inedx+1);
            dstr += ' 位' + (tg.uIdx+1);
        } else {
            dstr += ' 组' + (tg.inedx+1);
        }

        dstr += ' 牌' + tg.uCode;
        dstr += ' wp' + '(' +tg.uWp.x.toFixed(0)+ ',' +tg.uWp.y.toFixed(0)+ ')';
        dstr += ' np' + '(' +tg.uNp.x.toFixed(0)+ ',' +tg.uNp.y.toFixed(0)+ ')';

        if (tg.uGp) {
            dstr += ' gp' + '(' +tg.uGp.x.toFixed(0)+ ',' +tg.uGp.y.toFixed(0)+ ')';
        }
        
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

        // 胡牌提示
        this.hcView.PG.showHuTip(tg.uHuCode);

        this.hcView.startDrag(tg);
    },

    // 移动
    onTouchmove: function (event) {
        let tg = this.touchInfo(event, 1);

        // 移动判断
        if (! tg.uMoved) {
            if ((Math.abs(tg.uOff.x) >= 5) || (Math.abs(tg.uOff.y) >= 5)) {
                tg.uMoved = true;
                cc.log(tg.uDstr);
            }
        }

        // 没移动 不处理
        if (! tg.uMoved) {
            return;
        }

        // 移动的是卡牌
        if (tg.isCard) {
            if (! this.mvCard) {
                let c = lc_creatHandCard(this, tg.uIdx, tg.uCode);

                let wp = tg.convertToWorldSpaceAR(cc.v2(0, 0));
                c.position = this.hcView.Node_handCard.convertToNodeSpaceAR(wp);
                c.uox = c.x;
                c.uoy = c.y;

                c.opacity = 128;
                c.parent = this.hcView.Node_handCard;

                this.mvCard = c;

                this.hcView.selfView.Sprite_outline.active = true;
            }
        } else {
            // 移动的是卡组
            if (! this.mvCard) {
                let g = new cc.Node();
                g.width  = this.root.width;
                g.height = this.root.height;

                for (let i = 0; i < 3; ++i) {
                    let c = lc_creatHandCard(this, 3-1 -i, tg.uGrp.cards[0].uCode);
                    g.addChild(c);
                }

                let wp = tg.convertToWorldSpaceAR(cc.v2(0, 0));
                g.position = this.hcView.Node_handCard.convertToNodeSpaceAR(wp);
                g.uox = g.x;
                g.uoy = g.y;

                g.opacity = 200;
                g.parent = this.hcView.Node_handCard;

                this.mvCard = g;
            }
        }

        this.mvCard.x = this.mvCard.uox + tg.uOff.x;
        this.mvCard.y = this.mvCard.uoy + tg.uOff.y;
    },

    // 结束 节点区域内离开
    onTouchend: function (event) {
        let tg = this.touchInfo(event, 2);

        if (this.mvCard) {
            this.mvCard.removeFromParent();
            this.mvCard = null;
        }

        // 点击的是卡牌
        if (tg.isCard) {
            // 没有移动判定就处理为点击
            if (! tg.uMoved) {
                if(false) {
                    if (! tg.uClick) {
                        tg.uClick = 1;
                        tg.y = tg.uOy + 20;
    
                        if (this.hcView.lastClickTarget) {
                            this.hcView.lastClickTarget.uClick = false;
                            this.hcView.lastClickTarget.y = this.hcView.lastClickTarget.uOy;
                        }
    
                        this.hcView.lastClickTarget = tg;
                    } else {
                        if (this.hcView.selfView.player.canOutCard) {
                            if (tg.uClick == 1) {
                                tg.uClick = 2;
                                cc.log('双击出牌');
                                this.hcView.outCard(tg);
                            }
                        } else {
                            tg.uClick = false;
                            tg.y = tg.uOy;
    
                            this.hcView.lastClickTarget = null;
                        }
                    }      
                }
            } else {
                this.rePosAfterMove(tg);
            }
        } else {
            this.hcView.canPassSynch = true;
        }

        tg.uMoved = false;
        this.hcView.selfView.Sprite_outline.active = false;
        this.hcView.endDrag(true);
    },

    // 取消 节点区域外离开
    onTouchcancel: function (event) {
        let tg = this.touchInfo(event, 3);

        if (this.mvCard) {
            this.mvCard.removeFromParent();
            this.mvCard = null;
        }

        tg.uMoved = false;
        this.hcView.selfView.Sprite_outline.active = false;

        // 判断拖牌出牌
        if (this.hcView.selfView.player.canOutCard && tg.isCard) { 
            let sz = cc.winSize; //cc.director.getWinSizeInPixels();
            if (tg.uWp.y > sz.height*0.5) {
                this.hcView.outCard(tg);
                this.hcView.endDrag(true);
                return;
            }
        }

        if ((tg.uGp.y < 0) || (tg.uGp.y > this.root.height)) {
            this.hcView.canPassSynch = true;
            this.hcView.endDrag(true);
            return;
        }

        if ((tg.uGp.x < 0) || (tg.uGp.x > this.root.width)) {
            this.hcView.endDrag(false);
            this.hcView.selfView.upJiaoCardTip();
            return;
        }

        this.rePosAfterMove(tg);
        this.hcView.endDrag(true);
    },
    // ====点击事件区==============================================================================
});


// 玩家手牌视图
let D2HandCardView = cc.Class({
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
            
            this.root = node; // 根节点
            this.selfView = selfView;  // 自己的视图
            this.PG  = selfView.pPage; // 主页面
            this.GM  = selfView.pGame; // 游戏

            //this.PG.handCardSpa

            this.ox = this.root.x;//original x
    
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

            // 10个固定的卡组
            this.grops = [];
            for (let i = 0; i < DEF.GRPNUM; i++) {
                let Node_gpr = cc.find("Node_gpr"+i, this.Node_handCard);
                let grp = new D2HCGroup();
                grp.init(Node_gpr, i, this);
                this.grops.push(grp);
            }

            // 调试颜色
            let FillColor = cc.find("FillColor", this.Node_handCard);
            if (nocolor && FillColor) {
                FillColor.removeFromParent();
            }
        },

        // 触按控制
        upCanTouch: function () {
            this.PG.ButtonTipai.active = false;

            // 游戏或者空闲
            if (this.GM.roomInfo.status <= DEF.RMSTA.SendCard.v) {
                this.Node_noTouch.active = true;
                return;
            }

            // 有拖拽目标
            if (this.dragTarget) {
                this.Node_noTouch.active = true;
                return;
            }

            // 有出牌目标
            if (this.cardOuted) {
                this.Node_noTouch.active = true;
                return;
            }

            this.Node_noTouch.active = false;
            this.PG.ButtonTipai.active = !this.PG.isbpm;
        },


        // 更新卡组
        upGroups: function () {
            let grps = this.selfView.player.hcGroups;
            if (grps.length > DEF.GRPNUM) {
                cc.error('错误的手牌卡组数量');
            }

            this.clear();

            let idx = Math.floor((DEF.GRPNUM - grps.length)/2); //Math.cei

            for (let i = 0; i < grps.length; ++i) {
                this.grops[idx+i].setData(grps[i]);
            }

            this.root.active = true;

            this.upCanTouch();
        },

        // 出牌
        outCard: function (card) {
            if (this.GM.selfXJ) {
                return;
            }

            this.cardOuted = card;
            this.selfView.player.outCard(card.uCode);

            this.upCanTouch();
            this.selfView.upOutCardTip();
        },
        // 打出了牌
        onOutCard: function (code) {
            if (this.GM.selfXJ || this.GM.isBackPlayMode() || this.GM.isTguoguan) {
                let oc = null;

                for (let i = 0; i < DEF.GRPNUM; i++) {
                    let g = this.grops[i];

                    if (!g.cards || g.cards.length < 1) {
                        continue;
                    }
                    if (g.gInfo.kan || g.gInfo.long) {
                        continue;
                    }

                    for (let j = 0; j < g.cards.length; ++j) {
                        if (g.cards[j].uCode == code) {
                            oc = g.cards[j];

                            if (g.mvCard && g.mvCard.uCode==code) {
                                g.mvCard.removeFromParent();
                                g.mvCard = null;

                                this.dragTarget = null;
                                this.upCanTouch();
                            }

                            break;
                        }   
                    }

                    if (oc) {
                        break;
                    }
                }

                if (oc) {
                    oc.uGrp.remove(oc.uIdx);
                    this.synchHCData();
                    if (oc.uGrp.cards.length <= 0) {
                        this.upGroups();
                    }
                }

                return;
            }

            if (this.cardOuted.uCode == code) {
                this.cardOuted.uGrp.remove(this.cardOuted.uIdx);
            } else {
                cc.error('打出的牌数据不匹配');
            }

            this.synchHCData();

            if (this.cardOuted.uGrp.cards.length <= 0) {
                this.upGroups();
                return;
            }

            this.cardOuted = null;

            this.upCanTouch();
        },

        // 同步手牌顺序数据
        synchHCData: function () {
            let codeGrps = [];
            this.grops.forEach(e => {
                let codes = e.getCodes();
                if (codes.length > 0) {
                    codeGrps.push(codes);
                }
            });

            this.selfView.player.setDataGrops(codeGrps);
        },

        // 外部处理卡牌移动
        reGroupAfterMove: function () {
            this.canPassSynch = false;

            let tg = this.dragTarget;

            let hcp = this.Node_handCard.convertToNodeSpaceAR(tg.uWp);
            let hcSz = this.Node_handCard.getContentSize();

            //cc.log('hcp',hcp);
            //cc.log('hcSz',hcSz);
            
            let togrp = null;
            let frgrp = tg.uGrp;
            let useEnd = false;

            if (hcp.x < 0) {
                cc.log('最左边');

                if (!tg.isCard || frgrp.cards.length == 1) {
                    this.grops.splice(frgrp.inedx, 1);
                    let toidx = -1;

                    for (let i = 0; i < this.grops.length; ++i) {
                        if (this.grops[i].cards.length > 0) {
                            toidx = i;
                            break;
                        }
                    }

                    if (toidx < 0) {
                        cc.log('应该是手牌只剩1张了');
                        return;
                    }

                    this.grops.splice(toidx, 0, frgrp);

                    cc.log('挪动卡组 ' + frgrp.inedx +' => '+ toidx);

                    this.rePosGrp();

                    return
                }

                if (this.grops[0].cards.length <= 0){
                    togrp = this.grops[0];
                } else if (this.grops[this.grops.length-1].cards.length <= 0) {
                    togrp = this.grops[this.grops.length-1];
                    
                    cc.log('从末位补充');
                    useEnd = true;
                }

                if (! togrp) {
                    cc.log('组位已满');
                    return;
                }
            } else if (hcp.x > hcSz.width) {
                cc.log('最右边');

                if (!tg.isCard || frgrp.cards.length == 1) {
                    this.grops.splice(frgrp.inedx, 1);
                    let toidx = -1;

                    for (let i = this.grops.length-1; i >= 0; --i) {
                        if (this.grops[i].cards.length > 0) {
                            toidx = i+1;
                            break;
                        }
                    }

                    if (toidx < 0) {
                        cc.log('应该是手牌只剩1张了');
                        return;
                    }

                    this.grops.splice(toidx, 0, frgrp);

                    cc.log('挪动卡组 ' + frgrp.inedx +' => '+ toidx);

                    this.rePosGrp();

                    return
                }

                if (this.grops[this.grops.length-1].cards.length <= 0) {
                    togrp = this.grops[this.grops.length-1];
                } else if (this.grops[0].cards.length <= 0){
                    togrp = this.grops[0];
                    cc.error('出现了理论不应该的情况')
                } 

                if (! togrp) {
                    cc.log('组位已满');
                    return;
                }
            } else {
                let spaX = this.PG.handCardSpa.x;
                for (let i = 0; i < this.grops.length; ++i) {
                    const g = this.grops[i];

                    let gp = g.root.convertToNodeSpaceAR(tg.uWp);
                    if ((gp.x >= 0) && (gp.x <= (g.root.width + spaX))) {
                        togrp = g;
                        break;
                    }
                }

                if (! togrp) {
                    cc.error('虽然空隙很小但 应该就是拖到空隙里了');
                    return;
                } else {
                    if (togrp.gInfo.kan) {
                        cc.log('目标是砍拢');
                        return;
                    } else if (! tg.isCard) {
                        // 移动的是卡组
                        this.grops.splice(frgrp.inedx, 1);
                        this.grops.splice(togrp.inedx, 0, frgrp);
                    } else {
                        if (togrp.cards.length >= 4) {
                            cc.log('牌位已满');
                            this.canPassSynch = true;
                            return;
                        }
                    }
                } 
            }

            if (! togrp) {
                cc.error('没有可以挪动到的卡组 出BUG了');
                return;
            }

            if (tg.isCard) {
                cc.log('挪动卡牌 ' + frgrp.inedx +' => '+ togrp.inedx);

                togrp.add(tg);
                frgrp.remove(tg.uIdx);
                let n1 = togrp.cards.length;
                let n2 = frgrp.cards.length;
    
                if ((n1 > 1) && (n2 > 0)) {
                    cc.log('组间移动不调整');
                    return;
                }

                // 末位补充的把最后一组挪到第一排
                if (useEnd) {
                    let g = this.grops.pop();
                    this.grops.splice(0, 0, g);
                    this.rePosGrp();
                    return;
                }
            } else {
                cc.log('挪动卡组 ' + frgrp.inedx +' => '+ togrp.inedx);
            }


            // 卡组分为有卡牌和没卡牌的
            let nocard = [];
            let incard = [];
            this.grops.forEach(e => {
                if (e.cards.length > 0) {
                    incard.push(e);
                    return;
                }
                nocard.push(e);
            });

            // 重排卡组
            let bi = Math.floor(nocard.length / 2);
            let ngrps = [];
            for (let i = 0; i < bi; ++i) {
                ngrps.push(nocard[i]);
            }
            ngrps = ngrps.concat(incard);
            for (let i = bi; i < nocard.length; ++i) {
                ngrps.push(nocard[i]);
            }

            this.grops = ngrps;
            this.rePosGrp();
        },

        // 重新调整卡牌位置
        rePosGrp: function (isAct) {
            let spaX = this.PG.handCardSpa.x;
            let gw = this.grops[0].root.width;

            for (let i = 0; i < this.grops.length; ++i) {
                let e = this.grops[i];
                e.inedx = i;
                e.root.x = (gw + spaX) * i;
                //e.root.zIndex = i;
            }
        },

        // 清空
        clear: function () {
            this.dragTarget = null;
            this.lastClickTarget = null;
            this.cardOuted = null;
            this.canPassSynch = false;

            this.grops.forEach(e => {
                e.clear();
            });

            this.root.active = false;
        },

        // ====拖拽处理================================================================
        // 开始拖拽
        startDrag: function (target) {
            this.dragTarget = target;

            this.upCanTouch();
        },

        // 结束拖拽
        endDrag: function (isInGrp) {
            // 牌组内部处理
            if (! isInGrp) {
                this.reGroupAfterMove();
            }

            this.dragTarget = null;
            this.upCanTouch();

            // 正常情况 和大多数情况移动牌都会改变次序 很少情况不改变 
            // 摸排中也禁止同步 不然会覆盖数据
            if (!this.canPassSynch && !this.selfView.mopaiing) {
                this.synchHCData();
            }

            this.canPassSynch = false;
        },
        // ====拖拽处理================================================================
});

// 回放玩家手牌视图
let D2BackPlayHandCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '回放手牌视图 ';

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
        
        this.root = node; // 根节点
        this.selfView = selfView;  // 自己的视图
        this.PG  = selfView.pPage; // 主页面
        this.GM  = selfView.pGame; // 游戏

        // 初始化视图
        this.initView();

        this.root.active = false;
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        this.Node_hbox = cc.find("Node_hbox", r);

        // 固定的卡组
        this.grops = [];
        for (let i = 0; i < DEF.GRPNUM; i++) {
            let Node_gpr = cc.find("Node_gpr"+i, this.Node_hbox);
            let grp = new D2HCGroup();
            grp.init(Node_gpr, i, this);
            this.grops.push(grp);
        }
    },

    // 更新卡组
    upGroups: function () {
        let grps = this.selfView.player.hcGroups;
        if (grps.length > DEF.GRPNUM) {
            cc.error('错误的手牌卡组数量');
        }

        let lastac = this.root.active;
        this.clear();
        this.root.active = lastac;

        if (this.GM.roomInfo.status < DEF.RMSTA.PreDo.v) {
            this.root.active = false;
        }

        let idx = Math.floor((DEF.GRPNUM - grps.length)/2); //Math.cei

        for (let i = 0; i < grps.length; ++i) {
            this.grops[idx+i].setData(grps[i]);
        }
    },

    // 打出了牌
    onOutCard: function (code) {
        let oc = null;

        for (let i = 0; i < DEF.GRPNUM; i++) {
            let g = this.grops[i];

            if (!g.cards || g.cards.length < 1) {
                continue;
            }
            if (g.gInfo.kan || g.gInfo.long) {
                continue;
            }

            for (let j = 0; j < g.cards.length; ++j) {
                if (g.cards[j].uCode == code) {
                    oc = g.cards[j];
                    break;
                }   
            }

            if (oc) {
                break;
            }
        }

        if (oc) {
            oc.uGrp.remove(oc.uIdx);
            this.synchHCData();
            if (oc.uGrp.cards.length <= 0) {
                this.upGroups();
            }
        }
    },
    // 同步手牌顺序数据
    synchHCData: function () {
        let codeGrps = [];
        this.grops.forEach(e => {
            let codes = e.getCodes();
            if (codes.length > 0) {
                codeGrps.push(codes);
            }
        });

        this.selfView.player.setDataGrops(codeGrps);
    },

    // 清空
    clear: function () {
        this.grops.forEach(e => {
            e.clear();
        });

        this.root.active = false;
    },
});


// 玩家视图
let D2PlayerView = cc.Class({
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
        
        this.root   = node; // 根节点
        this.pPage  = page; // 主页面
        this.pGame  = this.pPage.pGame; // 游戏
        this.player = null; // 玩家数据

        
        if (this.index < 3) {
            // 初始化视图
            this.initView();
        } else {
            // 初始化小家视图
            this.initViewxj();
        }

        this.root.active = (this.index < this.pGame.roomInfo.total);
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        //语音动画
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
        // 剩余牌数
        this.Label_cardNum = cc.find("Sprite_cardNum/Label_cardNum", hr).getComponent(cc.Label);
        // 货币图片
        //this.Sprite_coin = cc.find("Sprite_coin", hr).getComponent(cc.Sprite);
        // 货币数量
        this.Label_coin = cc.find("Label_coin", hr).getComponent(cc.Label);
        // 胡数
        this.Label_huNum = cc.find("Label_huNum", hr).getComponent(cc.Label);
        // 小家调试图片
        this.Sprite_dbg_xiao = cc.find("Sprite_dbg_xiao", hr);
        if (this.Sprite_dbg_xiao && cc.sys.curDevMode != 'debug') {
            this.Sprite_dbg_xiao.removeFromParent();
            this.Sprite_dbg_xiao = null;
        }

        // 倒计时
        this.daojishi = cc.find("playDaojishi", this.Sprite_headbg);
        this.djsTime = cc.find("playDaojishi/Label_time", this.Sprite_headbg).getComponent(cc.Label);

        // 回放头像
        if (this.pPage.isbpm) {
            hr.active = false;
            let n = cc.find("Sprite_headArea_bp", r);
            n.active = true;
            this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", n).getComponent(cc.Sprite);
            this.Sprite_zhuang = cc.find("Sprite_headbg/Sprite_zhuang", n).getComponent(cc.Sprite);
            this.Label_name = cc.find("Label_name", n).getComponent(cc.Label);
        } else {
            hr.active = true;
            let n = cc.find("Sprite_headArea_bp", r);
            n && n.destroy();
        }
        

        // 爆牌动画
        let Node_anmBao = cc.find("Node_anmBao", r);
        this.anmBao = this.pPage.crtAnmObj(Node_anmBao);

        // 已准备
        this.Sprite_readyed = cc.find("Sprite_readyed", r).getComponent(cc.Sprite);

        // 手牌区的根节点 只有玩家自己有 对其他玩家 这个节点是不存在的
        let Node_hcLay = cc.find("Node_hcLay", r);
        if (Node_hcLay) {
            this.handCardView = new D2HandCardView();
            this.handCardView.init(Node_hcLay, this);

            // 出牌提示
            this.Sprite_outline = cc.find("Sprite_outline", r);
            this.Sprite_outline.active = false;
            this.Sprite_octip = cc.find("Sprite_octip", r);
            this.Sprite_octip.active = false;
            this.Node_ocanm = cc.find("Node_ocanm", r).getComponent(cc.Animation);

            // 胡牌提示
            this.Sprite_hutip = cc.find("Sprite_hutip", r);
            this.Node_gboxht = cc.find("Node_gboxht", this.Sprite_hutip);
            this.Sprite_hutip.on('touchend', ()=>{
                this.pPage.onSomeTip();
            });
        }

        // 回放手牌区的根节点
        let Node_bp_hcLay = cc.find("Sprite_bp_hc", r);
        if (Node_bp_hcLay) {
            if (!this.pPage.isbpm) {
                Node_bp_hcLay.destroy();
            } else {
                this.bp_handCardView = new D2BackPlayHandCardView();
                this.bp_handCardView.init(Node_bp_hcLay, this);
            }
        }
        
        // 摆牌
        this.Node_scLay = cc.find("Node_scLay", r);
        (this.pPage.isbpm && this.index!=0) && (this.Node_scLay.y-=50);
        this.Node_scLay.uOy = this.Node_scLay.y;
        this.Node_scLay.removeAllChildren();

        // 出牌
        this.Node_ocLay = cc.find("Node_ocLay", r);
        if (this.Node_ocLay) {
            (this.pPage.isbpm && this.index!=0) && (this.Node_ocLay.y-=50);
            //(this.pPage.isbpm && this.index===0) && (this.Node_ocLay.y-=25);
            this.Node_ocLay.removeAllChildren();
        }

        // 文字表情节点
        this.Node_txtEmoji = cc.find("Node_txtEmoji", r);
    },

    // 初始化小家视图
    initViewxj: function () {
        let r = this.root;

        //语音动画
        this.talking = cc.find("tn", r);
        this.talking && (this.talking.active = false);

        // 头像区域
        let hr = cc.find("Sprite_headArea", r);
        // 头像背景
        this.Sprite_headbg = cc.find("Sprite_headbg", hr);
        this.Sprite_headbg.on('touchend', this.onTouchHead, this);
        this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
        // 头像问号
        this.Sprite_wenhao = cc.find("Sprite_headbg/Sprite_wenhao", hr);
        // 头像
        this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", hr).getComponent(cc.Sprite);
        // 小家图片
        this.Sprite_xiao = cc.find("Sprite_headbg/Sprite_xiao", hr);
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

        // 货币图片
        //this.Sprite_coin = cc.find("Sprite_coin", hr).getComponent(cc.Sprite);
        // 货币数量
        this.Label_coin = cc.find("Label_coin", hr).getComponent(cc.Label);

        // 已准备
        this.Sprite_readyed = cc.find("Sprite_readyed", r).getComponent(cc.Sprite);

        // 文字表情节点
        this.Node_txtEmoji = cc.find("Node_txtEmoji", r);
        this.Node_txtEmoji.ox = this.Node_txtEmoji.x;

        if (! this.xjp0) {
            this.xjp0 = this.root.position;
            this.xjp1 = new cc.Vec2(841, 552);
            this.xjp2 = new cc.Vec2(220, 552);
        }
    },
    upViewxj: function () {
        
        let d =null;

        if (this.player) {
            d = this.player.d;
        }

        //名字
        this.Label_name.string = d ? cc.g.utils.getFormatName(d.name) : '';

        //头像
        this.Sprite_head.node.active = d!=null;
        this.Sprite_wenhao.active = !this.Sprite_head.node.active;
        if (d) {
            if (d.icon.length > 4) {
                cc.g.utils.setUrlTexture(this.Sprite_head, d.icon);
            }
            else {
                sethead(this.Sprite_head, d.icon);
            }
        }

        // // 货币图片
        // let coinSprFrame = this.pPage.moneyIconSpriteFrame;
        // if(coinSprFrame.length > 0) {
        //     this.Sprite_coin.spriteFrame = coinSprFrame[this.pGame.roomInfo.type - 1];
        // }
        // this.Sprite_coin.node.active = !this.pPage.isbpm;

        // 货币数量
        let coin = ((d && d.money.toNumber) ? d.money.toNumber() : 0);
        coin = (coin/100).toFixed(2);
        this.Label_coin.string = '总分:' + parseFloat(coin);
        this.Label_coin.node.active = !this.pPage.isbpm;

        if (!d) {
            this.Sprite_readyed.node.active = false;
            this.Sprite_xiao.active = false;
            this.Sprite_offline.active = false;
            this.root.position = this.xjp0;

            if (this.offlineSch) {
                this.Sprite_offline.active = false;
                this.unschedule(this.offlineSch, this);
                this.offlineSch = null;
            }
        }

        this.upReady();
        this.upTuoguan();

        this.Sprite_xiao.active = this.pGame.roomInfo.status > DEF.RMSTA.Free.v;

        if (d) this.posToDealer();
    },
    posToDealer: function () {
        if (this.pPage.isbpm) {
            return;
        }

        let zuid = this.pGame.roomInfo.dealer;
        if (this.pGame.uidPlayers[zuid]) {
            this.Node_txtEmoji.scaleX = 1;
            this.Node_txtEmoji.x = this.Node_txtEmoji.ox;

            let idx = this.pGame.uidPlayers[zuid].view.index;
            //cc.error('庄家的视图位置-posToDealer', idx);

            if (idx == 0) {
                this.root.position = this.xjp0;
            } else if (idx == 1) {
                this.root.position = this.xjp1;
                this.Node_txtEmoji.scaleX = -1;
                this.Node_txtEmoji.x += -50;
            } else if (idx == 2) {
                this.root.position = this.xjp2;
            }
        }

        this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
    },


    //
    onTouchHead: function (event) {
        if (! this.pPage.___dbg) {
            if (! this.player) {
                return;
            }
    
            if (cc.g.userMgr.userId.eq(this.player.d.uid)) {
                return;
            }
        }

        this.headPos = this.Sprite_headbg.convertToWorldSpaceAR(cc.Vec2(0,0));
        
        let pos = this.pPage.node.convertToNodeSpaceAR(this.headPos);
        if (this.index == 0) {
            pos.x += 200;
            pos.y += 100;
        } else if (this.index == 1) {
            pos.x -= 200;
            pos.y -= 100;
        } else if (this.index == 2) {
            pos.x += 200;
            pos.y -= 100;
        } else if (this.index == 3) {
            let idx = 0;

            if (this.pPage.___dbg) {
                if (!this.ididx) {
                    this.ididx = 1;
                } else {
                    ++this.ididx;
                }
                idx = (this.ididx-1)%3;
            } else {
                let zuid = this.pGame.roomInfo.dealer;
                if (this.pGame.uidPlayers[zuid]) {
                    idx = this.pGame.uidPlayers[zuid].view.index;
                }
            }

            if (idx == 0) {
                pos.x += 200;
                pos.y += 50;
            } else if (idx == 1) {
                pos.x -= 200;
                pos.y -= 100;
            } else if (idx == 2) {
                pos.x += 200;
                pos.y -= 100;
            }
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
        cc.log(this.dbgstr('upView'));

        if (this.index >= 3) {
            this.upViewxj();
            return;
        }

        let d =null;

        if (this.player) {
            d = this.player.d;
        }

        //名字
        this.Label_name.string = d ? cc.g.utils.getFormatName(d.name) : '';
        
        //头像
        this.Sprite_head.node.active = d!=null;
        this.Sprite_wenhao.active = !this.Sprite_head.node.active;
        if (d) {
            if (d.icon.length > 4) {
                cc.g.utils.setUrlTexture(this.Sprite_head, d.icon);
            } else {
                sethead(this.Sprite_head, d.icon);
            }
        }


        // 爆牌动画
        this.anmBao.stop();

        // 货币图片
        // let coinSprFrame = this.pPage.moneyIconSpriteFrame;
        // if(coinSprFrame.length > 0) {
        //     this.Sprite_coin.spriteFrame = coinSprFrame[this.pGame.roomInfo.type - 1];
        // }

        // 货币数量
        let coin = ((d && d.money.toNumber) ? d.money.toNumber() : 0);
        coin = (coin/100).toFixed(2);
        this.Label_coin.string = '总分:' + parseFloat(coin);

        // 胡数
        this.Label_huNum.string = '胡数:' + 0;

        // 小家视角的显示 调试用
        if (this.Sprite_dbg_xiao){
            if(this.player && this.player.asSelf) {
                this.Sprite_dbg_xiao.active = ((cc.sys.os === cc.sys.OS_WINDOWS) || (cc.sys.curDevMode === 'debug'));
            } else {
                this.Sprite_dbg_xiao.active = false;
            }
        }

        
        if (!d) {
            this.Sprite_readyed.node.active = false;
            this.Sprite_zhuang.node.active = false;
            this.Sprite_offline.active = false;
            this.daojishi.active = false;
            this.Label_cardNum.string = 0;

            if (this.offlineSch) {
                this.Sprite_offline.active = false;
                this.unschedule(this.offlineSch, this);
                this.offlineSch = null;
            }
            
            return;
        }

        this.upReady();
        this.upZhuang();
        this.upDaojishi();
        this.upHandCard();
        this.upShowCards();
        this.upOutCards();
        this.upOutCardTip();
        this.upJiaoCardTip();
        this.upOnline();
        this.upTuoguan();

        if (this.handCardView) {
            this.handCardView.upCanTouch();

            this.upHuTip();
        }

        if (this.player.isGameBao) { 
            this.anmBao.play();
        }
    },

    // 准备
    upReady: function () {
        if (this.pGame.roomInfo.status > DEF.RMSTA.Free.v) {
            this.Sprite_readyed.node.active = false;
            return;
        }

        cc.log(this.dbgstr('upReady'));

        let p = this.player;
        this.Sprite_readyed.node.active = (p && p.isReady);

        if (p && p.isReady) {
            if (this.settleView) {
                this.settleView.hide();
            }
        }
    },

    // 更新庄家
    upZhuang: function () {
        if (!this.player || !this.Sprite_zhuang) {
            return;
        }

        if (this.pGame.roomInfo.status <= DEF.RMSTA.Free.v) {
            this.Sprite_zhuang.node.active = false;
            return;
        }

        cc.log(this.dbgstr('upZhuang'));

        let p = this.player;
        this.Sprite_zhuang.node.active = p.isZhuang;
    },

    upCoin: function (coin) {
        // 货币数量
        if (coin) {
            let _coin = (coin.toNumber ? coin.toNumber() : coin);
            _coin = (_coin/100).toFixed(2);
            this.Label_coin.string = '总分:' + parseFloat(_coin);
            
            if (this.player && this.player.d) {
                this.player.d.money = coin
            }
        } else {
            let _coin = (this.player.d ? (this.player.d.money.toNumber ? this.player.d.money.toNumber() : this.player.d.money) : 0);
            _coin = (_coin/100).toFixed(2);
            if (this.player) {
                this.Label_coin.string = '总分:' + parseFloat(_coin);
            }
        }

        cc.log(this.dbgstr('货币数量'), this.Label_coin.string)
    },

    // 更新倒计时
    upDaojishi: function () {
        if (!this.player) {
            return;
        }

        if (!this.daojishi) {
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
        this.djsTime.string = t;
    },
    

    // 更新手牌
    upHandCard: function () {
        if (! this.player) {
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
            this.handCardView.upGroups();
        } else if (this.bp_handCardView) {
            cc.log(this.dbgstr('up_pb_HandCard'));
            this.bp_handCardView.upGroups();
        }

        if (this.Sprite_cardNumBg) {
            this.Sprite_cardNumBg.node.active = true;
            this.Label_cardNum.string = this.player.d.cardNum;
        }
    },

    // 更新摆牌
    upShowCards: function () {
        if (!this.Node_scLay) {
            return;
        }

        this.Node_scLay.removeAllChildren();

        let grps = this.player.showGroups;
        if (grps.length < 1) {
            return;
        }

        let sgPrefab = this.pPage.showGroup;
        let atlas = this.pPage.cardAtlas;
        let isdown = false;

        let c = null;
        this.showgrp = [];
        for (let i = 0; i < grps.length; ++i) {
            let e = grps[i];

            let v0 = -1;
            if (e.length == 5) {
                e = cc.g.clone(grps[i]);
                v0 = e.shift();
                isdown = true;
            }

            let pfb = cc.instantiate(sgPrefab);
            let sg = cc.find("Node_hbox", pfb);
            let bi = 4 - e.length;

            for (let j = 0; j < 4; ++j) {
                c = cc.find("Sprite_"+j, sg);
                
                // 拢牌顶上的要是显示为背面
                if (v0 == 1) {
                    if (lg_isB2T) {
                        if (j == 3) {
                            c.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s_back');
                            continue;
                        }
                    } else {
                        if (j == 0) {
                            c.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s_back');
                            continue;
                        }
                    }
                } else {
                    if (lg_isB2T) {
                        c.active = j < e.length;
                    } else {
                        c.active = j >= bi;
                    }
    
                    if (! c.active) {
                        continue;
                    }
                }

                if (lg_isB2T) {
                    c.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + e[e.length-1 -j]);
                } else {
                    c.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + e[j-bi]);
                }
            }

            this.showgrp.push(pfb);
            this.Node_scLay.addChild(pfb);
        }
        this.Node_scLay.getComponent(cc.Layout).updateLayout();

        // 胡数
        this.Label_huNum.string = '胡数:' + this.player.baiHuxi;

        if (this.index != 0) {
            this.Node_scLay.uDy = isdown ? c.height : 0;

            let codes = this.player.outCodes;
            let line = codes.length>0 ? Math.floor((codes.length-1)/10) : 0;
            this.Node_scLay.y = this.Node_scLay.uOy - this.Node_scLay.uDy - line*c.height;
        }
    },
    showCardsAnm: function () {
        if (! this.showgrp) {
            cc.log('没有摆牌 不显示动画')
            return;
        }

        let num = this.player.newShowNum;
        let grps = this.player.showGroups;

        let sch = this.pPage.sendCardHelp;
        sch.r.active = true;

        let tpos = [];
        for (let i = 0; i < num; i++) {
            let codes = grps[this.showgrp.length-1 - i];
            if (codes.length == 5) {
                codes = cc.g.clone(codes);
                codes.shift();
            }

            let anmg = new cc.Node();
            let actop = null
            for (let i = 0; i < codes.length; ++i) {
                let ac = lc_creatHandCard({hcView:{PG:this.pPage}}, codes.length-1 -i, codes[i]);
                anmg.addChild(ac);
                if (i==0) {
                    actop = ac;
                }
            }
            anmg.position = sch.outp[this.index];
            anmg.parent = sch.r;
            anmg.y -= (actop.y+actop.height)/2;
            
            let agw = (num*actop.width + (num-1)*10); //动画牌组的总宽
            let bp = anmg.x - agw/2;
            if (this.index == 2){
                anmg.x = bp + (num-1 -i)*(actop.width + 10);
            } else {
                anmg.x = bp + i*(actop.width + 10);
            }

            // 自己的牌 位置再偏移一下
            if (this.index == 0){
                anmg.x -= agw*0.8;
                anmg.y -= actop.width*0.8;
            }

            let sg = this.showgrp[this.showgrp.length-1 - i];
            let wp = sg.convertToWorldSpaceAR(cc.v2(0, 0));
            let tpos = sch.r.convertToNodeSpaceAR(wp);

            if (!false){
                anmg.runAction(cc.sequence(
                    cc.delayTime(0.8),
                    cc.spawn(
                        cc.moveTo(0.25, tpos),
                        cc.scaleTo(0.25, 0.5)
                    ),
                    cc.callFunc( 
                        function (tg) {
                            //n.active = true;
                            anmg.removeFromParent();
                            sg.active = true;
                        },
                        this,
                        null
                    )
                ));
            }
        }

        this.pGame.audio.baiPai();
    },


    // 更新出牌 
    upOutCards: function () {
        this.Node_ocLay.removeAllChildren();

        let codes = this.player.outCodes;
        if (codes.length < 1) {
            return;
        }
        
        let atlas = this.pPage.cardAtlas;

        for (let i = 0; i < codes.length-1; ++i) {            
            let n = new cc.Node("Sprite" + "Outcard" + i);
            n.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + codes[i]);
            //n.setAnchorPoint(0, 0.5);
            this.Node_ocLay.addChild(n);
        }

        let n = new cc.Node("Sprite" + "Outcard" + (codes.length-1));
        n.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + codes[codes.length-1]);
        this.Node_ocLay.addChild(n);
        this.Node_ocLay.getComponent(cc.Layout).updateLayout();

        if (this.index != 0) {
            let line = Math.floor((codes.length-1)/10);
            this.Node_scLay.y = this.Node_scLay.uOy - this.Node_scLay.uDy - line*n.height;
        }

        let waitCard = this.pPage.sendCardHelp.lastWC;
        if (waitCard && waitCard.viewIdx==this.index) {
            let wtc = waitCard.r;

            n.active = false;

            let wp = n.convertToWorldSpaceAR(cc.v2(0, 0));
            let topos = wtc.parent.convertToNodeSpaceAR(wp);
            wtc.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.25, topos),
                    cc.scaleTo(0.25, 0.1)
                ),
                cc.callFunc( 
                    function (tg) {
                        //this._function.call(this._selectorTarget, this.target, this._data);
                        wtc.active = false;
                        n.active = true;
                    },
                    this,
                    null
                )
            ));
        }
    },

    // 出牌提示
    upOutCardTip: function () {
        if (!this.player || !this.Sprite_octip) {
            return;
        }

        if (this.pGame.selfXJ) {
            return;
        }

        this.Sprite_octip.active = this.player.canOutCard;
        if (this.Sprite_octip.active) {
            this.Node_ocanm.node.active = true;
            this.Node_ocanm.play();
        } else {
            this.Node_ocanm.node.active = false;
            this.Node_ocanm.stop();
        }
    },
    // 叫牌提示
    upJiaoCardTip: function () {
        if (!this.player || !this.player.jiaokv) {
            return;
        }
        if (! this.handCardView) {
            return;
        }
        if (this.pGame.selfXJ) {
            return;
        }

        let grops = this.handCardView.grops;
        grops.forEach(g => {
            if (g.gInfo.kan || g.gInfo.long) {
                return;
            }

            g.cards.forEach(c => {
                let hu = this.player.jiaokv[c.uCode];
                c.uJiao(this.player.canOutCard && (hu ? hu : false));
            });
        });

        if (!this.player.canOutCard) {
            this.pPage.showHuTip(false);
        }
    },

    // 更新胡牌提示
    upHuTip: function () {
        if (! this.Sprite_hutip) {
            return;
        }

        if (!this.player || !this.player.canhuCode || this.player.canhuCode.length<1) {
            this.Sprite_hutip.active = false;
            return;
        }

        this.Sprite_hutip.active = true;

        return;

        // UI已经改成只是一个灯泡
        let atlas = this.pPage.cardAtlas;
        let codes = this.player.canhuCode;
        let w = 0;
        let i = 0;
        
        this.Node_gboxht.removeAllChildren();
        codes.forEach(e => {
            let n = new cc.Node("Sprite" + "-upHuTip" + i);
            n.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('d2_card_s' + codes[i++]);
            w = n.width;
            this.Node_gboxht.addChild(n);
        });

        let n = (codes.length < 3) ? codes.length : 3;
        this.Node_gboxht.width = w*n + this.Node_gboxht.getComponent(cc.Layout).spacingX * (n-1);
        
        let line = Math.floor((codes.length-1)/3);
        this.Sprite_hutip.height = w*line + this.Node_gboxht.getComponent(cc.Layout).spacingY * (line-1) + 50;

        this.Node_gboxht.getComponent(cc.Layout).updateLayout();
    },

    // 在线情况 
    upOnline: function () {
        if (! this.player) {
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
        cc.log(this.dbgstr('onStarGame'));

        if (this.player) {
            if (this.player.d) {
                this.player.d.cards = [];
                this.player.d.cardNum = 0;
            }

            this.player.hcGroups = [];
            this.player.showGroups = [];
            this.player.outCodes = [];

            this.upHandCard();
            this.upShowCards();
            this.upOutCards();
        }

        // 隐藏已经准备
        this.Sprite_readyed.node.active = false;

        if (this.Sprite_xiao) {
            this.Sprite_xiao.active = true;
            return;
        }
        
        // 手牌数
        this.Sprite_cardNumBg.node.active = true;
        this.Label_cardNum.string = 0;
    },

    // 游戏操作
    onPlayOpt: function (k) {
        {/*
            // PLAY OPT KEY
            this.POK = {
                _34: 0,
                long: 1,
                bao: 2,
                chi: 3,
                peng: 4,
                zhao: 5,
                hu: 6,
                pass: 7,
            };
        */};

        this.curPok = k;
        let POK = this.player.POK;

        if (! this.optaudio) {
            let o = {};
            o[POK.long] = 'long';
            o[POK.bao] = 'bao';
            o[POK.chi] = 'chi';
            o[POK.peng] = 'peng';
            o[POK.zhao] = 'zhao';
            o[POK.hu] = 'hu';
            o[POK.baozi] = 'hu';
            this.optaudio = o;
        }
        if (this.optaudio[k]){
            this.pGame.audio.opt(this.optaudio[k], this.player.d.sex);
        }
        
        // 拢 吃 碰 招 要更新手牌和摆牌
        if (k == POK.long || k == POK.chi || k == POK.peng || k == POK.zhao) {
            this.upHandCard();
            this.upShowCards();

            if (this.Sprite_hutip && (k == POK.chi || k == POK.peng)) {
                this.Sprite_hutip.active = false;
            }

            // 暂时先隐藏新的摆牌 为动画表现做准备
            for (let i = 0; i < this.player.newShowNum; ++i) {
                this.showgrp[this.showgrp.length-1 -i].active = false;
            }

            this.pPage.clearWaitCard();
            this.pPage.optAnm(this);
            this.pPage.scheduleOnce(()=>{
                this.showCardsAnm();
            }, 0);
        } else {
            this.pPage.optAnm(this);

            if (k == POK.bao) {
                this.pPage.scheduleOnce(()=>{
                    if (!this.anmBao.state || !this.anmBao.state.isPlaying) {
                        this.pGame.audio.bgmBao();
                        this.anmBao.play();
                        this.pPage.baoAnm(true);
                    }
                    if (this.Sprite_hutip) {
                        this.upHuTip();
                    }
                }, 0.3);
            }
        }

        this.upDaojishi();

        if (k == POK.hu || k == POK.baozi) {
            this.onHu();
        }
    },


    // 胡
    onHu: function () {
    },

    // 摸牌
    moCard: function () {
        let mc = this.player.moCards;
        let mnum = this.player.d.cardNum - mc.length;
        
        this.Label_cardNum.string = mnum;
        this.mopaiing = true;

        this.pPage.moCard(
            this, 
            (idx)=>{
                this.Label_cardNum.string = ++mnum;

                if (idx == mc.length-1) {
                    if (this.handCardView) {
                        this.handCardView.upGroups();

                        this.mopaiing = false;
                        this.player.moCards = null;
                    } else if (this.bp_handCardView) {
                            this.bp_handCardView.upGroups();
    
                            this.mopaiing = false;
                            this.player.moCards = null;
                    }
                }
            }
        );
    },

    // 打出了牌
    onOutCard: function () {
        let code = this.player.waitCode;

        this.pPage.outCard(this, code);

        if (this.handCardView) {
            this.handCardView.onOutCard(code);
        } else if (this.bp_handCardView) {
            this.bp_handCardView.onOutCard(code);
        }

        this.Label_cardNum.string = this.player.d.cardNum;

        this.upHuTip();
    },

    // 堂出了牌
    onTangCard: function () {
        let code = this.player.waitCode;

        this.pPage.tangCard(this, code);
    },

    // 动画表情
    onAnmEmoji: function (id) {
        let emo = cc.instantiate(cc.g.pf.chatAnmEmojiPf);
        let anm = emo.getComponent(cc.Animation);
        anm.on('stop', (a1, a2, a3)=>{
            cc.log('stop');

            // 表情没播放完就退出房间
            if (!this.pGame.gameScript){
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
            emo.x -= 180;
        } else if (this.index == 3) {
            let zuid = this.pGame.roomInfo.dealer;
            if (this.pGame.uidPlayers[zuid]) {
                let idx = this.pGame.uidPlayers[zuid].view.index;
                if (idx!=1) {
                    emo.x -= 20;
                    emo.y -= 20;
                }else{
                    emo.x -= -80;
                    emo.y -= 20;
                }
            }
        } else {
            emo.x -= 170;
        }

        let clips = anm.getClips();
        let sta = anm.play(clips[id-1]._name);
        sta.repeatCount = 1;

        this.Node_txtEmoji.addChild(emo);
    },
});


/* =================================================================================================================== */

let BF = {
    /*
    let idx = 0;
    for (let i = 0; i < this.grops.length; ++i) {
        const e = this.grops[i];
        if (e.cards.length > 0) {
            idx = i;
            break;
        }
    }

    if (frgrp.inedx == idx) {
        cc.log('最左1组只有一个');
        frgrp.rePosAfterMove(tg);
        return;
    }
    */

    /*
        ar animation = this.node.getComponent(cc.Animation);

        // 注册
        animation.on('play',      this.onPlay,        this);
        animation.on('stop',      this.onStop,        this);
        animation.on('lastframe', this.onLastFrame,   this);
        animation.on('finished',  this.onFinished,    this);
        animation.on('pause',     this.onPause,       this);
        animation.on('resume',    this.onResume,      this);

        // 取消注册
        animation.off('play',      this.onPlay,        this);
        animation.off('stop',      this.onStop,        this);
        animation.off('lastframe', this.onLastFrame,   this);
        animation.off('finished',  this.onFinished,    this);
        animation.off('pause',     this.onPause,       this);
        animation.off('resume',    this.onResume,      this);

        // 对单个 cc.AnimationState 注册回调
        let anim1 = animation.getAnimationState('anim1');
        anim1.on('lastframe',    this.onLastFrame,      this);

        // ----------------------------------------------------

        let anim = this.getComponent(cc.Animation);
        let animState = anim.play('test');

        // 设置循环模式为 Normal
        animState.wrapMode = cc.WrapMode.Normal;

        // 设置循环模式为 Loop
        animState.wrapMode = cc.WrapMode.Loop;

        // 设置动画循环次数为2次
        animState.repeatCount = 2;

        // 设置动画循环次数为无限次
        animState.repeatCount = Infinity;

        // ----------------------------------------------------

        let animation = this.node.getComponent(cc.Animation);
        // frames 这是一个 SpriteFrame 的数组.
        let clip = cc.AnimationClip.createWithSpriteFrames(frames, 17);
        clip.name = "anim_run";
        clip.wrapMode = cc.WrapMode.Loop;

        // 添加帧事件
        clip.events.push({
            frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "frameEvent",     // 回调函数名称
            params: [1, "hello"]    // 回调参数
        });

        animation.addClip(clip);
        animation.play('anim_run');
    */
}

let d2Ctrls = {
    PlayerView: D2PlayerView,
    LongCard: D2LongCard,
    ChiPaiView: D2ChiPaiView,
    SettleView: D2SettleView,
    SettleFinalView: D2SettleFinalView,
}

module.exports = d2Ctrls;
