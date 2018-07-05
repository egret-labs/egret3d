namespace egret3d.oimo {
    /**此基类包含oimo.ShapeConfig */
    export abstract class CollisionShape extends paper.BaseComponent {
        @paper.serializedField
        protected _geometryType = -1;
        protected _oimoShape: OIMO.Shape = null;
        private _shapeConfig: OIMO.ShapeConfig;

        constructor() {
            super();
            this._shapeConfig = new OIMO.ShapeConfig();
        }
        public get geometryType() {
            return this._geometryType;
        }

        public get oimoShape() {
            if (!this._oimoShape) {
                console.log("collision shape "+this.gameObject.name+" is created");
                let geom = this._createGeometry();
                this._shapeConfig.geometry = geom;
                this._oimoShape = new OIMO.Shape(this._shapeConfig);
            }
            return this._oimoShape;
        }
        protected abstract _createGeometry(): OIMO.Geometry;

        /*public getVolume (){
            return this._oimoGeometry.getVolume();
        }*/
    }

    export class GeometryType {
        public static SPHERE: number = 0;
        public static BOX: number = 1;
        public static CYLINDER: number = 2;
        public static CONE: number = 3;
        public static CAPSULE: number = 4;
        public static CONVEX_HULL: number = 5;
        public static CONVEX_MIN: number = 0;
        public static CONVEX_MAX: number = 5;
    }
}