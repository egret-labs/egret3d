namespace egret3d {
    export class Matrix3 extends paper.BaseRelease<Matrix3> implements paper.ICCS<Matrix3>, paper.ISerializable {
        private static readonly _instances: Matrix3[] = [];

        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new Matrix3();
        }

        /**
         * @readonly
         */
        public rawData: Float32Array = null!;
        /**
         * @deprecated
         */
        public constructor(rawData: Float32Array | null = null) {
            super();

            if (rawData) {
                this.rawData = rawData;
            }
            else {
                this.rawData = new Float32Array(
                    [
                        1.0, 0.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 0.0, 1.0,
                    ]
                );
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
        ) {
            this.rawData[0] = n11;
            this.rawData[3] = n12;
            this.rawData[6] = n13;

            this.rawData[1] = n21;
            this.rawData[4] = n22;
            this.rawData[7] = n23;

            this.rawData[2] = n31;
            this.rawData[5] = n32;
            this.rawData[8] = n33;

            return this;
        }

        public identity() {
            this.set(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );

            return this;
        }

        public inverse(matrix: Matrix3) {
            var me = matrix.rawData,
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

            var detInv = 1 / det;

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
            return this.setFromMatrix4(matrix4).inverse(this).transpose();
        }

        public transpose() {

            var tmp, m = this.rawData;

            tmp = m[1]; m[1] = m[3]; m[3] = tmp;
            tmp = m[2]; m[2] = m[6]; m[6] = tmp;
            tmp = m[5]; m[5] = m[7]; m[7] = tmp;

            return this;
        }

        public setFromMatrix4(m: Readonly<Matrix4>) {

            var me = m.rawData;
            this.set(
                me[0], me[4], me[8],
                me[1], me[5], me[9],
                me[2], me[6], me[10]
            );
            // this.set(
            //     me[0], me[1], me[2],
            //     me[4], me[5], me[6],
            //     me[8], me[9], me[10]
            // );

            return this;
        }

        public determinant(): number {
            var te = this.rawData;

            var a = te[0], b = te[1], c = te[2],
                d = te[3], e = te[4], f = te[5],
                g = te[6], h = te[7], i = te[8];

            return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            for (let i = 0; i < 9; ++i) {
                this.rawData[i] = value[i + offset];
            }

            return this;
        }

        public fromBuffer(value: ArrayBuffer, byteOffset: number = 0) {
            this.rawData = new Float32Array(value, byteOffset, 9);

            return this;
        }
    }

    let helpMat_1: Matrix3 = new Matrix3();
}