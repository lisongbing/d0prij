let CompColorCodeUtils = {
    // 获取王牌
    compColorArr: function(codeArr, tCodeIndex, allCount) {
        let selectCodeArr = [];

        let tiaoCount = 0;
        let tongCount = 0;
        let wanCount = 0;

        for (let i = 0; i < codeArr.length; i++) {
            let code = codeArr[i]
            if (code > 1 && code <= 9) {
                tiaoCount++;
            } else if (code >= tCodeIndex && code <= 19) {
                tongCount++;
            } else if (code >= 21 && code <= 29) {
                wanCount++;
            }
        }

        if (tiaoCount > 0 && tongCount > 0 && wanCount > 0) {
            let min = tiaoCount < tongCount ? (tiaoCount < wanCount ? tiaoCount : wanCount)  : (tongCount < wanCount ? tongCount : wanCount);
            if (min == tiaoCount) {
                // 花色大于或者等于 4 才 判断单双
                if (tiaoCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code > 1 && code <= 9) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                // 找第二花色少的
                let minTwo = tongCount < wanCount ? tongCount  : wanCount;

                if (minTwo == tongCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                } else if (minTwo == wanCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                }
            } else if (min == tongCount) {

                // 花色大于或者等于 4 才 判断单双
                if (tongCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                    // if (code > 1 && code <= 9) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                // 找第二花色少的
                let minTwo = tiaoCount < wanCount ? tiaoCount  : wanCount;

                if (minTwo == tiaoCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                        // if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                } else if (minTwo == wanCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                }
            } else if (min == wanCount) {

                // 花色大于或者等于 4 才 判断单双
                if (wanCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= 21 && code<=29) {
                    // if (code >= tCodeIndex && code <= 19) {
                        // if (code > 1 && code <= 9) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                // 找第二花色少的
                let minTwo = tiaoCount < tongCount ? tiaoCount  : tongCount;

                if (minTwo == tiaoCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code > 1 && code <= 9) {
                                // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code > 1 && code <= 9) {
                                // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                } else if (minTwo == tongCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                        // if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    let selectCodeArrLen = selectCodeArr.length;
                    let showOneArrLen = showOneArr.length;
                    let allLen = selectCodeArrLen + showOneArrLen

                    // 如果单排个数和已选个数和小于4，则一起选中
                    if (allLen < allCount) {
                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                            // if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }

                        for (let i = 0; i < codeArr.length; i++) {
                            let code = codeArr[i]
                            if (code > 1 && code <= 9) {
                                // if (code >= tCodeIndex && code <= 19) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    } else {
                        for (let i = 0; i < showOneArr.length; i++) {
                            let code = showOneArr[i]
                            if (code >= tCodeIndex && code <= 19) {
                            // if (code >= 21 && code<=29) {
                                selectCodeArr.push(code)
                                if (selectCodeArr.length >= allCount) {
                                    break;
                                }
                            }
                        }

                        if (selectCodeArr.length >= allCount) {
                            return selectCodeArr
                        }
                    }
                }
            }
        } else if (tiaoCount == 0 && tongCount > 0 && wanCount > 0) {
            // 找第二花色少的
            let minTwo = tongCount < wanCount ? tongCount  : wanCount;

            if (minTwo == tongCount) {

                // 花色大于或者等于 4 才 判断单双
                if (tongCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }



                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            } else if (minTwo == wanCount) {

                // 花色大于或者等于 4 才 判断单双
                if (wanCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }



                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= 21 && code<=29) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            }
        } else if (tiaoCount > 0 && tongCount == 0 && wanCount > 0) {
            // 找第二花色少的
            let minTwo = tiaoCount < wanCount ? tiaoCount  : wanCount;

            if (minTwo == tiaoCount) {

                // 花色大于或者等于 4 才 判断单双
                if (tiaoCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }



                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code > 1 && code <= 9) {
                        // if (code >= tCodeIndex && code <= 19) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            } else if (minTwo == wanCount) {

                // 花色大于或者等于 4 才 判断单双
                if (wanCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= 21 && code<=29) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            }

        } else if (tiaoCount > 0 && tongCount > 0 && wanCount == 0) {
            // 找第二花色少的
            let minTwo = tiaoCount < tongCount ? tiaoCount  : tongCount;

            if (minTwo == tiaoCount) {

                // 花色大于或者等于 4 才 判断单双
                if (tiaoCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code > 1 && code <= 9) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code > 1 && code <= 9) {
                        // if (code >= tCodeIndex && code <= 19) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            } else if (minTwo == tongCount) {

                // 花色大于或者等于 4 才 判断单双
                if (tongCount >= allCount) {
                    let singArr = []
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            singArr.push(code)
                        }
                    }

                    // 找数组中只出现一次的数字
                    let showOneArr = [];
                    let showMoreOneArr = [];
                    for (let i = 0; i < singArr.length; i++){
                        if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                            showOneArr.push(singArr[i]);
                        } else {
                            showMoreOneArr.push(singArr[i]);
                        }
                    }

                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < showMoreOneArr.length; i++) {
                        let code = showMoreOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }


                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                        // if (code >= 21 && code<=29) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                let selectCodeArrLen = selectCodeArr.length;
                let showOneArrLen = showOneArr.length;
                let allLen = selectCodeArrLen + showOneArrLen

                // 如果单排个数和已选个数和小于4，则一起选中
                if (allLen < allCount) {
                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            // if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }

                    for (let i = 0; i < codeArr.length; i++) {
                        let code = codeArr[i]
                        if (code > 1 && code <= 9) {
                            // if (code >= tCodeIndex && code <= 19) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                } else {
                    for (let i = 0; i < showOneArr.length; i++) {
                        let code = showOneArr[i]
                        if (code >= tCodeIndex && code <= 19) {
                            // if (code >= 21 && code<=29) {
                            selectCodeArr.push(code)
                            if (selectCodeArr.length >= allCount) {
                                break;
                            }
                        }
                    }

                    if (selectCodeArr.length >= allCount) {
                        return selectCodeArr
                    }
                }
            }
        } else if (tiaoCount > 0 && tongCount ==0 && wanCount ==0) {

            // 花色大于或者等于 4 才 判断单双
            if (tiaoCount >= allCount) {
                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code > 1 && code <= 9) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                for (let i = 0; i < showOneArr.length; i++) {
                    let code = showOneArr[i]
                    if (code > 1 && code <= 9) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                for (let i = 0; i < showMoreOneArr.length; i++) {
                    let code = showMoreOneArr[i]
                    if (code > 1 && code <= 9) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }
            }


            for (let i = 0; i < codeArr.length; i++) {
                let code = codeArr[i]
                if (code > 1 && code <= 9) {
                    selectCodeArr.push(code)
                    if (selectCodeArr.length >= allCount) {
                        break;
                    }
                }
            }

            if (selectCodeArr.length >= allCount) {
                return selectCodeArr
            }
        } else if (tiaoCount == 0 && tongCount > 0 && wanCount ==0) {

            // 花色大于或者等于 4 才 判断单双
            if (tongCount >= allCount) {
                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                for (let i = 0; i < showOneArr.length; i++) {
                    let code = showOneArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                for (let i = 0; i < showMoreOneArr.length; i++) {
                    let code = showMoreOneArr[i]
                    if (code >= tCodeIndex && code <= 19) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }
            }



            for (let i = 0; i < codeArr.length; i++) {
                let code = codeArr[i]
                if (code >= tCodeIndex && code <= 19) {
                    selectCodeArr.push(code)
                    if (selectCodeArr.length >= allCount) {
                        break;
                    }
                }
            }

            if (selectCodeArr.length >= allCount) {
                return selectCodeArr
            }
        } else if (tiaoCount == 0 && tongCount == 0 && wanCount > 0) {

            // 花色大于或者等于 4 才 判断单双
            if (wanCount >= allCount) {
                let singArr = []
                for (let i = 0; i < codeArr.length; i++) {
                    let code = codeArr[i]
                    if (code >= 21 && code<=29) {
                        singArr.push(code)
                    }
                }

                // 找数组中只出现一次的数字
                let showOneArr = [];
                let showMoreOneArr = [];
                for (let i = 0; i < singArr.length; i++){
                    if(singArr.indexOf(singArr[i]) === singArr.lastIndexOf(singArr[i])){
                        showOneArr.push(singArr[i]);
                    } else {
                        showMoreOneArr.push(singArr[i]);
                    }
                }

                for (let i = 0; i < showOneArr.length; i++) {
                    let code = showOneArr[i]
                    if (code >= 21 && code<=29) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }

                for (let i = 0; i < showMoreOneArr.length; i++) {
                    let code = showMoreOneArr[i]
                    if (code >= 21 && code<=29) {
                        selectCodeArr.push(code)
                        if (selectCodeArr.length >= allCount) {
                            break;
                        }
                    }
                }

                if (selectCodeArr.length >= allCount) {
                    return selectCodeArr
                }
            }




            for (let i = 0; i < codeArr.length; i++) {
                let code = codeArr[i]
                if (code >= 21 && code<=29) {
                    selectCodeArr.push(code)
                    if (selectCodeArr.length >= allCount) {
                        break;
                    }
                }
            }

            if (selectCodeArr.length >= allCount) {
                return selectCodeArr
            }
        }

        return selectCodeArr;
    },
};

module.exports = CompColorCodeUtils;