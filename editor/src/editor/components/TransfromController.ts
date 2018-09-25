namespace paper.debug {
    /**
     * @internal
     */
    export class TransfromController extends BaseComponent {
        public isWorldSpace: boolean = true;
        public readonly eye: egret3d.Vector3 = egret3d.Vector3.create();
        public readonly translate: GameObject = EditorMeshHelper.createGameObject("Translate");
        public readonly rotate: GameObject = EditorMeshHelper.createGameObject("Rotate");
        public readonly scale: GameObject = EditorMeshHelper.createGameObject("Scale");

        private _controlling: boolean = false;
        private readonly _positionStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _rotationStart: egret3d.Quaternion = egret3d.Quaternion.create();
        private readonly _scaleStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _localPositionStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _localRotationStart: egret3d.Quaternion = egret3d.Quaternion.create();
        private readonly _localScaleStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _offsetStart: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _offsetEnd: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _plane: egret3d.Plane = egret3d.Plane.create();
        private readonly _quad: GameObject = EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.QUAD, egret3d.DefaultMaterials.MESH_BASIC_DOUBLESIDE.clone().setBlend(gltf.BlendMode.Blend).setOpacity(0.5));
        private readonly _highlights: { [key: string]: GameObject[] } = {};
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
                const pickXY = EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);
                const pickYZ = EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);
                const pickZX = EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);

                this._highlights[pickX.uuid] = [axisX, arrowX];
                this._highlights[pickY.uuid] = [axisY, arrowY];
                this._highlights[pickZ.uuid] = [axisZ, arrowZ];

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

                (axisX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (arrowX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (arrowY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (arrowZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (pickX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (pickXY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.YELLOW);
                (pickYZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.INDIGO);
                (pickZX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.PURPLE);
            }

            { // Rotate.
                const rotate = this.rotate;
                const axisX = EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisY = EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisZ = EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.createCircle(1.0, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisE = EditorMeshHelper.createGameObject("AxisE", egret3d.DefaultMeshes.createCircle(1.25, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const axisB = EditorMeshHelper.createGameObject("AxisB", egret3d.DefaultMeshes.createCircle(1.0, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickX = EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickY = EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickZ = EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.createTorus(1.0, 0.1, 4, 12, 0.5), egret3d.DefaultMaterials.MESH_BASIC.clone());
                const pickE = EditorMeshHelper.createGameObject("E", egret3d.DefaultMeshes.createTorus(1.25, 0.1, 4, 24, 1.0), egret3d.DefaultMaterials.MESH_BASIC.clone());

                this._highlights[pickX.uuid] = [axisX];
                this._highlights[pickY.uuid] = [axisY];
                this._highlights[pickZ.uuid] = [axisZ];
                this._highlights[pickE.uuid] = [axisE];

                rotate.transform.setParent(this.gameObject.transform);
                axisX.transform.setParent(rotate.transform);
                axisY.transform.setParent(rotate.transform);
                axisZ.transform.setParent(rotate.transform);
                axisE.transform.setParent(rotate.transform);
                axisB.transform.setParent(rotate.transform);
                pickX.transform.setParent(rotate.transform).setLocalEuler(0.0, -Math.PI * 0.5, -Math.PI * 0.5).gameObject.activeSelf = false;
                pickY.transform.setParent(rotate.transform).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).gameObject.activeSelf = false;
                pickZ.transform.setParent(rotate.transform).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).gameObject.activeSelf = false;
                pickE.transform.setParent(rotate.transform).gameObject.activeSelf = false;

                (axisX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (axisE.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.YELLOW);
                (axisB.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay - 1).setColor(egret3d.Color.GRAY);
                (pickX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (pickE.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.YELLOW);
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
                const pickXY = EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);
                const pickYZ = EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);
                const pickZX = EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), paper.DefaultTags.Untagged);

                this._highlights[pickX.uuid] = [axisX, arrowX];
                this._highlights[pickY.uuid] = [axisY, arrowY];
                this._highlights[pickZ.uuid] = [axisZ, arrowZ];

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

                (axisX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (axisY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (axisZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (arrowX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (arrowY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (arrowZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (pickX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.RED);
                (pickY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.GREEN);
                (pickZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.BLUE);
                (pickXY.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.YELLOW);
                (pickYZ.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.INDIGO);
                (pickZX.renderer as egret3d.MeshRenderer).material.setOpacity(0.8).setDepth(false, false).setBlend(gltf.BlendMode.Blend).setRenderQueue(paper.RenderQueue.Overlay).setColor(egret3d.Color.PURPLE);
            }

            this.mode = this.translate;
            this._quad.parent = this.gameObject;
            // this._quad.activeSelf = false;
        }

        private _updateTransform(selected: GameObject, mousePosition: Readonly<egret3d.IVector3>) {
            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const raycastInfo = Helper.raycastB(this._plane, mousePosition.x, mousePosition.y)!;
            this._offsetEnd.subtract(this._positionStart, raycastInfo.position);

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
                this._offsetEnd.applyQuaternion(this._rotationStart.clone().inverse().release());
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

                if (isWorldSpace) {
                    this._offsetEnd.subtract(this._offsetStart, this._offsetEnd);
                }
                else {
                    this._offsetEnd.subtract(this._offsetStart, this._offsetEnd).applyQuaternion(this._localRotationStart);
                }

                this._offsetEnd.add(this._localPositionStart);

                // TODO translationSnap

                selected.transform.localPosition = this._offsetEnd;
            }
            else if (this._mode === this.rotate) {
                // const camera = egret3d.Camera.editor;
                // const tempVector = egret3d.Vector3.create();
                // const rotationAxis = egret3d.Vector3.create();
                // const tempQuaternion = egret3d.Quaternion.create();
                // const unit = egret3d.Vector3.create();
                // const ROTATION_SPEED = 20 / this._selectedWorldPostion.getDistance(tempVector.applyMatrix(camera.gameObject.transform.getWorldMatrix()));
                // let rotationAngle = 0;
                // if (hovered.name === "E") {
                //     tempVector.copy(this._endPoint).cross(this._startPoint);
                //     rotationAxis.copy(this._eye);
                //     rotationAngle = this._endPoint.getAngle(this._startPoint) * (tempVector.dot(this._eye) < 0 ? 1 : -1);
                // }
                // else {
                //     switch (hovered.name) {
                //         case "X":
                //             unit.copy(egret3d.Vector3.RIGHT);
                //             break;

                //         case "Y":
                //             unit.copy(egret3d.Vector3.UP);
                //             break;

                //         case "Z":
                //             unit.copy(egret3d.Vector3.FORWARD);
                //             break;
                //     }

                //     rotationAxis.copy(unit);

                //     this._endPoint.subtract(this._startPoint, this._endPoint);
                //     rotationAngle = this._endPoint.dot(unit.cross(this._eye).normalize()) * ROTATION_SPEED;
                // }

                // tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(this._startWorldQuaternion);
                // selected.transform.setRotation(tempQuaternion);

                // tempVector.release();
                // rotationAxis.release();
                // tempQuaternion.release();
                // unit.release();

                // TODO
                selected.transform.localEulerAngles;
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

                selected.transform.localScale = this._offsetEnd.multiply(this._localScaleStart);
            }
        }

        private _updateSelf(selected: GameObject) {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const camera = egret3d.Camera.editor;
            const eye = this.eye.copy(camera.transform.position);
            const eyeDistance = eye.getDistance(selected.transform.position);

            if (camera.opvalue > 0.0) {
                eye.subtract(selected.transform.position, eye);
            }

            eye.normalize();

            this.transform.position = selected.transform.position;
            this.transform.rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : selected.transform.rotation;
            this.transform.scale = egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10.0).release();

            if (this._mode === this.scale) {
                // const quaternion = egret3d.Quaternion.IDENTITY;//TODO local

                // const tempQuaternion = quaternion.clone();
                // const tempQuaternion2 = egret3d.Quaternion.create();
                // const alignVector = this._eye.clone();
                // alignVector.applyQuaternion(tempQuaternion.inverse());
                // {
                //     const axisE = rotateObj.find("axisE");
                //     const pickE = rotateObj.find("E");
                //     tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this._eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                //     axisE.setRotation(tempQuaternion2);
                //     pickE.setRotation(tempQuaternion2);
                // }
                // {
                //     const axisX = rotateObj.find("axisX");
                //     tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.RIGHT, Math.atan2(-alignVector.y, alignVector.z));
                //     tempQuaternion2.multiply(quaternion);
                //     axisX.setRotation(tempQuaternion2);
                // }

                // {
                //     const axisY = rotateObj.find("axisY");
                //     tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.UP, Math.atan2(alignVector.x, alignVector.z));
                //     tempQuaternion2.multiply(quaternion);
                //     axisY.setRotation(tempQuaternion2);
                // }

                // {
                //     const axisZ = rotateObj.find("axisZ");
                //     tempQuaternion2.copy(tempQuaternion).fromAxis(egret3d.Vector3.FORWARD, Math.atan2(alignVector.y, alignVector.x));
                //     tempQuaternion2.multiply(quaternion);
                //     axisZ.setRotation(tempQuaternion2);
                // }
                // tempQuaternion.release();
                // tempQuaternion2.release();
                // alignVector.release();
            }
        }

        private _updatePlane() {
            const isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
            const rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : this.transform.rotation;
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
                this._quad.transform.rotation = egret3d.Camera.editor.transform.rotation;
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

        public start(selected: GameObject, mousePosition: Readonly<egret3d.IVector3>) {
            let isWorldSpace = this.isWorldSpace;
            const hoveredName = this._hovered!.name;
            const raycastInfo = Helper.raycastB(this._plane, mousePosition.x, mousePosition.y)!;
            selected.transform.worldMatrix.decompose(this._positionStart, this._rotationStart, this._scaleStart);
            this._localPositionStart.copy(selected.transform.localPosition);
            this._localRotationStart.copy(selected.transform.localRotation);
            this._localScaleStart.copy(selected.transform.localScale);
            this._offsetStart.subtract(this._positionStart, raycastInfo.position);
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
                this._offsetStart.applyQuaternion(this._rotationStart.clone().inverse().release());
            }
        }

        public end() {
            this._controlling = false;
        }

        public update(selected: GameObject, mousePosition: Readonly<egret3d.IVector3>) {
            if (this._hovered && this._controlling) {
                this._updateTransform(selected, mousePosition);
            }

            this._updateSelf(selected);
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
                for (const child of this._mode.transform.children) {
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
                for (const child of this._mode.transform.children) {
                    if (!child.gameObject.renderer) {
                        continue;
                    }

                    (child.gameObject.renderer as egret3d.MeshRenderer).material!.opacity = 0.8;
                }
            }
        }
    }
}