namespace egret3d {
    /**
     * 渲染纹理。
     */
    export class RenderTexture extends BaseTexture {
        /**
         * 
         * @param parameters 
         */
        public static create(parameters: CreateTextureParameters): RenderTexture;
        /**
         * @private
         */
        public static create(name: string, config: GLTF): RenderTexture;
        public static create(parametersOrName: CreateTextureParameters | string, config?: GLTF) {
            let name: string;
            let renderTexture: RenderTexture;

            if (typeof parametersOrName === "string") {
                name = parametersOrName;
            }
            else {
                config = this._createConfig(parametersOrName as CreateTextureParameters);
                name = (parametersOrName as CreateTextureParameters).name || "";
            }

            // Retargeting.
            renderTexture = new egret3d.RenderTexture();
            renderTexture.initialize(name, config!);

            return renderTexture;
        }

        public initialize(name: string, config: GLTF) {
            super.initialize(name, config, null);
        }

        public activateRenderTexture(index?: uint): void { }
        public generateMipmap(): boolean { return false; }
    }
}