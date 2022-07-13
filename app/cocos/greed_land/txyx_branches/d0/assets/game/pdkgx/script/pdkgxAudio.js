

let dir = 'pdkgx' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'ddz5_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '珙县跑得快音乐'

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
            DAN:1,  //单张
            DUI:2,  //对子
            SHUN:3, //顺子
            LIAND:4,//连对
            SAN:5,  //三同
            SAN2:6, //三带二
            FJ:7,   //飞机
            FJCB:8,  //飞机带翅膀
            SID3:9,  //四带三
            ZD:10,  //炸弹
            AAA:11, //三A炸
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

        // 
        if (type == CT.ZD) {
            cc.g.audioMgr.playSFX(codesType('si' + values[0], sex));
            return;
        }

        // 其他
        if (!this.tpName) {
            this.tpName = {
                3:['shun','shun',],
                4:['liandui1','liandui2',],
                5:['three1','three1',],
                6:['three2','three2',],
                7:['Plane1','Plane2',],
                8:['Plane1','Plane2',],
                9:['4d3','4d3',],
                //9:['bomb1','bomb2',],
                10:['bomb1','bomb2',],
                11:['bomb1','bomb2',],
            };
        }

        if (this.tpName[type]) {
            cc.g.audioMgr.playSFX(codesType(this.tpName[type][0], sex));
        } else {
            cc.warn('提醒！ 没有找到牌型对应的音效', type);
        }
    },
});
