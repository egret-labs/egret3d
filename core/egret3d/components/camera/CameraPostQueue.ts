namespace egret3d {
    export class PostProcessRenderContext {
        private readonly _camera: Camera = null!;
        private readonly _postProcessingCamera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera); // TODO 后期渲染专用相机
        private readonly _drawCall: DrawCall = DrawCall.create();
        private readonly _defaultMaterial: Material = egret3d.DefaultMaterials.MESH_BASIC.clone().setDepth(false, false); // TODO copy shader
        private readonly _renderState: WebGLRenderState = paper.GameObject.globalGameObject.getOrAddComponent(WebGLRenderState);

        private _fullScreenRT: BaseRenderTarget = null!;
        /**
         * 禁止实例化。
         */
        public constructor(camera: Camera) {
            this._camera = camera;
            //
            this._postProcessingCamera.opvalue = 0.0;
            this._postProcessingCamera.size = 1;
            this._postProcessingCamera.near = 0.01;
            this._postProcessingCamera.far = 1;
            //
            this._drawCall.mesh = DefaultMeshes.FULLSCREEN_QUAD;
            this._drawCall.mesh._createBuffer();
            this._drawCall.subMeshIndex = 0;
            this._drawCall.matrix = Matrix4.IDENTITY;
        }

        public blit(src: Texture, material: Material | null = null, dest: BaseRenderTarget | null = null) {
            if (!material) {
                material = this._defaultMaterial;
                material.setTexture(src);
            }

            const postProcessingCamera = this._postProcessingCamera;
            const renderState = this._renderState;
            this._drawCall.material = material;

            renderState.updateViewport(postProcessingCamera.viewport, dest);
            renderState.clearBuffer(gltf.BufferBit.DEPTH_BUFFER_BIT | gltf.BufferBit.COLOR_BUFFER_BIT, egret3d.Color.WHITE);
            renderState.draw(postProcessingCamera, this._drawCall);
        }

        public clear() {
            this._fullScreenRT.dispose();
            this._fullScreenRT = null;
        }

        public get currentCamera() {
            return this._camera;
        }

        public get fullScreenRT() {
            const stageViewport = stage.viewport;

            if (!this._fullScreenRT || this._fullScreenRT.width !== stageViewport.w || this._fullScreenRT.height !== stageViewport.h) {
                if (this._fullScreenRT) {
                    this._fullScreenRT.dispose();
                }

                this._fullScreenRT = new GlRenderTarget("fullScreenRT", stageViewport.w, stageViewport.h, true);//TODO    平台无关
            }

            return this._fullScreenRT;
        }
    }
    /**
     * TODO 平台无关。
     */
    export interface ICameraPostProcessing {
        render(context: PostProcessRenderContext): void;
    }
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    export abstract class CameraPostProcessing extends paper.BaseRelease<CameraPostProcessing> implements ICameraPostProcessing {
        public render(context: PostProcessRenderContext) {

        }
    }

    export class MotionBlueEffect extends CameraPostProcessing {
        private _material: Material;
        private _velocityFactor: number = 1.0;
        private _samples: number = 20;
        private _resolution: Vector2 = Vector2.create(1.0, 1.0);
        private readonly _clipToWorldMatrix: Matrix4 = Matrix4.create();

        public constructor() {
            super();
            this._resolution.set(stage.viewport.w, stage.viewport.h);

            this._material = new Material(new Shader(egret3d.ShaderLib.motionBlur as any, "motionBlur"));
            this._material.setDepth(false, false);
            this._material.setCullFace(false);
            this._material.setVector2("resolution", this._resolution);
            this._material.setFloat("velocityFactor", this._velocityFactor);
        }

        public render(context: PostProcessRenderContext) {
            const stageViewport = stage.viewport;
            const material = this._material;
            const camera = context.currentCamera;
            const worldToClipMatrix = camera.worldToClipMatrix;

            if (this._resolution.x !== stageViewport.w || this._resolution.y !== stageViewport.h) {
                material.setVector2("resolution", this._resolution);
            }

            material.setTexture("tDiffuse", context.fullScreenRT);
            material.setTexture("tColor", context.fullScreenRT);

            material.setMatrix("viewProjectionInverseMatrix", camera.worldToClipMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._clipToWorldMatrix);

            context.blit(context.fullScreenRT, this._material);

            this._clipToWorldMatrix.copy(camera.clipToWorldMatrix);
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
