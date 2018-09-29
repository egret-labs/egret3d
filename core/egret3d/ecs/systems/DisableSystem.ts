namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];
        private readonly _contactColliders: ContactColliders = GameObject.globalGameObject.getOrAddComponent(ContactColliders);
        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);

        public onRemoveComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (
                Application.playerMode === PlayerMode.Editor &&
                !(component.constructor as ComponentClass<Behaviour>).executeInEditMode
            ) {
                return;
            }

            component.onDisable && component.onDisable();
        }

        public onUpdate() {
            const gameObjectPool = GameObject._instances;

            for (const scene of this._disposeCollecter.scenes) {
                scene.uninitialize();
            }

            for (const gameObject of this._disposeCollecter.gameObjects) {
                // gameObjectPool.push(gameObject);
                gameObject.uninitialize();
            }

            for (const component of this._disposeCollecter.components) {
                component.uninitialize();
            }

            for (const instance of this._disposeCollecter.releases) {
                const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                instances.push(instance);
            }

            this._contactColliders.clear();
            this._disposeCollecter.clear();
        }
    }
}
