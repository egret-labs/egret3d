namespace egret3d {
    /**
     * 网格渲染组件系统。
     * - 为网格渲染组件生成绘制信息。
     */
    export class MeshRendererSystem extends paper.BaseSystem {
        protected readonly _interests = [
            {
                componentClass: MeshFilter,
                listeners: [{
                    type: MeshFilter.onMeshChanged, listener: (component: paper.BaseComponent) => {
                        this._updateDrawCalls(component.gameObject);

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
                        this._updateDrawCalls(component.gameObject);
                    }
                }]
            },
        ];
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);

        private _updateDrawCalls(gameObject: paper.GameObject, pass?: boolean) {
            if (
                !pass &&
                (!this._enabled || !this._groups[0].hasGameObject(gameObject))
            ) {
                return;
            }

            const drawCallCollecter = this._drawCallCollecter;
            const filter = gameObject.getComponent(MeshFilter)!;
            const renderer = gameObject.renderer!;
            const materials = renderer.materials;

            drawCallCollecter.removeDrawCalls(renderer);
            if (!filter.mesh || materials.length === 0) {
                return;
            }

            filter.mesh._createBuffer(); // TODO 更合适的时机。
            drawCallCollecter.renderers.push(renderer);

            let subMeshIndex = 0;
            for (const primitive of filter.mesh.glTFMesh.primitives) {
                const drawCall = DrawCall.create();
                drawCall.renderer = renderer;
                drawCall.matrix = gameObject.transform.localToWorldMatrix;
                drawCall.subMeshIndex = subMeshIndex++;
                drawCall.mesh = filter.mesh;
                drawCall.material = materials[primitive.material!] || DefaultMaterials.MISSING;
                drawCallCollecter.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._updateDrawCalls(gameObject, true);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            this._updateDrawCalls(gameObject, true);
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCallCollecter.removeDrawCalls(gameObject.renderer!);
            }
        }
    }
}
