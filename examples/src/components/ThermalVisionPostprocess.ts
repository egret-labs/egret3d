namespace components {
    export class ThermalVisionPostprocess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 1 })
        public thermaValue: number = 1.0;
        private _material: egret3d.Material | null = null;
        public initialize() {
            super.initialize();

            this._material = egret3d.Material.create(RES.getRes("shaders/thermalVision/thermalVision.shader.json")).retain();
        }

        public uninitialize() {
            super.uninitialize();
            if(this._material){
                this._material.release();
            }
            this._material = null;
        }

        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            //
            const material = this._material!;
            material.setFloat("thermaValue", this.thermaValue);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        }
    }
}