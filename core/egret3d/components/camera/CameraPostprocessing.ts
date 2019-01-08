namespace egret3d {
    /**
     * @beta 这是一个试验性质的 API，有可能会被删除或修改。
     */
    export abstract class CameraPostprocessing extends paper.BaseComponent {
        public abstract render(camera: Camera): void;

        public blit(src: BaseTexture, material: Material | null = null, dest: RenderTexture | null = null) {
            if (!material) {
                material = DefaultMaterials.COPY;
                material.setTexture(src);
            }

            const camera = cameraAndLightCollecter.postprocessingCamera;
            renderState.updateViewport(camera, dest);
            renderState.clearBuffer(camera.bufferMask, camera.backgroundColor);
            //
            const saveCamera = Camera.current;
            Camera.current = camera;
            renderState.draw(drawCallCollecter.postprocessing, material);
            Camera.current = saveCamera;
        }
    }
}
