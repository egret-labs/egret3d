namespace egret3d {
    /**
     * 
     */
    export class Spherical extends paper.BaseRelease<Spherical> implements paper.ICCS<Spherical>, paper.ISerializable {
        private static readonly _instances: Spherical[] = [];
        /**
         * 
         */
        public static create(radius: number = 1.0, phi: number = 0.0, theta: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(radius, phi, theta);
                instance._released = false;
                return instance;
            }

            return new Spherical().set(radius, phi, theta);
        }
        /**
         * 
         */
        public radius: number = 1.0;
        /**
         * 
         */
        public phi: number = 0.0;
        /**
         * 
         */
        public theta: number = 0.0;
        /**
         * 请使用 `egret3d.Spherical.create()` 创建实例。
         * @see egret3d.Spherical.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.radius, this.phi, this.theta];
        }

        public deserialize(value: Readonly<[number, number, number]>) {
            this.radius = value[0];
            this.phi = value[1];
            this.theta = value[2];

            return this;
        }

        public clone() {
            return Spherical.create(this.radius, this.phi, this.theta);
        }

        public copy(value: Readonly<Spherical>) {
            return this.set(value.radius, value.phi, value.theta);
        }

        public set(radius: number, phi: number, theta: number) {
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;

            return this;
        }

        public fromCartesianCoords(vector3: Readonly<IVector3>): this;
        public fromCartesianCoords(x: number, y: number, z: number): this;
        public fromCartesianCoords(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                p3 = (p1 as Readonly<IVector3>).z;
                p2 = (p1 as Readonly<IVector3>).y;
                p1 = (p1 as Readonly<IVector3>).x;
            }

            this.radius = Math.sqrt((p1 as number) * (p1 as number) + (p2 as number) * (p2 as number) + (p3 as number) * (p3 as number));

            if (this.radius === 0.0) {
                this.theta = 0.0;
                this.phi = 0.0;
            }
            else {
                this.theta = Math.atan2((p1 as number), (p3 as number)); // TODO
                this.phi = Math.acos(math.clamp((p2 as number) / this.radius, -1.0, 1.0));
            }

            return this;
        }

        public makeSafe() {
            const EPS = 0.000001;
            this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

            return this;
        }
    }
}