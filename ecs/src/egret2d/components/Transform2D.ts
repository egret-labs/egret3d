import { Stage2D } from './Stage2D';
import { Vector2, Node } from './../../egret';
import { Entity } from '../../ecs/Entity';
import { serializedField } from '../../serialize/Decorators';

/**
 * @final
 */
export class Transform2D extends Node {
    /**
     * x,y
     * scaleX, scaleY
     * rotation
     * skewX, skewY
     * width, height
     * anchorOffsetX, anchorOffsetY
     * visible
     * cacheAsBitmap
     * alpha
     * touchEnabled
     * scrollRect
     * blendMode
     * mask
     * filters
     */


    /**
     *
     * @internal
     */
    public readonly _container: egret.DisplayObjectContainer = null!;

    private readonly _localPosition: Vector2 = Vector2.create();
    private readonly _localScale: Vector2 = Vector2.create(1.0, 1.0);
    private readonly _localRotation: number = 0.0;

    /**
     * 
     * @param defaultEnabled 
     * @param entity 
     * @override
     * @internal
     */
    public initialize(defaultEnabled: boolean, config: any, entity: Entity) {
        super.initialize(defaultEnabled, config, entity);

        //
        (this._container as egret.DisplayObjectContainer) = new egret.DisplayObjectContainer();
    }

    public uninitialize() {
        super.uninitialize();

        //
        this._container.removeChildren();
        (this._container as egret.DisplayObjectContainer) = null!;
    }

    /**
     * 
     * @param node 
     * @param worldTransformStays 
     * @override
     */
    public setParent(node: Node, worldTransformStays: boolean = false): Node {
        if ((node instanceof Transform2D)) {
            //TODO
            const stage2D = node.entity.getComponent(Stage2D);
            if (stage2D !== null) {
                stage2D.stage.addChild((node as Transform2D)._container);
            }
            return super.setParent(node, worldTransformStays);
        }
        else {
            console.warn("2D节点只允许在2D节点之间挂载");
            return this;
        }
    }

    /**
     * 2D的本地坐标
     */
    @serializedField
    public get localPosition(): Readonly<Vector2> {
        return this._localPosition;
    }
    public set localPosition(value: Readonly<Vector2>) {
        this._localPosition.x = value.x;
        this._localPosition.y = value.y;

        this._container.x = value.x;
        this._container.y = value.y;
    }

    /**
     * 2D的本地缩放
     */
    @serializedField
    public get localScale(): Readonly<Vector2> {
        return this._localScale;
    }
    public set localScale(value: Readonly<Vector2>) {
        this._localScale.x = value.x;
        this._localScale.y = value.y;

        this._container.scaleX = value.x;
        this._container.scaleY = value.y;
    }

    /**
     * 2D的本地旋转
     */
    @serializedField
    public get localRotation(): number {
        return this._localRotation;
    }

    public set localRotation(value: number) {
        (this._localRotation as number) = value;

        this._container.rotation = value;
    }
}