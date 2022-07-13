// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

let curtic = null;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    itmDyjcj: cc.Prefab = null;

    //@property
    //text: string = 'hello';

    dlgCR: cc.Component = null;

    tog1: cc.Toggle = null;// 不抽奖
    tog2: cc.Toggle = null;// 所有人抽奖
    tog3: cc.Toggle = null;// 大赢家抽奖
    tog4: cc.Toggle = null;// 所有赢家抽奖

    cct1: cc.Node = null;// 不抽奖
    
    cct2: cc.Node = null;// 所有人抽奖
    Label_t2jb: cc.Label = null;

    cct3: cc.Node = null;// 大赢家抽奖
    svCjlist: cc.ScrollView = null;

    cct4: cc.Node = null;// 所有赢家抽奖
    svCjlist4: cc.ScrollView = null;

    dlg_mp: any = null;

    cjData: Object = {};
    dyjitems: any = null;
    dyjitems4: any = null;
    curtag: Number = 1;

    _bjifoD: any = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    // ========================================================================================

    //
    init(dlgCR) {
        this.dlgCR = dlgCR;

        let r = this.node;

        // 分类选项
        this.tog1 = cc.find("Toggles/toggle1", r).getComponent(cc.Toggle);
        this.tog2 = cc.find("Toggles/toggle2", r).getComponent(cc.Toggle);
        this.tog3 = cc.find("Toggles/toggle3", r).getComponent(cc.Toggle);
        this.tog4 = cc.find("Toggles/toggle4", r).getComponent(cc.Toggle);

        // 选项内容
        this.cct1 = cc.find("t1", r);
        
        //
        let t2 = cc.find("t2", r);
        let Label_jinbi = cc.find("Label_jinbi", t2).getComponent(cc.Label);//消耗金币
        t2['jinbi'] = Label_jinbi;
        let btnjian = cc.find("Button_jian", t2);
        let btnjia = cc.find("Button_jia", t2);
        let btnhelp = cc.find("Button_help", t2);
        btnhelp.active = false;
        cc['g'].utils.addClickEvent(btnjian, this.node, 'CRJinbicj', 'onBtnJiajian', {ist2:true, jia:false, Lab:Label_jinbi});
        cc['g'].utils.addClickEvent(btnjia, this.node, 'CRJinbicj', 'onBtnJiajian', {ist2:true, jia:true, Lab:Label_jinbi});
        //cc['g'].utils.addClickEvent(btnhelp, this.node, 'CRJinbicj', 'onHelp', 't2');
        this.cct2 = t2;
        
        //
        let t3 = cc.find("t3", r);
        this.svCjlist = cc.find("ScrollView_cjVlist", t3).getComponent(cc.ScrollView);
        this.cct3 = t3;

        //
        let t4 = cc.find("t4", r);
        this.svCjlist4 = cc.find("ScrollView_cjVlist", t4).getComponent(cc.ScrollView);
        this.cct4 = t4;

        // 门票
        this.dlg_mp = cc.find("dlg_mp", r);
        this.dlg_mp.active = false;

        this.dlg_mp['eb_mp'] = cc.find("ctt/EditBox_mp", this.dlg_mp).getComponent(cc.EditBox);//
        this.dlg_mp['eb_mp'].string = this.menpiao;

        this.up();
    }

    // 
    up() {
        this.node.active = false;

        let gmid = this.dlgCR['curGameId'];
        let area = this.dlgCR['curArea'];
        let gmr = this.dlgCR['bjifo'] && this.dlgCR['bjifo'].goldMatchRule;
        
        let d = this.cjData[`${gmid},${area}`];
        let o = {};
        if (gmr && !this._bjifoD) {

            if (this.dlgCR['bjifo']) {
                this._bjifoD = true;
            }

            o['cur'] = gmr.lotteryType;
            // @ts-ignore
            o['d2'] = cc.g.utils.realNum1(gmr.consumeGold);
            o['d3'] = [];
            o['d4'] = [];
            
            let od = (o['cur']=='3' ? 'd3':'d4');
            let od0 = (o['cur']=='3' ? 'd4':'d3');

            if (gmr.winnerRuleList.length > 0) {
                gmr.winnerRuleList.forEach(e => {
                    o[od].push({
                        // @ts-ignore
                        min:cc.g.utils.realNum1(e.minScore),
                        // @ts-ignore
                        max:cc.g.utils.realNum1(e.maxScore),
                        // @ts-ignore
                        jinbi:cc.g.utils.realNum1(e.consumeGold),
                        // @ts-ignore
                        choudi:cc.g.utils.realNum1(e.bottomGold),
                    });
                });

                o[od0] = [{min:0, max:0, jinbi:0, choudi:0}];
            } else {
                o['d3'] = [{min:0, max:0, jinbi:0, choudi:0}];
                o['d4'] = [{min:0, max:0, jinbi:0, choudi:0}];
            }

            // @ts-ignore
            o['ticket'] = cc.g.utils.realNum1(gmr.ticket);

            this.cjData[`${gmid},${area}`] = o;
            d = o;
        } else if (!d) {
            o['cur'] = 1;
            o['d2'] = 0;
            o['d3'] = [{min:0, max:0, jinbi:0, choudi:0}];
            o['d4'] = [{min:0, max:0, jinbi:0, choudi:0}];
            o['ticket'] = 0;
            this.cjData[`${gmid},${area}`] = o;
            d = o;
        }

        this.cct2['jinbi'].string = d['d2'];
        this.curtag = d['cur'];

        // 更新大赢家抽奖
        this.dyjitems = [];
        let ctt = this.svCjlist.content;
        ctt.destroyAllChildren();
        d['d3'].forEach(e => {
            this.onAddItem(null, '3', e, );
        });

        // 更新大赢家抽奖
        {
            this.dyjitems4 = [];
            let ctt = this.svCjlist4.content;
            ctt.destroyAllChildren();
            d['d4'].forEach(e => {
                this.onAddItem(null, '4', e, );
            });
        }

        this.cct1.active = this.cct2.active = this.cct3.active = this.cct4.active =false;

        this.scheduleOnce(()=>{
            this.node.active = true;
            
            if (d['cur'] == 1) {
                this.tog1.check();
                this.cct1.active = true;
            } else if (d['cur'] == 2) {
                this.tog2.check();
                this.cct2.active = true;
            } else if (d['cur'] == 3) {
                this.tog3.check();
                this.cct3.active = true;
            } else if (d['cur'] == 4) {
                this.tog4.check();
                this.cct4.active = true;
            }
        }, 0.1);
    }

    // 
    onToggle(event, customEventData) {
        //if (!event.isChecked) return;

        this.cct1.active = this.cct2.active = this.cct3.active = this.cct4.active = false;

        let togtp = parseInt(customEventData);

        this.curtag = togtp;

        if (togtp == 1) this.cct1.active = true;
        else if (togtp == 2) this.cct2.active = true;
        else if (togtp == 3) this.cct3.active = true;
        else if (togtp == 4) this.cct4.active = true;
    }


    // 
    onBtnJiajian(event, customEventData) {
        let ce = customEventData;
    
        cc.log('onBtnJiajian ', ce.jia);

        if (ce.ist2) {
            if (!ce.Lab) return;

            let val = parseInt(ce.Lab.string);
            if (ce.jia) {
                ce.Lab.string = ++val;
            } else {
                ce.Lab.string = val>0 ? --val : 0;
            }
        } else {
            let jinbi = ce.ITM['jinbi'];
            let cd = ce.ITM['cd'];

            let vjb = parseFloat(jinbi.string);
            let val = parseFloat(cd.string);

            if (ce.jia) {
                jinbi.string = (vjb+=0.1).toFixed(1);
            } else {
                let v = vjb>0 ? (vjb-=0.1).toFixed(1) : 0;

                jinbi.string = v;

                if (v<val) {
                    //cd.string = v;
                }
            }
        }
    }
    onCdBtnJiajian(event, customEventData) {
        let ce = customEventData;
        
        if (!ce.ITM) return;

        let jinbi = ce.ITM['jinbi'];
        let cd = ce.ITM['cd'];

        cc.log('onCdBtnJiajian ', ce.jia);
        
        let vjb = parseFloat(jinbi.string);
        let val = parseFloat(cd.string);
        if (ce.jia) {
            //if (val+0.1 <= vjb) {
                cd.string = (val+=0.1).toFixed(1);
            //}
        } else {
            cd.string = val>0 ? (val-=0.1).toFixed(1) : 0;
        }
    }

    // 
    onEditEnd(event, customEventData) {
        let itm = customEventData;

        cc.log('onEditEnd');
        
        let min = parseInt(itm.min.string);

        let max = itm.max.string;
        max = (max=='' ? 0 : parseInt(max)); // 去除数值前面有0的情况

        itm.max.string = (max<=min ? '' : max) // 必须大于最小值
    }
    // 
    onJbEditEnd(event, customEventData) {
        let itm = customEventData;

        cc.log('onJbEditEnd');

        let jb = itm.jinbi.string;
        jb = (jb=='' ? 0 : parseFloat(jb));
        jb = parseFloat(jb.toFixed(1));

        itm.jinbi.string = jb;

        // let cd = itm.cd.string;
        // cd = (cd=='' ? 0 : parseFloat(cd));
        // cd = parseFloat(cd.toFixed(1));
        // if (jb<cd) {
        //     itm.cd.string = jb;
        // }
    }
    // 
    onCdEditEnd(event, customEventData) {
        cc.log('onCdEditEnd');

        let itm = customEventData;

        let jinbi = itm['jinbi'];
        let cd = itm['cd'];
        
        let vjb = parseInt(jinbi.string);
        let val = (cd.string=='' ? 0 : parseFloat(cd.string));
        val = parseFloat(val.toFixed(1));

        if (val >= vjb) {
            cd.string = vjb;
        } else {
            cd.string = val;
        }

        cd.string = val;
    }

    // 增加金币梯度
    onAddItem(event, tag, customEventData) {
        cc.log('onAddItem 增加金币梯度');
        let d = customEventData;
        
        let itms = (tag=='3' ? this.dyjitems:this.dyjitems4) || [];

        if (itms.length >= 5) {
            cc['g'].global.hint('最多5个区间');
            return;
        }

        let min = 0, max = 0, jinbi = 0, choudi = 0;
        if (d) {
            min = d.min || 0;
            max = d.max || 0;
            jinbi = d.jinbi || 0;
            choudi = d.choudi || 0;
        } else if (itms.length > 0) {
            let str = itms[itms.length-1].max.string;
            min = (str=='' ? 0 : parseInt(str));

            if (min <= 0) {
                cc['g'].global.hint('请输入区间');
                return;
            }

            ++min;
        }

        let itm = cc.instantiate(this.itmDyjcj);
        itm['idx'] = itms.length+1;

        itm['min'] = cc.find("Label_min", itm).getComponent(cc.Label); //
        itm['min'].string = min;
        itm['max'] = cc.find("EditBox", itm).getComponent(cc.EditBox); //
        itm['max'].string = (max<=0 ? '' : max);
        itm['noedit'] = cc.find("Node_noedit", itm);
        itm['noedit'].active = false;
        itm['jinbi'] = cc.find("EditBox_jinbi", itm).getComponent(cc.EditBox);//
        itm['jinbi'].string = jinbi;
        
        let btnjian = cc.find("Button_jian", itm);
        let btnjia = cc.find("Button_jia", itm);
        let btnhelp = cc.find("Button_help", itm);
        btnhelp.active = false;
        let btndel = cc.find("Button_del", itm);

        btndel.active = (itms.length>0);

        cc['g'].utils.addEditboxDidEndedEvent(itm['max'].node, this.node, 'CRJinbicj', 'onEditEnd', itm);
        cc['g'].utils.addEditboxDidEndedEvent(itm['jinbi'].node, this.node, 'CRJinbicj', 'onJbEditEnd', itm);

        cc['g'].utils.addClickEvent(btnjian, this.node, 'CRJinbicj', 'onBtnJiajian', {jia:false, ITM:itm});
        cc['g'].utils.addClickEvent(btnjia, this.node, 'CRJinbicj', 'onBtnJiajian', {jia:true, ITM:itm});
        //cc['g'].utils.addClickEvent(btnhelp, this.node, 'CRJinbicj', 'onHelp', 't3');

        // 抽底
        {
            let cd = cc.find("Node_choudi", itm);

            itm['cd'] = cc.find("EditBox", cd).getComponent(cc.EditBox);//
            itm['cd'].string = choudi;

            let btnjian = cc.find("Button_jian", cd);
            let btnjia = cc.find("Button_jia", cd);

            cc['g'].utils.addEditboxDidEndedEvent(itm['cd'].node, this.node, 'CRJinbicj', 'onCdEditEnd', itm);
            cc['g'].utils.addClickEvent(btnjian, this.node, 'CRJinbicj', 'onCdBtnJiajian', {jia:false, ITM:itm});
            cc['g'].utils.addClickEvent(btnjia, this.node, 'CRJinbicj', 'onCdBtnJiajian', {jia:true, ITM:itm});
        }

        if (itms.length>0) {
            cc['g'].utils.addClickEvent(btndel, this.node, 'CRJinbicj', 'onDelItem', itm, tag);

            itms[itms.length-1].noedit.active = true;
        }
        
        itms.push(itm);

        let sv = tag=='3' ? this.svCjlist:this.svCjlist4;

        sv.content.addChild(itm);
        if (itms.length > 2) {
            sv.scrollToBottom();
        }

        if (tag=='3') {
            this.dyjitems = itms;
        } else {
            this.dyjitems4 = itms;
        }
    }

    // 删除金币梯度
    onDelItem(event, itm, tag) {
        cc.log('onDelItem 删除金币梯度');
        
        let sv = (tag=='3' ? this.dyjitems:this.dyjitems4);

        let a = [];
        for (let i = 0, j = 0; i < sv.length; ++i) {
            if(sv[i].idx != itm.idx) {
                sv[i].idx = j++;
                a.push(sv[i]);
            }
        }

        a[a.length-1].noedit.active = false;
        
        if (tag=='3') {
            this.dyjitems = a;
        } else {
            this.dyjitems4 = a;
        }

        itm.destroy();
    }

    // 
    onSave(event, customEventData) {
        cc.log('onSave');

        let gmid = this.dlgCR['curGameId'];
        let area = this.dlgCR['curArea'];
        
        let d = this.cjData[`${gmid},${area}`];

        d.d2 = parseInt(this.cct2['jinbi'].string);
        d.cur = this.curtag;

        let d3 = [];
        this.dyjitems.forEach(e => {
            let o={};
            o['min'] = parseInt(e['min'].string);
            o['max'] = (e['max'].string=='' ? 0 : parseInt(e['max'].string));
            //o['jinbi'] = parseInt(e['jinbi'].string);
            o['jinbi'] = parseFloat(parseFloat(e['jinbi'].string).toFixed(1));
            o['choudi'] = parseFloat(parseFloat(e['cd'].string).toFixed(1));

            d3.push(o);
        });
        d.d3 = d3;

        let d4 = [];
        this.dyjitems4.forEach(e => {
            let o={};
            o['min'] = parseInt(e['min'].string);
            o['max'] = (e['max'].string=='' ? 0 : parseInt(e['max'].string));
            //o['jinbi'] = parseInt(e['jinbi'].string);
            o['jinbi'] = parseFloat(parseFloat(e['jinbi'].string).toFixed(1));
            o['choudi'] = parseFloat(parseFloat(e['cd'].string).toFixed(1));

            d4.push(o);
        });
        d.d4 = d4;

        this.node.active = false;
    }

    // 
    onHelp(event, customEventData) {
        cc.log('onHelp', customEventData);
    }


    onBtnMenPiao(event, customEventData) {
        cc.log('onBtnMenPiao', this.menpiao);
        
        let gmid = this.dlgCR['curGameId'];
        let area = this.dlgCR['curArea'];
        curtic = this.cjData[`${gmid},${area}`];

        this.dlg_mp.active = true;
        this.dlg_mp['eb_mp'].string = curtic.ticket;
    }
    // 
    onMpEditEnd(event, customEventData) {
        cc.log('onMpEditEnd');

        let mp = this.dlg_mp['eb_mp'].string;
        mp = (mp=='' ? 0 : parseFloat(mp));
        
        if (mp>100.0){
            mp = 100;
        }
        if (mp<0.0){
            mp = 0;
        }

        this.dlg_mp['eb_mp'].string = curtic.ticket = parseFloat(mp.toFixed(1));
    }
    // 
    onBtnMpjiajian(event, jj) {
        cc.log('onBtnMpjiajian ', jj);

        let mp = this.dlg_mp['eb_mp'].string;
        mp = (mp=='' ? 0 : parseFloat(mp));

        if (jj == '1') {
            mp = (mp+0.1>100 ? 100 : mp+0.1);
        } else {
            mp = (mp-0.1<0 ? 0 : mp-0.1);
        }

        this.dlg_mp['eb_mp'].string = parseFloat(mp.toFixed(1));;
    }
    onSaveMenpiao(event, customEventData) {
        cc.log('onSaveMenpiao');

        this.dlg_mp.active = false;
        if (customEventData == 'cls') {
            return;
        }

        let mp = parseFloat(this.dlg_mp['eb_mp'].string).toFixed(1);
        curtic.ticket = parseFloat(mp);
        curtic = null;
    }


    // 
    onClose(event, customEventData) {
        cc.log('onClose');

        this.node.active = false;
    }
}
