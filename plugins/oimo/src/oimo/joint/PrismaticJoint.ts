namespace egret3d.oimo {
    /**
     * 移动关节组件。
     * - https://en.wikipedia.org/wiki/Prismatic_joint
     */
    @paper.requireComponent(Rigidbody)
    @paper.allowMultiple
    export class PrismaticJoint extends BaseJoint<OIMO.PrismaticJoint> {
        private static readonly _config: OIMO.PrismaticJointConfig = new OIMO.PrismaticJointConfig();
        private static readonly _springDamper: OIMO.SpringDamper = new OIMO.SpringDamper();
        private static readonly _translationalLimitMotor: OIMO.TranslationalLimitMotor = new OIMO.TranslationalLimitMotor();

        public readonly jointType: JointType = JointType.Prismatic;
        /**
         * 该关节的移动弹簧缓冲器设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly springDamper: SpringDamper = SpringDamper.create();
        /**
         * 该关节的移动马达设置。
         */
        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly limitMotor: TranslationalLimitMotor = TranslationalLimitMotor.create();

        @paper.serializedField
        private readonly _axis: Vector3 = Vector3.create();

        protected readonly _values: Float32Array = new Float32Array(4);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            const config = PrismaticJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useWorldSpace) {
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any, this._axis as any
                );
            }
            else {
                const matrix = this.gameObject.transform.localToWorldMatrix;
                const anchor = Vector3.create().applyMatrix(matrix, this._anchor).release();
                const axis = Vector3.create().applyDirection(matrix, this._axis).release();
                config.init(
                    this._rigidbody!.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any, axis as any
                );
            }

            config.springDamper = PrismaticJoint._springDamper;
            config.limitMotor = PrismaticJoint._translationalLimitMotor;
            config.springDamper.frequency = this.springDamper.frequency;
            config.springDamper.dampingRatio = this.springDamper.dampingRatio;
            config.springDamper.useSymplecticEuler = this.springDamper.useSymplecticEuler;
            config.limitMotor.lowerLimit = this.limitMotor.lowerLimit;
            config.limitMotor.upperLimit = this.limitMotor.upperLimit;
            config.limitMotor.motorSpeed = this.limitMotor.motorSpeed;
            config.limitMotor.motorForce = this.limitMotor.motorForce;

            const joint = new OIMO.PrismaticJoint(config);
            this.springDamper._oimoSpringDamper = (joint as any).getSpringDamper();
            this.limitMotor._oimoLimitMotor = (joint as any).getLimitMotor();

            joint.userData = this;

            return joint;
        }

        public initialize() {
            super.initialize();

            this._axis.copy(Vector3.UP);
        }

        public uninitialize() {
            super.uninitialize();

            this.springDamper._clear();
            this.limitMotor._clear();
        }
        /**
         * 该关节的移动轴。
         */
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get axis(): Readonly<Vector3> {
            return this._axis;
        }
        public set axis(value: Readonly<Vector3>) {
            if (this._oimoJoint === null) {
                this._axis.normalize(value);
            }
            else if (DEBUG) {
                console.warn("Cannot change the axis after the joint has been created.");
            }
        }
    }
}
