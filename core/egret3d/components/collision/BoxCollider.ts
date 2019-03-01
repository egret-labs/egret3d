namespace egret3d {
    /**
     * 立方体碰撞组件。
     */
    @paper.allowMultiple
    export class BoxCollider extends paper.BaseComponent implements IBoxCollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField("aabb")
        public readonly box: Box = Box.ONE.clone();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const transform = this.gameObject.transform;
            const localRay = helpRay.applyMatrix(transform.worldToLocalMatrix, ray);

            if (this.box.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    const localToWorldMatrix = transform.localToWorldMatrix;
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position.applyMatrix(transform.localToWorldMatrix));
                    raycastInfo.transform = transform;
                    raycastInfo.collider = this;

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