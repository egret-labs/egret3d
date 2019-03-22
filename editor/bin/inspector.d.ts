// Type definitions for Stats.js 0.16.0
// Project: http://github.com/mrdoob/stats.js
// Definitions by: Gregory Dalton <https://github.com/gregolai>, Harm Berntsen <https://github.com/hberntsen>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare class Stats {
    REVISION: number;
    dom: HTMLDivElement;

    /**
     * @param value 0:fps, 1: ms, 2: mb, 3+: custom
     */
    showPanel(value: number): void;
    addPanel(value: Stats.Panel): Stats.Panel;
    begin(): void;
    end(): number;
    update(): void;
    onFrame(): void;
}

declare namespace Stats {
    class Panel {
        public constructor(name: string, color: string, bgColor: string);
        public update(value: number, maxValue: number): void;
    }
}// Type definitions for dat.GUI 0.6
// Project: https://github.com/dataarts/dat.gui
// Definitions by: Satoru Kimura <https://github.com/gyohk>, ZongJing Lu <https://github.com/sonic3d>, Richard Roylance <https://github.com/rroylance>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace dat {
    class GUI {
        static toggleHide(): void;
        static hide: boolean;
        instance?: any; // Modify add instance.
        onClick?: (gui: GUI) => void; // Modify add onClick.

        constructor(option?: GUIParams);

        __controllers: GUIController[];
        __folders: GUI[];
        domElement: HTMLElement;

        add(target: Object, propName: string): GUIController;
        add(target: Object, propName: string, min: number, max: number): GUIController;
        add(target: Object, propName: string, status: boolean): GUIController;
        add(target: Object, propName: string, items: string[]): GUIController;
        add(target: Object, propName: string, items: number[]): GUIController;
        add(target: Object, propName: string, items: Object): GUIController;

        addColor(target: Object, propName: string): GUIController;
        addColor(target: Object, propName: string, color: string): GUIController;
        addColor(target: Object, propName: string, rgba: number[]): GUIController; // rgb or rgba
        addColor(target: Object, propName: string, hsv: { h: number; s: number; v: number }): GUIController;

        remove(controller: GUIController): void;
        destroy(): void;

        addFolder(propName: string, label?: string): GUI; // Modify add label.
        removeFolder(value: GUI): void;

        open(): void;
        close(): void;

        remember(target: Object, ...additionalTargets: Object[]): void;
        getRoot(): GUI;

        getSaveObject(): Object;
        save(): void;
        saveAs(presetName: string): void;
        revert(gui: GUI): void;

        listen(controller: GUIController): void;
        updateDisplay(): void;

        // gui properties in dat/gui/GUI.js
        readonly parent: GUI;
        readonly scrollable: boolean;
        readonly autoPlace: boolean;
        preset: string;
        width: number;
        name: string;
        closed: boolean;
        selected: boolean;
        readonly load: Object;
        useLocalStorage: boolean;
    }

    interface GUIParams {
        autoPlace?: boolean;
        scrollable?: boolean;
        closed?: boolean;
        closeOnTop?: boolean;
        load?: any;
        name?: string;
        preset?: string;
        width?: number;
    }

    class GUIController {
        destroy(): void;

        // Controller
        onChange: (value?: any) => void;
        onFinishChange: (value?: any) => void;

        setValue(value: any): GUIController;
        getValue(): any;
        updateDisplay(): void;
        isModified(): boolean;

        // NumberController
        min(n: number): GUIController;
        max(n: number): GUIController;
        step(n: number): GUIController;

        // FunctionController
        fire(): GUIController;

        // augmentController in dat/gui/GUI.js
        options(option: any): GUIController;
        name(s: string): GUIController;
        listen(): GUIController;
        remove(): GUIController;
    }
}declare namespace paper.editor {
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
declare namespace paper.editor {
}
declare var VConsole: {
    new (): any;
} | null;
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
        scene: Scene;
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
        setTransformProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent): void;
        createModifyGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        createModifyComponent(gameObjectUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): any;
        createPrefabState(prefab: Prefab, parent?: GameObject): void;
        createModifyScenePropertyState(sceneUUid: string, newValueList: any[], preValueCopylist: any[]): void;
        serializeProperty(value: any, editType: paper.editor.EditType): any;
        deserializeProperty(serializeData: any, editType: paper.editor.EditType): any;
        createGameObject(parentList: (GameObject | Scene)[], createType: string, mesh: egret3d.Mesh): void;
        addComponent(gameObjectUUid: string, compClzName: string): void;
        removeComponent(gameObjectUUid: string, componentUUid: string): void;
        getComponentById(gameObject: GameObject, componentId: string): IComponent | null;
        getComponentByAssetId(gameObject: GameObject, assetId: string): IComponent | null;
        /**
         * 复制游戏对象
         * @param objs
         */
        copyGameObject(objs: GameObject[]): void;
        clearAndCollectGameObjectExtras(gameObj: paper.GameObject, extrasCollection?: (EntityExtras | undefined)[] | null): (EntityExtras | undefined)[];
        resetGameObjectExtras(gameObj: GameObject, extrasCollection: (EntityExtras | undefined)[]): void;
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
        getGameObjectsByUUids(uuids: string[]): GameObject[];
        getTargetByPropertyChain(propertyChain: string[], target: any): any;
        setTargetProperty(propName: string, target: any, value: any, editType: paper.editor.EditType): void;
        private propertyHasGetterSetter(propName, target);
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
        createApplyPrefabState(applyData: editor.ApplyData, applyPrefabInstanceId: string, prefabName: string): void;
        createRevertPrefabState(revertData: editor.revertData, revertPrefabInstanceId: string): void;
        deepClone<T>(obj: T): T;
        updateAsset(asset: Asset, prefabInstance?: GameObject | null): void;
        private _cacheIds;
        private findAssetRefs(target, as, refs?);
        private findFromChildren(source, as, refs, parent, key);
        getAllGameObjectsFromPrefabInstance(gameObj: paper.GameObject, objs?: paper.GameObject[] | null): GameObject[];
        modifyMaterialPropertyValues(target: egret3d.Material, valueList: any[]): Promise<void>;
        private modifyMaterialUniformProperty(target, uniformType, propName, copyValue);
        private modifyMaterialGltfStates(target, propName, copyValue);
        getRes(name: string): Promise<any>;
    }
}
declare namespace paper.editor {
    class EditorSceneModel {
        private viewCache;
        readonly editorScene: Scene;
        private currentModel;
        editorModel: EditorModel;
        private cameraObject;
        init(): void;
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
}
declare namespace paper.editor {
    /**
     *
     */
    class EditorComponent extends Component {
        initialize(): void;
    }
    /**
     * Gizmos 容器标记。
     */
    class GizmosContainerFlag extends EditorComponent {
    }
    /**
     * Gizmos 容器标记。
     */
    class GizmosContainerForwardFlag extends EditorComponent {
    }
    /**
     * 可点选容器标记。
     */
    class TouchContainerFlag extends EditorComponent {
    }
    /**
     * 选框网格标记。
     */
    class SelectFrameFlag extends EditorComponent {
        /**
         * 相对于舞台的选框视口。
         */
        readonly viewport: egret3d.Rectangle;
    }
    /**
     * 高亮标记。
     */
    class HoveredFlag extends EditorComponent {
    }
    /**
     * 选中标记。
     */
    class SelectedFlag extends EditorComponent {
    }
    /**
     * 最后选中标记。
     */
    class LastSelectedFlag extends EditorComponent {
    }
    /**
     * 选取重定向标记。
     */
    class PickedFlag extends EditorComponent {
        target: GameObject | null;
    }
}
declare namespace paper.editor {
    /**
     *
     */
    const enum ShowState {
        None = 0,
        FPS = 1,
        Hierarchy = 2,
        Inspector = 4,
        HierarchyAndInspector = 6,
        All = 7,
    }
    /**
     *
     */
    class GUIComponent extends Component {
        showStates: ShowState;
        readonly hierarchy: dat.GUI;
        readonly inspector: dat.GUI;
        readonly stats: Stats;
        readonly renderPanel: Stats.Panel;
        readonly drawCallPanel: Stats.Panel;
        initialize(): void;
    }
}
declare namespace paper.editor {
    /**
     *
     */
    class ModelComponent extends Component {
        /**
         * 选中的场景。
         */
        selectedScene: Scene | null;
        /**
         *
         */
        readonly openedComponents: IComponentClass<IComponent>[];
        private _editorModel;
        private readonly _selectedGroup;
        private readonly _lastSelectedGroup;
        private _onEditorSelectGameObjects(event);
        private _onChangeProperty(data);
        private _onChangeEditMode(mode);
        private _onChangeEditType(type);
        private _select(value, isReplace?);
        private _unselect(value);
        initialize(): void;
        select(value: Scene | IEntity | null, isReplace?: boolean): void;
        unselect(value: IEntity): void;
        delete(value?: IEntity | null): void;
        openComponents(...args: IComponentClass<IComponent>[]): void;
        changeProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent): void;
    }
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
}
declare namespace paper.editor {
    /**
     * TODO
     */
    class SceneSystem extends BaseSystem<GameObject> {
        private readonly _modelComponent;
        private readonly _keyEscape;
        private readonly _keyDelete;
        private readonly _keyE;
        private readonly _keyW;
        private readonly _keyR;
        private readonly _keyX;
        private readonly _keyF;
        private _gizmosContainerEntity;
        private _gizmosForwardContainerEntity;
        private _touchContainerEntity;
        private _transformControllerEntity;
        private readonly _selectBox;
        private _updateSelectBox(camera, viewport);
        lookAtSelected(): void;
        protected getMatchers(): IAnyOfMatcher<GameObject>[];
        onEnable(): void;
        onDisable(): void;
        onEntityAdded(entity: GameObject, group: Group<GameObject>): void;
        onEntityRemoved(entity: GameObject, group: Group<GameObject>): void;
        onFrame(): void;
        private static readonly _defalutPosition;
        private _clearDefaultPointerDownPosition();
    }
}
declare namespace paper.editor {
}
declare namespace SPECTOR {
    class Spector {
        displayUI(): void;
        captureCanvas(canvas: HTMLCanvasElement, commandCount: uint, quickCapture: boolean): void;
        spyCanvas(canvas: HTMLCanvasElement): void;
    }
}
declare namespace paper.editor {
}
declare namespace paper {
    /**
     * 默认标识和自定义标识。
     */
    const enum DefaultTags {
    }
    /**
     * 内置层级和自定义层级。
     */
    const enum Layer {
    }
}
declare namespace egret3d {
    /**
     * 渲染排序。
     */
    const enum RenderQueue {
    }
    /**
     *
     */
    const enum AttributeSemantics {
    }
    /**
     *
     */
    const enum UniformSemantics {
    }
}
declare namespace paper.editor {
}
declare namespace paper.editor {
    function getQueryValues(uri: string): any;
}
declare namespace paper.editor {
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
     * 获取一个实例对象某个属性的编辑类型
     * @param classInstance 实例对象
     * @param propName 属性名
     */
    function getEditType(classInstance: any, propName: string): paper.editor.EditType | null;
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
        /**
         * 定位对象到场景中心
         * @param target 目标
         */
        static locateGambeObject(target: GameObject): void;
        private static currentEditInfo;
        /**
         * 编辑场景
         * @param sceneUrl 场景资源URL
         */
        static editScene(sceneUrl: string): Promise<void>;
        private static getRes(name);
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
        private static preDo();
    }
}
declare namespace paper.editor {
    type EventData = {
        isUndo: boolean;
    };
    type ApplyDataDetail = {
        addGameObjects?: {
            serializeData: ISerializedData;
            id: string;
            cacheSerializeData?: {
                [key: string]: ISerializedData[];
            };
        }[];
        addComponents?: {
            serializeData: ISerializedData;
            id: string;
            gameObjId: string;
            cacheSerializeData?: {
                [key: string]: ISerializedData;
            };
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
    type ApplyData = {
        [linkedId: string]: ApplyDataDetail;
    };
    type revertDataDetail = {
        revertGameObjects?: {
            serializeData: ISerializedData;
            id: string;
        }[];
        revertComponents?: {
            serializeData: ISerializedData;
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
    type revertData = {
        [linkedId: string]: revertDataDetail;
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
    class ApplyPrefabInstanceState extends BaseState {
        private firstRedo;
        static toString(): string;
        static create(applyData: editor.ApplyData, applyPrefabRootId: string, prefabName: string): ApplyPrefabInstanceState | null;
        private readonly stateData;
        undo(): boolean;
        getAllUUidFromGameObject(gameObj: paper.GameObject, uuids?: string[] | null): string[];
        setLinkedId(gameObj: GameObject, ids: string[]): void;
        clearLinkedId(gameObj: GameObject): void;
        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any): void;
        private modifyPrefabGameObjectPropertyValues(linkedId, tempObj, valueList);
        modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string, tempObj: GameObject, valueList: any[]): void;
        setGameObjectPrefabRootId(gameObj: GameObject, rootID: string): void;
        getGameObjectsByLinkedId(linkedId: string, filterApplyRootId: string): GameObject[];
        getGameObjectByLinkedId(gameObj: paper.GameObject, linkedID: string): GameObject | null | undefined;
        getGameObjectByUUid(gameObj: GameObject, uuid: string): GameObject | null | undefined;
        private getPrefabAsset();
        redo(): boolean;
        private clearGameObjectExtrasInfo(gameObj);
        private clearExtrasFromSerilizeData(data);
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
    class CreateGameObjectState extends BaseState {
        static toString(): string;
        static create(parentList: (GameObject | Scene)[], createType: string, mesh: egret3d.Mesh): CreateGameObjectState | null;
        infos: {
            parentUUID: string | null;
            serializeData: any | null;
        }[];
        createType: string;
        addList: string[];
        private mesh;
        private isFirst;
        undo(): boolean;
        redo(): boolean;
        private createGameObjectByType(createType);
    }
}
declare namespace paper.editor {
    class CreatePrefabState extends BaseState {
        static toString(): string;
        static create(prefab: Prefab, parent?: GameObject): CreatePrefabState | null;
        private readonly stateData;
        undo(): boolean;
        redo(): boolean;
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
    class ModifyGameObjectPropertyState extends BaseState {
        static create(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyGameObjectPropertyState | null;
        private readonly stateData;
        undo(): boolean;
        private modifyProperty(valueList);
        redo(): boolean;
    }
}
declare namespace paper.editor {
    class ModifyScenePropertyState extends BaseState {
        static create(sceneUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyScenePropertyState;
        private readonly stateData;
        undo(): boolean;
        private modifyProperty(valueList);
        redo(): boolean;
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
    class RemoveComponentState extends BaseState {
        static toString(): string;
        static create(gameObjectUUid: string, componentUUid: string, cacheSerializeData: any): RemoveComponentState | null;
        private readonly stateData;
        undo(): boolean;
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
        modifyPrefabComponentPropertyValues(gameObj: GameObject, componentUUid: string, valueList: any[]): void;
        redo(): boolean;
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
