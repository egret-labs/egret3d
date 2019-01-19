namespace examples.materials {

    export class EnvMap implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/cube/Bridge2/Bridge2.image.json");
            await RES.getResAsync("threejs/textures/2294472375_24a3b8ef46_o.jpg");
            await RES.getResAsync("threejs/textures/metal.jpg");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {
        private readonly _textureA: egret3d.BaseTexture = RES.getRes("threejs/textures/cube/Bridge2/Bridge2.image.json");
        private readonly _textureB: egret3d.BaseTexture = RES.getRes("threejs/textures/2294472375_24a3b8ef46_o.jpg");
        private readonly _textureC: egret3d.BaseTexture = RES.getRes("threejs/textures/metal.jpg");

        public onAwake() {
            const mainCamera = egret3d.Camera.main;

            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaOutput = true;
                renderState.gammaFactor = 2.0;
            }

            {
                const sampler = this._textureB.sampler;
                const extensions = this._textureB.gltfTexture.extensions.paper;
                sampler.magFilter = gltf.TextureFilter.Linear;
                sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
                extensions.encoding = egret3d.TextureEncoding.sRGBEncoding;
                extensions.mapping = egret3d.TextureUVMapping.Equirectangular;
            }

            {
                const extensions = this._textureC.gltfTexture.extensions.paper;
                extensions.encoding = egret3d.TextureEncoding.sRGBEncoding;
                extensions.mapping = egret3d.TextureUVMapping.Spherical;
            }

            { // Main camera.
                mainCamera.fov = 70.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 10000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0x000000);
                mainCamera.transform.setLocalPosition(0.0, 0.0, -1000.0).lookAt(egret3d.Vector3.ZERO);
                mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                    .setTexture(egret3d.ShaderUniformName.CubeMap, this._textureA);
                // mainCamera.gameObject.addComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.EQUIRECT)
                //     .setTexture(egret3d.ShaderUniformName.EquirectMap, this._textureB);
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
            }

            { // Create lights.
                paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
            }

            { // Create game object.
                const mesh = egret3d.MeshBuilder.createSphere(400.0, 0.0, 0.0, 0.0, 48, 24);
                const gameObject = egret3d.DefaultMeshes.createObject(mesh);
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);
            }
        }
    }
}