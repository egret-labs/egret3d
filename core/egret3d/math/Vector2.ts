namespace egret3d {
    /**
     * 二维向量接口。
     */
    export interface IVector2 {
        /**
         * X 轴分量。
         */
        x: number;
        /**
         * Y 轴分量。
         */
        y: number;
    }
    /**
     * 二维向量。
     */
    export class Vector2 extends paper.BaseRelease<Vector2> implements IVector2, paper.ICCS<Vector2>, paper.ISerializable {
        public static readonly ZERO: Readonly<Vector2> = new Vector2(0.0, 0.0);
        public static readonly ONE: Readonly<Vector2> = new Vector2(1.0, 1.0);

        private static readonly _instances: Vector2[] = [];
        /**
         * 创建一个二维向量。
         * @param x X 轴分量。
         * @param y Y 轴分量。
         */
        public static create(x: number = 0.0, y: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y);
                instance._released = false;
                return instance;
            }

            return new Vector2().set(x, y);
        }
        public x: number;
        public y: number;
        /**
         * 请使用 `egret3d.Vector2.create()` 创建实例。
         * @see egret3d.Vector2.create()
         * @deprecated
         * @private
         */
        public constructor(x: number = 0.0, y: number = 0.0) {
            super();
            this.x = x;
            this.y = y;
        }

        public serialize() {
            return [this.x, this.y];
        }

        public deserialize(value: [number, number]) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<IVector2>) {
            return this.set(value.x, value.y);
        }

        public clone() {
            return Vector2.create(this.x, this.y);
        }

        public set(x: number, y: number) {
            this.x = x;
            this.y = y;

            return this;
        }

        public clear() {
            this.x = 0.0;
            this.y = 0.0;

            return this;
        }

        public fromArray(array: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = array[offset];
            this.y = array[offset + 1];

            return this;
        }
        /**
         * 归一化该向量。
         * - v /= v.length
         */
        public normalize(): this;
        /**
         * 将输入向量的归一化结果写入该向量。
         * - v = input / input.length
         * @param input 输入向量。
         * @param defaultVector 当向量不能合法归一化时将指向何方向。
         */
        public normalize(input: Readonly<IVector2>, defaultVector?: Readonly<IVector2>): this;
        public normalize(input?: Readonly<IVector2>) {
            if (!input) {
                input = this;
            }

            const x = input.x, y = input.y;
            let l = Math.sqrt(x * x + y * y);

            if (l > Const.EPSILON) {
                l = 1.0 / l;
                this.x = x * l;
                this.y = y * l;
            }
            else {
                this.x = 1.0;
                this.y = 0.0;
            }

            return this;
        }
        /**
         * 该向量的长度。
         * - 该值是实时计算的。
         */
        public get length() {
            return Math.sqrt(this.sqrtLength);
        }
        /**
         * 该向量的长度的平方。
         * - 该值是实时计算的。
         */
        public get sqrtLength() {
            return this.x * this.x + this.y * this.y;
        }
        /**
         * @deprecated 
         */
        public static add(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x + v2.x;
            out.y = v1.y + v2.y;
            return out;
        }
        /**
         * @deprecated 
         */
        public static subtract(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x - v2.x;
            out.y = v1.y - v2.y;
            return out;
        }
        /**
         * @deprecated 
         */
        public static multiply(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x * v2.x;
            out.y = v1.y * v2.y;
            return out;
        }
        /**
         * @deprecated 
         */
        public static dot(v1: Vector2, v2: Vector2): number {
            return v1.x * v2.x + v1.y * v2.y;
        }
        /**
         * @deprecated 
         */
        public static scale(v: Vector2, scaler: number): Vector2 {
            v.x = v.x * scaler;
            v.y = v.y * scaler;
            return v;
        }
        /**
         * @deprecated 
         */
        public static getLength(v: Vector2): number {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }
        /**
         * @deprecated 
         */
        public static getDistance(v1: Vector2, v2: Vector2): number {
            this.subtract(v1, v2, _helpVector2A);

            return this.getLength(_helpVector2A);
        }
        /**
         * @deprecated 
         */
        public static equal(v1: Vector2, v2: Vector2, threshold: number = 0.00001): boolean {
            if (Math.abs(v1.x - v2.x) > threshold) {
                return false;
            }

            if (Math.abs(v1.y - v2.y) > threshold) {
                return false;
            }

            return true;
        }
        /**
         * @deprecated 
         */
        public static lerp(v1: Vector2, v2: Vector2, value: number, out: Vector2): Vector2 {
            out.x = v1.x * (1 - value) + v2.x * value;
            out.y = v1.y * (1 - value) + v2.y * value;
            return out;
        }
    }

    const _helpVector2A = new Vector2();
}