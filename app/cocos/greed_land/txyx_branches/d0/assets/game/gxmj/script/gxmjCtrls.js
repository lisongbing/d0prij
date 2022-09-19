let DEF = require('gxmjDef');
// 玩家视图
let MajhPlayerView = cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
    },

    start () {
    },

    dbgstr: function (info) {
        let s = '玩家视图 ' + this.index;

        if (this.player) {
            s += ' ' + this.player.d.name + '('+this.player.d.uid+')';
        }

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, idx, page) {
        this.index  = idx;  // 序号
        if (!node) {
            cc.error("MAJHPlayerView init node null");
            return;
        }

        // 根节点 Node_p1/2/3/4
        this.root   = node;
        // 主页面 majh
        this.pPage  = page;
        // gameMgr 上一个页面传过来的
        this.gameMgr  = this.pPage.gameMgr; // 游戏

        // 玩家数据
        this.player = null;

        // // 是否走过断线
        // this.isDuanxian = false;

        this.initView();
        //
        // // 根据局数，隐藏玩家节点
        // this.root.active = (this.index < this.gameMgr.roomInfo.total);

        // 根据局数，隐藏玩家节点
        if (this.gameMgr.roomInfo.total == 2) {
            if (this.index == 1 || this.index == 3) {
                this.root.active = false
            } else {
                this.root.active = true
            }
        } else if (this.gameMgr.roomInfo.total == 3) {
            if (this.index == 2) {
                this.root.active = false
            } else {
                this.root.active = true
            }
        } else {
            this.root.active = (this.index < this.gameMgr.roomInfo.total);
        }
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        //语音动画
        this.talking = cc.find("tn", r);
        this.talking && (this.talking.active = false);
        
        // 头像区域
        let hr = cc.find("Sprite_headArea", r);
        hr.on('touchend', this.onTouchHead, this);

        // 头像背景
        this.Sprite_headbg = cc.find("Sprite_headbg", hr).getComponent(cc.Sprite);
        this.headPos = this.Sprite_headbg.node.convertToWorldSpaceAR(cc.Vec2(0,0));
        this.scheduleOnce(()=>this.headPos = this.Sprite_headbg.node.convertToWorldSpaceAR(cc.Vec2(0,0)), 0.1);//更新
        
        // 头像
        this.Sprite_head = cc.find("Sprite_headbg/Node_headMask/Sprite_head", hr).getComponent(cc.Sprite);

        // 头像问号
        this.Sprite_wenhao = cc.find("Sprite_headbg/Sprite_wenhao", hr);

        // 庄家图片
        this.Sprite_zhuang = cc.find("Sprite_zhuang", hr).getComponent(cc.Sprite);

        // 缺
        this.sprite_hque = cc.find("Sprite_hque", hr);
        this.sprite_hque.active = false

        // 票
        this.Sprite_piao = cc.find("Sprite_piao", hr);
        this.Sprite_piao.active = false

        // 票 imges
        this.Sprite_Piao_Img = cc.find("Sprite_Piao_Img", r);
        this.Sprite_Piao_Img.active = false

        // 胡牌
        this.Sprite_Hu_Img = cc.find("Hu_Img", r);
        this.Sprite_Hu_Img.active = false

        // 名字
        this.Label_name = cc.find("Label_name", hr).getComponent(cc.Label);

        // 离线图片
        this.Sprite_offline = cc.find("Sprite_offline", r);
        this.Sprite_offline.active = false;
        this.Sprite_offline.bg = cc.find("bg", hr);
        this.Sprite_offline.bg.active = this.Sprite_offline.active;
        this.Sprite_offline.time = cc.find("bg/time", hr).getComponent(cc.Label);
        this.Sprite_offline.time.string='0';
        // 托管
        this.Sprite_tuoguan = cc.find("Sprite_tuoguan", hr);
        this.Sprite_tuoguan.active = false;

        // ID
        this.Label_id = cc.find("Sprite_id/Label_id", hr).getComponent(cc.Label);
        // 本局赢分
        this.Label_winNum = cc.find("Label_winNum", hr).getComponent(cc.Label);
        // 已准备
        this.Sprite_readyed = cc.find("Sprite_readyed", r).getComponent(cc.Sprite);

        // 初始化 玩家手牌
        let Node_hcLay = cc.find("Node_hcLay", r);
        // let Node_hcLay = cc.find("holds", r);
        this.handCardView = new MajhHandCardView();
        this.handCardView.init(Node_hcLay, this);

        // 玩家弃牌
        let node_QiPaiView = cc.find("Node_QiPaiView", r);
        // let node_QiPaiView = cc.find("discards", r);
        this.qiCardView = new MajhQiCardView();
        this.qiCardView.init(node_QiPaiView, this);

        // 玩家碰牌
        let node_PongView = cc.find("Node_PongView", r);
        // let node_PongView = cc.find("pongkongs", r);
        this.pongCardView = new MajhPongCardView();
        this.pongCardView.init(node_PongView, this);

        // //  玩家打出去的牌
        this.Node_Qi_Scane = cc.find("Node_Qi_Scane", r);
        this.Node_Qi_Scane.active = false;
        // 显示牌, 可以做动画
        this.majhCardPQi = cc.find("majhCardP0", this.Node_Qi_Scane);
        // this.majhCardPQi_Vaule = cc.find("Sprite_cardVal", this.majhCardPQi).getComponent(cc.Sprite);
        // 初始化选派动画
        this.initAnimations(r);

        // 文字表情节点
        this.Node_txtEmoji = cc.find("Node_txtEmoji", r);

        // 报叫
        // this.Node_BaoJiao = cc.find("Node_BaoJiao", r);
        this.Bao_Jiao_Sprite = cc.find("Node_BaoJiao/Bao_Jiao_Sprite", r);
        this.Bao_Jiao_Sprite.active = false;
        // 赌自摸
        this.DuZiMo_Sprite = cc.find("Node_BaoJiao/DuZiMo_Sprite", r);
        this.DuZiMo_Sprite.active = false;
        // 报杠
        this.Bao_Gang_Sprite = cc.find("Node_BaoJiao/Bao_Gang_Sprite", r);
        this.Bao_Gang_Sprite.active = false;
    },
    //
    onTouchHead: function (event) {
        if (! this.pPage.___dbg) {
            if (! this.player) {
                return;
            }
    
            if (eq64(this.gameMgr.selfUID, this.player.d.uid)) {
                return;
            }
        }

        let pos = this.pPage.node.convertToNodeSpaceAR(this.headPos);
        let fd =  1.8;
        if (this.index == 0) {
            pos.x += 200*fd;
            pos.y += 100*fd;
        } else if (this.index == 1) {
            pos.x -= 200*fd;
            pos.y -= 100*fd;
        } else if (this.index == 2) {
            pos.x -= 200*fd;
            pos.y -= 100*fd;
        } else if (this.index == 3) {
            pos.x += 200*fd;
            pos.y -= 100*fd;
        }

        this.pPage.showInteractDlg(this.player ? this.player.d : null, pos);
    },


    upCoin: function (coin) {
        // 货币数量
        if (coin) {
            let _coin = (coin.toNumber ? coin.toNumber() : coin);
            _coin = (_coin/100).toFixed(2);
            this.Label_winNum.string = parseFloat(_coin);
            if (this.player && this.player.d) {
                this.player.d.money = i64v(coin)
            }
        } else {
            let _coin = (this.player.d ? (this.player.d.money.toNumber ? this.player.d.money.toNumber() : this.player.d.money) : 0);
            _coin = (_coin/100).toFixed(2);
            if (this.player) {
                this.Label_winNum.string = parseFloat(_coin);
            }
        }
    },
    initAnimations: function(root) {
        // 动画对象
        this.paiAnima = {};
        // 动画根节点
        let nodeAninamtion = cc.find("Pai_Anima", root);
        this.paiAnima.nodeAninamtion = nodeAninamtion;

        // 选牌动画
        let anmXuanPai = cc.find("Node_XuanPai", nodeAninamtion);
        this.paiAnima.anmXuanPai = this.pPage.crtAnmObj(anmXuanPai);
        this.paiAnima.anmXuanPai.active = false;
        // 定缺动画
        let dgAninamtion = cc.find("DingQueAnima", root);
        if (!cc.g.utils.judgeObjectEmpty(dgAninamtion)) {
            dgAninamtion.active = false;
            this.paiAnima.dgAninamtion = dgAninamtion;

            // 条 同 万 动画
            let nodeBtnTiao = cc.find("Node_Btn_Tiao/Node_DingQue0", dgAninamtion);
            this.paiAnima.dgAninamtion.nodeBtnTiao = this.pPage.crtAnmObj(nodeBtnTiao);
            this.paiAnima.dgAninamtion.nodeBtnTiao.r.active = false;
            let spriteBtnTiao = cc.find("Node_Btn_Tiao/Sprite_DingQue0", dgAninamtion);
            this.paiAnima.dgAninamtion.spriteBtnTiao = spriteBtnTiao;
            if (this.paiAnima.dgAninamtion.spriteBtnTiao.active) {
                this.paiAnima.dgAninamtion.spriteBtnTiao.active = false;
            }

            let nodeBtnTong = cc.find("Node_Btn_Tong/Node_DingQue1", dgAninamtion);
            this.paiAnima.dgAninamtion.nodeBtnTong = this.pPage.crtAnmObj(nodeBtnTong);
            this.paiAnima.dgAninamtion.nodeBtnTong.r.active = false;
            let spriteBtnTong = cc.find("Node_Btn_Tong/Sprite_DingQue1", dgAninamtion);
            this.paiAnima.dgAninamtion.spriteBtnTong = spriteBtnTong;
            if (this.paiAnima.dgAninamtion.spriteBtnTong.active) {
                this.paiAnima.dgAninamtion.spriteBtnTong.active = false;
            }
            
            let nodeBtnWan = cc.find("Node_Btn_Wan/Node_DingQue2", dgAninamtion);
            this.paiAnima.dgAninamtion.nodeBtnWan = this.pPage.crtAnmObj(nodeBtnWan);
            this.paiAnima.dgAninamtion.nodeBtnWan.r.active = false;
            let spriteBtnWan = cc.find("Node_Btn_Wan/Sprite_DingQue2", dgAninamtion);
            this.paiAnima.dgAninamtion.spriteBtnWan = spriteBtnWan;
            if (this.paiAnima.dgAninamtion.spriteBtnWan.active) {
                this.paiAnima.dgAninamtion.spriteBtnWan.active = false;
            }
        }

        // // 胡牌动画
        // let nodeHuAnima = cc.find("Node_Hu_Anima", nodeAninamtion);
        // this.paiAnima.nodeHuAnima = this.pPage.crtAnmObj(nodeHuAnima);
        // this.paiAnima.nodeHuAnima.active = false;

        //  胡 提 杠
        let nodeHuTiGang = cc.find("Node_Hu_Ti_Gang", nodeAninamtion);
        this.paiAnima.nodeHuTiGang = this.pPage.crtAnmObj(nodeHuTiGang);
        this.paiAnima.nodeHuTiGang.active = false;
    },
    doPlayHuTiGangAnim: function(plaerIndex) {
        // plaerIndex fei 0 peng 1 ti 2 gang 3 hu 4
        const self = this
        self.paiAnima.nodeHuTiGang.active = true;
        let name = 'fei'
        if (plaerIndex == 0) {
            name = 'fei'
        } else if (plaerIndex == 1) {
            name = 'peng'
        } else if (plaerIndex == 2) {
            name = 'ti'
        } else if (plaerIndex == 3) {
            name = 'gang'
        } else if (plaerIndex == 4) {
            name = 'hu'
        }
        self.paiAnima.nodeHuTiGang.onec(name, ()=>{
            self.paiAnima.nodeHuTiGang.active = false;
        }, false);
    },
    // 显示选牌
    showXuanPai: function() {
        this.paiAnima.anmXuanPai.active = true;
        this.paiAnima.anmXuanPai.play(this.paiAnima.anmXuanPai.names[1])
    },
    hiddenXuanPai: function() {
        this.paiAnima.anmXuanPai.stop()
    },
    showDingQueing: function() {
        this.paiAnima.anmXuanPai.active = true;
        this.paiAnima.anmXuanPai.play(this.paiAnima.anmXuanPai.names[0])
    },
    hiddenDingQueing: function() {
        this.paiAnima.anmXuanPai.stop()
    },
    // 显示定缺
    showDingQue: function(queName) {
        if (this.paiAnima && this.paiAnima.dgAninamtion) {
            this.paiAnima.dgAninamtion.active = true
            if (queName === 'tiao') {
                this.paiAnima.dgAninamtion.nodeBtnTiao.play('tiao')
                this.paiAnima.dgAninamtion.nodeBtnTiao.r.active = true;
                this.paiAnima.dgAninamtion.spriteBtnTiao.active = false;

                this.paiAnima.dgAninamtion.nodeBtnTong.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnTong.active = true;

                this.paiAnima.dgAninamtion.nodeBtnWan.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnWan.active = true;
            } else if (queName == 'tong') {
                this.paiAnima.dgAninamtion.nodeBtnTiao.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnTiao.active = true;

                this.paiAnima.dgAninamtion.nodeBtnTong.play('tong')
                this.paiAnima.dgAninamtion.nodeBtnTong.r.active = true;
                this.paiAnima.dgAninamtion.spriteBtnTong.active = false;

                this.paiAnima.dgAninamtion.nodeBtnWan.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnWan.active = true;
            } else if (queName == 'wan') {
                this.paiAnima.dgAninamtion.nodeBtnTiao.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnTiao.active = true;

                this.paiAnima.dgAninamtion.nodeBtnTong.r.active = false;
                this.paiAnima.dgAninamtion.spriteBtnTong.active = true;

                this.paiAnima.dgAninamtion.nodeBtnWan.play('wan')
                this.paiAnima.dgAninamtion.nodeBtnWan.r.active = true;
                this.paiAnima.dgAninamtion.spriteBtnWan.active = false;
            }
        }
    },
    // 隐藏定缺
    hiddenDingQue: function() {
        if (this.paiAnima && this.paiAnima.dgAninamtion) {
            this.paiAnima.dgAninamtion.active = false
        }
    },
    // 更新视图
    upView: function () {
        let d =null;

        if (this.player) {
            d = this.player.d;
        }
        if (cc.g.utils.judgeObjectEmpty(d)) {
            this.Label_name.string = ''
        } else {
            this.Label_name.string = cc.g.utils.getFormatName(d.name)
        }

        //头像
        this.Sprite_head.node.active = d!=null;
        // ID

        if (cc.g.utils.judgeObjectEmpty(d)) {
            this.Label_id.string = '';
        } else {
            this.Label_id.string = d ? d.uid : '';
        }


        this.Sprite_wenhao.active = !this.Sprite_head.node.active;
        
        if ((this.player != null) && (this.player.baoJiaoStatus)) {
            this.Bao_Jiao_Sprite.active = true
        } else {
            this.Bao_Jiao_Sprite.active = false
        }

        if ((this.player != null) && (this.player.duZiMoStatus)) {
            this.DuZiMo_Sprite.active = true
        } else {
            this.DuZiMo_Sprite.active = false
        }
        
        if ((this.player != null) && (this.player.baoGangStatus)) {
            this.Bao_Gang_Sprite.active = true
        } else {
            this.Bao_Gang_Sprite.active = false
        }

        if (d) {
            if (d.icon.length > 4) {
                cc.g.utils.setUrlTexture(this.Sprite_head, d.icon);
            }
            else {
                let spriteFrame = null;
    
                if (d.icon === '') {
                    spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                } else {
                    spriteFrame = cc.loader.getRes('textures/head/head_animal_' + d.icon, cc.SpriteFrame);
                }
    
                this.Sprite_head.spriteFrame = spriteFrame;
            }
        }

        if (!d) {
            this.Sprite_readyed.node.active = false;
            this.Sprite_zhuang.node.active = false;
            this.Sprite_offline.active = false;

            if (this.offlineSch) {
                this.Sprite_offline.active = false;
                this.Sprite_offline.bg.active = false;
                this.unschedule(this.offlineSch, this);
                this.offlineSch = null;
            }

            return;
        }
        this.upReady();
        this.upZhuang();
        this.upPiao();

        this.upOnline();
        this.upTuoguan();

        // 断线回来
        this.doReShowHandleCards();
        // this.upBaoJiao();
        this.pPage.clearHuPaiView()
    },

    // 玩家退出游戏
    quite: function () {

        cc.error("ctrils quite.... player 为空")

        this.player = null;
        // this.root.active = false;
        this.upView();
    },

    // 准备
    upReady: function () {
        if (this.gameMgr.roomInfo.status > DEF.RMSTA.Free.v) {
            this.Sprite_readyed.node.active = false;
            return;
        }

        let p = this.player;
        this.Sprite_readyed.node.active = (p && p.isReady);
    },
    // 更新庄家
    upZhuang: function () {
        if (!this.player || !this.Sprite_zhuang) {
            return;
        }

        if (this.gameMgr.roomInfo.status <= DEF.RMSTA.Free.v) {
            this.Sprite_zhuang.node.active = false;
            return;
        }

        let p = this.player;
        this.Sprite_zhuang.node.active = p.isZhuang;
    },

    upPiao: function () {
        if (!this.player || !this.Sprite_piao) {
            return;
        }
        if (this.gameMgr.roomInfo.status < DEF.RMSTA.Piao2.v) {
            this.Sprite_piao.active = false;
            return;
        }
        let p = this.player;
        if (p.piao == 1) {
            this.Sprite_piao.active = true;
        } else {
            this.Sprite_piao.active = false;
        }
    },

    // 设置玩家
    playerJoin: function (player) {
        this.player = player; // 玩家数据
    },

    // 在线情况 
    upOnline: function () {
        if (! this.player) {
            return;
        }

        if (this.pPage.isbpm) {
            this.Sprite_offline.active = false;
            return;
        }

        let tstr=()=>{
            this.offlinetime = this.offlinetime||0;

            let m = this.offlinetime/60;
            let s = this.offlinetime%60;

            m = Math.floor(m);

            m = m>9 ? m : ('0'+m);
            s = s>9 ? s : ('0'+s);

            return `${m}:${s}`;
        }

        this.Sprite_offline.active = !this.player.d.online;
        this.Sprite_offline.bg.active = this.Sprite_offline.active;
        this.offlinetime = this.player.d.outLineTime || 0;
        this.Sprite_offline.time.string = tstr();

        if (this.offlineSch) {
            this.unschedule(this.offlineSch, this);
            this.offlineSch = null;
        }

        if (this.Sprite_offline.active) {
            this.offlineSch = ()=>{
                ++this.offlinetime;
                ++this.player.d.outLineTime;
                this.Sprite_offline.time.string = tstr();
            };

            this.schedule(this.offlineSch, 1);
        }
    },

    upTuoguan: function () {
        if (! this.player) {
            return;
        }

        if (this.Sprite_tuoguan) {
            this.Sprite_tuoguan.active = (!this.Sprite_offline.active && this.player.d.isAuto);
        }
    },

    // 开始游戏
    onStarGame: function () {
        // 隐藏已经准备
        this.Sprite_readyed.node.active = false;
    },
    // 更新手牌
    upHandCard: function () {
        if (!this.player) {
            return;
        }
        if (this.gameMgr.roomInfo.status <= DEF.RMSTA.Free.v) {
            if (this.handCardView) {
                this.handCardView.clear && this.handCardView.clear(); 
            }
            return;
        }
        if (this.handCardView) {
            this.handCardView.upViews();
        }
    },
    // 开始发牌
    startSendCard(){
        this.handCardView.setData();
        this.handCardView.upHandCardPosition();
        // if (!this.pPage.isbpm) {
        //     this.handCardView.setAniHcGroups();
        //     this.handCardView.animatSendCard();
        // }
        // this.handCardView.setAniHcGroups();
        // this.handCardView.animatSendCard();
        // this.handCardView.showSendCard();
        this.handCardView.upReConnectPos();
    },
    doReShowHandleCards: function () {
        // 隐藏胡的提示
        this.hiddenHuAnimation();

        // 碰 杠
        let pongCards = this.player.pongCards
        if (!cc.g.utils.judgeArrayEmpty(pongCards)) {

            this.pongCardView.pongPaiArr = [];
            this.pongCardView.pongPai_handCard.removeAllChildren(true);

            pongCards.forEach((item)=>{
                this.pongCardView.doAddOnePongPai(item)
            })

            // 再次更新位置
            this.pongCardView.updateAllPongCardPosition();
        } else {
            this.pongCardView.pongPaiArr = [];
            this.pongCardView.pongPai_handCard.removeAllChildren(true);
        }

        // 弃
        let qiCards = this.player.qiCards
        if (!cc.g.utils.judgeArrayEmpty(qiCards)) {

            this.qiCardView.qiPaiArr = []
            this.qiCardView.qiPai_handCard.removeAllChildren(true);

            qiCards.forEach((item)=>{
                this.qiCardView.doAddOneDelay(item, false)
            })

            // let qiPaiArr =  this.qiCardView.qiPaiArr
            // if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
            //     qiPaiArr.forEach((newCard)=>{
            //         newCard.showPoint = false;
            //         cc.find("Node_PointView", newCard).active = false
            //     })
            // }

            // 当前糖出的牌
            let waitCode = this.player.waitCode
            if (!cc.g.utils.judgeObjectEmpty(waitCode)) {
                let qiPaiArr =  this.qiCardView.qiPaiArr
                if (!cc.g.utils.judgeArrayEmpty(qiPaiArr)) {
                    let findCard = null;
                    qiPaiArr.forEach((newCard)=>{
                        // 找到最后一张
                        if (parseInt(newCard.code) == parseInt(waitCode)) {
                            findCard = newCard
                        }
                    })
                    if (findCard) {
                        findCard.showPoint = true; //  是否是当前打出去的牌
                        cc.find("Node_PointView", findCard).active = true
                    }
                }
            }

            // 再次更新位置
            this.qiCardView.updateAllQiPaiCardPosition();
        } else {
            this.qiCardView.qiPaiArr = []
            this.qiCardView.qiPai_handCard.removeAllChildren(true);
        }

        let cardNum = this.player.d.cardNum
        if (cardNum > 0) {
            // 先清空视图
            this.handCardView.hcGroups = []
            this.handCardView.Node_handCard.removeAllChildren(true);
            // 显示手牌
            this.handCardView.upHandCardPosition();
            // this.handCardView.showSendCard();
            let isSelf = this.player.isSelf;
            // if (isSelf) {
            //     this.handCardView.setData();
            // } else {
            //     this.handCardView.setOtherData(cardNum);
            // }

            // 回放，回退修改 add panbin
            if (isSelf || this.pPage.isbpm) {
                this.handCardView.setData();
            } else {
                this.handCardView.setOtherData(cardNum);
            }

            // this.pPage.doShowLeftNumOne()
            // let status = this.player.d.status
            // // 显示这早
            // if (status > 3) {
            //     this.pPage.doShowReConectQueImg(this);
            //     this.pPage.showZeZaoImg(this);
            // }

            // 断线重连后，重新排版
            if (this.index == 0) {

                this.pPage.doShowLeftNumOne()

                // add by panbin
                // this.handCardView.updateAllHandleCardPosition()
                this.pPage.doReSortPai(this, true);
            } else {
                this.handCardView.updateAllHandleCardPosition()
            }

            // 显示头像
            this.sprite_hque.active = true
            this.sprite_hque.getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('small_'+this.player.queIndex);

            this.handCardView.upReConnectPos();

            // 胡牌显示
            this.showReconectHu();
        } else {
            this.handCardView.hcGroups = []
            this.handCardView.Node_handCard.removeAllChildren(true);
        }
        if (!this.pPage.isbpm) {

            // 显示消息
            this.player.showNextMsg();
        }
    },
    showReconectHu: function() {
        // 胡的牌
        let hu = this.player.d.hu
        let status = this.player.d.status
        let huType = this.player.d.huType
        let animationName = null
        if (hu > 0) {
            if (huType == 10) {
                animationName = 'zimo_1'
                this.pPage.ziHuCount++;
            } else if (huType == 20) {
                animationName = 'zimo_2'
                this.pPage.ziHuCount++;
            } else if (huType == 30) {
                animationName = 'zimo_3'
                this.pPage.ziHuCount++;
            } else if (huType == 11) {
                animationName = 'hu_1'
                this.pPage.ziHuCount++;
            } else if (huType == 21) {
                animationName = 'hu_2'
                this.pPage.ziHuCount++;
            } else if (huType == 23) {
                animationName = 'hu_3'
                this.pPage.ziHuCount++;
            }
            // if (!cc.g.utils.judgeStringEmpty(animationName)) {
            //     this.showHuAnimation(animationName);
            //     this.handCardView.showHuPaiView(null, parseInt(hu));
            //     // 保存胡牌
            //     //this.pPage.huCodeArr.push(parseInt(hu))
            //     // // 胡的类型 10 1自摸 20 2自摸 30 3自摸
            //     // // 11 1 点炮 21 2点炮 31 3点炮
            //     // this.huType = this.d.huType;
            //     //
            //     // // 检测是否是胡牌
            // }
            if (this.pPage.isbpm) {
                if ((huType == 10) || huType == 20 || huType == 30 ) { // 自摸
                    if (this.index == 0) {
                        this.handCardView.showHuPaiView(null, parseInt(hu));
                    } else {
                        this.handCardView.showHuPaiBeiView(null, parseInt(hu));
                    }
                } else {
                    this.handCardView.showHuPaiView(null, parseInt(hu));
                }
                // this.handCardView.showHuPaiView(null, parseInt(hu));
            } else {
                if (!cc.g.utils.judgeStringEmpty(animationName)) {
                    this.showHuAnimation(animationName);
                    // this.handCardView.showHuPaiView(null, parseInt(hu));

                    if ((huType == 10) || huType == 20 || huType == 30 ) { // 自摸
                        if (this.index == 0) {
                            this.handCardView.showHuPaiView(null, parseInt(hu));
                        } else {
                            this.handCardView.showHuPaiBeiView(null, parseInt(hu));
                        }
                    } else {
                        this.handCardView.showHuPaiView(null, parseInt(hu));
                    }

                    // 保存胡牌
                    //this.pPage.huCodeArr.push(parseInt(hu))
                    // // 胡的类型 10 1自摸 20 2自摸 30 3自摸
                    // // 11 1 点炮 21 2点炮 31 3点炮
                    // this.huType = this.d.huType;
                    //
                    // // 检测是否是胡牌
                }
            }
        }
    },
    runQueAnimation: function (node, videIndex) {
        const self = this
        node.runAction(
            cc.sequence(
                cc.delayTime(0.3),
                cc.spawn(
                    cc.moveTo(0.3, DEF.AnQueCardPos[videIndex].moveTo.x, DEF.AnQueCardPos[videIndex].moveTo.y),
                    cc.scaleTo(0.25, 0.1),
                    cc.fadeTo(0.3, 255),
                ),
                cc.callFunc(
                    function (params) {
                        // 显示头像
                        self.sprite_hque.active = true
                        self.sprite_hque.getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('small_'+self.player.queIndex);
                        node.active = false
                        node.setScale(1, 1)
                        node.setPosition(DEF.AnQueCardStartPos[videIndex].moveTo.x, DEF.AnQueCardStartPos[videIndex].moveTo.y)
                    },
                    self,null
                )
            )
        )
    },
    showHuAnimation: function (animationName) {
        // const self = this
        // self.paiAnima.nodeHuAnima.active = true;
        // self.paiAnima.nodeHuAnima.onec(animationName, ()=>{
        // }, true);
        this.Sprite_Hu_Img.getComponent(cc.Sprite).spriteFrame = this.pPage.majhAtlas0.getSpriteFrame(animationName);
        this.Sprite_Hu_Img.active = true
    },
    hiddenHuAnimation: function () {
        // const self = this
        // self.paiAnima.nodeHuAnima.active = false;
        // self.paiAnima.nodeHuAnima.stop()
        this.Sprite_Hu_Img.active = false
    },
    // 动画表情
    onAnmEmoji: function (id) {
        let emo = cc.instantiate(cc.g.pf.chatAnmEmojiPf);
        let anm = emo.getComponent(cc.Animation);
        anm.on('stop', (a1, a2, a3)=>{
            //cc.log('stop');

            // 表情没播放完就退出房间
            if (!this.gameMgr.gameScript){
                //cc.log('emo.destroy() !gameScript');
                emo.destroy();
                return;
            }

            //emo.removeFromParent();
            let seq = cc.sequence(
                cc.fadeTo(0.5, 0),
                cc.callFunc(function () {
                    //cc.log('emo.destroy()');
                    emo.destroy();
                }, 
                this)
            );

            emo.runAction(seq);
        });

        if (this.index == 1) {
            //emo.x -= 180;
        }

        let clips = anm.getClips();
        let sta = anm.play(clips[id-1]._name);
        sta.repeatCount = 1;

        this.Node_txtEmoji.addChild(emo);
    },
    // 更新报叫
    upBaoJiao: function(){
        // cc.log("更新报叫------》")
        // this.Bao_Jiao_Sprite.active = false;
        this.DuZiMo_Sprite.active = false;
        this.Bao_Gang_Sprite.active = false;
    },
});
// 玩家手牌视图
let MajhHandCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '手牌视图 ';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, selfView) {
        if (!node) {
            cc.error("node null");
            return;
        }
        // 玩家手牌 根节点 Node_hcLay
        this.root = node;
        // 玩家视图
        this.selfView = selfView;
        this.pPage  = selfView.pPage; // 主页面
        this.gameMgr  = selfView.gameMgr; // 游戏
        this.ox = this.root.x;//original x
        // this.root.active = false;
        this.hcGroups = [];  //手牌分组
        this.aniHcGroups = [];  //动画手牌分组
        // 当前移动麻将id
        // this.touchMoveCode = null;

        // 初始化视图
        this.initView();
    },

    // 初始化视图
    initView: function () {
        let r = this.root;

        if (this.selfView.index == 0) {
            // nodel place
            this.Node_Place = cc.find("Node_Place", r);
            this.Node_Place.active = false
        }


        // 手牌区域
        this.Node_handCard = cc.find("holds", r);

        this.Node_handCard.removeAllChildren(true)

        this.addCardsView();
    },
    // 添加手牌
    addCardsView: function(){
        // 玩家视图上会有个player 数据
        if (this.selfView.player == null) {
            return;
        }
        // 没有手牌数据 返回
        let cards = this.selfView.player.d.cards;
        if (!cards) {
            cc.error(this.dbgstr('没有手牌数据'));
            return
        }
        let startCardNum = 14;  //起始手牌14张

        // 修改下手牌展示权重 ||
        if (this.selfView.index == 1) {
            if (!this.pPage.isbpm) {
                for (let i = 0; i < startCardNum ; i++) {
                    let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
                    c.zIndex = startCardNum - i;
                    this.Node_handCard.addChild(c, startCardNum - i, 'Node_card'+i);
                    this.hcGroups.push(c);
                }
            } else {
                for (let i = 0; i < startCardNum ; i++) {
                    let c = lc_creatOtherHc(this.selfView.index, i, this.pPage);
                    c.zIndex = startCardNum - i
                    c.active = false;
                    this.Node_handCard.addChild(c, startCardNum - i, 'Node_card'+i);
                    this.hcGroups.push(c);
                }
            }
        } else {
            if (this.selfView.index == 0) {
                if (this.pPage.isbpm) {
                    for (let i = 0; i < startCardNum; i++) {
                        let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
                        c.active = false;
                        c.y = 0;
                        this.Node_handCard.addChild(c, 1, 'Node_card' + i);
                        this.hcGroups.push(c);
                    }
                } else {
                    for (let i = 0; i < startCardNum; i++) {
                        let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
                        // 添加点击事件
                        // cc.g.utils.addClickEvent(c, this.pPage.node, 'majh', 'onClickQiPaiBtnClicked', c);
                        c.active = false;
                        // 添加 拖动事件
                        c.on('touchstart', this.onTouchstart, this);
                        c.on('touchmove', this.onTouchmove, this);
                        c.on('touchend', this.onTouchend, this);
                        c.on('touchcancel', this.onTouchcancel, this);
                        this.Node_handCard.addChild(c, 1, 'Node_card' + i);
                        this.hcGroups.push(c);
                    }
                }

            } else {
                if (!this.pPage.isbpm) {
                    for (let i = 0; i < startCardNum; i++) {
                        let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
                        this.Node_handCard.addChild(c, 1, 'Node_card' + i);
                        this.hcGroups.push(c);
                    }
                } else {
                    for (let i = 0; i < startCardNum; i++) {
                        let c = lc_creatOtherHc(this.selfView.index, i, this.pPage);
                        c.zIndex = startCardNum - i
                        c.active = false;
                        this.Node_handCard.addChild(c, 1, 'Node_card' + i);
                        this.hcGroups.push(c);
                    }
                }
            }
        }

        // // 修改下手牌展示权重|| this.selfView.index == 3 ||
        // if (this.selfView.index == 1) {
        //     for (let i = 0; i < startCardNum ; i++) {
        //         let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
        //         this.Node_handCard.addChild(c, startCardNum - i, 'Node_card'+i);
        //         this.hcGroups.push(c);
        //     }
        // } else {
        //     for (let i = 0; i < startCardNum; i++) {
        //         let c = lc_creatHandCard(this.selfView.index, i, this.pPage);
        //         if (this.selfView.index == 0) {
        //             // 添加点击事件
        //             // cc.g.utils.addClickEvent(c, this.pPage.node, 'majh', 'onClickQiPaiBtnClicked', c);
        //             c.active = false
        //
        //             // 添加 拖动事件
        //             c.on('touchstart',  this.onTouchstart, this);
        //             c.on('touchmove',   this.onTouchmove, this);
        //             c.on('touchend',    this.onTouchend, this);
        //             c.on('touchcancel', this.onTouchcancel, this);
        //         }
        //         this.Node_handCard.addChild(c, 1, 'Node_card'+i);
        //         this.hcGroups.push(c);
        //     }
        // }
    },
    // 更新手牌视图
    upViews: function () {
        this.upHandCardPosition();
        // this.setData();
    },
    // 换三张后，重新计算位置
    reCreateHandCard: function(cards, deskId) {
        let grp = this.hcGroups;

        grp.forEach((node)=>{
            node.code = 0;
            node.active = false;
            if (deskId == 0) {
                node.isSelected = false
                node.isQue = false;
                node.zezao = false;
                cc.find("Sprite_Que", node).active = false;
                cc.find("Sprite_ZeZao", node).active = false;
            }
        })

        // for (let i = 0; i < cards.length; i++) {
        //     let cardNode = grp[i];
        //     cardNode.active = true;
        //     if (deskId == 0) {
        //         let code = cards[i];
        //         cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
        //         cardNode.code = code
        //     }
        // }
        for (let i = 0; i < cards.length; i++) {
            let cardNode = grp[i];
            if (!cc.g.utils.judgeObjectEmpty(cardNode)) {
                cardNode.active = true;
                if (deskId == 0) {
                    let code = cards[i];
                    cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
                    cardNode.code = code
                }

                // 回放修改 添加的代码
                if (this.pPage.isbpm) {
                    let code = cards[i];
                    if (deskId == 1) {
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + code);
                    } else if (deskId == 2) {
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + code);
                    } else if (deskId == 3) {
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + code);
                    }
                    cardNode.code = code
                }
            }
        }
    },
    upReloadLastOne: function() {
        // 设置庄稼最后一张牌位置
        if(this.selfView.player){
            let newHcGroups = []
        this.hcGroups.forEach(card => {
            if (card.active) {
                newHcGroups.push(card)
            }
        });
        let cardType = this.pPage.cardType

        let lenght = newHcGroups.length % 3
        if (lenght == 2) {
            let allPaiLenght = newHcGroups.length
            let lastGrpNode = newHcGroups[allPaiLenght-1];  //最后一张牌
            let pox = lastGrpNode.x
            let poy = lastGrpNode.y
            if (this.selfView.index == 0) {
                pox += 25;
            } else if (this.selfView.index == 1) {
                if (cardType == 1) { // 直板
                    // pox -= 4;
                    poy += 20;
                } else {
                    pox -= 4;
                    poy += 20;
                }
            } else if (this.selfView.index == 2) {
                pox -= 10;
            } else if (this.selfView.index == 3) {

                if (cardType == 1) { // 直板
                    // pox -= 8;
                    poy -= 20;
                } else {
                    pox -= 8;
                    poy -= 20;
                }
            }

            lastGrpNode.endPosX = pox
            lastGrpNode.endPosY = poy
            lastGrpNode.setPosition(pox, poy);
        }
        }
    },
    upReConnectPos: function() {
        let newHcGroups = []
        this.hcGroups.forEach(card => {
            if (card.active) {
                newHcGroups.push(card)
            }
        });


        let cardType = this.pPage.cardType

        let lenght = newHcGroups.length % 3
        if (lenght == 2) {
            let allPaiLenght = newHcGroups.length
            let lastGrpNode = newHcGroups[allPaiLenght-1];  //最后一张牌
            let pox = lastGrpNode.x
            let poy = lastGrpNode.y
            if (this.selfView.index == 0) {
                pox += 25;
            } else if (this.selfView.index == 1) {
                if (cardType == 1) { // 直板
                    // pox -= 4;
                    poy += 20;
                } else {
                    pox -= 4;
                    poy += 20;
                }

            } else if (this.selfView.index == 2) {
                pox -= 10;
            } else if (this.selfView.index == 3) {
                if (cardType == 1) { // 直板
                    // pox -= 8;
                    poy -= 20;
                } else {
                    pox -= 8;
                    poy -= 20;
                }
            }

            lastGrpNode.endPosX = pox
            lastGrpNode.endPosY = poy
            lastGrpNode.setPosition(pox, poy);
        }
    },
    // 更新手牌位置
    upHandCardPosition(){
        if(!this.selfView.player){
            return;
        }

        let isZhuang = this.selfView.player.isZhuang;

        // hcGroups 手牌数据为空
        if (cc.g.utils.judgeArrayEmpty(this.hcGroups)) {
            this.addCardsView();
        }

        //  不是庄稼 显示 13张
        let allPaiLenght = this.hcGroups.length
        let lastGrpNode = this.hcGroups[allPaiLenght-1];  //最后一张牌

        if(!isZhuang){
            lastGrpNode.active = false;
        }
    },
    showMoPaiView: function(code, getRelDeskId, palyerViewItem) {
        // 不为空
        if (getRelDeskId == 0 || this.pPage.isbpm) {
            // 任意找一张隐藏的牌
            let finPai = null;
            for (let i = 0; i < this.hcGroups.length; i++) {
                finPai = this.hcGroups[i]
                if (!finPai.active) {
                    finPai.active = true
                    finPai.code = code + 1000; //排序使用
                    break
                }
            }

            if (finPai == null) {
                cc.error('找任意隐藏的牌，出错了..')
            } else {
                // 插入到最后
                // cc.find("Sprite_cardVal", finPai).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);

                // 插入到最后
                if (getRelDeskId == 0) {
                    cc.find("Sprite_cardVal", finPai).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
                    finPai.needAnim = true;
                } else if (getRelDeskId == 1) {
                    cc.find("Sprite_cardVal", finPai).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + code);
                } else if (getRelDeskId == 2) {
                    cc.find("Sprite_cardVal", finPai).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + code);
                } else if (getRelDeskId == 3) {
                    cc.find("Sprite_cardVal", finPai).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + code);
                }

                finPai.needAnim = true;

                this.pPage.doReSortPai(palyerViewItem, false)

                // 拍完后减回来
                if (finPai.code > 1000) {
                    finPai.code -= 1000; //排序使用
                }
            }
        } else {
            // 任意显示一张牌
            for (let i = 0; i < this.hcGroups.length; i++) {
                let finPai = this.hcGroups[i]
                if (!finPai.active) {
                    finPai.active = true
                    break
                }
            }

            // 移动要更新位置
            this.updateAllHandleCardPosition();
        }
    },
    runInsertAction: function(newPaiArr) {
        const self = this
        let runNodeArr = []
        newPaiArr.forEach((code)=>{
            for (let i = 0; i < self.hcGroups.length; i++) {
                let cardNode = self.hcGroups[i]
                if ((parseInt(code) == parseInt(cardNode.code)) && cardNode.active) {
                    // 设置位置
                    let positionX = cardNode.x;
                    let positionY = cardNode.y + DEF.SendCardPos[0].moveBy.y;
                    cardNode.setPosition(positionX, positionY);
                    cardNode.active = false
                    runNodeArr.push(cardNode)
                    break;
                }
            }
        })

        // 执行动画
        this.animatInsertCard(runNodeArr)
    },
    updateAllHandleCardPosition: function() {
        let cardType = this.pPage.cardType
        let userPoint = this.selfView.index
        if (userPoint == 0) {
            // 获取碰、杠的数据
            let pongArr = this.selfView.pongCardView.pongPaiArr;
            let startPosx = 0;
            if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                let lastItem = pongArr[pongArr.length - 1]
                startPosx = lastItem.x + lastItem.width;
            }
            // 加15
            if (startPosx != 0) {
                startPosx += 15
            }

            // 重新绘制位置
            let viewIndex = 0
            this.hcGroups.forEach(card => {
                if (card.active && card.code > 0) {
                    let positionX, positionY
                    positionX = viewIndex * DEF.SendCardPos[userPoint].moveTo.x + startPosx;
                    positionY = DEF.SendCardPos[userPoint].moveTo.y;
                    card.endPosX = positionX
                    card.endPosY = positionY
                    card.isSelected = false;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                }
            });
        } else if (userPoint == 1) {
            if (cardType == 1) { // 直板
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                let startPosy = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 30;
                    startPosy = lastItem.y + lastItem.height + 2;
                }

                // 加 5
                if (startPosy != 0) {
                    startPosy += 5
                }

                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        positionX = DEF.SendCardPos[userPoint].moveZhiBy.x
                        // 回放修改 添加start
                        if (this.pPage.isbpm) {
                            positionX = positionX - 20;
                        }

                        if (startPosy != 0) {
                            positionY = (viewIndex * DEF.SendCardPos[userPoint].moveZhiTo.y) + startPosy;
                            // 回放修改 添加start
                            // if (this.pPage.isbpm) {
                            //     positionY = viewIndex * DEF.SendCardPos[userPoint].moveTo.y + startPosy;
                            // }
                            // 回放修改 添加end
                        } else {
                            positionY = (viewIndex * DEF.SendCardPos[userPoint].moveZhiTo.y)
                            // 回放修改 添加start
                            // if (this.pPage.isbpm) {
                            //     positionY = viewIndex * DEF.SendCardPos[userPoint].moveTo.y;
                            // }
                            // 回放修改 添加end
                        }



                        card.endPosX = positionX
                        card.endPosY = positionY
                        // 回放修改 添加start
                        card.zIndex = 100-viewIndex;
                        // 回放修改 添加end
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            } else {
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                let startPosy = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 30;
                    startPosy = lastItem.y + lastItem.height + 2;
                }

                // 加 5
                if (startPosy != 0) {
                    startPosy += 5
                }

                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        if (startPosx != 0) {
                            positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x)
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 20;
                            }
                            // 回放修改 添加end
                        } else {
                            positionX = DEF.SendCardPos[userPoint].moveBy.x - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x)// - DEF.SendCardPos[userPoint].moveTo.z
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 20;
                            }
                            // 回放修改 添加end
                        }

                        if (startPosy != 0) {
                            positionY = (viewIndex * DEF.SendCardPos[userPoint].moveTo.y) + startPosy;
                            // 回放修改 添加start
                            // if (this.pPage.isbpm) {
                            //     positionY = viewIndex * DEF.SendCardPos[userPoint].moveTo.y + startPosy;
                            // }
                            // 回放修改 添加end
                        } else {
                            positionY = (viewIndex * DEF.SendCardPos[userPoint].moveTo.y)
                            // 回放修改 添加start
                            // if (this.pPage.isbpm) {
                            //     positionY = viewIndex * DEF.SendCardPos[userPoint].moveTo.y;
                            // }
                            // 回放修改 添加end
                        }
                        card.endPosX = positionX
                        card.endPosY = positionY
                        // 回放修改 添加start
                        card.zIndex = 14 - viewIndex;
                        // 回放修改 添加end
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            }
        } else if (userPoint == 2) {
            if (cardType == 1) { // 直板
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 80
                }

                // 重新绘制位置
                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                            positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            }
                            // 回放修改 添加end
                        } else {
                            positionX = DEF.SendCardPos[userPoint].moveZhiBy.x - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = DEF.SendCardPos[userPoint].moveZhiBy.x - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            }
                            // 回放修改 添加end
                        }
                        positionY = DEF.SendCardPos[userPoint].moveTo.y;
                        // 回放修改 添加start
                        // if (this.pPage.isbpm) {
                        //     positionY = -14;
                        // }
                        card.endPosX = positionX
                        card.endPosY = positionY
                        // 回放修改 添加end
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            } else {
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 80
                }

                // 重新绘制位置
                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                            positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            }
                            // 回放修改 添加end
                        } else {
                            positionX = DEF.SendCardPos[userPoint].moveBy.x - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = DEF.SendCardPos[userPoint].moveBy.x - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            }
                            // 回放修改 添加end
                        }
                        positionY = DEF.SendCardPos[userPoint].moveTo.y;
                        // 回放修改 添加start
                        // if (this.pPage.isbpm) {
                        //     positionY = -14;
                        // }
                        card.endPosX = positionX
                        card.endPosY = positionY
                        // 回放修改 添加end
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            }

        } else if (userPoint == 3) {
            if (cardType == 1) { // 直板
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                let startPosy = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 30;
                    startPosy = lastItem.y - lastItem.height;
                }

                // 加 5
                if (startPosy != 0) {
                    startPosy -= 5
                }
                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        if (startPosx != 0) {
                            positionX = DEF.SendCardPos[userPoint].moveZhiBy.x;
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 80
                            }
                            // 回放修改 添加end
                        } else {
                            positionX = DEF.SendCardPos[userPoint].moveZhiBy.x;
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 80
                            }
                            // 回放修改 添加end
                        }

                        if (startPosy != 0) {
                            positionY = startPosy - (viewIndex * DEF.SendCardPos[userPoint].moveZhiTo.y);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionY = positionY - 80
                            }
                            // 回放修改 添加end
                        } else {
                            positionY = DEF.SendCardPos[userPoint].moveBy.y - viewIndex * DEF.SendCardPos[userPoint].moveZhiTo.y
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionY = positionY - 80
                            }
                            // 回放修改 添加end
                        }

                        card.endPosX = positionX
                        card.endPosY = positionY
                        card.zIndex = 14 + viewIndex;
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            } else {
                // 获取碰、杠的数据
                let pongArr = this.selfView.pongCardView.pongPaiArr;
                let startPosx = 0;
                let startPosy = 0;
                if (!cc.g.utils.judgeArrayEmpty(pongArr)) {
                    let lastItem = pongArr[pongArr.length - 1]
                    startPosx = lastItem.x - 30;
                    startPosy = lastItem.y - lastItem.height;
                }

                // 加 5
                if (startPosy != 0) {
                    startPosy -= 5
                }
                let viewIndex = 0
                this.hcGroups.forEach(card => {
                    if (card.active) {
                        let positionX, positionY
                        if (startPosx != 0) {
                            positionX = startPosx - (viewIndex * DEF.SendCardPos[userPoint].moveTo.x);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 80
                            }
                            // 回放修改 添加end
                        } else {
                            positionX = DEF.SendCardPos[userPoint].moveBy.x - viewIndex * DEF.SendCardPos[userPoint].moveTo.x
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionX = positionX - 80
                            }
                            // 回放修改 添加end
                        }

                        if (startPosy != 0) {
                            positionY = startPosy - (viewIndex * DEF.SendCardPos[userPoint].moveTo.y);
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionY = positionY - 80
                            }
                            // 回放修改 添加end
                        } else {
                            positionY = DEF.SendCardPos[userPoint].moveBy.y - viewIndex * DEF.SendCardPos[userPoint].moveTo.y
                            // 回放修改 添加start
                            if (this.pPage.isbpm) {
                                positionY = positionY - 80
                            }
                            // 回放修改 添加end
                        }

                        card.endPosX = positionX
                        card.endPosY = positionY
                        card.zIndex = 14 + viewIndex;
                        card.setPosition(positionX, positionY);
                        viewIndex++
                    }
                });
            }

        }
    },
    changeHandleCardZhong: function(code, index) {
        // 碰牌
        let pongCards = this.selfView.player.pongCards;
        pongCards.forEach((pongItem)=>{
            if (pongItem.code == code) { // 找到杠牌了
                // 修改状态为杠
                pongItem.type = 'peng'
            }
        })

        let grp = this.hcGroups;
        for(let i=0; i<grp.length; i++){
            let cardNode = grp[i];
            if (cardNode.active && (code == cardNode.code)) {
                if (index == 0) {
                    cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + 50);
                } else if (index == 1) {
                    cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + 50);
                } else if (index == 2) {
                    cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + 50);
                } else if (index == 3) {
                    cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + 50);
                }
                // cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + 50);
                cardNode.code = 50
                break;
            }
        }
    },
    // 设置数据
    setData: function () {
        if (this.selfView.player && this.selfView.player.d) {
            let isSelf = this.selfView.player.isSelf;
            let viewIndex = this.selfView.index;
            // if (!isSelf) {
            //     return;
            // }
            // // 显示节点
            // // 手牌数据
            // let cards = this.selfView.player.d.cards;
            // let grp = this.hcGroups;
            //
            // // 重置数据
            // grp.forEach((node)=>{
            //     node.code = 0;
            //     node.active = false;
            //     node.isSelected = false
            //     node.isQue = false;
            //     node.zezao = false;
            //     cc.find("Sprite_Que", node).active = false;
            //     cc.find("Sprite_ZeZao", node).active = false;
            // })
            //
            // for (let i = 0; i < cards.length; i++) {
            //     let cardNode = grp[i];
            //     let code = cards[i];
            //     cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
            //     cardNode.active = true;
            //     cardNode.code = code
            // }
            // 回放修改 注释结束
            let cards = this.selfView.player.d.cards;
            let grp = this.hcGroups;
            if (cc.g.utils.judgeArrayEmpty(grp)) {
                this.addCardsView()
            }
            // 重置数据
            if(isSelf){
                for (let i = 0; i < cards.length; i++) {
                    let cardNode = grp[i];
                    let code = cards[i];
                    if (viewIndex === 0) {  //Node_P0
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + code);
                    }
                    cardNode.isSelected = false
                    cardNode.isQue = false;
                    cardNode.zezao = false;
                    cc.find("Sprite_Que", cardNode).active = false;
                    cc.find("Sprite_ZeZao", cardNode).active = false;
                    cardNode.active = true;
                    cardNode.code = code
                }
            } else if (this.pPage.isbpm && !isSelf) {
                for (let i = 0; i < cards.length; i++) {
                    let cardNode = grp[i];
                    let code = cards[i];
                    if (viewIndex === 1) {  //Node_P1
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + code);
                    } else if (viewIndex === 2) {  ////Node_P2
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + code);
                    } else if (viewIndex === 3) {  //Node_P3
                        cc.find("Sprite_cardVal", cardNode).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + code);
                    }
                    cardNode.active = true;
                    cardNode.code = code
                }
            }
        }
    },
    setOtherData: function (cardNum) {
        let grp = this.hcGroups;

        grp.forEach((node)=>{
            node.code = 0;
            node.active = false;
        })

        for (let i = 0; i < grp.length; i++) {
            let cardNode = grp[i];
            if (i < cardNum) {
                cardNode.active = true;
            }
        }
    },
    // 设置动画手牌分组
    setAniHcGroups: function(){
        // 动画需要
        // this.aniHcGroups = []
        // 第一次落下：[1,2,3,4] 第二次落下：[5,6,7,8] 第三：[9,10,11,12] 第四：[13,14]
        if (this.pPage.isbpm && this.selfView.index !== 0) {
            return;
        }
        let grp = this.selfView.handCardView.hcGroups;
        let count = grp.length;
        for(let m=0,len=count;m<len;m+=4){
            this.aniHcGroups.push(grp.slice(m,m+4));
        }
    },
    // 发牌动画
    animatSendCard: function(){
        // if(!this.selfView.player){
        //     return;
        // }
        if(!this.selfView.player){
            return;
        }
        if (this.pPage.isbpm && this.selfView.index !== 0) {
            return;
        }
        const self = this;
        let grps = this.aniHcGroups;
        let grplen = grps.length - 1
        for(let i=0; i<grps.length;i++){
            for(let j=0; j<grps[i].length; j++){
                let cardNode = grps[i][j];
                if(cardNode.active){
                    cardNode.runAction(
                        cc.sequence(
                            cc.delayTime(i*0.1),
                            cc.spawn(
                                cc.moveTo(0.1, cardNode.endPosX, cardNode.endPosY),
                                cc.fadeTo(0.1, 255)
                            ),
                            cc.callFunc(
                                function (params) {
                                    if (i == grplen) {
                                        // self.pPage.doAutoSelectThreePai(self.selfView);
                                        this.selfView.handCardView.upReloadLastOne();
                                    }
                                },
                                self,null
                            )
                        )
                    )
                }
            }
        }
    },
    animatInsertCard: function(nodeArry){
        const self = this
        // let nodeLen = nodeArry.length - 1
        for(let j=0; j<nodeArry.length; j++){
            let cardNode = nodeArry[j]
            cardNode.active = true;
            cardNode.runAction(
                cc.sequence(
                    // cc.delayTime(j*0.3),
                    cc.delayTime(0.3),
                    cc.spawn(
                        cc.moveTo(0.3, cardNode.endPosX, cardNode.endPosY),
                        cc.fadeTo(0.3, 255)
                    ),
                    cc.callFunc(
                        function (params) {
                            // if (j == nodeLen) {
                            //     self.pPage.doAutoDingQueAlert(self.selfView);
                            // }
                        },
                        self,null
                    )
                )
            )
        }
    },
    animatInsertOneCard: function(nodeItem){
        const self = this
        let nodeArry = []
        for (let i = 0; i < self.hcGroups.length; i++) {
            let cardNode = self.hcGroups[i]
            if ((parseInt(nodeItem.code) == parseInt(cardNode.code)) && cardNode.active) {
                // 设置位置
                let positionX = cardNode.x;
                // let positionY = cardNode.y + DEF.SendCardPos[0].moveBy.y;
                let positionY = DEF.SendCardPos[0].moveBy.y; //cardNode.y +
                cardNode.endPosY = 0;
                cardNode.setPosition(positionX, positionY);
                cardNode.active = false
                nodeArry.push(cardNode)
                break;
            }
        }

        // 执行动画
        if (!cc.g.utils.judgeArrayEmpty(nodeArry)) {
            for(let j=0; j<nodeArry.length; j++){
                let cardNode = nodeArry[j]
                cardNode.active = true;
                cardNode.runAction(
                    cc.sequence(
                        // cc.delayTime(j*0.3),
                        cc.delayTime(0.1),
                        cc.spawn(
                            // cc.moveTo(0.2, cardNode.endPosX, cardNode.endPosY),
                            cc.moveTo(0.1, cardNode.endPosX, 0), //cardNode.endPosY
                            cc.fadeTo(0.1, 255)
                        ),
                        cc.callFunc(
                            function (params) {
                                // 执行完，强制回到0
                                cardNode.setPosition(cardNode.endPosX, 0);
                            },
                            this,null
                        )
                    )
                )
            }
        }
    },
    showHuPaiView: function (palyerViewItem, code, lastV) { // 显示胡牌
        let cardType = this.pPage.cardType

        let positionX, positionY
        let userPoint = this.selfView.index
        let card = lc_creatHuCard(userPoint, this.pPage);
        let zhiVaule = false
        // card vaule
        let cardKeyName = 'majh_cardval_';

        if (userPoint == 0) {
            cardKeyName = 'majh_cardval_';
            zhiVaule = false
        } else if (userPoint == 1) {
            cardKeyName = 'ri_majh_cardval_';
            zhiVaule = true
        }  else if (userPoint == 2) {
            cardKeyName = 'to_majh_cardval_';
            zhiVaule = false
        } else if (userPoint == 3) {
            cardKeyName = 'le_majh_cardval_';
            zhiVaule = true
        }

        cc.find("Sprite_Hu/Sprite_Val", card).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(zhiVaule ? (cardKeyName + code + '_zhi') : (cardKeyName + code));

        let handAllLength = 0
        this.hcGroups.forEach((cardNode)=>{
            if (cardNode.active) {
                handAllLength++
            }
        })
        
        let handLength = handAllLength % 3

        // 当前是可以打牌状态,则先打出最后一张
        if (handLength == 2) {
            let lastOnePai = null;
            // for (let i = 0; i < this.hcGroups.length; i++) {
            //     let groupItem = this.hcGroups[i]
            //     if (groupItem.active) {
            //         lastOnePai = groupItem
            //     }
            // }
            if (userPoint == 0) {
                for (let i = 0; i < this.hcGroups.length; i++) {
                    let groupItem = this.hcGroups[i]
                    if (groupItem.active && (groupItem.code == code)) {
                        lastOnePai = groupItem
                        break;
                    }
                }

            } else {
                let len = this.hcGroups.length
                for (let i = (len -1); i < len; i--) {
                    let groupItem = this.hcGroups[i]
                    if (groupItem.active) {
                        lastOnePai = groupItem
                        break;
                    }
                }
            }
            if (lastOnePai) {
                // 隐藏最后一张
                lastOnePai.active = false;

                // 隐藏最后一张，刷新页面
                this.updateAllHandleCardPosition();
            }
        } else { // 移除弃牌
            if (palyerViewItem && lastV) {
                this.pPage.doRealQiPaiRemove(palyerViewItem, code)
            }
        }

        let lastItem = null;
        this.hcGroups.forEach((cardNode)=>{
            if (cardNode.active) {
                lastItem = cardNode
            }
        })

        if (lastItem) {
            if (userPoint == 0) {
                positionX = lastItem.x + DEF.SendCardPos[userPoint].moveTo.x + DEF.HuCardPos[userPoint].moveTo.x//40
                positionY = lastItem.y
            } else if (userPoint == 1) {
                if (cardType == 1) {
                    positionX = lastItem.x + DEF.HuCardPos[userPoint].moveZhiTo.x//10
                    positionY = lastItem.y + DEF.HuCardPos[userPoint].moveZhiTo.y//55
                } else {
                    positionX = lastItem.x + DEF.HuCardPos[userPoint].moveTo.x//10
                    positionY = lastItem.y + DEF.HuCardPos[userPoint].moveTo.y//55
                }

            } else if (userPoint == 2) {
                positionX = lastItem.x - DEF.SendCardPos[userPoint].moveTo.x - DEF.HuCardPos[userPoint].moveTo.x //40
                positionY = lastItem.y
            } else if (userPoint == 3) {
                if (cardType == 1) {
                    positionX = lastItem.x - DEF.HuCardPos[userPoint].moveZhiTo.x//30
                    positionY = lastItem.y - DEF.HuCardPos[userPoint].moveZhiTo.y//110
                } else {
                     positionX = lastItem.x - DEF.HuCardPos[userPoint].moveTo.x//30
                     positionY = lastItem.y - DEF.HuCardPos[userPoint].moveTo.y//110
                }
              
            }
            card.setPosition(positionX, positionY);
            this.Node_handCard.addChild(card, lastItem.zIndex, 'Node_Hu_Card'+userPoint);
            // 保存胡的什么牌，计算胡牌提示个数
            this.pPage.huCodeArr.push(parseInt(code))
        }
    },

    showHuPaiBeiView: function (palyerViewItem, code, lastV) { // 显示胡牌

        let positionX, positionY
        let userPoint = this.selfView.index
        let card = lc_creatBeiHuCard(userPoint, this.pPage);

        // // card vaule
        // let cardKeyName = 'majh_cardval_';
        //
        // if (userPoint == 0) {
        //     cardKeyName = 'majh_cardval_';
        // } else if (userPoint == 1) {
        //     cardKeyName = 'ri_majh_cardval_';
        // }  else if (userPoint == 2) {
        //     cardKeyName = 'to_majh_cardval_';
        // } else if (userPoint == 3) {
        //     cardKeyName = 'le_majh_cardval_';
        // }
        //
        // cc.find("Sprite_Hu/Sprite_Val", card).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(cardKeyName + code);

        let handAllLength = 0
        this.hcGroups.forEach((cardNode)=>{
            if (cardNode.active) {
                handAllLength++
            }
        })

        let handLength = handAllLength % 3

        // 当前是可以打牌状态,则先打出最后一张
        if (handLength == 2) {
            let lastOnePai = null;
            // for (let i = 0; i < this.hcGroups.length; i++) {
            //     let groupItem = this.hcGroups[i]
            //     if (groupItem.active) {
            //         lastOnePai = groupItem
            //     }
            // }
            if (userPoint == 0) {
                for (let i = 0; i < this.hcGroups.length; i++) {
                    let groupItem = this.hcGroups[i]
                    if (groupItem.active && (groupItem.code == code)) {
                        lastOnePai = groupItem
                        break;
                    }
                }

            } else {
                let len = this.hcGroups.length
                for (let i = (len -1); i < len; i--) {
                    let groupItem = this.hcGroups[i]
                    if (groupItem.active) {
                        lastOnePai = groupItem
                        break;
                    }
                }
            }
            if (lastOnePai) {
                // 隐藏最后一张
                lastOnePai.active = false;

                // 隐藏最后一张，刷新页面
                this.updateAllHandleCardPosition();
            }
        } else { // 移除弃牌
            if (palyerViewItem && lastV) {
                this.pPage.doRealQiPaiRemove(palyerViewItem, code)
            }
        }

        let lastItem = null;
        this.hcGroups.forEach((cardNode)=>{
            if (cardNode.active) {
                lastItem = cardNode
            }
        })

        if (lastItem) {
            if (userPoint == 0) {
                positionX = lastItem.x + DEF.SendCardPos[userPoint].moveTo.x + 10
                positionY = lastItem.y
            } else if (userPoint == 1) {
                positionX = lastItem.x - 10
                positionY = lastItem.y + 65//70
            } else if (userPoint == 2) {
                positionX = lastItem.x - DEF.SendCardPos[userPoint].moveTo.x - 20
                positionY = lastItem.y
            } else if (userPoint == 3) {
                positionX = lastItem.x - 10
                positionY = lastItem.y - 70
            }
            card.setPosition(positionX, positionY);
            this.Node_handCard.addChild(card, lastItem.zIndex, 'Node_Hu_Card'+userPoint);
            // 保存胡的什么牌，计算胡牌提示个数
            this.pPage.huCodeArr.push(parseInt(code))
        }
    },

    // ====点击事件区==============================================================================
    // 点击信息
    touchInfo: function (event, tp) {
        let tg = event.getCurrentTarget();
        tg.uTID = event.touch.__instanceId; //event.touch.getID(); //event.getID();
        tg.uWp  = event.getLocation();
        tg.uPre = event.getPreviousLocation();
        tg.uStart = event.getStartLocation();
        tg.uDelta = event.getDelta();
        // 初始点击点到现在的位置偏移
        tg.uOff = cc.v2(tg.uWp.x - tg.uStart.x, tg.uWp.y - tg.uStart.y);

        return tg;
    },
    // 点击
    onTouchstart: function (event) {
        let tg = this.touchInfo(event, 0);
        // if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay || this.pPage.isAutoHu) {
        //     return
        // }
        if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay) {
            return
        }

        // if (!cc.g.utils.judgeStringEmpty(this.touchMoveCode)) {
        //     if (this.touchMoveCode != tg.code) {
        //         return
        //     }
        // }

        tg.ozIndex = tg.zIndex
        tg.ox = tg.x
        tg.oy = tg.y
    },
    // 移动
    onTouchmove: function (event) {
        let tg = this.touchInfo(event, 1);
        // if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay || this.pPage.isAutoHu) {
        //     return
        // }
        if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay) {
            return
        }

        // if (!cc.g.utils.judgeStringEmpty(this.touchMoveCode)) {
        //     if (this.touchMoveCode != tg.code) {
        //         return
        //     }
        // }

        // 移动判断
        if (!tg.uMoved) {
            if ((Math.abs(tg.uOff.x) >= 5) || (Math.abs(tg.uOff.y) >= 5)) {
                // if (cc.g.utils.judgeStringEmpty(this.touchMoveCode)) {
                //     // 保存id
                //     this.touchMoveCode = tg.code;
                //     tg.uMoved = true;
                // }

                tg.uMoved = true;
            }
        }

        // 没移动 不处理
        if (!tg.uMoved) {
            return;
        }
                    
        this.pPage.resetLoaction()

        tg.zIndex = 9000;
        tg.x = tg.ox+tg.uWp.x - tg.uStart.x;
        tg.y = tg.oy+tg.uWp.y - tg.uStart.y;

        // 检测是否有同样的牌
        this.pPage.doCheckSamePai(tg.code);
    },
    // 结束 节点区域内离开
    onTouchend: function (event) {
        this.jugDaiPai(event)
    },

    // 取消 节点区域外离开
    onTouchcancel: function (event) {
        this.jugDaiPai(event)
    },
    jugDaiPai: function (event) {
        let tg = this.touchInfo(event, 3);
        // if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay || this.pPage.isAutoHu) {
        //     return
        // }
        if (parseInt(tg.code) == 50 || tg.zezao || this.pPage.isAutoPlay) {
            return
        }

        // if (!cc.g.utils.judgeStringEmpty(this.touchMoveCode)) {
        //     if (this.touchMoveCode != tg.code) {
        //         return
        //     }
        // }

        // 点击
        if (tg.uMoved) {
            // 还原位置
            let canPlay = this.pPage.checkCanPlayMj();
            let canPlayStat = this.pPage.getUserPlayerStatus();
            let sz = cc.winSize;
            if (canPlay && (tg.uWp.y > sz.height*0.3) && canPlayStat) {
                //cc.log(tg)
                tg.isSelected = true;
                tg.uMoved = false;
                tg.zIndex = tg.ozIndex;
                // this.touchMoveCode = null;
                this.pPage.onClickQiPaiBtnClicked(tg)
            } else {
                //cc.log(tg)
                tg.isSelected = false;
                tg.x = tg.ox
                tg.y = tg.oy
                tg.zIndex = tg.ozIndex;
                tg.uMoved = false;
                // this.touchMoveCode = null;
            }
        } else {
            // 点击
            tg.uMoved = false;
            tg.zIndex = tg.ozIndex;
            // this.touchMoveCode = null;

            if (!tg.isSelected || tg.y<=0) {
                this.pPage.gameMgr.audio.dianpai();
            }

            this.pPage.onClickQiPaiBtnClicked(tg)
        }
    }

    // ====点击事件区==============================================================================
});

