namespace egret3d.oimo {
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class BoxCollider extends Collider {
        public readonly geometryType: GeometryType = GeometryType.BOX;

        @paper.serializedField
        protected readonly _size: Vector3 = Vector3.ONE.clone();

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.BoxGeometry(helpVector3A.copy(this._size).scale(0.5) as any);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }
        /**
         * 
         */
        public get size() {
            return this._size;
        }
        public set size(value: Readonly<IVector3>) {
            if (this._oimoShape) {
                console.warn("Cannot change the size after the collision shape has been created.\nSize is only the initial value.");
            }
            else {
                this._size.copy(value);
            }
        }
    }
}