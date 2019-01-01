namespace examples {

    export class Test implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;
        }
    }

}