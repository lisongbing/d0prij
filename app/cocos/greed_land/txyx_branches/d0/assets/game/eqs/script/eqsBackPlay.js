let DEF = require('eqsDef');


/* =================================================================================================================== */

let gm = null;
let pg = null;
let cv = null;

// 玩家视图
let D2BackPlay = cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    dbgstr: function (info) {
        let s = '2710回放 ';

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
        cc.log(this.dbgstr('init'));

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
        cc.log('roomInfo', ri);
        cc.log('players', gm.players);

        // 庄家
        {
            let m = {};
            m.uid = ri.dealer;
            m.op={};
            m.op.k=DEF.PlayerOpt.Zhuang.v;
            m.op.v=[];
            this.msgQue.push(m);
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

        {/*
        //@api:1024,@type:resp
            message BigTwoPlayerResultListNtf{
                int64 huer = 1;//胡牌的玩家
                int64 dianpaoer = 2;//点炮的人
                repeated int32 remaincards = 3;//剩下没发完的牌
                repeated BigTwoResultInfo list = 4;  //玩家牌的信息及输赢
            }

            //大贰的结算结果
            message BigTwoResultInfo{
                int32   winlose = 1;
                int32   base    = 2;//底分
                int32 	hufan = 3;//胡的番数
                int32 	huxi  = 4;//胡的胡息
                int64   uid     = 5;//玩家的id
                int32   hucard = 6;//胡的牌
                repeated int32 mingtang  = 7;   //要显示的名堂
                repeated BigTwoCards hand = 8;//玩家的手牌
                repeated BigTwoCards putout = 9;//玩家放下去的牌
            }
        */}
        
        if (!ri.backPlayData.result) {
            return;
        }

        let dianpaoer = 0;
        let list = ri.backPlayData.result.list;
        for (let i = 0; i < list.length; ++i) {
            let e = list[i];

            e.winlose = e.winlose || 0;
            e.base = e.base || 1;
            e.hufan = e.hufan || -1;
            e.huxi = e.huxi || -1;
            e.hucard = e.hucard || 0;

            e.mingtang = e.mingtang || [];
            e.hand = e.hand || [];
            e.putout = e.putout || [];

            for (let j = 0; j < e.mingtang.length; ++j) {
                if (e.mingtang[j] === 11) {
                    dianpaoer = e.uid;
                    break;
                }
            }
        }


        // 结算
        {
            let m = {};
            m.huer = huer;
            m.dianpaoer=dianpaoer;
            m.remaincards = [];
            m.list = list;

            this.gameSettle = m;
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
        cc.log(this.dbgstr('开始'));

        this.schedule(this.upStep, this.interval);

        gm.onWaitReadyEnd();
    },
    end: function () {
        cc.log(this.dbgstr('end'));
        cv.pause();
        this.isend = true;
    },

    // ==============================================================================

    // 继续
    play: function () {
        cc.log(this.dbgstr('继续'));
        this.isPause = false;
    },

    // 暂停
    pause: function () {
        cc.log(this.dbgstr('暂停'));
        this.isPause = true;
    },

    // 退出
    quit: function () {
        cc.log(this.dbgstr('退出'));

        this.isPause = true;
        this.unschedule(this.upStep, this);

        this.speed = 1;
        cc.director.getScheduler().setTimeScale(this.speed);

        gm.playerQuited(gm.getSelfPlayer());
        cc.g.hallMgr.backToHall();
    },

    // 下一步
    next: function () {
        if (this.step < this.msgQue.length) {
            if (gm.msgQue.queue.length<1 && !gm.msgQue.curMsg) {
                cc.log(this.dbgstr('推送回放第 ' + (this.step+1) + ' 步'));

                gm.bpfCurHisStep && gm.bpfCurHisStep();

                let m = this.msgQue[this.step];
                gm.updateOp(m.uid, m);
                ++this.step;
            }
        } else if (this.step === this.msgQue.length) {
            cc.log(this.dbgstr('结算步骤'));
            
            gm.bpfCurHisStep && gm.bpfCurHisStep();
            
            this.gameSettle && gm.onGameSettle(this.gameSettle);
            
            ++this.step;
        } else {
            this.isend && cv.pause();
        }
    },

    // 上一步
    back: function () {
        if (this.step <= 0) {
            cc.log(this.dbgstr('没有上一步可以回退'));
            return;
        }
        
        cc.log(this.dbgstr('上一步'));

        if (gm.bpfToHisStep) {
            cv.pause();
            this.speed = 1;
            cc.director.getScheduler().setTimeScale(this.speed);
            cv.upSpeed();

            --this.step;
            cc.log(this.dbgstr(`回到第 ${this.step} 步`));
            gm.bpfToHisStep();
        } else {
            cc.error('还未实现上一步');
        }
    },

    // 加速
    addSpeed: function () {
        cc.log(this.dbgstr('加速'));
        this.speed *= 2;
        if (this.speed > 4) {
            this.speed = 1;
        }

        cc.director.getScheduler().setTimeScale(this.speed);
    },

    // 减速
    reduceSpeed: function () {
        cc.log(this.dbgstr('减速'));
        this.speed /= 2;
        if (this.speed < 1) {
            this.speed = 1;
        }
    },
});


/* =================================================================================================================== */

let BF = {
}

module.exports = D2BackPlay;
