namespace egret3d.ammo {
    /**
     * TODO
     */
    export class HeightfieldTerrainShape extends CollisionShape {
        @paper.serializedField
        protected _upAxis: Ammo.Axis = Ammo.Axis.Y;

        protected _createCollisionShape() {
            const meshFilter = this.gameObject.getComponent(MeshFilter);
            if (meshFilter && meshFilter.mesh) {
                const vertices = meshFilter.mesh.getVertices();
                const btCollisionShape = new Ammo.btHeightfieldTerrainShape(0, 0, null as any, 1.0, 0.0, 1.0, this._upAxis, "PHY_FLOAT", false);

                btCollisionShape.setMargin(this._margin);
                return btCollisionShape;
            }

            throw new Error("Arguments error.");
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