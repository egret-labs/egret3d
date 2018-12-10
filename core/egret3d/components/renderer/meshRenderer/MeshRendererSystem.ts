namespace egret3d {
    /**
     * 网格渲染组件系统。
     * - 为网格渲染组件生成绘制信息。
     */
    export class MeshRendererSystem extends paper.BaseSystem {
        public readonly interests = [
            {
                componentClass: MeshFilter,
                listeners: [{
                    type: MeshFilter.onMeshChanged, listener: (component: paper.BaseComponent) => {
                        this._updateDrawCalls(component.gameObject, true);

                        if (component.gameObject.renderer) {
                            component.gameObject.renderer._localBoundingBoxDirty = true;
                        }
                    }
                }]
            },
            {
                componentClass: MeshRenderer,
                listeners: [{
                    type: MeshRenderer.onMaterialsChanged, listener: (component: paper.BaseComponent) => {
                        this._updateDrawCalls(component.gameObject, true);
                    }
                }]
            },
        ];
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _materialFilter: boolean[] = [];

        private _updateDrawCalls(gameObject: paper.GameObject, checkState: boolean) {
            if (checkState && (!this.enabled || !this.groups[0].hasGameObject(gameObject))) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const filter = gameObject.getComponent(MeshFilter)!;
            const renderer = gameObject.renderer!;
            const mesh = filter.mesh;
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
            const matrix = gameObject.transform.localToWorldMatrix;
            materialFilter.length = materialCount;
            drawCallCollecter.renderers.push(renderer);

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
            this._updateDrawCalls(gameObject, false);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
        }
    }
}
