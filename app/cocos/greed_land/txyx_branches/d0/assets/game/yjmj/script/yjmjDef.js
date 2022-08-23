let MajhDef = {};

// 操作时间
MajhDef.OptTime = 20;

// 2 人的适合
MajhDef.colTwoMax = 18;
MajhDef.rowTwoMax = 2;

MajhDef.colMax = 8;
MajhDef.rowMax = 2;

// 第一行 6 8 10 12
MajhDef.colLeftAndRightMax = 6;
// 最多4行
MajhDef.rowLeftAndRightMax = 4;

// 第一行 10 12 18
MajhDef.colTopAndBottomMax = 10;


MajhDef.qipaiStart = 30;
MajhDef.qipaiTwoStart = 400;
MajhDef.jiesuanDouHao = '、 ';

//
// 不飘    = 1
// 随飘    = 2
// 定飘    = 3
// 无封顶   = 4
// 四番封顶  = 5
// 五番封顶  = 6
// 六番封顶  = 7
// 七番封顶  = 8
// 点炮可胡  = 10
// 自摸胡   = 11
// 无红中   = 12
// 四红中   = 13
// 八红中   = 14
// 十一红中  = 15
// 十二红中  = 16
// 开局定缺  = 18
// 胡牌缺一门 = 19
// 两方麻将  = 20
// 换三张   = 21
// 自摸加番  = 22
// 开启定位  = 36
// 冠军房费  = 32
// 均摊房费  = 33
// 房主房费  = 34
// 俱乐部房费 = 35

MajhDef.SendCardPos = [
    {
        moveBy: {
            x: 0,
            y: 0//40
        },
        moveTo: {
            x: 131,
            y: 0
        }
    },
    {
        moveBy: {
            x: 0,//10
            y: 0,
        },
        moveTo: {
            x: 10,
            y: 45,//24,
            z: 60,//30, // 动画移动最后位置, 步长
        },
        moveZhiBy: {
            x: -60,
        },
        moveZhiTo: {
            y: 50,
        }
    },
    {
        moveBy: {
            x: 820, // 900
            y: 20
        },
        moveTo: {
            x: 59,
            y: 0
        },
        moveZhiBy: {
            x: 820,
            y: 20
        },
    },
    {
        moveBy: {
            x: 190, // 剪去
            y: 710,
        },
        moveTo: {
            x: 10,//5, //- 7
            y: 45,//24, //- 30
            z: 30, // 动画移动最后位置, 步长
        },
        moveZhiBy: {
            x: 150,
        },
        moveZhiTo: {
            y: 45,
        }
    }
]

// 2 个玩家时 用
MajhDef.twoQiCardPos = [
    {
        moveBy: {
            x: 0,
            y: 110,//130,
        },
        moveTo: {
            x: 76,
            y: 86,
        }
    },
    {
        moveBy: {
            x: 0,
            y: 0,
        },
        moveTo: {
            x: 0,
            y: 0
        }
    },
    {
        moveBy: {
            x: 880,
            y: 40, //16
        },
        moveTo: {
            x: 68,
            y: 80
        },
        moveZhiBy: {
            x: 880,
            y: 50,
        },
        moveZhiTo: {
            x: 78,
            y: 88
        }
    },
    {
        moveBy: {
            x: 0,
            y: 0,
        },
        moveTo: {
            x: 0,
            y: 0
        }
    }
]

// 3  4 玩家
MajhDef.QiCardPos = [
    {
        moveBy: {
            x: 0,
            y: 120,//130
        },
        moveTo: {
            x: 76,
            y: 86 // -
        },
        moveZhiBy: {
            x: 0,
            y: 114,//130
        },
    },
    {
        moveBy: {
            x: 70,
            y: 10,
        },
        moveTo: {
            x: 3, // -
            y: 60,
            z: 94
        }
    },
    {
        moveBy: {
            x: 500,
            y: 35,
        },
        moveTo: {
            x: 68,
            y: 80
        },
        moveZhiBy: {
            x: 545,//500,
            y: 50,
        },
        moveZhiTo: {
            x: 78,
            y: 88
        }
    },
    {
        moveBy: {
            x: 220,
            y: 500,
        },
        moveTo: {
            x: 3, // -
            y: 60,
            z: 94
        }
    }
]



