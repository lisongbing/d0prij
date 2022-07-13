let DEF = require('lzmjDef');


/* =================================================================================================================== */

let gm = null;
let pg = null;
let cv = null;

// 玩家视图
let MJBackPlay = cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    dbgstr: function (info) {
        let s = '麻将回放 ';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // ==============================================================================

    // dbgstr


    //初始化
    init: function (pGame, isPause, interval) {
        // //cc.log(this.dbgstr('init'));

        gm = pGame;

        gm.bpfBegin = ()=>{this.begin();}
        gm.bpfPlay = ()=>{this.play();}
        gm.bpfPause = ()=>{this.pause();}
        gm.bpfQuit = ()=>{this.quit();}
        gm.bpfNext = ()=>{this.next();}
        gm.bpfBack = ()=>{this.back();}
        gm.bpfAddSpeed = ()=>{this.addSpeed();}
        gm.bpfReduceSpeed = ()=>{this.reduceSpeed();}

        gm.bpfIsPause = ()=>this.isPause;
        gm.bpfGetSpeed = ()=>this.speed;

        this.isPause = isPause;
        this.interval = interval ? interval : 1.5;
        this.step = 0;
        this.speed = 1;
        this.msgQue = [];

        this.initData();
    },

    // 游戏加载完毕
    initData: function () {
        let ri = gm.roomInfo;
        // //cc.log('roomInfo', ri);
        // //cc.log('players', gm.players);

        // 庄家
        {
            let m = {};
            m.uid = ri.dealer;
            m.op={};
            m.op.k=DEF.PlayerOpt.Zhuang.v;
            m.op.v=[];
            //this.msgQue.push(m);
            this.zjmsg = m;
        }

        // 发牌
        {
            let m = {};
            m.uid = ri.dealer;
            m.op={};
            m.op.k=DEF.PlayerOpt.SendCard.v;
            m.op.v=[];
            this.msgQue.push(m);
        }

        // 后续步骤
        let huer = 0;
        let ops = ri.backPlayData.player_ops;
        if (!cc.g.utils.judgeArrayEmpty(ops)) {
            for (let i = 0; i < ops.length; ++i) {
                let e = ops[i];

                let m = {};
                m.uid = e.oper;
                m.op={};
                m.op.k=e.k;
                m.op.v=cc.g.clone(e.v);
                this.msgQue.push(m);

                // 胡牌玩家
                if (e.k === DEF.PlayerOpt.Hu.v) {
                    huer = e.oper;
                }
            }
        }


        if (!ri.backPlayData.result) {
            return;
        }

        {/*
            //@api:1027,@type:resp
            message GamePlayerResultListNtf{
                GAME game = 1;
                oneof reslut{
                    HongZhongMahjongResultNtf result= 2;
                }
            }
            //红中麻将的每局的结算结果
            message HongZhongMahjongResultNtf{
                repeated int32 remaincards = 1;//剩下没发完的牌
                repeated PersonPerGameResult allPerResult = 2;
                int32 gameNum = 3;//游戏局数
            }
            //红中麻将每局每人的结算结果
            message PersonPerGameResult{
                int64 uid = 1;//玩家
                repeated int32 mingtang  = 2;//名堂
                repeated int64 hand  = 3;  //玩家牌
                int32 fun = 4;//番数
                int32 guiNum = 5;//归的数量
                int32 win = 6;//输赢
                repeated  HongZhongMahjongPutOut putout = 7;  // 摆牌
                repeated HongZhongMahjongdetailWin details = 8;//具体的详情
            }
        */}

        {
            let res = ri.backPlayData.result;

            let m = {};
            m.result={};
            m.game = res.game;
            m.result.remaincards = res.Reslut.Result.remaincards;
            m.result.maValue = res.Reslut.Result.maValue;
            m.result.gameNum = res.Reslut.Result.gameNum;
            m.result.allPerResult = res.Reslut.Result.allPerResult;

            this.gameSettle  = m;
        }
    },


    // ==============================================================================

    // 游戏加载完毕
    gameLoaded: function () {
        pg = gm.gameScript;
        cv = pg.backPlayView;

        for (const key in gm.uidPlayers) {
            gm.uidPlayers[key].ready([1]);
        }
    },

    // 步骤
    upStep: function () {
        if (this.isPause) {
            return;
        }

        this.next();
    },

    // 开始
    begin: function () {
        // //cc.log(this.dbgstr('开始'));

        let m = this.zjmsg;
        gm.updateOp(m.uid, m);

        this.schedule(this.upStep, this.interval);
    },
    end: function () {
        // //cc.log(this.dbgstr('end'));
        cv.pause();
        this.isend = true;
    },

    // ==============================================================================

    // 继续
    play: function () {
        // //cc.log(this.dbgstr('继续'));
        this.isPause = false;
    },

    // 暂停
    pause: function () {
        // //cc.log(this.dbgstr('暂停'));
        this.isPause = true;
    },

    // 退出
    quit: function () {
        // //cc.log(this.dbgstr('退出'));

        this.isPause = true;
        this.unschedule(this.upStep, this);

        this.speed = 1;
        cc.director.getScheduler().setTimeScale(this.speed);

        gm.playerQuited(gm.getSelfPlayer());
        cc.g.hallMgr.backToHall();
    },

    // // 下一步
    // next: function () {
    //     if (this.step < this.msgQue.length) {
    //         if (gm.msgQue.queue.length<1 && !gm.msgQue.queue.curMsg) {
    //             // //cc.log(this.dbgstr('第 ' + (this.step+1) + ' 步'));
    //
    //             let m = this.msgQue[this.step];
    //
    //             // 定缺不再消息队列处理 这里单独延迟一下
    //             if(m.uid == 0) {
    //                 this.pause();
    //                 this.scheduleOnce(()=>{
    //                     gm.updateOp(m.uid, m);
    //                     ++this.step;
    //
    //                     this.play();
    //                 }, 4);
    //             } else {
    //                 gm.updateOp(m.uid, m);
    //                 ++this.step;
    //             }
    //         }
    //     } if (this.step === this.msgQue.length) {
    //         // //cc.log(this.dbgstr('结算步骤'));
    //
    //         this.gameSettle && gm.onGameSettle(this.gameSettle);
    //
    //         ++this.step;
    //
    //         this.speed = 1000;
    //         this.addSpeed();
    //         cv.upSpeed();
    //     } else {
    //         this.isend && cv.pause();
    //     }
    // },
    //
    // // 上一步
    // back: function () {
    //     // //cc.log(this.dbgstr('上一步'));
    //     // cc.error('还未实现上一步');
    // },
    // 下一步
    next: function () {
        if (this.step < this.msgQue.length) {
            if (gm.msgQue.queue.length<1 && !gm.msgQue.curMsg) {
                //cc.log(this.dbgstr('第 ' + (this.step+1) + ' 步'));

                gm.bpfCurHisStep && gm.bpfCurHisStep();

                let m = this.msgQue[this.step];

                // 定缺不再消息队列处理 这里单独延迟一下
                if(m.uid == 0) {
                    this.pause();
                    this.scheduleOnce(()=>{
                        gm.updateOp(m.uid, m);
                        ++this.step;

                        this.play();
                    }, 4);
                } else {
                    gm.updateOp(m.uid, m);
                    ++this.step;
                }
            }
        } else if (this.step === this.msgQue.length) {
            //cc.log(this.dbgstr('结算步骤'));

            gm.bpfCurHisStep && gm.bpfCurHisStep();

            this.gameSettle && gm.onGameSettle(this.gameSettle);

            ++this.step;

            this.speed = 1000;
            this.addSpeed();
            cv.upSpeed();
        } else {
            this.isend && cv.pause();
        }
    },
    // 上一步
    back: function () {
        if (this.step <= 0) {
            //cc.log(this.dbgstr('没有上一步可以回退'));
            return;
        }

        //cc.log(this.dbgstr('上一步'));

        if (gm.bpfToHisStep) {
            cv.pause();
            this.speed = 1;
            cc.director.getScheduler().setTimeScale(this.speed);
            cv.upSpeed();

            --this.step;
            //cc.log(this.dbgstr(`回到第 ${this.step} 步`));
            gm.bpfToHisStep();
        } else {
            cc.error('还未实现上一步');
        }
    },

    // 加速
    addSpeed: function () {
        // //cc.log(this.dbgstr('加速'));
        this.speed *= 2;
        if (this.speed > 4) {
            this.speed = 1;
        }

        cc.director.getScheduler().setTimeScale(this.speed);
    },

    // 减速
    reduceSpeed: function () {
        // //cc.log(this.dbgstr('减速'));
        this.speed /= 2;
        if (this.speed < 1) {
            this.speed = 1;
        }
    },
});


/* =================================================================================================================== */

let BF = {
}

module.exports = MJBackPlay;
