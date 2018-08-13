namespace egret3d {
    /**
     * 
     */
    export class Matrix {
        private static readonly _instances: Matrix[] = [];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop();
            }

            return new Matrix();
        }

        public static release(value: Matrix) {
            if (this._instances.indexOf(value) >= 0) {
                return;
            }

            this._instances.push(value);
        }

        public readonly rawData: Float32Array;

        public constructor(rawData: Float32Array | null = null) {
            if (rawData) {
                this.rawData = rawData;
            }
            else {
                this.rawData = new Float32Array([
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0
                ]);
            }
        }

        public copy(value: Readonly<Matrix>) {
            const fromRawData = value.rawData;
            const toRawData = this.rawData;
            toRawData[0] = fromRawData[0];
            toRawData[1] = fromRawData[1];
            toRawData[2] = fromRawData[2];
            toRawData[3] = fromRawData[3];

            toRawData[4] = fromRawData[4];
            toRawData[5] = fromRawData[5];
            toRawData[6] = fromRawData[6];
            toRawData[7] = fromRawData[7];

            toRawData[8] = fromRawData[8];
            toRawData[9] = fromRawData[9];
            toRawData[10] = fromRawData[10];
            toRawData[11] = fromRawData[11];

            toRawData[12] = fromRawData[12];
            toRawData[13] = fromRawData[13];
            toRawData[14] = fromRawData[14];
            toRawData[15] = fromRawData[15];

            return this;
        }

        public clone() {
            const value = new Matrix();
            value.copy(this);

            return value;
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
            n11: number, n21: number, n31: number, n41: number,
            n12: number, n22: number, n32: number, n42: number,
            n13: number, n23: number, n33: number, n43: number,
            n14: number, n24: number, n34: number, n44: number,
        ) {
            this.rawData[0] = n11;
            this.rawData[1] = n12;
            this.rawData[2] = n13;
            this.rawData[3] = n14;

            this.rawData[4] = n21;
            this.rawData[5] = n22;
            this.rawData[6] = n23;
            this.rawData[7] = n24;

            this.rawData[8] = n31;
            this.rawData[9] = n32;
            this.rawData[10] = n33;
            this.rawData[11] = n34;

            this.rawData[12] = n41;
            this.rawData[13] = n42;
            this.rawData[14] = n43;
            this.rawData[15] = n44;

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

            const l1 = value.rawData[0];
            const l2 = value.rawData[1];
            const l3 = value.rawData[2];
            const l4 = value.rawData[3];
            const l5 = value.rawData[4];
            const l6 = value.rawData[5];
            const l7 = value.rawData[6];
            const l8 = value.rawData[7];
            const l9 = value.rawData[8];
            const l10 = value.rawData[9];
            const l11 = value.rawData[10];
            const l12 = value.rawData[11];
            const l13 = value.rawData[12];
            const l14 = value.rawData[13];
            const l15 = value.rawData[14];
            const l16 = value.rawData[15];
            const l17 = (l11 * l16) - (l12 * l15);
            const l18 = (l10 * l16) - (l12 * l14);
            const l19 = (l10 * l15) - (l11 * l14);
            const l20 = (l9 * l16) - (l12 * l13);
            const l21 = (l9 * l15) - (l11 * l13);
            const l22 = (l9 * l14) - (l10 * l13);
            const l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            const l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            const l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            const l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            const l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            const l28 = (l7 * l16) - (l8 * l15);
            const l29 = (l6 * l16) - (l8 * l14);
            const l30 = (l6 * l15) - (l7 * l14);
            const l31 = (l5 * l16) - (l8 * l13);
            const l32 = (l5 * l15) - (l7 * l13);
            const l33 = (l5 * l14) - (l6 * l13);
            const l34 = (l7 * l12) - (l8 * l11);
            const l35 = (l6 * l12) - (l8 * l10);
            const l36 = (l6 * l11) - (l7 * l10);
            const l37 = (l5 * l12) - (l8 * l9);
            const l38 = (l5 * l11) - (l7 * l9);
            const l39 = (l5 * l10) - (l6 * l9);

            const rawData = this.rawData;

            rawData[0] = l23 * l27;
            rawData[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            rawData[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            rawData[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            rawData[4] = l24 * l27;
            rawData[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            rawData[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            rawData[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            rawData[8] = l25 * l27;
            rawData[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            rawData[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            rawData[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            rawData[12] = l26 * l27;
            rawData[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            rawData[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            rawData[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;

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
                let sx = _helpVectorA.set(rawData[0], rawData[1], rawData[2]).length;
                let sy = _helpVectorA.set(rawData[4], rawData[5], rawData[6]).length;
                let sz = _helpVectorA.set(rawData[8], rawData[9], rawData[10]).length;

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

        public fromRotation(rotation: Quaternion) {
            return this.compose(Vector3.ZERO, rotation, Vector3.ONE);
        }

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

        public static lerp(left: Matrix, right: Matrix, v: number, out: Matrix): Matrix {
            for (let i = 0; i < 16; i++) {
                out.rawData[i] = left.rawData[i] * (1 - v) + right.rawData[i] * v;
            }
            return out;
        }

        public static add(left: Matrix, right: Matrix, out: Matrix): Matrix {
            out.rawData[0] = left.rawData[0] + right.rawData[0];
            out.rawData[1] = left.rawData[1] + right.rawData[1];
            out.rawData[2] = left.rawData[2] + right.rawData[2];
            out.rawData[3] = left.rawData[3] + right.rawData[3];

            out.rawData[4] = left.rawData[4] + right.rawData[4];
            out.rawData[5] = left.rawData[5] + right.rawData[5];
            out.rawData[6] = left.rawData[6] + right.rawData[6];
            out.rawData[7] = left.rawData[7] + right.rawData[7];

            out.rawData[8] = left.rawData[8] + right.rawData[8];
            out.rawData[9] = left.rawData[9] + right.rawData[9];
            out.rawData[10] = left.rawData[10] + right.rawData[10];
            out.rawData[11] = left.rawData[11] + right.rawData[11];

            out.rawData[12] = left.rawData[12] + right.rawData[12];
            out.rawData[13] = left.rawData[13] + right.rawData[13];
            out.rawData[14] = left.rawData[14] + right.rawData[14];
            out.rawData[15] = left.rawData[15] + right.rawData[15];

            return out;
        }

        public static multiply(lhs: Matrix, rhs: Matrix, out: Matrix): Matrix {
            const a00 = lhs.rawData[0], a01 = lhs.rawData[1], a02 = lhs.rawData[2], a03 = lhs.rawData[3];
            const a10 = lhs.rawData[4], a11 = lhs.rawData[5], a12 = lhs.rawData[6], a13 = lhs.rawData[7];
            const a20 = lhs.rawData[8], a21 = lhs.rawData[9], a22 = lhs.rawData[10], a23 = lhs.rawData[11];
            const a30 = lhs.rawData[12], a31 = lhs.rawData[13], a32 = lhs.rawData[14], a33 = lhs.rawData[15];

            let b0 = rhs.rawData[0],
                b1 = rhs.rawData[1],
                b2 = rhs.rawData[2],
                b3 = rhs.rawData[3];

            out.rawData[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[4];
            b1 = rhs.rawData[5];
            b2 = rhs.rawData[6];
            b3 = rhs.rawData[7];

            out.rawData[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[8];
            b1 = rhs.rawData[9];
            b2 = rhs.rawData[10];
            b3 = rhs.rawData[11];

            out.rawData[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[12];
            b1 = rhs.rawData[13];
            b2 = rhs.rawData[14];
            b3 = rhs.rawData[15];

            out.rawData[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            return out;
        }

        public static scale(scaler: number, m: Matrix): Matrix {
            m.rawData[0] *= scaler;
            m.rawData[1] *= scaler;
            m.rawData[2] *= scaler;
            m.rawData[3] *= scaler;

            m.rawData[4] *= scaler;
            m.rawData[5] *= scaler;
            m.rawData[6] *= scaler;
            m.rawData[7] *= scaler;

            m.rawData[8] *= scaler;
            m.rawData[9] *= scaler;
            m.rawData[10] *= scaler;
            m.rawData[11] *= scaler;

            m.rawData[12] *= scaler;
            m.rawData[13] *= scaler;
            m.rawData[14] *= scaler;
            m.rawData[15] *= scaler;

            return m;
        }

        public static formScale(xScale: number, yScale: number, zScale: number, out: Matrix): Matrix {
            out.rawData[0] = xScale; out.rawData[1] = 0.0; out.rawData[2] = 0.0; out.rawData[3] = 0.0;
            out.rawData[4] = 0.0; out.rawData[5] = yScale; out.rawData[6] = 0.0; out.rawData[7] = 0.0;
            out.rawData[8] = 0.0; out.rawData[9] = 0.0; out.rawData[10] = zScale; out.rawData[11] = 0.0;
            out.rawData[12] = 0.0; out.rawData[13] = 0.0; out.rawData[14] = 0.0; out.rawData[15] = 1.0;
            return out;
        }

        public static fromTranslate(x: number, y: number, z: number, out: Matrix): Matrix {
            out.rawData[0] = 1.0; out.rawData[1] = 0.0; out.rawData[2] = 0.0; out.rawData[3] = 0;
            out.rawData[4] = 0.0; out.rawData[5] = 1.0; out.rawData[6] = 0.0; out.rawData[7] = 0.0;
            out.rawData[8] = 0.0; out.rawData[9] = 0.0; out.rawData[10] = 1.0; out.rawData[11] = 0.0;
            out.rawData[12] = x; out.rawData[13] = y; out.rawData[14] = z; out.rawData[15] = 1.0;
            return out;
        }

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

        public static toEulerAngles(matrix: Matrix, out: Vector3): Vector3 {
            var x, y, z, sx, sy, sz, m, halfPi;
            var scale = _helpVectorA;

            matrix.decompose(null, null, scale);

            sx = scale.x;
            sy = scale.y;
            sz = scale.z;

            m = matrix.rawData;

            y = Math.asin(-m[2] / sx);
            halfPi = Math.PI * 0.5;

            if (y < halfPi) {
                if (y > -halfPi) {
                    x = Math.atan2(m[6] / sy, m[10] / sz);
                    z = Math.atan2(m[1] / sx, m[0] / sx);
                } else {
                    // Not a unique solution
                    z = 0;
                    x = -Math.atan2(m[4] / sy, m[5] / sy);
                }
            } else {
                // Not a unique solution
                z = 0;
                x = Math.atan2(m[4] / sy, m[5] / sy);
            }

            out.x = x * 180 / Math.PI;
            out.y = y * 180 / Math.PI;
            out.z = z * 180 / Math.PI;

            return out;
        }
    }

    const _helpVectorA = new Vector3();
    const _helpMatrixA = new Matrix();

    export const helpMatrixA = new Matrix();
    export const helpMatrixB = new Matrix();
    export const helpMatrixC = new Matrix();
    export const helpMatrixD = new Matrix();
}