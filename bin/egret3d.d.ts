declare namespace paper {
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
    /**
     * 标记组件是否在编辑模式拥有生命周期。
     */
    function executeInEditMode(target: ComponentClass<BaseComponent>): void;
    /**
     * 标记组件是否禁止在同一实体上添加多个实例。
     */
    function disallowMultiple(target: ComponentClass<BaseComponent>): void;
    /**
     * 标记组件依赖的其他组件。
     */
    function requireComponent(requireTarget: ComponentClass<BaseComponent>): (target: ComponentClass<BaseComponent>) => void;
}
declare namespace paper {
    /**
     * 生成 uuid 的方式。
     */
    let createUUID: () => string;
    let createAssetID: () => any;
    /**
     * 可序列化对象。
     */
    abstract class SerializableObject implements IUUID, ISerializable {
        /**
         *
         */
        uuid: string;
        serialize(): any;
        /**
         *
         */
        deserialize(element: any): void;
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
         *
         */
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
    }
    class Vector3 implements IVector3, paper.ISerializable {
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
        static release(value: Vector3): void;
        static subtract(v1: Readonly<IVector3>, v2: Readonly<IVector3>, out: IVector3): IVector3;
        static getSqrLength(v: Readonly<IVector3>): number;
        static getLength(v: Readonly<IVector3>): number;
        static getDistance(a: Readonly<IVector3>, b: Readonly<IVector3>): number;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number]>): void;
        copy(value: Readonly<IVector3>): this;
        clone(): Vector3;
        set(x?: number, y?: number, z?: number): this;
        normalize(): this;
        scale(scale: number): this;
        add(value: Readonly<IVector3>): this;
        subtract(value: Readonly<IVector3>): this;
        multiply(value: Readonly<IVector3>): this;
        cross(rhs: Readonly<IVector3>): this;
        dot(value: Readonly<IVector3>): number;
        min(v1: Readonly<IVector3>, v2: Readonly<IVector3>): this;
        max(v1: Readonly<IVector3>, v2: Readonly<IVector3>): this;
        lerp(v1: Readonly<IVector3>, v2: Readonly<IVector3>, v: number): this;
        equal(value: Readonly<IVector3>, threshold?: number): boolean;
        getDistance(value: Readonly<IVector3>): number;
        readonly length: number;
        readonly sqrtLength: number;
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
        static min(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static max(v1: Vector3, v2: Vector3, out: Vector3): Vector3;
        /**
         * @deprecated
         */
        static lerp(v1: Vector3, v2: Vector3, v: number, out: Vector3): Vector3;
        /**
         * @deprecated
         */
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
    class Matrix {
        private static readonly _instances;
        static create(): Matrix;
        static release(value: Matrix): void;
        readonly rawData: Float32Array;
        constructor(rawData?: Float32Array | null);
        copy(value: Readonly<Matrix>): this;
        clone(): Matrix;
        set(n11: number, n21: number, n31: number, n41: number, n12: number, n22: number, n32: number, n42: number, n13: number, n23: number, n33: number, n43: number, n14: number, n24: number, n34: number, n44: number): this;
        set3x3(n11: number, n21: number, n31: number, n12: number, n22: number, n32: number, n13: number, n23: number, n33: number): this;
        setTranslation(translation: Readonly<Vector3>): this;
        identity(): this;
        inverse(): this;
        transformVector3(value: Vector3): Vector3;
        transformNormal(value: Vector3): Vector3;
        static set(n11: number, n21: number, n31: number, n41: number, n12: number, n22: number, n32: number, n42: number, n13: number, n23: number, n33: number, n43: number, n14: number, n24: number, n34: number, n44: number, result: Matrix): Matrix;
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
        static transformVector3(vector: Vector3, transformMatrix: Matrix, result: Vector3): Vector3;
        static transformNormal(vector: Vector3, transformMatrix: Matrix, result: Vector3): Vector3;
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
        deserialize(element: [number, number]): void;
        copy(value: Readonly<IVector2>): this;
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
     *
     */
    type ComponentClass<T extends BaseComponent> = {
        new (): T;
        executeInEditMode: boolean;
        disallowMultiple: boolean;
        requireComponents: ComponentClass<BaseComponent>[] | null;
    };
    /**
     *
     */
    type SingletonComponentClass<T extends SingletonComponent> = ComponentClass<T> & {
        instance: T;
    };
    /**
     *
     */
    type ComponentClassArray = (ComponentClass<BaseComponent> | undefined)[];
    /**
     *
     */
    type ComponentArray = (BaseComponent | undefined)[];
    /**
     * 组件基类
     */
    abstract class BaseComponent extends SerializableObject {
        /**
         * 是否在编辑模式拥有生命周期。
         */
        static executeInEditMode: boolean;
        /**
         * 是否禁止在同一实体上添加多个实例。
         */
        static disallowMultiple: boolean;
        /**
         * 依赖的其他组件。
         */
        static requireComponents: ComponentClass<BaseComponent>[] | null;
        private static _createEnabled;
        private static _componentCount;
        private static readonly _componentClasses;
        assetID?: string;
        /**
         * 组件挂载的 GameObject
         */
        readonly gameObject: GameObject;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: any;
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
        serialize(): any;
        deserialize(element: any): void;
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
    }
}
declare namespace paper {
    /**
     *
     */
    class BaseObjectAsset extends Asset {
        protected _raw: ISerializedData;
        dispose(): void;
        caclByteLength(): number;
    }
    /**
     * 预制体资源。
     */
    class Prefab extends BaseObjectAsset {
        /**
         * 从当前预制体生成一个实例。
         */
        createInstance(): GameObject;
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
        deserialize(element: Readonly<[number, number, number, number]>): void;
        set(r?: number, g?: number, b?: number, a?: number): this;
        static multiply(c1: Color, c2: Color, out: Color): Color;
        static scale(c: Color, scaler: number): Color;
        static copy(c: Color, out: Color): Color;
        static lerp(c1: Color, c2: Color, value: number, out: Color): Color;
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
        protected _receiveShadows: boolean;
        protected _castShadows: boolean;
        protected _lightmapIndex: number;
        protected readonly _lightmapScaleOffset: Float32Array;
        receiveShadows: boolean;
        castShadows: boolean;
        lightmapIndex: number;
        readonly lightmapScaleOffset: Float32Array;
        setLightmapScaleOffset(scaleX: number, scaleY: number, offsetX: number, offsetY: number): void;
    }
}
declare namespace paper {
    /**
     * 系统基类。
     */
    abstract class BaseSystem {
        private static _createEnabled;
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
declare namespace paper {
    /**
     * 单例组件基类。
     */
    class SingletonComponent extends BaseComponent {
        /**
         *
         */
        static instance: SingletonComponent;
        initialize(): void;
        uninitialize(): void;
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
         * 创建一个空场景并激活
         */
        createScene(name: string, isActive?: boolean): Scene;
        /**
         * 加载场景
         * @param resourceName 资源名称
         */
        loadScene(resourceName: string, combineStaticObjects?: boolean): Scene;
        /**
         * 卸载指定场景。
         */
        unloadScene(scene: Scene): void;
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
        getActiveScene(): Scene;
    }
}
declare namespace egret3d {
    interface IVector4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }
    class Vector4 implements IVector4, paper.ISerializable {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        serialize(): number[];
        deserialize(element: [number, number, number, number]): void;
        copy(value: Readonly<IVector4>): this;
        clone(): Vector4;
        set(x: number, y: number, z: number, w: number): this;
        normalize(): this;
    }
    const helpVector4A: Vector4;
    const helpVector4B: Vector4;
    const helpVector4C: Vector4;
    const helpVector4D: Vector4;
    const helpVector4E: Vector4;
    const helpVector4F: Vector4;
}
declare namespace egret3d {
    class Quaternion implements IVector4, paper.ISerializable {
        private static readonly _instances;
        static create(x?: number, y?: number, z?: number, w?: number): Quaternion;
        static release(value: Quaternion): void;
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        serialize(): number[];
        deserialize(element: Readonly<[number, number, number, number]>): void;
        copy(value: Readonly<IVector4>): this;
        clone(): Quaternion;
        set(x?: number, y?: number, z?: number, w?: number): this;
        normalize(): this;
        inverse(): this;
        multiply(value: Readonly<IVector4>): this;
        transformVector3(value: IVector3): IVector3;
        /**
         * @deprecated
         */
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
        static inverse(q: Quaternion, out: Quaternion): Quaternion;
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
        deserialize(element: number[]): void;
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
         *
         */
        readonly systems: ReadonlyArray<BaseSystem>;
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
        TEXCOORD_1 = "TEXCOORD_",
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
        [k: string]: any;
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
        [k: string]: any;
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
            [k: string]: egret3d.GLTFAttribute;
        };
        /**
         * A dictionary object of `Uniform` objects.
         */
        uniforms: {
            /**
             * A uniform input to a technique, and an optional semantic and value.
             */
            [k: string]: egret3d.GLTFUniform;
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
declare namespace paper {
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
declare namespace paper.editor {
    abstract class BaseState {
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
         *
         */
        locked: boolean;
        readonly name: string;
        private _isRemoved;
        private readonly _isBehaviour;
        private readonly _bufferedGameObjects;
        private _gameObjects;
        private readonly _bufferedComponents;
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
declare namespace paper {
    /**
     * 场景类
     */
    class Scene extends SerializableObject {
        /**
         * 场景名称。
         */
        name: string;
        /**
         * 场景的light map列表。
         */
        readonly lightmaps: egret3d.Texture[];
        /**
         * lightmap强度
         */
        lightmapIntensity: number;
        /**
         * 存储着关联的数据
         * 场景保存时，将场景快照数据保存至对应的资源中
         */
        rawScene: RawScene | null;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        extras?: any;
        /**
         * 返回当前激活场景中查找对应名称的GameObject
         * @param name
         */
        find(name: string): GameObject;
        /**
         * 返回一个在当前激活场景中查找对应tag的GameObject
         * @param tag
         */
        findWithTag(tag: string): GameObject;
        /**
         * 返回一个在当前激活场景中查找对应 uuid 的GameObject
         * @param uuid
         */
        findWithUUID(uuid: string): GameObject;
        /**
         * 返回所有在当前激活场景中查找对应tag的GameObject
         * @param name
         */
        findGameObjectsWithTag(tag: string): GameObject[];
        /**
         * 获取所有根级GameObject对象
         */
        getRootGameObjects(): GameObject[];
        readonly gameObjectCount: number;
        /**
         * 当前场景的所有GameObject对象池
         */
        readonly gameObjects: ReadonlyArray<GameObject>;
    }
}
declare namespace paper {
}
declare namespace paper {
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
}
declare namespace paper {
    /**
     * 可以挂载Component的实体类。
     */
    class GameObject extends SerializableObject {
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
        assetID?: string;
        /**
         * 预制体
         */
        prefab: Prefab | null;
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
        extras: {
            isPrefabRoot?: boolean;
            prefabRootId?: string;
        };
        private _activeSelf;
        private readonly _components;
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
         *
         */
        destroy(): void;
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
         * 组件列表
         */
        readonly components: Readonly<ComponentArray>;
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
declare namespace paper {
    /**
     * 序列化场景，实体或组件。
     */
    function serialize(source: Scene | GameObject | BaseComponent): ISerializedData;
    /**
     * 创建指定资源的引用。
     */
    function createAssetReference(source: Asset): IAssetReference;
    /**
     * 创建指定对象的引用。
     */
    function createReference(source: Scene | GameObject | BaseComponent, isOnlyUUID: boolean): any;
    /**
     * 创建指定对象的结构体。
     */
    function createStruct(source: SerializableObject): any;
}
declare namespace paper.editor {
    const icon_frag: string;
    const icon_vert: string;
    const line_frag: string;
    const line_vert: string;
}
declare namespace paper {
    /**
     * 组件事件。
     */
    namespace EventPool {
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
        readonly minimum: Vector3;
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
        readonly maximum: Vector3;
        private _dirtyCenter;
        private _dirtyRadius;
        private srcmin;
        private srcmax;
        /**
         * build a aabb
         * @param minimum min point
         * @param maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构建轴对称包围盒
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        constructor(minimum?: Vector3, maximum?: Vector3);
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
    const enum DefaultTags {
        Untagged = "",
        Respawn = "Respawn",
        Finish = "Finish",
        EditorOnly = "EditorOnly",
        MainCamera = "MainCamera",
        Player = "Player",
        GameController = "GameController",
        Global = "global",
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
declare namespace paper {
    /**
     * 克隆
     */
    function clone(object: GameObject): GameObject;
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
declare namespace paper {
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
    interface GLTFEgret extends gltf.GLTF {
        extensions?: {
            paper?: {
                renderQueue?: number;
            };
            KHR_techniques_webgl?: gltf.KhrTechniqueWebglGlTfExtension;
        };
    }
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
    interface GLTFMaterial extends gltf.Material {
        extensions?: {
            KHR_techniques_webgl: gltf.KhrTechniquesWebglMaterialExtension;
            paper: {
                renderQueue: number;
            };
        };
    }
    interface GLTFAttribute extends gltf.Attribute {
        extensions?: {
            paper: {
                enable: boolean;
                location: number;
            };
        };
    }
    interface GLTFUniform extends gltf.Uniform {
        extensions?: {
            paper: {
                enable: boolean;
                location: WebGLUniformLocation;
                textureUnits?: number[];
            };
        };
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
        static createGLTFExtensionsAsset(url?: string): GLTFAsset;
        static createTechnique(source: gltf.Technique): gltf.Technique;
        /**
         * Buffer 列表。
         */
        readonly buffers: (Float32Array | Uint32Array | Uint16Array)[];
        /**
         * 配置。
         */
        config: GLTFEgret;
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
        caclByteLength(): number;
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
        protected _drawMode: MeshDrawMode;
        protected _glTFMeshIndex: number;
        protected _glTFAsset: GLTFAsset;
        protected _glTFMesh: gltf.Mesh;
        protected _vertexBuffer: Float32Array;
        /**
         * 暂时实现在这里，应实现到 gltf material。
         */
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
        serialize(): any;
        deserialize(element: any): void;
        dispose(): void;
        caclByteLength(): number;
        /**
         *
         */
        clone(): Mesh;
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
        /**
         * @deprecated
         */
        getAttribute<T extends (Vector4 | Vector3 | Vector2)>(vertexIndex: number, attributeType: gltf.MeshAttribute, subMeshIndex?: number, result?: T): T;
        /**
         * @deprecated
         */
        setAttribute(vertexIndex: number, attributeType: gltf.MeshAttribute, subMeshIndex: number, ...args: number[]): void;
    }
}
declare namespace egret3d {
}
declare namespace egret3d {
}
declare namespace egret3d {
    /**
     *
     */
    class Pool<T> {
        private readonly _instances;
        clear(): void;
        add(instanceOrInstances: T | (T[])): void;
        remove(instanceOrInstances: T | (T[])): void;
        get(): T;
        readonly instances: T[];
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
        private _dirtyAABB;
        private _dirtyLocal;
        private _dirtyWorld;
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
        private _removeFromChildren(value);
        private _buildAABB();
        private _sync();
        private _dirtify(local?);
        /**
         * 父节点发生改变的回调方法
         * 子类可通过重载此方法进行标脏状态传递
         */
        protected _onParentChange(newParent: Transform | null, oldParent: Transform | null): void;
        private _getAllChildren(children);
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
        /**
         * 当前子集对象的数量
         */
        readonly childCount: number;
        /**
         *
         */
        readonly aabb: AABB;
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
    type ImmutableVector4 = Readonly<Float32Array>;
}
declare namespace egret3d {
    /**
     *
     */
    class DefaultMaterials extends paper.SingletonComponent {
        static DefaultDiffuse: Material;
        static MissingMaterial: Material;
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
        shadow?: Material;
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
        private _sortTransparent(a, b);
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
        onAddGameObject(gameObject: paper.GameObject, group: paper.Group): void;
        onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group): void;
        onUpdate(deltaTime: number): void;
    }
}
declare namespace egret3d {
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
         * @default CullingMask.Everything
         * @version paper 1.0
         * @platform Web
         * @language
         */
        cullingMask: paper.CullingMask;
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
        readonly backgroundColor: Color;
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
         * 设置render target与viewport
         * @param target render target
         * @param withoutClear 强制不清除缓存
         *
         */
        _targetAndViewport(target: IRenderTarget | null, withoutClear: boolean): void;
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
        calcViewPortPixel(viewPortPixel: IRectangle): void;
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
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
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
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
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
        /**
         *
         */
        drawCall: DrawCall;
        updateLightmap(texture: Texture, uv: number, offset: Float32Array, intensity: number): void;
        updateCamera(camera: Camera, matrix: Matrix): void;
        updateLights(lights: ReadonlyArray<BaseLight>): void;
        updateModel(matrix: Matrix): void;
        updateBones(data: Float32Array | null): void;
        readonly lightPosition: Float32Array;
        lightShadowCameraNear: number;
        lightShadowCameraFar: number;
        updateLightDepth(light: BaseLight): void;
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
    class Egret2DRendererSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof Egret2DRenderer;
        }[];
        onUpdate(deltaTime: number): void;
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
declare namespace paper {
    /**
     *
     */
    class MissingComponent extends BaseComponent {
        missingObject: any | null;
        serialize(): any;
        deserialize(element: any): void;
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
declare namespace paper {
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
        private _getMatByIndex(index, out);
        initialize(): void;
        uninitialize(): void;
        serialize(): any;
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
         * 动画数据列表。
         */
        private readonly _animations;
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes;
        private _fadeInParamter;
        /**
         * 最后一个播放的动画状态。
         * 当进行动画混合时，该值通常没有任何意义。
         */
        private _lastAnimationState;
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
    /**
     *
     */
    class AnimationSystem extends paper.BaseSystem {
        protected readonly _interests: {
            componentClass: typeof Animation;
        }[];
        onAddGameObject(gameObject: paper.GameObject, group: paper.Group): void;
        onUpdate(): void;
        onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group): void;
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
        clone(source: Keyframe): void;
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
        clone(source: AnimationCurve): void;
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
        clone(source: MinMaxCurve): void;
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
        readonly startSizeX: MinMaxCurve;
        readonly startSizeY: MinMaxCurve;
        readonly startSizeZ: MinMaxCurve;
        readonly startRotationX: MinMaxCurve;
        readonly startRotationY: MinMaxCurve;
        readonly startRotationZ: MinMaxCurve;
        readonly startColor: MinMaxGradient;
        readonly gravityModifier: MinMaxCurve;
        playOnAwake: boolean;
        deserialize(element: any): void;
        startRotation3D: boolean;
        simulationSpace: SimulationSpace;
        scaleMode: ScalingMode;
        maxParticles: number;
    }
    class EmissionModule extends ParticleSystemModule {
        readonly rateOverTime: MinMaxCurve;
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
        deserialize(element: any): void;
        mode: CurveMode;
        space: SimulationSpace;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class ColorOverLifetimeModule extends ParticleSystemModule {
        deserialize(element: any): void;
        color: Readonly<MinMaxGradient>;
    }
    class SizeOverLifetimeModule extends ParticleSystemModule {
        deserialize(element: any): void;
        separateAxes: boolean;
        size: Readonly<MinMaxCurve>;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class RotationOverLifetimeModule extends ParticleSystemModule {
        deserialize(element: any): void;
        separateAxes: boolean;
        x: Readonly<MinMaxCurve>;
        y: Readonly<MinMaxCurve>;
        z: Readonly<MinMaxCurve>;
    }
    class TextureSheetAnimationModule extends ParticleSystemModule {
        private readonly _floatValues;
        deserialize(element: any): void;
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
declare namespace egret3d.particle {
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
declare namespace egret3d.particle {
    const BillboardPerVertexCount = 37;
    const MeshPerVertexCount = 42;
    const enum ParticleRendererEventType {
        Mesh = "mesh",
        Materials = "materials",
        RenderMode = "renderMode",
        LengthScaleChanged = "lengthScale",
        VelocityScaleChanged = "velocityScale",
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
    class ParticleRenderer extends paper.BaseRenderer {
        private _mesh;
        private readonly _materials;
        velocityScale: number;
        _renderMode: ParticleRenderMode;
        lengthScale: number;
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
        onAddGameObject(gameObject: paper.GameObject, group: paper.Group): void;
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
    class Material extends paper.SerializableObject {
        private _glTFMaterialIndex;
        private _glTFAsset;
        private _cacheDefines;
        private _textureRef;
        private readonly _defines;
        version: number;
        constructor();
        constructor(shader: GLTFAsset);
        constructor(gltfAsset: GLTFAsset, gltfMaterialIndex: number);
        /**
         * 释放资源。
         */
        dispose(): void;
        /**
         * 克隆材质资源。
         */
        clone(): Material;
        serialize(): any;
        deserialize(element: any): void;
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
        readonly shader: GLTFAsset;
        renderQueue: RenderQueue;
        readonly shaderDefine: string;
    }
}
declare namespace egret3d {
    /**
     * 射线
     */
    class Ray {
        /**
         * 射线起始点
         */
        origin: Vector3;
        /**
         * 射线的方向向量
         */
        direction: Vector3;
        /**
         * 构建一条射线
         * @param origin 射线起点
         * @param dir 射线方向
         */
        constructor(origin: Vector3, direction: Vector3);
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
        intersectsTriangle(vertex0: Vector3, vertex1: Vector3, vertex2: Vector3): PickInfo;
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
declare namespace egret3d.ShaderLib {
    const alphaBlend_frag = "\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _TintColor;\nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main()\n{   \n gl_FragColor=texture2D(_MainTex,xlv_TEXCOORD0)*_TintColor*2.0;\n    gl_FragColor.a = clamp(gl_FragColor.a, 0.0, 1.0);\n}";
    const alphaCut_frag = "#include <common>\nuniform sampler2D _MainTex;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main()\n{   \n lowp vec4 outColor=texture2D(_MainTex,xlv_TEXCOORD0);\n    if(outColor.a < _AlphaCut)\n        discard;\n    gl_FragColor = outColor;\n}";
    const boneeff_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp vec4 glstate_vec4_bones[110];\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nmat4 buildMat4(int index)\n{\n vec4 quat = glstate_vec4_bones[index * 2 + 0];\n vec4 translation = glstate_vec4_bones[index * 2 + 1];\n float xy2 = 2.0 * quat.x * quat.y;\n float xz2 = 2.0 * quat.x * quat.z;\n float xw2 = 2.0 * quat.x * quat.w;\n float yz2 = 2.0 * quat.y * quat.z;\n float yw2 = 2.0 * quat.y * quat.w;\n float zw2 = 2.0 * quat.z * quat.w;\n float xx = quat.x * quat.x;\n float yy = quat.y * quat.y;\n float zz = quat.z * quat.z;\n float ww = quat.w * quat.w;\n mat4 matrix = mat4(\n xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,\n xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,\n xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,\n translation.x, translation.y, translation.z, 1);\n return matrix;\n}\n\nhighp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)\n{\n int i = int(blendIndex.x);  \n    int i2 =int(blendIndex.y);\n int i3 =int(blendIndex.z);\n int i4 =int(blendIndex.w);\n \n    mat4 mat = buildMat4(i)*blendWeight.x \n    + buildMat4(i2)*blendWeight.y \n    + buildMat4(i3)*blendWeight.z \n    + buildMat4(i4)*blendWeight.w;\n return mat* srcVertex;\n}\n\n\nvoid main()\n{                                               \n    highp vec4 tmpvar_1 = vec4(calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz, 1.0);\n    \n    gl_Position = glstate_matrix_mvp *  tmpvar_1;\n\n xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n}";
    const bonelambert_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec3 _glesNormal; \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;             \nattribute vec4 _glesMultiTexCoord0;    \n\nuniform mat4 glstate_matrix_mvp;      \nuniform mat4 glstate_matrix_model;\n\nuniform highp vec4 glstate_vec4_bones[110];\nuniform highp vec4 _MainTex_ST; \n\n#include <shadowMap_pars_vert>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#include <transpose>\n#include <inverse>\n\nmat4 buildMat4(int index)\n{\n vec4 quat = glstate_vec4_bones[index * 2 + 0];\n vec4 translation = glstate_vec4_bones[index * 2 + 1];\n float xy2 = 2.0 * quat.x * quat.y;\n float xz2 = 2.0 * quat.x * quat.z;\n float xw2 = 2.0 * quat.x * quat.w;\n float yz2 = 2.0 * quat.y * quat.z;\n float yw2 = 2.0 * quat.y * quat.w;\n float zw2 = 2.0 * quat.z * quat.w;\n float xx = quat.x * quat.x;\n float yy = quat.y * quat.y;\n float zz = quat.z * quat.z;\n float ww = quat.w * quat.w;\n mat4 matrix = mat4(\n xx - yy - zz + ww, xy2 + zw2, xz2 - yw2, 0,\n xy2 - zw2, -xx + yy - zz + ww, yz2 + xw2, 0,\n xz2 + yw2, yz2 - xw2, -xx - yy + zz + ww, 0,\n translation.x, translation.y, translation.z, 1);\n return matrix;\n}\n\nhighp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)\n{\n int i = int(blendIndex.x);  \n    int i2 =int(blendIndex.y);\n int i3 =int(blendIndex.z);\n int i4 =int(blendIndex.w);\n \n    mat4 mat = buildMat4(i)*blendWeight.x \n    + buildMat4(i2)*blendWeight.y \n    + buildMat4(i3)*blendWeight.z \n    + buildMat4(i4)*blendWeight.w;\n return mat* srcVertex;\n}\n\nvoid main() {   \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = calcVertex(_glesVertex,_glesBlendIndex4,_glesBlendWeight4).xyz;                            \n\n    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(_glesNormal, 1.0)).xyz;\n    xlv_NORMAL = normal;\n    #ifdef FLIP_SIDED\n     xlv_NORMAL = - xlv_NORMAL;\n    #endif\n\n    vec3 worldpos = (glstate_matrix_model * tmpvar_1).xyz;\n    xlv_POS = worldpos; \n\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n\n    #include <shadowMap_vert>\n     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const bone_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesBlendIndex4;\nattribute vec4 _glesBlendWeight4;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp mat4 glstate_matrix_bones[24];\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nvoid main()                                     \n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;  \n \n    int i = int(_glesBlendIndex4.x);  \n    int i2 =int(_glesBlendIndex4.y);\n int i3 =int(_glesBlendIndex4.z);\n int i4 =int(_glesBlendIndex4.w);\n \n    mat4 mat = glstate_matrix_bones[i]*_glesBlendWeight4.x \n    + glstate_matrix_bones[i2]*_glesBlendWeight4.y \n    + glstate_matrix_bones[i3]*_glesBlendWeight4.z \n    + glstate_matrix_bones[i4]*_glesBlendWeight4.w;\n    \n    gl_Position = (glstate_matrix_mvp * mat)* tmpvar_1;\n\n xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\n}";
    const code2_frag = "#include <common>\nvoid main() {\n    gl_FragData[0] = vec4(1.0, 1.0, 1.0, 1.0);\n}";
    const code_frag = "#include <common>\nuniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() {\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    prev_2 = tmpvar_3;\n    mediump vec4 tmpvar_4;\n    tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    col_1 = tmpvar_4;\n    col_1.x =xlv_TEXCOORD0.x;\n    col_1.y =xlv_TEXCOORD0.y;\n    gl_FragData[0] = col_1;\n}";
    const code_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesColor;             \nattribute vec4 _glesMultiTexCoord0;    \nuniform highp mat4 glstate_matrix_mvp; \nvarying lowp vec4 xlv_COLOR;           \nvarying highp vec2 xlv_TEXCOORD0;      \nvoid main() {                                          \n    highp vec4 tmpvar_1;                   \n    tmpvar_1.w = 1.0;                      \n    tmpvar_1.xyz = _glesVertex.xyz;        \n    xlv_COLOR = _glesColor;                \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const depthpackage_frag = "#include <common>\n#include <packing>\n\nvoid main() {\n gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n}";
    const depthpackage_vert = "#include <common>\nattribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\n\nvoid main() { \n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const diffuselightmap_frag = "#include <common>\nuniform sampler2D _MainTex;\nuniform sampler2D _LightmapTex;\nuniform lowp float _LightmapIntensity;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nlowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)\n{\n    highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);\n    return data.rgb * power * intensity;\n}\nvoid main() \n{\n    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0);\n    if(outColor.a < _AlphaCut)\n        discard;\n    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);\n    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);\n    gl_FragData[0] = outColor;\n}";
    const diffuselightmap_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nattribute vec4 _glesMultiTexCoord1;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 glstate_lightmapOffset;\nuniform lowp float glstate_lightmapUV;\nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;\nvarying highp vec2 xlv_TEXCOORD1;\nvoid main()\n{\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  \n\n    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;\n    if(glstate_lightmapUV == 0.0)\n    {\n        beforelightUV = _glesMultiTexCoord0.xy;\n    }\n    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;\n    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);\n    xlv_TEXCOORD1 = vec2(u,v);\n\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const diffuse_frag = "#include <common>\n#include <lightmap_pars_frag>\nuniform sampler2D _MainTex;\nuniform lowp float _AlphaCut;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 outColor = texture2D(_MainTex, xlv_TEXCOORD0);\n    if(outColor.a < _AlphaCut)\n        discard;\n    #include <lightmap_frag>    \n}";
    const diffuse_vert = "#include <common>\n#include <skinning_pars_vert>\n#include <lightmap_pars_vert> \nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0;\nuniform highp mat4 glstate_matrix_mvp;\nuniform highp vec4 _MainTex_ST;  \nvarying highp vec2 xlv_TEXCOORD0;\n\nvoid main() {\n    // highp vec4 tmpVertex;\n    #include <skinning_base_vert>\n    // tmpVertex.w = 1.0;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\n    #include <lightmap_vert>\n    gl_Position = (glstate_matrix_mvp * tmpVertex);\n}";
    const distancepackage_frag = "#include <common>\n#include <packing>\n\nvarying vec3 xlv_POS;\nuniform vec4 glstate_referencePosition;\nuniform float glstate_nearDistance;\nuniform float glstate_farDistance;\n\nvoid main() {\n    float dist = length( xlv_POS - glstate_referencePosition.xyz );\n dist = ( dist - glstate_nearDistance ) / ( glstate_farDistance - glstate_nearDistance );\n dist = saturate( dist ); // clamp to [ 0, 1 ]\n\n gl_FragColor = packDepthToRGBA( dist );\n}";
    const distancepackage_vert = "#include <common>\nattribute vec3 _glesVertex;\n\nuniform mat4 glstate_matrix_mvp;\nuniform mat4 glstate_matrix_model;\n\nvarying vec3 xlv_POS;\n\nvoid main() {   \n    xlv_POS = (glstate_matrix_model * vec4(_glesVertex, 1.0)).xyz;\n    gl_Position = glstate_matrix_mvp * vec4(_glesVertex, 1.0);\n}";
    const lambert_frag = "// #extension GL_OES_standard_derivatives : enable\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _Color;         \n\n#include <bsdfs>\n#include <light_pars_frag>\n#include <shadowMap_pars_frag>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;                \nvarying vec2 xlv_TEXCOORD0;\n\n#ifdef USE_NORMAL_MAP\n    #include <tbn>\n    #include <tsn>\n    uniform sampler2D _NormalTex;\n#endif\n\n#include <bumpMap_pars_frag>\n\nvoid main() {\n    vec4 outColor = vec4(0., 0., 0., 1.);\n\n    vec4 diffuseColor = _Color * texture2D(_MainTex, xlv_TEXCOORD0);\n\n    #include <normal_frag>\n    #include <light_frag>\n    \n    outColor.a = diffuseColor.a;\n\n    gl_FragColor = outColor;\n}";
    const lambert_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec3 _glesNormal;               \nattribute vec4 _glesMultiTexCoord0;\n#include <skinning_pars_vert>\n\nuniform mat4 glstate_matrix_mvp;      \nuniform mat4 glstate_matrix_model;\n\n#include <shadowMap_pars_vert>\n\nvarying vec3 xlv_POS;\nvarying vec3 xlv_NORMAL;             \nvarying vec2 xlv_TEXCOORD0;\n\n#include <transpose>\n#include <inverse>\n\nvoid main() {   \n    #include <skinning_base_vert>\n\n    vec3 tmpNormal;      \n    #include <skinning_normal_vert>              \n\n    vec3 normal = (transpose(inverse(glstate_matrix_model)) * vec4(tmpNormal, 1.0)).xyz;\n    xlv_NORMAL = normal;\n    #ifdef FLIP_SIDED\n     xlv_NORMAL = - xlv_NORMAL;\n    #endif\n\n    vec3 worldpos = (glstate_matrix_model * tmpVertex).xyz;\n    xlv_POS = worldpos; \n\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\n\n    #include <shadowMap_vert>\n     \n    gl_Position = (glstate_matrix_mvp * tmpVertex);\n}";
    const line_frag = "#include <common>\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    gl_FragData[0] = xlv_COLOR;\n}";
    const line_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesColor;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _glesColor;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const materialcolor_vert = "#include <common>\nattribute vec4 _glesVertex;\nuniform vec4 _Color;\nuniform highp mat4 glstate_matrix_mvp;\nvarying lowp vec4 xlv_COLOR;\nvoid main() {\n    highp vec4 tmpvar_1;\n    tmpvar_1.w = 1.0;\n    tmpvar_1.xyz = _glesVertex.xyz;\n    xlv_COLOR = _Color;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);\n}";
    const particlesystem_frag = "\n//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.ps\n#include <common>\nuniform sampler2D _MainTex;\nuniform vec4 _TintColor;\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n\n#ifdef RENDERMODE_MESH\n varying vec4 v_mesh_color;\n#endif\n\nvoid main()\n{ \n #ifdef RENDERMODE_MESH\n  gl_FragColor=v_mesh_color;\n #else\n  gl_FragColor=vec4(1.0); \n #endif\n\n if(v_discard!=0.0)\n  discard;\n gl_FragColor*=texture2D(_MainTex,v_texcoord)*_TintColor*v_color*2.0;\n}";
    const particlesystem_vert = "//inspired by layaair:https://github.com/layabox/layaair/blob/master/src/d3/src/laya/d3/shader/files/ParticleShuriKen.vs\n#include <common>\n#if defined(SPHERHBILLBOARD)||defined(STRETCHEDBILLBOARD)||defined(HORIZONTALBILLBOARD)||defined(VERTICALBILLBOARD)\n attribute vec2 _glesCorner;\n#endif\n#ifdef RENDERMESH\n attribute vec3 _glesVertex;\n attribute vec4 _glesColor;\n#endif\nattribute vec2 _glesMultiTexCoord0;\nattribute vec3 _startPosition;\nattribute vec3 _startVelocity;\nattribute vec4 _startColor;\nattribute vec3 _startSize;\nattribute vec3 _startRotation;\nattribute vec2 _time;\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)||defined(ROTATIONTWOCONSTANTS)||defined(ROTATIONTWOCURVES)\n  attribute vec4 _random0;\n#endif\n#if defined(TEXTURESHEETANIMATIONTWOCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  attribute vec4 _random1;\n#endif\nattribute vec3 _startWorldPosition;\nattribute vec4 _startWorldRotation;\n\n#include <particle_common>\n\nvoid main()\n{\n float age = u_currentTime - _time.y;\n float t = age/_time.x;\n if(t>1.0){    \n   v_discard=1.0;\n   return;\n  }\n   \n #include <particle_affector>\n gl_Position=glstate_matrix_vp*vec4(center,1.0);\n v_color = computeColor(_startColor, t);\n v_texcoord =computeUV(_glesMultiTexCoord0, t);\n v_discard=0.0;\n}\n\n";
    const postdepth_frag = "#include <common>\n//varying highp vec3 xlv_Normal;   \n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\nvec2 packDepthToRG( const in float v ) \n{\n    vec2 r = vec2( fract( v * PackFactors.z ), v );\n r.y -= r.x * ShiftRight8;\n    return r * PackUpscale;\n}\nfloat unpackRGToDepth( const in vec2 v ) \n{\n    return dot( v.xy, UnpackFactors.zw );\n}\nvec3 packDepthToRGB( const in float v ) \n{\n    vec3 r = vec3( fract( v * PackFactors.yz ), v );\n r.yz -= r.xy * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBToDepth( const in vec3 v ) \n{\n    return dot( v.xyz, UnpackFactors.yzw );\n}\nvoid main() \n{\n    float z = gl_FragCoord.z;// fract(gl_FragCoord.z *256.*256.);\n    // highp vec2 normal =xlv_Normal.xy;\n    gl_FragColor=packDepthToRGBA(z);\n}";
    const postdepth_vert = "#include <common>\nprecision highp float;\nattribute vec4 _glesVertex;    \n\nuniform highp mat4 glstate_matrix_mvp;      \n            \nvoid main()                                     \n{        \n    gl_Position = (glstate_matrix_mvp * _glesVertex);  \n}";
    const postquaddepth_frag = "#include <common>\nprecision mediump float;\nvarying highp vec2 xlv_TEXCOORD0;       \nuniform sampler2D _DepthTex;   \nuniform sampler2D _MainTex;  \n\n\nconst float PackUpscale = 256. / 255.; \n// fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; \n// 0..1 -> fraction (excluding 1)\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) \n{\n    vec4 r = vec4( fract( v * PackFactors ), v );\n r.yzw -= r.xyz * ShiftRight8;\n // tidy overflow\n    return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) \n{\n    return dot( v, UnpackFactors );\n}\n\n\nfloat planeDistance(const in vec3 positionA, const in vec3 normalA, \n                    const in vec3 positionB, const in vec3 normalB) \n{\n  vec3 positionDelta = positionB-positionA;\n  float planeDistanceDelta = max(abs(dot(positionDelta, normalA)), abs(dot(positionDelta, normalB)));\n  return planeDistanceDelta;\n}\n\nvoid main()         \n{\n    lowp vec4 c1=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0.001,0));\n    lowp vec4 c2=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(-0.001,0));\n    lowp vec4 c3=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,0.001));\n    lowp vec4 c4=texture2D(_DepthTex, xlv_TEXCOORD0+vec2(0,-0.001));\n    highp float z1 = unpackRGBAToDepth(c1);\n    highp float z2 = unpackRGBAToDepth(c2);\n    highp float z3 = unpackRGBAToDepth(c3);\n    highp float z4 = unpackRGBAToDepth(c4);\n    highp float d = clamp(  (abs(z2-z1)+abs(z4-z3))*10.0,0.0,1.0);\n    lowp vec4 c=texture2D(_MainTex, xlv_TEXCOORD0);\n    lowp float g = c.r*0.3+c.g*0.6+c.b*0.1;\n\n    gl_FragColor =mix(vec4(g,g,g,1.),vec4(1.0,1.0,0.0,1.0),d);// vec4(g*d,g*d,g*d,1.0);\n}";
    const postquad_vert = "#include <common>\nattribute vec4 _glesVertex;\nattribute vec4 _glesMultiTexCoord0; \nuniform highp vec4 _MainTex_ST; \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main()                     \n{ \n    gl_Position = _glesVertex;\n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw; \n}   ";
    const tintcolor_frag = "#include <common>\nuniform sampler2D _MainTex;\nuniform lowp float _AlphaCut;\nuniform lowp vec4 _TintColor;\n\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() \n{\n    lowp vec4 tmpvar_3 = _TintColor*texture2D(_MainTex, xlv_TEXCOORD0);\n    if(tmpvar_3.a < _AlphaCut)\n        discard;\n    gl_FragData[0] = tmpvar_3;\n}";
    const transparentdiffuse_vert = "";
    const uifont_frag = "#include <common>\nprecision mediump float;\nuniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying lowp vec4 xlv_COLOREx;\nvarying highp vec2 xlv_TEXCOORD0;  \nvoid main() {\n    float scale = 10.0;\n    float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5) * scale;  //0.5\n    float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34) * scale;  //0.34\n\n    float c=xlv_COLOR.a * clamp ( d,0.0,1.0);\n    float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);\n    bc =min(1.0-c,bc);\n\n    gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc;\n}";
    const uifont_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesColorEx;                  \nattribute vec4 _glesMultiTexCoord0;         \nuniform highp mat4 glstate_matrix_mvp;      \nvarying lowp vec4 xlv_COLOR;                \nvarying lowp vec4 xlv_COLOREx;                                                 \nvarying highp vec2 xlv_TEXCOORD0;           \nvoid main() {                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_COLOREx = _glesColorEx;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;     \n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}";
    const ui_frag = "#include <common>\nuniform sampler2D _MainTex;\nvarying lowp vec4 xlv_COLOR;\nvarying highp vec2 xlv_TEXCOORD0;\nvoid main() {\n    lowp vec4 tmpvar_3;\n    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_frag = "#include <common>\nuniform sampler2D _MainTex;                                                 \nvarying lowp vec4 xlv_COLOR;                                                 \nvarying highp vec2 xlv_TEXCOORD0;   \nvoid main() \n{\n    lowp vec4 col_1;    \n    mediump vec4 prev_2;\n    lowp vec4 tmpvar_3;\n\n    tmpvar_3 = (texture2D(_MainTex, xlv_TEXCOORD0));\n    //prev_2 = tmpvar_3;\n    //mediump vec4 tmpvar_4;\n    //tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\n    //col_1 = tmpvar_4;\n    //col_1.x = xlv_TEXCOORD0.x;\n    //col_1.y = xlv_TEXCOORD0.y;\n    gl_FragData[0] = tmpvar_3;\n}";
    const vertcolor_vert = "#include <common>\nattribute vec4 _glesVertex;   \nattribute vec4 _glesNormal;   \nattribute vec4 _glesColor;                  \nattribute vec4 _glesMultiTexCoord0;        \nuniform highp mat4 glstate_matrix_mvp;   \nvarying lowp vec4 xlv_COLOR;                \nvarying highp vec2 xlv_TEXCOORD0;   \n\nuniform highp vec4 _MainTex_ST;       \n\nvoid main()                                     \n{                                               \n    highp vec4 tmpvar_1;                        \n    tmpvar_1.w = 1.0;                           \n    tmpvar_1.xyz = _glesVertex.xyz;             \n    xlv_COLOR = _glesColor;                     \n    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;   \n\n    //xlv_COLOR.xyz =pos.xyz;\n    gl_Position = (glstate_matrix_mvp * tmpvar_1);  \n}\n";
}
declare namespace egret3d.ShaderChunk {
    const begin_vert = "vec3 transformed = vec3(_glesVertex);\n// #if defined(USE_NORMAL) || defined(USE_ENV_MAP)\n    vec3 objectNormal = vec3(_glesNormal);\n// #endif";
    const bsdfs = "// diffuse just use lambert\n\nvec3 BRDF_Diffuse_Lambert(vec3 diffuseColor) {\n    return RECIPROCAL_PI * diffuseColor;\n}\n\n// specular use Cook-Torrance microfacet model, http://ruh.li/GraphicsCookTorrance.html\n// About RECIPROCAL_PI: referenced by http://www.joshbarczak.com/blog/?p=272\n\nvec4 F_Schlick( const in vec4 specularColor, const in float dotLH ) {\n // Original approximation by Christophe Schlick '94\n float fresnel = pow( 1.0 - dotLH, 5.0 );\n\n // Optimized variant (presented by Epic at SIGGRAPH '13)\n // float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\n return ( 1.0 - specularColor ) * fresnel + specularColor;\n}\n\n// use blinn phong instead of phong\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n    // ( shininess * 0.5 + 1.0 ), three.js do this, but why ???\n return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\n\nfloat G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {\n // geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\n return 0.25;\n}\n\nvec4 BRDF_Specular_BlinnPhong(vec4 specularColor, vec3 N, vec3 L, vec3 V, float shininess) {\n    vec3 H = normalize(L + V);\n\n    float dotNH = saturate(dot(N, H));\n    float dotLH = saturate(dot(L, H));\n\n    vec4 F = F_Schlick(specularColor, dotLH);\n\n    float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n    float D = D_BlinnPhong(shininess, dotNH);\n\n    return F * G * D;\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (33)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\n float a2 = pow2( alpha );\n\n float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\n\n return RECIPROCAL_PI * a2 / pow2( denom );\n\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (34)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is \"roughness squared\" in Disney’s reparameterization\nfloat G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n // geometry term = G(l)⋅G(v) / 4(n⋅l)(n⋅v)\n\n float a2 = pow2( alpha );\n\n float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\n return 1.0 / ( gl * gv );\n\n}\n\n// Moving Frostbite to Physically Based Rendering 2.0 - page 12, listing 2\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr_v2.pdf\nfloat G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n float a2 = pow2( alpha );\n\n // dotNL and dotNV are explicitly swapped. This is not a mistake.\n float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\n return 0.5 / max( gv + gl, EPSILON );\n}\n\n// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility\nvec4 BRDF_Specular_GGX(vec4 specularColor, vec3 N, vec3 L, vec3 V, float roughness) {\n\n float alpha = pow2( roughness ); // UE4's roughness\n\n vec3 H = normalize(L + V);\n\n float dotNL = saturate( dot(N, L) );\n float dotNV = saturate( dot(N, V) );\n float dotNH = saturate( dot(N, H) );\n float dotLH = saturate( dot(L, H) );\n\n vec4 F = F_Schlick( specularColor, dotLH );\n\n float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\n float D = D_GGX( alpha, dotNH );\n\n return F * G * D;\n\n}\n\n// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\nvec4 BRDF_Specular_GGX_Environment( const in vec3 N, const in vec3 V, const in vec4 specularColor, const in float roughness ) {\n\n float dotNV = saturate( dot( N, V ) );\n\n const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\n const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\n vec4 r = roughness * c0 + c1;\n\n float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\n vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\n return specularColor * AB.x + AB.y;\n\n}\n\n// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\nfloat GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n}\n\nfloat BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n}";
    const bumpMap_pars_frag = "#ifdef USE_BUMPMAP\n\n uniform sampler2D bumpMap;\n uniform float bumpScale;\n\n // Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n // http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n // Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n vec2 dHdxy_fwd(vec2 uv) {\n\n  vec2 dSTdx = dFdx( uv );\n  vec2 dSTdy = dFdy( uv );\n\n  float Hll = bumpScale * texture2D( bumpMap, uv ).x;\n  float dBx = bumpScale * texture2D( bumpMap, uv + dSTdx ).x - Hll;\n  float dBy = bumpScale * texture2D( bumpMap, uv + dSTdy ).x - Hll;\n\n  return vec2( dBx, dBy );\n\n }\n\n vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {\n\n  vec3 vSigmaX = dFdx( surf_pos );\n  vec3 vSigmaY = dFdy( surf_pos );\n  vec3 vN = surf_norm;  // normalized\n\n  vec3 R1 = cross( vSigmaY, vN );\n  vec3 R2 = cross( vN, vSigmaX );\n\n  float fDet = dot( vSigmaX, R1 );\n\n  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n  return normalize( abs( fDet ) * surf_norm - vGrad );\n\n }\n\n#endif\n";
    const common = "#define PI 3.14159265359\n#define EPSILON 1e-6\n#define LOG2 1.442695\n#define RECIPROCAL_PI 0.31830988618\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; } ";
    const inverse = "mat4 inverse(mat4 m) {\n    float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n    return mat4(\n        a11 * b11 - a12 * b10 + a13 * b09,\n        a02 * b10 - a01 * b11 - a03 * b09,\n        a31 * b05 - a32 * b04 + a33 * b03,\n        a22 * b04 - a21 * b05 - a23 * b03,\n        a12 * b08 - a10 * b11 - a13 * b07,\n        a00 * b11 - a02 * b08 + a03 * b07,\n        a32 * b02 - a30 * b05 - a33 * b01,\n        a20 * b05 - a22 * b02 + a23 * b01,\n        a10 * b10 - a11 * b08 + a13 * b06,\n        a01 * b08 - a00 * b10 - a03 * b06,\n        a30 * b04 - a31 * b02 + a33 * b00,\n        a21 * b02 - a20 * b04 - a23 * b00,\n        a11 * b07 - a10 * b09 - a12 * b06,\n        a00 * b09 - a01 * b07 + a02 * b06,\n        a31 * b01 - a30 * b03 - a32 * b00,\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\n}";
    const lightmap_frag = "#ifdef LIGHTMAP\n    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);\n    outColor.xyz *= decode_hdr(lightmap, _LightmapIntensity);\n    gl_FragData[0] = outColor;\n#else\n    gl_FragData[0] = outColor;\n#endif";
    const lightmap_pars_frag = "#ifdef LIGHTMAP\n    uniform sampler2D _LightmapTex;\n    uniform lowp float _LightmapIntensity;\n    varying highp vec2 xlv_TEXCOORD1;\n\n    lowp vec3 decode_hdr(lowp vec4 data, lowp float intensity)\n    {\n        highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);\n        return data.rgb * power * intensity;\n    }\n#endif";
    const lightmap_pars_vert = "#ifdef LIGHTMAP\n    uniform highp vec4 glstate_lightmapOffset;\n    uniform lowp float glstate_lightmapUV;\n#endif";
    const lightmap_vert = "#ifdef LIGHTMAP\n    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;\n    if(glstate_lightmapUV == 0.0)\n    {\n        beforelightUV = _glesMultiTexCoord0.xy;\n    }\n    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;\n    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);\n    xlv_TEXCOORD1 = vec2(u,v);\n#endif";
    const light_frag = "#ifdef USE_LIGHT    \n    vec3 L;\n    vec3 light;\n    vec3 totalReflect = vec3(0., 0., 0.);\n\n    #ifdef USE_DIRECT_LIGHT\n        for(int i = 0; i < USE_DIRECT_LIGHT; i++) {\n            light = vec3(glstate_directLights[i * 15 + 6], glstate_directLights[i * 15 + 7], glstate_directLights[i * 15 + 8]) * glstate_directLights[i * 15 + 9];\n\n            L.x = glstate_directLights[i * 15 + 3];\n            L.y = glstate_directLights[i * 15 + 4];\n            L.z = glstate_directLights[i * 15 + 5];\n            L = normalize(-L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                irradiance *= bool( glstate_directLights[i * 15 + 10] ) ? getShadow( glstate_directionalShadowMap[ i ], vDirectionalShadowCoord[ i ], glstate_directLights[i * 15 + 11], glstate_directLights[i * 15 + 12], vec2(glstate_directLights[i * 15 + 13], glstate_directLights[i * 15 + 14]) ) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_POINT_LIGHT\n        for(int i = 0; i < USE_POINT_LIGHT; i++) {\n            L = vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]) - xlv_POS;\n            float dist = pow(clamp(1. - length(L) / glstate_pointLights[i * 19 + 10], 0.0, 1.0), glstate_pointLights[i * 19 + 11]);\n            light = vec3(glstate_pointLights[i * 19 + 6], glstate_pointLights[i * 19 + 7], glstate_pointLights[i * 19 + 8]) * glstate_pointLights[i * 19 + 9] * dist;\n            L = normalize(L);\n\n            float dotNL = saturate( dot(N, L) );\n            vec3 irradiance = light * dotNL;\n\n            #ifdef USE_PBR\n                irradiance *= PI;\n            #endif\n\n            #ifdef USE_SHADOW\n                vec3 worldV = xlv_POS - vec3(glstate_pointLights[i * 19 + 0], glstate_pointLights[i * 19 + 1], glstate_pointLights[i * 19 + 2]);\n                irradiance *= bool( glstate_pointLights[i * 19 + 12] ) ? getPointShadow( glstate_pointShadowMap[ i ], worldV, glstate_pointLights[i * 19 + 13], glstate_pointLights[i * 19 + 14], vec2(glstate_pointLights[i * 19 + 17], glstate_pointLights[i * 19 + 18]), glstate_pointLights[i * 19 + 15], glstate_pointLights[i * 19 + 16]) : 1.0;\n            #endif\n\n            vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n            totalReflect += reflectLight;\n        }\n    #endif\n\n    #ifdef USE_SPOT_LIGHT\n        for(int i = 0; i < USE_SPOT_LIGHT; i++) {\n            L = vec3(glstate_spotLights[i * 19 + 0], glstate_spotLights[i * 19 + 1], glstate_spotLights[i * 19 + 2]) - xlv_POS;\n            float lightDistance = length(L);\n            L = normalize(L);\n            float angleCos = dot( L, -normalize(vec3(glstate_spotLights[i * 19 + 3], glstate_spotLights[i * 19 + 4], glstate_spotLights[i * 19 + 5])) );\n\n            if( all( bvec2(angleCos > glstate_spotLights[i * 19 + 12], lightDistance < glstate_spotLights[i * 19 + 10]) ) ) {\n\n                float spotEffect = smoothstep( glstate_spotLights[i * 19 + 12], glstate_spotLights[i * 19 + 13], angleCos );\n                float dist = pow(clamp(1. - lightDistance / glstate_spotLights[i * 19 + 10], 0.0, 1.0), glstate_spotLights[i * 19 + 11]);\n                light = vec3(glstate_spotLights[i * 19 + 6], glstate_spotLights[i * 19 + 7], glstate_spotLights[i * 19 + 8]) * glstate_spotLights[i * 19 + 9] * dist * spotEffect;\n\n                float dotNL = saturate( dot(N, L) );\n                vec3 irradiance = light * dotNL;\n\n                #ifdef USE_PBR\n                    irradiance *= PI;\n                #endif\n\n                #ifdef USE_SHADOW\n                    irradiance *= bool( glstate_spotLights[i * 17 + 14] ) ? getShadow( glstate_spotShadowMap[ i ], vSpotShadowCoord[ i ], glstate_spotLights[i * 17 + 15], glstate_spotLights[i * 17 + 16], vec2(glstate_spotLights[i * 17 + 17], glstate_spotLights[i * 17 + 18])) : 1.0;\n                #endif\n\n                vec3 reflectLight = irradiance * BRDF_Diffuse_Lambert(diffuseColor.xyz);\n\n                totalReflect += reflectLight;\n            }\n\n        }\n    #endif\n\n    outColor.xyz = totalReflect;\n#endif";
    const light_pars_frag = "#ifdef USE_DIRECT_LIGHT\n    uniform float glstate_directLights[USE_DIRECT_LIGHT * 15];\n#endif\n\n#ifdef USE_POINT_LIGHT\n    uniform float glstate_pointLights[USE_POINT_LIGHT * 19];\n#endif\n\n#ifdef USE_SPOT_LIGHT\n    uniform float glstate_spotLights[USE_SPOT_LIGHT * 19];\n#endif";
    const normal_frag = "#ifdef DOUBLE_SIDED\n    float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n#else\n    float flipNormal = 1.0;\n#endif\n#ifdef FLAT_SHADED\n    // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\n    vec3 fdx = vec3( dFdx( xlv_POS.x ), dFdx( xlv_POS.y ), dFdx( xlv_POS.z ) );\n    vec3 fdy = vec3( dFdy( xlv_POS.x ), dFdy( xlv_POS.y ), dFdy( xlv_POS.z ) );\n    vec3 N = normalize( cross( fdx, fdy ) );\n#else\n    vec3 N = normalize(xlv_NORMAL) * flipNormal;\n#endif\n#ifdef USE_NORMAL_MAP\n    vec3 normalMapColor = texture2D(_NormalTex, xlv_TEXCOORD0).rgb;\n    // for now, uv coord is flip Y\n    mat3 tspace = tsn(N, -xlv_POS, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    // mat3 tspace = tbn(normalize(v_Normal), v_ViewModelPos, vec2(xlv_TEXCOORD0.x, 1.0 - xlv_TEXCOORD0.y));\n    N = normalize(tspace * (normalMapColor * 2.0 - 1.0));\n#elif defined(USE_BUMPMAP)\n    N = perturbNormalArb(-xlv_POS, N, dHdxy_fwd(xlv_TEXCOORD0));\n#endif";
    const packing = "const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n\n    vec4 r = vec4( fract( v * PackFactors ), v );\n    r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n    return r * PackUpscale;\n\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\n    return dot( v, UnpackFactors );\n\n}";
    const particle_affector = "vec3 lifeVelocity = computeVelocity(t);\nvec4 worldRotation;\nif(u_simulationSpace==1)\n worldRotation=_startWorldRotation;\nelse\n worldRotation=u_worldRotation;\nvec3 gravity=u_gravity*age;\n\nvec3 center=computePosition(_startVelocity, lifeVelocity, age, t,gravity,worldRotation); \n#ifdef SPHERHBILLBOARD\n   vec2 corner=_glesCorner.xy;\n      vec3 cameraUpVector =normalize(glstate_cameraUp);\n      vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n      vec3 upVector = normalize(cross(sideVector,glstate_cameraForward));\n     corner*=computeBillbardSize(_startSize.xy,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n   if(u_startRotation3D){\n    vec3 rotation=vec3(_startRotation.xy,computeRotation(_startRotation.z,age,t));\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,rotation);\n   }\n   else{\n    float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #else\n   if(u_startRotation3D){\n    center += u_sizeScale.xzy*rotation_euler(corner.x*sideVector+corner.y*upVector,_startRotation);\n   }\n   else{\n    float c = cos(_startRotation.x);\n    float s = sin(_startRotation.x);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n    center += u_sizeScale.xzy*(corner.x*sideVector+corner.y*upVector);\n   }\n  #endif\n #endif\n #ifdef STRETCHEDBILLBOARD\n  vec2 corner=_glesCorner.xy;\n  vec3 velocity;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n      if(u_spaceType==0)\n       velocity=rotation_quaternions(u_sizeScale*(_startVelocity+lifeVelocity),worldRotation)+gravity;\n      else\n       velocity=rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+lifeVelocity+gravity;\n   #else\n      velocity= rotation_quaternions(u_sizeScale*_startVelocity,worldRotation)+gravity;\n   #endif \n  vec3 cameraUpVector = normalize(velocity);\n  vec3 direction = normalize(center-glstate_cameraPos);\n    vec3 sideVector = normalize(cross(direction,normalize(velocity)));\n  sideVector=u_sizeScale.xzy*sideVector;\n  cameraUpVector=length(vec3(u_sizeScale.x,0.0,0.0))*cameraUpVector;\n    vec2 size=computeBillbardSize(_startSize.xy,t);\n    const mat2 rotaionZHalfPI=mat2(0.0, -1.0, 1.0, 0.0);\n    corner=rotaionZHalfPI*corner;\n    corner.y=corner.y-abs(corner.y);\n    float speed=length(velocity);\n    center +=sign(u_sizeScale.x)*(sign(u_lengthScale)*size.x*corner.x*sideVector+(speed*u_speeaScale+size.y*u_lengthScale)*corner.y*cameraUpVector);\n #endif\n #ifdef HORIZONTALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector=vec3(0.0,0.0,1.0);\n    const vec3 sideVector = vec3(-1.0,0.0,0.0);\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef VERTICALBILLBOARD\n  vec2 corner=_glesCorner.xy;\n    const vec3 cameraUpVector =vec3(0.0,1.0,0.0);\n    vec3 sideVector = normalize(cross(glstate_cameraForward,cameraUpVector));\n  float rot = computeRotation(_startRotation.x, age,t);\n    float c = cos(rot);\n    float s = sin(rot);\n    mat2 rotation= mat2(c, -s, s, c);\n    corner=rotation*corner;\n  corner*=computeBillbardSize(_startSize.xy,t);\n    center +=u_sizeScale.xzy*(corner.x*sideVector+ corner.y*cameraUpVector);\n #endif\n #ifdef RENDERMESH\n    vec3 size=computeMeshSize(_startSize,t);\n  #if defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE)\n    if(u_startRotation3D){\n     vec3 rotation=vec3(_startRotation.xy,-computeRotation(_startRotation.z, age,t));\n     center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,rotation),worldRotation);\n    }\n    else{\n     #ifdef ROTATIONOVERLIFETIME\n      float angle=computeRotation(_startRotation.x, age,t);\n      if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n       center+= (rotation_quaternions(rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),angle),worldRotation));//已验证\n      }\n      else{\n       #ifdef SHAPE\n        center+= u_sizeScale.xzy*(rotation_quaternions(rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),angle),worldRotation));\n       #else\n        if(u_simulationSpace==1)\n         center+=rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),angle);\n        else if(u_simulationSpace==0)\n         center+=rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),angle),worldRotation);\n       #endif\n      }\n     #endif\n     #ifdef ROTATIONSEPERATE\n      vec3 angle=compute3DRotation(vec3(0.0,0.0,_startRotation.z), age,t);\n      center+= (rotation_quaternions(rotation_euler(u_sizeScale*_glesVertex*size,vec3(angle.x,angle.y,angle.z)),worldRotation));\n     #endif \n    }\n  #else\n  if(u_startRotation3D){\n   center+= rotation_quaternions(u_sizeScale*rotation_euler(_glesVertex*size,_startRotation),worldRotation);\n  }\n  else{\n   if(_startPosition.x>0.1 || _startPosition.x < -0.1||_startPosition.y>0.1 || _startPosition.y < -0.1){\n    if(u_simulationSpace==1)\n     center+= rotation_axis(u_sizeScale*_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x);\n    else if(u_simulationSpace==0)\n     center+= (rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,normalize(cross(vec3(0.0,0.0,1.0),vec3(_startPosition.xy,0.0))),_startRotation.x),worldRotation));\n   }\n   else{\n    #ifdef SHAPE\n     if(u_simulationSpace==1)\n      center+= u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,-1.0,0.0),_startRotation.x),worldRotation); \n    #else\n     if(u_simulationSpace==1)\n      center+= rotation_axis(u_sizeScale*_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x);\n     else if(u_simulationSpace==0)\n      center+= rotation_quaternions(u_sizeScale*rotation_axis(_glesVertex*size,vec3(0.0,0.0,-1.0),_startRotation.x),worldRotation);\n    #endif\n   }\n  }\n  #endif\n  v_mesh_color=_glesColor;\n  #endif";
    const particle_common = "\n\nuniform float u_currentTime;\nuniform vec3 u_gravity;\n\nuniform vec3 u_worldPosition;\nuniform vec4 u_worldRotation;\nuniform bool u_startRotation3D;\nuniform int u_scalingMode;\nuniform vec3 u_positionScale;\nuniform vec3 u_sizeScale;\nuniform mat4 glstate_matrix_vp;\n\n#ifdef STRETCHEDBILLBOARD\n uniform vec3 glstate_cameraPos;\n#endif\nuniform vec3 glstate_cameraForward;\nuniform vec3 glstate_cameraUp;\n\nuniform float u_lengthScale;\nuniform float u_speeaScale;\nuniform int u_simulationSpace;\n\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n  uniform int u_spaceType;\n#endif\n#if defined(VELOCITYCONSTANT)||defined(VELOCITYTWOCONSTANT)\n  uniform vec3 u_velocityConst;\n#endif\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)\n  uniform vec2 u_velocityCurveX[4];\n  uniform vec2 u_velocityCurveY[4];\n  uniform vec2 u_velocityCurveZ[4];\n#endif\n#ifdef VELOCITYTWOCONSTANT\n  uniform vec3 u_velocityConstMax;\n#endif\n#ifdef VELOCITYTWOCURVE\n  uniform vec2 u_velocityCurveMaxX[4];\n  uniform vec2 u_velocityCurveMaxY[4];\n  uniform vec2 u_velocityCurveMaxZ[4];\n#endif\n\n#ifdef COLOROGRADIENT\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n#endif\n#ifdef COLORTWOGRADIENTS\n  uniform vec4 u_colorGradient[4];\n  uniform vec2 u_alphaGradient[4];\n  uniform vec4 u_colorGradientMax[4];\n  uniform vec2 u_alphaGradientMax[4];\n#endif\n\n#if defined(SIZECURVE)||defined(SIZETWOCURVES)\n  uniform vec2 u_sizeCurve[4];\n#endif\n#ifdef SIZETWOCURVES\n  uniform vec2 u_sizeCurveMax[4];\n#endif\n#if defined(SIZECURVESEPERATE)||defined(SIZETWOCURVESSEPERATE)\n  uniform vec2 u_sizeCurveX[4];\n  uniform vec2 u_sizeCurveY[4];\n  uniform vec2 u_sizeCurveZ[4];\n#endif\n#ifdef SIZETWOCURVESSEPERATE\n  uniform vec2 u_sizeCurveMaxX[4];\n  uniform vec2 u_sizeCurveMaxY[4];\n  uniform vec2 u_sizeCurveMaxZ[4];\n#endif\n\n#ifdef ROTATIONOVERLIFETIME\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform float u_rotationConst;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform float u_rotationConstMax;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurve[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMax[4];\n  #endif\n#endif\n#ifdef ROTATIONSEPERATE\n  #if defined(ROTATIONCONSTANT)||defined(ROTATIONTWOCONSTANTS)\n    uniform vec3 u_rotationConstSeprarate;\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n    uniform vec3 u_rotationConstMaxSeprarate;\n  #endif\n  #if defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\n    uniform vec2 u_rotationCurveX[4];\n    uniform vec2 u_rotationCurveY[4];\n    uniform vec2 u_rotationCurveZ[4];\n  uniform vec2 u_rotationCurveW[4];\n  #endif\n  #ifdef ROTATIONTWOCURVES\n    uniform vec2 u_rotationCurveMaxX[4];\n    uniform vec2 u_rotationCurveMaxY[4];\n    uniform vec2 u_rotationCurveMaxZ[4];\n  uniform vec2 u_rotationCurveMaxW[4];\n  #endif\n#endif\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\n  uniform float u_cycles;\n  uniform vec4 u_subUV;\n  uniform vec2 u_uvCurve[4];\n#endif\n#ifdef TEXTURESHEETANIMATIONTWOCURVE\n  uniform vec2 u_uvCurveMax[4];\n#endif\n\nvarying float v_discard;\nvarying vec4 v_color;\nvarying vec2 v_texcoord;\n#ifdef RENDERMESH\n varying vec4 v_mesh_color;\n#endif\n\nvec3 rotation_euler(in vec3 vector,in vec3 euler)\n{\n  float halfPitch = euler.x * 0.5;\n float halfYaw = euler.y * 0.5;\n float halfRoll = euler.z * 0.5;\n\n float sinPitch = sin(halfPitch);\n float cosPitch = cos(halfPitch);\n float sinYaw = sin(halfYaw);\n float cosYaw = cos(halfYaw);\n float sinRoll = sin(halfRoll);\n float cosRoll = cos(halfRoll);\n\n float quaX = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);\n float quaY = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);\n float quaZ = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);\n float quaW = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n \n}\n\nvec3 rotation_axis(in vec3 vector,in vec3 axis, in float angle)\n{\n float halfAngle = angle * 0.5;\n float sin = sin(halfAngle);\n \n float quaX = axis.x * sin;\n float quaY = axis.y * sin;\n float quaZ = axis.z * sin;\n float quaW = cos(halfAngle);\n \n float x = quaX + quaX;\n  float y = quaY + quaY;\n  float z = quaZ + quaZ;\n  float wx = quaW * x;\n  float wy = quaW * y;\n  float wz = quaW * z;\n float xx = quaX * x;\n  float xy = quaX * y;\n float xz = quaX * z;\n  float yy = quaY * y;\n  float yz = quaY * z;\n  float zz = quaZ * z;\n\n  return vec3(((vector.x * ((1.0 - yy) - zz)) + (vector.y * (xy - wz))) + (vector.z * (xz + wy)),\n              ((vector.x * (xy + wz)) + (vector.y * ((1.0 - xx) - zz))) + (vector.z * (yz - wx)),\n              ((vector.x * (xz - wy)) + (vector.y * (yz + wx))) + (vector.z * ((1.0 - xx) - yy)));\n}\n\nvec3 rotation_quaternions(in vec3 v,in vec4 q) \n{\n return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(SIZECURVE)||defined(SIZECURVESEPERATE)||defined(SIZETWOCURVES)||defined(SIZETWOCURVESSEPERATE)\nfloat evaluate_curve_float(in vec2 curves[4],in float t)\n{\n float res;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  if(curTime>=t)\n  {\n   vec2 lastCurve=curves[i-1];\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res=mix(lastCurve.y,curve.y,tt);\n   break;\n  }\n }\n return res;\n}\n#endif\n\n#if defined(VELOCITYCURVE)||defined(VELOCITYTWOCURVE)||defined(ROTATIONCURVE)||defined(ROTATIONTWOCURVES)\nfloat evaluate_curve_total(in vec2 curves[4],in float t)\n{\n float res=0.0;\n for(int i=1;i<4;i++)\n {\n  vec2 curve=curves[i];\n  float curTime=curve.x;\n  vec2 lastCurve=curves[i-1];\n  float lastValue=lastCurve.y;\n  \n  if(curTime>=t){\n   float lastTime=lastCurve.x;\n   float tt=(t-lastTime)/(curTime-lastTime);\n   res+=(lastValue+mix(lastValue,curve.y,tt))/2.0*_time.x*(t-lastTime);\n   break;\n  }\n  else{\n   res+=(lastValue+curve.y)/2.0*_time.x*(curTime-lastCurve.x);\n  }\n }\n return res;\n}\n#endif\n\n#if defined(COLOROGRADIENT)||defined(COLORTWOGRADIENTS)\nvec4 evaluate_curve_color(in vec2 gradientAlphas[4],in vec4 gradientColors[4],in float t)\n{\n vec4 overTimeColor;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientAlpha=gradientAlphas[i];\n  float alphaKey=gradientAlpha.x;\n  if(alphaKey>=t)\n  {\n   vec2 lastGradientAlpha=gradientAlphas[i-1];\n   float lastAlphaKey=lastGradientAlpha.x;\n   float age=(t-lastAlphaKey)/(alphaKey-lastAlphaKey);\n   overTimeColor.a=mix(lastGradientAlpha.y,gradientAlpha.y,age);\n   break;\n  }\n }\n \n for(int i=1;i<4;i++)\n {\n  vec4 gradientColor=gradientColors[i];\n  float colorKey=gradientColor.x;\n  if(colorKey>=t)\n  {\n   vec4 lastGradientColor=gradientColors[i-1];\n   float lastColorKey=lastGradientColor.x;\n   float age=(t-lastColorKey)/(colorKey-lastColorKey);\n   overTimeColor.rgb=mix(gradientColors[i-1].yzw,gradientColor.yzw,age);\n   break;\n  }\n }\n return overTimeColor;\n}\n#endif\n\n\n#if defined(TEXTURESHEETANIMATIONCURVE)||defined(TEXTURESHEETANIMATIONTWOCURVE)\nfloat evaluate_curve_frame(in vec2 gradientFrames[4],in float t)\n{\n float overTimeFrame;\n for(int i=1;i<4;i++)\n {\n  vec2 gradientFrame=gradientFrames[i];\n  float key=gradientFrame.x;\n  if(key>=t)\n  {\n   vec2 lastGradientFrame=gradientFrames[i-1];\n   float lastKey=lastGradientFrame.x;\n   float age=(t-lastKey)/(key-lastKey);\n   overTimeFrame=mix(lastGradientFrame.y,gradientFrame.y,age);\n   break;\n  }\n }\n return floor(overTimeFrame);\n}\n#endif\n\nvec3 computeVelocity(in float t)\n{\n  vec3 res;\n  #ifdef VELOCITYCONSTANT\n  res=u_velocityConst; \n  #endif\n  #ifdef VELOCITYCURVE\n     res= vec3(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveZ,t));\n  #endif\n  #ifdef VELOCITYTWOCONSTANT\n  res=mix(u_velocityConst,u_velocityConstMax,vec3(_random1.y,_random1.z,_random1.w)); \n  #endif\n  #ifdef VELOCITYTWOCURVE\n     res=vec3(mix(evaluate_curve_float(u_velocityCurveX,t),evaluate_curve_float(u_velocityCurveMaxX,t),_random1.y),\n             mix(evaluate_curve_float(u_velocityCurveY,t),evaluate_curve_float(u_velocityCurveMaxY,t),_random1.z),\n        mix(evaluate_curve_float(u_velocityCurveZ,t),evaluate_curve_float(u_velocityCurveMaxZ,t),_random1.w));\n  #endif\n     \n  return res;\n} \n\nvec3 computePosition(in vec3 startVelocity, in vec3 lifeVelocity,in float age,in float t,vec3 gravityVelocity,vec4 worldRotation)\n{\n    vec3 startPosition;\n    vec3 lifePosition;\n  #if defined(VELOCITYCONSTANT)||defined(VELOCITYCURVE)||defined(VELOCITYTWOCONSTANT)||defined(VELOCITYTWOCURVE)\n   #ifdef VELOCITYCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveZ,t));\n   #endif\n   #ifdef VELOCITYTWOCONSTANT\n      startPosition=startVelocity*age;\n      lifePosition=lifeVelocity*age;\n   #endif\n   #ifdef VELOCITYTWOCURVE\n      startPosition=startVelocity*age;\n      lifePosition=vec3(mix(evaluate_curve_total(u_velocityCurveX,t),evaluate_curve_total(u_velocityCurveMaxX,t),_random1.y)\n                 ,mix(evaluate_curve_total(u_velocityCurveY,t),evaluate_curve_total(u_velocityCurveMaxY,t),_random1.z)\n                 ,mix(evaluate_curve_total(u_velocityCurveZ,t),evaluate_curve_total(u_velocityCurveMaxZ,t),_random1.w));\n   #endif\n\n   vec3 finalPosition;\n   if(u_spaceType==0){\n     if(u_scalingMode!=2)\n      finalPosition =rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition+lifePosition),worldRotation);\n     else\n      finalPosition =rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition+lifePosition,worldRotation);\n   }\n   else{\n     if(u_scalingMode!=2)\n       finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation)+lifePosition;\n     else\n       finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation)+lifePosition;\n   }\n    #else\n    startPosition=startVelocity*age;\n    vec3 finalPosition;\n    if(u_scalingMode!=2)\n      finalPosition = rotation_quaternions(u_positionScale*(_startPosition.xyz+startPosition),worldRotation);\n    else\n      finalPosition = rotation_quaternions(u_positionScale*_startPosition.xyz+startPosition,worldRotation);\n  #endif\n  \n  if(u_simulationSpace==1)\n    finalPosition=finalPosition+_startWorldPosition;\n  else if(u_simulationSpace==0) \n    finalPosition=finalPosition+u_worldPosition;\n  \n  finalPosition+=0.5*gravityVelocity*age;\n \n  return finalPosition;\n}\n\n\nvec4 computeColor(in vec4 color,in float t)\n{\n #ifdef COLOROGRADIENT\n   color*=evaluate_curve_color(u_alphaGradient,u_colorGradient,t);\n #endif \n #ifdef COLORTWOGRADIENTS\n   color*=mix(evaluate_curve_color(u_alphaGradient,u_colorGradient,t),evaluate_curve_color(u_alphaGradientMax,u_colorGradientMax,t),_random0.y);\n #endif\n\n  return color;\n}\n\nvec2 computeBillbardSize(in vec2 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec2(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec2(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z));\n #endif\n return size;\n}\n\n#ifdef RENDERMESH\nvec3 computeMeshSize(in vec3 size,in float t)\n{\n #ifdef SIZECURVE\n  size*=evaluate_curve_float(u_sizeCurve,t);\n #endif\n #ifdef SIZETWOCURVES\n   size*=mix(evaluate_curve_float(u_sizeCurve,t),evaluate_curve_float(u_sizeCurveMax,t),_random0.z); \n #endif\n #ifdef SIZECURVESEPERATE\n  size*=vec3(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveZ,t));\n #endif\n #ifdef SIZETWOCURVESSEPERATE\n   size*=vec3(mix(evaluate_curve_float(u_sizeCurveX,t),evaluate_curve_float(u_sizeCurveMaxX,t),_random0.z)\n         ,mix(evaluate_curve_float(u_sizeCurveY,t),evaluate_curve_float(u_sizeCurveMaxY,t),_random0.z)\n       ,mix(evaluate_curve_float(u_sizeCurveZ,t),evaluate_curve_float(u_sizeCurveMaxZ,t),_random0.z));\n #endif\n return size;\n}\n#endif\n\nfloat computeRotation(in float rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConst*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurve,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n     rotation+=ageRot;\n   #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n  #endif\n #endif\n #ifdef ROTATIONSEPERATE\n  #ifdef ROTATIONCONSTANT\n   float ageRot=u_rotationConstSeprarate.z*age;\n         rotation+=ageRot;\n  #endif\n  #ifdef ROTATIONCURVE\n   rotation+=evaluate_curve_total(u_rotationCurveZ,t);\n  #endif\n  #ifdef ROTATIONTWOCONSTANTS\n   float ageRot=mix(u_rotationConstSeprarate.z,u_rotationConstMaxSeprarate.z,_random0.w)*age;\n         rotation+=ageRot;\n     #endif\n  #ifdef ROTATIONTWOCURVES\n   rotation+=mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n  #endif\n #endif\n return rotation;\n}\n\n#if defined(RENDERMESH)&&(defined(ROTATIONOVERLIFETIME)||defined(ROTATIONSEPERATE))\nvec3 compute3DRotation(in vec3 rotation,in float age,in float t)\n{ \n #ifdef ROTATIONOVERLIFETIME\n   #ifdef ROTATIONCONSTANT\n     float ageRot=u_rotationConst*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONCURVE\n     rotation+=evaluate_curve_total(u_rotationCurve,t);\n   #endif\n   #ifdef ROTATIONTWOCONSTANTS\n     float ageRot=mix(u_rotationConst,u_rotationConstMax,_random0.w)*age;\n       rotation+=ageRot;\n   #endif\n   #ifdef ROTATIONTWOCURVES\n     rotation+=mix(evaluate_curve_total(u_rotationCurve,t),evaluate_curve_total(u_rotationCurveMax,t),_random0.w);\n   #endif\n #endif\n #ifdef ROTATIONSEPERATE\n    #ifdef ROTATIONCONSTANT\n     vec3 ageRot=u_rotationConstSeprarate*age;\n           rotation+=ageRot;\n    #endif\n    #ifdef ROTATIONCURVE\n     rotation+=vec3(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveZ,t));\n    #endif\n    #ifdef ROTATIONTWOCONSTANTS\n     vec3 ageRot=mix(u_rotationConstSeprarate,u_rotationConstMaxSeprarate,_random0.w)*age;\n           rotation+=ageRot;\n     #endif\n    #ifdef ROTATIONTWOCURVES\n     rotation+=vec3(mix(evaluate_curve_total(u_rotationCurveX,t),evaluate_curve_total(u_rotationCurveMaxX,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveY,t),evaluate_curve_total(u_rotationCurveMaxY,t),_random0.w)\n           ,mix(evaluate_curve_total(u_rotationCurveZ,t),evaluate_curve_total(u_rotationCurveMaxZ,t),_random0.w));\n    #endif\n #endif\n return rotation;\n}\n#endif\n\nvec2 computeUV(in vec2 uv,in float t)\n{ \n #ifdef TEXTURESHEETANIMATIONCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n  float frame=evaluate_curve_frame(u_uvCurve,uvNormalizedAge);\n  uv.x *= u_subUV.x + u_subUV.z;\n  uv.y *= u_subUV.y + u_subUV.w;\n  float totalULength=frame*u_subUV.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUV.y;\n    #endif\n #ifdef TEXTURESHEETANIMATIONTWOCURVE\n  float cycleNormalizedAge=t*u_cycles;\n  float uvNormalizedAge=cycleNormalizedAge-floor(cycleNormalizedAge);\n   float frame=floor(mix(evaluate_curve_frame(u_uvCurve,uvNormalizedAge),evaluate_curve_frame(u_uvCurveMax,uvNormalizedAge),_random1.x));\n  uv.x *= u_subUV.x + u_subUV.z;\n  uv.y *= u_subUV.y + u_subUV.w;\n  float totalULength=frame*u_subUV.x;\n  float floorTotalULength=floor(totalULength);\n   uv.x+=totalULength-floorTotalULength;\n  uv.y+=floorTotalULength*u_subUV.y;\n    #endif\n return uv;\n}";
    const shadowMap_frag = "#ifdef USE_SHADOW\n    // outColor *= getShadowMask();\n#endif";
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
declare namespace egret3d {
    class DefaultTextures {
        static WHITE: Texture;
        static GRAY: Texture;
        static GRID: Texture;
        static init(): void;
    }
}
declare namespace RES.processor {
    const TextureDescProcessor: RES.processor.Processor;
    const TextureProcessor: RES.processor.Processor;
    const GLTFBinaryProcessor: RES.processor.Processor;
    const GLTFProcessor: RES.processor.Processor;
    const PrefabProcessor: RES.processor.Processor;
    const SceneProcessor: RES.processor.Processor;
}
declare namespace egret3d {
    class DefaultShaders {
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
        private static _inited;
        static createBuildinShader(url: string, vertName: string, vertSource: string, fragName: string, fragSource: string, renderQueue: number): GLTFAsset;
        private static _setBlend(technique, blend);
        private static _setCullFace(technique, cull, frontFace?, cullFace?);
        private static _setDepth(technique, zTest, zWrite);
        private static _createColorShaderTemplate(url);
        private static _createDiffuseShaderTemplate(url);
        private static _createLambertShaderTemplate();
        private static _createParticleShaderTemplate(url);
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
        private static _createDefaultMeshA(data, assetName);
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
        initialize(): void;
        readonly frameCount: number;
        readonly time: number;
        readonly deltaTime: number;
        readonly unscaledTime: number;
        readonly unscaledDeltaTime: number;
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
        private readonly _webgl;
        private readonly _camerasAndLights;
        private readonly _drawCalls;
        private readonly _lightCamera;
        private readonly _stateEnables;
        private readonly _filteredLights;
        private readonly _cacheStateEnable;
        private _cacheDefines;
        private _cacheContextVersion;
        private _cacheMaterialVerision;
        private _cacheMeshVersion;
        private _cacheProgram;
        private _cacheContext;
        private _cacheMaterial;
        private _cacheMesh;
        private _cacheState;
        private _updateState(state);
        private _updateContextDefines(context, material);
        private _updateContextUniforms(context, technique, forceUpdate);
        private _updateUniforms(context, material, technique, forceUpdate);
        private _updateAttributes(mesh, subMeshIndex, technique, forceUpdate);
        private _drawCall(mesh, drawCall);
        private _renderCall(context, drawCall);
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
    interface WebGLActiveAttribute {
        size: number;
        type: number;
        location: number;
    }
    interface WebGLActiveUniform {
        size: number;
        type: number;
        location: WebGLUniformLocation;
    }
    /**
     * WebGLProgram的包装类
     */
    class GlProgram {
        constructor(webglProgram: WebGLProgram);
        static getProgram(material: Material, technique: gltf.Technique, defines: string): WebGLProgram;
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
        isFrameBuffer(): boolean;
        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number;
        height: number;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
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
declare namespace paper.editor {
    /**
     * 场景编辑器
     **/
    class Editor {
        private static _editorModel;
        /**编辑模型 */
        static readonly editorModel: EditorModel;
        private static history;
        /**初始化 */
        static init(): Promise<void>;
        private static runEgret();
        /**切换场景 */
        static switchScene(url: string): void;
        private static loadEditScene(url);
        private static loadScene(resourceName, keepUUID?);
        private static _createEditCamera();
        static undo(): void;
        static redo(): void;
        static deserializeHistory(data: any): void;
        static serializeHistory(): string;
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
declare namespace paper {
    /**
     * 反序列化。
     */
    function deserialize<T extends (Scene | GameObject | BaseComponent)>(data: ISerializedData, isKeepUUID?: boolean): T | null;
    /**
     *
     */
    function getDeserializedAssetOrComponent(source: IUUID | IAssetReference): Asset | GameObject | BaseComponent;
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
        static CHANGE_PROPERTY: string;
        static CHANGE_EDIT_MODE: string;
        static CHANGE_EDIT_TYPE: string;
        static CHANGE_SCENE: string;
        static ADD_COMPONENT: string;
        static REMOVE_COMPONENT: string;
        static UPDATE_GAMEOBJECTS_HIREARCHY: string;
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
        backRunTime: any;
        setBackRuntime(back: any): void;
        private history;
        /**
         * 初始化
         * @param history
         */
        init(history: History): void;
        addState(state: BaseState): void;
        getEditType(propName: string, target: any): editor.EditType | null;
        setTransformProperty(propName: string, propValue: any, target: BaseComponent): void;
        createModifyGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        createModifyComponent(gameObjectUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): any;
        createModifyPrefabGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        createModifyPrefabComponentPropertyState(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        createRemoveComponentFromPrefab(stateData: any): void;
        createAddComponentToPrefab(sourceData: any, instanceDatas: any[]): void;
        createModifyAssetPropertyState(assetUrl: string, newValueList: any[], preValueCopylist: any[]): void;
        createPrefabState(prefab: any): void;
        serializeProperty(value: any, editType: editor.EditType): any;
        deserializeProperty(serializeData: any, editType: editor.EditType): Promise<any>;
        createGameObject(parentList: GameObject[], createType: string): void;
        addComponent(gameObjectUUid: string, compClzName: string): void;
        /**
        *  TODO:因gameobject未提供通过组件实例添加组件的方法，暂时这样处理
        * @param gameObject
        * @param component
        */
        addComponentToGameObject(gameObject: GameObject, component: BaseComponent): void;
        removeComponent(gameObjectUUid: string, componentUUid: string): void;
        getComponentById(gameObject: GameObject, componentId: string): BaseComponent | null;
        getComponentByAssetId(gameObject: GameObject, assetId: string): BaseComponent | null;
        copy(objs: GameObject[]): void;
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
        _deleteGameObject(gameObjects: GameObject[]): void;
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
        /**
        * 从一个预置体文件创建实例
        * @param prefabPath 预置体资源路径
        */
        createGameObjectFromPrefab(prefabPath: string, paper: any, RES: any): Promise<paper.GameObject>;
        /**
         * 设置children prefab属性
         * @param gameObj
         * @param prefab
         */
        setGameObjectPrefab(gameObj: GameObject, prefab: Prefab, rootObj: GameObject): void;
        /**将对象按照层级进行排序
         */
        sortGameObjectsForHierarchy(gameobjects: paper.GameObject[]): paper.GameObject[];
        createApplyPrefabState(applyGameObjectPropertyList: any[], applyComponentPropertyList: any[]): void;
        createRevertPrefabState(modifyGameObjectPropertyList: any[], modifyComponentPropertyList: any[]): void;
        compareValue(a: any, b: any): boolean;
        private equal(a, b);
        getRootGameObjectsByPrefab: (prefab: Prefab) => GameObject[];
    }
}
declare namespace paper.editor {
    class GeoController extends paper.Behaviour {
        selectedGameObjs: GameObject[];
        private _isEditing;
        private _geoCtrlMode;
        private _modeCanChange;
        geoCtrlMode: string;
        private _geoCtrlType;
        geoCtrlType: string;
        editorModel: EditorModel;
        setEditorMode(editorModel: EditorModel): void;
        constructor();
        private bindMouse;
        private bindKeyboard;
        onUpdate(): void;
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
        private _initRotation;
        private _oldLocalScale;
        private _cameraObject;
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
        private _selectGameObjects(gameObjects);
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
    type EventData = {
        isUndo: boolean;
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
     * 自定义序列化接口。
     */
    interface ISerializable {
        /**
         *
         */
        serialize(): any | ISerializedObject;
        /**
         *
         */
        deserialize(element: any): void;
    }
    /**
     * 序列化后的数据接口。
     */
    interface ISerializedObject extends IUUID, IClass {
        /**
         *
         */
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口
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
        static create(gameObjects: GameObject[]): DeleteGameObjectsState;
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
        static create(objs: GameObject[]): DuplicateGameObjectsState;
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
        static create(data?: any): AddComponentState | null;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class RemoveComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): RemoveComponentState | null;
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
        static create(gameObjects: GameObject[], targetGameObj: GameObject, dir: 'top' | 'inner' | 'bottom'): GameObjectHierarchyState;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyPrefabGameObjectPropertyState extends BaseState {
        static toString(): string;
        static create(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyPrefabGameObjectPropertyState | null;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
        /**
         * 修改预制体游戏对象属性,目前只支持修改根对象
         * @param gameObjectId
         * @param valueList
         */
        private modifyPrefabGameObjectPropertyValues(gameObjectUUid, valueList);
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyPrefabComponentPropertyState extends BaseState {
        static toString(): string;
        static create(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyPrefabComponentPropertyState | null;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
        modifyPrefabComponentPropertyValues(gameObjUUid: string, componentUUid: string, valueList: any[]): Promise<void>;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class RemovePrefabComponentState extends BaseState {
        static toString(): string;
        static create(data?: any): RemovePrefabComponentState | null;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class AddPrefabComponentState extends BaseState {
        static toString(): string;
        static create(sourceData: any, instanceDatas: any[]): AddPrefabComponentState | null;
        undo(): boolean;
        private removeComponent(data);
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyAssetPropertyState extends BaseState {
        static toString(): string;
        static create(data?: any): ModifyAssetPropertyState | null;
        modifyAssetPropertyValues(assetUrl: string, valueList: any[]): Promise<void>;
        undo(): boolean;
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class CreatePrefabState extends BaseState {
        static toString(): string;
        static create(data?: any): CreatePrefabState | null;
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
        onUpdate(delta: number): any;
        private setStroke(picked);
    }
}
declare namespace paper.editor {
    class Gizmo {
        private static enabled;
        private static webgl;
        private static camera;
        static Enabled(): void;
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
declare namespace egret3d {
    /**
     * mesh的渲染组件
     */
    class MeshRenderer extends paper.BaseRenderer {
        private readonly _materials;
        uninitialize(): void;
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
