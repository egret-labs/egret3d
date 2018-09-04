namespace egret3d {

    export interface IVector3 {
        x: number;
        y: number;
        z: number;
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
    export class Vector3 implements IVector3, paper.IRelease<Vector3>, paper.ISerializable {
        public static readonly ZERO: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, 0.0);
        public static readonly ONE: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(1.0, 1.0, 1.0);
        public static readonly UP: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 1.0, 0.0);
        public static readonly DOWN: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, -1.0, 0.0);
        public static readonly LEFT: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(-1.0, 0.0, 0.0);
        public static readonly RIGHT: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(1.0, 0.0, 0.0);
        public static readonly FORWARD: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, 1.0);
        public static readonly BACK: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, -1.0);

        private static readonly _instances: Vector3[] = [];

        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(x, y, z);
            }

            return new Vector3().set(x, y, z);
        }

        public release() {
            if (Vector3._instances.indexOf(this) < 0) {
                Vector3._instances.push(this);
            }

            return this;
        }

        public x: number;

        public y: number;

        public z: number;
        /**
         * 请使用 `egret3d.Vector3.create()` 创建实例。
         * @see egret3d.Vector3.create()
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

        public deserialize(value: Readonly<[number, number, number]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<IVector3>) {
            return this.set(value.x, value.y, value.z);
        }

        public clone() {
            return Vector3.create(this.x, this.y, this.z);
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

        public set(x: number, y: number, z: number) {
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

        public fromPlaneProjection(plane: Readonly<Plane>, source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            return this.add(helpVector3A.multiplyScalar(-plane.getDistance(source), plane.normal));
        }

        public applyMatrix(matrix: Readonly<Matrix4>, source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            const x = source.x, y = source.y, z = source.z;
            const rawData = matrix.rawData;

            const w = 1.0 / (rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15]);
            this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
            this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
            this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;

            return this;
        }

        public applyDirection(matrix: Readonly<Matrix4>, source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            const x = source.x, y = source.y, z = source.z;
            const rawData = matrix.rawData;

            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;

            return this;
        }

        public applyQuaternion(quaternion: Readonly<IVector4>, source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            const x = source.x, y = source.y, z = source.z;
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

        public normalize(source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            let l = Math.sqrt(source.x * source.x + source.y * source.y + source.z * source.z);
            if (l > egret3d.EPSILON) {
                l = 1.0 / l;
                this.x *= l;
                this.y *= l;
                this.z *= l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 1.0;
            }

            return this;
        }

        public negate(source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            this.x = source.x * -1.00;
            this.y = source.y * -1.00;
            this.z = source.z * -1.00;
        }

        public addScalar(add: number, source?: Readonly<IVector3>) {
            if (source) {
                this.x = source.x + add;
                this.y = source.y + add;
                this.z = source.z + add;
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

        public multiplyScalar(scale: number, source?: Readonly<IVector3>) {
            if (source) {
                this.x = scale * source.x;
                this.y = scale * source.y;
                this.z = scale * source.z;
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

        public lerp(t: number, valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const p = 1.0 - t;
            this.x = valueA.x * p + valueB.x * t;
            this.y = valueA.y * p + valueB.y * t;
            this.z = valueA.z * p + valueB.z * t;

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

        public clamp(min: Readonly<IVector3>, max: Readonly<IVector3>, source?: Readonly<IVector3>) {
            if (!source) {
                source = this;
            }

            // assumes min < max, componentwise
            this.x = Math.max(min.x, Math.min(max.x, source.x));
            this.y = Math.max(min.y, Math.min(max.y, source.y));
            this.z = Math.max(min.z, Math.min(max.z, source.z));

            return this;
        }

        public getSquaredDistance(value: Readonly<IVector3>): number {
            return helpVector.subtract(value, this).squaredLength;
        }

        public getDistance(value: Readonly<IVector3>): number {
            return helpVector.subtract(value, this).length;
        }

        public closestToTriangle(triangle: Readonly<Triangle>, value?: Readonly<IVector3>) {
            if (!value) {
                value = this;
            }

            const vab = helpVector3A;
            const vac = helpVector3B;
            const vbc = helpVector3C;
            const vap = helpVector3D;
            const vbp = helpVector3E;
            const vcp = helpVector3F;

            const a = triangle.a, b = triangle.b, c = triangle.c;
            let v: number, w: number;

            // algorithm thanks to Real-Time Collision Detection by Christer Ericson,
            // published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
            // under the accompanying license; see chapter 5.1.5 for detailed explanation.
            // basically, we're distinguishing which of the voronoi regions of the triangle
            // the point lies in with the minimum amount of redundant computation.

            vab.subtract(b, a);
            vac.subtract(c, a);
            vap.subtract(value, a);
            const d1 = vab.dot(vap);
            const d2 = vac.dot(vap);
            if (d1 <= 0 && d2 <= 0) {
                // vertex region of A; barycentric coords (1, 0, 0)
                return this.copy(a);
            }

            vbp.subtract(value, b);
            const d3 = vab.dot(vbp);
            const d4 = vac.dot(vbp);
            if (d3 >= 0 && d4 <= d3) {

                // vertex region of B; barycentric coords (0, 1, 0)
                return this.copy(b);
            }

            const vc = d1 * d4 - d3 * d2;
            if (vc <= 0 && d1 >= 0 && d3 <= 0) {

                v = d1 / (d1 - d3);
                // edge region of AB; barycentric coords (1-v, v, 0)
                return this.multiplyScalar(v, vab).add(a);
            }

            vcp.subtract(value, c);
            const d5 = vab.dot(vcp);
            const d6 = vac.dot(vcp);
            if (d6 >= 0 && d5 <= d6) {

                // vertex region of C; barycentric coords (0, 0, 1)
                return this.copy(c);
            }

            const vb = d5 * d2 - d1 * d6;
            if (vb <= 0 && d2 >= 0 && d6 <= 0) {

                w = d2 / (d2 - d6);
                // edge region of AC; barycentric coords (1-w, 0, w)
                return this.multiplyScalar(w, vac).add(a);
            }

            const va = d3 * d6 - d5 * d4;
            if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {

                vbc.subtract(c, b);
                w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
                // edge region of BC; barycentric coords (0, 1-w, w)
                return this.multiplyScalar(w, vbc).add(b); // edge region of BC
            }

            // face region
            const denom = 1 / (va + vb + vc);
            // u = va * denom
            v = vb * denom;
            w = vc * denom;
            return this.add(a, vac.multiplyScalar(w).add(vab.multiplyScalar(v)));
        }

        public toArray(value: number[] | Float32Array, offset: number = 0) {
            value[0 + offset] = this.x;
            value[1 + offset] = this.y;
            value[2 + offset] = this.z;

            return value;
        }

        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        public get squaredLength() {
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

    export const helpVector3A = Vector3.create();

    export const helpVector3B = Vector3.create();

    export const helpVector3C = Vector3.create();

    export const helpVector3D = Vector3.create();

    export const helpVector3E = Vector3.create();

    export const helpVector3F = Vector3.create();

    export const helpVector3G = Vector3.create();

    export const helpVector3H = Vector3.create();
}