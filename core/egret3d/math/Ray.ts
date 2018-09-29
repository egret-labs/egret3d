namespace egret3d {
    /**
     * 射线检测接口。
     */
    export interface IRaycast {
        /**
         * 射线检测。
         * @param ray 
         * @param raycastInfo 是否将检测的详细数据写入 RaycastInfo。
         */
        raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo): boolean;
    }
    /**
     * 射线。
     */
    export class Ray extends paper.BaseRelease<Ray> implements paper.ICCS<Ray>, paper.ISerializable {
        private static readonly _instances: Ray[] = [];
        /**
         * 
         * @param origin 
         * @param direction 
         */
        public static create(origin: Readonly<IVector3> = Vector3.ZERO, direction: Readonly<IVector3> = Vector3.FORWARD) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(origin, direction);
                instance._released = false;
                return instance;
            }

            return new Ray().set(origin, direction);
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
        private constructor() {
            super();
        }

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

        public getSquaredDistance(value: Readonly<IVector3>) {
            const directionDistance = helpVector3A.subtract(value, this.origin).dot(this.direction);
            // point behind the ray
            if (directionDistance < 0.0) {
                return this.origin.getSquaredDistance(value);
            }

            return this.at(directionDistance, helpVector3A).getSquaredDistance(value);
        }

        public getDistance(value: Readonly<IVector3>) {
            return Math.sqrt(this.getSquaredDistance(value));
        }

        public getDistanceToPlane(value: Readonly<Plane>) {
            const denominator = value.normal.dot(this.direction);
            if (denominator === 0.0) {
                // line is coplanar, return origin
                if (value.getDistance(this.origin) === 0.0) {
                    return 0.0;
                }

                // Null is preferable to undefined since undefined means.... it is undefined
                return -1.0;
            }

            const t = -(this.origin.dot(value.normal) + value.constant) / denominator;

            // Return if the ray never intersects the plane
            return t >= 0.0 ? t : -1.0;
        }

        public at(value: number, out?: Vector3) {
            if (!out) {
                out = Vector3.create();
            }

            out.multiplyScalar(value, this.direction).add(this.origin);

            return out;
        }
        /**
         * @deprecated
         */
        public intersectTriangle(triangle: Readonly<Triangle>, backfaceCulling?: boolean, raycastInfo?: RaycastInfo): boolean;
        public intersectTriangle(p1: Readonly<Vector3>, p2: Readonly<Vector3>, p3: Readonly<Vector3>, backfaceCulling?: boolean, raycastInfo?: RaycastInfo): boolean;
        public intersectTriangle(p1: Readonly<Triangle | Vector3>, p2?: boolean | Readonly<Vector3>, p3?: RaycastInfo | Readonly<Vector3>, p4?: boolean, p5?: RaycastInfo) {
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
            const isA = p1 instanceof Triangle;
            const edge1 = helpVector3A;
            const edge2 = helpVector3B;
            const pvec = helpVector3C;
            const tvec = helpVector3D;
            const qvec = helpVector3E;
            const pA = isA ? (p1 as Readonly<Triangle>).a : p1 as Readonly<IVector3>;
            const pB = isA ? (p1 as Readonly<Triangle>).b : p2 as Readonly<IVector3>;
            const pC = isA ? (p1 as Readonly<Triangle>).c : p3 as Readonly<IVector3>;

            edge1.subtract(pB, pA);
            edge2.subtract(pC, pA);
            pvec.cross(this.direction, edge2);

            const det = pvec.dot(edge1);
            if (det === 0.0) {
                return false;
            }

            const invdet = 1.0 / det;

            tvec.subtract(this.origin, pA);

            const bu = pvec.dot(tvec) * invdet;
            if (bu < 0.0 || bu > 1.0) {
                return false;
            }

            qvec.cross(tvec, edge1);

            const bv = qvec.dot(this.direction) * invdet;

            if (bv < 0.0 || bu + bv > 1.0) {
                return false;
            }

            const raycastInfo = isA ? p3 as RaycastInfo | undefined : p5;
            if (raycastInfo) {
                raycastInfo.textureCoordA.x = bu;
                raycastInfo.textureCoordA.y = bv;
                this.at(raycastInfo.distance = qvec.dot(edge2) * invdet, raycastInfo.position);
            }

            return true;
        }
    }
    /**
     * 射线检测信息。
     */
    export class RaycastInfo extends paper.BaseRelease<RaycastInfo>  {
        private static readonly _instances: RaycastInfo[] = [];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop()!;
            }

            return new RaycastInfo();
        }

        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        public distance: number = 0.0;
        public readonly position: Vector3 = new Vector3();
        public readonly textureCoordA: Vector2 = new Vector2();
        public readonly textureCoordB: Vector2 = new Vector2();
        public transform: Transform | null = null;
        public collider: BaseCollider | null = null;

        public clear() {
            this.subMeshIndex = -1;
            this.triangleIndex = -1;
            this.distance = 0.0;
            // TODO
            this.transform = null;
            this.collider = null;
        }
    }
    /**
     * @internal
     */
    export const helpRay = Ray.create();
}