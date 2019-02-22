namespace paper.editor {

    const enum GroupIndex {
        Container,
        TouchContainer,
        Hovered,
        Cameras,
        Lights,
        SkinnedMeshRenderer,
    }
    /**
     * @internal
     */
    export class GizmosSystem extends BaseSystem<GameObject> {
        private readonly _hoverBox: GameObject = EditorMeshHelper.createBox("Hover Box", egret3d.Color.WHITE, 0.6);
        private readonly _cameraDrawer: GameObject[] = [];
        private readonly _lightDrawer: GameObject[] = [];

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(false, egret3d.Transform, ContainerEntityFlag),
                Matcher.create<GameObject>(false, egret3d.Transform, TouchContainerEntityFlag),
                Matcher.create<GameObject>(egret3d.Transform, HoveredFlag)
                    .anyOf(egret3d.MeshRenderer, egret3d.SkinnedMeshRenderer, egret3d.particle.ParticleRenderer),
                Matcher.create<GameObject>(false, egret3d.Transform, egret3d.Camera),
                Matcher.create<GameObject>(false, egret3d.Transform)
                    .anyOf(egret3d.DirectionalLight, egret3d.SpotLight, egret3d.PointLight, egret3d.HemisphereLight),
                Matcher.create<GameObject>(egret3d.Transform, egret3d.SkinnedMeshRenderer),
            ];
        }

        public onDisable() {
            this._cameraDrawer.length = 0;
            this._lightDrawer.length = 0;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            if (group === this.groups[GroupIndex.Container]) {
                this._hoverBox.transform.parent = entity.transform;
            }
        }

        public onFrame() {
            const editorScene = paper.Scene.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const cameraPosition = editorCamera.gameObject.transform.position;
            const groups = this.groups;
            const containerEntity = groups[GroupIndex.Container].singleEntity;
            const touchContainerEntity = groups[GroupIndex.TouchContainer].singleEntity;
            const hoveredEntity = groups[GroupIndex.Hovered].singleEntity;
            const cameraEntities = groups[GroupIndex.Cameras].entities;
            const lightEntities = groups[GroupIndex.Lights].entities;

            if (hoveredEntity) {
                const renderer = hoveredEntity.renderer!;
                const boundingTransform = renderer.getBoundingTransform();
                this._hoverBox.activeSelf = true;
                this._hoverBox.transform.localPosition.applyMatrix(boundingTransform.localToWorldMatrix, renderer.localBoundingBox.center).update();
                this._hoverBox.transform.localRotation = boundingTransform.rotation;
                this._hoverBox.transform.localScale.multiply(renderer.localBoundingBox.size, boundingTransform.scale).update();
            }
            else {
                this._hoverBox.activeSelf = false;
            }

            for (let i = 0, l = Math.max(this._cameraDrawer.length, cameraEntities.length); i < l; ++i) {
                if (i + 1 > this._cameraDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Camera Icon ${i}`, EditorDefaultTexture.CAMERA_ICON);
                    entity.parent = touchContainerEntity;
                    this._cameraDrawer.push(entity);
                }

                const drawer = this._cameraDrawer[i];

                if (i + 1 > cameraEntities.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const entity = cameraEntities[i];

                    if (entity && !entity.isDestroyed && entity.scene !== editorScene) {
                        drawer.activeSelf = true;

                        const eyeDistance = cameraPosition.getDistance(entity.transform.position);
                        drawer.transform.localPosition = entity.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = entity;
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }

            for (let i = 0, l = Math.max(this._lightDrawer.length, lightEntities.length); i < l; ++i) {
                if (i + 1 > this._lightDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Light Icon ${i}`, EditorDefaultTexture.LIGHT_ICON);
                    entity.parent = touchContainerEntity;
                    this._lightDrawer.push(entity);
                }

                const drawer = this._lightDrawer[i];

                if (i + 1 > lightEntities.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const entity = lightEntities[i];

                    if (entity && !entity.isDestroyed && entity.scene !== editorScene) {
                        drawer.activeSelf = true;

                        const eyeDistance = cameraPosition.getDistance(entity.transform.position);
                        drawer.transform.localPosition = entity.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = entity;
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }
        }
    }
}
