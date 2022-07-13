

let dir = 'mjyb' + '/';

let sex = ['', 'nan', 'nv'];

let mp3 = name => dir + name + '.mp3';

{/*
通用	洗牌音效	sound_xipai
通用	发牌音效	sound_fapai
通用	通用拢、招、碰、吃时，摆牌的音效	sound_baipai
*/}
let sound = name => mp3('mj_' + name);

{/*
    男性	操作语音：拢	ctrl_long_nan
    男性	操作语音：招	ctrl_zhao_nan
    男性	操作语音：碰	ctrl_peng_nan
    男性	操作语音：我吃	ctrl_chi_nan
    男性	操作语音：嘿嘿嘿，一不小心就胡了	ctrl_hu_nan
    
    女性	操作语音：拢	ctrl_long_nv
    女性	操作语音：招	ctrl_zhao_nv
    女性	操作语音：碰	ctrl_peng_nv
    女性	操作语音：我吃	ctrl_chi_nv
    女性	操作语音：见好就收，胡	ctrl_hu_nv
*/}
let operate = (name, s) => mp3('ctrl_' + name +'_' + sex[s]);

{/*
男性	出牌语音：一	chupai_nan_1 - chupai_nan_20
女性	出牌语音：一	chupai_nv_1  - chupai_nv_20
*/}
let card = (code, s) => mp3('mj_' + sex[s]  + '_' + code);

/* =================================================================================================================== */

cc.Class({
    // dbgstr
    dbgstr: function (info) {
        let s = '大二音乐'

        if (info) {
            return s + ' :: ' + info;    
        }

        return s + ' ';
    },

    //
    init: function (pGame) {
        // cc.dlog(this.dbgstr('init'));

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
        cc.g.audioMgr.playBGM(mp3('mj_bg'));
    },

    // 游戏背景音乐 爆
    bgmBao: function () {
        if (!cc.g.audioMgr.isBGMOn) {
            return;
        }
        
        if (this.curBGM == '2'){
            return;
        }

        this.curBGM = '2';
        cc.g.audioMgr.playBGM(mp3('bg_baopai'));
    },

    //
    stop: function () {
        this.curBGM = '';
    },


    /* =================================================================================================================== */
    // 股子
    saizi: function () {
        cc.g.audioMgr.playSFX(sound('saizi'));
    },
    
    // 发牌
    faPai: function () {
        cc.g.audioMgr.playSFX(sound('fapai'));
    },
    // 出牌
    chupai: function () {
        cc.g.audioMgr.playSFX(sound('chupai'));
    },
    // 点牌
    dianpai: function () {
        cc.g.audioMgr.playSFX(sound('dianpai'));
    },

    // 摆牌
    moPai: function () {
        cc.g.audioMgr.playSFX(sound('mopai'));
    },
    // 倒计时
    daoJiShi: function () {
        cc.g.audioMgr.playSFX(sound('single'));
    },

    // 玩家操作
    opt: function (opt, sex) {
        if (! cc.g.audioMgr.isSFXOn) {
            return;
        }

        if (sex!=1 && sex!=2) {
            cc.error('无法识别的性别  默认使用小姐姐音效');
            sex = 0;
        }

        cc.g.audioMgr.playSFX(operate(opt, sex));
    },

    // 牌
    pai: function (code, sex) {
        if (! cc.g.audioMgr.isSFXOn) {
            return;
        }
        
        if (sex!=1 && sex!=2) {
            cc.error('无法识别的性别  默认使用小姐姐音效');
            sex = 1;
        }

        cc.g.audioMgr.playSFX(card(code, sex));
    },

});
