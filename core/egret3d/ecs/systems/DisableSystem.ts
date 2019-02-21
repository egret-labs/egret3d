namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem<GameObject> {

        private readonly _disposeCollecter: DisposeCollecter = Application.sceneManager.globalEntity.getComponent(DisposeCollecter)!;

        public onAwake() {
            const { scenes, entities, components } = this._disposeCollecter;

            Scene.onSceneDestroyed.add((scene: Scene) => {
                scenes.push(scene);
            });
            Entity.onEntityDestroyed.add((entity: IEntity) => {
                entities.push(entity);
            });
            Component.onComponentDestroyed.add(([entity, component]: [IEntity, IComponent]) => {
                components.push(component);
            });
        }

        public onLateUpdate() {
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
