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

    let helpVec3_1: Vector3 = new Vector3();
    let helpVec3_2: Vector3 = new Vector3();
    let helpVec3_3: Vector3 = new Vector3();
    let helpVec3_4: Vector3 = new Vector3();
    let helpVec3_5: Vector3 = new Vector3();

    export function getPointAlongCurve(curveStart: Vector3, curveStartHandle: Vector3, curveEnd: Vector3, curveEndHandle: Vector3, t: number, out: Vector3, crease: number = 0.3) {
        let oneMinT = 1 - t;
        let oneMinTPow3 = Math.pow(oneMinT, 3);
        let oneMinTPow2 = Math.pow(oneMinT, 2);

        let oneMinCrease = 1 - crease;

        let tempt1 = helpVec3_1;
        Vector3.copy(curveStart, tempt1);
        Vector3.scale(tempt1, oneMinTPow3 * oneMinCrease);
        let tempt2 = helpVec3_2;
        Vector3.copy(curveStartHandle, tempt2);
        Vector3.scale(tempt2, 3 * oneMinTPow2 * t * crease);
        let tempt3 = helpVec3_3;
        Vector3.copy(curveEndHandle, tempt3);
        Vector3.scale(tempt3, 3 * oneMinT * Math.pow(t, 2) * crease);
        let tempt4 = helpVec3_4;
        Vector3.copy(curveEnd, tempt4);
        Vector3.scale(tempt4, Math.pow(t, 3) * oneMinCrease);

        let tempt5 = helpVec3_5;
        Vector3.add(tempt1, tempt2, tempt5);
        Vector3.add(tempt5, tempt3, tempt5);
        Vector3.add(tempt5, tempt4, tempt5);

        Vector3.copy(tempt5, out);
        Vector3.scale(out, 1 / (oneMinTPow3 * oneMinCrease + 3 * oneMinTPow2 * t * crease + 3 * oneMinT * Math.pow(t, 2) * crease + Math.pow(t, 3) * oneMinCrease));
    }
}