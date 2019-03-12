namespace egret3d.oimo {
    /**
     * 胶囊体碰撞组件。
     * - 与 Y 轴对齐。
     */
    @paper.requireComponent(Rigidbody)
    export class CapsuleCollider extends BaseCollider implements ICapsuleCollider {
        public readonly colliderType: ColliderType = ColliderType.Capsule;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly capsule: Capsule = Capsule.create(Vector3.ZERO, 0.25, 0.5);

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.CapsuleGeometry(this.capsule.radius, this.capsule.height * 0.5);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }
    }
}
