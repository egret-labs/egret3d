namespace egret3d {
    /**
     * 立方体碰撞组件接口。
     */
    export interface IBoxCollider extends ICollider {
        readonly box: Box;
    }

    /**
     * 立方体碰撞组件。
     */
    @paper.allowMultiple
    export class BoxCollider extends paper.BaseComponent implements IBoxCollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Box;

        /**
         * 描述该组件的立方体。
         */
        @paper.serializedField("aabb")
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly box: Box = Box.ONE.clone();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const transform = this.gameObject.transform;
            const localRay = helpRay.applyMatrix(transform.worldToLocalMatrix, ray);

            if (this.box.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    const localToWorldMatrix = transform.localToWorldMatrix;
                    raycastInfo.position.applyMatrix(transform.localToWorldMatrix);
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);

                    const normal = raycastInfo.normal;
                    if (normal) {
                        normal.applyDirection(localToWorldMatrix);
                    }
                }

                return true;
            }

            return false;
        }

        /**
         * @deprecated
         */
        public get aabb() {
            return this.box;
        }
    }
}