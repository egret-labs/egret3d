namespace egret3d {
    /**
     * TODO 需要完善
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem {
        protected readonly _interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    { type: MeshFilterEventType.Mesh, listener: (component: SkinnedMeshRenderer) => { this._updateDrawCalls(component.gameObject); } },
                    { type: paper.RendererEventType.Materials, listener: (component: SkinnedMeshRenderer) => { this._updateDrawCalls(component.gameObject); } },
                ]
            }
        ];
        private readonly _drawCalls: DrawCalls = DrawCalls.getInstance(DrawCalls);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._groups[0].hasGameObject(gameObject)) {
                return;
            }

            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            this._drawCalls.removeDrawCalls(renderer);

            if (!renderer.mesh || renderer.materials.length === 0) {
                return;
            }

            renderer.mesh._createBuffer();
            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const primitive of renderer.mesh.glTFMesh.primitives) {
                const material = renderer.materials[primitive.material!];
                const drawCall: DrawCall = {
                    renderer: renderer,

                    isSkinned: true,
                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.mesh,
                    material: material || DefaultMaterials.MISSING,

                    frustumTest: false,
                    zdist: -1,
                };
                material.addDefine("SKINNING");
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
            this._drawCalls.removeDrawCalls(gameObject.renderer as SkinnedMeshRenderer);
        }

        public onUpdate() {
            // TODO
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCalls.removeDrawCalls(gameObject.renderer as SkinnedMeshRenderer);
            }
        }
    }
}
