namespace paper {
    /**
     * 场景管理器
     */
    export class SceneManager {
        private _globalScene: Scene | null = null;
        private readonly _scenes: Scene[] = [];

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
        }

        /**
         * 卸载所有场景，并创建一个默认场景。
         */
        public unloadAllScene() {
            for (const scene of this._scenes) {
                scene.$destroy();
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
                if (scene.$rawScene && scene.$rawScene.url === url) {
                    return scene;
                }
            }

            return null;
        }

        /**
         * 
         */
        public get globalScene() {
            if (!this._globalScene) {
                this._globalScene = this.createScene("global");
            }

            return this._globalScene;
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

        /**
         * @deprecated
         */
        public getActiveScene() {
            return this.activeScene;
        }
    }
}