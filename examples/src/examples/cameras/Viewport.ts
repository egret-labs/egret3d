namespace examples.cameras {

    export class Viewport implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            paper.GameObject.globalGameObject.addComponent(Update);
        }
    }

    class Update extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;
        private readonly _subCamera: egret3d.Camera = paper.GameObject.create("Sub Camera").addComponent(egret3d.Camera);
        private _gameObjectA: paper.GameObject | null = null;
        private _gameObjectB: paper.GameObject | null = null;
        private _gameObjectC: paper.GameObject | null = null;

        public onAwake() {
            const mainCamera = this._mainCamera;
            const subCamera = this._subCamera;

            { // Sub camera.
                subCamera.order = 1;
                subCamera.fov = 50.0 * egret3d.Const.DEG_RAD;
                subCamera.far = 1000.0;
                subCamera.near = 150.0;
                subCamera.bufferMask = gltf.BufferMask.Depth;
                subCamera.viewport.set(0.0, 0.0, 0.5, 1.0);
                subCamera.transform.setLocalPosition(0.0, 0.0, 0.0);
            }

            { // Main camera.
                mainCamera.fov = 50.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 10000.0;
                mainCamera.near = 1500.0;
                mainCamera.backgroundColor.set(0.0, 0.0, 0.0);
                mainCamera.viewport.set(0.5, 0.0, 0.5, 1.0);
                mainCamera.transform.setLocalPosition(0.0, 0.0, -2500.0).lookAt(this._subCamera.transform);
            }

            { // Create stars.
                const mesh = egret3d.Mesh.create(10000, 0, [gltf.AttributeSemantics.POSITION]);
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Points;
                //
                const vertices = mesh.getVertices()!;
                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    vertices[i] = egret3d.math.randFloatSpread(2000.0);
                    vertices[i + 1] = egret3d.math.randFloatSpread(2000.0);
                    vertices[i + 2] = egret3d.math.randFloatSpread(2000.0);
                }
                //
                const gameObject = egret3d.DefaultMeshes.createObject(mesh, "Stars");
                gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.POINTS)
                    .setColor(0x888888)
                    .setFloat(egret3d.ShaderUniformName.Size, 1.0);
            }

            { // Create game objects.
                const meshA = egret3d.MeshBuilder.createSphere(100.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);
                const meshB = egret3d.MeshBuilder.createSphere(50.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);
                const meshC = egret3d.MeshBuilder.createSphere(5.0, 0.0, 0.0, 0.0, 16, 8).addWireframeSubMesh(1);

                const gameObjectA = this._gameObjectA = egret3d.DefaultMeshes.createObject(meshA, "Target A");
                const gameObjectB = this._gameObjectB = egret3d.DefaultMeshes.createObject(meshB, "Target B");
                const gameObjectC = this._gameObjectC = egret3d.DefaultMeshes.createObject(meshC, "Target C");

                gameObjectA.renderer!.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.WHITE)];
                gameObjectB.renderer!.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.GREEN)];
                gameObjectC.renderer!.materials = [null, egret3d.DefaultMaterials.MESH_BASIC.clone().setColor(egret3d.Color.BLUE)];
                gameObjectB.transform.setParent(gameObjectA.transform);
                gameObjectC.transform.setParent(subCamera.transform).setLocalPosition(0.0, 0.0, 150.0);
            }
        }

        public onUpdate() {
            const mainCamera = this._mainCamera;
            const subCamera = this._subCamera;
            const gameObjectA = this._gameObjectA!;
            const gameObjectB = this._gameObjectB!;
            const gameObjectC = this._gameObjectC!;

            const r = paper.clock.time * 0.5;
            const lA = 700.0;
            const lB = 70.0;

            gameObjectA.transform.setLocalPosition(lA * Math.cos(r), lA * Math.sin(r), lA * Math.sin(r));
            gameObjectB.transform.setLocalPosition(lB * Math.cos(2.0 * r), 150.0, lB * Math.sin(r));

            subCamera.opvalue = (Math.sin(r * 0.25) + 1.0) * 0.5;
            subCamera.far = gameObjectA.transform.localPosition.length;
            subCamera.fov = (35.0 + 30.0 * Math.sin(0.5 * r)) * egret3d.Const.DEG_RAD;
            subCamera.size = 300.0 + 100.0 * Math.sin(r);

            this._subCamera.transform.lookAt(gameObjectA.transform);
        }
    }
}