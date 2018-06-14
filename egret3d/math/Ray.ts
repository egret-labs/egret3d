namespace egret3d {

    const _helpVector3A = new Vector3();
    const _helpVector3B = new Vector3();
    const _helpVector3C = new Vector3();
    const _helpVector3D = new Vector3();
    const _helpVector3E = new Vector3();
    const _helpVector3F = new Vector3();
    const _helpVector3G = new Vector3();
    const _helpVector3H = new Vector3();
    const _helpVectors = [
        _helpVector3A,
        _helpVector3B,
        _helpVector3C,
        _helpVector3D,
        _helpVector3E,
        _helpVector3F,
        _helpVector3G,
        _helpVector3H,
    ];
    let helpVec3_1: Vector3 = new Vector3();
    let helpVec3_2: Vector3 = new Vector3();
    let helpVec3_3: Vector3 = new Vector3();
    let helpVec3_4: Vector3 = new Vector3();
    let helpVec3_5: Vector3 = new Vector3();
    const boxIndices = [
        0, 1, 2, 3,
        4, 5, 6, 7,
        1, 3, 5, 7,
        0, 2, 4, 6,
        6, 2, 7, 3,
        0, 4, 1, 5
    ];

    /**
     * 射线
     */
    export class Ray {

        /**
         * 射线起始点
         */
        public origin: Vector3;

        /**
         * 射线的方向向量
         */
        public direction: Vector3;

        /**
         * 构建一条射线
         * @param origin 射线起点
         * @param dir 射线方向
         */
        constructor(origin: Vector3, direction: Vector3) {
            this.origin = Vector3.copy(origin, new Vector3());
            this.direction = Vector3.copy(direction, new Vector3());
        }

        /**
         * 与aabb碰撞相交检测
         */
        public intersectAABB(aabb: AABB): boolean {
            return this.intersectBoxMinMax(aabb.minimum, aabb.maximum);
        }

        /**
         * 与transform表示的plane碰撞相交检测，主要用于2d检测
         * @param transform transform实例
         */
        public intersectPlaneTransform(transform: Transform): PickInfo {
            let pickinfo = null;
            let panelpoint = transform.getPosition();
            let forward = helpVec3_1;
            transform.getForward(forward);
            let hitposition = this.intersectPlane(panelpoint, forward);
            if (hitposition) {
                pickinfo = new PickInfo();
                pickinfo.hitposition = hitposition;
                pickinfo.distance = Vector3.getDistance(pickinfo.hitposition, this.origin);
            }
            return pickinfo;
        }

        public intersectPlane(planePoint: Vector3, planeNormal: Vector3): Vector3 {
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

        /**
         * 与碰撞盒相交检测
         * @param transform 待检测带碰撞盒的transform
         */
        public intersectCollider(transform: Transform): PickInfo {
            let _collider = transform.gameObject.getComponent(BaseCollider);

            let pickinfo = null;
            if (_collider instanceof BoxCollider) {
                let obb = _collider.bounds;
                obb.caclWorldVectors(_helpVectors, _collider.gameObject.transform.getWorldMatrix());
                // let data = MeshData.genBoxByArray(vecs); !!!???

                for (let index = 0; index < boxIndices.length; index += 3) {
                    const verindex0 = boxIndices[index];
                    const verindex1 = boxIndices[index + 1];
                    const verindex2 = boxIndices[index + 2];

                    const p0 = _helpVectors[verindex0];
                    const p1 = _helpVectors[verindex1];
                    const p2 = _helpVectors[verindex2];

                    let result = this.intersectsTriangle(p0, p1, p2);
                    if (result) {
                        if (result.distance < 0) continue;
                        if (!pickinfo || pickinfo.distance > result.distance) {
                            pickinfo = result;
                            let tdir = helpVec3_1;
                            Vector3.copy(this.direction, tdir);
                            Vector3.scale(tdir, result.distance);
                            Vector3.add(this.origin, tdir, pickinfo.hitposition);
                        }
                    }
                }
            }
            // else if (_collider instanceof MeshCollider) { // TODO
            //     let mesh = _collider.getBound();
            //     if (mesh != null) {
            //         pickinfo = mesh.intersects(this, tran.getWorldMatrix());
            //     }
            // }
            //  else if (_collider instanceof CanvasRenderer) {
            //     pickinfo = this.intersectPlaneTransform(tran);
            // }
            return pickinfo;
        }

        /**
         * 与最大最小点表示的box相交检测
         * @param minimum 最小点
         * @param maximum 最大点
         * @version paper 1.0
         */
        public intersectBoxMinMax(minimum: Vector3, maximum: Vector3): boolean {
            let d = 0.0;
            let maxValue = Number.MAX_VALUE;
            let inv: number;
            let min: number;
            let max: number;
            let temp: number;
            if (Math.abs(this.direction.x) < 0.0000001) {
                if (this.origin.x < minimum.x || this.origin.x > maximum.x) {
                    return false;
                }
            } else {
                inv = 1.0 / this.direction.x;
                min = (minimum.x - this.origin.x) * inv;
                max = (maximum.x - this.origin.x) * inv;
                if (max === -Infinity) {
                    max = Infinity;
                }

                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue) {
                    return false;
                }
            }

            if (Math.abs(this.direction.y) < 0.0000001) {
                if (this.origin.y < minimum.y || this.origin.y > maximum.y) {
                    return false;
                }
            } else {
                inv = 1.0 / this.direction.y;
                min = (minimum.y - this.origin.y) * inv;
                max = (maximum.y - this.origin.y) * inv;

                if (max === -Infinity) {
                    max = Infinity;
                }

                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue) {
                    return false;
                }
            }

            if (Math.abs(this.direction.z) < 0.0000001) {
                if (this.origin.z < minimum.z || this.origin.z > maximum.z) {
                    return false;
                }
            } else {
                inv = 1.0 / this.direction.z;
                min = (minimum.z - this.origin.z) * inv;
                max = (maximum.z - this.origin.z) * inv;

                if (max === -Infinity) {
                    max = Infinity;
                }

                if (min > max) {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 与球相交检测
         */
        public intersectsSphere(center: Vector3, radius: number): boolean {
            let center_ori = helpVec3_1;
            Vector3.subtract(center, this.origin, center_ori);
            let raydist = Vector3.dot(this.direction, center_ori);

            if (raydist < 0) return false; // 到圆心的向量在方向向量上的投影为负，夹角不在-90与90之间

            let orilen2 = Vector3.getSqrLength(center_ori);

            let rad2 = radius * radius;

            if (orilen2 < rad2) return true; // 射线起点在球里

            let d = rad2 - (orilen2 - raydist * raydist);
            if (d < 0) return false;

            return true;
        }


        /**
         * 与三角形相交检测
         */
        public intersectsTriangle(vertex0: Vector3, vertex1: Vector3, vertex2: Vector3): PickInfo {
            let _edge1 = helpVec3_1;
            let _edge2 = helpVec3_2;
            let _pvec = helpVec3_3;
            let _tvec = helpVec3_4;
            let _qvec = helpVec3_5;

            Vector3.subtract(vertex1, vertex0, _edge1);
            Vector3.subtract(vertex2, vertex0, _edge2);
            Vector3.cross(this.direction, _edge2, _pvec);
            let det = Vector3.dot(_edge1, _pvec);

            if (det === 0) {
                return null;
            }

            let invdet = 1 / det;

            Vector3.subtract(this.origin, vertex0, _tvec);

            let bu = Vector3.dot(_tvec, _pvec) * invdet;

            if (bu < 0 || bu > 1.0) {
                return null;
            }

            Vector3.cross(_tvec, _edge1, _qvec);

            let bv = Vector3.dot(this.direction, _qvec) * invdet;

            if (bv < 0 || bu + bv > 1.0) {
                return null;
            }

            const pickInfo = new PickInfo();
            pickInfo.distance = Vector3.dot(_edge2, _qvec) * invdet;
            pickInfo.textureCoordA.x = bu;
            pickInfo.textureCoordA.y = bv;

            return pickInfo;
        }




        /**
         * 获取射线拾取到的最近物体。
         */
        public static raycast(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): PickInfo | null {
            return this._doPick(ray, maxDistance, layerMask, false, isPickMesh) as PickInfo | null;
        }

        /**
         * 获取射线路径上的所有物体。
         */
        public static raycastAll(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): PickInfo[] | null {
            return this._doPick(ray, maxDistance, layerMask, true, isPickMesh) as PickInfo[] | null;
        }

        private static _doPick(ray: Ray, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer, pickAll: boolean = false, isPickMesh: boolean = false) {
            const pickedList: PickInfo[] = [];

            for (const gameObject of paper.Application.sceneManager.getActiveScene().getRootGameObjects()) {
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

        private static _pickMesh(ray: Ray, transform: Transform, pickInfos: PickInfo[]) {
            if (transform.gameObject.activeInHierarchy) {
                const meshFilter = transform.gameObject.getComponent(MeshFilter);
                if (meshFilter) {
                    const mesh = meshFilter.mesh;
                    if (mesh) {
                        const pickinfo = mesh.intersects(ray, transform.getWorldMatrix());
                        if (pickinfo) {
                            pickInfos.push(pickinfo);
                            pickinfo.transform = transform;
                        }
                    }
                }
                else {
                    const skinmesh = transform.gameObject.getComponent(SkinnedMeshRenderer);
                    if (skinmesh) {
                        let pickinfo = skinmesh.intersects(ray);
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

        private static _pickCollider(ray: Ray, transform: Transform, pickInfos: PickInfo[]) {
            if (transform.gameObject.activeInHierarchy) {
                const pickInfo = ray.intersectCollider(transform);
                if (pickInfo) {
                    pickInfos.push(pickInfo);
                    pickInfo.transform = transform;
                }
            }

            for (const child of transform.children) {
                this._pickCollider(ray, child, pickInfos);
            }
        }
    }


    /**
     * 场景拣选信息
     */
    export class PickInfo {
        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        public distance: number = 0.0;
        public readonly position: Vector3 = new Vector3();
        public readonly textureCoordA: Vector2 = new Vector2();
        public readonly textureCoordB: Vector2 = new Vector2();
        public transform: Transform | null = null;
        public collider: BaseCollider | null = null;
    }
}