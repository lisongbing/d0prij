window.LoadingMgr = {};

LoadingMgr.Step = {
    //CheckVersion: 1,
    //LoadProto: 2,
    LoadJson: 1,
    LoadScene: 2,
    //LoadMessageBox: 5,
    //LoadWaitingConnection: 6,
    //ConnectServer: 7,
    //Login: 8,
    LoadNotice: 3,
    TexturesPoker: 4,
    TexturesMahjong: 5,
    TexturesHead: 6,
    TexturesPoker2: 7,
    LoadPrompt: 8,
    Done: 9,
};

LoadingMgr.Type = {
    Hall: 0,
    QZNN: 1,
    ZJH: 2,
    BJC: 3,
    MJ: 4,
    MJ3PER: 5,
    MJ2PER: 6,
    SG: 7,
    SG2: 8,
    da2: 9,
    majh: 10,
    pdk: 11,
    ybmj: 12,
    ddz5: 13,
    nymj: 15,
    pdknj: GMID.PDKNJ,
    pdkls: GMID.PDKLS,
    pdkty: GMID.PDKTY,
    pdkgx: GMID.PDKGX,
    pdkgaox: GMID.PDKGAOX,
    pdklc: GMID.PDKLC,
    njmj: GMID.NJMJ,
    lzmj: GMID.LZMJ,
    yjmj: GMID.YJMJ,
    lcmj: GMID.LCMJ,
    gxmj: GMID.GXMJ,
    xzmjer: GMID.XZMJER,
    eqs: GMID.EQS,
};

let _s = {};
_s[LoadingMgr.Type.Hall] = 'hall';
_s[LoadingMgr.Type.QZNN] = 'qznn';
_s[LoadingMgr.Type.ZJH] = 'zjh';
_s[LoadingMgr.Type.BJC] = 'bjc';
_s[LoadingMgr.Type.MJ] = 'xzmj';
_s[LoadingMgr.Type.xzmjer] = 'xzmjer';
_s[LoadingMgr.Type.MJ3PER] = 'mj';
_s[LoadingMgr.Type.MJ2PER] = 'mj';
_s[LoadingMgr.Type.SG] = 'sg';
_s[LoadingMgr.Type.SG2] = 'sg';
_s[LoadingMgr.Type.da2] = 'daer';
_s[LoadingMgr.Type.majh] = 'majh';
_s[LoadingMgr.Type.pdk] = 'pdk';
_s[LoadingMgr.Type.ybmj] = 'ybmj';
_s[LoadingMgr.Type.ddz5] = 'ddz5';
_s[LoadingMgr.Type.nymj] = 'nymj';
_s[LoadingMgr.Type.pdknj] = 'pdknj';
_s[LoadingMgr.Type.pdkls] = 'pdkls';
_s[LoadingMgr.Type.pdkty] = 'pdkty';
_s[LoadingMgr.Type.pdkgx] = 'pdkgx';
_s[LoadingMgr.Type.pdkgaox] = 'pdkgaox';
_s[LoadingMgr.Type.pdklc] = 'pdklc';
_s[LoadingMgr.Type.lzmj] = 'lzmj';
_s[LoadingMgr.Type.njmj] = 'njmj';
_s[LoadingMgr.Type.lcmj] = 'lcmj';
_s[LoadingMgr.Type.yjmj] = 'yjmj';
_s[LoadingMgr.Type.gxmj] = 'gxmj';
_s[LoadingMgr.Type.eqs] = 'eqs';
LoadingMgr.GameScene = _s;



LoadingMgr.TypeStep = {};
/*LoadingMgr.TypeStep[LoadingMgr.Type.Start] = [
    LoadingMgr.Step.LoadMessageBox,
    LoadingMgr.Step.CheckVersion,
    LoadingMgr.Step.LoadWaitingConnection,
    LoadingMgr.Step.LoadProto,
    //LoadingMgr.Step.ConnectServer,
    LoadingMgr.Step.Done,
];*/
LoadingMgr.TypeStep[LoadingMgr.Type.Hall] = [
    //LoadingMgr.Step.CheckVersion,
    //LoadingMgr.Step.LoadProto,
    LoadingMgr.Step.LoadNotice,
    LoadingMgr.Step.LoadJson,
    LoadingMgr.Step.LoadPrompt,
    LoadingMgr.Step.TexturesHead,
    LoadingMgr.Step.LoadScene,
    //LoadingMgr.Step.LoadMessageBox,
    //LoadingMgr.Step.LoadWaitingConnection,
    //LoadingMgr.Step.ConnectServer,
    //LoadingMgr.Step.Login,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.SG] = [
    LoadingMgr.Step.TexturesPoker,
    LoadingMgr.Step.TexturesPoker2,
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.da2] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.majh] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdk] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.MJ] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.xzmjer] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.ybmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.ddz5] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.nymj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.lzmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

