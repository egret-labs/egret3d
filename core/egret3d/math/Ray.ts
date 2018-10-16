namespace egret3d {
    /**
     * 射线。
     */
    export class Ray extends paper.BaseRelease<Ray> implements paper.ICCS<Ray>, paper.ISerializable {
        private static readonly _instances: Ray[] = [];
        /**
         * 创建一个射线。
         * @param origin 射线的起始点。
         * @param direction 射线的方向向量。
         */
        public static create(origin: Readonly<IVector3> = Vector3.ZERO, direction: Readonly<IVector3> = Vector3.FORWARD) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(origin, direction);
                instance._released = false;
                return instance;
            }

            return new Ray().set(origin, direction);
        }
        /**
         * 射线的起始点。
         */
        public readonly origin: Vector3 = Vector3.create();
        /**
         * 射线的方向向量。
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

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.origin.fromArray(value, offset);
            this.direction.fromArray(value, offset + 3);

            return this;
        }

        public applyMatrix(value: Readonly<Matrix4>, ray?: Readonly<Ray>) {
            this.origin.applyMatrix(value, (ray || this).origin);
            this.direction.applyDirection(value, (ray || this).direction).normalize();

            return this;
        }
        /**
         * 获取点到该射线的最近距离的平方。
         * @param value 点。
         */
        public getSquaredDistance(value: Readonly<IVector3>) {
            const directionDistance = helpVector3A.subtract(value, this.origin).dot(this.direction);
            // point behind the ray
            if (directionDistance < 0.0) {
                return this.origin.getSquaredDistance(value);
            }

            return this.at(directionDistance, helpVector3A).getSquaredDistance(value);
        }
        /**
         * 获取点到该射线的最近距离。
         * @param value 点。
         */
        public getDistance(value: Readonly<IVector3>) {
            return Math.sqrt(this.getSquaredDistance(value));
        }

        public getDistanceToPlane(value: Readonly<Plane>) {
            const denominator = value.normal.dot(this.direction);
            if (denominator === 0.0) {
                // line is coplanar, return origin
                if (value.getDistance(this.origin) === 0.0) {
                    return 0.0;
                }

                // Null is preferable to undefined since undefined means.... it is undefined
                return -1.0;
            }

            const t = -(this.origin.dot(value.normal) + value.constant) / denominator;

            // Return if the ray never intersects the plane
            return t >= 0.0 ? t : -1.0;
        }

        public at(value: number, out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            out.multiplyScalar(value, this.direction).add(this.origin);

            return out;
        }
    }
    /**
     * @internal
     */
    export const helpRay = Ray.create();
}