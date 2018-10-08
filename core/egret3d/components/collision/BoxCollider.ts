namespace egret3d {
    /**
     * 
     */
    export class BoxCollider extends BaseCollider {
        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.serializedField
        public readonly aabb: AABB = AABB.ONE.clone();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.aabb.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    raycastInfo.position.applyMatrix(this.transform.worldMatrix);
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }
    }
}