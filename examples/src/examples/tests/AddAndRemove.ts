namespace examples.tests {

    export class AddAndRemove implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main.gameObject.addComponent(Starter);
            //
            createGridRoom();
        }
    }

    class Starter extends paper.Behaviour {
        private _entityCount: uint = 0;
        private readonly _entities: paper.GameObject[] = [];
        private readonly _components: paper.IComponentClass<paper.IComponent>[] = [egret3d.MeshFilter, egret3d.MeshFilter, egret3d.MeshRenderer, egret3d.MeshRenderer, TestBehaviour];
        private readonly _meshes: (egret3d.Mesh | null)[] = [egret3d.DefaultMeshes.CUBE, egret3d.DefaultMeshes.CONE, egret3d.DefaultMeshes.CYLINDER, egret3d.DefaultMeshes.SPHERE, egret3d.DefaultMeshes.TORUS, null];
        private readonly _materials: (egret3d.Material | null)[] = [egret3d.DefaultMaterials.MESH_BASIC, egret3d.DefaultMaterials.MESH_LAMBERT, egret3d.DefaultMaterials.MESH_PHONG, egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL), egret3d.Material.create(egret3d.DefaultShaders.MESH_STANDARD), egret3d.Material.create(egret3d.DefaultShaders.MESH_NORMAL), null];
        private readonly _actions = [this._addEntity, this._removeEntity, this._addComponent, this._removeComponent, this._changeEntityEnabled, this._changeComponentEnabled, this._changeTransformParent];

        private _getEntity() {
            if (this._entities.length <= 0) {
                return null;
            }

            const index = Math.floor(Math.random() * this._entities.length);
            const entity = this._entities[index];

            if (entity.isDestroyed) {
                this._entities.splice(index, 1);

                return null;
            }

            return entity;
        }

        private _getComponent() {
            if (this._components.length <= 0) {
                return null;
            }

            const index = Math.floor(Math.random() * this._components.length);
            const component = this._components[index];

            return component;
        }

        private _getMesh() {
            if (this._meshes.length <= 0) {
                return null;
            }

            const index = Math.floor(Math.random() * this._meshes.length);
            return this._meshes[index];
        }

        private _getMaterial() {
            if (this._materials.length <= 0) {
                return null;
            }

            const index = Math.floor(Math.random() * this._materials.length);
            return this._materials[index];
        }

        private _addEntity() {
            if (this._entities.length < 30) {
                const entity = paper.GameObject.create(`Entity_${this._entityCount++}`);
                // TODO 变换组件可动态删除。
                entity.transform
                    .setLocalPosition(Math.random() * 6.0 - 3.0, Math.random() * 6.0 - 3.0 + 10.0, Math.random() * 6.0 - 3.0)
                    .setLocalEulerAngles(Math.random() * 180.0 - 90.0, Math.random() * 180.0 - 90.0, Math.random() * 180.0 - 90.0);
                this._entities.push(entity);
                this._addComponent(entity, egret3d.MeshFilter);
                this._addComponent(entity, egret3d.MeshRenderer);

                return true;
            }

            return false;
        }

        private _removeEntity() {
            const entity = this._getEntity();

            if (entity) {
                this._entities.splice(this._entities.indexOf(entity), 1);
                entity.destroy();

                return true;
            }

            return false;
        }

        private _addComponent(entity: paper.IEntity | null = null, componentClass: paper.IComponentClass<paper.IComponent> | null = null) {
            entity = entity || this._getEntity();

            if (entity) {
                componentClass = componentClass || this._getComponent();

                if (componentClass && !entity.getComponent(componentClass)) {
                    const component = entity.addComponent(componentClass);

                    switch (componentClass) {
                        case egret3d.MeshFilter:
                            (component as egret3d.MeshFilter).mesh = this._getMesh();
                            break;

                        case egret3d.MeshRenderer:
                            (component as egret3d.MeshRenderer).material = this._getMaterial();
                            break;
                    }

                    return true;
                }
            }

            return false;
        }

        private _removeComponent() {
            const entity = this._getEntity();

            if (entity) {
                const component = this._getComponent();

                if (component && entity.getComponent(component)) {
                    entity.removeComponent(component);

                    return true;
                }
            }

            return false;
        }

        private _changeEntityEnabled() {
            const entity = this._getEntity();

            if (entity) {
                entity.enabled = !entity.enabled;

                return true;
            }

            return false;
        }

        private _changeComponentEnabled() {
            const entity = this._getEntity();

            if (entity) {
                const componentClass = this._getComponent();

                if (componentClass) {
                    const component = entity.getComponent(componentClass);

                    if (component) {
                        component.enabled = !component.enabled;

                        return true;
                    }
                }
            }

            return false;
        }

        private _changeTransformParent() {
            const entity = this._getEntity();

            if (entity) {
                if (entity.parent) {
                    if (Math.random() < 0.5) {
                        entity.transform.parent = null;

                        return true;
                    }
                }

                const parent = this._getEntity();

                if (parent && entity !== parent && !entity.transform.contains(parent.transform)) {
                    entity.transform.parent = parent.transform;

                    return true;
                }
            }

            return false;
        }

        public onAwake() {
            egret3d.Camera.main.entity.addComponent(behaviors.RotateAround).lookAtPoint.set(0.0, 10.0, 0.0);
        }

        public onUpdate() {
            while (true) {
                const action = this._actions[Math.floor(Math.random() * this._actions.length)];

                if (action.call(this)) {
                    break;
                }
            }
        }
    }

    class TestBehaviour extends paper.Behaviour {

    }
}
