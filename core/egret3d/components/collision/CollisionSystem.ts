namespace egret3d {

    const _helpVector3 = Vector3.create();
    const _helpRaycastInfo = RaycastInfo.create();
    /**
     * @internal
     */
    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        private _raycast(ray: Readonly<Ray>, entity: paper.GameObject, raycastConfig?: RaycastConfig, raycastInfo?: RaycastInfo) {
            const cullingMask = raycastConfig ? raycastConfig.layerMask || paper.Layer.Default : paper.Layer.Default;

            if (
                (entity.hideFlags & paper.HideFlags.Hide) ||
                (entity.layer & cullingMask) === 0
            ) {
                return false;
            }

            let maxDistance2 = raycastConfig ? raycastConfig.maxDistance || 0.0 : 0.0;

            if (maxDistance2 > 0.0) {
                maxDistance2 *= maxDistance2;

                if (entity.transform.position.getSquaredDistance(ray.origin) >= maxDistance2) {
                    return false;
                }
            }

            if (raycastConfig && raycastConfig.raycastMesh) {
                if (entity.renderer && entity.renderer.raycast(ray, raycastInfo, true)) {
                    return true;
                }
            }

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

        // public raycast(ray: Readonly<Ray>, raycastConfig?: RaycastConfig, raycastInfo?: RaycastInfo): boolean {

        //     if (raycastInfo) {
        //         for (const entity of this.groups[1].entities) {
        //             this._raycast(ray, entity, raycastConfig, raycastInfo);
        //         }
        //     }
        //     else {

        //         for (const entity of this.groups[1].entities) {
        //             this._raycast(ray, entity, raycastConfig);
        //         }
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
