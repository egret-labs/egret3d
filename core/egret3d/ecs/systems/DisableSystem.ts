namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem<GameObject> {

        private readonly _disposeCollecter: DisposeCollecter = SceneManager.getInstance().globalEntity.getComponent(DisposeCollecter)!;

        public onUpdate() {
            const disposeCollecter = this._disposeCollecter;

            for (const scene of disposeCollecter.scenes) {
                scene.uninitialize();
            }

            for (const entity of disposeCollecter.entities) {
                entity.uninitialize();
            }

            for (const component of disposeCollecter.components) {
                component.uninitialize();
            }

            for (const instance of disposeCollecter.releases) {
                const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                instance.onClear && instance.onClear();
                instances.push(instance);
            }

            const { assets } = disposeCollecter;

            if (assets.length > 0) {
                for (const asset of assets) { // TODO
                    if (asset.onReferenceCountChange!(true)) {
                        console.debug("Auto dispose GPU memory.", asset.name);
                    }
                }

                assets.length = 0;
            }

            disposeCollecter.clear();
        }
    }
}
