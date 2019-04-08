namespace egret3d {
    const _mat3Array = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ];
    /**
     * 3×3 矩阵。
     */
    export class Matrix3 extends paper.BaseRelease<Matrix3> implements paper.ICCS<Matrix3>, paper.ISerializable {

        public static readonly IDENTITY: Readonly<Matrix3> = new Matrix3();

        private static readonly _instances: Matrix3[] = [];

        /**
         * 创建一个矩阵。
         * @param rawData 
         * @param offsetOrByteOffset 
         */
        public static create(rawData?: ArrayLike<number>, offsetOrByteOffset: number = 0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.identity();
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

            return new Matrix3(rawData, offsetOrByteOffset);
        }

        /**
         * 矩阵原始数据。
         * @readonly
         */
        public rawData: Float32Array = null!;

        /**
         * 请使用 `egret3d.Matrix3.create()` 创建实例。
         * @see egret3d.Matrix3.create()
         */
        private constructor(rawData?: ArrayLike<number>, offsetOrByteOffset: number = 0) {
            super();

            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(9);
                this.fromArray(rawData || _mat3Array);
            }
            // TODO
            // this.rawData = new Float32Array([
            //     1.0, 0.0, 0.0,
            //     0.0, 1.0, 0.0,
            //     0.0, 0.0, 1.0,
            // ]);
            // }
        }

        public serialize() {
            return this.rawData;
        }

        public deserialize(value: Readonly<[
            number, number, number, number,
            number, number, number, number,
            number, number, number, number,
            number, number, number, number
        ]>): Matrix3 {
            return this.fromArray(value);
        }

        public copy(value: Readonly<Matrix3>) {
            this.fromArray(value.rawData);

            return this;
        }

        public clone() {
            const value = new Matrix3();
            value.copy(this);

            return value;
        }

        public set(
            n11: number, n12: number, n13: number,
            n21: number, n22: number, n23: number,
            n31: number, n32: number, n33: number,
        ): Matrix3 {
            const rawData = this.rawData;
            rawData[0] = n11; rawData[1] = n21; rawData[2] = n31;
            rawData[3] = n12; rawData[4] = n22; rawData[5] = n32;
            rawData[6] = n13; rawData[7] = n23; rawData[8] = n33;

            return this;
        }

        public identity() {
            const rawData = this.rawData;
            rawData[0] = 1.0; rawData[1] = 0.0; rawData[2] = 0.0;
            rawData[3] = 0.0; rawData[4] = 1.0; rawData[5] = 0.0;
            rawData[6] = 0.0; rawData[7] = 0.0; rawData[8] = 1.0;

            return this;
        }

        public fromArray(value: ArrayLike<number>, offset: number = 0) {
            for (let i = 0; i < 9; ++i) {
                this.rawData[i] = value[i + offset];
            }

            return this;
        }

        public fromBuffer(value: ArrayBuffer, byteOffset: number = 0) {
            this.rawData = new Float32Array(value, byteOffset, 9);

            return this;
        }

        public fromScale(vector: Readonly<IVector3>) {
            const rawData = this.rawData;
            rawData[0] = vector.x; rawData[1] = 0.0; rawData[2] = 0.0;
            rawData[3] = 0.0; rawData[4] = vector.y; rawData[5] = 0.0;
            rawData[6] = 0.0; rawData[7] = 0.0; rawData[8] = vector.z;

            return this;
        }

        /**
         * 通过 UV 变换设置该矩阵。
         * @param offsetX 水平偏移。
         * @param offsetY 垂直偏移。
         * @param repeatX 水平重复。
         * @param repeatY 垂直重复。
         * @param rotation 旋转。（弧度制）
         * @param pivotX 水平中心。
         * @param pivotY 垂直中心。
         */
        public fromUVTransform(offsetX: number, offsetY: number, repeatX: number, repeatY: number, rotation: number = 0.0, pivotX: number = 0.0, pivotY: number = 0.0) {
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);

            return this.set(
                repeatX * cos, repeatX * sin, - repeatX * (cos * pivotX + sin * pivotY) + pivotX + offsetX,
                - repeatY * sin, repeatY * cos, - repeatY * (- sin * pivotX + cos * pivotY) + pivotY + offsetY,
                0.0, 0.0, 1.0
            );
        }

        public fromMatrix4(value: Readonly<Matrix4>) {
            const rawData = value.rawData;
            this.set(
                rawData[0], rawData[4], rawData[8],
                rawData[1], rawData[5], rawData[9],
                rawData[2], rawData[6], rawData[10]
            );

            return this;
        }

        public inverse(input?: Matrix3) {
            if (!input) {
                input = this;
            }

            const me = input.rawData,
                te = this.rawData,

                n11 = me[0], n21 = me[1], n31 = me[2],
                n12 = me[3], n22 = me[4], n32 = me[5],
                n13 = me[6], n23 = me[7], n33 = me[8],

                t11 = n33 * n22 - n32 * n23,
                t12 = n32 * n13 - n33 * n12,
                t13 = n23 * n12 - n22 * n13,

                det = n11 * t11 + n21 * t12 + n31 * t13;

            if (det === 0) {
                // TODO
                // var msg = "can't invert matrix, determinant is 0";

                // console.warn(msg);


                return this.identity();

            }

            const detInv = 1 / det;

            te[0] = t11 * detInv;
            te[1] = (n31 * n23 - n33 * n21) * detInv;
            te[2] = (n32 * n21 - n31 * n22) * detInv;

            te[3] = t12 * detInv;
            te[4] = (n33 * n11 - n31 * n13) * detInv;
            te[5] = (n31 * n12 - n32 * n11) * detInv;

            te[6] = t13 * detInv;
            te[7] = (n21 * n13 - n23 * n11) * detInv;
            te[8] = (n22 * n11 - n21 * n12) * detInv;

            return this;
        }

        public getNormalMatrix(matrix4: Readonly<Matrix4>) {
            return this.fromMatrix4(matrix4).inverse().transpose();
        }

        public transpose() {
            let temp = 0.0;
            const rawData = this.rawData;

            temp = rawData[1]; rawData[1] = rawData[3]; rawData[3] = temp;
            temp = rawData[2]; rawData[2] = rawData[6]; rawData[6] = temp;
            temp = rawData[5]; rawData[5] = rawData[7]; rawData[7] = temp;

            return this;
        }
        /**
         * 将该矩阵乘以一个矩阵。
         * - v *= matrix
         * @param matrix 一个矩阵。
         */
        public multiply(matrix: Readonly<Matrix3>): this;
        /**
         * 将两个矩阵相乘的结果写入该矩阵。
         * - v = matrixA * matrixB
         * @param matrixA 一个矩阵。
         * @param matrixB 另一个矩阵。
         */
        public multiply(matrixA: Readonly<Matrix3>, matrixB: Readonly<Matrix3>): this;
        public multiply(matrixA: Readonly<Matrix3>, matrixB?: Readonly<Matrix3>) {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }

            const rawDataA = matrixA.rawData;
            const rawDataB = matrixB.rawData;
            const rawData = this.rawData;

            const a11 = rawDataA[0], a12 = rawDataA[3], a13 = rawDataA[6];
            const a21 = rawDataA[1], a22 = rawDataA[4], a23 = rawDataA[7];
            const a31 = rawDataA[2], a32 = rawDataA[5], a33 = rawDataA[8];

            const b11 = rawDataB[0], b12 = rawDataB[3], b13 = rawDataB[6];
            const b21 = rawDataB[1], b22 = rawDataB[4], b23 = rawDataB[7];
            const b31 = rawDataB[2], b32 = rawDataB[5], b33 = rawDataB[8];

            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31;
            rawData[3] = a11 * b12 + a12 * b22 + a13 * b32;
            rawData[6] = a11 * b13 + a12 * b23 + a13 * b33;

            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31;
            rawData[4] = a21 * b12 + a22 * b22 + a23 * b32;
            rawData[7] = a21 * b13 + a22 * b23 + a23 * b33;

            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31;
            rawData[5] = a31 * b12 + a32 * b22 + a33 * b32;
            rawData[8] = a31 * b13 + a32 * b23 + a33 * b33;

            return this;
        }
        /**
         * 将一个矩阵与该矩阵相乘的结果写入该矩阵。
         * - v = matrix * v
         * @param matrix 一个矩阵。
         */
        public premultiply(matrix: Readonly<Matrix3>): this {
            return this.multiply(matrix, this);
        }

        /**
         * 将该旋转矩阵转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public toArray(array?: number[] | Float32Array, offset: number = 0) {
            if (!array) {
                array = [];
            }

            for (let i = 0; i < 9; ++i) {
                array[i + offset] = this.rawData[i];
            }

            return array;
        }

        public get determinant() {
            const rawData = this.rawData;
            const a = rawData[0], b = rawData[1], c = rawData[2],
                d = rawData[3], e = rawData[4], f = rawData[5],
                g = rawData[6], h = rawData[7], i = rawData[8];

            return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
        }
    }
    /**
     * @interanl
     */
    export const helpMatrix3A = Matrix3.create();
    /**
     * @interanl
     */
    export const helpMatrix3B = Matrix3.create();
    /**
     * @interanl
     */
    export const helpMatrix3C = Matrix3.create();
    /**
     * @interanl
     */
    export const helpMatrix3D = Matrix3.create();
}