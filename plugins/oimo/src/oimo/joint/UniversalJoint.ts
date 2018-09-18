namespace egret3d.oimo {
    const enum ValueType {
        // AxisY SpringDamper
        FrequencyY,
        DampingRatioY,
        UseSymplecticEulerY,
        // AxisZ SpringDamper
        FrequencyZ,
        DampingRatioZ,
        UseSymplecticEulerZ,
        // AxisY RotationalLimitMotor
        LowerLimitY,
        UpperLimitY,
        MotorSpeedY,
        MotorTorqueY,
        // AxisZ RotationalLimitMotor
        LowerLimitZ,
        UpperLimitZ,
        MotorSpeedZ,
        MotorTorqueZ,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class UniversalJoint extends Joint<OIMO.UniversalJoint> {
        private static readonly _config: OIMO.UniversalJointConfig = new OIMO.UniversalJointConfig();
        private static readonly _springDamperY: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _springDamperZ: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _limitMotorY: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();
        private static readonly _limitMotorZ: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Universal;

        @paper.serializedField
        private readonly _axisY: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        private readonly _axisZ: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        private readonly _valuesB: Float32Array = new Float32Array([
            0.0, 0.0, 0,
            0.0, 0.0, 0,
            -180.0, 180.0, 0.0, 0.0,
            -180.0, 180.0, 0.0, 0.0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            const config = UniversalJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useGlobalAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axisY as any, this._axisZ as any
                );
            }
            else {
                const matrix = this.gameObject.transform.getWorldMatrix();
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor);
                const axisY = Vector3.create().applyMatrix(matrix, this._axisY);
                const axisZ = Vector3.create().applyMatrix(matrix, this._axisZ);
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axisY as any, axisZ as any
                );
                anchor.release();
                axisY.release();
                axisZ.release();
            }

            config.springDamper1 = UniversalJoint._springDamperY;
            config.springDamper2 = UniversalJoint._springDamperZ;
            config.limitMotor1 = UniversalJoint._limitMotorY;
            config.limitMotor2 = UniversalJoint._limitMotorZ;

            config.springDamper1.frequency = this.frequencyY;
            config.springDamper1.dampingRatio = this.dampingRatioY;
            config.springDamper1.useSymplecticEuler = this.useSymplecticEulerY;
            config.springDamper2.frequency = this.frequencyZ;
            config.springDamper2.dampingRatio = this.dampingRatioZ;
            config.springDamper2.useSymplecticEuler = this.useSymplecticEulerZ;
            config.limitMotor1.lowerLimit = this.lowerLimitY * egret3d.DEG_RAD;
            config.limitMotor1.upperLimit = this.upperLimitY * egret3d.DEG_RAD;
            config.limitMotor1.motorSpeed = this.motorSpeedY * egret3d.DEG_RAD;
            config.limitMotor1.motorTorque = this.motorTorqueY;
            config.limitMotor2.lowerLimit = this.lowerLimitZ * egret3d.DEG_RAD;
            config.limitMotor2.upperLimit = this.upperLimitZ * egret3d.DEG_RAD;
            config.limitMotor2.motorSpeed = this.motorSpeedZ * egret3d.DEG_RAD;
            config.limitMotor2.motorTorque = this.motorTorqueZ;

            const joint = new OIMO.UniversalJoint(config);
            joint.userData = this;

            return joint;
        }
        /**
         * 
         */
        public get frequencyY() {
            return this._valuesB[ValueType.FrequencyY];
        }
        public set frequencyY(value: number) {
            this._valuesB[ValueType.FrequencyY] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper1();
                springDamper.frequency = value;
            }
        }
        /**
         * 
         */
        public get dampingRatioY() {
            return this._valuesB[ValueType.DampingRatioY];
        }
        public set dampingRatioY(value: number) {
            this._valuesB[ValueType.DampingRatioY] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper1();
                springDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        public get useSymplecticEulerY() {
            return this._valuesB[ValueType.UseSymplecticEulerY] > 0;
        }
        public set useSymplecticEulerY(value: boolean) {
            this._valuesB[ValueType.UseSymplecticEulerY] = value ? 1 : 0;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper1();
                springDamper.useSymplecticEuler = value;
            }
        }
        /**
         * 
         */
        public get frequencyZ() {
            return this._valuesB[ValueType.FrequencyZ];
        }
        public set frequencyZ(value: number) {
            this._valuesB[ValueType.FrequencyZ] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper2();
                springDamper.frequency = value;
            }
        }
        /**
         * 
         */
        public get dampingRatioZ() {
            return this._valuesB[ValueType.DampingRatioZ];
        }
        public set dampingRatioZ(value: number) {
            this._valuesB[ValueType.DampingRatioZ] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper2();
                springDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        public get useSymplecticEulerZ() {
            return this._valuesB[ValueType.UseSymplecticEulerZ] > 0;
        }
        public set useSymplecticEulerZ(value: boolean) {
            this._valuesB[ValueType.UseSymplecticEulerZ] = value ? 1 : 0;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.UniversalJoint).getSpringDamper2();
                springDamper.useSymplecticEuler = value;
            }
        }
        /**
         * 
         */
        public get lowerLimitY() {
            return this._valuesB[ValueType.LowerLimitY];
        }
        public set lowerLimitY(value: number) {
            this._valuesB[ValueType.LowerLimitY] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor1();
                limitMotor.lowerLimit = value;
            }
        }
        /**
         * 
         */
        public get upperLimitY() {
            return this._valuesB[ValueType.UpperLimitY];
        }
        public set upperLimitY(value: number) {
            this._valuesB[ValueType.UpperLimitY] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor1();
                limitMotor.upperLimit = value;
            }
        }
        /**
         * 
         */
        public get motorSpeedY() {
            return this._valuesB[ValueType.MotorSpeedY];
        }
        public set motorSpeedY(value: number) {
            this._valuesB[ValueType.MotorSpeedY] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor1();
                limitMotor.motorSpeed = value;
            }
        }
        /**
         * 
         */
        public get motorTorqueY() {
            return this._valuesB[ValueType.MotorTorqueY];
        }
        public set motorTorqueY(value: number) {
            this._valuesB[ValueType.MotorTorqueY] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor1();
                limitMotor.motorTorque = value;
            }
        }
        /**
         * 
         */
        public get lowerLimitZ() {
            return this._valuesB[ValueType.LowerLimitZ];
        }
        public set lowerLimitZ(value: number) {
            this._valuesB[ValueType.LowerLimitZ] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor2();
                limitMotor.lowerLimit = value;
            }
        }
        /**
         * 
         */
        public get upperLimitZ() {
            return this._valuesB[ValueType.UpperLimitZ];
        }
        public set upperLimitZ(value: number) {
            this._valuesB[ValueType.UpperLimitZ] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor2();
                limitMotor.upperLimit = value;
            }
        }
        /**
         * 
         */
        public get motorSpeedZ() {
            return this._valuesB[ValueType.MotorSpeedZ];
        }
        public set motorSpeedZ(value: number) {
            this._valuesB[ValueType.MotorSpeedZ] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor2();
                limitMotor.motorSpeed = value;
            }
        }
        /**
         * 
         */
        public get motorTorqueZ() {
            return this._valuesB[ValueType.MotorTorqueZ];
        }
        public set motorTorqueZ(value: number) {
            this._valuesB[ValueType.MotorTorqueZ] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.UniversalJoint).getLimitMotor2();
                limitMotor.motorTorque = value;
            }
        }
        /**
         * 
         */
        public get axisY() {
            return this._axisY;
        }
        public set axisY(value: Readonly<IVector3>) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axisY after the joint has been created.");
            }
            else {
                this._axisY.normalize(value);
            }
        }
        /**
         * 
         */
        public get axisZ() {
            return this._axisZ;
        }
        public set axisZ(value: Readonly<IVector3>) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axisZ after the joint has been created.");
            }
            else {
                this._axisZ.normalize(value);
            }
        }
    }
}