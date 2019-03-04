namespace egret3d {
    /**
     * 几何球体。
     */
    export class Sphere extends paper.BaseRelease<Sphere> implements paper.ICCS<Sphere>, paper.ISerializable, IRaycast {
        private static readonly _instances: Sphere[] = [];
        /**
         * 创建一个几何球体。
         * @param center 球体中心点。
         * @param radius 球体半径。
         */
        public static create(center: Readonly<IVector3> = Vector3.ZERO, radius: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(center, radius);
                instance._released = false;
                return instance;
            }

            return new Sphere().set(center, radius);
        }
        /**
         * 球体半径。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public radius: number = 0.0;
        /**
         * 球体中心点。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Sphere.create()` 创建实例。
         * @see egret3d.Sphere.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.center.x, this.center.y, this.center.z, this.radius];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            this.radius = value[3];
            this.center.fromArray(value);

            return this;
        }

        public clone() {
            return Sphere.create(this.center, this.radius);
        }

        public copy(value: Readonly<Sphere>) {
            return this.set(value.center, value.radius);
        }

        public set(center: Readonly<IVector3>, radius: number) {
            this.radius = radius;
            this.center.copy(center);

            return this;
        }

        public applyMatrix(matrix: Readonly<Matrix4>) {
            this.center.applyMatrix(matrix);
            this.radius = this.radius * matrix.maxScaleOnAxis;

            return this;
        }
        /**
         * 根据点集设置球体信息。
         * @param points 点集。
         * @param center 中心点。（不设置则自动计算）
         */
        public fromPoints(points: ArrayLike<IVector3>, center?: Readonly<IVector3>) {
            if (center) {
                this.center.copy(center);
            }
            else {
                this.center.copy(helpBoxA.fromPoints(points).center);
            }

            let maxRadiusSqrt = 0.0;
            for (let i = 0, l = points.length; i < l; i++) {
                maxRadiusSqrt = Math.max(maxRadiusSqrt, this.center.getDistance(points[i]));
            }

            this.radius = Math.sqrt(maxRadiusSqrt);

            return this;
        }
        /**
         * 是否包含指定的点或其他球体。
         * @param value 点或球体。
         */
        public contains(value: Readonly<IVector3 | Sphere>) {
            if (value instanceof Sphere) {
                const radiusDelta = this.radius - value.radius;
                if (radiusDelta >= 0.0) {
                    this.center.getSquaredDistance(value.center) <= (radiusDelta * radiusDelta);
                }

                return false;
            }

            return this.center.getSquaredDistance(value as IVector3) <= this.radius * this.radius;
        }
        /**
         * 获取一个点到该球体的最近点。（如果该点在球体内部，则最近点就是该点）
         * @param point 一个点。
         * @param out 最近点。
         */
        public getClosestPointToPoint(point: Readonly<IVector3>, out?: Vector3) {
            if (!out) {
                out = egret3d.Vector3.create();
            }

            const squaredDistance = this.center.getSquaredDistance(point);

            if (squaredDistance > (this.radius * this.radius)) {
                out.subtract(this.center, point).normalize();
                out.multiplyScalar(this.radius).add(this.center);
            }
            else {
                out.copy(point);
            }

            return out;
        }
        /**
         * 获取一点到该球体表面的最近距离。
         * @param value 点。
         */
        public getDistance(value: Readonly<IVector3>) {
            return this.center.getDistance(value) - this.radius;
        }

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const radius2 = this.radius * this.radius;
            const v1 = helpVector3A.subtract(this.center, ray.origin);
            const tca = v1.dot(ray.direction);
            const d2 = v1.dot(v1) - tca * tca;

            if (d2 > radius2) return false;

            const thc = Math.sqrt(radius2 - d2);

            // t0 = first intersect point - entrance on front of sphere
            const t0 = tca - thc;

            // t1 = second intersect point - exit point on back of sphere
            const t1 = tca + thc;

            if (t0 < 0.0 || t1 < 0.0) return false;

            if (raycastInfo) {
                const position = ray.getPointAt(t0, raycastInfo.position);
                const normal = raycastInfo.normal;
                raycastInfo.distance = t0;

                if (normal) {
                    normal.subtract(position, this.center).normalize();
                }
            }

            return true;
        }
    }
}
