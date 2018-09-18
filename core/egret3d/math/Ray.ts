namespace egret3d {
    /**
     * 射线
     */
    export class Ray implements paper.IRelease<Ray>, paper.ISerializable {

        private static readonly _instances: Ray[] = [];

        public static create(origin: Readonly<IVector3> = Vector3.ZERO, direction: Readonly<IVector3> = Vector3.FORWARD) {
            if (this._instances.length > 0) {
                return this._instances.pop()!.set(origin, direction);
            }

            return new Ray().set(origin, direction);
        }

        public release() {
            if (Ray._instances.indexOf(this) >= 0) {
                Ray._instances.push(this);
            }

            return this;
        }

        /**
         * 射线起始点
         */
        public readonly origin: Vector3 = Vector3.create();
        /**
         * 射线的方向向量
         */
        public readonly direction: Vector3 = Vector3.create();
        /**
         * 请使用 `egret3d.Ray.create()` 创建实例。
         * @see egret3d.Ray.create()
         */
        private constructor() { }

        public serialize() {
            return [this.origin.x, this.origin.y, this.origin.z, this.direction.x, this.direction.y, this.direction.z];
        }

        public deserialize(value: Readonly<[number, number, number, number, number, number]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<Ray>) {
            return this.set(value.origin, value.direction);
        }

        public clone() {
            return Ray.create(this.origin, this.direction);
        }

        public set(origin: Readonly<IVector3>, direction: Readonly<IVector3>) {
            this.origin.copy(origin);
            this.direction.copy(direction);

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.origin.fromArray(value, offset);
            this.direction.fromArray(value, offset + 3);

            return this;
        }

        public applyMatrix(value: Readonly<Matrix4>, ray?: Readonly<Ray>) {
            this.origin.applyMatrix(value, (ray || this).origin);
            this.direction.applyDirection(value, (ray || this).direction).normalize();

            return this;
        }

        public getSquaredDistance(value: Readonly<IVector3>): number {
            const directionDistance = helpVector3A.subtract(value, this.origin).dot(this.direction);
            // point behind the ray
            if (directionDistance < 0.0) {
                return this.origin.getSquaredDistance(value);
            }

            helpVector3A.multiplyScalar(directionDistance, this.direction).add(this.origin);

            return helpVector3A.getSquaredDistance(value);
        }

        public getDistance(value: Readonly<IVector3>): number {
            return Math.sqrt(this.getSquaredDistance(value));
        }

        public at(value: number, out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            out.multiplyScalar(value, this.direction).add(this.origin);

            return out;
        }
        /**
         * 与三角形相交检测。
         * TODO
         */
        public intersectTriangle(p1: Readonly<Vector3>, p2: Readonly<Vector3>, p3: Readonly<Vector3>, backfaceCulling: boolean = false): RaycastInfo | null {
            // // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
            // const edge1 = helpVector3A;
            // const edge2 = helpVector3B;
            // const diff = helpVector3C;
            // const normal = helpVector3D;

            // edge1.subtract(p2, p1);
            // edge2.subtract(p3, p1);
            // normal.cross(edge1, edge2);

            // // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
            // // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
            // //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
            // //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
            // //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
            // let DdN = this.direction.dot(normal);
            // let sign = 1.0;

            // if (DdN > 0.0) {
            //     if (backfaceCulling) return null;
            // }
            // else if (DdN < 0.0) {
            //     sign = -1.0;
            //     DdN = -DdN;
            // }
            // else {
            //     return null;
            // }

            // diff.subtract(this.origin, p1);
            // const DdQxE2 = sign * this.direction.dot(edge2.cross(diff, edge2));
            // // b1 < 0, no intersection
            // if (DdQxE2 < 0.0) {
            //     return null;
            // }

            // const DdE1xQ = sign * this.direction.dot(edge1.cross(diff));
            // // b2 < 0, no intersection
            // if (DdE1xQ < 0.0) {
            //     return null;
            // }
            // // b1+b2 > 1, no intersection
            // if (DdQxE2 + DdE1xQ > DdN) {
            //     return null;
            // }
            // // Line intersects triangle, check if ray does.
            // const QdN = - sign * diff.dot(normal);
            // // t < 0, no intersection
            // if (QdN < 0) {
            //     return null;
            // }

            // const pickInfo = new PickInfo();
            // pickInfo.distance = QdN / DdN;
            // pickInfo.position.multiplyScalar(pickInfo.distance, this.direction).add(this.origin);
            // pickInfo.textureCoordA.x = DdQxE2;
            // pickInfo.textureCoordA.y = DdE1xQ;

            // return pickInfo;
            // TODO
            const edge1 = helpVector3A;
            const edge2 = helpVector3B;
            const pvec = helpVector3C;
            const tvec = helpVector3D;
            const qvec = helpVector3E;

            edge1.subtract(p2, p1);
            edge2.subtract(p3, p1);
            pvec.cross(this.direction, edge2);

            const det = pvec.dot(edge1);
            if (det === 0.0) {
                return null;
            }

            const invdet = 1.0 / det;

            tvec.subtract(this.origin, p1);

            const bu = pvec.dot(tvec) * invdet;
            if (bu < 0.0 || bu > 1.0) {
                return null;
            }

            qvec.cross(tvec, edge1);

            const bv = qvec.dot(this.direction) * invdet;

            if (bv < 0.0 || bu + bv > 1.0) {
                return null;
            }

            const raycastInfo = new RaycastInfo();
            raycastInfo.distance = qvec.dot(edge2) * invdet;
            raycastInfo.position.multiplyScalar(raycastInfo.distance, this.direction).add(this.origin);
            raycastInfo.textureCoordA.x = bu;
            raycastInfo.textureCoordA.y = bv;

            return raycastInfo;
        }

        public intersectPlane(planePoint: Vector3, planeNormal: Vector3) {
            let vp1 = planeNormal.x;
            let vp2 = planeNormal.y;
            let vp3 = planeNormal.z;
            let n1 = planePoint.x;
            let n2 = planePoint.y;
            let n3 = planePoint.z;
            let v1 = this.direction.x;
            let v2 = this.direction.y;
            let v3 = this.direction.z;
            let m1 = this.origin.x;
            let m2 = this.origin.y;
            let m3 = this.origin.z;
            let vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
            if (vpt === 0) {
                return null;
            } else {
                let t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
                return new Vector3(m1 + v1 * t, m2 + v2 * t, m3 + v3 * t);
            }
        }
        // TODO
        // public intersectPlane(plane: Readonly<Plane>): RaycastInfo | null;
        // public intersectPlane(plane: Readonly<IVector3>, normal: Readonly<IVector3>): RaycastInfo | null;
        // public intersectPlane(p1: Readonly<Plane | IVector3>, p2?: Readonly<IVector3>) {
        //     if (p1 instanceof Plane) {
        //         // TODO
        //         return null;
        //     }
        //     else {
        //         let vp1 = (p2 as Readonly<IVector3>).x;
        //         let vp2 = (p2 as Readonly<IVector3>).y;
        //         let vp3 = (p2 as Readonly<IVector3>).z;
        //         let n1 = (p1 as Readonly<IVector3>).x;
        //         let n2 = (p1 as Readonly<IVector3>).y;
        //         let n3 = (p1 as Readonly<IVector3>).z;
        //         let v1 = this.direction.x;
        //         let v2 = this.direction.y;
        //         let v3 = this.direction.z;
        //         let m1 = this.origin.x;
        //         let m2 = this.origin.y;
        //         let m3 = this.origin.z;
        //         let vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;

        //         if (vpt === 0) {
        //             return null;
        //         }
        //         else {
        //             const raycastInfo = RaycastInfo.create();
        //             raycastInfo.distance = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
        //             raycastInfo.position.multiplyScalar(raycastInfo.distance, this.direction).add(this.origin);
        //             return raycastInfo;
        //         }
        //     }
        // }
        /**
         * 与 AABB 相交检测。
         */
        public intersectAABB(aabb: Readonly<AABB>, raycastInfo?: RaycastInfo): boolean;
        public intersectAABB(minimum: Readonly<IVector3>, maximum: Readonly<IVector3>, raycastInfo?: RaycastInfo): boolean;
        public intersectAABB(p1: Readonly<AABB> | Readonly<IVector3>, p2?: RaycastInfo | Readonly<IVector3>, p3?: RaycastInfo) {
            const isA = p1 instanceof AABB;
            const minimum = isA ? (p1 as Readonly<AABB>).minimum : p1 as Readonly<IVector3>;
            const maximum = isA ? (p1 as Readonly<AABB>).maximum : p2 as Readonly<IVector3>;

            let tmin: number, tmax: number, tymin: number, tymax: number, tzmin: number, tzmax: number;
            const invdirx = 1.0 / this.direction.x,
                invdiry = 1.0 / this.direction.y,
                invdirz = 1.0 / this.direction.z;
            const origin = this.origin;

            if (invdirx >= 0.0) {
                tmin = (minimum.x - origin.x) * invdirx;
                tmax = (maximum.x - origin.x) * invdirx;
            }
            else {
                tmin = (maximum.x - origin.x) * invdirx;
                tmax = (minimum.x - origin.x) * invdirx;
            }

            if (invdiry >= 0.0) {
                tymin = (minimum.y - origin.y) * invdiry;
                tymax = (maximum.y - origin.y) * invdiry;
            }
            else {
                tymin = (maximum.y - origin.y) * invdiry;
                tymax = (minimum.y - origin.y) * invdiry;
            }

            if ((tmin > tymax) || (tymin > tmax)) return false;

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN

            if (tymin > tmin || tmin !== tmin) tmin = tymin;

            if (tymax < tmax || tmax !== tmax) tmax = tymax;

            if (invdirz >= 0.0) {
                tzmin = (minimum.z - origin.z) * invdirz;
                tzmax = (maximum.z - origin.z) * invdirz;
            }
            else {
                tzmin = (maximum.z - origin.z) * invdirz;
                tzmax = (minimum.z - origin.z) * invdirz;
            }

            if ((tmin > tzmax) || (tzmin > tmax)) return false;

            if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

            if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

            // return point closest to the ray (positive side)

            if (tmax < 0.0) return false;

            const raycastInfo = isA ? p2 as RaycastInfo | undefined : p3;
            if (raycastInfo) {
                this.at(raycastInfo.distance = tmin >= 0.0 ? tmin : tmax, raycastInfo.position);
            }

            return true;
        }
        /**
         * 与球相交检测。
         */
        public intersectSphere(sphere: Readonly<Sphere>, raycastInfo?: RaycastInfo): boolean;
        public intersectSphere(center: Readonly<IVector3>, radius: number, raycastInfo?: RaycastInfo): boolean;
        public intersectSphere(p1: Readonly<Sphere> | Readonly<IVector3>, p2?: RaycastInfo | number, p3?: RaycastInfo) {
            const isA = p1 instanceof AABB;
            const center = isA ? (p1 as Readonly<Sphere>).center : p1 as Readonly<IVector3>;
            const radius = isA ? (p1 as Readonly<Sphere>).radius : p2 as number;
            const v1 = helpVector3A.subtract(center, this.origin);
            const tca = v1.dot(this.direction);
            const d2 = v1.dot(v1) - tca * tca;
            const radius2 = radius * radius;

            if (d2 > radius2) return false;

            const thc = Math.sqrt(radius2 - d2);

            // t0 = first intersect point - entrance on front of sphere
            const t0 = tca - thc;

            // t1 = second intersect point - exit point on back of sphere
            const t1 = tca + thc;

            // test to see if both t0 and t1 are behind the ray - if so, return null
            if (t0 < 0.0 && t1 < 0.0) return false;

            // test to see if t0 is behind the ray:
            // if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
            // in order to always return an intersect point that is in front of the ray.

            // else t0 is in front of the ray, so return the first collision point scaled by t0

            const raycastInfo = isA ? p2 as RaycastInfo | undefined : p3;
            if (raycastInfo) {
                this.at(raycastInfo.distance = t0 < 0.0 ? t1 : t0, raycastInfo.position);
            }

            return true;

            // let center_ori = helpVec3_1;
            // Vector3.subtract(center, this.origin, center_ori);
            // let raydist = Vector3.dot(this.direction, center_ori);

            // if (raydist < 0) return false; // 到圆心的向量在方向向量上的投影为负，夹角不在-90与90之间

            // let orilen2 = Vector3.getSqrLength(center_ori);

            // let rad2 = radius * radius;

            // if (orilen2 < rad2) return true; // 射线起点在球里

            // let d = rad2 - (orilen2 - raydist * raydist);
            // if (d < 0) return false;

            // return true;
        }
        /**
         * @deprecated
         */
        public static raycast(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): RaycastInfo | null {
            return this._doPick(ray, maxDistance, layerMask, false, isPickMesh) as RaycastInfo | null;
        }

        /**
         * @deprecated
         */
        public static raycastAll(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): RaycastInfo[] | null {
            return this._doPick(ray, maxDistance, layerMask, true, isPickMesh) as RaycastInfo[] | null;
        }

        private static _doPick(ray: Ray, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer, pickAll: boolean = false, isPickMesh: boolean = false) {
            const pickedList: RaycastInfo[] = [];

            for (const gameObject of paper.Application.sceneManager.activeScene.getRootGameObjects()) {
                if (gameObject.layer & layerMask) {
                    if (isPickMesh) {
                        this._pickMesh(ray, gameObject.transform, pickedList);
                    }
                    else {
                        this._pickCollider(ray, gameObject.transform, pickedList);
                    }
                }
            }

            if (pickedList.length === 0) {
                return null;
            }

            if (pickAll) {
                return pickedList;
            }

            let index = 0;
            for (let i = 1; i < pickedList.length; i++) {
                if (pickedList[i].distance < pickedList[index].distance) {
                    index = i;
                }
            }

            return pickedList[index];

        }

        private static _pickMesh(ray: Ray, transform: Transform, pickInfos: RaycastInfo[]) {
            if (transform.gameObject.activeInHierarchy) {
                const meshFilter = transform.gameObject.getComponent(MeshFilter);
                if (meshFilter) {
                    const mesh = meshFilter.mesh;
                    if (mesh) {
                        const pickinfo = mesh.raycast(ray, transform.getWorldMatrix());
                        if (pickinfo) {
                            pickInfos.push(pickinfo);
                            pickinfo.transform = transform;
                        }
                    }
                }
                else {
                    const skinmesh = transform.gameObject.getComponent(SkinnedMeshRenderer);
                    if (skinmesh && skinmesh.mesh) {
                        const pickinfo = skinmesh.mesh.raycast(ray, transform.getWorldMatrix());
                        if (pickinfo) {
                            pickInfos.push(pickinfo);
                            pickinfo.transform = transform;
                        }
                    }
                }
            }

            for (const child of transform.children) {
                this._pickMesh(ray, child, pickInfos);
            }
        }

        private static _pickCollider(ray: Ray, transform: Transform, pickInfos: RaycastInfo[]) {
            if (transform.gameObject.activeInHierarchy) {
                // const pickInfo = ray.intersectCollider(transform);
                // if (pickInfo) {
                //     pickInfos.push(pickInfo);
                //     pickInfo.transform = transform;
                // }
            }

            for (const child of transform.children) {
                this._pickCollider(ray, child, pickInfos);
            }
        }
    }

    /**
     * 射线投射信息。
     */
    export class RaycastInfo {
        private static readonly _instances: RaycastInfo[] = [];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop()!;
            }

            return new RaycastInfo();
        }

        public release() {
            if (RaycastInfo._instances.indexOf(this) >= 0) {
                RaycastInfo._instances.push(this);
            }

            return this;
        }

        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        public distance: number = 0.0;
        public readonly position: Vector3 = new Vector3();
        public readonly textureCoordA: Vector2 = new Vector2();
        public readonly textureCoordB: Vector2 = new Vector2();
        public transform: Transform | null = null;

        public clear() {
            this.subMeshIndex = -1;
            this.triangleIndex = -1;
            this.distance = 0.0;
            // TODO
            this.transform = null;
        }
    }
}