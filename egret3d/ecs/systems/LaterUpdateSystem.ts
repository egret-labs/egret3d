namespace paper {
    /**
     * 
     */
    export class LaterUpdateSystem extends BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any, isExtends: true }];
        private readonly _laterCalls: (() => void)[] = [];

        public onUpdate() {
            // Update behaviours.
            const deltaTime = Time.deltaTime;
            const components = (Application.systemManager.getSystem(UpdateSystem) as UpdateSystem).components;

            if (this._isEditorUpdate()) {
                for (const component of components) {
                    if (component && component._isStarted && _executeInEditModeComponents.indexOf(component.constructor as any) >= 0) {
                        component.onLateUpdate && component.onLateUpdate(deltaTime);
                    }
                }
            }
            else {
                for (const component of components) {
                    if (component && component._isStarted) {
                        component.onLateUpdate && component.onLateUpdate(deltaTime);
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
