
const { ccclass, property } = cc._decorator;

@ccclass
export default class TeaTablePre extends cc.Component {
	onLoad() {
		this.node.opacity = 0;
	}

	/**
	 * 本Item进入ScrollView的时候回调
	 */
	onEnterSrcollView() {
		this.node.opacity = 255;
	}

	/**
	 * 本Item离开ScrollView的时候回调
	 */
	onExitScrollView() {
		this.node.opacity = 0;
	}
}
