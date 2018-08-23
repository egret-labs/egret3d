namespace egret3d {

    export interface IVector4 extends IVector3 {
        w: number;
    }

    export class Vector4 implements IVector4, paper.IRelease<Vector4>, paper.ISerializable {

        private static readonly _instances: Vector4[] = [];

        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(x, y, z, w);
            }

            return new Vector4().set(x, y, z, w);
        }

        public release() {
            if (Vector4._instances.indexOf(this) < 0) {
                Vector4._instances.push(this);
            }

            return this;
        }

        public x: number;

        public y: number;

        public z: number;

        public w: number;
        /**
         * @deprecated
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public serialize() {
            return [this.x, this.y, this.z, this.w];
        }

        public deserialize(element: Readonly<[number, number, number, number]>) {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
            this.w = element[3];

            return this;
        }

        public copy(value: Readonly<IVector4>) {
            return this.set(value.x, value.y, value.z, value.w);
        }

        public clone() {
            return Vector4.create(this.x, this.y, this.z, this.w);
        }

        public set(x: number, y: number, z: number, w: number) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];
            this.w = value[offset + 3];

            return this;
        }

        public normalize(source?: Readonly<IVector4>) {
            if (!source) {
                source = this;
            }

            let l = Math.sqrt(source.x * source.x + source.y * source.y + source.z * source.z + source.w * source.w);
            if (l > egret3d.EPSILON) {
                l = 1.0 / l;
                this.x *= l;
                this.y *= l;
                this.z *= l;
                this.w *= l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 1.0;
            }

            return this;
        }

        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }

        public get squaredLength() {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }
    }

    export const helpVector4A = new Vector4();

    export const helpVector4B = new Vector4();

    export const helpVector4C = new Vector4();

    export const helpVector4D = new Vector4();

    export const helpVector4E = new Vector4();

    export const helpVector4F = new Vector4();
}