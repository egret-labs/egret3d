namespace egret3d {
    /**
     * @private
     */
    export interface GLTFAnimation extends gltf.Animation {
        extensions: {
            paper: {
                /**
                 * 动画帧率。
                 */
                frameRate: number;
                /**
                 * 动画帧数。
                 */
                frameCount: number;
                /**
                 * 整个帧数据访问器索引。
                 */
                data: number;
                /**
                 * 采样帧访问器索引列表。
                 */
                frames: number[];
                /**
                 * 骨骼名称列表。
                 */
                joints: string[];
                /**
                 * 动画重定向。
                 */
                retarget?: {
                    joints: string[];
                };
                /**
                 * 动画剪辑列表。
                 */
                clips: GLTFAnimationClip[];
            };
        };
    }
    /**
     * 动画剪辑反序列化。
     */
    export interface GLTFAnimationClip {
        /**
         * 动画剪辑名称。
         */
        name: string;
        /**
         * 播放次数。
         */
        playTimes?: number;
        /**
         * 开始时间。（以秒为单位）
         */
        position: number;
        /**
         * 持续时间。（以秒为单位）
         */
        duration: number;
        /**
         * 遮罩名称列表。
         */
        mask: number[];
        /**
         * 事件列表。
         */
        events: GLTFFrameEvent[];
    }

    export interface GLTFAnimationChannel extends gltf.AnimationChannel {
        extensions?: {
            paper: {
                type: string,
                property: string,
            }
        }
    }
    /**
     * 帧事件反序列化。
     */
    export interface GLTFFrameEvent {
        /**
         * 事件名称。
         */
        name: string;
        /**
         * 事件位置。（%）
         */
        position: number;
        /**
         * 事件 int 变量。
         */
        intVariable: number;
        /**
         * 事件 float 变量。
         */
        floatVariable: number;
        /**
         * 事件 string 变量。
         */
        stringVariable: string;
    }
    export interface GLTFAttribute extends gltf.Attribute {
        extensions?: {
            paper: {
                enable: boolean;
                location: number;
            }
        }
    }
    export interface GLTFUniform extends gltf.Uniform {
        extensions?: {
            paper: {
                enable: boolean;
                location: WebGLUniformLocation;
                textureUnits?: number[];
            }
        }
    }
    /**
     * glTF 资源。
     */
    export class GLTFAsset extends paper.Asset {
        /**
         * 
         */
        public static getComponentTypeCount(type: gltf.ComponentType): number {
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
        public static getAccessorTypeCount(type: gltf.AccessorType): number {
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
        public static getMeshAttributeType(type: gltf.MeshAttribute): gltf.AccessorType {
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
         * 
         */
        public static createGLTFAsset(url: string = ""): GLTFAsset {
            const glftAsset = new GLTFAsset(url);

            glftAsset.config = {
                asset: {
                    version: "2.0"
                },
                extensionsRequired: ["paper"],
                extensionsUsed: ["paper"],
            } as gltf.GLTF;

            return glftAsset;
        }
        /**
         * Buffer 列表。
         */
        public readonly buffers: (Float32Array | Uint32Array | Uint16Array)[] = [];
        /**
         * 配置。
         */
        public config: gltf.GLTF = null as any;
        /**
         * @internal
         */
        public parse(config: gltf.GLTF, buffers: Uint32Array[]) {
            this.config = config;
            for (const buffer of buffers) {
                this.buffers.push(buffer);
            }
        }
        /**
         * 从二进制数据中解析资源。
         */
        public parseFromBinary(array: Uint32Array) {
            let index = 0;

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
                    this.config = JSON.parse(jsonString);
                }
                else if (chunkType === 0x004E4942) {
                    const buffer = new Uint32Array(array.buffer, index * 4 + array.byteOffset, chunkLength / Uint32Array.BYTES_PER_ELEMENT);
                    this.buffers.push(buffer);
                }
                else {
                    console.assert(false, "Nonsupport glTF data.");
                    return;
                }

                index += chunkLength / 4;
            }
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

                case gltf.ComponentType.UnsignedInt:
                    return new Int32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Int32Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.UnsignedInt:
                    return new Uint32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Uint32Array.BYTES_PER_ELEMENT);

                case gltf.ComponentType.Float:
                    return new Float32Array(buffer.buffer, bufferOffset, bufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
            }

            throw new Error();
        }
        /**
         * 根据指定 Accessor 创建二进制数组。
         */
        public createTypeArrayFromAccessor(accessor: gltf.Accessor) {
            const bufferCount = GLTFAsset.getAccessorTypeCount(accessor.type) * accessor.count;
            const bufferView = this.getBufferView(accessor);
            const buffer = this.buffers[bufferView.buffer];
            // assert.config.buffers[bufferView.buffer];
            const bufferOffset = buffer.byteOffset + (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);

            switch (accessor.componentType) {
                case gltf.ComponentType.Byte:
                    return new Int8Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedByte:
                    return new Uint8Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.Short:
                    return new Int16Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedShort:
                    return new Uint16Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedInt:
                    return new Int32Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.UnsignedInt:
                    return new Uint32Array(buffer.buffer, bufferOffset, bufferCount);

                case gltf.ComponentType.Float:
                    return new Float32Array(buffer.buffer, bufferOffset, bufferCount);
            }

            throw new Error();
        }
        /**
         * 通过 Accessor 获取指定 BufferLength。
         */
        public getBufferLength(accessor: gltf.Accessor) {
            return GLTFAsset.getAccessorTypeCount(accessor.type) * GLTFAsset.getComponentTypeCount(accessor.componentType) * accessor.count;
        }
        /**
         * 通过 Accessor 获取指定 BufferOffset。
         */
        public getBufferOffset(accessor: gltf.Accessor) {
            const bufferView = this.getBufferView(accessor);
            // const buffer = this.buffers[bufferView.buffer];

            return (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        }
        /**
         * 通过 Accessor 获取指定 Buffer。
         */
        public getBuffer(accessor: gltf.Accessor) {
            const bufferView = this.getBufferView(accessor);
            // this.config.buffers[bufferView.buffer];
            return this.buffers[bufferView.buffer];
        }
        /**
         * 通过 Accessor 获取指定 BufferView。
         */
        public getBufferView(accessor: gltf.Accessor) {
            if (!this.config.bufferViews) {
                throw new Error();
            }

            return this.config.bufferViews[accessor.bufferView || 0];
        }
        /**
         * 通过 Accessor 索引，获取指定 Accessor。
         */
        public getAccessor(index: gltf.GLTFIndex) {
            if (!this.config.accessors) {
                throw new Error();
            }

            return this.config.accessors[index];
        }
        /**
         * 获取节点。
         */
        public getNode(index: gltf.GLTFIndex) {
            if (!this.config.nodes) {
                throw new Error();
            }

            return this.config.nodes[index];
        }
        /*
         * 获取动画剪辑。
         */
        public getAnimationClip(name: string) {
            if (
                !this.config.animations ||
                this.config.animations.length === 0

            ) { // TODO 动画数据暂不合并。
                return null;
            }

            const animation = this.config.animations[0] as GLTFAnimation;
            if (animation.extensions.paper.clips.length === 0) {
                return null;
            }

            if (!name) {
                return animation.extensions.paper.clips[0];
            }

            for (const animation of this.config.animations) {
                for (const animationClip of animation.extensions.paper.clips) {
                    if (animationClip.name === name) {
                        return animationClip;
                    }
                }
            }

            return null;
        }

        public caclByteLength() {
            return 0; // TODO
        }

        public dispose() {
            this.buffers.length = 0;
        }
    }
}