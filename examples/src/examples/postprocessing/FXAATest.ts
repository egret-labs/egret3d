namespace examples.postprocessing {

    export class FXAATest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            paper.GameObject.globalGameObject.addComponent(Starter);
        }
    }

    class Normal extends egret3d.CameraPostprocessing {
        public onRender(camera: egret3d.Camera) {
            this.blit(camera.postprocessingRenderTarget, null, camera.renderTarget);
        }
    }

    class FXAA extends egret3d.CameraPostprocessing {
        private ffxxMat:egret3d.Material = egret3d.Material.create(egret3d.DefaultShaders.FXAA);
        public onRender(camera: egret3d.Camera) {
            const ffxx = this.ffxxMat;
            ffxx.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, ffxx, camera.renderTarget);
        }
    }

    class Starter extends paper.Behaviour {
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;
        private readonly _leftCamera: egret3d.Camera = paper.GameObject.create("Left Camera").addComponent(egret3d.Camera);
        private readonly _rightCamera: egret3d.Camera = paper.GameObject.create("Right Camera").addComponent(egret3d.Camera);

        public onAwake() {
            const mainCamera = this._mainCamera;
            const leftCamera = this._leftCamera;
            const rightCamera = this._rightCamera;
            
            // 开发者需要在自己的摄像机上加上FXAAPostProcess内置组件就可以实现fxaa,此例子只为演示加了fxaa和正常没有加的
            // mainCamera.gameObject.addComponent(egret3d.postprocess.FXAAPostProcess);

            { // left camera.
                leftCamera.order = 0;
                leftCamera.fov = 45.0 * egret3d.Const.DEG_RAD;
                leftCamera.far = 1000.0;
                leftCamera.cullingMask = paper.Layer.UserLayer10;
                leftCamera.transform.setLocalPosition(0.0, 0.0, -10.0).lookAt(egret3d.Vector3.ZERO);
                leftCamera.renderTarget = egret3d.RenderTexture.create({ width: 512, height: 512 }).setLiner(egret3d.FilterMode.Bilinear);
                leftCamera.gameObject.addComponent(Normal);
            }

            { // right camera.
                rightCamera.order = 1;
                rightCamera.fov = 45.0 * egret3d.Const.DEG_RAD;
                rightCamera.far = 1000.0;
                rightCamera.cullingMask = paper.Layer.UserLayer10;
                rightCamera.viewport.set(0.0, 0.0, 1.0, 1.0).update();
                rightCamera.transform.setLocalPosition(0.0, 0.0, -10.0).lookAt(egret3d.Vector3.ZERO);
                rightCamera.renderTarget = egret3d.RenderTexture.create({ width: 512, height: 512 }).setLiner(egret3d.FilterMode.Bilinear);
                rightCamera.gameObject.addComponent(FXAA);
            }

            { // Main camera.
                mainCamera.order = 2;
                mainCamera.opvalue = 0.0;
                mainCamera.size = 1.0;
                mainCamera.near = 0.01;
                mainCamera.far = 1.0;
                mainCamera.projectionMatrix = egret3d.Matrix4.IDENTITY;
                mainCamera.cullingMask = paper.Layer.UserLayer8;
                mainCamera.transform.setLocalPosition(0.0, 0.0, 0.0).lookAt(egret3d.Vector3.ZERO);
            }

            {
                // left plane
                const leftPlane = egret3d.creater.createGameObject("leftPlane", { mesh: egret3d.MeshBuilder.createPlane(1.0, 2.0), material: egret3d.DefaultMaterials.MESH_BASIC.clone().setCullFace(false) });
                leftPlane.layer = paper.Layer.UserLayer8;
                leftPlane.transform.setLocalScale(1.0, 1.0, 1.0);
                leftPlane.transform.setLocalPosition(-0.5, 0.0, 0.0);
                const meshRenderer = leftPlane.getComponent(egret3d.MeshRenderer)!;
                const material = meshRenderer.material!;
                material.setTexture(leftCamera.renderTarget);
            }

            {
                // right plane
                const rightPlane = egret3d.creater.createGameObject("rightPlane", { mesh: egret3d.MeshBuilder.createPlane(1.0, 2.0), material: egret3d.DefaultMaterials.MESH_BASIC.clone().setCullFace(false) });
                rightPlane.layer = paper.Layer.UserLayer8;
                rightPlane.transform.setLocalScale(1.0, 1.0, 1.0);
                rightPlane.transform.setLocalPosition(0.5, 0.0, 0.0);
                const meshRenderer = rightPlane.getComponent(egret3d.MeshRenderer)!;
                const material = meshRenderer.material!;
                material.setTexture(rightCamera.renderTarget);
            }

            for (let i = 0; i < 100; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.name = "Cube_" + i;
                cube.layer = paper.Layer.UserLayer10;
                cube.addComponent(behaviors.Rotater);
                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                const ranColor = egret3d.Color.create(Math.random(), Math.random(), Math.random());
                renderer.material = renderer.material!.clone().setColor(ranColor);
                cube.transform.position = egret3d.Vector3.create(Math.random() * 20 - 10, Math.random() * 10 - 5, Math.random() * 10 - 5);
            }
        }
    }
}