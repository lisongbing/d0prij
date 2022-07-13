/* 创建房间特殊规则 */

/* ====================================================================================================== */
let _cItm = {};

let _hideCI = ()=>{
    for (const key in _cItm) {
        _cItm[key] && (_cItm[key].active = false);
    }
};

let _showCI = (CI)=>{
    CI.forEach(e => {
        _cItm[e] && (_cItm[e].active = true);
    });
};

let _checkCI = (itmes, idxs)=>{
    let itm = itmes[idxs[0]];

    for (let i = 0; i < idxs.length; ++i) {
        if (itmes[idxs[i]].toggle.isChecked) {
            itm = null;
            break;
        }
    }
    if (itm) {
        itm.toggle.check();
    }
};

/* ====================================================================================================== */
let D2 = {};
D2.radio = function () {
    /*
    0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    3: cc_Node {_name: "加底", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    4: cc_Node {_name: "封顶", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    5: cc_Node {_name: "自摸", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    6: cc_Node {_name: "放炮", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    7: cc_Node {_name: "定庄", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */

    let ren = _renshu.uK;
    
    let jiadi = _rGrps[3];
 
    if (_cr.curArea==2 || _cr.curArea==4) {
        if (ren==4){
            jiadi.items[1].toggle.check();
            for (const k in jiadi.items) {
                if (k!=1) {
                    jiadi.items[k].active = false;
                }
            }
        } else {
            for (const k in jiadi.items) {
                jiadi.items[k].active = true;
            }
        }
    }

    D2.check(1);
}
D2.check = function (args) {
    let _r = _renshu.uK;; // 人数

    // 非2人局不显示“吃对家”选项(37)
    let _c = _cItm = {};
    for(let i=0; i<_cItems.length; i++) {
        let itm = _cItems[i];
        if (itm.uK=='37') {
            _c['cdj'] = itm;//下雨
            break;
        }
    }

    _c['cdj'].active = (_r==2);
}
/* ====================================================================================================== */


