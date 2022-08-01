
cc.Class({
    extends: cc.Component,

    properties: {
    },

    dbgstr: function (info) {
        let s = '玩家互动';

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView2();
    },

    start () {
    },

    // update (dt) {},


    /* ================================================================================================================= */
    
    init: function () {
        this.initView();
    },

    initView: function () {
        cc.log(this.dbgstr('initView'));

        let r = cc.find("Node_ctt", this.node);

        // 描述
        this.Label_desc = cc.find("Label_desc", r).getComponent(cc.Label);
    },

    upView: function() {
        cc.log(this.dbgstr('upView'));

        let ri = cc.g.hallMgr.curGameMgr.roomInfo;
        cc.log('roomInfo', ri);

        let des = ri.clubId ? '亲友圈房' : '普通房';
        //des += ', '+ cc.g.areaInfo[ri.origin].name
        des += ', '+ ri.total +'人';
        des += ', '+ ri.GameNum + '局';

        // 宜宾麻将
        if (ri.gameType == 12 || ri.gameType == 4 || ri.gameType == 10) {
            if (ri.base === 2) {
                des += ', '+ '底分2分';
            } else {
                des += ', '+  '底分1分';
            }
        }

        
        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            let ks3 = 0;//PDK 第三个颗数

            // "32,冠军房费","33,均摊房费","34,房主房费","35,俱乐部房费"
            // cmo.v['32'] = '冠军房费';//'冠军房费';
            // cmo.v['33'] = '均摊房费';//'冠军房费';
            // cmo.v['35'] = '圈主房费';//'冠军房费';

            ri.NewRlue.forEach(e => {
                if (rules[e]) {
                    if (ri.gameType==GMID.PDK && (e=='4' || e=='5' || e=='6')) {
                        des += ', ' + rules[e];
                        ks3 = rules[e].split('/')[2];
                    } else if (ri.gameType==GMID.PDK && e=='13') {
                        des += ', ' + ks3 + '分';
                    } else if (e=='32' && ri.clubId) {
                        des += ', ' + '冠军房费';
                    }  else if (e=='33' && ri.clubId) {
                        des += ', ' + '均摊房费';
                    }  else if (e=='35' && ri.clubId) {
                        des += ', ' + '圈主房费';
                    } else if (ri.gameType==GMID.NYMJ && e=='6') { // // 6,加倍|
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                            if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                                let addBeiStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addBeiStrip)
                                des += ', ' + '小于'+addBeiStrip+'分'+', 加倍';
                            }
                        }
                    } else if (ri.gameType==GMID.NYMJ && e=='15') { //  // // 15,低于|
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                            if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                                let addFenStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFenStrip)
                                let addFen = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFen)
                                des += ', 低于' + addFenStrip+'分加'+ addFen + '分';
                            }
                        }
                    }
                    else {
                        des += ', ' + rules[e];
                    }
                    
                } else {
                    cc.error('错误规则ID', e);
                }
            });
        }





        //
        // // 宁远麻将
        // // 5,不加倍|
        // // 6,加倍|
        // // 7,翻2倍|
        // // 8,翻3倍|
        // // 9,翻4倍|
        // // 15,低于|
        // if ((this.bjifo.d.playNum == 2) && (this.bjifo.d.gameType == GMID.NYMJ)) {
        //     let expendSpeciThing = {};
        //     let ningYuanSpeciRule = {}
        //     expendSpeciThing.ningYuanSpeciRule = ningYuanSpeciRule
        //     if (this.ts_toggle_one.isChecked) {
        //         info.bigTwoRlue.push(5);
        //     } else if (this.ts_toggle_two.isChecked) {
        //         info.bigTwoRlue.push(6);
        //         // 倍数
        //         if (this.ts_two_toggle_one.isChecked) {
        //             info.bigTwoRlue.push(7);
        //         } else if (this.ts_two_toggle_two.isChecked) {
        //             info.bigTwoRlue.push(8);
        //         } else if (this.ts_two_toggle_three.isChecked) {
        //             info.bigTwoRlue.push(9);
        //         }
        //
        //         // 选择加倍
        //         if (this.ts_toggle_two.isChecked) {
        //             ningYuanSpeciRule.addBeiStrip = this.getXiaoYuFen();
        //         }
        //     }
        //
        //     if (this.ts_three_toggle_one.isChecked) {
        //         info.bigTwoRlue.push(15);
        //
        //         // 选择低于
        //         if (this.ts_three_toggle_one.isChecked) {
        //             let num1 = this.getMultFen(this.Node_three_Plush_Num_Edit1.string)
        //             let num2 = this.getMultFen(this.Node_three_Plush_Num_Edit2.string)
        //             ningYuanSpeciRule.addFenStrip = num1
        //             ningYuanSpeciRule.addFen = num2;
        //         }
        //     }
        //
        //     // 放入数据
        //     info.expendSpeciThing = expendSpeciThing
        // }


        this.Label_desc.string = des;
    },

    /* ================================================================================================================= */


    /* ================================================================================================================= */

    initView2: function () {
        cc.log(this.dbgstr('initView2'));

        let list = [];

        let ri = cc.g.hallMgr.curGameMgr.roomInfo;
        cc.log('roomInfo', ri);

        let s = ri.clubId ? '亲友圈房' : '普通房';
        list.push(s);

        //des += ', '+ cc.g.areaInfo[ri.origin].name

        s = ri.total +'人,';

        if (ri.gameType != GMID.EQS) {
            s = ri.GameNum + '局';
        }

        list.push(s);

        // // 宜宾麻将
        // if (ri.gameType == 12 || ri.gameType == 4 || ri.gameType == 10) {
        //     if (ri.base === 2) {
        //         s = '底分2分';
        //     } else {
        //         s = '底分1分';
        //     }
        // } else {
        //     s = `底分${ri.base}分`;
        // }

        // 乐山地区不显示房费类型、大赢家设置 20 21 22
        let isls = (ri.gameType==20 || ri.gameType==21 || ri.gameType==22);

        if (! (ri.gameType==GMID.PDK && (ri.origin==1 || ri.origin==3))) {
            s = `底分${ri.base}分`;
            list.push(s);
        }

        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            let ks3 = 0;//PDK 第三个颗数

            // "32,冠军房费","33,均摊房费","34,房主房费","35,俱乐部房费"
            // cmo.v['32'] = '冠军房费';//'冠军房费';
            // cmo.v['33'] = '均摊房费';//'冠军房费';
            // cmo.v['35'] = '圈主房费';//'冠军房费';

            ri.NewRlue.forEach(e => {
                if (!rules[e]) {
                    cc.error('错误规则ID', e);
                    return;
                }

                if (ri.gameType==GMID.PDKLS && (e=='16')) {
                    s = '名堂 10分';
                } else if (ri.gameType==GMID.PDKLS && (e=='17')) {
                    s = '名堂 20分';
                } else if (ri.gameType==GMID.EQS && (e=='24')) {
                    s = '2,4,6个';
                } else if (ri.gameType==GMID.EQS && (e=='25')) {
                    s = '1,2,4个';
                } else if (ri.gameType==GMID.EQS && (e=='26')) {
                    s = '黑2红4';
                } else if (ri.gameType==GMID.PDK && (e=='4' || e=='5' || e=='6')) {
                    s = rules[e];
                    ks3 = rules[e].split('/')[2];
                } else if (ri.gameType==GMID.PDK && e=='13') {
                    s = ks3 + '分';
                } else if (e=='32' && ri.clubId) {
                    if (!isls) {
                        s = '冠军房费';
                    } else return;
                } else if (e=='33' && ri.clubId) {
                    if (!isls) {
                        s = '均摊房费';
                    } else return;
                } else if (e=='35' && ri.clubId) {
                    if (!isls) {
                        s = '圈主房费';
                    } else return;
                } else if (ri.gameType==GMID.NYMJ && e=='6') { // // 6,加倍|
                    if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                            let addBeiStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addBeiStrip)
                            s = '小于'+addBeiStrip+'分'+', 加倍';
                        }
                    }
                } else if (ri.gameType==GMID.NYMJ && e=='15') { //  // // 15,低于|
                    if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                            let addFenStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFenStrip)
                            let addFen = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFen)
                            s = '低于' + addFenStrip+'分加'+ addFen + '分';
                        }
                    }
                } else {
                    s = rules[e];
                }

                list.push(s);
            });
        }


        {/*
            maxwinsco
            goldMatchRoomRule: Message
            consumeGold: 0
            disbandGold: 1
            exitType: 1
            joinGold: 1

            lotteryType: 3
            winnerRuleList: Array(2)
                0: Message
                consumeGold: 1
                maxScore: 3
                minScore: 1

                大赢家 5  
                >5 可加入牌桌  
                <5 解散牌桌/继续游戏  
                不抽奖  
                所有人抽奖 5  
                大赢家抽奖 
                1~10 1积分  
                1~10 1积分  
                ...
                1~10 1积分 

        */}

        if (ri.maxwinsco > 0) {
            list.push(`大赢家 ${ri.maxwinsco}`);
        }

        if (ri.goldMatchRoomRule) {
            let d = ri.goldMatchRoomRule;
            list.push(`>${cc.g.utils.realNum1(d.joinGold)} 可加入牌桌`);
            list.push(`<${cc.g.utils.realNum1(d.disbandGold)} ${d.exitType==1 ? '解散牌桌' : '继续游戏'}`);

            if (false && !isls) {
                if (d.lotteryType==1) {
                    list.push(`不抽奖`);
                } else if (d.lotteryType==2) {
                    list.push(`所有人抽奖 ${cc.g.utils.realNum1(d.consumeGold)}`);
                } else if (d.lotteryType==3) {
                    list.push(`大赢家抽奖`);
    
                    d.winnerRuleList.forEach(e => {
                        list.push(`${cc.g.utils.realNum1(e.minScore)}~${cc.g.utils.realNum1(e.maxScore)} ${cc.g.utils.realNum1(e.consumeGold)}积分`);
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////

        let ctt = cc.find("ScrollView_rule", this.node).getComponent(cc.ScrollView).content;
        ctt.destroyAllChildren();
        for (let i = 0; i < list.length; i++) {
            let n = new cc.Node("lab" + i);
            n.color = new cc.Color(0xCE, 0xA2, 0x6F);

            let lab = n.addComponent(cc.Label);
            lab.fontSize = 35;
            lab.lineHeight = 35;
            lab.string = list[i];
            
            ctt.addChild(n);
        }

        this.srtlist = list;
    },

    /* ================================================================================================================= */

    // 关闭
    onBtnClose: function (event, customEventData) {
        //this.node.removeFromParent();
        this.node.active = false;
    },
});
