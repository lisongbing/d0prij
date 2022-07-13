import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaZhanJi from "./tea_zhanji";

@ccclass
export default class TeaZjCyComp extends cc.Component {
    @property(cc.Label)
    private Label_Num: cc.Label = null;

    @property(cc.Sprite)
    private HeaderSprite: cc.Sprite = null;

    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private Group_Label: cc.Label = null;

    @property(cc.Label)
    private Dyj_Label: cc.Label = null;

    @property(cc.Sprite)
    private JieSan_Sprite: cc.Sprite = null;

    @property(cc.Label)
    private SNum_Label: cc.Label = null;

    @property(cc.Label)
    private JfLabel: cc.Label = null;

    @property(cc.Label)
    private pjLabel: cc.Label = null;

    @property(cc.Button)
    private Cao_Button: cc.Button = null;

    @property(cc.Button)
    private cellButton: cc.Button = null;

    public setData(data: any, perIndex, hiddenCaoZuo) {
        // cc.dlog('TeaZdLbNextShuJu data-->' + JSON.stringify(data))
        if (hiddenCaoZuo) {
            this.createZjCyListDatasTwo(data, perIndex)
        } else {
            this.createZjCyListDatasOne(data, perIndex)
        }
    }

    createZjCyListDatasOne(pItem, perIndex) {
        let Room_Num_Label = this.Label_Num
        Room_Num_Label.string = (perIndex + 1) + ''

        // 头像
        let headerImage = this.HeaderSprite
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        let Name_Label = this.Name_Label
        // @ts-ignore
        Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

        let ID_Label = this.ID_Label
        ID_Label.string = pItem.uid


        let Group_Label = this.Group_Label
        // Group_Label.string = pItem.teamGroup
        // 队-组-小组-推荐
        let groupName = pItem.teamGroup
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

        Group_Label.string = relGroupName

        let Dyj_Label = this.Dyj_Label
        Dyj_Label.string = pItem.winCount
        if (pItem.winCount > 0) {
            // @ts-ignore
            Dyj_Label.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
        } else {
            // @ts-ignore
            Dyj_Label.node.color = new cc.color(0x74, 0xff, 0x3d,255)
        }

        // 中途解散
        let JieSan_Sprite = this.JieSan_Sprite.node
        if (pItem.disbandCount > 0) {
            JieSan_Sprite.active = true;
            let SNum_Label = this.SNum_Label
            SNum_Label.string = pItem.disbandCount
        } else {
            JieSan_Sprite.active = false;
        }

        let JfLabel = this.JfLabel
        // @ts-ignore
        let integralNum = cc.g.utils.realNum1(pItem.integralNum);
        JfLabel.string = integralNum

        if (integralNum > 0) {
            // @ts-ignore
            JfLabel.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
        } else {
            // @ts-ignore
            JfLabel.node.color = new cc.color(0x74, 0xff, 0x3d,255)
        }

        let pjLabel = this.pjLabel
        pjLabel.string = pItem.gameNumCount

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(this.Cao_Button);
        // @ts-ignore
        cc.g.utils.addClickEvent(this.Cao_Button, TeaZhanJi.instance, 'tea_zhanji', 'zjChakanzjxq', pItem);
    }


    createZjCyListDatasTwo(pItem, perIndex) {
        let Room_Num_Label = this.Label_Num
        Room_Num_Label.string = pItem.teamNo

        // 头像
        let headerImage = this.HeaderSprite
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        let Name_Label = this.Name_Label
        // @ts-ignore
        Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

        let ID_Label = this.ID_Label
        ID_Label.string = pItem.uid


        let Group_Label = this.Group_Label
        // Group_Label.string = pItem.teamGroup
        // 队-组-小组-推荐
        let groupName = pItem.teamGroup
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

        Group_Label.string = relGroupName


        let Dyj_Label = this.Dyj_Label
        Dyj_Label.string = pItem.winCount
        if (pItem.winCount > 0) {
            // @ts-ignore
            Dyj_Label.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
        } else {
            // @ts-ignore
            Dyj_Label.node.color = new cc.color(0x74, 0xff, 0x3d,255)
        }


        // 中途解散
        let JieSan_Sprite = this.JieSan_Sprite.node
        if (pItem.disbandCount > 0) {
            JieSan_Sprite.active = true;
            let SNum_Label = this.SNum_Label
            SNum_Label.string = pItem.disbandCount
        } else {
            JieSan_Sprite.active = false;
        }

        let JfLabel = this.JfLabel
        // @ts-ignore
        let integralNum = cc.g.utils.realNum1(pItem.integralNum);
        JfLabel.string = integralNum

        if (integralNum > 0) {
            // @ts-ignore
            JfLabel.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
        } else {
            // @ts-ignore
            JfLabel.node.color = new cc.color(0x74, 0xff, 0x3d,255)
        }

        let pjLabel = this.pjLabel
        pjLabel.string = pItem.gameNumCount


        let cellButton = this.cellButton
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cellButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(cellButton, TeaZhanJi.instance, 'tea_zhanji', 'zjZhanDuiClicked', pItem);

        this.Cao_Button.node.active = false;
    }
}