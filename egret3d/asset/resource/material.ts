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

    /**
     * 材质资源
     */
    export class Material extends paper.Asset {
        /**
         */
        public version: number = 0;
        public $uniforms: UniformTypes = {};


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

        private _setDefaultUniforms(shader: Shader) {
            if (!this.shader) {
                console.log("Shader error.", this);
                return;
            }

            for (let key in shader.defaultValue) {
                let uniform = shader.defaultValue[key];
                switch (uniform.type) {
                    case "Texture":
                        this.setTexture(key, uniform.value);
                        break;
                    case "Vector4":
                        if (Array.isArray(uniform.value)) {
                            this.setVector4v(key, uniform.value as any);
                        } else {
                            this.setVector4(key, uniform.value);
                        }
                        break;
                    case "Range":
                        this.setFloat(key, uniform.value);
                        break;
                }
            }
        }

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
            // this._setDefaultUniforms(this.shader);
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

            return this._renderQueue === -1 ? this.shader.renderQueue : this._renderQueue;
        }

        public get shaderDefine(): string {
            let res = "";
            for (const key of this._defines) {
                res += "#define " + key + " \n";
            }
            return res;
        }

        addDefine(key: string) {
            if (this._defines.indexOf(key) < 0) {
                this._defines.push(key);
            }
            this.version++;
        }

        removeDefine(key: string) {
            const delIndex = this._defines.indexOf(key);
            if (delIndex >= 0) {
                this._defines.splice(delIndex, 1);
            }
            this.version++;
        }

        setBoolean(_id: string, _bool: boolean) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _bool;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.BOOL, value: _bool, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }

            this.version++;
        }

        setInt(_id: string, _number: number) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _number;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.Int, value: _number, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setFloat(_id: string, _number: number) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _number;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT, value: _number, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setFloatv(_id: string, _numbers: Float32Array) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _numbers;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT, count: _numbers.length, value: _numbers, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector2(_id: string, _vector2: Vector2) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value[0] = _vector2.x;
                uniform.value[1] = _vector2.y;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT, value: new Float32Array(2)[_vector2.x, _vector2.y], extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector2v(_id: string, _vector2v: Float32Array) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _vector2v;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT, count: _vector2v.length, value: _vector2v, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector3(_id: string, _vector3: Vector3) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value[0] = _vector3.x;
                uniform.value[1] = _vector3.y;
                uniform.value[2] = _vector3.z;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, value: new Float32Array(3)[_vector3.x, _vector3.y, _vector3.z], extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector3v(_id: string, _vector3v: Float32Array) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _vector3v;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, count: _vector3v.length, value: _vector3v, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector4(_id: string, _vector4: Vector4) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value[0] = _vector4.x;
                uniform.value[1] = _vector4.y;
                uniform.value[2] = _vector4.z;
                uniform.value[3] = _vector4.w;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_VEC4, value: new Float32Array(4)[_vector4.x, _vector4.y, _vector4.z, _vector4.w], extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setVector4v(_id: string, _vector4v: Float32Array | [number, number, number, number]) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _vector4v;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, count: _vector4v.length, value: _vector4v, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrix(_id: string, _matrix: Matrix) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _matrix.rawData;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_VEC3, value: _matrix.rawData, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setMatrixv(_id: string, _matrixv: Float32Array) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                uniform.value = _matrixv;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.FLOAT_MAT4, count: _matrixv.length, value: _matrixv, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;
        }

        setTexture(_id: string, _texture: egret3d.Texture) {
            let uniform = this._gltfTechnique.uniforms[_id];
            if (uniform !== undefined) {
                if (uniform.value) {
                    let index = this._textureRef.indexOf(uniform.value);
                    if (index > -1) {
                        this._textureRef.splice(index, 1);
                    }
                }
                uniform.value = _texture;
                uniform.extensions.paper.dirty = true;
            } else {
                uniform = { type: gltf.UniformType.SAMPLER_2D, value: _texture, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }
            this.version++;

            if (_texture) {
                this._textureRef.push(_texture);
            }
        }


        /**
         * 克隆材质资源。
         */
        public clone(): Material {
            let mat: Material = new Material();
            mat.setShader(this.shader);
            for (let i in this.$uniforms) {
                let data = this.$uniforms[i];
                let _uniformType: UniformTypeEnum = data.type;
                switch (_uniformType) {
                    case UniformTypeEnum.Texture:
                        mat.setTexture(i, data.value);
                        break;
                    case UniformTypeEnum.Float:
                        mat.setFloat(i, data.value);
                        break;
                    case UniformTypeEnum.Float4:
                        if (Array.isArray(data.value)) {
                            mat.setVector4v(i, data.value as any);
                        } else {
                            mat.setVector4(i, data.value);
                        }
                        break;
                    case UniformTypeEnum.Float4v:
                        mat.setVector4v(i, data.value as any);
                        break;
                    default:
                        break;
                }
            }
            return mat;
        }
    }
}