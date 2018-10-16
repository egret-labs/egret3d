declare module OIMO {

    /**
     * using M; // mixing it in causes errors :
     * 3x3 Matrix class.
     * 
     * Note that columns and rows are 0-indexed.
     */
    export class Mat3 {

        /**
         * The number of instance creation.
         */
        static numCreations: number;

        /**
         * The element at row 0 column 0.
         */
        e00: number;

        /**
         * The element at row 0 column 1.
         */
        e01: number;

        /**
         * The element at row 0 column 2.
         */
        e02: number;

        /**
         * The element at row 1 column 0.
         */
        e10: number;

        /**
         * The element at row 1 column 1.
         */
        e11: number;

        /**
         * The element at row 1 column 2.
         */
        e12: number;

        /**
         * The element at row 2 column 0.
         */
        e20: number;

        /**
         * The element at row 2 column 1.
         */
        e21: number;

        /**
         * The element at row 2 column 2.
         */
        e22: number;

        /**
         * Creates a new matrix. The matrix is identity by default.
         */
        constructor(e00?: number, e01?: number, e02?: number, e10?: number, e11?: number, e12?: number, e20?: number, e21?: number, e22?: number);

        /**
         * --- public --
         * Sets all elements at once and returns `this`.
         */
        init(e00: number, e01: number, e02: number, e10: number, e11: number, e12: number, e20: number, e21: number, e22: number): Mat3;

        /**
         * Sets this matrix to identity matrix and returns `this`.
         */
        identity(): Mat3;

        /**
         * Returns `this` + `m`
         */
        add(m: Mat3): Mat3;

        /**
         * Returns `this` - `m`
         */
        sub(m: Mat3): Mat3;

        /**
         * Returns `this` * `s`
         */
        scale(s: number): Mat3;

        /**
         * Returns `this` * `m`
         */
        mul(m: Mat3): Mat3;

        /**
         * Sets this matrix to `this` + `m` and returns `this`.
         */
        addEq(m: Mat3): Mat3;

        /**
         * Sets this matrix to `this` - `m` and returns `this`.
         */
        subEq(m: Mat3): Mat3;

        /**
         * Sets this matrix to `this` * `s` and returns `this`.
         */
        scaleEq(s: number): Mat3;

        /**
         * Sets this matrix to `this` * `m` and returns `this`.
         */
        mulEq(m: Mat3): Mat3;

        /**
         * Returns *scaling matrix* * `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        prependScale(sx: number, sy: number, sz: number): Mat3;

        /**
         * Returns `this` * *scaling matrix*.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        appendScale(sx: number, sy: number, sz: number): Mat3;

        /**
         * Returns *rotation matrix* * `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        prependRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;


        /**
         * Returns `this` * *rotation matrix*.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        appendRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;

        /**
         * Sets this matrix to *scaling matrix* * `this`, and returns `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        prependScaleEq(sx: number, sy: number, sz: number): Mat3;

        /**
         * Sets this matrix to `this` * *scaling matrix*, and returns `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        appendScaleEq(sx: number, sy: number, sz: number): Mat3;

        /**
         * Sets this matrix to *rotation matrix* * `this`, and returns `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        prependRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;


        /**
         * Sets this matrix to `this` * *rotation matrix*, and returns `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        appendRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat3;

        /**
         * Returns the transposed matrix.
         */
        transpose(): Mat3;

        /**
         * Sets this matrix to the transposed matrix and returns `this`.
         */
        transposeEq(): Mat3;

        /**
         * Returns the determinant.
         */
        determinant(): number;

        /**
         * Returns the trace.
         */
        trace(): number;

        /**
         * Returns the inverse matrix.
         * 
         * If the determinant is zero, zero matrix is returned.
         */
        inverse(): Mat3;

        /**
         * Sets this matrix to the inverse matrix and returns `this`.
         * 
         * If the determinant is zero, this matrix is set to zero matrix.
         */
        inverseEq(): Mat3;


        /**
         * Returns an array of the elements of this matrix.
         * 
         * If `columnMajor` is true, the array is arranged in column-major order.
         * Otherwise, the array is arranged in row-major order.
         */
        toArray(columnMajor?: boolean): Array<number>;

        /**
         * Copies values from `m` and returns `this`.
         */
        copyFrom(m: Mat3): Mat3;

        /**
         * Returns a clone of the matrix.
         */
        clone(): Mat3;

        /**
         * Sets this matrix to the representation of the quaternion `q`, and returns `this`.
         */
        fromQuat(q: Quat): Mat3;

        /**
         * Returns a quaternion which represents this matrix.
         * 
         * This matrix must be a rotation matrix, that is, must be orthogonalized and have determinant 1.
         */
        toQuat(): Quat;

        /**
         * Sets this matrix to the rotation matrix represented by Euler angles `eulerAngles`, and returns `this`.
         * Rotation order is first X-axis, then rotated Y-axis, finally rotated Z-axis.
         */
        fromEulerXyz(eulerAngles: Vec3): Mat3;


        /**
         * Returns a vector `(angleX, angleY, angleZ)` represents the Euler angles of this matrix.
         * Rotation order is first X-axis, then rotated Y-axis, finally rotated Z-axis.
         * Note that `angleX`, `angleY`, and `angleZ` are in range of -PI to PI, -PI/2 to PI/2, and -PI to PI respectively.
         */
        toEulerXyz(): Vec3;


        /**
         * Returns the `index`th row vector of the matrix.
         * 
         * If `index` is less than `0` or greater than `2`, `null` will be returned.
         */
        getRow(index: number): Vec3;

        /**
         * Returns the `index`th column vector of the matrix.
         * 
         * If `index` is less than `0` or greater than `2`, `null` will be returned.
         */
        getCol(index: number): Vec3;

        /**
         * Sets `dst` to the `index`th row vector of the matrix.
         * 
         * If `index` is less than `0` or greater than `2`, `dst` will be set to the zero vector.
         */
        getRowTo(index: number, dst: Vec3);

        /**
         * Sets `dst` to the `index`th column vector of the matrix.
         * 
         * If `index` is less than `0` or greater than `2`, `dst` will be set to the zero vector.
         */
        getColTo(index: number, dst: Vec3);

        /**
         * Sets this matrix by row vectors and returns `this`.
         */
        fromRows(row0: Vec3, row1: Vec3, row2: Vec3): Mat3;

        /**
         * Sets this matrix by column vectors and returns `this`.
         */
        fromCols(col0: Vec3, col1: Vec3, col2: Vec3): Mat3;

        /**
         * Returns the string representation of the matrix.
         */
        toString(): string;

    }

}

declare module OIMO {

    /**
     * 4x4 Matrix class.
     * 
     * Note that columns and rows are 0-indexed.
     */
    export class Mat4 {

        /**
         * The number of instance creation.
         */
        static numCreations: number;

        /**
         * The element at row 0 column 0.
         */
        e00: number;

        /**
         * The element at row 0 column 1.
         */
        e01: number;

        /**
         * The element at row 0 column 2.
         */
        e02: number;

        /**
         * The element at row 0 column 3.
         */
        e03: number;

        /**
         * The element at row 1 column 0.
         */
        e10: number;

        /**
         * The element at row 1 column 1.
         */
        e11: number;

        /**
         * The element at row 1 column 2.
         */
        e12: number;

        /**
         * The element at row 1 column 3.
         */
        e13: number;

        /**
         * The element at row 2 column 0.
         */
        e20: number;

        /**
         * The element at row 2 column 1.
         */
        e21: number;

        /**
         * The element at row 2 column 2.
         */
        e22: number;

        /**
         * The element at row 2 column 3.
         */
        e23: number;

        /**
         * The element at row 3 column 0.
         */
        e30: number;

        /**
         * The element at row 3 column 1.
         */
        e31: number;

        /**
         * The element at row 3 column 2.
         */
        e32: number;

        /**
         * The element at row 3 column 3.
         */
        e33: number;

        /**
         * Creates a new matrix. The matrix is identity by default.
         */
        constructor(e00?: number, e01?: number, e02?: number, e03?: number, e10?: number, e11?: number, e12?: number, e13?: number, e20?: number, e21?: number, e22?: number, e23?: number, e30?: number, e31?: number, e32?: number, e33?: number);

        /**
         * --- public --
         * Sets all elements at once and returns `this`.
         */
        init(e00: number, e01: number, e02: number, e03: number, e10: number, e11: number, e12: number, e13: number, e20: number, e21: number, e22: number, e23: number, e30: number, e31: number, e32: number, e33: number): Mat4;

        /**
         * Sets this matrix to identity matrix and returns `this`.
         */
        identity(): Mat4;

        /**
         * Returns `this` + `m`
         */
        add(m: Mat4): Mat4;

        /**
         * Returns `this` - `m`
         */
        sub(m: Mat4): Mat4;

        /**
         * Returns `this` * `s`
         */
        scale(s: number): Mat4;

        /**
         * Returns `this` * `m`
         */
        mul(m: Mat4): Mat4;

        /**
         * Sets this matrix to `this` + `m` and returns `this`.
         */
        addEq(m: Mat4): Mat4;

        /**
         * Sets this matrix to `this` - `m` and returns `this`.
         */
        subEq(m: Mat4): Mat4;

        /**
         * Sets this matrix to `this` * `s` and returns `this`.
         */
        scaleEq(s: number): Mat4;

        /**
         * Sets this matrix to `this` * `m` and returns `this`.
         */
        mulEq(m: Mat4): Mat4;

        /**
         * Returns *scaling matrix* * `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        prependScale(sx: number, sy: number, sz: number): Mat4;

        /**
         * Returns `this` * *scaling matrix*.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        appendScale(sx: number, sy: number, sz: number): Mat4;

        /**
         * Returns *rotation matrix* * `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        prependRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;



        /**
         * Returns `this` * *rotation matrix*.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        appendRotation(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;

        /**
         * Returns *translation matrix* * `this`.
         * 
         * Where *translation matrix* is a matrix which translates `sx`, `sy` and `sz` along
         * the x-axis, y-axis and z-axis respectively.
         */
        prependTranslation(tx: number, ty: number, tz: number): Mat4;

        /**
         * Returns `this` * *translation matrix*.
         * 
         * Where *translation matrix* is a matrix which translates `sx`, `sy` and `sz` along
         * the x-axis, y-axis and z-axis respectively.
         */
        appendTranslation(tx: number, ty: number, tz: number): Mat4;

        /**
         * Sets this matrix to *scaling matrix* * `this`, and returns `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        prependScaleEq(sx: number, sy: number, sz: number): Mat4;

        /**
         * Sets this matrix to `this` * *scaling matrix*, and returns `this`.
         * 
         * Where *scaling matrix* is a matrix which scales `sx` times, `sy` times and
         * `sz` times along the x-axis, y-axis and z-axis respectively.
         */
        appendScaleEq(sx: number, sy: number, sz: number): Mat4;

        /**
         * Sets this matrix to *rotation matrix* * `this`, and returns `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        prependRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;


        /**
         * Sets this matrix to `this` * *rotation matrix*, and returns `this`.
         * 
         * Where *rotation matrix* is a matrix which rotates `rad` in radians around the **normalized**
         * vector (`axisX`, `axisY`, `axisZ`).
         */
        appendRotationEq(rad: number, axisX: number, axisY: number, axisZ: number): Mat4;


        /**
         * Sets this matrix to *translation matrix* * `this`, and returns `this`.
         * 
         * Where *translation matrix* is a matrix which translates `sx`, `sy` and `sz` along
         * the x-axis, y-axis and z-axis respectively.
         */
        prependTranslationEq(tx: number, ty: number, tz: number): Mat4;

        /**
         * Sets this matrix to `this` * *translation matrix*, and returns `this`.
         * 
         * Where *translation matrix* is a matrix which translates `sx`, `sy` and `sz` along
         * the x-axis, y-axis and z-axis respectively.
         */
        appendTranslationEq(tx: number, ty: number, tz: number): Mat4;

        /**
         * Returns the transposed matrix.
         */
        transpose(): Mat4;

        /**
         * Sets this matrix to the transposed matrix and returns `this`.
         */
        transposeEq(): Mat4;

        /**
         * Returns the determinant.
         */
        determinant(): number;


        /**
         * Returns the trace.
         */
        trace(): number;

        /**
         * Returns the inverse matrix.
         * 
         * If the determinant is zero, zero matrix is returned.
         */
        inverse(): Mat4;


        /**
         * Sets this matrix to the inverse matrix and returns `this`.
         * 
         * If the determinant is zero, this matrix is set to zero matrix.
         */
        inverseEq(): Mat4;

        /**
         * Sets this matrix to *view matrix* and returns `this`.
         * 
         * Where *view matrix* is a matrix which represents the viewing transformation with
         * eyes at (`eyeX`, `eyeY`, `eyeZ`), fixation point at (`atX`, `atY`, `atZ`), and
         * up vector (`upX`, `upY`, `upZ`).
         */
        lookAt(eyeX: number, eyeY: number, eyeZ: number, atX: number, atY: number, atZ: number, upX: number, upY: number, upZ: number): Mat4;


        /**
         * Sets this matrix to *perspecive projection matrix* and returns `this`.
         * 
         * Where *perspecive projection matrix* is a matrix which represents the perspective
         * projection transformation with field of view in the y direction `fovY` in radians,
         * aspect ratio `aspect`, and z-value of near and far clipping plane `near`, `far`.
         */
        perspective(fovY: number, aspect: number, near: number, far: number): Mat4;


        /**
         * Sets this matrix to *orthogonal projection matrix* and returns `this`.
         * 
         * Where *orthogonal projection matrix* is a matrix which represents the orthogonal
         * projection transformation with screen width and height `width`, `height`, and
         * z-value of near and far clipping plane `near`, `far`.
         */
        ortho(width: number, height: number, near: number, far: number): Mat4;

        /**
         * Returns an array of the elements of this matrix.
         * 
         * If `columnMajor` is true, the array is arranged in column-major order.
         * Otherwise, the array is arranged in row-major order.
         */
        toArray(columnMajor?: boolean): Array<number>;

        /**
         * Copies values from `m` and returns `this`.
         */
        copyFrom(m: Mat4): Mat4;

        /**
         * Sets this matrix to the extension of `m` and returns `this`.
         * 
         * `this.e33` is set to `1` and other components don't exist in `m` are set to `0`.
         */
        fromMat3(m: Mat3): Mat4;

        /**
         * Sets this matrix to the representation of `transform` and returns `this`.
         */
        fromTransform(transform: Transform): Mat4;

        /**
         * Returns a clone of the matrix.
         */
        clone(): Mat4;

        /**
         * Returns the string representation of the matrix.
         */
        toString(): string;

    }

}

declare module OIMO {

    /**
     * This class provides mathematical operations for internal purposes.
     */
    export class MathUtil {

        /**
         * Positive infinity.
         */
        static POSITIVE_INFINITY: number;

        /**
         * Negative infinity.
         */
        static NEGATIVE_INFINITY: number;

        /**
         * The ratio of the circumference of a circle to its diameter.
         */
        static PI: number;

        /**
         * Shorthand for `PI * 2`.
         */
        static TWO_PI: number;

        /**
         * Shorthand for `PI / 2`.
         */
        static HALF_PI: number;

        /**
         * Shorthand for `PI / 180`.
         */
        static TO_RADIANS: number;

        /**
         * Shorthand for `180 / PI`.
         */
        static TO_DEGREES: number;

        /**
         * Returns the absolute value of `x`.
         */
        static abs(x: number): number;

        /**
         * Returns `Math.sin(x)`.
         */
        static sin(x: number): number;

        /**
         * Returns `Math.cos(x)`.
         */
        static cos(x: number): number;

        /**
         * Returns `Math.tan(x)`.
         */
        static tan(x: number): number;

        /**
         * Returns `Math.asin(x)`.
         */
        static asin(x: number): number;

        /**
         * Returns `Math.acos(x)`.
         */
        static acos(x: number): number;

        /**
         * Returns `Math.atan(x)`.
         */
        static atan(x: number): number;

        /**
         * Returns `Math.asin(clamp(-1, x, 1))`.
         * This never returns `NaN` as long as `x` is not `NaN`.
         */
        static safeAsin(x: number): number;

        /**
         * Returns `Math.acos(clamp(-1, x, 1))`.
         * This never returns `NaN` as long as `x` is not `NaN`.
         */
        static safeAcos(x: number): number;

        /**
         * Returns `Math.atan2(y, x)`
         */
        static atan2(y: number, x: number): number;

        /**
         * Returns `Math.sqrt(x)`.
         */
        static sqrt(x: number): number;

        /**
         * Returns a clamped value of `x` from `min` to `max`.
         */
        static clamp(x: number, min: number, max: number): number;

        /**
         * Returns `Math.random()`.
         */
        static rand(): number;

        /**
         * Returns a random value from `min` inclusive to `max` exclusive.
         */
        static randIn(min: number, max: number): number;

        /**
         * Returns a random `Vec3` from `(min, min, min)` inclusive to `(max, max, max)` exclusive.
         */
        static randVec3In(min: number, max: number): Vec3;

        /**
         * Returns a random `Vec3` from `(-1.0, -1.0, -1.0)` inclusive to `(1.0, 1.0, 1.0)` exclusive.
         */
        static randVec3(): Vec3;

    }

}

declare module OIMO {

    /**
     * using M; // mixing it in causes errors :
     * Quaternion class.
     */
    export class Quat {

        /**
         * The number of instance creation.
         */
        static numCreations: number;

        /**
         * The x-value of the imaginary part of the quaternion.
         */
        x: number;

        /**
         * The y-value of the imaginary part of the quaternion.
         */
        y: number;

        /**
         * The z-value of the imaginary part of the quaternion.
         */
        z: number;

        /**
         * The real part of the quaternion.
         */
        w: number;

        /**
         * Creates a new quaternion. The quaternion is identity by default.
         */
        constructor(x?: number, y?: number, z?: number, w?: number);

        tx: number;

        ty: number;

        tz: number;

        tw: number;

        /**
         * Sets the quaternion to identity quaternion and returns `this`.
         */
        identity(): Quat;

        /**
         * Sets all values at once and returns `this`.
         */
        init(x: number, y: number, z: number, w: number): Quat;

        /**
         * Returns `this` + `v`.
         */
        add(q: Quat): Quat;

        /**
         * Returns `this` - `v`.
         */
        sub(q: Quat): Quat;

        /**
         * Returns `this` * `s`.
         */
        scale(s: number): Quat;

        /**
         * Sets this quaternion to `this` + `v` and returns `this`.
         */
        addEq(q: Quat): Quat;

        /**
         * Sets this quaternion to `this` - `v` and returns `this`.
         */
        subEq(q: Quat): Quat;

        /**
         * Sets this quaternion to `this` * `s` and returns `this`.
         */
        scaleEq(s: number): Quat;

        /**
         * Returns the length of the quaternion.
         */
        length(): number;

        /**
         * Returns the squared length of the quaternion.
         */
        lengthSq(): number;

        /**
         * Returns the dot product of `this` and `q`.
         */
        dot(q: Quat): number;

