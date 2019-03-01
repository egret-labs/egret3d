namespace egret3d {
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    @paper.abstract
    export abstract class CameraPostprocessing extends paper.BaseComponent {
        public abstract onRender(camera: Camera): void;

        public blit(src: BaseTexture, material: Material | null = null, dest: RenderTexture | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }
            const camerasAndLights = cameraAndLightCollecter;
            const saveCamera = camerasAndLights.currentCamera!; // TODO
            //
            const camera = cameraAndLightCollecter.postprocessingCamera;
            renderState.updateRenderTarget(dest);
            renderState.updateViewport(camera.viewport, dest);
            renderState.clearBuffer(saveCamera.bufferMask, saveCamera.backgroundColor);
            //
            camerasAndLights.currentCamera = camera; // TODO
            renderState.draw(drawCallCollecter.postprocessing, material);
            camerasAndLights.currentCamera = saveCamera; // TODO
        }
    }
}
