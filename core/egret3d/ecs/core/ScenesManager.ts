namespace paper {
    /**
     * 程序场景管理器。
     */
    export class SceneManager {
        private static _instance: SceneManager | null = null;
        /**
         * 场景管理器单例。
         */
        public static getInstance(): SceneManager {
            if (!this._instance) {
                this._instance = new SceneManager() as any;
            }

            return this._instance as any;
        }
        /**
         * 
         */
        public readonly onSceneCreated: signals.Signal<[Scene, boolean]> = new signals.Signal();
        /**
         * 
         */
        public readonly onSceneDestroy: signals.Signal<Scene> = new signals.Signal();
        /**
         * 
         */
        public readonly onSceneDestroyed: signals.Signal<Scene> = new signals.Signal();

        private readonly _scenes: Scene[] = [];
        private _globalEntity: IEntity | null = null;
        private _globalScene: Scene | null = null;
        private _editorScene: Scene | null = null;

        private constructor() {
            this.onSceneCreated.add(this._addScene, this);
            this.onSceneDestroyed.add(this._removeScene, this);
        }

        private _addScene([scene, isActive]: [Scene, boolean]) {
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

        private _removeScene(scene: Scene) {
            const scenes = this._scenes;
            const index = scenes.indexOf(scene);

            if (index >= 0) {
                scenes.splice(index, 1);
            }
            else if (DEBUG) {
                console.error("Remove scene error.");
            }
        }

        public createScene(name: string, isActive: boolean = true): Scene {
            return Scene.createEmpty(name, isActive);
        }
        /**
         * 卸载程序中的全部场景。
         * - 不包含全局场景。
         */
        public destroyAllScene(excludes?: ReadonlyArray<Scene>): void {
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
        public getScene(name: string): Scene | null {
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
        public get scenes(): ReadonlyArray<Scene> {
            return this._scenes;
        }
        /**
         * 
         */
        public get globalEntity(): IEntity {
            if (!this._globalEntity) {
                this._globalEntity = GameObject.create(DefaultNames.Global, DefaultTags.Global, this.globalScene);
                this._globalEntity.dontDestroy = true;
            }

            return this._globalEntity as GameObject;
        }
        /**
         * 全局场景。
         * - 全局场景无法被销毁。
         */
        public get globalScene(): Scene {
            if (!this._globalScene) {
                this._globalScene = this.createScene(DefaultNames.Global, false);
                this._scenes.pop(); // Remove global scene from scenes.
            }

            return this._globalScene;
        }
        /**
         * 全局编辑器场景。
         * - 全局编辑器场景无法被销毁。
         */
        public get editorScene(): Scene {
            if (!this._editorScene) {
                this._editorScene = this.createScene(DefaultNames.Editor, false);
                this._scenes.pop(); // Remove editor scene from scenes.
            }

            return this._editorScene;
        }
        /**
         * 当前激活的场景。
         */
        public get activeScene(): Scene {
            const scenes = this._scenes;

            if (scenes.length === 0) {
                this.createScene(DefaultNames.NoName);
            }

            return scenes[0];
        }
        public set activeScene(value: Scene) {
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
        public unloadAllScene(excludes?: ReadonlyArray<Scene>) {
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