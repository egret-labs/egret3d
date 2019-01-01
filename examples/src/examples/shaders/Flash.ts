namespace examples.shaders {

    export class Flash implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create shader.
            const shader = egret3d.Shader.create("custom/flash.shader.json", egret3d.DefaultShaders.MESH_PHONG)
                .addDefine(
                    "CUSTOM_FLASH",
                    {
                        custom_vertex: `
                            uniform vec4 clock;
                            uniform vec2 _speed;
                            uniform vec2 _scale;
                        `,
                        custom_end_vertex: `
                            // vUv =  position.xy * _scale.xy + _speed.xy * clock.x; // Local space.
                            vUv =  transformed.xy * _scale.xy + _speed.xy * clock.x; // World space.
                        `,
                    }
                )
                .addUniform("_speed", gltf.UniformType.FLOAT_VEC2, [1.0, 0.0])
                .addUniform("_scale", gltf.UniformType.FLOAT_VEC2, [1.0, 1.0]);
            // Load texture.
            const texture = await RES.getResAsync("textures/test.png") as egret3d.Texture;
            //
            createGridRoom();

            { // MeshRenderer.
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                gameObject.transform.setLocalPosition(2.0, 0.5, 0.0);
                // 
                const renderer = gameObject.renderer!;
                renderer.materials = [
                    egret3d.Material
                        .create()
                        .setTexture(await RES.getResAsync("logo.png")),
                    egret3d.Material.create(shader)
                        .setTexture(texture)
                        .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.7)
                        .setColor(egret3d.Color.INDIGO)
                ];
            }

            { // SkinnedMeshRenderer.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                const materials = renderer.materials.concat();
                const material = egret3d.Material.create(shader)
                    .setTexture(texture)
                    .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.7)
                    .setColor(egret3d.Color.PURPLE);
                materials.push(material);
                renderer.materials = materials;
            }
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }
}
