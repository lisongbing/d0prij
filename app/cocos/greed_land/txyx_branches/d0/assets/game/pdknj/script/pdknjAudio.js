

let dir = 'pdknj' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'pdk_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '跑得快内江音乐'

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
        cc.g.audioMgr.playSFX(mp3(sex[s] + '_' + 'tg'));
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
            LIAND:4,    //连对
            SAN:5,  //三同
            SAN1:6,  //三带一
            SAN2:7, //三带二
            SAND:8, //三带一对
            FJ:9,   //飞机
            FJCB:10,  //飞机带翅膀
            SID2:11,    //四带二
            SID3:12,    //四带三
            ZD:13,  //炸弹
            AAA:14, //三A炸
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
            cc.g.audioMgr.playSFX(codesType('san' + values[0], sex));
            return;
        }

        // 炸弹
        if (type == CT.ZD) {
            cc.g.audioMgr.playSFX(codesType('si' + values[0], sex));
            return;
        }

        // Def.ComType = {
        //     DAN:1,  //单张
        //     DUI:2,  //对子
        //     SHUN:3, //顺子
        //     LIAND:4,    //连对
        //     SAN:5,  //三同
        //     SAN1:6,  //三带一
        //     SAN2:7, //三带二
        //     SAND:8, //三带一对
        //     FJ:9,   //飞机
        //     FJ1X:10,  //飞机带翅膀
        //     FJ2X:11,  //飞机带翅膀
        //     FJDD:12,  //飞机带翅膀
        //     SID2:13,    //四带二
        //     SID3:14,    //四带三
        //     ZD:15,  //炸弹
        //     AAA:16, //三A炸
        
        //     AAA2:17, //三A带二
        //     AAA3:18, //三A带三
        // };

        // 其他
        if (!this.tpName) {
            this.tpName = {
                3:['shun','shun',],
                4:['liandui','liandui',],
                6:['3d1','3d1',],
                7:['3d2','3d2',],
                8:['3d2','3d2',],
                9:['Plane','Plane',],
                10:['Plane','Plane',],
                11:['Plane','Plane',],
                12:['Plane','Plane',],
                13:['4d2','4d2',],
                14:['4d3','4d3',],
                15:['bomb','bomb',],
                16:['bomb','bomb',],
                17:['4d2','4d2',],
                18:['4d3','4d3',],
            };
        }

        if (this.tpName[type]) {
            cc.g.audioMgr.playSFX(codesType(this.tpName[type][0], sex));
        } else {
            cc.error('提醒！ 没有找到牌型对应的音效', type);
        }
    },
});
