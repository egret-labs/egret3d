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
            renderTexture.initialize(name, config!, null);

            return renderTexture;
        }

        protected _bufferDirty: boolean = true;
        /**
         * 
         * @param index 
         */
        public activateTexture(index?: uint): this {
            return this;
        }
        /**
         * 
         * @param source 
         */
        public uploadTexture(width: uint, height: uint): this {
            width = Math.min(width, renderState.maxTextureSize);
            height = Math.min(height, renderState.maxTextureSize);

            this._sourceDirty = true;
            this._bufferDirty = true;
            this._levels = 0;
            this._gltfTexture.extensions.paper.width = width;
            this._gltfTexture.extensions.paper.height = height;

            return this;
        }

        public generateMipmap(): boolean { return false; }
    }
}