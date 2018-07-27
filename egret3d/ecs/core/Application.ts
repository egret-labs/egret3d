type int = number;
type uint = number;

namespace paper {
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
         * 系统管理器。
         */
        public readonly systemManager: SystemManager = SystemManager.getInstance();
        /**
         * 场景管理器。
         */
        public readonly sceneManager: SceneManager = SceneManager.getInstance();

        private _isEditor = false;
        private _isFocused = false;
        private _isPlaying = false;
        private _isRunning = false;
        private _bindUpdate: FrameRequestCallback = null as any;

        private _update() {
            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate);
            }

            Time && Time.update();
            Group.update();
            this.systemManager.update();
        }

        public init({ isEditor = false, isPlaying = true, systems = [] as { new(): BaseSystem }[] } = {}) {
            for (const systemClass of systems) {
                this.systemManager.register(systemClass);
            }

            this._isEditor = isEditor;
            this._isPlaying = isPlaying;
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
            (this.systemManager.getSystem(paper.LateUpdateSystem) as paper.LateUpdateSystem).callLater(callback);
        }

        public get isEditor() {
            return this._isEditor;
        }

        public get isFocused() {
            return this._isFocused;
        }

        public get isPlaying() {
            return this._isPlaying;
        }

        public get isRunning() {
            return this._isRunning;
        }
    }

    Application = ECS.getInstance();
}
