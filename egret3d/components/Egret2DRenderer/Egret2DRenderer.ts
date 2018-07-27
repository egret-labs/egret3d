namespace egret3d {


    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    @paper.disallowMultiple
    export class Egret2DRenderer extends paper.BaseRenderer {
        private renderer: egret.web.Renderer;


        /**
         * 是否使用视锥剔除
         */
        frustumTest: boolean = false;


        public stage: egret.Stage;

        private _screenAdapter: IScreenAdapter = new ConstantAdapter();
        public set screenAdapter(adapter: IScreenAdapter) {
            adapter.$dirty = true;
            this._screenAdapter = adapter;
        }
        public get screenAdapter(): IScreenAdapter {
            return this._screenAdapter;
        }

        public root: egret.DisplayObjectContainer;

        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            this.stage = new egret.Stage();
            this.stage.maxTouches = 98;
            this.root = new egret.DisplayObjectContainer();
            this.stage.addChild(this.root);

            let context = WebGLKit.webgl;

            if (!this.renderer) {
                this.renderer = egret.web.Renderer.getInstance(context);
            }

            let stage = this.stage;
            let displayList = new egret.sys.DisplayList(stage);
            displayList.renderBuffer = new egret.sys.RenderBuffer(undefined, undefined, true);
            stage.$displayList = displayList;

            InputManager.touch.addEventListener("touchstart", this._onTouchStart, this);
            InputManager.touch.addEventListener("touchend", this._onTouchEnd, this);
            InputManager.touch.addEventListener("touchcancel", this._onTouchEnd, this);
            InputManager.touch.addEventListener("touchmove", this._onTouchMove, this);

            InputManager.mouse.addEventListener("mousedown", this._onTouchStart, this);
            InputManager.mouse.addEventListener("mouseup", this._onTouchEnd, this);
            InputManager.mouse.addEventListener("mousemove", this._onTouchMove, this);
        }

        /**
         * @inheritDoc
         */
        public uninitialize() {
            super.uninitialize();

            InputManager.touch.removeEventListener("touchstart", this._onTouchStart, this);
            InputManager.touch.removeEventListener("touchend", this._onTouchEnd, this);
            InputManager.touch.removeEventListener("touchcancel", this._onTouchEnd, this);
            InputManager.touch.removeEventListener("touchmove", this._onTouchMove, this);
            InputManager.mouse.removeEventListener("mousedown", this._onTouchStart, this);
            InputManager.mouse.removeEventListener("mouseup", this._onTouchEnd, this);
            InputManager.mouse.removeEventListener("mousemove", this._onTouchMove, this);

            // this.stage.removeChild(this.root);
        }


        /**
         * 检查屏幕接触事件是否能够穿透此2D层
         */
        public checkEventThrough(x: number, y: number): boolean {
            return !!this._catchedEvent[x + "_" + y];
        }

        private _catchedEvent = {};

        private _onTouchStart(event: any) {
            // console.log(event);
            if (this.stage.$onTouchBegin(event.x / this._scaler, event.y / this._scaler, event.identifier)) {
                this._catchedEvent[event.x + "_" + event.y] = true;
            }
        }

        private _onTouchMove(event: any) {
            // console.log(event);
            if (this.stage.$onTouchMove(event.x / this._scaler, event.y / this._scaler, event.identifier)) {
                this._catchedEvent[event.x + "_" + event.y] = true;
            }
        }

        private _onTouchEnd(event: any) {
            // console.log(event);
            if (this.stage.$onTouchEnd(event.x / this._scaler, event.y / this._scaler, event.identifier)) {
                this._catchedEvent[event.x + "_" + event.y] = true;
            }
        }

        /**
         * screen position to ui position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从屏幕坐标转换到当前2D系统的坐标
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public screenPosToUIPos(pos: Vector2, out: Vector2 = new Vector2()): Vector2 {
            out.x = pos.x / this._scaler;
            out.y = pos.y / this._scaler;
            return out;
        }

        private _stageWidth: number = 0;
        private _stageHeight: number = 0;
        private _scaler: number = 1;

        /**
         * 从屏幕坐标到当前2D系统的坐标的缩放系数
         */
        public get scaler(): number {
            return this._scaler;
        }

        /**
         * 
         */
        public update(delta: number) {
            let stage2d = this.stage;
            const { w, h } = stage.screenViewport;

            if (this._stageWidth != w || this._stageHeight != h || this.screenAdapter.$dirty) {
                let result = { w: 0, h: 0, s: 0 };

                this.screenAdapter.calculateScaler(w, h, result);
                this.screenAdapter.$dirty = false;

                // this._scaler = this.root.scaleX = this.root.scaleY = result.s;
                stage2d.$displayList["offsetMatrix"].a = result.s;
                stage2d.$displayList["offsetMatrix"].d = result.s;
                this._scaler = result.s;

                let stageWidth = result.w;
                let stageHeight = result.h;
                stage2d.$stageWidth = stageWidth;
                stage2d.$stageHeight = stageHeight;
                // stage.$displayList.setClipRect(screenWidth, screenHeight);
                stage2d.pushResize(w, h);
                stage2d.dispatchEventWith(egret.Event.RESIZE);

                this._stageWidth = w;
                this._stageHeight = h;
            }

            // clear catched events
            this._catchedEvent = {};
        }

        /**
         * 
         */
        public render(context: RenderContext, camera: egret3d.Camera) {
            let gl = WebGLKit.webgl;

            this.renderer.beforeRender();

            this.stage.drawToSurface();

            WebGLKit.resetState(); // 清除3D渲染器中的标脏
        }
    }
}