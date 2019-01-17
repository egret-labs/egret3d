namespace examples {

    export class PrefabTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(5.0, 10.0, -5.0);
                gameObject.transform.setLocalEulerAngles(160.0, 0.0, 0.0);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            // Load prefab resource.
            await RES.getResAsync("Assets/Motorcycle01.prefab.json");
            // Create prefab.
            paper.Prefab.create("Assets/Motorcycle01.prefab.json")!;

            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
        }
    }

}