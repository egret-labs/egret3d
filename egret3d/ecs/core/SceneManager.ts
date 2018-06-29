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

        private readonly _scenes: Scene[] = [];
        private _globalScene: Scene | null = null;
        private _globalGameObject: GameObject | null = null;
        /**
         * @internal
         */
        public _addScene(scene: Scene) {
            if (this._scenes.indexOf(scene) < 0) {
                this._scenes.unshift(scene);
            }
            else {
                console.debug("Add the scene again.", scene.name);
            }
        }
        /**
         * 创建一个空场景并激活 
         */
        public createScene(name: string) {
            const scene = new Scene();
            scene.name = name;
            scene.rawScene = null as any; // 保存的话需要设置一个对应的RawScene文件

            return scene;
        }
        /**
         * load scene 加载场景
         * @param rawScene url
         */
        public loadScene(url: string) {
            const rawScene = Asset.find<egret3d.RawScene>(url);
            if (rawScene) {
                const scene = rawScene.createInstance();

                if (scene) {
                    scene.rawScene = rawScene;

                    if (Application.isPlaying) {
                        egret3d.autoCombine(scene);
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
            if (scene === this._globalScene) {
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
        public unloadAllScene() {
            for (const scene of this._scenes) {
                scene._destroy();
            }

            this._scenes.length = 0;
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
        public getSceneByURL(url: string) {
            for (const scene of this._scenes) {
                if (scene.rawScene && scene.rawScene.url === url) {
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
                this._globalScene = new Scene(); // Global scene are not added to the scenes.
                this._globalScene.name = "global";
            }

            return this._globalScene;
        }
        /**
         * 
         */
        public get globalGameObject() {
            if (!this._globalGameObject) {
                this._globalGameObject = new GameObject("global", "global");
                this._globalGameObject.dontDestroy = true;
            }

            return this._globalGameObject;
        }
        /**
         * 获取当前激活的场景
         */
        public get activeScene() {
            if (this._scenes.length < 1) {
                this.createScene("default");
            }

            return this._scenes[0];
        }
        public set activeScene(value: Scene) {
            if (this._scenes.length <= 1 || this._scenes[0] === value) {
                return;
            }

            const index = this._scenes.indexOf(value);
            if (index >= 0) {
                this._scenes.splice(index, 1);
                this._scenes.unshift(value);
            }
            else {
                console.debug("Active scene error.", value.name, value.uuid);
            }
        }

        /**
         * @deprecated
         */
        public getActiveScene() {
            return this.activeScene;
        }
    }
}