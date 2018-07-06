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

        private async modifyProperty(value:any)
        {
            const { uuid, propName,editType } = this.data;
            let modifyObj = Editor.editorModel.getGameObjectByUUid(uuid);
            if (modifyObj && value !== undefined) {
                const toValue = await Editor.editorModel.deserializeProperty(value, editType);
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

        private async modifyProperty(value:any):Promise<void>{
            const { propName, componentUUid,gameObjectUUid,editType } = this.data;
            let gameObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            let modifyObj: BaseComponent | null;
            if (gameObj) {
                modifyObj = Editor.editorModel.getComponentById(gameObj,componentUUid);
            }
            if (modifyObj && value !== undefined) {
                let toValue = await Editor.editorModel.deserializeProperty(value, editType);

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
                var datas = this.data.datas;
                var gameObjs = editor.Editor.editorModel.getGameObjectsByUUids( this.data.cacheGameObjectUUid);
                editor.Editor.editorModel._deleteGameObject(gameObjs);
                var selectUUids = datas.filter(function (data) {
                    if (data.parentUUid) {
                        return data.parentUUid;
                    }
                });
                this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS,selectUUids);
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

                    let gameObj:GameObject;

                    if (element.serializeData) {
                        gameObj = deserialize(element.serializeData,element.assetsMap);
                    }else{
                        gameObj = new GameObject();
                        gameObj.name = "NewGameObject";
                        element.serializeData = serialize(gameObj);
                        element.assetsMap = Editor.editorModel.createAssetMap(element.serializeData);
                    }

                    if (parentUUid) {
                        const parentGameObj:GameObject | null = Editor.editorModel.getGameObjectByUUid(parentUUid);
                        if (parentGameObj) {
                            gameObj.transform.setParent(parentGameObj.transform);
                        }
                    }

                    selectUUids.push(gameObj.uuid);
                }

                this.data.cacheGameObjectUUid = selectUUids.concat();

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
                const { datas, prefabData,selectIds,indexData } = this.data;
                let addObjs:GameObject[] = [];

                for (let index = 0; index < datas.length; index++) {
                    let element = datas[index];
                    let serializeData = element.serializeData;
                    let assetsMap = element.assetsMap;
                    let gameObj: GameObject = deserialize(serializeData, assetsMap);
                    addObjs.push(gameObj);
                }

                //reset index
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    let parentUUid = element.parentUUid;
                    let preIndex = element.preIndex;
                    let gameObj = addObjs[index];
                    if (!gameObj) {
                        continue;
                    }
                    
                    if (parentUUid) {
                        let parent_3 = Editor.editorModel.getGameObjectByUUid(parentUUid);
                        if (parent_3){
                            gameObj.transform.setParent(parent_3.transform);
                            gameObj.transform.parent.setChildIndex(gameObj.transform,preIndex);
                        }
                    }
                }

                for (let index = 0; index < indexData.length; index++) {
                    const element = indexData[index];
                    const{preIndex,uuid} = element;
                    let allObjs = paper.Application.sceneManager.getActiveScene().gameObjects;
                    let gameObj = Editor.editorModel.getGameObjectByUUid(uuid);
                    let currentIndex = allObjs.indexOf(gameObj);
                    if(currentIndex == preIndex || currentIndex < 0)
                    {
                        return;
                    }
                    (allObjs as any).splice(currentIndex,1);
                    (allObjs as any).splice(preIndex,0,gameObj);
                }

                //prefab
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
                    deleteUUids.push(element.deleteuuid);
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

                    let duplicateObj:GameObject;
                    if (element.serializeData) {
                        duplicateObj = deserialize(element.serializeData,element.assetsMap);
                        duplicateObj.transform.setParent(sourceObj.transform.parent);
                    }else{
                        duplicateObj = clone(sourceObj);
                        duplicateObj.name = sourceObj.name + "_duplicate";
                        duplicateObj.transform.setParent(sourceObj.transform.parent);
                        element.serializeData = serialize(duplicateObj);
                        element.assetsMap = Editor.editorModel.createAssetMap(element.serializeData);
                    }

                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(duplicateObj, stru, 0);

                    addObjs.push(duplicateObj);
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

                    let pasteObj:GameObject;
                    if (element.serializeData) {
                        pasteObj = deserialize(element.serializeData,element.assetsMap);
                        pasteObj.transform.setParent(sourceObj.transform.parent);
                    }else{
                        pasteObj = clone(sourceObj);
                        pasteObj.name = sourceObj.name + "_paste";
                        pasteObj.transform.setParent(sourceObj.transform.parent);
                        element.serializeData = serialize(pasteObj);
                        element.assetsMap = Editor.editorModel.createAssetMap(element.serializeData);
                    }

                    let stru = prefabData[index];
                    Editor.editorModel.duplicatePrefabDataToGameObject(pasteObj, stru, 0);

                    addObjs.push(pasteObj);
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
                    let addComponent;
                    if (this.data.serializeData) {
                        addComponent = deserialize(this.data.serializeData,this.data.assetsMap);
                        Editor.editorModel.addComponentToGameObject(gameObject,addComponent);
                    }else{
                        let compClz = egret.getDefinitionByName(compClzName);
                        addComponent = gameObject.addComponent(compClz);
                        this.data.serializeData = serialize(addComponent);
                        this.data.assetsMap = Editor.editorModel.createAssetMap(this.data.serializeData);
                    }

                    this.data.cacheUUid = addComponent.uuid;
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
            let objects = Application.sceneManager.getActiveScene().gameObjects;
            let result: GameObject[] = [];
            objects.forEach(obj => {
                if (obj.prefab && obj.prefab.url === prefab.url && Editor.editorModel.isPrefabRoot(obj)) {
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
        private async modifyPrefabGameObjectPropertyValues(gameObjectUUid: string, valueList: any[]): Promise<void> {
            let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (!prefabObj) {
                return;
            }
            let objects = this.getGameObjectsByPrefab(prefabObj.prefab);
            let editInfoList = editor.getEditInfo(prefabObj);
            valueList.forEach(async(propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
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

        public async modifyPrefabComponentPropertyValues(gameObjUUid: string, componentUUid: string, valueList: any[]): Promise<void> {
            let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
            if (!prefabObj) {
                return;
            }
            let objects = this.getGameObjectsByPrefab(prefabObj.prefab);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let prefabComp = prefabObj.components[k];
                let editInfoList = editor.getEditInfo(prefabComp);
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach(async(propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                        objects.forEach(object => {
                            let objectComp = Editor.editorModel.getComponentByAssetId(object,prefabComp.assetUUid);
                            if (objectComp !== null) {
                                let valueType = typeof objectComp[propName];
                                if (valueType === 'number' || valueType === 'boolean' || valueType === 'string') {
                                    if (objectComp[propName] === prefabComp[propName]) {
                                        Editor.editorModel.setTargetProperty(propName, objectComp, newValue);
                                        this.dispathPropertyEvent(objectComp, propName, newValue);
                                    }
                                }
                                else {
                                    if (this.equal(objectComp[propName], prefabComp[propName])) {
                                        Editor.editorModel.setTargetProperty(propName, objectComp, newValue);
                                        this.dispathPropertyEvent(objectComp, propName, newValue);
                                    }
                                }
                            }else{
                                console.warn(`{prefabComp.assetUUid} not match!`)
                            }

                        });

                        Editor.editorModel.setTargetProperty(propName, prefabComp, newValue);
                        this.dispathPropertyEvent(prefabComp, propName, newValue);
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
                            // addComponent.uuid = componentUUid;
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
                        let addComponent;

                        if (this.data.serializeData) {
                            addComponent = deserialize(this.data.serializeData,this.data.assetsMap,true);
                            Editor.editorModel.addComponentToGameObject(gameObj,addComponent);
                        }else{
                            addComponent = gameObj.addComponent(compClz);
                            this.data.serializeData = serialize(addComponent);
                            this.data.assetsMap = Editor.editorModel.createAssetMap(this.data.serializeData);
                        }

                        element.cacheUUid = addComponent.uuid;
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

        public async modifyAssetPropertyValues(assetUrl: string, valueList: any[]): Promise<void> {
            let target = await Editor.editorModel.getAssetByAssetUrl(assetUrl);
            let editInfoList = editor.getEditInfo(target);
            valueList.forEach(async(propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                const newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                Editor.editorModel.setTargetProperty(propName, target, newValue);
                this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY,{target:target,propName:propName,propValue:newValue});
        });
        }

        public undo(): boolean {
            if (super.undo()) {
                const { assetUrl, preValueCopylist } = this.data;
                this.modifyAssetPropertyValues(assetUrl, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValueList,assetUrl } = this.data;
                this.modifyAssetPropertyValues(assetUrl,newValueList);
                return true;
            }

            return false;
        }
    }

    export class CreatePrefabState extends BaseState
    {
        public static toString(): string {
            return "[class common.CreatePrefabState]";
        }

        public static create(data: any = null): CreatePrefabState | null {
            const state = new CreatePrefabState();
            state.data = data;
            return state;
        }

        /**
         * 设置children prefab属性
         * @param gameObj 
         * @param prefab 
         */
        private setGameObjectPrefab(gameObj: paper.GameObject, prefab: egret3d.Prefab, rootObj: paper.GameObject) {
            if (!gameObj) {
                return;
            }
            (gameObj as any).prefab = prefab;
            if (gameObj != rootObj) {
                (gameObj as any).prefabEditInfo = rootObj.uuid;
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setGameObjectPrefab(obj, prefab, rootObj);
            }
        }

        public undo(): boolean {
            if (super.undo()) {
                let deleteUUid:string = this.data.cachePrefabUUid;
                let gameObj = Editor.editorModel.getGameObjectByUUid(deleteUUid);
                Editor.editorModel._deleteGameObject([gameObj]);
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,[this.data.selectIds]);
                return true;

            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const {prefab } = this.data;
                if (prefab) {
                    let instance;
                    if (this.data.serializeData) {
                        instance = deserialize(this.data.serializeData,this.data.assetsMap);
                        this.setGameObjectPrefab(instance, prefab, instance);
                    }else{
                        instance = prefab.createInstance();
                        (instance as any).prefabEditInfo = true;
                        this.setGameObjectPrefab(instance, prefab, instance);
                        this.data.serializeData = serialize(instance);
                        this.data.assetsMap = Editor.editorModel.createAssetMap(this.data.serializeData);
                    }

                    this.data.cachePrefabUUid = instance.uuid;
                }

                //select prefab root
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS,[this.data.cachePrefabUUid]);
                return true;
            }

            return false;
        }
    }
}