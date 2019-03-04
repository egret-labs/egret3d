namespace egret3d {
    /**
     * 球体碰撞组件。
     */
    @paper.allowMultiple
    export class SphereCollider extends paper.BaseComponent implements ISphereCollider, IRaycast {

        public readonly colliderType: ColliderType = ColliderType.Sphere;

        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly sphere: Sphere = Sphere.create(Vector3.ZERO, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            return _colliderRaycast(this, this.sphere, null, ray, raycastInfo, true);
        }
    }
}
