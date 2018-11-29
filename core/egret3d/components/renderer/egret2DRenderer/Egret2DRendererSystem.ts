namespace egret3d {
    /**
     * Egret 传统 2D 渲染系统。
     */
    export class Egret2DRendererSystem extends paper.BaseSystem {
        /**
         * @deprecated
         */
        public static canvas: HTMLCanvasElement | null = null;
        /**
         * @deprecated
         */
        public static webgl: WebGLRenderingContext | null = null;

        protected readonly _interests = [
            { componentClass: Egret2DRenderer }
        ];
        /**
         * TODO
         * @internal
         */
        public readonly webInput = egret.Capabilities.runtimeType === egret.RuntimeType.WEB ? new (egret as any)["web"].HTMLInput() : null;

        private _sortedDirty: boolean = false;
        private readonly _sortedRenderers: Egret2DRenderer[] = [];

        private _onSortRenderers(a: Egret2DRenderer, b: Egret2DRenderer) {
            return b._order - a._order;
        }

        private _sortRenderers() {
            if (this._sortedDirty) {
                this._sortedRenderers.sort(this._onSortRenderers);
                this._sortedDirty = false;
            }

            return this._sortedRenderers;
        }

        private _onTouchStart(pointer: Pointer, signal: signals.Signal) {
            if (paper.Application.playerMode !== paper.PlayerMode.Player) {
                return;
            }

            for (const renderer of this._sortRenderers()) {
                const event = pointer.event!;
                const scaler = renderer.scaler;
                if (renderer.stage.$onTouchBegin(pointer.position.x / scaler, pointer.position.y / scaler, event.pointerId)) {
                    break;
                }
            }
        }

        private _onTouchMove(pointer: Pointer, signal: signals.Signal) {
            if (paper.Application.playerMode !== paper.PlayerMode.Player) {
                return;
            }

            for (const renderer of this._sortRenderers()) {
                const event = pointer.event!;
                const scaler = renderer.scaler;
                if (renderer.stage.$onTouchMove(pointer.position.x / scaler, pointer.position.y / scaler, event.pointerId)) {
                    break;
                }
            }
        }

        private _onTouchEnd(pointer: Pointer, signal: signals.Signal) {
            if (paper.Application.playerMode !== paper.PlayerMode.Player) {
                return;
            }

            for (const renderer of this._sortRenderers()) {
                const event = pointer.event!;
                const scaler = renderer.scaler;
                if (renderer.stage.$onTouchEnd(pointer.position.x / scaler, pointer.position.y / scaler, event.pointerId)) {
                    break;
                }
            }
        }

        public onAwake(config: RunEgretOptions) {
            Egret2DRendererSystem.canvas = config.canvas!;
            Egret2DRendererSystem.webgl = config.webgl!;
            const webgl = Egret2DRendererSystem.webgl;
            if (!webgl) {
                return;
            }

            const webInput = this.webInput;

            if (webInput) {
                const canvas = Egret2DRendererSystem.canvas!;
                webInput._initStageDelegateDiv(canvas.parentNode as HTMLDivElement, canvas);
                webInput.$updateSize();
            }
        }

        public onEnable() {
            inputCollecter.onPointerDown.add(this._onTouchStart, this);
            inputCollecter.onPointerCancel.add(this._onTouchEnd, this);
            inputCollecter.onPointerUp.add(this._onTouchEnd, this);
            inputCollecter.onPointerMove.add(this._onTouchMove, this);
        }

        public onDisable() {
            inputCollecter.onPointerDown.remove(this._onTouchStart, this);
            inputCollecter.onPointerCancel.remove(this._onTouchEnd, this);
            inputCollecter.onPointerUp.remove(this._onTouchEnd, this);
            inputCollecter.onPointerMove.remove(this._onTouchMove, this);
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._sortedDirty = true;
            this._sortedRenderers.push(gameObject.renderer as Egret2DRenderer);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            const index = this._sortedRenderers.indexOf(gameObject.renderer as Egret2DRenderer);
            if (index >= 0) {
                this._sortedRenderers.splice(index, 1);
            }
        }

        public onUpdate(deltaTime: number) {
            const { w, h } = stage.viewport;
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.renderer as Egret2DRenderer).update(deltaTime, w, h);
            }
        }
    }
}
