namespace paper {
    /**
     * 应用程序。
     */
    export class ECS {
        private static _instance: ECS | null = null;
        /**
         * 应用程序单例。
         */
        public static getInstance(): ECS {
            if (!this._instance) {
                this._instance = new ECS();
            }

            return this._instance;
        }
        /**
         * 当应用程序的播放模式改变时派发事件。
         */
        public readonly onPlayerModeChange: signals.Signal<PlayerMode> = new signals.Signal();
        /**
         * 引擎版本。
         */
        public readonly version: string = "1.4.0.001";
        /**
         * 系统管理器。
         */
        public readonly systemManager: SystemManager = SystemManager.getInstance();
        /**
         * 场景管理器。
         */
        public readonly sceneManager: SceneManager = SceneManager.getInstance();
        /**
         * 
         */
        public readonly gameObjectContext: Context<GameObject> = Context.create(GameObject);

        private _isFocused: boolean = false;
        private _isRunning: boolean = false;
        private _playerMode: PlayerMode = PlayerMode.Player;

        private _bindUpdate: FrameRequestCallback | null = null;

        private constructor() {
        }

        private _update() {
            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate!);
            }

            if (clock) {
                clock.update();
                this.systemManager.update(clock.updateEnabled, clock.fixedUpdateEnabled);
            }
        }
        /**
         * 
         */
        public initialize(options: RunOptions): void {
            this._playerMode = options.playerMode || PlayerMode.Player;

            const { systemManager, gameObjectContext } = this;
            systemManager.register(EnableSystem, gameObjectContext, SystemOrder.Enable);
            systemManager.register(StartSystem, gameObjectContext, SystemOrder.Start);
            systemManager.register(FixedUpdateSystem, gameObjectContext, SystemOrder.FixedUpdate);
            systemManager.register(UpdateSystem, gameObjectContext, SystemOrder.Update);
            systemManager.register(LateUpdateSystem, gameObjectContext, SystemOrder.LateUpdate);
            systemManager.register(DisableSystem, gameObjectContext, SystemOrder.Disable);
            systemManager.preRegisterSystems();

            this.resume();
        }
        /**
         * TODO
         * @internal
         */
        public pause(): void {
            this._isRunning = false;
        }
        /**
         * TODO
         * @internal
         */
        public resume(): void {
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
         * 
         */
        public get isMobile(): boolean {
            const userAgent = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : "";
            return userAgent.indexOf("mobile") >= 0 || userAgent.indexOf("android") >= 0;
        }
        /**
         * TODO
         * @internal
         */
        public get isFocused(): boolean {
            return this._isFocused;
        }
        /**
         * TODO
         * @internal
         */
        public get isRunning(): boolean {
            return this._isRunning;
        }
        /**
         * 运行模式。
         */
        public get playerMode(): PlayerMode {
            return this._playerMode;
        }
        public set playerMode(value: PlayerMode) {
            if (this._playerMode === value) {
                return;
            }

            this._playerMode = value;
            this.onPlayerModeChange.dispatch(this.playerMode);
        }
    }
    /**
     * 应用程序单例。
     */
    export const Application = ECS.getInstance();
}
