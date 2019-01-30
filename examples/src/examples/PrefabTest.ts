namespace examples {

    export class PrefabTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Motorcycle01.prefab.json");
            // Create prefab.
            paper.Prefab.create("Assets/Motorcycle01.prefab.json")!;
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            //
            createGridRoom();
        }
    }

}