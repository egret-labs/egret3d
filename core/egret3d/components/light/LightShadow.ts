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
         * 该阴影的边缘模糊。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public radius: number = 1.0;
        /**
         * 该阴影的贴图偏差。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: -0.02, maximum: 0.02, step: 0.0001 })
        public bias: number = 0.0; // TODO
        /**
         * 产生该阴影的灯光位置到近裁剪面距离。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: 9999 })
        public near: number = 0.5;
        /**
         * 产生该阴影的灯光位置到远裁剪面距离。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.02, maximum: 10000 })
        public far: number = 500.0;
        /**
         * 该阴影的范围。（仅用于平行光产生的阴影）
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public size: number = 10.0;

        private _mapSize: uint = 512;
        /**
         * @internal
         */
        public readonly _matrix: Matrix4 = Matrix4.create();
        /**
         * @internal
         */
        public readonly _renderTarget: RenderTexture = RenderTexture.create({ width: 512, height: 512 });
        private readonly _light: BaseLight = null!;
        /**
         * @internal
         */
        public _onUpdate: ((face: uint) => void) | null = null;

        private constructor(light: BaseLight) {
            this._light = light;
        }

        public serialize() {
            return [this.radius, this.bias, this._mapSize, this.near, this.far, this.size];
        }

        public deserialize(data: ReadonlyArray<number>) {
            this.radius = data[0];
            this.bias = data[1];
            this._mapSize = data[2];
            this.near = data[3];
            this.far = data[4];
            this.size = data[5];

            return this;
        }
        /**
         * 该阴影的贴图尺寸。
         */
        @paper.editor.property(paper.editor.EditType.UINT)
        public get mapSize(): uint {
            return this._mapSize;
        }
        public set mapSize(value: uint) {
            value = Math.min(value, renderState.maxTextureSize);
            if (this._mapSize === value) {
                return;
            }

            if (this._light.constructor === PointLight) {
                this._renderTarget.uploadTexture(value * 4.0, value * 2.0);
            }
            else {
                this._renderTarget.uploadTexture(value, value);
            }

            this._mapSize = value;
        }
    }
}