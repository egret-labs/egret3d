namespace egret3d {

    /**
     * Guidpath系统
     */
    export class GuidpathSystem extends paper.BaseSystem<Guidpath> {
        /**
         * @inheritDoc
         */
        public readonly _interests = [{ componentClass: Guidpath }];
        /**
         * @inheritDoc
         */
        public update() {
            const deltaTime = paper.Time.deltaTime;
            
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