/* ====================================================================================================== */
let EQS = {};
EQS.radio = function () {
    let ren = _renshu.uK;
    
    let paishu = _rGrps[4];
    let fengd = _rGrps[5];
    let xj = _rGrps[6];
    let tpfd = _rGrps[7];

    xj.active = (ren==4 && paishu.items[16].toggle.isChecked);
    tpfd.active = paishu.items[15].toggle.isChecked || xj.active;

    fengd.items[94].active = (paishu.items[15].active && paishu.items[15].toggle.isChecked);

    if (_cr.curArea==11) {
        //15,14张| 16,20张|
        if (ren==4) {
            paishu.items[15].active = false;
            if (!paishu.items[16].toggle.isChecked) {
                paishu.items[16].toggle.check();
            }
        } else {
            paishu.items[15].active = true;
        }

        // 5,10个| 6,不封顶| 17,100胡| 18,300胡| 22,8个| 23,8个| 
        if (paishu.items[15].toggle.isChecked) {
            cc.log('14张');
            fengd.items[5].active = fengd.items[6].active = false;
            fengd.items[22].active = fengd.items[23].active = false;
            fengd.items[17].active = fengd.items[18].active = true;

            _checkCI(fengd.items, [17, 18]);
        } else {
            cc.log('20张');
            if (ren==2 || ren==3) {
                fengd.items[5].active = fengd.items[6].active = true;
                fengd.items[22].active = fengd.items[23].active = false;
                fengd.items[17].active = fengd.items[18].active = false;

                _checkCI(fengd.items, [5, 6]);
            } else if (ren==4) {
                fengd.items[5].active = false;
                fengd.items[6].active = fengd.items[22].active = fengd.items[23].active = true;
                fengd.items[17].active = fengd.items[18].active = false;
                fengd.items[6].toggle.check();

                _checkCI(fengd.items, [6, 22, 23]);
            }
        }
    }

    if (_cr.curArea==16 || _cr.curArea==17) {
        //15,14张| 16,20张|
        if (ren==3 || ren==4) {
            paishu.items[15].active = false;
            if (!paishu.items[16].toggle.isChecked) {
                paishu.items[16].toggle.check();
            }
        } else {
            paishu.items[15].active = true;
        }

        // 5,10个| 6,不封顶| 17,100胡| 18,300胡| 22,8个| 23,8个|
        if (ren==2) {
            if (paishu.items[15].toggle.isChecked) {
                fengd.items[5].active = fengd.items[6].active = false;
                fengd.items[22].active = fengd.items[23].active = false;
                fengd.items[17].active = fengd.items[18].active = true;

                _checkCI(fengd.items, [17, 18]);
            } else if (paishu.items[16].toggle.isChecked) {
                fengd.items[5].active = fengd.items[6].active = true;
                fengd.items[22].active = fengd.items[23].active = false;
                fengd.items[17].active = fengd.items[18].active = false;
                fengd.items[5].toggle.check();

                _checkCI(fengd.items, [5, 6]);
            }
        } else if (ren==3) {
            fengd.items[5].active = fengd.items[6].active = true;
            fengd.items[22].active = fengd.items[23].active = false;
            fengd.items[17].active = fengd.items[18].active = false;
            
            _checkCI(fengd.items, [5, 6]);
        } else if (ren==4) {
            fengd.items[5].active = false;
            fengd.items[6].active = fengd.items[22].active = fengd.items[23].active = true;
            fengd.items[17].active = fengd.items[18].active = false;
            
            _checkCI(fengd.items, [6, 22, 23]);
        }
    }

    if (_cr.curArea==18) {
        //15,14张| 16,20张|
        if (ren==3) {
            paishu.items[15].active = false;
            if (!paishu.items[16].toggle.isChecked) {
                paishu.items[16].toggle.check();
            }
        } else {
            paishu.items[15].active = true;
        }

        // 5,10个| 6,不封顶| 17,100胡| 18,300胡| 22,8个| 23,8个|
        if (paishu.items[15].toggle.isChecked) {
            cc.log('14张');
            if (ren==2 || ren==4) {
                fengd.items[6].active = fengd.items[5].active = false;
                fengd.items[22].active = fengd.items[23].active = false;
                fengd.items[17].active = fengd.items[18].active = true;
                
                _checkCI(fengd.items, [17, 18]);
            }
        } else {
            cc.log('20张');
            if (ren==2 || ren==3) {
                fengd.items[6].active = fengd.items[5].active = false;
                fengd.items[22].active = fengd.items[23].active = true;
                fengd.items[17].active = fengd.items[18].active = false;
                
                _checkCI(fengd.items, [22, 23]);
            } else if (ren==4) {
                fengd.items[5].active = false;
                fengd.items[6].active = fengd.items[22].active = fengd.items[23].active = true;
                fengd.items[17].active = fengd.items[18].active = false;
                
                _checkCI(fengd.items, [6, 22, 23]);
            }
        }
    }

    EQS.check({ren:ren,  pai:paishu.items[16].toggle.isChecked ? 20:14});
}
EQS.check = function (args) {
    if (!args) {
        let paishu = _rGrps[4];
        args = {ren:_renshu.uK, pai:paishu.items[16].toggle.isChecked ? 20:14};
    }

    let _r = args.ren; // 人数
    let _p = args.pai; // 牌数

    let _c = _cItm = {};
    for(let i=0; i<_cItems.length; i++) {
        let itm = _cItems[i];
        if (itm.uK=='12') _c['xiayu'] = itm;//下雨
        else if (itm.uK=='13') _c['bayu'] = itm;//巴雨加胡
        else if (itm.uK=='14') _c['dqbzf'] = itm;//打圈半自付
        else if (itm.uK=='19') _c['dahu'] = itm;//大胡
        else if (itm.uK=='20') _c['stai'] = itm;//上台
        else if (itm.uK=='21') _c['gunfan'] = itm;//滚番
        else if (itm.uK=='27') _c['xjzmjh'] = itm;//小家自摸加番
    }

    _hideCI();

    if (_cr.curArea==11) {
        _showCI(['dqbzf']);
    }
    
    if (_r==2 && _p==14) _showCI(['dqbzf', 'dahu', 'stai', 'gunfan']);

    if (_cr.curArea==11) {
        _showCI(['xiayu', 'bayu']);
        if (_r==3 && _p==14) _showCI(['gunfan', 'dqbzf', 'dahu', 'stai']);
        else if (_r==2 && _p==20) _showCI(['gunfan']);
        else if (_r==4 && _p==20) _showCI(['dqbzf', 'xjzmjh']);
    } else if (_cr.curArea==16) {
        _showCI(['xiayu', 'bayu']);
        if (_r==2 && _p==20) _showCI(['gunfan', 'dahu', 'stai']);
        else if (_r==3 && _p==20) _showCI(['dahu', 'stai']);
        else if (_r==4 && _p==20) _showCI(['dqbzf', 'xjzmjh']);
    } else if (_cr.curArea==17) {
        _showCI(['xiayu', 'bayu']);
        if (_r==3 && _p==20) _showCI(['dahu', 'stai']);
        else if (_r==2 && _p==20) _showCI(['dahu', 'stai']);
        else if (_r==4 && _p==20) _showCI(['dqbzf', 'xjzmjh']);
    } else if (_cr.curArea==18) {
        if (_r==3 && _p==20) _showCI(['dqbzf', 'gunfan']);
        else if (_r==2 && _p==20) _showCI(['dqbzf', 'gunfan']);
        else if (_r==4 && _p==14) _showCI(['dahu', 'stai']);
        else if (_r==4 && _p==20) _showCI(['xiayu', 'bayu', 'dqbzf', 'xjzmjh']);
    } 

    if (_c['bayu'] && _c['xiayu']) {
        _c['bayu'].active = _c['xiayu'].getComponent(cc.Toggle).isChecked;
    }
}
/* ====================================================================================================== */




