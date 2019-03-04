namespace egret3d {
    /**
     * 几何圆柱（椎）体。
     * - 与 Y 轴对齐。
     */
    export class Cylinder extends paper.BaseRelease<Cylinder> implements paper.ICCS<Cylinder>, paper.ISerializable, IRaycast {
        private static readonly _instances: Cylinder[] = [];
        /**
         * 创建一个几何圆柱（椎）体。
         * @param center 中心点。
         * @param radius 半径。
         */
        public static create(center: Readonly<IVector3> = Vector3.ZERO, topRadius: number = 0.0, bottomRadius: number = 0.0, height: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(center, topRadius, bottomRadius, height);
                instance._released = false;

                return instance;
            }

            return new Cylinder().set(center, topRadius, bottomRadius, height);
        }
        /**
         * 该圆柱（锥）体的顶部半径。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public topRadius: number = 0.0;
        /**
         * 该圆柱（锥）体的底部半径。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public bottomRadius: number = 0.0;
        /**
         * 该圆柱（锥）体的高度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public height: number = 0.0;
        /**
         * 该圆柱（锥）体的中心点。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Cylinder.create()` 创建实例。
         * @see egret3d.Cylinder.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.center.x, this.center.y, this.center.z, this.topRadius, this.bottomRadius, this.height];
        }

        public deserialize(value: Readonly<[number, number, number, number, number, number]>) {
            this.topRadius = value[3];
            this.bottomRadius = value[4];
            this.height = value[5];
            this.center.fromArray(value);

            return this;
        }

        public clone() {
            return Cylinder.create(this.center, this.topRadius, this.bottomRadius, this.height);
        }

        public copy(value: Readonly<Cylinder>) {
            return this.set(value.center, value.topRadius, value.bottomRadius, value.height);
        }

        public set(center: Readonly<IVector3>, topRadius: number, bottomRadius: number, height: number) {
            this.topRadius = topRadius;
            this.bottomRadius = bottomRadius;
            this.height = height;
            this.center.copy(center);

            return this;
        }
        /**
         * 该几何体是否包含指定的点。
         * @param point 一个点。
         */
        public contains(point: Readonly<IVector3>): boolean {
            const { x, y, z } = point;
            const { topRadius, bottomRadius, height, center } = this;
            const halfHeight = height * 0.5;

            if (y < center.y - halfHeight || center.y + halfHeight < y) {
                return false;
            }

            const maxRadius = topRadius < bottomRadius ? bottomRadius : topRadius;

            if (x < center.x - maxRadius || center.x + maxRadius < x) {
                return false;
            }

            if (z < center.z - maxRadius || center.z + maxRadius < z) {
                return false;
            }

            const dX = x - center.x;
            const dY = y - (center.y + halfHeight);
            const dZ = z - center.z;
            const dRadius = math.lerp(topRadius, bottomRadius, dY / height);

            return (dX * dX + dZ * dZ) <= dRadius * dRadius;
        }

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const { topRadius, bottomRadius, height, center } = this;
            const begin = helpVector3A.copy(ray.origin).subtract(center);
            const end = helpVector3B.multiplyScalar(100000.0, ray.direction).add(begin);

            // Oimo CylinderGeometr, ConeGeometry. TODO

            const p1x = begin.x;
            const p1y = begin.y;
            const p1z = begin.z;
            const p2x = end.x;
            const p2y = end.y;
            const p2z = end.z;

            const halfHeight = height * 0.5;
            const radius = this.bottomRadius;
            // const dRadius = this.bottomRadius - this.topRadius;
            // const ddd = Math.sqrt(dRadius * dRadius + height * height);
            // const sinTheta = dRadius / ddd;
            // const cosTheta = height / ddd;
            const dx = p2x - p1x;
            const dy = p2y - p1y;
            const dz = p2z - p1z;

            // Y
            let tminy = 0.0;
            let tmaxy = 1.0;

            if (-Const.EPSILON < dy && dy < Const.EPSILON) {
                if (p1y <= -halfHeight || halfHeight <= p1y) {
                    return false;
                }
            }
            else {
                const invDy = 1.0 / dy;
                let t1 = (-halfHeight - p1y) * invDy;
                let t2 = (halfHeight - p1y) * invDy;

                if (t1 > t2) {
                    const tmp = t1;
                    t1 = t2;
                    t2 = tmp;
                }

                if (t1 > 0.0) tminy = t1;
                if (t2 < 1.0) tmaxy = t2;
            }

            if (tminy >= 1.0 || tmaxy <= 0.0) return false;

            // XZ
            let tminxz = 0.0;
            let tmaxxz = 1.0;
            const a = dx * dx + dz * dz;
            const b = p1x * dx + p1z * dz;
            const c = (p1x * p1x + p1z * p1z) - radius * radius;
            const d = b * b - a * c;

            if (d < 0.0) return false;

            if (a > 0.0) {
                const sqrtD = Math.sqrt(d);
                tminxz = (-b - sqrtD) / a;
                tmaxxz = (-b + sqrtD) / a;

                if (tminxz >= 1.0 || tmaxxz <= 0.0) return false;
            }
            else {
                if (c >= 0.0) return false;

                tminxz = 0.0;
                tmaxxz = 1.0;
            }

            let min: number;

            if (tmaxxz <= tminy || tmaxy <= tminxz) return false;

            if (tminxz < tminy) {
                min = tminy;

                if (min === 0.0) return false; // the ray starts from inside

                if (raycastInfo && raycastInfo.normal) {
                    raycastInfo.normal.set(0.0, dy > 0.0 ? -1.0 : 1.0, 0.0);
                }
            }
            else {
                min = tminxz;

                if (min === 0.0) return false; // the ray starts from inside

                if (raycastInfo && raycastInfo.normal) {
                    raycastInfo.normal.set(p1x + dx * min, 0.0, p1z + dz * min).normalize();
                }
            }

            if (raycastInfo) {
                raycastInfo.distance = min;
                raycastInfo.position
                    .set(p1x + min * dx, p1y + min * dy, p1z + min * dz)
                    .add(center);
            }

            return true;
        }
    }
}
