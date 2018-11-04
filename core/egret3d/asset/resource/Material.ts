namespace egret3d {
    //TODO 运行时DrawCall排序优化使用
    let _hashCode: number = 0;
    /**
     * 材质资源。
     */
    export class Material extends GLTFAsset {
        /**
         * 创建一个材质实例。
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
        /**
          * @internal
          */
        private readonly _defines: Array<string> = [];
        private readonly _textures: Texture[] = []; // TODO
        /**
         * @internal
         */
        public _shader: Shader = null!;
        /**
        * @internal
        */
        public _glTFTechnique: gltf.Technique = null!;
        /**
         * 请使用 `Material.create()` 创建实例。
         * @see Material.create()
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

                if (!shader && DEBUG) {
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
            else {
                //默认状态
                this.setDepth(true, true);
                this.setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this.setRenderQueue(paper.RenderQueue.Geometry);
            }

            const materialDefines = glTFMaterial.extensions.paper.defines;

            if (materialDefines && materialDefines.length > 0) {
                for (const define of materialDefines) {
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

        /**
         * 拷贝。
         */
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

            //
            for (const define of value._defines) {
                this.addDefine(define);
            }

            return this;
        }

        /**
         * 克隆。
         */
        public clone() {
            return new Material(this._shader).copy(this);
        }

        /**
         * 为该材质添加指定的 define。
         * @param value define 字符串。
         */
        public addDefine(value: string) {
            if (this._defines.indexOf(value) < 0) {
                this._defines.push(value);
                this._defines.sort();
                this._version++;
            }

            return this;
        }

        /**
         * 从该材质移除指定的 define。
         * @param value define 字符串。
         */
        public removeDefine(value: string) {
            const index = this._defines.indexOf(value);
            if (index >= 0) {
                this._defines.splice(index, 1);
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
            if (id === "_MainTex_ST" && this._glTFTechnique.uniforms[ShaderUniformName.UVTransform]) {
                id = ShaderUniformName.UVTransform;
                console.warn("已废弃的键值_MainTex_ST，建议改为:uvTransform-Matrix3");
                this._glTFTechnique.uniforms[id].value = [value.x, 0, 0, 0, value.y, 0, value.z, value.w, 1];
                return;
            }
            else if ((id === "_MainColor" || id === "_Color") && this._glTFTechnique.uniforms[ShaderUniformName.Diffuse]) {
                id = ShaderUniformName.Diffuse;
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
            if (id === "_MainTex_ST" && this._glTFTechnique.uniforms[ShaderUniformName.UVTransform]) {
                id = ShaderUniformName.UVTransform;
                console.warn("已废弃的键值_MainTex_ST，建议改为:uvTransform-Matrix3");
                this._glTFTechnique.uniforms[id].value = [value[0], 0, 0, 0, value[1], 0, value[2], value[3], 1];
                return;
            }
            else if ((id === "_MainColor" || id === "_Color") && this._glTFTechnique.uniforms[ShaderUniformName.Diffuse]) {
                id = ShaderUniformName.Diffuse;
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

        /**
         * 设置该材质的混合模式。
         * @param blend 混合模式。
         * @param renderQueue 渲染顺序。
         * @param opacity 透明度。
         */
        public setBlend(blend: gltf.BlendMode, renderQueue: paper.RenderQueue, opacity?: number) {
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

                case gltf.BlendMode.Subtractive:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR];
                    break;

                case gltf.BlendMode.Subtractive_PreMultiply:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA];
                    break;

                case gltf.BlendMode.Multiply:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR];
                    break;

                case gltf.BlendMode.Multiply_PreMultiply:
                    functions.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    functions.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_ALPHA];
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

            if (renderQueue) {  // 兼容
                this.renderQueue = renderQueue;
            }

            if (opacity !== undefined) {
                this.opacity = opacity;
            }

            return this;
        }

        /**
         * 设置该材质剔除面片的模式。
         * @param cullEnabled 是否开启剔除。
         * @param frontFace 正面的顶点顺序。
         * @param cullFace 剔除模式。
         */
        public setCullFace(cullEnabled: boolean, frontFace: gltf.FrontFace = gltf.FrontFace.CCW, cullFace: gltf.CullFace = gltf.CullFace.BACK) {
            if (!this._glTFTechnique.states) {
                this._glTFTechnique.states = { enable: [], functions: {} };
            }

            const enables = this._glTFTechnique.states.enable!;
            const functions = this._glTFTechnique.states.functions!;
            const index = enables.indexOf(gltf.EnableState.CULL_FACE);

            if (cullEnabled) {
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
         * 设置该材质的深度检测和深度缓冲。
         * @param depthTest 深度检测。
         * @param depthWrite 深度缓冲。
         */
        public setDepth(depthTest: boolean, depthWrite: boolean) {
            if (!this._glTFTechnique.states) {
                this._glTFTechnique.states = { enable: [], functions: {} };
            }

            const enables = this._glTFTechnique.states.enable!;
            const functions = this._glTFTechnique.states.functions!;
            const index = enables.indexOf(gltf.EnableState.DEPTH_TEST);

            if (depthTest) {
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

            if (depthWrite) {
                functions.depthMask = [true];
            }
            else {
                functions.depthMask = [false];
            }

            return this;
        }

        /**
         * 清除该材质的所有图形 API 状态。
         */
        public clearStates() {
            if (this._glTFTechnique.states) {
                delete this._glTFTechnique.states;
            }

            return this;
        }

        /**
         * 获取该材质的主颜色。
         * @param out 颜色。
         */
        public getColor(out?: Color): Color;
        /**
         * 获取该材质的指定颜色。
         * @param uniformName uniform 名称。
         * @param out 颜色。
         */
        public getColor(uniformName: string, out?: Color): Color;
        public getColor(p1?: string | Color, p2?: Color): Color {
            let uniformName: string;

            if (!p1) {
                uniformName = ShaderUniformName.Diffuse;
                p2 = Color.create();
            }
            else if (p1 instanceof Color) {
                uniformName = ShaderUniformName.Diffuse;
                p2 = p1;
            }
            else {
                uniformName = p1;
                if (!p2) {
                    p2 = Color.create();
                }
            }

            const uniform = this._glTFTechnique.uniforms[uniformName];

            if (uniform && uniform.value && Array.isArray(uniform.value)) {
                p2.r = uniform.value[0];
                p2.g = uniform.value[1];
                p2.b = uniform.value[2];
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            return p2;
        }

        /**
         * 设置该材质的主颜色。
         * @param value 颜色。
         */
        public setColor(value: Readonly<IColor>): this;
        /**
         * 设置该材质的指定颜色。
         * @param uniformName uniform 名称。
         * @param value 颜色。
         */
        public setColor(uniformName: string, value: Readonly<IColor>): this;
        public setColor(p1: Readonly<IColor> | string, p2?: Readonly<IColor>) {
            let uniformName: string;
            if (p1.hasOwnProperty("r")) {
                uniformName = ShaderUniformName.Diffuse;
                p2 = p1 as Readonly<IColor>;
            }
            else {
                uniformName = p1 as string;
            }

            this.setVector3(uniformName, Vector3.create(p2!.r, p2!.g, p2!.b).release());

            return this;
        }

        /**
         * 获取该材质的 UV 变换矩阵。
         * @param out 矩阵。
         */
        public getUVTransform(out?: Matrix3) {
            if (!out) {
                out = Matrix3.create();
            }

            const uniform = this._glTFTechnique.uniforms[ShaderUniformName.UVTransform];
            if (uniform && uniform.value && Array.isArray(uniform.value)) {
                out.fromArray(uniform.value);
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            return out;
        }

        /**
         * 设置该材质的 UV 变换矩阵。
         * @param out 矩阵。
         */
        public setUVTTransform(value: Readonly<Matrix3>) {
            const array = new Array(9); // TODO
            value.toArray(array);

            return this.setMatrixv(ShaderUniformName.UVTransform, array as any);
        }

        /**
         * 获取该材质的主贴图。
         */
        public getTexture(): Texture | null;
        /**
         * 获取该材质的指定贴图。
         * @param uniformName uniform 名称。
         */
        public getTexture(uniformName: string): Texture | null;
        public getTexture(uniformName?: string) {
            if (!uniformName) {
                uniformName = ShaderUniformName.Map;
            }

            const uniform = this._glTFTechnique.uniforms[uniformName];
            if (uniform) {
                return uniform.value || null; // TODO
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            return null;
        }

        /**
         * 设置该材质的主贴图。
         * @param value 贴图。 
         */
        public setTexture(value: Texture | null): this;
        /**
         * 设置该材质的指定贴图。
         * @param uniformName uniform 名称。
         * @param value 贴图。
         */
        public setTexture(uniformName: string, value: Texture | null): this;
        public setTexture(p1: Texture | null | string, p2?: Texture | null) {
            let uniformName: string;
            if (p1 === null || p1 instanceof Texture) {
                uniformName = ShaderUniformName.Map;
                p2 = p1 as Texture | null;
            }
            else {
                uniformName = p1;
            }

            if (!p2) {
                p2 = DefaultTextures.WHITE;
            }

            //兼容老键值
            if (uniformName === "_MainTex" && this._glTFTechnique.uniforms[ShaderUniformName.Map]) {
                uniformName = ShaderUniformName.Map;
                console.warn("已废弃的键值_MainTex，建议改为:map");
            }

            const uniform = this._glTFTechnique.uniforms[uniformName];
            if (uniform) {
                if (uniform.value) {
                    const index = this._textures.indexOf(uniform.value);
                    if (index > -1) {
                        this._textures.splice(index, 1);
                    }
                }

                if (uniform.value !== p2) {
                    uniform.value = p2;
                    this._version++;
                }
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            if (p2 instanceof BaseRenderTarget) {
                this.addDefine(ShaderDefine.FLIP_V);
            }

            if (p2) {
                this._textures.push(p2);
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

        /**
         * 该材质的透明度。
         */
        public get opacity() {
            const uniform = this._glTFTechnique.uniforms[ShaderUniformName.Opacity];
            if (uniform) {
                return (uniform.value !== uniform.value) ? 1.0 : uniform.value;
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            return 1.0;
        }
        public set opacity(value: number) {
            this.setFloat(ShaderUniformName.Opacity, value);
        }

        /**
         * 该材质的 shader。
         */
        public get shader() {
            return this._shader;
        }
        public set shader(value: Shader) {
            if (!value) {
                if (DEBUG) {
                    console.warn("Set shader error.");
                }

                value = DefaultShaders.MESH_BASIC;
            }

            if (this._shader === value) {
                return;
            }

            this._reset(value);
        }

        /**
         * 该材质的 glTF 渲染技术。
         */
        public get glTFTechnique() {
            return this._glTFTechnique;
        }

        /**
         * @deprecated
         */
        public setRenderQueue(value: number) {
            this.renderQueue = value;
            return this;
        }
        /**
         * @deprecated
         */
        public setOpacity(value: number) {
            return this.setFloat(ShaderUniformName.Opacity, value);
        }
        /**
         * @deprecated
         */
        public setShader(value: Shader) {
            if (!value) {
                if (DEBUG) {
                    console.warn("Set shader error.");
                }

                value = DefaultShaders.MESH_BASIC;
            }

            if (this._shader === value) {
                return;
            }

            this._reset(value);

            return this;
        }
    }
}
