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

    /**
    * 材质资源
    */
    export class Material extends paper.BaseObject {
        @paper.serializedField
        private _glTFMaterialIndex: number = 0;
        @paper.serializedField
        private _glTFAsset: GLTFAsset = null as any;
        private _cacheDefines: string = '';
        private _textureRef: Texture[] = [];//TODO
        private readonly _defines: Array<string> = new Array();
        public _glTFMaterial: GLTFMaterial = null as any;
        /**
        * @internal
        */
        public _glTFTechnique: gltf.Technique = null as any;
        /**
         * @internal
         */
        public _glTFShader: GLTFAsset = null as any;
        /**
          * @internal
          */
        public id: number = _hashCode++;

        public version: number = 0;

        public constructor();
        public constructor(shader: GLTFAsset);
        public constructor(gltfAsset: GLTFAsset, gltfMaterialIndex: number);
        public constructor(...args: any[]) {
            super();

            if (args.length === 0) {
                return;
            }

            if (args.length === 1) {
                this._glTFShader = args[0];
                this._glTFMaterialIndex = 0;
                this._glTFAsset = GLTFAsset.createGLTFExtensionsAsset();
                const newGLTFMat: GLTFMaterial = { extensions: { KHR_techniques_webgl: { technique: this._glTFShader.name, values: {} }, paper: { renderQueue: -1 } } };
                this._glTFAsset.config.materials = [newGLTFMat];
            }
            else if (args.length === 2) {
                this._glTFAsset = args[0];
                this._glTFMaterialIndex = args[1];
            }


            this.initialize();
        }

        /**
         * 释放资源。
         */
        public dispose() {

            this._glTFMaterialIndex = 0;
            this._glTFAsset = null;
            this._glTFMaterial = null;
            this._glTFTechnique = null;
            this._glTFShader = null;

            this._cacheDefines = "";
            this._defines.length = 0;

            for (const tex of this._textureRef) {
                tex.dispose();
            }

            this._textureRef.length = 0;

            this.version++;
        }

        /**
         * 克隆材质资源。
         */
        public clone(): Material {
            const mat: Material = new Material(this._glTFShader);

            mat._glTFMaterial.extensions.paper.renderQueue = this._glTFMaterial.extensions.paper.renderQueue;
            // for (const key in this._gltfUnifromMap) {
            //     const value = Array.isArray(this._gltfUnifromMap[key]) ? this._gltfUnifromMap[key].concat() : this._gltfUnifromMap[key];
            //     mat._gltfUnifromMap[key] = value;
            // }
            //
            const unifroms = this._glTFTechnique.uniforms;
            const targetUniforms = mat._glTFTechnique.uniforms;
            for (const key in unifroms) {
                const uniform = unifroms[key];
                const value = Array.isArray(uniform.value) ? uniform.value.concat() : uniform.value;
                targetUniforms[key] = { type: uniform.type, semantic: uniform.semantic, value, extensions: { paper: { enable: false, location: -1 } } };
            }

            const states = this._glTFTechnique.states;
            const targetStates = mat._glTFTechnique.states;
            if (states.enable) {
                targetStates.enable = states.enable.concat();
            }

            for (const fun in states.functions) {
                if (Array.isArray(states.functions[fun])) {
                    targetStates.functions[fun] = states.functions[fun].concat();
                }
                else {
                    targetStates.functions[fun] = states.functions[fun];
                }
            }

            return mat;
        }


        public serialize() {
            if (!this._glTFAsset.name) {
                return null;
            }

            const target = paper.serializeStruct(this);
            target._gltfMaterialIndex = this._glTFMaterialIndex;
            target._glTFAsset = paper.createAssetReference(this._glTFAsset);

            return target;
        }

        public deserialize(element: any) {
            this._glTFMaterialIndex = element._glTFMaterialIndex;
            this._glTFAsset = paper.getDeserializedAssetOrComponent(element._glTFAsset) as GLTFAsset;

            this.initialize();

            return this;
        }

        public initialize() {
            const config = this._glTFAsset.config;
            if (
                !config.materials
            ) {
                console.error("Error glTF asset.");
                return;
            }
            //
            this._glTFMaterial = config.materials[this._glTFMaterialIndex];
            if (!this._glTFMaterial ||
                !this._glTFMaterial.extensions.KHR_techniques_webgl ||
                !this._glTFMaterial.extensions.KHR_techniques_webgl.technique) {
                console.error("Error glTF asset.");
            }
            if (!this._glTFShader) {
                //不存在，那就从材质中获取
                this._glTFShader = paper.Asset.find<GLTFAsset>(this._glTFMaterial.extensions.KHR_techniques_webgl.technique);
                if (!this._glTFShader) {
                    console.error("材质中获取着色器错误");
                }
            }
            if (!this._glTFShader.config ||
                !this._glTFShader.config.extensions ||
                !this._glTFShader.config.extensions.KHR_techniques_webgl ||
                this._glTFShader.config.extensions.KHR_techniques_webgl.techniques.length <= 0) {
                console.error("找不到着色器扩展KHR_techniques_webgl");
            }
            //
            const template = this._glTFShader.config.extensions.KHR_techniques_webgl.techniques[0];
            this._glTFTechnique = GLTFAsset.createTechnique(template);
            if (!this._glTFTechnique) {
                console.error("Error glTF asset.");
            }
            const gltfUnifromMap = this._glTFMaterial.extensions.KHR_techniques_webgl.values;
            const uniformMap = this._glTFTechnique.uniforms;
            //使用Shader替换Material中没有默认值的Uniform
            for (const key in gltfUnifromMap) {
                if (uniformMap[key]) {
                    const value = gltfUnifromMap[key];
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
                this.version++;
            }
        }

        removeDefine(key: string) {
            const delIndex = this._defines.indexOf(key);
            if (delIndex >= 0) {
                this._defines.splice(delIndex, 1);
                this.version++;
            }
        }
        setBoolean(id: string, value: boolean) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value !== value) {
                    uniform.value = value;
                    this.version++;
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
                    this.version++;
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
                this.version++;
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
                    this.version++;
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
                this.version++;
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
                    this.version++;
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
                this.version++;
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
                    this.version++;
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
                this.version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
        }

        setVector4(id: string, value: Vector4) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                if (uniform.value[0] !== value.x || uniform.value[1] !== value.y || uniform.value[2] !== value.z || uniform.value[3] !== value.w) {
                    uniform.value[0] = value.x;
                    uniform.value[1] = value.y;
                    uniform.value[2] = value.z;
                    uniform.value[3] = value.w;
                    this.version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
        }

        setVector4v(id: string, value: Float32Array | [number, number, number, number]) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this.version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
        }

        setMatrix(id: string, value: Matrix) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
                this.version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
        }

        setMatrixv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
                this.version++;
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }
        }

        setTexture(id: string, value: egret3d.Texture) {
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
                    this.version++;
                }
            }
            else {
                console.warn("尝试设置不存在的Uniform值:" + id);
            }

            if (value) {
                this._textureRef.push(value);
            }
        }

        public get shader() {
            return this._glTFShader;
        }

        public set renderQueue(value: RenderQueue) {
            this._glTFMaterial.extensions.paper.renderQueue = value;
        }

        public get renderQueue(): RenderQueue {
            const renderQueue = this._glTFMaterial.extensions.paper.renderQueue;

            return renderQueue === -1 ? this._glTFShader.config.extensions.paper.renderQueue : renderQueue;
        }

        public get shaderDefine(): string {
            this._cacheDefines = "";
            for (const key of this._defines) {
                this._cacheDefines += "#define " + key + " \n";
            }
            return this._cacheDefines;
        }
    }
}
