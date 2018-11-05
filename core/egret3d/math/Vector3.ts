namespace egret3d {
    /**
     * 三维向量接口。
     */
    export interface IVector3 extends IVector2 {
        /**
         * z 轴分量。
         */
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
         * - 请注意不要修改该值。
         */
        public static readonly ZERO: Readonly<Vector3> = new Vector3(0.0, 0.0, 0.0);
        /**
         * 三方向均为一的向量。
         * - 请注意不要修改该值。
         */
        public static readonly ONE: Readonly<Vector3> = new Vector3(1.0, 1.0, 1.0);
        /**
         * 三方向均为负一的向量。
         * - 请注意不要修改该值。
         */
        public static readonly MINUS_ONE: Readonly<Vector3> = new Vector3(-1.0, -1.0, -1.0);
        /**
         * 上向量。
         * - 请注意不要修改该值。
         */
        public static readonly UP: Readonly<Vector3> = new Vector3(0.0, 1.0, 0.0);
        /**
         * 下向量。
         * - 请注意不要修改该值。
         */
        public static readonly DOWN: Readonly<Vector3> = new Vector3(0.0, -1.0, 0.0);
        /**
         * 左向量。
         * - 请注意不要修改该值。
         */
        public static readonly LEFT: Readonly<Vector3> = new Vector3(-1.0, 0.0, 0.0);
        /**
         * 右向量。
         * - 请注意不要修改该值。
         */
        public static readonly RIGHT: Readonly<Vector3> = new Vector3(1.0, 0.0, 0.0);
        /**
         * 前向量。
         * - 请注意不要修改该值。
         */
        public static readonly FORWARD: Readonly<Vector3> = new Vector3(0.0, 0.0, 1.0);
        /**
         * 后向量。
         * - 请注意不要修改该值。
         */
        public static readonly BACK: Readonly<Vector3> = new Vector3(0.0, 0.0, -1.0);

        private static readonly _instances: Vector3[] = [];
        /**
         * 创建一个三维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         * @param z Z 轴分量。
         */
        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0): Vector3 {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z);
                instance._released = false;
                return instance;
            }

            return new Vector3().set(x, y, z);
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
        /**
         * 归一化该向量。
         * - v /= v.length
         */
        public normalize(): this;
        /**
         * 将输入向量的归一化结果写入该向量。
         * - v = input / input.length
         * @param input 输入向量。
         * @param defaultVector 当向量不能合法归一化时将指向何方向。
         */
        public normalize(input: Readonly<IVector3>, defaultVector?: Readonly<IVector3>): this;
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
         * 反转该向量。
         */
        public negate(): this;
        /**
         * 将输入向量的反转结果写入该向量。
         * @param input 输入向量。
         */
        public negate(input: Readonly<IVector3>): this;
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
         * 通过一个球面坐标设置该向量。
         * @param vector3 一个球面坐标。（球面半径、极角、赤道角）
         */
        public fromSphericalCoords(vector3: Readonly<IVector3>): this;
        /**
         * @param radius 从球面半径或球面一点到球原点的欧氏距离（直线距离）。
         * @param phi 相对于 Y 轴的极角。
         * @param theta 围绕 Y 轴的赤道角。
         */
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
        /**
         * 将该向量乘以一个 3x3 矩阵。
         * - v *= matrix
         * @param matrix 一个 3x3 矩阵。
         */
        public applyMatrix3(matrix: Readonly<Matrix3>): this;
        /**
         * 将输入向量与一个 3x3 矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * @param matrix 一个 3x3 矩阵。
         * @param input 输入向量。
         */
        public applyMatrix3(matrix: Readonly<Matrix3>, input: Readonly<IVector3>): this;
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
         * 将该向量乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        public applyMatrix(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入向量与一个矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        public applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<IVector3>): this;
        public applyMatrix(matrix: Readonly<Matrix4>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;
            let w = rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15];

            if (w < -Const.EPSILON || Const.EPSILON < w) {
                w = 1.0 / w;
                this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
                this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
                this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;

                if (DEBUG) {
                    console.warn("Dividing by zero.");
                }
            }

            return this;
        }
        /**
         * 将该向量乘以一个矩阵。
         * - v *= matrix
         * - 矩阵的平移数据不会影响向量。
         * - 结果被归一化。
         * @param matrix 一个矩阵。
         */
        public applyDirection(matrix: Readonly<Matrix4>): this;
        /**
         * 将输入向量与一个矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * - 矩阵的平移数据不会影响向量。
         * - 结果被归一化。
         * @param matrix 一个矩阵。
         * @param input 输入向量。
         */
        public applyDirection(matrix: Readonly<Matrix4>, input: Readonly<IVector3>): this;
        public applyDirection(matrix: Readonly<Matrix4>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;

            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;

            return this.normalize();
        }
        /**
         * 将该向量乘以一个四元数。
         * - v *= quaternion
         * @param quaternion 一个四元数。
         */
        public applyQuaternion(quaternion: Readonly<IVector4>): this;
        /**
         * 将输入向量与一个四元数相乘的结果写入该向量。
         * - v = input * quaternion
         * @param quaternion 一个四元数。
         * @param input 输入向量。
         */
        public applyQuaternion(quaternion: Readonly<IVector4>, input: Readonly<IVector3>): this;
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
         * 将该向量加上一个标量。
         * - v += scalar
         * @param scalar 标量。
         */
        public addScalar(scalar: number): this;
        /**
         * 将输入向量与标量相加的结果写入该向量。
         * - v = input + scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        public addScalar(scalar: number, input: Readonly<IVector3>): this;
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
         * 将该向量乘以一个标量。
         * - v *= scalar
         * @param scalar 标量。
         */
        public multiplyScalar(scalar: number): this;
        /**
         * 将输入向量与标量相乘的结果写入该向量。
         * - v = input * scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        public multiplyScalar(scalar: number, input: Readonly<IVector3>): this;
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
         * 将该向量加上一个向量。
         * - v += vector
         * @param vector 一个向量。
         */
        public add(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相加的结果写入该向量。
         * - v = vectorA + vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public add(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public add(vectorA: Readonly<IVector3>, vectorB?: Readonly<IVector3>) {
            if (!vectorB) {
                vectorB = vectorA;
                vectorA = this;
            }

            this.x = vectorA.x + vectorB.x;
            this.y = vectorA.y + vectorB.y;
            this.z = vectorA.z + vectorB.z;

            return this;
        }
        /**
         * 将该向量减去一个向量。
         * - v -= vector
         * @param vector 一个向量。
         */
        public subtract(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相减的结果写入该向量。
         * - v = vectorA - vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public subtract(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public subtract(vectorA: Readonly<IVector3>, vectorB?: Readonly<IVector3>) {
            if (!vectorB) {
                vectorB = vectorA;
                vectorA = this;
            }

            this.x = vectorA.x - vectorB.x;
            this.y = vectorA.y - vectorB.y;
            this.z = vectorA.z - vectorB.z;

            return this;
        }
        /**
         * 将该向量乘以一个向量。
         * - v *= vector
         * @param vector 一个向量。
         */
        public multiply(vector: Readonly<IVector3>): this;
        /**
         * 将该两个向量相乘的结果写入该向量。
         * - v = vectorA * vectorA
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public multiply(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public multiply(vectorA: Readonly<IVector3>, vectorB?: Readonly<IVector3>) {
            if (!vectorB) {
                vectorB = vectorA;
                vectorA = this;
            }

            this.x = vectorA.x * vectorB.x;
            this.y = vectorA.y * vectorB.y;
            this.z = vectorA.z * vectorB.z;

            return this;
        }
        /**
         * 将该向量除以一个向量。
         * -  v /= vector
         * - 假设除向量分量均不为零。
         * @param vector 一个向量。
         */
        public divide(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相除的结果写入该向量。
         * -  v = vectorA / vectorB
         * - 假设除向量分量均不为零。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public divide(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public divide(vectorA: Readonly<IVector3>, vectorB?: Readonly<IVector3>) {
            if (!vectorB) {
                vectorB = vectorA;
                vectorA = this;
            }

            if (DEBUG && (vectorB.x === 0.0 || vectorB.y === 0.0 || vectorB.z === 0)) {
                console.warn("Dividing by zero.");
            }

            this.x = vectorA.x / vectorB.x;
            this.y = vectorA.y / vectorB.y;
            this.z = vectorA.z / vectorB.z;

            return this;
        }
        /**
         * 将该向量与一个向量相点乘。
         * - v · vector
         * @param vector 一个向量。
         */
        public dot(vector: Readonly<IVector3>): number {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        }
        /**
         * 将该向量叉乘以一个向量。
         * - v ×= vector
         * @param vector 一个向量。
         */
        public cross(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量相叉乘的结果写入该向量。
         * - v = vectorA × vectorB
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public cross(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public cross(vectorA: Readonly<IVector3>, vectorB?: Readonly<IVector3>) {
            if (!vectorB) {
                vectorB = vectorA;
                vectorA = this;
            }

            const x = vectorA.x;
            const y = vectorA.y;
            const z = vectorA.z;
            const xB = vectorB.x;
            const yB = vectorB.y;
            const zB = vectorB.z;

            this.x = y * zB - z * yB;
            this.y = z * xB - x * zB;
            this.z = x * yB - y * xB;

            return this;
        }
        /**
         * 将该向量和目标向量插值的结果写入该向量。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param to 目标向量。
         */
        public lerp(t: number, to: Readonly<IVector3>): this;
        /**
         * 将两个向量插值的结果写入该向量。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param from 起始向量。
         * @param to 目标向量。
         */
        public lerp(t: number, from: Readonly<IVector3>, to: Readonly<IVector3>): this;
        public lerp(t: number, from: Readonly<IVector3>, to?: Readonly<IVector3>) {
            if (!to) {
                to = from;
                from = this;
            }

            this.x = from.x + (to.x - from.x) * t;
            this.y = from.y + (to.y - from.y) * t;
            this.z = from.z + (to.z - from.z) * t;

            return this;
        }
        /**
         * 将该向量与一个向量的分量取最小值。
         * @param value 一个向量。
         */
        public min(value: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最小值写入该向量。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public min(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>): this;
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
         * 将该向量与一个向量的分量取最大值。
         * @param value 一个向量。
         */
        public max(value: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最大值写入该向量。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public max(valueA: Readonly<IVector3>, valueB: Readonly<IVector3>): this;
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
         * 限制该向量，使其在最小向量和最大向量之间。
         * @param min 最小向量。
         * @param max 最大向量。
         */
        public clamp(min: Readonly<IVector3>, max: Readonly<IVector3>): this;
        /**
         * 将限制输入向量在最小向量和最大向量之间的结果写入该向量。
         * @param min 最小向量。
         * @param max 最大向量。
         * @param input 输入向量。
         */
        public clamp(min: Readonly<IVector3>, max: Readonly<IVector3>, input: Readonly<IVector3>): this;
        public clamp(min: Readonly<IVector3>, max: Readonly<IVector3>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            if (DEBUG && (min.x > max.x || min.y > max.y || min.z > max.z)) {
                console.warn("Invalid arguments.");
            }

            // assumes min < max, componentwise
            this.x = Math.max(min.x, Math.min(max.x, input.x));
            this.y = Math.max(min.y, Math.min(max.y, input.y));
            this.z = Math.max(min.z, Math.min(max.z, input.z));

            return this;
        }
        /**
         * 沿着一个法线向量反射该向量。
         * - 假设法线已被归一化。
         * @param normal 一个法线向量。
         */
        public reflect(normal: Readonly<IVector3>): this;
        /**
         * 将沿着一个法线向量反射输入向量的结果写入该向量。
         * @param normal 一个法线向量。
         * @param input 输入向量。
         */
        public reflect(normal: Readonly<IVector3>, input: Readonly<IVector3>): this;
        public reflect(normal: Readonly<IVector3>, input?: Readonly<IVector3>) {
            if (!input) {
                input = this;
            }

            return this.subtract(input, _helpVector3.multiplyScalar(2.0 * this.dot(normal), normal));
        }
        /**
         * 获取该向量和一个向量的夹角。（弧度制）
         * - 假设向量长度均不为零。
         */
        public getAngle(vector: Readonly<IVector3>): number {
            const v = this.squaredLength * (vector as Vector3).squaredLength;

            if (DEBUG && v === 0.0) {
                console.warn("Dividing by zero.");
            }

            const theta = this.dot(vector) / Math.sqrt(v);

            // clamp, to handle numerical problems
            return Math.acos(Math.max(-1.0, Math.min(1.0, theta)));
        }
        /**
         * 获取两点的最近距离的平方。
         * @param point 一个点。
         */
        public getSquaredDistance(point: Readonly<IVector3>): number {
            return _helpVector3.subtract(point, this).squaredLength;
        }
        /**
         * 获取两点的最近距离。
         * @param point 一个点。
         */
        public getDistance(point: Readonly<IVector3>): number {
            return _helpVector3.subtract(point, this).length;
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
        public get length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        public get squaredLength(): number {
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