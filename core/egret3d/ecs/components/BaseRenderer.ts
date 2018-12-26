namespace paper {
    /**
     * 基础渲染组件。
     */
    export abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast, egret3d.ITransformObserver {
        /**
         * 当渲染组件的材质列表改变时派发事件。
         */
        public static readonly onMaterialsChanged: signals.Signal = new signals.Signal();
        /**
         * 该组件是否开启视锥剔除。
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public frustumCulled: boolean = true;
        /**
         * 
         */
        public readonly defines: egret3d.Defines = new egret3d.Defines();
        /**
         * @internal
         */
        public _localBoundingBoxDirty: boolean = true;
        private _boundingSphereDirty: boolean = true;
        @serializedField
        protected _receiveShadows: boolean = false;
        @serializedField
        protected _castShadows: boolean = false;
        protected readonly _boundingSphere: egret3d.Sphere = egret3d.Sphere.create();
        protected readonly _localBoundingBox: egret3d.Box = egret3d.Box.create();
        protected readonly _materials: (egret3d.Material | null)[] = [egret3d.DefaultMaterials.MESH_BASIC.retain()];

        protected _recalculateSphere() {
            const localBoundingBox = this.localBoundingBox; // Update localBoundingBox.

            const localToWorldMatrix = this.getBoundingTransform().localToWorldMatrix;
            this._boundingSphere.set(localBoundingBox.center, localBoundingBox.boundingSphereRadius);
            this._boundingSphere.center.applyMatrix(localToWorldMatrix);
            this._boundingSphere.radius *= localToWorldMatrix.maxScaleOnAxis;
        }

        public initialize() {
            super.initialize();

            this.getBoundingTransform().registerObserver(this);
        }

        public uninitialize() {
            super.uninitialize();

            for (const material of this._materials) {
                if (material) {
                    material.release();
                }
            }

            this.defines.clear();

            this._materials.length = 0;
        }

        public onTransformChange() {
            this._boundingSphereDirty = true;
        }
        /**
         * 重新计算 AABB。
         */
        public abstract recalculateLocalBox(): void;

        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastMesh?: boolean): boolean;
        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastInfo?: egret3d.RaycastInfo, raycastMesh?: boolean): boolean;
        /**
         * 
         */
        public getBoundingTransform(): egret3d.Transform {
            return this.gameObject.transform;
        }
        /**
         * 该组件是否接收投影。
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
         * 该组件是否产生投影。
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
         * 该组件的本地包围盒。
         */
        public get localBoundingBox(): Readonly<egret3d.Box> {
            if (this._localBoundingBoxDirty) {
                this.recalculateLocalBox();
                this._localBoundingBoxDirty = false;
            }

            return this._localBoundingBox;
        }
        /**
         * 基于该组件本地包围盒生成的世界包围球，用于摄像机视锥剔除。
         */
        public get boundingSphere(): Readonly<egret3d.Sphere> {
            if (this._boundingSphereDirty) {
                this._recalculateSphere();
                this._boundingSphereDirty = false;
            }

            return this._boundingSphere;
        }
        /**
         * 该组件的材质列表。
         */
        @editor.property(editor.EditType.MATERIAL_ARRAY)
        @paper.serializedField("_materials")
        public get materials(): ReadonlyArray<egret3d.Material | null> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<egret3d.Material | null>) {
            const materials = this._materials;

            for (const material of materials) {
                if (material) {
                    material.release();
                }
            }

            if (value !== materials) {
                materials.length = 0;

                for (const material of value) {
                    materials.push(material);
                }
            }

            for (const material of materials) {
                if (material) {
                    material.retain();
                }
            }

            BaseRenderer.onMaterialsChanged.dispatch(this);
        }
        /**
         * 该组件材质列表中的第一个材质。
         */
        public get material(): egret3d.Material | null {
            const materials = this._materials;

            return materials.length > 0 ? materials[0] : null;
        }
        public set material(value: egret3d.Material | null) {
            let dirty = false;
            const materials = this._materials;
            let existingMaterial: egret3d.Material | null = null;

            if (materials.length > 0) {
                existingMaterial = materials[0];
                if (existingMaterial !== value) {
                    dirty = true;
                }
            }
            else if (value) {
                dirty = true;
            }

            if (dirty) {
                if (existingMaterial) {
                    existingMaterial.release();
                }

                if (value) {
                    value.retain();
                }

                materials[0] = value;
                BaseRenderer.onMaterialsChanged.dispatch(this);
            }
        }

        /**
         * @deprecated
         */
        public get aabb(): Readonly<egret3d.Box> {
            return this.localBoundingBox;
        }
    }
}