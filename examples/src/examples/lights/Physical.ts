namespace examples.lights {

    export class Physical implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            //
            await RES.getResAsync("threejs/textures/hardwood2_diffuse.jpg");
            await RES.getResAsync("threejs/textures/hardwood2_bump.jpg");
            await RES.getResAsync("threejs/textures/hardwood2_roughness.jpg");
            await RES.getResAsync("threejs/textures/brick_diffuse.jpg");
            await RES.getResAsync("threejs/textures/brick_bump.jpg");
            await RES.getResAsync("threejs/textures/planets/earth_atmos_2048.jpg");
            await RES.getResAsync("threejs/textures/planets/earth_specular_2048.jpg");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
            const mainCamera = egret3d.Camera.main;

            { //
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                // physicallyCorrectLights 
                // shadowMap
                renderState.gammaInput = true;
                renderState.gammaOutput = true;
                renderState.gammaFactor = 2.0;
                renderState.toneMapping = egret3d.ToneMapping.ReinhardToneMapping;
            }

            { // Main camera.
                mainCamera.fov = 50.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 100.0;
                mainCamera.near = 0.1;
                mainCamera.backgroundColor.fromHex(0x000000);
                mainCamera.transform.setLocalPosition(-4.0, 2.0, -4.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create lights.
                paper.Scene.activeScene.ambientColor.fromHex(0x000000);
                //
                const pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                pointLight.decay = 2.0;
                pointLight.distance = 100.0;
                pointLight.intensity = 1.0;
                pointLight.color.fromHex(0xFFEE88);
                pointLight.castShadows = true;
                pointLight.transform.setLocalPosition(0.0, 2.0, 0.0);
                const wander = pointLight.gameObject.addComponent(behaviors.Wander);
                wander.radius = 3.0;
                wander.center.set(0.0, 4.0, 0.0);
                //
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE, "Bulb");
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                    .setColor(egret3d.ShaderUniformName.Emissive, 0xFFFFEE)
                    .setFloat(egret3d.ShaderUniformName.EmissiveIntensity, 1.0)
                    .setColor(0x000000)
                    ;
                gameObject.transform.setLocalScale(0.04).setParent(pointLight.gameObject.transform);
                //
                const hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                hemisphereLight.intensity = 0.02;
                hemisphereLight.color.fromHex(0xDDEEFF);
                hemisphereLight.groundColor.fromHex(0x0F0E0D);
                hemisphereLight.transform.setLocalPosition(0.0, 2.0, 0.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create game object.
                const textureDiffue = RES.getRes("threejs/textures/planets/earth_atmos_2048.jpg") as egret3d.Texture;
                const textureMetalness = RES.getRes("threejs/textures/planets/earth_specular_2048.jpg") as egret3d.Texture;
                textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                textureMetalness.gltfTexture.extensions.paper.anisotropy = 4;

                const mesh = egret3d.MeshBuilder.createSphere(0.25, 0.0, 0.0, 0.0, 32, 32);
                const gameObject = egret3d.DefaultMeshes.createObject(mesh);
                const renderer = gameObject.renderer!;
                renderer.castShadows = true;
                renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                    .setFloat(egret3d.ShaderUniformName.Roughness, 0.5)
                    .setFloat(egret3d.ShaderUniformName.Metalness, 1.0)
                    .setTexture(textureDiffue)
                    .setTexture(egret3d.ShaderUniformName.MetalnessMap, textureMetalness)
                    .setColor(0xFFFFFF)
                    ;
                gameObject.transform.setLocalPosition(1.0, 0.25, -1.0).setLocalEulerAngles(0.0, 180.0, 0.0);

                { // Boxes.
                    const textureDiffue = RES.getRes("threejs/textures/brick_diffuse.jpg") as egret3d.Texture;
                    const textureBump = RES.getRes("threejs/textures/brick_bump.jpg") as egret3d.Texture;
                    textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                    textureBump.gltfTexture.extensions.paper.anisotropy = 4;

                    const boxMaterial = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat(egret3d.ShaderUniformName.Roughness, 0.7)
                        .setFloat(egret3d.ShaderUniformName.Metalness, 0.7)
                        .setFloat(egret3d.ShaderUniformName.BumpScale, 0.002)
                        .setTexture(textureDiffue)
                        .setTexture(egret3d.ShaderUniformName.BumpMap, textureBump)
                        .setColor(0xFFFFFF)
                        ;

                    {
                        const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube A");
                        const renderer = gameObject.renderer!;
                        renderer.castShadows = true;
                        renderer.material = boxMaterial;
                        gameObject.transform.setLocalPosition(-0.5, 0.25, 1.0).setLocalScale(0.5);
                    }

                    {
                        const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube B");
                        const renderer = gameObject.renderer!;
                        renderer.castShadows = true;
                        renderer.material = boxMaterial;
                        gameObject.transform.setLocalPosition(0.0, 0.25, 5.0).setLocalScale(0.5);
                    }

                    {
                        const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube C");
                        const renderer = gameObject.renderer!;
                        renderer.castShadows = true;
                        renderer.material = boxMaterial;
                        gameObject.transform.setLocalPosition(7.5, 0.25, 0.0).setLocalScale(0.5);
                    }
                }
            }

            { // Create floor.
                const textureDiffue = RES.getRes("threejs/textures/hardwood2_diffuse.jpg") as egret3d.Texture;
                const textureBump = RES.getRes("threejs/textures/hardwood2_bump.jpg") as egret3d.Texture;
                const textureRoughness = RES.getRes("threejs/textures/hardwood2_roughness.jpg") as egret3d.Texture;
                textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                textureBump.gltfTexture.extensions.paper.anisotropy = 4;
                textureRoughness.gltfTexture.extensions.paper.anisotropy = 4;

                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD);
                const renderer = gameObject.renderer!;
                renderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                    .setFloat(egret3d.ShaderUniformName.Roughness, 0.8)
                    .setFloat(egret3d.ShaderUniformName.Metalness, 0.2)
                    .setFloat(egret3d.ShaderUniformName.BumpScale, 0.0005)
                    .setColor(0xFFFFFF)
                    .setTexture(textureDiffue)
                    .setTexture(egret3d.ShaderUniformName.BumpMap, textureBump)
                    .setTexture(egret3d.ShaderUniformName.RoughnessMap, textureRoughness)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 10.0, 24.0, 0.0, 0.0, 0.0).release())
                    ;
                renderer.receiveShadows = true;
                gameObject.transform.setLocalScale(20.0).setLocalEulerAngles(90.0, 0.0, 0.0);
            }
        }
    }
}