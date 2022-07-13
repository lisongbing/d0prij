cc.Class({
    extends: cc.Component,
    properties: {
        playerIPAddress: {
            default: null,
            type: cc.Prefab,
        }
    },
    onLoad: function () {
        this.listNode = this.node.getChildByName('list');
        this.warnningNode = this.node.getChildByName('warnning');
    },

    init: function () {
        this.listNode.destroyAllChildren();
        if(cc.g.hallMgr.curGameMgr != null) {
            let players = cc.g.hallMgr.curGameMgr.players;

            let bExistNearIP = false;
            let nearIPPlayers = [];
            for(let i = 0; i < players.length; i++) {
                if(nearIPPlayers[i] == null) {
                    nearIPPlayers[i] = false;
                }
                let ipStr = players[i].ip.substr(0, players[i].ip.lastIndexOf("."))
                for(let j = i + 1 ; j < players.length; j++){
                    if(players[j].ip.indexOf(ipStr) === 0) {
                        nearIPPlayers[i] = nearIPPlayers[j] = true;
                        bExistNearIP = true;
                    }
                }
            }
            for(let i = 0; i < players.length; i++) {
                let player = players[i];
                let playerNode = cc.instantiate(this.playerIPAddress);
                cc.g.utils.setHead(playerNode.getChildByName('head').getComponent(cc.Sprite), player.icon);
                playerNode.getChildByName('name').getComponent(cc.Label).string = player.name;
                let ipNode = playerNode.getChildByName('ip_address');
                ipNode.getComponent(cc.Label).string = 'IP:' + player.ip;
                if(nearIPPlayers[i]) {
                    ipNode.color = cc.Color.RED;
                }
                playerNode.getChildByName('me').active = player.uid.eq(cc.g.userMgr.userId);
                this.listNode.addChild(playerNode);
            }
            this.warnningNode.active = bExistNearIP;
        }
        else {
            this.warnningNode.active = false;
        }
    },

    onClickClose: function () {
        this.node.active = false;
    },

    update(dt) {

    },
});
