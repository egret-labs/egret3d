namespace egret3d {
    /**
     * 
     */
    export class SphereCollider extends BaseCollider {
        public readonly colliderType: ColliderType = ColliderType.Sphere;

        @paper.serializedField
        public readonly sphere: Sphere = Sphere.create(Vector3.ZERO, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.sphere.raycast(localRay, raycastInfo)) {
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