

var HuPaiUtils = {
    hupaiPrograms: {},
    mingtangToFun: {
        "平胡":   0,
        "无听用":  2, //无听用,
        "归":    1, //归,
        "大对子":  2, //大对子
        "金钩钓":  0, //金钩钓
        "小七对":  2, //小七对
        "清一色":  2, //清一色
        "将对":   2, //将对
        "龙七对":  3, //龙七对
        "双龙七对": 4,
        "三龙七对":5,
        "杠上开花": 1,
        "自摸":   1,
    },
    wutingYong : true,
    setWuATingYong: function(rules){
        for (var i in rules){
            if (rules[i] == 12){
                this.wutingYong = false;
                break;
            }
        }
    },
    //传入手牌,及缺的门数,规则
    showHuPaiPrompt:function(handleArr,putoutCards,que,rules){
        let result = new Map();
        this.setWuATingYong(rules);
        this.back = [];
        this.result = [];
        // cc.dlog('showHuPaiPrompt start \n\n\n\n')
        // cc.dlog('handleArr-->' + JSON.stringify(handleArr))
        // cc.dlog('handLen-->' + handLen)
        // cc.dlog('putoutCards-->' + JSON.stringify(putoutCards))
        // cc.dlog('que-->' + que)
        // cc.dlog('showHuPaiPrompt end \n\n\n\n')

        handleArr.sort(function(a,b){return a-b;})
        let handLen = handleArr.length%3
        if (handLen!=1){
            return result;
        }

        let hongZhongNum ;
        let hongZhongNumNotQiDui;
        hongZhongNum = this.computeHongZhongNum(handleArr); //红中的数量
        hongZhongNumNotQiDui = hongZhongNum;
        // //cc.log("红中的数量是:",hongZhongNum);
        if (this.computeHaveQue(handleArr,putoutCards,que)){
            // //cc.log("牌型中有缺的牌,不能胡牌")
            return {};
        }
        ////cc.log("test:",result[0]==undefined)
        if (handleArr.length == 13){
            //七小对的情况
            let qiduiGroup = this.computeAllQiDuiGroup(handleArr,hongZhongNum);
            let hand = handleArr.slice(0,handleArr.length);
            this.computeQiDuiBack(0,qiduiGroup,hand,7);
            // //cc.log("七小对的胡牌组合",this.result);
            this.computeMaxFunQidui(result,putoutCards,que);
        }

        //重置
        this.back = [];
        this.result = [];
        //计算非七小对
        this.computeAllNotQiDuiGroup(handleArr,hongZhongNumNotQiDui);
        // //cc.log("非七小对的胡牌组合",this.result);
        //this.result = [3,4,4,5,6,6,6,6,7,7];
        //putoutCards =[[2,2,2]];
        this.computeMaxFunNormal(result,putoutCards,que);
        let jsonMapStr = JSON.stringify(result)
        let obj = JSON.parse(jsonMapStr)
        let newHuMap = new Map();
        for (let k of Object.keys(obj)) {
            newHuMap.set(k,obj[k]);
        }
        if (this.wutingYong){
            newHuMap.forEach(function(value,key){
                if (result[50]==undefined||result[50]<value){
                    result[50]=value;
                }
            })
        }
        //是否是没有听用
        if (this.computeWuTingYong(handleArr,putoutCards)){
            // //cc.log('result==>' + JSON.stringify(result))
            // 使用箭头函数，否则，this，指向错误
            newHuMap.forEach((value,key) => {
                if (key != 50){
                    if (this.wutingYong){
                        result[key]+=this.mingtangToFun["无听用"]
                    }
                }
            })
        }
        // //cc.log("最终的番数",result);

        return result;
    },
    huque:function(hand,putoutCards,que){
        let q = que;
        let colors = [0,0,0];
        if (que == -1){
            for(var i in hand){
                for (let j = 0;j<hand[i].length;j++){
                    let index = hand[i][j]/10;
                    if (index >=0 && index < 3){
                        colors[Math.floor(index)]++;                         
                    }
                }
				
			}

            for (var i in putoutCards){
                if (putoutCards[i].length == 3){
                    colors[Math.floor(putoutCards[i][0]/10)]++;
                }else{//gang
                    colors[Math.floor(putoutCards[i][1]/10)]++;
                }
            }

            for (var i =0;i<3;i++){
                colors[i]++;
                if  (colors[0] > 0 && colors[1] > 0&&colors[2] > 0){
                    q = i;
                    break
                }
                colors[i]--;
            }
        }
        return q;
    },
    //计算七对的最大番
    computeMaxFunQidui:function(result,putoutCards,que){
        if (this.result.length == 0){ //没有七小对
            return
        }
        const QIDUIROW = 7;
        const HongZhong = 50;
        for (var i = 0; i < this.result.length/QIDUIROW; i++) {
            let hucard = this.result[QIDUIROW*i+6][0];
            let huGroup = this.result.slice(QIDUIROW*i,QIDUIROW*(i+1));
            let que1 = this.huque(huGroup,putoutCards,que);
            switch (hucard) { //最后一个
                case HongZhong: //和所有
                    for (var j = 1; j <= 29; j++) {
                        if (Math.floor(j/10) != que1 && j%10 != 0){ //不是缺的哪一门都能胡
                            //计算番数
                            this.computeFun(this.result.slice(QIDUIROW*i,QIDUIROW*(i+1)), putoutCards,j, true,result,que);
                        }
                    }
                default: //胡当个
                    this.computeFun(this.result.slice(QIDUIROW*i,QIDUIROW*(i+1)),putoutCards, hucard, true,result,que)
            }
            //胡红中
            this.computeFun(this.result.slice(QIDUIROW*i,QIDUIROW*(i+1)),putoutCards, HongZhong, true,result,que)
        }
    },
    //计算非七对的最大番
    computeMaxFunNormal:function(result,putoutCards,que){
        let HongZhong = 50;
        if (this.result.length == 0) {
            return
        }
        // //cc.log('putoutCards-->' + putoutCards.length)
        let row = 5 - putoutCards.length
        for (var i = 0; i < this.result.length/row; i++) {
            let huGroups = this.result.slice(row*i,row*(i+1))
            ////cc.log("huGroup的长度是:",huGroups.length,this.result.length,i,row)
            let que1 = this.huque(huGroups,putoutCards,que);
            let lastGroupCards = huGroups[row-1]
            // //cc.log('huGroups-->' + huGroups.length)
            if (!cc.g.utils.judgeArrayEmpty(lastGroupCards)) {
                switch (lastGroupCards.length) { //最后一个
                    case 1: //一个，单调将
                        switch (lastGroupCards[0]) {


                            case HongZhong:
                                for (var j = 1; j <= 29; j++) {
                                    if (Math.floor(j/10) != que1 && j%10 != 0 ){ //不是缺的哪一门都能胡
                                        //计算番数
                                        huGroups[row-1] = [j, j]
                                        this.computeFun(huGroups, putoutCards,j, false,result,que);
                                    }
                                }
                            default:
                                huGroups[row-1] = [lastGroupCards[0], lastGroupCards[0]]
                                this.computeFun(huGroups, putoutCards,lastGroupCards[0], false,result,que);
                        }

                    default: //两个
                        if  (lastGroupCards[0] == lastGroupCards[1]-1){
                            let firstHuCard = lastGroupCards[0] - 1
                            if (firstHuCard%10 != 0) {
                                huGroups[row-1] = [firstHuCard, lastGroupCards[0], lastGroupCards[1]];
                                this.computeFun(huGroups,putoutCards, firstHuCard, false,result,que);
                            }
                            let endHuCard = lastGroupCards[1] + 1
                            if (endHuCard%10 != 0 ){
                                huGroups[row-1] = [lastGroupCards[0], lastGroupCards[1], endHuCard];
                                this.computeFun(huGroups, putoutCards,endHuCard, false,result,que);
                            }
                        }else if (lastGroupCards[0] == lastGroupCards[1]-2){
                            let hucard = lastGroupCards[0] + 1;
                            huGroups[row-1] = [lastGroupCards[0], hucard, lastGroupCards[1]];
                            this.computeFun(huGroups,putoutCards, hucard, false,result,que);
                        }else if (lastGroupCards[0] == lastGroupCards[1] && lastGroupCards[0] != HongZhong){
                            let hucard = lastGroupCards[0]
                            huGroups[row-1] = [hucard, hucard, hucard]
                            this.computeFun(huGroups, putoutCards,hucard, false,result,que);
                        }else if (lastGroupCards[0] != lastGroupCards[1] && lastGroupCards[1] == HongZhong){
                            for (var bian = lastGroupCards[0] - 2; bian <= lastGroupCards[0]+2; bian++) {
                                if (bian <= 0 || bian%10 == 0 || Math.floor(bian/10) != Math.floor(lastGroupCards[0]/10) ){
                                    continue
                                }

                                if  (lastGroupCards[0]-bian == 2){
                                    let hucard = lastGroupCards[0] - 1;
                                    huGroups[row-1] = [bian, hucard, lastGroupCards[0]];
                                    this.computeFun(huGroups,putoutCards, hucard, false,result,que);
                                }else if (lastGroupCards[0]-bian == 1){
                                    let firstHuCard = bian - 1
                                    if (firstHuCard%10 != 0) {
                                        huGroups[row-1] = [firstHuCard, bian, lastGroupCards[0]]
                                        this.computeFun(huGroups,putoutCards, firstHuCard, false,result,que)
                                    }
                                    let endHuCard = bian + 2
                                    if (endHuCard%10 != 0) {
                                        huGroups[row-1] = [bian, lastGroupCards[0], endHuCard]
                                        this.computeFun(huGroups,putoutCards, endHuCard, false,result,que)
                                    }
                                }else if (lastGroupCards[0] == bian){
                                    huGroups[row-1] = [bian, bian, bian];
                                    this.computeFun(huGroups, putoutCards,bian, false,result,que);
                                }else if (lastGroupCards[0] -bian == -1){
                                    let firstHuCard = lastGroupCards[0] - 1
                                    if (firstHuCard%10 != 0 ){
                                        huGroups[row-1] = [firstHuCard, lastGroupCards[0], bian];
                                        this.computeFun(huGroups,putoutCards, firstHuCard, false,result,que);
                                    }
                                    let endHuCard = lastGroupCards[0] + 2
                                    if (endHuCard%10 != 0) {
                                        huGroups[row-1] = [lastGroupCards[0], bian, endHuCard];
                                        this.computeFun(huGroups,putoutCards, endHuCard, false,result,que);
                                    }
                                }else if(lastGroupCards[0]-bian == -2){
                                    let hucard = lastGroupCards[0] + 1
                                    huGroups[row-1] = [lastGroupCards[0], hucard, bian]
                                    this.computeFun(huGroups,putoutCards ,hucard, false,result,que)
                                }
                            }
                        }else if (lastGroupCards[0] == lastGroupCards[1] && lastGroupCards[1] == HongZhong){ //两个红中
                            for (var j = 1; j <= 29; j++){
                                if (Math.floor(j/10) != que1 && j%10 != 0 ){ //不是缺的哪一门都能胡
                                    //计算番数
                                    huGroups[row-1] = [j, j, j]
                                    this.computeFun(huGroups,putoutCards, j, false,result,que);
                                }
                            }
                        }
                }
            }
        }

    },

    //计算番数
    computeFun:function(group,putOutCards,hucard,qidui,result,que){
        let groupCards = group.slice(0,group.length)
        if (qidui) { //七对
            this.computQiduiFun(groupCards, putOutCards,hucard,result)
        } else {
            let index = -1;
            for (var i in groupCards){
                if (groupCards[i].length == 2&&groupCards[i][0]==50){
                    index = i;
                    break;
                }
            }
            if (index !=-1){
                let que1 = this.huque(groupCards,putOutCards,que);
                for (var i=1;i<=29;i++){
                    let d = Math.floor(i/10);
                    if (d!=que1&&i%10!=0){
                        groupCards[index] = [i,i]
                    }
                    this.computeNotQiDuiFun(groupCards,putOutCards,hucard,result);
                }
            }else{
                this.computeNotQiDuiFun(groupCards,putOutCards,hucard,result);
            }
        }

    },

    //计算七对的番
    computQiduiFun:function(cards,putOutCards,hucard,result){
        const HongZhong = 50;
        if (hucard != HongZhong) {
            cards[6] = [hucard, hucard];
        } else {
            cards[6] = [cards[6][0], cards[6][0]]
        }

        let fun = 0;//平胡

        //将二维切片转成一维切片
        let hand = [];
        for (var i=0;i<cards.length;i++){
            for (var j=0;j<cards[i].length;j=j+2){
                hand.push(cards[i][j]);
                hand.push(cards[i][j]);
            }
        }
        hand.sort(function(a,b){return a-b;})
        let hongzhongNum = 0
        for (var i = hand.length - 1; i >= 0; i-- ){
            if (hand[i] == HongZhong) {
                hongzhongNum++
            } else {
                break
            }
        }
        let noHongZhong = hand.slice(0,hand.length-hongzhongNum);
        let four = [];
        for (var i =0;i<=noHongZhong.length-4;i++){ //四个连着的
            if (noHongZhong[i] == noHongZhong[i+3]){//第一个和第四个相等
                //nosigle.push(noHongZhong[i]);
                four.push(noHongZhong[i]);
                // result.push([noHongZhong[i],noHongZhong[i]]);
                i+=3;
            }
        }
        for (var i=0;i<four.length;i++){
            removeCards(noHongZhong,four[i],4)
        }

        if (four.length > 0 || hongzhongNum > 0) {
            let gui = four.length  +  Math.floor((hongzhongNum)/2)
            switch (gui){
                case 1:
                    fun += this.mingtangToFun["龙七对"];
                    break;
                case 2:
                    fun += this.mingtangToFun["双龙七对"];
                    break;
                default:
                    fun += this.mingtangToFun["三龙七对"];
                    break;
            }

        } else {
            fun += this.mingtangToFun["小七对"]
        }
        //将对
        // fun +=this.computeJiangDui(cards, putOutCards,true)
        //清一色
        fun +=this.computeQingYiSe(cards,putOutCards)
        // fun +=this.computeWuTingYong(hucard)

        if ((result[hucard] == undefined) || (result[hucard] < fun) ){
            result[hucard] = fun
        }
    },
    //计算非七对的番
    computeNotQiDuiFun:function(cards,putOutCards,hucard,result){
        let fun = 0;  //平湖
        //将对
        // fun += this.computeJiangDui(cards, putOutCards,false)
        //清一色
        fun += this.computeQingYiSe(cards,putOutCards)
        //大对子
        fun += this.computeDaDuiZi(cards)
        //金钩钓
        fun +=this.computeJinGouDiao(cards)
        //无听用 同一处理了
        //fun += this.computeWuTingYong(cards,putOutCards);
        //归
        if (fun == 0){
            fun = 0
        }
        fun += this.computeGui(cards,putOutCards);
        if ((result[hucard] == undefined) || (result[hucard] < fun) ){
            result[hucard] = fun
        }
    },

    //将对
    computeJiangDui:function(cards,putOutCards,isQidui){
        let HongZhong = 50;
        if (isQidui) { //已经是七对了
            for (var i = 0; i < 7; i++ ){
                if (cards[i][0]%10 != 2 && cards[i][0]%10 != 5 && cards[i][0]%10 != 8 && cards[i][0]%10 != HongZhong) {
                    return 0 //不是将对
                }
            }
            return this.mingtangToFun["将对"]
        }
        //摆牌的情况
        for (var i=0;i<putOutCards.length;i++){
            if (putOutCards[i].length == 3) { //碰的或者飞的
                if (putOutCards[i][0]%10 != 2 && putOutCards[i][0]%10 != 5 && putOutCards[i][0]%10 != 8) {
                    return 0
                }
            } else if (putOutCards[i].length== 5) { //杠的
                if (putOutCards[i][1]%10 != 2 && putOutCards[i][1]%10 != 5 && putOutCards[i][1]%10 != 8){
                    return 0
                }
            }
        }
        //手牌的情况--必须是大对子才可能是将对
        for (var i=0;i<cards.length;i++) {
            if (cards[i][0]%10 != 2 && cards[i][0]%10 != 5 && cards[i][0]%10 != 8 && cards[i][0] != HongZhong) {
                return 0
            } else if (cards[i][1]%10 != 2 && cards[i][1]%10 != 5 && cards[i][1]%10 != 8 && cards[i][1] != HongZhong) {
                return 0
            }else if (cards[i].length == 3 && cards[i][2]%10 != 2 && cards[i][2]%10 != 5 && cards[i][2]%10 != 8 && cards[i][2] != HongZhong) {
                return 0
            }
        }
        return this.mingtangToFun["将对"]
    },
    //清一色
    computeQingYiSe:function(cards,putOutCards){
        let colorNum = [0,0,0];
        //摆牌的颜色
        for (var i = 0;i<putOutCards.length;i++) {
            let c = 0
            if (putOutCards[i].length == 3) { //碰的牌
                c = putOutCards[i][0]
            } else {
                c = putOutCards[i][1] //杠的牌
            }
            let index = Math.floor(c / 10)
            if (index > -1 && index < 3) {
                colorNum[index] += 1
            }
        }

        for (var i=0; i<cards.length;i++) {
            for (var j=0;j < cards[i].length;j++) {
                let index = Math.floor(cards[i][j] / 10)
                if (index > -1 && index < 3) {
                    colorNum[index] += 1
                }
            }
        }
        if ((colorNum[0] == 0 && colorNum[1] == 0) || (colorNum[0] == 0 && colorNum[2] == 0)||(colorNum[1] == 0 && colorNum[2] == 0)){
            return this.mingtangToFun["清一色"]
        }
        return 0
    },
    //大对子
    computeDaDuiZi:function(cards){
        for (var i=0;i<cards.length;i++) {
            if (cards[i].length == 3) {
                if ((cards[i][0] != cards[i][1]&&cards[i][1]!=50)||(cards[i][0] != cards[i][2]&&cards[i][2]!=50)) {
                    return 0
                }
            }
        }
        return this.mingtangToFun["大对子"]
    },
    //金钩钓
    computeJinGouDiao:function(cards){
        if (cards.length == 1) {
            return this.mingtangToFun["金钩钓"]
        }
        return 0
    },
    //无听用
    computeWuTingYong:function(cards,putoutCards){
        for (var i=0;i<cards.length;i++){
            if (cards[i] == 50){
                return false
            }
        }
        for (var i=0;i<putoutCards.length;i++){
            for(var j=0;j<putoutCards[i].length;j++){
                if (putoutCards[i][j]==50){
                    return false
                }
            }
        }
        return true
    },
    //归
    computeGui:function(cards,putOutCards){
        let gui = 0;
        let s = []
        const HongZhong = 50;
        //手牌
        for (var i=0;i < cards.length;i++) {
            if (cards[i].length == 2){
                for (var j=0;j<cards[i].length;j++){
                    s.push(cards[i][0]);
                }
            }else{
                if (cards[i][0] == cards[i][1]){
                    for (var j=0;j<cards[i].length;j++){
                        s.push(cards[i][0]);
                    }
                }else if(cards[i][0] == cards[i][1] - 1){
                    for (var j=0;j<cards[i].length;j++){
                        s.push(cards[i][0]+j);
                    }
                }else if(cards[i][0] == cards[i][2] - 2){
                    for (var j=0;j<cards[i].length;j++){
                        s.push(cards[i][0]+j);
                    }
                }else{
                    for (var j=0;j<cards[i].length;j++){
                        s.push(cards[i][0]);
                    }
                }
            }

        }
        //摆牌
        for (var i=0;i<putOutCards.length;i++){
            if (putOutCards[i].length == 3){
                for (var j=0;j<putOutCards[i].length;j++){
                    s.push(putOutCards[i][0])
                }
            }
            if (putOutCards[i].length == 5){
                gui +=1;
            }
        }
        s.sort(function(a,b){return a-b;})
        let remain = [];
        for (var i = 0; i < s.length; i++) {
            if (i+3 < s.length && s[i] == s[i+3]&&s[i]!=HongZhong ){
                gui += 1
                i += 3
                continue
            }

            if (s[i] == HongZhong){
                break
            }
            if (remain.length == 0){
                remain.push(s[i]);
            }else if (remain[remain.length-1] !=s[i]){
                remain.push(s[i]);
            }
        }

        //手牌中的归
        let hongzhongNum = 0
        for (var i = s.length - 1; i >= 0; i--) {
            if (s[i] == HongZhong) {
                hongzhongNum++
            } else {
                break
            }
        }
        //剩下红中可以组成的归的数量
        let three = Math.floor(hongzhongNum / 3)
        if (three > remain.length){
            gui += remain.length+(three-remain.length)*3/4;
        }else{
            gui +=three;
        }

        return gui * this.mingtangToFun["归"]
    },

    //计算牌中红中的个数
    computeHongZhongNum:function(cardsGroup){
        let num = 0;
        cardsGroup.forEach((node)=>{
            if (node == 50){
                num++;
            }
        })
        return num;
    },
    //计算是否有缺牌 -1:代表胡牌定缺,或者是两方麻将
    computeHaveQue:function(cardsGroup,putOutCards,que){
        let have = false;
        if (que !=-1){
            cardsGroup.forEach((node)=>{
                if (Math.floor(node/10) == que){
                    have = true;
                    return have
                }

            })
        }else{
            let n =-1;
            let color = [0,0,0];
            cardsGroup.forEach((node)=>{
                color[Math.floor(node/10)]++
            })
            putOutCards.forEach((node)=>{
                if (node.length == 3){

                    color[Math.floor(node[0]/10)]++
                }else{
                    if (Math.floor(node[1]/10) > n){
                        color[Math.floor(node[1]/10)]++
                    }
                }
            })
            return color[0]>0&&color[1]>0&&color[2]>0;  //如果有三门的话,不能胡牌
        }

        return have;
    },

    //计算七小对所有的组合
    computeAllQiDuiGroup:function(cardsGroup,hongZhongNum){
        let result = [];
        let nosigle = [];
        let srcCards = cardsGroup.slice(0,cardsGroup.length);
        //排序
        srcCards.sort(function(a, b) {return a- b;});
        // //cc.log("computeAllQiDuiGroup排序后的手牌:",srcCards,cardsGroup);
        let noHongZhong = srcCards.slice(0,(srcCards.length-hongZhongNum));
        // //cc.log("computeAllQiDuiGroup取出红中后的手牌:",noHongZhong);
        //  //cc.log("computeAllQiDuiGroup取出红中后的手牌:",noHongZhong,"手牌",srcCards)
        for (var i =0;i<=noHongZhong.length-4;i++){ //四个连着的
            if (noHongZhong[i] == noHongZhong[i+3]){//第一个和第四个相等
                nosigle.push(noHongZhong[i]);
                result.push([noHongZhong[i],noHongZhong[i]]);
                result.push([noHongZhong[i],noHongZhong[i]]);
                i+=3;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            removeCards(noHongZhong,nosigle[i],4);
        }
        // //cc.log("computeAllQiDuiGroup取出4个以后的牌:",noHongZhong);

        //3张
        nosigle = [];
        for (var i =0;i<=noHongZhong.length-3;i++){ //3连着的
            if (noHongZhong[i]== noHongZhong[i+2]){//第1个和第3个相等
                nosigle.push(noHongZhong[i]);
                result.push([noHongZhong[i],noHongZhong[i]]);
                if (hongZhongNum > 0) {
                    result.push([noHongZhong[i], 50]);
                }
                i+=2;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            removeCards(noHongZhong,nosigle[i],3);
        }
        // //cc.log("computeAllQiDuiGroup取出3个以后的牌:",noHongZhong)

        //2张
        nosigle = [];
        for (var i =0;i<=noHongZhong.length-2;i++){ //2连着的
            if (noHongZhong[i] == noHongZhong[i+1]){//第1个和第2个相等
                nosigle.push(noHongZhong[i]);
                result.push([noHongZhong[i],noHongZhong[i]]);
                i+=1;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            removeCards(noHongZhong,nosigle[i],2);
        }
        // //cc.log("computeAllQiDuiGroup取出2个以后的牌:",noHongZhong)

        //1张
        if (hongZhongNum > 0){
            for (var i =0;i<noHongZhong.length;i++){ //
                result.push([noHongZhong[i],50]);
            }
        }
        //还剩下几对红中
        for (var i = 0;i<Math.floor(hongZhongNum/2);i++) {
            result.push([50, 50]);
        }
        // //cc.log("computeAllQiDuiGroup最终结果:",result);
        return result
    },
    //回溯算法函数
    computeQiDuiBack:function(deep,allGroup,hand,row){
        if (hand.length == 1 &&this.back.length == row - 1)
        {
            // //cc.log("七小对成功:");
            this.allGroupCards(allGroup, hand);

            return
        }
        for (var i = deep; i < allGroup.length; i++)

        {
            //在手牌中删除一个组合
            var index = i
            if (!deleteCards(allGroup, hand,index))
            {
                continue
            }
            this.back.push(i)
            this.computeQiDuiBack(index+1,allGroup,hand,row)
            //将牌返回,回溯
            if ( this.back.length > 0)
            {
                for (var j = 0;j<allGroup[this.back[ this.back.length-1]].length;j++)
                {
                    hand.push(allGroup[this.back[this.back.length-1]][j])
                }
                this.back.pop()
            }

        }
    },
    allGroupCards:function (allGroup, hand) {
        var c = hand.slice(0).sort(function(a,b){return a-b;})
        for (var i = 0; i < this.back.length; i++) {
            let c1 = allGroup[this.back[i]].slice(0,this.back[i].length);
            this.changeHongZhongToNormalCard(c1);
            this.result.push(c1);
            if (i == this.back.length - 1) {
                this.result.push(c);
            }
        }
        if (this.back.length == 0) {
            this.result.push(c);
        }
    },
    //替换红中
    changeHongZhongToNormalCard:function(cards){
        if (cards.length == 2) { //两个的
            cards[1] = cards[0]
        } else if (cards.length == 3) { //三个的
            if (cards[0]%10 == 8) {
                if (cards[1]%10 == 9) {
                    cards[2] = cards[0] + 1; //7
                    cards[1] = cards[0];
                    cards[0] -= 1;
                } else { //三个的
                    cards[1] = cards[0]
                    cards[2] = cards[0]
                }
            } else if (cards[0]%10 == 9) {
                cards[1] = cards[0]
                cards[2] = cards[0]
            } else {
                if (cards[1] == cards[0] && cards[0] != 50 ){ //相等
                    cards[2] = cards[0]
                } else if (cards[1] == cards[0]+1 && cards[1] != 50) {
                    cards[2] = cards[0] + 2
                } else if (cards[2] == cards[0]+2 && cards[2] != 50) {
                    cards[1] = cards[0] + 1
                } else if (cards[0] != 50) {
                    cards[1] = cards[0]
                    cards[2] = cards[0]
                }
            }
        }
    },
    //计算非七小对的情况
    computeAllNotQiDuiGroup:function(cardsGroup,hongZhongNum){
        let srcCards = cardsGroup.slice(0,cardsGroup.length);
        //排序
        srcCards.sort(function(a, b) {return a- b;});
        let jiang = this.getJiangDuiGroup(cardsGroup,hongZhongNum);
        // //cc.log("computeAllNotQiDuiGroup将:",jiang)
        let three = this.getThreeGroup(cardsGroup,hongZhongNum);
        // //cc.log("computeAllNotQiDuiGroup3组:",three)

        for (var i=0;i<jiang.length;i++){
            this.back = [];
            let sc = srcCards.slice(0,srcCards.length);
            for (var j=0;j<2;j++){

                removeCards(sc,jiang[i][j],1)
            }
            // //cc.log("computeAllNotQiDuiGroup 对子是:",jiang[i])
            // //cc.log("computeAllNotQiDuiGroup 剩余的牌:",sc)
            this.computeNotQiDuiBack(0,three,sc,Math.floor(sc.length/3)+1,jiang[i])
            // //cc.log("computeAllNotQiDuiGroup 有将对的结果:",this.result,)
            // //cc.log("computeAllNotQiDuiGroup 剩余的牌:",sc)
        }
        this.back = [];
        //没有将
        let src = srcCards.slice(0,srcCards.length);
        this.computeNotQiDuiBack(0,three,src,Math.floor(src.length/3)+1)
        // //cc.log("computeAllNotQiDuiGroup 结果:",this.result)
    },
    //回溯算法函数
    computeNotQiDuiBack:function(deep,allGroup,hand,row,jiang){
        if (hand.length <3&&this.back.length == row - 1)
        {
            // //cc.log("吃的撒飞洒的发生的:", hand.length)
            //单调将
            if (hand.length == 1 )
            {
                //allGroupCards(result, &cards, *back, handcards)
                this.allGroupCards(allGroup, hand);
                // //cc.log("单调将：",codes,this.result)
            }
            else if (hand.length == 2 )
            { //还剩下两张,
                if ((hand[0] == hand[1])||
                    hand[0]-hand[1] == 1||
                    hand[0]-hand[1] == -1||
                    hand[0]-hand[1] == 2&&hand[1]%10 !=9||
                    hand[0]-hand[1] == -2&&hand[0] %10 !=9||
                    (hand[0] == 50 || hand[1] == 50))
                {
                    ////cc.log("胡的牌是:", codes,this.result)
                    //allGroupCards(result, &cards, *back, handcards)
                    this.result.push(jiang)
                    this.allGroupCards(allGroup, hand)
                    ////cc.log("胡的牌是:", codes,this.result)
                }

            }
            return
        }
        for (var i = deep; i < allGroup.length; i++)
        {
            //在手牌中删除一个组合
            var index = i
            if (!deleteCards(allGroup, hand,index))
            {
                continue
            }
            this.back.push(i)
            this.computeNotQiDuiBack(index+1,allGroup,hand,row,jiang)
            //将牌返回,回溯
            if ( this.back.length > 0)
            {
                for (var j = 0;j<allGroup[this.back[ this.back.length-1]].length;j++)
                {
                    hand.push(allGroup[this.back[this.back.length-1]][j])
                }
                this.back.pop()
            }
        }
    },
    //获取3个的组合
    getThreeGroup:function(cardsGroup,hongZhongNum){
        let result = [];
        let cardsInfo = this.getCardDetail(cardsGroup,hongZhongNum);
        let cards = [];//除了红中的其他牌值
        for(var key in cardsInfo){
            if (parseInt(key) !=50){
                cards.push(parseInt(key));
            }
        }
        cards.sort(function(a,b){return a-b;})

        for (var i=0;i<cards.length;i++){
            switch (cardsInfo[cards[i].toString()]){
                case 1:
                    if ((cards[i]+1)%10 != 0 && (cards[i]+2)%10 != 0) { //不能等于10，20，
                        addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,cards[i]+2],1)
                    }
                    if (hongZhongNum > 0){
                        if (hongZhongNum > 1){
                            addToGroupCards(result,cardsInfo,[cards[i],50,50],1)
                        }
                    }
                    if (cards[i]%10 < 8) {
                        addToGroupCards(result,cardsInfo,[cards[i],50,cards[i] + 2],1)
                        addToGroupCards(result,cardsInfo,[cards[i],cards[i] + 1,50],1)
                    } else if (cards[i]%10 == 8) {
                        addToGroupCards(result,cardsInfo,[cards[i],cards[i] + 1,50],1)
                    }
                    break;
                //对子

                case 2:
                    if ((cards[i]+1)%10 != 0 && (cards[i]+2)%10 != 0) { //不能等于10，20，
                        //result.push([cards[i],cards[i]+1,cards[i]+2]);
                        //result.push([cards[i],cards[i]+1,cards[i]+2]);
                        addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,cards[i]+2],2)
                    }

                    if (hongZhongNum > 0){
                        if (cards[i]%10 < 8) {
                            if (hongZhongNum == 1 ){ //一个红中
                                addToGroupCards(result,cardsInfo,[cards[i],50,cards[i]+2],1)
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],1)
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1)

                            } else { //多个红中
                                addToGroupCards(result,cardsInfo,[cards[i],50,cards[i]+2],2)
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],2)
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1)
                                addToGroupCards(result,cardsInfo,[cards[i],50,50],1)
                            }
                        } else if (cards[i]%10 == 8) {
                            if (hongZhongNum == 1) { //一个红中
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],1);
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);

                            } else { //多个红中
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],2);
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);
                                addToGroupCards(result,cardsInfo,[cards[i],50,50],1);

                            }
                        } else { //9
                            addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);

                            if (hongZhongNum > 1) { //多个红中
                                addToGroupCards(result,cardsInfo,[cards[i],50,50],1);
                            }
                        }
                    }
                    break;
                default:
                    //三,四个一样的
                    if (cardsInfo[cards[i].toString()] !=0){
                        result.push([cards[i],cards[i],cards[i]]);
                        if ((cards+1)%10 != 0 && (cards+2)%10 != 0) { //不能等于10，20，
                            addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,cards[i]+2],2);
                        }
                        if (hongZhongNum > 0) {

                            if (cards[i]%10 < 8) {
                                if (hongZhongNum == 1 ){ //一个红中
                                    addToGroupCards(result,cardsInfo,[cards[i],50,cards[i]+2],1);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],1);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);
                                } else { //多个红中
                                    addToGroupCards(result,cardsInfo,[cards[i],50,cards[i]+2],2);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],2);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);
                                    addToGroupCards(result,cardsInfo,[cards[i],50,50],1);
                                }
                            } else if (cards[i]%10 == 8) {
                                if (hongZhongNum == 1) { //一个红中
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],1);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);
                                } else { //多个红中
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i]+1,50],2);
                                    addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);
                                    addToGroupCards(result,cardsInfo,[cards[i],50,50],1);
                                }
                            } else { //9
                                addToGroupCards(result,cardsInfo,[cards[i],cards[i],50],1);


                                if (hongZhongNum > 1) { //多个红中
                                    addToGroupCards(result,cardsInfo,[cards[i],50,50],1);
                                }
                            }
                        }
                    }
                    break;
            }
        }
        //加入红中
        for (var i= 0; i < (Math.floor(hongZhongNum/3)); i++ ){
            addToGroupCards(result,cardsInfo,[50,50,50],1);
        }
        return result;
    },
    //获取2个的组合--将对
    getJiangDuiGroup:function(cardsGroup,hongZhongNum){
        let result = [];
        let cardsInfo = this.getCardDetail(cardsGroup,hongZhongNum);
        let cards = [];//除了红中的其他牌值
        for(var key in cardsInfo){
            if (parseInt(key) !=50){
                cards.push(parseInt(key));
            }
        }
        cards.sort(function(a,b){return a-b;})

        for (var i=0;i<cards.length;i++){
            switch (cardsInfo[cards[i].toString()]){
                case 1:
                    if (hongZhongNum > 0){
                        result.push([cards[i],50])
                    }
                    break;
                //对子

                case 2:
                    result.push([cards[i],cards[i]])
                    result.push([cards[i],50])
                    break;
                case 3:
                    //三个一样的
                    result.push([cards[i],cards[i]])
                    result.push([cards[i],50])
                    break;
                case 4:
                    //四个一样的
                    result.push([cards[i],cards[i]])
                    result.push([cards[i],50])
                    break;

            }
        }
        if (hongZhongNum >=2){
            result.push([50,50])
        }
        return result;
    },

    //获取牌堆的信息
    getCardDetail:function(cardsGroup,hongZhongNum){
        let nosigle = [];
        let result = {};
        let noHongZhong = cardsGroup.slice(0,(cardsGroup.length-hongZhongNum));
        noHongZhong.sort(function(a,b){return a-b});
        //四张
        for (var i =0;i<=noHongZhong.length-4;i++){ //4个连着的
            if (noHongZhong[i] == noHongZhong[i+3]){//第一个和第4个相等
                nosigle.push(noHongZhong[i]);
                i+=3;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            result[nosigle[i]] = 4;
            removeCards(noHongZhong,nosigle[i],4);
        }
        nosigle = [];

        //三张
        for (var i =0;i<=noHongZhong.length-3;i++){ //3个连着的
            if (noHongZhong[i] == noHongZhong[i+2]){//第1个和第3个相等
                nosigle.push(noHongZhong[i]);
                i+=2;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            result[nosigle[i]] = 3;
            removeCards(noHongZhong,nosigle[i],3);
        }
        nosigle = [];

        //两张
        for (var i =0;i<=noHongZhong.length-2;i++){ //2个连着的
            if (noHongZhong[i] == noHongZhong[i+1]){//第1个和第2个相等
                nosigle.push(noHongZhong[i]);
                i+=1;
            }
        }
        for (var i=0;i<nosigle.length;i++){
            result[nosigle[i]] = 2;
            removeCards(noHongZhong,nosigle[i],2);
        }
        nosigle = [];

        //一张
        for (var i =0;i<noHongZhong.length;i++){
            result[noHongZhong[i]] = 1;
        }
        result[50] = hongZhongNum;
        return result
    },
};


//移除牌
function removeCards(cards,targets,num){
    for (var i = 0; i < cards.length; i++) {
        if (cards[i] == targets) {
            cards.splice(i,num)
            return
        }
    }
}

//移除组合中的牌
function deleteCards(collectCards, codes,i) {
    if (!inCards(collectCards[i],codes)){
        return false
    }
    for (var j = 0; j < collectCards[i].length; j++) {
        var index = codes.indexOf(collectCards[i][j]);
        codes.splice(index, 1);
    }
    return true
};
//在手牌中
function inCards(src,dst){
    var cards = dst.slice(0)
    for (var j = 0; j < src.length; j++) {
        var index = cards.indexOf(src[j]);
        if (index == -1) {
            return false
        }
        cards.splice(index, 1);
    }
    return true
}

//组合的次数在手牌中
function groupCardsInHand(cardsNum,cards,targetNum){

    if (cards.length == 0){
        return false
    }

    for (var i=0;i<cards.length;i++){
        // //cc.log(cardsNum[cards[i].toString()],cards[i])
        if ((cardsNum[cards[i].toString()] == undefined)||(cardsNum[cards[i].toString()] < targetNum)){
            return false
        }
    }

    return true
}

//增加到集合中，用于递归的所有数据 handSigleCards-- 去重以后的牌
function addToGroupCards(groupCards,cardsNum,targetCards,targetNum){
    for (var n= targetNum;n>0;n--){
        if (groupCardsInHand(cardsNum,targetCards,n)){
            for (var i=0;i<n;i++){
                groupCards.push(targetCards)
            }
            return
        }
    }
}

module.exports = HuPaiUtils;