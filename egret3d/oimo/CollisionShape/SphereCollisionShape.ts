namespace egret3d.oimo {
    export class SphereCollisionShape extends CollisionShape {
        @paper.serializedField
        private _radius: number = 1;

        public constructor(radius: number) {
            super();
            this._radius = radius;
            this._geometryType = GeometryType.SPHERE;
        }

        public get radius(): number {
            return this._radius;
        }

        protected _createGeometry(){
            return new OIMO.SphereGeometry(this._radius);
        }
    }
}