namespace components {
    export class ThermalVisionPostProcess2 extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0, maximum: 5 })
        public hotLight: number = 3.0;
        private _material: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/thermalVision2/thermalVision2.shader.json"));
        private _rnd:egret3d.Vector2 = egret3d.Vector2.create();
        public initialize() {
            super.initialize();

            this._material.setTexture("heatLookupMap", RES.getRes("textures/HeatLookup.png"));
            this._material.setTexture("noiseMap", RES.getRes("textures/HeatNoise.png"));
        }

        public uninitialize() {
            super.uninitialize();
        }

        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            //
            this._rnd.set(Math.random(), Math.random());
            const material = this._material;
            material.setVector2("rnd", this._rnd);
            material.setFloat("hotLight", this.hotLight);
            material.setTexture(camera.postprocessingRenderTarget);
            this.blit(camera.postprocessingRenderTarget, material);
        }
    }
}