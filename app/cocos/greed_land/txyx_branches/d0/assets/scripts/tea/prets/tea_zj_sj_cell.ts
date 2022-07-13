import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaClass from "../tea";
import TeaZhanJi from "./tea_zhanji";

@ccclass
export default class TeaZjShuJu extends cc.Component {
    @property(cc.Sprite)
    private HeaderSprite: cc.Sprite = null;

    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private bm_Label: cc.Label = null;

    @property(cc.Label)
    private cj_Label: cc.Label = null;

    @property(cc.Label)
    private ts_Label: cc.Label = null;

    @property(cc.Label)
    private cp_Label: cc.Label = null;

    @property(cc.Button)
    private cellButton: cc.Button = null;

    @property(cc.Label)
    private bc_Label: cc.Label = null;

    @property(cc.Label)
    private cf_Label: cc.Label = null;

    @property(cc.Label)
    private bmr_Label: cc.Label = null;

    @property(cc.Label)
    private dqjb_Label: cc.Label = null;

    @property(cc.Sprite)
    private PosSprite: cc.Sprite = null;

    public setData(data: any) {
        // cc.log('TeaZdLbNextShuJu data-->' + JSON.stringify(data))
        this.createZhanDuiZShujuListDatas(data)
    }
    
    createZhanDuiZShujuListDatas(pItem) {
        // let Room_Num_Label = cc.find("Node_Content/Label_Num", cardNode).getComponent(cc.Label);
        // Room_Num_Label.string = pItem.teamNo//(rowIndex + 1) + ''

        // 头像
        let headerImage = this.HeaderSprite
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        // TeamId   int  `bson:"teamId"`         //战队Id
        // SignUpGold  int `bson:"signUpGold"`   //报名金币
        // LotteryGold  int `bson:"lotteryGold"` //抽奖金币
        // BreakGold  int `bson:"breakGold"`     //退赛金币
        // MakeUpGold  int `bson:"makeUpGold"`   //补偿金币
        // PunishGold  int `bson:"punishGold"`   //处罚金币
        // LotteryNum  int `bson:"lotteryNum"`   //报名人数
        // BigWinNum  int `bson:"bigWinNum"`     //大赢家
        let Name_Label = this.Name_Label
        // @ts-ignore
        Name_Label.string = cc.g.utils.getFormatName(pItem.name, 5*2);

        let ID_Label = this.ID_Label
        ID_Label.string = pItem.uid


        let bm_Label = this.bm_Label
        // @ts-ignore
        bm_Label.string = cc.g.utils.realNum1(pItem.signUpGold);

        let cj_Label = this.cj_Label
        // @ts-ignore
        cj_Label.string = cc.g.utils.realNum1(pItem.lotteryGold);

        let ts_Label = this.ts_Label
        // @ts-ignore
        ts_Label.string = cc.g.utils.realNum1(pItem.breakGold);

        let cp_Label = this.cp_Label
        // @ts-ignore
        cp_Label.string = cc.g.utils.realNum1((pItem.makeUpGold - pItem.punishGold)) + ''

        let cellButton = this.cellButton
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cellButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(cellButton, TeaZhanJi.instance, 'tea_zhanji', 'zjCaiPanDetail', pItem);

        let bc_Label = this.bc_Label
        // @ts-ignore
        bc_Label.string = cc.g.utils.realNum1(pItem.contribute);//cc.g.utils.realNum1(pItem.makeUpGold);

        let cf_Label = this.cf_Label
        // @ts-ignore
        cf_Label.string = cc.g.utils.realNum1(pItem.backContribute);//cc.g.utils.realNum1(pItem.punishGold);

        let bmr_Label = this.bmr_Label
        bmr_Label.string = pItem.lotteryNum

        // let dyj_Label = cc.find("Node_Content/dyj_Label", cardNode).getComponent(cc.Label);
        // dyj_Label.string = pItem.bigWinNum

        let dqjb_Label = this.dqjb_Label
        // @ts-ignore
        dqjb_Label.string = cc.g.utils.realNum1(pItem.currentGold);

        // position
        let posinImg = this.PosSprite
        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        if (pItem.position == 71) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qzz');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 61) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mgg');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 51) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mag');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 41) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dzz');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 31) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzzz');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 21) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzz');
            posinImg.spriteFrame = spriteFrame;
        } else if (pItem.position == 11) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_remm');
            posinImg.spriteFrame = spriteFrame;
        }
    }
}