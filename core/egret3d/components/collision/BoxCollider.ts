namespace egret3d {
    /**
     * 立方体碰撞组件。
     */
    @paper.allowMultiple
    export class BoxCollider extends paper.BaseComponent implements IBoxCollider, IRaycast {

        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField("aabb")
        public readonly box: Box = Box.create(Vector3.MINUS_ONE, Vector3.ONE).expand(-0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            return _colliderRaycast(this, this.box, null, ray, raycastInfo, false);
        }

        /**
         * @deprecated
         */
        public get aabb() {
            return this.box;
        }
    }
}
