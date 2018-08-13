namespace egret3d {

    const _helpVector3A = new Vector3();
    const _helpVector3B = new Vector3();

    /**
     * obb box
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 定向包围盒
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class OBB extends paper.BaseObject {

        /**
         * center
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒中心
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        @paper.serializedField
        public readonly center: Vector3 = new Vector3();

        /**
         * size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒各轴向长
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        @paper.serializedField
        public readonly size: Vector3 = new Vector3();

        /**
         * vectors
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包围盒世界空间下各个点坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public readonly vectors: Readonly<[Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3, Vector3]> = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
        ];

        private readonly _directions: Readonly<[Vector3, Vector3, Vector3]> = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
        ];

        private _computeBoxExtents(axis: Readonly<Vector3>, box: Readonly<OBB>, out: Vector3) {
            const p = Vector3.dot(box.center, axis);
            //
            const r0 = Math.abs(Vector3.dot((box as OBB)._directions[0], axis)) * box.size.x * 0.5;
            const r1 = Math.abs(Vector3.dot((box as OBB)._directions[1], axis)) * box.size.y * 0.5;
            const r2 = Math.abs(Vector3.dot((box as OBB)._directions[2], axis)) * box.size.z * 0.5;
            //
            const r = r0 + r1 + r2;
            out.x = p - r;
            out.y = p + r;

            return out;
        }

        private _axisOverlap(axis: Vector3, a: OBB, b: OBB) {
            const resultA = this._computeBoxExtents(axis, a, _helpVector3A);
            const resultB = this._computeBoxExtents(axis, b, _helpVector3B);

            return !(resultA.x > resultA.y || resultB.x > resultB.y);
        }

        /**
         * clone a obb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆一个obb
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public clone() {
            const value = new OBB();
            Vector3.copy(this.center, value.center);
            Vector3.copy(this.center, value.size);

            for (const key in this._directions) {
                Vector3.copy(this._directions[key], value._directions[key]);
            }

            return value;
        }

        /**
         * build by min point and max point
         * @param minimum min point
         * @param maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由最大最小点构建定向包围盒
         * @param minimum 最小点坐标
         * @param maximum 最大点坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setByMaxMin(minimum: Readonly<Vector3>, maximum: Readonly<Vector3>) {
            Vector3.copy(minimum, this.vectors[0]);
            Vector3.copy(minimum, this.vectors[1]);
            Vector3.copy(minimum, this.vectors[2]);
            Vector3.copy(maximum, this.vectors[3]);
            Vector3.copy(minimum, this.vectors[4]);
            Vector3.copy(maximum, this.vectors[5]);
            Vector3.copy(maximum, this.vectors[6]);
            Vector3.copy(maximum, this.vectors[7]);
            //
            this.vectors[1].z = maximum.z;
            this.vectors[2].x = maximum.x;
            this.vectors[3].y = minimum.y;
            this.vectors[4].y = maximum.y;
            this.vectors[5].x = minimum.x;
            this.vectors[6].z = minimum.z;
            //
            Vector3.add(maximum, minimum, this.center);
            Vector3.scale(this.center, 0.5);
            Vector3.subtract(maximum, minimum, this.size);
        }

        /**
         * build by center and size
         * @param center center
         * @param size size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由中心点和各轴向长度构建定向包围盒
         * @param center 中心点坐标
         * @param size 各轴向长度
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setByCenterSize(center: Readonly<Vector3>, size: Readonly<Vector3>) {
            Vector3.copy(center, this.center);
            Vector3.copy(size, this.size);
            //
            const hsx = this.size.x * 0.5;
            const hsy = this.size.y * 0.5;
            const hsz = this.size.z * 0.5;
            const cenx = this.center.x;
            const ceny = this.center.y;
            const cenz = this.center.z;
            //
            Vector3.set(cenx - hsx, ceny - hsy, cenz - hsz, this.vectors[0]);
            Vector3.set(cenx - hsx, ceny - hsy, cenz + hsz, this.vectors[1]);
            Vector3.set(cenx + hsx, ceny - hsy, cenz - hsz, this.vectors[2]);
            Vector3.set(cenx + hsx, ceny - hsy, cenz + hsz, this.vectors[3]);
            Vector3.set(cenx - hsx, ceny + hsy, cenz - hsz, this.vectors[4]);
            Vector3.set(cenx - hsx, ceny + hsy, cenz + hsz, this.vectors[5]);
            Vector3.set(cenx + hsx, ceny + hsy, cenz - hsz, this.vectors[6]);
            Vector3.set(cenx + hsx, ceny + hsy, cenz + hsz, this.vectors[7]);
        }

        /**
         * update by world matrix
         * @param worldmatrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 刷新定向包围盒
         * @param worldmatrix 世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public update(matrix: Readonly<Matrix>) {
            matrix.decompose(this.center);
            this._directions[0].fromMatrix(matrix, 0);
            this._directions[0].fromMatrix(matrix, 4);
            this._directions[0].fromMatrix(matrix, 8);
        }
        /**
         * intersect width obb
         * @param value obb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * obb的碰撞检测
         * @param value 待检测obb
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public intersects(value: Readonly<OBB>) {
            const a = this;
            const b = value as OBB;
            //
            if (!this._axisOverlap(a._directions[0], a, b)) return false;
            if (!this._axisOverlap(a._directions[1], a, b)) return false;
            if (!this._axisOverlap(a._directions[2], a, b)) return false;
            if (!this._axisOverlap(b._directions[0], a, b)) return false;
            if (!this._axisOverlap(b._directions[1], a, b)) return false;
            if (!this._axisOverlap(b._directions[2], a, b)) return false;

            const result = _helpVector3A;

            Vector3.cross(a._directions[0], b._directions[0], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[0], b._directions[1], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[0], b._directions[2], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[1], b._directions[0], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[1], b._directions[1], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[1], b._directions[2], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[2], b._directions[0], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[2], b._directions[1], result);
            if (!this._axisOverlap(result, a, b)) return false;
            Vector3.cross(a._directions[2], b._directions[2], result);
            if (!this._axisOverlap(result, a, b)) return false;

            return true;
        }

        /**
         * update vectors by world matrix
         * @param vectors vectors
         * @param matrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算世界空间下各点坐标
         * @param vectors 结果数组
         * @param matrix 物体的世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public caclWorldVectors(vectors: ReadonlyArray<Vector3>, matrix: Readonly<Matrix>) {
            for (let i = 0; i < 8; ++i) {
                matrix.transformVector3(this.vectors[i], vectors[i]);
            }
        }

        public deserialize(element: { center: [number, number, number], size: [number, number, number] }) {
            this.center.deserialize(element.center);
            this.size.deserialize(element.size);

            return this;
        }
    }
}
