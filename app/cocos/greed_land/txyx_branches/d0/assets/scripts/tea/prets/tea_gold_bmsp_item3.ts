import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaBmsp from "./tea_gold_bmsp";
import TeaClass from "../tea";

@ccclass
export default class TeaGoldSsbdItem extends cc.Component {

    @property(cc.Sprite)
    private rankspr: cc.Sprite = null;

    @property(cc.Label)
    private rank: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_head: cc.Sprite = null;

    @property(cc.Label)
    private nameText: cc.Label = null;

    @property(cc.Label)
    private id_Label: cc.Label = null;

    @property(cc.Label)
    private js_Label: cc.Label = null;

    @property(cc.Label)
    private syjb_Label: cc.Label = null;

    @property(cc.Label)
    private cz_Label: cc.Label = null;

    @property(cc.Button)
    private caipan_Button: cc.Button = null;

    @property(cc.Button)
    private tichu_Button: cc.Button = null;

    public setData(data: any) {
        this.createCyCrDatas(data)
    }

    public createCyCrDatas(pItem: any) {

        if (pItem.rank > 3) {
            this.rank.string = pItem.rank;
            this.rank.node.active = true;
            this.rankspr.node.active = false;
        } else {
            let a = TeaClass.instance.teaAtlas1;
            this.rank.node.active = false;
            this.rankspr.node.active = true;
            this.rankspr.spriteFrame = a.getSpriteFrame('tea1_pm'+pItem.rank);
        }

        // @ts-ignore 头像
        cc.g.utils.setHead(this.Sprite_head, pItem.icon);

        // 名字
        // @ts-ignore
        this.nameText.string = cc.g.utils.getFormatName(pItem.name, 5*2)

        // @ts-ignore
        this.id_Label.string = ''+i64v(pItem.userId);

        // 局数
        this.js_Label.string = pItem.matchCount;
        // 成员剩余金币
        // @ts-ignore
        this.syjb_Label.string = cc.g.utils.realNum1(pItem.gold);

        // --
        this.cz_Label.node.active = !pItem.power;

        // 裁判 踢出比赛
        if (!pItem.power) {
            this.caipan_Button.node.active = this.tichu_Button.node.active = false;
        } else {
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(this.caipan_Button);
            // @ts-ignore 按钮事件
            cc.g.utils.addClickEvent(this.caipan_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnSsbdCaipan', {caipan:true, itm:pItem});

            if (pItem.position!=71) {
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(this.tichu_Button);
                // @ts-ignore
                cc.g.utils.addClickEvent(this.tichu_Button, TeaBmsp.instance, 'tea_gold_bmsp', 'onBtnSsbdCaipan', {caipan:false, itm:pItem});
            } else {
                this.tichu_Button.node.active = false;
            }
        }
    }
}