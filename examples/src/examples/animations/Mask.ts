namespace examples.animations {

    export class Mask implements Example {

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
            animation.fadeIn("Walking", 0.3, 0, 0);
            animation.fadeIn("Looking_Around", 0.3, 0, 1)!.weight = 0.7;
            //
            const animationController = animation.animationController!;
            const layer = animationController.getOrAddLayer(1);
            const mask = layer.mask = egret3d.AnimationMask.create("UpperBody");
            mask.createJoints(gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.mesh!).addJoint("mixamorig:Spine2");
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }
}