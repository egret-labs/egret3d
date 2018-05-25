namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem<Egret2DRenderer> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];
        /**
         * @inheritDoc
         */
        public update() {
            const deltaTime = paper.Time.deltaTime;

            for (const component of this._components) {
                component.update(deltaTime);
            }

            if (this._components.length > 0) {
                egret.ticker.update();
            }
        }
    }
}
