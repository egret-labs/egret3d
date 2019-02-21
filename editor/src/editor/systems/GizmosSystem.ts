namespace paper.editor {
    /**
     * @internal
     */
    export class GizmosSystem extends BaseSystem<GameObject> {
        private readonly _cameraDrawer: GameObject[] = [];
        private readonly _lightDrawer: GameObject[] = [];

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(false, egret3d.Transform, egret3d.Camera),
                Matcher.create<GameObject>(false, egret3d.Transform).anyOf(egret3d.DirectionalLight, egret3d.SpotLight, egret3d.PointLight, egret3d.HemisphereLight),
            ];
        }

        public onUpdate() {
            const editorScene = paper.Scene.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const cameraPosition = editorCamera.gameObject.transform.position;
            const groups = this.groups;
            const cameraEntities = groups[0].entities;
            const lightEntities = groups[1].entities;

            for (let i = 0, l = Math.max(this._cameraDrawer.length, cameraEntities.length); i < l; ++i) {
                if (i + 1 > this._cameraDrawer.length) {
                    const entity = EditorMeshHelper.createIcon(`Icon ${i}`, EditorDefaultTexture.CAMERA_ICON);
                    // gameObject.parent = this.gameObject;
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
                    const entity = EditorMeshHelper.createIcon(`Icon ${i}`, EditorDefaultTexture.LIGHT_ICON);
                    // gameObject.parent = this.gameObject;
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

        public onDisable() {
            this._cameraDrawer.length = 0;
            this._lightDrawer.length = 0;
        }
    }
}
