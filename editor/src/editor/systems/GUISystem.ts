/**
 * @internal
 */
declare var VConsole: any;

namespace paper.editor {
    type ResData = { name: string, type: string, url: string, root: string };
    /**
     * TODO GUI NEW SAVE LOAD
     * @internal
     */
    export class GUISystem extends BaseSystem {
        protected readonly _interests = [
            [{ componentClass: egret3d.Transform }]
        ];

        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);
        private readonly _bufferedGameObjects: (GameObject | null)[] = [];
        private readonly _hierarchyFolders: { [key: string]: dat.GUI } = {};
        private readonly _inspectorFolders: { [key: string]: dat.GUI } = {};
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

        private _createGameObject = () => {
            if (this._modelComponent.selectedScene) {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, DefaultNames.NoName, DefaultTags.Untagged, this._modelComponent.selectedScene);
                this._modelComponent.select(gameObject, true);
            }
            else {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, DefaultNames.NoName, DefaultTags.Untagged, this._modelComponent.selectedGameObject!.scene);
                gameObject.transform.parent = this._modelComponent.selectedGameObject!.transform;
                this._modelComponent.select(gameObject, true);
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
            const result = [{ label: "None", value: null }] as { label: string, value: ResData | null }[];

            if (RES.host.resourceConfig.config) {
                const resFSDatas = (RES.host.resourceConfig.config.fileSystem as any).fsData as { [key: string]: ResData };
                for (const k in resFSDatas) {
                    const data = resFSDatas[k];
                    if (data.type === type) {
                        result.push({ label: k, value: data });
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

            for (const k in this._inspectorFolders) {
                delete this._inspectorFolders[k];
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

            inspector.add(options, "scenes", this._getAssets("Scene")).onChange(async (v: ResData | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v.url);
                Scene.activeScene.destroy();
                this._modelComponent.select(Scene.create(v.url));
            });

            inspector.add(options, "prefabs", this._getAssets("Prefab")).onChange(async (v: ResData | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v.url);
                let gameObject: GameObject | null = null;
                if (this._modelComponent.selectedGameObject) {
                    const parent = this._modelComponent.selectedGameObject!;
                    gameObject = Prefab.create(v.url, parent.scene);
                    gameObject!.parent = parent;
                }
                else {
                    gameObject = Prefab.create(v.url, this._modelComponent.selectedScene || Scene.activeScene);
                }

                this._modelComponent.select(gameObject);
            });

            if (sceneOrGameObject) {
                inspector.add(this, "_destroySceneOrGameObject", "destroy");
                inspector.add(this, "_saveSceneOrGameObject", "save");
                this._addToInspector(inspector);

                if (sceneOrGameObject instanceof Scene) { // Update scene.
                }
                else { // Update game object.
                    for (const component of sceneOrGameObject.components) {
                        const folder = inspector.addFolder(component.uuid, egret.getQualifiedClassName(component));
                        folder.instance = component;
                        folder.open();
                        this._inspectorFolders[component.uuid] = folder;
                        this._addToInspector(folder);
                    }
                }
            }
        }

        private _addToHierarchy(gameObject: GameObject) {
            if (
                gameObject.uuid in this._hierarchyFolders ||
                gameObject.tag === DefaultTags.EditorOnly ||
                gameObject.hideFlags === HideFlags.Hide ||
                gameObject.hideFlags === HideFlags.HideAndDontSave
            ) {
                return true;
            }

            let parentFolder = this._hierarchyFolders[gameObject.transform.parent ? gameObject.transform.parent.gameObject.uuid : gameObject.scene.uuid];
            if (!parentFolder) {
                if (gameObject.transform.parent) {
                    // throw new Error(); // Never.
                    return false;
                }

                parentFolder = this._guiComponent.hierarchy.addFolder(gameObject.scene.uuid, gameObject.scene.name + " <Scene>");
                parentFolder.instance = gameObject.scene;
                parentFolder.onClick = this._sceneOrGameObjectGUIClickHandler;
                this._hierarchyFolders[gameObject.scene.uuid] = parentFolder;
            }

            const folder = parentFolder.addFolder(gameObject.uuid, gameObject.name);
            folder.instance = gameObject;
            folder.onClick = this._sceneOrGameObjectGUIClickHandler;
            this._hierarchyFolders[gameObject.uuid] = folder;

            return true;
        }

        private _propertyHasGetterSetter(target: any, propName: string) {
            let prototype = Object.getPrototypeOf(target);
            let descriptror;

            while (prototype) {
                descriptror = Object.getOwnPropertyDescriptor(prototype, propName);
                if (descriptror && descriptror.get && descriptror.set) {
                    return true;
                }
                prototype = Object.getPrototypeOf(prototype);
            }

            return false;
        }

        private _addToInspector(gui: dat.GUI) {
            const infos = editor.getEditInfo(gui.instance);
            let guiControllerA: dat.GUIController;
            let guiControllerB: dat.GUIController;
            let guiControllerC: dat.GUIController;
            let guiControllerD: dat.GUIController;

            if (gui !== this._guiComponent.inspector) {
                gui.onClick = this._componentOrPropertyGUIClickHandler;
            }

            for (const info of infos) {
                switch (info.editType) {
                    case paper.editor.EditType.UINT:
                        guiControllerA = gui.add(gui.instance, info.name).min(0).step(1).listen();

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
                        guiControllerA = gui.add(gui.instance, info.name).step(1).listen();

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
                        guiControllerA = gui.add(gui.instance, info.name).step(0.1).listen();

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
                        gui.add(gui.instance, info.name).listen();
                        break;

                    case paper.editor.EditType.LIST:
                        let listItems = info.option!.listItems;
                        if (listItems) {
                            if (typeof listItems === "string") {
                                listItems = gui.instance[listItems] as paper.editor.ListItem[];
                            }
                            else if (listItems instanceof Function) {
                                listItems = listItems(gui.instance);
                            }

                            gui.add(gui.instance, info.name, listItems).listen();
                        }
                        break;

                    case paper.editor.EditType.VECTOR2: {
                        guiControllerA = gui.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                        guiControllerB = gui.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();

                        if (this._propertyHasGetterSetter(gui.instance, info.name)) {
                            const onChange = () => {
                                gui.instance[info.name] = gui.instance[info.name];
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
                        guiControllerA = gui.add(gui.instance[info.name], "w", `${info.name}: w`).step(0.1).listen();
                        guiControllerB = gui.add(gui.instance[info.name], "h", `${info.name}: h`).step(0.1).listen();

                        if (this._propertyHasGetterSetter(gui.instance, info.name)) {
                            const onChange = () => {
                                gui.instance[info.name] = gui.instance[info.name];
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
                        guiControllerA = gui.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                        guiControllerB = gui.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                        guiControllerC = gui.add(gui.instance[info.name], "z", `${info.name}: z`).step(0.1).listen();

                        if (this._propertyHasGetterSetter(gui.instance, info.name)) {
                            const onChange = () => {
                                gui.instance[info.name] = gui.instance[info.name];
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
                        guiControllerA = gui.addColor(gui.instance, info.name).listen();

                        if (this._propertyHasGetterSetter(gui.instance, info.name)) {
                            const onChange = () => {
                                gui.instance[info.name] = gui.instance[info.name];
                            };
                            guiControllerA.onChange(onChange);
                        }
                        break;
                    }

                    case paper.editor.EditType.RECT: {
                        guiControllerA = gui.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                        guiControllerB = gui.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                        guiControllerC = gui.add(gui.instance[info.name], "w", `${info.name}: w`).step(0.1).listen();
                        guiControllerD = gui.add(gui.instance[info.name], "h", `${info.name}: h`).step(0.1).listen();

                        if (this._propertyHasGetterSetter(gui.instance, info.name)) {
                            const onChange = () => {
                                gui.instance[info.name] = gui.instance[info.name];
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

                    case paper.editor.EditType.GAMEOBJECT:
                        break;

                    case paper.editor.EditType.BUTTON:
                        guiControllerA = gui.add(gui.instance, info.name);
                        break;

                    case paper.editor.EditType.NESTED: {
                        const folder = gui.addFolder(info.name);
                        folder.instance = gui.instance[info.name];
                        this._addToInspector(folder);
                        break;
                    }
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
                const sceneSystem = Application.systemManager.getOrRegisterSystem(editor.SceneSystem, SystemOrder.LaterUpdate);

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

            this._bufferedGameObjects.push(GameObject.globalGameObject);

            for (const gameObject of this._groups[0].gameObjects) {
                this._bufferedGameObjects.push(gameObject);
            }

            this._modelComponent.select(Scene.activeScene);
        }

        public onDisable() {
            ModelComponent.onSceneSelected.remove(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.remove(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectedChange, this);

            for (const k in this._hierarchyFolders) {
                const folder = this._hierarchyFolders[k];
                delete this._hierarchyFolders[k];

                if (folder && folder.parent) {
                    try {
                        folder.parent.removeFolder(folder);
                    }
                    catch (e) {
                    }
                }
            }

            for (const k in this._inspectorFolders) {
                delete this._inspectorFolders[k];
            }

            this._bufferedGameObjects.length = 0;
            this._selectFolder = null;
        }

        public onAddGameObject(gameObject: GameObject, _group: GameObjectGroup) {
            this._bufferedGameObjects.push(gameObject);
        }

        public onRemoveGameObject(gameObject: GameObject, _group: GameObjectGroup) {
            const index = this._bufferedGameObjects.indexOf(gameObject);
            if (index >= 0) {
                this._bufferedGameObjects[index] = null;
            }
        }

        public onUpdate() {
            const isHierarchyShowed = !this._guiComponent.hierarchy.closed && this._guiComponent.hierarchy.domElement.style.display !== "none";
            const isInspectorShowed = !this._guiComponent.inspector.closed && this._guiComponent.inspector.domElement.style.display !== "none";

            { // Clear folders.
                for (const scene of this._disposeCollecter.scenes) {
                    const folder = this._hierarchyFolders[scene.uuid];
                    delete this._hierarchyFolders[scene.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                for (const gameObject of this._disposeCollecter.gameObjects) {
                    const folder = this._hierarchyFolders[gameObject.uuid];
                    delete this._hierarchyFolders[gameObject.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                for (const component of this._disposeCollecter.components) {
                    const folder = this._inspectorFolders[component.uuid];
                    delete this._inspectorFolders[component.uuid];

                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }

                for (const gameObject of this._disposeCollecter.parentChangedGameObjects) {
                    const folder = this._hierarchyFolders[gameObject.uuid];

                    if (folder) {
                        delete this._hierarchyFolders[gameObject.uuid];

                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }

                        this._bufferedGameObjects.push(gameObject);
                    }
                    else if (this._bufferedGameObjects.indexOf(gameObject) < 0) {
                        this._bufferedGameObjects.push(gameObject);
                    }
                }
            }

            if (isHierarchyShowed) {
                // Add folder.
                let i = 0;
                while (this._bufferedGameObjects.length > 0 && i++ < 5) {
                    const gameObject = this._bufferedGameObjects.shift();
                    if (gameObject) {
                        if (!this._addToHierarchy(gameObject)) {
                            this._bufferedGameObjects.push(gameObject);
                        }
                    }
                }

                if (!this._selectFolder) {  // Open and select folder.
                    const sceneOrGameObject = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
                    if (sceneOrGameObject && sceneOrGameObject.uuid in this._hierarchyFolders) {
                        this._selectFolder = this._hierarchyFolders[sceneOrGameObject.uuid];
                        this._selectFolder.selected = true;
                        this._openFolder(this._selectFolder);
                    }
                }
            }

            if (isInspectorShowed) { // Update folder.
                this._guiComponent.inspector.updateDisplay();

                const inspectorFolders = this._guiComponent.inspector.__folders;
                if (inspectorFolders) {
                    for (const k in inspectorFolders) {
                        inspectorFolders[k].updateDisplay();
                    }
                }

                if (this._modelComponent.selectedGameObject) {
                    // TODO
                    this._modelComponent.selectedGameObject.transform.localEulerAngles;
                }
            }
        }
    }
}