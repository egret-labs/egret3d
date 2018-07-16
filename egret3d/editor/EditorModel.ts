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

    export class CmdType {
        /**更改游戏对象基础属性 */
        public static MODIFY_OBJECT_PROPERTY = "MODIFY_OBJECT_PROPERTY";
        /**修改transform属性 */
        public static MODIFY_COMPONENT_PROPERTY = "MODIFY_COMPONENT_PROPERTY";
        /**选中游戏对象 */
        public static SELECT_GAMEOBJECT = "SELECT_GAMEOBJECT";
        /**添加游戏对象 */
        public static ADD_GAMEOBJECT = "ADD_GAMEOBJECT";
        /**移除游戏对象 */
        public static REMOVE_GAMEOBJECTS = "REMOVE_GAMEOBJECTS";
        /**克隆游戏对象 */
        public static DUPLICATE_GAMEOBJECTS = "DUPLICATE_GAMEOBJECTS";
        /**粘贴游戏对象 */
        public static PASTE_GAMEOBJECTS = "PASTE_GAMEOBJECTS";
        /**添加组件 */
        public static ADD_COMPONENT = "ADD_COMPONENT";
        /**移除组件 */
        public static REMOVE_COMPONENT = "REMOVE_COMPONENT";
        /**更改层级 */
        public static UPDATE_GAMEOBJECTS_HIREARCHY = "UPDATE_GAMEOBJECTS_HIREARCHY";

        /**修改预制体游戏对象属性 */
        public static MODIFY_PREFAB_GAMEOBJECT_PROPERTY = "MODIFY_PREFAB_GAMEOBJECT_PROPERTY";
        /**修改预制体组件属性 */
        public static MODIFY_PREFAB_COMPONENT_PROPERTY = "MODIFY_PREFAB_COMPONENT_PROPERTY";
        /**添加组件 */
        public static ADD_PREFAB_COMPONENT = "ADD_PREFAB_COMPONENT";
        /**移除组件 */
        public static REMOVE_PREFAB_COMPONENT = "REMOVE_PREFAB_COMPONENT";

        /**修改asset属性 */
        public static MODIFY_ASSET_PROPERTY = "MODIFY_ASSET_PROPERTY";
        /**创建prefab */
        public static CREATE_PREFAB = "CREATE_PREFAB";
    }

    /**
     * 编辑模型
     */
    export class EditorModel extends EventDispatcher {
        public backRunTime: any;
        public setBackRuntime(back: any): void {
            this.backRunTime = back;
        }

        public addState(state: BaseState) {
            state && History.instance.add(state);
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

        public setProperty(propName: string, propValue: any, target: BaseComponent | GameObject): boolean {
            let editType: editor.EditType = this.getEditType(propName, target);
            if (editType === null) {
                return false;
            }
            if (target instanceof GameObject) {
                this.createModifyGameObjectPropertyState(propName, propValue, target, editType);
            } else if (target instanceof BaseComponent) {
                this.createModifyComponent(propName, propValue, target, editType);
            }
            return true;
        }

        public createModifyGameObjectPropertyState(propName: string, propValue: any, target: GameObject, editType: editor.EditType, add: boolean = true) {
            let preValue = this.serializeProperty(target[propName], editType);
            let newValue = this.serializeProperty(propValue, editType);
            let uuid = target.uuid;
            let data = {
                cmdType: CmdType.MODIFY_OBJECT_PROPERTY,
                propName,
                newValue,
                preValue,
                uuid,
                editType
            }

            let state = ModifyGameObjectPropertyState.create(data);
            add && this.addState(state);
            return state;
        }

        public createModifyComponent(propName: string, propValue: any, target: BaseComponent, editType: editor.EditType, add: boolean = true): any {
            let preValue = this.serializeProperty(target[propName], editType);
            let newValue = this.serializeProperty(propValue, editType);
            let componentUUid = target.uuid;
            let gameObjectUUid = target.gameObject.uuid;
            let data = {
                cmdType: CmdType.MODIFY_COMPONENT_PROPERTY,
                propName,
                newValue,
                preValue,
                editType,
                componentUUid,
                gameObjectUUid,
            }
            let state = ModifyComponentPropertyState.create(target, propName, propValue, data);
            add && this.addState(state);
            return state;
        }

        public createModifyPrefabGameObjectPropertyState(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]) {
            let data = {
                cmdType: CmdType.MODIFY_PREFAB_GAMEOBJECT_PROPERTY,
                gameObjectUUid,
                newValueList,
                preValueCopylist,
            }

            let state = ModifyPrefabGameObjectPropertyState.create(data);
            this.addState(state);
        }

        public createModifyPrefabComponentPropertyState(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]) {
            let data = {
                cmdType: CmdType.MODIFY_PREFAB_COMPONENT_PROPERTY,
                gameObjUUid,
                componentUUid,
                newValueList,
                preValueCopylist,
            }

            let state = ModifyPrefabComponentPropertyState.create(data);
            this.addState(state);
        }

        public createRemoveComponentFromPrefab(stateData: any) {
            const data = {
                cmdType: CmdType.REMOVE_PREFAB_COMPONENT,
                ...stateData
            }

            const state = RemovePrefabComponentState.create(data);
            this.addState(state);
        }

        public createAddComponentToPrefab(stateData: any) {
            const data = {
                cmdType: CmdType.ADD_PREFAB_COMPONENT,
                ...stateData
            }

            const state = AddPrefabComponentState.create(data);
            this.addState(state);
        }

        public createModifyAssetPropertyState(assetUrl: string, newValueList: any[], preValueCopylist: any[]) {
            const data = {
                cmdType: CmdType.MODIFY_ASSET_PROPERTY,
                assetUrl,
                newValueList,
                preValueCopylist,
            }

            const state = ModifyAssetPropertyState.create(data);
            this.addState(state);
        }

        public createPrefabState(prefab: any, selectIds: string[]) {
            const data = {
                cmdType: CmdType.CREATE_PREFAB,
                prefab,
                selectIds
            }

            const state = CreatePrefabState.create(data);
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

        public createGameObject(parentUUids: string[]) {
            let datas = [];

            for (let index = 0; index < parentUUids.length; index++) {
                const parentUUid = parentUUids[index];
                datas.push({ parentUUid });
            }

            let data = {
                cmdType: CmdType.ADD_GAMEOBJECT,
                datas,
            };
            let state = AddGameObjectState.create(data);
            this.addState(state);
        }

        public addComponent(gameObjectUUid: string, compClzName: string) {
            let data = {
                cmdType: CmdType.ADD_COMPONENT,
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
            let assetsMap = {};
            if (serializeData["assets"]) {
                (<ISerializedObject[]>serializeData["assets"]).forEach(item => {
                    assetsMap[item.uuid] = Asset.find(item["url"]);
                });
            }

            let data = {
                cmdType: CmdType.REMOVE_COMPONENT,
                gameObjectUUid: gameObjectUUid,
                componentUUid: componentUUid,
                serializeData: serializeData,
                assetsMap: assetsMap
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
                if (comp.assetUUid === assetId) {
                    return comp;
                }
            }
            return null;;
        }

        public pasteGameObject(target: egret3d.Transform = null): void {
            let clipboard = __global.runtimeModule.getClipborad()
            let msg = clipboard.readText("paper");
            let content: any[] = JSON.parse(msg);
            let gameObjects: GameObject[] = [];
            let ids: string[] = content.map((obj, index) => (obj.uuid));
            gameObjects = this.getGameObjectsByUUids(ids);
            this.unique(gameObjects);
            let datas = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let data = {};
                let gameObj: GameObject = element;
                data["parentUUid"] = gameObj.uuid;
                datas.push(data);
            }

            let prefabData = this.getPrefabDataForDuplicate(gameObjects);

            let data = {
                cmdType: CmdType.PASTE_GAMEOBJECTS,
                datas: datas,
                target: target,
                prefabData,
                selectIds: ids
            }
            let state = PasteGameObjectsState.create(data);
            this.addState(state);
        }

        public duplicateGameObjects(gameObjects: GameObject[]): void {
            const selectIds = gameObjects.map((gameObj) => { return gameObj.uuid });
            this.unique(gameObjects);
            let datas = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let one = {};
                one["duplicateUUid"] = element.uuid;
                datas.push(one);
            }

            let prefabData = this.getPrefabDataForDuplicate(gameObjects);
            let data = {
                cmdType: CmdType.DUPLICATE_GAMEOBJECTS,
                datas: datas,
                prefabData,
                selectIds,
            }

            let state = DuplicateGameObjectsState.create(data);
            this.addState(state);
        }

        private getPrefabDataForDuplicate(gameObjects: GameObject[]): any {
            let prefabData = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let uniqueIndex = 0;
                let prefabstru: any = {};
                let allRootObjsUUid: string[] = [];
                this.getPrefabRootObjsUUidFromGameObject(element, allRootObjsUUid);
                this.getPrefabDataFromGameObject(element, uniqueIndex, prefabstru, allRootObjsUUid);
                prefabData.push(prefabstru);
            }
            return prefabData;
        }

        /**
         * 设置克隆对象的prefab信息
         * @param gameObj 
         * @param prefabData 
         * @param uniqueIndex 
         */
        public duplicatePrefabDataToGameObject(gameObj: GameObject, prefabData: any, uniqueIndex: number): void {
            if (!gameObj)
                return;

            if (prefabData[uniqueIndex]) {
                const { url, isPrefabRoot } = prefabData[uniqueIndex];
                const prefab = Asset.find(url);
                (gameObj as any).prefab = prefab;
                if (isPrefabRoot) {
                    (gameObj as any).prefabEditInfo = true;
                } else {
                    const rootObj: GameObject | null = this.getPrefabRootObjByChild(gameObj);
                    if (rootObj !== null) {
                        (gameObj as any).prefabEditInfo = rootObj.uuid;
                    }
                }
            } else {
                (gameObj as any).prefab = null;
                (gameObj as any).prefabEditInfo = null;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                uniqueIndex++;
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.duplicatePrefabDataToGameObject(obj, prefabData, uniqueIndex);
            }
        }

        /**
         * 收集prefab信息，用于duplicate或者paste后设置新对象的prefab信息
         * @param gameObject 
         * @param index 
         * @param prefabData 
         */
        public getPrefabDataFromGameObject(gameObj: GameObject, uniqueIndex: number, prefabData: any, allRootObjsUUid: string[]): void {
            if (!gameObj)
                return;

            if ((Editor.editorModel.isPrefabRoot(gameObj) && allRootObjsUUid.indexOf(gameObj.uuid) >= 0)
                || (Editor.editorModel.isPrefabChild(gameObj) && allRootObjsUUid.indexOf((gameObj as any).prefabEditInfo) >= 0)) {
                let isPrefabRoot = Editor.editorModel.isPrefabRoot(gameObj);
                let url = gameObj.prefab.url;
                prefabData[uniqueIndex] = { gameObj, isPrefabRoot, url };
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                uniqueIndex++;
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getPrefabDataFromGameObject(obj, uniqueIndex, prefabData, allRootObjsUUid);
            }
        }

        /**
         * 获取某个游戏对象下所有预制体实例的根对象uuid,用于确定duplicate时选中的对象是否属于一个完整的预制体
         * @param gameObj 
         * @param rootObjs 
         */
        private getPrefabRootObjsUUidFromGameObject(gameObj: GameObject, rootObjsUUids: string[]): void {
            if (!gameObj) {
                return;
            }
            if (Editor.editorModel.isPrefabRoot(gameObj)) {
                rootObjsUUids.push(gameObj.uuid);
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getPrefabRootObjsUUidFromGameObject(obj, rootObjsUUids);
            }
        }

        private getPrefabRootObjByChild(gameObj: GameObject): GameObject | null {
            let parent = gameObj.transform.parent;
            let findObj: GameObject;
            while (parent) {
                findObj = parent.gameObject;
                if (Editor.editorModel.isPrefabRoot(findObj)) {
                    return findObj;
                }
                parent = parent.parent;
            }

            return null;
        }

        public deleteGameObject(gameObjects: GameObject[], prefabRootMap?: any) {
            const selectIds = gameObjects.map((gameObj) => { return gameObj.uuid });
            this.unique(gameObjects);
            let datas = [];
            let indexData: { uuid: string, preIndex: number }[] = [];

            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let one = {};
                let gameObj: GameObject = element;
                let serializeData = serialize(gameObj);

                one["deleteuuid"] = gameObj.uuid;

                if (gameObj.transform.parent) {
                    one["parentUUid"] = gameObj.transform.parent.gameObject.uuid;
                    one["preIndex"] = gameObj.transform.parent.children.indexOf(gameObj.transform);
                    this.getAllRootIndexsFromGameObject(gameObj, indexData);
                } else {
                    this.getAllRootIndexsFromGameObject(gameObj, indexData);
                }

                one["serializeData"] = serializeData;
                let assetsMap = {};
                if (serializeData["assets"]) { // 认为此时所有资源已经正确加载
                    (<ISerializedObject[]>serializeData["assets"]).forEach(item => {
                        assetsMap[item.uuid] = Asset.find(item["url"]); // 获取资源引用
                    });
                }
                one["assetsMap"] = assetsMap;
                datas.push(one);
            }

            indexData.sort((a, b) => { return a.preIndex - b.preIndex; });

            let prefabData = {};
            for (let key in prefabRootMap) {
                let rootObj: GameObject | null = this.getGameObjectByUUid(prefabRootMap[key]);
                if (rootObj) {
                    let url: string = rootObj.prefab.url;
                    let rootId: number = prefabRootMap[key];
                    let prefabIds: string[] = [];
                    this.getAllIdsFromPrefabInstance(rootObj, prefabIds, rootObj);
                    prefabData[key] = { url, rootId, prefabIds };
                }
            }


            let data = {
                cmdType: CmdType.REMOVE_GAMEOBJECTS,
                datas: datas,
                prefabData,
                selectIds,
                indexData
            }

            let state = DeleteGameObjectsState.create(data);
            this.addState(state);
        }

        public _deleteGameObject(gameObjects: GameObject[]) {
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                element.destroy();
            }
        }
        /**更改层级 */
        public updateGameObjectsHierarchy(gameObjectUUids: string[], targetUUid: string,dir:'top'|'inner'|'bottom'): void {
            let objs = this.getGameObjectsByUUids(gameObjectUUids);
            //必须进行层级排序
            objs=this.sortGameObjectsForHierarchy(objs);
            //整理对象信息
            let objInfos:{ UUID: string, oldParentUUID: string, oldIndex: number }[] = [];
            for(let i:number=0;i<objs.length;i++){
                let obj=objs[i];
                let oldParentUUID:string;
                let oldIndex:number;
                if(obj.transform.parent){
                    oldParentUUID=obj.transform.parent.gameObject.uuid;
                    oldIndex=obj.transform.parent.children.indexOf(obj.transform);
                }
                else{
                    oldParentUUID=undefined;
                    oldIndex=paper.Application.sceneManager.activeScene.gameObjects.indexOf(obj);

                }
                objInfos.push({UUID:obj.uuid,oldParentUUID:oldParentUUID,oldIndex:oldIndex});
            }
            let prefabRootMap={};
            //整理预置体信息
            let prefabData = {};
            for (let key in prefabRootMap) {
                let rootObj: GameObject | null = this.getGameObjectByUUid(prefabRootMap[key]);
                if (rootObj) {
                    let url: string = rootObj.prefab.url;
                    let rootId: number = prefabRootMap[key];
                    let prefabIds: string[] = [];
                    this.getAllIdsFromPrefabInstance(rootObj, prefabIds, rootObj);
                    prefabData[key] = { url, rootId, prefabIds };
                }
            }
            let state=GameObjectHierarchyState.create({cmdType: CmdType.UPDATE_GAMEOBJECTS_HIREARCHY});
            state.gameObjects=objInfos;
            state.targetDir=dir;
            state.targetObject=targetUUid;
            state.prefabData=prefabData;
            this.addState(state);
        }

        /**
         * 清除预制体里游戏对象的prefab引用,root或者持有此root引用的游戏对象
         * @param rootId 预制体的根id
         */
        public clearRootPrefabInstance(gameObj: GameObject, rootObj: GameObject): void {
            if (!gameObj) {
                return;
            }

            if (gameObj == rootObj || (this.isPrefabChild(gameObj))) {
                (gameObj as any).prefabEditInfo = null;
                (gameObj as any).prefab = null;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.clearRootPrefabInstance(obj, rootObj);
            }
        }

        /**
         * 还原prefab
         * @param rootObj 
         * @param prefab 
         */
        public resetPrefabbyRootId(rootObj: GameObject, prefab: any, prefabIds: string[]): void {
            for (let index = 0; index < prefabIds.length; index++) {
                const element = prefabIds[index];
                if (element === rootObj.uuid) {
                    (rootObj as any).prefabEditInfo = true;
                    (rootObj as any).prefab = prefab;
                } else {
                    let gameObj: GameObject | null = this.getGameObjectByUUid(element);
                    if (gameObj) {
                        (gameObj as any).prefabEditInfo = rootObj.uuid;
                        (gameObj as any).prefab = prefab;
                    }
                }
            }
        }

        /**
         * 获取预制体实例包含的所有游戏对象id
         * @param rootObj 
         * @param ids 
         */
        public getAllIdsFromPrefabInstance(gameObj: GameObject, ids: string[], rootObj: GameObject) {
            if (!gameObj) {
                return;
            }
            if (gameObj == rootObj || (this.isPrefabChild(gameObj) && (gameObj as any).prefabEditInfo == rootObj.uuid)) {
                ids.push(gameObj.uuid);
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getAllIdsFromPrefabInstance(obj, ids, rootObj);
            }
        }


        /**
         * 去重
         * @param gameObjects 
         */
        public unique(gameObjects: GameObject[]) {
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

        /**
         * 
         * @param uuids unique id
         */
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

        public getAllRootIndexsFromGameObject(gameObject: GameObject, indexData: { uuid: string, preIndex: number }[]) {
            let objs: ReadonlyArray<GameObject> = paper.Application.sceneManager.getActiveScene().gameObjects;
            indexData.push({ preIndex: objs.indexOf(gameObject), uuid: gameObject.uuid });
            for (let index = 0; index < gameObject.transform.children.length; index++) {
                const element = gameObject.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getAllRootIndexsFromGameObject(obj, indexData);
            }
        }

        public getAllComponentUUidFromGameObject(gameObject: GameObject, uuids: string[]) {
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp: BaseComponent = gameObject.components[i];
                uuids.push(comp.uuid);
            }
            for (let index = 0; index < gameObject.transform.children.length; index++) {
                const element = gameObject.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getAllComponentUUidFromGameObject(obj, uuids);
            }
        }

        /**
         * call after duplicate/create/paste
         * @param instance 
         */
        public generateGameobjectUUids(instance: paper.GameObject): void {
            (instance as any).uuid = generateUuid();
            instance.components.forEach((component) => {
                (component as any).uuid = generateUuid();
            })

            for (let index = 0; index < instance.transform.children.length; index++) {
                const element = instance.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.generateGameobjectUUids(obj);
            }
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
        /**选择游戏对象 */
        public selectGameObject(objs: GameObject[]):void {
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, objs));
        }

        // 切换场景，参数是场景编号
        public switchScene(url: string) {
            Application.sceneManager.unloadAllScene();
            Application.callLater(() => {
                this.loadEditScene(url).then(() => {
                    this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_SCENE, url));
                });
            });
        }

        public resetHistory(data: string): void {
            let history = History.instance.deserialize(JSON.parse(data));
        }

        private _editCamera: GameObject;
        public geoController: GeoController;
        private async loadEditScene(url: string) {
            //由于新引擎场景加载方式存在问题，这里预先载入一下场景资源
            await RES.getResAsync(url);
            Application.sceneManager.loadScene(url);
            let camera = GameObject.findWithTag("EditorCamera");
            if (camera) {
                this._editCamera = camera;
            } else {
                this._editCamera = this.createEditCamera();
            }
            this.geoController = new GeoController(this);
            // 开启几何画板
            Gizmo.Enabled(this._editCamera);
            let script = this._editCamera.addComponent(EditorCameraScript);
            script.editorModel = this;
            script.moveSpeed = 10;
            script.rotateSpeed = 0.5;
            let pickScript = this._editCamera.addComponent(PickGameObjectScript);
            pickScript.editorModel = this;
            this.geoController.cameraScript = script;
        }

        private createEditCamera(): GameObject {
            let cameraObject = new GameObject();
            cameraObject.name = "EditorCamera";
            cameraObject.tag = "EditorCamera";

            let camera = cameraObject.addComponent(egret3d.Camera);
            camera.near = 0.1;
            camera.far = 100;
            camera.backgroundColor = new egret3d.Color(0.13, 0.28, 0.51, 1);
            cameraObject.transform.setLocalPosition(0, 10, -10);
            cameraObject.transform.lookAt(new egret3d.Vector3(0, 0, 0));
            return cameraObject;
        }
        /**
         * 切换编辑模式
         */
        public changeEditMode(mode: string) {
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_MODE, mode));
        }
        /**
         * 切换编辑类型
         */
        public changeEditType(type: string) {
            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_TYPE, type));
        }
        /**
         * 序列化场景
         */
        public serializeActiveScene(): string {
            let scene = Application.sceneManager.activeScene;

            if (this._editCamera) {
                scene._removeGameObject(this._editCamera);
            }
            let len = this.geoController.controllerPool.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene._removeGameObject(this.geoController.controllerPool[i]);
                }
            }
            let data = serialize(scene);
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene._addGameObject(this.geoController.controllerPool[i]);
                }
            }
            if (this._editCamera) {
                scene._addGameObject(this._editCamera);
            }
            let jsonData = JSON.stringify(data);
            return jsonData;
        }

        public createAssetMap(serializeData: ISerializedData): any {
            let assetsMap = {};
            if (serializeData["assets"]) {
                (<ISerializedObject[]>serializeData["assets"]).forEach(item => {
                    assetsMap[item.uuid] = Asset.find(item["url"]);
                });
            }
            return assetsMap;
        }

        public isPrefabRoot(gameObj: GameObject): boolean {
            let prefabInfo = (gameObj as any).prefabEditInfo;
            if (typeof (prefabInfo) == "boolean" && prefabInfo === true) {
                return true;
            }
            return false;
        }

        public isPrefabChild(gameObj: GameObject): boolean {
            let prefabInfo = (gameObj as any).prefabEditInfo;
            if (typeof (prefabInfo) == "string") {
                return true;
            }
            return false;
        }

        public serializeHistory(): string {
            const historyData = History.instance.serialize();
            return JSON.stringify(historyData);
        }

        public undo = () => {
            History.instance.back();
        }

        public redo = () => {
            History.instance.forward();
        }
        /**
        * 从一个预置体文件创建实例
        * @param prefabPath 预置体资源路径
        */
        public async createGameObjectFromPrefab(prefabPath: string, paper: any, RES: any): Promise<paper.GameObject> {
            const prefab = await RES.getResAsync(prefabPath) as egret3d.Prefab | null;
            if (prefab) {
                const instance = prefab.createInstance();
                (instance as any).prefabEditInfo = true;
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
        private setGameObjectPrefab(gameObj: GameObject, prefab: egret3d.Prefab, rootObj: GameObject) {
            if (!gameObj) {
                return;
            }
            (gameObj as any).prefab = prefab;
            if (gameObj != rootObj) {
                (gameObj as any).prefabEditInfo = rootObj.uuid;
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.setGameObjectPrefab(obj, prefab, rootObj);
            }
        }
        /**将对象按照层级进行排序
         * （请确保要排序的游戏对象都在场景中）
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
        /**
         * 设置对象的层级
         * （请确游戏对象都在场景中）
         */
        public setGameObjectsHierarchy(objects: GameObject[], targetObject: GameObject, dir: 'top' | 'inner' | 'bottom'): void {
            objects = objects.concat();
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
                        obj.transform.parent = null;
                        all.splice(index, 0, obj);
                    }
                }
            }
        }
    }
}