namespace examples.oimo {

    export class Joints implements Example {
        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            paper.Application.systemManager.register(StarterSystem, paper.Application.gameObjectContext);
        }
    }

    class StarterSystem extends paper.BaseSystem<paper.GameObject> {

        public onEnable() {
            //
            egret3d.Camera.main;
            //
            createGridRoom(10.0);

            { // Create ground.
                const groundSize = egret3d.Vector3.create(6.0, 0.2, 6.0).release();
                const gameObject = egret3d.creater.createGameObject("Ground", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                gameObject.transform.setLocalScale(groundSize);

                const rigidbody = gameObject.addComponent(egret3d.oimo.Rigidbody);
                const boxCollider = gameObject.addComponent(egret3d.oimo.BoxCollider);
                rigidbody.type = egret3d.oimo.RigidbodyType.STATIC;
                boxCollider.box.size = groundSize;
            }

            {

            }

        }
    }
}
