namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _helpRaycastInfo = RaycastInfo.create();

    function _raycastCollider(ray: Readonly<Ray>, collider: BoxCollider | SphereCollider, raycastInfo: RaycastInfo, hit: boolean) {
        const helpRaycastInfo = _helpRaycastInfo;
        const normal = raycastInfo.normal;
        helpRaycastInfo.normal = normal ? _helpVector3 : null;

        if (collider.raycast(ray, helpRaycastInfo) &&
            (!hit || raycastInfo.distance > helpRaycastInfo.distance)
        ) {
            const transform = collider.gameObject.transform;
            raycastInfo.distance = helpRaycastInfo.distance;
            raycastInfo.position.copy(helpRaycastInfo.position);
            raycastInfo.transform = transform;
            raycastInfo.collider = collider;

            if (normal) {
                normal.copy(_helpVector3);
            }

            return true;
        }

        return false;
    }

    function _raycastAll(
        ray: Readonly<Ray>, gameObject: Readonly<paper.GameObject>,
        maxDistance: number = 0.0, cullingMask: paper.CullingMask = paper.CullingMask.Everything, raycastMesh: boolean = false,
        raycastInfos: RaycastInfo[]
    ) {
        if (
            (
                gameObject.hideFlags === paper.HideFlags.HideAndDontSave && gameObject.tag === paper.DefaultTags.EditorOnly &&
                (!gameObject.transform.parent || gameObject.transform.parent.gameObject.activeInHierarchy)
            ) ? gameObject.activeSelf : !gameObject.activeInHierarchy
        ) {
            return false;
        }

        const raycastInfo = RaycastInfo.create();

        if (gameObject.layer & cullingMask) {
            if (raycastMesh) {
                if (
                    gameObject.renderer && gameObject.renderer.enabled &&
                    gameObject.renderer.raycast(ray, raycastInfo, raycastMesh)
                ) {
                    raycastInfo.transform = gameObject.transform;
                }
            }
            else {
                raycast(ray, gameObject, false, raycastInfo);
            }
        }

        if (raycastInfo.transform) {
            if (maxDistance <= 0.0 || raycastInfo.distance <= maxDistance) {
                raycastInfos.push(raycastInfo);
            }
            else {
                raycastInfo.transform = null;
                raycastInfo.release();
            }
        }
        else {
            raycastInfo.transform = null;
            raycastInfo.release();
        }

        if (!raycastInfo.transform) {
            for (const child of gameObject.transform.children) {
                _raycastAll(ray, child.gameObject, maxDistance, cullingMask, raycastMesh, raycastInfos);
            }
        }

        return true;
    }

    function _sortRaycastInfo(a: RaycastInfo, b: RaycastInfo) {
        // TODO renderQueue.
        return a.distance - b.distance;
    }
    /**
     * 用世界空间坐标系的射线检测指定的实体。（不包含其子级）
     * @param ray 世界空间坐标系的射线。
     * @param gameObject 实体。
     * @param raycastMesh 是否检测网格。（需要消耗较多的 CPU 性能，尤其是蒙皮网格）
     * @param raycastInfo 
     */
    export function raycast(
        ray: Readonly<Ray>, gameObject: Readonly<paper.GameObject>,
        raycastMesh: boolean = false, raycastInfo?: RaycastInfo
    ) {
        if (raycastMesh) {
            if (
                gameObject.renderer && gameObject.renderer.enabled &&
                gameObject.renderer.raycast(ray, raycastInfo, raycastMesh)
            ) {
                if (raycastInfo) {
                    raycastInfo.transform = gameObject.transform;
                }

                return true;
            }

            return false;
        }
        else {
            // TODO 更快的查询所有碰撞组件的方式。extends ?
            let hit = false;
            const boxColliders = gameObject.getComponents(BoxCollider);
            const sphereColliders = gameObject.getComponents(SphereCollider);

            if (boxColliders.length > 0) {
                for (const collider of boxColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo) {
                        if (_raycastCollider(ray, collider, raycastInfo, hit)) {
                            hit = true;
                        }
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            if (sphereColliders.length > 0) {
                for (const collider of sphereColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo) {
                        if (_raycastCollider(ray, collider, raycastInfo, hit)) {
                            hit = true;
                        }
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }
        }

        if (raycastInfo && raycastInfo.transform) {
            return true;
        }

        return false;
    }
    /**
     * 用世界空间坐标系的射线检测指定的实体或变换组件列表。
     * @param ray 射线。
     * @param gameObjectsOrTransforms 实体或变换组件列表。
     * @param maxDistance 最大相交点检测距离。
     * @param cullingMask 只对特定层的实体检测。
     * @param raycastMesh 是否检测网格。（需要消耗较多的 CPU 性能，尤其是蒙皮网格）
     */
    export function raycastAll(
        ray: Readonly<Ray>, gameObjectsOrTransforms: ReadonlyArray<paper.GameObject | Transform>,
        maxDistance: number = 0.0, cullingMask: paper.CullingMask = paper.CullingMask.Everything, raycastMesh: boolean = false
    ) {
        const raycastInfos = [] as RaycastInfo[];

        for (const gameObject of gameObjectsOrTransforms) {
            _raycastAll(
                ray,
                gameObject instanceof Transform ? gameObject.gameObject : gameObject,
                maxDistance, cullingMask, raycastMesh, raycastInfos
            );
        }

        raycastInfos.sort(_sortRaycastInfo);

        return raycastInfos;
    }
}