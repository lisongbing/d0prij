
cc.Class({
    extends: cc.Component,

    properties: {
        //
        item: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bg = cc.find('Sprite_bg', this.node);
        this.list = cc.find('Sprite_bg/Node_list', this.node);
    },

    start () {

    },

    // update (dt) {},

    init:function () {
        let r = this.node;

        this.svList = cc.find('ScrollView_gamelist', r).getComponent(cc.ScrollView);
        this.svList.content.destroyAllChildren();

        this.addList = [];
    },

    /* ======================================================================================================================== */

    up:function () {
        let useradd = {};

        // 用户自己选的游戏
        if (GameConfig.userGames) {
            GameConfig.userGames.forEach(e => {
                let d = e.split(',');
                useradd[`${d[0]},${d[1]}`] = true;
                this.addList.push(e);
            });
        }


        let ctt = this.svList.content;
        ctt.destroyAllChildren();

        GameConfig.addGames.forEach(e => {
            let d = e.split('|');

            let n = cc.instantiate(this.item);

            cc.find('name', n).getComponent(cc.Label).string = d[1];

            let togn = cc.find('toggle', n);
            let tog = togn.getComponent(cc.Toggle);

            let k = d[0].split(',');
            if (useradd[`${k[0]},${k[1]}`]) {
                tog.check();
            } else {
                tog.uncheck();
            }

            cc.g.utils.addCheckEvent(togn, this.node, 'addGame', 'onClickItem', d[0]); 

            ctt.addChild(n);
        });

        //ctt.y = -48.500077533138835; // 0 - this.item 的高度的一半还要多一些

        this.svList.scrollToTop();
    },

    onClickItem:function (event, gm) {
        cc.log(`onClickItem ${gm}  isChecked ${event.isChecked}`);

        cc.g.utils.btnShake();

        if (event.isChecked) {
            this.addList.push(gm);
        } else {
            let nl = [];
            this.addList.forEach(e => (e!=gm) && (nl.push(e)));
            this.addList = nl;
        }

        //cc.log('addList', this.addList);
    },

    onClose:function (event, customEventData) {
        cc.g.utils.btnShake();
        
        this.node.removeFromParent();
        this.node.destroy();

        cc.log('addList', this.addList);
        cc.sys.localStorage.setItem('userAddGames', this.addList.join('|'));
        
        GameConfig.userGames = this.addList;
        
        cc.g.hallMgr.hall.upListGame();
    },
});
