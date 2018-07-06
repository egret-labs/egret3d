namespace egret3d {

    export type ShaderInfo = { name: string, src: string };

    /**
     * shader asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 着色器资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Shader extends paper.Asset {
        private static readonly _vertShaderInfoMap: { [key: string]: ShaderInfo } = {};
        private static readonly _fragShaderInfoMap: { [key: string]: ShaderInfo } = {};

        /**
         *  
         */
        public static registerVertShader(name: string, src: string): ShaderInfo {
            let info = {
                name: name,
                src: src
            };
            this._vertShaderInfoMap[name] = info;
            return info;
        }

        /**
         *  
         */
        public static registerFragShader(name: string, src: string): ShaderInfo {
            let info = {
                name: name,
                src: src
            };
            this._fragShaderInfoMap[name] = info;
            return info;
        }

        /**
         * 渲染队列 
         */
        public renderQueue: RenderQueue = RenderQueue.Geometry;

        public readonly passes: { [id: string]: egret3d.DrawPass[] } = {};

        /**
         * 
         */
        public readonly defaultValue: { [key: string]: { type: string, value?: any, min?: number, max?: number } } = {};

        /**
         * TODO 应补全接口和枚举。
         * 
         */
        $parse(json: any) {
            this._parseProperties(json.properties);

            if (json.layer) {
                let layer = json.layer;
                if (layer === "transparent") {
                    this.renderQueue = RenderQueue.Transparent;
                }
                else if (layer === "overlay") {
                    this.renderQueue = RenderQueue.Overlay;
                }
                else if (layer === "common") {
                    this.renderQueue = RenderQueue.Geometry;
                }
            }

            // if (json.queue) {
            //     this.queue = json.queue;
            // }

            const passes = json.passes;
            for (const k in passes) {
                let pass = passes[k];

                if (k === "base" || k === "lightmap" || k === "skin" || k === "quad") {
                }
                else if (k.indexOf("base_") === 0 || k.indexOf("lightmap_") === 0 || k.indexOf("skin_") === 0) {
                }
                else {
                    continue;
                }

                this.passes[k] = [];
                for (let i = 0; i < pass.length; i++) {
                    this.passes[k].push(this._parsePass(pass[i]));
                }
            }

            if (!this.passes["base"]) {
                throw new Error("do not have base pass group.");
            }
        }

        private _parseProperties(properties: any) {
            for (const k in properties) {
                const property = properties[k] as string;
                let words = property.match(RegexpUtil.floatRegexp);

                if (!words) words = property.match(RegexpUtil.rangeRegexp);
                if (!words) words = property.match(RegexpUtil.vectorRegexp);
                if (!words) words = property.match(RegexpUtil.textureRegexp);
                if (!words) {
                    console.error("Asset (" + this.url + ") property error! info:\n" + property);
                    return;
                }

                if (words.length >= 4) {
                    const key = words[1];
                    // let showName = words[2];
                    const type = words[3].toLowerCase();

                    switch (type) {
                        case "float":
                            this.defaultValue[key] = { type: type, value: parseFloat(words[4]) };
                            break;

                        case "range":
                            this.defaultValue[key] = { type: type, min: parseFloat(words[4]), max: parseFloat(words[5]), value: parseFloat(words[6]) };
                            break;

                        case "vector":
                        case "color":
                            let _vector = new egret3d.Vector4(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]), parseFloat(words[7]));
                            this.defaultValue[key] = { type: type, value: _vector };
                            break;

                        case "texture":
                            this.defaultValue[key] = { type: type, value: paper.Asset.find<Texture>(words[4]) };
                            break;

                        default:
                            console.log("Asset (" + this.url + ") property error! unknown type : " + type);
                            break;
                    }
                }
            }
        }
        /**
         * TODO 应补全接口和枚举。
         */
        private _parsePass(json: any): DrawPass {
            const vs = Shader._vertShaderInfoMap[json["vs"]];
            const fs = Shader._fragShaderInfoMap[json["fs"]];

            if (!vs) {
                console.error("vertex shader " + json["vs"] + " not found!");
            }

            if (!fs) {
                console.error("fragment shader " + json["fs"] + " not found!");
            }

            let blendmode = BlendModeEnum.Close;
            const pass = new DrawPass(vs, fs);
            pass.state_ztest = true;

            switch (json["showface"]) {
                case "cw":
                    pass.state_showface = ShowFaceStateEnum.CW;
                    break;
                case "ccw":
                    pass.state_showface = ShowFaceStateEnum.CCW;
                    break;
                default:
                    pass.state_showface = ShowFaceStateEnum.ALL;
                    break;
            }

            switch (json["zwrite"]) {
                case "off":
                    pass.state_zwrite = false;
                    break;

                case "on":
                default:
                    pass.state_zwrite = true;
                    break;
            }

            switch (json["ztest"]) {
                case "greater":
                    pass.state_ztest_method = WebGLKit.GREATER;
                    break;

                case "gequal":
                    pass.state_ztest_method = WebGLKit.GEQUAL;
                    break;

                case "less":
                    pass.state_ztest_method = WebGLKit.LESS;
                    break;

                case "equal":
                    pass.state_ztest_method = WebGLKit.EQUAL;
                    break;

                case "notequal":
                    pass.state_ztest_method = WebGLKit.NOTEQUAL;
                    break;

                case "always":
                case "off":
                    pass.state_ztest = false;
                    break;

                case "never":
                    pass.state_ztest_method = WebGLKit.NEVER;
                    break;

                case "lequal":
                default:
                    pass.state_ztest_method = WebGLKit.LEQUAL;
                    break;
            }

            switch (json["blendmode"]) {
                case "add":
                    blendmode = BlendModeEnum.Add;
                    break;

                case "addpremult":
                    blendmode = BlendModeEnum.Add_PreMultiply;
                    break;

                case "blend":
                    blendmode = BlendModeEnum.Blend;
                    break;

                case "blendpremult":
                    blendmode = BlendModeEnum.Blend_PreMultiply;
                    break;
            }

            pass.setAlphaBlend(blendmode);

            if (this.renderQueue === RenderQueue.Overlay) {
                pass.state_ztest = true;
                pass.state_zwrite = true;
                pass.state_ztest_method = WebGLKit.ALWAYS;
            }

            return pass;
        }

        /**
         * @inheritDoc
         */
        public dispose() {
            for (const k in this.passes) {
                delete this.passes[k];
            }

            for (const k in this.defaultValue) {
                delete this.defaultValue[k];
            }
        }

        /**
         * @inheritDoc
         */
        public caclByteLength() {
            return 0;
        }
        /**
         * @internal
         */
        public clone(){
            let shader = new Shader(this.url);
            shader.renderQueue = this.renderQueue;
            for(let key in this.passes){
                const orginPasss = this.passes[key];
                shader.passes[key] = [];
                for(let i = 0, l = orginPasss.length; i < l; i++){
                    const orginPass = orginPasss[i];
                    let drawPass = new DrawPass(orginPass.vShaderInfo, orginPass.fShaderInfo);
                    drawPass.state_showface = orginPass.state_showface;
                    drawPass.state_zwrite = orginPass.state_zwrite;
                    drawPass.state_ztest = orginPass.state_ztest;
                    drawPass.state_blend = orginPass.state_blend;
                    drawPass.state_blendEquation = orginPass.state_blendEquation;
                    drawPass.state_blendSrcRGB = orginPass.state_blendSrcRGB;
                    drawPass.state_blendDestRGB = orginPass.state_blendDestRGB;
                    drawPass.state_blendSrcAlpha = orginPass.state_blendSrcAlpha;
                    drawPass.state_blendDestALpha = orginPass.state_blendDestALpha;
                    shader.passes[key].push(drawPass);
                }                
            }

            for(let key in this.defaultValue){
                shader.defaultValue[key] = this.defaultValue[key];
            }

            return shader;
        }
    }
}