        /**
         * Returns the normalized quaternion.
         * 
         * If the length is zero, zero quaterinon is returned.
         */
        normalized(): Quat;

        /**
         * Sets this quaternion to the normalized quaternion and returns `this`.
         * 
         * If the length is zero, this quaternion is set to zero quaternion.
         */
        normalize(): Quat;

        /**
         * Sets this quaternion to the quaternion representing the shortest arc
         * rotation from `v1` to `v2`, and return `this`.
         */
        setArc(v1: Vec3, v2: Vec3): Quat;



        /**
         * Returns the spherical linear interpolation between two quaternions `this` and `q` with interpolation paraeter `t`.
         * Both quaternions `this` and `q` must be normalized.
         */
        slerp(q: Quat, t: number): Quat;

        /**
         * Copies values from `q` and returns `this`.
         */
        copyFrom(q: Quat): Quat;

        /**
         * Returns a clone of the quaternion.
         */
        clone(): Quat;

        /**
         * Sets this quaternion to the representation of the matrix `m`, and returns `this`.
         * 
         * The matrix `m` must be a rotation matrix, that is, must be orthogonalized and have determinant 1.
         */
        fromMat3(m: Mat3): Quat;

        /**
         * e00 is the larges
         * e11 is the larges
         * e22 is the larges
         * Returns a rotation matrix which represents this quaternion.
         */
        toMat3(): Mat3;

        /**
         * Returns the string representation of the quaternion.
         */
        toString(): string;

    }

}

declare module OIMO {

    /**
     * The object pool system of `Vec3`, `Mat3`, `Mat4`, and `Quat`.
     */
    export class Pool {

        stackVec3: Vec3[];

        sizeVec3: number;

        stackMat3: Mat3[];

        sizeMat3: number;

        stackMat4: Array<Mat4>;

        sizeMat4: number;

        stackQuat: Array<Quat>;

        sizeQuat: number;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Returns a `Vec3` object. If an unused object of `Vec3` is pooled, this does
         * not create a new instance.
         */
        vec3(): Vec3;

        /**
         * Returns a `Mat3` object. If an unused object of `Mat3` is pooled, this does
         * not create a new instance.
         */
        mat3(): Mat3;

        /**
         * Returns a `Mat4` object. If an unused object of `Vec3` is pooled, this does
         * not create a new instance.
         */
        mat4(): Mat4;

        /**
         * Returns a `Quat` object. If an unused object of `Quat` is pooled, this does
         * not create a new instance.
         */
        quat(): Quat;

        /**
         * Disposes an object got from `Pool.vec3`, `Pool.mat3`, `Pool.mat4`, or `Pool.quat`.
         */
        dispose(vec3?: Vec3, mat3?: Mat3, mat4?: Mat4, quat?: Quat);

        /**
         * Disposes an `Vec3` object got from `Pool.vec3`.
         */
        disposeVec3(v: Vec3);

        /**
         * Disposes an `Mat3` object got from `Pool.mat3`.
         */
        disposeMat3(m: Mat3);

        /**
         * Disposes an `Mat4` object got from `Pool.mat4`.
         */
        disposeMat4(m: Mat4);

        /**
         * Disposes an `Quat` object got from `Pool.quat`.
         */
        disposeQuat(q: Quat);

    }

}



declare module OIMO {

    /**
     * Setting provides advenced parameters used by the physics simulation.
     */
    export class Setting {

        static defaultFriction: number;

        /**
         * default shape parameter
         */
        static defaultRestitution: number;

        static defaultDensity: number;

        static defaultCollisionGroup: number;

        static defaultCollisionMask: number;

        static maxTranslationPerStep: number;

        /**
         * velocity limitation
         */
        static maxRotationPerStep: number;

        static bvhProxyPadding: number;

        /**
         * dynamic BV
         */
        static bvhIncrementalCollisionThreshold: number;

        static defaultGJKMargin: number;

        /**
         * GJK/EP
         */
        static enableGJKCaching: boolean;

        static maxEPAVertices: number;

        static maxEPAPolyhedronFaces: number;

        static contactEnableBounceThreshold: number;

        /**
         * general constraint
         */
        static velocityBaumgarte: number;

        static positionSplitImpulseBaumgarte: number;

        static positionNgsBaumgarte: number;

        static contactUseAlternativePositionCorrectionAlgorithmDepthThreshold: number;

        /**
         * contact
         */
        static defaultContactPositionCorrectionAlgorithm: number;

        static alternativeContactPositionCorrectionAlgorithm: number;

        static contactPersistenceThreshold: number;

        static maxManifoldPoints: number;

        static defaultJointConstraintSolverType: number;

        /**
         * joint
         */
        static defaultJointPositionCorrectionAlgorithm: number;

        static jointWarmStartingFactorForBaungarte: number;

        static jointWarmStartingFactor: number;

        static minSpringDamperDampingRatio: number;

        static minRagdollMaxSwingAngle: number;

        static maxJacobianRows: number;

        static directMlcpSolverEps: number;

        /**
         * direct MLCP solve
         */
        static islandInitialRigidBodyArraySize: number;

        /**
         * island
         */
        static islandInitialConstraintArraySize: number;

        static sleepingVelocityThreshold: number;

        /**
         * sleepin
         */
        static sleepingAngularVelocityThreshold: number;

        static sleepingTimeThreshold: number;

        static disableSleeping: boolean;

        static linearSlop: number;

        /**
         * slop
         */
        static angularSlop: number;

    }

}

declare module OIMO {

    /**
     * Transform class provides a set of translation and rotation.
     */
    export class Transform {

        _position: Vec3;

        _rotation: Mat3;

        /**
         * Creates a new identical transform.
         */
        constructor();

        /**
         * Sets the transformation to identity and returns `this`.
         */
        identity(): Transform;

        /**
         * Returns the position of the transformation.
         */
        getPosition(): Vec3;

        /**
         * Sets `position` to the position of the transformation.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getPositionTo(position: Vec3);

        /**
         * Sets the position of the transformation to `position` and returns `this`.
         */
        setPosition(position: Vec3): Transform;

        /**
         * Translates the position by `translation`.
         */
        translate(translation: Vec3);

        /**
         * Returns the rotation matrix.
         */
        getRotation(): Mat3;

        /**
         * Sets `out` to the rotation matrix.
         * 
         * This does not create a new instance of `Mat3`.
         */
        getRotationTo(out: Mat3);

        /**
         * Sets the rotation matrix to `rotation` and returns `this`.
         */
        setRotation(rotation: Mat3): Transform;

        /**
         * Sets the rotation by Euler angles `eulerAngles` in radians.
         */
        setRotationXyz(eulerAngles: Vec3);


        /**
         * Applies rotation by the rotation matrix `rotation`.
         */
        rotate(rotation: Mat3);

        /**
         * Applies the rotation by Euler angles `eulerAngles` in radians.
         */
        rotateXyz(eulerAngles: Vec3);

        /**
         * Returns the rotation as a quaternion.
         */
        getOrientation(): Quat;


        /**
         * Sets `orientation` to the quaternion representing the rotation.
         * 
         * This does not create a new instance of `Quat`.
         */
        getOrientationTo(orientation: Quat);

        /**
         * Sets the rotation from a quaternion `quaternion` and returns `this`.
         */
        setOrientation(quaternion: Quat): Transform;

        /**
         * Returns a clone of the transformation.
         */
        clone(): Transform;

        /**
         * Sets the transformation to `transform` and returns `this`.
         */
        copyFrom(transform: Transform): Transform;

    }

}

declare module OIMO {

    /**
     * using M; // mixing it in causes errors :
     * 3D vector class.
     */
    export class Vec3 {

        /**
         * The number of instance creation.
         */
        static numCreations: number;

        /**
         * The x-value of the vector.
         */
        x: number;

        /**
         * The y-value of the vector.
         */
        y: number;

        /**
         * The z-value of the vector.
         */
        z: number;

        /**
         * Creates a new vector. The vector is zero vector by default.
         */
        constructor(x?: number, y?: number, z?: number);

        /**
         * Sets all values at once and returns `this`.
         */
        init(x: number, y: number, z: number): Vec3;

        /**
         * Sets this vector to zero vector and returns `this`.
         */
        zero(): Vec3;

        /**
         * Returns `this` + `v`.
         */
        add(v: Vec3): Vec3;

        /**
         * Returns `this` + `v` * `s`.
         */
        addScaled(v: Vec3, s: number): Vec3;

        /**
         * Returns `this` - `v`.
         */
        sub(v: Vec3): Vec3;

        /**
         * Returns `this` * `s`.
         */
        scale(s: number): Vec3;

        /**
         * Returns (`this.x` * `sx`, `this.y` * `sy`, `this.z` * `sz`).
         */
        scale3(sx: number, sy: number, sz: number): Vec3;

        /**
         * Returns the dot product of `this` and `v`.
         */
        dot(v: Vec3): number;

        /**
         * Returns the cross product of `this` and `v`.
         */
        cross(v: Vec3): Vec3;

        /**
         * Sets this vector to `this` + `v` and returns `this`.
         */
        addEq(v: Vec3): Vec3;

        /**
         * Sets this vector to `this` + `v` * `s` and returns `this`.
         */
        addScaledEq(v: Vec3, s: number): Vec3;

        /**
         * Sets this vector to `this` - `v` and returns `this`.
         */
        subEq(v: Vec3): Vec3;

        /**
         * Sets this vector to `this` * `s` and returns `this`.
         */
        scaleEq(s: number): Vec3;

        /**
         * Sets this vector to (`this.x` * `sx`, `this.y` * `sy`, `this.z` * `sz`) and returns `this`.
         */
        scale3Eq(sx: number, sy: number, sz: number): Vec3;

        /**
         * Sets this vector to the cross product of `this` and `s`, and returns `this`.
         */
        crossEq(v: Vec3): Vec3;

        /**
         * Returns the transformed vector by `m`.
         */
        mulMat3(m: Mat3): Vec3;

        /**
         * Returns the transformed vector by `m`.
         */
        mulMat4(m: Mat4): Vec3;

        /**
         * Returns the transformed vector by `tf`.
         */
        mulTransform(tf: Transform): Vec3;

        /**
         * Sets this vector to the transformed vector by `m` and returns `this`.
         */
        mulMat3Eq(m: Mat3): Vec3;

        /**
         * Sets this vector to the transformed vector by `m` and returns `this`.
         */
        mulMat4Eq(m: Mat4): Vec3;

        /**
         * Sets this vector to the transformed vector by `tf` and returns `this`.
         */
        mulTransformEq(tf: Transform): Vec3;

        /**
         * Returns the length of the vector.
         */
        length(): number;

        /**
         * Returns the squared length of the vector.
         */
        lengthSq(): number;

        /**
         * Returns the normalized vector.
         * 
         * If the length is zero, zero vector is returned.
         */
        normalized(): Vec3;

        /**
         * Normalize this vector and returns `this`.
         * 
         * If the length is zero, this vector is set to zero vector.
         */
        normalize(): Vec3;

        /**
         * Returns the nagated vector.
         */
        negate(): Vec3;

        /**
         * Negate the vector and returns `this`.
         */
        negateEq(): Vec3;

        /**
         * Copies values from `v` and returns `this`.
         */
        copyFrom(v: Vec3): Vec3;

        /**
         * Returns a clone of the vector.
         */
        clone(): Vec3;

        /**
         * Returns the string representation of the vector.
         */
        toString(): string;

    }

}

declare module OIMO {

    /**
     * A contact is a cached pair of overlapping shapes in the physics world. contacts
     * are created by `ContactManager` when two AABBs of shapes begin overlapping.
     * 
     * As AABBs are larger than its shapes, shapes of a contact don't always
     * touching or colliding though their AABBs are overlapping.
     */
    export class Contact {

        /**
         * called from the contact manage
         * --- public --
         * Returns the first shape of the 
         */
        getShape1(): Shape;

        /**
         * Returns the second shape of the 
         */
        getShape2(): Shape;

        /**
         * Returns whether the shapes are touching.
         */
        isTouching(): boolean;

        /**
         * Returns the contact manifold.
         */
        getManifold(): Manifold;

        /**
         * Returns the contact 
         */
        getContactConstraint(): ContactConstraint;

        /**
         * Returns the previous contact in the world.
         * 
         * If the previous contact does not exist, `null` will be returned.
         */
        getPrev(): Contact;

        /**
         * Returns the next contact in the world.
         * 
         * If the next contact does not exist, `null` will be returned.
         */
        getNext(): Contact;

    }

}

declare module OIMO {

    /**
     * A contact link is used to build a constraint graph for clustering rigid bodies.
     * In a constraint graph, rigid bodies are nodes and constraints are edges.
     * See also `JointLink`.
     */
    export class ContactLink {

        _prev: ContactLink;

        _next: ContactLink;

        _contact: Contact;

        _other: RigidBody;

        constructor();

        /**
         * Returns the contact of the link.
         */
        getContact(): Contact;

        /**
         * Returns the other rigid body of the link. This provides a quick access from a
         * rigid body to the other one of the 
         */
        getOther(): RigidBody;

        /**
         * Returns the previous contact link in the rigid body.
         * 
         * If the previous one does not exist, `null` will be returned.
         */
        getPrev(): ContactLink;

        /**
         * Returns the next contact link in the rigid body.
         * 
         * If the next one does not exist, `null` will be returned.
         */
        getNext(): ContactLink;

    }

}

declare module OIMO {

    /**
     * The manager of the contacts in the physics world. A contact of two
     * shapes is created when the AABBs of them begin overlapping, and
     * is destroyed when they end overlapping.
     */
    export class ContactManager {

        _numContacts: number;

        _contactList: Contact;

        _contactListLast: Contact;

        _contactPool: Contact;

        _broadPhase: BroadPhase;

        _collisionMatrix: CollisionMatrix;

        constructor(broadPhase: BroadPhase);


    }

}

declare module OIMO {

    /**
     * Simulation island.
     */
    export class Island {

        gravity: Vec3;

        numRigidBodies: number;

        rigidBodies: Array<RigidBody>;

        numSolvers: number;

        /**
         * all the constraint solver
         */
        solvers: Array<ConstraintSolver>;

        numSolversSi: number;

        /**
         * the constraint solvers use split impulse for position par
         */
        solversSi: Array<ConstraintSolver>;

        numSolversNgs: number;

        /**
         * the constraint solvers use nonlinear Gauss-Seidel for position par
         */
        solversNgs: Array<ConstraintSolver>;

        constructor();



        /**
         * update velocit
         */
        _step(timeStep: TimeStep, numVelocityIterations: number, numPositionIterations: number);

    }

}

declare module OIMO {

    /**
     * Information of time-step sizes of the simulation.
     */
    export class TimeStep {

        /**
         * The time step of simulation.
         */
        dt: number;

        /**
         * The inverse time step of simulation, equivalent to simulation FPS.
         */
        invDt: number;

        /**
         * The ratio of time steps. Defined by current time step divided by previous
         * time step.
         */
        dtRatio: number;

        constructor();

    }

}

declare module OIMO {

    /**
     * The physics simulation world. This manages entire the dynamic simulation. You can add
     * rigid bodies and joints to the world to simulate them.
     */
    export class World {

        /**
         * Creates a new physics world, with broad-phase collision detection algorithm `broadPhaseType` and
         * gravitational acceleration `gravity`.
         */
        constructor(broadPhaseType?: number, gravity?: Vec3);

        /**
         * --- public --
         * Advances the simulation by the time step `timeStep`.
         */
        step(timeStep: number);

        /**
         * Adds the rigid body `rigidBody` to the simulation world.
         */
        addRigidBody(rigidBody: RigidBody);

        /**
         * then add the shapes to the worl
         * Removes the rigid body `rigidBody` from the simulation world.
         */
        removeRigidBody(rigidBody: RigidBody);

        /**
         * then remove the shapes from the worl
         * Adds the joint `joint` to the simulation world.
         */
        addJoint(joint: Joint);

        /**
         * Removes the joint `joint` from the simulation world.
         */
        removeJoint(joint: Joint);

        /**
         * Sets the debug draw interface to `debugDraw`. Call `World.debugDraw` to draw the simulation world.
         */
        setDebugDraw(debugDraw: DebugDraw);

        /**
         * Returns the debug draw interface.
         */
        getDebugDraw(): DebugDraw;

        /**
         * Draws the simulation world for debugging. Call `World.setDebugDraw` to set the debug draw interface.
         */
        debugDraw();


        /**
         * Performs a ray casting. `callback.process` is called for all shapes the ray
         * from `begin` to `end` hits.
         */
        rayCast(begin: Vec3, end: Vec3, callback: RayCastCallback);

        /**
         * Performs a convex casting. `callback.process` is called for all shapes the convex geometry
         * `convex` hits. The convex geometry translates by `translation` starting from the beginning
         * transform `begin`.
         */
        convexCast(convex: ConvexGeometry, begin: Transform, translation: Vec3, callback: RayCastCallback);

        /**
         * Performs an AABB query. `callback.process` is called for all shapes that their
         * AABB and `aabb` intersect.
         */
        aabbTest(aabb: Aabb, callback: AabbTestCallback);

        /**
         * Returns the list of the rigid bodies added to the world.
         */
        getRigidBodyList(): RigidBody;

        /**
         * Returns the list of the joints added to the world.
         */
        getJointList(): Joint;

        /**
         * Returns the broad-phase collision detection algorithm.
         */
        getBroadPhase(): BroadPhase;

        /**
         * Returns the contact manager.
         */
        getContactManager(): ContactManager;

        /**
         * Returns the number of the rigid bodies added to the world.
         */
        getNumRigidBodies(): number;

        /**
         * Returns the number of the joints added to the world.
         */
        getNumJoints(): number;

        /**
         * Returns the number of the shapes added to the world.
         */
        getNumShapes(): number;

        /**
         * Returns the number of simulation islands.
         */
        getNumIslands(): number;

        /**
         * Returns the number of velocity iterations of constraint solvers.
         */
        getNumVelocityIterations(): number;

        /**
         * Sets the number of velocity iterations of constraint solvers to `numVelocityIterations`.
         */
        setNumVelocityIterations(numVelocityIterations: number);

        /**
         * Returns the number of position iterations of constraint solvers.
         */
        getNumPositionIterations(): number;

        /**
         * Sets the number of position iterations of constraint solvers to `numPositionIterations`.
         */
        setNumPositionIterations(numPositionIterations: number);

        /**
         * Returns the gravitational acceleration of the simulation world.
         */
        getGravity(): Vec3;

        /**
         * Sets the gravitational acceleration of the simulation world to `gravity`.
         */
        setGravity(gravity: Vec3);

    }

    module World {

        export class RayCastWrapper extends BroadPhaseProxyCallback {

            /**
             * ray cast wrapper (broadphase -> world
             */
            callback: RayCastCallback;

            begin: Vec3;

            end: Vec3;

            rayCastHit: RayCastHit;

            constructor();

            process(proxy: Proxy);

            shape: Shape;

        }

        export class ConvexCastWrapper extends BroadPhaseProxyCallback {

            /**
             * convex cast wrapper (broadphase -> world
             */
            callback: RayCastCallback;

