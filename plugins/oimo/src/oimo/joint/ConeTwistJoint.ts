namespace egret3d.oimo {
    const enum ValueType {
        _0, _1, _2, _3,
        MaxSwingAngleX,
        MaxSwingAngleZ,
    }
    /**
     * 锥形旋转关节组件。
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class ConeTwistJoint extends BaseJoint<OIMO.RagdollJoint> {
        private static readonly _config: OIMO.RagdollJointConfig = new OIMO.RagdollJointConfig();
        private static readonly _swingSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.ConeTwist;
        /**
         * 沿着关节的旋转弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly twistSpringDamper: SpringDamper = SpringDamper.create();
        /**
         * 沿着关节的旋转马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly twistLimitMotor: RotationalLimitMotor = RotationalLimitMotor.create();
        /**
         * 沿着关节的摇摆弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly swingSpringDamper: SpringDamper = SpringDamper.create();

        @paper.serializedField
        private readonly _twistAxis: Vector3 = Vector3.create();
        @paper.serializedField
        private readonly _swingAxis: Vector3 = Vector3.create();

        protected readonly _values: Float32Array = new Float32Array(6);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            const config = ConeTwistJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldSpace) {
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._twistAxis as any, this._swingAxis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const twistAxis = Vector3.create().applyDirection(matrix, this._twistAxis).release();
                const swingAxis = Vector3.create().applyDirection(matrix, this._swingAxis).release();
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, twistAxis as any, swingAxis as any
                );
            }

            config.twistSpringDamper = ConeTwistJoint._twistSpringDamper;
            config.twistLimitMotor = ConeTwistJoint._twistLimitMotor;
            config.swingSpringDamper = ConeTwistJoint._swingSpringDamper;

            config.maxSwingAngle1 = this.maxSwingAngleZ;
            config.maxSwingAngle2 = this.maxSwingAngleX;
            config.twistSpringDamper.frequency = this.twistSpringDamper.frequency;
            config.twistSpringDamper.dampingRatio = this.twistSpringDamper.dampingRatio;
            config.twistSpringDamper.useSymplecticEuler = this.twistSpringDamper.useSymplecticEuler;
            config.twistLimitMotor.lowerLimit = this.twistLimitMotor.lowerLimit;
            config.twistLimitMotor.upperLimit = this.twistLimitMotor.upperLimit;
            config.twistLimitMotor.motorSpeed = this.twistLimitMotor.motorSpeed;
            config.twistLimitMotor.motorTorque = this.twistLimitMotor.motorTorque;
            config.swingSpringDamper.frequency = this.swingSpringDamper.frequency;
            config.swingSpringDamper.dampingRatio = this.swingSpringDamper.dampingRatio;
            config.swingSpringDamper.useSymplecticEuler = this.swingSpringDamper.useSymplecticEuler;

            const joint = new OIMO.RagdollJoint(config);
            this.twistSpringDamper._oimoSpringDamper = joint.getTwistSpringDamper();
            this.twistLimitMotor._oimoLimitMotor = joint.getTwistLimitMotor();
            this.swingSpringDamper._oimoSpringDamper = joint.getSwingSpringDamper();
            joint.userData = this;

            return joint;
        }

        public initialize() {
            super.initialize();

            this._twistAxis.copy(Vector3.UP);
            this._swingAxis.copy(Vector3.RIGHT);
            this._values[ValueType.MaxSwingAngleX] = Math.PI;
            this._values[ValueType.MaxSwingAngleZ] = Math.PI;
        }

        public uninitialize() {
            super.uninitialize();

            this.twistSpringDamper._clear();
            this.twistLimitMotor._clear();
            this.swingSpringDamper._clear();
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get maxSwingAngleX(): float {
            return this._values[ValueType.MaxSwingAngleX];
        }
        public set maxSwingAngleX(value: float) {
            if (this._oimoJoint === null) {
                this._values[ValueType.MaxSwingAngleX] = value;
            }
            else if (DEBUG) {
                console.warn("Cannot change the maxSwingAngleX after the joint has been created.");
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get maxSwingAngleZ(): float {
            return this._values[ValueType.MaxSwingAngleZ];
        }
        public set maxSwingAngleZ(value: float) {
            if (this._oimoJoint === null) {
                this._values[ValueType.MaxSwingAngleZ] = value;
            }
            else if (DEBUG) {
                console.warn("Cannot change the maxSwingAngleZ after the joint has been created.");
            }
        }
        /**
         * 该关节的旋转轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get twistAxis(): Readonly<Vector3> {
            return this._twistAxis;
        }
        public set twistAxis(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._twistAxis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
        }
        /**
         * 该关节的摇摆轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get swingAxis(): Readonly<Vector3> {
            return this._swingAxis;
        }
        public set swingAxis(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._swingAxis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
        }
    }
}
