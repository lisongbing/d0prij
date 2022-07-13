let D2Def = {};

// 起始手牌数量
D2Def.StartCardNum = 20;

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
        t: 2.3,
    },

    Can3l4k:{
        v: 1 << 4,
        s: '可三拢四坎',
    },
    Do3l4k:{
        v: 1 << 5,
        s: '三拢四坎',
        t: 0.3,
    },

    CanHeiBai:{
        v: 1 << 25,
        s: '可黑摆',
    },
    HeiBai:{
        v: 1 << 26,
        s: '黑摆',
        t: 0.3,
    },

    CanSanZhao:{
        v: 1 << 28,
        s: '可三招',
    },
    SanZhao:{
        v: 1 << 29,
        s: '三招',
        t: 0.3,
    },


    Long:{
        v: 1 << 6,
        s: '拢',
        t: 0.4,
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
        v: 1 << 9,
        s: '摸牌',
        t: 0.6,
    },

    PubCard:{
        v: 1 << 10,
        s: '堂出',
        t: 0.5,
    },

    CanOutCard:{
        v: 1 << 11,
        s: '可打牌',
    },
    OutCard:{
        v: 1 << 12,
        s: '打牌',
        t: 0.5,
    },

    CanChi:{
        v: 1 << 13,
        s: '可吃牌',
    },
    Chi:{
        v: 1 << 14,
        s: '吃牌',
        t: 0.3,
    },

    CanPeng:{
        v: 1 << 15,
        s: '可碰',
    },
    Peng:{
        v: 1 << 16,
        s: '碰',
        t: 0.3,
    },

    CanZhao:{
        v: 1 << 17,
        s: '可招',
    },
    Zhao:{
        v: 1 << 18,
        s: '招',
        t: 0.4,
    },

    CanHu:{
        v: 1 << 19,
        s: '可胡',
    },
    Hu:{
        v: 1 << 20,
        s: '胡',
        t: 0.3,
    },
    
    Pass:{
        v: 1 << 21,
        s: '过',
    },

    CurJushu:{
        v: 1 << 22,
        s: '当前局数',
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
    _34: 0,
    heibai: 1,
    _3zhao: 2,
    bao: 3,
    chi: 4,
    hu: 5,
    pass: 6,
}

// ====================================================================================

module.exports = D2Def;
