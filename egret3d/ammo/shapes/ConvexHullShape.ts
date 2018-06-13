namespace egret3d.ammo {
    /**
     * 
     */
    export class ConvexHullShape extends CollisionShape {
        @paper.serializedField
        protected readonly _scale: Vector3 = Vector3.ONE.clone();

        protected _createCollisionShape() {
            const meshFilter = this.gameObject.getComponent(MeshFilter);
            if (meshFilter && meshFilter.mesh) {
                const btVector3 = PhysicsSystem.helpVector3A;
                const btCollisionShape = new Ammo.btConvexHullShape();
                const vertices = meshFilter.mesh.getVertices();

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    btVector3.setValue(vertices[i], vertices[i + 1], vertices[i + 2]);
                    btCollisionShape.addPoint(btVector3, i === l - 1);
                }

                this._updateScale(btCollisionShape);

                return btCollisionShape;
            }

            throw new Error("Arguments error.");
        }

        protected _updateScale(btCollisionShape: Ammo.btCollisionShape) {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._scale.x, this._scale.y, this._scale.z);
            btCollisionShape.setLocalScaling(btVector3);
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