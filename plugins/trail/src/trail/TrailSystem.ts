namespace egret3d.trail {
    /**
     * 拖尾系统
     */
    export class TrailSystem extends paper.BaseSystem<paper.GameObject> {

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
        public onFrame(deltaTime: float) {
            for (const entity of this.groups[0].entities) {
                const trail = entity.getComponent(TrailComponent);
                if (!trail) { continue; }
                trail.update(deltaTime);
            }
        }
    }

    // 注册拖尾系统
    paper.Application.systemManager.preRegister(
        TrailSystem,
        paper.Application.gameObjectContext,
        paper.SystemOrder.BeforeRenderer - 1,
    );
}
