type int = number;
type uint = number;

namespace paper {
    /**
     * 
     */
    export const enum PlayerMode {
        Player,
        DebugPlayer,
        Editor,
    }
    /**
     * 
     */
    export let Time: Clock;
    /**
     * 
     */
    export let Application: ECS;
    /**
     * 
     */
    export class ECS {
        private static _instance: ECS | null = null;
        /**
         * 
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
         * 
         */
        public readonly version: string = "0.9.000";
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

        public _option: egret3d.RequiredRuntimeOptions;//TODO临时
        public _canvas: HTMLCanvasElement;//TODO临时
        public _webgl: WebGLRenderingContext;////TODO临时


        private _update() {
            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate!);
            }

            Time && Time.update();
            Group.update();
            this.systemManager.update();
        }

        public init({ playerMode = PlayerMode.Player, systems = [] as { new(): BaseSystem }[], option = {}, canvas = {}, webgl = {} } = {}) {
            this._playerMode = playerMode;
            this._option = option as egret3d.RequiredRuntimeOptions;
            this._canvas = canvas as HTMLCanvasElement;
            this._webgl = webgl as WebGLRenderingContext;

            for (const systemClass of systems) {
                this.systemManager.register(systemClass);
            }

            this.resume();
        }

        /**
         * 
         */
        public pause() {
            this._isRunning = false;
        }

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

        public callLater(callback: () => void): void {
            (this.systemManager.getSystem(paper.LateUpdateSystem)!).callLater(callback);
        }

        public get isFocused() {
            return this._isFocused;
        }

        public get isRunning() {
            return this._isRunning;
        }

        public get playerMode() {
            return this._playerMode;
        }
    }

    Application = ECS.getInstance();
}
