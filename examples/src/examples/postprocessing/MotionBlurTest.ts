namespace examples.postprocessing {

    export class MotionBlurTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            // Load shaders.
            await RES.getResAsync("shaders/motionBlur/blurDepth.shader.json");
            await RES.getResAsync("shaders/motionBlur/motionBlur.shader.json");

            // Create camera.
            const camera = egret3d.Camera.main;
            camera.backgroundColor.copy(egret3d.Color.BLACK);
            camera.gameObject.addComponent(components.MotionBlurPostProcess);
            camera.gameObject.addComponent(RotationScript);

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            for (let i = 0; i < 500; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.name = "Cube_" + i;
                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                const ranColor = egret3d.Color.create(Math.random(), Math.random(), Math.random());
                renderer.material = renderer.material!.clone().setColor(ranColor);
                cube.transform.position = egret3d.Vector3.create(Math.random() * -50 + 20, Math.random() * -50 + 25, Math.random() * -50 + 20);
            }
        }
    }

    class RotationScript extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public speed: number = 0.01;

        public onUpdate() {
            this.transform.rotateOnAxis(egret3d.Vector3.UP, this.speed);
        }
    }
}