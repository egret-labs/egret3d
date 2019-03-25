namespace egret3d {
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    @paper.abstract
    export abstract class CameraPostprocessing extends paper.BaseComponent {
        protected readonly _renderState: egret3d.RenderState = paper.GameObject.globalGameObject.getComponent(egret3d.RenderState)!;
        public abstract onRender(camera: Camera): void;

        protected renderPostprocessTarget(camera: Camera, material?: Material, renderTarget?: RenderTexture) {
            this._renderState.render(camera, material, renderTarget ? renderTarget : camera.postprocessingRenderTarget);
        }

        public blit(src: BaseTexture, material: Material | null = null, dest: RenderTexture | null = null, bufferMask: gltf.BufferMask | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }
            const camerasAndLights = cameraAndLightCollecter;
            const saveCamera = camerasAndLights.currentCamera!; // TODO
            //
            const camera = cameraAndLightCollecter.postprocessingCamera;
            renderState.updateRenderTarget(dest);
            renderState.updateViewport(camera.viewport);
            if (bufferMask === null || bufferMask !== gltf.BufferMask.None) {
                renderState.clearBuffer(bufferMask || saveCamera.bufferMask, saveCamera.backgroundColor);
            }
            //
            camerasAndLights.currentCamera = camera; // TODO
            renderState.draw(drawCallCollecter.postprocessing, material);
            camerasAndLights.currentCamera = saveCamera; // TODO
        }
    }
}
