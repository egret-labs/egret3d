namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem<Egret2DRenderer> {
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];

        public onUpdate(deltaTime: number) {
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
