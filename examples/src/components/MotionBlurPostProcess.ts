namespace components {

    export class MotionBlurPostProcess extends egret3d.CameraPostprocessing {
        private _velocityFactor: number = 1.0;
        private _samples: number = 20;
        private _resolution: egret3d.Vector2 = egret3d.Vector2.create(1.0, 1.0);

        private _depthRenderTarget: egret3d.GlRenderTarget | null = null;
        private _preMatrix: egret3d.Matrix4 | null = null;
        private readonly _depathMaterial: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/motionBlur/blurDepth.shader.json"));
        private readonly _material: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/motionBlur/motionBlur.shader.json"));
        private readonly _renderState: egret3d.RenderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState)!;

        public initialize() {
            super.initialize();

            this._resolution.set(egret3d.stage.viewport.w, egret3d.stage.viewport.h);

            this._depathMaterial.setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            this._material.setDepth(true, true).setCullFace(false).setFloat("velocityFactor", this._velocityFactor);
        }

        public uninitialize() {
            super.uninitialize();

            if (this._depthRenderTarget) {
                this._depthRenderTarget.dispose();
            }

            if (this._depathMaterial) {
                this._depathMaterial.dispose();
            }

            if (this._material) {
                this._material.dispose();
            }

            this._resolution.release();

            if (this._preMatrix) {
                this._preMatrix.release();
            }
        }

        public render(camera: egret3d.Camera) {
            const context = camera.context;
            const depthMaterial = this._depathMaterial;
            const material = this._material;
            const renderState = this._renderState;
            const postProcessingRenderTarget = camera.postprocessingRenderTarget;

            if (!this._depthRenderTarget) {
                this._depthRenderTarget = new egret3d.GlRenderTarget("depthRenderTarget", egret3d.stage.viewport.w, egret3d.stage.viewport.h, true, false, false, true);
            }

            depthMaterial.setFloat("mNear", camera.near).setFloat("mFar", camera.far);
            // const preMatrix = egret3d.Matrix4.create().multiply(camera.projectionMatrix, camera.transform.worldToLocalMatrix).release();
            // const preMatrix = camera.transform.worldToLocalMatrix.clone().multiply(camera.projectionMatrix).release();
            // const currentMatrix = preMatrix.clone().inverse();

            if (!this._preMatrix) {
                this._preMatrix = camera.worldToClipMatrix.clone();
            }

            //
            material.setTexture("tColor", postProcessingRenderTarget);
            material.setMatrix("viewProjectionInverseMatrix", camera.clipToWorldMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._preMatrix);

            camera.renderTarget = this._depthRenderTarget;
            renderState.render(camera, depthMaterial);
            camera.renderTarget = null;

            material.setTexture("tDepth", this._depthRenderTarget);

            context.blit(postProcessingRenderTarget, this._material);

            this._preMatrix.copy(camera.worldToClipMatrix);
        }

        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.1 })
        public get velocityFactor() {
            return this._velocityFactor;
        }

        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 1 })
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
