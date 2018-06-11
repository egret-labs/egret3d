/// <reference path="./EventDispatcher.ts" />
namespace paper.editor {
    export const context: EventDispatcher = new EventDispatcher();
    export enum selectItemType{
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
        public static UPDATE_PARENT: string = "updateParent";
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
        /**更改parent */
        public static UPDATE_PARENT = "UPDATE_PARENT";
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
    }

    /**
     * 编辑模型
     */
    export class EditorModel extends EventDispatcher {
        /**
         * 初始化
         */
        public async init() {
            await RES.loadConfig("resource/default.res.json", "resource/");
            this.initHistory();
        }

        public paperHistory:History;

        initHistory() {
            this.paperHistory = new History();
        }

        public addState(state:BaseState) {
            state && this.paperHistory && this.paperHistory.add(state);
        }

        public setProperty(propName: string, propValue: any, target: BaseComponent | GameObject): boolean {
            let editType: editor.EditType = this.getEditType(propName, target);
            if (!editType) {
                console.error('editType not found!');
            }
            if (target instanceof GameObject) {
                this.createModifyGameObjectPropertyState(propName, propValue, target, editType);
            } else if (target instanceof BaseComponent) {
                this.createModifyComponent(propName, propValue, target, editType);
            }
            return true;
        }

        public getEditType(propName: string, target: any):editor.EditType | null {
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

            console.error("EditorModel getEditType error.")

            return null;
        }

        public createModifyGameObjectPropertyState(propName: string, propValue: any, target: GameObject, editType: editor.EditType, add: boolean = true) {
            let preValue = this.serializeProperty(target[propName], editType);
            let hashCode = target.hashCode;
            let data = {
                cmdType: CmdType.MODIFY_OBJECT_PROPERTY,
                propName,
                propValue,
                preValue,
                hashCode,
                editType
            }

            let state = ModifyGameObjectPropertyState.create(data);
            add && this.addState(state);
            return state;
        }

        public createModifyComponent(propName: string, propValue: any, target: BaseComponent, editType: editor.EditType, add: boolean = true): any {
            let preValue = this.serializeProperty(target[propName], editType);
            let hashCode = target.hashCode;
            let gameObjHashCode = target.gameObject.hashCode;
            let data = {
                cmdType: CmdType.MODIFY_COMPONENT_PROPERTY,
                propName,
                propValue,
                preValue,
                editType,
                hashCode,
                gameObjHashCode,
            }
            let state = ModifyComponentPropertyState.create(target, propName, propValue, data);
            add && this.addState(state);
            return state;
        }

        public createModifyPrefabGameObjectPropertyState(gameObjectId: number, newValueList: any[], preValueCopylist: any[], backRuntime: any) {
            let data = {
                cmdType: CmdType.MODIFY_PREFAB_GAMEOBJECT_PROPERTY,
                gameObjectId,
                newValueList,
                preValueCopylist,
                backRuntime
            }

            let state = ModifyPrefabGameObjectPropertyState.create(data);
           this.addState(state);
        }

        public createModifyPrefabComponentPropertyState(gameObjectId: number, componentId: number, newValueList: any[], preValueCopylist: any[], backRuntime: any) {
            let data = {
                cmdType: CmdType.MODIFY_PREFAB_COMPONENT_PROPERTY,
                gameObjectId,
                componentId,
                newValueList,
                preValueCopylist,
                backRuntime
            }

            let state = ModifyPrefabComponentPropertyState.create(data);
            this.addState(state);
        }

        public createRemoveComponentFromPrefab(stateData:any){
            const data = {
                cmdType: CmdType.REMOVE_PREFAB_COMPONENT,
                ...stateData
            }

            const state = RemovePrefabComponentState.create(data);
            this.addState(state);
        }

        public createAddComponentToPrefab(stateData:any){
            const data = {
                cmdType: CmdType.ADD_PREFAB_COMPONENT,
                ...stateData
            }

            const state = AddPrefabComponentState.create(data);
            this.addState(state);
        }

        public createModifyAssetPropertyState(target:Asset,newValueList: any[], preValueCopylist: any[])
        {
            const data = {
                cmdType:CmdType.MODIFY_ASSET_PROPERTY,
                target,
                newValueList,
                preValueCopylist
            }

            const state = ModifyAssetPropertyState.create(data);
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
                case editor.EditType.LIST:
                case editor.EditType.MATERIAL:
                case editor.EditType.MATERIAL_ARRAY:
                case editor.EditType.GAMEOBJECT:
                case editor.EditType.TRANSFROM:
                case editor.EditType.SOUND:
                case editor.EditType.MESH:
                case editor.EditType.ARRAY:
                    //TODO
                    console.error("not supported!")
                    break;
                default:
                    break;
            }
        }

