namespace egret3d {

    export class Angelref {
        v: number;
    }

    export class Matrix3x2 {
        public rawData: Float32Array;

        constructor(datas: Float32Array = null) {
            if (datas) {
                this.rawData = datas;
            }
            else {
                this.rawData = new Float32Array([1, 0, 0, 0, 1, 0]);
            }
        }

        public static multiply(lhs: Matrix3x2, rhs: Matrix3x2, out: Matrix3x2): Matrix3x2 {
            let a00 = lhs.rawData[0], a01 = lhs.rawData[1], a02 = 0;
            let a10 = lhs.rawData[2], a11 = lhs.rawData[3], a12 = 0;
            let a30 = lhs.rawData[4], a31 = lhs.rawData[5], a32 = 1;

            let b0 = rhs.rawData[0],
                b1 = rhs.rawData[1],
                b3 = 0;

            out.rawData[0] = b0 * a00 + b1 * a10 + b3 * a30;
            out.rawData[1] = b0 * a01 + b1 * a11 + b3 * a31;

            b0 = rhs.rawData[2];
            b1 = rhs.rawData[3];

            b3 = 0;

            out.rawData[2] = b0 * a00 + b1 * a10 + b3 * a30;
            out.rawData[3] = b0 * a01 + b1 * a11 + b3 * a31;

            b0 = rhs.rawData[4];
            b1 = rhs.rawData[5];
            b3 = 1;

            out.rawData[4] = b0 * a00 + b1 * a10 + b3 * a30;
            out.rawData[5] = b0 * a01 + b1 * a11 + b3 * a31;

            return out;
        }

        public static fromRotate(angle: number, out: Matrix3x2): Matrix3x2 {
            let x = 0,
                y = 0,
                z = 1;

            let s = Math.sin(angle);
            let c = Math.cos(angle);


            out.rawData[0] = c;
            out.rawData[1] = s;

            out.rawData[2] = -s;
            out.rawData[3] = c;

            out.rawData[4] = 0;
            out.rawData[5] = 0;
            return out;
        }

        public static fromScale(xScale: number, yScale: number, out: Matrix3x2): Matrix3x2 {
            out.rawData[0] = xScale; out.rawData[1] = 0.0;
            out.rawData[2] = 0.0; out.rawData[3] = yScale;
            out.rawData[4] = 0.0; out.rawData[5] = 0.0;
            return out;
        }

        public static fromTranslate(x: number, y: number, out: Matrix3x2): Matrix3x2 {
            out.rawData[0] = 1.0; out.rawData[1] = 0.0;
            out.rawData[2] = 0.0; out.rawData[3] = 1.0;
            out.rawData[4] = x; out.rawData[5] = y;
            return out;
        }

        public static fromRTS(pos: Vector2, scale: Vector2, rot: number, out: Matrix3x2) {
            let matS = helpMat3x2_1;
            this.fromScale(scale.x, scale.y, matS);
            let matR = helpMat3x2_2;
            this.fromRotate(rot, matR);
            this.multiply(matR, matS, out);

            out.rawData[4] = pos.x;
            out.rawData[5] = pos.y;
        }

        public static transformVector2(mat: Matrix, inp: Vector2, out: Vector2): Vector2 {
            out.x = inp.x * mat.rawData[0] + inp.y * mat.rawData[2] + mat.rawData[4];
            out.y = inp.x * mat.rawData[1] + inp.y * mat.rawData[3] + mat.rawData[5];
            return out;
        }

        public static transformNormal(mat: Matrix, inp: Vector2, out: Vector2): Vector2 {
            out.x = inp.x * mat.rawData[0] + inp.y * mat.rawData[2];
            out.y = inp.x * mat.rawData[1] + inp.y * mat.rawData[3];
            return out;
        }

        public static inverse(src: Matrix3x2, out: Matrix3x2): Matrix3x2 {
            let l1 = src.rawData[0];
            let l2 = src.rawData[1];
            let l5 = src.rawData[2];
            let l6 = src.rawData[3];
            let l13 = src.rawData[4];
            let l14 = src.rawData[5];

            let l26 = -(((l5 * -l14) - (l6 * -l13)));
            let l27 = 1.0 / ((((l1 * l6) + (l2 * -l5))));


            out.rawData[0] = l6 * l27;
            out.rawData[2] = -l5 * l27;
            out.rawData[4] = l26 * l27;
            out.rawData[1] = -(((l2))) * l27;
            out.rawData[3] = (((l1))) * l27;
            out.rawData[5] = (((l1 * -l14) - (l2 * -l13))) * l27;
            return out;
        }

        public static identify(out: Matrix3x2): Matrix3x2 {
            out.rawData[0] = 1;
            out.rawData[1] = 0;

            out.rawData[2] = 0;
            out.rawData[3] = 1;

            out.rawData[4] = 0;
            out.rawData[5] = 0;

            return out;
        }

        public static copy(src: Matrix3x2, out: Matrix3x2): Matrix3x2 {
            for (let i = 0; i < 16; i++) {
                out.rawData[i] = src.rawData[i];
            }
            return out;
        }

        public static decompose(src: Matrix3x2, scale: Vector2, rotation: Angelref, translation: Vector2): boolean {
            translation.x = src.rawData[4];
            translation.y = src.rawData[5];

            let xs = sign(src.rawData[0] * src.rawData[1]) < 0 ? -1 : 1;
            let ys = sign(src.rawData[2] * src.rawData[3]) < 0 ? -1 : 1;

            scale.x = xs * Math.sqrt(src.rawData[0] * src.rawData[0] + src.rawData[1] * src.rawData[1]);
            scale.y = ys * Math.sqrt(src.rawData[2] * src.rawData[2] + src.rawData[3] * src.rawData[3]);

            if (scale.x === 0 || scale.y === 0) {
                rotation.v = 0;
                return false;
            }

            let sx = src.rawData[0] / scale.x;
            let csx = src.rawData[1] / scale.x;
            let r1 = Math.asin(sx);
            let r2 = Math.acos(csx);
            rotation.v = r1;
            return true;
        }
    }

    let helpMat3x2_1: Matrix3x2 = new Matrix3x2();
    let helpMat3x2_2: Matrix3x2 = new Matrix3x2();
}