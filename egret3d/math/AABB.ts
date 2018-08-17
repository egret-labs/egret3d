namespace egret3d {
    const _points = [
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
        Vector3.create(),
    ];
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
    export class AABB implements paper.IRelease<AABB>, paper.ISerializable {
        private static readonly _instances: AABB[] = [];

        public static create(minimum: Readonly<IVector3> | null = null, maximum: Readonly<IVector3> | null = null) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(minimum, maximum);
            }

            return new AABB().set(minimum, maximum);
        }

        public release() {
            if (AABB._instances.indexOf(this) < 0) {
                AABB._instances.push(this);
            }

            return this;
        }

        private _dirtyRadius: boolean = true;
        private _dirtyCenter: boolean = true;
        private _radius: number = 0.0;
        private readonly _minimum: Vector3 = Vector3.create(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        private readonly _maximum: Vector3 = Vector3.create(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        private readonly _center: Vector3 = Vector3.create();

        private constructor() {
        }

        public serialize() {
            return [this._minimum.x, this._minimum.y, this._minimum.z, this._maximum.x, this._maximum.y, this._maximum.z];
        }

        public deserialize(element: Readonly<[number, number, number, number, number, number]>) {
            this._minimum.fromArray(element);
            this._maximum.fromArray(element, 3);

            return this;
        }

        public clone() {
            return AABB.create(this.minimum, this.maximum);
        }

        public copy(value: Readonly<AABB>) {
            return this.set(value.minimum, value.maximum);
        }

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
        public fromPoints(value: Readonly<ArrayLike<IVector3>>) {
            this.clear();

            for (const point of value as IVector3[]) {
                this.add(point);
            }

            return this;
        }

        public applyMatrix4(matrix: Readonly<Matrix>, value?: Readonly<AABB>) {
            if (!value) {
                value = this;
            }

            // transform of empty box is an empty box.
            if (value.isEmpty) {
                if (value !== this) {
                    this.copy(value);
                }

                return this;
            }

            const min = value.minimum;
            const max = value.maximum;

            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            _points[0].set(min.x, min.y, min.z).applyMatrix(matrix); // 000
            _points[1].set(min.x, min.y, max.z).applyMatrix(matrix); // 001
            _points[2].set(min.x, max.y, min.z).applyMatrix(matrix); // 010
            _points[3].set(min.x, max.y, max.z).applyMatrix(matrix); // 011
            _points[4].set(max.x, min.y, min.z).applyMatrix(matrix); // 100
            _points[5].set(max.x, min.y, max.z).applyMatrix(matrix); // 101
            _points[6].set(max.x, max.y, min.z).applyMatrix(matrix); // 110
            _points[7].set(max.x, max.y, max.z).applyMatrix(matrix); // 111

            this.fromPoints(_points);

            return this;

        }
        /**
         * 
         */
        public add(value: Readonly<IVector3 | AABB>) {
            if (value instanceof AABB) {
                this._minimum.min(value._minimum);
                this._maximum.max(value._maximum);
            }
            else {
                this._minimum.min(value as IVector3);
                this._maximum.max(value as IVector3);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;

            return this;
        }
        /**
         * 
         */
        public offset(value: number | Readonly<IVector3>) {
            if (typeof value === "number") {
                this._minimum.addScalar(value);
                this._maximum.addScalar(value);
            }
            else {
                this._minimum.add(value);
                this._maximum.add(value);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;

            return this;
        }
        /**
         * check contains vector
         * @param value a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否包含点
         * @param value 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public contains(value: Readonly<IVector3 | AABB>) {
            const min = this._minimum;
            const max = this._maximum;

            if (value instanceof AABB) {
                const vMin = value.minimum;
                const vMax = value.maximum;

                return min.x <= vMin.x && vMax.x <= max.x &&
                    min.y <= vMin.y && vMax.y <= max.y &&
                    min.z <= vMin.z && vMax.z <= max.z;
            }

            return ((value as IVector3).x > min.x) && ((value as IVector3).x < max.x) &&
                ((value as IVector3).y > min.y) && ((value as IVector3).x < max.y) &&
                ((value as IVector3).z > min.z) && ((value as IVector3).z < max.z);
        }

        public get isEmpty() {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return (this._maximum.x < this._minimum.x) || (this._maximum.y < this._minimum.y) || (this._maximum.z < this._minimum.z);
        }
        /**
         * Bounding sphere radius.
         */
        public get boundingSphereRadius() {
            if (this._dirtyRadius) {
                helpVector3A.subtract(this._maximum, this._minimum).multiplyScalar(0.5);
                this._radius = helpVector3A.length;
                this._dirtyRadius = false;
            }

            return this._radius;
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
        public get center(): Readonly<Vector3> {
            if (this._dirtyCenter) {
                this._center.add(this._maximum, this._minimum).multiplyScalar(0.5);
                this._dirtyCenter = false;
            }

            return this._center;
        }
    }

    export const helpAABBA = AABB.create();
}