/* ====================================================================================================== */
let PDK = {};
PDK.radio = function () {
    /*
        0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        3: cc_Node {_name: "底分", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        4: cc_Node {_name: "鬼牌", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        5: cc_Node {_name: "炸弹算分", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        6: cc_Node {_name: "加入", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        7: cc_Node {_name: "超时托管", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        8: cc_Node {_name: "托管局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: false, …}
    */

    //  (_cr.curArea!=1 && _cr.curArea!=3);
    _cr.Node_baseSco.active = (_cr.curArea!=1);

    let t2x = null;
    for(let i=0; i<_cItems.length; i++){
        let item = _cItems[i];
        if (item.uK == '23') {
            t2x = item;
        }
    }

    if (t2x) {
        t2x.active = (_rGrps[4].uK == '7');
    }
}
PDK.check = function (args) {
}
/* ====================================================================================================== */


/* ====================================================================================================== */
let PDKLS = {};
PDKLS.radio = function () {
    /*
        0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        3: cc_Node {_name: "先出", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        4: cc_Node {_name: "炸弹", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        5: cc_Node {_name: "炸弹分数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        6: cc_Node {_name: "炸弹分数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        7: cc_Node {_name: "飞机", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        8: cc_Node {_name: "牌型", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        9: cc_Node {_name: "玩法", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        10: cc_Node {_name: "名堂分", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */

    let ren = _renshu.uK;

    let xianchu = _rGrps[3];

    let zd = _rGrps[4];
    let zdfs1 = _rGrps[5];
    let zdfs2 = _rGrps[6];

    xianchu.active = (ren!=2);

    zdfs1.active = (zd.uK==3);
    zdfs2.active = (zd.uK==4);

    PDKLS.check({zhadan:zd.uK,});
}
PDKLS.check = function (args) {
    if (!args) {
        let zd = _rGrps[4];
        args = {zhadan:zd.uK,};
    }

    let _c = _cItm = {};
    for(let i=0; i<_cItems.length; i++) {
        let itm = _cItems[i];

        if (itm.uK=='24') _c['5555'] = itm;//
        else if (itm.uK=='25') _c['AAAA'] = itm;//
        else if (itm.uK=='26') _c['46k'] = itm;//
    }

    _hideCI();

    if (args.zhadan == 5) {
        _showCI(['5555', 'AAAA', '46k']);
    }
}
/* ====================================================================================================== */


