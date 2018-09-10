namespace egret3d {
    /**
     * 
     */
    export class Egret2DRendererSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];
        /**
         * TODO
         * @internal
         */
        public readonly webInput = egret.Capabilities.runtimeType === egret.RuntimeType.WEB ? new (egret as any)["web"].HTMLInput() : null;

        public onAwake() {
            if (this.webInput) {
                this.webInput._initStageDelegateDiv(WebGLCapabilities.canvas.parentNode as HTMLDivElement, WebGLCapabilities.canvas);
            }
        }

        public onUpdate(deltaTime: number) {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.getComponent(Egret2DRenderer) as Egret2DRenderer).update(deltaTime);
            }
        }
    }
}
