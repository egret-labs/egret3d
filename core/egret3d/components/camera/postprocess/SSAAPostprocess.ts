namespace egret3d.postprocess {
    // Sample patterns reference: https://msdn.microsoft.com/en-us/library/windows/desktop/ff476218%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
    const JitterVectors = [
        [
            [0, 0]
        ],
        [
            [4, 4], [- 4, - 4]
        ],
        [
            [- 2, - 6], [6, - 2], [- 6, 2], [2, 6]
        ],
        [
            [1, - 3], [- 1, 3], [5, 1], [- 3, - 5],
            [- 5, 5], [- 7, - 1], [3, 7], [7, - 7]
        ],
        [
            [1, 1], [- 1, - 3], [- 3, 2], [4, - 1],
            [- 5, - 2], [2, 5], [5, 3], [3, - 5],
            [- 2, 6], [0, - 7], [- 4, - 6], [- 6, 4],
            [- 8, 0], [7, - 4], [6, 7], [- 7, - 8]
        ],
        [
            [- 4, - 7], [- 7, - 5], [- 3, - 5], [- 5, - 4],
            [- 1, - 4], [- 2, - 2], [- 6, - 1], [- 4, 0],
            [- 7, 1], [- 1, 2], [- 6, 3], [- 3, 3],
            [- 7, 6], [- 3, 6], [- 5, 7], [- 1, 7],
            [5, - 7], [1, - 6], [6, - 5], [4, - 4],
            [2, - 3], [7, - 2], [1, - 1], [4, - 1],
            [2, 1], [6, 2], [0, 4], [4, 4],
            [2, 5], [7, 5], [5, 6], [3, 7]
        ]
    ];
    const roundingRange = 1 / 32;
    export class SSAAPostprocess extends egret3d.CameraPostprocessing {
        @paper.editor.property(paper.editor.EditType.UINT, { minimum: 0, maximum: 5, step: 1 })
        public sampleLevel: number = 2;
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public unbiased: boolean = false;
        private readonly _subViewport: egret3d.Rectangle = egret3d.Rectangle.create(0, 0, 1, 1);
        private readonly _copyMaterial: egret3d.Material = egret3d.Material.create(egret3d.DefaultShaders.COPY);
        private readonly _clearColor: egret3d.Color = egret3d.Color.create(0, 0, 0, 0);
        private readonly _sampleRenderTarget: egret3d.RenderTexture = egret3d.RenderTexture.create({
            width: egret3d.stage.viewport.w, height: egret3d.stage.viewport.h,
            format: gltf.TextureFormat.RGBA,
            sampler: {
                minFilter: gltf.TextureFilter.Linear, magFilter: gltf.TextureFilter.Linear,
            }
        });
        private readonly _finalSampleRenderTarget: egret3d.RenderTexture = egret3d.RenderTexture.create({
            width: egret3d.stage.viewport.w, height: egret3d.stage.viewport.h,
            format: gltf.TextureFormat.RGB,//TODO
            sampler: {
                minFilter: gltf.TextureFilter.Linear, magFilter: gltf.TextureFilter.Linear,
            }
        });
        private _onStageResize(): void {
            const { w, h } = egret3d.stage.viewport;
            const sampleRenderTarget = this._sampleRenderTarget;
            if (sampleRenderTarget) {
                sampleRenderTarget.setSize(w, h);
            }
            const finalSampleRenderTarget = this._finalSampleRenderTarget;
            if (finalSampleRenderTarget) {
                finalSampleRenderTarget.setSize(w, h);
            }
        }
        public initialize(): void {
            super.initialize();

            egret3d.stage.onScreenResize.add(this._onStageResize, this);
            this._copyMaterial.setBlend(egret3d.BlendMode.Additive_PreMultiply, egret3d.RenderQueue.Transparent);
            this._copyMaterial.setDepth(false, false);
            this._copyMaterial.addDefine(egret3d.ShaderDefine.PREMULTIPLIED_ALPHA);
        }
        public uninitialize(): void {
            super.uninitialize();

            egret3d.stage.onScreenResize.remove(this._onStageResize, this);
        }
        public onRender(camera: egret3d.Camera) {
            const renderState = this._renderState;
            const unbiased = this.unbiased;
            const copyMaterial = this._copyMaterial;
            const clearColor = this._clearColor;
            const sampleRenderTarget = this._sampleRenderTarget;
            const finalSampleRenderTarget = this._finalSampleRenderTarget;
            const subViewport = this._subViewport;
            const jitterOffsets = JitterVectors[Math.max(0, Math.min(this.sampleLevel, 5))];
            const baseSampleWeight = 1.0 / jitterOffsets.length;
            const { w, h } = egret3d.stage.viewport;
            copyMaterial.setTexture(sampleRenderTarget);
            for (let i = 0, l = jitterOffsets.length; i < l; i++) {
                const offset = jitterOffsets[i];
                camera.subViewport = subViewport.set(offset[0] * 0.0625 / w, offset[1] * 0.0625 / h, 1, 1);

                let sampleWeight = baseSampleWeight;
                if (unbiased) {
                    const uniformCenteredDistribution = (- 0.5 + (i + 0.5) / l);
                    sampleWeight += roundingRange * uniformCenteredDistribution;
                }

                renderState.renderTarget = sampleRenderTarget;
                renderState.clearColor = clearColor;
                renderState.clearBuffer(gltf.BufferMask.All);
                renderState.render(camera, undefined, sampleRenderTarget);
                renderState.renderTarget = finalSampleRenderTarget;

                if (i === 0) {
                    renderState.clearColor = clearColor;
                    renderState.clearBuffer(gltf.BufferMask.All);
                }
                copyMaterial.setOpacity(sampleWeight);
                this.blit(sampleRenderTarget, copyMaterial, finalSampleRenderTarget, gltf.BufferMask.None);
            }


            this.blit(finalSampleRenderTarget);

            camera.subViewport.set(0, 0, 1, 1);
        }
    }
}