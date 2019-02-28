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
            const disposeCollecter = this._disposeCollecter;

            for (const scene of scenes) {
                scene.uninitialize();
            }

            for (const entity of entities) {
                entity.uninitialize();
            }

            for (const component of components) {
                component.uninitialize();
            }

            for (const instance of releases) {
                const instances = (instance.constructor as any)._instances as BaseRelease<any>[]; // TODO
                instance.onClear && instance.onClear();
                instances.push(instance);
            }

            for (const asset of assets) { // TODO
                if (asset.onReferenceCountChange!(true)) {
                    console.debug("Auto dispose GPU memory.", asset.name);
                }
            }

            disposeCollecter.clear();

            for (const entity of this._cacheEntities) {
                entities.push(entity);
            }

            for (const component of this._cacheComponents) {
                components.push(component);
            }
        }
    }
}
