namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        public readonly interests = [
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
        }

        public onUpdate() {
            const disposeCollecter = this._disposeCollecter;

            for (const scene of disposeCollecter.scenes) {
                scene.uninitialize();
            }

            for (const gameObject of disposeCollecter.gameObjects) {
                gameObject.uninitialize();
            }

            for (const component of disposeCollecter.components) {
                component.uninitialize();
            }

            for (const instance of disposeCollecter.releases) {
                const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                instance.onClear && instance.onClear();
                instances.push(instance);
            }

            disposeCollecter.clear();
        }
    }
}
