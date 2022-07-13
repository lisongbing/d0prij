cc.Class({
    extends: cc.Component,
    properties: {
        progress: cc.Label,
    },

    onLoad: function () {
        cc.g.utils.setCanvasFit();
        this.rotateCircleNode = this.node.getChildByName('rotate_circle');
        let ProgressBar = this.node.getChildByName('ProgressBar');
        if (ProgressBar) {
            this.ProgressBar = ProgressBar.getComponent(cc.ProgressBar);

            this.scheduleOnce(()=>{
                this.ProgressBar.totalLength = this.ProgressBar.node.width;
            }, 0.5);
        }

        this.lastpro = 0;
    },

    onEnable: function () {
        cc.g.loadingMgr.progress = (pro)=>{this.onProgress(pro)}; //this.progress;

        this.progress.node.active = this.rotateCircleNode ? true : false;

        if (this.ProgressBar) {
            this.ProgressBar.progress = 1;
        }
         
        if (this.rotateCircleNode) {
            //this.rotateCircleNode.stopAllActions();
            //this.rotateCircleNode.runAction(cc.repeatForever(cc.rotateBy(0.5, 360)));
        }
    },

    onProgress: function (pro){
        if (cc.g.loadingMgr.start) {
            cc.g.loadingMgr.start = false;
            this.lastpro = pro;
        }

        if (this.lastpro > pro) {
            pro = this.lastpro;
        } else {
            this.lastpro = pro;
        }

        if (this.progress.string != '正在获取GPS信息') {
            this.progress.string = pro + '%';
        }

        if (this.ProgressBar) {
            this.ProgressBar.progress = pro / 100;
        }
    },

    update(dt) {
        cc.g.loadingMgr.loadStep(dt);
    },
});
