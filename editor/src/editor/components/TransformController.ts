namespace paper.editor {
    /**
     * @internal
     */
    export class TransformController extends BaseComponent {
        public isWorldSpace: boolean = false;
        public readonly eye: egret3d.Vector3 = egret3d.Vector3.create();
        public readonly translate: GameObject = EditorMeshHelper.createGameObject("Translate");
        public readonly rotate: GameObject = EditorMeshHelper.createGameObject("Rotate");
        public readonly scale: GameObject = EditorMeshHelper.createGameObject("Scale");

        private _controlling: boolean = false;
        private readonly _prsStarts: { [key: string]: [egret3d.Vector3, egret3d.Quaternion, egret3d.Vector3, egret3d.Vector3, egret3d.Quaternion, egret3d.Vector3, egret3d.Vector3] } = {};
        private readonly _offsetStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _offsetEnd: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _plane: egret3d.Plane = egret3d.Plane.create();
        private readonly _quad: GameObject = EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.QUAD, egret3d.DefaultMaterials.MESH_BASIC_DOUBLESIDE.clone().setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent).setOpacity(0.5));
        private readonly _highlights: { [key: string]: GameObject[] } = {};
        private readonly _dir: { [key: string]: egret3d.IVector3 } = { "X": egret3d.Vector3.RIGHT, "Y": egret3d.Vector3.UP, "Z": egret3d.Vector3.FORWARD };
        private _mode: GameObject | null = null;
        private _hovered: GameObject | null = null;

        public initialize() {
            super.initialize();

            { // Translate.
                const translate = this.translate;
                const axisX = EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowX = EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXY = EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);
                const pickYZ = EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);
                const pickZX = EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);

                this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                this._highlights[pickY.uuid] = [pickY, axisY, arrowY];
                this._highlights[pickZ.uuid] = [pickZ, axisZ, arrowZ];

                translate.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(translate.transform).setLocalPosition(0.001, 0.0, 0.0);
                axisY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.001, 0.0);
                axisZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.001);
                arrowX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(0.1, 0.2, 0.1);
                arrowY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.1, 0.2, 0.1);
                arrowZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.1, 0.2, 0.1);

                pickX.transform.setParent(translate.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                pickY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                pickZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                pickXY.transform.setParent(translate.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                pickYZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                pickZX.transform.setParent(translate.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);

                (axisX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (arrowX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (arrowY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (arrowZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (pickX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (pickXY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                (pickYZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.INDIGO);
                (pickZX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.PURPLE);
            }

            { // Rotate.
                const rotate = this.rotate;
                const axisX = EditorMeshHelper.createGameObject("AxisX", egret3d.MeshBuilder.createCircle(1.0, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject("AxisY", egret3d.MeshBuilder.createCircle(1.0, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject("AxisZ", egret3d.MeshBuilder.createCircle(1.0, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisE = EditorMeshHelper.createGameObject("AxisE", egret3d.MeshBuilder.createCircle(1.25, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisXYZE = EditorMeshHelper.createGameObject("AxisXYZE", egret3d.MeshBuilder.createCircle(1, 1, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject("X", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject("Y", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject("Z", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickE = EditorMeshHelper.createGameObject("E", egret3d.MeshBuilder.createTorus(1.25, 0.1, 4, 24, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXYZE = EditorMeshHelper.createGameObject("XYZE", egret3d.MeshBuilder.createSphere(0.7, 10, 8), egret3d.DefaultMaterials.MESH_BASIC.clone());

                this._highlights[pickX.uuid] = [axisX];
                this._highlights[pickY.uuid] = [axisY];
                this._highlights[pickZ.uuid] = [axisZ];
                this._highlights[pickE.uuid] = [axisE];
                this._highlights[pickXYZE.uuid] = [axisXYZE];

                rotate.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(rotate.transform);
                axisY.transform.setParent(rotate.transform);
                axisZ.transform.setParent(rotate.transform);
                axisE.transform.setParent(rotate.transform);
                axisXYZE.transform.setParent(rotate.transform);
                pickX.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                pickY.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                pickZ.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                pickE.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                pickXYZE.transform.setParent(rotate.transform).gameObject.activeSelf = false;

                (axisX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (axisE.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                (axisXYZE.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay - 1, 0.8).setColor(egret3d.Color.GRAY);
                (pickX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (pickE.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                (pickXYZE.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay - 1, 0.8).setColor(egret3d.Color.GRAY);
            }

            { // Scale.
                const scale = this.scale;
                const axisX = EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowX = EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowY = EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const arrowZ = EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickXY = EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);
                const pickYZ = EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);
                const pickZX = EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), DefaultTags.Untagged);

                this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                this._highlights[pickY.uuid] = [pickX, axisY, arrowY];
                this._highlights[pickZ.uuid] = [pickX, axisZ, arrowZ];

                scale.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(scale.transform).setLocalPosition(0.001, 0.0, 0.0);
                axisY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.001, 0.0);
                axisZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.001);
                arrowX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.15, 0.15, 0.15);
                arrowY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.15, 0.15, 0.15);
                arrowZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalScale(0.15, 0.15, 0.15);
                pickX.transform.setParent(scale.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                pickY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                pickZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                pickXY.transform.setParent(scale.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                pickYZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                pickZX.transform.setParent(scale.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);

                (axisX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (arrowX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (arrowY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (arrowZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (pickX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.BLUE);
                (pickXY.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.YELLOW);
                (pickYZ.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.INDIGO);
                (pickZX.renderer as egret3d.MeshRenderer).material!.setDepth(false, false).setBlend(gltf.BlendMode.Blend, RenderQueue.Overlay, 0.8).setColor(egret3d.Color.PURPLE);
            }

            this.mode = this.translate; // Update mode.
            this._quad.parent = this.gameObject;
            this._quad.activeSelf = false;
        }

        private _updateTransform(mousePosition: Readonly<egret3d.IVector3>) {
            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const raycastInfo = Helper.raycast(this._plane, mousePosition.x, mousePosition.y)!;
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            const currentSelectedPRS = this._prsStarts[selectedGameObject.uuid];

            this._offsetEnd.subtract(currentSelectedPRS[3], raycastInfo.position);

            if (this._mode === this.scale) {
                isWorldSpace = false;
            }
            else {
                switch (hoveredName) {
                    case "E":
                    case "XYZ":
                    case "XYZE":
                        isWorldSpace = true;
                        break;
                }
            }

            if (!isWorldSpace) {
                this._offsetEnd.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
            }

            if (this._mode === this.translate) {
                if (hoveredName.indexOf("X") < 0) {
                    this._offsetEnd.x = this._offsetStart.x;
                }

                if (hoveredName.indexOf("Y") < 0) {
                    this._offsetEnd.y = this._offsetStart.y;
                }

                if (hoveredName.indexOf("Z") < 0) {
                    this._offsetEnd.z = this._offsetStart.z;
                }

                const position = egret3d.Vector3.create();

                for (const gameObject of modelComponent.selectedGameObjects) {
                    if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                        continue;
                    }

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    position.subtract(this._offsetStart, this._offsetEnd);

                    if (isWorldSpace) {
                        position.add(selectedPRS[3]);
                        // TODO translationSnap
                        gameObject.transform.position = position;
                    }
                    else {
                        position.applyQuaternion(selectedPRS[1]);
                        position.add(selectedPRS[0]);
                        // TODO translationSnap
                        gameObject.transform.localPosition = position;
                    }
                }

                position.release();
            }
            else if (this._mode === this.rotate) {
                const camera = egret3d.Camera.editor;
                const tempVector = egret3d.Vector3.create();
                const rotationAxis = egret3d.Vector3.create();
                const rotation = !isWorldSpace ? selectedGameObject.transform.rotation : egret3d.Quaternion.IDENTITY.clone();
                const tempQuaternion = egret3d.Quaternion.create();
                const ROTATION_SPEED = 20 / selectedGameObject.transform.position.getDistance(tempVector.applyMatrix(camera.gameObject.transform.localToWorldMatrix));
                let rotationAngle = 0;

                if (hoveredName.indexOf("XYZE") >= 0) {
                    tempVector.copy(this._offsetEnd).subtract(this._offsetStart, tempVector).cross(this.eye).normalize();
                    rotationAxis.copy(tempVector);
                    rotationAngle = this._offsetEnd.subtract(this._offsetStart, this._offsetEnd).dot(tempVector.cross(this.eye)) * ROTATION_SPEED;
                }
                else if (hoveredName.indexOf("E") >= 0) {
                    tempVector.copy(this._offsetEnd).cross(this._offsetStart);
                    rotationAxis.copy(this.eye);
                    rotationAngle = this._offsetEnd.getAngle(this._offsetStart) * (tempVector.dot(this.eye) < 0 ? 1 : -1);
                }
                else {
                    const unit = this._dir[hoveredName];
                    const tempVector2 = egret3d.Vector3.create();
                    rotationAxis.copy(unit);

                    tempVector.copy(unit);
                    tempVector2.subtract(this._offsetStart, this._offsetEnd);
                    if (!isWorldSpace) {
                        tempVector.applyQuaternion(rotation);
                        tempVector2.applyQuaternion(currentSelectedPRS[4]);
                    }
                    rotationAngle = tempVector2.dot(tempVector.cross(this.eye).normalize()) * ROTATION_SPEED;
                    tempVector2.release();
                }

                for (const gameObject of modelComponent.selectedGameObjects) {

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    if (isWorldSpace) {
                        tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(selectedPRS[4]).normalize();
                        gameObject.transform.rotation = tempQuaternion;
                    }
                    else {
                        tempQuaternion.fromAxis(rotationAxis, rotationAngle).premultiply(selectedPRS[1]).normalize();
                        gameObject.transform.localRotation = tempQuaternion;
                    }
                }

                tempVector.release();
                rotationAxis.release();
                tempQuaternion.release();

                // TODO
                selectedGameObject.transform.localEulerAngles;
            }
            else if (this._mode === this.scale) {

                if (hoveredName.indexOf("XYZ") >= 0) {
                    let d = this._offsetEnd.length / this._offsetStart.length;

                    if (this._offsetEnd.dot(this._offsetStart) < 0.0) d *= -1.0;

                    this._offsetEnd.set(d, d, d);
                }
                else {
                    this._offsetEnd.divide(this._offsetStart);

                    if (hoveredName.indexOf("X") < 0) {
                        this._offsetEnd.x = 1.0;
                    }

                    if (hoveredName.indexOf("Y") < 0) {
                        this._offsetEnd.y = 1.0;
                    }

                    if (hoveredName.indexOf("Z") < 0) {
                        this._offsetEnd.z = 1.0;
                    }
                }

                // TODO this._offsetEnd scale aabb size

                const scale = egret3d.Vector3.create();

                for (const gameObject of modelComponent.selectedGameObjects) {
                    if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                        continue;
                    }

                    const selectedPRS = this._prsStarts[gameObject.uuid];
                    gameObject.transform.localScale = scale.multiply(this._offsetEnd, selectedPRS[2]);
                }

                scale.release();
            }
        }

        private _updateSelf() {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const camera = egret3d.Camera.editor;
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            const eye = this.eye.copy(camera.gameObject.transform.position);
            const eyeDistance = eye.getDistance(selectedGameObject.transform.position);

            if (camera.opvalue > 0.0) {
                eye.subtract(selectedGameObject.transform.position);
            }

            eye.normalize();

            const quaternion = isWorldSpace ? egret3d.Quaternion.IDENTITY : selectedGameObject.transform.rotation;
            this.gameObject.transform.position = selectedGameObject.transform.position;
            this.gameObject.transform.rotation = quaternion;
            this.gameObject.transform.scale = egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10.0).release();

            if (this._mode === this.rotate) {
                const tempQuaternion = quaternion.clone();
                const tempQuaternion2 = quaternion.clone();
                const alignVector = egret3d.Vector3.create();
                alignVector.copy(this.eye).applyQuaternion(tempQuaternion.inverse());

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.RIGHT, Math.atan2(alignVector.y, -alignVector.z));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisX = this.rotate.transform.find("AxisX")!;
                    const pickX = this.rotate.transform.find("X")!;
                    axisX.setRotation(tempQuaternion);
                    pickX.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.UP, Math.atan2(-alignVector.x, -alignVector.z));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisY = this.rotate.transform.find("AxisY")!;
                    const pickY = this.rotate.transform.find("Y")!;
                    axisY.setRotation(tempQuaternion);
                    pickY.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion.fromAxis(egret3d.Vector3.FORWARD, Math.atan2(-alignVector.x, alignVector.y));
                    tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                    const axisZ = this.rotate.transform.find("AxisZ")!;
                    const pickZ = this.rotate.transform.find("Z")!;
                    axisZ.setRotation(tempQuaternion);
                    pickZ.setRotation(tempQuaternion);
                }

                {
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    const axisE = this.rotate.transform.find("AxisE")!;
                    const pickE = this.rotate.transform.find("E")!;
                    axisE.setRotation(tempQuaternion2);
                    pickE.setRotation(tempQuaternion2);
                }

                {
                    tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                    const axisXYZE = this.rotate.transform.find("AxisXYZE")!;
                    axisXYZE.setRotation(tempQuaternion2);
                }

                tempQuaternion.release();
                tempQuaternion2.release();
                alignVector.release();
            }
        }

        private _updatePlane() {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : this.gameObject.transform.rotation;
            const unitX = egret3d.Vector3.RIGHT.clone().applyQuaternion(rotation);
            const unitY = egret3d.Vector3.UP.clone().applyQuaternion(rotation);
            const unitZ = egret3d.Vector3.FORWARD.clone().applyQuaternion(rotation);

            // Align the plane for current transform mode, axis and space.
            const alignVector = unitY.clone();
            const dirVector = egret3d.Vector3.create();

            if (this._hovered && this._mode !== this.rotate) {
                switch (this._hovered.name) {
                    case "X":
                        alignVector.cross(this.eye, unitX);
                        dirVector.cross(unitX, alignVector);
                        break;

                    case "Y":
                        alignVector.cross(this.eye, unitY);
                        dirVector.cross(unitY, alignVector);
                        break;

                    case "Z":
                        alignVector.cross(this.eye, unitZ);
                        dirVector.cross(unitZ, alignVector);
                        break;

                    case "XY":
                        dirVector.copy(unitZ);
                        break;

                    case "YZ":
                        dirVector.copy(unitX);
                        break;

                    case "ZX":
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

            unitX.release();
            unitY.release();
            unitZ.release();
            alignVector.release();
            dirVector.release();
        }

        public start(mousePosition: Readonly<egret3d.IVector3>) {
            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const raycastInfo = Helper.raycast(this._plane, mousePosition.x, mousePosition.y)!;
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
            this._offsetStart.subtract(currentSelectedPRS[3], raycastInfo.position);
            this._controlling = true;

            if (this._mode === this.scale) {
                isWorldSpace = false;
            }
            else {
                switch (hoveredName) {
                    case "E":
                    case "XYZ":
                    case "XYZE":
                        isWorldSpace = true;
                        break;
                }
            }

            if (!isWorldSpace) {
                this._offsetStart.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
            }
        }

        public end() {
            //
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            for (const gameObject of modelComponent.selectedGameObjects) {
                const transform = gameObject.transform;
                const currentPro = this._prsStarts[gameObject.uuid];
                if (this.mode === this.translate) {
                    modelComponent.changeProperty("localPosition", currentPro[0], transform.localPosition, transform);
                }
                else if (this.mode === this.scale) {
                    modelComponent.changeProperty("localScale", currentPro[2], transform.localScale, transform);
                }
                else if (this.mode === this.rotate) {
                    modelComponent.changeProperty("localEulerAngles", currentPro[6], transform.localEulerAngles, transform);
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

            this._hovered = value;

            if (this._hovered) {
                const highlights = this._highlights[this._hovered.uuid] || [this._hovered];
                for (const child of this._mode!.transform.children) {
                    if (!child.gameObject.renderer) {
                        continue;
                    }

                    const material = (child.gameObject.renderer as egret3d.MeshRenderer).material!;
                    if (highlights.indexOf(child.gameObject) >= 0) {
                        material.opacity = 1.0;
                    }
                    else {
                        material.opacity = 0.2;
                    }
                }
            }
            else {
                for (const child of this._mode!.transform.children) {
                    if (!child.gameObject.renderer) {
                        continue;
                    }

                    (child.gameObject.renderer as egret3d.MeshRenderer).material!.opacity = 0.8;
                }
            }
        }
    }
}