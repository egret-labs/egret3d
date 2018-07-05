namespace egret3d.oimo {
    @paper.requireComponent(Rigidbody)
    export class HingeJoint extends Joint {
        private static readonly _config: OIMO.RevoluteJointConfig = new OIMO.RevoluteJointConfig();

        //TODO: spring damper value not supported
        protected _springDamper: OIMO.SpringDamper;
        protected _rotateLimit: OIMO.RotationalLimitMotor;

        protected _worldAnchor: Vector3;
        protected _worldAxis: Vector3;

        constructor() {
            super();
            this._config = new OIMO.RevoluteJointConfig();
        }

        protected _createJoint(): OIMO.RevoluteJoint {
            this._rb1 = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            let worldAnchor = PhysicsSystem.toOIMOVec3_A(this.worldAnchor);
            let worldAxis = PhysicsSystem.toOIMOVec3_B(this.worldAxis);

            this._config.init(this.thisRigidbody.oimoRB, this.connectedRigidbody.oimoRB, worldAnchor, worldAxis);

            //other settings
            if (this._springDamper != null)
                this._config.springDamper = this._springDamper;
            if (this._rotateLimit != null)
                this._config.limitMotor = this._rotateLimit;
            return new OIMO.RevoluteJoint(this._config);
        }

        //#region setter and getter
        //AXIS
        public get worldAxis() {
            if (!this._worldAxis) {//auto calc axis
                this._worldAxis = Vector3.UP.clone();
            }
            return this._worldAxis;
        }
        public set worldAxis(value: Vector3) {
            if (this.jointNotConstructed) {
                this._worldAxis = value;
            }
        }

        //LOWER LIMIT
        public get lowerLimitDegree() {
            return this.rotateLimit.lowerLimit * egret3d.RAD_DEG;
        }
        public set lowerLimitDegree(value: number) {
            this.rotateLimit.lowerLimit = value * egret3d.DEG_RAD;
        }

        //UPPER LIMIT
        public get upperLimitDegree() {
            return this.rotateLimit.upperLimit * egret3d.RAD_DEG;
        }
        public set upperLimitDegree(value: number) {
            this.rotateLimit.upperLimit = value * egret3d.DEG_RAD;
        }

        protected get rotateLimit() {
            if (!this._rotateLimit)
                this._rotateLimit = new OIMO.RotationalLimitMotor();
            return this._rotateLimit;
        }
        protected get springDamper() {
            if (!this._springDamper)
                this._springDamper = new OIMO.SpringDamper();
            return this._springDamper;
        }
        //#endregion
    }
}