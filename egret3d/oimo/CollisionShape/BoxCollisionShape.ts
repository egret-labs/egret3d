namespace egret3d.oimo {
    export class BoxCollisionShape extends CollisionShape {
        @paper.serializedField
        private _halfExtents: Vector3 = new Vector3(0.5, 0.5, 0.5);

        public constructor(halfExtents: Vector3) {
            super();
            this._type = GeometryType.BOX;
            this._halfExtents.copy(halfExtents);
            this.setGeometry(new OIMO.BoxGeometry(PhysicsSystem.toOIMOVec3_A(halfExtents)));
        }

        public get halfExtents(): Readonly<Vector3> {
            return this._halfExtents;
            
        }

    }
}