namespace egret3d {

    const _helpVector3 = Vector3.create();
    const _helpRaycastInfo = RaycastInfo.create();
    /**
     * @internal
     */
    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        private _raycast(ray: Readonly<Ray>, entity: paper.GameObject, raycastConfig: RaycastConfig | null, raycastInfo: RaycastInfo | null) {
            const cullingMask = raycastConfig !== null ? raycastConfig.layerMask || paper.Layer.Default : paper.Layer.Default;

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

            let isHit = false;

            if (raycastConfig && raycastConfig.raycastMesh) {
                if (entity.renderer !== null) {
                    if (raycastInfo !== null) {
                        const helpRaycastInfo = _helpRaycastInfo;
                        helpRaycastInfo.clear();
                        helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
                        helpRaycastInfo.modifyNormal = raycastInfo.modifyNormal;
                        helpRaycastInfo.normal = raycastInfo.normal !== null ? _helpVector3 : null;

                        if (entity.renderer.raycast(ray, helpRaycastInfo)) {
                            if (!raycastInfo.transform || raycastInfo.distance > helpRaycastInfo.distance) {
                                raycastInfo.copy(helpRaycastInfo);
                            }

                            isHit = true;
                        }
                    }
                    else {
                        isHit = entity.renderer.raycast(ray, null);
                    }
                }

                return isHit;
            }

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
            const helpRaycastInfo = _helpRaycastInfo;
            helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
            helpRaycastInfo.modifyNormal = raycastInfo.modifyNormal;
            helpRaycastInfo.normal = raycastInfo.normal ? _helpVector3 : null;

            if (collider.raycast(ray, helpRaycastInfo)) {
                if (!raycastInfo.transform || raycastInfo.distance > helpRaycastInfo.distance) {
                    raycastInfo.copy(helpRaycastInfo);
                }

                return true;
            }

            return false;
        }

        public raycast(ray: Readonly<Ray>, raycastConfig: RaycastConfig | null = null, raycastInfo: RaycastInfo | null = null): boolean {
            if (raycastInfo !== null) {
                for (const entity of this.groups[1].entities) {
                    this._raycast(ray, entity, raycastConfig, raycastInfo);
                }

                return raycastInfo.transform !== null;
            }

            for (const entity of this.groups[1].entities) {
                if (this._raycast(ray, entity, raycastConfig, null)) {
                    return true;
                }
            }

            return false;
        }

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
