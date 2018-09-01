namespace egret3d {
    //TODO 运行时DrawCall排序优化使用
    let _hashCode: number = 0;
    //兼容老的Uniform键值
    // let _compatible: { [key: string]: string } = { "_MainColor": "diffuse", "_MainTex": "map", "_MainTex_ST": "uvTransform" };

    /**
     * 材质资源
     */
    export class Material extends GLTFAsset {
        /**
         * 
         */
        public static create(shader?: Shader | string): Material;
        public static create(config: GLTF, name: string): Material;
        public static create(shaderOrConfig?: Shader | string | GLTF, name?: string) {
            return new Material(shaderOrConfig as any, name as any);
        }
        /**
         * 
         */
        public renderQueue: paper.RenderQueue | number = paper.RenderQueue.Geometry;
        /**
          * @internal
          */
        public _id: number = _hashCode++;
        /**
          * @internal
          */
        public _version: number = 0;
        private _cacheDefines: string = "";
        private readonly _defines: Array<string> = [];
        private readonly _textures: Texture[] = [];//TODO
        /**
         * @internal
         */
        public _shader: Shader = null!;
        /**
        * @internal
        */
        public _glTFTechnique: gltf.Technique = null!;
        /**
         * 请使用 `egret3d.Material.create()` 创建实例。
         * @see egret3d.Material.create()
         * @deprecated
         */
        public constructor(shader?: Shader | string)
        public constructor(config: GLTF, name: string)
        public constructor(shaderOrConfig?: Shader | string | GLTF, name?: string) {
            super(name);

            if (!shaderOrConfig) {
                this._reset(DefaultShaders.MESH_BASIC);
            }
            else if (typeof shaderOrConfig === "string") {
                const shader = paper.Asset.find<Shader>(shaderOrConfig);
                if (!shader) {
                    console.error("Cannot find shader.", shaderOrConfig);
                }

                this._reset(shader || DefaultShaders.MESH_BASIC);
            }
            else {
                this._reset(shaderOrConfig);
            }
        }

        private _reset(shaderOrConfig: Shader | GLTF) {
            let glTFMaterial: GLTFMaterial;

            if (shaderOrConfig instanceof Shader) {
                this.config = GLTFAsset.createGLTFExtensionsConfig(); // TODO
                //
                glTFMaterial = this.config.materials![0] = {
                    extensions: {
                        KHR_techniques_webgl: { technique: shaderOrConfig.name, values: {} },
                        paper: { renderQueue: shaderOrConfig._renderQueue || this.renderQueue }
                    }
                };
                //
                this._shader = shaderOrConfig;
            }
            else {
                this.config = shaderOrConfig;
                //
                glTFMaterial = this.config.materials![0] as GLTFMaterial;
                //
                const shaderName = glTFMaterial.extensions.KHR_techniques_webgl.technique;
                const shader = paper.Asset.find<Shader>(shaderName);
                if (!shader) {
                    console.error("Cannot find shader.", shaderName);
                }

                this._shader = shader || DefaultShaders.MESH_BASIC;
            }

            this.renderQueue = glTFMaterial.extensions.paper.renderQueue;
            //
            this._glTFTechnique = GLTFAsset.createTechnique(this._shader.config.extensions.KHR_techniques_webgl!.techniques[0]);
            //
            const uniformValues = glTFMaterial.extensions.KHR_techniques_webgl.values!;
            const uniforms = this._glTFTechnique.uniforms;
            //使用Shader替换Material中没有默认值的Uniform
            for (const k in uniformValues) {
                if (k in uniforms) {
                    const value = uniformValues[k];

                    if (Array.isArray(value)) {
                        uniforms[k].value = value.concat();
                    }
                    else {
                        uniforms[k].value = value;
                    }
                }
            }

            if (glTFMaterial.extensions.paper.states) {
                this._glTFTechnique.states = glTFMaterial.extensions.paper.states; // TODO
            }
            else if (this._shader._states) {
                this._glTFTechnique.states = GLTFAsset.copyTechniqueStates(this._shader._states);
            }

            if (glTFMaterial.extensions.paper.defines) {
                for (const define of glTFMaterial.extensions.paper.defines) {
                    this.addDefine(define);
                }
            }
            else if (this._shader._defines) {
                for (const define of this._shader._defines) {
                    this.addDefine(define);
                }
            }
        }

        public dispose(disposeChildren?: boolean) {
            if (!super.dispose()) {
                return false;
            }

            if (disposeChildren) {
                for (const texture of this._textures) {
                    texture.dispose();
                }
            }

            this._version++;
            this._cacheDefines = "";
            this._defines.length = 0;
            this._textures.length = 0;
            this._glTFTechnique = null!;
            this._shader = null!;

            return true;
        }

        public copy(value: Material) {
            this.renderQueue = value.renderQueue;

            const sourceUniforms = value._glTFTechnique.uniforms;
            const targetUniforms = this._glTFTechnique.uniforms;

            for (const k in sourceUniforms) {
                const uniform = sourceUniforms[k];
                const value = Array.isArray(uniform.value) ? uniform.value.concat() : uniform.value; // TODO TypeArray
                targetUniforms[k] = { type: uniform.type, semantic: uniform.semantic, value };
            }

            const sourceStates = value._glTFTechnique.states!;
            const targetStates = this._glTFTechnique.states!;

            if (sourceStates.enable) {
                targetStates.enable = sourceStates.enable.concat();
            }

            if (sourceStates.functions) {
                if (!targetStates.functions) {
                    targetStates.functions = {};
                }

                for (const k in sourceStates.functions) {
                    if (Array.isArray(sourceStates.functions[k])) {
                        targetStates.functions[k] = sourceStates.functions[k].concat();
                    }
                    else {
                        targetStates.functions[k] = sourceStates.functions[k];
                    }
                }
            }

            return this;
        }
        /**
         * 克隆材质资源。
         */
        public clone(): Material {
            return new Material(this._shader).copy(this);
        }

        public addDefine(key: string) {
            if (this._defines.indexOf(key) < 0) {
                this._defines.push(key);
                this._defines.sort();
                this._version++;
            }

            return this;
        }

        public removeDefine(key: string) {
            const delIndex = this._defines.indexOf(key);
            if (delIndex >= 0) {
                this._defines.splice(delIndex, 1);
                this._version++;
            }

            return this;
        }

        setBoolean(id: string, value: boolean) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value !== value) {
                    uniform.value = value;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setInt(id: string, value: number) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value !== value) {
                    uniform.value = value;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setIntv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setFloat(id: string, value: number) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value !== value) {
                    uniform.value = value;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setFloatv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector2(id: string, value: Readonly<IVector2>) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value[0] !== value.x || uniform.value[1] !== value.y) {
                    uniform.value[0] = value.x;
                    uniform.value[1] = value.y;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector2v(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector3(id: string, value: Readonly<IVector3>) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value[0] !== value.x || uniform.value[1] !== value.y || uniform.value[2] !== value.z) {
                    uniform.value[0] = value.x;
                    uniform.value[1] = value.y;
                    uniform.value[2] = value.z;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector3v(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector4(id: string, value: Readonly<IVector4>) {
            //兼容老键值
            if (id === "_MainTex_ST" && this._glTFTechnique.uniforms["uvTransform"]) {
                id = "uvTransform";
                console.warn("已废弃的键值_MainTex_ST，建议改为:uvTransform-Matrix3");
                this._glTFTechnique.uniforms[id].value = [value.x, 0, 0, 0, value.y, 0, value.z, value.w, 1];
                return;
            }
            else if ((id === "_MainColor" || id === "_Color") && this._glTFTechnique.uniforms["diffuse"]) {
                id = "diffuse";
                console.warn("已废弃的键值_MainColor、_Color，建议改为:diffuse-Vector3");
                this._glTFTechnique.uniforms[id].value = [value.x, value.y, value.z];
                return;
            }

            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value[0] !== value.x || uniform.value[1] !== value.y || uniform.value[2] !== value.z || uniform.value[3] !== value.w) {
                    uniform.value[0] = value.x;
                    uniform.value[1] = value.y;
                    uniform.value[2] = value.z;
                    uniform.value[3] = value.w;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector4v(id: string, value: Float32Array | [number, number, number, number]) {
            //兼容老键值
            if (id === "_MainTex_ST" && this._glTFTechnique.uniforms["uvTransform"]) {
                id = "uvTransform";
                console.warn("已废弃的键值_MainTex_ST，建议改为:uvTransform-Matrix3");
                this._glTFTechnique.uniforms[id].value = [value[0], 0, 0, 0, value[1], 0, value[2], value[3], 1];;
                return;
            }
            else if ((id === "_MainColor" || id === "_Color") && this._glTFTechnique.uniforms["diffuse"]) {
                id = "diffuse";
                console.warn("已废弃的键值_MainColor、_Color，建议改为:diffuse-Vector3");
                this._glTFTechnique.uniforms[id].value = [value[0], value[1], value[2]];
                return;
            }
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setMatrix(id: string, value: Readonly<Matrix4>) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setMatrixv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setTexture(id: string, value: egret3d.Texture) {
            value = value || egret3d.DefaultTextures.WHITE;
            //兼容老键值
            if (id === "_MainTex" && this._glTFTechnique.uniforms["map"]) {
                id = "map";
                console.warn("已废弃的键值_MainTex，建议改为:map");
            }
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value) {
                    let index = this._textures.indexOf(uniform.value);
                    if (index > -1) {
                        this._textures.splice(index, 1);
                    }
                }
                if (uniform.value !== value) {
                    uniform.value = value;
                    this._version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            if (value) {
                this._textures.push(value);
            }

            return this;
        }
        /**
         * 
         * @param blend 
         */
        public setBlend(blend: gltf.BlendMode) {
            if (!this._glTFTechnique.states) {
                this._glTFTechnique.states = { enable: [], functions: {} };
            }

            const enables = this._glTFTechnique.states.enable!;
            const functions = this._glTFTechnique.states.functions!;

            switch (blend) {
                case gltf.BlendMode.Add:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE];
                    break;

                case gltf.BlendMode.Add_PreMultiply:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE];
                    break;

                case gltf.BlendMode.Blend:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA];
                    break;

                case gltf.BlendMode.Blend_PreMultiply:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA];
                    break;

                default:
                    delete functions.blendEquationSeparate;
                    delete functions.blendFuncSeparate;
                    break;
            }

            const index = enables.indexOf(gltf.EnableState.BLEND);
            if (blend === gltf.BlendMode.None) {
                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }
            else {
                if (index < 0) {
                    enables.push(gltf.EnableState.BLEND);
                }
            }

            return this;
        }
        /**
         * 
         */
        public setCullFace(cull: boolean, frontFace?: gltf.FrontFace, cullFace?: gltf.CullFace) {
            if (!this._glTFTechnique.states) {
                this._glTFTechnique.states = { enable: [], functions: {} };
            }

            const enables = this._glTFTechnique.states.enable!;
            const functions = this._glTFTechnique.states.functions!;
            const index = enables.indexOf(gltf.EnableState.CULL_FACE);
            if (cull && frontFace && cullFace) {
                functions.frontFace = [frontFace];
                functions.cullFace = [cullFace];
                if (index < 0) {
                    enables.push(gltf.EnableState.CULL_FACE);
                }
            }
            else {
                delete functions.frontFace;
                delete functions.cullFace;

                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }

            return this;
        }
        /**
         * 
         */
        public setDepth(zTest: boolean, zWrite: boolean) {
            if (!this._glTFTechnique.states) {
                this._glTFTechnique.states = { enable: [], functions: {} };
            }

            const enables = this._glTFTechnique.states.enable!;
            const functions = this._glTFTechnique.states.functions!;
            const index = enables.indexOf(gltf.EnableState.DEPTH_TEST);

            if (zTest) {
                if (index < 0) {
                    enables.push(gltf.EnableState.DEPTH_TEST);
                }

                functions.depthFunc = [gltf.DepthFunc.LEQUAL];
            }
            else {
                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }

            if (zWrite) {
                functions.depthMask = [true];
            }
            else {
                functions.depthMask = [false];
            }

            return this;
        }
        /**
         * 
         */
        public clearStates() {
            if (this._glTFTechnique.states) {
                // const enables = this._glTFTechnique.states.enable!;
                // const functions = this._glTFTechnique.states.functions!;
                // enables.length = 0;

                // for (const k in functions) {
                //     delete functions[k];
                // }

                delete this._glTFTechnique.states;
            }

            return this;
        }
        /**
         * TODO
         * @internal
         */
        public get shaderDefine(): string {
            this._cacheDefines = "";
            for (const key of this._defines) {
                this._cacheDefines += "#define " + key + " \n";
            }

            return this._cacheDefines;
        }

        public get shader() {
            return this._shader;
        }
        public set shader(value: Shader) {
            if (!value) {
                console.warn("Set shader error.");
                value = egret3d.DefaultShaders.MESH_BASIC;
            }

            if (this._shader === value) {
                return;
            }

            this._reset(value);
        }

        public get glTFTechnique() {
            return this._glTFTechnique;
        }
    }
}
