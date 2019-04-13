import {
    IComponentClass,
    IEntity,
    IComponent,
    component,
    Entity,
} from "../../ecs/index";

import { RunningMode, IComponentClassExtensions } from "../types";
import { GameEntity } from "../entities/GameEntity";
import { BaseComponent } from "./BaseComponent";
import { Application } from "../Application";
/**
 * 基础游戏组件。
 * - 全部游戏组件的基类。
 */
@component({ isAbstract: true })
export abstract class Behaviour extends BaseComponent {
    /**
     * @override
     * @internal
     */
    public _destroy() {
        if (this._getExecuteEnabled()) {
            // if (this._lifeStates & ComponentLifeState.Awaked) { // TODO
            this.onDestroy && this.onDestroy();
            // }
        }

        super._destroy();
    }
    /**
     * @internal
     */
    public _getExecuteEnabled() {
        const { runningMode } = Application.current;
        const { extensions } = this.constructor as IComponentClass<IComponent>;

        if (extensions !== null) {
            const { executeMode = 0 } = (extensions as IComponentClassExtensions);

            return executeMode === 0 || (runningMode & executeMode) !== 0;
        }
        else if ((runningMode & RunningMode.Editor) !== 0) { // Editor mode is disabled by default.
            return false;
        }

        return true;
    }
    /**
     * @override
     * @internal
     */
    public initialize(defaultEnabled: boolean, entity: Entity): void {
        super.initialize(defaultEnabled, entity);

        // if (Application.playerMode !== PlayerMode.Editor || (this.constructor as IComponentClass<Behaviour>).executeInEditMode) { TODO
        //     (this.gameObject as GameObject) = this.entity as GameObject; //

        //     if (this.isActiveAndEnabled) {
        //         this.onAwake && this.onAwake!(config);
        //         this._lifeStates |= ComponentLifeState.Awaked;
        //     }
        // }

        (this.gameEntity as GameEntity) = entity as IEntity as GameEntity;
    }
    /**
     * @override
     * @internal
     */
    public dispatchEnabledEvent(enabled: boolean): void {
        if (this._getExecuteEnabled()) {
            if (enabled) {
                // if ((this._lifeStates & ComponentLifeState.Awaked) === 0) { TODO
                //     this.onAwake && this.onAwake();
                //     this._lifeStates |= ComponentLifeState.Awaked;
                // }

                this.onEnable && this.onEnable();
            }
            else {
                this.onDisable && this.onDisable();
            }
        }

        super.dispatchEnabledEvent(enabled);
    }
    /**
     * 该组件被初始化时执行。
     * - 在该组件的整个生命周期中只执行一次。
     * @param config 该组件被添加时可以传递的初始化数据。
     */
    public onAwake?(config?: any): void;
    /**
     * TODO
     */
    public onReset?(): void;
    /**
     * 该组件或所属的实体被激活时调用。
     */
    public onEnable?(): void;
    /**
     * 该组件开始运行时执行。
     * - 在该组件的整个生命周期中只执行一次。
     */
    public onStart?(): void;
    /**
     * 程序运行时以固定间隔被执行。
     * @param deltaTime 本帧距离上一帧的时长。
     */
    public onFixedUpdate?(deltaTime?: float): void;
    /**
     * 
     */
    public onTriggerEnter?(collider: any): void;
    /**
     * 
     */
    public onTriggerStay?(collider: any): void;
    /**
     * 
     */
    public onTriggerExit?(collider: any): void;
    /**
     * 
     */
    public onCollisionEnter?(collider: any): void;
    /**
     * 
     */
    public onCollisionStay?(collider: any): void;
    /**
     * 
     */
    public onCollisionExit?(collider: any): void;
    /**
     * 程序运行时每帧执行。
     * @param deltaTime 上一帧到此帧流逝的时间。
     * - 以秒为单位。
     */
    public onUpdate?(deltaTime: float): void;
    /**
     * 程序运行时每帧执行。
     * @param deltaTime 上一帧到此帧流逝的时间。
     * - 以秒为单位。
     */
    public onLateUpdate?(deltaTime: float): void;
    /**
     * 该组件的实体拥有的渲染组件被渲染时执行。
     * - 不能在该周期更改渲染组件的材质或其他可能引起绘制信息改变的操作。
     */
    public onBeforeRender?(): boolean;
    /**
     * 该组件或所属的实体被禁用时执行。
     */
    public onDisable?(): void;
    /**
     * 该组件或所属的实体被销毁时执行。
     * - 在该组件的整个生命周期中只执行一次。
     */
    public onDestroy?(): void;
}
