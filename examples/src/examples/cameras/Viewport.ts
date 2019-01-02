namespace examples.cameras {

    export class Viewport implements Example {

        async start() {
            const renderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState)!;
            renderState.toneMapping = egret3d.ToneMapping.Uncharted2ToneMapping;
            renderState.toneMappingExposure = 3.0;
            renderState.gammaInput = true;
            renderState.gammaOutput = true;

            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            await RES.getResAsync("threejs/textures/brick_diffuse.jpg");
            await RES.getResAsync("threejs/textures/brick_bump.jpg");
            await RES.getResAsync("threejs/textures/brick_roughness.jpg");

            paper.GameObject.globalGameObject.addComponent(Update);
        }
    }

    class Update extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;
        private readonly _subCamera: egret3d.Camera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);
        private readonly _target: paper.GameObject = egret3d.DefaultMeshes.createObject(
            egret3d.MeshBuilder.createTorusKnot(1.0, 0.4, 150, 20), "Target"
        );

        public onAwake() {

            { // Main camera.
                const mainCamera = this._mainCamera;
                mainCamera.bufferMask = gltf.BufferMask.Depth;
                mainCamera.viewport.set(0.0, 0.0, 0.5, 1.0);
                mainCamera.transform.setLocalPosition(0.0, 10.0, -20.0);
                mainCamera.gameObject.addComponent(behaviors.RotateComponent).target = this._target;
            }

            { // Sub camera.
                const subCamera = this._subCamera;
                subCamera.order = -1;
                subCamera.viewport.set(0.5, 0.0, 0.5, 1.0);
                subCamera.transform.setLocalPosition(0.0, 20.0, 10.0);
                subCamera.gameObject.addComponent(behaviors.RotateComponent).target = this._target;
            }

            { // Create light.
                const gameObject = paper.GameObject.create("Point Light");
                gameObject.transform.setLocalPosition(1.0, 20.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.PointLight);
                light.intensity = 0.5;
            }

            { // Create light.
                const gameObject = paper.GameObject.create("Hemisphere Light");
                gameObject.transform.setLocalPosition(-1.0, 20.0, 1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.HemisphereLight);
                light.intensity = 0.5;
            }

            createGridRoom();

            const textureDiffuse = RES.getRes("threejs/textures/brick_diffuse.jpg") as egret3d.Texture;
            const textureBump = RES.getRes("threejs/textures/brick_bump.jpg") as egret3d.Texture;
            const textureRoughness = RES.getRes("threejs/textures/brick_roughness.jpg") as egret3d.Texture;
            textureDiffuse.gltfTexture.extensions.paper.anisotropy = 4;
            textureDiffuse.gltfTexture.extensions.paper.encoding = egret3d.TextureEncoding.sRGBEncoding;
            textureBump.gltfTexture.extensions.paper.anisotropy = 4;
            textureRoughness.gltfTexture.extensions.paper.anisotropy = 4;

            this._target.transform.setLocalPosition(0.0, 10.0, 0.0);
            this._target.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL)
                .setTexture(textureDiffuse)
                .setTexture(egret3d.ShaderUniformName.BumpMap, textureBump)
                .setTexture(egret3d.ShaderUniformName.RoughnessMap, textureRoughness)
                .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 10.0, 0.5, 0.0, 0.0, 0.0).release())
                .addDefine("USE_NORMAL").addDefine("USE_ROUGHNESS").addDefine("STANDARD");
        }

        public onUpdate() {
            // this._mainCamera.transform.lookAt(this._subCamera.transform);
            // this._subCamera.transform.lookAt(this._earth.transform);
        }
    }
}