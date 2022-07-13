// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";
import Tea_ZJ from "./tea_zhanji";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tea_zj_cyxq extends cc.Component {
    @property(cc.Prefab)
    pfTrunItm: cc.Prefab = null;
    @property(cc.Prefab)
    pfTrunItm2: cc.Prefab = null;


    sv_game: cc.ScrollView = null;
    sv_trun: cc.ScrollView = null;

    curGMItem: cc.Node = null;

    gmdata: any = null;

    start () {

    }

    onLoad () {
        this.initView();
    }
    initView () {
        let r = this.node;

        this.sv_game = cc.find("sv_game", r).getComponent(cc.ScrollView);
        this.sv_trun = cc.find("sv_trun", r).getComponent(cc.ScrollView);

        this.sv_game.node.active = this.sv_trun.node.active = false;

        this.sv_game.node.on('scroll-to-bottom', this.scroll_to_bottom, this);

        this.gmdata = {};
    }


    // ======================================================================================================
    // ======================================================================================================
    // ======================================================================================================


    upData (data, page) {
        // this.gmdata = {};
        {/*
            //茶馆战绩请求实体
            //@api:2272,@type:req
            message TeaHouseRecordReq{
                int64  timeType =1;  //时间类型
                int32  pageSize =2;
                int64  selectUserId =3;//搜索id
                int32  teaHouseId =4; //茶馆id
                int32  roomId =5;//房间Id
                int32  gameType =6;//游戏类型
                int32  pageNum =7;
                int32  recordType =8;//1普通场 2金币场
                int32  originType  =9;   //地区类型
            }
            //我的茶馆战绩返回实体
            //@api:2272,@type:resp
            message MyTeaHouseRecordResp{
                int32 pageNum=1;
                int32 pageSize=2;
                int32 totalNum=3;
                int32 totalPage=4;
                float totalWinCount=5; //大赢家总次数
                int64 totalIntegralNum=6; //总积分数
                int32 totalGamblingNum   =7; //牌局总数
                repeated MyThRecord  list    =8; //详细战绩
            }
        */}
        {/*
            data

            disbandCount: 0
            gameNumCount: 1
            icon: "0"
            integralNum: Long {low: -300, high: -1, unsigned: false}
            name: "游客10b702"
            teamGroup: ""
            uid: Long {low: 1095426, high: 0, unsigned: false}
            winCount: 0
        */}

        // if (!this.gmdata) {
        //     this.gmdata = {};
        // }

        if (!this.gmdata.plr) {
            this.gmdata.plr = data;
        }

        if (!page || page<1) {
            this.gmdata.list = [];
            this.gmdata.pageNum = 1;
            this.gmdata.totalPage = 1;
            this.gmdata.pageSize = 10;
            this.gmdata.totalNum = 0;
        } else {
            this.gmdata.pageNum = page;
        }

        cc.dlog('data, page', data, page);

        let ins = Tea_ZJ.instance;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_GET_MY_RECORD_LIST);
        
        req.selectType = 1;
        // @ts-ignore
        req.timeType = ins.timeType;
        req.teaHouseId = TeaClass.instance.teaHouseId;
        // @ts-ignore
        req.recordType = ins.recordType;
        req.selectUserId = data.uid.low;
        req.pageNum = this.gmdata.pageNum;
        req.pageSize = this.gmdata.pageSize;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_GET_MY_RECORD_LIST, req, (resp)=>{
            cc.dlog('收到玩家战绩数据', resp)

            this.gmdata.pageNum = resp.pageNum;
            this.gmdata.totalPage = resp.totalPage;
            this.gmdata.pageSize = resp.pageSize;
            this.gmdata.totalNum = resp.totalNum;

            resp.list.forEach(e => {
                this.gmdata.list.push(e);
            });

            this.upGame();
        });
    }


    // 更新每个记录
    upGame() {
        this.sv_game.node.active = true;

        let scrollView = this.sv_game;

        if (this.gmdata.pageNum == 1) {
            scrollView.content.destroyAllChildren();
        }
        
        let ins = Tea_ZJ.instance;

        let gd = this.gmdata;

        for (let i = (gd.pageNum-1) * gd.pageSize; i < gd.list.length; ++i) {
            let pItem = gd.list[i];

            if (!pItem) {
                break;
            }

            let cardNode = cc.instantiate(ins.zjWoDeItemListPre);
            // @ts-ignore
            cardNode.pItem = pItem;

            // let deskName = cc.g.utils.getGameName(pItem.gameNum, pItem.origin);
            // @ts-ignore
            let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);

            let Game_Label = cc.find("Node_Content/top_Layout/NameLayout/Game_Label", cardNode).getComponent(cc.Label);

            // @ts-ignore
            if (cc.g.utils.judgeStringEmpty(Game_Label)) {
                Game_Label.string = deskName
            } else {
                Game_Label.string = deskName
            }

            let Room_Num_Label = cc.find("Node_Content/top_Layout/Room_Num_Label", cardNode).getComponent(cc.Label);
            Room_Num_Label.string = "房号:"+pItem.roomId

            let Jue_Num_Label = cc.find("Node_Content/top_Layout/Jue_Num_Label", cardNode).getComponent(cc.Label);
            Jue_Num_Label.string = "局数:"+pItem.gameNum

            let Timer_Label = cc.find("Node_Content/top_Layout/Timer_Label", cardNode).getComponent(cc.Label);
            // @ts-ignore
            Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.start.low*1000));

            // 比赛
            let Sai_Label = cc.find("Node_Content/top_Layout/Sai_Label", cardNode)
            Sai_Label.active = false;

            // 中途解散
            let JieSan_Sprite = cc.find("Node_Content/JieSan_Sprite", cardNode)
            if (pItem.isDisband) {
                JieSan_Sprite.active = false;
            } else {
                JieSan_Sprite.active = true;
            }

            // 赢label
            let Win_Label = cc.find("Node_Content/Win_Label", cardNode).getComponent(cc.Label);
            if (pItem.bigWin == 0) {
                Win_Label.node.active = false;
            } else if (pItem.bigWin == 1) {
                Win_Label.string = '大赢家'
                Win_Label.node.active = true;
            } else if (pItem.bigWin == 2) {
                Win_Label.string = '并列'
                Win_Label.node.active = true;
            }

            let contentScrollView = cc.find("Node_Content/UserScrollView", cardNode).getComponent(cc.ScrollView);
            pItem.totalFight.forEach((titem) => {
                let cardCellNode = cc.instantiate(ins.zjWoDeCellPre);
                let nameLabel = cc.find("Name_Label", cardCellNode).getComponent(cc.Label);
                // @ts-ignore
                nameLabel.string = cc.g.utils.getFormatName(titem.name, 5*2);

                let Vaule_Label = cc.find("Vaule_Label", cardCellNode).getComponent(cc.Label);
                let fight = titem.fight[0].low;
                if (fight > 0) {
                    // @ts-ignore
                    let hfight = cc.g.utils.realNum1(fight);
                    Vaule_Label.string = "+"+ hfight
                    // @ts-ignore
                    Vaule_Label.node.color = new cc.color(0xfd,0xff,0x2c,255)
                } else {
                    // @ts-ignore
                    let hfight = cc.g.utils.realNum1(fight);
                    Vaule_Label.string = hfight;
                    // @ts-ignore
                    Vaule_Label.node.color = new cc.color(0x74,0xff,0x3d,255)
                }

                contentScrollView.content.addChild(cardCellNode, 0);
            })

            let DetailButton = cc.find("Node_Content/DetailButton", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(DetailButton);
            // @ts-ignore
            cc.g.utils.addClickEvent(DetailButton, this, 'tea_zj_cyxq', 'zjDetailClicked', cardNode);

            let Share_Button = cc.find("Node_Content/Share_Button", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(Share_Button);
            // @ts-ignore
            cc.g.utils.addClickEvent(Share_Button, this, 'tea_zj_cyxq', 'zjShareClicked', pItem);

            let ZfButton = cc.find("Node_Content/ZfButton", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(ZfButton);
            // @ts-ignore
            cc.g.utils.addClickEvent(ZfButton, this, 'tea_zj_cyxq', 'zjZongFenClicked', pItem);

            // add
            scrollView.content.addChild(cardNode, 0);
        }
    }
    zjDetailClicked(event, item) {
        cc.dlog('zjDetailClicked....', item.pItem)
        let curItem = null
        if (event != null) {
            this.curGMItem = item;
            curItem = item.pItem
            cc.sys.localStorage.removeItem("ClickedZjVideoDatas")
            cc.sys.localStorage.setItem("ClickedZjVideoDatasxy", JSON.stringify(curItem));
        } else {
            curItem = item
        }

        // @ts-ignore
        cc.g.utils.btnShake();

        this.sv_game.node.active = this.sv_trun.node.active = false;

        this.upTurn(curItem);
    }
    zjShareClicked(event, pItem) {
        cc.dlog('zjShareClicked....', pItem)

        // @ts-ignore
        cc.g.utils.btnShake();
    }
    zjZongFenClicked(event, pItem) {
        cc.dlog('zjZongFenClicked....', pItem)

        // @ts-ignore
        cc.g.utils.btnShake();

        let ins = Tea_ZJ.instance;

        let dlg = cc.instantiate(ins.zjZongFenPre);
        ins.node.addChild(dlg);

        let com = dlg.getComponent('tea_zj_zf');
        com.showUiDatas(pItem);
    }

    scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview

        cc.dlog('this.gmdata', this.gmdata);

        if (this.gmdata.pageNum < this.gmdata.totalPage) {
            this.upData(this.gmdata.plr, this.gmdata.pageNum+1);
        }
    }

    // ======================================================================================================
    // ======================================================================================================
    // ======================================================================================================


    // 更新记录里的每局
    upTurn (celldata) {
        this.sv_trun.node.active = true;

        let listScrollView = this.sv_trun;

        listScrollView.content.removeAllChildren(true);

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(celldata.detailList)) {
            // 显示数据
            let jueIndex = 0;
            celldata.detailList.forEach((pItem, key) => {
                cc.dlog('pItem', pItem);

                let cardNode = cc.instantiate(this.pfTrunItm);

                // @ts-ignore
                let deskName = cc.g.utils.getGameName(celldata.gameType, celldata.origin);

                let Game_Label = cc.find("Node_Content/Game_Sprite_Bg/Game_Label", cardNode).getComponent(cc.Label);
                Game_Label.string = deskName

                let JueLabel = cc.find("Node_Content/JueLabel", cardNode).getComponent(cc.Label);
                JueLabel.string = "第"+(jueIndex + 1)+"局"

                let TimerLabel = cc.find("Node_Content/TimerLabel", cardNode).getComponent(cc.Label);
                // @ts-ignore
                //TimerLabel.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(celldata.start.low*1000));

                if (celldata.fightTime && celldata.fightTime[jueIndex]) {
                    // @ts-ignore
                    let t = new Date(i64v(celldata.fightTime[jueIndex].endTime.low)*1000);
                    // @ts-ignore
                    TimerLabel.string = cc.g.utils.getFormatTimeXXX(t, '|M|.|D| |h|:|m|:|s|');
                } else {
                    TimerLabel.string = '???';
                }
                

                let RoomLabel = cc.find("Node_Content/RoomLabel", cardNode).getComponent(cc.Label);
                RoomLabel.string = "房号:"+celldata.roomId

                let contentScrollView = cc.find("Node_Content/ItemScrollView", cardNode).getComponent(cc.ScrollView);

                let userIndex = 0;
                celldata.usrList.forEach((titem) => {
                    let cardCellNode = cc.instantiate(this.pfTrunItm2);
                    let NameLabel = cc.find("Node_Content/NameLabel", cardCellNode).getComponent(cc.Label);
                    // @ts-ignore
                    NameLabel.string = cc.g.utils.getFormatName(titem.name, 3*2);

                    let IdLabel = cc.find("Node_Content/IdLabel", cardCellNode).getComponent(cc.Label);
                    IdLabel.string = titem.uid.low;

                    let ScoreLabel = cc.find("Node_Content/ScoreLabel", cardCellNode).getComponent(cc.Label);
                    // ScoreLabel.string = pItem.fight[userIndex];

                    let fight = pItem.fight[userIndex].low;
                    if (fight > 0) {
                        // @ts-ignore
                        let rfight = cc.g.utils.realNum1(fight);
                        ScoreLabel.string = "+"+rfight
                        // @ts-ignore
                        ScoreLabel.node.color = new cc.color(0xfd,0xff,0x2c,255)
                    } else {
                        // @ts-ignore
                        let rfight = cc.g.utils.realNum1(fight);
                        ScoreLabel.string = rfight
                        // @ts-ignore
                        ScoreLabel.node.color = new cc.color(0x74,0xff,0x3d,255)
                    }

                    contentScrollView.content.addChild(cardCellNode, 0);

                    userIndex++;
                })

                let playButton = cc.find("Node_Content/playButton", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(playButton);
                // @ts-ignore
                cc.g.utils.addClickEvent(playButton, this, 'tea_zj_cyxq', 'doPalyerBtnClicked', 
                    {
                        id:celldata.replayIds[jueIndex],
                        gm:celldata.gameType,
                        origin:celldata.origin,
                    }
                );

                let Share_Button = cc.find("Node_Content/Share_Button", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(Share_Button);
                // @ts-ignore
                cc.g.utils.addClickEvent(Share_Button, this, 'tea_zj_cyxq', 'doShareBtnClicked', pItem);

                jueIndex++;

                // add
                listScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    doPalyerBtnClicked(evt, itm) {
        cc.dlog('doPalyerBtnClicked...', itm);
        cc.sys.localStorage.setItem("ClickedZjVideo", "YES");
        // @ts-ignore
        cc.g.utils.btnShake();
        // @ts-ignore
        cc.g.hallMgr.tryPlaybBack({
            replayId:itm.id,
            gameType:itm.gm,
            origin:itm.origin,
            clubId: TeaClass.instance.teaHouseId,
            //idx:null,
            //clubId:this.clubInfo ? this.clubInfo.clubId : null,
            //bjID:this.clubInfo ? this.bjuid : null,
        });
    }

    doShareBtnClicked() {
        cc.dlog('doShareBtnClicked...')

        // @ts-ignore
        cc.g.utils.btnShake();
    }
    // ======================================================================================================
    // ======================================================================================================
    // ======================================================================================================

    clearCache() {
        cc.sys.localStorage.removeItem("NavTabKey")
        cc.sys.localStorage.removeItem("WeekIndex")
        cc.sys.localStorage.removeItem("ClickedZjVideo")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatasxy")
        cc.sys.localStorage.removeItem("ClickedZjVideoDatas")
    }

    // 关闭
    onBtnClose (event, customEventData) {
        cc.dlog('onBtnClose');
        // this.clearCache()
        // @ts-ignore
        cc.g.utils.btnShake();

        if (this.curGMItem) {
            this.sv_game.node.active = true;
            this.sv_trun.node.active = false;

            this.curGMItem = null;
        } else {
            this.node.destroy();
        }
    }
}
