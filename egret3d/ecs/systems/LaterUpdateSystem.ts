namespace paper {
    /**
     * 
     */
    export class LaterUpdateSystem extends paper.BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any }];
        private readonly _laterCalls: (() => void)[] = [];

        public update() {
            // Update behaviours.
            const deltaTime = Time.deltaTime;
            const components = (Application.systemManager.getSystem(UpdateSystem) as UpdateSystem).components;

            if (this._isEditorUpdate()) {
                for (const component of components) {
                    if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onLateUpdate(deltaTime);
                    }
                }
            }
            else {
                for (const component of components) {
                    if (component) {
                        component.onLateUpdate(deltaTime);
                    }
                }
            }
            //
            egret.ticker.update(); // TODO 帧频
            //
            if (this._laterCalls.length > 0) {
                for (const callback of this._laterCalls) {
                    callback();
                }

                this._laterCalls.length = 0;
            }
        }
        /**
         * 
         */
        public callLater(callback: () => void): void {
            this._laterCalls.push(callback);
        }
    }
}
