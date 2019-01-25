namespace examples.animations {

    export class Tree implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/xbot.prefab.json");
            // Load animation resource.
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

            const gameObject = paper.Prefab.create("Assets/Models/Mixamo/xbot.prefab.json")!;
            const animation = gameObject.getOrAddComponent(egret3d.Animation);
            gameObject.getOrAddComponent(Updater);

            animation.animations = [
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
            ];
            animation.play("Looking_Around");
            //
            const animationController = animation.animationController!;
            const layer = animationController.getOrAddLayer(0);
            const tree = animationController.createAnimationTree(layer.machine, "WalkAndRun");
            animationController.createAnimationNode(tree, "Assets/Animations/Mixamo/Walking.ani.bin", "Walking");
            animationController.createAnimationNode(tree, "Assets/Animations/Mixamo/Running.ani.bin", "Running");
            animation.play("WalkAndRun");
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