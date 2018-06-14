namespace egret3d.ammo {
    /**
     * 
     */
    export abstract class CollisionShape extends paper.BaseComponent {
        @paper.serializedField
        protected _margin: number = 0.05;
        protected _btCollisionShape: Ammo.btCollisionShape = null as any;

        protected abstract _createCollisionShape(): Ammo.btCollisionShape;

        public uninitialize() {
            super.uninitialize();

            if (this._btCollisionShape) {
                Ammo.destroy(this._btCollisionShape);
            }

            this._btCollisionShape = null as any;
        }
        /**
         * 
         */
        public get margin() {
            return this._margin;
        }
        public set margin(value: number) {
            if (this._margin === value) {
                return;
            }

            this._margin = value;
            
            if (this._btCollisionShape) {
                this._btCollisionShape.setMargin(this._margin);
            }
        }

        public get btCollisionShape() {
            if (!this._btCollisionShape) {
                this._btCollisionShape = this._createCollisionShape();
            }

            return this._btCollisionShape;
        }
    }
}