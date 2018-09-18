namespace paper.debug {
    const enum TransformMode {
        TRANSLATE,
        ROTATE,
        SCALE
    }

    const enum TransformAxis {
        X,
        Y,
        Z
    }

    const enum KeyCode {
        F = "f",
        Q = "q",
        W = "w",
        E = "e",
    }

    export class GUISceneSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: egret3d.Transform }
            ]
        ];

        private readonly _camerasAndLights: egret3d.CamerasAndLights = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
        private readonly _guiComponent: GUIComponent = paper.GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        private _orbitControls: OrbitControls | null = null;
        // private readonly _mousePrevPosition: egret3d.Vector3 = egret3d.Vector3.create();

        private _touchPlane: paper.GameObject | null = null;
        private _grids: paper.GameObject | null = null;
        private _axises: paper.GameObject | null = null;
        private _box: paper.GameObject | null = null;
        private _skeletonDrawer: paper.GameObject | null = null;

        private _transformMode: TransformMode = TransformMode.TRANSLATE;
        private _transformAxis: TransformAxis | null = null;

        private _pickableTool: { [key: string]: GameObject[] } = {};  //可操作的_axises
        private _pickableSelected: GameObject[] = [];   //可被选中的 camera
        //
        private _isDragging: boolean = false;
        private _startPoint: egret3d.Vector3 = egret3d.Vector3.create();
        private _endPoint: egret3d.Vector3 = egret3d.Vector3.create();
        //
        private _positionStart: egret3d.Vector3 = egret3d.Vector3.create();
        //
        private _startWorldPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private _startWorldQuaternion: egret3d.Quaternion = egret3d.Quaternion.create();
        private _startWorldScale: egret3d.Vector3 = egret3d.Vector3.create(1.0, 1.0, 1.0);
        //
        private _selectedWorldPostion: egret3d.Vector3 = egret3d.Vector3.create();
        private _cameraPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private _eye: egret3d.Vector3 = egret3d.Vector3.create();

        private _selectGameObject(select: paper.GameObject | null) {
            if (this._guiComponent.selectedGameObject === select || !select) {
                return;
            }

            if (this._axises && this._axises.activeSelf) { // Hide axis.
                this._axises.activeSelf = false;
            }

            if (this._box && this._box.activeSelf) { // Hide box.
                this._box.dontDestroy = true;
                this._box.activeSelf = false;
            }

            if (this._skeletonDrawer && this._skeletonDrawer.activeSelf) { // Hide skeleton drawer.
                this._skeletonDrawer.dontDestroy = true;
                this._skeletonDrawer.activeSelf = false;
            }

            // Update game object.
            this._guiComponent.select(select);
            // Update axis target.
            this._axises.activeSelf = true;

            { // Update box target.
                if (this._box.scene !== select.scene) {
                    this._box.dontDestroy = !this._box.dontDestroy;
                    this._box.dontDestroy = select.scene === paper.Scene.globalScene;
                }
                this._box.parent = select;

                if (select.renderer) {
                    this._box.activeSelf = true;
                }
                else {
                    this._box.activeSelf = false;
                }
            }

            { // Update skeleton drawer target.
                if (select.renderer && select.renderer.constructor === egret3d.SkinnedMeshRenderer) {
                    if (!this._skeletonDrawer) {
                        this._skeletonDrawer = paper.GameObject.create("SkeletonDrawer", paper.DefaultTags.EditorOnly);
                        this._skeletonDrawer.addComponent(SkeletonDrawer);
                    }
                    else {
                        if (this._skeletonDrawer.scene !== select.scene) {
                            this._skeletonDrawer.dontDestroy = !this._skeletonDrawer.dontDestroy;
                            this._skeletonDrawer.dontDestroy = select.scene === paper.Scene.globalScene;
                        }

                        this._skeletonDrawer.activeSelf = true;
                    }

                    this._skeletonDrawer.parent = select;
                }
            }
        }

        private _onMouseDown = (event: MouseEvent) => {
            // this._mousePrevPosition.set(event.clientX - event.movementX, event.clientY - event.movementY, this._mousePrevPosition.z);
            const mousePosition = egret3d.Vector3.create(event.clientX, event.clientY, 0);
            egret3d.InputManager.mouse.convertPosition(mousePosition, mousePosition);
            event.preventDefault();

            const rootGameObjects = paper.Application.sceneManager.activeScene.getRootGameObjects();
            let picks = rootGameObjects.concat(this._pickableSelected);
            if (this._axises.activeSelf) {
                picks = picks.concat(this._pickableTool[this._transformMode]);
            }
            let raycastInfos = Helper.getPickObjects(picks, mousePosition.x, mousePosition.y);

            let intersectObject = raycastInfos[0];

            let selected = intersectObject ? intersectObject.transform.gameObject : null;
            if (selected && selected.transform.gameObject.renderer instanceof egret3d.SkinnedMeshRenderer) {
                selected = selected.transform.parent.gameObject;
            }

            if (selected) {
                if (this._pickableTool[this._transformMode].indexOf(selected) < 0) {
                    this._selectGameObject(selected);
                }
                else {
                    raycastInfos = Helper.getPickObjects([this._touchPlane], mousePosition.x, mousePosition.y);

                    const selectedGameObject = this._guiComponent.selectedGameObject;
                    selectedGameObject.transform.getWorldMatrix().decompose(this._startWorldPosition, this._startWorldQuaternion, this._startWorldScale);
                    const raycastInfosPos = raycastInfos[0].position;
                    this._startPoint.copy(raycastInfosPos).subtract(this._startWorldPosition, this._startPoint);

                    this._positionStart.copy(selectedGameObject.transform.getPosition());
                }
            }
            this._isDragging = true;
            mousePosition.release();
        };

        private _onMouseUp = (event: MouseEvent) => {
            this._orbitControls.enableMove = true;
            this._isDragging = false;
            event.preventDefault();
        }

        private _onMouseHover = (event: MouseEvent) => {
            if (event.buttons !== 0 && this._isDragging) {
                return;
            }
            const mousePostion = egret3d.Vector3.create(event.clientX, event.clientY);
            egret3d.InputManager.mouse.convertPosition(mousePostion, mousePostion);
            const picks = Helper.getPickObjects(this._pickableTool[this._transformMode], mousePostion.x, mousePostion.y);
            if (picks.length > 0) {
                const selected = picks[0].transform;
                switch (selected.gameObject.name) {
                    case "pickX":
                        this._transformAxis = TransformAxis.X;
                        break;
                    case "pickY":
                        this._transformAxis = TransformAxis.Y;
                        break;
                    case "pickZ":
                        this._transformAxis = TransformAxis.Z;
                        break;
                }
            }
            else {
                this._transformAxis = null;
            }
        };

        private _onMouseMove = (event: MouseEvent) => {
            event.preventDefault();
            const selected = this._guiComponent.selectedGameObject;
            if (event.buttons !== 0 && this._isDragging && this._transformAxis !== null && selected && selected instanceof paper.GameObject) {
                const mousePostion = egret3d.Vector3.create(event.clientX, event.clientY);
                egret3d.InputManager.mouse.convertPosition(mousePostion, mousePostion);
                const raycastInfos = Helper.getPickObjects([this._touchPlane], mousePostion.x, mousePostion.y);
                if (raycastInfos.length == 0) {
                    return;
                }
                this._orbitControls.enableMove = false;
                const intersectObject = raycastInfos[0];
                const intersectObjectPos = intersectObject.position;
                this._endPoint.copy(intersectObjectPos).subtract(this._startWorldPosition, this._endPoint);
                if (this._transformMode === TransformMode.TRANSLATE) {

                    switch (this._transformAxis) {
                        case TransformAxis.X:
                            this._endPoint.y = this._startPoint.y;
                            this._endPoint.z = this._startPoint.z;
                            break;
                        case TransformAxis.Y:
                            this._endPoint.x = this._startPoint.x;
                            this._endPoint.z = this._startPoint.z;
                            break;
                        case TransformAxis.Z:
                            this._endPoint.x = this._startPoint.x;
                            this._endPoint.y = this._startPoint.y;
                            break;
                    }
                    this._endPoint.subtract(this._startPoint, this._endPoint).add(this._positionStart);
                    selected.transform.setPosition(this._endPoint);
                }
                else if (this._transformMode === TransformMode.ROTATE) {
                    const camera = egret3d.Camera.editor;
                    const tempVector = egret3d.Vector3.create();
                    const tempVector2 = egret3d.Vector3.create();
                    const alignVector = egret3d.Vector3.create();
                    const rotationAxis = egret3d.Vector3.create();
                    const tempQuaternion = egret3d.Quaternion.create();
                    const ROTATION_SPEED = 20 / this._selectedWorldPostion.getDistance(tempVector.applyMatrix(camera.gameObject.transform.getWorldMatrix()));

                    const unit = egret3d.Vector3.create();
                    switch (this._transformAxis) {
                        case TransformAxis.X:
                            unit.set(1, 0, 0);
                            break;
                        case TransformAxis.Y:
                            unit.set(0, 1, 0);
                            break;
                        case TransformAxis.Z:
                            unit.set(0, 0, 1);
                            break;
                    }

                    alignVector.copy(unit).applyQuaternion(egret3d.Quaternion.IDENTITY);
                    rotationAxis.copy(unit);

                    this._endPoint.subtract(this._startPoint, this._endPoint);
                    let rotationAngle = this._endPoint.dot(unit.cross(this._eye).normalize()) * ROTATION_SPEED;

                    tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(this._startWorldQuaternion);
                    selected.transform.setRotation(tempQuaternion);

                    tempVector.release();
                    tempVector2.release();
                    alignVector.release();
                    rotationAxis.release();
                    tempQuaternion.release();
                    unit.release();
                }
                else if (this._transformMode === TransformMode.SCALE) {
                    const scaleMultiply = this._endPoint.clone().divide(this._startPoint);
                    switch (this._transformAxis) {
                        case TransformAxis.X:
                            scaleMultiply.y = 1;
                            scaleMultiply.z = 1;
                            break;
                        case TransformAxis.Y:
                            scaleMultiply.x = 1;
                            scaleMultiply.z = 1;
                            break;
                        case TransformAxis.Z:
                            scaleMultiply.x = 1;
                            scaleMultiply.y = 1;
                            break;
                    }
                    this._endPoint.copy(this._startWorldScale).multiply(scaleMultiply);
                    selected.transform.setScale(this._endPoint);
                }


                mousePostion.release();
            }
        };

        private _onKeyUp = (event: KeyboardEvent) => {

        }

        private _onKeyDown = (event: KeyboardEvent) => {
            const selectedSceneOrGameObject = this._guiComponent.selectedGameObject;
            switch (event.key) {
                case KeyCode.F:
                    if (selectedSceneOrGameObject) {
                        this._orbitControls.lookAtPoint.copy(selectedSceneOrGameObject.transform.getPosition());
                        this._orbitControls.distance = 10;
                        this._orbitControls.lookAtOffset.set(0, 0, 0);;
                    }
                    break;
                case KeyCode.Q:
                    {
                        this._transformModeHandler(TransformMode.TRANSLATE);
                    }
                    break;
                case KeyCode.W:
                    {
                        this._transformModeHandler(TransformMode.ROTATE);
                    }
                    break;
                case KeyCode.E:
                    {
                        this._transformModeHandler(TransformMode.SCALE);
                    }
                    break;
            }
        }

        private _gameObjectSelectedHandler = (_c: any, value: GameObject) => {
            this._selectGameObject(value);
        }

        private _gameObjectUnselectedHandler = (_c: any, value: GameObject) => {
            this._selectGameObject(null);//TODO
        }

        private _transformModeHandler(value: TransformMode) {
            this._transformMode = value;
            this._axises.transform.find("translate").gameObject.activeSelf = value === TransformMode.TRANSLATE;
            this._axises.transform.find("rotate").gameObject.activeSelf = value === TransformMode.ROTATE;
            this._axises.transform.find("scale").gameObject.activeSelf = value === TransformMode.SCALE;
        }

        private _setPoint(cameraProject: egret3d.Matrix, positions: Float32Array, x: number, y: number, z: number, points: number[]) {
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
        }

        private _updateAxises() {
            if (this._axises && this._axises.activeSelf) {
                const target = this._guiComponent.selectedGameObject
                // Update position and rotation.
                this._axises.transform.position = target.transform.position;
                this._axises.transform.rotation = target.transform.rotation;

                var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);

                const scale = egret3d.Vector3.ONE.clone();
                scale.multiplyScalar(eyeDistance / 10);
                this._axises.transform.find("translate").transform.setScale(scale);
                this._axises.transform.find("rotate").transform.setScale(scale);
                this._axises.transform.find("scale").transform.setScale(scale);
                scale.release();
                if (this._transformMode === TransformMode.TRANSLATE) {
                    const AXIS_HIDE_TRESHOLD = 0.99;
                    const PLANE_HIDE_TRESHOLD = 0.2;
                    const AXIS_FLIP_TRESHOLD = -0.4;


                }
                else if (this._transformMode === TransformMode.ROTATE) {

                }
                else if (this._transformMode === TransformMode.SCALE) {

                }
            }
        }

        private _updateBox() {
            if (this._box && this._box.activeSelf) {
                const target = this._guiComponent.selectedGameObject;
                // Update size and center.
                if (target.renderer) {
                    this._box.transform.setLocalPosition(target.renderer.aabb.center);
                    this._box.transform.setLocalScale(target.renderer.aabb.size);
                }
                else {
                    this._box.activeSelf = false;
                }
            }
        }

        private _updateCamera() {
            for (const camera of this._camerasAndLights.cameras) {
                if (camera.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                const __editor = camera.transform.find("__editor") as egret3d.Transform;
                if (__editor) {

                    const mesh = __editor.gameObject.getComponent(egret3d.MeshFilter).mesh;
                    const cameraProject = egret3d.Matrix4.create();
                    const viewPortPixel: egret3d.IRectangle = { x: 0, y: 0, w: 0, h: 0 };
                    camera.calcViewPortPixel(viewPortPixel); // update viewport
                    camera.calcProjectMatrix(viewPortPixel.w / viewPortPixel.h, cameraProject);

                    const positions = mesh.getVertices();
                    // center / target
                    this._setPoint(cameraProject, positions, 0, 0, -1, [38, 41]);
                    this._setPoint(cameraProject, positions, 0, 0, 1, [39]);
                    // near,
                    this._setPoint(cameraProject, positions, -1, -1, -1, [0, 7, 16, 25]);
                    this._setPoint(cameraProject, positions, 1, -1, -1, [1, 2, 18, 27]);
                    this._setPoint(cameraProject, positions, -1, 1, -1, [5, 6, 20, 29]);
                    this._setPoint(cameraProject, positions, 1, 1, - 1, [3, 4, 22, 31]);
                    // far,
                    this._setPoint(cameraProject, positions, -1, -1, 1, [8, 15, 17]);
                    this._setPoint(cameraProject, positions, 1, -1, 1, [9, 10, 19]);
                    this._setPoint(cameraProject, positions, -1, 1, 1, [13, 14, 21]);
                    this._setPoint(cameraProject, positions, 1, 1, 1, [11, 12, 23]);
                    // up,
                    this._setPoint(cameraProject, positions, 0.7, 1.1, -1, [32, 37]);
                    this._setPoint(cameraProject, positions, -0.7, 1.1, -1, [33, 34]);
                    this._setPoint(cameraProject, positions, 0, 2, -1, [35, 36]);
                    // cross,
                    this._setPoint(cameraProject, positions, -1, 0, 1, [42]);
                    this._setPoint(cameraProject, positions, 1, 0, 1, [43]);
                    this._setPoint(cameraProject, positions, 0, -1, 1, [44]);
                    this._setPoint(cameraProject, positions, 0, 1, 1, [45]);

                    this._setPoint(cameraProject, positions, -1, 0, -1, [46]);
                    this._setPoint(cameraProject, positions, 1, 0, -1, [47]);
                    this._setPoint(cameraProject, positions, 0, -1, -1, [48]);
                    this._setPoint(cameraProject, positions, 0, 1, -1, [49]);

                    mesh.uploadVertexBuffer(gltf.MeshAttributeType.POSITION);

                    cameraProject.release();
                }
                else {
                    const iconObject = EditorMeshHelper.createCameraWireframed("__editor", camera.gameObject.tag, camera.gameObject.scene);
                    iconObject.parent = camera.gameObject;

                    const pick = iconObject.transform.find("pick").gameObject;
                    if (this._pickableSelected.indexOf(pick) < 0) {
                        this._pickableSelected.push(pick);
                    }
                }
            }
        }

        private _updateTouchPlane() {
            if (!this._guiComponent.selectedGameObject) {
                return;
            }
            if (!this._touchPlane || this._touchPlane.isDestroyed) {
                return;
            }

            const editorCamera = egret3d.Camera.editor;

            const worldPosition = this._guiComponent.selectedGameObject.transform.getPosition();
            const position = worldPosition.clone();
            const quaternion = egret3d.Quaternion.create();

            const unitX = egret3d.Vector3.create(1, 0, 0);
            const unitY = egret3d.Vector3.create(0, 1, 0);
            const unitZ = egret3d.Vector3.create(0, 0, 1);

            unitX.set(1, 0, 0).applyQuaternion(egret3d.Quaternion.IDENTITY);
            unitY.set(0, 1, 0).applyQuaternion(egret3d.Quaternion.IDENTITY);
            unitZ.set(0, 0, 1).applyQuaternion(egret3d.Quaternion.IDENTITY);

            // Align the plane for current transform mode, axis and space.
            const alignVector = unitY.clone();
            const dirVector = egret3d.Vector3.create();

            const eye = editorCamera.transform.getPosition().clone();
            if (editorCamera.opvalue > 0) {
                eye.subtract(worldPosition, eye);
            }
            eye.normalize();
            switch (this._transformMode) {
                case TransformMode.TRANSLATE:
                case TransformMode.SCALE:
                    switch (this._transformAxis) {
                        case TransformAxis.X:
                            alignVector.copy(eye).cross(unitX);
                            dirVector.copy(unitX).cross(alignVector);
                            break;
                        case TransformAxis.Y:
                            alignVector.copy(eye).cross(unitY);
                            dirVector.copy(unitY).cross(alignVector);
                            break;
                        case TransformAxis.Z:
                            alignVector.copy(eye).cross(unitZ);
                            dirVector.copy(unitZ).cross(alignVector);
                            break;
                    }
                    break;
                case TransformMode.ROTATE:
                default:
                    // special case for rotate
                    dirVector.set(0, 0, 0);
            }

            if (dirVector.length === 0) {
                // If in rotate mode, make the plane parallel to camera
                const cameraQuaternion = editorCamera.transform.getRotation();
                quaternion.copy(cameraQuaternion);
            } else {
                const tempMatrix = egret3d.Matrix4.create();
                const tempVector = egret3d.Vector3.create();
                tempMatrix.lookAt(tempVector.set(0, 0, 0), dirVector, alignVector);

                quaternion.fromMatrix(tempMatrix);
                tempVector.release();
                tempMatrix.release();
            }

            this._touchPlane.transform.setPosition(position);
            this._touchPlane.transform.setRotation(quaternion);

            position.release();
            unitX.release();
            unitY.release();
            unitZ.release();
            alignVector.release();
            dirVector.release();
            quaternion.release();
            eye.release();
        }

        public onAwake() {
        }

        public onEnable() {
            paper.Application.playerMode = paper.PlayerMode.DebugPlayer;
            this._orbitControls = egret3d.Camera.editor.gameObject.getOrAddComponent(OrbitControls);
            //
            if (!this._grids) {
                this._grids = EditorMeshHelper.createGrid("Grid");
            }
            if (!this._touchPlane) {
                this._touchPlane = EditorMeshHelper.createTouchPlane("TouchPlane");
                this._touchPlane.activeSelf = false;
            }
            if (!this._axises) {
                this._axises = EditorMeshHelper.createAxises("Axis");
                this._axises.activeSelf = false;
            }
            if (!this._box) {
                this._box = EditorMeshHelper.createBox("Box", egret3d.Color.create(0.0, 1.0, 1.0).release());
                this._box.activeSelf = false;
            }
            this._isDragging = false;
            this._transformAxis = null;
            //
            this._pickableTool[TransformMode.TRANSLATE] = [];
            this._pickableTool[TransformMode.TRANSLATE].push(this._axises.transform.find("translate").find("pickX").gameObject);
            this._pickableTool[TransformMode.TRANSLATE].push(this._axises.transform.find("translate").find("pickY").gameObject);
            this._pickableTool[TransformMode.TRANSLATE].push(this._axises.transform.find("translate").find("pickZ").gameObject);
            //
            this._pickableTool[TransformMode.ROTATE] = [];
            this._pickableTool[TransformMode.ROTATE].push(this._axises.transform.find("rotate").find("pickX").gameObject);
            this._pickableTool[TransformMode.ROTATE].push(this._axises.transform.find("rotate").find("pickY").gameObject);
            this._pickableTool[TransformMode.ROTATE].push(this._axises.transform.find("rotate").find("pickZ").gameObject);
            //
            this._pickableTool[TransformMode.SCALE] = [];
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickX").gameObject);
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickY").gameObject);
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickZ").gameObject);

            this._pickableSelected.length = 0;

            EventPool.addEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._gameObjectSelectedHandler);
            EventPool.addEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._gameObjectUnselectedHandler);

            egret3d.WebGLCapabilities.canvas!.addEventListener('contextmenu', function contextmenu(event: Event) { event.preventDefault(); });
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousedown", this._onMouseDown);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mouseup", this._onMouseUp);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousemove", this._onMouseHover);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousemove", this._onMouseMove);
            window.addEventListener("keyup", this._onKeyUp);
            window.addEventListener("keydown", this._onKeyDown);

            //
            this._transformModeHandler(this._transformMode);
        }

        public onDisable() {
            this._selectGameObject(null);
            egret3d.Camera.editor.gameObject.removeComponent(OrbitControls);
            this._orbitControls = null;
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
            EventPool.removeEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._gameObjectSelectedHandler);
            EventPool.removeEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._gameObjectUnselectedHandler);
            //
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousedown", this._onMouseDown);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mouseup", this._onMouseUp);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousemove", this._onMouseHover);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousemove", this._onMouseMove);
            window.removeEventListener("keyup", this._onKeyUp);
            window.removeEventListener("keydown", this._onKeyDown);

            if (this._touchPlane && !this._touchPlane.isDestroyed) {
                this._touchPlane.destroy();
                this._touchPlane = null;
            }

            if (this._grids && !this._grids.isDestroyed) {
                this._grids.destroy();
                this._grids = null;
            }

            if (this._axises && !this._axises.isDestroyed) {
                this._axises.destroy();
                this._axises = null;
            }

            if (this._box && !this._box.isDestroyed) {
                this._box.destroy();
                this._box = null;
            }

            if (this._skeletonDrawer && !this._skeletonDrawer.isDestroyed) {
                this._skeletonDrawer.destroy();
                this._grids = null;
            }

            this._pickableSelected.length = 0;

            paper.Application.playerMode = paper.PlayerMode.Player;
        }

        public onUpdate(dt: number) {
            if (this._touchPlane && this._touchPlane.isDestroyed) {
                this._touchPlane = null;
            }
            if (this._grids && this._grids.isDestroyed) {
                this._grids = null;
            }
            if (this._axises && this._axises.isDestroyed) {
                this._axises = null;
            }
            if (this._box && this._box.isDestroyed) {
                this._box = null;
            }
            if (this._skeletonDrawer && this._skeletonDrawer.isDestroyed) {
                this._skeletonDrawer = null;
            }

            if (this._guiComponent.selectedGameObject && this._guiComponent.selectedGameObject.isDestroyed) {
                this._guiComponent.select(null); // TODO
            }

            if (this._guiComponent.selectedGameObject) {
                const camera = egret3d.Camera.editor;
                this._selectedWorldPostion.copy(this._guiComponent.selectedGameObject.transform.getPosition());
                this._cameraPosition.copy(camera.transform.getPosition());
                if (camera.opvalue > 0) {
                    this._eye.copy(this._cameraPosition).subtract(this._selectedWorldPostion).normalize();
                }
                else if (camera.opvalue == 0) {
                    this._eye.copy(this._cameraPosition).normalize();
                }
            }

            this._updateAxises();
            this._updateBox();
            this._updateCamera();
            this._updateTouchPlane();
        }
    }

    class SkeletonDrawer extends paper.Behaviour {
        private static readonly _skeletonMesh: egret3d.Mesh = egret3d.Mesh.create(128, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0], null, gltf.DrawMode.Dynamic);

        public onAwake() {
            const mesh = SkeletonDrawer._skeletonMesh;
            const material = egret3d.DefaultMaterials.LINEDASHED_COLOR.clone();
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            material
                .setColor("diffuse", egret3d.Color.create(0.0, 1.0, 1.0).release())
                .setDepth(false, false)
                .renderQueue = paper.RenderQueue.Overlay;

            this.gameObject.getOrAddComponent(egret3d.MeshFilter).mesh = mesh;
            this.gameObject.getOrAddComponent(egret3d.MeshRenderer).material = material;
        }

        // const skinnedMeshRenderer = this.gameObject.getComponentInParent(egret3d.SkinnedMeshRenderer);
        // const bones = skinnedMeshRenderer.bones;
        // for (const bone of bones) {
        //     const box = egret3d.Primitive.create(egret3d.Primitive.Type.Cube).transform.setLocalScale(0.1, 0.1, 0.1);
        //     box.gameObject.hideFlags = paper.HideFlags.HideAndDontSave;
        //     box.transform.parent = bone;
        // }

        public onLateUpdate() {
            const skinnedMeshRenderer = this.gameObject.getComponentInParent(egret3d.SkinnedMeshRenderer);
            const mesh = SkeletonDrawer._skeletonMesh;

            if (!skinnedMeshRenderer) {
                return;
            }

            let offset = 0;
            const helpVertex3A = egret3d.Vector3.create();
            const helpVertex3B = egret3d.Vector3.create();
            const helpMatrixA = egret3d.Matrix4.create();
            const vertices = mesh.getVertices();
            const bones = skinnedMeshRenderer.bones;

            helpMatrixA.inverse(this.gameObject.transform.worldMatrix);

            for (const bone of bones) {
                if (bone) {
                    if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                        helpVertex3A.applyMatrix(helpMatrixA, bone.parent.position).toArray(vertices, offset);
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).toArray(vertices, offset + 3);
                    }
                    else {
                        bone.getRight(helpVertex3B).applyDirection(helpMatrixA).multiplyScalar(0.25); // Bone length.
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).toArray(vertices, offset);
                        helpVertex3A.applyMatrix(helpMatrixA, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
                    }
                }
                else {
                    (egret3d.Vector3.ZERO as egret3d.Vector3).toArray(vertices, offset);
                    (egret3d.Vector3.ZERO as egret3d.Vector3).toArray(vertices, offset + 3);
                }

                offset += 6;
            }

            mesh.uploadVertexBuffer();
            helpVertex3A.release();
            helpVertex3B.release();
            helpMatrixA.release();
        }
    }
}