namespace examples.postprocessing {

    export class ThermaVisionTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            // Load shaders.
            await RES.getResAsync("shaders/thermaVision/thermaVision.shader.json");

            // Create camera.
            const camera = egret3d.Camera.main;
            // camera.backgroundColor.copy(egret3d.Color.BLACK);
            camera.gameObject.addComponent(components.ThermaVisionPostProcess);

            for (let i = 0; i < 500; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.name = "Cube_" + i;
                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                const ranColor = egret3d.Color.create(Math.random(), Math.random(), Math.random());
                renderer.material = renderer.material!.clone().setColor(ranColor);
                cube.transform.position = egret3d.Vector3.create(Math.random() * -50 + 20, Math.random() * -50 + 25, Math.random() * -50 + 20);
            }
        }
    }
}