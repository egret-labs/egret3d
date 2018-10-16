namespace examples {

    export class BlendingTest {
        async  start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");

            await RES.getResAsync("UV_Grid_Sm.jpg");
            await RES.getResAsync("sprite0.jpg");
            await RES.getResAsync("sprite0.png");
            await RES.getResAsync("lensflare0.png");
            await RES.getResAsync("lensflare0_alpha.png");
            // await resizeBy.

            // Create camera.
            egret3d.Camera.main;
            egret3d.Camera.main.gameObject.transform.setLocalPosition(0, 0, -10);
            egret3d.Camera.main.gameObject.transform.lookAt(egret3d.Vector3.ZERO);

            const images = [];
            images.push(RES.getRes("UV_Grid_Sm.jpg") as egret3d.Texture);
            images.push(RES.getRes("sprite0.jpg") as egret3d.Texture);
            images.push(RES.getRes("sprite0.png") as egret3d.Texture);
            images.push(RES.getRes("lensflare0.png") as egret3d.Texture);
            images.push(RES.getRes("lensflare0_alpha.png") as egret3d.Texture);

            const blends = [gltf.BlendMode.None, gltf.BlendMode.Blend, gltf.BlendMode.Add, gltf.BlendMode.Subtractive, gltf.BlendMode.Multiply];
            for (let i = 0; i < images.length; i++) {
                for (let j = 0; j < blends.length; j++) {
                    const obj = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD);
                    const renderer = obj.getComponent(egret3d.MeshRenderer) as egret3d.MeshRenderer;
                    renderer.material = renderer.material!.clone();
                    renderer.material!.setTexture(images[i]);
                    renderer.material!.setBlend(blends[j]).setDepth(true, false).setRenderQueue(paper.RenderQueue.Transparent);
                    obj.transform.setLocalPosition((j - blends.length / 2) * 1.1, -(i - images.length / 2) * 1.1, 0);
                }

            }
        }
    }

}