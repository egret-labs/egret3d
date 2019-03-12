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
     * 几何立方体。
     */
    export class Box extends paper.BaseRelease<Box> implements paper.ICCS<Box>, paper.ISerializable, IRaycast {

        public static readonly ONE: Readonly<Box> = new Box().set(
            Vector3.MINUS_ONE.clone().multiplyScalar(0.5),
            Vector3.ONE.clone().multiplyScalar(0.5)
        );
        private static readonly _instances: Box[] = [];
        /**
         * 创建一个几何立方体。
         * @param minimum 最小点。
         * @param maximum 最大点。
         */
        public static create(minimum: Readonly<IVector3> | null = null, maximum: Readonly<IVector3> | null = null) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(minimum, maximum);
                instance._released = false;
                return instance;
            }

            return new Box().set(minimum, maximum);
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
            return Box.create(this.minimum, this.maximum);
        }

        public copy(value: Readonly<Box>) {
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

        public fromArray(value: ArrayLike<number>, offset: number = 0) {
            this._minimum.fromArray(value, offset);
            this._maximum.fromArray(value, offset + 3);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 设置该立方体，使得全部点都在立方体内。
         * @param points 全部点。
         */
        public fromPoints(points: ArrayLike<IVector3>): this {
            this.clear();

            for (const point of points as IVector3[]) {
                this.add(point);
            }

            return this;
        }
        /**
         * 将该立方体乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        public applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入立方体与一个矩阵相乘的结果写入该立方体。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入立方体。
         */
        public applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<Box>): this;
        public applyMatrix(matrix: Readonly<Matrix4>, input?: Readonly<Box>) {
            if (!input) {
                input = this;
            }

            // transform of empty box is an empty box.
            if (input.isEmpty) {
                if (input !== this) {
                    this.copy(input);
                }

                return this;
            }

            const min = input.minimum;
            const max = input.maximum;

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
         * 增加该立方体的体积，使其能刚好包含指定的点或立方体。
         * @param pointOrBox 一个点或立方体。
         */
        public add(pointOrBox: Readonly<IVector3 | Box>): this;
        /**
         * 增加输入立方体的体积，并将改变的结果写入该立方体，使其能刚好包含指定的点或立方体。
         * @param pointOrBox 一个点或立方体。
         * @param input 输入立方体。 
         */
        public add(pointOrBox: Readonly<IVector3 | Box>, input: Readonly<Box>): this;
        public add(pointOrBox: Readonly<IVector3 | Box>, input?: Readonly<Box>) {
            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (pointOrBox instanceof Box) {
                this._minimum.min(pointOrBox._minimum, min);
                this._maximum.max(pointOrBox._maximum, max);
            }
            else {
                this._minimum.min(pointOrBox as IVector3, min);
                this._maximum.max(pointOrBox as IVector3, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 通过一个标量或向量扩大该立方体。
         * @param scalarOrVector 一个标量或向量。
         */
        public expand(scalarOrVector: number | Readonly<IVector3>): this;
        /**
         * 通过一个标量或向量扩大输入立方体，并将改变的结果写入该立方体。
         * @param scalarOrVector 一个标量或向量。
         * @param input 输入立方体。 
         */
        public expand(scalarOrVector: number | Readonly<IVector3>, input: Readonly<Box>): this;
        public expand(scalarOrVector: number | Readonly<IVector3>, input?: Readonly<Box>) {
            if (this.isEmpty) {
                return this;
            }

            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (typeof scalarOrVector === "number") {
                this._minimum.addScalar(-scalarOrVector, min);
                this._maximum.addScalar(scalarOrVector, max);
            }
            else {
                this._minimum.subtract(scalarOrVector as IVector3, min);
                this._maximum.add(scalarOrVector as IVector3, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 通过一个标量或向量移动该立方体。
         * @param scalarOrVector 一个标量或向量。
         */
        public translate(scalarOrVector: number | Readonly<IVector3>): this;
        /**
         * 通过一个标量或向量移动输入立方体，并将改变的结果写入该立方体。
         * @param scalarOrVector 一个标量或向量。
         * @param input 输入立方体。 
         */
        public translate(scalarOrVector: number | Readonly<IVector3>, input: Readonly<Box>): this;
        public translate(scalarOrVector: number | Readonly<IVector3>, input?: Readonly<Box>) {
            if (this.isEmpty) {
                return this;
            }

            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (typeof scalarOrVector === "number") {
                this._minimum.addScalar(scalarOrVector, min);
                this._maximum.addScalar(scalarOrVector, max);
            }
            else {
                this._minimum.add(scalarOrVector, min);
                this._maximum.add(scalarOrVector, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 获取一个点到该立方体的最近点。（如果该点在立方体内部，则最近点就是该点）
         * @param point 一个点。
         * @param out 最近点。
         */
        public getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            if (this.isEmpty) {
                return out.copy(Vector3.ZERO);
            }

            return out.clamp(this._minimum, this._maximum, point);
        }
        /**
         * 获取一个点到该立方体的最近距离。
         * @param point 一个点。
         */
        public getDistance(point: Readonly<IVector3>): number {
            if (this.isEmpty) {
                return helpVector3A.copy(Vector3.ZERO).subtract(point).length;
            }

            return helpVector3A.clamp(this._minimum, this._maximum, point).subtract(point).length;
        }
        /**
         * 该立方体是否包含指定的点或立方体。
         */
        public contains(pointOrBox: Readonly<IVector3 | Box>): boolean {
            if (this.isEmpty) {
                return false;
            }

            const min = this._minimum;
            const max = this._maximum;

            if (pointOrBox instanceof Box) {
                const vMin = pointOrBox.minimum;
                const vMax = pointOrBox.maximum;

                return min.x <= vMin.x && vMax.x <= max.x &&
                    min.y <= vMin.y && vMax.y <= max.y &&
                    min.z <= vMin.z && vMax.z <= max.z;
            }

            return ((pointOrBox as IVector3).x > min.x) && ((pointOrBox as IVector3).x < max.x) &&
                ((pointOrBox as IVector3).y > min.y) && ((pointOrBox as IVector3).y < max.y) &&
                ((pointOrBox as IVector3).z > min.z) && ((pointOrBox as IVector3).z < max.z);
        }

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            if (this.isEmpty) {
                return false;
            }

            let tmin: number, tmax: number, tymin: number, tymax: number, tzmin: number, tzmax: number;
            let hitDirection: 0 | 1 | 2 = 0;
            const origin = ray.origin;
            const direction = ray.direction;
            const minimum = this.minimum;
            const maximum = this.maximum;
            const invdirx = 1.0 / direction.x,
                invdiry = 1.0 / direction.y,
                invdirz = 1.0 / direction.z;

            if (invdirx >= 0.0) {
                tmin = (minimum.x - origin.x) * invdirx;
                tmax = (maximum.x - origin.x) * invdirx;
            }
            else {
                tmin = (maximum.x - origin.x) * invdirx;
                tmax = (minimum.x - origin.x) * invdirx;
            }

            if (invdiry >= 0.0) {
                tymin = (minimum.y - origin.y) * invdiry;
                tymax = (maximum.y - origin.y) * invdiry;
            }
            else {
                tymin = (maximum.y - origin.y) * invdiry;
                tymax = (minimum.y - origin.y) * invdiry;
            }

            if ((tmin > tymax) || (tymin > tmax)) return false;

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN

            if (tymin > tmin || tmin !== tmin) {
                tmin = tymin;
                hitDirection = 1;
            }

            if (tymax < tmax || tmax !== tmax) tmax = tymax;

            if (invdirz >= 0.0) {
                tzmin = (minimum.z - origin.z) * invdirz;
                tzmax = (maximum.z - origin.z) * invdirz;
            }
            else {
                tzmin = (maximum.z - origin.z) * invdirz;
                tzmax = (minimum.z - origin.z) * invdirz;
            }

            if ((tmin > tzmax) || (tzmin > tmax)) return false;

            if (tzmin > tmin || tmin !== tmin) {
                tmin = tzmin;
                hitDirection = 2;
            }

            if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

            // return point closest to the ray (positive side)

            if (tmax < 0.0) return false;

            if (raycastInfo) {
                const normal = raycastInfo.normal;
                ray.getPointAt(raycastInfo.distance = tmin >= 0.0 ? tmin : tmax, raycastInfo.position);

                if (normal) {
                    switch (hitDirection) {
                        case 0:
                            normal.set(invdirx > 0.0 ? -1.0 : 1.0, 0.0, 0.0);
                            break;

                        case 1:
                            normal.set(0.0, invdiry > 0.0 ? -1.0 : 1.0, 0.0);
                            break;

                        case 2:
                            normal.set(0.0, 0.0, invdirz > 0.0 ? -1.0 : 1.0);
                            break;
                    }
                }
            }

            return true;
        }
        /**
         * 该立方体是否为空。
         */
        public get isEmpty(): boolean {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return (this._maximum.x < this._minimum.x) || (this._maximum.y < this._minimum.y) || (this._maximum.z < this._minimum.z);
        }
        /**
         * 该立方体的包围球半径。
         */
        public get boundingSphereRadius(): number {
            if (this._dirtyRadius) {
                if (this.isEmpty) {
                    this._boundingSphereRadius = 0.0;
                }
                else {
                    helpVector3A.subtract(this._maximum, this._minimum).multiplyScalar(0.5);
                    this._boundingSphereRadius = helpVector3A.length;
                }

                this._dirtyRadius = false;
            }

            return this._boundingSphereRadius;
        }
        /**
         * 该立方体的最小点。
         */
        public get minimum(): Readonly<Vector3> {
            return this._minimum;
        }
        /**
         * 该立方体的最大点。
         */
        public get maximum(): Readonly<Vector3> {
            return this._maximum;
        }
        /**
         * 该立方体的尺寸。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3, { minimum: 0.0 })
        public get size(): Readonly<Vector3> {
            if (this._dirtySize) {
                if (this.isEmpty) {
                    this._size.copy(Vector3.ZERO);
                }
                else {
                    this._size.subtract(this._maximum, this._minimum);
                }

                this._dirtySize = false;
            }

            return this._size;
        }
        public set size(value: Readonly<Vector3>) {
            if (this.isEmpty) {
                return;
            }

            const center = this.center;
            const size = this._size.copy(value);
            //
            const halfSize = helpVector3A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
            this._dirtyRadius = true;
        }
        /**
         * 该立方体的中心点。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get center(): Readonly<Vector3> {
            if (this._dirtyCenter) {
                if (this.isEmpty) {
                    this._center.copy(Vector3.ZERO);
                }
                else {
                    this._center.add(this._maximum, this._minimum).multiplyScalar(0.5);
                }

                this._dirtyCenter = false;
            }

            return this._center;
        }
        public set center(value: Readonly<Vector3>) {
            if (this.isEmpty) {
                return;
            }

            const size = this.size;
            const center = this._center.copy(value);
            //
            const halfSize = helpVector3A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
        }
    }
    /**
     * @internal
     */
    export const helpBoxA = Box.create();
}