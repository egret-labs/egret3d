namespace egret3d {
    /**
     * 蒙皮网格渲染器。
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem {
        /**
         * @internal
         */
        public static maxBoneCount: number = 36;

        protected readonly _interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    {
                        type: SkinnedMeshRenderer.onMeshChanged, listener: (component: SkinnedMeshRenderer) => {
                            this._updateDrawCalls(component.gameObject);

                            if (component.gameObject.renderer) {
                                component.gameObject.renderer._aabbDirty = true;
                            }
                        }
                    },
                    {
                        type: SkinnedMeshRenderer.onMaterialsChanged, listener: (component: SkinnedMeshRenderer) => {
                            this._updateDrawCalls(component.gameObject);
                        }
                    },
                ]
            }
        ];
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._groups[0].hasGameObject(gameObject)) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            drawCallCollecter.removeDrawCalls(renderer);

            if (!renderer.mesh || renderer.materials.length === 0) {
                return;
            }

            renderer.mesh._createBuffer();
            this._drawCallCollecter.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const primitive of renderer.mesh.glTFMesh.primitives) {
                const material = renderer.materials[primitive.material!]; // TODO miss material
                const drawCall = DrawCall.create();
                drawCall.renderer = renderer;
                drawCall.matrix = Matrix4.IDENTITY;
                drawCall.subMeshIndex = subMeshIndex++;
                drawCall.mesh = renderer.mesh;
                drawCall.material = material || DefaultMaterials.MISSING;
                drawCallCollecter.drawCalls.push(drawCall);
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
            this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
        }

        public onUpdate() {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.renderer as SkinnedMeshRenderer)._update();
            }
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
            }
        }
    }
}
