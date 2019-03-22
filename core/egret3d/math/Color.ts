namespace egret3d {
    /**
     * 颜色接口。
     */
    export interface IColor {
        /**
         * 红色通道。
         * - [`0.0` ~ `1.0`]
         */
        r: float;
        /**
         * 绿色通道。
         * - [`0.0` ~ `1.0`]
         */
        g: float;
        /**
         * 蓝色通道。
         * - [`0.0` ~ `1.0`]
         */
        b: float;
        /**
         * 透明通道。
         * - [`0.0` ~ `1.0`]
         */
        a: float;
    }
    /**
     * 颜色。
     */
    export class Color extends paper.BaseRelease<Color> implements IColor, paper.ICCS<Color>, paper.ISerializable {
        /**
         * 所有颜色通道均为零的颜色。
         * - 请注意不要修改该值。
         */
        public static readonly ZERO: Readonly<Color> = new Color().set(0.0, 0.0, 0.0, 0.0);
        /**
         * 黑色。
         * - 请注意不要修改该值。
         */
        public static readonly BLACK: Readonly<Color> = new Color().set(0.0, 0.0, 0.0, 1.0);
        /**
         * 灰色。
         * - 请注意不要修改该值。
         */
        public static readonly GRAY: Readonly<Color> = new Color().set(0.5, 0.5, 0.5, 1.0);
        /**
         * 白色。
         * - 请注意不要修改该值。
         */
        public static readonly WHITE: Readonly<Color> = new Color().set(1.0, 1.0, 1.0, 1.0);
        /**
         * 红色。
         * - 请注意不要修改该值。
         */
        public static readonly RED: Readonly<Color> = new Color().set(1.0, 0.0, 0.0, 1.0);
        /**
         * 绿色。
         * - 请注意不要修改该值。
         */
        public static readonly GREEN: Readonly<Color> = new Color().set(0.0, 1.0, 0.0, 1.0);
        /**
         * 蓝色。
         * - 请注意不要修改该值。
         */
        public static readonly BLUE: Readonly<Color> = new Color().set(0.0, 0.0, 1.0, 1.0);
        /**
         * 黄色。
         * - 请注意不要修改该值。
         */
        public static readonly YELLOW: Readonly<Color> = new Color().set(1.0, 1.0, 0.0, 1.0);
        /**
         * 靛蓝色。
         * - 请注意不要修改该值。
         */
        public static readonly INDIGO: Readonly<Color> = new Color().set(0.0, 1.0, 1.0, 1.0);
        /**
         * 紫色。
         * - 请注意不要修改该值。
         */
        public static readonly PURPLE: Readonly<Color> = new Color().set(1.0, 0.0, 1.0, 1.0);

        private static readonly _instances: Color[] = [];
        /**
         * 创建一个新的颜色对象实例
         * @param r 红色通道
         * @param g 绿色通道
         * @param b 蓝色通道
         * @param a 透明通道
         */
        public static create(r: float = 1.0, g: float = 1.0, b: float = 1.0, a: float = 1.0): Color {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(r, g, b, a);
                instance._released = false;
                return instance;
            }

            return new Color().set(r, g, b, a);
        }

        public r: float;
        public g: float;
        public b: float;
        public a: float;
        /**
         * 请使用 `egret3d.Color.create()` 创建实例。
         * @see egret3d.Color.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.r, this.g, this.b, this.a];
        }

        public deserialize(value: Readonly<[float, float, float, float]>) {
            return this.fromArray(value);
        }

        public clone() {
            return Color.create(this.r, this.g, this.b, this.a);
        }

        public copy(value: Readonly<IColor>) {
            return this.set(value.r, value.g, value.b, value.a);
        }

        public set(r: float, g: float, b: float, a?: float): this {
            this.r = r;
            this.g = g;
            this.b = b;

            if (a !== undefined) {
                this.a = a;
            }

            return this;
        }

        public fromArray(value: ArrayLike<float>, offset: uint = 0) {
            this.r = value[0 + offset];
            this.g = value[1 + offset];
            this.b = value[2 + offset];
            this.a = value[3 + offset];

            return this;
        }

        public fromHex(hex: uint): this {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;

            return this;
        }

        // public fromHSL(h: number, s: number, l: number): this {
        //     // h,s,l ranges are in 0.0 - 1.0
        //     h = _Math.euclideanModulo(h, 1);
        //     s = floatClamp(s, 0, 1);
        //     l = floatClamp(l, 0, 1);

        //     if (s === 0) {

        //         this.r = this.g = this.b = l;

        //     } else {

        //         var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
        //         var q = (2 * l) - p;

        //         this.r = hue2rgb(q, p, h + 1 / 3);
        //         this.g = hue2rgb(q, p, h);
        //         this.b = hue2rgb(q, p, h - 1 / 3);

        //     }

        //     return this;
        // }
        /**
         * 将该颜色乘以一个颜色。
         * - v *= color
         * @param color 一个颜色。
         */
        public multiply(color: Readonly<IColor>): this;
        /**
         * 将该两个颜色相乘的结果写入该颜色。
         * - v = colorA * colorB
         * @param colorA 一个向量。
         * @param colorB 另一个向量。
         */
        public multiply(colorA: Readonly<IColor>, colorB: Readonly<IColor>): this;
        public multiply(colorA: Readonly<IColor>, colorB: Readonly<IColor> | null = null) {
            if (colorB === null) {
                colorB = colorA;
            }

            colorA = this;

            this.r = colorA.r * colorB.r;
            this.g = colorA.g * colorB.g;
            this.b = colorA.b * colorB.b;
            this.a = colorA.a * colorB.a;

            return this;
        }
        /**
         * 
         * @param scalar 
         */
        public scale(scalar: float): this;
        /**
         * 
         * @param scalar 
         * @param input 
         */
        public scale(scalar: float, input: Readonly<IColor>): this;
        public scale(scalar: float, input: Readonly<IColor> | null = null): this {
            if (input === null) {
                input = this;
            }

            this.r = input.r * scalar;
            this.g = input.g * scalar;
            this.b = input.b * scalar;
            this.a = input.a * scalar;

            return this;
        }
        /**
         * 
         * @param to 
         * @param t 
         */
        public lerp(to: Readonly<IColor>, t: float): this;
        /**
         * 
         * @param from 
         * @param to 
         * @param t 
         */
        public lerp(from: Readonly<IColor>, to: Readonly<IColor>, t: float): this;
        public lerp(toOrFrom: Readonly<IColor>, tOrTo: float | Readonly<IColor>, t: float = 0.0) {
            if (typeof tOrTo === "number") {
                t = tOrTo;
                tOrTo = toOrFrom;
                toOrFrom = this;
            }

            this.r = t * (tOrTo.r - toOrFrom.r) + toOrFrom.r;
            this.g = t * (tOrTo.g - toOrFrom.g) + toOrFrom.g;
            this.b = t * (tOrTo.b - toOrFrom.b) + toOrFrom.b;
            this.a = t * (tOrTo.a - toOrFrom.a) + toOrFrom.a;

            return this;
        }
    }
}
