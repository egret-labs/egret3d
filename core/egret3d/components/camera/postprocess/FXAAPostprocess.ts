namespace egret3d.postprocess {
    export class FXAAPostprocess extends egret3d.CameraPostprocessing {
        private _renderTexture: egret3d.RenderTexture | null = null;//TODO
        private _onStageResize(): void {
            const { w, h } = egret3d.stage.viewport;
            const renderTexture = this._renderTexture;
            if (renderTexture) {
                renderTexture.uploadTexture(w, h);
            }
        }
        public initialize() {
            super.initialize();
            this._renderTexture = egret3d.RenderTexture.create({ width: stage.viewport.w, height: stage.viewport.h, format: gltf.TextureFormat.RGB/*TODO*/ }).
                setLiner(egret3d.FilterMode.Bilinear).
                setRepeat(false).retain();
            
            egret3d.stage.onScreenResize.add(this._onStageResize, this);
        }
        public uninitialize() {
            super.uninitialize();
            
            egret3d.stage.onScreenResize.remove(this._onStageResize, this);
            if (this._renderTexture) {
                this._renderTexture.release();
            }

            this._renderTexture = null;
        }
        public onRender(camera: egret3d.Camera) {
            const renderTexture = this._renderTexture!;
            renderState.renderTarget = renderTexture;
            renderState.clearColor = camera.backgroundColor;
            renderState.clearBuffer(gltf.BufferMask.All);
            this.renderPostprocessTarget(camera, undefined, renderTexture);
            egret3d.DefaultMaterials.FXAA.setTexture(renderTexture);
            this.blit(renderTexture, egret3d.DefaultMaterials.FXAA);
        }
    }
}