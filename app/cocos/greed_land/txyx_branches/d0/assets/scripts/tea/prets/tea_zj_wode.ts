import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaZhanJi from "./tea_zhanji";

@ccclass
export default class TeaZjWode extends cc.Component {
    @property(cc.Label)
    private Game_Label: cc.Label = null;

    @property(cc.Label)
    private Room_Num_Label: cc.Label = null;

    @property(cc.Label)
    private Jue_Num_Label: cc.Label = null;

    @property(cc.Label)
    private Timer_Label: cc.Label = null;

    @property(cc.Label)
    private Sai_Label: cc.Label = null;

    @property(cc.Sprite)
    private JieSan_Sprite: cc.Sprite = null;

    @property(cc.Label)
    private Win_Label: cc.Label = null;

    @property(cc.ScrollView)
    private UserScrollView: cc.ScrollView = null;

    @property(cc.Button)
    private DetailButton: cc.Button = null;

    @property(cc.Button)
    private Share_Button: cc.Button = null;

    @property(cc.Button)
    private ZfButton: cc.Button = null;

    @property(cc.Button)
    private RoomButton: cc.Button = null;

    public setData(data: any) {
        // cc.dlog('TeaZjWode data-->' + JSON.stringify(data))
        this.createWoDeListDatas(data)
    }

    createWoDeListDatas(pItem) {
        // @ts-ignore
        let deskName = cc.g.utils.getGameName(pItem.gameType, pItem.origin);

        let Game_Label = this.Game_Label

        // @ts-ignore
        if (cc.g.utils.judgeStringEmpty(Game_Label)) {
            Game_Label.string = deskName
        } else {
            Game_Label.string = deskName
        }

        let Room_Num_Label = this.Room_Num_Label
        Room_Num_Label.string = "房号:"+pItem.roomId

        let Jue_Num_Label = this.Jue_Num_Label
        Jue_Num_Label.string = "局数:"+pItem.gameNum

        let Timer_Label = this.Timer_Label
        // @ts-ignore
        Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.start*1000));
        //Timer_Label.string = cc.g.utils.getFormatTimeXXX(new Date(pItem.start*1000), '|M|.|D| |h|:|m|:|s|');;

        // 比赛
        let Sai_Label = this.Sai_Label.node
        Sai_Label.active = false;

        // 中途解散
        let JieSan_Sprite = this.JieSan_Sprite.node
        if (pItem.isDisband) {
            JieSan_Sprite.active = false;
        } else {
            JieSan_Sprite.active = true;
        }

        // 赢label
        let Win_Label = this.Win_Label
        if (pItem.bigWin == 0) {
            Win_Label.node.active = false;
        } else if (pItem.bigWin == 1) {
            Win_Label.string = '大赢家'
            Win_Label.node.active = true;
        } else if (pItem.bigWin == 2) {
            Win_Label.string = '并列'
            Win_Label.node.active = true;
        }

        let contentScrollView = this.UserScrollView
        contentScrollView.content.removeAllChildren(true)

        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(pItem.totalFight)) {
            pItem.totalFight.forEach((titem) => {
                let cardCellNode = cc.instantiate(TeaZhanJi.instance.zjWoDeCellPre);
                let nameLabel = cc.find("Name_Label", cardCellNode).getComponent(cc.Label);
                // @ts-ignore
                nameLabel.string = cc.g.utils.getFormatName(titem.name, 5*2);

                let Vaule_Label = cc.find("Vaule_Label", cardCellNode).getComponent(cc.Label);
                let fight = titem.fight[0];
                if (fight > 0) {
                    // @ts-ignore
                    let hfight = cc.g.utils.realNum1(fight);
                    Vaule_Label.string = "+"+ hfight
                    // @ts-ignore
                    Vaule_Label.node.color = new cc.color(0xfd, 0xff, 0x2c, 255)
                } else {
                    // @ts-ignore
                    let hfight = cc.g.utils.realNum1(fight);
                    Vaule_Label.string = hfight;
                    // @ts-ignore
                    Vaule_Label.node.color = new cc.color(0x74, 0xff, 0x3d,255)
                }

                contentScrollView.content.addChild(cardCellNode, 0);
            })
        }

        let DetailButton = this.DetailButton
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(DetailButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(DetailButton, TeaZhanJi.instance, 'tea_zhanji', 'zjDetailClicked', pItem);

        let Share_Button = this.Share_Button
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(Share_Button);
        // @ts-ignore
        cc.g.utils.addClickEvent(Share_Button, TeaZhanJi.instance, 'tea_zhanji', 'zjShareClicked', pItem);

        let ZfButton = this.ZfButton
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(ZfButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(ZfButton, TeaZhanJi.instance, 'tea_zhanji', 'zjZongFenClicked', pItem);

        let RoomButton = this.RoomButton
        // @ts-ignore
        cc.g.utils.removeClickAllEvent(RoomButton);
        // @ts-ignore
        cc.g.utils.addClickEvent(RoomButton, TeaZhanJi.instance, 'tea_zhanji', 'RoomIDClicked', pItem);
    }
}