namespace egret3d {
    /**
     * 
     */
    export class BaseCollider extends paper.BaseComponent {
        @paper.serializedField
        protected readonly _bounds: OBB = new OBB();

        /**
         * 
         */
        public get bounds() {
            return this._bounds;
        }
    }

    /**
     * 
     */
    export const enum BoxColliderDirtyMask {
        Bounds = 0b00001,
    }

    /**
     * 矩形碰撞盒组件
     */
    export class BoxCollider extends BaseCollider {
        /**
         * 
         */
        public _dirtyMask: number = 0;
        private _center: Vector3;
        private _size: Vector3;
        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            this._dirtyMask |= BoxColliderDirtyMask.Bounds;
            this._center = this._bounds.center;
            this._size = this._bounds.size;
        }
        /**
         * 碰撞盒中心点
         */
        public get center(): Readonly<Vector3> {
            return this._center;
        }
        public set center(value: Readonly<Vector3>) {
            this._dirtyMask |= BoxColliderDirtyMask.Bounds;
            this._center.x = value.x;
            this._center.y = value.y;
            this._center.z = value.z;
        }

        /**
         * 碰撞盒尺寸
         */
        public get size(): Readonly<Vector3> {
            return this._size;
        }
        public set size(value: Readonly<Vector3>) {
            this._dirtyMask |= BoxColliderDirtyMask.Bounds;
            this._size.x = value.x;
            this._size.y = value.y;
            this._size.z = value.z;
        }
    }
}
