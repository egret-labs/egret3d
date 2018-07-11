namespace egret3d.oimo {
    const enum ValueType {
        // SpringDamper
        Frequency,
        DampingRatio,
        UseSymplecticEuler,
        // RotationalLimitMotor
        LowerLimit,
        UpperLimit,
        MotorSpeed,
        MotorTorque,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class HingeJoint extends Joint<OIMO.RevoluteJoint> {
        private static readonly _config: OIMO.RevoluteJointConfig = new OIMO.RevoluteJointConfig();
        private static readonly _springDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _limitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.Hinge;

        @paper.serializedField
        private readonly _axis: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        private readonly _valuesB: Float32Array = new Float32Array([
            0.0, 0.0, 0,
            -180.0, 180.0, 0.0, 0.0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                return null;
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            const config = HingeJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useGlobalAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.getWorldMatrix();
                const anchor = matrix.transformVector3(helpVector3A.copy(this._anchor));
                const axis = matrix.transformNormal(helpVector3B.copy(this._axis));
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axis as any
                );
            }

            config.springDamper = HingeJoint._springDamper;
            config.limitMotor = HingeJoint._limitMotor;
            config.springDamper.frequency = this.frequency;
            config.springDamper.dampingRatio = this.dampingRatio;
            config.springDamper.useSymplecticEuler = this.useSymplecticEuler;
            config.limitMotor.lowerLimit = this.lowerLimit * egret3d.DEG_RAD;
            config.limitMotor.upperLimit = this.upperLimit * egret3d.DEG_RAD;
            config.limitMotor.motorSpeed = this.motorSpeed * egret3d.DEG_RAD;
            config.limitMotor.motorTorque = this.motorTorque;

            const joint = new OIMO.RevoluteJoint(config);
            joint.userData = this;

            return joint;
        }
        /**
         * 
         */
        public get frequency() {
            return this._valuesB[ValueType.Frequency];
        }
        public set frequency(value: number) {
            this._valuesB[ValueType.Frequency] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RevoluteJoint).getSpringDamper();
                springDamper.frequency = value;
            }
        }
        /**
         * 
         */
        public get dampingRatio() {
            return this._valuesB[ValueType.DampingRatio];
        }
        public set dampingRatio(value: number) {
            this._valuesB[ValueType.DampingRatio] = value;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RevoluteJoint).getSpringDamper();
                springDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        public get useSymplecticEuler() {
            return this._valuesB[ValueType.UseSymplecticEuler] > 0;
        }
        public set useSymplecticEuler(value: boolean) {
            this._valuesB[ValueType.UseSymplecticEuler] = value ? 1 : 0;

            if (this._oimoJoint) {
                const springDamper = (this._oimoJoint as OIMO.RevoluteJoint).getSpringDamper();
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
                const limitMotor = (this._oimoJoint as OIMO.RevoluteJoint).getLimitMotor();
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
                const limitMotor = (this._oimoJoint as OIMO.RevoluteJoint).getLimitMotor();
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
                const limitMotor = (this._oimoJoint as OIMO.RevoluteJoint).getLimitMotor();
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
                const limitMotor = (this._oimoJoint as OIMO.RevoluteJoint).getLimitMotor();
                limitMotor.motorTorque = value;
            }
        }
        /**
         * 
         */
        public get axis() {
            return this._axis;
        }
        public set axis(value: Readonly<IVector3>) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
            else {
                this._axis.copy(value).normalize();
            }
        }
    }
}