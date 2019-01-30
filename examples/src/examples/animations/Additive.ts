namespace examples.animations {

    export class Additive implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/ybot.prefab.json");
            // Load animation resource.
            await RES.getResAsync("Assets/Animations/Mixamo/Idle.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Head_Hit.ani.bin");

            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaOutput = true;
            }
            //
            const gameObject = paper.Prefab.create("Assets/Models/Mixamo/ybot.prefab.json")!;
            const animation = gameObject.getOrAddComponent(egret3d.Animation);
            animation.animations = [
                RES.getRes("Assets/Animations/Mixamo/Idle.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Head_Hit.ani.bin"),
            ];
            animation.play("Running");
            gameObject.addComponent(behaviors.AnimationHelper);
            //
            const animationController = animation.animationController!;
            const mask = egret3d.AnimationMask.create("UpperBody");
            mask.createJoints(gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.mesh!).addJoint("mixamorig:Spine");
            //
            const layer1 = animationController.getOrAddLayer(1);
            layer1.additive = true;
            layer1.mask = mask;
            animation.fadeIn("Head_Hit", 1.3, 0, 1);
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            //
            createGridRoom();
        }
    }
}