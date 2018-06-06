namespace egret3d {

    export class Color implements paper.ISerializable {

        r: number;

        g: number;

        b: number;

        a: number;

        constructor(r: number = 1.0, g: number = 1.0, b: number = 1.0, a: number = 1.0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        public serialize() {
            return [this.r, this.g, this.b, this.a];
        }

        public deserialize(element: number[]) {
            this.r = element[0];
            this.g = element[1];
            this.b = element[2];
            this.a = element[3];
        }

        public static set(r: number = 1, g: number = 1, b: number = 1, a: number = 1, out: Color): Color {
            out.r = r;
            out.g = g;
            out.b = b;
            out.a = a;
            return out;
        }

        public static multiply(c1: Color, c2: Color, out: Color): Color {
            out.r = c1.r * c2.r;
            out.g = c1.g * c2.g;
            out.b = c1.b * c2.b;
            out.a = c1.a * c2.a;
            return out;
        }

        public static scale(c: Color, scaler: number): Color {
            c.r = c.r * scaler;
            c.g = c.g * scaler;
            c.b = c.b * scaler;
            c.a = c.a * scaler;
            return c;
        }

        public static copy(c: Color, out: Color): Color {
            out.r = c.r;
            out.g = c.g;
            out.b = c.b;
            out.a = c.a;
            return out;
        }

        public static lerp(c1: Color, c2: Color, value: number, out: Color): Color {
            out.a = value * (c2.a - c1.a) + c1.a;
            out.r = value * (c2.r - c1.r) + c1.r;
            out.g = value * (c2.g - c1.g) + c1.g;
            out.b = value * (c2.b - c1.b) + c1.b;
            return out;
        }

    }
}