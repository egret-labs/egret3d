namespace egret3d {
    const _helpVector3 = Vector3.create();
    /**
     * aabb box
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 轴对称包围盒
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class AABB {
        private _dirtyRadius: boolean = true;
        private _dirtyCenter: boolean = true;
        private readonly _minimum: Vector3 = Vector3.create(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        private readonly _maximum: Vector3 = Vector3.create(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        private readonly _sphere: Sphere = new Sphere();
        /**
         * build a aabb
         * @param minimum min point
         * @param maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构建轴对称包围盒
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public constructor(minimum?: Readonly<IVector3>, maximum?: Readonly<IVector3>) {
            if (minimum) {
                this._minimum.copy(minimum);
            }

            if (maximum) {
                this._maximum.copy(maximum);
            }
        }
        /**
         * copy
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 复制
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public copy(aabb: Readonly<AABB>) {
            this._minimum.copy(aabb.minimum);
            this._maximum.copy(aabb.maximum);
            this._dirtyRadius = true;
            this._dirtyCenter = true;

            return this;
        }
        /**
         * clone
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public clone() {
            const value = new egret3d.AABB(this._minimum, this._maximum);
            return value;
        }
        /**
         * clear
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 清空
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public clear() {
            this._minimum.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            this._maximum.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            this._dirtyCenter = true;
            this._dirtyRadius = true;

            return this;
        }
        /**
         * 
         */
        public set(minimum: Readonly<IVector3> | null = null, maximum: Readonly<IVector3> | null = null) {
            if (minimum && minimum !== this._minimum) {
                this._minimum.copy(minimum);
            }

            if (maximum && maximum !== this._maximum) {
                this._maximum.copy(maximum);
            }

            this._dirtyCenter = true;
            this._dirtyRadius = true;

            return this;
        }
        /**
         * 
         */
        public add(value: Readonly<IVector3> | Readonly<AABB>) {
            if (value instanceof AABB) {
                this._minimum.max(value._minimum);
                this._maximum.max(value._maximum);
            }
            else {
                this._minimum.max(value as IVector3);
                this._maximum.max(value as IVector3);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
        }
        /**
         * check contains vector
         * @param vector a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否包含点
         * @param vector 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public contains(vector: Readonly<IVector3>) {
            return (vector.x > this._minimum.x) && (vector.x < this._maximum.x) &&
                (vector.y > this._minimum.y) && (vector.x < this._maximum.y) &&
                (vector.z > this._minimum.z) && (vector.z < this._maximum.z);
        }
        /**
         * intersect with aabb
         * @param aabb aabb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否与aabb相交
         * @param aabb 轴对称包围盒
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public intersectAABB(aabb: AABB) {
            if (this._minimum.x > aabb._maximum.x) return false;
            if (this._maximum.x < aabb._minimum.x) return false;
            if (this._minimum.x > aabb._maximum.x) return false;
            if (this._maximum.x < aabb._minimum.x) return false;
            if (this._minimum.x > aabb._maximum.x) return false;
            if (this._maximum.x < aabb._minimum.x) return false;

            return true;
        }
        /**
         * 
         */
        public get minimum(): Readonly<Vector3> {
            return this._minimum;
        }
        /**
         * 
         */
        public get maximum(): Readonly<Vector3> {
            return this._maximum;
        }
        /**
         * get center
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取中心点位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get sphere(): Readonly<Sphere> {
            if (this._dirtyCenter) {
                this._sphere.center.add(this._maximum, this._minimum).scale(0.5);
                this._dirtyCenter = false;
            }

            if (this._dirtyRadius) {
                _helpVector3.subtract(this._maximum, this._minimum).scale(0.5);
                this._sphere.radius = _helpVector3.length;
                this._dirtyRadius = false;
            }

            return this._sphere;
        }
    }
}