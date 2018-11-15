namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];
        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);

        public onRemoveComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (
                Application.playerMode === PlayerMode.Editor &&
                !(component.constructor as IComponentClass<Behaviour>).executeInEditMode
            ) {
                return;
            }

            component.onDisable && component.onDisable();

            if (disposeCollecter.components.indexOf(component) >= 0) { // TODO onDestroy 如果不是 enabled 就不派发
                component.onDestroy && component.onDestroy();
            }
        }

        public onUpdate() {
            for (const scene of this._disposeCollecter.scenes) {
                scene.uninitialize();
            }

            for (const gameObject of this._disposeCollecter.gameObjects) {
                gameObject.uninitialize();
            }

            for (const component of this._disposeCollecter.components) {
                component.uninitialize();
            }

            for (const instance of this._disposeCollecter.releases) {
                const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                if (instance.onClear) {
                    instance.onClear();
                }

                instances.push(instance);
            }

            this._disposeCollecter.clear();
        }
    }
}
