namespace egret3d.oimo {
    const enum ValueType {
        _0, _1,
        MaxSwingAngleX,
        MaxSwingAngleZ,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class ConeTwistJoint extends BaseJoint<OIMO.RagdollJoint> {
        private static readonly _config: OIMO.RagdollJointConfig = new OIMO.RagdollJointConfig();
        private static readonly _swingSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistSpringDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _twistLimitMotor: OIMO.RotationalLimitMotor = new OIMO.RotationalLimitMotor();

        public readonly jointType: JointType = JointType.ConeTwist;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly swingSpringDamper: SpringDamper = SpringDamper.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly twistSpringDamper: SpringDamper = SpringDamper.create();

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly twistLimitMotor: RotationalLimitMotor = RotationalLimitMotor.create();

        @paper.serializedField
        private readonly _twistAxis: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        private readonly _swingAxis: Vector3 = Vector3.RIGHT.clone();

        protected readonly _values: Float32Array = new Float32Array([
            0, 0,
            180.0, 180.0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody)!;

            const config = ConeTwistJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._twistAxis as any, this._swingAxis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const twistAxis = Vector3.create().applyMatrix(matrix, this._twistAxis).release();
                const swingAxis = Vector3.create().applyMatrix(matrix, this._swingAxis).release();
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, twistAxis as any, swingAxis as any
                );
            }

            config.twistSpringDamper = ConeTwistJoint._twistSpringDamper;
            config.swingSpringDamper = ConeTwistJoint._swingSpringDamper;
            config.twistLimitMotor = ConeTwistJoint._twistLimitMotor;

            config.maxSwingAngle1 = this.maxSwingAngleZ;
            config.maxSwingAngle2 = this.maxSwingAngleX;
            config.twistSpringDamper.frequency = this.twistSpringDamper.frequency;
            config.twistSpringDamper.dampingRatio = this.twistSpringDamper.dampingRatio;
            config.twistSpringDamper.useSymplecticEuler = this.twistSpringDamper.useSymplecticEuler;
            config.twistSpringDamper.frequency = this.swingSpringDamper.frequency;
            config.twistSpringDamper.dampingRatio = this.swingSpringDamper.dampingRatio;
            config.twistSpringDamper.useSymplecticEuler = this.swingSpringDamper.useSymplecticEuler;
            config.twistLimitMotor.lowerLimit = this.twistLimitMotor.lowerLimit;
            config.twistLimitMotor.upperLimit = this.twistLimitMotor.upperLimit;
            config.twistLimitMotor.motorSpeed = this.twistLimitMotor.motorSpeed;
            config.twistLimitMotor.motorTorque = this.twistLimitMotor.motorTorque;

            const joint = new OIMO.RagdollJoint(config);
            this.twistSpringDamper._oimoSpringDamper = joint.getTwistSpringDamper();
            this.swingSpringDamper._oimoSpringDamper = joint.getSwingSpringDamper();
            this.twistLimitMotor._oimoRotationalLimitMotor = joint.getTwistLimitMotor();
            joint.userData = this;

            return joint;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get maxSwingAngleX(): number {
            return this._values[ValueType.MaxSwingAngleX];
        }
        public set maxSwingAngleX(value: number) {
            if (!this._oimoJoint) {
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
        public get maxSwingAngleZ(): number {
            return this._values[ValueType.MaxSwingAngleZ];
        }
        public set maxSwingAngleZ(value: number) {
            if (!this._oimoJoint) {
                this._values[ValueType.MaxSwingAngleZ] = value;
            }
            else if (DEBUG) {
                console.warn("Cannot change the maxSwingAngleZ after the joint has been created.");
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get twistAxis(): Readonly<Vector3> {
            return this._twistAxis;
        }
        public set twistAxis(value: Readonly<Vector3>) {
            if (!this._oimoJoint) {
                this._twistAxis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get swingAxis(): Readonly<Vector3> {
            return this._swingAxis;
        }
        public set swingAxis(value: Readonly<Vector3>) {
            if (!this._oimoJoint) {
                this._swingAxis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
        }
    }
}
