namespace paper.debug {
    const enum TransformMode {
        TRANSLATE,
        ROTATE,
        SCALE
    }

    const enum TransformAxis {
        X,
        Y,
        Z,
        E,
    }

    const enum KeyCode {
        F = "f",
        Q = "q",
        W = "w",
        E = "e",
        R = "r",
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

        private _touchPlane: paper.GameObject | null = null;
        private _grids: paper.GameObject | null = null;
        private _axises: paper.GameObject | null = null;
        private _box: paper.GameObject | null = null;
        private _cameraViewFrustum: paper.GameObject | null = null;
        private _skeletonDrawer: paper.GameObject | null = null;

        private _transformMode: TransformMode = TransformMode.TRANSLATE;
        private _transformAxis: TransformAxis | null = null;

        private _gizomsMap: { [key: string]: GameObject[] } = {};   //
        private _pickableTool: { [key: string]: GameObject[] } = {};  //可拾取的_axises
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
        private _selectedWorldQuaternion: egret3d.Quaternion = egret3d.Quaternion.create();
        private _cameraPosition: egret3d.Vector3 = egret3d.Vector3.create();
        private _eye: egret3d.Vector3 = egret3d.Vector3.create();

        private _selectGameObject(select: paper.GameObject | null) {
            if (!select) {
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

            // Update axis target.
            this._axises.activeSelf = true;

            { // Update box target.
                if (this._box.scene !== select.scene) {
                    this._box.dontDestroy = !this._box.dontDestroy;
                    this._box.dontDestroy = select.scene === paper.Scene.globalScene;
                }
                // this._box.parent = select;

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
                        this._skeletonDrawer.addComponent(GizmoPickComponent).pickTarget = select.parent;
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
            if (selected && selected.getComponent(GizmoPickComponent)) {
                const pickTarget = selected.getComponent(GizmoPickComponent).pickTarget;
                if (pickTarget) {
                    selected = pickTarget;
                }
            }

            if (selected) {
                if (this._pickableTool[this._transformMode].indexOf(selected) < 0) {
                    this._guiComponent.select(selected, true); // TODO
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
                    case "pickE":
                        this._transformAxis = TransformAxis.E;
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
                    const rotationAxis = egret3d.Vector3.create();
                    const tempQuaternion = egret3d.Quaternion.create();
                    const unit = egret3d.Vector3.create();
                    const ROTATION_SPEED = 20 / this._selectedWorldPostion.getDistance(tempVector.applyMatrix(camera.gameObject.transform.getWorldMatrix()));
                    let rotationAngle = 0;
                    if (this._transformAxis === TransformAxis.E) {
                        tempVector.copy(this._endPoint).cross(this._startPoint);
                        rotationAxis.copy(this._eye);
                        rotationAngle = this._endPoint.getAngle(this._startPoint) * (tempVector.dot(this._eye) < 0 ? 1 : -1);
                    }
                    else {
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

                        rotationAxis.copy(unit);

                        this._endPoint.subtract(this._startPoint, this._endPoint);
                        rotationAngle = this._endPoint.dot(unit.cross(this._eye).normalize()) * ROTATION_SPEED;
                    }

                    tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(this._startWorldQuaternion);
                    selected.transform.setRotation(tempQuaternion);

                    tempVector.release();
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
                case KeyCode.W:
                    {
                        this._transformModeHandler(TransformMode.TRANSLATE);
                    }
                    break;
                case KeyCode.E:
                    {
                        this._transformModeHandler(TransformMode.ROTATE);
                    }
                    break;
                case KeyCode.R:
                    {
                        this._transformModeHandler(TransformMode.SCALE);
                    }
                    break;
            }
        }

        private _onGameObjectSelected = (_c: any, value: GameObject) => {
            this._selectGameObject(value);
        }

        private _onGameObjectUnselected = (_c: any, value: GameObject) => {
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
                this._axises.transform.position = this._selectedWorldPostion;

                var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);

                const translateObj = this._axises.transform.find("translate");
                const rotateObj = this._axises.transform.find("rotate");
                const scaleObj = this._axises.transform.find("scale");
                //
                this._axises.transform.setScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10).release());
                if (this._transformMode === TransformMode.TRANSLATE || this._transformMode === TransformMode.SCALE) {
                    // translateObj.rotation = this._selectedWorldQuaternion;
                    // scaleObj.rotation = this._selectedWorldQuaternion;
                }
                else if (this._transformMode === TransformMode.ROTATE) {
                    const quaternion = egret3d.Quaternion.IDENTITY;//TODO local

                    const tempQuaternion = quaternion.clone();
                    const tempQuaternion2 = egret3d.Quaternion.create();
                    const alignVector = this._eye.clone();
                    alignVector.applyQuaternion(tempQuaternion.inverse());
                    {
                        const axisE = rotateObj.find("axisE");
                        const pickE = rotateObj.find("pickE");
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        axisE.setRotation(tempQuaternion2);
                        pickE.setRotation(tempQuaternion2);
                    }
                    {
                        const axisX = rotateObj.find("axisX");
                        tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.RIGHT, Math.atan2(-alignVector.y, alignVector.z));
                        tempQuaternion2.multiply(quaternion);
                        axisX.setRotation(tempQuaternion2);
                    }

                    {
                        const axisY = rotateObj.find("axisY");
                        tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.UP, Math.atan2(alignVector.x, alignVector.z));
                        tempQuaternion2.multiply(quaternion);
                        axisY.setRotation(tempQuaternion2);
                    }

                    {
                        const axisZ = rotateObj.find("axisZ");
                        tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.FORWARD, Math.atan2(alignVector.y, alignVector.x));
                        tempQuaternion2.multiply(quaternion);
                        axisZ.setRotation(tempQuaternion2);
                    }
                    tempQuaternion.release();
                    tempQuaternion2.release();
                    alignVector.release();
                }
            }

            //TODO
            if (this._guiComponent.selectedGameObject) {
                this._guiComponent.selectedGameObject.transform.getLocalEulerAngles();
            }
        }

        private _updateBox() {
            if (!this._guiComponent.selectedGameObject) {
                return;
            }
            if (this._box && this._box.activeSelf) {
                const target = this._guiComponent.selectedGameObject;
                // Update size and center.
                if (target.renderer) {
                    this._box.transform.position = target.transform.position;
                    this._box.transform.rotation = target.transform.rotation;
                    this._box.transform.scale = target.transform.scale;
                    // this._box.transform.setLocalPosition(target.renderer.aabb.center);
                    // this._box.transform.setLocalScale(target.renderer.aabb.size);
                }
                else {
                    this._box.activeSelf = false;
                }
            }
        }

        private _updateCameras() {
            for (const camera of this._camerasAndLights.cameras) {
                if (camera.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                let __editor = camera.transform.find("__editor") as egret3d.Transform;
                if (__editor) {
                    var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);
                    const tempQuaternion2 = egret3d.Quaternion.create();
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    __editor.transform.setRotation(tempQuaternion2);
                }
                else {
                    __editor = EditorMeshHelper.createCameraIcon("__editor", camera.gameObject).transform;
                    __editor.parent = camera.gameObject.transform;
                }
                // const pick = iconObject;
                const pick = __editor.transform.find("pick").gameObject;
                if (this._pickableSelected.indexOf(pick) < 0) {
                    this._pickableSelected.push(pick);
                }
            }

            const selectedCamera = this._guiComponent.selectedGameObject ? this._guiComponent.selectedGameObject.getComponent(egret3d.Camera) : null;
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
                this._cameraViewFrustum.activeSelf = false;
            }
        }

        private _updateLights() {
            for (const light of this._camerasAndLights.lights) {
                if (light.gameObject.tag === paper.DefaultTags.EditorOnly) {
                    continue;
                }

                let __editor = light.transform.find("__editor") as egret3d.Transform;
                if (__editor) {
                    var eyeDistance = this._selectedWorldPostion.getDistance(this._cameraPosition);
                    const tempQuaternion2 = egret3d.Quaternion.create();
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    __editor.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    __editor.transform.setRotation(tempQuaternion2);
                }
                else {
                    __editor = EditorMeshHelper.createLightIcon("__editor", light.gameObject).transform;
                    __editor.parent = light.gameObject.transform;

                }
                // const pick = iconObject;
                const pick = __editor.transform.find("pick").gameObject;
                if (this._pickableSelected.indexOf(pick) < 0) {
                    this._pickableSelected.push(pick);
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
            //
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
            if (!this._cameraViewFrustum) {
                this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera");
                this._cameraViewFrustum.activeSelf = false;
            }
            this._isDragging = false;
            this._transformAxis = null;
            //
            this._gizomsMap[TransformAxis.X] = [];
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
            this._pickableTool[TransformMode.ROTATE].push(this._axises.transform.find("rotate").find("pickE").gameObject);
            //
            this._pickableTool[TransformMode.SCALE] = [];
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickX").gameObject);
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickY").gameObject);
            this._pickableTool[TransformMode.SCALE].push(this._axises.transform.find("scale").find("pickZ").gameObject);

            this._pickableSelected.length = 0;

            EventPool.addEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._onGameObjectSelected);
            EventPool.addEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._onGameObjectUnselected);

            egret3d.WebGLCapabilities.canvas!.addEventListener('contextmenu', function contextmenu(event: Event) { event.preventDefault(); });
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousedown", this._onMouseDown);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mouseup", this._onMouseUp);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousemove", this._onMouseHover);
            egret3d.WebGLCapabilities.canvas!.addEventListener("mousemove", this._onMouseMove);
            // window.addEventListener("keyup", this._onKeyUp);
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
            EventPool.removeEventListener(GUIComponentEvent.GameObjectSelected, GUIComponent, this._onGameObjectSelected);
            EventPool.removeEventListener(GUIComponentEvent.GameObjectUnselected, GUIComponent, this._onGameObjectUnselected);
            //
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousedown", this._onMouseDown);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mouseup", this._onMouseUp);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousemove", this._onMouseHover);
            egret3d.WebGLCapabilities.canvas!.removeEventListener("mousemove", this._onMouseMove);
            // window.removeEventListener("keyup", this._onKeyUp);
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
            if (this._cameraViewFrustum && !this._cameraViewFrustum.isDestroyed) {
                this._cameraViewFrustum.destroy();
                this._cameraViewFrustum = null;
            }

            this._pickableSelected.length = 0;

            paper.Application.playerMode = paper.PlayerMode.Player;
        }

        public onUpdate(dt: number) {
            const selectedGameObject = this._guiComponent.selectedGameObject;
            if (selectedGameObject) {
                if (selectedGameObject.isDestroyed) {
                    this._guiComponent.select(null);// TODO
                }
                else {
                    this._selectedWorldPostion.copy(selectedGameObject.transform.getPosition());
                    this._selectedWorldQuaternion.copy(selectedGameObject.transform.getRotation());
                }
            }
            this._pickableSelected.length = 0;
            //
            if (this._touchPlane && this._touchPlane.isDestroyed) {
                this._touchPlane = null;
            }
            if (this._grids && this._grids.isDestroyed) {
                this._grids = null;
            }
            if (this._axises) {
                if (this._axises.isDestroyed) {
                    this._axises = null;
                }
                else {
                    this._axises.activeSelf = selectedGameObject ? true : false;
                }
            }
            if (this._box) {
                if (this._box.isDestroyed) {
                    this._box = null;
                }
                else {
                    this._box.activeSelf = selectedGameObject ? true : false;
                }
            }
            if (this._cameraViewFrustum) {
                if (this._cameraViewFrustum.isDestroyed) {
                    this._cameraViewFrustum = null;
                }
                else {
                    this._cameraViewFrustum.activeSelf = selectedGameObject ? true : false;
                }
            }
            if (this._skeletonDrawer && this._skeletonDrawer.isDestroyed) {
                if (this._skeletonDrawer.isDestroyed) {
                    this._skeletonDrawer = null;
                }
                else {
                    this._skeletonDrawer.activeSelf = selectedGameObject ? true : false;
                }
            }

            const camera = egret3d.Camera.editor;
            this._cameraPosition.copy(camera.transform.getPosition());
            if (camera.opvalue == 0) {
                this._eye.copy(this._cameraPosition).normalize();
            }
            else {
                this._eye.copy(this._cameraPosition).subtract(this._selectedWorldPostion).normalize();
            }

            this._updateAxises();
            this._updateBox();
            this._updateCameras();
            this._updateLights();
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