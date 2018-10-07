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

        private readonly _camerasAndLights: egret3d.CamerasAndLights = GameObject.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
        private readonly _inputCollecter: egret3d.InputCollecter = GameObject.globalGameObject.getOrAddComponent(egret3d.InputCollecter);
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);

        private readonly _pointerStartPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _pointerPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _boxes: { [key: string]: GameObject } = {};

        private _orbitControls: OrbitControls | null = null;
        private _gridController: GridController | null = null;
        private _transformController: TransfromController | null = null;
        private _skeletonDrawer: SkeletonDrawer | null = null;

        private _hoverBox: GameObject | null = null;
        private _boxColliderDrawer: GameObject | null = null;
        // private _sphereColliderDrawer: GameObject | null = null;
        private _cameraViewFrustum: GameObject | null = null; // TODO封装一下

        private readonly _keyEscape: egret3d.Key = this._inputCollecter.getKey("Escape");
        private readonly _keyDelete: egret3d.Key = this._inputCollecter.getKey("Delete");
        private readonly _keyE: egret3d.Key = this._inputCollecter.getKey("KeyE");
        private readonly _keyW: egret3d.Key = this._inputCollecter.getKey("KeyW");
        private readonly _keyR: egret3d.Key = this._inputCollecter.getKey("KeyR");
        private readonly _keyX: egret3d.Key = this._inputCollecter.getKey("KeyX");
        private readonly _keyF: egret3d.Key = this._inputCollecter.getKey("KeyF");

        private _onMouseDown = (event: MouseEvent) => {
            this._pointerStartPosition.copy(this._pointerPosition);

            if (event.button === 0) {
                if (event.buttons & 0b10) { // 正在控制摄像机。
                    return;
                }

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
                        this._modelComponent.select(paper.Scene.activeScene);
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
                        const raycastInfos = Helper.raycast(transformController.mode.transform.children, this._pointerPosition.x, this._pointerPosition.y);
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
                    const raycastInfos = Helper.raycast(Scene.activeScene.getRootGameObjects(), this._pointerPosition.x, this._pointerPosition.y);
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
            this._hoverBox!.activeSelf =
                value && value.renderer ? true : false;
        }

        private _onGameObjectSelectChanged = (_c: any, value: GameObject) => {
            const selectedGameObject = this._modelComponent.selectedGameObject;

            this._transformController!.gameObject.activeSelf =
                selectedGameObject ? true : false;

            this._boxColliderDrawer!.activeSelf =
                selectedGameObject && selectedGameObject.getComponent(egret3d.BoxCollider) ? true : false;

            // this._sphereColliderDrawer!.activeSelf =
            //     selectedGameObject && selectedGameObject.getComponent(egret3d.SphereCollider) ? true : false;

            this._skeletonDrawer!.gameObject.activeSelf =
                selectedGameObject && selectedGameObject.renderer && selectedGameObject.renderer instanceof egret3d.SkinnedMeshRenderer ? true : false;

            this._cameraViewFrustum!.activeSelf =
                selectedGameObject && selectedGameObject.getComponent(egret3d.Camera) ? true : false;
        }

        private _onGameObjectSelected = (_c: any, value: GameObject) => {
            this._selectGameObject(value, true);
        }

        private _onGameObjectUnselected = (_c: any, value: GameObject) => {
            this._selectGameObject(value, false);
        }

        private _selectGameObject(value: GameObject, selected: boolean) {
            if (selected) {
                { // Create box.
                    const box = EditorMeshHelper.createBox("Box", egret3d.Color.INDIGO, 0.8, value.scene);
                    box.activeSelf = false;
                    box.parent = value;
                    this._boxes[value.uuid] = box;
                }
            }
            else {
                const box = this._boxes[value.uuid];
                if (!box) {
                    throw new Error(); // Never.
                }

                delete this._boxes[value.uuid];

                if (!box.isDestroyed) {
                    box.destroy();
                }
            }
        }

        private _updateCameras() {
            const editorCamera = egret3d.Camera.editor;

            for (const camera of this._camerasAndLights.cameras) {
                if (camera === editorCamera) {
                    continue;
                }

                let icon = camera.transform.find("__pickTarget") as egret3d.Transform;
                if (!icon) {
                    icon = EditorMeshHelper.createIcon("__pickTarget", camera.gameObject, EditorDefaultTexture.CAMERA_ICON).transform;
                }

                const cameraPosition = egret3d.Camera.editor.transform.getPosition();
                const eyeDistance = cameraPosition.getDistance(camera.transform.position);
                icon.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                icon.transform.rotation = egret3d.Camera.editor.transform.rotation;
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
            for (const light of this._camerasAndLights.lights) {
                if (light.gameObject.tag === DefaultTags.EditorOnly) { // TODO
                    continue;
                }

                let icon = light.transform.find("__pickTarget") as egret3d.Transform;
                if (!icon) {
                    icon = EditorMeshHelper.createIcon("__pickTarget", light.gameObject, EditorDefaultTexture.LIGHT_ICON).transform;
                }

                const cameraPosition = egret3d.Camera.editor.transform.getPosition();
                const eyeDistance = cameraPosition.getDistance(light.transform.position);
                icon.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                icon.transform.rotation = egret3d.Camera.editor.transform.rotation;
            }
        }

        private _updateBoxes() {
            for (const gameObject of this._modelComponent.selectedGameObjects) {
                const box = this._boxes[gameObject.uuid];
                if (!box) {
                    throw new Error(); // Never.
                }

                if (gameObject.renderer) {
                    box.activeSelf = true;
                    box.transform.localPosition = gameObject.renderer.aabb.center;
                    // box.transform.localScale = gameObject.renderer.aabb.size;
                    const size = gameObject.renderer.aabb.size; // TODO
                    box.transform.setLocalScale(size.x || 0.001, size.y || 0.001, size.z || 0.001);
                }
                else {
                    box.activeSelf = false;
                }
            }
        }

        public onEnable() {
            ModelComponent.onGameObjectHovered.add(this._onGameObjectHovered, this);
            ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectChanged, this);
            ModelComponent.onGameObjectSelected.add(this._onGameObjectSelected, this);
            ModelComponent.onGameObjectUnselected.add(this._onGameObjectUnselected, this);

            { //
                const inputCollecter = GameObject.globalGameObject.getComponent(egret3d.InputCollecter)!;
                const canvas = egret3d.WebGLCapabilities.canvas!;
                canvas.addEventListener("mousedown", this._onMouseDown);
                window.addEventListener("mouseup", this._onMouseUp);
                window.addEventListener("mousemove", this._onMouseMove);
            }

            this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(OrbitControls);

            this._transformController = EditorMeshHelper.createGameObject("Axises").addComponent(TransfromController);
            this._transformController.gameObject.activeSelf = false;

            this._skeletonDrawer = EditorMeshHelper.createGameObject("SkeletonDrawer").addComponent(SkeletonDrawer);
            this._skeletonDrawer.gameObject.activeSelf = false;

            this._gridController = EditorMeshHelper.createGameObject("Grid").addComponent(GridController);

            this._hoverBox = EditorMeshHelper.createBox("HoverBox", egret3d.Color.WHITE, 0.6, GameObject.globalGameObject.scene);
            this._hoverBox.activeSelf = false;

            this._boxColliderDrawer = EditorMeshHelper.createBox("BoxColliderDrawer", egret3d.Color.YELLOW, 0.8, GameObject.globalGameObject.scene);
            this._boxColliderDrawer.activeSelf = false;

            // this._sphereColliderDrawer = EditorMeshHelper.createBox("SphereColliderDrawer", egret3d.Color.YELLOW, 0.8, GameObject.globalGameObject.scene);
            // this._sphereColliderDrawer.activeSelf = false;

            this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera");
            this._cameraViewFrustum.activeSelf = false;

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

            { //
                const inputCollecter = GameObject.globalGameObject.getComponent(egret3d.InputCollecter)!;
                const canvas = egret3d.WebGLCapabilities.canvas!;
                canvas.removeEventListener("mousedown", this._onMouseDown);
                window.removeEventListener("mouseup", this._onMouseUp);
                window.removeEventListener("mousemove", this._onMouseMove);
            }

            //
            for (const camera of this._camerasAndLights.cameras) {
                if (camera.gameObject.tag === DefaultTags.EditorOnly) {
                    continue;
                }

                const icon = camera.transform.find("__pickTarget");
                if (icon) {
                    icon.gameObject.destroy();
                }
            }

            for (const light of this._camerasAndLights.lights) {
                if (light.gameObject.tag === DefaultTags.EditorOnly) {
                    continue;
                }

                const icon = light.transform.find("__pickTarget");
                if (icon) {
                    icon.gameObject.destroy();
                }
            }

            egret3d.Camera.editor.gameObject.removeComponent(OrbitControls);
            this._orbitControls = null;

            this._gridController!.gameObject.destroy();
            this._gridController = null;

            this._transformController!.gameObject.destroy();
            this._transformController = null;

            this._skeletonDrawer!.gameObject.destroy();
            this._skeletonDrawer = null;

            this._hoverBox!.destroy();
            this._hoverBox = null;

            this._boxColliderDrawer!.destroy();
            this._boxColliderDrawer = null;

            // this._sphereColliderDrawer!.destroy();
            // this._sphereColliderDrawer = null;

            this._cameraViewFrustum!.destroy();
            this._cameraViewFrustum = null;
        }

        public onUpdate() {
            const gridController = this._gridController!;
            const hoverBox = this._hoverBox!;
            const transformController = this._transformController!;
            const boxColliderDrawer = this._boxColliderDrawer!;

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

            const hoveredGameObject = this._modelComponent.hoveredGameObject;
            const selectedGameObject = this._modelComponent.selectedGameObject;

            if (gridController.isActiveAndEnabled) {
                gridController.update();
            }

            if (hoverBox.activeSelf) {
                hoverBox.transform.localPosition = egret3d.Vector3.create().copy(hoveredGameObject!.renderer!.aabb.center).applyMatrix(hoveredGameObject!.transform.worldMatrix).release();
                hoverBox.transform.localRotation = hoveredGameObject!.transform.rotation;
                hoverBox.transform.localScale = egret3d.Vector3.create().multiply(hoveredGameObject!.renderer!.aabb.size, hoveredGameObject!.transform.scale);
            }

            if (transformController.isActiveAndEnabled) {
                transformController.update(this._pointerPosition);
            }

            if (boxColliderDrawer.activeSelf) {
                const boxCollider = selectedGameObject!.getComponent(egret3d.BoxCollider)!;
                boxColliderDrawer.transform.localPosition = egret3d.Vector3.create().copy(boxCollider.aabb.center).applyMatrix(selectedGameObject!.transform.worldMatrix).release();
                boxColliderDrawer.transform.localRotation = selectedGameObject!.transform.rotation;
                boxColliderDrawer.transform.localScale = egret3d.Vector3.create().multiply(boxCollider.aabb.size, selectedGameObject!.transform.scale).release();
            }

            const skeletonDrawer = this._skeletonDrawer!;
            if (skeletonDrawer.isActiveAndEnabled) {
                skeletonDrawer.update();
            }

            this._updateCameras();
            this._updateLights();
            this._updateBoxes();
        }
    }
}