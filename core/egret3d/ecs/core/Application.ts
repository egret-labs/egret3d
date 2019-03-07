namespace paper {
    /**
     * 应用程序。
     * 
     * ### 自动刷新和被动刷新
     * 
     * 默认情况下
     * 
     * - 自动刷新: 会以无限循环方式刷新, `PlayerMode.Player` 模式默认为自动刷新
     * - 被动刷新: 不会启动循环, 需要刷新时需调用 `update()` 方法, `PlayerMode.Editor` 模式为被动刷新
     * 
     * 在运行过程中可随时调用 `resume()` 切换到自动刷新, 或者调用 `pause()` 切换为被动刷新
     * 
     * ### 限制帧频
     * 
     * - 通过设置 `clock.frameInterval` 来设置渲染帧间隔(秒)
     * - 通过设置 `clock.tickInterval` 来设置逻辑帧间隔(秒)
     * - 在帧补偿的时候, 为了尽快达到同步, `clock.update()` 会在同步之前忽略此间隔, 也就是说在这种情况下, 帧率会增加, 只有逻辑帧会补偿
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

        private constructor() {
            this._loop = this._loop.bind(this);
        }
        /**
         * 当应用程序的播放模式改变时派发事件。
         */
        public readonly onPlayerModeChange: signals.Signal<PlayerMode> = new signals.Signal();
        /**
         * 引擎版本。
         */
        public readonly version: string = "1.5.0.001";
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

        /**
         * core updating loop
         */
        private _loop(timestamp?: number) {
            if (!this._isRunning) { return; }

            timestamp = timestamp || performance.now();
            const result: ClockUpdateFlags = clock.update(timestamp) || { tickCount: 1, frameCount: 1 };
            this._update(result);
            requestAnimationFrame(this._loop);
        }
        /**
         * including calculating, status updating, rerendering and logical updating
         */
        private _update({ tickCount, frameCount }: ClockUpdateFlags = { tickCount: 1, frameCount: 1 }) {
            const systemManager = this.systemManager;

            if (tickCount) {
                systemManager._startup();
                systemManager._execute(tickCount, frameCount);
                systemManager._cleanup(frameCount);
                systemManager._teardown();
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

            if (options.tickInterval !== (void 0)) { clock.tickInterval = options.tickInterval; }
            console.info("tick rate:", clock.tickInterval ? (1.0 / clock.tickInterval) : "auto");
            if (options.frameInterval !== (void 0)) { clock.frameInterval = options.frameInterval; }
            console.info("frame rate:", clock.frameInterval ? (1.0 / clock.frameInterval) : "auto");

            this.resume();
        }
        /**
         * TODO
         * @internal
         */
        public pause(): void {
            this._isRunning = false;
            clock.reset();
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
            clock.reset();
            this._loop();
        }

        /**
         * engine start
         * 
         * TODO: 
         */
        public start() {
            switch (this._playerMode) {
                case PlayerMode.Editor:
                    this.pause();
                    this._update();
                    break;
                case PlayerMode.Player:
                // breakthrough
                case PlayerMode.DebugPlayer:
                    this.resume();
                    break;
                default: break;
            }
        }
        /**
         * 显式更新
         *
         * - 在暂停的情况下才有意义 (`this.isRunning === false`), 因为在运行的情况下下一帧自动会刷新
         * - 主要应用在类似编辑器模式下, 大多数情况只有数据更新的时候界面才需要刷新
         */
        public update() {
            // if it is running, updating will occur in next frame
            if (this._isRunning) { return; }

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
