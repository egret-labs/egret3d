namespace egret3d {
    const _array = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    /**
     * 
     */
    export class Matrix {
        private static readonly _instances: Matrix[] = [];
        /**
         * 
         * @param rawData 
         * @param offset 
         */
        public static create(rawData: Readonly<ArrayLike<number>> | null = null, offset: number = 0) {
            if (this._instances.length > 0) {
                return this._instances.pop();
            }

            const matrix = new Matrix();

            if (rawData) {
                matrix.fromArray(rawData, offset)
            }

            return matrix;
        }
        /**
         * 
         * @param value 
         */
        public static release(value: Matrix) {
            if (this._instances.indexOf(value) >= 0) {
                return;
            }

            this._instances.push(value);
        }

        public readonly rawData: Float32Array = new Float32Array(_array);
        /**
         * @deprecated
         * @private
         */
        public constructor() {
        }

        public copy(value: Readonly<Matrix>) {
            this.fromArray(value.rawData);

            return this;
        }

        public clone() {
            return Matrix.create(this.rawData);
        }

        public identity() {
            this.rawData[0] = 1.0;
            this.rawData[1] = 0.0;
            this.rawData[2] = 0.0;
            this.rawData[3] = 0.0;

            this.rawData[4] = 0.0;
            this.rawData[5] = 1.0;
            this.rawData[6] = 0.0;
            this.rawData[7] = 0.0;

            this.rawData[8] = 0.0;
            this.rawData[9] = 0.0;
            this.rawData[10] = 1.0;
            this.rawData[11] = 0.0;

            this.rawData[12] = 0.0;
            this.rawData[13] = 0.0;
            this.rawData[14] = 0.0;
            this.rawData[15] = 1.0;

            return this;
        }

        public set(
            m11: number, m12: number, m13: number, m14: number,
            m21: number, m22: number, m23: number, m24: number,
            m31: number, m32: number, m33: number, m34: number,
            m41: number, m42: number, m43: number, m44: number,
        ) {
            this.rawData[0] = m11;
            this.rawData[1] = m12;
            this.rawData[2] = m13;
            this.rawData[3] = m14;

            this.rawData[4] = m21;
            this.rawData[5] = m22;
            this.rawData[6] = m23;
            this.rawData[7] = m24;

            this.rawData[8] = m31;
            this.rawData[9] = m32;
            this.rawData[10] = m33;
            this.rawData[11] = m34;

            this.rawData[12] = m41;
            this.rawData[13] = m42;
            this.rawData[14] = m43;
            this.rawData[15] = m44;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            for (let i = 0; i < 16; ++i) {
                this.rawData[i] = value[i + offset];
            }

            return this;
        }

        public fromTranslate(x: number, y: number, z: number, keepRotationAndScale: boolean = false) {
            if (!keepRotationAndScale) {
                this.identity();
            }

            this.rawData[12] = x;
            this.rawData[13] = y;
            this.rawData[14] = z;

            return this;
        }

        public fromRotation(rotation: Quaternion, keepTranslate: boolean = false) {
            return this.compose(keepTranslate ? _helpVector3A.fromArray(this.rawData, 12) : Vector3.ZERO, rotation, Vector3.ONE);
        }

        public fromEuler(value: Readonly<IVector3>, order: EulerOrder = EulerOrder.XYZ, keepTranslate: boolean = false) {
            // http://www.mathworks.com/matlabcentral/fileexchange/
            // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
            //	content/SpinCalc.m

            const cos = Math.cos;
            const sin = Math.sin;

            const { x, y, z } = value;
            const a = cos(x), b = sin(x);
            const c = cos(y), d = sin(y);
            const e = cos(z), f = sin(z);

            const rawData = this.rawData;

            switch (order) {
                case EulerOrder.XYZ: {
                    const ae = a * e, af = a * f, be = b * e, bf = b * f;

                    rawData[0] = c * e;
                    rawData[4] = - c * f;
                    rawData[8] = d;

                    rawData[1] = af + be * d;
                    rawData[5] = ae - bf * d;
                    rawData[9] = - b * c;

                    rawData[2] = bf - ae * d;
                    rawData[6] = be + af * d;
                    rawData[10] = a * c;
                    break;
                }

                case EulerOrder.XZY: {
                    const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

                    rawData[0] = c * e;
                    rawData[4] = - f;
                    rawData[8] = d * e;

                    rawData[1] = ac * f + bd;
                    rawData[5] = a * e;
                    rawData[9] = ad * f - bc;

                    rawData[2] = bc * f - ad;
                    rawData[6] = b * e;
                    rawData[10] = bd * f + ac;
                    break;
                }

                case EulerOrder.YXZ: {
                    const ce = c * e, cf = c * f, de = d * e, df = d * f;

                    rawData[0] = ce + df * b;
                    rawData[4] = de * b - cf;
                    rawData[8] = a * d;

                    rawData[1] = a * f;
                    rawData[5] = a * e;
                    rawData[9] = - b;

                    rawData[2] = cf * b - de;
                    rawData[6] = df + ce * b;
                    rawData[10] = a * c;
                    break;
                }

                case EulerOrder.YZX: {
                    var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

                    rawData[0] = c * e;
                    rawData[4] = bd - ac * f;
                    rawData[8] = bc * f + ad;

                    rawData[1] = f;
                    rawData[5] = a * e;
                    rawData[9] = - b * e;

                    rawData[2] = - d * e;
                    rawData[6] = ad * f + bc;
                    rawData[10] = ac - bd * f;
                    break;
                }

                case EulerOrder.ZXY: {
                    const ce = c * e, cf = c * f, de = d * e, df = d * f;

                    rawData[0] = ce - df * b;
                    rawData[4] = - a * f;
                    rawData[8] = de + cf * b;

                    rawData[1] = cf + de * b;
                    rawData[5] = a * e;
                    rawData[9] = df - ce * b;

                    rawData[2] = - a * d;
                    rawData[6] = b;
                    rawData[10] = a * c;
                    break;
                }

                case EulerOrder.ZYX: {
                    const ae = a * e, af = a * f, be = b * e, bf = b * f;

                    rawData[0] = c * e;
                    rawData[4] = be * d - af;
                    rawData[8] = ae * d + bf;

                    rawData[1] = c * f;
                    rawData[5] = bf * d + ae;
                    rawData[9] = af * d - be;

                    rawData[2] = - d;
                    rawData[6] = b * c;
                    rawData[10] = a * c;
                    break;
                }
            }

            // bottom row
            rawData[3] = 0.0;
            rawData[7] = 0.0;
            rawData[11] = 0.0;

            if (!keepTranslate) {
                // last column
                rawData[12] = 0.0;
                rawData[13] = 0.0;
                rawData[14] = 0.0;
                rawData[15] = 1.0;
            }

            return this;
        }

        public formScale(x: number, y: number, z: number, keepTranslate: boolean = false) {
            if (keepTranslate) {
                _helpVector3A.fromArray(this.rawData, 12);
            }

            this.identity();

            this.rawData[0] = x;
            this.rawData[5] = y;
            this.rawData[10] = z;

            if (keepTranslate) {
                this.rawData[12] = _helpVector3A.x;
                this.rawData[13] = _helpVector3A.y;
                this.rawData[14] = _helpVector3A.z;
            }

            return this;
        }

        public determinant() {
            const rawData = this.rawData;
            const n11 = rawData[0], n12 = rawData[4], n13 = rawData[8], n14 = rawData[12];
            const n21 = rawData[1], n22 = rawData[5], n23 = rawData[9], n24 = rawData[13];
            const n31 = rawData[2], n32 = rawData[6], n33 = rawData[10], n34 = rawData[14];
            const n41 = rawData[3], n42 = rawData[7], n43 = rawData[11], n44 = rawData[15];

            //TODO: make this more efficient
            //( based on https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js )

            return (
                n41 * (
                    + n14 * n23 * n32
                    - n13 * n24 * n32
                    - n14 * n22 * n33
                    + n12 * n24 * n33
                    + n13 * n22 * n34
                    - n12 * n23 * n34
                ) +
                n42 * (
                    + n11 * n23 * n34
                    - n11 * n24 * n33
                    + n14 * n21 * n33
                    - n13 * n21 * n34
                    + n13 * n24 * n31
                    - n14 * n23 * n31
                ) +
                n43 * (
                    + n11 * n24 * n32
                    - n11 * n22 * n34
                    - n14 * n21 * n32
                    + n12 * n21 * n34
                    + n14 * n22 * n31
                    - n12 * n24 * n31
                ) +
                n44 * (
                    - n13 * n22 * n31
                    - n11 * n23 * n32
                    + n11 * n22 * n33
                    + n13 * n21 * n32
                    - n12 * n21 * n33
                    + n12 * n23 * n31
                )
            );
        }

        public compose(translation: Vector3, rotation: Quaternion, scale: Vector3) {
            const rawData = this.rawData;
            const x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
            const x2 = x + x, y2 = y + y, z2 = z + z;
            const xx = x * x2, xy = x * y2, xz = x * z2;
            const yy = y * y2, yz = y * z2, zz = z * z2;
            const wx = w * x2, wy = w * y2, wz = w * z2;

            const sx = scale.x, sy = scale.y, sz = scale.z;

            rawData[0] = (1.0 - (yy + zz)) * sx;
            rawData[1] = (xy + wz) * sx;
            rawData[2] = (xz - wy) * sx;
            rawData[3] = 0.0;

            rawData[4] = (xy - wz) * sy;
            rawData[5] = (1.0 - (xx + zz)) * sy;
            rawData[6] = (yz + wx) * sy;
            rawData[7] = 0.0;

            rawData[8] = (xz + wy) * sz;
            rawData[9] = (yz - wx) * sz;
            rawData[10] = (1.0 - (xx + yy)) * sz;
            rawData[11] = 0.0;

            rawData[12] = translation.x;
            rawData[13] = translation.y;
            rawData[14] = translation.z;
            rawData[15] = 1.0;

            return this;
        }

        public decompose(translation: Vector3 | null = null, rotation: Quaternion | null = null, scale: Vector3 | null = null) {
            const rawData = this.rawData;

            if (translation) {
                translation.x = rawData[12];
                translation.y = rawData[13];
                translation.z = rawData[14];
            }

            if (rotation || scale) {
                let sx = _helpVector3A.set(rawData[0], rawData[1], rawData[2]).length;
                let sy = _helpVector3A.set(rawData[4], rawData[5], rawData[6]).length;
                let sz = _helpVector3A.set(rawData[8], rawData[9], rawData[10]).length;

                // if determine is negative, we need to invert one scale
                const det = this.determinant();
                if (det < 0.0) sx = - sx;

                if (rotation) {
                    // scale the rotation part
                    _helpMatrixA.copy(this);

                    const invSX = 1.0 / sx;
                    const invSY = 1.0 / sy;
                    const invSZ = 1.0 / sz;

                    _helpMatrixA.rawData[0] *= invSX;
                    _helpMatrixA.rawData[1] *= invSX;
                    _helpMatrixA.rawData[2] *= invSX;

                    _helpMatrixA.rawData[4] *= invSY;
                    _helpMatrixA.rawData[5] *= invSY;
                    _helpMatrixA.rawData[6] *= invSY;

                    _helpMatrixA.rawData[8] *= invSZ;
                    _helpMatrixA.rawData[9] *= invSZ;
                    _helpMatrixA.rawData[10] *= invSZ;

                    rotation.fromMatrix(_helpMatrixA);
                }

                if (scale) {
                    scale.x = sx;
                    scale.y = sy;
                    scale.z = sz;
                }
            }

            return this;
        }

        public transpose(value?: Readonly<Matrix>) {
            if (!value) {
                value = this;
            }

            const valueRawData = value.rawData;
            const rawData = this.rawData;
            let tmp = 0.0;

            tmp = valueRawData[1]; rawData[1] = valueRawData[4]; rawData[4] = tmp;
            tmp = valueRawData[2]; rawData[2] = valueRawData[8]; rawData[8] = tmp;
            tmp = valueRawData[6]; rawData[6] = valueRawData[9]; rawData[9] = tmp;

            tmp = valueRawData[3]; rawData[3] = valueRawData[12]; rawData[12] = tmp;
            tmp = valueRawData[7]; rawData[7] = valueRawData[13]; rawData[13] = tmp;
            tmp = valueRawData[11]; rawData[11] = valueRawData[14]; rawData[14] = tmp;

            return this;
        }

        public inverse(value?: Readonly<Matrix>) {
            if (!value) {
                value = this;
            }

            const rawData = this.rawData,
                tragetRawData = value.rawData,

                n11 = tragetRawData[0], n21 = tragetRawData[1], n31 = tragetRawData[2], n41 = tragetRawData[3],
                n12 = tragetRawData[4], n22 = tragetRawData[5], n32 = tragetRawData[6], n42 = tragetRawData[7],
                n13 = tragetRawData[8], n23 = tragetRawData[9], n33 = tragetRawData[10], n43 = tragetRawData[11],
                n14 = tragetRawData[12], n24 = tragetRawData[13], n34 = tragetRawData[14], n44 = tragetRawData[15],

                t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
                t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
                t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
                t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

            const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

            if (det === 0.0) {

                console.warn("Cannot invert matrix, determinant is 0.");

                return this.identity();
            }

            const detInv = 1.0 / det;

            rawData[0] = t11 * detInv;
            rawData[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
            rawData[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
            rawData[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

            rawData[4] = t12 * detInv;
            rawData[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
            rawData[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
            rawData[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

            rawData[8] = t13 * detInv;
            rawData[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
            rawData[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
            rawData[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

            rawData[12] = t14 * detInv;
            rawData[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
            rawData[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
            rawData[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

            return this;
        }

        public multiply(lhs: Matrix, rhs?: Matrix) {
            if (!rhs) {
                rhs = lhs;
                lhs = this;
            }

            const a00 = lhs.rawData[0], a01 = lhs.rawData[1], a02 = lhs.rawData[2], a03 = lhs.rawData[3];
            const a10 = lhs.rawData[4], a11 = lhs.rawData[5], a12 = lhs.rawData[6], a13 = lhs.rawData[7];
            const a20 = lhs.rawData[8], a21 = lhs.rawData[9], a22 = lhs.rawData[10], a23 = lhs.rawData[11];
            const a30 = lhs.rawData[12], a31 = lhs.rawData[13], a32 = lhs.rawData[14], a33 = lhs.rawData[15];

            let b0 = rhs.rawData[0],
                b1 = rhs.rawData[1],
                b2 = rhs.rawData[2],
                b3 = rhs.rawData[3];

            this.rawData[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.rawData[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.rawData[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.rawData[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[4];
            b1 = rhs.rawData[5];
            b2 = rhs.rawData[6];
            b3 = rhs.rawData[7];

            this.rawData[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.rawData[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.rawData[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.rawData[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[8];
            b1 = rhs.rawData[9];
            b2 = rhs.rawData[10];
            b3 = rhs.rawData[11];

            this.rawData[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.rawData[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.rawData[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.rawData[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[12];
            b1 = rhs.rawData[13];
            b2 = rhs.rawData[14];
            b3 = rhs.rawData[15];

            this.rawData[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.rawData[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.rawData[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.rawData[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            return this;
        }

        public premultiply(value: Readonly<Matrix>) {
            return this.multiply(value, this);
        }
        /**
         * - 两点位置不重合。
         * @param eye 
         * @param target 
         * @param up 
         */
        public lookAt(eye: Readonly<IVector3>, target: Readonly<IVector3>, up: Readonly<IVector3>) {
            const z = _helpVector3C.subtract(eye, target).normalize();
            const x = _helpVector3A.cross(up, z).normalize();
            const y = _helpVector3B.cross(z, x);
            const rawData = this.rawData;

            rawData[0] = x.x; rawData[4] = y.x; rawData[8] = z.x;
            rawData[1] = x.y; rawData[5] = y.y; rawData[9] = z.y;
            rawData[2] = x.z; rawData[6] = y.z; rawData[10] = z.z;

            return this;
        }

        public toEuler(value: Vector3, order: EulerOrder = EulerOrder.XYZ) {
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            const rawData = this.rawData;
            const m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            const m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            const m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];

            switch (order) {
                case EulerOrder.XYZ: {
                    value.y = Math.asin(floatClamp(m13, -1.0, 1.0));

                    if (Math.abs(m13) < 0.999999) {
                        value.x = Math.atan2(-m23, m33);
                        value.z = Math.atan2(-m12, m11);
                    }
                    else {
                        value.x = Math.atan2(m32, m22);
                        value.z = 0.0;
                    }
                    break;
                }

                case EulerOrder.XZY: {
                    value.z = Math.asin(-floatClamp(m12, -1.0, 1.0));

                    if (Math.abs(m12) < 0.999999) {
                        value.x = Math.atan2(m32, m22);
                        value.y = Math.atan2(m13, m11);
                    }
                    else {
                        value.x = Math.atan2(-m23, m33);
                        value.y = 0.0;
                    }
                    break;
                }

                case EulerOrder.YXZ: {
                    value.x = Math.asin(-floatClamp(m23, -1.0, 1.0));

                    if (Math.abs(m23) < 0.999999) {
                        value.y = Math.atan2(m13, m33);
                        value.z = Math.atan2(m21, m22);
                    }
                    else {
                        value.y = Math.atan2(-m31, m11);
                        value.z = 0.0;
                    }
                    break;
                }

                case EulerOrder.YZX: {
                    value.z = Math.asin(floatClamp(m21, -1.0, 1.0));

                    if (Math.abs(m21) < 0.999999) {
                        value.x = Math.atan2(-m23, m22);
                        value.y = Math.atan2(-m31, m11);
                    }
                    else {
                        value.x = 0.0;
                        value.y = Math.atan2(m13, m33);
                    }
                    break;
                }

                case EulerOrder.ZXY: {
                    value.x = Math.asin(floatClamp(m32, -1.0, 1.0));

                    if (Math.abs(m32) < 0.999999) {
                        value.y = Math.atan2(- m31, m33);
                        value.z = Math.atan2(- m12, m22);
                    }
                    else {
                        value.y = 0.0;
                        value.z = Math.atan2(m21, m11);
                    }
                    break;
                }

                case EulerOrder.ZYX: {
                    value.y = Math.asin(-floatClamp(m31, -1.0, 1.0));

                    if (Math.abs(m31) < 0.999999) {
                        value.x = Math.atan2(m32, m33);
                        value.z = Math.atan2(m21, m11);
                    }
                    else {
                        value.x = 0.0;
                        value.z = Math.atan2(- m12, m22);
                    }
                    break;
                }
            }

            return value;
        }
        /**
         * @deprecated
         */
        public transformVector3(value: Vector3, out?: Vector3) {
            const x = (value.x * this.rawData[0]) + (value.y * this.rawData[4]) + (value.z * this.rawData[8]) + this.rawData[12];
            const y = (value.x * this.rawData[1]) + (value.y * this.rawData[5]) + (value.z * this.rawData[9]) + this.rawData[13];
            const z = (value.x * this.rawData[2]) + (value.y * this.rawData[6]) + (value.z * this.rawData[10]) + this.rawData[14];
            const w = (value.x * this.rawData[3]) + (value.y * this.rawData[7]) + (value.z * this.rawData[11]) + this.rawData[15];

            if (!out) {
                out = value;
            }

            out.x = x / w;
            out.y = y / w;
            out.z = z / w;

            return out;
        }
        /**
         * @deprecated
         */
        public transformNormal(value: Vector3, out?: Vector3): Vector3 {
            const x = (value.x * this.rawData[0]) + (value.y * this.rawData[4]) + (value.z * this.rawData[8]);
            const y = (value.x * this.rawData[1]) + (value.y * this.rawData[5]) + (value.z * this.rawData[9]);
            const z = (value.x * this.rawData[2]) + (value.y * this.rawData[6]) + (value.z * this.rawData[10]);

            if (!out) {
                out = value;
            }

            out.x = x;
            out.y = y;
            out.z = z;

            return out;
        }
        /**
         * @deprecated
         */
        public scale(scaler: number) { // TODO
            const rawData = this.rawData;

            rawData[0] *= scaler;
            rawData[1] *= scaler;
            rawData[2] *= scaler;
            rawData[3] *= scaler;

            rawData[4] *= scaler;
            rawData[5] *= scaler;
            rawData[6] *= scaler;
            rawData[7] *= scaler;

            rawData[8] *= scaler;
            rawData[9] *= scaler;
            rawData[10] *= scaler;
            rawData[11] *= scaler;

            rawData[12] *= scaler;
            rawData[13] *= scaler;
            rawData[14] *= scaler;
            rawData[15] *= scaler;

            return this;
        }
        /**
         * @deprecated
         */
        public add(left: Matrix, right?: Matrix) { // TODO
            if (!right) {
                right = left;
                left = this;
            }

            this.rawData[0] = left.rawData[0] + right.rawData[0];
            this.rawData[1] = left.rawData[1] + right.rawData[1];
            this.rawData[2] = left.rawData[2] + right.rawData[2];
            this.rawData[3] = left.rawData[3] + right.rawData[3];

            this.rawData[4] = left.rawData[4] + right.rawData[4];
            this.rawData[5] = left.rawData[5] + right.rawData[5];
            this.rawData[6] = left.rawData[6] + right.rawData[6];
            this.rawData[7] = left.rawData[7] + right.rawData[7];

            this.rawData[8] = left.rawData[8] + right.rawData[8];
            this.rawData[9] = left.rawData[9] + right.rawData[9];
            this.rawData[10] = left.rawData[10] + right.rawData[10];
            this.rawData[11] = left.rawData[11] + right.rawData[11];

            this.rawData[12] = left.rawData[12] + right.rawData[12];
            this.rawData[13] = left.rawData[13] + right.rawData[13];
            this.rawData[14] = left.rawData[14] + right.rawData[14];
            this.rawData[15] = left.rawData[15] + right.rawData[15];

            return this;
        }
        /**
         * @deprecated
         */
        public lerp(v: number, left: Matrix, right?: Matrix) { // TODO
            const p = 1.0 - v;
            if (right) {
                for (let i = 0; i < 16; i++) {
                    this.rawData[i] = left.rawData[i] * p + right.rawData[i] * v;
                }
            }
            else {
                for (let i = 0; i < 16; i++) {
                    this.rawData[i] = this.rawData[i] * p + left.rawData[i] * v;
                }
            }

            return this;
        }
        /**
         * @deprecated
         */
        public static perspectiveProjectLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix): Matrix {
            let tan = 1.0 / (Math.tan(fov * 0.5));
            out.rawData[0] = tan / aspect;
            out.rawData[1] = out.rawData[2] = out.rawData[3] = 0.0;

            out.rawData[4] = out.rawData[6] = out.rawData[7] = 0.0;
            out.rawData[5] = tan;

            out.rawData[8] = out.rawData[9] = 0.0;
            out.rawData[10] = (zfar + znear) / (zfar - znear);
            out.rawData[11] = 1.0;

            out.rawData[12] = out.rawData[13] = out.rawData[15] = 0.0;
            out.rawData[14] = -2 * (znear * zfar) / (zfar - znear);

            return out;
        }
        /**
         * @deprecated
         */
        public static orthoProjectLH(width: number, height: number, znear: number, zfar: number, out: Matrix): Matrix {
            let hw = 2.0 / width;
            let hh = 2.0 / height;
            let id = 2.0 / (zfar - znear);
            let nid = (znear + zfar) / (znear - zfar);

            out.rawData[0] = hw;
            out.rawData[1] = 0;
            out.rawData[2] = 0;
            out.rawData[3] = 0;

            out.rawData[4] = 0;
            out.rawData[5] = hh;
            out.rawData[6] = 0;
            out.rawData[7] = 0;

            out.rawData[8] = 0;
            out.rawData[9] = 0;
            out.rawData[10] = id;
            out.rawData[11] = 0;

            out.rawData[12] = 0;
            out.rawData[13] = 0;
            out.rawData[14] = nid;
            out.rawData[15] = 1;

            return out;
        }
    }

    const _helpVector3A = new Vector3();
    const _helpVector3B = new Vector3();
    const _helpVector3C = new Vector3();
    const _helpMatrixA = new Matrix();

    export const helpMatrixA = new Matrix();
    export const helpMatrixB = new Matrix();
    export const helpMatrixC = new Matrix();
    export const helpMatrixD = new Matrix();
}