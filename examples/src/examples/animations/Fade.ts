namespace examples.animations {

    export class Fade implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json");
            await RES.getResAsync("Assets/Models/Mixamo/ybot.prefab.json");
            // Load animation resource.
            await RES.getResAsync("Assets/Animations/Mixamo/Looking_Around.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Hip_Hop_Dancing.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");

            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaOutput = true;
            }

            const gameObjectX = paper.Prefab.create("Assets/Models/Mixamo/xbot.prefab.json")!;
            const gameObjectY = paper.Prefab.create("Assets/Models/Mixamo/ybot.prefab.json")!;
            const animationX = gameObjectX.getOrAddComponent(egret3d.Animation);
            const animationY = gameObjectY.getOrAddComponent(egret3d.Animation);
            //
            animationX.animations = animationY.animations = [
                RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Hip_Hop_Dancing.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
            ];
            animationX.play("Hip_Hop_Dancing");
            animationY.play("Running");
            gameObjectX.transform.setLocalPosition(1.0, 0.0, 0.0);
            gameObjectY.transform.setLocalPosition(-1.0, 0.0, 0.0);
            //
            gameObjectX.addComponent(behaviors.AnimationHelper);
            gameObjectY.addComponent(behaviors.AnimationHelper);
            //
            for (const renderer of gameObjectX.getComponentsInChildren(egret3d.SkinnedMeshRenderer)) {
                renderer.castShadows = true;
                renderer.receiveShadows = true;
            }

            for (const renderer of gameObjectY.getComponentsInChildren(egret3d.SkinnedMeshRenderer)) {
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
                    modelComponent.select(gameObjectX);
                    paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent)!.openComponents(behaviors.AnimationHelper);
                }, 1000.0);
            }
        }
    }
}