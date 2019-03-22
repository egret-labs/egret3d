namespace egret3d {
    /**
     * 三维向量接口。
     */
    export interface IVector3 extends IVector2 {
        /**
         * Z 轴分量。
         */
        z: float;
    }
    /**
     * 欧拉旋转顺序。
     */
    export const enum EulerOrder {
        XYZ = 1,
        XZY = 2,
        YXZ = 3,
        YZX = 4,
        ZXY = 5,
        ZYX = 6,
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
        public static create(x: float = 0.0, y: float = 0.0, z: float = 0.0): Vector3 {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z);
                instance._released = false;
                return instance;
            }

            return new Vector3().set(x, y, z);
        }

        public x: float;
        public y: float;
        public z: float;
        /**
         * 请使用 `egret3d.Vector3.create()` 创建实例。
         * @see egret3d.Vector3.create()
         * @deprecated
         * @private
         */
        public constructor(x: float = 0.0, y: float = 0.0, z: float = 0.0) {
            super();

            this.x = x;
            this.y = y;
            this.z = z;
        }

        public serialize() {
            return [this.x, this.y, this.z];
        }

        public deserialize(value: Readonly<[float, float, float]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<IVector3>) {
            return this.set(value.x, value.y, value.z);
        }

        public clone() {
            return Vector3.create(this.x, this.y, this.z);
        }

        public set(x: float, y: float, z: float) {
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        }

        public fromArray(array: ArrayLike<float>, offset: uint = 0) {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;
        }

        public fromMatrixPosition(matrix: Readonly<Matrix4>): this {
            const array = matrix.rawData;
            this.x = array[12];
            this.y = array[13];
            this.z = array[14];

            return this.fromArray(matrix.rawData, 12);
        }

        public fromMatrixColumn(matrix: Readonly<Matrix4>, index: 0 | 1 | 2): this {
            return this.fromArray(matrix.rawData, index * 4);
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
        public equal(value: Readonly<IVector3>, threshold: float = Const.EPSILON) {
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
         */
        public normalize(input: Readonly<IVector3>): this;
        public normalize(input: Readonly<IVector3>, defaultVector: Readonly<IVector3>): this;
        public normalize(input: Readonly<IVector3> | null = null, defaultVector: Readonly<IVector3> = Vector3.FORWARD) {
            if (input === null) {
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
         * 归一化该向量，并使该向量垂直于自身。
         * - 向量长度不能为 `0` 。
         */
        public orthoNormal(): this;
        /**
         * 归一化该向量，并使该向量垂直于输入向量。
         * @param input 输入向量。
         * - 向量长度不能为 `0` 。
         */
        public orthoNormal(input: Readonly<IVector3>): this;
        public orthoNormal(input: Readonly<IVector3> | null = null) {
            if (input === null) {
                input = this;
            }
            const { x, y, z } = input;

            if (z > 0.0 ? z > Const.SQRT1_2 : z < Const.SQRT1_2) { // Y - Z plane.
                const k = 1.0 / Math.sqrt(y * y + z * z);
                this.x = 0.0;
                this.y = -z * k;
                this.z = y * k;
            }
            else { // X - Y plane.
                const k = 1.0 / Math.sqrt(x * x + y * y);
                this.x = -y * k;
                this.y = x * k;
                this.z = 0.0;
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
        public negate(input: Readonly<IVector3> | null = null) {
            if (input === null) {
                input = this;
            }

            this.x = -input.x;
            this.y = -input.y;
            this.z = -input.z;

            return this;
        }
        /**
         * 通过一个球面坐标设置该向量。
         * @param vector 一个球面坐标。
         * - x：球面半径，y：极角，z：赤道角
         */
        public fromSphericalCoords(vector: Readonly<IVector3>): this;
        /**
         * @param radius 从球面半径或球面一点到球原点的欧氏距离（直线距离）。
         * @param phi 相对于 Y 轴的极角。
         * @param theta 围绕 Y 轴的赤道角。
         */
        public fromSphericalCoords(radius: float, phi: float, theta: float): this;
        public fromSphericalCoords(p1: Readonly<IVector3> | float, p2: float = 0.0, p3: float = 0.0) {
            if (p1.hasOwnProperty("x")) {
                p3 = (p1 as Readonly<IVector3>).z;
                p2 = (p1 as Readonly<IVector3>).y;
                p1 = (p1 as Readonly<IVector3>).x;
            }

            const sinPhiRadius = Math.sin(<float>p2) * (<float>p1);
            this.x = sinPhiRadius * Math.sin(<float>p3);
            this.y = Math.cos(<float>p2) * (<float>p1);
            this.z = sinPhiRadius * Math.cos(<float>p3);

            return this;
        }
        /**
         * 将该向量乘以一个 3x3 矩阵。
         * - v *= matrix
         * @param matrix 一个 3x3 矩阵。
         */
        public applyMatrix3(matrix: Readonly<Matrix3 | Matrix4>): this;
        /**
         * 将输入向量与一个 3x3 矩阵相乘的结果写入该向量。
         * - v = input * matrix
         * @param matrix 一个 3x3 矩阵。
         * @param input 输入向量。
         */
        public applyMatrix3(matrix: Readonly<Matrix3 | Matrix4>, input: Readonly<IVector3>): this;
        public applyMatrix3(matrix: Readonly<Matrix3 | Matrix4>, input: Readonly<IVector3> | null = null) {
            if (input === null) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z;
            const rawData = matrix.rawData;

            if (matrix.constructor === Matrix3) {
                this.x = rawData[0] * x + rawData[3] * y + rawData[6] * z;
                this.y = rawData[1] * x + rawData[4] * y + rawData[7] * z;
                this.z = rawData[2] * x + rawData[5] * y + rawData[8] * z;
            }
            else {
                this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
                this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
                this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;
            }

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
        public applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
                if (DEBUG) {
                    console.warn("Dividing by zero.");
                }

                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
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
        public applyDirection(matrix: Readonly<Matrix4>, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
        public applyQuaternion(quaternion: Readonly<IVector4>, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
        public addScalar(scalar: float): this;
        /**
         * 将输入向量与标量相加的结果写入该向量。
         * - v = input + scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        public addScalar(scalar: float, input: Readonly<IVector3>): this;
        public addScalar(scalar: float, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
        public multiplyScalar(scalar: float): this;
        /**
         * 将输入向量与标量相乘的结果写入该向量。
         * - v = input * scalar
         * @param scalar 一个标量。
         * @param input 输入向量。
         */
        public multiplyScalar(scalar: float, input: Readonly<IVector3>): this;
        public multiplyScalar(scalar: float, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
        public add(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
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
        public subtract(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
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
        public multiply(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
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
        public divide(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
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
        public dot(vector: Readonly<IVector3>): float {
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
        public cross(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
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
         * @param to 目标向量。
         * @param t 插值因子。
         */
        public lerp(to: Readonly<IVector3>, t: float): this;
        /**
         * 将两个向量插值的结果写入该向量。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param from 起始向量。
         * @param to 目标向量。
         * @param t 插值因子。
         */
        public lerp(from: Readonly<IVector3>, to: Readonly<IVector3>, t: float): this;
        /**
         * @deprecated
         */
        public lerp(t: float, to: Readonly<IVector3>): this;
        /**
         * @deprecated
         */
        public lerp(t: float, from: Readonly<IVector3>, to: Readonly<IVector3>): this;
        public lerp(p1: Readonly<IVector3> | float, p2: Readonly<IVector3> | float, p3?: float | Readonly<IVector3>) {
            if (typeof p1 === "number") {
                if (!p3) {
                    p3 = p1;
                    p1 = this;
                }
                else {
                    const temp = p1;
                    p1 = p2;
                    p2 = p3;
                    p3 = temp;
                }
            }
            else if (typeof p2 === "number") {
                p3 = p2;
                p2 = p1;
                p1 = this;
            }

            this.x = (p1 as Readonly<IVector3>).x + ((p2 as Readonly<IVector3>).x - (p1 as Readonly<IVector3>).x) * (p3 as float);
            this.y = (p1 as Readonly<IVector3>).y + ((p2 as Readonly<IVector3>).y - (p1 as Readonly<IVector3>).y) * (p3 as float);
            this.z = (p1 as Readonly<IVector3>).z + ((p2 as Readonly<IVector3>).z - (p1 as Readonly<IVector3>).z) * (p3 as float);

            return this;
        }
        /**
         * 
         */
        public slerp(to: Readonly<Vector3>, t: float): this;
        public slerp(from: Readonly<Vector3>, to: Readonly<Vector3>, t: float): this;
        public slerp(from: Readonly<Vector3>, to: float | Readonly<Vector3>, t: float = 0.0) {
            if (typeof to === "number") {
                t = to as float;
                to = from;
                from = this;
            }

            const fromLength = from.length;
            const toLength = to.length;

            if (fromLength < Const.EPSILON || toLength < Const.EPSILON) {
                return this.lerp(from, to, t);
            }

            const dot = from.dot(to) / (fromLength * toLength);

            if (dot > 1.0 - Const.EPSILON) {
                return this.lerp(from, to, t);
            }

            const lerpedLength = math.lerp(fromLength, toLength, t);

            if (dot < -1.0 + Const.EPSILON) {
                const axis = this.orthoNormal(from);
                helpMatrix3A.fromMatrix4(helpMatrixA.fromAxis(axis, Const.PI * t));
                this.multiplyScalar(1.0 / fromLength, from).applyMatrix3(helpMatrix3A).multiplyScalar(lerpedLength);
            }
            else {
                const axis = this.cross(from, to).normalize();
                helpMatrix3A.fromMatrix4(helpMatrixA.fromAxis(axis, Math.acos(dot) * t));
                this.multiplyScalar(1.0 / fromLength, from).applyMatrix3(helpMatrix3A).multiplyScalar(lerpedLength);
            }

            return this;
        }
        /**
         * 将该向量与一个向量的分量取最小值。
         * @param vector 一个向量。
         */
        public min(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最小值写入该向量。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public min(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public min(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
                vectorB = vectorA;
                vectorA = this;
            }

            this.x = Math.min(vectorA.x, vectorB.x);
            this.y = Math.min(vectorA.y, vectorB.y);
            this.z = Math.min(vectorA.z, vectorB.z);

            return this;
        }
        /**
         * 将该向量与一个向量的分量取最大值。
         * @param vector 一个向量。
         */
        public max(vector: Readonly<IVector3>): this;
        /**
         * 将两个向量的分量的最大值写入该向量。
         * @param vectorA 一个向量。
         * @param vectorB 另一个向量。
         */
        public max(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3>): this;
        public max(vectorA: Readonly<IVector3>, vectorB: Readonly<IVector3> | null = null) {
            if (vectorB === null) {
                vectorB = vectorA;
                vectorA = this;
            }

            this.x = Math.max(vectorA.x, vectorB.x);
            this.y = Math.max(vectorA.y, vectorB.y);
            this.z = Math.max(vectorA.z, vectorB.z);

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
        public clamp(min: Readonly<IVector3>, max: Readonly<IVector3>, input: Readonly<IVector3> | null = null) {
            if (input === null) {
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
        public reflect(normal: Readonly<IVector3>, input: Readonly<Vector3>): this;
        public reflect(normal: Readonly<IVector3>, input: Readonly<Vector3> | null = null) {
            if (input === null) {
                input = this;
            }

            return this.subtract(input, _helpVector3.multiplyScalar(2.0 * input.dot(normal), normal));
        }
        /**
         * 获取一个向量和该向量的夹角。
         * - 弧度制。
         * @param vector 一个向量。
         */
        public getAngle(vector: Readonly<Vector3>): float {
            const v = this.squaredLength * vector.squaredLength;

            if (v < Const.EPSILON) {
                if (DEBUG) {
                    console.warn("Dividing by zero.");
                }

                return 0.0;
            }

            const theta = this.dot(vector) / Math.sqrt(v);

            // clamp, to handle numerical problems
            return Math.acos(Math.max(-1.0, Math.min(1.0, theta)));
        }
        /**
         * 获取一点到该点的欧氏距离（直线距离）的平方。
         * @param point 一个点。
         */
        public getSquaredDistance(point: Readonly<IVector3>): float {
            return _helpVector3.subtract(point, this).squaredLength;
        }
        /**
         * 获取一点到该点的欧氏距离（直线距离）。
         * @param point 一个点。
         */
        public getDistance(point: Readonly<IVector3>): float {
            return _helpVector3.subtract(point, this).length;
        }
        /**
         * 将该向量转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public toArray(array: float[] | Float32Array | null = null, offset: uint = 0): float[] | Float32Array {
            if (array === null) {
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
        public get length(): float {
            const { x, y, z } = this;

            return Math.sqrt(x * x + y * y + z * z);
        }
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        public get squaredLength(): float {
            const { x, y, z } = this;

            return x * x + y * y + z * z;
        }

        /**
         * @deprecated
         */
        public static set(x: float, y: float, z: float, out: Vector3): Vector3 {
            out.x = x;
            out.y = y;
            out.z = z;
            return out;
        }
        /**
         * @deprecated
         */
        public static normalize(v: Vector3) {
            return v.normalize();
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
        public static scale(v: Vector3, scale: float): Vector3 {
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
        public static dot(v1: Vector3, v2: Vector3): float {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        /**
         * @deprecated
         */
        public static lerp(v1: Vector3, v2: Vector3, v: float, out: Vector3): Vector3 {
            out.x = v1.x * (1 - v) + v2.x * v;
            out.y = v1.y * (1 - v) + v2.y * v;
            out.z = v1.z * (1 - v) + v2.z * v;
            return out;
        }
        /**
         * @deprecated
         */
        public static equal(v1: Vector3, v2: Vector3, threshold: float = 0.00001): boolean {
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