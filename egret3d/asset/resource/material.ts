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
            this._setDefaultUniforms(this.shader);
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
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _bool;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Boolean, value: _bool };
            }
            this.version++;
        }

        setInt(_id: string, _number: number) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _number;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Int, value: _number };
            }
            this.version++;
        }

        setFloat(_id: string, _number: number) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _number;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float, value: _number };
            }
            this.version++;
        }

        setFloatv(_id: string, _numbers: Float32Array) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _numbers;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Floatv, value: _numbers };
            }
            this.version++;
        }

        setVector2(_id: string, _vector2: Vector2) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector2;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float2, value: _vector2 };
            }
            this.version++;
        }

        setVector2v(_id: string, _vector2v: Float32Array) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector2v;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float2v, value: _vector2v };
            }
            this.version++;
        }

        setVector3(_id: string, _vector3: Vector3) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector3;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float3, value: _vector3 };
            }
            this.version++;
        }

        setVector3v(_id: string, _vector3v: Float32Array) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector3v;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float3v, value: _vector3v };
            }
            this.version++;
        }

        setVector4(_id: string, _vector4: Vector4) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector4;
                if (this.$uniforms[_id].type !== UniformTypeEnum.Float4) {
                    console.error("设置setVector4类型错误，类型不匹配")
                }
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float4, value: _vector4 };
            }
            this.version++;
        }

        setVector4v(_id: string, _vector4v: Float32Array | [number, number, number, number]) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _vector4v;
                if (this.$uniforms[_id].type !== UniformTypeEnum.Float4v) {
                    console.error("设置setVector4v类型错误，类型不匹配")
                }
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float4v, value: _vector4v };
            }
            this.version++;
        }

        setMatrix(_id: string, _matrix: Matrix) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _matrix;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float4x4, value: _matrix };
            }
            this.version++;
        }

        setMatrixv(_id: string, _matrixv: Float32Array) {
            if (this.$uniforms[_id] !== undefined) {
                this.$uniforms[_id].value = _matrixv;
            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Float4x4v, value: _matrixv };
            }
            this.version++;
        }

        setTexture(_id: string, _texture: egret3d.Texture) {
            if (this.$uniforms[_id] !== undefined) {

                if (this.$uniforms[_id].value) {
                    let index = this._textureRef.indexOf(this.$uniforms[_id].value);
                    if (index > -1) {
                        this._textureRef.splice(index, 1);
                    }
                }

                this.$uniforms[_id].value = _texture;

            } else {
                this.$uniforms[_id] = { type: UniformTypeEnum.Texture, value: _texture };
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