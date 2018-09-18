namespace Cube {
    export async function start() {
        await RES.loadConfig("resource/default.res.json", "resource/");

        // Create camera.
        egret3d.Camera.main.fov = 0.8726646259971648;
        egret3d.Camera.main.near = 10;
        egret3d.Camera.main.far = 100;
        egret3d.Camera.main.backgroundColor.set(0.3, 0.3, 0.3, 1.0);
        // egret3d.Camera.main.opvalue = 0.5;
        // egret3d.Camera.main.transform.setPosition(-3.23, 7.82, 4.72);
        // egret3d.Camera.main.transform.setLocalEulerAngles(-58.9, -19.44, -28.90);

        const cubeA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        cubeA.name = "cubeA";
        cubeA.transform.translate(-2.0, 0.0, 3.0);

        const cubeB = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
        cubeB.name = "cubeB";
        (cubeB.renderer as egret3d.MeshRenderer).material = egret3d.Material.create().setTexture("map", await RES.getResAsync("logo.png"));
        cubeB.transform.translate(2.0, 0.0, 3.0);
    }
}