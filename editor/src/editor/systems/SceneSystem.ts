namespace paper.debug {

    export class SceneSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: egret3d.Transform }
            ]
        ];

        private readonly _camerasAndLights: egret3d.CamerasAndLights = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
        private readonly _modelComponent: ModelComponent = paper.GameObject.globalGameObject.getOrAddComponent(ModelComponent);

        private readonly _pointerStartPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _pointerPosition: egret3d.Vector3 = egret3d.Vector3.create();
        // private readonly _pickableSelected: GameObject[] = [];   //可被选中的 camera
        private readonly _boxes: { [key: string]: GameObject } = {};

        private _orbitControls: OrbitControls | null = null;
        private _transformController: TransfromController | null = null;
        private _skeletonDrawer: SkeletonDrawer | null = null;
        private _gridController: GridController | null = null;

        private _hoverBox: paper.GameObject | null = null;
        private _grids: paper.GameObject | null = null;
        private _cameraViewFrustum: paper.GameObject | null = null; // TODO封装一下

        private _contextmenuHandler = (event: Event) => {
            event.preventDefault();
        }

        private _onMouseDown = (event: MouseEvent) => {
            this._pointerStartPosition.copy(this._pointerPosition);

            if (event.button === 0) {
                if (event.buttons & 0b10) { // 正在控制摄像机。
                    return;
                }

                const transformController = this._transformController;
                if (transformController && transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.start(this._pointerPosition);
                }
            }
            else if (event.button === 1) {
            }

            event.preventDefault();
        }

        private _onMouseUp = (event: MouseEvent) => {
            if (event.button === 0) {
                const transformController = this._transformController;
                if (transformController.isActiveAndEnabled && transformController.hovered) {
                    transformController.end();
                }
                else { // Update selected.
                    const hoveredGameObject = this._modelComponent.hoveredGameObject;
                    if (hoveredGameObject) {
                        const selectedGameObject = this._modelComponent.selectedGameObject;
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
                                        const pickGameObject = EditorMeshHelper.createGameObject("__pickTarget", null, null, paper.DefaultTags.EditorOnly, hoveredGameObject.scene);
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
                        this._modelComponent.select(null);
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
            egret3d.InputManager.mouse.convertPosition(this._pointerPosition, this._pointerPosition);

            if (event.buttons & 0b10) { // 正在控制摄像机。

            }
            else if (event.buttons & 0b01) {

            }
            else { // Update hovered.
                const transformController = this._transformController;
                if (transformController && transformController.isActiveAndEnabled) {
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
                    const raycastInfos = Helper.raycast(paper.Scene.activeScene.getRootGameObjects(), this._pointerPosition.x, this._pointerPosition.y);
                    if (raycastInfos.length > 0) {
                        this._modelComponent.hover(raycastInfos[0].transform.gameObject);
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

        private _onKeyUp = (event: KeyboardEvent) => {
            const transformController = this._transformController;

            if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
                switch (event.key.toLowerCase()) {
                    case "escape":
                        this._modelComponent.select(null);
                        break;

                    case "f":
                        this._orbitControls.distance = 10.0;
                        this._orbitControls.lookAtOffset.set(0.0, 0.0, 0.0);

                        if (this._modelComponent.selectedGameObject) {
                            this._orbitControls.lookAtPoint.copy(this._modelComponent.selectedGameObject.transform.position);
                        }
                        else {
                            this._orbitControls.lookAtPoint.copy(egret3d.Vector3.ZERO);
                        }
                        break;

                    case "w":
                        if (transformController) {
                            transformController.mode = transformController.translate;
                        }
                        break;

                    case "e":
                        if (transformController) {
                            transformController.mode = transformController.rotate;
                        }
                        break;

                    case "r":
                        if (transformController) {
                            transformController.mode = transformController.scale;
                        }
                        break;

                    case "x":
                        if (transformController) {
                            transformController.isWorldSpace = !transformController.isWorldSpace;
                        }
                        break;
                }
            }
        }

        private _onKeyDown = (event: KeyboardEvent) => {
        }

        private _onGameObjectHovered = (_c: any, value: GameObject) => {
            if (value) {
                this._hoverBox.activeSelf = true;
                if (this._hoverBox.scene !== value.scene) {//TODO
                    this._hoverBox.dontDestroy = true;
                    this._hoverBox.dontDestroy = false;
                }
                this._hoverBox.parent = value;
            }
            else {
                this._hoverBox.activeSelf = false;
                this._hoverBox.parent = null;
            }
        }

        private _onGameObjectSelectChanged = (_c: any, value: GameObject) => {
            const selectedGameObject = this._modelComponent.selectedGameObject;

            const transformController = this._transformController;
            if (transformController) {
                if (selectedGameObject) {
                    transformController.gameObject.activeSelf = true;
                }
                else {
                    transformController.gameObject.activeSelf = false;
                }
            }

            const skeletonDrawer = this._skeletonDrawer;
            if (skeletonDrawer) {
                if (
                    selectedGameObject &&
                    selectedGameObject.renderer instanceof egret3d.SkinnedMeshRenderer
                ) {
                    skeletonDrawer.gameObject.activeSelf = true;
                }
                else {
                    skeletonDrawer.gameObject.activeSelf = false;
                }
            }
        }

        private _onGameObjectSelected = (_c: any, value: GameObject) => {
            this._selectGameObject(value, true);
        }

        private _onGameObjectUnselected = (_c: any, value: GameObject) => {
            this._selectGameObject(value, false);
        }

        private _selectGameObject(value: paper.GameObject, selected: boolean) {
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

            if (this._hoverBox) {
                if (this._hoverBox.isDestroyed) {
                    this._hoverBox = null; // TODO
                }
                else if (this._hoverBox.activeSelf) {
                    const parentRenderer = this._hoverBox.parent ? this._hoverBox.parent.renderer : null;//TODO
                    if (parentRenderer) {
                        this._hoverBox.transform.localPosition = parentRenderer.aabb.center;
                        // this._hoverBox.transform.localScale = parentRenderer.aabb.size;
                        const size = parentRenderer.aabb.size; // TODO
                        this._hoverBox.transform.setLocalScale(size.x || 0.001, size.y || 0.001, size.z || 0.001);
                    }
                    else {
                        this._hoverBox.activeSelf = false;
                    }
                }
            }

        }

        private _updateCameras() {
            for (const camera of this._camerasAndLights.cameras) {
                if (camera.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                let __editor = camera.transform.find("__pickTarget") as egret3d.Transform;
                if (__editor) {
                    const cameraPosition = egret3d.Camera.editor.transform.getPosition();
                    const eyeDistance = cameraPosition.getDistance(camera.transform.position);

                    __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    __editor.transform.rotation = egret3d.Camera.editor.transform.rotation;
                }
                else {
                    // __editor = EditorMeshHelper.createIcon("__pickTarget", camera.gameObject, EditorDefaultTexture.CAMERA_ICON).transform;
                }
                // const pick = iconObject;
                // const pick = __editor.transform.find("__pickTarget").gameObject;
                // if (this._pickableSelected.indexOf(pick) < 0) {
                //     this._pickableSelected.push(pick);
                // }
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

            const selectedCamera = this._modelComponent.selectedGameObject ? this._modelComponent.selectedGameObject.getComponent(egret3d.Camera) : null;
            if (selectedCamera) {
                this._cameraViewFrustum.transform.position = selectedCamera.gameObject.transform.position;
                this._cameraViewFrustum.transform.rotation = selectedCamera.gameObject.transform.rotation;
                this._cameraViewFrustum.activeSelf = true;

                const mesh = this._cameraViewFrustum.getComponent(egret3d.MeshFilter).mesh;
                const cameraProject = egret3d.Matrix4.create();
                const viewPortPixel: egret3d.IRectangle = { x: 0, y: 0, w: 0, h: 0 };
                selectedCamera.calcViewPortPixel(viewPortPixel); // update viewport
                selectedCamera.calcProjectMatrix(viewPortPixel.w / viewPortPixel.h, cameraProject);

                const positions = mesh.getVertices();
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
            else {
                this._cameraViewFrustum.activeSelf = false;
            }
        }

        private _updateLights() {
            for (const light of this._camerasAndLights.lights) {
                if (light.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                let __editor = light.transform.find("__pickTarget") as egret3d.Transform;
                if (__editor) {
                    const cameraPosition = egret3d.Camera.editor.transform.getPosition();
                    const eyeDistance = cameraPosition.getDistance(light.transform.position);
                    __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    __editor.transform.rotation = egret3d.Camera.editor.transform.rotation;
                }
                else {
                    // __editor = EditorMeshHelper.createIcon("__pickTarget", light.gameObject, EditorDefaultTexture.LIGHT_ICON).transform;
                }
                // const pick = iconObject;
                // const pick = __editor.transform.find("pick").gameObject;
                // if (this._pickableSelected.indexOf(pick) < 0) {
                //     this._pickableSelected.push(pick);
                // }
            }
        }

        public onEnable() {
            EventPool.addEventListener(ModelComponentEvent.GameObjectHovered, ModelComponent, this._onGameObjectHovered);
            EventPool.addEventListener(ModelComponentEvent.GameObjectSelectChanged, ModelComponent, this._onGameObjectSelectChanged);
            EventPool.addEventListener(ModelComponentEvent.GameObjectSelected, ModelComponent, this._onGameObjectSelected);
            EventPool.addEventListener(ModelComponentEvent.GameObjectUnselected, ModelComponent, this._onGameObjectUnselected);

            { //
                const canvas = egret3d.WebGLCapabilities.canvas!;
                window.addEventListener("contextmenu", this._contextmenuHandler);
                canvas.addEventListener("mousedown", this._onMouseDown);
                window.addEventListener("mouseup", this._onMouseUp);
                window.addEventListener("mousemove", this._onMouseMove);
                window.addEventListener("keyup", this._onKeyUp);
                window.addEventListener("keydown", this._onKeyDown);
            }

            this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(OrbitControls);

            this._transformController = EditorMeshHelper.createGameObject("Axises").addComponent(TransfromController);
            this._transformController.gameObject.activeSelf = false;

            this._skeletonDrawer = EditorMeshHelper.createGameObject("SkeletonDrawer").addComponent(SkeletonDrawer);
            this._skeletonDrawer.gameObject.activeSelf = false;

            this._gridController = EditorMeshHelper.createGameObject("Grid").addComponent(GridController);

            this._hoverBox = EditorMeshHelper.createBox("HoverBox", egret3d.Color.WHITE, 0.6, paper.Scene.activeScene);
            this._hoverBox.activeSelf = false;

            this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera");
            this._cameraViewFrustum.activeSelf = false;

            //
            const editorCamera = egret3d.Camera.editor;
            const mainCamera = egret3d.Camera.main;
            editorCamera.transform.position = mainCamera.transform.position;
            editorCamera.transform.rotation = mainCamera.transform.rotation;
        }

        public onDisable() {
            EventPool.removeEventListener(ModelComponentEvent.GameObjectHovered, ModelComponent, this._onGameObjectHovered);
            EventPool.removeEventListener(ModelComponentEvent.GameObjectSelectChanged, ModelComponent, this._onGameObjectSelectChanged);
            EventPool.removeEventListener(ModelComponentEvent.GameObjectSelected, ModelComponent, this._onGameObjectSelected);
            EventPool.removeEventListener(ModelComponentEvent.GameObjectUnselected, ModelComponent, this._onGameObjectUnselected);

            { //
                const canvas = egret3d.WebGLCapabilities.canvas!;
                window.removeEventListener("contextmenu", this._contextmenuHandler);
                canvas.removeEventListener("mousedown", this._onMouseDown);
                window.removeEventListener("mouseup", this._onMouseUp);
                window.removeEventListener("mousemove", this._onMouseMove);
                window.removeEventListener("keyup", this._onKeyUp);
                window.removeEventListener("keydown", this._onKeyDown);
            }

            egret3d.Camera.editor.gameObject.removeComponent(OrbitControls);
            this._orbitControls = null;

            if (this._transformController) {
                this._transformController.gameObject.destroy();
                this._transformController = null;
            }

            if (this._skeletonDrawer) {
                this._skeletonDrawer.gameObject.destroy();
                this._skeletonDrawer = null;
            }

            if (this._gridController) {
                this._gridController.gameObject.destroy();
                this._gridController = null;
            }

            if (this._hoverBox) {
                this._hoverBox.destroy();
                this._hoverBox = null;
            }

            if (this._grids) {
                this._grids.destroy();
                this._grids = null;
            }

            //
            for (const camera of this._camerasAndLights.cameras) {
                if (camera.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                const __editor = camera.transform.find("__editor") as egret3d.Transform;
                if (__editor) {
                    __editor.gameObject.destroy();
                }
            }

            if (this._cameraViewFrustum && !this._cameraViewFrustum.isDestroyed) {
                this._cameraViewFrustum.destroy();
                this._cameraViewFrustum = null;
            }

            // this._pickableSelected.length = 0;
        }

        public onUpdate() {
            for (const gameObject of this._modelComponent.selectedGameObjects) {
                if (gameObject.isDestroyed) {
                    this._modelComponent.select(null);
                }
            }

            // this._pickableSelected.length = 0;

            if (this._cameraViewFrustum) {
                if (this._cameraViewFrustum.isDestroyed) {
                    this._cameraViewFrustum = null;
                }
                else {
                    this._cameraViewFrustum.activeSelf = this._modelComponent.selectedGameObject ? true : false;
                }
            }

            const transformController = this._transformController;
            if (transformController && transformController.isActiveAndEnabled) {
                transformController.update(this._pointerPosition);
            }

            const skeletonDrawer = this._skeletonDrawer;
            if (skeletonDrawer && skeletonDrawer.isActiveAndEnabled) {
                skeletonDrawer.update();
            }

            const gridController = this._gridController;
            if (gridController && gridController.isActiveAndEnabled) {
                gridController.update();
            }

            this._updateBoxes();
            this._updateCameras();
            this._updateLights();
        }
    }
}