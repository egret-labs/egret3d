namespace egret3d {

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
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.identity();
                instance._released = false;
                return instance;
            }

            return new Matrix3();
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
        private constructor() {
            super();

            // if (rawData) {
            //     this.rawData = rawData;
            // }
            // else {
            // TODO
            this.rawData = new Float32Array([
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0,
            ]);
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
            this.rawData[0] = n11; this.rawData[1] = n21; this.rawData[2] = n31;
            this.rawData[3] = n12; this.rawData[4] = n22; this.rawData[5] = n32;
            this.rawData[6] = n13; this.rawData[7] = n23; this.rawData[8] = n33;

            return this;
        }

        public identity() {
            this.rawData[0] = 1.0; this.rawData[1] = 0.0; this.rawData[2] = 0.0;
            this.rawData[3] = 0.0; this.rawData[4] = 1.0; this.rawData[5] = 0.0;
            this.rawData[6] = 0.0; this.rawData[7] = 0.0; this.rawData[8] = 1.0;

            return this;
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

        /**
         * 通过 UV 变换设置该矩阵。
         * @param tx 水平偏移。
         * @param ty 垂直偏移。
         * @param sx 水平重复。
         * @param sy 垂直重复。
         * @param rotation 旋转。（弧度制）
         * @param cx 水平中心。
         * @param cy 垂直中心。
         */
        public fromUVTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number) {
            const c = Math.cos(rotation);
            const s = Math.sin(rotation);

            return this.set(
                sx * c, sx * s, - sx * (c * cx + s * cy) + cx + tx,
                - sy * s, sy * c, - sy * (- s * cx + c * cy) + cy + ty,
                0.0, 0.0, 1.0
            );
        }

        public inverse(matrix: Matrix3) {
            const me = matrix.rawData,
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
            return this.fromMatrix4(matrix4).inverse(this).transpose();
        }

        public transpose() {
            let temp = 0.0;
            const rawData = this.rawData;

            temp = rawData[1]; rawData[1] = rawData[3]; rawData[3] = temp;
            temp = rawData[2]; rawData[2] = rawData[6]; rawData[6] = temp;
            temp = rawData[5]; rawData[5] = rawData[7]; rawData[7] = temp;

            return this;
        }

        public fromMatrix4(value: Readonly<Matrix4>) {
            const rawData = value.rawData;
            this.set(
                rawData[0], rawData[4], rawData[8],
                rawData[1], rawData[5], rawData[9],
                rawData[2], rawData[6], rawData[10]
            );
            // this.set(
            //     me[0], me[1], me[2],
            //     me[4], me[5], me[6],
            //     me[8], me[9], me[10]
            // );

            return this;
        }

        public determinant() {
            const rawData = this.rawData;
            const a = rawData[0], b = rawData[1], c = rawData[2],
                d = rawData[3], e = rawData[4], f = rawData[5],
                g = rawData[6], h = rawData[7], i = rawData[8];

            return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
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
    }
}