namespace paper {

    /**
     * 组件实体系统的主入口
     */
    export class Application {
        /**
         * 系统管理器
         */
        public static readonly systemManager: SystemManager = new SystemManager();

        /**
         * 场景管理器
         */
        public static readonly sceneManager: SceneManager = new SceneManager();

        private static _isEditor = false;
        private static _isFocused = false;
        private static _isPlaying = false;
        private static _isRunning = false;
        private static _standDeltaTime = -1;
        private static readonly _laterCalls: (() => void)[] = [];
        private static _bindUpdate: FrameRequestCallback = null as any;

        private static _update() {
            Time.update();

            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate);
            }

            this.systemManager.update();

            if (this._laterCalls.length > 0) {
                for (const callback of this._laterCalls) {
                    callback();
                }

                this._laterCalls.length = 0;
            }
        }

        public static init({ isEditor = false, isPlaying = true } = {}) {
            const systemManager = this.systemManager;
            const systemClasses = [
                StartSystem,
                BehaviourSystem,
                egret3d.BoxColliderSystem,
                egret3d.AnimationSystem,
                egret3d.GuidpathSystem,
                egret3d.TrailRenderSystem,
                egret3d.MeshRendererSystem,
                egret3d.SkinnedMeshRendererSystem,
                egret3d.particle.ParticleSystem,
                egret3d.Egret2DRendererSystem,
                egret3d.LightSystem,
                egret3d.CameraSystem,
                egret3d.AudioSource3DSystem,
                DestroySystem,
                EndSystem,
            ];
            let level = 0;
            for (const systemClass of systemClasses) {
                systemManager.register(systemClass, level++);
            }
            Time.initialize();
            this._isEditor = isEditor;
            this._isPlaying = isPlaying;
            this.resume();
        }

        /**
         * 
         */
        public static pause() {
            this._isRunning = false;
        }

        public static resume() {
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
        public static callLater(callback: () => void): void {
            this._laterCalls.push(callback);
        }

        public static get isEditor() {
            return this._isEditor;
        }

        public static get isFocused() {
            return this._isFocused;
        }

        public static get isPlaying() {
            return this._isPlaying;
        }

        public static get isRunning() {
            return this._isRunning;
        }
    }
}
