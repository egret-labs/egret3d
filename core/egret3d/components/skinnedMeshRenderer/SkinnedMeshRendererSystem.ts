namespace egret3d {
    /**
     * TODO 需要完善
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem {
        /**
         * 
         */
        public static maxBoneCount: number = 36;

        protected readonly _interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    {
                        type: MeshFilterEventType.Mesh, listener: (component: SkinnedMeshRenderer) => {
                            this._updateDrawCalls(component.gameObject);

                            if (component.gameObject.renderer) {
                                component.gameObject.renderer._aabbDirty = true;
                            }
                        }
                    },
                    { type: paper.RendererEventType.Materials, listener: (component: SkinnedMeshRenderer) => { this._updateDrawCalls(component.gameObject); } },
                ]
            }
        ];
        private readonly _drawCalls: DrawCalls = paper.GameObject.globalGameObject.getOrAddComponent(DrawCalls);

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
                    matrix: Matrix4.IDENTITY,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.mesh,
                    material: material || DefaultMaterials.MISSING,

                    zdist: -1,
                };

                if (!renderer.forceCPUSkin) {
                    material.addDefine(ShaderDefine.USE_SKINNING).addDefine(`${ShaderDefine.MAX_BONES} ${Math.min(SkinnedMeshRendererSystem.maxBoneCount, renderer.bones.length)}`);
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
            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            if (renderer.mesh && !renderer.boneMatrices) {
                renderer.initialize(true);
            }

            this._updateDrawCalls(gameObject);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCalls.removeDrawCalls(gameObject.renderer as SkinnedMeshRenderer);
        }

        public onUpdate() {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.renderer as SkinnedMeshRenderer)._update();
            }
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCalls.removeDrawCalls(gameObject.renderer as SkinnedMeshRenderer);
            }
        }
    }
}
