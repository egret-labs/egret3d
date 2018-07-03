namespace egret3d {
    /**
     * 
     */
    export class MeshRendererSystem extends paper.BaseSystem<MeshFilter | MeshRenderer> {
        protected readonly _interests = [
            {
                componentClass: MeshFilter,
                listeners: [
                    { type: MeshFilterEventType.Mesh, listener: (component: MeshFilter) => { this._updateDrawCalls(component.gameObject); } }
                ]
            },
            {
                componentClass: MeshRenderer,
                listeners: [
                    { type: paper.RendererEventType.Materials, listener: (component: MeshRenderer) => { this._updateDrawCalls(component.gameObject); } }
                ]
            },
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._hasGameObject(gameObject)) {
                return;
            }

            const filter = this._getComponent(gameObject, 0) as MeshFilter;
            const renderer = gameObject.renderer as MeshRenderer;
            if (!filter.mesh || renderer.materials.length === 0) {
                return;
            }

            this._drawCalls.removeDrawCalls(renderer);
            //
            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const primitive of filter.mesh.glTFMesh.primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,

                    subMeshIndex: subMeshIndex++,
                    mesh: filter.mesh,
                    material: renderer.materials[primitive.material || 0],

                    frustumTest: false,
                    zdist: -1,

                    disable: false,
                };

                this._drawCalls.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (let i = 0, l = this._components.length; i < l; i += this._interestComponentCount) {
                this._updateDrawCalls(this._components[i].gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._updateDrawCalls(gameObject);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            if (!this._enabled) {
                return;
            }

            this._drawCalls.removeDrawCalls(gameObject.renderer);
        }

        public onDisable() {
            for (let i = 0, l = this._components.length; i < l; i += this._interestComponentCount) {
                const renderer = this._components[i + 1] as MeshRenderer;
                this._drawCalls.removeDrawCalls(renderer);
            }
        }
    }
}
