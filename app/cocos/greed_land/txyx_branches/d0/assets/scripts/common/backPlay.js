
cc.Class({
    extends: cc.Component,

    properties: {
        // 图集
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    dbgstr: function (info) {
        let s = '回放 ';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.LoadCtrlPanel();
    },

    start () {

    },

    // update (dt) {},


    /* ========================================================================================================================= */
    // 初始化控制面板
    LoadCtrlPanel: function () {
        if (this.Sprite_ctrl) {
            return;
        }

        cc.log(this.dbgstr('初始化控制面板'));

        this.Label_time = cc.find("Sprite_fjh_js/Label_time", this.node).getComponent(cc.Label);
        this.Label_roomID = cc.find("Sprite_fjh_js/Label_roomID", this.node).getComponent(cc.Label);

        let btns = cc.find("Sprite_ctrl/Node_btns", this.node);

        // 播放
        this.Button_play = cc.find("Node_play/Button_play", btns);
        // 暂停
        this.Button_pause = cc.find("Node_play/Button_pause", btns);

        // 速度
        this.Sprite_speed = cc.find("Button_addSpeed/Sprite_speed", btns).getComponent(cc.Sprite);
        this.Sprite_speed.node.active = false;

        this.Sprite_ctrl = cc.find("Sprite_ctrl", this.node);
        this.Sprite_ctrl.uox = this.Sprite_ctrl.x;
        this.Sprite_ctrl.uoy = this.Sprite_ctrl.y;

        this.Sprite_ctrl.on('touchstart',  this.onTouchstart, this);
        this.Sprite_ctrl.on('touchmove',   this.onTouchmove, this);
        this.Sprite_ctrl.on('touchend',    this.onTouchend, this);
        this.Sprite_ctrl.on('touchcancel', this.onTouchcancel, this);
    },

    touchInfo: function (event, tp) {
        let tg = event.getCurrentTarget();

        tg.uTID = event.touch.__instanceId; //event.touch.getID(); //event.getID();
        tg.uWp  = event.getLocation();
        tg.uPre = event.getPreviousLocation();
        tg.uStart = event.getStartLocation();
        tg.uDelta = event.getDelta();
        
        tg.uNp = tg.convertToNodeSpaceAR(tg.uWp);

        // 需要相对左下角的左边
        tg.uNp.x = tg.uNp.x+tg.width*0.5;
        tg.uNp.y = tg.uNp.y+tg.height*0.5;

        // 初始点击点到现在的位置偏移
        tg.uOff = cc.v2(tg.uWp.x - tg.uStart.x, tg.uWp.y - tg.uStart.y);

        // 调试字符串
        let p = [tg.uWp, tg.uNp];
        p.push(tg.uOff);

        let tpStr = ['点击','移动','结束','取消',];
        let dstr = tpStr[tp] + tg.uTID;

        dstr += ' wp' + '(' +tg.uWp.x.toFixed(0)+ ',' +tg.uWp.y.toFixed(0)+ ')';
        dstr += ' np' + '(' +tg.uNp.x.toFixed(0)+ ',' +tg.uNp.y.toFixed(0)+ ')';
        dstr += ' off' + '(' +tg.uOff.x.toFixed(0)+ ',' +tg.uOff.y.toFixed(0)+ ')';
        dstr += ' uDelta' + '(' +tg.uDelta.x.toFixed(0)+ ',' +tg.uDelta.y.toFixed(0)+ ')';

        if (tp != 1) {
            //cc.log(dstr);
        } else {
            tg.uDstr = dstr;
        }

        return tg;
    },

    // 点击
    onTouchstart: function (event) {
        let tg = this.touchInfo(event, 0);
    },

    // 移动
    onTouchmove: function (event) {
        let tg = this.touchInfo(event, 1);

        //cc.log(tg.uDstr);

        let wsz=cc.view.getVisibleSize();

        // 屏幕里前往的移动点 屏幕坐标
        let x = tg.uWp.x+tg.uDelta.x; 
        let y = tg.uWp.y+tg.uDelta.y;

        // tg.uNp.x 点在控制面板里的坐标 相对左下角
        // (x >= tg.uNp.x) 控制左边边界 基本是大于0就能往左边拖 拖到外面就小于0了
        // ((wsz.width-x) >= (tg.width-tg.uNp.x)) 控制右边边界
        // 往右拖 要满足 (屏幕右边-前往的移动点的位置得出的宽度) >= (控制面板右边-点在控制面板里位置的宽度)
        (x >= tg.uNp.x) && ((wsz.width-x) >= (tg.width-tg.uNp.x)) && (tg.x += tg.uDelta.x);
        (y >= tg.uNp.y) && ((wsz.height-y) >= (tg.height-tg.uNp.y)) && (tg.y += tg.uDelta.y);
    },

    // 结束 节点区域内离开
    onTouchend: function (event) {
        let tg = this.touchInfo(event, 2);
        tg.uox = tg.x;
        tg.uoy = tg.y;
    },

    // 取消 节点区域外离开
    onTouchcancel: function (event) {
        let tg = this.touchInfo(event, 3);
        tg.uox = tg.x;
        tg.uoy = tg.y;
    },
    
    // =========================================================================================================================

    //初始化View
    init: function (gameMgr, isPause, interval) {
        cc.log(this.dbgstr('init'));

        this.gm = gameMgr;

        this.Label_roomID.string = '房号:'+this.gm.roomInfo.roomId;
        this.Label_time.string = cc.g.utils.getFormatTimeXXX(this.gm.roomInfo.start_time*1000, '|M|.|D| |h|:|m|:|s|');
        

        this.Button_play.active  = this.gm.bpfIsPause();
        this.Button_pause.active = !this.gm.bpfIsPause();

        this.upSpeed();
    },


    // 播放
    play: function () {
        cc.log(this.dbgstr('播放'));
        
        cc.g.utils.btnShake();

        this.Button_play.active  = false;
        this.Button_pause.active = true;

        this.gm.bpfPlay();
    },

    // 暂停
    pause: function () {
        //cc.log(this.dbgstr('暂停'));

        cc.g.utils.btnShake();
        
        this.Button_play.active  = true;
        this.Button_pause.active = false;

        this.gm.bpfPause();
    },

    // 退出
    quit: function () {
        //cc.log(this.dbgstr('退出'));

        cc.g.utils.btnShake();

        this.Sprite_ctrl.active = false;
        this.Sprite_ctrl.off('touchstart',  this.onTouchstart, this);
        this.Sprite_ctrl.off('touchmove',   this.onTouchmove, this);
        this.Sprite_ctrl.off('touchend',    this.onTouchend, this);
        this.Sprite_ctrl.off('touchcancel', this.onTouchcancel, this);

        this.gm.bpfQuit();
    },

    // 下一步
    next: function () {
        //cc.log(this.dbgstr('下一步'));

        cc.g.utils.btnShake();

        this.gm.bpfNext();
    },

    // 上一步
    back: function () {
        //cc.log(this.dbgstr('上一步'));

        cc.g.utils.btnShake();

        this.gm.bpfBack();
    },

    // 加速
    addSpeed: function () {
        //cc.log(this.dbgstr('加速'));
        cc.g.utils.btnShake();

        this.gm.bpfAddSpeed();
        this.upSpeed();
    },

    // 减速
    reduceSpeed: function () {
        //cc.log(this.dbgstr('减速'));
        cc.g.utils.btnShake();
        
        this.gm.bpfReduceSpeed();
        this.upSpeed();
    },

    upSpeed: function () {
        let speed = this.gm.bpfGetSpeed();
        this.Sprite_speed.node.active = speed>1;

        let frm = this.atlas.getSpriteFrame('bp_img_spd' + speed);
        if (frm) {
            this.Sprite_speed.spriteFrame = frm;
        }
    },
});
