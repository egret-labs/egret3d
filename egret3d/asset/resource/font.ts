namespace egret3d {

    /**
     * 
     */
    export class Charinfo {
        x: number; // uv
        y: number;
        w: number; // uv长度
        h: number;
        xSize: number; // 像素
        ySize: number;
        xOffset: number; // 偏移
        yOffset: number; // 相对基线的偏移
        xAddvance: number; // 字符宽度
        static caclByteLength(): number {
            return 36;
        }
    }

    /**
     * font asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 字体资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Font extends paper.Asset {

        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        dispose() {
            // if (this.texture) {
            //     this.texture.unuse(true);
            // }
            delete this.cmap;
        }

        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        caclByteLength(): number {
            let total = 0;
            for (let k in this.cmap) {
                total += utils.caclStringByteLength(k);
                total += Charinfo.caclByteLength();
            }
            return total;
        }

        private _texture: Texture;

        /**
         * font texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 字体材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get texture() {
            return this._texture;
        }

        /**
         * font texture
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 字体材质。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public set texture(value: Texture) {
            // if (this._texture != null) {
            //     this._texture.unuse();
            // }
            this._texture = value;
            // this._texture.use();
        }

        /**
         * 
         * 字体信息map
         */
        cmap: { [id: string]: Charinfo };

        /**
         * 
         */
        fontname: string;

        /**
         * 
         * 像素尺寸
         */
        pointSize: number;

        /**
         * 
         * 间隔
         */
        padding: number;

        /**
         * 
         * 行高
         */
        lineHeight: number;

        /**
         * 
         * 基线
         */
        baseline: number;

        /**
         * 
         */
        atlasWidth: number;

        /**
         * 
         */
        atlasHeight: number;

        /**
         * 
         */
        $parse(jsonStr: string) {
            let d1 = new Date().valueOf();
            let json = JSON.parse(jsonStr);

            // parse font info
            var font = <any[]>json["font"];
            this.fontname = <string>font[0];
            var picName = <string>font[1];
            this.texture = paper.Asset.find<Texture>(utils.getPathByUrl(this.url) + "/" + picName);
            this.pointSize = <number>font[2];
            this.padding = <number>font[3];
            this.lineHeight = <number>font[4];
            this.baseline = <number>font[5];
            this.atlasWidth = <number>font[6];
            this.atlasHeight = <number>font[7];

            // parse char map
            this.cmap = {};
            let map = json["map"];
            for (var c in map) {
                let finfo = new Charinfo(); // ness
                this.cmap[c] = finfo;
                finfo.x = (map[c][0] - 0.5) / this.atlasWidth;
                finfo.y = (map[c][1] - 0.5) / this.atlasHeight;
                finfo.w = (map[c][2] + 1.0) / this.atlasWidth;
                finfo.h = (map[c][3] + 1.0) / this.atlasHeight;
                finfo.xSize = map[c][2];
                finfo.ySize = map[c][3];
                finfo.xOffset = map[c][4];
                finfo.yOffset = map[c][5];
                finfo.xAddvance = map[c][6];
            }
            map = null;
            json = null;

            let d2 = new Date().valueOf();
            let n = d2 - d1;
        }

    }
}