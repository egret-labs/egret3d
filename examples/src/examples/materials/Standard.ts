namespace examples.materials {

    export class Standard implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/cube/pisa/pisa.image.json");
            await RES.getResAsync("threejs/models/cerberus/Cerberus_default.mesh.bin");
            await RES.getResAsync("threejs/models/cerberus/Cerberus_A.jpg");
            await RES.getResAsync("threejs/models/cerberus/Cerberus_N.jpg");
            await RES.getResAsync("threejs/models/cerberus/Cerberus_RM.jpg");
            //
            egret3d.Camera.main.gameObject.addComponent(Starter);
            //
            const modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);
            if (modelComponent) {
                modelComponent.select(egret3d.Camera.main.gameObject);
                paper.GameObject.globalGameObject.getComponent(paper.editor.GUIComponent)!.openComponents(Starter);
            }
        }
    }

    class Starter extends paper.Behaviour {
        private readonly _cubeTexture: egret3d.BaseTexture = RES.getRes("threejs/textures/cube/pisa/pisa.image.json");

        public onAwake() {
            const mainCamera = egret3d.Camera.main;

            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaInput = true;
                renderState.gammaOutput = true;
                renderState.toneMapping = egret3d.ToneMapping.ReinhardToneMapping;
                renderState.toneMappingExposure = 3.0;
            }

            {
                const skyBox = mainCamera.gameObject.getOrAddComponent(egret3d.SkyBox);
                skyBox.material = egret3d.Material.create(egret3d.DefaultShaders.CUBE).setTexture(egret3d.ShaderUniformName.CubeMap, this._cubeTexture);
            }

            { // Main camera.
                mainCamera.fov = 50.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 1000.0;
                mainCamera.near = 0.01;
                mainCamera.backgroundColor.fromHex(0x111111);
                mainCamera.transform.setLocalPosition(0.0, 0.0, -2.0);
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
            }

            { // Create lights.
                const hemisphereLight = paper.GameObject.create("Hemisphere Light").addComponent(egret3d.HemisphereLight);
                hemisphereLight.intensity = 4;
                hemisphereLight.color.fromHex(0x443333);
                hemisphereLight.groundColor.fromHex(0x222233);
                hemisphereLight.transform.setLocalPosition(0.0, 100.0, 0.0).lookAt(egret3d.Vector3.ZERO);

                const directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                directionalLight.color.fromHex(0xffffff);
                directionalLight.transform.setLocalPosition(1.0, -0.5, 1.0).lookAt(egret3d.Vector3.ZERO);
            }

            { //Create model
                const cerberus_mesh = RES.getRes("threejs/models/cerberus/Cerberus_default.mesh.bin");
                const map = RES.getRes("threejs/models/cerberus/Cerberus_A.jpg") as egret3d.Texture;
                const normalMap = RES.getRes("threejs/models/cerberus/Cerberus_N.jpg") as egret3d.Texture;
                const rmMap = RES.getRes("threejs/models/cerberus/Cerberus_RM.jpg") as egret3d.Texture;
                map.sampler.wrapS = gltf.TextureWrappingMode.Repeat;
                rmMap.sampler.wrapS = gltf.TextureWrappingMode.Repeat;
                normalMap.sampler.wrapS = gltf.TextureWrappingMode.Repeat;

                egret3d.creater.createGameObject("cerberus", {
                    mesh: cerberus_mesh,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD)
                        .setFloat(egret3d.ShaderUniformName.Metalness, 1.0)
                        .setFloat(egret3d.ShaderUniformName.Roughness, 1.0)
                        .setTexture(map)
                        .setTexture(egret3d.ShaderUniformName.NormalMap, normalMap)
                        .setTexture(egret3d.ShaderUniformName.MetalnessMap, rmMap)
                        .setTexture(egret3d.ShaderUniformName.RoughnessMap, rmMap)
                        .setTexture(egret3d.ShaderUniformName.EnvMap, this._cubeTexture),
                });
            }
        }
    }
}