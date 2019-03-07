namespace egret3d {
    /**
     * 几何平面。
     */
    export class Plane extends paper.BaseRelease<Plane> implements paper.ICCS<Plane>, paper.ISerializable, IRaycast {
        public static UP: Readonly<Plane> = new Plane().set(Vector3.UP, 0.0);
        public static DOWN: Readonly<Plane> = new Plane().set(Vector3.DOWN, 0.0);
        public static LEFT: Readonly<Plane> = new Plane().set(Vector3.BACK, 0.0);
        public static RIGHT: Readonly<Plane> = new Plane().set(Vector3.BACK, 0.0);
        public static FORWARD: Readonly<Plane> = new Plane().set(Vector3.FORWARD, 0.0);
        public static BACK: Readonly<Plane> = new Plane().set(Vector3.BACK, 0.0);

        private static readonly _instances: Plane[] = [];
        /**
         * 创建一个几何平面。
         * @param normal 法线。
         * @param constant 二维平面离原点的距离。
         */
        public static create(normal: Readonly<IVector3> = Vector3.ZERO, constant: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(normal, constant);
                instance._released = false;
                return instance;
            }

            return new Plane().set(normal, constant);
        }
        /**
         * 二维平面到原点的距离。
         */
        public constant: number = 0.0;
        /**
         * 平面的法线。
         */
        public readonly normal: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Plane.create()` 创建实例。
         * @see egret3d.Plane.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return this.toArray();
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            this.normal.fromArray(value);
            this.constant = value[3];

            return this;
        }

        public clone() {
            return Plane.create(this.normal, this.constant);
        }

        public copy(value: Readonly<Plane>) {
            return this.set(value.normal, value.constant);
        }

        public set(normal: Readonly<IVector3>, constant: number = 0.0) {
            this.constant = constant;
            this.normal.copy(normal);

            return this;
        }

        public fromArray(array: ArrayLike<number>, offset: uint = 0) {
            this.normal.fromArray(array, offset);
            this.constant = array[offset + 3];

            return this;
        }

        public fromPoint(point: Readonly<IVector3>, normal: Vector3 = Vector3.UP) {
            this.constant = -normal.dot(point);
            this.normal.copy(normal);

            return this;
        }

        public fromPoints(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>, valueC: Readonly<IVector3>) {
            const normal = helpVector3A.subtract(valueC, valueB).cross(helpVector3B.subtract(valueA, valueB)).normalize();
            this.fromPoint(valueA, normal);

            return this;
        }

        public normalize(input?: Readonly<Plane>) {
            if (!input) {
                input = this;
            }

            const inverseNormalLength = 1.0 / input.normal.length;
            this.constant = input.constant * inverseNormalLength;
            this.normal.multiplyScalar(inverseNormalLength, input.normal);

            return this;
        }

        public negate(input?: Readonly<Plane>) {
            if (!input) {
                input = this;
            }

            this.constant = -input.constant;
            this.normal.negate(input.normal);

            return this;
        }

        public applyMatrix(matrix: Readonly<Matrix4>, normalMatrix?: Readonly<Matrix3>) {
            if (!normalMatrix) {
                normalMatrix = helpMatrix3A.getNormalMatrix(matrix);
            }

            const referencePoint = this.getCoplanarPoint(helpVector3A).applyMatrix(matrix);
            const normal = this.normal.applyMatrix3(normalMatrix).normalize();
            this.constant = -referencePoint.dot(normal);

            return this;
        }

        public getDistance(point: Readonly<IVector3>) {
            return this.normal.dot(point) + this.constant;
        }

        public getProjectionPoint(point: Readonly<IVector3>, output?: Vector3) {
            if (!output) {
                output = Vector3.create();
            }

            return output.multiplyScalar(-this.getDistance(point), this.normal).add(point);
        }

        public getCoplanarPoint(output?: Vector3) {
            if (!output) {
                output = Vector3.create();
            }

            return output.copy(this.normal).multiplyScalar(-this.constant);
        }

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            const t = ray.getDistanceToPlane(this);
            if (t > 0.0) {
                if (raycastInfo) {
                    const normal = raycastInfo.normal;
                    raycastInfo.distance = t;
                    ray.getPointAt(t, raycastInfo.position);

                    if (normal) {
                        // TODO
                        normal.copy(this.normal);
                    }
                }

                return true;
            }

            return false;
        }

        public toArray(array?: number[] | Float32Array, offset: number = 0) {
            if (!array) {
                array = [];
            }

            this.normal.toArray(array, offset);
            array[offset + 3] = this.constant;

            return array;
        }
    }
    /**
     * @internal
     */
    const helpPlane = Plane.create();
}