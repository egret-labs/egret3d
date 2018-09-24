namespace paper.debug {
    /**
     * 
     */
    export const enum GUIComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectHovered = "GameObjectHovered",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
        /**
         * 所有选中的实体。
         */
        public readonly selectedGameObjects: GameObject[] = [];
        /**
         * 选中的场景。
         */
        public selectedScene: Scene | null = null;
        /**
         * 
         */
        public hoverGameObject: GameObject | null = null;
        /**
         * 最后一个选中的实体。
         */
        public selectedGameObject: GameObject | null = null;

        public initialize() {
            super.initialize();

            // const guiSceneSystem = Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
            const sceneOptions = {
                    debug: false,
                    assets: () => {
                        const assets = paper.Asset["_assets"] as any;
                        const assetNames = [];

                        for (const k in assets) {
                            if (k.indexOf("builtin") >= 0) {
                                continue;
                            }

                            assetNames.push(k);

                            if (assets[k] instanceof egret3d.Texture) {
                                assetNames.push(k.replace(".image.json", ".png"));
                                assetNames.push(k.replace(".image.json", ".jpg"));
                            }
                        }

                        console.info(JSON.stringify(assetNames));
                    }
                };

                this.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
                    const guiSceneSystem = Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
                    const guiSystem = Application.systemManager.getOrRegisterSystem(debug.GUISystem);

                    if (v) {
                        Application.playerMode = PlayerMode.DebugPlayer;
                        guiSceneSystem.enabled = true;
                        guiSystem.enabled = true;
                    }
                    else {
                        this.select(null);

                        Application.playerMode = PlayerMode.Player;
                        guiSceneSystem.enabled = false;
                        guiSystem.enabled = false;

                        this.selectedGameObjects.length = 0;
                        this.selectedScene = null;
                        this.hoverGameObject = null;
                        this.selectedGameObject = null;
                    }
                });
                this.hierarchy.add(sceneOptions, "assets");
                this.hierarchy.close();
        }

        public select(value: Scene | GameObject | null, isReplace?: boolean) {
            if (value) {
                if (value instanceof Scene) {
                    if (this.selectedScene === value) {
                        return;
                    }
                }
                else if (
                    this.selectedGameObject === value ||
                    this.selectedGameObjects.indexOf(value) >= 0
                ) {
                    return;
                }
            }

            if (!value || value instanceof Scene || this.selectedScene) {
                isReplace = true;
            }

            if (isReplace) {
                if (this.selectedScene) {
                    const selectedScene = this.selectedScene;
                    this.selectedScene = null;
                    EventPool.dispatchEvent(GUIComponentEvent.SceneUnselected, this, selectedScene);
                }
                else if (this.selectedGameObjects.length > 0) {
                    const gameObjects = this.selectedGameObjects.concat();
                    this.selectedGameObjects.length = 0;
                    this.selectedGameObject = null;

                    for (const gameObject of gameObjects) {
                        EventPool.dispatchEvent(GUIComponentEvent.GameObjectUnselected, this, gameObject);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    this.selectedScene = value;
                    EventPool.dispatchEvent(GUIComponentEvent.SceneSelected, this, value);
                }
                else {
                    this.selectedGameObjects.push(value);
                    this.selectedGameObject = value;
                    EventPool.dispatchEvent(GUIComponentEvent.GameObjectSelected, this, value);
                }
            }

            (global || window)["psgo"] = value; // For quick debug.
        }

        public unselect(value: Scene | GameObject) {
            if (value instanceof Scene) {
                if (this.selectedScene === value) {
                    this.selectedScene = null;
                    EventPool.dispatchEvent(GUIComponentEvent.SceneUnselected, this, value);
                }
            }
            else {
                const index = this.selectedGameObjects.indexOf(value);
                if (index >= 0) {
                    if (this.selectedGameObject === value) {
                        this.selectedGameObject = null;
                    }

                    this.selectedGameObjects.splice(index, 1);
                    EventPool.dispatchEvent(GUIComponentEvent.GameObjectUnselected, this, value);
                }
            }
        }

        public hover(value: GameObject | null) {
            if (this.hoverGameObject === value) {
                return;
            }

            this.hoverGameObject = value;
            EventPool.dispatchEvent(GUIComponentEvent.GameObjectHovered, this, this.hoverGameObject);
        }
    }
    // 
    // setTimeout(() => {
    //     GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
    // }, 1000);
    if (dat) {
        GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);        
    }
}