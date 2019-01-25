namespace examples.shaders {

    export class Flash implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
            await RES.getResAsync("logo.png");
            await RES.getResAsync("textures/test.png");

            paper.GameObject.globalGameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {

        public onAwake() {
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

            const texture = RES.getRes("textures/test.png") as egret3d.Texture;

            { // MeshRenderer.
                const gameObject = egret3d.creater.createGameObject("Cube", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    materials: [
                        egret3d.Material
                            .create()
                            .setTexture(RES.getRes("logo.png")),
                        egret3d.Material.create(shader)
                            .setTexture(texture)
                            .setBlend(egret3d.BlendMode.Additive, egret3d.RenderQueue.Blend, 1.0)
                            .setColor(egret3d.Color.INDIGO)
                    ],
                });
                gameObject.transform.setLocalPosition(2.0, 0.5, 0.0);
                gameObject.addComponent(FlashEditor);
                //
                const modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
                if (modelComponent) {
                    modelComponent.select(gameObject);
                    paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent)!.openComponents(FlashEditor);
                }
            }

            { // SkinnedMeshRenderer.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                const materials = renderer.materials.concat();
                const material = egret3d.Material.create(shader)
                    .setTexture(texture)
                    .setBlend(egret3d.BlendMode.Additive, egret3d.RenderQueue.Blend, 1.0)
                    .setColor(egret3d.Color.PURPLE);
                materials.push(material);
                renderer.materials = materials;

                renderer.gameObject.addComponent(FlashEditor);
            }
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateAround);
            //
            createGridRoom();
        }
    }

    class FlashEditor extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR2)
        public readonly speed: egret3d.Vector2 = egret3d.Vector2.create(1.0, 0.0);
        @paper.editor.property(paper.editor.EditType.VECTOR2)
        public readonly scale: egret3d.Vector2 = egret3d.Vector2.create(1.0, 1.0);
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: egret3d.Color = egret3d.Color.create().fromHex(0xFFFFFF);

        public onUpdate() {
            if (this.gameObject.renderer && this.gameObject.renderer!.materials[1]) {
                this.gameObject.renderer!.materials[1]!
                    .setVector2("_speed", this.speed)
                    .setVector2("_scale", this.scale)
                    .setColor(this.color);
            }
        }
    }
}
