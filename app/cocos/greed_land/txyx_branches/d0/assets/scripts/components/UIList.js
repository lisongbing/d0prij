cc.Class({
    extends: cc.Component,
    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        initItemCount: 0,
        scrollView: cc.ScrollView,
        //bufferZone:0,//when item is away from bufferZone, we relocate it
        topPadding: 0,
        spacing: 0,
    },

    /*ctor:function () {
        this.clear();
    },*/

    onLoad: function () {
        this.defaultHeight = this.node.height;
        this.clear();
    },

    clear: function () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.itemList = [];
        this.itemIndex = [];
        this.cb = null;
        this.itemCount = 0;
        this.bufferZone = 0;
        this.itemHeight = 0;
        this.lastContentPosY = 0;
        this.node.destroyAllChildren();
        this.node.height = this.defaultHeight;
        this.scrollView.scrollToTop();
        this.forceUpdate = false;
    },

    setItem: function (count, cb) {
        this.clear();
        this.cb = cb;
        this.itemCount = count;

        let maxCount = this.itemCount < this.initItemCount ? this.itemCount : this.initItemCount;
        let itemNode;
        for (let i = 0; i < maxCount; i++) {
            itemNode = cc.instantiate(this.itemPrefab);
            this.node.addChild(itemNode);
            itemNode.setPosition(0, -itemNode.height * (0.5 + i) - this.spacing * i - this.topPadding);
            this.itemList.push(itemNode);
            this.itemIndex.push(i);
            if (this.cb != null) {
                this.cb(i, itemNode);
            }
            else {
                cc.log('[Warnning]UIList callback is null');
            }
        }
        if (this.itemCount > 0) {
            this.itemHeight = itemNode.height;
            this.node.height = Math.max(this.defaultHeight, this.itemCount * this.itemHeight + (this.itemCount - 1) * this.spacing + 2 * this.topPadding);
            this.bufferZone = this.initItemCount * (this.itemHeight + this.spacing) / 2;
        }
    },

    appendItem: function (count) {
        if (count == this.itemCount) {
            return;
        }
        let isAdd = (count > this.itemCount);
        let oldItemCount = this.itemCount;
        this.itemCount = count;
        if (isAdd && oldItemCount < this.initItemCount) {
            let maxCount = this.itemCount < this.initItemCount ? this.itemCount : this.initItemCount;
            let itemNode;
            for (let i = oldItemCount; i < maxCount; i++) {
                itemNode = cc.instantiate(this.itemPrefab);
                this.node.addChild(itemNode);
                itemNode.setPosition(0, -itemNode.height * (0.5 + i) - this.spacing * i - this.topPadding);
                this.itemList.push(itemNode);
                this.itemIndex.push(i);
                if (this.cb != null) {
                    this.cb(i, itemNode);
                } else {
                    cc.log('[Warnning]UIList callback is null');
                }
            }
            if (oldItemCount == 0 && itemNode != null) {
                this.itemHeight = itemNode.height;
            }
        }
        else if (!isAdd && oldItemCount <= this.initItemCount) {
            let maxCount = this.itemCount;
            for (let i = oldItemCount - 1; i >= maxCount; i--) {
                let itemNode = this.node.children[i];
                this.itemList.pop();
                this.itemIndex.pop();
                this.node.removeChild(itemNode, true);
            }
        }
        this.node.height = Math.max(this.defaultHeight, this.itemCount * this.itemHeight + (this.itemCount - 1) * this.spacing + 2 * this.topPadding);
        this.bufferZone = this.initItemCount * (this.itemHeight + this.spacing) / 2;
    },

    // ??????item???ScrollView??????????????????
    getPositionView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    // ???????????????????????????????????????????????????item??????????????????(??????spawnCount?????????totalCount?????????)
    update(dt) {
        if (this.itemCount <= this.initItemCount/* && this.itemCount > 0*/) {
            return;
        }
        this.updateTimer += dt;
        if(!this.forceUpdate) {
            if (this.updateTimer < this.updateInterval) {
                return; // we don't need to do the math every frame
            }
        }
        else {
            this.forceUpdate = false;
        }
        this.updateTimer = 0;
        let items = this.itemList;
        // ????????????content???y?????????????????????????????????????????????????????????????????????
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // ?????????????????????????????????????????????????????????
        let offset = (this.itemHeight + this.spacing) * items.length;
        //let offset = this.itemHeight * items.length + (items.length - 1) * this.spacing + this.topPadding;
        //let offset = this.itemHeight * items.length + (items.length - 1) * this.spacing
        let newY = 0;
        // ?????????????????????item??????????????????
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionView(items[i]);
            if (isDown) {
                // ??????????????????item?????????y??????
                newY = items[i].y + offset;
                // ?????????????????????item??????????????????????????????newY?????????content????????????
                // ?????????item??????????????????????????????offset???????????????????????????item???????????????
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    let newIndex = this.itemIndex[i] - items.length; // update item id
                    if (newIndex >= 0) {
                        items[i].y = newY;
                        this.itemIndex[i] = newIndex;
                        if (this.cb != null) {
                            this.cb(newIndex, items[i]);
                        }
                    }

                }
            } else {
                // ??????????????????item?????????y??????
                newY = items[i].y - offset;
                // ?????????????????????item??????????????????????????????newY?????????content????????????
                // ?????????item??????????????????????????????offset???????????????????????????item???????????????
                if (viewPos.y > this.bufferZone && newY > -this.node.height) {
                    let newIndex = this.itemIndex[i] + items.length;
                    if (newIndex < this.itemCount) {
                        items[i].y = newY
                        this.itemIndex[i] = newIndex;
                        if (this.cb != null) {
                            this.cb(newIndex, items[i]);
                        }
                    }
                }
            }
        }

        // ??????lastContentPosY??????????????????
        this.lastContentPosY = this.scrollView.content.y;
    },
});