MajhDef.PongCardPos = [
    {
        moveBy: {
            x: 0,
            y: 0
        },
        moveTo: {
            x: 190,
            y: 0
        }
    },
    {
        moveBy: {
            x: 30,
            y: -70,
        },
        moveTo: {
            x: 30,
            y: 0
        },
        moveByZhi: {
            x: -50,
        },
    },
    {
        moveBy: {
            x: 900,//950,
            y: 0
        },
        moveTo: {
            x: 0,
            y: 0
        },
        moveZhiBy: {
            x: 900,
            y: 0
        },
    },
    {
        moveBy: {
            x: 200,
            y: 710,
        },
        moveByZhi: {
            x: 150,
            y: 750,
        },
        moveTo: {
            x: 35,
            y: 0
        }
    }
]
//
//
// MajhDef.GangCardPos = [
//     {
//         moveBy: {
//             x: 0,
//             y: 0
//         },
//         moveTo: {
//             x: 250,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 0,
//             y: 0,
//         },
//         moveTo: {
//             x: 25, // -
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 460,
//             y: 0
//         },
//         moveTo: {
//             x: 130,
//             y: 0
//         }
//     },
//     {
//         moveBy: {
//             x: 44,
//             y: 380,
//         },
//         moveTo: {
//             x: 20, // -
//             y: 0
//         }
//     }
// ]
//
//
MajhDef.HuCardPos = [
    {
        moveTo: {
            x: 40,
            y: 0,
        }
    },
    {
        moveTo: {
            x: 10,
            y: 55,
        },
        moveZhiTo: {
            x: 10,
            y: 80,
        }
    },
    {
        moveTo: {
            x: 40,
            y: 0,
        }
    },
    {
        moveTo: {
            x: 30,
            y: 110,
        }
    }
]
//

MajhDef.AnQueCardPos = [
    {
        moveTo: {
            x: -472,
            y: -119
        },
    },
    {
        moveTo: {
            x: 475,
            y: 94,
        },
    },
    {
        moveTo: {
            x: 376,
            y: 265
        },
    },
    {
        moveTo: {
            x: -487,
            y: 94,
        },
    }
]


MajhDef.AnQueCardStartPos = [
    {
        moveTo: {
            x: 0,
            y: -89,
        },
    },
    {
        moveTo: {
            x: 188,
            y: 51,
        },
    },
    {
        moveTo: {
            x: 0,
            y: 173
        },
    },
    {
        moveTo: {
            x: -188,
            y: 50,
        },
    }
]

MajhDef.hcZhuangPos = [
    {
        moveBy: {
            x: 75,
            y: 0,
        },
    }
]


MajhDef.hcMultHuTiPos = [
    {
        moveBy: {
            x: 70,
            y: 60,
            z: 90,
            w: 80,
            space: 15,
        },
    }

]


MajhDef.hcJieSuanPos = [
    {
        moveBy: {
            x: 79,
            y: 0,
        },
        moveTo: {
            x: 20,
            y: 0
        }
    },
]


MajhDef.hcJieSuanMingTang = [
    {
        txt: '', // 0
    },
    {
        txt: '平胡', //1
    },
    {
        txt: '无听用', //2
    },
    {
        txt: '大对子',  //3
    },
    {
        txt: '清一色', //4
    },
    {
        txt: '小七对', //5
    },
    {
        txt: '龙七对', //6
    },
    {
        txt: '归', //7
    },
    {
        txt: '门清', //8
    },
    {
        txt: '中张', //9
    },
    {
        txt: '自摸', //10
    },
    {
        txt: '杠后炮', //11
    },
    {
        txt: '抢杠胡', //12
    },
    {
        txt: '海底捞', //13
    },
    {
        txt: '金钩钩', //14
    },
    {
        txt: '杠上开花', //15
    },
    {
        txt: '天胡', //16
    },
    {
        txt: '地胡', //17
    },
    {
        txt: '双龙七对', //18
    },
    {
        txt: '三龙七对', //19
    },
    {
        txt: '接炮', //20
    },
    {
        txt: '飘', //21
    },
    {
        txt: '查叫', //22
    },
    {
        txt: '被查叫', //23
    },
    {
        txt: '查花猪', //24
    },
    {
        txt: '花猪', //25
    },
    {
        txt: '四鸡发财', //26
    },
    {
        txt: '三鸡发财', //27
    },
    {
        txt: '四同发财', //28
    },
    {
        txt: '三同发财', //29
    },
    {
        txt: '抢幺同包赔',//30
    },
    {
        txt: '',//31
    },
    {
        txt: '',//32
    },
    {
        txt: '',//33
    },
    {
        txt: '',//34
    },
    {
        txt: '',//35
    },
    {
        txt: '',//36
    },
    {
        txt: '',//37
    },
    {
        txt: '',//38
    },
    {
        txt: '',//39
    },
]


