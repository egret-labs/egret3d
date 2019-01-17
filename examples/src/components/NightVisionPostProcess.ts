namespace components {
    export class NightVisionPostProcess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 1 })
        public fadeFX: number = 1.0;
        private _matrix9: number[] = [2, -2, -2, 1.95, 0.04, -1.6, 2, -2, -2, -2, 0.1, -2];
        private _material: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/nightVision/nightVision.shader.json"));
        private _time: number = 0.0;
        public initialize() {
            super.initialize();

            this._material.setFloatv("matrix9[0]", this._matrix9);
        }

        public uninitialize() {
            super.uninitialize();
        }

        public onRender(camera: egret3d.Camera) {
            this._time += paper.clock.deltaTime;
            if (this._time > 100) {
                this._time = 0.0;
            }
            //
            const material = this._material;
            material.setFloat("fadeFX", this.fadeFX);
            material.setFloat("time", this._time);
            material.setTexture(camera.postprocessingRenderTarget);

            camera.context.blit(camera.postprocessingRenderTarget, material);
        }
    }
}