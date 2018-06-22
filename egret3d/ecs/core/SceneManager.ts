namespace paper {
    /**
     * 场景管理器
     */
    export class SceneManager {
        private readonly _scenes: Scene[] = [];
        private readonly _globalObjects: GameObject[] = [];

        public _addScene(scene: Scene) {
            if (this._scenes.indexOf(scene) < 0) {
                this._scenes.unshift(scene);
            }
            else {
                console.warn("Add the scene again.", scene.name);
            }
        }

        /**
         * 创建一个空场景并激活 
         */
        public createScene(name: string) {
            let scene: Scene = new Scene();
            scene.name = name;
            scene.$rawScene = null as any; // 保存的话需要设置一个对应的RawScene文件

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
                    scene.$rawScene = rawScene;

                    if (paper.Application.isPlaying) {
                        egret3d.autoCombine();
                    }

                    return scene;
                }
            }

            return null;
        }

        /**
         * 卸载指定场景，如果创建列表为空，则创建一个空场景。
         */
        public unloadScene(scene: Scene) {
            const index = this._scenes.indexOf(scene);

            if (index >= 0) {
                scene.$destroy();
                this._scenes.splice(index, 1);
            }

            if (this._scenes.length === 0) {
                this.createScene("default");
            }
        }

        /**
         * 卸载所有场景，并创建一个默认场景。
         */
        public unloadAllScene() {
            for (const scene of this._scenes) {
                scene.$destroy();
            }

            this._scenes.length = 0;

            if (this._scenes.length === 0) {
                this.createScene("default");
            }
        }

        /**
         * 
         */
        public addGlobalObject(gameObject: GameObject) {
            if (this._globalObjects.indexOf(gameObject) >= 0) {
                console.warn("The game object has been added to globals.", gameObject.name, gameObject.hashCode);
                return;
            }

            this._globalObjects.push(gameObject);
        }

        /**
         * 
         */
        public removeGlobalObject(gameObject: GameObject) {
            const index = this._globalObjects.indexOf(gameObject);
            if (index < 0) {
                console.warn("The game object has been removed from globals.", gameObject.name, gameObject.hashCode);
                return;
            }

            this._globalObjects.splice(index, 1, gameObject);
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
                if (scene.$rawScene && scene.$rawScene.url === url) {
                    return scene;
                }
            }

            return null;
        }

        /**
         * 
         */
        public get globalObjects(): ReadonlyArray<GameObject> {
            return this._globalObjects;
        }

        /**
         * 获取当前激活的场景
         */
        public get activeScene() {
            return this._scenes[0];
        }

        /**
         * @deprecated
         */
        public getActiveScene() {
            return this._scenes[0];
        }
    }
}