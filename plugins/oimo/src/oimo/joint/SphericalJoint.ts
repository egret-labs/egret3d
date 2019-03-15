namespace egret3d.oimo {
    /**
     * 球面关节组件。
     * - https://en.wikipedia.org/wiki/Ball_joint
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class SphericalJoint extends BaseJoint<OIMO.SphericalJoint> {
        private static readonly _config: OIMO.SphericalJointConfig = new OIMO.SphericalJointConfig();
        private static readonly _springDamper: OIMO.SpringDamper = new OIMO.SpringDamper();

        public readonly jointType: JointType = JointType.Spherical;
        /**
         * 该关节的旋转弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamper: SpringDamper = SpringDamper.create();

        protected readonly _values: Float32Array = new Float32Array(4);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            const config = SphericalJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldSpace) {
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any,
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any,
                );
            }

            config.springDamper = SphericalJoint._springDamper;
            config.springDamper.frequency = this.springDamper.frequency;
            config.springDamper.dampingRatio = this.springDamper.dampingRatio;
            config.springDamper.useSymplecticEuler = this.springDamper.useSymplecticEuler;

            const joint = new OIMO.SphericalJoint(config);
            this.springDamper._oimoSpringDamper = joint.getSpringDamper();
            joint.userData = this;

            return joint;
        }

        public uninitialize() {
            super.uninitialize();

            this.springDamper._clear();
        }
    }
}
