var TingCodeUtils = {
    // 最多3张鬼牌
    guiCode1: 0,
    guiCode2: 0,
    guiCode3: 0,
    doGetTingCode: function(tingCodeArr, newRlue) {
        if (!cc.g.utils.judgeArrayEmpty(tingCodeArr)) {
            // 听用
            let tingIndex = this.getTingYongCount(newRlue);
            // 显示黄色
            for (let i = 0; i < tingCodeArr.length; i++) {
                let code = tingCodeArr[i]
                if (tingIndex == 1) {
                    if (i == 1) {
                        // 最多3张鬼牌
                        this.guiCode1 = parseInt(code);
                        this.guiCode2 = 0;
                        this.guiCode3 = 0;
                    }
                } else if (tingIndex == 2) {
                    if (i == 0) {
                        // 最多3张鬼牌
                        this.guiCode1 = parseInt(code);
                    } else if (i == 1) {
                        this.guiCode2 = 0;
                    } else if (i == 2) {
                        this.guiCode3 = parseInt(code);
                    }
                } else if (tingIndex == 3) {
                    if (i == 0) {
                        // 最多3张鬼牌
                        this.guiCode1 = parseInt(code);
                    } else if (i == 1) {
                        this.guiCode2 = parseInt(code);
                    } else if (i == 2) {
                        this.guiCode3 = parseInt(code);
                    }
                }
            }
        }
    },
    getTingYongCount: function(newRlue) {
        // let newRlue = this.gameMgr.roomInfo.NewRlue
        let tingYongIndex = 0;

        // 听用个数
        for (let i = 0; i < newRlue.length; i++) {
            let num = parseInt(newRlue[i])
            if (num == 12) {
                tingYongIndex = 1; // 4
                break;
            } else if (num == 13) {
                tingYongIndex = 2; // 8
                break;
            } else if (num == 14) {
                tingYongIndex = 3; // 11
                break;
            }
        }

        return tingYongIndex
    },
    doGetTingCodeArr: function(tingIndex, code) {
        let tingCodeArr = [];
        if (tingIndex == 1) { // 4
            tingCodeArr.push(code)
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
            }
        } else if (tingIndex == 2) { // 8
            if (code > 0 && code < 10) {
                let codeDel = code-1
                if (codeDel < 1) {
                    codeDel = 9;
                }
                tingCodeArr.push(codeDel)

                tingCodeArr.push(code)

                let codePuls = code+1
                if (codePuls > 9) {
                    codePuls = 1;
                }
                tingCodeArr.push(codePuls)

            } else if (code > 10 && code < 20) {
                let codeDel = code-1
                if (codeDel < 11) {
                    codeDel = 19;
                }
                tingCodeArr.push(codeDel)

                tingCodeArr.push(code)

                let codePuls = code+1
                if (codePuls > 19) {
                    codePuls = 11;
                }
                tingCodeArr.push(codePuls)
            } else if (code > 20 && code < 30) {
                let codeDel = code-1
                if (codeDel < 21) {
                    codeDel = 29;
                }
                tingCodeArr.push(codeDel)
                tingCodeArr.push(code)
                let codePuls = code+1
                if (codePuls > 29) {
                    codePuls = 21;
                }
                tingCodeArr.push(codePuls)
            }
        } else if (tingIndex == 3) { // 11
            if (code > 0 && code < 10) {
                let codeDel = code-1
                if (codeDel < 1) {
                    codeDel = 9;
                }
                tingCodeArr.push(codeDel)
                tingCodeArr.push(code)
                let codePuls = code+1
                if (codePuls > 9) {
                    codePuls = 1;
                }
                tingCodeArr.push(codePuls)

            } else if (code > 10 && code < 20) {
                let codeDel = code-1
                if (codeDel < 11) {
                    codeDel = 19;
                }
                tingCodeArr.push(codeDel)
                tingCodeArr.push(code)
                let codePuls = code+1
                if (codePuls > 19) {
                    codePuls = 11;
                }
                tingCodeArr.push(codePuls)
            } else if (code > 20 && code < 30) {
                let codeDel = code-1
                if (codeDel < 21) {
                    codeDel = 29;
                }
                tingCodeArr.push(codeDel)
                tingCodeArr.push(code)
                let codePuls = code+1
                if (codePuls > 29) {
                    codePuls = 21;
                }
                tingCodeArr.push(codePuls)
            }
        }

        return tingCodeArr;
    },
};

module.exports = TingCodeUtils;