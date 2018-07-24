namespace egret3d.oimo {
    /**
     * 
     */
    export const enum RigidbodyType {
        DYNAMIC = 0, // OIMO.RigidBodyType.DYNAMIC
        STATIC = 1, // OIMO.RigidBodyType.STATIC
        KINEMATIC = 2, // OIMO.RigidBodyType.KINEMATIC
    }
    OIMO.RigidBodyType.STATIC
    const enum ValueType {
        Type,
        Mass,
        GravityScale,
        LinearDamping,
        AngularDamping,
    }
    /**
     * 
     */
    @paper.disallowMultipleComponent
    export class Rigidbody extends paper.BaseComponent {
        private static readonly _config: OIMO.RigidBodyConfig = new OIMO.RigidBodyConfig();
        private static readonly _massData: OIMO.MassData = new OIMO.MassData();

        private readonly _linearVelocity: Vector3 = Vector3.ZERO.clone();
        private readonly _angularVelocity: Vector3 = Vector3.ZERO.clone();
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        @paper.serializedField
        private readonly _values: Float32Array = new Float32Array([
            RigidbodyType.DYNAMIC, 1.0, 1.0, 0.0, 0.0,
        ]);
        private _oimoRigidbody: OIMO.RigidBody = null as any;

        protected _createRigidbody() {
            const config = Rigidbody._config;
            config.type = this.type;
            config.linearDamping = this.linearDamping;
            config.angularDamping = this.angularDamping;
            config.linearVelocity = this._linearVelocity as any; // 
            config.angularVelocity = this._angularVelocity as any; // 
            const rigidbody = new OIMO.RigidBody(config);
            const position = this.gameObject.transform.getPosition();
            const quaternion = this.gameObject.transform.getRotation();
            const oimoTransform = PhysicsSystem._helpTransform;
            oimoTransform.setPosition(position as any);
            oimoTransform.setOrientation(quaternion as any);
            rigidbody.setTransform(oimoTransform);
            rigidbody.userData = this;
            // this._updateMass(rigidbody); // TODO update mesh and type.
            rigidbody.setGravityScale(this.gravityScale);

            return rigidbody;
        }
        /**
         * @internal
         */
        public _updateMass(rigidbody: OIMO.RigidBody) {
            const massData = Rigidbody._massData;
            rigidbody.getMassDataTo(massData); // Copy mass data from rigibody.
            massData.mass = this._values[ValueType.Mass]; // Update mass.
            rigidbody.setMassData(massData); // Set mass data to rigibody.
        }

        private _addShapes() {
            for (const shape of this.gameObject.getComponents(Collider as any, true) as Collider[]) {
                this.oimoRigidbody.addShape(shape.oimoShape);
                // rigidbody._updateMass(rigidbody.oimoRigidbody);
            }

            // 子物体的transform？ TODO
        }
        /**
         * 
         */
        public wakeUp() {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.wakeUp();
            }
        }
        /**
         * 
         */
        public sleep() {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.sleep();
            }
        }
        /**
         * 
         */
        public applyForce(force: Readonly<IVector3>, positionInWorld: Readonly<IVector3>) {
            if (!this._oimoRigidbody && this.oimoRigidbody.getNumShapes() === 0) {
                this._addShapes();
            }

            if (this._oimoRigidbody.getNumShapes() === 0) {
                console.warn("Can not add force to an empty rigidbody.");
                return;
            }

            this.oimoRigidbody.applyForce(force as any, positionInWorld as any);
        }
        /**
         * 
         */
        public applyForceToCenter(force: Readonly<IVector3>) {
            if (!this._oimoRigidbody && this.oimoRigidbody.getNumShapes() === 0) {
                this._addShapes();
            }

            if (this._oimoRigidbody.getNumShapes() === 0) {
                console.warn("Can not add force to an empty rigidbody.");
                return;
            }

            this.oimoRigidbody.applyForceToCenter(force as any);
        }
        /**
         * 
         */
        public applyImpulse(impulse: Readonly<IVector3>, position: Readonly<IVector3>) {
            if (!this._oimoRigidbody && this.oimoRigidbody.getNumShapes() === 0) {
                this._addShapes();
            }

            if (this._oimoRigidbody.getNumShapes() === 0) {
                console.warn("Can not add impulse to an empty rigidbody.");
                return;
            }

            this.oimoRigidbody.applyImpulse(impulse as any, position as any);
        }
        /**
         * 
         */
        public applyTorque(torque: Readonly<IVector3>) {
            if (!this._oimoRigidbody && this.oimoRigidbody.getNumShapes() === 0) {
                this._addShapes();
            }

            if (this._oimoRigidbody.getNumShapes() === 0) {
                console.warn("Can not add torque to an empty rigidbody.");
                return;
            }

            this.oimoRigidbody.applyTorque(torque as any);
        }
        /**
         * 
         */
        public get isSleeping() {
            if (this._oimoRigidbody) {
                return this._oimoRigidbody.isSleeping();
            }

            return false;
        }
        /**
         * 
         */
        public get type() {
            return this._values[ValueType.Type];
        }
        public set type(value: number) {
            if (this._values[ValueType.Type] === value) {
                return;
            }

            this._values[ValueType.Type] = value;

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setType(value);
            }
        }
        /**
         * 
         */
        public get mass() {
            return this._values[ValueType.Mass];
        }
        public set mass(value: number) {
            if (value <= 0.0) {
                value = 0.01;
            }

            if (this._values[ValueType.Mass] === value) {
                return;
            }

            this._values[ValueType.Mass] = value;

            if (this._oimoRigidbody) {
                this._updateMass(this._oimoRigidbody);
            }
        }
        /**
         * 
         */
        public get gravityScale() {
            return this._values[ValueType.GravityScale];
        }
        public set gravityScale(value: number) {
            if (this._values[ValueType.GravityScale] === value) {
                return;
            }

            this._values[ValueType.GravityScale] = value;

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setGravityScale(value);
            }
        }
        /**
         * 
         */
        public get linearDamping() {
            return this._values[ValueType.LinearDamping];
        }
        public set linearDamping(value: number) {
            if (this._values[ValueType.LinearDamping] === value) {
                return;
            }

            this._values[ValueType.LinearDamping] = value;

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setLinearDamping(value);
            }
        }
        /**
         * 
         */
        public get angularDamping() {
            return this._values[ValueType.AngularDamping];
        }
        public set angularDamping(value: number) {
            if (this._values[ValueType.AngularDamping] === value) {
                return;
            }

            this._values[ValueType.AngularDamping] = value;

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setAngularDamping(value);
            }
        }
        /**
         * 
         */
        public get linearVelocity() {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.getLinearVelocityTo(this._linearVelocity as any); //
            }

            return this._linearVelocity;
        }
        public set linearVelocity(value: Readonly<IVector3>) {
            this._linearVelocity.copy(value);

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setLinearVelocity(this._linearVelocity as any); //
            }
        }
        /**
         * 
         */
        public get angularVelocity() {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.getAngularVelocityTo(this._angularVelocity as any); //
            }

            return this._angularVelocity;
        }
        public set angularVelocity(value: Readonly<IVector3>) {
            this._angularVelocity.copy(value);

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setAngularVelocity(this._angularVelocity as any); //
            }
        }
        /**
         * 
         */
        public get oimoRigidbody() {
            if (!this._oimoRigidbody) {
                this._oimoRigidbody = this._createRigidbody();
            }

            return this._oimoRigidbody;
        }
    }
}