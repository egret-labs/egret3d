namespace egret3d.ammo {

    const _helpVector3A = new Vector3();
    const _helpMatrix = new Matrix();
    const _attributes: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.COLOR_0,
    ];
    /**
     * 
     */
    export class RayTest extends paper.Behaviour {
        private static readonly _material: Material = new Material("line");

        @paper.serializedField
        public distance: number = 10.0;
        @paper.serializedField
        public collisionGroups: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.DebrisFilter;
        @paper.serializedField
        public collisionMask: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.AllFilter;

        private _hitted: boolean = false;
        private _meshFilter: MeshFilter;
        private _meshRender: MeshRenderer;

        public onStart() {
            this._meshFilter = this.gameObject.getComponent(MeshFilter) || this.gameObject.addComponent(MeshFilter);
            this._meshRender = this.gameObject.getComponent(MeshRenderer) || this.gameObject.addComponent(MeshRenderer);

            const mesh = new Mesh(3, null, _attributes);
            const vertices = mesh.getVertices();
            const colors = mesh.getColors();

            vertices[0] = 0.0;
            vertices[1] = 0.0;
            vertices[2] = 0.0;
            vertices[3] = this.distance;
            vertices[4] = 0.0;
            vertices[5] = 0.0;
            vertices[6] = this.distance;
            vertices[7] = 0.0;
            vertices[8] = 0.0;

            for (let i = 0, l = colors.length; i < l; i += 4) {
                colors[i + 0] = 0.0;
                colors[i + 1] = 1.0;
                colors[i + 2] = 0.0;
                colors[i + 3] = 1.0;
            }

            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;
            mesh.uploadSubVertexBuffer(_attributes);

            RayTest._material.setShader(DefaultShaders.LINE);
            this._meshRender.materials = [RayTest._material];
            this._meshFilter.mesh = mesh;
        }

        public onUpdate() {
            const physicsSystem = paper.Application.systemManager.getSystem(PhysicsSystem);
            if (!physicsSystem || !physicsSystem.enabled) {
                return;
            }

            const transform = this.gameObject.transform;
            const matrix = transform.getWorldMatrix();
            const from = transform.getPosition();
            const to = matrix.transformVector3(_helpVector3A.set(this.distance, 0.0, 0.0));

            const raycastInfo = physicsSystem.rayTest(from, to, this.collisionGroups, this.collisionMask);
            if (raycastInfo) {
                this._hitted = true;

                const mesh = this._meshFilter.mesh;
                if (mesh) {
                    const v = _helpMatrix.copy(matrix).inverse().transformNormal(raycastInfo.normal).scale(1.0);
                    const vertices = mesh.getVertices();
                    vertices[3] = raycastInfo.distance;
                    vertices[4] = 0.0;
                    vertices[5] = 0.0;
                    vertices[6] = v.x + raycastInfo.distance;
                    vertices[7] = v.y;
                    vertices[8] = v.z;
                    mesh.uploadSubVertexBuffer(gltf.MeshAttributeType.POSITION);
                }
            }
            else {
                if (this._hitted) {
                    const mesh = this._meshFilter.mesh;
                    if (mesh) {
                        const vertices = mesh.getVertices();
                        vertices[3] = this.distance;
                        vertices[4] = 0.0;
                        vertices[5] = 0.0;
                        vertices[6] = this.distance;
                        vertices[7] = 0.0;
                        vertices[8] = 0.0;
                        mesh.uploadSubVertexBuffer(gltf.MeshAttributeType.POSITION);
                    }
                }

                this._hitted = false;
            }
        }
    }
}