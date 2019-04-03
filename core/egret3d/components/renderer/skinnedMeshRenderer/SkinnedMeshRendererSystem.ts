namespace egret3d {
    /**
     * 蒙皮网格渲染组件系统。
     * - 为蒙皮网格渲染组件生成绘制信息。
     * - 更新蒙皮网格的骨骼矩阵信息。
     */
    export class SkinnedMeshRendererSystem extends paper.BaseSystem<paper.GameObject> {

        private readonly _drawCallCollecter: DrawCallCollecter = paper.Application.sceneManager.globalEntity.getComponent(DrawCallCollecter)!;
        private readonly _materialFilter: boolean[] = [];

        private _updateDrawCalls(entity: paper.GameObject, checkState: boolean) {
            if (checkState && (!this.enabled || !this.groups[0].containsEntity(entity))) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const renderer = entity.getComponent(SkinnedMeshRenderer)!;
            const { mesh } = renderer;
            const { materials } = renderer;
            const materialCount = materials.length;
            // Clear drawCalls.
            drawCallCollecter.removeDrawCalls(entity);

            if (mesh === null || materialCount === 0) {
                return;
            }

            const primitives = mesh.glTFMesh.primitives;
            const subMeshCount = primitives.length;

            if (DEBUG && subMeshCount === 0) {
                throw new Error();
            }

            const materialFilter = this._materialFilter;
            const matrix = Matrix4.IDENTITY;

            if (materialFilter.length < materialCount) {
                materialFilter.length = materialCount;
            }

            for (let i = 0; i < subMeshCount; ++i) { // Specified materials.
                const materialIndex = primitives[i].material || 0;
                let material: Material | null = null;

                if (materialIndex < materialCount) {
                    material = materials[materialIndex];
                    materialFilter[materialIndex] = true;
                }

                if (material !== null) {
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

            for (let i = 0, l = materialFilter.length; i < l; ++i) { // No specified materials.
                if (materialFilter[i]) {
                    materialFilter[i] = false;
                    continue;
                }
                else if (i >= materialCount) {
                    break;
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
        }

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform, SkinnedMeshRenderer),
            ];
        }

        protected getListeners() {
            return [
                {
                    type: SkinnedMeshRenderer.onMeshChanged, listener: (component: SkinnedMeshRenderer) => {
                        this._updateDrawCalls(component.entity as paper.GameObject, true);
                    }
                },
                {
                    type: SkinnedMeshRenderer.onMaterialsChanged, listener: (component: paper.IComponent) => {
                        this._updateDrawCalls(component.entity as paper.GameObject, true);
                    }
                },
            ];
        }

        public onEntityAdded(entity: paper.GameObject) {
            const renderer = entity.getComponent(SkinnedMeshRenderer)!;

            if (renderer.mesh !== null && renderer.source === null && renderer.boneMatrices === null) { // TODO
                renderer.initialize(true);
            }

            this._updateDrawCalls(entity, false);
        }

        public onEntityRemoved(entity: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(entity);
        }

        public onFrame() {
            for (const entity of this.groups[0].entities) {
                entity.getComponent(SkinnedMeshRenderer)!._update();
            }
        }
    }
}
