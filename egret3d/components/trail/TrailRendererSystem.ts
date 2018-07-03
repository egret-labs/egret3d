namespace egret3d {
    /**
     * TrailRender系统
     */
    export class TrailRendererSystem extends paper.BaseSystem<TrailRenderer> {
        public readonly _interests = [
            {
                componentClass: TrailRenderer,
                listeners: [
                    { type: paper.RendererEventType.Materials, listener: (component: TrailRenderer) => { this._updateDrawCalls(component.gameObject); } }
                ]
            }
        ];

        private readonly _matrix: Matrix = new Matrix();
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._hasGameObject(gameObject)) {
                return;
            }

            const renderer = gameObject.renderer as TrailRenderer;
            if (!renderer.material) {
                return;
            }

            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const primitive of renderer._mesh.glTFMesh.primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,
                    matrix: this._matrix,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer._mesh, // TODO
                    material: renderer.material,

                    frustumTest: false,
                    zdist: -1,
                };

                this._drawCalls.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (const renderer of this._components) {
                this._updateDrawCalls(renderer.gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._updateDrawCalls(gameObject);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            if (!this._enabled) {
                return;
            }

            this._drawCalls.removeDrawCalls(gameObject.renderer as TrailRenderer);
        }

        public onUpdate() { // TODO 应将组件功能尽量移到系统
            const deltaTime = paper.Time.deltaTime;
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }

        public onDisable() {
            for (const renderer of this._components) {
                this._drawCalls.removeDrawCalls(renderer);
            }
        }
    }
}
