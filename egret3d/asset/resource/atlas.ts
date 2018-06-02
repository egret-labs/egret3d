namespace egret3d {
    /**
     * atlas asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 图集资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Atlas extends paper.Asset {

        /**
         * texture pixel width
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 纹理像素宽度。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public texturewidth: number = 0;

        /**
         * texture pixel height
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 纹理像素高度。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public textureheight: number = 0;

        /**
         * sprite map
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 精灵字典，key为精灵名称。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        private readonly _sprites: { [key: string]: Sprite } = {};

        private _texture: Texture | null = null;

        /**
         * 
         */
        public $parse(json: string) {
            var name: string = json["t"]; // name
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = <any[]>json["s"];

            this.texture = paper.Asset.find<Texture>(utils.getPathByUrl(this.url) + "/" + name);
            if (!this.texture) {
                console.log("atlas texture not found");
            }

            for (var i in s) {
                var ss = <any[]>s[i];
                var spriteName = ss[0];
                var r: Sprite = new Sprite(this.name + "_" + spriteName); // 用Atlas的名字的Sprite的名字拼接
                // - 引用计数
                if (this.texture) {
                    r.texture = this.texture;
                }
                r.rect.x = ss[1];
                r.rect.y = ss[1];
                r.rect.w = ss[1];
                r.rect.h = ss[1];
                r.border.t = 0;
                r.border.b = 0;
                r.border.l = 0;
                r.border.r = 0;
                r.atlas = this.hashCode.toString();
                this._sprites[spriteName] = r;
            }
        }

        /**
         * @inheritDoc
         */
        public dispose() {
            for (const k in this._sprites) {
                delete this._sprites[k];
            }

            this._texture = null;
        }

        /**
         * @inheritDoc
         */
        public caclByteLength() {
            let total = 0;
            for (let k in this._sprites) {
                total += this._sprites[k].caclByteLength();
                total += utils.caclStringByteLength(k);
            }
            return total;
        }

        public get sprites(): Readonly<{ [key: string]: Sprite }> {
            return this._sprites;
        }

        /**
         * atlas texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 图集材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get texture() {
            return this._texture;
        }
        public set texture(value: Texture | null) {
            // if (this._texture != null) {
            //     this._texture.unuse();
            // }
            this._texture = value;
            // this._texture.use();
        }
    }
}