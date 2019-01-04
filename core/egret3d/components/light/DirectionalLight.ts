namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {

        public initialize() {
            super.initialize();

            // this.shadow.renderTarget = new GlRenderTarget("DirectionalLightShadow", this.shadow.size, this.shadow.size, true); // TODO
            this.shadow.update = this._updateShadow;
        }

        private _updateShadow() {
            const shadow = this.shadow;
            const shadowMatrix = shadow.matrix;
            const shadowCamera = shadow.camera;
            const transform = this.gameObject.transform;
            if (!shadow.renderTarget) {
                const shadowSize = Math.min(shadow.size, renderState.maxTextureSize);
                shadow.renderTarget = RenderTexture.create(
                    {
                        width: shadowSize, height: shadowSize,
                        minFilter: gltf.TextureFilter.Nearest, magFilter: gltf.TextureFilter.Nearest,
                        format: gltf.TextureFormat.RGBA
                    }
                );
            }
            //
            shadowCamera.worldToCameraMatrix = transform.worldToLocalMatrix;
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(shadowCamera.fov, 0.5, 500, 10.0, 0.0, shadowCamera.aspect, stage.matchFactor).release();
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            shadowMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );

            shadowMatrix.multiply(shadowCamera.worldToClipMatrix);

            //生成阴影贴图
        }

        // private _updateShadow(light: DirectionalLight, shadow: LightShadow) {
        // shadow.camera.opvalue = 0.0; // Orthographic camera.
        // shadow.camera.renderTarget = shadow.renderTarget;
        // // shadow.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);

        // this._updateShadowMatrix(camera);
        // }
    }
}