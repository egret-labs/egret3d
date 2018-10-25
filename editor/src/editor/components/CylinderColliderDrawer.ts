namespace paper.editor {
    /**
     * @internal
     */
    export class CylinderColliderDrawer extends BaseSelectedGOComponent {
        private readonly _drawer: GameObject[] = [];

        public initialize() {
            super.initialize();
        }

        public update() {
            const selectedGameObject = super.update();
            const colliders = selectedGameObject ? selectedGameObject.getComponents(egret3d.CylinderCollider) : null;

            for (let i = 0, l = Math.max(this._drawer.length, colliders ? colliders.length : 0); i < l; ++i) {
                if (i + 1 > this._drawer.length) {
                    const gameObject = EditorMeshHelper.createGameObject(`CylinderCollider_${i}`);
                    gameObject.parent = this.gameObject;
                    EditorMeshHelper.createCircle("Top", egret3d.Color.YELLOW, 0.4, Scene.editorScene).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, 0.5, 0.0).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                    EditorMeshHelper.createLine("Height", egret3d.Color.YELLOW, 0.4, Scene.editorScene).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0);
                    EditorMeshHelper.createCircle("Bottom", egret3d.Color.YELLOW, 0.4, Scene.editorScene).transform
                        .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0).setLocalEuler(0.0, 0.0, -Math.PI * 0.5);

                    this._drawer.push(gameObject);
                }

                const drawer = this._drawer[i];

                if (!colliders || i + 1 > colliders.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const collider = colliders[i];
                    if (collider.enabled) {
                        drawer.activeSelf = true;
                        drawer.transform.localPosition = egret3d.Vector3.create().copy(collider.center).applyMatrix(selectedGameObject!.transform.worldMatrix).release();
                        drawer.transform.localRotation = selectedGameObject!.transform.rotation;
                        drawer.transform.find("Top")!.transform.setLocalScale(collider.topRadius * 2.0);
                        drawer.transform.find("Bottom")!.transform.setLocalScale(collider.bottomRadius * 2.0);
                        drawer.transform.localScale = egret3d.Vector3.create(1.0, collider.height, 1.0).multiply(selectedGameObject!.transform.scale).release();
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }

            return selectedGameObject;
        }
    }
}