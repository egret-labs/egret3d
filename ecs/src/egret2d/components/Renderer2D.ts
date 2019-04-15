import { BaseRenderer } from "../../egret/components/BaseRenderer";



/**
 * 2D渲染的基类
 */
export abstract class Renderer2D extends BaseRenderer {

    /**
     * @internal
     */
    public readonly _displayObject: egret.DisplayObject = null!;
}