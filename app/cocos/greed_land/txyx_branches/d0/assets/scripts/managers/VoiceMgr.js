
let YM = null;

{/*
let AppKey = 'YOUME7620F4A47DEBEC27EC01019E01FE73C8F8503BB1';
let AppSecret = '44HHM78tjvHIuQxbzY4FzMUaot367GwL42DTD3ls0iyjI3UmFL0RNlUBlr6YALMma5lYn9PVXTPxC30TKB240Loi+H5adlFKEkB6f75qxkcDWuI892FEEo5Nc4NpBvKbBq0plQFGLKysL3JxnZuKq8067c9FEskv/xa+eR21bvcBAAE=';
let ApiKey ='9eb8e669106e34bfd25ef3f16b6853b0';
*/}


let AppKey = 'YOUME4F5DE36FC12E929E31DAA66A9D37729A98DBDB73';
let AppSecret = 'weaaiVTuNLOtp/IAZbFgIelsIJg6F7YQ83cpnMknfLWVQIq+jBdVltvl1mHcGkTiNMzM/xlErWcypZ+MroGHm17QpJIsJREK2Ej83mCYGkKMNoDEtNwrnCWpnbO9X2Q/sYAqboRbWR3/clncSUsdVsalVRmOsBLJAWktFVdDKl8BAAE=';
let ApiKey = 'a1aae2a12d16a535ac25cadee7928f43';

let ErrStr = {
    0:'成功',
    1:'IM SDK未初始化',
    2:'IM SDK未登录',
    3:'无效的参数',
    4:'超时',
    5:'状态错误',
    6:'Appkey无效',
    7:'已经登录',
    1001:'登录无效',
    8:'服务器错误',
    9:'网络错误',
    10:'登录状态出错',
    11:'SDK未启动',
    12:'文件不存在',
    13:'文件发送出错',
    14:'文件上传失败，上传失败',
    15:'用户名密码错误',
    16:'用户状态为无效用户',
    17:'消息太长',
    18:'接收方ID过长（检查频道名）',
    19:'无效聊天类型',
    20:'无效用户ID',
    21:'未知错误',
    22:'AppKey无效',
    23:'被禁止发言',
    24:'创建文件失败',
    25:'支持的文件格式',
    26:'接收方为空',
    27:'房间名太长',
    28:'聊天内容严重非法',
    29:'未打开定位权限',
    30:'未知位置',
    31:'不支持该接口',
    32:'无音频设备',
    33:'音频驱动问题',
    34:'设备状态错误',
    35:'文件解析错误',
    36:'文件读写错误',
    37:'语言编码错误',
    38:'翻译接口不可用',
    39:'语音识别方言无效',
    40:'语音识别语言无效',
    41:'消息含非法字符',
    42:'消息涉嫌广告',
    43:'用户已经被屏蔽',
    44:'用户未被屏蔽',
    45:'消息被屏蔽',
    46:'定位超时',
    47:'未加入该房间',
    48:'登录token错误',
    49:'创建目录失败',
    50:'初始化失败',
    51:'与服务器断开',
    52:'设置参数相同',
    53:'查询用户信息失败',
    54:'设置用户信息失败',
    55:'更新用户在线状态失败',
    56:'昵称太长(>64 bytes)',
    57:'个性签名太长(>120 bytes)',
    58:'需要好友验证信息',
    59:'添加好友被拒绝',
    60:'未注册用户信息',
    61:'已经是好友',
    62:'非好友',
    63:'不在黑名单中',
    64:'头像url过长(>500 bytes)',
    65:'头像太大（>100 kb）',
    66:'达到频道人数上限',
    2000:'开始录音',
    2001:'录音',
}

let CacheDir = '';

let playObj = {};

let voiceCB = null;

