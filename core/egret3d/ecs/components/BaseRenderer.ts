namespace paper {
    /**
     * 基础渲染组件。
     */
    export abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast {
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
         * @internal
         */
        public _localBoundingBoxDirty: boolean = true;
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
        /**
         * 如果该属性合并到 UV2 中，会破坏网格共享，共享的网格无法拥有不同的 lightmap UV。
         */
        @serializedField
        protected readonly _lightmapScaleOffset: egret3d.Vector4 = egret3d.Vector4.create();
        protected readonly _boundingSphere: egret3d.Sphere = egret3d.Sphere.create();
        protected readonly _localBoundingBox: egret3d.Box = egret3d.Box.create();
        @paper.serializedField
        protected readonly _materials: egret3d.Material[] = [egret3d.DefaultMaterials.MESH_BASIC];

        protected _recalculateSphere() {
            const localBoundingBox = this.localBoundingBox; // Update localBoundingBox.

            const worldMatrix = this.gameObject.transform.getWorldMatrix();
            this._boundingSphere.set(localBoundingBox.center, localBoundingBox.boundingSphereRadius);
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
        public abstract recalculateLocalBox(): void;

        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastMesh?: boolean): boolean;
        public abstract raycast(ray: Readonly<egret3d.Ray>, raycastInfo?: egret3d.RaycastInfo, raycastMesh?: boolean): boolean;
        /**
         * 该渲染组件是否接收投影。
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
         * 该渲染组件是否产生投影。
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
         * 该渲染组件的光照图索引。
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

        public get lightmapScaleOffset() {
            return this._lightmapScaleOffset;
        }

        /**
         * 该渲染组件的本地包围盒。
         */
        public get localBoundingBox(): Readonly<egret3d.Box> {
            if (this._localBoundingBoxDirty) {
                this.recalculateLocalBox();
                this._localBoundingBoxDirty = false;
            }

            return this._localBoundingBox;
        }

        /**
         * 该渲染组件本地包围盒的世界包围球，用于摄像机视锥剔除。
         */
        public get boundingSphere(): Readonly<egret3d.Sphere> {
            if (this._boundingSphereDirty) {
                this._recalculateSphere();
                this._boundingSphereDirty = false;
            }

            return this._boundingSphere;
        }

        /**
         * 该渲染组件的材质列表。
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
         * 该渲染组件材质列表中的第一个材质。
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

        /**
         * @deprecated
         */
        public get aabb(): Readonly<egret3d.Box> {
            return this.localBoundingBox;
        }
    }
}