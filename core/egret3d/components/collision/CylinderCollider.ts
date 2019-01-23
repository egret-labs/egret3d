namespace egret3d {
    /**
     * 圆柱（锥）碰撞组件。
     * - 与 Y 轴对齐。
     */
    @paper.allowMultiple
    export class CylinderCollider extends paper.BaseComponent implements IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Cylinder;

        /**
         * 该圆柱（锥）的顶部半径。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public topRadius: number = 0.5;

        /**
         * 该圆柱（锥）的底部半径。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public bottomRadius: number = 0.5;

        /**
         * 该圆柱（锥）的高度。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public height: number = 1.0;

        /**
         * 该圆柱（锥）的中心点。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: Vector3 = Vector3.create();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const transform = this.gameObject.transform;
            const worldToLocalMatrix = transform.worldToLocalMatrix;
            const localRay = helpRay.applyMatrix(worldToLocalMatrix, ray);
            localRay.origin.subtract(this.center);
            const end = Vector3.create().multiplyScalar(999999.0, localRay.direction).add(localRay.origin).release();

            // Oimo CylinderGeometr, ConeGeometry. TODO

            const p1x = localRay.origin.x;
            let p1y = localRay.origin.y;
            const p1z = localRay.origin.z;
            const p2x = end.x;
            const p2y = end.y;
            const p2z = end.z;

            const height = this.height;
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
            if (dy > Const.EPSILON && dy < Const.EPSILON) {
                if (p1y <= -halfHeight || p1y >= halfHeight) {
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
                const localToWorldMatrix = transform.localToWorldMatrix;
                raycastInfo.distance = ray.origin.getDistance(
                    raycastInfo.position
                        .set(p1x + min * dx, p1y + min * dy, p1z + min * dz)
                        .add(this.center)
                        .applyMatrix(localToWorldMatrix)
                );
                raycastInfo.transform = transform;
                raycastInfo.collider = this;

                const normal = raycastInfo.normal;
                if (normal) {
                    // normal.applyDirection(localToWorldMatrix);
                    normal.applyMatrix3(helpMatrix3A.fromMatrix4(worldToLocalMatrix).transpose()).normalize();
                }
            }

            return true;
        }
    }
}