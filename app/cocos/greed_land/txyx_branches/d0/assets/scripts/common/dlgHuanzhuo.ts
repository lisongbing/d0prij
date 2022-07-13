// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// @ts-ignore
const {ccclass, property} = cc._decorator;

let l_curgm = null;

let getPlayNum = (n) => {
    let playNum = n;
    if (playNum > 20) {
        if (playNum == 37 || playNum == 38 || playNum == 43) {
            playNum = 4;
        } else if (playNum == 39 || playNum == 40) {
            playNum = 7;
        } else if (playNum == 41) {
            playNum = 2;
        } else if (playNum == 42) {
            playNum = 3;
        } else if (playNum == 44) {
            playNum = 3;
        } else if (playNum == 45) {
            playNum = 4;
        } else {
            playNum = 4;
        }
    }

    return playNum;
}

@ccclass
// @ts-ignore
export default class NewClass extends cc.Component {

    // @ts-ignore
    @property(cc.SpriteAtlas)
    // @ts-ignore
    hallAtlas: cc.SpriteAtlas = null;
    
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    GameItem: cc.Prefab = null;
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    PlayItem: cc.Prefab = null;
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    wanjiaItem: cc.Prefab = null;
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    tableItem1: cc.Prefab = null;
    // @ts-ignore
    @property(cc.Prefab)
    // @ts-ignore
    tableItem2: cc.Prefab = null;

    //
    Label_rule:any = null;

    // @ts-ignore
    yaoqing:cc.Node = null;
    // @ts-ignore
    sv_GM:cc.Component = null;
    // @ts-ignore
    sv_play:cc.Component = null;
    // @ts-ignore
    sv_table:cc.Component = null;
    // @ts-ignore
    sv_wanjia:cc.Component = null;


    qyqData:any = {};
    tableData:any = {};
    
