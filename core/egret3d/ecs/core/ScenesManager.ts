namespace paper {
    /**
     * 程序场景管理器。
     */
    export class SceneManager {
        private static _instance: SceneManager | null = null;
        /**
         * 场景管理器单例。
         */
        public static getInstance() {
            if (!this._instance) {
                this._instance = new SceneManager();
            }

            return this._instance;
        }
        /**
         * 
         */
        public readonly onSceneCreated: signals.Signal<[IScene, boolean]> = new signals.Signal();
        /**
         * 
         */
        public readonly onSceneDestroy: signals.Signal<IScene> = new signals.Signal();
        /**
         * 
         */
        public readonly onSceneDestroyed: signals.Signal<IScene> = new signals.Signal();

        private readonly _scenes: IScene[] = [];
        private _globalScene: IScene | null = null;
        private _editorScene: IScene | null = null;

        private constructor() {
            this.onSceneCreated.add(this._addScene);
            this.onSceneDestroyed.add(this._removeScene);
        }

        private _addScene([scene, isActive]: [IScene, boolean]) {
            const scenes = this._scenes;

            if (scenes.indexOf(scene) < 0) {
                if (isActive) {
                    scenes.unshift(scene);
                }
                else {
                    scenes.push(scene);
                }
            }
            else if (DEBUG) {
                console.error("Add scene error.");
            }
        }

        private _removeScene(scene: IScene) {
            const scenes = this._scenes;
            const index = scenes.indexOf(scene);

            if (index >= 0) {
                scenes.splice(index, 1);
            }
            else if (DEBUG) {
                console.error("Remove scene error.");
            }
        }

        public createScene(name: string, isActive: boolean = true) {
            return Scene.createEmpty(name);
        }
        /**
         * 卸载程序中的全部场景。
         * - 不包含全局场景。
         */
        public destroyAllScene(excludes?: ReadonlyArray<IScene>): void {
            const scenes = this._scenes;

            let i = scenes.length;
            while (i--) {
                const scene = scenes[i];

                if (excludes && excludes.indexOf(scene) >= 0) {
                    continue;
                }

                if (scene === this._globalScene || scene === this._editorScene) {
                    continue;
                }

                scene.destroy();
            }
        }
        /**
         * 从程序已创建的全部场景中获取指定名称的场景。
         */
        public getScene(name: string): IScene | null {
            for (const scene of this._scenes) {
                if (scene.name === name) {
                    return scene;
                }
            }

            return null;
        }
        /**
         * 程序已创建的全部动态场景。
         */
        public get scenes(): ReadonlyArray<IScene> {
            return this._scenes;
        }
        /**
         * 全局场景。
         * - 全局场景无法被销毁。
         */
        public get globalScene(): IScene {
            if (!this._globalScene) {
                this._globalScene = Scene.createEmpty(DefaultNames.Global, false);
                this._scenes.pop(); // Remove global scene from scenes.
            }

            return this._globalScene;
        }
        /**
         * 全局编辑器场景。
         * - 全局编辑器场景无法被销毁。
         */
        public get editorScene(): IScene {
            if (!this._editorScene) {
                this._editorScene = Scene.createEmpty(DefaultNames.Editor, false);
                this._scenes.pop(); // Remove editor scene from scenes.
            }

            return this._editorScene;
        }
        /**
         * 当前激活的场景。
         */
        public get activeScene(): IScene {
            const scenes = this._scenes;

            if (scenes.length === 0) {
                Scene.createEmpty();
            }

            return scenes[0];
        }
        public set activeScene(value: IScene) {
            const scenes = this._scenes;
            if (
                scenes.length <= 1 ||
                scenes[0] === value ||
                this._globalScene === value || // Cannot active global scene.
                this._editorScene === value // Cannot active editor scene.
            ) {
                return;
            }

            const index = scenes.indexOf(value);

            if (index >= 0) {
                scenes.splice(index, 1);
                scenes.unshift(value);
            }
            else if (DEBUG) {
                console.error("Active scene error.");
            }
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
        public unloadAllScene(excludes?: ReadonlyArray<IScene>) {
            this.destroyAllScene(excludes);
        }
        /**
         * @deprecated
         */
        public getActiveScene() {
            return this.activeScene;
        }
    }
}