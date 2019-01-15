namespace examples {

    export class ToneMapping implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/brick_diffuse.jpg");
            await RES.getResAsync("threejs/textures/brick_bump.jpg");
            await RES.getResAsync("threejs/textures/brick_roughness.jpg");
            await RES.getResAsync("threejs/textures/cube/pisa/pisa.image.json");

            paper.GameObject.globalGameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;

        public onAwake() {
            const mainCamera = this._mainCamera;

            const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
            renderState.gammaInput = true;
            renderState.gammaOutput = true;
            renderState.toneMapping = egret3d.ToneMapping.Uncharted2ToneMapping;
            renderState.toneMappingExposure = 3.0;
            renderState.toneMappingWhitePoint = 5.0;

            { // Main camera.
                mainCamera.fov = 40.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 2000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0x000000);
                mainCamera.transform.setLocalPosition(0.0, 40.0, -40 * 3.5).lookAt(egret3d.Vector3.ZERO);
                //
                // paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent)!.select(mainCamera.gameObject);
            }

            { // Create lights.
                const hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                hemisphereLight.color.fromHex(0x111111);
                hemisphereLight.groundColor.fromHex(0x000000);
                hemisphereLight.transform.setLocalPosition(0.0, 100.0, 0.0).lookAt(egret3d.Vector3.ZERO);

                const spotLight = paper.GameObject.create("Spot Light").addComponent(egret3d.SpotLight);
                spotLight.angle = Math.PI / 7.0;
                spotLight.decay = 2.0;
                spotLight.distance = 300.0;
                spotLight.penumbra = 0.8;
                spotLight.color.fromHex(0xFFFFFF);
                spotLight.transform.setLocalPosition(50.0, 100.0, -50.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create game object.
                const torusKnotMesh = egret3d.MeshBuilder.createTorusKnot(18.0, 8.0, 150.0, 20.0);
                const textureDiffue = RES.getRes("threejs/textures/brick_diffuse.jpg") as egret3d.Texture;
                const textureBump = RES.getRes("threejs/textures/brick_bump.jpg") as egret3d.Texture;
                const textureRoughness = RES.getRes("threejs/textures/brick_roughness.jpg") as egret3d.Texture;
                const textureEnv = RES.getRes("threejs/textures/cube/pisa/pisa.image.json") as egret3d.Texture;
                textureDiffue.gltfTexture.extensions.paper.encoding = egret3d.TextureEncoding.sRGBEncoding;
                textureDiffue.gltfTexture.extensions.paper.anisotropy = 4;
                textureBump.gltfTexture.extensions.paper.anisotropy = 4;
                textureRoughness.gltfTexture.extensions.paper.anisotropy = 4;

                const gameObject = egret3d.DefaultMeshes.createObject(torusKnotMesh, "Game Object");
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL)
                    .setFloat(egret3d.ShaderUniformName.BumpScale, -0.05)
                    .setFloat(egret3d.ShaderUniformName.Metalness, 0.9)
                    .setFloat(egret3d.ShaderUniformName.Roughness, 0.8)
                    .setColor(egret3d.Color.WHITE)
                    .setTexture(textureDiffue)
                    .setTexture(egret3d.ShaderUniformName.BumpMap, textureBump)
                    .setTexture(egret3d.ShaderUniformName.RoughnessMap, textureRoughness)
                    .setTexture(egret3d.ShaderUniformName.EnvMap, textureEnv)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 9.0, 0.5, 0.0, 0.0, 0.0).release())
                    // .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend, 1.0)
                    .addDefine(egret3d.ShaderDefine.PREMULTIPLIED_ALPHA)
                    .addDefine(egret3d.ShaderDefine.STANDARD)
                    ;
            }

            { // Create background.
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Background");
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL)
                    .setFloat(egret3d.ShaderUniformName.Metalness, 0.0)
                    .setFloat(egret3d.ShaderUniformName.Roughness, 1.0)
                    .setColor(0x888888)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .addDefine(egret3d.ShaderDefine.STANDARD)
                    ;

                gameObject.transform.setLocalPosition(0.0, 50.0, 0.0).setLocalScale(200.0);
            }
        }
    }
}