    playData:any = [];
    gameData:any = [];
    deskData:any = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();
    }

    initView() {
        cc.log('initView');

        let r = this.node;

        let yq = cc.find('yaoqing', r);
        this.sv_wanjia = cc.find('sv_wanjia', yq).getComponent(cc.ScrollView);
        this.yaoqing = yq;

        // 规则
        this.Label_rule = cc.find('Label_rule', r).getComponent(cc.Label);

        // 游戏
        this.sv_GM = cc.find('ScrollView_game', r).getComponent(cc.ScrollView);
        // 玩法
        this.sv_play = cc.find('ScrollView_play', r).getComponent(cc.ScrollView);
        // 桌子
        this.sv_table = cc.find('sv_table', r).getComponent(cc.ScrollView);
    }

    start () {

    }

    // update (dt) {}

    

    up() {
        // @ts-ignore
        cc.log('up');

        this.yaoqing.active = false;
        
        this.sv_GM.node.active = false;
        this.sv_play.node.active = false;
        this.sv_table.node.active = false;

        //this.upWanjia();
        //this.upZhuozi(0);
        this.upPlay();
    }



    // ======游戏===========================================================================
    upPlay() {
        cc.log('upPlay');

        {/*
            //茶馆大厅(玩法列表，金币场数据，职位数据)
            //@api:2240,@type:req
            message TeaHouseHallReq{
                int32 teaHouseId = 1;//茶馆Id
            }
            //@api:2240,@type:resp
            message TeaHouseHallResp{
                ...
                repeated TeaHouseRoomRule list=25;//包间列表(玩法列表) 
                ...
            }

            //茶馆包间规则(玩法)
            message TeaHouseRoomRule {
                int32 floor =1;//楼层
                string name =2;//名称
                bool  closeStatus =3;//关闭入口(true 开启关闭入口 false未勾选关闭入口)
                int64 base = 4; //底分
                int32 playNum = 5;//游戏人数
                int32 gameNum = 6;//游戏局数
                int32 gameType = 7;//游戏种类
                int64 winnerScore = 8;//大赢家分数
                repeated int32 rule = 9; //规则
                repeated int32 specialRule = 10; //特殊规则(k-v结构)
                ExpendSpeciThing expendSpeciThing = 11;//特定字段
                GoldMatchRoomRule goldMatchRule = 12;//金币场包间规则
                int32 origin  = 13;//地区
            }
        */}

        this.playData = [];

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_HALL);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_HALL, req, (resp)=>{
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('upPlay 成功');
                
                // let qyqd = {};
                // qyqd['teaHouseId'] = resp.teaHouseId;//茶馆Id

                resp.list.forEach(e => {
                    let o:any = {};

                    o.floor = e.floor;
                    o.name = e.name;
                    o.playNum = e.playNum;
                    o.gameNum = e.gameNum;
                    o.gameType = e.gameType;
                    o.origin = e.origin;

                    o.rule = [];
                    e.rule.forEach(r =>o.rule.push(r));
                    o.specialRule = [];
                    e.specialRule.forEach(sr =>o.specialRule.push(sr));

                    o.base = e.base;
                    o.origin = e.origin;
                    o.winnerScore = e.winnerScore;
                    o.expendSpeciThing = e.expendSpeciThing;
                    o.goldMatchRule = e.goldMatchRule;

                    this.playData.push(o);
                });

                this.upGame();
                this.upGameView();
            }
        });
    }
    upGame() {
        cc.log('upGame');

        // @ts-ignore
        let ri = cc.g.hallMgr.curGameMgr.roomInfo;
        let gm = `${ri.gameType}.${ri.origin}`;

        this.playData.forEach(p => {
            if (!this.gameData[`${p.gameType}.${p.origin}`]) {
                this.gameData[`${p.gameType}.${p.origin}`] = [];
            }
            
            this.gameData[`${p.gameType}.${p.origin}`].push(p);
        });

        // 简单排个序
        let a=[], k={}, self = null;
        this.playData.forEach(p => {
            let g=p.gameType, o=p.origin;

            if (ri.gameType==g && ri.origin==o) {
                self = {gm:`${g}.${o}`, list:this.gameData[`${g}.${o}`]};
                return;
            }

            if (!k[`${g}.${o}`]) {
                k[`${g}.${o}`]=1;
                a.push({gm:`${g}.${o}`, list:this.gameData[`${g}.${o}`]});
            }
        });

        a.unshift(self);

        this.gameData=a;
        cc.log('this.gameData', this.gameData);
    }
    upGameView() {
        cc.log('upGameView');

        l_curgm = null;
        this.sv_GM.node.active = true;

        let findT = (id)=> {
            let tp = -1;

            // @ts-ignore
            for (const t in GMGrp) {
                // @ts-ignore
                const idseq = GMGrp[t];
                for (let i = 0; i < idseq.length; i++) {
                    if (idseq[i] == id) {
                        tp = 0;
                        if (t=='mahjong') {
                            tp = 1;
                        } else if (t=='poker') {
                            tp = 2;
                        }
                        break;
                    }
                }

                if (tp>=0) break;
            }

            return tp;
        };

        // @ts-ignore
        let ctt = this.sv_GM.content;
        ctt.destroyAllChildren();

        let _1itm = null;
        this.gameData.forEach(e => {
            let g = e.gm.split('.');
            let id = parseInt(g[0]);
            let ori = parseInt(g[1]);

            let itm = cc.instantiate(this.GameItem);

            //
            let bg = cc.find('bg', itm).getComponent(cc.Sprite);
            bg.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gibg_${findT(id)}`);

            //
            let icon = cc.find('bg/icon', itm).getComponent(cc.Sprite);
            icon.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gi_${id}_${ori}`);

            // @ts-ignore
            cc.find('bg/Label_gn', itm).getComponent(cc.Label).string = cc.g.utils.getGameName(id, ori);
            
            // @ts-ignore
            cc.g.utils.addCheckEvent(itm, this.node, 'dlgHuanzhuo', 'onCheckGame', e);

            ctt.addChild(itm);

            if (!_1itm) {
                _1itm = itm;
            }
        });

        // @ts-ignore
        if (_1itm) {
            _1itm.getComponent(cc.Toggle).check();
        }
    }
    onCheckGame(tog, ce) {
        cc.log('onCheckGame', ce);

        if (l_curgm && l_curgm==ce.gm) {
            cc.log('相同点击');
            return;
        }
        l_curgm = ce.gm;

        this.sv_play.node.active = true;

        // @ts-ignore
        let floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;

        let play = ce.list;

        // @ts-ignore
        let ctt = this.sv_play.content;
        ctt.destroyAllChildren();

        let _1itm = null;
        play.forEach(e => {
            let itm = cc.instantiate(this.PlayItem);

            let str = e.name+'\n'+getPlayNum(e.playNum) +'人' + e.gameNum + '局';

            //
            cc.find('bg/New Label', itm).getComponent(cc.Label).string = str;
            cc.find('checkmark/New Label', itm).getComponent(cc.Label).string = str;

            // @ts-ignore
            cc.g.utils.addCheckEvent(itm, this.node, 'dlgHuanzhuo', 'onCheckPlay', e);

            ctt.addChild(itm);

            if (!_1itm) {
                _1itm = itm;
            }

            if (floor == e.floor) {
                _1itm = itm;
            }
        });

        // @ts-ignore
        if (_1itm) {
            _1itm.getComponent(cc.Toggle).check();
        }
    }
    onCheckPlay(tog, ce) {
        cc.log('onCheckPlay');

        // @ts-ignore
        this.Label_rule.string = cc.g.utils.convertRuleToString(ce);

        this.upDesk(ce);
    }
    // ======游戏===========================================================================

    __o(){}

    // ======桌子===========================================================================
    upDesk(dd){
        {/*
            //指定包间桌子列表数据
            //@api:2241,@type:req
            message TeaHouseRoomDeskListReq{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor = 2;//楼层
            }
            //@api:2241,@type:resp
            message TeaHouseRoomDeskListResp{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor = 2;//楼层
                repeated TeaHouseRoomDesk deskList = 3;//桌子列表
            }
            //茶馆包间桌子信息
            message TeaHouseRoomDesk {
                int32 floor =1;//楼层(1-50)
                int32 deskNo =2;//桌子序号(1-20)
                int32 gameType = 3;//游戏种类
                int32 playNum = 4;//游戏人数
                bool  isStart = 5;//是否已经开始
                int32 curNum = 6;//当前局数
                int32 totalNum = 7;//总局数
                int32 origin  = 8;//地区
                repeated TeaHouseDeskPlayer playerList=9;//玩家列表
                string name  = 10;//名称
            }
            //茶馆包间桌上玩家的信息
            message TeaHouseDeskPlayer{
                int64  pid  = 1;//玩家唯一Id
                string name  = 2;//玩家的昵称
                string icon  = 3;//玩家的头像
                bool   online = 4;//是否在线
                bool  isReady=5;//是否准备了
            }
        */}

        this.deskData = [];

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        req.floor = dd.floor;
        
        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ROOM_DESK_LIST, req, (resp)=>{
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore
                cc.log('upDesk 成功');
                
                // let qyqd = {};
                // qyqd['teaHouseId'] = resp.teaHouseId;//茶馆Id

                let self = null;

                resp.deskList.forEach(e => {
                    if (e.isStart) {
                        return;
                    }

                    let pn = e.playNum;

                    if (e.playerList.length >= pn) {
                        //return;
                    }

                    let d:any = {};
                    d.gameType = e.gameType;
                    d.rule = dd.rule;
                    d.floor = e.floor;
                    d.deskNo = e.deskNo;
                    d.num = pn;
                    d.list = [];
                    
                    let isself = false;
                    e.playerList.forEach(p => {
                        d.list.push({
                            icon:p.icon,
                            //isReady:isReady,
                            name:p.name,
                            //online:p.online,
                            pid:p.pid,
                        });

                        // @ts-ignore
                        if (eq64(p.pid, cc.g.userMgr.userId)) {
                            isself = true;
                            self = d;
                        }
                    });

                    if (!isself) {
                        this.deskData.push(d);
                    }
                });

                if (self) {
                    this.deskData.unshift(self);
                }

                this.deskData.push({
                    gameType: dd.gameType,
                    rule: dd.rule,
                    floor:dd.floor,
                    deskNo:0,
                    num:dd.playNum,
                    list:[],
                });

                this.upDeskView();
            } else {
                cc.log('upDesk 失败');
            }
        });
    }
    upDeskView() {
        cc.log('upDeskView');

        this.sv_table.node.active = true;

        let dd = this.deskData;
        // @ts-ignore
        let ctt = this.sv_table.content;
        ctt.destroyAllChildren();
        
        for (let i = 0; i < dd.length; ++i) {
            let pnum = getPlayNum(dd[i].num);
            let pfb = pnum<=6 ? this.tableItem1:this.tableItem2;
            let itm = cc.instantiate(pfb);

            let list = dd[i].list;

            // @ts-ignore
            cc.find('idx', itm).getComponent(cc.Label).string = i+1;

            // 玩家列表
            let playerList = list;
            let cttp = cc.find('content', itm);
            for (let j = 0; j < 12; ++j) {
                let p = cc.find('p'+(j+1), cttp);
                if(!p) break;

                if (j>=pnum) {
                    p.active = false;
                    continue;
                }

                if (!playerList[j]) {
                    cc.find('empty', p).active = true;
                    cc.find('plr', p).active = false;

                    // @ts-ignore
                    cc.g.utils.addClickEvent(cc.find('empty', p), this.node, 'dlgHuanzhuo', 'onBtnHuanzhuo', dd[i]);

                    continue;
                }

                cc.find('empty', p).active = false;
                cc.find('plr', p).active = true;

                //
                let head = cc.find('plr/mask/head', p).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.sethead(head, playerList[j].icon);

                // @ts-ignore
                cc.find('plr/name', p).getComponent(cc.Label).string = cc.g.utils.getFormatName(playerList[j].name, 3*2);

                // @ts-ignore
                cc.find('plr/ziji', p).active = eq64(playerList[j].pid, cc.g.userMgr.userId); 
            }

            ctt.addChild(itm);
        }
    }
    // ======桌子===========================================================================

    _o(){}

    // ======邀请===========================================================================
    upWanjia() {
        //cc.log('upWanjia');

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_PLAYER_LIST);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        req.filterStart = true;
        req.pageNum = 1;
        req.pageSize = 50;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_PLAYER_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore
                cc.log('upWanjia 成功');
                
                let qyqd = {};
                qyqd['teaHouseId'] = resp.teaHouseId;//茶馆Id
                qyqd['pageNum'] = resp.pageNum;//当前页码数
                qyqd['pageSize'] = resp.pageSize;//每页显示条数
                qyqd['totalCount'] = resp.totalCount;//总条数
                qyqd['totalPage'] = resp.totalPage;//总页数
                qyqd['list'] = qyqd['list'] || [];

                resp.list.forEach(e => {
                    let o = {
                        userId:e.userId,
                        name:e.name,
                        icon:e.icon,
                        online:e.online,
                        status:e.status,
                    };
                    qyqd['list'].push(o);
                });

                this.qyqData = qyqd;

                this.upViewWanjia();
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }
    upViewWanjia() {
        // @ts-ignore
        cc.log('upViewWanjia');

        //this.yaoqing.active = true;

        let list = this.qyqData['list'];
        let items = this.qyqData['items'];

        // @ts-ignore
        let ctt = this.sv_wanjia.content;
        if (!items) {
            ctt.destroyAllChildren();
            items = this.qyqData['items'] = [];
        }
        
        for (let i = 0; i < list.length; ++i) {
            let d = list[i];

            let itm = cc.instantiate(this.wanjiaItem);

            //
            let head = cc.find('Node_headMask/Sprite_head', itm).getComponent(cc.Sprite);
            // @ts-ignore
            cc.g.utils.sethead(head, d.icon);

            // @ts-ignore
            cc.find('Label_name', itm).getComponent(cc.Label).string = cc.g.utils.getFormatName(d.name, 3*2);

            //
            cc.find('Label_zx', itm).active = (d.status==0);

            // @ts-ignore
            cc.g.utils.addClickEvent(cc.find('Button_yq', itm), this.node, 'dlgHuanzhuo', 'onBtnYaoqing', d);

            ctt.addChild(itm);
            items.push(itm);
        }
    }
    //
    onBtnYaoqing(evt, data) {
        // @ts-ignore
        cc.log('onBtnYaoqing', data);

        // @ts-ignore
        cc.g.utils.btnShake();
        
        {/*
            //(游戏内)邀请亲友圈玩家加入游戏
            //@api:2315,@type:req
            message  InviteThPlayerJoinGameReq{
                int32    teaHouseId=1;//茶馆Id
                int64    userId=2;//用户Id
                int32    floor = 3;//楼层号(0-50)
                int32    deskNo = 4;//桌子号
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_PLAYER);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        req.userId = data.userId;
        // @ts-ignore
        req.floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        // @ts-ignore
        req.deskNo = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.deskIndex;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_PLAYER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }
    // 一键邀请
    onBtnYaoqingAll(evt, data) {
        // @ts-ignore
        cc.log('onBtnYaoqingAll 一键邀请');

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_ALL_PLAYER);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        // @ts-ignore
        req.floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        // @ts-ignore
        req.deskNo = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.deskIndex;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_ALL_PLAYER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }
    // ======邀请===========================================================================

    ___o(){}

    // ======OLD===========================================================================
    upZhuozi(pageidx) {
        // @ts-ignore
        cc.log('upZhuozi ', pageidx);

        {/*
            //茶馆换桌列表
            //@api:2326,@type:req
            message TeaHouseChangeDeskListReq{
                int32    teaHouseId=1;//茶馆Id
                int32    floor = 2;//楼层
                int32    pageNum=3;//当前页码数
                int32    pageSize=4;//每页显示条数 
            }
            //@api:2326,@type:resp
            message  TeaHouseChangeDeskListResp{
                int32    teaHouseId=1;//茶馆Id
                int32    floor = 2;//楼层
                int32    pageNum=3;//当前页码数    
                int32    pageSize=4;//每页显示条数 
                int32    totalCount=5;//总条数
                int32    totalPage=6;//总页数
                repeated TeaHouseRoomDesk list = 7;//桌子列表
            }

            //茶馆包间桌子信息
            message TeaHouseRoomDesk {
                int32 floor =1;//楼层(1-50)
                int32 deskNo =2;//桌子序号(1-20)
                int32 gameType = 3;//游戏种类
                int32 playNum = 4;//游戏人数
                bool  isStart = 5;//是否已经开始
                int32 curNum = 6;//当前局数
                int32 totalNum = 7;//总局数
                int32 origin  = 8;//地区
                repeated TeaHouseDeskPlayer playerList=9;//玩家列表
                string name  = 10;//名称
            }
            //茶馆包间桌上玩家的信息
            message TeaHouseDeskPlayer{
                int64  pid  = 1;//玩家唯一Id
                string name  = 2;//玩家的昵称
                string icon  = 3;//玩家的头像
                bool   online = 4;//是否在线
                bool  isReady=5;//是否准备了
            }
        */}

        if (!this.tableData) {
            this.tableData = {};
        }

        if (!pageidx) {
            pageidx = 1;

            this.tableData.list = [];

            this.tableData.pageNum = pageidx;
            this.tableData.pageSize = 50;
            this.tableData.totalCount = 0;
            this.tableData.totalPage = 1;
        }

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_CHANGE_DESK_LIST);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        // @ts-ignore
        req.floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        req.pageNum = pageidx;
        req.pageSize = this.tableData.pageSize;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_CHANGE_DESK_LIST, req, (resp)=>{
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                // @ts-ignore
                cc.log('upZhuozi 成功');
                
                // let qyqd = {};
                // qyqd['teaHouseId'] = resp.teaHouseId;//茶馆Id

                this.tableData.pageNum = resp.pageNum;
                this.tableData.totalCount = resp.totalCount;
                this.tableData.totalPage = resp.totalPage;

                resp.list.forEach(e => {
                    this.tableData.list.push(e);
                });

                //this.qyqData = qyqd;

                this.upViewZhuozi();
            }
        });
    }
    upViewZhuozi() {
        // @ts-ignore
        cc.log('upViewZhuozi');

        
        // @ts-ignore
        let totle = cc.g.hallMgr.curGameMgr.roomInfo.total;
        let pfb = totle<=4 ? this.tableItem1:this.tableItem2;

        this.sv_table.node.active = true;

        let td = this.tableData;
        // @ts-ignore
        let ctt = this.sv_table.content;
        if (td.pageNum == 1) {
            ctt.destroyAllChildren();
        }
        
        for (let i = (td.pageNum-1) * td.pageSize; i < td.pageSize; ++i) {
            let list = td.list[i];

            if (!list) {
                break;
            }

            // @ts-ignore
            let itm = cc.instantiate(pfb);

            // @ts-ignore
            cc.find('idx', itm).getComponent(cc.Label).string = i+1;

            // 玩家列表
            let playerList = list.playerList;
            // @ts-ignore
            let cttp = cc.find('content', itm);
            for (let j = 0; j < 8; ++j) {
                // @ts-ignore
                let p = cc.find('p'+(j+1), cttp);
                if(!p) break;

                if (j>=totle) {
                    p.active = false;
                    continue;
                }

                if (!playerList[j]) {
                    // @ts-ignore
                    cc.find('empty', p).active = true;
                    // @ts-ignore
                    cc.find('plr', p).active = false;

                    // @ts-ignore
                    cc.g.utils.addClickEvent(cc.find('empty', p), this.node, 'dlgHuanzhuo', 'onBtnHuanzhuo', list.deskNo);

                    continue;
                }

                // @ts-ignore
                cc.find('empty', p).active = false;
                // @ts-ignore
                cc.find('plr', p).active = true;

                // @ts-ignore
                let head = cc.find('plr/mask/head', p).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.sethead(head, playerList[j].icon);

                // @ts-ignore
                cc.find('plr/name', p).getComponent(cc.Label).string = cc.g.utils.getFormatName(playerList[j].name, 3*2);

                // @ts-ignore
                cc.find('plr/ziji', p).active = eq64(playerList[j].pid, cc.g.userMgr.userId); 
            }

            ctt.addChild(itm);
        }
    }
    // ======OLD===========================================================================

    // 换桌
    onBtnHuanzhuo(evt, dd) {
        // @ts-ignore
        cc.log('onBtnHuanzhuo idx', dd);

        {/*
            //茶馆换桌子
            //@api:2324,@type:req
            message TeaHouseChangeDeskReq{
                int32 teaHouseId = 1;//茶馆Id
                int32 floor = 2;//楼层号(1-50)
                int32 deskNo = 3;//桌子序号(1-20)
                bool openGps = 4;//是否开启GPS
                
            }
        */}

        // @ts-ignore
        let id = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        // @ts-ignore
        let floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        //let opgps = cc.g.hallMgr.curGameMgr.roomInfo.clubId;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_CHANGE_DESK);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        // @ts-ignore
        req.floor = dd.floor;//cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        req.deskNo = dd.deskNo;
        req.openGps = true;

        // @ts-ignore
        cc.g.hallMgr.exitGame();

        // @ts-ignore
        // cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_CHANGE_DESK, req, (resp)=>{
        //     // @ts-ignore
        //     if (!resp.err || resp.err == PB.ERROR.OK) {
        //         cc.log('onBtnHuanzhuo 换桌 成功');
        //     }
        // });

        let pg = cc.g.hallMgr.curGameMgr.gameScript;
        //pg && (pg.needreinit = true);
        let g = l_curgm.split('.');
        let gm = parseInt(g[0]);
        let ori = parseInt(g[1]);

        // @ts-ignore
        // if (gm != cc.g.hallMgr.curGameType) {
        //     pg = null;
        // }
        pg = null;

        // @ts-ignore
        cc.g.huanzData = {
            teaHouseId: req.teaHouseId,
            floor: req.floor,
            deskNo: req.deskNo,
            openGps: req.openGps,
            gameType: dd.gameType,
            rule: dd.rule,
            page: pg,
        };

        //this.scheduleOnce(()=>this.up(), 0.1);
        this.onBtnClose(0, 0);
    }

    onBtnClose(evt, data) {
        // @ts-ignore
        cc.log('onBtnClose');
        
        // @ts-ignore
        this.node.destroy();

        // @ts-ignore
        cc.g.hallMgr.inGameMenu.dlgHuanzhuo = null;
    }
}
