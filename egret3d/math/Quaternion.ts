namespace egret3d {

    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpVec3_3: Vector3 = new Vector3();

    const helpMat4_1: Matrix = new Matrix();

    export class Quaternion implements paper.ISerializable {

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

        public deserialize(element: number[]): void {
            this.x = element[0];
            this.y = element[1];
            this.z = element[2];
            this.w = element[3];
        }

        public static set(x: number, y: number, z: number, w: number, out: Quaternion): Quaternion {
            out.x = x;
            out.y = y;
            out.z = z;
            out.w = w;
            return out;
        }

        public static getMagnitude(src: Quaternion): number {
            return Math.sqrt(src.w * src.w + src.x * src.x + src.y * src.y + src.z * src.z);
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

        public static fromEulerAngles(ax: number, ay: number, az: number, out: Quaternion): Quaternion {
            ax *= Math.PI / 180;
            ay *= Math.PI / 180;
            az *= Math.PI / 180;

            let halfX: number = ax * 0.5, halfY: number = ay * 0.5, halfZ: number = az * 0.5;
            let cosX: number = Math.cos(halfX), sinX: number = Math.sin(halfX);
            let cosY: number = Math.cos(halfY), sinY: number = Math.sin(halfY);
            let cosZ: number = Math.cos(halfZ), sinZ: number = Math.sin(halfZ);

            out.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
            out.x = sinX * cosY * cosZ + cosX * sinY * sinZ;
            out.y = cosX * sinY * cosZ - sinX * cosY * sinZ;
            out.z = cosX * cosY * sinZ - sinX * sinY * cosZ;

            return this.normalize(out);
        }

        public static fromAxisAngle(axis: Vector3, angle: number, out: Quaternion): Quaternion {
            angle *= Math.PI / 180.0;
            let halfAngle: number = angle * 0.5;
            let sin_a: number = Math.sin(halfAngle);

            out.w = Math.cos(halfAngle);
            out.x = axis.x * sin_a;
            out.y = axis.y * sin_a;
            out.z = axis.z * sin_a;

            this.normalize(out);

            return out;
        }

        public static fromMatrix(matrix: Matrix, out: Quaternion): Quaternion {
            let m00, m01, m02, m10, m11, m12, m20, m21, m22,
                tr, s, rs, lx, ly, lz;

            let m = matrix.rawData;

            // Cache matrix values for super-speed
            m00 = m[0];
            m01 = m[1];
            m02 = m[2];
            m10 = m[4];
            m11 = m[5];
            m12 = m[6];
            m20 = m[8];
            m21 = m[9];
            m22 = m[10];

            // Remove the scale from the matrix
            lx = 1 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
            ly = 1 / Math.sqrt(m10 * m10 + m11 * m11 + m12 * m12);
            lz = 1 / Math.sqrt(m20 * m20 + m21 * m21 + m22 * m22);

            m00 *= lx;
            m01 *= lx;
            m02 *= lx;
            m10 *= ly;
            m11 *= ly;
            m12 *= ly;
            m20 *= lz;
            m21 *= lz;
            m22 *= lz;

            // http://www.cs.ucr.edu/~vbz/resources/quatut.pdf

            tr = m00 + m11 + m22;
            if (tr >= 0) {
                s = Math.sqrt(tr + 1);
                out.w = s * 0.5;
                s = 0.5 / s;
                out.x = (m12 - m21) * s;
                out.y = (m20 - m02) * s;
                out.z = (m01 - m10) * s;
            } else {
                if (m00 > m11) {
                    if (m00 > m22) {
                        // XDiagDomMatrix
                        rs = (m00 - (m11 + m22)) + 1;
                        rs = Math.sqrt(rs);

                        out.x = rs * 0.5;
                        rs = 0.5 / rs;
                        out.w = (m12 - m21) * rs;
                        out.y = (m01 + m10) * rs;
                        out.z = (m02 + m20) * rs;
                    } else {
                        // ZDiagDomMatrix
                        rs = (m22 - (m00 + m11)) + 1;
                        rs = Math.sqrt(rs);

                        out.z = rs * 0.5;
                        rs = 0.5 / rs;
                        out.w = (m01 - m10) * rs;
                        out.x = (m20 + m02) * rs;
                        out.y = (m21 + m12) * rs;
                    }
                } else if (m11 > m22) {
                    // YDiagDomMatrix
                    rs = (m11 - (m22 + m00)) + 1;
                    rs = Math.sqrt(rs);

                    out.y = rs * 0.5;
                    rs = 0.5 / rs;
                    out.w = (m20 - m02) * rs;
                    out.z = (m12 + m21) * rs;
                    out.x = (m10 + m01) * rs;
                } else {
                    // ZDiagDomMatrix
                    rs = (m22 - (m00 + m11)) + 1;
                    rs = Math.sqrt(rs);

                    out.z = rs * 0.5;
                    rs = 0.5 / rs;
                    out.w = (m01 - m10) * rs;
                    out.x = (m20 + m02) * rs;
                    out.y = (m21 + m12) * rs;
                }
            }

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

            return Quaternion.fromMatrix(Matrix.set(
                xaxis.x, yaxis.x, zaxis.x, 0,
                xaxis.y, yaxis.y, zaxis.y, 0,
                xaxis.z, yaxis.z, zaxis.z, 0,
                0, 0, 0, 1, helpMat4_1
            ), out);
        }

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

        public static normalize(out: Quaternion): Quaternion {
            let mag: number = 1 / Math.sqrt(out.x * out.x + out.y * out.y + out.z * out.z + out.w * out.w);

            out.x *= mag;
            out.y *= mag;
            out.z *= mag;
            out.w *= mag;

            return out;
        }

        public static copy(q: Quaternion, out: Quaternion): Quaternion {
            out.x = q.x;
            out.y = q.y;
            out.z = q.z;
            out.w = q.w;

            return out;
        }

        public static inverse(q: Quaternion): Quaternion {
            let norm: number = q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z;

            if (norm > 0.0) {
                let invNorm = 1.0 / norm;
                q.w = q.w * invNorm;
                q.x = -q.x * invNorm;
                q.y = -q.y * invNorm;
                q.z = -q.z * invNorm;
            }

            return q;
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

        public static toMatrix(q: Quaternion, out: Matrix): Matrix {
            let xy2: number = 2.0 * q.x * q.y, xz2: number = 2.0 * q.x * q.z, xw2: number = 2.0 * q.x * q.w;
            let yz2: number = 2.0 * q.y * q.z, yw2: number = 2.0 * q.y * q.w, zw2: number = 2.0 * q.z * q.w;
            let xx: number = q.x * q.x, yy: number = q.y * q.y, zz: number = q.z * q.z, ww: number = q.w * q.w;

            out.rawData[0] = xx - yy - zz + ww;
            out.rawData[4] = xy2 - zw2;
            out.rawData[8] = xz2 + yw2;
            out.rawData[12] = 0;
            out.rawData[1] = xy2 + zw2;
            out.rawData[5] = -xx + yy - zz + ww;
            out.rawData[9] = yz2 - xw2;
            out.rawData[13] = 0;
            out.rawData[2] = xz2 - yw2;
            out.rawData[6] = yz2 + xw2;
            out.rawData[10] = -xx - yy + zz + ww;
            out.rawData[14] = 0;
            out.rawData[3] = 0.0;
            out.rawData[7] = 0.0;
            out.rawData[11] = 0;
            out.rawData[15] = 1;

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

        public static transformVector3ByQuaternionData(src: Float32Array, srcseek: number, vector: Vector3, out: Vector3): Vector3 {
            let x1: number, y1: number, z1: number, w1: number;
            let x2: number = vector.x, y2: number = vector.y, z2: number = vector.z;
            let srcx = src[srcseek]; let srcy = src[srcseek + 1]; let srcz = src[srcseek + 2]; let srcw = src[srcseek + 3];

            w1 = -srcx * x2 - srcy * y2 - srcz * z2;
            x1 = srcw * x2 + srcy * z2 - srcz * y2;
            y1 = srcw * y2 - srcx * z2 + srcz * x2;
            z1 = srcw * z2 + srcx * y2 - srcy * x2;

            out.x = -w1 * srcx + x1 * srcw - y1 * srcz + z1 * srcy;
            out.y = -w1 * srcy + x1 * srcz + y1 * srcw - z1 * srcx;
            out.z = -w1 * srcz - x1 * srcy + y1 * srcx + z1 * srcw;

            return out;
        }

        public static multiplyByQuaternionData(srca: Float32Array, srcaseek: number, srcb: Quaternion, out: Quaternion): Quaternion {
            let w1: number = srca[srcaseek + 3], x1: number = srca[srcaseek + 0], y1: number = srca[srcaseek + 1], z1: number = srca[srcaseek + 2];
            let w2: number = srcb.w, x2: number = srcb.x, y2: number = srcb.y, z2: number = srcb.z;

            out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
            out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
            out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
            out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

            this.normalize(out);

            return out;
        }

        public static lerp(srca: Quaternion, srcb: Quaternion, out: Quaternion, t: number): Quaternion {
            let w1: number = srca.w, x1: number = srca.x, y1: number = srca.y, z1: number = srca.z;
            let w2: number = srcb.w, x2: number = srcb.x, y2: number = srcb.y, z2: number = srcb.z;

            if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }

            out.w = w1 + t * (w2 - w1);
            out.x = x1 + t * (x2 - x1);
            out.y = y1 + t * (y2 - y1);
            out.z = z1 + t * (z2 - z1);

            let len: number = 1.0 / Math.sqrt(out.w * out.w + out.x * out.x + out.y * out.y + out.z * out.z);
            out.w *= len;
            out.x *= len;
            out.y *= len;
            out.z *= len;

            return out;
        }

    }
}