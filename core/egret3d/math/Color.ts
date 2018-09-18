namespace egret3d {

    export class Color implements paper.IRelease<Color>, paper.ISerializable {
        public static readonly WHITE: Readonly<Color> = new Color().set(1.0, 1.0, 1.0, 1.0);
        public static readonly BLACK: Readonly<Color> = new Color().set(0.0, 0.0, 0.0, 1.0);
        public static readonly RED: Readonly<Color> = new Color().set(1.0, 0.0, 0.0, 1.0);
        public static readonly GREEN: Readonly<Color> = new Color().set(0.0, 1.0, 0.0, 1.0);
        public static readonly BLUE: Readonly<Color> = new Color().set(0.0, 0.0, 1.0, 1.0);

        private static readonly _instances: Color[] = [];

        public static create(r: number = 1.0, g: number = 1.0, b: number = 1.0, a: number = 1.0) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(r, g, b, a);
            }

            return new Color().set(r, g, b, a);
        }

        public release() {
            if (Color._instances.indexOf(this) < 0) {
                Color._instances.push(this);
            }

            return this;
        }

        public r: number;

        public g: number;

        public b: number;

        public a: number;
        /**
         * 请使用 `egret3d.Color.create()` 创建实例。
         * @see egret3d.Color.create()
         */
        private constructor() { }

        public serialize() {
            return [this.r, this.g, this.b, this.a];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            return this.fromArray(value);
        }

        public clone() {
            return Color.create(this.r, this.g, this.b, this.a);
        }

        public copy(value: Readonly<Color>) {
            return this.set(value.r, value.g, value.b, value.a);
        }

        public set(r: number, g: number, b: number, a: number) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.r = value[0 + offset];
            this.g = value[1 + offset];
            this.b = value[2 + offset];
            this.a = value[3 + offset];

            return this;
        }

        public multiply(valueA: Readonly<Color>, valueB?: Readonly<Color>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.r = valueA.r * valueB.r;
            this.g = valueA.g * valueB.g;
            this.b = valueA.b * valueB.b;
            this.a = valueA.a * valueB.a;

            return this;
        }

        public scale(value: number, source?: Readonly<Color>) {
            if (!source) {
                source = this;
            }

            this.r = source.r * value;
            this.g = source.g * value;
            this.b = source.b * value;
            this.a = source.a * value;

            return this;
        }

        public lerp(t: number, valueA: Readonly<Color>, valueB?: Readonly<Color>) {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.r = t * (valueB.r - valueA.r) + valueA.r;
            this.g = t * (valueB.g - valueA.g) + valueA.g;
            this.b = t * (valueB.b - valueA.b) + valueA.b;
            this.a = t * (valueB.a - valueA.a) + valueA.a;

            return this;
        }
    }
}