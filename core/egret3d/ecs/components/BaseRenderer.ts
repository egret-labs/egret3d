namespace paper {
    /**
     * @internal
     */
    export const enum RendererEventType {
        Materials = "materials",
    }
    /**
     * 基础渲染器。
     */
    export abstract class BaseRenderer extends BaseComponent implements egret3d.IRaycast {
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
        @serializedField
        protected readonly _aabb: egret3d.AABB = egret3d.AABB.create();

        protected _recalculateSphere() {
            const aabb = this.aabb; // Update aabb.

            const worldMatrix = this.gameObject.transform.getWorldMatrix();
            this._boundingSphere.set(aabb.center, aabb.boundingSphereRadius);
            this._boundingSphere.center.applyMatrix(worldMatrix);
            this._boundingSphere.radius *= worldMatrix.getMaxScaleOnAxis();
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
    }
}