namespace egret3d {
    /**
     * 渲染排序。
     */
    export const enum RenderQueue {
        Background = 1000,
        Geometry = 2000,
        Mask = 2450,
        Blend = 3000,
        Overlay = 4000,
    }
    /**
     * 混合模式。
     */
    export const enum BlendMode {
        /**
         * 不混合。
         */
        None = 0,
        /**
         * 正常。
         */
        Normal = 0b000010,
        /**
         * 正常并预乘。
         */
        Normal_PreMultiply = 0b000011,
        /**
         * 相加。
         */
        Additive = 0b000100,
        /**
         * 相加并预乘。
         */
        Additive_PreMultiply = 0b000101,
        /**
         * 相减。
         */
        Subtractive = 0b001000,
        /**
         * 相减并预乘。
         */
        Subtractive_PreMultiply = 0b001001,
        /**
         * 相乘。
         */
        Multiply = 0b010000,
        /**
         * 相乘并预乘。
         */
        Multiply_PreMultiply = 0b010001,
        /**
         * 自定义混合。
         */
        Custom = -1,
    }
    /**
     * 纹理编码。
     */
    export const enum TextureEncoding {
        LinearEncoding = 1,
        sRGBEncoding = 2,
        RGBEEncoding = 3,
        RGBM7Encoding = 4,
        RGBM16Encoding = 5,
        RGBDEncoding = 6,
        GammaEncoding = 7,
    }
    /**
     * 
     */
    export const enum ToneMapping {
        None = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4,
    }
    /**
     * 内置提供的全局 Attribute。
     * @private
     */
    export const globalAttributeSemantics: { [key: string]: gltf.AttributeSemantics } = {
        "position": gltf.AttributeSemantics.POSITION,
        "normal": gltf.AttributeSemantics.NORMAL,
        "uv": gltf.AttributeSemantics.TEXCOORD_0,
        "uv2": gltf.AttributeSemantics.TEXCOORD_1,
        "color": gltf.AttributeSemantics.COLOR_0,

        // "morphTarget0": gltf.AttributeSemanticType.MORPHTARGET_0,
        // "morphTarget1": gltf.AttributeSemanticType.MORPHTARGET_1,
        // "morphTarget2": gltf.AttributeSemanticType.MORPHTARGET_2,
        // "morphTarget3": gltf.AttributeSemanticType.MORPHTARGET_3,
        // "morphTarget4": gltf.AttributeSemanticType.MORPHTARGET_4,
        // "morphTarget5": gltf.AttributeSemanticType.MORPHTARGET_5,
        // "morphTarget6": gltf.AttributeSemanticType.MORPHTARGET_6,
        // "morphTarget7": gltf.AttributeSemanticType.MORPHTARGET_7,
        // "morphNormal0": gltf.AttributeSemanticType.MORPHNORMAL_0,
        // "morphNormal1": gltf.AttributeSemanticType.MORPHNORMAL_1,
        // "morphNormal2": gltf.AttributeSemanticType.MORPHNORMAL_2,
        // "morphNormal3": gltf.AttributeSemanticType.MORPHNORMAL_3,

        "skinIndex": gltf.AttributeSemantics.JOINTS_0,
        "skinWeight": gltf.AttributeSemantics.WEIGHTS_0,

        "corner": gltf.AttributeSemantics._CORNER,
        "startPosition": gltf.AttributeSemantics._START_POSITION,
        "startVelocity": gltf.AttributeSemantics._START_VELOCITY,
        "startColor": gltf.AttributeSemantics._START_COLOR,
        "startSize": gltf.AttributeSemantics._START_SIZE,
        "startRotation": gltf.AttributeSemantics._START_ROTATION,
        "time": gltf.AttributeSemantics._TIME,
        "random0": gltf.AttributeSemantics._RANDOM0,
        "random1": gltf.AttributeSemantics._RANDOM1,
        "startWorldPosition": gltf.AttributeSemantics._WORLD_POSITION,
        "startWorldRotation": gltf.AttributeSemantics._WORLD_ROTATION,

        "lineDistance": gltf.AttributeSemantics._INSTANCE_DISTANCE,
        "instanceStart": gltf.AttributeSemantics._INSTANCE_START,
        "instanceEnd": gltf.AttributeSemantics._INSTANCE_END,
        "instanceColorStart": gltf.AttributeSemantics._INSTANCE_COLOR_START,
        "instanceColorEnd": gltf.AttributeSemantics._INSTANCE_COLOR_END,
        "instanceDistanceStart": gltf.AttributeSemantics._INSTANCE_DISTANCE_START,
        "instanceDistanceEnd": gltf.AttributeSemantics._INSTANCE_DISTANCE_END,
    };
    /**
     * 内置提供的全局 Uniform。
     * @private
     */
    export const globalUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "modelMatrix": gltf.UniformSemantics.MODEL,
        "modelViewMatrix": gltf.UniformSemantics.MODELVIEW,
        "projectionMatrix": gltf.UniformSemantics.PROJECTION,
        "viewMatrix": gltf.UniformSemantics.VIEW,
        "normalMatrix": gltf.UniformSemantics.MODELVIEWINVERSE,
        "modelViewProjectionMatrix": gltf.UniformSemantics.MODELVIEWPROJECTION,

