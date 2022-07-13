cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad() {
        this.details = this.node.getChildByName('Details');
    },

    init: function () {
        this.node.active = true;
        if( !this.isInited) {
            cc.g.hallMgr.getTeamData();
            this.isInited = true;
        }

    },

    updateDetailsInfo: function() {
        let teamData = cc.g.hallMgr.teamData;

        let weekPerformance = this.details.getChildByName('WeekPerformance');
        weekPerformance.getChildByName('Label').getComponent(cc.Label).string = teamData.achieve.week.toNumber();

        let directlyMember = this.details.getChildByName('DirectlyMember');
        directlyMember.getChildByName('Label').getComponent(cc.Label).string = teamData.achieve.owner.toNumber().toFixed(2);

        let agencyMember = this.details.getChildByName('AgencyMember');
        agencyMember.getChildByName('Label').getComponent(cc.Label).string = teamData.achieve.next.toNumber().toFixed(2);

        let weekWelfare = this.details.getChildByName('WeekWelfare');
        weekWelfare.getChildByName('Label').getComponent(cc.Label).string = teamData.employ.week.toFixed(2);

        let enableWelfare = this.details.getChildByName('EnableWelfare');
        enableWelfare.getChildByName('Label').getComponent(cc.Label).string = teamData.employ.available.toFixed(2);

        let totalWelfare = this.details.getChildByName('TotalWelfare');
        totalWelfare.getChildByName('Label').getComponent(cc.Label).string = teamData.employ.total.toFixed(2);

        let nextAgencyWelfare = this.details.getChildByName('NextAgencyWelfare');
        nextAgencyWelfare.getChildByName('Label').getComponent(cc.Label).string = teamData.employ.next.toFixed(2);

        let myMembers = this.details.getChildByName('MyMembers');
        myMembers.getComponent(cc.Label).string = '我的会员'+teamData.team.owner.toNumber()+'个';

        let weekAddMember = this.details.getChildByName('WeekAddMember');
        weekAddMember.getComponent(cc.Label).string = '本周新增'+teamData.team.incOwner.toNumber()+'个';

        let myAgency = this.details.getChildByName('MyAgency');
        myAgency.getComponent(cc.Label).string = '我的代理'+teamData.team.teamer.toNumber()+'个';

        let weekAddAgency = this.details.getChildByName('WeekAddAgency');
        weekAddAgency.getComponent(cc.Label).string = '本周新增'+teamData.team.incTeamer.toNumber()+'个';


    },

    closeTeam: function() {
        this.node.active = false;
    }

});
