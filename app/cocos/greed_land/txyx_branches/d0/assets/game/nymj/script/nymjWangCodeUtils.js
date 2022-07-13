var TingCodeUtils = {
    // 最多3张鬼牌
    guiCode1: 0,
    guiCode2: 0,
    guiCode3: 0,
    doGetTingCode: function(tingCodeArr, newRlue) {
        if (!cc.g.utils.judgeArrayEmpty(tingCodeArr)) {
            // 显示黄色
            for (let i = 0; i < tingCodeArr.length; i++) {
                let code = tingCodeArr[i]
                this.guiCode1 = parseInt(code);
            }
        }
    },
    // 王牌是否可以打出去
    getTingYongCount: function(newRlue) {
        // let newRlue = this.gameMgr.roomInfo.NewRlue
        let canPlayWang = false;

        // 听用个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 14) {
                canPlayWang = true;
                break;
            }
        }

        return canPlayWang
    },
    // 获取王牌
    doGetTingCodeArr: function(tingIndex, code) {
        let tingCodeArr = [];
        if (code > 0 && code < 10) {
            let codePuls = code+1
            if (codePuls > 9) {
                codePuls = 1;
            }
            tingCodeArr.push(codePuls)
        } else if (code > 10 && code < 20) {
            let codePuls = code+1
            if (codePuls > 19) {
                codePuls = 11;
            }
            tingCodeArr.push(codePuls)
        } else if (code > 20 && code < 30) {
            let codePuls = code+1
            if (codePuls > 29) {
                codePuls = 21;
            }
            tingCodeArr.push(codePuls)
        } else if (code == 50) {
            tingCodeArr.push(code)
        }

        return tingCodeArr;
    },
};

module.exports = TingCodeUtils;