        "clock": gltf.UniformSemantics._CLOCK,
        "viewProjectionMatrix": gltf.UniformSemantics._VIEWPROJECTION,
        "cameraPosition": gltf.UniformSemantics._CAMERA_POS,
        "cameraForward": gltf.UniformSemantics._CAMERA_FORWARD,
        "cameraUp": gltf.UniformSemantics._CAMERA_UP,

        "boneMatrices[0]": gltf.UniformSemantics.JOINTMATRIX,

        "ambientLightColor": gltf.UniformSemantics._AMBIENTLIGHTCOLOR,
        "directionalLights[0]": gltf.UniformSemantics._DIRECTLIGHTS,
        "spotLights[0]": gltf.UniformSemantics._SPOTLIGHTS,
        "rectAreaLights[0]": gltf.UniformSemantics._RECTAREALIGHTS,
        "pointLights[0]": gltf.UniformSemantics._POINTLIGHTS,
        "hemisphereLights[0]": gltf.UniformSemantics._HEMILIGHTS,

        "directionalShadowMatrix[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAT,
        "spotShadowMatrix[0]": gltf.UniformSemantics._SPOTSHADOWMAT,
        "pointShadowMatrix[0]": gltf.UniformSemantics._POINTSHADOWMAT,
        "directionalShadowMap[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAP,
        "spotShadowMap[0]": gltf.UniformSemantics._SPOTSHADOWMAP,
        "pointShadowMap[0]": gltf.UniformSemantics._POINTSHADOWMAP,
        "lightMap": gltf.UniformSemantics._LIGHTMAPTEX,
        "lightMapIntensity": gltf.UniformSemantics._LIGHTMAPINTENSITY,
        "lightMapScaleOffset": gltf.UniformSemantics._LIGHTMAP_SCALE_OFFSET,

        "referencePosition": gltf.UniformSemantics._REFERENCEPOSITION,
        "nearDistance": gltf.UniformSemantics._NEARDICTANCE,
        "farDistance": gltf.UniformSemantics._FARDISTANCE,

        "fogColor": gltf.UniformSemantics._FOG_COLOR,
        "fogDensity": gltf.UniformSemantics._FOG_DENSITY,
        "fogNear": gltf.UniformSemantics._FOG_NEAR,
        "fogFar": gltf.UniformSemantics._FOG_FAR,

        "toneMappingExposure": gltf.UniformSemantics._TONE_MAPPING_EXPOSURE,
        "toneMappingWhitePoint": gltf.UniformSemantics._TONE_MAPPING_WHITE_POINT,

