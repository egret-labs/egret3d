namespace egret3d.ammo {
    /**
     * 
     */
    export class ConeShape extends CollisionShape {
        @paper.serializedField
        protected _upAxis: Ammo.Axis = Ammo.Axis.Y;
        @paper.serializedField
        protected _radius: number = 1.0;
        @paper.serializedField
        protected _height: number = 1.0;
        @paper.serializedField
        protected readonly _scale: Vector3 = Vector3.ONE.clone();

        protected _createCollisionShape() {
            let btCollisionShape: Ammo.btCollisionShape;
            switch (this._upAxis) {
                case Ammo.Axis.X:
                    btCollisionShape = new Ammo.btConeShapeX(this._radius, this._height);
                    break;

                case Ammo.Axis.Y:
                    btCollisionShape = new Ammo.btConeShape(this._radius, this._height);
                    break;

                case Ammo.Axis.Z:
                    btCollisionShape = new Ammo.btConeShapeZ(this._radius, this._height);
                    break;
            }

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
        public get upAxis() {
            return this._upAxis;
        }
        public set upAxis(value: number) {
            if (this._upAxis === value) {
                return;
            }

            this._upAxis = value;

            if (this._btCollisionShape) {
                // TODO
            }
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

            this._radius = value;

            if (this._btCollisionShape) {
                // TODO
            }
        }
        /**
         * 
         */
        public get height() {
            return this._height;
        }
        public set height(value: number) {
            if (this._height === value) {
                return;
            }

            this._height = value;

            if (this._btCollisionShape) {
                // TODO
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