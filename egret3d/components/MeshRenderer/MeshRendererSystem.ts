namespace egret3d {
    /**
     * 
     */
    export class MeshRendererSystem extends paper.BaseSystem {
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
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getOrAddComponent(DrawCalls);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._groups[0].hasGameObject(gameObject)) {
                return;
            }

            const filter = gameObject.getComponent(MeshFilter) as MeshFilter;
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
                    material: renderer.materials[primitive.material!] || DefaultMaterials.MissingMaterial,

                    frustumTest: false,
                    zdist: -1,
                };

                if (!filter.mesh.vbo) {
                    filter.mesh.createVBOAndIBOs();
                }

                this._drawCalls.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._updateDrawCalls(gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._updateDrawCalls(gameObject);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCalls.removeDrawCalls(gameObject.renderer as MeshRenderer);
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCalls.removeDrawCalls(gameObject.renderer as MeshRenderer);
            }
        }
    }
}
