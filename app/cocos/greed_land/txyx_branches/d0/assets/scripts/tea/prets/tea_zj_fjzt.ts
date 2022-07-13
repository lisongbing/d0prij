// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// 随便点
let m:any = {};

@ccclass
export default class ZjFanJianStatue extends cc.Component {
    @property(cc.Prefab)
    item: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // close btn
        let closeOne = cc.find('CloseButton', this.node)
        let closeTwo = cc.find('CloseButtonMin', this.node)
        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            closeOne.active = false
            closeTwo.active = true
        } else {
            closeOne.active = true
            closeTwo.active = false
        }

        this.initView();
    }
    initView () {
        let r = this.node;

        m.Label_room = cc.find('Label_room', this.node).getComponent(cc.Label);
        m.Label_yuanyin = cc.find('Label_yuanyin', this.node).getComponent(cc.Label);
        m.Label_time = cc.find('Label_time', this.node).getComponent(cc.Label);

        m.sv_list = cc.find('sv_list', this.node).getComponent(cc.ScrollView);
    }

    start () {

    }

    // update (dt) {}

    up (data) {
        cc.log('tea_zj_fjzt up');

        let ctt = m.sv_list.content;
        ctt.destroyAllChildren();
        
        if (!data || !data.roomInfo) {
            return;
        }

        let d = data.roomInfo;
        cc.log('roomInfo', d);

        {/*
            dissolveReason: "正常解散"
            list: Array(2)
            0: Message
                icon: "2"
                name: "游客2a559e"
                startGold: Long {low: 8888900, high: 0, unsigned: false}
                uid: Long {low: 2774430, high: 0, unsigned: false}
                winGold: Long {low: 600, high: 0, unsigned: false}
            1: Message
                icon: "1"
                name: "游客2a4493"
                startGold: Long {low: 1111100, high: 0, unsigned: false}
                uid: Long {low: 2770067, high: 0, unsigned: false}
                winGold: Long {low: -600, high: -1, unsigned: false}
            roomId: 6698227
            startTime: Long {low: 1642646498, high: 0, unsigned: false}
        */}

        m.Label_room.string = '房间号: ' + d.roomId;
        m.Label_yuanyin.string = '房间结束原因: ' + d.dissolveReason;
        // @ts-ignore
        m.Label_time.string = '时间: '+ cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(d.startTime*1000));

        for (let i = 0; i < d.list.length; ++i) {
            let e = d.list[i];

            // @ts-ignore
            let itm = cc.instantiate(this.item);

            // @ts-ignore
            let head = cc.find('Node_headMask/Sprite_head', itm);
            // @ts-ignore
            cc.g.utils.setHead(head, e.icon);

            // @ts-ignore
            cc.find('name', itm).getComponent(cc.Label).string = e.name;
            // @ts-ignore
            cc.find('id', itm).getComponent(cc.Label).string = ''+i64v(e.uid);

            // @ts-ignore
            let ingold = cc.g.utils.realNum1(i64v(e.startGold));
            // @ts-ignore
            let winGold  = cc.g.utils.realNum1(i64v(e.winGold));

            // @ts-ignore
            cc.find('gold_in', itm).getComponent(cc.Label).string = ''+ingold;
            // @ts-ignore
            cc.find('sco', itm).getComponent(cc.Label).string = ''+winGold;
            // @ts-ignore
            cc.find('gold_out', itm).getComponent(cc.Label).string = '' + (ingold + winGold);

            // @ts-ignore
            ctt.addChild(itm);
        }
    }


    doClosePop() {
        // @ts-ignore
        this.node.destroy();
    }
}
