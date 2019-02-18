namespace egret3d {
    /**
     * 蒙皮网格渲染组件系统。
     * - 为蒙皮网格渲染组件生成绘制信息。
     * - 更新蒙皮网格的骨骼矩阵信息。
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem<paper.GameObject> {
        public readonly interests = [
            {
                componentClass: SkinnedMeshRenderer,
                listeners: [
                    {
                        type: SkinnedMeshRenderer.onMeshChanged, listener: (component: paper.BaseComponent) => {
                            this._updateDrawCalls(component.gameObject, true);

                            if (component.gameObject.renderer) {
                                component.gameObject.renderer._localBoundingBoxDirty = true;
                            }
                        }
                    },
                    {
                        type: SkinnedMeshRenderer.onMaterialsChanged, listener: (component: paper.BaseComponent) => {
                            this._updateDrawCalls(component.gameObject, true);
                        }
                    },
                ]
            }
        ];
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _materialFilter: boolean[] = [];

        private _updateDrawCalls(gameObject: paper.GameObject, checkState: boolean) {
            if (checkState && !this.enabled || !this.groups[0].hasGameObject(gameObject)) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            const mesh = renderer.mesh;
            const materials = renderer.materials;
            const materialCount = materials.length;
            drawCallCollecter.removeDrawCalls(renderer); // Clear drawCalls.

            if (!mesh || materialCount === 0) {
                return;
            }

            const primitives = mesh.glTFMesh.primitives;
            const subMeshCount = primitives.length;

            if (DEBUG && subMeshCount === 0) {
                throw new Error();
            }

            const materialFilter = this._materialFilter;
            const matrix = Matrix4.IDENTITY;
            materialFilter.length = materialCount;

            for (let i = 0; i < subMeshCount; ++i) { // Specified materials.
                const materialIndex = primitives[i].material;
                let material: Material | null = null;

                if (materialIndex === undefined) {
                    material = DefaultMaterials.MESH_BASIC;
                }
                else if (materialIndex < materialCount) {
                    material = materials[materialIndex];
                    materialFilter[materialIndex] = true;
                }

                if (material) {
                    const drawCall = DrawCall.create();
                    drawCall.renderer = renderer;
                    drawCall.matrix = matrix;
                    drawCall.subMeshIndex = i;
                    drawCall.mesh = mesh;
                    drawCall.material = material;
                    drawCallCollecter.addDrawCall(drawCall);
                }
            }

            for (let i = 0; i < materialCount; ++i) { // No specified materials.
                if (materialFilter[i]) {
                    continue;
                }

                const material = materials[i]!;

                for (let j = 0; j < subMeshCount; ++j) {
                    const drawCall = DrawCall.create();
                    drawCall.renderer = renderer;
                    drawCall.matrix = matrix;
                    drawCall.subMeshIndex = j;
                    drawCall.mesh = mesh;
                    drawCall.material = material;
                    drawCallCollecter.addDrawCall(drawCall);
                }
            }

            materialFilter.length = 0;
        }

        public onEnable() {
            for (const gameObject of this.groups[0].gameObjects) {
                this._updateDrawCalls(gameObject, false);
            }
        }

        public onDisable() {
            for (const gameObject of this.groups[0].gameObjects) {
                this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            const renderer = gameObject.renderer as SkinnedMeshRenderer;
            if (renderer.mesh && !renderer.source && !renderer.boneMatrices) { // TODO
                renderer.initialize(true);
            }

            this._updateDrawCalls(gameObject, false);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
        }

        public onUpdate() {
            for (const gameObject of this.groups[0].gameObjects) {
                (gameObject.renderer as SkinnedMeshRenderer)._update();
            }
        }
    }
}
