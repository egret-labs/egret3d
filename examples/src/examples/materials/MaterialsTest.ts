namespace examples.materials {
    export class MaterialsTest implements Example {
        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            { // MeshRenderer.
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);
                // 
                const renderer = gameObject.renderer!;
                const materials = [
                    egret3d.Material
                        .create()
                        .setTexture(await RES.getResAsync("logo.png")),
                    egret3d.Material
                        .create()
                        .setTexture(await RES.getResAsync("textures/UV_Grid_Sm.jpg"))
                        .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5),
                ]
                renderer.materials = materials;
            }

            { // SkinnedMeshRenderer.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                //
                const animation = gameObject.getComponentInChildren(egret3d.Animation)!;
                animation.play("run01");
                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                // const materials = renderer.materials.concat();
                // materials.push(
                //     egret3d.Material
                //         .create()
                //         .setTexture(await RES.getResAsync("textures/UV_Grid_Sm.jpg"))
                //         .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5)
                // );
                // renderer.materials = materials;
            }
        }
    }
}