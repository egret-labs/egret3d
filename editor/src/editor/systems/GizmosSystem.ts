namespace paper.editor {

    const enum GroupIndex {
        Container,
        TouchContainer,
        Hovered,
        Selected,
        Cameras,
        Lights,
        Skeleton,
        BoxCollider,
        SphereCollider,
        CylinderCollider,
    }
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

        private _hoverBox: GameObject | null = null;
        private _skeletonDrawer: GameObject | null = null;

        private _updateBoxes() {
            const groups = this.groups;
            const containerEntity = groups[GroupIndex.Container].singleEntity;
            const selectedEntities = groups[GroupIndex.Selected].entities;

            const hoverBox = this._hoverBox!;
            const hoveredEntity = groups[GroupIndex.Hovered].singleEntity;

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
            const cameraEntities = groups[GroupIndex.Cameras].entities;

            const editorScene = paper.Scene.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const cameraPosition = editorCamera.gameObject.transform.position;

            for (let i = 0, l = Math.max(this._cameraDrawer.length, cameraEntities.length); i < l; ++i) {
                if (i + 1 > this._cameraDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Camera Icon ${i}`, EditorDefaultTexture.CAMERA_ICON);
                    entity.parent = touchContainerEntity;
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
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = entity;
                    }
                    else {
                        drawer.enabled = false;
                    }
                }
            }

            const lightEntities = groups[GroupIndex.Lights].entities;

            for (let i = 0, l = Math.max(this._lightDrawer.length, lightEntities.length); i < l; ++i) {
                if (i + 1 > this._lightDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Light Icon ${i}`, EditorDefaultTexture.LIGHT_ICON);
                    entity.parent = touchContainerEntity;
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
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = entity;
                    }
                    else {
                        drawer.enabled = false;
                    }
                }
            }
        }

        private _updateSkeleton() {
            const skeletonEntity = this.groups[GroupIndex.Skeleton].singleEntity;
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
            const containerEntity = groups[GroupIndex.Container].singleEntity;

            const boxColliderEntities = groups[GroupIndex.BoxCollider].entities;
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

            const sphereColliderEntities = groups[GroupIndex.SphereCollider].entities;
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

            const cylinderColliderEntities = groups[GroupIndex.CylinderCollider].entities;
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
                Matcher.create<GameObject>(false, egret3d.Transform, ContainerEntityFlag),
                Matcher.create<GameObject>(false, egret3d.Transform, TouchContainerEntityFlag),
                Matcher.create<GameObject>(egret3d.Transform, HoveredFlag)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(egret3d.Transform, SelectedFlag)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(false, egret3d.Transform, egret3d.Camera),
                Matcher.create<GameObject>(false, egret3d.Transform)
                    .anyOf(egret3d.DirectionalLight, egret3d.SpotLight, egret3d.PointLight, egret3d.HemisphereLight),
                Matcher.create<GameObject>(egret3d.Transform, egret3d.SkinnedMeshRenderer, LastSelectedFlag),
                Matcher.create<GameObject>(egret3d.Transform, egret3d.BoxCollider, SelectedFlag),
                Matcher.create<GameObject>(egret3d.Transform, egret3d.SphereCollider, SelectedFlag),
                Matcher.create<GameObject>(egret3d.Transform, egret3d.CylinderCollider, SelectedFlag),
            ];
        }

        public onEnable() {
            this._hoverBox = EditorMeshHelper.createBox("Hover Box", egret3d.Color.WHITE, 0.6);
            this._skeletonDrawer = EditorMeshHelper.createGameObject("Skeleton Drawer");

            {
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
            this._selectedBoxDrawer.length = 0;
            this._cameraDrawer.length = 0;
            this._lightDrawer.length = 0;
            this._boxColliderDrawer.length = 0;
            this._sphereColliderDrawer.length = 0;
            this._cylinderColliderDrawer.length = 0;
            this._hoverBox = null;
            this._skeletonDrawer = null;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            if (group === this.groups[GroupIndex.Container]) {
                this._hoverBox!.transform.parent = entity.transform;
                this._skeletonDrawer!.transform.parent = entity.transform;
            }
        }

        public onFrame() {
            this._updateBoxes();
            this._updateCameraAndLights();
            this._updateSkeleton();
            this._updateCollider();
        }
    }
}
