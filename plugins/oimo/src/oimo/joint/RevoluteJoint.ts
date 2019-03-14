namespace egret3d.oimo {
    /**
     * 转动关节组件。
     * - https://en.wikipedia.org/wiki/Revolute_joint
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class RevoluteJoint extends BaseJoint<OIMO.RevoluteJoint> {
        private static readonly _config: OIMO.RevoluteJointConfig = new OIMO.RevoluteJointConfig();
        private static readonly _springDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _rotationalLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Revolute;
        /**
         * 该关节的弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamper: SpringDamper = SpringDamper.create();
        /**
         * 该关节的旋转马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotor: RotationalLimitMotor = RotationalLimitMotor.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        private readonly _axis: Vector3 = Vector3.DOWN.clone();

        protected readonly _values: Float32Array = new Float32Array([
            0, 0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody)!;

            const config = RevoluteJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldSpace) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const axis = Vector3.create().applyDirection(matrix, this._axis).release();
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axis as any
                );
            }

            config.springDamper = RevoluteJoint._springDamper;
            config.limitMotor = RevoluteJoint._rotationalLimitMotor;
            config.springDamper.frequency = this.springDamper.frequency;
            config.springDamper.dampingRatio = this.springDamper.dampingRatio;
            config.springDamper.useSymplecticEuler = this.springDamper.useSymplecticEuler;
            config.limitMotor.lowerLimit = this.limitMotor.lowerLimit;
            config.limitMotor.upperLimit = this.limitMotor.upperLimit;
            config.limitMotor.motorSpeed = this.limitMotor.motorSpeed;
            config.limitMotor.motorTorque = this.limitMotor.motorTorque;

            const joint = new OIMO.RevoluteJoint(config);
            this.springDamper._oimoSpringDamper = joint.getSpringDamper();
            this.limitMotor._oimoLimitMotor = joint.getLimitMotor();

            joint.userData = this;

            return joint;
        }
        /**
         * 该关节的旋转轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axis(): Readonly<Vector3> {
            return this._axis;
        }
        public set axis(value: Readonly<Vector3>) {
            if (!this._oimoJoint) {
                this._axis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis after the joint has been created.");
            }
        }
    }
}