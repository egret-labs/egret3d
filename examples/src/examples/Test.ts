namespace Test {
    export async function start() {
        await RES.loadConfig("default.res.json", "resource/");
        // Create camera.
        egret3d.Camera.main;
    }
}