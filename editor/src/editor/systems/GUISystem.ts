namespace paper.editor {
    type ResData = { name: string, type: string, url: string, root: string };
    /**
     * TODO GUI NEW SAVE LOAD
     * @internal
     */
    export class GUISystem extends BaseSystem<GameObject> {
        private _addEntityCount: uint = 0;
        private readonly _disposeCollecter: DisposeCollecter = Application.sceneManager.globalEntity.getOrAddComponent(DisposeCollecter);
        private readonly _modelComponent: ModelComponent = Application.sceneManager.globalEntity.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = Application.sceneManager.globalEntity.getOrAddComponent(GUIComponent);
        private readonly _sceneOrEntityBuffer: (IScene | IEntity | null)[] = [];
        private _selectItem: dat.GUI | null = null;

        private _onSceneCreated([scene, isActive]: [IScene, boolean]) {
            this._sceneOrEntityBuffer.push(scene);
        }

        private _onSceneDestroy(scene: IScene) {
            this._removeSceneOrEntity(scene);
        }

        private _onEntityCreated(entity: IEntity) {
            this._sceneOrEntityBuffer.push(entity);
        }

        private _onEntityDestroy(entity: IEntity) {
            this._removeSceneOrEntity(entity);
        }

        private _onComponentCreated(_onComponentCreated: any) {
        }

        private _onComponentDestroy(_onComponentDestroy: any) {
        }

        private _onTransformParentChanged([transform, prevParent, currentParent]: [BaseTransform, BaseTransform | null, BaseTransform | null]) {
            if (this._sceneOrEntityBuffer.indexOf(transform.entity) < 0) {
                this._removeSceneOrEntity(transform.entity);
                this._sceneOrEntityBuffer.push(transform.entity);
            }
        }

        private _onSceneSelected = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(value);
        }

        private _onSceneUnselected = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(null);
        }

        private _onGameObjectSelectedChange = (_c: any, value: GameObject) => {
            this._selectSceneOrGameObject(this._modelComponent.selectedGameObject);
        }

        private _sceneOrGameObjectGUIClickHandler = (gui: dat.GUI) => {
            this._modelComponent.select(gui.instance, true);
        }

        private _componentOrPropertyGUIClickHandler = (gui: dat.GUI) => {
            (window as any)["psc"] = gui.instance;
        }

        private _saveSceneOrGameObject = () => {
            if (this._modelComponent.selectedScene) {
                const json = JSON.stringify(serialize(this._modelComponent.selectedScene));
                console.info(json);
            }
            else {
                const json = JSON.stringify(serialize(this._modelComponent.selectedGameObject!));
                console.info(json);
            }
        }

        private _destroySceneOrGameObject = () => {
            const selectedSceneOrGameObject = this._guiComponent.inspector.instance as Scene | GameObject;
            if (selectedSceneOrGameObject) {
                (selectedSceneOrGameObject).destroy();
            }
        }

        private _openFolder(folder: dat.GUI) {
            if (!folder.parent || folder.parent === this._guiComponent.hierarchy) {
                return;
            }

            folder.parent.open();
            this._openFolder(folder.parent);
        }

        private _getAssets(type: string) {
            const added = [] as string[];
            const result = [{ label: "None", value: null }] as { label: string, value: string | null }[];
            const assets = (Asset as any)._assets as { [key: string]: Asset };

            for (const k in assets) {
                let flag = false;
                const asset = assets[k];
                switch (type) {
                    case "Mesh":
                        if (asset instanceof egret3d.Mesh) {
                            flag = true;
                        }
                        break;

                    case "TextureDesc":
                        if (asset instanceof egret3d.Texture) {
                            flag = true;
                        }
                        break;

                    case "Material":
                        if (asset instanceof egret3d.Material) {
                            flag = true;
                        }
                        break;

                    default:
                        break;
                }

                if (flag) {
                    added.push(k);
                    result.push({ label: k, value: k });
                }
            }

            if (RES.host.resourceConfig.config) {
                const fileSystem = RES.host.resourceConfig.config.fileSystem as any;
                if (fileSystem) {
                    const resFSDatas = fileSystem.fsData as { [key: string]: ResData };
                    for (const k in resFSDatas) {
                        if (added.indexOf(k) >= 0) {
                            continue;
                        }

                        const data = resFSDatas[k];
                        if (data.type === type) {
                            result.push({ label: k, value: data.url });
                        }
                    }
                }
            }

            return result;
        }

        private _selectSceneOrGameObject(sceneOrGameObject: Scene | GameObject | null) {
            // Unselect prev folder.
            if (this._selectItem) {
                this._selectItem.selected = false;
                this._selectItem = null;
            }

            const inspector = this._guiComponent.inspector;
            inspector.instance = sceneOrGameObject;

            for (const k in this._guiComponent.inspectorItems) {
                delete this._guiComponent.inspectorItems[k];
            }

            if (inspector.__controllers) {
                for (const controller of inspector.__controllers.concat()) {
                    inspector.remove(controller);
                }
            }

            if (inspector.__folders) {
                for (const k in inspector.__folders) {
                    try {
                        inspector.removeFolder(inspector.__folders[k]);
                    }
                    catch (e) {
                    }
                }
            }

            const options = {
                scenes: "None",
                prefabs: "None",
            };

            inspector.add(options, "scenes", this._getAssets("Scene")).onChange(async (v: string | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v);
                Scene.activeScene.destroy();
                this._modelComponent.select(Scene.create(v));
            });

            inspector.add(options, "prefabs", this._getAssets("Prefab")).onChange(async (v: string | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v);
                let gameObject: GameObject | null = null;
                if (this._modelComponent.selectedGameObject) {
                    const parent = this._modelComponent.selectedGameObject!;
                    gameObject = Prefab.create(v, parent.scene!);
                    gameObject!.parent = parent;
                }
                else {
                    gameObject = Prefab.create(v, this._modelComponent.selectedScene || Scene.activeScene);
                }

                this._modelComponent.select(gameObject);
            });

            if (sceneOrGameObject) {
                inspector.add(this, "destroy|_destroySceneOrGameObject", "destroy");
                inspector.add(this, "save|_saveSceneOrGameObject", "save");
                this._addToInspector(inspector);

                if (sceneOrGameObject instanceof Scene) { // Update scene.
                }
                else { // Update game object.
                    for (const component of sceneOrGameObject.components) {
                        const folder = inspector.addFolder(component.uuid, egret.getQualifiedClassName(component));
                        folder.instance = component;
                        folder.open();
                        this._guiComponent.inspectorItems[component.uuid] = folder;
                        this._addToInspector(folder);
                    }
                }
            }
        }

        private _getOrAddScene(scene: IScene) {
            if (scene === Scene.editorScene) {
                return null;
            }

            const guiComponent = this._guiComponent;

            if (!(scene.uuid in guiComponent.hierarchyItems)) {
                const item = guiComponent.hierarchy.addFolder(scene.uuid, scene.name + " <Scene>");
                item.instance = scene;
                item.onClick = this._sceneOrGameObjectGUIClickHandler;
                guiComponent.hierarchyItems[scene.uuid] = item;
            }

            return guiComponent.hierarchyItems[scene.uuid];
        }

        private _addEntity(entity: IEntity) {
            const { hierarchyItems } = this._guiComponent;

            if (
                entity.uuid in hierarchyItems ||
                (entity.hideFlags & HideFlags.Hide) ||
                entity.scene === Scene.editorScene
            ) {
                return true;
            }

            if (this._addEntityCount > 5) {
                this._sceneOrEntityBuffer.push(entity);
                return false;
            }

            let parent: dat.GUI;

            if (entity instanceof GameObject && entity.transform.parent) {
                parent = hierarchyItems[entity.transform.parent.entity.uuid];

                if (!parent) {
                    this._sceneOrEntityBuffer.push(entity);
                    return true;
                }
            }
            else {
                parent = this._getOrAddScene(entity.scene)!;
            }

            const item = parent.addFolder(entity.uuid, entity.name);
            item.instance = entity;
            item.onClick = this._sceneOrGameObjectGUIClickHandler;
            hierarchyItems[entity.uuid] = item;

            this._addEntityCount++;

            return true;
        }

        private _removeSceneOrEntity(value: IScene | IEntity) {
            const { hierarchyItems } = this._guiComponent;

            if (value.uuid in hierarchyItems) {
                const item = hierarchyItems[value.uuid];
                delete hierarchyItems[value.uuid];

                if (item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }

            const index = this._sceneOrEntityBuffer.indexOf(value);

            if (index >= 0) {
                this._sceneOrEntityBuffer[index] = null;
            }
        }

        private _propertyHasGetterSetter(target: any, propName: string) {
            let prototype = Object.getPrototypeOf(target);

            while (prototype) {
                const descriptror = Object.getOwnPropertyDescriptor(prototype, propName);
                if (descriptror && descriptror.get && descriptror.set) {
                    return true;
                }

                prototype = Object.getPrototypeOf(prototype);
            }

            return false;
        }

        private _addToInspector(gui: dat.GUI) {
            const infos = editor.getEditInfo(gui.instance);

            if (gui !== this._guiComponent.inspector) {
                gui.onClick = this._componentOrPropertyGUIClickHandler;
            }

            for (const info of infos) {
                this._addItemToInspector(info.editType, gui, info);
            }

            if (gui.instance instanceof egret3d.Material) {
                const techniqueUniforms = gui.instance.technique.uniforms;
                for (const k in techniqueUniforms) {
                    const uniform = techniqueUniforms[k];

                    if (!uniform.name) { //
                        uniform.name = k;
                    }

                    this._addUniformItemToInspector(uniform, gui);
                }
            }
        }

        private _addItemToInspector(type: editor.EditType, parent: dat.GUI, info: editor.PropertyInfo) {
            if (parent !== this._guiComponent.inspector) {
                parent.onClick = this._componentOrPropertyGUIClickHandler;
            }

            let guiControllerA: dat.GUIController;
            let guiControllerB: dat.GUIController;
            let guiControllerC: dat.GUIController;
            let guiControllerD: dat.GUIController;

            switch (type) {
                case editor.EditType.UINT:
                    guiControllerA = parent.add(parent.instance, info!.name).min(0).step(1).listen();

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                        }
                    }
                    break;

                case editor.EditType.INT:
                    guiControllerA = parent.add(parent.instance, info.name).step(1).listen();

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                        }
                    }
                    break;

                case editor.EditType.FLOAT:
                    guiControllerA = parent.add(parent.instance, info.name).step(0.1).listen();

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                        }
                    }
                    break;

                case editor.EditType.CHECKBOX:
                case editor.EditType.TEXT:
                    parent.add(parent.instance, info.name).listen();
                    break;

                case editor.EditType.LIST:
                    let listItems = info.option!.listItems;
                    if (listItems) {
                        if (typeof listItems === "string") {
                            listItems = parent.instance[listItems] as editor.ListItem[];
                        }
                        else if (listItems instanceof Function) {
                            listItems = listItems(parent.instance);
                        }

                        parent.add(parent.instance, info.name, listItems).listen();
                    }
                    break;

                case editor.EditType.VECTOR2: {
                    guiControllerA = parent.add(parent.instance[info.name], `${info.name}: x|x`).step(0.1).listen();
                    guiControllerB = parent.add(parent.instance[info.name], `${info.name}: y|y`).step(0.1).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                        guiControllerB.onChange(onChange);
                    }

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                            guiControllerB.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                            guiControllerB.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                            guiControllerB.step(info.option.step);
                        }
                    }
                    break;
                }

                case editor.EditType.SIZE: {
                    guiControllerA = parent.add(parent.instance[info.name], `${info.name}: w|w`).step(0.1).listen();
                    guiControllerB = parent.add(parent.instance[info.name], `${info.name}: h|h`).step(0.1).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                        guiControllerB.onChange(onChange);
                    }

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                            guiControllerB.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                            guiControllerB.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                            guiControllerB.step(info.option.step);
                        }
                    }
                    break;
                }

                case editor.EditType.VECTOR3: {
                    guiControllerA = parent.add(parent.instance[info.name], `${info.name}: x|x`).step(0.1).listen();
                    guiControllerB = parent.add(parent.instance[info.name], `${info.name}: y|y`).step(0.1).listen();
                    guiControllerC = parent.add(parent.instance[info.name], `${info.name}: z|z`).step(0.1).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                        guiControllerB.onChange(onChange);
                        guiControllerC.onChange(onChange);
                    }

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                            guiControllerB.min(info.option.minimum);
                            guiControllerC.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                            guiControllerB.max(info.option.maximum);
                            guiControllerC.max(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                            guiControllerB.step(info.option.step);
                            guiControllerC.step(info.option.step);
                        }
                    }
                    break;
                }

                case editor.EditType.VECTOR4:
                case editor.EditType.QUATERNION:
                    break;

                case editor.EditType.COLOR: {
                    guiControllerA = parent.addColor(parent.instance, info.name).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                    }
                    break;
                }

                case editor.EditType.RECT: {
                    guiControllerA = parent.add(parent.instance[info.name], `${info.name}: x|x`).step(0.1).listen();
                    guiControllerB = parent.add(parent.instance[info.name], `${info.name}: y|y`).step(0.1).listen();
                    guiControllerC = parent.add(parent.instance[info.name], `${info.name}: w|w`).step(0.1).listen();
                    guiControllerD = parent.add(parent.instance[info.name], `${info.name}: h|h`).step(0.1).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                        guiControllerB.onChange(onChange);
                        guiControllerC.onChange(onChange);
                        guiControllerD.onChange(onChange);
                    }

                    if (info.option) {
                        if (info.option.minimum !== undefined) {
                            guiControllerA.min(info.option.minimum);
                            guiControllerB.min(info.option.minimum);
                            guiControllerC.min(info.option.minimum);
                            guiControllerD.min(info.option.minimum);
                        }

                        if (info.option.maximum !== undefined) {
                            guiControllerA.max(info.option.maximum);
                            guiControllerB.max(info.option.maximum);
                            guiControllerC.max(info.option.maximum);
                            guiControllerD.min(info.option.maximum);
                        }

                        if (info.option.step !== undefined) {
                            guiControllerA.step(info.option.step);
                            guiControllerB.step(info.option.step);
                            guiControllerC.step(info.option.step);
                            guiControllerD.step(info.option.step);
                        }
                    }
                    break;
                }

                case editor.EditType.MESH:
                    parent.add(new AssetProxy(parent.instance, info.name), `${info.name}|uri`, this._getAssets("Mesh")).listen();
                    break;

                case editor.EditType.MATERIAL: {
                    const folder = parent.addFolder(info.name);
                    folder.instance = parent.instance[info.name];
                    this._addToInspector(folder);
                    break;
                }

                case editor.EditType.MATERIAL_ARRAY: {
                    const folder = parent.addFolder(info.name);
                    folder.instance = parent.instance[info.name];
                    this._addToArray(folder, egret3d.Material);
                    break;
                }

                case editor.EditType.GAMEOBJECT:
                    break;

                case editor.EditType.BUTTON:
                    parent.add(parent.instance, info.name);
                    break;

                case editor.EditType.NESTED: {
                    const folder = parent.addFolder(info.name);
                    folder.instance = parent.instance[info.name];
                    this._addToInspector(folder);
                    break;
                }
            }
        }

        private _addUniformItemToInspector(uniform: gltf.Uniform, parent: dat.GUI) {
            if (parent !== this._guiComponent.inspector) {
                parent.onClick = this._componentOrPropertyGUIClickHandler;
            }

            let guiControllerA: dat.GUIController;
            let guiControllerB: dat.GUIController;
            let guiControllerC: dat.GUIController;
            let guiControllerD: dat.GUIController;

            switch (uniform.type) {
                case gltf.UniformType.FLOAT:
                    if (typeof uniform.value === "number") {
                        guiControllerA = parent.add(uniform, `${uniform.name!}|value`).step(0.1).listen();
                        guiControllerA.onChange((v: number) => {
                            (parent.instance as egret3d.Material).setFloat(uniform.name!, v);
                        });
                    }
                    break;

                case gltf.UniformType.SAMPLER_2D:
                    // parent.add(new AssetProxy(parent.instance, uniform.name, "getTexture", "setTexture"), `${uniform.name}|uri`, this._getAssets("TextureDesc")).listen();
                    guiControllerA = parent.add(new AssetProxy(parent.instance, uniform.name, "getTexture", "setTexture"), `${uniform.name}|uri`).listen();
                    break;
            }
        }

        private _addToArray(gui: dat.GUI, type: any) {
            if (gui !== this._guiComponent.inspector) {
                gui.onClick = this._componentOrPropertyGUIClickHandler;
            }

            switch (type) {
                case egret3d.Material: {
                    const materials = gui.instance as egret3d.Material[];
                    let index = 0;
                    for (const material of materials) {
                        const folder = gui.addFolder(`<${index++}>`);
                        folder.instance = material;
                        this._addToInspector(folder);
                    }
                    break;
                }
            }
        }

        public onAwake() {
            const sceneOptions = {
                debug: false,
                resources: () => {
                    // if (this._modelComponent.selectedScene) {
                    //     const sceneJSON = JSON.stringify(serialize(this._modelComponent.selectedScene));
                    //     console.info(sceneJSON);
                    // }
                    // else if (this._modelComponent.selectedGameObjects.length > 0) {
                    // }
                },
            };

            this._guiComponent.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
                let sceneSystem = Application.systemManager.getSystem(editor.SceneSystem);

                if (!sceneSystem) {
                    sceneSystem = Application.systemManager.register(editor.SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
                }

                if (v) {
                    Application.playerMode = PlayerMode.DebugPlayer;
                    sceneSystem.enabled = true;
                }
                else {
                    Application.playerMode = PlayerMode.Player;
                    sceneSystem.enabled = false;
                }
            });
        }

        public onEnable() {
            Scene.onSceneCreated.add(this._onSceneCreated, this);
            Scene.onSceneDestroy.add(this._onSceneDestroy, this);
            Entity.onEntityCreated.add(this._onEntityCreated, this);
            Entity.onEntityDestroy.add(this._onEntityDestroy, this);
            Component.onComponentCreated.add(this._onComponentCreated, this);
            Component.onComponentDestroy.add(this._onComponentDestroy, this);
            BaseTransform.onTransformParentChanged.add(this._onTransformParentChanged, this);

            ModelComponent.onSceneSelected.add(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.add(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectedChange, this);

            this._sceneOrEntityBuffer.push(Application.sceneManager.globalScene);
            for (const entity of Application.sceneManager.globalScene.rootEntities) {
                this._sceneOrEntityBuffer.push(entity);
            }

            this._modelComponent.select(Scene.activeScene);
        }

        public onDisable() {
            Scene.onSceneCreated.remove(this._onSceneCreated);
            Scene.onSceneDestroy.remove(this._onSceneDestroy);
            Entity.onEntityCreated.remove(this._onEntityCreated);
            Entity.onEntityDestroy.remove(this._onEntityDestroy);
            Component.onComponentCreated.remove(this._onComponentCreated);
            Component.onComponentDestroy.remove(this._onComponentDestroy);
            BaseTransform.onTransformParentChanged.remove(this._onTransformParentChanged);

            ModelComponent.onSceneSelected.remove(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.remove(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectedChange, this);

            const { hierarchyItems, inspectorItems } = this._guiComponent;

            for (const k in hierarchyItems) {
                const item = hierarchyItems[k];
                delete hierarchyItems[k];

                if (item && item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }

            for (const k in inspectorItems) {
                const item = inspectorItems[k];
                delete inspectorItems[k];

                if (item && item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }

            this._sceneOrEntityBuffer.length = 0;
            this._selectItem = null;
        }

        public onTick() {
            const isHierarchyShowed = !this._guiComponent.hierarchy.closed && this._guiComponent.hierarchy.domElement.style.display !== "none";
            const isInspectorShowed = !this._guiComponent.inspector.closed && this._guiComponent.inspector.domElement.style.display !== "none";

            { // Clear folders.
                for (const component of this._disposeCollecter.components) {
                    const folder = this._guiComponent.inspectorItems[component.uuid];
                    delete this._guiComponent.inspectorItems[component.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }
            }

            this._modelComponent.update(); // TODO

            if (isHierarchyShowed) { // Add folder.
                const sceneOrEntityBuffer = this._sceneOrEntityBuffer;

                while (sceneOrEntityBuffer.length > 0) {
                    const element = sceneOrEntityBuffer.shift();

                    if (element) {
                        if (element instanceof Entity) {
                            if (!this._addEntity(element)) {
                                break;
                            }
                        }
                        else {
                            this._getOrAddScene(element as IScene);
                        }
                    }
                }

                this._addEntityCount = 0;

                if (!this._selectItem) {  // Open and select folder.
                    const sceneOrEntity = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
                    const { hierarchyItems } = this._guiComponent;

                    if (sceneOrEntity && sceneOrEntity.uuid in hierarchyItems) {
                        this._selectItem = hierarchyItems[sceneOrEntity.uuid];
                        this._selectItem.selected = true;
                        this._openFolder(this._selectItem);
                    }
                }
            }

            if (isInspectorShowed) {
                if (this._modelComponent.selectedGameObject) {
                    this._modelComponent.selectedGameObject.transform.localEulerAngles; // TODO
                }
            }
        }
    }

    class AssetProxy {
        public constructor(
            private _instance: any,
            private _key: string | null = null,
            private _get: string | null = null,
            private _set: string | null = null,
        ) {
        }

        private _setValue(value: any) {
            if (this._set) {
                this._instance[this._set](this._key, value);
            }
            else {
                this._instance[this._key!] = value;
            }
        }

        public get uri() {
            const value = this._get ? this._instance[this._get](this._key) : this._instance[this._key!];
            if (value) {
                return value.name || DefaultNames.NoName;
            }

            return "";
            // return null;
        }

        public set uri(value: any) {
            if (!value) {
                this._setValue(null);
            }
            else {
                const asset = Asset.find(value);
                if (asset) {
                    this._setValue(asset);
                }
                else {
                    RES.getResAsync(value).then((r) => {
                        this._setValue(r);
                    });
                }
            }
        }
    }
}
