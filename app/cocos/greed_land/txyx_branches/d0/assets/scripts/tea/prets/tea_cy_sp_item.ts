import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

@ccclass
export default class TeaZdLbShenPi extends cc.Component {

    @property(cc.Sprite)
    private Sprite_Header: cc.Sprite = null;

    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private Zong_Label: cc.Label = null;

    @property(cc.Label)
    private Eff_Label: cc.Label = null;

    @property(cc.Label)
    private Win_Label: cc.Label = null;

    @property(cc.Label)
    private Gongxi_Label: cc.Label = null;

    @property(cc.Button)
    private Cancel_Button: cc.Button = null;

    @property(cc.Button)
    private Ok_Button: cc.Button = null;

    public setData(data: any) {
        this.createCySpDatas(data)
    }

    public createCySpDatas(pItem: any) {
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

        let name = this.Name_Label
        // @ts-ignore
        name.string = cc.g.utils.getFormatName(pItem.name, 5*2)

        let nameId = this.ID_Label
        nameId.string = pItem.userId

        let Zong_Label = this.Zong_Label
        Zong_Label.string = '亲友圈ID搜索'

        let Eff_Label = this.Eff_Label
        Eff_Label.string = TeaChenYuan.instance.ownerName//pItem.effectCount

        let Win_Label = this.Win_Label
        // @ts-ignore
        Win_Label.string = cc.g.utils.getFormatTimeNYR(['.','.','\n',':',':',], new Date(pItem.time*1000));

        let Gongxi_Label = this.Gongxi_Label
        Gongxi_Label.string = pItem.complainCount

        // let Ceaate_Timer_Label = cc.find("Node_Content/Ceaate_Timer_Label", cardNode).getComponent(cc.Label);
        // // @ts-ignore
        // Ceaate_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.createTime*1000));
        //
        // let Clear_Timer_Label = cc.find("Node_Content/Clear_Timer_Label", cardNode).getComponent(cc.Label);
        // if (pItem.zeroTime == 0) {
        //     Clear_Timer_Label.string = '暂无'
        // } else {
        //     // @ts-ignore
        //     Clear_Timer_Label.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.zeroTime*1000));
        // }


        let cellBtn = this.Cancel_Button

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cellBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(cellBtn, TeaChenYuan.instance, 'tea_chengyuan', 'cyShenPiCancle', pItem);


        let tyBtn = this.Ok_Button

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, TeaChenYuan.instance, 'tea_chengyuan', 'cyShenPiOk', pItem);
    }
}