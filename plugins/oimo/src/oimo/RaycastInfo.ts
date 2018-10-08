namespace egret3d.oimo {
    export class RaycastInfo {
        private static readonly _instances: RaycastInfo[] = [];
        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop()!;
            }

            return new RaycastInfo();
        }

        public distance: number = 0.0;
        public readonly position: Vector3 = Vector3.create();
        public readonly normal: Vector3 = Vector3.FORWARD.clone();
        public rigidbody: Rigidbody | null = null;
        public collider: Collider | null = null;

        private constructor() { }

        public release() {
            this._clear();
            RaycastInfo._instances.push(this);

            return this;
        }

        private _clear() {
            this.distance = 0.0;
            this.position.set(0.0, 0.0, 0.0);
            this.normal.copy(Vector3.FORWARD);
            this.rigidbody = null;
            this.collider = null;
        }
    }
}