let ymID = null;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    /*
        初始化SDK
        初始化的函数主要功能是初始化IM SDK引擎。
        初始化接口的输入参数strAppKey和strAppSecret需要根据实际申请得到的值进行替换, strPackageName目前传入空字符串即可。

        接口示例：
        var errorcode = youmeim.IM_Init("strAppKey","strAppSecret")

        参数： 
        strAppKey：用户游戏产品区别于其它游戏产品的标识，可以在游密官网获取、查看 
        strAppSecret：用户游戏产品的密钥，可以在游密官网获取、查看

        返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
    */
    init () {
        YM = null;
        if (window.YouMeIM) {
            YM = new YouMeIM;
        }

        if (!YM) {
            this.isOpen = false;
            cc.error('YouMeIM 语音SDK 初始化失败 无YouMeIM类');
            return;
        }

        cc.log('AppKey', AppKey);
        cc.log('AppSecret', AppSecret);
        cc.log('ApiKey', ApiKey);
        
        let ec = YM.IM_Init(AppKey, AppSecret);
        cc.log(`IM_Init ${ec}:${ErrStr[ec]}`);

        this.initSetting();
        this.initCallBack();
    },

    initSetting () {
        playObj = {};

        if (jsb.fileUtils) {
            CacheDir = jsb.fileUtils.getWritablePath() + 'voiceCache';
            if (!jsb.fileUtils.isDirectoryExist(CacheDir)) {
                jsb.fileUtils.createDirectory(CacheDir);
            }   
        } else {
            CacheDir = YM.IM_GetAudioCachePath();
        }
        
        /*
        设置录音缓存目录
        设置录音时用于保存录音文件的缓存目录，如果没有设置，SDK会在APP默认缓存路径下创建一个文件夹用于保存音频文件。 
        该接口建议初始化之后立即调用 。
        参数： dir_path：缓存录音文件的文件夹路径，如果目录不存在，SDK会自动创建，字符串
        */
        let res = YM.IM_SetAudioCacheDir(CacheDir);
        cc.log('IM_SetAudioCacheDir res', res);

        //获取当前设置的录音缓存目录。 返回值： 返回当前设置的录音缓存目录的完整路径
        let Path = YM.IM_GetAudioCachePath();
        cc.log(`VoiceMgr CachePath:  ${Path}`);

        //清理语音缓存目录(注意清空语音缓存目录后历史记录中会无法读取到音频文件，调用清理历史记录接口也会自动删除对应的音频缓存文件)
        //返回值： res: 1-清理成功，0-清理失败
        res = YM.IM_ClearAudioCachePath();
        cc.log(`IM_ClearAudioCachePath 1-清理成功，0-清理失败 : ${res}`);


        //设置语音播放的音量大小。 参数： volume:音量值，取值范围0.0f - 1.0f，默认值为 1.0f。
        YM.IM_SetVolume(1.0);

        //IM_SetDownloadAudioMessageSwitch()在初始化之后，启动语音之前调用;
        //若设置了自动下载语音消息，不需再调用IM_DownloadAudioFile()接口，
        //收到语音消息时会自动下载，自动下载完成也会收到IM_DownloadAudioFile()接口对应的OnDownload()回调。
        //参数： download：true-自动下载语音消息，false-不自动下载语音消息(默认)
        //返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
        if (YM.IM_SetDownloadAudioMessageSwitch) {
            let ec = YM.IM_SetDownloadAudioMessageSwitch(false); 
            cc.log(`IM_SetDownloadAudioMessageSwitch ${ec}:${ErrStr[ec]}`);
        }
    },

    setVoiceStateCB (cb) {
        voiceCB = cb;
    },

    setOpen (isopen) {
        this.isOpen = isopen;
    },
    /* =========================================================================================================== */

    /*
        IM用户登录IM后台服务器后即可以正常收发消息。 
        登录接口需要用户提供用户名、密码。登录为异步过程，通过回调函数返回是否成功，成功后方能进行后续操作。
        用户首次登录会自动注册，自行设置登录用户名和登录密码，如果后台已存在此用户名，则会提示校验密码（用户名和密码的格式见下方相关参数说明）。

        参数说明： 
        userid：用户ID，由调用者分配，不可为空字符串，只可由字母或数字或下划线组成，长度限制为255字节 
        user_password：用户密码，不能为空，一般固定为"123456"即可 
        token：使用服务器token验证模式时使用该参数，否则使用空字符串：""，由restAPI获取token值

        返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    */
    login (id) {
        if (!YM) return;

        ymID = id;

        let ec = YM.IM_Login(`${id}`, "123456", "");
        cc.log(`IM_Login ${ec}:${ErrStr[ec]}`);
    },

    // 如用户主动退出或需要进行用户切换，则需要调用登出操作，登出接口为IM_Logout。
    // 返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    logout () {
        if (!YM) return;

        let ec = YM.IM_Logout()
        cc.log(`IM_Logout ${ec}:${ErrStr[ec]}`);
    },
    
    //通过IM_JoinChatRoom接口加入聊天频道，如果频道不存在则后台自动创建。有了这个ID就可以收发频道消息。
    //开发者要保证频道号全局唯一，以避免用户进入错误频道。
    //参数： room_id：请求加入的频道ID，仅支持数字、字母、下划线组成的字符串，区分大小写，长度限制为255字节
    //返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    joinChatRoom (id) {
        if (!YM) return;

        let ec = YM.IM_JoinChatRoom(`${id}`);
        cc.log(`IM_JoinChatRoom ${ec}:${ErrStr[ec]}`);
    },

    //通过IM_LeaveChatRoom接口离开频道。
    //参数： room_id：请求离开的频道ID，字符串
    //返回值： errorcode：0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    leaveChatRoom (id) {
        if (!YM) return;

        if (id) {
            let ec = YM.IM_LeaveChatRoom(`${id}`);
            cc.log(`IM_LeaveChatRoom ${ec}:${ErrStr[ec]}`);
        } else {
            cc.error(`leaveChatRoom NO  room_id：请求离开的频道ID`); 
        }
    },
    
    //通过IM_LeaveAllChatRooms接口离开所有已进入的频道。
    //返回值： errorcode：0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    leaveAllChatRooms () {
        if (!YM) return;

        if (YM.IM_LeaveAllChatRooms) {
            let ec = YM.IM_LeaveAllChatRooms();
            cc.log(`IM_LeaveAllChatRooms ${ec}:${ErrStr[ec]}`);
        } else {
            cc.warn(`NO IM_LeaveAllChatRooms === USE IM_LeaveChatRoom`);
            this.leaveChatRoom(this.curChannelID);
        }
    },


    //启动录音 
    //调用IM_SendAudioMessage语音发送接口（该接口支持语音转文字，若不需要转文字建议使用 IM_SendOnlyAudioMessage ）就开始录音，
    //调用IM_StopAudioMessage后自动停止录音并发送。调用IM_CancleAudioMessage取消本次消息发送。
    //
    // ========== 带文字识别的录音接口 ============
    //var requestID = youmeim.IM_SendAudioMessage(reciver_id,chatType)
    // ========== 不带文字识别的录音接口 ============
    //var requestID = youmeim.IM_SendOnlyAudioMessage(reciver_id,chatType)
    //
    //注意：语音消息最大的时长是1分钟（超过1分钟就自动发出去）
    //参数： reciver_id：接收者ID，私聊传入userid，频道聊天传入roomid，字符串 chatType：整型，1表示私聊，2表示频道聊天
    //返回值： requestid：消息序列号,字符串类型（实际是长整型数字），-1表示调用失败，失败后不会有回调通知
    beginVoice () {
        if (!YM) return;

        if (!this.curChannelID) {
            cc.warn(`beginVoice 没有频道ID 跳过`);
            return;
        }

        let  id = this.curChannelID;
        cc.log(`beginVoice rmid ${id}`);
        
        let ec = YM.IM_SendOnlyAudioMessage(id, 2);
        cc.log(`beginVoice ${ec}:${ErrStr[ec]}`);
    },
    
    //结束录音并发送
    //参数： extra_param：给语音消息附加自定义参数，比如json字符串，可为空字符串
    //返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    //异步回调接口： 结束录音并发送接口对应两个回调接口，若语音成功发送出去能得到两个回调通知，语音发送失败则只会得到发送语音结果回调。
    //OnStartSendAudioMessage  OnSendAudioMessageStatus 
    endVoice () {
        if (!YM) return;

        if (!this.curChannelID) {
            cc.warn(`endVoice 没有频道ID 跳过`);
            return;
        }

        let ec = YM.IM_StopAudioMessage('');
        cc.log(`endVoice ${ec}:${ErrStr[ec]}`);
    },

    //取消本次录音 返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
    cancleVoice () {
        if (!YM) return;

        let ec = YM.IM_CancleAudioMessage()
        cc.log(`cancleVoice ${ec}:${ErrStr[ec]}`);
    },
    
    //停止语音播放 返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
    stopVoice () {
        if (!YM) return;

        let ec = YM.IM_StopPlayAudio()
        cc.log(`stopVoice ${ec}:${ErrStr[ec]}`);
    },
    
    //查询当前音频播放器的状态。 返回值： res: 1-正在播放，0-没有在播放
    isPlaying () {
        if (!YM) return;

        let res = YM.IM_IsPlaying();
        return res==1;
    },

    //游戏暂停通知
    //建议游戏放入后台时通知该接口，以便于得到更好重连效果。 
    //调用OnPause(false),在游戏暂停后,若IM是登录状态，依旧接收IM消息； 
    //调用OnPause(true),游戏暂停，即使IM是登录状态也不会接收IM消息；
    //在游戏恢复运行时会主动拉取暂停期间未接收的消息，收到OnRecvMessage()回调。
    //参数： pauseReceiveMessage：是否暂停接收IM消息，true-暂停接收，false-不暂停接收
    pause () {
        if (!YM) return;

        YM.IM_OnPause(false);
    },

    // 游戏恢复运行通知 建议游戏从后台激活到前台时通知该接口，以便于得到更好重连效果。
    resume () {
        if (!YM) return;

        YM.IM_OnResume();
    },
    /* =========================================================================================================== */



    
    /* =========================================================================================================== */

    // 设置监听 初始化之后需要立即设置回调处理方法。SDK内部所有的较长耗时的接口调用都会采用异步回调的方式返回结果，所以需要开发者实现:
    initCallBack () {

        //录音音量回调
        YM.OnRecordVolume=function(volume) {
            cc.log("YM==>OnRecordVolume 录音音量回调 " + volume);
        }

        //登录登出回掉
        YM.OnLogin = (errorcode, youmeID)=>this.OnLogin(errorcode, youmeID);
        YM.OnLogout = ()=>this.OnLogout();

        // 被用户踢出通知 同一个用户ID在多台设备上登录时，后登录的会把先登录的踢下线，收到OnKickOff通知。
        YM.OnKickOff = function() {
            cc.log("YM==>OnKickOff 被用户踢出通知 ");
        }

        //进入聊天频道的通知
        YM.OnJoinChatroom = (errorcode,groupid)=>this.OnJoinChatroom(errorcode,groupid);
        // 离开聊天室通知
        YM.OnLeaveChatroom = (errorcode,groupid)=>this.OnLeaveChatroom(errorcode,groupid);
        // 离开所有频道
        YM.OnLeaveAllChatRooms = function(errorcode){
            cc.log("YM==>OnLeaveAllChatRooms 离开所有频道 errorcode" + errorcode);
        }

        // 用户进入房间回调
        YM.OnUserJoinChatRoom = (channelID, userID)=>this.OnUserJoinChatRoom(channelID, userID);
        // 用户退出房间回调
        YM.OnUserLeaveChatRoom = (channelID, userID)=>this.OnUserLeaveChatRoom(channelID, userID);
     
        //下载语音文件回调
        YM.OnDownload = (errorcode,strSavepath,bodytype,chattype,serial,recvid,senderid,content,params,duration,createtime)=>{
            this.OnDownload({
                errorcode:errorcode, 
                strSavepath:strSavepath, 
                bodytype:bodytype, 
                chattype:chattype, 
                serial:serial, 
                recvid:recvid, 
                senderid:senderid, 
                content:content, 
                params:params, 
                duration:duration, 
                createtime:createtime, 
            });
        }
        //从URL下载文件回调
        YM.OnDownloadByUrl = (errorcode , fromUrl, savePath)=>this.OnDownloadByUrl(errorcode , fromUrl, savePath);

        //文本和自定义消息发送状态回掉
        YM.OnSendMessageStatus = (serial, errorcode, sendTime, isForbidRoom, reasonType, endTime) => {
            this.OnSendMessageStatus({
                serial:serial,
                errorcode:errorcode,
                sendTime:sendTime,
                isForbidRoom:isForbidRoom,
                reasonType:reasonType,
                endTime:endTime,
            });
        }

        //自己的语音开始上传回调
        YM.OnStartSendAudioMessage = (serial,errorcode,content,localpath,duration) => {
            this.OnStartSendAudioMessage({
                serial:serial,
                errorcode:errorcode,
                content:content,
                localpath:localpath,
                duration:duration,
            });
        }
        //自己的语音消息发送状态回调
        YM.OnSendAudioMessageStatus = (serial,errorcode,content,localpath,duration, sendTime, isForbidRoom, reasonType, endTime)=>{
            this.OnSendAudioMessageStatus({
                serial:serial,
                errorcode:errorcode,
                content:content,
                localpath:localpath,
                duration:duration,
                sendTime:sendTime,
                isForbidRoom:isForbidRoom,
                reasonType:reasonType,
                endTime:endTime,
            });
        }

        //接收到他人的消息回调
        YM.OnRecvMessage = (bodytype,chattype,serial,recvid,senderid,content,params,duration)=>{
            this.OnRecvMessage({
                bodytype:bodytype,
                chattype:chattype,
                serial:serial,
                recvid:recvid,
                senderid:senderid,
                content:content,
                params:params,
                duration:duration,
            });
        }
        // 收到新消息的通知
        YM.OnRecvMessageNotify = (chattype, targetID)=>this.OnRecvMessageNotify(chattype, targetID);

        // 获取录音文件地址的通知
        YM.OnAudioSpeech = (serial,errorcode,strDownloadURL,iDuration,iFileSize,strLocalPath,strText)=>{
            this.OnAudioSpeech({
                serial:serial,
                errorcode:errorcode,
                strDownloadURL:strDownloadURL,
                iDuration:iDuration,
                iFileSize:iFileSize,
                strLocalPath:strLocalPath,
                strText:strText,
            });
        }

        //播放结束
        YM.OnPlayCompletion = (errorcode, path)=>this.OnPlayCompletion(errorcode, path);

        // 最近联系人查询结果通知
        YM.OnGetContactList = function(errorcode,contactLists) {
            for(let i=0;i<contactLists.length;i++) {
                cc.log("OnGetContactList " + contactLists[i])
            }
        }

        // 私聊消息历史记录查询通知
        YM.OnQueryHistoryMsg = function(targetID,remainCount,msgLists) {
            for(let i=0;i<msgLists.length;i++) {
                cc.log("OnQueryHistoryMsg： chattype：" + msgLists[i].ChatType + "Duration:" + msgLists[i].Duration + "|" + msgLists[i].MessageType + "|" +  msgLists[i].Param + "|" +  msgLists[i].ReceiveID + "|" +  msgLists[i].SenderID+  msgLists[i].Serial+  msgLists[i].Text + msgLists[i].LocalPath)
            }
        }

        //获取指定玩家信息回调
        YM.OnGetUserInfo = function( errorcode, jsonUserInfo ){
            cc.log("获得信息回调:%d", errorcode );
            let obj = JSON.parse( jsonUserInfo );
            // cc.log( obj.nickname );
            // cc.log( obj.server_area );
            // cc.log( obj.location );
            // cc.log( obj.level );
            // cc.log( obj.vip_level );
            // cc.log( obj.extra );
            cc.log('jsonUserInfo', obj);
        };

        //查询用户登录状态
        YM.OnQueryUserStatus = function (errorcode, userid, state) {
            cc.log( "查询用户登录状态, userid:" +userid +"_" + state );
            //通知有新消息，只有在手动接受消息的模式下才有用
        };


        // 文本翻译回调
        YM.OnTranslateTextComplete = function(errorcode, requestID, text, srcLangCode, destLangCode){
            cc.log( "OnTranslateTextComplete:"+ errorcode + ",requestID:" + requestID + ",text:" + text + ",srcLangCode" + srcLangCode + ",destLangCode" + destLangCode );
        };

        // 获取当前地理位置回调
        YM.OnUpdateLocation = function(districtCode, country, pronvice, city, districtCounty, street, longitude, latitude){
            cc.log( "OnUpdateLocation districtCode:" + districtCode + ",country:" + country + ",pronvice" + pronvice + ",city:" + city + ",longitude:" + longitude + ",latitude:" + latitude);
        };

        // 查找附近的人回调
        YM.OnGetNearbyObjects = function(errorcode, neighbourList, startDistance, endDistance){
            cc.log( "OnGetNearbyObjects errorcode:"+ errorcode + ",startDistance:" + startDistance + ",endDistance" + endDistance);
            for(let i=0;i<neighbourList.length;i++)
            {
                cc.log("Distance:" + neighbourList[i].Distance + " Longitude:" + neighbourList[i].Longitude +" Latitude:" + neighbourList[i].Latitude +" UserID:" + neighbourList[i].UserID +" Country:" + neighbourList[i].Country +" Province:" + neighbourList[i].Province +" City:" + neighbourList[i].City +" DistrictCounty:" + neighbourList[i].DistrictCounty)
            }
        };

        // 获取麦克风状态回调
        YM.OnGetMicrophoneStatus = (status)=>this.OnGetMicrophoneStatus(status);

        // 举报处理通知
        YM.OnAccusationResultNotify = function(result, userID, accusationTime){
            cc.log("OnAccusationResultNotify result:"+ result + " userID:" + userID + " accusationTime:" + accusationTime);
        };

        // 接收公告
        YM.OnRecvNotice = function(noticeID, channelID, noticeType, content, linkText, linkAddress, beginTime, endTime){
            cc.log("OnRecvNotice noticeID:"+ noticeID + " channelID:" + channelID + " noticeType:" + noticeType + " content:" + content + " beginTime:" + beginTime + " endTime:" + endTime);
        };

        // 撤销公告
        YM.OnCancelNotice = function(noticeID, channelID){
            cc.log("OnCancelNotice noticeID:"+ noticeID + " channelID:" + channelID);
        };

        // 开始重连回调
        YM.OnStartReconnect = ()=>this.OnStartReconnect();
        // 重连结果回调
        YM.OnRecvReconnectResult = (result)=>this.OnRecvReconnectResult(result);
    },



    // 获取麦克风状态回调 status：麦克风状态值，0-可用，1-无权限，2-静音，3-不可用
    OnGetMicrophoneStatus (status) {
        cc.log("YM==>OnGetMicrophoneStatus 获取麦克风状态回调 " + status);
        cc.log('0-可用，1-无权限，2-静音，3-不可用');
    },

    // 回调参数： errorcode：错误码 userid：用户ID
    OnLogin (errorcode, youmeID) {
        cc.log('YM==>OnLogin 登录 ' + "errorcode:" + errorcode + " youmeID:" + youmeID);
        ymID = youmeID;
    },
    //
    OnLogout () {
        cc.log("YM==>OnLogout 登出 ")
    },

    // 开始重连回调
    OnStartReconnect () {
        cc.log("YM==>OnStartReconnect 开始重连回调");
    },
    // 重连结果回调 result：重连结果，0-重连成功,1-重连失败，再次重连, 2-重连失败
    OnRecvReconnectResult (result) {
        cc.log("YM==>OnRecvReconnectResult 重连结果回调 "+ result);
        cc.log('0-重连成功,1-重连失败，再次重连, 2-重连失败');
    },

    // 进入聊天频道的通知 回调参数： errorcode：错误码 channelID：频道ID
    OnJoinChatroom (errorcode,groupid) {
        cc.log("YM==>OnJoinChatroom 进入聊天频道的通知 " + " errorcode:" + errorcode + " groupid:"+ groupid);

        playObj = {};
        this.curChannelID = groupid;
    },
    // 离开聊天室通知 回调参数： errorcode：错误码 channelID：频道ID
    OnLeaveChatroom (errorcode,groupid) {
        cc.log("YM==>OnLeaveChatroom 离开聊天室通知 " + " errorcode:" + errorcode + " groupid:"+ groupid);

        playObj = {};
        this.curChannelID = null;
    },
    // 用户进入房间回调 小频道(小于100人)内，当其他用户进入频道，会收到OnUserJoinChatRoom通知 官方后台可能默认关闭了该回调的通知
    // 参数： channelID：频道ID userID：用户ID
    OnUserJoinChatRoom (channelID, userID) {
        cc.log( "YM==>OnUserJoinChatRoom 用户进入房间回调 "+ " channelID:" + channelID + " userID:" + userID);
    },
    // 用户退出房间回调 小频道(小于100人)内，当其他用户退出频道，会收到OnUserLeaveChatRoom通知 官方后台可能默认关闭了该回调的通知
    // 参数： channelID：频道ID userID：用户ID
    OnUserLeaveChatRoom (channelID, userID) {
        cc.log( "YM==>OnUserLeaveChatRoom 用户退出房间回调 "+ " channelID:" + channelID + " userID:" + userID);
    },



    //文本和自定义消息发送状态回掉
    OnSendMessageStatus (arg) {
        cc.log("YM==>OnSendMessageStatus 文本和自定义消息发送状态回掉", arg);
    },


    //自己的语音开始上传回调
    /*
    开始上传语音回调，（调用IM_StopAudioMessage停止语音之后，成功发送语音消息之前），
    录音结束，开始发送录音的通知，这个时候已经可以拿到语音文件进行播放

    参数： 
        serial：消息序列号，用于校验一条消息发送成功与否的标识 
        errorcode：错误码，等于0才是操作成功。 
        content：语音转文字识别的文本内容，如果没有用带语音转文字的接口，该字段为空字符串 
        localpath：录音生成的wav文件的本地完整路径，比如"/sdcard/xxx/xxx.wav" 
        duration：录音时长（单位为秒）

        sendTime：发送时间 
        isForbidRoom：是否房间被禁言，1-房间被禁言，0-玩家被禁言（errorcode为禁言才有效） 
        reasonType：禁言原因，参见ForbidSpeakReason（errorcode为禁言才有效） 
        forbidEndTime：禁言截止时间戳（errorcode为禁言才有效）
    */
    OnStartSendAudioMessage (arg) {
        /*
        content: ""
        duration: 2
        errorcode: 0
        localpath: "/data/user/0/com.woyou.happygame/files/voiceCache/5b40336f-2f18-4b51-8945-8f600173f766.wav"
        serial: "1625731266353"
        */
        cc.log("YM==>OnStartSendAudioMessage 自己的语音开始上传回调", arg);
        
        if (!this.isOpen) {
            cc.log("YM==>语音设置关闭  不播放自己的语音");
            return;
        }

        let ec = YM.IM_StartPlayAudio(arg.localpath);
        cc.log(`IM_StartPlayAudio ${ec}:${ErrStr[ec]}`);

        voiceCB(ymID, 1, arg.duration);

        if(voiceCB) {
            playObj[arg.localpath] = {
                id:ymID,
            };
            //voiceCB(arg.senderid, 1);
        }
    },
    //自己的语音消息发送状态回调
    OnSendAudioMessageStatus (arg) {
        cc.log("YM==>OnSendAudioMessageStatus 自己的语音消息发送状态回调", arg);
    },
    // 获取录音文件地址的通知
    OnAudioSpeech (serial,errorcode,strDownloadURL,iDuration,iFileSize,strLocalPath,strText) {
        cc.log("YM==>OnAudioSpeech 获取录音文件地址的通知", arg);
    },

    //接收到他人的消息回调
    /*
        通过OnRecvMessage接口被动接收消息，需要开发者实现。

        参数： 
        bodyType： 消息类型，0-未知类型，1-文本消息，2-自定义消息，3-表情，4-图片，5-语音，6-视频，7-文件，8-礼物
        chatType：聊天类型，私聊/频道聊天 
        serial： 消息ID 
        recvID： 消息接收者ID 
        senderID： 消息发送者ID 
        content： 文本消息内容/自定义消息内容/语音识别出的文本 
        param：附加参数（语音消息，礼物消息，文本消息） 
        duration：语音时长（单位：秒） 
        createTime：消息发送时间 giftID：礼物ID 
        giftCount：礼物数量 
        anchorID：主播ID

        接收语音消息
        接收消息接口在OnRecvMessage回调，通过bodytype == 5分拣出语音消息，
        用serial来下载语音文件，调用函数IM_DownloadAudioFile下载语音消息，
        下载成功会通知OnDownload windows下，会对下载接口的保存路径参数的'/'转换为'\'；
        如果传入的保存路径参数不符合windows下的路径格式，下载回调中的保存路径可能和传入的保存路径不同

        参数： 
            serial：消息ID,数字字符串 
            save_path：指定文件保存路径(带文件名的全路径)，比如"/sdcard/cache/1.wav"，如果目录不存在，SDK会自动创建，字符串
        返回值： 
            errorcode: 0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    */
    OnRecvMessage (arg) {
        cc.log("YM==>OnRecvMessage 接收到他人的消息回调", arg);

        let bodytype = arg.bodytype;
        let serial = arg.serial;
        let senderID = arg.senderid;

        if(bodytype==1){
            cc.log("文本消息");
        } else if(bodytype==5){
            cc.log("语音消息");
            let name = senderID + '_' +serial + '.wav';
            let path = CacheDir + '/' + name;
            let ec = YM.IM_DownloadAudioFile(serial, path);
            cc.log(`IM_DownloadAudioFile ${ec}:${ErrStr[ec]} 'path':${path}`);
        } else {
            cc.log("不明消息");
        }
    },
    // 收到新消息的通知
    // 在手动接收消息模式，若设置了OnRecvNewMessage的监听，会通知新消息的数量。
    OnRecvMessageNotify (chattype, targetID) {
        cc.log("YM==>OnRecvMessageNotify 收到新消息的通知 " + 'chattype ' + chattype + " targetID " + targetID);
    },

    //下载语音文件回调
    /*
    回调参数： 
        errorcode：下载结果错误码 
        savePath：保存路径 
        bodyType：消息类型，0-未知类型，1-文本消息，2-自定义消息，3-表情，4-图片，5-语音，6-视频，7-文件，8-礼物 
        chatType：聊天类型，私聊/频道聊天 
        serial：消息ID 
        recvID：消息接收者ID 
        senderID：消息发送者ID 
        content：语音识别的文本内容 
        param：发送语音消息的附加信息 
        audioTime：语音时长（单位：秒） 
        createTime：消息发送时间

    参数： path：语音文件的绝对路径，字符串
    返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义
    */
    OnDownload (arg) {
        cc.log("YM==>OnDownload 下载语音文件回调", arg);

        if (arg.errorcode != 0) return;
        
        if (!this.isOpen) {
            cc.log("YM==>语音设置关闭  不播放已下载的语音");
            return;
        }
        
        let ec = YM.IM_StartPlayAudio(arg.strSavepath);
        cc.log(`IM_StartPlayAudio ${ec}:${ErrStr[ec]}`);

        voiceCB(arg.senderid, 1, arg.duration);

        if(voiceCB) {
            playObj[arg.strSavepath] = {
                id:arg.senderid,
            };
            //voiceCB(arg.senderid, 1);
        }
    },
    //从URL下载文件回调
    OnDownloadByUrl (errorcode , fromUrl, savePath) {
        cc.log("YM==>OnDownloadByUrl 从URL下载文件回调 " + fromUrl + " errorcode:" + errorcode + " path:" + savePath);
    },

    //播放结束 回调参数： errorcode：错误码 path：被播放的音频文件地址
    OnPlayCompletion (errorcode, path) {
        cc.log("YM==>OnPlayCompletion 播放结束 "+'path '+path + ' errorcode '+errorcode);

        if (playObj[path]) {
            //voiceCB(playObj[path].id, 0);
            delete playObj[path];
        }
    },
    
    /* =========================================================================================================== */
});


