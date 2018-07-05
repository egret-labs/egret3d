namespace egret3d.oimo {
    /**
     * 
     */
    export enum RigidbodyType {
        /**
         * Represents a dynamic rigid body. A dynamic rigid body has finite mass (and usually inertia
         * tensor). The rigid body is affected by gravity, or by constraints the rigid body is involved.
         */
        DYNAMIC = OIMO.RigidBodyType.DYNAMIC,

        /**
         * Represents a static rigid body. A static rigid body has zero velocities and infinite mass
         * and inertia tensor. The rigid body is not affected by any force or impulse, such as gravity,
         * constraints, or external forces or impulses added by an user.
         */
        STATIC = OIMO.RigidBodyType.STATIC,

        /**
         * Represents a kinematic rigid body. A kinematic rigid body is similar to a static one, except
         * that it can have non-zero linear and angular velocities. This is useful for overlapping rigid
         * bodies to pre-computed motions.
         */
        KINEMATIC = OIMO.RigidBodyType.KINEMATIC,
    }

    const enum ValueType {
        Type,
        Mass,
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
            RigidbodyType.DYNAMIC, 1.0, 0.0, 0.0,
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
            this._updateMass(rigidbody);

            return rigidbody;
        }
        /**
         * @internal
         */
        public _updateMass(rigidbody: OIMO.RigidBody) {
            rigidbody.getMassDataTo(Rigidbody._massData); // Copy mass data from rigibody.
            Rigidbody._massData.mass = this._values[ValueType.Mass]; // Update mass.
            rigidbody.setMassData(Rigidbody._massData); // Set mass data to rigibody.
        }
        /**
         * 
         */
        public applyForce(force: Readonly<Vector3>, positionInWorld: Readonly<Vector3>) {
            this.oimoRB.applyForce(PhysicsSystem.toOIMOVec3_A(force), PhysicsSystem.toOIMOVec3_B(positionInWorld));
        }
        /**
         * 
         */
        public applyForceToCenter(force: Readonly<Vector3>) {
            this.oimoRB.applyForceToCenter(PhysicsSystem.toOIMOVec3_A(force));
        }
        /**
         * 
         */
        public applyImpulse(impulse: Readonly<Vector3>, position: Readonly<Vector3>) {
            this.oimoRB.applyImpulse(PhysicsSystem.toOIMOVec3_A(impulse), PhysicsSystem.toOIMOVec3_B(position));
        }
        /**
         * 不用传入作用位置 
         */
        public applyTorque(torque: Readonly<Vector3>) {
            this.oimoRB.applyTorque(PhysicsSystem.toOIMOVec3_A(torque));
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
                this._values[ValueType.Mass] = this._oimoRigidbody.getMass();
            }
        }
        /**
         * 
         */
        public get mass() {
            return this._values[ValueType.Mass];
        }
        public set mass(value: number) {
            if (this._values[ValueType.Mass] === value) {
                return;
            }

            this._values[ValueType.Mass] = value;

            if (this._oimoRigidbody) {
                this._updateMass(this._oimoRigidbody);
            }

            // TODO update type.
            if (this._values[ValueType.Mass] > 0.0) {

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
        public set linearVelocity(value: Readonly<Vector3>) {
            if (this.type === RigidbodyType.STATIC) {
                console.warn(`Can not the linear velocity of a static rigibody (${this.gameObject.path}).`);
                return;
            }

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
        public set angularVelocity(value: Readonly<Vector3>) {
            if (this.type === RigidbodyType.STATIC) {
                console.warn(`Can not the angular velocity of a static rigibody (${this.gameObject.path}).`);
                return;
            }

            this._angularVelocity.copy(value);

            if (this._oimoRigidbody) {
                this._oimoRigidbody.setAngularVelocity(this._angularVelocity as any); //
            }
        }
        /**
         * 
         */
        public get oimoRB() {
            if (!this._oimoRigidbody) {
                this._oimoRigidbody = this._createRigidbody();
            }

            return this._oimoRigidbody;
        }
    }
}