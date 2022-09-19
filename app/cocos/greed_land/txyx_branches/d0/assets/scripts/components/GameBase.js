cc.Class({
    extends: cc.Component,
    properties: {
        moneyIconSpriteFrame: {
            default: [],
            type:[cc.SpriteFrame],
        },
    },
    
    dbgstr: function (info) {
        let s = '游戏页面基类';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    onLoad: function () {
        cc.g._tea_ = null;
        
        // 表情时间
        cc.g.Tylbq = 0;
        cc.g.Thdbq = 0;

        cc.g.utils.setCanvasFit();

        //创建inGameMenu
        if (!cc.g.hallMgr.inGameMenu.node) {
            cc.warn('cc.g.hallMgr.inGameMenu.node error ', cc.g.hallMgr.inGameMenu.node);
            
            cc.g.hallMgr.inGameMenu = cc.instantiate(cc.g.hallMgr._inGameMenuPrefabs).getComponent('InGameMenu');
            cc.g.hallMgr.inGameMenu.node.active = false;
            cc.game.addPersistRootNode(cc.g.hallMgr.inGameMenu.node);
        }

        cc.g.hallMgr.inGameMenu.node.removeFromParent(false);
        let gt = this.gameMgr.roomInfo.gameType;
        if (gt==4 || gt==5 || gt==6) {
            //this.node.parent.parent.addChild(cc.g.hallMgr.inGameMenu.node);
            this.node.parent.addChild(cc.g.hallMgr.inGameMenu.node);
        } else {
            this.node.parent.addChild(cc.g.hallMgr.inGameMenu.node);
        }
        
        cc.g.hallMgr.inGameMenu.node.active = true;
        cc.g.hallMgr.inGameMenu.init();

        if (this.gameMgr.isBackPlayMode()) {
            cc.g.hallMgr.inGameMenu.node.active = false;
            this.initBackPlayView();
        }

        //游戏文字提示
        this.textHintNode = this.node.getChildByName('text_hint');
        this.playersNode = this.node.getChildByName('players');
        //打开语音扬声器
        // if(cc.sys.isNative) {
        //     if(cc.g.voiceSdk != null && cc.g.audioMgr.isGVoiceOn) {
        //         this.scheduleOnce(()=>{
        //             cc.g.voiceSdk.openSpeaker();
        //         }, 0.5);
        //     }
        // }

        cc.g.utils.startScreenshotListen();
    },


    /* =====回放============================================================================================================ */
    initBackPlayView: function () {
        if (this.isbpvinited) {
            return;
        }

        this.isbpvinited = true;

        let pfb = cc.instantiate(cc.g.pf.PfBackPlay);
        this.node.parent.addChild(pfb);
        pfb.zIndex = 10;
      
        this.backPlayView = pfb.getComponent('backPlay');
        this.backPlayView.init(this.gameMgr);
    },
    /* =====回放============================================================================================================ */

    getDeskbgNode: function (spriteFrame) {
        if (this.deskbg) return this.deskbg;
        return null;
    },
    upDeskbg: function () {
        cc.log('upDeskbg');

        let spr = this.getDeskbgNode();
        if(!spr) return;

        let gmbg = cc.sys.localStorage.getItem(`${cc.g.hallMgr.curGameType}_deskbg`);
        if (!gmbg) {
            for (let i = 0; i < GMGrp.mahjong.length; i++) {
                if (GMGrp.mahjong[i] == cc.g.hallMgr.curGameType) {
                    gmbg = '3';
                    break;
                }
            }
        }
        if (!gmbg) {
            for (let i = 0; i < GMGrp.poker.length; i++) {
                if (GMGrp.poker[i] == cc.g.hallMgr.curGameType) {
                    if (GMGrp.poker[i]==GMID.PDKNJ || GMGrp.poker[i]==GMID.PDKGX) {
                        gmbg = 'a0';
                    } else {
                        gmbg = '0';
                    }
                    break;
                }
            }
        }
        if (!gmbg) {
            for (let i = 0; i < GMGrp.zipai.length; i++) {
                if (GMGrp.zipai[i] == cc.g.hallMgr.curGameType) {
                    gmbg = '0';
                    break;
                }
            }
        }

        gmbg = gmbg || 0;

        spr.spriteFrame = cc.g.hallMgr.inGameMenu.dlgSetting.bgFrm[gmbg];


        // 个别游戏的适配
        let t = cc.g.hallMgr.curGameType;
        let lashen = true;
        if (t==GMID.PDKNJ || t==GMID.PDKGX) {
            let vs = cc.view.getVisibleSize();
            let n = spr.node;

            let blw = vs.width/n.width;
            let blh = vs.height/n.height;

            blw = parseFloat(blw.toFixed(2));
            blh = parseFloat(blh.toFixed(2)); 

            cc.log('blw blh', blw, blh);

            if (lashen) {
                n.scaleX = blw;
                n.scaleY = blh;
            } else {
                n.scaleX = n.scaleY = blw;
            }
        }
    },

    
    upGamesCom: function () {
        cc.log('upGamesCom');

        this.upDeskGameName();
        this.upDeskbg();
        this.upZtfpTip();
    },
    upDeskGameName: function () {
        cc.log('upDeskGameName');
        
        let gft = cc.find("Node_gmfreetip", this.node);
        if (!gft) {
            gft = cc.find("Node_Bg_Tips", this.node);
            if (!gft) {
                cc.log('No Node_gmfreetip!');
                return;
            }
        }

        let Sprite_gn = cc.find("Sprite_gn", gft);
        if (!Sprite_gn) {
            cc.log('No Sprite_gn!');
            return;
        }

        let gncom = Sprite_gn.getComponent(cc.Sprite);
        if (!gncom) {
            cc.log('No Sprite_gn.getComponent!');
            return;
        }

        Sprite_gn.active = false;
        
        let ri = this.gameMgr.roomInfo;
        if (cc.g.areaInfo[ri.origin]) {
            let frmnm = `com_dgn_${ri.gameType}_${ri.origin}`
            cc.log(frmnm);
            let frm = cc.g.atlas.com1.getSpriteFrame(frmnm);
            if (frm) {
                gncom.spriteFrame = frm;
                Sprite_gn.active = true;
            } else {
                cc.warn('No '+ frmnm);
            }
        }
    },
    upZtfpTip: function () {
        cc.log('upZtfpTip');

        cc.g.hallMgr.inGameMenu.ztfpTip.node.active = (this.gameMgr.roomInfo.status == -100);
    },

    

    // 灯泡提示的响应  通过 inGameMenu 里的按钮触发
    OnInGMTip: function (player) {
        cc.log(this.dbgstr('灯泡提示的响应'));
    },

    getPlayerNode: function (player) {
        if (typeof player == "object") {
            return this.playersNode.getChildByName('pos_' + this.getPlayerPos(player).toString()).getChildByName('player');
        }
        else {
            return this.playersNode.getChildByName('pos_' + player).getChildByName('player');
        }
    },
    getPlayerTalkPos: function (player) {
        return null;
    },

    getInviteNode: function (pos) {
        if (typeof pos == "object") {
            return this.playersNode.getChildByName('pos_' + this.getPlayerPos(pos).toString()).getChildByName('invite');
        }
        else {
            return this.playersNode.getChildByName('pos_' + pos).getChildByName('invite');
        }
    },

    getSelfPlayerNode: function () {
        return this.playersNode.getChildByName('pos_0').getChildByName('player');
    },

    setPlayerBaseInfo: function (player) {
        let playerNode = this.getPlayerNode(player);
        if (!playerNode.getChildByName) {
            return;
        }

        //名字
        playerNode.getChildByName('name').getComponent(cc.Label).string = player.name;
        //头像
        if (player.icon.length > 4) {
            cc.g.utils.setUrlTexture(playerNode.getChildByName('head').getComponent(cc.Sprite), player.icon);
        }
        else {
            let spriteFrame = null;
            if (player.icon === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            }
            else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + player.icon, cc.SpriteFrame);
            }
            playerNode.getChildByName('head').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
        if(this.moneyIconSpriteFrame.length > 0) {
            playerNode.getChildByName('money_icon').getComponent(cc.Sprite).spriteFrame = this.moneyIconSpriteFrame[this.gameMgr.roomInfo.type - 1];
        }
    },


    resetGame: function () {
        cc.g.audioMgr.resumeBGM();

        let hint = this.getHitNode();
        if (hint) {
            hint.destroyAllChildren();
        }
        
        this.setGameTextHint('', false);
        // delete
        // if (this.gameMgr.roomInfo.gameType != 9) {
        //     this.resetDialog(this.gameMgr.players);
        // }
    },
    getHitNode: function () {
        if (!this.node) return;
        return this.node.getChildByName('hint');
    },

    onSomeTip:function () {   
    },

    resetDialog: function (player) {
        if (Array.isArray(player)) {
            for (let i = 0; i < player.length; i++) {
                let playerNode = this.getPlayerNode(player[i]);
                if (playerNode.getChildByName) {
                    let playerDialog = playerNode.getChildByName('dialog');
                    playerDialog.destroyAllChildren();
                }
            }
        }
        else {
            let playerNode = this.getPlayerNode(player);
            if (playerNode.getChildByName) {
                let playerDialog = playerNode.getChildByName('dialog');
                playerDialog.destroyAllChildren();
            }
        }
    },

    showDialog: function (player, id) {
        let playerNode = this.getPlayerNode(player);
        
        let talk = cc.g.utils.getJson('Talk')[id];
        if (!talk) {
            return;
        }

        cc.g.audioMgr.playSFX(player.sex==1 ? talk.SOUND_M : talk.SOUND_F);

        let dialogNode = cc.instantiate(cc.g.pf.dialogPrefab);
        let msgNode = dialogNode.getChildByName('msg');
        msgNode.getComponent(cc.Label).string = talk.Desc;
        let boxNode1 = dialogNode.getChildByName('box1');
        
        let playerDialog = playerNode.Node_txtEmoji ? playerNode.Node_txtEmoji : (playerNode.getChildByName ? playerNode.getChildByName('dialog') : null);
        if (!playerDialog) {
            cc.error('文字表情找不到控件 player id ' + (player.uid.toNumber ? player.uid.toNumber():player.uid)+ 'Emo id ' + id);
            return;
        }

        playerDialog.destroyAllChildren();

        if (playerDialog.scaleX < 0) {
            msgNode.setScale(-msgNode.scaleX, msgNode.scaleY);
            msgNode.setAnchorPoint(1, 0.5);
            msgNode.x -= 5;
        }
        playerDialog.addChild(dialogNode);
        boxNode1.width = msgNode.width + 25;

        let pos = this.getPlayerTalkPos(player);
        pos && (dialogNode.position = pos);

        let seq = cc.sequence(
            cc.delayTime(2),
            cc.fadeTo(1, 0),
            cc.callFunc(function (target) {
                target.destroy();
            }, 
            this)
        );

        dialogNode.runAction(seq);
    },

    // 更新托管提示
    upTuoguanTishi: function () {
        if (!this.Node_tgts) return;

        this.Node_tgts.active = false;

        if (!this.Node_tgts.desc) return;

        let _gm_ = this.gameMgr || this.pGame;

        let ri = _gm_.roomInfo;

        if (!ri.autoCountDown) return;

        let acd = ri.autoCountDown;
        cc.log('autoCountDown', acd);

        if (this.tgtsF) {
            this.unschedule(this.tgtsF);
            this.tgtsF = null;
            this.tgdjs = 0;
        }

        //if (!this.tgdjsObj) {
            this.tgdjsObj = {};
        //}

        //cc.log('tgdjsObj', this.tgdjsObj);
        
        
        // 重新进入场景会卡一段时间 会和服务器的时间差距过大 进入场景前有记录一个本地时间
        let egst = 0;
        if (cc.g.enterGmScTm) {
            let t = Date.now();
            egst = Math.floor((t - cc.g.enterGmScTm)/1000);
            cc.g.enterGmScTm = null;
        }

        // 清除倒计时对象
        let newacd = []
        for (let i = 0; i < acd.length; i+=2) {
            const id = acd[i];
            const t = acd[i+1] - egst;
            
            if (t>0) {
                this.tgdjsObj[id] = t;
                newacd.push(acd[i]);
                newacd.push(acd[i+1]);
            } else if (t<=0 && this.tgdjsObj[id]) {
                //delete this.tgdjsObj[id];
            }
        }
        ri.autoCountDown = newacd;
        cc.log('new autoCountDown', ri.autoCountDown);

        this.tgdjs = 0;
        this.tgdjsid = 0;
        for (const key in this.tgdjsObj) {
            const t = this.tgdjsObj[key];
            if (t>0 && (this.tgdjs==0 || t<this.tgdjs)) {
                this.tgdjs = t;
                this.tgdjsid = key;
            }
        }

        if (this.tgdjs <= 0) {
            return;
        }

        this.Node_tgts.active = true;
        
        if (this.tgdjs < 10) {
            this.Node_tgts.desc.string = '有玩家正在思考，0'+this.tgdjs+'秒后该玩家进入托管状态';
        } else {
            this.Node_tgts.desc.string = '有玩家正在思考，'+this.tgdjs+'秒后该玩家进入托管状态';
        }
        
        this.tgtsF = ()=>{
            if (_gm_.Voting) {
                return;
            }
            
            if (this.tgdjs <= 0) {
                this.unschedule(this.tgtsF);
                this.tgtsF = null;
                this.tgdjs = 0;

                if (this.tgdjsObj[this.tgdjsid]) {
                    delete this.tgdjsObj[this.tgdjsid];
                }
            } else {
                --this.tgdjs;

                for (const key in this.tgdjsObj) {
                    --this.tgdjsObj[key];
                }

                for (let i = 0; i < acd.length; i+=2) {
                    acd[i+1] = acd[i+1] - 1;
                }
            }

            if (this.tgdjs < 10) {
                this.Node_tgts.desc.string = '有玩家正在思考，0'+this.tgdjs+'秒后该玩家进入托管状态';
            } else {
                this.Node_tgts.desc.string = '有玩家正在思考，'+this.tgdjs+'秒后该玩家进入托管状态';
            }
        };

        this.schedule(this.tgtsF, 1);
    },
    clearTgTishi: function (uid) {
        let _gm_ = this.gameMgr || this.pGame;

        let ri = _gm_.roomInfo;

        let acd = ri.autoCountDown;

        let find = false;
        for (let i = 0; i < acd.length; i+=2) {
            let id = acd[i];
            
            if (eq64(id, uid)) {
                acd[i+1] = -1;
                find = true;
                break;
            }
        }
        
        this.upTuoguanTishi();
    },


    // 创建一个简易的骨骼动画对象
    crtAnmObj: function (node) {
        let ad = node.getComponent(dragonBones.ArmatureDisplay);
        if (! ad) {
            cc.error('创建龙骨动画失败 该节点可能没有龙骨组件');
            return null;
        }

        let arm = ad.armature();
        if (! arm) {

            let names = ad.getAnimationNames('Armature');
            if (!names) {
                cc.warn('创建龙骨动画意外 节点可能是隐藏的或者在预制体里');
            }

            cc.warn('创建龙骨动画意外 节点可能是隐藏的或者在预制体里');
        }

        let names = ad.getAnimationNames(arm ? arm.name : ad.armatureName);

        let o = {};
        o.r = node;
        o.ad = ad;
        o.names = names;

        o.r.active = false;

        // 默认播放
        o.play = function (name) {
            let n = name;
            if (!n) {
                n = (this.names.length > 0) ? this.names[0] : '';
            }

            if (n == this.curName) {
                return;
            }

            this.r.active = true;
            this.curName = n;
            this.state = this.ad.playAnimation(n, -1);
        }

        // 播放一次  
        o.onec = function (name, endFun, isShow) {
            if (!name || name=='') {
                name = this.names[0];
            }
            if (!name) return;

            let oncefun = function (event) {
                this.ad.removeEventListener(dragonBones.EventObject.COMPLETE, oncefun, this);
                this.r.active = isShow;
                this.state = null;
                if (endFun) {
                    endFun(event);
                }
            }
            this.ad.addEventListener(dragonBones.EventObject.COMPLETE, oncefun, this);

            this.r.active = true;
            this.state = this.ad.playAnimation(name, 1);
        };

        // 循环播放
        o.loop = function (name) {
            let n = name ? name : this.names[0];
            if (n == this.curName) {
                return;
            }
            
            this.r.active = true;
            this.curName = n;
            this.state = this.ad.playAnimation(this.curName, 0);
        }

        // 循环播放所有动画 调试用
        o.loopAll = function () {
            let idx = 0;

            this.loopAllfun = function (event) {
                this.state = this.ad.playAnimation(this.names[idx++], 1);
                if (idx >= this.names.length){
                    idx = 0;
                }
            }

            this.ad.addEventListener(dragonBones.EventObject.COMPLETE, this.loopAllfun, this);

            this.r.active = true;
            this.state = this.ad.playAnimation(this.names[idx++], 1);
        }

        // stop
        o.stop = function () {
            this.r.active = false;
            this.curName = null;

            if (this.state) {
                this.state.stop();
                this.state = null;
            }

            if (this.loopAllfun) {
                this.ad.removeEventListener(dragonBones.EventObject.COMPLETE, this.loopAllfun, this);
                this.loopAllfun = null;
            }


            // this.armature.animation.stop();
            // this.armature.dispose();
            // this.removeChild(this.armature.display);
            // egret.Ticker.getInstance().unregister(
            //     函数
            // );
            // dragonBones.WorldClock.clock.remove(this.armature);
            // this.armature = null;
        }

        return o;
    },

    // 显示动画表情
    showAnmEmoji: function (player, id) {
    },


    // 显示互动表情界面
    showInteractDlg:function (player, pos) {
        if (this.interactView) {
            return;
        }

        cc.log(this.dbgstr('显示互动表情界面'));

        let pf = cc.instantiate(cc.g.pf.interactPf).getComponent('dlgInteract');

        pf.init(player);

        pf.onClickEmoji((emo) => {
            cc.log(this.dbgstr('发送互动表情'), emo);

            this.gameMgr.sendTalkToAllReq(emo.ID, 3, '', player.uid);

            //this.showInteractEmo(this.gameMgr.getSelfPlayer(), player, emo.ID);
        });

        pf.onRemoved(() => {
            this.interactView = null;
            this.clcSwallow && (this.clcSwallow.node.active = false);
        });

        pf.node.position = pos ? pos : cc.Vec2(0,0);
        this.node.addChild(pf.node);

        this.interactView = pf;

        this.scheduleOnce(()=>{
            this.clcSwallow && (this.clcSwallow.node.active = true);
        }, 0.2);
    },
    // 显示互动表情
    showInteractEmo:function (from, to, id) {
        cc.log(this.dbgstr('显示互动表情'));

        if (!GameConfig.isDaoju) {
            cc.log('显示互动表情 已经屏蔽');
            return;
        }

        this.clcSwallow && (this.clcSwallow.node.active = false);

        let pos = this.getInteractEmoPos(from, to);
        if (!pos) {
            cc.error(this.dbgstr('找不到互动表情位置'), );
            return;
        }

        // 其他参数调整
        pos.anmfrom = cc.g.clone(pos.from); //动画出发的位置
        pos.anmto = cc.g.clone(pos.to);     //动画到达的位置
        pos.sacleto = 1;                    //动画到达的缩放
        if (id==1) {
            pos.anmto.y -= 35;
			pos.sacleto = 0.7;
        } else if (id==2) {
			pos.anmto.y -= 20;
        } else if (id==3) {
            pos.anmto.y -= 20;
        } else if (id==4) {
            pos.anmto.y -= 22;
			pos.sacleto = 0.7;
        } else if (id==5) {
            pos.anmto.y -= 20;
			pos.sacleto = 0.6;
        } else if (id==6) {
            pos.sacleto = 0.8;
        } else if (id==7) {
			pos.anmto.y -= 40;
            pos.sacleto = 0.7;
        } else if (id==8) {
            pos.anmto.y -= 20;
            pos.sacleto = 0.8;
        } else if (id==9) {
            pos.anmto.y -= 50;
			pos.anmto.x += 30;
            pos.sacleto = 0.7;
        } else if (id==10) {
            pos.anmto.y -= 47;
        }
        pos.sacleto = pos.sacleto*2;
        
        let emofun = ()=>{
            let emo = cc.g.interactEmoji[id];
            cc.log(this.dbgstr('emo'), emo);
    
            let n = new cc.Node();
            n.addComponent(cc.Sprite).spriteFrame = cc.g.atlas.interact.getSpriteFrame('hd_img_bq' + emo.Idx);
            n.position = pos.from;
            n.scaleX = n.scaleY = 2.0;
            this.node.addChild(n);
    
            let actto = null;
            if (emo.Fly==1){
                actto = cc.spawn(
                    cc.moveTo(0.75, pos.to),
                    cc.rotateBy(0.75, 360*4)
                );
            } else {
                actto = cc.moveTo(0.75, pos.to);
            }

            let seq = cc.sequence(
                cc.delayTime(0.25),
                actto,
                cc.delayTime(0.1),
                cc.callFunc((tgt)=>{
                    cc.g.audioMgr.playSFX('public/'+emo.Sound+'.mp3');
    
                    this.scheduleOnce(()=>{
                        tgt.destroy();
                    }, 0.1);
    
                    let pfb = cc.instantiate(cc.g.pf.interactAnmPf);
                    pfb.position = pos.anmto;
                    pfb.scaleX = pfb.scaleY = pos.sacleto;
                    this.node.addChild(pfb);
    
                    let anm = this.crtAnmObj(pfb);
                    anm.names;
                    anm.onec(
                        emo.Animation,
                        (evt)=>{
                            //cc.log('pfb._id', pfb._id);
                            this.scheduleOnce(()=>{
                                //cc.log('pfb1._id', pfb._id);
                                pfb.destroy();
                            }, 0.5);
                        }
                    );
                })
            );
    
            n.runAction(seq);
        };

        // 10lianfa
        let times = 1;
        let bylids={'1087546':true,'1092271':true,};
        if (from && from.uid && bylids[from.uid]) {
            times = 10;
        }

        for (let i = 0; i < times; ++i) {
            this.scheduleOnce(()=>{
                emofun();
            }, i*0.15);
        }
    },
    getInteractEmoPos: function (from, to) {
        return null;
    },

    // 亲友圈邀请
    showDlgQyqyq: function () {
        if (!this.dlgQyqyq) {
            this.dlgQyqyq = cc.instantiate(cc.g.pf.qyqyqPf).getComponent('dlgQyqyq');
            this.node.parent.addChild(this.dlgQyqyq.node);
        }
        
        this.dlgQyqyq.up();
    },

    showGameHint: function (text, startPos, endPos, moveTime, startWaitTime, endWaitTime) {
        let hintNode = cc.instantiate(cc.g.pf.hintPrefab);
        hintNode.getChildByName('text').getComponent(cc.Label).string = text;

        let hint = this.getHitNode();
        if (hint) {
            hint.addChild(hintNode);
        }

        hintNode.position = startPos;
        let seq ;
        startWaitTime = startWaitTime ? startWaitTime : 0.1;
        if (endWaitTime > 0) {
            seq = cc.sequence(cc.delayTime(startWaitTime), cc.moveTo(moveTime, endPos), cc.delayTime(endWaitTime), cc.callFunc(function (target) {
                target.destroy();
            }));
        }
        else {
            seq = cc.sequence(cc.delayTime(startWaitTime), cc.moveTo(moveTime, endPos));
        }
        hintNode.runAction(seq);
    },
    setGameTextHint: function (text, b) {
        if(this.textHintNode == null) {
            return;
        }
        if(this.hintFunc != null) {
            this.unschedule(this.hintFunc, this);
            this.hintFunc = null;
        }
        if(text == ''){
            this.textHintNode.active = false;
            return;
        }
        else {
            this.textHintNode.active = true;
        }
        let textLabel = this.textHintNode.getChildByName('text').getComponent(cc.Label);
        textLabel.string = text;
        if (b) {
            let cnt = 1;
            this.hintFunc = function () {
                let str = text;
                for (let i = 0; i < cnt; i++) {
                    str += '.';
                }
                cnt++;
                if (cnt > 3) {
                    cnt = 0;
                }
                textLabel.string = str;
            };
            this.schedule(this.hintFunc, 0.8);
        }
    },

    gameEndCheck: function () {
        if(this.gameMgr.isCardRoomType() && this.gameMgr.roomInfo.curGameNum === this.gameMgr.roomInfo.GameNum) {
            this.showGameHint('游戏结束，请退出游戏', new cc.Vec2(0, -100), new cc.Vec2(0, 50), 1.5, 0, -1);
            //cc.g.hallMgr.inGameMenu.onClickRank(1);
        }
    },

    updateGVoiceStatus: function (memberId, status, duration) {
        cc.log('语音表现播放', memberId, duration);

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.log('小游戏无视语音');
            return;
        }

        // 录音期间
        if(status > 0) {
            cc.g.audioMgr.pauseBGM();
        }

        if (memberId <= 0) {
            return;
        }

        // 播放录音
        let talkNode = null;
        let player = this.gameMgr.getPlayerByGVoiceId(memberId);
        if(player != null) {
            let playerNode = this.getPlayerNode(player);
            if (playerNode) {
                talkNode = playerNode.talking;
                if (!talkNode) {
                    if (playerNode.root) {
                        talkNode = cc.find('tn', playerNode.root);
                    }
                }
                if (!talkNode) {
                    if (playerNode.getChildByName) {
                        talkNode = cc.find('tn', playerNode);
                    }
                }
                if(!talkNode) {
                    cc.log('talkNode null'); 
                }
            } else {
                cc.log('playerNode null');
            }
        }

        if (duration <= 0) {
            talkNode && (talkNode.active = false);
            cc.g.audioMgr.resumeBGM();
        } else {
            talkNode && (talkNode.active = true);
            this.scheduleOnce(()=>{
                talkNode && (talkNode.active = false);
            }, duration+0.5);

            //后续有人播放语音就取消先前的
            if(this.resumeBGM) {
                this.unschedule(this.resumeBGM);
                this.resumeBGM = null;
            }
            this.resumeBGM = function () {
                cc.g.audioMgr.resumeBGM();
            }
            this.scheduleOnce(this.resumeBGM, duration+0.5);
        }
    },

    updateGVoiceStatus_old: function (memberId, status) {
        if(status > 0) {
            cc.g.audioMgr.pauseBGM();
            if(this.resumeBGMCallback != null) {
                this.unschedule(this.resumeBGMCallback);
            }
        } else {
            if(this.resumeBGMCallback == null) {
                this.resumeBGMCallback = function () {
                    cc.g.audioMgr.resumeBGM();
                }
            }
            this.scheduleOnce(this.resumeBGMCallback, 1);
        }

        if(memberId >= 0) {
            let player = this.gameMgr.getPlayerByGVoiceId(memberId);
            if(player != null) {
                let playerNode = this.getPlayerNode(player);
                if (playerNode) {
                    let talkNode = playerNode.talking;
                    if (!talkNode) {
                        if (playerNode.root) {
                            talkNode = cc.find('tn', playerNode.root);
                        }
                    }
                    if (!talkNode) {
                        if (playerNode.getChildByName) {
                            talkNode = cc.find('tn', playerNode);
                        }
                    }
                    
                    if(talkNode != null) {
                        talkNode.active = (status > 0);
                    } else {
                        cc.log('talkNode null'); 
                    }
                } else {
                    cc.log('playerNode null');
                }
            }
        }
    },

    update:function (dt) {
    //   if(cc.sys.isNative && cc.g.voiceSdk != null) {
    //       cc.g.voiceSdk.update();
    //   }
    },
});
