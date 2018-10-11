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
     * 轴对称包围盒。
     */
    export class AABB extends paper.BaseRelease<AABB> implements paper.ICCS<AABB>, paper.ISerializable, IRaycast {
        /**
         * 
         */
        public static readonly ONE: Readonly<AABB> = new AABB().set(
            Vector3.MINUS_ONE.clone().multiplyScalar(0.5),
            Vector3.ONE.clone().multiplyScalar(0.5)
        );
        private static readonly _instances: AABB[] = [];
        /**
         * 
         * @param minimum 
         * @param maximum 
         */
        public static create(minimum: Readonly<IVector3> | null = null, maximum: Readonly<IVector3> | null = null) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(minimum, maximum);
                instance._released = false;
                return instance;
            }

            return new AABB().set(minimum, maximum);
        }

        private _dirtyRadius: boolean = true;
        private _dirtyCenter: boolean = true;
        private _dirtySize: boolean = true;
        private _boundingSphereRadius: number = 0.0;
        private readonly _minimum: Vector3 = Vector3.create(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        private readonly _maximum: Vector3 = Vector3.create(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        private readonly _center: Vector3 = Vector3.create();
        private readonly _size: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.AABB.create()` 创建实例。
         * @see egret3d.AABB.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this._minimum.x, this._minimum.y, this._minimum.z, this._maximum.x, this._maximum.y, this._maximum.z];
        }

        public deserialize(value: Readonly<[number, number, number, number, number, number]>) {
            return this.fromArray(value);
        }

        public clone() {
            return AABB.create(this.minimum, this.maximum);
        }

        public copy(value: Readonly<AABB>) {
            return this.set(value.minimum, value.maximum);
        }

        public clear() {
            this._minimum.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            this._maximum.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }

        public set(minimum: Readonly<IVector3> | null = null, maximum: Readonly<IVector3> | null = null) {
            if (minimum && minimum !== this._minimum) {
                this._minimum.copy(minimum);
            }

            if (maximum && maximum !== this._maximum) {
                this._maximum.copy(maximum);
            }

            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this._minimum.fromArray(value, offset);
            this._maximum.fromArray(value, offset + 3);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

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

        public applyMatrix(value: Readonly<Matrix4>, source?: Readonly<AABB>) {
            if (!source) {
                source = this;
            }

            // transform of empty box is an empty box.
            if (source.isEmpty) {
                if (source !== this!) {
                    this.copy(source);
                }

                return this;
            }

            const min = source.minimum;
            const max = source.maximum;

            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            _points[0].set(min.x, min.y, min.z).applyMatrix(value); // 000
            _points[1].set(min.x, min.y, max.z).applyMatrix(value); // 001
            _points[2].set(min.x, max.y, min.z).applyMatrix(value); // 010
            _points[3].set(min.x, max.y, max.z).applyMatrix(value); // 011
            _points[4].set(max.x, min.y, min.z).applyMatrix(value); // 100
            _points[5].set(max.x, min.y, max.z).applyMatrix(value); // 101
            _points[6].set(max.x, max.y, min.z).applyMatrix(value); // 110
            _points[7].set(max.x, max.y, max.z).applyMatrix(value); // 111

            this.fromPoints(_points);

            return this;

        }
        /**
         * 
         */
        public add(value: Readonly<IVector3 | AABB>, source?: Readonly<AABB>) {
            if (!source) {
                source = this;
            }

            const min = source.minimum;
            const max = source.maximum;

            if (value instanceof AABB) {
                this._minimum.min(value._minimum, min);
                this._maximum.max(value._maximum, max);
            }
            else {
                this._minimum.min(value as IVector3, min);
                this._maximum.max(value as IVector3, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 
         */
        public expand(value: Readonly<IVector3> | number, source?: Readonly<AABB>) {
            if (!source) {
                source = this;
            }

            const min = source.minimum;
            const max = source.maximum;

            if (typeof value === "number") {
                this._minimum.addScalar(-value, min);
                this._maximum.addScalar(value, max);
            }
            else {
                this._minimum.subtract(value as IVector3, min);
                this._maximum.add(value as IVector3, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 
         */
        public offset(value: number | Readonly<IVector3>, source?: Readonly<AABB>) {
            if (!source) {
                source = this;
            }

            const min = source.minimum;
            const max = source.maximum;

            if (typeof value === "number") {
                this._minimum.addScalar(value, min);
                this._maximum.addScalar(value, max);
            }
            else {
                this._minimum.add(value, min);
                this._maximum.add(value, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 
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

        public getDistance(value: Readonly<IVector3>) {
            return helpVector3A.clamp(this._minimum, this._maximum, value).subtract(value).length;
        }

        public clampPoints(value: Readonly<IVector3>, out: Vector3) {
            return out.clamp(this._minimum, this._maximum, value);
        }

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            let tmin: number, tmax: number, tymin: number, tymax: number, tzmin: number, tzmax: number;
            const invdirx = 1.0 / ray.direction.x,
                invdiry = 1.0 / ray.direction.y,
                invdirz = 1.0 / ray.direction.z;
            const origin = ray.origin;

            if (invdirx >= 0.0) {
                tmin = (this.minimum.x - origin.x) * invdirx;
                tmax = (this.maximum.x - origin.x) * invdirx;
            }
            else {
                tmin = (this.maximum.x - origin.x) * invdirx;
                tmax = (this.minimum.x - origin.x) * invdirx;
            }

            if (invdiry >= 0.0) {
                tymin = (this.minimum.y - origin.y) * invdiry;
                tymax = (this.maximum.y - origin.y) * invdiry;
            }
            else {
                tymin = (this.maximum.y - origin.y) * invdiry;
                tymax = (this.minimum.y - origin.y) * invdiry;
            }

            if ((tmin > tymax) || (tymin > tmax)) return false;

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN

            if (tymin > tmin || tmin !== tmin) tmin = tymin;

            if (tymax < tmax || tmax !== tmax) tmax = tymax;

            if (invdirz >= 0.0) {
                tzmin = (this.minimum.z - origin.z) * invdirz;
                tzmax = (this.maximum.z - origin.z) * invdirz;
            }
            else {
                tzmin = (this.maximum.z - origin.z) * invdirz;
                tzmax = (this.minimum.z - origin.z) * invdirz;
            }

            if ((tmin > tzmax) || (tzmin > tmax)) return false;

            if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

            if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

            // return point closest to the ray (positive side)

            if (tmax < 0.0) return false;

            if (raycastInfo) {
                ray.at(raycastInfo.distance = tmin >= 0.0 ? tmin : tmax, raycastInfo.position);
            }

            return true;
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
                this._boundingSphereRadius = helpVector3A.length;
                this._dirtyRadius = false;
            }

            return this._boundingSphereRadius;
        }
        /**
         * 
         */
        public get minimum(): Readonly<IVector3> {
            return this._minimum;
        }
        /**
         * 
         */
        public get maximum(): Readonly<IVector3> {
            return this._maximum;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3, { minimum: 0.0 })
        public get size(): Readonly<IVector3> {
            if (this._dirtySize) {
                this._size.subtract(this._maximum, this._minimum);
                this._dirtySize = false;
            }

            return this._size;
        }
        public set size(value: Readonly<IVector3>) {
            const center = this.center;
            const size = this._size.copy(value);

            const halfSize = helpVector3A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
            this._dirtyRadius = true;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get center(): Readonly<IVector3> {
            if (this._dirtyCenter) {
                this._center.add(this._maximum, this._minimum).multiplyScalar(0.5);
                this._dirtyCenter = false;
            }

            return this._center;
        }
        public set center(value: Readonly<IVector3>) {
            const size = this.size;
            const center = this._center.copy(value);

            const halfSize = helpVector3A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
        }
    }
    /**
     * @internal
     */
    export const helpAABBA = AABB.create();
}