        public deserializeProperty(serializeData: any, editType: editor.EditType): any {
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
                case editor.EditType.LIST:
                case editor.EditType.MATERIAL:
                case editor.EditType.MATERIAL_ARRAY:
                case editor.EditType.GAMEOBJECT:
                case editor.EditType.TRANSFROM:
                case editor.EditType.SOUND:
                case editor.EditType.MESH:
                case editor.EditType.ARRAY:
                    //TODO
                    console.error("not supported!")
                    break;
                default:
                    break;
            }
        }

        /**
         * 创建游戏对象
         */
        public createGameObject(list:number[]) {
            let datas = [];

            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                const parentHashCode = element ? element : null;
                datas.push({parentHashCode});
            }

            let data = {
                cmdType: CmdType.ADD_GAMEOBJECT,
                datas,
            };
            let state = AddGameObjectState.create(data);
            this.addState(state);
        }

        /**
         * 添加组件
         */
        public addComponent(gameObjectId: number, compClzName: string) {
            let data = {
                cmdType: CmdType.ADD_COMPONENT,
                gameObjectId: gameObjectId,
                compClzName: compClzName
            }
            let state = AddComponentState.create(data);
            this.addState(state);
        }

        /**
        *  TODO:因gameobject未提供添加组件实例方法，暂时这样处理
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

        /**
         * 移除组件
         * @param gameObjectId 
         * @param componentId 
         */
        public removeComponent(gameObjectId: number, componentId: number) {
            let obj = this.getGameObjectById(gameObjectId);
            let removeComponent: BaseComponent = this.getComponentById(obj, componentId);
            if (!removeComponent) {
                return;
            }
            let serializeData = serialize(removeComponent);
            let assetsMap = {};
            if (serializeData["assets"]) { // 认为此时所有资源已经正确加载
                (<ISerializedObject[]>serializeData["assets"]).forEach(item => {
                    assetsMap[item.hashCode] = Asset.find(item["url"]); // 获取资源引用
                });
            }

            let data = {
                cmdType: CmdType.REMOVE_COMPONENT,
                gameObjectId: gameObjectId,
                componentId: componentId,
                serializeData: serializeData,
                hashcode: removeComponent.hashCode,
                assetsMap: assetsMap
            }

            let state = RemoveComponentState.create(data);
            this.addState(state);
        }

        public getComponentById(gameObject: GameObject, componentId: number) {
            let component: BaseComponent;
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp = gameObject.components[i];
                if (comp.hashCode === componentId) {
                    component = comp;
                    break;
                }
            }
            return component;
        }

        /**
         * 粘贴游戏对象
         * @param target 
         */
        public pasteGameObject(target: egret3d.Transform = null) {
            let clipboard = __global.runtimeModule.getClipborad()
            let msg = clipboard.readText("paper");
            let content: any[] = JSON.parse(msg);
            let gameObjects: GameObject[] = [];
            let ids = content.map((obj, index) => (obj.id));
            gameObjects = this.getGameObjectsByIds(ids);
            this.unique(gameObjects);
            let datas = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let data = {};
                let gameObj: GameObject = element;
                data["pasteHashCode"] = gameObj.hashCode;
                datas.push(data);
            }

            let prefabData = this.getPrefabDataForDuplicate(gameObjects);

            let data = {
                cmdType: CmdType.PASTE_GAMEOBJECTS,
                datas: datas,
                target: target,
                prefabData,
                selectIds:ids
            }
            let state = PasteGameObjectsState.create(data);
            this.addState(state);
        }

        /**
         * 克隆游戏对象
         * @param gameObjects 
         */
        public duplicateGameObjects(gameObjects: GameObject[]) {
            const selectIds = gameObjects.map((gameObj) => {return gameObj.hashCode});
            this.unique(gameObjects);
            let datas = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let one = {};
                one["duplicateHashCode"] = element.hashCode;
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

        /**
         * 
         * @param gameObjects 去重之后的游戏对象
         */
        private getPrefabDataForDuplicate(gameObjects: GameObject[]): any {
            let prefabData = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let uniqueIndex = 0;
                let prefabstru: any = {};
                let allRootObjs: GameObject[] = [];
                this.getPrefabRootObjsFromGameObject(element, allRootObjs);
                this.getPrefabDataFromGameObject(element, uniqueIndex, prefabstru, allRootObjs);
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
        public duplicatePrefabDataToGameObject(gameObj: GameObject, prefabData: any, uniqueIndex: number) {
            if (!gameObj)
                return;

            if (prefabData[uniqueIndex]) {
                const { url, isPrefabRoot } = prefabData[uniqueIndex];
                const prefab = Asset.find(url);
                if (isPrefabRoot) {
                    (gameObj as any).___isRootPrefab____ = true;
                }
                (gameObj as any).prefab = prefab;
                (gameObj as any).___prefabRoot____ = this.getPrefabRootObjByChild(gameObj);
            }else{
                (gameObj as any).prefab = null;
                (gameObj as any).___prefabRoot____ = false;
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
        public getPrefabDataFromGameObject(gameObj: GameObject, uniqueIndex: number, prefabData: any, allRootObjs: GameObject[]) {
            if (!gameObj)
                return;

            if (((gameObj as any).___isRootPrefab____ && allRootObjs.indexOf(gameObj) >= 0)
                || ((gameObj as any).___prefabRoot____ && allRootObjs.indexOf((gameObj as any).___prefabRoot____) >= 0)) {
                let isPrefabRoot = (gameObj as any).___isRootPrefab____ ? true : false;
                let url = gameObj.prefab.url;
                prefabData[uniqueIndex] = { gameObj, isPrefabRoot, url };
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                uniqueIndex++;
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getPrefabDataFromGameObject(obj, uniqueIndex, prefabData, allRootObjs);
            }
        }

        /**
         * 获取某个游戏对象下所有预制体实例的根对象,用于确定duplicate时选中的对象是否属于一个完整的预制体
         * @param gameObj 
         * @param rootObjs 
         */
        private getPrefabRootObjsFromGameObject(gameObj: GameObject, rootObjs: GameObject[]) {
            if (!gameObj) {
                return;
            }
            if ((gameObj as any).___isRootPrefab____) {
                rootObjs.push(gameObj);
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getPrefabRootObjsFromGameObject(obj, rootObjs);
            }
        }

        /**
         * 查找root游戏对象
         * @param gameObj 
         */
        public getPrefabRootObjByChild(gameObj: GameObject) {
            let parent = gameObj.transform.parent;
            let findObj: GameObject;
            while (parent) {
                findObj = parent.gameObject;
                if ((findObj as any).___isRootPrefab____) {
                    console.log("findobj:", findObj);
                    return findObj;
                }
                parent = parent.parent;
            }
        }

        /**
         * 删除游戏对象
         * @param gameObjects 
         */
        public deleteGameObject(gameObjects: GameObject[],prefabRootMap?: any) {
            const selectIds = gameObjects.map((gameObj) => {return gameObj.hashCode});
            this.unique(gameObjects);
            let datas = [];
            for (let index = 0; index < gameObjects.length; index++) {
                const element = gameObjects[index];
                let one = {};
                let gameObj: GameObject = element;
                let serializeData = serialize(gameObj);

                //保存gameobject的hashcode
                let gameObjectHashcodes = [];
                this.getAllHashCodeFromGameObject(element, gameObjectHashcodes);
                one["deleteHashcode"] = gameObjectHashcodes;

                //保存gameobject组件的hashcode
                let gameObjectComponentsHashCode = [];
                this.getAllComponentIdFromGameObject(element, gameObjectComponentsHashCode);
                one["deleteComponentcode"] = gameObjectComponentsHashCode;

                if (gameObj.transform.parent) {
                    one["parentHashcode"] = gameObj.transform.parent.gameObject.hashCode;
                }
                one["serializeData"] = serializeData;
                let assetsMap = {};
                if (serializeData["assets"]) { // 认为此时所有资源已经正确加载
                    (<ISerializedObject[]>serializeData["assets"]).forEach(item => {
                        assetsMap[item.hashCode] = Asset.find(item["url"]); // 获取资源引用
                    });
                }
                one["assetsMap"] = assetsMap;
                datas.push(one);
            }

            let prefabData = {};
            for (let key in prefabRootMap) {
                let rootObj: GameObject = this.getGameObjectById(prefabRootMap[key]);
                let url: string = rootObj.prefab.url;
                let rootId: number = prefabRootMap[key];
                let prefabIds: number[] = [];
                this.getAllIdsFromPrefabInstance(rootObj, prefabIds, rootObj);
                prefabData[key] = { url, rootId, prefabIds };
            }


            let data = {
                cmdType: CmdType.REMOVE_GAMEOBJECTS,
                datas: datas,
                prefabData,
                selectIds,
            }

            let state = DeleteGameObjectsState.create(data);
            this.addState(state);
        }

        public _deleteGameObject(gameObjects: GameObject[]) {
            for (let i = 0, l = gameObjects.length; i < l; i++) {
                //////-----引擎API问题，这里暂时手动解决transform引用关系
                let gameObject = gameObjects[i];
                let t = gameObject.transform;
                if (t.parent) {
                    let index = t.parent.children.indexOf(t);
                    t.parent.children.splice(index, 1);
                }
                gameObject.destroy();
            }
        }

        public updateParent(gameObjectIds: number[], targetId: number, prefabRootMap?: any): void {
            let objs = this.getGameObjectsByIds(gameObjectIds);
            let originParentIds: number[] = [];
            for (let index = 0; index < objs.length; index++) {
                let gameObj = objs[index];
                let parentId = gameObj.transform.parent ? gameObj.transform.parent.gameObject.hashCode : null;
                originParentIds.push(parentId);
            }

            let prefabData = {};
            for (let key in prefabRootMap) {
                let rootObj: GameObject = this.getGameObjectById(prefabRootMap[key]);
                let url: string = rootObj.prefab.url;
                let rootId: number = prefabRootMap[key];
                let prefabIds: number[] = [];
                this.getAllIdsFromPrefabInstance(rootObj, prefabIds, rootObj);
                prefabData[key] = { url, rootId, prefabIds };
            }

            let data = {
                cmdType: CmdType.UPDATE_PARENT,
                gameObjectIds,
                targetId,
                originParentIds,
                prefabData
            };

            let state = UpdateParentState.create(data);
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

            if (gameObj == rootObj) {
                (gameObj as any).___isRootPrefab____ = false;
                (gameObj as any).prefab = null;
            }
            else if ((gameObj as any).___prefabRoot____ == rootObj) {
                (gameObj as any).prefab = null;
                (gameObj as any).___prefabRoot____ = null;
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
        public resetPrefabbyRootId(rootObj: GameObject, prefab: any, prefabIds: number[]): void {
            for (let index = 0; index < prefabIds.length; index++) {
                const element = prefabIds[index];
                if (element == rootObj.hashCode) {
                    (rootObj as any).___isRootPrefab____ = true;
                    (rootObj as any).prefab = prefab;
                } else {
                    let gameObj = this.getGameObjectById(element);
                    (gameObj as any).___prefabRoot____ = rootObj;
                    (gameObj as any).prefab = prefab;
                }
            }
        }

        /**
         * 获取预制体实例包含的所有游戏对象id
         * @param rootObj 
         * @param ids 
         */
        public getAllIdsFromPrefabInstance(gameObj: GameObject, ids: number[], rootObj: GameObject) {
            if (!gameObj) {
                return;
            }
            if (gameObj == rootObj || (gameObj as any).___prefabRoot____ == rootObj) {
                ids.push(gameObj.hashCode);
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
            let parent:egret3d.Transform | null = null;
            for (let index = gameObjects.length - 1; index >= 0; index--) {
                const element = gameObjects[index];
                findParent = false;
                parent = element.transform.parent;
                while (parent) {
                    for (let i = 0; i < gameObjects.length; i++) {
                        const element = gameObjects[i];
                        if (element.transform === parent) {
                            gameObjects.splice(index,1);
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

        public getGameObjectById(gameObjectId: number): GameObject {
            let objects = Application.sceneManager.getActiveScene().gameObjects;
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i].hashCode === gameObjectId) {
                    return objects[i];
                }
            }
            return null;
        }

        /**
         * 根据id获取对象列表
         * @param ids 不重复的id列表
         */
        public getGameObjectsByIds(ids: number[]): GameObject[] {
            let objects = Application.sceneManager.getActiveScene().gameObjects;
            let obj: GameObject;
            let result: GameObject[] = [];
            let idIndex: number;
            let cloneIds = ids.concat();
            for (let i: number = 0; i < objects.length; i++) {
                if (cloneIds.length == 0) {
                    return result;
                }
                obj = objects[i];
                idIndex = cloneIds.indexOf(obj.hashCode);
                if (idIndex != -1) {
                    result.push(obj);
                    cloneIds.splice(idIndex, 1);
                }
            }
            return result;
        }

        private getAllHashCodeFromGameObjects(gameobjects: GameObject[]) {
            let hashcodes = [];
            gameobjects.forEach((g: GameObject) => {
                this.getAllHashCodeFromGameObject(g, hashcodes);
            })
            return hashcodes;
        }


        /**
         * 获取gameobject和其子gameobject的hashcode
         * @param gameObject 
         * @param hashcodes 
         */
        public getAllHashCodeFromGameObject(gameObject: GameObject, hashcodes: number[]) {
            hashcodes.push(gameObject.hashCode);
            for (let index = 0; index < gameObject.transform.children.length; index++) {
                const element = gameObject.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getAllHashCodeFromGameObject(obj, hashcodes);
            }
        }

        /**
         * 还原游戏对象及其子游戏对象的hashcode
         * @param gameObj
         * @param hashcodes 
         */
        public resetHashCode(gameObj: GameObject, hashcodes: number[]) {
            let hashCode = hashcodes.shift();
            if (hashCode) {
                (gameObj as any).hashCode = hashCode;
            } else {
                throw new Error("no match hashcode!")
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.resetHashCode(obj, hashcodes);
            }
        }

        /**
         * 还原游戏对象及其子游戏对象的组件的hashcode
         * @param gameObject 
         * @param hashcodes 
         */
        public resetComponentHashCode(gameObject: GameObject, hashcodes: number[]) {
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp = gameObject.components[i];
                (comp as any).gameObject = gameObject;
                let hashcode = hashcodes.shift();
                if (hashcode) {
                    (comp as any).hashCode = hashcode;
                } else {
                    throw new Error("no match hashcode!")
                }
            }
            for (let index = 0; index < gameObject.transform.children.length; index++) {
                const element = gameObject.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.resetComponentHashCode(obj, hashcodes);
            }
        }

        public getAllComponentIdFromGameObject(gameObject: GameObject, hashcodes: number[]) {
            for (let i: number = 0; i < gameObject.components.length; i++) {
                let comp = gameObject.components[i];
                hashcodes.push(comp.hashCode);
            }
            for (let index = 0; index < gameObject.transform.children.length; index++) {
                const element = gameObject.transform.children[index];
                const obj: GameObject = element.gameObject;
                this.getAllComponentIdFromGameObject(obj, hashcodes);
            }
        }


        private findOptionSetName(propName: string, target: any): string {
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
        }

        public setTargetProperty(propName: string, target: any, value: any) {
            let setFunName: string = this.findOptionSetName(propName, target);
            if (setFunName && target[setFunName]) {
                (target[setFunName] as Function).call(target, value);
            } else {
                target[propName] = value;
            }
        }

        /**
         * 选中游戏对象
         * @param selectObj 
         * @param addHistory 是否产生历史记录，只在用户进行选中相关操作时调用
         */
        public selectGameObject(selectObj:any, options?:{ addHistory:boolean,preIds:number[]}) {
            if (selectObj[selectItemType.GAMEOBJECT] && options && options.addHistory && options.preIds) {
                const selectIds = selectObj[selectItemType.GAMEOBJECT];
                const state = SelectGameObjectesState.create({ cmdType: CmdType.SELECT_GAMEOBJECT, prevalue: options.preIds, newvalue: selectIds })
                this.paperHistory.add(state);
            }else{
                this.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, selectObj));
            }
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

        private _editCamera: GameObject;
        public geoController: GeoController;
        private async loadEditScene(url: string) {
            const res = await RES.getResAsync(url) as egret3d.RawScene;
            Application.sceneManager.loadScene(res.url);
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
            let scene = Application.sceneManager.getActiveScene();
            if (this._editCamera) {
                scene.$removeGameObject(this._editCamera);
            }
            let len = this.geoController.controllerPool.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene.$removeGameObject(this.geoController.controllerPool[i]);
                }
            }
            let data = serialize(scene);
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene.$addGameObject(this.geoController.controllerPool[i]);
                }
            }
            if (this._editCamera) {
                scene.$addGameObject(this._editCamera);
            }
            let jsonData = JSON.stringify(data);
            return jsonData;
        }


        public undo = () => {
            this.paperHistory.back();
        }

        public redo = () => {
            this.paperHistory.forward();
        }
    }
}