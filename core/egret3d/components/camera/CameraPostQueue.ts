namespace egret3d {
    export class PostProcessRenderContext extends paper.BaseRelease<PostProcessRenderContext> {
        private _fullScreenRT: BaseRenderTarget;

        private _currentCamera: Camera;

        private readonly _camera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera);
        private readonly _drawCall: DrawCall = DrawCall.create();
        private readonly _defaultMaterial: Material = egret3d.DefaultMaterials.MESH_BASIC.clone(); // TODO copy shader
        private readonly _webglSystem = paper.SystemManager.getInstance().getSystem(web.WebGLRenderSystem);   //TODO
        private readonly _webglState = paper.GameObject.globalGameObject.getOrAddComponent(WebGLRenderState);

        public constructor(camera: Camera) {
            super();
            this._currentCamera = camera;
            //
            this._camera.opvalue = 0.0;
            this._camera.size = 1;
            this._camera.near = 0.01;
            this._camera.far = 1;
            //
            this._drawCall.mesh = DefaultMeshes.FULLSCREEN_QUAD;
            this._drawCall.mesh._createBuffer();
            this._drawCall.subMeshIndex = 0;
            this._drawCall.matrix = Matrix4.IDENTITY;
        }

        public render() {//TODO
            const camera = this._currentCamera;
            const stageViewport = stage.viewport;
            if (!this._fullScreenRT || this._fullScreenRT.width !== stageViewport.w || this._fullScreenRT.height !== stageViewport.h) {
                if (this._fullScreenRT) {
                    this._fullScreenRT.dispose();
                }

                this._fullScreenRT = new GlRenderTarget("fullScreenRT", stageViewport.w, stageViewport.h, true);//TODO    平台无关
            }

            this._webglSystem._renderCamera(camera, this._fullScreenRT);
            for (const postEffect of camera.postQueues) {
                postEffect.render(this);
            }
        }

        public blit(src: Texture, mat: Material | null = null, dest: BaseRenderTarget | null = null) {
            if (!mat) {
                mat = this._defaultMaterial;
                mat.setTexture(src);
            }
            const camera = this._camera;
            const webglSystem = this._webglSystem;
            const webglState = this._webglState;
            webglSystem._viewport(camera.viewport, dest);
            webglState.clearBuffer(gltf.BufferBit.DEPTH_BUFFER_BIT | gltf.BufferBit.COLOR_BUFFER_BIT, egret3d.Color.WHITE);
            webglSystem._draw(camera.context, this._drawCall, mat);
        }

        public clear() {
            this._fullScreenRT.dispose();
            this._fullScreenRT = null;
        }

        public get currentCamera() {
            return this._currentCamera;
        }

        public get fullScreenRT() {
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
        private _viewProjectionInverseMatrix: Matrix4 = Matrix4.create();
        private _previousViewProjectionMatrix: Matrix4 = Matrix4.create();
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
            if (this._resolution.x !== stageViewport.w || this._resolution.y !== stageViewport.h) {
                material.setVector2("resolution", this._resolution);
            }

            material.setTexture("tDiffuse", context.fullScreenRT);
            material.setTexture("tColor", context.fullScreenRT);

            this._viewProjectionInverseMatrix.copy(camera.context.matrix_vp).inverse();

            material.setMatrix("viewProjectionInverseMatrix", this._viewProjectionInverseMatrix);
            material.setMatrix("previousViewProjectionMatrix", this._previousViewProjectionMatrix);

            context.blit(context.fullScreenRT, this._material);
            this._previousViewProjectionMatrix.copy(camera.context.matrix_vp);
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
