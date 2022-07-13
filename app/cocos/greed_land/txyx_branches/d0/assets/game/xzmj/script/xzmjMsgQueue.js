

let MID = 0;

// 消息
let Msg = cc.Class({
    properties: {
        id: -1,
        name: '',
        fun: null,
        data: null,
        tag: null,
    },
});

// 消息队列
cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '消息队列';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    msginfo: function (m) {
        let s = m.name + '  ID ' + m.id;
        if (m.tag) {
            s += '  T: ' + m.tag;
        }
        s += '  消息数量 '+this.queue.length;

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // ==============================================================================

    // 初始化
    init: function (pGame) {
        // cc.dlog(this.dbgstr('init'));

        this.gm = pGame;

        this.queue = [];
        this.curMsg = null;
    },

    //
    begin: function () {
        this.clear();
        this.resume();
        this.schedule(this.do, 0.2);
    },

    //
    end: function () {
        this.clear();
        this.pause();
        this.unschedule(this.do);
    },

    
    do: function (elapsed) {
        if (this.isPause) {
            return;
        }

        if (this.curMsg) {
            return;
        }

        if (this.queue.length < 1) {
            return;
        }

        let m = this.curMsg = this.pop();
        
        if (m.fun) {
            // cc.dlog(this.dbgstr('执行消息 ') + this.msginfo(m));

            m.fun(m.data);
        }
    },

    pop: function () {

        let a = this.queue[0];

        let nq = [];
        for (let i = 1; i < this.queue.length; ++i) {
            nq.push(this.queue[i]);
        }

        this.queue = nq;

        return a;
    },

    // 生成一个消息 可以指定是否立即添加到队列
    createMsg: function (name, fun, data, tag, add) {
        let m = new Msg();
        m.id = ++MID;
        m.name = name;
        m.fun = fun;
        m.data = data;
        m.tag = tag;

        if (add != -1) {
            this.add(m);
        }

        return m;
    },

    // 添加消息
    add: function (m) {
        this.queue.push(m);

        // cc.dlog(this.dbgstr('添加消息 ') + this.msginfo(m));
    },

    // 移除消息  
    remove: function (id) {
        let str = this.dbgstr('移除消息 ');

        let nque = [];
        let idx = 0;

        this.queue.forEach(e => {
            ++idx;

            if (e.id == id) {
                str += e.name + ' idx' + idx;
                return;
            }

            nque.push(e);
        });

        this.queue = nque;

        // cc.dlog(str+' 消息数量 '+this.queue.length);
    },

    // 结束当前消息
    finishMsg: function () {
        let m = this.curMsg;

        this.curMsg = null;

        if (!m) {
            cc.error(this.dbgstr('结束消息 找不到当前消息对象 请检查错误'));
            return;
        }

        // cc.dlog(this.dbgstr('结束当前消息 ') + this.msginfo(m));
    },


    // 暂停
    pause: function () {
        this.isPause = true;
    },

    // 继续
    resume: function () {
        this.isPause = false;
    },

    // 清空
    clear: function () {
        this.curMsg = null;
        this.queue = [];
    },

    
    // 
    fun: function () {
    },
});




