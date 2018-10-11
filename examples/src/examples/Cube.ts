namespace examples {
    export class Cube {
        async  start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");

            // Create camera.
            egret3d.Camera.main;

            const cubeA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            cubeA.name = "cubeA";
            cubeA.transform.translate(-2.0, 0.0, 0.0);

            const cubeB = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            cubeB.name = "cubeB";
            cubeB.transform.translate(2.0, 0.0, 0.0);
            (cubeB.renderer as egret3d.MeshRenderer).material = egret3d.Material.create().setTexture(await RES.getResAsync("logo.png"));
        }
    }
}