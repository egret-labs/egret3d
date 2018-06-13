namespace egret3d {

    const tmpVecA = new Vector3();
    const tmpVecB = new Vector3();
    const tmpVecC = new Vector3();
    const tmpVecD = new Vector3();
    const tmpVecE = new Vector3();

    /**
     * aabb box
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 轴对称包围盒
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class AABB {
        /**
         * min point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 最小点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public readonly minimum: Vector3 = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

        /**
         * max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public readonly maximum: Vector3 = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

        private _dirtyCenter: boolean = true;
        private _dirtyRadius: boolean = true;

        // TODO local bounding box 与 world bounding box 分离
        private srcmin: Vector3 = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        private srcmax: Vector3 = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

        /**
         * build a aabb
         * @param minimum min point
         * @param maximum max point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 构建轴对称包围盒
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        constructor(minimum?: Vector3, maximum?: Vector3) {
            if (minimum) {
                Vector3.copy(minimum, this.srcmin);
                Vector3.copy(minimum, this.minimum);
            }

            if (maximum) {
                Vector3.copy(maximum, this.srcmax);
                Vector3.copy(maximum, this.maximum);
            }
        }

        /**
         * update
         * @param worldmatrix world matrix
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 刷新轴对称包围盒
         * @param worldmatrix 物体的世界矩阵
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public update(worldmatrix: Matrix) {
            Matrix.getTranslation(worldmatrix, tmpVecA);
            Matrix.getTranslation(worldmatrix, tmpVecB);
            if (worldmatrix.rawData[0] > 0) {
                tmpVecA.x += worldmatrix.rawData[0] * this.srcmin.x;
                tmpVecB.x += worldmatrix.rawData[0] * this.srcmax.x;
            } else {
                tmpVecA.x += worldmatrix.rawData[0] * this.srcmax.x;
                tmpVecB.x += worldmatrix.rawData[0] * this.srcmin.x;
            }
            if (worldmatrix.rawData[1] > 0) {
                tmpVecA.y += worldmatrix.rawData[1] * this.srcmin.y;
                tmpVecB.y += worldmatrix.rawData[1] * this.srcmax.y;
            } else {
                tmpVecA.y += worldmatrix.rawData[1] * this.srcmax.y;
                tmpVecB.y += worldmatrix.rawData[1] * this.srcmin.y;
            }
            if (worldmatrix.rawData[2] > 0) {
                tmpVecA.z += worldmatrix.rawData[2] * this.srcmin.z;
                tmpVecB.z += worldmatrix.rawData[2] * this.srcmax.z;
            } else {
                tmpVecA.z += worldmatrix.rawData[2] * this.srcmax.z;
                tmpVecB.z += worldmatrix.rawData[2] * this.srcmin.z;
            }
            if (worldmatrix.rawData[4] > 0) {
                tmpVecA.x += worldmatrix.rawData[4] * this.srcmin.x;
                tmpVecB.x += worldmatrix.rawData[4] * this.srcmax.x;
            } else {
                tmpVecA.x += worldmatrix.rawData[4] * this.srcmax.x;
                tmpVecB.x += worldmatrix.rawData[4] * this.srcmin.x;
            }
            if (worldmatrix.rawData[5] > 0) {
                tmpVecA.y += worldmatrix.rawData[5] * this.srcmin.y;
                tmpVecB.y += worldmatrix.rawData[5] * this.srcmax.y;
            } else {
                tmpVecA.y += worldmatrix.rawData[5] * this.srcmax.y;
                tmpVecB.y += worldmatrix.rawData[5] * this.srcmin.y;
            }
            if (worldmatrix.rawData[6] > 0) {
                tmpVecA.z += worldmatrix.rawData[6] * this.srcmin.z;
                tmpVecB.z += worldmatrix.rawData[6] * this.srcmax.z;
            } else {
                tmpVecA.z += worldmatrix.rawData[6] * this.srcmax.z;
                tmpVecB.z += worldmatrix.rawData[6] * this.srcmin.z;
            }
            if (worldmatrix.rawData[8] > 0) {
                tmpVecA.x += worldmatrix.rawData[8] * this.srcmin.x;
                tmpVecB.x += worldmatrix.rawData[8] * this.srcmax.x;
            } else {
                tmpVecA.x += worldmatrix.rawData[8] * this.srcmax.x;
                tmpVecB.x += worldmatrix.rawData[8] * this.srcmin.x;
            }
            if (worldmatrix.rawData[9] > 0) {
                tmpVecA.y += worldmatrix.rawData[9] * this.srcmin.y;
                tmpVecB.y += worldmatrix.rawData[9] * this.srcmax.y;
            } else {
                tmpVecA.y += worldmatrix.rawData[9] * this.srcmax.y;
                tmpVecB.y += worldmatrix.rawData[9] * this.srcmin.y;
            }
            if (worldmatrix.rawData[10] > 0) {
                tmpVecA.z += worldmatrix.rawData[10] * this.srcmin.z;
                tmpVecB.z += worldmatrix.rawData[10] * this.srcmax.z;
            } else {
                tmpVecA.z += worldmatrix.rawData[10] * this.srcmax.z;
                tmpVecB.z += worldmatrix.rawData[10] * this.srcmin.z;
            }

            Vector3.copy(tmpVecA, this.minimum);
            Vector3.copy(tmpVecB, this.maximum);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
        }

        /**
         * extend by a point
         * @param vec a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含一个点
         * @param vec 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public addVector3(vec: Vector3) {
            Vector3.max(this.maximum, vec, this.maximum);
            Vector3.min(this.minimum, vec, this.minimum);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
        }

        /**
         * check contains vector
         * @param vec a world point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否包含点
         * @param vec 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public containsVector3(vec: Vector3): boolean {
            return (vec.x > this.minimum.x) && (vec.x < this.maximum.x) &&
                (vec.y > this.minimum.y) && (vec.x < this.maximum.y) &&
                (vec.z > this.minimum.z) && (vec.z < this.maximum.z);
        }

        /**
         * intersect with aabb
         * @param aabb aabb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 检查是否与aabb相交
         * @param aabb 轴对称包围盒
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public intersectAABB(aabb: AABB): boolean {
            if (this.minimum.x > aabb.maximum.x) return false;
            if (this.maximum.x < aabb.minimum.x) return false;
            if (this.minimum.x > aabb.maximum.x) return false;
            if (this.maximum.x < aabb.minimum.x) return false;
            if (this.minimum.x > aabb.maximum.x) return false;
            if (this.maximum.x < aabb.minimum.x) return false;
            return true;
        }

        /**
         * 
         * 用于视锥检测的计算，引擎内部使用
         * 这里采用包围球式计算以提高性能
         */
        public intersectPlane(v0: Vector3, v1: Vector3, v2: Vector3) {
            let subV0 = tmpVecA;
            let subV1 = tmpVecB;
            let cross = tmpVecC;
            let hitPoint = tmpVecD;
            let distVec = tmpVecE;

            let center = this.center;

            Vector3.subtract(v1, v0, subV0);
            Vector3.subtract(v2, v1, subV1);
            Vector3.cross(subV0, subV1, cross);

            calPlaneLineIntersectPoint(cross, v0, cross, center, hitPoint);

            Vector3.subtract(hitPoint, center, distVec);

            let val = Vector3.dot(cross, distVec);

            if (val <= 0) {
                return true;
            }

            let dist = Vector3.getDistance(center, hitPoint);

            if (dist < this.radius) {
                return true;
            }

            return false;
        }

        /**
         * extend by aabb
         * @param aabb aabb
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含一个aabb
         * @param aabb 轴对称包围盒
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public addAABB(aabb: egret3d.AABB) {
            Vector3.max(this.maximum, aabb.maximum, this.maximum);
            Vector3.min(this.minimum, aabb.minimum, this.minimum);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
        }

        private _center: Vector3 = new Vector3();

        /**
         * get center
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取中心点位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get center(): Vector3 {
            if (this._dirtyCenter) {
                Vector3.add(this.maximum, this.minimum, this._center);
                Vector3.scale(this._center, 0.5);
                this._dirtyCenter = false;
            }
            return this._center;
        }

        /**
         * get bounding sphere radius
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取包围球的半径
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get radius(): number {
            if (this._dirtyRadius) {
                Vector3.subtract(this.maximum, this.minimum, tmpVecA);
                Vector3.scale(tmpVecA, 0.5);
                this._dirtyRadius = false;
            }
            return Vector3.getLength(tmpVecA);
        }

        /**
         * clear
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 清空
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public clear() {
            Vector3.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, this.minimum);
            Vector3.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, this.maximum);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
        }

        /**
         * clone
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 克隆
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public clone(): AABB {
            let aabb: AABB = new egret3d.AABB(this.minimum, this.maximum);
            return aabb;
        }

        /**
         * copy
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 复制
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public copy(aabb: AABB): AABB {
            Vector3.copy(aabb.minimum, this.minimum);
            Vector3.copy(aabb.maximum, this.maximum);

            this._dirtyCenter = true;
            this._dirtyRadius = true;

            return this;
        }

        /**
         * get vectors
         * @param vecs output vectors
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取包围盒顶点数据
         * @param vecs 引用数组
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getVec3(vecs: Vector3[]) {
            vecs[0] = Vector3.copy(this.minimum, new Vector3());
            vecs[1] = Vector3.copy(this.minimum, new Vector3());
            vecs[1].z = this.maximum.z;
            vecs[2] = Vector3.copy(this.minimum, new Vector3());
            vecs[2].x = this.maximum.x;
            vecs[3] = Vector3.copy(this.maximum, new Vector3());
            vecs[3].y = this.minimum.y;
            vecs[4] = Vector3.copy(this.minimum, new Vector3());
            vecs[4].y = this.maximum.y;
            vecs[5] = Vector3.copy(this.maximum, new Vector3());
            vecs[5].x = this.minimum.x;
            vecs[6] = Vector3.copy(this.maximum, new Vector3());
            vecs[6].z = this.minimum.z;
            vecs[7] = Vector3.copy(this.maximum, new Vector3());
        }
    }
}