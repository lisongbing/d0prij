// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

let tea = null;
let l_goupR = false;

@ccclass
export default class Guanlianid extends cc.Component {

    @property(cc.Prefab)
    itmecy: cc.Prefab = null;

    head: cc.Sprite;
    // @ts-ignore
    name: cc.Label;
    id: cc.Label;

    sv_left:cc.ScrollView;
    sv_right:cc.ScrollView;
    
    eb_search:cc.EditBox;

    data:any;

    glD:any; // 关联数据
    cyD:any; // 成员数据

    //@property
    //text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        tea = TeaClass.instance;

        this.glD = {
            pageNum:0,
            totalPage:0,
            list:[],
            togs:{},
        };
        this.cyD = {
            pageNum:0,
            totalPage:0,
            list:[],
            togs:{},
        };

        this.initView();
    }

    initView () {
        let r = this.node;

        this.head = cc.find('head/mask/Sprite_head', r).getComponent(cc.Sprite);
        this.name = cc.find('head/name', r).getComponent(cc.Label);
        this.id = cc.find('head/id', r).getComponent(cc.Label);

        this.sv_left = cc.find('ScrollView_Left', r).getComponent(cc.ScrollView);
        this.sv_right = cc.find('ScrollView_Right', r).getComponent(cc.ScrollView);
        this.sv_left.content.destroyAllChildren();
        this.sv_right.content.destroyAllChildren();

        this.eb_search = cc.find('EditBox_search', r).getComponent(cc.EditBox);
        
    }

    start () {

    }

    // update (dt) {}

    up (data) {
        cc.dlog('up', data);

        this.data = data;

        {/*
            associate: false
            forbidGame: false
            groupName: ""
            icon: "1"
            name: "游客fec27"
            offlineTime: 3685
            online: false
            onlyTwoPeople: false
            position: 1
            reviewerId: Long {low: 1073268, high: 0, unsigned: false}
            reviewerName: "游客106074"
            showExit: false
            status: 0
            teamId: 0
            userId: Long {low: 1043495, high: 0, unsigned: false}
        */}

        // @ts-ignore
        cc.g.utils.sethead(this.head, data.icon);
        this.name.string = data.name;
        // @ts-ignore
        this.id.string = i64v(data.userId);

        l_goupR = true;
        this.upLeft(null);
    }
    
    upLeft (pg) {
        cc.dlog('upLeft');

        if (!pg) {
            pg = 1;

            this.glD = {
                pageNum:0,
                totalPage:0,
                list:[],
                togs:{},
            };
        }

        {/*
            //茶馆成员关联列表
            //@api:2322,@type:req
            message TeaHouseAssociateListReq {
                int32    teaHouseId=1;//茶馆Id
                bool     associate=2;//是否已关联
                int64    targetUserId=3;//目标用户Id
                string   searchId=4;//搜索Id
                int32    pageNum=5;//当前页码数
                int32    pageSize=6;//每页显示条数 
            }
            //返回茶馆成员关联列表
            //@api:2322,@type:resp
            message TeaHouseAssociateListResp{
                int32    teaHouseId=1;//茶馆Id
                bool     associate=2;//是否已关联
                int64    targetUserId=3;//目标用户Id
                int32    pageNum=4;//当前页码数    
                int32    pageSize=5;//每页显示条数 
                int32    totalCount=6;//总条数
                int32    totalPage=7;//总页数
                repeated AssociateUser   list=8;//成员关联列表
            }
            //关联用户
            message AssociateUser {
                int64     userId=1;//用户Id
                string    name=2;//用户昵称
                string    icon=3;//用户头像
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ASSOCIATE_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.associate = true;
        req.targetUserId = this.data.userId;
        req.pageNum = pg;
        req.pageSize = 50;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ASSOCIATE_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog(' 成功');
                
                this.glD.pageNum = resp.pageNum;
                this.glD.totalPage = resp.totalPage;

                resp.list.forEach(e => {
                    this.glD.list.push({
                        userId:e.userId,
                        name:e.name,
                        icon:e.icon,
                    });
                });
                
                cc.dlog('this.glD', this.glD);

                this.upviewL();

                if (l_goupR) {
                    // @ts-ignore
                    this.upRight();
                }
            } else {
                //cc.dlog(' 失败');
            }
        });
    }
    upviewL () {
        cc.dlog('upviewL');

        let list = this.glD.list;

        let ctt = this.sv_left.content;
        if (!this.glD.itmN) {
            ctt.destroyAllChildren();
            this.glD.itmN = 0;
        }

        for (let i = this.glD.itmN; i < list.length; i++) {
            let d = list[i];
            
            let itm = cc.instantiate(this.itmecy);
            // @ts-ignore
            itm.ud = d;
            // @ts-ignore
            itm.grp = 'gl';

            cc.find('name', itm).getComponent(cc.Label).string = d.name;
            // @ts-ignore
            cc.find('id', itm).getComponent(cc.Label).string = i64v(d.userId);

            // @ts-ignore
            itm.tog = cc.find('Toggle', itm).getComponent(cc.Toggle);

            // @ts-ignore
            cc.g.utils.addCheckEvent(itm.tog.node, this.node, 'tea_glid', 'onCheckGouxian', itm);

            ctt.addChild(itm);

            ++this.glD.itmN;
        }
    }

    upRight (pg, id) {
        cc.dlog('upRight');

        if (!pg) {
            pg = 1;

            this.cyD = {
                pageNum:0,
                totalPage:0,
                list:[],
                togs:{},
            };
        }

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_ASSOCIATE_LIST);
        req.teaHouseId = tea.teaHouseId;
        req.associate = false;
        req.targetUserId = this.data.userId;
        req.searchId = id || '';
        req.pageNum = pg;
        req.pageSize = 50;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_ASSOCIATE_LIST, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog(' 成功');

                this.cyD.pageNum = resp.pageNum;
                this.cyD.totalPage = resp.totalPage;

                resp.list.forEach(e => {
                    this.cyD.list.push({
                        userId:e.userId,
                        name:e.name,
                        icon:e.icon,
                    });
                });

                cc.dlog('this.cyD', this.cyD);

                this.upviewR();
            } else {
                //cc.dlog(' 失败');
            }
        });
    }
    upviewR () {
        cc.dlog('upviewR');

        let list = this.cyD.list;

        let ctt = this.sv_right.content;

        if (!this.cyD.itmN) {
            ctt.destroyAllChildren();
            this.cyD.itmN = 0;
        }
        
        for (let i = this.cyD.itmN; i < list.length; i++) {
            let d = list[i];
            
            let itm = cc.instantiate(this.itmecy);
            // @ts-ignore
            itm.ud = d;
            // @ts-ignore
            itm.grp = 'cy';

            cc.find('name', itm).getComponent(cc.Label).string = d.name;
            // @ts-ignore
            cc.find('id', itm).getComponent(cc.Label).string = i64v(d.userId);

            // @ts-ignore
            itm.tog = cc.find('Toggle', itm).getComponent(cc.Toggle);

            // @ts-ignore
            cc.g.utils.addCheckEvent(itm.tog.node, this.node, 'tea_glid', 'onCheckGouxian', itm);

            ctt.addChild(itm);

            ++this.cyD.itmN;
        }
    }



    // 勾选
    onCheckGouxian(evt, itm) {
        cc.dlog('onCheckGouxian 勾选 ', itm.ud.userId, itm.grp);

        if (itm.grp == 'gl') {
            //this.glD.togs[itm.ud.userId] = evt.isChecked;
            //cc.dlog('this.glD.togs', this.glD.togs);
        } else if (itm.grp == 'cy') {
            if (evt.isChecked) {
                this.cyD.togs[itm.ud.userId] = itm;
            } else {
                delete this.cyD.togs[itm.ud.userId];
            }
            
            //cc.dlog('this.cyD.togs', this.cyD.togs);
        }
    }

    // 取消关联
    onBtnQuxiaogl(evt, data) {
        cc.dlog('onBtnQuxiaogl 取消关联');

        // @ts-ignore
        cc.g.utils.btnShake();

        let rmv = [];
        let cur = [];

        let ctt = this.sv_left.content;
        let child = ctt.children;
        child.forEach(e => {
            // @ts-ignore
            if (e.tog.isChecked)
                rmv.push(e);
            else  {
                // @ts-ignore
                cur.push(e.ud);
            }
        });

        if (rmv.length <= 0) return;

        this.glD.list = cur;
        this.glD.itmN = this.glD.list.length;
        
        


        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SET_ASSOCIATE);
        req.teaHouseId = tea.teaHouseId;
        req.associate = false;
        req.targetUserId = this.data.userId;

        rmv.forEach(e => {
            req.list.push(e.ud.userId);
            e.destroy();
        });

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SET_ASSOCIATE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog(' 成功');
                this.upRight(null, null);
            } else {
                //cc.dlog(' 失败');
            }
        });
    }
    // 关联
    onBtnGuanlian(evt, data) {
        cc.dlog('onBtnGuanlian 关联');

        // @ts-ignore
        cc.g.utils.btnShake();

        let add = [];
        for (const key in this.cyD.togs) {
            let e = this.cyD.togs[key];
            // @ts-ignore
            let d = cc.g.clone(e.ud);
            // @ts-ignore
            d.userId = i64v(e.ud.userId);// 实际结果是复制出来的userId没有toNumber方法
            add.push(d);
            e.destroy();
        }
        this.cyD.togs = {};

        cc.dlog('add', add);

        if (add.length <= 0) return;

        this.glD.list = this.glD.list.concat(add);
        this.upviewL();

        {/*
            //设置成员关联
            //@api:2323,@type:req
            message TeaHouseSetAssociateReq {
                int32    teaHouseId=1;//茶馆Id
                bool     associate=2;//是否关联(true 添加关联 false 取消关联)
                int64    targetUserId=3;//目标用户Id
                repeated int64   list=4;//成员关联列表
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_SET_ASSOCIATE);
        req.teaHouseId = tea.teaHouseId;
        req.associate = true;
        req.targetUserId = this.data.userId;

        add.forEach(e => req.list.push(e.userId));

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_SET_ASSOCIATE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.dlog(' 成功');
                // @ts-ignore
                this.upRight(null);
            } else {
                //cc.dlog(' 失败');
            }
        });
    }

    // 搜索
    onBtnSeach(evt, data) {
        cc.dlog('onBtnSeach 搜索');

        // @ts-ignore
        cc.g.utils.btnShake();

        let s = this.eb_search.string;
        this.upRight(null, s);
    }
    


    onBtnClose(evt, data) {
        cc.dlog('onBtnClose');
        this.node.active = false;
    }
}
