namespace paper.editor {
    const _step = 5;
    /**
     * @internal
     */
    export class GridDrawer extends BaseComponent {
        private readonly _gridA: GameObject = this._createGrid("Grid A");
        private readonly _gridB: GameObject = this._createGrid("Grid B", 100.0 * _step, 100 * _step);

        private _createGrid(name: string, size: number = 100.0, divisions: number = 100) {
            const step = size / divisions;
            const halfSize = size / 2;
            const vertices: number[] = [];

            for (let i = 0, k = - halfSize; i <= divisions; i++ , k += step) {
                vertices.push(- halfSize, 0, k);
                vertices.push(halfSize, 0, k);
                vertices.push(k, 0, - halfSize);
                vertices.push(k, 0, halfSize);
            }

            const mesh = egret3d.Mesh.create(vertices.length, 0, [gltf.AttributeSemantics.POSITION]);
            mesh.name = "editor/grid.mesh.bin";

            mesh.setAttributes(gltf.AttributeSemantics.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            const gameObject = EditorMeshHelper.createGameObject(name, mesh, egret3d.DefaultMaterials.MESH_BASIC.clone());

            return gameObject;
        }

        public initialize() {
            super.initialize();

            this._gridA.parent = this.gameObject;
            this._gridB.parent = this.gameObject;

            const mA = (this._gridA.renderer as egret3d.MeshRenderer).material!;
            const mB = (this._gridB.renderer as egret3d.MeshRenderer).material!;

            mA.setBlend(gltf.BlendMode.Blend, RenderQueue.Transparent);
            mB.setBlend(gltf.BlendMode.Blend, RenderQueue.Transparent);
        }

        public update() {
            const camera = egret3d.Camera.editor;
            const aaa = camera.gameObject.getComponent(OrbitControls)!;
            const target = aaa.lookAtPoint.clone().add(aaa.lookAtOffset);
            const eyeDistance = (10000.0 - target.getDistance(camera.gameObject.transform.position)) * 0.01; // TODO

            const d = (eyeDistance % 1.0);
            const s = d * (_step - 1) + 1.0;

            this._gridA.transform.setLocalScale(s * _step, 0.0, s * _step);
            this._gridB.transform.setLocalScale(s, 0.0, s);

            const mA = (this._gridA.renderer as egret3d.MeshRenderer).material!;
            const mB = (this._gridB.renderer as egret3d.MeshRenderer).material!;

            mA.opacity = 1.0 * 0.2;
            mB.opacity = 0.2 * 0.2;
        }
    }
}