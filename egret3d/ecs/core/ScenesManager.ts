namespace paper {
    /**
     * 场景管理器
     */
    export class SceneManager {
        private static _instance: SceneManager | null = null;
        public static getInstance() {
            if (!this._instance) {
                this._instance = new SceneManager();
            }

            return this._instance;
        }

        private constructor() {
        }

        /**
         * 
         */
        public camerasScene: Scene | null = null;
        /**
         * 
         */
        public lightsScene: Scene | null = null;

        private readonly _scenes: Scene[] = [];
        private _globalScene: Scene | null = null;
        private _editorScene: Scene | null = null;
        private _globalGameObject: GameObject | null = null;
        /**
         * @internal
         */
        public _addScene(scene: Scene, isActive: boolean) {
            if (this._scenes.indexOf(scene) < 0) {
                if (isActive) {
                    this._scenes.unshift(scene);
                }
                else {
                    this._scenes.push(scene);
                }
            }
            else {
                console.debug("Add the scene again.", scene.name);
            }
        }
        /**
         * 创建一个空场景并激活 
         */
        public createScene(name: string, isActive: boolean = true) {
            const scene = new Scene(isActive);
            scene.name = name;

            return scene;
        }
        /**
         * 加载场景
         * @param resourceName 资源名称
         */
        public loadScene(resourceName: string, combineStaticObjects: boolean = true) {
            const rawScene = RES.getRes(resourceName) as RawScene;
            if (rawScene) {
                const scene = rawScene.createInstance();

                if (scene) {
                    if (combineStaticObjects && Application.isPlaying) {
                        egret3d.combine(scene.gameObjects);
                    }

                    return scene;
                }
            }

            return null;
        }
        /**
         * 卸载指定场景。
         */
        public unloadScene(scene: Scene) {
            if (
                scene === this._globalScene ||
                scene === this._editorScene
            ) {
                console.warn("Cannot unload global scene.");
                return;
            }

            const index = this._scenes.indexOf(scene);
            if (index >= 0) {
                scene._destroy();
                this._scenes.splice(index, 1);
            }
        }
        /**
         * 卸载所有场景。
         */
        public unloadAllScene(excludes?: ReadonlyArray<Scene>) {
            let i = this._scenes.length;
            while (i--) {
                const scene = this._scenes[i];

                if (excludes && excludes.indexOf(scene) >= 0) {
                    continue;
                }

                this.unloadScene(scene);
            }
        }
        /**
         * 
         */
        public getSceneByName(name: string) {
            for (const scene of this._scenes) {
                if (scene.name === name) {
                    return scene;
                }
            }

            return null;
        }
        /**
         * 
         */
        public get scenes(): ReadonlyArray<Scene> {
            return this._scenes;
        }
        /**
         * 
         */
        public get globalScene() {
            if (!this._globalScene) {
                this._globalScene = this.createScene(DefaultTags.Global, false);
                this._scenes.pop(); // Remove global scene from scenes.
            }

            return this._globalScene;
        }
        /**
         * 当前激活的场景。
         */
        public get activeScene() {
            if (this._scenes.length === 0) {
                this.createScene("default");
            }

            return this._scenes[0];
        }
        public set activeScene(value: Scene) {
            if (
                this._scenes.length <= 1 ||
                this._scenes[0] === value ||
                this._globalScene === value || // Cannot active global scene.
                this._editorScene === value // Cannot active editor scene.
            ) {
                return;
            }

            const index = this._scenes.indexOf(value);
            if (index >= 0) {
                this._scenes.splice(index, 1);
                this._scenes.unshift(value);
            }
            else {
                console.debug("Active scene error.", value.name);
            }
        }
        /**
         * 
         */
        public get editorScene() {
            if (!this._editorScene) {
                this._editorScene = this.createScene(DefaultTags.EditorOnly, false);
                this._scenes.pop(); // Remove editor scene from scenes.
            }

            return this._editorScene;
        }
        /**
         * 
         */
        public get globalGameObject() {
            if (!this._globalGameObject) {
                this._globalGameObject = GameObject.create(DefaultTags.Global, DefaultTags.Global, this.globalScene);
                this._globalGameObject.dontDestroy = true;
            }

            return this._globalGameObject;
        }

        /**
         * @deprecated
         */
        public getActiveScene() {
            return this.activeScene;
        }
    }
}