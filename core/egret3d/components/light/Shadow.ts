namespace egret3d {
    /**
     * 灯光的阴影。
     */
    export class LightShadow implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(light: BaseLight) {
            return new LightShadow(light);
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public radius: number = 0.5;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: -0.01, maximum: 0.01, step: 0.0001 })
        public bias: number = 0.01;
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
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public size: number = 10.0;
        /**
         * @private
         */
        public readonly matrix: Matrix4 = Matrix4.create();
        /**
         * @private
         */
        public readonly renderTarget: RenderTexture = RenderTexture.create({ width: 512, height: 512 });
        /**
         * @private
         */
        public onUpdate: ((face: uint) => void) | null = null;

        private _textureSize: uint = 512;
        private readonly _light: BaseLight = null!;
        /**
         * 禁止实例化。
         */
        private constructor(light: BaseLight) {
            this._light = light;
        }

        public serialize() {
            return [this.radius, this.bias, this._textureSize, this.near, this.far, this.size];
        }

        public deserialize(data: ReadonlyArray<number>) {
            this.radius = data[0];
            this.bias = data[1];
            this._textureSize = data[2];
            this.near = data[3];
            this.far = data[4];
            this.size = data[5];

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.UINT)
        public get textureSize(): uint {
            return this._textureSize;
        }
        public set textureSize(value: uint) {
            value = Math.min(value, renderState.maxTextureSize);
            if (this._textureSize === value) {
                return;
            }

            if (this._light.constructor === DirectionalLight) {
                this.renderTarget.uploadTexture(value * 4.0, value * 2.0);
            }
            else {
                this.renderTarget.uploadTexture(value, value);
            }

            this._textureSize = value;
        }
    }
}