            begin: Transform;

            translation: Vec3;

            convex: ConvexGeometry;

            rayCastHit: RayCastHit;

            zero: Vec3;

            constructor();

            process(proxy: Proxy);

            shape: Shape;

            type: number;

            geom: ConvexGeometry;

        }

        export class AabbTestWrapper extends BroadPhaseProxyCallback {

            /**
             * aabb test wrapper (broadphase -> world
             */
            _callback: AabbTestCallback;

            _aabb: Aabb;

            constructor();

            process(proxy: Proxy);

            shape: Shape;

            shapeAabb: Aabb;

        }

    }

}

declare module OIMO {

    export class IQuat {

    }

}

declare module OIMO {

    /**
     * The axis-aligned bounding box.
     */
    export class Aabb {

        _min: Vec3;

        _max: Vec3;

        /**
         * Creates an empty AABB. Minimum and maximum points are set to zero.
         */
        constructor();

        /**
         * Sets the minimum and maximum point and returns `this`.
         * 
         * Equivallent to `setMin(min).setMax(max)`.
         */
        init(min: Vec3, max: Vec3): Aabb;

        /**
         * Returns the minimum point of the axis-aligned bounding box.
         */
        getMin(): Vec3;


        /**
         * Sets the minimum point of the axis-aligned bounding box to `min`.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getMinTo(min: Vec3);

        /**
         * Sets the minimum point of the axis-aligned bounding box to `min` and returns `this`.
         */
        setMin(min: Vec3): Aabb;

        /**
         * Returns the maximum point of the axis-aligned bounding box.
         */
        getMax(): Vec3;


        /**
         * Sets the maximum point of the axis-aligned bounding box to `max`.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getMaxTo(max: Vec3);

        /**
         * Sets the maximum point of the axis-aligned bounding box to `max` and returns `this`.
         */
        setMax(max: Vec3): Aabb;

        /**
         * Returns the center of the AABB.
         */
        getCenter(): Vec3;

        /**
         * Sets `center` to the center of the AABB.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getCenterTo(center: Vec3);

        /**
         * Returns the half extents of the AABB.
         */
        getExtents(): Vec3;

        /**
         * Sets `halfExtents` to the half extents of the AABB.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getExtentsTo(halfExtents: Vec3);

        /**
         * Combines `other` into this AABB and returns `this`.
         */
        combine(other: Aabb): Aabb;

        /**
         * Returns the combined aabb of `this` and `other`.
         */
        combined(other: Aabb): Aabb;

        /**
         * Returns whether `this` and `other` intersect.
         */
        overlap(other: Aabb): boolean;

        /**
         * Returns the intersection of `this` and `other`.
         */
        getIntersection(other: Aabb): Aabb;

        /**
         * Sets `intersection` to the intersection of `this` and `other`.
         * 
         * This does not create a new instance of `Aabb`.
         */
        getIntersectionTo(other: Aabb, intersection: Aabb);

        /**
         * Copies AABB from `aabb` to and returns `this`.
         */
        copyFrom(aabb: Aabb): Aabb;

        /**
         * Returns a clone of the AABB.
         */
        clone(): Aabb;
    }

}

declare module OIMO {

    /**
     * A box collision geometry.
     */
    export class BoxGeometry extends ConvexGeometry {

        _halfExtents: Vec3;

        _halfAxisX: Vec3;

        _halfAxisY: Vec3;

        _halfAxisZ: Vec3;

        /**
         * Creates a box collision geometry of half-extents `halfExtents`.
         */
        constructor(halfExtents: Vec3);

        minHalfExtents: number;

    }

}

declare module OIMO {

    /**
     * A capsule collision geometry aligned with the y-axis.
     */
    export class CapsuleGeometry extends ConvexGeometry {

        _radius: number;

        _halfHeight: number;

        /**
         * Creates a capsule collision geometry of radius `radius` and half-height `halfHeight`.
         */
        constructor(radius: number, halfHeight: number);

        /**
         * Returns the radius of the capsule.
         */
        getRadius(): number;

        /**
         * Returns the half-height of the capsule.
         */
        getHalfHeight(): number;

        _updateMass();

        r2: number;

        hh2: number;

        cylinderVolume: number;

        sphereVolume: number;

        invVolume: number;

        inertiaY: number;

        inertiaXZ: number;

        _computeAabb(aabb: Aabb, tf: Transform);

        radVec: Vec3;

        axis: Vec3;

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

        _rayCastLocal(begin: Vec3, end: Vec3, hit: RayCastHit): boolean;

        p1x: number;

        p1y: number;

        p1z: number;

        p2x: number;

        p2y: number;

        p2z: number;

        halfH: number;

        dx: number;

        dy: number;

        dz: number;

        tminxz: number;

        /**
         * X
         */
        tmaxxz: number;

        a: number;

        b: number;

        c: number;

        D: number;

        sqrtD: number;

        crossY: number;

        min: number;

        /**
         * hit: sid
         */
        sphereY: number;

    }

}

declare module OIMO {

    /**
     * Abstract class of the convex collision geometries supported by GJK/EPA collision detection.
     */
    export class ConvexGeometry extends Geometry {

        _gjkMargin: number;

        /**
         * TODO: divide margin into "inner" margin and "outer" margi
         */
        _useGjkRayCast: boolean;

        constructor(type: number);

        /**
         * Returns the GJK mergin around the "core" of the convex geometry.
         */
        getGjkMergin(): number;

        /**
         * Sets the GJK mergin around the "core" to `gjkMergin`.
         */
        setGjkMergin(gjkMergin: number);

    }

}

declare module OIMO {

    /**
     * A cone collision geometry aligned with the y-axis.
     */
    export class ConeGeometry extends ConvexGeometry {

        _radius: number;

        _halfHeight: number;

        sinTheta: number;

        cosTheta: number;

        /**
         * Creates a cone collision geometry of radius `radius` and half-height `halfHeight`.
         */
        constructor(radius: number, halfHeight: number);

        /**
         * Returns the radius of the cone.
         */
        getRadius(): number;

        /**
         * Returns the half-height of the cone.
         */
        getHalfHeight(): number;

        _updateMass();

        r2: number;

        h2: number;

        _computeAabb(aabb: Aabb, tf: Transform);

        axis: Vec3;

        axis2: Vec3;

        eh: Vec3;

        er: Vec3;

        axis2x: number;

        axis2y: number;

        axis2z: number;

        rmin: Vec3;

        rmax: Vec3;

        /**
         * -(signed projected axis) - (projected radius
         * -(signed projected axis) + (projected radius
         */
        max: Vec3;

        min: Vec3;

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

        dx: number;

        dy: number;

        dz: number;

    }

}

declare module OIMO {

    /**
     * A convex hull collision geometry. A convex hull of the vertices is the smallest convex
     * polyhedron which contains all vertices.
     */
    export class ConvexHullGeometry extends ConvexGeometry {

        _vertices: Array<Vec3>;

        _tmpVertices: Array<Vec3>;

        _numVertices: number;

        /**
         * for internal us
         * Creates a convex hull collision geometry of the vertices `vertices`.
         */
        constructor(vertices: Array<Vec3>);

        /**
         * Returns the vertices of the convex hull.
         */
        getVertices(): Array<Vec3>;

        _updateMass();

        minx: number;

        miny: number;

        minz: number;

        maxx: number;

        maxy: number;

        maxz: number;

        vx: number;

        vy: number;

        vz: number;

        sizex: number;

        sizey: number;

        sizez: number;

        diffCog: number;

        /**
         * (size / 2) ^
         */
        _computeAabb(aabb: Aabb, tf: Transform);

        min: Vec3;

        max: Vec3;

        margin: Vec3;

        localV: Vec3;

        worldV: Vec3;

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

        maxDot: number;

        maxIndex: number;

        dot: number;

    }

}

declare module OIMO {

    /**
     * A cylinder collision geometry aligned with the y-axis.
     */
    export class CylinderGeometry extends ConvexGeometry {

        _radius: number;

        _halfHeight: number;

        /**
         * Creates a cylinder collision geometry of radius `radius` and half-height `halfHeight`.
         */
        constructor(radius: number, halfHeight: number);

        /**
         * Returns the radius of the cylinder.
         */
        getRadius(): number;

        /**
         * Returns the half-height of the cylinder.
         */
        getHalfHeight(): number;

        _updateMass();

        r2: number;

        h2: number;

        _computeAabb(aabb: Aabb, tf: Transform);

        axis: Vec3;

        axis2: Vec3;

        eh: Vec3;

        er: Vec3;

        axis2x: number;

        axis2y: number;

        axis2z: number;

        max: Vec3;

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

        rx: number;

        rz: number;

        len: number;

        coreRadius: number;

        coreHeight: number;

        _rayCastLocal(begin: Vec3, end: Vec3, hit: RayCastHit): boolean;

        p1x: number;

        p1y: number;

        p1z: number;

        p2x: number;

        p2y: number;

        p2z: number;

        halfH: number;

        dx: number;

        dy: number;

        dz: number;

        tminy: number;

        tmaxy: number;

        tmp: number;

        /**
         * X
         */
        min: number;

    }

}

declare module OIMO {

    /**
     * Abstract collision geometry.
     */
    export class Geometry {
        /**
         * --- public --
         * Returns the type of the collision geometry.
         * 
         * See `GeometryType` for details.
         */
        getType(): number;

        /**
         * Returns the volume of the collision geometry.
         */
        getVolume(): number;

        /**
         * Performs ray casting. Returns `true` and sets the result information to `hit` if
         * the line segment from `begin` to `end` and the geometry transformed by `transform`
         * intersect. Returns `false` if the line segment and the geometry do not intersect.
         */
        rayCast(begin: Vec3, end: Vec3, transform: Transform, hit: RayCastHit): boolean;

        beginLocal: Vec3;

        endLocal: Vec3;

        localPos: Vec3;

        localNormal: Vec3;

    }

}

declare module OIMO {

    /**
     * The list of collision geometry types.
     */
    export class GeometryType {

        static _SPHERE: number;

        static _BOX: number;

        static _CYLINDER: number;

        static _CONE: number;

        static _CAPSULE: number;

        static _CONVEX_HULL: number;

        static _CONVEX_MIN: number;

        static _CONVEX_MAX: number;

        /**
         * Represents a sphere collision geometry.
         * 
         * See `SphereGeometry`.
         */
        static SPHERE: number;

        /**
         * Represents a box collision geometry.
         * 
         * See `BoxGeometry`.
         */
        static BOX: number;

        /**
         * Represents a cylinder collision geometry.
         * 
         * See `CylinderGeometry`.
         */
        static CYLINDER: number;

        /**
         * Represents a cone collision geometry.
         * 
         * See `ConeGeometry`.
         */
        static CONE: number;

        /**
         * Represents a capsule collision geometry.
         * 
         * See `CapsuleGeometry`.
         */
        static CAPSULE: number;

        /**
         * Represents a convex hull collision geometry.
         * 
         * See `ConvexHullGeometry`.
         */
        static CONVEX_HULL: number;

    }

}

declare module OIMO {

    /**
     * A sphere collision geometry.
     */
    export class SphereGeometry extends ConvexGeometry {

        _radius: number;

        /**
         * Creates a sphere collision geometry of radius `radius`.
         */
        constructor(radius: number);

        /**
         * Returns the radius of the sphere.
         */
        getRadius(): number;

        _updateMass();

        _computeAabb(aabb: Aabb, tf: Transform);

        radVec: Vec3;

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

        _rayCastLocal(begin: Vec3, end: Vec3, hit: RayCastHit): boolean;

        d: Vec3;

        a: number;

        b: number;

        c: number;

        D: number;

    }

}

declare module OIMO {

    /**
     * A single ray cast hit data.
     */
    export class RayCastHit {

        /**
         * The position the ray hit at.
         */
        position: Vec3;

        /**
         * The normal vector of the surface the ray hit.
         */
        normal: Vec3;

        /**
         * The ratio of the position the ray hit from the start point to the end point.
         */
        fraction: number;

        /**
         * Default constructor.
         */
        constructor();

    }

}

declare module OIMO {

    /**
     * The abstract class of a broad-phase collision detection algorithm.
     */
    export class BroadPhase {


        identity: Transform;

        zero: Vec3;

        rayCastHit: RayCastHit;

        constructor(type: number);

        pp: ProxyPair;

        p: ProxyPair;

        gjkEpa: GjkEpa;

    }


    /**
     * --- public --
     * Returns a new proxy connected with the user data `userData` containing the axis-aligned
     * bounding box `aabb`, and adds the proxy into the collision space.
     * Removes the proxy `proxy` from the collision space.
     * Moves the proxy `proxy` to the axis-aligned bounding box `aabb`. `displacement` is the
     * difference between current and previous center of the AABB. This is used for predicting
     * movement of the proxy.
     * Returns whether the pair of `proxy1` and `proxy2` is overlapping. As proxies can be larger
     * than the containing AABBs, two proxies may overlap even though their inner AABBs are separate.
     * Collects overlapping pairs of the proxies and put them into a linked list. The linked list
     * can be get through `BroadPhase.getProxyPairList` method.
     * 
     * Note that in order to collect pairs, the broad-phase algorithm requires to be informed of
     * movements of proxies through `BroadPhase.moveProxy` method.
     * Returns the linked list of collected pairs of proxies.
     * Returns whether to collect only pairs created in the last step. If this returns
     * true, the pairs that are not collected might still be overlapping. Otherwise, such
     * pairs are guaranteed to be separated.
     * Returns the number of broad-phase AABB tests.
     * Performs a ray casting. `callback.process` is called for all proxies the line segment
     * from `begin` to `end` intersects.
     * Performs a convex casting. `callback.process` is called for all shapes the convex geometry
     * `convex` hits. The convex geometry translates by `translation` starting from the beginning
     * transform `begin`.
     * Performs an AABB query. `callback.process` is called for all proxies that their AABB
     * and `aabb` intersect.
     */
    export class AabbGeometry extends ConvexGeometry {

        min: Vec3;

        max: Vec3;

        constructor();

        computeLocalSupportingVertex(dir: Vec3, out: Vec3);

    }



}

declare module OIMO {

    /**
     * A callback class for queries in a broad phase.
     */
    export class BroadPhaseProxyCallback {

        /**
         * Default constructor.
         */
        constructor();

        /**
         * This is called every time a broad phase algorithm reports a proxy `proxy`.
         */
        process(proxy: Proxy);

    }

}

declare module OIMO {

    /**
     * Types of broad-phase algorithms.
     */
    export class BroadPhaseType {

        static _BRUTE_FORCE: number;

        static _BVH: number;

        /**
         * The brute force algorithm searches all the possible pairs of the proxies every time.
         * This is **very slow** and so users should not choose this algorithm without exceptional reasons.
         */
        static BRUTE_FORCE: number;

        /**
         * The BVH algorithm uses bounding volume hierarchy for detecting overlapping pairs of proxies efficiently.
         */
        static BVH: number;

    }

}

declare module OIMO {

    /**
     * A proxy is an object that can be added to a broad-phase collision detection algorithm.
     * Users of the collision part of the library can move an axis-aligned bounding box of
     * a proxy through `BroadPhase` class.
     */
    export class Proxy {

        _prev: Proxy;

        _next: Proxy;

        _aabbMin: Vec3;

        /**
         * fattened aab
         */
        _aabbMax: Vec3;

        _id: number;

        /**
         * Extra field that users can use for their own purposes. **Do not modify this property if
         * you use the physics part of the library**, as the physics part of the library uses this property
         * for connecting proxies and shapes of rigid bodies.
         */
        userData: any;

        constructor(userData: any, id: number);


        /**
         * --- public --
         * Returns the unique id of the proxy.
         */
        getId(): number;

        /**
         * Returns the fat AABB of the proxy.
         */
        getFatAabb(): Aabb;

        aabb: Aabb;

        /**
         * Sets `aabb` to the fat AABB of the proxy.
         * 
         * This does not create a new instance of `Aabb`.
         */
        getFatAabbTo(aabb: Aabb);

    }

}

declare module OIMO {

    /**
     * A pair between two proxies. Broad-phase collision algorithms collect pairs of proxies
     * as linked list of ProxyPair.
     */
    export class ProxyPair {

        _next: ProxyPair;

        _p1: Proxy;

        _p2: Proxy;

        constructor();

        /**
         * --- public --
         * Returns the first proxy of the pair.
         */
        getProxy1(): Proxy;

        /**
         * Returns the second proxy of the pair.
         */
        getProxy2(): Proxy;

        /**
         * Returns the next pair.
         */
        getNext(): ProxyPair;

    }

}

declare module OIMO {

    /**
     * CollisionMatrix provides corresponding collision detector for a pair of
     * two geometries of given types.
     */
    export class CollisionMatrix {

        detectors: Array<Array<Detector>>;

        constructor();

        gjkEpaDetector: GjkEpaDetector;

        sp: number;

        bo: number;

        cy: number;

        co: number;

        ca: number;

        ch: number;

        /**
         * --- public --
         * Returns an appropriate collision detector of two geometries of types `geomType1` and `geomType2`.
         * 
         * This method is **not symmetric**, so `getDetector(a, b)` may not be equal to `getDetector(b, a)`.
         */
        getDetector(geomType1: number, geomType2: number): Detector;

    }

}

declare module OIMO {

    /**
     * The result of narrow-phase collision detection. This is used for generating contact
     * points of a contact constraint at once or incrementally.
     */
    export class DetectorResult {

        /**
         * The number of the result points.
         */
        numPoints: number;

        /**
         * The result points. Note that **only the first `DetectorResult.numPoints` points are
         * computed by the collision detector**.
         */
        points: Array<DetectorResultPoint>;

        /**
         * The normal vector of the contact plane.
         */
        normal: Vec3;

        /**
         * Whether the result points are to be used for incremental menifold update.
         */
        incremental: boolean;

        /**
         * for GJK/EPA detecto
         * Default constructor.
         */
        constructor();

        /**
         * --- public --
         * Returns the maximum depth of the result points. Returns `0.0` if no result
         * points are available.
         */
        getMaxDepth(): number;

        max: number;

        /**
         * Cleans up the result data.
         */
        clear();

    }

}

declare module OIMO {

    /**
     * The result point is a pair of the closest points of collision geometries
     * detected by a collision  This holds relative closest points for
     * each collision geometry and the amount of the overlap.
     */
    export class DetectorResultPoint {

        /**
         * The first collision geometry's closest point.
         */
        position1: Vec3;

        /**
         * The second collision geometry's closest point.
         */
        position2: Vec3;

        /**
         * The amount of the overlap. This becomes negative if two geometries are
         * separate.
         */
        depth: number;

        /**
         * The identification of the result point.
         */
        id: number;

        constructor();

    }

}

declare module OIMO {

    /**
     * The interface of debug drawer. This provides graphical information of a physics world
     * for debugging softwares. Users should override at least three methods `DebugDraw.point`,
     * `DebugDraw.triangle`, `DebugDraw.line`.
     */
    export class DebugDraw {

        /**
         * Whether the shapes are drawn in wireframe mode.
         */
        wireframe: boolean;

