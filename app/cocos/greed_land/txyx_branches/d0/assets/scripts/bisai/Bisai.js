// 73169133163853

cc.Class({
    extends: cc.Component,

    properties: {
        // 赛事
        pfSaishi: {
            default: null,
            type: cc.Prefab,
        },
        
        // 中奖跑马灯
        pfZjpmd: {
            default: null,
            type: cc.Prefab,
        },
        
        // 报名
        pfBaoming: {
            default: null,
            type: cc.Prefab,
        },

        // 中奖记录
        pfZjjl: {
            default: null,
            type: cc.Prefab,
        },
        // 信息登记
        pfXxdj: {
            default: null,
            type: cc.Prefab,
        },
    },

    dbgstr: function (info) {
        let s = '比赛';

        if (info) {
            return s + '::' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pmdzj = [{time:'09-27  22:00', name:'某某某', jp:'xxx'}];
        this.pmdzjidx = 0;

        this.saishi = [];

        this.initView();
    },

    start () {

    },

    // update (dt) {},

    initView () {
        cc.log(this.dbgstr('initView'));

        let r = this.node;

        // 赛事
        this.sv_bisai = cc.find('ScrollView_bisai', r).getComponent(cc.ScrollView);
        this.sv_bisai.content.destroyAllChildren();

        // 滚动中奖公告
        this.pmd = cc.find('Sprite_pmd/mask', r);
        this.pmd.destroyAllChildren();
        
        this.upSaishi();
        this.addPmd();
    },


    upSaishi () {
        cc.log(this.dbgstr('initView'));

        let ctt = this.sv_bisai.content;
        ctt.destroyAllChildren();


        //for (let i = 0; i < this.saishi.length; ++i) {
        for (let i = 0; i < 10; ++i) {
            const d = this.saishi[i];
            
            let itm = cc.instantiate(this.pfSaishi);
            itm.ud = d;

            // 点击赛事
            cc.g.utils.addClickEvent(itm, this.node, 'Bisai', 'onClickSaishi', itm);

            // 背景
            let bg = cc.find('bg', itm).getComponent(cc.Sprite);

            // 标题
            let tt1 = cc.find('Label_title1', itm).getComponent(cc.Label);
            let tt2 = cc.find('Label_title2', itm).getComponent(cc.Label);
            let tt3 = cc.find('Label_title3', itm).getComponent(cc.Label);

            // 状态
            let statu = cc.find('Label_statu', itm).getComponent(cc.Label);

            // 奖品
            let jp = cc.find('Sprite_jiang', itm).getComponent(cc.Sprite);
            
            // 报名人数
            let renshu = cc.find('Label_renshu', itm).getComponent(cc.Label);
    
            ctt.addChild(itm);
        }
    },


    // 滚动中奖公告
    addPmd () {
        cc.log(this.dbgstr('addPmd'));

        if (this.pmdzjidx >= this.pmdzj.length) {
            this.pmdzjidx = 0;
        }

        let d = this.pmdzj[this.pmdzjidx];
        if (!d) return;

        let str = `<color=#B8AFAF>${d.time} </c>`;
        str = str+`<color=#ffffff>恭喜${d.name}获得</color>`;
        str = str+`<color=#fdc33a>${d.jp}</color>`;

        let itm = cc.instantiate(this.pfZjpmd);
        itm.x = this.pmd.width;
        itm.getComponent(cc.RichText).string = str;

        this.pmd.addChild(itm);

        let spd = 30; // 像素/秒
        let time = (itm.x + itm.width)/spd; //跑到左边消失的时间

        cc.log('idx spd  time', this.pmdzjidx, spd, time);
        cc.log('pmd.width  itm.width', this.pmd.width, itm.width);
        
        itm.runAction(cc.sequence(
            //cc.delayTime(0.1),
            cc.moveBy(time, cc.v2(-(itm.x + itm.width), 0)),
            cc.callFunc(
                function (params) {
                    itm.destroy();
                },
                this,null
            )
        ));

        //完全出现后间隔一定距离 添加后一条
        let time2 = (itm.width + 60)/spd; 
        itm.runAction(cc.sequence(
            cc.delayTime(time2),
            cc.callFunc(
                function (params) {
                    ++this.pmdzjidx;
                    this.addPmd();
                },
                this,null
            )
        ));
    },



    // 点击赛事
    onClickSaishi: function (event, customEventData) {
        let itm = customEventData;
        cc.log(this.dbgstr('点击赛事', itm.ud));

        cc.g.utils.btnShake();

        let dlg = cc.instantiate(this.pfBaoming);
        this.node.addChild(dlg);
    },


    // 中奖记录
    onBtnZjjl: function (event, customEventData) {
        cc.log(this.dbgstr('中奖记录'));

        cc.g.utils.btnShake();

        let dlg = cc.instantiate(this.pfZjjl);
        this.node.addChild(dlg);
    },
    // 信息登记
    onBtnXxdj: function (event, customEventData) {
        cc.log(this.dbgstr('信息登记'));

        cc.g.utils.btnShake();

        let dlg = cc.instantiate(this.pfXxdj);
        this.node.addChild(dlg);
    },

    onBtnClose: function (event, customEventData) {
        cc.log(this.dbgstr('onBtnClose'));

        cc.g.utils.btnShake();
        
        this.pmd.destroyAllChildren();

        this.node.destroy();

        //cc.g.hallMgr.hall.menuRoot.addChild(dlg.node);
    },
});
