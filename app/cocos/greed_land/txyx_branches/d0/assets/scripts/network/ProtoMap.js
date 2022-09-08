module.exports = {
	registerProtoMap() {
		let protoMap = {
			1004: {
				req:PB.GetRoomListReq,
				resp:PB.GetRoomListResp,
			},
			1005: {
				req:PB.CreateRoomReq,
				resp:PB.CreateRoomResp,
			},
			1006: {
				req:PB.JoinRoomReq,
				resp:PB.JoinRoomResp,
			},
			1007: {
				req:PB.QuitRoomReq,
			},
			1008: {
				req:PB.MatchReq,
				resp:PB.MatchResp,
			},
			1009: {
				resp:PB.RoomListNtf,
			},
			1010: {
				resp:PB.GameStatusNtf,
			},
			1011: {
				req:PB.UserOpReq,
			},
			1012: {
				resp:PB.MoneyUpdateNtf,
			},
			1013: {
				resp:PB.JoinRoomNtf,
			},
			1014: {
				resp:PB.QuitRoomNtf,
			},
			1015: {
				resp:PB.UserStatusNtf,
			},
			1016: {
				resp:PB.UserOPNtf,
			},
			1017: {
				resp:PB.MJPlayerResultListNtf,
			},
			1018: {
				req:PB.TalkToAllReq,
				resp:PB.TalkToAllResp,
			},
			1019: {
				resp:PB.GameMoneyUpdateNtf,
			},
			1020: {
				req:PB.GetRoomDataReq,
				resp:PB.GetRoomDataResp,
			},
			1021: {
				req:PB.GetPlayerScoreReq,
				resp:PB.GetPlayerScoreResp,
			},
			1022: {
				resp:PB.ShareNumNtf,
			},
			1023: {
				req:PB.BindPlayerGVoiceIDReq,
				resp:PB.BindPlayerGVoiceIDResp,
			},
			1024: {
				resp:PB.BigTwoPlayerResultListNtf,
			},
			1025: {
				resp:PB.BigTwoPlayerEndResultListNtf,
			},
			1026: {
				req:PB.GetMultipleFightGradeReq,
				resp:PB.GetMultipleFightGradeResp,
			},
			1027: {
				resp:PB.GamePlayerResultListNtf,
			},
			1028: {
				resp:PB.GamePlayerEndResultListNtf,
			},
			1029: {
				req:PB.SetGpsInfoReq,
				resp:PB.SetGpsInfoResp,
			},
			1030: {
				resp:PB.PdkPlayerResultListNtf,
			},
			1031: {
				resp:PB.PdkPlayerEndResultListNtf,
			},
			1032: {
				req:PB.GetClubMaxWinReq,
				resp:PB.GetClubMaxWinResp,
			},
			1033: {
				req:PB.GetClubMaxFightReq,
				resp:PB.GetClubMaxFightResp,
			},
			1034: {
				req:PB.GetRoomInfoReq,
				resp:PB.GetRoomInfoResp,
			},
			1035: {
				resp:PB.FiveDdzPlayerResultListNtf,
			},
			1036: {
				resp:PB.DdzPlayerEndResultListNtf,
			},
			1037: {
				req:PB.NoticeListReq,
				resp:PB.NoticeListResp,
			},
			1038: {
				resp:PB.NoticeListPushResp,
			},
			1039: {
				req:PB.CommitAgentReq,
			},
			1040: {
				req:PB.BindRecommenterReq,
			},
			1041: {
				req:PB.BindReommentInfoReq,
				resp:PB.BindReommentInfoResp,
			},
			1042: {
				resp:PB.LeShanPdkPlayerResultListNtf,
			},
			1043: {
				resp:PB.GongXianPdkPlayerResultListNtf,
			},
			1044: {
				resp:PB.TTPSEndResultListNtf,
			},
			1045: {
				resp:PB.GaoXianPdkPlayerResultListNtf,
			},
			1046: {
				resp:PB.PLAY_ILLEGALResp,
			},
			2000: {
				req:PB.HeartReq,
				resp:PB.HeartResp,
			},
			2001: {
				resp:PB.CommonResp,
			},
			2002: {
				req:PB.LoginReq,
				resp:PB.LoginResp,
			},
			2003: {
				req:PB.LogoutReq,
				resp:PB.LogoutResp,
			},
			2016: {
				req:PB.OpenMailReq,
			},
			2017: {
				req:PB.NoticeReq,
				resp:PB.NoticeResp,
			},
			2018: {
				req:PB.WithDrawReq,
			},
			2019: {
				req:PB.DepositReq,
			},
			2020: {
				resp:PB.BankUpdateNtf,
			},
			2021: {
				req:PB.SetBankPasswdReq,
			},
			2022: {
				req:PB.VerifyBankPasswdReq,
			},
			2023: {
				req:PB.RankingReq,
				resp:PB.RankingResp,
			},
			2024: {
				req:PB.ModifyUserInfo,
			},
			2025: {
				req:PB.TransferReq,
			},
			2026: {
				req:PB.ShareReq,
			},
			2027: {
				req:PB.DistributionReq,
				resp:PB.DistributionResp,
			},
			2028: {
				req:PB.CloseAccountReq,
				resp:PB.CloseAccountResp,
			},
			2029: {
				req:PB.ExchangeReq,
			},
			2030: {
				req:PB.BindReq,
			},
			2031: {
				req:PB.GetTeamRewardReq,
			},
			2032: {
				req:PB.GetShareRewardReq,
			},
			2033: {
				req:PB.ChargeReq,
				resp:PB.ChargeResp,
			},
			2034: {
				req:PB.CreateClubReq,
				resp:PB.CreateClubResp,
			},
			2035: {
				req:PB.GetClubListReq,
				resp:PB.GetClubListResp,
			},
			2036: {
				req:PB.SearchClubReq,
				resp:PB.SearchClubResp,
			},
			2037: {
				req:PB.JoinClubReq,
			},
			2038: {
				req:PB.ModifyClubInfoReq,
			},
			2039: {
				req:PB.QuitClubReq,
			},
			2040: {
				req:PB.DisbandClubReq,
			},
			2041: {
				req:PB.ClubApproveReq,
				resp:PB.ClubApproveResp,
			},
			2042: {
				req:PB.GetClubApplyListReq,
				resp:PB.GetClubApplyListResp,
			},
			2043: {
				req:PB.GetClubMembersListReq,
				resp:PB.GetClubMembersListResp,
			},
			2044: {
				req:PB.SetClubAdministratorReq,
			},
			2045: {
				req:PB.DeleteClubMemberReq,
			},
			2046: {
				req:PB.ModifyClubGameReq,
			},
			2047: {
				req:PB.GetShareRedPkgReq,
				resp:PB.GetShareRedPkgResp,
			},
			2048: {
				req:PB.GetActionListReq,
				resp:PB.GetActionListResp,
			},
			2049: {
				req:PB.ActionRankingReq,
				resp:PB.ActionRankingResp,
			},
			2050: {
				req:PB.CreateClubRoomReq,
				resp:PB.CreateClubRoomResp,
			},
			2051: {
				req:PB.ClubRoomListReq,
				resp:PB.ClubRoomListResp,
			},
			2052: {
				req:PB.JoinClubDeskReq,
				resp:PB.JoinClubDeskResp,
			},
			2053: {
				req:PB.ModifyClubRoomRuleReq,
				resp:PB.ModifyClubRoomRuleResp,
			},
			2054: {
				req:PB.ModifyClubRoomDecReq,
			},
			2055: {
				req:PB.ClubRoomDeskInfoReq,
				resp:PB.ClubRoomDeskInfoResp,
			},
			2056: {
				req:PB.RemoveClubRoomReq,
			},
			2057: {
				req:PB.SetClubRoomModeReq,
			},
			2058: {
				resp:PB.SendClubChangesResp,
			},
			2059: {
				req:PB.CLubDaysConsumeReq,
				resp:PB.CLubDaysConsumeResp,
			},
			2100: {
				req:PB.SendPlayerLocation,
			},
			2201: {
				req:PB.CreateTeaHouseReq,
				resp:PB.CreateTeaHouseResp,
			},
			2202: {
				req:PB.ApplyTeaHouseReq,
			},
			2203: {
				req:PB.AgreeTeaHouseReq,
			},
			2204: {
				req:PB.RefuseTeaHouseReq,
			},
			2205: {
				req:PB.TeaHouseSettingInfoReq,
				resp:PB.TeaHouseSettingInfoResp,
			},
			2206: {
				req:PB.ModifyTeaHouseSettingReq,
			},
			2207: {
				req:PB.ApplyExitTeaHouseReq,
			},
			2208: {
				req:PB.AgreeExitTeaHouseReq,
			},
			2209: {
				req:PB.RefuseExitTeaHouseReq,
			},
			2210: {
				req:PB.KickTeaHouseReq,
			},
			2211: {
				req:PB.DisbandTeaHouseReq,
			},
			2212: {
				req:PB.FindUserTeaHouseReq,
				resp:PB.FindUserTeaHouseResp,
			},
			2213: {
				req:PB.InviteTeaHouseReq,
			},
			2214: {
				req:PB.MineTeaHouseListReq,
				resp:PB.MineTeaHouseListResp,
			},
			2215: {
				req:PB.ApplyListTeaHouseReq,
				resp:PB.ApplyListTeaHouseResp,
			},
			2216: {
				req:PB.MemberListTeaHouseReq,
				resp:PB.MemberListTeaHouseResp,
			},
			2217: {
				req:PB.RecentOutInListTeaHouseReq,
				resp:PB.RecentOutInListTeaHouseResp,
			},
			2218: {
				req:PB.DySetTeaHouseReq,
			},
			2219: {
				req:PB.TimerSetTeaHouseReq,
			},
			2220: {
				req:PB.ModifyTeaHouseMemberRemarkReq,
			},
			2221: {
				req:PB.TeaHouseGetMemberRemarkReq,
				resp:PB.TeaHouseGetMemberRemarkResp,
			},
			2222: {
				req:PB.TeaHouseForbidGameReq,
			},
			2223: {
				req:PB.TeaHouseForbidGameAllReq,
			},
			2224: {
				req:PB.TeaHouseTwoPeopleReq,
			},
			2225: {
				req:PB.TeaHouseTwoPeopleAllReq,
			},
			2226: {
				req:PB.TeaHouseSetFloorLimitReq,
				resp:PB.TeaHouseSetFloorLimitResp,
			},
			2227: {
				req:PB.TeaHouseGetFloorLimitReq,
				resp:PB.TeaHouseGetFloorLimitResp,
			},
			2228: {
				req:PB.KickTeamTeaHouseReq,
				resp:PB.KickTeamTeaHouseResp,
			},
			2229: {
				resp:PB.NotifyTeaHouseIdResp,
			},
			2230: {
				resp:PB.NotifyApplyTeaHouseResp,
			},
			2231: {
				req:PB.MineApplyListTeaHouseReq,
				resp:PB.MineApplyListTeaHouseResp,
			},
			2232: {
				resp:PB.NotifyDySettingResp,
			},
			2233: {
				resp:PB.NotifyDisbandTeaHouseResp,
			},
			2234: {
				req:PB.GetTimerTeaHouseReq,
				resp:PB.GetTimerTeaHouseResp,
			},
			2235: {
				req:PB.CreateTeaHouseRoomReq,
			},
			2236: {
				req:PB.RemoveTeaHouseRoomReq,
			},
			2237: {
				req:PB.ModifyTeaHouseRoomNameReq,
			},
			2238: {
				req:PB.ModifyTeaHouseRoomStatusReq,
			},
			2239: {
				req:PB.ModifyTeaHouseRoomRuleReq,
			},
			2240: {
				req:PB.TeaHouseHallReq,
				resp:PB.TeaHouseHallResp,
			},
			2241: {
				req:PB.TeaHouseRoomDeskListReq,
				resp:PB.TeaHouseRoomDeskListResp,
			},
			2242: {
				req:PB.TeaHouseDeskListReq,
				resp:PB.TeaHouseDeskListResp,
			},
			2243: {
				resp:PB.NotifyTeaHouseAddDeskResp,
			},
			2244: {
				resp:PB.NotifyTeaHouseRemoveDeskResp,
			},
			2245: {
				req:PB.JoinTeaHouseDeskReq,
			},
			2246: {
				req:PB.DisbandTeaHouseDeskReq,
			},
			2248: {
				resp:PB.NotifyChangeTeaHouseDeskResp,
			},
			2249: {
				resp:PB.NotifyExitTeaHouseDeskResp,
			},
			2250: {
				resp:PB.NotifyAddTeaHouseRoomResp,
			},
			2251: {
				resp:PB.NotifyModifyTeaHouseRoomResp,
			},
			2252: {
				resp:PB.NotifyDeleteTeaHouseRoomResp,
			},
			2253: {
				resp:PB.NotifyTeaHouseRoomNameResp,
			},
			2254: {
				resp:PB.NotifyTeaHouseRoomStatusResp,
			},
			2255: {
				resp:PB.NotifyTeaHousePlayerReadyResp,
			},
			2256: {
				resp:PB.NotifyTeaHouseGameNumResp,
			},
			2257: {
				resp:PB.NotifyTeaHouseApplyCountResp,
			},
			2258: {
				req:PB.TeaHouseTeamListReq,
				resp:PB.TeaHouseTeamListResp,
			},
			2259: {
				req:PB.CreateTeaHouseTeamReq,
			},
			2260: {
				req:PB.AssignTeaHouseTeamReq,
			},
			2261: {
				req:PB.TransferTeaHouseTeamReq,
			},
			2262: {
				req:PB.TeaHouseGetContribueRateReq,
				resp:PB.TeaHouseGetContribueRateResp,
			},
			2263: {
				req:PB.TeaHouseSetContribueRateReq,
				resp:PB.TeaHouseSetContribueRateResp,
			},
			2264: {
				req:PB.TeaHouseCleanZeroListReq,
				resp:PB.TeaHouseCleanZeroListResp,
			},
			2265: {
				req:PB.TeaHouseSetCleanZeroReq,
			},
			2266: {
				req:PB.TeaHouseTeamStatListReq,
				resp:PB.TeaHouseTeamStatListResp,
			},
			2267: {
				req:PB.TeaHouseTeamDirectCleanReq,
			},
			2268: {
				req:PB.TeaHouseTeamSetCordonReq,
			},
			2272: {
				req:PB.TeaHouseRecordReq,
				resp:PB.MyTeaHouseRecordResp,
			},
			2273: {
				req:PB.MemberTeaHouseRecordReq,
				resp:PB.MemberTeaHouseRecordResp,
			},
			2274: {
				req:PB.RecentTeaHouseRecordReq,
				resp:PB.RecentTeaHouseRecordResp,
			},
			2275: {
				req:PB.DetailTeaHouseRecordReq,
				resp:PB.DetailTeaHouseRecordResp,
			},
			2276: {
				req:PB.CircleTeaHouseRecordReq,
				resp:PB.CircleTeaHouseRecordResp,
			},
			2277: {
				req:PB.TeamTeaHouseRecordReq,
				resp:PB.TeamTeaHouseRecordListResp,
			},
			2278: {
				req:PB.GoldMatchDateLogReq,
				resp:PB.GoldMatchDateLogResp,
			},
			2279: {
				req:PB.RecordTotalScoreReq,
				resp:PB.RecordTotalScoreResp,
			},
			2281: {
				req:PB.GetGoldMatchOpenReq,
				resp:PB.GetGoldMatchOpenResp,
			},
			2282: {
				req:PB.ModifyGoldMatchOpenReq,
				resp:PB.ModifyGoldMatchOpenResp,
			},
			2283: {
				req:PB.GetGoldMatchSettingReq,
				resp:PB.GetGoldMatchSettingResp,
			},
			2284: {
				req:PB.ModifyGoldMatchSettingReq,
				resp:PB.ModifyGoldMatchSettingResp,
			},
			2285: {
				req:PB.PauseGoldMatchReq,
			},
			2286: {
				req:PB.ApplyGoldMatchReq,
			},
			2287: {
				req:PB.GoldMatchApplyListReq,
				resp:PB.GoldMatchApplyListResp,
			},
			2288: {
				req:PB.AgreeGoldMatchReq,
			},
			2289: {
				req:PB.RefuseGoldMatchReq,
			},
			2290: {
				req:PB.KickGoldMatchReq,
			},
			2291: {
				req:PB.CompensateGoldMatchReq,
				resp:PB.CompensateGoldMatchResp,
			},
			2292: {
				req:PB.AdjustCreditGoldMatchReq,
				resp:PB.AdjustCreditGoldMatchResp,
			},
			2293: {
				req:PB.GoldMatchGoldListReq,
				resp:PB.GoldMatchGoldListResp,
			},
			2294: {
				req:PB.GoldMatchRankListReq,
				resp:PB.GoldMatchRankListResp,
			},
			2295: {
				req:PB.GoldMatchTeamListReq,
				resp:PB.GoldMatchTeamListResp,
			},
			2296: {
				req:PB.GoldMatchCreditListReq,
				resp:PB.GoldMatchCreditListResp,
			},
			2297: {
				resp:PB.NotifyGoldMatchOpenResp,
			},
			2298: {
				resp:PB.NotifyGoldMatchPauseResp,
			},
			2299: {
				resp:PB.NotifyGoldMatchGoldResp,
			},
			2300: {
				resp:PB.NotifyGoldMatchCreditResp,
			},
			2301: {
				req:PB.ModifyCreditOpenReq,
			},
			2302: {
				resp:PB.NotifyCreditOpenResp,
			},
			2303: {
				req:PB.GetMineGoldMatchReq,
				resp:PB.GetMineGoldMatchResp,
			},
			2304: {
				resp:PB.NotifyMineGoldMatchResp,
			},
			2305: {
				resp:PB.NotifyGoldMatchAuthorizeResp,
			},
			2306: {
				resp:PB.NotifyTeaHouseNameResp,
			},
			2307: {
				req:PB.UpgradeTeaHousePositionReq,
			},
			2308: {
				req:PB.CancelTeaHousePositionReq,
			},
			2309: {
				req:PB.FilterTeaHouseMemberReq,
				resp:PB.FilterTeaHouseMemberResp,
			},
			2310: {
				req:PB.ImportingTeaHouseReq,
			},
			2311: {
				req:PB.ImportingTeaHouseListReq,
				resp:PB.ImportingTeaHouseListResp,
			},
			2312: {
				resp:PB.NotifyJoinTeaHouseResp,
			},
			2313: {
				resp:PB.NotifyExitTeaHouseResp,
			},
			2314: {
				req:PB.InviteThPlayerListReq,
				resp:PB.InviteThPlayerListResp,
			},
			2315: {
				req:PB.InviteThPlayerJoinGameReq,
			},
			2316: {
				req:PB.InviteThAllPlayerJoinGameReq,
			},
			2317: {
				resp:PB.NotifyThGameInviteResp,
			},
			2318: {
				resp:PB.NotifyTeaHouseMoneyResp,
			},
			2319: {
				resp:PB.NotifyGoldMatchFeeResp,
			},
			2320: {
				resp:PB.NotifyGoldCompensateTipsResp,
			},
			2321: {
				req:PB.KickTeaHouseDeskReq,
			},
			2322: {
				req:PB.TeaHouseAssociateListReq,
				resp:PB.TeaHouseAssociateListResp,
			},
			2323: {
				req:PB.TeaHouseSetAssociateReq,
			},
			2324: {
				req:PB.TeaHouseChangeDeskReq,
			},
			2325: {
				req:PB.TeaHouseRoomDesksReq,
				resp:PB.TeaHouseRoomDesksResp,
			},
			2326: {
				req:PB.TeaHouseChangeDeskListReq,
				resp:PB.TeaHouseChangeDeskListResp,
			},
			2327: {
				req:PB.TeaHouseEnterSceneReq,
			},
			2328: {
				req:PB.TeaHouseQuitSceneReq,
			},
			2329: {
				resp:PB.NotifyTeaHouseSceneChangeResp,
			},
			2330: {
				req:PB.TeaHouseBlackGroupListReq,
				resp:PB.TeaHouseBlackGroupListResp,
			},
			2331: {
				req:PB.TeaHouseBlackGroupReq,
				resp:PB.TeaHouseBlackGroupResp,
			},
			2332: {
				req:PB.TeaHouseBlackGroupOperReq,
			},
			2333: {
				resp:PB.NotifyTeaBlackGroupDelResp,
			},
			2334: {
				req:PB.TeaHouseBlackGroupRenameReq,
			},
			2335: {
				req:PB.TeaHouseBlackGroupFilterReq,
				resp:PB.TeaHouseBlackGroupFilterResp,
			},
			2336: {
				req:PB.GoldMatchInviteListReq,
				resp:PB.GoldMatchInviteListResp,
			},
			2337: {
				req:PB.GoldMatchInviteReq,
			},
			2338: {
				req:PB.StrongboxPwdSetReq,
			},
			2339: {
				req:PB.StrongboxLoginReq,
				resp:PB.StrongboxLoginResp,
			},
			2340: {
				req:PB.StrongboxGetGoldReq,
				resp:PB.StrongboxGetGoldResp,
			},
			2341: {
				req:PB.StrongboxWithdrawReq,
				resp:PB.StrongboxWithdrawResp,
			},
			2342: {
				req:PB.StrongboxIncomeListReq,
				resp:PB.StrongboxIncomeListResp,
			},
			2343: {
				req:PB.TeaHouseMemberSetCordonReq,
			},
			2344: {
				resp:PB.NotifyTeaHouseDeskCountResp,
			},
			2345: {
				req:PB.TeaHouseBlackSaveReq,
			},
			2401: {
				req:PB.KickGameReq,
			},
			2402: {
				req:PB.FenBaoReq,
				resp:PB.FenBaoResp,
			},
			2403: {
				req:PB.ShiMingReq,
			},
			2501: {
				req:PB.GetPhoneValidCodeReq,
			},
			2502: {
				req:PB.BindPhoneReq,
			},
			2503: {
				req:PB.ModifyPhoneLoginSecretReq,
			},
			2504: {
				req:PB.ModifyPhoneLoginReq,
			},
		};
		 return protoMap;
	}
}