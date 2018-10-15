namespace examples {

    export class RaycastTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");

            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "Mesh");
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                const line = paper.GameObject.create("RaycastTester");
                line.transform.setLocalPosition(0.0, 5.0, -5.0);
                line.addComponent(behaviors.RotateComponent).target = gameObject;
                line.addComponent(behaviors.RendererRaycast).target = gameObject;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "BoxCollider");
                gameObject.transform.setLocalPosition(5.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.aabb.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.aabb.center = egret3d.Vector3.create(1.0, 1.0, 0.0).release();
                }

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.aabb.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.aabb.center = egret3d.Vector3.create(-1.0, -1.0, 0.0).release();
                }

                {
                    const sphereCollider = gameObject.addComponent(egret3d.SphereCollider);
                    sphereCollider.sphere.radius = 2.0;
                    sphereCollider.sphere.center.set(0.0, 0.0, 1.0);
                }

                const line = paper.GameObject.create("RaycastTester");
                line.transform.setLocalPosition(5.0, 5.0, -5.0);
                line.addComponent(behaviors.RotateComponent).target = gameObject;
                line.addComponent(behaviors.ColliderRaycast).target = gameObject;
            }
        }
    }
}