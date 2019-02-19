namespace paper.editor {
    type ResData = { name: string, type: string, url: string, root: string };
    /**
     * TODO GUI NEW SAVE LOAD
     * @internal
     */
    export class GUISystem extends BaseSystem<GameObject> {
        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);
        private readonly _bufferedGameObjects: (GameObject | null)[] = [];
        private _selectFolder: dat.GUI | null = null;

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
            const assets = (paper.Asset as any)._assets as { [key: string]: paper.Asset };

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
            if (this._selectFolder) {
                this._selectFolder.selected = false;
                this._selectFolder = null;
            }

            const inspector = this._guiComponent.inspector;
            inspector.instance = sceneOrGameObject;

            for (const k in this._guiComponent._inspectorFolders) {
                delete this._guiComponent._inspectorFolders[k];
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
                        this._guiComponent._inspectorFolders[component.uuid] = folder;
                        this._addToInspector(folder);
                    }
                }
            }
        }

        private _addToHierarchy(gameObject: GameObject) {
            if (
                gameObject.uuid in this._guiComponent._hierarchyFolders ||
                (gameObject.hideFlags & HideFlags.Hide) ||
                gameObject.scene === Scene.editorScene
            ) {
                return true;
            }

            let parentFolder = this._guiComponent._hierarchyFolders[gameObject.transform.parent ? gameObject.transform.parent.gameObject.uuid : gameObject.scene!.uuid];
            if (!parentFolder) {
                if (gameObject.transform.parent) {
                    // throw new Error(); // Never.
                    return false;
                }

                parentFolder = this._guiComponent.hierarchy.addFolder(gameObject.scene.uuid, gameObject.scene.name + " <Scene>");
                parentFolder.instance = gameObject.scene;
                parentFolder.onClick = this._sceneOrGameObjectGUIClickHandler;
                this._guiComponent._hierarchyFolders[gameObject.scene.uuid] = parentFolder;
            }

            const folder = parentFolder.addFolder(gameObject.uuid, gameObject.name);
            folder.instance = gameObject;
            folder.onClick = this._sceneOrGameObjectGUIClickHandler;
            this._guiComponent._hierarchyFolders[gameObject.uuid] = folder;

            return true;
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

        private _addItemToInspector(type: paper.editor.EditType, parent: dat.GUI, info: paper.editor.PropertyInfo) {
            if (parent !== this._guiComponent.inspector) {
                parent.onClick = this._componentOrPropertyGUIClickHandler;
            }

            let guiControllerA: dat.GUIController;
            let guiControllerB: dat.GUIController;
            let guiControllerC: dat.GUIController;
            let guiControllerD: dat.GUIController;

            switch (type) {
                case paper.editor.EditType.UINT:
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

                case paper.editor.EditType.INT:
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

                case paper.editor.EditType.FLOAT:
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

                case paper.editor.EditType.CHECKBOX:
                case paper.editor.EditType.TEXT:
                    parent.add(parent.instance, info.name).listen();
                    break;

                case paper.editor.EditType.LIST:
                    let listItems = info.option!.listItems;
                    if (listItems) {
                        if (typeof listItems === "string") {
                            listItems = parent.instance[listItems] as paper.editor.ListItem[];
                        }
                        else if (listItems instanceof Function) {
                            listItems = listItems(parent.instance);
                        }

                        parent.add(parent.instance, info.name, listItems).listen();
                    }
                    break;

                case paper.editor.EditType.VECTOR2: {
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

                case paper.editor.EditType.SIZE: {
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

                case paper.editor.EditType.VECTOR3: {
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

                case paper.editor.EditType.VECTOR4:
                case paper.editor.EditType.QUATERNION:
                    break;

                case paper.editor.EditType.COLOR: {
                    guiControllerA = parent.addColor(parent.instance, info.name).listen();

                    if (this._propertyHasGetterSetter(parent.instance, info.name)) {
                        const onChange = () => {
                            parent.instance[info.name] = parent.instance[info.name];
                        };
                        guiControllerA.onChange(onChange);
                    }
                    break;
                }

                case paper.editor.EditType.RECT: {
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

                case paper.editor.EditType.MESH:
                    parent.add(new AssetProxy(parent.instance, info.name), `${info.name}|uri`, this._getAssets("Mesh")).listen();
                    break;

                case paper.editor.EditType.MATERIAL: {
                    const folder = parent.addFolder(info.name);
                    folder.instance = parent.instance[info.name];
                    this._addToInspector(folder);
                    break;
                }

                case paper.editor.EditType.MATERIAL_ARRAY: {
                    const folder = parent.addFolder(info.name);
                    folder.instance = parent.instance[info.name];
                    this._addToArray(folder, egret3d.Material);
                    break;
                }

                case paper.editor.EditType.GAMEOBJECT:
                    break;

                case paper.editor.EditType.BUTTON:
                    parent.add(parent.instance, info.name);
                    break;

                case paper.editor.EditType.NESTED: {
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
                    sceneSystem = Application.systemManager.register(editor.SceneSystem, Context.getInstance(GameObject), SystemOrder.LateUpdate);
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
            ModelComponent.onSceneSelected.add(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.add(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectedChange, this);

            this._modelComponent.select(Scene.activeScene);
            this._bufferedGameObjects.push(paper.GameObject.globalGameObject);
        }

        public onDisable() {
            ModelComponent.onSceneSelected.remove(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.remove(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectedChange, this);

            for (const k in this._guiComponent._hierarchyFolders) {
                const folder = this._guiComponent._hierarchyFolders[k];
                delete this._guiComponent._hierarchyFolders[k];

                if (folder && folder.parent) {
                    try {
                        folder.parent.removeFolder(folder);
                    }
                    catch (e) {
                    }
                }
            }

            for (const k in this._guiComponent._inspectorFolders) {
                delete this._guiComponent._inspectorFolders[k];
            }

            this._bufferedGameObjects.length = 0;
            this._selectFolder = null;
        }

        public onUpdate() {
            const isHierarchyShowed = !this._guiComponent.hierarchy.closed && this._guiComponent.hierarchy.domElement.style.display !== "none";
            const isInspectorShowed = !this._guiComponent.inspector.closed && this._guiComponent.inspector.domElement.style.display !== "none";

            { // Clear folders.
                for (const scene of this._disposeCollecter.scenes) {
                    const folder = this._guiComponent._hierarchyFolders[scene.uuid];
                    delete this._guiComponent._hierarchyFolders[scene.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                for (const gameObject of this._disposeCollecter.entities) {
                    const folder = this._guiComponent._hierarchyFolders[gameObject.uuid];
                    delete this._guiComponent._hierarchyFolders[gameObject.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                for (const component of this._disposeCollecter.components) {
                    const folder = this._guiComponent._inspectorFolders[component.uuid];
                    delete this._guiComponent._inspectorFolders[component.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                // for (const gameObject of this._disposeCollecter.parentChangedGameObjects) { // TODO
                //     const folder = this._guiComponent._hierarchyFolders[gameObject.uuid];

                //     if (folder) {
                //         delete this._guiComponent._hierarchyFolders[gameObject.uuid];

                //         if (folder && folder.parent) {
                //             try {
                //                 folder.parent.removeFolder(folder);
                //             }
                //             catch (e) {
                //             }
                //         }
                //     }

                //     if (this._bufferedGameObjects.indexOf(gameObject) < 0) {
                //         this._bufferedGameObjects.push(gameObject);
                //     }
                // }
            }

            this._modelComponent.update();

            if (isHierarchyShowed) { // Add folder.
                let i = 0;
                while (this._bufferedGameObjects.length > 0 && i++ < 5) {
                    const gameObject = this._bufferedGameObjects.shift();
                    if (gameObject && !gameObject.isDestroyed) {
                        if (!this._addToHierarchy(gameObject)) {
                            this._bufferedGameObjects.push(gameObject);
                        }
                    }
                }

                if (!this._selectFolder) {  // Open and select folder.
                    const sceneOrGameObject = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
                    if (sceneOrGameObject && sceneOrGameObject.uuid in this._guiComponent._hierarchyFolders) {
                        this._selectFolder = this._guiComponent._hierarchyFolders[sceneOrGameObject.uuid];
                        this._selectFolder.selected = true;
                        this._openFolder(this._selectFolder);
                    }
                }
            }

            if (isInspectorShowed) { // Update folder.
                // this._guiComponent.inspector.updateDisplay();
                // const inspectorFolders = this._guiComponent.inspector.__folders;
                // if (inspectorFolders) {
                //     for (const k in inspectorFolders) {
                //         inspectorFolders[k].updateDisplay();
                //     }
                // }

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
                return value.name || paper.DefaultNames.NoName;
            }

            return "";
            // return null;
        }

        public set uri(value: any) {
            if (!value) {
                this._setValue(null);
            }
            else {
                const asset = paper.Asset.find(value);
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
