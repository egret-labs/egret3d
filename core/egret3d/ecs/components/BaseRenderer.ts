namespace paper {
    /**
     * 基础渲染组件。
     */
    @abstract
    export abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast, egret3d.ITransformObserver {
        /**
         * 当渲染组件的材质列表改变时派发事件。
         */
        public static readonly onMaterialsChanged: signals.Signal<BaseRenderer> = new signals.Signal();
        /**
         * 该组件是否开启视锥剔除。
         */
        @editor.property(editor.EditType.CHECKBOX)
        @serializedField
        public frustumCulled: boolean = true;

        private _boundingSphereDirty: boolean = true;
        @serializedField
        protected _nativeLocalBoundingBox: boolean = false;
        @serializedField
        protected _receiveShadows: boolean = false;
        @serializedField
        protected _castShadows: boolean = false;
        @serializedField
        protected readonly _localBoundingBox: egret3d.Box = egret3d.Box.create();
        protected readonly _boundingSphere: egret3d.Sphere = egret3d.Sphere.create();
        protected readonly _materials: (egret3d.Material | null)[] = [egret3d.DefaultMaterials.MESH_BASIC.retain()]; // TODO

        protected abstract _getlocalBoundingBox(): Readonly<egret3d.Box> | null;
        protected _recalculateSphere() {
            const localBoundingBox = this.localBoundingBox;
            const { localToWorldMatrix } = this.getBoundingTransform();
            this._boundingSphere.set(localBoundingBox.center, localBoundingBox.boundingSphereRadius);
            this._boundingSphere.center.applyMatrix(localToWorldMatrix);
            this._boundingSphere.radius *= localToWorldMatrix.maxScaleOnAxis;
        }
        /**
         * @internal
         */
        public initialize() {
            super.initialize();

            this.getBoundingTransform().registerObserver(this);
        }
        /**
         * @internal
         */
        public uninitialize() {
            for (const material of this._materials) {
                if (material !== null) {
                    material.release();
                }
            }

            super.uninitialize();

            this._materials.length = 0;
        }
        /**
         * @private
         */
        public onTransformChange() {
            this._boundingSphereDirty = true;
        }

        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastInfo: egret3d.RaycastInfo | null): boolean;
        /**
         * 该组件的世界包围盒所使用的变换组件。
         */
        public getBoundingTransform(): egret3d.Transform {
            return this.entity.getComponent(egret3d.Transform)!;
        }
        /**
         * 该组件是否接收投影。
         */
        @editor.property(editor.EditType.CHECKBOX)
        public get receiveShadows(): boolean {
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
        public get castShadows(): boolean {
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
        @editor.property(editor.EditType.NESTED)
        public get localBoundingBox(): Readonly<egret3d.Box> {
            const localBoundingBox = this._localBoundingBox;

            if (!this._nativeLocalBoundingBox) {
                const target = this._getlocalBoundingBox();

                if (target !== null) {
                    localBoundingBox.copy(target);
                }
            }

            return localBoundingBox;
        }
        public set localBoundingBox(value: Readonly<egret3d.Box>) {
            this._boundingSphereDirty = true;
            this._nativeLocalBoundingBox = true;
            this._localBoundingBox.copy(value);
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
                if (material !== null) {
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
                if (material !== null) {
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
            let existing: egret3d.Material | null = null;

            if (materials.length > 0) {
                existing = materials[0];

                if (existing !== value) {
                    dirty = true;
                }
            }
            else if (value !== null) {
                dirty = true;
            }

            if (dirty) {
                if (existing !== null) {
                    existing.release();
                }

                if (value !== null) {
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