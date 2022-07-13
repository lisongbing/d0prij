
cc.Class({
    extends: cc.Component,

    properties: {
        // 战绩条目玩家预制
        playerItem: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '战绩详情'; //d2Page

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

    // #BE5B36 #2B881E
    init: function (pView, idx) {
        this.phView = pView;
        this.idx = idx;

        this.node.parent =  this.phView.node.parent;

        this.ifoDetail = this.phView.hisInfo[this.phView.curGameId][this.phView.origin][idx];

        this.initView();
    },

    // 更新对话框界面
    initView: function (info) {
        let r = this.node.getChildByName('Node_ctt');

        let ifos = this.ifoDetail;

        // 标签
        let Sprite_gmName = cc.find("Sprite_gmName", r).getComponent(cc.Sprite);
        Sprite_gmName.spriteFrame = this.phView.atlas.getSpriteFrame('crtrm_gn_'+ this.phView.curGameId +'_'+this.phView.origin+'_'+'1');

        // 房间号
        let Label_roomID = cc.find("Label_roomID", r).getComponent(cc.Label);
        Label_roomID.string = '房号：' + ifos.roomId;

        // 局数
        let Label_turn = cc.find("Label_turn", r).getComponent(cc.Label);
        Label_turn.string = '共：' + ifos.num + '局';

        // 名字
        let Node_names = cc.find("Node_names", r);
        let tf = ifos.totalFight;
        for (let i = 0; i < 5; ++i) {
            let name = cc.find("Label_n"+i, Node_names);
            if (! name) {
                break;
            }

            if (! tf[i]) {
                name.active = false;
                continue;
            }

            name.getComponent(cc.Label).string = tf[i].name;
            name.color = (tf[i].fight[0] > 0) ? new cc.Color(0xa0, 0x21, 0x13) : new cc.Color(0xd8, 0x66, 0x10);
        }

        // 玩家滚动视图
        this.svDetails = r.getChildByName('ScrollView_details').getComponent(cc.ScrollView);
        this.upDetails();
    },

    //
    upDetails: function () {
        let ifos = this.ifoDetail;
        let df = this.ifoDetail.detailFight;
        let replayIds = this.ifoDetail.replayIds;

        let ctt = this.svDetails.content;
        ctt.removeAllChildren();
        for (let i = 0; i < ifos.num; ++i) {
            let itm = cc.instantiate(this.playerItem);

            // 序号
            let Label_trun = cc.find("Label_trun", itm).getComponent(cc.Label);
            Label_trun.string = (i+1);

            // 分数
            let hbox = cc.find("Node_scos", itm);
            for (let j = 0; j < 5; ++j) {
                let sco = cc.find("Label_sco"+j, hbox);
                if (! sco) {
                    break;
                }

                if (! df[j]) {
                    sco.active = false;
                    continue;
                }

                // 分数
                let fs = df[j].fight[i];
                sco.getComponent(cc.Label).string = fs > 0 ? '+'+fs : fs;
                // sco.color = (fs > 0) ? cc.Color.GREEN : cc.Color.RED;
                sco.color = (fs > 0) ? new cc.Color(0x55, 0xab, 0x2e) : new cc.Color(0xf1, 0x53, 0x48);
            }

            cc.find("Button_huifang", itm).getComponent(cc.Button).interactable = true;

            cc.g.utils.addClickEvent(cc.find("Button_share", itm), this.node, 'phDetailsDlg', 'onBtnShar', );
            cc.g.utils.addClickEvent(cc.find("Button_huifang", itm), this.node, 'phDetailsDlg', 'onBtnPlaybBack', replayIds[i]);

            ctt.addChild(itm);
        }
        ctt.getComponent(cc.Layout).updateLayout();

        this.svDetails.scrollToTop();
    },

    // 关闭
    onBtnClose: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose'));

        this.node.removeFromParent();
    },

    // 返回
    onBtnBack: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose'));

        this.node.removeFromParent();
        this.phView.node.active = true;
    },

    // 分享
    onBtnShar: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnShar 分享'));
    },

    // 回放
    onBtnPlaybBack: function (event, replayId) {
        this.phView.onBtnPlaybBack(replayId);
    },

    
    //
    ___f:function () {
        {/*
            根据replayIds 获得每局的回放唯一Id(此处设置为:replayUid)
            2.获得replayUid后，构造一个json对象
            {"uid":replayUid},向服务器http://120.77.173.104:11111/getrecord用post方法提交,服务器会返回json对象{"path":pathvalue},
            解析出pathvalue后,pathvaule就是数据的存放位置，也就是一个服务器地址，用get方法获得回放数据:数据也是个json对象
            我这里就用结构体表示了,有这个结构体去解析就行了!!
            结构体:
            type GameReCord struct {
                Uid          string                        `json:"uid"`            //每局的唯一Id
                Rule         []int32                       `json:"rule"`           //房间规则
                CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                RoomId       int32                         `json:"room_id"`        //房间Id
                Players      []*PlayerBase                 `json:"players"`        //所有玩家顺序:庄家,下家,上家,数底
                BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                Result       *pb.BigTwoPlayerResultListNtf `json:"result"`         //结算的结果
            }
            //玩家的基础属性
            type PlayerBase struct {
                Uid       int64  `json:"uid"`
                Name      string `json:"name"`
                Icon      string `json:"icon"`
                Sex       int32  `json:"sex"`
                HandCards []int8 `json:"hand_cards"`
            }
            type Op struct {
                Oper   int64   `json:"oper"`    //操作者
                K      int32   `json:"k"`       //操作的动作
                V      []int64 `json:"v"`       //操作的值
            }

            // @api:1024,@type:resp
            type BigTwoPlayerResultListNtf struct {
                Huer        int64               `protobuf:"varint,1,opt,name=huer" json:"huer,omitempty"`
                Dianpaoer   int64               `protobuf:"varint,2,opt,name=dianpaoer" json:"dianpaoer,omitempty"`
                Remaincards []int32             `protobuf:"varint,3,rep,packed,name=remaincards" json:"remaincards,omitempty"`
                List        []*BigTwoResultInfo `protobuf:"bytes,4,rep,name=list" json:"list,omitempty"`
            }
            希望你能看明白，不明白在讨论吧！！！
        */}

        // 跑得快
        {/*
            我这里就用结构体表示了,有这个结构体去解析就行了!!
            结构体:
            type GameReCord struct {
                Uid          string                        `json:"uid"`            //每局的唯一Id
                Rule         []int32                       `json:"rule"`           //房间规则
                CurGameNum   uint8                          `json:"cur_game_num"`   //当前是第几局
                TotalGameNum uint8                          `json:"total_game_num"` //总共有多少局
                RoomId       int32                         `json:"room_id"`        //房间Id
                Total        uint8                         `json:"total"`          //编号
                Origin       int32                         `json:"origin"`         //地区
                Banker       int8                          `json:"banker"`        //庄家deskId
                Players      []*PlayerBase                 `json:"players"`        //所有玩家顺序:庄家,下家,上家,数底
                BottomCard   []int8                        `json:"bottom_card"`    //牌底的牌
                PlayerOps    []*Op                         `json:"player_ops"`     //操作信息
                Result       *pb.PdkPlayerResultListNtf `json:"result"`         //结算的结果
            }
            //玩家的基础属性
            type PlayerBase struct {
                Uid       int64  `json:"uid"`  //玩家唯一Id
                Name      string `json:"name"` //昵称
                Icon      string `json:"icon"`//图标
                Sex       int32  `json:"sex"`  //性别
                DeskId    int8   `json:"desk_id"` //位置Id
                HandCards []int8 `json:"hand_cards"`//手牌
            }
            type Op struct {
                Oper   int64   `json:"oper"`    //操作者
                K      int32   `json:"k"`       //操作的动作
                V      []int64 `json:"v"`       //操作的值
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
    },
});
