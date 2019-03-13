namespace examples.oimo {

    export class TouchJointSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _touchPlane: egret3d.Plane = egret3d.Plane.create();
        private readonly _ray: egret3d.Ray = egret3d.Ray.create();
        private readonly _raycastInfo: egret3d.RaycastInfo = egret3d.RaycastInfo.create();
        private _touchEntity: paper.GameObject | null = null;

        public onFrame() {
            const { defaultPointer } = egret3d.inputCollecter;

            if (this._touchEntity) {
                if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse)) {
                    this._touchEntity.destroy();
                    this._touchEntity = null;
                }
                else {
                    egret3d.Camera.main.stageToRay(defaultPointer.position.x, defaultPointer.position.y, this._ray);

                    if (this._touchPlane.raycast(this._ray, this._raycastInfo)) {
                        this._touchEntity.transform.localPosition = this._raycastInfo.position;
                    }
                }
            }
            else if (defaultPointer.isDown(egret3d.PointerButtonsType.LeftMouse)) {
                const physicsSystem = paper.Application.systemManager.getSystem(egret3d.oimo.PhysicsSystem)!;
                // Create ray from stage.
                egret3d.Camera.main.stageToRay(defaultPointer.position.x, defaultPointer.position.y, this._ray);
                // 
                this._raycastInfo.clear();

                if (physicsSystem.raycast(this._ray, paper.Layer.Default, 0.0, this._raycastInfo)) {
                    const rigidbody = this._raycastInfo.rigidbody as egret3d.oimo.Rigidbody;

                    if (rigidbody.type === egret3d.oimo.RigidbodyType.DYNAMIC) { // Only add joint to dynamic body.
                        // Update touch plane.
                        this._touchPlane.fromPoint(this._raycastInfo.position);
                        // Create touch entity.
                        this._touchEntity = paper.GameObject.create("Touch Entity");
                        // Set transform.
                        this._touchEntity.transform
                            .setLocalPosition(this._raycastInfo.position)
                            .lookRotation(this._ray.direction);
                        //
                        this._touchEntity.addComponent(ColliderRaycaster);
                        // Set rigidbogy type.
                        this._touchEntity.addComponent(egret3d.oimo.Rigidbody).type = egret3d.oimo.RigidbodyType.KINEMATIC;
                        // Add joint.
                        const joint = this._touchEntity.addComponent(egret3d.oimo.SphericalJoint);
                        joint.collisionEnabled = false;
                        joint.springDamper.frequency = 4.0;
                        joint.springDamper.dampingRatio = 0.0;
                        joint.connectedRigidbody = this._raycastInfo.rigidbody as egret3d.oimo.Rigidbody;
                    }
                }
            }
        }
    }

    export class ColliderRaycaster extends paper.Behaviour {
        public readonly ray: egret3d.Ray = egret3d.Ray.create();
        public readonly normal: egret3d.Vector3 = egret3d.Vector3.create();
        public readonly raycastInfo: egret3d.RaycastInfo = egret3d.RaycastInfo.create();

        protected _lineMesh: egret3d.Mesh | null = null;

        public onAwake() {
            const meshFilter = this.gameObject.getOrAddComponent(egret3d.MeshFilter);
            const meshRenderer = this.gameObject.getOrAddComponent(egret3d.MeshRenderer);

            this._lineMesh = meshFilter.mesh = egret3d.Mesh.create(3, 3, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.COLOR_0]);
            this._lineMesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;
            this._lineMesh.setIndices([0, 1, 2], 0);
            this._lineMesh.setIndices([0, 1], this._lineMesh.addSubMesh(2, 1, gltf.MeshPrimitiveMode.Points));
            this._lineMesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                0.0, 0.0, 0.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
            ]);
            this._lineMesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
                1.0, 1.0, 1.0, 1.0,
            ]);

            meshRenderer.materials = [
                egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED)
                    .addDefine(egret3d.ShaderDefine.USE_COLOR),
                egret3d.Material.create(egret3d.DefaultShaders.POINTS)
                    .addDefine(egret3d.ShaderDefine.USE_COLOR)
                    .setFloat(egret3d.ShaderUniformName.Size, 10.0)
            ];
        }

        protected _updateRay() {
            const transform = this.gameObject.transform;
            const ray = this.ray;
            ray.origin.copy(transform.position);
            transform.getForward(ray.direction);
        }

        public onLateUpdate() {
            const physicsSystem = paper.Application.systemManager.getSystem(egret3d.oimo.PhysicsSystem)!;
            const mesh = this._lineMesh!;
            const colors = mesh.getColors()!;
            const vertices = mesh.getVertices()!;
            const raycastInfo = this.raycastInfo;
            const isHit = raycastInfo.rigidbody !== null;
            raycastInfo.clear();

            const normal = raycastInfo.normal = this.normal;
            this._updateRay();

            if (physicsSystem.raycast(this.ray, paper.Layer.Default, 0.0, raycastInfo)) {
                normal.applyDirection(this.gameObject.transform.worldToLocalMatrix);

                vertices[3] = 0.0;
                vertices[4] = 0.0;
                vertices[5] = raycastInfo.distance;
                vertices[6] = normal.x;
                vertices[7] = normal.y;
                vertices[8] = normal.z + raycastInfo.distance;

                for (let i = 0, l = colors.length; i < l; i += 4) {
                    colors[i + 0] = 1.0;
                    colors[i + 1] = 0.0;
                    colors[i + 2] = 0.0;
                }

                mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
                mesh.uploadVertexBuffer(gltf.AttributeSemantics.COLOR_0);
            }
            else if (isHit) {
                vertices[3] = 0.0;
                vertices[4] = 0.0;
                vertices[5] = 20.0;
                vertices[6] = 0.0;
                vertices[7] = 0.0;
                vertices[8] = 20.0;

                for (let i = 0, l = colors.length; i < l; i += 4) {
                    colors[i + 0] = 0.0;
                    colors[i + 1] = 1.0;
                    colors[i + 2] = 0.0;
                }

                mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
                mesh.uploadVertexBuffer(gltf.AttributeSemantics.COLOR_0);
            }
        }
    }
}
