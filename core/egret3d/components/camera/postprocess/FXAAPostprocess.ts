namespace egret3d.postprocess {
    export class FXAAPostprocess extends egret3d.CameraPostprocessing {
        public onRender(camera: egret3d.Camera) {
            renderState.updateRenderTarget(camera.postprocessingRenderTarget);
            renderState.clearBuffer(gltf.BufferMask.All, camera.backgroundColor);
            this.renderPostprocessTarget(camera);
            egret3d.DefaultMaterials.FXAA.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, egret3d.DefaultMaterials.FXAA, null, gltf.BufferMask.None);
        }
    }
}