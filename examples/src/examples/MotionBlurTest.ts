namespace examples {

    export class MotionBlurTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            await RES.getResAsync("shaders/motionBlur/blurDepth.shader.json");
            await RES.getResAsync("shaders/motionBlur/motionBlur.shader.json");

            // Create camera.
            const camera = egret3d.Camera.main;
            camera.backgroundColor.copy(egret3d.Color.BLACK);
            const motionBlur = new postprocessing.MotionBlurPostProcess();
            motionBlur.velocityFactor = 1.0;
            motionBlur.samples = 32;
            camera.postQueues.push(motionBlur);

            camera.gameObject.addComponent(RotationScript);

            for (let i = 0; i < 500; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.name = "cube" + i;
                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                const ranColor = egret3d.Color.create(Math.random(), Math.random(), Math.random());
                renderer.material = renderer.material!.clone().setColor(ranColor);
                cube.transform.position = egret3d.Vector3.create(Math.random() * -50 + 20, Math.random() * -50 + 25, Math.random() * -50 + 20);
            }
        }
    }

    class RotationScript extends paper.Behaviour{
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public speed:number = 0.02;
        onUpdate(){
            this.transform.rotateOnAxis(egret3d.Vector3.UP, this.speed);
        }
    }

}