namespace egret3d {
    /**
     * 
     */
    export interface IVector4 extends IVector3 {
        w: number;
    }
    /**
     * 
     */
    export class Vector4 extends paper.BaseRelease<Vector4> implements IVector4, paper.ICCS<Vector4>, paper.ISerializable {

        protected static readonly _instances: Vector4[] = [];
        /**
         * 
         */
        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z, w);
                instance._released = false;
                return instance;
            }

            return new Vector4().set(x, y, z, w);
        }

        public x: number;
        public y: number;
        public z: number;
        public w: number;
        /**
         * 请使用 `egret3d.Vector4.create(); egret3d.Quaternion.create()` 创建实例。
         * @see egret3d.Quaternion.create()
         * @see egret3d.Vector4.create()
         * @deprecated
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            super();

            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public serialize() {
            return [this.x, this.y, this.z, this.w];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<IVector4>) {
            return this.set(value.x, value.y, value.z, value.w);
        }

        public clone() {
            return Vector4.create(this.x, this.y, this.z, this.w);
        }

        public set(x: number, y: number, z: number, w: number) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];
            this.w = value[offset + 3];

            return this;
        }

        public clear() {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.w = 1.0;
        }

        /**
         * 向量归一化。
         * - `v.normalize()` 归一化该向量，相当于 v /= v.length。
         * - `v.normalize(input)` 将输入向量归一化的结果写入该向量，相当于 v = input / input.length。
         * @param input 输入向量。
         */
        public normalize(input?: Readonly<IVector4>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y, z = input.z, w = input.w;
            let l = Math.sqrt(x * x + y * y + z * z + w * w);
            if (l > Const.EPSILON) {
                l = 1.0 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
                this.w = w * l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 1.0;
            }

            return this;
        }

        /**
         * 判断该向量是否和一个向量相等。
         * @param value 一个向量。
         * @param threshold 阈值。
         */
        public equal(value: Readonly<IVector4>, threshold: number = 0.000001) {
            if (
                Math.abs(this.x - value.x) <= threshold &&
                Math.abs(this.y - value.y) <= threshold &&
                Math.abs(this.z - value.z) <= threshold &&
                Math.abs(this.w - value.w) <= threshold
            ) {
                return true;
            }

            return false;
        }

        /**
         * 向量与标量相乘运算。
         * - `v.multiplyScalar(scalar)` 将该向量与标量相乘，相当于 v *= scalar。
         * - `v.multiplyScalar(scalar, input)` 将输入向量与标量相乘的结果写入该向量，相当于 v = input * scalar。
         * @param scalar 标量。
         * @param input 输入向量。
         */
        public multiplyScalar(scalar: number, input?: Readonly<IVector4>) {
            if (!input) {
                input = this;
            }

            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;
            this.w = scalar * input.w;

            return this;
        }

        /**
         * 向量点乘运算。
         * - `v.dot(a)` 将该向量与一个向量点乘，相当于 v ·= a。
         * - `v.dot(a, b)` 将两个向量点乘的结果写入该向量，相当于 v = a · b。
         * @param valueA 一个向量。
         * @param valueB 另一个向量。
         */
        public dot(valueA: Readonly<IVector4>, valueB?: Readonly<IVector4>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            return valueA.x * valueB.x + valueA.y * valueB.y + valueA.z * valueB.z + valueA.w * valueB.w;
        }

        /**
         * 将该向量转换为数组。
         * @param array 数组。
         * @param offset 数组偏移。
         */
        public toArray(array?: number[] | Float32Array, offset: number = 0) {
            if (!array) {
                array = [];
            }

            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;
            array[3 + offset] = this.w;

            return array;
        }

        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }

        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        public get squaredLength() {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }
    }
}