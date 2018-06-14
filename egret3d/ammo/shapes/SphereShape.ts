namespace egret3d.ammo {
    /**
     * 
     */
    export class SphereShape extends CollisionShape {
        @paper.serializedField
        protected _radius: number = 1.0;
        @paper.serializedField
        protected readonly _scale: Vector3 = Vector3.ONE.clone();

        protected _createCollisionShape() {
            const btCollisionShape = new Ammo.btSphereShape(this._radius);
            btCollisionShape.setMargin(this._margin);
            this._updateScale(btCollisionShape);

            return btCollisionShape;
        }

        protected _updateScale(btCollisionShape: Ammo.btCollisionShape) {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._scale.x, this._scale.y, this._scale.z);
            btCollisionShape.setLocalScaling(btVector3);
        }
        /**
         * 
         */
        public get radius() {
            return this._radius;
        }
        public set radius(value: number) {
            if (this._radius === value) {
                return;
            }

            if (this._btCollisionShape) {
                console.warn("Cannot change the radius after the collision shape has been created.");
            }
            else {
                this._radius = value;
            }
        }
        /**
         * 
         */
        public get scale(): Readonly<Vector3> {
            return this._scale;
        }
        public set scale(value: Readonly<Vector3>) {
            this._scale.copy(value);

            if (this._btCollisionShape) {
                this._updateScale(this._btCollisionShape);
            }
        }
    }
}