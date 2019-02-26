namespace paper.editor {

    const enum GroupIndex {
        GizmosContainer,
        TouchContainer,
        LastSelectedTransform,

        TransformController,
        HoveredBox,
        SelectedBoxes,
        Gird,
        AllCameras,
        AllLights,
        LastSelectedCamera,
        LastSelectedSkeleton,
        SelectedBoxColliders,
        SelectedSphereColliders,
        SelectedCylinderColliders,
    }

    const _girdStep = 5;
    /**
     * @internal
     */
    export class GizmosSystem extends BaseSystem<GameObject> {
        private readonly _selectedBoxDrawer: GameObject[] = [];
        private readonly _cameraDrawer: GameObject[] = [];
        private readonly _lightDrawer: GameObject[] = [];
        private readonly _boxColliderDrawer: GameObject[] = [];
        private readonly _sphereColliderDrawer: GameObject[] = [];
        private readonly _cylinderColliderDrawer: GameObject[] = [];

        private _gridA: GameObject | null = null;
        private _gridB: GameObject | null = null;
        private _hoverBox: GameObject | null = null;
        private _skeletonDrawer: GameObject | null = null;
        private _cameraViewFrustum: GameObject | null = null; // TODO封装一下

        private _createGrid(name: string, size: number = 100.0, divisions: number = 100) {
            const step = size / divisions;
            const halfSize = size / 2;
            const vertices: number[] = [];

            for (let i = 0, k = - halfSize; i <= divisions; i++ , k += step) {
                vertices.push(- halfSize, 0, k);
                vertices.push(halfSize, 0, k);
                vertices.push(k, 0, - halfSize);
                vertices.push(k, 0, halfSize);
            }

            const mesh = egret3d.Mesh.create(vertices.length, 0, [gltf.AttributeSemantics.POSITION]);
            mesh.name = "editor/grid.mesh.bin";

            mesh.setAttributes(gltf.AttributeSemantics.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
            const gameObject = EditorMeshHelper.createGameObject(name, mesh, egret3d.DefaultMaterials.MESH_BASIC.clone());

            return gameObject;
        }

        private _updateTransformController(): any {
            const transformController = this.groups[GroupIndex.TransformController].singleEntity!.getComponent(TransformController)!;

            if (transformController.isActiveAndEnabled) {
                transformController.update(egret3d.inputCollecter.defaultPointer.position);
            }
        }

        private _updateGrid() {
            const camera = egret3d.Camera.editor;
            const aaa = camera.gameObject.getComponent(OrbitControls)!;
            const target = aaa.lookAtPoint.clone().add(aaa.lookAtOffset);
            const eyeDistance = (10000.0 - target.getDistance(camera.gameObject.transform.position)) * 0.01; // TODO

            const d = (eyeDistance % 1.0);
            const s = d * (_girdStep - 1) + 1.0;

            this._gridA!.transform.setLocalScale(s * _girdStep, 0.0, s * _girdStep);
            this._gridB!.transform.setLocalScale(s, 0.0, s);

            const mA = (this._gridA!.renderer as egret3d.MeshRenderer).material!;
            const mB = (this._gridB!.renderer as egret3d.MeshRenderer).material!;

            mA.opacity = 1.0 * 0.2;
            mB.opacity = 0.2 * 0.2;
        }

        private _updateBoxes() {
            const groups = this.groups;
            const containerEntity = groups[GroupIndex.GizmosContainer].singleEntity;
            const selectedEntities = groups[GroupIndex.SelectedBoxes].entities;

            const hoverBox = this._hoverBox!;
            const hoveredEntity = groups[GroupIndex.HoveredBox].singleEntity;

            if (hoveredEntity) {
                const renderer = hoveredEntity.renderer!;
                const boundingTransform = renderer.getBoundingTransform();
                hoverBox.enabled = true;
                hoverBox.transform.localPosition.applyMatrix(boundingTransform.localToWorldMatrix, renderer.localBoundingBox.center).update();
                hoverBox.transform.localRotation = boundingTransform.rotation;
                hoverBox.transform.localScale.multiply(renderer.localBoundingBox.size, boundingTransform.scale).update();
            }
            else {
                hoverBox.enabled = false;
            }

            for (let i = 0, l = Math.max(this._selectedBoxDrawer.length, selectedEntities.length); i < l; ++i) {
                if (i + 1 > this._selectedBoxDrawer.length) {
                    const entity = EditorMeshHelper.createBox(`Box ${i}`, egret3d.Color.INDIGO, 0.8);
                    entity.parent = containerEntity;
                    this._selectedBoxDrawer.push(entity);
                }

                const drawer = this._selectedBoxDrawer[i];

                if (i + 1 > selectedEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = selectedEntities[i];
                    const renderer = entity.renderer!;
                    const boundingTransform = renderer.getBoundingTransform();
                    drawer.enabled = true;
                    drawer.transform.localPosition.applyMatrix(boundingTransform.localToWorldMatrix, renderer.localBoundingBox.center).update();
                    drawer.transform.localRotation = boundingTransform.rotation;
                    drawer.transform.localScale.multiply(renderer.localBoundingBox.size, boundingTransform.scale).update();
                }
            }
        }

        private _updateCameraAndLights() {
            const groups = this.groups;
            const touchContainerEntity = groups[GroupIndex.TouchContainer].singleEntity!;
            const cameraEntities = groups[GroupIndex.AllCameras].entities;

            const editorScene = paper.Scene.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const cameraPosition = editorCamera.gameObject.transform.position;

            for (let i = 0, l = Math.max(this._cameraDrawer.length, cameraEntities.length); i < l; ++i) {
                if (i + 1 > this._cameraDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Camera Icon ${i}`, EditorDefaultTexture.CAMERA_ICON);
                    entity.parent = touchContainerEntity;
                    entity.addComponent(PickedFlag);
                    this._cameraDrawer.push(entity);
                }

                const drawer = this._cameraDrawer[i];

                if (i + 1 > cameraEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = cameraEntities[i];

                    if (entity && entity.scene !== editorScene) {
                        drawer.enabled = true;

                        const eyeDistance = cameraPosition.getDistance(entity.transform.position);
                        drawer.transform.localPosition = entity.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(PickedFlag)!.target = entity;
                    }
                    else {
                        drawer.enabled = false;
                    }
                }
            }

            const lightEntities = groups[GroupIndex.AllLights].entities;

            for (let i = 0, l = Math.max(this._lightDrawer.length, lightEntities.length); i < l; ++i) {
                if (i + 1 > this._lightDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Light Icon ${i}`, EditorDefaultTexture.LIGHT_ICON);
                    entity.parent = touchContainerEntity;
                    entity.addComponent(PickedFlag);
                    this._lightDrawer.push(entity);
                }

                const drawer = this._lightDrawer[i];

                if (i + 1 > lightEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = lightEntities[i];

                    if (entity && entity.scene !== editorScene) {
                        drawer.enabled = true;

                        const eyeDistance = cameraPosition.getDistance(entity.transform.position);
                        drawer.transform.localPosition = entity.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(PickedFlag)!.target = entity;
                    }
                    else {
                        drawer.enabled = false;
                    }
                }
            }
        }

        private _updateCamera() {
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
            const selectedCameraEntity = this.groups[GroupIndex.LastSelectedCamera].singleEntity;

            if (selectedCameraEntity) {
                cameraViewFrustum.enabled = true;
                const selectedCamera = selectedCameraEntity.getComponent(egret3d.Camera)!;
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
            else {
                cameraViewFrustum.enabled = false;
            }
        }

        private _updateSkeleton() {
            const skeletonEntity = this.groups[GroupIndex.LastSelectedSkeleton].singleEntity;
            const skeletonDrawer = this._skeletonDrawer!;

            if (skeletonEntity) {
                let offset = 0;
                const mesh = skeletonDrawer.getComponent(egret3d.MeshFilter)!.mesh!;
                const helpVertex3A = egret3d.Vector3.create().release();
                const helpVertex3B = egret3d.Vector3.create().release();
                const vertices = mesh.getVertices()!;
                const bones = (skeletonEntity.renderer as egret3d.SkinnedMeshRenderer).bones;

                skeletonDrawer.enabled = true;
                skeletonDrawer.transform.localPosition = skeletonEntity.transform.position;
                //
                const worldToLocalMatrix = skeletonDrawer.transform.worldToLocalMatrix;

                for (let i = 0, l = vertices.length; i < l; ++i) {
                    vertices[i] = 0.0;
                }

                for (const bone of bones) {
                    if (bone) {
                        if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.parent.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset + 3);
                        }
                        else {
                            bone.getForward(helpVertex3B).applyDirection(worldToLocalMatrix).multiplyScalar(0.1); // Bone length.
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset);
                            helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
                        }
                    }

                    offset += 6;
                }

                mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
            }
            else {
                skeletonDrawer.enabled = false;
            }
        }

        private _updateCollider() {
            const groups = this.groups;
            const containerEntity = groups[GroupIndex.GizmosContainer].singleEntity;

            const boxColliderEntities = groups[GroupIndex.SelectedBoxColliders].entities;
            const boxColliderDrawer = this._boxColliderDrawer;

            for (let i = 0, l = Math.max(boxColliderDrawer.length, boxColliderEntities.length); i < l; ++i) {
                if (i + 1 > boxColliderDrawer.length) {
                    const entity = EditorMeshHelper.createBox(`Box Collider ${i}`, egret3d.Color.YELLOW, 0.4);
                    entity.parent = containerEntity;
                    boxColliderDrawer.push(entity);
                }

                const drawer = boxColliderDrawer[i];

                if (!boxColliderEntities || i + 1 > boxColliderEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = boxColliderEntities[i];
                    const boxCollider = entity.getComponent(egret3d.BoxCollider)!;

                    drawer.enabled = true;
                    drawer.transform.localPosition.applyMatrix(entity.transform.localToWorldMatrix, boxCollider.box.center).update();
                    drawer.transform.localRotation = entity.transform.rotation;
                    drawer.transform.localScale.multiply(boxCollider.box.size, entity.transform.scale).update();
                }
            }

            const sphereColliderEntities = groups[GroupIndex.SelectedSphereColliders].entities;
            const sphereColliderDrawer = this._sphereColliderDrawer;

            for (let i = 0, l = Math.max(sphereColliderDrawer.length, sphereColliderEntities.length); i < l; ++i) {
                if (i + 1 > sphereColliderDrawer.length) {
                    const gameObject = EditorMeshHelper.createGameObject(`SphereCollider ${i}`);
                    gameObject.parent = containerEntity;
                    EditorMeshHelper.createCircle("AxisX", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform);
                    EditorMeshHelper.createCircle("AxisY", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                    EditorMeshHelper.createCircle("AxisZ", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform).setLocalEuler(0.0, Math.PI * 0.5, 0.0);

                    sphereColliderDrawer.push(gameObject);
                }

                const drawer = sphereColliderDrawer[i];

                if (!sphereColliderEntities || i + 1 > sphereColliderEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = boxColliderEntities[i];
                    const sphereCollider = entity.getComponent(egret3d.SphereCollider)!;

                    drawer.enabled = true;
                    drawer.transform.localPosition.applyMatrix(entity.transform.localToWorldMatrix, sphereCollider.sphere.center).update();
                    drawer.transform.localRotation = entity.transform.rotation;
                    drawer.transform.localScale.multiplyScalar(sphereCollider.sphere.radius * 2, entity.transform.scale).update();
                }
            }

            const cylinderColliderEntities = groups[GroupIndex.SelectedCylinderColliders].entities;
            const cylinderColliderDrawer = this._cylinderColliderDrawer;

            for (let i = 0, l = Math.max(cylinderColliderDrawer.length, cylinderColliderEntities.length); i < l; ++i) {
                if (i + 1 > cylinderColliderDrawer.length) {
                    const gameObject = EditorMeshHelper.createGameObject(`Cylinder Collider ${i}`);
                    gameObject.parent = containerEntity;
                    EditorMeshHelper.createCircle("Top", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, 0.5, 0.0).setLocalEuler(Math.PI * 0.5, 0.0, 0.0);
                    EditorMeshHelper.createLine("Height", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0);
                    EditorMeshHelper.createCircle("Bottom", egret3d.Color.YELLOW, 0.4).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0).setLocalEuler(-Math.PI * 0.5, 0.0, 0.0);

                    cylinderColliderDrawer.push(gameObject);
                }

                const drawer = cylinderColliderDrawer[i];

                if (!cylinderColliderEntities || i + 1 > cylinderColliderEntities.length) {
                    drawer.enabled = false;
                }
                else {
                    const entity = boxColliderEntities[i];
                    const cylinderCollider = entity.getComponent(egret3d.CylinderCollider)!;

                    drawer.transform.localPosition.applyMatrix(entity.transform.localToWorldMatrix, cylinderCollider.center).update();
                    drawer.transform.localRotation = entity!.transform.rotation;
                    drawer.transform.find("Top")!.transform.setLocalScale(cylinderCollider.topRadius * 2.0);
                    drawer.transform.find("Bottom")!.transform.setLocalScale(cylinderCollider.bottomRadius * 2.0);
                    drawer.transform.localScale.set(1.0, cylinderCollider.height, 1.0).multiply(entity.transform.scale).update();

                }
            }
        }

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(false, egret3d.Transform, GizmosContainerFlag),
                Matcher.create<GameObject>(false, egret3d.Transform, TouchContainerFlag),
                Matcher.create<GameObject>(egret3d.Transform, LastSelectedFlag), // Last selected transform

                Matcher.create<GameObject>(false, egret3d.Transform, TransformController),
                Matcher.create<GameObject>(egret3d.Transform, HoveredFlag) // Hovered box
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, SelectedFlag) // Selected boxes
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, GridFlag), // Grid
                Matcher.create<GameObject>(false, egret3d.Transform, egret3d.Camera), // All cameras
                Matcher.create<GameObject>(false, egret3d.Transform) // All lights
                    .anyOf(egret3d.DirectionalLight, egret3d.SpotLight, egret3d.PointLight, egret3d.HemisphereLight),
                Matcher.create<GameObject>(false, egret3d.Transform, egret3d.Camera, LastSelectedFlag), // Last selected camera
                Matcher.create<GameObject>(egret3d.Transform, egret3d.SkinnedMeshRenderer, LastSelectedFlag), // Last selected skeleton
                Matcher.create<GameObject>(egret3d.Transform, egret3d.BoxCollider, SelectedFlag), // Selected box colliders
                Matcher.create<GameObject>(egret3d.Transform, egret3d.SphereCollider, SelectedFlag), // Selected sphere colliders
                Matcher.create<GameObject>(egret3d.Transform, egret3d.CylinderCollider, SelectedFlag), // Selected cylinder colliders
            ];
        }

        public onEnable() {
            this._gridA = this._createGrid("Grid A");
            this._gridB = this._createGrid("Grid B", 100.0 * _girdStep, 100 * _girdStep);
            this._hoverBox = EditorMeshHelper.createBox("Hover Box", egret3d.Color.WHITE, 0.6);
            this._skeletonDrawer = EditorMeshHelper.createGameObject("Skeleton Drawer");
            this._cameraViewFrustum = EditorMeshHelper.createCameraWireframed("Camera Wire Frame");
            this._cameraViewFrustum.enabled = false;

            { //
                const drawer = this._skeletonDrawer;
                const mesh = egret3d.Mesh.create(1024, 0, [gltf.AttributeSemantics.POSITION]);
                const material = egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED);
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                mesh.drawMode = gltf.DrawMode.Dynamic;
                material
                    .setColor(egret3d.Color.YELLOW)
                    .setDepth(false, false)
                    .renderQueue = RenderQueue.Overlay;

                drawer.addComponent(egret3d.MeshFilter).mesh = mesh;
                drawer.addComponent(egret3d.MeshRenderer).material = material;
            }
        }

        public onDisable() {
            this._cameraViewFrustum!.destroy();

            this._selectedBoxDrawer.length = 0;
            this._cameraDrawer.length = 0;
            this._lightDrawer.length = 0;
            this._boxColliderDrawer.length = 0;
            this._sphereColliderDrawer.length = 0;
            this._cylinderColliderDrawer.length = 0;
            this._hoverBox = null;
            this._skeletonDrawer = null;
            this._cameraViewFrustum = null;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[GroupIndex.Gird]) {
                this._gridA!.parent = entity;
                this._gridB!.parent = entity;

                const mA = (this._gridA!.renderer as egret3d.MeshRenderer).material!;
                const mB = (this._gridB!.renderer as egret3d.MeshRenderer).material!;

                mA.setBlend(gltf.BlendMode.Blend, RenderQueue.Transparent);
                mB.setBlend(gltf.BlendMode.Blend, RenderQueue.Transparent);
            }
            else if (group === groups[GroupIndex.GizmosContainer]) {
                this._hoverBox!.transform.parent = entity.transform;
                this._skeletonDrawer!.transform.parent = entity.transform;
            }
            else if (group === groups[GroupIndex.LastSelectedTransform]) {
                if (this.enabled) {
                    groups[GroupIndex.TransformController].singleEntity!.enabled = true;
                }
            }
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[GroupIndex.LastSelectedTransform]) {
                if (this.enabled) {
                    groups[GroupIndex.TransformController].singleEntity!.enabled = false;
                }
            }
        }

        public onFrame() {
            this._updateTransformController();
            this._updateBoxes();
            this._updateCameraAndLights();
            this._updateCamera();
            this._updateSkeleton();
            this._updateCollider();
            this._updateGrid();
        }
    }
}
