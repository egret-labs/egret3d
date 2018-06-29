namespace paper.editor {
    export type EventData<D> = { isUndo: boolean, data: D };

    export const EventType = {
        HistoryState: "HistoryState",
        HistoryAdd: "HistoryAdd",
        HistoryFree: "HistoryFree"
    };

    export class History {
        constructor();
        constructor(serializeData:any);
        constructor(serializeData?:any){
            this._index = serializeData ? serializeData.index : -1;
            this._locked = serializeData ? serializeData.locked : 0;
            this._batchIndex = serializeData ? serializeData.batchIndex : 0;
            this._states = serializeData ? serializeData.states : [];
        }

        public static toString(): string {
            return "[class common.History]";
            
        }

        public dispatcher: EventDispatcher | null = null;

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
                return;
            }

            if (this._batchIndex > 0) {
                state.batchIndex = this._batchIndex;
                this._batchStates.push(state);
            }
            else {
                console.log("addstate:",this._index);
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

        public get batchIndex():number{
            return this._batchIndex;
        }
    
        public get locked():0 | 1 | 2 |3{
            return this._locked;
        }

        public get states():BaseState[]
        {
            return this._states;
        }
    }

    export class HistoryUtil{
        public static serialize(history:History):any{
            const states:BaseState[] = history.states; 
            const statesData:any[] = [];
            for (let index = 0; index < states.length; index++) {
                const element = states[index];
                const className = egret.getQualifiedClassName(element);
                const data = {
                    className,
                    batchIndex:element.batchIndex,
                    data:element.data,
                    autoClear:element.autoClear,
                    isDone:element.isDone,
                } 
                statesData.push(data);
            }

            const serializeHistory = {
                index:history.index,
                batchIndex:history.batchIndex,
                locked:history.locked,
                statesData,
            }

            return serializeHistory;
        }

        public static deserialize(serializeHistory:any):any{
            const states:BaseState[] = [];
            const statesData:any[] = serializeHistory.statesData;
            for (let index = 0; index < statesData.length; index++) {
                const element = statesData[index];
                const clazz = egret.getDefinitionByName(element.className);
                let state: BaseState = null;
                if (clazz) {
                    state = new clazz();
                    state.batchIndex = element.batchIndex;
                    state.data = element.data;
                    state.autoClear = element.autoClear;
                    state.isDone = element.isDone;
                    states.push(state);
                }
            }
            const initData = {
                states,
                index:serializeHistory.index,
                batchIndex:serializeHistory.batchIndex,
                locked:serializeHistory.locked,
            }
            return new History(initData);
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

        public get isDone():boolean{
            return this._isDone;
        }

        public set isDone(value:boolean){
            this._isDone = value;
        }

        public dispatchEditorModelEvent(type:string,data?:any)
        {
            Editor.editorModel.dispatchEvent(new EditorModelEvent(type,data));
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
                const { preValue } = this.data;
                this.modifyProperty(preValue);
                return true;
            }

            return false;
        }

        private modifyProperty(value:any)
        {
            const { uuid, propName,editType } = this.data;
            let modifyObj = Editor.editorModel.getGameObjectByUUid(uuid);
            if (modifyObj && value !== undefined) {
                const toValue = Editor.editorModel.deserializeProperty(value, editType);
                if (toValue !== null) {
                    Editor.editorModel.setTargetProperty(propName, modifyObj, toValue);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,{target:modifyObj,propName: propName,propValue: toValue})
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValue } = this.data;
                this.modifyProperty(newValue);
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
                const { preValue} = this.data;
                this.modifyProperty(preValue);
                return true;
            }

            return false;
        }

        private modifyProperty(value:any):void{
            const { propName, componentUUid,gameObjectUUid,editType } = this.data;
            let gameObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            let modifyObj: BaseComponent | null;
            if (gameObj) {
                modifyObj = Editor.editorModel.getComponentById(gameObj,componentUUid);
            }
            if (modifyObj && value !== undefined) {
                let toValue = Editor.editorModel.deserializeProperty(value, editType);

                if (toValue !== null) {
                    Editor.editorModel.setTargetProperty(propName, modifyObj, toValue);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,{target: modifyObj,propName: propName, propValue: toValue});
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValue} = this.data;
                this.modifyProperty(newValue);
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
                let selectObjs = {};
                selectObjs[selectItemType.GAMEOBJECT] = preSelectids;
                this.dispatchEditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS,selectObjs);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let newSelectids = this.data.newvalue;
                let selectObjs = {};
                selectObjs[selectItemType.GAMEOBJECT] = newSelectids;
                this.dispatchEditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS,selectObjs);
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
                let {datas} = this.data;
                let delectUUids:string[] = datas.map((data) => {if (data.cacheGameObjectUUid) {
                    return data.cacheGameObjectUUid;
                }});
                let gameObjs = Editor.editorModel.getGameObjectsByUUids(delectUUids);
                Editor.editorModel._deleteGameObject(gameObjs);
                const selectUUids:number = datas.map((data) => {if (data.parentUUid) {
                    return data.parentUUid;
                }});
                
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,selectUUids);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let {datas} = this.data;
                let selectUUids:string[] = [];
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const {parentUUid} = element;
                    let gameObj = new GameObject();
                    gameObj.name = "NewGameObject";
                    Editor.editorModel.generateGameobjectUUids(gameObj);

                    if (element.cacheGameObjectUUid) {
                        gameObj.uuid = element.cacheGameObjectUUid;
                    } else {
                        element.cacheGameObjectUUid = gameObj.uuid;
                    }

                    if (element.cacheComponentsUUids) {
                        Editor.editorModel.resetComponentUUid(gameObj, element.cacheComponentsUUids.concat());
                    }else{
                        element.cacheComponentsUUids = [];
                        Editor.editorModel.getAllComponentUUidFromGameObject(gameObj, element.cacheComponentsUUids);
                    }   

                    if (parentUUid) {
                        const parentGameObj:GameObject | null = Editor.editorModel.getGameObjectByUUid(parentUUid);
                        if (parentGameObj) {
                            gameObj.transform.setParent(parentGameObj.transform);
                        }
                    }

                    selectUUids.push(gameObj.uuid);
                }

                //select new objects
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS,selectUUids);

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
                const { datas, prefabData,selectIds } = this.data;

                for (let index = 0; index < datas.length; index++) {
                    let element = datas[index];
                    let serializeData = element.serializeData;
                    let assetsMap = element.assetsMap;
                    let gameObj: GameObject = deserialize(serializeData, assetsMap);
                    let uuids = element.deleteuuids.concat();
                    Editor.editorModel.resetUUid(gameObj, uuids);
                    let componentsUUids = element.deleteComponentUUids.concat();
                    Editor.editorModel.resetComponentUUid(gameObj, componentsUUids);
                    let parentUUid = element.parentUUid;
                    if (parentUUid) {
                        let parent_3 = Editor.editorModel.getGameObjectByUUid(parentUUid);
                        if (parent_3)
                            gameObj.transform.setParent(parent_3.transform);
                    }
                }

                //预制体相关
                for (let key in prefabData) {
                    const prefabRootId = prefabData[key].rootId;
                    const url = prefabData[key].url;
                    const prefabIds = prefabData[key].prefabIds;
                    const prefab = Asset.find(url);
                    let rootObj:GameObject | null = Editor.editorModel.getGameObjectByUUid(prefabRootId);
                    if (rootObj) {
                        Editor.editorModel.resetPrefabbyRootId(rootObj, prefab, prefabIds);
                    }
                }

                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS,selectIds);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { datas, prefabData } = this.data;
                let deleteObjs = [];
                let deleteUUids = [];
                for (let index = 0; index < datas.length; index++) {
                    let element = datas[index];
                    deleteUUids.push(element.deleteuuids[0]);
                }

                //先处理预制体相关逻辑，再执行删除逻辑
                for (let key in prefabData) {
                    const prefabRootId: string = prefabData[key].rootId;
                    const rootObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(prefabRootId);
                    if (rootObj) {
                        Editor.editorModel.clearRootPrefabInstance(rootObj, rootObj);
                    }
                }

                deleteObjs = Editor.editorModel.getGameObjectsByUUids(deleteUUids);
                Editor.editorModel._deleteGameObject(deleteObjs);

                //clear select
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,[]);
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
                const {selectIds} = this.data;
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,selectIds);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let datas = this.data.datas;
                let prefabData = this.data.prefabData;
                let addObjs: GameObject[] = [];
                let selectIds:string[] = [];

                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    let duplicateUUid = element.duplicateUUid;
                    let sourceObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(duplicateUUid);
                    if (!sourceObj) {
                        continue;
                    }
                    let duplicateObj = clone(sourceObj);
                    duplicateObj.name = sourceObj.name + "_duplicate";
                    duplicateObj.transform.setParent(sourceObj.transform.parent);
                    Editor.editorModel.generateGameobjectUUids(duplicateObj);

                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(duplicateObj, stru, 0);

                    addObjs.push(duplicateObj);
                    
                     //缓存uuid,有就使用缓存的cache，保持uuid始终不变
                     if (!element.cacheGameObjectUUids) {
                        let gameObjectUUids: string[] = [];
                        Editor.editorModel.getAllUUidFromGameObject(duplicateObj, gameObjectUUids);
                        element.cacheGameObjectUUids = gameObjectUUids;

                        let componentUUids: string[] = [];
                        Editor.editorModel.getAllComponentUUidFromGameObject(duplicateObj, componentUUids);
                        element.cacheComponentUUids = componentUUids;
                    } else {
                        Editor.editorModel.resetUUid(duplicateObj, element.cacheGameObjectUUids.concat());
                        Editor.editorModel.resetComponentUUid(duplicateObj, element.cacheComponentUUids.concat());
                    }

                    selectIds.push(duplicateObj.uuid);
                }

                this.data.addObjs = addObjs;

                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS,selectIds);
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

        public static create(data: any = null): PasteGameObjectsState {
            const state = new PasteGameObjectsState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                Editor.editorModel._deleteGameObject(this.data.addObjs);
                const {selectIds} = this.data;
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,selectIds);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let datas = this.data.datas;
                let addObjs: GameObject[] = [];
                let prefabData = this.data.prefabData;
                let selectIds:string[] = [];

                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    let parentUUid = element.parentUUid;
                    let targetTransform = this.data.target;

                    let sourceObj = Editor.editorModel.getGameObjectByUUid(parentUUid);
                    if (!sourceObj) {
                        continue;
                    }
                    let pasteObj = clone(sourceObj);
                    pasteObj.name = sourceObj.name + "_paste";
                    pasteObj.transform.setParent(targetTransform);
                    Editor.editorModel.generateGameobjectUUids(pasteObj);


                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(pasteObj, stru, 0);

                    addObjs.push(pasteObj);
                    
                    //缓存uuid,有就使用缓存的cache，保持uuid始终不变
                    if (!element.cacheGameObjectUUids) {
                        let gameObjectUUids: string[] = [];
                        Editor.editorModel.getAllUUidFromGameObject(pasteObj, gameObjectUUids);
                        element.cacheGameObjectUUids = gameObjectUUids;

                        let componentUUids: string[] = [];
                        Editor.editorModel.getAllComponentUUidFromGameObject(pasteObj, componentUUids);
                        element.cacheComponentUUids = componentUUids;
                    } else {
                        Editor.editorModel.resetUUid(pasteObj, element.cacheGameObjectUUids.concat());
                        Editor.editorModel.resetComponentUUid(pasteObj, element.cacheComponentUUids.concat());
                    }

                    selectIds.push(pasteObj.uuid);
                }

                this.data.addObjs = addObjs;
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS,selectIds);

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
                let gameObjectUUid = this.data.gameObjectUUid;
                let componentId = this.data.cacheUUid;
                let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject) {
                    for (let i: number = 0; i < gameObject.components.length; i++) {
                        let comp = gameObject.components[i];
                        if (comp.uuid === componentId) {
                            gameObject.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.data.gameObjectUUid;
                let compClzName = this.data.compClzName;
                let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject) {
                    let compClz = egret.getDefinitionByName(compClzName);
                    let addComponent = gameObject.addComponent(compClz);
                    addComponent.uuid = generateUuid();

                    if (this.data.cacheUUid) {
                        addComponent.uuid = this.data.cacheUUid;
                    } else {
                        this.data.cacheUUid = addComponent.uuid;
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
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
                let gameObjectUUid = this.data.gameObjectUUid;
                if (component) {
                    let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObject) {
                        component.uuid = this.data.componentUUid;
                        (component as any).gameObject = gameObject;

                        Editor.editorModel.addComponentToGameObject(gameObject, component);
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.data.gameObjectUUid;
                let componentUUid = this.data.componentUUid;
                let obj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (obj) {
                    for (let i: number = 0; i < obj.components.length; i++) {
                        let comp = obj.components[i];
                        if (comp.uuid === componentUUid) {
                            obj.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
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
                const { gameObjectUUids, targetUUid, originParentIds, prefabData } = this.data;
                const gameObjs = Editor.editorModel.getGameObjectsByUUids(gameObjectUUids);
                let originParentId;
                let originParent;
                let originTransForm;
                for (let index = 0; index < gameObjs.length; index++) {
                    const element = gameObjs[index];
                    originParentId = originParentIds[index];
                    if (originParentId) {
                        originParent = Editor.editorModel.getGameObjectByUUid(originParentId);
                    }
                    originTransForm = originParent ? originParent.transform : null;
                    element.transform.setParent(originTransForm);

                    if (prefabData[element.uuid]) {
                        const prefabRootId = prefabData[element.uuid].rootId;
                        const url = prefabData[element.uuid].url;
                        const prefabIds = prefabData[element.uuid].prefabIds;
                        const prefab = Asset.find(url);
                        let rootObj = Editor.editorModel.getGameObjectByUUid(prefabRootId);
                        if (rootObj) {
                            Editor.editorModel.resetPrefabbyRootId(rootObj, prefab, prefabIds);
                        }
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_PARENT);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectUUids, targetUUid, prefabData } = this.data;
                const gameObjs = Editor.editorModel.getGameObjectsByUUids(gameObjectUUids);
                const targetGameObj = Editor.editorModel.getGameObjectByUUid(targetUUid);
                let targetTransform = null;
                for (let index = 0; index < gameObjs.length; index++) {
                    const element = gameObjs[index];
                    if (targetGameObj) {
                        targetTransform = targetGameObj.transform;
                    }
                    if (prefabData[element.uuid]) {
                        const prefabRootId: string = prefabData[element.uuid].rootId;
                        const rootObj: GameObject = Editor.editorModel.getGameObjectByUUid(prefabRootId);
                        Editor.editorModel.clearRootPrefabInstance(rootObj, rootObj);
                    }
                    element.transform.setParent(targetTransform);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_PARENT);
                return true;
            }

            return false;
        }
    }

    export class ModifyPrefabProperty extends BaseState {
        protected getGameObjectsByPrefab = (prefab: egret3d.Prefab): GameObject[] => {
            let objects = Application.sceneManager.activeScene.gameObjects;
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
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,{target: modifyObj, propName: propName,propValue: newValue})
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
        public modifyPrefabGameObjectPropertyValues(gameObjectUUid: string, valueList: any[]): void {
            let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
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
                const { gameObjectUUid, preValueCopylist } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectUUid, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectUUid, newValueList } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectUUid, newValueList);
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

        public modifyPrefabComponentPropertyValues(gameObjUUid: string, componentUUid: string, valueList: any[]): void {
            let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
            if (!prefabObj) {
                return;
            }
            let objects = this.getGameObjectsByPrefab(prefabObj.prefab);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let PrefabComp = prefabObj.components[k];
                let editInfoList = editor.getEditInfo(PrefabComp);
                if (PrefabComp.uuid === componentUUid) {
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
                                    this.dispathPropertyEvent(objectComp, propName, newValue);
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
                const { gameObjUUid, componentUUid, preValueCopylist } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjUUid, componentUUid, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjUUid, componentUUid, newValueList } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjUUid, componentUUid, newValueList);
                return true;
            }

            return false;
        }
    }



    //移除组件
    export class RemovePrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.RemovePrefabComponentState]";
        }

        public static create(data: any = null): RemovePrefabComponentState | null {
            const state = new RemovePrefabComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjUUid, componentUUid, serializeData, assetsMap } = element;
                    const addComponent: BaseComponent = deserialize(serializeData, assetsMap);
                    if (addComponent) {
                        const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
                        if (gameObj) {
                            addComponent.uuid = componentUUid;
                            (addComponent as any).gameObject = gameObj;
                            Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                            this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                        }
                    }
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjUUid, componentUUid } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
                    if (gameObj) {
                        const componentObj = Editor.editorModel.getComponentById(gameObj, componentUUid);
                        if (componentObj) {
                            gameObj.removeComponent(componentObj.constructor as any);
                            this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                        }
                    }
                }
                return true;
            }

            return false;
        }
    }


    //添加组件
    export class AddPrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddPrefabComponentState]";
        }

        public static create(data: any = null): AddPrefabComponentState | null {
            const state = new AddPrefabComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjectUUid, compClzName, cacheUUid } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObj && cacheUUid) {
                        const removeComponent = Editor.editorModel.getComponentById(gameObj, cacheUUid);
                        if (removeComponent) {
                            gameObj.removeComponent(removeComponent as any);
                        }
                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjectUUid, compClz } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObj) {
                        const addComponent = gameObj.addComponent(compClz);
                        addComponent.uuid = generateUuid();

                        if (element.cacheUUid) {
                            addComponent.uuid = element.cacheUUid;
                        } else {
                            element.cacheUUid = addComponent.uuid;
                        }
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }
    }

    //修改asset
    export class ModifyAssetPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyAssetPropertyState]";
        }

        public static create(data: any = null): ModifyAssetPropertyState | null {
            const state = new ModifyAssetPropertyState();
            state.data = data;
            return state;
        }

        public modifyAssetPropertyValues(target: Asset, valueList: any[]): void {
            let editInfoList = editor.getEditInfo(target);
            valueList.forEach(propertyValue => {
                const { propName, copyValue, valueEditType } = propertyValue;
                const newValue = Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                Editor.editorModel.setTargetProperty(propName, target, newValue);
                this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,{target:target,propName:propName,propValue:newValue});
            });
        }

        public undo(): boolean {
            if (super.undo()) {
                const { target, preValueCopylist } = this.data;
                this.modifyAssetPropertyValues(target, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValueList,target } = this.data;
                this.modifyAssetPropertyValues(target,newValueList);
                return true;
            }

            return false;
        }
    }
}