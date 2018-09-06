namespace egret3d.oimo {
    const enum ValueType {
        // SpringDamper
        Frequency,
        DampingRatio,
        UseSymplecticEuler,
    }
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class SphericalJoint extends Joint<OIMO.SphericalJoint> {
        private static readonly _config: OIMO.SphericalJointConfig = new OIMO.SphericalJointConfig();
        private static readonly _springDamper: OIMO.SpringDamper = new OIMO.SpringDamper();

        public readonly jointType: JointType = JointType.Spherical;

        @paper.serializedField
        private readonly _valuesB: Float32Array = new Float32Array([
            0.0, 0.0, 0,
        ]);

        protected _createJoint() {
            if (!this._connectedBody) {
                // TODO
                throw new Error();
            }

            this._rigidbody = this.gameObject.getComponent(Rigidbody) as Rigidbody;

            const config = SphericalJoint._config;
            config.allowCollision = this.collisionEnabled;

            if (this.useGlobalAnchor) {
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    this._anchor as any,
                );
            }
            else {
                const matrix = this.gameObject.transform.getWorldMatrix();
                const anchor = matrix.transformVector3(helpVector3A.copy(this._anchor));
                config.init(
                    this._rigidbody.oimoRigidbody, this._connectedBody.oimoRigidbody,
                    anchor as any,
                );
            }

            config.springDamper = SphericalJoint._springDamper;
            config.springDamper.frequency = this.frequency;
            config.springDamper.dampingRatio = this.dampingRatio;
            config.springDamper.useSymplecticEuler = this.useSymplecticEuler;

            const joint = new OIMO.SphericalJoint(config);
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
                const springDamper = (this._oimoJoint as OIMO.SphericalJoint).getSpringDamper();
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
                const springDamper = (this._oimoJoint as OIMO.SphericalJoint).getSpringDamper();
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
                const springDamper = (this._oimoJoint as OIMO.SphericalJoint).getSpringDamper();
                springDamper.useSymplecticEuler = value;
            }
        }
    }
}