/**
     * 内联的数字常数枚举。
     */
export const enum Const {
    PI = 3.141592653589793,
    PI_HALF = PI * 0.5,
    PI_QUARTER = PI * 0.25,
    PI_DOUBLE = PI * 2.0,
    /**
     * 弧度制到角度制相乘的系数。
     */
    RAD_DEG = 180.0 / PI,
    /**
     * 角度制到弧度制相乘的系数。
     */
    DEG_RAD = PI / 180.0,
    /**
     * 大于零的最小正值。
     * - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
     */
    EPSILON = 2.2204460492503130808472633361816E-16,
    /**
     * The square root of 2.
     */
    SQRT_2 = 1.4142135623731,
    /**
     * The square root of 0.5, or, equivalently, one divided by the square root of 2.
     */
    SQRT1_2 = SQRT_2 * 0.5,
}