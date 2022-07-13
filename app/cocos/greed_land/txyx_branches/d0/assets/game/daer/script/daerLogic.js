let DEF = require('daerDef');

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '大二逻辑'

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    init: function () {
        cc.log(this.dbgstr('init'));

        // 小写 [1,2,3,4,5,6,7,8,9,10]
        // 大写 [11,12,13,14,15,16,17,18,19,20]
        // 红牌 [2,7,10,12,17,20]
        // 黑牌 红牌以外的牌

        // 初始化胡数信息
        this.initHuInfo();

        // 初始化名堂信息
        this.initMingTang();
    },

    // 初始化胡数信息
    initHuInfo: function () {
        let ruleWinList = cc.g.utils.getJson('BigTwoWinList');
        this.huInfo = {};

        for (const key in ruleWinList) {
            const e = ruleWinList[key];

            let id = e.id;
            let combination = e.combination;
            let in_hands = e.in_hands;
            let table_top = e.table_top;

            let k = combination.join(',');
            let v = {
                id: id,
                com: combination,
                h: in_hands,
                t: table_top,
            }

            this.huInfo[k] = v;
        }
    },

    // 初始化名堂信息
    initMingTang: function () {
        let cfg = cc.g.utils.getJson('BigTwoMultipleShow');
        this.mtCfg = {};

        for (const key in cfg) {
            const e = cfg[key];

            let v = {
                id: e.ID,
                key: e.enumerate,
                seq: e.sequence,
                hf: e.position,
            }

            this.mtCfg[v.key] = v;
        }
    },

    /* =================================================================================================================== */
    // 手牌卡组的形式
    handcard2Grops: function(cards) {
        if (true) {
            return this.cards2Grops_2(cards);
        }

        if (!cards || cards.length < 1) {
            return cards;
        }
        
        let low = []; //lowercase
        let cap = []; //Capitalization

        for (let i = 0; i < cards.length; i++) {
            const e = cards[i];

            if (e >=1 && e<=10) {
                low.push(e);
            } else if (e >=11 && e<=20) {
                cap.push(e);
            } else {
                cc.error(this.dbgstr() + '未知的卡牌 ' + e);
            }
        }

        /*
        若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
        若 a 等于 b，则返回 0。
        若 a 大于 b，则返回一个大于 0 的值。
        */
        low.sort( function(a, b) {
            return a - b;
        });
        cap.sort( function(a, b) {
            return a - b;
        });

        let lg = this.cards2Grops(low);
        let cg = this.cards2Grops(cap);

        let grps = lg.concat(cg);

        // 处理意外的超过10组的情况
        if (grps.length > 10) {
            cc.error('成精啦 快叫程序来看看啊');

            let a1 = [];
            let a2 = [];

            for (let i = 0; i < grps.length; ++i) {
                const e = grps[i];
                if (e.length == 1) {
                    a1.push(e[0]);
                } else if (e.length == 2) {
                    a2.push(e);
                }
            }

            for (let idx = 0; idx < a1.length; ) {
                for (let i = 0; i < a2.length; ++i) {
                    if (idx >= a1.length) {
                        break;
                    }
                    if (a2[i].length >= 4) {
                        continue;
                    }
                    a2[i].push(a1[idx++]);
                }
            }

            let newg = []
            grps.forEach(elm => {
                if (elm.length > 1) {
                    newg.push(elm);
                }
            });

            grps = newg;

            if (grps.length > 10) {
                cc.error('完了完了 手牌显示不了了');
            }
        }

        return grps;
    },


    /* =================================================================================================================== */

    nu0:function(){},

    /* =================================================================================================================== */
    // 获取卡牌的数量信息
    cardsNumInfo: function (cards) {
        let info = {}; //数量信息

        for (let i = 0; i < cards.length; i++) {
            const e = cards[i];
            
            if (! info[e]) {
                info[e] = 0;
            }
    
            ++info[e];
        }

        return info;
    },

    // 将卡组转换成牌
    grops2cards: function(groups) {        
        let cards = [];

        for (let i = 0; i < groups.length; i++) {
            cards = cards.concat(groups[i]);
        }

        cards.sort(function(a, b) {return a - b;});

        return cards;
    },

    // 将牌换成卡组的形式
    cards2Grops: function(cards) {
        // 从左至右 小写在坐 大在右
        // 从上至下 小写在上 大在下
        // 3，4单独
        // 对子一列
        // 2710 123 不组合

        let dbg = false;

        if (dbg) {
            cc.log(this.dbgstr('牌 => 组'));
        }
        
        let NIfo = this.cardsNumInfo(cards); //数量信息
        
        let a3 = [];
        let a4 = [];

        // 提取3张和4张
        let leftCards = {};
        for (const k in NIfo) {
            let n = NIfo[k];

            if (n===3) {
                // 3张一样的
                a3.push([k,k,k]);
            } else if (n===4) {
                // 4张一样的
                a4.push([k,k,k,k]);
            } else {
                leftCards[k] = n;
            }
        }

        if (dbg && a3.length > 0) {
            cc.log('a3', a3);
        }
        if (dbg && a4.length > 0) {
            cc.log('a4', a4);
        }
        //cc.log('leftCards', leftCards);

        // 提取对子和剩下的单张
        let a1 = [];
        let a2 = [];
        for (const k in leftCards) {
            let n = leftCards[k];

            if (n===1) {
                a1.push(k);
            } else if (n===2) {
                a2.push([k,k]);
            }
        }

        if (dbg && a2.length > 0) {
            cc.log('a2', a2);
        }
        if (dbg && a1.length > 0) {
            cc.log('a1', a1);
        }

        // 提取完后整合
        let grps = [];
        
        // 单张 3个一组
        for (let idx = 0; idx < a1.length; ) {
            let arr = [];
            for (let i = 0; i < 3; ++i) {
                if (idx >= a1.length) {
                    break;
                }

                arr[i] = a1[idx++];
            }

            grps.push(arr);
        }

        // 一对 2710 3张 4张
        let an = [a2, a3, a4];
        for (let i = 0; i < an.length; ++i) {
            for (let j = 0; j < an[i].length; ++j) {
                grps.push(an[i][j]);
            }
        }

        //cc.log('grps', grps);

        return grps;
    },

    // 将牌换成卡组的形式 方案2
    cards2Grops_2: function (cards) {
        // 从1到10 往右排列 先小后大
        // 大小可以叠就叠在一列

        let dbg = false;

        if (dbg) {
            cc.log(this.dbgstr('牌 => 组'));
        }
        
        let NIfo = this.cardsNumInfo(cards); //数量信息

        let grps = [];

        for (let i = 1; i <= 10; ++i) {
            let c = i;
            let C = i+10;
            let n = NIfo[c];
            let N = NIfo[C];

            let g=[];
            if (n && n>0) {
                for (let j = 0; j < n; ++j) {
                    g.push(c);
                }
            }

            let G=[];
            if (N && N>0) {
                for (let j = 0; j < N; ++j) {
                    G.push(C);
                }
            }

            if (g.length >= 3) {
                grps.push(g);
                if(N>0){
                    grps.push(G);
                }
                continue;
            }

            if(G.length >= 3){
                if (g.length > 0) {
                    grps.push(g);
                }
                grps.push(G);
                continue;
            }

            let gG = g.concat(G);
            if (gG.length > 0) {
                grps.push(gG);
            }
        }

        // 处理超过10组的情况
        if (grps.length > DEF.GRPNUM) {
            cc.log(this.dbgstr('列数过多 ', grps.length));

            let n = grps.length-DEF.GRPNUM;
            let a1 = [];

            while (true) {
                let v = -1;
                for (let i = grps.length-1; i>=0; --i) {
                    const g = grps[i];
                    if (g.length == 1) {
                        v = g[0];
                        grps.splice(i,1);
                        break;
                    }
                }

                if (v < 0) break;

                a1.push(v);

                if (a1.length >= n) break;
            }

            a1.forEach(e => {
                for (let i = grps.length-1; i>=0; --i) {
                    const g = grps[i];
                    if (g.length < 3) {
                        //g.push(e);
                        g.splice(0,0,e);
                        break;
                    }
                }
            });
        }

        return grps;
    },
    // 将牌换成卡组的形式 方案3
    cards2Grops_3: function (cards) {
        // 从1到10 往右排列 先小后大
        // 每列有2张以上的就放入 单张的就放一起 最后4张拼一组

        let NIfo = this.cardsNumInfo(cards); //数量信息
        let grps = [];
        let _1n = [];

        for (let i = 1; i <= 10; ++i) {
            let c = i;
            let C = i+10;
            let n = NIfo[c] || 0;
            let N = NIfo[C] || 0;

            // 单张提取
            let g=[];
            if (n>0) {
                for (let j = 0; j < n; ++j) {
                    g.push(c);
                }
            }
            let G=[];
            if (N>0) {
                for (let j = 0; j < N; ++j) {
                    G.push(C);
                }
            }

            let gG=[];
            if (g.length >= 3) {
                grps.push(g);
                gG = gG.concat(G);
            } else if(G.length >= 3){
                grps.push(G);
                gG = gG.concat(g);
            } else {
                gG = g.concat(G);
            }

            if (gG.length > 0) {
                if (gG.length >= 2) {
                    grps.push(gG);
                } else {
                    _1n = _1n.concat(gG);
                }
            }
        }

        if (_1n.length > 0) {
            let g=[];
            for (let i = 0; i < _1n.length; ++i) {
                g.push(_1n[i]);
                if (g.length>=4 || i==_1n.length-1) {
                    grps.push(g);
                    g=[];
                }
            }
        }

        if (grps.length > DEF.GRPNUM) {
            cc.error('出现BUG  超过最大牌组数  需要添加相应代码！！！');
        }

        return grps;
    },
    /* =================================================================================================================== */

    // 获取胡数信息
    getHuInfo: function (gpr) {
        if (! gpr instanceof Array) {
            cc.error('获取胡数信息的数据错误');
            return null;
        }

        let g = cc.g.clone(gpr);
        g.sort((a,b) => (a-b));

        return this.huInfo[g.join(',')];
    },

    // 分析牌组
    analyseGrop: function (grp) {
        if (!grp) return {};

        let res = {};

        let g = cc.g.clone(grp);

        let L = g.length;

        
        if (L === 1) {
            // 单张
            res.dan = '单';

        } else if (L === 2) {
            // 两张
            if (g[0] === g[1]) {
                res.dui = '对';
            }

        } else if (L === 3) {
            // 三张
            if (g[0]===g[1] && g[0]===g[2]) {
                res.kan = '坎';
            }

        } else if (L === 4) {
            // 四张
            if (g[0]===g[1] && g[0]===g[2] && g[0]===g[3]) {
                res.long = '拢';
            }
        }


        return res;
    },

    // 获取8块数
    getKuaiNum: function (groups) {
        let n = 0;
        groups.forEach(e => {
            if ( (e.length == 4) &&  (e[0]==e[1] && e[0]==e[2] && e[0]==e[3]) ){
                ++n;
            }
        });

        return n;
    },


    // 从卡组中移除卡牌
    removeCardsFromGroups: function (cards, groups) {
        let ci = this.analyseGrop(cards);
        let r34 = ci.kan || ci.long;

        // 移除坎拢
        if (r34) {
            let grps = [];

            groups.forEach(e => {
                if (e.length != cards.length) {
                    grps.push(e);
                    return;
                }

                let ei = this.analyseGrop(e);
                if (!ei.kan && !ei.long) {
                    grps.push(e);
                    return;
                }

                if (e[0] != cards[0]) {
                    grps.push(e);
                }
            });

            return grps;
        }

        let newGrps = groups;

        // 普通移除
        cards.forEach(c => {
            let gidx = -1;
            
            for (let i = 0; i < newGrps.length; ++i) {
                const g = newGrps[i];
                
                let cidx = -1;
                for (let j = 0; j < g.length; ++j) {
                    if (g[j] == c) {
                        gidx = i;
                        cidx = j;
                        break;
                    }
                }

                if (cidx >= 0) {
                    g.splice(cidx, 1);
                    break;
                }
            }

            if (gidx >= 0) {
                if (newGrps[gidx].length < 1) {
                    newGrps.splice(gidx, 1);
                }
            } else {
                cc.error('移除失败 没有在手牌里找到牌 ' + c);
            }
        });

        return newGrps;
    },


    /* =================================================================================================================== */
    // 吃牌
    getChiBai: function(cards, code) {
        let NIfo = this.cardsNumInfo(cards);
        let nn = {};
        for (const key in NIfo) {
            if (NIfo[key] < 3) {
                nn[key] = NIfo[key];
            }
        }
        NIfo = nn;

        //------------------------------------

        this.chiCode = code;

        if (! NIfo[this.chiCode]) {
            NIfo[this.chiCode] = 0;
        }

        let cb = this.analyseChibai(NIfo);

        delete this.chiCode;

        return cb;
    },

    // 吃摆逻辑
    analyseChibai: function (NIfo) {
        // 吃摆完成
        if (NIfo[this.chiCode] < 0) {
            return [];
        }
        
        let res = [];
        let chibai = [];

        // 2710的吃法
        res = res.concat(this.c2710(NIfo));
        // 顺子吃法
        res = res.concat(this.cShun(NIfo));
        // 大小三搭(搭子)吃法
        res = res.concat(this.cDazi(NIfo));

        if (res.length < 1) {
            //cc.log('出现了摆不了的吃摆');
            return null;
        }

        res.forEach(e => {
            let ifo = cc.g.clone(NIfo);
            --ifo[e[0]];
            --ifo[e[1]];
            --ifo[e[2]];

            let cb = this.analyseChibai(ifo);
            if (cb instanceof Array) {
                chibai.push({
                    chi: e,
                    bai: cb,
                })
            }
        });

        return chibai;
    },

    // 2710吃法
    c2710: function(NIfo, code) {
        let r = [];
        let c = code ? code : this.chiCode;
        let d = NIfo;

        let has = d.hasOwnProperty(c);

        // 将吃的牌放入牌组
        if (!has) {
            d[c]=1;
        } else {
            ++d[c];
        }

        // 吃牌为2710中的一种的情况下 检查合法存在的2710
        for (let i = 0; i < 2; ++i) {
            let _2  = 2  + i*10;
            let _7  = 7  + i*10;
            let _10 = 10 + i*10;

            if (c==_2 || c==_7 || c==_10) {

                if (d[_2]>0 && d[_7]>0 && d[_10]>0) {
                    r.push([_2, _7, _10]);
                }

                break;
            }
        }

        // 将吃的牌移除牌组
        if (!has) {
            delete d[c];
        } else {
            --d[c];
        }

        return r;
    },

    // 顺子吃法
    cShun: function(NIfo, code) {
        // 顺子吃法只有3种
        // [n-2, n-1, n] [n-1, n, n+1] [n, n+1, n+2]

        let r = [];
        let c = code ? code : this.chiCode;
        let d = NIfo;

        let m = (c-1)%10 + 1; // [1, 10] 成都弘林机械有限公司  晋原镇兴业大道129号 张风学 13880206997

        if ((m>2) && (d[c-2]>0 && d[c-1]>0)) {
            r.push([c-2, c-1, c]);
        }

        if ((m>1 && m<10) && (d[c-1]>0 && d[c+1]>0)) {
            r.push([c-1, c, c+1]);
        }

        if ((m<9) && (d[c+1]>0 && d[c+2]>0)) {
            r.push([c, c+1, c+2]);
        }

        return r;
    },

    // 大小三搭(搭子)吃法 
    cDazi: function(NIfo, code) {
        // 搭子吃法只有2种
        // 两张大字与一张小字(如捌捌八)或两张小字与一张大字(如十十拾)组成的牌型
        // [n,N,N] [n,n,N]

        let r = [];
        let c = code ? code : this.chiCode;
        let d = NIfo;

        let C = (c>=1 && c<=10) ? (c+10) : (c-10) ;

        if (d[C]>1){
            r.push([c, C, C]);
        }

        if (d[c]>0 && d[C]>0){
            r.push([c, c, C]);
        }

        return r;
    },
    /* =================================================================================================================== */




    /* =================================================================================================================== */
    // 获取打出后可以下叫的牌
    getJiaoCodes:function name(codes, NewRlue, huxi, showGroups) {
        let NIfo = this.cardsNumInfo(codes);

        let jres = {};
        let rept = {};
        for (let i = 0; i < codes.length; ++i) {
            const jc = codes[i];
            
            if (NIfo[jc] >= 3) {
                continue;
            }
            if (NIfo[jc] == 2) {
                if (rept[jc]) {
                    continue;
                }
                rept[jc] = true;
            }

            let checkCodes = cc.g.clone(codes);
            checkCodes.splice(i, 1);

            cc.log('打出', jc);
            let chckv = this.getCanHuCards(checkCodes, NewRlue, huxi,showGroups);
            let hu = [];
            for (const k in chckv) {
                let v = chckv[k];
                let o = {};
                o.code = k;
                o.fan = v[0];
                o.hx = v[1];
                hu.push(o);
            }
            if (hu.length > 0) {
                jres[jc] = hu;
            }
        }

        cc.log('打出后可以下叫的牌', jres);

        return jres;
    },
    // 获取可以胡的牌
    getCanHuCards: function (codes, NewRlue, huxi,showGroups) {
		if (codes.length % 3 == 0 || (Math.ceil(codes.length / 3) + showGroups.length !=7)){
			return {}
		}
        let NIfo = this.cardsNumInfo(codes);
        let acodes = [];
        let kan = [];
        let otherhuxi = huxi;
		let row = 0;
		// 通过叫牌提取胡牌
        let res = {};
        for (const key in NIfo) {
            if (NIfo[key] > 4) {
                continue;
            }
            if (NIfo[key] == 4) {
                let hi=[key,key,key,key];
                let hik = hi.join(',');
                otherhuxi += this.huInfo[hik] ? this.huInfo[hik].h : 0;
                continue;
            }
            if (NIfo[key] == 3) {
                kan.push(parseInt(key));
                let hi=[key,key,key];
                let hik = hi.join(',');
                otherhuxi += this.huInfo[hik] ? this.huInfo[hik].h : 0;
                continue;
            }

            for (let i = 0; i < NIfo[key]; ++i) {
                acodes.push(parseInt(key));
            }
        }

        // ----------------------------
		row = Math.ceil(acodes.length/3)
        this.analyseCanHuLink(acodes);

        cc.log(this.dbgstr('可以胡的牌分析完成'));
        cc.log("结果:",this.result)
        // 检查无胡规则
        let hunum = -1;
        for (let i = 0; i < NewRlue.length; i++) {
            if (NewRlue[i] == 30) {
                hunum = 0;
                break;
            }
        }

       
      
		for (let i = 0; i< Math.ceil(this.result.length/row); i++){
			let handExceptTailHuxi = 0
			let dui = false
			let oneDui = false
			let totalHuxi = 0
			for (let j = i*row; j < (i+1)*row-1; j++) {//计算手上的除最后一组牌的胡息
			
				let hik = this.result[j].join(',');
				if (this.result[j].length == 2)
				{
					oneDui = true
				}				
				
				handExceptTailHuxi += this.huInfo[hik] ? this.huInfo[hik].h : 0; //除了最后一组牌的胡息
			}
			if ((this.result[(i+1)*row-1].length == 2)&&(!oneDui))
			{
				dui = true
			}
			//分析最后一组的牌
			let tail = this.result[(i+1)*row-1]//数组
			let hand = this.result.slice(i*row,(i+1)*row)
			//单调将
			if (tail.length == 1)
			{
				hand[hand.length-1]=[tail[0],tail[0]]
				totalHuxi = handExceptTailHuxi+otherhuxi
				if ((totalHuxi == hunum) || (totalHuxi >= 10)) {
					this.computeFun(hand,showGroups,res,totalHuxi,tail[0])
			
				}
			}
			else //两个的
			{
				let t = tail.slice(0)
				t.sort(function(a, b) {return a - b;})
				if (tail[0] ==tail[1]){//相等
					//交牌
					if (tail[0] <= 10)
					{
						hand[hand.length-1]=[tail[0],tail[1],tail[0]+10]
						totalHuxi = handExceptTailHuxi+otherhuxi
						if ((totalHuxi == hunum) || (totalHuxi >= 10)) {
							this.computeFun(hand,showGroups,res,totalHuxi,tail[0]+10)
						}
					}
					else if (tail[0] > 10)
					{
						hand[hand.length-1]=[tail[0],tail[1],tail[0]-10]
						totalHuxi = handExceptTailHuxi+otherhuxi
						if ((totalHuxi == hunum) || (totalHuxi >= 10)) {
							this.computeFun(hand,showGroups,res,totalHuxi,tail[0]-10)
						}
						
					}
					t.push(t[0])//胡对子
					let hik = t.join(',');
					let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
					hand[hand.length-1]=[tail[0],tail[1],tail[0]]
					totalHuxi = handExceptTailHuxi+otherhuxi+tailHuxi
					if (totalHuxi >= 10) {
						this.computeFun(hand,showGroups,res,totalHuxi,t[0])
					}
					
					
					//胡坎牌
					if (dui)
					{
						for (let i = 0;i<kan.length;i++)
						{
							let hi=[kan[i],kan[i],kan[i],kan[i]];
							let hik = hi.join(',');
							let kanHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0
							hi=[kan[i],kan[i],kan[i]];
							hik = hi.join(',');
							kanHuxi -= this.huInfo[hik] ? this.huInfo[hik].h : 0
							hand.push([kan[i],kan[i],kan[i],kan[i]])
							
							totalHuxi = handExceptTailHuxi+otherhuxi+kanHuxi
							if (totalHuxi >= 10) {
								this.computeFun(hand,showGroups,res,totalHuxi,kan[i])
							}
							
						}
					}
					
				}
				else//不相等
				{
					if (tail[0]%10 == tail[1]%10) //交牌
					{
						
						totalHuxi = handExceptTailHuxi+otherhuxi
				
						if ((totalHuxi == hunum) || (totalHuxi >= 10)) {
							hand[hand.length-1]=[tail[0],tail[1],tail[0]]
							this.computeFun(hand,showGroups,res,totalHuxi,tail[0])
							hand[hand.length-1]=[tail[0],tail[1],tail[1]]
							this.computeFun(hand,showGroups,res,totalHuxi,tail[1])
						}
						
					}
					else if ((t[1]-t[0])==1) 
					{
						if ((t[1]==2)||(t[1]==12)) 
						{ //只能胡３,１３
							t.push(t[1]+1)
							t.sort(function(a, b) {return a - b;})
							let hik = t.join(',');
							let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
							totalHuxi = handExceptTailHuxi+otherhuxi+tailHuxi
							hand[hand.length-1]=[tail[0],tail[1],t[1]+1]
							if (totalHuxi >= 10) {
								this.computeFun(hand,showGroups,res,totalHuxi,t[1]+1)
							}
						
						}
						else if (t[1] == 10 || t[1] == 20) { //只能胡8,18)
							totalHuxi =handExceptTailHuxi+otherhuxi
							hand[hand.length-1]=[tail[0],tail[1],t[0]-1]
							if ((totalHuxi==hunum)||(totalHuxi >= 10)) {
								this.computeFun(hand,showGroups,res,totalHuxi,t[0]-1)
							}
						
						}
						else  //胡两边的
						{
							//大
							t.push(t[1]+1)
							t.sort(function(a, b) {return a - b;})
							let hik = t.join(',');
							let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
							totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
							hand[hand.length-1]=[tail[0],tail[1],t[1]+1]
							if ((totalHuxi==hunum)||(totalHuxi >= 10)) {
								this.computeFun(hand,showGroups,res,totalHuxi,t[1]+1)
							}
							
							//小
							t = tail.slice(0)
							t.sort(function(a, b) {return a - b;})
							t.push(t[0]-1)
							t.sort(function(a, b) {return a - b;})
							hik = t.join(',');
							tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
							totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
							hand[hand.length-1]=[tail[0],tail[1],t[0]]
							if ((totalHuxi==hunum)||(totalHuxi >= 10)) {
								this.computeFun(hand,showGroups,res,totalHuxi,t[0])
							}
							
						}
					}
					else if ((t[1]-t[0]) == 2) //夹
					{
						t.push(t[0]+1)
						t.sort(function(a, b) {return a - b;})
						let hik = t.join(',');
						let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
						totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
						hand[hand.length-1]=[tail[0],tail[1],t[0]+1]
						if ((totalHuxi==hunum)||(totalHuxi >= 10)) {
							this.computeFun(hand,showGroups,res,totalHuxi,t[0]+1)
						}
					
					}
					else if ((t[0] == 2 && t[1] == 7) || (t[0] == 12 && t[1] == 17))
					{
						t.push(t[0]+8)
						t.sort(function(a, b) {return a - b;})
						let hik = t.join(',');
						let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
						totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
						hand[hand.length-1]=[tail[0],tail[1],t[0]+8]
						if (totalHuxi >= 10) {
							this.computeFun(hand,showGroups,res,totalHuxi,t[0]+8)
						}
						
					}
					else if ((t[0] == 2 && t[1] == 10) || (t[0] == 12 && t[1] == 20))
					{
						t.push(t[0]+5)
						t.sort(function(a, b) {return a - b;})
						let hik = t.join(',');
						let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
						totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
						hand[hand.length-1]=[tail[0],tail[1],t[0]+5]
						if (totalHuxi >= 10) {
							this.computeFun(hand,showGroups,res,totalHuxi,t[0]+5)
						}
						
					}
					else if ((t[0] == 7 && t[1] == 10) || (t[0] == 17 && t[1] == 20))
					{
						t.push(t[0]-5)
						t.sort(function(a, b) {return a - b;})
						let hik = t.join(',');
						let tailHuxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; //最后一组牌的胡息
						totalHuxi =handExceptTailHuxi+otherhuxi+tailHuxi
						hand[hand.length-1]=[tail[0],tail[1],t[0]]
						if (totalHuxi >= 10) {
							this.computeFun(hand,showGroups,res,totalHuxi,t[0])
						}
					}
				}
		
			}
		}   
        cc.log(this.result);
		if (res.length!=0){
			cc.log("下角的是：")
			cc.log(res)
		}
        
        //cc.log(this.rescomblink);
        //cc.log(this.midcomblink);
        //cc.log(this.errcomblink);

        return res;//返回的是key:[番数，胡息]
    },
	
	//计算番数，及胡息
	computeFun:function(hand,show,res,huxi,huCard){
		let hongNum = 0
		let guiNum = 0
		let fun = 0
		let kunHu = true
		let cards = []
		cc.log("手牌"+hand)
		cc.log("摆牌"+show)
		hand[hand.length-1].sort(function(a, b) {return a - b;})
		//手牌
		for (let i=0;i<hand.length;i++){
			for (let j =0;j<hand[i].length;j++){
				cards.push(hand[i][j])
			}
		}
		//摆牌
		for (let i=0;i<show.length;i++){
			for (let j =0;j<show[i].length;j++){
				if (show[i].length == 5&&j==0){
					continue
				}
				cards.push(show[i][j])
			}
		}
		cards.sort(function(a, b) {return a - b;})
		cc.log("所有牌"+cards)
		//红胡
		for (let i=0;i<cards.length;i++){
			let v = cards[i]%10;
			if (v==2||v==7&&v==0){
				hongNum++
			}
		}
		if (hongNum>=10){
			fun++
		}
		//黑胡
		for (let i=0;i<cards.length;i++){
			let v = cards[i]%10;
			if (v==2||v==7&&v==0){
				break
			}
			if (i == cards.length - 1){
				fun+=3
			}
		}
		
		//昆胡
		//手牌
		for (let i=0;i<hand.length;i++){
			let hik = hand[i].join(',');
			let huxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; 
			if (huxi == 0){
				kunHu = false
				break
			}
		}
		//摆牌
		for (let i=0;i<show.length;i++){
			let hik = show[i].join(',');
			let huxi = this.huInfo[hik] ? this.huInfo[hik].t : 0; 
			if (!kunHu){
				break
			}
			if (huxi == 0){
				kunHu = false
				break
			}
		} 
		if (kunHu){
			fun++
		}
		//归
		for (let i=0;i<cards.length-3;i++){
			if (cards[i] == cards[i+3]){
				guiNum++
			}
		}
		fun+=guiNum
		if (res[huCard]==null||(res[huCard][0] <fun ||(res[huCard][0]==fun&&res[huCard][1]<huxi))){
			res[huCard] = [fun,huxi]
		}
	},

    // 叫牌链 
    analyseCanHuLink: function (codes) {
        // 合法链 中间||特别链  错误链 出现过的组合
        // 理论上 这几个KV可以合成一个KV
        // 因为本来就是检查新的组合只要有一个组合不在出现过的组合里就行
        // 但是为了分开 所以就还是写成3个
        // 不过下面有这3种链的字符串描述 所以也可以不分开 现在不影响效率 所以暂时还是保留
        this.resLink = [];
        this.errLink = [];
        this.midLink = [];

        // 合法结果
        this.rescomblink = [];
        // 中间 特别结果 
        this.midcomblink = [];
        // 错误结果
        this.errcomblink = [];

      

        this.result = [];
		this.back = [];
        let NIfo = this.cardsNumInfo(codes);
        let collectCards = [];
        for (const key in NIfo) {
			let card = parseInt(key)
            if (NIfo[key] == 2)
            {
                if (card <= 10)
                {
				
                    if (card<9)
                    {
					 pushCollect(collectCards,[card,card+1,card+2],codes,2)
                       
                    }
                    //交牌
					pushCollect(collectCards,[card,card,card+10],codes,1)
                    pushCollect(collectCards,[card,card+10,card+10],codes,1)
                
                }
                else if (card < 19)
                {
					pushCollect(collectCards,[card,card+1,card+2],codes,2)
                  
                }
                pushCollect(collectCards,[card,card],codes,1)
				
				
            }
            else if (NIfo[key]==1)
            {
                if (card <= 10)
                {
                    if (card<9)
                    {
                    
                        pushCollect(collectCards,[card,card+1,card+2],codes,2)
                    }
                    //交牌
					pushCollect(collectCards,[card,card,card+10],codes,1)
                    pushCollect(collectCards,[card,card+10,card+10],codes,1)
                }
                else if (card < 19)
                {
					pushCollect(collectCards,[card,card+1,card+2],codes,1)
                 
                }
            }
        }
		//二七十
		pushCollect(collectCards,[2, 7, 10],codes,2)
		pushCollect(collectCards,[12, 17, 20],codes,2)
        this.analyseCombination(0,collectCards,codes,(Math.floor(codes.length/3+1)));
    },
    // 分析组合
    analyseCombination: function(deep,collectCards,codes,row) {
            if (codes.length <3&&this.back.length == row - 1)
            {
               cc.log("吃的撒飞洒的发生的:", codes.length)
                //单调将
                if (codes.length == 1 )
                { 
                    //allGroupCards(result, &cards, *back, handcards)
                    this.allGroupCards( collectCards, codes);
                   // cc.log("单调将：",codes,this.result)
                } 
                else if (codes.length == 2 )
                { //还剩下两张,有可能是一对,吃牌,绞牌,二七十
                    if ((codes[0] == codes[1])||
                        (codes[0]%10 == codes[1]%10)||
                        (codes[0] > codes[1] && codes[0]-codes[1] == 1&&codes[1] !=10)||
                        (codes[0] < codes[1] && codes[0]-codes[1] == -1&&codes[0] !=10)||
                        (codes[0] > codes[1] && codes[0]-codes[1] == 2&&codes[1] !=9&&codes[1] !=10)||
                        (codes[0] < codes[1] && codes[0]-codes[1] == -2&&codes[0] !=9&&codes[0] !=10)||
                        (codes[0] == 2 && (codes[1] == 7 || codes[1] == 10))||
                        (codes[0] == 7 && (codes[1] == 2 || codes[1] == 10))||
                        (codes[0] == 10 && (codes[1] == 2 || codes[1] == 7))||
                        (codes[0] == 12 && (codes[1] == 17 || codes[1] == 20))||
                        (codes[0] == 17 && (codes[1] == 12 || codes[1] == 20))||
                        (codes[0] == 20 && (codes[1] == 12 || codes[1] == 17)))
                        {
                            //cc.log("胡的牌是:", codes,this.result)
                            //allGroupCards(result, &cards, *back, handcards)
                            this.allGroupCards( collectCards, codes)
							//cc.log("胡的牌是:", codes,this.result)
                        }
        
                }
                return  
            }

            for (let i = deep; i < collectCards.length; i++)
            {
                //在手牌中删除一个组合
				let index = i
                if (!deleteCards(collectCards, codes,index))
                {
                    continue
                }
                this.back.push(i)
                this.analyseCombination(index+1,collectCards,codes,row)
                //将牌返回,回溯
                if ( this.back.length > 0) 
                {
                    for (let j = 0;j<collectCards[this.back[ this.back.length-1]].length;j++)
                    {
                        codes.push(collectCards[this.back[this.back.length-1]][j])
                    }
                    this.back.pop()
                }
        
            }
           
    },
    /* =================================================================================================================== */



    // ===================================================================================================================
    beifen: function () {
        {/*
            if(Object.keys(obj).length==0){

            console.log('空对象');

            }else{

            console.log('非空对象');

            }
        */}

        //2710的提取
        {/*
            // 提取二七十
            let a2710 = [];
            while (true) {
                let lc = leftCards;
                let get = false; 

                for (let i = 0; i < 2; ++i) {
                    if ((lc[2  + i*10]>0) && 
                        (lc[7  + i*10]>0) && 
                        (lc[10 + i*10]>0)) 
                    {
                        a2710.push([2 + i*10, 7 + i*10, 10 + i*10]);

                        --lc[2  + i*10];
                        --lc[7  + i*10];
                        --lc[10 + i*10];

                        get = true;
                        break;
                    }
                }

                if (!get) {
                    break;
                }
            }
            if (a2710.length > 0) {
                cc.log('a2710', a2710);
                cc.log('leftCards2', leftCards);
            }
        */}
        

        {
            /*
            for (let i = 0; i < newGrps.length; ++i) {
                const g = newGrps[i];
                
                if (find) {
                    grps.push(g);
                    continue;
                }

                let ng = [];

                for (let j = 0; j < g.length; ++j) {
                    const gc = g[j];
                
                    if (find || gc!=c) {
                        ng.push(gc);
                        continue;
                    }

                    find = true;
                }

                if (ng.length > 0) {
                    grps.push(ng);
                }
            }

            newGrps = grps;

            if (! find) {
                cc.error('移除失败 没有在手牌里找到牌 ' + c);
            }*/
        }
    },
	allGroupCards:function (collectCards, codes) {
		let cc = codes.slice(0)
		for (let i = 0; i < this.back.length; i++) {
			this.result.push(collectCards[this.back[i]]);
			if (i == this.back.length - 1) {
				this.result.push(cc);
			}
		}
		if (this.back.length == 0) {
			this.result.push(cc);
		}
	},
});



function deleteCards(collectCards, codes,i) {
	if (!inCards(collectCards[i],codes)){
		 return false
	}
	for (let j = 0; j < collectCards[i].length; j++) {
        let index = codes.indexOf(collectCards[i][j]);
        codes.splice(index, 1);
    }
    return true
};

function inCards(src,dst){
	let cards = dst.slice(0)
	for (let j = 0; j < src.length; j++) {
        let index = cards.indexOf(src[j]);
        if (index == -1) {
            return false
        }
		cards.splice(index, 1);
    }
	return true
}

function pushCollect(collectCards,cards,codes,num){
	if (num >= 1)
	{
		if (inCards(cards,codes))
		{
			 collectCards.push(cards)
		}
		else 
		{
			return
		}
	}
	if  (num == 2)
	{
		let c = cards.slice(0)
		c = c.concat(cards)
		if (inCards(c,codes))
		{
			collectCards.push(cards)
		}
	}
}
