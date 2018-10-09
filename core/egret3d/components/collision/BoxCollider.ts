namespace egret3d {
    /**
     * 立方体碰撞体。
     */
    export class BoxCollider extends paper.BaseComponent implements ICollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Box;
        /**
         * 描述该碰撞体的立方体。
         */
        @paper.serializedField
        public readonly aabb: AABB = AABB.ONE.clone();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.gameObject.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.aabb.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    raycastInfo.position.applyMatrix(this.gameObject.transform.worldMatrix);
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }
    }
}