namespace examples.textures {

    export class RenderTexture implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            await RES.getResAsync("Assets/Models/Mixamo/ybot.prefab.json");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Starter extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;
        private readonly _subCamera: egret3d.Camera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);

        public onAwake() {
            const mainCamera = this._mainCamera;
            const subCamera = this._subCamera;

            { // Main camera.
                mainCamera.order = 1;
                mainCamera.cullingMask = paper.Layer.UserLayer10;
                mainCamera.transform.setLocalPosition(0.0, 10.0, -10.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Sub camera.
                subCamera.order = 0;
                subCamera.cullingMask = paper.Layer.UserLayer11;
                subCamera.renderTarget = egret3d.RenderTexture.create({ width: 1024, height: 1024 });
                subCamera.transform.setLocalPosition(0.0, 10.0, -10.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create light.
                paper.Scene.activeScene.ambientColor.fromHex(0xFFFFFF);
                //
                const directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                directionalLight.transform.setLocalPosition(0.0, 20.0, -10.0).lookAt(egret3d.Vector3.ZERO);
            }

            { // Create game objects.
                const plane = egret3d.creater.createGameObject("Plane", {
                    mesh: egret3d.DefaultMeshes.PLANE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG).setCullFace(false).setTexture(subCamera.renderTarget),
                });
                plane.layer = paper.Layer.UserLayer10;
                plane.transform.setLocalPosition(0.0, 0.0, 1.0);
                plane.addComponent(behaviors.Rotater);
                //
                const gameObject = paper.Prefab.create("Assets/Models/Mixamo/ybot.prefab.json")!;
                const animation = gameObject.getOrAddComponent(egret3d.Animation);
                animation.animations = [
                    RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                ];
                animation.play("Running");
                gameObject.transform.setLocalPosition(0.0, 0.0, -1.0);
                gameObject.addComponent(behaviors.Rotater);

                for (const renderer of gameObject.getComponentsInChildren(egret3d.SkinnedMeshRenderer)) {
                    renderer.gameObject.layer = paper.Layer.UserLayer11;
                }
            }

            const room = createGridRoom();
            room.layer = paper.Layer.UserLayer10;
        }
    }
}