        /**
         * Whether to draw the shapes.
         */
        drawShapes: boolean;

        /**
         * Whether to draw the bounding volume hierarchy of the broad-phase collision
         * detection. If `BvhBroadPhase` is not used, nothing will be drawn regardless
         * of the value of this parameter.
         */
        drawBvh: boolean;

        /**
         * The minimum depth of the BVH to be drawn. If `DebugDrawer.drawBvh` is set to
         * `false`, the entire BVH will not be drawn.
         */
        drawBvhMinLevel: number;

        /**
         * The maximum depth of the BVH to be drawn. If `DebugDrawer.drawBvh` is set to
         * `false`, the entire BVH will not be drawn.
         */
        drawBvhMaxLevel: number;

        /**
         * Whether to draw the AABBs.
         */
        drawAabbs: boolean;

        /**
         * Whether to draw the bases of the rigid bodies.
         */
        drawBases: boolean;

        /**
         * Whether to draw the overlapping pairs of the AABBs.
         */
        drawPairs: boolean;

        /**
         * Whether to draw the contacts.
         */
        drawContacts: boolean;

        /**
         * Whether to draw the bases (normals, tangents, and binormals) of the contacts.
         */
        drawContactBases: boolean;

        /**
         * Whether to draw the joints.
         */
        drawJoints: boolean;

        /**
         * Whether to draw the limits of the joints.
         */
        drawJointLimits: boolean;

        /**
         * The rendering style of the debug draw.
         */
        style: DebugDrawStyle;

        p: Pool;

        sphereCoords: Array<Array<Vec3>>;

        tmpSphereVerts: Array<Array<Vec3>>;

        tmpSphereNorms: Array<Array<Vec3>>;

        circleCoords: Array<Vec3>;

        circleCoordsShift: Array<Vec3>;

        tmpCircleVerts1: Array<Vec3>;

        tmpCircleVerts2: Array<Vec3>;

        tmpCircleNorms: Array<Vec3>;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * --- private --
         */
        vec3(): any;

        mat3(): any;

        mat4(): any;

        quat(): any;

        disp(obj: any): any;

        cartesianCoord(origin: any, x: any, y: any, z: any, cx: any, cy: any, cz: any): any;

        cartesianCoord2D(origin: any, x: any, y: any, cx: any, cy: any): any;

        cartesianCoord1D(origin: any, x: any, cx: any): any;

        /**
         * --- public --
         * Draws an axis-aligned bounding box.
         * 
         * `min` is the minimum point of the AABB.
         * 
         * `max` is the maximum point of the AABB.
         * 
         * `color` is the color of the AABB.
         */
        aabb(min: Vec3, max: Vec3, color: Vec3);


        /**
         * Draws the basis of a transform `transform`.
         * 
         * `length` is the length of the lines to be drawn.
         * 
         * `colorX` is the color of the x-axis of the basis.
         * 
         * `colorY` is the color of the y-axis of the basis.
         * 
         * `colorZ` is the color of the z-axis of the basis.
         */
        basis(transform: Transform, length: number, colorX: Vec3, colorY: Vec3, colorZ: Vec3);


        /**
         * Draws an ellipse.
         * 
         * `center` is the center of the ellipse.
         * 
         * `ex` is the normalized x-axis vector of the ellipse.
         * 
         * `ey` is the normalized y-axis vector of the ellipse.
         * 
         * `radiusX` is the radius along the x-axis of the ellipse.
         * 
         * `radiusY` is the radius along the y-axis of the ellipse.
         * 
         * `color` is the color of the ellipse.
         */
        ellipse(center: Vec3, ex: Vec3, ey: Vec3, radiusX: number, radiusY: number, color: Vec3);

        /**
         * Draws an arc.
         * 
         * `center` is the center of the arc.
         * 
         * `ex` is the normalized x-axis vector of the arc.
         * 
         * `ey` is the normalized y-axis vector of the arc.
         * 
         * `radiusX` is the radius along the x-axis of the arc.
         * 
         * `radiusY` is the radius along the y-axis of the arc.
         * 
         * `startAngle` is the start angle of the arc in radians.
         * 
         * `endAngle` is the end angle of the arc in radians.
         * 
         * `drawSector` is whether to draw line segments between start/end point and center point.
         * 
         * `color` is the color of the arc.
         */
        arc(center: Vec3, ex: Vec3, ey: Vec3, radiusX: number, radiusY: number, startAngle: number, endAngle: number, drawSector: boolean, color: Vec3);


        /**
         * sid
         * Draws a sphere.
         * 
         * `tf` is the transformation of the sphere.
         * 
         * `radius` is the radius of the sphere.
         * 
         * `color` is the color of the sphere.
         */
        sphere(tf: Transform, radius: number, color: Vec3);

        /**
         * to
         * botto
         * middl
         * Draws a box.
         * 
         * `tf` is the transformation of the box.
         * 
         * `halfExtents` is the half-extents of the box.
         * 
         * `color` is the color of the box.
         */
        box(tf: Transform, halfExtents: Vec3, color: Vec3);



        /**
         * x
         * x
         * y
         * y
         * z
         * z
         * Draws a rectangle.
         * 
         * `v1`, `v2`, `v3`, `v4` are the rectangle's vertices in CCW order.
         * 
         * `n1`, `n2`, `n3`, `n4` are the normals of the rectangle's vertices in CCW order.
         * 
         * `color` is the color of the rectangle.
         */
        rect(v1: Vec3, v2: Vec3, v3: Vec3, v4: Vec3, n1: Vec3, n2: Vec3, n3: Vec3, n4: Vec3, color: Vec3);

        /**
         * Draws a point at `v`.
         * 
         * `color` is the color of the point.
         */
        point(v: Vec3, color: Vec3);

        /**
         * override thi
         * Draws a triangle.
         * 
         * `v1`, `v2`, `v3` are the triangle's vertices in CCW order.
         * 
         * `n1`, `n2`, `n3` are the normals of the triangle's vertices in CCW order.
         * 
         * `color` is the color of the triangle.
         */
        triangle(v1: Vec3, v2: Vec3, v3: Vec3, n1: Vec3, n2: Vec3, n3: Vec3, color: Vec3);

        /**
         * override thi
         * Draws a line segment between `v1` and `v2`.
         * 
         * `color` is the color of the line segment.
         */
        line(v1: Vec3, v2: Vec3, color: Vec3);

    }

}

declare module OIMO {

    /**
     * Style settings of the debug draw.
     */
    export class DebugDrawStyle {

        shapeColor1: Vec3;

        shapeColor2: Vec3;

        sleepyShapeColor1: Vec3;

        sleepyShapeColor2: Vec3;

        sleepingShapeColor1: Vec3;

        sleepingShapeColor2: Vec3;

        staticShapeColor: Vec3;

        kinematicShapeColor: Vec3;

        aabbColor: Vec3;

        bvhNodeColor: Vec3;

        pairColor: Vec3;

        contactColor: Vec3;

        contactColor2: Vec3;

        contactColor3: Vec3;

        contactColor4: Vec3;

        newContactColor: Vec3;

        disabledContactColor: Vec3;

        contactNormalColor: Vec3;

        contactTangentColor: Vec3;

        contactBinormalColor: Vec3;

        contactNormalLength: number;

        contactTangentLength: number;

        contactBinormalLength: number;

        jointLineColor: Vec3;

        jointErrorColor: Vec3;

        jointRotationalConstraintRadius: number;

        basisLength: number;

        basisColorX: Vec3;

        basisColorY: Vec3;

        basisColorZ: Vec3;

        /**
         * Default constructor.
         */
        constructor();

    }

}

declare module OIMO {

    /**
     * Performance
     */
    export class Performance {

        static broadPhaseCollisionTime: number;

        static narrowPhaseCollisionTime: number;

        static dynamicsTime: number;

        static totalTime: number;

    }

}

declare module OIMO {

    /**
     * A callback interface for aabb tests in a world.
     */
    export class AabbTestCallback {

        /**
         * Default constructor.
         */
        constructor();

        /**
         * This is called every time the world detects a shape `shape` that
         * the query aabb intersects.
         */
        process(shape: Shape);

    }

}

declare module OIMO {

    /**
     * A callback class for contact events. Contact events between two shapes
     * will occur in following order:
     * 
     * 1. `beginContact`
     * 1. `preSolve` (before velocity update)
     * 1. `postSolve` (after velocity update)
     * 1. (repeats 2. and 3. every frame while the shapes are touching)
     * 1. `endContact`
     */
    export class ContactCallback {

        /**
         * Default constructor.
         */
        constructor();

        /**
         * This is called when two shapes start touching each other. `c` is the contact of
         * the two shapes.
         */
        beginContact(c: Contact);

        /**
         * This is called every frame **before** velocity solver iterations while two shapes
         * are touching. `c` is the contact for the two shapes.
         */
        preSolve(c: Contact);

        /**
         * This is called every frame **after** velocity solver iterations while two shapes
         * are touching. `c` is the contact for the two shapes.
         */
        postSolve(c: Contact);

        /**
         * This is called when two shapes end touching each other. `c` is the contact of
         * the two shapes.
         */
        endContact(c: Contact);

    }

}

declare module OIMO {

    /**
     * A callback class for ray casts in a world.
     */
    export class RayCastCallback {

        /**
         * Default constructor.
         */
        constructor();

        /**
         * This is called every time the world detects a shape `shape` that
         * the ray intersects with the hit data `hit`.
         */
        process(shape: Shape, hit: RayCastHit);

    }

}

declare module OIMO {

    /**
     * A ray cast callback implementation that keeps only the closest hit data.
     * This is reusable, but make sure to clear the old result by calling
     * `RayCastClosest.clear` if used once or more before.
     */
    export class RayCastClosest extends RayCastCallback {

        /**
         * The shape the ray hit.
         */
        shape: Shape;

        /**
         * The position the ray hit at.
         */
        position: Vec3;

        /**
         * The normal vector of the surface the ray hit.
         */
        normal: Vec3;

        /**
         * The ratio of the position the ray hit from the start point to the end point.
         */
        fraction: number;

        /**
         * Whether the ray hit any shape in the world.
         */
        hit: boolean;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Clears the result data.
         */
        clear();

        process(shape: Shape, hit: RayCastHit);

    }

}

declare module OIMO {

    /**
     * The base class of all constarint solvers.
     */
    export class ConstraintSolver {

        _b1: RigidBody;

        _b2: RigidBody;

        _addedToIsland: boolean;

        constructor();

        /**
         * Prepares for velocity iteration. Time step information `timeStep` is given for
         * computing time-depending data.
         */
        preSolveVelocity(timeStep: TimeStep);

        /**
         * Applies initial impulses.
         */
        warmStart(timeStep: TimeStep);

        /**
         * Performs single velocity iteration.
         */
        solveVelocity();

        /**
         * Performs post-processes of velocity part. Time step information `timeStep` is given
         * for computing time-depending data.
         */
        postSolveVelocity(timeStep: TimeStep);

        /**
         * Prepares for position iteration (split impulse or nonlinear Gauss-Seidel). Time step
         * information `timeStep` is given for computing time-depending data.
         * 
         * This may not be called depending on position correction algorithm.
         */
        preSolvePosition(timeStep: TimeStep);

        /**
         * Performs single position iteration (split impulse)
         */
        solvePositionSplitImpulse();

        /**
         * Performs single position iteration (nonlinear Gauss-Seidel)
         */
        solvePositionNgs(timeStep: TimeStep);

        /**
         * Performs post-processes.
         */
        postSolve();

    }

}

declare module OIMO {

    /**
     * The list of the algorithms for position corretion.
     */
    export class PositionCorrectionAlgorithm {

        static _BAUMGARTE: number;

        static _SPLIT_IMPULSE: number;

        static _NGS: number;

        /**
         * Baumgarte stabilizaiton. Fastest but introduces extra energy.
         */
        static BAUMGARTE: number;

        /**
         * Use split impulse and pseudo velocity. Fast enough and does not introduce extra
         * energy, but somewhat unstable, especially for joints.
         */
        static SPLIT_IMPULSE: number;

        /**
         * Nonlinear Gauss-Seidel method. Slow but stable.
         */
        static NGS: number;

    }

}

declare module OIMO {

    /**
     * This class holds mass and moment of inertia for a rigid body.
     */
    export class MassData {

        /**
         * Mass. `0` for a non-dynamic rigid body.
         */
        mass: number;

        /**
         * Inertia tensor in local space. Zero matrix for a non-dynamic rigid body.
         */
        localInertia: Mat3;

        /**
         * Default constructor.
         */
        constructor();

    }

}

declare module OIMO {

    /**
     * A rigid body. To add a rigid body to a physics world, create a `RigidBody`
     * instance, create and add shapes via `RigidBody.addShape`, and add the rigid
     * body to the physics world through `World.addRigidBody`. Rigid bodies have
     * three motion types: dynamic, static, and kinematic. See `RigidBodyType` for
     * details of motion types.
     */
    export class RigidBody {

        /**
         * Extra field that users can use for their own purposes.
         */
        userData: any;

        /**
         * Creates a new rigid body by configuration `config`.
         */
        constructor(config: RigidBodyConfig);

        /**
	 * Returns the world position of the rigid body.
	 */
        public getPosition(): Vec3;

        /**
         * Sets `position` to the world position of the rigid body.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getPositionTo(position: Vec3);

        /**
         * Sets the world position of the rigid body to `position`.
         */
        public setPosition(position: Vec3);

        /**
         * Translates the position of the rigid body by `translation`.
         */
        public translate(translation: Vec3);

        /**
         * Returns the rotation matrix of the rigid body.
         */
        public getRotation(): Mat3;

        /**
         * Sets `rotation` to the rotation matrix of the rigid body.
         *
         * This does not create a new instance of `Mat3`.
         */
        public getRotationTo(rotation: Mat3);

        /**
         * Sets the rotation matrix of the rigid body to `rotation`.
         */
        public setRotation(rotation: Mat3);

        /**
         * Sets the rotation of the rigid body by Euler angles `eulerAngles` in radians.
         */
        public setRotationXyz(eulerAngles: Vec3);

        /**
         * Rotates the rigid body by the rotation matrix `rotation`.
         */
        public rotate(rotation: Mat3);
        /**
         * Rotates the rigid body by Euler angles `eulerAngles` in radians.
         */
        public rotateXyz(eulerAngles: Vec3);

        /**
         * Returns the rotation of the rigid body as a quaternion.
         */
        public getOrientation(): Quat;

        /**
         * Sets `orientation` to the rotation quaternion of the rigid body.
         *
         * This does not create a new instance of `Quat`.
         */
        public getOrientationTo(orientation: Quat);

        /**
         * Sets the rotation of the rigid body from a quaternion `quaternion`.
         */
        public setOrientation(quaternion: Quat);

        /**
         * Returns the transform of the rigid body.
         */
        public getTransform(): Transform;
        /**
         * Sets `transform` to the transform of the rigid body.
         *
         * This does not create a new instance of `Transform`.
         */
        public getTransformTo(transform: Transform);

        /**
         * Sets the transform of the rigid body to `transform`.
         *
         * This does not keep any references to `transform`.
         */
        public setTransform(transform: Transform);

        /**
         * Returns the mass of the rigid body.
         *
         * If the rigid body has infinite mass, `0` will be returned.
         */
        public getMass(): number;

        /**
         * Returns the moment of inertia tensor in local space.
         */
        public getLocalInertia(): Mat3;
        /**
         * Sets `inertia` to the moment of inertia tensor in local space.
         *
         * This does not create a new instance of `Mat3`
         */
        public getLocalInertiaTo(inertia: Mat3);

        /**
         * Returns the mass data of the rigid body.
         */
        public getMassData(): MassData;

        /**
         * Sets `massData` to the mass data of the rigid body.
         *
         * This does not create a new instance of `MassData`.
         */
        public getMassDataTo(massData: MassData);
        /**
         * Sets the mass and moment of inertia of the rigid body by the mass data `massData`.
         * The properties set by this will be overwritten when
         *
         * - some shapes are added or removed
         * - the type of the rigid body is changed
         */
        public setMassData(massData: MassData);

        /**
         * Returns the rotation factor of the rigid body.
         */
        public getRotationFactor(): Vec3;

        /**
         * Sets the rotation factor of the rigid body to `rotationFactor`.
         *
         * This changes moment of inertia internally, so that the change of
         * angular velocity in **global space** along X, Y and Z axis will scale by `rotationFactor.x`,
         * `rotationFactor.y` and `rotationFactor.z` times respectively.
         */
        public setRotationFactor(rotationFactor: Vec3);

        /**
         * Returns the linear velocity of the rigid body.
         */
        public getLinearVelocity(): Vec3;

        /**
         * Sets `linearVelocity` to the linear velocity of the rigid body.
         *
         * This does not create a new intrance of `Vec3`.
         */
        public getLinearVelocityTo(linearVelocity: Vec3);

        /**
         * Sets the linear velocity of the rigid body.
         */
        public setLinearVelocity(linearVelocity: Vec3);

        /**
         * Returns the angular velocity of the rigid body.
         */
        public getAngularVelocity(): Vec3;

        /**
         * Sets `angularVelocity` to the angular velocity of the rigid body.
         *
         * This does not create a new intrance of `Vec3`.
         */
        public getAngularVelocityTo(angularVelocity: Vec3);

        /**
         * Sets the angular velocity of the rigid body.
         */
        public setAngularVelocity(angularVelocity: Vec3);

        /**
         * Adds `linearVelocityChange` to the linear velcity of the rigid body.
         */
        public addLinearVelocity(linearVelocityChange: Vec3);

        /**
         * Adds `angularVelocityChange` to the angular velcity of the rigid body.
         */
        public addAngularVelocity(angularVelocityChange: Vec3);

        /**
         * Applies the impulse `impulse` to the rigid body at `positionInWorld` in world position.
         *
         * This changes both the linear velocity and the angular velocity.
         */
        public applyImpulse(impulse: Vec3, positionInWorld: Vec3);

        /**
         * Applies the linear impulse `impulse` to the rigid body.
         *
         * This does not change the angular velocity.
         */
        public applyLinearImpulse(impulse: Vec3);

        /**
         * Applies the angular impulse `impulse` to the rigid body.
         *
         * This does not change the linear velocity.
         */
        public applyAngularImpulse(impulse: Vec3)

        /**
         * Applies the force `force` to `positionInWorld` in world position.
         */
        public applyForce(force: Vec3, positionInWorld: Vec3)

        /**
         * Applies the force `force` to the center of mass.
         */
        public applyForceToCenter(force: Vec3)

        /**
         * Applies the torque `torque`.
         */
        public applyTorque(torque: Vec3)

        /**
         * Returns the gravity scaling factor of the rigid body.
         */
        public getGravityScale(): number

        /**
         * Sets the gravity scaling factor of the rigid body to `gravityScale`.
         *
         * If `0` is set, the rigid body will not be affected by gravity.
         */
        public setGravityScale(gravityScale: number)

        /**
         * Returns the local coordinates of the point `worldPoint` in world coodinates.
         */
        public getLocalPoint(worldPoint: Vec3): Vec3

