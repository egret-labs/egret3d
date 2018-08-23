namespace egret3d {
    /**
     * 
     */
    export interface GLTFTexture extends gltf.Texture {
        extensions: {
            paper?: {
                mipmap?: boolean;
                format?: 6407 | 6408 | 6409;
                pixelSize?: number;
                width?: number;
                height?: number;
            }
        }
    }
    /**
     * 
     */
    export interface GLTFMaterial extends gltf.Material {
        extensions: {
            KHR_techniques_webgl: gltf.KhrTechniquesWebglMaterialExtension;
            paper: {
                renderQueue: number;
                defines: string[],
                states: gltf.States;
            }
        }
    }
    /**
     * 
     */
    export interface GLTF extends gltf.GLTF {
        version: string;
        extensions: {
            KHR_techniques_webgl?: gltf.KhrTechniqueWebglGlTfExtension;
            paper?: {
                shaders?: gltf.Shader[], // TODO
            };
        };
        extensionsUsed: string[];
        extensionsRequired: string[];
    }
    /**
     * 
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
    /**
     * glTF 资源。
     */
    export class GLTFAsset extends paper.Asset {
        /**
         * 
         */
        private static _createConfig() {
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
         * 
         */
        public static parseFromBinary(array: Uint32Array) {
            let index = 0;
            let result: { config: GLTF, buffers: (Float32Array | Uint32Array | Uint16Array)[] } = { config: {}, buffers: [] } as any;

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
            const target: gltf.Technique = { name: source.name, attributes: {}, uniforms: {}, states: { enable: [], functions: {} } };
            for (const key in source.attributes) {
                const attribute = source.attributes[key];
                target.attributes[key] = { semantic: attribute.semantic };
            }

            for (const key in source.uniforms) {
                const uniform = source.uniforms[key];
                let value: any;
                if (uniform.type === gltf.UniformType.SAMPLER_2D && !(uniform.value instanceof egret3d.Texture)) {
                    value = egret3d.DefaultTextures.GRAY;
                }
                else if (Array.isArray(uniform.value)) {
                    value = uniform.value.concat();
                }
                else {
                    value = uniform.value;
                }

                target.uniforms[key] = { type: uniform.type, semantic: uniform.semantic, value };
            }

            const states = source.states;
            const targetStates = target.states;
            if (states.enable) {
                targetStates.enable = states.enable.concat();
            }

            if (states.functions) {
                if (!targetStates.functions) {
                    targetStates.functions = {};
                }

                for (const fun in states.functions) {
                    if (Array.isArray(states.functions[fun])) {
                        targetStates.functions[fun] = states.functions[fun].concat();
                    }
                    else {
                        targetStates.functions[fun] = states.functions[fun];
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
        /**
         * @internal
         */
        public parse(config: GLTF, buffers?: Uint32Array[]) {
            this.config = config;

            if (buffers) {
                for (const buffer of buffers) {
                    this.buffers.push(buffer);
                }
            }

            this.initialize();
        }
        /**
         * @internal
         */
        public initialize() {
        }

        public dispose() {
            if (this._isBuiltin) {
                return;
            }

            this.buffers.length = 0; // TODO clear buffer.
            this.config = null!;
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
        public createTypeArrayFromAccessor(accessor: gltf.Accessor, offset: number = 0, count: number = 0) {
            const accessorTypeCount = this.getAccessorTypeCount(accessor.type);
            const bufferCount = accessorTypeCount * (count || accessor.count);
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
        public getComponentTypeCount(type: gltf.ComponentType): number {
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
        public getAccessorTypeCount(type: gltf.AccessorType): number {
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
        public getBufferLength(accessor: gltf.Accessor) {
            return this.getAccessorTypeCount(accessor.type) * this.getComponentTypeCount(accessor.componentType) * accessor.count;
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
            return this.config.bufferViews![accessor.bufferView || 0];
        }
        /**
         * 通过 Accessor 索引，获取指定 Accessor。
         */
        public getAccessor(index: gltf.GLTFIndex) {
            return this.config.accessors![index];
        }
        /**
         * 获取节点。
         */
        public getNode(index: gltf.GLTFIndex) {
            return this.config.nodes![index];
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
    }
}
/**
 * 
 */
declare namespace gltf {
    /**
     * glTF index.
     */
    export type GLTFIndex = number;
    /**
     * BufferView target.
     */
    export const enum BufferViewTarget {
        ArrayBuffer = 34962,
        ElementArrayBuffer = 34963,
    }
    /**
     * Component type.
     */
    export const enum ComponentType {
        Byte = 5120,
        UnsignedByte = 5121,
        Short = 5122,
        UnsignedShort = 5123,
        Int = 5124,
        UnsignedInt = 5125,
        Float = 5126,
    }

    export const enum MeshPrimitiveMode {
        Points = 0,
        Lines = 1,
        LineLoop = 2,
        LineStrip = 3,
        Triangles = 4,
        TrianglesStrip = 5,
        TrianglesFan = 6,
    }
    /**
     * The uniform type.  All valid values correspond to WebGL enums.
     */
    export const enum UniformType {
        INT = 5124,
        FLOAT = 5126,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678,
        SAMPLER_CUBE = 35680,
    }
    /**
     * 
     */
    export const enum DrawMode {
        Stream = 35040,
        Static = 35044,
        Dynamic = 35048,
    }
    /**
     * 
     */
    export const enum TextureFormat {
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
    }
    /**
     * The shader stage.  All valid values correspond to WebGL enums.
     */
    export const enum ShaderStage {
        FRAGMENT_SHADER = 35632,
        VERTEX_SHADER = 35633,
    }

    export const enum EnableState {
        BLEND = 3042,
        CULL_FACE = 2884,
        DEPTH_TEST = 2929,
        POLYGON_OFFSET_FILL = 32823,
        SAMPLE_ALPHA_TO_COVERAGE = 32926,
    }

    export const enum BlendMode {
        None,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }

    export const enum BlendEquation {
        FUNC_ADD = 32774,
        FUNC_SUBTRACT = 32778,
        FUNC_REVERSE_SUBTRACT = 32779,
    }

    export const enum BlendFactor {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        SRC_ALPHA_SATURATE = 776,
    }

    export const enum CullFace {
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032,
    }

    export const enum FrontFace {
        CW = 2304,
        CCW = 2305,
    }

    export const enum DepthFunc {
        NEVER = 512,
        LESS = 513,
        LEQUAL = 515,
        EQUAL = 514,
        GREATER = 516,
        NOTEQUAL = 517,
        GEQUAL = 518,
        ALWAYS = 519,
    }

    export const enum AttributeSemanticType {
        POSITION = "POSITION",
        NORMAL = "NORMAL",
        TEXCOORD_0 = "TEXCOORD_0",
        TEXCOORD_1 = "TEXCOORD_1",
        COLOR_0 = "COLOR_0",
        COLOR_1 = "COLOR_1",
        JOINTS_0 = "JOINTS_0",
        WEIGHTS_0 = "WEIGHTS_0",

        MORPHTARGET_0 = "WEIGHTS_0",
        MORPHTARGET_1 = "WEIGHTS_1",
        MORPHTARGET_2 = "WEIGHTS_2",
        MORPHTARGET_3 = "WEIGHTS_3",
        MORPHTARGET_4 = "WEIGHTS_4",
        MORPHTARGET_5 = "WEIGHTS_5",
        MORPHTARGET_6 = "WEIGHTS_6",
        MORPHTARGET_7 = "WEIGHTS_7",

        MORPHNORMAL_0 = "MORPHNORMAL_0",
        MORPHNORMAL_1 = "MORPHNORMAL_1",
        MORPHNORMAL_2 = "MORPHNORMAL_2",
        MORPHNORMAL_3 = "MORPHNORMAL_3",

        _CORNER = "_CORNER",
        _START_POSITION = "_START_POSITION",
        _START_VELOCITY = "_START_VELOCITY",
        _START_COLOR = "_START_COLOR",
        _START_SIZE = "_START_SIZE",
        _START_ROTATION = "_START_ROTATION",
        _TIME = "_TIME",
        _RANDOM0 = "_RANDOM0",
        _RANDOM1 = "_RANDOM1",
        _WORLD_POSITION = "_WORLD_POSITION",
        _WORLD_ROTATION = "_WORLD_ROTATION",
    }

    export const enum UniformSemanticType {
        LOCAL = "LOCAL",
        MODEL = "MODEL",
        VIEW = "VIEW",
        PROJECTION = "PROJECTION",
        MODELVIEW = "MODELVIEW",
        MODELVIEWPROJECTION = "MODELVIEWPROJECTION",
        MODELINVERSE = "MODELINVERSE",
        VIEWINVERSE = "VIEWINVERSE",
        PROJECTIONINVERSE = "PROJECTIONINVERSE",
        MODELVIEWINVERSE = "MODELVIEWINVERSE",
        MODELVIEWPROJECTIONINVERSE = "MODELVIEWPROJECTIONINVERSE",
        MODELINVERSETRANSPOSE = "MODELINVERSETRANSPOSE",
        MODELVIEWINVERSETRANSPOSE = "MODELVIEWINVERSETRANSPOSE",
        VIEWPORT = "VIEWPORT",
        JOINTMATRIX = "JOINTMATRIX",

        //
        _AMBIENTLIGHTCOLOR = "_AMBIENTLIGHTCOLOR",
        _BINDMATRIX = "_BINDMATRIX",
        _BINDMATRIXINVERSE = "_BINDMATRIXINVERSE",
        // _BONETEXTURE = "_BONETEXTURE",
        // _BONETEXTURESIZE = "_BONETEXTURESIZE",
        _BONEMATRIX = "_BONEMATRIX",



        _VIEWPROJECTION = "_VIEWPROJECTION",
        _CAMERA_POS = "_CAMERA_POS",
        _CAMERA_UP = "CAMERA_UP",
        _CAMERA_FORWARD = "_CAMERA_FORWARD",
        _DIRECTLIGHTS = "_DIRECTLIGHTS",
        _POINTLIGHTS = "_POINTLIGHTS",
        _SPOTLIGHTS = "_SPOTLIGHTS",
        _LIGHTCOUNT = "_LIGHTCOUNT",
        _DIRECTIONSHADOWMAT = "_DIRECTIONSHADOWMAT",
        _SPOTSHADOWMAT = "_SPOTSHADOWMAT",
        _POINTSHADOWMAT = "_POINTSHADOWMAT",
        _DIRECTIONSHADOWMAP = "_DIRECTIONSHADOWMAP",
        _POINTSHADOWMAP = "_POINTSHADOWMAP",
        _SPOTSHADOWMAP = "_SPOTSHADOWMAP",
        _LIGHTMAPTEX = "_LIGHTMAPTEX",
        _LIGHTMAPINTENSITY = "_LIGHTMAPINTENSITY",
        _LIGHTMAPOFFSET = "_LIGHTMAPOFFSET",
        _BONESVEC4 = "_BONESVEC4",
        _LIGHTMAPUV = "_LIGHTMAPUV",
        _REFERENCEPOSITION = "_REFERENCEPOSITION",
        _NEARDICTANCE = "_NEARDICTANCE",
        _FARDISTANCE = "_FARDISTANCE",
    }

    export const enum AccessorType {
        SCALAR = "SCALAR",
        VEC2 = "VEC2",
        VEC3 = "VEC3",
        VEC4 = "VEC4",
        MAT2 = "MAT2",
        MAT3 = "MAT3",
        MAT4 = "MAT4",
    }

    export const enum MeshAttributeType {
        POSITION = "POSITION",
        NORMAL = "NORMAL",
        TANGENT = "TANGENT",
        TEXCOORD_0 = "TEXCOORD_0",
        TEXCOORD_1 = "TEXCOORD_1",
        COLOR_0 = "COLOR_0",
        COLOR_1 = "COLOR_1",
        JOINTS_0 = "JOINTS_0",
        WEIGHTS_0 = "WEIGHTS_0",
    }

    export type MeshAttribute = MeshAttributeType | string;
    /**
     * Indices of those attributes that deviate from their initialization value.
     */
    export interface AccessorSparseIndices {
        /**
         * The index of the bufferView with sparse indices. Referenced bufferView can't have ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER target.
         */
        bufferView: GLTFIndex;
        /**
         * The offset relative to the start of the bufferView in bytes. Must be aligned.
         */
        byteOffset?: number;
        /**
         * The indices data type.
         */
        componentType: ComponentType.UnsignedByte | ComponentType.UnsignedShort | ComponentType.UnsignedInt;
        extensions?: any;
        extras?: any;
        // // [k: string]: any;
    }
    /**
     * Array of size `accessor.sparse.count` times number of components storing the displaced accessor attributes pointed by `accessor.sparse.indices`.
     */
    export interface AccessorSparseValues {
        /**
         * The index of the bufferView with sparse values. Referenced bufferView can't have ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER target.
         */
        bufferView: GLTFIndex;
        /**
         * The offset relative to the start of the bufferView in bytes. Must be aligned.
         */
        byteOffset?: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Sparse storage of attributes that deviate from their initialization value.
     */
    export interface AccessorSparse {
        /**
         * Number of entries stored in the sparse array.
         */
        count: number;
        /**
         * Index array of size `count` that points to those accessor attributes that deviate from their initialization value. Indices must strictly increase.
         */
        indices: AccessorSparseIndices;
        /**
         * Array of size `count` times number of components, storing the displaced accessor attributes pointed by `indices`. Substituted values must have the same `componentType` and number of components as the base accessor.
         */
        values: AccessorSparseValues;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A typed view into a bufferView.  A bufferView contains raw binary data.  An accessor provides a typed view into a bufferView or a subset of a bufferView similar to how WebGL's `vertexAttribPointer()` defines an attribute in a buffer.
     */
    export interface Accessor {
        /**
         * The index of the bufferView.
         */
        bufferView?: GLTFIndex;
        /**
         * The offset relative to the start of the bufferView in bytes.
         */
        byteOffset?: number;
        /**
         * The datatype of components in the attribute.
         */
        componentType: ComponentType;
        /**
         * Specifies whether integer data values should be normalized.
         */
        normalized?: boolean;
        /**
         * The number of attributes referenced by this accessor.
         */
        count: number;
        /**
         * Specifies if the attribute is a scalar, vector, or matrix.
         */
        type: AccessorType;
        /**
         * Maximum value of each component in this attribute.
         */
        max?: number[];
        /**
         * Minimum value of each component in this attribute.
         */
        min?: number[];
        /**
         * Sparse storage of attributes that deviate from their initialization value.
         */
        sparse?: AccessorSparse;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * The index of the node and TRS property that an animation channel targets.
     */
    export interface AnimationChannelTarget {
        /**
         * The index of the node to target.
         */
        node?: GLTFIndex;
        /**
         * The name of the node's TRS property to modify, or the "weights" of the Morph Targets it instantiates. For the "translation" property, the values that are provided by the sampler are the translation along the x, y, and z axes. For the "rotation" property, the values are a quaternion in the order (x, y, z, w), where w is the scalar. For the "scale" property, the values are the scaling factors along the x, y, and z axes.
         */
        path: "translation" | "rotation" | "scale" | "weights" | string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Targets an animation's sampler at a node's property.
     */
    export interface AnimationChannel {
        /**
         * The index of a sampler in this animation used to compute the value for the target.
         */
        sampler: GLTFIndex;
        /**
         * The index of the node and TRS property to target.
         */
        target: AnimationChannelTarget;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Combines input and output accessors with an interpolation algorithm to define a keyframe graph (but not its target).
     */
    export interface AnimationSampler {
        /**
         * The index of an accessor containing keyframe input values, e.g., time.
         */
        input: GLTFIndex;
        /**
         * Interpolation algorithm.
         */
        interpolation?: "LINEAR" | "STEP" | "CUBICSPLINE" | string;
        /**
         * The index of an accessor, containing keyframe output values.
         */
        output: GLTFIndex;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A keyframe animation.
     */
    export interface Animation {
        /**
         * An array of channels, each of which targets an animation's sampler at a node's property. Different channels of the same animation can't have equal targets.
         */
        channels: AnimationChannel[];
        /**
         * An array of samplers that combines input and output accessors with an interpolation algorithm to define a keyframe graph (but not its target).
         */
        samplers: AnimationSampler[];
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Metadata about the glTF asset.
     */
    export interface Asset {
        /**
         * A copyright message suitable for display to credit the content creator.
         */
        copyright?: string;
        /**
         * Tool that generated this glTF model.  Useful for debugging.
         */
        generator?: string;
        /**
         * The glTF version that this asset targets.
         */
        version: string;
        /**
         * The minimum glTF version that this asset targets.
         */
        minVersion?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A buffer points to binary geometry, animation, or skins.
     */
    export interface Buffer {
        /**
         * The uri of the buffer.
         */
        uri?: string;
        /**
         * The length of the buffer in bytes.
         */
        byteLength: number;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A view into a buffer generally representing a subset of the buffer.
     */
    export interface BufferView {
        /**
         * The index of the buffer.
         */
        buffer: GLTFIndex;
        /**
         * The offset into the buffer in bytes.
         */
        byteOffset?: number;
        /**
         * The length of the bufferView in bytes.
         */
        byteLength: number;
        /**
         * The stride, in bytes.
         */
        byteStride?: number;
        /**
         * The target that the GPU buffer should be bound to.
         */
        target?: BufferViewTarget;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * An orthographic camera containing properties to create an orthographic projection matrix.
     */
    export interface CameraOrthographic {
        /**
         * The floating-point horizontal magnification of the view. Must not be zero.
         */
        xmag: number;
        /**
         * The floating-point vertical magnification of the view. Must not be zero.
         */
        ymag: number;
        /**
         * The floating-point distance to the far clipping plane. `zfar` must be greater than `znear`.
         */
        zfar: number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        znear: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A perspective camera containing properties to create a perspective projection matrix.
     */
    export interface CameraPerspective {
        /**
         * The floating-point aspect ratio of the field of view.
         */
        aspectRatio?: number;
        /**
         * The floating-point vertical field of view in radians.
         */
        yfov: number;
        /**
         * The floating-point distance to the far clipping plane.
         */
        zfar?: number;
        /**
         * The floating-point distance to the near clipping plane.
         */
        znear: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A camera's projection.  A node can reference a camera to apply a transform to place the camera in the scene.
     */
    export interface Camera {
        /**
         * An orthographic camera containing properties to create an orthographic projection matrix.
         */
        orthographic?: CameraOrthographic;
        /**
         * A perspective camera containing properties to create a perspective projection matrix.
         */
        perspective?: CameraPerspective;
        /**
         * Specifies if the camera uses a perspective or orthographic projection.
         */
        type: "perspective" | "orthographic" | string;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Image data used to create a texture. Image can be referenced by URI or `bufferView` index. `mimeType` is required in the latter case.
     */
    export interface Image {
        /**
         * The uri of the image.
         */
        uri?: string;
        /**
         * The image's MIME type.
         */
        mimeType?: "image/jpeg" | "image/png" | string;
        /**
         * The index of the bufferView that contains the image. Use this instead of the image's uri property.
         */
        bufferView?: GLTFIndex;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Reference to a texture.
     */
    export interface TextureInfo {
        /**
         * The index of the texture.
         */
        index: GLTFIndex;
        /**
         * The set index of texture's TEXCOORD attribute used for texture coordinate mapping.
         */
        texCoord?: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.
     */
    export interface MaterialPbrMetallicRoughness {
        /**
         * The material's base color factor.
         */
        baseColorFactor?: number[];
        /**
         * The base color texture.
         */
        baseColorTexture?: TextureInfo;
        /**
         * The metalness of the material.
         */
        metallicFactor?: number;
        /**
         * The roughness of the material.
         */
        roughnessFactor?: number;
        /**
         * The metallic-roughness texture.
         */
        metallicRoughnessTexture?: TextureInfo;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }

    export interface MaterialNormalTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * The scalar multiplier applied to each normal vector of the normal texture.
         */
        scale?: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }

    export interface MaterialOcclusionTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * A scalar multiplier controlling the amount of occlusion applied.
         */
        strength?: number;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * The material appearance of a primitive.
     */
    export interface Material {
        name?: string;
        extensions?: any;
        extras?: any;
        /**
         * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology. When not specified, all the default values of `pbrMetallicRoughness` apply.
         */
        pbrMetallicRoughness?: MaterialPbrMetallicRoughness;
        /**
         * The normal map texture.
         */
        normalTexture?: MaterialNormalTextureInfo;
        /**
         * The occlusion map texture.
         */
        occlusionTexture?: MaterialOcclusionTextureInfo;
        /**
         * The emissive map texture.
         */
        emissiveTexture?: TextureInfo;
        /**
         * The emissive color of the material.
         */
        emissiveFactor?: number[];
        /**
         * The alpha rendering mode of the material.
         */
        alphaMode?: "OPAQUE" | "MASK" | "BLEND" | string;
        /**
         * The alpha cutoff value of the material.
         */
        alphaCutoff?: number;
        /**
         * Specifies whether the material is double sided.
         */
        doubleSided?: boolean;
        // [k: string]: any;
    }
    /**
     * Geometry to be rendered with the given material.
     */
    export interface MeshPrimitive {
        /**
         * A dictionary object, where each key corresponds to mesh attribute semantic and each value is the index of the accessor containing attribute's data.
         */
        attributes: {
            POSITION?: GLTFIndex;
            NORMAL?: GLTFIndex;
            TANGENT?: GLTFIndex;
            TEXCOORD_0?: GLTFIndex;
            TEXCOORD_1?: GLTFIndex;
            COLOR_0?: GLTFIndex;
            COLOR_1?: GLTFIndex;
            JOINTS_0?: GLTFIndex;
            WEIGHTS_0?: GLTFIndex;
            [k: string]: GLTFIndex | undefined;
        };
        /**
         * The index of the accessor that contains the indices.
         */
        indices?: GLTFIndex;
        /**
         * The index of the material to apply to this primitive when rendering.
         */
        material?: GLTFIndex;
        /**
         * The type of primitives to render.
         */
        mode?: MeshPrimitiveMode;
        /**
         * An array of Morph Targets, each  Morph Target is a dictionary mapping attributes (only `POSITION`, `NORMAL`, and `TANGENT` supported) to their deviations in the Morph Target.
         */
        targets?: {
            [k: string]: GLTFIndex;
        }[];
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A set of primitives to be rendered.  A node can contain one mesh.  A node's transform places the mesh in the scene.
     */
    export interface Mesh {
        /**
         * An array of primitives, each defining geometry to be rendered with a material.
         */
        primitives: MeshPrimitive[];
        /**
         * Array of weights to be applied to the Morph Targets.
         */
        weights?: number[];
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` must contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node can have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), only TRS properties may be present; `matrix` will not be present.
     */
    export interface Node {
        /**
         * The index of the camera referenced by this node.
         */
        camera?: GLTFIndex;
        /**
         * The indices of this node's children.
         */
        children?: GLTFIndex[];
        /**
         * The index of the skin referenced by this node.
         */
        skin?: GLTFIndex;
        /**
         * A floating-point 4x4 transformation matrix stored in column-major order.
         */
        matrix?: number[];
        /**
         * The index of the mesh in this node.
         */
        mesh?: GLTFIndex;
        /**
         * The node's unit quaternion rotation in the order (x, y, z, w), where w is the scalar.
         */
        rotation?: number[];
        /**
         * The node's non-uniform scale, given as the scaling factors along the x, y, and z axes.
         */
        scale?: number[];
        /**
         * The node's translation along the x, y, and z axes.
         */
        translation?: number[];
        /**
         * The weights of the instantiated Morph Target. Number of elements must match number of Morph Targets of used mesh.
         */
        weights?: number[];
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Texture sampler properties for filtering and wrapping modes.
     */
    export interface Sampler {
        /**
         * Magnification filter.
         */
        magFilter?: 9728 | 9729 | number;
        /**
         * Minification filter.
         */
        minFilter?: 9728 | 9729 | 9984 | 9985 | 9986 | 9987 | number;
        /**
         * s wrapping mode.
         */
        wrapS?: 33071 | 33648 | 10497 | number;
        /**
         * t wrapping mode.
         */
        wrapT?: 33071 | 33648 | 10497 | number;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * The root nodes of a scene.
     */
    export interface Scene {
        /**
         * The indices of each root node.
         */
        nodes?: GLTFIndex[];
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * Joints and matrices defining a skin.
     */
    export interface Skin {
        /**
         * The index of the accessor containing the floating-point 4x4 inverse-bind matrices.  The default is that each matrix is a 4x4 identity matrix, which implies that inverse-bind matrices were pre-applied.
         */
        inverseBindMatrices?: GLTFIndex;
        /**
         * The index of the node used as a skeleton root. When undefined, joints transforms resolve to scene root.
         */
        skeleton?: GLTFIndex;
        /**
         * Indices of skeleton nodes, used as joints in this skin.
         */
        joints: GLTFIndex[];
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A texture and its sampler.
     */
    export interface Texture {
        /**
         * The index of the sampler used by this texture. When undefined, a sampler with repeat wrapping and auto filtering should be used.
         */
        sampler?: GLTFIndex;
        /**
         * The index of the image used by this texture.
         */
        source?: GLTFIndex;
        name?: string;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * The root object for a glTF asset.
     */
    export interface GLTF {
        /**
         * Names of glTF extensions used somewhere in this asset.
         */
        extensionsUsed?: string[];
        /**
         * Names of glTF extensions required to properly load this asset.
         */
        extensionsRequired?: string[];
        /**
         * An array of accessors.
         */
        accessors?: Accessor[];
        /**
         * An array of keyframe animations.
         */
        animations?: Animation[];
        /**
         * Metadata about the glTF asset.
         */
        asset: Asset;
        /**
         * An array of buffers.
         */
        buffers?: Buffer[];
        /**
         * An array of bufferViews.
         */
        bufferViews?: BufferView[];
        /**
         * An array of cameras.
         */
        cameras?: Camera[];
        /**
         * An array of images.
         */
        images?: Image[];
        /**
         * An array of materials.
         */
        materials?: Material[];
        /**
         * An array of meshes.
         */
        meshes?: Mesh[];
        /**
         * An array of nodes.
         */
        nodes?: Node[];
        /**
         * An array of samplers.
         */
        samplers?: Sampler[];
        /**
         * The index of the default scene.
         */
        scene?: GLTFIndex;
        /**
         * An array of scenes.
         */
        scenes?: Scene[];
        /**
         * An array of skins.
         */
        skins?: Skin[];
        /**
         * An array of textures.
         */
        textures?: Texture[];
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
    * A vertex or fragment shader. Exactly one of `uri` or `bufferView` must be provided for the GLSL source.
    */
    export interface Shader {
        /**
         * The uri of the GLSL source.
         */
        uri?: string;
        /**
         * The shader stage.
         */
        type: 35632 | 35633;
        /**
         * The index of the bufferView that contains the GLSL shader source. Use this instead of the shader's uri property.
         */
        bufferView?: GLTFIndex;
        name: any;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * An attribute input to a technique and the corresponding semantic.
     */
    export interface Attribute {
        /**
         * Identifies a mesh attribute semantic.
         */
        semantic: string;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    export type UniformValue = any;
    /**
     * A uniform input to a technique, and an optional semantic and value.
     */
    export interface Uniform {
        /**
         * When defined, the uniform is an array of count elements of the specified type.  Otherwise, the uniform is not an array.
         */
        count?: number;
        /**
         * The index of the node whose transform is used as the uniform's value.
         */
        node?: GLTFIndex;
        /**
         * The uniform type.
         */
        type: 5124 | 5126 | 35664 | 35665 | 35666 | 35667 | 35668 | 35669 | 35670 | 35671 | 35672 | 35673 | 35674 | 35675 | 35676 | 35678 | 35680;
        /**
         * Identifies a uniform with a well-known meaning.
         */
        semantic?: string;
        /**
         * The value of the uniform.
         */
        value: UniformValue;
        name?: any;
        extensions?: any;
        extras?: any;
        // [k: string]: any;
    }
    /**
     * A template for material appearances.
     */
    export interface Technique {
        /**
         * The index of the program.
         */
        program?: GLTFIndex;
        /**
         * A dictionary object of `Attribute` objects.
         */
        attributes: {
            /**
             * An attribute input to a technique and the corresponding semantic.
             */
            [k: string]: gltf.Attribute;
        };
        /**
         * A dictionary object of `Uniform` objects.
         */
        uniforms: {
            /**
             * A uniform input to a technique, and an optional semantic and value.
             */
            [k: string]: gltf.Uniform;
        };
        name: any;
        states: States;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    /**
     * A shader program, including its vertex and fragment shaders.
     */
    export interface Program {
        /**
         * The index of the fragment shader.
         */
        fragmentShader: GLTFIndex;
        /**
         * The index of the vertex shader.
         */
        vertexShader: GLTFIndex;
        /**
         * The names of required WebGL 1.0 extensions.
         */
        glExtensions?: string[];
        name?: any;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    export interface KhrTechniqueWebglGlTfExtension {
        /**
         * An array of shaders.
         */
        shaders: Shader[];
        /**
         * An array of techniques.
         */
        techniques: Technique[];
        /**
         * An array of programs.
         */
        programs: Program[];
    }

    /**
    * The technique to use for a material and any additional uniform values.
    */
    export interface KhrTechniquesWebglMaterialExtension {
        /**
         * The index of the technique.
         */
        technique: string;
        /**
         * Dictionary object of uniform values.
         */
        values?: {
            [k: string]: UniformValue;
        };
        [k: string]: any;
    }
    /**
    * The technique to use for a material and any additional uniform values.
    */
    export interface KhrBlendMaterialExtension {
        blendEquation: number[];
        blendFactors: number[];
    }

    /**
     * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
     */
    export interface Functions {
        /**
         * Floating-point values passed to `blendColor()`. [red, green, blue, alpha]
         */
        blendColor?: number[];
        /**
         * Integer values passed to `blendEquationSeparate()`.
         */
        blendEquationSeparate?: (32774 | 32778 | 32779)[];
        /**
         * Integer values passed to `blendFuncSeparate()`.
         */
        blendFuncSeparate?: (0 | 1 | 768 | 769 | 774 | 775 | 770 | 771 | 772 | 773 | 32769 | 32770 | 32771 | 32772 | 776)[];
        /**
         * Boolean values passed to `colorMask()`. [red, green, blue, alpha].
         */
        colorMask?: boolean[];
        /**
         * Integer value passed to `cullFace()`.
         */
        cullFace?: (1028 | 1029 | 1032)[];
        /**
         * Integer values passed to `depthFunc()`.
         */
        depthFunc?: (512 | 513 | 515 | 514 | 516 | 517 | 518 | 519)[];
        /**
         * Boolean value passed to `depthMask()`.
         */
        depthMask?: boolean[];
        /**
         * Floating-point values passed to `depthRange()`. [zNear, zFar]
         */
        depthRange?: number[];
        /**
         * Integer value passed to `frontFace()`.
         */
        frontFace?: (2304 | 2305)[];
        /**
         * Floating-point value passed to `lineWidth()`.
         */
        lineWidth?: number[];
        /**
         * Floating-point value passed to `polygonOffset()`.  [factor, units]
         */
        polygonOffset?: number[];
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    /**
     * Fixed-function rendering states.
     */
    export interface States {
        /**
         * WebGL states to enable.
         */
        enable?: (3042 | 2884 | 2929 | 32823 | 32926)[];
        /**
         * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
         */
        functions?: Functions;
        extensions?: any;
        extras?: any;
    }
}