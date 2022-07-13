cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        if ((cc.sys.os === cc.sys.OS_ANDROID) || (cc.sys.os === cc.sys.OS_IOS)) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBg, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node._touchListener.setSwallowTouches(false);
        } else {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouse_Down, this);
            this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouse_Up, this);
        }
        
        this.isMosuein = false;
        this.islog = false;

        //this.beganCall = null;
        //this.endCall = null;
    },

    // ==========================================================================================


    // ==========================================================================================

    onTouchBg(event) {
        if (this.islog) {
            cc.log("onTouchBg");
        }
        
        //this.node._touchListener.setSwallowTouches(false);

        if (this.beganCall) {
            this.beganCall();
        }

        return false;
    },

    onTouchEnd(event) {
        if (this.islog) {
            cc.log("onTouchEnd");
        }
        
        if (this.endCall) {
            this.endCall()
        }
    },

    // ==========================================================================================
    onMouse_Down(event) {
        if (this.islog) {
            cc.log("onMouse_Down");
        }

        this.isMosuein = true;

        if (this.beganCall) {
            this.beganCall();
        }

        return false;
    },

    onMouse_Up(event) {
        if (this.islog) {
            cc.log("onMouse_Down");
        }

        let isin = this.isMosuein;
        this.isMosuein = false;

        if (isin && this.endCall) {
            this.endCall()
        }
    },
});

