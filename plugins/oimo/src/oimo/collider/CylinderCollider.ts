namespace egret3d.oimo {
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class CylinderCollider extends Collider {
        public readonly geometryType: GeometryType = GeometryType.Cylinder;

        @paper.serializedField
        private _radius: number = 1.0;
        @paper.serializedField
        private _height: number = 1.0;

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.CylinderGeometry(this._radius, this._height * 0.5);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }
        /**
         * 
         */
        public get radius(): number {
            return this._radius;
        }
        public set radius(value: number) {
            if (this._radius === value) {
                return;
            }

            if (this._oimoShape) {
                console.warn("Cannot change the radius after the collider has been created.");
            }
            else {
                this._radius = value;
            }
        }
        /**
         * 
         */
        public get height(): number {
            return this._height;
        }
        public set height(value: number) {
            if (this._height === value) {
                return;
            }

            if (this._oimoShape) {
                console.warn("Cannot change the height after the collider has been created.");
            }
            else {
                this._height = value;
            }
        }
    }
}