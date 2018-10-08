namespace egret3d {
    /**
     * 
     */
    export class Triangle extends paper.BaseRelease<AABB> implements paper.ICCS<Triangle>, paper.ISerializable {

        private static readonly _instances: Triangle[] = [];

        public static create(a: Readonly<IVector3> = Vector3.ZERO, b: Readonly<IVector3> = Vector3.ZERO, c: Readonly<IVector3> = Vector3.ZERO) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(a, b, c);
                instance._released = false;
                return instance;
            }

            return new Triangle().set(a, b, c);
        }

        public readonly a: Vector3 = Vector3.create();
        public readonly b: Vector3 = Vector3.create();
        public readonly c: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Triangle.create()` 创建实例。
         * @see egret3d.Triangle.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [
                this.a.x, this.a.y, this.a.z,
                this.b.x, this.b.y, this.b.z,
                this.c.x, this.c.y, this.c.z,
            ];
        }

        public deserialize(element: Readonly<[number, number, number, number, number, number, number, number, number]>) {
            return this.fromArray(element);
        }

        public copy(value: Readonly<Triangle>) {
            return this.set(value.a, value.b, value.c);
        }

        public clone() {
            return Triangle.create(this.a, this.b, this.c);
        }

        public set(a: Readonly<IVector3> = Vector3.ZERO, b: Readonly<IVector3> = Vector3.ZERO, c: Readonly<IVector3> = Vector3.ZERO) {
            this.a.copy(a);
            this.b.copy(b);
            this.c.copy(c);

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offsetA: number = 0, offsetB: number = -1, offsetC: number = -1) {
            this.a.fromArray(value, offsetA);
            this.b.fromArray(value, offsetB >= 0 ? offsetB : offsetA + 3);
            this.c.fromArray(value, offsetC >= 0 ? offsetC : offsetA + 6);
        }

        public getCenter(value: Vector3) {
            return value.add(this.a, this.b).add(this.c).multiplyScalar(1.0 / 3.0);
        }

        public getNormal(value: Vector3) {
            return getNormal(this.a, this.b, this.c, value);
        }

        public getArea() {
            helpVector3A.subtract(this.c, this.b);
            helpVector3B.subtract(this.a, this.b);

            return helpVector3A.cross(helpVector3B).length * 0.5;
        }
    }
}