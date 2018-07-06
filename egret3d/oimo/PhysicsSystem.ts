namespace egret3d.oimo {
    export class PhysicsSystem extends paper.BaseSystem<Rigidbody | CollisionShape>{
        private static _helpVec3A: OIMO.Vec3 | null = null;
        private static _helpVec3B: OIMO.Vec3 | null = null;
        private static _helpVec3C: OIMO.Vec3 | null = null;
        private static _helpVector3: egret3d.Vector3 | null = null;
        private static _helpQuatA: OIMO.Quat | null = null;

        protected readonly _interests = [
            {
                componentClass: Rigidbody
            },
            {
                componentClass: [BoxCollisionShape as any, SphereCollisionShape]
            }
        ];

        private _oimoWorld: OIMO.World;
        private _gravity = new Vector3(0, -9.80665, 0);
        private readonly _joints: Joint[] = [];



        public onAwake() {
            super.onAwake();

            this._oimoWorld = new OIMO.World();
            this._oimoWorld.setGravity(PhysicsSystem.toOIMOVec3_A(this._gravity));
            //监听joint
            const jointClasses = [ConeTwistJoint, HingeJoint];
            for (const constraintClass of jointClasses) {
                paper.EventPool.addEventListener(paper.EventPool.EventType.Enabled, constraintClass as any, (component: Joint) => {
                    if (this._joints.indexOf(component) < 0) {
                        this._joints.push(component);
                    }
                });
                paper.EventPool.addEventListener(paper.EventPool.EventType.Disabled, constraintClass as any, (component: Joint) => {
                    component.removeFromWorld(this._oimoWorld);
                });
            }
        }

        public onUpdate() {
            //init joint
            if (this._joints.length > 0) {
                for (const joint of this._joints) {
                    joint.addToWorld(this._oimoWorld);
                }
                this._joints.length = 0;
            }

            //step simulation
            this._oimoWorld.step(paper.Time.deltaTime);

            //set obj transform
            let v3 = new Vector3();
            let quat = new Quaternion();
            for (let i = 0, length = this._components.length; i < length; i += this._interestComponentCount) {
                const rb = this._components[i + 0] as Rigidbody;
                let shapeList = rb.oimoRB.getShapeList();
                switch (rb.type) {
                    case RigidbodyType.DYNAMIC:
                        do {
                            //目前一个rb一个shape，所以只会执行一次
                            let egretTransform = rb.gameObject.transform;
                            let oimoTransform = shapeList.getTransform();

                            oimoTransform.getPositionTo(PhysicsSystem.helpVec3A);
                            egretTransform.setPosition(PhysicsSystem.toVector3(PhysicsSystem.helpVec3A, v3));

                            oimoTransform.getOrientationTo(PhysicsSystem.helpQuaternionA);
                            egretTransform.setRotation(PhysicsSystem.toQuat(PhysicsSystem.helpQuaternionA, quat));
                        } while (shapeList.getNext() != null);
                        break;
                        case RigidbodyType.KINEMATIC:
                        case RigidbodyType.STATIC://还不清楚具体区别，先放在一起
                        let egretTransform = rb.gameObject.transform;
                        let oimoTransform = shapeList.getTransform();

                        let pos=egretTransform.getPosition(),rot=egretTransform.getRotation();
                        shapeList.getRigidBody().setPosition(PhysicsSystem.toOIMOVec3_A(pos));
                        shapeList.getRigidBody().setOrientation(PhysicsSystem.toOIMOQuat_A(rot));
                        break;
                }
            }
        }

        public onAddGameObject(gameObject: paper.GameObject) {
            const collisionGeom = this._getComponent(gameObject, 1) as CollisionShape;
            const rigidbody = this._getComponent(gameObject, 0) as Rigidbody;

            this._oimoWorld.addRigidBody(rigidbody.oimoRB);

            //init transform
            let pos = gameObject.transform.getPosition();
            let rot = gameObject.transform.getRotation();
            let transform = rigidbody.oimoRB.getTransform();
            transform.setPosition(PhysicsSystem.toOIMOVec3_A(pos));
            transform.setOrientation(PhysicsSystem.toOIMOQuat_A(rot));
            rigidbody.oimoRB.setTransform(transform);
            //子物体的transform？

        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            const rigidbody = this._getComponent(gameObject, 0) as Rigidbody;
            this._oimoWorld.removeRigidBody(rigidbody.oimoRB);
        }

        //#region help vector
        /**
         * @internal
         */
        public static get helpVec3A(): OIMO.Vec3 {
            if (!this._helpVec3A) {
                this._helpVec3A = new OIMO.Vec3();
            }

            return this._helpVec3A;
        }

        /**
        * @internal
        */
        public static get helpVector3(): egret3d.Vector3 {
            if (!this._helpVector3) {
                this._helpVector3 = new egret3d.Vector3();
            }

            return this._helpVector3;
        }

        /**
         * @internal
         */
        public static get helpQuaternionA(): OIMO.Quat {
            if (!this._helpQuatA) {
                this._helpQuatA = new OIMO.Quat();
            }

            return this._helpQuatA;
        }

        /**
         * @internal
         */
        public static get helpVec3B(): OIMO.Vec3 {
            if (!this._helpVec3B) {
                this._helpVec3B = new OIMO.Vec3();
            }

            return this._helpVec3B;
        }

        /**
         * @internal
         */
        public static get helpVec3C(): OIMO.Vec3 {
            if (!this._helpVec3C) {
                this._helpVec3C = new OIMO.Vec3();
            }

            return this._helpVec3C;
        }

        /**
         * value stored in PhysicsSystem.helpVec3A
         */
        public static toOIMOVec3_A(value: Vector3) {
            let result = PhysicsSystem.helpVec3A;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }
        /**
         * @internal
         */
        public static toOIMOVec3_B(value: Vector3) {
            let result = PhysicsSystem.helpVec3B;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }
        /**
         * @internal
         */
        public static toOIMOVec3_C(value: Vector3) {
            let result = PhysicsSystem.helpVec3C;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }

        /**
         * @internal
         */
        public static toOIMOQuat_A(value: Quaternion) {
            let result = PhysicsSystem.helpQuaternionA;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            result.w = value.w;
            return result;
        }

        /**
         * @internal
         */
        public static toVector3(value: OIMO.Vec3, result: Vector3) {
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }

        /**
         * @internal
         */
        public static toQuat(value: OIMO.Quat, result: Quaternion) {
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            result.w = value.w;
            return result;
        }

        public get gravity() {
            return PhysicsSystem.toVector3(this._oimoWorld.getGravity(), PhysicsSystem.helpVector3);
        }


        public set gravity(value: Vector3) {
            this._oimoWorld.setGravity(PhysicsSystem.toOIMOVec3_A(value));
        }
        //#endregion
    }
}