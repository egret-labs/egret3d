namespace examples {

    export class InstancedTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            // await RES.getResAsync("Assets/Motorcycle01.prefab.json");
            // // Create prefab.
            // paper.Prefab.create("Assets/Motorcycle01.prefab.json")!;
            // //
            // egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            // //
            // createGridRoom();

            egret3d.Camera.main;

            const mesh = egret3d.DefaultMeshes.CUBE.clone();
            const material = egret3d.DefaultMaterials.MESH_BASIC.clone();
            // material.addDefine(egret3d.ShaderDefine.USE_COLOR);
            material.enableGPUInstancing = true;
            for (let i = 0; i < 5; i++) {
                const instance = egret3d.creater.createGameObject(`instance_${i}`, { mesh, material });
                instance.transform.translate(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            }
        }
    }

}