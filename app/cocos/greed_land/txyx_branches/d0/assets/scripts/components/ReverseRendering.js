cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        inspector: 'packages://inspectors/ReverseRendering.js',
        executeInEditMode: true
    },

    properties: {
        reverseRendering: {
            default: false,
            tooltip: CC_DEV && '子节点倒序渲染',
            notify: function () {
                this.node._sgNode.setReverseVisit(this.reverseRendering);
            }
        }
    },
    
    onEnable: function () {
        this.node._sgNode.setReverseVisit(this.reverseRendering);
    },
});
