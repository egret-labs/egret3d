namespace egret3d {
    /**
     * glTF 资源。
     */
    export abstract class GLTFAsset extends paper.Asset {
        protected static _createConfig() {
            const config = {
                version: "4",
                asset: {
                    version: "2.0"
                },
                extensions: {},
                extensionsRequired: ["paper"],
                extensionsUsed: ["paper"],
            } as GLTF;

            return config;
        }
        /**
         * 从二进制数据中解析。
         */
        public static parseFromBinary(array: Uint32Array) {
            let index = 0;
            const result: { config: GLTF, buffers: (Float32Array | Uint32Array | Uint16Array)[] } = { config: {}, buffers: [] } as any;

            if (
                array[index++] !== 0x46546C67 ||
                array[index++] !== 2
            ) {
                console.assert(false, "Nonsupport glTF data.");
                return;
            }

            if (array[index++] !== array.byteLength) {
                console.assert(false, "Error glTF data.");
                return;
            }

            let chunkLength = 0;
            let chunkType = 0;
            while (index < array.length) {
                chunkLength = array[index++];
                chunkType = array[index++];

                if (chunkLength % 4) {
                    console.assert(false, "Error glTF data.");
                }

                if (chunkType === 0x4E4F534A) {
                    const jsonArray = new Uint8Array(array.buffer, index * 4 + array.byteOffset, chunkLength / Uint8Array.BYTES_PER_ELEMENT);
                    const jsonString = io.BinReader.utf8ArrayToString(jsonArray);
                    result.config = JSON.parse(jsonString);
                }
                else if (chunkType === 0x004E4942) {
                    const buffer = new Uint32Array(array.buffer, index * 4 + array.byteOffset, chunkLength / Uint32Array.BYTES_PER_ELEMENT);
                    result.buffers.push(buffer);
                }
                else {
                    console.assert(false, "Nonsupport glTF data.");
                    return;
                }

                index += chunkLength / 4;
            }

            return result;
        }
        /**
         * 
         */
        public static createMeshConfig() {
            const config = this._createConfig();
            config.buffers = [{ byteLength: 0 }];
            config.bufferViews = [{ buffer: 0, byteOffset: 0, byteLength: 0, target: gltf.BufferViewTarget.ArrayBuffer }]; // VBO
            config.accessors = [];
            config.meshes = [{
                primitives: [{ attributes: {} }],
                extensions: { paper: {} },
            }];

            return config;
        }
        public static createTextureConfig() {
            const config = this._createConfig();
            config.images = [{}];
            config.samplers = [{ magFilter: gltf.TextureFilter.NEAREST, minFilter: gltf.TextureFilter.NEAREST, wrapS: gltf.TextureWrap.REPEAT, wrapT: gltf.TextureWrap.REPEAT }];
            config.textures = [{ sampler: 0, source: 0, extensions: { paper: {} } }];

            return config;
        }
        /**
         * 
         */
        public static createGLTFExtensionsConfig() {
            const config = this._createConfig();
            config.materials = [];
            config.extensions = {
                KHR_techniques_webgl: {
                    shaders: [],
                    techniques: [],
                    programs: [],
                },
                paper: {},
            };

            return config;
        }

        public static createTechnique(source: gltf.Technique) {
            const target: gltf.Technique = { name: source.name, attributes: {}, uniforms: {} }; // , states: { enable: [], functions: {} }
            for (const key in source.attributes) {
                const attribute = source.attributes[key];
                target.attributes[key] = { semantic: attribute.semantic };
            }

            for (const key in source.uniforms) {
                const uniform = source.uniforms[key];
                let value: any;

                if (uniform.type === gltf.UniformType.SAMPLER_2D && !uniform.value) {
                    value = egret3d.DefaultTextures.WHITE; // Default texture.
                }
                else if (Array.isArray(uniform.value)) {
                    value = uniform.value ? uniform.value.concat() : [];
                }
                else {
                    value = uniform.value ? uniform.value : [];
                }

                const targetUniform = target.uniforms[key] = { type: uniform.type, value } as gltf.Uniform;

                if (uniform.semantic) {
                    targetUniform.semantic = uniform.semantic;
                }
            }

            // if (source.states) {
            //     const states = GLTFAsset.copyTechniqueStates(source.states);
            //     if (states) {
            //         target.states = states;
            //     }
            // }

            return target;
        }

        public static copyTechniqueStates(source: gltf.States, target?: gltf.States) {
            if (source.enable && source.enable.length > 0) {
                if (!target) {
                    target = {};
                }

                target.enable = source.enable.concat();
            }

            if (source.functions) {
                for (const k in source.functions) {
                    if (!target) {
                        target = {};
                    }

                    if (!target.functions) {
                        target.functions = {};
                    }

                    if (Array.isArray(source.functions[k])) { // TODO
                        target.functions[k] = source.functions[k].concat();
                    }
                    else {
                        target.functions[k] = source.functions[k];
                    }
                }
            }

            return target;
        }
        /**
         * Buffer 列表。
         */
        public readonly buffers: (Float32Array | Uint32Array | Uint16Array)[] = [];
        /**
         * 配置。
         */
        public config: GLTF = null!;

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this.buffers.length = 0; // TODO clear buffer.
            this.config = null!;

            return true;
        }

        public caclByteLength() {
            return 0;
        }
        /**
         * 根据指定 BufferView 创建二进制数组。
         */
        public createTypeArrayFromBufferView(bufferView: gltf.BufferView, componentType: gltf.ComponentType) {
            const buffer = this.buffers[bufferView.buffer];
            const bufferOffset = buffer.byteOffset + (bufferView.byteOffset || 0);
            // assert.config.buffers[bufferView.buffer];

            switch (componentType) {
                case gltf.ComponentType.Byte:
                    return new Int8Array(buffer.buffer, bufferOffset, bufferView.byteLength / Int8Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.UnsignedByte:
                    return new Uint8Array(buffer.buffer, bufferOffset, bufferView.byteLength / Uint8Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.Short:
                    return new Int16Array(buffer.buffer, bufferOffset, bufferView.byteLength / Int16Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.UnsignedShort:
                    return new Uint16Array(buffer.buffer, bufferOffset, bufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.Int:
                    return new Int32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Int32Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.UnsignedInt:
                    return new Uint32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Uint32Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.Float:
                    return new Float32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);

                default:
                    throw new Error();
            }
        }
        /**
         * 根据指定 Accessor 创建二进制数组。
         */
        public createTypeArrayFromAccessor(accessor: gltf.Accessor, offset: uint = 0, count: uint = 0) {
            const accessorTypeCount = this.getAccessorTypeCount(accessor.type);
            const bufferCount = accessorTypeCount * Math.min(accessor.count - offset, count || accessor.count);
            const bufferView = this.getBufferView(accessor);
            const buffer = this.buffers[bufferView.buffer];
            // assert.config.buffers[bufferView.buffer];
            let bufferOffset = buffer.byteOffset + (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);

            if (offset > 0) {
                bufferOffset += offset * accessorTypeCount * this.getComponentTypeCount(accessor.componentType);
            }

            switch (accessor.componentType) {
                case gltf.ComponentType.Byte:
                    return new Int8Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedByte:
                    return new Uint8Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.Short:
                    return new Int16Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedShort:
                    return new Uint16Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.Int:
                    return new Int32Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedInt:
                    return new Uint32Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.Float:
                    return new Float32Array(buffer.buffer, bufferOffset, bufferCount);

                default:
                    throw new Error();
            }
        }
        /**
         * 
         */
        public getComponentTypeCount(type: gltf.ComponentType): uint {
            switch (type) {
                case gltf.ComponentType.Byte:
                case gltf.ComponentType.UnsignedByte:
                    return 1;

                case gltf.ComponentType.Short:
                case gltf.ComponentType.UnsignedShort:
                    return 2;

                case gltf.ComponentType.Int:
                case gltf.ComponentType.UnsignedInt:
                    return 4;

                case gltf.ComponentType.Float:
                    return 4;

                default:
                    throw new Error();
            }
        }
        /**
         * 
         */
        public getAccessorTypeCount(type: gltf.AccessorType): uint {
            switch (type) {
                case gltf.AccessorType.SCALAR:
                    return 1;

                case gltf.AccessorType.VEC2:
                    return 2;

                case gltf.AccessorType.VEC3:
                    return 3;

                case gltf.AccessorType.VEC4:
                case gltf.AccessorType.MAT2:
                    return 4;

                case gltf.AccessorType.MAT3:
                    return 9;

                case gltf.AccessorType.MAT4:
                    return 16;

                default:
                    throw new Error();
            }
        }
        /**
         * 自定义 Mesh 的属性枚举。
         */
        public getMeshAttributeType(type: gltf.MeshAttribute): gltf.AccessorType {
            switch (type) {
                case gltf.MeshAttributeType.POSITION:
                case gltf.MeshAttributeType.NORMAL:
                    return gltf.AccessorType.VEC3;

                case gltf.MeshAttributeType.TEXCOORD_0:
                case gltf.MeshAttributeType.TEXCOORD_1:
                    return gltf.AccessorType.VEC2;

                case gltf.MeshAttributeType.TANGENT:
                case gltf.MeshAttributeType.COLOR_0:
                case gltf.MeshAttributeType.COLOR_1:
                case gltf.MeshAttributeType.JOINTS_0:
                case gltf.MeshAttributeType.WEIGHTS_0:
                    return gltf.AccessorType.VEC4;

                default:
                    throw new Error();
            }
        }
        /**
         * 通过 Accessor 获取指定 BufferLength。
         */
        public getBufferLength(accessor: gltf.Accessor): uint {
            return this.getAccessorTypeCount(accessor.type) * this.getComponentTypeCount(accessor.componentType) * accessor.count;
        }
        /**
         * 通过 Accessor 获取指定 BufferOffset。
         */
        public getBufferOffset(accessor: gltf.Accessor): uint {
            const bufferView = this.getBufferView(accessor);
            // const buffer = this.buffers[bufferView.buffer];

            return (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        }
        /**
         * 通过 Accessor 获取指定 Buffer。
         */
        public getBuffer(accessor: gltf.Accessor): Uint32Array {
            const bufferView = this.getBufferView(accessor);
            // this.config.buffers[bufferView.buffer];
            return this.buffers[bufferView.buffer];
        }
        /**
         * 通过 Accessor 获取指定 BufferView。
         */
        public getBufferView(accessor: gltf.Accessor): gltf.BufferView {
            return this.config.bufferViews![accessor.bufferView || 0];
        }
        /**
         * 通过 Accessor 索引，获取指定 Accessor。
         */
        public getAccessor(index: gltf.Index): gltf.Accessor {
            return this.config.accessors![index];
        }
        /**
         * 获取节点。
         */
        public getNode(index: gltf.Index): gltf.Node {
            return this.config.nodes![index];
        }
    }
}