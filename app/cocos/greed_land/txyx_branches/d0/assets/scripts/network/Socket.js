function Socket(host) {
    this.cbQueue = {};
    //this.msgQueue = new Array();
    this.host = host;

    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
        let cert = cc.urlraw('cert/cert.pem');
        if (cc.loader.md5Pipe) {
            cert = cc.loader.md5Pipe.transformURL(cert);
        }
        this.ws = new WebSocket(host, null, cert);
    } else {
        this.ws = new WebSocket(host);
    }

    this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = this.message.bind(this);
    this.ws.onopen = this.connected.bind(this);
    this.ws.onclose = this.close.bind(this);
    this.ws.onerror = this.error.bind(this);
    this.notification = new cc.EventTarget();
    this.timeoutObj = null;
    this.disConnectObj = null;
    // this.waitObj = null;
    // this.waitObjTimeoutObj = null;
    this.enableHeart = false;
    //add by panbin
    this.needRelogin = false;
    // this.needResetWait = false;
    this.lossHeaderCount = 0;
}

Socket.prototype = {
    connected() {
        if (this.disConnectObj != null) {
            clearInterval(this.disConnectObj);
            this.disConnectObj = null;
            cc.g.userMgr.relogin();
        } else if (this.needRelogin) {
            cc.g.userMgr.relogin();
            this.needRelogin = false;
        }
        // this.needResetWait = false;
        // this.resetWait();
        cc.g.global.destoryWaiting();
        this.setHeartEnable();
        this.notification.emit('connected');
    },

    send(api, proto, callback) {
        if(this.ws == null) {
            cc.error('send error ws is null!');
            this.closeSocket();
            return;
        }
        if(this.ws.readyState !== WebSocket.OPEN) {
            this.closeSocket();
            cc.error('send error ws is not ready yet!');
            return;
        }

        if (api != PB.PROTO.HEART) {//不打印心跳协议请求
            cc.log("send msg[" + api +' - '+ PHI.desc(api) + "]: ", proto);
            //cc.g.log("send msg[" + api +' - '+ PHI.desc(api) + "]: ", proto);
        } else {
            //cc.log('send HEART');
        }

        let clientReq = new PB.ClientReq();
        clientReq.api = api;
        clientReq.seq = this.sequence;
        clientReq.data = proto.toArrayBuffer();
        this.ws.send(clientReq.toArrayBuffer());
        if (callback != null) {
            this.cbQueue[api] = callback;
            // this.needResetWait = false;
            // cc.log('send-->......showWait.....')
            // this.showWait();
        }
    },

    message(event) {
        let clientResp = PB.ClientResp.decode(event.data);
        let respData = pbHelper.newResp(clientResp.api, clientResp.data);
        let callback = this.cbQueue[clientResp.api];

        if (callback != null) {
            // if (!this.needResetWait) {
            //     this.resetWait();
            // }
            delete this.cbQueue[clientResp.api];
        } else if (clientResp.api == PB.PROTO.COMMON && this.cbQueue[respData.api] != null) {
            callback = this.cbQueue[respData.api];
            // if (!this.needResetWait) {
            //     this.resetWait();
            // }
            delete this.cbQueue[respData.api];
        }


        if (clientResp.api == PB.PROTO.HEART) {//不打印心跳协议回复
            //清除心跳超时检查
            this.lossHeaderCount = 0
        } else {
            cc.log("receive message[" + clientResp.api +' - '+ PHI.desc(clientResp.api) + "]: ", respData);
        }

        try {
            if (callback) {
                callback(respData);
            }
            this.notification.emit(clientResp.api.toString(), respData);
        } catch (e) {

        }
    },

    checkConnected() {
        return this.ws.readyState == WebSocket.OPEN;
    },
    reconnect() {
        if (this.ws == null) {
            // this.needResetWait = true;
            cc.log('reconnect.... ')
            // this.showWait();
            cc.g.global.showWaiting();

            this.cbQueue = {};

            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                let cert = cc.urlraw('cert/cert.pem');
                if (cc.loader.md5Pipe) {
                    cert = cc.loader.md5Pipe.transformURL(cert);
                }
                this.ws = new WebSocket(this.host, null, cert);
            } else {
                this.ws = new WebSocket(this.host);
            }

            this.ws.binaryType = 'arraybuffer';
            this.ws.onmessage = this.message.bind(this);
            this.ws.onopen = this.connected.bind(this);
            this.ws.onclose = this.close.bind(this);
            this.ws.onerror = this.error.bind(this);
        } else {
            cc.g.global.destoryWaiting();
            cc.error('reconnect error ' + this.ws.readyState)
            if (this.disConnectObj != null) {
                clearInterval(this.disConnectObj);
                this.disConnectObj = null;
            }
            // readonly CLOSED: number; 3
            // readonly CLOSING: number; 2
            // readonly CONNECTING: number; 0
            // readonly OPEN: number; 1
            if((this.ws.readyState == WebSocket.CLOSED) ||
                (this.ws.readyState == WebSocket.CLOSING)) {
                this.scheduleOnce(()=>{
                    this.ws = null;
                    this.reConnectTwo()
                }, 2);
            }
        }
        // if(this.ws != null) {
        //     if (this.ws.readyState != WebSocket.CLOSED) {
        //         cc.error('reconnect error ' + this.ws.readyState)
        //         return;
        //     }
        // }
        //
        // cc.log('reconnect-->...........')
        //
        // this.showWait();
        //
        // this.cbQueue = {};
        //
        // if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
        //     let cert = cc.urlraw('cert/cert.pem');
        //     if (cc.loader.md5Pipe) {
        //         cert = cc.loader.md5Pipe.transformURL(cert);
        //     }
        //     this.ws = new WebSocket(this.host, null, cert);
        // } else {
        //     this.ws = new WebSocket(this.host);
        // }
        //
        // this.ws.binaryType = 'arraybuffer';
        // this.ws.onmessage = this.message.bind(this);
        // this.ws.onopen = this.connected.bind(this);
        // this.ws.onclose = this.close.bind(this);
        // this.ws.onerror = this.error.bind(this);
    },

    // 断线重连走这里
    reConnectTwo() {
        if (this.disConnectObj != null) {
            clearInterval(this.disConnectObj);
            this.disConnectObj = null;
        }

        cc.log('reConnectTwo ' + this.ws)

        let self = this;
        // self.disConnect();
        self.reconnect();
        this.disConnectObj = setInterval(function () {
            // self.disConnect();
            self.reconnect();
        }, 5000);
    },
    // // 收到断线消息，就会走这里，由于没有清除心跳定时器，等20s后会自动重连
    // disConnect() {
    //     if (this.ws != null) {
    //         if(this.ws.readyState == WebSocket.OPEN) {
    //             this.ws.close();
    //         }
    //         this.ws = null;
    //     }
    //
    //     this.cbQueue = {};
    // },
    doReconForClose() {
        // readonly CLOSED: number;
        // readonly CLOSING: number;
        // readonly CONNECTING: number;
        // readonly OPEN: number;
        if (this.ws != null) {
            cc.error('reconnect error ' + this.ws.readyState)
            if((this.ws.readyState == WebSocket.CLOSED) ||
                (this.ws.readyState == WebSocket.CLOSING)) {
                this.ws = null;
                this.reConnectTwo()
            }
        } else {
            this.reConnectTwo()
        }
    },
    close() {
        cc.log("socket close");
        // if (!this.needResetWait) {
        //     this.disConnect();
        // }
        // this.notification.emit('close');

        this.doReconForClose()
    },

    error(e) {
        cc.error("socket error", e);
        this.doReconForClose()
    },

    on(api, cb) {
        this.notification.off(api.toString());
        this.notification.on(api.toString(), (event) => {
            if (cb) {
                cb(event.detail || event);
            }
        })
    },

    once(api, cb) {
        this.notification.once(api.toString(), (event) => {
            if (cb) {
                cb()
                // cb(event.detail);
            }
        })
    },

    // 没有收到心跳，会触发这里重连
    closeSocket() {
        this.endHeart();

        if(this.ws != null) {
            cc.log('reconnect closeSocket ' + this.ws.readyState)
            if(this.ws.readyState == WebSocket.OPEN) {
                this.ws.close();
            }
            this.ws = null;
            this.cbQueue = {};
        }

        // 强制重连，心跳超次数后
        this.reConnectTwo();
    },
    // 切屏幕，走这里
    closeSocketTwo(iscls) {
        this.endHeart();

        if(this.ws != null) {
            if(this.ws.readyState == WebSocket.OPEN) {
                this.ws.close();
            }
            this.ws = null;
        }

        this.cbQueue = {};
        this.needRelogin = true

        if (iscls) {
            instance = null;
        }
    },
    beginHeart() {
        let self = this;
        if(!this.enableHeart) {
            return;
        }
        if(this.timeoutObj != null) {
            clearInterval(this.timeoutObj);
            this.timeoutObj = null;
        }

        this.timeoutObj = setInterval(function () {
            self.lossHeaderCount += 1
            if (self.lossHeaderCount > 3) {
                // 登录状态才断开
                cc.log('cc.g.userMgr.isLogined==>' + cc.g.userMgr.isLogined)
                if (cc.g.userMgr.isLogined) {
                    self.closeSocket();
                }
                return
            }
            let heartReq = pbHelper.newReq(PB.PROTO.HEART);
            self.send(PB.PROTO.HEART, heartReq);
        }, 5000);
    },

    setHeartEnable() {
        // 只要链接上了，把重链定时器结束，直接使用心跳定时器
        if (this.disConnectObj != null) {
            clearInterval(this.disConnectObj);
            this.disConnectObj = null;
        }

        this.enableHeart = true;
        this.beginHeart();
    },

    endHeart() {
        this.enableHeart = false;
        if(this.timeoutObj != null) {
            clearInterval(this.timeoutObj);
            this.timeoutObj = null;
        }
        this.lossHeaderCount = 0
    },
}

var instance = null;

module.exports = function (host) {
    if (!instance) {
        instance = new Socket(host);
    }
    return instance;
}