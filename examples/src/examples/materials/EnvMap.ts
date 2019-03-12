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
            egret3d.Camera.main.gameObject.addComponent(Starter);
            //
            selectGameObjectAndComponents(egret3d.Camera.main.gameObject, Starter);
        }
    }

    enum EnvMapType {
        Cube = "Cube",
        EquiRect = "EquiRect",
        Spherical = "Spherical",
    }

    class Starter extends paper.Behaviour {
        private _refraction: boolean = false;
        private _envMapType: EnvMapType = EnvMapType.Cube;
        private readonly _textureA: egret3d.BaseTexture = RES.getRes("threejs/textures/cube/Bridge2/Bridge2.image.json");
        private readonly _textureB: egret3d.BaseTexture = RES.getRes("threejs/textures/2294472375_24a3b8ef46_o.jpg");
        private readonly _textureC: egret3d.BaseTexture = RES.getRes("threejs/textures/metal.jpg");
        private readonly _gameObject: paper.GameObject = egret3d.creater.createGameObject("Sphere", {
            mesh: egret3d.MeshBuilder.createSphere(400.0, 0.0, 0.0, 0.0, 48, 24),
            material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
        });

        private _updateEnvMap() {
            const mainCamera = egret3d.Camera.main;

            switch (this._envMapType) {
                case EnvMapType.Cube:
                    mainCamera.gameObject.getOrAddComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.CUBE)
                        .setTexture(egret3d.ShaderUniformName.CubeMap, this._textureA);
                    this._gameObject.renderer!.material!.setTexture(egret3d.ShaderUniformName.EnvMap, null);
                    break;

                case EnvMapType.EquiRect:
                    mainCamera.gameObject.getOrAddComponent(egret3d.SkyBox).material = egret3d.Material.create(egret3d.DefaultShaders.EQUIRECT)
                        .setTexture(egret3d.ShaderUniformName.EquirectMap, this._textureB);
                    this._gameObject.renderer!.material!.setTexture(egret3d.ShaderUniformName.EnvMap, null);
                    break;

                case EnvMapType.Spherical:
                    mainCamera.gameObject.removeComponent(egret3d.SkyBox);
                    this._gameObject.renderer!.material!.setTexture(egret3d.ShaderUniformName.EnvMap, this._textureC);
                    break;
            }

            if (this._refraction) {
                this._gameObject.renderer!.material!.addDefine(egret3d.ShaderDefine.ENVMAP_MODE_REFRACTION);
            }
            else {
                this._gameObject.renderer!.material!.removeDefine(egret3d.ShaderDefine.ENVMAP_MODE_REFRACTION);
            }
        }

        public onAwake() {
            const mainCamera = egret3d.Camera.main;

            {
                const renderState = this.gameObject.getComponent(egret3d.RenderState)!;
                renderState.gammaOutput = true;
            }

            {
                const sampler = this._textureB.sampler;
                const extensions = this._textureB.gltfTexture.extensions.paper;
                sampler.wrapS = gltf.TextureWrappingMode.MirroredRepeat;
                sampler.wrapT = gltf.TextureWrappingMode.MirroredRepeat;
                sampler.magFilter = gltf.TextureFilter.Linear;
                sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
                extensions.levels = 0;
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
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
                this._updateEnvMap();
            }

            { // Create lights.
                paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
            }
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get refraction() {
            return this._refraction;
        }
        public set refraction(value: boolean) {
            if (this._refraction === value) {
                return;
            }

            this._refraction = value;
            this._updateEnvMap();
        }

        @paper.editor.property(paper.editor.EditType.LIST, { listItems: EnvMapType as any })
        public get envMapType() {
            return this._envMapType;
        }
        public set envMapType(value: EnvMapType) {
            if (this._envMapType === value) {
                return;
            }

            this._envMapType = value;
            this._updateEnvMap();
        }
    }
}