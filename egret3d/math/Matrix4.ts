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
    export class Matrix4 implements paper.IRelease<Matrix4>, paper.ISerializable {
        public static readonly IDENTITY: Readonly<Matrix4> = new Matrix4();

        private static readonly _instances: Matrix4[] = [];
        /**
         * 
         * @param rawData 
         * @param offsetOrByteOffset 
         */
        public static create(rawData?: Readonly<ArrayLike<number>> | ArrayBuffer, offsetOrByteOffset: number = 0) {
            if (this._instances.length > 0) {
                const matrix = this._instances.pop()!;
                if (rawData) {
                    if (rawData instanceof ArrayBuffer) {
                        matrix.fromBuffer(rawData, offsetOrByteOffset);
                    }
                    else {
                        matrix.fromArray(rawData, offsetOrByteOffset);
                    }
                }
                else {
                    matrix.identity();
                }

                return matrix;
            }

            return new Matrix4(rawData, offsetOrByteOffset);
        }
        /**
         * 
         */
        public release() {
            if (Matrix4._instances.indexOf(this) < 0) {
                Matrix4._instances.push(this);
            }

            return this;
        }
        /**
         * @readonly
         */
        public rawData: Float32Array = null!;
        /**
         * 请使用 `egret3d.Matrix4.create()` 创建实例。
         * @see egret3d.Matrix4.create()
         * @deprecated
         */
        public constructor(rawData?: Readonly<ArrayLike<number>> | ArrayBuffer, offsetOrByteOffset: number = 0) {
            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(16);
                this.fromArray(rawData || _array);
            }
        }

        public serialize() {
            return this.rawData;
        }

        public deserialize(value: Readonly<[
            number, number, number, number,
            number, number, number, number,
            number, number, number, number,
            number, number, number, number
        ]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<Matrix4>) {
            this.fromArray(value.rawData);

            return this;
        }

        public clone() {
            return Matrix4.create(this.rawData);
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
            n11: number, n12: number, n13: number, n14: number,
            n21: number, n22: number, n23: number, n24: number,
            n31: number, n32: number, n33: number, n34: number,
            n41: number, n42: number, n43: number, n44: number,
        ) {
            const rawData = this.rawData;
            rawData[0] = n11; rawData[4] = n12; rawData[8] = n13; rawData[12] = n14;
            rawData[1] = n21; rawData[5] = n22; rawData[9] = n23; rawData[13] = n24;
            rawData[2] = n31; rawData[6] = n32; rawData[10] = n33; rawData[14] = n34;
            rawData[3] = n41; rawData[7] = n42; rawData[11] = n43; rawData[15] = n44;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            for (let i = 0; i < 16; ++i) {
                this.rawData[i] = value[i + offset];
            }

            return this;
        }

        public fromBuffer(value: ArrayBuffer, byteOffset: number = 0) {
            this.rawData = new Float32Array(value, byteOffset, 16);

            return this;
        }

        public fromTranslate(value: Readonly<IVector3>, rotationAndScaleStays: boolean = false) {
            if (!rotationAndScaleStays) {
                this.identity();
            }

            this.rawData[12] = value.x;
            this.rawData[13] = value.y;
            this.rawData[14] = value.z;

            return this;
        }

        public fromRotation(rotation: Quaternion, translateStays: boolean = false) {
            return this.compose(translateStays ? _helpVector3A.fromArray(this.rawData, 12) : Vector3.ZERO, rotation, Vector3.ONE);
        }

        public fromEuler(value: Readonly<IVector3>, order: EulerOrder = EulerOrder.YXZ, translateStays: boolean = false) {
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

            if (!translateStays) {
                // last column
                rawData[12] = 0.0;
                rawData[13] = 0.0;
                rawData[14] = 0.0;
                rawData[15] = 1.0;
            }

            return this;
        }

        public fromScale(x: number, y: number, z: number, translateStays: boolean = false) {
            if (translateStays) {
                _helpVector3A.fromArray(this.rawData, 12);
            }

            this.identity();

            this.rawData[0] = x;
            this.rawData[5] = y;
            this.rawData[10] = z;

            if (translateStays) {
                this.rawData[12] = _helpVector3A.x;
                this.rawData[13] = _helpVector3A.y;
                this.rawData[14] = _helpVector3A.z;
            }

            return this;
        }

        public fromAxis(axis: Readonly<IVector3>, radian: number = 0.0) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            const c = Math.cos(radian);
            const s = Math.sin(radian);
            const t = 1.0 - c;
            const x = axis.x, y = axis.y, z = axis.z;
            const tx = t * x, ty = t * y;

            this.set(
                tx * x + c, tx * y - s * z, tx * z + s * y, 0.0,
                tx * y + s * z, ty * y + c, ty * z - s * x, 0.0,
                tx * z - s * y, ty * z + s * x, t * z * z + c, 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            return this;
        }

        public fromAxises(axisX: Readonly<IVector3>, axisY: Readonly<IVector3>, axisZ: Readonly<IVector3>) {
            this.set(
                axisX.x, axisY.x, axisZ.x, 0.0,
                axisX.y, axisY.y, axisZ.y, 0.0,
                axisX.z, axisY.z, axisZ.z, 0.0,
                0.0, 0.0, 0.0, 1.0
            );

            return this;
        }

        public fromRotationX(radian: number) {
            const c = Math.cos(radian), s = Math.sin(radian);
            this.set(
                1, 0, 0, 0,
                0, c, - s, 0,
                0, s, c, 0,
                0, 0, 0, 1
            );

            return this;
        }

        public fromRotationY(radian: number) {
            const c = Math.cos(radian), s = Math.sin(radian);
            this.set(
                c, 0, s, 0,
                0, 1, 0, 0,
                - s, 0, c, 0,
                0, 0, 0, 1
            );

            return this;
        }

        public fromRotationZ(radian: number) {
            const c = Math.cos(radian), s = Math.sin(radian);
            this.set(
                c, - s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

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

        public compose(translation: Readonly<IVector3>, rotation: Readonly<IVector4>, scale: Readonly<IVector3>) {
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
                if (det < 0.0) sx = -sx;

                if (rotation) {
                    // scale the rotation part
                    _helpMatrix.copy(this);

                    const invSX = 1.0 / sx;
                    const invSY = 1.0 / sy;
                    const invSZ = 1.0 / sz;

                    _helpMatrix.rawData[0] *= invSX;
                    _helpMatrix.rawData[1] *= invSX;
                    _helpMatrix.rawData[2] *= invSX;

                    _helpMatrix.rawData[4] *= invSY;
                    _helpMatrix.rawData[5] *= invSY;
                    _helpMatrix.rawData[6] *= invSY;

                    _helpMatrix.rawData[8] *= invSZ;
                    _helpMatrix.rawData[9] *= invSZ;
                    _helpMatrix.rawData[10] *= invSZ;

                    rotation.fromMatrix(_helpMatrix);
                }

                if (scale) {
                    scale.x = sx;
                    scale.y = sy;
                    scale.z = sz;
                }
            }

            return this;
        }

        public transpose(source?: Readonly<Matrix4>) {
            if (!source) {
                source = this;
            }

            const valueRawData = source.rawData;
            const rawData = this.rawData;
            let temp = 0.0;

            temp = valueRawData[1]; rawData[1] = valueRawData[4]; rawData[4] = temp;
            temp = valueRawData[2]; rawData[2] = valueRawData[8]; rawData[8] = temp;
            temp = valueRawData[6]; rawData[6] = valueRawData[9]; rawData[9] = temp;

            temp = valueRawData[3]; rawData[3] = valueRawData[12]; rawData[12] = temp;
            temp = valueRawData[7]; rawData[7] = valueRawData[13]; rawData[13] = temp;
            temp = valueRawData[11]; rawData[11] = valueRawData[14]; rawData[14] = temp;

            return this;
        }

        public inverse(source?: Readonly<Matrix4>) {
            if (!source) {
                source = this;
            }

            const valueRawData = source.rawData;
            const rawData = this.rawData;
            const n11 = valueRawData[0], n21 = valueRawData[1], n31 = valueRawData[2], n41 = valueRawData[3],
                n12 = valueRawData[4], n22 = valueRawData[5], n32 = valueRawData[6], n42 = valueRawData[7],
                n13 = valueRawData[8], n23 = valueRawData[9], n33 = valueRawData[10], n43 = valueRawData[11],
                n14 = valueRawData[12], n24 = valueRawData[13], n34 = valueRawData[14], n44 = valueRawData[15],

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

        public multiplyScalar(value: number, source?: Readonly<Matrix4>) {
            if (!source) {
                source = this;
            }

            const sourceRawData = source.rawData;
            const rawData = this.rawData;

            rawData[0] = sourceRawData[0] * value;
            rawData[1] = sourceRawData[1] * value;
            rawData[2] = sourceRawData[2] * value;
            rawData[3] = sourceRawData[3] * value;

            rawData[4] = sourceRawData[4] * value;
            rawData[5] = sourceRawData[5] * value;
            rawData[6] = sourceRawData[6] * value;
            rawData[7] = sourceRawData[7] * value;

            rawData[8] = sourceRawData[8] * value;
            rawData[9] = sourceRawData[9] * value;
            rawData[10] = sourceRawData[10] * value;
            rawData[11] = sourceRawData[11] * value;

            rawData[12] = sourceRawData[12] * value;
            rawData[13] = sourceRawData[13] * value;
            rawData[14] = sourceRawData[14] * value;
            rawData[15] = sourceRawData[15] * value;
        }

        public multiply(valueA: Matrix4 | Float32Array, valueB?: Matrix4 | Float32Array, offsetA: number = 0, offsetB: number = 0) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            const rawDataA = ArrayBuffer.isView(valueA) ? valueA : valueA.rawData;
            const rawDataB = ArrayBuffer.isView(valueB) ? valueB : valueB.rawData;
            const rawData = this.rawData;

            // const a11 = rawDataA[0], a12 = rawDataA[4], a13 = rawDataA[8], a14 = rawDataA[12];
            // const a21 = rawDataA[1], a22 = rawDataA[5], a23 = rawDataA[9], a24 = rawDataA[13];
            // const a31 = rawDataA[2], a32 = rawDataA[6], a33 = rawDataA[10], a34 = rawDataA[14];
            // const a41 = rawDataA[3], a42 = rawDataA[7], a43 = rawDataA[11], a44 = rawDataA[15];

            // const b11 = rawDataB[0], b12 = rawDataB[4], b13 = rawDataB[8], b14 = rawDataB[12];
            // const b21 = rawDataB[1], b22 = rawDataB[5], b23 = rawDataB[9], b24 = rawDataB[13];
            // const b31 = rawDataB[2], b32 = rawDataB[6], b33 = rawDataB[10], b34 = rawDataB[14];
            // const b41 = rawDataB[3], b42 = rawDataB[7], b43 = rawDataB[11], b44 = rawDataB[15];

            const a11 = rawDataA[offsetA++], a21 = rawDataA[offsetA++], a31 = rawDataA[offsetA++], a41 = rawDataA[offsetA++];
            const a12 = rawDataA[offsetA++], a22 = rawDataA[offsetA++], a32 = rawDataA[offsetA++], a42 = rawDataA[offsetA++];
            const a13 = rawDataA[offsetA++], a23 = rawDataA[offsetA++], a33 = rawDataA[offsetA++], a43 = rawDataA[offsetA++];
            const a14 = rawDataA[offsetA++], a24 = rawDataA[offsetA++], a34 = rawDataA[offsetA++], a44 = rawDataA[offsetA++];

            const b11 = rawDataB[offsetB++], b21 = rawDataB[offsetB++], b31 = rawDataB[offsetB++], b41 = rawDataB[offsetB++];
            const b12 = rawDataB[offsetB++], b22 = rawDataB[offsetB++], b32 = rawDataB[offsetB++], b42 = rawDataB[offsetB++];
            const b13 = rawDataB[offsetB++], b23 = rawDataB[offsetB++], b33 = rawDataB[offsetB++], b43 = rawDataB[offsetB++];
            const b14 = rawDataB[offsetB++], b24 = rawDataB[offsetB++], b34 = rawDataB[offsetB++], b44 = rawDataB[offsetB++];

            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            rawData[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            rawData[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            rawData[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            rawData[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            rawData[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            rawData[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            rawData[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            rawData[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            rawData[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            rawData[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;
        }

        public premultiply(value: Readonly<Matrix4>) {
            return this.multiply(value, this);
        }

        public lerp(t: number, value: Matrix4, source?: Matrix4) {
            if (!source) {
                source = this;
            }

            const p = 1.0 - t;
            for (let i = 0; i < 16; i++) {
                this.rawData[i] = source.rawData[i] * p + value.rawData[i] * t;
            }

            return this;
        }
        /**
         * - 两点位置不重合。
         * @param eye 
         * @param target 
         * @param up 
         */
        public lookAt(eye: Readonly<IVector3>, target: Readonly<IVector3>, up: Readonly<IVector3>) {
            const z = _helpVector3C.subtract(target, eye).normalize();//right handle
            const x = _helpVector3A.cross(up, z).normalize();
            const y = _helpVector3B.cross(z, x);
            const rawData = this.rawData;

            rawData[0] = x.x; rawData[4] = y.x; rawData[8] = z.x;
            rawData[1] = x.y; rawData[5] = y.y; rawData[9] = z.y;
            rawData[2] = x.z; rawData[6] = y.z; rawData[10] = z.z;

            return this;
        }

        public getMaxScaleOnAxis() {
            const rawData = this.rawData;

            const scaleXSq = rawData[0] * rawData[0] + rawData[1] * rawData[1] + rawData[2] * rawData[2];
            const scaleYSq = rawData[4] * rawData[4] + rawData[5] * rawData[5] + rawData[6] * rawData[6];
            const scaleZSq = rawData[8] * rawData[8] + rawData[9] * rawData[9] + rawData[10] * rawData[10];

            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
        }

        public toArray(value?: number[] | Float32Array, offset: number = 0) {
            if (!value) {
                value = [];
            }

            for (let i = 0; i < 16; ++i) {
                value[i + offset] = this.rawData[i];
            }

            return value;
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
        public add(left: Matrix4, right?: Matrix4) { // TODO
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
        public static perspectiveProjectLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix4): Matrix4 {
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
        public static orthoProjectLH(width: number, height: number, znear: number, zfar: number, out: Matrix4): Matrix4 {
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

    const _helpVector3A = Vector3.create();
    const _helpVector3B = Vector3.create();
    const _helpVector3C = Vector3.create();
    const _helpMatrix = Matrix4.create();

    export const helpMatrixA = Matrix4.create();
    export const helpMatrixB = Matrix4.create();
    export const helpMatrixC = Matrix4.create();
    export const helpMatrixD = Matrix4.create();
}