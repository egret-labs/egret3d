namespace egret3d {
    /**
     * 网格渲染组件系统。
     * - 为网格渲染组件生成绘制信息。
     */
    export class MeshRendererSystem extends paper.BaseSystem<paper.GameObject> {

        private readonly _drawCallCollecter: DrawCallCollecter = paper.Application.sceneManager.globalEntity.getComponent(DrawCallCollecter)!;
        private readonly _materialFilter: boolean[] = [];

        private _updateDrawCalls(entity: paper.GameObject, checkState: boolean) {
            if (checkState && !this.groups[0].containsEntity(entity)) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const filter = entity.getComponent(MeshFilter)!;
            const renderer = entity.getComponent(MeshRenderer)!;
            const mesh = filter.mesh;
            const materials = renderer.materials;
            const materialCount = materials.length;
            // Clear drawCalls.
            drawCallCollecter.removeDrawCalls(entity);

            if (!mesh || materialCount === 0) {
                return;
            }

            const primitives = mesh.glTFMesh.primitives;
            const subMeshCount = primitives.length;

            if (DEBUG && subMeshCount === 0) {
                throw new Error();
            }

            const materialFilter = this._materialFilter;
            const matrix = entity.getComponent(egret3d.Transform)!.localToWorldMatrix;

            if (materialFilter.length < materialCount) {
                materialFilter.length = materialCount;
            }

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
                    drawCall.entity = entity;
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
                    drawCall.entity = entity;
                    drawCall.renderer = renderer;
                    drawCall.matrix = matrix;
                    drawCall.subMeshIndex = j;
                    drawCall.mesh = mesh;
                    drawCall.material = material;
                    drawCallCollecter.addDrawCall(drawCall);
                }
            }

            // materialFilter.length = 0;
        }

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform, MeshFilter, MeshRenderer),
            ];
        }

        protected getListeners() {
            return [
                {
                    type: MeshFilter.onMeshChanged, listener: (component: paper.IComponent) => {
                        this._updateDrawCalls(component.entity as paper.GameObject, true);

                        const renderer = component.entity.getComponent(MeshRenderer);

                        if (renderer) {
                            renderer._localBoundingBoxDirty = true;
                        }
                    }
                },
                {
                    type: MeshRenderer.onMaterialsChanged, listener: (component: paper.IComponent) => {
                        this._updateDrawCalls(component.entity as paper.GameObject, true);
                    }
                }
            ];
        }

        public onEntityAdded(entity: paper.GameObject) {
            this._updateDrawCalls(entity, false);
        }

        public onEntityRemoved(entity: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(entity);
        }
    }
}
