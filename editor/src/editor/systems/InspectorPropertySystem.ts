namespace paper.editor {
    type ResData = { name: string, type: string, url: string, root: string };
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class InspectorPropertySystem extends BaseSystem<GameObject> {
        private readonly _modelComponent: ModelComponent = Application.sceneManager.globalEntity.getOrAddComponent(ModelComponent);
        private readonly _inspectorComponent: InspectorComponent = Application.sceneManager.globalEntity.getOrAddComponent(InspectorComponent);

        private _onComponentCreated([entity, component]: [IEntity, IComponent]) {
            const lastSelectedEntity = this.groups[0].singleEntity;

            if (lastSelectedEntity === entity && (component.hideFlags & HideFlags.Hide) === 0) {
                this._addComponent(component);
            }
        }

        private _onComponentDestroy([entity, component]: [IEntity, IComponent]) {
            const lastSelectedEntity = this.groups[0].singleEntity;

            if (lastSelectedEntity === entity && (component.hideFlags & HideFlags.Hide) === 0) {
                this._removeComponent(component);
            }
        }

        private _componentOrPropertyGUIClickHandler = (gui: dat.GUI) => {
            (window as any)["psc"] = (window as any)["epsc"] = gui.instance; // For quick debug.
        }

        private _addComponent(component: IComponent) {
            const { property, propertyItems } = this._inspectorComponent;

            if (!(component.uuid in propertyItems)) {
                const item = property.addFolder(component.uuid, egret.getQualifiedClassName(component));
                item.instance = component;
                item.open();

                propertyItems[component.uuid] = item;
                this._addToInspector(item);
            }
        }

        private _removeComponent(component: IComponent) {
            const { propertyItems } = this._inspectorComponent;

            if (component.uuid in propertyItems) {
                const item = propertyItems[component.uuid];
                delete propertyItems[component.uuid];

                if (item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }
        }

        private _saveSceneOrGameObject = () => {
            if (this._modelComponent.selectedScene) {
                const json = JSON.stringify(serialize(this._modelComponent.selectedScene));
                console.info(json);
            }
            else {
                const lastSelectedEntity = this.groups[0].singleEntity!;
                const json = JSON.stringify(serialize(lastSelectedEntity));
                console.info(json);
            }
        }

        private _destroySceneOrGameObject = () => {
            const selectedSceneOrGameObject = this._inspectorComponent.property.instance as Scene | GameObject;
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
            const property = this._inspectorComponent.property;
            property.instance = sceneOrGameObject;

            for (const k in this._inspectorComponent.propertyItems) {
                delete this._inspectorComponent.propertyItems[k];
            }

            if (property.__controllers) {
                for (const controller of property.__controllers.concat()) {
                    property.remove(controller);
                }
            }

            if (property.__folders) {
                for (const k in property.__folders) {
                    try {
                        property.removeFolder(property.__folders[k]);
                    }
                    catch (e) {
                    }
                }
            }

            const options = {
                scenes: "None",
                prefabs: "None",
            };

            property.add(options, "scenes", this._getAssets("Scene")).onChange(async (v: string | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v);
                Scene.activeScene.destroy();
                this._modelComponent.select(Scene.create(v));
            });

            property.add(options, "prefabs", this._getAssets("Prefab")).onChange(async (v: string | null) => {
                if (!v) {
                    return;
                }

                await RES.getResAsync(v);
                let gameObject: GameObject | null = null;
                // if (this._modelComponent.selectedGameObject) {
                //     const parent = this._modelComponent.selectedGameObject!;
                //     gameObject = Prefab.create(v, parent.scene!);
                //     gameObject!.parent = parent;
                // }
                // else {
                gameObject = Prefab.create(v, Scene.activeScene);
                // }

                this._modelComponent.select(gameObject);
            });

            if (sceneOrGameObject) {
                property.add(this, "destroy|_destroySceneOrGameObject");
                property.add(this, "save|_saveSceneOrGameObject");
                this._addToInspector(property);

                if (sceneOrGameObject instanceof Scene) { // Update scene.
                }
                else { // Update entity.
                    for (const component of sceneOrGameObject.components) {
                        if (component.hideFlags & HideFlags.Hide) {
                            continue;
                        }

                        const item = property.addFolder(component.uuid, egret.getQualifiedClassName(component));
                        item.instance = component;
                        item.open();
                        this._inspectorComponent.propertyItems[component.uuid] = item;
                        this._addToInspector(item);
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

            if (gui !== this._inspectorComponent.property) {
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
            if (parent !== this._inspectorComponent.property) {
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

                case editor.EditType.COMPONENT: {
                    parent.add(parent.instance, info.name, this._getComponentValue).listen();
                    break;
                }

                case editor.EditType.GAMEOBJECT: {
                    parent.add(parent.instance, info.name, this._getEntityValue).listen();
                    break;
                }

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

        private _getEntityValue(entity: IEntity | null) {
            return entity ? entity.name : "null";
        }

        private _getComponentValue(component: IComponent | null) {
            return component ? component.entity.name : "null";
        }

        private _addUniformItemToInspector(uniform: gltf.Uniform, parent: dat.GUI) {
            if (parent !== this._inspectorComponent.property) {
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
            if (gui !== this._inspectorComponent.property) {
                gui.onClick = this._componentOrPropertyGUIClickHandler;
            }

            switch (type) {
                case egret3d.Material: {
                    const materials = gui.instance as egret3d.Material[];
                    let index = 0;
                    for (const material of materials) {
                        const folder = gui.addFolder(`<${index++}> ${material.name || material.shader.name}`);
                        folder.instance = material;
                        this._addToInspector(folder);
                    }
                    break;
                }
            }
        }

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(false, LastSelectedFlag),
            ];
        }

        public onEnable() {
            Component.onComponentCreated.add(this._onComponentCreated, this);
            Component.onComponentDestroy.add(this._onComponentDestroy, this);
        }

        public onDisable() {
            Component.onComponentCreated.remove(this._onComponentCreated, this);
            Component.onComponentDestroy.remove(this._onComponentDestroy, this);

            const { propertyItems } = this._inspectorComponent;

            for (const k in propertyItems) {
                const item = propertyItems[k];
                delete propertyItems[k];

                if (item && item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[0]) {
                if (!this._modelComponent.selectedScene) {
                    this._selectSceneOrGameObject(null);
                }
            }
        }

        public onFrame() {
            const { property, propertyItems } = this._inspectorComponent;
            const isInspectorShowed = !property.closed && property.domElement.style.display !== "none";

            if (isInspectorShowed) {
                const selectedScene = this._modelComponent.selectedScene;
                const lastSelectedEntity = this.groups[0].singleEntity;

                if (selectedScene) {
                    if (selectedScene !== property.instance) {
                        this._selectSceneOrGameObject(selectedScene);
                    }
                }
                else if (lastSelectedEntity) {
                    if (lastSelectedEntity !== property.instance) {
                        this._selectSceneOrGameObject(lastSelectedEntity);
                    }

                    const { openedComponents } = this._modelComponent;

                    if (property.instance === lastSelectedEntity && openedComponents.length > 0) {
                        for (const k in propertyItems) {
                            propertyItems[k].close();
                        }

                        for (const componentClass of openedComponents) {
                            const component = lastSelectedEntity.getComponent(componentClass);

                            if (component && component.uuid in propertyItems) {
                                propertyItems[component.uuid].open();
                            }
                        }

                        openedComponents.length = 0;
                    }

                    lastSelectedEntity.transform.localEulerAngles; // TODO
                }
                else if (property.instance) {
                    this._selectSceneOrGameObject(null);
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
