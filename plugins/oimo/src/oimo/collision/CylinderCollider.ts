namespace egret3d.oimo {
    /**
     * 圆柱体碰撞组件。
     * - 与 Y 轴对齐。
     */
    @paper.requireComponent(Rigidbody)
    export class CylinderCollider extends BaseCollider implements ICylinderCollider {
        public readonly colliderType: ColliderType = ColliderType.Cylinder;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly cylinder: Cylinder = Cylinder.create();

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.CylinderGeometry(this.cylinder.bottomRadius, this.cylinder.height * 0.5);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }

        public initialize() {
            super.initialize();

            this.cylinder.set(Vector3.ZERO, 0.5, 0.5, 1.0);
        }
    }
}
