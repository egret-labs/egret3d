namespace egret3d {
    /**
     * 
     */
    export const RAD_DEG: number = 180.0 / Math.PI;
    /**
     * 
     */
    export const DEG_RAD: number = Math.PI / 180.0;
    /**
     * 
     */
    export const EPSILON = 2.220446049250313e-16; // Number.EPSILON

    export function sign(value: number): number {
        if (value === 0 || value !== value) {
            return value;
        }

        return value > 0 ? 1 : -1;
    }

    export function floatClamp(v: number, min: number = 0.0, max: number = 1.0) {
        if (v < min)
            return min;
        else if (v > max)
            return max;
        else
            return v;
    }

    export function numberLerp(fromV: number, toV: number, v: number) {
        return fromV * (1 - v) + toV * v;
    }

    export function getNormal(a: Readonly<IVector3>, b: Readonly<IVector3>, c: Readonly<IVector3>, out: Vector3) {
        out.subtract(c, b);
        helpVector3A.subtract(a, b);
        out.cross(helpVector3A);

        const squaredLength = out.squaredLength;
        if (squaredLength > 0.0) {
            return out.multiplyScalar(1.0 / Math.sqrt(squaredLength));
        }

        return out.set(0.0, 0.0, 1.0);
    }

    export function calPlaneLineIntersectPoint(planeVector: Vector3, planePoint: Vector3, lineVector: Vector3, linePoint: Vector3, out: Vector3): Vector3 {
        let vp1 = planeVector.x;
        let vp2 = planeVector.y;
        let vp3 = planeVector.z;
        let n1 = planePoint.x;
        let n2 = planePoint.y;
        let n3 = planePoint.z;
        let v1 = lineVector.x;
        let v2 = lineVector.y;
        let v3 = lineVector.z;
        let m1 = linePoint.x;
        let m2 = linePoint.y;
        let m3 = linePoint.z;
        let vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
        if (vpt === 0) {
            out = null;
        } else {
            let t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
            out.x = m1 + v1 * t;
            out.y = m2 + v2 * t;
            out.z = m3 + v3 * t;
        }
        return out;
    }
}