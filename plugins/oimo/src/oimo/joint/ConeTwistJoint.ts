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
        MaxSwingAngleX,
        MaxSwingAngleZ,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class ConeTwistJoint extends Joint<OIMO.RagdollJoint> {
        private static readonly _config: OIMO.RagdollJointConfig = new OIMO.RagdollJointConfig();
        private static readonly _swingSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.ConeTwist;

        @paper.serializedField
        private readonly _twistAxis: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        private readonly _swingAxis: Vector3 = Vector3.RIGHT.clone();
        @paper.serializedField
        private readonly _valuesB: Float32Array = new Float32Array([
            0.0, 0.0, 0,
            0.0, 0.0, 0,
            -180.0, 180.0, 0.0, 0.0,
            180.0, 180.0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            const config = ConeTwistJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useGlobalAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._twistAxis as any, this._swingAxis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.getWorldMatrix();
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor);
                const twistAxis = Vector3.create().applyMatrix(matrix, this._twistAxis);
                const swingAxis = Vector3.create().applyMatrix(matrix, this._swingAxis);
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, twistAxis as any, swingAxis as any
                );
                anchor.release();
                twistAxis.release();
                swingAxis.release();
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
            config.twistLimitMotor.lowerLimit = this.lowerLimit * DEG_RAD;
            config.twistLimitMotor.upperLimit = this.upperLimit * DEG_RAD;
            config.twistLimitMotor.motorSpeed = this.motorSpeed * DEG_RAD;
            config.twistLimitMotor.motorTorque = this.motorTorque;

            config.maxSwingAngle1 = this.maxSwingAngleZ * DEG_RAD;
            config.maxSwingAngle2 = this.maxSwingAngleX * DEG_RAD;

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

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getTwistSpringDamper();
                springDamper.frequency = value;
            }
        }
        /**
         * 
         */
        public get twistDampingRatio() {
            return this._valuesB[ValueType.TWDampingRatio];
        }
        public set twistDampingRatio(value: number) {
            this._valuesB[ValueType.TWDampingRatio] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getTwistSpringDamper();
                springDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        public get twistUseSymplecticEuler() {
            return this._valuesB[ValueType.TWUseSymplecticEuler] > 0;
        }
        public set twistUseSymplecticEuler(value: boolean) {
            this._valuesB[ValueType.TWUseSymplecticEuler] = value ? 1 : 0;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getTwistSpringDamper();
                springDamper.useSymplecticEuler = value;
            }
        }
        /**
         * 
         */
        public get swingFrequency() {
            return this._valuesB[ValueType.SWFrequency];
        }
        public set swingFrequency(value: number) {
            this._valuesB[ValueType.SWFrequency] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getSwingSpringDamper();
                springDamper.frequency = value;
            }
        }
        /**
         * 
         */
        public get swingDampingRatio() {
            return this._valuesB[ValueType.SWDampingRatio];
        }
        public set swingDampingRatio(value: number) {
            this._valuesB[ValueType.SWDampingRatio] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getSwingSpringDamper();
                springDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        public get swingUseSymplecticEuler() {
            return this._valuesB[ValueType.SWUseSymplecticEuler] > 0;
        }
        public set swingUseSymplecticEuler(value: boolean) {
            this._valuesB[ValueType.SWUseSymplecticEuler] = value ? 1 : 0;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RagdollJoint).getSwingSpringDamper();
                springDamper.useSymplecticEuler = value;
            }
        }
        /**
         * 
         */
        public get lowerLimit() {
            return this._valuesB[ValueType.LowerLimit];
        }
        public set lowerLimit(value: number) {
            this._valuesB[ValueType.LowerLimit] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.RagdollJoint).getTwistLimitMotor();
                limitMotor.lowerLimit = value;
            }
        }
        /**
         * 
         */
        public get upperLimit() {
            return this._valuesB[ValueType.UpperLimit];
        }
        public set upperLimit(value: number) {
            this._valuesB[ValueType.UpperLimit] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.RagdollJoint).getTwistLimitMotor();
                limitMotor.upperLimit = value;
            }
        }
        /**
         * 
         */
        public get motorSpeed() {
            return this._valuesB[ValueType.MotorSpeed];
        }
        public set motorSpeed(value: number) {
            this._valuesB[ValueType.MotorSpeed] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.RagdollJoint).getTwistLimitMotor();
                limitMotor.motorSpeed = value;
            }
        }
        /**
         * 
         */
        public get motorTorque() {
            return this._valuesB[ValueType.MotorTorque];
        }
        public set motorTorque(value: number) {
            this._valuesB[ValueType.MotorTorque] = value;

            if (this._oimoJoint) {
                const limitMotor = (this._oimoJoint as OIMO.RagdollJoint).getTwistLimitMotor();
                limitMotor.motorTorque = value;
            }
        }
        /**
         * 
         */
        public get maxSwingAngleX() {
            return this._valuesB[ValueType.MaxSwingAngleX];
        }
        public set maxSwingAngleX(value: number) {
            if (value < 1.0) {
                value = 1.0;
            }

            if (this._oimoJoint) {
                console.warn("Cannot change the maxSwingAngleX after the joint has been created.");
            }
            else {
                this._valuesB[ValueType.MaxSwingAngleX] = value;
            }
        }
        /**
         * 
         */
        public get maxSwingAngleZ() {
            return this._valuesB[ValueType.MaxSwingAngleZ];
        }
        public set maxSwingAngleZ(value: number) {
            if (value < 1.0) {
                value = 1.0;
            }

            if (this._oimoJoint) {
                console.warn("Cannot change the maxSwingAngleZ after the joint has been created.");
            }
            else {
                this._valuesB[ValueType.MaxSwingAngleZ] = value;
            }
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
                this._twistAxis.normalize(value);
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
                this._swingAxis.normalize(value);
            }
        }
    }
}