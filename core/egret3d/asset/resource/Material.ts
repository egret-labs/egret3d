namespace egret3d {
    //TODO 运行时DrawCall排序优化使用
    let _hashCode: uint = 0;
    const _uvTransformMatrix = Matrix3.create();
    /**
     * 
     */
    export const enum MaterialDirty {
        All = 0b1,
        None = 0b0,
        UVTransform = 0b1,
    }
    /**
     * 材质资源。
     */
    export class Material extends GLTFAsset {
        /**
         * 创建一个材质。
         * @param shader 指定一个着色器。（默认：DefaultShaders.MESH_BASIC）
         */
        public static create(shader?: Shader): Material;
        /**
         * 创建一个材质。
         * @param name 资源名称。
         * @param shader 指定一个着色器。
         */
        public static create(name: string, shader?: Shader): Material;
        /**
         * 加载一个材质。
         * @private
         */
        public static create(name: string, config: GLTF): Material;
        public static create(shaderOrName?: Shader | string, shaderOrConfig?: Shader | GLTF) {
            const hasName = typeof shaderOrName === "string";
            const name = (shaderOrName && hasName) ? shaderOrName as string : "";
            //
            if (shaderOrName === undefined) {
                shaderOrConfig = shaderOrConfig || DefaultShaders.MESH_BASIC;
            }
            else if (!hasName) {
                shaderOrConfig = shaderOrName as Shader || shaderOrConfig || DefaultShaders.MESH_BASIC;
            }
            //
            const material = new Material();
            material.initialize(name, null!, null);
            material._reset(shaderOrConfig!);

            return material;
        }
        /**
         * 该材质的渲染排序。
         */
        public renderQueue: RenderQueue | uint = RenderQueue.Geometry;
        /**
         * 
         */
        public readonly defines: Defines = new Defines();
        /**
         * @internal
         */
        public readonly _id: uint = _hashCode++;
        /**
         * @internal
         */
        public _dirty: MaterialDirty = MaterialDirty.None;
        private readonly _uvTransform: Array<number> = [0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
        /**
         * @internal
         */
        public _technique: gltf.Technique = null!;
        /**
         * @internal
         */
        public _shader: Shader = null!;

        private _createTechnique(shader: Shader, glTFMaterial: GLTFMaterial) {
            const { attributes: sourceAttributes, uniforms: sourceUniforms } = shader.config.extensions.KHR_techniques_webgl!.techniques[0];
            const materialUniformValues = glTFMaterial.extensions.KHR_techniques_webgl.values;
            const shaderDefines = shader._defines;
            const materialDefines = glTFMaterial.extensions.paper.defines;
            const technique: gltf.Technique = {
                attributes: {},
                uniforms: {},
            };
            // Remove redundant material uniform values.
            if (materialUniformValues) {
                for (const k in materialUniformValues) {
                    if (!(k in sourceUniforms)) {
                        delete materialUniformValues[k];
                    }
                }
            }
            // Copy attributes.
            for (const k in sourceAttributes) {
                const attribute = sourceAttributes[k];
                technique.attributes[k] = {
                    semantic: attribute.semantic,
                };
            }
            // Copy uniforms.
            for (const k in sourceUniforms) {
                const sourceUniform = sourceUniforms[k];
                const sourceValue = (materialUniformValues && (k in materialUniformValues)) ? materialUniformValues[k] : sourceUniform.value; // shader -> material -> technique.
                const type = sourceUniform.type;
                let value: any;

                if (type === gltf.UniformType.SAMPLER_2D || type === gltf.UniformType.SAMPLER_CUBE) {
                    if (sourceValue) {
                        value = paper.Asset.find<BaseTexture>(sourceValue) || DefaultTextures.WHITE; // Missing texture.
                    }
                    // else if (!value) {
                    //     value = DefaultTextures.WHITE; // 非法数据.
                    // }
                }
                else if (Array.isArray(sourceValue)) {
                    value = sourceValue ? sourceValue.concat() : []; // TODO
                }
                else {
                    value = sourceValue ? sourceValue : (sourceValue === 0 ? 0 : []); // TODO 不应是数组。
                    // value = sourceValue ? sourceValue : 0; //
                }

                const targetUniform = technique.uniforms[k] = { type, value } as gltf.Uniform;
                if (sourceUniform.semantic) {
                    targetUniform.semantic = sourceUniform.semantic;
                }
            }
            //
            if (glTFMaterial.extensions.paper.states) { // Link material states.
                const states = technique.states = glTFMaterial.extensions.paper.states; // TODO 如果编辑器编辑该值，最简单的方式是做关联。
                // TODO
                if (!states.enable) {
                    states!.enable = [];
                }

                if (!states.functions) {
                    states.functions = {};
                }
            }
            else {
                const shaderStates = shader._states || shader.config.extensions.KHR_techniques_webgl!.techniques[0].states;
                if (shaderStates) { // Copy shader states.
                    technique.states = {
                        enable: [],
                        functions: {},
                    };
                    Shader.copyStates(shaderStates, technique.states);
                }
                else { // Create default states.
                    technique.states = Shader.createDefaultStates();
                }
            }
            //
            if (technique.states!.enable!.indexOf(gltf.EnableState.CullFace) >= 0) {
                const frontFaceValue = technique.states.functions!.frontFace;
                const cullFaceValue = technique.states.functions!.cullFace;
                const frontFace = frontFaceValue && frontFaceValue.length > 0 ? frontFaceValue[0] : gltf.FrontFace.CCW;
                const cullFace = cullFaceValue && cullFaceValue.length > 0 ? cullFaceValue[0] : gltf.CullFace.Back;

                this.defines.removeDefine(ShaderDefine.DOUBLE_SIDED);

                if (frontFace !== gltf.FrontFace.CCW || cullFace !== gltf.CullFace.Back) {
                    this.defines.addDefine(ShaderDefine.FLIP_SIDED);
                }
                else {
                    this.defines.removeDefine(ShaderDefine.FLIP_SIDED);
                }
            }
            else {
                this.defines.removeDefine(ShaderDefine.FLIP_SIDED);
                this.defines.addDefine(ShaderDefine.DOUBLE_SIDED);
            }

            // Copy defines.
            if (materialDefines) {
                for (const define of materialDefines) {
                    this.defines.addDefine(define);
                }
            }
            //TODO 兼容以前的
            if (shaderDefines) {
                for (const define of shaderDefines) {
                    this.defines.addDefine(define);
                }
            }

            return technique;
        }

        private _reset(shaderOrConfig: Shader | GLTF) {
            let glTFMaterial: GLTFMaterial;
            let shader: Shader | null = null;
            //
            if (shaderOrConfig instanceof Shader) {
                if (this.config) { // Change shader.
                    this._retainOrReleaseTextures(false, false);
                    this._addOrRemoveTexturesDefine(false);
                    glTFMaterial = this.config.materials![0] as GLTFMaterial;
                }
                else { // Create.
                    const config = (this.config as GLTF) = Material.createConfig();
                    glTFMaterial = {
                        extensions: {
                            KHR_techniques_webgl: { technique: shaderOrConfig.name },
                            paper: { renderQueue: shaderOrConfig._renderQueue ? shaderOrConfig._renderQueue : RenderQueue.Geometry }
                        }
                    };
                    config.materials = [glTFMaterial];
                }

                shader = shaderOrConfig;
            }
            else { // Load.
                const config = (this.config as GLTF) = shaderOrConfig;
                glTFMaterial = config.materials![0] as GLTFMaterial;
                shader = paper.Asset.find<Shader>(glTFMaterial.extensions.KHR_techniques_webgl.technique) || DefaultShaders.MESH_BASIC;
            }
            //
            this.renderQueue = glTFMaterial.extensions.paper.renderQueue;
            this._technique = this._createTechnique(shader, glTFMaterial);
            this._shader = shader;
            this._retainOrReleaseTextures(true, false);
            this._addOrRemoveTexturesDefine(true);
        }

        private _retainOrReleaseTextures(isRatain: boolean, isOnce: boolean) {
            const uniforms = this._technique.uniforms;
            for (const k in uniforms) {
                const uniform = uniforms[k];
                if (
                    uniform.value &&
                    (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE)
                ) {
                    if (isOnce) {
                        isRatain ? (uniform.value as BaseTexture).retain() : (uniform.value as BaseTexture).release();
                    }
                    else {
                        let i = this.referenceCount;
                        while (i--) {
                            isRatain ? (uniform.value as BaseTexture).retain() : (uniform.value as BaseTexture).release();
                        }
                    }
                }
            }

            // isRatain ? this._shader.retain() : this._shader.release(); TODO
        }

        private _addOrRemoveTexturesDefine(add: boolean = true) {
            const uniforms = this._technique.uniforms;
            for (const k in uniforms) {
                const uniform = uniforms[k];
                if (uniform.value &&
                    (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE)
                ) {
                    const texture = (uniform.value as BaseTexture);
                    renderState._updateTextureDefines(k, add ? texture : null, this.defines);
                }
            }
        }
        /**
         * @internal
         */
        public _update() {
            if (this._dirty & MaterialDirty.UVTransform) {
                this.setUVTransform(_uvTransformMatrix.fromUVTransform.apply(_uvTransformMatrix, this._uvTransform as any));
                this._dirty &= ~MaterialDirty.UVTransform;
            }
        }

        public initialize(
            name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null,
            ...args: Array<any>
        ) {
            super.initialize(name, config, buffers, args);

            RenderState.onGammaInputChanged.add(this._addOrRemoveTexturesDefine, this);
        }

        public retain(): this {
            super.retain();

            this._retainOrReleaseTextures(true, true);

            return this;
        }

        public release(): this {
            super.release();

            if (this._referenceCount >= 0) {
                this._retainOrReleaseTextures(false, true);
            }

            return this;
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this._retainOrReleaseTextures(false, false);
            //
            this.defines.clear();
            this._technique = null!;
            this._shader = null!;

            RenderState.onGammaInputChanged.remove(this._addOrRemoveTexturesDefine, this);

            return true;
        }
        /**
         * 拷贝。
         */
        public copy(value: Material): this {
            this._retainOrReleaseTextures(false, false);
            //
            this.renderQueue = value.renderQueue;
            this._shader = value._shader;
            this.defines.copy(value.defines);
            // Copy uniforms.
            const sourceUniforms = value._technique.uniforms;
            const targetUniforms = this._technique.uniforms = {} as { [k: string]: gltf.Uniform };

            for (const k in sourceUniforms) {
                const uniform = sourceUniforms[k];
                const uniformValue = uniform.value;

                targetUniforms[k] = {
                    type: uniform.type,
                    semantic: uniform.semantic,
                    value: Array.isArray(uniformValue) ? uniformValue.concat() : uniformValue, // TODO TypeArray
                };
            }
            // Copy states and functions.
            const sourceStates = value._technique.states!;
            const targetStates = this._technique.states!;
            targetStates.enable = sourceStates.enable!.concat();

            for (const k in sourceStates.functions!) {
                const stateFunction = sourceStates.functions![k];
                targetStates.functions![k] = Array.isArray(stateFunction) ? stateFunction.concat() : stateFunction;
            }
            //
            this._retainOrReleaseTextures(true, false);

            return this;
        }
        /**
         * 克隆该材质。
         */
        public clone(): this {
            return Material.create(this._shader).copy(this) as this;
        }

        public readonly needUpdate = (dirty: MaterialDirty) => {
            this._dirty |= dirty;
        }

        setBoolean(id: string, value: boolean) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setInt(id: string, value: int) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setIntv(id: string, value: Float32Array | ReadonlyArray<int>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setFloat(id: string, value: number) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setFloatv(id: string, value: Float32Array | ReadonlyArray<number>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector2(id: string, value: Readonly<IVector2>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value[0] = value.x;
                uniform.value[1] = value.y;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector2v(id: string, value: Float32Array | ReadonlyArray<number>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector3(id: string, value: Readonly<IVector3>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value[0] = value.x;
                uniform.value[1] = value.y;
                uniform.value[2] = value.z;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector3v(id: string, value: Float32Array | ReadonlyArray<number>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector4(id: string, value: Readonly<IVector4>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value[0] = value.x;
                uniform.value[1] = value.y;
                uniform.value[2] = value.z;
                uniform.value[3] = value.w;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setVector4v(id: string, value: Float32Array | ReadonlyArray<number>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setMatrix(id: string, value: Readonly<Matrix4>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }

        setMatrixv(id: string, value: Float32Array | ReadonlyArray<number>) {
            const uniform = this._technique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            return this;
        }
        /**
         * 为该材质添加指定的 define。
         * @param defineString define 字符串。
         */
        public addDefine(defineString: string, value?: number): this {
            this.defines.addDefine(defineString, value);

            return this;
        }
        /**
         * 从该材质移除指定的 define。
         * @param defineString define 字符串。
         */
        public removeDefine(defineString: string, value?: number): this {
            if (value !== undefined) {
                defineString += " " + value;
            }
            this.defines.removeDefine(defineString);

            return this;
        }
        /**
         * 设置该材质的混合模式。
         * @param blend 混合模式。
         * @param renderQueue 渲染顺序。
         * @param opacity 透明度。（未设置则不更改透明度）
         */
        public setBlend(blend: BlendMode, renderQueue: RenderQueue, opacity?: number): this;
        /**
         * @param blendEquations BlendEquation。
         * @param blendFactors BlendFactor。
         * @param renderQueue 渲染顺序。
         * @param opacity 透明度。（未设置则不更改透明度）
         */
        public setBlend(blendEquations: gltf.BlendEquation[], blendFactors: gltf.BlendFactor[], renderQueue: RenderQueue, opacity?: number): this;
        public setBlend(p0: BlendMode | (gltf.BlendEquation[]), p1: RenderQueue | (gltf.BlendFactor[]), p2?: number | RenderQueue, p3?: number): this {
            const { enable, functions } = this._technique.states!;
            const blend = Array.isArray(p0) ? BlendMode.Custom : p0;
            let renderQueue: RenderQueue;
            let opacity: number | undefined = undefined;

            if (blend === BlendMode.Custom) {
                functions!.blendEquationSeparate = p0 as gltf.BlendEquation[];
                functions!.blendFuncSeparate = p1 as gltf.BlendFactor[];
                renderQueue = p2 as RenderQueue;
                opacity = p3;
            }
            else {
                switch (blend) {
                    case BlendMode.Additive:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE];
                        break;

                    case BlendMode.Additive_PreMultiply:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE];
                        break;

                    case BlendMode.Normal:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA];
                        break;

                    case BlendMode.Normal_PreMultiply:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA];
                        break;

                    case BlendMode.Subtractive:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR];
                        break;

                    case BlendMode.Subtractive_PreMultiply:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.ZERO, gltf.BlendFactor.ONE_MINUS_SRC_COLOR, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA];
                        break;

                    case BlendMode.Multiply:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR];
                        break;

                    case BlendMode.Multiply_PreMultiply:
                        functions!.blendEquationSeparate = [gltf.BlendEquation.Add, gltf.BlendEquation.Add];
                        functions!.blendFuncSeparate = [gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_COLOR, gltf.BlendFactor.ZERO, gltf.BlendFactor.SRC_ALPHA];
                        break;

                    default:
                        delete functions!.blendEquationSeparate;
                        delete functions!.blendFuncSeparate;
                        break;
                }

                renderQueue = p1 as RenderQueue;
                opacity = p2;
            }

            const index = enable!.indexOf(gltf.EnableState.Blend);

            if (blend === BlendMode.None) {
                if (index >= 0) {
                    enable!.splice(index, 1);
                }
                //
                functions!.depthMask = [true];
            }
            else {
                if (index < 0) {
                    enable!.push(gltf.EnableState.Blend);
                }
                //
                functions!.depthMask = [false];
            }

            if (renderQueue) { // 兼容
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
        public setCullFace(cullEnabled: boolean, frontFace: gltf.FrontFace = gltf.FrontFace.CCW, cullFace: gltf.CullFace = gltf.CullFace.Back): this {
            const { enable, functions } = this._technique.states!;
            const index = enable!.indexOf(gltf.EnableState.CullFace);

            if (cullEnabled) {
                if (index < 0) {
                    enable!.push(gltf.EnableState.CullFace);
                }

                functions!.frontFace = [frontFace];
                functions!.cullFace = [cullFace];

                this.defines.removeDefine(ShaderDefine.DOUBLE_SIDED);

                if (frontFace !== gltf.FrontFace.CCW || cullFace !== gltf.CullFace.Back) {
                    this.defines.addDefine(ShaderDefine.FLIP_SIDED);
                }
                else {
                    this.defines.removeDefine(ShaderDefine.FLIP_SIDED);
                }
            }
            else if (index >= 0) {
                enable!.splice(index, 1);
                delete functions!.frontFace;
                delete functions!.cullFace;

                this.defines.removeDefine(ShaderDefine.FLIP_SIDED);
                this.defines.addDefine(ShaderDefine.DOUBLE_SIDED);
            }

            return this;
        }
        /**
         * 设置该材质的深度检测和深度缓冲。
         * @param depthTest 深度检测。
         * @param depthWrite 深度缓冲。
         */
        public setDepth(depthTest: boolean, depthWrite: boolean) {
            const { enable, functions } = this._technique.states!;
            const index = enable!.indexOf(gltf.EnableState.DepthTest);

            if (depthTest) {
                if (index < 0) {
                    enable!.push(gltf.EnableState.DepthTest);
                    functions!.depthFunc = [gltf.DepthFunc.Lequal];
                }
            }
            else if (index >= 0) {
                enable!.splice(index, 1);
                delete functions!.depthFunc;
            }

            if (depthWrite) {
                functions!.depthMask = [true];
            }
            else {
                functions!.depthMask = [false];
            }

            return this;
        }
        /**
         * 
         */
        public setStencil(value: boolean): this {
            const { enable } = this._technique.states!;

            const index = enable!.indexOf(gltf.EnableState.StencilTest);

            if (value) {
                if (index < 0) {
                    enable!.push(gltf.EnableState.StencilTest);
                }
            }
            else if (index >= 0) {
                enable!.splice(index);
            }

            return this;
        }
        /**
         * TODO
         * @private
         */
        public clearStates(): this {
            const { enable, functions } = this._technique.states!;
            enable!.length = 0;

            for (const k in functions!) {
                delete functions![k];
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

            const uniform = this._technique.uniforms[uniformName];

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
        public setColor(value: Readonly<IColor> | uint): this;
        /**
         * 设置该材质的主颜色。
         * @param uniformName uniform 名称。
         * @param value 颜色。
         */
        public setColor(uniformName: string, value: Readonly<IColor> | uint): this;
        public setColor(p1: Readonly<IColor> | uint | string, p2?: Readonly<IColor> | uint) {
            if (typeof p1 !== "string") {
                p2 = p1 as Readonly<IColor> | uint;
                p1 = ShaderUniformName.Diffuse;
            }

            if (typeof p2 === "number") {
                const color = Color.create().fromHex(p2).release();
                this.setVector3(p1, Vector3.create(color.r, color.g, color.b).release());
            }
            else {
                this.setVector3(p1, Vector3.create(p2!.r, p2!.g, p2!.b).release());
            }

            return this;
        }
        /**
         * 获取该材质的 UV 变换矩阵。
         * @param out 矩阵。
         */
        public getUVTransform(out?: Matrix3): Matrix3 {
            if (!out) {
                out = Matrix3.create();
            }

            const uniform = this._technique.uniforms[ShaderUniformName.UVTransform];
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
         * @param matrix 矩阵。
         */
        public setUVTransform(matrix: Readonly<Matrix3>): this {
            const uniform = this._technique.uniforms[ShaderUniformName.UVTransform];

            if (uniform) {
                const array = (uniform.value && Array.isArray(uniform.value)) ? uniform.value : new Array(9);
                matrix.toArray(array);
                this.setMatrixv(ShaderUniformName.UVTransform, array as any);
            }
            else if (DEBUG) {
                console.error("Invalid glTF technique uniform.");
            }

            return this;
        }
        /**
         * 获取该材质的主贴图。
         */
        public getTexture(): BaseTexture | null;
        /**
         * 获取该材质的指定贴图。
         * @param uniformName uniform 名称。
         */
        public getTexture(uniformName: string): BaseTexture | null;
        public getTexture(uniformName?: string) {
            if (!uniformName) {
                uniformName = ShaderUniformName.Map;
            }

            const uniform = this._technique.uniforms[uniformName];
            if (uniform) {
                return uniform.value || null; // TODO
            }
            else {
                console.error("Invalid glTF technique uniform.", uniformName);
            }

            return null;
        }
        /**
         * 设置该材质的主贴图。
         * @param texture 贴图纹理。 
         */
        public setTexture(texture: BaseTexture | null): this;
        /**
         * 设置该材质的指定贴图。
         * @param uniformName uniform 名称。
         * @param texture 贴图纹理。
         */
        public setTexture(uniformName: string, texture: BaseTexture | null): this;
        public setTexture(p1: BaseTexture | null | string, p2?: BaseTexture | null) {
            if (p1 === null || p1 instanceof BaseTexture) {
                p2 = p1 as BaseTexture | null;
                p1 = ShaderUniformName.Map;
            }

            // if (!p2) { // null to white.
            //     p2 = DefaultTextures.WHITE;
            // }

            const uniform = this._technique.uniforms[p1];
            if (uniform) {
                if (uniform.value !== p2) {

                    const existingTexture = uniform.value as BaseTexture | null;
                    if (existingTexture) {
                        let i = this.referenceCount;
                        while (i--) {
                            existingTexture.release();
                        }

                        renderState._updateTextureDefines(p1, null, this.defines);
                    }

                    if (p2) {
                        let i = this.referenceCount;
                        while (i--) {
                            p2.retain();
                        }

                        renderState._updateTextureDefines(p1, p2, this.defines);
                    }

                    uniform.value = p2;
                }
            }
            else {
                console.error("Invalid glTF technique uniform.", p1);
            }

            return this;
        }
        /**
         * 该材质的透明度。
         */
        public get opacity(): number {
            const uniformName = ShaderUniformName.Opacity;
            const uniform = this._technique.uniforms[uniformName];
            if (uniform) {
                const value = uniform.value;
                return (value !== value) ? 1.0 : value;
            }
            else {
                console.error("Invalid glTF technique uniform.", uniformName);
            }

            return 1.0;
        }
        public set opacity(value: number) {
            this.setFloat(ShaderUniformName.Opacity, value);
        }
        /**
         * 该材质的 shader。
         */
        public get shader(): Shader {
            return this._shader;
        }
        public set shader(value: Shader) {
            if (!value) {
                console.error("Set shader error.");
                value = DefaultShaders.MESH_BASIC;
            }

            if (this._shader === value) {
                return;
            }

            this._reset(value);
        }
        /**
         * 该材质的渲染技术。
         */
        public get technique(): gltf.Technique {
            return this._technique;
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