LoadingMgr.TypeStep[LoadingMgr.Type.pdknj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdkls] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdkty] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdkgx] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdkgaox] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.pdklc] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.njmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.lcmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.yjmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.gxmj] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];
LoadingMgr.TypeStep[LoadingMgr.Type.eqs] = [
    LoadingMgr.Step.LoadScene,
    LoadingMgr.Step.Done,
];

cc.Class({
    extends: cc.Component,
    properties: {
        loadingType: 0,
        curStep: 0,
        curStepEnd: false,
        progress: cc.Label,
        curProgress: 1,
        loadSceneTotalProgress: 0,
        curLoadSceneProgress: 0,
    },

    startLoading: function (loadingType) {
        this.loadingType = loadingType;
        this.curStepEnd = true;
        //this.progress = progress;
        this.curStep = 0;
        this.curProgress = 1;
        this.curLoadSceneProgress = 0;
        //计算加载场景的总进度
        this.loadSceneTotalProgress = (100 - LoadingMgr.TypeStep[this.loadingType].length);
        this.start = true;
    },

    loadStep: function () {
        if (this.progress != null) {
            //this.progress.string = '正在加载：' + parseInt(this.curProgress + this.curLoadSceneProgress) + '%';
            this.progress(parseInt(this.curProgress + this.curLoadSceneProgress));
            //cc.log(this.progress.string + ', curProgress = ' + this.curProgress + ', curLoadSceneProgress' + this.curLoadSceneProgress);
        }
        if (this.curStepEnd) {
            var self = this;
            this.curStepEnd = false;
            let typeStep = LoadingMgr.TypeStep[this.loadingType][this.curStep];
            this.curStep++;
            switch (typeStep) {
                /*case LoadingMgr.Step.CheckVersion:
                    cc.log('Check Version.');
                    if (!cc.sys.isNative || true) {
                        self.curStepEnd = true;
                        self.curProgress++;
                    }
                    else {
                        cc.g.hotUpdateMgr.checkVersion(() => {
                            self.curStepEnd = true;
                            self.curProgress++;
                        });
                    }
                    break;
                case  LoadingMgr.Step.LoadProto:
                    cc.log('load proto.');
                    pbHelper.loadFile('resources/proto', 'protocol');
                    self.curProgress++;
                    self.curStepEnd = true;
                    break;
                case  LoadingMgr.Step.ConnectServer:
                    cc.log('connect server.');
                    cc.g.networkMgr.init();
                    cc.g.networkMgr.addOnceHandler('connected', () => {
                        self.curProgress++;
                        self.curStepEnd = true;
                        cc.g.global.init();
                    });
                    break;*/
                case LoadingMgr.Step.LoadNotice:
                    cc.g.utils.notices = null;
                    if(GameConfig.useGameConfigBak) {
                        let noticeConfigUrl = GameConfig.gameConfigBakUrl;
                        if(cc.sys.os === cc.sys.OS_ANDROID) {
                            noticeConfigUrl += 'android/'
                        }
                        else if(cc.sys.os === cc.sys.OS_IOS) {
                            noticeConfigUrl += 'ios/'
                        }
                        cc.g.http.sendRequest('GET', noticeConfigUrl + 'notice.json', {n: (new Date()).valueOf()}, function (notice) {
                            cc.g.utils.notices = notice;
                            self.curStepEnd = true;
                        }, function () {
                            self.curStepEnd = true;
                        });
                    }
                    else {
                        let data;
                        if(cc.sys.os === cc.sys.OS_ANDROID) {
                            data = {state: 2, type: 1};
                        }
                        else if(cc.sys.os === cc.sys.OS_IOS) {
                            data = {state: 2, type: 2};
                        }
                        else {
                            data = {};
                        }

                        /*
                        cc.g.http.sendRequest('GET', GameConfig.gameConfigUrl + 'service-admin/agentDetail/getNotice', data, function (notice) {
                            cc.g.utils.notices = notice;
                            if(cc.sys.os === cc.sys.OS_IOS) {//Fix公告在ios中显示错乱的问题
                                if(cc.g.utils.notices != null && cc.g.utils.notices.data != null && cc.g.utils.notices.data.length > 0) {
                                    cc.g.utils.notices.data[0].content = cc.g.utils.notices.data[0].content.replace(/\r\n/g, '\n');
                                }
                            }
                            self.curStepEnd = true;
                        }, function () {
                            self.curStepEnd = true;
                        });
                        //*/

                        self.curStepEnd = true;
                    }
                    break;
                case LoadingMgr.Step.LoadJson:
                    cc.resources.loadDir('config', function (err, objects, urls) {
                        cc.g.jsonData = {};
                        //for (var i = 0; i < urls.length; i++) {
                        //    cc.g.jsonData[urls[i].split('/')[1]] = objects[i];
                        //}
                        for (var i = 0; i < objects.length; i++) {
                            cc.g.jsonData[objects[i]._name] = objects[i];
                        }

                        self.curProgress++;
                        self.curStepEnd = true;
                    });
                    break;
                case LoadingMgr.Step.TexturesHead:
                    cc.log('load head textures.');
                    cc.resources.loadDir('textures/head', cc.SpriteFrame, function (err, assets) {
                        if (err) {
                            cc.log("load head textures error.");
                            return false;
                        }
                        self.curProgress++;
                        self.curStepEnd = true;
                    });
                    break;
                case  LoadingMgr.Step.LoadScene:
                    cc.log('load scene.');
                    
                    // cc.loader.onProgress = function (completedCount, totalCount, item) {
                    //     //cc.log('completedCount:' + completedCount + ', totalCount:' + totalCount);
                    //     //cc.log(completedCount + ',' +totalCount);
                    //     if (totalCount != 1) {
                    //         self.curLoadSceneProgress = self.loadSceneTotalProgress * completedCount / totalCount;
                    //     }
                    // };
                    let onProgress = function (completedCount, totalCount, item) {
                        //cc.log('completedCount:' + completedCount + ', totalCount:' + totalCount);
                        //cc.log(completedCount + ',' +totalCount);
                        if (totalCount != 1) {
                            self.curLoadSceneProgress = self.loadSceneTotalProgress * completedCount / totalCount;
                        }
                    };
                    cc.director.preloadScene(LoadingMgr.GameScene[this.loadingType], onProgress, (error) => {
                        //cc.loader.onProgress = function () {};
                        self.curProgress += self.curLoadSceneProgress;
                        self.curLoadSceneProgress = 0;
                        self.curStepEnd = true;
                    });
                    break;
                case LoadingMgr.Step.LoadPrompt:
                    cc.log('load LoadPrompt.');
                    self.curProgress++;
                    self.curStepEnd = true;
                    break;
                    /*
                    case LoadingMgr.Step.LoadWaitingConnection:
                        cc.log('load waiting connection.');
                        cc.loader.loadRes('prefabs/waiting_connection', (err, prefab_load) => {
                            if (err) {
                                cc.log("load waiting_connection error.");
                                return false;
                            }
                            self.curProgress++;
                            self.curStepEnd = true;
                            cc.g.global.waitingConnectionPrefab = prefab_load;
                        });
                        break;
                    case  LoadingMgr.Step.Login:
                        cc.log('user login.');
                        cc.g.userMgr.init();
                        cc.g.userMgr.login(() => {
                            self.curProgress++;
                            self.curStepEnd = true;
                        });
                    break;
                    */
                case  LoadingMgr.Step.TexturesPoker:
                    cc.log('load poker textures.');
                    // cc.loader.loadResDir('textures/poker', cc.SpriteFrame, function (err, assets) {
                    //     if (err) {
                    //         cc.log("load poker textures error.");
                    //         return false;
                    //     }
                    //     self.curProgress++;
                    //     self.curStepEnd = true;
                    // });
                    self.curProgress++;
                    self.curStepEnd = true;
                    break;
                case LoadingMgr.Step.TexturesPoker2:
                    cc.log('load poker textures2');
                    // cc.loader.loadResDir('textures/poker2', cc.SpriteFrame, function (err, assets) {
                    //     if (err) {
                    //         cc.log("load poker textures error.");
                    //         return false;
                    //     }
                    //     self.curProgress++;
                    //     self.curStepEnd = true;
                    // });
                    self.curProgress++;
                    self.curStepEnd = true;
                    break;
                case LoadingMgr.Step.TexturesMahjong:
                    cc.log('load mahjong textures.');
                    // cc.loader.loadResDir('textures/mj', cc.SpriteFrame, function (err, assets) {
                    //     if (err) {
                    //         cc.log("load mj textures error.");
                    //         return false;
                    //     }
                    //     self.curProgress++;
                    //     self.curStepEnd = true;
                    // });
                    self.curProgress++;
                    self.curStepEnd = true;
                    break;
                case  LoadingMgr.Step.Done:
                    cc.log('load done.');
                    self.curProgress = 100;
                    //if(this.loadingType !== LoadingMgr.Type.Start) {
                        cc.director.loadScene(LoadingMgr.GameScene[this.loadingType]);
                    //}
                    break;
            }
        }

    },

    releaseRes: function (loadingType) {
        //for (let i = 0; i < LoadingMgr.TypeStep[loadingType].length; i++) {  
            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesPoker) {
            //     cc.log('release poker textures.');
            //     cc.g.utils.releaseResDir('textures/poker', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/poker', cc.Texture2D);
            // }
            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesPoker2) {
            //     cc.log('release poker2 textures.');
            //     cc.g.utils.releaseResDir('textures/poker2', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/poker2', cc.Texture2D);
            // }
            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesMahjong) {
            //     cc.log('release mj textures.');
            //     cc.g.utils.releaseResDir('textures/mj', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/mj', cc.Texture2D);
            // }

            //cc.loader.releaseResDir('sounds/' + LoadingMgr.GameScene[loadingType], cc.AudioClip);
            //cc.loader.releaseAll();
            //cc.resources.release('sounds/' + LoadingMgr.GameScene[loadingType]);
        //}

        let lt = LoadingMgr.Type;
        let ltv = loadingType;

        let td = LoadingMgr.GameScene[ltv];
        if (ltv==lt.da2) {
            td = 'daer';
        } else if (ltv==lt.eqs) {
            td = 'eqs';
        } else if (ltv==lt.ddz5) {
            td = 'ddz5';
        } else if (ltv==lt.pdk || ltv==lt.pdknj || ltv==lt.pdkls) {
            td = 'pdk';
        } else {
            td = 'hzmj';
        }

        cc.g.utils.releaseResDir('sounds/' + td);

        cc.director.loadScene(LoadingMgr.GameScene[LoadingMgr.Type.Hall]);
    },
    releaseResTwo: function (loadingType) {
        //for (let i = 0; i < LoadingMgr.TypeStep[loadingType].length; i++) {

            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesPoker) {
            //     cc.log('release poker textures.');
            //     cc.g.utils.releaseResDir('textures/poker', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/poker', cc.Texture2D);
            // }
            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesPoker2) {
            //     cc.log('release poker2 textures.');
            //     cc.g.utils.releaseResDir('textures/poker2', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/poker2', cc.Texture2D);
            // }
            // if (LoadingMgr.TypeStep[loadingType][i] == LoadingMgr.Step.TexturesMahjong) {
            //     cc.log('release mj textures.');
            //     cc.g.utils.releaseResDir('textures/mj', cc.SpriteFrame);
            //     cc.g.utils.releaseResDir('textures/mj', cc.Texture2D);
            // }

            //cc.loader.releaseResDir('sounds/' + LoadingMgr.GameScene[loadingType], cc.AudioClip);
            //cc.loader.releaseAll();
            //cc.resources.release('sounds/' + LoadingMgr.GameScene[loadingType]);
        //}

        let lt = LoadingMgr.Type;
        let ltv = loadingType;

        let td = LoadingMgr.GameScene[ltv];
        if (ltv==lt.da2) {
            td = 'daer';
        } else if (ltv==lt.eqs) {
            td = 'eqs';
        } else if (ltv==lt.ddz5) {
            td = 'ddz5';
        } else if (ltv==lt.pdk || ltv==lt.pdknj || ltv==lt.pdkls) {
            td = 'pdk';
        } else {
            td = 'hzmj';
        }

        cc.g.utils.releaseResDir('sounds/' + td);
    },
    goToHall: function () {
        cc.director.loadScene(LoadingMgr.GameScene[LoadingMgr.Type.Hall]);
    }
});

