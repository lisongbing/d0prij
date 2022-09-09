
cc.Class({
    extends: cc.Component,

    properties: {
        // 创建房间相关的图集
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        
        // 战绩条目预制
        stroyItem: {
            default: null,
            type: cc.Prefab,
        },

        // 战绩条目玩家预制
        playerItem: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '战绩'; //d2Page

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.curpg = 0;
        this.curGMItem = null;
        this.hisData = [];

        this.backToPlayHistory = cc.g.hallMgr.backToPlayHistory;

        this.initView();

        this.scheduleOnce(()=>this.upData(), 0.2);
    },

    start () {
    },

    // update (dt) {},

    /* =================================================================================================================== */

    init: function () {
    },

    // 更新对话框界面
    initView: function (info) {
        let r = this.node;

        //
        this.sv_listgm = r.getChildByName('sv_listgm').getComponent(cc.ScrollView);
        this.sv_listgm.node.on('scroll-to-bottom', this.gm_scroll_to_bottom, this);
        //
        this.sv_listturn = r.getChildByName('sv_listturn').getComponent(cc.ScrollView);

        this.sv_listgm.node.active = this.sv_listturn.node.active = false;




        // close btn
        let closeOne = cc.find('but_close', this.node)
        let closeTwo = cc.find('but_close_min', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }
    },
    gm_scroll_to_bottom: function () {
        cc.log('翻页 this.curpg this.curidx ', this.curpg, this.curidx);

        this.upData();
    },



    upData: function () {
        {/*
            //@api:1026,@type:req
            message GetMultipleFightGradeReq{
            //    GAME gameType =1; //游戏类型
            //	int64 uid = 2;//查询UId
            //	int32 clubId = 3;//俱乐部ID
            //	int32 origin = 4; //地区
                int32 page = 1; //页数
            }

            //@api:1026,@type:resp
            message GetMultipleFightGradeResp{
                repeated FightGradeInfo list = 1;
            }

            //战绩
            message FightGradeInfo{
                int64 start    = 1;//开始时间
                int64 end      = 2;//结束时间
                int32 roomId       = 3;//房间id
                int32 num 	 = 4;//房间局数
                repeated PersonFight totalFight   = 5; //总战绩
                repeated PersonFight detailFight  = 6;//详细战绩
                repeated string replayIds = 7;//回放的唯一ID
                int32 clubId   = 8;//俱乐部ID
                GAME    gameType = 9;//游戏类型
                ORIGIN  origin   = 10;//地区
                bool    owner    = 11;//拥有者的战绩
                MaxWin  maxwin   = 12; //茶馆的大赢家
                int32   clubRoomId = 13;//茶馆的包间id
                bool    isTeaHouse = 14;//是否是新茶馆
                bool    isPerfet   = 15; //是否是完整场
                int32   gameConsume   = 16;  //消费类型 1:金币  2:积分
                int32   totalGameNum  = 17;  //总局数
                int64   ownerId       = 18; //房主
            }
            message PersonFight{
                string name = 1;//玩家昵称
                repeated int32 fight = 2;//每局的战绩
                int64 uid = 3;//用户id
                string icon = 4;//头像
            }
        */}

        if (this.backToPlayHistory) {
            this.upTurn();
            return;
        }

        let req = pbHelper.newReq(PB.PROTO.GET_FIGHT_LIST);
        req.page = this.curpg ? this.curpg+1 : 0;

        if (req.page == 0) {
            this.curpg = 0;
            this.hisData = [];
            this.curidx = 0;
        }

        cc.g.networkMgr.send(PB.PROTO.GET_FIGHT_LIST, req, (Resp) => {
            this.refreshData(Resp);
            this.upGame();
        });
    },
    // 更新数据
    refreshData: function (resp) {
        cc.log('refreshData');

        if (resp.list.length <= 0) {
            return;
        }

        ++this.curpg;

        resp.list.forEach(e => {
            let d = {};
            d.start = e.start.toNumber();
            d.end = e.end.toNumber();
            d.roomId = e.roomId;
            d.num = e.num;
            d.gameType = e.gameType;
            d.origin = e.origin;
            d.ownerId = e.ownerId;

            d.replayIds = [];
            e.replayIds.forEach(id => d.replayIds.push(id));

            let idx = 0;
            let nameidx = {};
            d.totalFight = [];
            e.totalFight.forEach(e1 => {
                let o = {};
                o.name = e1.name;
                o.icon = e1.icon;
                o.isfz = eq64(e1.uid, d.ownerId);
                o.fight = [];

                e1.fight.forEach(e2 => {
                    o.fight.push(e2);
                });

                d.totalFight.push(o);

                nameidx[o.name] = idx++;
            });

            d.detailFight = [];
            e.detailFight.forEach(e1 => {
                let o = {};
                o.name = e1.name;
                o.icon = e1.icon;
                o.isfz = eq64(e1.uid, d.ownerId);
                o.fight = [];

                e1.fight.forEach(e2 => {
                    o.fight.push(e2);
                });

                d.detailFight[nameidx[o.name]] = o;
            });

            this.hisData.push(d);
        });
    },



    // 更新每个记录
    upGame: function () {
        this.sv_listgm.node.active = true;

        let ctt = this.sv_listgm.content;
        if (this.curidx == 0) {
            ctt.destroyAllChildren();
        }

        for (let i = 0; i < 20; ++i) {
            let idx = this.curidx;
            let d = this.hisData[idx];

            if (!d) break;

            ++this.curidx;

            let itm = cc.instantiate(this.stroyItem);
            itm.ud = d;

            cc.find('Node_turn', itm).destroy();
            cc.find('btn_hfturn', itm).destroy();

            //
            cc.find('gmname', itm).getComponent(cc.Label).string = cc.g.utils.getGameName(d.gameType, d.origin);
            //
            cc.find('Node_game/roomid', itm).getComponent(cc.Label).string = `房间号:${d.roomId}`;
            //
            cc.find('Node_game/date', itm).getComponent(cc.Label).string = cc.g.utils.getFormatTimeXXX(i64v(d.start)*1000, 'Y|.|M|.|D| |h|:|m|');
            
            //
            let cttp = null;
            if (d.totalFight.length>4) {
                cc.find('hb_player', itm).destroy();
                cttp = cc.find('sv_player', itm).getComponent(cc.ScrollView).content;
            } else {
                cc.find('sv_player', itm).destroy();
                cttp = cc.find('hb_player', itm);
            }
            cttp.destroyAllChildren();
            for (let j = 0; j < d.totalFight.length; ++j) {
                let itmp = cc.instantiate(this.playerItem);
                let e = d.totalFight[j];

                // 分数 #BE5B36 #2B881E 
                let score = cc.find("score", itmp).getComponent(cc.Label);
                score.string = cc.g.utils.realNum1(e.fight[0] > 0 ? '+'+e.fight[0] : e.fight[0]);
                score.node.color = (e.fight[0] > 0) ? new cc.Color(0xBE, 0x5B, 0x36) : new cc.Color(0x2B, 0x88, 0x1E);

                // 名字
                cc.find("name", itmp).getComponent(cc.Label).string = cc.g.utils.getFormatName(e.name, 3*2);

                // 头像 名字 ID
                let head = cc.find("mask/head", itmp).getComponent(cc.Sprite);
                cc.g.utils.sethead(head, e.icon);

                //
                cc.find("fz", itmp).active = e.isfz;
                

                cttp.addChild(itmp);
            }
    

            //
            cc.g.utils.addClickEvent(cc.find('btn_hfgm', itm), this.node, 'playHistoryDlg', 'onClickGameItem', itm);
            cc.g.utils.addClickEvent(cc.find('btn_share', itm), this.node, 'playHistoryDlg', 'onClickShare', itm);

            ctt.addChild(itm);
        }
    },

    // 游戏列表点击事件
    onClickGameItem: function (event, itm) {
        cc.log('CreateRoomDlg' + ' ' + 'onClickGameItem', itm.uD);

        cc.g.utils.btnShake();

        this.curGMItem = itm;

        //this.origin = this.curGMItem.uD.origin;
        //this.curGameId = this.curGMItem.uD.ID;

        this.sv_listgm.node.active = this.sv_listturn.node.active = false;

        this.upTurn();
    },

    // 更新记录里的每局
    upTurn: function () {
        this.sv_listturn.node.active = true;

        let d = this.backToPlayHistory ? this.backToPlayHistory.lastData : this.curGMItem.ud;
        let fights = d.detailFight;
    
        let gmnm = cc.g.utils.getGameName(d.gameType, d.origin);

        let ctt = this.sv_listturn.content;
        ctt.destroyAllChildren();

        for (let i = 0; i < d.replayIds.length; ++i) {
            let itm = cc.instantiate(this.stroyItem);
            itm.replayId = d.replayIds[i];
            itm.gameType = d.gameType;

            cc.find('Node_game', itm).destroy();
            cc.find('btn_hfgm', itm).destroy();

            //cc.find(1 ? 'sv_player' : 'hb_player', itm).destroy();

            //
            cc.find('gmname', itm).getComponent(cc.Label).string = gmnm;
            //
            cc.find('Node_turn/jushu', itm).getComponent(cc.Label).string = `第${i+1}局`;
            //
            cc.find('Node_turn/roomid', itm).getComponent(cc.Label).string = `房间号:${d.roomId}`;
            //
            cc.find('Node_turn/date', itm).getComponent(cc.Label).string = cc.g.utils.getFormatTimeXXX(i64v(d.start)*1000, '时间：|M|.|D| |h|:|m|');
           
            //
            let cttp = null;
            if (d.detailFight.length>4) {
                cc.find('hb_player', itm).destroy();
                cttp = cc.find('sv_player', itm).getComponent(cc.ScrollView).content;
            } else {
                cc.find('sv_player', itm).destroy();
                cttp = cc.find('hb_player', itm);
            }
            cttp.destroyAllChildren();
            for (let j = 0; j < d.detailFight.length; ++j) {
                let itmp = cc.instantiate(this.playerItem);
                let e = d.detailFight[j];

                // 分数 #BE5B36 #2B881E
                let score = cc.find("score", itmp).getComponent(cc.Label);
                score.string = cc.g.utils.realNum1(e.fight[i] > 0 ? '+'+e.fight[i] : e.fight[i]);
                score.node.color = (e.fight[i] > 0) ? new cc.Color(0xBE, 0x5B, 0x36) : new cc.Color(0x2B, 0x88, 0x1E);

                // 名字
                cc.find("name", itmp).getComponent(cc.Label).string = cc.g.utils.getFormatName(e.name, 3*2);

                // 头像 名字 ID
                let head = cc.find("mask/head", itmp).getComponent(cc.Sprite);
                cc.g.utils.sethead(head, d.totalFight[j].icon);

                //
                cc.find("fz", itmp).active = e.isfz;

                cttp.addChild(itmp);
            }

            //
            cc.g.utils.addClickEvent(cc.find('btn_hfturn', itm), this.node, 'playHistoryDlg', 'onClickTurnBP', itm);
            cc.g.utils.addClickEvent(cc.find('btn_share', itm), this.node, 'playHistoryDlg', 'onClickShare', itm);

            ctt.addChild(itm);
        }


        if (this.backToPlayHistory) {
            this.backToPlayHistory = null;
            this.backtoGM = true;
        }

        let o = {}
        o.lastData = d;
        cc.g.hallMgr.backToPlayHistory = o;
    },

    // 游戏列表点击事件
    onClickTurnBP: function (event, itm) {
        cc.log('onClickTurnBP replayId gameType', itm.replayId, itm.gameType);

        cc.g.utils.btnShake();

        cc.g.hallMgr.tryPlaybBack({
            replayId:itm.replayId,
            gameType:itm.gameType, 
            origin:this.origin,
            idx:this.idx,
            clubId:this.clubInfo ? this.clubInfo.clubId : null,
            bjID:this.clubInfo ? this.bjuid : null,
        });
    },
    // 游戏列表点击事件
    onClickShare: function (event, itm) {
        cc.log('onClickShare', itm);
        cc.g.utils.btnShake();
    },


    // 关闭
    onBtnClose: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose'));

        cc.g.hallMgr.backToPlayHistory = null;

        cc.g.utils.btnShake();

        if (this.curGMItem) {
            this.sv_listgm.node.active = true;
            this.sv_listturn.node.active = false;

            this.curGMItem = null;
        } else if (this.backtoGM) {
            this.backtoGM = false;
            this.sv_listgm.node.active = this.sv_listturn.node.active = false;
            this.upData();
        } else {
            this.node.destroy();
        }
    },
});
