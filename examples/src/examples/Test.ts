namespace examples {

    export class Test implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            //
            createGridRoom();

            egret3d.creater.createGameObject(
                "xxxx", {
                    mesh: egret3d.MeshBuilder.createCapsule(),
                    materials: [egret3d.DefaultMaterials.MESH_PHONG],
                }
            );
        }
    }
}
