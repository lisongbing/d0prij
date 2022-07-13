let PHI = {};

// 协议号信息
PHI.msgNum = {
    '2002':'玩家登陆',
};

PHI.desc = (num) => {
    return (cc.g.msgCodeIfo && cc.g.msgCodeIfo.com[num]) || PHI.msgNum[num] || '未说明';
    
}


// ====================================================================================

module.exports = PHI;
