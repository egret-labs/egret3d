namespace paper {
    /**
     * @internal
     */
    export class EndSystem extends BaseSystem {
        private readonly _bufferedComponents: BaseComponent[] = [];
        private readonly _bufferedGameObjects: GameObject[] = [];

        public onUpdate(deltaTime: number) {
            //
            egret3d.InputManager.update(deltaTime);
            //
            for (const component of this._bufferedComponents) {
                component.uninitialize();
            }

            this._bufferedComponents.length = 0;
            this._bufferedGameObjects.length = 0;
            //
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
        }
    }
}
