import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

@ccclass
export default class TeaZdLbChuRu extends cc.Component {

    @property(cc.Sprite)
    private Sprite_Header: cc.Sprite = null;

    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private Zong_Label: cc.Label = null;

    @property(cc.Label)
    private Zong_LabeOne: cc.Label = null;

    @property(cc.Label)
    private Eff_Label: cc.Label = null;

    @property(cc.Label)
    private Win_Label: cc.Label = null;

    @property(cc.Label)
    private SpName_Label: cc.Label = null;

    @property(cc.Label)
    private SpId_Label: cc.Label = null;

    @property(cc.Label)
    private Gongxi_Label: cc.Label = null;

    @property(cc.Button)
    private Cancel_Button: cc.Button = null;

    @property(cc.Button)
    private Ok_Button: cc.Button = null;

    public setData(data: any) {
        this.createCyCrDatas(data)
    }

    public createCyCrDatas(pItem: any) {
        let showRedDot = false
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
        // @ts-ignore
        let timerStr = cc.g.utils.getFormatTimeNYR(['.','.','&',':',':',], new Date(pItem.time*1000));

        let stringArr = timerStr.split('&')

        Zong_Label.string = stringArr[1]

        let Zong_LabelOne = this.Zong_LabeOne
        // @ts-ignore
        // Zong_LabelOne.string = cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.time*1000));
        Zong_LabelOne.string = stringArr[0]
        let Eff_Label = this.Eff_Label
        if (pItem.online) {
            Eff_Label.string = '在线'
            Eff_Label.node.color = new cc.Color(81, 185, 4);
        } else {
            Eff_Label.string = '离线'
            Eff_Label.node.color = new cc.Color(57, 56, 61);
        }

        // int32     outInType=6;//退出方式(1 主动退出 2管理员踢出)
        let Win_Label = this.Win_Label
        if (pItem.outInType == 1) {
            Win_Label.string = '主动退出'
        } else if (pItem.outInType == 2) {
            Win_Label.string = '管理员踢出'
        } else {
            Win_Label.string = '未知'
        }


        let SpName_Label = this.SpName_Label
        // @ts-ignore
        SpName_Label.string = cc.g.utils.getFormatName(pItem.reviewerName, 5*2)

        let SpId_Label = this.SpId_Label
        SpId_Label.string = pItem.reviewerId

        let Gongxi_Label = this.Gongxi_Label
        if (pItem.operateType == 0) {
            Gongxi_Label.node.active = true;
            Gongxi_Label.string = ''
        } else if (pItem.operateType == 1) {
            Gongxi_Label.string = '已同意'
        } else if (pItem.operateType == 2) {
            Gongxi_Label.string = ''
        }

        let cellBtn = this.Cancel_Button

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cellBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(cellBtn, TeaChenYuan.instance, 'tea_chengyuan', 'cyCrCancle', pItem);

        let tyBtn = this.Ok_Button

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(tyBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(tyBtn, TeaChenYuan.instance, 'tea_chengyuan', 'cyCrOk', pItem);

        if (pItem.operateType == 0) {
            cellBtn.node.active = true;
            tyBtn.node.active = true;
            showRedDot = true
        } else if (pItem.operateType == 1) {
            cellBtn.node.active = false;
            tyBtn.node.active = false;
        } else if (pItem.operateType == 2) {
            cellBtn.node.active = false;
            tyBtn.node.active = false;
        }

        if (showRedDot) {
            TeaChenYuan.instance.doShowNoticeFour(showRedDot)
            TeaClass.instance.doShowNoticeCy(showRedDot)
        }
    }
}