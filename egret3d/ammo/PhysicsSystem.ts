namespace egret3d.ammo {
    /**
     * 
     */
    export class PhysicsSystem extends paper.BaseSystem<CollisionShape | CollisionObject> {
        private static _helpVector3A: Ammo.btVector3 | null = null;
        private static _helpVector3B: Ammo.btVector3 | null = null;
        private static _helpVector3C: Ammo.btVector3 | null = null;
        private static _helpVector3D: Ammo.btVector3 | null = null;
        private static _helpQuaternionA: Ammo.btQuaternion | null = null;
        private static _helpMatrix3x3: Ammo.btMatrix3x3 | null = null;
        private static _helpTransformA: Ammo.btTransform | null = null;
        private static _helpTransformB: Ammo.btTransform | null = null;
        /**
         * @internal
         */
        public static get helpVector3A(): Ammo.btVector3 {
            if (!this._helpVector3A) {
                this._helpVector3A = new Ammo.btVector3();
            }

            return this._helpVector3A;
        }
        /**
         * @internal
         */
        public static get helpVector3B(): Ammo.btVector3 {
            if (!this._helpVector3B) {
                this._helpVector3B = new Ammo.btVector3();
            }

            return this._helpVector3B;
        }
        /**
         * @internal
         */
        public static get helpVector3C(): Ammo.btVector3 {
            if (!this._helpVector3C) {
                this._helpVector3C = new Ammo.btVector3();
            }

            return this._helpVector3C;
        }
        /**
         * @internal
         */
        public static get helpVector3D(): Ammo.btVector3 {
            if (!this._helpVector3D) {
                this._helpVector3D = new Ammo.btVector3();
            }

            return this._helpVector3D;
        }
        /**
         * @internal
         */
        public static get helpQuaternionA(): Ammo.btQuaternion {
            if (!this._helpQuaternionA) {
                this._helpQuaternionA = new Ammo.btQuaternion();
            }

            return this._helpQuaternionA;
        }
        /**
         * @internal
         */
        public static get helpMatrix3x3(): Ammo.btMatrix3x3 {
            if (!this._helpMatrix3x3) {
                this._helpMatrix3x3 = new Ammo.btMatrix3x3();
            }

            return this._helpMatrix3x3;
        }
        /**
         * @internal
         */
        public static get helpTransformA(): Ammo.btTransform {
            if (!this._helpTransformA) {
                this._helpTransformA = new Ammo.btTransform();
            }

            return this._helpTransformA;
        }
        /**
         * @internal
         */
        public static get helpTransformB(): Ammo.btTransform {
            if (!this._helpTransformB) {
                this._helpTransformB = new Ammo.btTransform();
            }

            return this._helpTransformB;
        }

        protected readonly _interests = [
            {
                componentClass: [BoxShape, CapsuleShape, ConeShape, ConvexHullShape, CylinderShape, HeightfieldTerrainShape, SphereShape]
            },
            {
                componentClass: [CollisionObject, Rigidbody]
            },
        ];

        private _worldType: Ammo.WorldType = Ammo.WorldType.RigidBodyDynamics; // TODO
        private _collisionType: Ammo.CollisionConfType = Ammo.CollisionConfType.DefaultDynamicsWorldCollisionConf; // TODO
        private _broadphaseType: Ammo.BroadphaseType = Ammo.BroadphaseType.DynamicAABBBroadphase; // TODO
        private readonly _axis3SweepBroadphaseMin: Vector3 = new Vector3(-1000.0, -1000.0, -1000.0); // TODO
        private readonly _axis3SweepBroadphaseMax: Vector3 = new Vector3(1000.0, 1000.0, 1000.0); // TODO
        private readonly _gravity: Vector3 = new Vector3(0.0, -9.8, 0.0);
        private _btCollisionWorld: Ammo.btCollisionWorld = null as any;
        private _btDynamicsWorld: Ammo.btDynamicsWorld | null = null;

        protected _onAddComponent(component: CollisionShape | CollisionObject) {
            if (!super._onAddComponent(component)) {
                return false;
            }

            const collisionObject = this._getComponent(component.gameObject, 1) as CollisionObject;
            const collisionShape = this._getComponent(component.gameObject, 0) as CollisionShape;
            const btCollisionObject = collisionObject.btCollisionObject;
            const btCollisionShape = collisionShape.btCollisionShape;

            btCollisionShape.setMargin(0.05); // TODO
            btCollisionObject.setCollisionShape(btCollisionShape);

            switch (this._worldType) {
                case Ammo.WorldType.CollisionOnly:
                    this._btCollisionWorld.addCollisionObject(btCollisionObject, collisionObject.collisionGroups, collisionObject.collisionMask);
                    break;

                case Ammo.WorldType.RigidBodyDynamics:
                    if (this._btDynamicsWorld) {
                        if (collisionObject instanceof Rigidbody) {
                            collisionObject._updateMass();
                            this._btDynamicsWorld.addRigidBody(collisionObject.btRigidbody, collisionObject.collisionGroups, collisionObject.collisionMask);
                        }
                        else {
                            this._btCollisionWorld.addCollisionObject(btCollisionObject, collisionObject.collisionGroups, collisionObject.collisionMask);
                        }
                    }
                    else {
                        throw new Error("Arguments error.");
                    }
                    break;

                case Ammo.WorldType.MultiBodyWorld:
                    // TODO
                    break;

                case Ammo.WorldType.SoftBodyAndRigidBody:
                    // TODO
                    break;
            }

            return true;
        }

        protected _onRemoveComponent(component: CollisionShape | CollisionObject) {
            if (!super._onRemoveComponent(component)) {
                return false;
            }

            const collisionObject = this._getComponent(component.gameObject, 1) as CollisionObject;
            this._btCollisionWorld.removeCollisionObject(collisionObject.btCollisionObject);

            return true;
        }

        protected _updateGravity() {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._gravity.x, this._gravity.y, this._gravity.z);
            (this._btDynamicsWorld as Ammo.btDynamicsWorld).setGravity(btVector3);
        }

        public initialize() {
            super.initialize();

            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const broadphase = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();
            this._btCollisionWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
            // 
            this._btDynamicsWorld = this._btCollisionWorld as any;

            if (this._btDynamicsWorld) {
                this._updateGravity();
            }
        }

        public update() {
            if (this._btDynamicsWorld) {
                const helpTransformA = PhysicsSystem.helpTransformA;
                this._btDynamicsWorld.stepSimulation(paper.Time.deltaTime, paper.Time.maxFixedSubSteps, paper.Time.fixedTimeStep);

                for (let i = 0, l = this._components.length; i < l; i += this._interestComponentCount) {
                    const collisionObject = this._components[i + 1] as CollisionObject;
                    if (collisionObject instanceof Rigidbody && collisionObject.btCollisionObject) {
                        const motionState = (collisionObject.btCollisionObject as Ammo.btRigidBody).getMotionState();
                        if (motionState) {
                            const transform = collisionObject.gameObject.transform;
                            motionState.getWorldTransform(helpTransformA);
                            const t = helpTransformA.getOrigin();
                            const r = helpTransformA.getRotation();

                            transform.setPosition(t.x(), t.y(), t.z());
                            transform.setRotation(r.x(), r.y(), r.z(), r.w());
                        }
                    }
                }
            }
        }
        /**
         * 
         */
        public get gravity(): Readonly<Vector3> {
            return this._gravity;
        }
        public set gravity(value: Readonly<Vector3>) {
            this._gravity.copy(value);

            if (this._btDynamicsWorld) {
                this._updateGravity();
            }
        }

        public get btCollisionWorld() {
            return this._btCollisionWorld;
        }

        public get btDynamicsWorld() {
            return this._btDynamicsWorld;
        }
    }
}
