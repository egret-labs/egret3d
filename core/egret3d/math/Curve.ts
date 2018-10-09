namespace egret3d {
    /**
     * 
     * 贝塞尔曲线，目前定义了三种：线性贝塞尔曲线(两个点形成),二次方贝塞尔曲线（三个点形成），三次方贝塞尔曲线（四个点形成）
     */
    export class Curve3 {
        /**
        * 贝塞尔曲线上的点，不包含第一个点
        */
        beizerPoints: egret3d.Vector3[];

        /**
        * 贝塞尔曲线上所有的个数
        */
        bezierPointNum: number;

        /**
         * 线性贝塞尔曲线
         */
        public static createLinearBezier(start: egret3d.Vector3, end: egret3d.Vector3, indices: number): Curve3 {
            indices = indices > 2 ? indices : 3;
            let bez = new Array<egret3d.Vector3>();
            let equation = (t: number, va10: number, va11: number) => {
                let res = (1.0 - t) * va10 + t * va11;
                return res;
            }

            bez.push(start);
            for (let i = 1; i <= indices; i++) {
                bez.push(new egret3d.Vector3(equation(i / indices, start.x, end.x), equation(i / indices, start.y, start.y), equation(i / indices, start.z, start.z)));
            }

            return new Curve3(bez, indices);
        }

        /**
         * 二次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 选中的节点
         * @param v2 结尾点
         * @param bezierPointNum 将贝塞尔曲线拆分bezierPointNum段，一共有bezierPointNum + 1个点
         * @returns 贝塞尔曲线对象
         */
        public static createQuadraticBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, bezierPointNum: number): Curve3 {
            bezierPointNum = bezierPointNum > 2 ? bezierPointNum : 3;
            let beizerPoint = new Array<egret3d.Vector3>();
            let equation = (t: number, val0: number, val1: number, val2: number) => {
                let res = (1.0 - t) * (1.0 - t) * val0 + 2.0 * t * (1.0 - t) * val1 + t * t * val2;
                return res;
            }
            for (let i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new egret3d.Vector3(equation(i / bezierPointNum, v0.x, v1.x, v2.x), equation(i / bezierPointNum, v0.y, v1.y, v2.y), equation(i / bezierPointNum, v0.z, v1.z, v2.z)));
            }

            return new Curve3(beizerPoint, bezierPointNum);
        }

        /**
         * 三次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 第一个插值点
         * @param v2 第二个插值点
         * @param v3 终点
         * @param bezierPointNum 将贝塞尔曲线拆分bezierPointNum段，一共有bezierPointNum + 1个点
         * @returns 贝塞尔曲线对象
         */
        public static createCubicBezier(v0: egret3d.Vector3, v1: egret3d.Vector3, v2: egret3d.Vector3, v3: egret3d.Vector3, bezierPointNum: number): Curve3 {
            bezierPointNum = bezierPointNum > 3 ? bezierPointNum : 4;
            let beizerPoint = new Array<egret3d.Vector3>();
            let equation = (t: number, val0: number, val1: number, val2: number, val3: number) => {
                let res = (1.0 - t) * (1.0 - t) * (1.0 - t) * val0 + 3.0 * t * (1.0 - t) * (1.0 - t) * val1 + 3.0 * t * t * (1.0 - t) * val2 + t * t * t * val3;
                return res;
            }
            for (let i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new egret3d.Vector3(equation(i / bezierPointNum, v0.x, v1.x, v2.x, v3.x), equation(i / bezierPointNum, v0.y, v1.y, v2.y, v3.y), equation(i / bezierPointNum, v0.z, v1.z, v2.z, v3.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        }

        /**
         * @internal
         */
        constructor(beizerPoints: egret3d.Vector3[], bezierPointNum: number) {
            this.beizerPoints = beizerPoints;
            this.bezierPointNum = bezierPointNum;
        }
    }
}