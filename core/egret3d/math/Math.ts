namespace egret3d {
    /**
     * 
     */
    export namespace math {
        /**
         * 
         */
        export function euclideanModulo(n: number, m: number): number {
            return ((n % m) + m) % m;
        }
        /**
         * 
         */
        export function clamp(v: number, min: number = 0.0, max: number = 1.0) {
            if (v < min) {
                return min;
            }
            else if (v > max) {
                return max;
            }
            else {
                return v;
            }
        }
        /**
         * 
         */
        export function lerp(from: number, to: number, t: number) {
            return from + (to - from) * t;
        }

        export function frustumIntersectsSphere(frustum: Readonly<Frustum>, sphere: Readonly<Sphere>) {
            const planes = frustum.planes;
            const center = sphere.center;
            const negRadius = -sphere.radius;

            for (const plane of planes) {
                const distance = plane.getDistance(center);
                if (distance < negRadius) {
                    return false;
                }
            }

            return true;
        }

        export function isPowerOfTwo(value: number): boolean {
            return (value & (value - 1)) === 0 && value !== 0;
        }
    }
    /**
     * 内联的数字常数枚举。
     */
    export const enum Const {

        /**
         * 弧度制到角度制相乘的系数。
         */
        RAD_DEG = 57.29577951308232,

        /**
         * 角度制到弧度制相乘的系数。
         */
        DEG_RAD = 0.017453292519943295,

        /**
         * 大于零的最小正值。
         * - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
         */
        EPSILON = 2.2204460492503130808472633361816E-16,
    }

    export function sign(value: number): number {
        if (value === 0 || value !== value) {
            return value;
        }


        return value > 0 ? 1 : -1;
    }

    // export function triangleIntersectsPlane() {

    // }

    function satForAxes(axes: Readonly<number[]>) {
        const v0 = helpVector3A;
        const v1 = helpVector3B;
        const v2 = helpVector3C;
        const extents = helpVector3H;
        const testAxis = helpVector3A;

        for (let i = 0, l = axes.length - 3; i <= l; i += 3) {
            testAxis.fromArray(axes, i);
            // project the aabb onto the seperating axis
            const r = extents.x * Math.abs(testAxis.x) + extents.y * Math.abs(testAxis.y) + extents.z * Math.abs(testAxis.z);
            // project all 3 vertices of the triangle onto the seperating axis
            const p0 = v0.dot(testAxis);
            const p1 = v1.dot(testAxis);
            const p2 = v2.dot(testAxis);
            // actual test, basically see if either of the most extreme of the triangle points intersects r
            if (Math.max(- Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r) {
                // points of the projected triangle are outside the projected half-length of the aabb
                // the axis is seperating and we can exit
                return false;
            }
        }

        return true;
    }

    export function triangleIntersectsAABB(triangle: Readonly<Triangle>, aabb: Readonly<Box>) {
        if (aabb.isEmpty) {
            return false;
        }

        const v0 = helpVector3A;
        const v1 = helpVector3B;
        const v2 = helpVector3C;
        // triangle edge vectors
        const f0 = helpVector3D;
        const f1 = helpVector3E;
        const f2 = helpVector3F;
        const center = helpVector3G;
        const extents = helpVector3H;

        // compute box center and extents
        extents.subtract(aabb.maximum, aabb.center);
        // translate triangle to aabb origin
        v0.subtract(triangle.a, center);
        v1.subtract(triangle.b, center);
        v2.subtract(triangle.c, center);
        // compute edge vectors for triangle
        f0.subtract(v1, v0);
        f1.subtract(v2, v1);
        f2.subtract(v0, v2);
        // test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
        // make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
        // axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
        let axes = [
            0, - f0.z, f0.y, 0, - f1.z, f1.y, 0, - f2.z, f2.y,
            f0.z, 0, - f0.x, f1.z, 0, - f1.x, f2.z, 0, - f2.x,
            - f0.y, f0.x, 0, - f1.y, f1.x, 0, - f2.y, f2.x, 0
        ];
        if (!satForAxes(axes)) {
            return false;
        }
        // test 3 face normals from the aabb
        axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        if (!satForAxes(axes)) {
            return false;
        }
        // finally testing the face normal of the triangle
        // use already existing triangle edge vectors here
        helpVector3A.cross(f0, f1);
        axes = [helpVector3A.x, helpVector3A.y, helpVector3A.z];
        return satForAxes(axes);
    }

    export function planeIntersectsAABB(plane: Readonly<Plane>, aabb: Readonly<Box>) {
        // We compute the minimum and maximum dot product values. If those values
        // are on the same side (back or front) of the plane, then there is no intersection.
        let vMin: number;
        let vMax: number;
        const min = aabb.minimum;
        const max = aabb.maximum;

        if (plane.normal.x > 0.0) {
            vMin = plane.normal.x * min.x;
            vMax = plane.normal.x * max.x;
        }
        else {
            vMin = plane.normal.x * max.x;
            vMax = plane.normal.x * min.x;
        }

        if (plane.normal.y > 0.0) {
            vMin += plane.normal.y * min.y;
            vMax += plane.normal.y * max.y;
        }
        else {
            vMin += plane.normal.y * max.y;
            vMax += plane.normal.y * min.y;
        }

        if (plane.normal.z > 0.0) {
            vMin += plane.normal.z * min.z;
            vMax += plane.normal.z * max.z;
        }
        else {
            vMin += plane.normal.z * max.z;
            vMax += plane.normal.z * min.z;
        }

        return vMin <= plane.constant && vMax >= plane.constant;
    }

    export function planeIntersectsSphere(plane: Readonly<Plane>, sphere: Readonly<Sphere>) {
        return Math.abs(plane.getDistance(sphere.center)) <= sphere.radius;
    }

    export function aabbIntersectsSphere(aabb: Readonly<Box>, sphere: Readonly<Sphere>) {
        // Find the point on the AABB closest to the sphere center.
        helpVector3A.copy(sphere.center).clamp(aabb.minimum, aabb.maximum);
        // If that point is inside the sphere, the AABB and sphere intersect.
        return helpVector3A.getSquaredDistance(sphere.center) <= (sphere.radius * sphere.radius);
    }

    export function aabbIntersectsAABB(valueA: Readonly<Box>, valueB: Readonly<Box>) {
        const minA = valueA.minimum;
        const maxA = valueA.maximum;
        const minB = valueB.minimum;
        const maxB = valueB.maximum;
        // using 6 splitting planes to rule out intersections.
        return maxA.x < minB.x || minA.x > maxB.x ||
            maxA.y < minB.y || minA.y > maxB.y ||
            maxA.z < minB.z || minA.z > maxB.z ? false : true;
    }

    export function sphereIntersectsSphere(valueA: Readonly<Sphere>, valueB: Readonly<Sphere>) {
        const radiusSum = valueA.radius + valueB.radius;

        return valueA.center.getSquaredDistance(valueB.center) <= (radiusSum * radiusSum);
    }


}