        /**
         * Sets `localPoint` to the local coordinates of the point `worldPoint` in world coodinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getLocalPointTo(worldPoint: Vec3, localPoint: Vec3)

        /**
         * Returns the local coordinates of the vector `worldVector` in world coodinates.
         */
        public getLocalVector(worldVector: Vec3): Vec3;

        /**
         * Sets `localVector` to the local coordinates of the vector `worldVector` in world coodinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getLocalVectorTo(worldVector: Vec3, localVector: Vec3);

        /**
         * Returns the world coordinates of the point `localPoint` in local coodinates.
         */
        public getWorldPoint(localPoint: Vec3): Vec3;

        /**
         * Sets `worldPoint` to the world coordinates of the point `localPoint` in local coodinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getWorldPointTo(localPoint: Vec3, worldPoint: Vec3);

        /**
         * Returns the world coordinates of the vector `localVector` in local coodinates.
         */
        public getWorldVector(localVector: Vec3): Vec3;

        /**
         * Sets `worldVector` to the world coordinates of the vector `localVector` in local coodinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getWorldVectorTo(localVector: Vec3, worldVector: Vec3);

        /**
         * Returns the number of the shapes added.
         */
        public getNumShapes(): number;

        /**
         * Returns the list of the shapes of the rigid body.
         */
        public getShapeList(): Shape;

        /**
         * Returns the number of the contact lists the rigid body is involved.
         */
        public getNumContectLinks(): number;

        /**
         * Returns the list of the contact links the rigid body is involved.
         */
        public getContactLinkList(): ContactLink;

        /**
         * Returns the number of the joint links the rigid body is attached.
         */
        public getNumJointLinks(): number;

        /**
         * Returns the list of the joint links the rigid body is attached.
         */
        public getJointLinkList(): JointLink;

        /**
         * Adds the shape to the rigid body.
         */
        public addShape(shape: Shape);

        /**
         * Removes the shape from the rigid body.
         */
        public removeShape(shape: Shape);

        /**
         * Returns the rigid body's type of behaviour.
         *
         * See `RigidBodyType` class for details.
         */
        public getType(): number;

        /**
         * Sets the rigid body's type of behaviour.
         *
         * See `RigidBodyType` class for details.
         */
        public setType(type: number);

        /**
         * Sets the rigid body's sleep flag false.
         *
         * This also resets the sleeping timer of the rigid body.
         */
        public wakeUp();

        /**
         * Sets the rigid body's sleep flag true.
         *
         * This also resets the sleeping timer of the rigid body.
         */
        public sleep();

        /**
         * Returns whether the rigid body is sleeping.
         */
        public isSleeping(): boolean;

        /**
         * Returns how long the rigid body is stopping moving. This returns `0` if the body
         * has already slept.
         */
        public getSleepTime(): number;

        /**
         * Sets the rigid body's auto sleep flag.
         *
         * If auto sleep is enabled, the rigid body will automatically sleep when needed.
         */
        public setAutoSleep(autoSleepEnabled: boolean);

        /**
         * Returns the linear damping.
         */
        public getLinearDamping(): number;

        /**
         * Sets the linear damping to `damping`.
         */
        public setLinearDamping(damping: number);

        /**
         * Returns the angular damping.
         */
        public getAngularDamping(): number;

        /**
         * Sets the angular damping to `damping`.
         */
        public setAngularDamping(damping: number);

        /**
         * Returns the previous rigid body in the world.
         *
         * If the previous one does not exist, `null` will be returned.
         */
        public getPrev(): RigidBody;

        /**
         * Returns the next rigid body in the world.
         *
         * If the next one does not exist, `null` will be returned.
         */
        public getNext(): RigidBody;

    }

}

declare module OIMO {

    /**
     * A rigid body configuration is used for constructions of rigid bodies. An instance of this
     * class can safely be reused, as a rigid body will not have any references to a field of
     * this class.
     */
    export class RigidBodyConfig {

        /**
         * The world position of the rigid body's center of gravity.
         */
        position: Vec3;

        /**
         * The rotation matrix of the rigid body.
         */
        rotation: Mat3;

        /**
         * The initial value of the rigid body's linear velocity.
         */
        linearVelocity: Vec3;

        /**
         * The initial value of the rigid body's angular velocity.
         */
        angularVelocity: Vec3;

        /**
         * The rigid body's motion type. See `RigidBodyType` for details.
         */
        type: number;

        /**
         * Whether to automatically sleep the rigid body when it stops moving
         * for a certain period of time, namely `Setting.sleepingTimeThreshold`.
         */
        autoSleep: boolean;

        /**
         * The damping coefficient of the linear velocity. Set positive values to
         * gradually reduce the linear velocity.
         */
        linearDamping: number;

        /**
         * The damping coefficient of the angular velocity. Set positive values to
         * gradually reduce the angular velocity.
         */
        angularDamping: number;

        /**
         * Default constructor.
         */
        constructor();

    }

}

declare module OIMO {

    /**
     * The list of a rigid body's motion types.
     */
    export class RigidBodyType {

        /**
         * Represents a dynamic rigid body. A dynamic rigid body has finite mass (and usually inertia
         * tensor). The rigid body is affected by gravity, or by constraints the rigid body is involved.
         */
        static DYNAMIC: any;

        /**
         * Represents a static rigid body. A static rigid body has zero velocities and infinite mass
         * and inertia tensor. The rigid body is not affected by any force or impulse, such as gravity,
         * constraints, or external forces or impulses added by an user.
         */
        static STATIC: any;

        /**
         * Represents a kinematic rigid body. A kinematic rigid body is similar to a static one, except
         * that it can have non-zero linear and angular velocities. This is useful for overlapping rigid
         * bodies to pre-computed motions.
         */
        static KINEMATIC: any;

    }

}

declare module OIMO {

    /**
     * A shape is a component of a rigid body. It attaches a collision geometry to the parent rigid body
     * with some physical properties such as coefficients of friction and restitution. The collision
     * geometry can locally be transformed relative to the parent rigid body's center of gravity.
     */
    export class Shape {
        displacement: Vec3;

        /**
         * Extra field that users can use for their own purposes.
         */
        userData: any;

        /**
         * Creates a new shape by configuration `config`.
         */
        constructor(config: ShapeConfig);

        /**
         * --- public --
         * Returns the coefficient of friction.
         */
        getFriction(): number;

        /**
         * Sets the coefficient of friction to `friction`.
         */
        setFriction(friction: number);

        /**
         * Returns the coefficient of restitution.
         */
        getRestitution(): number;

        /**
         * Sets the coefficient of restitution to `restitution`.
         */
        setRestitution(restitution: number);

        /**
         * Returns the transform of the shape relative to the parent rigid body's transform.
         */
        getLocalTransform(): Transform;

        /**
         * Sets `transform` to the transform of the shape relative to the parent rigid body's
         * transform.
         * 
         * This does not create a new instance of `Transform`.
         */
        getLocalTransformTo(transform: Transform);

        /**
         * Returns the world transform of the shape.
         */
        getTransform(): Transform;

        /**
         * Sets `transform` to the world transform of the shape.
         * 
         * This does not create a new instance of `Transform`.
         */
        getTransformTo(transform: Transform);

        /**
         * Sets the shape's transform to `transform` relative to the parent rigid body's transform.
         * 
         * This affects the parent rigid body's mass data.
         */
        setLocalTransform(transform: Transform);

        /**
         * Returns the density of the shape.
         */
        getDensity(): number;

        /**
         * Sets the density of the shape to `density`.
         * 
         * This affects the parent rigid body's mass data.
         */
        setDensity(density: number);

        /**
         * Returns the AABB of the shape. The AABB may be incorrect if the shape doesn't have a
         * parent rigid body.
         */
        getAabb(): Aabb;

        /**
         * Sets `aabb` to the AABB of the shape. The AABB may be incorrect if the shape doesn't have a
         * parent rigid body.
         * 
         * This does not create a new instance of `AABB`.
         */
        getAabbTo(aabb: Aabb);

        /**
         * Returns the colision geometry of the shape.
         */
        getGeometry(): Geometry;

        /**
         * Returns the parent rigid body. This returns `null` if the shape doesn't have a parent
         * rigid body.
         */
        getRigidBody(): RigidBody;

        /**
         * Returns the collision group bits the shape belongs to.
         */
        getCollisionGroup(): number;

        /**
         * Sets the shape's collision group bits to `collisionGroup`.
         */
        setCollisionGroup(collisionGroup: number);

        /**
         * Returns the collision mask bits of the shape.
         */
        getCollisionMask(): number;

        /**
         * Sets the shape's collision mask bits to `collisionMask`.
         */
        setCollisionMask(collisionMask: number);

        /**
         * Returns the contact callback of the shape.
         */
        getContactCallback(): ContactCallback;

        /**
         * Sets the contact callback of the shape to `callback`.
         */
        setContactCallback(callback: ContactCallback);

        /**
         * Returns the previous shape in the rigid body.
         * 
         * If the previous one does not exist, `null` will be returned.
         */
        getPrev(): Shape;

        /**
         * Returns the next shape in the rigid body.
         * 
         * If the next one does not exist, `null` will be returned.
         */
        getNext(): Shape;

    }

}

declare module OIMO {

    /**
     * A shape configuration is used for construction of shapes. An instance of
     * this class can safely be reused as a shape will not have any references
     * of a field of this class.
     */
    export class ShapeConfig {

        /**
         * The shape's local position relative to the parent rigid body's origin.
         */
        position: Vec3;

        /**
         * The shape's local rotation matrix relative to the parent rigid body's
         * rotation.
         */
        rotation: Mat3;

        /**
         * The coefficient of friction of the shape.
         */
        friction: number;

        /**
         * The coefficient of restitution of the shape.
         */
        restitution: number;

        /**
         * The density of the shape, usually in Kg/m^3.
         */
        density: number;

        /**
         * The collision geometry of the shape.
         */
        geometry: Geometry;

        /**
         * The collision group bits the shape belongs to. This is used for collision
         * filtering.
         * 
         * Two shapes `shape1` and `shape2` will collide only if both
         * `shape1.collisionGroup & shape2.collisionMask` and
         * `shape2.collisionGroup & shape1.collisionMask` are not zero.
         */
        collisionGroup: number;

        /**
         * The collision mask bits of the shape. This is used for collision
         * filtering.
         * 
         * Two shapes `shape1` and `shape2` will collide only if both
         * `shape1.collisionGroup & shape2.collisionMask` and
         * `shape2.collisionGroup & shape1.collisionMask` are not zero.
         */
        collisionMask: number;

        /**
         * The contact callback of the shape. The callback methods are called
         * when contact events the shape is involved occurred.
         */
        contactCallback: ContactCallback;

        /**
         * Default constructor.
         */
        constructor();

    }

}

declare module OIMO {

    /**
     * Brute force implementation of broad-phase collision detection. Time complexity is O(n^2).
     */
    export class BruteForceBroadPhase extends BroadPhase {

        constructor();

        /**
         * --- public --
         */
        createProxy(userData: any, aabb: Aabb): Proxy;

        destroyProxy(proxy: Proxy);

        moveProxy(proxy: Proxy, aabb: Aabb, dislacement: Vec3);

        collectPairs();


        rayCast(begin: Vec3, end: Vec3, callback: BroadPhaseProxyCallback);


        convexCast(convex: ConvexGeometry, begin: Transform, translation: Vec3, callback: BroadPhaseProxyCallback);

        aabbTest(aabb: Aabb, callback: BroadPhaseProxyCallback);

    }

}

declare module OIMO {

    /**
     * The broad-phase collision detection algorithm based on bounding volume hierarchy (BVH).
     * Average time complexity is O(NlogN) or lower.
     */
    export class BvhTree { }
    export class BvhBroadPhase extends BroadPhase {


        movedProxies: Array<BvhProxy>;

        numMovedProxies: number;

        constructor();

        /**
         * set tight AAB
         */
        padding: number;

        /**
         * fatten the AAB
         */
        paddingVec: Vec3;

        d: Vec3;

        /**
         * predict movemen
         */
        zero: Vec3;

        addToMin: Vec3;

        addToMax: Vec3;

        collide(n1: BvhNode, n2: BvhNode);

        l1: boolean;

        l2: boolean;

        /**
         * descend node
         * descend node
         */
        rayCastRecursive(node: BvhNode, _p1: Vec3, _p2: Vec3, callback: BroadPhaseProxyCallback);

        p1: Vec3;

        /**
         * TODO: use stack
         */
        p2: Vec3;

        /**
         * lea
         */
        convexCastRecursive(node: BvhNode, convex: ConvexGeometry, begin: Transform, translation: Vec3, callback: BroadPhaseProxyCallback);

        /**
         * TODO: use stack
         * lea
         */
        aabbTestRecursive(node: BvhNode, aabb: Aabb, callback: BroadPhaseProxyCallback);

        /**
         * lea
         * --- public --
         */
        createProxy(userData: any, aabb: Aabb): Proxy;

        destroyProxy(proxy: Proxy);

        moveProxy(proxy: Proxy, aabb: Aabb, displacement: Vec3);

        /**
         * need not move prox
         */
        collectPairs();

    }

}

declare module OIMO {

    /**
     * Internal class.
     * 
     * Strategies of leaf insertion.
     */
    export class BvhInsertionStrategy {

        static SIMPLE: number;

        static MINIMIZE_SURFACE_AREA: number;

    }

}

declare module OIMO {

    /**
     * Internal class.
     * 
     * BVH Node
     */
    export class BvhNode {
    }

}

declare module OIMO {

    /**
     * Internal class.
     * 
     * BVH Proxy
     */
    export class BvhProxy extends Proxy {


        constructor(userData: any, id: number);

    }

}


declare module OIMO {

    export class BoxBoxDetectorMacro {

        /**
         * Performs SAT check and minimum depth update for an axis.
         */
        satCheck(minDepth: any, minDepthId: any, minDepthSign: any, minDepthAxis: any, proj1: any, proj2: any, projC12: any, axis: any, id: any, biasMult: any): any;

        sum: number;

        neg: boolean;

    }

}

declare module OIMO {

    /**
     * Interface of a collision detector for narrow-phase collision detection.
     */
    export class Detector {

        swapped: boolean;

        constructor(swapped: boolean);

        /**
         * --- private --
         */
        setNormal(result: DetectorResult, n: Vec3);

        addPoint(result: DetectorResult, pos1: Vec3, pos2: Vec3, depth: number, id: number);

        p: DetectorResultPoint;

        detectImpl(result: DetectorResult, geom1: Geometry, geom2: Geometry, tf1: Transform, tf2: Transform, cachedData: CachedDetectorData);

        /**
         * override thi
         * --- public --
         * Computes the contact manifold of two collision geometries `geom1` and `geom2` with the transforms
         * `transform1` and `transform2`, and stores it to `result`. `cachedData` is used to improve performance
         * of collision detection in some detectors.
         */
        detect(result: DetectorResult, geom1: Geometry, geom2: Geometry, transform1: Transform, transform2: Transform, cachedData: CachedDetectorData);

    }

    export class CachedDetectorData { }

}

declare module OIMO {

    /**
     * General convex collision detector using GJK/EPA
     */
    export class GjkEpaDetector extends Detector { }

}

declare module OIMO {

    /**
     * Sphere vs Box collision 
     */
    export class SphereBoxDetector extends Detector {

        /**
         * If `swapped` is `true`, the collision detector expects `BoxGeometry` and `SphereGeometry` for the
         * first and second argument of `SphereBoxDetector.detect`. If `swapped` is `false`, the collision detector expects
         * `SphereGeometry` and `BoxGeometry` instead.
         */
        constructor(swapped: boolean);

    }

}

declare module OIMO {

    /**
     * Sphere vs Capsule 
     */
    export class SphereCapsuleDetector extends Detector {

        /**
         * If `swapped` is `true`, the collision detector expects `CapsuleGeometry` and `SphereGeometry` for the
         * first and second argument of `SphereCapsuleDetector.detect`. If `swapped` is `false`, the collision detector expects
         * `SphereGeometry` and `CapsuleGeometry` instead.
         */
        constructor(swapped: boolean);

        s1: SphereGeometry;

        c2: CapsuleGeometry;

        hh2: number;

        r1: number;

        r2: number;

        axis2: Vec3;

        /**
         * capsule axi
         */
        cp1: Vec3;

        /**
         * closest point
         * find closest point on segment
         */
        p2: Vec3;

        /**
         * line segment (p2, q2
         */
        q2: Vec3;

        p12: Vec3;

        d2: Vec3;

        /**
         * q -
         */
        d22: number;

        t: number;

        cp2: Vec3;

        /**
         * perform sphere vs sphere collisio
         */
        d: Vec3;

        len2: number;

        len: number;

        n: Vec3;

        pos1: Vec3;

        pos2: Vec3;

    }

}

declare module OIMO {

    /**
     * Sphere vs Sphere 
     */
    export class SphereSphereDetector extends Detector {

        /**
         * Default constructor.
         */
        constructor();

        s1: SphereGeometry;

        s2: SphereGeometry;

        d: Vec3;

        r1: number;

        r2: number;

        len2: number;

        len: number;

        n: Vec3;

        pos1: Vec3;

        pos2: Vec3;

    }

}

declare module OIMO {

    /**
     * Capsule vs Capsule 
     */
    export class CapsuleCapsuleDetector extends Detector {

        /**
         * Default constructor.
         */
        constructor();

        c1: CapsuleGeometry;

        c2: CapsuleGeometry;

        axis1: Vec3;

        /**
         * Y axe
         */
        axis2: Vec3;

        hh1: number;

        hh2: number;

        r1: number;

        r2: number;

        p1: Vec3;

        /**
         * line segments (p1, q1), (p2, q2
         */
        q1: Vec3;

        p2: Vec3;

        q2: Vec3;

        p12: Vec3;

        /**
         * p1 - p
         */
        d1: Vec3;

        /**
         * q -
         */
        d2: Vec3;

        p21d1: number;

        p12d2: number;

        d11: number;

        d12: number;

        d22: number;

        t1: number;

        /**
         * closest points: p1 + t1 * d1, p2 + t2 * d
         */
        t2: number;

        /**
         * point vs poin
         * point vs segmen
         * t2 = t1 * d12 + p12d2; <- t1 =
         * segment vs poin
         * t1 = t2 * d12 + p21d1; <- t2 =
         */
        det: number;

        /**
         * d1 is parallel to d2. use 0 for t
         * clamp t2 and recompute t
         * t1 = t2 * d12 + p21d1; <- t2 =
         * clamp t2 and recompute t
         * t1 = t2 * d12 + p21d1; <- t2 =
         */
        cp1: Vec3;

        cp2: Vec3;

        /**
         * perform sphere vs sphere collisio
         */
        d: Vec3;

        len2: number;

        len: number;

        n: Vec3;

        pos1: Vec3;

        pos2: Vec3;

    }

}

declare module OIMO {

    /**
     * A contact manifold holds collision data of a pair of shapes.
     */
    export class Manifold {

