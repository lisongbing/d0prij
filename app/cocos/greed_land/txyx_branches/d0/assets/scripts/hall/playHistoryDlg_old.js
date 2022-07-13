
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

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    /* =================================================================================================================== */

    init: function (gameID, club, jump) {
        this.clubInfo = club;
        this.curGameId = gameID ? gameID : (this.curGameId || 0);
        this.bjuid = jump ? jump.bjuid : null;
        this.jmIdx = jump ? jump.idx : null;
        this.origin = jump ? jump.origin : null;

        if (cc.g.hallMgr.backToPlayHistory) {
            this.curGameId = cc.g.hallMgr.backToPlayHistory.gameId;
            this.origin = cc.g.hallMgr.backToPlayHistory.origin;
            this.jmIdx = cc.g.hallMgr.backToPlayHistory.index;
        }

        this.hisInfo = {};

        this.reGetInfo={};
        for (let i = 0, L = GameConfig.gamesSeq.length; i < L; i++) {
            this.reGetInfo[GameConfig.gamesSeq[i]] = {};
        }

        if (! this.isInitView) {
            this.initView();
            this.isInitView = true;
        }

        this.initGameList();
        
        if (this.curGMItem) {
            this.curGMItem.toggle.check();
        }

        if (cc.g.tjBD) {
            this.onBtnChaguantj();
        }
    },

    // 更新对话框界面
    initView: function (info) {
        let r = this.node.getChildByName('Node_ctt');

        // 游戏列表滚动视图
        this.svGameList = r.getChildByName('ScrollView_gameList').getComponent(cc.ScrollView);

        // 战绩滚动视图
        this.svHistory = r.getChildByName('ScrollView_history').getComponent(cc.ScrollView);
        let ctt = this.svHistory.content;
        ctt.removeAllChildren();
        ctt.getComponent(cc.Layout).updateLayout();
    },

    //初始化游戏列表
    initGameList: function () {
        cc.log(this.dbgstr('initGameList'));

        let lc_gmGrp = GMGrp;

        // 开放游戏
        let open = {};
        GameConfig.gamesSeq.forEach(e => open[e] = true);
        
        if (!this.norGmList) {
            this.norGmList = [];
            for (const t in lc_gmGrp) {
                const idseq = lc_gmGrp[t];
                idseq.forEach(id => {
                    if (!open[id]) return;

                    cc.g.hallMgr.upCreateInfo(id);
                    let crtInfo = cc.g.hallMgr.crtRoomInfo[id];
                    if (!crtInfo) {
                        cc.log('initGameList'+' 没有游戏配置 '+t+' '+id);
                        return;
                    }

                    // 该游戏的所有地区
                    for (const a in crtInfo.comArea.v) {
                        // 普通创建 血战只有成都地区
                        let add = true;
                        if (id==GMID.XZMJ) {
                            add = (a==6);
                        } else if (id==GMID.XZMJER) {
                            add = (a==6);
                        } else if (id==GMID.YBMJ) {
                            add = (a==5);
                        }

                        if (add) {
                            this.norGmList.push({ID:id, origin:a});
                        }
                    }
                })
            }

            let a1=[], a2=[];
            this.norGmList.forEach(e => {
                if (e.ID==GMID.D2) {
                    if (e.origin==2) {
                        a1[0] = e;
                        return;
                    } else if (e.origin==4) {
                        a1[1] = e;
                        return;
                    }
                }
                
                a2.push(e);
            });
            this.norGmList = a1.concat(a2);
        }

        // 初始俱乐部创建的游戏列表 通过地区记录
        if (this.clubInfo) {
            if (!this.clubGmList) {
                this.clubGmList = {};
            }

            let origin = this.clubInfo.origin;
            if (!this.clubGmList[origin]) {
                this.clubGmList[origin] = [];

                //该地区的所有游戏
                let coid = {};
                let list = cc.g.areaInfo[origin].game;
                list.forEach(e => coid[e] = true);

                // 确定分组
                for (const t in lc_gmGrp) {
                    const idseq = lc_gmGrp[t];
                    idseq.forEach(id => {
                        if (!open[id] || !coid[id]) return; // 不在开放游戏或俱乐部地区游戏里
                        this.clubGmList[origin].push({ID:id, origin:origin});
                    });
                }
            }
        }

        // 要显示的游戏列表
        let gmlist = [];

        if (this.clubInfo) {
            //gmlist = this.clubGmList[this.clubInfo.origin];
            gmlist = this.norGmList
        } else {
            gmlist = this.norGmList;
        }

        // 更新游戏标签
        this.svGameList.scrollToTop();
        let defGMItem = null;
        this.curGMItem = null;
        this.gmListItems = {};
        let ctt = this.svGameList.content;
        ctt.removeAllChildren();
        for (let i = 0, L = gmlist.length; i < L; i++) {
            let item = cc.instantiate(this.gameListItem);
            item.idx = i;
            //item.anchorY = 1.0;
            item.uD = gmlist[i];
            item.name = ''+item.uD.origin + '_' + item.uD.ID;
            item.toggle = item.getComponent(cc.Toggle);
            item.toggle.uncheck();
            
            let n0 = cc.find("diban_sige01/New Sprite", item).getComponent(cc.Sprite);
            n0.spriteFrame = this.atlas.getSpriteFrame('crtrm_gn_'+ item.uD.ID +'_'+item.uD.origin+'_'+'0');
            let n1 = cc.find("check_mark/New Sprite", item).getComponent(cc.Sprite);
            n1.spriteFrame = this.atlas.getSpriteFrame('crtrm_gn_'+ item.uD.ID +'_'+item.uD.origin+'_'+'1');

            cc.g.utils.addCheckEvent(item, this.node, 'playHistoryDlg', 'onClickGameItem', item);

            if (this.curGameId && this.origin) {
                if (this.curGameId==item.uD.ID && this.origin==item.uD.origin) {
                    this.curGMItem=item;
                }
            }
            
            if (!defGMItem) {
                defGMItem=item;
            }

            this.gmListItems[item.name] = item;
            ctt.addChild(item);
        }
        ctt.getComponent(cc.Layout).updateLayout();

        if (!this.curGMItem) {
            this.curGMItem=defGMItem;
        } 

        if (!this.clubInfo) {
            if (this.curGMItem.idx < 6) {
                //this.svGameList.scrollToTop();
                ctt.position = new cc.Vec2(ctt.position.x, 172);
            } else if (this.curGMItem.idx > (gmlist.length-6)) {
                this.svGameList.scrollToBottom();
            } else {
                cc.g.utils.setScrollViewItemToVerticalCenter(this.svGameList, this.curGMItem);
            }
        } else {
            //this.svGameList.scrollToTop();
            this.scheduleOnce(()=>{
                //ctt.position = new cc.Vec2(ctt.position.x, 20);
            }, 0.05);
        }
    },

    // 游戏列表点击事件
    onClickGameItem: function (event, customEventData) {
        let itm = customEventData;

        cc.log('CreateRoomDlg' + ' ' + 'onClickGameItem', itm.uD);

        if (!event.isChecked || !this.curGMItem) {
            return;
        }

        this.curGMItem = itm;

        this.origin = this.curGMItem.uD.origin;
        this.curGameId = this.curGMItem.uD.ID;

        // 游戏切换后 处理相关数据更新
        this.upHistory();
    },

    // 更新战绩
    upHistory: function () {
        {/*
            //@api:1026,@type:req
            message GetMultipleFightGradeReq{
            //    GAME gameType =1; //游戏类型
            //	int64 uid = 2;//查询UId
            //	int32 clubId = 3;//俱乐部ID
            //	int32 origin = 4; //地区
                int32 page = 1; //页数
            }
        */}

        cc.log(this.dbgstr('upHistory'));

        {
            let r = this.node.getChildByName('Node_ctt');
            r.getChildByName('btn_Label_jsrtj').active = (this.clubInfo && this.clubInfo.isowner);
        }

        this.node.active = true;

        if (!this.reGetInfo[this.curGameId][this.origin]) {
            let req = pbHelper.newReq(PB.PROTO.GET_FIGHT_LIST);
            req.gameType = this.curGameId;
            req.origin = parseInt(this.origin);
            if (this.clubInfo && this.clubInfo.clubId>0) {
                req.clubId = this.clubInfo.clubId;
            }

            cc.g.networkMgr.send(PB.PROTO.GET_FIGHT_LIST, req, (Resp) => {
                this.reGetInfo[this.curGameId][this.origin] = true;
                this.refreshData(Resp);
                this.upInfo();
            });
        } else {
            this.upInfo();
        }
    },

    // 更新数据
    refreshData: function (resp) {
        {/*
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
                repeated replayIds;
                repeated PersonFight totalFight   = 5; //总战绩
                repeated PersonFight detailFight  = 6;//详细战绩
            }

            message PersonFight{
                string name = 1;//玩家昵称
                repeated int32 fight = 2;//每局的战绩
            }
        */}

        if (!this.hisInfo[this.curGameId]) {
            this.hisInfo[this.curGameId] = {};
        }

        this.hisInfo[this.curGameId][this.origin] = [];

        resp.list.forEach(e => {
            if (this.clubInfo && this.clubInfo.clubId>0) {
                if (e.clubId != this.clubInfo.clubId) {
                    cc.log(this.dbgstr('过滤不是该茶馆的战绩'));
                    return;
                }
            } else {
                if (e.clubId > 0) {
                    //cc.log(this.dbgstr('过滤茶馆的战绩'));
                    //return;
                }
            }

            let d = {};
            d.start = e.start.toNumber();
            d.end = e.end.toNumber();
            d.roomId = e.roomId;
            d.num = e.num;
            d.replayIds = cc.g.clone(e.replayIds);

            let idx = 0;
            let nameidx = {};
            d.totalFight = [];
            e.totalFight.forEach(e1 => {
                let o = {};
                o.name = e1.name;
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
                o.fight = [];

                e1.fight.forEach(e2 => {
                    o.fight.push(e2);
                });

                d.detailFight[nameidx[o.name]] = o;
            });

            this.hisInfo[this.curGameId][this.origin].push(d);
        });
    },

    // #BE5B36 #2B881E
    upInfo: function () {
        let ctt = this.svHistory.content;
        ctt.removeAllChildren();
        
        let ifos = this.hisInfo[this.curGameId][this.origin];
        if (!ifos || ifos.length<1) {
            return;
        }
        
        for (let i = 0; i < ifos.length; ++i) {
            let ifo = ifos[i];

            let itm = cc.instantiate(this.stroyItem);
            //itm.getComponent(cc.Sprite).spriteFrame = pageAtlas.getSpriteFrame(bhfrm);
            //let hf = cc.find("Sprite_hf", itm).getComponent(cc.Sprite);
            //hf.spriteFrtame = pageAtlas.getSpriteFrame('d2_imgtxt_' + data[i]);

            let formatDate = function (now) {  
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                month = month < 10 ? '0'+month : month;
                let date = now.getDate();
                date = date < 10 ? '0'+date : date;
                let hour = now.getHours();
                hour = hour < 10 ? '0'+hour : hour;
                let minute = now.getMinutes();
                minute = minute < 10 ? '0'+minute : minute;
                let second = now.getSeconds();
                second = second < 10 ? '0'+second : second;

                return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;  
            }
            let formatDate2 = function (now) {  
                let hour = now.getHours();
                hour = hour < 10 ? '0'+hour : hour;
                let minute = now.getMinutes();
                minute = minute < 10 ? '0'+minute : minute;
                let second = now.getSeconds();
                second = second < 10 ? '0'+second : second;

                return hour + ":" + minute + ":" + second;  
            }

            // 时间 Label_date
            let Label_date = cc.find("Label_date", itm).getComponent(cc.Label);
            let t = new Date(ifo.start*1000);
            let s1 = formatDate(t);
            t = new Date(ifo.end*1000);
            let s2 = formatDate2(t);
            Label_date.string = '时间：' + s1 + ' — ' + s2;

            // 房间号 Label_roomID
            let Label_roomID = cc.find("Label_roomID", itm).getComponent(cc.Label);
            Label_roomID.string = '房号：' + ifo.roomId;

            // 查看详情 Label_Details
            let Label_Details = cc.find("Label_Details", itm);
            Label_Details.on('touchend', ()=>{
                cc.log('ifo.roomId', ifo.roomId);

                let dlg = cc.instantiate(this.detailsDlg);
                dlg.getComponent('phDetailsDlg').init(this, i);

                this.node.active = false;
            });

            // 玩家
            let ttf = ifo.totalFight;
            let hbox = cc.find("Node_players", itm);
            hbox.removeAllChildren();
            for (let i = 0; i < ttf.length; ++i) {
                let ttfd = ttf[i];

                let pitm = cc.instantiate(this.playerItem);

                // 名字
                let Label_name = cc.find("Label_name", pitm).getComponent(cc.Label);
                Label_name.string = cc.g.utils.getFormatName(ttfd.name);
                Label_name.node.color = (ttfd.fight[0] > 0) ? new cc.Color(0xd8, 0x66, 0x10) : new cc.Color(0xa0, 0x21, 0x13);
                
                // 分数
                let Label_sco = cc.find("Label_sco", pitm).getComponent(cc.Label);
                Label_sco.string = ttfd.fight[0] > 0 ? '+'+ttfd.fight[0] : ttfd.fight[0];
                // Label_sco.node.color = (ttfd.fight[0] > 0) ? cc.Color.GREEN : cc.Color.RED;
                Label_sco.node.color = (ttfd.fight[0] > 0) ? new cc.Color(0x36, 0xba, 0x10) : new cc.Color(0xf1, 0x53, 0x48);;

                hbox.addChild(pitm);
            }
            hbox.getComponent(cc.Layout).updateLayout();


            ctt.addChild(itm);
        }
        ctt.getComponent(cc.Layout).updateLayout();

        this.svHistory.scrollToTop();

        if (this.jmIdx) {
            let dlg = cc.instantiate(this.detailsDlg);
            dlg.getComponent('phDetailsDlg').init(this, this.jmIdx-1); //0开头
            this.node.active = false;

            this.jmIdx = null;
        }
    },



    // 茶馆统计
    onBtnChaguantj: function (event, customEventData) {
        if (!this.clubInfo) {
            return;
        }

        cc.log(this.dbgstr('onBtnChaguantj 茶馆统计'));

        let dlg = cc.instantiate(this.ClubTjDlg);
        this.node.parent.addChild(dlg);
        dlg.getComponent('clubTongji').init(this);
    },

    // 查看详情
    onDetails: function (event, customEventData) {
        //cc.log(this.dbgstr('onBtnClose'));
        //this.node.active = false;
    },

    // 关闭
    onBtnClose: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose'));

        this.node.destroy();
    },


    // 回放
    onBtnPlaybBack: function (replayId, gameId) {
        cc.log(this.dbgstr('onBtnPlaybBack 回放'));

        let id = replayId;
        cc.log('replay Id', id);
        // sendRequest: function (method, url, data, handler, errorHandler)
        let self = this;
        //*
        cc.g.http.sendRequest(
            'POST', 
            GameConfig.playBackIDUrl, 
            {uid: id},
            function (reps) {
                cc.log(self.dbgstr('onBtnPlaybBack reps'), reps);
                
                if (reps.Path) {
                    cc.g.http.sendRequest(
                        'GET', 
                        GameConfig.playBackDataUrl + reps.Path, //http://120.77.173.104:8090/ + 2020-02-17-20-44-46/103453a375291
                        {},
                        function (reps) {
                            self.goPlaybBack(reps, gameId);
                        }, 
                        function () {
                            //cc.error(self.dbgstr('回放数据 err'));
                        }
                    );
                } else {
                    cc.g.global.showTipBox('没有此记录');
                }
            }, 
            function () {
                cc.error(self.dbgstr('回放ID err'));
            }
        );
        //*/
    },
    // 前往回放
    goPlaybBack: function (pbdata, gameId) {
        cc.log(this.dbgstr('goPlaybBack 回放数据'), pbdata);
        
        let pbd = {};
        pbd.uid = pbdata.uid;
        pbd.player_ops = pbdata.player_ops;
        pbd.result = pbdata.result;

        let room = {};
        let one = {};
        let others = [];

        room.now = Date.now();
        room.roomId = pbdata.room_id;
        room.NewRlue = pbdata.rule;
        room.curGameNum = pbdata.cur_game_num;
        room.GameNum = pbdata.total_game_num;
        room.type = (room.GameNum > 1) ? 2 : 1;
        room.origin = pbdata.origin || 1;

        let GameId = gameId || this.curGameId;

        if (GameId == GMID.D2) {    
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;
            
            let desk=[0,1,3,2]; //所有玩家顺序:庄家,下家,上家,数底
            let desk3=[0,1,2];
            let desk2=[0,1];
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;

                if (room.total == 3) {
                    p.deskId = desk3[i];  
                } else if (room.total == 2) {
                    p.deskId = desk2[i];
                } else {
                    p.deskId = desk[i];
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.YJMJ || GameId == GMID.HZMJ || GameId == GMID.LZMJ || GameId == GMID.NJMJ) {
            {/*
                结构体:
                type GameReCord struct {
                    Uid          string                        `json:"uid"`            //每局的唯一Id
                    Rule         []int32                       `json:"rule"`           //房间规则
                    CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                    TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                    RoomId       int32                         `json:"room_id"`        //房间Id
                    Banker       int8                          `json:"banker"`        //庄家deskId
                    Players      []*PlayerBase                 `json:"players"`        //
                    BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                    PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                    Result       *pb.PdkPlayerResultListNtf `json:"result"`         //结算的结果
                }
            */}

            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.PDK || GameId == GMID.PDKNJ) {
            {/*
                结构体:
                type GameReCord struct {
                    Uid          string                        `json:"uid"`            //每局的唯一Id
                    Rule         []int32                       `json:"rule"`           //房间规则
                    CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                    TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                    RoomId       int32                         `json:"room_id"`        //房间Id
                    Banker       int8                          `json:"banker"`        //庄家deskId
                    Players      []*PlayerBase                 `json:"players"`        //所有玩家顺序:庄家,下家,上家,数底
                    BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                    PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                    Result       *pb.PdkPlayerResultListNtf `json:"result"`         //结算的结果
                }

                // @api:1030,@type:resp
                type PdkPlayerResultListNtf struct {
                    WinUid int64            `protobuf:"varint,1,opt,name=winUid" json:"winUid,omitempty"`
                    Base   int32            `protobuf:"varint,2,opt,name=base" json:"base,omitempty"`
                    Round  int32            `protobuf:"varint,3,opt,name=round" json:"round,omitempty"`
                    Time   int64            `protobuf:"varint,4,opt,name=time" json:"time,omitempty"`
                    List   []*PdkResultInfo `protobuf:"bytes,5,rep,name=list" json:"list,omitempty"`
                }
                // 跑的快的结算结果
                type PdkResultInfo struct {
                    Uid        int64   `protobuf:"varint,1,opt,name=uid" json:"uid,omitempty"`
                    Winlose    int32   `protobuf:"varint,2,opt,name=winlose" json:"winlose,omitempty"`
                    Bombnum    int32   `protobuf:"varint,3,opt,name=bombnum" json:"bombnum,omitempty"`
                    Totalscore int32   `protobuf:"varint,4,opt,name=totalscore" json:"totalscore,omitempty"`
                    Bombscore  int32   `protobuf:"varint,5,opt,name=bombscore" json:"bombscore,omitempty"`
                    Deskcards  []int32 `protobuf:"varint,6,rep,packed,name=deskcards" json:"deskcards,omitempty"`
                    Handcards  []int32 `protobuf:"varint,7,rep,packed,name=handcards" json:"handcards,omitempty"`
                }
            */}

            room.total = pbdata.total;
            room.dealer = pbdata.banker;

            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = p.desk_id;

                if (p.deskId == pbdata.banker) {
                    room.dealer = p.uid;
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.DDZ5) {
            {/*
                //@api:1035,@type:resp
                message FiveDdzPlayerResultListNtf{
                    int32   winType = 1;//0 流局 1 地主胜利 2农民胜利
                    int32   base    = 2;//客户端选择的底分(暂时无用)
                    int32   baseScore   = 3;//底分
                    int32   round    = 4;//当前局数
                    int64   time    = 5;//时间戳
                    repeated DdzResultInfo list = 6;  //玩家牌的信息及输赢
                }
                //五人斗地主的结算结果
                message DdzResultInfo{
                    int64   uid = 1;//玩家ID
                    int32   winlose = 2;//胜利失败(1 胜利 0 失败)
                    int32   totalscore = 3;//积分
                    int32   identity = 4;//身份(0 初始化  1 地主 2 农民 3 暗地主)
                    int32   scoreRate= 5;//倒拉操作值(0 初始化  1 不倒/不拉   2 倒/拉)
                    int32   gengValue=6;//梗(0 初始化  1 梗   2 喊)
                    int32   banker = 7;//庄家(1 庄家 0 非庄家)
                    repeated int32 deskcards = 8;//已打出的牌ID
                    repeated int32 handcards = 9;//手牌ID
                }
            */}

            room.total = pbdata.total;
            room.dealer = pbdata.banker;

            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = p.desk_id;

                if (p.deskId == pbdata.banker) {
                    room.dealer = p.uid;
                }
                
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.XZMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        }  else if (GameId == GMID.XZMJER) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.YBMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;
            
                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        } else if (GameId == GMID.NYMJ) {
            room.total = pbdata.players.length;
            room.dealer = pbdata.players[0].uid;
            pbd.bottom_card = pbdata.bottom_card;

            //所有玩家顺序: 专家，下家对家，上家
            for (let i = 0; i < pbdata.players.length; i++) {
                let p = pbdata.players[i];
                p.money = 0;
                p.deskId = i;

                if (cc.g.userMgr.userId.eq(p.uid)) {
                    one = p;
                } else {
                    others.push(p);
                }
            }

            room.backPlayData = pbd;
        }

        if (!one.uid) {
            cc.log('回放数据里没有玩家自己，可能是代理人查看其他人的战绩');
            one = others[0];
        }


        let o = {}
        o.gameId = this.curGameId;
        o.origin = this.origin;
        o.index = this.idx+1;

        if (this.clubInfo) {
            o.clubId = this.clubInfo.clubId;
            o.bjID = this.bjuid;
        }
        
        cc.g.hallMgr.backToPlayHistory = o;

        cc.g.hallMgr.enterGame(GameId, room, one, others);
    },
});
