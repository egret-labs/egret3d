namespace egret3d {

    /**
     * 三维向量接口。
     */
    export interface IVector3 extends IVector2 {
        z: number;
    }

    /**
     * 欧拉旋转顺序。
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
     * 三维向量。
     */
    export class Vector3 extends paper.BaseRelease<Vector3> implements IVector3, paper.ICCS<Vector3>, paper.ISerializable {

        /**
         * 零向量。
         */
        public static readonly ZERO: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, 0.0);

        /**
         * 三方向均为一的向量。
         */
        public static readonly ONE: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(1.0, 1.0, 1.0);

        /**
         * 三方向均为负一的向量。
         */
        public static readonly MINUS_ONE: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(-1.0, -1.0, -1.0);

        /**
         * 上向量。
         */
        public static readonly UP: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 1.0, 0.0);

        /**
         * 下向量。
         */
        public static readonly DOWN: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, -1.0, 0.0);

        /**
         * 左向量。
         */
        public static readonly LEFT: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(-1.0, 0.0, 0.0);

        /**
         * 右向量。
         */
        public static readonly RIGHT: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(1.0, 0.0, 0.0);

        /**
         * 前向量。
         */
        public static readonly FORWARD: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, 1.0);

        /**
         * 后向量。
         */
        public static readonly BACK: Readonly<IVector3> & { clone: () => Vector3 } = new Vector3(0.0, 0.0, -1.0);

        private static readonly _instances: Vector3[] = [];

        /**
         * 创建一个三维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         * @param z Z 轴分量。
         */
        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z);
                instance._released = false;
                return instance;
            }

            return new Vector3().set(x, y, z);
        }

        /**
         * X 轴分量。
         */
        public x: number;

        /**
         * Y 轴分量。
         */
        public y: number;

        /**
         * Z 轴分量。
         */
        public z: number;

        /**
         * 请使用 `egret3d.Vector3.create()` 创建实例。
         * @see egret3d.Vector3.create()
         * @deprecated
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
            super();

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

        public set(x: number, y: number, z: number) {
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        /**
         * 通过数组设置该向量。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public fromArray(array: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;
        }

        public clear() {
            this.x = 0;
            this.y = 0;
            this.z = 0;

            return this;
        }

        /**
         * 向量归一化。
         * - `v.normalize()` 归一化该向量，相当于 v /= v.length。
         * - `v.normalize(input)` 将输入向量归一化的结果写入该向量，相当于 v = input / input.length。
         * @param input 输入向量。
         * @param defaultVector 如果该向量的长度为 0，则默认归一化的向量。
         */
        public normalize(input?: Readonly<IVector3>, defaultVector: Readonly<IVector3> = Vector3.FORWARD) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            let l = Math.sqrt(x * x + y * y + z * z);

            if (l > Const.EPSILON) {
                l = 1.0 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
            }
            else {
                this.copy(defaultVector);
            }

            return this;
        }

        /**
         * 
         * @param input 输入向量。
         */
        public negate(input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            this.x = input.x * -1.0;
            this.y = input.y * -1.0;
            this.z = input.z * -1.0;

            return this;
        }

        /**
         * 判断该向量是否和一个向量相等。
         * @param value 一个向量。
         * @param threshold 阈值。
         */
        public equal(value: Readonly<IVector3>, threshold: number = Const.EPSILON) {
            if (
                Math.abs(this.x - value.x) <= threshold &&
                Math.abs(this.y - value.y) <= threshold &&
                Math.abs(this.z - value.z) <= threshold
            ) {
                return true;
            }

            return false;
        }

        public fromSphericalCoords(vector3: Readonly<IVector3>): this;
        public fromSphericalCoords(radius: number, phi: number, theta: number): this;
        public fromSphericalCoords(p1: Readonly<IVector3> | number, p2?: number, p3?: number) {
            if (p1.hasOwnProperty("x")) {
                p3 = (p1 as Readonly<IVector3>).z;
                p2 = (p1 as Readonly<IVector3>).y;
                p1 = (p1 as Readonly<IVector3>).x;
            }

            const sinPhiRadius = Math.sin(p2) * (p1 as number);
            this.x = sinPhiRadius * Math.sin(p3);
            this.y = Math.cos(p2) * (p1 as number);
            this.z = sinPhiRadius * Math.cos(p3);

            return this;
        }

        public fromPlaneProjection(plane: Readonly<Plane>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            return this.add(helpVector3A.multiplyScalar(-plane.getDistance(input), plane.normal));
        }

        public applyMatrix3(matrix: Readonly<Matrix3>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;

            this.x = rawData[0] * x + rawData[3] * y + rawData[6] * z;
            this.y = rawData[1] * x + rawData[4] * y + rawData[7] * z;
            this.z = rawData[2] * x + rawData[5] * y + rawData[8] * z;

            return this;
        }

        /**
         * 向量与矩阵相乘运算。
         * - `v.applyMatrix(matrix)` 将该向量与一个矩阵相乘，相当于 v *= matrix。
         * - `v.applyMatrix(matrix, input)` 将输入向量与一个矩阵相乘的结果写入该向量，相当于 v = input * matrix。
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        public applyMatrix(matrix: Readonly<Matrix4>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;

            const w = 1.0 / (rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15]); // TODO
            this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
            this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
            this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;

            return this;
        }

        /**
         * 向量与矩阵相乘运算。
         * - `v.applyDirection(matrix)` 将该向量与一个矩阵相乘，相当于 v *= matrix。
         * - `v.applyDirection(matrix, input)` 将输入向量与一个矩阵相乘的结果写入该向量，相当于 v = input * matrix。
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        public applyDirection(matrix: Readonly<Matrix4>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;

            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;

            return this;
            // return this.normalize(); TODO
        }

        /**
         * 向量与四元数相乘运算。
         * - `v.applyQuaternion(quaternion)` 将该向量与一个四元数相乘，相当于 v *= quaternion。
         * - `v.applyQuaternion(quaternion, input)` 将输入向量与一个四元数相乘的结果写入该向量，相当于 v = input * quaternion。
         * @param matrix 一个四元数。
         * @param input 输入向量。
         */
        public applyQuaternion(quaternion: Readonly<IVector4>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
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

        /**
         * 向量与标量相加运算。
         * - `v.addScalar(scalar)` 将该向量与标量相加，相当于 v += scalar。
         * - `v.addScalar(scalar, input)` 将输入向量与标量相加的结果写入该向量，相当于 v = input + scalar。
         * @param scalar 标量。
         * @param input 输入向量。
         */
        public addScalar(scalar: number, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            this.x = input.x + scalar;
            this.y = input.y + scalar;
            this.z = input.z + scalar;

            return this;
        }

        /**
         * 向量与标量相乘运算。
         * - `v.multiplyScalar(scalar)` 将该向量与标量相乘，相当于 v *= scalar。
         * - `v.multiplyScalar(scalar, input)` 将输入向量与标量相乘的结果写入该向量，相当于 v = input * scalar。
         * @param scalar 标量。
         * @param input 输入向量。
         */
        public multiplyScalar(scalar: number, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;

            return this;
        }

        /**
         * 向量相加运算。
         * - `v.add(a)` 将该向量与一个向量相加，相当于 v += a。
         * - `v.add(a, b)` 将两个向量相加的结果写入该向量，相当于 v = a + b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public add(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.x = valueA.x + valueB.x;
            this.y = valueA.y + valueB.y;
            this.z = valueA.z + valueB.z;

            return this;
        }

        /**
         * 向量相减运算。
         * - `v.subtract(a)` 将该向量与一个向量相减，相当于 v -= a。
         * - `v.subtract(a, b)` 将两个向量相减的结果写入该向量，相当于 v = a - b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public subtract(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.x = valueA.x - valueB.x;
            this.y = valueA.y - valueB.y;
            this.z = valueA.z - valueB.z;

            return this;
        }

        /**
         * 向量相乘运算。
         * - `v.multiply(a)` 将该向量与一个向量相乘，相当于 v *= a。
         * - `v.multiply(a, b)` 将两个向量相乘的结果写入该向量，相当于 v = a * b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public multiply(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.x = valueA.x * valueB.x;
            this.y = valueA.y * valueB.y;
            this.z = valueA.z * valueB.z;

            return this;
        }

        /**
         * 向量相除运算。
         * - 假设除向量分量均不为零。
         * - `v.divide(a)` 将该向量与一个向量相除，相当于 v /= a。
         * - `v.divide(a, b)` 将两个向量相除的结果写入该向量，相当于 v = a / b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public divide(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            if (DEBUG && (valueB.x === 0.0 || valueB.y === 0.0 || valueB.z === 0)) {
                console.warn("Dividing by zero.");
            }

            this.x = valueA.x / valueB.x;
            this.y = valueA.y / valueB.y;
            this.z = valueA.z / valueB.z;

            return this;
        }

        /**
         * 向量点乘运算。
         * - `v.dot(a)` 将该向量与一个向量点乘，相当于 v ·= a。
         * - `v.dot(a, b)` 将两个向量点乘的结果写入该向量，相当于 v = a · b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public dot(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            return valueA.x * valueB.x + valueA.y * valueB.y + valueA.z * valueB.z;
        }

        /**
         * 向量叉乘运算。
         * - `v.cross(a)` 将该向量与一个向量叉乘，相当于 v ×= a。
         * - `v.cross(a, b)` 将两个向量叉乘的结果写入该向量，相当于 v = a × b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public cross(valueA: Readonly<IVector3>, valueB?: Readonly<IVector3>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const x = valueA.x;
            const y = valueA.y;
            const z = valueA.z;
            const xB = valueB.x;
            const yB = valueB.y;
            const zB = valueB.z;

            this.x = y * zB - z * yB;
            this.y = z * xB - x * zB;
            this.z = x * yB - y * xB;

            return this;
        }

        /**
         * 向量插值运算。
         * - `v.lerp(t, a)` 将该向量与一个向量插值，相当于 v = v * (1 - t) + a * t。
         * - `v.lerp(t, a, b)` 将两个向量插值的结果写入该向量，相当于 v = a * (1 - t) + b * t。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
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

        /**
         * 向量最小值运算。
         * - `v.min(a)` 将该向量与一个向量的最小值写入该向量，相当于 v = min(v, a)。
         * - `v.min(a, b)` 将两个向量的最小值写入该向量，相当于 v = min(a, b)。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
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

        /**
         * 向量最大值运算。
         * - `v.max(a)` 将该向量与一个向量的最大值写入该向量，相当于 v = max(v, a)。
         * - `v.max(a, b)` 将两个向量的最大值写入该向量，相当于 v = max(a, b)。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
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

        /**
         * 向量夹紧运算。
         * - 假设最小向量小于最大向量。
         * - `v.clamp(valueMin, valueMax)` 相当于 v = max(valueMin, min(valueMax, v))。
         * - `v.clamp(valueMin, valueMax, input)` 相当于 v = max(valueMin, min(valueMax, input))。
         * @param valueMin 最小向量。
         * @param valueMax 最大向量。
         * @param input 输入向量。
         */
        public clamp(valueMin: Readonly<IVector3>, valueMax: Readonly<IVector3>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            if (DEBUG && (valueMin.x > valueMax.x || valueMin.y > valueMax.y || valueMin.z > valueMax.z)) {
                console.warn("Invalid arguments.");
            }

            // assumes min < max, componentwise
            this.x = Math.max(valueMin.x, Math.min(valueMax.x, input.x));
            this.y = Math.max(valueMin.y, Math.min(valueMax.y, input.y));
            this.z = Math.max(valueMin.z, Math.min(valueMax.z, input.z));

            return this;
        }

        /**
         * 
         * @param vector 
         * @param input 
         */
        public reflect(vector: Readonly<IVector3>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            return this.subtract(input, _helpVector3.multiplyScalar(2.0 * this.dot(vector), vector));
        }

        /**
         * 获得该向量和一个向量的夹角。（弧度制）
         * - 假设向量长度均不为零。
         */
        public getAngle(value: Readonly<IVector3>) {
            const v = this.squaredLength * (value as Vector3).squaredLength;

            if (DEBUG && v === 0.0) {
                console.warn("Dividing by zero.");
            }

            const theta = this.dot(value) / Math.sqrt(v);

            // clamp, to handle numerical problems
            return Math.acos(Math.max(-1.0, Math.min(1.0, theta)));
        }

        /**
         * 获取该向量和一个向量之间的距离的平方。
         * @param value 一个向量。
         */
        public getSquaredDistance(value: Readonly<IVector3>) {
            return _helpVector3.subtract(value, this).squaredLength;
        }

        /**
         * 获取该向量和一个向量之间的距离。
         * @param value 一个向量。
         */
        public getDistance(value: Readonly<IVector3>) {
            return _helpVector3.subtract(value, this).length;
        }

        public closestToTriangle(triangle: Readonly<Triangle>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
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
            vap.subtract(input, a);
            const d1 = vab.dot(vap);
            const d2 = vac.dot(vap);
            if (d1 <= 0 && d2 <= 0) {
                // vertex region of A; barycentric coords (1, 0, 0)
                return this.copy(a);
            }

            vbp.subtract(input, b);
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

            vcp.subtract(input, c);
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

        /**
         * 将该向量转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public toArray(array?: number[] | Float32Array, offset: number = 0) {
            if (!array) {
                array = [];
            }

            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;

            return array;
        }

        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
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
            return this.getLength(this.subtract(a, b, _helpVector3));
        }
    }

    const _helpVector3 = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3A = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3B = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3C = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3D = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3E = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3F = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3G = Vector3.create();
    /**
     * @internal
     */
    export const helpVector3H = Vector3.create();
}