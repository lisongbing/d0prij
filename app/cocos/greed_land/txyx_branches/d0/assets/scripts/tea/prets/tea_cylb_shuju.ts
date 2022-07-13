import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

@ccclass
export default class TeaZdLbShuJu extends cc.Component {

    @property(cc.Sprite)
    private Sprite_Header: cc.Sprite = null;

    @property(cc.Sprite)
    private te_cy_header_er: cc.Sprite = null;

    @property(cc.Sprite)
    private te_cy_header_jing: cc.Sprite = null;

    @property(cc.Sprite)
    private te_cy_header_qz: cc.Sprite = null;

    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private Label_Group: cc.Label = null;

    @property(cc.Label)
    private Label_Status: cc.Label = null;

    @property(cc.Label)
    private Label_Shei: cc.Label = null;

    @property(cc.Button)
    private Button_Guli: cc.Button = null;

    public setData(data: any) {
        this.createChenYuanListDatas(data)
    }

    public createChenYuanListDatas(pItem: any) {
        // 头像
        let headerImage = this.Sprite_Header
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        // if (pItem.icon.length > 4) {
        //     // @ts-ignore
        //     cc.g.utils.setUrlTexture(headerImage, pItem.icon);
        // } else {
        //     // let spriteFrame = this.teaAtlas.getSpriteFrame('tea_header_palce');
        //     // headerImage.spriteFrame = spriteFrame;
        // }

        let headerButton = cc.find("Node_Cell/HeaderButton", this.node).getComponent(cc.Button);
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(headerButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(headerButton, TeaChenYuan.instance, 'tea_chengyuan', 'doHeaderClicked', pItem);

        let te_cy_header_er = this.te_cy_header_er.node
        if (pItem.onlyTwoPeople) {
            te_cy_header_er.active = true
        } else {
            te_cy_header_er.active = false
        }

        let te_cy_header_jing = this.te_cy_header_jing.node
        if (pItem.forbidGame) {
            te_cy_header_jing.active = true
        } else {
            te_cy_header_jing.active = false
        }

        // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let te_cy_header_qz = this.te_cy_header_qz
        te_cy_header_qz.node.active = true
        if (pItem.position == 71) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qz');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 61) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 51) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mg');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 41) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dz');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 31) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzz');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 21) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zz');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 11) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_rem');
            te_cy_header_qz.spriteFrame = spriteFrame;
        } else if (pItem.position == 1) {
            te_cy_header_qz.node.active = false
            // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
            // te_cy_header_qz.spriteFrame = spriteFrame;
        } else {
            te_cy_header_qz.node.active = false
        }


        let name = this.Name_Label;
        // @ts-ignore
        name.string = cc.g.utils.getFormatName(pItem.name, 5*2) //pItem.name;//

        let nameId = this.ID_Label;
        // 4	成员全部可见，不能把ID显示出来（圈主和超管能看到所有id,有职位的玩家只能看到自己这条链id）
        if (TeaClass.instance.position == 71 || TeaClass.instance.position == 61) {
            nameId.string = pItem.userId
        } else if (pItem.showUserId) {
            nameId.string = pItem.userId
        } else {
            nameId.string = ''
        }

        let nameGroup = this.Label_Group;
        // 队-组-小组-推荐
        let groupName = pItem.groupName
        let relGroupName = ''
        // @ts-ignore
        if (!cc.g.utils.judgeStringEmpty(groupName)) {
            let groupTxtArr = ["队/", "组/", "小组/", "推荐"]
            let groupNameArr = groupName.split("_")
            for (let i = 0; i < groupNameArr.length; i++) {
                relGroupName += groupNameArr[i]
                relGroupName += groupTxtArr[i]
            }
        } else {
            relGroupName = '';
        }

        nameGroup.string = relGroupName

        // offlineTime
        // int32     status=10;//状态(0 空闲 1 游戏中 2比赛中)
        let nameStatus = this.Label_Status
        if (pItem.online) {
            if (pItem.status == 0) {
                nameStatus.string = "空闲"
            } else if (pItem.status == 1) {
                nameStatus.string = "游戏中"
            } else if (pItem.status == 2) {
                nameStatus.string = "比赛中"
            }
        } else {
            let minu = 60;
            let hour = 60 * 60
            let day = 60 * 60 * 24
            let offlineTime = pItem.offlineTime
            if (offlineTime > 0) {
                if ((offlineTime > minu) && (offlineTime < hour)) {
                    let relMinu = offlineTime/minu;
                    let relTimer = Math.ceil(relMinu)
                    nameStatus.string = "离线" + relTimer + "分钟"
                } else if ((offlineTime > hour) && (offlineTime < day)) {
                    let relMinu = offlineTime/hour;
                    let relTimer = Math.ceil(relMinu)
                    nameStatus.string = "离线" + relTimer + "小时"
                } else if ((offlineTime >= day)) {
                    let relMinu = offlineTime/day;
                    let relTimer = Math.ceil(relMinu)
                    nameStatus.string = "离线" + relTimer + "天"
                }
            } else {
                nameStatus.string = "离线" + 1 + "分钟"
            }
        }

        let nameSh = this.Label_Shei
        // @ts-ignore
        nameSh.string = cc.g.utils.getFormatName(pItem.reviewerName, 5*2)

        pItem.showExit = false;
        let tyBtn = this.Button_Guli
        tyBtn.node.active = true;
        // int32     position=4;//用户职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let backgroundNode = tyBtn.node.getChildByName("Background")
        if (pItem.position == 71) {
            if (TeaClass.instance.position == pItem.position) {
                tyBtn.node.active = false;
            } else {
                tyBtn.node.active = true;
                backgroundNode.getChildByName("New Label").getComponent(cc.Label).string = "管理";
            }
        } else if ((pItem.position == 61) || (pItem.position == 51) ||
            (pItem.position == 41) || (pItem.position == 31) ||
            (pItem.position == 21) || (pItem.position == 11) || (pItem.position == 1)) {
            // @ts-ignore
            if (eq64(cc.g.userMgr.userId, pItem.userId)) {
                // let btnSprt = cc.find("te_cy_header_mag", tyBtn.node).getComponent(cc.Sprite)
                // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('tea_logout_de');
                // btnSprt.spriteFrame = spriteFrame;
                pItem.showExit = true;
                backgroundNode.getChildByName("New Label").getComponent(cc.Label).string = "退出";
            } else {
                pItem.showExit = false;
                backgroundNode.getChildByName("New Label").getComponent(cc.Label).string = "管理";
            }
        }

        if (!pItem.showExit) {
            if (TeaClass.instance.position <= pItem.position) {
                tyBtn.node.active = false;
            }
        }

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, TeaChenYuan.instance, 'tea_chengyuan', 'chengYuanSetting', pItem);
    }
}