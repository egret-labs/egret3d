namespace egret3d {
    /**
     * physics
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 物理类
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Physics {
        /**
         * get the nearest transform contect to the ray
         * @param ray ray
         * @param isPickMesh true pick mesh, false pick collider
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取射线拾取到的最近物体。
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh，否为拾取collider
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public static Raycast(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): PickInfo | null {
            return this._doPick(ray, maxDistance, layerMask, false, isPickMesh) as PickInfo | null;
        }

        /**
         * get all transforms contect to the ray
         * @param ray ray
         * @param isPickMesh true pick mesh, false pick collider
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取射线路径上的所有物体。
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh，否为拾取collider
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public static RaycastAll(ray: Ray, isPickMesh: boolean = false, maxDistance: number = Number.MAX_VALUE, layerMask: paper.Layer = paper.Layer.Default | paper.Layer.UI): PickInfo[] | null {
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
                        // this._pickCollider(ray, gameObject.transform, pickedList); TODO
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

        // private static _pickCollider(ray: Ray, transform: Transform, pickInfos: PickInfo[]) {
        //     if (transform.gameObject.activeInHierarchy) {
        //         const pickInfo = ray.intersectCollider(transform);
        //         if (pickInfo) {
        //             pickInfos.push(pickInfo);
        //             pickInfo.transform = transform;
        //         }
        //     }

        //     for (const child of transform.children) {
        //         this._pickCollider(ray, child, pickInfos);
        //     }
        // }
    }
}