namespace components {
    export class NightVisionPostprocess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 1 })
        public fadeFX: number = 1.0;
        private _matrix9: number[] = [2, -2, -2, 1.95, 0.04, -1.6, 2, -2, -2, -2, 0.1, -2];
        private _material: egret3d.Material | null = null;
        private _time: number = 0.0;
        public initialize() {
            super.initialize();
            
            this._material = egret3d.Material.create(RES.getRes("shaders/nightVision/nightVision.shader.json")).retain();
            this._material.setFloatv("matrix9[0]", this._matrix9);
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
            this._time += paper.clock.lastTickDelta;
            if (this._time > 100) {
                this._time = 0.0;
            }
            //
            const material = this._material!;
            material.setFloat("fadeFX", this.fadeFX);
            material.setFloat("time", this._time);
            material.setTexture(camera.postprocessingRenderTarget);

            this.blit(camera.postprocessingRenderTarget, material);
        }
    }
}