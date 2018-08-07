namespace egret3d.oimo {

    const _attributes: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.COLOR_0,
    ];
    const _raycastInfo: RaycastInfo = new RaycastInfo();
    /**
     * 
     */
    export class RayTester extends paper.Behaviour {
        private static _material: Material;

        @paper.serializedField
        public distance: number = 10.0;
        @paper.serializedField
        public collisionMask: paper.CullingMask = paper.CullingMask.Everything;

        private _hitted: boolean = false;
        private _meshFilter: MeshFilter;
        private _meshRender: MeshRenderer;

        public onStart() {
            this._meshFilter = this.gameObject.getComponent(MeshFilter) || this.gameObject.addComponent(MeshFilter);
            this._meshRender = this.gameObject.getComponent(MeshRenderer) || this.gameObject.addComponent(MeshRenderer);

            const mesh = new Mesh(4, 0, _attributes);
            const vertices = mesh.getVertices();
            const colors = mesh.getColors()!;

            vertices[0] = 0.0;
            vertices[1] = 0.0;
            vertices[2] = 0.0;
            vertices[3] = this.distance;
            vertices[4] = 0.0;
            vertices[5] = 0.0;
            vertices[6] = this.distance;
            vertices[7] = 0.0;
            vertices[8] = 0.0;
            vertices[9] = this.distance;
            vertices[10] = 0.0;
            vertices[11] = 0.0;

            for (let i = 0, l = colors.length; i < l; i += 4) {
                colors[i + 0] = 0.0;
                colors[i + 1] = 1.0;
                colors[i + 2] = 0.0;
                colors[i + 3] = 0.7;
            }

            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            mesh.uploadSubVertexBuffer(_attributes);

            RayTester._material = new Material(egret3d.DefaultShaders.LINE);
            this._meshRender.materials = [RayTester._material];
            this._meshFilter.mesh = mesh;
        }

        public onUpdate() {
            const transform = this.gameObject.transform;
            const matrix = transform.getWorldMatrix();
            const from = transform.getPosition();
            const to = matrix.transformVector3(helpVector3A.set(this.distance, 0.0, 0.0));

            const raycastInfo = PhysicsSystem.instance.rayCast(from, to, this.collisionMask, _raycastInfo);
            if (raycastInfo) {
                this._hitted = true;

                const mesh = this._meshFilter.mesh;
                if (mesh) {
                    const v = helpMatrixA.copy(matrix).inverse().transformNormal(raycastInfo.normal).scale(1.0);
                    const vertices = mesh.getVertices();
                    const colors = mesh.getColors()!;

                    vertices[3] = raycastInfo.distance;
                    vertices[4] = 0.0;
                    vertices[5] = 0.0;
                    vertices[6] = raycastInfo.distance;
                    vertices[7] = 0.0;
                    vertices[8] = 0.0;
                    vertices[9] = v.x + raycastInfo.distance;
                    vertices[10] = v.y;
                    vertices[11] = v.z;

                    for (let i = 2 * 4, l = colors.length; i < l; i += 4) {
                        colors[i + 0] = 1.0;
                        colors[i + 1] = 0.0;
                        colors[i + 2] = 0.0;
                        colors[i + 3] = 0.7;
                    }

                    mesh.uploadSubVertexBuffer(_attributes);
                }
            }
            else if (this._hitted) {
                this._hitted = false;

                const mesh = this._meshFilter.mesh;
                if (mesh) {
                    const vertices = mesh.getVertices();
                    const colors = mesh.getColors()!;

                    vertices[3] = this.distance;
                    vertices[4] = 0.0;
                    vertices[5] = 0.0;
                    vertices[6] = this.distance;
                    vertices[7] = 0.0;
                    vertices[8] = 0.0;
                    vertices[9] = this.distance;
                    vertices[10] = 0.0;
                    vertices[11] = 0.0;

                    for (let i = 2 * 4, l = colors.length; i < l; i += 4) {
                        colors[i + 0] = 0.0;
                        colors[i + 1] = 1.0;
                        colors[i + 2] = 0.0;
                        colors[i + 3] = 0.7;
                    }

                    mesh.uploadSubVertexBuffer(_attributes);
                }
            }
        }
    }
}