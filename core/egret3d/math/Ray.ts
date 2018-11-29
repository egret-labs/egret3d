namespace egret3d {
    /**
     * 射线。
     */
    export class Ray extends paper.BaseRelease<Ray> implements paper.ICCS<Ray>, paper.ISerializable {
        private static readonly _instances: Ray[] = [];
        /**
         * 创建一个射线。
         * @param origin 射线的起点。
         * @param direction 射线的方向。
         */
        public static create(origin: Readonly<IVector3> = Vector3.ZERO, direction: Readonly<IVector3> = Vector3.FORWARD): Ray {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(origin, direction);
                instance._released = false;
                return instance;
            }

            return new Ray().set(origin, direction);
        }
        /**
         * 射线的起点。
         */
        public readonly origin: Vector3 = Vector3.create();
        /**
         * 射线的方向。
         */
        public readonly direction: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Ray.create()` 创建实例。
         * @see egret3d.Ray.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.origin.x, this.origin.y, this.origin.z, this.direction.x, this.direction.y, this.direction.z];
        }

        public deserialize(value: Readonly<[number, number, number, number, number, number]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<Ray>) {
            return this.set(value.origin, value.direction);
        }

        public clone() {
            return Ray.create(this.origin, this.direction);
        }

        public set(origin: Readonly<IVector3>, direction: Readonly<IVector3>) {
            this.origin.copy(origin);
            this.direction.copy(direction);

            return this;
        }

        public fromArray(value: ArrayLike<number>, offset: number = 0) {
            this.origin.fromArray(value, offset);
            this.direction.fromArray(value, offset + 3);

            return this;
        }
        /**
         * 设置该射线，使其从起点出发，经过终点。
         * @param from 起点。
         * @param to 终点。
         */
        public fromPoints(from: Readonly<IVector3>, to: Readonly<IVector3>): this {
            this.direction.subtract(to, this.origin.copy(from)).normalize();
            return this;
        }
        /**
         * 将该射线乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        public applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入射线与一个矩阵相乘的结果写入该射线。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入射线。
         */
        public applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<Ray>): this;
        public applyMatrix(matrix: Readonly<Matrix4>, input?: Readonly<Ray>) {
            this.origin.applyMatrix(matrix, (input || this).origin);
            this.direction.applyDirection(matrix, (input || this).direction);

            return this;
        }
        /**
         * 获取一个点到该射线的最近点。
         * @param point 一个点。
         * @param out 最近点。
         */
        public getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            const origin = out !== this.origin ? this.origin : helpVector3A.copy(this.origin);
            const direction = this.direction;
            const directionDistance = out.subtract(point, origin).dot(direction);

            if (directionDistance < 0.0) {
                return out.copy(origin);
            }

            return out.copy(direction).multiplyScalar(directionDistance).add(origin);
        }
        /**
         * 获取从该射线的起点沿着射线方向移动一段距离的一个点。
         * - out = ray.origin + ray.direction * distanceDelta
         * @param distanceDelta 移动距离。
         * @param out 一个点。
         */
        public getPointAt(distanceDelta: number, out?: Vector3): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            const origin = out !== this.origin ? this.origin : helpVector3A.copy(this.origin);
            return out.multiplyScalar(distanceDelta, this.direction).add(origin);
        }
        /**
         * 获取一个点到该射线的最近距离的平方。
         * @param point 一个点。
         */
        public getSquaredDistance(point: Readonly<IVector3>): number {
            const origin = this.origin;
            const directionDistance = helpVector3A.subtract(point, origin).dot(this.direction);
            // point behind the ray
            if (directionDistance < 0.0) {
                return origin.getSquaredDistance(point);
            }

            return this.getPointAt(directionDistance, helpVector3A).getSquaredDistance(point);
        }
        /**
         * 获取一个点到该射线的最近距离。
         * @param point 一个点。
         */
        public getDistance(point: Readonly<IVector3>): number {
            return Math.sqrt(this.getSquaredDistance(point));
        }
        /**
         * 获取该射线起点到一个平面的最近距离。
         * - 如果射线并不与平面相交，则返回 -1。
         * @param plane 一个平面。
         */
        public getDistanceToPlane(plane: Readonly<Plane>): number {
            const origin = this.origin;
            const planeNormal = plane.normal;
            const denominator = planeNormal.dot(this.direction);
            if (denominator === 0.0) {
                // line is coplanar, return origin
                if (plane.getDistance(origin) === 0.0) {
                    return 0.0;
                }

                // Null is preferable to undefined since undefined means.... it is undefined
                return -1.0;
            }

            const t = -(origin.dot(planeNormal) + plane.constant) / denominator;

            // Return if the ray never intersects the plane
            return t >= 0.0 ? t : -1.0;
        }
    }
    /**
     * @internal
     */
    export const helpRay = Ray.create();
}