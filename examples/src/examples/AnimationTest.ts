namespace examples {

    export class AnimationTest implements Example {
        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load prefab resource.
            await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
            // Create camera.
            egret3d.Camera.main;
            // Create prefab.
            const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
            const animation = gameObject.getComponentInChildren(egret3d.Animation)!;
            animation.play("run01");

            //
            gameObject.addComponent(behaviors.AnimationPlayer);
            gameObject.addComponent(AnimationEventListener);
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }

    class AnimationEventListener extends paper.Behaviour {
        public onAnimationEvent(animationEvent: egret3d.AnimationEvent) {
            console.log(animationEvent.type, animationEvent.animationState.animationClip.name);
        }
    }
}