// 玩家状态
//房间的状态
// const (
// 等待 = iota 0
// 准备 1
// 飘1 2
// 飘2 3
// 发牌 4
// 换三张1 5
// 换三张2
// 定缺1
// 定缺2
// 过渡自由
// 自由
// 结束动画
// 查叫_status
// 结果
// 胡牌 // 玩家状态
// 认输
// )



// 房间状态
MajhDef.RMSTA = {
    // Wait: {
    //     v: 0,
    //     s: "等待",
    // },
    // Free: {
    //     v: 1,
    //     s: "准备",
    // },
  Free: {
      v: 0,
      s: "准备",
  },

    Piao1: {
        v: 2,
        s: "票1",
    },

    Piao2: {
        v: 3,
        s: "票2",
    },
  SendCard: {
      v: 4,
      s: "发牌",
  },

    Huan31: {
        v: 5,
        s: "换3张1",
    },
    Huan32: {
        v: 6,
        s: "换3张2",
    },

    Ding1: {
        v: 7,
        s: "定缺1",
    },
    Ding2: {
        v: 8,
        s: "定缺2",
    },

    // SendCard: {
    //     v: 4,
    //     s: "发牌",
    // },

  PreDo: {
      v: 2,
      s: "预处理",
  },

  // Play: {
  //     v: 3,
  //     s: "打牌",
  // },
};

MajhDef.PlayerSta = {
    Free: {
        v: 0,
        s: "空闲",
    },
    Ready: {
        v: 1 << 0,
        s: "准备",
    },
    CanHuan3: {
        v: 1 << 1,
        s: "换三张",
    },
    WaitPlay: {
        v: 1 << 3,
        s: "等待他人打牌",
    },
    Play: {
        v: 1 << 4,
        s: "玩牌",
    },
    BtnPaly: { // 胡 飞 杠 碰...
        v: 1 << 5,
        s: "按钮操作",
    },
};
// 消息 C2S
MajhDef.C2S = {
    READY: 1 << 0,  //准备
};

// status 状态值
// 等待 = iota 0
// 准备 1
// 发牌 2
// 换三张1 3
// 换三张2
// 定缺1
// 定缺2
// 过渡自由
// 自由 8

