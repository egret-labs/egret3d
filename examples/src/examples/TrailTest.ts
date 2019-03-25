namespace examples {

    export class TrailTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            const texture = await RES.getResAsync("threejs/textures/sprite0.jpg");

            // create main camera
            egret3d.Camera.main;

            // create stage
            createGridRoom();

            const trailObject = egret3d.creater.createGameObject();
            const trailComponent = trailObject.addComponent(egret3d.trail.TrailComponent);
            const meshRenderer = trailObject.addComponent(egret3d.MeshRenderer);
            if (meshRenderer) {
                meshRenderer.material = egret3d.Material.create().setTexture(texture);
                // meshRenderer.material.addDefine(egret3d.ShaderDefine.USE_COLOR);
                meshRenderer.material.setCullFace(false);
            } else {
                console.error('no MeshRenderer on Trail object');
                return;
            }
            trailComponent.play();
        }
    }
}
