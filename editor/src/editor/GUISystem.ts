namespace paper.debug {
    export class GUISystem extends BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: egret3d.Transform }
            ]
        ];

        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);
        private readonly _hierarchyFolders: { [key: string]: dat.GUI } = {};
        private readonly _inspectorFolders: { [key: string]: dat.GUI } = {};

        private _selectGameObject: paper.GameObject | null = null;
        private _selectFolder: dat.GUI | null = null;

        private _sceneSelectedHandler = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(value);
        }

        private _sceneUnselectedHandler = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(null);
        }

        private _gameObjectSelectedHandler = (_c: any, value: GameObject) => {
            this._selectSceneOrGameObject(value);
        }

        private _gameObjectUnselectedHandler = (_c: any, value: GameObject) => {
            this._selectSceneOrGameObject(null);
        }

        private _createGameObject = () => {
            if (this._guiComponent.selectedScene) {
                this._selectGameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, DefaultNames.NoName, DefaultTags.Untagged, this._guiComponent.selectedScene);
            }
            else {
                this._selectGameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, DefaultNames.NoName, DefaultTags.Untagged, this._guiComponent.selectedGameObject!.scene);
                this._selectGameObject.transform.parent = this._guiComponent.selectedGameObject!.transform;
            }
        }

        private _destroySceneOrGameObject = () => {
            const selectedSceneOrGameObject = this._guiComponent.inspector.instance as Scene | GameObject;
            if (selectedSceneOrGameObject) {
                this._guiComponent.select(null); // TODO 
                (selectedSceneOrGameObject).destroy();
            }
        }

        private _nodeClickHandler = (gui: dat.GUI) => {
            this._guiComponent.select(gui.instance, true);
        }

        private _openFolder(folder: dat.GUI) {
            folder.open();

            if (folder.parent && folder.parent !== this._guiComponent.hierarchy) {
                this._openFolder(folder.parent);
            }
        }

        private _selectSceneOrGameObject(sceneOrGameObject: Scene | GameObject | null) {
            // Unselect prev folder.
            if (this._selectFolder) {
                this._selectFolder.selected = false;
                this._selectFolder = null;
            }

            this._guiComponent.inspector.instance = sceneOrGameObject;

            if (sceneOrGameObject) {
                // Open and select folder.
                if (sceneOrGameObject.uuid in this._hierarchyFolders) {
                    this._selectFolder = this._hierarchyFolders[sceneOrGameObject.uuid];
                    this._selectFolder.selected = true;
                    this._openFolder(this._selectFolder.parent);
                }

                if (sceneOrGameObject instanceof Scene) {
                    // Update scene.
                    this._guiComponent.inspector.add(this, "_createGameObject", "createObject");
                    this._guiComponent.inspector.add(this, "_destroySceneOrGameObject", "destroy");
                    this._addToInspector(this._guiComponent.inspector);
                }
                else {
                    // Update game object.
                    this._guiComponent.inspector.add(this, "_createGameObject", "createChildObject");
                    this._guiComponent.inspector.add(this, "_destroySceneOrGameObject", "destroy");
                    this._addToInspector(this._guiComponent.inspector);

                    // Update components.
                    for (const component of sceneOrGameObject.components) {
                        const folder = this._guiComponent.inspector.addFolder(component.uuid, egret.getQualifiedClassName(component));
                        folder.instance = component;
                        this._inspectorFolders[component.uuid] = folder;
                        this._addToInspector(folder);
                    }
                }
            }
            else {
                for (const k in this._inspectorFolders) {
                    delete this._inspectorFolders[k];
                }

                if (this._guiComponent.inspector.__controllers) {
                    for (const controller of this._guiComponent.inspector.__controllers.concat()) {
                        this._guiComponent.inspector.remove(controller);
                    }
                }

                if (this._guiComponent.inspector.__folders) {
                    for (const k in this._guiComponent.inspector.__folders) {
                        this._guiComponent.inspector.removeFolder(this._guiComponent.inspector.__folders[k]);
                    }
                }
            }
        }

        private _addToHierarchy(gameObject: GameObject) {
            if (
                gameObject.uuid in this._hierarchyFolders ||
                gameObject.tag === paper.DefaultTags.EditorOnly ||
                gameObject.hideFlags === paper.HideFlags.Hide ||
                gameObject.hideFlags === paper.HideFlags.HideAndDontSave
            ) {
                return;
            }

            let parentFolder = this._hierarchyFolders[gameObject.transform.parent ? gameObject.transform.parent.gameObject.uuid : gameObject.scene.uuid];
            if (!parentFolder) {
                if (gameObject.transform.parent) {
                    throw new Error(); // Never.
                }

                parentFolder = this._guiComponent.hierarchy.addFolder(gameObject.scene.uuid, gameObject.scene.name + " <Scene>");
                parentFolder.instance = gameObject.scene;
                parentFolder.onClick = this._nodeClickHandler;
                this._hierarchyFolders[gameObject.scene.uuid] = parentFolder;
            }

            const folder = parentFolder.addFolder(gameObject.uuid, gameObject.name);
            folder.instance = gameObject;
            folder.onClick = this._nodeClickHandler;
            this._hierarchyFolders[gameObject.uuid] = folder;
        }

        private _addToInspector(gui: dat.GUI) {
            const infos = editor.getEditInfo(gui.instance);
            let guiControllerA: dat.GUIController;
            let guiControllerB: dat.GUIController;
            let guiControllerC: dat.GUIController;

            for (const info of infos) {
                switch (info.editType) {
                    case editor.EditType.UINT:
                        guiControllerA = this._guiComponent.inspector.add(gui.instance, info.name).min(0).step(1).listen();

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
                        guiControllerA = this._guiComponent.inspector.add(gui.instance, info.name).step(1).listen();

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
                        guiControllerA = this._guiComponent.inspector.add(gui.instance, info.name).step(0.1).listen();

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
                        this._guiComponent.inspector.add(gui.instance, info.name).listen();
                        break;

                    case editor.EditType.LIST:
                        this._guiComponent.inspector.add(gui.instance, info.name, info.option.listItems).listen();
                        break;

                    case editor.EditType.VECTOR2: {
                        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                        if (descriptor) {
                            if (descriptor.get && descriptor.set) {
                                const onChange = () => {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA = this._guiComponent.inspector.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                                guiControllerB = this._guiComponent.inspector.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                            }
                            else {
                                guiControllerA = this._guiComponent.inspector.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                                guiControllerB = this._guiComponent.inspector.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                            }
                        }
                        break;
                    }

                    case editor.EditType.VECTOR3: {
                        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                        if (descriptor) {
                            if (descriptor.get && descriptor.set) {
                                const onChange = () => {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA = this._guiComponent.inspector.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                                guiControllerB = this._guiComponent.inspector.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                                guiControllerC = this._guiComponent.inspector.add(gui.instance[info.name], "z", `${info.name}: z`).step(0.1).listen();
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                                guiControllerC.onChange(onChange);
                            }
                            else {
                                guiControllerA = this._guiComponent.inspector.add(gui.instance[info.name], "x", `${info.name}: x`).step(0.1).listen();
                                guiControllerB = this._guiComponent.inspector.add(gui.instance[info.name], "y", `${info.name}: y`).step(0.1).listen();
                                guiControllerC = this._guiComponent.inspector.add(gui.instance[info.name], "z", `${info.name}: z`).step(0.1).listen();
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
                        }
                        break;
                    }

                    case editor.EditType.VECTOR4:
                    case editor.EditType.QUATERNION:
                        break;

                    case editor.EditType.COLOR: {
                        // TODO
                        // const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(gui.instance), info.name);
                        // if (descriptor) {
                        //     if (descriptor.get && descriptor.set) {
                        //         const onChange = () => {
                        //             gui.instance[info.name] = gui.instance[info.name];
                        //         };
                        //         // this._gameObject.add(gui.instance[info.name], "r", `${info.name}: x`).onChange(onChange);
                        //         // this._gameObject.add(gui.instance[info.name], "g", `${info.name}: y`).onChange(onChange);
                        //         // this._gameObject.add(gui.instance[info.name], "b", `${info.name}: z`).onChange(onChange);
                        //     }
                        //     else {
                        //         // this._gameObject.add(gui.instance[info.name], "x", `${info.name}: x`);
                        //         // this._gameObject.add(gui.instance[info.name], "y", `${info.name}: y`);
                        //         // this._gameObject.add(gui.instance[info.name], "z", `${info.name}: z`);
                        //     }
                        // }
                        break;
                    }

                    case editor.EditType.RECT:
                        break;

                    case editor.EditType.GAMEOBJECT:
                        break;
                }
            }
        }

        public onAwake() {
        }

        public onEnable() {
            EventPool.addEventListener(GUIComponentEvent.SceneSelected, GUIComponent, this._sceneSelectedHandler);
            EventPool.addEventListener(GUIComponentEvent.SceneUnselected, GUIComponent, this._sceneUnselectedHandler);
            EventPool.addEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._gameObjectSelectedHandler);
            EventPool.addEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._gameObjectUnselectedHandler);
            // TODO
            this.onAddGameObject(paper.GameObject.globalGameObject, this._groups[0]);

            for (const gameObject of this._groups[0].gameObjects) {
                this._addToHierarchy(gameObject);
            }
        }

        public onAddGameObject(gameObject: GameObject, _group: GameObjectGroup) {
            this._addToHierarchy(gameObject);
        }

        public onUpdate(dt: number) {
            this._guiComponent.inspector.updateDisplay();

            if (this._guiComponent.inspector.__folders) {
                for (const k in this._guiComponent.inspector.__folders) {
                    this._guiComponent.inspector.__folders[k].updateDisplay();
                }
            }

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
            }
        }

        public onDisable() {
            EventPool.removeEventListener(GUIComponentEvent.SceneSelected, GUIComponent, this._sceneSelectedHandler);
            EventPool.removeEventListener(GUIComponentEvent.SceneUnselected, GUIComponent, this._sceneUnselectedHandler);
            EventPool.removeEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._gameObjectSelectedHandler);
            EventPool.removeEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._gameObjectUnselectedHandler);
            //
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
        }
    }
}