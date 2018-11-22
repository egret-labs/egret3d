namespace examples.postprocessing {
    export class MotionBlurPostProcess extends egret3d.CameraPostProcessing {
        private _depathMaterial: egret3d.Material;
        private _material: egret3d.Material;
        private _velocityFactor: number = 1.0;
        private _samples: number = 20;
        private _resolution: egret3d.Vector2 = egret3d.Vector2.create(1.0, 1.0);

        private _depthRenderTarget: egret3d.GlRenderTarget | null = null;
        private readonly _renderState: egret3d.WebGLRenderState = paper.GameObject.globalGameObject.getComponent(egret3d.WebGLRenderState)!;
        private readonly _preMatrix: egret3d.Matrix4 = egret3d.Matrix4.create();
        public constructor() {
            super();
            this._resolution.set(egret3d.stage.viewport.w, egret3d.stage.viewport.h);

            this._depathMaterial = egret3d.Material.create(RES.getRes("shaders/motionBlur/blurDepth.shader.json"));
            this._depathMaterial.setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK);

            this._material = egret3d.Material.create(RES.getRes("shaders/motionBlur/motionBlur.shader.json"));
            this._material.setDepth(true, true).setCullFace(false).setFloat("velocityFactor", this._velocityFactor);
        }

        public render(camera: egret3d.Camera) {
            const context = camera.context;
            const depthMaterial = this._depathMaterial;
            const material = this._material;
            const renderState = this._renderState;
            const postProcessingRenderTarget = camera.postProcessingRenderTarget;

            if(!this._depthRenderTarget){                
                this._depthRenderTarget  = new egret3d.GlRenderTarget("depthRenderTarget", egret3d.stage.viewport.w, egret3d.stage.viewport.h, true, false, false, true);
            }

            depthMaterial.setFloat("mNear", camera.near).setFloat("mFar", camera.far);

            // const preMatrix = camera.gameObject.transform.worldToLocalMatrix.clone();
            // preMatrix.multiply(camera.projectionMatrix);
            const preMatrix = egret3d.Matrix4.create().multiply(camera.projectionMatrix, camera.transform.worldToLocalMatrix).release();
            const currentMatrix = preMatrix.clone().inverse();

            //
            material.setTexture("tColor", postProcessingRenderTarget);
            material.setMatrix("viewProjectionInverseMatrix", currentMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._preMatrix);

            camera.renderTarget = this._depthRenderTarget;
            renderState.render(camera, depthMaterial);
            camera.renderTarget = null;

            material.setTexture("tDepth", this._depthRenderTarget);

            context.blit(postProcessingRenderTarget, this._material);

            this._preMatrix.copy(preMatrix);
        }

        public get velocityFactor() {
            return this._velocityFactor;
        }

        public get samples() {
            return this._samples;
        }

        public set velocityFactor(value: number) {
            if (this._velocityFactor !== value) {
                this._velocityFactor = value;
                this._material.setFloat("velocityFactor", value);
            }
        }

        public set samples(value: number) {
            if (this._samples !== value) {
                this._material.removeDefine(`SAMPLE_NUM ${this._samples}`);
                this._samples = value;
                this._material.addDefine(`SAMPLE_NUM ${this._samples}`);
            }
        }
    }
}
