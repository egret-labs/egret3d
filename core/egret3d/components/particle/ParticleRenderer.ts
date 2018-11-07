namespace egret3d.particle {
    const _helpMatrix = Matrix4.create();
    /**
     * 粒子渲染模式。
     */
    export const enum ParticleRenderMode {
        Billboard = 0,
        Stretch = 1,
        HorizontalBillboard = 2,
        VerticalBillboard = 3,
        Mesh = 4,
        None = 5
    }
    /**
     * 粒子着色器的变量名。
     * @internal
     */
    export const enum ParticleMaterialUniform {
        WORLD_POSITION = 'u_worldPosition',
        WORLD_ROTATION = 'u_worldRotation',
        POSITION_SCALE = 'u_positionScale',
        SIZE_SCALE = 'u_sizeScale',
        SCALING_MODE = 'u_scalingMode',
        GRAVIT = 'u_gravity',
        START_SIZE3D = 'START_SIZE3D',
        START_ROTATION3D = 'u_startRotation3D',
        SIMULATION_SPACE = 'u_simulationSpace',
        CURRENTTIME = 'u_currentTime',
        ALPHAS_GRADIENT = 'u_alphaGradient[0]',
        COLOR_GRADIENT = 'u_colorGradient[0]',
        ALPHA_GRADIENT_MAX = 'u_alphaGradientMax[0]',
        COLOR_GRADIENT_MAX = 'u_colorGradientMax[0]',
        VELOCITY_CONST = 'u_velocityConst',
        VELOCITY_CURVE_X = 'u_velocityCurveX[0]',
        VELOCITY_CURVE_Y = 'u_velocityCurveY[0]',
        VELOCITY_CURVE_Z = 'u_velocityCurveZ[0]',
        VELOCITY_CONST_MAX = 'u_velocityConstMax',
        VELOCITY_CURVE_MAX_X = 'u_velocityCurveMaxX[0]',
        VELOCITY_CURVE_MAX_Y = 'u_velocityCurveMaxY[0]',
        VELOCITY_CURVE_MAX_Z = 'u_velocityCurveMaxZ[0]',
        SPACE_TYPE = 'u_spaceType',
        SIZE_CURVE = 'u_sizeCurve[0]',
        SIZE_CURVE_X = 'u_sizeCurveX[0]',
        SIZE_CURVE_Y = 'u_sizeCurveY[0]',
        SIZE_CURVE_Z = 'u_sizeCurveZ[0]',
        SIZE_CURVE_MAX = 'u_sizeCurveMax[0]',
        SIZE_CURVE_MAX_X = 'u_sizeCurveMaxX[0]',
        SIZE_CURVE_MAX_Y = 'u_sizeCurveMaxY[0]',
        SIZE_CURVE_MAX_Z = 'u_sizeCurveMaxZ[0]',
        ROTATION_CONST = 'u_rotationConst',
        ROTATION_CONST_SEPRARATE = 'u_rotationConstSeprarate',
        ROTATION_CURVE = 'u_rotationCurve[0]',
        ROTATE_CURVE_X = 'u_rotationCurveX[0]',
        ROTATE_CURVE_y = 'u_rotationCurveY[0]',
        ROTATE_CURVE_Z = 'u_rotationCurveZ[0]',
        ROTATE_CURVE_W = 'u_rotationCurveW[0]',
        ROTATION_CONST_MAX = 'u_rotationConstMax',
        ROTATION_CONST_MAX_SEPRARATE = 'u_rotationConstMaxSeprarate',
        ROTATION_CURVE_MAX = 'u_rotationCurveMax[0]',
        ROTATION_CURVE_MAX_X = 'u_rotationCurveMaxX[0]',
        ROTATION_CURVE_MAX_Y = 'u_rotationCurveMaxY[0]',
        ROTATION_CURVE_MAX_Z = 'u_rotationCurveMaxZ[0]',
        ROTATION_CURVE_MAX_W = 'u_rotationCurveMaxW[0]',
        CYCLES = 'u_cycles',
        SUB_UV = 'u_subUV',
        UV_CURVE = 'u_uvCurve[0]',
        UV_CURVE_MAX = 'u_uvCurveMax[0]',
        LENGTH_SCALE = 'u_lengthScale',
        SPEED_SCALE = 'u_speeaScale',
    }
    /**
     * 粒子着色器的宏定义。
     * @internal
     */
    export const enum ParticleMaterialDefine {
        SPHERHBILLBOARD = "SPHERHBILLBOARD",
        STRETCHEDBILLBOARD = "STRETCHEDBILLBOARD",
        HORIZONTALBILLBOARD = "HORIZONTALBILLBOARD",
        VERTICALBILLBOARD = "VERTICALBILLBOARD",
        ROTATIONOVERLIFETIME = "ROTATIONOVERLIFETIME",
        ROTATIONCONSTANT = "ROTATIONCONSTANT",
        ROTATIONTWOCONSTANTS = "ROTATIONTWOCONSTANTS",
        ROTATIONSEPERATE = "ROTATIONSEPERATE",
        ROTATIONCURVE = "ROTATIONCURVE",
        ROTATIONTWOCURVES = "ROTATIONTWOCURVES",
        TEXTURESHEETANIMATIONCURVE = "TEXTURESHEETANIMATIONCURVE",
        TEXTURESHEETANIMATIONTWOCURVE = "TEXTURESHEETANIMATIONTWOCURVE",
        VELOCITYCONSTANT = "VELOCITYCONSTANT",
        VELOCITYCURVE = "VELOCITYCURVE",
        VELOCITYTWOCONSTANT = "VELOCITYTWOCONSTANT",
        VELOCITYTWOCURVE = "VELOCITYTWOCURVE",
        COLOROGRADIENT = "COLOROGRADIENT",
        COLORTWOGRADIENTS = "COLORTWOGRADIENTS",
        SIZECURVE = "SIZECURVE",
        SIZETWOCURVES = "SIZETWOCURVES",
        SIZECURVESEPERATE = "SIZECURVESEPERATE",
        SIZETWOCURVESSEPERATE = "SIZETWOCURVESSEPERATE",
        RENDERMESH = "RENDERMESH",
        SHAPE = "SHAPE",
    }
    /**
     * 粒子渲染器。
     */
    export class ParticleRenderer extends paper.BaseRenderer {
        /**
         * 渲染模式改变
         */
        public static readonly onRenderModeChanged: signals.Signal = new signals.Signal();
        /**
         * TODO
         */
        public static readonly onVelocityScaleChanged: signals.Signal = new signals.Signal();
        /**
         * TODO
         */
        public static readonly onLengthScaleChanged: signals.Signal = new signals.Signal();
        /**
         * 
         */
        public static readonly onMeshChanged: signals.Signal = new signals.Signal();
        /**
         * TODO
         */
        public frustumCulled: boolean = false;
        @paper.serializedField
        public velocityScale: number;
        @paper.serializedField
        public lengthScale: number;

        @paper.serializedField
        private _renderMode: ParticleRenderMode = ParticleRenderMode.Billboard;
        @paper.serializedField
        private _mesh: egret3d.Mesh | null;
        /**
         * @internal
         */
        public batchMesh: Mesh;
        /**
         * @internal
         */
        public batchMaterial: Material;

        public uninitialize() {
            super.uninitialize();

            this._mesh = null;
            this._renderMode = ParticleRenderMode.Billboard;
            this.velocityScale = 1.0;
            this.lengthScale = 1.0;
        }

        public recalculateLocalBox() {
            this._localBoundingBox.copy(Box.ONE);
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            let raycastMesh = false;
            let raycastInfo: egret3d.RaycastInfo | undefined = undefined;
            const localRay = helpRay.applyMatrix(this.gameObject.transform.worldToLocalMatrix, p1);
            const localBoundingBox = this.localBoundingBox;

            if (p2) {
                if (p2 === true) {
                    raycastMesh = true;
                }
                else {
                    raycastMesh = p3 || false;
                    raycastInfo = p2;
                }
            }

            if (localBoundingBox.raycast(localRay, raycastInfo)) {
                if (raycastInfo) { // Update local raycast info to world.
                    const worldMatrix = this.gameObject.transform.localToWorldMatrix;
                    raycastInfo.position.applyMatrix(worldMatrix);
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }
        /**
         * 
         */
        public get renderMode(): ParticleRenderMode {
            return this._renderMode;
        }
        public set renderMode(value: ParticleRenderMode) {
            if (this._renderMode === value) {
                return;
            }

            this._renderMode = value;
            ParticleRenderer.onRenderModeChanged.dispatch(this);
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.MESH)
        public get mesh() {
            return this._mesh;
        }
        public set mesh(mesh: Mesh | null) {
            if (this._mesh === mesh) {
                return;
            }

            this._mesh = mesh;
            ParticleRenderer.onMeshChanged.dispatch(this);
        }
    }
}