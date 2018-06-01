namespace egret3d {

    export class Vector4 implements paper.ISerializable {

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

        public deserialize(element: number[]): void {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
            this.w = element[3];
        }

        public static set(x: number, y: number, z: number, w: number, out: Vector4): Vector4 {
            out.x = x;
            out.y = y;
            out.z = z;
            out.w = w;

            return out;
        }

        public static copy(v: Vector4, out: Vector4): Vector4 {
            out.x = v.x;
            out.y = v.y;
            out.z = v.z;
            out.w = v.w;

            return out;
        }

    }

    export const helpVector4A = new Vector4();

    export const helpVector4B = new Vector4();

    export const helpVector4C = new Vector4();

    export const helpVector4D = new Vector4();

    export const helpVector4E = new Vector4();

    export const helpVector4F = new Vector4();

}