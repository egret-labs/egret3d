import { serializedField } from '../../serialize/Decorators';
import { Renderer2D } from './Renderer2D';
import { Entity } from '../../ecs';

/**
 * fontFamily
 * size
 * bold
 * italic
 * textAlign
 * verticalAlign
 * lineSpacing
 * textColor
 * wordWrap
 * type
 * inputType
 * text
 * strokeColor
 * stroke
 * maxChars
 * scrollV
 * multiline
 * restrict
 * border
 * borderColor
 * background
 * textFlow
 */

/**
 * 2D渲染的基类
 */
export class TextField extends Renderer2D {

    // private _text: string = "";
    /**
     * 
     * @param defaultEnabled 
     * @param entity 
     */
    public initialize(defaultEnabled: boolean, config: any, entity: Entity) {
        super.initialize(defaultEnabled, config, entity);

        (this._displayObject as egret.DisplayObject) = new egret.TextField();
    }

    public uninitialize() {
        super.uninitialize();

        (this._displayObject as egret.DisplayObject) = null as any;
    }
    /**
     * 2D的本地坐标
     */
    @serializedField
    public get text(): string {
        return (this._displayObject as egret.TextField).text;
    }

    public set text(value: string) {
        (this._displayObject as egret.TextField).text = value;
    }
}