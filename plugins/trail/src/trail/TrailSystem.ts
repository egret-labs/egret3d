namespace egret3d.trail {
    /**
     * 拖尾系统
     * @internal
     */
    export class TrailSystem extends paper.BaseSystem<paper.GameObject> {

        private _batchers: TrailBatcher[] = [];

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
         * 
         * @param entity 进入系统的对象
         */
        public onEntityAdded(entity: paper.GameObject): void {
            const trail = entity.getComponent(TrailComponent);
            if (!trail) { return; }

            // 添加并初始化
            const batcher = new TrailBatcher(entity, trail);
            batcher.initialize();
            this._batchers.push(batcher);
        }
        /**
         * 
         * @param entity 离开系统的对象
         */
        public onEntityRemoved(entity: paper.GameObject) {
            for (let i = 0; i < this._batchers.length; i++) {
                const batcher = this._batchers[i];
                if (batcher.gameObject !== entity) { continue; }

                // 反初始化并移除
                batcher.uninitialize();
                this._batchers.splice(i, 1);
                return;
            }
        }
        /**
         * 渲染帧更新
         * @param deltaTime 帧时长(秒)
         */
        public onFrame(deltaTime: float) {
            this._batchers.map((batcher) => batcher.update(deltaTime));
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
