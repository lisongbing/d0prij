cc.Class({
    extends: cc.Component,
    properties: {
        isBGMOn: true,
        isSFXOn: true,
        isGVoiceOn: true,
        bgmPaused: false,
        bgmAudioID: -1,
    },

    init: function () {
        let vol = cc.sys.localStorage.getItem('isBGMOn');
        if (vol != null) {
            this.isBGMOn = (parseInt(vol) == 1 ? true : false);
        }

        vol = cc.sys.localStorage.getItem('isSFXOn');
        if (vol != null) {
            this.isSFXOn = (parseInt(vol) == 1 ? true : false);
        }

        vol = cc.sys.localStorage.getItem('isGVoiceOn');
        if(vol != null) {
            this.isGVoiceOn = (parseInt(vol) == 1 ? true : false);
            cc.g.voiceMgr.setOpen(this.isGVoiceOn);
        }
    },

    getUrl: function (url) {
        url = "sounds/" + url;

        var extname = cc.path.extname(url);
        if (extname) {
            url = url.slice(0, - extname.length);
        }

        return url;
    },

    playBGM: function (url, audioClip) {
        if (!this.isBGMOn) {
            return;
        }
        let audioUrl = '';
        if (!audioClip) {
            audioUrl = this.getUrl(url);
        }
        else {
            audioUrl = url;
        }
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }

        cc.resources.load(audioUrl, cc.AudioClip,  (err, asset) => {
            cc.log('playMusic: ' + audioUrl + " ("+ asset+")");
            // this.bgmAudioID = cc.audioEngine.playMusic(asset, true);
            this.bgmAudioID = cc.audioEngine.play(asset, true, 1);
        });
    },

    playSFX: function (url, audioClip, cb) {
        if (!this.isSFXOn) {
            return;
        }
        let audioUrl = '';
        if (!audioClip) {
            audioUrl = this.getUrl(url);
        }
        else {
            audioUrl = url;
        }
        
        cc.resources.load(audioUrl, cc.AudioClip,  (err, asset)=> {
            cc.log('playEffect: ' + audioUrl + " ("+ asset+")");
            let effid = cc.audioEngine.playEffect(asset, false);
            cb && cb(effid);
        });
    },

    stopSFX: function (audioId) {
        cc.audioEngine.stop(audioId);
    },
    stopBGM: function () {
        if (this.bgmAudioID>=0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
    },

    setSFXOn: function (b) {
        if (this.isSFXOn != b) {
            cc.sys.localStorage.setItem('isSFXOn', b == true ? 1 : 0);
            this.isSFXOn = b;
        }
    },

    setBGMOn: function (b) {
        if (this.isBGMOn != b) {
            if (this.bgmAudioID >= 0 && !b) {
                cc.audioEngine.stop(this.bgmAudioID);
                this.bgmAudioID = -1;
            }
            cc.sys.localStorage.setItem('isBGMOn', b == true ? 1 : 0);
            this.isBGMOn = b;
        }
    },

    setGVoiceOn: function (b) {
        if(this.isGVoiceOn != b) {
            cc.sys.localStorage.setItem('isGVoiceOn', b == true ? 1 : 0);
            this.isGVoiceOn = b;
            if(cc.sys.isNative && cc.g.voiceMgr) {
                cc.g.voiceMgr.setOpen(b);
            }
        }
    },

    pauseBGM: function () {
        if (this.bgmPaused || !this.isBGMOn || this.bgmAudioID === -1) {
            return;
        }
        cc.audioEngine.pause(this.bgmAudioID);
        this.bgmPaused = true;
    },

    resumeBGM: function () {
        if(!this.bgmPaused) {
            return;
        }
        if(!this.isBGMOn) {
            if(this.bgmAudioID >= 0) {
                cc.audioEngine.stop(this.bgmAudioID);
                this.bgmAudioID = -1;
            }
        }
        else {
            cc.audioEngine.resume(this.bgmAudioID);
        }
        this.bgmPaused = false;
    },

    // 设置背景音乐音量（0.0 ~ 1.0）
    setBGMVolume: function (v) {

        if (v <= 0) v = 0.0 ;
        if (v >= 1) v = 1.0 ;

        cc.audioEngine.setMusicVolume(v);
    },

    // 设置音效音量（0.0 ~ 1.0）
    setSFXVolume: function (v) {

        if (v <= 0) v = 0.0 ;
        if (v >= 1) v = 1.0 ;

        cc.audioEngine.setEffectsVolume(v);
    },
});
