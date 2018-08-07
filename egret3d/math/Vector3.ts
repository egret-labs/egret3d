namespace egret3d {

    export interface IVector3 {
        x: number;
        y: number;
        z: number;
    }

    export class Vector3 implements IVector3, paper.ISerializable {
        public static readonly ZERO: Readonly<Vector3> = new Vector3(0.0, 0.0, 0.0);
        public static readonly ONE: Readonly<Vector3> = new Vector3(1.0, 1.0, 1.0);
        public static readonly UP: Readonly<Vector3> = new Vector3(0.0, 1.0, 0.0);
        public static readonly DOWN: Readonly<Vector3> = new Vector3(0.0, -1.0, 0.0);
        public static readonly LEFT: Readonly<Vector3> = new Vector3(-1.0, 0.0, 0.0);
        public static readonly RIGHT: Readonly<Vector3> = new Vector3(1.0, 0.0, 0.0);
        public static readonly FORWARD: Readonly<Vector3> = new Vector3(0.0, 0.0, 1.0);
        public static readonly BACK: Readonly<Vector3> = new Vector3(0.0, 0.0, -1.0);

        private static readonly _instances: Vector3[] = [];

        public static create(x?: number, y?: number, z?: number) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(x, y, z);
            }

            return new Vector3(x, y, z);
        }

        public static release(value: Vector3) {
            if (this._instances.indexOf(value) >= 0) {
                return;
            }

            this._instances.push(value);
        }

        public static subtract(v1: Readonly<IVector3>, v2: Readonly<IVector3>, out: IVector3) {
            out.x = v1.x - v2.x;
            out.y = v1.y - v2.y;
            out.z = v1.z - v2.z;

            return out;
        }

        public static getSqrLength(v: Readonly<IVector3>) {
            return v.x * v.x + v.y * v.y + v.z * v.z;
        }

        public static getLength(v: Readonly<IVector3>) {
            return Math.sqrt(this.getSqrLength(v));
        }

        public static getDistance(a: Readonly<IVector3>, b: Readonly<IVector3>) {
            return this.getLength(this.subtract(a, b, helpVector));
        }

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

        public deserialize(element: Readonly<[number, number, number]>) {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];

            return this;
        }

        public copy(value: Readonly<IVector3>) {
            this.x = value.x;
            this.y = value.y;
            this.z = value.z;

            return this;
        }

        public clone() {
            const value = new Vector3();
            value.copy(this);

            return value;
        }

        public set(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        public normalize() {
            const l = this.length;
            if (l > Number.MIN_VALUE) {
                this.x /= l;
                this.y /= l;
                this.z /= l;
            }
            else {
                this.x = 1.0;
                this.y = 0.0;
                this.z = 0.0;
            }

            return this;
        }

        public scale(scale: number) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;

            return this;
        }

        public add(value: Readonly<IVector3>) {
            this.x += value.x;
            this.y += value.y;
            this.z += value.z;

            return this;
        }

        public subtract(value: Readonly<IVector3>) {
            this.x -= value.x;
            this.y -= value.y;
            this.z -= value.z;

            return this;
        }

        public multiply(value: Readonly<IVector3>) {
            this.x *= value.x;
            this.y *= value.y;
            this.z *= value.z;

            return this;
        }

        public cross(rhs: Readonly<IVector3>) {
            const x = this.x;
            const y = this.y;
            const z = this.z;
            this.x = y * rhs.z - z * rhs.y;
            this.y = z * rhs.x - x * rhs.z;
            this.z = x * rhs.y - y * rhs.x;

            return this;
        }

        public dot(value: Readonly<IVector3>) {
            return this.x * value.x + this.y * value.y + this.z * value.z;
        }

        public min(v1: Readonly<IVector3>, v2: Readonly<IVector3>) {
            this.x = Math.min(v1.x, v2.x);
            this.y = Math.min(v1.y, v2.y);
            this.z = Math.min(v1.z, v2.z);

            return this;
        }

        public max(v1: Readonly<IVector3>, v2: Readonly<IVector3>) {
            this.x = Math.max(v1.x, v2.x);
            this.y = Math.max(v1.y, v2.y);
            this.z = Math.max(v1.z, v2.z);

            return this;
        }

        public lerp(v1: Readonly<IVector3>, v2: Readonly<IVector3>, v: number) {
            this.x = v1.x * (1 - v) + v2.x * v;
            this.y = v1.y * (1 - v) + v2.y * v;
            this.z = v1.z * (1 - v) + v2.z * v;

            return this;
        }

        public equal(value: Readonly<IVector3>, threshold: number = 0.00001) {
            if (Math.abs(this.x - value.x) > threshold) {
                return false;
            }

            if (Math.abs(this.y - value.y) > threshold) {
                return false;
            }

            if (Math.abs(this.z - value.z) > threshold) {
                return false;
            }

            return true;
        }

        public getDistance(value: Readonly<IVector3>): number {
            return helpVector.copy(this).subtract(value).length;
        }

        public get length() {
            return Math.sqrt(this.sqrtLength);
        }

        public get sqrtLength() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        /**
         * @deprecated
         */
        public static set(x: number, y: number, z: number, out: Vector3): Vector3 {
            out.x = x;
            out.y = y;
            out.z = z;
            return out;
        }
        /**
         * @deprecated
         */
        public static normalize(v: IVector3) {
            let num: number = Vector3.getLength(v);
            if (num > Number.MIN_VALUE) {
                v.x = v.x / num;
                v.y = v.y / num;
                v.z = v.z / num;
            } else {
                v.x = 1.0;
                v.y = 0.0;
                v.z = 0.0;
            }
            return v;
        }
        /**
         * @deprecated
         */
        public static copy(v: Vector3, out: Vector3): Vector3 {
            out.x = v.x;
            out.y = v.y;
            out.z = v.z;
            return out;
        }
        /**
         * @deprecated
         */
        public static add(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = v1.x + v2.x;
            out.y = v1.y + v2.y;
            out.z = v1.z + v2.z;
            return out;
        }
        /**
         * @deprecated
         */
        public static multiply(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = v1.x * v2.x;
            out.y = v1.y * v2.y;
            out.z = v1.z * v2.z;
            return out;
        }
        /**
         * @deprecated
         */
        public static scale(v: Vector3, scale: number): Vector3 {
            v.x = v.x * scale;
            v.y = v.y * scale;
            v.z = v.z * scale;

            return v;
        }
        /**
         * @deprecated
         */
        public static cross(lhs: IVector3, rhs: IVector3, out: IVector3) {
            out.x = lhs.y * rhs.z - lhs.z * rhs.y;
            out.y = lhs.z * rhs.x - lhs.x * rhs.z;
            out.z = lhs.x * rhs.y - lhs.y * rhs.x;
            return out;
        }
        /**
         * @deprecated
         */
        public static dot(v1: Vector3, v2: Vector3): number {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        /**
         * @deprecated
         */
        public static min(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = Math.min(v1.x, v2.x);
            out.y = Math.min(v1.y, v2.y);
            out.z = Math.min(v1.z, v2.z);
            return out;
        }
        /**
         * @deprecated
         */
        public static max(v1: Vector3, v2: Vector3, out: Vector3): Vector3 {
            out.x = Math.max(v1.x, v2.x);
            out.y = Math.max(v1.y, v2.y);
            out.z = Math.max(v1.z, v2.z);
            return out;
        }
        /**
         * @deprecated
         */
        public static lerp(v1: Vector3, v2: Vector3, v: number, out: Vector3): Vector3 {
            out.x = v1.x * (1 - v) + v2.x * v;
            out.y = v1.y * (1 - v) + v2.y * v;
            out.z = v1.z * (1 - v) + v2.z * v;
            return out;
        }
        /**
         * @deprecated
         */
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

    const helpVector = new Vector3();

    export const helpVector3A: Vector3 = new Vector3();

    export const helpVector3B: Vector3 = new Vector3();

    export const helpVector3C: Vector3 = new Vector3();

    export const helpVector3D: Vector3 = new Vector3();

    export const helpVector3E: Vector3 = new Vector3();

    export const helpVector3F: Vector3 = new Vector3();

    export const helpVector3G: Vector3 = new Vector3();

    export const helpVector3H: Vector3 = new Vector3();
}