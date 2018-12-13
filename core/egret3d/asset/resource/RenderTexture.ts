namespace egret3d {
    /**
     * 渲染贴图。
     */
    export class RenderTexture extends BaseTexture {
        public static create(parameters: CreateTextureParameters): RenderTexture;
        public static create(source: GLTF, name: string): RenderTexture;
        public static create(parametersOrSource: CreateTextureParameters | GLTF, name?: string) {
            let config: GLTF;
            let texture: RenderTexture;

            if (parametersOrSource.hasOwnProperty("asset")) {
                config = parametersOrSource as GLTF;
            }
            else {
                config = this._createConfig(parametersOrSource as CreateTextureParameters);
                name = (parametersOrSource as CreateTextureParameters).name || "";
            }

            // Retargeting.
            texture = new egret3d.RenderTexture(config, name!);
            texture.initialize();

            return texture;
        }

        protected _mipmap: boolean = false;

        public initialize() {
            super.initialize();

            const extension = this._gltfTexture!.extensions.paper!;
            this._mipmap = extension.mipmap!;
        }

        public activateRenderTexture(index?: uint): void { }
        public generateMipmap(): boolean { return false; }
    }
}