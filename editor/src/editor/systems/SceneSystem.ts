namespace paper.editor {
    /**
     * TODO
     */
    export class SceneSystem extends BaseSystem<GameObject> {
        public readonly interests = [
            [
                { componentClass: egret3d.Transform }
            ]
        ];

        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);

        private readonly _keyEscape: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Escape);
        private readonly _keyDelete: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.Delete);
        private readonly _keyE: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyE);
        private readonly _keyW: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyW);
        private readonly _keyR: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyR);
        private readonly _keyX: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyX);
        private readonly _keyF: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyF);

        private _transformController: TransformController | null = null;
        private _drawer: GameObject | null = null;
        private _touchDrawer: GameObject | null = null;

        private _boxesDrawer: BoxesDrawer | null = null;
        private _iconDrawer: IconDrawer | null = null;
        private _boxColliderDrawer: BoxColliderDrawer | null = null;
        private _sphereColliderDrawer: SphereColliderDrawer | null = null;
        private _cylinderColliderDrawer: CylinderColliderDrawer | null = null;
        private _skeletonDrawer: SkeletonDrawer | null = null;
        private _cameraViewportDrawer: CameraViewportDrawer | null = null;
        private _worldAxisesDrawer: WorldAxisesDrawer | null = null;
        private _gridDrawer: GridDrawer | null = null;
        private _cameraViewFrustum: GameObject | null = null; // TODO封装一下

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
                const cameraProject = selectedCamera.projectionMatrix;

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

                mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
            }
        }

        public lookAtSelected() {
            const orbitControls = egret3d.Camera.editor.gameObject.getComponent(OrbitControls)!;
            orbitControls!.distance = 10.0;
            orbitControls!.lookAtOffset.set(0.0, 0.0, 0.0);

            if (this._modelComponent.selectedGameObject) {
                orbitControls!.lookAtPoint.copy(this._modelComponent.selectedGameObject.transform.position);
            }
            else {
                orbitControls!.lookAtPoint.copy(egret3d.Vector3.ZERO);
            }
        }

        public onAwake() {
            // GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
        }

        public onEnable() {
            ModelComponent.onGameObjectHovered.add(this._onGameObjectHovered, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectChanged, this);
            ModelComponent.onGameObjectSelected.add(this._onGameObjectSelected, this);
            ModelComponent.onGameObjectUnselected.add(this._onGameObjectUnselected, this);

            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.addComponent(OrbitControls);
            editorCamera.enabled = true;

            this._transformController = EditorMeshHelper.createGameObject("Transform Controller").addComponent(TransformController);
            this._transformController.gameObject.activeSelf = false;

            this._drawer = EditorMeshHelper.createGameObject("Drawer");
            this._touchDrawer = EditorMeshHelper.createGameObject("Touch Drawer");

            this._boxesDrawer = this._drawer.addComponent(BoxesDrawer);
            this._iconDrawer = this._touchDrawer.addComponent(IconDrawer);
            this._boxColliderDrawer = this._drawer.addComponent(BoxColliderDrawer);
            this._sphereColliderDrawer = this._drawer.addComponent(SphereColliderDrawer);
            this._cylinderColliderDrawer = this._drawer.addComponent(CylinderColliderDrawer);
            this._skeletonDrawer = this._drawer.addComponent(SkeletonDrawer);
            this._cameraViewportDrawer = this._drawer.addComponent(CameraViewportDrawer);
            this._gridDrawer = this._drawer.addComponent(GridDrawer);

            this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera Wire Frame");
            this._cameraViewFrustum.activeSelf = false;
            // this._worldAxisesDrawer = EditorMeshHelper.createGameObject("WorldAxisesDrawer").addComponent(WorldAxisesDrawer);

            // TODO
            // const mainCamera = egret3d.Camera.main;
            // editorCamera.transform.position = mainCamera.transform.position;
            // editorCamera.transform.rotation = mainCamera.transform.rotation;
        }

        public onDisable() {
            ModelComponent.onGameObjectHovered.remove(this._onGameObjectHovered, this);
            ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectChanged, this);
            ModelComponent.onGameObjectSelected.remove(this._onGameObjectSelected, this);
            ModelComponent.onGameObjectUnselected.remove(this._onGameObjectUnselected, this);

            const editorCamera = egret3d.Camera.editor;
            editorCamera.gameObject.removeComponent(OrbitControls);
            editorCamera.enabled = false;

            this._transformController!.gameObject.destroy();
            this._drawer!.destroy();
            this._touchDrawer!.destroy();

            this._transformController = null;
            this._drawer = null;
            this._touchDrawer = null;
            this._boxesDrawer = null;
            this._iconDrawer = null;
            this._boxColliderDrawer = null;
            this._sphereColliderDrawer = null;
            this._cylinderColliderDrawer = null;
            this._skeletonDrawer = null;
            this._cameraViewportDrawer = null;
            this._gridDrawer = null;

            this._cameraViewFrustum!.destroy();
            this._cameraViewFrustum = null;

            // this._worldAxisesDrawer!.gameObject.destroy();
            // this._worldAxisesDrawer = null;
        }

        public onUpdate() {
            const transformController = this._transformController!;

            const defaultPointer = egret3d.inputCollecter.defaultPointer;
            if (defaultPointer.isDown(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (defaultPointer.event!.buttons & egret3d.PointerButtonsType.RightMouse) { // 正在控制摄像机。
                }
                else {
                    if (transformController.isActiveAndEnabled && transformController.hovered) {
                        transformController.start(defaultPointer.downPosition);
                    }
                }
            }

            if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse, false)) {
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.end();
                }
                else { // Update selected.
                    const event = defaultPointer.event!;
                    let hoveredGameObject = this._modelComponent.hoveredGameObject;

                    if (hoveredGameObject) {
                        if (this._modelComponent.selectedGameObjects.indexOf(hoveredGameObject) >= 0) {
                            if (event.ctrlKey) {
                                this._modelComponent.unselect(hoveredGameObject);
                            }
                        }
                        else {
                            if (defaultPointer.position.getDistance(defaultPointer.downPosition) < 5.0) {
                                if (hoveredGameObject.renderer instanceof egret3d.SkinnedMeshRenderer) { //
                                    const animation = hoveredGameObject.getComponentInParent(egret3d.Animation);
                                    if (animation) {
                                        hoveredGameObject = animation.gameObject;
                                    }
                                }
                                else {
                                    const gizmoPickComponent = hoveredGameObject.getComponent(GizmoPickComponent);
                                    if (gizmoPickComponent) {
                                        hoveredGameObject = gizmoPickComponent.pickTarget;
                                    }
                                }

                                this._modelComponent.select(hoveredGameObject, !event.ctrlKey);
                            }
                            else if (defaultPointer.event!.ctrlKey) {
                                // TODO
                            }
                            else {
                                // TODO
                            }
                        }
                    }
                    else if (!event.ctrlKey && !event.shiftKey) {
                        if (this._modelComponent.selectedGameObject && !defaultPointer.downPosition.equal(SceneSystem._defalutPosition)) {
                            this._modelComponent.select(Scene.activeScene);
                        }
                    }
                }
            }

            if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse, false) || defaultPointer.isUp(egret3d.PointerButtonsType.RightMouse, false)) {
                this._clearDefaultPointerDownPosition();
            }

            {
                const event = defaultPointer.event;
                if (event) {
                    if (event.buttons & 0b10) { // 正在控制摄像机。

                    }
                    else if (event.buttons & 0b01) {

                    }
                    else { // Update hovered.
                        const transformController = this._transformController!;
                        if (transformController.isActiveAndEnabled) {
                            if (event.shiftKey || event.ctrlKey) {
                                transformController.hovered = null;
                            }
                            else {
                                const raycastInfos = Helper.raycastAll(transformController.mode.transform.children, defaultPointer.position.x, defaultPointer.position.y, false);
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
                            const gameObjects = Scene.activeScene.getRootGameObjects().concat();
                            gameObjects.unshift(this._touchDrawer!);

                            const raycastInfos = Helper.raycastAll(gameObjects, defaultPointer.position.x, defaultPointer.position.y, true);
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
                }
            }

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
                this.lookAtSelected();
            }

            this._modelComponent.update();

            if (transformController.isActiveAndEnabled) {
                transformController.update(defaultPointer.position);
            }

            this._boxesDrawer!.update();
            this._iconDrawer!.update();
            this._boxColliderDrawer!.update();
            this._sphereColliderDrawer!.update();
            this._cylinderColliderDrawer!.update();
            this._skeletonDrawer!.update();
            this._cameraViewportDrawer!.update();
            this._gridDrawer!.update();

            // this._worldAxisesDrawer!.update();

            this._updateCameras();
        }

        private static readonly _defalutPosition = egret3d.Vector3.create(-1, -1, -1);

        private _clearDefaultPointerDownPosition() {
            const defaultPointer = egret3d.inputCollecter.defaultPointer;
            defaultPointer.downPosition.copy(SceneSystem._defalutPosition);
        }
    }
}