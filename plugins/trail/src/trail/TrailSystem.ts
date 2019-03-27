namespace egret3d.trail {
    /**
     * 拖尾系统
     */
    export class TrailSystem extends paper.BaseSystem<paper.GameObject> {
        /**
         * `GameObject` 的以下各个组件齐全时才会进入到此系统, 触发 `onEntityAdded()`
         */
        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(
                    egret3d.Transform,
                    egret3d.MeshFilter,
                    egret3d.MeshRenderer,
                    TrailComponent,
                ),
            ];
        }
        /**
         * TrailComponent 需要依赖 MeshFilter 等组件
         * , 在 `onEntityAdded()` 可以确保 TrailComponent 本身和它依赖的组件都添加完成了
         * , 目前 system - component - batcher 的依赖关系不是很好, 待完善 (// TODO: )
         */
        public onEntityAdded(entity: paper.GameObject): void {
            const trail = entity.getComponent(TrailComponent);
            if (trail) { trail.onDependenciesReady(); }
        }
        /**
         * 渲染帧更新
         * @param deltaTime 帧时长(秒)
         */
        public onFrame(deltaTime: float) {
            for (const entity of this.groups[0].entities) {
                const trail = entity.getComponent(TrailComponent);
                if (!trail) { continue; }
                trail.update(deltaTime);
            }
        }
    }
    /**
     * 创建拖尾对象
     * @param name 对象名称
     */
    export function createTrail(name?: string): paper.GameObject {
        const o = egret3d.creater.createGameObject(name);
        // `MeshFilter` 和 `MeshRenderer` 两个组件会在 `createGameObject()` 里面创建
        // , 所以这里只需要添加 `TrailComponent` 
        o.addComponent(egret3d.trail.TrailComponent);
        return o;
    }
    // 注册拖尾系统, 因为依赖 MeshRenderSystem, 所以在每帧中应该在它之前执行
    paper.Application.systemManager.preRegister(
        TrailSystem,
        paper.Application.gameObjectContext,
        paper.SystemOrder.BeforeRenderer - 1,
    );
}