        "logDepthBufFC": gltf.UniformSemantics._LOG_DEPTH_BUFFC,
    };
    /**
     * 扩展 glTF。
     */
    export interface GLTF extends gltf.GLTF {
        version: string;
        extensions: {
            KHR_techniques_webgl?: gltf.KhrTechniqueWebglGlTfExtension;
            paper?: {
                animationMasks?: {
                    name?: string;
                    retargeting: string[];
                    joints: gltf.Index[];
                }[];
                animationControllers?: {
                    name?: string;
                    layers: AnimationLayer[];
                    parameters: AnimationParameter[];
                }[];
            };
        };
        extensionsUsed: string[];
        extensionsRequired: string[];
    }
    /**
     * 扩展 glTF 材质。
     * - 仅用于存储材质初始值。
     */
    export interface GLTFMaterial extends gltf.Material {
        extensions: {
            KHR_techniques_webgl: gltf.KhrTechniquesWebglMaterialExtension;
            paper: {
                renderQueue: RenderQueue | uint;
                /**
                 * 该值如果定义，则覆盖着色器中的值。
                 */
                states?: gltf.States;
                /**
                 * 该值如果定义，则覆盖着色器中的值。
                 */
                defines?: string[];
            }
        };
    }
    /**
     * 
     */
    export interface GLTFEgretTextureExtension {
        /**
         * @defaults false
         */
        mipmap?: boolean;
        /**
         * @defaults 0
         */
        flipY?: 0 | 1;
        /**
         * @defaults 0
         */
        premultiplyAlpha?: 0 | 1;
        /**
         * 纹理宽。
         */
        width?: uint; // init optional.
        /**
         * 纹理高。
         */
        height?: uint; // init optional.
        /**
         * @defaults 1
         */
        anisotropy?: uint;
        /**
         * 纹理数据格式。
         * @defaults gltf.TextureFormat.RGBA
         */
        format?: gltf.TextureFormat;
        /**
         * 纹理数据类型。
         * @defaults gltf.TextureDataType.UNSIGNED_BYTE
         */
        type?: gltf.TextureDataType;
        /**
         * 纹理对齐方式。
         * @defaults gltf.TextureAlignment.Four
         */
        unpackAlignment?: gltf.TextureAlignment;
        /**
         * 纹理编码格式
         */
        encoding?: TextureEncoding;
        /**
         * 
         */
        depth?: uint;
        /**
         * 
         */
        layers?: uint;
        /**
         * 
         */
        faces?: uint;
        /**
         * 
         */
        levels?: uint;
        /**
         * @defaults false
         */
        depthBuffer?: boolean;
        /**
         * @defaults false
         */
        stencilBuffer?: boolean;
    }
    /**
     * 
     */
    export interface GLTFTexture extends gltf.Texture {
        extensions: {
            paper: GLTFEgretTextureExtension,
        };
    }
    /**
     * @private
     */
    export interface GLTFSkin extends gltf.Skin {
        extensions: {
            paper: {
                retargeting?: { [key: string]: gltf.Index };
            }
        };
    }
    /**
     * @private
     */
    export interface GLTFAnimation extends gltf.Animation {
        extensions: {
            paper: {
                frameRate: number;
                clips: GLTFAnimationClip[];
                events?: GLTFAnimationFrameEvent[];
            };
        };
    }
    /**
     * @private
     */
    export interface GLTFAnimationChannel extends gltf.AnimationChannel {
        extensions?: {
            paper: {
                type: string,
                property: string,
            }
        };
    }
    /**
     * 
     */
    export interface GLTFAnimationFrameEvent {
        /**
         * 事件名称。
         */
        name: string;
        /**
         * 
         */
        position: number;
        /**
         * 事件 int 变量。
         */
        intVariable?: int;
        /**
         * 事件 float 变量。
         */
        floatVariable?: number;
        /**
         * 事件 string 变量。
         */
        stringVariable?: string;
    }
    /**
     * 
     */
    export interface GLTFAnimationClip {
        /**
         * 动画剪辑名称。
         */
        name: string;
        /**
         * 播放次数。
         */
        playTimes?: uint;
        /**
         * 开始时间。（以秒为单位）
         */
        position: number;
        /**
         * 持续时间。（以秒为单位）
         */
        duration: number;
    }
    /**
     * @private
     */
    export interface StateMachineNode {
        _parent?: StateMachineNode;
    }
    /**
     * @private
     */
    export interface StateMachine extends StateMachineNode {
        name: string;
        nodes: StateMachineNode[];
    }
    /**
     * @private
     */
    export const enum AnimationBlendType {
        E1D = 0,
    }
    /**
     * @private
     */
    export interface AnimationParameter {
        type: int;
        value: boolean | int | number;
    }
    /**
     * @private
     */
    export interface AnimationLayer {
        additive: boolean;
        weight: number;
        name: string;
        source?: string | null;
        mask?: string | AnimationMask | null;
        machine: StateMachine;
        /**
         * @internal
         */
        _clipNames?: string[];
    }
    /**
     * @private
     */
    export interface AnimationBaseNode extends StateMachineNode {
        timeScale: number;
        positionX?: number;
        positionY?: number;
    }
    /**
     * @private
     */
    export interface AnimationTree extends AnimationBaseNode {
        blendType: AnimationBlendType;
        name: string;
        parameters: string[];
        nodes: AnimationBaseNode[];
    }
    /**
     * @private
     */
    export interface AnimationNode extends AnimationBaseNode {
        asset: string;
        clip: string;
    }
}

