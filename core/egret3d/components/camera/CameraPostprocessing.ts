namespace egret3d {
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    export abstract class CameraPostprocessing extends paper.BaseComponent {
        public abstract onRender(camera: Camera): void;

        public blit(src: BaseTexture, material: Material | null = null, dest: RenderTexture | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }

            const saveCamera = Camera.current!;
            //
            const camera = cameraAndLightCollecter.postprocessingCamera;
            renderState.updateViewport(camera, dest);
            renderState.clearBuffer(saveCamera.bufferMask, saveCamera.backgroundColor);
            //
            Camera.current = camera;
            renderState.draw(drawCallCollecter.postprocessing, material);
            Camera.current = saveCamera;
        }
    }
}
