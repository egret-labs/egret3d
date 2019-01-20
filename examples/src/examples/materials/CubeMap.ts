namespace examples.materials {

    export class CubeMap implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/cube/SwedishRoyalCastle/SwedishRoyalCastle.image.json");
            await RES.getResAsync("Assets/Models/Threejs/WaltHead.prefab.json");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
            const mainCamera = egret3d.Camera.main;

            { // Main camera.
                const texture = RES.getRes("threejs/textures/cube/SwedishRoyalCastle/SwedishRoyalCastle.image.json") as egret3d.Texture;
                
                mainCamera.fov = 50.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 5000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0xFFFFFF);
                mainCamera.transform.setLocalPosition(0.0, 0.0, -2000.0).lookAt(egret3d.Vector3.ZERO);
                mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                    .setTexture(egret3d.ShaderUniformName.CubeMap, texture);
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
            }

            { // Create lights.
                paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
                //
                const pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                pointLight.decay = 0.0;
                pointLight.distance = 0.0;
                pointLight.intensity = 2.0;
                pointLight.color.fromHex(0xFFFFFF);
            }

            { // Create game objects.

                const gameObjectA = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json")!;
                gameObjectA.transform.setLocalScale(15.0).translate(0.0, -500.0, 0.0);
                gameObjectA.getComponentInChildren(egret3d.MeshRenderer)!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                    .setColor(0xFFFFFF);

                const gameObjectB = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json")!;
                gameObjectB.transform.setLocalScale(15.0).translate(900.0, -500.0, 0.0);
                gameObjectB.getComponentInChildren(egret3d.MeshRenderer)!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                    .setColor(0xFFEE00)
                    .setFloat(egret3d.ShaderUniformName.RefractionRatio, 0.95).addDefine(egret3d.ShaderDefine.ENVMAP_MODE_REFRACTION);

                const gameObjectC = paper.Prefab.create("Assets/Models/Threejs/WaltHead.prefab.json")!;
                gameObjectC.transform.setLocalScale(15.0).translate(-900.0, -500.0, 0.0);
                gameObjectC.getComponentInChildren(egret3d.MeshRenderer)!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                    .setColor(0xFF6600)
                    .setFloat(egret3d.ShaderUniformName.Reflectivity, 0.3);
            }
        }
    }
}