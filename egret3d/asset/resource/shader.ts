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
        // public renderQueue: RenderQueue = RenderQueue.Geometry;
        /**
         * 
         */
        // public readonly defaultValue: { [key: string]: { type: string, value?: any, min?: number, max?: number } } = {};

        public readonly vertShader: ShaderInfo = {} as any;//TODO
        public readonly fragShader: ShaderInfo = {} as any;//TODO

        setVertShader(name: string, src: string) {
            this.vertShader.name = name;
            this.vertShader.src = src;
        }
        setFragShader(name: string, src: string) {
            this.fragShader.name = name;
            this.fragShader.src = src;
        }

        /**
         * TODO 应补全接口和枚举。
         * 
         */
        $parse(json: any) {

        }

        public dispose() {
            if (this._isBuiltin) {
                return;
            }
        }
        /**
         * @inheritDoc
         */
        public caclByteLength() {
            return 0;
        }
    }
}