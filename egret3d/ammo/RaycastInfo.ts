namespace egret3d.ammo {
    export class RaycastInfo {
        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        public distance: number = 0.0;
        public readonly position: Vector3 = new Vector3();
        public readonly normal: Vector3 = new Vector3();
        public readonly textureCoordA: Vector2 = new Vector2();
        public readonly textureCoordB: Vector2 = new Vector2();
        public transform: Transform | null = null;
        public collisionObject: CollisionObject | null = null;
    }
}