namespace components {
    export class ThermalVisionPostprocess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 1 })
        public thermaValue: number = 1.0;
        private _material: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/thermalVision/thermalVision.shader.json"));
        public initialize() {
            super.initialize();
        }

        public uninitialize() {
            super.uninitialize();
        }

        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            //
            const material = this._material;
            material.setFloat("thermaValue", this.thermaValue);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        }
    }
}