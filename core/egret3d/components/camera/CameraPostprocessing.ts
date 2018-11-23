namespace egret3d {
    /**
     * TODO 平台无关。
     */
    export interface ICameraPostProcessing {
        render(camera: Camera): void;
    }
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    export abstract class CameraPostprocessing extends paper.BaseComponent {
        public render(camera: Camera) {

        }
    }

    export class MotionBlurEffect extends CameraPostprocessing {
        private _material: Material;
        private _velocityFactor: number = 1.0;
        private _samples: number = 20;
        private readonly _resolution: Vector2 = Vector2.create(1.0, 1.0);
        private readonly _worldToClipMatrix: Matrix4 = Matrix4.create();
        
        public initialize() {
            this._resolution.set(stage.viewport.w, stage.viewport.h);

            this._material = new Material(new Shader(egret3d.ShaderLib.motionBlur as any, "motionBlur"));
            this._material.setDepth(false, false);
            this._material.setCullFace(false);
            // this._material.setVector2("resolution", this._resolution);
            this._material.setFloat("velocityFactor", this._velocityFactor);
        }

        public uninitialize() {
            if (this._material) {
                this._material.dispose();
            }

            this._resolution.release();
            this._worldToClipMatrix.release();
        }

        public render(camera: Camera) {
            const context = camera.context;
            const clipToWorldMatrix = camera.clipToWorldMatrix;
            const material = this._material;
            const postProcessingRenderTarget = camera.postprocessingRenderTarget;

            //
            material.setTexture("tColor", postProcessingRenderTarget);

            material.setMatrix("viewProjectionInverseMatrix", clipToWorldMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._worldToClipMatrix);

            context.blit(postProcessingRenderTarget, this._material);

            this._worldToClipMatrix.copy(camera.worldToClipMatrix);
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
