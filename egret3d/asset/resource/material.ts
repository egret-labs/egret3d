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
    export class Material extends paper.SerializableObject {
        @paper.serializedField
        private _glTFMaterialIndex: number = 0;
        @paper.serializedField
        private _glTFAsset: GLTFAsset = null as any;
        private _glTFMaterial: GLTFMaterial = null as any;
        private _cacheDefines: string = '';
        private _textureRef: Texture[] = [];//TODO
        private readonly _defines: Array<string> = new Array();
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
            }
            else if (args.length === 2) {
                this._glTFAsset = args[0];
                this._glTFMaterialIndex = args[1];

                const extensions = this._glTFAsset.config.extensions;
                if (!extensions ||
                    !extensions.paper) {
                    console.error("Error glTF asset.");
                }

                this._glTFShader = paper.Asset.find<GLTFAsset>(extensions.paper.shaders);
                if (!this._glTFShader) {
                    console.error("材质中获取着色器错误");
                }
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

            const target = paper.createStruct(this);
            target._gltfMaterialIndex = this._glTFMaterialIndex;
            target._glTFAsset = paper.createAssetReference(this._glTFAsset);

            return target;
        }

        public deserialize(element: any) {
            this._glTFMaterialIndex = element._gltfMaterialIndex;
            this._glTFAsset = paper.getDeserializedAssetOrComponent(element._glTFAsset) as GLTFAsset;

            const extensions = this._glTFAsset.config.extensions;
            if (!extensions ||
                !extensions.paper) {
                console.error("Error glTF asset.");
            }

            this._glTFShader = paper.Asset.find<GLTFAsset>(extensions.paper.shaders);
            if (!this._glTFShader) {
                console.error("材质中获取着色器错误");
            }

            this.initialize();
        }

        public initialize() {
            const config = this._glTFAsset.config;
            if (
                !config.materials ||
                !config.extensions ||
                !config.extensions.KHR_techniques_webgl
            ) {
                console.error("Error glTF asset.");
                return;
            }

            const KHR_techniques_webgl = config.extensions.KHR_techniques_webgl;
            //
            this._glTFMaterial = config.materials[this._glTFMaterialIndex];
            if (!this._glTFMaterial ||
                !this._glTFMaterial.extensions.KHR_techniques_webgl ||
                !this._glTFMaterial.extensions.KHR_techniques_webgl.technique) {
                console.error("Error glTF asset.");
            }
            //
            this._glTFTechnique = KHR_techniques_webgl.techniques[this._glTFMaterial.extensions.KHR_techniques_webgl.technique];
            if (!this._glTFTechnique) {
                console.error("Error glTF asset.");
            }
            const matExtensions = this._glTFMaterial.extensions.KHR_techniques_webgl;
            //用Material中的value赋值给Technique
            for (const key in matExtensions.values) {
                if (this._glTFTechnique.uniforms[key]) {
                    this._glTFTechnique.uniforms[key] = matExtensions.values[key];
                }
                else {
                    console.error("Technique中的缺少对应的Uniform键值:" + key);
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
                uniform = { type: gltf.UniformType.BOOL, value, extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
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
                uniform = { type: gltf.UniformType.Int, value, extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }
        }

        setIntv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.Int, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
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
                uniform = { type: gltf.UniformType.FLOAT, value, extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }
        }

        setFloatv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
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
                uniform = { type: gltf.UniformType.FLOAT_VEC2, value: new Float32Array(2)[value.x, value.y], extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }
        }

        setVector2v(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC2, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
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
                uniform = { type: gltf.UniformType.FLOAT_VEC3, value: new Float32Array(3)[value.x, value.y, value.z], extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }
        }

        setVector3v(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, count: value.length, value: value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
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
                uniform = { type: gltf.UniformType.FLOAT_VEC4, value: new Float32Array(4)[value.x, value.y, value.z, value.w], extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }
        }

        setVector4v(id: string, value: Float32Array | [number, number, number, number]) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC4, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrix(id: string, value: Matrix) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_MAT4, value: value.rawData, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrixv(id: string, value: Float32Array) {
            let uniform = this._glTFTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_MAT4, count: value.length, value: value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
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
                uniform = { type: gltf.UniformType.SAMPLER_2D, value: value, extensions: { paper: { enable: false, location: -1 } } };
                this.version++;
            }

            if (value) {
                this._textureRef.push(value);
            }
        }

        public get shader() {
            return this._glTFShader;
        }

        public set renderQueue(value: RenderQueue) {
            this._glTFAsset.config.extensions.paper.renderQueue = value;
        }

        public get renderQueue(): RenderQueue {
            const renderQueue = this._glTFAsset.config.extensions.paper.renderQueue;

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
