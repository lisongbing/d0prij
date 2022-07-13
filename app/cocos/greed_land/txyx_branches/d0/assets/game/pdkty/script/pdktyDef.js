let Def = {};

// 起始手牌数量
Def.MaxHandCard = 16;

// 起始手牌数量
Def.StartCardNum = 16;

// 总牌数量
Def.ToltalCardNum = 48;

// 操作时间
Def.OptTime = 10;

// 0-53(52 53) 1-4 方片，梅花，红桃，黑桃



// 房间状态
Def.RMSTA = {
    Free: {
        v: 0,
        s: "准备",
    },

    DaNiao: {
        v: 2,
        s: "打鸟",
    },

    PiaoFen: {
        v: 3,
        s: "飘分",
    },

    SendCard: {
        v: 4,
        s: "发牌",
    },

    Play: {
        v: 5,
        s: "打牌",
    },
};

Def.RMSTAStr = {};
{
    for (const k in Def.RMSTA) {
        const e = Def.RMSTA[k];
        Def.RMSTAStr[e.v] = e.s;
    };
}


// 玩家状态
Def.PlayerSta = {
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

/*
OP_准备 = 1 << iota 0
OP_开始 1
OP_退出 2
OP_CAN打鸟 3
OP_打鸟 4
OP_CAN飘分 5
OP_飘分 6
OP_庄家 7
OP_发牌 8
OP_定头家 9
OP_CAN打牌 10
OP_打牌 11
OP_过 12
OP_局数 13
OP_输赢 14
*/

// 玩家操作
Def.PlayerOpt = {
    Ready:{
        v: 1 << 0,
        s: '准备',
    },

    Start:{
        v: 1 << 1,
        s: '开始',
    },

    CanDaNiao:{
        v: 1 << 3,
        s: 'CAN打鸟',
    },
    DaNiao:{
        v: 1 << 4,
        s: '打鸟',
        t: 0.2,
    },

    CanPiaofen:{
        v: 1 << 5,
        s: 'CAN飘分',
    },
    Piaofen:{
        v: 1 << 6,
        s: '飘分',
        t: 0.2,
    },

    Zhuang:{
        v: 1 << 7,
        s: '庄家',
    },

    SendCard:{
        v: 1 << 8,
        s: '发牌',
        t: 2.5,
    },

    Frist:{
        v: 1 << 9,
        s: '定头家',
        t: 0,
    },

    CanOutCard:{
        v: 1 << 10,
        s: 'CAN打牌',
    },
    OutCard:{
        v: 1 << 11,
        s: '打牌',
        t: 0.5,
    },

    Pass:{
        v: 1 << 12,
        s: '过',
        t: 0.25,
    },

    CurJushu:{
        v: 1 << 13,
        s: '当前局数',
    },

    WinLose:{
        v: 1 << 14,
        s: '输赢',
        t: 1.0,
    },

    
    RoomOwner:{
        v: 994,
        s: '房主变更',
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
Def.PlayerOptStr={};
{
    for (const k in Def.PlayerOpt) {
        const e = Def.PlayerOpt[k];
        Def.PlayerOptStr[e.v] = e;
    };
}


// 操作按钮KEY
Def.OBK = {
    tip: 0,
    out: 1,
    pass: 2,
}


//牌型
/*
const (
    单张 1
    对子 2
    顺子 3
    连对 4
    三同 5
    三带一 6
    三带二 7
    飞机少带 8
    飞机带翅膀 9
    四不带 10
    四带一 11
    四带二 12
    四带三 13
    炸弹 14
    三K炸 15
    三A炸 16
)
*/


Def.ComType = {
    DAN:1,  //单张
    DUI:2,  //对子
    SHUN:3, //顺子
    LIAND:4,    //连对
    SAN:5,  //三同
    SAN1:6,  //三带一
    SAN2:7, //三带二

    FJ:8,   //飞机
    FJCB:9,  //飞机带翅膀

    SI:10,    //四带
    SID1:11,  //四带一
    SID2:12,  //四带二
    SID3:13,  //四带三

    ZD:14,  //炸弹
    KKK:15, //三K炸
    AAA:16, //三A炸
};

// ====================================================================================

module.exports = Def;
