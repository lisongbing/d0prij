// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }

    // update (dt) {}

    up(data) {
        cc.log('up', data);

        let Button_jiesan = cc.find('btns/Button_jiesan', this.node);
        let Button_tuichu = cc.find('btns/Button_tuichu', this.node);

        Button_jiesan.active = Button_tuichu.active = false;

        // @ts-ignore
        if (cc.g.hallMgr.curGameType > 0) {
            //在游戏中,不能退出登录
            //this.btn_logout..getComponent(cc.Button).interactable = false; //灰色

            // @ts-ignore 房间状态
            let ri = cc.g.hallMgr.curGameMgr.roomInfo;
            if (ri.type == 2 || ri.type == 5) {
                if (ri.status<=0 && ri.curGameNum<=0) {
                    Button_tuichu.active = true;
                } else {
                    Button_jiesan.active = true;
                }
            } else {
                Button_tuichu.active = true;
            }
        }
    }


    // 
    onBtnSet (event, customEventData) {
        // @ts-ignore
        // cc.g.networkMgr.close(true);
        // cc.game.restart();
        // return;

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.inGameMenu.onClickSetting();

        this.onBtnClose(0,0);
    }

    // 退出房间
    onBtnOutRoom (event, customEventData) {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.exitGame();

        this.onBtnClose(0,0);
    }

    // 申请解散房间
    onBtnJiesanRoom (event, customEventData) {
        // @ts-ignore
        cc.g.utils.btnShake();
        
        let AskJiesan = {
            v: 997,
            s: '申请解散',
        };

        // @ts-ignore
        if (cc.g.hallMgr.curGameType > 0) {
            // @ts-ignore
            cc.g.hallMgr.curGameMgr.sendOp(AskJiesan.v);
        }

        this.onBtnClose(0,0);
    }

    onBtnClose(evt, data) {
        cc.log('onBtnClose');
        
        this.node.active = false;
    }
}
