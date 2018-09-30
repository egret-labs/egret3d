namespace SceneTest {
    export async function start() {
        // Load resource config.
        await RES.loadConfig("resource/default.res.json", "resource/");
        // Load scene resource.
        await RES.getResAsync("Assets/Art/changjing/Scenes/Scene_11X9.scene.json");
        // Create scene.
        paper.Scene.create("Assets/Art/changjing/Scenes/Scene_11X9.scene.json");
    }
}