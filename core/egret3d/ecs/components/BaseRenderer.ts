namespace paper {
    /**
     * 基础渲染器。
     */
    export abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast {
        /**
         * 
         */
        public static readonly onMaterialsChanged: signals.Signal = new signals.Signal();
        /**
         * 是否开启视锥剔除。
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public frustumCulled: boolean = true;
        /**
         * @internal
         */
        public _aabbDirty: boolean = true;
        /**
         * @internal
         */
        public _boundingSphereDirty: boolean = true;
        @serializedField
        protected _receiveShadows: boolean = false;
        @serializedField
        protected _castShadows: boolean = false;
        @serializedField
        protected _lightmapIndex: number = -1;
        protected readonly _boundingSphere: egret3d.Sphere = egret3d.Sphere.create();
        protected readonly _aabb: egret3d.AABB = egret3d.AABB.create();
        @paper.serializedField
        protected readonly _materials: egret3d.Material[] = [egret3d.DefaultMaterials.MESH_BASIC];

        protected _recalculateSphere() {
            const aabb = this.aabb; // Update aabb.

            const worldMatrix = this.gameObject.transform.getWorldMatrix();
            this._boundingSphere.set(aabb.center, aabb.boundingSphereRadius);
            this._boundingSphere.center.applyMatrix(worldMatrix);
            this._boundingSphere.radius *= worldMatrix.getMaxScaleOnAxis();
        }

        public uninitialize() {
            super.uninitialize();

            this._materials.length = 0;
        }
        /**
         * 重新计算 AABB。
         */
        public abstract recalculateAABB(): void;

        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastMesh?: boolean): boolean;
        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastInfo?: egret3d.RaycastInfo, raycastMesh?: boolean): boolean;
        /**
         * 该渲染器是否接收投影。
         */
        @editor.property(editor.EditType.CHECKBOX)
        public get receiveShadows() {
            return this._receiveShadows;
        }
        public set receiveShadows(value: boolean) {
            if (value === this._receiveShadows) {
                return;
            }

            this._receiveShadows = value;
        }
        /**
         * 该渲染器是否产生投影。
         */
        @editor.property(editor.EditType.CHECKBOX)
        public get castShadows() {
            return this._castShadows;
        }
        public set castShadows(value: boolean) {
            if (value === this._castShadows) {
                return;
            }

            this._castShadows = value;
        }
        /**
         * 该渲染器的光照图的索引。
         */
        @editor.property(editor.EditType.INT, { minimum: -1 })
        public get lightmapIndex() {
            return this._lightmapIndex;
        }
        public set lightmapIndex(value: number) {
            if (value === this._lightmapIndex) {
                return;
            }

            this._lightmapIndex = value;
        }
        /**
         * 
         */
        public get aabb(): Readonly<egret3d.AABB> {
            if (this._aabbDirty) {
                this.recalculateAABB();
                this._aabbDirty = false;
            }

            return this._aabb;
        }
        /**
         * 
         */
        public get boundingSphere(): Readonly<egret3d.Sphere> {
            if (this._boundingSphereDirty) {
                this._recalculateSphere();
                this._boundingSphereDirty = false;
            }

            return this._boundingSphere;
        }
        /**
         * 该渲染器的材质数组。
         */
        @paper.editor.property(paper.editor.EditType.MATERIAL_ARRAY)
        public get materials(): ReadonlyArray<egret3d.Material> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<egret3d.Material>) {
            if (value === this._materials) {
                return;
            }
            // TODO 共享材质的接口。

            this._materials.length = 0;
            for (const material of value) {
                if (!material) {
                    console.warn("Invalid material.");
                }

                this._materials.push(material || egret3d.DefaultMaterials.MISSING);
            }

            BaseRenderer.onMaterialsChanged.dispatch(this);
        }
        /**
         * 该渲染器材质数组中的第一个材质。
         */
        public get material(): egret3d.Material | null {
            return this._materials.length > 0 ? this._materials[0] : null;
        }
        public set material(value: egret3d.Material | null) {
            let dirty = false;
            if (value) {
                if (this._materials.length > 0) {
                    if (this._materials[0] !== value) {
                        this._materials[0] = value;
                        dirty = true;
                    }
                }
                else {
                    this._materials.push(value);
                    dirty = true;
                }
            }
            else if (this._materials.length > 0) {
                this._materials.splice(0, 1);
                dirty = true;
            }

            if (dirty) {
                BaseRenderer.onMaterialsChanged.dispatch(this);
            }
        }
    }
}