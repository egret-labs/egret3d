namespace egret3d.postprocess {
    export class FXAAPostProcess extends egret3d.CameraPostprocessing {
        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            egret3d.DefaultMaterials.FXAA.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, egret3d.DefaultMaterials.FXAA);
        }
    }
}