// 红中麻将
// k = 1 << 0; 准备
// k = 1 << 1; 退出
// k = 1 << 2; 操作 0 1 2 3 4
// k = 1 << 3; 发牌 v[0]-v[12]/v[13] //其他玩家13张牌，庄家14张牌
// k = 1 << 4; 庄家
// k = 1 << 5; CAN换三张
// k = 1 << 6; 换三张v[0]-v[2]要换的三张牌
// k = 1 << 7; CAN定缺
// k = 1 << 8; 定缺 v[0] 0:条,1:筒，2:万
// k = 1 << 9; CAN打牌
// k = 1 << 10; 打牌 v[0] 打那张牌
// k = 1 << 11; CAN飞
// k = 1 << 12; 飞 v[0] 飞那张牌
// k = 1 << 13; CAN提
// k = 1 << 14; 提 v[0] 提那张牌
// k = 1 << 15; CAN碰
// k = 1 << 16; 碰 v[0] 碰那张牌
// k = 1 << 17; CAN胡
// k = 1 << 18; 胡  //胡 v[0]谁出得牌 v[1]胡得牌 v[2]胡的类型(1-天胡(自摸),2-地胡(自摸),3-自摸,4-胡, 5-胡(一炮多响)) v[3](抢杠 == 1) v[4] - v[n-1]
// k = 1 << 19; CAN杠
// k = 1 << 20; 杠 //客户端发给服务器 v[0]代表杠哪一个 服务器发给客户端v[0]代表杠的类型,1:暗杠，2:明杠,3:点杠,v[1]杠的值
// k = 1 << 21, 过
// k = 1 << 22, 刮风
// k = 1 << 23, 下雨
// k = 1 << 24, 摸牌 v[0] 代表摸的牌
// k = 1 << 25, 点杠
// k = 1 << 26, 呼叫转移
// k = 1 << 27, 胡扣钱
// k = 1 << 28, 开始
// k = 1 << 29, 局数
// k = 1 << 30, 销毁
// 玩家操作
MajhDef.PlayerOpt = {
    Ready:{
        v: 1 << 0,
        s: '准备',
    },

    Exit:{
        v: 1 << 1,
        s: '退出',
    },

    CanPiao:{
        v: 1 << 2,
        s: 'CAN飘',
    },

    // Piao:{
    //     v: 1 << 3,
    //     s: '飘',
    // },


    TouSaiZi:{
        v: 1 << 3,
        s: '掷骰子',
    },


    // Operate:{
    //     v: 1 << 2,
    //     s: '操作',
    // },

    SendCard:{
        v: 1 << 4,
        s: '发牌',
        t: 2.0,
    },

    Zhuang:{
        v: 1 << 5,
        s: '庄家',
    },

    CanHuan3: {
        v: 1 << 6,
        s: 'CAN换三张',
    },

    Huan3: {
        v: 1 << 7,
        s: '换三张',
        // t: 1.0,
    },

    CanDingQue: {
        v: 1 << 8,
        s: 'CAN定缺',
    },

    DingQue: {
        v: 1 << 9,
        s: '定缺',
    },

    CanJiao: {
        v: 1 << 10,
        s: 'CAN叫',
    },

    Jiao: {
        v: 1 << 11,
        s: '叫',
    },

    CanDaPai: {
        v: 1 << 12,
        s: 'CAN打牌',
    },

    DaPai: {
        v: 1 << 13,
        s: '打牌',
    },

    CanFei: {
        v: 1 << 14,
        s: 'CAN飞',
    },

    Fei: {
        v: 1 << 15,
        s: '飞',
    },

    CanTi: {
        v: 1 << 16,
        s: 'CAN提',
    },

    Ti: {
        v: 1 << 17,
        s: '提',
    },

    CanPeng: {
        v: 1 << 18,
        s: 'CAN碰',
    },

    Peng: {
        v: 1 << 19,
        s: '碰',
    },

    CanHu: {
        v: 1 << 20,
        s: 'CAN胡',
    },

    Hu: {
        v: 1 << 21,
        s: '胡',
    },

    CanGang: {
        v: 1 << 22,
        s: 'CAN杠',
    },

    Gang: {
        v: 1 << 23,
        s: '杠',
    },

    Guo: {
        v: 1 << 24,
        s: '过',
    },

    // GuaFeng: {
    //     v: 1 << 22,
    //     s: '刮风',
    // },

    // Xiayu: {
    //     v: 1 << 23,
    //     s: '下雨',
    // },

    MoPai: {
        v: 1 << 25,
        s: '摸牌',
    },

    DianGang: {
        v: 1 << 26,
        s: '点杠',
    },

    // HuJiaoZhuanYi: {
    //     v: 1 << 25,
    //     s: '呼叫转移',
    // },
    //
    // HuKouQian: {
    //     v: 1 << 26,
    //     s: '胡扣钱',
    // },

    KaiShi: {
        v: 1 << 27,
        s: '开始',
    },

    CurJushu:{
        v: 1 << 28,
        s: '局数',
    },

    TiGuiGang: {
        v: 1 << 29,
        s: '贴鬼碰杠',
    },

    AutoHu:{
        v: ((1 << 30) - 1),
        s: '自动胡牌',
    },
    //
    // TouSaiZi:{
    //     v: 1 << 31,
    //     s: '掷骰子',
    // },

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
MajhDef.PlayerOptStr={};
{
    for (const k in MajhDef.PlayerOpt) {
        const e = MajhDef.PlayerOpt[k];
        MajhDef.PlayerOptStr[e.v] = e;
    };
}

// 操作按钮KEY
MajhDef.OBK = {
    hu: 0,
    ti: 1,
    gang: 2,
    fei: 3,
    peng: 4,
    guo: 5,
    candp: 100, // 可以打牌
}

module.exports = MajhDef;