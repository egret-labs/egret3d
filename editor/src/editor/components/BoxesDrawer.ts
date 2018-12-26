namespace paper.editor {
    /**
     * @internal
     */
    export class BoxesDrawer extends BaseComponent {
        private readonly _hoverBox: GameObject = EditorMeshHelper.createBox("HoverBox", egret3d.Color.WHITE, 0.6, Scene.editorScene);
        private readonly _drawer: GameObject[] = [];

        public initialize() {
            super.initialize();

            this._hoverBox.parent = this.gameObject;
        }

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObjects = modelComponent.selectedGameObjects;
            const hoveredGameObject = modelComponent.hoveredGameObject;

            if (hoveredGameObject && hoveredGameObject.renderer) {
                const boundingTransform = hoveredGameObject.renderer.getBoundingTransform();
                this._hoverBox.activeSelf = true;
                this._hoverBox.transform.localPosition.applyMatrix(boundingTransform.localToWorldMatrix, hoveredGameObject.renderer.localBoundingBox.center).update();
                this._hoverBox.transform.localRotation = boundingTransform.rotation;
                this._hoverBox.transform.localScale.multiply(hoveredGameObject.renderer.localBoundingBox.size, boundingTransform.scale).update();
            }
            else {
                this._hoverBox.activeSelf = false;
            }

            for (let i = 0, l = Math.max(this._drawer.length, selectedGameObjects ? selectedGameObjects.length : 0); i < l; ++i) {
                if (i + 1 > this._drawer.length) {
                    const gameObject = EditorMeshHelper.createBox(`Box_${i}`, egret3d.Color.INDIGO, 0.8, Scene.editorScene);
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