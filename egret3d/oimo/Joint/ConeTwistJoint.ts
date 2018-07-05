namespace egret3d.oimo {
    export class ConeTwistJoint extends Joint {
        //TODO: spring damper value not supported
        protected _oimoJoint: OIMO.RevoluteJoint = null;
        protected _config: OIMO.RagdollJointConfig;

        protected _worldAnchor: Vector3;
        protected _worldSwingAxis: Vector3;
        protected _worldTwistAxis: Vector3;

        protected _swingSd: OIMO.SpringDamper;
        protected _twistSd: OIMO.SpringDamper;
        protected _twistLm: OIMO.RotationalLimitMotor;

        constructor() {
            super();
            this._config = new OIMO.RagdollJointConfig();
        }

        //#region getter and setter
        //SWING
        public get worldSwingAxis() {
            if (!this._worldSwingAxis) {//TODO: auto calc swing axis
                this._worldSwingAxis = Vector3.RIGHT.clone();
            }
            return this._worldSwingAxis;
        }
        public set worldSwingAxis(value: Vector3) {
            if (this.jointNotConstructed) {
                //can't change? needs testing
                this._worldSwingAxis = value;
            }
        }
        public get maxSwing1Deg() {
            return this._config.maxSwingAngle1 * egret3d.RAD_DEG;
        }
        public set maxSwing1Deg(value: number) {
            //TODO:增加验证修改
            this._config.maxSwingAngle1 = value * egret3d.DEG_RAD;
        }
        public get maxSwing2Deg() {
            return this._config.maxSwingAngle2 * egret3d.RAD_DEG;
        }
        public set maxSwing2Deg(value: number) {
            //TODO:增加验证修改
            this._config.maxSwingAngle2 = value * egret3d.DEG_RAD;
        }

        //TWIST
        public get worldTwistAxis() {
            if (!this._worldTwistAxis) {//TODO: auto calc swing axis
                this._worldTwistAxis = Vector3.UP.clone();
            }
            return this._worldTwistAxis;
        }
        public set worldTwistAxis(value: Vector3) {
            if (this.jointNotConstructed) {
                this._worldTwistAxis = value;
            }
        }
        public get minTwistDegree() {
            return this.twistLimit.lowerLimit * egret3d.RAD_DEG;
        }
        public set minTwistDegree(value: number) {
            if (this.jointNotConstructed) {
                this.twistLimit.lowerLimit = value * egret3d.DEG_RAD;
            }
        }
        public get maxTwistDegree() {
            return this.twistLimit.upperLimit * egret3d.RAD_DEG;
        }
        public set maxTwistDegree(value: number) {
            if (this.jointNotConstructed) {
                this.twistLimit.upperLimit = value * egret3d.DEG_RAD;
            }
        }


        protected get twistLimit() {
            if (!this._twistLm)
                this._twistLm = new OIMO.RotationalLimitMotor();
            return this._twistLm;
        }
        protected get swingSd() {
            if (!this._swingSd)
                this._swingSd = new OIMO.SpringDamper();
            return this._swingSd;
        }
        protected get twistSd() {
            if (!this._twistSd)
                this._twistSd = new OIMO.SpringDamper();
            return this._twistSd;
        }
        //#endregion

        protected _createJoint(): OIMO.RagdollJoint {
            let worldAnchor = PhysicsSystem.toOIMOVec3_A(this.worldAnchor);
            let worldSwingAxis = PhysicsSystem.toOIMOVec3_B(this.worldSwingAxis);
            let worldTwistAxis = PhysicsSystem.toOIMOVec3_C(this.worldTwistAxis);

            this._config.init(this.thisRigidbody.oimoRB, this.connectedRigidbody.oimoRB,
                worldAnchor, worldTwistAxis, worldSwingAxis);

            //other settings
            if (this._swingSd != null) this._config.swingSpringDamper = this._swingSd;
            if (this._twistLm != null) this._config.twistLimitMotor = this._twistLm;
            if (this._twistSd != null) this._config.twistSpringDamper = this._twistSd;
            return new OIMO.RagdollJoint(this._config);
        }


    }
}