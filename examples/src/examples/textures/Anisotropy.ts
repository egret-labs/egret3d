namespace examples.textures {

    export class Anisotropy implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("threejs/textures/crate.gif");
            await RES.getResAsync("threejs/textures/crate_b.gif");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;
        private readonly _subCamera: egret3d.Camera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);

        public onAwake() {
            const renderState = this.gameObject.getComponent(egret3d.RenderState)!;

            const textureA = RES.getRes("threejs/textures/crate.gif") as egret3d.BaseTexture;
            const textureB = RES.getRes("threejs/textures/crate_b.gif") as egret3d.BaseTexture;
            textureA.gltfTexture.extensions.paper.anisotropy = renderState.maxAnisotropy;
            textureB.gltfTexture.extensions.paper.anisotropy = 1;

            const mainCamera = this._mainCamera;
            const subCamera = this._subCamera;

            { // Sub camera.
                subCamera.order = 1;
                subCamera.fov = 35.0 * egret3d.Const.DEG_RAD;
                subCamera.far = 25000.0;
                subCamera.near = 1.0;
                subCamera.bufferMask = gltf.BufferMask.Depth;
                subCamera.cullingMask = paper.Layer.UserLayer11;
                subCamera.viewport.set(0.0, 0.0, 0.5, 1.0).update();
                subCamera.transform.setLocalPosition(0.0, 500.0, -1500.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Main camera.
                mainCamera.fov = 35.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 25000.0;
                mainCamera.near = 1.0;
                mainCamera.cullingMask = paper.Layer.UserLayer12;
                mainCamera.backgroundColor.fromHex(0xF2F7FF);
                mainCamera.viewport.set(0.5, 0.0, 0.5, 1.0).update();
                mainCamera.transform.setLocalPosition(0.0, 500.0, -1500.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create lights.
                //
                const activeScene = paper.Scene.activeScene;
                activeScene.fog.mode = egret3d.FogMode.Fog;
                activeScene.fog.far = 25000.0;
                activeScene.fog.near = 1.0;
                activeScene.fog.color.fromHex(0xF2F7FF);
                //
                activeScene.ambientColor.fromHex(0xEEF0FF);
                //
                const directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                directionalLight.intensity = 2.0;
                directionalLight.transform.setLocalPosition(1.0, 1.0, 1.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create game object.
                const gameObjectA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Floor A");
                const rendererA = gameObjectA.renderer!;
                rendererA.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 512.0, 512.0, 0.0, 0.0, 0.0).release())
                    .setTexture(textureA)
                    ;
                gameObjectA.layer = paper.Layer.UserLayer11;
                gameObjectA.transform.setLocalEulerAngles(90.0, 0.0, 0.0).setLocalScale(10000.0);
                gameObjectA.addComponent(behaviors.Rotater).speed.set(0.0, 0.005, 0.0);

                const gameObjectB = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Floor B");
                const rendererB = gameObjectB.renderer!;
                rendererB.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 512.0, 512.0, 0.0, 0.0, 0.0).release())
                    .setTexture(textureB)
                    ;
                gameObjectB.layer = paper.Layer.UserLayer12;
                gameObjectB.transform.setLocalEulerAngles(90.0, 0.0, 0.0).setLocalScale(10000.0);
                gameObjectB.addComponent(behaviors.Rotater).speed.set(0.0, 0.005, 0.0);
            }
        }
    }
}