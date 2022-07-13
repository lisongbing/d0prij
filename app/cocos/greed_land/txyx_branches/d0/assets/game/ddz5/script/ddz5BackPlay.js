let DEF = require('ddz5Def');


/* =================================================================================================================== */

let gm = null; //gamemgr
let pg = null; //page
let cv = null; //ctrlview

// 
let ddz5BackPlay = cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    dbgstr: function (info) {
        let s = '斗地主5回放 ';

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

        // 后续步骤
        let ops = ri.backPlayData.player_ops;
        for (let i = 0; i < ops.length; ++i) {
            let e = ops[i];

            if (e.k==DEF.PlayerOpt.SendCard.v && !eq64(gm.selfUID, e.oper)) {
                continue;
            }

            let m = {};
            m.uid = e.oper;
            m.op={};
            m.op.k=e.k;
            m.op.v=cc.g.clone(e.v);
            this.msgQue.push(m);
        }
        
        if (!ri.backPlayData.result) {
            return;
        }

        let list = ri.backPlayData.result.list;
        for (let i = 0; i < list.length; ++i) {
            let e = list[i];

            e.uid = e.uid || 0;
            e.winlose = e.winlose || 0;
            e.totalscore = e.totalscore || 0;
            e.identity = e.identity || 0;
            e.scoreRate = e.scoreRate || 0;
            e.gengValue = e.gengValue || 0;
            e.banker = e.banker || 0;

            e.deskcards = e.deskcards || [];
            e.handcards = e.handcards || [];
        }

        // 结算
        {
            let m = {};
            m.winType = ri.backPlayData.result.winType;
            m.base = ri.backPlayData.result.base;
            m.baseScore = ri.backPlayData.result.baseScore;
            m.round = ri.backPlayData.result.round;
            m.time = ri.backPlayData.result.time;
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
            if (gm.msgQue.queue.length<1 && !gm.msgQue.queue.curMsg) {
                cc.log(this.dbgstr('第 ' + (this.step+1) + ' 步'));

                gm.bpfCurHisStep && gm.bpfCurHisStep();

                let m = this.msgQue[this.step];
                gm.updateOp(m.uid, m);
                ++this.step;
            }
        } if (this.step === this.msgQue.length) {
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

module.exports = ddz5BackPlay;
