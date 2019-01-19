namespace examples.materials {

    export class EnvMap implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/cube/Bridge2/Bridge2.image.json");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {

        public onAwake() {
            const mainCamera = egret3d.Camera.main;
            const texture = RES.getRes("threejs/textures/cube/Bridge2/Bridge2.image.json");

            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaOutput = true;
                renderState.gammaFactor = 2.0;
            }

            { // Main camera.
                mainCamera.fov = 70.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 10000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0xFFFFFF);
                mainCamera.transform.setLocalPosition(0.0, 0.0, -1000.0).lookAt(egret3d.Vector3.ZERO);
                mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                    .setTexture(egret3d.ShaderUniformName.CubeMap, texture);
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
            }

            { // Create lights.
                paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
            }

            { // Create game object.
                const mesh = egret3d.MeshBuilder.createSphere(400.0, 0.0, 0.0, 0.0, 48, 24);
                const gameObject = egret3d.DefaultMeshes.createObject(mesh);
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT)
                    .setTexture(egret3d.ShaderUniformName.EnvMap, texture);
            }
        }
    }
}