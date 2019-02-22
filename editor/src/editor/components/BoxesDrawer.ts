namespace paper.editor {
    /**
     * @internal
     */
    export class BoxesDrawer extends BaseComponent {
        private readonly _drawer: GameObject[] = [];

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObjects = modelComponent.selectedGameObjects;

            for (let i = 0, l = Math.max(this._drawer.length, selectedGameObjects ? selectedGameObjects.length : 0); i < l; ++i) {
                if (i + 1 > this._drawer.length) {
                    const gameObject = EditorMeshHelper.createBox(`Box ${i}`, egret3d.Color.INDIGO, 0.8);
                    gameObject.parent = this.gameObject;
                    this._drawer.push(gameObject);
                }

                const drawer = this._drawer[i];

                if (i + 1 > selectedGameObjects.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const gameObject = selectedGameObjects[i];
                    if (gameObject.activeSelf && gameObject.renderer) {
                        const boundingTransform = gameObject.renderer.getBoundingTransform();
                        drawer.activeSelf = true;
                        drawer.transform.localPosition.applyMatrix(boundingTransform.localToWorldMatrix, gameObject.renderer.localBoundingBox.center).update();
                        drawer.transform.localRotation = boundingTransform.rotation;
                        drawer.transform.localScale.multiply(gameObject.renderer.localBoundingBox.size, boundingTransform.scale).update();
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }
        }
    }
}
