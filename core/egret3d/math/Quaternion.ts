namespace egret3d {
    /**
     * 四元数。
     */
    export class Quaternion extends Vector4 {
        /**
         * 恒等四元数。
         */
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
         * 通过旋转轴设置该四元数。
         * - 假设旋转轴已被归一化。
         * @param axis 旋转轴。
         * @param angle 旋转角。（弧度制）
         */
        public fromAxis(axis: Readonly<IVector3>, angle: number) {
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
         * - 假设方向向量已被归一化。
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
         * 将该四元数转换为恒等四元数。
         */
        public identity(): this {
            this.x = this.y = this.z = 0.0;
            this.w = 1.0;

            return this;
        }
        /**
         * 将该四元数乘以一个四元数。
         * - v *= quaternion
         * @param quaternion 一个四元数。
         */
        public multiply(quaternion: Readonly<IVector4>): this;
        /**
         * 将两个四元数相乘的结果写入该四元数。
         * - v = quaternionA * quaternionB
         * @param quaternionA 一个四元数。
         * @param quaternionB 另一个四元数。
         */
        public multiply(quaternionA: Readonly<IVector4>, quaternionB?: Readonly<IVector4>): this;
        public multiply(quaternionA: Readonly<IVector4>, quaternionB?: Readonly<IVector4>) {
            if (!quaternionB) {
                quaternionB = quaternionA;
                quaternionA = this;
            }

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
            const ax = quaternionA.x, ay = quaternionA.y, az = quaternionA.z, aw = quaternionA.w;
            const bx = quaternionB.x, by = quaternionB.y, bz = quaternionB.z, bw = quaternionB.w;

            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;

            return this;
        }
        /**
         * 将一个四元数与该四元数相乘的结果写入该四元数。
         * - v = quaternion * v
         * @param quaternion 一个四元数。
         */
        public premultiply(quaternion: Readonly<IVector4>) {
            return this.multiply(quaternion, this);
        }

        public lerp(p1: Readonly<IVector4> | number, p2: Readonly<IVector4> | number, p3?: number | Readonly<IVector4>) {
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

            const fX = (p1 as Readonly<IVector4>).x, fY = (p1 as Readonly<IVector4>).y, fZ = (p1 as Readonly<IVector4>).z, fW = (p1 as Readonly<IVector4>).w;
            const tX = (p2 as Readonly<IVector4>).x, tY = (p2 as Readonly<IVector4>).y, tZ = (p2 as Readonly<IVector4>).z, tW = (p2 as Readonly<IVector4>).w;

            if (fX * tX + fY * tY + fZ * tZ + fW * tW < 0.0) {
                this.x = fX + (-tX - fX) * (p3 as number);
                this.y = fY + (-tY - fY) * (p3 as number);
                this.z = fZ + (-tZ - fZ) * (p3 as number);
                this.w = fW + (-tW - fW) * (p3 as number);
            }
            else {
                this.x = fX + (tX - fX) * (p3 as number);
                this.y = fY + (tY - fY) * (p3 as number);
                this.z = fZ + (tZ - fZ) * (p3 as number);
                this.w = fW + (tW - fW) * (p3 as number);
            }

            return this.normalize();
        }
        /**
         * 将该四元数和目标四元数球形插值的结果写入该四元数。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param to 目标矩阵。
         */
        public slerp(to: Readonly<IVector4>, t: number): this;
        /**
         * 将两个四元数球形插值的结果写入该四元数。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param from 起始矩阵。
         * @param to 目标矩阵。
         */
        public slerp(from: Readonly<IVector4>, to: Readonly<IVector4>, t: number): this;
        /**
         * @deprecated
         */
        public slerp(t: number, to: Readonly<IVector4>): this;
        /**
         * @deprecated
         */
        public slerp(t: number, from: Readonly<IVector4>, to: Readonly<IVector4>): this;
        public slerp(p1: Readonly<IVector4> | number, p2: Readonly<IVector4> | number, p3?: number | Readonly<IVector4>) {
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

            if (p1 === 0.0) return this.copy(p2 as Readonly<IVector4>);
            if (p1 === 1.0) return this.copy(p3 as Readonly<IVector4>);

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
            const fX = (p1 as Readonly<IVector4>).x, fY = (p1 as Readonly<IVector4>).y, fZ = (p1 as Readonly<IVector4>).z, fW = (p1 as Readonly<IVector4>).w;
            const tX = (p2 as Readonly<IVector4>).x, tY = (p2 as Readonly<IVector4>).y, tZ = (p2 as Readonly<IVector4>).z, tW = (p2 as Readonly<IVector4>).w;
            let cosHalfTheta = fW * tW + fX * tX + fY * tY + fZ * tZ;

            if (cosHalfTheta < 0.0) {
                this.w = -tW;
                this.x = -tX;
                this.y = -tY;
                this.z = -tZ;

                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.w = tW;
                this.x = tX;
                this.y = tY;
                this.z = tZ;
            }

            if (cosHalfTheta >= 1.0) {
                this.w = fW;
                this.x = fX;
                this.y = fY;
                this.z = fZ;

                return this;
            }

            const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

            if (sqrSinHalfTheta < Const.EPSILON) { //
                return this.lerp(p1 as Readonly<IVector4>, this);
            }

            const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1.0 - <number>p1) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(<number>p1 * halfTheta) / sinHalfTheta;

            this.w = fW * ratioA + this.w * ratioB;
            this.x = fX * ratioA + this.x * ratioB;
            this.y = fY * ratioA + this.y * ratioB;
            this.z = fZ * ratioA + this.z * ratioB;

            return this;
        }
        /**
         * 设置该四元数，使其与起始点到目标点的方向相一致。
         * @param from 起始点。
         * @param to 目标点。
         * @param up 
         */
        public lookAt(from: Readonly<IVector3>, to: Readonly<IVector3>, up: Readonly<IVector3>): this {
            return this.fromMatrix(helpMatrixA.lookAt(from, to, up));
        }
        /**
         * 设置该四元数，使其与目标方向相一致。
         * @param vector 目标方向。
         * @param up 
         */
        public lookRotation(vector: Readonly<IVector3>, up: Readonly<IVector3>): this {
            return this.fromMatrix(helpMatrixA.lookRotation(vector, up));
        }
        /**
         * 获取该四元数和一个四元数的夹角。（弧度制）
         */
        public getAngle(value: Readonly<IVector4>): number {
            return 2.0 * Math.acos(Math.abs(math.clamp(this.dot(value), -1.0, 1.0)));
        }
        /**
         * 将该四元数转换为欧拉旋转。（弧度制）
         * @param out 欧拉旋转。
         * @param order 欧拉旋转顺序。
         */
        public toEuler(out?: Vector3, order: EulerOrder = EulerOrder.YXZ): Vector3 {
            if (!out) {
                out = Vector3.create();
            }

            return _helpMatrix.fromRotation(this).toEuler(out, order);
        }
    }

    const _helpMatrix = Matrix4.create();
}