/* ====================================================================================================== */
let PDKNJ = {};
PDKNJ.radio = function () {
    /*
        0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        3: cc_Node {_name: "超时托管", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        4: cc_Node {_name: "托管局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */

    // pdknj 2 3人 规则
    
    let ren = _renshu.uK;

    let ks = [2,3,4,5];
    for(let i=0; i<_cItems.length; i++){
        let item = _cItems[i];
        for(let j=0; j<ks.length; ++j){
            if (ks[j] == item.uK) {
                item.active = (ren == 2);
                break;
            }
        }

        if (item.uK == '1') {
            item.getComponent(cc.Toggle).interactable = true;
            if (ren == 3) {
                item.getComponent(cc.Toggle).check();
            }
            item.getComponent(cc.Toggle).interactable = (ren == 2);
        }
    }
}
PDKNJ.check = function (args) {
}
/* ====================================================================================================== */


/* ====================================================================================================== */
let PDKTY = {};
PDKTY.radio = function () {
    /*
        0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        3: cc_Node {_name: "红10", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        4: cc_Node {_name: "牌数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        5: cc_Node {_name: "玩法", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        6: cc_Node {_name: "打鸟", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        7: cc_Node {_name: "飘分", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        8: cc_Node {_name: "超时托管", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        9: cc_Node {_name: "托管局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */

    // 10,不打鸟|11,10分|12,20分|13,50分
    // 14,不飘分|15,每局飘1|16,每局飘2|17,飘123|18,飘235|19,飘258|
    
    let ren = _renshu.uK;
    _cItems[0].active = (ren!=2);

    let dn = _rGrps[6];
    let pf = _rGrps[7];

    //有打鸟
    if (dn.uK!=10) {
        [15,16,17,18,19].forEach(i => pf.items[i].active = false);
    } else {
        [15,16,17,18,19].forEach(i => pf.items[i].active = true);
    }

    //有飘分
    if (pf.uK!=14) {
        [11,12,13].forEach(i => dn.items[i].active = false);
    } else {
        [11,12,13].forEach(i => dn.items[i].active = true);
    }

    PDKTY.check();
}
PDKTY.check = function (args) {
    /*
        0: cc_Node {_name: "首局必出黑桃3", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        1: cc_Node {_name: "无炸弹", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        2: cc_Node {_name: "三张飞机可少带出完", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        3: cc_Node {_name: "炸弹不可拆", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        4: cc_Node {_name: "3A算炸弹", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        5: cc_Node {_name: "3K算炸弹", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        6: cc_Node {_name: "3A最大", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        7: cc_Node {_name: "3K最大", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        8: cc_Node {_name: "开启IP", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        9: cc_Node {_name: "开启定位", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        10: cc_Node {_name: "≤100m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        11: cc_Node {_name: "≤300m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
        12: cc_Node {_name: "≤500m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */

    [3, 4, 5, 6, 7].forEach(i => _cItems[i].active = false);

    let nozd = _cItems[1].getComponent(cc.Toggle).isChecked;
    if (nozd) return;

    _cItems[3].active = true;

    let pai = _rGrps[4].uK; //牌数

    //5,16张|6,15张|    16-3A  15-3K
    if (pai == 5) {
        _cItems[4].active = true;
        _cItems[6].active = _cItems[4].getComponent(cc.Toggle).isChecked;
    } else if (pai == 6) {
        _cItems[5].active = true;
        _cItems[7].active = _cItems[5].getComponent(cc.Toggle).isChecked;
    }
}
/* ====================================================================================================== */




/* ====================================================================================================== */
let PDKGX = {};
PDKGX.radio = function () {
    /*
    0: cc_Node {_name: "房费", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    1: cc_Node {_name: "人数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    2: cc_Node {_name: "局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    3: cc_Node {_name: "规则", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    4: cc_Node {_name: "3A带2", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    5: cc_Node {_name: "超时托管", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    6: cc_Node {_name: "托管局数", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */
}
PDKGX.check = function (args) {
    /*
    0: cc_Node {_name: "炸弹叠加", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    1: cc_Node {_name: "不洗牌", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    2: cc_Node {_name: "开启IP", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    3: cc_Node {_name: "开启定位", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    4: cc_Node {_name: "≤100m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    5: cc_Node {_name: "≤300m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    6: cc_Node {_name: "≤500m", _objFlags: 0, _parent: cc_Node, _children: Array(3), _active: true, …}
    */
}
/* ====================================================================================================== */

