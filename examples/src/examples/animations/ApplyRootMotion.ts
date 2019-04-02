namespace examples.animations {

    export class ApplyRootMotion implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json");
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

            const gameObject = paper.Prefab.create("Assets/Models/Mixamo/xbot.prefab.json")!;
            const animation = gameObject.getOrAddComponent(egret3d.Animation);
            animation.applyRootMotion = true;
            //
            animation.animations = [
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
            animation.play("Samba_Dancing");
            gameObject.transform.setLocalPosition(0.0, 0.0, 0.0).setLocalEulerAngles(0.0, 135.0, 0.0);
            //
            gameObject.addComponent(behaviors.AnimationHelper);
            gameObject.addComponent(behaviors.PositionReseter).box.copy(egret3d.Box.ONE).expand(19.0);
            //
            for (const renderer of gameObject.getComponentsInChildren(egret3d.SkinnedMeshRenderer)) {
                renderer.castShadows = true;
                renderer.receiveShadows = true;
            }
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.LookAtTarget).target = gameObject;
            //
            // createGridRoom();
            //
            selectGameObjectAndComponents(gameObject, behaviors.AnimationHelper);
        }
    }
}