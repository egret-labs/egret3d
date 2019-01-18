namespace components {
    export class ThermaVisionPostProcess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 1 })
        public thermaValue: number = 0.5;
        private _material: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/thermaVision/thermaVision.shader.json"));
        public initialize() {
            super.initialize();
        }

        public uninitialize() {
            super.uninitialize();
        }

        public onRender(camera: egret3d.Camera) {
            
            //
            const material = this._material;
            material.setFloat("thermaValue", this.thermaValue);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        }
    }
}