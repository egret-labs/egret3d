namespace egret3d.oimo {
    const enum ValueType {
        // Swing SpringDamper
        SWFrequency,
        SWDampingRatio,
        SWUseSymplecticEuler,
        // Twist SpringDamper
        TWFrequency,
        TWDampingRatio,
        TWUseSymplecticEuler,
        // RotationalLimitMotor
        LowerLimit,
        UpperLimit,
        MotorSpeed,
        MotorTorque,
        //
        MaxSwingAngleA,
        MaxSwingAngleB,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class ConeTwistJoint extends Joint<OIMO.RagdollJoint> {
        private static readonly _config: OIMO.RagdollJointConfig = new OIMO.RagdollJointConfig();
        private static readonly _swingSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.RAGDOLL;

        @paper.serializedField
        private readonly _twistAxis: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        private readonly _swingAxis: Vector3 = Vector3.RIGHT.clone(); //
        @paper.serializedField
        private readonly _valuesB: Float32Array = new Float32Array([
            0.0, 0.0, 0,
            0.0, 0.0, 0,
            1.0, 0.0, 0.0, 0.0,
            Math.PI, Math.PI,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                return null;
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            const config = ConeTwistJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.isGlobalAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._twistAxis as any, this._twistAxis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.getWorldMatrix();
                const anchor = matrix.transformVector3(helpVector3A.copy(this._anchor));
                const twistAxis = matrix.transformNormal(helpVector3B.copy(this._twistAxis));
                const swingAxis = matrix.transformNormal(helpVector3C.copy(this._swingAxis));
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, twistAxis as any, swingAxis as any
                );
            }

            config.twistSpringDamper = ConeTwistJoint._twistSpringDamper;
            config.swingSpringDamper = ConeTwistJoint._swingSpringDamper;
            config.twistLimitMotor = ConeTwistJoint._twistLimitMotor;

            config.twistSpringDamper.frequency = this.twistFrequency;
            config.twistSpringDamper.dampingRatio = this.twistDampingRatio;
            config.twistSpringDamper.useSymplecticEuler = this.twistUseSymplecticEuler;
            config.swingSpringDamper.frequency = this.swingFrequency;
            config.swingSpringDamper.dampingRatio = this.swingDampingRatio;
            config.swingSpringDamper.useSymplecticEuler = this.swingUseSymplecticEuler;
            config.twistLimitMotor.lowerLimit = this.lowerLimit * egret3d.RAD_DEG;
            config.twistLimitMotor.upperLimit = this.upperLimit * egret3d.RAD_DEG;
            config.twistLimitMotor.motorSpeed = this.motorSpeed;
            config.twistLimitMotor.motorTorque = this.motorTorque;

            config.maxSwingAngle1 = this.maxSwingAngle1;
            config.maxSwingAngle2 = this.maxSwingAngle2;

            const joint = new OIMO.RagdollJoint(config);
            joint.userData = this;

            return joint;
        }
        /**
         * 
         */
        public get twistFrequency() {
            return this._valuesB[ValueType.TWFrequency];
        }
        public set twistFrequency(value: number) {
            this._valuesB[ValueType.TWFrequency] = value;
        }
        /**
         * 
         */
        public get twistDampingRatio() {
            return this._valuesB[ValueType.TWDampingRatio];
        }
        public set twistDampingRatio(value: number) {
            this._valuesB[ValueType.TWDampingRatio] = value;
        }
        /**
         * 
         */
        public get twistUseSymplecticEuler() {
            return this._valuesB[ValueType.TWUseSymplecticEuler] > 0;
        }
        public set twistUseSymplecticEuler(value: boolean) {
            this._valuesB[ValueType.TWUseSymplecticEuler] = value ? 1 : 0;
        }
        /**
         * 
         */
        public get swingFrequency() {
            return this._valuesB[ValueType.SWFrequency];
        }
        public set swingFrequency(value: number) {
            this._valuesB[ValueType.SWFrequency] = value;
        }
        /**
         * 
         */
        public get swingDampingRatio() {
            return this._valuesB[ValueType.SWDampingRatio];
        }
        public set swingDampingRatio(value: number) {
            this._valuesB[ValueType.SWDampingRatio] = value;
        }
        /**
         * 
         */
        public get swingUseSymplecticEuler() {
            return this._valuesB[ValueType.SWUseSymplecticEuler] > 0;
        }
        public set swingUseSymplecticEuler(value: boolean) {
            this._valuesB[ValueType.SWUseSymplecticEuler] = value ? 1 : 0;
        }
        /**
         * 
         */
        public get lowerLimit() {
            return this._valuesB[ValueType.LowerLimit];
        }
        public set lowerLimit(value: number) {
            this._valuesB[ValueType.LowerLimit] = value;
        }
        /**
         * 
         */
        public get upperLimit() {
            return this._valuesB[ValueType.UpperLimit];
        }
        public set upperLimit(value: number) {
            this._valuesB[ValueType.UpperLimit] = value;
        }
        /**
         * 
         */
        public get motorSpeed() {
            return this._valuesB[ValueType.MotorSpeed];
        }
        public set motorSpeed(value: number) {
            this._valuesB[ValueType.MotorSpeed] = value;
        }
        /**
         * 
         */
        public get motorTorque() {
            return this._valuesB[ValueType.MotorTorque];
        }
        public set motorTorque(value: number) {
            this._valuesB[ValueType.MotorTorque] = value;
        }
        /**
         * 
         */
        public get maxSwingAngle1() {
            return this._valuesB[ValueType.MaxSwingAngleA];
        }
        public set maxSwingAngle1(value: number) {
            this._valuesB[ValueType.MaxSwingAngleA] = value;
        }
        /**
         * 
         */
        public get maxSwingAngle2() {
            return this._valuesB[ValueType.MaxSwingAngleB];
        }
        public set maxSwingAngle2(value: number) {
            this._valuesB[ValueType.MaxSwingAngleB] = value;
        }
        /**
         * 
         */
        public get twistAxis() {
            return this._twistAxis;
        }
        public set twistAxis(value: Readonly<IVector3>) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
            else {
                this._twistAxis.copy(value).normalize();
            }
        }
        /**
         * 
         */
        public get swingAxis() {
            return this._swingAxis;
        }
        public set swingAxis(value: Readonly<IVector3>) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
            else {
                this._swingAxis.copy(value).normalize();
            }
        }
    }
}