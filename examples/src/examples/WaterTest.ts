namespace examples {

    export class WaterTest extends BaseExample {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/"); // Load scene resource.

            await RES.getResAsync("textures/water/water_surface03_generic_ab.image.json");
            await RES.getResAsync("textures/water/water_smallwave01_generic_n.image.json");
            await RES.getResAsync("shaders/water/water.shader.json");
            // Create camera.
            const camera = egret3d.Camera.main; 

            const waterImg = RES.getRes("textures/water/water_surface03_generic_ab.image.json");
            const waterNormal = RES.getRes("textures/water/water_smallwave01_generic_n.image.json");

            const light = paper.GameObject.create("ligth");
            light.transform.setPosition(0.0, 1.0, 0.0);
            light.transform.setLocalEulerAngles(50.0, -30.0, 0.0);

            const lightDir = egret3d.Vector3.create();
            light.transform.getForward(lightDir);

            // //
            const water = paper.GameObject.create("water")!;
            const effect = water.addComponent(behaviors.WaterEffect);
            effect.lightDir.copy(lightDir);
            water.transform.setEulerAngles(90.0, 0.0, 0.0);

            const meshFilter = water.getOrAddComponent(egret3d.MeshFilter);
            meshFilter.mesh = egret3d.MeshBuilder.createPlane(10, 10);
            const meshRender = water.getOrAddComponent(egret3d.MeshRenderer);
            meshRender.material = egret3d.Material.create(RES.getRes("shaders/water/water.shader.json"));
            meshRender.material
                .setTexture("_MainTex", waterImg).setTexture("_NormalTex1", waterNormal).setTexture("_NormalTex2", waterNormal)
                .setVector4v("_NormalTex1_ST", [20, 12, 0.95, -0.24]).setVector4v("_NormalTex2_ST", [8, 6, -0.07, -0.01])
                .setVector3("lightDir", lightDir).setColor("lightColor", egret3d.Color.WHITE);
        }
    }

}