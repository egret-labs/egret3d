namespace paper.editor {
    /**
     * @internal
     */
    export class SceneSystem extends BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: egret3d.Transform }
            ]
        ];

        private readonly _cameraAndLightCollecter: egret3d.CameraAndLightCollecter = GameObject.globalGameObject.getOrAddComponent(egret3d.CameraAndLightCollecter);
        private readonly _inputCollecter: egret3d.InputCollecter = GameObject.globalGameObject.getOrAddComponent(egret3d.InputCollecter);
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);

        private readonly _pointerStartPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _pointerPosition: egret3d.Vector3 = egret3d.Vector3.create();

        private _orbitControls: OrbitControls | null = null;
        private _transformController: TransfromController | null = null;
        private _boxesDrawer: BoxesDrawer | null = null;
        private _boxColliderDrawer: BoxColliderDrawer | null = null;
        private _sphereColliderDrawer: SphereColliderDrawer | null = null;
        private _skeletonDrawer: SkeletonDrawer | null = null;
        private _cameraViewFrustum: GameObject | null = null; // TODO封装一下
        private _worldAxisesDrawer: WorldAxisesDrawer | null = null;
        private _gridDrawer: GridDrawer | null = null;

        private readonly _keyEscape: egret3d.Key = this._inputCollecter.getKey("Escape");
        private readonly _keyDelete: egret3d.Key = this._inputCollecter.getKey("Delete");
        private readonly _keyE: egret3d.Key = this._inputCollecter.getKey("KeyE");
        private readonly _keyW: egret3d.Key = this._inputCollecter.getKey("KeyW");
        private readonly _keyR: egret3d.Key = this._inputCollecter.getKey("KeyR");
        private readonly _keyX: egret3d.Key = this._inputCollecter.getKey("KeyX");
        private readonly _keyF: egret3d.Key = this._inputCollecter.getKey("KeyF");

        private _onMouseDown = (event: MouseEvent) => {
            if (event.button === 0) {
                if (event.buttons & 0b10) { // 正在控制摄像机。
                    return;
                }

                this._pointerStartPosition.copy(this._pointerPosition);
                const transformController = this._transformController!;
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.start(this._pointerPosition);
                }
            }
            else if (event.button === 1) {
            }

            event.preventDefault();
        }

        private _onMouseUp = (event: MouseEvent) => {
            const canvas = egret3d.WebGLCapabilities.canvas!;

            if (event.target !== canvas && (event.target as HTMLElement).tagName.toLowerCase() !== "html") {
                return;
            }

            if (event.button === 0) {
                const transformController = this._transformController!;
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.end();
                }
                else { // Update selected.
                    const hoveredGameObject = this._modelComponent.hoveredGameObject;
                    if (hoveredGameObject) {
                        if (this._modelComponent.selectedGameObjects.indexOf(hoveredGameObject) >= 0) {
                            if (event.ctrlKey) {
                                this._modelComponent.unselect(hoveredGameObject);
                            }
                        }
                        else {
                            if (this._pointerPosition.getDistance(this._pointerStartPosition) < 5.0) {
                                if (hoveredGameObject.renderer instanceof egret3d.SkinnedMeshRenderer && !hoveredGameObject.transform.find("__pickTarget")) { //
                                    const animation = hoveredGameObject.getComponentInParent(egret3d.Animation);
                                    if (animation) {
                                        const pickGameObject = EditorMeshHelper.createGameObject("__pickTarget", null, null, DefaultTags.EditorOnly, hoveredGameObject.scene);
                                        pickGameObject.transform.parent = hoveredGameObject.transform;
                                        pickGameObject.addComponent(GizmoPickComponent).pickTarget = animation.gameObject;
                                    }
                                }

                                const pickHelper = hoveredGameObject.name === "__pickTarget" ? hoveredGameObject.transform : hoveredGameObject.transform.find("__pickTarget");
                                if (pickHelper) {
                                    this._modelComponent.select(pickHelper.gameObject.getComponent(GizmoPickComponent)!.pickTarget, !(event.ctrlKey));
                                }
                                else {
                                    this._modelComponent.select(hoveredGameObject, !event.ctrlKey);
                                }
                            }
                            else if (event.ctrlKey) {
                                // TODO
                            }
                            else {
                                // TODO
                            }
                        }
                    }
                    else if (!event.ctrlKey && !event.shiftKey) {
                        this._modelComponent.select(Scene.activeScene);
                    }
                }
            }
            else if (event.button === 1) {

            }

            event.preventDefault();
        }

        private _onMouseMove = (event: MouseEvent) => {
            const canvas = egret3d.WebGLCapabilities.canvas!;

            this._pointerPosition.set(event.clientX - canvas.clientLeft, event.clientY - canvas.clientTop, 0.0);
            this._inputCollecter.screenToStage(this._pointerPosition, this._pointerPosition);

            if (event.buttons & 0b10) { // 正在控制摄像机。

            }
            else if (event.buttons & 0b01) {

            }
            else if (event.target === canvas) { // Update hovered.
                const transformController = this._transformController!;
                if (transformController.isActiveAndEnabled) {
                    if (event.shiftKey || event.ctrlKey) {
                        transformController.hovered = null;
                    }
                    else {
                        const raycastInfos = Helper.raycastAll(transformController.mode.transform.children, this._pointerPosition.x, this._pointerPosition.y);
                        if (raycastInfos.length > 0) {
                            transformController.hovered = raycastInfos[0].transform!.gameObject;
                        }
                        else {
                            transformController.hovered = null;
                        }
                    }
                }
                else {
                    transformController.hovered = null;
                }

                if (!transformController || !transformController.isActiveAndEnabled || !transformController.hovered) {
                    const raycastInfos = Helper.raycastAll(Scene.activeScene.getRootGameObjects(), this._pointerPosition.x, this._pointerPosition.y);
                    if (raycastInfos.length > 0) {
                        this._modelComponent.hover(raycastInfos[0].transform!.gameObject);
                    }
                    else {
                        this._modelComponent.hover(null);
                    }
                }
                else {
                    this._modelComponent.hover(null);
                }
            }

            event.preventDefault();
        }

        private _onGameObjectHovered = (_c: any, value: GameObject | null) => {
        }

        private _onGameObjectSelectChanged = (_c: any, value: GameObject) => {
            const selectedGameObject = this._modelComponent.selectedGameObject;

            this._transformController!.gameObject.activeSelf =
                selectedGameObject ? true : false;

            this._cameraViewFrustum!.activeSelf =
                selectedGameObject && selectedGameObject !== GameObject.globalGameObject && selectedGameObject.getComponent(egret3d.Camera) ? true : false;
        }

        private _onGameObjectSelected = (_c: any, value: GameObject) => {
        }

        private _onGameObjectUnselected = (_c: any, value: GameObject) => {
        }

        private _updateCameras() {
            const editorCamera = egret3d.Camera.editor;

            for (const camera of this._cameraAndLightCollecter.cameras) {
                if (camera === editorCamera) {
                    continue;
                }

                let icon = camera.gameObject.transform.find("__pickTarget") as egret3d.Transform;
                if (!icon) {
                    icon = EditorMeshHelper.createIcon("__pickTarget", camera.gameObject, EditorDefaultTexture.CAMERA_ICON).transform;
                }

                const cameraPosition = egret3d.Camera.editor.gameObject.transform.getPosition();
                const eyeDistance = cameraPosition.getDistance(camera.gameObject.transform.position);
                icon.gameObject.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                icon.gameObject.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
            }

            const setPoint = (cameraProject: egret3d.Matrix, positions: Float32Array, x: number, y: number, z: number, points: number[]) => {
                const vector = egret3d.Vector3.create();
                const matrix = egret3d.Matrix4.create();

                vector.set(x, y, z).applyMatrix(matrix.inverse(cameraProject)).applyMatrix(egret3d.Matrix4.IDENTITY);
                if (points !== undefined) {
                    for (var i = 0, l = points.length; i < l; i++) {
                        const index = points[i] * 3;
                        positions[index + 0] = vector.x;
                        positions[index + 1] = vector.y;
                        positions[index + 2] = vector.z;
                    }
                }

                vector.release();
                matrix.release();
            };

            const cameraViewFrustum = this._cameraViewFrustum!;
            if (cameraViewFrustum.activeSelf) {
                const selectedCamera = this._modelComponent.selectedGameObject!.getComponent(egret3d.Camera)!;
                cameraViewFrustum.transform.position = selectedCamera.gameObject.transform.position;
                cameraViewFrustum.transform.rotation = selectedCamera.gameObject.transform.rotation;

                const mesh = cameraViewFrustum.getComponent(egret3d.MeshFilter)!.mesh!;
                const cameraProject = egret3d.Matrix4.create();
                const viewPortPixel: egret3d.IRectangle = { x: 0, y: 0, w: 0, h: 0 };
                selectedCamera.calcViewPortPixel(viewPortPixel); // update viewport
                selectedCamera.calcProjectMatrix(viewPortPixel.w / viewPortPixel.h, cameraProject);

                const positions = mesh.getVertices()!;
                // center / target
                setPoint(cameraProject, positions, 0, 0, -1, [38, 41]);
                setPoint(cameraProject, positions, 0, 0, 1, [39]);
                // near,
                setPoint(cameraProject, positions, -1, -1, -1, [0, 7, 16, 25]);
                setPoint(cameraProject, positions, 1, -1, -1, [1, 2, 18, 27]);
                setPoint(cameraProject, positions, -1, 1, -1, [5, 6, 20, 29]);
                setPoint(cameraProject, positions, 1, 1, - 1, [3, 4, 22, 31]);
                // far,
                setPoint(cameraProject, positions, -1, -1, 1, [8, 15, 17]);
                setPoint(cameraProject, positions, 1, -1, 1, [9, 10, 19]);
                setPoint(cameraProject, positions, -1, 1, 1, [13, 14, 21]);
                setPoint(cameraProject, positions, 1, 1, 1, [11, 12, 23]);
                // up,
                setPoint(cameraProject, positions, 0.7, 1.1, -1, [32, 37]);
                setPoint(cameraProject, positions, -0.7, 1.1, -1, [33, 34]);
                setPoint(cameraProject, positions, 0, 2, -1, [35, 36]);
                // cross,
                setPoint(cameraProject, positions, -1, 0, 1, [42]);
                setPoint(cameraProject, positions, 1, 0, 1, [43]);
                setPoint(cameraProject, positions, 0, -1, 1, [44]);
                setPoint(cameraProject, positions, 0, 1, 1, [45]);

                setPoint(cameraProject, positions, -1, 0, -1, [46]);
                setPoint(cameraProject, positions, 1, 0, -1, [47]);
                setPoint(cameraProject, positions, 0, -1, -1, [48]);
                setPoint(cameraProject, positions, 0, 1, -1, [49]);

                mesh.uploadVertexBuffer(gltf.MeshAttributeType.POSITION);

                cameraProject.release();
            }
        }

        private _updateLights() {
            for (const light of this._cameraAndLightCollecter.lights) {
                if (light.gameObject.tag === DefaultTags.EditorOnly) { // TODO
                    continue;
                }

                let icon = light.gameObject.transform.find("__pickTarget") as egret3d.Transform;
                if (!icon) {
                    icon = EditorMeshHelper.createIcon("__pickTarget", light.gameObject, EditorDefaultTexture.LIGHT_ICON).transform;
                }

                const cameraPosition = egret3d.Camera.editor.gameObject.transform.getPosition();
                const eyeDistance = cameraPosition.getDistance(light.gameObject.transform.position);
                icon.gameObject.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                icon.gameObject.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
            }
        }

        public onEnable() {
            ModelComponent.onGameObjectHovered.add(this._onGameObjectHovered, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectChanged, this);
            ModelComponent.onGameObjectSelected.add(this._onGameObjectSelected, this);
            ModelComponent.onGameObjectUnselected.add(this._onGameObjectUnselected, this);

            { // TODO remove
                const canvas = egret3d.WebGLCapabilities.canvas!;
                canvas.addEventListener("mousedown", this._onMouseDown);
                window.addEventListener("mouseup", this._onMouseUp);
                window.addEventListener("mousemove", this._onMouseMove);
            }

            this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(OrbitControls);

            this._transformController = EditorMeshHelper.createGameObject("TransformController").addComponent(TransfromController);
            this._transformController.gameObject.activeSelf = false;
            this._boxesDrawer = EditorMeshHelper.createGameObject("BoxesDrawer").addComponent(BoxesDrawer);
            this._boxColliderDrawer = EditorMeshHelper.createGameObject("BoxColliderDrawer").addComponent(BoxColliderDrawer);
            this._sphereColliderDrawer = EditorMeshHelper.createGameObject("SphereColliderDrawer").addComponent(SphereColliderDrawer);
            this._skeletonDrawer = EditorMeshHelper.createGameObject("SkeletonDrawer").addComponent(SkeletonDrawer);
            this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera");
            this._cameraViewFrustum.activeSelf = false;
            this._worldAxisesDrawer = EditorMeshHelper.createGameObject("WorldAxisesDrawer").addComponent(WorldAxisesDrawer);
            this._gridDrawer = EditorMeshHelper.createGameObject("GridDrawer").addComponent(GridDrawer);

            // TODO
            // const editorCamera = egret3d.Camera.editor;
            // const mainCamera = egret3d.Camera.main;
            // editorCamera.transform.position = mainCamera.transform.position;
            // editorCamera.transform.rotation = mainCamera.transform.rotation;
        }

        public onDisable() {
            ModelComponent.onGameObjectHovered.remove(this._onGameObjectHovered, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectChanged, this);
            ModelComponent.onGameObjectSelected.remove(this._onGameObjectSelected, this);
            ModelComponent.onGameObjectUnselected.remove(this._onGameObjectUnselected, this);

            { // TODO remove
                const canvas = egret3d.WebGLCapabilities.canvas!;
                canvas.removeEventListener("mousedown", this._onMouseDown);
                window.removeEventListener("mouseup", this._onMouseUp);
                window.removeEventListener("mousemove", this._onMouseMove);
            }

            //
            for (const camera of this._cameraAndLightCollecter.cameras) {
                if (camera.gameObject.tag === DefaultTags.EditorOnly) {
                    continue;
                }

                const icon = camera.gameObject.transform.find("__pickTarget");
                if (icon) {
                    icon.gameObject.destroy();
                }
            }

            for (const light of this._cameraAndLightCollecter.lights) {
                if (light.gameObject.tag === DefaultTags.EditorOnly) {
                    continue;
                }

                const icon = light.gameObject.transform.find("__pickTarget");
                if (icon) {
                    icon.gameObject.destroy();
                }
            }

            egret3d.Camera.editor.gameObject.removeComponent(OrbitControls);
            this._orbitControls = null;

            this._transformController!.gameObject.destroy();
            this._transformController = null;

            this._boxesDrawer!.gameObject.destroy();
            this._boxesDrawer = null;

            this._boxColliderDrawer!.gameObject.destroy();
            this._boxColliderDrawer = null;

            this._sphereColliderDrawer!.gameObject.destroy();
            this._sphereColliderDrawer = null;

            this._skeletonDrawer!.gameObject.destroy();
            this._skeletonDrawer = null;

            this._cameraViewFrustum!.destroy();
            this._cameraViewFrustum = null;

            this._worldAxisesDrawer!.gameObject.destroy();
            this._worldAxisesDrawer = null;
            this._gridDrawer!.gameObject.destroy();
            this._gridDrawer = null;
        }

        public onUpdate() {
            const transformController = this._transformController!;

            if (this._keyEscape.isUp(false) && !this._keyEscape.event!.altKey && !this._keyEscape.event!.ctrlKey && !this._keyEscape.event!.shiftKey) {
                this._modelComponent.select(null);
            }

            if (this._keyDelete.isUp(false) && !this._keyDelete.event!.altKey && !this._keyDelete.event!.ctrlKey && !this._keyDelete.event!.shiftKey) {
                if (Application.playerMode !== PlayerMode.Editor) {
                    for (const gameObject of this._modelComponent.selectedGameObjects) {
                        gameObject.destroy();
                    }
                }
            }

            if (this._keyW.isUp(false) && !this._keyW.event!.altKey && !this._keyW.event!.ctrlKey && !this._keyW.event!.shiftKey) {
                transformController.mode = transformController.translate;
            }

            if (this._keyE.isUp(false) && !this._keyE.event!.altKey && !this._keyE.event!.ctrlKey && !this._keyE.event!.shiftKey) {
                transformController.mode = transformController.rotate;
            }

            if (this._keyR.isUp(false) && !this._keyR.event!.altKey && !this._keyR.event!.ctrlKey && !this._keyR.event!.shiftKey) {
                transformController.mode = transformController.scale;
            }

            if (this._keyX.isUp(false) && !this._keyX.event!.altKey && !this._keyX.event!.ctrlKey && !this._keyX.event!.shiftKey) {
                transformController.isWorldSpace = !transformController.isWorldSpace;
            }

            if (this._keyF.isUp(false) && !this._keyF.event!.altKey && !this._keyF.event!.ctrlKey && !this._keyF.event!.shiftKey) {
                this._orbitControls!.distance = 10.0;
                this._orbitControls!.lookAtOffset.set(0.0, 0.0, 0.0);

                if (this._modelComponent.selectedGameObject) {
                    this._orbitControls!.lookAtPoint.copy(this._modelComponent.selectedGameObject.transform.position);
                }
                else {
                    this._orbitControls!.lookAtPoint.copy(egret3d.Vector3.ZERO);
                }
            }

            // Update model gameObjects.
            if (this._modelComponent.hoveredGameObject && this._modelComponent.hoveredGameObject.isDestroyed) {
                this._modelComponent.hover(null);
            }

            for (const gameObject of this._modelComponent.selectedGameObjects) {
                if (gameObject.isDestroyed) {
                    this._modelComponent.unselect(gameObject);
                }
            }

            if (transformController.isActiveAndEnabled) {
                transformController.update(this._pointerPosition);
            }

            this._boxesDrawer!.update();
            this._boxColliderDrawer!.update();
            this._sphereColliderDrawer!.update();
            this._skeletonDrawer!.update();
            this._worldAxisesDrawer!.update();
            this._gridDrawer!.update();

            this._updateCameras();
            this._updateLights();
        }
    }
}