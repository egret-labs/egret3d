namespace egret3d {
    /**
     * 
     */
    export class WebGLRenderSystem extends paper.BaseSystem<paper.BaseComponent> {
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);
        private readonly _techiques: GLTFWebglGlTechnique = this._globalGameObject.getComponent(GLTFWebglGlTechnique) || this._globalGameObject.addComponent(GLTFWebglGlTechnique);

        private _renderCalls(drawCalls: DrawCall[]) {

        }

        public onUpdate() {
            //
            const opaqueCalls = this._drawCalls.opaqueCalls;
            const transparentCalls = this._drawCalls.transparentCalls;

            //Step1 draw opaque

            //Step2 draw transparent
        }
    }
}