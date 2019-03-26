namespace components {

    export class MotionBlurPostprocess extends egret3d.CameraPostprocessing {
        private _velocityFactor: number = 1.0;
        private _samples: number = 20;
        private _resolution: egret3d.Vector2 = egret3d.Vector2.create(1.0, 1.0);

        private _depthRenderTarget: egret3d.RenderTexture | null = null;
        private _depthMaterial: egret3d.Material | null = null;
        private _material: egret3d.Material | null = null;
        private _preMatrix: egret3d.Matrix4 | null = null;

        private _onStageResize(): void {
            const { w, h } = egret3d.stage.viewport;
            const renderTexture = this._depthRenderTarget;
            if (renderTexture) {
                renderTexture.uploadTexture(w, h);
            }
        }

        public initialize() {
            super.initialize();

            this._resolution.set(egret3d.stage.viewport.w, egret3d.stage.viewport.h);
            this._depthRenderTarget = egret3d.RenderTexture.create({ width: egret3d.stage.viewport.w, height: egret3d.stage.viewport.h, premultiplyAlpha: 1 }).setLiner(false).setRepeat(false).setMipmap(true).retain();
            this._depthMaterial = egret3d.Material.create(RES.getRes("shaders/motionBlur/blurDepth.shader.json")).retain();
            this._depthMaterial.setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            this._material = egret3d.Material.create(RES.getRes("shaders/motionBlur/motionBlur.shader.json")).retain();
            this._material.setDepth(true, true).setCullFace(false).setFloat("velocityFactor", this._velocityFactor);

            egret3d.stage.onScreenResize.add(this._onStageResize, this);
        }

        public uninitialize() {
            super.uninitialize();

            egret3d.stage.onScreenResize.remove(this._onStageResize, this);

            if (this._depthRenderTarget) {
                this._depthRenderTarget.release();
            }

            if (this._depthMaterial) {
                this._depthMaterial.release();
            }

            if (this._material) {
                this._material.release();
            }

            if (this._preMatrix) {
                this._preMatrix.release();
            }

            this._depthRenderTarget = null;
            this._depthMaterial = null;
            this._material = null;
            this._preMatrix = null;
        }

        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            const depthMaterial = this._depthMaterial!;
            const material = this._material!;
            const renderState = this._renderState;
            const postProcessingRenderTarget = camera.postprocessingRenderTarget;

            depthMaterial.setFloat("mNear", camera.near).setFloat("mFar", camera.far);
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

            this.blit(postProcessingRenderTarget, this._material);

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
                this._material!.setFloat("velocityFactor", value);
            }
        }

        public set samples(value: number) {
            if (this._samples !== value) {
                const material = this._material!;
                material.removeDefine(`SAMPLE_NUM ${this._samples}`);
                this._samples = value;
                material.addDefine(`SAMPLE_NUM ${this._samples}`);
            }
        }
    }
}
