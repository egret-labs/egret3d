namespace egret3d {
    /**
     * 四元数。
     */
    export class Quaternion extends Vector4 {

        public static readonly IDENTITY: Readonly<Quaternion> = new Quaternion();

        protected static readonly _instances: Quaternion[] = [];

        /**
         * 创建一个四元数。
         */
        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z, w);
                instance._released = false;
                return instance;
            }

            return new Quaternion().set(x, y, z, w);
        }

        public clone() {
            return Quaternion.create(this.x, this.y, this.z, this.w);
        }

        /**
         * 通过旋转矩阵设置该四元数。
         * - 旋转矩阵不应包含缩放值。
         * @param rotateMatrix 旋转矩阵。
         */
        public fromMatrix(rotateMatrix: Readonly<Matrix4>) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            const rawData = rotateMatrix.rawData;
            const m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            const m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            const m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];
            const trace = m11 + m22 + m33;
            let s = 0.0;

            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                this.w = 0.25 / s;
                this.x = (m32 - m23) * s;
                this.y = (m13 - m31) * s;
                this.z = (m21 - m12) * s;

            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                this.w = (m32 - m23) / s;
                this.x = 0.25 * s;
                this.y = (m12 + m21) / s;
                this.z = (m13 + m31) / s;

            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                this.w = (m13 - m31) / s;
                this.x = (m12 + m21) / s;
                this.y = 0.25 * s;
                this.z = (m23 + m32) / s;

            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                this.w = (m21 - m12) / s;
                this.x = (m13 + m31) / s;
                this.y = (m23 + m32) / s;
                this.z = 0.25 * s;
            }

            return this;
        }

        /**
         * 通过欧拉旋转设置该四元数。
         * @param euler 欧拉旋转。（弧度制）
         * @param order 欧拉旋转顺序。
         */
        public fromEuler(euler: Readonly<IVector3>, order: EulerOrder = EulerOrder.YXZ) {
            const { x, y, z } = euler;

            // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

            const cos = Math.cos;
            const sin = Math.sin;

            const c1 = cos(x * 0.5);
            const c2 = cos(y * 0.5);
            const c3 = cos(z * 0.5);

            const s1 = sin(x * 0.5);
            const s2 = sin(y * 0.5);
            const s3 = sin(z * 0.5);

            switch (order) {
                case EulerOrder.XYZ:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;

                case EulerOrder.XZY:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;

                case EulerOrder.YXZ:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;

                case EulerOrder.YZX:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;

                case EulerOrder.ZXY:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;

                case EulerOrder.ZYX:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
            }

            return this;
        }

        /**
         * 通过指定旋转轴和旋转角设置该四元数。
         * - 旋转轴应已被归一化。
         * @param axis 旋转轴。
         * @param angle 旋转角。（弧度制）
         */
        public fromAxis(axis: Readonly<IVector3>, angle: number = 0.0) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

            const halfAngle = angle * 0.5, s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);

            return this;
        }

        /**
         * 通过自起始方向到目标方向的旋转值设置该四元数。
         * - 方向向量应已被归一化。
         * @param from 起始方向。
         * @param to 目标方向。
         */
        public fromVectors(from: Readonly<IVector3>, to: Readonly<IVector3>) {
            let r = (from as Vector3).dot(to) + 1.0;
            const v1 = helpVector3A;

            if (r < Const.EPSILON) {
                r = 0.0;

                if (Math.abs(from.x) > Math.abs(from.z)) {
                    v1.set(-from.y, from.x, 0.0);
                }
                else {
                    v1.set(0.0, -from.z, from.y);
                }
            }
            else {
                v1.cross(from, to);
            }

            this.x = v1.x;
            this.y = v1.y;
            this.z = v1.z;
            this.w = r;

            return this.normalize();
        }

        /**
         * - `v.inverse()` 反转该四元数。
         * - `v.inverse(input)` 将反转一个四元数的结果写入该四元数。
         * @param input 
         */
        public inverse(input?: Readonly<IVector4>) {
            if (!input) {
                input = this;
            }

            this.x = input.x * -1;
            this.y = input.y * -1;
            this.z = input.z * -1;
            this.w = input.w;

            return this;
        }

        /**
         * 四元数相乘运算。
         * - `v.multiply(a)` 将该四元数与一个四元数相乘，相当于 v *= a。
         * - `v.multiply(a, b)` 将两个四元数相乘的结果写入该四元数，相当于 v = a * b。
         * @param valueA 一个四元数。
         * @param valueB 另一个四元数。
         */
        public multiply(valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
            const ax = valueA.x, ay = valueA.y, az = valueA.z, aw = valueA.w;
            const bx = valueB.x, by = valueB.y, bz = valueB.z, bw = valueB.w;

            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;

            return this;
        }

        /**
         * 将一个四元数与该四元数相乘的结果写入该四元数，相当于 v = x * v。
         * @param value 一个四元数。
         */
        public premultiply(value: Readonly<IVector4>) {
            return this.multiply(value, this);
        }
        
        /**
         * 四元数插值运算。
         * - `v.lerp(t, a)` 将该四元数与一个四元数插值，相当于 v = v * (1 - t) + a * t。
         * - `v.lerp(t, a, b)` 将两个四元数插值的结果写入该四元数，相当于 v = a * (1 - t) + b * t。
         * @param valueA 一个四元数。
         * @param valueB 另一个四元数。
         */
        public lerp(t: number, valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            if (t === 0.0) return this.copy(valueA);
            if (t === 1.0) return this.copy(valueB);

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
            const ax = valueA.x, ay = valueA.y, az = valueA.z, aw = valueA.w;
            const bx = valueB.x, by = valueB.y, bz = valueB.z, bw = valueB.w;
            let cosHalfTheta = aw * bw + ax * bx + ay * by + az * bz;

            if (cosHalfTheta < 0.0) {
                this.w = -bw;
                this.x = -bx;
                this.y = -by;
                this.z = -bz;

                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.w = bw;
                this.x = bx;
                this.y = by;
                this.z = bz;
            }

            if (cosHalfTheta >= 1.0) {
                this.w = aw;
                this.x = ax;
                this.y = ay;
                this.z = az;

                return this;
            }

            const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

            if (sqrSinHalfTheta <= Const.EPSILON) { // Number.EPSILON

                const s = 1.0 - t;
                this.w = s * aw + t * this.w;
                this.x = s * ax + t * this.x;
                this.y = s * ay + t * this.y;
                this.z = s * az + t * this.z;

                return this.normalize();

            }

            const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            this.w = aw * ratioA + this.w * ratioB;
            this.x = ax * ratioA + this.x * ratioB;
            this.y = ay * ratioA + this.y * ratioB;
            this.z = az * ratioA + this.z * ratioB;

            return this;
        }

        /**
         * 
         * @param from 起始点。
         * @param to 目标点。
         * @param up 旋转后，该四元数 Y 轴正方向。
         */
        public lookAt(from: Readonly<IVector3>, to: Readonly<IVector3>, up: Readonly<IVector3>) {
            return this.fromMatrix(helpMatrixA.lookAt(from, to, up));
        }
        
        /**
         * 
         * @param vector 目标方向。
         * @param up 旋转后，该四元数 Y 轴正方向。
         */
        public lookRotation(vector: Readonly<IVector3>, up: Readonly<IVector3>) {
            return this.fromMatrix(helpMatrixA.lookRotation(vector, up));
        }

        /**
         * 获得该四元数和一个四元数的夹角。（弧度制）
         */
        public getAngle(value: Readonly<IVector4>) {
            return 2.0 * Math.acos(Math.abs(egret3d.floatClamp(this.dot(value), -1.0, 1.0)));
        }

        /**
         * 将该四元数转换为欧拉旋转。（弧度制）
         * @param euler 欧拉旋转。
         * @param order 欧拉旋转顺序。
         */
        public toEuler(euler?: Vector3, order: EulerOrder = EulerOrder.YXZ) {
            if (!euler) {
                euler = Vector3.create();
            }

            return _helpMatrix.fromRotation(this).toEuler(euler, order);
        }
    }

    const _helpMatrix = Matrix4.create();
}