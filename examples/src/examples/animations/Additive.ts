namespace examples.animations {

    export class Additve implements Example {

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
            //
            const animationController = animation.animationController!;
            const mask = egret3d.AnimationMask.create("UpperBody");
            mask.createJoints(gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.mesh!).addJoint("mixamorig:Spine");
            //
            const layer1 = animationController.getOrAddLayer(1);
            layer1.mask = mask;
            animation.fadeIn("Head_Hit", 1.3, 0, 1, true);
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            //
            createGridRoom();
        }
    }

    class Updater extends paper.Behaviour {

        public onUpdate() {
            const animation = this.gameObject.getComponent(egret3d.Animation)!;
            const walkState = animation.getState("Walking") as egret3d.AnimationState;
            const runningState = animation.getState("Running") as egret3d.AnimationState;

            this._blending1DStates(walkState, runningState, (Math.sin(paper.clock.time) + 1.0) * 0.5);
        }

        private _blending1DStates(a: egret3d.AnimationState, b: egret3d.AnimationState, lerp: number) {
            a.weight = 1.0 - lerp;
            b.weight = lerp;
            a.timeScale = egret3d.math.lerp(a.totalTime / b.totalTime, 1.0, a.weight);
            b.timeScale = egret3d.math.lerp(b.totalTime / a.totalTime, 1.0, b.weight);
        }
    }
}