namespace paper {
    /**
     * @internal
     */
    export class DestroySystem extends BaseSystem<BaseComponent> {
        private readonly _bufferedComponents: BaseComponent[] = [];
        private readonly _bufferedGameObjects: GameObject[] = [];
        /**
         * @inheritDoc
         */
        public update() {
            for (const component of this._bufferedComponents) {
                component.uninitialize();
            }

            this._bufferedComponents.length = 0;
            this._bufferedGameObjects.length = 0;
            //
            egret3d.InputManager.update(Time.deltaTime);
            egret3d.Performance.endCounter(egret3d.PerformanceType.All);
        }
        /**
         * @internal
         */
        public bufferComponent(component: BaseComponent) {
            if (this._bufferedComponents.indexOf(component) >= 0) {
                return;
            }

            this._bufferedComponents.push(component);
        }
        /**
         * @internal
         */
        public bufferGameObject(gameObject: GameObject) {
            if (this._bufferedGameObjects.indexOf(gameObject) >= 0) {
                return;
            }

            this._bufferedGameObjects.push(gameObject);

            if (gameObject.transform) {
                for (const child of gameObject.transform.children) {
                    if (Application.sceneManager.globalObjects.indexOf(child.gameObject) >= 0) {
                        child.parent = null;
                        continue;
                    }

                    child.gameObject.destroy();
                }
            }
        }
    }
}
