namespace egret3d {

    export interface IVector3 {
        x: number;
        y: number;
        z: number;
        readonly length: number;
    }
    /**
     * 
     */
    export const enum EulerOrder {
        XYZ,
        XZY,
        YXZ,
        YZX,
        ZXY,
        ZYX,
    }
    /**
     * 
     */
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

        public x: number;

        public y: number;

        public z: number;
        /**
         * @deprecated
         * @private
         */
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
            const value = Vector3.create();
            value.copy(this);

            return value;
        }

        public equal(value: Readonly<IVector3>, threshold: number = 0.000001) {
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

        public set(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];

            return this;
        }

        public applyMatrix(matrix: Readonly<Matrix>, value?: Readonly<IVector3>) {
            if (!value) {
                value = this;
            }

            const x = value.x, y = value.y, z = value.z;
            const rawData = matrix.rawData;

            const w = 1.0 / (rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15]);
            this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
            this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
            this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;

            return this;
        }

        public applyDirection(matrix: Readonly<Matrix>, value?: Readonly<IVector3>) {
            if (!value) {
                value = this;
            }

            const x = value.x, y = value.y, z = value.z;
            const rawData = matrix.rawData;

            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;

            return this;
        }

        public applyQuaternion(quaternion: Readonly<IVector4>, value?: Readonly<IVector3>) {
            if (!value) {
                value = this;
            }

            const x = value.x, y = value.y, z = value.z;
            const qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;
            // calculate quat * vector
            const ix = qw * x + qy * z - qz * y;
            const iy = qw * y + qz * x - qx * z;
            const iz = qw * z + qx * y - qy * x;
            const iw = - qx * x - qy * y - qz * z;
            // calculate result * inverse quat
            this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
            this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
            this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

            return this;
        }

        public normalize(value?: Readonly<IVector3>) {
            if (!value) {
                value = this;
            }

            let l = value.length;
            if (l > egret3d.EPSILON) {
                l = 1.0 / l;
                this.x *= l;
                this.y *= l;
                this.z *= l;
            }
            else {
                this.x = 1.0;
                this.y = 0.0;
                this.z = 0.0;
            }

            return this;
        }

        public addScalar(add: number, value?: Readonly<IVector3>) {
            if (value) {
                this.x = value.x + add;
                this.y = value.y + add;
                this.z = value.z + add;
            }
            else {
                this.x += add;
                this.y += add;
                this.z += add;
            }

            return this;
        }

        public add(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (valueB) {
                this.x = valueA.x + valueB.x;
                this.y = valueA.y + valueB.y;
                this.z = valueA.z + valueB.z;
            }
            else {
                this.x += valueA.x;
                this.y += valueA.y;
                this.z += valueA.z;
            }

            return this;
        }

        public subtract(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (valueB) {
                this.x = valueA.x - valueB.x;
                this.y = valueA.y - valueB.y;
                this.z = valueA.z - valueB.z;
            }
            else {
                this.x -= valueA.x;
                this.y -= valueA.y;
                this.z -= valueA.z;
            }

            return this;
        }

        public multiplyScalar(scale: number, value?: Readonly<IVector3>) {
            if (value) {
                this.x = scale * value.x;
                this.y = scale * value.y;
                this.z = scale * value.z;
            }
            else {
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
            }

            return this;
        }

        public multiply(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (valueB) {
                this.x = valueA.x * valueB.x;
                this.y = valueA.y * valueB.y;
                this.z = valueA.z * valueB.z;
            }
            else {
                this.x *= valueA.x;
                this.y *= valueA.y;
                this.z *= valueA.z;
            }

            return this;
        }

        public dot(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            return valueA.x * valueB.x + valueA.y * valueB.y + valueA.z * valueB.z;
        }

        public cross(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const x = valueA.x;
            const y = valueA.y;
            const z = valueA.z;

            this.x = y * valueB.z - z * valueB.y;
            this.y = z * valueB.x - x * valueB.z;
            this.z = x * valueB.y - y * valueB.x;

            return this;
        }

        public lerp(v: number, valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const p = 1.0 - v;
            this.x = valueA.x * p + valueB.x * v;
            this.y = valueA.y * p + valueB.y * v;
            this.z = valueA.z * p + valueB.z * v;

            return this;
        }

        public min(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.x = Math.min(valueA.x, valueB.x);
            this.y = Math.min(valueA.y, valueB.y);
            this.z = Math.min(valueA.z, valueB.z);

            return this;
        }

        public max(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.x = Math.max(valueA.x, valueB.x);
            this.y = Math.max(valueA.y, valueB.y);
            this.z = Math.max(valueA.z, valueB.z);

            return this;
        }

        public getDistance(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>): number {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            return helpVector.subtract(valueA, valueB).length;
        }

        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
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
        /**
         * @deprecated
         */
        public static subtract(v1: Readonly<IVector3>, v2: Readonly<IVector3>, out: IVector3) {
            out.x = v1.x - v2.x;
            out.y = v1.y - v2.y;
            out.z = v1.z - v2.z;

            return out;
        }
        /**
         * @deprecated
         */
        public static getSqrLength(v: Readonly<IVector3>) {
            return v.x * v.x + v.y * v.y + v.z * v.z;
        }
        /**
         * @deprecated
         */
        public static getLength(v: Readonly<IVector3>) {
            return Math.sqrt(this.getSqrLength(v));
        }
        /**
         * @deprecated
         */
        public static getDistance(a: Readonly<IVector3>, b: Readonly<IVector3>) {
            return this.getLength(this.subtract(a, b, helpVector));
        }
    }

    const helpVector = Vector3.create();

    export const helpVector3A: Vector3 = Vector3.create();

    export const helpVector3B: Vector3 = Vector3.create();

    export const helpVector3C: Vector3 = Vector3.create();

    export const helpVector3D: Vector3 = Vector3.create();

    export const helpVector3E: Vector3 = Vector3.create();

    export const helpVector3F: Vector3 = Vector3.create();

    export const helpVector3G: Vector3 = Vector3.create();

    export const helpVector3H: Vector3 = Vector3.create();
}