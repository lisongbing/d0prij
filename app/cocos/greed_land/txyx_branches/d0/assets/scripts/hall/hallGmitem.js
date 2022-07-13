
cc.Class({
    extends: cc.Component,

    properties: {
        // 大厅图集
        hallAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },

        // 添加游戏对话框
        dlgAdd: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    loadView(){
        let r = this.node;

        this.gm = cc.find('gm', r);
        this.add = cc.find('add', r);
        this.grp = cc.find('grp', r);
    },

    start () {

    },

    // update (dt) {},

    /* ======================================================================================================================== */

    set:function (data) {
        this.loadView();

        if (!data) {
            //this.gm.removeFromParent();
            this.gm.destroy();
            //this.grp.removeFromParent();
            this.grp.destroy();
            this.gm = this.grp = null;

            cc.g.utils.addClickEvent(cc.find('btn', this.add), this.node, 'hallGmitem', 'onClickAdd');

            this.add.active = true;

            return
        }

        if (data.isBisai) {
            this.add.destroy();
            this.grp.destroy()
            this.add = this.grp = null;

            this.gm.active = true;

            cc.find('name', this.gm).getComponent(cc.Label).string = '福利赛';

            cc.find('btn/bg/icon', this.gm).active = false;
            cc.find('btn/bg', this.gm).getComponent(cc.Sprite).spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gi_fls`);

            cc.g.utils.addClickEvent(cc.find('btn', this.gm), this.node, 'hallGmitem', 'onClickBisai');

            return;
        }

        let setspr = (data, s1, s2) => {
            let d = data.split(',');
            let id = parseInt(d[0]);
            let ori = parseInt(d[1])
            let t = parseInt(d[2]);

            let f1 = this.hallAtlas.getSpriteFrame(`hall_gibg_${t}`);
            let f2 = this.hallAtlas.getSpriteFrame(`hall_gi_${id}_${ori}`);

            s1.getComponent(cc.Sprite).spriteFrame = f1;
            s2.getComponent(cc.Sprite).spriteFrame = f2;
        };

        if (data.length==1) {
            //this.add.removeFromParent();
            this.add.destroy();
            //this.grp.removeFromParent();
            this.grp.destroy()
            this.add = this.grp = null;

            this.gm.active = true;

            let d = data[0].split(',');
            let id = parseInt(d[0]);
            let ori = parseInt(d[1]);

            cc.find('name', this.gm).getComponent(cc.Label).string = cc.g.utils.getGameName(id, ori);

            setspr(data[0], cc.find('btn/bg', this.gm), cc.find('btn/bg/icon', this.gm));

            this.id = id;
            this.ori = ori;

            cc.g.utils.addClickEvent(cc.find('btn', this.gm), this.node, 'hallGmitem', 'onClickGame');

            return;
        }
        
        
        if (data.length > 1){
            //this.gm.removeFromParent();
            this.gm.destroy();
            //this.add.removeFromParent();
            this.add.destroy();
            this.add = this.gm = null;

            this.grp.active = true;

            cc.find('name', this.grp).getComponent(cc.Label).string = data[data.length-1];

            this.gms = [];
            for (let i = 0; i < data.length-1; ++i) {
                this.gms[i] = cc.g.clone(data[i]);
            }

            let gbox = cc.find('btn/gbox_gms', this.grp);
            for (let i = 0; i < 9; ++i) {
                let n = cc.find('i'+i, gbox);

                if (i>=this.gms.length) {
                    n.removeFromParent();
                    n.destroy();
                    continue;
                }

                setspr(data[i], n, cc.find('s', n))
            }

            cc.g.utils.addClickEvent(cc.find('btn', this.grp), this.node, 'hallGmitem', 'onClickGame');
        }
    },

    onClickBisai: function (event, customEventData) {
        cc.log('hallGmitem onClickBisai');
        cc.g.utils.btnShake();
        cc.g.hallMgr.hall.upShowBisaiPage();
    },

    onClickGame: function (event, customEventData) {
        cc.log('hallGmitem onClickGame');

        if (this.gms) {
            cc.g.utils.btnShake();
            cc.g.hallMgr.hall.upGroupGame(this.gms);
        } else {
            cc.g.hallMgr.hall.onClickCreateRoom(event, {id:this.id, ori:this.ori});
            cc.g.hallMgr.hall.upListGame(true);
        }
    },

    onClickAdd: function (event, customEventData) {
        cc.log('hallGmitem onClickAdd');

        cc.g.utils.btnShake();
        
        let dlg = cc.instantiate(this.dlgAdd).getComponent('addGame');
        dlg.init();
        dlg.up();

        cc.g.hallMgr.hall.menuRoot.addChild(dlg.node);
    },
});
