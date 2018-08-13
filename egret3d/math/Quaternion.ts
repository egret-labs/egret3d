namespace egret3d {

    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpVec3_3: Vector3 = new Vector3();

    const helpMat4_1: Matrix = new Matrix();
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
    export class Quaternion implements IVector4, paper.ISerializable {

        private static readonly _instances: Quaternion[] = [];

        public static create(x?: number, y?: number, z?: number, w?: number) {
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

        public x: number;

        public y: number;

        public z: number;

        public w: number;

        constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public serialize() {
            return [this.x, this.y, this.z, this.w];
        }

        public deserialize(element: Readonly<[number, number, number, number]>) {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
            this.w = element[3];

            return this;
        }

        public copy(value: Readonly<IVector4>) {
            this.x = value.x;
            this.y = value.y;
            this.z = value.z;
            this.w = value.w;

            return this;
        }

        public clone() {
            const value = new Quaternion();
            value.copy(this);

            return value;
        }

        public set(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return this;
        }

        public normalize(value?: Readonly<Quaternion>) {
            if (!value) {
                value = this;
            }

            const l = Math.sqrt(value.x * value.x + value.y * value.y + value.z * value.z + value.w * value.w);

            if (l > Number.MIN_VALUE) {
                this.x /= l;
                this.y /= l;
                this.z /= l;
                this.w /= l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 1.0;
            }

            return this;
        }

        public inverse(value?: Readonly<Quaternion>) {
            if (!value) {
                value = this;
            }

            const ll = value.w * value.w + value.x * value.x + value.y * value.y + value.z * value.z;

            if (ll > 0.0) {
                const ill = 1.0 / ll;
                this.x = -this.x * ill;
                this.y = -this.y * ill;
                this.z = -this.z * ill;
                this.w = this.w * ill;
            }

            return this;
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

            const c1 = cos(x / 2);
            const c2 = cos(y / 2);
            const c3 = cos(z / 2);

            const s1 = sin(x / 2);
            const s2 = sin(y / 2);
            const s3 = sin(z / 2);

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

        public fromEulerAngle(x: number, y: number, z: number) {
            return this.fromEuler(helpVec3_1.set(x * DEG_RAD, y * DEG_RAD, z * DEG_RAD));
        }
        /**
         * - 向量必须是归一化的。
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

        public multiply(valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const w1 = valueA.w, x1 = valueA.x, y1 = valueA.y, z1 = valueA.z;
            const w2 = valueB.w, x2 = valueB.x, y2 = valueB.y, z2 = valueB.z;

            this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
            this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
            this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;

            this.normalize(); // TODO 

            return this;
        }

        public lerp(t: number, srca: Quaternion, srcb?: Quaternion) {
            if (!srcb) {
                srcb = srca;
                srca = this;
            }

            let w1 = srca.w, x1 = srca.x, y1 = srca.y, z1 = srca.z;
            let w2 = srcb.w, x2 = srcb.x, y2 = srcb.y, z2 = srcb.z;

            if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }

            this.w = w1 + t * (w2 - w1);
            this.x = x1 + t * (x2 - x1);
            this.y = y1 + t * (y2 - y1);
            this.z = z1 + t * (z2 - z1);

            this.normalize(); // TODO 

            return this;
        }

        public transformVector3(value: Vector3, out?: Vector3) {
            if (!out) {
                value = out;
            }

            const x2 = value.x, y2 = value.y, z2 = value.z;
            const x1 = this.w * x2 + this.y * z2 - this.z * y2;
            const y1 = this.w * y2 - this.x * z2 + this.z * x2;
            const z1 = this.w * z2 + this.x * y2 - this.y * x2;
            const w1 = -this.x * x2 - this.y * y2 - this.z * z2;

            out.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
            out.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
            out.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;

            return value;
        }

        public getMagnitude() {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
        }

        public static fromYawPitchRoll(yaw: number, pitch: number, roll: number, out: Quaternion): Quaternion {
            // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
            let halfRoll = roll * 0.5;
            let halfPitch = pitch * 0.5;
            let halfYaw = yaw * 0.5;

            let sinRoll = Math.sin(halfRoll);
            let cosRoll = Math.cos(halfRoll);
            let sinPitch = Math.sin(halfPitch);
            let cosPitch = Math.cos(halfPitch);
            let sinYaw = Math.sin(halfYaw);
            let cosYaw = Math.cos(halfYaw);

            out.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
            out.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
            out.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
            out.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);

            return out;
        }

        public static lookAt(pos: Vector3, target: Vector3, out: Quaternion): Quaternion {
            let dir = helpVec3_1;
            Vector3.subtract(target, pos, dir);
            Vector3.normalize(dir);

            let dirxz = helpVec3_2;
            helpVec3_2.x = dir.x;
            helpVec3_2.y = 0;
            helpVec3_2.z = dir.z;
            Vector3.normalize(dirxz);

            let yaw = Math.acos(dirxz.z);
            if (dirxz.x < 0) {
                yaw = -yaw;
            }

            let dirxz1 = helpVec3_3;
            helpVec3_3.x = dir.x;
            helpVec3_3.y = 0;
            helpVec3_3.z = dir.z;
            let v3length = Vector3.getLength(dirxz1);
            if (v3length > 0.9999999999) {
                v3length = 1;
            }
            if (v3length < -0.999999999) {
                v3length = -1;
            }
            let pitch = Math.acos(v3length);
            if (dir.y > 0) {
                pitch = -pitch;
            }
            this.fromYawPitchRoll(yaw, pitch, 0, out);
            return this.normalize(out);
        }

        public static lookAtWithUp(pos: Vector3, target: Vector3, up: Vector3, out: Quaternion): Quaternion {
            let eye = pos;

            var zaxis = Vector3.subtract(target, eye, helpVec3_1); // right-hand coordinates system
            Vector3.normalize(zaxis);

            var xaxis = Vector3.cross(up, zaxis, helpVec3_2);
            Vector3.normalize(xaxis);

            let yaxis = Vector3.cross(zaxis, xaxis, helpVec3_3);

            return out.fromMatrix(helpMat4_1.set(
                xaxis.x, yaxis.x, zaxis.x, 0,
                xaxis.y, yaxis.y, zaxis.y, 0,
                xaxis.z, yaxis.z, zaxis.z, 0,
                0, 0, 0, 1
            ));
        }
        /**
         * @deprecated
         */
        public static multiply(q1: Quaternion, q2: Quaternion, out: Quaternion): Quaternion {
            let w1: number = q1.w, x1: number = q1.x, y1: number = q1.y, z1: number = q1.z;
            let w2: number = q2.w, x2: number = q2.x, y2: number = q2.y, z2: number = q2.z;

            out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
            out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
            out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
            out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

            this.normalize(out);

            return out;
        }

        private static normalize(out: Quaternion): Quaternion {
            let mag: number = 1 / Math.sqrt(out.x * out.x + out.y * out.y + out.z * out.z + out.w * out.w);

            out.x *= mag;
            out.y *= mag;
            out.z *= mag;
            out.w *= mag;

            return out;
        }

        public static toEulerAngles(q: Quaternion, out: Vector3): Vector3 {
            let temp: number = 2.0 * (q.w * q.x - q.y * q.z);
            temp = floatClamp(temp, -1.0, 1.0);
            out.x = Math.asin(temp);

            out.y = Math.atan2(2.0 * (q.w * q.y + q.z * q.x), 1.0 - 2.0 * (q.y * q.y + q.x * q.x));

            out.z = Math.atan2(2.0 * (q.w * q.z + q.y * q.x), 1.0 - 2.0 * (q.x * q.x + q.z * q.z));

            out.x /= Math.PI / 180;
            out.y /= Math.PI / 180;
            out.z /= Math.PI / 180;

            return out;
        }

        public static toAxisAngle(q: Quaternion, axis: Vector3): number {
            let sqrLength: number = q.x * q.x + q.y * q.y + q.z * q.z;
            let angle: number = 0;
            if (sqrLength > 0.0) {
                angle = 2.0 * Math.acos(q.w);
                sqrLength = 1.0 / Math.sqrt(sqrLength);
                axis.x = q.x * sqrLength;
                axis.y = q.y * sqrLength;
                axis.z = q.z * sqrLength;
            } else {
                angle = 0;
                axis.x = 1.0;
                axis.y = 0;
                axis.z = 0;
            }
            angle /= Math.PI / 180.0;
            return angle;
        }
        /**
         * @deprecated
         */
        public static transformVector3(src: Quaternion, vector: Vector3, out: Vector3): Vector3 {
            let x1: number, y1: number, z1: number, w1: number;
            let x2: number = vector.x, y2: number = vector.y, z2: number = vector.z;

            w1 = -src.x * x2 - src.y * y2 - src.z * z2;
            x1 = src.w * x2 + src.y * z2 - src.z * y2;
            y1 = src.w * y2 - src.x * z2 + src.z * x2;
            z1 = src.w * z2 + src.x * y2 - src.y * x2;

            out.x = -w1 * src.x + x1 * src.w - y1 * src.z + z1 * src.y;
            out.y = -w1 * src.y + x1 * src.z + y1 * src.w - z1 * src.x;
            out.z = -w1 * src.z - x1 * src.y + y1 * src.x + z1 * src.w;

            return out;
        }
    }
}