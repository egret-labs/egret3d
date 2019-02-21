namespace egret3d {
    /**
     * Egret 传统 2D 渲染系统。
     */
    export class Egret2DRendererSystem extends paper.BaseSystem<paper.GameObject> {
        /**
         * @deprecated
         */
        public static canvas: HTMLCanvasElement | null = null;
        /**
         * @deprecated
         */
        public static webgl: WebGLRenderingContext | null = null;
        /**
         * TODO
         * @internal
         */
        public readonly webInput = egret.Capabilities.runtimeType === egret.RuntimeType.WEB ? new (egret as any)["web"].HTMLInput() : null;

        private _entitiesDirty: boolean = false;
        private readonly _sortedEntities: paper.GameObject[] = [];

        private _onSortEntities(a: paper.GameObject, b: paper.GameObject) {
            return b.getComponent(Egret2DRenderer)!._order - a.getComponent(Egret2DRenderer)!._order;
        }

        private _sortEntities() {
            if (this._entitiesDirty) {
                this._sortedEntities.sort(this._onSortEntities);
                this._entitiesDirty = false;
            }

            return this._sortedEntities;
        }

        private _onTouchStart(pointer: Pointer, signal: signals.Signal) {
            if (paper.Application.playerMode !== paper.PlayerMode.Player) {
                return;
            }

            const event = pointer.event!;

            for (const entity of this._sortEntities()) {
                const renderer = entity.getComponent(Egret2DRenderer)!;
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

            const event = pointer.event!;

            for (const entity of this._sortEntities()) {
                const renderer = entity.getComponent(Egret2DRenderer)!;
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

            const event = pointer.event!;

            for (const entity of this._sortEntities()) {
                const renderer = entity.getComponent(Egret2DRenderer)!;
                const scaler = renderer.scaler;
                if (renderer.stage.$onTouchEnd(pointer.position.x / scaler, pointer.position.y / scaler, event.pointerId)) {
                    break;
                }
            }
        }

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Egret2DRenderer),
            ];
        }

        public onAwake(config: RunOptions) {
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

        public onEntityAdded(entity: paper.GameObject) {
            this._entitiesDirty = true;
            this._sortedEntities.push(entity);
        }

        public onEntityRemoved(entity: paper.GameObject) {
            const index = this._sortedEntities.indexOf(entity);

            if (index >= 0) {
                this._sortedEntities.splice(index, 1);
            }
        }

        public onUpdate(deltaTime: number) {
            const { w, h } = stage.viewport;

            for (const entity of this.groups[0].entities) {
                entity.getComponent(Egret2DRenderer)!.update(deltaTime, w, h);
            }
        }
    }
}
