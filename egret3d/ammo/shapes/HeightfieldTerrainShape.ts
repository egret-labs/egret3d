namespace egret3d.ammo {
    /**
     * 
     */
    export class HeightfieldTerrainShape extends CollisionShape {
        @paper.serializedField
        protected _upAxis: Ammo.Axis = Ammo.Axis.Y;

        protected _createCollisionShape() {
            // const btVector3 = PhysicsSystem.helperVector3;
            // btVector3.setValue(this._size.x * 0.5, this._size.y * 0.5, this._size.z * 0.5);
            const btCollisionShape = new Ammo.btHeightfieldTerrainShape();

            return btCollisionShape;
        }
        /**
         * 
         */
        public get upAxis() {
            return this._upAxis;
        }
        public set upAxis(value: number) {
            if (this._upAxis === value) {
                return;
            }

            if (this._btCollisionShape) {
                console.warn("Cannot change the up axis after the collision shape has been created.");
            }
            else {
                this._upAxis = value;
            }
        }
    }
}