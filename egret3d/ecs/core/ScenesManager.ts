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
            if (this._scenes.indexOf(scene) >= 0) {
                console.debug("Add the scene again.", scene.name);
            }

            if (isActive) {
                this._scenes.unshift(scene);
            }
            else {
                this._scenes.push(scene);
            }
        }
        /**
         * @internal
         */
        public _removeScene(scene: Scene) {
            if (
                scene === this._globalScene ||
                scene === this._editorScene
            ) {
                console.warn("Cannot dispose global scene.");
                return false;
            }

            const index = this._scenes.indexOf(scene);

            if (index < 0) {
                console.debug("Remove scene error.", scene.name);
                return false;
            }

            this._scenes.splice(index, 1);
            return true;
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

                scene.destroy();
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
                this._globalScene = Scene.createEmpty(DefaultNames.Global, false);
                this._scenes.pop(); // Remove global scene from scenes.
            }

            return this._globalScene;
        }
        /**
         * 当前激活的场景。
         */
        public get activeScene() {
            if (this._scenes.length === 0) {
                Scene.createEmpty();
            }

            return this._scenes[0];
        }
        public set activeScene(value: Scene) {
            if (
                this._scenes.length <= 1 ||
                this._scenes[0] === value ||
                this._globalScene === value //|| // Cannot active global scene.
                // this._editorScene === value // Cannot active editor scene. TODO
            ) {
                return;
            }

            const index = this._scenes.indexOf(value);

            if (index < 0) {
                console.debug("Active scene error.", value.name);
            }

            this._scenes.splice(index, 1);
            this._scenes.unshift(value);
        }
        /**
         * 
         */
        public get editorScene() {
            if (!this._editorScene) {
                this._editorScene = Scene.createEmpty(DefaultNames.Editor, false);
                this._scenes.pop(); // Remove editor scene from scenes.
            }

            return this._editorScene;
        }
        /**
         * 
         */
        public get globalGameObject() {
            if (!this._globalGameObject) {
                this._globalGameObject = GameObject.create(DefaultNames.Global, DefaultTags.Global, this.globalScene);
                this._globalGameObject.dontDestroy = true;
            }

            return this._globalGameObject;
        }

        /**
         * @deprecated
         */
        public createScene(name: string, isActive: boolean = true) {
            return Scene.createEmpty(name, isActive);
        }
        /**
         * @deprecated
         */
        public loadScene(resourceName: string, combineStaticObjects: boolean = true) {
            return Scene.create(resourceName, combineStaticObjects);
        }
        /**
         * @deprecated
         */
        public unloadScene(scene: Scene) {
            scene.destroy();
        }
        /**
         * @deprecated
         */
        public getActiveScene() {
            return this.activeScene;
        }
    }
}