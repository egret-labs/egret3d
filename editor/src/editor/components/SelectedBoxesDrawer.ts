namespace paper.editor {
    /**
     * @internal
     */
    export class BoxesDrawer extends BaseComponent {
        private readonly _drawer: GameObject[] = [];

        public initialize() {
            super.initialize();
        }

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObjects = modelComponent.selectedGameObjects;

            for (let i = 0, l = Math.max(this._drawer.length, selectedGameObjects ? selectedGameObjects.length : 0); i < l; ++i) {
                if (i + 1 > this._drawer.length) {
                    const gameObject = EditorMeshHelper.createBox(`AABB_${i}`, egret3d.Color.INDIGO, 0.5, paper.Scene.editorScene);
                    this._drawer.push(gameObject);
                }

                const drawer = this._drawer[i];

                if (i + 1 > selectedGameObjects.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const gameObject = selectedGameObjects[i];
                    if (gameObject.activeSelf && gameObject.renderer) {
                        drawer.activeSelf = true;
                        drawer.transform.localPosition = egret3d.Vector3.create().copy(gameObject.renderer.aabb.center).applyMatrix(gameObject.transform.worldMatrix).release();
                        drawer.transform.localRotation = gameObject.transform.rotation;
                        drawer.transform.localScale = egret3d.Vector3.create().multiply(gameObject.renderer.aabb.size, gameObject.transform.scale).release();
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }
        }
    }
}