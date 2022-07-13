const PengCanChangeRule =  28;
const YaoTongWeiWangRule =  49;

const anGang = 1;
const mingGang = 2;
const dianGang = 3;

const HongZHong1 = 1;
const HongZHong2 = 11;
var PengGangTi ={
    rules: {},
    computeRule (rules){
        let r = {pcc:false,guiValues:[1]}
        rules.forEach(rs =>{
            if (rs == PengCanChangeRule)
            {
                r.pcc = true;
            }
            else if (rs == YaoTongWeiWangRule)
            {
                r.guiValues.push(11);
            }
        })
        return r;
    },

    //init 必须初始化调用
    init(rules){
        this.rules = this.computeRule(rules);
    },

    //碰的情况
    computePeng(pengCard,handCards,rules){
       let result = [];  //是一个二维数组
       this.init(rules);
       let handNum = this.computeHandStatus(handCards,this.rules.guiValues);
    
       //three two one
        if (this.inArray(handNum.three,pengCard) || this.inArray(handNum.two,pengCard)){
            let guiNum = 0;
            for (let i = 0;i < this.rules.guiValues.length;i++){
                guiNum += handNum.gui["" + this.rules.guiValues[i]]
            }
           
            if (guiNum + 2 != handCards.length){
                result.push([pengCard,pengCard,pengCard]);                
            }else{
                for (let i = 0;i < this.rules.guiValues.length;i++){
                    if (this.inArray(handCards,this.rules.guiValues[i])){
                        result.push([pengCard,pengCard,this.rules.guiValues[i]]);
                    }
                }
            }
        }else if (this.inArray(handNum.one,pengCard)){
            for (let i = 0;i < this.rules.guiValues.length;i++){
                if (this.inArray(handCards,this.rules.guiValues[i])){
                    result.push([pengCard,pengCard,this.rules.guiValues[i]]);
                }
            }
        }else{
            console.error("panic computePeng");
        }
        return result;
    },

    inArray(array,value){
        for (let i = 0;i<array.length;i++){
            if (value == array[i]){
                return true;
            }
        }
        return false;
    },

    computeTi(putOutCards,handCards,rules){
        this.init(rules);
        let  result = new Array(2);
        for(var index = 0;index < 2;index++){
            result[index] = [];
        }
        for (let i = 0;i < putOutCards.length;i++){
            let putOutCard = putOutCards[i];
            let len = putOutCard.length;
            if (len == 3){  //碰的牌
                if (this.inArray(handCards,putOutCard[0])){
                    for (let j = 1;j < len;j++){
                        if (this.inArray(this.rules.guiValues,putOutCard[j])){
                            if (putOutCard[j] == HongZHong1){
                                if (!this.inArray(result[0],putOutCard[0])){
                                    result[0].push(putOutCard[0]);
                                }
                            }else if (putOutCard[j] == HongZHong2) {
                                if (!this.inArray(result[1], putOutCard[0])) {
                                    result[1].push(putOutCard[0]);
                                }
                            }
                        }
                    }
                }
            }else if (len == 5){
                if (this.inArray(handCards,putOutCard[1])){
                    for (let j = 2;j < len;j++){
                        if (this.inArray(this.rules.guiValues,putOutCard[j])){
                            if (putOutCard[j] == HongZHong1){
                                if (!this.inArray(result[0],putOutCard[1])){
                                    result[0].push(putOutCard[1]);
                                }
                            }else if (putOutCard[j] == HongZHong2) {
                                if (!this.inArray(result[1], putOutCard[1])) {
                                    result[1].push(putOutCard[1]);
                                }
                            }
                        }
                    }
                }
            }else{
                console.error("lenth err:",len)
            }
        }

        return result;
    },


    //gangCard 点杠一定要传 其他杠可以不传
    computeGang(putOutCards,handCards,gangCard,rules,que){
        let result = [];
        this.init(rules);
        let handNum = this.computeHandStatus(handCards,this.rules.guiValues);
    
        if (gangCard&&handCards.length%3==1){   //点杠
            this.dianGang(handNum, gangCard, result, handCards);
        }else{ //明杠  暗杠
            this.mingAndAnGangs(putOutCards, handCards, result, handNum,que);
        }
        return result
    },

    mingAndAnGangs(putOutCards, handCards, result, handNum,que) {
        let pengs = [];
        let pengIndexes = [];
        putOutCards.forEach((e, index) => {
            if (e.length == 3) {
                pengs.push(e[0]);
                pengIndexes.push(index);
            }
        })
        this.mingGangs(pengs, handCards, putOutCards, pengIndexes, result);
        this.anGangs(handNum, result, pengs,que);
    },

    anGangs(handNum, result, pengs,que) {
        this.anGangFour(handNum, result,que);
        this.anGangThree(handNum, result,que);
        this.anGangTwo(handNum, pengs, result,que);
        this.anGangOne(handNum, pengs, result,que);
    },

    anGangFour(handNum, result,que) {
        //暗杠
        for (let i = 0; i < handNum.four.length; i++) {    //四个的
            if (!this.inArray(this.rules.guiValues, handNum.four[i]) && que != Math.floor(handNum.four[i] / 10)) {
                result.push([anGang, handNum.four[i], handNum.four[i], handNum.four[i], handNum.four[i]]);
            }
        }
    },

    anGangThree(handNum, result,que) {
        for (let i = 0; i < handNum.three.length; i++) {    //三个的
            if (!this.inArray(this.rules.guiValues, handNum.three[i]) && que != Math.floor(handNum.three[i] / 10)) {
                for (let j = 0; j < this.rules.guiValues.length; j++) {
                    if (handNum.gui["" + this.rules.guiValues[j]]) {
                        result.push([anGang, handNum.three[i], handNum.three[i], handNum.three[i], this.rules.guiValues[j]]);
                    }
                }
            }
        }
    },

    anGangTwo(handNum, pengs, result,que) {
        for (let i = 0; i < handNum.two.length; i++) {    //两个的
            if (!this.inArray(this.rules.guiValues, handNum.two[i]) && !this.inArray(pengs, handNum.two[i]) && que != Math.floor(handNum.two[i] / 10)) {
                switch (this.rules.guiValues.length) {
                    case 1:
                        let guiNum = handNum.gui["" + this.rules.guiValues[0]]
                        if (guiNum > 1) {
                            result.push([anGang, handNum.two[i], handNum.two[i], this.rules.guiValues[0], this.rules.guiValues[0]]);
                        }
                        break;

                    case 2:
                        let gui_1 = handNum.gui["" + this.rules.guiValues[0]];
                        let gui_2 = handNum.gui["" + this.rules.guiValues[1]];

                        if (gui_1 >= 1 && gui_2 > 0) {
                            result.push([anGang, handNum.two[i], handNum.two[i], this.rules.guiValues[0], this.rules.guiValues[1]]);
                        }
                        if (gui_1 > 1) {
                            result.push([anGang, handNum.two[i], handNum.two[i], this.rules.guiValues[0], this.rules.guiValues[0]]);
                        }
                        if (gui_2 > 1) {
                            result.push([anGang, handNum.two[i], handNum.two[i], this.rules.guiValues[1], this.rules.guiValues[1]]);
                        }
                        break;
                }
            }
        }
    },

    anGangOne(handNum, pengs, result,que) {
        for (let i = 0; i < handNum.one.length; i++) {    //一个的
            if (!this.inArray(this.rules.guiValues, handNum.one[i]) && !this.inArray(pengs, handNum.one[i])&& que != Math.floor(handNum.one[i] / 10)) {
                switch (this.rules.guiValues.length) {
                    case 1:
                        let guiNum = handNum.gui["" + this.rules.guiValues[0]]
                        if (guiNum > 2) {
                            result.push([anGang, handNum.one[i], this.rules.guiValues[0], this.rules.guiValues[0], this.rules.guiValues[0]]);
                        }
                        break;

                    case 2:
                        let gui_1 = handNum.gui["" + this.rules.guiValues[0]];
                        let gui_2 = handNum.gui["" + this.rules.guiValues[1]];

                        if (gui_1 > 0 && gui_2 > 1) {
                            result.push([anGang, handNum.one[i], this.rules.guiValues[0], this.rules.guiValues[1], this.rules.guiValues[1]]);
                        }
                        if (gui_1 > 1 && gui_2 > 0) {
                            result.push([anGang, handNum.one[i], this.rules.guiValues[0], this.rules.guiValues[0], this.rules.guiValues[1]]);
                        }
                        if (gui_1 > 2) {
                            result.push([anGang, handNum.one[i], this.rules.guiValues[0], this.rules.guiValues[0], this.rules.guiValues[0]]);
                        }
                        if (gui_2 > 2) {
                            result.push([anGang, handNum.one[i], this.rules.guiValues[1], this.rules.guiValues[1], this.rules.guiValues[1]]);
                        }
                        break;
                }
            }
        }
    },

    mingGangs(pengs, handCards, putOutCards, pengIndexes, result) {
        //明杠的情况
        for (let i = 0; i < pengs.length; i++) {
            let p = putOutCards[pengIndexes[i]];
            if (this.inArray(handCards, pengs[i])) {  //实体杠
               
                result.push([mingGang, p[0], p[1], p[2], pengs[i]]);
            } else {
                for (let i = 0; i < this.rules.guiValues.length; i++) {
                    if (this.inArray(handCards, this.rules.guiValues[i])) {
                        result.push([mingGang, p[0], p[1], p[2], this.rules.guiValues[i]]);
                    }
                }
            }
        }
    },

    dianGang(handNum, gangCard, result, handCards) {
        //three
        for (let i = 0; i < handNum.three.length; i++) {
            if (handNum.three[i] == gangCard) {
                result.push([dianGang, gangCard, gangCard, gangCard, gangCard]);
            }
        }
        //two
        for (let i = 0; i < handNum.two.length; i++) {
            if (handNum.two[i] == gangCard) {
                for (let j = 0; j < this.rules.guiValues.length; j++) {
                    if (this.inArray(handCards, this.rules.guiValues[j])) {
                        result.push([dianGang, gangCard, gangCard, gangCard, this.rules.guiValues[j]]);
                    }
                }
            }
        }

        //one
        for (let i = 0; i < handNum.one.length; i++) {
            if (handNum.one[i] == gangCard) {
                switch (this.rules.guiValues.length) {
                    case 1:
                        result.push([dianGang, gangCard, gangCard, this.rules.guiValues[0], this.rules.guiValues[0]]);
                        break;
                    case 2:
                        let gui_1 = handNum.gui["" + this.rules.guiValues[0]];
                        let gui_2 = handNum.gui["" + this.rules.guiValues[1]];
                        if (gui_1) {
                            if (gui_1 == 1) {
                                result.push([dianGang, gangCard, gangCard, this.rules.guiValues[0], this.rules.guiValues[1]]);
                            } else {
                                result.push([dianGang, gangCard, gangCard, this.rules.guiValues[0], this.rules.guiValues[0]]);
                                if (gui_2) {
                                    result.push([dianGang, gangCard, gangCard, this.rules.guiValues[0], this.rules.guiValues[1]]);
                                    if (gui_2 > 1) {
                                        result.push([dianGang, gangCard, gangCard, this.rules.guiValues[1], this.rules.guiValues[1]]);
                                    }
                                }
                            }
                        } else {
                            result.push([dianGang, gangCard, gangCard, this.rules.guiValues[1], this.rules.guiValues[1]]);
                        }
                        break;
                }
            }
        }
    },

//统计单牌，对子，三同，四同
    computeHandStatus(handCards,guiValues) {
        handCards.sort( (a,b) =>{return a - b})
        let handNum = {one:[], two:[], three:[], four:[],gui:{}};
        guiValues.forEach(e =>{
            handNum.gui["" + e] = 0;
        })
        let len = handCards.length;
        for (let i = 0; i < len; i++) {
            if (i + 3 < len && handCards[i] == handCards[i+3]){
                handNum.four.push(handCards[i]);
                i += 3;
            }else if(i + 2 < len && handCards[i] == handCards[i+2]){
                handNum.three.push(handCards[i]);
                i += 2;
            }else if(i + 1 < len && handCards[i] == handCards[i+1]){
                handNum.two.push(handCards[i]);
                i += 1;
            }else{
                handNum.one.push(handCards[i]);
            }
        }

        for (let i = 0;i < handNum.one.length;i++){
            if (this.inGuiValues(guiValues,handNum.one[i])){
                handNum.gui["" + handNum.one[i]] = 1;
            }
        }

        for (let i = 0;i < handNum.two.length;i++){
            if (this.inGuiValues(guiValues,handNum.two[i])){
                handNum.gui["" + handNum.two[i]] = 2;
            }
        }

        for (let i = 0;i < handNum.three.length;i++){
            if (this.inGuiValues(guiValues,handNum.three[i])){
                handNum.gui["" + handNum.three[i]] = 3;
            }
        }

        for (let i = 0;i < handNum.four.length;i++){
            if (this.inGuiValues(guiValues,handNum.four[i])){
                handNum.gui["" + handNum.four[i]] = 4;
            }
        }
        return handNum;
    },

    inGuiValues(guiValues,card){
        for (let i = 0;i < guiValues.length;i++){
            if (card == guiValues[i]){
                return true;
            }
        }
        return false;
    }
}

module.exports = PengGangTi;