// 玩家弃牌视图
let MajhQiCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '弃牌视图 ';

        if (info) {
            return s + ' :: ' + info;
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, selfView) {
        if (!node) {
            cc.error("node null");
            return;
        }
        // 玩家手牌 根节点 Node_hcLay
        this.root = node;
        // 玩家视图
        this.selfView = selfView;
        this.pPage  = selfView.pPage; // 主页面
        this.gameMgr  = selfView.gameMgr; // 游戏
        this.ox = this.root.x;//original x
        // this.root.active = true;
        this.qiPaiArr = [];  //弃牌分组
        // 初始化视图
        this.initView();
    },

    // 初始化视图
    initView: function () {
        let r = this.root;
        // 手牌区域
        this.qiPai_handCard = cc.find("discards", r);
        this.qiPai_handCard.removeAllChildren(true)
        // 显示弃牌
        // this.addCardsView();
    },
    // 添加棋牌显示
    doAddOneQiPai: function(cardNum) {
        // // 先显示放大后的牌
        // this.selfView.Node_Qi_Scane.active = true;
        // cc.find("Sprite_cardVal", this.selfView.majhCardPQi).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardNum);
        // const self = this
        // // 2s 后执行
        // this.pPage.scheduleOnce(()=>{
        //     self.selfView.Node_Qi_Scane.active = false;
        //     let cards = self.selfView.player.qiCards;
        //     if (self.selfView.index == 0) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 1) {
        //         cards.splice(0, 0, cardNum);
        //     } else if (self.selfView.index == 2) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 3) {
        //         cards.push(cardNum);
        //     }
        //     self.doAddOneDelay(cardNum, true)
        // }, 0.2);
        const self = this
        // 2s 后执行
        // this.pPage.scheduleOnce(()=>{
        //     let cards = self.selfView.player.qiCards;
        //     if (self.selfView.index == 0) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 1) {
        //         cards.splice(0, 0, cardNum);
        //     } else if (self.selfView.index == 2) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 3) {
        //         cards.push(cardNum);
        //     }
        //     self.doAddOneDelay(cardNum, true)
        // }, 0);
        let cards = self.selfView.player.qiCards;
        if (self.selfView.index == 0) {
            cards.push(cardNum)
        } else if (self.selfView.index == 1) {
            cards.splice(0, 0, cardNum);
        } else if (self.selfView.index == 2) {
            cards.push(cardNum)
        } else if (self.selfView.index == 3) {
            cards.push(cardNum);
        }
        self.doAddOneDelay(cardNum, true)
    },
    // 添加棋牌显示
    doAddOneQiPaiLastOne: function(cardNum) {
        // 先显示放大后的牌
        this.selfView.Node_Qi_Scane.active = true;
        cc.find("Sprite_cardVal", this.selfView.majhCardPQi).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardNum);
        const self = this
        // 2s 后执行
        this.pPage.scheduleOnce(()=>{
            self.selfView.Node_Qi_Scane.active = false;
            let cards = self.selfView.player.qiCards;
            if (self.selfView.index == 0) {
                cards.push(cardNum)
            } else if (self.selfView.index == 1) {
                cards.splice(0, 0, cardNum);
            } else if (self.selfView.index == 2) {
                cards.push(cardNum)
            } else if (self.selfView.index == 3) {
                cards.push(cardNum);
            }
            self.doAddOneDelay(cardNum, true)
        }, 1);
        // const self = this
        // 2s 后执行
        // this.pPage.scheduleOnce(()=>{
        //     let cards = self.selfView.player.qiCards;
        //     if (self.selfView.index == 0) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 1) {
        //         cards.splice(0, 0, cardNum);
        //     } else if (self.selfView.index == 2) {
        //         cards.push(cardNum)
        //     } else if (self.selfView.index == 3) {
        //         cards.push(cardNum);
        //     }
        //     self.doAddOneDelay(cardNum, true)
        // }, 0);
        // let cards = self.selfView.player.qiCards;
        // if (self.selfView.index == 0) {
        //     cards.push(cardNum)
        // } else if (self.selfView.index == 1) {
        //     cards.splice(0, 0, cardNum);
        // } else if (self.selfView.index == 2) {
        //     cards.push(cardNum)
        // } else if (self.selfView.index == 3) {
        //     cards.push(cardNum);
        // }
        // self.doAddOneDelay(cardNum, true)
    },
    doAddOneDelay: function(cardNum, showPoint=false) {

        //cc.log('初始化添加麻将....doAddOneDelay...')

        let cardType = this.pPage.cardType

        let positionX, positionY

        let cardIndex = this.selfView.index
        if (cardType == 1) { // 直板
            cardIndex += 4;
        }

        let hcPrefab = this.pPage.qiCardPrefab[cardIndex].prefab;
        let newCard = cc.instantiate(hcPrefab);
        // 总人数
        let total = this.gameMgr.roomInfo.total;

        //cc.log('this.selfView.index-->'+this.selfView.index)
        //cc.log('cardNum-->'+cardNum)
        //cc.log('showPoint-->'+showPoint)

        if (this.selfView.index == 0) {
            if (cardType == 1) { // 直板
                let lastLength = this.qiPaiArr.length;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    if (total == 2) {
                        positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - DEF.qipaiTwoStart;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                    } else {
                        positionX = DEF.QiCardPos[this.selfView.index].moveZhiBy.x - DEF.qipaiStart;
                        positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y;
                    }
                } else {
                    // 最后一个元素
                    newCard.uIdx = lastLength;
                    // 2 个人
                    if (total == 2) {
                        let col = lastLength % DEF.colTwoMax;
                        // 找到最后一个元素的行数
                        let row = parseInt(lastLength / DEF.colTwoMax);
                        positionX = col * DEF.twoQiCardPos[this.selfView.index].moveTo.x - DEF.qipaiTwoStart;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y - (row * DEF.twoQiCardPos[this.selfView.index].moveTo.y)
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        if (lastLength > 0 && lastLength < 8) {
                            row = 0; //10
                            col = lastLength % 8;
                            cardStep = 0;
                        } else if (lastLength >= 8 && lastLength < 16) {
                            row = 1; //12
                            col = (lastLength - 8) % 8;
                            cardStep = 0;
                        } else {
                            row = 2; //18
                            col = (lastLength - 16) % 12;
                            cardStep = -2;
                        }

                        positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x + (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x) - DEF.qipaiStart;
                        // Y
                        positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y - (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                    }
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, 1, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint
                // 放入数组
                this.qiPaiArr.push(newCard);
                // 存入数字
                // cards.push(cardNum)
            } else {
                let lastLength = this.qiPaiArr.length;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    if (total == 2) {
                        positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - DEF.qipaiTwoStart;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                    } else {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - DEF.qipaiStart;
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y;
                    }
                } else {
                    // 最后一个元素
                    newCard.uIdx = lastLength;
                    // 2 个人
                    if (total == 2) {
                        let col = lastLength % DEF.colTwoMax;
                        // 找到最后一个元素的行数
                        let row = parseInt(lastLength / DEF.colTwoMax);
                        positionX = col * DEF.twoQiCardPos[this.selfView.index].moveTo.x - DEF.qipaiTwoStart;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y - (row * DEF.twoQiCardPos[this.selfView.index].moveTo.y)
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        if (lastLength > 0 && lastLength < 8) {
                            row = 0; //10
                            col = lastLength % 8;
                            cardStep = 0;
                        } else if (lastLength >= 8 && lastLength < 16) {
                            row = 1; //12
                            col = (lastLength - 8) % 8;
                            cardStep = 0;
                        } else {
                            row = 2; //18
                            col = (lastLength - 16) % 12;
                            cardStep = -2;
                        }

                        positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x + (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x) - DEF.qipaiStart;
                        // Y
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                    }
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, 1, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint
                // 放入数组
                this.qiPaiArr.push(newCard);
                // 存入数字
                // cards.push(cardNum)
            }

        } else if (this.selfView.index == 1) {
            if (cardType == 1) { // 直板
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;

                if (lastLength == 0) {
                    newCard.uIdx = lastLength;
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x;
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// + 3 * DEF.QiCardPos[this.selfView.index].moveTo.y;
                    zIndex = 6000 - lastLength;
                } else {
                    // zindex ++
                    this.pPage.zIndexQiRightCount += 1;
                    newCard.uIdx = this.pPage.zIndexQiRightCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    if (lastLength > 0 && lastLength < 8) {
                        row = 0; //10
                        col = lastLength % 8;
                        zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        cardStep = 0;
                    } else if (lastLength >= 8 && lastLength < 16) {
                        row = 1; //12
                        col = (lastLength - 8) % 8;
                        zIndex = 5000 - this.pPage.zIndexQiRightCount;

                        cardStep = 0;
                    }  else if (lastLength >= 16 && lastLength < 24) {
                        row = 2; //12
                        col = (lastLength - 16) % 8;
                        zIndex = 4000 - this.pPage.zIndexQiRightCount;

                        cardStep = 0;
                    } else {
                        // row = 3; //18
                        // col = (lastLength - 24) % 8;
                        // zIndex = 3000 - this.pPage.zIndexQiRightCount;
                        // cardStep = 0;
                        row = 0; //10
                        col = (lastLength - 24) % 8;
                        zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        cardStep = 0;
                    }

                    // X
                    // positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    // positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y + cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;

                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y;
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + cardNum + '_zhi');
                cc.find("Node_PointView", newCard).active = showPoint
                // 放入数组
                // this.qiPaiArr.splice(0, 0, newCard);
                this.qiPaiArr.push(newCard);
            } else {
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;

                if (lastLength == 0) {
                    newCard.uIdx = lastLength;
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x;
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// + 3 * DEF.QiCardPos[this.selfView.index].moveTo.y;
                    zIndex = 6000 - lastLength;
                } else {
                    // zindex ++
                    this.pPage.zIndexQiRightCount += 1;
                    newCard.uIdx = this.pPage.zIndexQiRightCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    if (lastLength > 0 && lastLength < 8) {
                        row = 0; //10
                        col = lastLength % 8;
                        zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        cardStep = 0;
                    } else if (lastLength >= 8 && lastLength < 16) {
                        row = 1; //12
                        col = (lastLength - 8) % 8;
                        zIndex = 5000 - this.pPage.zIndexQiRightCount;

                        cardStep = 0;
                    }  else if (lastLength >= 16 && lastLength < 24) {
                        row = 2; //12
                        col = (lastLength - 16) % 8;
                        zIndex = 4000 - this.pPage.zIndexQiRightCount;

                        cardStep = 0;
                    } else {
                        // row = 3; //18
                        // col = (lastLength - 24) % 8;
                        // zIndex = 3000 - this.pPage.zIndexQiRightCount;
                        // cardStep = 0;
                        row = 0; //10
                        col = (lastLength - 24) % 8;
                        zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        cardStep = 0;
                    }

                    // X
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y + cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('ri_majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint
                // 放入数组
                // this.qiPaiArr.splice(0, 0, newCard);
                this.qiPaiArr.push(newCard);
            }
        } else if (this.selfView.index == 2) {
            if (cardType == 1) { // 直板
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;
                this.pPage.zIndexQiTopCount += 1;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    if (total == 2) {
                        positionX = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.x;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.y;
                        zIndex = 6000 - this.pPage.zIndexQiTopCount;
                    } else {
                        positionX = DEF.QiCardPos[this.selfView.index].moveZhiBy.x// - (4 * DEF.QiCardPos[this.selfView.index].moveTo.x);
                        positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y;
                        zIndex = 6000 - this.pPage.zIndexQiTopCount;
                    }
                } else {
                    newCard.uIdx = this.pPage.zIndexQiTopCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    let zIndexRow = 0
                    // 2 个人
                    if (total == 2) {
                        col = lastLength % DEF.colTwoMax;
                        // 找到最后一个元素的行数
                        row = parseInt(lastLength / DEF.colTwoMax);

                        zIndexRow = parseInt(lastLength / DEF.colTwoMax);

                        if (zIndexRow == 0) {
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 1) {
                            zIndex = 5000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 2) {
                            zIndex = 4000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 3) {
                            zIndex = 3000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 4) {
                            zIndex = 2000 - this.pPage.zIndexQiTopCount;
                        }  else {
                            zIndex = 1000 - this.pPage.zIndexQiTopCount;
                        }

                        positionX = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.x - col * DEF.twoQiCardPos[this.selfView.index].moveZhiTo.x;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.y + row * DEF.twoQiCardPos[this.selfView.index].moveZhiTo.y;
                    } else {
                        if (lastLength > 0 && lastLength < 8) {
                            row = 0; //10
                            col = lastLength % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else if (lastLength >= 8 && lastLength < 16) {
                            row = 1; //12
                            col = (lastLength - 8) % 8;
                            cardStep = 0;
                            zIndex = 5000 - this.pPage.zIndexQiTopCount;
                        } else {
                            row = 2; //18
                            col = (lastLength - 16) % 12;
                            cardStep = -2;
                            zIndex = 4000 - this.pPage.zIndexQiTopCount;
                        }

                        positionX = DEF.QiCardPos[this.selfView.index].moveZhiBy.x - col * DEF.QiCardPos[this.selfView.index].moveZhiTo.x - (cardStep * DEF.QiCardPos[this.selfView.index].moveZhiTo.x);
                        // Y
                        positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y + (row * DEF.QiCardPos[this.selfView.index].moveZhiTo.y)
                    }
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);

                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint

                // 放入数组
                this.qiPaiArr.push(newCard);
                // 存入数字
                // cards.push(cardNum)
            } else {
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;
                this.pPage.zIndexQiTopCount += 1;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    if (total == 2) {
                        positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                        zIndex = 6000 - this.pPage.zIndexQiTopCount;
                    } else {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - (4 * DEF.QiCardPos[this.selfView.index].moveTo.x);
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y;
                        zIndex = 6000 - this.pPage.zIndexQiTopCount;
                    }
                } else {
                    newCard.uIdx = this.pPage.zIndexQiTopCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    let zIndexRow = 0
                    // 2 个人
                    if (total == 2) {
                        col = lastLength % DEF.colTwoMax;
                        // 找到最后一个元素的行数
                        row = parseInt(lastLength / DEF.colTwoMax);

                        zIndexRow = parseInt(lastLength / DEF.colTwoMax);

                        if (zIndexRow == 0) {
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 1) {
                            zIndex = 5000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 2) {
                            zIndex = 4000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 3) {
                            zIndex = 3000 - this.pPage.zIndexQiTopCount;
                        } else if (zIndexRow == 4) {
                            zIndex = 2000 - this.pPage.zIndexQiTopCount;
                        }  else {
                            zIndex = 1000 - this.pPage.zIndexQiTopCount;
                        }

                        positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - col * DEF.twoQiCardPos[this.selfView.index].moveTo.x;
                        positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y + row * DEF.twoQiCardPos[this.selfView.index].moveTo.y;
                    } else {
                        if (lastLength > 0 && lastLength < 8) {
                            row = 0; //10
                            col = lastLength % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else if (lastLength >= 8 && lastLength < 16) {
                            row = 1; //12
                            col = (lastLength - 8) % 8;
                            cardStep = 0;
                            zIndex = 5000 - this.pPage.zIndexQiTopCount;
                        } else {
                            row = 2; //18
                            col = (lastLength - 16) % 12;
                            cardStep = -2;
                            zIndex = 4000 - this.pPage.zIndexQiTopCount;
                        }

                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x);
                        // Y
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y + (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                    }
                }

                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);

                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('to_majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint

                // 放入数组
                this.qiPaiArr.push(newCard);
                // 存入数字
                // cards.push(cardNum)
            }

        } else if (this.selfView.index == 3) {
            if (cardType == 1) { // 直板
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.y
                    zIndex = 6000// - newCard.uIdx;
                } else {
                    // 最后一个元素
                    this.pPage.zIndexQiLeftCount += 1;
                    newCard.uIdx = this.pPage.zIndexQiLeftCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    if (lastLength >= 0 && lastLength < 8) {
                        row = 0; //10
                        col = lastLength % 8;
                        zIndex = 6000+this.pPage.zIndexQiLeftCount
                        cardStep = 0;
                    } else if (lastLength >= 8 && lastLength < 16) {
                        row = 1; //12
                        col = (lastLength - 8) % 8;
                        zIndex = 5000+this.pPage.zIndexQiLeftCount

                        cardStep = 0;
                    }  else if (lastLength >= 16 && lastLength < 24) {
                        row = 2; //12
                        col = (lastLength - 16) % 8;
                        zIndex = 4000+this.pPage.zIndexQiLeftCount

                        cardStep = 0;
                    } else {
                        // row = 3; //18
                        // col = (lastLength - 24) % 8;
                        // zIndex = 3000+this.pPage.zIndexQiLeftCount
                        // cardStep = 0;
                        row = 0; //10
                        col = (lastLength - 24) % 8;
                        zIndex = 6000+this.pPage.zIndexQiLeftCount
                        cardStep = 0;
                    }

                    // X
                    // positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    // positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;

                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y;
                }
                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + cardNum + '_zhi');
                cc.find("Node_PointView", newCard).active = showPoint

                // 放入数组
                // this.qiPaiArr.splice(0, 0, newCard);
                this.qiPaiArr.push(newCard);
            } else {
                let zIndex = 0;
                let lastLength = this.qiPaiArr.length;
                if (lastLength == 0) {
                    newCard.uIdx = 0;
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.y
                    zIndex = 6000// - newCard.uIdx;
                } else {
                    // 最后一个元素
                    this.pPage.zIndexQiLeftCount += 1;
                    newCard.uIdx = this.pPage.zIndexQiLeftCount;
                    let row = 0;
                    let col = 0;
                    let cardStep = 0;
                    if (lastLength >= 0 && lastLength < 8) {
                        row = 0; //10
                        col = lastLength % 8;
                        zIndex = 6000+this.pPage.zIndexQiLeftCount
                        cardStep = 0;
                    } else if (lastLength >= 8 && lastLength < 16) {
                        row = 1; //12
                        col = (lastLength - 8) % 8;
                        zIndex = 5000+this.pPage.zIndexQiLeftCount

                        cardStep = 0;
                    }  else if (lastLength >= 16 && lastLength < 24) {
                        row = 2; //12
                        col = (lastLength - 16) % 8;
                        zIndex = 4000+this.pPage.zIndexQiLeftCount

                        cardStep = 0;
                    } else {
                        // row = 3; //18
                        // col = (lastLength - 24) % 8;
                        // zIndex = 3000+this.pPage.zIndexQiLeftCount
                        // cardStep = 0;
                        row = 0; //10
                        col = (lastLength - 24) % 8;
                        zIndex = 6000+this.pPage.zIndexQiLeftCount
                        cardStep = 0;
                    }

                    // X
                    positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                    positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;
                }
                newCard.code = cardNum;
                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.showPoint = showPoint; //  是否是当前打出去的牌
                newCard.setPosition(positionX, positionY);
                this.qiPai_handCard.addChild(newCard, zIndex, 'Node_QiPai'+lastLength);
                // this.addChild(newCard, 1, 'Node_QiPai'+cards.length);
                cc.find("Sprite_cardVal", newCard).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame('le_majh_cardval_' + cardNum);
                cc.find("Node_PointView", newCard).active = showPoint

                // 放入数组
                // this.qiPaiArr.splice(0, 0, newCard);
                this.qiPaiArr.push(newCard);
            }
        }
    },
    updateAllQiPaiCardPosition: function() {
        let cardType = this.pPage.cardType
        // 总人数
        let total = this.gameMgr.roomInfo.total;
        let viewIndex = 0;
        if (this.selfView.index == 0) {
            if (cardType == 1) { // 直板
                this.qiPaiArr.forEach(newCard => {
                    // 找到最后一个元素位置
                    let col = 0
                    let row = 0;
                    let positionX,positionY
                    let cardStep = 0;
                    if (total == 2) {
                        col = viewIndex % DEF.colTwoMax;
                        row = parseInt(viewIndex / DEF.colTwoMax);
                        if (viewIndex == 0) {
                            positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - DEF.qipaiTwoStart;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                        } else {
                            positionX = col * DEF.twoQiCardPos[this.selfView.index].moveTo.x - DEF.qipaiTwoStart;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y - (row * DEF.twoQiCardPos[this.selfView.index].moveTo.y)
                        }
                    } else {
                        // 1
                        if (viewIndex == 0) {
                            positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - DEF.qipaiStart;
                            positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y;
                        } else {
                            if (viewIndex > 0 && viewIndex < 8) {
                                row = 0; //10
                                col = viewIndex % 8;
                                cardStep = 0;
                            } else if (viewIndex >= 8 && viewIndex < 16) {
                                row = 1; //12
                                col = (viewIndex - 8) % 8;
                                cardStep = 0;

                            } else {
                                row = 2; //18
                                col = (viewIndex - 16) % 12;
                                cardStep = -2;
                            }

                            positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x + (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x) - DEF.qipaiStart;
                            // positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x - DEF.qipaiStart;
                            // Y
                            positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y - (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                        }
                    }

                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            } else {
                this.qiPaiArr.forEach(newCard => {
                    // 找到最后一个元素位置
                    let col = 0
                    let row = 0;
                    let positionX,positionY
                    let cardStep = 0;
                    if (total == 2) {
                        col = viewIndex % DEF.colTwoMax;
                        row = parseInt(viewIndex / DEF.colTwoMax);
                        if (viewIndex == 0) {
                            positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - DEF.qipaiTwoStart;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                        } else {
                            positionX = col * DEF.twoQiCardPos[this.selfView.index].moveTo.x - DEF.qipaiTwoStart;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y - (row * DEF.twoQiCardPos[this.selfView.index].moveTo.y)
                        }
                    } else {
                        // 1
                        if (viewIndex == 0) {
                            positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - DEF.qipaiStart;
                            positionY = DEF.QiCardPos[this.selfView.index].moveBy.y;
                        } else {
                            if (viewIndex > 0 && viewIndex < 8) {
                                row = 0; //10
                                col = viewIndex % 8;
                                cardStep = 0;
                            } else if (viewIndex >= 8 && viewIndex < 16) {
                                row = 1; //12
                                col = (viewIndex - 8) % 8;
                                cardStep = 0;

                            } else {
                                row = 2; //18
                                col = (viewIndex - 16) % 12;
                                cardStep = -2;
                            }

                            positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x + (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x) - DEF.qipaiStart;
                            // positionX = col * DEF.QiCardPos[this.selfView.index].moveTo.x - DEF.qipaiStart;
                            // Y
                            positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                        }
                    }

                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            }

        } else if (this.selfView.index == 1) {

            if (cardType == 1) { // 直板
                // zindex 计数器
                this.pPage.zIndexQiRightCount = 0;
                this.qiPaiArr.forEach(newCard => {
                    let positionX, positionY, zIndex
                    if (viewIndex == 0) {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x;
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// + 3 * DEF.QiCardPos[this.selfView.index].moveTo.y;
                        zIndex = 6000;
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        this.pPage.zIndexQiRightCount += 1;
                        if (viewIndex > 0 && viewIndex < 8) {
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        } else if (viewIndex >= 8 && viewIndex < 16) {
                            row = 1; //12
                            col = (viewIndex - 8) % 8;
                            zIndex = 5000 - this.pPage.zIndexQiRightCount;
                            cardStep = 0;
                        }  else if (viewIndex >= 16 && viewIndex < 24) {
                            row = 2; //12
                            col = (viewIndex - 16) % 8;
                            zIndex = 4000 - this.pPage.zIndexQiRightCount;
                            cardStep = 0;
                        } else {
                            // row = 3; //18
                            // col = (viewIndex - 24) % 8;
                            // cardStep = 0;
                            // zIndex = 3000 - this.pPage.zIndexQiRightCount;
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        }

                        // X
                        // positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        // positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y + cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;

                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y;
                    }

                    newCard.zIndex = zIndex;
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            } else {
                // zindex 计数器
                this.pPage.zIndexQiRightCount = 0;
                this.qiPaiArr.forEach(newCard => {
                    let positionX, positionY, zIndex
                    if (viewIndex == 0) {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x;
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// + 3 * DEF.QiCardPos[this.selfView.index].moveTo.y;
                        zIndex = 6000;
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        this.pPage.zIndexQiRightCount += 1;
                        if (viewIndex > 0 && viewIndex < 8) {
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        } else if (viewIndex >= 8 && viewIndex < 16) {
                            row = 1; //12
                            col = (viewIndex - 8) % 8;
                            zIndex = 5000 - this.pPage.zIndexQiRightCount;
                            cardStep = 0;
                        }  else if (viewIndex >= 16 && viewIndex < 24) {
                            row = 2; //12
                            col = (viewIndex - 16) % 8;
                            zIndex = 4000 - this.pPage.zIndexQiRightCount;
                            cardStep = 0;
                        } else {
                            // row = 3; //18
                            // col = (viewIndex - 24) % 8;
                            // cardStep = 0;
                            // zIndex = 3000 - this.pPage.zIndexQiRightCount;
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000 - this.pPage.zIndexQiRightCount;
                        }

                        // X
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x + row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        positionY = col * DEF.QiCardPos[this.selfView.index].moveTo.y  + DEF.QiCardPos[this.selfView.index].moveBy.y + cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;
                    }

                    newCard.zIndex = zIndex;
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            }
        } else if (this.selfView.index == 2) {
            if (cardType == 1) { // 直板
                // zindex 计数器
                this.pPage.zIndexQiTopCount = 0;
                let lastLength = this.qiPaiArr.length;
                this.qiPaiArr.forEach(newCard => {
                    let col = 0
                    let row = 0;
                    let positionX,positionY
                    let cardStep = 0;
                    let zIndexRow = 0;
                    let zIndex = 0;
                    this.pPage.zIndexQiTopCount += 1;
                    if (total == 2) {
                        col = viewIndex % DEF.colTwoMax;
                        row = parseInt(viewIndex / DEF.colTwoMax);
                        if (viewIndex == 0) {
                            positionX = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.x;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.y;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else {
                            col = viewIndex % DEF.colTwoMax;
                            // 找到最后一个元素的行数
                            row = parseInt(viewIndex / DEF.colTwoMax);

                            zIndexRow = parseInt(lastLength / DEF.colTwoMax);

                            if (zIndexRow == 0) {
                                zIndex = 6000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 1) {
                                zIndex = 5000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 2) {
                                zIndex = 4000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 3) {
                                zIndex = 3000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 4) {
                                zIndex = 2000 - this.pPage.zIndexQiTopCount;
                            }  else {
                                zIndex = 1000 - this.pPage.zIndexQiTopCount;
                            }

                            positionX = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.x - col * DEF.twoQiCardPos[this.selfView.index].moveZhiTo.x;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveZhiBy.y + row * DEF.twoQiCardPos[this.selfView.index].moveZhiTo.y;
                        }
                    } else {
                        if (viewIndex == 0) {
                            positionX = DEF.QiCardPos[this.selfView.index].moveZhiBy.x;// - (4 * DEF.QiCardPos[this.selfView.index].moveTo.x);
                            positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else {
                            if (viewIndex > 0 && viewIndex < 8) {
                                row = 0; //10
                                col = viewIndex % 8;
                                cardStep = 0;
                                zIndex = 6000 - this.pPage.zIndexQiTopCount;
                            } else if (viewIndex >= 8 && viewIndex < 16) {
                                row = 1; //12
                                col = (viewIndex - 8) % 8;
                                cardStep = 0;
                                zIndex = 5000 - this.pPage.zIndexQiTopCount;
                            } else {
                                row = 2; //18
                                col = (viewIndex - 16) % 12;
                                cardStep = -2;
                                zIndex = 4000 - this.pPage.zIndexQiTopCount;
                            }

                            positionX = DEF.QiCardPos[this.selfView.index].moveZhiBy.x - col * DEF.QiCardPos[this.selfView.index].moveZhiTo.x - (cardStep * DEF.QiCardPos[this.selfView.index].moveZhiTo.x);
                            // Y
                            positionY = DEF.QiCardPos[this.selfView.index].moveZhiBy.y + (row * DEF.QiCardPos[this.selfView.index].moveZhiTo.y)
                        }
                    }

                    newCard.zIndex = zIndex
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            } else {
                // zindex 计数器
                this.pPage.zIndexQiTopCount = 0;
                let lastLength = this.qiPaiArr.length;
                this.qiPaiArr.forEach(newCard => {
                    let col = 0
                    let row = 0;
                    let positionX,positionY
                    let cardStep = 0;
                    let zIndexRow = 0;
                    let zIndex = 0;
                    this.pPage.zIndexQiTopCount += 1;
                    if (total == 2) {
                        col = viewIndex % DEF.colTwoMax;
                        row = parseInt(viewIndex / DEF.colTwoMax);
                        if (viewIndex == 0) {
                            positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else {
                            col = viewIndex % DEF.colTwoMax;
                            // 找到最后一个元素的行数
                            row = parseInt(viewIndex / DEF.colTwoMax);

                            zIndexRow = parseInt(lastLength / DEF.colTwoMax);

                            if (zIndexRow == 0) {
                                zIndex = 6000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 1) {
                                zIndex = 5000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 2) {
                                zIndex = 4000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 3) {
                                zIndex = 3000 - this.pPage.zIndexQiTopCount;
                            } else if (zIndexRow == 4) {
                                zIndex = 2000 - this.pPage.zIndexQiTopCount;
                            }  else {
                                zIndex = 1000 - this.pPage.zIndexQiTopCount;
                            }

                            positionX = DEF.twoQiCardPos[this.selfView.index].moveBy.x - col * DEF.twoQiCardPos[this.selfView.index].moveTo.x;
                            positionY = DEF.twoQiCardPos[this.selfView.index].moveBy.y + row * DEF.twoQiCardPos[this.selfView.index].moveTo.y;
                        }
                    } else {
                        if (viewIndex == 0) {
                            positionX = DEF.QiCardPos[this.selfView.index].moveBy.x;// - (4 * DEF.QiCardPos[this.selfView.index].moveTo.x);
                            positionY = DEF.QiCardPos[this.selfView.index].moveBy.y;
                            zIndex = 6000 - this.pPage.zIndexQiTopCount;
                        } else {
                            if (viewIndex > 0 && viewIndex < 8) {
                                row = 0; //10
                                col = viewIndex % 8;
                                cardStep = 0;
                                zIndex = 6000 - this.pPage.zIndexQiTopCount;
                            } else if (viewIndex >= 8 && viewIndex < 16) {
                                row = 1; //12
                                col = (viewIndex - 8) % 8;
                                cardStep = 0;
                                zIndex = 5000 - this.pPage.zIndexQiTopCount;
                            } else {
                                row = 2; //18
                                col = (viewIndex - 16) % 12;
                                cardStep = -2;
                                zIndex = 4000 - this.pPage.zIndexQiTopCount;
                            }

                            positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - (cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x);
                            // Y
                            positionY = DEF.QiCardPos[this.selfView.index].moveBy.y + (row * DEF.QiCardPos[this.selfView.index].moveTo.y)
                        }
                    }

                    newCard.zIndex = zIndex
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            }

        } else if (this.selfView.index == 3) {
            if (cardType == 1) { // 直板
                this.pPage.zIndexQiLeftCount = 0;
                this.qiPaiArr.forEach(newCard => {
                    let positionX, positionY, zIndex
                    if (viewIndex == 0) {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.y
                        zIndex = 6000// - newCard.uIdx;
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        this.pPage.zIndexQiLeftCount += 1;
                        if (viewIndex > 0 && viewIndex < 8) {
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000+this.pPage.zIndexQiLeftCount
                        } else if (viewIndex >= 8 && viewIndex < 16) {
                            row = 1; //12
                            col = (viewIndex - 8) % 8;
                            zIndex = 5000+this.pPage.zIndexQiLeftCount
                            cardStep = 0;
                        }  else if (viewIndex >= 16 && viewIndex < 24) {
                            row = 2; //12
                            col = (viewIndex - 16) % 8;
                            zIndex = 4000+this.pPage.zIndexQiLeftCount
                            cardStep = 0;
                        } else {
                            // row = 3; //18
                            // col = (viewIndex - 24) % 8;
                            // zIndex = 3000+this.pPage.zIndexQiLeftCount
                            // cardStep = 0;
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000+this.pPage.zIndexQiLeftCount
                        }

                        // X
                        // positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        // positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;

                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y;
                    }
                    newCard.zIndex = zIndex
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            } else {
                this.pPage.zIndexQiLeftCount = 0;
                this.qiPaiArr.forEach(newCard => {
                    let positionX, positionY, zIndex
                    if (viewIndex == 0) {
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.x
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y// - 3 * DEF.QiCardPos[this.selfView.index].moveTo.y
                        zIndex = 6000// - newCard.uIdx;
                    } else {
                        let row = 0;
                        let col = 0;
                        let cardStep = 0;
                        this.pPage.zIndexQiLeftCount += 1;
                        if (viewIndex > 0 && viewIndex < 8) {
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000+this.pPage.zIndexQiLeftCount
                        } else if (viewIndex >= 8 && viewIndex < 16) {
                            row = 1; //12
                            col = (viewIndex - 8) % 8;
                            zIndex = 5000+this.pPage.zIndexQiLeftCount
                            cardStep = 0;
                        }  else if (viewIndex >= 16 && viewIndex < 24) {
                            row = 2; //12
                            col = (viewIndex - 16) % 8;
                            zIndex = 4000+this.pPage.zIndexQiLeftCount
                            cardStep = 0;
                        } else {
                            // row = 3; //18
                            // col = (viewIndex - 24) % 8;
                            // zIndex = 3000+this.pPage.zIndexQiLeftCount
                            // cardStep = 0;
                            row = 0; //10
                            col = viewIndex % 8;
                            cardStep = 0;
                            zIndex = 6000+this.pPage.zIndexQiLeftCount
                        }

                        // X
                        positionX = DEF.QiCardPos[this.selfView.index].moveBy.x - col * DEF.QiCardPos[this.selfView.index].moveTo.x - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.x - row * DEF.QiCardPos[this.selfView.index].moveTo.z;
                        positionY = DEF.QiCardPos[this.selfView.index].moveBy.y - col * DEF.QiCardPos[this.selfView.index].moveTo.y - cardStep * DEF.QiCardPos[this.selfView.index].moveTo.y;
                    }
                    newCard.zIndex = zIndex
                    newCard.setPosition(positionX, positionY);

                    viewIndex++
                });
            }

        }
    },
});

// 玩家碰牌视图
let MajhPongCardView = cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '碰牌视图 ';

        if (info) {
            return s + ' :: ' + info;
        }

        return s + ' ';
    },

    //初始化View
    init: function (node, selfView) {
        if (!node) {
            cc.error("node null");
            return;
        }
        // 玩家手牌 根节点 Node_hcLay
        this.root = node;
        // 玩家视图
        this.selfView = selfView;
        this.pPage  = selfView.pPage; // 主页面
        this.gameMgr  = selfView.gameMgr; // 游戏
        this.ox = this.root.x;//original x
        // this.root.active = true;
        this.pongPaiArr = [];  //碰牌分组
        // 初始化视图
        this.initView();
    },

    // 初始化视图
    initView: function () {
        let r = this.root;
        // 手牌区域
        this.pongPai_handCard = cc.find("pongkongs", r);
        this.pongPai_handCard.removeAllChildren(true)
    },
    // 更新手牌视图
    upViews: function () {
        this.upPongCardPosition();
        this.setData();
    },
    // 提操作
    doChangeZhongPai: function(code) {
        let cardType = this.pPage.cardType

        let cardKeyName = 'majh_cardval_';
        let riAndLeft = false
        if (this.selfView.index == 0) {
            cardKeyName = 'majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 1) {
            cardKeyName = 'ri_majh_cardval_';
            riAndLeft = true
        }  else if (this.selfView.index == 2) {
            cardKeyName = 'to_majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 3) {
            cardKeyName = 'le_majh_cardval_';
            riAndLeft = true
        }

        for (let i = 0; i < this.pongPaiArr.length; i++) {
            let lastOneItem = this.pongPaiArr[i]
            if (lastOneItem.code == code) {
                lastOneItem.type = 'peng'
                let Layout_Top = cc.find("Layout_Top", lastOneItem)
                cc.find("Sprite_Peng0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
                cc.find("Sprite_Peng1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
                cc.find("Sprite_Peng2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
                break;
            }
        }
    },
    // 手里的牌，直接就杠了
    doAddGangPai: function(code, index) {
        let cardIndex = this.selfView.index;
        let cardType = this.pPage.cardType
        if (cardType == 1) { // 直板
            cardIndex += 4;
        }

        let hcPrefab = this.pPage.gangCardPrefab[cardIndex].prefab;
        let newCard = cc.instantiate(hcPrefab);
        newCard.uIdx = index;
        let lastOneItem = this.pongPaiArr[index]
        this.pongPai_handCard.removeChild(lastOneItem, true)
        this.pongPai_handCard.addChild(newCard, index, 'Node_Pong_Card'+index);

        let Layout_Top = cc.find("Layout_Top", newCard)

        let cardKeyName = 'majh_cardval_';
        let riAndLeft = false
        if (this.selfView.index == 0) {
            cardKeyName = 'majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 1) {
            cardKeyName = 'ri_majh_cardval_';
            riAndLeft = true
        }  else if (this.selfView.index == 2) {
            cardKeyName = 'to_majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 3) {
            cardKeyName = 'le_majh_cardval_';
            riAndLeft = true
        }

        cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
        cc.find("Sprite_Gang1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
        cc.find("Sprite_Gang2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));
        cc.find("Sprite_Gang3/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + code + '_zhi') : (cardKeyName + code));

        newCard.code = code
        newCard.type = 'mkang'

        // 放入数组
        this.pongPaiArr.splice(index, 1, newCard);

        // 更新位置
        this.updateAllPongCardPosition();
    },
    doRemoveOnePongPai: function(cardObj) {
        // this.pongPai_handCard.children
        let chids = this.pongPai_handCard.children;
        if (!cc.g.utils.judgeArrayEmpty(chids)) {
            for (let i = 0; i < chids.length; i++) {
                let child = chids[i];
                if (child.code === cardObj.code) {
                    child.removeFromParent(true);
                    // this.pongPai_handCard.removeFromParent(true);
                }
            }
        }
        // this.pongPai_handCard.removeChildByTag('Node_Pong_Card'+cardObj.code, true);
    },
    // 添加棋牌显示
    doAddOnePongPai: function(cardObj) {
        let cardIndex = this.selfView.index;
        let cardType = this.pPage.cardType
        if (cardType == 1) { // 直板
            cardIndex += 4;
        }

        let positionX, positionY
        let hcPrefab = null;
        if (cardObj.type == 'peng') {
            hcPrefab = this.pPage.pongCardPrefab[cardIndex].prefab;
        } else if (cardObj.type == 'mkang') { // 明杠
            hcPrefab = this.pPage.gangCardPrefab[cardIndex].prefab;
        } else if (cardObj.type == 'akang') { // 暗杠
            hcPrefab = this.pPage.angangCardPrefab[cardIndex].prefab;
        } else if (cardObj.type == 'fei') { // 飞
            hcPrefab = this.pPage.pongCardPrefab[cardIndex].prefab;
        }
        let newCard = cc.instantiate(hcPrefab);

        let cardsLength = this.pongPaiArr.length;//cards.length

        let cardKeyName = 'majh_cardval_';
        let riAndLeft = false

        if (this.selfView.index == 0) {
            if (cardsLength == 0) { // 第一次添加
                newCard.uIdx = 0;
                positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
            } else {
                newCard.uIdx = cardsLength - 1;
                let pongLength = this.pongPaiArr.length - 1;
                let lastOneItem = this.pongPaiArr[pongLength]

                positionX = lastOneItem.x + lastOneItem.width + 15;
                positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
            }

            newCard.endPosX = positionX;
            newCard.endPosY = positionY;
            newCard.setPosition(positionX, positionY);

            this.pongPai_handCard.addChild(newCard, 1, 'Node_Pong_Card'+cardObj.code);

            cardKeyName = 'majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 1) {
            if (cardType == 1) { // 直板
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveByZhi.x;
                    positionY = DEF.PongCardPos[this.selfView.index].moveByZhi.y;
                    if (this.pPage.isbpm) {
                        positionX -= 30;
                    }
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = DEF.PongCardPos[this.selfView.index].moveByZhi.x;
                    positionY = lastOneItem.y + newCard.height;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);

                this.pongPai_handCard.addChild(newCard, 200 - newCard.uIdx, 'Node_Pong_Card'+cardObj.code);
            } else {
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                    positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = lastOneItem.x - DEF.PongCardPos[this.selfView.index].moveTo.x;
                    positionY = lastOneItem.y + newCard.height;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);

                this.pongPai_handCard.addChild(newCard, 200 - newCard.uIdx, 'Node_Pong_Card'+cardObj.code);
            }

            cardKeyName = 'ri_majh_cardval_';
            riAndLeft = true
        }  else if (this.selfView.index == 2) {
            if (cardType == 1) { // 直板
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveZhiBy.x - newCard.width;
                    positionY = DEF.PongCardPos[this.selfView.index].moveZhiBy.y;
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = lastOneItem.x - newCard.width - 8;
                    positionY = DEF.PongCardPos[this.selfView.index].moveZhiBy.y;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);

                this.pongPai_handCard.addChild(newCard, 1, 'Node_Pong_Card'+cardObj.code);
                cardKeyName = 'to_majh_cardval_';
                riAndLeft = false
            } else {
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveBy.x - newCard.width;
                    positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = lastOneItem.x - newCard.width - 8;
                    positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);

                this.pongPai_handCard.addChild(newCard, 1, 'Node_Pong_Card'+cardObj.code);
                cardKeyName = 'to_majh_cardval_';
                riAndLeft = false
            }

        } else if (this.selfView.index == 3) {
            if (cardType == 1) { // 直板
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveByZhi.x;
                    positionY = DEF.PongCardPos[this.selfView.index].moveByZhi.y;
                    if (this.pPage.isbpm) {
                        positionX += 10;
                    }
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = lastOneItem.x
                    positionY = lastOneItem.y - lastOneItem.height;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);
                //200 - newCard.uIdx
                this.pongPai_handCard.addChild(newCard, 1, 'Node_Pong_Card'+cardObj.code);
            } else {
                if (cardsLength == 0) { // 第一次添加
                    newCard.uIdx = 0;
                    positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                    positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                } else {
                    newCard.uIdx = cardsLength - 1;
                    let pongLength = this.pongPaiArr.length - 1;
                    let lastOneItem = this.pongPaiArr[pongLength]
                    positionX = lastOneItem.x - DEF.PongCardPos[this.selfView.index].moveTo.x// - 8;
                    positionY = lastOneItem.y - lastOneItem.height;
                }

                newCard.endPosX = positionX;
                newCard.endPosY = positionY;
                newCard.setPosition(positionX, positionY);
                //200 - newCard.uIdx
                this.pongPai_handCard.addChild(newCard, 1, 'Node_Pong_Card'+cardObj.code);
            }

            cardKeyName = 'le_majh_cardval_';
            riAndLeft = true
        }

        let Layout_Top = cc.find("Layout_Top", newCard)

        if (cardObj.type == 'peng') {
            cc.find("Sprite_Peng0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Peng1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Peng2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
        } else if (cardObj.type == 'mkang') { // 明杠
            cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Gang1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Gang2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Gang3/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
        } else if (cardObj.type == 'akang') { // 暗杠
            if (this.selfView.index == 0) {
                cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            } else if (this.selfView.index == 1) {
                cc.find("Sprite_Gang3/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            } else if (this.selfView.index == 2) {
                cc.find("Sprite_Gang3/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            } else if (this.selfView.index == 3) {
                cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            }
        } else if (cardObj.type == 'fei') {
            cc.find("Sprite_Peng0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Peng1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardObj.code + '_zhi') : (cardKeyName + cardObj.code));
            cc.find("Sprite_Peng2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = this.pPage.majhCardAtlas0.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + 50 + '_zhi') : (cardKeyName + 50));
        }
        newCard.code = cardObj.code
        newCard.type = cardObj.type
        newCard.gtype = cardObj.gtype
        // 放入数组
        this.pongPaiArr.push(newCard);
    },
    // 更新手牌位置
    upPongCardPosition(){
        if(!this.selfView.player){
            return;
        }
    },
    updateAllPongCardPosition: function() {
        let viewIndex = 0;
        let cardType = this.pPage.cardType
        const self = this
        if (this.selfView.index == 0) {
            this.pongPaiArr.forEach(card => {
                let positionX, positionY
                if (viewIndex > 0) {
                    let nodeMode = self.pongPaiArr[viewIndex - 1]
                    positionX = nodeMode.x + nodeMode.width + 15;
                } else {
                    positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                }
                positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;

                card.endPosX = positionX;
                card.endPosY = positionY;
                card.setPosition(positionX, positionY);
                viewIndex++
            });
        } else if (this.selfView.index == 1) {
            if (cardType == 1) { // 直板
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x
                        positionY = nodeMode.y + nodeMode.height + 6;

                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveByZhi.x;
                        positionY = DEF.PongCardPos[this.selfView.index].moveByZhi.y;

                        if (this.pPage.isbpm) {
                            positionX -= 30;
                        }
                    }

                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            } else {
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x - DEF.PongCardPos[this.selfView.index].moveTo.x;
                        positionY = nodeMode.y + nodeMode.height + 6;
                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                        positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                    }

                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            }

        } else if (this.selfView.index == 2) {
            if (cardType == 1) { // 直板
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x - card.width - 8;
                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveZhiBy.x - card.width;
                    }
                    positionY = DEF.PongCardPos[this.selfView.index].moveZhiBy.y;
                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            } else {
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x - card.width - 8;
                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveBy.x - card.width;
                    }
                    positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            }

        } else if (this.selfView.index == 3) {
            if (cardType == 1) { // 直板
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x
                        positionY = nodeMode.y - nodeMode.height - 6;
                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveByZhi.x;
                        positionY = DEF.PongCardPos[this.selfView.index].moveByZhi.y;

                        if (this.pPage.isbpm) {
                            positionX += 30;
                        }
                    }

                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            } else {
                this.pongPaiArr.forEach(card => {
                    let positionX, positionY
                    if (viewIndex > 0) {
                        let nodeMode = self.pongPaiArr[viewIndex - 1]
                        positionX = nodeMode.x - DEF.PongCardPos[this.selfView.index].moveTo.x
                        positionY = nodeMode.y - nodeMode.height - 6;
                    } else {
                        positionX = DEF.PongCardPos[this.selfView.index].moveBy.x;
                        positionY = DEF.PongCardPos[this.selfView.index].moveBy.y;
                    }

                    card.endPosX = positionX;
                    card.endPosY = positionY;
                    card.setPosition(positionX, positionY);
                    viewIndex++
                });
            }

        }
    },
    // 设置数据
    setData: function () {
        let isSelf = this.selfView.player.isSelf;
        if(!isSelf){
            return;
        }

        let cardType = this.pPage.cardType

        // 显示节点
        // this.root.active = true;
        let cards = this.selfView.player.pongCards;
        let pongPaiArr = this.pongPaiArr;
        let atlas = this.pPage.majhCardAtlas0;

        let cardKeyName = 'majh_cardval_';
        let riAndLeft = false
        if (this.selfView.index == 0) {
            cardKeyName = 'majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 1) {
            cardKeyName = 'ri_majh_cardval_';
            riAndLeft = true
        }  else if (this.selfView.index == 2) {
            cardKeyName = 'to_majh_cardval_';
            riAndLeft = false
        } else if (this.selfView.index == 3) {
            cardKeyName = 'le_majh_cardval_';
            riAndLeft = true
        }

        for(let i=0; i<pongPaiArr.length; i++){
            let nodePong = pongPaiArr[i];
            for(let j=0; j<cards.length; j++){
                let cardItem = cards[j]
                if (nodePong.type == cardItem.type) {
                    let Layout_Top = cc.find("Layout_Top", nodePong)
                    if (cardItem.type == 'peng') {
                        cc.find("Sprite_Peng0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Peng1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Peng2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                    } else if (cardItem.type == 'mkang') { // 明杠
                        cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Gang1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Gang2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Gang3/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                    } else if (cardItem.type == 'akang') { // 暗杠
                        cc.find("Sprite_Gang0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                    } else if (cardItem.type == 'fei') { // 飞牌
                        cc.find("Sprite_Peng0/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Peng1/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + cardItem.code + '_zhi') : (cardKeyName + cardItem.code));
                        cc.find("Sprite_Peng2/Sprite_Val", Layout_Top).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(((cardType == 1) && (riAndLeft)) ? (cardKeyName + 50 + '_zhi') : (cardKeyName + 50));
                    }
                    nodePong.code = cardItem.code
                }
            }
        }
    },
});

/* =================================================================================================================== */

// 结算视图
let D2SettleView = cc.Class({

    // dbgstr
    dbgstr: function (info) {
        let s = '结算视图';

        if (info) {
            return s + ' :: ' + info;
        }

        return s + ' ';
    },

    //
    f: function () {
    },

    //
    init: function (pPage) {
        this.pg = pPage;

        this.root = cc.instantiate(this.pg.settlementPf);

        this.initView();
    },

    //
    initView: function () {
        let r = this.root;

        // 分享一下
        this.Button_share = cc.find("Button_share", r);
        this.Button_share.on('touchend', this.share, this);

        // 查看剩下牌
        this.Button_sp = cc.find("Button_sp", r);
        this.Button_sp.on('touchend', this.onsp, this);


        // 继续游戏
        this.Button_gogame = cc.find("Button_gogame", r);
        this.Button_gogame.on('touchend', this.goOnGame, this);

        // 总结算
        this.Button_final = cc.find("Button_final", r);
        this.Button_final.on('touchend', this.onfinal, this);

        // 规则
        this.Label_deskrule = cc.find("Label_deskrule", r).getComponent(cc.Label);
        // cc.g.hallMgr.inGameMenu.updateJieSuan(this.Label_deskrule);
    },


    /* ------------------------------------------------------------------------------------------------------------ */
    // 剩余卡牌
    upLeftcards: function () {
        this.Node_Detail_Pop = cc.find("Node_Detail_Pop", this.root);
        this.Node_Detail_PopBtn = cc.find("Button_Bg", this.Node_Detail_Pop);
        this.Node_Detail_PopBtn.on('touchend', this.onClosePop, this);
        this.Node_Detail_Pop.active = true
        if (! this.hbLeftcards) {
            this.svLeftcards = cc.find("Node_Detail_Pop/ScrollView_Mj", this.root);
            this.hbLeftcards = cc.find("view/content", this.svLeftcards);
        }

        let hblc = this.hbLeftcards;
        hblc.removeAllChildren();
        
        let sd = this.pg.gameMgr.SettleData;
        let rc = sd.remaincards;

        if (!cc.g.utils.judgeArrayEmpty(rc)) {
            let ppf = this.pg.SIPlayerPf;
            // let atlas = this.pg.majhCardAtlas0
            for (let i = 0; i < rc.length; ++i) {
                let cardNode = cc.instantiate(ppf);

                let Sprite_Hu_Tips = cc.find("Sprite_Hu_Tips", cardNode);
                Sprite_Hu_Tips && Sprite_Hu_Tips.removeFromParent();

                let sprite_cardVal_img = cc.find("Sprite_cardVal", cardNode);
                sprite_cardVal_img.getComponent(cc.Sprite).spriteFrame = this.pg.majhCardAtlas0.getSpriteFrame('majh_cardval_' + rc[i]);
                hblc.addChild(cardNode);
            }
            hblc.getComponent(cc.Layout).updateLayout();
            this.svLeftcards.getComponent(cc.ScrollView).scrollToTop();
        }
    },
    showDetail: function (details, name, isPiao) {
        this.Node_Detail_Pop_two = cc.find("Node_Detail_Pop_two", this.root);

        let Label_Name_Tips = cc.find("Node_Detail_Pop_two/Label_Name_Tips", this.root);
        Label_Name_Tips.getComponent(cc.Label).string = name || '';

        // piao
        let Label_Piao = cc.find("Node_Detail_Pop_two/Label_Piao", this.root);
        Label_Piao.active = isPiao;

        this.Node_Detail_PopBtnTWO = cc.find("Button_Bg", this.Node_Detail_Pop_two);
        this.Node_Detail_PopBtnTWO.on('touchend', this.onClosePopTwo, this);
        
        this.Node_Detail_Pop_two.active = true

        if (! this.detailvbtwo) {
            this.svLeftcardsTwo = cc.find("Node_Detail_Pop_two/ScrollView_Detail", this.root);
            this.detailvbtwo = cc.find("view/content", this.svLeftcardsTwo);
        }
        let hblc = this.detailvbtwo;
        hblc.removeAllChildren();

        // let sd = this.pg.gameMgr.SettleData;
        // let rc = sd.remaincards;

        if (!cc.g.utils.judgeArrayEmpty(details)) {
            let ppf = this.pg.SIPlayerPf2;
            // let atlas = this.pg.majhCardAtlas0
            for (let i = 0; i < details.length; ++i) {
                let cardNode = cc.instantiate(ppf);
                let detail = details[i]

                let Node_User_Tips = cc.find("Node_User_Tips", cardNode);
                // 名字
                let Label_name1 = cc.find("Label_1", Node_User_Tips).getComponent(cc.Label);
                Label_name1.string = detail.type
                let Label_name2 = cc.find("Label_2", Node_User_Tips).getComponent(cc.Label);
                Label_name2.string = detail.name
                let Label_name3 = cc.find("Label_3", Node_User_Tips).getComponent(cc.Label);
                Label_name3.string = cc.g.utils.realNum1(detail.winValue);
                hblc.addChild(cardNode);
            }
            hblc.getComponent(cc.Layout).updateLayout();
        }
    },
    // 玩家条目
    upPlayers: function () {
        if (! this.vbPlayer) {
            this.svPlayer = cc.find("Node_ctt/ScrollView_player", this.root);
            this.vbPlayer = cc.find("view/content", this.svPlayer);
        }

        let vbp = this.vbPlayer;
        let settleData = this.pg.gameMgr.SettleData;
        // // 局数
        // let Label_jushu = cc.find("Node_ctt/Label_jushu", this.root).getComponent(cc.Label);
        // Label_jushu.string = '第'+settleData.gameNum+'局';

        let ri = this.pg.gameMgr.roomInfo;
        // let str = cc.g.areaInfo[ri.origin].name + '麻将';
        let str = '珙县麻将';
        str += ' 房间号：' + ri.roomId;
        str += ` 第${ri.curGameNum}局`;

        let com = cc.g.hallMgr.inGameMenu.Sprite_rule.getComponent('dlgGmruleifo');
        if (com) {
            let str = com.srtlist.join(' ');
            this.Label_deskrule.string = str;
        } else {
            this.Label_deskrule.string = '???';
        }

        let Label_desc = cc.find("Node_ctt/Label_desc", this.root).getComponent(cc.Label);
        Label_desc.string = str;

        // 时间
        let pt = ri.pbTime ? ri.pbTime : i64v(this.pg.gameMgr.SettleData.time)*1000;
        this.Label_time = cc.find("Node_ctt/Label_time", this.root).getComponent(cc.Label);
        this.Label_time.string = cc.g.utils.getFormatTimeXXX(pt, 'Y|.|M|.|D| |h|:|m|:|s|');

        // 玩家牌
        let allPerResult = settleData.allPerResult
        for (let i = 0; i < 10; i++) {
            let vbPlayerContent = cc.find("pdkSIPlayer" + i, vbp);
            if (!vbPlayerContent) break;

            vbPlayerContent.active = false;
            // 清除数据
            // vbPlayerContent.removeAllChildren()

            if (allPerResult[i]) {
                vbPlayerContent.active = true;
                this.crtPlayerItem(vbPlayerContent, allPerResult[i]);
            }
        }

        this.vbPlayer.getComponent(cc.Layout).updateLayout();
    },

    // 玩家
    crtPlayerItem: function (vbPlayerContent, allPerResultItem) {
        let ri = this.pg.gameMgr.roomInfo;
        
        // // 头像 名字 ID
        let Sprite_bg = cc.find("Sprite_bg", vbPlayerContent);
        let zhuang = cc.find("Sprite_Zhuang", vbPlayerContent);
        let piaoView = cc.find("Sprite_Piao", vbPlayerContent);
        let Lab_name = cc.find("Label_name", vbPlayerContent).getComponent(cc.Label);
        let Spr_head = cc.find("Node_head/Sprite_hdbg/Node_mask/Sprite_head", vbPlayerContent).getComponent(cc.Sprite);
        // sprite_hque.active = false
        zhuang.active = allPerResultItem.isZhuang;
        let fengDingView = cc.find("Sprite_fengding", vbPlayerContent);
        fengDingView.active = allPerResultItem.isFengDing;

        if (cc.g.utils.judgeStringEmpty(allPerResultItem.name)) {
            Lab_name.string = '无';
        } else {
            Lab_name.string = cc.g.utils.getFormatName(allPerResultItem.name, 3*2);
        }

        // @ts-ignore
        if (eq64(cc.g.userMgr.userId, allPerResultItem.uid)) {
            Sprite_bg.active = true
        } else {
            Sprite_bg.active = false
        }

        // 显示票
        let playerViewItemTwo = this.pg.gameMgr.uidPlayers[allPerResultItem.uid]
        if (!cc.g.utils.judgeObjectEmpty(playerViewItemTwo)) {
            let piao = playerViewItemTwo.view.piao
            piaoView.active = piao > 0 ? true : false;
        }

        // 显示头像
        // let spriteFrame = null;
        // if (cc.g.utils.judgeStringEmpty(allPerResultItem.icon)) {
        //     spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
        // } else {
        //     spriteFrame = cc.loader.getRes('textures/head/head_animal_' + allPerResultItem.icon, cc.SpriteFrame);
        // }

        if (allPerResultItem.icon.length > 4) {
            cc.g.utils.setUrlTexture(Spr_head, allPerResultItem.icon);
        }
        else {
            let spriteFrame = null;

            if (allPerResultItem.icon === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            } else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + allPerResultItem.icon, cc.SpriteFrame);
            }

            Spr_head.spriteFrame = spriteFrame;
        }
        
        // if (d.icon.length > 4) {
        //     cc.g.utils.setUrlTexture(this.Sprite_head, allPerResultItem.icon);
        // }

        // 归的数量
        let guiNum = allPerResultItem.guiNum

        // 点炮、平胡 不需要显示
        let node_Hu_Tips_View = cc.find("Node_Hu_Tips_View", vbPlayerContent);
        node_Hu_Tips_View.removeAllChildren();
        let mingtang = allPerResultItem.mingtang
        if (!cc.g.utils.judgeArrayEmpty(mingtang)) {
            //
            let haveGui = false;
            let guiTxtStr = ''
            let mingTxtStr = ''
            let lastNode = null
            let mtspf = this.pg.JieSuanMingTang;
            for (let i = 0; i < mingtang.length; i++) {
                let ming = mingtang[i]
                let mingNode = cc.instantiate(mtspf);
                let mingTxt = cc.find("tangLabel", mingNode);
                // 平胡 不需要显示
                if (ming == 4 || ming == 5 || ming == 6 || ming == 7
                    || ming == 8 || ming == 9 || ming == 10 || ming == 11 || ming == 12) {
                        if (ming == 1) {
                            continue;
                        }
                }
                
                // let spr = new cc.Node();
                // 归
                if (ming == 3) {
                    if (guiNum == 1) {
                        guiTxtStr = '1归'
                        // mingTxt.getComponent(cc.Label).string = '1归、'
                        // spr.addComponent(cc.Sprite).spriteFrame =  this.pg.majhAtlas0.getSpriteFrame('jiesuan_gui_1');
                    } else if (guiNum == 2) {
                        guiTxtStr = '2归'
                        // spr.addComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame('jiesuan_gui_2');
                    } else if (guiNum == 3) {
                        guiTxtStr = '3归'
                        // spr.addComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame('jiesuan_gui_3');
                    } else if (guiNum == 4) {
                        guiTxtStr = '4归'
                        // spr.addComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame('jiesuan_gui_4');
                    }
                    haveGui = true
                    // guiNode = spr
                } else {
                    mingTxtStr = DEF.hcJieSuanMingTang[ming].txt + DEF.jiesuanDouHao
                    mingTxt.getComponent(cc.Label).string = mingTxtStr
                    node_Hu_Tips_View.addChild(mingNode);
                    lastNode = mingNode
                    // spr.addComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame('mingtang_' + mingtang[i]);
                    // node_Hu_Tips_View.addChild(spr);
                    //
                    // dohao = new cc.Node();
                    // // 加入逗号
                    // dohao.addComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame('jiesuandou');
                    // node_Hu_Tips_View.addChild(dohao);
                }
            }


            if (haveGui) {
                let mingGuiNode = cc.instantiate(mtspf);
                let mingGuiTxt = cc.find("tangLabel", mingGuiNode);
                mingGuiTxt.getComponent(cc.Label).string = guiTxtStr
                node_Hu_Tips_View.addChild(mingGuiNode);
            } else {
                node_Hu_Tips_View.removeChild(lastNode);
                let rmingTxtStr = mingTxtStr.replace(DEF.jiesuanDouHao, '')
                // add node
                let mingLaNode = cc.instantiate(mtspf);
                let mingLaTxt = cc.find("tangLabel", mingLaNode);
                mingLaTxt.getComponent(cc.Label).string = rmingTxtStr
                node_Hu_Tips_View.addChild(mingLaNode);
            }
        }

        // 添加麻将
        // 碰 杠牌
        let ppf = this.pg.SIPlayerPf;
        let putout = allPerResultItem.putout
        // 最后一个元素位置
        // let lasetPositionX = 0
        let allHandleArr = []
        let layout_H_cards = cc.find("Layout_H_cards", vbPlayerContent);
        layout_H_cards.removeAllChildren();
        if (!cc.g.utils.judgeArrayEmpty(putout)) {
            putout.forEach((item)=>{
                let cards = item.cards
                if (!cc.g.utils.judgeArrayEmpty(cards)) {
                    for (let i = 0; i < cards.length; i++) {
                        let codeObj = {}
                        let cardcode = cards[i];
                        if (cards.length == 5) {
                            if (i == 0) {
                                continue
                            }
                            allHandleArr.push(cardcode)
                        } else {
                            codeObj.cardcode = cardcode
                            allHandleArr.push(cardcode)
                        }
                    }

                    allHandleArr.push('-100')
                }
            })
        }

        // 
        let win = allPerResultItem.win;
        if (cc.g.utils.judgeObjectEmpty(win)) {
            win = 0;
        }
        let Label_coin_win = cc.find("Label_coin_win", vbPlayerContent);
        let Label_coin_lose = cc.find("Label_coin_lose", vbPlayerContent);
        Label_coin_win.active = Label_coin_lose.active = false;
        if (win >= 0) {
            Label_coin_win.active = true;
            Label_coin_win.getComponent(cc.Label).string = (win > 0) ? ('+'+win) : '0';
        } else {
            Label_coin_lose.active = true;
            Label_coin_lose.getComponent(cc.Label).string = win;
        }

        // 添加手牌
        let hand = allPerResultItem.hand
        if (!cc.g.utils.judgeArrayEmpty(hand)) {
            hand = allHandleArr.concat(hand)
        }

        if (!cc.g.utils.judgeArrayEmpty(hand)) {
            let endX = 0;
            let huPaiNum = allPerResultItem.hand.length%3;
            for (let i = 0; i < hand.length; i++) {
                // let codeObj = allHandleArr[i]
                // let cardcode = parseInt(codeObj.cardcode)
                let cardcode = parseInt(hand[i])
                let cardNode = cc.instantiate(ppf);
                let positionX = 0;//i * DEF.hcJieSuanPos[0].moveBy.x;
                if (cardcode == -100) {
                    positionX = endX
                    endX += DEF.hcJieSuanPos[0].moveTo.x
                } else {
                    positionX = endX
                    endX += DEF.hcJieSuanPos[0].moveBy.x;
                }
                // if ( i == hand.length - 1) {
                //     positionX += DEF.hcJieSuanPos[0].moveTo.x;
                //     endX += DEF.hcJieSuanPos[0].moveTo.x
                // }
                let positionY = DEF.hcJieSuanPos[0].moveBy.y;
                let sprite_Hu_Tips_img = cc.find("Sprite_Hu_Tips", cardNode);
                if (sprite_Hu_Tips_img) {
                    sprite_Hu_Tips_img.active = false
                }

                if (eq64(this.pg.gameMgr.selfUID, allPerResultItem.uid)) {
                    this.isselfwin = (win > 0);
                }

                // 胡牌
                if (i == (hand.length -1)) {
                    if (huPaiNum == 2) {
                        if(mingtang.indexOf(13) > -1){
                            //如果是自摸
                            sprite_Hu_Tips_img.getComponent(cc.Sprite).spriteFrame =  this.pg.majhAtlas0.getSpriteFrame('jiesuanzm');
                        }
                        sprite_Hu_Tips_img.active = true;

                        // 胡牌最后一张牌加间距
                        if ( i == hand.length - 1) {
                            positionX += DEF.hcJieSuanPos[0].moveTo.x;
                            endX += DEF.hcJieSuanPos[0].moveTo.x
                        }
                    } else {
                        sprite_Hu_Tips_img.active = false;
                    }
                }

                let sprite_cardVal_img = cc.find("Sprite_cardVal", cardNode);
                sprite_cardVal_img.getComponent(cc.Sprite).spriteFrame = this.pg.majhCardAtlas0.getSpriteFrame('majh_cardval_' + cardcode);

                cardNode.setPosition(positionX, positionY + cardNode.height*0.5);
                layout_H_cards.addChild(cardNode);

                if (cardcode == -100) {
                    cardNode.active = false
                }
            }
        }

        //
        // 0 自摸
        //
        // 10
        // 20
        // 30
        //
        // 0
        //
        //
        //
        // 11 胡
        //
        // 21
        //
        // 31

        let spriteKey = ''
        let huSeq = allPerResultItem.huSeq
        if (huSeq == 10) {
            spriteKey = 'jiesuan_1zimo'
        } else if (huSeq == 20) {
            spriteKey = 'jiesuan_2zimo'
        } else if (huSeq == 30) {
            spriteKey = 'jiesuan_3zimo'
        } else if (huSeq == 11) {
            spriteKey = 'jiesuan_1hu'
        } else if (huSeq == 21) {
            spriteKey = 'jiesuan_2hu'
        } else if (huSeq == 31) {
            spriteKey = 'jiesuan_3hu'
        } else {
            spriteKey = ''
        }

        // 胡牌顺序
        let Sprite_coin = cc.find("Sprite_coin", vbPlayerContent); //jiesuan_1zimo
        if (cc.g.utils.judgeStringEmpty(spriteKey)) {
            Sprite_coin.active = false
        } else {
            Sprite_coin.active = true
            Sprite_coin.getComponent(cc.Sprite).spriteFrame = this.pg.majhAtlas0.getSpriteFrame(spriteKey);
        }

        let Label_fanshu = cc.find("Label_fanshu", vbPlayerContent);
        if (cc.g.utils.judgeObjectEmpty(allPerResultItem.fun)) {
            allPerResultItem.fun = 0;
        }
        Label_fanshu.getComponent(cc.Label).string = allPerResultItem.fun + '番';

        const  self = this;
        const  curname = allPerResultItem.name;
        let details = allPerResultItem.details
        //  详情按钮
        let Button_Detail = cc.find("Button_Detail", vbPlayerContent);
        Button_Detail.on('touchend', ()=>{
            // self.showDetail(details, curname)
            self.showDetail(details, curname, piaoView.active)
        });
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    //
    show: function () {
        //this.Button_share.getComponent(cc.Button).interactable = false;

        this.Node_Detail_Pop = cc.find("Node_Detail_Pop", this.root);
        this.Node_Detail_Pop.active = false;
        this.Node_Detail_Pop_two = cc.find("Node_Detail_Pop_two", this.root);
        this.Node_Detail_Pop_two.active = false;

        this.Button_share.active = true;
        this.Button_sp.active = true;

        if (this.pg.gameMgr.isGameEndFinal) {
            this.Button_final.active = true;
            this.Button_gogame.active = false;
        } else {
            this.Button_gogame.active = true;
            this.Button_final.active = false;
        }

        this.isselfwin = false;

        this.upPlayers();

        this.root.active = true;
    },

    //
    hide: function () {
        this.root.active = false;
    },

    // 分享截图
    share: function (event) {
        cc.g.utils.shareCaptureScreenToWX(0);
    },

    // 继续游戏
    goOnGame: function (event) {
        this.hide();

        this.pg.gameMgr.onGameSettleEnd();

        this.pg.onButtonReady();
    },
    onsp: function() {
        // 显示剩下的牌
        this.upLeftcards();
    },
    // 总结算
    onfinal: function (event) {
        this.hide();

        this.pg.gameMgr.onGameSettleEnd();

        this.pg.gameMgr.isGameEndFinal = false

        this.pg.onGameSettleFinal();
        // onGameSettleEnd
    },
    onClosePop: function (event) {
        this.Node_Detail_Pop.active = false
    },
    onClosePopTwo: function (event) {
        this.Node_Detail_Pop_two.active = false
    },
});

/* =================================================================================================================== */


// 总结算视图
let D2SettleFinalView = cc.Class({

    // dbgstr
    dbgstr: function (info) {
        let s = '总结算';

        if (info) {
            return s + ' :: ' + info;
        }

        return s + ' ';
    },

    //
    f: function () {
    },

    //
    init: function (pPage) {
        this.pg = pPage;

        this.root = cc.instantiate(this.pg.settleFinalPf);

        this.initView();
    },

    //
    initView: function () {
        let r = cc.find("Node_ctt", this.root);

        // // 地区
        // this.Label_area = cc.find("Label_area", r).getComponent(cc.Label);
        //
        // // 房间号
        // this.Label_roomID = cc.find("Label_roomID", r).getComponent(cc.Label);
        //
        // // 总局数
        // this.Label_rouds = cc.find("Node_rouds/Label_rouds", r).getComponent(cc.Label);

        // 分享一下
        this.Button_share = cc.find("Button_share", r);
        this.Button_share.on('touchend', this.share, this);
        // 返回大厅
        this.Button_backhall = cc.find("Button_backhall", r);
        this.Button_backhall.on('touchend', this.backhall, this);
    },

    upInfo: function () {
        cc.log("upInfo")

        let ri = this.pg.gameMgr.roomInfo;

        let r = this.root;

        // 地区
        let Node_ri = cc.find("Node_ri", r);
        if (!Node_ri) {
            return;
        }

        Node_ri.active = true

        let Label_diqu = cc.find("Label_diqu", Node_ri).getComponent(cc.Label);
        Label_diqu.string = '珙县麻将'//cc.g.areaInfo[ri.origin].name + '麻将';

        let Label_room = cc.find("Label_room", Node_ri).getComponent(cc.Label);
        Label_room.string = `房间号:  ${ri.roomId}  局数: ${ri.curGameNum}/${ri.GameNum}`;

        let Label_time = cc.find("Label_time", Node_ri).getComponent(cc.Label);
        Label_time.string = cc.g.utils.getFormatTimeXXX(null, 'Y|.|M|.|D| |h|:|m|:|s|');
    },

    /* ------------------------------------------------------------------------------------------------------------ */

    //
    upView: function () {
        let ri = this.pg.gameMgr.roomInfo;
        let sd = this.pg.gameMgr.SettleFinalData;
        // 地区
        // // this.Label_area.string = cc.g.areaInfo[ri.origin].name + '麻将';
        // this.Label_area.string = '珙县麻将';
        // // 房间号
        // this.Label_roomID.string = '房间号：' + ri.roomId;
        // // 总局数
        // this.Label_rouds.string = sd.num;

        this.upInfo();

        // 地区
        // this.Label_diqu.string = (this.pg.gameMgr.xiaojjs ? '珙县麻将' : '珙县麻将(中途解散)');

        this.hboxPlayer = cc.find("Node_All_View/All_View_Layout", this.root);
        // this.hboxPlayer.removeAllChildren(true)
        let list = sd.list
        if (!cc.g.utils.judgeArrayEmpty(list)) {
            for (let i = 0; i < list.length; i++) {
                let allPerResultItem = list[i]
                let SpriteNode = cc.find("Sprite_p"+i, this.hboxPlayer);
                SpriteNode.active = true
                // 大赢家
                let Sprite_bigwin = cc.find("Sprite_bigwin", SpriteNode);
                let Sprite_bg = cc.find("light", SpriteNode);

                // 申请解散
                let jiesan = cc.find("jiesan", SpriteNode);
                jiesan.active = false;
                if (!this.pg.gameMgr.xiaojjs && this.pg.gameMgr.askJiesanUid) {
                    jiesan.active = eq64(this.pg.gameMgr.askJiesanUid, allPerResultItem.uid);
                }

                // 大赢家
                // Sprite_bigwin.active = (allPerResultItem.winlose > 0) ? true : false
                Sprite_bigwin.active = allPerResultItem.bigWin ? true : false

                // 头像
                let Sprite_head = cc.find("Sprite_hdbg/Node_mask/Sprite_head", SpriteNode).getComponent(cc.Sprite);

                // // 显示头像
                // let spriteFrame = null;
                // if (cc.g.utils.judgeStringEmpty(allPerResultItem.icon)) {
                //     spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                // } else {
                //     spriteFrame = cc.loader.getRes('textures/head/head_animal_' + allPerResultItem.icon, cc.SpriteFrame);
                // }

                // Sprite_head.spriteFrame = spriteFrame;

                if (eq64(cc.g.userMgr.userId, allPerResultItem.uid)) {
                    Sprite_bg.active = true
                } else {
                    Sprite_bg.active = false
                }

                if (allPerResultItem.icon.length > 4) {
                    cc.g.utils.setUrlTexture(Sprite_head, allPerResultItem.icon);
                }
                else {
                    let spriteFrame = null;
        
                    if (allPerResultItem.icon === '') {
                        spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                    } else {
                        spriteFrame = cc.loader.getRes('textures/head/head_animal_' + allPerResultItem.icon, cc.SpriteFrame);
                    }
        
                    Sprite_head.spriteFrame = spriteFrame;
                }

                // // 头像
                // if (pd.icon.length > 4) {
                //     cc.g.utils.setUrlTexture(p.Sprite_head, pd.icon);
                // }
                // else {
                //     let spriteFrame = null;
                //
                //     if (pd.icon === '') {
                //         spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
                //     } else {
                //         spriteFrame = cc.loader.getRes('textures/head/head_animal_' + pd.icon, cc.SpriteFrame);
                //     }
                //
                //     p.Sprite_head.spriteFrame = spriteFrame;
                // }

                // 名字
                let Label_name = cc.find("Label_name", SpriteNode).getComponent(cc.Label);
                // 名字
                Label_name.string = allPerResultItem.name;

                // ID
                let Label_ID = cc.find("Label_ID", SpriteNode).getComponent(cc.Label);

                // ID
                Label_ID.string = 'ID:' + allPerResultItem.uid;

                // // 房主
                // let Sprite_fangzhu = cc.find("Sprite_fangzhu", SpriteNode);
                // // 房主
                // Sprite_fangzhu.active = allPerResultItem.isZhuang;
                //
                // // 剩余房卡
                // let totalRoomCard = cc.find("Label_fk_count", SpriteNode).getComponent(cc.Label);
                // totalRoomCard.string = allPerResultItem.totalRoomCard

                // 扣除房卡
                let Label_syfk = cc.find("Sprite_fk/Label_syfk", SpriteNode).getComponent(cc.Label);
                Label_syfk.string = allPerResultItem.consumeRoomCard

                // 分数
                let Label_win = cc.find("Sprite_wlbg/Label_win", SpriteNode).getComponent(cc.Label);
                Label_win.node.active = false;

                let Label_lose = cc.find("Sprite_wlbg/Label_lose", SpriteNode).getComponent(cc.Label);
                Label_lose.node.active = false;

                let sco = allPerResultItem.winlose;
                if (sco > 0) {
                    Label_win.node.active = true;
                    Label_win.string = '+' + sco;
                } else {
                    Label_lose.node.active = true;
                    Label_lose.string = sco;
                }

                // // 详情
                // let reacordList = allPerResultItem.reacordList
                // if (!cc.g.utils.judgeArrayEmpty(reacordList)) {
                //     let viewIndex = 0;
                //     let ppf = this.pg.SIPlayerPf3;
                //     let svLeftcardsTwo = cc.find("ScrollView_Ctn/view/content", SpriteNode);
                //     // svLeftcardsTwo.removeAllChildren(true)
                //     svLeftcardsTwo.removeAllChildren();
                //     reacordList.forEach((item)=>{
                //         let cardNode = cc.instantiate(ppf);
                //         // 背景
                //         let Sprite_cardBg = cc.find("Sprite_cardBg", cardNode)
                //         if (viewIndex % 2 == 0) {
                //             Sprite_cardBg.active = true
                //         } else {
                //             Sprite_cardBg.active = false
                //         }
                //         let Label_Mo_Title = cc.find("Label_Mo_Title", cardNode).getComponent(cc.Label);
                //         Label_Mo_Title.string = item.name
                //
                //         let Label_Mo_Vaule = cc.find("Label_Mo_Vaule", cardNode).getComponent(cc.Label);
                //         Label_Mo_Vaule.string = item.count + " 次"
                //
                //         svLeftcardsTwo.addChild(cardNode);
                //
                //         viewIndex++;
                //     })
                // }
            }
        }

        this.hboxPlayer.getComponent(cc.Layout).updateLayout();
    },

    show: function() {
        this.upView();
        this.root.active = true;
    },

    /* ------------------------------------------------------------------------------------------------------------ */


    // 分享截图
    share: function (event) {
        cc.g.utils.shareCaptureScreenToWX(0);
    },

    // 返回大厅
    backhall: function (event) {
        
        if (this.pg.jiesanView) {
            this.pg.gameMgr.playerQuited(this.pg.gameMgr.getSelfPlayer());
            cc.g.hallMgr.backToHall();
        } else {
            this.pg.gameMgr.isGameEndFinal = false;
            cc.g.hallMgr.exitGame();
        }
    },
});

/* =================================================================================================================== */

/**
 * 玩家手里的牌
 * @param viewIndex this.selfView.index  Node_p1/2/34
 * @param idx for 循环 index
 * @param mainPage 主页 majh
 * @returns {Node}
 */
let lc_creatHandCard = function (viewIndex, idx, mainPage) {
    let cardIndex = viewIndex;
    cc.log('cardIndex-->' + cardIndex)

    let cardType = mainPage.cardType
    cc.log('cardType-->' + cardType)
    if (cardType == 1) { // 直板
        cardIndex += 4;
    }
    cc.log('cardIndex-->' + cardIndex)

    let hcPrefab = mainPage.cardPrefab[cardIndex].prefab;
    let c = cc.instantiate(hcPrefab);
    c.uIdx = idx;
    let positionX, positionY
    if (viewIndex == 0 ) { // Node_p1 Node_p3
        positionX = idx * DEF.SendCardPos[viewIndex].moveTo.x;
        positionY = DEF.SendCardPos[viewIndex].moveBy.y;
        c.endPosX = positionX;
        c.endPosY = DEF.SendCardPos[viewIndex].moveTo.y;

        // 只有0 才有
        c.isSelected = false; // 是否选中
        c.isQue = false;
        c.zezao = false;
        cc.find("Sprite_Que", c).active = false;
        cc.find("Sprite_ZeZao", c).active = false;
    } else if (viewIndex == 1) { // Node_p2 Node_p4
        if (cardType == 1) { // 直板
            positionX = DEF.SendCardPos[viewIndex].moveZhiBy.x;
            positionY = DEF.SendCardPos[viewIndex].moveZhiBy.y + (idx * DEF.SendCardPos[viewIndex].moveTo.y);
            c.endPosX = DEF.SendCardPos[viewIndex].moveZhiBy.x
            c.endPosY = positionY;
        } else {
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x) + DEF.SendCardPos[viewIndex].moveTo.z;
            positionY = DEF.SendCardPos[viewIndex].moveBy.y + (idx * DEF.SendCardPos[viewIndex].moveTo.y);
            c.endPosX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x)
            c.endPosY = positionY;
        }

    } else if (viewIndex == 2) { // Node_p2 Node_p4
        if (cardType == 1) { // 直板
            positionX = DEF.SendCardPos[viewIndex].moveZhiBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x);
            positionY = DEF.SendCardPos[viewIndex].moveBy.y;
            c.endPosX = positionX;
            c.endPosY = DEF.SendCardPos[viewIndex].moveTo.y;
        } else {
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x);
            positionY = DEF.SendCardPos[viewIndex].moveBy.y;
            c.endPosX = positionX;
            c.endPosY = DEF.SendCardPos[viewIndex].moveTo.y;
        }
    } else if (viewIndex == 3) {
        if (cardType == 1) { // 直板
            positionX = DEF.SendCardPos[viewIndex].moveBy.x;
            positionY = DEF.SendCardPos[viewIndex].moveBy.y - (idx * DEF.SendCardPos[viewIndex].moveTo.y)
            c.endPosX = DEF.SendCardPos[viewIndex].moveBy.x
            c.endPosY = positionY
        } else {
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x) - DEF.SendCardPos[viewIndex].moveTo.z;
            positionY = DEF.SendCardPos[viewIndex].moveBy.y - (idx * DEF.SendCardPos[viewIndex].moveTo.y)
            c.endPosX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x)
            c.endPosY = positionY
        }
    }
    c.code = 0
    c.setPosition(positionX, positionY);
    return c;
};

/**
 * 回放时，其他玩家手里的牌
 * @param viewIndex this.selfView.index  Node_p1/2/34
 * @param idx for 循环 index
 * @param mainPage 主页 majh
 * @returns {Node}
 */
let lc_creatOtherHc = function (viewIndex, idx, mainPage) {
    let cardIndex = viewIndex;
    cc.log('cardIndex-->' + cardIndex)

    let cardType = mainPage.cardType
    cc.log('cardType-->' + cardType)
    if (cardType == 1) { // 直板
        cardIndex += 3;
    }
    cc.log('cardIndex-->' + cardIndex)

    let hcPrefab = mainPage.cardBackPlayPrefab[cardIndex - 1].prefab;
    let c = cc.instantiate(hcPrefab);
    c.uIdx = idx;
    let positionX, positionY
    if (viewIndex == 1) { // Node_p2
        if (cardType == 1) { // 直板
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - 40
            positionY = DEF.SendCardPos[viewIndex].moveBy.y + (idx * DEF.SendCardPos[viewIndex].moveTo.y);
        } else {
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x) + DEF.SendCardPos[viewIndex].moveTo.z;
            positionY = DEF.SendCardPos[viewIndex].moveBy.y + (idx * DEF.SendCardPos[viewIndex].moveTo.y);
        }
    } else if (viewIndex == 2) { // Node_p3
        positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x);
        positionY = DEF.SendCardPos[viewIndex].moveBy.y;
    } else if (viewIndex == 3) {  //Node_p4
        if (cardType == 1) { // 直板
            positionX = DEF.SendCardPos[viewIndex].moveBy.x
            positionX = positionX - 80
            positionY = DEF.SendCardPos[viewIndex].moveBy.y - (idx * DEF.SendCardPos[viewIndex].moveTo.y)
            positionY = positionY - 80
        } else {
            positionX = DEF.SendCardPos[viewIndex].moveBy.x - (idx * DEF.SendCardPos[viewIndex].moveTo.x) - DEF.SendCardPos[viewIndex].moveTo.z;
            positionX = positionX - 80
            positionY = DEF.SendCardPos[viewIndex].moveBy.y - (idx * DEF.SendCardPos[viewIndex].moveTo.y)
            positionY = positionY - 80
        }

    }
    c.code = 0
    c.setPosition(positionX, positionY);
    return c;
};

/**
 * 创建胡牌玉质贴
 * @param viewIndex
 * @param mainPage
 * @returns {Node}
 */
let lc_creatHuCard = function (viewIndex, mainPage) {
    let cardIndex = viewIndex;
    cc.log('cardIndex-->' + cardIndex)

    let cardType = mainPage.cardType
    cc.log('cardType-->' + cardType)
    if (cardType == 1) { // 直板
        cardIndex += 4;
    }
    cc.log('cardIndex-->' + cardIndex)

    let hcPrefab = mainPage.huCardPrefab[cardIndex].prefab;
    let c = cc.instantiate(hcPrefab);
    return c;
};

let lc_creatBeiHuCard = function (viewIndex, mainPage) {
    let hcPrefab = mainPage.huCardBeigPrefab[viewIndex].prefab;
    let c = cc.instantiate(hcPrefab);
    return c;
};



var MajhCtrls = {
    PlayerView: MajhPlayerView,
    HandCardView: MajhHandCardView,
    SettleView: D2SettleView,
    SettleFinalView: D2SettleFinalView,
}

module.exports = MajhCtrls;