namespace examples.shaders {

    export class XRay implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");

            paper.GameObject.globalGameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {

        public onAwake() {
            // Create shader.
            const shader = egret3d.Shader.create("custom/xray.shader.json", egret3d.DefaultShaders.MESH_PHONG)
                .addDefine(
                    "CUSTOM_XRAY",
                    {
                        custom_vertex: `
                            uniform float _c;
                            uniform float _p;
                            varying float _intensity;
                        `,
                        custom_end_vertex: `
                            vec3 _normal = normalize( normalMatrix * (cameraPosition - modelMatrix[2].xyz) );
                            _intensity = pow( _c - dot(transformedNormal, _normal), _p );
                        `,
                        custom_fragment: `
                            varying float _intensity;
                        `,
                        custom_end_fragment: `
                            gl_FragColor *= _intensity;
                        `,
                    }
                )
                .addUniform("_c", gltf.UniformType.FLOAT, 1.3)
                .addUniform("_p", gltf.UniformType.FLOAT, 3.0);

            { // MeshRenderer.
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "Cylinder");
                gameObject.transform.setLocalPosition(2.0, 0.5, 0.0);
                // 
                const renderer = gameObject.renderer!;
                renderer.material = egret3d.Material.create(shader)
                    .setBlend(egret3d.BlendMode.Additive, egret3d.RenderQueue.Blend)
                    .setColor(egret3d.Color.INDIGO);

                renderer.gameObject.addComponent(XRayEditor);
            }

            { // Create prefab.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");
                gameObject.transform.setLocalPosition(-2.0, 0.0, 0.0);
                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                renderer.material = egret3d.Material.create(shader)
                    .setBlend(egret3d.BlendMode.Additive, egret3d.RenderQueue.Blend)
                    .setColor(egret3d.Color.INDIGO);

                renderer.gameObject.addComponent(XRayEditor);
            }
            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
            //
            createGridRoom();
        }
    }

    class XRayEditor extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 4.0 })
        public p: number = 3.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 2.0 })
        public c: number = 1.0;
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly glowColor: egret3d.Color = egret3d.Color.INDIGO.clone();

        public onUpdate() {
            if (this.gameObject.renderer && this.gameObject.renderer!.material) {
                this.gameObject.renderer!.material!
                    .setFloat("_p", this.p)
                    .setFloat("_c", this.c)
                    .setColor(this.glowColor);
            }
        }
    }
}