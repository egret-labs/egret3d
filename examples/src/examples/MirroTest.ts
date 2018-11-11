namespace examples {

    export class MirroTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("shaders/reflector.shader.json");
            // Create camera.
            egret3d.Camera.main;

            const plane = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
            plane.renderer!.material = egret3d.Material.create(RES.getRes("shaders/reflector.shader.json"));
            // plane.renderer!.material = egret3d.DefaultMaterials.MESH_BASIC.clone()
            //     .setTexture(egret3d.DefaultTextures.GRAY)
            //     .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5);
            plane.addComponent(behaviors.Reflector);

            const cubeA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            cubeA.name = "cubeA";
            cubeA.transform.translate(0.0, 0.0, -2.0);
        }
    }

}