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

        private constructor() {
        }

        private readonly _scenes: Scene[] = [];
        private _globalScene: Scene | null = null;
        private _editorScene: Scene | null = null;
        /**
         * @internal
         */
        public addScene(scene: Scene, isActive: boolean) {
            if (this._scenes.indexOf(scene) >= 0) {
                console.warn("Add the scene again.", scene.name);
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
        public removeScene(scene: Scene) {
            if (
                scene === this._globalScene ||
                scene === this._editorScene
            ) {
                console.warn("Cannot dispose global scene.");
                return false;
            }

            const index = this._scenes.indexOf(scene);

            if (index < 0) {
                console.warn("Remove scene error.", scene.name);
                return false;
            }

            this._scenes.splice(index, 1);
            return true;
        }
        /**
         * 卸载程序中的全部场景。
         * - 不包含全局场景。
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
         * 从程序已创建的全部场景中获取指定名称的场景。
         */
        public getScene(name: string) {
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
         * 全局静态的场景。
         * - 全局场景无法被销毁。
         */
        public get globalScene() {
            if (!this._globalScene) {
                this._globalScene = Scene.createEmpty(DefaultNames.Global, false);
                this._scenes.pop(); // Remove global scene from scenes.
            }

            return this._globalScene;
        }
        /**
         * 全局静态编辑器的场景。
         */
        public get editorScene() {
            if (!this._editorScene) {
                this._editorScene = Scene.createEmpty(DefaultNames.Editor, false);
                this._scenes.pop(); // Remove editor scene from scenes.
            }

            return this._editorScene;
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
                console.warn("Active scene error.", value.name);
            }

            this._scenes.splice(index, 1);
            this._scenes.unshift(value);
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