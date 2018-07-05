namespace egret3d.oimo {
    export class BoxCollisionShape extends CollisionShape{
        public readonly geometryType: GeometryType = GeometryType.BOX;

        @paper.serializedField
        protected readonly _size: Vector3 = Vector3.ONE.clone();

        protected _createShape() {
            const config = this._updateConfig();
            const size = PhysicsSystem.toOIMOVec3_A(this._size);
            size.x *= 0.5;
            size.y *= 0.5;
            size.z *= 0.5;

            config.geometry = new OIMO.BoxGeometry(size);

            const shape = new OIMO.Shape(config);

            return shape;
        }
        /**
         * 
         */
        public get size(): Readonly<Vector3> {
            return this._size;
        }
        public set size(value: Readonly<Vector3>) {
            if (this._oimoShape) {
                console.warn("Cannot change the size after the collision shape has been created.\nSize is only the initial value.");
            }
            else {
                this._size.copy(value);
            }
        }
    }
}