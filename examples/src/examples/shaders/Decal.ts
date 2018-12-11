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
                            uniform vec3 up;
                            uniform vec3 forward;
                        `,
                        custom_end_vertex: `
                            float k = 2.0 * radius;
                            vec3 right = cross(up, forward);
                            vec3 uVector = right / k;
                            vec3 vVector = cross(forward, right) / -k;
                            vUv.x = dot(position - center, uVector) + 0.5; 
                            vUv.y = dot(position - center, vVector) + 0.5;
                        `,
                    }
                )
                .addUniform("radius", gltf.UniformType.FLOAT, 0.5)
                .addUniform("center", gltf.UniformType.FLOAT_VEC3, [0.0, 0.0, 0.0])
                .addUniform("up", gltf.UniformType.FLOAT_VEC3, [0.0, 1.0, 0.0])
                .addUniform("forward", gltf.UniformType.FLOAT_VEC3, [0.0, 0.0, 1.0]);

            { // SkinnedMeshRenderer.
                await RES.getResAsync("Assets/Prefab/Actor/female1.prefab.json");
                const texture = await RES.getResAsync("textures/sprite0.png") as egret3d.Texture;
                texture.gltfSampler.wrapS = gltf.TextureWrap.CLAMP_TO_EDGE;
                texture.gltfSampler.wrapT = gltf.TextureWrap.CLAMP_TO_EDGE;

                const gameObject = paper.Prefab.create("Assets/Prefab/Actor/female1.prefab.json")!;
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                //
                const animation = gameObject.getComponentInChildren(egret3d.Animation)!;
                animation.play("idle");

                //
                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;

                //
                const line = paper.GameObject.create("SkinnedMeshRendererRaycast");
                line.transform.setLocalPosition(0.0, 0.0, -2.0);
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = renderer.gameObject;

                //
                const materials = renderer.materials as egret3d.Material[];
                // materials[0] = egret3d.Material.create().setTexture(await RES.getResAsync("logo.png"));
                materials[1] = egret3d.Material.create(shader).setTexture(texture).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent, 0.5);
                renderer.materials = materials;

                gameObject.addComponent(TestDecal, materials[1]).rendererRaycast = rendererRaycast;
            }
        }
    }

    class TestDecal extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 2.0, step: 0.01 })
        public readonly radius: number = 0.1;
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: egret3d.Vector3 = egret3d.Vector3.create();

        public rendererRaycast: behaviors.RendererRaycast | null = null;

        private _material: egret3d.Material | null = null;
        public onAwake(config: egret3d.Material) {
            this._material = config;
        }

        public onUpdate() {
            const material = this._material;
            const rendererRaycast = this.rendererRaycast;

            if (!material || !rendererRaycast) {
                return;
            }

            const raycastInfo = rendererRaycast.raycastInfo;
            if (raycastInfo.transform) {
                //
                const skinnedMeshRenderer = rendererRaycast.target!.renderer as egret3d.SkinnedMeshRenderer;
                const mesh = skinnedMeshRenderer.mesh!;
                const triangle = mesh.getTriangle(raycastInfo.triangleIndex).release();
                const center = triangle.getPointAt(raycastInfo.coord.x, raycastInfo.coord.y).release();
                //
                const forwardNormal = triangle.getNormal().negate().release();
                //
                const toMatrix = skinnedMeshRenderer.gameObject.transform.worldToLocalMatrix;
                const up = egret3d.Vector3.UP.clone().applyDirection(toMatrix).release();
                const forwardRay = rendererRaycast.ray.direction.clone().applyDirection(toMatrix).release();
                //
                material.setFloat("radius", this.radius);
                material.setVector3("center", center);
                material.setVector3("up", up);
                material.setVector3("forward", forwardNormal.lerp(forwardRay, 0.5));
            }
        }
    }
}
