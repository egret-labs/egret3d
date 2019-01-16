namespace examples.animations {

    export class Fade implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json");
            // Load animation resource.
            await RES.getResAsync("Assets/Animations/Mixamo/Looking_Around.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");

            paper.GameObject.globalGameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {

        public onAwake() {
            //
            createGridRoom();
            //
            const gameObject = paper.Prefab.create("Assets/Models/Mixamo/xbot.prefab.json")!;
            const animation = gameObject.getOrAddComponent(egret3d.Animation);
            animation.animations = [
                RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
            ];
            animation.play("Running");
            //
            gameObject.addComponent(behaviors.AnimationHelper);
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
            //
            const modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
            if (modelComponent) {
                setTimeout(() => {
                    modelComponent.select(gameObject);
                }, 1000.0);
            }
        }
    }
}