/*
语音消息管理
语音消息聊天简要流程：

调用IM的语音发送接口就开始录音，调用结束录音接口后自动停止录音并发送。
接收方接收语音消息通知后，调用方控制是否下载，调用下载接口就可以获取录音内容。
接收方接收语音消息通知后，调用方控制是否下载，调用下载接口就可以获取录音内容。然后开发者调用播放接口播放wav音频文件。

设置是否自动下载语音消息
IM_SetDownloadAudioMessageSwitch()在初始化之后，启动语音之前调用;若设置了自动下载语音消息，不需再调用IM_DownloadAudioFile()接口，收到语音消息时会自动下载，自动下载完成也会收到IM_DownloadAudioFile()接口对应的OnDownload()回调。

接口示例：

复制
  var errorcode = IM_SetDownloadAudioMessageSwitch(download);
参数： download：true-自动下载语音消息，false-不自动下载语音消息(默认)

返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义


发送语音消息
启动录音
调用IM_SendAudioMessage语音发送接口（该接口支持语音转文字，若不需要转文字建议使用IM_SendOnlyAudioMessage）就开始录音，调用IM_StopAudioMessage后自动停止录音并发送。调用IM_CancleAudioMessage取消本次消息发送。注意：语音消息最大的时长是1分钟（超过1分钟就自动发出去）

接口示例：

复制
  // ========== 带文字识别的录音接口 ============
  var requestID = youmeim.IM_SendAudioMessage(reciver_id,chatType)

  // ========== 不带文字识别的录音接口 ============
  var requestID = youmeim.IM_SendOnlyAudioMessage(reciver_id,chatType)
参数： reciver_id：接收者ID，私聊传入userid，频道聊天传入roomid，字符串 chatType：整型，1表示私聊，2表示频道聊天

返回值： requestid：消息序列号,字符串类型（实际是长整型数字），-1表示调用失败，失败后不会有回调通知。
结束录音并发送
接口示例：

复制
  var errorcode = youmeim.IM_StopAudioMessage(extra_param)
参数： extra_param：给语音消息附加自定义参数，比如json字符串，可为空字符串

返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义

异步回调接口： 结束录音并发送接口对应两个回调接口，若语音成功发送出去能得到两个回调通知，语音发送失败则只会得到发送语音结果回调。

复制
// 开始上传语音回调，（调用IM_StopAudioMessage停止语音之后，成功发送语音消息之前），录音结束，开始发送录音的通知，这个时候已经可以拿到语音文件进行播放
youmeim.OnStartSendAudioMessage = function(serial,errorcode,content,localpath,duration){}

// 发送语音结果回调，自己的语音消息发送成功或者失败的通知。
youmeim.OnSendAudioMessageStatus = function(serial, errorcode, content, localpath, duration, sendTime, isForbidRoom, reasonType, endTime){}
参数： serial：消息序列号，用于校验一条消息发送成功与否的标识 errorcode：错误码，等于0才是操作成功。 content：语音转文字识别的文本内容，如果没有用带语音转文字的接口，该字段为空字符串 localpath：录音生成的wav文件的本地完整路径，比如"/sdcard/xxx/xxx.wav" duration：录音时长（单位为秒）

sendTime：发送时间 isForbidRoom：是否房间被禁言，1-房间被禁言，0-玩家被禁言（errorcode为禁言才有效） reasonType：禁言原因，参见ForbidSpeakReason（errorcode为禁言才有效） forbidEndTime：禁言截止时间戳（errorcode为禁言才有效）

取消本次录音
接口示例：

复制
  var errorcode = youmeim.IM_CancleAudioMessage()
参数： 无。

返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
接收语音消息
接收消息接口在OnRecvMessage回调，通过bodytype == 5分拣出语音消息，用serial来下载语音文件，调用函数IM_DownloadAudioFile下载语音消息，下载成功会通知OnDownload windows下，会对下载接口的保存路径参数的'/'转换为'\'；如果传入的保存路径参数不符合windows下的路径格式，下载回调中的保存路径可能和传入的保存路径不同

接口示例：

复制
  var errorcode = youmeim.IM_DownloadAudioFile(serial,save_path)
参数： serial：消息ID,数字字符串 save_path：指定文件保存路径(带文件名的全路径)，比如"/sdcard/cache/1.wav"，如果目录不存在，SDK会自动创建，字符串

返回值： errorcode: 0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义

回调通知：

复制
youmeim.OnDownload = function(errorcode,savePath,bodyType,chatType,serial,recvID,senderID,content,param,audioTime,createTime) {}
回调参数： errorcode：下载结果错误码 savePath：保存路径 bodyType：消息类型，0-未知类型，1-文本消息，2-自定义消息，3-表情，4-图片，5-语音，6-视频，7-文件，8-礼物 chatType：聊天类型，私聊/频道聊天 serial：消息ID recvID：消息接收者ID senderID：消息发送者ID content：语音识别的文本内容 param：发送语音消息的附加信息 audioTime：语音时长（单位：秒） createTime：消息发送时间
语音播放
播放语音
接口示例：

复制
  var errorcode = youmeim.IM_StartPlayAudio( path)
参数： path：语音文件的绝对路径，字符串

返回值： errorcode:0为调用成功，非0表示调用失败，失败后不会有回调通知，详细描述见错误码定义

回调通知：

复制
//播放完成
youmeim.OnPlayCompletion = function ( errorcode, path) {}
回调参数： errorcode：错误码 path：被播放的音频文件地址
停止语音播放
接口示例：

复制
  var errorcode = youmeim.IM_StopPlayAudio()
返回值： errorcode:0为调用成功，非0表示调用失败，详细描述见错误码定义
设置语音播放音量
设置语音播放的音量大小。

接口示例：

复制
  youmeim.IM_SetVolume( volume )
参数： volume:音量值，取值范围0.0f - 1.0f，默认值为 1.0f。
查询播放状态
查询当前音频播放器的状态。

接口示例：

复制
  var res = youmeim.IM_IsPlaying()
返回值： res: 1-正在播放，0-没有在播放


*/