        /**
         * --- public --
         * Returns the normal vector of the contact manifold. The normal vector has unit
         * length and is perpendicular to the contact plane.
         */
        getNormal(): Vec3;

        /**
         * Sets `normal` to the normal vector of the contact manifold. The normal vector has
         * unit length and is perpendicular to the contact plane.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getNormalTo(normal: Vec3);

        /**
         * Returns the tangent vector of the contact manifold. The tangent vector has unit
         * length and is perpendicular to the normal vector.
         */
        getTangent(): Vec3;

        /**
         * Sets `tangent` to the tangent vector of the contact manifold. The tangent vector has
         * unit length and is perpendicular to the normal vector.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getTangentTo(tangent: Vec3);

        /**
         * Returns the binormal vector of the contact manifold. The binormal vector has unit
         * length and is perpendicular to both the normal and the tangent vector.
         */
        getBinormal(): Vec3;

        /**
         * Sets `binormal` to the binormal vector of the contact manifold. The binormal vector has
         * unit length and is perpendicular to both the normal and the tangent vector.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getBinormalTo(binormal: Vec3);

        /**
         * Returns the manifold point vector of the contact manifold. Note that **only the first
         * `Manifold.getNumPoints` elements of the vector are in use**, and the manifold points may
         * be disabled (see `ManifoldPoint.isEnabled`).
         */
        getPoints(): Array<ManifoldPoint>;

        /**
         * Returns the number of existing manifold points.
         */
        getNumPoints(): number;

    }

}

declare module OIMO {

    /**
     * A contact constraint provides collision information for a contact constraint solver.
     * This holds a contact manifold, which has some contact points, contact normals, and
     * contact impulses. See `Manifold` for more information.
     */
    export class ContactConstraint {
        constructor(manifold: Manifold);
    }


}

declare module OIMO {

    /**
     * A manifold point is a contact point in a contact manifold. This holds detailed collision
     * data (position, overlap depth, impulse, etc...) for collision response.
     */
    export class ManifoldPoint {

        /**
         * --- public --
         * Returns the first rigid body's manifold point in world coordinate.
         */
        getPosition1(): Vec3;

        /**
         * Sets `position` to the first rigid body's manifold point in world coordinate.
         * This does not create a new instance of `Vec3`.
         */
        getPosition1To(position: Vec3);

        /**
         * Returns the second rigid body's manifold point in world coordinate.
         */
        getPosition2(): Vec3;

        /**
         * Sets `position` to the second rigid body's manifold point in world coordinate.
         * This does not create a new instance of `Vec3`.
         */
        getPosition2To(position: Vec3);

        /**
         * Returns the amount of the overlap. If the manifold point is separate, a negative
         * value is returned.
         */
        getDepth(): number;

        /**
         * Returns whether the manifold point has existed for more than two steps.
         */
        isWarmStarted(): boolean;

        /**
         * Returns the normal impulse of the manifold point.
         */
        getNormalImpulse(): number;

        /**
         * Returns the tangent impulse of the manifold point.
         */
        getTangentImpulse(): number;

        /**
         * Returns the binormal impulse of the manifold point.
         */
        getBinormalImpulse(): number;

        /**
         * Returns whether the manifold point is enabled.
         */
        isEnabled(): boolean;

    }

}

declare module OIMO {

    /**
     * Internal class
     */
    export class ManifoldUpdater {

        numOldPoints: number;

        oldPoints: Array<ManifoldPoint>;

        constructor(manifold: Manifold);

        /**
         * --- private --
         */
        removeOutdatedPoints();

        /**
         * compute projection of dif
         * the amount of horizontal sliding exceeds threshol
         */
        removeManifoldPoint(index: number);


        addManifoldPoint(point: DetectorResultPoint, tf1: Transform, tf2: Transform);


        /**
         * just add the poin
         */
        computeTargetIndex(newPoint: DetectorResultPoint, tf1: Transform, tf2: Transform): number;

        computeRelativePositions(tf1: Transform, tf2: Transform);


        /**
         * set warm starting fla
         */
        findNearestContactPointIndex(target: DetectorResultPoint, tf1: Transform, tf2: Transform): number;

    }

}

declare module OIMO {

    /**
     * The row of a Jacobian matrix.
     */
    export class JacobianRow {

        lin1: Vec3;

        lin2: Vec3;

        ang1: Vec3;

        ang2: Vec3;

        flag: number;

        /**
         * sparsity fla
         */
        constructor();

        clear();

        updateSparsity();

        isLinearSet(): boolean;

        isAngularSet(): boolean;

    }

}

declare module OIMO {

    /**
     * A cylindrical joint constrains two rigid bodies to share their constraint
     * axes, and restricts relative translation and rotation onto the constraint
     * axis. This joint provides two degrees of freedom. You can enable lower and
     * upper limits, motors, spring and damper effects of both translation and
     * rotation part of the 
     */
    export class CylindricalJoint extends Joint {
        angle: number;

        angularErrorY: number;

        angularErrorZ: number;

        translation: number;

        linearErrorY: number;

        linearErrorZ: number;

        /**
         * Creates a new cylindrical joint by configuration `config`.
         */
        constructor(config: CylindricalJointConfig);

        /**
         * --- private --
         */
        getInfo(info: JointSolverInfo, timeStep: TimeStep, isPositionPart: boolean);

        erp: number;

        /**
         * compute ER
         */
        linRhsY: number;

        /**
         * compute rh
         */
        linRhsZ: number;

        angRhsY: number;

        angRhsZ: number;

        crossR1: Mat3;

        crossR2: Mat3;

        row: JointSolverInfoRow;

        j: JacobianRow;

        translationalMotorMass: number;

        rotationalMotorMass: number;

    }

}

declare module OIMO {

    /**
     * A cylindrical joint config is used for constructions of cylindrical joints.
     */
    export class CylindricalJointConfig extends JointConfig {

        /**
         * The first body's local constraint axis.
         */
        localAxis1: Vec3;

        /**
         * The second body's local constraint axis.
         */
        localAxis2: Vec3;

        /**
         * The translational limit and motor along the constraint axis of the joint.
         */
        translationalLimitMotor: TranslationalLimitMotor;

        /**
         * The translational spring and damper along constraint the axis of the joint.
         */
        translationalSpringDamper: SpringDamper;

        /**
         * The rotational limit and motor along the constraint axis of the joint.
         */
        rotationalLimitMotor: RotationalLimitMotor;

        /**
         * The rotational spring and damper along the constraint axis of the joint.
         */
        rotationalSpringDamper: SpringDamper;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, local axes
         * from the world axis `worldAxis`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3, worldAxis: Vec3): CylindricalJointConfig;

    }

}

declare module OIMO {

    /**
     * The base class of joints. Joints are used to connect two rigid bodies
     * in various ways. See `JointType` for all types of joints.
     */
    export class Joint {



        /**
         * Extra field that users can use for their own purposes.
         */
        userData: any;

        constructor(config: JointConfig, type: number);


        /**
         * --- public --
         * Returns the first rigid body.
         */
        getRigidBody1(): RigidBody;

        /**
         * Returns the second rigid body.
         */
        getRigidBody2(): RigidBody;

        /**
         * Returns the type of the joint.
         * 
         * See `JointType` for details.
         */
        getType(): number;

        /**
         * Returns the first rigid body's anchor point in world coordinates.
         */
        getAnchor1(): Vec3;

        /**
         * Returns the second rigid body's anchor point in world coordinates.
         */
        getAnchor2(): Vec3;

        /**
         * Sets `anchor` to the first rigid body's anchor point in world coordinates.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getAnchor1To(anchor: Vec3);

        /**
         * Sets `anchor` to the second rigid body's anchor point in world coordinates.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getAnchor2To(anchor: Vec3);

        /**
         * Returns the first rigid body's local anchor point in world coordinates.
         */
        getLocalAnchor1(): Vec3;

        /**
         * Returns the second rigid body's local anchor point in world coordinates.
         */
        getLocalAnchor2(): Vec3;

        /**
         * Sets `localAnchor` to the first rigid body's anchor point in local coordinates.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getLocalAnchor1To(localAnchor: Vec3);

        /**
         * Sets `localAnchor` to the second rigid body's anchor point in local coordinates.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getLocalAnchor2To(localAnchor: Vec3);

        /**
         * Returns the basis of the joint for the first rigid body in world coordinates.
         */
        getBasis1(): Mat3;

        /**
         * Returns the basis of the joint for the second rigid body in world coordinates.
         */
        getBasis2(): Mat3;

        /**
         * Sets `basis` to the basis of the joint for the first rigid body in world coordinates.
         * 
         * This does not create a new instance of `Mat3`.
         */
        getBasis1To(basis: Mat3);

        /**
         * Sets `basis` to the basis of the joint for the second rigid body in world coordinates.
         * 
         * This does not create a new instance of `Mat3`.
         */
        getBasis2To(basis: Mat3);

        /**
         * Returns whether to allow the connected rigid bodies to collide each other.
         */
        getAllowCollision(): boolean;

        /**
         * Sets whether to allow the connected rigid bodies to collide each other.
         */
        setAllowCollision(allowCollision: boolean);

        /**
         * Returns the magnitude of the constraint force at which the joint will be destroyed.
         * 
         * Returns `0` if the joint is unbreakable.
         */
        getBreakForce(): number;

        /**
         * Sets the magnitude of the constraint force at which the joint will be destroyed.
         * 
         * Set `0` for unbreakable joints.
         */
        setBreakForce(breakForce: number);

        /**
         * Returns the magnitude of the constraint torque at which the joint will be destroyed.
         * 
         * Returns `0` if the joint is unbreakable.
         */
        getBreakTorque(): number;

        /**
         * Sets the magnitude of the constraint force at which the joint will be destroyed.
         * 
         * Set `0` for unbreakable joints.
         */
        setBreakTorque(breakTorque: number);

        /**
         * Returns the type of the position correction algorithm for the joint.
         * 
         * See `PositionCorrectionAlgorithm` for details.
         */
        getPositionCorrectionAlgorithm(): number;

        /**
         * Sets the type of the position correction algorithm to `positionCorrectionAlgorithm` for the joint.
         * 
         * See `PositionCorrectionAlgorithm` for details.
         */
        setPositionCorrectionAlgorithm(positionCorrectionAlgorithm: number);

        /**
         * Returns the force applied to the first rigid body at the last time step.
         */
        getAppliedForce(): Vec3;

        v: Vec3;

        /**
         * Sets `appliedForce` to the force applied to the first rigid body at the last time step.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getAppliedForceTo(appliedForce: Vec3);

        /**
         * Returns the torque applied to the first rigid body at the last time step.
         */
        getAppliedTorque(): Vec3;

        /**
         * Sets `appliedTorque` to the torque applied to the first rigid body at the last time step.
         * 
         * This does not create a new instance of `Vec3`.
         */
        getAppliedTorqueTo(appliedTorque: Vec3);

        /**
         * Returns the previous joint in the world.
         * 
         * If the previous one does not exist, `null` will be returned.
         */
        getPrev(): Joint;

        /**
         * Returns the next joint in the world.
         * 
         * If the next one does not exist, `null` will be returned.
         */
        getNext(): Joint;

    }

}

declare module OIMO {

    /**
     * Internal class
     */
    export class JointBasis {

        joint: Joint;

        x: Vec3;

        y: Vec3;

        z: Vec3;

        constructor(joint: Joint);

        trackByX();

        trackByY();

        trackByZ();

        invM1: number;

        invM2: number;

        q: IQuat;

        idQ: IQuat;

        slerpQ: IQuat;

        slerpM: Mat3;

        newX: Vec3;

        newY: Vec3;

        newZ: Vec3;

        prevX: Vec3;

        prevY: Vec3;

    }

}

declare module OIMO {

    /**
     * A joint configuration is used for constructions of various joints.
     * An instance of any kind of the joint configurations can safely be reused.
     */
    export class JointConfig {

        /**
         * The first rigid body attached to the joint.
         */
        rigidBody1: RigidBody;

        /**
         * The second rigid body attached to the joint.
         */
        rigidBody2: RigidBody;

        /**
         * The local position of the first rigid body's anchor point.
         */
        localAnchor1: Vec3;

        /**
         * The local position of the second rigid body's anchor point.
         */
        localAnchor2: Vec3;

        /**
         * Whether to allow the connected rigid bodies to collide each other.
         */
        allowCollision: boolean;

        /**
         * The type of the constraint solver for the joint.
         * 
         * See `ConstraintSolverType` for details.
         */
        solverType: number;

        /**
         * The type of the position correction algorithm for the joint.
         * 
         * See `PositionCorrectionAlgorithm` for details.
         */
        positionCorrectionAlgorithm: number;

        /**
         * The joint will be destroyed when magnitude of the constraint force exceeds the value.
         * 
         * Set `0` for unbreakable joints.
         */
        breakForce: number;

        /**
         * The joint will be destroyed when magnitude of the constraint torque exceeds the value.
         * 
         * Set `0` for unbreakable joints.
         */
        breakTorque: number;

        constructor();

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class JointImpulse {

        impulse: number;

        /**
         * constraint impuls
         */
        impulseM: number;

        /**
         * motor impuls
         */
        impulseP: number;

        /**
         * position impuls
         */
        constructor();

        clear();

    }

}

declare module OIMO {

    /**
     * A joint link is used to build a constraint graph for clustering rigid bodies.
     * In a constraint graph, rigid bodies are nodes and constraints are edges.
     * See also `ContactLink`.
     */
    export class JointLink {

        constructor(joint: Joint);

        /**
         * Returns the contact the rigid body is attached to.
         */
        getContact(): Joint;

        /**
         * Returns the other rigid body attached to the  This provides a quick access
         * from a rigid body to the other one attached to the 
         */
        getOther(): RigidBody;

        /**
         * Returns the previous joint link in the rigid body.
         * 
         * If the previous one does not exist, `null` will be returned.
         */
        getPrev(): JointLink;

        /**
         * Returns the next joint link in the rigid body.
         * 
         * If the previous one does not exist, `null` will be returned.
         */
        getNext(): JointLink;

    }

}

declare module OIMO {

    /**
     * The list of the types of the joints.
     */
    export class JointType {

        /**
         * Represents a spherical joint.
         * 
         * See `SphericalJoint` for details.
         */
        static SPHERICAL: number;

        /**
         * Represents a revolute joint.
         * 
         * See `RevoluteJoint` for details.
         */
        static REVOLUTE: number;

        /**
         * Represents a cylindrical joint.
         * 
         * See `CylindricalJoint` for details.
         */
        static CYLINDRICAL: number;

        /**
         * Represents a prismatic joint.
         * 
         * See `PrismaticJoint` for details.
         */
        static PRISMATIC: number;

        /**
         * Represents a universal joint.
         * 
         * See `UniversalJoint` for details.
         */
        static UNIVERSAL: number;

        /**
         * Represents a ragdoll joint.
         * 
         * See `RagdollJoint` for details.
         */
        static RAGDOLL: number;

    }

}

declare module OIMO {

    /**
     * A prismatic joint (a.k.a. slider joint) constrains two rigid bodies to
     * share their anchor points and constraint axes, and restricts relative
     * translation onto the constraint axis. This joint provides one degree of
     * freedom. You can enable lower and upper limits, a motor, a spring and
     * damper effect of the translational part of the 
     */
    export class PrismaticJoint extends Joint {

        translation: number;

        linearErrorY: number;

        linearErrorZ: number;

        angularError: Vec3;

        /**
         * Creates a new prismatic joint by configuration `config`.
         */
        constructor(config: PrismaticJointConfig);

        /**
         * --- priate --
         */
        getInfo(info: JointSolverInfo, timeStep: TimeStep, isPositionPart: boolean);

        erp: number;

        /**
         * compute ER
         */
        linRhsY: number;

        /**
         * compute rh
         */
        linRhsZ: number;

        angRhsX: number;

        angRhsY: number;

        angRhsZ: number;

        crossR1: Mat3;

        crossR2: Mat3;

        row: JointSolverInfoRow;

        j: JacobianRow;

        motorMass: number;

    }

}

declare module OIMO {

    /**
     * A prismatic joint config is used for constructions of prismatic joints.
     */
    export class PrismaticJointConfig extends JointConfig {

        /**
         * The first body's local constraint axis.
         */
        localAxis1: Vec3;

        /**
         * The second body's local constraint axis.
         */
        localAxis2: Vec3;

        /**
         * The translational limit and motor along the constraint axis of the joint.
         */
        limitMotor: TranslationalLimitMotor;

        /**
         * The translational spring and damper along the constraint axis of the joint.
         */
        springDamper: SpringDamper;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, local axes
         * from the world axis `worldAxis`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3, worldAxis: Vec3): PrismaticJointConfig;

    }

}

declare module OIMO {

    /**
     * A ragdoll joint is designed to simulate ragdoll's limbs. It constrains
     * swing and twist angles between two rigid bodies. The two rigid bodies
     * have constraint axes, and the swing angle is defined by the angle of
     * two constraint axes, while the twist angle is defined by the rotation
     * angle along the two axes. In addition to lower and upper limits of the
     * twist angle, You can set an "elliptic cone limit" of the swing angle
     * by specifying two swing axes (though one of them is automatically
     * computed) and corresponding maximum swing angles. You can also enable a
     * motor of the twist part of the constraint, spring and damper effect of
     * the both swing and twist part of the 
     */
    export class RagdollJoint extends Joint {

        swingAxis: Vec3;

        twistAxis: Vec3;

        linearError: Vec3;

        swingError: number;

        dummySwingLm: RotationalLimitMotor;

        /**
         * Creates a new ragdoll joint by configuration `config`.
         */
        constructor(config: RagdollJointConfig);

        computeErrors();

        /**
         * Returns the first rigid body's constraint axis in world coordinates.
         */
        getAxis1(): Vec3;

        /**
	    * Returns the second rigid body's constraint axis in world coordinates.
	    */
        getAxis2(): Vec3;

        /**
         * Sets `axis` to the first rigid body's constraint axis in world coordinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getAxis1To(axis: Vec3);

        /**
         * Sets `axis` to the second rigid body's constraint axis in world coordinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getAxis2To(axis: Vec3);

        /**
         * Returns the first rigid body's constraint axis relative to the rigid body's transform.
         */
        public getLocalAxis1(): Vec3;

        /**
         * Returns the second rigid body's constraint axis relative to the rigid body's transform.
         */
        public getLocalAxis2(): Vec3;

        /**
         * Sets `axis` to the first rigid body's constraint axis relative to the rigid body's transform.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getLocalAxis1To(axis: Vec3);

        /**
         * Sets `axis` to the second rigid body's constraint axis relative to the rigid body's transform.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getLocalAxis2To(axis: Vec3);

        /**
         * Returns the rotational spring and damper settings along the twist axis.
         */
        public getTwistSpringDamper(): SpringDamper;

        /**
         * Returns the rotational limits and motor settings along the twist axis.
         */
        public getTwistLimitMotor(): RotationalLimitMotor;

        /**
         * Returns the rotational spring and damper settings along the swing axis.
         */
        public getSwingSpringDamper(): SpringDamper;

        /**
         * Returns the swing axis in world coordinates.
         */
        public getSwingAxis(): Vec3;

