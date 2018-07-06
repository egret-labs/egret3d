namespace egret3d.oimo {
    /**此基类包含oimo.ShapeConfig */
    export abstract class CollisionShape extends paper.BaseComponent {
        @paper.serializedField
        protected _geometryType = -1;
        protected _oimoShape: OIMO.Shape = null;
        private _shapeConfig: OIMO.ShapeConfig;

        public get geometryType() {
            return this._geometryType;
        }

        public get oimoShape() {
            if (!this._oimoShape) {
                console.log("Shape is automatically constructed with own settings. Use .create(config?) to build shape manually");
                this.create();
            }
            return this._oimoShape;
        }

        protected abstract _createGeometry(): OIMO.Geometry;

        public create(config?: any) {
            if (!config) {
                let oimoGeometry = this._createGeometry();
                this.shapeConfig.geometry = oimoGeometry;
                this._oimoShape = new OIMO.Shape(this._shapeConfig);
            }
        }

        protected get shapeConfig() {
            if (!this._shapeConfig)
                this._shapeConfig = new OIMO.ShapeConfig();
            return this._shapeConfig;
        }

        //TODO:添加对其他shapeconfig内属性设置的支持
        public get collisionGroup() {
            return this.shapeConfig.collisionGroup;
        }
        public set collisionGroup(value: number) {
            if (!this.shapeConstructed("collision group"))
                this.shapeConfig.collisionGroup = value;
        }

        protected shapeConstructed(name: string): boolean {
            if (this._oimoShape) {
                console.warn("shape already constructed, you cannot change " + name + " any more :(")
                return true;
            }
            return false;
        }

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