namespace paper.editor {
    let helpVec3_1 = new egret3d.Vector3();
    let helpVec3_2 = new egret3d.Vector3();
    let helpVec3_3 = new egret3d.Vector3();
    let helpQuat_1 = new egret3d.Quaternion();
    let helpQuat_2 = new egret3d.Quaternion();
    let forward = new egret3d.Vector3(0, 0, 1);
    let up = new egret3d.Vector3(0, 1, 0);
    let right = new egret3d.Vector3(1, 0, 0);

    enum DRAG_MODE {
        NONE,
        BALL,
        X,
        Y,
        Z,
        RotX,
        RotY,
        RotZ,
        ScaX,
        ScaY,
        ScaZ
    }

    export class GeoController {

        public selectedGameObjs: GameObject[] = [];
        private _isEditing: boolean = false;

        private _geoCtrlMode: string = "local";
        private _modeCanChange: boolean = true;

        public get geoCtrlMode(): string {
            return this._geoCtrlMode;
        }

        public set geoCtrlMode(value: string) {
            this._geoCtrlMode = value;
        }

        private _geoCtrlType: string = "position";

        public get geoCtrlType(): string {
            return this._geoCtrlType;
        }

        public set geoCtrlType(value: string) {
            this._geoCtrlType = value;
        }
        private editorModel: EditorModel;
        constructor(editorModel: EditorModel) {
            this.editorModel = editorModel;
            this._addGizmoController();
            this._addEventListener();
            this.bindMouse = egret3d.InputManager.mouse;
            this.bindKeyboard = egret3d.InputManager.keyboard;
        }

        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;

        public update() {
            // console.log(this.pCtrl);
            let len = this.selectedGameObjs.length;
            if (this.selectedGameObjs.length > 0) {
                Gizmo.DrawArrowXYZ(this.controller.transform);
                if (this.bindKeyboard.wasPressed('DELETE')) {
                    this.editorModel.deleteGameObject(this.selectedGameObjs);
                    // EditorMessage.instance.DeleteGameObject(this._bindedGameObject);
                }
                if (this.selectedGameObjs.length == 1 && this.selectedGameObjs[0].getComponent(egret3d.Camera)) {
                    Gizmo.DrawCameraSquare(this.selectedGameObjs[0], [1.0, 0.0, 1.0, 1.0]);
                }
            }

            this.inputUpdate();

            if (this._isEditing) {
                (this.geoCtrlMode == "world" || this.selectedGameObjs.length > 1) ? this.updateInWorldMode() : this.updateInLocalMode();
            }

            if (this.bindMouse.wasReleased(0)) {
                this._dragMode = DRAG_MODE.NONE;
                //this.cameraScript.enabled = true;
                egret3d.Vector3.set(0, 0, 0, this._dragOffset);
                egret3d.Vector3.set(0, 0, 0, this._dragPlanePoint);
                egret3d.Vector3.set(0, 0, 0, this._dragPlaneNormal);

                this.xScl.transform.setLocalPosition(2, 0, 0);
                this.yScl.transform.setLocalPosition(0, 2, 0);
                this.zScl.transform.setLocalPosition(0, 0, 2);
            }
        }

        /**
         * 几何操作逻辑
         */
        private _dragMode: DRAG_MODE = DRAG_MODE.NONE;

        private _dragOffset: egret3d.Vector3 = new egret3d.Vector3();
        private _delta: egret3d.Vector3 = new egret3d.Vector3();
        private _newPosition: egret3d.Vector3 = new egret3d.Vector3();
        private _ctrlPos: egret3d.Vector3 = new egret3d.Vector3();
        private _ctrlRot: egret3d.Quaternion = new egret3d.Quaternion();

        private _dragPlanePoint: egret3d.Vector3 = new egret3d.Vector3();
        private _dragPlaneNormal: egret3d.Vector3 = new egret3d.Vector3();
        public cameraScript: paper.editor.EditorCameraScript;

        private _initRotation = new egret3d.Quaternion();
        private _oldLocalScale = new egret3d.Vector3();

