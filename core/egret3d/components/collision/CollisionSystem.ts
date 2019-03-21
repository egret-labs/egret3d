namespace egret3d {

    let _helpVector3: Vector3 | null = null;
    let _helpRaycastInfo: RaycastInfo | null = null;
    /**
     * 碰撞系统。
     */
    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        private _raycast(ray: Readonly<Ray>, entity: paper.GameObject, cullingMask: paper.Layer = paper.Layer.Default, maxDistance: float = 0.0, raycastInfo: RaycastInfo | null) {
            if (
                (entity.hideFlags & paper.HideFlags.Hide) !== 0 ||
                (entity.layer & cullingMask) === 0
            ) {
                return false;
            }

            if (maxDistance > 0.0) {
                maxDistance *= maxDistance;

                if (entity.transform.position.getSquaredDistance(ray.origin) >= maxDistance) {
                    return false;
                }
            }

            let isHit = false;
            const boxColliders = entity.getComponents(BoxCollider);

            if (boxColliders.length > 0) {
                for (const collider of boxColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo !== null) {
                        isHit = this._raycastCollider(ray, collider, raycastInfo) || isHit;
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            const sphereColliders = entity.getComponents(SphereCollider);

            if (sphereColliders.length > 0) {
                for (const collider of sphereColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo !== null) {
                        isHit = this._raycastCollider(ray, collider, raycastInfo) || isHit;
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            const cylinderColliders = entity.getComponents(CylinderCollider);

            if (cylinderColliders.length > 0) {
                for (const collider of cylinderColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo !== null) {
                        isHit = this._raycastCollider(ray, collider, raycastInfo) || isHit;
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            const capsuleColliders = entity.getComponents(CapsuleCollider);

            if (capsuleColliders.length > 0) {
                for (const collider of capsuleColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo !== null) {
                        isHit = this._raycastCollider(ray, collider, raycastInfo) || isHit;
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            const meshColliders = entity.getComponents(MeshCollider);

            if (meshColliders.length > 0) {
                for (const collider of meshColliders) {
                    if (!collider.enabled) {
                        continue;
                    }

                    if (raycastInfo !== null) {
                        isHit = this._raycastCollider(ray, collider, raycastInfo) || isHit;
                    }
                    else if (collider.raycast(ray)) {
                        return true;
                    }
                }
            }

            return isHit;
        }

        private _raycastCollider(ray: Readonly<Ray>, collider: ICollider & IRaycast, raycastInfo: RaycastInfo) {
            const helpRaycastInfo = _helpRaycastInfo!;
            helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
            helpRaycastInfo.modifyNormal = raycastInfo.modifyNormal;
            helpRaycastInfo.normal = raycastInfo.normal ? _helpVector3 : null;

            if (collider.raycast(ray, helpRaycastInfo)) {
                if (raycastInfo.transform === null || raycastInfo.distance > helpRaycastInfo.distance) {
                    raycastInfo.copy(helpRaycastInfo);
                }

                return true;
            }

            return false;
        }
        /**
         * 使用射线检测一个实体的碰撞体，并返回是否有碰撞。
         * @param ray 一个射线。
         * @param entity 一个实体。
         * @param cullingMask 允许检测的实体层级。
         * - 默认为 `paper.Layer.Default`。
         * @param maxDistance 允许检测的射线原点到实体变换组件的最大欧氏距离。
         * - [`0.0` ~ N]
         * - `0.0`：无限制。
         * @param raycastInfo 精确检测信息。
         * - 默认为 `null`，不进行精确检测。
         */
        public raycastSingle(ray: Readonly<Ray>, entity: paper.GameObject, cullingMask: paper.Layer = paper.Layer.Default, maxDistance: float = 0.0, raycastInfo: RaycastInfo | null = null): boolean {
            if (raycastInfo !== null) {

                _helpVector3 = Vector3.create().release();
                _helpRaycastInfo = RaycastInfo.create().release();

                const isHit = this._raycast(ray, entity, cullingMask, maxDistance, raycastInfo);

                _helpVector3 = null;
                _helpRaycastInfo = null;

                return isHit;
            }

            return this._raycast(ray, entity, cullingMask, maxDistance, null);
        }
        /**
         * 使用射线检测所有实体的碰撞体，并返回是否有碰撞。
         * @param ray 一个射线。
         * @param cullingMask 允许检测的实体层级。
         * - 默认为 `paper.Layer.Default`。
         * @param maxDistance 允许检测的射线原点到实体变换组件的最大欧氏距离。
         * - [`0.0` ~ N]
         * - `0.0`：无限制。
         * @param raycastInfo 精确检测信息。
         * - 默认为 `null`，不进行精确检测。
         */
        public raycast(ray: Readonly<Ray>, cullingMask: paper.Layer = paper.Layer.Default, maxDistance: float = 0.0, raycastInfo: RaycastInfo | null = null): boolean {
            const { entities } = this.groups[0];

            if (raycastInfo !== null) {
                let isHit = false;

                _helpVector3 = Vector3.create().release();
                _helpRaycastInfo = RaycastInfo.create().release();

                for (const entity of entities) {
                    isHit = this._raycast(ray, entity, cullingMask, maxDistance, raycastInfo) || isHit;
                }

                _helpVector3 = null;
                _helpRaycastInfo = null;

                return isHit;
            }

            for (const entity of entities) {
                if (this._raycast(ray, entity, cullingMask, maxDistance, null)) {
                    return true;
                }
            }

            return false;
        }

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(BoxCollider, SphereCollider, CylinderCollider, CapsuleCollider, MeshCollider),
            ];
        }

        public onTickCleanup() {
            this._contactCollecter._update();
        }
    }
}
