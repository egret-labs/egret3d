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
     * 射线检测接口。
     */
    export interface IRaycast {
        /**
         * 射线检测。
         * @param ray 射线。
         * @param raycastInfo 是否将检测的详细数据写入 raycastInfo。
         */
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo): boolean;
    }
    /**
     * 射线检测信息。
     */
    export class RaycastInfo extends paper.BaseRelease<RaycastInfo>  {
        private static readonly _instances: RaycastInfo[] = [];
        /**
         * 创建一个射线检测信息实例。
         */
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new RaycastInfo();
        }

        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        /**
         * 交点到射线起始点的距离。
         */
        public distance: number = 0.0;
        /**
         * 相交的点。
         */
        public readonly position: Vector3 = Vector3.create();
        public readonly textureCoordA: Vector2 = Vector2.create();
        public readonly textureCoordB: Vector2 = Vector2.create();
        /**
         * 相交的法线。
         * - 提供法线向量将计算法线。
         */
        public normal: Vector3 | null = null;
        /**
         * 相交的变换组件。（如果有的话）
         */
        public transform: Transform | null = null;
        /**
         * 相交的碰撞组件。（如果有的话）
         */
        public collider: ICollider | null = null;
        /**
         * 相交的刚体组件。（如果有的话）
         */
        public rigidbody: any | null = null;

        private constructor() {
            super();
        }

        public onClear() {
            this.subMeshIndex = -1;
            this.triangleIndex = -1;
            this.distance = 0.0;
            this.position.set(0.0, 0.0, 0.0);
            this.textureCoordA.set(0.0, 0.0);
            this.textureCoordB.set(0.0, 0.0);
            this.normal = null;
            this.transform = null;
            this.collider = null;
            this.rigidbody = null;
        }
    }
    /**
     * @internal
     */
    export const helpRay = Ray.create();
}