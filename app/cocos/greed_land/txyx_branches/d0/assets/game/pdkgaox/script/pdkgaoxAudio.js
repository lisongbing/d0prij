

let dir = 'pdkgaox' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'ddz5_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '跑得快高县音乐'

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

    chupai: function () {
        cc.g.audioMgr.playSFX(mp3('effect_chupai'));
    },

    di: function () {
        cc.g.audioMgr.playSFX(mp3('effect_di'));
    },

    // winlose
    winlose: function (iswin) {
        cc.g.audioMgr.playSFX(mp3(iswin ? 'win' : 'lose'));
    },
    /* =================================================================================================================== */

    tianguan: function (s) {
        cc.g.audioMgr.playSFX(mp3(sex[s] + '_' + 'tianguan'));
    },

    // 牌型
    pai: function (values, type, sex) {
        if (!type) {
            return;
        }
        
        let CT = {
            DAN:11,  //单张
            DUI:21,  //对子
            SHUN:31, //顺子
            LIAND:41,//连对
            SAN:51,  //三同
            FJ:61,   //飞机
            ZD:71,   //炸弹
        };

        // 单牌
        if (type == CT.DAN) {
            cc.g.audioMgr.playSFX(codesType(''+values[0], sex));
            return;
        }

        // 对子
        if (type == CT.DUI) {
            cc.g.audioMgr.playSFX(codesType('d' + values[0], sex));
            return;
        }

        // 三同
        if (type == CT.SAN) {
            cc.g.audioMgr.playSFX(codesType('s' + values[0], sex));
            return;
        }

        // 炸弹
        if (type == CT.ZD) {
            cc.g.audioMgr.playSFX(codesType('si' + values[0], sex));
            return;
        }

        // 其他
        if (!this.tpName) {
            this.tpName = {
                31:['shun','shun',],
                41:['liandui1','liandui2',],
                61:['Plane1','Plane2',],
                71:['bomb1','bomb2',],
            };
        }

        if (this.tpName[type]) {
            cc.g.audioMgr.playSFX(codesType(this.tpName[type][0], sex));
        } else {
            cc.error('提醒！ 没有找到牌型对应的音效', type);
        }
    },
});
