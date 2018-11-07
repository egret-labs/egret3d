namespace paper.editor {
    /**
     * @internal
     */
    export class BaseSelectedGOComponent extends BaseComponent {

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject!;
            if (!selectedGameObject) {
                this.gameObject.activeSelf = false;
                return null;
            }

            this.gameObject.activeSelf = true;

            return selectedGameObject;
        }
    }
}