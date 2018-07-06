namespace egret3d.oimo {
    export class Rigidbody extends paper.BaseComponent {

        private _oimoRigidbody: OIMO.RigidBody = null;
        private _config: OIMO.RigidBodyConfig = null;

        private _mass: number;
        //施加作用需要先创建刚体，有些赋值操作也需要创建刚体，但为了方便开发者，将一些赋值操作的实施延后，先在此存储
        private _initValue = {
            "shapeList": []
        };

        private readonly _helpVector3 = new Vector3();
        private readonly _helpVec3 = new OIMO.Vec3();

        constructor() {
            super();
            this._config = new OIMO.RigidBodyConfig();
        }

        /**
         * Sets the massof the rigid body
         * The properties set by this will be overwritten when
         *
         * - some shapes are added or removed
         * - the type of the rigid body is changed
         */
        public set mass(value: number) {
            this._mass = value;
            if (this._oimoRigidbody)
                this._setMass(value);
        }
        public get mass() {
            return this.oimoRB.getMass();
        }
        //#region 延后传入参数
        //set操作的是this._oimoRigidbody，get操作的是this.oimoRB（因为get通常在初始化以外的时候使用）

        /**传入含有几何信息的shape config */
        addCollisionShape(shape: CollisionShape) {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.addShape(shape.oimoShape);
                this._setMass(this._mass);
                return;
            }
            this._initValue.shapeList.push(shape.oimoShape);
        }

        public set type(value: number) {
            if (this._oimoRigidbody) {
                this._oimoRigidbody.setType(value);
                return;
            }
            this._config.type = value;
        }
        public get type() {
            return this.oimoRB.getType();
        }

        public set linearVelocity(value: Vector3) {
            let v = PhysicsSystem.toOIMOVec3_A(value);
            if (this._oimoRigidbody) {
                this._oimoRigidbody.setLinearVelocity(v);
                return;
            }
            this._config.linearVelocity = v;
        }
        public get linearVelocity() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this.oimoRB.getLinearVelocity(), r);
        }
        //#endregion

        public applyForce(force: Vector3, positionInWorld: Vector3) {
            this.oimoRB.applyForce(this.toOIMOVec3(force), this.toOIMOVec3(positionInWorld));
        }

        public applyForceToCenter(force: Vector3) {
            this.oimoRB.applyForceToCenter(this.toOIMOVec3(force));
        }

        public applyImpulse(impulse: Vector3, position: Vector3) {
            this.oimoRB.applyImpulse(PhysicsSystem.toOIMOVec3_A(impulse), PhysicsSystem.toOIMOVec3_B(position));
        }

        public applyTorque(torque: Vector3) {
            this.oimoRB.applyTorque(this.toOIMOVec3(torque));
        }

        public set linearDamping(value: number) {
            if (!this._oimoRigidbody) {
                this._config.linearDamping = value;
                return;
            }
            this._oimoRigidbody.setLinearDamping(value);
        }
        public get linearDamping() {
            return this.oimoRB.getLinearDamping();
        }

        public wakeup(){
            this.oimoRB.wakeUp();
        }

        toOIMOVec3(value: Vector3) {
            let result = this._helpVec3;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }

        public create(config?: any) {
            if (!config) {
                this._oimoRigidbody = new OIMO.RigidBody(this._config);
            }
            for (let shape of this._initValue.shapeList) {
                this._oimoRigidbody.addShape(shape);
            }
            if (this._mass != undefined)
                this._setMass(this._mass);
            //TODO: 如何销毁对象？
            this._initValue = null;
        }

        protected hasShapeVerification() {
            if (this._oimoRigidbody.getNumShapes() == 0) {
                console.log("no shape attached to rigidbody, did you forget it?");
            }
        }

        public get oimoRB() {
            if (!this._oimoRigidbody) {
                console.log("Rigidbody is automatically constructed with own settings. Use .create(config?) to build shape manually");
                this.create();
            }
            return this._oimoRigidbody;
        }

        private _setMass(value) {
            let md = this._oimoRigidbody.getMassData();
            md.mass = value;
            this._oimoRigidbody.setMassData(md);
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