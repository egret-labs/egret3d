namespace egret3d {

    /**
     * 可以添加egret2d显示对象（包括EUI）进行渲染。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Egret2DRenderer extends paper.BaseRenderer {
        /**
         * @internal
         */
        public _order: number = -1;
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

        public initialize() {
            super.initialize();

            this.stage = new egret.Stage();
            this.stage.maxTouches = 98;
            this.root = new egret.DisplayObjectContainer();
            this.stage.addChild(this.root);

            if (!this._renderer) {
                this._renderer = egret.web.Renderer.getInstance(WebGLCapabilities.webgl! || Egret2DRendererSystem.webgl!);
            }

            let stage = this.stage;
            let displayList = new egret.sys.DisplayList(stage);
            displayList.renderBuffer = new egret.sys.RenderBuffer(undefined, undefined, true);
            stage.$displayList = displayList;

            // TODO
            const webInput = paper.Application.systemManager.getSystem(Egret2DRendererSystem)!.webInput;
            if (webInput) {
                egret.web.$cacheTextAdapter(webInput, stage, Egret2DRendererSystem.canvas!.parentNode as HTMLDivElement, Egret2DRendererSystem.canvas);
            }
        }

        public uninitialize() {
            super.uninitialize();

            this.stage.removeChild(this.root);
        }

        public recalculateLocalBox() {
            // TODO
            this._localBoundingBox.size = Vector3.ZERO;
        }

        public raycast(p1: Readonly<Ray>, p2: RaycastInfo | null = null) {
            // TODO
            return false;
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
        public update(deltaTime: number, w: number, h: number) {
            this._order = -1;
            let stage2d = this.stage;
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
        public _draw() {
            this._renderer.beforeRender();
            this.stage.drawToSurface();
        }
    }
}