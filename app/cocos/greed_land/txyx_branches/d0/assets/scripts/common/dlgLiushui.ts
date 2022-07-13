// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    scoItem: cc.Prefab = null;

    Label_roomid:cc.Label = null;
    Label_time:cc.Label = null;
    svSco:cc.ScrollView = null;

    ndPlrs:Array<cc.Node> = [];

    lsData:any = {};

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let r = this.node;

        this.Label_roomid = cc.find('Node_player/Label_roomid', r).getComponent(cc.Label);
        this.Label_time = cc.find('Node_player/Label_time', r).getComponent(cc.Label);

        this.ndPlrs = [];
        for (let i = 0; i < 10; ++i) {
            let p = cc.find('Node_player/hbox_plr/p' + (i+1), r);
            if (!p) break;
            this.ndPlrs.push(p);
        }

        this.svSco = cc.find('ScrollView_sco', r).getComponent(cc.ScrollView);
        this.svSco.content.destroyAllChildren();


        // close btn
        let closeOne = cc.find('Button_close', this.node)
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

    start () {

    }

    // update (dt) {}

    // ---------------------------------------------------------------------------------------------------

    up(data) {
        cc.log('up', data);

        this.node.active = true;

        cc.find('Node_player', this.node).active = false;
        cc.find('ScrollView_sco', this.node).active = false;
        
        this.upLiushuiData();
    }

    upLiushuiData() {

        {/*
            //@api:1021,@type:req
            message GetPlayerScoreReq{}

            //@api:1021,@type:resp
            message GetPlayerScoreResp{
                repeated ScoreInfo list = 1;
                int64 data = 2;
            }

            message ScoreInfo {
                repeated int32 values = 1;
                int32 total = 2;
                int64 uid = 3;
                string name = 4;
                string icon = 5;
            }
        */}

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.GET_PLAYERS_SCORE);
        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.GET_PLAYERS_SCORE, req, (resp) => {
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                //cc.log('创建俱乐部包间 成功');

                this.lsData.data = resp.data;
                this.lsData.list=[];
                resp.list.forEach(e => {
                    let o = {
                        total:e.total,
                        uid:e.uid,
                        name:e.name,
                        icon:e.icon,
                        sco:[],
                    };
                    e.values.forEach(v =>o.sco.push(v));
                    this.lsData.list.push(o);
                });

                cc.log('lsData', this.lsData);

                if (this.node.active) {
                    this.upView();
                }

            } else {
                //cc.log('创建俱乐部包间 失败');
            }
        });
    }

    upView() {
        cc.log('upView');

        cc.find('Node_player', this.node).active = true;
        cc.find('ScrollView_sco', this.node).active = true;

        /*
            let o = {
                total:e.total,
                uid:e.uid,
                name:e.name,
                icon:e.icon,
                sco:[],
            };
            e.values.forEach(v =>o.sco.push(v));
            this.lsData.push(o);
        */

        // @ts-ignore
        this.Label_roomid.string = '房号:'+cc.g.hallMgr.curGameMgr.roomInfo.roomId+' ';
        // @ts-ignore
        this.Label_time.string = cc.g.utils.getFormatTimeXXX(this.lsData.data * 1000, '|Y|:|M|:|D|  |h|:|m|:|s| ');

        
        // 玩家
        this.ndPlrs.forEach(e => e.active = false);

        let num = this.lsData.list ? this.lsData.list.length : 0;
        let W = num>0 ? 1000/num : 0;//UI界面分配1000的宽度
        for (let i = 0; i < this.ndPlrs.length; ++i) {
            let n = this.ndPlrs[i];
            if (i>=num) {
                continue;
            }
            n.active = true;
            n.width = W;

            let d = this.lsData.list[i];

            // @ts-ignore
            let total = cc.g.utils.realNum1(d.total);

            // @ts-ignore 名字 
            cc.find('Label_name', n).getComponent(cc.Label).string = d.name;
            // @ts-ignore 分数
            let sco = cc.find('Label_sco', n).getComponent(cc.Label);
            if (total > 0) {
                sco.string = `+${total}`;
            } else if (total < 0) { 
                sco.string = `${total}`;
            } else {
                sco.string = '0';
            }
        }
        

        // 分数
        let ctt = this.svSco.content;
        ctt.destroyAllChildren();
        let truns = num>0 ? this.lsData.list[0].sco.length : 0;// 局数
        for (let i = 0; i < truns; ++i) {
            let itm = cc.instantiate(this.scoItem);
            
            // 序号
            cc.find('Label_idx', itm).getComponent(cc.Label).string = `${i+1}`;

            let hbox_sco = cc.find('hbox_sco', itm);
            for (let j = 0; j < 7; ++j) {
                let si = cc.find('s' + (j+1), hbox_sco);
                si.active = false;
                if (j>=num) {
                    continue;
                }
                si.active = true;
                si.width = W;
                
                let sco = this.lsData.list[j].sco[i];//每个 玩家 当前局数 的分数

                // @ts-ignore 分数
                sco = cc.g.utils.realNum1(sco);

                // @ts-ignore 分数
                let labsco = cc.find('sco', si).getComponent(cc.Label);
                if (sco > 0) {
                    labsco.string = `+${sco}`;
                } else if (sco < 0) { 
                    labsco.string = `${sco}`;
                } else {
                    labsco.string = '0';
                }
            }

            ctt.addChild(itm);
        }
    }

    onBtnClose(evt, data) {
        cc.log('onBtnClose');
        //this.node.destroy();
        this.node.active = false;
    }
}
