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

    SendCard: {
        v: 2,
        s: "发牌",
    },

    Play: {
        v: 3,
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
OP_准备 = 0 << iota
OP_退出1
OP_庄家2
OP_发牌3
OP_定头家4
OP_CAN打牌5
OP_打牌6
OP_过7
OP_局数8
OP_输赢9
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

    Zhuang:{
        v: 1 << 2,
        s: '庄家',
    },

    SendCard:{
        v: 1 << 3,
        s: '发牌',
        t: 2.5,
    },

    Frist:{
        v: 1 << 4,
        s: '定头家',
        t: 0,
    },

    CanOutCard:{
        v: 1 << 5,
        s: 'CAN打牌',
    },
    OutCard:{
        v: 1 << 6,
        s: '打牌',
        t: 0.5,
    },

    Pass:{
        v: 1 << 7,
        s: '过',
        t: 0.25,
    },

    CurJushu:{
        v: 1 << 8,
        s: '当前局数',
    },

    WinLose:{
        v: 1 << 9,
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

/*
 UNUSE = iota 0
  单张
  对子
  顺子
  连对
  三不带
  三带二
  飞机
  飞机带翅膀
  炸弹
  三A炸
*/
Def.ComType = {
    DAN:1,  //单张
    DUI:2,  //对子
    SHUN:3, //顺子
    LIAND:4,//连对
    SAN:5,  //三同
    SAN2:6, //三带二
    FJ:7,   //飞机
    FJCB:8,  //飞机带翅膀
    SID3:9,  //四带三
    ZD:10,  //炸弹
    AAA:11, //三A炸
};

// ====================================================================================

module.exports = Def;
