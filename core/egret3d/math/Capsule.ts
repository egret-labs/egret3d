namespace egret3d {
    /**
     * 几何胶囊体。
     * - 与 Y 轴对齐。
     */
    export class Capsule extends paper.BaseRelease<Capsule> implements paper.ICCS<Capsule>, paper.ISerializable, IRaycast {
        private static readonly _instances: Capsule[] = [];
        /**
         * 创建一个几何胶囊体。
         * @param center 中心点。
         * @param radius 半径。
         */
        public static create(center: Readonly<IVector3> = Vector3.ZERO, radius: number = 0.0, height: number = 0.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(center, radius, height);
                instance._released = false;

                return instance;
            }

            return new Capsule().set(center, radius, height);
        }
        /**
         * 该胶囊体的半径。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public radius: number = 0.0;
        /**
         * 该胶囊体圆柱部分的高度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public height: number = 0.0;
        /**
         * 该胶囊体的中心点。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Capsule.create()` 创建实例。
         * @see egret3d.Capsule.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.center.x, this.center.y, this.center.z, this.radius, this.height];
        }

        public deserialize(value: Readonly<[number, number, number, number, number]>) {
            this.radius = value[3];
            this.height = value[4];
            this.center.fromArray(value);

            return this;
        }

        public clone() {
            return Capsule.create(this.center, this.radius, this.height);
        }

        public copy(value: Readonly<Capsule>) {
            return this.set(value.center, value.radius, value.height);
        }

        public set(center: Readonly<IVector3>, radius: number, height: number) {
            this.radius = radius;
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
            const { radius, center } = this;
            const halfHeight = this.height * 0.5;

            if (y < center.y - halfHeight - radius || center.y + halfHeight + radius < y) {
                return false;
            }

            if (x < center.x - radius || center.x + radius < x) {
                return false;
            }

            if (z < center.z - radius || center.z + radius < z) {
                return false;
            }

            const dX = x - center.x;
            const dY = y - center.y;
            const dZ = z - center.z;
            const radius2 = radius * radius;

            if (halfHeight > 0.0) {
                if (dY < -halfHeight) {
                    const bottomCenter = helpVector3A.copy(center);
                    bottomCenter.y -= halfHeight;

                    return bottomCenter.getSquaredDistance(point) <= radius2;
                }
                else if (halfHeight < dY) {
                    const bottomCenter = helpVector3A.copy(center);
                    bottomCenter.y += halfHeight;

                    return bottomCenter.getSquaredDistance(point) <= radius2;
                }

                return (dX * dX + dZ * dZ) <= radius2;

            }

            return center.getSquaredDistance(point) <= radius2;
        }


        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            const { radius, center } = this;
            const halfHeight = this.height * 0.5;
            const begin = helpVector3A.copy(ray.origin).subtract(center);
            const end = helpVector3B.multiplyScalar(100000.0, ray.direction).add(begin); // TODO 精度问题。

            const p1x = begin.x;
            const p1y = begin.y;
            const p1z = begin.z;
            const p2x = end.x;
            const p2y = end.y;
            const p2z = end.z;

            const radius2 = radius * radius;

            const dx = p2x - p1x;
            const dy = p2y - p1y;
            const dz = p2z - p1z;

            // XZ
            let tminxz = 0.0;
            let tmaxxz = 1.0;
            const a = dx * dx + dz * dz;
            const b = p1x * dx + p1z * dz;
            const c = (p1x * p1x + p1z * p1z) - radius2;
            const d = b * b - a * c;

            if (d < 0.0) return false;

            if (a > 0.0) {
                const sqrtD = Math.sqrt(d);
                const ia = 1.0 / a;
                tminxz = (-b - sqrtD) * ia;
                tmaxxz = (-b + sqrtD) * ia;

                if (tminxz >= 1.0 || tmaxxz <= 0.0) return false;
            }
            else {
                if (c >= 0.0) return false;

                tminxz = 0.0;
                tmaxxz = 1.0;
            }

            let min: number;
            const crossY = p1y + dy * tminxz;

            if (-halfHeight < crossY && crossY < halfHeight) {
                if (tminxz > 0.0) {
                    // hit: side
                    min = tminxz;

                    if (raycastInfo) {
                        const px = p1x + min * dx;
                        const py = p1z + min * dy;
                        raycastInfo.distance = min;
                        raycastInfo.position.set(px, crossY, py).add(center);

                        if (raycastInfo.normal) {
                            raycastInfo.normal.set(px, 0.0, py).normalize();
                        }
                    }

                    return true;
                }

                return false;
            }
            // Sphere test.
            const sphereCenter = helpVector3C.set(center.x, center.y + (crossY < 0.0 ? -halfHeight : halfHeight), center.z);
            const v1 = helpVector3D.subtract(sphereCenter, ray.origin);
            const tca = v1.dot(ray.direction);
            const d2 = v1.dot(v1) - tca * tca;

            if (d2 > radius2) return false;

            const thc = Math.sqrt(radius2 - d2);
            const t0 = tca - thc;
            const t1 = tca + thc;

            if (t0 < 0.0 || t1 < 0.0) return false;

            if (raycastInfo) {
                const position = ray.getPointAt(raycastInfo.distance = t0, raycastInfo.position);
                const normal = raycastInfo.normal;

                if (normal) {
                    normal.subtract(position, sphereCenter).normalize();
                }
            }

            return true;
        }
    }
}
