cc.Class({
    extends: cc.Component,

    properties: {
        storagePath: '',
        remoteVersion: '',
        callback: null,
        retryTime: 0,
    },

    checkVersion: function (remoteVersion, callback) {
        this.callback = callback;

        this.storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'greedland-remote-asset');
        this.stobakPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'g-r-a-bak');

        {
            if (!jsb.fileUtils.isDirectoryExist(this.stobakPath)) {
                cc.log('没有manifest备份文件夹 尝试创建');
                let cres = jsb.fileUtils.createDirectory(this.stobakPath);
                cc.log(cres ? '创建成功':'创建失败');
            } else {
                cc.log('存在manifest备份文件夹');
            }
        }

        let remoteBuildVersion = remoteVersion.substr(0, remoteVersion.lastIndexOf("."));
        let rbv = remoteBuildVersion.split('.'); //parseInt(remoteBuildVersion.replace('.', ''));
        let cbv = cc.sys.curBuildVersion.split('.'); //parseInt(cc.sys.curBuildVersion.replace('.', ''));
        if (parseInt(cbv[0]) > parseInt(rbv[0]) || (parseInt(cbv[0]) === parseInt(rbv[0]) && parseInt(cbv[1]) > parseInt(rbv[1]))) {
            //如果本地版本大于服务器版本跳过（仅仅用于测试） 
            if (this.callback != null) {
                this.callback();
            }
            return;
        } else if ( parseInt(cbv[0]) < parseInt(rbv[0]) || (parseInt(cbv[0]) === parseInt(rbv[0]) && parseInt(cbv[1]) < parseInt(rbv[1]))) {
            //如果当前版本小于服务器版本，提示用户下载新版本
            // cc.g.global.showMsgBox(MsgBoxType.NewRelease, '提示', '有新版本, 前往下载!', () => {
            //     cc.sys.openURL(GameConfig.downloadUrl);
            // });
            
            cc.log('有新版本, 前往下载!');
            
            if (this.callback != null) {
                this.callback();
            }

            return;
        }
        
        //当前版本等于服务器版本
        let localVersion = cc.sys.localStorage.getItem('currentVersion');
        if (localVersion != null) {
            let localBuildVersion = localVersion.substr(0, localVersion.lastIndexOf("."));
            //如果本地存档版本不等于服务器版本，说明进行整包更新，需要清除之前的热更新文件。
            if (localBuildVersion != remoteBuildVersion) {
                cc.sys.localStorage.removeItem('HotUpdateSearchPaths');
                jsb.fileUtils.removeDirectory(this.storagePath);
                cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
                localVersion = GameConfig.gameVersion;
            }
        } else {
            cc.sys.localStorage.setItem('currentVersion', GameConfig.gameVersion);
            localVersion = GameConfig.gameVersion;
        }

        let localVersNums = localVersion.split('.');
        let remoteVersNums = remoteVersion.split('.');
        //如果末尾版本号发送变化提示热更新
        if (parseInt(remoteVersNums[2]) > parseInt(localVersNums[2])) {
            this.remoteVersion = remoteVersion;
            this.localVersion = localVersion;
            this.checkManifestFile();
            this.startHotUpdate();
        } else {
            if (this.callback != null) {
                this.callback();
            }
        }
    },

    checkManifestFile: function () {
        cc.log('检查manifest文件');
        
        if (!jsb.fileUtils) {
            cc.log('没有 jsb.fileUtils');
            return;
        }

        let mfpath = this.storagePath + '/project.manifest';
        cc.log('manifest 目标路径 ', mfpath);
        let mfbakpath = this.stobakPath + '/project.manifest';
        cc.log('manifest 备份目标路径 ', mfbakpath);

        if (jsb.fileUtils.isFileExist(mfbakpath)) {
            cc.log('有 manifest 备份文件 上次热更新没有正常结束 使用备份文件');

            if (jsb.fileUtils.isFileExist(mfpath)) {
                cc.log('发现上一次的 manifest 文件， 需要删除');
                let rres = jsb.fileUtils.removeFile(mfpath);
                cc.log(rres ? '删除成功':'删除失败');
            }

            let str = jsb.fileUtils.getStringFromFile(mfbakpath);
            jsb.fileUtils.writeStringToFile(str, mfpath);
            cc.log('调用 writeStringToFile 完成， 检查下文件是否存在');

            if (jsb.fileUtils.isFileExist(mfpath)) {
                cc.log('manifest 备份文件移动成功');
            } else {
                cc.error('manifest 备份文件移动失败, 后续热更新依然可以进行，但是应该会基于原始整包更新内容');
            }

            return;
        }

        cc.log('没有 manifest 备份文件');
        
        let mfp = mfpath;
        if (jsb.fileUtils.isFileExist(mfpath)) {
            cc.log('有 manifest 文件，上次热更新极大可能是正常结束了，对其进行备份');
        } else {
            cc.log('没有 manifest 文件, 很有可能是第一次更新，正式和备份文件都没有');
            cc.log('此时将原始包的 manifest 作为备份文件');

            mfp = cc.urlraw('project.manifest');

            cc.log('原始包的 manifest ', mfp);
        }

        let bakstr = jsb.fileUtils.getStringFromFile(mfp);
        jsb.fileUtils.writeStringToFile(bakstr, mfbakpath);
        cc.log('调用 writeStringToFile 完成， 检查下文件是否存在');

        if (jsb.fileUtils.isFileExist(mfbakpath)) {
            cc.log('manifest 备份成功');
        } else {
            cc.error('manifest 备份失败');
        }
    },

    upEndCheckMF: function (ifo) {
        cc.log('热梗结束 检查manifest文件', ifo);

        let mfpath = this.storagePath + '/project.manifest';
        let mfbakpath = this.stobakPath + '/project.manifest';

        if (jsb.fileUtils.isFileExist(mfpath)) {
            cc.log('有 manifest 文件 ', mfpath);
        } else {
            cc.log('没有 manifest 文件 ', mfpath);
        }

        if (jsb.fileUtils.isFileExist(mfbakpath)) {
            cc.log('有 manifest 备份文件 ', mfbakpath);
        } else {
            cc.log('没有 manifest 备份文件 ', mfbakpath);
        }

        if (ifo == 'updateSuccess') {
            cc.log('正常结束 删除 manifest 备份文件');

            jsb.fileUtils.removeFile(mfbakpath);
            if (jsb.fileUtils.isFileExist(mfbakpath)) {
                cc.log('删除失败');
            } else {
                cc.log('删除成功');
            }
        } else {
            cc.log('异常结束 删除 manifest 文件');

            jsb.fileUtils.removeFile(mfpath);
            if (jsb.fileUtils.isFileExist(mfpath)) {
                cc.log('删除失败');
            } else {
                cc.log('删除成功');
            } 
        }
    },

    startHotUpdate: function () {
        let versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            let vA = versionA.split('.');
            let vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || 0);
                if (a == b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        };

        this.assetManager = new jsb.AssetsManager('', this.storagePath, versionCompareHandle);
        // if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        //     this.assetManager.retain();
        // }

        this.nodeJsBufferTool = require('buffer').Buffer;
        this.crypto = require('crypto');

        var self = this;
        this.assetManager.setVerifyCallback(function (path, asset) {
            let compressed = asset.compressed;
            //var expectedMD5 = asset.md5;
            //var relativePath = asset.path;
            //var size = asset.size;
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            if (compressed) {
                return true;
            } else {
                var filePath = self.storagePath + '_temp/' + asset.path;
                if (!jsb.fileUtils.isFileExist(filePath)) {
                    cc.log("file doesn't exist", asset.path);
                    return false;
                }
                var dataBinary = jsb.fileUtils.getDataFromFile(filePath);
                var strData = self.nodeJsBufferTool.from(dataBinary);
                var md5Code = self.crypto.createHash('md5').update(strData).digest('hex');
                if (md5Code !== asset.md5) {
                    cc.log("md5 doesn't --- ", asset.path);
                    cc.log("md5Code --- ", md5Code);
                    cc.log("asset.md5 --- ", asset.md5);
                    return false;
                }
                return true;
            }
        });

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.assetManager.setMaxConcurrentTask(2);
        }

        let localManifest = null;
        if (this.assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
            if (jsb.fileUtils.isFileExist(this.storagePath + '/project.manifest')) {
                 localManifest = jsb.fileUtils.getStringFromFile(this.storagePath + '/project.manifest');
            } else {
                 localManifest = jsb.fileUtils.getStringFromFile(cc.urlraw('project.manifest'));
            }

            let localManifestJson = JSON.parse(localManifest);
            localManifestJson.packageUrl = GameConfig.hotUpdateUrl + this.remoteVersion + '/';
            localManifestJson.remoteManifestUrl = GameConfig.hotUpdateUrl + this.remoteVersion + '/project.manifest';
            localManifestJson.remoteVersionUrl = GameConfig.hotUpdateUrl + this.remoteVersion + '/version.manifest';

            if (jsb.fileUtils.isFileExist(this.storagePath + '/project.manifest')) {
                let removecachedManifest = jsb.fileUtils.removeFile(this.storagePath + '/project.manifest');
                cc.log('removecachedManifest', removecachedManifest);
            }

            let manifest = new jsb.Manifest(JSON.stringify(localManifestJson), this.storagePath);
            this.assetManager.loadLocalManifest(manifest, this.storagePath);
            this.manifestUrl = manifest;
        }
        if (!this.assetManager.getLocalManifest() || !this.assetManager.getLocalManifest().isLoaded()) {
            cc.log('加载本地清单文件失败');
            cc.g.global.showTipBox('加载本地清单文件失败!');
            return;
        }

        this.assetManager.setEventCallback(this.checkCb.bind(this));
        // this.checkListener = new jsb.EventListenerAssetsManager(this.assetManager, this.checkCb.bind(this));
        // cc.eventManager.addListener(this.checkListener, 1);
        this.assetManager.checkUpdate();
    },


    checkCb: function (event) {
        let code = event.getEventCode();
        cc.log('checkCb code: ' + code);

        let isup = false;

        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("没有本地的清单文件发现");
                cc.g.global.showTipBox('没有本地的检测清单文件发现!');
                this.upEndCheckMF('checkCb ERROR_NO_LOCAL_MANIFEST 没有本地的检测清单文件发现');
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("下载清单文件失败.");
                cc.g.global.showTipBox('下载检测清单文件失败!');
                this.upEndCheckMF('checkCb ERROR_DOWNLOAD_MANIFEST 下载检测清单文件失败');
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("已经更新了最新版本.");
                //cc.sys.localStorage.setItem('currentVersion', this.remoteVersion);
                this.upEndCheckMF('checkCb ALREADY_UP_TO_DATE 已经更新了最新版本');
                if (this.callback != null) {
                    this.callback();
                }
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log("检测到更新，即将更新.");
                this.hotUpdate();
                isup = true;
                break;
            default:
                return;
        }

        if (!isup) {
            this.assetManager.setEventCallback(null);
        }
        
        //cc.eventManager.removeListener(this.checkListener);
        //this.checkListener = null;
    },

    hotUpdate: function () {
        this.assetManager.setEventCallback(this.updateCb.bind(this));

        // this.updateListener = new jsb.EventListenerAssetsManager(this.assetManager, this.updateCb.bind(this));
        // cc.eventManager.addListener(this.updateListener, 1);

        if (this.assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this.assetManager.loadLocalManifest(this.manifestUrl, this.storagePath);
        }
        this.assetManager.update();
    },

    updateCb: function (event) {
        let updateSuccess = false;
        let updateFailed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("没有本地的清单文件发现");
                cc.g.global.showTipBox('没有本地下载的清单文件发现!'); 
                this.upEndCheckMF('updateCb ERROR_NO_LOCAL_MANIFEST 没有本地下载的清单文件发现');
                updateFailed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                //cc.log(event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                if (event.getTotalBytes() > 0) {
                    if (this.hotUpdateCb) {
                        let o = {};
                        o.cur = event.getDownloadedBytes();
                        o.total = event.getTotalBytes();
                        this.hotUpdateCb('UPDATE_PROGRESSION', o);
                    }
                }
                var msg = event.getMessage();
                if (msg) {
                    cc.log('Updated file: ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("下载更新清单文件失败.");
                cc.g.global.showTipBox('下载更新清单文件失败!');
                this.upEndCheckMF('updateCb ERROR_DOWNLOAD_MANIFEST 下载更新清单文件失败');
                updateFailed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("已经更新了最新版本.");
                this.upEndCheckMF('updateCb ALREADY_UP_TO_DATE 已经更新了最新版本');
                updateFailed = true;
                cc.sys.localStorage.setItem('currentVersion', this.remoteVersion);
                if (this.callback != null) {
                    this.callback();
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('下载完成 ' + event.getMessage());

                if (event.getTotalBytes() > 0) {
                    if (this.hotUpdateCb) {
                        let o = {};
                        o.cur = event.getTotalBytes();
                        o.total = event.getTotalBytes();
                        this.hotUpdateCb('UPDATE_PROGRESSION', o);
                    }
                }

                updateSuccess = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('下载失败 ' + event.getAssetId() + ', ' + event.getMessage());
                //可以重试！
                this.retryTime++;
                if (this.retryTime > 10) {
                    cc.g.global.showTipBox('下载资源失败! ' + event.getAssetId() + ', ' + event.getMessage(), ()=>{
                        this.scheduleOnce(()=>{
                            cc.game.end();
                        }, 0.16);
                    }, true);
                    this.upEndCheckMF('this.retryTime > 10');
                    updateFailed = true;
                } else {
                    cc.log('重试下载失败资源 '+event.getAssetId()+' 总重试次数 '+this.retryTime);
                    this.retry();
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('资源下载错误: ' + event.getAssetId() + ', ' + event.getMessage());
                //cc.g.global.showTipBox('资源下载错误: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                cc.g.global.showTipBox('资源解压错误!' + event.getMessage());
                break;
            default:
                break;
        }

        if (updateFailed) {
            this.assetManager.setEventCallback(null);
            //this.updateListener = null;
        }

        if (updateSuccess) {
            this.assetManager.setEventCallback(null);
            //this.updateListener = null;
            
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this.assetManager.getLocalManifest().getSearchPaths();
            
            cc.log('newPaths', newPaths);

            cc.sys.localStorage.setItem('currentVersion', this.remoteVersion);
            // This value will be retrieved and appended to the default search path during game startup, 
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            if(searchPaths.length === 0 || newPaths != searchPaths[0]) {
                Array.prototype.unshift(searchPaths, newPaths);
            }
            if(searchPaths.length > 1 && searchPaths[0] == searchPaths[1]) {
                searchPaths.shift();
            }
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.log('searchPaths', searchPaths);

            this.upEndCheckMF('updateSuccess');

            if (this.hotUpdateCb) {
                this.hotUpdateCb('UPDATE_FINISHED');
            }
        }
    },

    retry: function () {
        this.assetManager.downloadFailedAssets();
    }
});
