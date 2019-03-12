namespace egret3d {
    /**
     * 胶囊体碰撞组件。
     * - 与 Y 轴对齐。
     */
    @paper.allowMultiple
    export class CapsuleCollider extends paper.BaseComponent implements ICapsuleCollider, IRaycast {

        public readonly colliderType: ColliderType = ColliderType.Capsule;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly capsule: Capsule = Capsule.create(Vector3.ZERO, 0.25, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            return _colliderRaycast(this, this.capsule, null, ray, raycastInfo, true);
        }
    }
}
