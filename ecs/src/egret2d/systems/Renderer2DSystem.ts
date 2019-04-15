import { Context, Group, Matcher, System } from "../../ecs";
import { SystemOrder, GameEntity } from '../../egret';
import { Renderer2D } from "../components/Renderer2D";
import { Transform2D } from "../components/Transform2D";

/**
 * 
 */
export class Renderer2DSystem extends System<any>{
    /**
     * @override
     * @internal
     */
    protected getMatchers() {
        return [
            Matcher.create(Transform2D, Renderer2D)
        ];
    }

    /**
     * @override
     * @internal
     */
    public initialize(order: SystemOrder, context: Context<any>) {
        super.initialize(order, context);
    }
    /**
     * @override
     * @internal
     */
    public onEntityAdded(_entity: GameEntity, _group: Group<any>) {
        if (!_entity.renderer) {
            return;
        }
        const renderer = _entity.renderer as Renderer2D;
        const transform = _entity.getComponent(Transform2D)!;
        transform._container.addChild(renderer._displayObject);//TODO 关联起来
    }
    /**
     * @override
     * @internal
     */
    public onEntityRemoved(_entity: GameEntity, _group: Group<any>) {
        if (!_entity.renderer) {
            return;
        }
        const renderer = _entity.renderer as Renderer2D;
        const transform = _entity.getComponent(Transform2D)!;
        transform._container.removeChild(renderer._displayObject);//TODO 关联起来
    }
}