/* ====================================================================================================== */
let PDKGAOX = {};
PDKGAOX.radio = function () {

}
PDKGAOX.check = function (args) {

}
/* ====================================================================================================== */



let _cr = null;

let _gm = null;

let _rGrps = null;
let _cItems = null;

let _renshu = null;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    // },

    // update (dt) {},

    // ======================================================================================================

    //
    init (cr) {
        cc.log('创建房间 特殊规则');

        _cr = cr; //创建房间界面
        _gm = {}; //游戏对应的规则处理对象

        this.initRuleObj();
    },
    initRuleObj () {
        // window.GMID = {
        //     XZMJ: 4,
        //     D2: 9,
        //     HZMJ: 10,
        //     PDK: 11,
        //     DDZ5: 13,
        //     YBMJ: 12,
        //     NYMJ: 15,
        //     PDKNJ: 16,
        //     LZMJ: 19,
        //     NJMJ: 18,
        //     YJMJ: 20,
        //     EQS:21,
        //     PDKLS:22,
        // }

        _gm[GMID.EQS] = EQS;
        _gm[GMID.D2] = D2;
        _gm[GMID.PDK] = PDK;
        _gm[GMID.PDKNJ] = PDKNJ;
        _gm[GMID.PDKLS] = PDKLS;
        _gm[GMID.PDKTY] = PDKTY;
        _gm[GMID.PDKGX] = PDKGX;
        _gm[GMID.PDKGAOX] = PDKGAOX;
    },


    //
    up (id, isRadio) {
        let ro = _gm[id]; //RuleObj

        if (!ro) {
            cc.log(`特殊规则 ${isRadio ? 'radio' : 'check'} 找不到对应游戏 _gm[id]`, id);
            //return;
        }

        _rGrps = _cr.radioGrps;
        _cItems = _cr.checkItems;

        this.findComitem();

        if (isRadio) {
            this.comRadio();
            ro && ro.radio();
        } else {
            this.comCheck();
            ro && ro.check();
        }
    },

    // 通用选项
    findComitem () {
        _renshu = _rGrps[1];
    },

    // 通用单选
    comRadio () {
        let TAG = _cr.gmtag[_cr.curGameId];

        let cstg = null;
        let tgjs = null;
        let tgcs = null;
        for (let i = 0; i < _rGrps.length; ++i) {
            let g = _rGrps[i];

            if (g.name == TAG[11]) {
                cstg = g;
            } else if (g.name == TAG[12]) {
                tgjs = g;
            } else if (g.name == TAG[20]) {
                tgcs = g;
            }
        }

        if (tgjs) {
            tgcs.active = tgjs.active = cstg.uK!=64; //64,不托管|
        }
    },

    // 通用复选
    comCheck () {
        if (!_cr.curCheckArg) return;

        let evt = _cr.curCheckArg.evt;
        let item = _cr.curCheckArg.item;

        if (!item) return;

        cc.log('item.uK', item.uK);

        // 定位要打开距离设置 60 61 62
        if (item.uK == 36) {
            let juli = [];
            let cur = null;

            for(let i=0; i<_cItems.length; i++){
                let itm = _cItems[i];
                if (itm.uK=='60' || itm.uK=='61' || itm.uK=='62') {
                    juli.push(itm);

                    if (itm.getComponent(cc.Toggle).isChecked) {
                        cur = itm;
                    }
                }
            }

            if (evt.isChecked) {
                juli.forEach(e => {
                    e.active = !cur || cur.uK==e.uK;
                });
            } else {
                juli.forEach(e => {
                    e.active = false;
                });  
            }
        }

        if (item.uK=='60' || item.uK=='61' || item.uK=='62') {
            let juli = [];
            for(let i=0; i<_cItems.length; i++){
                let itm = _cItems[i];
                if (itm.uK=='60' || itm.uK=='61' || itm.uK=='62') {
                    juli.push(itm);
                }
            }

            if (evt.isChecked) {
                juli.forEach(e => {
                    if (e.uK != item.uK && e.getComponent(cc.Toggle).isChecked) {
                        e.getComponent(cc.Toggle).uncheck();
                    }
                    e.active = false
                });
                item.active = true;
            } else {
                juli.forEach(e => e.active = true);
            }
        }
    },
});
