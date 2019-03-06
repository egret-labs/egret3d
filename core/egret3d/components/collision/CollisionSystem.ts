namespace egret3d {

    const _helpVector3 = Vector3.create();
    const _helpRaycastInfo = RaycastInfo.create();
    /**
     * @internal
     */
    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        private _sortRaycastInfo(a: RaycastInfo, b: RaycastInfo) {
            return a.distance - b.distance;
        }

        private _raycast(ray: Readonly<Ray>, entity: paper.GameObject, raycastMesh: boolean = false, raycastInfo?: RaycastInfo) {
            if (raycastMesh) {
                if (
                    entity.renderer && entity.renderer.enabled &&
                    entity.renderer.raycast(ray, raycastInfo, true)
                ) {
                    if (raycastInfo) {
                        raycastInfo.transform = entity.transform;
                    }

                    return true;
                }

                return false;
            }
            else {
                const boxColliders = entity.getComponents(BoxCollider);

                if (boxColliders.length > 0) {
                    for (const collider of boxColliders) {
                        if (!collider.enabled) {
                            continue;
                        }

                        if (raycastInfo) {
                            this._raycastCollider(ray, collider, raycastInfo);
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

                        if (raycastInfo) {
                            this._raycastCollider(ray, collider, raycastInfo);
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

                        if (raycastInfo) {
                            this._raycastCollider(ray, collider, raycastInfo);
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

                        if (raycastInfo) {
                            this._raycastCollider(ray, collider, raycastInfo);
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

                        if (raycastInfo) {
                            this._raycastCollider(ray, collider, raycastInfo);
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

        private _raycastCollider(ray: Readonly<Ray>, collider: ICollider & IRaycast, raycastInfo: RaycastInfo) {
            const helpRaycastInfo = _helpRaycastInfo;
            helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
            helpRaycastInfo.modifyNormal = raycastInfo.modifyNormal;
            helpRaycastInfo.normal = raycastInfo.normal ? _helpVector3 : null;

            if (
                collider.raycast(ray, helpRaycastInfo) &&
                (!raycastInfo.transform || raycastInfo.distance > helpRaycastInfo.distance)
            ) {
                const transform = collider.gameObject.transform;
                raycastInfo.distance = helpRaycastInfo.distance;
                raycastInfo.position.copy(helpRaycastInfo.position);
                raycastInfo.transform = transform;
                raycastInfo.collider = collider;

                if (raycastInfo.normal) {
                    raycastInfo.normal.copy(helpRaycastInfo.normal!);
                }

                return true;
            }

            return false;
        }

        private _raycastChildren(
            ray: Readonly<Ray>, entity: paper.GameObject,
            maxDistance: number, cullingMask: paper.Layer, raycastMesh: boolean, backfaceCulling: boolean,
            raycastInfos: RaycastInfo[]
        ) {
            if ((entity.hideFlags & paper.HideFlags.Hide) || !entity.activeInHierarchy) {
                return false;
            }

            const raycastInfo = RaycastInfo.create();
            raycastInfo.backfaceCulling = backfaceCulling;

            if (entity.layer & cullingMask) {
                if (raycastMesh) {
                    if (
                        entity.renderer && entity.renderer.enabled &&
                        entity.renderer.raycast(ray, raycastInfo, raycastMesh)
                    ) {
                        raycastInfo.transform = entity.transform;
                    }
                }
                else {
                    this._raycast(ray, entity, false, raycastInfo);
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
                for (const child of entity.transform.children) {
                    this._raycastChildren(ray, child.gameObject, maxDistance, cullingMask, raycastMesh, backfaceCulling, raycastInfos);
                }
            }

            return true;
        }

        // public raycast(ray: Readonly<Ray>, raycastMesh?: boolean, raycastInfo?: RaycastInfo): boolean;
        // public raycast(ray: Readonly<Ray>, entity: paper.GameObject, raycastMesh?: boolean, raycastInfo?: RaycastInfo): boolean;
        // public raycast(ray: Readonly<Ray>, raycastMeshOrEntity?: boolean | paper.GameObject, raycastInfoOrRaycastMesh?: RaycastInfo | boolean, raycastInfo?: RaycastInfo): boolean {
        //     if (raycastMeshOrEntity && raycastMeshOrEntity instanceof paper.Entity) {
        //         return this._raycast(ray, raycastMeshOrEntity, raycastInfoOrRaycastMesh as boolean, raycastInfo);
        //     }

        //     const raycastInfos = [] as RaycastInfo[];

        //     if (raycastMeshOrEntity as boolean) {
        //         for (const entity of this.groups[1].entities) {
        //             this._raycastChildren(
        //                 ray, entity, maxDistance, cullingMask, raycastMesh, raycastInfos
        //             );
        //         }

        //         raycastInfos.sort(this._sortRaycastInfo);
        //     }
        //     else {

        //     }
        // }

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(BoxCollider, SphereCollider, CylinderCollider, CapsuleCollider, MeshCollider),
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(MeshRenderer, SkinnedMeshRenderer, particle.ParticleRenderer),
            ];
        }

        public onTickCleanup() {
            this._contactCollecter._update();
        }
    }
}
