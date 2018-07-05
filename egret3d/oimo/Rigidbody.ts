namespace egret3d.oimo {
    export class Rigidbody extends paper.BaseComponent {

        private _oimoRigidbody: OIMO.RigidBody = null;
        private _config: OIMO.RigidBodyConfig = null;
        private _massData: OIMO.MassData = null;
        private _type: number = RigidbodyType.DYNAMIC;

        private readonly _helpVector3 = new Vector3();
        private readonly _helpVec3 = new OIMO.Vec3();

        constructor() {
            super();
            this._config = new OIMO.RigidBodyConfig();
            this._massData = new OIMO.MassData();
            //this._shapeConfig = new OIMO.ShapeConfig();
        }

        /**传入含有几何信息的shape config */
        setCollisionShape(geom: OIMO.Geometry) {
            console.log("TODO");
            //this._shapeConfig.geometry = geom;
        }

        public set type(value: number) {
            this._type = value;
        }

        public get type() {
            return this._type;
        }

        public get oimoRB() {
            if (!this._oimoRigidbody) {
                this._createRigidbody();
            }
            return this._oimoRigidbody;
        }

        public applyForce(force: Vector3, positionInWorld: Vector3) {
            this.oimoRB.applyForce(this.toOIMOVec3(force), this.toOIMOVec3(positionInWorld));
        }

        public applyForceToCenter(force: Vector3) {
            this.oimoRB.applyForceToCenter(this.toOIMOVec3(force));
        }

        public applyImpulse(impulse: Vector3, position: Vector3) {
            this.oimoRB.applyImpulse(PhysicsSystem.toOIMOVec3_A(impulse), PhysicsSystem.toOIMOVec3_B(position));
        }

        /**不用传入作用位置 */
        public applyTorque(torque: Vector3) {
            this.oimoRB.applyTorque(this.toOIMOVec3(torque));
        }

        public set linearVelocity(value: Vector3) {
            this.oimoRB.setLinearVelocity(PhysicsSystem.toOIMOVec3_A(value));
        }

        public get linearVelocity() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this.oimoRB.getLinearVelocity(), r);
        }

        public set linearDamping(value:number){
            this.oimoRB.setLinearDamping(value);
        }
        public get linearDamping(){
            return this.oimoRB.getLinearDamping();
        }

        toOIMOVec3(value: Vector3) {
            let result = this._helpVec3;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }
        /**
         * Sets the massof the rigid body
         * The properties set by this will be overwritten when
         *
         * - some shapes are added or removed
         * - the type of the rigid body is changed
         */
        public set mass(value: number) {
            this._massData.mass = value;
        }

        public get mass(){
            return this.oimoRB.getMass();
        }

        protected _createRigidbody() {
            this._oimoRigidbody = new OIMO.RigidBody(this._config);
            this._oimoRigidbody.setMassData(this._massData);
            this._oimoRigidbody.setType(this._type);
        }
    }

    export class RigidbodyType {
        /**
         * Represents a dynamic rigid body. A dynamic rigid body has finite mass (and usually inertia
         * tensor). The rigid body is affected by gravity, or by constraints the rigid body is involved.
         */
        static DYNAMIC: number = 0;

        /**
         * Represents a static rigid body. A static rigid body has zero velocities and infinite mass
         * and inertia tensor. The rigid body is not affected by any force or impulse, such as gravity,
         * constraints, or external forces or impulses added by an user.
         */
        static STATIC: number = 1;

        /**
         * Represents a kinematic rigid body. A kinematic rigid body is similar to a static one, except
         * that it can have non-zero linear and angular velocities. This is useful for overlapping rigid
         * bodies to pre-computed motions.
         */
        static KINEMATIC: number = 2;
    }
}