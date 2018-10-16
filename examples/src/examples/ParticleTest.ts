namespace examples {

    export class ParticleTest {

        async  start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;
            // Load prefab resource.
            await RES.getResAsync("Assets/texiao_anhei13x13.prefab.json");
            // Create prefab.
            const gameObject = paper.Prefab.create("Assets/texiao_anhei13x13.prefab.json");

            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }

}