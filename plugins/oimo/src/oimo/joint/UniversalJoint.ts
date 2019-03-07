namespace egret3d.oimo {
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class UniversalJoint extends BaseJoint<OIMO.UniversalJoint> {
        private static readonly _config: OIMO.UniversalJointConfig = new OIMO.UniversalJointConfig();
        private static readonly _springDamperY: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _springDamperZ: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _limitMotorY: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();
        private static readonly _limitMotorZ: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Universal;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamperY: SpringDamper = SpringDamper.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamperZ: SpringDamper = SpringDamper.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotorY: RotationalLimitMotor = RotationalLimitMotor.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotorZ: RotationalLimitMotor = RotationalLimitMotor.create();

        @paper.serializedField
        private readonly _axisY: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        private readonly _axisZ: Vector3 = Vector3.FORWARD.clone();

        protected readonly _values: Float32Array = new Float32Array([
            0, 0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody)!;

            const config = UniversalJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axisY as any, this._axisZ as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const axisY = Vector3.create().applyMatrix(matrix, this._axisY).release();
                const axisZ = Vector3.create().applyMatrix(matrix, this._axisZ).release();
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axisY as any, axisZ as any
                );
            }

            config.springDamper1 = UniversalJoint._springDamperY;
            config.springDamper2 = UniversalJoint._springDamperZ;
            config.limitMotor1 = UniversalJoint._limitMotorY;
            config.limitMotor2 = UniversalJoint._limitMotorZ;

            config.springDamper1.frequency = this.springDamperY.frequency;
            config.springDamper1.dampingRatio = this.springDamperY.dampingRatio;
            config.springDamper1.useSymplecticEuler = this.springDamperY.useSymplecticEuler;
            config.springDamper2.frequency = this.springDamperZ.frequency;
            config.springDamper2.dampingRatio = this.springDamperZ.dampingRatio;
            config.springDamper2.useSymplecticEuler = this.springDamperZ.useSymplecticEuler;
            config.limitMotor1.lowerLimit = this.limitMotorY.lowerLimit;
            config.limitMotor1.upperLimit = this.limitMotorY.upperLimit;
            config.limitMotor1.motorSpeed = this.limitMotorY.motorSpeed;
            config.limitMotor1.motorTorque = this.limitMotorY.motorTorque;
            config.limitMotor2.lowerLimit = this.limitMotorZ.lowerLimit;
            config.limitMotor2.upperLimit = this.limitMotorZ.upperLimit;
            config.limitMotor2.motorSpeed = this.limitMotorZ.motorSpeed;
            config.limitMotor2.motorTorque = this.limitMotorZ.motorTorque;

            const joint = new OIMO.UniversalJoint(config);
            this.springDamperY._oimoSpringDamper = joint.getSpringDamper1();
            this.springDamperZ._oimoSpringDamper = joint.getSpringDamper2();
            this.limitMotorY._oimoRotationalLimitMotor = joint.getLimitMotor1();
            this.limitMotorZ._oimoRotationalLimitMotor = joint.getLimitMotor2();
            joint.userData = this;

            return joint;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axisY(): Readonly<Vector3> {
            return this._axisY;
        }
        public set axisY(value: Readonly<Vector3>) {
            if (!this._oimoJoint) {
                this._axisY.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axisY after the joint has been created.");
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axisZ(): Readonly<Vector3> {
            return this._axisZ;
        }
        public set axisZ(value: Readonly<Vector3>) {
            if (!this._oimoJoint) {
                this._axisZ.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axisZ after the joint has been created.");
            }
        }
    }
}