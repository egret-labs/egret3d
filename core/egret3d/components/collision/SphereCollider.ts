namespace egret3d {
    /**
     * 球体碰撞组件接口。
     */
    export interface ISphereCollider extends ICollider {
        readonly sphere: Sphere;
    }
    /**
     * 球体碰撞组件。
     */
    export class SphereCollider extends paper.BaseComponent implements ISphereCollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Sphere;
        /**
         * 描述该组件的球体。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly sphere: Sphere = Sphere.create(Vector3.ZERO, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.gameObject.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.sphere.raycast(localRay, raycastInfo)) {
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