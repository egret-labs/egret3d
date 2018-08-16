namespace egret3d {

    export interface IVector4 {
        x: number;
        y: number;
        z: number;
        w: number;
        readonly length: number;
    }

    export class Vector4 implements IVector4, paper.ISerializable {

        public x: number;

        public y: number;

        public z: number;

        public w: number;
        /**
         * @deprecated
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 0.0) {
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
            this.x = value.x;
            this.y = value.y;
            this.z = value.z;
            this.w = value.w;

            return this;
        }

        public clone() {
            const value = new Vector4();
            value.copy(this);

            return value;
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

        public normalize(value?: Readonly<IVector4>) {
            if (!value) {
                value = this;
            }

            let l = value.length;

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
    }

    export const helpVector4A = new Vector4();

    export const helpVector4B = new Vector4();

    export const helpVector4C = new Vector4();

    export const helpVector4D = new Vector4();

    export const helpVector4E = new Vector4();

    export const helpVector4F = new Vector4();
}