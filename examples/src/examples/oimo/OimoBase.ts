namespace examples.oimo {

    export class OimoBase {
        async start() {
            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
                light.castShadows = true;
            }

            { // Create ground.
                const groundSize = egret3d.Vector3.create(10.0, 0.1, 10.0);
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Ground");
                gameObject.transform.setLocalScale(groundSize);

                const renderer = gameObject.getComponent(egret3d.MeshRenderer)!;
                renderer.castShadows = true;
                renderer.receiveShadows = true;
                renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);

                const rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                const boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);
                rigidbody.type = egret3d.oimo.RigidbodyType.STATIC;
                boxCollider.size = groundSize;
                groundSize.release();
            }

            { // Create cubes.

                for (let i = 0; i < 100; i++) {
                    const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, `Cube_${i}`);
                    gameObject.transform.setLocalPosition(
                        Math.random() * 8.0 - 4.0,
                        Math.random() * 8.0 + 4.0,
                        Math.random() * 8.0 - 4.0
                    );
                    const cubeSize = egret3d.Vector3.create(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5).release();
                    gameObject.transform.setLocalScale(cubeSize);

                    const renderer = gameObject.getComponent(egret3d.MeshRenderer)!;
                    renderer.castShadows = true;
                    renderer.receiveShadows = true;
                    renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);

                    const rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                    const boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);

                    boxCollider.size = cubeSize;
                    rigidbody.mass = 1.0;
                }
            }

            paper.GameObject.globalGameObject.addComponent(TeleportRigidBodies);
        }
    }

    class TeleportRigidBodies extends paper.Behaviour {
        public top: number = 20.0;
        public bottom: number = -20.0;
        public area: number = 10.0;

        public onUpdate() {
            const pos = egret3d.Vector3.create().release();
            const physicsSystem = paper.Application.systemManager.getSystem(egret3d.oimo.PhysicsSystem)!;
            let rigidBody = physicsSystem.oimoWorld.getRigidBodyList();

            while (rigidBody !== null) {
                rigidBody.getPositionTo(pos as any);
                if (pos.y < this.bottom) {
                    pos.y = this.top;
                    pos.x = Math.random() * this.area - this.area * 0.5;
                    pos.z = Math.random() * this.area - this.area * 0.5;
                    rigidBody.setPosition(pos as any);
                    rigidBody.setLinearVelocity(egret3d.Vector3.ZERO as any);
                }

                rigidBody = rigidBody.getNext();
            }
        }
    }
}