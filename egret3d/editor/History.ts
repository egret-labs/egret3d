namespace paper.editor {
    export type EventData<D> = { isUndo: boolean, data: D };

    export const EventType = {
        HistoryState: "HistoryState",
        HistoryAdd: "HistoryAdd",
        HistoryFree: "HistoryFree"
    };

    export class History {
        public static toString(): string {
            return "[class common.History]";
        }

        public dispatcher: EventDispatcher | null;

        private _locked: 0 | 1 | 2 | 3 = 0;
        private _index: number = -1;
        private _batchIndex: number = 0;
        private readonly _states: BaseState[] = [];
        private readonly _batchStates: BaseState[] = [];
        private readonly _events: EventData<any>[] = [];

        private _free(): void {
            if (this._states.length > this._index + 1) {
                this._states.length = this._index + 1; // TODO release.

                if (this.dispatcher) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryFree, null));
                }
            }
        }

        private _doState(state: BaseState, isUndo: boolean): boolean {
            if (isUndo) {
                state.undo();
            }
            else {
                state.redo();
            }

            let d = isUndo ? "undo" : "redo";
            console.log(d, ":", state.data.cmdType, "data:", state.data);

            if (this.dispatcher && state.data) {
                const data: EventData<any> = { isUndo: isUndo, data: state.data };
                this._events.push(data);
            }

            return state.batchIndex > 0 && (isUndo ? this._index >= 0 : this._index < this._states.length - 1);
        }

        public back(): boolean {
            if (this._index < 0 || this._batchIndex > 0) {
                return false;
            }

            this._locked |= 1;

            while (this._doState(this._states[this._index--], true)) {
            }

            if (this.dispatcher && this._events.length > 0) {
                for (const event of this._events) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryState, event));
                }

                this._events.length = 0;
            }

            this._locked &= 2;

            return true;
        }

        public forward(): boolean {
            if (this._index >= this._states.length - 1 || this._batchIndex > 0) {
                return false;
            }

            this._locked |= 1;

            while (this._doState(this._states[++this._index], false)) {
            }

            if (this.dispatcher && this._events.length > 0) {
                for (const event of this._events) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryState, event));

                }

                this._events.length = 0;
            }

            this._locked &= 2;

            return true;
        }

        public go(index: number): boolean {
            if (this._batchIndex > 0) {
                return false;
            }

            let result = false;

            if (this._index < index) {
                while (this._index !== index && this.forward()) {
                    result = true;
                }
            }
            else {
                while (this._index !== index && this.back()) {
                    result = true;
                }
            }

            return result;
        }

        public add(state: BaseState): void {
            if (this._locked !== 0) {
                // return;
            }

            if (this._batchIndex > 0) {
                state.batchIndex = this._batchIndex;
                this._batchStates.push(state);
            }
            else {
                this._states[this._index + 1] = state;

                if (this.dispatcher !== null) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryAdd, event));
                }

                this.forward();
                this._free();
            }
        }

        public beginBatch(): void {
            this._batchIndex++;
        }

        public endBatch(): void {
            if (this._batchIndex === 0) {
                return;
            }

            this._batchIndex--;
            if (this._batchIndex === 0) {
                let index = this._index + 1;
                for (const state of this._batchStates) {
                    this._states[index++] = state;
                }

                if (this.dispatcher !== null) {
                    this.dispatcher.dispatchEvent(new BaseEvent(EventType.HistoryAdd, event));
                }

                this._batchStates.length = 0;
                this.go(this._states.length - 1);
            }
        }

        public getState(index: number): BaseState | null {
            return this._states[index];
        }

        public get enabled(): boolean {
            return this._locked === 0;
        }
        public set enabled(value: boolean) {
            if (value) {
                this._locked &= 1;
            }
            else {
                this._locked |= 2;
            }
        }

        public get count(): number {
            return this._states.length;
        }

        public get index(): number {
            return this._index;
        }
    }

    export abstract class BaseState {
        public autoClear: boolean = false;
        public batchIndex: number = 0;
        public data: any = null;
        private _isDone: boolean = false;

        public undo(): boolean {
            if (this._isDone) {
                this._isDone = false;

                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (this._isDone) {
                return false;
            }

            this._isDone = true;

            return true;
        }
    }

    export class ModifyGameObjectPropertyState extends BaseState {
        public static create(data: any = null): ModifyGameObjectPropertyState | null {
            const state = new ModifyGameObjectPropertyState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { hashCode, propName, preValue, editType } = this.data;
                let modifyObj = Editor.editorModel.getGameObjectById(hashCode);
                if (modifyObj && preValue !== undefined) {
                    const toValue = Editor.editorModel.deserializeProperty(preValue, editType);
                    if (toValue) {
                        Editor.editorModel.setTargetProperty(propName,modifyObj,toValue);
                        Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,
                            {
                                target: modifyObj,
                                propName: propName,
                                propValue: toValue
                            }))
                    }
                }
                return true;
            }

            return false;
        }


        public redo(): boolean {
            if (super.redo()) {
                const { hashCode, propName, propValue } = this.data;
                let modifyObj = Editor.editorModel.getGameObjectById(hashCode);
                if (modifyObj && propValue !== undefined) {
                    Editor.editorModel.setTargetProperty(propName,modifyObj,propValue);
                    Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,
                        {
                            target: modifyObj,
                            propName: propName,
                            propValue: propValue
                        }))
                }

                return true;
            }

            return false;
        }
    }

    //修改组件属性属性
    export class ModifyComponentPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyComponentPropertyState]";
        }

        public static create(source: any, key: number | string, value: any, data: any = null): ModifyComponentPropertyState | null {
            const state = new ModifyComponentPropertyState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { propValue, propName, gameObjHashCode, preValue, editType } = this.data;
                let gameObj: GameObject = Editor.editorModel.getGameObjectById(gameObjHashCode);
                let modifyObj: BaseComponent = Editor.editorModel.getComponentById(gameObj, this.data.hashCode);
                if (modifyObj && preValue !== undefined) {
                    let toValue = Editor.editorModel.deserializeProperty(preValue, editType);

                    if (toValue) {
                        Editor.editorModel.setTargetProperty(propName, modifyObj, toValue);
                        Editor.editorModel.dispatchEvent(
                            new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, {
                                target: modifyObj,
                                propName: propName,
                                propValue: toValue
                            }
                            ))
                    }


                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { propValue, propName, gameObjHashCode } = this.data;
                let gameObj: GameObject = Editor.editorModel.getGameObjectById(gameObjHashCode);
                let modifyObj: BaseComponent = Editor.editorModel.getComponentById(gameObj, this.data.hashCode);
                if (modifyObj && propValue !== undefined) {
                    Editor.editorModel.setTargetProperty(propName,modifyObj,propValue);
                    Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,
                        {
                            target: modifyObj,
                            propName: propName,
                            propValue: propValue
                        }))
                }
                return true;
            }

            return false;
        }
    }


    //选中游戏对象
    export class SelectGameObjectesState extends BaseState {
        public static toString(): string {
            return "[class common.SelectGameObjectesState]";
        }

        public static create(data: any = null): SelectGameObjectesState | null {
            const state = new SelectGameObjectesState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let preSelectids = this.data.prevalue;
                let selectObjs = Editor.editorModel.getGameObjectsByIds(preSelectids);
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, selectObjs));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let newSelectids = this.data.newvalue;
                let selectObjs = Editor.editorModel.getGameObjectsByIds(newSelectids);
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, selectObjs));
                return true;
            }

            return false;
        }
    }

    //添加游戏对象
    export class AddGameObjectState extends BaseState {
        public static toString(): string {
            return "[class common.AddGameObjectState]";
        }

        public static create(data: any = null): AddGameObjectState | null {
            const state = new AddGameObjectState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let gameObj = Editor.editorModel.getGameObjectById(this.data.gameObjHashcode);
                Editor.editorModel._deleteGameObject([gameObj]);
                this.data.gameObj = gameObj;

                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, [this.data.gameObj]));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let parentHashCode = this.data.parentHashCode;
                let mesh = this.data.mesh;
                let mat = this.data.mat;
                let gameObj = new GameObject();
                gameObj.name = "NewGameObject";

                if (this.data.deleteComponentcode) {
                    Editor.editorModel.resetComponentHashCode(gameObj, this.data.deleteComponentcode.concat());
                } else {
                    //保存gameobject组件的hashcode
                    let gameObjectComponentsHashCode = [];
                    Editor.editorModel.getAllComponentIdFromGameObject(gameObj, gameObjectComponentsHashCode);
                    this.data.deleteComponentcode = gameObjectComponentsHashCode;
                    console.log("缓存的组件hashcode:" + this.data.deleteComponentcode)
                }

                if (this.data.gameObjHashcode) {
                    (gameObj as any).hashCode = this.data.gameObjHashcode;
                } else {
                    this.data.gameObjHashcode = gameObj.hashCode;
                }

                if (parentHashCode) {
                    let parentObj = Editor.editorModel.getGameObjectById(parentHashCode);
                    if (parentObj)
                        gameObj.transform.setParent(parentObj.transform);
                }

                if (mesh) {
                    let objMesh = gameObj.addComponent(egret3d.MeshFilter);
                    objMesh.mesh = mesh;
                    let renderer = gameObj.addComponent(egret3d.MeshRenderer);
                    if (!mat) {
                        let mat = new egret3d.Material();
                        mat.setShader(egret3d.DefaultShaders.MATERIAL_COLOR);
                        mat.setVector4("_Color", new egret3d.Vector4(0.5, 0.5, 0.5, 1.0));
                    }
                    renderer.materials = [mat];
                }

                this.data.gameObj = gameObj;

                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, [this.data.gameObj]));

                return true;
            }

            return false;
        }
    }

    //删除游戏对象
    export class DeleteGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.deleteGameObjectsState]";
        }

        public static create(data: any = null): DeleteGameObjectsState | null {
            const state = new DeleteGameObjectsState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { datas, prefabData } = this.data;
                let deleteObjs = [];
                for (let index = 0; index < datas.length; index++) {
                    let element = datas[index];
                    let serializeData = element.serializeData;
                    let assetsMap = element.assetsMap;
                    let gameObj: GameObject = deserialize(serializeData, assetsMap);
                    //还原gameobject的hashcode
                    let hashcodes = element.deleteHashcode.concat();
                    Editor.editorModel.resetHashCode(gameObj, hashcodes);
                    //还原gameobject组件的hashcode
                    let componentsHashcodes = element.deleteComponentcode.concat();
                    Editor.editorModel.resetComponentHashCode(gameObj, componentsHashcodes);
                    let parentHashCode = element.parentHashcode;
                    if (parentHashCode) {
                        let parent_3 = Editor.editorModel.getGameObjectById(parentHashCode);
                        if (parent_3)
                            gameObj.transform.setParent(parent_3.transform);
                    }
                    deleteObjs.push(gameObj);
                }

                //预制体相关
                for (let key in prefabData) {
                    const prefabRootId = prefabData[key].rootId;
                    const url = prefabData[key].url;
                    const prefabIds = prefabData[key].prefabIds;
                    const prefab = Asset.find(url);
                    let rootObj = Editor.editorModel.getGameObjectById(prefabRootId);
                    Editor.editorModel.resetPrefabbyRootId(rootObj, prefab, prefabIds);
                }

                this.data.deleteObjs = deleteObjs;
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, deleteObjs));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { datas, prefabData } = this.data;
                let deleteObjs = [];
                let deleteHashcodes = [];
                for (let index = 0; index < datas.length; index++) {
                    let element = datas[index];
                    deleteHashcodes.push(element.deleteHashcode[0]);
                }

                //先处理预制体相关逻辑，再执行删除逻辑
                for (let key in prefabData) {
                    const prefabRootId: number = prefabData[key].rootId;
                    const rootObj: GameObject = Editor.editorModel.getGameObjectById(prefabRootId);
                    Editor.editorModel.clearRootPrefabInstance(rootObj, rootObj);
                }

                deleteObjs = Editor.editorModel.getGameObjectsByIds(deleteHashcodes);
                Editor.editorModel._deleteGameObject(deleteObjs);
                this.data.deleteObjs = deleteObjs;

                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, deleteObjs));
                return true;
            }

            return false;
        }
    }


    //克隆游戏对象
    export class DuplicateGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.DuplicateGameObjectsState]";
        }

        public static create(data: any = null): DuplicateGameObjectsState | null {
            const state = new DuplicateGameObjectsState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                Editor.editorModel._deleteGameObject(this.data.addObjs);
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, this.data.addObjs));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let datas = this.data.datas;
                let prefabData = this.data.prefabData;
                let addObjs: GameObject[] = [];

                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    let duplicateHashCode = element.duplicateHashCode;
                    let sourceObj: GameObject = Editor.editorModel.getGameObjectById(duplicateHashCode);
                    let duplicateObj = clone(sourceObj);
                    duplicateObj.name = sourceObj.name + "_duplicate";
                    duplicateObj.transform.setParent(sourceObj.transform.parent);

                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(duplicateObj, stru, 0);

                    addObjs.push(duplicateObj);
                    //缓存hashcode,有就使用缓存的cache，保持cachecode始终不变
                    if (!element.cacheHashCodes) {
                        let hashCodes: number[] = [];
                        Editor.editorModel.getAllHashCodeFromGameObject(duplicateObj, hashCodes);
                        element["cacheHashCodes"] = hashCodes;

                        let componentHashcodes: number[] = [];
                        Editor.editorModel.getAllComponentIdFromGameObject(duplicateObj, componentHashcodes);
                        element["cacheComponentHashCodes"] = componentHashcodes;
                    } else {
                        Editor.editorModel.resetHashCode(duplicateObj, element.cacheHashCodes.concat());
                        Editor.editorModel.resetComponentHashCode(duplicateObj, element.cacheComponentHashCodes.concat());
                    }
                }

                this.data.addObjs = addObjs;
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, addObjs));
                return true;
            }

            return false;
        }
    }

    //粘贴游戏对象
    export class PasteGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.PasteGameObjectsState]";
        }

        public static create(data: any = null): PasteGameObjectsState | null {
            const state = new PasteGameObjectsState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                Editor.editorModel._deleteGameObject(this.data.addObjs);
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, this.data.addObjs));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let datas = this.data.datas;
                let addObjs: GameObject[] = [];
                let prefabData = this.data.prefabData;

                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    let pasteHashCode = element.pasteHashCode;
                    let targetTransform = this.data.target;

                    let sourceObj = Editor.editorModel.getGameObjectById(pasteHashCode);
                    let pasteObj = clone(sourceObj);
                    pasteObj.name = sourceObj.name + "_paste";
                    pasteObj.transform.setParent(targetTransform);

                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(pasteObj, stru, 0);

                    addObjs.push(pasteObj);
                    //缓存hashcode,有就使用缓存的cache，保持cachecode始终不变
                    if (!element.cacheHashCodes) {
                        let hashCodes: number[] = [];
                        Editor.editorModel.getAllHashCodeFromGameObject(pasteObj, hashCodes);
                        element.cacheHashCodes = hashCodes;

                        let componentHashcodes: number[] = [];
                        Editor.editorModel.getAllComponentIdFromGameObject(pasteObj, componentHashcodes);
                        element["cacheComponentHashCodes"] = componentHashcodes;
                    } else {
                        Editor.editorModel.resetHashCode(pasteObj, element.cacheHashCodes.concat());
                        Editor.editorModel.resetComponentHashCode(pasteObj, element.cacheComponentHashCodes.concat());
                    }
                }

                this.data.addObjs = addObjs;
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, addObjs));

                return true;
            }

            return false;
        }
    }

    //添加组件
    export class AddComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddComponentState]";
        }

        public static create(data: any = null): AddComponentState | null {
            const state = new AddComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let gameObjectId = this.data.gameObjectId;
                let componentId = this.data.componentId;
                let gameObject = Editor.editorModel.getGameObjectById(gameObjectId);
                if (gameObject) {
                    for (let i: number = 0; i < gameObject.components.length; i++) {
                        let comp = gameObject.components[i];
                        if (comp.hashCode === componentId) {
                            gameObject.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.REMOVE_COMPONENT));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectId = this.data.gameObjectId;
                let compClzName = this.data.compClzName;
                let gameObject = Editor.editorModel.getGameObjectById(gameObjectId);
                if (gameObject) {
                    let compClz = egret.getDefinitionByName(compClzName);
                    let addComponent = gameObject.addComponent(compClz);
                    this.data.componentId = addComponent.hashCode;
                    if (this.data.cacheHashCode) {
                        (addComponent as any).hashCode = this.data.cacheHashCode
                    } else {
                        this.data.cacheHashCode = addComponent.hashCode;
                    }
                }
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_COMPONENT));
                return true;
            }

            return false;
        }
    }

    //移除组件
    export class RemoveComponentState extends BaseState {
        public static toString(): string {
            return "[class common.RemoveComponentState]";
        }

        public static create(data: any = null): RemoveComponentState | null {
            const state = new RemoveComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let serializeData = this.data.serializeData;
                let component: BaseComponent = deserialize(serializeData, this.data.assetsMap);
                let gameObjectId = this.data.gameObjectId;
                if (component) {
                    let gameObject = Editor.editorModel.getGameObjectById(gameObjectId);
                    (component as any).hashCode = this.data.hashcode;
                    (component as any).gameObject = gameObject;

                    if (gameObject) {
                        Editor.editorModel.addComponentToGameObject(gameObject, component);
                    }
                    Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.ADD_COMPONENT));
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectId = this.data.gameObjectId;
                let componentId = this.data.componentId;
                let obj = Editor.editorModel.getGameObjectById(gameObjectId);
                if (obj) {
                    for (let i: number = 0; i < obj.components.length; i++) {
                        let comp = obj.components[i];
                        if (comp.hashCode === componentId) {
                            obj.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.REMOVE_COMPONENT));
                return true;
            }

            return false;
        }
    }

    //更改游戏对象层级
    export class UpdateParentState extends BaseState {
        public static toString(): string {
            return "[class common.UpdateParentState]";
        }

        public static create(data: any = null): UpdateParentState | null {
            const state = new UpdateParentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { gameObjectIds, targetId, originParentIds, prefabData } = this.data;
                const gameObjs = Editor.editorModel.getGameObjectsByIds(gameObjectIds);
                let originParentId;
                let originParent;
                let originTransForm;
                for (let index = 0; index < gameObjs.length; index++) {
                    const element = gameObjs[index];
                    originParentId = originParentIds[index];
                    if (originParentId) {
                        originParent = Editor.editorModel.getGameObjectById(originParentId);
                    }
                    originTransForm = originParent ? originParent.transform : null;
                    element.transform.setParent(originTransForm);
                    if (prefabData[element.hashCode]) {
                        const prefabRootId = prefabData[element.hashCode].rootId;
                        const url = prefabData[element.hashCode].url;
                        const prefabIds = prefabData[element.hashCode].prefabIds;
                        const prefab = Asset.find(url);
                        let rootObj = Editor.editorModel.getGameObjectById(prefabRootId);
                        Editor.editorModel.resetPrefabbyRootId(rootObj, prefab, prefabIds);
                    }
                }
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.UPDATE_PARENT));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectIds, targetId, prefabData } = this.data;
                const gameObjs = Editor.editorModel.getGameObjectsByIds(gameObjectIds);
                const targetGameObj = Editor.editorModel.getGameObjectById(targetId);
                let targetTransform = null;
                for (let index = 0; index < gameObjs.length; index++) {
                    const element = gameObjs[index];
                    if (targetGameObj) {
                        targetTransform = targetGameObj.transform;
                    }
                    if (prefabData[element.hashCode]) {
                        const prefabRootId: number = prefabData[element.hashCode].rootId;
                        const rootObj: GameObject = Editor.editorModel.getGameObjectById(prefabRootId);
                        Editor.editorModel.clearRootPrefabInstance(rootObj, rootObj);
                    }
                    element.transform.setParent(targetTransform);
                }
                Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.UPDATE_PARENT));
                return true;
            }

            return false;
        }
    }

    export class ModifyPrefabProperty extends BaseState {
        protected getGameObjectById(gameObjectId: number): GameObject {
            let paper = gameObjectId < 0 ? this.data.backRuntime.paper : __global['paper'];
            let objects = paper.Application.sceneManager.getActiveScene().gameObjects;
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i].hashCode === gameObjectId) {
                    return objects[i];
                }
            }
            return null;
        }

        protected getGameObjectsByPrefab = (prefab: egret3d.Prefab): GameObject[] => {
            let objects = Application.sceneManager.getActiveScene().gameObjects;
            let result: GameObject[] = [];
            objects.forEach(obj => {
                if (obj.prefab && obj.prefab.url === prefab.url && (obj as any).___isRootPrefab____) {
                    result.push(obj);
                }
            })
            return result;
        }

        protected equal(a: any, b: any): boolean {
            let className = egret.getQualifiedClassName(a);
            if (className === egret.getQualifiedClassName(b)) {
                switch (className) {
                    case 'egret3d.Vector2': return egret3d.Vector2.equal(a, b);
                    case 'egret3d.Vector3': return egret3d.Vector3.equal(a, b);
                    case 'egret3d.Vector4': return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
                    case 'egret3d.Quaternion': return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
                    case 'egret3d.Rect': return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
                    case 'egret3d.Color': return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
                    default:
                        return false;
                }
            }
            else return false;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            Editor.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,
                {
                    target: modifyObj,
                    propName: propName,
                    propValue: newValue
                }))
        }
    }

    //修改预制体游戏对象属性
    export class ModifyPrefabGameObjectPropertyState extends ModifyPrefabProperty {
        public static toString(): string {
            return "[class common.ModifyPrefabGameObjectPropertyState]";
        }

        public static create(data: any = null): ModifyPrefabGameObjectPropertyState | null {
            const state = new ModifyPrefabGameObjectPropertyState();
            state.data = data;
            return state;
        }

        /**
         * 修改预制体游戏对象属性,目前只支持修改根对象
         * @param gameObjectId 
         * @param valueList 
         */
        public modifyPrefabGameObjectPropertyValues(gameObjectId: number, valueList: any[]): void {
            let prefabObj = this.getGameObjectById(gameObjectId);
            if (!prefabObj) {
                return;
            }
            let objects = this.getGameObjectsByPrefab(prefabObj.prefab);
            let editInfoList = editor.getEditInfo(prefabObj);
            valueList.forEach(propertyValue => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                objects.forEach(object => {
                    let valueType = typeof object[propName];

                    if (valueType === 'number' || valueType === 'boolean' || valueType === 'string') {
                        if (object[propName] === prefabObj[propName]) {
                            Editor.editorModel.setTargetProperty(propName, object, newValue);
                            this.dispathPropertyEvent(object, propName, newValue);
                        }
                    }
                    else {
                        if (this.equal(object[propName], prefabObj[propName])) {
                            Editor.editorModel.setTargetProperty(propName, object, newValue);
                            this.dispathPropertyEvent(object, propName, newValue);
                        }
                    }
                });

                Editor.editorModel.setTargetProperty(propName, prefabObj, newValue);
                this.dispathPropertyEvent(prefabObj, propName, newValue);
            });
        }

        public undo(): boolean {
            if (super.undo()) {
                const { gameObjectId, preValueCopylist } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectId, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectId, newValueList } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectId, newValueList);
                return true;
            }

            return false;
        }
    }

    //修改预制体组件属性
    export class ModifyPrefabComponentPropertyState extends ModifyPrefabProperty {
        public static toString(): string {
            return "[class common.ModifyPrefabComponentPropertyState]";
        }

        public static create(data: any = null): ModifyPrefabComponentPropertyState | null {
            const state = new ModifyPrefabComponentPropertyState();
            state.data = data;
            return state;
        }

        public modifyPrefabComponentPropertyValues(gameObjectId: number, componentId: number, valueList: any[]): void {
            let prefabObj = this.getGameObjectById(gameObjectId);
            if (!prefabObj) {
                return;
            }
            let objects = this.getGameObjectsByPrefab(prefabObj.prefab);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let PrefabComp = prefabObj.components[k];
                let editInfoList = editor.getEditInfo(PrefabComp);
                if (PrefabComp.hashCode === componentId) {
                    valueList.forEach(propertyValue => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                        objects.forEach(object => {
                            let objectComp = object.components[k];
                            let valueType = typeof objectComp[propName];
                            if (valueType === 'number' || valueType === 'boolean' || valueType === 'string') {
                                if (objectComp[propName] === PrefabComp[propName]) {
                                    Editor.editorModel.setTargetProperty(propName, objectComp, newValue);
                                    this.dispathPropertyEvent(objectComp, propName, newValue);
                                }
                            }
                            else {
                                if (this.equal(objectComp[propName], PrefabComp[propName])) {
                                    Editor.editorModel.setTargetProperty(propName, objectComp, newValue);
                                    // this.dispathPropertyEvent(objectComp, propName, newValue);
                                }
                            }
                        });

                        Editor.editorModel.setTargetProperty(propName, PrefabComp, newValue);
                        this.dispathPropertyEvent(PrefabComp, propName, newValue);
                    })
                }
            }
        }

        public undo(): boolean {
            if (super.undo()) {
                const { gameObjectId, componentId, preValueCopylist } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjectId, componentId, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectId, componentId, newValueList } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjectId, componentId, newValueList);
                return true;
            }

            return false;
        }
    }
}