        /**
         * Sets `axis` to the swing axis in world coordinates.
         *
         * This does not create a new instance of `Vec3`.
         */
        public getSwingAxisTo(axis: Vec3);

        /**
         * Returns the swing angle in radians.
         */
        public getSwingAngle(): number
        /**
         * Returns the twist angle in radians.
         */
        public getTwistAngle(): number
    }

}

declare module OIMO {

    /**
     * A ragdoll joint config is used for constructions of ragdoll joints.
     */
    export class RagdollJointConfig extends JointConfig {

        /**
         * The first body's local twist axis.
         */
        localTwistAxis1: Vec3;

        /**
         * The second body's local twist axis.
         */
        localTwistAxis2: Vec3;

        /**
         * The first body's local swing axis.
         * 
         * The second swing axis is also attached to the first body. It is perpendicular to the first swing
         * axis, and is automatically computed when the joint is created.
         */
        localSwingAxis1: Vec3;

        /**
         * The rotational spring and damper along the twist axis of the joint.
         */
        twistSpringDamper: SpringDamper;

        /**
         * The rotational limit and motor along the twist axis of the joint.
         */
        twistLimitMotor: RotationalLimitMotor;

        /**
         * The rotational spring and damper along the swing axis of the joint.
         */
        swingSpringDamper: SpringDamper;

        /**
         * The max angle of rotation along the first swing axis.
         * This value must be positive.
         */
        maxSwingAngle1: number;

        /**
         * The max angle of rotation along the second swing axis.
         * This value must be positive.
         */
        maxSwingAngle2: number;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, local twist axes
         * from the world twist axis `worldTwistAxis`, local swing axis from the world swing axis
         * `worldSwingAxis`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3, worldTwistAxis: Vec3, worldSwingAxis: Vec3): RagdollJointConfig;

    }

}

declare module OIMO {

    /**
     * A revolute joint (a.k.a. hinge joint) constrains two rigid bodies to share
     * their anchor points and constraint axes, and restricts relative rotation onto
     * the constraint axis. This joint provides one degree of freedom. You can enable
     * lower and upper limits, a motor, a spring and damper effect of the rotational
     * part of the 
     */
    export class RevoluteJoint extends Joint {

        _sd: SpringDamper;

        _lm: RotationalLimitMotor;

        _basis: JointBasis;

        angle: number;

        angularErrorY: number;

        angularErrorZ: number;

        linearError: Vec3;

        /**
         * Creates a new revolute joint by configuration `config`.
         */
        constructor(config: RevoluteJointConfig);

        /**
         * --- private --
         */
        getInfo(info: JointSolverInfo, timeStep: TimeStep, isPositionPart: boolean);

        erp: number;

        /**
         * compute ER
         */
        linearRhs: Vec3;

        /**
         * compute rh
         */
        linRhsX: number;

        linRhsY: number;

        linRhsZ: number;

        angRhsY: number;

        angRhsZ: number;

        crossR1: Mat3;

        crossR2: Mat3;

        row: JointSolverInfoRow;

        j: JacobianRow;

        motorMass: number;

        /**
         * Returns the rotational limits and motor settings along the twist axis.
         */
        public getSpringDamper(): SpringDamper;

        /**
         * Returns the rotational limits and motor settings along the twist axis.
         */
        public getLimitMotor(): RotationalLimitMotor;
    }
}

declare module OIMO {

    /**
     * A revolute joint config is used for constructions of revolute joints.
     */
    export class RevoluteJointConfig extends JointConfig {

        /**
         * The first body's local constraint axis.
         */
        localAxis1: Vec3;

        /**
         * The second body's local constraint axis.
         */
        localAxis2: Vec3;

        /**
         * The rotational spring and damper settings.
         */
        springDamper: SpringDamper;

        /**
         * The rotational limits and motor settings.
         */
        limitMotor: RotationalLimitMotor;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, local axes
         * from the world axis `worldAxis`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3, worldAxis: Vec3): RevoluteJointConfig;

    }

}

declare module OIMO {

    /**
     * Rotational limits and motor settings of a joint.
     */
    export class RotationalLimitMotor {

        /**
         * The lower bound of the limit in radians.
         * 
         * The limit is disabled if `lowerLimit > upperLimit`.
         */
        lowerLimit: number;

        /**
         * The upper bound of the limit in radians.
         * 
         * The limit is disabled if `lowerLimit > upperLimit`.
         */
        upperLimit: number;

        /**
         * The target speed of the motor in usually radians per second.
         */
        motorSpeed: number;

        /**
         * The maximum torque of the motor in usually newton meters.
         * 
         * The motor is disabled if `motorTorque <= 0`.
         */
        motorTorque: number;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets limit properties at once and returns `this`.
         * `this.lowerLimit` is set to `lower`, and `this.upperLimit` is set to `upper`.
         */
        setLimits(lower: number, upper: number): RotationalLimitMotor;

        /**
         * Sets motor properties at once and returns `this`.
         * `this.motorSpeed` is set to `speed`, and `this.motorTorque` is set to `torque`.
         */
        setMotor(speed: number, torque: number): RotationalLimitMotor;

        /**
         * Returns a clone of the object.
         */
        clone(): RotationalLimitMotor;

        lm: RotationalLimitMotor;

    }

}

declare module OIMO {

    /**
     * A spherical joint (a.k.a. ball and socket joint) constrains two rigid bodies to share
     * their anchor points. This joint provides three degrees of freedom. You can enable a
     * spring and damper effect of the 
     */
    export class SphericalJoint extends Joint {

        _sd: SpringDamper;

        /**
         * Creates a new spherical joint by configuration `config`.
         */
        constructor(config: SphericalJointConfig);

        /**
         * --- private --
         */
        getInfo(info: JointSolverInfo, timeStep: TimeStep, isPositionPart: boolean);

        error: Vec3;

        /**
         * compute positional erro
         */
        cfm: number;

        /**
         * compute CFM and ER
         */
        erp: number;

        linearRhs: Vec3;

        /**
         * compute rh
         */
        linRhsX: number;

        linRhsY: number;

        linRhsZ: number;

        crossR1: Mat3;

        crossR2: Mat3;

        row: JointSolverInfoRow;

        j: JacobianRow;


        /**
         * --- public --
         * Returns the spring and damper settings.
         */
        getSpringDamper(): SpringDamper;

    }

}

declare module OIMO {

    /**
     * A spherical joint config is used for constructions of spherical joints.
     */
    export class SphericalJointConfig extends JointConfig {

        /**
         * The spring and damper setting of the joint.
         */
        springDamper: SpringDamper;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3): SphericalJointConfig;

    }

}

declare module OIMO {

    /**
     * Spring and damper settings of a joint.
     */
    export class SpringDamper {

        /**
         * The frequency of the spring in Hz.
         * Set `0.0` to disable the spring and make the constraint totally rigid.
         */
        frequency: number;

        /**
         * The damping ratio of the 
         * Set `1.0` to make the constraint critically dumped.
         */
        dampingRatio: number;

        /**
         * Whether to use symplectic Euler method instead of implicit Euler method, to numarically integrate the 
         * Note that symplectic Euler method conserves energy better than implicit Euler method does, but the constraint will be
         * unstable under the high frequency.
         */
        useSymplecticEuler: boolean;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets spring and damper parameters at once and returns `this`.
         * `this.frequency` is set to `frequency`, and `this.dampingRatio` is set to `dampingRatio`.
         */
        setSpring(frequency: number, dampingRatio: number): SpringDamper;

        setSymplecticEuler(useSymplecticEuler: boolean): SpringDamper;

        /**
         * Returns a clone of the object.
         */
        clone(): SpringDamper;

        sd: any;

    }

}

declare module OIMO {

    /**
     * Translational limits and motor settings of a joint.
     */
    export class TranslationalLimitMotor {

        /**
         * The lower bound of the limit in usually meters.
         * 
         * The limit is disabled if `lowerLimit > upperLimit`.
         */
        lowerLimit: number;

        /**
         * The upper bound of the limit in usually meters.
         * 
         * The limit is disabled if `lowerLimit > upperLimit`.
         */
        upperLimit: number;

        /**
         * The target speed of the motor in usually meters per second.
         */
        motorSpeed: number;

        /**
         * The maximum force of the motor in usually newtons.
         * 
         * The motor is disabled if `motorForce <= 0`.
         */
        motorForce: number;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets limit properties at once and returns `this`.
         * `this.lowerLimit` is set to `lower`, and `this.upperLimit` is set to `upper`.
         */
        setLimits(lower: number, upper: number): TranslationalLimitMotor;

        /**
         * Sets motor properties at once and returns `this`.
         * `this.motorSpeed` is set to `speed`, and `this.motorForce` is set to `force`.
         */
        setMotor(speed: number, force: number): TranslationalLimitMotor;

        /**
         * Returns a clone of the object.
         */
        clone(): TranslationalLimitMotor;

        lm: TranslationalLimitMotor;

    }

}

declare module OIMO {

    /**
     * A universal joint constrains two rigid bodies' constraint axes to be perpendicular
     * to each other. Rigid bodies can rotate along their constraint axes, but cannot along
     * the direction perpendicular to two constraint axes. This joint provides two degrees
     * of freedom. You can enable lower and upper limits, motors, spring and damper effects
     * of the two rotational constraints.
     */
    export class UniversalJoint extends Joint {

        _sd1: SpringDamper;

        _sd2: SpringDamper;

        _lm1: RotationalLimitMotor;

        _lm2: RotationalLimitMotor;

        _axisX: Vec3;

        _axisY: Vec3;

        _axisZ: Vec3;

        _angleX: number;

        _angleY: number;

        _angleZ: number;

        xSingular: boolean;

        ySingular: boolean;

        zSingular: boolean;

        linearError: Vec3;

        /**
         * Creates a new universal joint by configuration `config`.
         */
        constructor(config: UniversalJointConfig);

        rot1: Mat3;

        rot2: Mat3;

        relRot: Mat3;

        /**
         * local --(rot1)--> body
         * local --(rot2)--> body
         * body1 --(relRot)--> body
         * an
         * body1 -------------(relRot)------------> body
         * body1 --(inv(rot1))--> local --(rot2)--> body
         * 
         * so relative rotation matrix i
         * inv(rot1) * rot
         * and NO
         * rot2 * inv(rot1
         */
        angleAxisX: Vec3;

        angleAxisY: Vec3;

        angleAxisZ: Vec3;

        /**
         * right-handed coordinate syste
         * constraint axes are not equal to rotation axes of Euler angles, because rotation axe
         * of Euler angles are not orthogonal. if we want to constrain relative angular velocit
         * w2-w1 along X-axis of Euler angles, w2-w1 should fulfil
         * w2-w1 = alpha * angleAxisY + beta * angleAxis
         * s
         * (w2-w1) dot (angleAxisY cross angleAxisZ) =
         * 
         * be careful about the fact that this does NOT mea
         * (w2-w1) dot angleAxisX =
         * 
         * note that we can directory use Y-axis of Euler angles to constrain relative velocit
         * along the axis, as `angleAxisY` is parallel to `angleAxisX cross angleAxisZ`
         */
        getInfo(info: JointSolverInfo, timeStep: TimeStep, isPositionPart: boolean);

        erp: number;

        /**
         * compute ER
         */
        linearRhs: Vec3;

        /**
         * compute rh
         */
        linRhsX: number;

        linRhsY: number;

        linRhsZ: number;

        angRhsY: number;

        crossR1: Mat3;

        crossR2: Mat3;

        row: JointSolverInfoRow;

        j: JacobianRow;

        motorMassX: number;

        motorMassZ: number;

        public getSpringDamper1(): SpringDamper;
        public getSpringDamper2(): SpringDamper;
        public getLimitMotor1(): RotationalLimitMotor;
        public getLimitMotor2(): RotationalLimitMotor;
    }

}

declare module OIMO {

    /**
     * A universal joint config is used for constructions of universal joints.
     */
    export class UniversalJointConfig extends JointConfig {

        /**
         * The first body's local constraint axis.
         */
        localAxis1: Vec3;

        /**
         * The second body's local constraint axis.
         */
        localAxis2: Vec3;

        /**
         * The rotational spring and damper along the first body's constraint axis.
         */
        springDamper1: SpringDamper;

        /**
         * The rotational spring and damper along the second body's constraint axis.
         */
        springDamper2: SpringDamper;

        /**
         * The rotational limit and motor along the first body's constraint axis.
         */
        limitMotor1: RotationalLimitMotor;

        /**
         * The rotational limit and motor along the second body's constraint axis.
         */
        limitMotor2: RotationalLimitMotor;

        /**
         * Default constructor.
         */
        constructor();

        /**
         * Sets rigid bodies, local anchors from the world anchor `worldAnchor`, local axes
         * from the world axes `worldAxis1` and `worldAxis2`, and returns `this`.
         */
        init(rigidBody1: RigidBody, rigidBody2: RigidBody, worldAnchor: Vec3, worldAxis1: Vec3, worldAxis2: Vec3): UniversalJointConfig;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class ContactImpulse {

        impulseN: number;

        /**
         * normal impuls
         */
        impulseT: number;

        /**
         * tangent impuls
         */
        impulseB: number;

        /**
         * binomal impuls
         */
        impulseP: number;

        /**
         * position impuls
         */
        impulseL: Vec3;

        /**
         * lateral impuls
         */
        constructor();

        clear();

        copyFrom(imp: ContactImpulse);

    }

}

declare module OIMO {

    /**
     * The list of the constraint solvers.
     */
    export class ConstraintSolverType {

        static _ITERATIVE: number;

        static _DIRECT: number;

        /**
         * Iterative constraint solver. Fast and stable enough for common usages.
         */
        static ITERATIVE: number;

