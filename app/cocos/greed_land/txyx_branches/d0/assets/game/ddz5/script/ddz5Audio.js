
let DEF = require('ddz5Def');

let dir = 'ddz5' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'ddz5_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '斗地主5人音乐'

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    init: function (pGame) {
        cc.log(this.dbgstr('init'));

        this.gm = pGame;
        this.curBGM = '';
    },


    /* =================================================================================================================== */
    // 游戏背景音乐
    bgmGame: function () {
        if (!cc.g.audioMgr.isBGMOn) {
            return;
        }

        if (this.curBGM == '1'){
            return;
        }

        this.curBGM = '1';
        cc.g.audioMgr.playBGM(mp3('bg'));
    },

    //
    stop: function () {
        this.curBGM = '';
    },

    play: function (name, s) {
        cc.g.audioMgr.playSFX(mp3(sex[s] + '_' + name));
    },
    
    /* =================================================================================================================== */
    // 发牌
    faPai: function () {
        cc.g.audioMgr.playSFX(mp3('fapai'));
    },


    feiji: function () {
        cc.g.audioMgr.playSFX(mp3('effect_plane'));
    },

    boom: function () {
        cc.g.audioMgr.playSFX(mp3('effect_bomb'));
    },

    wangzha: function () {
        cc.g.audioMgr.playSFX(mp3('effect_wangzha'));
    },

    tw8tou: function () {
        cc.g.audioMgr.playSFX(mp3('effect_8tz'));
    },

    liandui: function () {
        cc.g.audioMgr.playSFX(mp3('effect_liandui'));
    },

    di: function () {
        cc.g.audioMgr.playSFX(mp3('effect_di'));
    },

    // winlose
    winlose: function (iswin) {
        cc.g.audioMgr.playSFX(mp3(iswin ? 'win' : 'lose'));
    },
    /* =================================================================================================================== */
    // 牌型
    pai: function (values, type, sex) {
        if (!type) {
            return;
        }
        // 单牌
        if (type == DEF.ComType.DAN) {
            cc.g.audioMgr.playSFX(codesType(''+values[0], sex));
            return;
        }

        // 对子
        if (type == DEF.ComType.DUI) {
            cc.g.audioMgr.playSFX(codesType('d' + values[0], sex));
            return;
        }

        // 三同
        if (type == DEF.ComType.SAN) {
            cc.g.audioMgr.playSFX(codesType('s' + values[0], sex));
            return;
        }
        
        // 其他
        if (!this.tpName) {
            let o={};
            o[DEF.ComType.SHUN]  = 'shun';
            o[DEF.ComType.LIAND] = 'liandui1';
            o[DEF.ComType.SAN1]  = 'three1';
            o[DEF.ComType.FJ]    = 'Plane1';
            o[DEF.ComType.FJCB]  = 'Plane2';
            o[DEF.ComType.ZD]    = 'bomb1';
            o[DEF.ComType.ZDW]   = 'wangzha';
            o[DEF.ComType.ZD8]   = '8tou';
            o[DEF.ComType.ZDTW]  = '4wang';
            this.tpName = o;
        }

        if (this.tpName[type]) {
            cc.g.audioMgr.playSFX(codesType(this.tpName[type], sex));
        } else {
            cc.error('没有找到牌型对应的音效', type);
        }
    },
});
