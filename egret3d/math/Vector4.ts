namespace egret3d {

    export interface IVector4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    export class Vector4 implements IVector4, paper.ISerializable {

        public x: number;

        public y: number;

        public z: number;

        public w: number;

        constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public serialize() {
            return [this.x, this.y, this.z, this.w];
        }

        public deserialize(element: [number, number, number, number]) {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
            this.w = element[3];
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

        public normalize() {
            const l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            if (l > Number.MIN_VALUE) {
                this.x /= l;
                this.y /= l;
                this.z /= l;
                this.w /= l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 1.0;
            }

            return this;
        }
    }

    export const helpVector4A = new Vector4();

    export const helpVector4B = new Vector4();

    export const helpVector4C = new Vector4();

    export const helpVector4D = new Vector4();

    export const helpVector4E = new Vector4();

    export const helpVector4F = new Vector4();

}