namespace egret3d {
    /**
         * 渲染排序
         */
    export enum RenderQueue {
        Background = 1000,
        Geometry = 2000,
        AlphaTest = 2450,
        Transparent = 3000,
        Overlay = 4000
    }

    //TODO 运行时DrawCall排序优化使用
    let _hashCode: number = 0;
    //兼容老的Uniform键值
    let _compatible: { [key: string]: string } = { "_MainColor": "diffuse", "_MainTex": "map", "_MainTex_ST": "uvTransform" };

    /**
    * 材质资源
    */
    export class Material extends GLTFAsset {
        /**
         * 
         */
        public renderQueue: RenderQueue | number = -1;
        /**
          * @internal
          */
        public _id: number = _hashCode++;
        /**
          * @internal
          */
        public _version: number = 0;

        private _cacheDefines: string = '';
        private _textureRef: Texture[] = [];//TODO
        private readonly _defines: Array<string> = new Array();
        /**
        * @internal
        */
        public _glTFMaterial: GLTFMaterial | null = null;
        /**
        * @internal
        */
        public _glTFTechnique: gltf.Technique = null as any;
        /**
         * @internal
         */
        public _glTFShader: GLTFAsset = null as any;

        public constructor(shader: GLTFAsset) {
            super();

            if (shader) { // Custom.
                this._glTFShader = shader;

                this.config = GLTFAsset.createGLTFExtensionsConfig();
                this.config.materials![0] = {
                    extensions: {
                        KHR_techniques_webgl: { technique: this._glTFShader.name, values: {} },
                        paper: { renderQueue: -1 }
                    }
                } as GLTFMaterial;

                this.initialize();
            }
        }

        public dispose() {
            if (this._isBuiltin) {
                return;
            }

            this._glTFMaterial = null!;
            this._glTFTechnique = null!;
            this._glTFShader = null!;

            this._cacheDefines = "";
            this._defines.length = 0;

            for (const tex of this._textureRef) {
                tex.dispose();
            }

            this._textureRef.length = 0;

            this._version++;

            super.dispose();
        }

        /**
         * 克隆材质资源。
         */
        public clone(): Material {
            const mat: Material = new Material(this._glTFShader);

            mat.renderQueue = this.renderQueue;

            const sourceUnifroms = this._glTFTechnique.uniforms;
            const targetUniforms = mat._glTFTechnique.uniforms;
            for (const key in sourceUnifroms) {
                const uniform = sourceUnifroms[key];
                const value = Array.isArray(uniform.value) ? uniform.value.concat() : uniform.value;
                targetUniforms[key] = { type: uniform.type, semantic: uniform.semantic, value };
            }

            const sourceStates = this._glTFTechnique.states;
            const targetStates = mat._glTFTechnique.states;
            if (sourceStates.enable) {
                targetStates.enable = sourceStates.enable.concat();
            }

            if (sourceStates.functions) {
                if (!targetStates.functions) {
                    targetStates.functions = {};
                }
                for (const fun in sourceStates.functions) {
                    if (Array.isArray(sourceStates.functions[fun])) {
                        targetStates.functions[fun] = sourceStates.functions[fun].concat();
                    }
                    else {
                        targetStates.functions[fun] = sourceStates.functions[fun];
                    }
                }
            }

            return mat;
        }

        // public serialize() {
        //     if (!this._glTFAsset.name) {
        //         return null;
        //     }

        //     const target = paper.serializeStruct(this);
        //     target._gltfMaterialIndex = this._glTFMaterialIndex;
        //     target._glTFAsset = paper.serializeAsset(this._glTFAsset);

        //     return target;
        // }

        // public deserialize(element: any) {
        //     this._glTFMaterialIndex = element._glTFMaterialIndex;
        //     this._glTFAsset = paper.getDeserializedAssetOrComponent(element._glTFAsset) as GLTFAsset;

        //     this.initialize();

        //     return this;
        // }

        public initialize() {
            if (this._glTFMaterial) {
                return;
            }

            this._glTFMaterial = this.config.materials![0] as GLTFMaterial;

            if (!this._glTFShader) {
                //不存在，那就从材质中获取
                this._glTFShader = paper.Asset.find<GLTFAsset>(this._glTFMaterial.extensions.KHR_techniques_webgl.technique);
                if (!this._glTFShader) {
                    console.error("材质中获取着色器错误");
                    return;
                }
            }

            if (this._glTFMaterial.extensions.paper && this._glTFMaterial.extensions.paper.renderQueue !== -1) {
                this.renderQueue = this._glTFMaterial.extensions.paper.renderQueue!;
            }
            else {
                this.renderQueue = this._glTFShader.config.extensions.paper!.renderQueue!;
            }
            //
            const template = this._glTFShader.config.extensions.KHR_techniques_webgl!.techniques[0];
            this._glTFTechnique = GLTFAsset.createTechnique(template);

            const gltfUnifromMap = this._glTFMaterial.extensions.KHR_techniques_webgl.values!;
            const uniformMap = this._glTFTechnique.uniforms;
            //使用Shader替换Material中没有默认值的Uniform
            for (let key in gltfUnifromMap) {
                let value = gltfUnifromMap[key];
                if (key in _compatible) {
                    key = _compatible[key];
                    if (key === "diffuse") {
                        (value as any).length = 3;
                    }
                    else if (key === "uvTransform") {
                        const old = value.concat();
                        value = [old[0], 0, 0, 0, old[1], 0, old[2], old[3], 1];
                    }
                }
                if (uniformMap[key]) {
                    if (Array.isArray(value)) {
                        uniformMap[key].value = value.concat();
                    }
                    else {
                        uniformMap[key].value = value;
                    }
                }
            }
        }

        addDefine(key: string) {
            if (this._defines.indexOf(key) < 0) {
                this._defines.push(key);
                //减少同样的宏定义因为顺序不同重新编译
                this._defines.sort();
                this._version++;
            }
        }

        removeDefine(key: string) {
            const delIndex = this._defines.indexOf(key);
            if (delIndex >= 0) {
                this._defines.splice(delIndex, 1);
                this._version++;
            }
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
        }

        setVector2(id: string, value: Vector2) {
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
        }

        setVector3(id: string, value: Vector3) {
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
        }

        setVector4(id: string, value: Vector4) {
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
        }

        setMatrix(id: string, value: Matrix4) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
                this._version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
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
        }

        setTexture(id: string, value: egret3d.Texture) {
            value = value || egret3d.DefaultTextures.GRAY;
            //兼容老键值
            if (id === "_MainTex" && this._glTFTechnique.uniforms["map"]) {
                id = "map";
                console.warn("已废弃的键值_MainTex，建议改为:map");
            }
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value) {
                    let index = this._textureRef.indexOf(uniform.value);
                    if (index > -1) {
                        this._textureRef.splice(index, 1);
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
                this._textureRef.push(value);
            }
        }
        /**
         * @internal
         */
        public get shaderDefine(): string {
            this._cacheDefines = "";
            for (const key of this._defines) {
                this._cacheDefines += "#define " + key + " \n";
            }
            return this._cacheDefines;
        }
    }
}
