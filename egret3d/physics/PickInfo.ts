namespace egret3d {
    /**
     * scene pick up info
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 场景拣选信息
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class PickInfo {
        public subMeshIndex: number = -1;
        public triangleIndex: number = -1;
        public distance: number = 0.0;
        public readonly position: Vector3 = new Vector3();
        public readonly textureCoordA: Vector2 = new Vector2();
        public readonly textureCoordB: Vector2 = new Vector2();
        public transform: Transform | null = null;
        // public collider: BaseCollider | null = null;
    }
}