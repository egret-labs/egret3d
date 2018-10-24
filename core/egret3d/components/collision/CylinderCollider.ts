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
        public readonly center: Vector3 = egret3d.Vector3.create();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const transform = this.gameObject.transform;
            const localRay = helpRay.applyMatrix(transform.inverseWorldMatrix, ray);
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
                raycastInfo.position.set(p1x + min * dx, p1y + min * dy, p1z + min * dz).add(this.center);

                const worldMatrix = transform.worldMatrix;
                raycastInfo.position.applyMatrix(worldMatrix);
                raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);

                const normal = raycastInfo.normal;
                if (normal) {
                    normal.applyDirection(worldMatrix).normalize();
                }
            }

            return true;

            // // Y
            // let tminy: number = 0.0;
            // let tmaxy: number = 1.0;
            // if (dy > Const.EPSILON && dy < Const.EPSILON) {
            //     if (p1y <= -halfHeight || p1y >= halfHeight) {
            //         return false;
            //     }
            // }
            // else {
            //     const invDy = 1.0 / dy;
            //     let t1 = (-halfHeight - p1y) * invDy;
            //     let t2 = (halfHeight - p1y) * invDy;
            //     if (t1 > t2) {
            //         const tmp = t1;
            //         t1 = t2;
            //         t2 = tmp;
            //     }
            //     if (t1 > 0.0) tminy = t1;
            //     if (t2 < 1.0) tmaxy = t2;
            // }
            // if (tminy >= 1.0 || tmaxy <= 0.0) return false;

            // // XZ
            // let tminxz: number;
            // let tmaxxz: number;

            // p1y -= halfHeight; // translate so that the new origin be (0, -halfH, 0)

            // const cos2 = cosTheta * cosTheta;
            // const a = cos2 * (dx * dx + dy * dy + dz * dz) - dy * dy;
            // const b = cos2 * (p1x * dx + p1y * dy + p1z * dz) - p1y * dy;
            // const c = cos2 * (p1x * p1x + p1y * p1y + p1z * p1z) - p1y * p1y;
            // const d = b * b - a * c;
            // if (a !== 0.0) {
            //     if (d < 0.0) return false;

            //     const sqrtD = Math.sqrt(d);
            //     if (a < 0.0) {
            //         // ((-inf, t1) union (t2, +inf)) join (0, 1)
            //         if (dy > 0.0) {
            //             // (0, t1)
            //             tminxz = 0.0;
            //             tmaxxz = (-b + sqrtD) / a;
            //             if (tmaxxz <= 0.0) return false;
            //         }
            //         else {
            //             // (t2, 1)
            //             tminxz = (-b - sqrtD) / a;
            //             tmaxxz = 1.0;
            //             if (tminxz >= 1.0) return false;
            //         }
            //     }
            //     else {
            //         // (t1, t2) join (0, 1)
            //         tminxz = (-b - sqrtD) / a;
            //         tmaxxz = (-b + sqrtD) / a;
            //         if (tminxz >= 1.0 || tmaxxz <= 0.0) return false;
            //     }
            // }
            // else {
            //     const t = -c / (2.0 * b);
            //     if (b > 0) {
            //         // (0, t)
            //         tminxz = 0;
            //         tmaxxz = t;
            //         if (t <= 0) return false;
            //     }
            //     else {
            //         // (t, 1)
            //         tminxz = t;
            //         tmaxxz = 1;
            //         if (t >= 1) return false;
            //     }
            // }

            // p1y += halfHeight; // revert translation

            // let min: number;
            // if (tmaxxz <= tminy || tmaxy <= tminxz) return false;
            // if (tminxz < tminy) {
            //     min = tminy;
            //     if (min == 0) return false; // the ray starts from inside
            //     hit.normal.init(0, dy > 0 ? -1 : 1, 0);
            // } else {
            //     min = tminxz;
            //     if (min == 0) return false; // the ray starts from inside
            //     hit.normal.init(p1x + dx * min, 0, p1z + dz * min).normalize().scaleEq(cosTheta);
            //     hit.normal.y += sinTheta;
            // }

            // hit.position.init(p1x + min * dx, p1y + min * dy, p1z + min * dz);
            // hit.fraction = min;
            // return true;




            // if (this.box.raycast(localRay, raycastInfo)) {
            //     if (raycastInfo) {
            //         const worldMatrix = transform.worldMatrix;
            //         raycastInfo.position.applyMatrix(worldMatrix);
            //         raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);

            //         const normal = raycastInfo.normal;
            //         if (normal) {
            //             normal.applyDirection(worldMatrix).normalize();
            //         }
            //     }

            //     return true;
            // }

            // return false;
        }
    }
}