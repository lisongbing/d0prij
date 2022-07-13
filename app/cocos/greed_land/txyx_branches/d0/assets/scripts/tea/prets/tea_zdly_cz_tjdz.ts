// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeaChenYuan from "./tea_chengyuan";
import TeaClass from "../tea";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeaZhanDuiAdd extends cc.Component {

    titleLabel: cc.Label = null;
    nameEditBox: cc.EditBox = null;
    mainScrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    zhanduiAddPre: cc.Prefab = null;

    private searchId: string;
    private teamId: number;

    // LIFE-CYCLE CALLBACKS:

    doCloseDialog() {
        TeaChenYuan.instance.doShowCyCaoBtn = false;
        this.node.active = false;
    }
    onLoad () {
        // 俱乐部名字输入框
        this.nameEditBox = cc.find("Node_Content/Seach_EditBox", this.node).getComponent(cc.EditBox);
        //this.titleLabel = cc.find("Node_Content/Title_Label", this.node).getComponent(cc.Label);

        this.initViews();
    }

    initViews () {
        this.mainScrollView = cc.find("Node_Content/List_ScrollView", this.node).getComponent(cc.ScrollView);
    }
    start () {

    }
    // onEnable () {
    //     // this.doGetList();
    // }
    onDisable () {
        this.searchId = ''
        this.nameEditBox.string = ''
    }
    initParms(teamId, isNext) {
        this.teamId = teamId
        if (isNext) {
            //this.titleLabel.string = '成员列表'
        } else {
            //this.titleLabel.string = '选择队长'
        }
    }
    doGetList() {
        // @ts-ignore
        cc.g.hallMgr.searchZhanDuiAddPerList(TeaClass.instance.teaHouseId, this.teamId, this.searchId, TeaChenYuan.instance.zdSearchType, (resp)=>{
            cc.dlog('收到成员列表数据', resp)
            this.doRenderListView(resp.list)
        });
    }

    doRenderListView(dataArr) {
        this.mainScrollView.content.removeAllChildren(true);
        // @ts-ignore
        if (!cc.g.utils.judgeArrayEmpty(dataArr)) {
            // 显示数据
            dataArr.forEach((pItem, key) => {
                let cardNode = cc.instantiate(this.zhanduiAddPre);
                // 头像
                let headerImage = cc.find("Sprite_Header", cardNode).getComponent(cc.Sprite);
                // @ts-ignore
                cc.g.utils.setHead(headerImage, pItem.icon);

                let name = cc.find("Name_Label", cardNode).getComponent(cc.Label);
                name.string = pItem.name

                let nameId = cc.find("ID_Label", cardNode).getComponent(cc.Label);
                nameId.string = pItem.userId

                let tyBtn = cc.find("Add_Button", cardNode).getComponent(cc.Button);
                // @ts-ignore
                cc.g.utils.removeClickAllEvent(tyBtn);
                // @ts-ignore
                cc.g.utils.addClickEvent(tyBtn, this, 'tea_zdly_cz_tjdz', 'addPerson', pItem);
                // add
                this.mainScrollView.content.addChild(cardNode, 0);
            })
        }
    }

    addPerson (event, item) {
        cc.dlog('addPerson....')

        // @ts-ignore
        cc.g.utils.btnShake();

// // int32   searchType=4;//1 添加战队 2 转让战队  3 分配成员
        if (TeaChenYuan.instance.zdSearchType == 1) {
            // int32   teaHouseId = 1;//茶馆Id
            // int32   parentTeamId =2;//上级战队Id
            // int64   destUserId =3;//目标用户唯一Id
            // int32   destPosition=4;//目标用户职位(队长=41,组长=31,小组长=21,推荐人=11)
            // @ts-ignore
            cc.g.hallMgr.searchZhanDuiAddPerOne(TeaClass.instance.teaHouseId, this.teamId, item.userId, TeaChenYuan.instance.createPosition,  (resp)=>{
                this.doCloseDialog();
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    // @ts-ignore
                    cc.g.global.hint('操作成功');
                    // 重新获取数据
                    TeaChenYuan.instance.doGetRefreshList();
                } else {
                    // @ts-ignore
                    cc.g.global.hint('操作失败');
                }
            });
        } else if (TeaChenYuan.instance.zdSearchType == 2) {
            // int32   teaHouseId =1;//茶馆Id
            // int32   teamId =2;//战队Id
            // int64   destUserId1=3;//目标用户唯一Id
            // int64   destUserId2=4;//目标用户唯一Id
            // @ts-ignore
            cc.g.hallMgr.searchZhanDuiZrCy(TeaClass.instance.teaHouseId, this.teamId, TeaChenYuan.instance.curUserId, item.userId, (resp)=>{
                this.doCloseDialog();
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    // @ts-ignore
                    cc.g.global.hint('操作成功');
                    // 重新获取数据
                    TeaChenYuan.instance.doGetRefreshList();
                } else {
                    // @ts-ignore
                    cc.g.global.hint('操作失败');
                }
            });
        } else if (TeaChenYuan.instance.zdSearchType == 3) {
            // int32   teaHouseId = 1;//茶馆Id
            // int32   teamId =2;//上级战队Id
            // int64   destUserId =3;//目标用户唯一Id
            // @ts-ignore
            cc.g.hallMgr.searchZhanDuiFpCy(TeaClass.instance.teaHouseId, this.teamId, item.userId, (resp)=>{
                this.doCloseDialog();
                // @ts-ignore
                if (!cc.g.utils.judgeObjectEmpty(resp)) {
                    // @ts-ignore
                    cc.g.global.hint('操作成功');
                    // 重新获取数据
                    TeaChenYuan.instance.doGetRefreshList();
                } else {
                    // @ts-ignore
                    cc.g.global.hint('操作失败');
                }
            });
        }
    }

    doSeachPeson() {
        cc.dlog('点击创建房间');
        let name = this.nameEditBox.string;
        if(name === '') {
            // @ts-ignore
            cc.g.global.hint('Id不能为空');
            return;
        }
        this.searchId = this.nameEditBox.string;
        this.doGetList();
    }
    // update (dt) {}
}
