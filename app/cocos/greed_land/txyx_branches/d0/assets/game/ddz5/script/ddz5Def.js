let Def = {};

// 起始手牌数量
Def.StartCardNum = 21;

// 总牌数量
Def.ToltalCardNum = 80;

// 操作时间
Def.OptTime = 10;

// 消息 C2S
Def.C2S = {
    READY: 1 << 0,  //准备
};

// 房间状态
Def.RMSTA = {
    Free: {
        v: 0,
        s: "空闲",
    },

    SendCard: {
        v: 2,
        s: "发牌",
    },

    Jiao: {
        v: 3,
        s: "叫地主",
    },

    Dao: {
        v: 4,
        s: "倒",
    },

    La: {
        v: 5,
        s: "拉",
    },

    Geng: {
        v: 6,
        s: "梗",
    },

    Han: {
        v: 7,
        s: "喊",
    },

    Play: {
        v: 8,
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
        v: 1,
        s: "准备",
    },

    Play: {
        v: 2,
        s: "玩牌",
    },
};


// 玩家操作
Def.PlayerOpt = {
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
        t: 3,
    },

    CanJiao:{
        v: 1 << 4,
        s: '可叫地主',
    },
    Jiao:{
        v: 1 << 5,
        s: '叫地主',
    },
    DingDizhu:{
        v: 1 << 6,
        s: '定地主',
        t: 1.7,
    },

    CanDao:{
        v: 1 << 7,
        s: '可倒',
    },
    Dao:{
        v: 1 << 8,
        s: '倒',
        t: 2,
    },

    CanLa:{
        v: 1 << 9,
        s: '可拉',
    },
    La:{
        v: 1 << 10,
        s: '拉',
        t: 1,
    },

    CanGeng:{
        v: 1 << 11,
        s: '可梗',
    },
    Geng:{
        v: 1 << 12,
        s: '梗',
        t: 1,
    },

    CanHan:{
        v: 1 << 13,
        s: '可喊',
    },
    Han:{
        v: 1 << 14,
        s: '喊',
        t: 1,
    },


    CanOutCard:{
        v: 1 << 15,
        s: '可打牌',
    },
    OutCard:{
        v: 1 << 16,
        s: '打牌',
        t: 1.0,
    },
    
    Pass:{
        v: 1 << 18,
        s: '过',
    },

    AnDizhu:{
        v: 1 << 19,
        s: '暗地主',
    },

    CurJushu:{
        v: 1 << 20,
        s: '当前局数',
    },

    WinLose:{
        v: 1 << 22,
        s: '输赢',
        t: 1.0,
    },

    DiFen:{
        v: 1 << 23,
        s: '底分',
        t: 1.0,
    },

    Liangdipai:{
        v: 1 << 24,
        s: '亮底牌',
        t: 2.0,
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

// 身份操作
//expand[0]身份信息  0 初始化  1 地主 2 农民 3 暗地主
//expand[1]叫地主   0 初始化  1 不叫地主 2叫地主
//expand[2]倒拉操作值 0 初始化  1 不倒  2 倒 3跟倒
//expand[3]梗 0 初始化  1 梗   2 喊
//expand[4]倒拉操作值 0 初始化  1 不拉  2 拉
Def.SFCZ = {
    NO: 0,
    DZ: 1,
    NM: 2,
    ADZ: 3,
    JIAO: 2,
    JIAONO: 1,
    DAO: 2,
    DAONO: 1,
    GENDAO: 3,
    LA: 2,
    LANO: 1,
    GENG: 1,
    HAN: 2,
}

// 操作按钮KEY
Def.OBK = {
    jiao:'jiao',
    jiaono:'jiaono',
    dao:'dao',
    daono:'daono',
    la:'la',
    lano:'lano',
    geng:'geng',
    han:'han',
    xuanpai:'xuanpai',
    pass:'pass',
    rexuan:'rexuan',
    tishi:'tishi',
    chupai:'chupai',
}

// 牌型
Def.ComType = {
    DAN:1,  //单张
    DUI:2,  //对子
    SHUN:3, //顺子
    LIAND:4,//连对
    SAN:5,  //三同
    SAN1:6, //三带一
    //SAN2:61,
    //SAND:62,
    FJ:7,   //飞机
    FJCB:8, //飞机带翅膀
    //FJ4:81,
    //FJ2D:82,
    ZD:9,   //炸弹
    ZDW :10,//王炸
    ZD8 :11,//八个头
    ZDTW:12,//天王炸
};

// ====================================================================================

module.exports = Def;


/*
//房间的状态
const (
  等待 = iota
  准备
  发牌
  叫地主
  room_倒
  room_拉
  room_梗
  room_喊手牌
  自由
  认输
)

//玩家操作
const (
  OP_准备 = 1 << iota
  OP_退出
  OP_庄家
  OP_发牌
  OP_CAN叫地主
  OP_叫地主
  OP_定地主
  OP_CAN倒
  OP_倒
  OP_CAN拉
  OP_拉
  OP_CAN梗
  OP_梗
  OP_CAN喊手牌
  OP_喊手牌
  OP_CAN打牌
  OP_打牌
  OP_CAN过
  OP_过
  OP_暗地主
  OP_局数
  OP_销毁
  OP_输赢
)
*/
