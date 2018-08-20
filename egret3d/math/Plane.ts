namespace egret3d {
    /**
     * 
     */
    export class Plane implements paper.IRelease<Plane>, paper.ISerializable {

        private static readonly _instances: Plane[] = [];
        /**
         * 
         */
        public static create(normal: Readonly<IVector3> = Vector3.ZERO, constant: number = 0.0) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(normal, constant);
            }

            return new Plane().set(normal, constant);
        }

        public release() {
            if (Plane._instances.indexOf(this) < 0) {
                Plane._instances.push(this);
            }

            return this;
        }
        /**
         * 
         */
        public constant: number = 0.0;
        /**
         * 
         */
        public readonly normal: Vector3 = Vector3.create();

        private constructor() {
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

        public getDistance(value: Readonly<IVector3>) {
            return this.normal.dot(value) + this.constant;
        }

        public normalize(value?: Readonly<Plane>) {
            if (!value) {
                value = this;
            }

            this.constant = value.constant * (1.0 / value.normal.length);
            this.normal.normalize(value.normal);

            return this;
        }

        public negate(value?: Readonly<Plane>) {
            if (!value) {
                value = this;
            }

            this.constant = value.constant * -1.0;
            this.normal.negate(value.normal);

            return this;
        }
    }
}