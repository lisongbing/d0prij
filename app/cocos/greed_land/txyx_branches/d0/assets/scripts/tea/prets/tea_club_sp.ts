// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaQuanClass from "../tea_quan";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaClubShenHe extends cc.Component {
    teaDatas: any[] = []
    mainScrollView: cc.ScrollView = null;
    teaHouseId: string = null;

    @property(cc.Prefab)
    listItemPre: cc.Prefab = null;

    doCloseDialog() {
        this.node.active = false;
    }
    onLoad () {
        this.initView();
    }
    initView() {
        this.mainScrollView = cc.find("ScrollView_Content", this.node).getComponent(cc.ScrollView);
    }
    setTeaId(teaHouseId: string) {
        this.teaHouseId = teaHouseId;
    }
    createViewWithDatas() {
        this.mainScrollView.content.removeAllChildren(true);
        // 显示数据
        this.teaDatas.forEach((item) => {
            let cardNode = cc.instantiate(this.listItemPre);

            let headerImage = cc.find("Node_Content/Sprite_Header", cardNode).getComponent(cc.Sprite);
            // if (item.icon.length > 4) {
            //     // @ts-ignore
            //     cc.g.utils.setUrlTexture(headerImage, item.icon);
            // } else {
            //     let spriteFrame = TeaQuanClass.instance.teaAtlas.getSpriteFrame('tea_header_palce');
            //     headerImage.spriteFrame = spriteFrame;
            // }

            // @ts-ignore
            cc.g.utils.setHead(headerImage, item.icon);

            let name = cc.find("Node_Content/Label_Name", cardNode).getComponent(cc.Label);
            name.string = item.name

            let quanId = cc.find("Node_Content/Label_Id", cardNode).getComponent(cc.Label);
            quanId.string = 'ID:' + item.userId

            let userName = cc.find("Node_Content/Label_Bao_Name", cardNode).getComponent(cc.Label);
            userName.string = item.ownerName

            let timerOne = cc.find("Node_Content/Label_Bao_Time", cardNode).getComponent(cc.Label);
            // @ts-ignore
            timerOne.string = cc.g.utils.getFormatTimeNYR(['-','-',' ',':',':',], new Date(item.time*1000));

            // let timerTwo = cc.find("Node_Content/Label_Bao_Time_Miao", cardNode).getComponent(cc.Label);
            // timerTwo.string = 'xxx'

            let jbCount = cc.find("Node_Content/Label_JuBao_Num", cardNode).getComponent(cc.Label);
            let complainCount = item.complainCount
            if (complainCount > 0) {
                jbCount.node.color = new cc.Color(202, 96, 17);
            } else {
                jbCount.node.color = new cc.Color(57, 56, 61);
            }

            jbCount.string = complainCount

            let jrBtn = cc.find("Node_Content/Button_JuJue", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(jrBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(jrBtn, this, 'tea_club_sp', 'doJuJue', item);


            let tyBtn = cc.find("Node_Content/Button_TongYi", cardNode).getComponent(cc.Button);
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(tyBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, this, 'tea_club_sp', 'doJiaRu', item);

            // add
            this.mainScrollView.content.addChild(cardNode);
        })
    }
    doJuJue(event, item) {
        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.addQuanJuJue(item.userId, item.teaHouseId, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.hint('操作成功');
                this.doGetDatas();
            } else {
                // @ts-ignore
                cc.g.global.hint('操作失败');
            }
        });
    }
    doJiaRu(event, item) {
        cc.dlog('teaHouseId..', item.teaHouseId)
        cc.dlog('userId..', item.userId)

        // @ts-ignore
        cc.g.utils.btnShake();

        // @ts-ignore
        cc.g.hallMgr.addQuanTongYi(item.userId, item.teaHouseId, (resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                // @ts-ignore
                cc.g.global.hint('操作成功');
                this.doGetDatas();
            } else {
                // @ts-ignore
                cc.g.global.hint('操作失败');
            }
        });
    }
    doGetDatas() {
        // @ts-ignore
        cc.g.hallMgr.searchMyQuanSp((resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.teaDatas = resp.list;
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(this.teaDatas)) {
                    this.createViewWithDatas();
                    TeaQuanClass.instance.showNoticeSprite(true)
                } else {
                    this.mainScrollView.content.removeAllChildren(true);
                    TeaQuanClass.instance.showNoticeSprite(false)
                }
            } else {
                TeaQuanClass.instance.showNoticeSprite(false)
            }
        });
    }

    start () {

    }

    onEnable() {
        this.doGetDatas();
    }
    //

    // update (dt) {}
}