        /**
         * Direct constraint solver. Very stable but not suitable for a situation where fast
         * computation is required.
         */
        static DIRECT: number;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class EpaPolyhedronState {

        static OK: number;

        static INVALID_TRIANGLE: number;

        static NO_ADJACENT_PAIR_INDEX: number;

        static NO_ADJACENT_TRIANGLE: number;

        static EDGE_LOOP_BROKEN: number;

        static NO_OUTER_TRIANGLE: number;

        static TRIANGLE_INVISIBLE: number;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class EpaPolyhedron {

        constructor();

        dumpHoleEdge(first: EpaVertex);


        validate(): boolean;

        /**
         * hrow M.error("!?"))
         * hrow M.error("!?"))
         */
        findEdgeLoop(id: number, base: EpaTriangle, from: Vec3);

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class EpaTriangle {


        tmp: Vec3;

        static count: number;

        id: number;

        constructor();

        checkVisible(id: number, from: Vec3): boolean;

        /**
         * if (id == _tmpDfsId) return _tmpDfsVisible
         */
        init(vertex1: EpaVertex, vertex2: EpaVertex, vertex3: EpaVertex, center: Vec3, autoCheck?: boolean): boolean;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class GjkCache {

        prevClosestDir: Vec3;

        constructor();

        clear();

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class EpaVertex {

        _next: EpaVertex;

        /**
         * for object poolin
         */
        v: Vec3;

        w1: Vec3;

        w2: Vec3;

        _tmpEdgeLoopNext: EpaVertex;

        _tmpEdgeLoopOuterTriangle: EpaTriangle;

        randId: number;

        constructor();

        init(v: Vec3, w1: Vec3, w2: Vec3): EpaVertex;

        removeReferences();

    }

}

declare module OIMO {

    /**
     * GJK algorithm and EPA for narrow-phase collision detection.
     */
    export class GjkEpa {

        c1: ConvexGeometry;

        c2: ConvexGeometry;

        tf1: Transform;

        tf2: Transform;

        /**
         * ------------------------------------------------------------- for GJ
         */
        s: Array<Vec3>;

        /**
         * simple
         */
        simplexSize: number;

        w1: Array<Vec3>;

        /**
         * witness point
         */
        w2: Array<Vec3>;

        tempVec3s: Array<Vec3>;

        tempTransform: Transform;

        dir: Vec3;

        /**
         * directio
         */
        closest: Vec3;

        /**
         * closest poin
         */
        baseDirs: Array<Vec3>;

        /**
         * base directions used to expand simple
         */
        tl1: Vec3;

        /**
         * for convex castin
         */
        tl2: Vec3;

        rayX: Vec3;

        rayR: Vec3;

        /**
         * ------------------------------------------------------------- for EP
         */
        depth: number;

        polyhedron: EpaPolyhedron;

        /**
         * ------------------------------------------------------------- public var
         * Computed closest point of the first geometry in world coordinate system.
         */
        closestPoint1: Vec3;

        /**
         * Computed closest point of the second geometry in world coordinate system.
         */
        closestPoint2: Vec3;

        /**
         * Computed distance between two geometries. This value may be negative if two
         * geometries are overlapping.
         */
        distance: number;

        /**
         * Default constructor. Consider using `GjkEpa.getInstance` instead of creating a new
         * instance.
         */
        constructor();

        /**
         * --- private --
         */
        computeClosestPointsImpl(c1: ConvexGeometry, c2: ConvexGeometry, tf1: Transform, tf2: Transform, cache: CachedDetectorData, useEpa: boolean): number;

    }

}

declare module OIMO {

    export class GjkEpaLog {

        log(text: any): any;

        run(runOnlyInDebug: any): any;

    }

}

declare module OIMO {

    /**
     * The list of the state of a result of `GjkEpa.computeClosestPoints`.
     */
    export class GjkEpaResultState {

        static _SUCCEEDED: number;

        static _GJK_FAILED_TO_MAKE_TETRAHEDRON: number;

        static _GJK_DID_NOT_CONVERGE: number;

        static _EPA_FAILED_TO_INIT: number;

        static _EPA_FAILED_TO_ADD_VERTEX: number;

        static _EPA_DID_NOT_CONVERGE: number;

        /**
         * GJK/EPA computation is successfully finished.
         */
        static SUCCEEDED: number;

        /**
         * Failed to construct a tetrahedron enclosing the origin in GJK computation.
         */
        static GJK_FAILED_TO_MAKE_TETRAHEDRON: number;

        /**
         * GJK iterations did not converge in time.
         */
        static GJK_DID_NOT_CONVERGE: number;

        /**
         * Failed to construct initial polyhedron in EPA construction.
         */
        static EPA_FAILED_TO_INIT: number;

        /**
         * Failed to add a new vertex to the polyhedron in EPA computation.
         */
        static EPA_FAILED_TO_ADD_VERTEX: number;

        /**
         * EPA iterations did not converge in time.
         */
        static EPA_DID_NOT_CONVERGE: number;

    }

}

declare module OIMO {

    /**
     * Simplex utilities for GJK/EPA computations.
     */
    export class SimplexUtil {

        /**
         * Sets `out` to the minimum length point on the line (`vec1`, `vec2`)
         * and returns the index of the voronoi region.
         */
        static projectOrigin2(vec1: Vec3, vec2: Vec3, out: Vec3): number;


        /**
         * Sets `out` to the minimum length point on the triangle (`vec1`, `vec2`, `vec3`)
         * and returns the index of the voronoi region.
         */
        static projectOrigin3(vec1: Vec3, vec2: Vec3, vec3: Vec3, out: Vec3): number;


    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class ContactSolverInfo {

        b1: RigidBody;

        b2: RigidBody;

        numRows: number;

        rows: Array<ContactSolverInfoRow>;

        constructor();

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class ContactSolverInfoRow {

        /**
         * Used for both velocity and position solver.
         */
        jacobianN: JacobianRow;

        /**
         * Used for velocity solver.
         */
        jacobianT: JacobianRow;

        /**
         * Used for velocity solver.
         */
        jacobianB: JacobianRow;

        /**
         * Used for both velocity and position solver.
         */
        rhs: number;

        /**
         * Used for velocity solver.
         */
        cfm: number;

        /**
         * Used for velocity solver.
         */
        friction: number;

        /**
         * Used for both velocity and position solver.
         */
        impulse: ContactImpulse;

        constructor();

        clear();

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class JointSolverInfo {

        b1: RigidBody;

        b2: RigidBody;

        numRows: number;

        rows: Array<JointSolverInfoRow>;

        constructor();

        addRow(impulse: JointImpulse): JointSolverInfoRow;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class JointSolverInfoRow {

        /**
         * Used for both velocity and position solver.
         */
        jacobian: JacobianRow;

        /**
         * Used for both velocity and position solver.
         */
        rhs: number;

        /**
         * Used for velocity solver.
         */
        cfm: number;

        /**
         * Used for both velocity and position solver.
         */
        minImpulse: number;

        /**
         * Used for both velocity and position solver.
         */
        maxImpulse: number;

        /**
         * Used for velocity solver.
         */
        motorSpeed: number;

        /**
         * Used for velocity solver.
         */
        motorMaxImpulse: number;

        /**
         * Used for both velocity and position solver.
         */
        impulse: JointImpulse;

        constructor();

        clear();

        equalLimit(rhs: number, cfm: number);

        motor(speed: number, maxImpulse: number);

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class ContactSolverMassDataRow {

        invMLinN1: Vec3;

        /**
         * normal impulse -> linear/angular velocity chang
         */
        invMLinN2: Vec3;

        invMAngN1: Vec3;

        invMAngN2: Vec3;

        invMLinT1: Vec3;

        /**
         * tangent impulse -> linear/angular velocity chang
         */
        invMLinT2: Vec3;

        invMAngT1: Vec3;

        invMAngT2: Vec3;

        invMLinB1: Vec3;

        /**
         * binormal impulse -> linear/angular velocity chang
         */
        invMLinB2: Vec3;

        invMAngB1: Vec3;

        invMAngB2: Vec3;

        massN: number;

        /**
         * normal mas
         */
        massTB00: number;

        /**
         * tangent/binormal mass matrix for cone frictio
         */
        massTB01: number;

        massTB10: number;

        massTB11: number;

        constructor();

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class JointSolverMassDataRow {

        invMLin1: Vec3;

        /**
         * impulse -> linear/angular velocity chang
         */
        invMLin2: Vec3;

        invMAng1: Vec3;

        invMAng2: Vec3;

        mass: number;

        /**
         * mas
         */
        massWithoutCfm: number;

        constructor();

    }

}

declare module OIMO {

    /**
     * A contact constraint solver using projected Gauss-Seidel (sequential impulse).
     */
    export class PgsContactConstraintSolver extends ConstraintSolver {

        constraint: ContactConstraint;

        info: ContactSolverInfo;

        massData: Array<ContactSolverMassDataRow>;

        constructor(constraint: ContactConstraint);

        preSolveVelocity(timeStep: TimeStep);


        warmStart(timeStep: TimeStep);

        /**
         * adjust impulse for variable time ste
         */
        solveVelocity();

    }

}

declare module OIMO {

    /**
     * A joint constraint solver using projected Gauss-Seidel (sequential impulse).
     */
    export class PgsJointConstraintSolver extends ConstraintSolver {

        joint: Joint;

        info: JointSolverInfo;

        massData: Array<JointSolverMassDataRow>;

        constructor(joint: Joint);

        preSolveVelocity(timeStep: TimeStep);

        invM1: number;

        invM2: number;

        invI1: Mat3;

        invI2: Mat3;

        /**
         * compute mass dat
         */
        row: JointSolverInfoRow;

        md: JointSolverMassDataRow;

        j: JacobianRow;

        warmStart(timeStep: TimeStep);

        factor: number;

    }

}

declare module OIMO {

    /**
     * Internal class
     */
    export class Boundary {

        numBounded: number;

        /**
         * number of impulses which are at lower or upper limit
         */
        iBounded: Array<number>;

        /**
         * indices of impulses which are at lower or upper limit
         */
        signs: Array<number>;

        /**
         * -1: at lower, 1: at uppe
         */
        numUnbounded: number;

        /**
         * number of impulses which are not at limit
         */
        iUnbounded: Array<number>;

        /**
         * indices of impulses which are not at lower or upper limit
         */
        b: Array<number>;

        /**
         * used for impulse computation
         * impulse = massMatrix *
         */
        matrixId: number;

        /**
         * the id of mass matri
         */
        constructor(maxRows: number);

        init(buildInfo: BoundaryBuildInfo);

        /**
         * copy bounded par
         * copy unbounded part and compute matrix i
         */
        idx: number;

    }

}

declare module OIMO {

    /**
     * Internal class.
     */
    export class BoundaryBuilder {

        numBoundaries: number;

        boundaries: Array<Boundary>;

        maxRows: number;

        bbInfo: BoundaryBuildInfo;

        constructor(maxRows: number);

    }

}

declare module OIMO {

    /**
     * Internal class
     */
    export class BoundaryBuildInfo {

        size: number;

        /**
         * dimensio
         */
        numBounded: number;

        iBounded: Array<number>;

        signs: Array<number>;

        /**
         * indice
         * sign
         */
        numUnbounded: number;

        iUnbounded: Array<number>;

        /**
         * indice
         * numBounded + numUnbounded <=
         */
        constructor(size: number);

        clear();

        pushBounded(idx: number, sign: number);

        pushUnbounded(idx: number);

        popBounded();

        popUnbounded();

    }

}

declare module OIMO {

    /**
     * Internal Class
     */
    export class BoundarySelector {

        n: number;

        indices: Array<number>;

        tmpIndices: Array<number>;

        constructor(n: number);

        getIndex(i: number): number;

        select(index: number);

        i: number;

        tmp: number;

        /**
         * validate()
         * Makes first n elements the permutation of {0, 1, ... , n-1}
         */
        setSize(size: number);

        numSmaller: number;

        numGreater: number;

        idx: number;

    }

}

declare module OIMO {

    /**
     * The direct solver of a mixed linear complementality problem (MLCP) for
     * joint constraints.
     */
    export class DirectJointConstraintSolver extends ConstraintSolver {

        info: JointSolverInfo;

        massData: Array<JointSolverMassDataRow>;

        relVels: Array<number>;

        impulses: Array<number>;

        dImpulses: Array<number>;

        dTotalImpulses: Array<number>;

        joint: Joint;

        massMatrix: MassMatrix;

        boundaryBuilder: BoundaryBuilder;

        velBoundarySelector: BoundarySelector;

        posBoundarySelector: BoundarySelector;

        constructor(joint: Joint);

        preSolveVelocity(timeStep: TimeStep);

        /**
         * compute inverse mass matri
         * build boundarie
         * update the size of the boundary selecto
         */
        warmStart(timeStep: TimeStep);


        /**
         * apply initial impuls
         */
        solveVelocity();

        /**
         * accumulate the delta impulse
         * apply motor + limit impulse
         * make the priority of the boundary higher for the next iteratio
         */
        postSolveVelocity(timeStep: TimeStep);


        /**
         * compute inverse mass matri
         * build boundarie
         * update the size of the boundary selecto
         */
        preSolvePosition(timeStep: TimeStep);

        /**
         * clear position impulse
         */
        solvePositionSplitImpulse();


        /**
         * accumulate the delta impulse
         * apply delta impulse
         * make the priority of the boundary higher for the next iteratio
         */
        solvePositionNgs(timeStep: TimeStep);


        /**
         * accumulate the delta impulse
         * apply delta impulse
         * make the priority of the boundary higher for the next iteratio
         */
        postSolve();

    }

}

declare module OIMO {

    /**
     * Internal class
     */
    export class MassMatrix {



        /**
         * temp matrix used for computing a inverse matri
         */
        constructor(size: number);

        /**
         * popcount (assuming the size of the matrix is less than 0x100 = 256
         */
        matrixSize: number;

        subMatrix: Array<Array<number>>;

        /**
         * --- private --
         */
        computeSubmatrix(id: number, indices: Array<number>, size: number);

        /**
         * clear cached submatrice
         */
        getSubmatrix(indices: Array<number>, n: number): Array<Array<number>>;


    }

}

declare namespace egret3d.oimo {
    /**
     * 刚体类型。
     */
    const enum RigidbodyType {
        /**
         * 动态。
         */
        DYNAMIC = 0,
        /**
         * 静态。
         */
        STATIC = 1,
        /**
         * 动力学。
         */
        KINEMATIC = 2,
    }
    /**
     * 刚体。
     */
    class Rigidbody extends paper.BaseComponent {
        private static readonly _config;
        private static readonly _massData;
        private readonly _linearVelocity;
        private readonly _angularVelocity;
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        private readonly _values;
        private _oimoRigidbody;
        protected _createRigidbody(): OIMO.RigidBody;
        private _addShapes();
        /**
         *
         */
        wakeUp(): void;
        /**
         *
         */
        sleep(): void;
        /**
         *
         */
        applyForce(force: Readonly<IVector3>, positionInWorld: Readonly<IVector3>): void;
        /**
         *
         */
        applyForceToCenter(force: Readonly<IVector3>): void;
        /**
         *
         */
        applyImpulse(impulse: Readonly<IVector3>, position: Readonly<IVector3>): void;
        /**
         *
         */
        applyTorque(torque: Readonly<IVector3>): void;
        /**
         *
         */
        readonly isSleeping: boolean;
        /**
         * 刚体类型。
         */
        type: RigidbodyType;
        /**
         *
         */
        mass: number;
        /**
         *
         */
        gravityScale: number;
        /**
         *
         */
        linearDamping: number;
        /**
         *
         */
        angularDamping: number;
        /**
         *
         */
        linearVelocity: Readonly<IVector3>;
        /**
         *
         */
        angularVelocity: Readonly<IVector3>;
        /**
         *
         */
        readonly oimoRigidbody: OIMO.RigidBody;
    }
}
declare namespace egret3d.oimo {
    /**
     * 碰撞体基类。
     */
    abstract class BaseCollider extends paper.BaseComponent implements egret3d.ICollider {
        protected static readonly _config: OIMO.ShapeConfig;
        readonly colliderType: egret3d.ColliderType;
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        protected readonly _values: Float32Array;
        protected _oimoShape: OIMO.Shape;
        protected abstract _createShape(): OIMO.Shape;
        protected _updateConfig(): OIMO.ShapeConfig;
        /**
         *
         */
        collisionGroup: paper.CullingMask;
        /**
         *
         */
        collisionMask: paper.CullingMask;
        /**
         *
         */
        friction: number;
        /**
         *
         */
        restitution: number;
        /**
         *
         */
        density: number;
        /**
         *
         */
        readonly oimoShape: OIMO.Shape;
    }
}
declare namespace egret3d.oimo {
    /**
     * 关节类型。
     */
    enum JointType {
        Spherical,
        Prismatic,
        Hinge,
        Cylindrical,
        ConeTwist,
        Universal,
    }
    /**
     * 关节基类。
     */
    abstract class Joint<T extends OIMO.Joint> extends paper.BaseComponent {
        /**
         * 关节类型。
         */
        readonly jointType: JointType;
        protected readonly _anchor: Vector3;
        /**
         *
         */
        protected readonly _values: Float32Array;
        protected _connectedBody: Rigidbody | null;
        protected _rigidbody: Rigidbody;
        protected _oimoJoint: T;
        protected abstract _createJoint(): T;
        /**
         *
         */
        getAppliedForce(out?: IVector3): IVector3;
        /**
         *
         */
        getAppliedTorque(out?: IVector3): IVector3;
        /**
         *
         */
        collisionEnabled: boolean;
        /**
         *
         */
        useGlobalAnchor: boolean;
        /**
         *
         */
        anchor: Readonly<IVector3>;
        /**
         *
         */
        connectedRigidbody: Rigidbody | null;
        /**
         *
         */
        readonly rigidbody: Rigidbody;
        /**
         *
         */
        readonly oimoJoint: T;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class CylinderCollider extends BaseCollider {
        readonly colliderType: ColliderType;
        private _radius;
        private _height;
        protected _createShape(): OIMO.Shape;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        height: number;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class BoxCollider extends BaseCollider {
        readonly colliderType: ColliderType;
        protected readonly _size: Vector3;
        protected _createShape(): OIMO.Shape;
        /**
         *
         */
        size: Readonly<IVector3>;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class CapsuleCollider extends BaseCollider {
        readonly colliderType: ColliderType;
        private _radius;
        private _height;
        protected _createShape(): OIMO.Shape;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        height: number;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class ConeCollider extends BaseCollider {
        readonly colliderType: ColliderType;
        private _radius;
        private _height;
        protected _createShape(): OIMO.Shape;
        /**
         *
         */
        radius: number;
        /**
         *
         */
        height: number;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class RayTester extends paper.Behaviour {
        distance: number;
        collisionMask: paper.CullingMask;
        private _hitted;
        private _mesh;
        onStart(): void;
        onUpdate(): void;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class SphereCollider extends BaseCollider {
        readonly colliderType: ColliderType;
        private _radius;
        protected _createShape(): OIMO.Shape;
        /**
         *
         */
        radius: number;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class ConeTwistJoint extends Joint<OIMO.RagdollJoint> {
        private static readonly _config;
        private static readonly _swingSpringDamper;
        private static readonly _twistSpringDamper;
        private static readonly _twistLimitMotor;
        readonly jointType: JointType;
        private readonly _twistAxis;
        private readonly _swingAxis;
        private readonly _valuesB;
        protected _createJoint(): OIMO.RagdollJoint;
        /**
         *
         */
        twistFrequency: number;
        /**
         *
         */
        twistDampingRatio: number;
        /**
         *
         */
        twistUseSymplecticEuler: boolean;
        /**
         *
         */
        swingFrequency: number;
        /**
         *
         */
        swingDampingRatio: number;
        /**
         *
         */
        swingUseSymplecticEuler: boolean;
        /**
         *
         */
        lowerLimit: number;
        /**
         *
         */
        upperLimit: number;
        /**
         *
         */
        motorSpeed: number;
        /**
         *
         */
        motorTorque: number;
        /**
         *
         */
        maxSwingAngleX: number;
        /**
         *
         */
        maxSwingAngleZ: number;
        /**
         *
         */
        twistAxis: Readonly<IVector3>;
        /**
         *
         */
        swingAxis: Readonly<IVector3>;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class HingeJoint extends Joint<OIMO.RevoluteJoint> {
        private static readonly _config;
        private static readonly _springDamper;
        private static readonly _limitMotor;
        readonly jointType: JointType;
        private readonly _axis;
        private readonly _valuesB;
        protected _createJoint(): OIMO.RevoluteJoint;
        /**
         *
         */
        frequency: number;
        /**
         *
         */
        dampingRatio: number;
        /**
         *
         */
        useSymplecticEuler: boolean;
        /**
         *
         */
        lowerLimit: number;
        /**
         *
         */
        upperLimit: number;
        /**
         *
         */
        motorSpeed: number;
        /**
         *
         */
        motorTorque: number;
        /**
         *
         */
        axis: Readonly<IVector3>;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class PhysicsSystem extends paper.BaseSystem {
        private static _instance;
        /**
         *
         */
        static getInstance(): PhysicsSystem;
        protected readonly _interests: ({
            componentClass: typeof Rigidbody;
        } | {
            componentClass: (typeof BoxCollider | typeof SphereCollider)[];
            type: paper.InterestType;
        } | {
            componentClass: (typeof ConeTwistJoint | typeof HingeJoint | typeof SphericalJoint)[];
            type: paper.InterestType;
        })[][];
        private readonly _gravity;
        private readonly _rayCastClosest;
        private readonly _contactCallback;
        private readonly _contactColliders;
        private _oimoWorld;
        raycast(ray: Ray, distance: number, mask?: paper.CullingMask, raycastInfo?: RaycastInfo): RaycastInfo | null;
        raycast(from: Readonly<IVector3>, to: Readonly<IVector3>, mask?: paper.CullingMask, raycastInfo?: RaycastInfo): RaycastInfo | null;
        onAwake(): void;
        onAddGameObject(gameObject: paper.GameObject, group: paper.GameObjectGroup): void;
        onAddComponent(component: BaseCollider | Joint<any>, group: paper.GameObjectGroup): void;
        onRemoveComponent(component: BaseCollider | Joint<any>, group: paper.GameObjectGroup): void;
        onRemoveGameObject(gameObject: paper.GameObject, group: paper.GameObjectGroup): void;
        onUpdate(): void;
        onDestroy(): void;
        /**
         *
         */
        gravity: Readonly<IVector3>;
        readonly oimoWorld: OIMO.World;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class SphericalJoint extends Joint<OIMO.SphericalJoint> {
        private static readonly _config;
        private static readonly _springDamper;
        readonly jointType: JointType;
        private readonly _valuesB;
        protected _createJoint(): OIMO.SphericalJoint;
        /**
         *
         */
        frequency: number;
        /**
         *
         */
        dampingRatio: number;
        /**
         *
         */
        useSymplecticEuler: boolean;
    }
}
declare namespace egret3d.oimo {
    /**
     *
     */
    class UniversalJoint extends Joint<OIMO.UniversalJoint> {
        private static readonly _config;
        private static readonly _springDamperY;
        private static readonly _springDamperZ;
        private static readonly _limitMotorY;
        private static readonly _limitMotorZ;
        readonly jointType: JointType;
        private readonly _axisY;
        private readonly _axisZ;
        private readonly _valuesB;
        protected _createJoint(): OIMO.UniversalJoint;
        /**
         *
         */
        frequencyY: number;
        /**
         *
         */
        dampingRatioY: number;
        /**
         *
         */
        useSymplecticEulerY: boolean;
        /**
         *
         */
        frequencyZ: number;
        /**
         *
         */
        dampingRatioZ: number;
        /**
         *
         */
        useSymplecticEulerZ: boolean;
        /**
         *
         */
        lowerLimitY: number;
        /**
         *
         */
        upperLimitY: number;
        /**
         *
         */
        motorSpeedY: number;
        /**
         *
         */
        motorTorqueY: number;
        /**
         *
         */
        lowerLimitZ: number;
        /**
         *
         */
        upperLimitZ: number;
        /**
         *
         */
        motorSpeedZ: number;
        /**
         *
         */
        motorTorqueZ: number;
        /**
         *
         */
        axisY: Readonly<IVector3>;
        /**
         *
         */
        axisZ: Readonly<IVector3>;
    }
}
