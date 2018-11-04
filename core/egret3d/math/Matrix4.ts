namespace egret3d {
    const _array = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    /**
     * 4x4 矩阵。
     */
    export class Matrix4 extends paper.BaseRelease<Matrix4> implements paper.ICCS<Matrix4>, paper.ISerializable {
        /**
         * 一个静态的恒等矩阵。
         * - 请注意不要修改该值。
         */
        public static readonly IDENTITY: Readonly<Matrix4> = new Matrix4();

        private static readonly _instances: Matrix4[] = [];
        /**
         * 创建一个矩阵。
         * @param rawData 
         * @param offsetOrByteOffset 
         */
        public static create(rawData?: Readonly<ArrayLike<number>> | ArrayBuffer, offsetOrByteOffset: number = 0): Matrix4 {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;

                if (rawData) {
                    if (rawData instanceof ArrayBuffer) {
                        instance.fromBuffer(rawData, offsetOrByteOffset);
                    }
                    else {
                        instance.fromArray(rawData, offsetOrByteOffset);
                    }
                }
                else {
                    instance.identity();
                }

                return instance;
            }

            return new Matrix4(rawData, offsetOrByteOffset);
        }
        /**
         * 矩阵原始数据。
         * @readonly
         */
        public rawData: Float32Array = null!;
        /**
         * 请使用 `egret3d.Matrix4.create()` 创建实例。
         * @see egret3d.Matrix4.create()
         * @deprecated
         */
        public constructor(rawData?: Readonly<ArrayLike<number>> | ArrayBuffer, offsetOrByteOffset: number = 0) {
            super();

            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(16);
                this.fromArray(rawData as Readonly<ArrayLike<number>> || _array);
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
            return this.fromArray(value.rawData);
        }

        public clone() {
            return Matrix4.create(this.rawData);
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
        /**
         * 将该矩阵转换为恒等矩阵。
         */
        public identity(): this {
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

        public fromArray(array: Readonly<ArrayLike<number>>, offset: number = 0): this {
            for (let i = 0; i < 16; ++i) {
                this.rawData[i] = array[i + offset];
            }

            return this;
        }

        public fromBuffer(buffer: ArrayBuffer, byteOffset: number = 0): this {
            this.rawData = new Float32Array(buffer, byteOffset, 16);

            return this;
        }
        /**
         * 通过平移向量设置该矩阵。
         * @param translate 平移向量。
         * @param rotationAndScaleStays 是否保留该矩阵的旋转和数据。
         */
        public fromTranslate(translate: Readonly<IVector3>, rotationAndScaleStays: boolean = false): this {
            if (!rotationAndScaleStays) {
                this.identity();
            }

            this.rawData[12] = translate.x;
            this.rawData[13] = translate.y;
            this.rawData[14] = translate.z;

            return this;
        }
        /**
         * 通过四元数旋转设置该矩阵。
         * @param rotation 四元数旋转。
         * @param translateStays 是否保留该矩阵的平移数据。
         */
        public fromRotation(rotation: Readonly<Quaternion>, translateStays: boolean = false): this {
            return this.compose(translateStays ? _helpVector3A.fromArray(this.rawData, 12) : Vector3.ZERO, rotation, Vector3.ONE);
        }
        /**
         * 通过欧拉旋转设置该矩阵。
         * @param euler 欧拉旋转。
         * @param order 欧拉旋转顺序。
         * @param translateStays 是否保留该矩阵的平移数据。
         */
        public fromEuler(euler: Readonly<IVector3>, order: EulerOrder = EulerOrder.YXZ, translateStays: boolean = false): this {
            // http://www.mathworks.com/matlabcentral/fileexchange/
            // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
            //	content/SpinCalc.m

            const cos = Math.cos;
            const sin = Math.sin;

            const { x, y, z } = euler;
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
                    const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

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
        /**
         * 通过缩放向量设置该矩阵。
         * @param scale 缩放向量。
         * @param translateStays 是否保留该矩阵的平移数据。
         */
        public fromScale(scale: Readonly<IVector3>, translateStays: boolean = false): this {
            if (translateStays) {
                _helpVector3A.fromArray(this.rawData, 12);
            }

            this.identity();

            this.rawData[0] = scale.x;
            this.rawData[5] = scale.y;
            this.rawData[10] = scale.z;

            if (translateStays) {
                this.rawData[12] = _helpVector3A.x;
                this.rawData[13] = _helpVector3A.y;
                this.rawData[14] = _helpVector3A.z;
            }

            return this;
        }
        /**
         * 通过绕 X 轴的旋转角度设置该矩阵。
         * @param angle 旋转角。（弧度制）
         */
        public fromRotationX(angle: number): this {
            const c = Math.cos(angle), s = Math.sin(angle);
            return this.set(
                1, 0, 0, 0,
                0, c, - s, 0,
                0, s, c, 0,
                0, 0, 0, 1
            );
        }
        /**
         * 通过绕 Y 轴的旋转角度设置该矩阵。
         * @param theta 旋转角。（弧度制）
         */
        public fromRotationY(theta: number): this {
            const c = Math.cos(theta), s = Math.sin(theta);
            return this.set(
                c, 0, s, 0,
                0, 1, 0, 0,
                - s, 0, c, 0,
                0, 0, 0, 1
            );
        }
        /**
         * 通过绕 Z 轴的旋转角度设置该矩阵。
         * @param theta 旋转角。（弧度制）
         */
        public fromRotationZ(theta: number): this {
            const c = Math.cos(theta), s = Math.sin(theta);
            return this.set(
                c, - s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
        }
        /**
         * 通过旋转轴设置该矩阵。
         * - 假设旋转轴已被归一化。
         * @param axis 旋转轴。
         * @param angle 旋转角。（弧度制）
         */
        public fromAxis(axis: Readonly<IVector3>, angle: number): this {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            const t = 1.0 - c;
            const x = axis.x, y = axis.y, z = axis.z;
            const tx = t * x, ty = t * y;

            return this.set(
                tx * x + c, tx * y - s * z, tx * z + s * y, 0.0,
                tx * y + s * z, ty * y + c, ty * z - s * x, 0.0,
                tx * z - s * y, ty * z + s * x, t * z * z + c, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }
        /**
         * 通过 X、Y、Z 轴设置该矩阵。
         * @param axisX X 轴。
         * @param axisY Y 轴。
         * @param axisZ Z 轴。
         */
        public fromAxises(axisX: Readonly<IVector3>, axisY: Readonly<IVector3>, axisZ: Readonly<IVector3>): this {
            return this.set(
                axisX.x, axisY.x, axisZ.x, 0.0,
                axisX.y, axisY.y, axisZ.y, 0.0,
                axisX.z, axisY.z, axisZ.z, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }
        /**
         * 通过平移向量、四元数旋转、缩放向量设置该矩阵。
         * @param translation 平移向量。
         * @param rotation 四元数旋转。
         * @param scale 缩放向量。
         */
        public compose(translation: Readonly<IVector3>, rotation: Readonly<IVector4>, scale: Readonly<IVector3>): this {
            const rX = rotation.x, rY = rotation.y, rZ = rotation.z, rW = rotation.w;
            const sX = scale.x, sY = scale.y, sZ = scale.z;
            const x2 = rX + rX, y2 = rY + rY, z2 = rZ + rZ;
            const xx = rX * x2, xy = rX * y2, xz = rX * z2;
            const yy = rY * y2, yz = rY * z2, zz = rZ * z2;
            const wx = rW * x2, wy = rW * y2, wz = rW * z2;
            const rawData = this.rawData;

            rawData[0] = (1.0 - (yy + zz)) * sX;
            rawData[1] = (xy + wz) * sX;
            rawData[2] = (xz - wy) * sX;

            rawData[4] = (xy - wz) * sY;
            rawData[5] = (1.0 - (xx + zz)) * sY;
            rawData[6] = (yz + wx) * sY;

            rawData[8] = (xz + wy) * sZ;
            rawData[9] = (yz - wx) * sZ;
            rawData[10] = (1.0 - (xx + yy)) * sZ;

            rawData[12] = translation.x;
            rawData[13] = translation.y;
            rawData[14] = translation.z;

            rawData[3] = rawData[7] = rawData[11] = 0.0, rawData[15] = 1.0;

            return this;
        }
        /**
         * 将该矩阵分解为平移向量、四元数旋转、缩放向量。
         * @param translation 平移向量。
         * @param rotation 四元数旋转。
         * @param scale 缩放向量。
         */
        public decompose(translation: Vector3 | null = null, rotation: Quaternion | null = null, scale: Vector3 | null = null): this {
            const rawData = this.rawData;

            if (translation) {
                translation.x = rawData[12];
                translation.y = rawData[13];
                translation.z = rawData[14];
            }

            if (rotation || scale) {
                const helpVector3A = _helpVector3A;
                let sx = helpVector3A.set(rawData[0], rawData[1], rawData[2]).length;
                let sy = helpVector3A.set(rawData[4], rawData[5], rawData[6]).length;
                let sz = helpVector3A.set(rawData[8], rawData[9], rawData[10]).length;

                // if determine is negative, we need to invert one scale
                const det = this.determinant;
                if (det < 0.0) sx = -sx;

                if (rotation) {
                    // scale the rotation part
                    const helpMatrix = _helpMatrix;
                    helpMatrix.copy(this);

                    const invSX = 1.0 / sx;
                    const invSY = 1.0 / sy;
                    const invSZ = 1.0 / sz;

                    helpMatrix.rawData[0] *= invSX;
                    helpMatrix.rawData[1] *= invSX;
                    helpMatrix.rawData[2] *= invSX;

                    helpMatrix.rawData[4] *= invSY;
                    helpMatrix.rawData[5] *= invSY;
                    helpMatrix.rawData[6] *= invSY;

                    helpMatrix.rawData[8] *= invSZ;
                    helpMatrix.rawData[9] *= invSZ;
                    helpMatrix.rawData[10] *= invSZ;

                    rotation.fromMatrix(helpMatrix);
                }

                if (scale) {
                    scale.x = sx;
                    scale.y = sy;
                    scale.z = sz;
                }
            }

            return this;
        }
        /**
         * 转置该矩阵。
         */
        public transpose(): this;
        /**
         * 将输入矩阵转置的结果写入该矩阵。
         * @param input 输入矩阵。
         */
        public transpose(input: Readonly<Matrix4>): this;
        public transpose(input?: Readonly<Matrix4>) {
            if (!input) {
                input = this;
            }

            const inputRawData = input.rawData;
            const rawData = this.rawData;
            let temp = 0.0;

            temp = inputRawData[1]; rawData[1] = inputRawData[4]; rawData[4] = temp;
            temp = inputRawData[2]; rawData[2] = inputRawData[8]; rawData[8] = temp;
            temp = inputRawData[6]; rawData[6] = inputRawData[9]; rawData[9] = temp;

            temp = inputRawData[3]; rawData[3] = inputRawData[12]; rawData[12] = temp;
            temp = inputRawData[7]; rawData[7] = inputRawData[13]; rawData[13] = temp;
            temp = inputRawData[11]; rawData[11] = inputRawData[14]; rawData[14] = temp;

            return this;
        }
        /**
         * 将该矩阵求逆。
         */
        public inverse(): this;
        /**
         * 将输入矩阵的逆矩阵写入该矩阵。
         * @param input 输入矩阵。
         */
        public inverse(input: Readonly<Matrix4>): this;
        public inverse(input?: Readonly<Matrix4>) {
            if (!input) {
                input = this;
            }

            const valueRawData = input.rawData;
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
        /**
         * 将该矩阵乘以一个标量。
         * - v *= scaler
         * @param scalar 标量。
         */
        public multiplyScalar(scalar: number): this;
        /**
         * 将输入矩阵与一个标量相乘的结果写入该矩阵。
         * - v = input * scaler
         * @param scalar 标量。
         * @param input 收入矩阵。
         */
        public multiplyScalar(scalar: number, input: Readonly<Matrix4>): this;
        public multiplyScalar(scalar: number, input?: Readonly<Matrix4>) {
            if (!input) {
                input = this;
            }

            const sourceRawData = input.rawData;
            const rawData = this.rawData;

            rawData[0] = sourceRawData[0] * scalar;
            rawData[1] = sourceRawData[1] * scalar;
            rawData[2] = sourceRawData[2] * scalar;
            rawData[3] = sourceRawData[3] * scalar;

            rawData[4] = sourceRawData[4] * scalar;
            rawData[5] = sourceRawData[5] * scalar;
            rawData[6] = sourceRawData[6] * scalar;
            rawData[7] = sourceRawData[7] * scalar;

            rawData[8] = sourceRawData[8] * scalar;
            rawData[9] = sourceRawData[9] * scalar;
            rawData[10] = sourceRawData[10] * scalar;
            rawData[11] = sourceRawData[11] * scalar;

            rawData[12] = sourceRawData[12] * scalar;
            rawData[13] = sourceRawData[13] * scalar;
            rawData[14] = sourceRawData[14] * scalar;
            rawData[15] = sourceRawData[15] * scalar;

            return this;
        }
        /**
         * 将该矩阵乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        public multiply(matrix: Readonly<Matrix4>): this;
        /**
         * 将两个矩阵相乘的结果写入该矩阵。
         * - v = matrixA * matrixB
         * @param matrixA 一个矩阵。
         * @param matrixB 另一个矩阵。
         */
        public multiply(matrixA: Readonly<Matrix4>, matrixB: Readonly<Matrix4>): this;
        public multiply(matrixA: Readonly<Matrix4>, matrixB?: Readonly<Matrix4>) {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }

            const rawDataA = matrixA.rawData;
            const rawDataB = matrixB.rawData;
            const rawData = this.rawData;

            const a11 = rawDataA[0], a12 = rawDataA[4], a13 = rawDataA[8], a14 = rawDataA[12];
            const a21 = rawDataA[1], a22 = rawDataA[5], a23 = rawDataA[9], a24 = rawDataA[13];
            const a31 = rawDataA[2], a32 = rawDataA[6], a33 = rawDataA[10], a34 = rawDataA[14];
            const a41 = rawDataA[3], a42 = rawDataA[7], a43 = rawDataA[11], a44 = rawDataA[15];

            const b11 = rawDataB[0], b12 = rawDataB[4], b13 = rawDataB[8], b14 = rawDataB[12];
            const b21 = rawDataB[1], b22 = rawDataB[5], b23 = rawDataB[9], b24 = rawDataB[13];
            const b31 = rawDataB[2], b32 = rawDataB[6], b33 = rawDataB[10], b34 = rawDataB[14];
            const b41 = rawDataB[3], b42 = rawDataB[7], b43 = rawDataB[11], b44 = rawDataB[15];

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
        /**
         * 将一个矩阵与该矩阵相乘的结果写入该矩阵。
         * - v = matrix * v
         * @param matrix 一个矩阵。
         */
        public premultiply(matrix: Readonly<Matrix4>): this {
            return this.multiply(matrix, this);
        }
        /**
         * 将该矩阵和目标矩阵插值的结果写入该矩阵。
         * - v = v * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param to 目标矩阵。
         */
        public lerp(t: number, to: Readonly<Matrix4>): this;
        /**
         * 将两个矩阵插值的结果写入该矩阵。
         * - v = from * (1 - t) + to * t
         * - 插值因子不会被限制在 0 ~ 1。
         * @param t 插值因子。
         * @param from 起始矩阵。
         * @param to 目标矩阵。
         */
        public lerp(t: number, from: Readonly<Matrix4>, to: Readonly<Matrix4>): this;
        public lerp(t: number, from: Readonly<Matrix4>, to?: Readonly<Matrix4>) {
            if (!to) {
                to = from;
                from = this;
            }

            if (t === 0.0) {
                for (let i = 0; i < 16; i++) {
                    this.rawData[i] = from.rawData[i];
                }

                return this;
            }
            else if (t === 1.0) {
                for (let i = 0; i < 16; i++) {
                    this.rawData[i] = to.rawData[i];
                }

                return this;
            }

            const p = 1.0 - t;
            for (let i = 0; i < 16; i++) {
                this.rawData[i] = from.rawData[i] * p + to.rawData[i] * t;
            }

            return this;
        }
        /**
         * 设置该矩阵，使其 Z 轴正方向与起始点到目标点的方向相一致。
         * - 矩阵的缩放值将被覆盖。
         * @param from 起始点。
         * @param to 目标点。
         * @param up 
         */
        public lookAt(from: Readonly<IVector3>, to: Readonly<IVector3>, up: Readonly<IVector3>): this {
            this.lookRotation(_helpVector3C.subtract(to, from), up);

            return this;
        }
        /**
         * 设置该矩阵，使其 Z 轴正方向与目标方向相一致。
         * - 矩阵的缩放值将被覆盖。
         * @param vector 目标方向。
         * @param up 
         */
        public lookRotation(vector: Readonly<IVector3>, up: Readonly<IVector3>): this {
            const z = _helpVector3C.normalize(vector);
            const x = _helpVector3A.cross(up, z).normalize(_helpVector3A, Vector3.RIGHT);
            const y = _helpVector3B.cross(z, x);
            const rawData = this.rawData;

            rawData[0] = x.x; rawData[4] = y.x; rawData[8] = z.x;
            rawData[1] = x.y; rawData[5] = y.y; rawData[9] = z.y;
            rawData[2] = x.z; rawData[6] = y.z; rawData[10] = z.z;

            return this;
        }
        /**
         * 将该旋转矩阵转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public toArray(array?: number[] | Float32Array, offset: number = 0): number[] | Float32Array {
            if (!array) {
                array = [];
            }

            for (let i = 0; i < 16; ++i) {
                array[i + offset] = this.rawData[i];
            }

            return array;
        }
        /**
         * 将该旋转矩阵转换为欧拉旋转。
         * @param euler 欧拉旋转。（弧度制）
         * @param order 欧拉旋转顺序。
         */
        public toEuler(euler?: Vector3, order: EulerOrder = EulerOrder.YXZ): Vector3 {
            if (!euler) {
                euler = Vector3.create();
            }
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            const rawData = this.rawData;
            const m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            const m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            const m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];

            switch (order) {
                case EulerOrder.XYZ: {
                    euler.y = Math.asin(floatClamp(m13, -1.0, 1.0));

                    if (Math.abs(m13) < 0.999999) {
                        euler.x = Math.atan2(-m23, m33);
                        euler.z = Math.atan2(-m12, m11);
                    }
                    else {
                        euler.x = Math.atan2(m32, m22);
                        euler.z = 0.0;
                    }
                    break;
                }

                case EulerOrder.XZY: {
                    euler.z = Math.asin(-floatClamp(m12, -1.0, 1.0));

                    if (Math.abs(m12) < 0.999999) {
                        euler.x = Math.atan2(m32, m22);
                        euler.y = Math.atan2(m13, m11);
                    }
                    else {
                        euler.x = Math.atan2(-m23, m33);
                        euler.y = 0.0;
                    }
                    break;
                }

                case EulerOrder.YXZ: {
                    euler.x = Math.asin(-floatClamp(m23, -1.0, 1.0));

                    if (Math.abs(m23) < 0.999999) {
                        euler.y = Math.atan2(m13, m33);
                        euler.z = Math.atan2(m21, m22);
                    }
                    else {
                        euler.y = Math.atan2(-m31, m11);
                        euler.z = 0.0;
                    }
                    break;
                }

                case EulerOrder.YZX: {
                    euler.z = Math.asin(floatClamp(m21, -1.0, 1.0));

                    if (Math.abs(m21) < 0.999999) {
                        euler.x = Math.atan2(-m23, m22);
                        euler.y = Math.atan2(-m31, m11);
                    }
                    else {
                        euler.x = 0.0;
                        euler.y = Math.atan2(m13, m33);
                    }
                    break;
                }

                case EulerOrder.ZXY: {
                    euler.x = Math.asin(floatClamp(m32, -1.0, 1.0));

                    if (Math.abs(m32) < 0.999999) {
                        euler.y = Math.atan2(- m31, m33);
                        euler.z = Math.atan2(- m12, m22);
                    }
                    else {
                        euler.y = 0.0;
                        euler.z = Math.atan2(m21, m11);
                    }
                    break;
                }

                case EulerOrder.ZYX: {
                    euler.y = Math.asin(-floatClamp(m31, -1.0, 1.0));

                    if (Math.abs(m31) < 0.999999) {
                        euler.x = Math.atan2(m32, m33);
                        euler.z = Math.atan2(m21, m11);
                    }
                    else {
                        euler.x = 0.0;
                        euler.z = Math.atan2(- m12, m22);
                    }
                    break;
                }
            }

            return euler;
        }
        /**
         * 获取该矩阵的行列式。
         * - 该值是实时计算的。
         */
        public get determinant(): number {
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
        /**
         * 获取该矩阵的最大缩放值。
         * - 该值是实时计算的。
         */
        public get maxScaleOnAxis(): number {
            const rawData = this.rawData;
            const scaleXSq = rawData[0] * rawData[0] + rawData[1] * rawData[1] + rawData[2] * rawData[2];
            const scaleYSq = rawData[4] * rawData[4] + rawData[5] * rawData[5] + rawData[6] * rawData[6];
            const scaleZSq = rawData[8] * rawData[8] + rawData[9] * rawData[9] + rawData[10] * rawData[10];

            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
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
        public static perspectiveProjectLH(left: number, right: number, top: number, bottom: number, near: number, far: number, out: Matrix4): Matrix4 {
            const x = 2 * near / (right - left);
            const y = 2 * near / (top - bottom);
            out.rawData[0] = x;
            out.rawData[1] = out.rawData[2] = out.rawData[3] = 0.0;

            out.rawData[4] = out.rawData[6] = out.rawData[7] = 0.0;
            out.rawData[5] = y;

            out.rawData[8] = out.rawData[9] = 0.0;
            out.rawData[10] = (far + near) / (far - near);
            out.rawData[11] = 1.0;

            out.rawData[12] = out.rawData[13] = out.rawData[15] = 0.0;
            out.rawData[14] = -2 * (near * far) / (far - near);

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

    /**
     * @internal
     */
    export const helpMatrixA = Matrix4.create();
    /**
     * @internal
     */
    export const helpMatrixB = Matrix4.create();
    /**
     * @internal
     */
    export const helpMatrixC = Matrix4.create();
    /**
     * @internal
     */
    export const helpMatrixD = Matrix4.create();
}