namespace egret3d {
    /**
     * 
     */
    export class Plane extends paper.BaseRelease<Plane> implements paper.ICCS<Plane>, paper.ISerializable, IRaycast {

        private static readonly _instances: Plane[] = [];
        /**
         * 
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
         * 
         */
        public constant: number = 0.0;
        /**
         * 
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
            return [this.normal.x, this.normal.y, this.normal.z, this.constant];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            this.constant = value[3];
            this.normal.fromArray(value);

            return this;
        }

        public clone() {
            return Plane.create(this.normal, this.constant);
        }

        public copy(value: Readonly<Plane>) {
            return this.set(value.normal, value.constant);
        }

        public set(normal: Readonly<IVector3>, constant: number) {
            this.constant = constant;
            this.normal.copy(normal);

            return this;
        }

        public fromPoint(value: Readonly<IVector3>, normal: Readonly<IVector3> = Vector3.UP) {
            this.constant = -helpVector3A.dot(normal, value);
            this.normal.copy(normal);

            return this;
        }

        public fromPoints(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>, valueC: Readonly<IVector3>) {
            const normal = helpVector3A.subtract(valueC, valueB).cross(helpVector3B.subtract(valueA, valueB)).normalize();
            this.fromPoint(valueA, normal);

            return this;
        }

        public normalize(source?: Readonly<Plane>) {
            if (!source) {
                source = this;
            }

            const inverseNormalLength = source.normal.length;
            this.constant = source.constant * (1.0 / inverseNormalLength);
            this.normal.multiplyScalar(inverseNormalLength, source.normal);

            return this;
        }

        public negate(source?: Readonly<Plane>) {
            if (!source) {
                source = this;
            }

            this.constant = -source.constant;
            this.normal.negate(source.normal);

            return this;
        }

        public getDistance(value: Readonly<IVector3>) {
            return this.normal.dot(value) + this.constant;
        }

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const t = ray.getDistanceToPlane(this);
            if (t > 0.0) {
                if (raycastInfo) {
                    raycastInfo.distance = t;
                    ray.at(t, raycastInfo.position);
                }

                return true;
            }

            return false;
        }
    }
}