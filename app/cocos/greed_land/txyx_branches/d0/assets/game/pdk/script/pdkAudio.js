

let dir = 'pdk' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + 'pdk_' + name + '.mp3';

let codesType = (name, s) => mp3(sex[s] + '_' + name);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '跑得快音乐'

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

    di: function () {
        cc.g.audioMgr.playSFX('ddz5/ddz5_effect_di.mp3');
    },

    // winlose
    winlose: function (iswin) {
        cc.g.audioMgr.playSFX(mp3(iswin ? 'win' : 'lose'));
    },
    /* =================================================================================================================== */
    // 牌型
    pai: function (values, type, sex) {
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

        /*
        出牌语音：连对	pdk_nan_liandui
        出牌语音：顺子	pdk_nan_shun
        出牌语音：三带	pdk_nan_three
        出牌语音：飞机	pdk_nan_Plane
        出牌语音：炸弹	pdk_nan_bomb
        */

        if (!type) {
            return;
        }
        // 单牌
        if (type == 1) {
            cc.g.audioMgr.playSFX(codesType(''+values[0], sex));
            return;
        }

        // 对子
        if (type == 2) {
            cc.g.audioMgr.playSFX(codesType('d' + values[0], sex));
            return;
        }

        // 其他
        if (!this.tpName) {
            this.tpName = {
                3:['shun','shun',],
                4:['liandui','liandui',],
                5:['three','smallb',],
                6:['three','smallb',],
                7:['three','smallb',],
                8:['Plane','Plane',],
                9:['Plane','Plane',],
                10:['Plane','Plane',],
                11:['bomb','bomb',],
            };
        }

        if (this.tpName[type]) {
            cc.g.audioMgr.playSFX(codesType(this.tpName[type][this.gm.ori], sex));
        } else {
            cc.error('没有找到牌型对应的音效', type);
        }
    },
});
