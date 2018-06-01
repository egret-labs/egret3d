namespace egret3d {

    export class Vector3 implements paper.ISerializable {

        public static readonly ONE: Readonly<Vector3> = new Vector3(1.0, 1.0, 1.0);

        public x: number;

        public y: number;

        public z: number;

        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public serialize() {
            return [this.x, this.y, this.z];
        }

        public deserialize(element: [number, number, number]) {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
        }

        public static set(x: number, y: number, z: number, out: Vector3): Vector3 {
            out.x = x;
            out.y = y;
            out.z = z;
            return out;
        }

        public static normalize(v: Vector3): Vector3 {
            let num: number = Vector3.getLength(v);
            if (num > Number.MIN_VALUE) {
                v.x = v.x / num;
                v.y = v.y / num;
                v.z = v.z / num;
            } else {
                v.x = 0;
                v.y = 0;
                v.z = 0;
            }
            return v;
        }

        public static copy(v: Vector3, out: Vector3): Vector3 {
            out.x = v.x;
            out.y = v.y;
            out.z = v.z;
            return out;
        }

        public static add(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = v1.x + v2.x;
            out.y = v1.y + v2.y;
            out.z = v1.z + v2.z;
            return out;
        }

        public static subtract(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = v1.x - v2.x;
            out.y = v1.y - v2.y;
            out.z = v1.z - v2.z;
            return out;
        }

        public static multiply(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = v1.x * v2.x;
            out.y = v1.y * v2.y;
            out.z = v1.z * v2.z;
            return out;
        }

        public static scale(v: Vector3, scale: number): Vector3 {
            v.x = v.x * scale;
            v.y = v.y * scale;
            v.z = v.z * scale;

            return v;
        }

        public static cross(lhs: Vector3, rhs: Vector3, out: Vector3): Vector3 {
            out.x = lhs.y * rhs.z - lhs.z * rhs.y;
            out.y = lhs.z * rhs.x - lhs.x * rhs.z;
            out.z = lhs.x * rhs.y - lhs.y * rhs.x;
            return out;
        }

        public static dot(v1: Vector3, v2: Vector3): number {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }

        public static getLength(v: Vector3): number {
            return Math.sqrt(this.getSqrLength(v));
        }

        public static getSqrLength(v: Vector3): number {
            return v.x * v.x + v.y * v.y + v.z * v.z;
        }

        public static getDistance(a: Vector3, b: Vector3): number {
            this.subtract(a, b, helpVector3H);
            return this.getLength(helpVector3H);
        }

        public static min(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = Math.min(v1.x, v2.x);
            out.y = Math.min(v1.y, v2.y);
            out.z = Math.min(v1.z, v2.z);
            return out;
        }

        public static max(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = Math.max(v1.x, v2.x);
            out.y = Math.max(v1.y, v2.y);
            out.z = Math.max(v1.z, v2.z);
            return out;
        }

        public static lerp(v1: Vector3, v2: Vector3, v: number, out: Vector3): Vector3 {
            out.x = v1.x * (1 - v) + v2.x * v;
            out.y = v1.y * (1 - v) + v2.y * v;
            out.z = v1.z * (1 - v) + v2.z * v;
            return out;
        }

        public static equal(v1: Vector3, v2: Vector3, threshold: number = 0.00001): boolean {
            if (Math.abs(v1.x - v2.x) > threshold) {
                return false;
            }

            if (Math.abs(v1.y - v2.y) > threshold) {
                return false;
            }

            if (Math.abs(v1.z - v2.z) > threshold) {
                return false;
            }

            return true;
        }
    }

    export const helpVector3A: Vector3 = new Vector3();

    export const helpVector3B: Vector3 = new Vector3();

    export const helpVector3C: Vector3 = new Vector3();

    export const helpVector3D: Vector3 = new Vector3();

    export const helpVector3E: Vector3 = new Vector3();

    export const helpVector3F: Vector3 = new Vector3();

    export const helpVector3G: Vector3 = new Vector3();

    export const helpVector3H: Vector3 = new Vector3();
}