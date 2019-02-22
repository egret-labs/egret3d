namespace paper.editor {
    type ResData = { name: string, type: string, url: string, root: string };
    /**
     * @internal
     */
    export class InspectorSystem extends BaseSystem<GameObject> {
        private readonly _modelComponent: ModelComponent = Application.sceneManager.globalEntity.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = Application.sceneManager.globalEntity.getOrAddComponent(GUIComponent);

        private _onComponentCreated([entity, component]: [IEntity, IComponent]) {
            if (entity !== this._modelComponent.selectedGameObject) {
                return;
            }
        }

        private _onComponentDestroy([entity, component]: [IEntity, IComponent]) {
            if (entity !== this._modelComponent.selectedGameObject) {
                return;
            }

            const intem = this._guiComponent.inspectorItems[component.uuid];
            delete this._guiComponent.inspectorItems[component.uuid];

            if (intem && intem.parent) {
                try {
                    intem.parent.removeFolder(intem);
                }
                catch (e) {
                }
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
                inspector.add(this, "destroy|_destroySceneOrGameObject");
                inspector.add(this, "save|_saveSceneOrGameObject");
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
        }

        public onEnable() {
            Component.onComponentCreated.add(this._onComponentCreated, this);
            Component.onComponentDestroy.add(this._onComponentDestroy, this);

            ModelComponent.onSceneSelected.add(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.add(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectedChange, this);

            this._modelComponent.select(Scene.activeScene);
        }

        public onDisable() {
            Application.systemManager.getSystem(HierarchySystem)!.enabled = false;

            Component.onComponentCreated.remove(this._onComponentCreated, this);
            Component.onComponentDestroy.remove(this._onComponentDestroy, this);

            ModelComponent.onSceneSelected.remove(this._onSceneSelected, this);
            ModelComponent.onSceneUnselected.remove(this._onSceneUnselected, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectedChange, this);

            const { inspectorItems } = this._guiComponent;

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
        }

        public onUpdate() {
            const isInspectorShowed = !this._guiComponent.inspector.closed && this._guiComponent.inspector.domElement.style.display !== "none";

            this._modelComponent.update(); // TODO

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
