let D2Def = {};

// 起始手牌数量 
D2Def.StartCardNum = 20;    // 20 14

// 总牌数量
D2Def.ToltalCardNum = 80;

// 牌组列数
D2Def.GRPNUM = 10;

// 操作时间
D2Def.OptTime = 20;


// 一些时间值
D2Def.time = {
    tangda: 0, //堂出 打出的时间
},

// 消息 C2S
D2Def.C2S = {
    READY: 1 << 0,  //准备
    /*   
    EXIT: 1 << 1,
    OP: 1 << 2,
    DEAL: 1 << 3,
    DISCARD: 1 << 4,
    PONG: 1 << 5,
    WIN: 1 << 6,
    CONCEALED_KONG: 1 << 7,
    EXPOSED_KONG: 1 << 8,
    PASS: 1 << 9,
    EXCLUDE: 1 << 10,
    WIND: 1 << 11,
    RAIN: 1 << 12,
    DRAW: 1 << 13,
    DEALER: 1 << 14,
    SWAP: 1 << 15,
    POINT_KONG: 1 << 16,
    TRANSFER: 1 << 17,
    WIN_RESULT: 1 << 18,//包括查叫
    START_GAME: 1 << 19, //开始游戏
    GAME_NUM: 1 << 20, //房卡场，游戏局数
    */
};

// 房间状态
D2Def.RMSTA = {
    Free: {
        v: 0,
        s: "准备",
    },

    SendCard: {
        v: 1,
        s: "发牌",
    },

    PreDo: {
        v: 2,
        s: "预处理",
    },

    Play: {
        v: 3,
        s: "打牌",
    },
};
D2Def.RMSTAStr = {};
{
    for (const k in D2Def.RMSTA) {
        const e = D2Def.RMSTA[k];
        D2Def.RMSTAStr[e.v] = e.s;
    };
}


// 玩家状态
D2Def.PlayerSta = {
    Free: {
        v: 0,
        s: "空闲",
    },

    Ready: {
        v: 1 << 0,
        s: "准备",
    },

    Play: {
        v: 1 << 2,
        s: "玩牌",
    },
};


// 玩家操作
D2Def.PlayerOpt = {
    Ready:{
        v: 1 << 0,
        s: '准备',
    },

    Zhuang:{
        v: 1 << 2,
        s: '庄家',
    },

    SendCard:{
        v: 1 << 3,
        s: '发牌',
        t: 2.0,
    },

    QuanPai:{
        v: 1 << 4,
        s: '圈牌',
    },

    CanBao:{
        v: 1 << 7,
        s: '可爆牌',
    },
    Bao:{
        v: 1 << 8,
        s: '爆牌',
    },

    MoCard:{
        v: 1 << 5,
        s: '摸牌',
        t: 0.6,
    },

    PubCard:{
        v: 1 << 6,
        s: '堂出',
        t: 0.6,
    },

    CanOutCard:{
        v: 1 << 7,
        s: '可打牌',
    },
    OutCard:{
        v: 1 << 8,
        s: '打牌',
        t: 0.5,
    },

    CanChi:{
        v: 1 << 9,
        s: '可吃牌',
    },
    Chi:{
        v: 1 << 10,
        s: '吃牌',
        t: 0.3,
    },

    CanPeng:{
        v: 1 << 11,
        s: '可对',
    },
    Peng:{
        v: 1 << 12,
        s: '对',
        t: 0.3,
    },

    Yu:{
        v: 1 << 13,
        s: '雨',
        t: 1.1,
    },

    CanZhao:{
        v: 1 << 14,
        s: '可开',
    },
    Zhao:{
        v: 1 << 15,
        s: '开',
        t: 1,
    },

    CanHu:{
        v: 1 << 16,
        s: '可胡',
    },
    Hu:{
        v: 1 << 17,
        s: '胡',
        t: 0.3,
    },
    
    Pass:{
        v: 1 << 18,
        s: '过',
    },

    CurJushu:{
        v: 1 << 19,
        s: '当前局数',
    },

    SomeCanop:{
        v: 1 << 21,
        s: '有玩家可以操作',
    },
    

    JiesanVote:{
        v: 996,
        s: '解散投票',
    },
    AskJiesan:{
        v: 997,
        s: '申请解散',
    },
    BackHall:{
        v: 995,
        s: '返回大厅',
    },
};
D2Def.PlayerOptStr={};
{
    for (const k in D2Def.PlayerOpt) {
        const e = D2Def.PlayerOpt[k];
        D2Def.PlayerOptStr[e.v] = e;
    };
}


// 操作按钮KEY
D2Def.OBK = {
    bao: 'bao',
    kai: 'kai',
    dui: 'dui',
    hu: 'hu',
    chi: 'chi',
    guo: 'guo',
}

/*
V天胡 1
V地胡 2
V抬炮 3
V堂出 4
V自摸 5
V昆胡 6
V漂胡 7
V清一色 8
V圈胡 9
V双圈 10


UNUSE = iota=0
V天胡 1
V地胡 2
V抬炮 3
V堂出 4
V自摸 5
V昆胡 6
V漂胡 7
V清一色 8
V圈胡 9
V双圈 10
V滚番 11
V大胡 12
V上台 13

*/

// ====================================================================================

module.exports = D2Def;
