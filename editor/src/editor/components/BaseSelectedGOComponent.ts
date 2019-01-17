namespace paper.editor {
    /**
     * @internal
     */
    export class BaseSelectedGOComponent extends BaseComponent {

        public update() {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            return modelComponent.selectedGameObject;
        }
    }
}