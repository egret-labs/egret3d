namespace egret3d.postprocess {
    export class FXAAPostprocess extends egret3d.CameraPostprocessing {
        private _renderTexture: egret3d.RenderTexture | null = null;//TODO

        public initialize() {
            super.initialize();
            this._renderTexture = egret3d.RenderTexture.create({ width: stage.viewport.w, height: stage.viewport.h, format: gltf.TextureFormat.RGB/*TODO*/ }).
                setLiner(egret3d.FilterMode.Bilinear).
                setRepeat(false).retain();
        }
        public uninitialize() {
            super.uninitialize();
            if (this._renderTexture) {
                this._renderTexture.release();
            }

            this._renderTexture = null;
        }
        public onRender(camera: egret3d.Camera) {
            const renderTexture = this._renderTexture!;
            renderState.updateRenderTarget(renderTexture);
            renderState.clearBuffer(gltf.BufferMask.All, camera.backgroundColor);
            this.renderPostprocessTarget(camera, undefined, renderTexture);
            egret3d.DefaultMaterials.FXAA.setTexture(renderTexture);
            this.blit(renderTexture, egret3d.DefaultMaterials.FXAA);
        }
    }
}