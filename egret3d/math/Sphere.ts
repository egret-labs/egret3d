namespace egret3d {
    /**
     * 
     */
    export class Sphere implements paper.IRelease<Sphere>, paper.ISerializable {

        private static readonly _instances: Sphere[] = [];
        /**
         * 
         * @param center 
         * @param radius 
         */
        public static create(center: Readonly<IVector3> = Vector3.ZERO, radius: number = 0.0) {
            if (this._instances.length > 0) {
                return this._instances.pop();
            }

            return new Sphere().set(center, radius);
        }
        /**
         * 
         */
        public release() {
            if (Sphere._instances.indexOf(this) < 0) {
                Sphere._instances.push(this);
            }

            return this;
        }
        /**
         * 
         */
        public radius: number = 0.0;
        /**
         * 
         */
        public readonly center: Vector3 = Vector3.create();

        private constructor() {
        }

        public serialize() {
            return [this.center.x, this.center.y, this.center.z, this.radius];
        }

        public deserialize(value: Readonly<[number, number, number]>) {
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

        public fromPoints(points: Readonly<ArrayLike<IVector3>>, center?: Readonly<IVector3>) {
            if (center) {
                this.center.copy(center);
            }
            else {
                this.center.copy(helpAABBA.fromPoints(points).center);
            }

            let maxRadiusSqrt = 0.0;
            for (let i = 0, l = points.length; i < l; i++) {
                maxRadiusSqrt = Math.max(maxRadiusSqrt, this.center.getDistance(points[i]));
            }

            this.radius = Math.sqrt(maxRadiusSqrt);

            return this;
        }

        public applyMatrix(matrix: Readonly<Matrix4>) {
            this.center.applyMatrix(matrix);
            this.radius = this.radius * matrix.getMaxScaleOnAxis();

            return this;

        }

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

        public getDistance(value: Readonly<IVector3>) {
            return this.center.getDistance(value) - this.radius;
        }

        public clampPoint(point: Readonly<IVector3>, out: Vector3) {
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
    }
}