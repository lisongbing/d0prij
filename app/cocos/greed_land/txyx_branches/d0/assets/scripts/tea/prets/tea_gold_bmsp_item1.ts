import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaBmsp from "./tea_gold_bmsp";

@ccclass
export default class TeaGoldBmspItem extends cc.Component {

    @property(cc.Label)
    private xh: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_head: cc.Sprite = null;

    @property(cc.Label)
    private nameText: cc.Label = null;

    @property(cc.Label)
    private id_Label: cc.Label = null;

    @property(cc.Label)
    private time_Label: cc.Label = null;

    @property(cc.Label)
    private zd_Label: cc.Label = null;

    @property(cc.Label)
    private cyss_Label: cc.Label = null;

    @property(cc.Button)
    private no_Button: cc.Button = null;

    @property(cc.Button)
    private yes_Button: cc.Button = null;

    public setData(data: any, index: number) {
        this.createCyCrDatas(data, index+1)
    }

    public createCyCrDatas(pItem: any, index: number) {
        pItem.idx = index
        this.xh.string = ''+index

        // @ts-ignore 头像
        cc.g.utils.setHead(this.Sprite_head, pItem.icon);

        // 名字
        // @ts-ignore
        this.nameText.string = cc.g.utils.getFormatName(pItem.name, 5*2)

        // @ts-ignore
        this.id_Label.string = ''+i64v(pItem.userId);

        // @ts-ignore 时间
        this.time_Label.string = cc.g.utils.getFormatTimeXXX(pItem.time * 1000, '|h|:|m|\n|Y|:|M|:|D|');
        // @ts-ignore 战队名字
        this.zd_Label.string = cc.g.utils.getFormatName(pItem.teamName, 3*2);
        // @ts-ignore 金币
        this.cyss_Label.string = `${cc.g.utils.realNum1(pItem.gold)}金币参与报名`;

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(this.no_Button);
        // @ts-ignore 按钮事件
        cc.g.utils.addClickEvent(this.no_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnBmspAgree', {agree:false, itm:pItem});

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(this.yes_Button);
        // @ts-ignore
        cc.g.utils.addClickEvent(this.yes_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnBmspAgree', {agree:true, itm:pItem});
    }
}