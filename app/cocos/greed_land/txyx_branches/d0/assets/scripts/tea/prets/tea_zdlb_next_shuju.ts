import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import TeaClass from "../tea";
import TeaChenYuan from "./tea_chengyuan";

@ccclass
export default class TeaZdLbNextShuJu extends cc.Component {
    @property(cc.Label)
    private Name_Label: cc.Label = null;

    @property(cc.Label)
    private ID_Label: cc.Label = null;

    @property(cc.Label)
    private Zong_Label: cc.Label = null;

    @property(cc.Label)
    private Win_Label: cc.Label = null;

    @property(cc.Label)
    private Win_Count: cc.Label = null;

    @property(cc.Label)
    private Timer_Label: cc.Label = null;

    @property(cc.Label)
    private Timer_Sec_Label: cc.Label = null;

    @property(cc.Label)
    private Tea_Number: cc.Label = null;

    @property(cc.Sprite)
    private Sprite_Header: cc.Sprite = null;

    @property(cc.Sprite)
    private Sprite_Role: cc.Sprite = null;

    @property(cc.Button)
    private Cao_Button: cc.Button = null;

    public setData(data: any) {
        // cc.dlog('TeaZdLbNextShuJu data-->' + JSON.stringify(data))
        this.createZhanDuiSecListDatas(data)
    }

    public createZhanDuiSecListDatas(pItem: any) {
        // 头像
        let headerImage = this.Sprite_Header
        // @ts-ignore
        cc.g.utils.setHead(headerImage, pItem.icon);

        //所在职位(圈主=71,超级管理=61,管理员=51,队长=41,组长=31,小组长=21,推荐人=11,普通成员=1)
        let Sprite_Role = this.Sprite_Role
        Sprite_Role.node.active = true
        if (pItem.position == 71) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_qzz');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 61) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cgg');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 51) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_mag');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 41) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_dzz');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 31) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzzzz');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 21) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_zzz');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 11) {
            let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_remm');
            Sprite_Role.spriteFrame = spriteFrame;
        } else if (pItem.position == 1) {
            Sprite_Role.node.active = false
            // let spriteFrame = TeaClass.instance.teaAtlas.getSpriteFrame('te_cy_header_cg');
            // te_cy_header_qz.spriteFrame = spriteFrame;
        } else {
            Sprite_Role.node.active = false
        }

        let number = this.Tea_Number
        if (pItem.teamNo <= 0) {
            number.string = ''
        } else {
            number.string = pItem.teamNo
        }

        let name = this.Name_Label
        // @ts-ignore
        name.string = cc.g.utils.getFormatName(pItem.name, 5*2);

        let nameId = this.ID_Label
        nameId.string = pItem.userId

        let Zong_Label = this.Zong_Label
        let num = pItem.totalGameCount
        Zong_Label.string = num.toFixed(2);

        let Win_Label = this.Win_Label
        let winCount = pItem.winCount
        Win_Label.string = winCount.toFixed(2);


        let Win_CountTwo = this.Win_Count
        let score = pItem.score
        Win_CountTwo.string = score.toFixed(2);


        let Clear_Timer_Label = this.Timer_Label
        let Clear_Timer_Sec_Label = this.Timer_Sec_Label
        if (pItem.createTime == 0) {
            Clear_Timer_Label.string = '暂无'
        } else {
            // @ts-ignore
            let timeStr = cc.g.utils.getFormatTimeNYR(['.','.','&',':',':',], new Date(pItem.createTime*1000));
            let timeArr = timeStr.split('&')

            Clear_Timer_Label.string = timeArr[0]//cc.g.utils.getFormatTimeNYR(['.','.',' ',':',':',], new Date(pItem.createTime*1000));
            Clear_Timer_Sec_Label.string = timeArr[1]
        }

        let cellBtn = cc.find("Cell_Button", this.node).getComponent(cc.Button);

        // @ts-ignore
        cc.g.utils.removeClickAllEvent(cellBtn);
        // @ts-ignore
        cc.g.utils.addClickEvent(cellBtn, TeaChenYuan.instance, 'tea_chengyuan', 'zhanDuiNextCellBtn', pItem);

        let tyBtn = this.Cao_Button

        if((TeaClass.instance.position <= pItem.position) || (pItem.position == 51) || (pItem.position == 61) || pItem.level == 5) {
            tyBtn.node.active = false;
        } else {
            // @ts-ignore
            cc.g.utils.removeClickAllEvent(tyBtn);
            // @ts-ignore
            cc.g.utils.addClickEvent(tyBtn, TeaChenYuan.instance, 'tea_chengyuan', 'zhanDuiNextCaoZuo', pItem);

            tyBtn.node.active = true;
        }
    }
}