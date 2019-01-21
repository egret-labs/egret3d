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

            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
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

            for (const renderer of gameObject.getComponentsInChildren(egret3d.SkinnedMeshRenderer)) {
                renderer.castShadows = true;
                renderer.receiveShadows = true;
            }
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            //
            createGridRoom();
            //
            const modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
            if (modelComponent) {
                setTimeout(() => {
                    modelComponent.select(gameObject);
                    paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent)!.openComponents(behaviors.AnimationHelper);
                }, 1000.0);
            }
        }
    }
}