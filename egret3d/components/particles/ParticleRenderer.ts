namespace egret3d.particle {
    export const BillboardPerVertexCount = 37;
    export const MeshPerVertexCount = 42;

    export const enum ParticleRendererEventType {
        Mesh = "mesh",
        Materials = "materials",
        RenderMode = "renderMode",
        LengthScaleChanged = "lengthScale",
        VelocityScaleChanged = "velocityScale",

    }
    export const enum ParticleSortMode {
        None = 0,
        Distance = 1,
        OldestInFront = 2,
        YoungestInFront = 3
    }
    export const enum ParticleRenderSpace {
        View = 0,
        World = 1,
        Local = 2,
        Facing = 3
    }
    export const enum ParticleRenderMode {
        Billboard = 0,
        Stretch = 1,
        HorizontalBillboard = 2,
        VerticalBillboard = 3,
        Mesh = 4,
        None = 5
    }

    /**
     * 粒子着色器用到的属性
     */
    export const enum ParticleMaterialAttribute {
        POSITION = "POSITION",
        COLOR_0 = "COLOR_0",
        TEXCOORD_0 = "TEXCOORD_0",
        CORNER = "CORNER",
        START_POSITION = "START_POSITION",
        START_VELOCITY = "START_VELOCITY",
        START_COLOR = "START_COLOR",
        START_SIZE = "START_SIZE",
        START_ROTATION = "START_ROTATION",
        TIME = "TIME",
        RANDOM0 = "RANDOM0",
        RANDOM1 = "RANDOM1",
        WORLD_POSITION = "WORLD_POSITION",
        WORLD_ROTATION = "WORLD_ROTATION",
    }
    /**
     * 粒子着色器用到的变量
     */
    export const enum ParticleMaterialUniform {
        WORLD_POSITION = 'u_worldPosition',
        WORLD_ROTATION = 'u_worldRotation',
        POSITION_SCALE = 'u_positionScale',
        SIZE_SCALE = 'u_sizeScale',
        SCALING_MODE = 'u_scalingMode',
        GRAVIT = 'u_gravity',
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
     * 粒子着色器用到的宏定义
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
     * 渲染类型为Mesh的属性格式
     */
    export const MeshShaderAttributeFormat: { key: string, type: gltf.AccessorType }[] = [
        { key: ParticleMaterialAttribute.POSITION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.COLOR_0, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.TEXCOORD_0, type: gltf.AccessorType.VEC2 },
        { key: ParticleMaterialAttribute.START_POSITION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_VELOCITY, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_COLOR, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.START_SIZE, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_ROTATION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.TIME, type: gltf.AccessorType.VEC2 },
        { key: ParticleMaterialAttribute.RANDOM0, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.RANDOM1, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.WORLD_POSITION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.WORLD_ROTATION, type: gltf.AccessorType.VEC4 },
    ];
    /**
     * 渲染类型为Billboard的属性格式
     */
    export const BillboardShaderAttributeFormat: { key: string, type: gltf.AccessorType }[] = [
        { key: ParticleMaterialAttribute.CORNER, type: gltf.AccessorType.VEC2 },
        { key: ParticleMaterialAttribute.TEXCOORD_0, type: gltf.AccessorType.VEC2 },
        { key: ParticleMaterialAttribute.START_POSITION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_VELOCITY, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_COLOR, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.START_SIZE, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.START_ROTATION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.TIME, type: gltf.AccessorType.VEC2 },
        { key: ParticleMaterialAttribute.RANDOM0, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.RANDOM1, type: gltf.AccessorType.VEC4 },
        { key: ParticleMaterialAttribute.WORLD_POSITION, type: gltf.AccessorType.VEC3 },
        { key: ParticleMaterialAttribute.WORLD_ROTATION, type: gltf.AccessorType.VEC4 },
    ];

    @paper.disallowMultipleComponent
    export class ParticleRenderer extends paper.BaseRenderer {
        @paper.serializedField
        private _mesh: egret3d.Mesh | null;
        @paper.serializedField
        private readonly _materials: Material[] = [];
        @paper.serializedField
        public velocityScale: number;
        @paper.serializedField
        public _renderMode: ParticleRenderMode = ParticleRenderMode.Billboard;
        @paper.serializedField
        public lengthScale: number;
        /**
         * @internal
         */
        public batchMesh: Mesh;
        /**
         * @internal
         */
        public batchMaterial: Material;

        public deserialize(element: any): void {
            super.deserialize(element);

            if (element._mesh) {
                this._mesh = new (Mesh as any)(); //
                (this._mesh as Mesh).deserialize(element._mesh);
            }

            this.velocityScale = element.velocityScale;
            this._renderMode = element._renderMode;
            this.lengthScale = element.lengthScale;

            if (element._materials) {
                this._materials.length = 0;
                for (let i = 0, l = element._materials.length; i < l; i++) {
                    this._materials.push(paper.getDeserializedObject<Material>(element._materials[i]));
                }
            }
        }
        public uninitialize() {
            super.uninitialize();

            this._mesh = null;
            this._materials.length = 0;
            this._renderMode = ParticleRenderMode.Billboard;
            this.velocityScale = 1.0;
            this.lengthScale = 1.0;
        }
        /**
         * @internal
         * @param key 
         */
        public _addShaderDefine(key: string) {
            if (!this.batchMaterial && this._materials.length > 0) {
                this.batchMaterial = this._materials[0];
            }
            if (this.batchMaterial) {
                this.batchMaterial.addDefine(key);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _removeShaderDefine(key: string) {
            if (!this.batchMaterial && this._materials.length > 0) {
                this.batchMaterial = this._materials[0];
            }
            if (this.batchMaterial) {
                this.batchMaterial.removeDefine(key);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setBoolean(_id: string, _value: boolean) {
            if (this.batchMaterial) {
                this.batchMaterial.setBoolean(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setInt(_id: string, _value: number) {
            if (this.batchMaterial) {
                this.batchMaterial.setInt(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setFloat(_id: string, _value: number) {
            if (this.batchMaterial) {
                this.batchMaterial.setFloat(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector2(_id: string, _value: Vector2) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector2(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector2v(_id: string, _value: Float32Array) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector2v(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector3(_id: string, _value: Vector3) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector3(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector4(_id: string, _value: Vector4) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector4(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector3v(_id: string, _value: Float32Array) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector3v(_id, _value);
            }
        }
        /**
         * @internal
         * @param key 
         */
        public _setVector4v(_id: string, _value: Float32Array) {
            if (this.batchMaterial) {
                this.batchMaterial.setVector4v(_id, _value);
            }
        }
        /**
         * mesh model
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 组件挂载的 mesh 模型
         * @version paper 1.0
         * @platform Web
         * @language
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
            paper.EventPool.dispatchEvent(ParticleRendererEventType.Mesh, this);
        }
        /**
         * material list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质数组
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.editor.property(paper.editor.EditType.ARRAY)
        public get materials(): ReadonlyArray<Material> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<Material>) {
            if (value === this._materials) {
                return;
            }

            this._materials.length = 0;
            for (const material of value) {
                this._materials.push(material);
            }
            paper.EventPool.dispatchEvent(ParticleRendererEventType.Materials, this);
        }
        public get renderMode(): ParticleRenderMode {
            return this._renderMode;
        }
        public set renderMode(value: ParticleRenderMode) {
            if (this._renderMode === value) {
                return;
            }

            const old = this._renderMode;
            this._renderMode = value;
            paper.EventPool.dispatchEvent(ParticleRendererEventType.RenderMode, this);
        }
    }
}