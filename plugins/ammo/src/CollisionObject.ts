namespace egret3d.ammo {
    /**
     * 
     */
    export class CollisionObject extends paper.BaseComponent {
        public readonly collisionObjectType: Ammo.CollisionObjectTypes = Ammo.CollisionObjectTypes.CollisionObject;

        @paper.serializedField
        protected _collisionFlags: Ammo.CollisionFlags = Ammo.CollisionFlags.None;
        @paper.serializedField
        protected _collisionGroups: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.DefaultFilter;
        @paper.serializedField
        protected _collisionMask: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.AllFilter;
        protected readonly _btPointer: Ammo.btVector3 = new Ammo.btVector3();
        protected _btCollisionObject: Ammo.btCollisionObject = null as any;

        protected _createCollisionObject(): Ammo.btCollisionObject {
            const btCollisionObject = new Ammo.btCollisionObject();
            btCollisionObject.setWorldTransform(this._getBTTransform());
            btCollisionObject.setCollisionFlags(this._collisionFlags);
            btCollisionObject.setUserPointer(this._btPointer as any);
            (this._btPointer as any).egretComponent = this;

            return btCollisionObject;
        }

        protected _getBTTransform() {
            const transform = this.gameObject.transform;
            const position = transform.getPosition();
            const rotation = transform.getRotation();
            const helpVectorA = PhysicsSystem.helpVector3A;
            const helpQuaternionA = PhysicsSystem.helpQuaternionA;
            const helpTransformA = PhysicsSystem.helpTransformA;
            helpVectorA.setValue(position.x, position.y, position.z);
            helpQuaternionA.setValue(rotation.x, rotation.y, rotation.z, rotation.w);
            helpTransformA.setIdentity();
            helpTransformA.setOrigin(helpVectorA);
            helpTransformA.setRotation(helpQuaternionA);

            return helpTransformA;
        }

        public uninitialize() {
            super.uninitialize();

            if (this._btCollisionObject) {
                Ammo.destroy(this._btCollisionObject);
                Ammo.destroy(this._btPointer);
            }

            this._btCollisionObject = null as any;
        }
        /**
         * 
         */
        public isStatic() {
            return (this._collisionFlags & Ammo.CollisionFlags.StaticObject) !== Ammo.CollisionFlags.None;
        }
        /**
         * 
         */
        public isKinematic() {
            return (this._collisionFlags & Ammo.CollisionFlags.KinematicObject) !== Ammo.CollisionFlags.None;
        }
        /**
         * 
         */
        public isStaticOrKinematic() {
            return (this._collisionFlags & (Ammo.CollisionFlags.StaticObject | Ammo.CollisionFlags.KinematicObject)) !== Ammo.CollisionFlags.None;
        }
        /**
         * 
         */
        public isDynamic() {
            return (this._collisionFlags & (Ammo.CollisionFlags.StaticObject | Ammo.CollisionFlags.KinematicObject)) === Ammo.CollisionFlags.None;
        }
        /**
         * 
         */
        public get collisionFlags() {
            return this._collisionFlags;
        }
        public set collisionFlags(value: Ammo.CollisionFlags) {
            if (this._collisionFlags === value) {
                return;
            }

            this._collisionFlags = value;

            if (this._btCollisionObject) {
                this._btCollisionObject.setCollisionFlags(this._collisionFlags);
            }
        }
        /**
         * 
         */
        public get collisionGroups() {
            return this._collisionGroups;
        }
        public set collisionGroups(value: Ammo.CollisionFilterGroups) {
            if (this._collisionGroups === value) {
                return;
            }

            if (this._btCollisionObject) {
                console.warn("Cannot change the collision groups after the collision object has been created.");
            }
            else {
                this._collisionGroups = value;
            }
        }
        /**
         * 
         */
        public get collisionMask() {
            return this._collisionMask;
        }
        public set collisionMask(value: Ammo.CollisionFilterGroups) {
            if (this.collisionMask === value) {
                return;
            }

            if (this._btCollisionObject) {
                console.warn("Cannot change the collision mask after the collision object has been created.");
            }
            else {
                this._collisionMask = value;
            }
        }
        /**
         * 
         */
        public get btCollisionObject() {
            if (!this._btCollisionObject) {
                this._btCollisionObject = this._createCollisionObject();
            }

            return this._btCollisionObject;
        }
    }
}
