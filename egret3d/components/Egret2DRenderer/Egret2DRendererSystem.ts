namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem<Egret2DRenderer> {
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];

        public onUpdate() {
            const deltaTime = paper.Time.deltaTime;

            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
