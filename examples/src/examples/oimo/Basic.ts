namespace examples.oimo {

    export class Basic {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            paper.Application.systemManager.register(StarterSystem, paper.Application.gameObjectContext);
        }
    }

    class StarterSystem extends paper.BaseSystem<paper.GameObject> {

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(egret3d.Transform, egret3d.oimo.Rigidbody),
            ];
        }

        public onEnable() {
            //
            egret3d.Camera.main.entity.addComponent(behaviors.RotateAround);
            //
            createGridRoom(10.0);

            { // Create ground.
                const groundSize = egret3d.Vector3.create(10.0, 0.2, 10.0).release();
                const entity = egret3d.creater.createGameObject("Ground", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                entity.transform.setLocalScale(groundSize);

                const rigidbody = entity.addComponent(egret3d.oimo.Rigidbody);
                const boxCollider = entity.addComponent(egret3d.oimo.BoxCollider);
                rigidbody.type = egret3d.oimo.RigidbodyType.Kinematic;
                boxCollider.box.size = groundSize;
            }

            { // Create cubes.
                for (let i = 0; i < 100; i++) {
                    const cubeSize = egret3d.Vector3.create(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5).release();
                    const gameObject = egret3d.creater.createGameObject(`Cube_${i}`, {
                        mesh: egret3d.DefaultMeshes.CUBE,
                        material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                        castShadows: true,
                        receiveShadows: true,
                    });
                    gameObject.transform.setLocalPosition(
                        Math.random() * 8.0 - 4.0,
                        Math.random() * 8.0 + 4.0,
                        Math.random() * 8.0 - 4.0
                    );
                    gameObject.transform.setLocalScale(cubeSize);

                    const rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                    const boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);
                    boxCollider.box.size = cubeSize;
                    rigidbody.mass = 1.0;
                }
            }
        }

        public top: number = 20.0;
        public bottom: number = -20.0;
        public area: number = 10.0;

        public onTickCleanup() {
            for (const entity of this.groups[0].entities) {
                if (entity.transform.localPosition.y < this.bottom) {
                    entity.transform.setLocalPosition(
                        Math.random() * this.area - this.area * 0.5,
                        this.top,
                        Math.random() * this.area - this.area * 0.5
                    );
                    entity.getComponent(egret3d.oimo.Rigidbody)!.syncTransform().linearVelocity = egret3d.Vector3.ZERO;
                }
            }
        }
    }
}
