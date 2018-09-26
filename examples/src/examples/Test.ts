namespace Test {
    export async function start() {
        await RES.loadConfig("default.res.json", "resource/");
        // Create camera.
        egret3d.Camera.main;

        // fatguy-low
        await RES.getResAsync("Assets/fatguy_low.prefab.json");

        const obj = paper.Prefab.create("Assets/fatguy_low.prefab.json");
        const ani = obj.getComponentInChildren(egret3d.Animation);
        ani.play("walk");
    }
}