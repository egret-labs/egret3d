namespace egret3d.oimo {
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class SphereCollider extends Collider {
        public readonly geometryType: GeometryType = GeometryType.Sphere;

        @paper.serializedField
        private _radius: number = 1.0;

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.SphereGeometry(this._radius);

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
    }
}