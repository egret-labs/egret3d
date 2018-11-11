namespace behaviors {
    const _reflectorPlane = egret3d.Plane.create();
    const _normal = egret3d.Vector3.create();
    const _up = egret3d.Vector3.create();
    const _lookAtPosition = egret3d.Vector3.create(0.0, 0.0, -1);
    const _clipPlane = egret3d.Vector4.create();

    const _view = egret3d.Vector3.create();
    const _target = egret3d.Vector3.create();
    const _q = egret3d.Vector4.create();
    const _viewPort = egret3d.Rectangle.create();

    const _textureMatrix = egret3d.Matrix4.create()
        .set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );


    export class Reflector extends paper.Behaviour {
        private static _reflectorCamera: egret3d.Camera | null = null;
        private static _cameraRecursion: { [key: string]: number } = {};

        @paper.editor.property(paper.editor.EditType.UINT)
        public recursion: uint = 1;
        public textureWidth: uint = 1024;
        public textureHeight: uint = 1024;
        public clipBias: number = 0.03;

        public readonly color: egret3d.Color = egret3d.Color.create();

        private readonly _renderState: egret3d.WebGLRenderState = paper.GameObject.globalGameObject.getComponent(egret3d.WebGLRenderState)!;
        private readonly _renderTarget: egret3d.GlRenderTarget = new egret3d.GlRenderTarget("", this.textureWidth, this.textureHeight, true);

        public onStart() {
            if (!Reflector._reflectorCamera) {
                const gameObject = paper.GameObject.create("ReflectorCamera");
                gameObject.dontDestroy = true;

                const reflectorCamera = gameObject.addComponent(egret3d.Camera);
                reflectorCamera.enabled = false;
                // reflectorCamera.hideFlags = paper.HideFlags.HideAndDontSave;
                Reflector._reflectorCamera = reflectorCamera;
            }

            const reflectorMaterial = this.gameObject.renderer!.material!;
            reflectorMaterial
                .setRenderQueue(-1000)
                .setTexture("tDiffuse", egret3d.DefaultTextures.GRAY)
                .setColor("color", this.color)
                .setMatrix("textureMatrix", _textureMatrix);
        }

        // private _calculateReflectionMatrix(plane: Readonly<egret3d.Vector4>, out: egret3d.Matrix4) {
        //     const { x, y, z, w } = plane;
        //     out.set(
        //         1.0 - 2.0 * x * x, -2.0 * x * y, -2.0 * x * z, -2.0 * w * x,
        //         -2.0 * y * x, 1.0 - 2.0 * y * y, -2.0 * y * z, -2.0 * w * y,
        //         -2.0 * z * x, -2.0 * z * y, 1.0 - 2.0 * z * z, -2.0 * w * z,
        //         0.0, 0.0, 0.0, 1.0,
        //     );

        //     return out;
        // }

        // private readonly _testCube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);

        public onBeforeRender() {
            const currentCamera = egret3d.Camera.current!;
            const reflectorCamera = Reflector._reflectorCamera!;

            if (currentCamera === reflectorCamera) {
                return false;
            }

            const transform = this.gameObject.transform;
            const currentCameraTransform = currentCamera.gameObject.transform;
            const reflectorPosition = transform.position;
            const normal = transform.getForward(_normal).negate();
            const cameraPosition = currentCameraTransform.position;
            const view = _view.subtract(reflectorPosition, cameraPosition);

            if (view.dot(normal) > 0.0) {
                // this._testCube.transform.position = egret3d.Vector3.ZERO;
                return true; //
            }

            // const reflectorMatrix = this._calculateReflectionMatrix(clipPlane, _reflectorMatrix);
            // this._testCube.transform.position.applyMatrix(reflectorMatrix, cameraPosition).update();

            const reflectorPlane = _reflectorPlane.fromPoint(reflectorPosition, normal);
            const clipPlane = _clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

            const lookAtPosition = currentCameraTransform.getForward(_lookAtPosition).negate().add(cameraPosition);
            const up = currentCameraTransform.getUp(_up).reflect(normal);
            const target = _target.subtract(reflectorPosition, lookAtPosition).reflect(normal).add(reflectorPosition);
            view.reflect(normal).negate().add(reflectorPosition);

            // this._testCube.transform.position = target;
            // this._testCube.transform.lookAt(target, up);

            reflectorCamera.transform.position = view;
            reflectorCamera.transform.lookAt(target, up);
            reflectorCamera.opvalue = currentCamera.opvalue;
            reflectorCamera.fov = currentCamera.fov;
            reflectorCamera.near = currentCamera.near; // 
            reflectorCamera.far = currentCamera.far;
            reflectorCamera.size = currentCamera.size; // 

            // virtualCamera.userData.recursion = 0; TODO

            // const projectionMatrix = reflectorCamera.projectionMatrix;

            // // Update the texture matrix
            // _textureMatrix
            //     .set(
            //         0.5, 0.0, 0.0, 0.5,
            //         0.0, 0.5, 0.0, 0.5,
            //         0.0, 0.0, 0.5, 0.5,
            //         0.0, 0.0, 0.0, 1.0
            //     )
            //     .multiply(projectionMatrix)
            //     .multiply(reflectorCamera.gameObject.transform.worldToLocalMatrix)
            //     .multiply(transform.localToWorldMatrix);

            // _q.x = (egret3d.sign(clipPlane.x) + projectionMatrix.rawData[8]) / projectionMatrix.rawData[0];
            // _q.y = (egret3d.sign(clipPlane.y) + projectionMatrix.rawData[9]) / projectionMatrix.rawData[5];
            // _q.z = -1.0;
            // _q.w = (1.0 + projectionMatrix.rawData[10]) / projectionMatrix.rawData[14];

            // // // Calculate the scaled plane vector
            // clipPlane.multiplyScalar(2.0 / clipPlane.dot(_q));

            // // Replacing the third row of the projection matrix
            // projectionMatrix.rawData[2] = clipPlane.x;
            // projectionMatrix.rawData[6] = clipPlane.y;
            // projectionMatrix.rawData[10] = clipPlane.z + 1.0 - this.clipBias;
            // projectionMatrix.rawData[14] = clipPlane.w;

            // // // Render
            // const renderState = this._renderState;
            // const backupViewPort = _viewPort.copy(renderState.viewPort);
            // const backupRenderTarget = renderState.renderTarget;

            // reflectorCamera.renderTarget = this._renderTarget;
            // renderState.render(reflectorCamera);
            // renderState.updateViewport(backupViewPort, backupRenderTarget);

            // const reflectorMaterial = this.gameObject.renderer!.material!;
            // reflectorMaterial.setColor("color", this.color).setTexture("tDiffuse", this._renderTarget);

            return true;
        }
    }
}