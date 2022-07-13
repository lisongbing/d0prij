// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import TeaClubCreate from "./prets/tea_club_sp";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaQuanClass extends cc.Component {
    static instance: TeaQuanClass = null;
    @property(cc.Prefab)
    quanCreatePre: cc.Prefab = null;
    quanCreatePreNode: cc.Node = null;

    @property(cc.Prefab)
    quanShenHePre: cc.Prefab = null;
    quanShenHePreNode: cc.Node = null;

    @property(cc.Prefab)
    quanJoinPre: cc.Prefab = null;
    quanJoinPreNode: cc.Node = null;

    @property(cc.SpriteAtlas)
    teaAtlas: cc.SpriteAtlas = null;

    mainScrollView: cc.ScrollView = null;

    noticeSprite: cc.Node = null;

    public applyJoinCount: number = 0;

    @property(cc.Prefab)
    quanItemPre: cc.Prefab = null;

    teaDatas: any[]

    mteaClubCreate: TeaClubCreate = null;

    onLoad () {
        TeaQuanClass.instance = this;

        // @ts-ignore
        cc.g.ggjiesan = false
        
        // @ts-ignore
        cc.g._tea_ = null;

        // @ts-ignore
        cc.g.audioMgr.playBGM('public/bg_game.mp3');

        this.initPres();

        this.initView();

        // 进入亲友圈，拉数据
        this.doUpdateDatas();

        // @ts-ignore
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_JOIN_TEA_HOUSE, (resp) => this.on_NOTIFY_JOIN_TEA_HOUSE(resp) ); //  主推增加桌子

        // @ts-ignore
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_EXIT_TEA_HOUSE, (resp) => this.on_NOTIFY_EXIT_TEA_HOUSE(resp) ); //  主推增加桌子


        // @ts-ignore
        cc.g.networkMgr.addHandler(PB.PROTO.NOTIFY_APPLY_TEA_HOUSE, (resp) => this.on_NOTIFY_APPLY_TEA_HOUSE(resp) ); //  主推增加桌子

        // @ts-ignore
        cc.g.utils.stopScreenshotListen();
    }

    showNoticeSprite(show) {
        this.noticeSprite.active = show
    }

    initPres() {
        // 创建亲友圈
        if (this.quanCreatePreNode == null) {
            this.quanCreatePreNode = cc.instantiate(this.quanCreatePre);
            this.quanCreatePreNode.active = false;
            this.node.addChild(this.quanCreatePreNode);
        }

        if (this.quanShenHePreNode == null) {
            this.quanShenHePreNode = cc.instantiate(this.quanShenHePre);
            this.quanShenHePreNode.active = false;
            this.node.addChild(this.quanShenHePreNode)
            this.mteaClubCreate = this.quanShenHePreNode.getComponent('tea_club_sp')
            this.mteaClubCreate.setTeaId('sdsd');
            // this.quanShenHePreNode.active = false;
        }

        if (this.quanJoinPreNode == null) {
            this.quanJoinPreNode = cc.instantiate(this.quanJoinPre);
            this.quanJoinPreNode.active = true;
            this.node.addChild(this.quanJoinPreNode);
            let view = this.quanJoinPreNode.getComponent('JoinRoom');
            view.setIsTea(true);
            this.quanJoinPreNode.active = false;
        }
    }

    initView() {
        this.mainScrollView = cc.find("Content_Node/Quan_ScrollView", this.node).getComponent(cc.ScrollView);
        this.noticeSprite = cc.find("Top_Node/Btns_Layout/ShengHeiButton/Sprite_Notice", this.node)
        this.noticeSprite.active = false

        let shNode = cc.find("Top_Node/Btns_Layout/ShengHeiButton", this.node);
        let emptyNode = cc.find("Top_Node/Btns_Layout/EmptyButton", this.node);

        // @ts-ignore
        if (cc.g.utils.getWeChatOs()) {
            shNode.active = false
            emptyNode.active = true
        } else {
            shNode.active = true
            emptyNode.active = false
        }
    }

    createViewWithDatas() {
        this.mainScrollView.content.removeAllChildren(true);
        // 显示数据
        this.teaDatas.forEach((item) => {
            this.addQuanItem(item);
        })
    }

    addQuanItem(item) {
        let cardNode = cc.instantiate(this.quanItemPre);

        let name = cc.find("name", cardNode).getComponent(cc.Label);
        name.string = item.name

        let quan_num = cc.find("quan_num", cardNode).getComponent(cc.Label);
        quan_num.string = '圈号:' + item.teaHouseId

        let userName = cc.find("Label_User_Name", cardNode).getComponent(cc.Label);
        userName.string = item.ownerName

        let userId = cc.find("Label_User_Id", cardNode).getComponent(cc.Label);
        userId.string = 'ID:' + item.ownerId

        let perCount = cc.find("Label_Per_Count", cardNode).getComponent(cc.Label);
        perCount.string = item.onlineCount + '/' + item.totalCount

        let myTeaImg = cc.find("Sprite_tag", cardNode)
        if (item.mineCreate) {
            myTeaImg.active = true
        } else {
            myTeaImg.active = false
        }

        if (item.blurred == 1) {
            //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
            if (item.position <= 51) {
                // name.string = "***"
                // quan_num.string = '圈号:***'
                userName.string = "*****"
                userId.string = 'ID:' + "*****"
                perCount.string = '**/**'
            }
        } else {
            let headerImage = cc.find("Sprite_headbg", cardNode).getComponent(cc.Sprite);
            if (item.icon.length > 4) {
                // @ts-ignore
                cc.g.utils.setUrlTexture(headerImage, item.icon);
            } else {
                let spriteFrame = this.teaAtlas.getSpriteFrame('tea_qyq_per_header');
                headerImage.spriteFrame = spriteFrame;
            }
        }

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cardNode);
        // @ts-ignore
        cc.g.utils.addClickEvent(cardNode, this, 'tea_quan', 'enterTeaHall', item.teaHouseId);
        // add
        this.mainScrollView.content.addChild(cardNode, 0, "quan" + item.name);
    }

    start () {

    }

    // update (dt) {}
    // 显示创建房间弹窗
    doShowCreateQuanDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.quanCreatePreNode.active = true;
    }
    doHiddenQuanDialog() {
        this.quanCreatePreNode.active = false;
    }
    // 显示创建房间弹窗
    doShowShQuanDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.quanShenHePreNode.active = true;
    }
    doHiddenShQuanDialog() {
        this.quanShenHePreNode.active = false;
    }
    // 显示创建房间弹窗
    doShowJoinPreDialog() {
        // @ts-ignore
        cc.g.utils.btnShake();

        this.quanJoinPreNode.active = true;
    }
    doHiddenJoinPreDialog() {
        this.quanJoinPreNode.active = false;
    }
    // 进入俱乐部
    enterTeaHall(event, teaHouseId) {
        // @ts-ignore
        cc.g.utils.setLocalStorage('teaHouseId', teaHouseId)

        cc.director.loadScene('tea', (err, scene) => {
            // cc.dlog('进入茶馆场景.')
        });
    }
    // 更新数据
    doUpdateDatas() {
        // @ts-ignore
        cc.g.hallMgr.searchMyQuan((resp)=>{
            // @ts-ignore
            if (!cc.g.utils.judgeObjectEmpty(resp)) {
                this.teaDatas = resp.list;
                this.applyJoinCount = resp.applyJoinCount;
                if (this.applyJoinCount > 0) {
                    this.showNoticeSprite(true)
                } else {
                    this.showNoticeSprite(false)
                }
                // @ts-ignore
                if (!cc.g.utils.judgeArrayEmpty(this.teaDatas)) {
                    this.createViewWithDatas();
                }
            }
        });
    }
    backToHall() {
        // @ts-ignore
        cc.g.utils.btnShake();
        
        // @ts-ignore
        cc.g.hallMgr.backFromTeaToHall();
    }

    // removePlayerDeskByItem(item) {
    //     // // 修改茶馆
    //     let cardNode = this.mainScrollView.content.getChildByName("quan" + item.name)
    //     if (cardNode != null) {
    //         this.mainScrollView.content.removeChild(cardNode);
    //     }
    // }

    on_NOTIFY_JOIN_TEA_HOUSE(resp) {
        cc.dlog("收到增加桌子", resp)
        // 进入亲友圈，拉数据
        this.doUpdateDatas();
    }
    on_NOTIFY_EXIT_TEA_HOUSE (resp) {
        cc.dlog("收到退出桌子", resp)
        // 进入亲友圈，拉数据
        this.doUpdateDatas();
    }
    on_NOTIFY_APPLY_TEA_HOUSE(resp) {
        cc.dlog("收到茶馆申请", resp)
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(this.teaDatas)) {
            let findTea = false
            this.teaDatas.forEach((tea)=>{
                let mineCreate = tea.mineCreate
                if (mineCreate) {
                    let teaHouseId = tea.teaHouseId
                    let respTeaHouseId = resp.teaHouseId
                    if (teaHouseId === respTeaHouseId) {
                        findTea = true
                    }
                }
            })

            this.showNoticeSprite(findTea)
        }
    }
}
