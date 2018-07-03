namespace egret3d {
    /**
     * TODO 需要完善
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem<SkinnedMeshRenderer> {

        protected readonly _interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    { type: SkinnedMeshRendererEventType.Mesh, listener: (component: SkinnedMeshRenderer) => { this._updateDrawCalls(component.gameObject); } },
                    { type: SkinnedMeshRendererEventType.Materials, listener: (component: SkinnedMeshRenderer) => { this._updateDrawCalls(component.gameObject); } },
                ]
            }
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._hasGameObject(gameObject)) {
                return;
            }

            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            if (!renderer.mesh || renderer.materials.length === 0) {
                return;
            }
            //
            this._drawCalls.removeDrawCalls(renderer);
            //
            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const primitive of renderer.mesh.glTFMesh.primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.mesh,
                    material: renderer.materials[primitive.material || 0],

                    frustumTest: false,
                    zdist: -1,

                    boneData: renderer.boneBuffer,

                    disable: false,
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

            this._drawCalls.removeDrawCalls(gameObject.renderer as SkinnedMeshRenderer);
        }

        public onUpdate() {
            // TODO
        }

        public onDisable() {
            for (const renderer of this._components) {
                this._drawCalls.removeDrawCalls(renderer);
            }
        }
    }
}
