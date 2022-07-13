/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


/**
 * !#en Enum for Layout type
 * !#zh 布局类型
 * @enum Layout.Type
 */
var Type = cc.Enum({
    /**
     * !#en None Layout
     * !#zh 取消布局
     *@property {Number} NONE
     */
    NONE: 0,
    /**
     * !#en Horizontal Layout
     * !#zh 水平布局
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 1,

    /**
     * !#en Vertical Layout
     * !#zh 垂直布局
     * @property {Number} VERTICAL
     */
    VERTICAL: 2,
    /**
     * !#en Grid Layout
     * !#zh 网格布局
     * @property {Number} GRID
     */
    GRID: 3,
});

/**
 * !#en Enum for Grid Layout start axis direction.
 * The items in grid layout will be arranged in each axis at first.;
 * !#zh 布局轴向，只用于 GRID 布局。
 * @enum Layout.AxisDirection
 */
var AxisDirection = cc.Enum({
    /**
     * !#en The horizontal axis.
     * !#zh 进行水平方向布局
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,
    /**
     * !#en The vertical axis.
     * !#zh 进行垂直方向布局
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
});

/**
 * !#en Enum for vertical layout direction.
 *  Used in Grid Layout together with AxisDirection is VERTICAL
 * !#zh 垂直方向布局方式
 * @enum Layout.VerticalDirection
 */
var VerticalDirection = cc.Enum({
    /**
     * !#en Items arranged from bottom to top.
     * !#zh 从下到上排列
     * @property {Number} BOTTOM_TO_TOP
     */
    BOTTOM_TO_TOP: 0,
    /**
     * !#en Items arranged from top to bottom.
     * !#zh 从上到下排列
     * @property {Number} TOP_TO_BOTTOM
     */
    TOP_TO_BOTTOM: 1,
});

/**
 * !#en Enum for horizontal layout direction.
 *  Used in Grid Layout together with AxisDirection is HORIZONTAL
 * !#zh 水平方向布局方式
 * @enum Layout.HorizontalDirection
 */
var HorizontalDirection = cc.Enum({
    /**
     * !#en Items arranged from left to right.
     * !#zh 从左往右排列
     * @property {Number} LEFT_TO_RIGHT
     */
    LEFT_TO_RIGHT: 0,
    /**
     * !#en Items arranged from right to left.
     * !#zh 从右往左排列
     *@property {Number} RIGHT_TO_LEFT
     */
    RIGHT_TO_LEFT: 1,
});

/**
 * !#en
 * The Layout is a container component, use it to arrange child elements easily.<br>
 * Note：<br>
 * 1.Scaling and rotation of child nodes are not considered.<br>
 * 2.After setting the Layout, the results need to be updated until the next frame,
 * unless you manually call {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * !#zh
 * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * 注意：<br>
 * 1.不会考虑子节点的缩放和旋转。<br>
 * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用 {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * @class Layout
 * @extends Component
 */
var UILayout = cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        inspector: 'packages://inspectors/uilayout.js',
        executeInEditMode: true,
    },

    properties: {
        _layoutSize: cc.size(300, 200),

        //TODO: refactoring this name after data upgrade machanism is out.
        _N$layoutType: Type.NONE,
        /**
         * !#en The layout type.
         * !#zh 布局类型
         * @property {Layout.Type} type
         * @default Layout.Type.NONE
         */
        type: {
            type: Type,
            get: function () {
                return this._N$layoutType;
            },
            set: function (value) {
                this._N$layoutType = value;
            },
        },

        /**
         * !#en
         * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
         * and then break line on demand. Choose vertical if you want to layout vertically at first .
         * !#zh 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
         * @property {Layout.AxisDirection} startAxis
         */
        startAxis: {
            default: AxisDirection.HORIZONTAL,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.start_axis',
            type: AxisDirection,
        },

        _N$padding: {
            default: 0
        },
        /**
         * !#en The left padding of layout, it only effect the layout in one direction.
         * !#zh 容器内左边距，只会在一个布局方向上生效。
         * @property {Number} paddingLeft
         */
        paddingLeft: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_left',
        },

        /**
         * !#en The right padding of layout, it only effect the layout in one direction.
         * !#zh 容器内右边距，只会在一个布局方向上生效。
         * @property {Number} paddingRight
         */
        paddingRight: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_right',
        },

        /**
         * !#en The top padding of layout, it only effect the layout in one direction.
         * !#zh 容器内上边距，只会在一个布局方向上生效。
         * @property {Number} paddingTop
         */
        paddingTop: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_top',
        },

        /**
         * !#en The bottom padding of layout, it only effect the layout in one direction.
         * !#zh 容器内下边距，只会在一个布局方向上生效。
         * @property {Number} paddingBottom
         */
        paddingBottom: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_bottom',
        },

        /**
         * !#en The distance in x-axis between each element in layout.
         * !#zh 子节点之间的水平间距。
         * @property {Number} spacingX
         */
        spacingX: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_x'
        },

        /**
         * !#en The distance in y-axis between each element in layout.
         * !#zh 子节点之间的垂直间距。
         * @property {Number} spacingY
         */
        spacingY: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_y'
        },

        /**
         * !#en
         * Only take effect in Vertical layout mode.
         * This option changes the start element's positioning.
         * !#zh 垂直排列子节点的方向。
         * @property {Layout.VerticalDirection} verticalDirection
         */
        verticalDirection: {
            default: VerticalDirection.TOP_TO_BOTTOM,
            type: VerticalDirection,
        },

        /**
         * !#en
         * Only take effect in Horizontal layout mode.
         * This option changes the start element's positioning.
         * !#zh 水平排列子节点的方向。
         * @property {Layout.HorizontalDirection} horizontalDirection
         */
        horizontalDirection: {
            default: HorizontalDirection.LEFT_TO_RIGHT,
            type: HorizontalDirection,
        }
    },

    statics: {
        Type: Type,
        VerticalDirection: VerticalDirection,
        HorizontalDirection: HorizontalDirection,
        AxisDirection: AxisDirection,
    },

    _migratePaddingData: function () {
        this.paddingLeft = this._N$padding;
        this.paddingRight = this._N$padding;
        this.paddingTop = this._N$padding;
        this.paddingBottom = this._N$padding;
        this._N$padding = 0;
    },

    onEnable: function () {
        if (cc.sizeEqualToSize(this.node.getContentSize(), cc.size(0, 0))) {
            this.node.setContentSize(this._layoutSize);
        }

        if (this._N$padding !== 0) {
            this._migratePaddingData();
        }
    },

    onDisable: function () {

    },

    getNextNodePosition: function (nextChild) {
        if (this.type === Type.HORIZONTAL) {
            var newWidth = this.node.getContentSize().width;
            var fnPositionY = function (child) {
                return child.y;
            };
            var fnRow = function (child) {
                return 1;
            }
            return this._getHorizontallyNextNodePosition(newWidth, false, fnPositionY, fnRow, nextChild);
        }
        else if (this.type === Type.VERTICAL) {
            var newHeight = this.node.getContentSize().height
            var fnPositionX = function (child) {
                return child.x;
            };
            var fnColumn = function (child) {
                return 1;
            }
            return this._getVerticallyNextNodePosition(newHeight, false, fnPositionX, fnColumn, nextChild);
        }
        else if (this.type === Type.NONE) {
        }
        else if (this.type === Type.GRID) {
            return this._getGridNextNodePosition(nextChild);
        }
    },

    _getGridNextNodePositionAxisHorizontal: function (layoutAnchor, layoutSize, nextChild) {
        var baseWidth = layoutSize.width;
        var sign = 1;
        var bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
        var paddingY = this.paddingBottom;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
            paddingY = this.paddingTop;
        }

        var fnPositionY = function (child, row) {
            //return bottomBoundaryOfLayout + sign * ((row - 1) * child.height + child.anchorY * child.height + paddingY + row * this.spacingY);
            return bottomBoundaryOfLayout + sign * (row * (child.height + this.spacingY) + child.anchorY * child.height + paddingY - child.height);
        }.bind(this);

        var fnRow = function (child) {
            return Math.round(((child.position.y - bottomBoundaryOfLayout) * sign - child.anchorY * child.height - paddingY + child.height) / (child.height + this.spacingY));
            //return Math.round(((child.position.y - bottomBoundaryOfLayout)*sign - topOffset - child.anchorY * child.height - paddingY)/this.spacingY);
        }.bind(this);
        return this._getHorizontallyNextNodePosition(baseWidth, true, fnPositionY, fnRow, nextChild);

    },

    _getGridNextNodePositionAxisVertical: function (layoutAnchor, layoutSize, nextChild) {
        var baseHeight = layoutSize.height;

        var sign = 1;
        var leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
        var paddingX = this.paddingLeft;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
            paddingX = this.paddingRight;
        }

        var fnPositionX = function (child, column) {
            return leftBoundaryOfLayout + sign * (column * (child.width + this.spacingX) + child.anchorX * child.width + paddingX - child.width);
            //return leftBoundaryOfLayout + sign * (leftOffset + child.anchorX * child.width + paddingX + column * this.spacingX);
        }.bind(this);

        var fnColumn = function (child) {
            return Math.round(((child.position.x - leftBoundaryOfLayout) * sign - child.anchorX * child.width - paddingX + child.width) / (child.width + this.spacingX));
            //return Math.round(((child.position.x - leftBoundaryOfLayout)*sign - leftOffset - child.anchorX * child.width - paddingX)/this.spacingX);
        }.bind(this);

        return this._getVerticallyNextNodePosition(baseHeight, true, fnPositionX, fnColumn, nextChild);
    },

    _getGridNextNodePosition: function (nextChild) {
        var layoutAnchor = this.node.getAnchorPoint();
        var layoutSize = this.node.getContentSize();

        if (this.startAxis === AxisDirection.HORIZONTAL) {
            return this._getGridNextNodePositionAxisHorizontal(layoutAnchor, layoutSize, nextChild);

        }
        else if (this.startAxis === AxisDirection.VERTICAL) {
            return this._getGridNextNodePositionAxisVertical(layoutAnchor, layoutSize, nextChild);
        }
    },

    _getHorizontallyNextNodePosition: function (baseWidth, rowBreak, fnPositionY, fnRow, nextChild) {
        var lastChild = null;//this.node.children[this.node.children.length - 1];
        if (this.node.childrenCount > 0) {
            lastChild = this.node.children[this.node.children.length - 1];
        }
        var layoutAnchor = this.node.getAnchorPoint();
        var sign = 1;
        var paddingX = this.paddingLeft;
        var leftBoundaryOfLayout = -layoutAnchor.x * baseWidth;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * baseWidth;
            paddingX = this.paddingRight;
        }
        var anchorX = nextChild.anchorX;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            anchorX = 1 - nextChild.anchorX;
        }
        var rightBoundaryOfChild = sign * (1 - anchorX) * nextChild.width;
        var nextX = 0;
        var row = 1;
        if (lastChild == null) {
            nextX = leftBoundaryOfLayout + sign * paddingX - sign * this.spacingX;
            nextX = nextX + sign * anchorX * nextChild.width + sign * this.spacingX;
        }
        else {
            nextX = rightBoundaryOfChild + lastChild.position.x + sign * anchorX * nextChild.width + sign * this.spacingX;
            row = fnRow(lastChild);
        }

        if (rowBreak) {
            var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this.paddingRight : this.paddingLeft);
            var leftToRightRowBreak = this.horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth;
            var rightToLeftRowBreak = this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth;
            if (leftToRightRowBreak || rightToLeftRowBreak) {
                nextX = leftBoundaryOfLayout + sign * (paddingX + anchorX * nextChild.width);
                row++;
            }
        }
        var finalPositionY = fnPositionY(nextChild, row);
        return cc.Vec2(nextX, finalPositionY);
    },


    _getVerticallyNextNodePosition: function (baseHeight, columnBreak, fnPositionX, fnColumn, nextChild) {
        var lastChild = null;//this.node.children[this.node.children.length - 1];
        if (this.node.childrenCount > 0) {
            lastChild = this.node.children[this.node.children.length - 1];
        }
        var layoutAnchor = this.node.getAnchorPoint();
        var sign = 1;
        var paddingY = this.paddingBottom;
        var bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
            paddingY = this.paddingTop;
        }
        var anchorY = nextChild.anchorY;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            anchorY = 1 - nextChild.anchorY;
        }
        var topBoundaryOfChild = sign * (1 - anchorY) * nextChild.height;
        var nextY = 0;
        var column = 1;
        if (lastChild == null) {
            nextY = bottomBoundaryOfLayout + sign * paddingY - sign * this.spacingY;
            nextY = nextY + sign * anchorY * nextChild.height + sign * this.spacingY;
        }
        else {
            nextY = topBoundaryOfChild + lastChild.position.y + sign * anchorY * nextChild.height + sign * this.spacingY;
            column = fnColumn(lastChild);
        }
        if (columnBreak) {
            var columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this.paddingTop : this.paddingBottom);
            var bottomToTopColumnBreak = this.verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight;
            var topToBottomColumnBreak = this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight;

            if (bottomToTopColumnBreak || topToBottomColumnBreak) {
                nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * nextChild.height);
                column++;
            }
        }

        var finalPositionX = fnPositionX(nextChild, column);
        return cc.Vec2(finalPositionX, nextY);
    }

});

/**
 * !#en The padding of layout, it effects the layout in four direction.
 * !#zh 容器内边距，该属性会在四个布局方向上生效。
 * @property {Number} padding
 */
Object.defineProperty(UILayout.prototype, "padding", {
    get: function () {
        cc.warnID(4100);
        return this.paddingLeft;
    },
    set: function (value) {
        this._N$padding = value;

        this._migratePaddingData();
    }
});
