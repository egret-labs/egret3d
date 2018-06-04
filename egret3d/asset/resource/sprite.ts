namespace egret3d {

    /**
     * 精灵资源。
     */
    export class Sprite extends paper.Asset {
        // TODO remove - row：图片行数；column:图片列数；index：第几张图片（index从0开始计数）
        public static spriteAnimation(row: number, column: number, index: number, out: Vector4) {
            const width = 1 / column;
            const height = 1 / row;
            const offsetx = width * (index % column);
            const offsety = height * Math.floor(index / column);

            out.x = width;
            out.y = height;
            out.z = offsetx;
            out.w = offsety;
        }
        /**
         * atlas
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 所属图集
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public atlas: string = "";
        /**
         * rect
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 有效区域
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public readonly rect: Rect = new Rect();
        /**
         * border
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 边距
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public readonly border: Border = new Border();

        private _urange: Vector2 | null = null;
        private _vrange: Vector2 | null = null;
        private _texture: Texture | null = null;
        /**
         * @inheritDoc
         */
        public dispose() {
            this.atlas = "";
            // this.rect.clear();
            // this.border.clear();
            this._urange = null;
            this._vrange = null;
            this._texture = null;
        }
        /**
         * @inheritDoc
         */
        public caclByteLength() {
            let total = 0;
            if (this._texture) {
                total += this._texture.caclByteLength();
            }

            return total;
        }
        /**
         * u range
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * uv的u范围
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get urange() {
            if (!this._urange) {
                this._urange = new Vector2();
                if (this._texture) {
                    this._urange.x = this.rect.x / this._texture.glTexture.width;
                    this._urange.y = (this.rect.x + this.rect.w) / this._texture.glTexture.width;
                }
                else {
                    this._urange.x = 0.0;
                    this._urange.y = 1.0;
                }
            }

            return this._urange;
        }
        /**
         * v range
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * uv的v范围
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get vrange() {
            if (!this._vrange) {
                this._vrange = new Vector2();
                if (this._texture) {
                    this._vrange.x = this.rect.y / this._texture.glTexture.height;
                    this._vrange.y = (this.rect.y + this.rect.h) / this._texture.glTexture.height;
                }
                else {
                    this._vrange.x = 0.0;
                    this._vrange.y = 1.0;
                }
            }

            return this._vrange;
        }
        /**
         * current texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前texture
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get texture() {
            return this._texture;
        }
        /**
         * current texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前texture
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public set texture(value: Texture | null) {
            this._urange = null;
            this._vrange = null;
            this._texture = value;
        }
    }
}