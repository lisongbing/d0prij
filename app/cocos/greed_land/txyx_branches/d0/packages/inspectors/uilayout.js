"use strict";Vue.component("cc-uilayout", {
    template: '\n    <ui-prop\n      v-prop="target.type"\n      :multi-values="multi"\n    ></ui-prop>\n    <div>\n      <ui-prop\n        v-prop="target.startAxis"\n        :multi-values="multi"\n        v-show="_isGridLayout()"\n      ></ui-prop>\n      <ui-prop name="Padding"\n        v-show="_isPaddingEnabled()"\n      >\n        <div class="child layout vertical">\n          <ui-prop name="Left" type="number" indent=1\n            v-value="target.paddingLeft.value"\n            v-values="target.paddingLeft.values"\n            :multi-values="multi"\n            v-show="_isPaddingHorizontalEnabled()"\n          ></ui-prop>\n          <ui-prop name="Right" type="number" indent=1\n            v-value="target.paddingRight.value"\n            v-values="target.paddingRight.values"\n            :multi-values="multi"\n            v-show="_isPaddingHorizontalEnabled()"\n          ></ui-prop>\n          <ui-prop name="Top" type="number" indent=1\n            v-value="target.paddingTop.value"\n            v-values="target.paddingTop.values"\n            :multi-values="multi"\n            v-show="_isPaddingVerticalEnabled()"\n          ></ui-prop>\n          <ui-prop name="Bottom" type="number" indent=1\n            v-value="target.paddingBottom.value"\n            v-values="target.paddingBottom.values"\n            :multi-values="multi"\n            v-show="_isPaddingVerticalEnabled()"\n          ></ui-prop>\n        </div>\n      </div>\n      <ui-prop\n        v-prop="target.spacingX"\n        v-show="_isAllowHorizontalLayout()"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop\n        v-prop="target.spacingY"\n        v-show="_isAllowVerticalLayout()"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop\n        v-prop="target.verticalDirection"\n        v-show="_isAllowVerticalLayout()"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop\n        v-prop="target.horizontalDirection"\n        v-show="_isAllowHorizontalLayout()"\n        :multi-values="multi"\n      ></ui-prop>\n    </div>\n  ',props: {
        target: {
            twoWay:!0,type:Object
        }

        ,multi: {
            type:Boolean
        }
    }

    ,methods: {
        T:Editor.T,_checkValues:(t,e,i)=>t.every(t=>i?t==e:t!=e),_isPaddingEnabled() {
            var t=this.target.type,e=this.target;
            return this.multi?!(!this._checkValues(t.values,0,!0)||!this._checkValues(e.values,1,!0))||(this._checkValues(t.values,0,!1),!1): 0===this.target.type.value&&1===this.target.resizeMode.value||0!==this.target.type.value
        }

        ,_isPaddingHorizontalEnabled() {
            return this.multi?this._checkValues(this.target.type.values,2,!1): 2!==this.target.type.value
        }

        ,_isPaddingVerticalEnabled() {
            return this.multi?this._checkValues(this.target.type.values,1,!1): 1!==this.target.type.value
        }

        ,_isAllowHorizontalLayout() {
            var t=this.target.type;return this.multi?this._checkValues(t.values,1,!0)||this._checkValues(t.values,3,!0): 1===t.value||3===t.value
        }

        ,_isAllowVerticalLayout() {
            var t=this.target.type;return this.multi?this._checkValues(t.values,2,!0)||this._checkValues(t.values,3,!0): 2===this.target.type.value||3===this.target.type.value
        }

        ,_isGridLayout() {
            return this.multi?this._checkValues(this.target.type.values,3,!0): 3===this.target.type.value
        }
    }
}

);