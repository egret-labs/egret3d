namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];
        private readonly _contactColliders: ContactColliders = ContactColliders.getInstance(ContactColliders);
        private readonly _disposeCollecter: DisposeCollecter = DisposeCollecter.getInstance(DisposeCollecter);

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
            //
            const begin = this._contactColliders.begin;
            const stay = this._contactColliders.stay;
            const end = this._contactColliders.end;

            if (begin.length > 0) {
                for (const contact of begin) {
                    stay.push(contact);
                }
            }

            if (end.length > 0) {
                for (const contact of end) {
                    const index = stay.indexOf(contact);
                    if (index >= 0) {
                        stay.splice(index, 1);
                    }
                }
            }
            //
            for (const scene of this._disposeCollecter.scenes) {
            }
            for (const gameObject of this._disposeCollecter.gameObjects) {
            }
            for (const component of this._disposeCollecter.components) {
                component.uninitialize();
            }

            this._contactColliders.clear();
            this._disposeCollecter.clear();
        }
    }
}
