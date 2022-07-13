const { concat } = require('bytebuffer');
let DEF = require('ddz5Def');

let jokor = 52;
let JOKOR = 53;
let vGUI = 54;

// Combination type 组合类型
let ComType = DEF.ComType;

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '斗地主5人逻辑'

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

        for (let i = 0; i < gm.roomInfo.NewRlue.length; ++i) {
            let e = gm.roomInfo.NewRlue[i];
            if (e == 3) {
                this.WZCOMP = 'RED';
            } else if (e == 4) {
                this.WZCOMP = 'NUM';
            } else if (e == 5) {
                this.WZCOMP = 'JNUM';
            }
        }

        this.gm = gm;
        this.gm.__tipbig = false;
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

            if (e === vGUI) {
                o.val = e;
                o.color = '听用';
                o.str = '听用';
            } else if (e === jokor) {
                o.val = e;
                o.color = '小鬼';
                o.str = '小鬼';
            } else if (e === JOKOR) {
                o.val = e;
                o.color = '大鬼';
                o.str = '大鬼';
            } else {
                if (e == 100+jokor) {
                    o.val = e;
                    o.color = '听小鬼';
                    o.str = '听小鬼';
                } else if (e == 100+JOKOR) {
                    o.val = e;
                    o.color = '听大鬼';
                    o.str = '听大鬼';
                } else {
                    let elm = (e>=100 ? e-100 : e);

                    let val = Math.floor(elm/4)+1;
                    let clr = elm%4;
        
                    //(val==1) && (val=14);
                    //(val==2) && (val=15);
        
                    o.val = val;
                    o.color = this.color[clr];
                    o.str = this.color[clr] + this.value[val];
                }
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
                let elm = (e>=100 ? vGUI : e);
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
        SAN1:6, //三带一
        //SAN2:61,
        //SAND:62,
        FJ:7,   //飞机
        FJCB:8, //飞机带翅膀
        //FJ4:81,
        //FJ2D:82,
        ZD:9,   //炸弹
        ZDW:10, //王炸
        ZD8:11, //八个头 
        ZDTW:12,//天王炸
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

        let ctype = tgType;

        return Combs;

        if (!ctype) {
            return Combs;
        }

        let ifo = this.getCodesInfo(tgCodes);
        let r = null;

        if (ctype==ComType.DAN) {
            r = this.checkDan(ifo);
        } else if (ctype==ComType.DUI) {
            r = this.checkDui(ifo);
        } else if (ctype==ComType.SAN) {
            r = this.checkSan(ifo, 0);
        } else if (ctype==ComType.SAN1) {
            r = this.checkSan(ifo, 1);
        // } else if (ctype==ComType.SAN2) {
        //     r = this.checkSan(ifo, 2);
        // } else if (ctype==ComType.SAND) {
        //     r = this.checkSan(ifo, 2, SAND);
        } else if (ctype==ComType.SHUN) {
            r = this.checkLian(ifo, 1);
        } else if (ctype==ComType.LIAND) {
            r = this.checkLian(ifo, 2);
        } else if (ctype>=ComType.FJ && ctype<=ComType.FJCB) {
            r = this.checkLian(ifo, 3);
        } else if (ctype>=ComType.ZD) {
            r = this.checkZD(ifo);
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
        if (!ctype || (ctype==ComType.SAN)) {
            r = this.checkSan(ifo, 0);
            if (r) {
                com.push(r);
                return com;
            } 
        }

        // 炸弹 4张以后都有可能是 如果能判定为炸弹就忽略其他类型了
        r = this.checkZD(ifo);
        if (r) {
            com.push(r);
            return com;
        }
        

        // 三带1
        if (!ctype || ctype<=ComType.SAN1) {
            r = this.checkSan(ifo, 1);
            r && com.push(r)
            if (ctype==ComType.SAN1) return com;
        }
        

        // 三带2
        if (false) {
            if (!ctype || (this.isOld && (ctype==ComType.SAN2 || ctype==ComType.SAND)) || (!this.isOld && ctype<=ComType.SAN)) {
                r = this.isOld ? this.checkSan(ifo, 2, ctype) : this.checkSan(ifo, 2);
                r && (!ctype || (this.isOld && r.type==ctype) || (!this.isOld && r.type==ComType.SAN)) && com.push(r);
                
                if (this.isOld) {
                    if (ctype==ComType.SAN2 || ctype==ComType.SAND) {
                        return com;
                    }
                } else {
                    if (ctype && r && ctype<=ComType.SAN) {
                        return com;
                    }
                }
            }
        }
        

        // 顺子
        if (!ctype || ctype==ComType.SHUN) {
            r = this.checkLian(ifo, 1);
            r && com.push(r)
            if (ctype==ComType.SHUN) return com;
        }

        // 连对
        if (!ctype || ctype==ComType.LIAND) {
            r = this.checkLian(ifo, 2);
            r && com.push(r);
            if (ctype==ComType.LIAND) return com;
        }

        // 飞机
        if (!ctype || (ctype>=ComType.FJ && ctype<=ComType.FJCB)) {
            r = this.checkLian(ifo, 3);
            r && com.push(r)
            if (ctype>=ComType.FJ && ctype<=ComType.FJCB) return com;
        }

        return com;
    },

    //
    getValsInfo: function (vals, min) {
        min = min ? min : 4; //5人斗地主 最小从4开始

        let o={};
        o.gui = 0;
        o.j = 0;
        o.J = 0;
        o.tj = 0;
        o.TJ = 0;
        
        let v = [];
        vals.forEach(e => {
            if (e==vGUI) {
                ++o.gui;
            } else if (e==jokor) {
                ++o.j;
            } else if (e==JOKOR) {
                ++o.J;
            } else if (e==100+jokor) {
                ++o.tj;
            } else if (e==100+JOKOR) {
                ++o.TJ;
            } else {
                v.push(e);
            }
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

    // 检查单牌 anheifelling@126.com
    checkDan: function (ifo) {
        if (ifo.val.length != 1) return null;

        if (ifo.val[0]>=vGUI) return null;

        let res = {};
        res.codes = cc.g.clone(ifo.codes);
        res.type = ComType.DAN;
        res.desc = '单张';

        if (ifo.val[0]>=52) {
            res.lv = 15 + 1 + ifo.val[0]-52;
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
        let jn = vi.j;
        let JN = vi.J;
        let vni = vi.vni;
        let vk = vi.vk;

        // 跳过全鬼
        if (gui>=len) return null;

        // 普通对子不能有王
        if (jn>0 || JN>0) return null;

        let res = {};
        res.codes = cc.g.clone(codes);
        res.type = ComType.DUI;
        res.desc = '对子';
        
        // 对子有且只有一种值
        if (vk.length==1) {
            res.lv = vk[0];
            (gui > 0) && (res.change = this.getChangeFace([res.lv, res.lv], res.codes));
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
        let jn = vi.j;
        let JN = vi.J;
        let vni = vi.vni;
        let vk = vi.vk;

        // 跳过全鬼
        if (gui>=len) return null;

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
            // 必须1种类型的牌 并且不为王
            if (len!=3 || (jn+JN > 0) || vk.length!=1) return null;
        } if (num==1) {
            // 王不能超过1个
            if (len!=4 || (jn+JN > 1)) return null;

            // 没有王 必须2种类型的牌 否则只能1种
            if (jn+JN==0) {
                if (vk.length!=2) return null;
            } else {
                if (vk.length!=1) return null;
            }
        } if (num==2) {
            // 必须3种类型内的牌
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

        if (num==2) {
            // 这里写的比较笨拙
            if (vk.length==3 || (vk.length==2 && gui==3)) {
                // 一定带2张
            } else if (vk.length==2 && (gui==0 || (gui==1 && vni[vk[0]]==2))) {
                // 一定带对
                res.type = ComType.SAND;
            } else {
                (ctype != ComType.SAN2) && (res.type == ComType.SAND);
            }
        }

        if (res.lv) {
            (gui > 0) && (res.change = this.getChangeFace([res.lv, res.lv, res.lv], res.codes));
            (res.lv<=2) && (res.lv += 13);
            //(res.type == ComType.SAND) && (res.desc = '三带对');
            return res;
        }

        return null;
    },
    
    // 检查联牌 1,2,3,4,5....
    checkLian: function (ifo, sameNum, min, ctype) {
        let codes = ifo.codes;
        let vals = ifo.val;

        let len = vals.length;
        if (sameNum==1) {
            if (len<5) return null;
        } else if (sameNum==2) {
            if (len<6 || len%2) return null;
        } else if (sameNum==3) {
            if (len%4!=0 && len%3!=0) return null;
        } else {
            return null;
        }

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let jn = vi.j;
        let JN = vi.J;
        let vni = vi.vni;
        let vk = vi.vk;

        // 顺子 连对
        if (sameNum==1 || sameNum==2) {
            // 不能有王 2
            if (jn+JN>0 || (vni[2] && vni[2]>0)) return null;

            // 每种牌不能超过基础数量
            for (const k in vni) {
                if (vni[k]>sameNum) return null;
            }
        }

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
        }

        let LK = [1,13,12,11,10,9,8,7,6,5,4,];

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
            if (mlink.length<5) return null;

        } else if (sameNum==2) {
            if (mlink.length<3) return null;

        } else if (sameNum==3) {
            if (mlink.length<2) return null;
        }

        // 分析剩下牌能不能带
        let lk={};
        mlink.forEach(e => lk[e] = vni[e]); //连子里每种牌的数量
        let san={}; // 多出来和剩下的散牌
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
        let sct = 0; // 剩下的散牌数量统计
        sk.forEach(e => sct+=san[e]);

        // 顺子 连对
        if (sameNum < 3) {
            if (sct+gn + jn+JN > 0) return null;
            res.lv = mlink[0];
        } else {
            if ((sct+gn + jn+JN) == 0) {
                res.lv = mlink.length*100 + mlink[0];
            } else if ((sct+gn + jn+JN) == mlink.length) {
                res.lv = mlink.length*100 + mlink[0];
                res.type =  ComType.FJCB;
                res.desc = '飞机';//'飞机带翅膀';
            }

            if (false) {
                if (this.isOld) {
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
                    if ((sct+gn) <= (mlink.length * 2)) {
                        res.lv = mlink.length*100 + mlink[0];
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

        let vi = this.getValsInfo(vals);
        let gui = vi.gui;
        let jn = vi.j;
        let JN = vi.J;
        let tjn = vi.tj;
        let TJN = vi.TJ;
        let vni = vi.vni;
        let vk = vi.vk;

        if (gui >= len) return;

        let res = {};
        res.codes = cc.g.clone(codes);
        
        // 王炸
        if (len == 2) {
            if (jn + JN + tjn + TJN + gui != 2) return null;

            res.type = ComType.ZDW;
            res.desc = '王炸';
            res.lv = jokor*(jn+tjn) + JOKOR*(JN+TJN+gui);
        }

        // 天王炸
        if (len == 4) {
            if (jn + JN + tjn + TJN + gui == 4) {
                res.type = ComType.ZDTW;
                res.desc = '天王炸';
                res.lv = jokor*(jn+tjn) + JOKOR*(JN+TJN+gui);  
            } else {
                // 普通炸弹
                if (vk.length!=1 || vni[vk[0]]+gui != 4) return null;
            
                res.type = ComType.ZD;
                res.desc = '炸弹';
                res.lv = vk[0]>2? vk[0] : (vk[0]+13);;

                (gui>0) && (res.change = this.getChangeFace([vk[0],vk[0],vk[0],vk[0]], res.codes));
            }
        }

        // 八头炸
        if (len == 8) {
            if (vk.length!=1 || vni[vk[0]]+gui != 8) return null;
            
            res.type = ComType.ZD8;
            res.desc = '八头炸';
            res.lv = 153;

            (gui>0) && (res.change = this.getChangeFace([vk[0],vk[0],vk[0],vk[0],vk[0],vk[0],vk[0],vk[0]], res.codes));
        }

        if (res.lv && gui>0 && !res.change) {
            let mv=[];
            for (let i = 0; i < jn; ++i) {
                mv.push(jokor);
            }
            for (let i = 0; i < (8-jn); ++i) {
                mv.push(JOKOR);
            }
            res.change = this.getChangeFace(mv, res.codes);
        }
        
        return (res.lv) ? res : null;
    },
    
    // 获取有鬼牌改变后的牌
    getChangeFace: function (mainVals, codes, ctype) {
        let gui = [];
        let code = {};
        codes.forEach(e => {
            if (e == vGUI) {
                gui.push(100);
            } else {
                let v = (e==jokor || e==JOKOR) ? e : (Math.floor(e/4) + 1);
                
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
                if (e==jokor || e==JOKOR) {
                    cf.push(gui[0] + e);
                } else {
                    cf.push(gui[0] + e*4-1);
                }
                
                gui.shift();
            }
        });

        // 填充带牌
        if ((ctype == ComType.SAND || ctype == ComType.FJ2D)) {
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
            // 如果还有多余的鬼牌 就变成从大到小并且和主要牌和已经有的带牌不一样
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
            let v = -1;

            if (e==vGUI) {
                v = 0;
            } else if (e==jokor || e==JOKOR) {
                v = e;
            } else {
                v = Math.floor(e/4) + 1
            }

            if (!a[v]) {
                a[v] = [];
            }

            a[v].push(e);
        });

        let n = {}
        for (const k in a) {
            if (k=='0') continue;
            if (parseInt(k)==jokor || parseInt(k)==JOKOR) continue;

            let len = a[k].length;

            if (!n[len]) {
                n[len] = [];
            }

            n[len].push(a[k]);
        }

        dis.val = a;
        dis.num = n;

        if (!dis.val[jokor]) {
            dis.val[jokor]=[];
        }
        if (!dis.val[JOKOR]) {
            dis.val[JOKOR]=[];
        }
        if (!dis.val[0]) {
            dis.val[0]=[];
        }

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

        if (ctype == ComType.DAN) {
            coms = coms.concat(this.findSameNum(dis, vk, vni, 1, vi)); //单牌鬼要用VI
        } else if (ctype == ComType.DUI) {
            coms = coms.concat(this.findSameNum(dis, vk, vni, 2));
        } else if (ctype == ComType.SHUN) {
            coms = coms.concat(this.findLink(dis, vk, vni, 1));
        } else if (ctype == ComType.LIAND) {
            coms = coms.concat(this.findLink(dis, vk, vni, 2));
        } else if (ctype == ComType.FJ || ctype == ComType.FJCB) {
            //ctype == ComType.FJ4 || ctype == ComType.FJ2D

            let res = this.findLink(dis, vk, vni, 3);

            if (ctype == ComType.FJCB) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, e.length/3, 0);
                    take && addResTake(e.concat(take));
                });
            } else if (ctype == ComType.FJ4) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 4, 1);
                    take && addResTake(e.concat(take));
                });
            } else if (ctype == ComType.FJ2D) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 4, 2);
                    take && addResTake(e.concat(take));
                });
            } else {
                takeres = res;
            }

            coms = coms.concat(takeres);
        }

        if (coms.length < 1) {
            if (ctype == ComType.SAN || ctype == ComType.SAN1) {
                let res = this.findSameNum(dis, vk, vni, 3);
                
                if (ctype == ComType.SAN1) {
                    res.forEach(e => {
                        let take = this.findTake(sourceCodes, e, 1, 1);
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
            }
        }


        // 炸弹
        if (ctype<ComType.ZD) {
            coms = coms.concat(this.findSameNum(dis, null, vni, 4));
        } else if (ctype == ComType.ZD) {
            coms = coms.concat(this.findSameNum(dis, vk , vni, 4));
        }

        // 王炸
        if (ctype<ComType.ZDW) {
            coms = coms.concat(this.findWZ(dis, null));
        } else if (ctype == ComType.ZDW) {
            coms = coms.concat(this.findWZ(dis, vi));
        }

        // 8头炸
        if (ctype<ComType.ZD8) {
            coms = coms.concat(this.findSameNum(dis, null, vni, 8));
        } else if (ctype == ComType.ZD8) {
            coms = coms.concat(this.findSameNum(dis, vk , vni, 8));
        }

        // 天王炸
        if (ctype<ComType.ZDTW) {
            coms = coms.concat(this.findTWZ(dis, null));
        } else if (ctype == ComType.ZDTW) {
            coms = coms.concat(this.findTWZ(dis, vi));
        }

        return coms;
    },
    findSameNum: function (dis, vk, vni, num, vi) {
        let res = [];

        if (num==1 && vi.j==1) {
            if (dis.val[JOKOR].length>0) {
                res.push([JOKOR]);
            }
            return res;
        }

        if (num==1 && vi.J==1) {
            return res;
        }

        vk && vk.sort((a, b) => vni[b] - vni[a]);
    
        let lv = vk ? ((vk[0]<3) ? (vk[0]+13): vk[0]) : 2;
    
        
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

        if (num==1) {
            if (dis.val[jokor].length>0) {
                res.push([jokor]);
            }
            if (dis.val[JOKOR].length>0) {
                res.push([JOKOR]);
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
        
        for (let v = lv+1; v <= 15; ++v) {
            if (nv[v]) continue;
    
            let ov = (v>13 ? (v-13) : v);
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
    
            if (van==0) {
                allg = true;
                continue;
            };
    
            res.push(arr);
        }
    
    
        if (num==1 && this.gm.__tipbig) {
            res.sort((a, b) => {
                let va = ((a[0]<8) ? (a[0]+53) : a[0]);
                let vb = ((b[0]<8) ? (b[0]+53) : b[0]);
                return (vb - va);
            });
    
            res = [res[0]];
        }
    
        return res;
    },
    findLink: function (dis, vk, vni, same) {
        // 提取主要的牌 过滤可能有的带牌
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

        vk.sort((a,b) => (a-b));
        
        let bv = -1;
        if (vni[1]) {
            // A-K....
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
                let vlen = dv ? dv.length : 0;

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
    findBigerWZ: function (res, vi) {
        if (!vi) {
            return []
        }

        /*
        王炸大小
        3 见红为大(规则选项)
            出（天）王炸时，谁先出的（天）王炸有大王谁就大 不包含听用牌
        4 大王多为大(规则选项)
            比大王个数，听用牌也可作为大王
        5 硬王多为大(规则选项)
            比硬王的个数，个数一样时在比较硬王中大小王的大小
        */

        let jn = vi.j;
        let JN = vi.J;
        let tjn = vi.tj;
        let TJN = vi.TJ;

        let nres = [];
        
        if (this.WZCOMP == 'RED') {
            if (JN <= 0) {
                res.forEach(r => {
                    let n = 0;
                    r.forEach(e => (e==JOKOR) && ++n);
                    if (n > 0) nres.push(r); // 硬大王比对面多
                });
            }
        } else if (this.WZCOMP == 'NUM') {
            res.forEach(r => {
                let n = 0;
                r.forEach(e => (e>=JOKOR) && ++n);
                if (n > JN+TJN) nres.push(r); // 大王+听用比对面多
            });
        } else if (this.WZCOMP == 'JNUM') {
            res.forEach(r => {
                let n = 0;//小王的数量
                let N = 0;//大王的数量

                r.forEach(e => {
                    if (e==jokor) {
                        ++n;
                    } else if (e==JOKOR) {
                        ++N;
                    }
                });

                if (n+N > jn+JN) {
                    //硬王比对面多
                    nres.push(r);   
                } else if (n+N == jn+JN) {
                    //大王比对面多
                    if (N > JN) {
                        nres.push(r);
                    }
                }
            });
        }
        
        return nres;
    },
    findWZ: function (dis, ValsInfo) {
        let ja = dis.val[jokor] || [];
        let JA = dis.val[JOKOR]|| [];
        let GA = dis.val[0]|| []; // 听用

        // 起码2个王
        if (ja.length + JA.length + GA.length < 2) {
            return [];
        }

        let res = [];
        let vi = ValsInfo;
        

        // 小鬼
        if (ja[0]) {
            if (ja[1]) res.push([ja[0], ja[1]]);
            if (JA[0]) res.push([ja[0], JA[0]]);
            if (GA[0]) res.push([ja[0], GA[0]]);
        }
        // 大鬼
        if (JA[0]) {
            if (JA[1]) res.push([JA[0], JA[1]]);
            //if (ja[0]) res.push([JA[0], ja[0]]); //如果有大王+小王的组合 上面就已经加过一次 这里避免重复
            if (GA[0]) res.push([JA[0], GA[0]]);
        }

        if (vi) {
            res = this.findBigerWZ(res, vi);
        }
        
        cc.log('findWZ', res);

        return res;
    },
    findTWZ: function (dis, ValsInfo) {
        let ja = dis.val[jokor] || [];
        let JA = dis.val[JOKOR] || [];
        let GA = dis.val[0] || []; // 听用

        // 起码2个王
        if (ja.length + JA.length + GA.length < 4) {
            return [];
        }

        let res = [];
        let vi = ValsInfo;
        
        //
        let f = (twz, idx, jJGarr)=>{
            let arr = jJGarr[idx];
            if (!arr) return;

            let r = cc.g.clone(twz);
            for (let i = 0; i < arr.length; ++i) {
                r.push(arr[i]);
                if (r.length >= 4) {
                    res.push(r);
                    break;
                }

                f(r, idx+1, jJGarr); //接着本层数据 层层递进
            }

            //本层找完 从下层开始新的寻找 但是要排除前面没有王最后找纯听用情况
            if (twz.length>0 || idx+1<2) {
                f(twz, idx+1, jJGarr);
            }
        }

        f([], 0, [ja, JA, GA]);


        if (vi) {
            res = this.findBigerWZ(res, vi);
        }
        
        cc.log('findTWZ', res);

        return res;
    },
    findTake: function (sourceCodes, codes, num, same) {
        let scodes = cc.g.clone(sourceCodes);

        // 主牌值
        let mv = {};
        if (false) {
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
            let newsc = [];
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

        // 剩下牌的分布情况
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
        let tn = num;
        if (same > 0) {//全散 或  对子
            // 先从相同数量的分布里找 没有再往更多数量的分布里拆
            for (let n = same; n <= 19; ++n) {
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
        } else {
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
        }

        if (tn>0) {
            cc.log('没有足够的带牌可以提取  或者需要提取王  提取王的代码还没写');
            take=null
        }

        return take;
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

        // 飞机
        {
            let res = this.findLinkFree(dis, 3, 2);
            takeres = [];

            if (false) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 4, 1);
                    take && addResTake(e.concat(take));
                });
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 4, 2);
                    take && addResTake(e.concat(take));
                });
            } else {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, e.length/3, 0);
                    take && addResTake(e.concat(take));
                });
            }

            coms = coms.concat(takeres);
        }
        // 连对
        {
            let res = this.findLinkFree(dis, 2, 3);
            coms = coms.concat(res);
        }
        // 顺子
        {
            let res = this.findLinkFree(dis, 1, 5);
            if (res.length<1 && this.isOld) {
                res = this.findLinkFree(dis, 1, 5, true);
            }

            coms = coms.concat(res);
        }
        //三带
        {
            let res = this.findSameNumFree(dis, 3);
            takeres = [];

            if (false) {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 2, 1);
                    take && addResTake(e.concat(take));
                });
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 2, 2);
                    take && addResTake(e.concat(take));
                });
            } else {
                res.forEach(e => {
                    let take = this.findTake(sourceCodes, e, 1, 0);
                    take && addResTake(e.concat(take));
                });
            }

            coms = coms.concat(takeres);
        }

        // 对子
        coms = coms.concat(this.findSameNumFree(dis, 2));
        // 单张
        coms = coms.concat(this.findSameNumFree(dis, 1));

        // 炸弹
        coms = coms.concat(this.findSameNumFree(dis, 4));
        // 王炸
        coms = coms.concat(this.findWZFree(dis));
        // 8头炸
        coms = coms.concat(this.findSameNumFree(dis, 8));
        // 天王炸
        coms = coms.concat(this.findTWZFree(dis));

        return coms;
    },
    findSameNumFree: function (dis, num) {
        let res = [];

        let jn = dis.val[jokor].length;
        let JN = dis.val[JOKOR].length;
    
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

            if (num==1 && jn+JN==1) {
                if (jn==1) res.push([jokor]);
                if (JN==1) res.push([JOKOR]);
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

        let LK = [4,5,6,7,8,9,10,11,12,13,1];

        if (sameNum > 3) {
            return null;
        }

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
    findWZFree: function (dis) {
        let ja = dis.val[jokor];
        let JA = dis.val[JOKOR];
        let GA = dis.val[0]; // 听用

        // 起码2个王
        if (ja.length + JA.length + GA.length < 2) {
            return [];
        }

        let res = [];
        
        // 小鬼
        if (ja[0]) {
            if (ja[1]) res.push([ja[0], ja[1]]);
            else if (JA[0]) res.push([ja[0], JA[0]]);
            else if (GA[0]) res.push([ja[0], GA[0]]);
        } else if (JA[0]) {
            if (JA[1]) res.push([JA[0], JA[1]]);
            //if (ja[0]) res.push([JA[0], ja[0]]); //如果有大王+小王的组合 上面就已经加过一次 这里避免重复
            else if (GA[0]) res.push([JA[0], GA[0]]);
        }
        
        return res;
    },
    findTWZFree: function (dis) {
        let ja = dis.val[jokor];
        let JA = dis.val[JOKOR];
        let GA = dis.val[0]; // 听用

        // 起码2个王
        if (ja.length + JA.length + GA.length < 4) {
            return [];
        }

        let res = [];
        
        let twz = [];

        //小王
        if (twz.length < 4) {
            for (let i=0; i<ja.length; ++i) {
                twz.push(ja[i]);
    
                if (twz.length >= 4) break;
            }
        }
        //大王
        if (twz.length < 4) {
            for (let i=0; i<JA.length; ++i) {
                twz.push(JA[i]);
                if (twz.length >= 4) break;
            }
        }
        //听用
        if (twz.length < 4) {
            for (let i=0; i<GA.length; ++i) {
                twz.push(GA[i]);
                if (twz.length >= 4) break;
            }
        }

        if (twz.length < 4) {
            return [];
        }
  
        
        return res;
    },

    /* =================================================================================================================== */


    /* =================================================================================================================== */



    // ===================================================================================================================
});

