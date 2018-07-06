namespace egret3d.oimo {
    export class BoxCollisionShape extends CollisionShape {
        @paper.serializedField
        protected readonly _size: Vector3 = new Vector3(1,1,1);

        public constructor() {
            super();
            this._geometryType = GeometryType.BOX;
        }

        public set size(value: Readonly<Vector3>) {
            if (this._oimoShape) {
                console.warn("Cannot change the size after the collision shape has been created.\nSize is only the initial value.\nUse scale to change the shape of a collision shape.");
            } else
                this._size.copy(value);
        }

        public get size(): Readonly<Vector3> {
            return this._size;
        }

        protected _createGeometry() {
            return new OIMO.BoxGeometry(
                new OIMO.Vec3(this._size.x / 2, this._size.y / 2, this._size.z / 2));
        }

    }
}