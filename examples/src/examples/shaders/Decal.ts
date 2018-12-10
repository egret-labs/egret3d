namespace examples.shaders {

    export class Decal implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/sniper/");
            // Create camera.
            egret3d.Camera.main;

            const shader = egret3d.Shader.create(egret3d.DefaultShaders.MESH_BASIC, "custom/decal.shader.json");
            shader
                .addDefine(
                    "CUSTOM_DECAL",
                    {
                        custom_vertex: `
                            uniform float radius;
                            uniform vec3 center;
                        `,
                        custom_begin_vertex: ``,
                        custom_end_vertex: `
                            vec3 up = vec3(1.0, 0.0, 0.0);
                            vec3 forward = vec3(0.0, 0.0, 1.0);
                            vec4 plane = vec4(0.0, 0.0, 1.0, 0.0);
                            vec4 mViewPosition = - ( modelViewMatrix * vec4( position, 1.0 ));

                            if (dot( mViewPosition.xyz, plane.xyz ) < plane.w) {
                                float k = 2.0 * radius;
                                vec3 uVector = up / k;
                                vec3 vVector = forward / -k;
                                vUv.x = dot(position - center, uVector) + 0.5; 
                                vUv.y = dot(position - center, vVector) + 0.5; 
                            }
                            else {
                                vUv.x = 0.0;
                                vUv.y = 0.0;
                            }
                        `,
                    }
                )
                .addUniform("radius", gltf.UniformType.FLOAT, 0.5)
                .addUniform("center", gltf.UniformType.FLOAT_VEC3, [0.0, 0.0, 1.0]);

            // { // MeshRenderer.
            //     const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
            //     gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);
            //     // 
            //     const renderer = gameObject.renderer!;
            //     const materials = renderer.materials as egret3d.Material[];
            //     materials[0] = egret3d.Material.create().setTexture(await RES.getResAsync("logo.png"));
            //     materials[1] = egret3d.Material.create().setTexture(await RES.getResAsync("textures/sprite0.png")).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5);
            //     renderer.materials = materials;
            // }

            { // SkinnedMeshRenderer.
                await RES.getResAsync("Assets/Prefab/Actor/female1.prefab.json");
                const gameObject = paper.Prefab.create("Assets/Prefab/Actor/female1.prefab.json")!;
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                //
                const animation = gameObject.getComponentInChildren(egret3d.Animation)!;
                animation.play("idle");
                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                const materials = renderer.materials as egret3d.Material[];
                // materials[0] = egret3d.Material.create().setTexture(await RES.getResAsync("logo.png"));
                materials[1] = egret3d.Material.create(shader).setTexture(await RES.getResAsync("textures/sprite0.png")).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5);
                renderer.materials = materials;


                gameObject.addComponent(TestDecal, materials[1]);
            }
        }
    }

    class TestDecal extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 20.0 })
        public readonly radius: number = 1.0;
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: egret3d.Vector3 = egret3d.Vector3.create();

        private _material: egret3d.Material | null = null;
        public onAwake(config: egret3d.Material) {
            this._material = config;
        }

        public onUpdate() {
            if (!this._material) {
                return;
            }

            this._material.setFloat("radius", this.radius);
            this._material.setVector3("center", this.center);
        }
    }

}