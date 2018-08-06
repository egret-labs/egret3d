/// <reference path="./EventDispatcher.ts" />
namespace paper.editor {
    export const context: EventDispatcher = new EventDispatcher();
    export enum selectItemType {
        GAMEOBJECT,
        ASSET
    }
    /**
     * 编辑模型事件
     */
    export class EditorModelEvent extends BaseEvent {
        public static ADD_GAMEOBJECTS = "addGameObject";
        public static DELETE_GAMEOBJECTS = "deleteGameObject";
        public static SELECT_GAMEOBJECTS = "selectGame";
        public static CHANGE_PROPERTY = "changeProperty";
        public static CHANGE_EDIT_MODE = "changeEditMode";
        public static CHANGE_EDIT_TYPE = "changeEditType";
        public static CHANGE_SCENE = "changeScene";
        public static ADD_COMPONENT: string = "addComponent";
        public static REMOVE_COMPONENT: string = "removeComponent";
        public static UPDATE_GAMEOBJECTS_HIREARCHY: string = "updateGameObjectsHierarchy";
        constructor(type: string, data?: any) {
            super(type, data);
        }
    }
    export enum ModifyObjectType {
        GAMEOBJECT,
        BASECOMPONENT
    }
    /**
     * 编辑模型
     */
    export class EditorModel extends EventDispatcher {
        public backRunTime: any;
        public setBackRuntime(back: any): void {
            this.backRunTime = back;
        }
        private history: History;
        /**
         * 初始化
         * @param history 
         */
        public init(history: History): void {
            this.history = history;
        }

        public addState(state: BaseState) {
            state && this.history.add(state);
        }

        public getEditType(propName: string, target: any): editor.EditType | null {
            const editInfoList = editor.getEditInfo(target);
            for (let index = 0; index < editInfoList.length; index++) {
                const element = editInfoList[index];
                if (element.name === propName) {
                    return element.editType;
                }
            }

            const extraInfoList = editor.getExtraInfo(target);
            for (let index = 0; index < extraInfoList.length; index++) {
                const element = extraInfoList[index];
                if (element.name === propName) {
                    return element.editType;
                }
            }

            return null;
        }

        public setTransformProperty(propName: string, propValue: any, target: BaseComponent):void
        {
            let valueEditType:paper.editor.EditType | null = this.getEditType(propName,target);

            if (valueEditType != null) {
                let newPropertyData = {
                    propName,
                    copyValue:this.serializeProperty(propValue,valueEditType),
                    valueEditType
                } 
    
                let prePropertyData = {
                    propName,
                    copyValue:this.serializeProperty(target[propName],valueEditType),
                    valueEditType
                }
    
                this.createModifyComponent(target.gameObject.uuid,target.uuid,[newPropertyData],[prePropertyData]);
            }
        }
        
        public createModifyGameObjectPropertyState(gameObjectUUid:string,newValueList:any[],preValueCopylist:any[]) {
            let state = ModifyGameObjectPropertyState.create(gameObjectUUid,newValueList,preValueCopylist);
            this.addState(state);
        }

        public createModifyComponent(gameObjectUUid:string,componentUUid:string,newValueList:any[],preValueCopylist:any[]): any {
            let state = ModifyComponentPropertyState.create(gameObjectUUid,componentUUid,newValueList,preValueCopylist);
            this.addState(state);
        }

