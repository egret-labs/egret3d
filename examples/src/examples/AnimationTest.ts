namespace examples {

    export class AnimationTest {
        async  start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;
            // Load prefab resource.
            await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
            // Create prefab.
            const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
            gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");

            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }

}