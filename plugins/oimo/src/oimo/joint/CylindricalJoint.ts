namespace egret3d.oimo {
    /**
     * 柱面关节组件。
     * - https://en.wikipedia.org/wiki/Cylindrical_joint
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class CylindricalJoint extends BaseJoint<OIMO.CylindricalJoint> {
        private static readonly _config: OIMO.CylindricalJointConfig = new OIMO.CylindricalJointConfig();
        private static readonly _translationalSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _translationalLimitMotor: OIMO.TranslationalLimitMotor = new OIMO.TranslationalLimitMotor();
        private static readonly _rotationalSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _rotationalLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Cylindrical;
        /**
         * 该关节的移动弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly translationalSpringDamper: SpringDamper = SpringDamper.create();
        /**
         * 该关节的移动马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly translationalLimitMotor: TranslationalLimitMotor = TranslationalLimitMotor.create();
        /**
         * 该关节的旋转弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly rotationalSpringDamper: SpringDamper = SpringDamper.create();
        /**
         * 该关节的旋转马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly rotationalLimitMotor: RotationalLimitMotor = RotationalLimitMotor.create();

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

            const config = CylindricalJoint._config;
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

            config.translationalSpringDamper = CylindricalJoint._translationalSpringDamper;
            config.translationalLimitMotor = CylindricalJoint._translationalLimitMotor;
            config.rotationalSpringDamper = CylindricalJoint._rotationalSpringDamper;
            config.rotationalLimitMotor = CylindricalJoint._rotationalLimitMotor;

            config.translationalSpringDamper.frequency = this.translationalSpringDamper.frequency;
            config.translationalSpringDamper.dampingRatio = this.translationalSpringDamper.dampingRatio;
            config.translationalSpringDamper.useSymplecticEuler = this.translationalSpringDamper.useSymplecticEuler;
            config.translationalLimitMotor.lowerLimit = this.translationalLimitMotor.lowerLimit;
            config.translationalLimitMotor.upperLimit = this.translationalLimitMotor.upperLimit;
            config.translationalLimitMotor.motorSpeed = this.translationalLimitMotor.motorSpeed;
            config.translationalLimitMotor.motorForce = this.translationalLimitMotor.motorForce;
            config.rotationalSpringDamper.frequency = this.rotationalSpringDamper.frequency;
            config.rotationalSpringDamper.dampingRatio = this.rotationalSpringDamper.dampingRatio;
            config.rotationalSpringDamper.useSymplecticEuler = this.rotationalSpringDamper.useSymplecticEuler;
            config.rotationalLimitMotor.lowerLimit = this.rotationalLimitMotor.lowerLimit;
            config.rotationalLimitMotor.upperLimit = this.rotationalLimitMotor.upperLimit;
            config.rotationalLimitMotor.motorSpeed = this.rotationalLimitMotor.motorSpeed;
            config.rotationalLimitMotor.motorTorque = this.rotationalLimitMotor.motorTorque;

            const joint = new OIMO.CylindricalJoint(config);
            this.translationalSpringDamper._oimoSpringDamper = (joint as any).getTranslationalSpringDamper();
            this.translationalLimitMotor._oimoLimitMotor = (joint as any).getTranslationalLimitMotor();
            this.rotationalSpringDamper._oimoSpringDamper = (joint as any).getRotationalSpringDamper();
            this.rotationalLimitMotor._oimoLimitMotor = (joint as any).getRotationalLimitMotor();

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