namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];
        private readonly _bufferedComponents: BaseComponent[] = [];
        private readonly _bufferedGameObjects: GameObject[] = [];
        private readonly _contactColliders: paper.ContactColliders = this._globalGameObject.getComponent(paper.ContactColliders) || this._globalGameObject.addComponent(paper.ContactColliders);

        public onRemoveComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (this._isEditorUpdate()) {
                if (_executeInEditModeComponents.indexOf(component.constructor as any) < 0) {
                    return;
                }
            }

            component.onDisable && component.onDisable();
        }

        public onUpdate() {
            //
            for (const component of this._bufferedComponents) {
                component.uninitialize();
            }

            this._bufferedComponents.length = 0;
            this._bufferedGameObjects.length = 0;
            //
            const begin = this._contactColliders.begin as OIMO.Contact[];
            const stay = this._contactColliders.stay as OIMO.Contact[];
            const end = this._contactColliders.end as OIMO.Contact[];

            if (begin.length > 0) {
                for (const contact of begin) {
                    stay.push(contact);
                }

                begin.length = 0;
            }

            if (end.length > 0) {
                for (const contact of end) {
                    const index = stay.indexOf(contact);
                    if (index >= 0) {
                        stay.splice(index, 1);
                    }
                }

                end.length = 0;
            }

            if (stay.length > 0) {
            }
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
