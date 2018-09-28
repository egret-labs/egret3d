namespace OimoBase {
    export async function start() {
        // Create camera.
        egret3d.Camera.main;

        { // Create light.
            const light = paper.GameObject.create("light");
            const lightComponent = light.addComponent(egret3d.DirectionalLight);
            light.transform.setLocalPosition(1.0, 10.0, -1.0);
            light.transform.lookAt(egret3d.Vector3.ZERO);

            lightComponent.intensity = 0.5;
        }

        { // Create ground.
            const groundSize = egret3d.Vector3.create(20.0, 0.1, 20.0);
            const ground = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "ground");
            ground.transform.setLocalScale(groundSize);

            const renderer = ground.getComponent(egret3d.MeshRenderer)!;
            renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);

            const rigidbody = ground.addComponent(egret3d.oimo.Rigidbody);
            const boxCollider = ground.addComponent(egret3d.oimo.BoxCollider);
            rigidbody.type = egret3d.oimo.RigidbodyType.STATIC;
            boxCollider.size = groundSize;
            groundSize.release();
        }

        { // Create cubes.
            const cubeSize = egret3d.Vector3.create(1.0, 1.0, 1.0);

            for (let i = 0; i < 20; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, `cube_${i}`);
                cube.transform.setLocalPosition(
                    Math.random() * 8.0 - 4.0,
                    Math.random() * 8.0 + 4.0,
                    Math.random() * 8.0 - 4.0
                );
                cube.transform.setLocalScale(cubeSize);

                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);

                const rigidbody = cube.addComponent(egret3d.oimo.Rigidbody);
                const boxCollider = cube.addComponent(egret3d.oimo.BoxCollider);

                boxCollider.size = cubeSize;
                rigidbody.mass = 0.1;
            }
        }
    }
}