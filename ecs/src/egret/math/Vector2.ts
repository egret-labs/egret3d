
import { ISerializable } from "../../serialize/types";
import { Const } from "./Math";

/**
     * 二维向量接口。
     */
export interface IVector2 {
    /**
     * X 轴分量。
     */
    x: float;
    /**
     * Y 轴分量。
     */
    y: float;
}
/**
 * 二维向量。
 */
export class Vector2 implements ISerializable {
    public static readonly ZERO: Readonly<Vector2> = new Vector2(0.0, 0.0);
    public static readonly ONE: Readonly<Vector2> = new Vector2(1.0, 1.0);
    public static readonly MINUS_ONE: Readonly<Vector2> = new Vector2(-1.0, -1.0);

    private static readonly _instances: Vector2[] = [];
    /**
     * 创建一个二维向量。
     * @param x X 轴分量。
     * @param y Y 轴分量。
     */
    public static create(x: float = 0.0, y: float = 0.0) {
        if (this._instances.length > 0) {
            const instance = this._instances.pop()!.set(x, y);
            return instance;
        }

        return new Vector2().set(x, y);
    }
    public x: float;
    public y: float;
    /**
     * 请使用 `egret3d.Vector2.create()` 创建实例。
     * @see egret3d.Vector2.create()
     * @deprecated
     * @private
     */
    public constructor(x: float = 0.0, y: float = 0.0) {
        // super();
        this.x = x;
        this.y = y;
    }

    public serialize() {
        return [this.x, this.y];
    }

    public deserialize(value: [float, float]) {
        return this.fromArray(value);
    }

    public copy(value: Readonly<IVector2>) {
        return this.set(value.x, value.y);
    }

    public clone() {
        return Vector2.create(this.x, this.y);
    }

    public set(x: float, y: float) {
        this.x = x;
        this.y = y;

        return this;
    }

    public clear() {
        this.x = 0.0;
        this.y = 0.0;

        return this;
    }

