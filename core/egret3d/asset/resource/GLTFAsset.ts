namespace egret3d {
    // egret build bug. 
    RenderQueue.Background;
    BlendMode.None;
    ToneMapping.None;
    TextureEncoding.LinearEncoding;
    TextureUVMapping.UV;
    /**
     * glTF 资源。
     */
    export abstract class GLTFAsset extends paper.Asset {
        /**
         * 
         */
        public static getComponentTypeCount(type: gltf.ComponentType): uint {
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
        public static getAccessorTypeCount(type: gltf.AccessorType): uint {
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
         * @private
         */
        public static createConfig(): GLTF {
            const config: GLTF = {
                version: "5",
                asset: {
                    version: "2.0"
                },
                extensions: {},
                extensionsRequired: ["paper"],
                extensionsUsed: ["paper"],
            };

            return config;
        }
        /**
         * @private
         */
        public static parseFromBinary(array: Uint32Array) {
            let index = 0;
            const result: { config: GLTF, buffers: ArrayBufferView[] } = { buffers: [] } as any;

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
         * Buffer 列表。
         */
        public readonly buffers: Array<ArrayBufferView> = [];
        /**
         * 配置。
         */
        public readonly config: GLTF = null!;

        public initialize(
            name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null,
            ...args: Array<any>
        ) {
            super.initialize();

            this.name = name;
            (this.config as GLTF) = config;

            if (buffers) {
                for (const buffer of buffers) {
                    this.buffers.push(buffer);
                }
            }
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this.buffers.length = 0;
            (this.config as GLTF) = null!;

            return true;
        }
        /**
         * 
         */
        public updateAccessorTypeCount(): this {
            const accessors = this.config.accessors;
            if (accessors) {
                for (const accessor of accessors) {
                    accessor.typeCount = GLTFAsset.getAccessorTypeCount(accessor.type);
                }
            }

            return this;
        }
        /**
         * 根据指定 BufferView 创建二进制数组。
         */
        public createTypeArrayFromBufferView(bufferView: gltf.BufferView, componentType: gltf.ComponentType): ArrayBufferView {
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
        public createTypeArrayFromAccessor(accessor: gltf.Accessor, offset: uint = 0, count: uint = 0): ArrayBufferView {
            const typeCount = accessor.typeCount!;
            const bufferCount = typeCount * Math.min(accessor.count - offset, count || accessor.count);
            const bufferView = this.getBufferView(accessor);
            const buffer = this.buffers[bufferView.buffer];
            // assert.config.buffers[bufferView.buffer];
            let bufferOffset = buffer.byteOffset + (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);

            if (offset > 0) {
                bufferOffset += offset * typeCount * GLTFAsset.getComponentTypeCount(accessor.componentType);
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
         * 通过 Accessor 获取指定 BufferLength。
         */
        public getBufferLength(accessor: gltf.Accessor): uint {
            return accessor.typeCount! * GLTFAsset.getComponentTypeCount(accessor.componentType) * accessor.count;
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
        public getBuffer(accessor: gltf.Accessor): ArrayBufferView {
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