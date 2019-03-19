
namespace egret3d.oimo {
    /**
     * 
     */
    @paper.executeMode(paper.PlayerMode.Player | paper.PlayerMode.DebugPlayer)
    export class PhysicsSystem extends paper.BaseSystem<paper.GameObject> {
        /**
         * @internal
         */
        public static readonly _helpTransform: OIMO.Transform = new OIMO.Transform();

        private readonly _gravity: egret3d.Vector3 = Vector3.create(0.0, -9.80665, 0.0);
        private readonly _rayCastClosest: OIMO.RayCastClosest = new OIMO.RayCastClosest();
        private readonly _contactCallback: OIMO.ContactCallback = new OIMO.ContactCallback();
        private readonly _contactColliders: ContactCollecter = paper.Application.sceneManager.globalEntity.getOrAddComponent(ContactCollecter);
        private _oimoWorld: OIMO.World = null!;

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(egret3d.Transform, Rigidbody).extraOf(
                    BoxCollider, SphereCollider, CylinderCollider, ConeCollider, CapsuleCollider,
                    PrismaticJoint, RevoluteJoint, CylindricalJoint, SphericalJoint, UniversalJoint, ConeTwistJoint,
                ),
            ];
        }

        public onAwake() {
            this._oimoWorld = new OIMO.World();
            this._oimoWorld.setGravity(this._gravity as any);
            this._contactCallback.beginContact = (contact: OIMO.Contact) => {
                // do {

                // }
                // while (contact.getNext());

                //TODO
                this._contactColliders.begin.push(contact);
                this._contactColliders.stay.push(contact);

                const colliderA = contact.getShape1().userData as BaseCollider;
                const colliderB = contact.getShape2().userData as BaseCollider;

                for (const behaviour of colliderA.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                    behaviour.onCollisionEnter && behaviour.onCollisionEnter(colliderB);
                }

                for (const behaviour of colliderB.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                    behaviour.onCollisionEnter && behaviour.onCollisionEnter(colliderA);
                }
            };
            this._contactCallback.preSolve = (contact: OIMO.Contact) => {
            };
            this._contactCallback.postSolve = (contact: OIMO.Contact) => {
            };
            this._contactCallback.endContact = (contact: OIMO.Contact) => {
                //TODO
                this._contactColliders.end.push(contact);

                const stay = this._contactColliders.stay;
                const index = stay.indexOf(contact);
                if (index >= 0) {
                    stay.splice(index, 1);
                }

                const colliderA = contact.getShape1().userData as BaseCollider;
                const colliderB = contact.getShape2().userData as BaseCollider;

                for (const behaviour of colliderA.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                    behaviour.onCollisionExit && behaviour.onCollisionExit(colliderB);
                }

                for (const behaviour of colliderB.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                    behaviour.onCollisionExit && behaviour.onCollisionExit(colliderA);
                }
            };
        }

        public onComponentRemoved(component: BaseCollider | BaseJoint<OIMO.Joint>, group: paper.Group<paper.GameObject>) {
            if (component instanceof BaseCollider) {
                const rigidbody = component.entity.getComponent(Rigidbody)!;

                if ((component.oimoShape as any)._rigidBody) {
                    rigidbody.oimoRigidbody.removeShape(component.oimoShape);
                }
                // rigidbody._updateMass(rigidbody.oimoRigidbody);
            }
            else if (component instanceof BaseJoint) {
                this._oimoWorld.removeJoint(component.oimoJoint);
            }
        }

        public onEntityRemoved(entity: paper.GameObject, group: paper.Group<paper.GameObject>) {
            const rigidbody = entity.getRemovedComponent(Rigidbody) || entity.getComponent(Rigidbody)!;
            const oimoRigidbody = rigidbody.oimoRigidbody;

            let joint = oimoRigidbody.getJointLinkList();

            while (joint !== null) {
                if (joint.getContact().getRigidBody1() === oimoRigidbody) {
                    this._oimoWorld.removeJoint(joint.getContact());
                }

                joint = joint.getNext();
            }

            this._oimoWorld.removeRigidBody(oimoRigidbody);
        }

        public onEntityAdded(entity: paper.GameObject, group: paper.Group<paper.GameObject>) {
            const rigidbody = entity.getComponent(Rigidbody)!;

            for (const shape of entity.getComponents(BaseCollider as any, true) as BaseCollider[]) {
                if (!(shape.oimoShape as any)._rigidBody) {
                    rigidbody.oimoRigidbody.addShape(shape.oimoShape);
                    // rigidbody._updateMass(rigidbody.oimoRigidbody);
                }
            }

            for (const joint of entity.getComponents(BaseJoint as any, true) as BaseJoint<OIMO.Joint>[]) {
                if (!(joint.oimoJoint as any)._world) {
                    this._oimoWorld.addJoint(joint.oimoJoint);
                }
            }

            this._oimoWorld.addRigidBody(rigidbody.oimoRigidbody);
        }

        public onComponentAdded(component: BaseCollider | BaseJoint<OIMO.Joint>, group: paper.Group<paper.GameObject>) {
            if (component instanceof BaseCollider) {
                if (!(component.oimoShape as any)._rigidBody) {
                    const rigidbody = component.entity.getComponent(Rigidbody)!;

                    rigidbody.oimoRigidbody.addShape(component.oimoShape);
                    // rigidbody._updateMass(rigidbody.oimoRigidbody);
                }

                if (!component.oimoShape.getContactCallback()) {
                    component.oimoShape.setContactCallback(this._contactCallback);
                }
            }
            else if (component instanceof BaseJoint && !(component.oimoJoint as any)._world) {
                this._oimoWorld.addJoint(component.oimoJoint);
            }
        }

        public onTick(deltaTime: number) {
            const entities = this.groups[0].entities;
            const helpVector3 = Vector3.create().release();
            const helpVector4 = Vector4.create().release();
            const oimoTransform = PhysicsSystem._helpTransform;

            for (const entity of entities) {
                const rigidbody = entity.getComponent(Rigidbody)!;

                switch (rigidbody.type) {
                    case RigidbodyType.KINEMATIC:
                        if (rigidbody.isSleeping) {
                        }
                        else {
                            rigidbody.syncTransform();
                        }
                        break;
                }
            }

            this._oimoWorld.step(deltaTime);

            for (const gameObject of entities) {
                const transform = gameObject.transform;
                const rigidbody = gameObject.getComponent(Rigidbody)!;
                const oimoRigidbody = rigidbody.oimoRigidbody;

                switch (rigidbody.type) {
                    case RigidbodyType.DYNAMIC:
                        if (oimoRigidbody.isSleeping()) {
                        }
                        else {
                            oimoRigidbody.getTransformTo(oimoTransform);
                            oimoTransform.getPositionTo(helpVector3 as any);
                            oimoTransform.getOrientationTo(helpVector4 as any);
                            transform.setPosition(helpVector3);
                            transform.setRotation(helpVector4);
                        }
                        break;
                }
            }
            //
            const stay = this._contactColliders.stay as OIMO.Contact[];

            if (stay.length > 0) {
                for (const contact of stay) {
                    const colliderA = contact.getShape1().userData as BaseCollider;
                    const colliderB = contact.getShape2().userData as BaseCollider;
                    // TODO 优化行为组件查询

                    for (const behaviour of colliderA.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                        behaviour.onCollisionStay && behaviour.onCollisionStay(colliderB);
                    }

                    for (const behaviour of colliderB.entity.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                        behaviour.onCollisionStay && behaviour.onCollisionStay(colliderA);
                    }
                }
            }
        }

        public raycast(ray: Readonly<Ray>, cullingMask: paper.Layer = paper.Layer.Default, maxDistance: float = 0.0, raycastInfo: RaycastInfo | null = null): boolean {
            const rayCastClosest = this._rayCastClosest;
            rayCastClosest.clear(); // TODO culling Mask.

            const end = Vector3.create().multiplyScalar(maxDistance > 0.0 ? maxDistance : 100000.0, ray.direction).add(ray.origin).release(); // TODO 精度问题。
            this._oimoWorld.rayCast(
                ray.origin as any, end as any,
                rayCastClosest
            );

            if (rayCastClosest.hit && raycastInfo) {
                raycastInfo.distance = Vector3.getDistance(ray.origin as Readonly<IVector3>, end) * rayCastClosest.fraction;
                raycastInfo.position.copy(rayCastClosest.position);

                if (raycastInfo.normal) {
                    raycastInfo.normal.copy(rayCastClosest.normal);
                }

                raycastInfo.collider = rayCastClosest.shape.userData;
                raycastInfo.rigidbody = rayCastClosest.shape.getRigidBody().userData; // TODO
                raycastInfo.transform = (raycastInfo.rigidbody as egret3d.oimo.Rigidbody).gameObject!.transform;

                return true;
            }

            return false;
        }
        /**
         * 
         */
        public get gravity(): Readonly<IVector3> {
            return this._gravity;
        }
        public set gravity(value: Readonly<IVector3>) {
            this._gravity.copy(value);
            this._oimoWorld.setGravity(this._gravity as any);
        }
        /**
         * 
         */
        public get oimoWorld(): OIMO.World {
            return this._oimoWorld;
        }
    }
    //
    paper.Application.systemManager.preRegister(PhysicsSystem, paper.Application.gameObjectContext, paper.SystemOrder.FixedUpdate - 1);
}