// For keep const enum.
namespace gltf {
    /**
     * 绘制缓存掩码。
     */
    export const enum BufferMask {
        None = 0,
        Depth = 256,
        Stencil = 1024,
        Color = 16384,

        DepthAndStencil = Depth | Stencil,
        DepthAndColor = Depth | Color,
        StencilAndColor = Stencil | Color,
        All = Depth | Stencil | Color,
    }

    export const enum BlendEquation {
        Add = 32774,
        Subtract = 32778,
        ReverseSubtract = 32779,
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
        Front = 1028,
        Back = 1029,
        FrontAndBack = 1032,
    }

    export const enum FrontFace {
        CW = 2304,
        CCW = 2305,
    }
}

declare namespace gltf {
    /**
     * glTF index.
     */
    export type Index = uint;//35713
    /**
     * 
     */
    export const enum Status {
        CompileStatus = 35713,
        LinkStatus = 35714,
    }
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
        Luminance = 6409,
    }
    /**
     * 
     */
    export const enum TextureType {
        Texture1D = -1,
        Texture1DArray = -1,
        Texture2D = 3553,
        Texture2DArray = 3553,
        Texture3D = 32879,
        TextureCube = 34067,
        TextureCubeArray = 34069,
    }
    /**
     * 
     */
    export const enum TextureDataType {
        UNSIGNED_BYTE = 5121,
        UNSIGNED_SHORT_5_6_5 = 33635,
        UNSIGNED_SHORT_4_4_4_4 = 32819,
        UNSIGNED_SHORT_5_5_5_1 = 32820,
    }
    /**
     * 
     */
    export const enum TextureFilter {
        Nearest = 9728,
        Linear = 9729,

        MearestMipmapNearest = 9984,
        LinearMipmapNearest = 9985,
        NearestMipMapLinear = 9986,
        LinearMipMapLinear = 9987,
    }
    /**
     * 
     */
    export const enum TextureWrappingMode {
        Repeat = 10497,
        ClampToEdge = 33071,
        MirroredRepeat = 33648,
    }
    /**
     * 
     */
    export const enum TextureAlignment {
        One = 1,
        Two = 2,
        Four = 4,
        Eight = 8,
    }
    /**
     * The shader stage.  All valid values correspond to WebGL enums.
     */
    export const enum ShaderStage {
        Fragment = 35632,
        Vertex = 35633,
    }
    /**
     * 
     */
    export const enum EnableState {
        Blend = 3042,
        CullFace = 2884,
        DepthTest = 2929,
        StencilTest = 2960,
        PolygonOffsetFill = 32823,
        SampleAlphaToCoverage = 32926,
    }
    /**
     * 
     */
    export const enum DepthFunc {
        Never = 512,
        Less = 513,
        Lequal = 515,
        Equal = 514,
        Greater = 516,
        NotEqual = 517,
        GEqual = 518,
        Always = 519,
    }
    /**
     * 
     */
    export const enum AttributeSemantics {
        POSITION = "POSITION",
        NORMAL = "NORMAL",
        TANGENT = "TANGENT",
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

        //
        _INSTANCE_DISTANCE = "_INSTANCE_DISTANCE",
        _INSTANCE_START = "_INSTANCE_START",
        _INSTANCE_END = "_INSTANCE_END",
        _INSTANCE_COLOR_START = "_INSTANCE_COLOR_START",
        _INSTANCE_COLOR_END = "_INSTANCE_COLOR_END",
        _INSTANCE_DISTANCE_START = "_INSTANCE_DISTANCE_START",
        _INSTANCE_DISTANCE_END = "_INSTANCE_DISTANCE_END",

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

    export const enum UniformSemantics {
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

        // _BINDMATRIX = "_BINDMATRIX",
        // _BINDMATRIXINVERSE = "_BINDMATRIXINVERSE",
        // _BONETEXTURE = "_BONETEXTURE",
        // _BONETEXTURESIZE = "_BONETEXTURESIZE",

        _RESOLUTION = "_RESOLUTION",

        _CLOCK = "_CLOCK",

        _VIEWPROJECTION = "_VIEWPROJECTION",
        _CAMERA_POS = "_CAMERA_POS",
        _CAMERA_UP = "_CAMERA_UP",
        _CAMERA_FORWARD = "_CAMERA_FORWARD",

        _AMBIENTLIGHTCOLOR = "_AMBIENTLIGHTCOLOR",
        _DIRECTLIGHTS = "_DIRECTLIGHTS",
        _SPOTLIGHTS = "_SPOTLIGHTS",
        _RECTAREALIGHTS = "_RECTAREALIGHTS",
        _POINTLIGHTS = "_POINTLIGHTS",
        _HEMILIGHTS = "_HEMILIGHTS",

        _DIRECTIONSHADOWMAT = "_DIRECTIONSHADOWMAT",
        _SPOTSHADOWMAT = "_SPOTSHADOWMAT",
        _POINTSHADOWMAT = "_POINTSHADOWMAT",
        _DIRECTIONSHADOWMAP = "_DIRECTIONSHADOWMAP",
        _POINTSHADOWMAP = "_POINTSHADOWMAP",
        _SPOTSHADOWMAP = "_SPOTSHADOWMAP",
        _LIGHTMAPTEX = "_LIGHTMAPTEX",
        _LIGHTMAPINTENSITY = "_LIGHTMAPINTENSITY",
        _LIGHTMAP_SCALE_OFFSET = "_LIGHTMAP_SCALE_OFFSET",

        _REFERENCEPOSITION = "_REFERENCEPOSITION",
        _NEARDICTANCE = "_NEARDICTANCE",
        _FARDISTANCE = "_FARDISTANCE",
        //
        _TONE_MAPPING_EXPOSURE = "_TONE_MAPPING_EXPOSURE",
        _TONE_MAPPING_WHITE_POINT = "_TONE_MAPPING_WHITE_POINT",

        _LOG_DEPTH_BUFFC = "_LOG_DEPTH_BUFFC",
        //
        _FOG_COLOR = "_FOG_COLOR",
        _FOG_DENSITY = "_FOG_DENSITY",
        _FOG_NEAR = "_FOG_NEAR",
        _FOG_FAR = "_FOG_FAR",
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
    /**
     * 
     */
    export type ImageSource = ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    /**
     * Indices of those attributes that deviate from their initialization value.
     */
    export interface AccessorSparseIndices {
        /**
         * The index of the bufferView with sparse indices. Referenced bufferView can't have ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER target.
         */
        bufferView: Index;
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
        bufferView: Index;
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
        bufferView?: Index;
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
         * Specifies if the attribute is a scalar, vector, or matrix.
         */
        typeCount?: number; // Modified by egret.
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
        node?: Index;
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
        sampler: Index;
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
        input: Index;
        /**
         * Interpolation algorithm.
         */
        interpolation?: "LINEAR" | "STEP" | "CUBICSPLINE" | string;
        /**
         * The index of an accessor, containing keyframe output values.
         */
        output: Index;
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
        buffer: Index;
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
        uri?: string | ImageSource | ((string | ImageSource)[]);
        /**
         * The image's MIME type.
         */
        mimeType?: "image/jpeg" | "image/png" | "image/ktx" | string;
        /**
         * The index of the bufferView that contains the image. Use this instead of the image's uri property.
         */
        bufferView?: Index | (Index[]);
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
        index: Index;
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
            POSITION?: Index;
            NORMAL?: Index;
            TANGENT?: Index;
            TEXCOORD_0?: Index;
            TEXCOORD_1?: Index;
            COLOR_0?: Index;
            COLOR_1?: Index;
            JOINTS_0?: Index;
            WEIGHTS_0?: Index;
            [k: string]: Index | undefined;
        };
        /**
         * The index of the accessor that contains the indices.
         */
        indices?: Index;
        /**
         * The index of the material to apply to this primitive when rendering.
         */
        material?: Index;
        /**
         * The type of primitives to render.
         */
        mode?: MeshPrimitiveMode;
        /**
         * An array of Morph Targets, each  Morph Target is a dictionary mapping attributes (only `POSITION`, `NORMAL`, and `TANGENT` supported) to their deviations in the Morph Target.
         */
        targets?: {
            [k: string]: Index;
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
        camera?: Index;
        /**
         * The indices of this node's children.
         */
        children?: Index[];
        /**
         * The index of the skin referenced by this node.
         */
        skin?: Index;
        /**
         * A floating-point 4x4 transformation matrix stored in column-major order.
         */
        matrix?: number[];
        /**
         * The index of the mesh in this node.
         */
        mesh?: Index;
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
         * @defaults gltf.TextureFilter.Nearest
         */
        magFilter?: gltf.TextureFilter;
        /**
         * Minification filter.
         * @defaults gltf.TextureFilter.Nearest
         */
        minFilter?: gltf.TextureFilter;
        /**
         * s wrapping mode.
         * @defaults gltf.TextureWrap.Repeat
         */
        wrapS?: TextureWrappingMode;
        /**
         * t wrapping mode.
         * @defaults gltf.TextureWrap.Repeat
         */
        wrapT?: TextureWrappingMode;
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
        nodes?: Index[];
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
        inverseBindMatrices?: Index;
        /**
         * The index of the node used as a skeleton root. When undefined, joints transforms resolve to scene root.
         */
        skeleton?: Index;
        /**
         * Indices of skeleton nodes, used as joints in this skin.
         */
        joints: Index[];
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
        sampler?: Index;
        /**
         * The index of the image used by this texture.
         */
        source?: Index;
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
        scene?: Index;
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
        type: ShaderStage;
        /**
         * The index of the bufferView that contains the GLSL shader source. Use this instead of the shader's uri property.
         */
        bufferView?: Index;
        name?: string;
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
        node?: Index;
        /**
         * The uniform type.
         */
        type: UniformType;
        /**
         * Identifies a uniform with a well-known meaning.
         */
        semantic?: string;
        /**
         * The value of the uniform.
         * TODO 默认值
         */
        value: UniformValue;
        name?: string;
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
        program?: Index;
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
        name?: string;
        states?: States;
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
        fragmentShader: Index;
        /**
         * The index of the vertex shader.
         */
        vertexShader: Index;
        /**
         * The names of required WebGL 1.0 extensions.
         */
        glExtensions?: string[];
        name?: string;
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
        // technique: Index; Modified by egret.
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
        blendEquationSeparate?: BlendEquation[];
        /**
         * Integer values passed to `blendFuncSeparate()`.
         */
        blendFuncSeparate?: BlendFactor[];
        /**
         * Boolean values passed to `colorMask()`. [red, green, blue, alpha].
         */
        colorMask?: boolean[];
        /**
         * Integer value passed to `cullFace()`.
         */
        cullFace?: CullFace[];
        /**
         * Integer values passed to `depthFunc()`.
         */
        depthFunc?: DepthFunc[];
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
        frontFace?: FrontFace[];
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
        enable?: EnableState[];
        /**
         * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
         */
        functions?: Functions;
        extensions?: any;
        extras?: any;
    }
}