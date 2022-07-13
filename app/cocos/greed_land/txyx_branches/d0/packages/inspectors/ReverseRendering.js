"use strict";
Vue.component("cc-reverserendering", {
    template: '\n    <ui-prop\n      v-prop="target.reverseRendering"\n      :multi-values="multi"\n    ></ui-prop>\n  ',
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        multi: {
            type: Boolean
        }
    },
    methods: {
        T: Editor.T,
    }
});
