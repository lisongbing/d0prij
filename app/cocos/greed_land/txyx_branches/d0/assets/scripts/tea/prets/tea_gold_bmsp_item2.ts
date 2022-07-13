import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaBmsp from "./tea_gold_bmsp";

@ccclass
export default class TeaGoldBscrzItem extends cc.Component {

    @property(cc.Label)
    private sj: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_head: cc.Sprite = null;

    @property(cc.Label)
    private nameText: cc.Label = null;

    @property(cc.Label)
    private id_Label: cc.Label = null;

    @property(cc.Label)
    private zd_Label: cc.Label = null;

    @property(cc.Label)
    private sj2_Label: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_head_two: cc.Sprite = null;

    @property(cc.Label)
    private nameTextTwo: cc.Label = null;

    @property(cc.Label)
    private id_Label_Two: cc.Label = null;

    public setData(data: any) {
        this.createCyCrDatas(data)
    }

    public createCyCrDatas(pItem: any) {
        // @ts-ignore 时间
        this.sj.string = cc.g.utils.getFormatTimeXXX(pItem.time * 1000, '|h|:|m|\n|Y|:|M|:|D|');

        // @ts-ignore 头像
        cc.g.utils.setHead(this.Sprite_head, pItem.icon);

        // 名字
        // @ts-ignore
        this.nameText.string = cc.g.utils.getFormatName(pItem.name, 5*2)
        // @ts-ignore
        this.id_Label.string = ''+i64v(pItem.userId);

        // @ts-ignore 战队名字
        this.zd_Label.string = cc.g.utils.getFormatName(pItem.teamName, 3*2);
        // 事件
        this.sj2_Label.string = pItem.event;

        // @ts-ignore 头像
        cc.g.utils.setHead(this.Sprite_head_two, pItem.reviewerIcon);
        // @ts-ignore 操作者名字
        this.nameTextTwo.string = cc.g.utils.getFormatName(pItem.reviewerName, 3*2);
        // @ts-ignore 操作者ID
        this.id_Label_Two.string = ''+i64v(pItem.reviewerId);
    }
}