        private updateInLocalMode() {
            let len = this.selectedGameObjs.length;
            if (len <= 0) return;
            let cameraObject = this.cameraScript.gameObject;
            let camera = cameraObject.getComponent(egret3d.Camera);
            let worldRotation = this.selectedGameObjs[0].transform.getRotation();
            let worldPosition = this.selectedGameObjs[0].transform.getPosition();
            if (this.bindMouse.wasPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                //worldPosition = this.selectedGameObj.transform.getPosition();
                //worldRotation = this.selectedGameObj.transform.getRotation();
                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                let pickInfoArray = egret3d.Ray.raycastAll(ray, true);
                if (pickInfoArray && pickInfoArray.length > 0) {
                    pickInfoArray.forEach(pickInfo => {
                        let picked = pickInfo.transform.gameObject;
                        if (this.geoCtrlType == "position" && (picked == this.ball || picked == this.xAxis || picked == this.yAxis || picked == this.zAxis)) {
                            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);

                            if (picked == this.ball) {
                                this._dragMode = DRAG_MODE.BALL;
                                cameraObject.transform.getForward(this._dragPlaneNormal);
                            } else if (picked == this.xAxis) {
                                this._dragMode = DRAG_MODE.X;
                                egret3d.Quaternion.transformVector3(worldRotation, up, this._dragPlaneNormal);
                            } else if (picked == this.yAxis) {
                                this._dragMode = DRAG_MODE.Y;
                                egret3d.Quaternion.transformVector3(worldRotation, forward, this._dragPlaneNormal);
                            } else if (picked == this.zAxis) {
                                this._dragMode = DRAG_MODE.Z;
                                egret3d.Quaternion.transformVector3(worldRotation, up, this._dragPlaneNormal);
                            }

                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
                        } else if (this.geoCtrlType == "rotation" && (picked == this.xRot || picked == this.yRot || picked == this.zRot)) {
                            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);

                            if (picked == this.xRot) {
                                this._dragMode = DRAG_MODE.RotX;
                                egret3d.Quaternion.transformVector3(worldRotation, right, this._dragPlaneNormal);
                            } else if (picked == this.yRot) {
                                this._dragMode = DRAG_MODE.RotY;
                                egret3d.Quaternion.transformVector3(worldRotation, up, this._dragPlaneNormal);
                            } else if (picked == this.zRot) {
                                this._dragMode = DRAG_MODE.RotY;
                                egret3d.Quaternion.transformVector3(worldRotation, forward, this._dragPlaneNormal);
                            }

                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
                            egret3d.Quaternion.copy(worldRotation, this._initRotation);
                        } else if (this.geoCtrlType == "scale" && (picked == this.xScl || picked == this.yScl || picked == this.zScl)) {
                            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
                            if (picked == this.xScl) {
                                this._dragMode = DRAG_MODE.ScaX;
                                egret3d.Quaternion.transformVector3(worldRotation, up, this._dragPlaneNormal);
                            } else if (picked == this.yScl) {
                                this._dragMode = DRAG_MODE.ScaY;
                                egret3d.Quaternion.transformVector3(worldRotation, forward, this._dragPlaneNormal);
                            } else if (picked == this.zScl) {
                                this._dragMode = DRAG_MODE.ScaZ;
                                egret3d.Quaternion.transformVector3(worldRotation, up, this._dragPlaneNormal);
                            }
                            egret3d.Vector3.copy(this.selectedGameObjs[0].transform.getLocalScale(), this._oldLocalScale);
                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
                        }
                    });
                }
            }
            if (this.bindMouse.isPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                if (this.geoCtrlType == "position" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, this._dragOffset, hit);

                    if (this._dragMode == DRAG_MODE.BALL) {
                        this.editorModel.setProperty("position", hit, this.selectedGameObjs[0].transform);
                        egret3d.Vector3.copy(hit, this._ctrlPos);
                        //this.selectedGameObj.transform.setPosition(hit);
                    } else {
                        egret3d.Vector3.subtract(hit, worldPosition, hit);
                        let worldOffset: egret3d.Vector3;
                        if (this._dragMode == DRAG_MODE.X) {
                            worldOffset = egret3d.Quaternion.transformVector3(worldRotation, right, helpVec3_1);
                        } else if (this._dragMode == DRAG_MODE.Y) {
                            worldOffset = egret3d.Quaternion.transformVector3(worldRotation, up, helpVec3_1);
                        } else if (this._dragMode == DRAG_MODE.Z) {
                            worldOffset = egret3d.Quaternion.transformVector3(worldRotation, forward, helpVec3_1);
                        }
                        let cosHit = egret3d.Vector3.dot(hit, worldOffset);
                        egret3d.Vector3.scale(worldOffset, cosHit);
                        let position = egret3d.Vector3.add(worldPosition, worldOffset, helpVec3_2);
                        egret3d.Vector3.copy(position, this._ctrlPos);
                        this.editorModel.setProperty("position", position, this.selectedGameObjs[0].transform);
                    }
                } else if (this.geoCtrlType == "rotation" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, worldPosition, hit);
                    let cosHitOffset = egret3d.Vector3.dot(egret3d.Vector3.normalize(hit), egret3d.Vector3.normalize(this._dragOffset));
                    egret3d.Vector3.cross(this._dragOffset, hit, helpVec3_1)
                    let theta = egret3d.Vector3.dot(helpVec3_1, this._dragPlaneNormal) >= 0 ? Math.acos(cosHitOffset) : -Math.acos(cosHitOffset);
                    let cos = Math.cos(theta * 0.5), sin = Math.sin(theta * 0.5);
                    egret3d.Quaternion.set(this._dragPlaneNormal.x * sin, this._dragPlaneNormal.y * sin, this._dragPlaneNormal.z * sin, cos, helpQuat_1);
                    egret3d.Quaternion.multiply(helpQuat_1, this._initRotation, helpQuat_2);
                    egret3d.Quaternion.copy(helpQuat_2, this._ctrlRot);
                    this.editorModel.setProperty("rotation", helpQuat_2, this.selectedGameObjs[0].transform);
                } else if (this.geoCtrlType == "scale" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, worldPosition, hit);
                    let worldOffset: egret3d.Vector3;
                    let scale: egret3d.Vector3;
                    if (this._dragMode == DRAG_MODE.ScaX) {
                        worldOffset = egret3d.Quaternion.transformVector3(worldRotation, right, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(hit, worldOffset);
                        let len = egret3d.Vector3.dot(this._dragOffset, worldOffset);
                        this.xScl.transform.setLocalPosition(cosHit / len * 2, 0, 0);
                    } else if (this._dragMode == DRAG_MODE.ScaY) {
                        worldOffset = egret3d.Quaternion.transformVector3(worldRotation, up, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(hit, worldOffset);
                        let len = egret3d.Vector3.dot(this._dragOffset, worldOffset);
                        this.yScl.transform.setLocalPosition(0, cosHit / len * 2, 0);
                    } else if (this._dragMode == DRAG_MODE.ScaZ) {
                        worldOffset = egret3d.Quaternion.transformVector3(worldRotation, forward, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(hit, worldOffset);
                        let len = egret3d.Vector3.dot(this._dragOffset, worldOffset);
                        this.zScl.transform.setLocalPosition(0, 0, cosHit / len * 2);
                    }
                    let oldScale = this._oldLocalScale;
                    let sx = this.xScl.transform.getLocalPosition().x / 2;
                    let sy = this.yScl.transform.getLocalPosition().y / 2;
                    let sz = this.zScl.transform.getLocalPosition().z / 2;
                    scale = egret3d.Vector3.set(oldScale.x * sx, oldScale.y * sy, oldScale.z * sz, helpVec3_2);
                    this.editorModel.setProperty("localScale", scale, this.selectedGameObjs[0].transform);
                }
            }
        }
        private updateInWorldMode() {
            let len = this.selectedGameObjs.length;
            if (len <= 0) return;
            let cameraObject = this.cameraScript.gameObject;
            let camera = cameraObject.getComponent(egret3d.Camera);

            if (this.bindMouse.wasPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
                for (let i = 0; i < len; i++) {
                    let obj = this.selectedGameObjs[i];
                    egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
                }
                ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);

                let ctrlRot = this.controller.transform.getRotation();
                this._ctrlRot = ctrlRot;

                let ray = camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                let pickInfoArray = egret3d.Ray.raycastAll(ray, true);
                if (pickInfoArray && pickInfoArray.length > 0) {
                    pickInfoArray.forEach(pickInfo => {
                        let picked = pickInfo.transform.gameObject;
                        if (this.geoCtrlType == "position" && (picked == this.ball || picked == this.xAxis || picked == this.yAxis || picked == this.zAxis)) {
                            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);

                            if (picked == this.ball) {
                                this._dragMode = DRAG_MODE.BALL;
                                cameraObject.transform.getForward(this._dragPlaneNormal);
                            } else if (picked == this.xAxis) {
                                this._dragMode = DRAG_MODE.X;
                                egret3d.Vector3.copy(up, this._dragPlaneNormal);
                            } else if (picked == this.yAxis) {
                                this._dragMode = DRAG_MODE.Y;
                                egret3d.Vector3.copy(forward, this._dragPlaneNormal);
                            } else if (picked == this.zAxis) {
                                this._dragMode = DRAG_MODE.Z;
                                egret3d.Vector3.copy(up, this._dragPlaneNormal);
                            }

                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                        } else if (this.geoCtrlType == "rotation" && (picked == this.xRot || picked == this.yRot || picked == this.zRot)) {
                            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);
                            //let ctrlRot = this.controller.transform.getRotation();
                            //this._ctrlRot = ctrlRot;
                            if (picked == this.xRot) {
                                this._dragMode = DRAG_MODE.RotX;
                                egret3d.Quaternion.transformVector3(ctrlRot, right, this._dragPlaneNormal);
                            } else if (picked == this.yRot) {
                                this._dragMode = DRAG_MODE.RotY;
                                egret3d.Quaternion.transformVector3(ctrlRot, up, this._dragPlaneNormal);
                            } else if (picked == this.zRot) {
                                this._dragMode = DRAG_MODE.RotZ;
                                egret3d.Quaternion.transformVector3(ctrlRot, forward, this._dragPlaneNormal);
                            }

                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                            egret3d.Vector3.subtract(this._dragOffset, this._ctrlPos, this._dragOffset);
                            egret3d.Vector3.normalize(this._dragOffset);
                        } else if (this.geoCtrlType == "scale" && (picked == this.xScl || picked == this.yScl || picked == this.zScl)) {
                            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);
                            if (picked == this.xScl) {
                                this._dragMode = DRAG_MODE.ScaX;
                                egret3d.Quaternion.transformVector3(ctrlRot, up, this._dragPlaneNormal);
                            } else if (picked == this.yScl) {
                                this._dragMode = DRAG_MODE.ScaY;
                                egret3d.Quaternion.transformVector3(ctrlRot, forward, this._dragPlaneNormal);
                            } else if (picked == this.zScl) {
                                this._dragMode = DRAG_MODE.ScaZ;
                                egret3d.Quaternion.transformVector3(ctrlRot, up, this._dragPlaneNormal);
                            }
                            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                        }
                    });
                }
            }
            if (this.bindMouse.isPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                if (this.geoCtrlType == "position" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, this._dragOffset, this._delta);

                    let worldOffset: egret3d.Vector3;
                    if (this._dragMode == DRAG_MODE.BALL) {
                        worldOffset = egret3d.Vector3.copy(this._delta, helpVec3_1);
                    } else {
                        if (this._dragMode == DRAG_MODE.X) {
                            worldOffset = egret3d.Vector3.copy(right, helpVec3_1);
                        } else if (this._dragMode == DRAG_MODE.Y) {
                            worldOffset = egret3d.Vector3.copy(up, helpVec3_1);
                        } else if (this._dragMode == DRAG_MODE.Z) {
                            worldOffset = egret3d.Vector3.copy(forward, helpVec3_1);
                        }
                        let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
                        egret3d.Vector3.scale(worldOffset, cosHit);
                    }

                    egret3d.Vector3.add(this._ctrlPos, worldOffset, this._ctrlPos);

                    for (let i = 0; i < len; i++) {
                        let obj = this.selectedGameObjs[i];
                        let lastPos = obj.transform.getPosition();
                        egret3d.Vector3.add(lastPos, worldOffset, this._newPosition);

                        this.editorModel.setProperty("position", this._newPosition, obj.transform);
                    }
                    egret3d.Vector3.copy(hit, this._dragOffset);
                } else if (this.geoCtrlType == "rotation" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, this._ctrlPos, hit);
                    egret3d.Vector3.normalize(hit);

                    let cosHitOffset = egret3d.Vector3.dot(hit, this._dragOffset);
                    cosHitOffset = egret3d.floatClamp(cosHitOffset, -1, 1);
                    egret3d.Vector3.cross(this._dragOffset, hit, helpVec3_1);
                    let theta = egret3d.Vector3.dot(helpVec3_1, this._dragPlaneNormal) >= 0 ? Math.acos(cosHitOffset) : -Math.acos(cosHitOffset);
                    let cos = Math.cos(theta * 0.5), sin = Math.sin(theta * 0.5);
                    egret3d.Quaternion.set(this._dragPlaneNormal.x * sin, this._dragPlaneNormal.y * sin, this._dragPlaneNormal.z * sin, cos, helpQuat_1);

                    egret3d.Quaternion.multiply(helpQuat_1, this._ctrlRot, this._ctrlRot);

                    for (let i = 0; i < len; i++) {
                        let obj = this.selectedGameObjs[i];
                        let lastPos = obj.transform.getPosition();
                        let lastRot = obj.transform.getRotation();

                        egret3d.Quaternion.multiply(helpQuat_1, lastRot, helpQuat_2);

                        egret3d.Vector3.subtract(lastPos, this._ctrlPos, lastPos);
                        egret3d.Quaternion.transformVector3(helpQuat_1, lastPos, lastPos);
                        egret3d.Vector3.add(lastPos, this._ctrlPos, lastPos);

                        this.editorModel.setProperty("rotation", helpQuat_2, obj.transform);
                        this.editorModel.setProperty("position", lastPos, obj.transform);
                    }
                    egret3d.Vector3.copy(hit, this._dragOffset);

                } else if (this.geoCtrlType == "scale" && this._dragMode != DRAG_MODE.NONE) {
                    let screenPosition = this.bindMouse.position;
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                    egret3d.Vector3.subtract(hit, this._dragOffset, this._delta);

                    let worldOffset: egret3d.Vector3;
                    let scale: egret3d.Vector3;
                    if (this._dragMode == DRAG_MODE.ScaX) {
                        worldOffset = egret3d.Quaternion.transformVector3(this._ctrlRot, right, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
                        let src = this.xScl.transform.getLocalPosition().x;
                        this.xScl.transform.setLocalPosition(cosHit + src, 0, 0);

                        let s = cosHit / src + 1;

                        for (let i = 0; i < len; i++) {
                            let lastSca = this.selectedGameObjs[i].transform.getLocalScale();
                            scale = egret3d.Vector3.set(lastSca.x * s, lastSca.y, lastSca.z, helpVec3_2);
                            this.editorModel.setProperty("localScale", scale, this.selectedGameObjs[i].transform);

                            let pos = this.selectedGameObjs[i].transform.getPosition();
                            let sub = egret3d.Vector3.subtract(pos, this._ctrlPos, helpVec3_2);
                            egret3d.Quaternion.transformVector3(this.controller.transform.getRotation(), right, helpVec3_3);
                            let cos = egret3d.Vector3.dot(sub, helpVec3_3);
                            egret3d.Vector3.scale(helpVec3_3, cos * (s - 1));
                            egret3d.Vector3.add(pos, helpVec3_3, pos);
                            this.editorModel.setProperty("position", pos, this.selectedGameObjs[i].transform);
                        }
                    } else if (this._dragMode == DRAG_MODE.ScaY) {
                        worldOffset = egret3d.Quaternion.transformVector3(this._ctrlRot, up, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
                        let src = this.yScl.transform.getLocalPosition().y;
                        this.yScl.transform.setLocalPosition(0, cosHit + src, 0);

                        let s = cosHit / src + 1;

                        for (let i = 0; i < len; i++) {
                            let lastSca = this.selectedGameObjs[i].transform.getLocalScale();
                            scale = egret3d.Vector3.set(lastSca.x, lastSca.y * s, lastSca.z, helpVec3_2);
                            this.editorModel.setProperty("localScale", scale, this.selectedGameObjs[i].transform);

                            let pos = this.selectedGameObjs[i].transform.getPosition();
                            let sub = egret3d.Vector3.subtract(pos, this._ctrlPos, helpVec3_2);
                            egret3d.Quaternion.transformVector3(this.controller.transform.getRotation(), up, helpVec3_3);
                            let cos = egret3d.Vector3.dot(sub, helpVec3_3);
                            egret3d.Vector3.scale(helpVec3_3, cos * (s - 1));
                            egret3d.Vector3.add(pos, helpVec3_3, pos);
                            this.editorModel.setProperty("position", pos, this.selectedGameObjs[i].transform);
                        }
                    } else if (this._dragMode == DRAG_MODE.ScaZ) {
                        worldOffset = egret3d.Quaternion.transformVector3(this._ctrlRot, forward, helpVec3_1);
                        let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
                        let src = this.zScl.transform.getLocalPosition().z;
                        this.zScl.transform.setLocalPosition(0, 0, cosHit + src);

                        let s = cosHit / src + 1;

                        for (let i = 0; i < len; i++) {
                            let lastSca = this.selectedGameObjs[i].transform.getLocalScale();
                            scale = egret3d.Vector3.set(lastSca.x, lastSca.y, lastSca.z * s, helpVec3_2);
                            this.editorModel.setProperty("localScale", scale, this.selectedGameObjs[i].transform);

                            let pos = this.selectedGameObjs[i].transform.getPosition();
                            let sub = egret3d.Vector3.subtract(pos, this._ctrlPos, helpVec3_2);
                            egret3d.Quaternion.transformVector3(this.controller.transform.getRotation(), forward, helpVec3_3);
                            let cos = egret3d.Vector3.dot(sub, helpVec3_3);
                            egret3d.Vector3.scale(helpVec3_3, cos * (s - 1));
                            egret3d.Vector3.add(pos, helpVec3_3, pos);
                            this.editorModel.setProperty("position", pos, this.selectedGameObjs[i].transform);
                        }
                    }

                    egret3d.Vector3.copy(hit, this._dragOffset);
                }
            }
        }

        /**
         * 输入监听
         */
        private inputUpdate() {
            let mouse = this.bindMouse;
            let keyboard = this.bindKeyboard;
            if (keyboard.wasPressed("Q")) {
                if (this.geoCtrlMode == "local") {
                    this.editorModel.changeEditMode("world");
                } else {
                    this.editorModel.changeEditMode("local");
                }
            }
            if (keyboard.wasPressed("W")) {
                this.editorModel.changeEditType("position");
            }
            if (keyboard.wasPressed("E")) {
                this.editorModel.changeEditType("rotation");
            }
            if (keyboard.wasPressed("R")) {
                this.editorModel.changeEditType("scale");
            }

            // 复制粘贴
            if (this.bindKeyboard.isPressed('CONTROL') && this.bindKeyboard.wasPressed('C')) {
                let clipboard = __global.runtimeModule.getClipborad();
                let content: any[] = [];
                for (let i = 0, l = this.selectedGameObjs.length; i < l; i++) {
                    content.push({
                        type: "gameObject",
                        id: this.selectedGameObjs[i].hashCode
                    })
                }
                let str = JSON.stringify(content);
                clipboard.writeText(str, "paper");
                console.log("copy");
            }

            if (this.bindKeyboard.isPressed('CONTROL') && this.bindKeyboard.wasPressed('V')) {
                let parent = this.selectedGameObjs.length > 0 ? this.selectedGameObjs[0].transform.parent : null;
                this.editorModel.pasteGameObject(parent);
            }

            if (this.bindKeyboard.isPressed('CONTROL') && this.bindKeyboard.wasPressed('M')) {
                this.editorModel.duplicateGameObjects(this.selectedGameObjs);
            }
        }
        /**
         * 添加监听事件
         */
        private _addEventListener() {
            this.editorModel.addEventListener(EditorModelEvent.SELECT_GAMEOBJECTS, e => this.selectGameObjects(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_MODE, e => this.changeEditMode(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_TYPE, e => this.changeEditType(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_PROPERTY, e => this.changeProperty(e.data), this);
        }
        private selectGameObjects = this._selectGameObjects.bind(this);
        private _selectGameObjects(selectIds: number[]) {
            this.selectedGameObjs = this.editorModel.getGameObjectsByIds(selectIds);
            let len = this.selectedGameObjs.length;
            this._modeCanChange = true;
            if (len > 0) {
                this._isEditing = true;
                this.geoCtrlType = "position";
                this.pCtrl.activeSelf = true;
                this.rCtrl.activeSelf = false;
                this.sCtrl.activeSelf = false;
                this.controller.activeSelf = true;

                if (len == 1) {
                    // console.log("select: " + this.selectedGameObjs[0].name);
                    this.controller.transform.setPosition(this.selectedGameObjs[0].transform.getPosition());
                    if (this.geoCtrlMode == "local") {
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                    } else if (this.geoCtrlMode == "world") {
                        this.controller.transform.setRotation(0, 0, 0, 1);
                    }
                } else {
                    let ctrlPos = egret3d.Vector3.set(0, 0, 0, helpVec3_3);
                    for (let i = 0; i < len; i++) {
                        // console.log("select: " + i + " " + this.selectedGameObjs[i].name);
                        let obj = this.selectedGameObjs[i];
                        egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
                    }
                    ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
                    this.controller.transform.setPosition(ctrlPos);
                    this.controller.transform.setRotation(0, 0, 0, 1);
                    this.geoCtrlMode = "world";
                    this._modeCanChange = false;
                }
            } else {
                this._isEditing = false;
                // console.log("select: null");
                this.controller.activeSelf = false;
            }
        }
        private changeProperty = this._changeProperty.bind(this);
        private _changeProperty(data) {
            if ((data.target instanceof egret3d.Transform) && data.propName) {
                let propName = <string>data.propName;
                let target = <egret3d.Transform>data.target;
                switch (propName) {
                    case "position":
                        this.controller.transform.setPosition(this._ctrlPos);
                        break;
                    case "rotation":
                        this.controller.transform.setRotation(this._ctrlRot);
                        break;
                    case "localPosition":
                        this._ctrlPos = this.selectedGameObjs[0].transform.getPosition();
                        this.controller.transform.setPosition(this._ctrlPos);
                        break;
                    case "localRotation":
                        this._ctrlRot = this.selectedGameObjs[0].transform.getRotation();
                        this.controller.transform.setRotation(this._ctrlRot);
                        break;
                    default:
                        break;
                }
            }
            if (data.target instanceof GameObject) {
                let propName = <string>data.propName;
                console.log(propName);
            }
        }

        private changeEditMode = this._changeEditMode.bind(this);
        private _changeEditMode(mode: string) {
            if (!this._modeCanChange) {
                console.log("current mode: " + this.geoCtrlMode);
                return;
            }
            this.geoCtrlMode = mode;
            let len = this.selectedGameObjs.length;
            if (len < 1) return;
            if (this.geoCtrlType != "scale") {
                switch (mode) {
                    case "local":
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                        break;
                    case "world":
                        this.controller.transform.setRotation(0, 0, 0, 1);
                        break;
                    default:
                        break;
                }
            }
            console.log("current mode: " + this.geoCtrlMode);
        }
        private changeEditType = this._changeEditType.bind(this);
        private _changeEditType(type: string) {
            if (this.geoCtrlType == type) return;
            this.geoCtrlType = type;
            let len = this.selectedGameObjs.length;
            if (len < 1) return;
            switch (type) {
                case "position":
                    this.geoCtrlMode == "local" ? this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation()) : this.controller.transform.setRotation(this.controller.transform.getRotation());
                    this.pCtrl.activeSelf = true;
                    this.rCtrl.activeSelf = false;
                    this.sCtrl.activeSelf = false;
                    break;
                case "rotation":
                    this.geoCtrlMode == "local" ? this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation()) : this.controller.transform.setRotation(this.controller.transform.getRotation());
                    this.pCtrl.activeSelf = false;
                    this.rCtrl.activeSelf = true;
                    this.sCtrl.activeSelf = false;
                    break;
                case "scale":
                    if (len == 1) {
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                    } else {
                        this.controller.transform.setRotation(this.controller.transform.getRotation());
                    }
                    this.pCtrl.activeSelf = false;
                    this.rCtrl.activeSelf = false;
                    this.sCtrl.activeSelf = true;
                    break;
                default:
                    break;
            }
            console.log("current type: " + this.geoCtrlType);
        }

        /**
         * 创建控制杆GameObjcet
         */
        private ball: GameObject;
        private xAxis: GameObject;
        private yAxis: GameObject;
        private zAxis: GameObject;
        private xRot: GameObject;
        private yRot: GameObject;
        private zRot: GameObject;
        private xScl: GameObject;
        private yScl: GameObject;
        private zScl: GameObject;
        private pCtrl: GameObject;
        private rCtrl: GameObject;
        private sCtrl: GameObject;
        private controller: GameObject;
        public controllerPool: GameObject[] = [];
        public _addGizmoController() {
            let controller = new paper.GameObject();
            controller.activeSelf = false;
            controller.name = "GizmoController";
            controller.tag = "Editor";

            let pcontroller = new paper.GameObject();
            pcontroller.activeSelf = true;
            pcontroller.name = "GizmoController_Position";
            pcontroller.tag = "Editor";
            pcontroller.transform.setParent(controller.transform);
            let rcontroller = new paper.GameObject();
            rcontroller.activeSelf = false;
            rcontroller.name = "GizmoController_Rotation";
            rcontroller.tag = "Editor";
            rcontroller.transform.setParent(controller.transform);
            let scontroller = new paper.GameObject();
            scontroller.activeSelf = false;
            scontroller.name = "GizmoController_Scale";
            scontroller.tag = "Editor";
            scontroller.transform.setParent(controller.transform);

            let ball = new paper.GameObject();
            ball.name = "GizmoController_Ball";
            ball.tag = "Editor";
            ball.transform.setParent(pcontroller.transform);
            ball.transform.setLocalScale(0.3, 0.3, 0.3);

            let mesh = ball.addComponent(egret3d.MeshFilter);
            mesh.mesh = egret3d.DefaultMeshes.SPHERE;
            let renderer = ball.addComponent(egret3d.MeshRenderer);

            let mat = new egret3d.Material();
            mat.setShader(egret3d.DefaultShaders.GIZMOS_COLOR);
            mat.setVector4("_Color", new egret3d.Vector4(0.8, 0.8, 0.4, 0.1));
            renderer.materials = [mat];

            let xAxis = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 0.2), 0);
            xAxis.name = "GizmoController_X";
            xAxis.tag = "Editor";
            xAxis.transform.setParent(pcontroller.transform);
            xAxis.transform.setLocalScale(0.1, 2, 0.1);
            xAxis.transform.setLocalEulerAngles(0, 0, 90);
            xAxis.transform.setLocalPosition(1, 0, 0);

            let yAxis = this._createAxis(new egret3d.Vector4(0.0, 0.8, 0.0, 0.2), 0);
            yAxis.name = "GizmoController_Y";
            yAxis.tag = "Editor";
            yAxis.transform.setParent(pcontroller.transform);
            yAxis.transform.setLocalScale(0.1, 2, 0.1);
            yAxis.transform.setLocalEulerAngles(0, 0, 0);
            yAxis.transform.setLocalPosition(0, 1, 0);

            let zAxis = this._createAxis(new egret3d.Vector4(0.0, 0.0, 0.8, 0.2), 0);
            zAxis.name = "GizmoController_Z";
            zAxis.tag = "Editor";
            zAxis.transform.setParent(pcontroller.transform);
            zAxis.transform.setLocalScale(0.1, 2, 0.1);
            zAxis.transform.setLocalEulerAngles(90, 0, 0);
            zAxis.transform.setLocalPosition(0, 0, 1);

            let xRotate = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 0.2), 1);
            xRotate.name = "GizmoController_Rotate_X";
            xRotate.tag = "Editor";
            xRotate.transform.setParent(rcontroller.transform);
            xRotate.transform.setLocalScale(3, 0.05, 3);
            xRotate.transform.setLocalEulerAngles(0, 0, -90);

            let yRotate = this._createAxis(new egret3d.Vector4(0.0, 0.8, 0.0, 0.2), 1);
            yRotate.name = "GizmoController_Rotate_Y";
            yRotate.tag = "Editor";
            yRotate.transform.setParent(rcontroller.transform);
            yRotate.transform.setLocalScale(3, 0.05, 3);
            yRotate.transform.setLocalEulerAngles(0, 0, 0);

            let zRotate = this._createAxis(new egret3d.Vector4(0.0, 0.0, 0.8, 0.2), 1);
            zRotate.name = "GizmoController_Rotate_Z";
            zRotate.tag = "Editor";
            zRotate.transform.setParent(rcontroller.transform);
            zRotate.transform.setLocalEulerAngles(90, 0, 0);
            zRotate.transform.setLocalScale(3, 0.05, 3);

            let xScale = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 0.2), 2);
            xScale.name = "GizmoController_Scale_X";
            xScale.tag = "Editor";
            xScale.transform.setParent(scontroller.transform);
            xScale.transform.setLocalScale(0.2, 0.2, 0.2);
            xScale.transform.setLocalPosition(2, 0, 0);

            let yScale = this._createAxis(new egret3d.Vector4(0.0, 0.8, 0.0, 0.2), 2);
            yScale.name = "GizmoController_Scale_Y";
            yScale.tag = "Editor";
            yScale.transform.setParent(scontroller.transform);
            yScale.transform.setLocalScale(0.2, 0.2, 0.2);
            yScale.transform.setLocalPosition(0, 2, 0);

            let zScale = this._createAxis(new egret3d.Vector4(0.0, 0.0, 0.8, 0.2), 2);
            zScale.name = "GizmoController_Scale_Z";
            zScale.tag = "Editor";
            zScale.transform.setParent(scontroller.transform);
            zScale.transform.setLocalScale(0.2, 0.2, 0.2);
            zScale.transform.setLocalPosition(0, 0, 2);

            this.ball = ball;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.zAxis = zAxis;
            this.xRot = xRotate;
            this.yRot = yRotate;
            this.zRot = zRotate;
            this.xScl = xScale;
            this.yScl = yScale;
            this.zScl = zScale;
            this.pCtrl = pcontroller;
            this.rCtrl = rcontroller;
            this.sCtrl = scontroller;
            this.controller = controller;
            this.controllerPool = [controller, scontroller, rcontroller, pcontroller, zScale, yScale, xScale, zRotate, yRotate, xRotate, zAxis, yAxis, xAxis, ball]
        }
        /**
         * type 0:控制位置 1:控制旋转
         */
        private _createAxis(color: egret3d.Vector4, type: number): GameObject {
            let gizmoAxis = new paper.GameObject();

            let mesh = gizmoAxis.addComponent(egret3d.MeshFilter);
            switch (type) {
                case 0:
                    mesh.mesh = egret3d.DefaultMeshes.CYLINDER;
                    break;
                case 1:
                    mesh.mesh = egret3d.DefaultMeshes.CYLINDER;
                    break;
                case 2:
                    mesh.mesh = egret3d.DefaultMeshes.SPHERE;
                    break;
            }
            let renderer = gizmoAxis.addComponent(egret3d.MeshRenderer);

            let mat = new egret3d.Material();
            mat.setShader(egret3d.DefaultShaders.GIZMOS_COLOR);
            mat.setVector4("_Color", color);
            renderer.materials = [mat];

            return gizmoAxis;
        }
        public _removeGizmoController() {
            let gameObject = GameObject.find("GizmoController");
            this.controller = null;
        }
    }
}