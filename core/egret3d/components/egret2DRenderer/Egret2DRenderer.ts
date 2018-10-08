namespace egret3d {


    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Egret2DRenderer extends paper.BaseRenderer {
        /**
         * TODO
         */
        public frustumCulled: boolean = false;
        public stage: egret.Stage;

        private _renderer: egret.web.Renderer;

        private _screenAdapter: IScreenAdapter = new ConstantAdapter();
        public set screenAdapter(adapter: IScreenAdapter) {
            adapter.$dirty = true;
            this._screenAdapter = adapter;
        }
        public get screenAdapter(): IScreenAdapter {
            return this._screenAdapter;
        }

        public root: egret.DisplayObjectContainer;

        private _stage: Stage;

        public initialize() {
            super.initialize();

            this.stage = new egret.Stage();
            this.stage.maxTouches = 98;
            this.root = new egret.DisplayObjectContainer();
            this.stage.addChild(this.root);

            if (!this._renderer) {
                this._renderer = egret.web.Renderer.getInstance(WebGLCapabilities.webgl);
            }

            let stage = this.stage;
            let displayList = new egret.sys.DisplayList(stage);
            displayList.renderBuffer = new egret.sys.RenderBuffer(undefined, undefined, true);
            stage.$displayList = displayList;

            // TODO
            const webInput = paper.Application.systemManager.getSystem(egret3d.Egret2DRendererSystem)!.webInput;
            if (webInput) {
                egret.web.$cacheTextAdapter(webInput, stage, WebGLCapabilities.canvas.parentNode as HTMLDivElement, WebGLCapabilities.canvas);
            }

            const inputCollecter = this.gameObject.getComponent(InputCollecter)!;
            inputCollecter.onPointerDown.add(this._onTouchStart, this);
            inputCollecter.onPointerCancel.add(this._onTouchEnd, this);
            inputCollecter.onPointerUp.add(this._onTouchEnd, this);
            inputCollecter.onPointerMove.add(this._onTouchMove, this);

            this._stage = paper.GameObject.globalGameObject.getComponent(Stage)!;
        }

        public uninitialize() {
            super.uninitialize();

            const inputCollecter = this.gameObject.getComponent(InputCollecter)!;
            inputCollecter.onPointerDown.remove(this._onTouchStart, this);
            inputCollecter.onPointerCancel.remove(this._onTouchEnd, this);
            inputCollecter.onPointerUp.remove(this._onTouchEnd, this);
            inputCollecter.onPointerMove.remove(this._onTouchMove, this);

            this.stage.removeChild(this.root);
        }

        public recalculateAABB() {
            // TODO
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            // TODO
            return false;
        }

        private _onTouchStart(pointer: Pointer, signal: signals.Signal) {
            const event = pointer.event!;
            if (this.stage.$onTouchBegin(event.clientX / this._scaler, event.clientY / this._scaler, event.pointerId)) {
                signal.halt();
            }
        }

        private _onTouchMove(pointer: Pointer, signal: signals.Signal) {
            const event = pointer.event!;
            if (this.stage.$onTouchMove(event.clientX / this._scaler, event.clientY / this._scaler, event.pointerId)) {
                signal.halt();
            }
        }

        private _onTouchEnd(pointer: Pointer, signal: signals.Signal) {
            const event = pointer.event!;
            if (this.stage.$onTouchEnd(event.clientX / this._scaler, event.clientY / this._scaler, event.pointerId)) {
                signal.halt();
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
            const { w, h } = this._stage.viewport;

            if (this._stageWidth !== w || this._stageHeight !== h || this.screenAdapter.$dirty) {
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

            // // clear catched events
            // this._catchedEvent = {};
        }

        /**
         * @internal
         */
        public render(context: RenderContext, camera: egret3d.Camera) {
            this._renderer.beforeRender();
            this.stage.drawToSurface();
            // WebGLRenderUtils.resetState(); // 清除3D渲染器中的标脏
        }
    }
}