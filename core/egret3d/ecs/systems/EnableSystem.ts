namespace paper {
    /**
     * @internal
     */
    export class EnableSystem extends BaseSystem {
        public readonly interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        private readonly _disposeCollecter: DisposeCollecter = GameObject.globalGameObject.getOrAddComponent(DisposeCollecter);

        public onAddComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (Application.playerMode === PlayerMode.Editor) {
                if (!(component.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                    return;
                }

                if (!component._isReseted) {
                    component._isReseted = true;
                    component.onReset && component.onReset();
                }
            }

            component.onEnable && component.onEnable();
        }

        public onUpdate() {
            const { assets } = this._disposeCollecter;

            if (assets.length > 0) {
                // for (const asset of assets) { // TODO
                //     if (asset.onReferenceCountChange!(true)) {
                //         console.debug("Auto dispose GPU memory.", asset.name);
                //     }
                // }

                assets.length = 0;
            }
        }
    }
}