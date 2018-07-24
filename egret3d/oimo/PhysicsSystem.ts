namespace egret3d.oimo {
    const _helpVector3 = new Vector3();
    /**
     * 
     */
    export class PhysicsSystem extends paper.BaseSystem {
        /**
         * 
         */
        public static readonly instance: PhysicsSystem;
        /**
         * @internal
         */
        public static readonly _helpTransform: OIMO.Transform = new OIMO.Transform();

        protected readonly _interests = [
            [
                { componentClass: Rigidbody },
                { componentClass: [BoxCollider, SphereCollider], type: paper.InterestType.Unessential },
                { componentClass: [SphericalJoint, HingeJoint, ConeTwistJoint], type: paper.InterestType.Unessential }
            ],
            [
                { componentClass: paper.Behaviour as any, type: paper.InterestType.Extends | paper.InterestType.Unessential, isBehaviour: true, }
            ]
        ];
        private readonly _gravity = new Vector3(0, -9.80665, 0);
        private readonly _rayCastClosest: OIMO.RayCastClosest = new OIMO.RayCastClosest();
        private readonly _contactCallback: OIMO.ContactCallback = new OIMO.ContactCallback();
        private readonly _contactColliders: paper.ContactColliders = this._globalGameObject.getComponent(paper.ContactColliders) || this._globalGameObject.addComponent(paper.ContactColliders);
        private _oimoWorld: OIMO.World = null as any;

        public rayCast(ray: Ray, distance: number, mask?: paper.CullingMask, raycastInfo?: RaycastInfo): RaycastInfo | null
        public rayCast(from: Readonly<IVector3>, to: Readonly<IVector3>, mask?: paper.CullingMask, raycastInfo?: RaycastInfo): RaycastInfo | null
        public rayCast(rayOrFrom: Ray | Readonly<IVector3>, distanceOrTo: number | Readonly<IVector3>, mask?: paper.CullingMask, raycastInfo?: RaycastInfo) {
            const rayCastClosest = this._rayCastClosest;
            rayCastClosest.clear(); // TODO mask.

            if (rayOrFrom instanceof Ray) {
                distanceOrTo = _helpVector3.copy(rayOrFrom.direction).scale((distanceOrTo as number) || 100.0).add(rayOrFrom.origin);
                rayOrFrom = rayOrFrom.origin;
            }

            this._oimoWorld.rayCast(
                rayOrFrom as any, distanceOrTo as any,
                rayCastClosest
            );

            if (rayCastClosest.hit) {
                raycastInfo = raycastInfo || new RaycastInfo();
                raycastInfo.clean();
                raycastInfo.distance = Vector3.getDistance(rayOrFrom as Readonly<IVector3>, distanceOrTo as Readonly<IVector3>) * rayCastClosest.fraction;
                raycastInfo.position.copy(rayCastClosest.position);
                raycastInfo.normal.copy(rayCastClosest.normal);
                raycastInfo.rigidbody = rayCastClosest.shape.getRigidBody().userData;
                raycastInfo.collider = rayCastClosest.shape.userData;

                return raycastInfo;
            }

            return null;
        }

        public onAwake() {
            (PhysicsSystem as any).instance = this;

            this._oimoWorld = new OIMO.World();
            this._oimoWorld.setGravity(this._gravity as any);
            this._contactCallback.beginContact = (contact: OIMO.Contact) => {
                // do {

                // }
                // while (contact.getNext());
                this._contactColliders.begin.push(contact);
            };
            this._contactCallback.preSolve = (contact: OIMO.Contact) => {
            };
            this._contactCallback.postSolve = (contact: OIMO.Contact) => {
            };
            this._contactCallback.endContact = (contact: OIMO.Contact) => {
                this._contactColliders.end.push(contact);
            };
        }

        public onAddGameObject(gameObject: paper.GameObject, group: paper.Group) {
            const rigidbody = group.getComponent(gameObject, 0) as Rigidbody;

            for (const shape of gameObject.getComponents(Collider as any, true) as Collider[]) {
                if (!(shape.oimoShape as any)._rigidBody) {
                    rigidbody.oimoRigidbody.addShape(shape.oimoShape);
                    // rigidbody._updateMass(rigidbody.oimoRigidbody);
                }
            }

            for (const joint of gameObject.getComponents(Joint as any, true) as Joint<OIMO.Joint>[]) {
                if (!(joint.oimoJoint as any)._world) {
                    this._oimoWorld.addJoint(joint.oimoJoint);
                }
            }

            this._oimoWorld.addRigidBody(rigidbody.oimoRigidbody);
        }

        public onAddComponent(component: Collider | Joint<any>, group: paper.Group) {
            if (group !== this._groups[0]) {
                return;
            }

            if (component instanceof Collider) {
                if (!(component.oimoShape as any)._rigidBody) {
                    const rigidbody = group.getComponent(component.gameObject, 0) as Rigidbody;
                    rigidbody.oimoRigidbody.addShape(component.oimoShape);
                    // rigidbody._updateMass(rigidbody.oimoRigidbody);
                }
            }
            else if (!(component.oimoJoint as any)._world) {
                this._oimoWorld.addJoint(component.oimoJoint);
            }
        }

        public onUpdate(deltaTime: number) {
            let currentTimes = 0;
            let fixedTime = this._clock._fixedTime;
            const totalTimes = Math.min(Math.floor(fixedTime / this._clock.fixedDeltaTime), this._clock.maxFixedSubSteps);
            const oimoTransform = PhysicsSystem._helpTransform;
            const components = this._groups[0].components as ReadonlyArray<Rigidbody>;
            const behaviourComponents = this._groups[1].components as ReadonlyArray<paper.Behaviour>;

            while (fixedTime >= this._clock.fixedDeltaTime && currentTimes++ < this._clock.maxFixedSubSteps) {
                for (const component of behaviourComponents) {
                    if (component) {
                        component.onFixedUpdate && component.onFixedUpdate(currentTimes, totalTimes);
                    }
                }

                for (const component of components) {
                    const transform = component.gameObject.transform;
                    const oimoRigidbody = component.oimoRigidbody;

                    switch (component.type) {
                        case RigidbodyType.KINEMATIC:
                        case RigidbodyType.STATIC:
                            if (oimoRigidbody.isSleeping()) {
                            }
                            else {
                                const position = transform.getPosition();
                                const quaternion = transform.getRotation();
                                oimoTransform.setPosition(position as any);
                                oimoTransform.setOrientation(quaternion as any);
                                oimoRigidbody.setTransform(oimoTransform);
                            }
                            break;
                    }
                }

                this._oimoWorld.step(this._clock.fixedDeltaTime);

                for (const component of components) {
                    const transform = component.gameObject.transform;
                    const oimoRigidbody = component.oimoRigidbody;

                    switch (component.type) {
                        case RigidbodyType.DYNAMIC:
                            if (oimoRigidbody.isSleeping()) {
                            }
                            else {
                                oimoRigidbody.getTransformTo(oimoTransform);
                                oimoTransform.getPositionTo(helpVector3A as any);
                                oimoTransform.getOrientationTo(helpVector4A as any);
                                transform.setPosition(helpVector3A);
                                transform.setRotation(helpVector4A);
                            }
                            break;
                    }
                }
                //
                const begin = this._contactColliders.begin as OIMO.Contact[];
                const stay = this._contactColliders.stay as OIMO.Contact[];
                const end = this._contactColliders.end as OIMO.Contact[];

                if (begin.length > 0) {
                    for (const contact of begin) {
                        const colliderA = contact.getShape1().userData as Collider;
                        const colliderB = contact.getShape2().userData as Collider;

                        for (const behaviour of colliderA.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionEnter && behaviour.onCollisionEnter(colliderB);
                        }

                        for (const behaviour of colliderB.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionEnter && behaviour.onCollisionEnter(colliderA);
                        }
                    }
                }

                if (end.length > 0) {
                    for (const contact of end) {
                        const colliderA = contact.getShape1().userData as Collider;
                        const colliderB = contact.getShape2().userData as Collider;

                        for (const behaviour of colliderA.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionExit && behaviour.onCollisionExit(colliderB);
                        }

                        for (const behaviour of colliderB.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionExit && behaviour.onCollisionExit(colliderA);
                        }
                    }
                }

                if (stay.length > 0) {
                    for (const contact of stay) {
                        const colliderA = contact.getShape1().userData as Collider;
                        const colliderB = contact.getShape2().userData as Collider;

                        for (const behaviour of colliderA.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionStay && behaviour.onCollisionStay(colliderB);
                        }

                        for (const behaviour of colliderB.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                            behaviour.onCollisionStay && behaviour.onCollisionStay(colliderA);
                        }
                    }
                }

                fixedTime -= this._clock.fixedDeltaTime;
            }
        }

        public onRemoveComponent(component: Collider | Joint<any>, group: paper.Group) {
            if (group !== this._groups[0]) {
                return;
            }

            if (component instanceof Collider) {
                const rigidbody = group.getComponent(component.gameObject, 0) as Rigidbody;
                rigidbody.oimoRigidbody.removeShape(component.oimoShape);
                // rigidbody._updateMass(rigidbody.oimoRigidbody);
            }
            else {
                this._oimoWorld.removeJoint(component.oimoJoint);
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group) {
            const rigidbody = group.getComponent(gameObject, 0) as Rigidbody;

            for (const joint of gameObject.getComponents(Joint as any, true) as Joint<any>[]) {
                this._oimoWorld.removeJoint(joint.oimoJoint);
            }

            for (const shape of gameObject.getComponents(Collider as any, true) as Collider[]) {
                rigidbody.oimoRigidbody.removeShape(shape.oimoShape);
                // rigidbody._updateMass(rigidbody.oimoRigidbody);
            }

            this._oimoWorld.removeRigidBody(rigidbody.oimoRigidbody);
        }

        public onDestroy() {
            // TODO
        }
        /**
         * 
         */
        public get gravity() {
            return this._gravity;
        }
        public set gravity(value: Readonly<IVector3>) {
            this._gravity.copy(value);
            this._oimoWorld.setGravity(this._gravity as any);
        }
    }
}