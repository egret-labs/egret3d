declare namespace egret3d {
    class Vector3 implements paper.ISerializable {
        static readonly ZERO: Readonly<Vector3>;
        static readonly ONE: Readonly<Vector3>;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        serialize(): number[];
        deserialize(element: [number, number, number]): void;
        copy(value: Vector3): this;
        clone(): Vector3;
        set(x: number, y: number, z: number): this;
        normalize(): this;
        readonly length: number;
        readonly sqrtLength: number;
        static set(x: number, y: number, z: number, out: Vector3): Vector3;
        static normalize(v: Vector3): Vector3;
        static copy(v: Vector3, out: Vector3): Vector3;
        static add(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        static subtract(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        static multiply(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        static scale(v: Vector3, scale: number): Vector3;
        static cross(lhs: Vector3, rhs: Vector3, out: Vector3): Vector3;
        static dot(v1: Vector3, v2: Vector3): number;
        static getLength(v: Vector3): number;
        static getSqrLength(v: Vector3): number;
        static getDistance(a: Vector3, b: Vector3): number;
        static min(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        static max(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        static lerp(v1: Vector3, v2: Vector3, v: number, out: Vector3): Vector3;
        static equal(v1: Vector3, v2: Vector3, threshold?: number): boolean;
    }
    const helpVector3A: Vector3;
    const helpVector3B: Vector3;
    const helpVector3C: Vector3;
    const helpVector3D: Vector3;
    const helpVector3E: Vector3;
    const helpVector3F: Vector3;
    const helpVector3G: Vector3;
    const helpVector3H: Vector3;
}
declare namespace paper {
    const serializeClassMap: {
        [key: string]: string;
    };
    function findClassCode(name: string): string;
    function findClassCodeFrom(target: any): string;
}
declare namespace paper {
    /**
     * 标记序列化分类
     * 如果没有标记序列化分类，序列化后的对象只会收集在objects中
     * 如果被标记了某种序列化分类，序列化后的对象还会被单独收集到一个新的数组中，key即为类名
     * TODO 不能发布给开发者使用。
     */
    function serializedType(type: string): (clazz: Function) => void;
    /**
     * 标记序列化属性
     * 通过装饰器标记需要序列化的属性
     */
    function serializedField(classPrototype: any, type: string): void;
    /**
     * 标记反序列化时需要忽略的属性
     * 通过装饰器标记反序列化时需要被忽略的属性（但属性中引用的对象依然会被实例化）
     */
    function deserializedIgnore(classPrototype: any, type: string): void;
}
declare namespace egret3d {
    class Matrix {
        rawData: Float32Array;
        constructor(datas?: Float32Array | null);
        static set(n11: number, n21: number, n31: number, n41: number, n12: number, n22: number, n32: number, n42: number, n13: number, n23: number, n33: number, n43: number, n14: number, n24: number, n34: number, n44: number, matrix: Matrix): Matrix;
        static getScale(m: Matrix, out: Vector3): Vector3;
        static getTranslation(m: Matrix, out: Vector3): Vector3;
        static getQuaternion(m: Matrix, out: Quaternion): Quaternion;
        static add(left: Matrix, right: Matrix, out: Matrix): Matrix;
        static multiply(lhs: Matrix, rhs: Matrix, out: Matrix): Matrix;
        static scale(scaler: number, m: Matrix): Matrix;
        static transpose(m: Matrix, out: Matrix): Matrix;
        static inverse(src: Matrix, out: Matrix): Matrix;
        static decompose(m: Matrix, scale: Vector3, rotation: Quaternion, translation: Vector3): boolean;
        static copy(m: Matrix, out: Matrix): Matrix;
        static identify(m: Matrix): Matrix;
        static zero(m: Matrix): Matrix;
        static formScale(xScale: number, yScale: number, zScale: number, out: Matrix): Matrix;
        static fromTranslate(x: number, y: number, z: number, out: Matrix): Matrix;
        static fromRTS(p: Vector3, s: Vector3, q: Quaternion, out: Matrix): Matrix;
        static getVector3ByOffset(src: Matrix, offset: number, result: Vector3): Vector3;
        static transformVector3(vector: Vector3, transformation: Matrix, result: Vector3): Vector3;
        static transformNormal(vector: Vector3, transformation: Matrix, result: Vector3): Vector3;
        static lerp(left: Matrix, right: Matrix, v: number, out: Matrix): Matrix;
        static perspectiveProjectLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix): Matrix;
        static orthoProjectLH(width: number, height: number, znear: number, zfar: number, out: Matrix): Matrix;
        static toEulerAngles(matrix: Matrix, out: Vector3): Vector3;
        static determinant(matrix: Matrix): number;
    }
    const helpMatrixA: Matrix;
    const helpMatrixB: Matrix;
    const helpMatrixC: Matrix;
    const helpMatrixD: Matrix;
}
declare namespace paper {
    /**
     * 可序列化对象
     */
    abstract class SerializableObject implements IHashCode, ISerializable {
        /**
         * @inheritDoc
         */
        readonly hashCode: number;
        /**
         * @inheritDoc
         */
        serialize(): any;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
    }
}
declare namespace paper {
    /**
     * 组件基类
     */
    abstract class BaseComponent extends SerializableObject {
        /**
         * 组件挂载的 GameObject
         */
        readonly gameObject: GameObject;
        protected _enabled: boolean;
        /**
         * 添加组件后，内部初始化，在反序列化后被调用。
         */
        initialize(): void;
        /**
         * 移除组件后调用。
         */
        uninitialize(): void;
        serialize(): any;
        deserialize(element: any): void;
        /**
         * 组件自身的激活状态
         */
        enabled: boolean;
        /**
         * 获取组件在场景中的激活状态
         */
        readonly isActiveAndEnabled: boolean;
    }
}
declare namespace paper {
    type InterestConfig<T extends BaseComponent> = {
        componentClass: {
            new (): T;
        };
        listeners?: {
            type: string;
            listener: (component: T) => void;
        }[];
    };
    /**
     * 基础系统。
     */
    abstract class BaseSystem<T extends BaseComponent> {
        /**
         * 是否更新该系统。
         */
        enable: boolean;
        /**
         * 系统对于每个实体关心的组件总数。
         */
        protected _interestComponentCount: number;
        /**
         * 关心列表。
         */
        protected readonly _interests: InterestConfig<T>[];
        protected readonly _components: T[];
        private readonly _gameObjectOffsets;
        protected _onAddComponent(component: T): boolean;
        protected _onRemoveComponent(component: T): boolean;
        /**
         * 系统内部根据关心列表的顺序快速查找指定组件。
         */
        protected _getComponent(gameObject: GameObject, componentOffset: number): T;
        initialize(): void;
        uninitialize(): void;
        abstract update(): void;
        /**
         * 该系统所关心的所有组件。
         */
        readonly components: ReadonlyArray<T>;
    }
}
declare namespace paper {
    /**
     * Base Class for Asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 资源基类，扩展资源类型需要继承此抽象类
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    abstract class Asset extends SerializableObject {
        private static readonly _assets;
        /**
         * 注册资源
         * 通过此方法注册后，引擎内部可以通过URL字典访问所有注册的资源
         * 使用外部加载器时，需要在加载完成后注册该资源
         */
        static register(asset: Asset, isLoad?: boolean): void;
        /**
         * 获取资源
         * @param name 资源的url
         */
        static find<T extends Asset>(name: string): any;
        /**
         *
         * 资源的原始URL
         */
        url: string;
        /**
         * get asset name
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 名称。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        name: string;
        /**
         *
         */
        constructor(name?: string, url?: string);
        /**
         * @inheritDoc
         */
        serialize(): any;
        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        abstract caclByteLength(): number;
        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        abstract dispose(): void;
    }
}
declare namespace egret3d {
    type RunEgretOptions = {
        antialias: boolean;
        defaultScene?: string;
        isEditor?: boolean;
        isPlaying?: boolean;
    };
    type RequiredRuntimeOptions = {
        antialias: boolean;
        contentWidth: number;
        contentHeight: number;
    };
    /**
     * 引擎启动入口
     */
    function runEgret(options?: RunEgretOptions): void;
}
interface Window {
    canvas: HTMLCanvasElement;
    paper: any;
    egret3d: any;
}
declare namespace gltf {
    /**
     * glTF index.
     */
    type GLTFIndex = number;
    /**
     * BufferView target.
     */
    const enum BufferViewTarget {
        ArrayBuffer = 34962,
        ElementArrayBuffer = 34963,
    }
    /**
     * Component type.
     */
    const enum ComponentType {
        Byte = 5120,
        UnsignedByte = 5121,
        Short = 5122,
        UnsignedShort = 5123,
        Int = 5124,
        UnsignedInt = 5125,
        Float = 5126,
    }
    const enum MeshPrimitiveMode {
        Points = 0,
        Lines = 1,
        LineLoop = 2,
        LineStrip = 3,
        Triangles = 4,
        TrianglesStrip = 5,
        TrianglesFan = 6,
    }
    const enum AccessorType {
        SCALAR = "SCALAR",
        VEC2 = "VEC2",
        VEC3 = "VEC3",
        VEC4 = "VEC4",
        MAT2 = "MAT2",
        MAT3 = "MAT3",
        MAT4 = "MAT4",
    }
    const enum MeshAttributeType {
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
    type MeshAttribute = MeshAttributeType | string;
    /**
     * Indices of those attributes that deviate from their initialization value.
     */
    interface AccessorSparseIndices {
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
    }
    /**
     * Array of size `accessor.sparse.count` times number of components storing the displaced accessor attributes pointed by `accessor.sparse.indices`.
     */
    interface AccessorSparseValues {
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
    }
    /**
     * Sparse storage of attributes that deviate from their initialization value.
     */
    interface AccessorSparse {
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
    }
    /**
     * A typed view into a bufferView.  A bufferView contains raw binary data.  An accessor provides a typed view into a bufferView or a subset of a bufferView similar to how WebGL's `vertexAttribPointer()` defines an attribute in a buffer.
     */
    interface Accessor {
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
    }
    /**
     * The index of the node and TRS property that an animation channel targets.
     */
    interface AnimationChannelTarget {
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
    }
    /**
     * Targets an animation's sampler at a node's property.
     */
    interface AnimationChannel {
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
    }
    /**
     * Combines input and output accessors with an interpolation algorithm to define a keyframe graph (but not its target).
     */
    interface AnimationSampler {
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
    }
    /**
     * A keyframe animation.
     */
    interface Animation {
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
    }
    /**
     * Metadata about the glTF asset.
     */
    interface Asset {
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
    }
    /**
     * A buffer points to binary geometry, animation, or skins.
     */
    interface Buffer {
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
    }
    /**
     * A view into a buffer generally representing a subset of the buffer.
     */
    interface BufferView {
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
    }
    /**
     * An orthographic camera containing properties to create an orthographic projection matrix.
     */
    interface CameraOrthographic {
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
    }
    /**
     * A perspective camera containing properties to create a perspective projection matrix.
     */
    interface CameraPerspective {
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
    }
    /**
     * A camera's projection.  A node can reference a camera to apply a transform to place the camera in the scene.
     */
    interface Camera {
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
    }
    /**
     * Image data used to create a texture. Image can be referenced by URI or `bufferView` index. `mimeType` is required in the latter case.
     */
    interface Image {
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
    }
    /**
     * Reference to a texture.
     */
    interface TextureInfo {
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
    }
    /**
     * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.
     */
    interface MaterialPbrMetallicRoughness {
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
    }
    interface MaterialNormalTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * The scalar multiplier applied to each normal vector of the normal texture.
         */
        scale?: number;
        extensions?: any;
        extras?: any;
    }
    interface MaterialOcclusionTextureInfo {
        index?: any;
        texCoord?: any;
        /**
         * A scalar multiplier controlling the amount of occlusion applied.
         */
        strength?: number;
        extensions?: any;
        extras?: any;
    }
    /**
     * The material appearance of a primitive.
     */
    interface Material {
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
    }
    /**
     * Geometry to be rendered with the given material.
     */
    interface MeshPrimitive {
        /**
         * A dictionary object, where each key corresponds to mesh attribute semantic and each value is the index of the accessor containing attribute's data.
         */
        attributes: {
            POSITION: GLTFIndex;
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
    }
    /**
     * A set of primitives to be rendered.  A node can contain one mesh.  A node's transform places the mesh in the scene.
     */
    interface Mesh {
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
    }
    /**
     * A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` must contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node can have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), only TRS properties may be present; `matrix` will not be present.
     */
    interface Node {
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
    }
    /**
     * Texture sampler properties for filtering and wrapping modes.
     */
    interface Sampler {
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
    }
    /**
     * The root nodes of a scene.
     */
    interface Scene {
        /**
         * The indices of each root node.
         */
        nodes?: GLTFIndex[];
        name?: string;
        extensions?: any;
        extras?: any;
    }
    /**
     * Joints and matrices defining a skin.
     */
    interface Skin {
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
    }
    /**
     * A texture and its sampler.
     */
    interface Texture {
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
    }
    /**
     * The root object for a glTF asset.
     */
    interface GLTF {
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
    }
}
declare namespace paper.editor {
    /**属性信息 */
    class PropertyInfo {
        /**属性名称 */
        name: string;
        /**编辑类型 */
        editType: EditType;
        /**属性配置 */
        option: PropertyOption;
        constructor(name?: string, editType?: EditType, option?: PropertyOption);
    }
    /**属性配置 */
    type PropertyOption = {
        /**赋值函数*/
        set?: string;
        /**下拉项*/
        listItems?: {
            label: string;
            value: any;
        }[];
    };
    /**编辑类型 */
    enum EditType {
        /**数字输入 */
        NUMBER = 0,
        /**文本输入 */
        TEXT = 1,
        /**选中框 */
        CHECKBOX = 2,
        /**vertor2 */
        VECTOR2 = 3,
        /**vertor3 */
        VECTOR3 = 4,
        /**vertor4 */
        VECTOR4 = 5,
        /**Quaternion */
        QUATERNION = 6,
        /**颜色选择器 */
        COLOR = 7,
        /**下拉 */
        LIST = 8,
        /**Rect */
        RECT = 9,
        /**材质 */
        MATERIAL = 10,
        /**材质数组 */
        MATERIAL_ARRAY = 11,
        /**游戏对象 */
        GAMEOBJECT = 12,
        /**变换 */
        TRANSFROM = 13,
        /**声音 */
        SOUND = 14,
        /**Mesh */
        MESH = 15,
        /**数组 */
        ARRAY = 16,
    }
    /**
     * 装饰器:自定义
     */
    function custom(): (target: any) => void;
    /**
     * 装饰器:属性
     * @param editType 编辑类型
     */
    function property(editType?: EditType, option?: PropertyOption): (target: any, property: string) => void;
    /**
     * 检测一个实例对象是否为已被自定义
     * @param classInstance 实例对象
     */
    function isCustom(classInstance: any): boolean;
    /**
     * 获取一个实例对象的编辑信息
     * @param classInstance 实例对象
     */
    function getEditInfo(classInstance: any): PropertyInfo[];
    /**
     * 装饰器:属性
     * @param editType 编辑类型
     */
    function extraProperty(editType?: EditType, option?: PropertyOption): (target: any, property: string) => void;
    /**
     * 额外信息
     * @param classInstance 实例对象
     */
    function getExtraInfo(classInstance: any): PropertyInfo[];
}
declare namespace paper {
    /**
     * SystemManager 是ecs内部的系统管理者，负责每帧循环时轮询每个系统。
     */
    class SystemManager {
        private readonly _systems;
        private readonly _unregisterSystems;
        private _checkRegistered(systemClass);
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param level 系统的优先级，越小越早执行。
         */
        register(systemClass: {
            new (): BaseSystem<any>;
        }, level?: number): void;
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的前面。
         */
        registerBefore(systemClass: {
            new (): BaseSystem<any>;
        }, target: {
            new (): BaseSystem<any>;
        }): void;
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的后面。
         */
        registerAfter(systemClass: {
            new (): BaseSystem<any>;
        }, target: {
            new (): BaseSystem<any>;
        }): void;
        /**
         * 注销一个管理器中的系统
         * @param systemClass 要注销的系统
         */
        unregister(systemClass: {
            new (): BaseSystem<any>;
        }): void;
        /**
         *
         */
        enableSystem(systemClass: {
            new (): BaseSystem<any>;
        }): void;
        /**
         *
         */
        disableSystem(systemClass: {
            new (): BaseSystem<any>;
        }): void;
        /**
         *
         */
        getSystemEnabled(systemClass: {
            new (): BaseSystem<any>;
        }): boolean;
        /**
         * 获取一个管理器中指定的系统实例。
         */
        getSystem<T extends BaseSystem<any>>(systemClass: {
            new (): T;
        }): T;
        /**
         *
         */
        update(): void;
    }
}
declare namespace egret3d {
    class Vector2 implements paper.ISerializable {
        static readonly ZERO: Readonly<Vector2>;
        static readonly ONE: Readonly<Vector2>;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        serialize(): number[];
        deserialize(element: [number, number]): void;
        copy(value: Vector2): this;
        clone(): Vector2;
        set(x: number, y: number): this;
        normalize(): this;
        readonly length: number;
        readonly sqrtLength: number;
        static set(x: number, y: number, out: Vector2): Vector2;
        static normalize(v: Vector2): Vector2;
        static add(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static subtract(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static multiply(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static dot(v1: Vector2, v2: Vector2): number;
        static scale(v: Vector2, scaler: number): Vector2;
        static getLength(v: Vector2): number;
        static getDistance(v1: Vector2, v2: Vector2): number;
        static copy(v: Vector2, out: Vector2): Vector2;
        static equal(v1: Vector2, v2: Vector2, threshold?: number): boolean;
        static lerp(v1: Vector2, v2: Vector2, value: number, out: Vector2): Vector2;
    }
}
declare namespace paper {
    /**
     * 场景管理器
     */
    class SceneManager {
        private readonly _scenes;
        private readonly _globalObjects;
        _addScene(scene: Scene): void;
        /**
         * 创建一个空场景并激活
         */
        createScene(name: string): Scene;
        /**
         * load scene 加载场景
         * @param rawScene url
         */
        loadScene(url: string): any;
        /**
         * 卸载指定场景，如果创建列表为空，则创建一个空场景。
         */
        unloadScene(scene: Scene): void;
        /**
         * 卸载所有场景，并创建一个默认场景。
         */
        unloadAllScene(): void;
        /**
         *
         */
        addGlobalObject(gameObject: GameObject): void;
        /**
         *
         */
        removeGlobalObject(gameObject: GameObject): void;
        /**
         *
         */
        getSceneByName(name: string): Scene;
        /**
         *
         */
        getSceneByURL(url: string): Scene;
        /**
         *
         */
        readonly globalObjects: ReadonlyArray<GameObject>;
        /**
         * 获取当前激活的场景
         */
        readonly activeScene: Scene;
        /**
         * @deprecated
         */
        getActiveScene(): Scene;
    }
}
declare namespace paper.editor {
    interface IEventDispatcher {
        addEventListener(type: string, fun: Function, thisObj: any): void;
        removeEventListener(type: string, fun: Function, thisObj: any): void;
        dispatchEvent(event: BaseEvent): void;
    }
    /**
     * 事件派发器
     */
    class EventDispatcher implements IEventDispatcher {
        __z_e_listeners: any;
        constructor();
        addEventListener(type: string, fun: Function, thisObj: any, level?: number): void;
        removeEventListener(type: string, fun: Function, thisObj: any): void;
        dispatchEvent(event: BaseEvent): void;
    }
    /**
     * 事件
     */
    class BaseEvent {
        type: string;
        data: any;
        constructor(type: string, data?: any);
    }
}
declare namespace egret3d {
    class Quaternion implements paper.ISerializable {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        serialize(): number[];
        deserialize(element: number[]): void;
        copy(value: Vector4): this;
        clone(): Vector4;
        set(x: number, y: number, z: number, w: number): this;
        normalize(): this;
        static set(x: number, y: number, z: number, w: number, out: Quaternion): Quaternion;
        static getMagnitude(src: Quaternion): number;
        static fromYawPitchRoll(yaw: number, pitch: number, roll: number, out: Quaternion): Quaternion;
        static fromEulerAngles(ax: number, ay: number, az: number, out: Quaternion): Quaternion;
        static fromAxisAngle(axis: Vector3, angle: number, out: Quaternion): Quaternion;
        static fromMatrix(matrix: Matrix, out: Quaternion): Quaternion;
        static lookAt(pos: Vector3, target: Vector3, out: Quaternion): Quaternion;
        static lookAtWithUp(pos: Vector3, target: Vector3, up: Vector3, out: Quaternion): Quaternion;
        static multiply(q1: Quaternion, q2: Quaternion, out: Quaternion): Quaternion;
        static normalize(out: Quaternion): Quaternion;
        static copy(q: Quaternion, out: Quaternion): Quaternion;
        static inverse(q: Quaternion): Quaternion;
        static toEulerAngles(q: Quaternion, out: Vector3): Vector3;
        static toMatrix(q: Quaternion, out: Matrix): Matrix;
        static toAxisAngle(q: Quaternion, axis: Vector3): number;
        static transformVector3(src: Quaternion, vector: Vector3, out: Vector3): Vector3;
        static transformVector3ByQuaternionData(src: Float32Array, srcseek: number, vector: Vector3, out: Vector3): Vector3;
        static multiplyByQuaternionData(srca: Float32Array, srcaseek: number, srcb: Quaternion, out: Quaternion): Quaternion;
        static lerp(srca: Quaternion, srcb: Quaternion, out: Quaternion, t: number): Quaternion;
    }
}
declare namespace egret3d {
    class Color implements paper.ISerializable {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        serialize(): number[];
        deserialize(element: number[]): void;
        static set(r: number, g: number, b: number, a: number, out: Color): Color;
        static multiply(c1: Color, c2: Color, out: Color): Color;
        static scale(c: Color, scaler: number): Color;
        static copy(c: Color, out: Color): Color;
        static lerp(c1: Color, c2: Color, value: number, out: Color): Color;
    }
}
declare namespace egret3d {
    class WebGLCapabilities {
        version: number;
        precision: string;
        maxPrecision: string;
        maxTextures: number;
        maxVertexTextures: number;
        maxTextureSize: number;
        maxCubemapSize: number;
        maxVertexUniformVectors: number;
        floatTextures: boolean;
        anisotropyExt: EXT_texture_filter_anisotropic;
        shaderTextureLOD: any;
        maxAnisotropy: number;
        maxRenderTextureSize: number;
        standardDerivatives: boolean;
        s3tc: WEBGL_compressed_texture_s3tc;
        textureFloat: boolean;
        textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        initialize(gl: WebGLRenderingContext): void;
    }
}
declare namespace egret3d {
    class EventDispatcher {
        private _eventMap;
        addEventListener(type: string, listener: Function, thisObject: any): void;
        removeEventListener(type: string, listener: Function, thisObject: any): void;
        dispatchEvent(event: any): void;
        private notifyListener(event);
    }
}
declare namespace egret3d.sound {
    /**
     *
     */
    class WebAudioChannel2D {
        protected source: AudioBufferSourceNode;
        protected gain: GainNode;
        constructor();
        protected _init(): void;
        buffer: AudioBuffer;
        volume: number;
        loop: boolean;
        start(offset?: number): void;
        stop(): void;
        dispose(): void;
    }
}
declare namespace egret3d {
    /**
     * Camera系统
     */
    class CameraSystem extends paper.BaseSystem<Camera> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof Camera;
        }[];
        private _applyDrawCall(context, draw);
        $renderCamera(camera: Camera): void;
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    type PrefabConfig = {
        assets: any[];
        objects: any[];
    };
    /**
     *
     */
    class BaseObjectAsset extends paper.Asset {
        protected readonly _assets: any;
        protected _raw: PrefabConfig;
        $parse(json: PrefabConfig): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
    }
    /**
     * prefab asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 预制件资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Prefab extends BaseObjectAsset {
        /**
         * Create instance from this prefab.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从当前预制件生成一个实例。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        createInstance(): paper.GameObject;
        /**
         * @deprecated
         */
        getClone(): paper.GameObject;
    }
}
declare namespace egret3d.particle {
    const BillboardPerVertexCount = 37;
    const MeshPerVertexCount = 42;
    const enum ParticleRendererEventType {
        Mesh = "mesh",
        Materials = "materials",
        RenderMode = "renderMode",
    }
    const enum ParticleSortMode {
        None = 0,
        Distance = 1,
        OldestInFront = 2,
        YoungestInFront = 3,
    }
    const enum ParticleRenderSpace {
        View = 0,
        World = 1,
        Local = 2,
        Facing = 3,
    }
    const enum ParticleRenderMode {
        Billboard = 0,
        Stretch = 1,
        HorizontalBillboard = 2,
        VerticalBillboard = 3,
        Mesh = 4,
        None = 5,
    }
    /**
     * 粒子着色器用到的属性
     */
    const enum ParticleMaterialAttribute {
        POSITION = "POSITION",
        COLOR_0 = "COLOR_0",
        TEXCOORD_0 = "TEXCOORD_0",
        CORNER = "CORNER",
        START_POSITION = "START_POSITION",
        START_VELOCITY = "START_VELOCITY",
        START_COLOR = "START_COLOR",
        START_SIZE = "START_SIZE",
        START_ROTATION = "START_ROTATION",
        TIME = "TIME",
        RANDOM0 = "RANDOM0",
        RANDOM1 = "RANDOM1",
        WORLD_POSITION = "WORLD_POSITION",
        WORLD_ROTATION = "WORLD_ROTATION",
    }
    /**
     * 粒子着色器用到的变量
     */
    const enum ParticleMaterialUniform {
        WORLD_POSITION = "u_worldPosition",
        WORLD_ROTATION = "u_worldRotation",
        POSITION_SCALE = "u_positionScale",
        SIZE_SCALE = "u_sizeScale",
        SCALING_MODE = "u_scalingMode",
        GRAVIT = "u_gravity",
        START_SIZE3D = "u_startSize3D",
        SIMULATION_SPACE = "u_simulationSpace",
        CURRENTTIME = "u_currentTime",
        ALPHAS_GRADIENT = "u_alphaGradient",
        COLOR_GRADIENT = "u_colorGradient",
        ALPHA_GRADIENT_MAX = "u_alphaGradientMax",
        COLOR_GRADIENT_MAX = "u_colorGradientMax",
        VELOCITY_CONST = "u_velocityConst",
        VELOCITY_CURVE_X = "u_velocityCurveX",
        VELOCITY_CURVE_Y = "u_velocityCurveY",
        VELOCITY_CURVE_Z = "u_velocityCurveZ",
        VELOCITY_CONST_MAX = "u_velocityConstMax",
        VELOCITY_CURVE_MAX_X = "u_velocityCurveMaxX",
        VELOCITY_CURVE_MAX_Y = "u_velocityCurveMaxY",
        VELOCITY_CURVE_MAX_Z = "u_velocityCurveMaxZ",
        SPACE_TYPE = "u_spaceType",
        SIZE_CURVE = "u_sizeCurve",
        SIZE_CURVE_X = "u_sizeCurveX",
        SIZE_CURVE_Y = "u_sizeCurveY",
        SIZE_CURVE_Z = "u_sizeCurveZ",
        SIZE_CURVE_MAX = "u_sizeCurveMax",
        SIZE_CURVE_MAX_X = "u_sizeCurveMaxX",
        SIZE_CURVE_MAX_Y = "u_sizeCurveMaxY",
        SIZE_CURVE_MAX_Z = "u_sizeCurveMaxZ",
        ROTATION_CONST = "u_rotationConst",
        ROTATION_CONST_SEPRARATE = "u_rotationConstSeprarate",
        ROTATION_CURVE = "u_rotationCurve",
        ROTATE_CURVE_X = "u_rotationCurveX",
        ROTATE_CURVE_y = "u_rotationCurveY",
        ROTATE_CURVE_Z = "u_rotationCurveZ",
        ROTATE_CURVE_W = "u_rotationCurveW",
        ROTATION_CONST_MAX = "u_rotationConstMax",
        ROTATION_CONST_MAX_SEPRARATE = "u_rotationConstMaxSeprarate",
        ROTATION_CURVE_MAX = "u_rotationCurveMax",
        ROTATION_CURVE_MAX_X = "u_rotationCurveMaxX",
        ROTATION_CURVE_MAX_Y = "u_rotationCurveMaxY",
        ROTATION_CURVE_MAX_Z = "u_rotationCurveMaxZ",
        ROTATION_CURVE_MAX_W = "u_rotationCurveMaxW",
        CYCLES = "u_cycles",
        SUB_UV_SIZE = "u_subUVSize",
        UV_CURVE = "u_uvCurve",
        UV_CURVE_MAX = "u_uvCurveMax",
        LENGTH_SCALE = "u_lengthScale",
        SPEED_SCALE = "u_speeaScale",
    }
    /**
     * 粒子着色器用到的宏定义
     */
    const enum ParticleMaterialDefine {
        SPHERHBILLBOARD = "SPHERHBILLBOARD",
        STRETCHEDBILLBOARD = "STRETCHEDBILLBOARD",
        HORIZONTALBILLBOARD = "HORIZONTALBILLBOARD",
        VERTICALBILLBOARD = "VERTICALBILLBOARD",
        ROTATIONOVERLIFETIME = "ROTATIONOVERLIFETIME",
        ROTATIONCONSTANT = "ROTATIONCONSTANT",
        ROTATIONTWOCONSTANTS = "ROTATIONTWOCONSTANTS",
        ROTATIONSEPERATE = "ROTATIONSEPERATE",
        ROTATIONCURVE = "ROTATIONCURVE",
        ROTATIONTWOCURVES = "ROTATIONTWOCURVES",
        TEXTURESHEETANIMATIONCURVE = "TEXTURESHEETANIMATIONCURVE",
        TEXTURESHEETANIMATIONTWOCURVE = "TEXTURESHEETANIMATIONTWOCURVE",
        VELOCITYCONSTANT = "VELOCITYCONSTANT",
        VELOCITYCURVE = "VELOCITYCURVE",
        VELOCITYTWOCONSTANT = "VELOCITYTWOCONSTANT",
        VELOCITYTWOCURVE = "VELOCITYTWOCURVE",
        COLOROGRADIENT = "COLOROGRADIENT",
        COLORTWOGRADIENTS = "COLORTWOGRADIENTS",
        SIZECURVE = "SIZECURVE",
        SIZETWOCURVES = "SIZETWOCURVES",
        SIZECURVESEPERATE = "SIZECURVESEPERATE",
        SIZETWOCURVESSEPERATE = "SIZETWOCURVESSEPERATE",
        RENDERMESH = "RENDERMESH",
        SHAPE = "SHAPE",
    }
    /**
     * 渲染类型为Mesh的属性格式
     */
    const MeshShaderAttributeFormat: {
        key: string;
        type: gltf.AccessorType;
    }[];
    /**
     * 渲染类型为Billboard的属性格式
     */
    const BillboardShaderAttributeFormat: {
        key: string;
        type: gltf.AccessorType;
    }[];
    class ParticleRenderer extends paper.BaseComponent implements paper.IRenderer {
        private _mesh;
        private readonly _materials;
        maxParticleSize: number;
        minParticleSize: number;
        velocityScale: number;
        _renderMode: ParticleRenderMode;
        lengthScale: number;
        deserialize(element: any): void;
        uninitialize(): void;
        /**
         * mesh model
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 组件挂载的 mesh 模型
         * @version paper 1.0
         * @platform Web
         * @language
         */
        mesh: Mesh | null;
        /**
         * material list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质数组
         * @version paper 1.0
         * @platform Web
         * @language
         */
        materials: ReadonlyArray<Material>;
        renderMode: ParticleRenderMode;
    }
}
declare namespace paper {
    /**
     * 标记组件是否在编辑模式也拥有生命周期。
     */
    function executeInEditMode<T extends Behaviour>(target: {
        new (gameObject: paper.GameObject): T;
    }): void;
    /**
     * 脚本系统
     * 该系统负责执行脚本逻辑代码
     */
    class BehaviourSystem extends paper.BaseSystem<Behaviour> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: any;
        }[];
        private readonly _onResetBehaviours;
        private readonly _onEnableBehaviours;
        private readonly _onStartBehaviours;
        private readonly _onDisableBehaviours;
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: Behaviour): boolean;
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: Behaviour): boolean;
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace paper {
    /**
     * 脚本组件。
     * 生命周期的顺序。
     * - onAwake();
     * - System._onCreateComponent();
     * - onEnable();
     * - onReset();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onLateUpdate();
     * - onDisable();
     * - System._onDestroyComponent();
     * - onDestroy();
     */
    class Behaviour extends BaseComponent {
        initialize(): void;
        uninitialize(): void;
        /**
         * 当一个脚本实例被载入时Awake被调用，要先于Start。
         */
        onAwake(): void;
        /**
         * 物体启用时被调用
         */
        onEnable(): void;
        onReset(): void;
        /**
         * Start仅在物体实例化完成后，Update函数第一次被调用前调用。
         */
        onStart(): void;
        /**
         * 这个函数会在每个固定的物理时间片被调用一次.这是放置游戏基本物理行为代码的地方。
         * （暂未实现）
         */
        onFixedUpdate(): void;
        /**
         * 当Behaviour启用时,其Update在每一帧被调用
         */
        onUpdate(delta: number): void;
        onLateUpdate(delta: number): void;
        /**
         * 物体被禁用时调用
         */
        onDisable(): void;
        /**
         * 物体被删除时调用
         */
        onDestroy(): void;
        /**
         * 碰撞时调用
         */
        onCollide(collider: any): void;
    }
}
declare namespace egret3d {
    class Vector4 implements paper.ISerializable {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        serialize(): number[];
        deserialize(element: [number, number, number, number]): void;
        copy(value: Vector4): this;
        clone(): Vector4;
        set(x: number, y: number, z: number, w: number): this;
        normalize(): this;
        static set(x: number, y: number, z: number, w: number, out: Vector4): Vector4;
        static copy(v: Vector4, out: Vector4): Vector4;
    }
    const helpVector4A: Vector4;
    const helpVector4B: Vector4;
    const helpVector4C: Vector4;
    const helpVector4D: Vector4;
    const helpVector4E: Vector4;
    const helpVector4F: Vector4;
}
declare namespace paper {
    /**
     *
     */
    namespace EventPool {
        /**
         *
         */
        const enum EventType {
            Enabled = "__enabled__",
            Disabled = "__disabled__",
        }
        /**
         * 事件回调类型
         */
        type EventListener<T extends BaseComponent> = (component: T, extend?: any) => void;
        /**
         * 添加事件监听
         */
        function addEventListener<T extends BaseComponent>(eventType: string, componentClass: {
            new (): T;
        }, callback: EventListener<T>): void;
        /**
         * 移除事件监听
         */
        function removeEventListener<T extends BaseComponent>(eventType: string, componentClass: {
            new (): T;
        }, callback: EventListener<T>): void;
        /**
         * 移除所有该类型的事件监听
         */
        function removeAllEventListener<T extends BaseComponent>(eventType: string, componentClass: {
            new (): T;
        }): void;
        /**
         * 发送组件事件:
         * @param type event type:
         * @param component component
         */
        function dispatchEvent<T extends BaseComponent>(type: string, component: T, extend?: any): void;
    }
}
declare namespace paper {
    /**
     * 可以挂载Component的实体类。
     */
    class GameObject extends paper.SerializableObject {
        /**
         * 返回当前激活场景中查找对应名称的GameObject
         * @param name
         */
        static find(name: string): GameObject | null;
        /**
         * 返回一个在当前激活场景中查找对应tag的GameObject
         * @param tag
         */
        static findWithTag(tag: string): GameObject | null;
        /**
         * 返回所有在当前激活场景中查找对应tag的GameObject
         * @param name
         */
        static findGameObjectsWithTag(tag: string): GameObject[];
        /**
         * 是否是静态，启用这个属性可以提升性能
         */
        isStatic: boolean;
        /**
         * 层级
         */
        layer: Layer;
        /**
         * 名称
         */
        name: string;
        /**
         * 标签
         */
        tag: string;
        /**
         * 变换组件
         */
        transform: egret3d.Transform;
        /**
         * 预制体
         */
        readonly prefab: egret3d.Prefab | null;
        private _destroyed;
        private _activeSelf;
        private _activeInHierarchy;
        private _activeDirty;
        private readonly _components;
        private _scene;
        /**
         * 创建GameObject，并添加到当前场景中
         */
        constructor(name?: string, tag?: string);
        private _removeComponentReference(component);
        private _getComponentsInChildren<T>(componentClass, child, array);
        /**
         *
         */
        destroy(): void;
        /**
         *
         */
        dontDestroy(): void;
        /**
         * 根据类型名获取组件
         */
        addComponent<T extends paper.BaseComponent>(componentClass: {
            new (): T;
        }): T;
        /**
         * 移除组件
         */
        removeComponent<T extends paper.BaseComponent>(componentInstanceOrClass: {
            new (): T;
        } | T): void;
        /**
         * 移除自身的所有组件
         */
        removeAllComponents(): void;
        /**
         * 根据类型名获取组件
         */
        getComponent<T extends paper.BaseComponent>(componentClass: {
            new (): T;
        }): T;
        /**
         * 搜索自己和父节点中所有特定类型的组件
         */
        getComponentInParent<T extends paper.BaseComponent>(componentClass: {
            new (): T;
        }): T;
        /**
         * 搜索自己和子节点中所有特定类型的组件
         */
        getComponentsInChildren<T extends paper.BaseComponent>(componentClass: {
            new (): T;
        }): T[];
        /**
         * 针对同级的组件发送消息
         * @param methodName
         * @param parameter
         */
        sendMessage(methodName: string, parameter?: any, requireReceiver?: boolean): void;
        /**
         * 针对直接父级发送消息
         * @param methodName
         * @param parameter
         */
        sendMessageUpwards(methodName: string, parameter?: any, requireReceiver?: boolean): void;
        /**
         * 群发消息
         * @param methodName
         * @param parameter
         */
        broadcastMessage(methodName: string, parameter?: any, requireReceiver?: boolean): void;
        /**
         * 当前GameObject对象自身激活状态
         */
        activeSelf: boolean;
        /**
         * 获取当前GameObject对象在场景中激活状态。
         * 如果当前对象父级的activeSelf为false，那么当前GameObject对象在场景中为禁用状态。
         */
        readonly activeInHierarchy: boolean;
        /**
         * 组件列表
         */
        /**
         * 仅用于反序列化。
         * @internal
         */
        components: ReadonlyArray<BaseComponent>;
        /**
         * 获取物体所在场景实例。
         */
        readonly scene: Scene;
    }
}
declare namespace paper {
    /**
     * 这里暂未实现用户自定义层级，但用户可以使用预留的UserLayer。
     * 这个属性可以实现相机的选择性剔除。
     */
    const enum Layer {
        Default = 2,
        UI = 4,
        UserLayer1 = 8,
        UserLayer2 = 16,
        UserLayer3 = 32,
        UserLayer4 = 64,
        UserLayer5 = 128,
        UserLayer6 = 240,
        UserLayer7 = 256,
        UserLayer8 = 512,
        UserLayer9 = 1024,
        UserLayer10 = 2048,
        UserLayer11 = 3840,
    }
}
declare namespace paper {
    /**
     * 场景类
     */
    class Scene extends SerializableObject {
        /**
         *
         */
        static defaultName: string;
        /**
         * 场景名称。
         */
        name: string;
        /**
         * 场景的light map列表。
         */
        readonly lightmaps: egret3d.Texture[];
        /**
         * 当前场景的所有GameObject对象池
         *
         */
        readonly gameObjects: GameObject[];
        /**
         * 存储着关联的数据
         * 场景保存时，将场景快照数据保存至对应的资源中
         *
         */
        $rawScene: egret3d.RawScene | null;
        constructor();
        /**
         * 移除GameObject对象
         *
         */
        $removeGameObject(gameObject: GameObject): void;
        /**
         * 添加一个GameObject对象
         *
         */
        $addGameObject(gameObject: GameObject): void;
        /**
         * 获取所有根级GameObject对象
         */
        getRootGameObjects(): GameObject[];
    }
}
declare namespace egret3d {
    /**
     * 矩形对象
     */
    interface RectData {
        x: number;
        y: number;
        w: number;
        h: number;
    }
    /**
     * 矩形可序列化对象
     */
    class Rect implements RectData, paper.ISerializable {
        /**
         *
         */
        x: number;
        /**
         *
         */
        y: number;
        /**
         *
         */
        w: number;
        /**
         *
         */
        h: number;
        /**
         *
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
        /**
         * @inheritDoc
         */
        serialize(): number[];
        /**
         * @inheritDoc
         */
        deserialize(element: number[]): void;
    }
}
declare namespace paper {
    class Time {
        static timeScale: number;
        private static _frameCount;
        private static _lastTimer;
        private static _beginTimer;
        private static _unscaledTime;
        private static _unscaledDeltaTime;
        static initialize(): void;
        static update(timer?: number): void;
        static readonly frameCount: number;
        static readonly time: number;
        static readonly unscaledTime: number;
        static readonly deltaTime: number;
        static readonly unscaledDeltaTime: number;
    }
}
declare namespace egret3d {
    /**
     * aabb box
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 轴对称包围盒
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class AABB {
        /**
         * min point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 最小点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        minimum: Vector3;
        /**
         * max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        maximum: Vector3;
        private _dirtyCenter;
        private _dirtyRadius;
        private srcmin;
        private srcmax;
        /**
         * build a aabb
         * @param _minimum min point
         * @param _maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构建轴对称包围盒
         * @param _minimum 最小点
         * @param _maximum 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        constructor(_minimum?: Vector3, _maximum?: Vector3);
        /**
         * update
         * @param worldmatrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 刷新轴对称包围盒
         * @param worldmatrix 物体的世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        update(worldmatrix: Matrix): void;
        /**
         * extend by a point
         * @param vec a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含一个点
         * @param vec 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        addVector3(vec: Vector3): void;
        /**
         * check contains vector
         * @param vec a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否包含点
         * @param vec 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        containsVector3(vec: Vector3): boolean;
        /**
         * intersect with aabb
         * @param aabb aabb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否与aabb相交
         * @param aabb 轴对称包围盒
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectAABB(aabb: AABB): boolean;
        /**
         *
         * 用于视锥检测的计算，引擎内部使用
         * 这里采用包围球式计算以提高性能
         */
        intersectPlane(v0: Vector3, v1: Vector3, v2: Vector3): boolean;
        /**
         * extend by aabb
         * @param aabb aabb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含一个aabb
         * @param aabb 轴对称包围盒
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        addAABB(aabb: egret3d.AABB): void;
        private _center;
        /**
         * get center
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取中心点位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly center: Vector3;
        /**
         * get bounding sphere radius
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取包围球的半径
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly radius: number;
        /**
         * clear
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 清空
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        clear(): void;
        /**
         * clone
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        clone(): AABB;
        /**
         * copy
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 复制
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        copy(aabb: AABB): AABB;
        /**
         * get vectors
         * @param vecs output vectors
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取包围盒顶点数据
         * @param vecs 引用数组
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getVec3(vecs: Vector3[]): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Border implements paper.ISerializable {
        /**
         *
         */
        l: number;
        /**
         *
         */
        t: number;
        /**
         *
         */
        r: number;
        /**
         *
         */
        b: number;
        /**
         *
         */
        constructor(l?: number, t?: number, r?: number, b?: number);
        /**
         * @inheritDoc
         */
        serialize(): number[];
        /**
         * @inheritDoc
         */
        deserialize(element: number[]): void;
    }
}
declare namespace paper.editor {
    const icon_frag: string;
    const icon_vert: string;
    const line_frag: string;
    const line_vert: string;
}
declare namespace egret3d {
    /**
     *
     * 贝塞尔曲线，目前定义了三种：线性贝塞尔曲线(两个点形成),二次方贝塞尔曲线（三个点形成），三次方贝塞尔曲线（四个点形成）
     */
    class Curve3 {
        /**
        * 贝塞尔曲线上的，不包含第一个点
        */
        private _beizerPoints;
        /**
        * 贝塞尔曲线上所有的个数
        */
        private _bezierPointNum;
        beizerPoints: egret3d.Vector3[];
        bezierPointNum: number;
        /**
         * 线性贝塞尔曲线
         */
        static CreateLinearBezier(start: egret3d.Vector3, end: egret3d.Vector3, indices: number): Curve3;
        /**
         * 二次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 选中的节点
         * @param v2 结尾点
         * @param nbPoints 将贝塞尔曲线拆分nbPoints段，一共有nbPoints + 1个点
         */
        static CreateQuadraticBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, bezierPointNum: number): Curve3;
        /**
         * 三次方贝塞尔曲线路径
         * @param v0
         * @param v1
         * @param v2
         * @param v3
         * @param nbPoints
         */
        static CreateCubicBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, v3: egret3d.Vector3, bezierPointNum: number): Curve3;
        constructor(points: egret3d.Vector3[], nbPoints: number);
        /**
         * 贝塞尔曲线上的点
         */
        getPoints(): Vector3[];
    }
}
declare namespace egret3d {
    /**
     *
     */
    const RAD_DEG: number;
    /**
     *
     */
    const DEG_RAD: number;
    function floatClamp(v: number, min?: number, max?: number): number;
    function sign(value: number): number;
    function numberLerp(fromV: number, toV: number, v: number): number;
    function calPlaneLineIntersectPoint(planeVector: Vector3, planePoint: Vector3, lineVector: Vector3, linePoint: Vector3, out: Vector3): Vector3;
    function getPointAlongCurve(curveStart: Vector3, curveStartHandle: Vector3, curveEnd: Vector3, curveEndHandle: Vector3, t: number, out: Vector3, crease?: number): void;
}
declare namespace egret3d {
    class Angelref {
        v: number;
    }
    class Matrix3x2 {
        rawData: Float32Array;
        constructor(datas?: Float32Array);
        static multiply(lhs: Matrix3x2, rhs: Matrix3x2, out: Matrix3x2): Matrix3x2;
        static fromRotate(angle: number, out: Matrix3x2): Matrix3x2;
        static fromScale(xScale: number, yScale: number, out: Matrix3x2): Matrix3x2;
        static fromTranslate(x: number, y: number, out: Matrix3x2): Matrix3x2;
        static fromRTS(pos: Vector2, scale: Vector2, rot: number, out: Matrix3x2): void;
        static transformVector2(mat: Matrix, inp: Vector2, out: Vector2): Vector2;
        static transformNormal(mat: Matrix, inp: Vector2, out: Vector2): Vector2;
        static inverse(src: Matrix3x2, out: Matrix3x2): Matrix3x2;
        static identify(out: Matrix3x2): Matrix3x2;
        static copy(src: Matrix3x2, out: Matrix3x2): Matrix3x2;
        static decompose(src: Matrix3x2, scale: Vector2, rotation: Angelref, translation: Vector2): boolean;
    }
}
declare namespace egret3d {
    /**
     * obb box
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 定向包围盒
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class OBB extends paper.SerializableObject {
        /**
         * center
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒中心
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly center: Vector3;
        /**
         * size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒各轴向长
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly size: Vector3;
        /**
         * vectors
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒世界空间下各个点坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly vectors: Readonly<[Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3]>;
        private readonly _directions;
        private _computeBoxExtents(axis, box, out);
        private _axisOverlap(axis, a, b);
        /**
         * clone a obb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆一个obb
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        clone(): OBB;
        /**
         * build by min point and max point
         * @param minimum min point
         * @param maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由最大最小点构建定向包围盒
         * @param minimum 最小点坐标
         * @param maximum 最大点坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setByMaxMin(minimum: Readonly<Vector3>, maximum: Readonly<Vector3>): void;
        /**
         * build by center and size
         * @param center center
         * @param size size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由中心点和各轴向长度构建定向包围盒
         * @param center 中心点坐标
         * @param size 各轴向长度
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setByCenterSize(center: Readonly<Vector3>, size: Readonly<Vector3>): void;
        /**
         * update by world matrix
         * @param worldmatrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 刷新定向包围盒
         * @param worldmatrix 世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        update(worldMatrix: Readonly<Matrix>): void;
        /**
         * intersect width obb
         * @param value obb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * obb的碰撞检测
         * @param value 待检测obb
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersects(value: Readonly<OBB>): boolean;
        /**
         * update vectors by world matrix
         * @param vectors vectors
         * @param worldMatrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算世界空间下各点坐标
         * @param vectors 结果数组
         * @param worldMatrix 物体的世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclWorldVectors(vectors: ReadonlyArray<Vector3>, worldMatrix: Readonly<Matrix>): void;
        deserialize(element: {
            center: [number, number, number];
            size: [number, number, number];
        }): void;
    }
}
declare namespace egret3d {
    /**
     * WebGL窗口信息
     */
    class Stage3D {
        screenViewport: Readonly<RectData>;
        absolutePosition: Readonly<RectData>;
        private _canvas;
        private _resizeDirty;
        update(): void;
        private _resize();
    }
    const stage: Stage3D;
}
declare namespace paper {
    /**
     * 反序列化
     * @param data 反序列化数据
     * @param expandMap 扩展的对象映射，此映射中存在的对象不需要重新序列化，直接使用即可（例如已经加载完成的资源文件）。
     */
    function deserialize<T extends ISerializable>(data: ISerializedData, expandMap: {
        [hashCode: number]: ISerializable;
    }): T | null;
    /**
     *
     */
    function getDeserializedObject<T extends ISerializable>(source: IHashCode): T;
}
declare namespace paper {
    /**
     *
     */
    interface IHashCode {
        /**
         *
         */
        readonly hashCode: number;
    }
    /**
     *
     */
    interface IStruct {
        /**
         *
         */
        readonly class: string;
    }
    /**
     * 自定义序列化接口。
     */
    interface ISerializable {
        /**
         *
         */
        serialize(): any | IHashCode | ISerializedObject;
        /**
         *
         */
        deserialize(element: any): void;
    }
    /**
     * 序列化后的数据接口。
     */
    interface ISerializedObject extends IHashCode, IStruct {
        /**
         *
         */
        [key: string]: any | IHashCode;
    }
    /**
     * 序列化数据接口
     */
    interface ISerializedData {
        /**
         *
         */
        readonly objects: ISerializedObject[];
        /**
         *
         */
        [key: string]: ISerializedObject[];
    }
}
declare namespace paper {
    /**
     * 组件实体系统的主入口
     */
    class Application {
        /**
         * 系统管理器
         */
        static readonly systemManager: SystemManager;
        /**
         * 场景管理器
         */
        static readonly sceneManager: SceneManager;
        private static _isEditor;
        private static _isFocused;
        private static _isPlaying;
        private static _isRunning;
        private static _standDeltaTime;
        private static _bindUpdate;
        private static _update();
        static init({isEditor, isPlaying}?: {
            isEditor?: boolean;
            isPlaying?: boolean;
        }): void;
        /**
         *
         */
        static pause(): void;
        static resume(): void;
        /**
         *
         */
        static callLater(callback: () => void): void;
        static readonly isEditor: boolean;
        static readonly isFocused: boolean;
        static readonly isPlaying: boolean;
        static readonly isRunning: boolean;
    }
}
declare namespace paper {
}
declare namespace paper {
    /**
     *
     */
    class LaterSystem extends paper.BaseSystem<paper.BaseComponent> {
        private readonly _laterCalls;
        /**
         * @inheritDoc
         */
        update(): void;
        /**
         *
         */
        callLater(callback: () => void): void;
    }
}
declare namespace egret3d {
    /**
     * path play type
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径播放类型
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    enum pathtype {
        once = 0,
        loop = 1,
        pingpong = 2,
    }
    /**
     * path asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class PathAsset extends paper.Asset {
        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        dispose(): void;
        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclByteLength(): number;
        /**
         * path point data
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径节点数据
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        paths: egret3d.Vector3[];
        private type;
        private instertPointcount;
        private items;
        /**
         *
         */
        $parse(json: any): void;
        private lines;
        private getpaths();
        private getBezierPointAlongCurve(points, rate, clearflag?);
        private vec3Lerp(start, end, lerp, out);
    }
}
declare namespace egret3d {
    /**
     * scene asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 场景数据资源
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class RawScene extends BaseObjectAsset {
        /**
         * clone from this scene
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从当前场景克隆。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        createInstance(): paper.Scene;
    }
}
declare namespace egret3d {
    /**
     * audio asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 声音资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Sound extends paper.Asset {
        /**
         *
         */
        buffer: AudioBuffer;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
    }
}
declare namespace egret3d {
    /**
     * 精灵资源。
     */
    class Sprite extends paper.Asset {
        static spriteAnimation(row: number, column: number, index: number, out: Vector4): void;
        /**
         * atlas
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 所属图集
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        atlas: string;
        /**
         * rect
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 有效区域
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly rect: Rect;
        /**
         * border
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 边距
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly border: Border;
        private _urange;
        private _vrange;
        private _texture;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        /**
         * u range
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * uv的u范围
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly urange: Vector2;
        /**
         * v range
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * uv的v范围
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly vrange: Vector2;
        /**
         * current texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前texture
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        /**
         * current texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前texture
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        texture: Texture | null;
    }
}
declare namespace egret3d {
    /**
     * text asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 文本资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class TextAsset extends paper.Asset {
        /**
         * 文本内容
         */
        content: string;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
    }
}
declare namespace egret3d {
    /**
     * textrue asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 纹理资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Texture extends paper.Asset {
        /**
         * gl texture 实例
         */
        glTexture: egret3d.ITexture;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        private _realName;
        /**
         * real image name
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 如果是imgdesc加载来的图片，通过这个可以获取到真实的图片名字。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        realName: string;
    }
}
declare namespace egret3d {
    class Pool<T> {
        static readonly drawCall: Pool<DrawCall>;
        static readonly shadowCaster: Pool<DrawCall>;
        private readonly _instances;
        add(instanceOrInstances: T | (T[])): void;
        remove(instanceOrInstances: T | (T[])): void;
        clear(): void;
        readonly instances: T[];
    }
}
declare namespace egret3d {
    /**
     * @private
     * draw call type
     */
    type DrawCall = {
        subMeshInfo: number;
        mesh: Mesh;
        material: Material;
        lightMapIndex: number;
        lightMapScaleOffset?: Readonly<Vector4>;
        boneData: Float32Array | null;
        gameObject: paper.GameObject;
        transform: Transform;
        frustumTest: boolean;
        zdist: number;
    };
    /**
     * @private
     */
    class DrawCallList {
        static updateZdist(camera: Camera): void;
        static sort(): void;
        private readonly _drawCalls;
        private readonly _createDrawCalls;
        constructor(createDrawCalls: (gameObject: paper.GameObject) => DrawCall[] | null);
        updateDrawCalls(gameObject: paper.GameObject, castShadows: boolean): void;
        updateShadowCasters(gameObject: paper.GameObject, castShadows: boolean): void;
        removeDrawCalls(gameObject: paper.GameObject): void;
        getDrawCalls(gameObject: paper.GameObject): DrawCall[] | null;
    }
}
declare namespace egret3d {
    /**
     * 声音监听组件。目前场景中只允许有一个监听器。对3D声音有效。
     */
    class Audio3DListener extends paper.BaseComponent {
    }
}
declare namespace egret3d {
    /**
     * Audio系统
     */
    class Audio3DListenerSystem extends paper.BaseSystem<Audio3DListener> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof Audio3DListener;
        }[];
        private _updateAudioListener(audioListener);
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    /**
     * 2d audio source component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 2D音频组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class AudioSource2D extends paper.BaseComponent {
        private _channel;
        private _sound;
        /**
         * 设置音频资源
         */
        sound: Sound;
        private _volume;
        /**
         * 音量
         */
        /**
         * 音量
         */
        volume: number;
        private _loop;
        /**
         * 是否循环
         */
        /**
         * 是否循环
         */
        loop: boolean;
        private _playing;
        /**
         * 播放音频
         */
        play(offset?: number): void;
        /**
         * 暂停音频
         */
        stop(): void;
    }
}
declare namespace egret3d {
    /**
     * 3D音频组件
     */
    class AudioSource3D extends paper.BaseComponent {
        update(deltaTime: number): void;
        private _channel;
        private _sound;
        /**
         * 设置音频资源
         */
        sound: Sound;
        private _volume;
        /**
         * 音量
         */
        /**
         * 音量
         */
        volume: number;
        private _loop;
        /**
         * 是否循环
         */
        /**
         * 是否循环
         */
        loop: boolean;
        private _playing;
        /**
         * 播放音频
         */
        play(offset?: number): void;
        /**
         * 暂停音频
         */
        stop(): void;
        /**
         * 音频传播最远距离
         */
        /**
         * 音频传播最远距离
         */
        maxDistance: number;
        /**
         * 音频传播最小距离
         */
        /**
         * 音频传播最小距离
         */
        minDistance: number;
        /**
         * 音频滚降系数
         */
        /**
         * 音频滚降系数
         */
        rollOffFactor: number;
        /**
         * 音频滚降系数
         */
        /**
         * 音频衰减模式。支持“linear”，“inverse”，“exponential”三种
         */
        distanceModel: string;
        /**
         * 速度
         */
        getVelocity(): Vector3;
        /**
         * 速度
         */
        setVelocity(x: number, y: number, z: number): void;
    }
}
declare namespace egret3d {
    /**
     * Audio系统
     */
    class AudioSource3DSystem extends paper.BaseSystem<AudioSource3D> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof AudioSource3D;
        }[];
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class BaseCollider extends paper.BaseComponent {
        protected readonly _bounds: OBB;
        /**
         *
         */
        readonly bounds: OBB;
    }
    /**
     *
     */
    const enum BoxColliderDirtyMask {
        Bounds = 1,
    }
    /**
     * 矩形碰撞盒组件
     */
    class BoxCollider extends BaseCollider {
        /**
         *
         */
        _dirtyMask: number;
        private _center;
        private _size;
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         * 碰撞盒中心点
         */
        center: Readonly<Vector3>;
        /**
         * 碰撞盒尺寸
         */
        size: Readonly<Vector3>;
    }
}
declare namespace egret3d {
    /**
     * BoxCollider系统
     */
    class BoxColliderSystem extends paper.BaseSystem<BoxCollider> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof BoxCollider;
        }[];
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    /**
     * culling mask
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * culling mask 枚举。
     * 相机的cullingmask与renderer的renderLayer相匹配，才会执行渲染。否则将会被跳过。
     * 这个属性可以实现相机的选择性剔除。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    const enum CullingMask {
        Everything = 16777215,
        Nothing = 1,
        Default = 2,
        UI = 4,
        UserLayer1 = 8,
        UserLayer2 = 16,
        UserLayer3 = 32,
        UserLayer4 = 64,
        UserLayer5 = 128,
        UserLayer6 = 240,
        UserLayer7 = 256,
        UserLayer8 = 512,
        UserLayer9 = 1024,
        UserLayer10 = 2048,
        UserLayer11 = 3840,
    }
    /**
     * camera component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 相机组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class Camera extends paper.BaseComponent {
        /**
         * current main camera
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前主相机。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static readonly main: Camera;
        /**
         * clear color option
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否清除颜色缓冲区
         * @version paper 1.0
         * @platform Web
         * @language
         */
        clearOption_Color: boolean;
        /**
         * clear depth option
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否清除深度缓冲区
         * @version paper 1.0
         * @platform Web
         * @language
         */
        clearOption_Depth: boolean;
        /**
         * culling mask
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机的渲染剔除，对应GameObject的层级
         * @default CullingMask.Default | CullingMask.UI
         * @version paper 1.0
         * @platform Web
         * @language
         */
        cullingMask: CullingMask;
        /**
         * camera render order
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机渲染排序
         * @version paper 1.0
         * @platform Web
         * @language
         */
        order: number;
        /**
         * fov
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 透视投影的fov
         * @version paper 1.0
         * @platform Web
         * @language
         */
        fov: number;
        /**
         * size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 正交投影的竖向size
         * @version paper 1.0
         * @platform Web
         * @language
         */
        size: number;
        /**
         * op value
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        opvalue: number;
        /**
         * back ground color
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 背景色
         * @version paper 1.0
         * @platform Web
         * @language
         */
        backgroundColor: Color;
        /**
         * camera viewport
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机视窗
         * @version paper 1.0
         * @platform Web
         * @language
         */
        readonly viewport: Rect;
        /**
         * TODO 功能完善后开放此接口
         */
        readonly postQueues: ICameraPostQueue[];
        /**
         * render target
         * @defualt null
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 渲染目标，如果为null，则为画布
         * @defualt null
         * @version paper 1.0
         * @platform Web
         * @language
         */
        renderTarget: IRenderTarget | null;
        /**
         * 相机渲染上下文
         */
        context: RenderContext;
        private _near;
        private _far;
        private readonly matView;
        private readonly matProjP;
        private readonly matProjO;
        private readonly matProj;
        private readonly frameVecs;
        /**
         * 计算相机视锥区域
         */
        private calcCameraFrame();
        /**
         * 设置render target与viewport
         * @param target render target
         * @param withoutClear 强制不清除缓存
         *
         */
        _targetAndViewport(target: IRenderTarget | null, withoutClear: boolean): void;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         *
         */
        update(_delta: number): void;
        /**
         * 计算相机的 view matrix（视图矩阵）
         */
        calcViewMatrix(matrix: Matrix): Matrix;
        /**
         * 计算相机的 project matrix（投影矩阵）
         */
        calcProjectMatrix(asp: number, matrix: Matrix): Matrix;
        /**
         * calcViewPortPixel
         * @param viewPortPixel output rect
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算相机视口像素rect
         * @param viewPortPixel 输出的rect
         * @version paper 1.0
         * @platform Web
         * @language
         */
        calcViewPortPixel(viewPortPixel: RectData): void;
        /**
         * createRayByScreen
         * @param screenpos screen coords
         * @param app application
         * @return Ray ray
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由屏幕坐标发射射线
         * @param screenpos 屏幕坐标
         * @param app 主程序实例
         * @return Ray 射线
         * @version paper 1.0
         * @platform Web
         * @language
         */
        createRayByScreen(screenPosX: number, screenPosY: number): Ray;
        /**
         * calcWorldPosFromScreenPos
         * @param app application
         * @param screenpos screen coords
         * @param outWorldPos world coords
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由屏幕坐标得到世界坐标
         * @param app 主程序
         * @param screenpos 屏幕坐标
         * @param outWorldPos 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language
         */
        calcWorldPosFromScreenPos(screenPos: Vector3, outWorldPos: Vector3): void;
        /**
         * calcScreenPosFromWorldPos
         * @param app application
         * @param worldPos world coords
         * @param outScreenPos screen coords
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由世界坐标得到屏幕坐标
         * @param app 主程序
         * @param worldPos 世界坐标
         * @param outScreenPos 屏幕坐标
         * @version paper 1.0
         * @platform Web
         * @language
         */
        calcScreenPosFromWorldPos(worldPos: Vector3, outScreenPos: Vector2): void;
        /**
         *
         */
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: Vector2, z: number, out: Vector2): void;
        testFrustumCulling(node: Transform): boolean;
        /**
         * distance between camera and near plane
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机到近裁剪面距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        near: number;
        /**
         * distance between camera and far plane
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机到远裁剪面距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        far: number;
    }
}
declare namespace egret3d {
    /**
     * 相机处理通道接口
     * TODO 完善后public给开发者
     */
    interface ICameraPostQueue {
        /**
         *
         */
        renderTarget: GlRenderTarget;
        /**
         *
         */
        render(camera: Camera, renderSystem: CameraSystem): void;
    }
    /**
     * 深度绘制通道
     * TODO 完善后public给开发者
     */
    class CameraPostQueueDepth implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        renderTarget: GlRenderTarget;
        /**
         * @inheritDoc
         */
        render(camera: Camera, renderSystem: CameraSystem): void;
    }
    /**
     * framebuffer绘制通道
     * TODO 完善后public给开发者
     */
    class CameraPostQueueQuad implements ICameraPostQueue {
        /**
         * shader & uniform
         */
        readonly material: Material;
        /**
         * @inheritDoc
         */
        renderTarget: GlRenderTarget;
        /**
         * @inheritDoc
         */
        render(camera: Camera, _renderSystem: CameraSystem): void;
    }
    /**
     * 颜色绘制通道
     * TODO 完善后public给开发者
     */
    class CameraPostQueueColor implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        renderTarget: GlRenderTarget;
        /**
         * @inheritDoc
         */
        render(camera: Camera, renderSystem: CameraSystem): void;
    }
}
declare namespace egret3d {
    /**
     * 缓存场景通用数据
     * 包括矩阵信息，灯光，光照贴图，viewport尺寸等等
     */
    class RenderContext {
        receiveShadow: boolean;
        /**
         *
         */
        version: number;
        /**
         *
         */
        lightmapUV: number;
        lightCount: number;
        directLightCount: number;
        pointLightCount: number;
        spotLightCount: number;
        /**
         *
         */
        drawtype: string;
        /**
         *
         */
        lightmap: Texture | null;
        boneData: Float32Array | null;
        directLightArray: Float32Array;
        pointLightArray: Float32Array;
        spotLightArray: Float32Array;
        directShadowMatrix: Float32Array;
        spotShadowMatrix: Float32Array;
        readonly matrix_m: Matrix;
        readonly matrix_mvp: Matrix;
        readonly directShadowMaps: (WebGLTexture | null)[];
        readonly pointShadowMaps: (WebGLTexture | null)[];
        readonly spotShadowMaps: (WebGLTexture | null)[];
        readonly viewPortPixel: RectData;
        readonly cameraPosition: Vector3;
        readonly cameraForward: Vector3;
        readonly cameraUp: Vector3;
        readonly matrix_v: Matrix;
        readonly matrix_p: Matrix;
        private readonly matrix_mv;
        readonly matrix_vp: Matrix;
        /**
         *
         */
        readonly lightmapOffset: Float32Array;
        updateLightmap(texture: Texture, uv: number, offset: Vector4): void;
        updateCamera(camera: Camera): void;
        updateLights(lights: ReadonlyArray<Light>): void;
        updateOverlay(): void;
        updateModel(model: Transform): void;
        updateModeTrail(): void;
        updateBones(data: Float32Array | null): void;
        lightPosition: ImmutableVector4;
        lightShadowCameraNear: number;
        lightShadowCameraFar: number;
        updateLightDepth(light: Light): void;
    }
}
declare namespace egret3d {
    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Egret2DRenderer extends paper.BaseComponent {
        private renderer;
        /**
         * 是否使用视锥剔除
         */
        frustumTest: boolean;
        constructor();
        stage: egret.Stage;
        private _screenAdapter;
        screenAdapter: IScreenAdapter;
        root: egret.DisplayObjectContainer;
        private app;
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         * @inheritDoc
         */
        uninitialize(): void;
        /**
         * 检查屏幕接触事件是否能够穿透此2D层
         */
        checkEventThrough(x: number, y: number): boolean;
        private _catchedEvent;
        private _onTouchStart(event);
        private _onTouchMove(event);
        private _onTouchEnd(event);
        /**
         * screen position to ui position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从屏幕坐标转换到当前2D系统的坐标
         * @version paper 1.0
         * @platform Web
         * @language
         */
        screenPosToUIPos(pos: Vector2, out?: Vector2): Vector2;
        private _stageWidth;
        private _stageHeight;
        private _scaler;
        /**
         * 从屏幕坐标到当前2D系统的坐标的缩放系数
         */
        readonly scaler: number;
        /**
         *
         */
        update(delta: number): void;
        /**
         *
         */
        render(context: RenderContext, camera: egret3d.Camera): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Egret2DRendererSystem extends paper.BaseSystem<Egret2DRenderer> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof Egret2DRenderer;
        }[];
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare module egret.web {
}
declare namespace egret3d {
    /**
     * IScreenAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 屏幕适配策略接口，实现此接口可以自定义适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    interface IScreenAdapter {
        $dirty: boolean;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): any;
    }
    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 恒定像素的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ConstantAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _scaleFactor;
        /**
         * scaleFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置缩放值
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        scaleFactor: number;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 拉伸扩展的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ExpandAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * ShrinkAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 缩放的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class ShrinkAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
    /**
     * MatchWidthOrHeightAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 适应宽高适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class MatchWidthOrHeightAdapter implements IScreenAdapter {
        $dirty: boolean;
        private _resolution;
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setResolution(width: number, height: number): void;
        private _matchFactor;
        /**
         * matchFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置匹配系数，0-1之间，越小越倾向以宽度适配，越大越倾向以高度适配。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        matchFactor: number;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: {
            w: number;
            h: number;
            s: number;
        }): void;
    }
}
declare namespace egret3d {
    /**
     * Guid Path Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径组件。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class Guidpath extends paper.BaseComponent {
        private paths;
        private _pathasset;
        /**
         * Path Asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径组件需要的路径资源。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        /**
         * Path Asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径组件需要的路径资源。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        pathasset: PathAsset;
        /**
         * move speed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 移动速度。
         * @default 1
         * @version paper 1.0
         * @platform Web
         * @language
         */
        speed: number;
        private isactived;
        private loopCount;
        /**
         * play movement
         * @version paper 1.0
         * @param loopCount play times
         * @platform Web
         * @language en_US
         */
        /**
         * 按照路径开始移动。
         * @param loopCount 播放次数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        play(loopCount?: number): void;
        /**
         * pause movement
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 暂停移动。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        pause(): void;
        /**
         * stop movement
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 停止移动。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        stop(): void;
        /**
         * restart movement
         * @param loopCount play times
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 重新按照路径移动。
         * @param loopCount 播放次数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        replay(loopCount?: number): void;
        /**
         * loop play
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 循环播放。
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language
         */
        isloop: boolean;
        private datasafe;
        private folowindex;
        /**
         * look forward
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 挂载此组件的gameobject是否朝向前方。
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language
         */
        lookforward: boolean;
        private oncomplete;
        private mystrans;
        /**
         * set path asset
         * @param pathasset path asset
         * @param speed move speed
         * @param oncomplete on complete callback
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置路径组件的需要的参数。
         * @param pathasset 路径资源
         * @param speed 移动速度
         * @param oncomplete 按照路径移动结束需要执行的事件
         * @version paper 1.0
         * @platform Web
         * @language
         */
        setpathasset(pathasset: PathAsset, speed?: number, oncomplete?: () => void): void;
        /**
         *
         */
        update(delta: number): void;
        private adjustDir;
        private followmove(delta);
    }
}
declare namespace egret3d {
    /**
     * Guidpath系统
     */
    class GuidpathSystem extends paper.BaseSystem<Guidpath> {
        /**
         * @inheritDoc
         */
        readonly _interests: {
            componentClass: typeof Guidpath;
        }[];
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    class DirectLightShadow implements ILightShadow {
        renderTarget: GlRenderTarget;
        map: WebGLTexture;
        bias: number;
        radius: number;
        matrix: Matrix;
        windowSize: number;
        camera: Camera;
        constructor();
        update(light: Light): void;
        private _updateCamera(light);
        private _updateMatrix();
    }
}
declare namespace paper {
    /**
     * 克隆
     */
    function clone<T extends paper.SerializableObject>(object: T): T;
}
declare namespace egret3d {
    /**
     * Light Type Enum
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光类型的枚举。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    enum LightTypeEnum {
        /**
         * direction light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 直射光
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Direction = 1,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 点光源
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Point = 2,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Spot = 3,
    }
    /**
     * light component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class Light extends paper.BaseComponent {
        /**
         * light type
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 光源类型
         * @version paper 1.0
         * @platform Web
         * @language
         */
        type: LightTypeEnum;
        color: Color;
        intensity: number;
        distance: number;
        decay: number;
        angle: number;
        penumbra: number;
        /**
         * spot angel cos
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯的开合角度cos值
         * @version paper 1.0
         * @platform Web
         * @language
         */
        spotAngelCos: number;
        castShadows: boolean;
        $directLightShadow: DirectLightShadow;
        $pointLightShadow: PointLightShadow;
        $spotLightShadow: SpotLightShadow;
        shadowBias: number;
        shadowRadius: number;
        shadowSize: number;
        shadowCameraNear: number;
        shadowCameraFar: number;
    }
}
declare namespace egret3d {
    /**
     * Light系统
     */
    class LightSystem extends paper.BaseSystem<Light> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof Light;
        }[];
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    class PointLightShadow implements ILightShadow {
        renderTarget: GlRenderTargetCube;
        map: WebGLTexture;
        bias: number;
        radius: number;
        matrix: Matrix;
        windowSize: number;
        camera: Camera;
        private _targets;
        private _ups;
        constructor();
        update(light: Light, face: number): void;
        private _updateCamera(light, face);
        private _updateMatrix();
    }
}
declare namespace egret3d {
    class SpotLightShadow implements ILightShadow {
        renderTarget: GlRenderTarget;
        map: WebGLTexture;
        bias: number;
        radius: number;
        matrix: Matrix;
        windowSize: number;
        camera: Camera;
        constructor();
        update(light: Light): void;
        private _updateCamera(light);
        private _updateMatrix();
    }
}
declare namespace egret3d {
    /**
     *
     */
    const enum MeshFilterEventType {
        Mesh = "mesh",
    }
    /**
     * MeshFilter 组件
     */
    class MeshFilter extends paper.BaseComponent {
        private _mesh;
        /**
         * @inheritDoc
         */
        uninitialize(): void;
        /**
         * 组件挂载的 mesh 模型
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d {
    const enum MeshRendererEventType {
        ReceiveShadows = "receiveShadows",
        CastShadows = "castShadows",
        LightmapIndex = "lightmapIndex",
        LightmapScaleOffset = "lightmapScaleOffset",
        Materials = "materials",
    }
    /**
     * mesh的渲染组件
     */
    class MeshRenderer extends paper.BaseComponent implements paper.IRenderer {
        private _receiveShadows;
        private _castShadows;
        private _lightmapIndex;
        private readonly _lightmapScaleOffset;
        private readonly _materials;
        /**
         *
         */
        constructor();
        /**
         * @inheritDoc
         */
        serialize(): any;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
        /**
         * @inheritDoc
         */
        uninitialize(): void;
        receiveShadows: boolean;
        castShadows: boolean;
        lightmapIndex: number;
        lightmapScaleOffset: Readonly<Vector4>;
        /**
         * material list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质数组
         * @version paper 1.0
         * @platform Web
         * @language
         */
        materials: ReadonlyArray<Material>;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class MeshRendererSystem extends paper.BaseSystem<MeshRenderer | MeshFilter> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: ({
            componentClass: typeof MeshRenderer;
            listeners: {
                type: MeshRendererEventType;
                listener: (component: MeshRenderer) => void;
            }[];
        } | {
            componentClass: typeof MeshFilter;
            listeners: {
                type: MeshFilterEventType;
                listener: (component: MeshFilter) => void;
            }[];
        })[];
        private readonly _createDrawCalls;
        private readonly _drawCallList;
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: MeshRenderer | MeshFilter): boolean;
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: MeshRenderer | MeshFilter): boolean;
        private _updateLightMap(component);
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    const enum SkinnedMeshRendererEventType {
        Mesh = "mesh",
        Bones = "bones",
        Materials = "materials",
    }
    /**
     * Skinned Mesh Renderer Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 蒙皮网格的渲染组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class SkinnedMeshRenderer extends paper.BaseComponent implements paper.IRenderer {
        /**
         *
         */
        static dataCaches: {
            key: string;
            data: Float32Array;
        }[];
        private readonly _materials;
        private _mesh;
        /**
         * mesh instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * mesh实例
         * @version paper 1.0
         * @platform Web
         * @language
         */
        mesh: Mesh | null;
        private readonly _bones;
        /**
         *
         * 根骨骼
         */
        rootBone: Transform;
        center: Vector3;
        size: Vector3;
        /**
         *
         */
        _boneDirty: boolean;
        private _maxBoneCount;
        /**
         * Local [qX, qY, qZ, qW, tX, tY, tZ, 1.0, ...]
         *
         */
        _skeletonMatrixData: Float32Array;
        /**
         *
         */
        _retargetBoneNames: string[] | null;
        private _efficient;
        private cacheData;
        private _getMatByIndex(index, out);
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         * @inheritDoc
         */
        uninitialize(): void;
        /**
         * @inheritDoc
         */
        serialize(): any;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
        /**
         * ray intersects
         * @param ray ray
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 射线检测
         * @param ray 射线
         * @version paper 1.0
         * @platform Web
         * @language
         */
        intersects(ray: Ray): any;
        /**
         * material list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质数组
         * @version paper 1.0
         * @platform Web
         * @language
         */
        materials: ReadonlyArray<Material>;
        /**
         * 骨骼列表
         *
         */
        bones: ReadonlyArray<Transform>;
        /**
         *
         */
        readonly boneBuffer: Readonly<Float32Array>;
    }
}
declare namespace egret3d {
    /**
     *
     */
    const enum TrailRenderEventType {
        Meterial = "material",
    }
    /**
     * Trail Renderer Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 拖尾渲染组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class TrailRender extends paper.BaseComponent implements paper.IRenderer {
        /**
         * extend direction
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾延伸方向。
         * true为单方向延伸，false为双向延伸
         * @version paper 1.0
         * @platform Web
         * @language
         */
        extenedOneSide: boolean;
        private _vertexCount;
        /**
         *
         */
        _material: Material | null;
        /**
         *
         */
        _mesh: Mesh;
        private _sticks;
        /**
         * trail material
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾的材质
         * @version paper 1.0
         * @platform Web
         * @language
         */
        material: Material | null;
        /**
         * material color
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质颜色
         * @version paper 1.0
         * @platform Web
         * @language
         */
        readonly color: Color;
        /**
         * set trail width
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置拖尾宽度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        width: number;
        /**
         * set trail speed（0 - 1）
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置拖尾速度，调节拖尾长短（0-1）
         * @version paper 1.0
         * @platform Web
         * @language
         */
        speed: number;
        /**
         * look at camera
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 拖尾是否朝向相机
         * @version paper 1.0
         * @platform Web
         * @language
         */
        lookAtCamera: boolean;
        /**
         *
         */
        $active: boolean;
        private _reInit;
        /**
         *
         */
        constructor();
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         * @inheritDoc
         */
        uninitialize(): void;
        /**
         *
         */
        update(delta: number): void;
        private _buildMesh(vertexcount);
        private _buildData(vertexCount);
        private _updateTrailData();
    }
}
declare namespace egret3d {
    /**
     * TrailRender系统
     */
    class TrailRenderSystem extends paper.BaseSystem<TrailRender> {
        /**
         * @inheritDoc
         */
        readonly _interests: {
            componentClass: typeof TrailRender;
            listeners: {
                type: TrailRenderEventType;
                listener: (component: TrailRender) => void;
            }[];
        }[];
        private readonly _transform;
        private readonly _createDrawCalls;
        private readonly _drawCallList;
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: TrailRender): boolean;
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: TrailRender): boolean;
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    /**
     * TODO 需要完善
     */
    class SkinnedMeshRendererSystem extends paper.BaseSystem<SkinnedMeshRenderer> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof SkinnedMeshRenderer;
            listeners: {
                type: SkinnedMeshRendererEventType;
                listener: (component: SkinnedMeshRenderer) => void;
            }[];
        }[];
        private readonly _createDrawCalls;
        private readonly _drawCallList;
        private _updateDrawCalls(component);
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: SkinnedMeshRenderer): boolean;
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: SkinnedMeshRenderer): boolean;
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d {
    /**
     * @private
     */
    interface GLTFAnimation extends gltf.Animation {
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
    interface GLTFAnimationClip {
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
    interface GLTFAnimationChannel extends gltf.AnimationChannel {
        extensions?: {
            paper: {
                type: string;
                property: string;
            };
        };
    }
    /**
     * 帧事件反序列化。
     */
    interface GLTFFrameEvent {
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
    class GLTFAsset extends paper.Asset {
        /**
         *
         */
        static getComponentTypeCount(type: gltf.ComponentType): number;
        /**
         *
         */
        static getAccessorTypeCount(type: gltf.AccessorType): number;
        /**
         * 自定义 Mesh 的属性枚举。
         */
        static getMeshAttributeType(type: gltf.MeshAttribute): gltf.AccessorType;
        /**
         *
         */
        static createGLTFAsset(): GLTFAsset;
        /**
         * Buffer 列表。
         */
        readonly buffers: (Float32Array | Uint32Array | Uint16Array)[];
        /**
         * 配置。
         */
        config: gltf.GLTF;
        /**
         * 从二进制数据中解析资源。
         */
        parseFromBinary(array: Uint32Array): void;
        /**
         * 根据指定 BufferView 创建二进制数组。
         */
        createTypeArrayFromBufferView(bufferView: gltf.BufferView, componentType: gltf.ComponentType): Uint8Array;
        /**
         * 根据指定 Accessor 创建二进制数组。
         */
        createTypeArrayFromAccessor(accessor: gltf.Accessor): Uint8Array;
        /**
         * 通过 Accessor 获取指定 BufferLength。
         */
        getBufferLength(accessor: gltf.Accessor): number;
        /**
         * 通过 Accessor 获取指定 BufferOffset。
         */
        getBufferOffset(accessor: gltf.Accessor): number;
        /**
         * 通过 Accessor 获取指定 Buffer。
         */
        getBuffer(accessor: gltf.Accessor): Float32Array | Uint16Array | Uint32Array;
        /**
         * 通过 Accessor 获取指定 BufferView。
         */
        getBufferView(accessor: gltf.Accessor): gltf.BufferView;
        /**
         * 通过 Accessor 索引，获取指定 Accessor。
         */
        getAccessor(index: gltf.GLTFIndex): gltf.Accessor;
        /**
         * 获取节点。
         */
        getNode(index: gltf.GLTFIndex): gltf.Node;
        getAnimationClip(name: string): any;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        /**
         * @inheritDoc
         */
        dispose(): void;
    }
}
declare namespace egret3d {
    const enum MeshDrawMode {
        Static = 1,
        Dynamic = 2,
        Stream = 3,
    }
    /**
     * Mesh.
     * @version egret3D 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 网格模型。
     * @version egret3D 1.0
     * @platform Web
     * @language zh_CN
     */
    class Mesh extends paper.SerializableObject {
        /**
         *
         */
        vertexCount: number;
        /**
         * true :所有subMesh公用一个buffer; false :每个subMesh使用单独的buffer
         *
         */
        isSharedBuffer: boolean;
        protected _drawMode: MeshDrawMode;
        /**
         *
         */
        _version: number;
        protected _glTFMeshIndex: number;
        protected _glTFAsset: GLTFAsset;
        protected _glTFMesh: gltf.Mesh;
        protected _vertexBuffer: Float32Array;
        protected _attributeType: {
            [key: string]: gltf.AccessorType;
        };
        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        readonly ibos: (WebGLBuffer | null)[];
        vbo: WebGLBuffer;
        protected _getDrawMode(mode: MeshDrawMode): number;
        protected _cacheVertexCount(): void;
        protected _cacheMeshAttributeType(attributeNames: gltf.MeshAttribute[], attributeTypes: gltf.AccessorType[]): void;
        protected _getMeshAttributeType(attributeName: string): gltf.AccessorType;
        constructor(vertexCountOrVertices: number | Float32Array, indexCountOrIndices: number | Uint16Array | null, firstIndexCount: number, attributeNames: gltf.MeshAttribute[], attributeType: gltf.AccessorType[], drawMode?: MeshDrawMode);
        constructor(vertexCountOrVertices: number | Float32Array, indexCountOrIndices: number | Uint16Array | null, firstIndexCount: number, attributeNames: gltf.MeshAttribute[], drawMode?: MeshDrawMode);
        constructor(vertexCountOrVertices: number | Float32Array, indexCountOrIndices: number | Uint16Array | null, attributeNames: gltf.MeshAttribute[], drawMode?: MeshDrawMode);
        constructor(gltfAsset: GLTFAsset, gltfMeshIndex: number, drawMode?: MeshDrawMode);
        private _getVertexCountFromBuffer(vertexBuffer, attributeNames);
        /**
         * @inheritDoc
         */
        serialize(): any;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        /**
         *
         */
        initialize(drawMode?: MeshDrawMode): void;
        getVertexCount(subMeshIndex?: number): number;
        getVertices(subMeshIndex?: number): Float32Array;
        getUVs(subMeshIndex?: number): Float32Array;
        getColors(subMeshIndex?: number): Float32Array;
        getNormals(subMeshIndex?: number): Float32Array;
        getTangents(subMeshIndex?: number): Float32Array;
        getAttributes(attributeType: gltf.MeshAttribute, subMeshIndex?: number): Uint8Array;
        getIndices(subMeshIndex?: number): Uint16Array;
        getAttribute<T extends (Vector4 | Vector3 | Vector2)>(vertexIndex: number, attributeType: gltf.MeshAttribute, subMeshIndex?: number, result?: T): T;
        setAttribute(vertexIndex: number, attributeType: gltf.MeshAttribute, subMeshIndex: number, ...args: number[]): void;
        uploadVertexSubData(uploadAttributes: gltf.MeshAttribute[], startVertexIndex: number, vertexCount: number, subMeshIndex?: number): void;
        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        uploadSubVertexBuffer(uploadAttributes: gltf.MeshAttribute | (gltf.MeshAttribute[]), subMeshIndex?: number): void;
        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        uploadSubIndexBuffer(subMeshIndex?: number): void;
        /**
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         *
         */
        intersects(ray: Ray, matrix: Matrix): PickInfo;
        /**
         * 获取子网格数量。
         */
        readonly subMeshCount: number;
        /**
         * 获取 mesh 数据所属的 glTF 资源。
         */
        readonly glTFAsset: GLTFAsset;
        /**
         * 获取 glTFMesh 数据。
         */
        readonly glTFMesh: gltf.Mesh;
        readonly vertexBuffer: Float32Array;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class BoneBlendLayer {
        dirty: number;
        layer: number;
        leftWeight: number;
        layerWeight: number;
        blendWeight: number;
        target: Transform | null;
        update(animationState: AnimationState): boolean;
    }
    /**
     * 动画混合节点。
     */
    abstract class BlendNode {
        /**
         * @private
         */
        additive: boolean;
        /**
         * 动画混合模式。（根节点有效）
         */
        layer: number;
        /**
         * 节点权重。
         */
        weight: number;
        /**
         * 淡入淡出的时间。
         */
        fadeTime: number;
        /**
         * 父节点。
         */
        parent: BlendNode | null;
        /**
         * 融合进度。
         *
         */
        _fadeProgress: number;
        /**
         * 全局融合时间标记。
         */
        protected _fadeTimeStart: number;
        protected _onFadeStateChange(): void;
        update(globalTime: number): void;
        fadeOut(fadeTime: number): void;
    }
    /**
     * 动画混合树节点。
     */
    class BlendTree extends BlendNode {
        private readonly _blendNodes;
    }
    /**
     * 动画状态。
     */
    class AnimationState extends BlendNode {
        /**
         * @private
         */
        layer: number;
        /**
         * 动画总播放次数。
         */
        playTimes: number;
        /**
         * 动画当前播放次数。
         */
        currentPlayTimes: number;
        /**
         * 播放速度。
         */
        timeScale: number;
        /**
         * @private
         */
        animationAsset: GLTFAsset;
        /**
         * 播放的动画数据。
         */
        animation: GLTFAnimation;
        /**
         * 播放的动画剪辑。
         */
        animationClip: GLTFAnimationClip;
        /**
         * 是否允许播放。
         */
        private _isPlaying;
        /**
         * 播放状态。
         * -1: start, 0: playing, 1: complete;
         */
        private _playState;
        /**
         * 帧率。
         */
        private _frameRate;
        /**
         * 总帧数。
         */
        private _frameCount;
        /**
         * 全局播放时间标记。
         */
        private _playTimeStart;
        /**
         * 本地播放时间。
         */
        private _playTime;
        /**
         * 帧插值进度。
         */
        private _frameProgress;
        private _animationComponent;
        private readonly _channels;
        private readonly _retargetBoneIndices;
        private readonly _delta;
        private _frameBuffer;
        private _frameOffset;
        private _nextFrameOffset;
        private _frameOffsets;
        private _onArriveAtFrame();
        private _onUpdateFrame();
        private _onUpdateTranslation(channel);
        private _onUpdateRotation(channel);
        private _onUpdateScale(channel);
        private _onUpdateActive(channel);
        /**
         *
         */
        initialize(animationComponent: Animation, animationAsset: GLTFAsset, animationClip: GLTFAnimationClip): void;
        /**
         *
         */
        update(globalTime: number): void;
        fateOut(): void;
    }
    /**
     * 动画组件。
     */
    class Animation extends paper.BaseComponent {
        /**
         * @private
         */
        autoPlay: boolean;
        /**
         * 动画速度。
         */
        timeScale: number;
        /**
         * 动画数据列表。
         */
        private readonly _animations;
        /**
         * 骨骼姿势列表。
         *
         */
        readonly _boneBlendLayers: BoneBlendLayer[];
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes;
        /**
         * 最后一个播放的动画状态。
         * 当进行动画混合时，该值通常没有任何意义。
         */
        private _lastAnimationState;
        /**
         *
         */
        _skinnedMeshRenderer: SkinnedMeshRenderer | null;
        /**
         * @inheritDoc
         */
        initialize(): void;
        /**
         *
         */
        update(globalTime: number): void;
        fadeIn(animationName: string | null, fadeTime: number, playTimes?: number, layer?: number, additive?: boolean): AnimationState | null;
        play(animationName?: string | null, playTimes?: number): AnimationState | null;
        readonly lastAnimationnName: string;
        /**
         * 动画数据列表。
         */
        animations: ReadonlyArray<GLTFAsset>;
    }
    /**
     * @private
     */
    class AnimationSystem extends paper.BaseSystem<Animation> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: {
            componentClass: typeof Animation;
        }[];
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: Animation): boolean;
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace egret3d.particle {
}
declare namespace egret3d.particle {
    const enum CurveMode {
        Constant = 0,
        Curve = 1,
        TwoCurves = 2,
        TwoConstants = 3,
    }
    const enum ColorGradientMode {
        Color = 0,
        Gradient = 1,
        TwoColors = 2,
        TwoGradients = 3,
        RandomColor = 4,
    }
    const enum SimulationSpace {
        Local = 0,
        World = 1,
        Custom = 2,
    }
    const enum ScalingMode {
        Hierarchy = 0,
        Local = 1,
        Shape = 2,
    }
    const enum ShapeType {
        None = -1,
        Sphere = 0,
        SphereShell = 1,
        Hemisphere = 2,
        HemisphereShell = 3,
        Cone = 4,
        Box = 5,
        Mesh = 6,
        ConeShell = 7,
        ConeVolume = 8,
        ConeVolumeShell = 9,
        Circle = 10,
        CircleEdge = 11,
        SingleSidedEdge = 12,
        MeshRenderer = 13,
        SkinnedMeshRenderer = 14,
        BoxShell = 15,
        BoxEdge = 16,
    }
    const enum ShapeMultiModeValue {
        Random = 0,
        Loop = 1,
        PingPong = 2,
        BurstSpread = 3,
    }
    const enum AnimationType {
        WholeSheet = 0,
        SingleRow = 1,
    }
    const enum UVChannelFlags {
        UV0 = 1,
        UV1 = 2,
        UV2 = 4,
        UV3 = 8,
    }
    const enum GradientMode {
        Blend = 0,
        Fixed = 1,
    }
    class Keyframe implements paper.ISerializable {
        time: number;
        value: number;
        serialize(): number[];
        deserialize(element: any): void;
    }
    class AnimationCurve implements paper.ISerializable {
        /**
         * 功能与效率平衡长度取4
         */
        private readonly _keys;
        private readonly _floatValues;
        serialize(): number[][];
        deserialize(element: any): void;
        evaluate(t?: number): number;
        readonly floatValues: Readonly<Float32Array>;
    }
    class GradientColorKey extends paper.SerializableObject {
        color: Color;
        time: number;
        deserialize(element: any): void;
    }
    class GradientAlphaKey extends paper.SerializableObject {
        alpha: number;
        time: number;
        deserialize(element: any): void;
    }
    class Gradient extends paper.SerializableObject {
        mode: GradientMode;
        private readonly alphaKeys;
        private readonly colorKeys;
        private readonly _alphaValue;
        private readonly _colorValue;
        deserialize(element: any): void;
        evaluate(t: number, out: Color): Color;
        readonly alphaValues: Readonly<Float32Array>;
        readonly colorValues: Readonly<Float32Array>;
    }
    class MinMaxCurve extends paper.SerializableObject {
        mode: CurveMode;
        constant: number;
        constantMin: number;
        constantMax: number;
        readonly curve: AnimationCurve;
        readonly curveMin: AnimationCurve;
        readonly curveMax: AnimationCurve;
        deserialize(element: any): void;
        evaluate(t?: number): number;
    }
    class MinMaxGradient extends paper.SerializableObject {
        mode: ColorGradientMode;
        readonly color: Color;
        readonly colorMin: Color;
        readonly colorMax: Color;
        readonly gradient: Gradient;
        readonly gradientMin: Gradient;
        readonly gradientMax: Gradient;
        deserialize(element: any): void;
        evaluate(t: number, out: Color): Color;
    }
    class Burst implements paper.ISerializable {
        time: number;
        minCount: number;
        maxCount: number;
        cycleCount: number;
        repeatInterval: number;
        serialize(): number[];
        deserialize(element: any): void;
    }
    abstract class ParticleSystemModule extends paper.SerializableObject {
        enable: boolean;
        protected _comp: ParticleComponent;
        constructor(comp: ParticleComponent);
        deserialize(element: any): void;
    }
    class MainModule extends ParticleSystemModule {
        duration: number;
        loop: boolean;
        readonly startDelay: MinMaxCurve;
        readonly startLifetime: MinMaxCurve;
        readonly startSpeed: MinMaxCurve;
        startSize3D: boolean;
        readonly startSizeX: MinMaxCurve;
        readonly startSizeY: MinMaxCurve;
        readonly startSizeZ: MinMaxCurve;
        startRotation3D: boolean;
        readonly startRotationX: MinMaxCurve;
        readonly startRotationY: MinMaxCurve;
        readonly startRotationZ: MinMaxCurve;
        readonly startColor: MinMaxGradient;
        readonly gravityModifier: MinMaxCurve;
        simulationSpace: SimulationSpace;
        scaleMode: ScalingMode;
        playOnAwake: boolean;
        maxParticles: number;
        deserialize(element: any): void;
    }
    class EmissionModule extends ParticleSystemModule {
        readonly rateOverTime: MinMaxCurve;
        readonly rateOverDistance: MinMaxCurve;
        readonly bursts: Array<Burst>;
        deserialize(element: any): void;
    }
    class ShapeModule extends ParticleSystemModule {
        shapeType: ShapeType;
        radius: number;
        angle: number;
        length: number;
        readonly arcSpeed: MinMaxCurve;
        arcMode: ShapeMultiModeValue;
        radiusSpread: number;
        radiusMode: ShapeMultiModeValue;
        readonly box: egret3d.Vector3;
        randomDirection: boolean;
        spherizeDirection: boolean;
        deserialize(element: any): void;
        invalidUpdate(): void;
        generatePositionAndDirection(position: Vector3, direction: Vector3): void;
    }
    class VelocityOverLifetimeModule extends ParticleSystemModule {
        space: SimulationSpace;
        readonly x: MinMaxCurve;
        readonly y: MinMaxCurve;
        readonly z: MinMaxCurve;
        initialize(): void;
        deserialize(element: any): void;
        invalidUpdate(): void;
    }
    class LimitVelocityOverLifetimeModule extends ParticleSystemModule {
        readonly x: MinMaxCurve;
        readonly y: MinMaxCurve;
        readonly z: MinMaxCurve;
        dampen: number;
        separateAxes: boolean;
        space: SimulationSpace;
        deserialize(element: any): void;
    }
    class ColorOverLifetimeModule extends ParticleSystemModule {
        color: MinMaxGradient;
        deserialize(element: any): void;
        invalidUpdate(): void;
    }
    class SizeOverLifetimeModule extends ParticleSystemModule {
        separateAxes: boolean;
        readonly size: MinMaxCurve;
        readonly x: MinMaxCurve;
        readonly y: MinMaxCurve;
        readonly z: MinMaxCurve;
        deserialize(element: any): void;
        invalidUpdate(): void;
    }
    class RotationOverLifetimeModule extends ParticleSystemModule {
        readonly x: MinMaxCurve;
        readonly y: MinMaxCurve;
        readonly z: MinMaxCurve;
        separateAxes: boolean;
        deserialize(element: any): void;
        invalidUpdate(): void;
    }
    class TextureSheetAnimationModule extends ParticleSystemModule {
        numTilesX: number;
        numTilesY: number;
        animation: AnimationType;
        useRandomRow: boolean;
        readonly frameOverTime: MinMaxCurve;
        readonly startFrame: MinMaxCurve;
        cycleCount: number;
        rowIndex: number;
        uvChannelMask: UVChannelFlags;
        flipU: number;
        flipV: number;
        deserialize(element: any): void;
        invalidUpdate(): void;
        evaluate(t: number, out: Vector4): Vector4;
    }
}
declare namespace egret3d.particle {
}
declare namespace egret3d.particle {
    const enum ParticleComponenetEventType {
        ColorOverLifetime = "colorOverLifetime",
        VelocityOverLifetime = "velocityOverLifetime",
        SizeOverLifetime = "sizeOverLifetime",
        RotationOverLifetime = "rotationOverLifetime",
        TextureSheetAnimation = "textureSheetAnimation",
        ShapeChanged = "shapeChanged",
    }
    class ParticleComponent extends paper.BaseComponent {
        readonly main: MainModule;
        readonly emission: EmissionModule;
        readonly shape: ShapeModule;
        readonly velocityOverLifetime: VelocityOverLifetimeModule;
        readonly rotationOverLifetime: RotationOverLifetimeModule;
        readonly sizeOverLifetime: SizeOverLifetimeModule;
        readonly colorOverLifetime: ColorOverLifetimeModule;
        readonly textureSheetAnimation: TextureSheetAnimationModule;
        private readonly _batcher;
        deserialize(element: any): void;
        play(withChildren?: boolean): void;
        pause(withChildren?: boolean): void;
        stop(withChildren?: boolean): void;
        clear(withChildren?: boolean): void;
        readonly loop: boolean;
        readonly isPlaying: boolean;
        readonly isPaused: boolean;
        readonly isAlive: boolean;
    }
}
declare namespace paper {
}
declare namespace egret3d.particle {
    class ParticleSystem extends paper.BaseSystem<ParticleComponent | ParticleRenderer> {
        /**
         * @inheritDoc
         */
        protected readonly _interests: ({
            componentClass: typeof ParticleComponent;
            listeners: {
                type: ParticleComponenetEventType;
                listener: (component: ParticleComponent) => void;
            }[];
        } | {
            componentClass: typeof ParticleRenderer;
            listeners: {
                type: ParticleRendererEventType;
                listener: (comp: ParticleRenderer) => void;
            }[];
        })[];
        private readonly _createDrawCalls;
        private readonly _drawCallList;
        private _globalTimer;
        private _onUpdateDrawCall(gameObject, drawCalls);
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp);
        /**
         *
         * @param component 渲染模式改变
         */
        private _onRenderMode(component);
        /**
         * 更新速率模块
         * @param component
         */
        private _onShapeChanged(component);
        /**
         * 更新速率模块
         * @param component
         */
        private _onVelocityOverLifetime(component);
        /**
         * 更新颜色模块
         * @param component
         */
        private _onColorOverLifetime(component);
        /**
         * 更新大小模块
         * @param component
         */
        private _onSizeOverLifetime(component);
        /**
         * 更新旋转模块
         * @param component
         */
        private _onRotationOverLifetime(component);
        private _onTextureSheetAnimation(component);
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: ParticleComponent | ParticleRenderer): boolean;
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: ParticleComponent | ParticleRenderer): boolean;
        /**
             * @inheritDoc
             */
        update(): void;
    }
}
declare namespace egret3d {
    enum WEBGL_UNIFORM_TYPE {
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
        BYTE = 65535,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
    }
    class WebGLUniform {
        gl: WebGLRenderingContext;
        name: string;
        type: WEBGL_UNIFORM_TYPE;
        size: number;
        location: WebGLUniformLocation;
        value: any;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, uniformData: WebGLActiveInfo);
    }
}
declare namespace egret3d {
    /**
     * 渲染排序
     */
    enum RenderQueue {
        Background = 1000,
        Geometry = 2000,
        AlphaTest = 2450,
        Transparent = 3000,
        Overlay = 4000,
    }
    /**
     * material asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 材质资源
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Material extends paper.Asset {
        /**
         */
        version: number;
        $uniforms: {
            [name: string]: {
                type: UniformTypeEnum;
                value: any;
            };
        };
        private _defines;
        private shader;
        private _textureRef;
        private _changeShaderMap;
        private _renderQueue;
        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        dispose(): void;
        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclByteLength(): number;
        private _setDefaultUniforms(shader);
        /**
         * set shader
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置着色器，不保留原有数据。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setShader(shader: Shader): void;
        /**
          * get shader
          * @version paper 1.0
          * @platform Web
          * @language en_US
          */
        /**
         * 获取当前着色器。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getShader(): Shader;
        /**
         * change shader
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 更改着色器，保留原有数据。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        changeShader(shader: Shader): void;
        renderQueue: RenderQueue;
        readonly shaderDefine: string;
        addDefine(key: string): void;
        removeDefine(key: string): void;
        setBoolean(_id: string, _bool: boolean): void;
        setInt(_id: string, _number: number): void;
        setFloat(_id: string, _number: number): void;
        setFloatv(_id: string, _numbers: Float32Array): void;
        setVector2(_id: string, _vector2: Vector2): void;
        setVector2v(_id: string, _vector2v: Float32Array): void;
        setVector3(_id: string, _vector3: Vector3): void;
        setVector3v(_id: string, _vector3v: Float32Array): void;
        setVector4(_id: string, _vector4: Vector4): void;
        setVector4v(_id: string, _vector4v: Float32Array): void;
        setMatrix(_id: string, _matrix: Matrix): void;
        setMatrixv(_id: string, _matrixv: Float32Array): void;
        setTexture(_id: string, _texture: egret3d.Texture): void;
        /**
         *
         */
        $parse(json: any): void;
        /**
         * clone material
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆材质资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        clone(): Material;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
        xAddvance: number;
        static caclByteLength(): number;
    }
    /**
     * font asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 字体资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Font extends paper.Asset {
        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        dispose(): void;
        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclByteLength(): number;
        private _texture;
        /**
         * font texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 字体材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        /**
         * font texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 字体材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        texture: Texture;
        /**
         *
         * 字体信息map
         */
        cmap: {
            [id: string]: Charinfo;
        };
        /**
         *
         */
        fontname: string;
        /**
         *
         * 像素尺寸
         */
        pointSize: number;
        /**
         *
         * 间隔
         */
        padding: number;
        /**
         *
         * 行高
         */
        lineHeight: number;
        /**
         *
         * 基线
         */
        baseline: number;
        /**
         *
         */
        atlasWidth: number;
        /**
         *
         */
        atlasHeight: number;
        /**
         *
         */
        $parse(json: any): void;
    }
}
declare namespace egret3d {
    /**
     * uniform类型枚举
     */
    enum UniformTypeEnum {
        Texture = 0,
        Int = 1,
        Boolean = 2,
        Float = 3,
        Floatv = 4,
        Float2 = 5,
        Float2v = 6,
        Float3 = 7,
        Float3v = 8,
        Float4 = 9,
        Float4v = 10,
        Float4x4 = 11,
        Float4x4v = 12,
    }
    enum ShowFaceStateEnum {
        ALL = 0,
        CCW = 1,
        CW = 2,
    }
    enum DrawModeEnum {
        VboTri = 0,
        VboLine = 1,
        EboTri = 2,
        EboLine = 3,
    }
    enum BlendModeEnum {
        Close = 0,
        Blend = 1,
        Blend_PreMultiply = 2,
        Add = 3,
        Add_PreMultiply = 4,
    }
    class DrawPass {
        state_showface: ShowFaceStateEnum;
        state_zwrite: boolean;
        state_ztest: boolean;
        state_ztest_method: number;
        state_blend: boolean;
        state_blendEquation: number;
        state_blendSrcRGB: number;
        state_blendDestRGB: number;
        state_blendSrcAlpha: number;
        state_blendDestALpha: number;
        vShaderInfo: ShaderInfo;
        fShaderInfo: ShaderInfo;
        constructor(vShaderInfo: ShaderInfo, fShaderInfo: ShaderInfo);
        setAlphaBlend(mode: BlendModeEnum): void;
    }
}
declare namespace egret3d {
    /**
     * Transform Class
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * Transform实例可以被添加到3D场景中，并持有一个GameObejct实例
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Transform extends paper.BaseComponent {
        /**
         * children list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 子物体列表
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        readonly children: Transform[];
        private _dirtyAABB;
        private _dirtyLocal;
        private _dirtyWorld;
        /**
         * 世界矩阵的行列式，如果小于0，说明进行了反转
         *
         */
        _worldMatrixDeterminant: number;
        private readonly localMatrix;
        private readonly worldMatrix;
        private readonly localPosition;
        private readonly position;
        private readonly localRotation;
        private readonly rotation;
        private readonly localEulerAngles;
        private readonly eulerAngles;
        private readonly localScale;
        private readonly scale;
        private _aabb;
        private _parent;
        private _removeFromChildren(value);
        private _buildAABB();
        private _sync();
        private _dirtify(local?);
        /**
         *
         */
        $getGlobalPosition(): ImmutableVector4;
        /**
         * 父节点发生改变的回调方法
         * 子类可通过重载此方法进行标脏状态传递
         */
        protected _onParentChange(newParent: Transform | null, oldParent: Transform | null): void;
        /**
         * @inheritDoc
         */
        deserialize(element: any): void;
        /**
         * 设置父节点
         */
        setParent(newParent: Transform | null, worldPositionStays?: boolean): void;
        /**
         * 获取对象下标的子集对象
         * @param index
         */
        getChild(index: number): Transform;
        /**
         * get local matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getLocalMatrix(): Matrix;
        /**
         * get world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getWorldMatrix(): Matrix;
        /**
         * get local position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getLocalPosition(): Vector3;
        /**
         * set local position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setLocalPosition(v: Vector3): void;
        setLocalPosition(x: number, y: number, z: number): void;
        /**
         * get position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getPosition(): Vector3;
        /**
         * set rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setPosition(v: Vector3): void;
        setPosition(x: number, y: number, z: number): void;
        /**
         * get local rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取本地旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getLocalRotation(): Quaternion;
        /**
         * set local rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setLocalRotation(v: Quaternion): void;
        setLocalRotation(x: number, y: number, z: number, w: number): void;
        /**
         * get rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getRotation(): Quaternion;
        /**
         * set rotation
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置旋转
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setRotation(v: Quaternion): void;
        setRotation(x: number, y: number, z: number, w: number): void;
        /**
         * get local euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取本地欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getLocalEulerAngles(): Vector3;
        /**
         * set local euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setLocalEulerAngles(v: Vector3): void;
        setLocalEulerAngles(x: number, y: number, z: number): void;
        /**
         * get euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getEulerAngles(): Vector3;
        /**
         * set euler angles
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置欧拉角
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setEulerAngles(v: Vector3): void;
        setEulerAngles(x: number, y: number, z: number): void;
        /**
         * get local scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得本地缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getLocalScale(): Vector3;
        /**
         * set local scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置本地缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setLocalScale(v: Vector3): void;
        setLocalScale(x: number, y: number, z: number): void;
        /**
         * get scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获得缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getScale(): Vector3;
        /**
         * set scale
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置缩放
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        setScale(v: Vector3): void;
        setScale(x: number, y: number, z: number): void;
        /**
         * look at a target
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 旋转当前transform 到指定的目标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        lookAt(target: Transform | Vector3, up?: Vector3): void;
        /**
         * z-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前z轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getForward(out: Vector3): Vector3;
        /**
         * x-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前x轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getRight(out: Vector3): void;
        /**
         * y-axis towards in world space
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取世界坐标系下当前y轴的朝向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getUp(out: Vector3): void;
        /**
         * Finds a child by name or path and returns it.
         * @param nameOrPath
         */
        find(nameOrPath: string): Transform;
        private _getAllChildren(children);
        /**
         * 当前子集对象的数量
         */
        readonly childCount: number;
        /**
         *
         */
        readonly aabb: AABB;
        /**
         * instance of parent transform
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 父元素实例
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        parent: Transform | null;
    }
    type ImmutableVector4 = Readonly<Float32Array>;
}
declare namespace egret3d {
    type ShaderInfo = {
        name: string;
        src: string;
    };
    /**
     * shader asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 着色器资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Shader extends paper.Asset {
        private static readonly _vertShaderInfoMap;
        private static readonly _fragShaderInfoMap;
        /**
         *
         */
        static registerVertShader(name: string, src: string): ShaderInfo;
        /**
         *
         */
        static registerFragShader(name: string, src: string): ShaderInfo;
        /**
         * 渲染队列
         */
        renderQueue: RenderQueue;
        readonly passes: {
            [id: string]: egret3d.DrawPass[];
        };
        /**
         *
         */
        readonly defaultValue: {
            [key: string]: {
                type: string;
                value?: any;
                min?: number;
                max?: number;
            };
        };
        /**
         * TODO 应补全接口和枚举。
         *
         */
        $parse(json: any): void;
        private _parseProperties(properties);
        /**
         * TODO 应补全接口和枚举。
         */
        private _parsePass(json);
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
    }
}
declare namespace egret3d {
    /**
     * atlas asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 图集资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Atlas extends paper.Asset {
        /**
         * texture pixel width
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 纹理像素宽度。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        texturewidth: number;
        /**
         * texture pixel height
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 纹理像素高度。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        textureheight: number;
        /**
         * sprite map
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 精灵字典，key为精灵名称。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        private readonly _sprites;
        private _texture;
        /**
         *
         */
        $parse(json: string): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        readonly sprites: Readonly<{
            [key: string]: Sprite;
        }>;
        /**
         * atlas texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 图集材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        texture: Texture | null;
    }
}
declare namespace egret3d {
    /**
     * Asset Bundle
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 资源包.
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class AssetBundle extends paper.Asset {
        readonly assets: {
            url: string;
        }[];
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
        /**
         *
         */
        $parse(json: {
            assets?: any[];
        }): void;
    }
}
declare namespace egret3d {
    /**
     * ray
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 射线
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Ray {
        /**
         * ray origin point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 射线起始点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        origin: Vector3;
        /**
         * ray direction vector
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 射线的方向向量
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        direction: Vector3;
        /**
         * build a ray
         * @param origin ray origin point
         * @param dir ray direction vector
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构建一条射线
         * @param origin 射线起点
         * @param dir 射线方向
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        constructor(origin: Vector3, direction: Vector3);
        /**
         * intersect with aabb
         * @param aabb aabb instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与aabb碰撞相交检测
         * @param aabb aabb实例
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectAABB(aabb: AABB): boolean;
        /**
         * intersect with transform plane
         * @param tran tranform instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与transform表示的plane碰撞相交检测，主要用于2d检测
         * @param tran transform实例
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectPlaneTransform(tran: Transform): PickInfo;
        intersectPlane(planePoint: Vector3, planeNormal: Vector3): Vector3;
        /**
         * intersect with collider
         * @param tran tranform instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与碰撞盒相交检测
         * @param tran 待检测带碰撞盒的transform
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectCollider(tran: Transform): PickInfo;
        /**
         * intersect with box
         * @param minimum min vector
         * @param maximum max vector
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与最大最小点表示的box相交检测
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectBoxMinMax(minimum: Vector3, maximum: Vector3): boolean;
        /**
         * intersect with sphere
         * @param center sphere center
         * @param radius sphere radius
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与球相交检测
         * @param center 球圆心坐标
         * @param radius 球半径
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectsSphere(center: Vector3, radius: number): boolean;
        /**
         * intersect with triangle
         * @param vertex0
         * @param vertex1
         * @param vertex2
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 与三角形相交检测
         * @param vertex0
         * @param vertex1
         * @param vertex2
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        intersectsTriangle(vertex0: Vector3, vertex1: Vector3, vertex2: Vector3): PickInfo;
    }
}
declare namespace egret3d.ShaderLib {
    const boneeff_vert = "attribute vec4 _glesVertex;   \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 glstate_vec4_bones[110];\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nmat4 buildMat4(int index)\n{\n vec4 quat = glstate_vec4_bones[index * 2 + 0];\n vec4 translation = glstate_vec4_bones[index * 2 + 1];\n float xy2 = 2.0 * quat.x * quat.y;\n float xz2 = 2.0 * quat.x * quat.z;\n float xw2 = 2.0 * quat.x * quat.w;\n float yz2 = 2.0 * quat.y * quat.z;\n float yw2 = 2.0 * quat.y * quat.w;\n float zw2 = 2.0 * quat.z * quat.w;\n float xx = quat.x * quat.x;\n float yy = quat.y * quat.y;\n float zz = quat.z * quat.z;\n float ww = quat.w * quat.w;\n mat4 matrix = mat4(\n xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,\n xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,\n xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,\n translation.x, translation.y, translation.z, 1);\n return matrix;\n}\n\nhighp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)\n{\n int i = int(blendIndex.x);  \n    int i2 =int(blendIndex.y);\n int i3 =int(blendIndex.z);\n int i4 =int(blendIndex.w);\n \n    mat4 mat = buildMat4(i)*blendWeight.x \n    + buildMat4(i2)*blendWeight.y \n    + buildMat4(i3)*blendWeight.z \n    + buildMat4(i4)*blendWeight.w;\n return mat* srcVertex;\n}\n\n\nvoid main()\n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz;  \n    \n    gl_Position = glstate_matrix_mvp *  tmpvar_1;\n\n xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n}";
    const bone_vert = "attribute vec4 _glesVertex;   \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp mat4 glstate_matrix_bones[24];\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nvoid main()                                     \n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;  \n \n    int i = int(_glesBlendIndex4.x);  \n    int i2 =int(_glesBlendIndex4.y);\n int i3 =int(_glesBlendIndex4.z);\n int i4 =int(_glesBlendIndex4.w);\n \n    mat4 mat = glstate_matrix_bones[i]*_glesBlendWeight4.x \n    + glstate_matrix_bones[i2]*_glesBlendWeight4.y \n    + glstate_matrix_bones[i3]*_glesBlendWeight4.z \n    + glstate_matrix_bones[i4]*_glesBlendWeight4.w;\n    \n    gl_Position = (glstate_matrix_mvp * mat)* tmpvar_1;\n\n xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\n}";
    const code2_frag = "void main() {\n    gl_FragData[0] = vec4(1.0, 1.0, 1.0, 1.0);\n}";
    const code_frag = "uniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() {\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    prev_2 = tmpvar_3;\n    mediump vec4 tmpvar_4;\n    tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    col_1 = tmpvar_4;\n    col_1.x =xlv_TEXCOORD0.x;\n    col_1.y =xlv_TEXCOORD0.y;\n    gl_FragData[0] = col_1;\n}";
    const code_vert = "attribute vec4 _glesVertex;\nattribute vec4 _glesColor;             \nattribute vec4 _glesMultiTexCoord0;    \nuniform highp mat4 glstate_matrix_mvp; \nvarying lowp vec4 xlv_COLOR;           \nvarying highp vec2 xlv_TEXCOORD0;      \nvoid main() {                                          \n    highp vec4 tmpvar_1;                   \n    tmpvar_1.w = 1.0;                      \n    tmpvar_1.xyz = _glesVertex.xyz;        \n    xlv_COLOR = _glesColor;                \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const depthpackage_frag = "#include <packing>\n\nvoid main() {\n gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n}";
    const depthpackage_vert = "attribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\n\nvoid main() { \n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const diffuselightmap_frag = "uniform sampler2D _MainTex;\nuniform sampler2D _LightmapTex;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nlowp vec3 decode_hdr(lowp vec4 data)\n{\n    highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);\n    return data.rgb * power * 1.0 ;\n}\nvoid main() \n{\n    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0);\n    if(outColor.a < _AlphaCut)\n        discard;\n    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);\n    outColor.xyz *= decode_hdr(lightmap);\n    gl_FragData[0] = outColor;\n}";
    const diffuselightmap_vert = "attribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nattribute vec4 _glesMultiTexCoord1;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 glstate_lightmapOffset;\nuniform lowp float glstate_lightmapUV;\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nvoid main()\n{\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n\n    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;\n    if(glstate_lightmapUV == 0.0)\n    {\n        beforelightUV = _glesMultiTexCoord0.xy;\n    }\n    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;\n    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);\n    xlv_TEXCOORD1 = vec2(u,v);\n\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const diffuse_frag = "uniform sampler2D _MainTex;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);\n    gl_FragData[0] = tmpvar_3;\n}";
    const diffuse_vert = "attribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 _MainTex_ST;  \nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const distancepackage_frag = "#include <packing>\n\nvarying vec3 xlv_POS;\nuniform vec4 glstate_referencePosition;\nuniform float glstate_nearDistance;\nuniform float glstate_farDistance;\n\nvoid main() {\n    float dist = length( xlv_POS - glstate_referencePosition.xyz );\n dist = ( dist - glstate_nearDistance ) / ( glstate_farDistance - glstate_nearDistance );\n dist = saturate( dist ); // clamp to [ 0, 1 ]\n\n gl_FragColor = packDepthToRGBA( dist );\n}";
    const distancepackage_vert = "attribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\nuniform mat4 glstate_matrix_model;\n\nvarying vec3 xlv_POS;\n\nvoid main() {   \n    xlv_POS = (glstate_matrix_model * vec4(_glesVertex, 1.0)).xyz;\n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const lambert_frag = "#extension GL_OES_standard_derivatives : enable\n\nuniform sampler2D _MainTex;\nuniform vec4 _Color;         \n\n#include <bsdfs>\n#include <light_pars_frag>\n#include <shadowMap_pars_frag>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#ifdef USE_NORMAL_MAP\n    #include <tbn>\n    #include <tsn>\n    uniform sampler2D _NormalTex;\n#endif\n\n#include <bumpMap_pars_frag>\n\nvoid main() {\n    vec4 outColor = vec4(0., 0., 0., 1.);\n\n    vec4 diffuseColor = _Color * texture2D(_MainTex, xlv_TEXCOORD0);\n\n    #include <normal_frag>\n    #include <light_frag>\n\n    outColor.a = diffuseColor.a;\n\n    gl_FragColor = outColor;\n}";
    const lambert_vert = "attribute vec3 _glesVertex;   \nattribute vec3 _glesNormal;               \nattribute vec4 _glesMultiTexCoord0;    \n\nuniform mat4 glstate_matrix_mvp;      \nuniform mat4 glstate_matrix_model;\n\n#include <shadowMap_pars_vert>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#include <transpose>\n#include <inverse>\n\nvoid main() {   \n    vec4 tmpvar_1 = vec4(_glesVertex.xyz, 1.0);                            \n\n    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(_glesNormal, 1.0)).xyz;\n    xlv_NORMAL = normal;\n    #ifdef FLIP_SIDED\n     xlv_NORMAL = - xlv_NORMAL;\n    #endif\n\n    vec3 worldpos = (glstate_matrix_model * tmpvar_1).xyz;\n    xlv_POS = worldpos; \n\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n\n    #include <shadowMap_vert>\n     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const line_frag = "varying lowp vec4 xlv_COLOR;\nvoid main() {\n    gl_FragData[0] = xlv_COLOR;\n}";
    const line_vert = "attribute vec4 _glesVertex;\nattribute vec4 _glesColor;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _glesColor;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const materialcolor_vert = "attribute vec4 _glesVertex;\nuniform vec4 _Color;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _Color;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const particlesystem_frag = "\nuniform sampler2D _MainTex;\nuniform vec4 _TintColor;\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n\n#ifdef RENDERMODE_MESH\n varying vec4 v_mesh_color;\n#endif\n\nvoid main()\n{ \n #ifdef RENDERMODE_MESH\n  gl_FragColor=v_mesh_color;\n #else\n  gl_FragColor=vec4(1.0); \n #endif\n  \n #ifdef DIFFUSEMAP\n  if(v_discard!=0.0)\n   discard;\n  #ifdef TINTCOLOR\n   gl_FragColor*=texture2D(_MainTex,v_texcoord)*_TintColor*v_color*2.0;\n  #else\n   gl_FragColor*=texture2D(_MainTex,v_texcoord)*v_color;\n  #endif\n #else\n  #ifdef TINTCOLOR\n   gl_FragColor*=_TintColor*v_color*2.0;\n  #else\n   gl_FragColor*=v_color;\n  #endif\n #endif\n}";
    const particlesystem_vert = "#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)\n attribute vec2 _glesCorner;\n#endif\n#ifdef RENDERMESH\n attribute vec3 _glesVertex;\n attribute vec4 _glesColor;\n#endif\nattribute vec2 _glesMultiTexCoord0;\nattribute vec3 _startPosition;\nattribute vec3 _startVelocity;\nattribute vec4 _startColor;\nattribute vec3 _startSize;\nattribute vec3 _startRotation;\nattribute vec2 _time;\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)\n  attribute vec4 _random0;\n#endif\n#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  attribute vec4 _random1;\n#endif\nattribute vec3 _startWorldPosition;\nattribute vec4 _startWorldRotation;\n\n#include <particle_common>\n\nvoid main()\n{\n float age = u_currentTime - _time.y;\n float t = age/_time.x;\n if(t>1.0){    \n   v_discard=1.0;\n   return;\n  }\n   \n #include <particle_affector>\n gl_Position=glstate_matrix_vp*vec4(center,1.0);\n v_color = computeColor(_startColor, t);\n #ifdef DIFFUSEMAP\n  v_texcoord =computeUV(_glesMultiTexCoord0, t);\n #endif\n v_discard=0.0;\n}\n\n";
    const postdepth_frag = "precision highp float;\n//varying highp vec3 xlv_Normal;   \n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\nvec2 packDepthToRG( const in float v ) \n{\n    vec2 r = vec2( fract( v * PackFactors.z ), v );\n r.y -= r.x * ShiftRight8;\n    return r * PackUpscale;\n}\nfloat unpackRGToDepth( const in vec2 v ) \n{\n    return dot( v.xy, UnpackFactors.zw );\n}\nvec3 packDepthToRGB( const in float v ) \n{\n    vec3 r = vec3( fract( v * PackFactors.yz ), v );\n r.yz -= r.xy * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBToDepth( const in vec3 v ) \n{\n    return dot( v.xyz, UnpackFactors.yzw );\n}\nvoid main() \n{\n    float z = gl_FragCoord.z;// fract(gl_FragCoord.z *256.*256.);\n    // highp vec2 normal =xlv_Normal.xy;\n    gl_FragColor=packDepthToRGBA(z);\n}";
    const postdepth_vert = "precision highp float;\nattribute vec4 _glesVertex;    \n\nuniform highp mat4 glstate_matrix_mvp;      \n            \nvoid main()                                     \n{        \n    gl_Position = (glstate_matrix_mvp * _glesVertex);  \n}";
    const postquaddepth_frag = "precision mediump float;\nvarying highp vec2 xlv_TEXCOORD0;       \nuniform sampler2D _DepthTex;   \nuniform sampler2D _MainTex;  \n\n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\n\n\nfloat planeDistance(const in vec3 positionA, const in vec3 normalA, \n                    const in vec3 positionB, const in vec3 normalB) \n{\n  vec3 positionDelta = positionB-positionA;\n  float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));\n  return planeDistanceDelta;\n}\n\nvoid main()         \n{\n    lowp vec4 c1=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0.001,0));\n    lowp vec4 c2=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(-0.001,0));\n    lowp vec4 c3=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,0.001));\n    lowp vec4 c4=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,-0.001));\n    highp float z1 = unpackRGBAToDepth(c1);\n    highp float z2 = unpackRGBAToDepth(c2);\n    highp float z3 = unpackRGBAToDepth(c3);\n    highp float z4 = unpackRGBAToDepth(c4);\n    highp float d = clamp(  (abs(z2-z1)+abs(z4-z3))*10.0,0.0,1.0);\n    lowp vec4 c=texture2D(_MainTex, xlv_TEXCOORD0);\n    lowp float g = c.r*0.3+c.g*0.6+c.b*0.1;\n\n    gl_FragColor =mix(vec4(g,g,g,1.),vec4(1.0,1.0,0.0,1.0),d);// vec4(g*d,g*d,g*d,1.0);\n}";
    const postquad_vert = "attribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0; \nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main()                     \n{ \n    gl_Position = _glesVertex;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw; \n}   ";
    const tintcolor_frag = "uniform sampler2D _MainTex;\nuniform lowp float _AlphaCut;\nuniform lowp vec4 _TintColor;\n\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() \n{\n    lowp vec4 tmpvar_3 = _TintColor*texture2D(_MainTex, xlv_TEXCOORD0);\n    if(tmpvar_3.a < _AlphaCut)\n        discard;\n    gl_FragData[0] = tmpvar_3;\n}";
    const transparentdiffuse_vert = "";
    const uifont_frag = "precision mediump float;\nuniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying lowp vec4 xlv_COLOREx;\nvarying highp vec2 xlv_TEXCOORD0;  \nvoid main() {\n    float scale = 10.0;\n    float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5) * scale;  //0.5\n    float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34) * scale;  //0.34\n\n    float c=xlv_COLOR.a * clamp ( d,0.0,1.0);\n    float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);\n    bc =min(1.0-c,bc);\n\n    gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc;\n}";
    const uifont_vert = "attribute vec4 _glesVertex;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesColorEx;                  \nattribute vec4 _glesMultiTexCoord0;         \nuniform highp mat4 glstate_matrix_mvp;      \nvarying lowp vec4 xlv_COLOR;                \nvarying lowp vec4 xlv_COLOREx;                                                 \nvarying highp vec2 xlv_TEXCOORD0;           \nvoid main() {                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_COLOREx = _glesColorEx;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}";
    const ui_frag = "uniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_frag = "uniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() \n{\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n\n    tmpvar_3 = (texture2D(_MainTex, xlv_TEXCOORD0));\n    //prev_2 = tmpvar_3;\n    //mediump vec4 tmpvar_4;\n    //tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    //col_1 = tmpvar_4;\n    //col_1.x = xlv_TEXCOORD0.x;\n    //col_1.y = xlv_TEXCOORD0.y;\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_vert = "attribute vec4 _glesVertex;   \nattribute vec4 _glesNormal;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesMultiTexCoord0;        \nuniform highp mat4 glstate_matrix_mvp;   \nvarying lowp vec4 xlv_COLOR;                \nvarying highp vec2 xlv_TEXCOORD0;   \n\nuniform highp vec4 _MainTex_ST;       \n\nvoid main()                                     \n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;   \n\n    //xlv_COLOR.xyz =pos.xyz;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}\n";
}
declare namespace egret3d.ShaderChunk {
    const begin_vert = "vec3 transformed = vec3(_glesVertex);\n// #if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n    vec3 objectNormal = vec3(_glesNormal);\n// #endif";
    const bsdfs = "// diffuse just use lambert\n\nvec3 BRDF_Diffuse_Lambert(vec3 diffuseColor) {\n    return RECIPROCAL_PI * diffuseColor;\n}\n\n// specular use Cook-Torrance microfacet model, http://ruh.li/GraphicsCookTorrance.html\n// About RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272\n\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n // Original approximation by Christophe Schlick '94\n float fresnel = pow( 1.0 - dotLH, 5.0 );\n\n // Optimized variant (presented by Epic at SIGGRAPH '13)\n // float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\n return ( 1.0 - specularColor ) * fresnel + specularColor;\n}\n\n// use blinn phong instead of phong\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n    // ( shininess * 0.5 + 1.0 ), three.js do this, but why ???\n return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\n\nfloat G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {\n // geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\n return 0.25;\n}\n\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n    vec3 H = normalize(L + V);\n\n    float dotNH = saturate(dot(N, H));\n    float dotLH = saturate(dot(L, H));\n\n    vec4 F = F_Schlick(specularColor, dotLH);\n\n    float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n    float D = D_BlinnPhong(shininess, dotNH);\n\n    return F * G * D;\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (33)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\n float a2 = pow2( alpha );\n\n float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\n\n return RECIPROCAL_PI * a2 / pow2( denom );\n\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (34)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n // geometry term = G(l)⋅G(v) / 4(n⋅l)(n⋅v)\n\n float a2 = pow2( alpha );\n\n float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\n return 1.0 / ( gl * gv );\n\n}\n\n// Moving Frostbite to Physically Based Rendering 2.0 - page 12, listing 2\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n float a2 = pow2( alpha );\n\n // dotNL and dotNV are explicitly swapped. This is not a mistake.\n float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\n return 0.5 / max( gv + gl, EPSILON );\n}\n\n// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility\nvec4 BRDF_Specular_GGX(vec4 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {\n\n float alpha = pow2( roughness ); // UE4's roughness\n\n vec3 H = normalize(L + V);\n\n float dotNL = saturate( dot(N, L) );\n float dotNV = saturate( dot(N, V) );\n float dotNH = saturate( dot(N, H) );\n float dotLH = saturate( dot(L, H) );\n\n vec4 F = F_Schlick( specularColor, dotLH );\n\n float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\n float D = D_GGX( alpha, dotNH );\n\n return F * G * D;\n\n}\n\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\nvec4 BRDF_Specular_GGX_Environment( const in vec3 N, const in vec3 V, const in vec4 specularColor, const in float roughness ) {\n\n float dotNV = saturate( dot( N, V ) );\n\n const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\n const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\n vec4 r = roughness * c0 + c1;\n\n float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\n vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\n return specularColor * AB.x + AB.y;\n\n}\n\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\n\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}";
    const bumpMap_pars_frag = "#ifdef USE_BUMPMAP\n\n uniform sampler2D bumpMap;\n uniform float bumpScale;\n\n // Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n // http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n // Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n vec2 dHdxy_fwd(vec2 uv) {\n\n  vec2 dSTdx = dFdx( uv );\n  vec2 dSTdy = dFdy( uv );\n\n  float Hll = bumpScale * texture2D( bumpMap, uv ).x;\n  float dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n  float dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\n  return vec2( dBx, dBy );\n\n }\n\n vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\n  vec3 vSigmaX = dFdx( surf_pos );\n  vec3 vSigmaY = dFdy( surf_pos );\n  vec3 vN = surf_norm;  // normalized\n\n  vec3 R1 = cross( vSigmaY, vN );\n  vec3 R2 = cross( vN, vSigmaX );\n\n  float fDet = dot( vSigmaX, R1 );\n\n  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n  return normalize( abs( fDet ) * surf_norm - vGrad );\n\n }\n\n#endif\n";
    const inverse = "mat4 inverse(mat4 m) {\n    float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}";
    const light_frag = "#ifdef USE_LIGHT    \n    vec3 L;\n    vec3 light;\n    vec3 totalReflect = vec3(0., 0., 0.);\n\n    #ifdef USE_DIRECT_LIGHT\n        for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\n            light = vec3(glstate_directLights[i * 15 + 6], glstate_directLights[i * 15 + 7], glstate_directLights[i * 15 + 8]) * glstate_directLights[i * 15 + 9];\n\n            L.x = glstate_directLights[i * 15 + 3];\n            L.y = glstate_directLights[i * 15 + 4];\n            L.z = glstate_directLights[i * 15 + 5];\n            L = normalize(-L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                irradiance *= bool( glstate_directLights[i * 15 + 10] ) ? getShadow( glstate_directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], glstate_directLights[i * 15 + 11], glstate_directLights[i * 15 + 12], vec2(glstate_directLights[i * 15 + 13], glstate_directLights[i * 15 + 14]) ) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n        for(int i = 0; i < USE_POINT_LIGHT; i++) {\n            L = vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]) - xlv_POS;\n            float dist = pow(clamp(1. - length(L) / glstate_pointLights[i * 19 + 10], 0.0, 1.0), glstate_pointLights[i * 19 + 11]);\n            light = vec3(glstate_pointLights[i * 19 + 6], glstate_pointLights[i * 19 + 7], glstate_pointLights[i * 19 + 8]) * glstate_pointLights[i * 19 + 9] * dist;\n            L = normalize(L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                vec3 worldV = xlv_POS - vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]);\n                irradiance *= bool( glstate_pointLights[i * 19 + 12] ) ? getPointShadow( glstate_pointShadowMap[ i ], worldV, glstate_pointLights[i * 19 + 13], glstate_pointLights[i * 19 + 14], vec2(glstate_pointLights[i * 19 + 17], glstate_pointLights[i * 19 + 18]), glstate_pointLights[i * 19 + 15], glstate_pointLights[i * 19 + 16]) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n        for(int i = 0; i < USE_SPOT_LIGHT; i++) {\n            L = vec3(glstate_spotLights[i * 19 + 0], glstate_spotLights[i * 19 + 1], glstate_spotLights[i * 19 + 2]) - xlv_POS;\n            float lightDistance = length(L);\n            L = normalize(L);\n            float angleCos = dot( L, -normalize(vec3(glstate_spotLights[i * 19 + 3], glstate_spotLights[i * 19 + 4], glstate_spotLights[i * 19 + 5])) );\n\n            if( all( bvec2(angleCos > glstate_spotLights[i * 19 + 12], lightDistance < glstate_spotLights[i * 19 + 10]) ) ) {\n\n                float spotEffect = smoothstep( glstate_spotLights[i * 19 + 12], glstate_spotLights[i * 19 + 13], angleCos );\n                float dist = pow(clamp(1. - lightDistance / glstate_spotLights[i * 19 + 10], 0.0, 1.0), glstate_spotLights[i * 19 + 11]);\n                light = vec3(glstate_spotLights[i * 19 + 6], glstate_spotLights[i * 19 + 7], glstate_spotLights[i * 19 + 8]) * glstate_spotLights[i * 19 + 9] * dist * spotEffect;\n\n                float dotNL = saturate( dot(N, L) );\n                vec3 irradiance = light * dotNL;\n\n                #ifdef USE_PBR\n                    irradiance *= PI;\n                #endif\n\n                #ifdef USE_SHADOW\n                    irradiance *= bool( glstate_spotLights[i * 17 + 14] ) ? getShadow( glstate_spotShadowMap[ i ], vSpotShadowCoord[ i ], glstate_spotLights[i * 17 + 15], glstate_spotLights[i * 17 + 16], vec2(glstate_spotLights[i * 17 + 17], glstate_spotLights[i * 17 + 18])) : 1.0;\n                #endif\n\n                vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n                totalReflect += reflectLight;\n            }\n\n        }\n    #endif\n\n    outColor.xyz = totalReflect;\n#endif";
    const light_pars_frag = "#ifdef USE_DIRECT_LIGHT\n    uniform float glstate_directLights[USE_DIRECT_LIGHT * 15];\n#endif\n\n#ifdef USE_POINT_LIGHT\n    uniform float glstate_pointLights[USE_POINT_LIGHT * 19];\n#endif\n\n#ifdef USE_SPOT_LIGHT\n    uniform float glstate_spotLights[USE_SPOT_LIGHT * 19];\n#endif";
    const normal_frag = "#ifdef DOUBLE_SIDED\n    float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n#else\n    float flipNormal = 1.0;\n#endif\n#ifdef FLAT_SHADED\n    // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\n    vec3 fdx = vec3( dFdx( xlv_POS.x ), dFdx( xlv_POS.y ), dFdx( xlv_POS.z ) );\n    vec3 fdy = vec3( dFdy( xlv_POS.x ), dFdy( xlv_POS.y ), dFdy( xlv_POS.z ) );\n    vec3 N = normalize( cross( fdx, fdy ) );\n#else\n    vec3 N = normalize(xlv_NORMAL) * flipNormal;\n#endif\n#ifdef USE_NORMAL_MAP\n    vec3 normalMapColor = texture2D(_NormalTex, xlv_TEXCOORD0).rgb;\n    // for now, uv coord is flip Y\n    mat3 tspace = tsn(N, -xlv_POS, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    // mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\n#elif defined(USE_BUMPMAP)\n    N = perturbNormalArb(-xlv_POS, N, dHdxy_fwd(xlv_TEXCOORD0));\n#endif";
    const packing = "const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n    return r * PackUpscale;\n\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\n    return dot( v, UnpackFactors );\n\n}";
    const particle_affector = "vec3 lifeVelocity = computeVelocity(t);\nvec4 worldRotation;\nif(u_simulationSpace==1)\n worldRotation=_startWorldRotation;\nelse\n worldRotation=u_worldRotation;\nvec3 gravity=u_gravity*age;\n\nvec3 center=computePosition(_startVelocity, lifeVelocity, age, t,gravity,worldRotation); \n#ifdef SPHERHBILLBOARD\n   vec2 corner=_glesCorner.xy;\n      vec3 cameraUpVector =normalize(glstate_cameraUp);\n      vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n      vec3 upVector = normalize(cross(sideVector,glstate_cameraForward));\n     corner*=computeBillbardSize(_startSize.xy,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n   if(u_startSize3D){\n    vec3 rotation=vec3(_startRotation.xy,computeRotation(_startRotation.z,age,t));\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,rotation);\n   }\n   else{\n    float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #else\n   if(u_startSize3D){\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,_startRotation);\n   }\n   else{\n    float c = cos(_startRotation.x);\n    float s = sin(_startRotation.x);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #endif\n #endif\n #ifdef STRETCHEDBILLBOARD\n  vec2 corner=_glesCorner.xy;\n  vec3 velocity;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n      if(u_spaceType==0)\n       velocity=rotation_quaternions(u_sizeScale*(_startVelocity+lifeVelocity),worldRotation)+gravity;\n      else\n       velocity=rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+lifeVelocity+gravity;\n   #else\n      velocity= rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+gravity;\n   #endif \n  vec3 cameraUpVector = normalize(velocity);\n  vec3 direction = normalize(center-glstate_cameraPos);\n    vec3 sideVector = normalize(cross(direction,normalize(velocity)));\n  sideVector=u_sizeScale.xzy*sideVector;\n  cameraUpVector=length(vec3(u_sizeScale.x,0.0,0.0))*cameraUpVector;\n    vec2 size=computeBillbardSize(_startSize.xy,t);\n    const mat2 rotaionZHalfPI=mat2(0.0, -1.0, 1.0, 0.0);\n    corner=rotaionZHalfPI*corner;\n    corner.y=corner.y-abs(corner.y);\n    float speed=length(velocity);\n    center +=sign(u_sizeScale.x)*(sign(u_lengthScale)*size.x*corner.x*sideVector+(speed*u_speeaScale+size.y*u_lengthScale)*corner.y*cameraUpVector);\n #endif\n #ifdef HORIZONTALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector=vec3(0.0,0.0,1.0);\n    const vec3 sideVector = vec3(-1.0,0.0,0.0);\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef VERTICALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector =vec3(0.0,1.0,0.0);\n    vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef RENDERMESH\n    vec3 size=computeMeshSize(_startSize,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n    if(u_startSize3D){\n     vec3 rotation=vec3(_startRotation.xy,-computeRotation(_startRotation.z, age,t));\n     center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,rotation),worldRotation);\n    }\n    else{\n     #ifdef ROTATIONOVERLIFETIME\n      float angle=computeRotation(_startRotation.x, age,t);\n      if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n       center+= (rotation_quaternions(rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),angle),worldRotation));//已验证\n      }\n      else{\n       #ifdef SHAPE\n        center+= u_sizeScale.xzy*(rotation_quaternions(rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),angle),worldRotation));\n       #else\n        if(u_simulationSpace==1)\n         center+=rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),angle);\n        else if(u_simulationSpace==0)\n         center+=rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),angle),worldRotation);\n       #endif\n      }\n     #endif\n     #ifdef ROTATIONSEPERATE\n      vec3 angle=compute3DRotation(vec3(0.0,0.0,_startRotation.z), age,t);\n      center+= (rotation_quaternions(rotation_euler(u_sizeScale*_glesVertex*size,vec3(angle.x,angle.y,angle.z)),worldRotation));\n     #endif \n    }\n  #else\n  if(u_startSize3D){\n   center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,_startRotation),worldRotation);\n  }\n  else{\n   if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n    if(u_simulationSpace==1)\n     center+= rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x);\n    else if(u_simulationSpace==0)\n     center+= (rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x),worldRotation));\n   }\n   else{\n    #ifdef SHAPE\n     if(u_simulationSpace==1)\n      center+= u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x),worldRotation); \n    #else\n     if(u_simulationSpace==1)\n      center+= rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x),worldRotation);\n    #endif\n   }\n  }\n  #endif\n  v_mesh_color=_glesColor;\n  #endif";
    const particle_common = "\n\nuniform float u_currentTime;\nuniform vec3 u_gravity;\n\nuniform vec3 u_worldPosition;\nuniform vec4 u_worldRotation;\nuniform bool u_startSize3D;\nuniform int u_scalingMode;\nuniform vec3 u_positionScale;\nuniform vec3 u_sizeScale;\nuniform mat4 glstate_matrix_vp;\n\n#ifdef STRETCHEDBILLBOARD\n uniform vec3 glstate_cameraPos;\n#endif\nuniform vec3 glstate_cameraForward;\nuniform vec3 glstate_cameraUp;\n\nuniform float u_lengthScale;\nuniform float u_speeaScale;\nuniform int u_simulationSpace;\n\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  uniform int u_spaceType;\n#endif\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYTWOCONSTANT)\n  uniform vec3 u_velocityConst;\n#endif\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)\n  uniform vec2 u_velocityCurveX[4];\n  uniform vec2 u_velocityCurveY[4];\n  uniform vec2 u_velocityCurveZ[4];\n#endif\n#ifdef VELOCITYTWOCONSTANT\n  uniform vec3 u_velocityConstMax;\n#endif\n#ifdef VELOCITYTWOCURVE\n  uniform vec2 u_velocityCurveMaxX[4];\n  uniform vec2 u_velocityCurveMaxY[4];\n  uniform vec2 u_velocityCurveMaxZ[4];\n#endif\n\n#ifdef COLOROGRADIENT\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n#endif\n#ifdef COLORTWOGRADIENTS\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n  uniform vec4 u_colorGradientMax[4];\n  uniform vec2 u_alphaGradientMax[4];\n#endif\n\n#if defined(SIZECURVE)||defined(SIZETWOCURVES)\n  uniform vec2 u_sizeCurve[4];\n#endif\n#ifdef SIZETWOCURVES\n  uniform vec2 u_sizeCurveMax[4];\n#endif\n#if defined(SIZECURVESEPERATE)||defined(SIZETWOCURVESSEPERATE)\n  uniform vec2 u_sizeCurveX[4];\n  uniform vec2 u_sizeCurveY[4];\n  uniform vec2 u_sizeCurveZ[4];\n#endif\n#ifdef SIZETWOCURVESSEPERATE\n  uniform vec2 u_sizeCurveMaxX[4];\n  uniform vec2 u_sizeCurveMaxY[4];\n  uniform vec2 u_sizeCurveMaxZ[4];\n#endif\n\n#ifdef ROTATIONOVERLIFETIME\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform float u_rotationConst;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform float u_rotationConstMax;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurve[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMax[4];\n  #endif\n#endif\n#ifdef ROTATIONSEPERATE\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform vec3 u_rotationConstSeprarate;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform vec3 u_rotationConstMaxSeprarate;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurveX[4];\n    uniform vec2 u_rotationCurveY[4];\n    uniform vec2 u_rotationCurveZ[4];\n  uniform vec2 u_rotationCurveW[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMaxX[4];\n    uniform vec2 u_rotationCurveMaxY[4];\n    uniform vec2 u_rotationCurveMaxZ[4];\n  uniform vec2 u_rotationCurveMaxW[4];\n  #endif\n#endif\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\n  uniform float u_cycles;\n  uniform vec2 u_subUVSize;\n  uniform vec2 u_uvCurve[4];\n#endif\n#ifdef TEXTURESHEETANIMATIONTWOCURVE\n  uniform vec2 u_uvCurveMax[4];\n#endif\n\nvarying float v_discard;\nvarying vec4 v_color;\n#ifdef DIFFUSEMAP\n varying vec2 v_texcoord;\n#endif\n#ifdef RENDERMESH\n varying vec4 v_mesh_color;\n#endif\n\nvec3 rotation_euler(in vec3 vector,in vec3 euler)\n{\n  float halfPitch = euler.x * 0.5;\n float halfYaw = euler.y * 0.5;\n float halfRoll = euler.z * 0.5;\n\n float sinPitch = sin(halfPitch);\n float cosPitch = cos(halfPitch);\n float sinYaw = sin(halfYaw);\n float cosYaw = cos(halfYaw);\n float sinRoll = sin(halfRoll);\n float cosRoll = cos(halfRoll);\n\n float quaX = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);\n float quaY = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);\n float quaZ = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);\n float quaW = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n \n}\n\nvec3 rotation_axis(in vec3 vector,in vec3 axis, in float angle)\n{\n float halfAngle = angle * 0.5;\n float sin = sin(halfAngle);\n \n float quaX = axis.x * sin;\n float quaY = axis.y * sin;\n float quaZ = axis.z * sin;\n float quaW = cos(halfAngle);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n}\n\nvec3 rotation_quaternions(in vec3 v,in vec4 q) \n{\n return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(SIZECURVE)||defined(SIZECURVESEPERATE)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)\nfloat evaluate_curve_float(in vec2 curves[4],in float t)\n{\n float res;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  if(curTime>=t)\n  {\n   vec2 lastCurve=curves[i-1];\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res=mix(lastCurve.y,curve.y,tt);\n   break;\n  }\n }\n return res;\n}\n#endif\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\nfloat evaluate_curve_total(in vec2 curves[4],in float t)\n{\n float res=0.0;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  vec2 lastCurve=curves[i-1];\n  float lastValue=lastCurve.y;\n  \n  if(curTime>=t){\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res+=(lastValue+mix(lastValue,curve.y,tt))/2.0*_time.x*(t-lastTime);\n   break;\n  }\n  else{\n   res+=(lastValue+curve.y)/2.0*_time.x*(curTime-lastCurve.x);\n  }\n }\n return res;\n}\n#endif\n\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)\nvec4 evaluate_curve_color(in vec2 gradientAlphas[4],in vec4 gradientColors[4],in float t)\n{\n vec4 overTimeColor;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientAlpha=gradientAlphas[i];\n  float alphaKey=gradientAlpha.x;\n  if(alphaKey>=t)\n  {\n   vec2 lastGradientAlpha=gradientAlphas[i-1];\n   float lastAlphaKey=lastGradientAlpha.x;\n   float age=(t-lastAlphaKey)/(alphaKey-lastAlphaKey);\n   overTimeColor.a=mix(lastGradientAlpha.y,gradientAlpha.y,age);\n   break;\n  }\n }\n \n for(int i=1;i<4;i++)\n {\n  vec4 gradientColor=gradientColors[i];\n  float colorKey=gradientColor.x;\n  if(colorKey>=t)\n  {\n   vec4 lastGradientColor=gradientColors[i-1];\n   float lastColorKey=lastGradientColor.x;\n   float age=(t-lastColorKey)/(colorKey-lastColorKey);\n   overTimeColor.rgb=mix(gradientColors[i-1].yzw,gradientColor.yzw,age);\n   break;\n  }\n }\n return overTimeColor;\n}\n#endif\n\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\nfloat evaluate_curve_frame(in vec2 gradientFrames[4],in float t)\n{\n float overTimeFrame;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientFrame=gradientFrames[i];\n  float key=gradientFrame.x;\n  if(key>=t)\n  {\n   vec2 lastGradientFrame=gradientFrames[i-1];\n   float lastKey=lastGradientFrame.x;\n   float age=(t-lastKey)/(key-lastKey);\n   overTimeFrame=mix(lastGradientFrame.y,gradientFrame.y,age);\n   break;\n  }\n }\n return floor(overTimeFrame);\n}\n#endif\n\nvec3 computeVelocity(in float t)\n{\n  vec3 res;\n  #ifdef VELOCITYCONSTANT\n  res=u_velocityConst; \n  #endif\n  #ifdef VELOCITYCURVE\n     res= vec3(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveZ,t));\n  #endif\n  #ifdef VELOCITYTWOCONSTANT\n  res=mix(u_velocityConst,u_velocityConstMax,vec3(_random1.y,_random1.z,_random1.w)); \n  #endif\n  #ifdef VELOCITYTWOCURVE\n     res=vec3(mix(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveMaxX,t),_random1.y),\n             mix(evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveMaxY,t),_random1.z),\n        mix(evaluate_curve_float(u_velocityCurveZ,t),evaluate_curve_float(u_velocityCurveMaxZ,t),_random1.w));\n  #endif\n     \n  return res;\n} \n\nvec3 computePosition(in vec3 startVelocity, in vec3 lifeVelocity,in float age,in float t,vec3 gravityVelocity,vec4 worldRotation)\n{\n    vec3 startPosition;\n    vec3 lifePosition;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n   #ifdef VELOCITYCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveZ,t));\n   #endif\n   #ifdef VELOCITYTWOCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYTWOCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(mix(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveMaxX,t),_random1.y)\n                 ,mix(evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveMaxY,t),_random1.z)\n                 ,mix(evaluate_curve_total(u_velocityCurveZ,t),evaluate_curve_total(u_velocityCurveMaxZ,t),_random1.w));\n   #endif\n\n   vec3 finalPosition;\n   if(u_spaceType==0){\n     if(u_scalingMode!=2)\n      finalPosition =rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition+lifePosition),worldRotation);\n     else\n      finalPosition =rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition+lifePosition,worldRotation);\n   }\n   else{\n     if(u_scalingMode!=2)\n       finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation)+lifePosition;\n     else\n       finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation)+lifePosition;\n   }\n    #else\n    startPosition=startVelocity*age;\n    vec3 finalPosition;\n    if(u_scalingMode!=2)\n      finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation);\n    else\n      finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation);\n  #endif\n  \n  if(u_simulationSpace==1)\n    finalPosition=finalPosition+_startWorldPosition;\n  else if(u_simulationSpace==0) \n    finalPosition=finalPosition+u_worldPosition;\n  \n  finalPosition+=0.5*gravityVelocity*age;\n \n  return finalPosition;\n}\n\n\nvec4 computeColor(in vec4 color,in float t)\n{\n #ifdef COLOROGRADIENT\n   color*=evaluate_curve_color(u_alphaGradient,u_colorGradient,t);\n #endif \n #ifdef COLORTWOGRADIENTS\n   color*=mix(evaluate_curve_color(u_alphaGradient,u_colorGradient,t),evaluate_curve_color(u_alphaGradientMax,u_colorGradientMax,t),_random0.y);\n #endif\n\n  return color;\n}\n\nvec2 computeBillbardSize(in vec2 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec2(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec2(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z));\n #endif\n return size;\n}\n\n#ifdef RENDERMESH\nvec3 computeMeshSize(in vec3 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec3(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveZ,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec3(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z)\n       ,mix(evaluate_curve_float(u_sizeCurveZ,t),evaluate_curve_float(u_sizeCurveMaxZ,t),_random0.z));\n #endif\n return size;\n}\n#endif\n\nfloat computeRotation(in float rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConst*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurve,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n     rotation+=ageRot;\n   #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n  #endif\n #endif\n #ifdef ROTATIONSEPERATE\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConstSeprarate.z*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurveZ,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConstSeprarate.z,u_rotationConstMaxSeprarate.z,_random0.w)*age;\n         rotation+=ageRot;\n     #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n  #endif\n #endif\n return rotation;\n}\n\n#if defined(RENDERMESH)&&(defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE))\nvec3 compute3DRotation(in vec3 rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n   #ifdef ROTATIONCONSTANT\n     float ageRot=u_rotationConst*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONCURVE\n     rotation+=evaluate_curve_total(u_rotationCurve,t);\n   #endif\n   #ifdef ROTATIONTWOCONSTANTS\n     float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONTWOCURVES\n     rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n   #endif\n #endif\n #ifdef ROTATIONSEPERATE\n    #ifdef ROTATIONCONSTANT\n     vec3 ageRot=u_rotationConstSeprarate*age;\n           rotation+=ageRot;\n    #endif\n    #ifdef ROTATIONCURVE\n     rotation+=vec3(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveZ,t));\n    #endif\n    #ifdef ROTATIONTWOCONSTANTS\n     vec3 ageRot=mix(u_rotationConstSeprarate,u_rotationConstMaxSeprarate,_random0.w)*age;\n           rotation+=ageRot;\n     #endif\n    #ifdef ROTATIONTWOCURVES\n     rotation+=vec3(mix(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveMaxX,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveMaxY,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n    #endif\n #endif\n return rotation;\n}\n#endif\n\nvec2 computeUV(in vec2 uv,in float t)\n{ \n #ifdef TEXTURESHEETANIMATIONCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n  float frame=evaluate_curve_frame(u_uvCurve,uvNormalizedAge);\n  float totalULength=frame*u_subUVSize.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUVSize.y;\n    #endif\n #ifdef TEXTURESHEETANIMATIONTWOCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n   float frame=floor(mix(evaluate_curve_frame(u_uvCurve,uvNormalizedAge),evaluate_curve_frame(u_uvCurveMax,uvNormalizedAge),_random1.x));\n  float totalULength=frame*u_subUVSize.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUVSize.y;\n    #endif\n return uv;\n}";
    const shadowMap_frag = "#ifdef USE_SHADOW\n    // outColor *= getShadowMask();\n#endif";
    const shadowMap_pars_frag = "#ifdef USE_SHADOW\n\n    #include <packing>\n\n    #ifdef USE_DIRECT_LIGHT\n\n        uniform sampler2D glstate_directionalShadowMap[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        uniform samplerCube glstate_pointShadowMap[ USE_POINT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        uniform sampler2D glstate_spotShadowMap[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n\n    #endif\n\n    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n    }\n\n    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\n\n        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\n\n    }\n\n    float getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        shadowCoord.xyz /= shadowCoord.w;\n\n        float depth = shadowCoord.z + shadowBias;\n\n        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n        bool inFrustum = all( inFrustumVec );\n\n        bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );\n\n        bool frustumTest = all( frustumTestVec );\n\n        if ( frustumTest ) {\n            #ifdef USE_PCF_SOFT_SHADOW\n                // TODO x, y not equal\n                float texelSize = shadowRadius / shadowMapSize.x;\n\n                vec2 poissonDisk[4];\n                poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n                poissonDisk[1] = vec2(0.94558609, -0.76890725);\n                poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n                poissonDisk[3] = vec2(0.34495938, 0.29387760);\n\n                return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;\n            #else\n                return texture2DCompare( shadowMap, shadowCoord.xy, depth );\n            #endif\n        }\n\n        return 1.0;\n\n    }\n\n    float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {\n\n        // depth = normalized distance from light to fragment position\n  float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?\n  depth += shadowBias;\n\n        V.x = -V.x; // for left-hand?\n\n        #ifdef USE_PCF_SOFT_SHADOW\n            // TODO x, y equal force\n            float texelSize = shadowRadius / shadowMapSize.x;\n\n            vec3 poissonDisk[4];\n      poissonDisk[0] = vec3(-1.0, 1.0, -1.0);\n      poissonDisk[1] = vec3(1.0, -1.0, -1.0);\n      poissonDisk[2] = vec3(-1.0, -1.0, -1.0);\n      poissonDisk[3] = vec3(1.0, -1.0, 1.0);\n\n            return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\n        #else\n            return textureCubeCompare( shadowMap, normalize(V), depth);\n        #endif\n    }\n\n#endif";
    const shadowMap_pars_vert = "#ifdef USE_SHADOW\n\n    #ifdef USE_DIRECT_LIGHT\n\n        uniform mat4 glstate_directionalShadowMatrix[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        // nothing\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        uniform mat4 glstate_spotShadowMatrix[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n\n    #endif\n\n#endif";
    const shadowMap_vert = "#ifdef USE_SHADOW\n\n    vec4 worldPosition = glstate_matrix_model * tmpvar_1;\n\n    #ifdef USE_DIRECT_LIGHT\n\n        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {\n\n            vDirectionalShadowCoord[ i ] = glstate_directionalShadowMatrix[ i ] * worldPosition;\n\n        }\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        // nothing\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {\n\n            vSpotShadowCoord[ i ] = glstate_spotShadowMatrix[ i ] * worldPosition;\n\n        }\n\n    #endif\n\n#endif";
    const tbn = "mat3 tbn(vec3 N, vec3 p, vec2 uv) {\n    vec3 dp1 = dFdx(p.xyz);\n    vec3 dp2 = dFdy(p.xyz);\n    vec2 duv1 = dFdx(uv.st);\n    vec2 duv2 = dFdy(uv.st);\n    vec3 dp2perp = cross(dp2, N);\n    vec3 dp1perp = cross(N, dp1);\n    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));\n    return mat3(T * invmax, B * invmax, N);\n}";
    const transpose = "mat4 transpose(mat4 inMatrix) {\n    vec4 i0 = inMatrix[0];\n    vec4 i1 = inMatrix[1];\n    vec4 i2 = inMatrix[2];\n    vec4 i3 = inMatrix[3];\n    mat4 outMatrix = mat4(\n        vec4(i0.x, i1.x, i2.x, i3.x),\n        vec4(i0.y, i1.y, i2.y, i3.y),\n        vec4(i0.z, i1.z, i2.z, i3.z),\n        vec4(i0.w, i1.w, i2.w, i3.w)\n    );\n    return outMatrix;\n}";
    const tsn = "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\n\n    vec3 q0 = dFdx( V.xyz );\n    vec3 q1 = dFdy( V.xyz );\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    // vec3 N = normalize( N );\n\n    mat3 tsn = mat3( S, T, N );\n    return tsn;\n}";
}
declare namespace egret3d {
    class DefaultTextures {
        static WHITE: Texture;
        static GRAY: Texture;
        static GRID: Texture;
        static init(): void;
    }
}
declare namespace egret3d {
    /**
     * physics
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 物理类
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Physics {
        /**
         * get the nearest transform contect to the ray
         * @param ray ray
         * @param isPickMesh true pick mesh, false pick collider
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取射线拾取到的最近物体。
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh，否为拾取collider
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static Raycast(ray: Ray, isPickMesh?: boolean, maxDistance?: number, layerMask?: paper.Layer): PickInfo | null;
        /**
         * get all transforms contect to the ray
         * @param ray ray
         * @param isPickMesh true pick mesh, false pick collider
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取射线路径上的所有物体。
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh，否为拾取collider
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static RaycastAll(ray: Ray, isPickMesh?: boolean, maxDistance?: number, layerMask?: paper.Layer): PickInfo[] | null;
        private static _doPick(ray, maxDistance, layerMask, pickAll?, isPickMesh?);
        private static _pickMesh(ray, transform, pickInfos);
        private static _pickCollider(ray, transform, pickInfos);
    }
}
declare namespace egret3d {
    /**
     * scene pick up info
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 场景拣选信息
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class PickInfo {
        subMeshIndex: number;
        triangleIndex: number;
        distance: number;
        readonly position: Vector3;
        readonly textureCoordA: Vector2;
        readonly textureCoordB: Vector2;
        transform: Transform | null;
        collider: BaseCollider | null;
    }
}
declare namespace RES.processor {
    enum AssetTypeEnum {
        Unknown = 0,
        Auto = 1,
        Bundle = 2,
        CompressBundle = 3,
        GLVertexShader = 4,
        GLFragmentShader = 5,
        Shader = 6,
        Texture = 7,
        TextureDesc = 8,
        Material = 9,
        GLTF = 10,
        GLTFBinary = 11,
        Prefab = 12,
        Scene = 13,
        TextAsset = 14,
        Atlas = 15,
        Font = 16,
        PackBin = 17,
        PackTxt = 18,
        pathAsset = 19,
        PVR = 20,
        Sound = 21,
    }
    const BundleProcessor: RES.processor.Processor;
    const GLVertexShaderProcessor: RES.processor.Processor;
    const GLFragmentShaderProcessor: RES.processor.Processor;
    const ShaderProcessor: RES.processor.Processor;
    const TextureDescProcessor: RES.processor.Processor;
    const TextureProcessor: RES.processor.Processor;
    const MaterialProcessor: RES.processor.Processor;
    const GLTFProcessor: RES.processor.Processor;
    const AtlasProcessor: RES.processor.Processor;
    const PrefabProcessor: RES.processor.Processor;
    const SceneProcessor: RES.processor.Processor;
    const Font3DProcessor: RES.processor.Processor;
    const Sound3DProcessor: RES.processor.Processor;
    const TextAssetProcessor: RES.processor.Processor;
    const PathAssetProcessor: RES.processor.Processor;
}
declare namespace egret3d {
    class DefaultShaders {
        static TRANSPARENT: Shader;
        static TRANSPARENT_ADDITIVE: Shader;
        static TRANSPARENT_BOTH_SIDE: Shader;
        static TRANSPARENT_ADDITIVE_BOTH_SIDE: Shader;
        static DIFFUSE: Shader;
        static DIFFUSE_TINT_COLOR: Shader;
        static DIFFUSE_VERT_COLOR: Shader;
        static DIFFUSE_BOTH_SIDE: Shader;
        static UI: Shader;
        static UI_FONT: Shader;
        static LINE: Shader;
        static MATERIAL_COLOR: Shader;
        static LAMBERT: Shader;
        static LAMBERT_NORMAL: Shader;
        static GIZMOS_COLOR: Shader;
        static PARTICLE: Shader;
        static PARTICLE_ADDITIVE: Shader;
        static PARTICLE_ADDITIVE_PREMYLTIPLY: Shader;
        static PARTICLE_BLEND: Shader;
        static PARTICLE_BLEND_PREMYLTIPLY: Shader;
        private static _inited;
        static init(): void;
    }
}
declare namespace egret3d {
    class DefaultMeshes {
        static QUAD: Mesh;
        static QUAD_PARTICLE: Mesh;
        static PLANE: Mesh;
        static CIRCLE_LINE: Mesh;
        static CUBE: Mesh;
        static PYRAMID: Mesh;
        static CYLINDER: Mesh;
        static SPHERE: Mesh;
        private static _inited;
        static init(): void;
        private static _createDefaultMeshA(data);
        static genBoxByArray(array: egret3d.Vector3[]): Mesh;
        static createCylinderCCW(height: number, radius: number, segment?: number): Mesh;
        static createSphereCCW(radius?: number, widthSegments?: number, heightSegments?: number): Mesh;
    }
}
declare namespace egret3d {
    /**
     *
     * 正则表达式的工具类，提供一些引擎用到的正则表达式
     */
    class RegexpUtil {
        static textureRegexp: RegExp;
        static vectorRegexp: RegExp;
        static floatRegexp: RegExp;
        static rangeRegexp: RegExp;
        static vector4Regexp: RegExp;
        static vector3FloatOrRangeRegexp: RegExp;
    }
}
declare namespace egret3d.io {
    class BinReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        private _seek;
        seek(seek: number): void;
        peek(): number;
        length(): number;
        canread(): number;
        readStringAnsi(): string;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readUint8Array(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        readUint16Array(target?: Uint16Array, offset?: number, length?: number): Uint16Array;
        readSingleArray(target?: Float32Array, offset?: number, length?: number): Float32Array;
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readUTFBytes(length: number): string;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class BinWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData(addlen);
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        readonly length: number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace egret3d.utils {
    /**
     * Get path by url
     * @param content text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 获取RUL的PATH。
     * @param content 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function getPathByUrl(url: string): string;
    function combinePath(base: string, relative: string): string;
    function getRelativePath(targetPath: string, sourcePath: string): string;
    /**
     * first char to lower case
     * @param str source string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 将一个字符串中的第一个字符转为小写
     * @param str 要处理的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function firstCharToLowerCase(str: string): string;
    /**
     * replace all
     * @param srcStr source string
     * @param fromStr from string
     * @param toStr to string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 将一个字符串中的所有指定字符替换为指定字符
     * @param srcStr 要处理的字符串
     * @param fromStr 原字符串中的指定字符串
     * @param toStr 将被替换为的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function replaceAll(srcStr: string, fromStr: string, toStr: string): string;
    /**
     * remove all space
     * @param str source string
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 剔除掉字符串中所有的空格
     * @param str 要处理的字符串
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function trimAll(str: string): string;
    /**
     * Convert string to blob
     * @param content text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * string转换为blob。
     * @param content 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function stringToBlob(content: string): Blob;
    /**
     * Convert string to utf8 array
     * @param str text
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * string转换为utf8数组。
     * @param str 文本
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    function stringToUtf8Array(str: string): number[];
    function caclStringByteLength(value: string): number;
    function getKeyCodeByAscii(ev: KeyboardEvent): number;
}
declare namespace egret3d.sound {
    /**
     * web audio
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 基于 Web Audio 网络音频模块（单例）
     * @version paper 1.0
     * @platform Web
     * @language
     */
    class WebAudio {
        private static _instance;
        /**
         * web audio instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 基于 Web Audio 网络音频模块单例
         * @version paper 1.0
         * @platform Web
         * @language
         */
        static readonly instance: WebAudio;
        private _audioContext;
        /**
         *
         */
        readonly audioContext: AudioContext;
        private constructor();
        /**
         * is support web audio
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前运行环境是否支持 Web Audio
         * @version paper 1.0
         * @platform Web
         * @language
         */
        readonly isSupported: boolean;
        /**
         * active
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 某些平台中（IOS），需要在用户输入事件监听中调用此方法，音频才能正常播放
         * @version paper 1.0
         * @platform Web
         * @language
         */
        active(): void;
        /**
         *
         */
        decodeAudioData(buffer: ArrayBuffer, onSuccess: (buf: AudioBuffer) => void, onError: () => void): void;
        private audioListener;
        getAudioListener(): WebAudioListener;
    }
}
declare namespace Stats {
    /**
     * 显示调试面板
     */
    function show(container: HTMLDivElement, refreshTime?: number): void;
    /**
     * 关闭调试面板
     */
    function hide(): void;
}
declare namespace egret3d.sound {
    /**
     *
     */
    class WebAudioChannel3D extends WebAudioChannel2D {
        private panner;
        protected _init(): void;
        maxDistance: number;
        minDistance: number;
        rollOffFactor: number;
        distanceModel: string;
        private position;
        setPosition(x: number, y: number, z: number): void;
        getPosition(): Vector3;
        private velocity;
        setVelocity(x: number, y: number, z: number): void;
        getVelocity(): Vector3;
    }
}
declare namespace egret3d.sound {
    class WebAudioListener {
        private readonly listener;
        private position;
        private velocity;
        private orientation;
        constructor();
        setPosition(x: number, y: number, z: number): void;
        getPosition(): Vector3;
        setVelocity(x: number, y: number, z: number): void;
        getVelocity(): Vector3;
        setOrientation(orientation: Matrix): void;
        getOrientation(): Matrix;
    }
}
declare namespace egret3d {
    /**
     * device input manager
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 用户输入设备管理器
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class InputManager {
        /**
         * keyboard input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 键盘输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static keyboard: KeyboardDevice;
        /**
         * mouse input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 鼠标输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static mouse: MouseDevice;
        /**
         * touch input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 鼠标输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static touch: TouchDevice;
        private static _isInit;
        /**
         *
         */
        static init(canvas: any): void;
        /**
         *
         */
        static update(deltaTime: number): void;
        /**
         * is pressed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否正在被点击或者触摸
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static isPressed(): boolean;
        /**
         * was pressed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否完成一次点击或触摸
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static wasPressed(): boolean;
        /**
         * was released
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否完成一次鼠标或触摸释放。
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static wasReleased(): boolean;
        private static _touchPoint;
        /**
         * get touch point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取点击或触摸位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        static getTouchPoint(): Vector2;
    }
}
declare namespace egret3d {
    /**
     * keyboard input
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 键盘输入
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class KeyboardDevice {
        private _element;
        private preventDefault;
        private stopPropagation;
        private _keymap;
        private _lastmap;
        private _keyDownHandler;
        private _keyUpHandler;
        private _keyPressHandler;
        /**
         *
         */
        constructor(element: HTMLElement | Window, options?: {
            preventDefault: boolean;
            stopPropagation: boolean;
        });
        private attach(element);
        private detach();
        private _handleKeyDown(event);
        private _handleKeyPress(event);
        private _handleKeyUp(event);
        private _cacheKeyCodeMap;
        private _toKeyIdentifier(keyCode);
        /**
         *
         */
        update(): void;
        /**
         * is pressed
         * @param key key code or char string
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键是否在按下状态
         * @param key 按键，可以为健值或者字符。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        isPressed(key: number | string): boolean;
        /**
         * was pressed
         * @param key key code or char string
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被按下一次
         * @param key 按键，可以为健值或者字符。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        wasPressed(key: number | string): boolean;
        /**
         * was released
         * @param key key code or char string
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被抬起一次
         * @param key 按键，可以为健值或者字符。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        wasReleased(key: number | string): boolean;
    }
}
declare namespace egret3d {
    /**
     * mouse input
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 鼠标输入
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class MouseDevice extends EventDispatcher {
        private _offsetX;
        private _offsetY;
        private _scaler;
        /**
         *
         */
        updateOffsetAndScale(offsetX: number, offsetY: number, scaler: number): void;
        /**
         *
         */
        convertPosition(e: MouseEvent, out: Vector2): void;
        /**
         * mouse position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前鼠标位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        position: Vector2;
        /**
         * mouse wheel value
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前鼠标滚轮值
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        wheel: number;
        private _buttons;
        private _lastbuttons;
        private _element;
        private _upHandler;
        private _moveHandler;
        private _downHandler;
        private _wheelHandler;
        private _contextMenuHandler;
        /**
         *
         */
        constructor(element: HTMLElement);
        /**
         * disable right key menu
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 禁用右键菜单
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        disableContextMenu(): void;
        /**
         * enable right key menu
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 启用右键菜单
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        enableContextMenu(): void;
        private attach(element);
        private detach();
        /**
         *
         */
        update(): void;
        /**
         * is pressed
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键是否在按下状态
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        isPressed(button: number): boolean;
        /**
         * was pressed
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被按下一次
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        wasPressed(button: number): boolean;
        /**
         * was released
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被抬起一次
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        wasReleased(button: number): boolean;
        private _handleUp(event);
        private _handleMove(event);
        private _handleDown(event);
        private _handleWheel(event);
    }
}
declare namespace egret3d {
    /**
     * touch phase type
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸状态
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    enum TouchPhase {
        /**
         * touch began
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸开始
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        BEGAN = 0,
        /**
         * touch moved
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸移动
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        MOVED = 1,
        /**
         * touch stationary
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸静止
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        STATIONARY = 2,
        /**
         * touch ended
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸结束
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        ENDED = 3,
        /**
         * touch canceled
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸取消
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        CANCELED = 4,
    }
    /**
     * touch point
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸点信息
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class TouchPoint {
        altitudeAngle: number;
        azimuthAngle: number;
        deltaPosition: Vector2;
        fingerId: number;
        maximumPossiblePressure: number;
        phase: TouchPhase;
        position: Vector2;
        pressure: number;
        radius: Vector2;
        type: string;
        /**
         *
         */
        set(touch: any, phase: TouchPhase, device: TouchDevice): void;
        private static _pointPool;
        /**
         *
         */
        static create(): TouchPoint;
        /**
         *
         */
        static release(touchPoint: TouchPoint): void;
    }
    /**
     * touch input
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸输入
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class TouchDevice extends EventDispatcher {
        private _offsetX;
        private _offsetY;
        private _scaler;
        /**
         *
         */
        updateOffsetAndScale(offsetX: number, offsetY: number, scaler: number): void;
        /**
         *
         */
        convertPosition(e: Touch, out: Vector2): void;
        private _touchesMap;
        private _touches;
        /**
         * touch count
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前触摸点的数量
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        touchCount: number;
        private _startHandler;
        private _endHandler;
        private _moveHandler;
        private _cancelHandler;
        private _element;
        private preventDefault;
        private stopPropagation;
        /**
         *
         */
        constructor(element: HTMLElement, options?: {
            preventDefault: boolean;
            stopPropagation: boolean;
        });
        private attach(element);
        private detach();
        /**
         *
         */
        update(): void;
        /**
         * get touch point
         * @param index touch index
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取触摸点
         * @param index 触摸点的索引
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        getTouch(index: number): TouchPoint;
        private _getTouch(identifier);
        private _handleTouchStart(event);
        private _handleTouchEnd(event);
        private _handleTouchMove(event);
        private _handleTouchCancel(event);
    }
}
declare namespace paper {
    /**
     * 销毁系统
     *
     */
    class DestroySystem extends BaseSystem<BaseComponent> {
        private readonly _bufferedComponents;
        private readonly _bufferedGameObjects;
        /**
         * @inheritDoc
         */
        update(): void;
        /**
         * 将实体缓存到销毁系统，以便在系统运行时销毁。
         *
         */
        bufferComponent(component: BaseComponent): void;
        /**
         * 将实体缓存到销毁系统，以便在系统运行时销毁。
         *
         */
        bufferGameObject(gameObject: GameObject): void;
    }
}
declare namespace egret3d {
    class WebGLKit {
        private static _maxVertexAttribArray;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number): void;
        private static _usedTextureUnits;
        static allocTexUnit(): number;
        static resetTexUnit(): void;
        private static _texNumber;
        private static _activeTextureIndex;
        static activeTexture(index: number): void;
        private static _showFace;
        private static _frontFaceCW;
        static showFace(value: ShowFaceStateEnum, frontFaceCW?: boolean): void;
        private static _zWrite;
        static zWrite(value: boolean): void;
        private static _zTest;
        static zTest(value: boolean): void;
        private static _zTestMethod;
        static zTestMethod(value: number): void;
        private static _blend;
        static blend(value: boolean, equation: number, srcRGB: number, destRGB: number, srcAlpha: number, destAlpha: number): void;
        private static _program;
        static useProgram(program: WebGLProgram): boolean;
        static drawArrayTris(start: number, count: number): void;
        static drawArrayLines(start: number, count: number): void;
        static drawElementTris(start: number, count: number): void;
        static drawElementLines(start: number, count: number): void;
        static setStates(drawPass: DrawPass, frontFaceCW?: boolean): void;
        static draw(context: RenderContext, material: Material, mesh: Mesh, subMeshIndex: number, basetype?: string, frontFaceCW?: boolean): void;
        static resetState(): void;
        static webgl: WebGLRenderingContext;
        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static capabilities: WebGLCapabilities;
        static init(canvas: HTMLCanvasElement, options: RequiredRuntimeOptions): void;
    }
}
declare namespace egret3d {
    const MAX_VERTEX_COUNT_PER_BUFFER: number;
    /**
     * 尝试对场景内所有静态对象合并
     */
    function autoCombine(): void;
    /**
     * 尝试合并静态对象列表。
     * @param instances
     * @param root
     */
    function combine(instances: Readonly<paper.GameObject[]>): void;
}
declare namespace egret3d {
    /**
     *
     */
    const enum PerformanceType {
        All = "all",
    }
    type PerformanceEntity = {
        start: number;
        end: number;
        delta: number;
        _cache: number[];
        averageRange: number;
        averageDelta: number;
    };
    /**
     * Performance
     * 数据收集
     */
    class Performance {
        private static _entities;
        static enable: boolean;
        static getEntity(key: string): PerformanceEntity;
        static getFPS(): number;
        static updateFPS(): void;
        private static _getNow();
        static startCounter(key: string, averageRange?: number): void;
        static endCounter(key: string): void;
    }
}
declare namespace egret3d {
    /**
     *
     * WebGLProgram的包装类，可以批量上传数据并具有标脏功能
     */
    class GlProgram {
        private static _programMap;
        static get(pass: DrawPass, context: RenderContext, material: Material): GlProgram;
        private gl;
        program: WebGLProgram;
        private _attributes;
        private _uniforms;
        private _unifromsValue;
        private _cacheContext;
        private _cacheContextVer;
        private _cacheMesh;
        private _cacheMeshVer;
        private _cacheMeshEbo;
        private _cacheMaterial;
        private _cacheMaterialVer;
        private constructor();
        private _samplerUnitMap;
        private _allocTexUnits();
        bindAttributes(mesh: Mesh, subMeshIndex?: number, forceUpdate?: boolean): void;
        private _updateRenderContextUniforms(context);
        private setInt(key, value);
        private setFloat(key, value);
        private setFloatv(key, value);
        private setMatrix4(key, value);
        private setMatrix4v(key, value);
        private setVector2(key, value);
        private setVector2v(key, value);
        private setVector3v(key, value);
        private setVector3(key, value);
        private setVector4v(key, value);
        private setVector4_2(key, value);
        private setVector4(key, value);
        private setTexture(key, value);
        private setWebGLTexture(key, value);
        private _updateUniforms(unifroms);
        private _cacheTextureUniforms;
        uploadUniforms(material: Material, context: RenderContext, forceUpdate?: boolean): void;
    }
}
declare namespace egret3d {
    const enum TextureFormatEnum {
        RGBA = 1,
        RGB = 2,
        Gray = 3,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
    }
    class TextureReader {
        readonly gray: boolean;
        readonly width: number;
        readonly height: number;
        readonly data: Uint8Array;
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        getPixel(u: number, v: number): any;
    }
    interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGLRenderingContext): any;
        caclByteLength(): number;
    }
    interface IRenderTarget extends ITexture {
        use(webgl: WebGLRenderingContext): any;
    }
    class GlRenderTarget implements IRenderTarget {
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth?: boolean, stencil?: boolean);
        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;
        use(webgl: WebGLRenderingContext): void;
        static useNull(webgl: WebGLRenderingContext): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        isFrameBuffer(): boolean;
    }
    class GlRenderTargetCube implements IRenderTarget {
        width: number;
        height: number;
        activeCubeFace: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth?: boolean, stencil?: boolean);
        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;
        use(webgl: WebGLRenderingContext): void;
        static useNull(webgl: WebGLRenderingContext): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        isFrameBuffer(): boolean;
    }
    /**
     *
     */
    class GlTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format?: TextureFormatEnum, mipmap?: boolean, linear?: boolean);
        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        webgl: WebGLRenderingContext;
        loaded: boolean;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number;
        height: number;
        mipmap: boolean;
        caclByteLength(): number;
        reader: TextureReader;
        getReader(redOnly?: boolean): TextureReader;
        dispose(webgl: WebGLRenderingContext): void;
        isFrameBuffer(): boolean;
        static createColorTexture(webgl: WebGLRenderingContext, r: number, g: number, b: number): GlTexture2D;
        static createGridTexture(webgl: WebGLRenderingContext): GlTexture2D;
    }
    class WriteableTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format: TextureFormatEnum, width: number, height: number, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean);
        linear: boolean;
        premultiply: boolean;
        repeat: boolean;
        mirroredU: boolean;
        mirroredV: boolean;
        updateRect(data: Uint8Array, x: number, y: number, width: number, height: number): void;
        updateRectImg(data: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, x: number, y: number): void;
        isFrameBuffer(): boolean;
        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        formatGL: number;
        width: number;
        height: number;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
    }
}
declare namespace egret3d {
    enum WEBGL_ATTRIBUTE_TYPE {
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        FLOAT = 5126,
        BYTE = 65535,
        UNSIGNED_BYTE = 5121,
        UNSIGNED_SHORT = 5123,
    }
    class WebGLAttribute {
        gl: WebGLRenderingContext;
        name: string;
        type: WEBGL_ATTRIBUTE_TYPE;
        size: number;
        location: number;
        count: number;
        format: number;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, attributeData: WebGLActiveInfo);
        private _initCount(type);
        private _initFormat(gl, type);
    }
}
declare namespace paper.editor {
    /**
     * 场景编辑器
     **/
    class Editor {
        static readonly editorModel: EditorModel;
        private static _editorModel;
        /**初始化 */
        static init(): Promise<void>;
        private static runEgret();
    }
}
declare namespace paper {
    /**
     * 序列化方法
     * 只有 ISerializable (有对应hashCode属性) 参与序列化
     * 只有被标记的对象属性 参与序列化
     * 序列化后，输出 ISerializeData
     * 对象在objects中按生成顺序，root一定是第一个元素。
     * 允许依赖标记对序列化对象数据分类，以便单独处理一些对象（例如资源等等，但资源的路径这里不做处理，在方法外由开发者自行处理）
     */
    function serialize(source: SerializableObject, sourcePath?: string): ISerializedData;
    /**
     *
     */
    function serializeAsset(source: paper.Asset): any;
    /**
     *
     */
    function serializeRC(source: SerializableObject): any;
    /**
     *
     */
    function serializeR(source: SerializableObject): any;
    /**
     *
     */
    function serializeC(source: SerializableObject): any;
    /**
     *
     */
    function getTypesFromPrototype(classPrototype: any, typeKey: string, types?: string[] | null): string[];
}
declare namespace paper {
    /**
     * renderer component interface
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 渲染器组件接口
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    interface IRenderer extends paper.BaseComponent {
    }
}
declare namespace paper.editor {
    const context: EventDispatcher;
    /**
     * 编辑模型事件
     */
    class EditorModelEvent extends BaseEvent {
        static ADD_GAMEOBJECTS: string;
        static DELETE_GAMEOBJECTS: string;
        static SELECT_GAMEOBJECTS: string;
        static CHANGE_PROPERTY: string;
        static CHANGE_EDIT_MODE: string;
        static CHANGE_EDIT_TYPE: string;
        static CHANGE_SCENE: string;
        static ADD_COMPONENT: string;
        static REMOVE_COMPONENT: string;
        static UPDATE_PARENT: string;
        constructor(type: string, data?: any);
    }
    enum ModifyObjectType {
        GAMEOBJECT = 0,
        BASECOMPONENT = 1,
    }
    class CmdType {
        /**更改游戏对象基础属性 */
        static MODIFY_OBJECT_PROPERTY: string;
        /**修改transform属性 */
        static MODIFY_COMPONENT_PROPERTY: string;
        /**选中游戏对象 */
        static SELECT_GAMEOBJECT: string;
        /**添加游戏对象 */
        static ADD_GAMEOBJECT: string;
        /**移除游戏对象 */
        static REMOVE_GAMEOBJECTS: string;
        /**克隆游戏对象 */
        static DUPLICATE_GAMEOBJECTS: string;
        /**粘贴游戏对象 */
        static PASTE_GAMEOBJECTS: string;
        /**添加组件 */
        static ADD_COMPONENT: string;
        /**移除组件 */
        static REMOVE_COMPONENT: string;
        /**更改parent */
        static UPDATE_PARENT: string;
        /**修改预制体游戏对象属性 */
        static MODIFY_PREFAB_GAMEOBJECT_PROPERTY: string;
        /**修改预制体组件属性 */
        static MODIFY_PREFAB_COMPONENT_PROPERTY: string;
        /**添加组件 */
        static ADD_PREFAB_COMPONENT: string;
        /**移除组件 */
        static REMOVE_PREFAB_COMPONENT: string;
        /**修改asset属性 */
        static MODIFY_ASSET_PROPERTY: string;
    }
    /**
     * 编辑模型
     */
    class EditorModel extends EventDispatcher {
        /**
         * 初始化
         */
        init(): Promise<void>;
        paperHistory: History;
        initHistory(): void;
        addState(state: BaseState): void;
        setProperty(propName: string, propValue: any, target: BaseComponent | GameObject): boolean;
        getEditType(propName: string, target: any): editor.EditType | null;
        createModifyGameObjectPropertyState(propName: string, propValue: any, target: GameObject, editType: editor.EditType, add?: boolean): ModifyGameObjectPropertyState;
        createModifyComponent(propName: string, propValue: any, target: BaseComponent, editType: editor.EditType, add?: boolean): any;
        createModifyPrefabGameObjectPropertyState(gameObjectId: number, newValueList: any[], preValueCopylist: any[], backRuntime: any): void;
        createModifyPrefabComponentPropertyState(gameObjectId: number, componentId: number, newValueList: any[], preValueCopylist: any[], backRuntime: any): void;
        createRemoveComponentFromPrefab(stateData: any): void;
        createAddComponentToPrefab(stateData: any): void;
        createModifyAssetPropertyState(target: Asset, newValueList: any[], preValueCopylist: any[]): void;
        serializeProperty(value: any, editType: editor.EditType): any;
        deserializeProperty(serializeData: any, editType: editor.EditType): any;
        /**
         * 创建游戏对象
         */
        createGameObject(list: number[]): void;
        /**
         * 添加组件
         */
        addComponent(gameObjectId: number, compClzName: string): void;
        /**
        *  TODO:因gameobject未提供添加组件实例方法，暂时这样处理
        * @param gameObject
        * @param component
        */
        addComponentToGameObject(gameObject: GameObject, component: BaseComponent): void;
        /**
         * 移除组件
         * @param gameObjectId
         * @param componentId
         */
        removeComponent(gameObjectId: number, componentId: number): void;
        getComponentById(gameObject: GameObject, componentId: number): BaseComponent;
        /**
         * 粘贴游戏对象
         * @param target
         */
        pasteGameObject(target?: egret3d.Transform): void;
        /**
         * 克隆游戏对象
         * @param gameObjects
         */
        duplicateGameObjects(gameObjects: GameObject[]): void;
        /**
         *
         * @param gameObjects 去重之后的游戏对象
         */
        private getPrefabDataForDuplicate(gameObjects);
        /**
         * 设置克隆对象的prefab信息
         * @param gameObj
         * @param prefabData
         * @param uniqueIndex
         */
        duplicatePrefabDataToGameObject(gameObj: GameObject, prefabData: any, uniqueIndex: number): void;
        /**
         * 收集prefab信息，用于duplicate或者paste后设置新对象的prefab信息
         * @param gameObject
         * @param index
         * @param prefabData
         */
        getPrefabDataFromGameObject(gameObj: GameObject, uniqueIndex: number, prefabData: any, allRootObjs: GameObject[]): void;
        /**
         * 获取某个游戏对象下所有预制体实例的根对象,用于确定duplicate时选中的对象是否属于一个完整的预制体
         * @param gameObj
         * @param rootObjs
         */
        private getPrefabRootObjsFromGameObject(gameObj, rootObjs);
        /**
         * 查找root游戏对象
         * @param gameObj
         */
        getPrefabRootObjByChild(gameObj: GameObject): GameObject;
        /**
         * 删除游戏对象
         * @param gameObjects
         */
        deleteGameObject(gameObjects: GameObject[], prefabRootMap?: any): void;
        _deleteGameObject(gameObjects: GameObject[]): void;
        updateParent(gameObjectIds: number[], targetId: number, prefabRootMap?: any): void;
        /**
         * 清除预制体里游戏对象的prefab引用,root或者持有此root引用的游戏对象
         * @param rootId 预制体的根id
         */
        clearRootPrefabInstance(gameObj: GameObject, rootObj: GameObject): void;
        /**
         * 还原prefab
         * @param rootObj
         * @param prefab
         */
        resetPrefabbyRootId(rootObj: GameObject, prefab: any, prefabIds: number[]): void;
        /**
         * 获取预制体实例包含的所有游戏对象id
         * @param rootObj
         * @param ids
         */
        getAllIdsFromPrefabInstance(gameObj: GameObject, ids: number[], rootObj: GameObject): void;
        /**
         * 去重
         * @param gameObjects
         */
        unique(gameObjects: GameObject[]): void;
        getGameObjectById(gameObjectId: number): GameObject;
        /**
         * 根据id获取对象列表
         * @param ids 不重复的id列表
         */
        getGameObjectsByIds(ids: number[]): GameObject[];
        private getAllHashCodeFromGameObjects(gameobjects);
        /**
         * 获取gameobject和其子gameobject的hashcode
         * @param gameObject
         * @param hashcodes
         */
        getAllHashCodeFromGameObject(gameObject: GameObject, hashcodes: number[]): void;
        /**
         * 还原游戏对象及其子游戏对象的hashcode
         * @param gameObj
         * @param hashcodes
         */
        resetHashCode(gameObj: GameObject, hashcodes: number[]): void;
        /**
         * 还原游戏对象及其子游戏对象的组件的hashcode
         * @param gameObject
         * @param hashcodes
         */
        resetComponentHashCode(gameObject: GameObject, hashcodes: number[]): void;
        getAllComponentIdFromGameObject(gameObject: GameObject, hashcodes: number[]): void;
        private findOptionSetName(propName, target);
        setTargetProperty(propName: string, target: any, value: any): void;
        /**
         * 选中游戏对象
         * @param gameObjects
         * @param addHistory 是否产生历史记录，只在用户进行选中相关操作时调用
         */
        selectGameObject(selectObj: any, options?: {
            addHistory: boolean;
            preIds: number[];
        }): void;
        switchScene(url: string): void;
        private _editCamera;
        geoController: GeoController;
        private loadEditScene(url);
        private createEditCamera();
        /**
         * 切换编辑模式
         */
        changeEditMode(mode: string): void;
        /**
         * 切换编辑类型
         */
        changeEditType(type: string): void;
        /**
         * 序列化场景
         */
        serializeActiveScene(): string;
        undo: () => void;
        redo: () => void;
    }
}
declare namespace paper.editor {
    class GeoController {
        selectedGameObjs: GameObject[];
        private _isEditing;
        private _geoCtrlMode;
        private _modeCanChange;
        geoCtrlMode: string;
        private _geoCtrlType;
        geoCtrlType: string;
        private editorModel;
        constructor(editorModel: EditorModel);
        private bindMouse;
        private bindKeyboard;
        update(): void;
        /**
         * 几何操作逻辑
         */
        private _dragMode;
        private _dragOffset;
        private _delta;
        private _newPosition;
        private _ctrlPos;
        private _ctrlRot;
        private _dragPlanePoint;
        private _dragPlaneNormal;
        cameraScript: paper.editor.EditorCameraScript;
        private _initRotation;
        private _oldLocalScale;
        private updateInLocalMode();
        private updateInWorldMode();
        /**
         * 输入监听
         */
        private inputUpdate();
        /**
         * 添加监听事件
         */
        private _addEventListener();
        private selectGameObjects;
        private _selectGameObjects(selectObj);
        private changeProperty;
        private _changeProperty(data);
        private changeEditMode;
        private _changeEditMode(mode);
        private changeEditType;
        private _changeEditType(type);
        /**
         * 创建控制杆GameObjcet
         */
        private ball;
        private xAxis;
        private yAxis;
        private zAxis;
        private xRot;
        private yRot;
        private zRot;
        private xScl;
        private yScl;
        private zScl;
        private pCtrl;
        private rCtrl;
        private sCtrl;
        private controller;
        controllerPool: GameObject[];
        _addGizmoController(): void;
        /**
         * type 0:控制位置 1:控制旋转
         */
        private _createAxis(color, type);
        _removeGizmoController(): void;
    }
}
declare namespace paper.editor {
    type EventData<D> = {
        isUndo: boolean;
        data: D;
    };
    const EventType: {
        HistoryState: string;
        HistoryAdd: string;
        HistoryFree: string;
    };
    class History {
        static toString(): string;
        dispatcher: EventDispatcher | null;
        private _locked;
        private _index;
        private _batchIndex;
        private readonly _states;
        private readonly _batchStates;
        private readonly _events;
        private _free();
        private _doState(state, isUndo);
        back(): boolean;
        forward(): boolean;
        go(index: number): boolean;
        add(state: BaseState): void;
        beginBatch(): void;
        endBatch(): void;
        getState(index: number): BaseState | null;
        enabled: boolean;
        readonly count: number;
        readonly index: number;
    }
    abstract class BaseState {
        autoClear: boolean;
        batchIndex: number;
        data: any;
        private _isDone;
        undo(): boolean;
        redo(): boolean;
        dispatchEditorModelEvent(type: string, data?: any): void;
    }
    class ModifyGameObjectPropertyState extends BaseState {
        static create(data?: any): ModifyGameObjectPropertyState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class ModifyComponentPropertyState extends BaseState {
        static toString(): string;
        static create(source: any, key: number | string, value: any, data?: any): ModifyComponentPropertyState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class SelectGameObjectesState extends BaseState {
        static toString(): string;
        static create(data?: any): SelectGameObjectesState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class AddGameObjectState extends BaseState {
        static toString(): string;
        static create(data?: any): AddGameObjectState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class DeleteGameObjectsState extends BaseState {
        static toString(): string;
        static create(data?: any): DeleteGameObjectsState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class DuplicateGameObjectsState extends BaseState {
        static toString(): string;
        static create(data?: any): DuplicateGameObjectsState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class PasteGameObjectsState extends BaseState {
        static toString(): string;
        static create(data?: any): PasteGameObjectsState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class AddComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): AddComponentState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class RemoveComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): RemoveComponentState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class UpdateParentState extends BaseState {
        static toString(): string;
        static create(data?: any): UpdateParentState | null;
        undo(): boolean;
        redo(): boolean;
    }
    class ModifyPrefabProperty extends BaseState {
        protected getGameObjectById(gameObjectId: number): GameObject;
        protected getGameObjectsByPrefab: (prefab: egret3d.Prefab) => GameObject[];
        protected equal(a: any, b: any): boolean;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
    }
    class ModifyPrefabGameObjectPropertyState extends ModifyPrefabProperty {
        static toString(): string;
        static create(data?: any): ModifyPrefabGameObjectPropertyState | null;
        /**
         * 修改预制体游戏对象属性,目前只支持修改根对象
         * @param gameObjectId
         * @param valueList
         */
        modifyPrefabGameObjectPropertyValues(gameObjectId: number, valueList: any[]): void;
        undo(): boolean;
        redo(): boolean;
    }
    class ModifyPrefabComponentPropertyState extends ModifyPrefabProperty {
        static toString(): string;
        static create(data?: any): ModifyPrefabComponentPropertyState | null;
        modifyPrefabComponentPropertyValues(gameObjectId: number, componentId: number, valueList: any[]): void;
        undo(): boolean;
        redo(): boolean;
    }
    class RemovePrefabComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): RemovePrefabComponentState | null;
        protected getGameObjectById(gameObjectId: number): GameObject;
        undo(): boolean;
        redo(): boolean;
    }
    class AddPrefabComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): AddPrefabComponentState | null;
        undo(): boolean;
        protected getGameObjectById(gameObjectId: number): GameObject;
        redo(): boolean;
    }
    class ModifyAssetPropertyState extends BaseState {
        static toString(): string;
        static create(data?: any): ModifyAssetPropertyState | null;
        modifyAssetPropertyValues(target: Asset, valueList: any[]): void;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    /**
     * EditorCamera系统
     */
    class EditorCameraSystem extends egret3d.CameraSystem {
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace paper.editor {
    /**
     * TODO Gizmos系统
     * 可以用来绘制一些图标等
     */
    class GizmosSystem extends BaseSystem<BaseComponent> {
        /**
         * @inheritDoc
         */
        update(): void;
    }
}
declare namespace paper.editor {
    class EditorCameraScript extends paper.Behaviour {
        editorModel: EditorModel;
        moveSpeed: number;
        wheelSpeed: number;
        rotateSpeed: number;
        private bindKeyboard;
        private bindMouse;
        private _lastMouseX;
        private _lastMouseY;
        private _mouseDown_r;
        private _mouseDown_l;
        onStart(): any;
        onUpdate(delta: number): any;
        OnEnable(): void;
        OnDisable(): void;
        private inputUpdate(delta);
        private _lookAtPiont;
        private _dragPlanePoint;
        private _dragPlaneNormal;
        private _helpQuat;
        private _helpVec3;
        onDestroy(): any;
    }
}
declare namespace paper.editor {
    class PickGameObjectScript extends paper.Behaviour {
        editorModel: EditorModel;
        private bindMouse;
        private bindKeyboard;
        private cameraScript;
        private camera;
        onStart(): any;
        private _tapStart;
        private selectedGameObjects;
        onUpdate(delta: number): any;
        private setStroke(picked);
    }
}
declare namespace paper.editor {
    class Gizmo {
        private static _editorCamera;
        private static _enabled;
        private static webgl;
        private static context;
        private static camera;
        static Enabled(editorCamera: any): void;
        static Disabled(): void;
        private static texturePool;
        static DrawIcon(path: string, pos: egret3d.Vector3, size: number, color?: egret3d.Color): void;
        private static verticesLine;
        private static lineVertexBuffer;
        static DrawLine(posStart: egret3d.Vector3, posEnd: egret3d.Vector3, size?: number, color?: number[]): void;
        static DrawCoord(): void;
        private static verticesCoord;
        private static verticesCylinder;
        private static verticesArrow;
        private static coordVertexBuffer;
        private static cylinderVertexBuffer;
        private static arrowVertexBuffer;
        private static cameraVertexBuffer;
        private static cameraIndexBuffer;
        private static nrLine;
        private static setVertices();
        private static mvpMatrix;
        private static mMatrix;
        private static vMatrix;
        private static pMatrix;
        private static setMVPMatrix(m?);
        private static glProgram_line;
        private static glProgram_icon;
        private static initPrg();
        private static lightPool;
        private static cameraPool;
        private static getAllLightAndCamera();
        static DrawLights(): void;
        private static DrawCylinder(transform, color);
        static DrawCameras(): void;
        static DrawCameraSquare(obj: GameObject, color: number[]): void;
        private static helpVec31;
        private static helpVec32;
        private static helpVec33;
        private static helpVec34;
        private static helpVec35;
        private static helpVec36;
        private static verticesCameraSquare;
        private static getCameraSquare(obj);
        static DrawArrow(m: egret3d.Matrix, color: number[], fixSize?: boolean): void;
        private static xArrowMMatrix;
        private static yArrowMMatrix;
        private static zArrowMMatrix;
        private static helpMat;
        private static helpMat1;
        static DrawArrowXYZ(transform: egret3d.Transform): void;
        private static getWorldMatrixWithoutScale(transform, fixScale, out);
        private static fixPMat;
        private static textures;
        private static imageLoaded;
        private static initIconTexture();
        private static loadIconTexture(image, key);
        private static icons;
    }
}
declare namespace paper.editor {
    class GizmoShader {
        prg: WebGLProgram;
        private gl;
        constructor(gl: WebGLRenderingContext, vshader: string, fshader: string);
        private createProgram(vshader, fshader);
        private createShader(type, str);
        use(): void;
        setFloat(name: string, value: number): void;
        setInt(name: string, value: number): void;
        setBool(name: string, value: boolean): void;
        setVec3(name: string, value: egret3d.Vector3): void;
        setVec4(name: string, value: egret3d.Vector4): void;
        setColor(name: string, value: number[]): void;
        setMatrix(name: string, value: egret3d.Matrix): void;
        setTexture(name: string, value: number): void;
    }
}
declare namespace egret3d {
    interface ILightShadow {
        renderTarget: IRenderTarget;
        map: WebGLTexture;
        bias: number;
        radius: number;
        matrix: Matrix;
        windowSize: number;
        camera: Camera;
        update(light: Light, face?: number): void;
    }
}
