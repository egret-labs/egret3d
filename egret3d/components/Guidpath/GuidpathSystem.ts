namespace egret3d {

    /**
     * Guidpath系统
     */
    export class GuidpathSystem extends paper.BaseSystem<Guidpath> {
        protected readonly _interests = [{ componentClass: Guidpath }];

        public onUpdate(deltaTime: number) {
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
