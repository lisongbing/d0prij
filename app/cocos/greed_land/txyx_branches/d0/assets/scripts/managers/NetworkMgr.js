cc.Class({
    extends: cc.Component,
    properties: {
        socket: null,
        //inited: false,
    },

    init: function () {
        let Socket = require('Socket')
        let randomIndex = Math.floor(Math.random() * GameConfig.wsAddress.length);
        this.socket = new Socket(GameConfig.wsAddress[randomIndex]);
        cc.log('webscoket url:' + GameConfig.wsAddress[randomIndex]);
        //this.inited = true;
    },

    send: function (api, proto, callback) {
        this.socket.send(api, proto, callback);
    },

    addHandler: function (api, callback) {
        this.socket.on(api, callback);
    },

    addOnceHandler: function (api, callback) {
        this.socket.once(api, callback);
    },

    connetcted: function () {
        this.socket.checkConnected();
    },

    setHeartEnable: function () {
        this.socket.setHeartEnable();
    },

    update: function (dt) {
        /*if (this.inited) {
            this.socket.update(dt);
        }*/
    },
    reConnetcted: function () {
        if (this.socket) {
            this.socket.reConnectTwo();
        }
    },

    close: function (iscls) {
        if (this.socket) {
            this.socket.closeSocketTwo(iscls);
        }
    },
});
