namespace examples.animations {

    export class ApplyRootMotion implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json");
            await RES.getResAsync("Assets/Models/Mixamo/ybot.prefab.json");
            // Load animation resource.
            await RES.getResAsync("Assets/Animations/Mixamo/Idle.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Idle_1.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Looking_Around.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");
            (await RES.getResAsync("Assets/Animations/Mixamo/Hip_Hop_Dancing.ani.bin") as egret3d.AnimationAsset).getAnimationClip("")!.root = 0;
            (await RES.getResAsync("Assets/Animations/Mixamo/Hip_Hop_Dancing_1.ani.bin") as egret3d.AnimationAsset).getAnimationClip("")!.root = 0;
            (await RES.getResAsync("Assets/Animations/Mixamo/Samba_Dancing.ani.bin") as egret3d.AnimationAsset).getAnimationClip("")!.root = 0;
            (await RES.getResAsync("Assets/Animations/Mixamo/Samba_Dancing_1.ani.bin") as egret3d.AnimationAsset).getAnimationClip("")!.root = 0;

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
            animationX.applyRootMotion = true;
            animationY.applyRootMotion = true;
            //
            animationX.animations = animationY.animations = [
                RES.getRes("Assets/Animations/Mixamo/Idle.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Idle_1.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Hip_Hop_Dancing.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Hip_Hop_Dancing_1.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Samba_Dancing.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Samba_Dancing_1.ani.bin"),
            ];
            animationX.play("Samba_Dancing");
            animationY.play("Samba_Dancing_1");
            gameObjectX.transform.setLocalPosition(1.0, 0.0, 0.0);
            gameObjectY.transform.setLocalPosition(-1.0, 0.0, 0.0);
            //
            gameObjectX.addComponent(behaviors.AnimationHelper);
            gameObjectY.addComponent(behaviors.AnimationHelper);
            gameObjectX.addComponent(behaviors.PositionReseter).box.copy(egret3d.Box.ONE).expand(19.0);
            gameObjectY.addComponent(behaviors.PositionReseter).box.copy(egret3d.Box.ONE).expand(19.0);
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