namespace egret3d.oimo {
    export class SphereCollisionShape extends CollisionShape {
        @paper.serializedField
        private _radius: number = 1;

        public constructor() {
            super();
            this._geometryType = GeometryType.SPHERE;
        }

        public get radius(): number {
            return this._radius;
        }
        public set radius(value) {
            this._radius = value;
        }

        protected _createGeometry() {
            return new OIMO.SphereGeometry(this._radius);
        }
    }
}