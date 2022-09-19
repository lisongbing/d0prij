// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

let tea = null;
let PGNUM = 10;

let open7 = true;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    xhwItem0: cc.Prefab = null;
    @property(cc.Prefab)
    xhwItem1: cc.Prefab = null;
    @property(cc.Prefab)
    xhwItem2: cc.Prefab = null;

    ctt:Object = {};

    public oldDeskType: string = '2';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        tea = TeaClass.instance;

        // @ts-ignore
        let r = this.node;

        for (let i = 1; i <= 7; ++i) {
            // @ts-ignore
            this.ctt[''+i] = cc.find('ctt'+i, r); 
        }

        this.load1();
        this.load2();
        this.load3();
        this.load4();
        this.load5();
        //this.load6();
        this.loadDeskType();
        this.load7();

        // @ts-ignore
        let nodefive = cc.find('ToggleContainer_tag/toggle5', this.node)
        // @ts-ignore
        nodefive.active = !cc.g.utils.getWeChatOs()

        // @ts-ignore
        let closeOne = cc.find('Button_close', this.node)
        // @ts-ignore
        let closeTwo = cc.find('Button_close_min', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }
    }

    load1 () {
        let r = this.ctt['1'];
        let ctt = cc.find('New ScrollView/view/content', r);
        
        // 圈子名称
        let qzmc = cc.find('qzmc', ctt);
        r.qznm = cc.find('New EditBox', qzmc).getComponent(cc.EditBox);
        r.qznm.string = '';
        
        // 圈子简介
        let qzjj = cc.find('qzjj', ctt);
        r.jianjie = cc.find('New EditBox', qzjj).getComponent(cc.EditBox);
        r.jianjie.string = '';

        // 圈子战绩 成员战绩 成员审核 成员列表 空桌前置 模糊显示 自动退出
        let nd = ['jscs', 'qzzj', 'cyzj', 'cysh', 'cylb', 'kzqz', 'mhxs', 'zdtc',];
        nd.forEach(e => {
            let n = cc.find(e, ctt);
            r[e + 'tog1'] = cc.find('tc/toggle1', n).getComponent(cc.Toggle);
            r[e + 'tog2'] = cc.find('tc/toggle2', n).getComponent(cc.Toggle);
            
            if (e=='jscs') {
                r[e + 'tog3'] = cc.find('tc/toggle3', n).getComponent(cc.Toggle);
                r[e + 'tog4'] = cc.find('tc/toggle4', n).getComponent(cc.Toggle);
                r[e + 'tog5'] = cc.find('tc/toggle5', n).getComponent(cc.Toggle);
            }
        });

        // 管理权限
        let glqx = cc.find('glqx', ctt);
        r.togJS = cc.find('Toggle_jinsai', glqx).getComponent(cc.Toggle);
        r.togTC = cc.find('Toggle_tichu', glqx).getComponent(cc.Toggle);
        r.togSP = cc.find('Toggle_shenpi', glqx).getComponent(cc.Toggle);
        r.togCYZJ = cc.find('Toggle_cyzj', glqx).getComponent(cc.Toggle);

        // 桌子张数
        for (let i = 0; i < 6; i++) {
            let n = cc.find('zsxz', ctt);
            let index = i + 1
            r['zsxztgtog'+index] = cc.find('zsxztg/toggle'+index, n).getComponent(cc.Toggle);
            if (i == 0) {
                r['zsxztgtog'+index].check()
            } else {
                r['zsxztgtog'+index].uncheck()
            }
        }
    }

    load2 () {
        let lab1 = cc.find('ToggleContainer_tag/toggle2/Background/New Label', this.node).getComponent(cc.Label);
        let lab2 = cc.find('ToggleContainer_tag/toggle2/checkmark/New Label', this.node).getComponent(cc.Label);

        let r = this.ctt['2'];
        r.EditBox_dy = cc.find('EditBox_dy', r).getComponent(cc.EditBox);
        r.EditBox_dy.string = '';
        r.lab1 = lab1;
        r.lab2 = lab2;
    }

    load3 () {
        let r = this.ctt['3'];
        r.EditBox_js = cc.find('New EditBox', r).getComponent(cc.EditBox);
        r.EditBox_js.string = '';
    }
    
    load4 () {
        let r = this.ctt['4'];
        r.tm1 = cc.find('Button_open/Label_tm', r).getComponent(cc.Label);
        r.tm2 = cc.find('Button_close/Label_tm', r).getComponent(cc.Label);
        r.tm1.string = r.tm2.string = '';

        r.tog1 = cc.find('Toggle1', r).getComponent(cc.Toggle);
        r.tog2 = cc.find('Toggle2', r).getComponent(cc.Toggle);
        r.tog1.uncheck();
        r.tog2.uncheck();

        // 时间设置弹窗
        r.sj = cc.find('sj', r);
        r.sj.active = false;

        // 小时 分钟
        r.h = cc.find('h', r.sj);
        r.m = cc.find('m', r.sj);
        r.h.active = true;
        r.m.active = false;

        for (let i = 0; i < 24; ++i) {
            let btn = cc.find('New Node/'+ 'b'+i, r.h);

            cc['g'].utils.addClickEvent(btn, this.node, 'tea_setting', 'onBtnTime', {ishour:true, t:i});

            let lab = cc.find('New Label', btn).getComponent(cc.Label);
            lab.string = (i<10 ? '0'+i : i) + '时';

            cc.find('checkmark', btn).active = false;
        }

        for (let i = 0; i < 60; ++i) {
            let btn = cc.find('New ScrollView/view/content/'+ 'b'+i, r.m);

            cc['g'].utils.addClickEvent(btn, this.node, 'tea_setting', 'onBtnTime', {ishour:false, t:i});

            let lab = cc.find('New Label', btn).getComponent(cc.Label);
            lab.string = (i<10 ? '0'+i : i) + '分';

            cc.find('checkmark', btn).active = false;
        }
    }

    load5 () {
        let r = this.ctt['5'];
        // @ts-ignore
        r.tog1 = cc.find('qzzj/New ToggleContainer/toggle1', r).getComponent(cc.Toggle);
        // @ts-ignore
        r.tog2 = cc.find('qzzj/New ToggleContainer/toggle2', r).getComponent(cc.Toggle);
    }
    load6 () {
        // @ts-ignore
        let BGIdx = cc.sys.localStorage.getItem('teaBGIdx');
        if (!BGIdx) {
            return;
        }

        let r = this.ctt['6'];
        // @ts-ignore
        cc.find('New ScrollView/view/content/bg'+BGIdx, r).getComponent(cc.Toggle).check();
    }
    loadDeskType () {
        // @ts-ignore
        let deskIdx = cc.sys.localStorage.getItem('teaDeskIdx');
        // @ts-ignore
        if (cc.g.utils.judgeStringEmpty(deskIdx)) {
            deskIdx = '2'
            // @ts-ignore
            cc.sys.localStorage.setItem('teaDeskIdx', deskIdx);
        }

        this.oldDeskType = deskIdx

        cc.log('loadDeskType--->' + this.oldDeskType)

        let r = this.ctt['6'];
        // @ts-ignore
        cc.find('qzzj/tc/toggle'+parseInt(deskIdx), r).getComponent(cc.Toggle).check();
    }
    load7 () {
        let r = this.ctt['7'];
        r.ud={};

        // @ts-ignore ID搜索
        r.eb_Seach = cc.find('Node_Seach/Seach_EditBox', r).getComponent(cc.EditBox);
        r.searchID = '';

        // @ts-ignore 小黑屋滑动列表
        r.sv_xhw = cc.find('ScrollView_xhw', r).getComponent(cc.ScrollView);
        r.sv_xhw.content.destroyAllChildren();
        r.sv_xhw.node.on('scroll-to-bottom', this.XhwGrp_scroll_to_bottom, this);
        
        
        // @ts-ignore 限制组对话框
        {
            let o={};// @ts-ignore
            
            o.r = cc.find('dlgGrp', r);// @ts-ignore

            o.lab_new = cc.find('Node_nm_xg/lab_new', o.r);// @ts-ignore
            o.eb_name = cc.find('Node_nm_xg/EditBox_name', o.r).getComponent(cc.EditBox);// @ts-ignore
            o.btn_xiugai = cc.find('Node_nm_xg/btn_xiugai', o.r);// @ts-ignore
        
            o.lab_num = cc.find('lab_num', o.r).getComponent(cc.Label);// @ts-ignore
            o.lab_kong = cc.find('lab_kong', o.r);// @ts-ignore
            
            o.sv_player = cc.find('ScrollView_player', o.r).getComponent(cc.ScrollView);// @ts-ignore
            o.sv_player.content.destroyAllChildren();// @ts-ignore
            o.sv_player.node.on('scroll-to-bottom', this.XhwGrpMbr_scroll_to_bottom, this);// @ts-ignore

            o.r.active = false;

            r.dlgGrp = o;
        }

        // @ts-ignore 添加限制人员对话框
        {
            let o={};// @ts-ignore
            
            o.r = cc.find('dlgAdd', r);// @ts-ignore
            
            o.eb_id = cc.find('Node_Seach/Seach_EditBox', o.r).getComponent(cc.EditBox);// @ts-ignore
            o.searchId = '';// @ts-ignore

            o.sv_player = cc.find('ScrollView_player', o.r).getComponent(cc.ScrollView);// @ts-ignore
            o.sv_player.content.destroyAllChildren();// @ts-ignore
            o.sv_player.node.on('scroll-to-bottom', this.XhwAddplr_scroll_to_bottom, this);// @ts-ignore

            o.r.active = false;// @ts-ignore

            r.dlgAdd = o;
        }
        
        let t7 = cc.find('ToggleContainer_tag/toggle7', this.node);
        t7.active = ((tea.position == 71) || (tea.position == 61));

        if (!open7) {
            t7.active = false;
            r.active = false;
        }
    }

    start () {

    }

    // update (dt) {}

    // ---------------------------------------------------------------------------------------------------

    //
    up(tag) {
        // @ts-ignore
        cc.dlog('up');

        // @ts-ignore
        if (!cc.g.utils.getWeChatOs()) {
            cc.find('ToggleContainer_tag/toggle5', this.node).active = tea.goldSetData['goldMatchAuth'];
        }

        let upview = ()=>{

            let sd = tea.SettingData;

            {
                let r = this.ctt['1'];
                
                // 圈子名称
                r.qznm.string = sd.name;
                
                // 圈子简介
                r.jianjie.string = sd.introduce;

                // 圈子战绩 成员战绩 成员审核 成员列表 空桌前置 模糊显示 自动退出
                let nd = ['qzzj', 'cyzj', 'cysh', 'cylb', 'kzqz', 'mhxs', 'zdtc',];
                let ndd = ['quanzzjOpen', 'cyzjOpen', 'cyshOpen', 'cylbOpen', 'deskFrontOpen', 'blurred', 'autoExit',];
                for (let i = 0; i < nd.length; ++i) {
                    if (sd[ndd[i]]==0) {
                        r[nd[i] + 'tog1'].check();
                    } else {
                        r[nd[i] + 'tog2'].check();
                    }
                }

                //
                if (sd.disbandNum==8888) {
                    r['jscs' + 'tog1'].check();
                } else if (sd.disbandNum==0) {
                    r['jscs' + 'tog2'].check();
                } else if (sd.disbandNum==2) {
                    r['jscs' + 'tog3'].check();
                } else if (sd.disbandNum==3) {
                    r['jscs' + 'tog4'].check();
                } else if (sd.disbandNum==5) {
                    r['jscs' + 'tog5'].check();
                }
        
                // 管理权限
                //int32  purview=10;//管理权限(1 禁赛 2 踢出 4 审批 8 成员战绩 16 成员积分 32 预创权限)
                (sd.purview&1) ? r.togJS.check() : r.togJS.uncheck();
                (sd.purview&2) ? r.togTC.check() : r.togTC.uncheck();
                (sd.purview&4) ? r.togSP.check() : r.togSP.uncheck();
                (sd.purview&8) ? r.togCYZJ.check() : r.togCYZJ.uncheck();
            }

            {
                let r = this.ctt['2'];
                r.lab1.string = r.lab2.string = (tea.SettingData['isDayang'] ? '开启' : '打烊');
            }

            {
                let r = this.ctt['4'];

                r.tm1.string = sd.ds_openTime  || '';
                r.tm2.string = sd.ds_closeTime || '';
    
                sd.ds_timerOpen   ==1 ? r.tog1.check() : r.tog1.uncheck();
                sd.ds_timerClosed ==1 ? r.tog2.check() : r.tog2.uncheck();
            }

            {
                let r = this.ctt['5'];
                sd.isGoldOpen ? r.tog1.check() : r.tog2.check();
            }

            if (tag=='bisai') {
                //this.onTogTag(0,'5');
                // @ts-ignore
                if (!cc.g.utils.getWeChatOs()) {
                    cc.find('ToggleContainer_tag/toggle5', this.node).getComponent(cc.Toggle).check();
                }
            } else {
                //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                if ((tea.position == 71) || (tea.position == 61)) {
                    this.onTogTag(0,'1');
                } else {
                    for (let i = 0; i < 10; i++) {
                        // @ts-ignore
                        let t = cc.find('ToggleContainer_tag/toggle'+(i+1), this.node);
                        if (t) {
                            if (i == 5) {
                                // @ts-ignore
                                t.getComponent(cc.Toggle).check();
                            } else {
                                t.active = false;
                            }
                        }
                    }
                }
            }
        }

        {/*
            //茶馆设置信息
            //@api:2205,@type:req
            message TeaHouseSettingInfoReq{
                int32 teaHouseId=1;//茶馆Id
            }
            //@api:2205,@type:resp
            message TeaHouseSettingInfoResp{
                int32 teaHouseId=1;//茶馆Id

                string name=2;//茶馆名称
                string introduce=3;//茶馆简介
                
                int32  quanzzjOpen=4;//圈子战绩(1 公示战绩 0不公示战绩)
                int32  cyzjOpen=5;//成员战绩(1 公示战绩 0不公示战绩)
                int32  cyshOpen=6;//成员审核(1 开 0关)
                int32  cylbOpen=7;//成员列表(1 全部可见 0不可见)
                int32  deskFrontOpen=8;//空桌前置(1 开 0关)
                int32  patternOpen=9;//分配模式(1 AA 2 大赢家)
                int32  purview=10;//管理权限(1 禁赛 2 踢出 4 审批 8 成员战绩 16 成员积分 32 预创权限)
                int32  blurred=11;//模糊显示(1 开启 0 关闭)
                int32  autoExit=12;//自动退出(1 开 0关)

                int32  forbidKick=13;//禁止踢人(1 开 0关)
                int32  rankMatch=14;//排名赛(1 开启 0关闭)
                string  complainForbid=15;//举报禁玩
                int32  autoClean=16;//自动清人(单位时间:天)
                string forbidIntegral=17;//禁玩积分
                
                int32  dyOpen=18;//打烊开关(1 开 0 关闭)

                string openTime=19;//定时开始时间(小时:分钟)
                string closeTime=20;//定时关闭时间(小时:分钟)
                int32  timerOpen=21;//定时开启开关(1 开 0 关闭)
                int32  timerClosed=22;//定时关闭开关(1 开 0 关闭)

                int32  displayFullNum=23;//0-不限满桌数量 8-显示8桌(6 3 2 1)等等分别显示对应满桌数量的桌子
                int32  disbandNum=24;//茶馆解散次数   不限-8888
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SETTING_INFO);
        req.teaHouseId = tea.teaHouseId;
        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SETTING_INFO, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('TEA_HOUSE_SETTING_INFO 成功');
                // @ts-ignore
                let sd = tea.SettingData;

                sd.name = resp.name;
                sd.introduce = resp.introduce;

                sd.quanzzjOpen = resp.quanzzjOpen;
                sd.cyzjOpen = resp.cyzjOpen;
                sd.cyshOpen = resp.cyshOpen;
                sd.cylbOpen = resp.cylbOpen;
                sd.deskFrontOpen = resp.deskFrontOpen;
                sd.patternOpen = resp.patternOpen;
                sd.purview = resp.purview;
                sd.blurred = resp.blurred;
                sd.autoExit = resp.autoExit;

                sd.forbidKick = resp.forbidKick;
                sd.rankMatch = resp.rankMatch;
                sd.complainForbid = resp.complainForbid;
                sd.autoClean = resp.autoClean;
                sd.forbidIntegral = resp.forbidIntegral;

                sd.isDayang = resp.dyOpen;

                sd.ds_openTime = resp.openTime;
                sd.ds_closeTime = resp.closeTime;
                sd.ds_timerOpen = resp.timerOpen;
                sd.ds_timerClosed = resp.timerClosed;

                sd.displayFullNum = resp.displayFullNum;
                sd.disbandNum = resp.disbandNum;

                this.onTogTag(0, 1);
                
                upview();
            } else {
                cc.dlog('TEA_HOUSE_SETTING_INFO 失败');
            }
        });
    }


    // 标签单选
    onTogTag(evt, data) {
        cc.dlog('onTogTag', data);

        if (data=='2') {
            if (!tea.SettingData['isDayang']) {
                this.ctt['2'].active = true;
                this.ctt['2'].EditBox_dy.string = '';
            } else {
                this.onBtnCloseDayang(0,2);
            }
            
            return;
        }

        if (data=='3') {
            this.ctt['3'].active = true;
            this.ctt['3'].EditBox_js.string = '';
            return;
        }

        for (const key in this.ctt) {
            this.ctt[key].active = false;
        }

        if (data=='6') {
            this.ctt['6'].active = true;
            this.load6();
            return;
        }

        if (data=='7') {
            //this.ctt['7'].active = true;
            this.upXiaoheiwu(0);
            return;
        }

        this.ctt[data] && (this.ctt[data].active = true);
    }

    // 搜索按钮通用
    onBtnSearch(evt, data) {
        cc.dlog('onBtnSearch data', data);

        let r = this.ctt['7'];

        if (data=='xhw') {
            r.searchID = r.eb_Seach.string;
            this.upXiaoheiwu(0);
            return;
        }

        if (data=='add') {
            r.dlgAdd.searchId = r.dlgAdd.eb_id.string;
            this.onBtnXhwUpAddList(0);
            return;
        }
    }


    // ------------游戏设置---------------------------------------------------------------------------------------

    // 
    onBtnSaveBase(evt, data) {
        // @ts-ignore
        cc.dlog('onBtnSaveBase');

        // @ts-ignore
        cc.g.utils.btnShake();

        {/*
            //修改茶馆设置
            //@api:2206,@type:req
            message ModifyTeaHouseSettingReq{
                int32 teaHouseId=1;//茶馆Id

                string name=2;//茶馆名称
                string introduce=3;//茶馆简介

                int32  quanzzjOpen=4;//圈子战绩(1 公示战绩 0不公示战绩)
                int32  cyzjOpen=5;//成员战绩(1 公示战绩 0不公示战绩)
                int32  cyshOpen=6;//成员审核(1 开 0关)
                int32  cylbOpen=7;//成员列表(1 全部可见 0不可见)
                int32  deskFrontOpen=8;//空桌前置(1 开 0关)
                int32  patternOpen=9;//分配模式(1 AA 2 大赢家)
                int32  purview=10;//管理权限(1 禁赛 2 踢出 4 审批 8 成员战绩 16 成员积分 32 预创权限)
                int32  blurred=11;//模糊显示(1 开启 0 关闭)
                int32  autoExit=12;//自动退出(1 开 0关)
                int32  forbidKick=13;//禁止踢人(1 开 0关)
                int32  rankMatch=14;//排名赛(1 开启 0关闭)
                string  complainForbid=15;//举报禁玩
                int32  autoClean=16;//自动清人(单位时间:天)
                string forbidIntegral=17;//禁玩积分
                int32  displayFullNum=18;//0-不限满桌数量 8-显示8桌(6 3 2 1)等等分别显示对应满桌数量的桌子
                int32  disbandNum=19;//茶馆解散次数   不限-8888
            }
            //@api:2206,@type:resp
            message ModifyTeaHouseSettingResp{

            }
        */}

        let r = this.ctt['1'];
        let sd = tea.SettingData;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.MODIFY_TEA_HOUSE_SETTING);
        req.teaHouseId = tea.teaHouseId;

        req.name = r.qznm.string;
        req.introduce = r.jianjie.string;

        req.patternOpen = sd.patternOpen;
        req.purview = sd.purview;
        req.forbidKick = sd.forbidKick;
        req.rankMatch = sd.rankMatch;
        req.complainForbid = sd.complainForbid;
        req.autoClean = sd.autoClean;
        req.forbidIntegral = sd.forbidIntegral;

        // 圈子战绩 成员战绩 成员审核 成员列表 空桌前置 模糊显示 自动退出
        let nd = ['jscs', 'qzzj', 'cyzj', 'cysh', 'cylb', 'kzqz', 'mhxs', 'zdtc',];
        let ndd = ['jscs', 'quanzzjOpen', 'cyzjOpen', 'cyshOpen', 'cylbOpen', 'deskFrontOpen', 'blurred', 'autoExit',];
        for (let i = 0; i < nd.length; ++i) {
            if (i==0) {
                let jsnum = 8888;
                if (r[nd[i] + 'tog2'].isChecked) {
                    jsnum = 0;
                } else if (r[nd[i] + 'tog3'].isChecked) {
                    jsnum = 2;
                } else if (r[nd[i] + 'tog4'].isChecked) {
                    jsnum = 3;
                } else if (r[nd[i] + 'tog5'].isChecked) {
                    jsnum = 5;
                }
                // @ts-ignore
                cc.dlog('解散次数', jsnum);
                req.disbandNum = jsnum;
            } else {
                req[ndd[i]] =  r[nd[i] + 'tog1'].isChecked ? 0 : 1;
            }
        }

        let displayFullNum = 0;
        let deskArr = [0, 8, 6, 3, 2, 1]
        for (let i = 0; i < deskArr.length; ++i) {
            let index = i + 1
            let isChecked = r[ 'zsxztgtog'+index].isChecked;
            if (isChecked) {
                displayFullNum = deskArr[i];
                break;
            }
        }

        // // @ts-ignore
        // cc.dlog('displayFullNum-->' + displayFullNum)
        // // add by panbin
        // req.displayFullNum = displayFullNum;

        req.purview = 0;
        //req.purview = req.purview | (r.togJS.isChecked ? 1 : 0);
        req.purview = req.purview | (r.togTC.isChecked ? 2 : 0);
        req.purview = req.purview | (r.togSP.isChecked ? 4 : 0);
        req.purview = req.purview | (r.togCYZJ.isChecked ? 8 : 0);



        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.MODIFY_TEA_HOUSE_SETTING, req, (resp) => {
            // @ts-ignore
            if (!resp || !resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('MODIFY_TEA_HOUSE_SETTING 成功');
                // @ts-ignore
                cc.g.global.hint('设置成功');


            } else {
                cc.dlog('MODIFY_TEA_HOUSE_SETTING 失败');
            }
        });
    }
    // ------------游戏设置---------------------------------------------------------------------------------------
    _____() {}

    // ------------基础设置---------------------------------------------------------------------------------------
    // 背景选择
    onTogBG(evt, data) {
        // @ts-ignore
        let oldBGIdx = cc.sys.localStorage.getItem('teaBGIdx');

        if (data == oldBGIdx) return;

        // @ts-ignore
        cc.dlog('onTogBG', data);
        // @ts-ignore
        cc.sys.localStorage.setItem('teaBGIdx', data);

        // @ts-ignore
        let bg = cc.find("New Sprite", tea.node).getComponent(cc.Sprite);
        bg.spriteFrame = tea.teabg[parseInt(data)-1];
    }
    // ------------基础设置---------------------------------------------------------------------------------------
    ____() {}

    // ------------小黑屋---------------------------------------------------------------------------------------
    // 组
    upXiaoheiwu(page) {
        // @ts-ignore
        cc.log('upXiaoheiwu page', page);

        let r = this.ctt['7'];

        page = page||0;

        if (page===0) {
            //r.ud.searchList = [];
            r.ud.list = [];
        }
        

        {/*
            TEA_HOUSE_BLACK_GROUP_LIST=2330;//茶馆小黑屋列表

            //茶馆小黑屋列表(分页)
            //@api:2330,@type:req
            message TeaHouseBlackGroupListReq{
                int32    teaHouseId=1;//茶馆Id
                int32    pageNum=2;//当前页码数
                int32    pageSize=3;//每页显示条数
                string   searchId=4;//查询条件Id或者昵称
            }
            //@api:2330,@type:resp
            message  TeaHouseBlackGroupListResp{
                int32    teaHouseId=1;//茶馆Id
                int32    pageNum=2;//当前页码数    
                int32    pageSize=3;//每页显示条数 
                int32    totalCount=4;//总条数
                int32    totalPage=5;//总页数
                repeated TeaHouseBlackGroupInfo list =6;//小黑屋列表
            }
            //茶馆小黑屋
            message TeaHouseBlackGroupInfo {
                int32  groupId=1;//小黑屋唯一Id
                string groupName=2;//小黑屋名称
                repeated string iconList =3;//头像列表
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.pageNum  = page;
        req.pageSize = PGNUM;
        req.searchId = r.searchID;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                cc.log('TEA_HOUSE_BLACK_GROUP_LIST 成功');

                let o=r.ud;// @ts-ignore
                o.teaHouseId = resp.teaHouseId;// @ts-ignore
                o.pageNum = resp.pageNum;// @ts-ignore
                o.pageSize = resp.pageSize;// @ts-ignore
                o.totalCount = resp.totalCount;// @ts-ignore
                o.totalPage = resp.totalPage;// @ts-ignore
                
                resp.list.forEach(e => {
                    let oo = {
                        id: e.groupId,
                        name: e.groupName,
                        iconList:[],
                    };

                    e.iconList.forEach(ee => {
                        oo.iconList.push(ee);
                    });

                    o.list.push(oo);
                });
                
                (page == 0) ? this.upXhwView(): this.addXhwitms();
            } else {
                cc.dlog('TEA_HOUSE_BLACK_GROUP_LIST 失败');
            }
        });
    }
    // 组---更新
    upXhwView() {
        cc.dlog('upXhwView');
    
        let r = this.ctt['7'];
        r.active = true;
    
        r.items = [];
        
        let ctt = r.sv_xhw.content;
        ctt.destroyAllChildren();
        
        this.addXhwitms();
    }
    // 组---添加
    addXhwitms() {
        cc.dlog('addXhwitms');
    
        let r = this.ctt['7'];
    
        //let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
        let list = r.ud.list;
        let items = r.items;
        let bidx = items.length;
    
        let ctt = r.sv_xhw.content;
        for (let i = bidx; i < bidx+PGNUM; ++i) {
            if (!list[i]) {
                break;
            }
    
            let d = list[i];
    
            let itm = cc.instantiate(this.xhwItem0);
            let add = cc.find('add', itm);
            let grp = cc.find('grp', itm);
            grp.active = true;
            add.destroy();

            itm['idx'] = i;
            itm['ud'] = d;
    
            itm['number'] = cc.find('number', grp).getComponent(cc.Label);
            if (d.name == '') {
                // 编号
                itm['number'].string = `编号:${d.id}`;
            } else {
                // 编号
                itm['number'].string = d.name;
            }
            
    
            // 
            for (let j = 0; j < 4; ++j) {
                let head = cc.find('players/p'+(j+1), grp);
                if (!d.iconList[j]) {
                    head.active = false;
                    continue;
                }

                // @ts-ignore
                cc.g.utils.setHead(head, d.iconList[j]);
            }

            // @ts-ignore
            cc.g.utils.addClickEvent(grp, this.node, 'tea_setting', 'onBtnXhwOpenGrp', itm);

            ctt.addChild(itm);
    
            items.push(itm);
        }

        // 添加最后的加号
        {
            let itmadd = cc.instantiate(this.xhwItem0);
            let add = cc.find('add', itmadd);
            let grp = cc.find('grp', itmadd);
            add.active = true;
            grp.destroy();
            // @ts-ignore
            cc.g.utils.addClickEvent(add, this.node, 'tea_setting', 'onBtnXhwOpenGrp');
            ctt.addChild(itmadd);
        }
    }
    // 组---翻页
    XhwGrp_scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview
        cc.log('组---翻页');

        let r = this.ctt['7'];

        this.upXiaoheiwu(r.ud.pageNum+1);
    }
    // 组成员
    onBtnXhwOpenGrp(evt, itm, idx) {
        cc.log('onBtnXhwOpenGrp');
        // @ts-ignore
        //cc.g.utils.btnShake();
        
        let r = this.ctt['7'];
        let dlg = r.dlgGrp;
        dlg.curitm = itm;
        dlg.r.active = true;
        dlg.lab_kong.active = true;// @ts-ignore
        dlg.lab_num.string = '已限制0人';

        dlg.btn_xiugai.active = dlg.curitm ? true : false;
        dlg.eb_name.node.active = dlg.btn_xiugai.active;
        dlg.lab_new.active = !dlg.btn_xiugai.active;

        // 添加新组
        if (!dlg.curitm) {
            dlg.grp={};
            dlg.grp.id = 0;// @ts-ignore
            dlg.grp.name = '';// @ts-ignore

            dlg.ud = {};
            dlg.ud.limitCount = 0;
            dlg.ud.list=[];
            dlg.xiugai = false;

            dlg.sv_player.content.destroyAllChildren();
            dlg.items = [];
            return;
        }

        dlg.grp = dlg.curitm.ud;

        if (dlg.grp.name == '') {
            dlg.eb_name.string = `编号:${dlg.grp.id}`;
        } else {
            dlg.eb_name.string = dlg.grp.name;
        }

        if (!idx) {
            idx = 0;

            dlg.ud = {};
            dlg.ud.list=[];
            dlg.xiugai = false;

            dlg.sv_player.content.destroyAllChildren();
            dlg.items = [];
        }
        
        {/*
            //茶馆小黑屋(分页)
            //@api:2331,@type:req
            message TeaHouseBlackGroupReq{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                int32    index=3;//索引    
                int32    pageSize=4;//每页显示条数 
            }
            //@api:2331,@type:resp
            message  TeaHouseBlackGroupResp{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                string   groupName=3;//小黑屋名称
                int32    limitCount=4;//限制人数
                int32    index=5;//索引    
                int32    pageSize=6;//每页显示条数 
                int32    totalCount=7;//总条数
                repeated BlackGroupMemberInfo list=8;//成员列表
            }
            //茶馆小黑屋成员
            message BlackGroupMemberInfo {
                int64   memberId=1 ;//成员Id
                string  name=2;//玩家的昵称
                string  icon=3;//玩家的头像
                int32   position=4;//操作人职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                bool    online=5;//是否在线
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP);
        req.teaHouseId = tea.teaHouseId;// @ts-ignore
        req.groupId = dlg.grp.id;
        req.index = idx;
        req.pageSize = PGNUM;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                cc.log('TEA_HOUSE_BLACK_GROUP 成功');

                let o=dlg.ud;// @ts-ignore
                o.teaHouseId = resp.teaHouseId;// @ts-ignore
                o.groupId = resp.groupId;// @ts-ignore
                o.groupName = resp.groupName;// @ts-ignore
                o.limitCount = resp.limitCount;// @ts-ignore
                o.index = resp.index;// @ts-ignore
                o.pageSize = resp.pageSize;// @ts-ignore
                o.totalCount = resp.totalCount;// @ts-ignore

                dlg.lab_num.string = `已限制${o.limitCount}人`;

                resp.list.forEach(e => {
                    o.list.push({
                        memberId: e.memberId,
                        name: e.name,
                        icon: e.icon,
                        position: e.position,
                        online: e.online,
                    });
                });
                
                (idx == 0) ? this.upXhwGrpView(): this.addXhwGrpItms();
            } else {
                cc.log('TEA_HOUSE_BLACK_GROUP 失败');
            }
        });
    }
    // 组成员---更新
    upXhwGrpView() {
        cc.dlog('upXhwGrpView');

        let r = this.ctt['7'];
        let dlg = r.dlgGrp;

        dlg.sv_player.content.destroyAllChildren();
        dlg.items = [];

        this.addXhwGrpItms();
    }
    // 组成员---添加
    addXhwGrpItms() {
        cc.dlog('addXhwGrpItms');
    
        let r = this.ctt['7'].dlgGrp;
    
        let list = r.ud.list;
        let items = r.items;
        let bidx = items.length;

        r.lab_kong.active = (!list || list.length<=0);
    
        let ctt = r.sv_player.content;
        for (let i = bidx; i < list.length; ++i) { //bidx+PGNUM
            if (!list[i]) {
                break;
            }

            let d = list[i];
    
            let itm = cc.instantiate(this.xhwItem1);
            itm['idx'] = i;
            itm['ud'] = d;
            itm['isadd'] = false;
    
            // @ts-ignore 头像
            cc.g.utils.setHead(cc.find('head', itm), d.icon);

            // @ts-ignore (圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            cc.find('head/cg', itm).active = (d.position==61);
    
            // 名字
            cc.find('name', itm).getComponent(cc.Label).string = d.name;
            // @ts-ignore ID
            cc.find('id', itm).getComponent(cc.Label).string = ''+i64v(d.memberId);
    
            // @ts-ignore
            cc.g.utils.addClickEvent(cc.find('close', itm), this.node, 'tea_setting', 'onAddXhwplr', itm);
    
            ctt.addChild(itm);
    
            items.push(itm);
        }
    }
    // 组成员---翻页
    XhwGrpMbr_scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview

        cc.log('组成员---翻页');

        let r = this.ctt['7'].dlgGrp;

        if (r.grp.id == 0) {
            cc.log('新添加组 不翻');
            return;
        }

        this.onBtnXhwOpenGrp(0, r.curitm, r.ud.list.length);
    }
    // 组成员---关闭组
    onBtnXhwCloseGrp(evt, data) {
        cc.dlog('onBtnCloseXhwGrp', data);
        // @ts-ignore
        // cc.g.utils.btnShake();

        let r = this.ctt['7'];

        let dlg = r.dlgGrp;
        dlg.r.active = false;

        if (!dlg.xiugai){
            cc.dlog('无修改 不保存');
            return;
        }

        {/*
            //@api:2345,@type:req
            message  TeaHouseBlackSaveReq{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP_SAVE);
        req.teaHouseId = tea.teaHouseId;
        req.groupId = dlg.grp.id;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP_SAVE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                cc.log('TEA_HOUSE_BLACK_GROUP_SAVE 茶馆小黑屋保存 成功');

                this.upXiaoheiwu(0);
            } else {
                cc.log('TEA_HOUSE_BLACK_GROUP_SAVE 茶馆小黑屋保存 失败');
            }
        });
    }
    // 组成员---修改名字
    onBtnRename(evt, data) {
        cc.dlog('onBtnCloseXhwGrp', data);
        // @ts-ignore
        // cc.g.utils.btnShake();

        let r = this.ctt['7'];

        let dlg = r.dlgGrp;

        {/*
            //茶馆小黑屋更改名称
            //@api:2334,@type:req
            message TeaHouseBlackGroupRenameReq{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                string   groupName=3;//更改名称
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP_RENAME);
        req.teaHouseId = tea.teaHouseId;
        req.groupId = dlg.grp.id;
        req.groupName = dlg.eb_name.string;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP_RENAME, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                cc.log('茶馆小黑屋更改名称 成功');

                dlg.grp.name = dlg.curitm.number.string = req.groupName;

                // @ts-ignore
                cc.g.global.hint('更改名称成功');
            } else {
                cc.log('茶馆小黑屋更改名称 失败');
            }
        });
    }
    // 添加玩家列表---打开OR关闭
    onBtnXhw_OC_AddList(evt, data) {
        cc.dlog('onBtnXhwOpenAddList', data);
        // @ts-ignore
        //cc.g.utils.btnShake();

        let r = this.ctt['7'];
        let dlg = r.dlgAdd;
        let added = dlg.added;
        dlg.added = false;

        dlg.sv_player.content.destroyAllChildren();

        if (data=='1') {
            dlg.r.active = true;
            dlg.eb_id.string = '';
            dlg.searchId = '';

            this.onBtnXhwUpAddList(0);
        } else {
            dlg.r.active = false;

            if (added) {
                this.upXhwGrpView();
            }
        }
    }
    // 添加玩家
    onBtnXhwUpAddList(idx) {
        cc.dlog('onBtnXhwUpAddList idx', idx);
        // @ts-ignore
        // cc.g.utils.btnShake();

        idx = idx||0;

        let r = this.ctt['7'];

        let dlg = r.dlgAdd;
        dlg.ud = dlg.ud || {};
        if (!idx) {
            dlg.ud.list = [];
        }

        {/*
            //小黑屋筛选可添加成员(分页)
            //@api:2335,@type:req
            message TeaHouseBlackFilterReq{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                int32    index=3;//索引    
                int32    pageSize=4;//每页显示条数
                string   searchId=5;//查询条件Id或者昵称
            }
            //@api:2335,@type:resp
            message  TeaHouseBlackFilterResp{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                int32    index=3;//当前页码数    
                int32    pageSize=4;//每页显示条数 
                int32    totalCount=5;//总条数
                repeated BlackGroupMemberInfo list=6;//成员列表
            }
            //茶馆小黑屋成员
            message BlackGroupMemberInfo {
                int64   memberId=1 ;//成员Id
                string  name=2;//玩家的昵称
                string  icon=3;//玩家的头像
                int32   position=4;//操作人职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
                bool    online=5;//是否在线
                string  teamGroup=6;//战队分组
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP_FILTER);
        req.teaHouseId = tea.teaHouseId;// @ts-ignore
        req.groupId = r.dlgGrp.grp.id || 0;
        req.index = idx;
        req.pageSize = PGNUM;
        req.searchId = dlg.searchId;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP_FILTER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('TEA_HOUSE_BLACK_GROUP_FILTER 成功');
                let o=dlg.ud;// @ts-ignore
                o.teaHouseId = resp.teaHouseId;// @ts-ignore
                o.groupId = resp.groupId;// @ts-ignore
                o.index = resp.index;// @ts-ignore
                o.pageSize = resp.pageSize;// @ts-ignore
                o.searchId = resp.groupId;// @ts-ignore
                
                resp.list.forEach(e => {
                    o.list.push({
                        memberId: e.memberId,
                        name: e.name,
                        icon: e.icon,
                        position: e.position,
                        online: e.online,
                        teamGroup: e.teamGroup,
                    });
                });

                if (true && o.list[0]) {
                    for (let i = 0; i < 10; i++) {
                        //o.list.push(o.list[0]);
                    }
                }

                dlg.ud = o;

                (resp.index == 0) ? this.upXhwAddView(): this.addXhwAdditms();
            } else {
                cc.dlog('TEA_HOUSE_BLACK_GROUP_FILTER 失败');
            }
        });

        return;
    }
    // 添加玩家---更新
    upXhwAddView() {
        cc.dlog('upXhwAddView');
    
        let r = this.ctt['7'];
        let dlg = r.dlgAdd;
    
        dlg.items = [];
        
        let ctt = dlg.sv_player.content;
        ctt.destroyAllChildren();
        
        this.addXhwAdditms();
    }
    // 添加玩家---添加
    addXhwAdditms() {
        cc.dlog('addXhwitms');
    
        let r = this.ctt['7'].dlgAdd;
    
        //let list = r.ud.isSearch ? r.ud.searchList : r.ud.list;
        let list = r.ud.list;
        let items = r.items;
        let bidx = items.length;
    
        let ctt = r.sv_player.content;
        for (let i = bidx; i < list.length; ++i) {
            if (!list[i]) {
                break;
            }

            let d = list[i];
    
            let itm = cc.instantiate(this.xhwItem2);
            itm['idx'] = i;
            itm['ud'] = d;
            itm['isadd'] = true;
    
            // @ts-ignore 头像
            cc.g.utils.setHead(cc.find('head', itm), d.icon);
    
            // 名字
            cc.find('name', itm).getComponent(cc.Label).string = d.name;
            // @ts-ignore ID
            cc.find('id', itm).getComponent(cc.Label).string = ''+i64v(d.memberId);

            // 队-组-小组-推荐
            let Label_Group = cc.find("Label_Group", itm).getComponent(cc.Label);
            let gn = ''
            // @ts-ignore
            if (!cc.g.utils.judgeStringEmpty(d.teamGroup)) {
                let groupTxtArr = ["队/", "组/", "小组/", "推荐"]
                let groupNameArr = d.teamGroup.split("_")
                for (let i = 0; i < groupNameArr.length; i++) {
                    gn += groupNameArr[i];
                    gn += groupTxtArr[i];
                }
            } else {
                gn = '';
            }

            Label_Group.string = gn;
    
            // @ts-ignore
            cc.g.utils.addClickEvent(cc.find('btn_add', itm), this.node, 'tea_setting', 'onAddXhwplr', itm);
    
            ctt.addChild(itm);
    
            items.push(itm);
        }
    }
    // 添加玩家---点击 组成员---删除
    onAddXhwplr(evt, itm) {
        cc.dlog('onAddXhwplr', itm.idx, itm.ud, itm.isadd);

        let r = this.ctt['7'];
        let dlg = r.dlgGrp;

        {/*
            //茶馆小黑屋成员增加和删除
            //@api:2332,@type:req
            message TeaHouseBlackGroupOperReq{
                int32    teaHouseId=1;//茶馆Id
                int32    groupId=2;//小黑屋唯一Id
                int64    memberId=3 ;//成员Id
                bool     add=4;//增加还是删除(true增加,false删除)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_BLACK_GROUP_OPER);
        req.teaHouseId = tea.teaHouseId;// @ts-ignore
        req.groupId = dlg.grp.id;
        req.memberId = itm.ud.memberId;
        req.add = itm.isadd;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_BLACK_GROUP_OPER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('TEA_HOUSE_BLACK_GROUP_OPER 成功');

                dlg.xiugai = true;

                if (itm.isadd) {
                    ++dlg.ud.limitCount;// @ts-ignore
                    dlg.ud.list.unshift(itm.ud);
                    r.dlgAdd.added = true;

                    r.dlgAdd.ud.list.splice(itm.idx, 1);
                    r.dlgAdd.items.splice(itm.idx, 1);

                    if (r.dlgAdd.items.length > 0) {
                        for (let i = 0; i < r.dlgAdd.items.length; i++) {
                            let e = r.dlgAdd.items[i];
                            e.idx = i;
                        }
                    } else {
                        this.onBtnXhwUpAddList(0);
                    }
                } else {
                    --dlg.ud.limitCount;
                    dlg.ud.list.splice(itm.idx, 1);
                    dlg.items.splice(itm.idx, 1);
                    dlg.lab_kong.active = (dlg.ud.list.length<=0);
                }

                itm.destroy();

                dlg.lab_num.string = `已限制${dlg.ud.limitCount}人`;
            } else {
                cc.dlog('TEA_HOUSE_BLACK_GROUP_OPER 失败');
            }
        });
    }
    // 添加玩家---翻页
    XhwAddplr_scroll_to_bottom(scrollView) {
        // 回调的参数是 ScrollView 组件
        // do whatever you want with scrollview

        cc.log('添加玩家---翻页');

        let r = this.ctt['7'].dlgAdd;

        this.onBtnXhwUpAddList(r.ud.list.length);
    }
    // ------------小黑屋---------------------------------------------------------------------------------------
    ______() {}

    // ------------打样---------------------------------------------------------------------------------------
    onBtnCloseDayang(evt, data) {
        cc.dlog('onBtnCloseDayang', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['2'];

        let dy = 0;

        if (data==0) {
            r.active = false;
            return;
        }

        if (data==1) {
            cc.dlog(r.EditBox_dy.string);

            if (r.EditBox_dy.string == '是'){
                dy = 1;
            }

            r.EditBox_dy.string = '';
            //this.onBtnClose(0,0);
        }

        if (data==2) {
            dy = 2;
        }

        if (dy==0) return;

        {/*
            //茶馆打烊设置
            //@api:2218,@type:req
            message DySetTeaHouseReq{
                int32 teaHouseId=1;//茶馆Id
                int32 dyOpen=2;//打烊开关(1 开 0 关闭)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.DY_SET_TEA_HOUSE);
        req.teaHouseId = tea.teaHouseId;
        req.dyOpen = (dy==1) ? 1 : 0;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.DY_SET_TEA_HOUSE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('DY_SET_TEA_HOUSE 成功');

                // @ts-ignore
                cc.g.global.hint(req.dyOpen ? '成功打烊亲友圈' : '成功开启亲友圈');

                r.lab1.string = r.lab2.string = (req.dyOpen ? '开启' : '打烊');

                r.active = false;
            } else {
                cc.dlog('DY_SET_TEA_HOUSE 失败2');
            }
        });
    }
    // ------------打样---------------------------------------------------------------------------------------

    _() {}

    // ------------解散亲友圈---------------------------------------------------------------------------------------
    onBtnCloseJiesan(evt, data) {
        cc.dlog('onBtnCloseJiesan', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['3'];

        if (data==0) {
            r.active = false;
            return;
        }

        if (data==1) {
            cc.dlog(r.EditBox_js.string);

            if (r.EditBox_js.string != '是'){
                r.EditBox_js.string = '';
                return;
            } else {
                r.EditBox_js.string = '';
            }
        }

        {/*
            //解散茶馆
            //@api:2211,@type:req
            message DisbandTeaHouseReq{
                int32 teaHouseId=1;//茶馆Id
            }
            //@api:2211,@type:resp
            message DisbandTeaHouseResp{
                
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.DISBAND_TEA_HOUSE);
        req.teaHouseId = tea.teaHouseId;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.DISBAND_TEA_HOUSE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('DISBAND_TEA_HOUSE 成功');
            } else {
                cc.dlog('DISBAND_TEA_HOUSE 失败');
            }
        });
    }
    // ------------解散亲友圈---------------------------------------------------------------------------------------

    __() {}

    // ------------定时---------------------------------------------------------------------------------------
    onBtnCloseDingshi(evt, data) {
        cc.dlog('onBtnCloseDingshi', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['4'];

        r.sj.active = false;
        r.ist1 = false;
        r.hh = -1;
    }

    // 打开时间设置
    onBtnOpenTime(evt, data) {
        cc.dlog('onBtnOpenTime', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['4'];

        r.sj.active = true;
        r.h.active = true;
        r.m.active = false;

        r.ist1 = data=='1';
    }

    // 点击时间
    onBtnTime(evt, data) {
        cc.dlog('onBtnTime', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['4'];

        if (data.ishour) {
            r.h.active = false;
            r.m.active = true;
            r.hh = data.t;
        } else {
            let h = r.hh<10 ? '0'+r.hh : r.hh;
            let m = data.t<10 ? '0'+data.t : data.t;

            if (r.ist1) {
                r.tm1.string = `${h}:${m}`;
                r.h1 = r.hh;
                r.m1 = data.t;
            } else {
                r.tm2.string = `${h}:${m}`;
                r.h2 = r.hh;
                r.m2 = data.t;
            }

            this.onBtnCloseDingshi(0,0);
        }
    }

    // 保存定时
    onBtnSaveDingshi(evt, data) {
        cc.dlog('onBtnSaveDingshi');
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['4'];

        {/*
            //茶馆定时设置
            //@api:2219,@type:req
            message TimerSetTeaHouseReq{
                int32 teaHouseId=1;//茶馆Id
                string openTime=2;//定时开始时间(小时:分钟)
                string closeTime=3;//定时关闭时间(小时:分钟)
                int32  timerOpen=4;//定时开启开关(1 开 0 关闭)
                int32  timerClosed=5;//定时关闭开关(1 开 0 关闭)
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TIMER_SET_TEA_HOUSE);
        req.teaHouseId = tea.teaHouseId;
        req.openTime = r.tm1.string;
        req.closeTime = r.tm2.string;
        req.timerOpen = r.tog1.isChecked ? 1 : 0;
        req.timerClosed = r.tog2.isChecked ? 1 : 0;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TIMER_SET_TEA_HOUSE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err==PB.ERROR.OK) {
                //cc.dlog('TIMER_SET_TEA_HOUSE 成功');
                // @ts-ignore
                cc.g.global.hint('设置成功');

                tea.SettingData['ds_openTime'] = req.openTime;
                tea.SettingData['ds_closeTime'] = req.closeTime;
                tea.SettingData['ds_timerOpen'] = req.timerOpen;
                tea.SettingData['ds_timerClosed'] = req.timerClosed;
            } else {
                cc.dlog('TIMER_SET_TEA_HOUSE 失败');
            }
        });
    }
    // ------------定时---------------------------------------------------------------------------------------

    ___() {}

    // ------------桌子---------------------------------------------------------------------------------------
    // 桌子开关
    onTogDeskKaiguan(evt, data) {
        cc.dlog('onTogDeskKaiguan', data);
        // @ts-ignore
        cc.sys.localStorage.setItem('teaDeskIdx', data+'');

        // @ts-ignore
        // TeaClass.instance.doResetDeskType(true)
    }

    // ------------金币场---------------------------------------------------------------------------------------
    // 金币场开关
    onTogGoldKaiguan(evt, data) {
        cc.dlog('onTogGoldKaiguan', data);
    }
    // 保存金币场开关
    onBtnSaveGoldKg(evt, data) {
        cc.dlog('onBtnSaveGoldKg', data);
        // @ts-ignore
        cc.g.utils.btnShake();

        let r = this.ctt['5'];

        {/*
            //修改金币场开关
            //@api:2282,@type:req
            message ModifyGoldMatchOpenReq{
                int32    teaHouseId = 1;//茶馆Id
                bool     goldMatchOpen=2;//是否开启金币场(true 开,false关闭)
            }
        */}

        let change = 0;
        if (tea.SettingData.isGoldOpen) {
            if (r.tog1.isChecked){
                this.onBtnClose(0,0);
            } else {
                change = 1;
            }
        } else {
            if (r.tog2.isChecked){
                this.onBtnClose(0,0);
            } else {
                change = 2;
            }
        }

        if (change==0) return;

        // @ts-ignore
        cc.g.global.showTipBox(change==2 ? '确定开启吗？' : '确定关闭吗？', ()=>{
            // @ts-ignore
            let req = pbHelper.newReq(PB.PROTO.MODIFY_GOLD_MATCH_OPEN);
            req.teaHouseId = tea.teaHouseId;
            req.goldMatchOpen = change==2;

            let fun = ()=>{
                // @ts-ignore
                let req = pbHelper.newReq(PB.PROTO.MODIFY_GOLD_MATCH_SETTING);
                req.teaHouseId = TeaClass.instance.teaHouseId;
                req.matchFee = 0
                req.feeOpen1 = false;
                req.feeOpen2 = false;
                req.feeRate1 = 2;
                req.feeRate2 = 3;
                req.reviewOpen = false;

                // @ts-ignore 587410774
                req.matchFee = cc.g.utils.fixNum1(req.matchFee);

                // @ts-ignore
                cc.g.networkMgr.send(PB.PROTO.MODIFY_GOLD_MATCH_SETTING, req, (resp) => {
                    // @ts-ignore
                    if (!resp.err || resp.err == PB.ERROR.OK) {
                        //cc.dlog('MODIFY_GOLD_MATCH_SETTING 成功');
                        if (TeaClass.instance.teaHouseId != resp.teaHouseId) {
                            cc.dlog('MODIFY_GOLD_MATCH_SETTING 失败1');
                            return;
                        }

                        let d = TeaClass.instance.goldSetData;
                        d['matchFee']=resp.matchFee;
                        d['feeOpen1']=resp.feeOpen1;
                        d['feeOpen2']=resp.feeOpen2;
                        d['feeRate1']=resp.feeRate1;
                        d['feeRate2']=resp.feeRate2;
                        d['reviewOpen']=resp.reviewOpen;

                    } else {
                        cc.dlog('MODIFY_GOLD_MATCH_SETTING 失败2');
                    }
                });
            };

            // @ts-ignore
            cc.g.networkMgr.send(PB.PROTO.MODIFY_GOLD_MATCH_OPEN, req, (resp) => {
                // @ts-ignore
                if (!resp.err || resp.err==PB.ERROR.OK) {
                    //cc.dlog('MODIFY_GOLD_MATCH_OPEN 成功');
                    if (req.goldMatchOpen) {
                        //tea.showDlgGoldSet();

                        if (change == 2) {
                            cc.log('从关闭到开启开启');
                            fun();
                        }
                    }
                } else {
                    cc.dlog('MODIFY_GOLD_MATCH_OPEN 失败2');
                }
            });

            this.onBtnClose(0,0);
        });
    }
    // ------------金币场---------------------------------------------------------------------------------------

    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        // @ts-ignore
        cc.g.utils.btnShake();
        this.node.destroy();

        // 判断是否刷新桌子
        let intOldDeskType = parseInt(this.oldDeskType)
        // @ts-ignore
        let deskType = cc.g.utils.getDeskTypeIndex()
        cc.log('intOldDeskType-->' + intOldDeskType)
        cc.log('deskType-->' + deskType)
        if (intOldDeskType != deskType) {
            // @ts-ignore
            TeaClass.instance.doResetDeskType(true)
        }
    }
}
