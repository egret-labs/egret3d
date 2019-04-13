import { Component } from "../../ecs/Component";
import { serializedField } from "../Decorators";

export { HideFlagsComponent, HideFlags };

/**
 *
 */
const enum HideFlags {
    /**
     *
     */
    None = 0,
    /**
     *
     */
    NotEditable = 1,
    /**
     *
     */
    NotTouchable = 2,
    /**
     *
     */
    DontSave = 4,
    /**
     *
     */
    Hide = 10,
    /**
     *
     */
    HideAndDontSave = 14,
}

/**
 * 隐藏标志, 存放诸如是否保存, 是否编辑时显示等等
 */
class HideFlagsComponent extends Component {
    /**
     * 已丢失或不支持的组件数据。
     */
    @serializedField
    public get dontSave(): boolean {
        return !!(this._flag & HideFlags.DontSave);
    }
    public set dontSave(save: boolean) {
        if (save) {
            this._flag = this._flag | HideFlags.DontSave;
        } else {
            this._flag = this._flag & ~(HideFlags.DontSave);
        }
    }

    private _flag: uint = 0;
}