        public createModifyPrefabGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]) {
            let state = ModifyPrefabGameObjectPropertyState.create(gameObjectUUid, newValueList, preValueCopylist);
            this.addState(state);
        }

        public createModifyPrefabComponentPropertyState(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]) {
            let state = ModifyPrefabComponentPropertyState.create(gameObjUUid, componentUUid, newValueList, preValueCopylist);
            this.addState(state);
        }

        public createRemoveComponentFromPrefab(stateData: any) {
            const data = {
                ...stateData
            }

            const state = RemovePrefabComponentState.create(data);
            this.addState(state);
        }

        public createAddComponentToPrefab(sourceData: any, instanceDatas: any[]) {
            const state = AddPrefabComponentState.create(sourceData, instanceDatas);
            this.addState(state);
        }

        public createModifyAssetPropertyState(assetUrl: string, newValueList: any[], preValueCopylist: any[]) {
            const data = {
                assetUrl,
                newValueList,
                preValueCopylist,
            }

            const state = ModifyAssetPropertyState.create(data);
            this.addState(state);
        }

        public createPrefabState(prefab: any) {
            const state = CreatePrefabState.create({ prefab });
            this.addState(state);
        }

        public serializeProperty(value: any, editType: editor.EditType): any {
            switch (editType) {
                case editor.EditType.NUMBER:
                case editor.EditType.TEXT:
                case editor.EditType.CHECKBOX:
                    return value;
                case editor.EditType.VECTOR2:
                case editor.EditType.VECTOR3:
                case editor.EditType.VECTOR4:
                case editor.EditType.QUATERNION:
                case editor.EditType.COLOR:
                case editor.EditType.RECT:
                    const className = egret.getQualifiedClassName(value);
                    const serializeData = serialize(value);
                    return { className, serializeData };
                case editor.EditType.SHADER:
                    return value.url;
                case editor.EditType.LIST:
                    return value;
                case editor.EditType.MATERIAL_ARRAY:
                    const data = value.map((item) => {
                        let url = item.url.substr(RES.config.config.resourceRoot.length, item.url.length);
                        return { name: url, url: url };
                    })
                    return data;
                case editor.EditType.MESH:
                    let url = value.glTFAsset.url;
                    url = url.substr(RES.config.config.resourceRoot.length, url.length);
                    return url;
                case editor.EditType.MATERIAL:
                case editor.EditType.GAMEOBJECT:
                case editor.EditType.TRANSFROM:
                case editor.EditType.SOUND:
                case editor.EditType.ARRAY:
                    //TODO
                    console.error("not supported!")
                    break;
                default:
                    break;
            }
        }

        public async deserializeProperty(serializeData: any, editType: editor.EditType): Promise<any> {
            switch (editType) {
                case editor.EditType.NUMBER:
                case editor.EditType.TEXT:
                case editor.EditType.CHECKBOX:
                    return serializeData;
                case editor.EditType.VECTOR2:
                case editor.EditType.VECTOR3:
                case editor.EditType.VECTOR4:
                case editor.EditType.QUATERNION:
                case editor.EditType.COLOR:
                case editor.EditType.RECT:
                    const clazz = egret.getDefinitionByName(serializeData.className);
                    let target: ISerializable | null = null;
                    if (clazz) {
                        target = new clazz();
                        target.deserialize(serializeData.serializeData.objects[0]);
                    }
                    return target;
                case editor.EditType.SHADER:
                    const url = serializeData;
                    const asset = await RES.getResAsync(url);
                    return asset;
                case editor.EditType.LIST:
                    return serializeData;
                case editor.EditType.MATERIAL_ARRAY:
                    const materials: egret3d.Material[] = [];
                    for (const matrial of serializeData) {
                        const asset = await RES.getResAsync(matrial.url);
                        materials.push(asset);
                    }
                    return materials;
                case editor.EditType.MESH:
                    let meshAsset = await RES.getResAsync(serializeData);
                    let mesh: egret3d.Mesh = new egret3d.Mesh(meshAsset, 0)
                    return mesh;
                case editor.EditType.MATERIAL:
                case editor.EditType.GAMEOBJECT:
                case editor.EditType.TRANSFROM:
                case editor.EditType.SOUND:
                case editor.EditType.ARRAY:
                    //TODO
                    console.error("not supported!")
                    return null;
                default:
                    break;
            }
        }

        public createGameObject(parentList: GameObject[], createType: string) {
            let state = CreateGameObjectState.create(parentList, createType);
            this.addState(state);
        }

        public addComponent(gameObjectUUid: string, compClzName: string) {
            let data = {
                gameObjectUUid: gameObjectUUid,
                compClzName: compClzName
            }
            let state = AddComponentState.create(data);
            this.addState(state);
        }

        /**
        *  TODO:因gameobject未提供通过组件实例添加组件的方法，暂时这样处理
        * @param gameObject 
        * @param component 
        */
        public addComponentToGameObject(gameObject: GameObject, component: BaseComponent) {
            let components = gameObject.components;
            (components as any).push(component);
            component.initialize();
            if (component.isActiveAndEnabled) {
                paper.EventPool.dispatchEvent(paper.EventPool.EventType.Enabled, component);
            }
        }

        public removeComponent(gameObjectUUid: string, componentUUid: string): void {
            let obj: GameObject | null = this.getGameObjectByUUid(gameObjectUUid);
            if (!obj) {
                return;
            }
            let removeComponent: BaseComponent | null = this.getComponentById(obj, componentUUid);
            if (!removeComponent) {
                return;
            }
            let serializeData = serialize(removeComponent);

            let data = {
                gameObjectUUid: gameObjectUUid,
                componentUUid: componentUUid,
                serializeData: serializeData,
            }

            let state = RemoveComponentState.create(data);
            this.addState(state);
        }

        public getComponentById(gameObject: GameObject, componentId: string): BaseComponent | null {
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp = gameObject.components[i];
                if (comp.uuid === componentId) {
                    return comp;
                }
            }
            return null;
        }

        public getComponentByAssetId(gameObject: GameObject, assetId: string): BaseComponent | null {
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp = gameObject.components[i];
                if (comp.assetID === assetId) {
                    return comp;
                }
            }
            return null;;
        }

        public copy(objs: GameObject[]): void {
            let clipboard = __global.runtimeModule.getClipborad();
            let content: any[] = [];
            //过滤
            this.filtTopHierarchyGameObjects(objs);
            //排序
            objs = this.sortGameObjectsForHierarchy(objs);
            for (let i: number = 0; i < objs.length; i++) {
                let obj = objs[i];
                content.push({
                    type: "gameObject",
                    serializeData: serialize(obj)
                })
            }
            clipboard.writeText(JSON.stringify(content), "paper");
        }

        public pasteGameObject(parent: GameObject): void {
            let clipboard = __global.runtimeModule.getClipborad()
            let msg = clipboard.readText("paper");
            let content: { type: string, serializeData: any }[] = JSON.parse(msg);
            if (content && content.length > 0) {
                let objData: any[] = [];
                for (let i: number = 0; i < content.length; i++) {
                    objData.push(content[i].serializeData);
                }
                let state = PasteGameObjectsState.create(objData, parent);
                this.addState(state);
            }
        }
        /**
         * 克隆游戏对象
         * @param gameObjects 
         */
        public duplicateGameObjects(gameObjects: GameObject[]): void {
            let state = DuplicateGameObjectsState.create(gameObjects);
            this.addState(state);
        }
        /**
         * 删除游戏对象
         * @param gameObjects 
         */
        public deleteGameObject(gameObjects: GameObject[]) {
            let deleteState = DeleteGameObjectsState.create(gameObjects);
            let breakList: GameObject[] = [];
            gameObjects.forEach(obj => {
                if (Editor.editorModel.isPrefabChild(obj) && !Editor.editorModel.isPrefabRoot(obj)) {
                    breakList.push(obj);
                }
            });
            if (breakList.length > 0) {
                let breakState = BreakPrefabStructState.create(breakList);
                let stateGroup = StateGroup.create([breakState, deleteState]);
                this.addState(stateGroup);
            }
            else {
                this.addState(deleteState);
            }
        }

        public _deleteGameObject(gameObjects: GameObject[]) {
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                element.destroy();
            }
        }
        /**
         * 解除预置体联系
         * @param gameObjects 
         */
        public breakPrefab(gameObjects:GameObject[]):void{
            let breakList: GameObject[] = [];
            gameObjects.forEach(obj => {
                if (Editor.editorModel.isPrefabChild(obj)||Editor.editorModel.isPrefabRoot(obj)) {
                    breakList.push(obj);
                }
            });
            if (breakList.length > 0) {
                let breakState = BreakPrefabStructState.create(breakList);
                this.addState(breakState);
            }
        }
        /**
         * 更改层级
         * */
        public updateGameObjectsHierarchy(gameObjects: GameObject[], targetGameobjcet: GameObject, dir: 'top' | 'inner' | 'bottom'): void {
            let gameObjectHierarchyState = GameObjectHierarchyState.create(gameObjects, targetGameobjcet, dir);
            let breakList: GameObject[] = [];
            gameObjects.forEach(obj => {
                if (Editor.editorModel.isPrefabChild(obj) &&
                    !Editor.editorModel.isPrefabRoot(obj) &&
                    (obj.transform.parent !== targetGameobjcet.transform.parent || dir === 'inner')) {
                    breakList.push(obj);
                }
            });
            if (breakList.length > 0) {
                let breakPrefabStructState = BreakPrefabStructState.create(breakList);
                let stateGroup = StateGroup.create([breakPrefabStructState, gameObjectHierarchyState]);
                this.addState(stateGroup);
            }
            else {
                this.addState(gameObjectHierarchyState);
            }
        }
        /**
         * 设置对象的层级
         */
        public setGameObjectsHierarchy(objects: GameObject[], targetObject: GameObject, dir: 'top' | 'inner' | 'bottom'): void {
            objects = objects.concat();
            //剔除所有父级
            objects.forEach(obj => { obj.transform.parent = null; });
            objects.reverse();
            if (dir === 'inner') {
                let index = targetObject.transform.children.length;
                for (let i: number = 0; i < objects.length; i++) {
                    let obj = objects[i];
                    obj.transform.parent = targetObject.transform;
                    let transform = (targetObject.transform.children as Array<egret3d.Transform>).pop();
                    (targetObject.transform.children as Array<egret3d.Transform>).splice(index, 0, transform);
                }
            }
            else {
                if (targetObject.transform.parent) {
                    let index;
                    switch (dir) {
                        case 'top': index = targetObject.transform.parent.children.indexOf(targetObject.transform); break;
                        case 'bottom': index = targetObject.transform.parent.children.indexOf(targetObject.transform) + 1; break;
                    }
                    for (let i: number = 0; i < objects.length; i++) {
                        let obj = objects[i];
                        obj.transform.parent = targetObject.transform.parent;
                        let transform = (targetObject.transform.parent.children as Array<egret3d.Transform>).pop();
                        (targetObject.transform.parent.children as Array<egret3d.Transform>).splice(index, 0, transform);
                    }
                }
                else {
                    let all = paper.Application.sceneManager.activeScene.gameObjects as Array<paper.GameObject>;
                    for (let i: number = 0; i < objects.length; i++) {
                        all.splice(all.indexOf(objects[i]), 1);
                    }
                    let index;
                    switch (dir) {
                        case 'top': index = all.indexOf(targetObject); break;
                        case 'bottom': index = all.indexOf(targetObject) + 1; break;
                    }
                    for (let i: number = 0; i < objects.length; i++) {
                        let obj = objects[i];
                        all.splice(index, 0, obj);
                    }
                }
            }
        }
        /**
         * 筛选层级中的顶层游戏对象
         * @param gameObjects 
         */
        public filtTopHierarchyGameObjects(gameObjects: GameObject[]) {
            let findParent: boolean = false;
            let parent: egret3d.Transform | null = null;
            for (let index = gameObjects.length - 1; index >= 0; index--) {
                const element = gameObjects[index];
                findParent = false;
                parent = element.transform.parent;
                while (parent) {
                    for (let i = 0; i < gameObjects.length; i++) {
                        const element = gameObjects[i];
                        if (element.transform === parent) {
                            gameObjects.splice(index, 1);
                            findParent = true;
                            break;
                        }
                    }
                    if (findParent) {
                        break;
                    }
                    parent = parent.parent;
                }
            }
        }

        public getGameObjectByUUid(uuid: string): GameObject | null {
            let paper = this.backRunTime.paper;
            let objects = paper.Application.sceneManager.activeScene.gameObjects;
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i].uuid === uuid) {
                    return objects[i];
                }
            }

            paper = __global['paper'];
            objects = paper.Application.sceneManager.activeScene.gameObjects;
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i].uuid === uuid) {
                    return objects[i];
                }
            }
            return null;
        }

        public async getAssetByAssetUrl(url: string): Promise<any> {
            const RES = this.backRunTime.RES;
            let asset = await RES.getResAsync(url);
            if (asset) {
                return asset;
            }
            return null;
        }

        public getGameObjectsByUUids(uuids: string[]): GameObject[] {
            let objects = Application.sceneManager.activeScene.gameObjects;
            let obj: GameObject;
            let result: GameObject[] = [];
            let idIndex: number;
            let cloneIds: string[] = uuids.concat();
            for (let i: number = 0; i < objects.length; i++) {
                if (cloneIds.length == 0) {
                    return result;
                }
                obj = objects[i];
                idIndex = cloneIds.indexOf(obj.uuid);
                if (idIndex != -1) {
                    result.push(obj);
                    cloneIds.splice(idIndex, 1);
                }
            }
            return result;
        }

        private findOptionSetName(propName: string, target: any): string | null {
            const editInfoList = editor.getEditInfo(target);
            for (let index = 0; index < editInfoList.length; index++) {
                const element = editInfoList[index];
                if (element.name === propName && element.option && element.option.set) {
                    return element.option.set;
                }
            }

            const extraInfoList = editor.getExtraInfo(target);
            for (let index = 0; index < extraInfoList.length; index++) {
                const element = extraInfoList[index];
                if (element.name === propName && element.option && element.option.set) {
                    return element.option.set;
                }
            }

            return null;
        }

        public setTargetProperty(propName: string, target: any, value: any): void {
            let setFunName: string = this.findOptionSetName(propName, target);
            if (setFunName !== null && target[setFunName]) {
                (target[setFunName] as Function).call(target, value);
            } else {
                target[propName] = value;
            }
        }
        /**当前选中的对象 */
        public currentSelected: GameObject[];
        /**
         * 选择游戏对象
         *  */
        public selectGameObject(objs: GameObject[]): void {
            this.currentSelected = objs;
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, objs));
        }
        /**当前编辑模式 */
        public currentEditMode: string;
        /**
         * 切换编辑模式
         */
        public changeEditMode(mode: string) {
            this.currentEditMode = mode;
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_MODE, mode));
        }
        /**
         * 切换编辑类型
         */
        public changeEditType(type: string) {
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_TYPE, type));
        }

        public isPrefabRoot(gameObj: GameObject): boolean {
            if (gameObj.extras.isPrefabRoot === true) {
                return true;
            }
            return false;
        }

        public isPrefabChild(gameObj: GameObject): boolean {
            if (gameObj.extras.isPrefabRoot === false) {
                return true;
            }
            return false;
        }

        /**
        * 从一个预置体文件创建实例
        * @param prefabPath 预置体资源路径
        */
        public async createGameObjectFromPrefab(prefabPath: string, paper: any, RES: any): Promise<paper.GameObject> {
            const prefab = await RES.getResAsync(prefabPath) as Prefab | null;
            if (prefab) {
                const instance = prefab.createInstance();
                instance.extras.isPrefabRoot = true;
                this.setGameObjectPrefab(instance, prefab, instance);
                return instance;
            }
            return null;
        }

        /**
         * 设置children prefab属性
         * @param gameObj 
         * @param prefab 
         */
        public setGameObjectPrefab(gameObj: GameObject, prefab: Prefab, rootObj: GameObject) {
            if (!gameObj) {
                return;
            }
            (gameObj as any).prefab = prefab;
            if (gameObj != rootObj) {
                gameObj.extras.isPrefabRoot = false;
                gameObj.extras.prefabRootId = rootObj.uuid;
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.setGameObjectPrefab(obj, prefab, rootObj);
            }
        }

        /**将对象按照层级进行排序
         */
        public sortGameObjectsForHierarchy(gameobjects: paper.GameObject[]): paper.GameObject[] {
            gameobjects = gameobjects.concat();
            if (gameobjects.length < 2) {
                return gameobjects;
            }
            //生成每个对象的显示索引路径列表
            var displayPathList: { gameObject: paper.GameObject, path: number[] }[] = [];
            gameobjects.forEach(obj => {
                let result: number[] = [];
                let currentObj = obj;
                while (currentObj.transform.parent) {
                    result.unshift(currentObj.transform.parent.children.indexOf(currentObj.transform));
                    currentObj = currentObj.transform.parent.gameObject;
                }
                //追加一个根部索引
                result.unshift(paper.Application.sceneManager.activeScene.gameObjects.indexOf(currentObj));
                displayPathList.push({ gameObject: obj, path: result });
            });
            function getPath(gameObject: paper.GameObject): number[] {
                for (let i: number = 0; i < displayPathList.length; i++) {
                    if (displayPathList[i].gameObject === gameObject) {
                        return displayPathList[i].path;
                    }
                }
            }
            var length: number = gameobjects.length - 1;
            while (length > 0) {
                for (var i: number = 0; i < length; i++) {
                    var A: number[] = getPath(gameobjects[i]);
                    var B: number[] = getPath(gameobjects[i + 1]);

                    var needChangeIndex: boolean = false;
                    var minLength: number = Math.min(A.length, B.length);
                    let k: number = 0;
                    b: for (k; k < minLength; k++) {
                        if (A[k] === B[k]) {
                            continue;
                        }
                        else if (A[k] > B[k]) {
                            needChangeIndex = true;
                            break b;
                        }
                        else if (A[k] < B[k]) {
                            needChangeIndex = false;
                            break b;
                        }
                    }
                    if (k === minLength && !needChangeIndex && A.length > B.length) {
                        needChangeIndex = true;
                    }
                    if (needChangeIndex) {
                        var tmpv: any = gameobjects[i];
                        gameobjects[i] = gameobjects[i + 1];
                        gameobjects[i + 1] = tmpv;
                    }
                }
                length--;
            }
            return gameobjects;
        }

        public createApplyPrefabState(applyGameObjectPropertyList: any[], applyComponentPropertyList: any[]) {
            let group: BaseState[] = [];

            //apply gameobject proerty
            for (const p of applyGameObjectPropertyList) {
                const { gameObjUUid, newValueList, preValueCopylist } = p;
                let state = ModifyPrefabGameObjectPropertyState.create(gameObjUUid, newValueList, preValueCopylist);
                group.push(state);
            }

            //apply component property
            for (const p of applyComponentPropertyList) {
                const { gameObjUUid, componentUUid, newValueList, preValueCopylist } = p;
                let state = ModifyPrefabComponentPropertyState.create(gameObjUUid, componentUUid, newValueList, preValueCopylist);
                group.push(state);
            }

            let applyPrefabState = StateGroup.create(group);
            this.addState(applyPrefabState);
        }

        public createRevertPrefabState(modifyGameObjectPropertyList:any[],modifyComponentPropertyList:any[])
        {
            let group: BaseState[] = [];

            //revert gameobject proerty
            for (const p of modifyGameObjectPropertyList) {
                const { gameObjUUid, newValueList, preValueCopylist } = p;
                let state = ModifyGameObjectPropertyState.create(gameObjUUid, newValueList, preValueCopylist);
                group.push(state);
            }

            //revert component property
            for (const p of modifyComponentPropertyList) {
                const { gameObjUUid, componentUUid, newValueList, preValueCopylist } = p;
                let state = ModifyComponentPropertyState.create(gameObjUUid, componentUUid, newValueList, preValueCopylist);
                group.push(state);
            }

            let revertPrefabState = StateGroup.create(group);
            this.addState(revertPrefabState);
        }

        public compareValue(a:any,b:any):boolean
        {
            if (typeof a != typeof b) {
                throw new Error("diffrent type");
            }
            let valueType = typeof a;
            if (valueType === 'number' || valueType === 'boolean' || valueType === 'string') {
                if (a === b) {
                    return true;
                }
            }
            else {
                if (this.equal(a, b)) {
                    return true;
                }
            }
            return false;
        }

        private equal(a: any, b: any): boolean {
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

        public getRootGameObjectsByPrefab = (prefab: egret3d.Prefab): GameObject[] => {
            let objects = Application.sceneManager.getActiveScene().gameObjects;
            let result: GameObject[] = [];
            objects.forEach(obj => {
                if (obj.prefab && obj.prefab.name === prefab.name && Editor.editorModel.isPrefabRoot(obj)) {
                    result.push(obj);
                }
            })
            return result;
        }


    }
}