let DEF = require('pdknjDef');

let jokor = 52;
let JOKOR = 53;

let _si2 = false;
let _si3 = false;

/*
1    单牌 
2    对子 
3    顺子
4    连对 

5    三同 
6    三带二        
7    三带一对 

8    飞机 
9    飞机带四散
10   飞机带两对  

11   炸弹
*/

// Combination type 组合类型
let ComType = DEF.ComType;

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '跑得快逻辑'

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    init: function (gm) {
        cc.log(this.dbgstr('init'));

        this.color = ['方','梅','红','黑',];
        this.value = ['0','0','0','3','4','5','6','7','8','9','10','J','Q','K','A','2'];

        this.gm = gm;

        this.is2 = gm.isPDK2;   // 是不是2人跑得快

        this.doSpcRule();

        //this.gm.__tipbig = true;
    },

    up: function (gm) {
        cc.log(this.dbgstr('up'));

        this.gm = gm;

        this.is2 = gm.isPDK2;   // 是不是2人跑得快

        this.doSpcRule();
    },

    doSpcRule:function(){
        {/*
            2 _si2
            3 _si2
        */}

        _si2 = false;
        _si3 = false;

        let rule = this.gm.roomInfo.NewRlue;
        for (let i = 0; i < rule.length; ++i) {
            let r = rule[i];
            
            switch (r) {
                case 2: _si2 = true; break;
                case 3: _si3 = true; break;

                default:
                    break;
            }
        }

        cc.log(`
        _si2=${_si2} _si3=${_si3}
        `);
    },

    /* =================================================================================================================== */


    /* =================================================================================================================== */

    nu0:function(){},

    sort: function(codes) {
        // 0-7 | 8-51 | 52,53
        let sorted = cc.g.clone(codes)
        sorted.sort( function(a, b) {
            let aa = a;
            let bb = b;

            if (aa>=0 && aa<=7) {
                aa+=100;
            } else if (aa>=52) {
                aa*=10;
            }
            
            if (bb>=0 && bb<=7) {
                bb+=100;
            } else if (bb>=52) {
                bb*=10;
            }

            return aa - bb;
        });

        return sorted;
    },

    // 获取卡牌的相关信息
    getCodesInfo: function(codes) {
        let ifo = {};
        ifo.objs = [];
        ifo.codes = [];
        ifo.val = [];
        //ifo.color = [];
        ifo.str = [];
        //ifo.desc = '';

        if (!codes || !codes.length || codes.length<1) {
            return ifo;
        }

        codes.forEach(e => {
            let o={};

            o.code = e;

            if (e === jokor) {
                o.val = e;
                o.color = '小鬼';
                o.str = '小鬼';
            } else if (e === JOKOR) {
                o.val = e;
                o.color = '大鬼';
                o.str = '大鬼';
            } else {
                let elm = (e>=200) ? (e-200) : (e>=100 ? e-100 : e);

                let val = Math.floor(elm/4)+1;
                let clr = elm%4;
    
                //(val==1) && (val=14);
                //(val==2) && (val=15);
    
                o.val = val;
                o.color = this.color[clr];
                o.str = this.color[clr] + this.value[val];
            }

            ifo.objs.push(o);

            ifo.codes.push(o.code);
            ifo.val.push(o.val);
            //ifo.color.push(o.color);
            ifo.str.push(o.str);
        });

        //ifo.desc = ifo.str.join(',');

        return ifo;
    },

    /* =================================================================================================================== */
    // 获取卡牌的数量信息
    cardsNumInfo: function (codes) {
        let info = {}; //数量信息

        for (let i = 0; i < codes.length; i++) {
            const e = codes[i];
            
            if (! info[e]) {
                info[e] = 0;
            }
    
            ++info[e];
        }

        return info;
    },

    /* =================================================================================================================== */

    // 从卡组中移除卡牌
    removeCardsFromHand: function (rmvCodes, handCodes) {
        let codes = cc.g.clone(handCodes);

        rmvCodes.forEach(e => {
            for (let i = 0; i < codes.length; ++i) {
                let elm = (e>=200) ? 53 : (e>=100 ? 52 : e);
                if (elm == codes[i]) {
                    codes.splice(i, 1);
                    break;
                }
            }
        });

        return codes;
    },


    /* =================================================================================================================== */
    // 获取牌组合
    /*
        Def.ComType = {
            DAN:1,  //单张
            DUI:2,  //对子
            SHUN:3, //顺子
            LIAND:4,//连对

            SAN:5,  //三同
            SAN1:6,  //三带一
            SAN2:7, //三带二
            SAND:8, //三带一对

            FJ:9,   //飞机
            FJCB:10,  //飞机带翅膀

            SID2:11,  //四带二
            SID3:12,  //四带三

            ZD:13,  //炸弹
            AAA:14, //三A炸
        };
    */

    sortCombs: function (Combs) {

        /*
        若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
        若 a 等于 b，则返回 0。
        若 a 大于 b，则返回一个大于 0 的值。
        */
        let f = (codes)=>{
            let ifo = this.getCodesInfo(codes);
            let vi = this.getValsInfo(ifo.val);

            codes.sort( function(a, b) {
                let aa = Math.floor(a/4)+1;
                let bb = Math.floor(b/4)+1;
                
                if (vi.vni[aa]>vi.vni[bb]) {
                    return -1;
                } else if (vi.vni[aa] == vi.vni[bb]) {
                    (aa < 3) && (aa += 13);
                    (bb < 3) && (bb += 13);

                    return bb-aa;
                } else {
                    return 1;
                }
            });
        }

        Combs.forEach(com => f(com.codes));
    },

    // tg - target
    getCanOutCombination: function (codes, tgCodes, tgType) {
        let Combs = this.getCodsCombination(codes, tgType);

        this.sortCombs(Combs);

        return Combs;

        if (!tgType) {
            return Combs;
        }

        let ifo = this.getCodesInfo(tgCodes);
        let r = null;

        if (tgType==ComType.DAN) {
            r = this.checkDan(ifo);// 单牌
        } else if (tgType==ComType.DUI) {
            r = this.checkDui(ifo);// 对
        } else if (tgType==ComType.SAN) {
            r = this.checkSan(ifo, 0);// 三不带
        } else if (tgType==ComType.SAN1) {
            r = this.checkSan(ifo, 1);// 三带1
        } else if (tgType==ComType.SAN2 || tgType==ComType.SAND) {
            r = this.checkSan(ifo, 2, tgType);// 三带2 三带一对
        } else if (tgType==ComType.SHUN) {
            r = this.checkLian(ifo, 1);// 顺子
        } else if (tgType==ComType.LIAND) {
            r = this.checkLian(ifo, 2);// 连对
        } else if (tgType>=ComType.FJ && tgType<=ComType.FJCB) {
            r = this.checkLian(ifo, 3);// 飞机
        } else if (tgType==ComType.SID2 || tgType==ComType.SID3) {
            r = this.checkSi(ifo);// 四带二 四带三
        } else if (tgType>=ComType.ZD) {
            r = this.checkZD(ifo);// 炸弹 AAA 4张都有可能是 
        }

        if (r == null) {
            cc.warn('无法分析服务器提供的出牌 出BUG了！');
        }

        let coms = [];

        Combs.forEach(e => {
            // 同类型比较
            if (e.type == r.type) {
                if (e.lv > r.lv) {
                    coms.push(e);
                }

                return;
            }

            // 炸弹比其他非炸弹类型都大
            if (e.type > r.type && e.type>=ComType.ZD) {
                coms.push(e);
            } 
        });

        return coms;
    },

    getCodsCombination: function (codes, ctype) {
        if (!codes || !codes.length || codes.length<1) return 0;

        let com = [];

        let gui = 0;
        codes.forEach(e => {
            (e>=52) && (++gui);
        });

        if (gui>=codes.length) {
            //return com;
        }

        let ifo = this.getCodesInfo(codes);
        let r = null;

        // 单牌
        if (!ctype || ctype==ComType.DAN) {
            r = this.checkDan(ifo);
            if (r) {
                com.push(r);
                return com;
            }
        }
        
        // 对
        if (!ctype || ctype==ComType.DUI) {
            r = this.checkDui(ifo);
            if (r) {
                com.push(r);
                return com;
            }
        }

        // 三不带
        if (!ctype || ctype==ComType.SAN) {
            r = this.checkSan(ifo, 0);
            if (r) {
                com.push(r);
                return com;
            } 
        }

        // 前面1 2 3张只有固定一种类型  往后就可能有多种类型了

        // 炸弹 AAA 4张都有可能是 如果能判定为炸弹就忽略其他类型了
        r = this.checkZD(ifo);
        if (r) {
            com.push(r);
            return com;
        }
        

        // 三带1
        if (!ctype || ctype==ComType.SAN1) {
            r = this.checkSan(ifo, 1);
            r && com.push(r);
            if (ctype==ComType.SAN1 && r) return com;
        }

        // 3AD2
        if ((!ctype && _si2) || ctype==ComType.SID2) {
            r = this.checkAAA23(ifo, 2);
            r && com.push(r);
            if (r) return com;
        }
        // 3AD3
        if ((!ctype && _si3) || ctype==ComType.SID3) {
            r = this.checkAAA23(ifo, 3);
            r && com.push(r);
            if (r) return com;
        }

        // 三带2 三带一对
        if (!ctype || (ctype==ComType.SAN2 || ctype==ComType.SAND)) {
            r = this.checkSan(ifo, 2, ctype);
            r && (!ctype || r.type==ctype) && com.push(r);

            if (r && (ctype==ComType.SAN2 || ctype==ComType.SAND)) {
                return com;
            }
        }

        // 顺子
        if (!ctype || ctype==ComType.SHUN) {
            r = this.checkLian(ifo, 1);
            r && com.push(r);
            if (ctype==ComType.SHUN && r) return com;
        }

        // 连对
        if (!ctype || ctype==ComType.LIAND) {
            r = this.checkLian(ifo, 2);
            r && com.push(r);
            if (ctype==ComType.LIAND && r) return com;
        }

        // 飞机
        if (!ctype || (ctype>=ComType.FJ && ctype<=ComType.FJCB)) {
            r = this.checkLian(ifo, 3);
            r && com.push(r);
            if (ctype>=ComType.FJ && ctype<=ComType.FJCB && r) return com;
        }

        // 四带二 四带三
        if (!ctype || (ctype==ComType.SID2 || ctype==ComType.SID3)) {
            r = this.checkSi(ifo);
            r && com.push(r);
            if ((ctype==ComType.SID2 || ctype==ComType.SID3) && r) return com;
        }
        
        return com;
    },

    //
    getValsInfo: function (vals, min) {
        min = min ? min : 3;

        let o={};
        o.gui = 0;

        let v = [];
        vals.forEach(e => {
            (e<52) ? (v.push(e)) : (++o.gui);
        });

        o.vni = this.cardsNumInfo(v);
        o.vk = Object.keys(o.vni);
        for (let i = 0; i < o.vk.length; ++i) {
            o.vk[i] = parseInt(o.vk[i]);
        }
        o.vk.sort( function(a, b) {
            let aa = a;
            let bb = b;
            (aa < min) && (aa += 13);
            (bb < min) && (bb += 13);
            return bb - aa;
        });
        
        return o;
    },

    // 检查单牌
    checkDan: function (ifo) {
        if (ifo.val.length != 1) {
            return null;
        }

        let res = {};
        res.codes = cc.g.clone(ifo.codes);
        res.type = ComType.DAN;
        res.desc = '单张';

        if (ifo.val[0]>=52) {
            res.lv = 15;
        } else if (ifo.val[0]<=2) {
            res.lv = ifo.val[0] + 13;
        } else {
            res.lv = ifo.val[0];
        }

        return res;
    },

    // 检查对子
    checkDui: function (ifo) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;
        if (len != 2) {
            return null;
        }

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let res = {};
        res.codes = cc.g.clone(codes);
        res.type = ComType.DUI;
        res.desc = '对子';

        // 有鬼 或者 两牌一样
        if (vk.length==0) {
            res.lv = 15;
        } else if (vk.length==1) {
            res.lv = vk[0];
        }

        if (res.lv) {
            (res.lv<=2) && (res.lv += 13);
            return res;
        } 

        return null;
    },

    // 检查三不带
    checkSan: function (ifo, num, ctype) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let res = {};
        res.codes = cc.g.clone(codes);
        if (num==0) {
            res.type = ComType.SAN;
            res.desc = '三不带';
        } else if (num==1) {
            res.type = ComType.SAN1;
            res.desc = '三带1';
        } else if (num==2) {
            res.type = ComType.SAN2;
            res.desc = '三带2';
        } else {
            return null;
        }
        
        if (num==0) {
            // 必须1种类型内的牌 不能是AAA
            if (len!=3 || vk.length>=2 || vk[0]==1) {
                return null;
            }
        } if (num==1) {
            // 必须2种类型的牌
            if (len!=4 || vk.length!=2) {
                return null;
            }
        } if (num==2) {
            // 必须2种类型内的牌
            if (len!=5 || vk.length > 3) {
                return null;
            }
            // 不能有4张一样的
            if (vk.length>0 && (vni[vk[0]]>=4 || vni[vk[1]]>=4)) {
                return null;
            }
        }

        for (let i = 0; i < vk.length; ++i) {
            let e = vk[i];
            if (vni[e] + gui >= 3) {
                res.lv = e;
                break;
            }
        }

        if (gui >= 3) {
            res.lv = 15;
        }

        if (res.lv && num==2) {
            // 这里写的比较笨拙
            if (vk.length==3 || (vk.length==2 && gui==3)) {
                // 一定带2张 
            } else if (vk.length==2 && (gui==0 || (gui==1 && vni[vk[0]]==2) || (gui==2))) {
                // 一定带对
                res.type = ComType.SAND;
            } else {
                // 其余情况可 带2张 带对 主要是有鬼的情况
                (ctype != ComType.SAN2) && (res.type = ComType.SAND);
            }
        }

        if (res.lv) {
            let mv = res.lv;
            (res.lv<=2) && (res.lv += 13);
            (res.type == ComType.SAND) && (res.desc = '三带对');
            //(gui > 0) && (res.change = this.getChangeFace([mv, mv, mv], res.codes));

            return res;
        }

        return null;
    },

    // 四带二 四带三
    checkSi: function (ifo) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let res = {};
        res.codes = cc.g.clone(codes);
        if (len==6) {
            res.type = ComType.SID2;
            res.desc = '四带二';
        } else if (this.is2 && len==7) {
            res.type = ComType.SID3;
            res.desc = '四带三';
        } else {
            return null;
        }

        for (let i = 0; i < vk.length; ++i) {
            let e = vk[i];
            if (vni[e] + gui == 4) {
                res.lv = e;
                break;
            }
        }

        if (res.lv) {
            (res.lv<=2) && (res.lv += 13);
            return res;
        }

        return null;
    },
    
    // 检查联牌 1,2,3,4,5....
    checkLian: function (ifo, sameNum, min, ctype) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;
        if (sameNum<=1 && len<5) {
            return null;
        }
        if (sameNum>1 && len<2*sameNum) {
            return null;
        }

        let vi = this.getValsInfo(vals, min);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let res = {};
        res.codes = cc.g.clone(codes);
        if (sameNum==1) {
            res.type =  ComType.SHUN;
            res.desc = '顺子';
        } else if (sameNum==2) {
            res.type =  ComType.LIAND;
            res.desc = '连对';
        } else if (sameNum==3) {
            res.type =  ComType.FJ;
            res.desc = '飞机';
        } else {
            return null;
        }
        

        let LK = [1,13,12,11,10,9,8,7,6,5,4,3,];

        // 顺子 连对 不能连2
        if (sameNum<=2 && vni[2] && vni[2]>0) {
            return null;
        }

        // 寻找最长连
        let mlink = [];
        for (let i = 0; i < LK.length-1; ++i) {
            // 剩下的长度小于当前长度 后面就不会再有更长的了
            if (LK.length-i <= mlink.length) {
                break;
            }

            let gn = gui;
            let link = [];

            for (let j = i; j < LK.length; ++j) {
                let k = LK[j];
                let n = vni[k] ? vni[k] : 0;
                if (n >= sameNum) {
                    link.push(k);
                } else {
                    if (gn >= (sameNum-n)) {
                        link.push(k);
                        gn -= (sameNum-n);
                    } else {
                        break;
                    }
                }
            }

            if (link.length > mlink.length) {
                mlink = link;
            }
        }
        
        // 没有足够连以上的
        if (sameNum==1) {
            if (mlink.length<5) {
                return null;
            }
        } else if (mlink.length<2) {
            return null;
        }

        // 分析剩下牌能不能带
        let lk={};
        mlink.forEach(e => lk[e] = vni[e]);
        let san={};
        let gn = gui;
        for (const k in lk) {
            let n = lk[k] || 0;
            if (n > sameNum) {
                san[k] = n - sameNum;
            } else if (n < sameNum) {
                gn -= (sameNum - n);
            }
        }
        vk.forEach(e => (!lk[e]) && (san[e] = vni[e]));
        let sk = Object.keys(san);
        let sct = 0;
        sk.forEach(e => sct+=san[e]);

        // 顺子 连对
        if (sameNum < 3) {
            if (sct+gn > 0) return null;
            res.lv = mlink[0];
        } else {
            if (false) {
                // 数量只能为0 或者 4 并且4要么都不一样 要么成对
                if (sct+gn == 0) {
                    res.lv = mlink.length*100 + mlink[0];
                } else if (sct+gn == 4){
                    if (sk.length==4) {
                        //或者4张散牌
                        res.lv = mlink.length*100 + mlink[0];
                        res.type = ComType.FJ4;
                    } else if (sk.length==3) {
                        if (gn==1) {
                            // 3张散牌一个鬼
                            res.lv = mlink.length*100 + mlink[0];
                            res.type = ComType.FJ4;
                        }
                    } else {
                        // 没有一个是3张
                        let no3 = true;
                        let _2 = false;
                        sk.forEach(e => {
                            if (san[e]>=3) {
                                no3=false;
                            } else if (san[e]==2) {
                                _2=true;
                            } 
                        });
                        if (no3) {
                            res.lv = mlink.length*100 + mlink[0];

                            if (_2) {
                                res.type = ComType.FJ2D;
                            } else {
                                res.type = (ctype==ComType.FJ2D) ? ComType.FJ2D : ComType.FJ4; 
                            }
                        }
                    }
                }
            } else {
                // 新玩法只判断数量
                if ((sct+gn)==mlink.length || (sct+gn)==(mlink.length * 2)) {
                    res.type =  ComType.FJCB;
                    res.desc = '飞机带翅膀';

                    res.lv = mlink.length*100 + mlink[0];
                    res.lk = cc.g.clone(mlink);
                } else if (sct+gn == 0) {
                    res.lv = mlink.length*100 + mlink[0];
                    res.lk = cc.g.clone(mlink);
                } else {
                    // 333 444 555 x  可以是2飞机
                    // 333 444 555 666 xyz 可以是3飞机
                    if (mlink.length>=3) {
                        cc.log('需要检测特别的飞机情况 比如3张做带牌用');

                        let flen=(n, ml)=>{
                            let L = 0;
                            for (let L0 = ml.length-1; L0 >= 0; --L0) {
                                let num = len - L0*3;
                                if (num==L0*n) {
                                    L = L0;
                                    break;
                                }
                            }
                            return L;
                        }

                        let len1 = 0;
                        let len2 = 0;
                        if (ComType.SAN1 && len%4==0) {
                            len1 = flen(1, mlink);
                        }
                        if (ComType.SAN2 && len%5==0) {
                            len2 = flen(2, mlink);
                        }
                        
                        if (len1>0 || len2>0) {
                            let mlen = len1>len2 ? len1 : len2;

                            let lk = [];
                            for (let i = mlink.length-mlen; i < mlink.length; ++i) {
                                lk.push(mlink[i]);
                            }
                            
                            res.lv = mlen*100 + lk[0];
                            res.lk = lk;

                            res.type = ComType.FJCB;
                            res.desc = '飞机带翅膀';
                        }
                    }
                }
            }
        }

        if (res.lv) {
            if (gui > 0) {
                let mv = [];
                for (let i = 0; i < mlink.length; ++i) {
                    for (let j = 0; j < sameNum; ++j) {
                        mv.push(mlink[i]);
                    }
                }

                res.change = this.getChangeFace(mv, res.codes, res.type)
            }

            (res.lv<=2) && (res.lv += 13);

            return res;
        }

        return null;
    },

    // 检查炸弹
    checkZD: function (ifo) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;
        if (len!=3 && len!=4) {
            return null;
        }

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        if (vk.length != 1) {
            return null;
        }

        let res = {};
        res.codes = cc.g.clone(codes);
        res.type = ComType.ZD;
        res.desc = '炸弹';

        if (len==3 && vk[0]==1) {
            res.type = ComType.AAA;
            res.desc = '三A炸';
            return res;
        }

        return res;
    },

    // 3A带2  3A带3
    checkAAA23: function (ifo, num) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let res = {};
        res.codes = cc.g.clone(codes);
        res.lv = 15;
        if (num==2) {
            res.type = ComType.AAA2;
            res.desc = '3A带2';
        } else if (num==3) {
            res.type = ComType.AAA3;
            res.desc = '3A带3';
        } else {
            return null;
        }
        
        if (!vni[1] || (vni[1] + gui != 3)) {
            cc.log('checkAAA23 A不是三张');
            return;
        }
        
        if (num==2 && len!=5) {
            return null;
        }
        if (num==3 && len!=6) {
            return null;
        }

        if (res.lv) {
            return res;
        }
    },
    
    // 获取有鬼牌改变后的牌
    getChangeFace: function (mainVals, codes, ctype) {
        let gui = [];
        let code = {};
        codes.forEach(e => {
            if (e == 52) {
                gui.push(100);
            } else if (e == 53) {
                gui.push(200);
            } else {
                let v = Math.floor(e/4)+1;

                if (!code[v]) {
                    code[v] = [];
                }

                code[v].push(e);
            }
        });

        let cf = [];
        let mv = {};
        mainVals.forEach(e => {
            mv[e] = 1;
            if (code[e] && code[e].length > 0) {
                cf.push(code[e][0]);
                code[e].shift();
            } else {
                cf.push(gui[0] + e*4-1);
                gui.shift();
            }
        });

        // 填充带牌
        if (this.isOld && (ctype == ComType.SAND || ctype == ComType.FJ2D)) {
            let dai = [];
            for (const k in code) {
                (code[k].length > 0) && dai.push(parseInt(k));
            }
            
            dai.forEach(e => {
                if (code[e].length<2) {
                    code[e].push(gui[0] + e*4-1);
                    gui.shift();
                }
            });

            for (let i = 15; gui.length>0 && i>=3; --i) {
                let v = (i==15 ? 2 : (i==14 ? 1 : i));
                if (!mv[v] && !code[v]) {
                    code[v] = [gui[0] + v*4-1, gui[1] + v*4-1];
                    gui.shift();
                    gui.shift();
                }
            }
        } else {
            for (let i = 15; gui.length>0 && i>=3; --i) {
                let v = (i==15 ? 2 : (i==14 ? 1 : i));
                if (!mv[v] && !code[v]) {
                    code[v] = [gui[0] + v*4-1];
                    gui.shift();
                }
            }
        }

        let dai = [];
        for (const k in code) {
            (code[k].length > 0) && dai.push(parseInt(k));
        }
        dai.sort( function(a, b) {
            let aa = a;
            let bb = b;
            (aa < 3) && (aa += 13);
            (bb < 3) && (bb += 13);
            return bb - aa;
        });

        dai.forEach(e => cf = cf.concat(code[e]));

        return cf;
    },
    

    /* =================================================================================================================== */
    // 获取正确的组合
    getRightCom: function (sourceCodes, mateCodes, ctype) {
        if (mateCodes) {
            return this.getMatchingCom(sourceCodes, mateCodes, ctype);
        }

        return this.getFreeCom(sourceCodes);
    },
    
    // 分布
    getDistribution: function (codes) {
        let dis = {};
        
        let a = {};
        codes.forEach(e => {
            let v = (e>=52) ? 0 : (Math.floor(e/4) + 1);

            if (!a[v]) {
                a[v] = [];
            }

            a[v].push(e);
        });

        let n = {}
        for (const k in a) {
            if (k=='0') continue;

            let len = a[k].length;

            if (!n[len]) {
                n[len] = [];
            }

            n[len].push(a[k]);
        }

        dis.val = a;
        dis.num = n;

        return dis;
    },

    // 匹配组合
    getMatchingCom: function (sourceCodes, mateCodes, ctype) {
        let ifo = this.getCodesInfo(mateCodes);
        let vi = this.getValsInfo(ifo.val);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let dis = this.getDistribution(sourceCodes);
        dis.val;
        dis.num;

        let aaa = null;

        let coms = [];
        let restake={};
        let takeres = [];
        let addResTake = (rt) => {
            rt.sort((a, b) => a-b);
            let rtk = rt.join(',');

            if (restake[rtk]) {
                return;
            } else {
                restake[rtk] = true;
            }
            
            takeres.push(rt);
        }

        if (ctype == ComType.DAN) {
            coms = coms.concat(this.findSameNum(dis, vk, vni, 1));
        } else if (ctype == ComType.DUI) {
            coms = coms.concat(this.findSameNum(dis, vk, vni, 2));
        } else if (ctype == ComType.SHUN) {
            coms = coms.concat(this.findLink(dis, vk, vni, 1));
        } else if (ctype == ComType.LIAND) {
            coms = coms.concat(this.findLink(dis, vk, vni, 2));
        } else if (ctype == ComType.FJ || ctype == ComType.FJCB) {

            let res = this.findLink(dis, vk, vni, 3, ifo);

            let nres = []
            res.forEach(e => {
                let an = 0;
                e.forEach(ei => {
                    let v = (Math.floor(ei/4) + 1);
                    (v==1) && (++an);
                });

                if (an<3) {
                    nres.push(e);
                }
            });
            res = nres;

            let mclen = mateCodes.length;

            if (ctype == ComType.FJCB) {
                let tn = (mclen%4==0) ? (mclen/4) : (mclen/5 * 2);
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, tn, 0);
                    take && addResTake(e.concat(take));
                });
            } else {
                takeres = res;
            }

            coms = coms.concat(takeres);
        } else if (ctype >= ComType.SAN && ctype <= ComType.SAND) {
            let res = this.findSameNum(dis, vk, vni, 3);
                
            let nres = []
            res.forEach(e => {
                let v = (Math.floor(e[0]/4) + 1);
                if (v==1) {
                    aaa = [e];
                } else {
                    nres.push(e);
                }
            });
            res = nres;

            if (ctype == ComType.SAN1) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 1, 0);
                    take && addResTake(e.concat(take));
                });
            } else if (ctype == ComType.SAN2) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 2, 1);
                    take && addResTake(e.concat(take));
                });
            } else if (ctype == ComType.SAND) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 2, 2);
                    take && addResTake(e.concat(take));
                });
            } else {
                takeres = res;
            }

            coms = coms.concat(takeres);
        } else if (ctype == ComType.SID2 || ctype == ComType.SID3) {
            let res = this.findSameNum(dis, vk, vni, 4);

            if (ctype == ComType.SID2) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 2, 0);
                    take && addResTake(e.concat(take));
                });
            } else if (ctype == ComType.SID3) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 3, 0);
                    take && addResTake(e.concat(take));
                });
            } else {
                takeres = res;
            }

            coms = coms.concat(takeres);
        }

        // 3A带2  3A带3
        if (ctype == ComType.SID2 || ctype == ComType.SID3) {
            let res = this.findSameNum(dis, vk, vni, 3);

            let nres = []
            res.forEach(e => {
                let v = (Math.floor(e[0]/4) + 1);
                if (v==1) {
                    aaa = [e];
                    nres = [e];
                }
            });
            res = nres;

            if (aaa) {
                if (ctype == ComType.SID2) {
                    res.forEach(e => {
                        let take = this.findTake(sourceCodes, e, 2, 0);
                        take && addResTake(e.concat(take));
                    });
                } else if (ctype == ComType.SID3) {
                    res.forEach(e => {
                        let take = this.findTake(sourceCodes, e, 3, 0);
                        take && addResTake(e.concat(take));
                    });
                }

                coms = coms.concat(takeres);
            }
        }

        //ZD
        if (ctype==ComType.AAA2 || ctype==ComType.AAA3 || ctype<=ComType.ZD) {
            let zd = this.findSameNum(dis, (ctype==ComType.ZD) ? vk : null, vni, 4);
            if (zd.length>0) {
                //coms = coms.concat();
                coms = this.MatchingComSort0(coms, zd); 
            }
        }

        
        //AAA
        if (!aaa) {
            let res = this.findSameNum(dis, vk, vni, 3);
            res.forEach(e => {
                let v = (Math.floor(e[0]/4) + 1);
                if (v==1) {
                    aaa = [e];
                }
            });
        }
        if (aaa) {
            //coms = coms.concat(aaa);
            coms = this.MatchingComSort1(coms, aaa);
        }

        return coms;
    },
    findSameNum: function (dis, vk, vni, num) {
        vk && vk.sort((a, b) => vni[b] - vni[a]);

        let lv = vk ? ((vk[0]<3) ? (vk[0]+13): vk[0]) : 2;

        let res = [];
        let nv = {}; //已经找过的纯数量
        if (!this.gm.__tipbig) {
            let ndis = dis.num[num];
            for (let i = 0, L=ndis?ndis.length:0; i < L; ++i) {
                let codes = ndis[i];
                let v = (Math.floor(codes[0]/4) + 1);
                v = (v<3) ? (v+13) : v;
    
                if (v <= lv) continue;
    
                nv[v]=1;
                res.push(cc.g.clone(codes));
            }
        }

        res.sort((a, b) => {
            let va = ((a[0]<8) ? (a[0]+53) : a[0]);
            let vb = ((b[0]<8) ? (b[0]+53) : b[0]);
            return (va - vb);
        });

        // --------------------------------------------------------------

        // 鬼
        let gn = dis.val[0] ? dis.val[0].length : 0;
        let allg = false;
        
        // 考虑3A炸 2要特殊处理
        let maxv = (num==3) ? 16:15;
        for (let v = lv+1; v<=15 || v==maxv; ++v) {
            if (nv[v]) continue;

            let ov = (maxv==16 && v==maxv) ? 1 : (v>13 ? (v-13) : v);
            let van = dis.val[ov] ? dis.val[ov].length : 0;
            if (num<4 && van>=4) {
                continue; //跳过炸弹
            }
            
            if (van+gn < num) {
                continue; //数量不够
            }

            if (van==0 && allg) {
                continue; //已经添加过全鬼
            }

            let useg = (num<van) ? 0 : (num-van);
            let arr = [];
            for (let i = 0; i < useg; ++i) {
                arr.push(dis.val[0][i]);
            }
            for (let i = 0; i < (num-useg); ++i) {
                arr.push(dis.val[ov][i]);
            }

            (van==0) && (allg = true);

            res.push(arr);
        }

        if (res.length>0 && num==1 && this.gm.__tipbig) {
            res.sort((a, b) => {
                let va = ((a[0]<8) ? (a[0]+53) : a[0]);
                let vb = ((b[0]<8) ? (b[0]+53) : b[0]);
                return (vb - va);
            });

            res = [res[0]];
        }

        return res;
    },
    findLink: function (dis, vk, vni, same, ifo) {
        let mlk = ifo ? this.checkLian(ifo, 3) : null;

        if (mlk) {
            vk = mlk.lk;
            let vni0 = {};
            vk.forEach(e => {
                if (vni[e]>=same) {
                    vni0[e] = vni[e];
                }
            });
            vni = vni0;
        } else {
            if (same >= 3) {
                cc.log('提示飞机出现问题 无法分析对方飞机最长链 请召唤程序员调试');
            }

            let vk0 = [];
            let vni0 = {};
            vk.forEach(e => {
                if (vni[e]>=same) {
                    vk0.push(e);
                    vni0[e] = vni[e];
                }
            });
            vk = vk0;
            vni = vni0;
        }

        vk.sort((a,b) => (a-b));

        let bv = -1;
        if (vni[1]) {
            // 有A
            return [];
        } else {
            bv = vk[1];
        }

        let res = [];
        
        let len = vk.length;
        
        // 鬼
        let val0 = dis.val[0] ? dis.val[0] : [];

        for (let b = bv; (b + len-1) <= 14; ++b) {
            let ov = (b>13 ? (b-13) : b);
            let link = [];
            let gui = cc.g.clone(val0);

            for (let i = 0; i < len; i++) {
                let ovi = ov+i;
                ovi = (ovi>13 ? (ovi-13) : ovi);
                let dv = dis.val[ovi];
                let vlen =  dv ? dv.length : 0;

                for (let j = 0; j<vlen && j<same; ++j) {
                    link.push(dv[j]);
                }

                if (vlen>=same) continue;

                let N = same-vlen;
                if (gui.length < N) break;

                for (let f = 0; f < N; ++f) {
                    link.push(gui[0]);
                    gui.shift();
                }
            }

            if (link.length == len*same) {
                res.push(link);
            }
        }

        return res;
    },
    findTake: function (sourceCodes, codes, num, same) {
        let scodes = cc.g.clone(sourceCodes);

        // 主牌值
        let mv = {};
        if (this.isOld) {
            codes.forEach(e => {
                if (e < 52) {
                    let v = Math.floor(e/4)+1;
                    mv[v] = true;
                } 
            });
        }

        // 从源牌去除 主牌及其同值
        codes.forEach(e => {
            let ctn = false;
            let newsc = []
            scodes.forEach(e1 => {
                let v = Math.floor(e1/4)+1;
                if (mv[v]) return;
                
                if (ctn || (e1!=e)) {
                    newsc.push(e1);
                }

                (e1==e) && (ctn=true);
            });
            scodes = newsc;
        });

        // 剩下卡的分布情况
        let dis = this.getDistribution(scodes);
        dis.val;
        dis.num;

        for (const n in dis.num) {
            const e = dis.num[n];

            e.sort((a, b)=>{
                if (a[0]<=7 && b[0]>7) {
                    return 1;
                }
                if (a[0]>7 && b[0]<=7) {
                    return -1;
                }
                return a[0]-b[0];
            });
        }

        let take = [];
        if (same > 0) {//全散 或  对子
            //
            let tn = num;
            for (let n = same; n <= 3; ++n) {
                let ndis = dis.num[n];
                for (let i = 0, L=ndis?ndis.length:0; i < L; ++i) {
                    for (let j = 0; j < same; ++j) {
                        take.push(ndis[i][j]);
                    }
                    tn-=same;
                    if (tn <= 0) break;
                }
                if (tn <= 0) break;
            }

            // 需要通过鬼牌来找
            if (tn>0 && dis.val[0]) {
                let gn = dis.val[0].length;
                let gi = 0;
                for (let n = same-1; n >= 0; --n) {
                    let ndis = dis.num[n];
                    for (let i = 0, L=ndis?ndis.length:0; i < L; ++i) {
                        let len = ndis[i].length;
                        if (len+gn < same) {
                            continue; //数量不够
                        }

                        take = take.concat(ndis[i]);
                        tn-=len;
                        
                        for (let i = 0; i<(same-len) && gi<gn; ++i, ++gi) {
                            take.push(dis.val[0][gi]);
                            --tn;
                        }
                        
                        if (tn <= 0) break;
                    }
                    if (tn <= 0) break;
                }
            }

            tn>0 && (take=null);
        } else {
            let tn = num;
            for (let n = 1; n <= 2; ++n) {
                let ndis = dis.num[n];
                for (let i = 0, L=ndis?ndis.length:0; i < L; ++i) {
                    for (let j = 0; j < ndis[i].length; ++j) {
                        take = take.concat(ndis[i][j]);
                        --tn;
                        if (tn <= 0) break; 
                    }
                    if (tn <= 0) break;
                }
                if (tn <= 0) break;
            }

            tn>0 && (take=null);
        }

        return take;
    },
    MatchingComSort0: function (comsRes, zd) {
        let zdk = {};

        zd.forEach(e => {
            let v = (Math.floor(e[0]/4) + 1);
            zdk[v] = true;
        });

        let nochai = [];
        let chai = [];

        comsRes.forEach(e => {
            let isin = 0;

            for (let i = 0; i < e.length; ++i) {
                let v = (Math.floor(e[i]/4) + 1);
                if (zdk[v]) {
                    isin = true;
                    break;

                }
            } 

            (isin) ? chai.push(e) : nochai.push(e);
        });

        return nochai.concat(zd).concat(chai);
    },
    MatchingComSort1: function (comsRes, A3) {
        let noa = [];
        let ain = [];

        comsRes.forEach(e => {
            let isin = 0;

            for (let i = 0; i < e.length; ++i) {
                let v = (Math.floor(e[i]/4) + 1);
                if (v==1) {
                    isin = true;
                    break;
                }
            }

            (isin) ? ain.push(e) : noa.push(e);
        });

        return noa.concat(A3).concat(ain);
    },


    // 自由组合
    getFreeCom: function (sourceCodes) {
        let ifo = this.getCodesInfo(sourceCodes);
        let vi = this.getValsInfo(ifo.val);
        let gui = vi.gui;
        let vni = vi.vni;
        let vk = vi.vk;

        let dis = this.getDistribution(sourceCodes);
        dis.val;
        dis.num;

        let aaa = null;

        let coms = [];
        let restake={};
        let takeres = [];
        let addResTake = (rt) => {
            rt.sort((a, b) => a-b);
            let rtk = rt.join(',');

            if (restake[rtk]){
                return;
            } else {
                restake[rtk] = true;
            }
            
            takeres.push(rt);
        }

        // 首出
        if (!this.is2 && this.gm.__shouchu) {

            for (let v = 3; v <= 15; ++v) {
                let ov = (v>13 ? (v-13) : v);
                let num = dis.val[ov] ? dis.val[ov].length : 0;
    
                if (num <= 0) continue;

                let arr = [];
                for (let i = 0; i < num; ++i) {
                    arr.push(dis.val[ov][i]);
                }
    
                coms.push(arr);
    
                break;
            }

            return coms;
        }

        // 飞机
        {
            let res = this.findLinkFree(dis, 3, 2);
            takeres = [];

            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, e.length/3 * 2, 0);
                take && addResTake(e.concat(take));
            });
            
            if (takeres.length < 1) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, e.length/3 * 1, 0);
                    take && addResTake(e.concat(take));
                });
            }

            if (takeres.length < 1) {
                takeres = res;
            }

            coms = coms.concat(takeres);
        }
        // 连对
        {
            let res = this.findLinkFree(dis, 2, 2);
            coms = coms.concat(res);
        }
        // 顺子
        {
            let res = this.findLinkFree(dis, 1, 5);
            coms = coms.concat(res);
        }
        //三带
        {
            let res = this.findSameNumFree(dis, 3);
            takeres = [];

            let nres = []
            res.forEach(e => {
                let v = (Math.floor(e[0]/4) + 1);
                if (v==1) {
                    aaa = [e];
                } else {
                    nres.push(e);
                }
            });

            res = nres;

            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, 1, 0);
                take && addResTake(e.concat(take));
            });
            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, 2, 1);
                take && addResTake(e.concat(take));
            });
            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, 2, 2);
                take && addResTake(e.concat(take));
            });

            if (takeres.length < 1) {
                takeres = res;
            }

            coms = coms.concat(takeres);
        }

        //四带
        {
            let res = this.findSameNumFree(dis, 4);
            takeres = [];

            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, 2, 0);
                take && addResTake(e.concat(take));
            });
            res.forEach(e => {
                let take = this.findTake(sourceCodes, e, 3, 0);
                take && addResTake(e.concat(take));
            });

            coms = coms.concat(takeres);
        }

        // 对子
        coms = coms.concat(this.findSameNumFree(dis, 2));

        // 下家报单需要出最大
        if (this.gm.__tipbig) {
            // 老玩法炸弹
            coms = coms.concat(this.findSameNumFree(dis, 4));
            // AAA
            if (aaa) coms = coms.concat(aaa);

            // 没有单牌意外的类型再找单张
            if (coms.length < 1) {
                coms = coms.concat(this.findSameNumFree(dis, 1));
            }
        } else {
            // 单张
            coms = coms.concat(this.findSameNumFree(dis, 1));

            // 炸弹
            coms = coms.concat(this.findSameNumFree(dis, 4));
            // AAA
            if (aaa) coms = coms.concat(aaa);
        }

        return coms;
    },
    findSameNumFree: function (dis, num) {
        let res = [];

        // 下家报单
        if (num==1 && this.gm.__tipbig) {
            let n2 = dis.val[2] ? dis.val[2].length : 0;
            let gn = dis.val[0] ? dis.val[0].length : 0;
            if (n2>0) {
                res.push([dis.val[2][0]]);
            } else if (gn>0) {
                res.push([dis.val[0][0]]);
            } else {
                for (let v = 14; v >= 3; --v) {
                    let ov = (v>13 ? (v-13) : v);
                    let n = dis.val[ov] ? dis.val[ov].length : 0;
        
                    if (n < 1) continue;
        
                    res.push([dis.val[ov][0]]);
        
                    break;
                }
            }

            return res;
        }

        if (!this.gm.__tipbig) {
            let ndis = dis.num[num];
            if (ndis && ndis.length > 0) {
                res = cc.g.clone(ndis);
            }
        }

        if (res.length < 1) {
            for (let v = 3; v <= 15; ++v) {
                let ov = (v>13 ? (v-13) : v);
                let van = dis.val[ov] ? dis.val[ov].length : 0;
    
                if (van < num) continue;
                if (num<4 && van>=4) continue;
    
                let arr = [];
                for (let i = 0; i < num; ++i) {
                    arr.push(dis.val[ov][i]);
                }
    
                res.push(arr);
    
                break;
            }
    
            if (res.length < 1) {
                // 鬼
                let gn = dis.val[0] ? dis.val[0].length : 0;
    
                for (let v = 3; v <= 15; ++v) {
                    let ov = (v>13 ? (v-13) : v);
                    let van = dis.val[ov] ? dis.val[ov].length : 0;
        
                    if (van+gn < num) continue; //数量不够
    
                    let useg = (num-van > 0) ? (num-van) : 0;
                    let arr = [];
                    for (let i = 0; i < useg; ++i) {
                        arr.push(dis.val[0][i]);
                    }
                    for (let i = 0; i < (num-useg); ++i) {
                        arr.push(dis.val[ov][i]);
                    }
    
                    res.push(arr);
    
                    break;
                }
            }
        }

        if (res.length > 0) {
            res.sort((a, b) => {
                let va = ((a[0]<8) ? (a[0]+53) : a[0]);
                let vb = ((b[0]<8) ? (b[0]+53) : b[0]);
                return (va - vb);
            });
            //res = [res[0]];
        }

        return res;
    },
    findLinkFree: function (dis, sameNum, linklen, min) {
        let res = [];

        let LK = [3,4,5,6,7,8,9,10,11,12,13,1];

        // 寻找最长连
        let mlink = [];
        for (let i = 0; i < LK.length; ++i) {

            let gn = dis.val[0] ? dis.val[0].length : 0;
            let link = [];

            for (let j = i; j < LK.length; ++j) {
                let k = LK[j];
                let n = dis.val[k] ? dis.val[k].length : 0;

                if (n >= sameNum) {
                    link.push(k);
                } else {
                    if (gn >= (sameNum-n)) {
                        link.push(k);
                        gn -= (sameNum-n);
                    } else {
                        break;
                    }
                }

                if (linklen==1) break; // 单炸 长度就1
            }

            if (link.length >= linklen && link.length > mlink.length) {
                mlink = link;
            }
        }
        
        // 没有足够连以上的
        if (mlink.length < 1) {
            return [];
        }

        let gui = cc.g.clone(dis.val[0]);
        let lk=[];
        mlink.forEach(k => {
            let va = dis.val[k] ? dis.val[k] : [];

            for (let i = 0; i<va.length && i<sameNum; ++i) {
                lk.push(va[i]);
            }

            let gn = sameNum - va.length;

            for (let i = 0; i<gn; ++i) {
                lk.push(gui[0]);
                gui.shift();
            }
        });

        res.push(lk);

        return res;
    },

    /* =================================================================================================================== */


    /* =================================================================================================================== */


    // ===================================================================================================================
});

