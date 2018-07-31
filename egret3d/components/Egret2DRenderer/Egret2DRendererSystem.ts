namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];

        public onUpdate(deltaTime: number) {
            const components = this._groups[0].components as ReadonlyArray<Egret2DRenderer>;
            for (const component of components) {
                component.update(deltaTime);
            }
        }
    }
}
