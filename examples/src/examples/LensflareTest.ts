namespace examples {

    export class LensflareTest {

        async  start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            await RES.getResAsync("logo.png")

            await RES.getResAsync("shaders/lensflare/a.shader.json");
            await RES.getResAsync("shaders/lensflare/b.shader.json");
            await RES.getResAsync("shaders/lensflare/lensflare.shader.json");
            await RES.getResAsync("textures/lensflare/lensflare0.png");
            await RES.getResAsync("textures/lensflare/lensflare1.png");
            await RES.getResAsync("textures/lensflare/lensflare2.png");
            await RES.getResAsync("textures/lensflare/lensflare3.png");
            // Create camera.
            egret3d.Camera.main;

            //
            const lensflare0 = RES.getRes("textures/lensflare/lensflare0.png");
            const lensflare1 = RES.getRes("textures/lensflare/lensflare1.png");
            const lensflare2 = RES.getRes("textures/lensflare/lensflare2.png");
            const lensflare3 = RES.getRes("textures/lensflare/lensflare3.png");

            const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "cube");
            cube.transform.setLocalPosition(0, -1, 0);
            cube.renderer!.material = cube.renderer!.material!.clone();
            cube.renderer!.material!.setTexture(RES.getRes("logo.png"));

            const lensflareObj = paper.GameObject.create("Lensflare");
            const lensflareCom = lensflareObj.addComponent(behaviors.LensflareEffect);
            lensflareCom.addElement({ texture: lensflare0, size: 700, distance: 0, color: egret3d.Color.create(0.55, 0.9, 1.0, 1.0), rotate: true, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 60, distance: 0.6, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 0.7, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 120, distance: 0.9, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
            lensflareCom.addElement({ texture: lensflare3, size: 70, distance: 1, color: egret3d.Color.WHITE.clone(), rotate: false, angle: 0 });
        }
    }
}