// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    hbox_player:any = null;
    Toggle_pingbi:any = [];
    Label_page:any = null;

    qyqData:any = {};

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let r = this.node;

        this.hbox_player = cc.find('hbox_player', r);
        this.Toggle_pingbi = cc.find('Toggle_pingbi', r).getComponent(cc.Toggle);
        this.Label_page = cc.find('Label_page', r).getComponent(cc.Label);
        this.Label_page.string = '0/0';
    }

    start () {

    }

    // update (dt) {}

    // ---------------------------------------------------------------------------------------------------

    up(data) {
        cc.log('up', data);

        this.node.active = true;
        this.hbox_player.active = false;

        this.qyqData.pageNum = this.qyqData.totalPage = 0;
        
        this.upData(null);
    }

    // 
    upData(page) {
        cc.log('upData');

        page = page||1;

        {/*
            //(游戏内)亲友圈邀请的玩家列表
            //@api:2314,@type:req
            message InviteThPlayerListReq{
                int32    teaHouseId=1;//茶馆Id
                bool     filterStart=2;//是否屏蔽开局玩家
                int32    pageNum=3;//当前页码数
                int32    pageSize=4;//每页显示条数 
            }
            //@api:2314,@type:resp
            message  InviteThPlayerListResp{
                int32    teaHouseId=1;//茶馆Id
                int32    pageNum=2;//当前页码数    
                int32    pageSize=3;//每页显示条数 
                int32    totalCount=4;//总条数
                int32    totalPage=5;//总页数
                repeated ThPlayerInfo   list=6;//(游戏内)亲友圈邀请的玩家列表
            }

            //亲友圈邀请的玩家的信息
            message ThPlayerInfo {
                int64     userId=1;//用户Id
                string    name=2;//用户昵称
                string    icon=3;//用户头像
                bool      online=4;//是否在线
                int32     status=5;//状态(0 空闲 1 游戏中 2比赛中)
            }
        */}

        let qyqd = this.qyqData;

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_PLAYER_LIST);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        req.filterStart = this.Toggle_pingbi.isChecked;
        req.pageNum = page;
        req.pageSize = 5;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_PLAYER_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');
                qyqd.teaHouseId = resp.teaHouseId;//茶馆Id
                qyqd.pageNum = resp.pageNum;//当前页码数
                qyqd.pageSize = resp.pageSize;//每页显示条数
                qyqd.totalCount = resp.totalCount;//总条数
                qyqd.totalPage = resp.totalPage;//总页数
                qyqd.list = qyqd.list || [];

                let a = [];
                resp.list.forEach(e => {
                    let o = {
                        userId:e.userId,
                        name:e.name,
                        icon:e.icon,
                        online:e.online,
                        status:e.status,
                    };
                    a.push(o);
                });

                qyqd.list[qyqd.pageNum] = a;

                cc.log('qyqData', this.qyqData);

                this.upview();
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }

    upview() {
        cc.log('upview');

        /*
            int64     userId=1;//用户Id
            string    name=2;//用户昵称
            string    icon=3;//用户头像
            bool      online=4;//是否在线
            int32     status=5;//状态(0 空闲 1 游戏中 2比赛中)
        */

        this.hbox_player.active = true;

        let qyqd = this.qyqData;
        let list = qyqd.list[qyqd.pageNum];

        for (let i = 0; i < 5; ++i) {
            let p = cc.find('p'+(i+1), this.hbox_player);
            p.active = false;
            if (i>=list.length) {
                continue;
            }

            p.active = true;

            let d = list[i];

            // @ts-ignore 头像
            cc.g.utils.setHead(cc.find('Node_headMask/Sprite_head', p), d.icon);
            //
            cc.find('Label_name', p).getComponent(cc.Label).string = d.name;
            //
            cc.find('Label_zx', p).active = (d.status==0);
            cc.find('Label_yxz', p).active = !(d.status==0);

            // @ts-ignore
            let btn = cc.find('Label_zx/Button_yq', p);
            // @ts-ignore
            cc.g.utils.addClickEvent(cc.find('Label_zx/Button_yq', p), this.node, 'dlgQyqyq', 'onBtnYaoqing', d);
        }

        this.Label_page.string = `${this.qyqData.pageNum}/${this.qyqData.totalPage}`;
    }


    // 屏蔽
    onTopPingbi(evt, data) {
        cc.log('onTopPingbi');

        this.onBtnRefresh(0,0);
    }

    // 刷新
    onBtnRefresh(evt, data) {
        cc.log('onBtnRefresh');

        this.upData(null);
    }

    //
    onBtnYaoqing(evt, data) {
        cc.log('onBtnYaoqing', data);

        // @ts-ignore
        cc.g.utils.btnShake();

        {/*
            //(游戏内)邀请亲友圈玩家加入游戏
            //@api:2315,@type:req
            message  InviteThPlayerJoinGameReq{
                int32    teaHouseId=1;//茶馆Id
                int64    userId=2;//用户Id
                int32    floor = 3;//楼层号(0-50)
                int32    deskNo = 4;//桌子号
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_PLAYER);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        req.userId = data.userId;
        // @ts-ignore
        req.floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        // @ts-ignore
        req.deskNo = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.deskIndex;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_PLAYER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }


    // 一键邀请
    onBtnYjyq(evt, data) {
        cc.log('onBtnYjyq');

        // @ts-ignore
        cc.g.utils.btnShake();

        if (!cc.g.qyqyjyqCD) {
            cc.g.qyqyjyqCD = 0;
        }

        let now = Date.now();
        let past = now - cc.g.qyqyjyqCD;
        if (past <= 15*1000) {
            cc.g.global.hint('已发送邀请，请稍后再试');
            this.onBtnClose(0,0);
            return;
        }

        {/*
            //(游戏内)一键邀请亲友圈所有在线玩家加入游戏
            //@api:2316,@type:req
            message  InviteThAllPlayerJoinGameReq{
                int32    teaHouseId=1;//茶馆Id
                int32    floor = 2;//楼层号(0-50)
                int32    deskNo = 3;//桌子号
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.INVITE_TH_ALL_PLAYER);
        // @ts-ignore
        req.teaHouseId = cc.g.hallMgr.curGameMgr.roomInfo.clubId;
        // @ts-ignore
        req.floor = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.roomUid;
        // @ts-ignore
        req.deskNo = cc.g.hallMgr.curGameMgr.roomInfo.clubdesk.deskIndex;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.INVITE_TH_ALL_PLAYER, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');
                cc.g.global.hint('邀请成功');
                cc.g.qyqyjyqCD = Date.now();

                this.onBtnClose(0,0);
            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }

    // 翻页
    onBtnPage(evt, data) {
        cc.log('onBtnPage', data);

        // @ts-ignore
        cc.g.utils.btnShake();

        let qyqd = this.qyqData;

        // 上页
        if (data == 'up') {
            if (qyqd.pageNum<=1) return;

            --qyqd.pageNum;
            this.upview();

            return;
        }
        
        // 下页
        if (qyqd.pageNum>=qyqd.totalPage) return;

        if (qyqd.list[qyqd.pageNum + 1]) {
            ++qyqd.pageNum;
            this.upview();
        } else {
            this.upData(qyqd.pageNum + 1);
        }
    }

    onBtnClose(evt, data) {
        cc.log('onBtnClose');
        
        this.node.active = false;
    }
}
