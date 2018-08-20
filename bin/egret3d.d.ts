declare namespace paper {
    /**
     * 通过装饰器标记序列化属性。
     */
    function serializedField(classPrototype: any, key: string): void;
    /**
     * 通过装饰器标记反序列化时需要忽略的属性。
     */
    function deserializedIgnore(classPrototype: any, key: string): void;
    /**
     * 通过装饰器标记组件是否允许在同一实体上添加多个实例。
     */
    function allowMultiple(componentClass: ComponentClass<BaseComponent>): void;
    /**
     * 通过装饰器标记组件依赖的其他组件。
     */
    function requireComponent(requireComponentClass: ComponentClass<BaseComponent>): (componentClass: ComponentClass<BaseComponent>) => void;
    /**
     * 通过装饰器标记组件是否在编辑模式拥有生命周期。
     */
    function executeInEditMode(componentClass: ComponentClass<Behaviour>): void;
}
declare namespace paper {
    /**
     *
     */
    interface BaseClass extends Function {
        /**
         * @internal
         */
        __serializeKeys?: string[];
        /**
         * @internal
         */
        __deserializeIgnore?: string[];
        /**
         * @internal
         */
        __owner?: BaseClass;
        /**
         * @internal
         */
        readonly __onRegister: (baseClass: BaseClass) => void;
    }
    /**
     * 生成 uuid 的方式。
     * @internal
     */
    let createUUID: () => string;
    /**
     * @internal
     */
    function registerClass(baseClass: BaseClass): void;
    /**
     * 基础对象。
     */
    abstract class BaseObject implements IUUID {
        /**
         * @internal
         */
        static __serializeKeys?: string[];
        /**
         * @internal
         */
        static __deserializeIgnore?: string[];
        /**
         * @internal
         */
        static __owner?: BaseClass;
        /**
         * @internal
         */
        static __onRegister(baseClass: BaseClass): void;
        /**
         *
         */
        uuid: string;
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
    abstract class Asset extends BaseObject {
        /**
         * @deprecated
         */
        private static readonly _assets;
        /**
         * @deprecated
         */
        static register(asset: Asset): void;
        /**
         * @deprecated
         */
        static find<T extends Asset>(name: string): T;
        /**
         *
         */
        name: string;
        /**
         * @internal
         */
        _isBuiltin: boolean;
        constructor(name?: string);
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
    interface IVector3 {
        x: number;
        y: number;
        z: number;
        readonly length: number;
    }
    /**
     *
     */
    const enum EulerOrder {
        XYZ = 0,
        XZY = 1,
        YXZ = 2,
        YZX = 3,
        ZXY = 4,
        ZYX = 5,
    }
    /**
     *
     */
    class Vector3 implements IVector3, paper.IRelease<Vector3>, paper.ISerializable {
        static readonly ZERO: Readonly<Vector3>;
        static readonly ONE: Readonly<Vector3>;
        static readonly UP: Readonly<Vector3>;
        static readonly DOWN: Readonly<Vector3>;
        static readonly LEFT: Readonly<Vector3>;
        static readonly RIGHT: Readonly<Vector3>;
        static readonly FORWARD: Readonly<Vector3>;
        static readonly BACK: Readonly<Vector3>;
        private static readonly _instances;
        static create(x?: number, y?: number, z?: number): Vector3;
        release(): this;
        x: number;
        y: number;
        z: number;
        /**
         * @deprecated
         * @private
         */
        constructor(x?: number, y?: number, z?: number);
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number]>): this;
        copy(value: Readonly<IVector3>): this;
        clone(): Vector3;
        equal(value: Readonly<IVector3>, threshold?: number): boolean;
        set(x: number, y: number, z: number): this;
        fromArray(value: Readonly<ArrayLike<number>>, offset?: number): this;
        fromPlaneProjection(plane: Readonly<Plane>, value?: Readonly<IVector3>): this;
        applyMatrix(matrix: Readonly<Matrix>, value?: Readonly<IVector3>): this;
        applyDirection(matrix: Readonly<Matrix>, value?: Readonly<IVector3>): this;
        applyQuaternion(quaternion: Readonly<IVector4>, value?: Readonly<IVector3>): this;
        normalize(value?: Readonly<IVector3>): this;
        negate(value?: Readonly<IVector3>): void;
        addScalar(add: number, value?: Readonly<IVector3>): this;
        add(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        subtract(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        multiplyScalar(scale: number, value?: Readonly<IVector3>): this;
        multiply(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        dot(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): number;
        cross(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        lerp(t: number, valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        min(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        max(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): this;
        clamp(min: Readonly<IVector3>, max: Readonly<IVector3>): this;
        getDistance(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): number;
        getSquaredDistance(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): number;
        closestToTriangle(triangle: Readonly<Triangle>, value?: Readonly<IVector3>): this;
        readonly length: number;
        readonly squaredLength: number;
        /**
         * @deprecated
         */
        static set(x: number, y: number, z: number, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static normalize(v: IVector3): IVector3;
        /**
         * @deprecated
         */
        static copy(v: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static add(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static multiply(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static scale(v: Vector3, scale: number): Vector3;
        /**
         * @deprecated
         */
        static cross(lhs: IVector3, rhs: IVector3, out: IVector3): IVector3;
        /**
         * @deprecated
         */
        static dot(v1: Vector3, v2: Vector3): number;
        /**
         * @deprecated
         */
        static lerp(v1: Vector3, v2: Vector3, v: number, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static equal(v1: Vector3, v2: Vector3, threshold?: number): boolean;
        /**
         * @deprecated
         */
        static subtract(v1: Readonly<IVector3>, v2: Readonly<IVector3>, out: IVector3): IVector3;
        /**
         * @deprecated
         */
        static getSqrLength(v: Readonly<IVector3>): number;
        /**
         * @deprecated
         */
        static getLength(v: Readonly<IVector3>): number;
        /**
         * @deprecated
         */
        static getDistance(a: Readonly<IVector3>, b: Readonly<IVector3>): number;
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
declare namespace egret3d {
    /**
     *
     */
    class Matrix implements paper.IRelease<Matrix>, paper.ISerializable {
        private static readonly _instances;
        /**
         *
         * @param rawData
         * @param offset
         */
        static create(rawData?: Readonly<ArrayLike<number>> | null, offset?: number): Matrix;
        /**
         *
         */
        release(): this;
        /**
         *
         */
        readonly rawData: Float32Array;
        /**
         * @deprecated
         * @private
         */
        constructor();
        serialize(): Float32Array;
        deserialize(value: Readonly<[number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]>): this;
        copy(value: Readonly<Matrix>): this;
        clone(): Matrix;
        identity(): this;
        set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): this;
        fromArray(value: Readonly<ArrayLike<number>>, offset?: number): this;
        fromTranslate(value: Readonly<IVector3>, rotationAndScaleStays?: boolean): this;
        fromRotation(rotation: Quaternion, translateStays?: boolean): this;
        fromEuler(value: Readonly<IVector3>, order?: EulerOrder, translateStays?: boolean): this;
        formScale(x: number, y: number, z: number, translateStays?: boolean): this;
        determinant(): number;
        compose(translation: Vector3, rotation: Quaternion, scale: Vector3): this;
        decompose(translation?: Vector3 | null, rotation?: Quaternion | null, scale?: Vector3 | null): this;
        transpose(value?: Readonly<Matrix>): this;
        inverse(value?: Readonly<Matrix>): this;
        multiply(valueA: Matrix, valueB?: Matrix): this;
        premultiply(value: Readonly<Matrix>): this;
        /**
         * - 两点位置不重合。
         * @param eye
         * @param target
         * @param up
         */
        lookAt(eye: Readonly<IVector3>, target: Readonly<IVector3>, up: Readonly<IVector3>): this;
        toEuler(value: Vector3, order?: EulerOrder): Vector3;
        /**
         * @deprecated
         */
        transformVector3(value: Vector3, out?: Vector3): Vector3;
        /**
         * @deprecated
         */
        transformNormal(value: Vector3, out?: Vector3): Vector3;
        /**
         * @deprecated
         */
        scale(scaler: number): this;
        /**
         * @deprecated
         */
        add(left: Matrix, right?: Matrix): this;
        /**
         * @deprecated
         */
        lerp(v: number, left: Matrix, right: Matrix): this;
        /**
         * @deprecated
         */
        static perspectiveProjectLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix): Matrix;
        /**
         * @deprecated
         */
        static orthoProjectLH(width: number, height: number, znear: number, zfar: number, out: Matrix): Matrix;
    }
    const helpMatrixA: Matrix;
    const helpMatrixB: Matrix;
    const helpMatrixC: Matrix;
    const helpMatrixD: Matrix;
}
declare namespace egret3d {
    interface IVector4 extends IVector3 {
        w: number;
        readonly length: number;
    }
    class Vector4 implements IVector4, paper.IRelease<Vector4>, paper.ISerializable {
        private static readonly _instances;
        static create(x?: number, y?: number, z?: number, w?: number): Vector4;
        release(): this;
        x: number;
        y: number;
        z: number;
        w: number;
        /**
         * @deprecated
         * @private
         */
        constructor(x?: number, y?: number, z?: number, w?: number);
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number]>): this;
        copy(value: Readonly<IVector4>): this;
        clone(): Vector4;
        set(x: number, y: number, z: number, w: number): this;
        fromArray(value: Readonly<ArrayLike<number>>, offset?: number): this;
        normalize(value?: Readonly<IVector4>): this;
        readonly length: number;
        readonly squaredLength: number;
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
    class BaseObjectAsset extends Asset {
        protected _raw: ISerializedData;
        /**
         * @internal
         */
        $parse(json: ISerializedData): void;
        dispose(): void;
        caclByteLength(): number;
    }
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
         * @internal
         */
        createInstance(keepUUID?: boolean): Scene;
    }
}
declare namespace paper {
    /**
     *
     */
    interface ComponentClass<T extends BaseComponent> extends BaseClass {
        executeInEditMode: boolean;
        allowMultiple: boolean;
        requireComponents: ComponentClass<BaseComponent>[] | null;
        /**
         * @internal
         */
        readonly __isSingleton: boolean;
        /**
         * @internal
         */
        __index: number;
        new (): T;
    }
    /**
     *
     */
    type ComponentClassArray = (ComponentClass<BaseComponent> | undefined)[];
    /**
     *
     */
    type ComponentArray = (BaseComponent | undefined)[];
    /**
     *
     */
    type ComponentExtras = {
        linkedID?: string;
    };
    /**
     * 组件基类
     */
    abstract class BaseComponent extends BaseObject {
        /**
         * 是否在编辑模式拥有生命周期。
         */
        static executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个实例。
         */
        static allowMultiple: boolean;
        /**
         * 依赖的其他组件。
         */
        static requireComponents: ComponentClass<BaseComponent>[] | null;
        /**
         * @internal
         */
        static readonly __isSingleton: boolean;
        /**
         * @internal
         */
        static __index: number;
        private static readonly _componentClasses;
        private static _createEnabled;
        /**
         * @internal
         */
        static __onRegister(componentClass: ComponentClass<BaseComponent>): void;
        /**
         * @internal
         */
        static create<T extends BaseComponent>(componentClass: ComponentClass<T>, gameObject: GameObject): T;
        /**
         * 组件挂载的 GameObject
         */
        readonly gameObject: GameObject;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: ComponentExtras;
        protected _enabled: boolean;
        /**
         * 禁止实例化组件。
         * @protected
         */
        constructor();
        /**
         * 添加组件后，组件内部初始化。
         * - 重载此方法时，必须调用 `super.initialize()`。
         */
        initialize(config?: any): void;
        /**
         * 移除组件后，组件内部卸载。
         * - 重载此方法时，必须调用 `super.uninitialize()`。
         */
        uninitialize(): void;
        /**
         *
         */
        readonly isDestroyed: boolean;
        /**
         * 组件的激活状态。
         */
        enabled: boolean;
        /**
         * 组件在场景的激活状态。
         */
        readonly isActiveAndEnabled: boolean;
        /**
         *
         */
        readonly transform: egret3d.Transform;
    }
}
declare namespace egret3d {
    /**
     * 射线
     */
    class Ray implements paper.IRelease<Ray>, paper.ISerializable {
        private static readonly _instances;
        static create(origin?: Readonly<IVector3>, direction?: Readonly<IVector3>): Ray;
        release(): this;
        /**
         * 射线起始点
         */
        readonly origin: Vector3;
        /**
         * 射线的方向向量
         */
        readonly direction: Vector3;
        /**
         * @deprecated
         * @private
         */
        constructor(origin?: Readonly<IVector3>, direction?: Readonly<IVector3>);
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number, number, number]>): this;
        copy(value: Readonly<Ray>): this;
        clone(): Ray;
        set(origin: Readonly<IVector3>, direction: Readonly<IVector3>): this;
        /**
         * 与aabb碰撞相交检测
         */
        intersectAABB(aabb: AABB): boolean;
        /**
         * 与transform表示的plane碰撞相交检测，主要用于2d检测
         * @param transform transform实例
         */
        intersectPlaneTransform(transform: Transform): PickInfo;
        intersectPlane(planePoint: Vector3, planeNormal: Vector3): Vector3;
        /**
         * 与最大最小点表示的box相交检测
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         */
        intersectBoxMinMax(minimum: Vector3, maximum: Vector3): boolean;
        /**
         * 与球相交检测
         */
        intersectsSphere(center: Vector3, radius: number): boolean;
        /**
         * 与三角形相交检测
         */
        intersectTriangle(p1: Vector3, p2: Vector3, p3: Vector3, backfaceCulling?: boolean): PickInfo | null;
        /**
         * 获取射线拾取到的最近物体。
         */
        static raycast(ray: Ray, isPickMesh?: boolean, maxDistance?: number, layerMask?: paper.Layer): PickInfo | null;
        /**
         * 获取射线路径上的所有物体。
         */
        static raycastAll(ray: Ray, isPickMesh?: boolean, maxDistance?: number, layerMask?: paper.Layer): PickInfo[] | null;
        private static _doPick(ray, maxDistance, layerMask, pickAll?, isPickMesh?);
        private static _pickMesh(ray, transform, pickInfos);
        private static _pickCollider(ray, transform, pickInfos);
    }
    /**
     * 场景拣选信息
     */
    class PickInfo {
        subMeshIndex: number;
        triangleIndex: number;
        distance: number;
        readonly position: Vector3;
        readonly textureCoordA: Vector2;
        readonly textureCoordB: Vector2;
        transform: Transform | null;
    }
}
declare namespace egret3d {
    /**
     *
     */
    interface GLTFTexture extends gltf.Texture {
        extensions: {
            paper?: {
                mipmap?: boolean;
                format?: 6407 | 6408 | 6409;
                pixelSize?: number;
                width?: number;
                height?: number;
            };
        };
    }
    /**
     *
     */
    interface GLTFMaterial extends gltf.Material {
        extensions: {
            KHR_techniques_webgl: gltf.KhrTechniquesWebglMaterialExtension;
            paper?: {
                renderQueue?: number;
            };
        };
    }
    /**
     *
     */
    interface GLTF extends gltf.GLTF {
        version: string;
        extensions: {
            KHR_techniques_webgl?: gltf.KhrTechniqueWebglGlTfExtension;
            paper?: {
                shaders?: gltf.Shader[];
                renderQueue?: number;
            };
        };
        extensionsUsed: string[];
        extensionsRequired: string[];
    }
    /**
     *
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
        private static _createConfig();
        /**
         *
         */
        static parseFromBinary(array: Uint32Array): {
            config: GLTF;
            buffers: (Float32Array | Uint16Array | Uint32Array)[];
        };
        /**
         *
         */
        static createMeshConfig(): GLTF;
        /**
         *
         */
        static createGLTFExtensionsConfig(): GLTF;
        static createShaderAsset(name: string): GLTFAsset;
        static createTechnique(source: gltf.Technique): gltf.Technique;
        /**
         * Buffer 列表。
         */
        readonly buffers: (Float32Array | Uint32Array | Uint16Array)[];
        /**
         * 配置。
         */
        config: GLTF;
        /**
         * @internal
         */
        parse(config: GLTF, buffers?: Uint32Array[]): void;
        /**
         * @internal
         */
        initialize(): void;
        dispose(): void;
        caclByteLength(): number;
        /**
         * 根据指定 BufferView 创建二进制数组。
         */
        createTypeArrayFromBufferView(bufferView: gltf.BufferView, componentType: gltf.ComponentType): Uint8Array;
        /**
         * 根据指定 Accessor 创建二进制数组。
         */
        createTypeArrayFromAccessor(accessor: gltf.Accessor, offset?: number, count?: number): Uint8Array;
        /**
         *
         */
        getComponentTypeCount(type: gltf.ComponentType): number;
        /**
         *
         */
        getAccessorTypeCount(type: gltf.AccessorType): number;
        /**
         * 自定义 Mesh 的属性枚举。
         */
        getMeshAttributeType(type: gltf.MeshAttribute): gltf.AccessorType;
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
    }
}
/**
 *
 */
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
    /**
     * The uniform type.  All valid values correspond to WebGL enums.
     */
    const enum UniformType {
        Int = 5124,
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
    const enum DrawMode {
        Stream = 35040,
        Static = 35044,
        Dynamic = 35048,
    }
    /**
     *
     */
    const enum TextureFormat {
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
    }
    /**
     * The shader stage.  All valid values correspond to WebGL enums.
     */
    const enum ShaderStage {
        FRAGMENT_SHADER = 35632,
        VERTEX_SHADER = 35633,
    }
    const enum EnableState {
        BLEND = 3042,
        CULL_FACE = 2884,
        DEPTH_TEST = 2929,
        POLYGON_OFFSET_FILL = 32823,
        SAMPLE_ALPHA_TO_COVERAGE = 32926,
    }
    const enum BlendEquation {
        FUNC_ADD = 32774,
        FUNC_SUBTRACT = 32778,
        FUNC_REVERSE_SUBTRACT = 32779,
    }
    const enum BlendFactor {
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
    const enum CullFace {
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032,
    }
    const enum FrontFace {
        CW = 2304,
        CCW = 2305,
    }
    const enum DepthFunc {
        NEVER = 512,
        LESS = 513,
        LEQUAL = 515,
        EQUAL = 514,
        GREATER = 516,
        NOTEQUAL = 517,
        GEQUAL = 518,
        ALWAYS = 519,
    }
    const enum AttributeSemanticType {
        POSITION = "POSITION",
        NORMAL = "NORMAL",
        TEXCOORD_0 = "TEXCOORD_0",
        TEXCOORD_1 = "TEXCOORD_1",
        COLOR_0 = "COLOR_0",
        COLOR_1 = "COLOR_1",
        JOINTS_0 = "JOINTS_0",
        WEIGHTS_0 = "WEIGHTS_0",
        _CORNER = "CORNER",
        _START_POSITION = "START_POSITION",
        _START_VELOCITY = "START_VELOCITY",
        _START_COLOR = "START_COLOR",
        _START_SIZE = "START_SIZE",
        _START_ROTATION = "START_ROTATION",
        _TIME = "TIME",
        _RANDOM0 = "RANDOM0",
        _RANDOM1 = "RANDOM1",
        _WORLD_POSITION = "WORLD_POSITION",
        _WORLD_ROTATION = "WORLD_ROTATION",
    }
    const enum UniformSemanticType {
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
    /**
    * A vertex or fragment shader. Exactly one of `uri` or `bufferView` must be provided for the GLSL source.
    */
    interface Shader {
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
    }
    /**
     * An attribute input to a technique and the corresponding semantic.
     */
    interface Attribute {
        /**
         * Identifies a mesh attribute semantic.
         */
        semantic: string;
        extensions?: any;
        extras?: any;
        [k: string]: any;
    }
    type UniformValue = any;
    /**
     * A uniform input to a technique, and an optional semantic and value.
     */
    interface Uniform {
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
    }
    /**
     * A template for material appearances.
     */
    interface Technique {
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
    interface Program {
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
    interface KhrTechniqueWebglGlTfExtension {
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
    interface KhrTechniquesWebglMaterialExtension {
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
    interface KhrBlendMaterialExtension {
        blendEquation: number[];
        blendFactors: number[];
    }
    /**
     * Arguments for fixed-function rendering state functions other than `enable()`/`disable()`.
     */
    interface Functions {
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
    interface States {
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
        /**shader */
        SHADER = 16,
        /**数组 */
        ARRAY = 17,
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
    function getEditInfoByPrototype(classInstance: any): PropertyInfo[];
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
declare namespace egret3d {
    class Color implements paper.ISerializable {
        static readonly WHITE: Readonly<Color>;
        static readonly BLACK: Readonly<Color>;
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number]>): this;
        set(r?: number, g?: number, b?: number, a?: number): this;
        static multiply(c1: Color, c2: Color, out: Color): Color;
        static scale(c: Color, scaler: number): Color;
        static copy(c: Color, out: Color): Color;
        static lerp(c1: Color, c2: Color, value: number, out: Color): Color;
    }
}
declare namespace paper {
    /**
     * 预制体资源。
     */
    class Prefab extends BaseObjectAsset {
        /**
         *
         */
        static create(name: string, scene?: Scene | null): GameObject;
        /**
         * @deprecated
         */
        createInstance(scene?: Scene | null, keepUUID?: boolean): GameObject;
    }
}
declare namespace paper {
    /**
     * SystemManager 是ecs内部的系统管理者，负责每帧循环时轮询每个系统。
     */
    class SystemManager {
        private static _instance;
        static getInstance(): SystemManager;
        private constructor();
        private readonly _systems;
        private _currentSystem;
        private _preRegister(systemClass);
        /**
         * 注册一个系统到管理器中。
         */
        register(systemClass: {
            new (): BaseSystem;
        }, after?: {
            new (): BaseSystem;
        } | null): void;
        /**
         * 注册一个系统到管理器中。
         */
        registerBefore(systemClass: {
            new (): BaseSystem;
        }, before?: {
            new (): BaseSystem;
        } | null): void;
        /**
         *
         */
        enableSystem(systemClass: {
            new (): BaseSystem;
        }): void;
        /**
         *
         */
        disableSystem(systemClass: {
            new (): BaseSystem;
        }): void;
        /**
         * 获取一个管理器中指定的系统实例。
         */
        getSystem<T extends BaseSystem>(systemClass: {
            new (): T;
        }): T;
        /**
         * @internal
         */
        update(): void;
        /**
         *
         */
        readonly systems: ReadonlyArray<BaseSystem>;
    }
}
declare namespace paper {
    /**
     * 场景管理器
     */
    class SceneManager {
        private static _instance;
        static getInstance(): SceneManager;
        private constructor();
        /**
         *
         */
        camerasScene: Scene | null;
        /**
         *
         */
        lightsScene: Scene | null;
        private readonly _scenes;
        private _globalScene;
        private _editorScene;
        private _globalGameObject;
        /**
         * @internal
         */
        _addScene(scene: Scene, isActive: boolean): void;
        /**
         * @internal
         */
        _removeScene(scene: Scene): boolean;
        /**
         * 卸载所有场景。
         */
        unloadAllScene(excludes?: ReadonlyArray<Scene>): void;
        /**
         *
         */
        getSceneByName(name: string): Scene;
        /**
         *
         */
        readonly scenes: ReadonlyArray<Scene>;
        /**
         *
         */
        readonly globalScene: Scene;
        /**
         * 当前激活的场景。
         */
        activeScene: Scene;
        /**
         *
         */
        readonly editorScene: Scene;
        /**
         *
         */
        readonly globalGameObject: GameObject;
        /**
         * @deprecated
         */
        createScene(name: string, isActive?: boolean): Scene;
        /**
         * @deprecated
         */
        loadScene(resourceName: string, combineStaticObjects?: boolean): Scene;
        /**
         * @deprecated
         */
        unloadScene(scene: Scene): void;
        /**
         * @deprecated
         */
        getActiveScene(): Scene;
    }
}
declare namespace paper {
    /**
     *
     */
    interface IUUID {
        /**
         *
         */
        readonly uuid: string;
    }
    /**
     *
     */
    interface IAssetReference {
        /**
         *
         */
        readonly asset: number;
    }
    /**
     *
     */
    interface IClass {
        /**
         *
         */
        readonly class: string;
    }
    /**
     *
     */
    interface IRelease<T extends IRelease<T>> {
        /**
         *
         */
        release(): T;
        /**
         *
         */
        clone(): T;
        /**
         *
         */
        copy(value: Readonly<T>): T;
        /**
         *
         */
        set(...args: any[]): T;
    }
    /**
     *
     */
    interface ISerializedObject extends IUUID, IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     *
     */
    interface ISerializedStruct extends IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口。
     */
    interface ISerializedData {
        /**
         *
         */
        version?: number;
        /**
         *
         */
        compatibleVersion?: number;
        /**
         * 所有资源。
         */
        readonly assets?: string[];
        /**
         * 所有实体。（至多含一个场景）
         */
        readonly objects?: ISerializedObject[];
        /**
         * 所有组件。
         */
        readonly components?: ISerializedObject[];
    }
    /**
     * 自定义序列化接口。
     */
    interface ISerializable {
        /**
         *
         */
        serialize(): any;
        /**
         *
         */
        deserialize(element: any, data?: Deserializer): any;
    }
}
declare namespace paper {
    /**
     * 单例组件基类。
     */
    abstract class SingletonComponent extends BaseComponent {
        /**
         * @internal
         */
        static readonly __isSingleton: boolean;
        /**
         * @internal
         */
        static __instance: SingletonComponent | null;
        /**
         *
         */
        static getInstance<T extends SingletonComponent>(componentClass: ComponentClass<T>): T;
        initialize(): void;
        uninitialize(): void;
    }
}
declare namespace paper {
    const enum RendererEventType {
        Materials = "materials",
    }
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
    abstract class BaseRenderer extends BaseComponent {
        /**
         * @protected
         */
        _boundingSphereDirty: boolean;
        protected _receiveShadows: boolean;
        protected _castShadows: boolean;
        protected _lightmapIndex: number;
        protected readonly _boundingSphere: egret3d.Sphere;
        protected readonly _aabb: egret3d.AABB;
        protected readonly _lightmapScaleOffset: Float32Array;
        protected _recalculateSphere(): void;
        /**
         * 重新计算 AABB。
         */
        abstract recalculateAABB(): void;
        /**
         *
         */
        receiveShadows: boolean;
        /**
         *
         */
        castShadows: boolean;
        /**
         *
         */
        lightmapIndex: number;
        /**
         *
         */
        readonly aabb: Readonly<egret3d.AABB>;
        /**
         *
         */
        readonly boundingSphere: Readonly<egret3d.Sphere>;
        /**
         *
         */
        readonly lightmapScaleOffset: Float32Array;
    }
}
declare namespace paper {
    /**
     * 脚本组件。
     * 生命周期的顺序。
     * - onAwake();
     * - onReset();
     * - onEnable();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onLateUpdate();
     * - onDisable();
     * - onDestroy();
     */
    abstract class Behaviour extends BaseComponent {
        /**
         * @internal
         */
        _isReseted: boolean;
        /**
         * @internal
         */
        _isStarted: boolean;
        initialize(config?: any): void;
        uninitialize(): void;
        /**
         * 组件被初始化时调用。
         * @see paper.GameObject#addComponent()
         */
        onAwake?(config: any): void;
        /**
         *
         */
        onReset?(): void;
        /**
         * 组件被激活或实体被激活时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        onEnable?(): void;
        /**
         * 组件开始运行时调用。
         * - 在整个生命周期中只执行一次。
         */
        onStart?(): void;
        /**
         *
         */
        onFixedUpdate?(currentTimes: number, totalTimes: number): void;
        /**
         *
         */
        onTriggerEnter?(collider: any): void;
        /**
         *
         */
        onTriggerStay?(collider: any): void;
        /**
         *
         */
        onTriggerExit?(collider: any): void;
        /**
         *
         */
        onCollisionEnter?(collider: any): void;
        /**
         *
         */
        onCollisionStay?(collider: any): void;
        /**
         *
         */
        onCollisionExit?(collider: any): void;
        /**
         *
         */
        onUpdate?(deltaTime: number): void;
        /**
         *
         */
        onAnimationEvent?(type: string, animationState: egret3d.AnimationState, eventObject: any): void;
        /**
         *
         */
        onLateUpdate?(deltaTime: number): void;
        /**
         * 组件被禁用或实体被禁用时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        onDisable?(): void;
        /**
         * 组件被移除或实体被销毁时调用。
         * @see paper.GameObject#removeComponent()
         * @see paper.GameObject#destroy()
         */
        onDestroy?(): void;
        /**
         * @deprecated
         */
        onCollide(collider: any): void;
    }
}
declare namespace paper {
    /**
     * 系统基类。
     */
    abstract class BaseSystem {
        private static _createEnabled;
        /**
         * @internal
         */
        static create(systemClass: {
            new (): BaseSystem;
        }): BaseSystem;
        /**
         * @internal
         */
        _started: boolean;
        private _locked;
        protected _enabled: boolean;
        /**
         *
         */
        protected readonly _interests: ReadonlyArray<InterestConfig> | ReadonlyArray<ReadonlyArray<InterestConfig>>;
        /**
         *
         */
        protected readonly _groups: Group[];
        /**
         *
         */
        protected readonly _globalGameObject: GameObject;
        /**
         *
         */
        protected readonly _clock: Clock;
        /**
         * 禁止实例化系统。
         * @protected
         */
        constructor();
        /**
         * TODO 宏定义。
         * @internal
         */
        protected _isEditorUpdate(): boolean;
        /**
         * 系统内部初始化。
         * @internal
         */
        initialize(): void;
        /**
         * 系统内部卸载。
         * @internal
         */
        uninitialize(): void;
        /**
         * 系统内部更新。
         * @internal
         */
        update(): void;
        /**
         * 系统内部更新。
         * @internal
         */
        lateUpdate(): void;
        /**
         * 系统初始化时调用。
         */
        onAwake?(): void;
        /**
         * 系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        onEnable?(): void;
        /**
         * 系统开始运行时调用。
         */
        onStart?(): void;
        /**
         * 实体被添加到组时调用。
         * - 注意，该调用并不是立即的，而是等到添加到组的下一帧才被调用。
         * @see paper.GameObject#addComponent()
         */
        onAddGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * - 注意，该调用并不是立即的，而是等到添加到实体的下一帧才被调用。
         * @see paper.GameObject#addComponent()
         */
        onAddComponent?(component: BaseComponent, group: Group): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        onRemoveComponent?(component: BaseComponent, group: Group): void;
        /**
         * 实体从系统移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        onRemoveGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 系统更新时调用。
         */
        onUpdate?(deltaTime?: number): void;
        /**
         *
         */
        onLateUpdate?(deltaTime?: number): void;
        /**
         * 系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        onDisable?(): void;
        /**
         * 系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        onDestroy?(): void;
        /**
         * 该系统是否被激活。
         */
        enabled: boolean;
        /**
         *
         */
        readonly groups: ReadonlyArray<Group>;
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
    const enum LightType {
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
    abstract class BaseLight extends paper.BaseComponent {
        /**
         *
         */
        readonly type: LightType;
        /**
         *
         */
        castShadows: boolean;
        /**
         *
         */
        intensity: number;
        /**
         *
         */
        distance: number;
        /**
         *
         */
        decay: number;
        /**
         *
         */
        angle: number;
        /**
         *
         */
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
        /**
         *
         */
        shadowBias: number;
        /**
         *
         */
        shadowRadius: number;
        /**
         *
         */
        shadowSize: number;
        /**
         *
         */
        shadowCameraNear: number;
        /**
         *
         */
        shadowCameraFar: number;
        /**
         *
         */
        readonly color: Color;
        readonly matrix: Matrix;
        renderTarget: IRenderTarget;
        protected _updateMatrix(camera: Camera): void;
        /**
         * @internal
         */
        update(camera: Camera, faceIndex: number): void;
    }
}
declare namespace egret3d {
    interface IVector2 {
        x: number;
        y: number;
    }
    class Vector2 implements IVector2, paper.ISerializable {
        static readonly ZERO: Readonly<Vector2>;
        static readonly ONE: Readonly<Vector2>;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        serialize(): number[];
        deserialize(element: [number, number]): this;
        copy(value: Readonly<IVector2>): this;
        clone(): Vector2;
        set(x: number, y: number): this;
        normalize(): this;
        readonly length: number;
        readonly sqrtLength: number;
        static add(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static subtract(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static multiply(v1: Vector2, v2: Vector2, out: Vector2): Vector2;
        static dot(v1: Vector2, v2: Vector2): number;
        static scale(v: Vector2, scaler: number): Vector2;
        static getLength(v: Vector2): number;
        static getDistance(v1: Vector2, v2: Vector2): number;
        static equal(v1: Vector2, v2: Vector2, threshold?: number): boolean;
        static lerp(v1: Vector2, v2: Vector2, value: number, out: Vector2): Vector2;
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
    /**
     *
     */
    const EPSILON = 2.220446049250313e-16;
    function sign(value: number): number;
    function floatClamp(v: number, min?: number, max?: number): number;
    function numberLerp(fromV: number, toV: number, v: number): number;
    function getNormal(a: Readonly<IVector3>, b: Readonly<IVector3>, c: Readonly<IVector3>, out: Vector3): Vector3;
    function calPlaneLineIntersectPoint(planeVector: Vector3, planePoint: Vector3, lineVector: Vector3, linePoint: Vector3, out: Vector3): Vector3;
    function triangleIntersectsPlane(): void;
    function triangleIntersectsAABB(triangle: Readonly<Triangle>, aabb: Readonly<AABB>): boolean;
    function planeIntersectsAABB(plane: Readonly<Plane>, aabb: Readonly<AABB>): boolean;
    function aabbIntersectsSphere(aabb: Readonly<AABB>, value: Readonly<Sphere>): boolean;
    function aabbIntersectsAABB(valueA: Readonly<AABB>, valueB: Readonly<AABB>): boolean;
    function sphereIntersectsSphere(valueA: Readonly<Sphere>, valueB: Readonly<Sphere>): boolean;
}
declare namespace egret3d {
    /**
     *
     */
    class Quaternion extends Vector4 {
        private static readonly _instancesQ;
        static create(x?: number, y?: number, z?: number, w?: number): Quaternion;
        release(): this;
        clone(): Quaternion;
        fromMatrix(matrix: Readonly<Matrix>): this;
        fromEuler(value: Readonly<IVector3>, order?: EulerOrder): this;
        /**
         * - 向量必须已归一化。
         */
        fromAxisAngle(axis: Readonly<IVector3>, angle: number): this;
        inverse(value?: Readonly<IVector4>): this;
        dot(value: Readonly<IVector4>): number;
        multiply(valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>): this;
        premultiply(value: Readonly<IVector4>): this;
        lerp(t: number, valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>): this;
        lookAt(eye: Vector3, target: Vector3): Quaternion;
        toEuler(value: Vector3, order?: EulerOrder): Vector3;
    }
}
declare namespace egret3d {
    /**
     *
     */
    abstract class BaseMesh extends GLTFAsset {
        protected _drawMode: gltf.DrawMode;
        protected _vertexCount: number;
        protected readonly _attributeNames: string[];
        protected readonly _customAttributeTypes: {
            [key: string]: gltf.AccessorType;
        };
        protected _glTFMesh: gltf.Mesh | null;
        /**
         *
         */
        constructor(vertexCount: number, indexCount: number, attributeNames?: gltf.MeshAttribute[], attributeTypes?: {
            [key: string]: gltf.AccessorType;
        } | null, drawMode?: gltf.DrawMode);
        initialize(): void;
        /**
         *
         */
        clone(): Mesh;
        /**
         * TODO
         */
        raycast(ray: Readonly<Ray>, worldMatrix: Readonly<Matrix>): PickInfo;
        /**
         *
         */
        addSubMesh(indexCount: number, materialIndex?: number, randerMode?: gltf.MeshPrimitiveMode): number;
        /**
         *
         */
        getVertices(offset?: number, count?: number): Float32Array;
        /**
         *
         */
        getUVs(offset?: number, count?: number): Float32Array;
        /**
         *
         */
        getColors(offset?: number, count?: number): Float32Array;
        /**
         *
         */
        getNormals(offset?: number, count?: number): Float32Array;
        /**
         *
         */
        getTangents(offset?: number, count?: number): Float32Array;
        /**
         *
         */
        getAttributes(attributeType: gltf.MeshAttribute, offset?: number, count?: number): Uint8Array;
        /**
         *
         */
        setAttributes(attributeType: gltf.MeshAttribute, value: Readonly<ArrayLike<number>>, offset?: number, count?: number): Uint8Array;
        /**
         *
         */
        getIndices(subMeshIndex?: number): Uint16Array;
        /**
         *
         */
        setIndices(value: Readonly<ArrayLike<number>>, subMeshIndex?: number): Uint16Array;
        /**
         * 绑定显存。
         */
        abstract _createBuffer(): void;
        /**
         *
         */
        abstract uploadVertexBuffer(uploadAttributes?: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset?: number, count?: number): void;
        /**
         *
         */
        abstract uploadSubIndexBuffer(subMeshIndex: number): void;
        /**
         *
         */
        drawMode: gltf.DrawMode;
        /**
         * 获取子网格数量。
         */
        readonly subMeshCount: number;
        /**
         *
         */
        readonly vertexCount: number;
        /**
         *
         */
        readonly attributeNames: ReadonlyArray<string>;
        /**
         * 获取 glTFMesh 数据。
         */
        readonly glTFMesh: gltf.Mesh;
    }
}
declare namespace egret3d {
    /**
     * 纹理资源。
     */
    class Texture extends paper.Asset {
        dispose(): void;
        /**
         * @inheritDoc
         */
        caclByteLength(): number;
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
    /**
     *
     */
    interface IRectangle {
        x: number;
        y: number;
        w: number;
        h: number;
    }
    /**
     * 矩形可序列化对象
     */
    class Rectangle implements IRectangle, paper.ISerializable {
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
        serialize(): number[];
        deserialize(element: number[]): this;
    }
}
declare namespace paper.editor {
    abstract class BaseGeo {
        editorModel: EditorModel;
        geo: GameObject;
        private baseColor;
        canDrag: boolean;
        protected helpVec3_1: egret3d.Vector3;
        protected helpVec3_2: egret3d.Vector3;
        protected helpVec3_3: egret3d.Vector3;
        protected helpQuat_1: egret3d.Quaternion;
        protected helpQuat_2: egret3d.Quaternion;
        protected forward: egret3d.Vector3;
        protected up: egret3d.Vector3;
        protected right: egret3d.Vector3;
        protected _dragOffset: egret3d.Vector3;
        protected _delta: egret3d.Vector3;
        protected _newPosition: egret3d.Vector3;
        protected _ctrlPos: egret3d.Vector3;
        protected _ctrlRot: egret3d.Quaternion;
        protected _dragPlanePoint: egret3d.Vector3;
        protected _dragPlaneNormal: egret3d.Vector3;
        protected _initRotation: egret3d.Quaternion;
        protected _oldLocalScale: egret3d.Vector3;
        constructor();
        onSet(): void;
        abstract isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]): any;
        abstract wasPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]): any;
        abstract isPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[]): any;
        abstract wasPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[]): any;
        abstract wasReleased(selectedGameObj: GameObject[]): any;
        _checkIntersect(ray: egret3d.Ray): this;
        changeColor(color: string): void;
        protected _createAxis(color: egret3d.Vector4, type: number): GameObject;
    }
    class GeoContainer extends BaseGeo {
        private geos;
        private selectedGeo;
        constructor();
        onSet(): void;
        checkIntersect(ray: egret3d.Ray): BaseGeo;
        private clear();
        changeType(type: string): void;
        wasPressed_local(ray: egret3d.Ray, selected: any): any;
        isPressed_local(ray: egret3d.Ray, selected: any): void;
        wasPressed_world(ray: egret3d.Ray, selected: any): any;
        isPressed_world(ray: egret3d.Ray, selected: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    abstract class BaseState {
        editorModel: EditorModel;
        autoClear: boolean;
        batchIndex: number;
        private _isDone;
        data: any;
        undo(): boolean;
        redo(): boolean;
        isDone: boolean;
        dispatchEditorModelEvent(type: string, data?: any): void;
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper {
    /**
     *
     */
    class Clock extends SingletonComponent {
        maxFixedSubSteps: number;
        fixedDeltaTime: number;
        timeScale: number;
        private _frameCount;
        private _beginTime;
        private _lastTime;
        private _delayTime;
        private _unscaledTime;
        private _unscaledDeltaTime;
        /**
         * @internal
         */
        _fixedTime: number;
        initialize(): void;
        /**
         * @internal
         */
        update(time?: number): void;
        readonly frameCount: number;
        readonly time: number;
        readonly deltaTime: number;
        readonly unscaledTime: number;
        readonly unscaledDeltaTime: number;
    }
}
declare namespace paper {
    /**
     *
     */
    class ContactColliders extends SingletonComponent {
        /**
         *
         */
        readonly begin: any[];
        /**
         *
         */
        readonly stay: any[];
        /**
         *
         */
        readonly end: any[];
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Sphere implements paper.IRelease<Sphere>, paper.ISerializable {
        private static readonly _instances;
        /**
         *
         * @param center
         * @param radius
         */
        static create(center?: Readonly<IVector3>, radius?: number): Sphere;
        /**
         *
         */
        release(): this;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        readonly center: Vector3;
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number]>): this;
        clone(): Sphere;
        copy(value: Readonly<Sphere>): this;
        set(center: Readonly<IVector3>, radius: number): this;
        fromPoints(points: Readonly<ArrayLike<IVector3>>, center?: Readonly<IVector3>): this;
        contains(value: Readonly<IVector3 | Sphere>): boolean;
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
    class AABB implements paper.IRelease<AABB>, paper.ISerializable {
        private static readonly _instances;
        static create(minimum?: Readonly<IVector3> | null, maximum?: Readonly<IVector3> | null): AABB;
        release(): this;
        private _dirtyRadius;
        private _dirtyCenter;
        private _radius;
        private readonly _minimum;
        private readonly _maximum;
        private readonly _center;
        private constructor();
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number, number, number]>): this;
        clone(): AABB;
        copy(value: Readonly<AABB>): this;
        clear(): this;
        /**
         *
         */
        set(minimum?: Readonly<IVector3> | null, maximum?: Readonly<IVector3> | null): this;
        /**
         *
         */
        fromPoints(value: Readonly<ArrayLike<IVector3>>): this;
        applyMatrix4(matrix: Readonly<Matrix>, value?: Readonly<AABB>): this;
        /**
         *
         */
        add(value: Readonly<IVector3 | AABB>): this;
        /**
         *
         */
        offset(value: number | Readonly<IVector3>): this;
        /**
         * check contains vector
         * @param value a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否包含点
         * @param value 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        contains(value: Readonly<IVector3 | AABB>): boolean;
        readonly isEmpty: boolean;
        /**
         * Bounding sphere radius.
         */
        readonly boundingSphereRadius: number;
        /**
         *
         */
        readonly minimum: Readonly<Vector3>;
        /**
         *
         */
        readonly maximum: Readonly<Vector3>;
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
        readonly center: Readonly<Vector3>;
    }
    const helpAABBA: AABB;
}
declare namespace paper {
    /**
     *
     */
    const enum InterestType {
        /**
         *
         */
        Extends = 1,
        /**
         *
         */
        Exculde = 2,
        /**
         *
         */
        Unessential = 4,
    }
    /**
     * 关心组件的配置。
     */
    type InterestConfig = {
        /**
         * 关心的组件或组件列表。
         */
        componentClass: ComponentClass<BaseComponent>[] | ComponentClass<BaseComponent>;
        /**
         *
         */
        type?: InterestType;
        /**
         * 关心该组件的事件。
         */
        listeners?: {
            /**
             * 事件类型。
             */
            type: string;
            /**
             * 事件监听。
             */
            listener: (component: BaseComponent) => void;
        }[];
    };
    /**
     *
     */
    class Group {
        private static readonly _groups;
        /**
         * @internal
         */
        static create(interestConfig: ReadonlyArray<InterestConfig>): Group;
        /**
         * @internal
         */
        static update(): void;
        /**
         *
         */
        locked: boolean;
        readonly name: string;
        private _isRemoved;
        private readonly _isBehaviour;
        private readonly _bufferedGameObjects;
        /**
         * @internal
         */
        readonly _addedGameObjects: (GameObject | null)[];
        private _gameObjects;
        private readonly _bufferedComponents;
        /**
         * @internal
         */
        readonly _addedComponents: (BaseComponent | null)[];
        private _components;
        private readonly _interestConfig;
        private readonly _globalGameObject;
        private constructor();
        private _onAddComponent(component);
        private _onAddUnessentialComponent(component);
        private _onRemoveUnessentialComponent(component);
        private _onRemoveComponent(component);
        private _addGameObject(gameObject);
        private _removeGameObject(gameObject);
        private _update();
        /**
         * 判断实体是否被收集。
         */
        hasGameObject(gameObject: GameObject): boolean;
        /**
         *
         */
        readonly gameObjects: ReadonlyArray<GameObject>;
        /**
         *
         */
        readonly components: ReadonlyArray<BaseComponent>;
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
    class OBB {
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
        update(matrix: Readonly<Matrix>): void;
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
         * @param matrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算世界空间下各点坐标
         * @param vectors 结果数组
         * @param matrix 物体的世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclWorldVectors(vectors: ReadonlyArray<Vector3>, matrix: Readonly<Matrix>): void;
        deserialize(element: {
            center: [number, number, number];
            size: [number, number, number];
        }): this;
    }
}
declare namespace paper {
    /**
     * @internal
     */
    class EnableSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: any;
            type: number;
            isBehaviour: boolean;
        }[];
        onAddComponent(component: Behaviour): void;
    }
}
declare namespace paper {
    /**
     * @internal
     */
    class StartSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: any;
            type: number;
            isBehaviour: boolean;
        }[];
        onAddComponent(component: Behaviour): void;
    }
}
declare namespace paper {
    /**
     *
     */
    class UpdateSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: any;
            type: number;
            isBehaviour: boolean;
        }[];
        onUpdate(deltaTime: number): void;
    }
}
declare namespace paper {
    /**
     *
     */
    class LateUpdateSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: any;
            type: number;
            isBehaviour: boolean;
        }[];
        private readonly _laterCalls;
        onUpdate(deltaTime: number): void;
        /**
         *
         */
        callLater(callback: () => void): void;
    }
}
declare namespace paper {
    /**
     * @internal
     */
    class DisableSystem extends BaseSystem {
        protected readonly _interests: {
            componentClass: any;
            type: number;
            isBehaviour: boolean;
        }[];
        private readonly _bufferedComponents;
        private readonly _bufferedGameObjects;
        private readonly _contactColliders;
        onRemoveComponent(component: Behaviour): void;
        onUpdate(): void;
        /**
         * @internal
         */
        bufferComponent(component: BaseComponent): void;
        /**
         * @internal
         */
        bufferGameObject(gameObject: GameObject): void;
    }
}
declare namespace paper {
    /**
     * @internal
     */
    const serializeClassMap: {
        [key: string]: string;
    };
    /**
     * @internal
     */
    class Compatible implements ISerializable {
        serialize(): void;
        deserialize(element: ISerializedStruct, data?: Deserializer): BaseComponent | Asset | GameObject;
    }
}
declare namespace paper {
    /**
     *
     */
    class Deserializer {
        /**
         * @internal
         */
        static _lastDeserializer: Deserializer;
        /**
         *
         */
        readonly assets: string[];
        /**
         *
         */
        readonly objects: {
            [key: string]: Scene | GameObject;
        };
        /**
         *
         */
        readonly components: {
            [key: string]: BaseComponent;
        };
        private _keepUUID;
        private _makeLink;
        private readonly _deserializers;
        private _target;
        private _getDeserializedIgnoreKeys(serializedClass, keys?);
        private _deserializeObject(source, target);
        private _createComponent(componentSource, source?, target?);
        private _deserializeChild(source, target?);
        getAssetOrComponent(source: IUUID | IAssetReference): Asset | GameObject | BaseComponent;
        /**
         * @internal
         */
        deserialize<T extends (Scene | GameObject | BaseComponent)>(data: ISerializedData, keepUUID?: boolean, makeLink?: boolean, target?: Scene | GameObject | null): T | null;
    }
}
declare namespace paper {
    /**
     *
     */
    const DATA_VERSION: number;
    /**
     *
     */
    const DATA_VERSIONS: number[];
    /**
     *
     */
    function serialize(source: Scene | GameObject | BaseComponent, inline?: boolean): ISerializedData;
    /**
     *
     */
    function clone(object: GameObject): BaseComponent | Scene | GameObject;
    /**
     *
     */
    function equal(source: any, target: any): boolean;
    /**
     *
     */
    function serializeAsset(source: Asset): IAssetReference;
    /**
     * 创建指定对象的结构体。
     */
    function serializeStruct(source: BaseObject): ISerializedStruct;
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
     * @internal
     */
    class BeginSystem extends paper.BaseSystem {
        onAwake(): void;
        onUpdate(): void;
    }
}
declare namespace egret3d {
    /**
     * @internal
     */
    class EndSystem extends paper.BaseSystem {
        onUpdate(deltaTime: number): void;
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
        private _dirtyLocal;
        private _dirtyWorld;
        /**
         * 世界矩阵的行列式，如果小于0，说明进行了反转
         * @internal
         */
        _worldMatrixDeterminant: number;
        private readonly _localMatrix;
        private readonly _worldMatrix;
        private readonly localPosition;
        private readonly localRotation;
        private readonly _localEulerAngles;
        private readonly localScale;
        private readonly _position;
        private readonly _rotation;
        private readonly _eulerAngles;
        private readonly _scale;
        /**
         * @internal
         */
        readonly _children: Transform[];
        /**
         * @internal
         */
        _parent: Transform | null;
        private _removeFromChildren(value);
        private _dirtify(isLocalDirty);
        /**
         * 父节点发生改变的回调方法
         * 子类可通过重载此方法进行标脏状态传递
         */
        protected _onParentChange(newParent: Transform | null, oldParent: Transform | null): void;
        private _getAllChildren(children);
        /**
         * @internal
         */
        getAllChildren(): Transform[];
        /**
         * 设置父节点
         */
        setParent(newParent: Transform | null, worldPositionStays?: boolean): void;
        getChildIndex(value: Transform): number;
        setChildIndex(value: Transform, index: number): void;
        /**
         * 获取对象下标的子集对象
         * @param index
         */
        getChildAt(index: number): Transform;
        /**
         * Finds a child by name or path and returns it.
         * @param nameOrPath
         */
        find(nameOrPath: string): Transform;
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
        getLocalPosition(): Readonly<Vector3>;
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
        setLocalPosition(position: Readonly<IVector3>): void;
        setLocalPosition(x: number, y: number, z: number): void;
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
        getLocalRotation(): Readonly<Quaternion>;
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
        setLocalRotation(rotation: Readonly<IVector4>): void;
        setLocalRotation(x: number, y: number, z: number, w: number): void;
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
        getLocalEulerAngles(): Readonly<Vector3>;
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
        setLocalEulerAngles(euler: Readonly<IVector3>, eulerOrder?: EulerOrder): void;
        setLocalEulerAngles(x: number, y: number, z: number, eulerOrder?: EulerOrder): void;
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
        getLocalScale(): Readonly<Vector3>;
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
        setLocalScale(v: Readonly<IVector3>): void;
        setLocalScale(x: number, y: number, z: number): void;
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
        getLocalMatrix(): Readonly<Matrix>;
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
        getPosition(): Readonly<Vector3>;
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
        setPosition(position: IVector3): void;
        setPosition(x: number, y: number, z: number): void;
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
        getRotation(): Readonly<Quaternion>;
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
        setRotation(v: IVector4): void;
        setRotation(x: number, y: number, z: number, w: number): void;
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
        getEulerAngles(): Readonly<Vector3>;
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
        setEulerAngles(v: Readonly<IVector3>, eulerOrder?: EulerOrder): void;
        setEulerAngles(x: number, y: number, z: number, eulerOrder?: EulerOrder): void;
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
        getScale(): Readonly<Vector3>;
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
        setScale(v: IVector3): void;
        setScale(x: number, y: number, z: number): void;
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
        getWorldMatrix(): Readonly<Matrix>;
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
        getRight(out?: Vector3): Vector3;
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
        getUp(out?: Vector3): Vector3;
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
        getForward(out?: Vector3): Vector3;
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
        lookAt(target: Readonly<Transform> | Readonly<IVector3>, up?: Readonly<IVector3>): void;
        /**
         * 当前子集对象的数量
         */
        readonly childCount: number;
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
        readonly children: ReadonlyArray<Transform>;
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
}
declare namespace egret3d {
    /**
     *
     */
    class DefaultMeshes extends paper.SingletonComponent {
        static QUAD: Mesh;
        static QUAD_PARTICLE: Mesh;
        static PLANE: Mesh;
        static CIRCLE_LINE: Mesh;
        static CUBE: Mesh;
        static PYRAMID: Mesh;
        static CYLINDER: Mesh;
        static SPHERE: Mesh;
        initialize(): void;
    }
}
declare namespace egret3d {
    class DefaultTextures extends paper.SingletonComponent {
        /**
         *
         */
        static WHITE: Texture;
        /**
         *
         */
        static GRAY: Texture;
        /**
         *
         */
        static GRID: Texture;
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class DefaultShaders extends paper.SingletonComponent {
        static SHADOW_DEPTH: GLTFAsset;
        static SHADOW_DISTANCE: GLTFAsset;
        static LINE: GLTFAsset;
        static DIFFUSE: GLTFAsset;
        static DIFFUSE_TINT_COLOR: GLTFAsset;
        static DIFFUSE_BOTH_SIDE: GLTFAsset;
        static TRANSPARENT: GLTFAsset;
        static TRANSPARENT_ALPHACUT: GLTFAsset;
        static TRANSPARENT_TINTCOLOR: GLTFAsset;
        static TRANSPARENT_ADDITIVE: GLTFAsset;
        static TRANSPARENT_BOTH_SIDE: GLTFAsset;
        static TRANSPARENT_ADDITIVE_BOTH_SIDE: GLTFAsset;
        static LAMBERT: GLTFAsset;
        static GIZMOS_COLOR: GLTFAsset;
        static MATERIAL_COLOR: GLTFAsset;
        static VERT_COLOR: GLTFAsset;
        static PARTICLE: GLTFAsset;
        static PARTICLE_ADDITIVE: GLTFAsset;
        static PARTICLE_ADDITIVE_PREMYLTIPLY: GLTFAsset;
        static PARTICLE_BLEND: GLTFAsset;
        static PARTICLE_BLEND_PREMYLTIPLY: GLTFAsset;
        createBuildinShader(url: string, vertName: string, vertSource: string, fragName: string, fragSource: string, renderQueue: number): GLTFAsset;
        private _setBlend(technique, blend);
        private _setCullFace(technique, cull, frontFace?, cullFace?);
        private _setDepth(technique, zTest, zWrite);
        private _createColorShaderTemplate(url, renderQueue);
        private _createDiffuseShaderTemplate(url, renderQueue);
        private _createLambertShaderTemplate(url, renderQueue);
        private _createParticleShaderTemplate(url, renderQueue);
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class DefaultMaterials extends paper.SingletonComponent {
        static DefaultDiffuse: Material;
        static Missing: Material;
        static Line: Material;
        static ShadowDepth: Material;
        static ShadowDistance: Material;
        initialize(): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class CamerasAndLights extends paper.SingletonComponent {
        readonly cameras: Camera[];
        readonly lights: BaseLight[];
        private _sortCamera(a, b);
        updateCamera(gameObjects: ReadonlyArray<paper.GameObject>): void;
        updateLight(gameObjects: ReadonlyArray<paper.GameObject>): void;
        sort(): void;
    }
}
declare namespace egret3d {
    /**
     * @private
     * draw call type
     */
    type DrawCall = {
        renderer: paper.BaseRenderer;
        matrix?: Matrix;
        subMeshIndex: number;
        mesh: Mesh;
        material: Material;
        frustumTest: boolean;
        zdist: number;
        boneData?: Float32Array;
    };
    /**
     *
     */
    class DrawCalls extends paper.SingletonComponent {
        /**
         * 参与渲染的渲染器列表。
         */
        readonly renderers: paper.BaseRenderer[];
        /**
         * 所有的 draw call 列表。
         */
        readonly drawCalls: DrawCall[];
        /**
         * 非透明列表
         */
        readonly opaqueCalls: DrawCall[];
        /**
         * 透明列表
         */
        readonly transparentCalls: DrawCall[];
        /**
         * 阴影列表
         */
        readonly shadowCalls: DrawCall[];
        /**
         * 所有非透明的, 按照从近到远排序
         * @param a
         * @param b
         */
        private _sortOpaque(a, b);
        /**
         * 所有透明的，按照从远到近排序
         * @param a
         * @param b
         */
        private _sortFromFarToNear(a, b);
        shadowFrustumCulling(camera: Camera): void;
        sortAfterFrustumCulling(camera: Camera): void;
        /**
         * 移除指定渲染器的 draw call 列表。
         * @param renderer
         */
        removeDrawCalls(renderer: paper.BaseRenderer): void;
        /**
         * 指定渲染器是否生成了 draw call 列表。
         * @param renderer
         */
        hasDrawCalls(renderer: paper.BaseRenderer): boolean;
    }
}
declare namespace egret3d {
    /**
     * Camera系统
     */
    class CameraSystem extends paper.BaseSystem {
        protected readonly _interests: ({
            componentClass: typeof Camera;
        }[] | {
            componentClass: typeof DirectLight[];
        }[])[];
        protected readonly _camerasAndLights: CamerasAndLights;
        onAddGameObject(_gameObject: paper.GameObject, group: paper.Group): void;
        onRemoveGameObject(_gameObject: paper.GameObject, group: paper.Group): void;
        onUpdate(deltaTime: number): void;
    }
}
declare namespace egret3d {
    /**
     * 相机组件
     */
    class Camera extends paper.BaseComponent {
        /**
         * 当前主相机。
         */
        static readonly main: Camera;
        /**
         * 是否清除颜色缓冲区
         */
        clearOption_Color: boolean;
        /**
         * 是否清除深度缓冲区
         */
        clearOption_Depth: boolean;
        /**
         * 相机的渲染剔除，对应GameObject的层级
         */
        cullingMask: paper.CullingMask;
        /**
         * 相机渲染排序
         */
        order: number;
        /**
         * 透视投影的fov
         */
        fov: number;
        /**
         * 正交投影的竖向size
         */
        size: number;
        /**
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         */
        opvalue: number;
        /**
         * 背景色
         */
        readonly backgroundColor: Color;
        /**
         * 相机视窗
         */
        readonly viewport: Rectangle;
        /**
         * TODO 功能完善后开放此接口
         */
        readonly postQueues: ICameraPostQueue[];
        /**
         * 相机渲染上下文
         */
        context: RenderContext;
        /**
         * 渲染目标，如果为null，则为画布
         */
        renderTarget: IRenderTarget | null;
        private _near;
        private _far;
        private readonly matProjP;
        private readonly matProjO;
        private readonly frameVecs;
        /**
         * 计算相机视锥区域
         */
        private calcCameraFrame();
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
         * 计算相机视口像素rect
         */
        calcViewPortPixel(viewPortPixel: IRectangle): void;
        /**
         * 由屏幕坐标发射射线
         */
        createRayByScreen(screenPosX: number, screenPosY: number): Ray;
        /**
         * 由屏幕坐标得到世界坐标
         */
        calcWorldPosFromScreenPos(screenPos: Vector3, outWorldPos: Vector3): void;
        /**
         * 由世界坐标得到屏幕坐标
         */
        calcScreenPosFromWorldPos(worldPos: Vector3, outScreenPos: Vector2): void;
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: Vector2, z: number, out: Vector2): void;
        private _intersectPlane(boundingSphere, v0, v1, v2);
        testFrustumCulling(node: paper.BaseRenderer): boolean;
        /**
         * 相机到近裁剪面距离
         */
        near: number;
        /**
         * 相机到远裁剪面距离
         */
        far: number;
    }
}
declare namespace egret3d {
    interface ICameraPostQueue {
        renderTarget: GlRenderTarget;
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
    }
    class CameraPostQueueDepth implements ICameraPostQueue {
        renderTarget: GlRenderTarget;
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
    }
    /**
     * 颜色绘制通道
     *
     */
    class CameraPostQueueColor implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        renderTarget: GlRenderTarget;
        /**
         * @inheritDoc
         */
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
    }
}
declare namespace egret3d {
    /**
     * 缓存场景通用数据
     * 包括矩阵信息，灯光，光照贴图，viewport尺寸等等
     */
    class RenderContext {
        /**
         *
         */
        version: number;
        /**
         *
         */
        lightCount: number;
        directLightCount: number;
        pointLightCount: number;
        spotLightCount: number;
        shaderContextDefine: string;
        /**
         *
         */
        lightmap: Texture | null;
        lightmapUV: number;
        lightmapIntensity: number;
        lightmapOffset: Float32Array | null;
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
        readonly viewPortPixel: IRectangle;
        readonly cameraPosition: Float32Array;
        readonly cameraForward: Float32Array;
        readonly cameraUp: Float32Array;
        readonly matrix_v: Matrix;
        readonly matrix_p: Matrix;
        readonly matrix_mv: Matrix;
        readonly matrix_vp: Matrix;
        updateLightmap(texture: Texture, uv: number, offset: Float32Array, intensity: number): void;
        updateCamera(camera: Camera, matrix: Matrix): void;
        updateLights(lights: ReadonlyArray<BaseLight>): void;
        updateModel(matrix: Matrix): void;
        updateBones(data: Float32Array | null): void;
        readonly lightPosition: Float32Array;
        lightShadowCameraNear: number;
        lightShadowCameraFar: number;
        updateLightDepth(light: BaseLight): void;
        update(drawCall: DrawCall): void;
    }
}
declare namespace egret3d {
    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    class Egret2DRenderer extends paper.BaseRenderer {
        private renderer;
        /**
         * 是否使用视锥剔除
         */
        frustumTest: boolean;
        stage: egret.Stage;
        private _screenAdapter;
        screenAdapter: IScreenAdapter;
        root: egret.DisplayObjectContainer;
        initialize(): void;
        uninitialize(): void;
        recalculateAABB(): void;
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
    class Egret2DRendererSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof Egret2DRenderer;
        }[];
        onUpdate(deltaTime: number): void;
    }
}
declare module egret.web {
    /**
     * @internal
     */
    class Renderer {
        private context;
        private static _instance;
        static getInstance(context: WebGLRenderingContext): Renderer;
        private projectionX;
        private projectionY;
        private drawCmdManager;
        private vao;
        private vertexBuffer;
        private indexBuffer;
        private egretWebGLRenderContext;
        private constructor();
        beforeRender(): void;
        /**
         * @internal
         */
        _activatedBuffer: WebGLRenderBuffer;
        $drawWebGL(): void;
        /**
         * 执行绘制命令
         */
        private drawData(data, offset);
        private currentProgram;
        private activeProgram(gl, program);
        private syncUniforms(program, filter, data);
        /**
         * 画texture
         **/
        private drawTextureElements(data, offset);
        private bindIndices;
        /**
         * 启用RenderBuffer
         */
        private activateBuffer(buffer, width, height);
        onResize(width: number, height: number): void;
        /**
         * 上传顶点数据
         */
        private uploadVerticesArray(array);
        /**
         * 上传索引数据
         */
        private uploadIndicesArray(array);
        /**
         * 画push mask
         **/
        private drawPushMaskElements(data, offset);
        /**
         * 画pop mask
         **/
        private drawPopMaskElements(data, offset);
        /**
         * 设置混色
         */
        private setBlendMode(value);
        static blendModesForGL: any;
        static initBlendMode(): void;
    }
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
declare namespace paper {
    /**
     * 场景类
     */
    class Scene extends BaseObject {
        /**
         *
         */
        static createEmpty(name?: string, isActive?: boolean): Scene;
        /**
         *
         */
        static create(name: string, combineStaticObjects?: boolean): Scene;
        /**
         * lightmap强度
         */
        lightmapIntensity: number;
        /**
         * 场景名称。
         */
        readonly name: string;
        /**
         * 场景的light map列表。
         */
        readonly lightmaps: egret3d.Texture[];
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        extras?: any;
        /**
         * @internal
         */
        readonly _gameObjects: GameObject[];
        private constructor();
        /**
         * @internal
         */
        _addGameObject(gameObject: GameObject): void;
        /**
         * @internal
         */
        _removeGameObject(gameObject: GameObject): void;
        /**
         *
         */
        destroy(): void;
        /**
         *
         */
        find(name: string): GameObject;
        /**
         *
         */
        findWithTag(tag: string): GameObject;
        /**
         *
         */
        findGameObjectsWithTag(tag: string): GameObject[];
        /**
         * @internal
         */
        findWithUUID(uuid: string): GameObject;
        /**
         * 所有根实体。
         */
        getRootGameObjects(): GameObject[];
        /**
         *
         */
        readonly gameObjectCount: number;
        /**
         * 所有实体。
         */
        readonly gameObjects: ReadonlyArray<GameObject>;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class DirectLight extends BaseLight {
        readonly type: LightType;
        renderTarget: IRenderTarget;
        update(camera: Camera, faceIndex: number): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class PointLight extends BaseLight {
        readonly type: LightType;
        renderTarget: IRenderTarget;
        update(camera: Camera, faceIndex: number): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class SpotLight extends BaseLight {
        readonly type: LightType;
        update(camera: Camera, faceIndex: number): void;
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
        uninitialize(): void;
        /**
         * 组件挂载的 mesh 模型
         */
        mesh: Mesh | null;
    }
}
declare namespace egret3d {
    /**
     * mesh的渲染组件
     */
    class MeshRenderer extends paper.BaseRenderer {
        private readonly _materials;
        uninitialize(): void;
        recalculateAABB(): void;
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
    class MeshRendererSystem extends paper.BaseSystem {
        protected readonly _interests: ({
            componentClass: typeof MeshFilter;
            listeners: {
                type: MeshFilterEventType;
                listener: (component: MeshFilter) => void;
            }[];
        } | {
            componentClass: typeof MeshRenderer;
            listeners: {
                type: paper.RendererEventType;
                listener: (component: MeshRenderer) => void;
            }[];
        })[];
        private readonly _drawCalls;
        private _updateDrawCalls(gameObject);
        onEnable(): void;
        onAddGameObject(gameObject: paper.GameObject): void;
        onRemoveGameObject(gameObject: paper.GameObject): void;
        onDisable(): void;
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
    class SkinnedMeshRenderer extends paper.BaseRenderer {
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
        private _joints;
        private _weights;
        private _getMatByIndex(index, out);
        initialize(): void;
        uninitialize(): void;
        recalculateAABB(): void;
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
     * TODO 需要完善
     */
    class SkinnedMeshRendererSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof SkinnedMeshRenderer;
            listeners: {
                type: SkinnedMeshRendererEventType;
                listener: (component: SkinnedMeshRenderer) => void;
            }[];
        }[];
        private readonly _drawCalls;
        private _updateDrawCalls(gameObject);
        onEnable(): void;
        onAddGameObject(gameObject: paper.GameObject): void;
        onRemoveGameObject(gameObject: paper.GameObject): void;
        onUpdate(): void;
        onDisable(): void;
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
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         * @internal
         */
        _fadeState: number;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         * @internal
         */
        _subFadeState: number;
        /**
         * 累计权重。
         * @internal
         */
        _globalWeight: number;
        /**
         * 融合进度。
         * @internal
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
         * 起始帧。
         */
        private _frameStart;
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
         * @internal
         */
        _addToSystem: boolean;
        /**
         * 动画数据列表。
         */
        private readonly _animations;
        /**
         * 骨骼姿势列表。
         * @internal
         */
        readonly _boneBlendLayers: BoneBlendLayer[];
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes;
        /**
         * @internal
         */
        readonly _animationNames: string[];
        private _fadeInParamter;
        /**
         * 最后一个播放的动画状态。
         * 当进行动画混合时，该值通常没有任何意义。
         */
        private _lastAnimationState;
        /**
         * @internal
         */
        _skinnedMeshRenderer: SkinnedMeshRenderer | null;
        /**
         * @internal
         */
        _dispatchEvent(type: string, animationState: AnimationState, eventObject?: any): void;
        /**
         *
         */
        update(globalTime: number): void;
        fadeIn(animationName: string | null, fadeTime: number, playTimes?: number, layer?: number, additive?: boolean): AnimationState | null;
        play(animationNameOrNames?: string | string[] | null, playTimes?: number): AnimationState | null;
        readonly lastAnimationnName: string;
        /**
         * 动画数据列表。
         */
        animations: ReadonlyArray<GLTFAsset>;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class AnimationSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof Animation;
        }[];
        onAddComponent(component: Animation): void;
        onUpdate(): void;
        onRemoveComponent(component: Animation): void;
    }
}
declare namespace egret3d.particle {
    /**
    * @internal
    */
    function createBatchMesh(renderer: ParticleRenderer, maxParticleCount: number): Mesh;
    /**
     * @internal
     */
    function generatePositionAndDirection(position: Vector3, direction: Vector3, shape: ShapeModule): void;
}
declare namespace paper {
    /**
     *
     */
    type GameObjectExtras = {
        linkedID?: string;
        rootID?: string;
        prefab?: Prefab;
    };
    /**
     * 可以挂载Component的实体类。
     */
    class GameObject extends BaseObject {
        /**
         * 创建 GameObject，并添加到当前场景中。
         */
        static create(name?: string, tag?: string, scene?: Scene | null): GameObject;
        /**
         * 是否是静态，启用这个属性可以提升性能
         */
        isStatic: boolean;
        /**
         *
         */
        hideFlags: HideFlags;
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
         *
         */
        renderer: BaseRenderer | null;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        extras?: GameObjectExtras;
        private _activeSelf;
        /**
         * @internal
         */
        _activeInHierarchy: boolean;
        /**
         * @internal
         */
        _activeDirty: boolean;
        private readonly _components;
        private readonly _cachedComponents;
        private _scene;
        /**
         * @deprecated
         */
        constructor(name?: string, tag?: string, scene?: Scene | null);
        private _destroy();
        private _addToScene(value);
        private _canRemoveComponent(value);
        private _removeComponent(value, groupComponent);
        private _getComponentsInChildren(componentClass, child, components, isExtends?);
        private _getComponent(componentClass);
        /**
         * @internal
         */
        _activeInHierarchyDirty(prevActive: boolean): void;
        /**
         *
         */
        destroy(): void;
        /**
         *
         */
        destroyChildren(): void;
        /**
         * 添加组件。
         */
        addComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, config?: any): T;
        /**
         * 移除组件。
         */
        removeComponent<T extends BaseComponent>(componentInstanceOrClass: ComponentClass<T> | T, isExtends?: boolean): void;
        /**
         * 移除所有组件。
         */
        removeAllComponents<T extends BaseComponent>(componentClass?: ComponentClass<T>, isExtends?: boolean): void;
        /**
         * 获取组件。
         */
        getComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends?: boolean): T;
        /**
         *
         */
        getComponents<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends?: boolean): T[];
        /**
         * 搜索自己和父节点中所有特定类型的组件
         */
        getComponentInParent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends?: boolean): T;
        /**
         * 搜索自己和子节点中所有特定类型的组件
         */
        getComponentsInChildren<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends?: boolean): T[];
        /**
         * 获取组件，如果未添加该组件，则添加该组件。
         */
        getOrAddComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends?: boolean): T;
        /**
         * 针对同级的组件发送消息
         * @param methodName
         * @param parameter``
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
         *
         */
        readonly isDestroyed: boolean;
        /**
         *
         */
        dontDestroy: boolean;
        /**
         * 当前GameObject对象自身激活状态
         */
        activeSelf: boolean;
        /**
         * 获取当前GameObject对象在场景中激活状态。
         * 如果当前对象父级的activeSelf为false，那么当前GameObject对象在场景中为禁用状态。
         */
        readonly activeInHierarchy: boolean;
        readonly path: string;
        /**
         *
         */
        readonly components: ReadonlyArray<BaseComponent>;
        /**
         *
         */
        parent: GameObject | null;
        /**
         * 获取物体所在场景实例。
         */
        readonly scene: Scene;
        /**
         * @deprecated
         * @see paper.Scene#find()
         */
        static find(name: string, scene?: Scene | null): GameObject;
        /**
         * @deprecated
         * @see paper.Scene#findWithTag()
         */
        static findWithTag(tag: string, scene?: Scene | null): GameObject;
        /**
         * @deprecated
         * @see paper.Scene#findGameObjectsWithTag()
         */
        static findGameObjectsWithTag(tag: string, scene?: Scene | null): GameObject[];
    }
}
declare namespace egret3d.particle {
    /**
     * @internal
     */
    class ParticleBatcher {
        private _dirty;
        private _time;
        private _emittsionTime;
        private _frameRateTime;
        private _firstAliveCursor;
        private _lastFrameFirstCursor;
        private _lastAliveCursor;
        private _vertexStride;
        private _burstIndex;
        private _finalGravity;
        private _vertexAttributes;
        private _startPositionBuffer;
        private _startVelocityBuffer;
        private _startColorBuffer;
        private _startSizeBuffer;
        private _startRotationBuffer;
        private _startTimeBuffer;
        private _random0Buffer;
        private _random1Buffer;
        private _worldPostionBuffer;
        private _worldRoationBuffer;
        private _worldPostionCache;
        private _worldRotationCache;
        private _comp;
        private _renderer;
        /**
        * 计算粒子爆发数量
        * @param startTime
        * @param endTime
        */
        private _getBurstCount(startTime, endTime);
        /**
         * 判断粒子是否已经过期
         * @param particleIndex
         */
        private _isParticleExpired(particleIndex);
        /**
         *
         * @param time 批量增加粒子
         * @param startCursor
         * @param endCursor
         */
        private _addParticles(time, startCursor, count);
        private _tryEmit(time);
        clean(): void;
        resetTime(): void;
        init(comp: ParticleComponent, renderer: ParticleRenderer): void;
        update(elapsedTime: number): void;
        private _updateEmission(elapsedTime);
        private _updateRender();
        readonly aliveParticleCount: number;
    }
}
declare namespace egret3d.particle {
    const enum ParticleCompEventType {
        MainChanged = "mainChanged",
        ColorChanged = "colorChanged",
        VelocityChanged = "velocityChanged",
        SizeChanged = "sizeChanged",
        RotationChanged = "rotationChanged",
        TextureSheetChanged = "textureSheetChanged",
        ShapeChanged = "shapeChanged",
        StartRotation3DChanged = "rotation3DChanged",
        SimulationSpaceChanged = "simulationSpace",
        ScaleModeChanged = "scaleMode",
        MaxParticlesChanged = "maxParticles",
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
        /**
         * @internal
         */
        _isPlaying: boolean;
        /**
         * @internal
         */
        _isPaused: boolean;
        private readonly _batcher;
        /**
         * @internal
         */
        _clean(): void;
        /**
         * @internal
         */
        uninitialize(): void;
        /**
         * @internal
         */
        initialize(): void;
        /**
         * @internal
         */
        initBatcher(): void;
        /**
         * @internal
         */
        update(elapsedTime: number): void;
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
declare namespace egret3d.particle {
    const enum ParticleRendererEventType {
        Mesh = "mesh",
        Materials = "materials",
        RenderMode = "renderMode",
        LengthScaleChanged = "lengthScale",
        VelocityScaleChanged = "velocityScale",
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
     * 粒子着色器用到的变量
     */
    const enum ParticleMaterialUniform {
        WORLD_POSITION = "u_worldPosition",
        WORLD_ROTATION = "u_worldRotation",
        POSITION_SCALE = "u_positionScale",
        SIZE_SCALE = "u_sizeScale",
        SCALING_MODE = "u_scalingMode",
        GRAVIT = "u_gravity",
        START_ROTATION3D = "u_startRotation3D",
        SIMULATION_SPACE = "u_simulationSpace",
        CURRENTTIME = "u_currentTime",
        ALPHAS_GRADIENT = "u_alphaGradient[0]",
        COLOR_GRADIENT = "u_colorGradient[0]",
        ALPHA_GRADIENT_MAX = "u_alphaGradientMax[0]",
        COLOR_GRADIENT_MAX = "u_colorGradientMax[0]",
        VELOCITY_CONST = "u_velocityConst",
        VELOCITY_CURVE_X = "u_velocityCurveX[0]",
        VELOCITY_CURVE_Y = "u_velocityCurveY[0]",
        VELOCITY_CURVE_Z = "u_velocityCurveZ[0]",
        VELOCITY_CONST_MAX = "u_velocityConstMax",
        VELOCITY_CURVE_MAX_X = "u_velocityCurveMaxX[0]",
        VELOCITY_CURVE_MAX_Y = "u_velocityCurveMaxY[0]",
        VELOCITY_CURVE_MAX_Z = "u_velocityCurveMaxZ[0]",
        SPACE_TYPE = "u_spaceType",
        SIZE_CURVE = "u_sizeCurve[0]",
        SIZE_CURVE_X = "u_sizeCurveX[0]",
        SIZE_CURVE_Y = "u_sizeCurveY[0]",
        SIZE_CURVE_Z = "u_sizeCurveZ[0]",
        SIZE_CURVE_MAX = "u_sizeCurveMax[0]",
        SIZE_CURVE_MAX_X = "u_sizeCurveMaxX[0]",
        SIZE_CURVE_MAX_Y = "u_sizeCurveMaxY[0]",
        SIZE_CURVE_MAX_Z = "u_sizeCurveMaxZ[0]",
        ROTATION_CONST = "u_rotationConst",
        ROTATION_CONST_SEPRARATE = "u_rotationConstSeprarate",
        ROTATION_CURVE = "u_rotationCurve[0]",
        ROTATE_CURVE_X = "u_rotationCurveX[0]",
        ROTATE_CURVE_y = "u_rotationCurveY[0]",
        ROTATE_CURVE_Z = "u_rotationCurveZ[0]",
        ROTATE_CURVE_W = "u_rotationCurveW[0]",
        ROTATION_CONST_MAX = "u_rotationConstMax",
        ROTATION_CONST_MAX_SEPRARATE = "u_rotationConstMaxSeprarate",
        ROTATION_CURVE_MAX = "u_rotationCurveMax[0]",
        ROTATION_CURVE_MAX_X = "u_rotationCurveMaxX[0]",
        ROTATION_CURVE_MAX_Y = "u_rotationCurveMaxY[0]",
        ROTATION_CURVE_MAX_Z = "u_rotationCurveMaxZ[0]",
        ROTATION_CURVE_MAX_W = "u_rotationCurveMaxW[0]",
        CYCLES = "u_cycles",
        SUB_UV = "u_subUV",
        UV_CURVE = "u_uvCurve[0]",
        UV_CURVE_MAX = "u_uvCurveMax[0]",
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
     *
     */
    class ParticleRenderer extends paper.BaseRenderer {
        private _mesh;
        private readonly _materials;
        velocityScale: number;
        _renderMode: ParticleRenderMode;
        lengthScale: number;
        /**
         * @internal
         */
        batchMesh: Mesh;
        /**
         * @internal
         */
        batchMaterial: Material;
        uninitialize(): void;
        recalculateAABB(): void;
        renderMode: ParticleRenderMode;
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
    }
}
declare namespace egret3d.particle {
    /**
     *
     */
    class ParticleSystem extends paper.BaseSystem {
        protected readonly _interests: ({
            componentClass: typeof ParticleComponent;
            listeners: {
                type: ParticleCompEventType;
                listener: any;
            }[];
        } | {
            componentClass: typeof ParticleRenderer;
            listeners: {
                type: ParticleRendererEventType;
                listener: (comp: ParticleRenderer) => void;
            }[];
        })[];
        private readonly _drawCalls;
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp);
        private _onRenderUpdate(render, type);
        /**
         *
         * @param render 渲染模式改变
         */
        private _onRenderMode(render);
        private _onMainUpdate(component, type);
        /**
         * 更新速率模块
         * @param component
         */
        private _onShapeChanged(comp);
        /**
         * 更新速率模块
         * @param component
         */
        private _onVelocityOverLifetime(comp);
        /**
         * 更新颜色模块
         * @param component
         */
        private _onColorOverLifetime(comp);
        /**
         * 更新大小模块
         * @param component
         */
        private _onSizeOverLifetime(comp);
        /**
         * 更新旋转模块
         * @param comp
         */
        private _onRotationOverLifetime(comp);
        private _onTextureSheetAnimation(comp);
        private _updateDrawCalls(gameObject);
        onEnable(): void;
        onAddGameObject(gameObject: paper.GameObject, _group: paper.Group): void;
        onRemoveGameObject(gameObject: paper.GameObject): void;
        onUpdate(deltaTime: number): void;
        onDisable(): void;
    }
}
declare namespace egret3d {
    class Audio extends paper.BaseComponent {
    }
}
declare namespace egret3d {
    /**
     * WebGL窗口信息
     */
    class Stage3D {
        screenViewport: Readonly<IRectangle>;
        absolutePosition: Readonly<IRectangle>;
        private _canvas;
        /**
         * 是否为横屏，需要旋转屏幕
         */
        private isLandscape;
        private contentWidth;
        private contentHeight;
        /**
         * @internal
         */
        init(canvas: HTMLCanvasElement, options: RequiredRuntimeOptions): void;
        private _resizeDirty;
        update(): void;
        private _resize();
    }
    const stage: Stage3D;
}
declare namespace egret3d {
    class WebGLCapabilities extends paper.SingletonComponent {
        static webgl: WebGLRenderingContext;
        static commonDefines: string;
        webgl: WebGLRenderingContext;
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
        initialize(): void;
    }
    /**
     * @internal
     */
    class WebGLRenderState extends paper.SingletonComponent {
        private readonly programMap;
        private readonly vsShaderMap;
        private readonly fsShaderMap;
        private readonly _stateEnables;
        private readonly _cacheStateEnable;
        private _cacheProgram;
        private _cacheState;
        private _getWebGLProgram(gl, vs, fs, defines);
        clearState(): void;
        updateState(state: gltf.States): void;
        useProgram(program: GlProgram): boolean;
        getProgram(material: Material, technique: gltf.Technique, defines: string): GlProgram;
        /**
         * 设置render target与viewport
         * @param target render target
         *
         */
        targetAndViewport(viewport: Rectangle, target: IRenderTarget | null): void;
        /**
         * 清除缓存
         * @param camera
         */
        cleanBuffer(clearOptColor: boolean, clearOptDepath: boolean, clearColor: Color): void;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Plane implements paper.IRelease<Plane>, paper.ISerializable {
        private static readonly _instances;
        /**
         *
         */
        static create(normal?: Readonly<IVector3>, constant?: number): Plane;
        release(): this;
        /**
         *
         */
        constant: number;
        /**
         *
         */
        readonly normal: Vector3;
        private constructor();
        serialize(): number[];
        deserialize(value: Readonly<[number, number, number, number]>): this;
        clone(): Plane;
        copy(value: Readonly<Plane>): this;
        set(normal: Readonly<IVector3>, constant: number): this;
        fromPoint(value: Readonly<IVector3>, normal?: Readonly<IVector3>): this;
        fromPoints(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>, valueC: Readonly<IVector3>): this;
        getDistance(value: Readonly<IVector3>): number;
        normalize(value?: Readonly<Plane>): this;
        negate(value?: Readonly<Plane>): this;
    }
}
declare namespace egret3d {
    /**
     *
     */
    class Triangle implements paper.IRelease<Triangle>, paper.ISerializable {
        private static readonly _instances;
        static create(a?: Readonly<IVector3>, b?: Readonly<IVector3>, c?: Readonly<IVector3>): Triangle;
        release(): this;
        readonly a: Vector3;
        readonly b: Vector3;
        readonly c: Vector3;
        private constructor();
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number, number, number, number, number, number]>): void;
        copy(value: Readonly<Triangle>): this;
        clone(): Triangle;
        set(a?: Readonly<IVector3>, b?: Readonly<IVector3>, c?: Readonly<IVector3>): this;
        fromArray(value: Readonly<ArrayLike<number>>, offsetA?: number, offsetB?: number, offsetC?: number): void;
        getCenter(value: Vector3): Vector3;
        getNormal(value: Vector3): Vector3;
        getArea(): number;
    }
}
declare namespace paper {
    /**
     * 组件事件。
     */
    namespace EventPool {
        /**
         * @internal
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
        function addEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>, callback: EventListener<T>): void;
        /**
         * 移除事件监听
         */
        function removeEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>, callback: EventListener<T>): void;
        /**
         * 移除所有该类型的事件监听
         */
        function removeAllEventListener<T extends BaseComponent>(eventType: string, componentClass: ComponentClass<T>): void;
        /**
         * 发送组件事件:
         * @param type event type:
         * @param component component
         */
        function dispatchEvent<T extends BaseComponent>(type: string, component: T, extend?: any): void;
    }
}
declare type int = number;
declare type uint = number;
declare namespace paper {
    /**
     *
     */
    let Time: Clock;
    /**
     *
     */
    let Application: ECS;
    /**
     *
     */
    class ECS {
        private static _instance;
        /**
         *
         */
        static getInstance(): ECS;
        private constructor();
        /**
         *
         */
        readonly version: string;
        /**
         * 系统管理器。
         */
        readonly systemManager: SystemManager;
        /**
         * 场景管理器。
         */
        readonly sceneManager: SceneManager;
        private _isEditor;
        private _isFocused;
        private _isPlaying;
        private _isRunning;
        private _bindUpdate;
        _option: egret3d.RequiredRuntimeOptions;
        _canvas: HTMLCanvasElement;
        _webgl: WebGLRenderingContext;
        private _update();
        init({isEditor, isPlaying, systems, option, canvas, webgl}?: {
            isEditor?: boolean;
            isPlaying?: boolean;
            systems?: (new () => BaseSystem)[];
            option?: {};
            canvas?: {};
            webgl?: {};
        }): void;
        /**
         *
         */
        pause(): void;
        resume(): void;
        callLater(callback: () => void): void;
        readonly isEditor: boolean;
        readonly isFocused: boolean;
        readonly isPlaying: boolean;
        readonly isRunning: boolean;
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
    * 材质资源
    */
    class Material extends GLTFAsset {
        /**
         *
         */
        renderQueue: RenderQueue | number;
        /**
          * @internal
          */
        _id: number;
        /**
          * @internal
          */
        _version: number;
        private _cacheDefines;
        private _textureRef;
        private readonly _defines;
        /**
        * @internal
        */
        _glTFMaterial: GLTFMaterial | null;
        /**
        * @internal
        */
        _glTFTechnique: gltf.Technique;
        /**
         * @internal
         */
        _glTFShader: GLTFAsset;
        constructor(shader: GLTFAsset);
        dispose(): void;
        /**
         * 克隆材质资源。
         */
        clone(): Material;
        initialize(): void;
        addDefine(key: string): void;
        removeDefine(key: string): void;
        setBoolean(id: string, value: boolean): void;
        setInt(id: string, value: number): void;
        setIntv(id: string, value: Float32Array): void;
        setFloat(id: string, value: number): void;
        setFloatv(id: string, value: Float32Array): void;
        setVector2(id: string, value: Vector2): void;
        setVector2v(id: string, value: Float32Array): void;
        setVector3(id: string, value: Vector3): void;
        setVector3v(id: string, value: Float32Array): void;
        setVector4(id: string, value: Vector4): void;
        setVector4v(id: string, value: Float32Array | [number, number, number, number]): void;
        setMatrix(id: string, value: Matrix): void;
        setMatrixv(id: string, value: Float32Array): void;
        setTexture(id: string, value: egret3d.Texture): void;
        /**
         * @internal
         */
        readonly shaderDefine: string;
    }
}
declare namespace egret3d.ShaderLib {
    const alphaBlend_frag = "\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _TintColor;\nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main()\n{   \n gl_FragColor=texture2D(_MainTex,xlv_TEXCOORD0)*_TintColor*2.0;\n    gl_FragColor.a = clamp(gl_FragColor.a, 0.0, 1.0);\n}";
    const bonelambert_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec3 _glesNormal; \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;             \nattribute vec4 _glesMultiTexCoord0;    \n\nuniform mat4 glstate_matrix_mvp;      \nuniform mat4 glstate_matrix_model;\n\nuniform highp vec4 glstate_vec4_bones[110];\nuniform highp vec4 _MainTex_ST; \n\n#include <shadowMap_pars_vert>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#include <transpose>\n#include <inverse>\n\nmat4 buildMat4(int index)\n{\n vec4 quat = glstate_vec4_bones[index * 2 + 0];\n vec4 translation = glstate_vec4_bones[index * 2 + 1];\n float xy2 = 2.0 * quat.x * quat.y;\n float xz2 = 2.0 * quat.x * quat.z;\n float xw2 = 2.0 * quat.x * quat.w;\n float yz2 = 2.0 * quat.y * quat.z;\n float yw2 = 2.0 * quat.y * quat.w;\n float zw2 = 2.0 * quat.z * quat.w;\n float xx = quat.x * quat.x;\n float yy = quat.y * quat.y;\n float zz = quat.z * quat.z;\n float ww = quat.w * quat.w;\n mat4 matrix = mat4(\n xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,\n xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,\n xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,\n translation.x, translation.y, translation.z, 1);\n return matrix;\n}\n\nhighp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)\n{\n int i = int(blendIndex.x);  \n    int i2 =int(blendIndex.y);\n int i3 =int(blendIndex.z);\n int i4 =int(blendIndex.w);\n \n    mat4 mat = buildMat4(i)*blendWeight.x \n    + buildMat4(i2)*blendWeight.y \n    + buildMat4(i3)*blendWeight.z \n    + buildMat4(i4)*blendWeight.w;\n return mat* srcVertex;\n}\n\nvoid main() {   \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz;                            \n\n    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(_glesNormal, 1.0)).xyz;\n    xlv_NORMAL = normal;\n    #ifdef FLIP_SIDED\n     xlv_NORMAL = - xlv_NORMAL;\n    #endif\n\n    vec3 worldpos = (glstate_matrix_model * tmpvar_1).xyz;\n    xlv_POS = worldpos; \n\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n\n    #include <shadowMap_vert>\n     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const code2_frag = "#include <common>\nvoid main() {\n    gl_FragData[0] = vec4(1.0, 1.0, 1.0, 1.0);\n}";
    const code_frag = "#include <common>\nuniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() {\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    prev_2 = tmpvar_3;\n    mediump vec4 tmpvar_4;\n    tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    col_1 = tmpvar_4;\n    col_1.x =xlv_TEXCOORD0.x;\n    col_1.y =xlv_TEXCOORD0.y;\n    gl_FragData[0] = col_1;\n}";
    const code_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesColor;             \nattribute vec4 _glesMultiTexCoord0;    \nuniform highp mat4 glstate_matrix_mvp; \nvarying lowp vec4 xlv_COLOR;           \nvarying highp vec2 xlv_TEXCOORD0;      \nvoid main() {                                          \n    highp vec4 tmpvar_1;                   \n    tmpvar_1.w = 1.0;                      \n    tmpvar_1.xyz = _glesVertex.xyz;        \n    xlv_COLOR = _glesColor;                \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const depthpackage_frag = "#include <common>\n#include <packing>\n\nvoid main() {\n gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n}";
    const depthpackage_vert = "#include <common>\nattribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\n\nvoid main() { \n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const diffuselightmap_frag = "#include <common>\nuniform sampler2D _MainTex;\nuniform sampler2D _LightmapTex;\nuniform lowp float _LightmapIntensity;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nlowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)\n{\n    highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);\n    return data.rgb * power * intensity;\n}\nvoid main() \n{\n    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0);\n    if(outColor.a < _AlphaCut)\n        discard;\n    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);\n    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);\n    gl_FragData[0] = outColor;\n}";
    const diffuselightmap_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nattribute vec4 _glesMultiTexCoord1;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 glstate_lightmapOffset;\nuniform lowp float glstate_lightmapUV;\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nvoid main()\n{\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n\n    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;\n    if(glstate_lightmapUV == 0.0)\n    {\n        beforelightUV = _glesMultiTexCoord0.xy;\n    }\n    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;\n    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);\n    xlv_TEXCOORD1 = vec2(u,v);\n\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const diffuse_frag = "#include <common>\n#include <lightmap_pars_frag>\nuniform vec4 _MainColor;\nuniform sampler2D _MainTex;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0) * _MainColor;\n    if(outColor.a < _AlphaCut)\n        discard;\n    #include <lightmap_frag>    \n}";
    const diffuse_vert = "#include <common>\n#include <skinning_pars_vert>\n#include <lightmap_pars_vert> \nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 _MainTex_ST;  \nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main() {\n    #include <skinning_base_vert>\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\n    #include <lightmap_vert>\n    gl_Position = (glstate_matrix_mvp * tmpVertex);\n}";
    const distancepackage_frag = "#include <common>\n#include <packing>\n\nvarying vec3 xlv_POS;\nuniform vec4 glstate_referencePosition;\nuniform float glstate_nearDistance;\nuniform float glstate_farDistance;\n\nvoid main() {\n    float dist = length( xlv_POS - glstate_referencePosition.xyz );\n dist = ( dist - glstate_nearDistance ) / ( glstate_farDistance - glstate_nearDistance );\n dist = saturate( dist ); // clamp to [ 0, 1 ]\n\n gl_FragColor = packDepthToRGBA( dist );\n}";
    const distancepackage_vert = "#include <common>\nattribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\nuniform mat4 glstate_matrix_model;\n\nvarying vec3 xlv_POS;\n\nvoid main() {   \n    xlv_POS = (glstate_matrix_model * vec4(_glesVertex, 1.0)).xyz;\n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const lambert_frag = "// #extension GL_OES_standard_derivatives : enable\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _Color;         \n\n#include <bsdfs>\n#include <light_pars_frag>\n#include <shadowMap_pars_frag>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#ifdef USE_NORMAL_MAP\n    #include <tbn>\n    #include <tsn>\n    uniform sampler2D _NormalTex;\n#endif\n\n#include <bumpMap_pars_frag>\n\nvoid main() {\n    vec4 outColor = vec4(0., 0., 0., 1.);\n\n    vec4 diffuseColor = _Color * texture2D(_MainTex, xlv_TEXCOORD0);\n    outColor.xyz = diffuseColor.xyz;\n\n    #include <normal_frag>\n    #include <light_frag>\n    \n    outColor.a = diffuseColor.a;\n\n    gl_FragColor = outColor;\n}";
    const lambert_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec3 _glesNormal;               \nattribute vec4 _glesMultiTexCoord0;\n#include <skinning_pars_vert>\n\nuniform mat4 glstate_matrix_mvp;      \nuniform mat4 glstate_matrix_model;\nuniform vec4 _MainTex_ST;  \n\n#include <shadowMap_pars_vert>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;             \nvarying vec2 xlv_TEXCOORD0;\n\n#include <transpose>\n#include <inverse>\n\nvoid main() {   \n    #include <skinning_base_vert>\n\n    vec3 tmpNormal;      \n    #include <skinning_normal_vert>              \n\n    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(tmpNormal, 1.0)).xyz;\n    xlv_NORMAL = normal;\n    #ifdef FLIP_SIDED\n     xlv_NORMAL = - xlv_NORMAL;\n    #endif\n\n    vec3 worldpos = (glstate_matrix_model * tmpVertex).xyz;\n    xlv_POS = worldpos; \n\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\n\n    #include <shadowMap_vert>\n     \n    gl_Position = (glstate_matrix_mvp * tmpVertex);\n}";
    const line_frag = "#include <common>\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    gl_FragData[0] = xlv_COLOR;\n}";
    const line_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesColor;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _glesColor;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const materialcolor_vert = "#include <common>\nattribute vec4 _glesVertex;\nuniform vec4 _Color;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _Color;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const particlesystem_frag = "//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.ps\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _TintColor;\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n\n#ifdef RENDERMODE_MESH\n varying vec4 v_mesh_color;\n#endif\n\nvoid main()\n{ \n #ifdef RENDERMODE_MESH\n  gl_FragColor=v_mesh_color;\n #else\n  gl_FragColor=vec4(1.0); \n #endif\n\n if(v_discard!=0.0)\n  discard;\n gl_FragColor*=texture2D(_MainTex,v_texcoord)*_TintColor*v_color*2.0;\n}";
    const particlesystem_vert = "//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.vs\n#include <common>\n#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)\n attribute vec2 _glesCorner;\n#endif\n#ifdef RENDERMESH\n attribute vec3 _glesVertex;\n attribute vec4 _glesColor;\n#endif\nattribute vec2 _glesMultiTexCoord0;\nattribute vec3 _startPosition;\nattribute vec3 _startVelocity;\nattribute vec4 _startColor;\nattribute vec3 _startSize;\nattribute vec3 _startRotation;\nattribute vec2 _time;\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)\n  attribute vec4 _random0;\n#endif\n#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  attribute vec4 _random1;\n#endif\nattribute vec3 _startWorldPosition;\nattribute vec4 _startWorldRotation;\n\n#include <particle_common>\n\nvoid main()\n{\n float age = u_currentTime - _time.y;\n float t = age/_time.x;\n if(t>1.0){    \n   v_discard=1.0;\n   return;\n  }\n   \n #include <particle_affector>\n gl_Position=glstate_matrix_vp*vec4(center,1.0);\n v_color = computeColor(_startColor, t);\n v_texcoord =computeUV(_glesMultiTexCoord0 * _MainTex_ST.xy + _MainTex_ST.zw, t);\n v_discard=0.0;\n}\n\n";
    const postdepth_frag = "#include <common>\n//varying highp vec3 xlv_Normal;   \n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\nvec2 packDepthToRG( const in float v ) \n{\n    vec2 r = vec2( fract( v * PackFactors.z ), v );\n r.y -= r.x * ShiftRight8;\n    return r * PackUpscale;\n}\nfloat unpackRGToDepth( const in vec2 v ) \n{\n    return dot( v.xy, UnpackFactors.zw );\n}\nvec3 packDepthToRGB( const in float v ) \n{\n    vec3 r = vec3( fract( v * PackFactors.yz ), v );\n r.yz -= r.xy * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBToDepth( const in vec3 v ) \n{\n    return dot( v.xyz, UnpackFactors.yzw );\n}\nvoid main() \n{\n    float z = gl_FragCoord.z;// fract(gl_FragCoord.z *256.*256.);\n    // highp vec2 normal =xlv_Normal.xy;\n    gl_FragColor=packDepthToRGBA(z);\n}";
    const postdepth_vert = "#include <common>\nprecision highp float;\nattribute vec4 _glesVertex;    \n\nuniform highp mat4 glstate_matrix_mvp;      \n            \nvoid main()                                     \n{        \n    gl_Position = (glstate_matrix_mvp * _glesVertex);  \n}";
    const postquaddepth_frag = "#include <common>\nprecision mediump float;\nvarying highp vec2 xlv_TEXCOORD0;       \nuniform sampler2D _DepthTex;   \nuniform sampler2D _MainTex;  \n\n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\n\n\nfloat planeDistance(const in vec3 positionA, const in vec3 normalA, \n                    const in vec3 positionB, const in vec3 normalB) \n{\n  vec3 positionDelta = positionB-positionA;\n  float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));\n  return planeDistanceDelta;\n}\n\nvoid main()         \n{\n    lowp vec4 c1=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0.001,0));\n    lowp vec4 c2=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(-0.001,0));\n    lowp vec4 c3=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,0.001));\n    lowp vec4 c4=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,-0.001));\n    highp float z1 = unpackRGBAToDepth(c1);\n    highp float z2 = unpackRGBAToDepth(c2);\n    highp float z3 = unpackRGBAToDepth(c3);\n    highp float z4 = unpackRGBAToDepth(c4);\n    highp float d = clamp(  (abs(z2-z1)+abs(z4-z3))*10.0,0.0,1.0);\n    lowp vec4 c=texture2D(_MainTex, xlv_TEXCOORD0);\n    lowp float g = c.r*0.3+c.g*0.6+c.b*0.1;\n\n    gl_FragColor =mix(vec4(g,g,g,1.),vec4(1.0,1.0,0.0,1.0),d);// vec4(g*d,g*d,g*d,1.0);\n}";
    const postquad_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0; \nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main()                     \n{ \n    gl_Position = _glesVertex;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw; \n}   ";
    const uifont_frag = "#include <common>\nprecision mediump float;\nuniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying lowp vec4 xlv_COLOREx;\nvarying highp vec2 xlv_TEXCOORD0;  \nvoid main() {\n    float scale = 10.0;\n    float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5) * scale;  //0.5\n    float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34) * scale;  //0.34\n\n    float c=xlv_COLOR.a * clamp ( d,0.0,1.0);\n    float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);\n    bc =min(1.0-c,bc);\n\n    gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc;\n}";
    const uifont_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesColorEx;                  \nattribute vec4 _glesMultiTexCoord0;         \nuniform highp mat4 glstate_matrix_mvp;      \nvarying lowp vec4 xlv_COLOR;                \nvarying lowp vec4 xlv_COLOREx;                                                 \nvarying highp vec2 xlv_TEXCOORD0;           \nvoid main() {                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_COLOREx = _glesColorEx;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}";
    const ui_frag = "#include <common>\nuniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_frag = "#include <common>\nuniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() \n{\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n\n    tmpvar_3 = (texture2D(_MainTex, xlv_TEXCOORD0));\n    //prev_2 = tmpvar_3;\n    //mediump vec4 tmpvar_4;\n    //tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    //col_1 = tmpvar_4;\n    //col_1.x = xlv_TEXCOORD0.x;\n    //col_1.y = xlv_TEXCOORD0.y;\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesNormal;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesMultiTexCoord0;        \nuniform highp mat4 glstate_matrix_mvp;   \nuniform highp vec4 _MainTex_ST;       \n\nvarying lowp vec4 xlv_COLOR;                \nvarying highp vec2 xlv_TEXCOORD0;   \n\nvoid main()                                     \n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;   \n\n    //xlv_COLOR.xyz =pos.xyz;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}\n";
}
declare namespace egret3d.ShaderChunk {
    const bsdfs = "// diffuse just use lambert\n\nvec3 BRDF_Diffuse_Lambert(vec3 diffuseColor) {\n    return RECIPROCAL_PI * diffuseColor;\n}\n\n// specular use Cook-Torrance microfacet model, http://ruh.li/GraphicsCookTorrance.html\n// About RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272\n\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n // Original approximation by Christophe Schlick '94\n float fresnel = pow( 1.0 - dotLH, 5.0 );\n\n // Optimized variant (presented by Epic at SIGGRAPH '13)\n // float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\n return ( 1.0 - specularColor ) * fresnel + specularColor;\n}\n\n// use blinn phong instead of phong\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n    // ( shininess * 0.5 + 1.0 ), three.js do this, but why ???\n return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\n\nfloat G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {\n // geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\n return 0.25;\n}\n\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n    vec3 H = normalize(L + V);\n\n    float dotNH = saturate(dot(N, H));\n    float dotLH = saturate(dot(L, H));\n\n    vec4 F = F_Schlick(specularColor, dotLH);\n\n    float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n    float D = D_BlinnPhong(shininess, dotNH);\n\n    return F * G * D;\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (33)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\n float a2 = pow2( alpha );\n\n float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\n\n return RECIPROCAL_PI * a2 / pow2( denom );\n\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (34)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n // geometry term = G(l)⋅G(v) / 4(n⋅l)(n⋅v)\n\n float a2 = pow2( alpha );\n\n float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\n return 1.0 / ( gl * gv );\n\n}\n\n// Moving Frostbite to Physically Based Rendering 2.0 - page 12, listing 2\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n float a2 = pow2( alpha );\n\n // dotNL and dotNV are explicitly swapped. This is not a mistake.\n float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\n return 0.5 / max( gv + gl, EPSILON );\n}\n\n// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility\nvec4 BRDF_Specular_GGX(vec4 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {\n\n float alpha = pow2( roughness ); // UE4's roughness\n\n vec3 H = normalize(L + V);\n\n float dotNL = saturate( dot(N, L) );\n float dotNV = saturate( dot(N, V) );\n float dotNH = saturate( dot(N, H) );\n float dotLH = saturate( dot(L, H) );\n\n vec4 F = F_Schlick( specularColor, dotLH );\n\n float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\n float D = D_GGX( alpha, dotNH );\n\n return F * G * D;\n\n}\n\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\nvec4 BRDF_Specular_GGX_Environment( const in vec3 N, const in vec3 V, const in vec4 specularColor, const in float roughness ) {\n\n float dotNV = saturate( dot( N, V ) );\n\n const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\n const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\n vec4 r = roughness * c0 + c1;\n\n float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\n vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\n return specularColor * AB.x + AB.y;\n\n}\n\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\n\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}";
    const bumpMap_pars_frag = "#ifdef USE_BUMPMAP\n\n uniform sampler2D bumpMap;\n uniform float bumpScale;\n\n // Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n // http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n // Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n vec2 dHdxy_fwd(vec2 uv) {\n\n  vec2 dSTdx = dFdx( uv );\n  vec2 dSTdy = dFdy( uv );\n\n  float Hll = bumpScale * texture2D( bumpMap, uv ).x;\n  float dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n  float dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\n  return vec2( dBx, dBy );\n\n }\n\n vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\n  vec3 vSigmaX = dFdx( surf_pos );\n  vec3 vSigmaY = dFdy( surf_pos );\n  vec3 vN = surf_norm;  // normalized\n\n  vec3 R1 = cross( vSigmaY, vN );\n  vec3 R2 = cross( vN, vSigmaX );\n\n  float fDet = dot( vSigmaX, R1 );\n\n  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n  return normalize( abs( fDet ) * surf_norm - vGrad );\n\n }\n\n#endif\n";
    const common = "#define PI 3.14159265359\n#define EPSILON 1e-6\n#define LOG2 1.442695\n#define RECIPROCAL_PI 0.31830988618\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; } ";
    const inverse = "mat4 inverse(mat4 m) {\n    float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}";
    const lightmap_frag = "#ifdef LIGHTMAP\n    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);\n    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);\n    gl_FragData[0] = outColor;\n#else\n    gl_FragData[0] = outColor;\n#endif";
    const lightmap_pars_frag = "#ifdef LIGHTMAP\n    uniform sampler2D _LightmapTex;\n    uniform lowp float _LightmapIntensity;\n    varying highp vec2 xlv_TEXCOORD1;\n\n    lowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)\n    {\n        highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);\n        return data.rgb * power * intensity;\n    }\n#endif";
    const lightmap_pars_vert = "#ifdef LIGHTMAP\n    attribute vec4 _glesMultiTexCoord1;\n    uniform highp vec4 glstate_lightmapOffset;\n    uniform lowp float glstate_lightmapUV;\n    varying highp vec2 xlv_TEXCOORD1;\n#endif";
    const lightmap_vert = "#ifdef LIGHTMAP\n    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;\n    if(glstate_lightmapUV == 0.0)\n    {\n        beforelightUV = _glesMultiTexCoord0.xy;\n    }\n    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;\n    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);\n    xlv_TEXCOORD1 = vec2(u,v);\n#endif";
    const light_frag = "#ifdef USE_LIGHT    \n    vec3 L;\n    vec3 light;\n    vec3 totalReflect = vec3(0., 0., 0.);\n\n    #ifdef USE_DIRECT_LIGHT\n        for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\n            light = vec3(glstate_directLights[i * 15 + 6], glstate_directLights[i * 15 + 7], glstate_directLights[i * 15 + 8]) * glstate_directLights[i * 15 + 9];\n\n            L.x = glstate_directLights[i * 15 + 3];\n            L.y = glstate_directLights[i * 15 + 4];\n            L.z = glstate_directLights[i * 15 + 5];\n            L = normalize(-L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                irradiance *= bool( glstate_directLights[i * 15 + 10] ) ? getShadow( glstate_directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], glstate_directLights[i * 15 + 11], glstate_directLights[i * 15 + 12], vec2(glstate_directLights[i * 15 + 13], glstate_directLights[i * 15 + 14]) ) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n        for(int i = 0; i < USE_POINT_LIGHT; i++) {\n            L = vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]) - xlv_POS;\n            float dist = pow(clamp(1. - length(L) / glstate_pointLights[i * 19 + 10], 0.0, 1.0), glstate_pointLights[i * 19 + 11]);\n            light = vec3(glstate_pointLights[i * 19 + 6], glstate_pointLights[i * 19 + 7], glstate_pointLights[i * 19 + 8]) * glstate_pointLights[i * 19 + 9] * dist;\n            L = normalize(L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                vec3 worldV = xlv_POS - vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]);\n                irradiance *= bool( glstate_pointLights[i * 19 + 12] ) ? getPointShadow( glstate_pointShadowMap[ i ], worldV, glstate_pointLights[i * 19 + 13], glstate_pointLights[i * 19 + 14], vec2(glstate_pointLights[i * 19 + 17], glstate_pointLights[i * 19 + 18]), glstate_pointLights[i * 19 + 15], glstate_pointLights[i * 19 + 16]) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n        for(int i = 0; i < USE_SPOT_LIGHT; i++) {\n            L = vec3(glstate_spotLights[i * 19 + 0], glstate_spotLights[i * 19 + 1], glstate_spotLights[i * 19 + 2]) - xlv_POS;\n            float lightDistance = length(L);\n            L = normalize(L);\n            float angleCos = dot( L, -normalize(vec3(glstate_spotLights[i * 19 + 3], glstate_spotLights[i * 19 + 4], glstate_spotLights[i * 19 + 5])) );\n\n            if( all( bvec2(angleCos > glstate_spotLights[i * 19 + 12], lightDistance < glstate_spotLights[i * 19 + 10]) ) ) {\n\n                float spotEffect = smoothstep( glstate_spotLights[i * 19 + 12], glstate_spotLights[i * 19 + 13], angleCos );\n                float dist = pow(clamp(1. - lightDistance / glstate_spotLights[i * 19 + 10], 0.0, 1.0), glstate_spotLights[i * 19 + 11]);\n                light = vec3(glstate_spotLights[i * 19 + 6], glstate_spotLights[i * 19 + 7], glstate_spotLights[i * 19 + 8]) * glstate_spotLights[i * 19 + 9] * dist * spotEffect;\n\n                float dotNL = saturate( dot(N, L) );\n                vec3 irradiance = light * dotNL;\n\n                #ifdef USE_PBR\n                    irradiance *= PI;\n                #endif\n\n                #ifdef USE_SHADOW\n                    irradiance *= bool( glstate_spotLights[i * 17 + 14] ) ? getShadow( glstate_spotShadowMap[ i ], vSpotShadowCoord[ i ], glstate_spotLights[i * 17 + 15], glstate_spotLights[i * 17 + 16], vec2(glstate_spotLights[i * 17 + 17], glstate_spotLights[i * 17 + 18])) : 1.0;\n                #endif\n\n                vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n                totalReflect += reflectLight;\n            }\n\n        }\n    #endif\n\n    outColor.xyz = totalReflect;\n#endif";
    const light_pars_frag = "#ifdef USE_DIRECT_LIGHT\n    uniform float glstate_directLights[USE_DIRECT_LIGHT * 15];\n#endif\n\n#ifdef USE_POINT_LIGHT\n    uniform float glstate_pointLights[USE_POINT_LIGHT * 19];\n#endif\n\n#ifdef USE_SPOT_LIGHT\n    uniform float glstate_spotLights[USE_SPOT_LIGHT * 19];\n#endif";
    const normal_frag = "#ifdef DOUBLE_SIDED\n    float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n#else\n    float flipNormal = 1.0;\n#endif\n#ifdef FLAT_SHADED\n    // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\n    vec3 fdx = vec3( dFdx( xlv_POS.x ), dFdx( xlv_POS.y ), dFdx( xlv_POS.z ) );\n    vec3 fdy = vec3( dFdy( xlv_POS.x ), dFdy( xlv_POS.y ), dFdy( xlv_POS.z ) );\n    vec3 N = normalize( cross( fdx, fdy ) );\n#else\n    vec3 N = normalize(xlv_NORMAL) * flipNormal;\n#endif\n#ifdef USE_NORMAL_MAP\n    vec3 normalMapColor = texture2D(_NormalTex, xlv_TEXCOORD0).rgb;\n    // for now, uv coord is flip Y\n    mat3 tspace = tsn(N, -xlv_POS, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    // mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\n#elif defined(USE_BUMPMAP)\n    N = perturbNormalArb(-xlv_POS, N, dHdxy_fwd(xlv_TEXCOORD0));\n#endif";
    const packing = "const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n    return r * PackUpscale;\n\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\n    return dot( v, UnpackFactors );\n\n}";
    const particle_affector = "vec3 lifeVelocity = computeVelocity(t);\nvec4 worldRotation;\nif(u_simulationSpace==1)\n worldRotation=_startWorldRotation;\nelse\n worldRotation=u_worldRotation;\nvec3 gravity=u_gravity*age;\n\nvec3 center=computePosition(_startVelocity, lifeVelocity, age, t,gravity,worldRotation); \n#ifdef SPHERHBILLBOARD\n   vec2 corner=_glesCorner.xy;\n      vec3 cameraUpVector =normalize(glstate_cameraUp);\n      vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n      vec3 upVector = normalize(cross(sideVector,glstate_cameraForward));\n     corner*=computeBillbardSize(_startSize.xy,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n   if(u_startRotation3D){\n    vec3 rotation=vec3(_startRotation.xy,computeRotation(_startRotation.z,age,t));\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,rotation);\n   }\n   else{\n    float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #else\n   if(u_startRotation3D){\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,_startRotation);\n   }\n   else{\n    float c = cos(_startRotation.x);\n    float s = sin(_startRotation.x);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #endif\n #endif\n #ifdef STRETCHEDBILLBOARD\n  vec2 corner=_glesCorner.xy;\n  vec3 velocity;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n      if(u_spaceType==0)\n       velocity=rotation_quaternions(u_sizeScale*(_startVelocity+lifeVelocity),worldRotation)+gravity;\n      else\n       velocity=rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+lifeVelocity+gravity;\n   #else\n      velocity= rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+gravity;\n   #endif \n  vec3 cameraUpVector = normalize(velocity);\n  vec3 direction = normalize(center-glstate_cameraPos);\n    vec3 sideVector = normalize(cross(direction,normalize(velocity)));\n  sideVector=u_sizeScale.xzy*sideVector;\n  cameraUpVector=length(vec3(u_sizeScale.x,0.0,0.0))*cameraUpVector;\n    vec2 size=computeBillbardSize(_startSize.xy,t);\n    const mat2 rotaionZHalfPI=mat2(0.0, -1.0, 1.0, 0.0);\n    corner=rotaionZHalfPI*corner;\n    corner.y=corner.y-abs(corner.y);\n    float speed=length(velocity);\n    center +=sign(u_sizeScale.x)*(sign(u_lengthScale)*size.x*corner.x*sideVector+(speed*u_speeaScale+size.y*u_lengthScale)*corner.y*cameraUpVector);\n #endif\n #ifdef HORIZONTALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector=vec3(0.0,0.0,1.0);\n    const vec3 sideVector = vec3(-1.0,0.0,0.0);\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef VERTICALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector =vec3(0.0,1.0,0.0);\n    vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef RENDERMESH\n    vec3 size=computeMeshSize(_startSize,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n    if(u_startRotation3D){\n     vec3 rotation=vec3(_startRotation.xy,-computeRotation(_startRotation.z, age,t));\n     center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,rotation),worldRotation);\n    }\n    else{\n     #ifdef ROTATIONOVERLIFETIME\n      float angle=computeRotation(_startRotation.x, age,t);\n      if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n       center+= (rotation_quaternions(rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),angle),worldRotation));//已验证\n      }\n      else{\n       #ifdef SHAPE\n        center+= u_sizeScale.xzy*(rotation_quaternions(rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),angle),worldRotation));\n       #else\n        if(u_simulationSpace==1)\n         center+=rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),angle);\n        else if(u_simulationSpace==0)\n         center+=rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),angle),worldRotation);\n       #endif\n      }\n     #endif\n     #ifdef ROTATIONSEPERATE\n      vec3 angle=compute3DRotation(vec3(0.0,0.0,_startRotation.z), age,t);\n      center+= (rotation_quaternions(rotation_euler(u_sizeScale*_glesVertex*size,vec3(angle.x,angle.y,angle.z)),worldRotation));\n     #endif \n    }\n  #else\n  if(u_startRotation3D){\n   center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,_startRotation),worldRotation);\n  }\n  else{\n   if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n    if(u_simulationSpace==1)\n     center+= rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x);\n    else if(u_simulationSpace==0)\n     center+= (rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x),worldRotation));\n   }\n   else{\n    #ifdef SHAPE\n     if(u_simulationSpace==1)\n      center+= u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x),worldRotation); \n    #else\n     if(u_simulationSpace==1)\n      center+= rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x),worldRotation);\n    #endif\n   }\n  }\n  #endif\n  v_mesh_color=_glesColor;\n  #endif";
    const particle_common = "\n\nuniform float u_currentTime;\nuniform vec3 u_gravity;\n\nuniform vec3 u_worldPosition;\nuniform vec4 u_worldRotation;\nuniform bool u_startRotation3D;\nuniform int u_scalingMode;\nuniform vec3 u_positionScale;\nuniform vec3 u_sizeScale;\nuniform mat4 glstate_matrix_vp;\nuniform vec4 _MainTex_ST;  \n\n#ifdef STRETCHEDBILLBOARD\n uniform vec3 glstate_cameraPos;\n#endif\nuniform vec3 glstate_cameraForward;\nuniform vec3 glstate_cameraUp;\n\nuniform float u_lengthScale;\nuniform float u_speeaScale;\nuniform int u_simulationSpace;\n\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  uniform int u_spaceType;\n#endif\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYTWOCONSTANT)\n  uniform vec3 u_velocityConst;\n#endif\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)\n  uniform vec2 u_velocityCurveX[4];\n  uniform vec2 u_velocityCurveY[4];\n  uniform vec2 u_velocityCurveZ[4];\n#endif\n#ifdef VELOCITYTWOCONSTANT\n  uniform vec3 u_velocityConstMax;\n#endif\n#ifdef VELOCITYTWOCURVE\n  uniform vec2 u_velocityCurveMaxX[4];\n  uniform vec2 u_velocityCurveMaxY[4];\n  uniform vec2 u_velocityCurveMaxZ[4];\n#endif\n\n#ifdef COLOROGRADIENT\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n#endif\n#ifdef COLORTWOGRADIENTS\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n  uniform vec4 u_colorGradientMax[4];\n  uniform vec2 u_alphaGradientMax[4];\n#endif\n\n#if defined(SIZECURVE)||defined(SIZETWOCURVES)\n  uniform vec2 u_sizeCurve[4];\n#endif\n#ifdef SIZETWOCURVES\n  uniform vec2 u_sizeCurveMax[4];\n#endif\n#if defined(SIZECURVESEPERATE)||defined(SIZETWOCURVESSEPERATE)\n  uniform vec2 u_sizeCurveX[4];\n  uniform vec2 u_sizeCurveY[4];\n  uniform vec2 u_sizeCurveZ[4];\n#endif\n#ifdef SIZETWOCURVESSEPERATE\n  uniform vec2 u_sizeCurveMaxX[4];\n  uniform vec2 u_sizeCurveMaxY[4];\n  uniform vec2 u_sizeCurveMaxZ[4];\n#endif\n\n#ifdef ROTATIONOVERLIFETIME\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform float u_rotationConst;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform float u_rotationConstMax;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurve[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMax[4];\n  #endif\n#endif\n#ifdef ROTATIONSEPERATE\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform vec3 u_rotationConstSeprarate;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform vec3 u_rotationConstMaxSeprarate;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurveX[4];\n    uniform vec2 u_rotationCurveY[4];\n    uniform vec2 u_rotationCurveZ[4];\n  uniform vec2 u_rotationCurveW[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMaxX[4];\n    uniform vec2 u_rotationCurveMaxY[4];\n    uniform vec2 u_rotationCurveMaxZ[4];\n  uniform vec2 u_rotationCurveMaxW[4];\n  #endif\n#endif\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\n  uniform float u_cycles;\n  uniform vec4 u_subUV;\n  uniform vec2 u_uvCurve[4];\n#endif\n#ifdef TEXTURESHEETANIMATIONTWOCURVE\n  uniform vec2 u_uvCurveMax[4];\n#endif\n\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n#ifdef RENDERMESH\n varying vec4 v_mesh_color;\n#endif\n\nvec3 rotation_euler(in vec3 vector,in vec3 euler)\n{\n  float halfPitch = euler.x * 0.5;\n float halfYaw = euler.y * 0.5;\n float halfRoll = euler.z * 0.5;\n\n float sinPitch = sin(halfPitch);\n float cosPitch = cos(halfPitch);\n float sinYaw = sin(halfYaw);\n float cosYaw = cos(halfYaw);\n float sinRoll = sin(halfRoll);\n float cosRoll = cos(halfRoll);\n\n float quaX = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);\n float quaY = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);\n float quaZ = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);\n float quaW = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n \n}\n\nvec3 rotation_axis(in vec3 vector,in vec3 axis, in float angle)\n{\n float halfAngle = angle * 0.5;\n float sin = sin(halfAngle);\n \n float quaX = axis.x * sin;\n float quaY = axis.y * sin;\n float quaZ = axis.z * sin;\n float quaW = cos(halfAngle);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n}\n\nvec3 rotation_quaternions(in vec3 v,in vec4 q) \n{\n return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(SIZECURVE)||defined(SIZECURVESEPERATE)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)\nfloat evaluate_curve_float(in vec2 curves[4],in float t)\n{\n float res;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  if(curTime>=t)\n  {\n   vec2 lastCurve=curves[i-1];\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res=mix(lastCurve.y,curve.y,tt);\n   break;\n  }\n }\n return res;\n}\n#endif\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\nfloat evaluate_curve_total(in vec2 curves[4],in float t)\n{\n float res=0.0;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  vec2 lastCurve=curves[i-1];\n  float lastValue=lastCurve.y;\n  \n  if(curTime>=t){\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res+=(lastValue+mix(lastValue,curve.y,tt))/2.0*_time.x*(t-lastTime);\n   break;\n  }\n  else{\n   res+=(lastValue+curve.y)/2.0*_time.x*(curTime-lastCurve.x);\n  }\n }\n return res;\n}\n#endif\n\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)\nvec4 evaluate_curve_color(in vec2 gradientAlphas[4],in vec4 gradientColors[4],in float t)\n{\n vec4 overTimeColor;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientAlpha=gradientAlphas[i];\n  float alphaKey=gradientAlpha.x;\n  if(alphaKey>=t)\n  {\n   vec2 lastGradientAlpha=gradientAlphas[i-1];\n   float lastAlphaKey=lastGradientAlpha.x;\n   float age=(t-lastAlphaKey)/(alphaKey-lastAlphaKey);\n   overTimeColor.a=mix(lastGradientAlpha.y,gradientAlpha.y,age);\n   break;\n  }\n }\n \n for(int i=1;i<4;i++)\n {\n  vec4 gradientColor=gradientColors[i];\n  float colorKey=gradientColor.x;\n  if(colorKey>=t)\n  {\n   vec4 lastGradientColor=gradientColors[i-1];\n   float lastColorKey=lastGradientColor.x;\n   float age=(t-lastColorKey)/(colorKey-lastColorKey);\n   overTimeColor.rgb=mix(gradientColors[i-1].yzw,gradientColor.yzw,age);\n   break;\n  }\n }\n return overTimeColor;\n}\n#endif\n\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\nfloat evaluate_curve_frame(in vec2 gradientFrames[4],in float t)\n{\n float overTimeFrame;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientFrame=gradientFrames[i];\n  float key=gradientFrame.x;\n  if(key>=t)\n  {\n   vec2 lastGradientFrame=gradientFrames[i-1];\n   float lastKey=lastGradientFrame.x;\n   float age=(t-lastKey)/(key-lastKey);\n   overTimeFrame=mix(lastGradientFrame.y,gradientFrame.y,age);\n   break;\n  }\n }\n return floor(overTimeFrame);\n}\n#endif\n\nvec3 computeVelocity(in float t)\n{\n  vec3 res;\n  #ifdef VELOCITYCONSTANT\n  res=u_velocityConst; \n  #endif\n  #ifdef VELOCITYCURVE\n     res= vec3(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveZ,t));\n  #endif\n  #ifdef VELOCITYTWOCONSTANT\n  res=mix(u_velocityConst,u_velocityConstMax,vec3(_random1.y,_random1.z,_random1.w)); \n  #endif\n  #ifdef VELOCITYTWOCURVE\n     res=vec3(mix(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveMaxX,t),_random1.y),\n             mix(evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveMaxY,t),_random1.z),\n        mix(evaluate_curve_float(u_velocityCurveZ,t),evaluate_curve_float(u_velocityCurveMaxZ,t),_random1.w));\n  #endif\n     \n  return res;\n} \n\nvec3 computePosition(in vec3 startVelocity, in vec3 lifeVelocity,in float age,in float t,vec3 gravityVelocity,vec4 worldRotation)\n{\n    vec3 startPosition;\n    vec3 lifePosition;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n   #ifdef VELOCITYCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveZ,t));\n   #endif\n   #ifdef VELOCITYTWOCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYTWOCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(mix(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveMaxX,t),_random1.y)\n                 ,mix(evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveMaxY,t),_random1.z)\n                 ,mix(evaluate_curve_total(u_velocityCurveZ,t),evaluate_curve_total(u_velocityCurveMaxZ,t),_random1.w));\n   #endif\n\n   vec3 finalPosition;\n   if(u_spaceType==0){\n     if(u_scalingMode!=2)\n      finalPosition =rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition+lifePosition),worldRotation);\n     else\n      finalPosition =rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition+lifePosition,worldRotation);\n   }\n   else{\n     if(u_scalingMode!=2)\n       finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation)+lifePosition;\n     else\n       finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation)+lifePosition;\n   }\n    #else\n    startPosition=startVelocity*age;\n    vec3 finalPosition;\n    if(u_scalingMode!=2)\n      finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation);\n    else\n      finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation);\n  #endif\n  \n  if(u_simulationSpace==1)\n    finalPosition=finalPosition+_startWorldPosition;\n  else if(u_simulationSpace==0) \n    finalPosition=finalPosition+u_worldPosition;\n  \n  finalPosition+=0.5*gravityVelocity*age;\n \n  return finalPosition;\n}\n\n\nvec4 computeColor(in vec4 color,in float t)\n{\n #ifdef COLOROGRADIENT\n   color*=evaluate_curve_color(u_alphaGradient,u_colorGradient,t);\n #endif \n #ifdef COLORTWOGRADIENTS\n   color*=mix(evaluate_curve_color(u_alphaGradient,u_colorGradient,t),evaluate_curve_color(u_alphaGradientMax,u_colorGradientMax,t),_random0.y);\n #endif\n\n  return color;\n}\n\nvec2 computeBillbardSize(in vec2 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec2(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec2(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z));\n #endif\n return size;\n}\n\n#ifdef RENDERMESH\nvec3 computeMeshSize(in vec3 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec3(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveZ,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec3(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z)\n       ,mix(evaluate_curve_float(u_sizeCurveZ,t),evaluate_curve_float(u_sizeCurveMaxZ,t),_random0.z));\n #endif\n return size;\n}\n#endif\n\nfloat computeRotation(in float rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConst*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurve,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n     rotation+=ageRot;\n   #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n  #endif\n #endif\n #ifdef ROTATIONSEPERATE\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConstSeprarate.z*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurveZ,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConstSeprarate.z,u_rotationConstMaxSeprarate.z,_random0.w)*age;\n         rotation+=ageRot;\n     #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n  #endif\n #endif\n return rotation;\n}\n\n#if defined(RENDERMESH)&&(defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE))\nvec3 compute3DRotation(in vec3 rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n   #ifdef ROTATIONCONSTANT\n     float ageRot=u_rotationConst*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONCURVE\n     rotation+=evaluate_curve_total(u_rotationCurve,t);\n   #endif\n   #ifdef ROTATIONTWOCONSTANTS\n     float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONTWOCURVES\n     rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n   #endif\n #endif\n #ifdef ROTATIONSEPERATE\n    #ifdef ROTATIONCONSTANT\n     vec3 ageRot=u_rotationConstSeprarate*age;\n           rotation+=ageRot;\n    #endif\n    #ifdef ROTATIONCURVE\n     rotation+=vec3(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveZ,t));\n    #endif\n    #ifdef ROTATIONTWOCONSTANTS\n     vec3 ageRot=mix(u_rotationConstSeprarate,u_rotationConstMaxSeprarate,_random0.w)*age;\n           rotation+=ageRot;\n     #endif\n    #ifdef ROTATIONTWOCURVES\n     rotation+=vec3(mix(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveMaxX,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveMaxY,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n    #endif\n #endif\n return rotation;\n}\n#endif\n\nvec2 computeUV(in vec2 uv,in float t)\n{ \n #ifdef TEXTURESHEETANIMATIONCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n  float frame=evaluate_curve_frame(u_uvCurve,uvNormalizedAge);\n  uv.x *= u_subUV.x + u_subUV.z;\n  uv.y *= u_subUV.y + u_subUV.w;\n  float totalULength=frame*u_subUV.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUV.y;\n    #endif\n #ifdef TEXTURESHEETANIMATIONTWOCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n   float frame=floor(mix(evaluate_curve_frame(u_uvCurve,uvNormalizedAge),evaluate_curve_frame(u_uvCurveMax,uvNormalizedAge),_random1.x));\n  uv.x *= u_subUV.x + u_subUV.z;\n  uv.y *= u_subUV.y + u_subUV.w;\n  float totalULength=frame*u_subUV.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUV.y;\n    #endif\n return uv;\n}";
    const shadowMap_pars_frag = "#ifdef USE_SHADOW\n\n    #include <packing>\n\n    #ifdef USE_DIRECT_LIGHT\n\n        uniform sampler2D glstate_directionalShadowMap[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        uniform samplerCube glstate_pointShadowMap[ USE_POINT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        uniform sampler2D glstate_spotShadowMap[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n\n    #endif\n\n    float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n        return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n    }\n\n    float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {\n\n        return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );\n\n    }\n\n    float getShadow( sampler2D shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {\n        shadowCoord.xyz /= shadowCoord.w;\n\n        float depth = shadowCoord.z + shadowBias;\n\n        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n        bool inFrustum = all( inFrustumVec );\n\n        bvec2 frustumTestVec = bvec2( inFrustum, depth <= 1.0 );\n\n        bool frustumTest = all( frustumTestVec );\n\n        if ( frustumTest ) {\n            #ifdef USE_PCF_SOFT_SHADOW\n                // TODO x, y not equal\n                float texelSize = shadowRadius / shadowMapSize.x;\n\n                vec2 poissonDisk[4];\n                poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n                poissonDisk[1] = vec2(0.94558609, -0.76890725);\n                poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n                poissonDisk[3] = vec2(0.34495938, 0.29387760);\n\n                return texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                    texture2DCompare( shadowMap, shadowCoord.xy + poissonDisk[3] * texelSize, depth ) * 0.25;\n            #else\n                return texture2DCompare( shadowMap, shadowCoord.xy, depth );\n            #endif\n        }\n\n        return 1.0;\n\n    }\n\n    float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {\n\n        // depth = normalized distance from light to fragment position\n  float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?\n  depth += shadowBias;\n\n        V.x = -V.x; // for left-hand?\n\n        #ifdef USE_PCF_SOFT_SHADOW\n            // TODO x, y equal force\n            float texelSize = shadowRadius / shadowMapSize.x;\n\n            vec3 poissonDisk[4];\n      poissonDisk[0] = vec3(-1.0, 1.0, -1.0);\n      poissonDisk[1] = vec3(1.0, -1.0, -1.0);\n      poissonDisk[2] = vec3(-1.0, -1.0, -1.0);\n      poissonDisk[3] = vec3(1.0, -1.0, 1.0);\n\n            return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +\n                textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;\n        #else\n            return textureCubeCompare( shadowMap, normalize(V), depth);\n        #endif\n    }\n\n#endif";
    const shadowMap_pars_vert = "#ifdef USE_SHADOW\n\n    #ifdef USE_DIRECT_LIGHT\n\n        uniform mat4 glstate_directionalShadowMatrix[ USE_DIRECT_LIGHT ];\n        varying vec4 vDirectionalShadowCoord[ USE_DIRECT_LIGHT ];\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        // nothing\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        uniform mat4 glstate_spotShadowMatrix[ USE_SPOT_LIGHT ];\n        varying vec4 vSpotShadowCoord[ USE_SPOT_LIGHT ];\n\n    #endif\n\n#endif";
    const shadowMap_vert = "#ifdef USE_SHADOW\n\n    vec4 worldPosition = glstate_matrix_model * tmpVertex;\n\n    #ifdef USE_DIRECT_LIGHT\n\n        for ( int i = 0; i < USE_DIRECT_LIGHT; i ++ ) {\n\n            vDirectionalShadowCoord[ i ] = glstate_directionalShadowMatrix[ i ] * worldPosition;\n\n        }\n\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n\n        // nothing\n\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n\n        for ( int i = 0; i < USE_SPOT_LIGHT; i ++ ) {\n\n            vSpotShadowCoord[ i ] = glstate_spotShadowMatrix[ i ] * worldPosition;\n\n        }\n\n    #endif\n\n#endif";
    const skinning_base_vert = "#ifdef SKINNING\n    mat4 boneMatX = buildMat4(int(_glesBlendIndex4.x));\n mat4 boneMatY = buildMat4(int(_glesBlendIndex4.y));\n mat4 boneMatZ = buildMat4(int(_glesBlendIndex4.z));\n mat4 boneMatW = buildMat4(int(_glesBlendIndex4.w));\n \n    mat4 mat = boneMatX*_glesBlendWeight4.x \n    + boneMatY*_glesBlendWeight4.y \n    + boneMatZ*_glesBlendWeight4.z \n    + boneMatW*_glesBlendWeight4.w;\n    \n    highp vec4 tmpVertex = vec4((mat* _glesVertex).xyz, 1.0);\n // highp vec4 tmpVertex = vec4(calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz, 1.0);\n#else\n    // tmpVertex.xyz = _glesVertex.xyz;\n highp vec4 tmpVertex = vec4(_glesVertex.xyz, 1.0);\n#endif";
    const skinning_normal_vert = "#ifdef SKINNING\n    tmpNormal = vec4((mat* vec4(_glesNormal, 0.0))).xyz;\n    // tmpNormal = _glesNormal; \n#else\n    tmpNormal = _glesNormal;    \n#endif";
    const skinning_pars_vert = "#ifdef SKINNING\nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;\nuniform vec4 glstate_vec4_bones[110];\n\nmat4 buildMat4(int index)\n{\n vec4 quat = glstate_vec4_bones[index * 2 + 0];\n vec4 translation = glstate_vec4_bones[index * 2 + 1];\n float xy2 = 2.0 * quat.x * quat.y;\n float xz2 = 2.0 * quat.x * quat.z;\n float xw2 = 2.0 * quat.x * quat.w;\n float yz2 = 2.0 * quat.y * quat.z;\n float yw2 = 2.0 * quat.y * quat.w;\n float zw2 = 2.0 * quat.z * quat.w;\n float xx = quat.x * quat.x;\n float yy = quat.y * quat.y;\n float zz = quat.z * quat.z;\n float ww = quat.w * quat.w;\n mat4 matrix = mat4(\n xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,\n xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,\n xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,\n translation.x, translation.y, translation.z, 1);\n return matrix;\n}\n#endif";
    const tbn = "mat3 tbn(vec3 N, vec3 p, vec2 uv) {\n    vec3 dp1 = dFdx(p.xyz);\n    vec3 dp2 = dFdy(p.xyz);\n    vec2 duv1 = dFdx(uv.st);\n    vec2 duv2 = dFdy(uv.st);\n    vec3 dp2perp = cross(dp2, N);\n    vec3 dp1perp = cross(N, dp1);\n    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n    float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));\n    return mat3(T * invmax, B * invmax, N);\n}";
    const transpose = "mat4 transpose(mat4 inMatrix) {\n    vec4 i0 = inMatrix[0];\n    vec4 i1 = inMatrix[1];\n    vec4 i2 = inMatrix[2];\n    vec4 i3 = inMatrix[3];\n    mat4 outMatrix = mat4(\n        vec4(i0.x, i1.x, i2.x, i3.x),\n        vec4(i0.y, i1.y, i2.y, i3.y),\n        vec4(i0.z, i1.z, i2.z, i3.z),\n        vec4(i0.w, i1.w, i2.w, i3.w)\n    );\n    return outMatrix;\n}";
    const tsn = "mat3 tsn(vec3 N, vec3 V, vec2 uv) {\n\n    vec3 q0 = dFdx( V.xyz );\n    vec3 q1 = dFdy( V.xyz );\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    // vec3 N = normalize( N );\n\n    mat3 tsn = mat3( S, T, N );\n    return tsn;\n}";
}
declare namespace RES.processor {
    const TextureDescProcessor: RES.processor.Processor;
    const TextureProcessor: RES.processor.Processor;
    const GLTFBinaryProcessor: RES.processor.Processor;
    const GLTFProcessor: RES.processor.Processor;
    const GLTFShaderProcessor: RES.processor.Processor;
    const PrefabProcessor: RES.processor.Processor;
    const SceneProcessor: RES.processor.Processor;
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
    function getRelativePath(targetPath: string, sourcePath: string): string;
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
        private _scalerX;
        private _scalerY;
        private _rotated;
        /**
         *
         */
        updateOffsetAndScale(offsetX: number, offsetY: number, scalerX: number, scalerY: number, rotated: boolean): void;
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
        private _scalerX;
        private _scalerY;
        private _rotated;
        /**
         *
         */
        updateOffsetAndScale(offsetX: number, offsetY: number, scalerX: number, scalerY: number, rotated: boolean): void;
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
declare namespace egret3d {
    /**
     *
     */
    class Mesh extends BaseMesh {
        /**
         * @internal
         */
        readonly _ibos: WebGLBuffer[];
        /**
         * @internal
         */
        _vbo: WebGLBuffer | null;
        dispose(): void;
        _createBuffer(): void;
        /**
         *
         */
        uploadVertexBuffer(uploadAttributes?: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset?: number, count?: number): void;
        /**
         *
         */
        uploadSubIndexBuffer(subMeshIndex?: number): void;
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
    interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        dispose(): void;
        caclByteLength(): number;
    }
    interface IRenderTarget extends ITexture {
        use(): void;
    }
    abstract class GLTexture extends egret3d.Texture implements ITexture {
        /**
         * @internal
         */
        _texture: WebGLTexture;
        protected _width: number;
        protected _height: number;
        constructor(name?: string, width?: number, height?: number);
        dispose(): void;
        caclByteLength(): number;
        readonly texture: WebGLTexture;
        readonly width: number;
        readonly height: number;
    }
    /**
     *
     */
    class GLTexture2D extends GLTexture {
        static createColorTexture(name: string, r: number, g: number, b: number): GLTexture2D;
        static createGridTexture(name: string): GLTexture2D;
        protected _mipmap: boolean;
        protected _format: TextureFormatEnum;
        protected _reader: TextureReader;
        constructor(name?: string, width?: number, height?: number, format?: TextureFormatEnum);
        uploadImage(img: HTMLImageElement | Uint8Array, mipmap: boolean, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        caclByteLength(): number;
        dispose(): void;
        getReader(redOnly?: boolean): TextureReader;
    }
    abstract class RenderTarget implements IRenderTarget {
        /**
         * @internal
         */
        _texture: WebGLTexture;
        protected _width: number;
        protected _height: number;
        protected _fbo: WebGLFramebuffer;
        protected _renderbuffer: WebGLRenderbuffer;
        constructor(width: number, height: number, depth?: boolean, stencil?: boolean);
        use(): void;
        dispose(): void;
        caclByteLength(): number;
        readonly texture: WebGLTexture;
        readonly width: number;
        readonly height: number;
    }
    class GlRenderTarget extends RenderTarget {
        constructor(width: number, height: number, depth?: boolean, stencil?: boolean);
        use(): void;
    }
    class GlRenderTargetCube extends RenderTarget {
        activeCubeFace: number;
        constructor(width: number, height: number, depth?: boolean, stencil?: boolean);
        use(): void;
    }
    class TextureReader {
        readonly gray: boolean;
        readonly width: number;
        readonly height: number;
        readonly data: Uint8Array;
        constructor(texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        getPixel(u: number, v: number): any;
    }
    class WriteableTexture2D implements ITexture {
        width: number;
        height: number;
        format: TextureFormatEnum;
        texture: WebGLTexture;
        constructor(format: TextureFormatEnum, width: number, height: number, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean);
        dispose(): void;
        caclByteLength(): number;
    }
}
declare namespace egret3d {
    /**
     * @internal
     */
    interface WebGLActiveAttribute {
        name: string;
        size: number;
        type: number;
        location: number;
    }
    /**
     * @internal
     */
    interface WebGLActiveUniform {
        name: string;
        size: number;
        type: number;
        location: WebGLUniformLocation;
        textureUnits?: number[];
    }
    /**
     * @internal
     * WebGLProgram的包装类
     */
    class GlProgram {
        id: number;
        program: WebGLProgram;
        attributes: WebGLActiveAttribute[];
        uniforms: WebGLActiveUniform[];
        constructor(webglProgram: WebGLProgram);
    }
}
declare namespace egret3d {
    /**
     * WebGL 渲染系统
     */
    class WebGLRenderSystem extends paper.BaseSystem {
        protected readonly _interests: ({
            componentClass: typeof Camera;
        }[] | {
            componentClass: typeof Egret2DRenderer;
        }[] | {
            componentClass: typeof DirectLight[];
        }[])[];
        private readonly _drawCalls;
        private readonly _renderState;
        private readonly _camerasAndLights;
        private readonly _lightCamera;
        private readonly _filteredLights;
        private _cacheContextVersion;
        private _cacheMaterialVerision;
        private _cacheContext;
        private _cacheMaterial;
        private _cacheMesh;
        private _updateContextUniforms(program, context, technique, forceUpdate);
        private _updateUniforms(program, material, technique, forceUpdate);
        private _updateAttributes(program, mesh, subMeshIndex, technique, forceUpdate);
        private _drawCall(drawCall);
        private _renderCall(context, drawCall, material);
        /**
         * @internal
         * @param camera
         */
        _renderCamera(camera: Camera): void;
        /**
         * @internal
         * @param light
         */
        _renderLightShadow(light: BaseLight): void;
        onUpdate(): void;
    }
}
declare namespace egret3d {
    const MAX_VERTEX_COUNT_PER_BUFFER: number;
    /**
     * 尝试对场景内所有静态对象合并
     */
    function autoCombine(scene: paper.Scene): void;
    /**
     * 尝试合并静态对象列表。
     * @param instances
     * @param root
     */
    function combine(instances: ReadonlyArray<paper.GameObject>): void;
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
    type ProfileItem = {
        key: string;
        count: number;
        startTime: number;
        time: number;
        group: number;
        maxTime: number;
    };
    type ProfileList = {
        keys: string[];
        values: ProfileItem[];
    };
    class Profile {
        private static debug;
        private static profileList;
        private static _getNow();
        private static _print(list);
        static clear(): void;
        static startTime(key: string, group?: number): void;
        static endTime(key: string): void;
        static printAll(): void;
        static print(group?: number): void;
        static test(): void;
    }
}
declare namespace egret3d {
    type RunEgretOptions = {
        antialias: boolean;
        defaultScene?: string;
        contentWidth?: number;
        contentHeight?: number;
        option?: RequiredRuntimeOptions;
        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;
        isEditor?: boolean;
        isPlaying?: boolean;
        systems?: any[];
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
declare namespace paper.editor {
    /**
     * 编辑器事件
     */
    class EditorEvent extends BaseEvent {
        static CHANGE_SCENE: string;
        constructor(type: string, data?: any);
    }
    /**
     * 编辑器
     **/
    class Editor {
        private static editorSceneModel;
        /**初始化 */
        static init(): Promise<void>;
        private static _activeEditorModel;
        /**
         * 当前激活的编辑模型
         */
        static readonly activeEditorModel: EditorModel;
        private static setActiveModel(model);
        private static activeScene(scene);
        private static currentEditInfo;
        /**
         * 编辑场景
         * @param sceneUrl 场景资源URL
         */
        static editScene(sceneUrl: string): Promise<void>;
        /**
         * 编辑预置体
         * @param prefabUrl 预置体资源URL
         */
        static editPrefab(prefabUrl: string): Promise<void>;
        /**
         * 刷新
         */
        static refresh(): Promise<void>;
        /**
         * 撤销
         */
        static undo(): void;
        /**
         * 重做
         */
        static redo(): void;
        static deserializeHistory(data: any): void;
        static serializeHistory(): string;
        private static eventDispatcher;
        static addEventListener(type: string, fun: Function, thisObj: any, level?: number): void;
        static removeEventListener(type: string, fun: Function, thisObj: any): void;
        static dispatchEvent(event: BaseEvent): void;
        private static initEditEnvironment();
    }
}
declare namespace paper {
    /**
     *
     */
    const enum HideFlags {
        /**
         *
         */
        None = 0,
        /**
         *
         */
        NotEditable = 1,
        /**
         *
         */
        Hide = 2,
    }
    /**
     *
     */
    const enum DefaultNames {
        NoName = "NoName",
        Global = "Global",
        MainCamera = "MainCamera",
        EditorCamera = "EditorCamera",
        Editor = "Editor",
    }
    /**
     *
     */
    const enum DefaultTags {
        Untagged = "",
        Respawn = "Respawn",
        Finish = "Finish",
        EditorOnly = "EditorOnly",
        MainCamera = "MainCamera",
        Player = "Player",
        GameController = "GameController",
        Global = "Global",
    }
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
    function layerTest(cullingMask: CullingMask, layer: Layer): boolean;
}
declare namespace paper.editor {
    const context: EventDispatcher;
    enum selectItemType {
        GAMEOBJECT = 0,
        ASSET = 1,
    }
    /**
     * 编辑模型事件
     */
    class EditorModelEvent extends BaseEvent {
        static ADD_GAMEOBJECTS: string;
        static DELETE_GAMEOBJECTS: string;
        static SELECT_GAMEOBJECTS: string;
        static CHANGE_DIRTY: string;
        static CHANGE_PROPERTY: string;
        static CHANGE_EDIT_MODE: string;
        static CHANGE_EDIT_TYPE: string;
        static ADD_COMPONENT: string;
        static REMOVE_COMPONENT: string;
        static UPDATE_GAMEOBJECTS_HIREARCHY: string;
        static SAVE_ASSET: string;
        constructor(type: string, data?: any);
    }
    enum ModifyObjectType {
        GAMEOBJECT = 0,
        BASECOMPONENT = 1,
    }
    /**
     * 编辑模型
     */
    class EditorModel extends EventDispatcher {
        private _history;
        readonly history: History;
        private _scene;
        readonly scene: Scene;
        private _contentType;
        readonly contentType: "scene" | "prefab";
        private _contentUrl;
        readonly contentUrl: string;
        private _dirty;
        dirty: boolean;
        /**
         * 初始化
         * @param history
         */
        init(scene: paper.Scene, contentType: 'scene' | 'prefab', contentUrl: string): void;
        addState(state: BaseState | null): void;
        getEditType(propName: string, target: any): editor.EditType | null;
        setTransformProperty(propName: string, propValue: any, target: BaseComponent): void;
        createModifyGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        createModifyComponent(gameObjectUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): any;
        createAddComponentToPrefab(serializeData: any, gameObjIds: string[]): void;
        createModifyAssetPropertyState(assetUrl: string, newValueList: any[], preValueCopylist: any[]): void;
        createPrefabState(prefab: any): void;
        serializeProperty(value: any, editType: editor.EditType): any;
        deserializeProperty(serializeData: any, editType: editor.EditType): Promise<any>;
        createGameObject(parentList: GameObject[], createType: string): void;
        addComponent(gameObjectUUid: string, compClzName: string): void;
        removeComponent(gameObjectUUid: string, componentUUid: string): void;
        getComponentById(gameObject: GameObject, componentId: string): BaseComponent | null;
        getComponentByAssetId(gameObject: GameObject, assetId: string): BaseComponent | null;
        /**
         * 复制游戏对象
         * @param objs
         */
        copyGameObject(objs: GameObject[]): void;
        /**
         * 粘贴游戏对象
         * @param parent
         */
        pasteGameObject(parent: GameObject): void;
        /**
         * 克隆游戏对象
         * @param gameObjects
         */
        duplicateGameObjects(gameObjects: GameObject[]): void;
        /**
         * 删除游戏对象
         * @param gameObjects
         */
        deleteGameObject(gameObjects: GameObject[]): void;
        /**
         * 解除预置体联系
         * @param gameObjects
         */
        breakPrefab(gameObjects: GameObject[]): void;
        /**
         * 更改层级
         * */
        updateGameObjectsHierarchy(gameObjects: GameObject[], targetGameobjcet: GameObject, dir: 'top' | 'inner' | 'bottom'): void;
        /**
         * 设置对象的层级
         */
        setGameObjectsHierarchy(objects: GameObject[], targetObject: GameObject, dir: 'top' | 'inner' | 'bottom'): void;
        /**
         * 筛选层级中的顶层游戏对象
         * @param gameObjects
         */
        filtTopHierarchyGameObjects(gameObjects: GameObject[]): void;
        getGameObjectByUUid(uuid: string): GameObject | null;
        getAssetByAssetUrl(url: string): Promise<any>;
        getGameObjectsByUUids(uuids: string[]): GameObject[];
        private findOptionSetName(propName, target);
        setTargetProperty(propName: string, target: any, value: any): void;
        /**当前选中的对象 */
        currentSelected: GameObject[];
        /**
         * 选择游戏对象
         *  */
        selectGameObject(objs: GameObject[]): void;
        /**当前编辑模式 */
        currentEditMode: string;
        /**
         * 切换编辑模式
         */
        changeEditMode(mode: string): void;
        /**
         * 切换编辑类型
         */
        changeEditType(type: string): void;
        isPrefabRoot(gameObj: GameObject): boolean;
        isPrefabChild(gameObj: GameObject): boolean;
        /**将对象按照层级进行排序
         */
        sortGameObjectsForHierarchy(gameobjects: paper.GameObject[]): paper.GameObject[];
        createApplyPrefabState(applyData: editor.ApplyData, applyPrefabInstanceId: string, prefab: paper.Prefab): void;
        createRevertPrefabState(revertData: editor.revertData, revertPrefabInstanceId: string): void;
        deepClone<T>(obj: T): T;
        updateAsset(asset: Asset, prefabInstance?: GameObject | null): void;
        private _cacheIds;
        private findAssetRefs(target, as, refs?);
        private findFromChildren(source, as, refs, parent, key);
        getAllGameObjectsFromPrefabInstance(gameObj: paper.GameObject, objs?: paper.GameObject[] | null): GameObject[];
    }
}
declare namespace paper.editor {
    class EditorSceneModel {
        readonly editorScene: Scene;
        editorModel: EditorModel;
        private editorCameraScript;
        private pickGameScript;
        private geoController;
        private cameraObject;
        init(): void;
    }
}
declare namespace paper.editor {
    class Controller extends paper.Behaviour {
        private _modeCanChange;
        private _isEditing;
        selectedGameObjs: GameObject[];
        private _cameraObject;
        private bindMouse;
        private bindKeyboard;
        private mainGeo;
        private readonly controller;
        private _editorModel;
        editorModel: EditorModel;
        private geoCtrlMode;
        private geoCtrlType;
        constructor();
        onUpdate(): void;
        private updateInLocalMode();
        private updateInWorldMode();
        private _oldResult;
        private mouseRayCastUpdate();
        private _oldTransform;
        private geoChangeByCamera();
        private inputUpdate();
        private changeEditMode(mode);
        private changeEditType(type);
        private addEventListener();
        private selectGameObjects(gameObjs);
    }
}
declare namespace paper {
    /**
     * @internal
     */
    class GroupComponent extends paper.BaseComponent {
        componentIndex: number;
        componentClass: ComponentClass<BaseComponent>;
        private readonly _components;
        /**
         * @internal
         */
        _addComponent(component: BaseComponent): void;
        /**
         * @internal
         */
        _removeComponent(component: BaseComponent): void;
        readonly components: ReadonlyArray<BaseComponent>;
    }
}
declare namespace paper.editor {
    class xAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class xyAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class xzAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class yzAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class yAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class zAxis extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(selectedGameObjs: GameObject[]): void;
    }
}
declare namespace paper.editor {
    class xRot extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(): void;
        isPressed_local(): void;
        wasPressed_world(): void;
        isPressed_world(): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    class yRot extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(): void;
        isPressed_local(): void;
        wasPressed_world(): void;
        isPressed_world(): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    class zRot extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(): void;
        isPressed_local(): void;
        wasPressed_world(): void;
        isPressed_world(): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    class xScl extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    class yScl extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    class zScl extends BaseGeo {
        constructor();
        onSet(): void;
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any): void;
        wasReleased(): void;
    }
}
declare namespace paper.editor {
    type EventData = {
        isUndo: boolean;
    };
    type ApplyData = {
        [linkedId: string]: {
            addGameObjects?: {
                serializeData: any;
                cacheSerializeData?: {
                    [key: string]: ISerializedData[];
                };
            }[];
            addComponents?: {
                serializeData: any;
                cacheSerializeData?: any;
            }[];
            modifyGameObjectPropertyList?: {
                newValueList: any[];
                preValueCopylist: any[];
            }[];
            modifyComponentPropertyList?: {
                componentId: string;
                newValueList: any[];
                preValueCopylist: any[];
            }[];
        };
    };
    type revertData = {
        [linkedId: string]: {
            revertGameObjects?: {
                serializeData: any;
                id: string;
            }[];
            revertComponents?: {
                serializeData: any;
                id?: string;
            }[];
            modifyGameObjectPropertyList?: {
                newValueList: any[];
                preValueCopylist: any[];
            }[];
            modifyComponentPropertyList?: {
                componentId: string;
                newValueList: any[];
                preValueCopylist: any[];
            }[];
        };
    };
    const EventType: {
        HistoryState: string;
        HistoryAdd: string;
        HistoryFree: string;
    };
    class History {
        dispatcher: EventDispatcher | null;
        private _locked;
        private _index;
        private _batchIndex;
        private _states;
        private _batchStates;
        private _events;
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
        readonly batchIndex: number;
        readonly locked: 0 | 1 | 2 | 3;
        readonly states: BaseState[];
        serialize(): any;
        deserialize(serializeHistory: any): void;
    }
}
declare namespace paper {
    /**
     *
     */
    class MissingComponent extends BaseComponent {
        missingObject: any | null;
    }
}
declare namespace paper.editor {
    /**
     * 状态组
     * @author 杨宁
     */
    class StateGroup extends BaseState {
        private stateList;
        static create(stateList: BaseState[]): StateGroup;
        redo(): boolean;
        undo(): boolean;
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper.editor {
    class ModifyGameObjectPropertyState extends BaseState {
        static create(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyGameObjectPropertyState | null;
        private readonly stateData;
        undo(): boolean;
        private modifyProperty(valueList);
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyComponentPropertyState extends BaseState {
        static toString(): string;
        static create(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyComponentPropertyState | null;
        private readonly stateData;
        undo(): boolean;
        private modifyProperty(valueList);
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class CreateGameObjectState extends BaseState {
        static toString(): string;
        static create(parentList: GameObject[], createType: string): CreateGameObjectState | null;
        infos: {
            parentUUID: string;
            serializeData: any;
        }[];
        createType: string;
        addList: string[];
        private isFirst;
        undo(): boolean;
        redo(): boolean;
        private createGameObjectByType(createType);
    }
}
declare namespace paper.editor {
    class DeleteGameObjectsState extends BaseState {
        static toString(): string;
        static create(gameObjects: GameObject[], editorModel: EditorModel): DeleteGameObjectsState;
        private deleteInfo;
        undo(): boolean;
        redo(): boolean;
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper.editor {
    class DuplicateGameObjectsState extends BaseState {
        static toString(): string;
        static create(objs: GameObject[], editorModel: EditorModel): DuplicateGameObjectsState;
        private duplicateInfo;
        private addList;
        undo(): boolean;
        private firstDo;
        redo(): boolean;
        private clearPrefabInfo(obj);
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper.editor {
    class PasteGameObjectsState extends BaseState {
        static toString(): string;
        static create(serializeData: any[], parent: GameObject): PasteGameObjectsState;
        private pasteInfo;
        private cacheSerializeData;
        private addList;
        undo(): boolean;
        redo(): boolean;
        private clearPrefabInfo(obj);
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper.editor {
    class AddComponentState extends BaseState {
        static toString(): string;
        static create(gameObjectUUid: string, compClzName: string): AddComponentState | null;
        private readonly stateData;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class RemoveComponentState extends BaseState {
        static toString(): string;
        static create(gameObjectUUid: string, componentUUid: string, cacheSerializeData: any): RemoveComponentState | null;
        private readonly stateData;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    /**
     * 游戏对象层级
     * @author 杨宁
     */
    class GameObjectHierarchyState extends BaseState {
        private gameObjectsInfo;
        private targetObject;
        private targetDir;
        static create(gameObjects: GameObject[], targetGameObj: GameObject, dir: 'top' | 'inner' | 'bottom', editorModel: EditorModel): GameObjectHierarchyState;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyAssetPropertyState extends BaseState {
        static toString(): string;
        static create(assetUrl: string, newValueList: any[], preValueCopylist: any[]): ModifyAssetPropertyState | null;
        modifyAssetPropertyValues(assetUrl: string, valueList: any[]): Promise<void>;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class CreatePrefabState extends BaseState {
        static toString(): string;
        static create(prefab: any): CreatePrefabState | null;
        private readonly stateData;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    /**
     * 预置体结构状态
     * @author 杨宁
     */
    class BreakPrefabStructState extends BaseState {
        static create(prefabInstanceList: GameObject[]): BreakPrefabStructState;
        private static makePrefabInfo(gameOjbect);
        private prefabInfos;
        redo(): boolean;
        undo(): boolean;
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace paper.editor {
    class ApplyPrefabInstanceState extends BaseState {
        private firstRedo;
        static toString(): string;
        static create(applyData: editor.ApplyData, applyPrefabRootId: string, prefab: paper.Prefab): ApplyPrefabInstanceState | null;
        private readonly stateData;
        undo(): boolean;
        getAllUUidFromGameObject(gameObj: paper.GameObject, uuids?: string[] | null): string[];
        setLinkedId(gameObj: GameObject, ids: string[]): void;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
        private modifyPrefabGameObjectPropertyValues(linkedId, prefabObj, valueList);
        modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string, tempObj: GameObject, valueList: any[]): Promise<void>;
        setGameObjectPrefabRootId(gameObj: GameObject, rootID: string): void;
        getGameObjectsByLinkedId(linkedId: string, filterApplyRootId: string): GameObject[];
        getGameObjectByLinkedId(gameObj: paper.GameObject, linkedID: string): GameObject;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class RevertPrefabInstanceState extends BaseState {
        static toString(): string;
        static create(revertData: editor.revertData, revertPrefabRootId: string): RevertPrefabInstanceState;
        readonly stateData: {
            revertPrefabRootId: string;
            revertData: revertData;
        };
        undo(): boolean;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
        private modifyPrefabGameObjectPropertyValues(gameObj, valueList);
        modifyPrefabComponentPropertyValues(gameObj: GameObject, componentUUid: string, valueList: any[]): Promise<void>;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    /**
     * Represents a UUID as defined by rfc4122.
     */
    interface UUID {
        /**
         * @returns the canonical representation in sets of hexadecimal numbers separated by dashes.
         */
        asHex(): string;
    }
    function v4(): UUID;
    function isUUID(value: string): boolean;
    /**
     * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
     * @param value A uuid string.
     */
    function parse(value: string): UUID;
    function generateUuid(): string;
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
        private _mouseDown_m;
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
        clearSelected(): void;
        onUpdate(delta: number): any;
        private setStroke(picked);
    }
}
declare namespace paper.editor {
    class Gizmo extends paper.Behaviour {
        private static enabled;
        private static webgl;
        private static camera;
        onStart(): void;
        static Enabled(): void;
        static DrawIcon(path: string, pos: egret3d.Vector3, size: number, color?: egret3d.Color): void;
        private static verticesLine;
        private static lineVertexBuffer;
        static DrawLine(posStart: egret3d.Vector3, posEnd: egret3d.Vector3, size?: number, color?: number[]): void;
        private _oldTransform;
        private nrLine;
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
        private static _imageLoadCount;
        private static textures;
        private static initIconTexture();
        private static loadIconTexture(image, key);
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
declare namespace paper.editor {
    const icon_frag: string;
    const icon_vert: string;
    const line_frag: string;
    const line_vert: string;
}
declare namespace egret3d {
    class GizmoRenderSystem extends paper.BaseSystem {
        private readonly _renderState;
        onUpdate(): void;
    }
}
declare namespace egret3d {
    /**
     * @deprecated
     */
    const Prefab: typeof paper.Prefab;
    /**
     * @deprecated
     */
    type Prefab = paper.Prefab;
    /**
     * @deprecated
     */
    const RawScene: typeof paper.RawScene;
    /**
     * @deprecated
     */
    type RawScene = paper.RawScene;
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
        deserialize(element: any): this;
        clone(source: Keyframe): void;
    }
    class AnimationCurve implements paper.ISerializable {
        /**
         * 功能与效率平衡长度取4
         */
        private readonly _keys;
        private readonly _floatValues;
        serialize(): number[][];
        deserialize(element: any): this;
        evaluate(t?: number): number;
        readonly floatValues: Readonly<Float32Array>;
        clone(source: AnimationCurve): void;
    }
    class GradientColorKey extends paper.BaseObject {
        color: Color;
        time: number;
        deserialize(element: any): this;
    }
    class GradientAlphaKey extends paper.BaseObject {
        alpha: number;
        time: number;
        deserialize(element: any): this;
    }
    class Gradient extends paper.BaseObject {
        mode: GradientMode;
        private readonly alphaKeys;
        private readonly colorKeys;
        private readonly _alphaValue;
        private readonly _colorValue;
        deserialize(element: any): this;
        evaluate(t: number, out: Color): Color;
        readonly alphaValues: Readonly<Float32Array>;
        readonly colorValues: Readonly<Float32Array>;
    }
    class MinMaxCurve extends paper.BaseObject {
        mode: CurveMode;
        constant: number;
        constantMin: number;
        constantMax: number;
        readonly curve: AnimationCurve;
        readonly curveMin: AnimationCurve;
        readonly curveMax: AnimationCurve;
        deserialize(element: any): this;
        evaluate(t?: number): number;
        clone(source: MinMaxCurve): void;
    }
    class MinMaxGradient extends paper.BaseObject {
        mode: ColorGradientMode;
        readonly color: Color;
        readonly colorMin: Color;
        readonly colorMax: Color;
        readonly gradient: Gradient;
        readonly gradientMin: Gradient;
        readonly gradientMax: Gradient;
        deserialize(element: any): this;
        evaluate(t: number, out: Color): Color;
    }
    class Burst implements paper.ISerializable {
        time: number;
        minCount: number;
        maxCount: number;
        cycleCount: number;
        repeatInterval: number;
        serialize(): number[];
        deserialize(element: any): this;
    }
    abstract class ParticleSystemModule extends paper.BaseObject {
        enable: boolean;
        protected _comp: ParticleComponent;
        constructor(comp: ParticleComponent);
        /**
         * @internal
         */
        initialize(): void;
        deserialize(element: any): this;
    }
    class MainModule extends ParticleSystemModule {
        duration: number;
        loop: boolean;
        readonly startDelay: MinMaxCurve;
        readonly startLifetime: MinMaxCurve;
        readonly startSpeed: MinMaxCurve;
        readonly startSizeX: MinMaxCurve;
        readonly startSizeY: MinMaxCurve;
        readonly startSizeZ: MinMaxCurve;
        /**
         * @internal
         */
        _startRotation3D: boolean;
        readonly startRotationX: MinMaxCurve;
        readonly startRotationY: MinMaxCurve;
        readonly startRotationZ: MinMaxCurve;
        readonly startColor: MinMaxGradient;
        readonly gravityModifier: MinMaxCurve;
        /**
         * @internal
         */
        _simulationSpace: SimulationSpace;
        /**
         * @internal
         */
        _scaleMode: ScalingMode;
        playOnAwake: boolean;
        /**
         * @internal
         */
        _maxParticles: number;
        deserialize(element: any): this;
        startRotation3D: boolean;
        simulationSpace: SimulationSpace;
        scaleMode: ScalingMode;
        maxParticles: number;
    }
    class EmissionModule extends ParticleSystemModule {
        readonly rateOverTime: MinMaxCurve;
        readonly bursts: Array<Burst>;
        deserialize(element: any): this;
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
        deserialize(element: any): this;
        invalidUpdate(): void;
        generatePositionAndDirection(position: Vector3, direction: Vector3): void;
    }
    class VelocityOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        _mode: CurveMode;
        /**
         * @internal
         */
        _space: SimulationSpace;
        /**
         * @internal
         */
        readonly _x: MinMaxCurve;
        /**
         * @internal
         */
        readonly _y: MinMaxCurve;
        /**
         * @internal
         */
        readonly _z: MinMaxCurve;
        deserialize(element: any): this;
        mode: CurveMode;
        space: SimulationSpace;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class ColorOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        _color: MinMaxGradient;
        deserialize(element: any): this;
        color: Readonly<MinMaxGradient>;
    }
    class SizeOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        _separateAxes: boolean;
        /**
         * @internal
         */
        readonly _size: MinMaxCurve;
        /**
         * @internal
         */
        readonly _x: MinMaxCurve;
        /**
         * @internal
         */
        readonly _y: MinMaxCurve;
        /**
         * @internal
         */
        readonly _z: MinMaxCurve;
        deserialize(element: any): this;
        separateAxes: boolean;
        size: Readonly<MinMaxCurve>;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class RotationOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        _separateAxes: boolean;
        /**
         * @internal
         */
        readonly _x: MinMaxCurve;
        /**
         * @internal
         */
        readonly _y: MinMaxCurve;
        /**
         * @internal
         */
        readonly _z: MinMaxCurve;
        deserialize(element: any): this;
        separateAxes: boolean;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class TextureSheetAnimationModule extends ParticleSystemModule {
        /**
         * @internal
         */
        _numTilesX: number;
        /**
         * @internal
         */
        _numTilesY: number;
        /**
         * @internal
         */
        _animation: AnimationType;
        /**
         * @internal
         */
        _useRandomRow: boolean;
        /**
         * @internal
         */
        readonly _frameOverTime: MinMaxCurve;
        /**
         * @internal
         */
        readonly _startFrame: MinMaxCurve;
        /**
         * @internal
         */
        _cycleCount: number;
        /**
         * @internal
         */
        _rowIndex: number;
        private readonly _floatValues;
        deserialize(element: any): this;
        numTilesX: number;
        numTilesY: number;
        animation: AnimationType;
        useRandomRow: boolean;
        frameOverTime: Readonly<MinMaxCurve>;
        startFrame: Readonly<MinMaxCurve>;
        cycleCount: number;
        rowIndex: number;
        readonly floatValues: Readonly<Float32Array>;
    }
}
