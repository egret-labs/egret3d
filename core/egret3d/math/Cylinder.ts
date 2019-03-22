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
        public static create(center: Readonly<IVector3> = Vector3.ZERO, topRadius: float = 0.0, bottomRadius: float = 0.0, height: float = 0.0) {
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
        public topRadius: float = 0.0;
        /**
         * 该圆柱（锥）体的底部半径。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public bottomRadius: float = 0.0;
        /**
         * 该圆柱（锥）体的高度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public height: float = 0.0;
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

        public deserialize(value: Readonly<[float, float, float, float, float, float]>) {
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

        public set(center: Readonly<IVector3>, topRadius: float, bottomRadius: float, height: float) {
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

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            const { topRadius, bottomRadius, height, center } = this;
            const begin = helpVector3A.copy(ray.origin).subtract(center);
            const end = helpVector3B.multiplyScalar(100000.0, ray.direction).add(begin); // TODO 精度问题。
            const isCone = topRadius !== bottomRadius;

            const p1x = begin.x;
            let p1y = begin.y;
            const p1z = begin.z;
            const p2x = end.x;
            const p2y = end.y;
            const p2z = end.z;

            const halfHeight = height * 0.5;
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
            let sinTheta = 0.0;
            let cosTheta = 0.0;

            if (isCone) {
                const dRadius = bottomRadius - topRadius;
                const cc = Math.sqrt(dRadius * dRadius + height * height);
                const offsetY = height / dRadius * bottomRadius - halfHeight;
                p1y -= offsetY; // translate so that the new origin be (0, -offsetY, 0)

                sinTheta = dRadius / cc;
                cosTheta = height / cc;

                const cos2 = cosTheta * cosTheta;
                const a = cos2 * (dx * dx + dy * dy + dz * dz) - dy * dy;
                const b = cos2 * (p1x * dx + p1y * dy + p1z * dz) - p1y * dy;
                const c = cos2 * (p1x * p1x + p1y * p1y + p1z * p1z) - p1y * p1y;
                const d = b * b - a * c;

                if (a !== 0.0) {
                    if (d < 0.0) return false;

                    const sqrtD = Math.sqrt(d);
                    const ia = 1.0 / a;

                    if (a < 0.0) {
                        if (dy > 0.0) {
                            tminxz = 0.0;
                            tmaxxz = (-b + sqrtD) * ia;

                            if (tmaxxz <= 0.0) return false;
                        }
                        else {
                            tminxz = (-b - sqrtD) * ia;
                            tmaxxz = 1.0;

                            if (tminxz >= 1.0) return false;
                        }
                    }
                    else {
                        tminxz = (-b - sqrtD) * ia;
                        tmaxxz = (-b + sqrtD) * ia;

                        if (tminxz >= 1.0 || tmaxxz <= 0.0) return false;
                    }
                }
                else {
                    const t = -c / (2.0 * b);

                    if (b > 0.0) {
                        tminxz = 0.0;
                        tmaxxz = t;

                        if (t <= 0.0) return false;
                    }
                    else {
                        tminxz = t;
                        tmaxxz = 1.0;

                        if (t >= 1.0) return false;
                    }
                }

                p1y += offsetY; // revert translation
            }
            else {
                const a = dx * dx + dz * dz;
                const b = p1x * dx + p1z * dz;
                const c = (p1x * p1x + p1z * p1z) - bottomRadius * bottomRadius;
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
            }

            let min: float;

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

                    if (isCone) {
                        raycastInfo.normal.multiplyScalar(cosTheta);
                        raycastInfo.normal.y += sinTheta;
                    }
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
