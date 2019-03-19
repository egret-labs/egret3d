namespace egret3d.oimo {
    /**
     * 万向关节组件。
     * - https://en.wikipedia.org/wiki/Universal_joint
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class UniversalJoint extends BaseJoint<OIMO.UniversalJoint> {
        private static readonly _config: OIMO.UniversalJointConfig = new OIMO.UniversalJointConfig();
        private static readonly _springDamperX: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _springDamperY: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _limitMotorX: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();
        private static readonly _limitMotorY: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Universal;
        /**
         * 该关节的 X 轴旋转弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamperX: SpringDamper = SpringDamper.create();
        /**
         * 该关节的 X 轴旋转马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotorX: RotationalLimitMotor = RotationalLimitMotor.create();
        /**
         * 该关节的 Y 轴旋转弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamperY: SpringDamper = SpringDamper.create();
        /**
         * 该关节的 Y 轴旋转马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotorY: RotationalLimitMotor = RotationalLimitMotor.create();

        @paper.serializedField
        private readonly _axisX: Vector3 = Vector3.create();
        @paper.serializedField
        private readonly _axisY: Vector3 = Vector3.create();

        protected readonly _values: Float32Array = new Float32Array(4);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            const config = UniversalJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldSpace) {
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axisX as any, this._axisY as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const axisX = Vector3.create().applyDirection(matrix, this._axisX).release();
                const axisY = Vector3.create().applyDirection(matrix, this._axisY).release();
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axisX as any, axisY as any
                );
            }

            config.springDamper1 = UniversalJoint._springDamperX;
            config.springDamper2 = UniversalJoint._springDamperY;
            config.limitMotor1 = UniversalJoint._limitMotorX;
            config.limitMotor2 = UniversalJoint._limitMotorY;

            config.springDamper1.frequency = this.springDamperX.frequency;
            config.springDamper1.dampingRatio = this.springDamperX.dampingRatio;
            config.springDamper1.useSymplecticEuler = this.springDamperX.useSymplecticEuler;
            config.limitMotor1.lowerLimit = this.limitMotorX.lowerLimit;
            config.limitMotor1.upperLimit = this.limitMotorX.upperLimit;
            config.limitMotor1.motorSpeed = this.limitMotorX.motorSpeed;
            config.limitMotor1.motorTorque = this.limitMotorX.motorTorque;
            config.springDamper2.frequency = this.springDamperY.frequency;
            config.springDamper2.dampingRatio = this.springDamperY.dampingRatio;
            config.springDamper2.useSymplecticEuler = this.springDamperY.useSymplecticEuler;
            config.limitMotor2.lowerLimit = this.limitMotorY.lowerLimit;
            config.limitMotor2.upperLimit = this.limitMotorY.upperLimit;
            config.limitMotor2.motorSpeed = this.limitMotorY.motorSpeed;
            config.limitMotor2.motorTorque = this.limitMotorY.motorTorque;

            const joint = new OIMO.UniversalJoint(config);
            this.springDamperX._oimoSpringDamper = joint.getSpringDamper1();
            this.springDamperY._oimoSpringDamper = joint.getSpringDamper2();
            this.limitMotorX._oimoLimitMotor = joint.getLimitMotor1();
            this.limitMotorY._oimoLimitMotor = joint.getLimitMotor2();
            joint.userData = this;

            return joint;
        }

        public initialize() {
            super.initialize();

            this._axisX.copy(Vector3.RIGHT);
            this._axisY.copy(Vector3.UP);
        }

        public uninitialize() {
            super.uninitialize();

            this.springDamperX._clear();
            this.limitMotorX._clear();
            this.springDamperY._clear();
            this.limitMotorY._clear();
        }
        /**
         * 该关节的 X 旋转轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axisX(): Readonly<Vector3> {
            return this._axisX;
        }
        public set axisX(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._axisX.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axisX after the joint has been created.");
            }
        }
        /**
         * 该关节的 Y 旋转轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axisY(): Readonly<Vector3> {
            return this._axisY;
        }
        public set axisY(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._axisY.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axisY after the joint has been created.");
            }
        }
    }
}