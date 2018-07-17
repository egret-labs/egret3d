namespace egret3d.oimo {
    export class RaycastInfo {
        public distance: number;
        public readonly position: Vector3 = new Vector3();
        public readonly normal: Vector3 = new Vector3();
        public rigidbody: Rigidbody | null;
        public collider: Collider | null;
        /**
         * @internal
         */
        public clean() {
            this.distance = 0.0;
            this.position.x = 0.0;
            this.position.y = 0.0;
            this.position.z = 0.0;
            this.normal.x = 0.0;
            this.normal.y = 0.0;
            this.normal.z = 0.0;
            this.rigidbody = null;
            this.collider = null;
        }
    }
}