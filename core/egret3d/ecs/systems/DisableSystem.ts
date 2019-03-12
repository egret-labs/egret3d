namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem<GameObject> {
        private readonly _cacheEntities: IEntity[] = [];
        private readonly _cacheComponents: IComponent[] = [];
        private readonly _disposeCollecter: DisposeCollecter = Application.sceneManager.globalEntity.getComponent(DisposeCollecter)!;

        public onAwake() {
            const { scenes } = this._disposeCollecter;

            Scene.onSceneDestroyed.add((scene: Scene) => {
                scenes.push(scene);
            });
            Entity.onEntityDestroyed.add((entity: IEntity) => {
                this._cacheEntities.push(entity);
            });
            Component.onComponentDestroyed.add(([entity, component]: [IEntity, IComponent]) => {
                this._cacheComponents.push(component);
            });
        }

        public onTickCleanup() {
            const { scenes, entities, components, releases, assets } = this._disposeCollecter;
            const { _cacheEntities, _cacheComponents } = this;

            if (components.length > 0) {
                for (const component of components) {
                    component.uninitialize();
                }

                components.length = 0;
            }

            if (entities.length > 0) {
                for (const entity of entities) {
                    entity.uninitialize();
                }

                entities.length = 0;
            }

            if (scenes.length > 0) {
                for (const scene of scenes) {
                    scene.uninitialize();
                }

                scenes.length = 0;
            }

            if (releases.length > 0) {
                for (const instance of releases) {
                    const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                    instance.onClear && instance.onClear();
                    instances.push(instance);
                }

                releases.length = 0;
            }

            if (assets.length > 0) {
                for (const asset of assets) { // TODO
                    if (asset.onReferenceCountChange!(true)) {
                        console.debug("Auto dispose GPU memory.", asset.name);
                    }
                }

                assets.length = 0;
            }

            if (_cacheEntities.length > 0) {
                for (const entity of _cacheEntities) {
                    entities.push(entity);
                }

                _cacheEntities.length = 0;
            }

            if (_cacheComponents.length > 0) {
                for (const component of _cacheComponents) {
                    components.push(component);
                }

                _cacheComponents.length = 0;
            }
        }
    }
}
