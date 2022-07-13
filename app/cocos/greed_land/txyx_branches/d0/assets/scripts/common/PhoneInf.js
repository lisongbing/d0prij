
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();

        this.upView();
    },

    start () {

    },

    // update (dt) {},

    /* ================================================================================================================= */
    
    initView () {
        let r = this.node;

        //时间
        this.Label_time = cc.find("Label_time", r)
        if (!this.Label_time) {
            this.Label_time = this.node;
        }

        this.Label_time = this.Label_time.getComponent(cc.Label);
    },

    upView () {

        //时间
        let nowt = ()=>{
            let now =  new Date();

            let hour = now.getHours();
            hour = hour < 10 ? '0'+hour : hour;
            let minute = now.getMinutes();
            minute = minute < 10 ? '0'+minute : minute;
            let second = now.getSeconds();
            second = second < 10 ? '0'+second : second;

            this.Label_time.string = hour + ':' + minute + ':' + second + ' ';
        };
        nowt();
        this.schedule(()=>{
            nowt()
        }, 1);
    },

    onDestroy () {
        this.unscheduleAllCallbacks();
    },
    
    /* ================================================================================================================= */


});
