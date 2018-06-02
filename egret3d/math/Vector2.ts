namespace egret3d {

    export class Vector2 implements paper.ISerializable {

        public static readonly ZERO: Readonly<Vector2> = new Vector2(0.0, 0.0);

        public static readonly ONE: Readonly<Vector2> = new Vector2(1.0, 1.0);

        public x: number;

        public y: number;

        constructor(x: number = 0.0, y: number = 0.0) {
            this.x = x;
            this.y = y;
        }

        public serialize() {
            return [this.x, this.y];
        }

        public deserialize(element: [number, number]) {
            this.x = element[0];
            this.y = element[1];
        }

        public copy(value: Vector2) {
            this.x = value.x;
            this.y = value.y;

            return this;
        }

        public clone() {
            const value = new Vector2();
            value.copy(this);

            return value;
        }

        public set(x: number, y: number) {
            this.x = x;
            this.y = y;

            return this;
        }

        public normalize() {
            const l = this.length;
            if (l > Number.MIN_VALUE) {
                this.x /= l;
                this.y /= l;
            }
            else {
                this.x = 1.0;
                this.y = 0.0;
            }

            return this;
        }

        public get length() {
            return Math.sqrt(this.sqrtLength);
        }

        public get sqrtLength() {
            return this.x * this.x + this.y * this.y;
        }

        public static set(x: number, y: number, out: Vector2): Vector2 {
            out.x = x;
            out.y = y;
            return out;
        }

        public static normalize(v: Vector2): Vector2 {
            let num: number = this.getLength(v);
            if (num > Number.MIN_VALUE) {
                v.x = v.x / num;
                v.y = v.y / num;
            } else {
                v.x = 1.0;
                v.y = 0.0;
            }
            return v;
        }

        public static add(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x + v2.x;
            out.y = v1.y + v2.y;
            return out;
        }

        public static subtract(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x - v2.x;
            out.y = v1.y - v2.y;
            return out;
        }

        public static multiply(v1: Vector2, v2: Vector2, out: Vector2): Vector2 {
            out.x = v1.x * v2.x;
            out.y = v1.y * v2.y;
            return out;
        }

        public static dot(v1: Vector2, v2: Vector2): number {
            return v1.x * v2.x + v1.y * v2.y;
        }

        public static scale(v: Vector2, scaler: number): Vector2 {
            v.x = v.x * scaler;
            v.y = v.y * scaler;
            return v;
        }

        public static getLength(v: Vector2): number {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }

        public static getDistance(v1: Vector2, v2: Vector2): number {
            this.subtract(v1, v2, _helpVector2A);

            return this.getLength(_helpVector2A);
        }

        public static copy(v: Vector2, out: Vector2): Vector2 {
            out.x = v.x;
            out.y = v.y;
            return out;
        }

        public static equal(v1: Vector2, v2: Vector2, threshold: number = 0.00001): boolean {
            if (Math.abs(v1.x - v2.x) > threshold) {
                return false;
            }

            if (Math.abs(v1.y - v2.y) > threshold) {
                return false;
            }

            return true;
        }

        public static lerp(v1: Vector2, v2: Vector2, value: number, out: Vector2): Vector2 {
            out.x = v1.x * (1 - value) + v2.x * value;
            out.y = v1.y * (1 - value) + v2.y * value;
            return out;
        }

    }

    const _helpVector2A = new Vector2();

}