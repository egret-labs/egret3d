namespace egret3d {
    /**
     * 球体碰撞组件接口。
     * TODO 使用碰撞接口
     */
    export interface ISphereCollider extends ICollider {
        readonly sphere: Sphere;
    }
    /**
     * 球体碰撞组件。
     */
    @paper.allowMultiple
    export class SphereCollider extends paper.BaseComponent implements ISphereCollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Sphere;
        /**
         * 描述该组件的球体。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly sphere: Sphere = Sphere.create(Vector3.ZERO, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const transform = this.gameObject.transform;
            const worldToLocalMatrix = transform.worldToLocalMatrix;
            const localRay = helpRay.applyMatrix(transform.worldToLocalMatrix, ray);

            if (this.sphere.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    const localToWorldMatrix = transform.localToWorldMatrix;
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position.applyMatrix(localToWorldMatrix));
                    raycastInfo.transform = transform;
                    raycastInfo.collider = this;

                    const normal = raycastInfo.normal;
                    if (normal) {
                        // normal.applyDirection(localToWorldMatrix);
                        normal.applyMatrix3(helpMatrix3A.fromMatrix4(worldToLocalMatrix).transpose()).normalize();
                    }
                }

                return true;
            }

            return false;
        }
    }
}