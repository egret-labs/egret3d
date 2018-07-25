type int = number;
type uint = number;

namespace paper {
    /**
     * 
     */
    export let Time: Clock;
    /**
     * 组件实体系统的主入口
     */
    export class Application {
        /**
         * 系统管理器
         */
        public static readonly systemManager: SystemManager = SystemManager.getInstance();

        /**
         * 场景管理器
         */
        public static readonly sceneManager: SceneManager = SceneManager.getInstance();

        private static _isEditor = false;
        private static _isFocused = false;
        private static _isPlaying = false;
        private static _isRunning = false;
        private static _bindUpdate: FrameRequestCallback = null as any;

        public static _option:egret3d.RequiredRuntimeOptions;//TODO临时
        public static _canvas:HTMLCanvasElement;//TODO临时
        public static _webgl:WebGLRenderingContext;////TODO临时

        private static _update() {
            if (this._isRunning) {
                requestAnimationFrame(this._bindUpdate);
            }

            Time.update();
            this.systemManager.update();
        }

        public static init({ isEditor = false, isPlaying = true, option = {}, canvas = {}, webgl = {} } = {}) {
            const systemClasses = [
                //
                BeginSystem,
                EnableSystem,
                StartSystem,
                //
                egret3d.oimo.PhysicsSystem, // TODO 分离
                //
                UpdateSystem,
                //
                egret3d.AnimationSystem,
                //
                LateUpdateSystem,
                //
                egret3d.TrailRendererSystem,
                egret3d.MeshRendererSystem,
                egret3d.SkinnedMeshRendererSystem,
                egret3d.particle.ParticleSystem,
                egret3d.Egret2DRendererSystem,
                egret3d.LightSystem,
                egret3d.CameraSystem,
                egret3d.WebGLRenderSystem,
                //
                DisableSystem,
                EndSystem,
            ];

            let level = 0;
            for (const systemClass of systemClasses) {
                this.systemManager.register(systemClass, level++);
            }

            //
            Time = this.sceneManager.globalGameObject.getComponent(Clock) || this.sceneManager.globalGameObject.addComponent(Clock);

            this._isEditor = isEditor;
            this._isPlaying = isPlaying;

            this._option = option as egret3d.RequiredRuntimeOptions;
            this._canvas = canvas as HTMLCanvasElement;
            this._webgl = webgl as WebGLRenderingContext;
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

        /**
         * @deprecated
         */
        public static callLater(callback: () => void): void {
            (this.systemManager.getSystem(LateUpdateSystem) as LateUpdateSystem).callLater(callback);
        }

        private constructor() {
        }
    }
}
