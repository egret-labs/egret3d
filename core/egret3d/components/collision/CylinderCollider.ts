namespace egret3d {
    /**
     * 圆柱（锥）碰撞体组件。
     * - 与 Y 轴对齐。
     */
    @paper.allowMultiple
    export class CylinderCollider extends paper.BaseComponent implements ICylinderCollider, IRaycast {

        public readonly colliderType: ColliderType = ColliderType.Cylinder;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly cylinder: Cylinder = Cylinder.create(Vector3.ZERO, 0.5, 0.5, 1.0);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            return _colliderRaycast(this, this.cylinder, null, ray, raycastInfo, true);
        }
    }
}
