namespace egret3d.oimo {
    /**
     * 球体碰撞组件。
     */
    @paper.requireComponent(Rigidbody)
    export class SphereCollider extends BaseCollider implements ISphereCollider {
        public readonly colliderType: ColliderType = ColliderType.Sphere;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly sphere: Sphere = Sphere.create().set(Vector3.ZERO, 0.5);

        protected _createShape() {
            const config = this._updateConfig();
            config.position = this.sphere.center as any;
            config.geometry = new OIMO.SphereGeometry(this.sphere.radius);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }
    }
}