    public fromArray(array: ArrayLike<float>, offset: uint = 0) {
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
     */
    public normalize(input: Readonly<IVector2>): this;
    public normalize(input: Readonly<IVector2> | null = null) {
        if (input === null) {
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
     * 将该向量加上一个向量。
     * - v += vector
     * @param vector 一个向量。
     */
    public add(vector: Readonly<IVector2>): this;
    /**
     * 将两个向量相加的结果写入该向量。
     * - v = vectorA + vectorB
     * @param vectorA 一个向量。
     * @param vectorB 另一个向量。
     */
    public add(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
    public add(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2> | null = null) {
        if (vectorB === null) {
            vectorB = vectorA;
            vectorA = this;
        }

        this.x = vectorA.x + vectorB.x;
        this.y = vectorA.y + vectorB.y;

        return this;
    }
    /**
     * 将该向量减去一个向量。
     * - v -= vector
     * @param vector 一个向量。
     */
    public subtract(vector: Readonly<IVector2>): this;
    /**
     * 将两个向量相减的结果写入该向量。
     * - v = vectorA - vectorB
     * @param vectorA 一个向量。
     * @param vectorB 另一个向量。
     */
    public subtract(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
    public subtract(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2> | null = null) {
        if (vectorB === null) {
            vectorB = vectorA;
            vectorA = this;
        }

        this.x = vectorA.x - vectorB.x;
        this.y = vectorA.y - vectorB.y;

        return this;
    }
    /**
     * 将该向量加上一个标量。
     * - v += scalar
     * @param scalar 标量。
     */
    public addScalar(scalar: float): this;
    /**
     * 将输入向量与标量相加的结果写入该向量。
     * - v = input + scalar
     * @param scalar 一个标量。
     * @param input 输入向量。
     */
    public addScalar(scalar: float, input: Readonly<IVector2>): this;
    public addScalar(scalar: float, input: Readonly<IVector2> | null = null) {
        if (input === null) {
            input = this;
        }

        this.x = input.x + scalar;
        this.y = input.y + scalar;

        return this;
    }
    /**
     * 
     * @param scalar 
     */
    public multiplyScalar(scalar: float): this;
    /**
     * 
     * @param scalar 
     * @param input 
     */
    public multiplyScalar(scalar: float, input: Readonly<IVector2>): this;
    public multiplyScalar(scalar: float, input: Readonly<IVector2> | null = null) {
        if (input === null) {
            input = this;
        }

        this.x = scalar * input.x;
        this.y = scalar * input.y;

        return this;
    }
    /**
     * 
     * @param vector 
     */
    public min(vector: Readonly<IVector2>): this;
    /**
     * 
     * @param vectorA 
     * @param vectorB 
     */
    public min(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
    public min(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2> | null = null) {
        if (vectorB === null) {
            vectorB = vectorA;
            vectorA = this;
        }

        this.x = Math.min(vectorA.x, vectorB.x);
        this.y = Math.min(vectorA.y, vectorB.y);

        return this;
    }
    /**
     * 
     * @param vector 
     */
    public max(vector: Readonly<IVector2>): this;
    /**
     * 
     * @param vectorA 
     * @param vectorB 
     */
    public max(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2>): this;
    public max(vectorA: Readonly<IVector2>, vectorB: Readonly<IVector2> | null = null) {
        if (vectorB === null) {
            vectorB = vectorA;
            vectorA = this;
        }

        this.x = Math.max(vectorA.x, vectorB.x);
        this.y = Math.max(vectorA.y, vectorB.y);

        return this;
    }
    /**
     * 限制该向量，使其在最小向量和最大向量之间。
     * @param min 最小向量。
     * @param max 最大向量。
     */
    public clamp(min: Readonly<IVector2>, max: Readonly<IVector2>): this;
    /**
     * 将限制输入向量在最小向量和最大向量之间的结果写入该向量。
     * @param min 最小向量。
     * @param max 最大向量。
     * @param input 输入向量。
     */
    public clamp(min: Readonly<IVector2>, max: Readonly<IVector2>, input: Readonly<IVector2>): this;
    public clamp(min: Readonly<IVector2>, max: Readonly<IVector2>, input: Readonly<IVector2> | null = null) {
        if (input === null) {
            input = this;
        }

        if (DEBUG && (min.x > max.x || min.y > max.y)) {
            console.warn("Invalid arguments.");
        }

        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, input.x));
        this.y = Math.max(min.y, Math.min(max.y, input.y));

        return this;
    }
    /**
     * 该向量的长度。
     * - 该值是实时计算的。
     */
    public get length(): float {
        const { x, y } = this;

        return Math.sqrt(x * x + y * y);
    }
    /**
     * 该向量的长度的平方。
     * - 该值是实时计算的。
     */
    public get sqrtLength(): float {
        const { x, y } = this;

        return x * x + y * y;
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
    public static dot(v1: Vector2, v2: Vector2): float {
        return v1.x * v2.x + v1.y * v2.y;
    }
    /**
     * @deprecated 
     */
    public static scale(v: Vector2, scaler: float): Vector2 {
        v.x = v.x * scaler;
        v.y = v.y * scaler;
        return v;
    }
    /**
     * @deprecated 
     */
    public static getLength(v: Vector2): float {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    /**
     * @deprecated 
     */
    public static getDistance(v1: Vector2, v2: Vector2): float {
        this.subtract(v1, v2, _helpVector2A);

        return this.getLength(_helpVector2A);
    }
    /**
     * @deprecated 
     */
    public static equal(v1: Vector2, v2: Vector2, threshold: float = 0.00001): boolean {
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
    public static lerp(v1: Vector2, v2: Vector2, value: float, out: Vector2): Vector2 {
        out.x = v1.x * (1 - value) + v2.x * value;
        out.y = v1.y * (1 - value) + v2.y * value;
        return out;
    }
}

const _helpVector2A = new Vector2();
/**
 * @internal
 */
export const helpVector2A = Vector2.create();