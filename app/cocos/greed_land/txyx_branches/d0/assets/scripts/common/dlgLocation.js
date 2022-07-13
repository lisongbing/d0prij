cc.Class({
    extends: cc.Component,

    properties: {
        p1: {
            default: null,
            type: cc.SpriteFrame,
        },
        p2: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    onLoad: function () {
        
    },

    init: function() {
        cc.log('initLocation');

        let players = cc.g.hallMgr.curGameMgr.players;
        if(cc.g.hallMgr.curGameMgr.roomInfo.total == players.length){
            this.node.active = true;
        }

        let Node_player = cc.find("Node_player", this.node);

        this.IP = {};
        for (let i=0;i<4;i++) {
            let node = cc.find("Node_p"+ (i+1) , Node_player);
            cc.log('    ' + 'Node_player' + (i+1));

            this.upLocation(node, i, players[i]);

            if (players[i]) {
                if (!this.IP[players[i].ip]) {
                    this.IP[players[i].ip] = [];
                }
                this.IP[players[i].ip].push({lab:node.IP, name:players[i].name});
            }
        }
        this.upGps(players);
        this.upIP();

        // close btn
        let closeOne = cc.find('Button_close', this.node)
        let closeTwo = cc.find('Button_close_min', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }
    },

    upLocation: function(node, index, player) {
        cc.log('upLocation');
        let n = node;
        let p = player;
        let idx = index;
        let total = cc.g.hallMgr.curGameMgr.roomInfo.total;
        // 空头像
        this.Sprite_headKong = cc.find("Sprite_headKong", n);
        // 头像问号
        //this.Sprite_wenhao = cc.find("Sprite_headbg/Sprite_wenhao", n);
        // 头像背景
        this.Sprite_headbg = cc.find("Sprite_headbg", n)
        // 头像
        this.Sprite_head = cc.find("Sprite_headbg/head", n).getComponent(cc.Sprite);

        this.Sprite_head.node.active = p!=null;
        
        // 名字
        this.Label_name = cc.find("Label_name", n).getComponent(cc.Label);
        this.Label_name.string = p ? p.name :'';
        // IP
        node.IP = cc.find("Label_IP", n).getComponent(cc.Label);
        node.IP.string = p ? 'IP: '+p.ip :'';

        if(idx < total) {
            this.Sprite_headKong.active = false;
            if(p) {
                cc.g.utils.setHead(this.Sprite_head, p.icon);
            }
        } else {
            this.Sprite_headKong.active = true;
        }

        this.Sprite_headbg.active = !this.Sprite_headKong.active;
        //this.Sprite_wenhao.active = !this.Sprite_head.node.active && !this.Sprite_headKong.active;
    },

    upIP: function() {
        cc.log('upIP', this.IP);

        if (!this.Label_ipTip) {
            this.Label_ipTip = cc.find("Label_ipTip", this.node).getComponent(cc.Label);
        }

        let grp = [];
        for (const ip in this.IP) {
            let e = this.IP[ip];
            let names = [];
            if (e.length > 1) {
                e.forEach(elm => {
                    elm.lab.node.color = new cc.Color(0xff, 0x00, 0x00);
                    names.push(elm.name);
                });
                grp.push(names.join(' 和 '));
            } else {
                e[0].lab.node.color = new cc.Color(0x00, 0xff, 0x00);
            }
        }

        this.Label_ipTip.node.active = false;
        this.ipwarn = false;
        if (grp.length > 0) {
            this.Label_ipTip.node.active = true;
            this.Label_ipTip.string = grp.join(', ')+' IP相同，请谨慎游戏！';
            this.ipwarn = true;
        }

        this.locWarn();
    },

    onClickBtnClose: function() {
        this.node.active = false;
    },

    upGps: function(players) {
        {/*
            // GPS距离 通过经纬度获取距离(单位：米)  latitude纬度  longitude经度 isRaw原始数据
            // locationDistence: function (latitude1, longitude1, latitude2, longitude2, isRaw)
            // let arr = [
            //     {
            //         gps:{
            //             latitude:"30.61595",
            //             longitude:"100.06628"
            //         },
            //     },
            //     {
            //         gps:{
            //             latitude:"31.61595",
            //             longitude:"101.06628"
            //         },
            //     },
            //     {
            //         gps:{
            //             latitude:"32.61595",
            //             longitude:"102.06628"
            //         },
            //     },
            //     {
            //         gps:{
            //             latitude:"33.61595",
            //             longitude:"103.06628"
            //         },
            //     }
            // ]

        */}

        this.gpswarn = false;
        
        let disnode =  cc.find("Node_distance", this.node);
        let count = disnode.childrenCount;
        for(let n=0; n<count; n++){
            let _dislabel = cc.find(disnode.children[n].name, disnode).getComponent(cc.Label);
            _dislabel.string = '';
        }
        
        let p = players;
        if(p.length == 1){
            this.locWarn();
            return;
        }
        
        for(let i=0; i<p.length; i++) {
            for(let j=i+1; j<p.length; j++) {
                let suffix = "Label_"+i+''+j;
                let dislab = cc.find(suffix, disnode);
                
                if (!dislab) { continue; }

                this.dislabel = dislab.getComponent(cc.Label);
                let gpsNum = cc.g.utils.locationDistence(p[i].gps.latitude, p[i].gps.longitude, p[j].gps.latitude, p[j].gps.longitude);
                let err = gpsNum.split(':');
                this.dislabel.string = (err[0] && err[0]!='err') ? '距离' + err.join('') : '未知';

                let pt = cc.find('pt', this.dislabel.node).getComponent(cc.Sprite);

                if (err[0] && err[0]!='err') {
                    let dis = parseFloat(err[0]);
                    this.gpswarn = dis<100.0;
                    pt.SpriteFrame = this.p2;
                } else {
                    pt.SpriteFrame = this.p1;
                }
            }
        }

        this.locWarn();
    },

    locWarn: function() {
        cc.g.hallMgr.inGameMenu.onLocationStatu(this.ipwarn || this.gpswarn);
    },
});
