namespace examples {

    export class SceneTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            debugger;
            // Load scene resource.
            await RES.getResAsync("Assets/Art/changjing/Scenes/Scene_11X9.scene.json");
            debugger;
            // Create scene.
            paper.Scene.create("Assets/Art/changjing/Scenes/Scene_11X9.scene.json");
            paper.Scene.create("Assets/Art/changjing/Scenes/Scene_11X9.scene.json");
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }

    }
}