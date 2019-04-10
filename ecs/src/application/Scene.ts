import { ISceneClass, IScene } from "../types";
import { serializable, serializeField, deserializeIgnore } from "../serialize/Decorators";
import Serializable from "../serialize/Serializable";
import Entity from "../core/Entity";
import Application from "./Application";
import { filterArray } from "../Utility";
/**
 * 基础场景。
 */
@serializable
export default class Scene extends Serializable<any> implements IScene {
    /**
     * @internal
     */
    public static create<TScene extends Scene>(sceneClass: ISceneClass<TScene>, name: string, application: Application): TScene {
        const scene = new sceneClass();
        scene.initialize(name, application);

        return scene;
    }
    /**
     * 该场景是否已经被销毁。
     */
    public readonly isDestroyed: boolean = true;
    /**
     * 该场景的名称。
     */
    @serializeField
    public name: string = "";
    public readonly application: Application = null!;

    private _entitiesDirty: boolean = false;
    private _entityCount: uint = 0;
    private readonly _entities: (Entity | null)[] = [];
    /**
     * 禁止实例化场景。
     * @protected
     */
    public constructor() {
        super();
    }
    /**
     * 该场景内部初始化。
     * - 重写此方法必须调用 `super.initialize()`。
     * @ignore
     */
    public initialize(name: string, application: Application): void {
        (this.isDestroyed as boolean) = false;
        this.name = name;
        (this.application as Application) = application;
    }
    /**
     * 该场景内部卸载。
     * - 重写此方法必须调用 `super.uninitialize()`。
     * @ignore
     */
    public uninitialize(): void {
        this.name = "";
        (this.application as Application) = null!;
    }
    /**
     * 销毁该场景。
     */
    public destroy(): boolean {
        if (this.isDestroyed) {
            if (DEBUG) {
                console.warn("The scene has been destroyed.");
            }

            return false;
        }

        const { sceneManager } = this.application;

        if (this === sceneManager.globalScene || this === sceneManager.editorScene) {
            if (DEBUG) {
                console.warn("Can not destroy global scene.");
            }

            return false;
        }

        sceneManager.onSceneDestroy.dispatch(this);
        this.removeAllEntity();
        (this.isDestroyed as boolean) = true;
        sceneManager.removeScene(this);
        sceneManager.onSceneDestroyed.dispatch(this);

        return true;
    }
    /**
     * 添加一个实体到该场景。
     * @param entity 要添加的实体。
     */
    public addEntity(entity: Entity): boolean {
        const entities = this._entities;

        const prevScene = entity.scene;

        if (prevScene !== null) {
            const entities = prevScene._entities;
            const index = entities.indexOf(entity);

            if (index >= 0) {
                entities[index] = null;
                prevScene._entityCount--;
                prevScene._entitiesDirty = true;
            }
            else if (DEBUG) {
                console.error("The entity has been removed from the scene");
            }
        }

        if (entities.indexOf(entity) < 0) {
            entities[entities.length] = entity;
            entity.scene = this;
            this._entityCount++;
            this._entitiesDirty = true;

            return true;
        }
        else if (DEBUG) {
            console.warn("The entity has been added to the scene.");
        }

        return false;
    }
    /**
     * 从该场景中移除一个实体。
     * @param entity 要移除的实体。
     */
    public removeEntity(entity: Entity): boolean {
        const entities = this._entities;
        const index = entities.indexOf(entity);

        if (index >= 0) {
            entities[index] = null;

            if (!entity.isDestroyed) {
                entity.destroy();
            }

            this._entityCount--;
            this._entitiesDirty = true;

            return true;
        }
        else if (DEBUG) {
            console.warn("The entity has been removed.");
        }

        return false;
    }
    /**
     * 移除该场景的全部实体。
     * @param excludes 例外的实体数组。
     * - 未设置则没有例外。
     */
    public removeAllEntity(excludes: ReadonlyArray<Entity> | null = null): void {
        const entities = this._entities;
        let i = entities.length;

        while (i--) {
            const entity = entities[i];

            if (
                entity === null ||
                (excludes !== null && excludes.indexOf(entity) >= 0)
            ) {
                continue;
            }

            this.removeEntity(entity);
        }
    }

    public containsEntity(entity: Entity): boolean {
        return this._entities.indexOf(entity) >= 0;
    }

    public get entityCount(): uint {
        return this._entityCount;
    }

    @deserializeIgnore
    @serializeField("gameObjects")
    public get entities(): ReadonlyArray<Entity> {
        const entities = this._entities;

        if (this._entitiesDirty) {
            filterArray(entities, null);
            this._entitiesDirty = false;
        }

        return entities as Entity[];
    }
}
