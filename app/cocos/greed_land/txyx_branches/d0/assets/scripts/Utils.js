/*
    方法签名
    方法签名稍微有一点复杂，最简单的方法签名是()V，它表示一个没有参数没有返回值的方法。其他一些例子：

    (I)V表示参数为一个int，没有返回值的方法
    (I)I表示参数为一个int，返回值为int的方法
    (IF)Z表示参数为一个int和一个float，返回值为boolean的方法
    现在有一些理解了吧，括号内的符号表示参数类型，括号后面的符号表示返回值类型。
    因为Java是允许函数重载的，可以有多个方法名相同但是参数返回值不同的方法，方法签名正是用来帮助区分这些相同名字的方法的。

    目前Cocos2d-js中支持的Java类型签名有下面4种：

    Java类型 签名
    int I
    float F
    boolean Z
    String Ljava/lang/String;
*/

cc.Class({
    extends: cc.Component,
    properties: {},

    judgeStringEmpty: function (val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined' || val === 'null') ? 1 : 0
    },
    judgeArrayEmpty:function (val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined') ? 1 : 0
    },
    judgeObjectEmpty:function (val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined') ? 1 : 0
    },
    judgeMapEmpty:function (val) {
        return (JSON.stringify(val) === JSON.stringify({}) || val === undefined || val == null || val.length <= 0 || val === 'undefined') ? 1 : 0
    },
    getPaiVaule:function (gameType) {
        let vaule = 0;
        let ison = cc.sys.localStorage.getItem(gameType + '_mjIGS');
        if (ison) {
            let mjIGS = JSON.parse(ison);
            cc.log('mjIGS-->' + JSON.stringify(mjIGS))
            vaule = mjIGS[gameType]
        }
        cc.log('vaule-->' + vaule)
        return vaule
    },
    getDeskTypeIndex: function() {
        let deskIdx = cc.sys.localStorage.getItem('teaDeskIdx');
        if (cc.g.utils.judgeStringEmpty(deskIdx)) {
            deskIdx = '2'
        }
        return parseInt(deskIdx)
    },
    checkExternalStorage:function () {
        if (!cc.sys.isNative) {
            return true;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            let isPerm = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "RequestExternalStorage", "()Z");
            cc.log("图库文件进行监听 " + isPerm);
            return isPerm;
        }

        if (cc.sys.os === cc.sys.OS_IOS) {
            // 结果在 onLocationRes 通知
            jsb.reflection.callStaticMethod('AppController', 'checkLocation:', cc.g.iosLocSvrClosedTms);
            return;
        }
    },

    // 刷新验证码CD
    refreshYZM: function() {
        this._yzmcd_ = 60;

        if (this.yzmcdInterval) {
            clearInterval(this.yzmcdInterval);
        }

        this.yzmcdInterval = setInterval(()=>{
            --this._yzmcd_;
            cc.log('验证码CD', this._yzmcd_);

            if (this._yzmcd_ < 0) {
                clearInterval(this.yzmcdInterval);
                this.yzmcdInterval = null;
            }
        }, 1000);
    },

    getWeChatOs: function() {
        let isWeCat = false
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            isWeCat = true
        }
        return isWeCat
    },

    randomInt: function(min, max) {
        let mn = max - min + 1;
        let r0 = Math.random();
        let r1 = r0*mn + min;

        let r = Math.floor(r1);

        return r;
    },

    randomFloat: function(min, max, fix) {
        let mn = max - min + 1;
        let r0 = Math.random();
        let r1 = r0*mn + min;

        let r = r1.toFixed(fix);

        return r;
    },

    getGameName: function(id, ori) {
        //cc.log('gametype ori', id, ori);
        
        if (ori == 0 || id == 0) {
            cc.log('未知游戏');
            return '未知游戏';
        }

        let name = '';

        // 开放游戏
        let open = {};
        GameConfig.gamesSeq.forEach(e => open[e] = true);

        if (!open[id]) return name;

        let gmnm = {};
        gmnm[GMID.D2] = '大贰';
        gmnm[GMID.HZMJ] = '麻将';
        gmnm[GMID.PDK] = '跑得快';
        gmnm[GMID.EQS] = '二七十';

        let areanm = cc.g.areaInfo[ori].name;

        if (gmnm[id]) {
            name = areanm + gmnm[id];
        } else if(id==GMID.XZMJ) {
            if (ori == 6) name = '血战麻将'; 
        } else if(id==GMID.XZMJER) {
            if (ori == 6) name = '二人一房'; 
        } else if(id==GMID.YBMJ) {
            if (ori == 5) name = '宜宾麻将';
        } else if(id==GMID.DDZ5) {
            if (ori == 2) name = '五人斗地主';
        } else if(id==GMID.NYMJ) {
            if (ori == 2) name = '宁远麻将';
        } else if(id==GMID.PDKNJ) {
            if (ori == 2) name = '内江跑得快';
        } else if(id==GMID.PDKTY) {
            if (ori == 2) name = '跑得快';
        } else if(id==GMID.PDKGX) {
            if (ori == 8) name = '珙县跑得快';
        } else if(id==GMID.NJMJ) {
            if (ori == 2) name = '内江麻将';
        } else if(id==GMID.LZMJ) {
            if (ori == 2) name = '泸州麻将';
        } else if(id==GMID.PDKLS) {
            if (ori == 11) name = '乐山跑得快';
        } else if(id==GMID.YJMJ) {
            if (ori == 11) name = '幺鸡麻将';
        } else if(id==GMID.PDKGAOX) {
            if (ori == 7) name = '高县跑得快';
        } else if(id==GMID.GXMJ) {
            if (ori == 8) name = '珙县麻将';
        } else if(id==GMID.LCMJ) {
            if (ori == 19) name = '隆昌麻将';
        } else if(id==GMID.PDKLC) {
            if (ori == 19) name = '隆昌跑得快';
        }

        return name;
    },

    /* ===================== 小游戏 ==================================================================================== */

    getMiniGameName: function(id) {
        if (!this.mngm) {
            let gm = {};

            gm['hall'] = 'hall';
            gm['tea'] = 'tea';
            gm['tea_quan'] = 'tea_quan';
            
            gm[GMID.XZMJ] = 'xzmj';
            gm[GMID.XZMJER] = 'xzmjer';
            gm[GMID.D2] = 'daer';
            gm[GMID.HZMJ] = 'majh';
            gm[GMID.PDK] = 'pdk';
            gm[GMID.DDZ5] = 'ddz5';
            gm[GMID.YBMJ] = 'ybmj';
            gm[GMID.NYMJ] = 'nymj';
            gm[GMID.PDKNJ] = 'pdknj';
            gm[GMID.LZMJ] = 'lzmj';
            gm[GMID.NJMJ] = 'njmj';
            gm[GMID.YJMJ] = 'yjmj';
            gm[GMID.EQS] = 'eqs';
            gm[GMID.PDKLS] = 'pdkls';
            gm[GMID.PDKTY] = 'pdkty';
            
            this.mngm = gm;
        }

        let name = this.mngm[id];
        
        cc.log('getMiniGameName', name);

        return name;
    },

    loadSubpackage: function(id, cb) {
        cc.log('loadSubpackage >>> ', id);

        if (id=='hall' || id=='tea' || id=='tea_quan') {
            cb && cb(true);
            return;
        }

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let spname = this.getMiniGameName(id);
        if (!spname || spname=='') {
            cc.log('子包名字错误');
            return;
        }
        
        if (!wx.loadSubpackage) {
            require('subpackages/'+spname+'/game.js');
            cb && cb(true);
            return;
        }

        let _me = this;
        const loadTask = wx.loadSubpackage({
            name: spname, // name 可以填 name 或者 root
            success: function(res) {
                // 分包加载成功后通过 success 回调
                _me.scheduleOnce(()=>cb && cb(true, res), 0.05);
            },
            fail: function(res) {
                // 分包加载失败后通过 fail 回调
                _me.scheduleOnce(()=>cb && cb(false, res), 0.05);
            }
        });

        loadTask.onProgressUpdate(res => {
            cc.log(spname + ' 下载进度', res.progress);
            cc.log(spname + ' 已经下载的数据长度', res.totalBytesWritten);
            cc.log(spname + ' 预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
        });
    },
    loadSubpackageAll: function() {
        cc.log('loadSubpackageAll');

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let sp = [];
        GameConfig.gamesSeq.forEach(e => {
            sp.push(this.getMiniGameName(e));
        });
        cc.log('Subpackage', sp);

        
        let _load = (spname, sucF, failF)=>{
            if (!wx.loadSubpackage) {
                require('subpackages/'+spname+'/game.js');
                return;
            }

            const loadTask = wx.loadSubpackage({
                name: spname, // name 可以填 name 或者 root
                success: function(res) {
                    sucF && sucF(res); // 分包加载成功后通过 success 回调
                },
                fail: function(res) {
                    failF && failF(res); // 分包加载成功后通过 success 回调
                }
            });
    
            loadTask.onProgressUpdate(res => {
                cc.log(spname + ' 下载进度', res.progress);
                cc.log(spname + ' 已经下载的数据长度', res.totalBytesWritten);
                cc.log(spname + ' 预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
            });
        }
        
        let loadIdx = 0;
        let _f = ()=>{
            _load(
                sp[loadIdx],
                (res)=>{
                    cc.log(sp[loadIdx] + ' 加载成功', res);
                    if (++loadIdx < sp.length) {
                        this.scheduleOnce(()=>_f(), 0.05);
                    }
                },
                (res)=>{
                    cc.log(sp[loadIdx] + ' 加载失败', res);
                    if (++loadIdx < sp.length) {
                        this.scheduleOnce(()=>_f(), 0.05);
                    }
                },
            );
        }

        _f();
    },
    

    /* ===================== 小游戏 ==================================================================================== */
    
    //增加按钮点击事件
    addClickEvent: function (node, target, component, handler, customEventData) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = target;
        clickEventHandler.component = component;
        clickEventHandler.handler = handler;
        if (customEventData != null) {
            clickEventHandler.customEventData = customEventData;
        }

        var button = node.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },

    //移除按钮上的所有点击事件
    removeClickAllEvent: function (node) {
        var button = node.getComponent(cc.Button);
        button.clickEvents.splice(0, button.clickEvents.length);
    },

    //增加Toggle组件的check事件
    addCheckEvent: function (node, target, component, handler, customEventData) {
        var checkEventHandler = new cc.Component.EventHandler();
        checkEventHandler.target = target;
        checkEventHandler.component = component;
        checkEventHandler.handler = handler;
        if (customEventData != null) {
            checkEventHandler.customEventData = customEventData;
        }
        var toggle = node.getComponent(cc.Toggle);
        toggle.checkEvents.push(checkEventHandler);
    },

    //增加EditBox组件的end事件
    addEditboxDidEndedEvent: function (node, target, component, handler, customEventData) {
        var editboxEventHandler = new cc.Component.EventHandler();
        editboxEventHandler.target = target;
        editboxEventHandler.component = component;
        editboxEventHandler.handler = handler;
        if (customEventData != null) {
            editboxEventHandler.customEventData = customEventData;
        }
        var editbox = node.getComponent(cc.EditBox);
        editbox.editingDidEnded.push(editboxEventHandler);
    },

    //设置ScrollView中的item在容器中居中显示（暂只支持Vertical方向）
    setScrollViewItemToVerticalCenter: function (scrollView, item) {
        let worldPos = scrollView.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        let viewPos = scrollView.content.convertToNodeSpaceAR(worldPos);
        let contentPosY = scrollView.content.position.y - (item.position.y - viewPos.y);
        contentPosY = Math.max(contentPosY, scrollView.node.height / 2);
        contentPosY = Math.min(contentPosY, scrollView.content.height - scrollView.node.height / 2);
        scrollView.content.position = new cc.Vec2(scrollView.content.position.x, contentPosY);
    },

    setScrollViewItemPosToVerticalCenter: function (scrollView, pos) {
        let worldPos = scrollView.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        let viewPos = scrollView.content.convertToNodeSpaceAR(worldPos);
        let contentPosY = scrollView.content.position.y - (pos.y - viewPos.y);
        contentPosY = Math.max(contentPosY, scrollView.node.height/2);
        contentPosY = Math.min(contentPosY, scrollView.content.height - scrollView.node.height/2);
        scrollView.content.position = new cc.Vec2(scrollView.content.position.x, contentPosY);
    },

    backPlayScaleBtnEffct: function (node, fun, s, t) {
        cc.log('backPlayScaleBtnEffct');

        if (!node) {
            fun && fun();
            return;
        }
        
        if (!cc.g.hallMgr)  {
            fun && fun();
            return;
        }
        if (!cc.g.hallMgr.curGameMgr)  {
            fun && fun();
            return;
        }
        
        if (!cc.g.hallMgr.curGameMgr.isBackPlayMode())  {
            //fun && fun();
            return;
        }

        s = s || 0.8;
        t = t || 0.1;

        node.runAction(cc.sequence(
            cc.scaleTo(t, s),
            cc.callFunc(
                function (params) {
                    node.runAction(cc.sequence(
                        cc.scaleTo(t, 1.0),
                        cc.callFunc(
                            function (params) {
                                fun && fun();
                            },
                            this,null
                        ),
                    ));
                },
                this,null
            ),
        ));
    },

    //获取json表数据
    getJson: function (name) {
        let J = cc.g.jsonData[name];
        return J.json ? J.json : J;
    },

    //设置玩家头像
    setHead: function (sprite, icon) {
        if (!sprite.spriteFrame) {
            sprite = sprite.getComponent(cc.Sprite);
        }

        if (icon.length > 4) {
            this.setUrlTexture(sprite, icon);
        } else {
            let spriteFrame = null;
            if (icon === '') {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_0', cc.SpriteFrame);
            }
            else {
                spriteFrame = cc.loader.getRes('textures/head/head_animal_' + icon, cc.SpriteFrame);
            }
            sprite.spriteFrame = spriteFrame;
        }
    },

    // fixedToScalerGold: function(num, fix) {
    //     if(cc.g.hallMgr != null && cc.g.hallMgr.curGameMgr != null && cc.g.hallMgr.curGameMgr.isCardRoomType()) {
    //         return num;
    //     }
    //     return (num / GameConfig.exchangeRate).toFixed(0);
    // },

    // fixedToRealGold: function (num) {
    //     return parseInt((num * GameConfig.exchangeRate).toFixed(2));
    // },

    fixNum: function (num) {
        return parseInt((num * GameConfig.exchangeRate).toFixed(2));
    },
    realNum: function (num) {
        return (num / GameConfig.exchangeRate).toFixed(0);
    },
    fixNum1: function (num) {
        return parseInt((num * 100).toFixed(0));
    },
    realNum1: function (num) {
        return parseFloat((num / 100).toFixed(2));
    },
    floatFiexed: function (num) {
        return parseFloat(num).toFixed(2);
    },
    //格式化数字
    getFormatNumString: function (num) {
        return num.toString();
        /*if(num < 100) {
            return num.toString();
        }
        let endStr = '';
        let s = num;
        if (num >= 100000000) {
            s = (num / 100000000).toString()
            endStr = '亿';
        }
        else if (num >= 10000) {
            s = (num / 10000).toString()
            endStr = '万';
        }
        else if(num >= 100) {
            s = num.toString();
            endStr = '';
        }
        let sp = s.split('.');
        if (sp.length == 1) {
            return s + endStr;
        }
        else if (sp[0].length == 4) {
            return sp[0] + endStr;
        }
        else {
            return sp[0] + '.' + sp[1].substring(0, Math.min(4 - sp[0].length, sp[1].length)) + endStr;
        }*/
    },

    //格式化日期
    getFormatTime: function (time, fmt) {
        let date = new Date(time);
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },

    //格式化
    getFormatTimeXXX: function (time, fmt) {
        let now = time ? new Date(time) : new Date();

        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        month = month < 10 ? '0'+month : month;
        let date = now.getDate();
        date = date < 10 ? '0'+date : date;
        let hour = now.getHours();
        hour = hour < 10 ? '0'+hour : hour;
        let minute = now.getMinutes();
        minute = minute < 10 ? '0'+minute : minute;
        let second = now.getSeconds();
        second = second < 10 ? '0'+second : second;

        // Y M D h m s
        let o = {'Y':year,'M':month,'D':date,'h':hour,'m':minute,'s':second,}

        let ts = '';

        let fmts = fmt.split('|');
        fmts.forEach(e => ts += o[e] ? o[e] : e);

        return ts;
    },

    //格式化 年 月 日
    getFormatTimeNYR: function (fmt, time) {
        let now = time ? time : new Date();

        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        month = month < 10 ? '0'+month : month;
        let date = now.getDate();
        date = date < 10 ? '0'+date : date;
        let hour = now.getHours();
        hour = hour < 10 ? '0'+hour : hour;
        let minute = now.getMinutes();
        minute = minute < 10 ? '0'+minute : minute;
        let second = now.getSeconds();
        second = second < 10 ? '0'+second : second;

        return year + fmt[0] + month + fmt[1] + date + fmt[2] + hour + fmt[3] + minute + fmt[4] + second;
    },

    // y:m:d:h:m:s
    getFormatTimeYMD: function (fmt, time) {
        let now = time ? time : new Date();

        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        month = month < 10 ? '0'+month : month;
        let date = now.getDate();
        date = date < 10 ? '0'+date : date;
        // let hour = now.getHours();
        // hour = hour < 10 ? '0'+hour : hour;
        // let minute = now.getMinutes();
        // minute = minute < 10 ? '0'+minute : minute;
        // let second = now.getSeconds();
        // second = second < 10 ? '0'+second : second;

        return year + fmt[0] + month + fmt[1] + date
    },
    getFormatTimeHMS: function (fmt, time) {
        let now = time ? time : new Date();

        // let year = now.getFullYear();
        // let month = now.getMonth() + 1;
        // month = month < 10 ? '0'+month : month;
        // let date = now.getDate();
        // date = date < 10 ? '0'+date : date;
        let hour = now.getHours();
        hour = hour < 10 ? '0'+hour : hour;
        let minute = now.getMinutes();
        minute = minute < 10 ? '0'+minute : minute;
        let second = now.getSeconds();
        second = second < 10 ? '0'+second : second;

        return hour + fmt[0] + minute + fmt[1] + second;
    },


    /* 通过文字二进制得到文字字节数 */
    getByteByBinary: function(binaryCode) {
        /**
         * 二进制 Binary system,es6表示时以0b开头
         * 八进制 Octal number system,es5表示时以0开头,es6表示时以0o开头
         * 十进制 Decimal system
         * 十六进制 Hexadecimal,es5、es6表示时以0x开头
         */
        let byteLengthDatas = [0, 1, 2, 3, 4];
        let len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
        return len;
    },
    /* 通过文字十六进制得到文字字节数 */
    getByteByHex: function(hexCode) {
        return cc.g.utils.getByteByBinary(parseInt(hexCode, 16).toString(2));
    },

    /**参数说明：
     *
     * 根据长度截取先使用字符串，超长部分追加…
     * @param {String} str 对象字符串
     * @param {Integer} maxLength 目标字节长度,字母数字算1,表情算2，中文算2
     * 返回值： 处理结果字符串
     */
    getFormatName: function (str, maxLength) {
        // num = num || 4;
        // let nm = '';
        // let a = 0;
        // for (let i = 0; i < str.length; i++) {
        //     if (str.charCodeAt(i) > 255)
        //         a += 2;//按照预期计数增加2
        //     else
        //         a++;
        //
        //     if (a <= num){
        //         nm+=str[i];
        //     } else {
        //         nm+='...';
        //         break;
        //     }
        // }
        //
        // return nm;
        // let hstr = ''
        // if (!cc.g.utils.judgeStringEmpty(str)) {
        //     try {
        //         hstr = str.substr(0, num)
        //     } catch (e) {
        //         hstr = str
        //         cc.error('截取字符串报错...')
        //     }
        // }
        // return hstr;

        // let strlen = 0;
        // let tempArr = [];
        // let tempStr = '';
        // let i = 0;
        // let _iteratorNormalCompletion = true;
        // let _didIteratorError = false;
        // let _iteratorError = undefined;
        // try {
        //     for (let _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        //         let v = _step.value;
        //         tempArr[i] = v;
        //         tempStr = tempStr + v;
        //         i = i + 1;
        //         if (tempStr != str) {
        //             //还没有到最后
        //             if (v.charCodeAt(0) > 128) {
        //                 strlen = strlen + 2;
        //                 if (strlen >= len) {
        //                     return tempArr.slice(0, tempArr.length - 1).join('') + "..."; //...也占用len里面的位置
        //                 }
        //             } else {
        //                 strlen = strlen + 1;
        //                 if (strlen >= len) {
        //                     return tempArr.slice(0, tempArr.length - 2).join('') + "..."; //...也占用len里面的位置
        //                 }
        //             }
        //         }
        //     }
        // } catch (err) {
        //     _didIteratorError = true;
        //     _iteratorError = err;
        // } finally {
        //     try {
        //         if (!_iteratorNormalCompletion && _iterator.return) {
        //             _iterator.return();
        //         }
        //     } finally {
        //         if (_didIteratorError) {
        //             throw _iteratorError;
        //         }
        //     }
        // }
        // return tempStr;


        let result = "";
        let flag = false;
        let len = 0;
        let length = 0;
        let length2 = 0;
        for (let i = 0; i < str.length; i++) {
            let code = str.codePointAt(i).toString(16);
            if (code.length > 4) {
                i++;
                if ((i + 1) < str.length) {
                    flag = str.codePointAt(i + 1).toString(16) == "200d";
                }
            }
            if (flag) {
                len += cc.g.utils.getByteByHex(code);
                if (i == str.length - 1) {
                    length += len;
                    if (length <= maxLength) {
                        result += str.substr(length2, i - length2 + 1);
                    } else {
                        break
                    }
                }
            } else {
                if (len != 0) {
                    length += len;
                    length += cc.g.utils.getByteByHex(code);
                    if (length <= maxLength) {
                        result += str.substr(length2, i - length2 + 1);
                        length2 = i + 1;
                    } else {
                        break
                    }
                    len = 0;
                    continue;
                }
                length += cc.g.utils.getByteByHex(code);
                if (length <= maxLength) {
                    if (code.length <= 4) {
                        result += str[i]
                    } else {
                        result += str[i - 1] + str[i]
                    }
                    length2 = i + 1;
                } else {
                    break
                }
            }
        }

        if (cc.g.utils.judgeStringEmpty(result)) {
            result = str;
        }

        return result;
    },

    // 字符串转数字
    strToNumber: function (str) {
        if (!str) return;
        
        let num = true;
        let dot = 0;

        let v={};
        for (var i = 0, _s = '0123456789.'; i < _s.length; i++) {
            v[_s.charCodeAt(i)] = 1;
        }

        for (var i = 0; i < str.length; i++) {
            let n = str.charCodeAt(i);

            if (!v[n]) {
                num = false;
                break;
            }

            if (n == '.'.charCodeAt(0)) {
                ++dot;
                if (dot>1) {
                    num = false;
                    break;
                }
            }
        }

        num = num ? parseFloat(parseFloat(str).toFixed(2)) : '';

        return num;
    },

    try2Number: function (str) {
        let _0 = str.charCodeAt(0);

        let c0 = '0'.charCodeAt(0);
        let c9 = '9'.charCodeAt(0);
        let cf = '-'.charCodeAt(0);
        let cz = '+'.charCodeAt(0);
        
        let nan = false;

        for (let i = (_0==cf||_0==cz ? 1 : 0); i < str.length; ++i) {
            let cv = str.charCodeAt(i);
            
            if (cv<c0 || cv>c9) {
                nan = true;
                break
            }
        }

        if (!nan) {
            return parseInt(str);
        }

        return parseInt('');
    },

    getCharacterNum: function (str) {
        let a = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255)
                a += 2;//按照预期计数增加2
            else
                a++;
        }
        return a;
    },

    sethead: function (spr, icon) {
        let hf = (spr, icon)=>{
            if (icon === '') {
                cc.resources.load('textures/head/head_animal_0', cc.SpriteFrame, function (err, asset) {
                    spr.spriteFrame = asset;
                });
            } else {
                cc.resources.load('textures/head/head_animal_' + icon, cc.SpriteFrame, function (err, asset) {
                    spr.spriteFrame = asset;
                });
            }
        };

        if (icon.length > 4) {
            cc.g.utils.setUrlTexture(spr, icon);
        } else {
            hf(spr, icon);
        }
    },

    

    isInstallWX: function () {
        if (!cc.sys.isNative) {
            return false;
        }
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isInstallWX", "(I)Z", 1);
        }
        else if (cc.sys.os === cc.sys.OS_IOS) {
            return jsb.reflection.callStaticMethod('AppController', 'isWXAppInstalled');
        }
    },

    registerWXApp: function (appId, universalLink) {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "registerWXApp", "(Ljava/lang/String;)V", appId);
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AppController', 'registerWXApp:universalLink:', appId, universalLink);
            }
        }
    },

    openWXApp: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openWXApp", "(I)V", 1);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('AppController', 'openWXApp');
            }
        }
    },

    openQQApp: function (qq) {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openQQApp", "(Ljava/lang/String;)V", qq);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('AppController', 'openQQApp:', qq);
            }
        }
    },

    setUrlTexture: function (sprite, url, formatType) {
        if (formatType == null) {
            formatType = 'jpg';
        }
        cc.loader.load({url: url, type: formatType}, function (err, texture) {
            let spr = new cc.SpriteFrame(texture);
            sprite.spriteFrame = spr;
        });
    },

    shareURLToWX: function (title, description, thumb, url, wxScene) {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "WXShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V",
                    title, description, url, wxScene);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AppController', 'sendShareURLRequestWithTitle:description:thumb:webURL:wxScene:', title, description, thumb, url, wxScene);
            }
        }
    },

    shareCaptureScreenToWX: function (wxScene) {
        // https://docs.cocos.com/creator/manual/zh/render/camera.html
        // https://github.com/cocos-creator/example-cases/blob/v2.4.3/assets/cases/07_capture_texture/capture_to_native.js
        // https://github.com/cocos-creator/example-cases/blob/v2.4.3/assets/cases/07_capture_texture/textureRenderUtils.js

        if (!jsb) {
            cc.log('shareCaptureScreenToWX !jsb');
            return;
        }

        let CaptureScreen = ()=>{
            let node = new cc.Node();
            node.setPosition(cc.visibleRect.width/2,cc.visibleRect.height/2);
            node.width = cc.visibleRect.width;
            node.height = cc.visibleRect.height;
            node.parent = cc.director.getScene();

            let camera = node.addComponent(cc.Camera);
            camera.cullingMask = 0xffffffff;    // 设置你想要的截图内容的 cullingMask

            // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，
            //    这样 camera 的内容将会渲染到新建的 RenderTexture 中。
            // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
            // 1.原生截图换  DEPTH24_STENCIL8_OES //STENCIL_INDEX8
            // 2.截图放到EVENT_AFTER_DRAW之后
            // 3.1.x版本截图时关闭渲染优化剪枝功能
            //在使用遮罩时候，万千万千万千万千万千万千万千万不要使用反向遮罩
            let texture = new cc.RenderTexture();
            let gl = cc.game._renderContext;
            texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
            camera.targetTexture = texture;

            // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
            cc.director.getScene().scaleY = -1;
            camera.render();
            cc.director.getScene().scaleY = 1;

            // 这样我们就能从 RenderTexture 中获取到数据了
            let data = texture.readPixels();
            let width = texture.width;
            let height = texture.height;

            // 保存到相册
            let dirPath = jsb.fileUtils.getWritablePath() + 'screen-shoot/';
            if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
                jsb.fileUtils.createDirectory(dirPath);
            }

            let name = (new Date()).valueOf() + '.png';
            let filePath = dirPath + name;

            cc.log('filePath', filePath);

            let success = jsb.saveImageData(data, width, height, filePath);
            node.destroy()
            if (success) {
                cc.log('截图保存成功.');

                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "WXShareScene", "(Ljava/lang/String;I)V", filePath, wxScene);
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod('AppController', 'sendShareImageRequestWithFilePath:wxScene:', filePath, wxScene);
                }
            } else {
                cc.g.global.hint('截图保存失败');
            }
        }

        this.scheduleOnce(() => {
            CaptureScreen();

        }, 0);
    },
    
    deprecated_two_shareCaptureScreenToWX: function (wxScene, page) {
        // https://docs.cocos.com/creator/manual/zh/render/camera.html
        // https://github.com/cocos-creator/example-cases/blob/v2.4.3/assets/cases/07_capture_texture/capture_to_native.js
        // https://github.com/cocos-creator/example-cases/blob/v2.4.3/assets/cases/07_capture_texture/textureRenderUtils.js

        if (!cc.sys.isNative) return;

        page = page || (cc.g.hallMgr.curGameMgr && cc.g.hallMgr.curGameMgr.gameScript);
        if (!page) {
            cc.log('shareCaptureScreenToWX err page !!!');
            return;
        }

        let camera = cc.find('Main Camera', page.node);
        if (!camera) {
            cc.log('shareCaptureScreenToWX NO camera node !!!');
            return;
        }
        camera = camera.getComponent(cc.Camera);
        if (!camera) {
            cc.log('shareCaptureScreenToWX NO camera Component !!!');
            return;
        }

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_S8);
        camera.targetTexture = texture;

        let _width = 0;
        let _height = 0;
        let CaptureScreen = ()=>{
            let data = texture.readPixels();
            _width = texture.width;
            _height = texture.height;

            let filpYImage = (data, width, height)=>{
                // create the data array
                let picData = new Uint8Array(width * height * 4);
                let rowBytes = width * 4;
                for (let row = 0; row < height; row++) {
                    let srow = height - 1 - row;
                    let start = srow * width * 4;
                    let reStart = row * width * 4;
                    // save the piexls data
                    for (let i = 0; i < rowBytes; i++) {
                        picData[reStart + i] = data[start + i];
                    }
                }
                return picData;
            }

            let newdata = filpYImage(data, _width, _height);

            if (!CC_JSB) return;

            // 存放到路径
            let dirPath = jsb.fileUtils.getWritablePath() + 'screen-shoot/';
            if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
                jsb.fileUtils.createDirectory(dirPath);
            }

            let name = (new Date()).valueOf() + '.png';
            let filePath = dirPath + name;
            
            cc.log('filePath', filePath);

            let success = jsb.saveImageData(newdata, _width, _height, filePath);
            if (success) {
                cc.log('截图保存成功.');
        
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "WXShareScene", "(Ljava/lang/String;I)V", filePath, wxScene);
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod('AppController', 'sendShareImageRequestWithFilePath:wxScene:', filePath, wxScene);
                }
            } else {
                cc.g.global.hint('截图保存失败');
            }  
        }

        camera.enabled = true;
        this.scheduleOnce(() => {
            CaptureScreen();
            camera.enabled = false;
        }, 0.25);    
    },

    // 1.9.0 作废
    deprecated_shareCaptureScreenToWX: function (wxScene) {
        if (cc.sys.isNative) {
            let dirPath = jsb.fileUtils.getWritablePath() + 'screen-shoot/';
            if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
                jsb.fileUtils.createDirectory(dirPath);
            }
            let name = (new Date()).valueOf() + '.png';
            let filePath = dirPath + name;
            let size = cc.winSize;
            let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            cc.director.getScene()._sgNode.addChild(rt);
            rt.setVisible(false);
            rt.begin();
            cc.director.getScene()._sgNode.visit();
            rt.end();
            rt.saveToFile('screen-shoot/' + name, cc.macro.ImageFormat.JPG, true, function () {
                cc.log('图片保存成功.');
                rt.removeFromParent();
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "WXShareScene", "(Ljava/lang/String;I)V", filePath, wxScene);
                }
                else if (cc.sys.os === cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod('AppController', 'sendShareImageRequestWithFilePath:wxScene:', filePath, wxScene);
                }
            });
        }
    },

    setPasteboard: function (content) {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setPasteboard", "(Ljava/lang/String;)Z", content);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod('AppController', 'setPasteboard:', content);
            }
        }
    },

    getPasteboard: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getPasteboard", "()Ljava/lang/String;",);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                //return jsb.reflection.callStaticMethod('AppController', 'setPasteboard:', content);
                return 'ios还没有实现';
            }
        }
        return null;
    },

    getError: function(errcode) {
        if (errcode == PB.ERROR.CLIENT_VERSION_TIMEOUT || errcode == 1312) {
            return '客户端版本过低 请重新下载新包';
        }
        
        let msg = '未定义错误码 ' + errcode;
        return (cc.g.msgCodeIfo && cc.g.msgCodeIfo.err[errcode]) || msg;
    },

    //设置JS环境初始化成功
    setJSEnvInited: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setJSEnvInited", "()V",);
            }
            else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AppController', 'setJSEnvInited');
            }
        }
    },
    //上报效果点
    releaseResDir: function (dir) {
        cc.resources.loadDir(dir, function (err, assets) {
            cc.log('releaseResDir  '+dir);
            assets.forEach(e => {
                cc.assetManager.releaseAsset(e);
            });
        });
    },
    // 检测原生是否有新版本
    checkNativeAppHaveNewVersion: function (url) {
        if (!cc.sys.isNative) {
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "doCheckAppUpdate", "(Ljava/lang/String;)V", url);
        }
    },

    //震动
    shake: function (ms) {
        if (!cc.sys.isNative) {
            cc.log('非原生系统 跳过震动');
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // 安卓的高德KEY是要在 AndroidManifest 里配置的
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shake", "(I)V", ms);
            return;
        }

        // 
        if (cc.sys.os === cc.sys.OS_IOS) {
            //jsb.reflection.callStaticMethod('AppController', '::', '','');
            jsb.reflection.callStaticMethod('AppController', 'btnVer');
            return;
        }
    },
    btnShake: function () {
        cc.log('btnShake');

        cc.g.audioMgr.playSFX('public/shuidi.mp3');

        if (!GameConfig.isZhendong) return;

        cc.g.utils.shake(0.25*1000);
    },

    //截屏监听 启动
    startScreenshotListen: function () {
        if (!cc.sys.isNative) {
            cc.log('非原生系统 跳过定位');
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startScreenshotListen", "()V");
            return;
        }

        // 
        if (cc.sys.os === cc.sys.OS_IOS) {
            //jsb.reflection.callStaticMethod('AppController', '::', '','');
            // jsb.reflection.callStaticMethod('AppController', 'registNotification');
            return;
        }
    },
    //截屏监听 关闭
    stopScreenshotListen: function () {
        if (!cc.sys.isNative) {
            cc.log('非原生系统 跳过定位');
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopScreenshotListen", "()V");
            return;
        }

        // 
        if (cc.sys.os === cc.sys.OS_IOS) {
            //jsb.reflection.callStaticMethod('AppController', '::', '','');
            // jsb.reflection.callStaticMethod('AppController', 'removeNotification');
            return;
        }
    },
    //设备截屏通知
    onDeviceScreenshot: function (info) {
        let arg = info.split(';');

        this.scheduleOnce(()=>{
            cc.log('设备截屏通知 onDeviceScreenshot arg', arg);

            if (cc.g.hallMgr.curGameMgr) {
                cc.g.hallMgr.curGameMgr.onScreenshot(false);
            }
        }, 0.2);
    },
    
    /* ===================== 定位 ==================================================================================== */
    // 初始化定位
    initLocation: function () {
        if (!cc.sys.isNative) {
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // 安卓的高德KEY是要在 AndroidManifest 里配置的
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initLocation", "()V");
            return;
        }

        // "best"
        if (cc.sys.os === cc.sys.OS_IOS) {
            /*
                由于苹果系统的首次定位结果为粗定位，其可能无法满足需要高精度定位的场景。
                所以，高德提供了 kCLLocationAccuracyBest 参数，设置该参数可以获取到精度在10m左右的定位结果，但是相应的需要付出比较长的时间（10s左右），越高的精度需要持续定位时间越长。

                推荐：kCLLocationAccuracyHundredMeters，一次还不错的定位，偏差在百米左右，超时时间设置在2s-3s左右即可。
                高精度：kCLLocationAccuracyBest，可以获取精度很高的一次定位，偏差在十米左右，超时时间请设置到10s，如果到达10s时没有获取到足够精度的定位结果，会回调当前精度最高的结果。
                
                4ec2a194e475d858644de456128809d0
                22e44e91e69008eaa550b5a824fc8315
            */
            jsb.reflection.callStaticMethod('AppController', 'initLocation:accuracy:', '22e44e91e69008eaa550b5a824fc8315','best');
            return;
        }
    },

    // 检测定位权限
    checkLocationPermission: function () {
        if (!cc.sys.isNative) {
            return true;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            let isPerm = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "RequestPermissions", "()Z");
            cc.log("定位权限 " + isPerm);
            return isPerm;
        }

        if (cc.sys.os === cc.sys.OS_IOS) {
            // 结果在 onLocationRes 通知
            jsb.reflection.callStaticMethod('AppController', 'checkLocation:', cc.g.iosLocSvrClosedTms);
            return;
        }
    },

    // 检测定位服务
    checkLocationSvr: function (way) {
        if (!cc.sys.isNative) {
            return;
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            let res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkLocationLM", "()Ljava/lang/String;");
            cc.log("定位服务: ", res);
            return res;
        }

        if (cc.sys.os === cc.sys.OS_IOS) {
            // 结果在 onLocationRes 通知
            jsb.reflection.callStaticMethod('AppController', 'checkLocation:', cc.g.iosLocSvrClosedTms);
            return;
        }
    },

    // 打开GPS
    openLocation: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openLocation", "()V");
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('AppController', 'openLocation');
            }
        }
    },

    // 开始定位
    startLocation: function (fun, isStrong) {
        // 定位过来请求结果的回调
        if (!this.waitRF) {
            this.waitRF = []; 
        }
        this.waitRF.push(fun);

        let resf = (suc, str)=>{
            cc.log(str);

            let o={};
            o.success = suc;
            o.desc = str;
            
            if (this.waitRF) {
                cc.log('this.waitRF', this.waitRF);
                this.waitRF.forEach(f => f && f(o));
                this.waitRF = [];
            }
        };

        if (!cc.sys.isNative) {
            resf(true, '非原生系统，跳过定位');
            return;
        }

        this.isStrong = isStrong;
        this.canLoc = true;

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // 尝试获取权限
            if (this.checkLocationPermission()) {
                // 有权限 检测定位服务
                let res = this.checkLocationSvr();
                let svr = res.split(',');
                if (svr[0]=='GPS_PROVIDER' || svr[0]=='NETWORK_PROVIDER') {
                    if (this.isLocing) {
                        //resf(false, '正在定位中，跳过定位');
                        cc.log('正在定位中，跳过定位');
                    } else {
                        // 有定位服务 开始定位 定位结果会在 onLocationRes 通知
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startLocation", "()V");
                        this.isLocing = true;

                        //resf(true, '开始定位，等待结果');
                        cc.log('开始定位，等待结果');
                    }
                } else {
                    // 弹窗提示前往开启定位服务
                    // cc.g.global.showTipBox('未开启定位服务，确定前往开启', ()=>{
                    //     this.openLocation();
                    // });

                    resf(false, '未开启定位服务');
                }

                this.canLoc = false;
            } else {
                // 如果没有权限 安卓层会自动弹出申请权限
                // 此时玩家不管同意还是不同意都会在 onLocationRes 通知
                // 如果玩家之前把权限拒绝了 或者点选了不在询问和拒绝 那么会直接收到决绝权限的结果 也会在 onLocationRes 通知
            }

            return;
        }

        if (cc.sys.os === cc.sys.OS_IOS) {
            // 检测并弹窗申请权限和服务 IOS在服务关闭的情况下 是无法设置权限的 所以会优先申请服务然后再是权限
            // IOS在申请的时候 有不允许的选项 可以得到不允许的通知 但是没有允许的选项 这时是跳转到设置界面用户自行进行设置
            // 设置完后回来 客户端根据需求情况继续进行检测 服务和权限都开启后 才进行定位
            // 检测结果在 onLocationRes 通知
            jsb.reflection.callStaticMethod('AppController', 'checkLocation:', cc.g.iosLocSvrClosedTms);
            return;
        }
    },

    // GPS距离 通过经纬度获取距离(单位：米)  latitude纬度  longitude经度 isRaw原始数据
    locationDistence: function (latitude1, longitude1, latitude2, longitude2, isRaw) {
        if (!latitude1 || !longitude1 || !latitude2  || !longitude2) {
            cc.error('传入了错误的经纬度 lat1, lon1, lat2, log2', latitude1, longitude1, latitude2, longitude2);
            return 'err: '+latitude1+' '+longitude1+' '+latitude2+' '+longitude2;
        }

        latitude1  = parseFloat(''+latitude1) || -1;
        longitude1 = parseFloat(''+longitude1) || -1;
        latitude2  = parseFloat(''+latitude2) || -1;
        longitude2 = parseFloat(''+longitude2) || -1;

        if ((latitude1<-90  || latitude1>90) ||
            (longitude1<-180 || longitude1>180) ||
            (latitude2<-90  || latitude2>90) ||
            (longitude2<-180 || longitude2>180)
        )
        {
            cc.error('传入了错误的经纬度 lat1, lon1, lat2, log2', latitude1, longitude1, latitude2, longitude2);
            return 'err: '+latitude1+' '+longitude1+' '+latitude2+' '+longitude2;
        }

        const EARTH_RADIUS = 6378.137;

        let rad = d => d * Math.PI / 180.0;

        let radLat1 = rad(latitude1);
        let radLat2 = rad(latitude2);

        let a = radLat1 - radLat2;
        let b = rad(longitude1) - rad(longitude2);

        /*
        double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)    
                + Math.cos(radLat1) * Math.cos(radLat2)    
                * Math.pow(Math.sin(b / 2), 2)));
        */

        let cosrLat1 = Math.cos(radLat1);
        let cosrLat2 = Math.cos(radLat2);
        let pow_sin_a = Math.pow(Math.sin(a/2), 2);
        let pow_sin_b = Math.pow(Math.sin(b/2), 2);

        let s = 2 * Math.asin(Math.sqrt(pow_sin_a + cosrLat1*cosrLat2*pow_sin_b));

        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        s = s*1000;

        if (isRaw) {
            return s;
        }

        if (s < 1000) {
            s = s.toFixed(1)+':米';
        } else {
            s /= 1000;
            s = s.toFixed(1)+':千米';
        }

        return s;
    },

    // 定位结果
    onLocationRes: function (res) {
        cc.log("LocationRes: ", res);

        let resf = (suc, str, notip)=>{
            cc.log(str);

            this.canLoc = false;

            if (!notip) {
                cc.g.global.hint(str);
            }

            let o={};
            o.success = suc;
            o.desc = str;

            if (this.waitRF) {
                cc.log('this.waitRF', this.waitRF);
                this.waitRF.forEach(f => f && f(o));
                this.waitRF = [];
            }
        };

        // 安卓允许权限
        if (res == 'LOCATION_agree') {
            let res = this.checkLocationSvr();
            let svr = res.split(',');
            if (svr[0]=='GPS_PROVIDER' || svr[0]=='NETWORK_PROVIDER') {
                if (this.canLoc) {
                    if (this.isLocing) {
                        //resf(false, '正在定位中，跳过定位');
                        cc.log('正在定位中，跳过定位');
                    } else {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startLocation", "()V");
                        this.isLocing = true;
                        //resf(false, '开始定位，等待结果', true);
                        cc.log('开始定位，等待结果');
                    }
                }
            } else {
                // cc.g.global.showTipBox('未开启定位服务，确定前往开启', ()=>{
                //     this.openLocation();
                // });

                resf(false, '未开启定位服务', true);
            }

            return;
        }

        // 安卓拒绝权限
        if (res == 'LOCATION_NO_agree') {
            resf(false, '请开启应用的定位权限', true);
            return;
        }

        // IOS 权限 服务
        let qxfw = res.split(';');
        if (qxfw.length==2) {
            // locationOpend locationClosed 服务开启情况
            // 0-kCLAuthorizationStatusNotDetermined 权限情况
            if (qxfw[0]=='locationClosed') {
                ++cc.g.iosLocSvrClosedTms;
                cc.sys.localStorage.setItem('iosLocSvrClosedTms', ''+cc.g.iosLocSvrClosedTms);
                resf(false, '未开启定位服务', true);
                return;
            }

            if (qxfw[0]=='locationOpend') {
                let Auth = qxfw[1].split('-');
                if (parseInt(Auth[0])>=3) {
                    if (this.canLoc) {
                        if (this.isLocing) {
                            //resf(false, '正在定位中，跳过定位');
                            cc.log('正在定位中，跳过定位');
                        } else {
                            jsb.reflection.callStaticMethod('AppController', 'requestLocation');
                            this.isLocing = true;
                            //resf(false, '开始定位，等待结果', true);
                            cc.log('开始定位，等待结果');
                        }
                    }
                } else {
                    resf(false, '请开启应用的定位权限', true);
                }
                return;
            }
        }

        // IOS拒绝服务
        if (res=='cancelLocation') {
            resf(false, '未开启定位服务', true);
            return;
        }

        // IOS拒绝权限
        if (res=='cancelPerm') {
            resf(false, '请开启应用的定位权限', true);
            return;
        }

        this.isLocing = false;
        this.canLoc = false;

        // 最后定位的数据
        let jdata = JSON.parse(res);
        if (!jdata) {
            resf(false, '定位数据解析失败', true);
            return;
        }

        jdata.success = (jdata.res && (jdata.res.success == 'true'));
        cc.log("定位数据: ", jdata);

        cc.g.lastLocRes = jdata;

        cc.g.userMgr.gps.longitude = jdata.info.longitude;
        cc.g.userMgr.gps.latitude = jdata.info.latitude;

        cc.g.gpsAddress = null;

        if (jdata.res.success == 'true' || jdata.res.success == 'waring') {
            // 检测经纬度
            {
                let lon = jdata.info.longitude;
                let lat = jdata.info.latitude;
    
                //
                if (!lon || !lat) {
                    resf(false, `获取到了无效的经纬度 lon${lon}:lat${lat}`, true);
                    return;
                }
        
                let lon1 = parseFloat(''+lon) || -1;
                let lat1 = parseFloat(''+lat) || -1;
        
                if ((lat1<-90  || lat1>90) || (lon1<-180 || lon1>180)) {
                    resf(false, `获取到了错误的经纬度 lon1${lon1}:lat1${lat1}`, true);
                    return;
                }
            }

            cc.g.gpsAddress = jdata.info.address || 'address error';

            // 目前是安卓比较慢10多秒 苹果很快1-2秒 游戏场景加载可能1-3秒 所以IOS等场景加载一会
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                cc.g.hallMgr.upPlayerGps(jdata.info.longitude, jdata.info.latitude);
            } else {
                this.scheduleOnce(()=>{
                    cc.g.hallMgr.upPlayerGps(jdata.info.longitude, jdata.info.latitude);
                }, 1);
            }

            resf(true, '定位已更新', true);
        } else {
            resf(false, jdata.res.desc, true);
            cc.error("定位失败");
        }
    },

    onJsbLog: function (log) {
        cc.log("JsbLog: ", log);

        if (log == 'EXTERNAL_STORAGE_agree' || log=='EXTERNAL_STORAGE_NO_agree') {
            cc.g.utils.checkLocationPermission();
        }
    },

    /* ===================== 定位 ==================================================================================== */


    /* ===================== 切屏 ==================================================================================== */


    regJsBackGround: function (fun) {
        cc.log("regJsBackGround ", fun);

        this.JsBackGroundFun = fun;
    },
    regJsbToFront: function (fun) {
        cc.log("JsbToFront ", fun);

        this.JsbToFront = fun;
    },

    onJsBackGround: function () {
        cc.log("onJsBackGround: ");

        this.JsBackGroundFun && this.JsBackGroundFun();
    },

    onJsbToFront: function () {
        cc.log("onJsbToFront: ");

        this.JsbToFront && this.JsbToFront();
    },

    /* ===================== 切屏 ==================================================================================== */

    setLocalStorage: function(key, map) {
        let jsonStr = JSON.stringify(map)
        cc.sys.localStorage.setItem(key, jsonStr);
    },
    getLocalStorage: function(key) {
        let jsonStr = cc.sys.localStorage.getItem(key);
        if (cc.g.utils.judgeStringEmpty(jsonStr)) {
            return ''
        }
        return JSON.parse(jsonStr)
    },
    clearLocalStorage: function(key) {
        cc.sys.localStorage.removeItem(key)
    },
    parseJsonStr: function(jsonStr) {
        if (cc.g.utils.judgeStringEmpty(jsonStr)) {
            return ''
        }
        return JSON.parse(jsonStr)
    },

    /* ========================================================================================================= */

    setCanvasFit: function () {
        /*let node = cc.director.getScene().getChildByName('Canvas');
        var size = cc.view.getFrameSize();
        if(size.width/size.height > 1.8) {
            var cvs = node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        }*/
    },




    bcrcd:function () {
        {/*
            // 结果 平台
            String sb = "{";
            sb += "\"platform\":" + "\"andriod\"" + ",";

            if (null != location) {
				//errCode等于0代表定位成功，其他的为定位失败，具体的可以参照官网定位错误码说明
				if(location.getErrorCode() == 0){
                    RunJS_Log("定位成功");

                    // 结果
                    sb += "\"res\":{";
                    sb += "\"success\":" + "\"true\"" + ",";
                    sb += "\"code\":" + "\""+location.getErrorCode()+"\"" + ",";
                    sb += "\"desc\":" + "\"定位成功\"";
                    sb += "},";

                    // 信息
                    sb += "\"info\":{";
                    sb += "\"locationType\":" + "\""+location.getLocationType()+"\"" + ",";//sb.append("定位类型: " + location.getLocationType() + "\n");
                    sb += "\"longitude\":" + "\""+location.getLongitude()+"\"" + ",";//sb.append("经    度    : " + location.getLongitude() + "\n");
                    sb += "\"latitude\":" + "\""+location.getLatitude()+"\"" + ",";//sb.append("纬    度    : " + location.getLatitude() + "\n");

                    sb += "\"accuracy\":" + "\""+location.getAccuracy()+"\"" + ",";//sb.append("精    度    : " + location.getAccuracy() + "米" + "\n");
                    sb += "\"provider\":" + "\""+location.getProvider()+"\"" + ",";//sb.append("提供者    : " + location.getProvider() + "\n");
                    sb += "\"speed\":" + "\""+location.getSpeed()+"\"" + ",";//sb.append("速    度    : " + location.getSpeed() + "米/秒" + "\n");
                    sb += "\"bearing\":" + "\""+location.getBearing()+"\"" + ",";//sb.append("角    度    : " + location.getBearing() + "\n");
                    //获取当前提供定位服务的卫星个数
                    sb += "\"satellites\":" + "\""+location.getSatellites()+"\"" + ",";//sb.append("星    数    : " + location.getSatellites() + "\n");
                    sb += "\"country\":" + "\""+location.getCountry()+"\"" + ",";//sb.append("国    家    : " + location.getCountry() + "\n");
                    sb += "\"province\":" + "\""+location.getProvince()+"\"" + ",";//sb.append("省            : " + location.getProvince() + "\n");
                    sb += "\"city\":" + "\""+location.getCity()+"\"" + ",";//sb.append("市            : " + location.getCity() + "\n");
                    sb += "\"cityCode\":" + "\""+location.getCityCode()+"\"" + ",";//sb.append("城市编码 : " + location.getCityCode() + "\n");
                    sb += "\"district\":" + "\""+location.getDistrict()+"\"" + ",";//sb.append("区            : " + location.getDistrict() + "\n");
                    sb += "\"adCode\":" + "\""+location.getAdCode()+"\"" + ",";//sb.append("区域 码   : " + location.getAdCode() + "\n");
                    sb += "\"address\":" + "\""+location.getAddress()+"\"" + ",";//sb.append("地    址    : " + location.getAddress() + "\n");
                    sb += "\"poiName\":" + "\""+location.getPoiName()+"\"" + ",";//sb.append("兴趣点    : " + location.getPoiName() + "\n");
                    //定位完成的时间
                    //sb.append("定位时间: " + formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss") + "\n");
                    sb += "\"resTime\":" + "\""+formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss")+"\"";//

                    sb += "},";
				} else {
                    RunJS_Log("定位失败");

                    // 结果
                    sb += "\"res\":{";
                    sb += "\"success\":" + "\"false\"" + ",";
                    sb += "\"code\":" + "\""+location.getErrorCode()+"\"" + ",";//sb.append("错误码:" + location.getErrorCode() + "\n");
                    sb += "\"desc\":" + "\"定位失败\"" + ",";
                    sb += "\"errorInfo\":" + "\""+location.getErrorInfo()+"\"" + ",";//sb.append("错误信息:" + location.getErrorInfo() + "\n");
                    sb += "\"detail\":" + "\""+location.getLocationDetail()+"\"";//sb.append("错误描述:" + location.getLocationDetail() + "\n");
                    sb += "},";
				}

                RunJS_Log("定位质量报告");

                sb += "\"report\":{";
                //sb.append("* WIFI开关：").append(location.getLocationQualityReport().isWifiAble() ? "开启":"关闭").append("\n");
                sb += "\"wifi\":" + "\""+(location.getLocationQualityReport().isWifiAble() ? "true":"false")+"\"" + ",";
                //sb.append("* GPS状态：").append(getGPSStatusString(location.getLocationQualityReport().getGPSStatus())).append("\n");
                sb += "\"GPSStatus\":" + "\""+getGPSStatusString(location.getLocationQualityReport().getGPSStatus())+"\"" + ",";
                //sb.append("* GPS星数：").append(location.getLocationQualityReport().getGPSSatellites()).append("\n");
                sb += "\"GPSSatellites\":" + "\""+location.getLocationQualityReport().getGPSSatellites()+"\"" + ",";
                //sb.append("* 网络类型：" + location.getLocationQualityReport().getNetworkType()).append("\n");
                sb += "\"networkType\":" + "\""+location.getLocationQualityReport().getNetworkType()+"\"" + ",";
                //sb.append("* 网络耗时：" + location.getLocationQualityReport().getNetUseTime()).append("\n");
                sb += "\"netUseTime\":" + "\""+location.getLocationQualityReport().getNetUseTime()+"\"";
                sb += "},";

                //定位之后的回调时间 sb.append("回调时间: " + formatUTC(System.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss") + "\n");
                sb += "\"currentTime\":" + "\""+formatUTC(System.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss")+"\"";
			} else {
                RunJS_Log("定位失败，null == location");

                // 结果
                sb += "\"res\":{";
                sb += "\"success\":" + "\"false\"" + ",";
                sb += "\"code\":" + "\""+"null"+"\"" + ",";
                sb += "\"desc\":" + "\"定位失败, location is null\"";
                sb += "}";
			}

            sb += "}";
        */}

        {/*
            NSString *res = @"{";
            
            res = [NSString stringWithFormat:@"%@\\\"platform\":\"ios\",", res];

            if (error != nil && error.code == AMapLocationErrorLocateFailed)
            {
                //定位错误：此时location和regeocode没有返回值，不进行annotation的添加
                //NSLog(@"定位错误:{%ld - %@};", (long)error.code, error.localizedDescription);
                res = [NSString stringWithFormat:@"%@\"res\":{", res];
                res = [NSString stringWithFormat:@"%@\"success\":\"false\",", res];
                res = [NSString stringWithFormat:@"%@\"desc\":\"定位失败\",", res];
                res = [NSString stringWithFormat:@"%@\"code\":\"%ld\",", res, (long)error.code];
                res = [NSString stringWithFormat:@"%@\"detail\":\"%@\",", res, error.localizedDescription];
                res = [NSString stringWithFormat:@"%@\"errorInfo\":\"定位错误：此时location和regeocode没有返回值\"", res];
                res = [NSString stringWithFormat:@"%@}", res];
            }
            else if (error != nil && error.code == AMapLocationErrorRiskOfFakeLocation)
            {
                //存在虚拟定位的风险：此时location和regeocode没有返回值，不进行annotation的添加
                //NSLog(@"存在虚拟定位的风险:{%ld - %@};", (long)error.code, error.localizedDescription);
                res = [NSString stringWithFormat:@"%@\"res\":{", res];
                res = [NSString stringWithFormat:@"%@\"success\":\"false\",", res];
                res = [NSString stringWithFormat:@"%@\"desc\":\"定位失败\",", res];
                res = [NSString stringWithFormat:@"%@\"code\":\"%ld\",", res, (long)error.code];
                res = [NSString stringWithFormat:@"%@\"detail\":\"%@\",", res, error.localizedDescription];
                res = [NSString stringWithFormat:@"%@\"errorInfo\":\"存在虚拟定位的风险：此时location和regeocode没有返回值\"", res];
                res = [NSString stringWithFormat:@"%@}", res];
            }
            else
            {
                if (error != nil && 
                            (error.code == AMapLocationErrorReGeocodeFailed
                            || error.code == AMapLocationErrorTimeOut
                            || error.code == AMapLocationErrorCannotFindHost
                            || error.code == AMapLocationErrorBadURL
                            || error.code == AMapLocationErrorNotConnectedToInternet
                            || error.code == AMapLocationErrorCannotConnectToHost))
                {
                    //逆地理错误：在带逆地理的单次定位中，逆地理过程可能发生错误，此时location有返回值，regeocode无返回值，进行annotation的添加
                    //NSLog(@"逆地理错误:{%ld - %@};", (long)error.code, error.localizedDescription);
                    res = [NSString stringWithFormat:@"%@\"res\":{", res];
                    res = [NSString stringWithFormat:@"%@\"success\":\"waring\",", res];
                    res = [NSString stringWithFormat:@"%@\"desc\":\"定位警告\",", res];
                    res = [NSString stringWithFormat:@"%@\"code\":\"%ld\",", res, (long)error.code];
                    res = [NSString stringWithFormat:@"%@\"detail\":\"%@\",", res, error.localizedDescription];
                    res = [NSString stringWithFormat:@"%@\"errorInfo\":\"逆地理错误：在带逆地理的单次定位中，逆地理过程可能发生错误，此时location有返回值，regeocode无返回值\"", res];
                    res = [NSString stringWithFormat:@"%@},", res];
                } else {
                    //没有错误：location有返回值，regeocode是否有返回值取决于是否进行逆地理操作，进行annotation的添加
                    res = [NSString stringWithFormat:@"%@\"res\":{", res];
                    res = [NSString stringWithFormat:@"%@\"success\":\"true\",", res];
                    res = [NSString stringWithFormat:@"%@\"desc\":\"定位成功\",", res];
                    res = [NSString stringWithFormat:@"%@\"code\":\"nil\",", res];
                    res = [NSString stringWithFormat:@"%@\"detail\":\"没有错误：location有返回值，regeocode是否有返回值取决于是否进行逆地理操作\"", res];
                    res = [NSString stringWithFormat:@"%@},", res];
                }

                
                //res = [NSString stringWithFormat:@"%@;location:latitude-%f,longitude-%f,accuracy-%.2fm", res, location.coordinate.latitude, location.coordinate.longitude, location.horizontalAccuracy];
                
                res = [NSString stringWithFormat:@"%@\"info\":{", res];
                
                //location
                res = [NSString stringWithFormat:@"%@\"longitude\":\"%f\",", res, location.coordinate.longitude];
                res = [NSString stringWithFormat:@"%@\"latitude\":\"%f\",", res, location.coordinate.latitude];
                res = [NSString stringWithFormat:@"%@\"altitude\":\"%f\",", res, location.altitude];
                res = [NSString stringWithFormat:@"%@\"horizontalAccuracy\":\"%f\",", res, location.horizontalAccuracy];
                res = [NSString stringWithFormat:@"%@\"verticalAccuracy\":\"%f\",", res, location.verticalAccuracy];

                if (iosVer >= 2.2) {
                    res = [NSString stringWithFormat:@"%@\"course\":\"%f\",", res, location.course];
                    if (iosVer >= 13.4) {
                        res = [NSString stringWithFormat:@"%@\"courseAccuracy\":\"%f\",", res, location.courseAccuracy];
                    }
                }
                if (iosVer >= 2.2) {
                    res = [NSString stringWithFormat:@"%@\"speed\":\"%f\",", res, location.speed];
                    if (iosVer >= 10.0) {
                        res = [NSString stringWithFormat:@"%@\"speedAccuracy\":\"%f\",", res, location.speedAccuracy];
                    }
                }
                
                NSDateFormatter *formatter = [[NSDateFormatter alloc] init]; //如果没有规定formatter的时区，那么formatter默认的就是当前时区，比如现在在北京就是东八区，在东京就是东九区
                [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss Z"]; //最结尾的Z表示的是时区，零时区表示+0000，东八区表示+0800
                NSString *dateStr = [formatter stringFromDate:location.timestamp]; // 使用formatter转换后的date字符串变成了当前时区的时间 2018-05-31 14:43:07 +080
                res = [NSString stringWithFormat:@"%@\"resTime\":\"%@\",", res, dateStr]; //NSLog(@"字符串时间 = %@", dateStr);
                
                //regeocode
                if (regeocode)
                {
                    res = [NSString stringWithFormat:@"%@\"country\":\"%@\",", res, regeocode.country];
                    res = [NSString stringWithFormat:@"%@\"province\":\"%@\",", res, regeocode.province];
                    res = [NSString stringWithFormat:@"%@\"city\":\"%@\",", res, regeocode.city];
                    res = [NSString stringWithFormat:@"%@\"cityCode\":\"%@\",", res, regeocode.citycode];
                    res = [NSString stringWithFormat:@"%@\"district\":\"%@\",", res, regeocode.district];
                    res = [NSString stringWithFormat:@"%@\"adCode\":\"%@\",", res, regeocode.adcode];
                    res = [NSString stringWithFormat:@"%@\"adCode\":\"%@\",", res, regeocode.adcode];
                    res = [NSString stringWithFormat:@"%@\"address\":\"%@\",", res, regeocode.formattedAddress];
                    res = [NSString stringWithFormat:@"%@\"street\":\"%@\",", res, regeocode.street];
                    res = [NSString stringWithFormat:@"%@\"number\":\"%@\",", res, regeocode.number];
                    
                    if(regeocode.township){
                        res = [NSString stringWithFormat:@"%@\"township\":\"%@\",", res, regeocode.township];
                    }
                    if(regeocode.neighborhood){
                        res = [NSString stringWithFormat:@"%@\"township\":\"%@\",", res, regeocode.neighborhood];
                    }
                    if(regeocode.building){
                        res = [NSString stringWithFormat:@"%@\"township\":\"%@\",", res, regeocode.building];
                    }
                    
                    res = [NSString stringWithFormat:@"%@\"poiName\":\"%@\",", res, regeocode.POIName];
                    res = [NSString stringWithFormat:@"%@\"aoiName\":\"%@\"", res, regeocode.AOIName];
                }
                
                res = [NSString stringWithFormat:@"%@}", res];
            }
            
            res = [NSString stringWithFormat:@"%@}", res];
        */}

        {/*
            // 检测定位界面
            + (void)checkLocation
            {
                NSString *ifo = @"";
                s_locPrem = 0;
                
                //定位服务是否可用
                BOOL enable=[CLLocationManager locationServicesEnabled];
                if (enable) {
                    ifo = @"locationOpend";
                } else {
                    ifo = @"locationClosed";
                    s_locPrem = 1;
                }
                
                //是否具有定位权限
                int status=[CLLocationManager authorizationStatus];
                if (status==0) {
                    ifo = [NSString stringWithFormat:@"%@;0-kCLAuthorizationStatusNotDetermined", ifo];
                } else if (status==1) {
                    ifo = [NSString stringWithFormat:@"%@;1-kCLAuthorizationStatusRestricted", ifo];
                } else if (status==2) {
                    ifo = [NSString stringWithFormat:@"%@;2-kCLAuthorizationStatusDenied", ifo];
                } else if (status==3) {
                    ifo = [NSString stringWithFormat:@"%@;3-kCLAuthorizationStatusAuthorizedAlways_ios(8.0)", ifo];
                } else if (status==4) {
                    ifo = [NSString stringWithFormat:@"%@;4-kCLAuthorizationStatusAuthorizedWhenInUse_ios(8.0)", ifo];
                } else if (status==5) {
                    ifo = [NSString stringWithFormat:@"%@;5-kCLAuthorizationStatusAuthorized_ios(2.0, 8.0))", ifo];
                } else {
                    ifo = [NSString stringWithFormat:@"%@;%d-status", ifo, status];
                }
                
                [AppController ccJSRes:ifo];
                
                // 优先处理没开gps服务
                if (s_locPrem<=0 && status<3) {
                    s_locPrem = 2;
                }
                
                if (s_locPrem > 0) {
                    [AppController openLocation];
                }
            }
        */}
    },

    convertRuleToString: function (ri) {
        // cc.log(this.dbgstr('initView2'));

        let list = [];

        // let ri = cc.g.hallMgr.curGameMgr.roomInfo;
        cc.log('roomInfo', ri);
        //
        // let s = ''//ri.clubId ? '茶馆房' : '普通房';
        // list.push(s);

        //des += ', '+ cc.g.areaInfo[ri.origin].name
        let playNum = ri.playNum

        // if ((ri.gameType == GMID.PDKNJ) || (ri.gameType == GMID.PDK)) {
            // deskName = '内江跑得快';
            // 跑得快 人数范围
            // 37	2~4
            // 38	2~4
            // 39	2~7
            // 40	2~7
            // 41	2
            // 42	2~3
            // 43	2~4
            if (playNum > 20) {
                if (playNum == 37 || playNum == 38 || playNum == 43) {
                    playNum = 4;
                } else if (playNum == 39 || playNum == 40) {
                    playNum = 7;
                } else if (playNum == 41) {
                    playNum = 2;
                } else if (playNum == 42) {
                    playNum = 3;
                } else if (playNum == 44) {
                    playNum = 3;
                } else if (playNum == 45) {
                    playNum = 4;
                } else {
                    playNum = 4;
                }
            }
        // }

        let s = playNum +'人,' + ri.gameNum + '局';
        // s = ri.total +'人,' + ri.GameNum + '局';
        list.push(s);

        // 宜宾麻将
        // if (ri.gameType == 12 || ri.gameType == 4 || ri.gameType == 10) {
        //     if (ri.base === 2) {
        //         s = '底分2分';
        //     } else {
        //         s = '底分1分';
        //     }
        // } else {
        //     s = `底分${ri.base}分`;
        // }

        // 乐山地区不显示房费类型、大赢家设置 20 21 22
        let isls = (ri.gameType==20 || ri.gameType==21 || ri.gameType==22);
        
        if (ri.gameType != 11) {
            s = `底分${cc.g.utils.realNum1(ri.base)}分`;
            list.push(s);
        }
        


        let rules = cc.g.gmRuleInfo[ri.gameType];
        if (rules) {
            let ks3 = 0;//PDK 第三个颗数

            // "32,冠军房费","33,均摊房费","34,房主房费","35,俱乐部房费"
            // cmo.v['32'] = '冠军房费';//'冠军房费';
            // cmo.v['33'] = '均摊房费';//'冠军房费';
            // cmo.v['35'] = '茶馆房费';//'冠军房费';

            ri.rule.forEach(e => {
                if (rules[e]) {
                    if (ri.gameType==GMID.PDK && (e=='4' || e=='5' || e=='6')) {
                        s = rules[e];
                        ks3 = rules[e].split('/')[2];
                    } else if (ri.gameType==GMID.PDK && e=='13') {
                        s = ks3 + '分';
                    } else if (e=='32' && ri.clubId) {
                        if (!isls) {
                            s = '冠军房费';
                        } else return;
                    } else if (e=='33' && ri.clubId) {
                        if (!isls) {
                            s = '均摊房费';
                        } else return;
                    } else if (e=='35' && ri.clubId) {
                        if (!isls) {
                            s = '圈主房费';
                        } else return;
                    } else if (ri.gameType==GMID.NYMJ && e=='6') { // // 6,加倍|
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                            if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                                let addBeiStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addBeiStrip)
                                s = '小于'+addBeiStrip+'分'+', 加倍';
                            }
                        }
                    } else if (ri.gameType==GMID.NYMJ && e=='15') { //  // // 15,低于|
                        if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing)) {
                            if (!cc.g.utils.judgeObjectEmpty(ri.expendSpeciThing.ningYuanSpeciRule)) {
                                let addFenStrip = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFenStrip)
                                let addFen = cc.g.utils.realNum1(ri.expendSpeciThing.ningYuanSpeciRule.addFen)
                                s = '低于' + addFenStrip+'分加'+ addFen + '分';     
                            }
                        }
                    } else {
                        s = rules[e];
                    }

                    list.push(s);

                } else {
                    cc.error('错误规则ID', e);
                }
            });
        }


        {/*
            maxwinsco
            goldMatchRoomRule: Message
            consumeGold: 0
            disbandGold: 1
            exitType: 1
            joinGold: 1

            lotteryType: 3
            winnerRuleList: Array(2)
                0: Message
                consumeGold: 1
                maxScore: 3
                minScore: 1

                大赢家 5
                >5 可加入牌桌
                <5 解散牌桌/继续游戏
                不抽奖
                所有人抽奖 5
                大赢家抽奖
                1~10 1积分
                1~10 1积分
                ...
                1~10 1积分

        */}

        if (ri.winnerScore > 0) {
            list.push(`大赢家 ${cc.g.utils.realNum1(ri.winnerScore)}`);
        }

        if (ri.goldMatchRule) {
            let d = ri.goldMatchRule;
            list.push(`>${cc.g.utils.realNum1(d.joinGold)} 可加入牌桌`);
            list.push(`<${cc.g.utils.realNum1(d.disbandGold)} ${d.exitType==1 ? '解散牌桌' : '继续游戏'}`);

            if (false && !isls) {
                if (d.lotteryType==1) {
                    list.push(`不抽奖`);
                } else if (d.lotteryType==2) {
                    list.push(`所有人抽奖 ${cc.g.utils.realNum1(d.consumeGold)}`);
                } else if (d.lotteryType==3) {
                    list.push(`大赢家抽奖`);
    
                    d.winnerRuleList.forEach(e => {
                        list.push(`${cc.g.utils.realNum1(e.minScore)}~${cc.g.utils.realNum1(e.maxScore)} ${cc.g.utils.realNum1(e.consumeGold)}积分`);
                    });
                }
            }
        }

        return list;
    },
});
