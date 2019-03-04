namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _helpRaycastInfo = RaycastInfo.create();

    function _raycastCollider(ray: Readonly<Ray>, collider: ICollider & IRaycast, raycastInfo: RaycastInfo, hit: boolean) {
        const helpRaycastInfo = _helpRaycastInfo;
        const normal = raycastInfo.normal;
        helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
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
        maxDistance: number, cullingMask: paper.Layer, raycastMesh: boolean, backfaceCulling: boolean,
        raycastInfos: RaycastInfo[]
    ) {
        if (
            (gameObject.hideFlags & paper.HideFlags.NotTouchable) ||
            !gameObject.activeInHierarchy
        ) {
            return false;
        }

        const raycastInfo = RaycastInfo.create();
        raycastInfo.backfaceCulling = backfaceCulling;

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
                _raycastAll(ray, child.gameObject, maxDistance, cullingMask, raycastMesh, backfaceCulling, raycastInfos);
            }
        }

        return true;
    }

    function _sortRaycastInfo(a: RaycastInfo, b: RaycastInfo) {
        // TODO renderQueue.
        return a.distance - b.distance;
    }

    export function _colliderRaycast(collider: ICollider, raycaster: IRaycast, preRaycaster: IRaycast | null, ray: Readonly<Ray>, raycastInfo?: RaycastInfo, modifyNormal?: boolean) {
        const transform = collider.gameObject.transform;
        const worldToLocalMatrix = transform.worldToLocalMatrix;
        const localRay = helpRay.applyMatrix(worldToLocalMatrix, ray);

        if ((!preRaycaster || preRaycaster.raycast(localRay)) && raycaster.raycast(localRay, raycastInfo)) {
            if (raycastInfo) {
                const localToWorldMatrix = transform.localToWorldMatrix;
                raycastInfo.distance = ray.origin.getDistance(raycastInfo.position.applyMatrix(localToWorldMatrix));
                raycastInfo.transform = transform;
                raycastInfo.collider = collider;

                const normal = raycastInfo.normal;
                if (normal) {
                    if (modifyNormal && raycastInfo.modifyNormal) {
                        normal.applyMatrix3(helpMatrix3A.fromMatrix4(worldToLocalMatrix).transpose()).normalize();
                    }
                    else {
                        normal.applyDirection(localToWorldMatrix);
                    }
                }
            }

            return true;
        }

        return false;
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
            const cylinderColliders = gameObject.getComponents(CylinderCollider);
            const capsuleColliders = gameObject.getComponents(CapsuleCollider);
            const meshColliders = gameObject.getComponents(MeshCollider);

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

            if (cylinderColliders.length > 0) {
                for (const collider of cylinderColliders) {
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

            if (capsuleColliders.length > 0) {
                for (const collider of capsuleColliders) {
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

            if (meshColliders.length > 0) {
                for (const collider of meshColliders) {
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
     * 用世界空间坐标系的射线检测指定的实体或组件列表。
     * @param ray 射线。
     * @param gameObjectsOrComponents 实体或组件列表。
     * @param maxDistance 最大相交点检测距离。
     * @param cullingMask 只对特定层的实体检测。
     * @param raycastMesh 是否检测网格。（需要消耗较多的 CPU 性能，尤其是蒙皮网格）
     */
    export function raycastAll(
        ray: Readonly<Ray>, gameObjectsOrComponents: ReadonlyArray<paper.GameObject | paper.BaseComponent>,
        maxDistance: number = 0.0, cullingMask: paper.Layer = paper.Layer.Everything, raycastMesh: boolean = false, backfaceCulling: boolean = true
    ) {
        const raycastInfos = [] as RaycastInfo[];

        for (const gameObjectOrComponent of gameObjectsOrComponents) {
            _raycastAll(
                ray,
                gameObjectOrComponent.constructor === paper.GameObject ? gameObjectOrComponent as paper.GameObject : (gameObjectOrComponent as paper.BaseComponent).gameObject,
                maxDistance, cullingMask, raycastMesh, backfaceCulling, raycastInfos
            );
        }

        raycastInfos.sort(_sortRaycastInfo);

        return raycastInfos;
    }
}