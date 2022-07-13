// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaClass from "../tea";

// @ts-ignore
const {ccclass, property} = cc._decorator;

let getPlayNum = (n) => {
    let playNum = n;
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

    return playNum;
}

let getBgType = (id)=> {
    let tp = -1;

    // @ts-ignore
    for (const t in GMGrp) {
        // @ts-ignore
        const idseq = GMGrp[t];
        for (let i = 0; i < idseq.length; i++) {
            if (idseq[i] == id) {
                tp = 0;
                if (t=='mahjong') {
                    tp = 1;
                } else if (t=='poker') {
                    tp = 2;
                }
                break;
            }
        }

        if (tp>=0) break;
    }

    return tp;
};

@ccclass
// @ts-ignore
export default class NewClass extends cc.Component {

    @property(cc.SpriteAtlas)
    // @ts-ignore
    hallAtlas: cc.SpriteAtlas = null;
    
    @property(cc.Prefab)
    // @ts-ignore
    Item: cc.Prefab = null;

    
    Node_tuijian:any = null;
    sv_play:cc.Component = null;

    playData:any = [];

    tjData:any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initView();
    }

    initView() {
        cc.log('initView');

        let r = this.node;

        // 推荐
        this.Node_tuijian = cc.find('Node_tuijian', r);
        let o:any = {};
        o.bg = cc.find('Sprite_game', this.Node_tuijian).getComponent(cc.Sprite);
        o.icon = cc.find('Sprite_game/icon', this.Node_tuijian).getComponent(cc.Sprite);
        o.gn = cc.find('Sprite_game/Label_gn', this.Node_tuijian).getComponent(cc.Label);
        o.name = cc.find('Label_name', this.Node_tuijian).getComponent(cc.Label);
        o.ren = cc.find('Label_ren', this.Node_tuijian).getComponent(cc.Label);
        o.rule = cc.find('mask/Label_rule', this.Node_tuijian).getComponent(cc.Label);
        o.btn = cc.find('Button_ksks', this.Node_tuijian);
        this.Node_tuijian.nodes = o;

        // @ts-ignore
        cc.g.utils.addClickEvent(o.btn, this.node, 'tea_ksks', 'onBtnStar', 'tujian');

        // 玩法
        this.sv_play = cc.find('ScrollView_list', r).getComponent(cc.ScrollView);

        this.up();
    }

    start () {

    }

    // update (dt) {}

    up() {
        // @ts-ignore
        cc.log('up');

        this.Node_tuijian.active = false;
        this.sv_play.node.active = false;

        this.upPlay();
    }

    upPlay() {
        cc.log('upPlay');

        {/*
            //茶馆大厅(玩法列表，金币场数据，职位数据)
            //@api:2240,@type:req
            message TeaHouseHallReq{
                int32 teaHouseId = 1;//茶馆Id
            }
            //@api:2240,@type:resp
            message TeaHouseHallResp{
                ...
                repeated TeaHouseRoomRule list=25;//包间列表(玩法列表) 
                ...
            }

            //茶馆包间规则(玩法)
            message TeaHouseRoomRule {
                int32 floor =1;//楼层
                string name =2;//名称
                bool  closeStatus =3;//关闭入口(true 开启关闭入口 false未勾选关闭入口)
                int64 base = 4; //底分
                int32 playNum = 5;//游戏人数
                int32 gameNum = 6;//游戏局数
                int32 gameType = 7;//游戏种类
                int64 winnerScore = 8;//大赢家分数
                repeated int32 rule = 9; //规则
                repeated int32 specialRule = 10; //特殊规则(k-v结构)
                ExpendSpeciThing expendSpeciThing = 11;//特定字段
                GoldMatchRoomRule goldMatchRule = 12;//金币场包间规则
                int32 origin  = 13;//地区
            }
        */}

        let ls = cc.sys.localStorage.getItem('tea_lastStar');
        if (ls) {
            ls = JSON.parse(ls);
        }

        let tea = TeaClass.instance;

        this.playData = [];

        // @ts-ignore
        let req = pbHelper.newReq(PB.PROTO.TEA_HOUSE_HALL);
        // @ts-ignore
        req.teaHouseId = tea.teaHouseId;

        // @ts-ignore
        cc.g.networkMgr.send(PB.PROTO.TEA_HOUSE_HALL, req, (resp)=>{
            // @ts-ignore
            if (!resp.err || resp.err == PB.ERROR.OK) {
                cc.log('upPlay 成功');
                
                // let qyqd = {};
                // qyqd['teaHouseId'] = resp.teaHouseId;//茶馆Id

                let tj = null;

                resp.list.forEach(e => {
                    let o:any = {};

                    o.floor = e.floor;
                    o.name = e.name;
                    o.playNum = e.playNum;
                    o.gameNum = e.gameNum;
                    o.gameType = e.gameType;
                    o.origin = e.origin;

                    o.rule = [];
                    e.rule.forEach(r =>o.rule.push(r));
                    o.specialRule = [];
                    e.specialRule.forEach(sr =>o.specialRule.push(sr));

                    o.base = e.base;
                    o.origin = e.origin;
                    o.winnerScore = e.winnerScore;
                    o.expendSpeciThing = e.expendSpeciThing;
                    o.goldMatchRule = e.goldMatchRule;

                    if (!tj) {
                        tj = o;
                    }

                    if (ls && (o.floor==ls.floor&&o.gameType==ls.gameType&&o.name==ls.name)) {
                        tj = o;
                    }

                    this.playData.push(o);
                });
                
                if (tj) {
                    this.tjData = tj;
                    this.upTuijian();
                }

                this.upView();
            }
        });
    }
    upView() {
        cc.log('upView');

        this.sv_play.node.active = true;

        // @ts-ignore
        let ctt = this.sv_play.content;
        ctt.destroyAllChildren();

        let i = 0;
        this.playData.forEach(e => {
            let itm = cc.instantiate(this.Item);

            let idx = cc.find('Label_idx', itm).getComponent(cc.Label);
            idx.string = '' + ++i;

            let bg = cc.find('Sprite_game', itm).getComponent(cc.Sprite);
            bg.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gibg_${getBgType(e.gameType)}`);

            let icon = cc.find('Sprite_game/icon', itm).getComponent(cc.Sprite);
            icon.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gi_${e.gameType}_${e.origin}`);

            let gn = cc.find('Sprite_game/Label_gn', itm).getComponent(cc.Label);
            // @ts-ignore
            gn.string = cc.g.utils.getGameName(e.gameType, e.origin);

            let name = cc.find('Label_name', itm).getComponent(cc.Label);
            name.string = e.name;

            let ren = cc.find('Label_ren', itm).getComponent(cc.Label);
            ren.string = getPlayNum(e.gameType) +'人' + e.gameNum + '局';
            
            let rule = cc.find('mask/Label_rule', itm).getComponent(cc.Label);
            // @ts-ignore
            rule.string = cc.g.utils.convertRuleToString(e);
 
            // @ts-ignore
            cc.g.utils.addClickEvent(cc.find('Button_ksks', itm), this.node, 'tea_ksks', 'onBtnStar', e);

            ctt.addChild(itm);
        });
    }

    upTuijian() {
        cc.log('upTuijian', this.tjData);

        this.Node_tuijian.active = true;
        let o = this.Node_tuijian.nodes;
        let d = this.tjData;

        o.bg.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gibg_${getBgType(d.gameType)}`);
        o.icon.spriteFrame = this.hallAtlas.getSpriteFrame(`hall_gi_${d.gameType}_${d.origin}`);
        // @ts-ignore
        o.gn.string = cc.g.utils.getGameName(d.gameType, d.origin);
        o.name.string = d.name;
        o.ren.string = getPlayNum(d.gameType) +'人' + d.gameNum + '局';
        // @ts-ignore
        o.rule.string = cc.g.utils.convertRuleToString(d);
    }

    onBtnStar(evt, d) {
        if (d == 'tujian') {
            d = this.tjData;
        }

        cc.log('onBtnStar', d);

        let lastStar = {
            floor: d.floor,
            //gameNum: d.floor,
            gameType: d.gameType,
            //origin: d.origin,
            //playNum: d.playNum,
            name: d.name,
        };

        cc.sys.localStorage.setItem('tea_lastStar', JSON.stringify(lastStar));

        this.onBtnClose(0, 0);

        TeaClass.instance.doRealEnterTeaHall(d, -1);
    }
    

    onBtnClose(evt, data) {
        cc.log('onBtnClose');
        
        this.node.destroy();
    }
}
