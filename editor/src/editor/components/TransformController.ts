namespace paper.editor {

    const enum PRSStart {
        LocalPosition = 0,
        LocalRotation = 1,
        LocalScale = 2,
        Position = 3,
        Rotation = 4,
        Scale = 5,
        LocalEulerAngles = 6,
    }

    const enum AxisName {
        AxisX = "AxisX",
        AxisY = "AxisY",
        AxisZ = "AxisZ",
        AxisE = "AxisE",
        AxisXYZE = "AxisXYZE",
        ArrowX = "ArrowX",
        ArrowY = "ArrowY",
        ArrowZ = "ArrowZ",
        X = "X",
        Y = "Y",
        Z = "Z",
        E = "E",
        XY = "XY",
        YZ = "YZ",
        ZX = "ZX",
        XYZ = "XYZ",
        XYZE = "XYZE",
    }
    /**
     * @internal
     */
    export class TransformController extends BaseComponent {
        public isWorldSpace: boolean = false;
        public readonly translate: GameObject = EditorMeshHelper.createGameObject("Translate");
        public readonly rotate: GameObject = EditorMeshHelper.createGameObject("Rotate");
        public readonly scale: GameObject = EditorMeshHelper.createGameObject("Scale");

        private _controlling: boolean = false;
        private readonly _offsetStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _offsetEnd: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _eye: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _plane: egret3d.Plane = egret3d.Plane.create();
        private readonly _quad: GameObject = EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.QUAD, egret3d.DefaultMaterials.MESH_BASIC_DOUBLESIDE.clone().setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent).setOpacity(0.5));
        private readonly _prsStarts: {
            [key: string]: [ // PRSStart
                egret3d.Vector3,
                egret3d.Quaternion,
                egret3d.Vector3,
                egret3d.Vector3,
                egret3d.Quaternion,
                egret3d.Vector3,
                egret3d.Vector3
            ]
        } = {};
        private readonly _highlights: { [key: string]: GameObject[] } = {};
        private readonly _highlightsValue: { [key: string]: { high: number, low: number, default: number } } = {};
        private readonly _dir: { [key: string]: egret3d.IVector3 } = { [AxisName.X]: egret3d.Vector3.RIGHT, [AxisName.Y]: egret3d.Vector3.UP, [AxisName.Z]: egret3d.Vector3.FORWARD };
        private _mode: GameObject | null = null;
        private _hovered: GameObject | null = null;

        private _raycast(raycastAble: egret3d.IRaycast, mousePositionX: number, mousePositionY: number) {
            const ray = egret3d.Camera.editor.stageToRay(mousePositionX, mousePositionY).release();
            const raycastInfo = egret3d.RaycastInfo.create().release();

            return raycastAble.raycast(ray, raycastInfo) ? raycastInfo : null;
        }

        private _updateTransform(mousePosition: Readonly<egret3d.IVector3>) {
            const raycastInfo = this._raycast(this._plane, mousePosition.x, mousePosition.y);
            if (!raycastInfo) {
                //TODO
                return;
            }

            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            const currentSelectedPRS = this._prsStarts[selectedGameObject.uuid];
            this._offsetEnd.subtract(currentSelectedPRS[PRSStart.Position], raycastInfo.position);

            if (this._mode === this.scale) {
                isWorldSpace = false;
            }
            else {
                switch (hoveredName) {
                    case AxisName.E:
                    case AxisName.XYZ:
                    case AxisName.XYZE:
                        isWorldSpace = true;
                        break;
                }
            }

            if (!isWorldSpace) {
                this._offsetEnd.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
            }

            if (this._mode === this.translate) {
                const position = egret3d.Vector3.create().release();

                if (hoveredName.indexOf(AxisName.X) < 0) {
                    this._offsetEnd.x = this._offsetStart.x;
                }

                if (hoveredName.indexOf(AxisName.Y) < 0) {
                    this._offsetEnd.y = this._offsetStart.y;
                }

                if (hoveredName.indexOf(AxisName.Z) < 0) {
                    this._offsetEnd.z = this._offsetStart.z;
                }

                for (const gameObject of modelComponent.selectedGameObjects) {
                    if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                        continue;
                    }

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    position.subtract(this._offsetStart, this._offsetEnd);

                    if (isWorldSpace) {
                        position.add(selectedPRS[PRSStart.Position]);
                        // TODO translationSnap
                        gameObject.transform.position = position;
                    }
                    else {
                        position.applyQuaternion(selectedPRS[PRSStart.LocalRotation]); // TODO parent space.
                        position.add(selectedPRS[PRSStart.LocalPosition]);
                        // TODO translationSnap
                        gameObject.transform.localPosition = position;
                    }
                }
            }
            else if (this._mode === this.rotate) {
                const camera = egret3d.Camera.editor;
                const tempVector = egret3d.Vector3.create().release();
                const rotationAxis = egret3d.Vector3.create().release();
                const rotation = !isWorldSpace ? selectedGameObject.transform.rotation : egret3d.Quaternion.IDENTITY.clone().release();
                const tempQuaternion = egret3d.Quaternion.create().release();
                const speed = 20.0 / selectedGameObject.transform.position.getDistance(tempVector.applyMatrix(camera.gameObject.transform.localToWorldMatrix));
                let rotationAngle = 0;

                if (hoveredName.indexOf(AxisName.XYZE) >= 0) {
                    tempVector.copy(this._offsetEnd).subtract(this._offsetStart, tempVector).cross(this._eye).normalize();
                    rotationAxis.copy(tempVector);
                    rotationAngle = this._offsetEnd.subtract(this._offsetStart, this._offsetEnd).dot(tempVector.cross(this._eye)) * speed;
                }
                else if (hoveredName.indexOf(AxisName.E) >= 0) {
                    tempVector.copy(this._offsetEnd).cross(this._offsetStart);
                    rotationAxis.copy(this._eye);
                    rotationAngle = this._offsetEnd.getAngle(this._offsetStart) * (tempVector.dot(this._eye) < 0 ? 1 : -1);
                }
                else {
                    const unit = this._dir[hoveredName];
                    const tempVector2 = egret3d.Vector3.create().release();
                    rotationAxis.copy(unit);

                    tempVector.copy(unit);
                    tempVector2.subtract(this._offsetStart, this._offsetEnd);
                    if (!isWorldSpace) {
                        tempVector.applyQuaternion(rotation);
                        tempVector2.applyQuaternion(currentSelectedPRS[4]);
                    }

                    rotationAngle = tempVector2.dot(tempVector.cross(this._eye).normalize()) * speed;
                }

                for (const gameObject of modelComponent.selectedGameObjects) {

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    if (isWorldSpace) {
                        tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(selectedPRS[PRSStart.Rotation]).normalize();
                        gameObject.transform.rotation = tempQuaternion;
                    }
                    else {
                        tempQuaternion.fromAxis(rotationAxis, rotationAngle).premultiply(selectedPRS[PRSStart.LocalRotation]).normalize();
                        gameObject.transform.localRotation = tempQuaternion;
                    }
                }
            }
            else if (this._mode === this.scale) {
                if (hoveredName.indexOf(AxisName.XYZ) >= 0) {
                    let d = this._offsetEnd.length / this._offsetStart.length;
                    if (this._offsetEnd.dot(this._offsetStart) < 0.0) d *= -1.0;
                    this._offsetEnd.set(d, d, d);
                }
                else {
                    this._offsetEnd.divide(this._offsetStart);

                    if (hoveredName.indexOf(AxisName.X) < 0) {
                        this._offsetEnd.x = 1.0;
                    }

                    if (hoveredName.indexOf(AxisName.Y) < 0) {
                        this._offsetEnd.y = 1.0;
                    }

                    if (hoveredName.indexOf(AxisName.Z) < 0) {
                        this._offsetEnd.z = 1.0;
                    }
                }

                // TODO this._offsetEnd scale aabb size
                const scale = egret3d.Vector3.create().release();

                for (const gameObject of modelComponent.selectedGameObjects) {
                    if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                        continue;
                    }

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    gameObject.transform.localScale = scale.multiply(this._offsetEnd, selectedPRS[PRSStart.LocalScale]);
                }
            }
        }

        private _updateSelf() {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const camera = egret3d.Camera.editor;
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            const eye = this._eye.copy(camera.gameObject.transform.position);
            const eyeDistance = eye.getDistance(selectedGameObject.transform.position);

            if (camera.opvalue > 0.0) {
                eye.subtract(selectedGameObject.transform.position);
            }

            eye.normalize();

            const quaternion = isWorldSpace ? egret3d.Quaternion.IDENTITY : selectedGameObject.transform.rotation;
            this.gameObject.transform.localPosition = selectedGameObject.transform.position;
            this.gameObject.transform.localRotation = quaternion;
            this.gameObject.transform.localScale = egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10.0).release();

            if (this._mode === this.rotate) {
                const tempQuaternion = quaternion.clone().release();
                const tempQuaternion2 = quaternion.clone().release();
                const alignVector = egret3d.Vector3.create().release();
                alignVector.copy(this._eye).applyQuaternion(tempQuaternion.inverse());

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.RIGHT, Math.atan2(alignVector.y, -alignVector.z));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisX = this.rotate.transform.find(AxisName.AxisX)!;
                    const pickX = this.rotate.transform.find(AxisName.X)!;
                    axisX.setRotation(tempQuaternion);
                    pickX.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.UP, Math.atan2(-alignVector.x, -alignVector.z));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisY = this.rotate.transform.find(AxisName.AxisY)!;
                    const pickY = this.rotate.transform.find(AxisName.Y)!;
                    axisY.setRotation(tempQuaternion);
                    pickY.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.FORWARD, Math.atan2(-alignVector.x, alignVector.y));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisZ = this.rotate.transform.find(AxisName.AxisZ)!;
                    const pickZ = this.rotate.transform.find(AxisName.Z)!;
                    axisZ.setRotation(tempQuaternion);
                    pickZ.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    const axisE = this.rotate.transform.find(AxisName.AxisE)!;
                    const pickE = this.rotate.transform.find(AxisName.E)!;
                    axisE.setRotation(tempQuaternion2);
                    pickE.setRotation(tempQuaternion2);
                }

                {
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    const axisXYZE = this.rotate.transform.find(AxisName.AxisXYZE)!;
                    axisXYZE.setRotation(tempQuaternion2);
                }
            }
        }

        private _updatePlane() {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : this.gameObject.transform.rotation;
            const unitX = egret3d.Vector3.RIGHT.clone().applyQuaternion(rotation).release();
            const unitY = egret3d.Vector3.UP.clone().applyQuaternion(rotation).release();
            const unitZ = egret3d.Vector3.FORWARD.clone().applyQuaternion(rotation).release();
            // Align the plane for current transform mode, axis and space.
            const alignVector = unitY.clone().release();
            const dirVector = egret3d.Vector3.create().release();

            if (this._hovered && this._mode !== this.rotate) {
                switch (this._hovered.name) {
                    case AxisName.X:
                        alignVector.cross(this._eye, unitX);
                        dirVector.cross(unitX, alignVector);
                        break;

                    case AxisName.Y:
                        alignVector.cross(this._eye, unitY);
                        dirVector.cross(unitY, alignVector);
                        break;

                    case AxisName.Z:
                        alignVector.cross(this._eye, unitZ);
                        dirVector.cross(unitZ, alignVector);
                        break;

                    case AxisName.XY:
                        dirVector.copy(unitZ);
                        break;

                    case AxisName.YZ:
                        dirVector.copy(unitX);
                        break;

                    case AxisName.ZX:
                        alignVector.copy(unitZ);
                        dirVector.copy(unitY);
                        break;
                }
            }

            if (dirVector.length === 0.0) {
                // If in rotate mode, make the plane parallel to camera
                this._quad.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
            }
            else {
                this._quad.transform.rotation = egret3d.Quaternion.create().fromMatrix(
                    egret3d.Matrix4.create().lookAt(
                        egret3d.Vector3.ZERO,
                        dirVector,
                        alignVector
                    ).release()
                ).release();
            }

            if (!this._controlling) {
                this._plane.fromPoint(this._quad.transform.position, this._quad.transform.getForward().release());
            }
        }

        public initialize() {
            super.initialize();

            { // Translate.
                const translate = this.translate;
                const axisX = EditorMeshHelper.createGameObject(AxisName.AxisX, egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject(AxisName.AxisY, egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject(AxisName.AxisZ, egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowX = EditorMeshHelper.createGameObject(AxisName.ArrowX, egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = EditorMeshHelper.createGameObject(AxisName.ArrowY, egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = EditorMeshHelper.createGameObject(AxisName.ArrowZ, egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject(AxisName.X, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject(AxisName.Y, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject(AxisName.Z, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXY = EditorMeshHelper.createGameObject(AxisName.XY, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));
                const pickYZ = EditorMeshHelper.createGameObject(AxisName.YZ, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));
                const pickZX = EditorMeshHelper.createGameObject(AxisName.ZX, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));

                translate.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(translate.transform).setLocalPosition(0.001, 0.0, 0.0);
                axisY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.001, 0.0);
                axisZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.001);
                arrowX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(0.1, 0.2, 0.1);
                arrowY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.1, 0.2, 0.1);
                arrowZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.1, 0.2, 0.1);

                pickX.transform.setParent(translate.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15);
                pickY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15);
                pickZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9);
                pickXY.transform.setParent(translate.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                pickYZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                pickZX.transform.setParent(translate.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);

                axisX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                axisY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                axisZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                arrowX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                arrowY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                arrowZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                pickX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.RED);
                pickY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.GREEN);
                pickZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.BLUE);
                pickXY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                pickYZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.INDIGO);
                pickZX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.PURPLE);

                this._highlights[pickX.uuid] = [axisX, arrowX];
                this._highlights[pickY.uuid] = [axisY, arrowY];
                this._highlights[pickZ.uuid] = [axisZ, arrowZ];
                this._highlightsValue[pickX.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickY.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickZ.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
            }

            { // Rotate.
                const rotate = this.rotate;
                const axisX = EditorMeshHelper.createGameObject(AxisName.AxisX, egret3d.MeshBuilder.createCircle(1.0, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject(AxisName.AxisY, egret3d.MeshBuilder.createCircle(1.0, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject(AxisName.AxisZ, egret3d.MeshBuilder.createCircle(1.0, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisE = EditorMeshHelper.createGameObject(AxisName.AxisE, egret3d.MeshBuilder.createCircle(1.25, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisXYZE = EditorMeshHelper.createGameObject(AxisName.AxisXYZE, egret3d.MeshBuilder.createCircle(1, 1, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject(AxisName.X, egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject(AxisName.Y, egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject(AxisName.Z, egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickE = EditorMeshHelper.createGameObject(AxisName.E, egret3d.MeshBuilder.createTorus(1.25, 0.1, 4, 24, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXYZE = EditorMeshHelper.createGameObject(AxisName.XYZE, egret3d.MeshBuilder.createSphere(1, 0, 0), egret3d.DefaultMaterials.MESH_BASIC.clone());

                rotate.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(rotate.transform);
                axisY.transform.setParent(rotate.transform);
                axisZ.transform.setParent(rotate.transform);
                axisE.transform.setParent(rotate.transform);
                axisXYZE.transform.setParent(rotate.transform);
                pickX.transform.setParent(rotate.transform);
                pickY.transform.setParent(rotate.transform);
                pickZ.transform.setParent(rotate.transform);
                pickE.transform.setParent(rotate.transform);
                pickXYZE.transform.setParent(rotate.transform);

                axisX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                axisY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                axisZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                axisE.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                axisXYZE.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay - 1, 0.8).setColor(egret3d.Color.GRAY);
                pickX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.RED);
                pickY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.GREEN);
                pickZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.BLUE);
                pickE.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.YELLOW);
                pickXYZE.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay - 1, 0.0).setColor(egret3d.Color.BLACK);

                this._highlights[pickX.uuid] = [axisX];
                this._highlights[pickY.uuid] = [axisY];
                this._highlights[pickZ.uuid] = [axisZ];
                this._highlights[pickE.uuid] = [axisE];
                this._highlights[pickXYZE.uuid] = [axisXYZE, pickXYZE];
                this._highlightsValue[pickX.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickY.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickZ.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickE.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickXYZE.uuid] = { high: 0.2, low: 0.0, default: 0.0 };
            }

            { // Scale.
                const scale = this.scale;
                const axisX = EditorMeshHelper.createGameObject(AxisName.AxisX, egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject(AxisName.AxisY, egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject(AxisName.AxisZ, egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowX = EditorMeshHelper.createGameObject(AxisName.ArrowX, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = EditorMeshHelper.createGameObject(AxisName.ArrowY, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = EditorMeshHelper.createGameObject(AxisName.ArrowZ, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject(AxisName.X, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject(AxisName.Y, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject(AxisName.Z, egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXY = EditorMeshHelper.createGameObject(AxisName.XY, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));
                const pickYZ = EditorMeshHelper.createGameObject(AxisName.YZ, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));
                const pickZX = EditorMeshHelper.createGameObject(AxisName.ZX, egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE));

                scale.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(scale.transform).setLocalPosition(0.001, 0.0, 0.0);
                axisY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.001, 0.0);
                axisZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.001);
                arrowX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.15, 0.15, 0.15);
                arrowY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.15, 0.15, 0.15);
                arrowZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalScale(0.15, 0.15, 0.15);
                pickX.transform.setParent(scale.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15);
                pickY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15);
                pickZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9);
                pickXY.transform.setParent(scale.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                pickYZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                pickZX.transform.setParent(scale.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);

                axisX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                axisY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                axisZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                arrowX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                arrowY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                arrowZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                pickX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.RED);
                pickY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.GREEN);
                pickZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.0).setColor(egret3d.Color.BLUE);
                pickXY.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                pickYZ.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.INDIGO);
                pickZX.renderer!.material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.PURPLE);

                this._highlights[pickX.uuid] = [axisX, arrowX];
                this._highlights[pickY.uuid] = [axisY, arrowY];
                this._highlights[pickZ.uuid] = [axisZ, arrowZ];
                this._highlightsValue[pickX.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickY.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
                this._highlightsValue[pickZ.uuid] = { high: 0.0, low: 0.0, default: 0.0 };
            }

            this.mode = this.translate; // Update mode.
            this._quad.parent = this.gameObject;
            this._quad.activeSelf = false;
        }

        public start(mousePosition: Readonly<egret3d.IVector3>) {
            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const raycastInfo = this._raycast(this._plane, mousePosition.x, mousePosition.y)!;
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;

            for (const gameObject of modelComponent.selectedGameObjects) {
                const transform = gameObject.transform;
                this._prsStarts[gameObject.uuid] = [
                    egret3d.Vector3.create().copy(transform.localPosition),
                    egret3d.Quaternion.create().copy(transform.localRotation),
                    egret3d.Vector3.create().copy(transform.localScale),
                    egret3d.Vector3.create().copy(transform.position),
                    egret3d.Quaternion.create().copy(transform.rotation),
                    egret3d.Vector3.create().copy(transform.scale),
                    egret3d.Vector3.create().copy(transform.localEulerAngles),
                ];
            }

            const currentSelectedPRS = this._prsStarts[modelComponent.selectedGameObject!.uuid];
            this._offsetStart.subtract(currentSelectedPRS[PRSStart.Position], raycastInfo.position);
            this._controlling = true;

            if (this._mode === this.scale) {
                isWorldSpace = false;
            }
            else {
                switch (hoveredName) {
                    case AxisName.E:
                    case AxisName.XYZ:
                    case AxisName.XYZE:
                        isWorldSpace = true;
                        break;
                }
            }

            if (!isWorldSpace) {
                this._offsetStart.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
            }
        }

        public end() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;

            for (const gameObject of modelComponent.selectedGameObjects) {
                const transform = gameObject.transform;
                const currentPro = this._prsStarts[gameObject.uuid];

                if (this.mode === this.translate) {
                    modelComponent.changeProperty("localPosition", currentPro[PRSStart.LocalPosition], transform.localPosition, transform);
                }
                else if (this.mode === this.rotate) {
                    modelComponent.changeProperty("localEulerAngles", currentPro[PRSStart.LocalEulerAngles], transform.localEulerAngles, transform);
                }
                else if (this.mode === this.scale) {
                    modelComponent.changeProperty("localScale", currentPro[PRSStart.LocalScale], transform.localScale, transform);
                }
            }

            for (const k in this._prsStarts) {
                for (const v of this._prsStarts[k]) {
                    v.release();
                }

                delete this._prsStarts[k];
            }

            this._controlling = false;
        }

        public update(mousePosition: Readonly<egret3d.IVector3>) {
            if (this._hovered && this._controlling) {
                this._updateTransform(mousePosition);
            }

            this._updateSelf();
            this._updatePlane();
        }

        public get mode() {
            return this._mode || this.translate;
        }
        public set mode(value: GameObject) {
            if (this._mode === value) {
                return;
            }

            this.translate !== value && (this.translate.activeSelf = false);
            this.rotate !== value && (this.rotate.activeSelf = false);
            this.scale !== value && (this.scale.activeSelf = false);
            this._mode = value;
            this._mode.activeSelf = true;
        }

        public get hovered() {
            return this._hovered;
        }
        public set hovered(value: GameObject | null) {
            if (this._hovered === value) {
                return;
            }

            if (value) {
                const highlights = this._highlights[value.uuid] || [value];

                for (const child of this._mode!.transform.children) {
                    if (!child.gameObject.renderer) {
                        continue;
                    }

                    const material = child.gameObject.renderer.material!;

                    if (highlights.indexOf(child.gameObject) >= 0) {
                        this._highlightsValue[child.gameObject.uuid] ?
                            material.opacity = this._highlightsValue[child.gameObject.uuid].high :
                            material.opacity = 1.0;
                    }
                    else {
                        this._highlightsValue[child.gameObject.uuid] ?
                            material.opacity = this._highlightsValue[child.gameObject.uuid].low :
                            material.opacity = 0.3;
                    }
                }
            }
            else {
                for (const child of this._mode!.transform.children) {
                    if (!child.gameObject.renderer) {
                        continue;
                    }

                    this._highlightsValue[child.gameObject.uuid] ?
                        child.gameObject.renderer.material!.opacity = this._highlightsValue[child.gameObject.uuid].default :
                        child.gameObject.renderer.material!.opacity = 0.8;
                }
            }

            this._hovered = value;
        }
    }
}