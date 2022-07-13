let Def = {};

// 玩家数量数据
Def.PlayerNumData = {
    37:{
        xx:2,       //人数下限
        sx:4,       //人数上限   
        hcn:13,     //手牌数量
        tcn:{       //人数-底牌数量
            0:1*54,
        },
        jpq:{       //记牌器
            0:1*4,
        },
    },
    38:{
        xx:2,
        sx:4,   
        hcn:19,
        tcn:{
            0:4*54,
        },
        jpq:{
            0:4*4,
        },
    },
    39:{
        xx:2,
        sx:7,
        hcn:19,
        tcn:{
            0:4*54,
            5:5*54,
            6:6*54,
            7:7*54,
        },
        jpq:{
            0:4*4,
            5:5*4,
            6:6*4,
            7:7*4,
        },
    },
    40:{
        xx:2,
        sx:7,
        hcn:19,
        tcn:{
            0:7*54,
        },
        jpq:{
            0:7*4,
        },
    },
    41:{
        xx:2,
        sx:2,
        hcn:13,
        tcn:{
            0:1*54,
        },
        jpq:{
            0:1*4,
        },
    },
    42:{
        xx:2,
        sx:3,
        hcn:13,
        tcn:{
            0:1*54,
        },
        jpq:{
            0:1*4,
        },
    },
    43:{
        xx:2,
        sx:4,
        hcn:13,
        tcn:{
            0:1*54,
        },
        jpq:{
            0:1*4,
        },
    },
    44:{
        xx:3,
        sx:3,
        hcn:13,
        tcn:{
            0:1*54,
        },
        jpq:{
            0:1*4,
        },
    },
    45:{
        xx:4,
        sx:4,
        hcn:13,
        tcn:{
            0:1*54,
        },
        jpq:{
            0:1*4,
        },
    },
};

// 起始手牌数量
Def.MaxHandCard = 19;

// 起始手牌数量
Def.StartCardNum = 20;

// 总牌数量
Def.ToltalCardNum = 80;

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
        v: 1,
        s: "发牌",
    },

    Play: {
        v: 2,
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
OP_准备 = 1 << 0
OP_开始
OP_庄家
OP_发牌
OP_定头家
OP_CAN打牌
OP_打牌
OP_过
OP_局数
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
        v: 1 << 3,
        s: '庄家',
    },

    SendCard:{
        v: 1 << 4,
        s: '发牌',
        t: 2.1,
    },

    Frist:{
        v: 1 << 5,
        s: '定头家',
        t: 0,
    },

    CanOutCard:{
        v: 1 << 6,
        s: 'CAN打牌',
        t: 1.0,
    },
    OutCard:{
        v: 1 << 7,
        s: '打牌',
        t: 0.25,
    },

    Pass:{
        v: 1 << 8,
        s: '过',
        t: 0.25,
    },

    CurJushu:{
        v: 1 << 9,
        s: '当前局数',
    },

    WinLose:{
        v: 1 << 11,
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

    GuanZhan:{
        v: 2000,
        s: '观战',
        isloc: true, //客户端自用
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


Def.ComType = {
    DAN:1,
    DUI:2,
    SHUN:3,
    LIAND:4,
    SAN:5,
    SAN2:6,
    SAND:7,
    FJ:8,
    FJ4:9,
    FJ2D:10,
    ZD:11,
    LZD:12,
};

// ====================================================================================

module.exports = Def;
