namespace egret3d.ammo {
    /**
     * 
     */
    export class GhostObject extends CollisionObject {
        public readonly collisionObjectType: Ammo.CollisionObjectTypes = Ammo.CollisionObjectTypes.GhostObject;
        /**
         * @internal
         */
        public _prevCollisionObjects: CollisionObject[] = [];
        /**
         * @internal
         */
        public _currentCollisionObjects: CollisionObject[] = [];

        protected _createCollisionObject(): Ammo.btCollisionObject {
            const btCollisionObject = new Ammo.btGhostObject();
            btCollisionObject.setWorldTransform(this._getBTTransform());
            btCollisionObject.setCollisionFlags(this._collisionFlags);
            btCollisionObject.setUserPointer(this._btPointer as any);
            (this._btPointer as any).egretComponent = this;

            return btCollisionObject;
        }

        public initialize() {
            super.initialize();

            this._collisionFlags = Ammo.CollisionFlags.NoContactResponse;
        }

        public set collisionFlags(_value: Ammo.CollisionFlags) {
            console.warn("Cannot set the collision flags of ghost gbject.");
        }

        public get btGhostObject() {
            return this._btCollisionObject as Ammo.btGhostObject;
        }
    }
}
