namespace egret3d {

    export interface MaterialConfig_UniformFloat4 {
        type: UniformTypeEnum.Float4,
        value: [number, number, number, number]
    }

    export interface MaterialConfig_Texture {
        type: UniformTypeEnum.Texture,
        value: string
    }

    export interface MaterialConfig_Float {
        type: UniformTypeEnum.Float,
        value: number
    }

    export type MaterialConfig = {
        version: number,
        shader: string,
        mapUniform: {
            [name: string]: MaterialConfig_UniformFloat4 | MaterialConfig_Texture | MaterialConfig_Float
        }
    }

    export type UniformTypes = {
        [name: string]: { type: UniformTypeEnum, value: any }
    }


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
    export class Material extends paper.Asset {
        /**
         * @internal
         */
        public id: number = _hashCode++;
        /**
         */
        public version: number = 0;
        public $uniforms: UniformTypes = {};

        private _cacheDefines: string;
        private _defines: Array<string> = new Array();
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.SHADER, { set: "setShader" })
        private shader: Shader;
        @paper.serializedField
        @paper.deserializedIgnore
        private _textureRef: Texture[] = [];
        private _renderQueue: RenderQueue = -1;

        /**
         * @internal
         */
        public _gltfMaterial: GLTFMaterial = null as any;
        /**
         * @internal
         */
        public _gltfTechnique: GLTFTechnique = null as any;

        /**
         * 释放资源。
         */
        dispose() {
            delete this.$uniforms;
            delete this._defines;

            this.version++;
        }

        /**
         * 计算资源字节大小。
         */
        caclByteLength(): number {
            let total = 0;
            if (this.shader) {
                total += this.shader.caclByteLength();
            }
            for (let k in this.$uniforms) {
                let type = this.$uniforms[k].type;
                let value = this.$uniforms[k].value;
                switch (type) {
                    case UniformTypeEnum.Float:
                        total += 4;
                        break;
                    case UniformTypeEnum.Floatv:
                        total += value.byteLength;
                        break;
                    case UniformTypeEnum.Float4:
                        total += 16;
                        break;
                    case UniformTypeEnum.Float4v:
                        total += value.byteLength;
                        break;
                    case UniformTypeEnum.Float4x4:
                        total += 64;
                        break;
                    case UniformTypeEnum.Float4x4v:
                        total += value.byteLength;
                        break;
                    case UniformTypeEnum.Texture:
                        if (value) {
                            total += value.caclByteLength();
                        }
                        break;
                }
            }
            return total;
        }

        //纯Shader中没有默认值
        // private _setDefaultUniforms(shader: Shader) {
        //     if (!this.shader) {
        //         console.log("Shader error.", this);
        //         return;
        //     }

        //     for (let key in shader.defaultValue) {
        //         let uniform = shader.defaultValue[key];
        //         switch (uniform.type) {
        //             case "Texture":
        //                 this.setTexture(key, uniform.value);
        //                 break;
        //             case "Vector4":
        //                 if (Array.isArray(uniform.value)) {
        //                     this.setVector4v(key, uniform.value as any);
        //                 } else {
        //                     this.setVector4(key, uniform.value);
        //                 }
        //                 break;
        //             case "Range":
        //                 this.setFloat(key, uniform.value);
        //                 break;
        //         }
        //     }
        // }

        /**
         * 设置着色器，不保留原有数据。
         */
        setShader(shader: Shader) {
            this.shader = shader;
            this.$uniforms = {};
            const techniqueTemplate = egret3d.DefaultTechnique.findTechniqueTemplate(shader.url);//TODO
            if (techniqueTemplate) {
                this._gltfTechnique = egret3d.DefaultTechnique.cloneTechnique(techniqueTemplate.technique);
                this._gltfMaterial = egret3d.DefaultTechnique.cloneGLTFMaterial(techniqueTemplate.material);
            }
        }
        /**
         * 获取当前着色器。
         */
        getShader() {
            return this.shader;
        }

        /**
         * 更改着色器，保留原有数据。
         */
        changeShader(shader: Shader) {
            const map: { [name: string]: { type: UniformTypeEnum, value: any } } = {};
            for (let key in this.$uniforms) {
                if (this.$uniforms[key]) {
                    map[key] = this.$uniforms[key];
                }
            }

            this.setShader(shader);

            for (let key in map) {
                if (this.$uniforms[key]) {
                    this.$uniforms[key] = map[key];
                }
            }
        }

        public set renderQueue(value: RenderQueue) {
            this._renderQueue = value;
        }

        public get renderQueue(): RenderQueue {
            if (!this.shader) {
                console.log("Shader error.", this);
                return this._renderQueue;
            }

            return this._renderQueue === -1 ? RenderQueue.Geometry : this._renderQueue;//Shader不存储renderQueue
            // return this._renderQueue === -1 ? this.shader.renderQueue : this._renderQueue;
        }

        public get shaderDefine(): string {
            this._cacheDefines = "";
            for (const key of this._defines) {
                this._cacheDefines += "#define " + key + " \n";
            }
            return this._cacheDefines;
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
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.Int, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setFloat(id: string, value: number) {
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector2(id: string, value: Vector2) {
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC2, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector3(id: string, value: Vector3) {
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, count: value.length, value: value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector4(id: string, value: Vector4) {
            let uniform = this._gltfTechnique.uniforms[id];
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
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_VEC4, count: value.length, value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrix(id: string, value: Matrix) {
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value.rawData;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_MAT4, value: value.rawData, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrixv(id: string, value: Float32Array) {
            let uniform = this._gltfTechnique.uniforms[id];
            if (uniform !== undefined) {
                uniform.value = value;
            }
            else {
                uniform = { type: gltf.UniformType.FLOAT_MAT4, count: value.length, value: value, extensions: { paper: { enable: false, location: -1 } } };
            }
            this.version++;
        }

        setTexture(id: string, value: egret3d.Texture) {
            let uniform = this._gltfTechnique.uniforms[id];
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


        /**
         * 克隆材质资源。
         */
        public clone(): Material {
            let mat: Material = new Material();
            mat.setShader(this.shader);

            //
            mat._gltfTechnique = egret3d.DefaultTechnique.cloneTechnique(this._gltfTechnique);
            mat._gltfMaterial = egret3d.DefaultTechnique.cloneGLTFMaterial(this._gltfMaterial);
            return mat;
        }
    }
}