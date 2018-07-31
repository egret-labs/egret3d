namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];

        public onUpdate(deltaTime: number) {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.getComponent(Egret2DRenderer) as Egret2DRenderer).update(deltaTime);
            }
        }
    }
}
