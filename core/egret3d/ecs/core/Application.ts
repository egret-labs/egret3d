namespace paper {
    /**
     * 应用程序运行模式。
     */
    export const enum PlayerMode {
        Player,
        DebugPlayer,
        Editor,
    }
    /**
     * 应用程序单例。
     */
    export let Application: ECS;
    /**
     * 应用程序。
     */
    export class ECS {
        private static _instance: ECS | null = null;
        /**
         * 应用程序单例。
         */
        public static getInstance() {
            if (!this._instance) {
                this._instance = new ECS();
            }

            return this._instance;
        }

        private constructor() {
        }
        /**
         * 引擎版本。
         */
        public readonly version: string = "1.2.0.001";
        /**
         * 系统管理器。
         */
        public readonly systemManager: SystemManager = SystemManager.getInstance();
        /**
         * 场景管理器。
         */
        public readonly sceneManager: SceneManager = SceneManager.getInstance();

        private _isFocused = false;
        private _isRunning = false;
        private _playerMode: PlayerMode = PlayerMode.Player;
        private _bindUpdate: FrameRequestCallback | null = null;

        private _update() {
            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate!);
            }

            Time && Time.update();
            GameObjectGroup.update();
            this.systemManager._update();
        }

        private _updatePlayerMode() {
            // if (this._playerMode !== PlayerMode.Player) { TODO
            //     egret3d.Camera.editor; // Active editor camera.
            // }

        }
        /**
         * @internal
         */
        public init(options: egret3d.RunEgretOptions) {
            this._playerMode = options.playerMode || PlayerMode.Player;
            this.systemManager.register(paper.EnableSystem, paper.SystemOrder.Enable);
            this.systemManager.register(paper.StartSystem, paper.SystemOrder.Start);
            this.systemManager.register(paper.FixedUpdateSystem, paper.SystemOrder.FixedUpdate);
            this.systemManager.register(paper.UpdateSystem, paper.SystemOrder.Update);
            this.systemManager.register(paper.LateUpdateSystem, paper.SystemOrder.LaterUpdate);
            this.systemManager.register(paper.DisableSystem, paper.SystemOrder.Disable);
            this._updatePlayerMode();
            this.resume();
        }
        /**
         * TODO
         * @internal
         */
        public pause() {
            this._isRunning = false;
        }
        /**
         * TODO
         * @internal
         */
        public resume() {
            if (this._isRunning) {
                return;
            }

            this._isRunning = true;

            if (!this._bindUpdate) {
                this._bindUpdate = this._update.bind(this);
            }

            this._update();
        }
        /**
         * TODO
         * @internal
         */
        public get isFocused() {
            return this._isFocused;
        }
        /**
         * TODO
         * @internal
         */
        public get isRunning() {
            return this._isRunning;
        }
        /**
         * 运行模式。
         */
        public get playerMode() {
            return this._playerMode;
        }
        public set playerMode(value: PlayerMode) {
            if (this._playerMode === value) {
                return;
            }

            this._playerMode = value;
        }
    }
    //
    Application = ECS.getInstance();
}
