namespace egret3d {
    /**
     * 灯光的阴影。
     */
    export class LightShadow implements paper.ISerializable {
        /**
         * @internal
         */
        public static create() {
            return new LightShadow();
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public radius: number = 0.5;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public bias: number = 0.01;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.UINT)
        public size: uint = 512;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: 9999 })
        public near: number = 0.5;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.02, maximum: 10000 })
        public far: number = 500.0;
        /**
         * @private
         */
        public readonly matrix: Matrix4 = Matrix4.create();
        /**
         * @private
         */
        public readonly camera: Camera = paper.GameObject.globalGameObject.getComponent(Camera)!;
        /**
         * @private
         */
        public renderTarget: RenderTexture = null!;
        /**
         * 
         */
        // public update: ((light: BaseLight, shadow: LightShadow) => void) | null = null;
        public update: ((face: number) => void) | null = null;
        /**
         * 禁止实例化。
         */
        private constructor() {
        }

        public serialize() {
            return [this.radius, this.bias, this.size, this.near, this.far];
        }

        public deserialize(data: ReadonlyArray<number>) {
            this.radius = data[0];
            this.bias = data[1];
            this.size = data[2];
            this.near = data[3];
            this.far = data[4];

            return this;
        }
    }
}