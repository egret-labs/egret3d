import {
    IEntity,
    component,
    Entity,
    Component,
} from "../../ecs";
import { GameEntity } from "../entities/GameEntity";
/**
 * 基础游戏组件。
 * - 全部游戏组件的基类。
 */
@component({ isAbstract: true })
export abstract class BaseComponent extends Component {
    /**
     * 该组件的游戏实体。
     */
    public readonly gameEntity: GameEntity = null!;
    /**
     * @override
     * @internal
     */
    public initialize(defaultEnabled: boolean, entity: Entity): void {
        super.initialize(defaultEnabled, entity);

        (this.gameEntity as GameEntity) = entity as IEntity as GameEntity;
        (this.gameObject as GameEntity) = entity as IEntity as GameEntity;
    }
    /**
     * @override
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        (this.gameEntity as GameEntity) = null!;
        (this.gameObject as GameEntity) = null!;
    }

    /**
     * @deprecated
     */
    public readonly gameObject: GameEntity = null!;
}
