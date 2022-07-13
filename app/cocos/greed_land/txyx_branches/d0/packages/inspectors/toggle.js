"use strict";
Vue.component("cc-toggle", {
    template: '\n    <ui-prop\n      v-prop="target.target"\n      :multi-values="multi"\n      tooltip="{{T(\'COMPONENT.toggle.target\')}}"\n    ></ui-prop>\n    <div class="horizontal layout end-justified" style="padding:5px 0;margin-bottom:5px;">\n        <ui-button class="blue tiny"\n          v-disabled="multi"\n          @confirm="resetNodeSize"\n          :multi-values="multi"\n        >\n          Resize to Target\n        </ui-button>\n    </div>\n    <ui-prop\n      v-prop="target.interactable"\n      :multi-values="multi"\n      tooltip="{{T(\'COMPONENT.toggle.interactable\')}}"\n    ></ui-prop>\n\n\n    <ui-prop\n      v-prop="target.enableAutoGrayEffect"\n      tooltip="{{T(\'COMPONENT.toggle.auto_gray_effect\')}}"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.transition"\n      tooltip="{{T(\'COMPONENT.toggle.transition\')}}"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <div\n      v-if="!_updateValueMulti(target.transition, 1, multi)"\n    >\n      <ui-prop indent=1\n        v-prop="target.normalColor"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.normal_color\')}}"></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.pressedColor"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.pressed_color\')}}"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.hoverColor"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.hover_color\')}}"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.disabledColor"\n        tooltip="{{T(\'COMPONENT.toggle.disabled_color\')}}"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.duration"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.duration\')}}"\n      ></ui-prop>\n    </div>\n\n    <div\n      v-if="!_updateValueMulti(target.transition, 2, multi)"\n    >\n      <ui-prop indent=1\n        v-prop="target.normalSprite"\n        tooltip="{{T(\'COMPONENT.toggle.normal_sprite\')}}"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.pressedSprite"\n        tooltip="{{T(\'COMPONENT.toggle.pressed_sprite\')}}"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.hoverSprite"\n        tooltip="{{T(\'COMPONENT.toggle.hover_sprite\')}}"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.disabledSprite"\n        tooltip="{{T(\'COMPONENT.toggle.disabled_sprite\')}}"\n        :multi-values="multi"\n      ></ui-prop>\n    </div>\n\n    <div\n      v-if="!_updateValueMulti(target.transition, 3, multi)"\n    >\n      <ui-prop indent=1\n        v-prop="target.duration"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.duration\')}}"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.zoomScale"\n        :multi-values="multi"\n        tooltip="{{T(\'COMPONENT.toggle.zoom_scale\')}}"\n      ></ui-prop>\n    </div>\n\n    <ui-prop\n      v-prop="target.isChecked"\n      tooltip="{{T(\'COMPONENT.toggle.isChecked\')}}"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.checkMark"\n      tooltip="{{T(\'COMPONENT.toggle.checkMark\')}}"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.toggleGroup"\n      tooltip="{{T(\'COMPONENT.toggle.toggleGroup\')}}"  \n      :multi-values="multi"\n    ></ui-prop>\n\n    <cc-array-prop :target.sync="target.checkEvents"></cc-array-prop>\n    <ui-prop\n      v-prop="target.soundUrl"\n      :multi-values="multi"\n    ></ui-prop>\n  ',
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
        resetNodeSize() {
            var t = {
                id: this.target.uuid.value,
                path: "_resizeToTarget",
                type: "Boolean",
                isSubProp: !1,
                value: !0
            };
            Editor.Ipc.sendToPanel("scene", "scene:set-property", t)
        },
        _updateValueMulti: (t,o,n)=>n ? t.values.some(t=>t !== o) : t.value !== o
    }
});