/*

错误码定义
错误码	含义
YIMErrorcode_Success = 0	成功
YIMErrorcode_EngineNotInit = 1	IM SDK未初始化
YIMErrorcode_NotLogin = 2	IM SDK未登录
YIMErrorcode_ParamInvalid = 3	无效的参数
YIMErrorcode_TimeOut = 4	超时
YIMErrorcode_StatusError = 5	状态错误
YIMErrorcode_SDKInvalid = 6	Appkey无效
YIMErrorcode_AlreadyLogin = 7	已经登录
YIMErrorcode_LoginInvalid = 1001	登录无效
YIMErrorcode_ServerError = 8	服务器错误
YIMErrorcode_NetError = 9	网络错误
YIMErrorcode_LoginSessionError = 10	登录状态出错
YIMErrorcode_NotStartUp = 11	SDK未启动
YIMErrorcode_FileNotExist = 12	文件不存在
YIMErrorcode_SendFileError = 13	文件发送出错
YIMErrorcode_UploadFailed = 14	文件上传失败，上传失败 一般都是网络限制上传了
YIMErrorcode_UsernamePasswordError = 15,	用户名密码错误
YIMErrorcode_UserStatusError = 16,	用户状态为无效用户
YIMErrorcode_MessageTooLong = 17,	消息太长
YIMErrorcode_ReceiverTooLong = 18,	接收方ID过长（检查频道名）
YIMErrorcode_InvalidChatType = 19,	无效聊天类型
YIMErrorcode_InvalidReceiver = 20,	无效用户ID
YIMErrorcode_UnknowError = 21,	未知错误
YIMErrorcode_InvalidAppkey = 22,	AppKey无效
YIMErrorcode_ForbiddenSpeak = 23,	被禁止发言
YIMErrorcode_CreateFileFailed = 24,	创建文件失败
YIMErrorcode_UnsupportFormat = 25,	支持的文件格式
YIMErrorcode_ReceiverEmpty = 26,	接收方为空
YIMErrorcode_RoomIDTooLong = 27,	房间名太长
YIMErrorcode_ContentInvalid = 28,	聊天内容严重非法
YIMErrorcode_NoLocationAuthrize = 29,	未打开定位权限
YIMErrorcode_UnknowLocation = 30,	未知位置
YIMErrorcode_Unsupport = 31,	不支持该接口
YIMErrorcode_NoAudioDevice = 32,	无音频设备
YIMErrorcode_AudioDriver = 33,	音频驱动问题
YIMErrorcode_DeviceStatusInvalid = 34,	设备状态错误
YIMErrorcode_ResolveFileError = 35,	文件解析错误
YIMErrorcode_ReadWriteFileError = 36,	文件读写错误
YIMErrorcode_NoLangCode = 37,	语言编码错误
YIMErrorcode_TranslateUnable = 38,	翻译接口不可用
YIMErrorcode_SpeechAccentInvalid = 39,	语音识别方言无效
YIMErrorcode_SpeechLanguageInvalid = 40,	语音识别语言无效
YIMErrorcode_HasIllegalText = 41,	消息含非法字符
YIMErrorcode_AdvertisementMessage = 42,	消息涉嫌广告
YIMErrorcode_AlreadyBlock = 43,	用户已经被屏蔽
YIMErrorcode_NotBlock = 44,	用户未被屏蔽
YIMErrorcode_MessageBlocked = 45,	消息被屏蔽
YIMErrorcode_LocationTimeout = 46,	定位超时
YIMErrorcode_NotJoinRoom = 47,	未加入该房间
YIMErrorcode_LoginTokenInvalid = 48,	登录token错误
YIMErrorcode_CreateDirectoryFailed = 49,	创建目录失败
YIMErrorcode_InitFailed = 50,	初始化失败
YIMErrorcode_Disconnect = 51,	与服务器断开
YIMErrorcode_TheSameParam = 52,	设置参数相同
YIMErrorcode_QueryUserInfoFail = 53,	查询用户信息失败
YIMErrorcode_SetUserInfoFail = 54,	设置用户信息失败
YIMErrorcode_UpdateUserOnlineStateFail = 55,	更新用户在线状态失败
YIMErrorcode_NickNameTooLong = 56,	昵称太长(> 64 bytes)
YIMErrorcode_SignatureTooLong = 57,	个性签名太长(> 120 bytes)
YIMErrorcode_NeedFriendVerify = 58,	需要好友验证信息
YIMErrorcode_BeRefuse = 59,	添加好友被拒绝
YIMErrorcode_HasNotRegisterUserInfo = 60,	未注册用户信息
YIMErrorcode_AlreadyFriend = 61,	已经是好友
YIMErrorcode_NotFriend = 62,	非好友
YIMErrorcode_NotBlack = 63,	不在黑名单中
YIMErrorcode_PhotoUrlTooLong = 64,	头像url过长(>500 bytes)
YIMErrorcode_PhotoSizeTooLarge = 65,	头像太大（>100 kb）
YIMErrorcode_ChannelMemberOverflow = 66,	达到频道人数上限
YIMErrorcode_PTT_Start = 2000,	开始录音
YIMErrorcode_PTT_Fail = 2001,	录音失败
YIMErrorcode_PTT_DownloadFail = 2002,	语音消息文件下载失败
YIMErrorcode_PTT_GetUploadTokenFail = 2003,	获取语音消息Token失败
YIMErrorcode_PTT_UploadFail = 2004,	语音消息文件上传失败
YIMErrorcode_PTT_NotSpeech = 2005,	没有录音内容
YIMErrorcode_PTT_DeviceStatusError = 2006,	语音设备状态错误
YIMErrorcode_PTT_IsSpeeching = 2007,	录音中
YIMErrorcode_PTT_FileNotExist = 2008,	文件不存在
YIMErrorcode_PTT_ReachMaxDuration = 2009,	达到最大时长限制
YIMErrorcode_PTT_SpeechTooShort = 2010,	录音时间太短
YIMErrorcode_PTT_StartAudioRecordFailed = 2011,	启动录音失败
YIMErrorcode_PTT_SpeechTimeout = 2012,	音频输入超时
YIMErrorcode_PTT_IsPlaying = 2013,	在播放
YIMErrorcode_PTT_NotStartPlay = 2014,	未开始播放
YIMErrorcode_PTT_CancelPlay = 2015,	主动取消播放
YIMErrorcode_PTT_NotStartRecord = 2016,	未开始语音
YIMErrorcode_PTT_NotInit = 2017,	未初始化
YIMErrorcode_PTT_InitFailed = 2018,	初始化失败
YIMErrorcode_PTT_Authorize = 2019,	录音权限
YIMErrorcode_PTT_StartRecordFailed = 2020,	启动录音失败
YIMErrorcode_PTT_StopRecordFailed = 2021,	停止录音失败
YIMErrorcode_PTT_UnsupprtFormat = 2022,	不支持的格式
YIMErrorcode_PTT_ResolveFileError = 2023,	解析文件错误
YIMErrorcode_PTT_ReadWriteFileError = 2024,	读写文件错误
YIMErrorcode_PTT_ConvertFileFailed = 2025,	文件转换失败
YIMErrorcode_PTT_NoAudioDevice = 2026,	无音频设备
YIMErrorcode_PTT_NoDriver = 2027,	驱动问题
YIMErrorcode_PTT_StartPlayFailed = 2028,	启动播放失败
YIMErrorcode_PTT_StopPlayFailed = 2029,	停止播放失败
YIMErrorcode_PTT_RecognizeFailed = 2030,	识别失败
YIMErrorcode_Fail = 10000	语音服务启动失败


其他值定义
禁言原因：ForbidSpeakReason
错误码	含义

0	未知
1	发广告
2	侮辱
3	政治敏感
4	恐怖主义
5	反动
6	色情
7	其他

*/
