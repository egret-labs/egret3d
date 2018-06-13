namespace egret3d.ammo {
    /**
     * 
     */
    export abstract class CollisionShape extends paper.BaseComponent {
        protected _btCollisionShape: Ammo.btCollisionShape | null = null;

        protected abstract _createCollisionShape(): Ammo.btCollisionShape | null;

        public uninitialize() {
            super.uninitialize();

            if (this._btCollisionShape) {
                Ammo.destroy(this._btCollisionShape);
            }

            this._btCollisionShape = null;
        }
        /**
         * 
         */
        public get btCollisionShape() {
            if (!this._btCollisionShape) {
                this._btCollisionShape = this._createCollisionShape();
            }

            return this._btCollisionShape;
        }
    }
}