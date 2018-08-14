namespace egret3d {
    /**
     * 
     */
    export class Quaternion extends Vector4 {

        private static readonly _instances: Quaternion[] = [];

        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(x, y, z, w);
            }

            return new Quaternion(x, y, z, w);
        }

        public static release(value: Quaternion) {
            if (this._instances.indexOf(value) >= 0) {
                return;
            }

            this._instances.push(value);
        }
        /**
         * @deprecated
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            super(x, y, z, w);
        }

        public clone() {
            const value = new Quaternion();
            value.copy(this);

            return value;
        }

        public fromMatrix(matrix: Readonly<Matrix>) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            const rawData = matrix.rawData;
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

        public fromEuler(value: Readonly<IVector3>, order: EulerOrder = EulerOrder.XYZ) {
            const { x, y, z } = value;

            // http://www.mathworks.com/matlabcentral/fileexchange/
            // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
            //	content/SpinCalc.m

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
         * - 向量必须已归一化。
         */
        public fromAxisAngle(axis: Readonly<IVector3>, angle: number) {
            angle *= DEG_RAD;
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

            // assumes axis is normalized

            const halfAngle = angle * 0.5, s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);

            return this;
        }

        public inverse(value?: Readonly<IVector4>) {
            if (!value) {
                value = this;
            }

            this.x = value.x * -1;
            this.y = value.y * -1;
            this.z = value.z * -1;

            return this;
        }

        public dot(value: Readonly<IVector4>) {
            return this.x * value.x + this.y * value.y + this.z * value.z + this.w * value.w;
        }

        public multiply(valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const qax = valueA.x, qay = valueA.y, qaz = valueA.z, qaw = valueA.w;
            const qbx = valueB.x, qby = valueB.y, qbz = valueB.z, qbw = valueB.w;

            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            return this;
        }

        public premultiply(value: Readonly<IVector4>) {
            return this.multiply(value, this);
        }

        public lerp(t: number, valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            if (t === 0.0) return this.copy(valueA);
            if (t === 1.0) return this.copy(valueB);

            const x = valueA.x, y = valueA.y, z = valueA.z, w = valueA.w;

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

            let cosHalfTheta = w * valueB.w + x * valueB.x + y * valueB.y + z * valueB.z;

            if (cosHalfTheta < 0.0) {
                this.w = -valueB.w;
                this.x = -valueB.x;
                this.y = -valueB.y;
                this.z = -valueB.z;

                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.copy(valueB);
            }

            if (cosHalfTheta >= 1.0) {
                this.w = w;
                this.x = x;
                this.y = y;
                this.z = z;

                return this;
            }

            const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

            if (sqrSinHalfTheta <= egret3d.EPSILON) { // Number.EPSILON

                const s = 1.0 - t;
                this.w = s * w + t * this.w;
                this.x = s * x + t * this.x;
                this.y = s * y + t * this.y;
                this.z = s * z + t * this.z;

                return this.normalize();

            }

            const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            this.w = (w * ratioA + this.w * ratioB);
            this.x = (x * ratioA + this.x * ratioB);
            this.y = (y * ratioA + this.y * ratioB);
            this.z = (z * ratioA + this.z * ratioB);
        }

        public lookAt(eye: Vector3, target: Vector3): Quaternion {
            const dir = _helpVector3A.subtract(target, eye).normalize();
            const dirxz = _helpVector3B.set(dir.x, 0.0, dir.z).normalize();
            const dirxz1 = _helpVector3C.set(dir.x, 0.0, dir.z);

            let yaw = Math.acos(dirxz.z);
            if (dirxz.x < 0) {
                yaw = -yaw;
            }

            let v3length = dirxz1.length;
            if (v3length > 0.999999) {
                v3length = 1.0;
            }
            else if (v3length < -0.999999) {
                v3length = -1.0;
            }

            let pitch = Math.acos(v3length);
            if (dir.y > 0.0) {
                pitch = -pitch;
            }

            _helpVector3A.set(pitch, yaw, 0.0);
            this.fromEuler(_helpVector3A, EulerOrder.ZYX).normalize();

            return this;
        }
    }

    const _helpVector3A: Vector3 = new Vector3();
    const _helpVector3B: Vector3 = new Vector3();
    const _helpVector3C: Vector3 = new Vector3();
}